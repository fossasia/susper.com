'use strict';

var libmime = require('libmime');
var libqp = require('libqp');
var libbase64 = require('libbase64');
var punycode = require('punycode');
var addressparser = require('addressparser');
var stream = require('stream');
var PassThrough = stream.PassThrough;
var fs = require('fs');
var fetch = require('nodemailer-fetch');
var crypto = require('crypto');
var os = require('os');

module.exports = MimeNode;

/**
 * Creates a new mime tree node. Assumes 'multipart/*' as the content type
 * if it is a branch, anything else counts as leaf. If rootNode is missing from
 * the options, assumes this is the root.
 *
 * @param {String} contentType Define the content type for the node. Can be left blank for attachments (derived from filename)
 * @param {Object} [options] optional options
 * @param {Object} [options.rootNode] root node for this tree
 * @param {Object} [options.parentNode] immediate parent for this node
 * @param {Object} [options.filename] filename for an attachment node
 * @param {String} [options.baseBoundary] shared part of the unique multipart boundary
 * @param {Boolean} [options.keepBcc] If true, do not exclude Bcc from the generated headers
 * @param {String} [options.textEncoding] either 'Q' (the default) or 'B'
 */
function MimeNode(contentType, options) {
    this.nodeCounter = 0;

    options = options || {};

    /**
     * shared part of the unique multipart boundary
     */
    this.baseBoundary = options.baseBoundary || Date.now().toString() + Math.random();
    this.boundaryPrefix = options.boundaryPrefix || '----sinikael';

    this.disableFileAccess = !!options.disableFileAccess;
    this.disableUrlAccess = !!options.disableUrlAccess;

    /**
     * If date headers is missing and current node is the root, this value is used instead
     */
    this.date = new Date();

    /**
     * Root node for current mime tree
     */
    this.rootNode = options.rootNode || this;

    /**
     * If true include Bcc in generated headers (if available)
     */
    this.keepBcc = !!options.keepBcc;

    /**
     * If filename is specified but contentType is not (probably an attachment)
     * detect the content type from filename extension
     */
    if (options.filename) {
        /**
         * Filename for this node. Useful with attachments
         */
        this.filename = options.filename;
        if (!contentType) {
            contentType = libmime.detectMimeType(this.filename.split('.').pop());
        }
    }

    /**
     * Indicates which encoding should be used for header strings: "Q" or "B"
     */
    this.textEncoding = (options.textEncoding || '').toString().trim().charAt(0).toUpperCase();

    /**
     * Immediate parent for this node (or undefined if not set)
     */
    this.parentNode = options.parentNode;

    /**
     * Hostname for default message-id values
     */
    this.hostname = options.hostname;

    /**
     * An array for possible child nodes
     */
    this.childNodes = [];

    /**
     * Used for generating unique boundaries (prepended to the shared base)
     */
    this._nodeId = ++this.rootNode.nodeCounter;

    /**
     * A list of header values for this node in the form of [{key:'', value:''}]
     */
    this._headers = [];

    /**
     * True if the content only uses ASCII printable characters
     * @type {Boolean}
     */
    this._isPlainText = false;

    /**
     * True if the content is plain text but has longer lines than allowed
     * @type {Boolean}
     */
    this._hasLongLines = false;

    /**
     * If set, use instead this value for envelopes instead of generating one
     * @type {Boolean}
     */
    this._envelope = false;

    /**
     * If set then use this value as the stream content instead of building it
     * @type {String|Buffer|Stream}
     */
    this._raw = false;

    /**
     * Additional transform streams that the message will be piped before
     * exposing by createReadStream
     * @type {Array}
     */
    this._transforms = [];

    /**
     * If content type is set (or derived from the filename) add it to headers
     */
    if (contentType) {
        this.setHeader('Content-Type', contentType);
    }
}

/////// PUBLIC METHODS

/**
 * Creates and appends a child node.Arguments provided are passed to MimeNode constructor
 *
 * @param {String} [contentType] Optional content type
 * @param {Object} [options] Optional options object
 * @return {Object} Created node object
 */
MimeNode.prototype.createChild = function (contentType, options) {
    if (!options && typeof contentType === 'object') {
        options = contentType;
        contentType = undefined;
    }
    var node = new MimeNode(contentType, options);
    this.appendChild(node);
    return node;
};

/**
 * Appends an existing node to the mime tree. Removes the node from an existing
 * tree if needed
 *
 * @param {Object} childNode node to be appended
 * @return {Object} Appended node object
 */
MimeNode.prototype.appendChild = function (childNode) {

    if (childNode.rootNode !== this.rootNode) {
        childNode.rootNode = this.rootNode;
        childNode._nodeId = ++this.rootNode.nodeCounter;
    }

    childNode.parentNode = this;

    this.childNodes.push(childNode);
    return childNode;
};

/**
 * Replaces current node with another node
 *
 * @param {Object} node Replacement node
 * @return {Object} Replacement node
 */
MimeNode.prototype.replace = function (node) {
    if (node === this) {
        return this;
    }

    this.parentNode.childNodes.forEach(function (childNode, i) {
        if (childNode === this) {

            node.rootNode = this.rootNode;
            node.parentNode = this.parentNode;
            node._nodeId = this._nodeId;

            this.rootNode = this;
            this.parentNode = undefined;

            node.parentNode.childNodes[i] = node;
        }
    }.bind(this));

    return node;
};

/**
 * Removes current node from the mime tree
 *
 * @return {Object} removed node
 */
MimeNode.prototype.remove = function () {
    if (!this.parentNode) {
        return this;
    }

    for (var i = this.parentNode.childNodes.length - 1; i >= 0; i--) {
        if (this.parentNode.childNodes[i] === this) {
            this.parentNode.childNodes.splice(i, 1);
            this.parentNode = undefined;
            this.rootNode = this;
            return this;
        }
    }
};

/**
 * Sets a header value. If the value for selected key exists, it is overwritten.
 * You can set multiple values as well by using [{key:'', value:''}] or
 * {key: 'value'} as the first argument.
 *
 * @param {String|Array|Object} key Header key or a list of key value pairs
 * @param {String} value Header value
 * @return {Object} current node
 */
MimeNode.prototype.setHeader = function (key, value) {
    var added = false,
        headerValue;

    // Allow setting multiple headers at once
    if (!value && key && typeof key === 'object') {
        // allow {key:'content-type', value: 'text/plain'}
        if (key.key && 'value' in key) {
            this.setHeader(key.key, key.value);
        }
        // allow [{key:'content-type', value: 'text/plain'}]
        else if (Array.isArray(key)) {
            key.forEach(function (i) {
                this.setHeader(i.key, i.value);
            }.bind(this));
        }
        // allow {'content-type': 'text/plain'}
        else {
            Object.keys(key).forEach(function (i) {
                this.setHeader(i, key[i]);
            }.bind(this));
        }
        return this;
    }

    key = this._normalizeHeaderKey(key);

    headerValue = {
        key: key,
        value: value
    };

    // Check if the value exists and overwrite
    for (var i = 0, len = this._headers.length; i < len; i++) {
        if (this._headers[i].key === key) {
            if (!added) {
                // replace the first match
                this._headers[i] = headerValue;
                added = true;
            } else {
                // remove following matches
                this._headers.splice(i, 1);
                i--;
                len--;
            }
        }
    }

    // match not found, append the value
    if (!added) {
        this._headers.push(headerValue);
    }

    return this;
};

/**
 * Adds a header value. If the value for selected key exists, the value is appended
 * as a new field and old one is not touched.
 * You can set multiple values as well by using [{key:'', value:''}] or
 * {key: 'value'} as the first argument.
 *
 * @param {String|Array|Object} key Header key or a list of key value pairs
 * @param {String} value Header value
 * @return {Object} current node
 */
MimeNode.prototype.addHeader = function (key, value) {

    // Allow setting multiple headers at once
    if (!value && key && typeof key === 'object') {
        // allow {key:'content-type', value: 'text/plain'}
        if (key.key && key.value) {
            this.addHeader(key.key, key.value);
        }
        // allow [{key:'content-type', value: 'text/plain'}]
        else if (Array.isArray(key)) {
            key.forEach(function (i) {
                this.addHeader(i.key, i.value);
            }.bind(this));
        }
        // allow {'content-type': 'text/plain'}
        else {
            Object.keys(key).forEach(function (i) {
                this.addHeader(i, key[i]);
            }.bind(this));
        }
        return this;
    } else if (Array.isArray(value)) {
        value.forEach(function (val) {
            this.addHeader(key, val);
        }.bind(this));
        return this;
    }

    this._headers.push({
        key: this._normalizeHeaderKey(key),
        value: value
    });

    return this;
};

/**
 * Retrieves the first mathcing value of a selected key
 *
 * @param {String} key Key to search for
 * @retun {String} Value for the key
 */
MimeNode.prototype.getHeader = function (key) {
    key = this._normalizeHeaderKey(key);
    for (var i = 0, len = this._headers.length; i < len; i++) {
        if (this._headers[i].key === key) {
            return this._headers[i].value;
        }
    }
};

/**
 * Sets body content for current node. If the value is a string, charset is added automatically
 * to Content-Type (if it is text/*). If the value is a Buffer, you need to specify
 * the charset yourself
 *
 * @param (String|Buffer) content Body content
 * @return {Object} current node
 */
MimeNode.prototype.setContent = function (content) {
    var _self = this;
    this.content = content;
    if (typeof this.content.pipe === 'function') {
        // pre-stream handler. might be triggered if a stream is set as content
        // and 'error' fires before anything is done with this stream
        this._contentErrorHandler = function (err) {
            _self.content.removeListener('error', _self._contentErrorHandler);
            _self.content = err;
        };
        this.content.once('error', this._contentErrorHandler);
    } else if (typeof this.content === 'string') {
        this._isPlainText = libmime.isPlainText(this.content);
        if (this._isPlainText && libmime.hasLongerLines(this.content, 76)) {
            // If there are lines longer than 76 symbols/bytes do not use 7bit
            this._hasLongLines = true;
        }
    }
    return this;
};

MimeNode.prototype.build = function (callback) {
    var stream = this.createReadStream();
    var buf = [];
    var buflen = 0;
    var returned = false;

    stream.on('readable', function () {
        var chunk;

        while ((chunk = stream.read()) !== null) {
            buf.push(chunk);
            buflen += chunk.length;
        }
    });

    stream.once('error', function (err) {
        if (returned) {
            return;
        }
        returned = true;

        return callback(err);
    });

    stream.once('end', function (chunk) {
        if (returned) {
            return;
        }
        returned = true;

        if (chunk && chunk.length) {
            buf.push(chunk);
            buflen += chunk.length;
        }
        return callback(null, Buffer.concat(buf, buflen));
    });
};

MimeNode.prototype.getTransferEncoding = function () {
    var transferEncoding = false;
    var contentType = (this.getHeader('Content-Type') || '').toString().toLowerCase().trim();

    if (this.content) {
        transferEncoding = (this.getHeader('Content-Transfer-Encoding') || '').toString().toLowerCase().trim();
        if (!transferEncoding || ['base64', 'quoted-printable'].indexOf(transferEncoding) < 0) {
            if (/^text\//i.test(contentType)) {
                // If there are no special symbols, no need to modify the text
                if (this._isPlainText && !this._hasLongLines) {
                    transferEncoding = '7bit';
                } else if (typeof this.content === 'string' || this.content instanceof Buffer) {
                    // detect preferred encoding for string value
                    transferEncoding = this._getTextEncoding(this.content) === 'Q' ? 'quoted-printable' : 'base64';
                } else {
                    // we can not check content for a stream, so either use preferred encoding or fallback to QP
                    transferEncoding = this.transferEncoding === 'B' ? 'base64' : 'quoted-printable';
                }
            } else if (!/^(multipart|message)\//i.test(contentType)) {
                transferEncoding = transferEncoding || 'base64';
            }
        }
    }
    return transferEncoding;
};

/**
 * Builds the header block for the mime node. Append \r\n\r\n before writing the content
 *
 * @returns {String} Headers
 */
MimeNode.prototype.buildHeaders = function () {
    var _self = this;
    var transferEncoding = this.getTransferEncoding();
    var headers = [];

    if (transferEncoding) {
        this.setHeader('Content-Transfer-Encoding', transferEncoding);
    }

    if (this.filename && !this.getHeader('Content-Disposition')) {
        this.setHeader('Content-Disposition', 'attachment');
    }

    // Ensure mandatory header fields
    if (this.rootNode === this) {
        if (!this.getHeader('Date')) {
            this.setHeader('Date', this.date.toUTCString().replace(/GMT/, '+0000'));
        }

        // ensure that Message-Id is present
        this.messageId();

        if (!this.getHeader('MIME-Version')) {
            this.setHeader('MIME-Version', '1.0');
        }
    }

    this._headers.forEach(function (header) {
        var key = header.key;
        var value = header.value;
        var structured;
        var param;
        var options = {};
        var formattedHeaders = ['From', 'Sender', 'To', 'Cc', 'Bcc', 'Reply-To', 'Date', 'References'];

        if (value && formattedHeaders.indexOf(key) < 0 && typeof value === 'object') {
            Object.keys(value).forEach(function (key) {
                if (key !== 'value') {
                    options[key] = value[key];
                }
            });
            value = (value.value || '').toString();
            if (!value.trim()) {
                return;
            }
        }

        if (options.prepared) {
            // header value is
            headers.push(key + ': ' + value);
            return;
        }

        switch (header.key) {
            case 'Content-Disposition':
                structured = libmime.parseHeaderValue(value);
                if (_self.filename) {
                    structured.params.filename = _self.filename;
                }
                value = libmime.buildHeaderValue(structured);
                break;
            case 'Content-Type':
                structured = libmime.parseHeaderValue(value);

                _self._handleContentType(structured);

                if (structured.value.match(/^text\/plain\b/) && typeof _self.content === 'string' && /[\u0080-\uFFFF]/.test(_self.content)) {
                    structured.params.charset = 'utf-8';
                }

                value = libmime.buildHeaderValue(structured);

                if (_self.filename) {
                    // add support for non-compliant clients like QQ webmail
                    // we can't build the value with buildHeaderValue as the value is non standard and
                    // would be converted to parameter continuation encoding that we do not want
                    param = this._encodeWords(_self.filename);

                    if (param !== _self.filename || /[\s'"\\;:\/=\(\),<>@\[\]\?]|^\-/.test(param)) {
                        // include value in quotes if needed
                        param = '"' + param + '"';
                    }
                    value += '; name=' + param;
                }
                break;
            case 'Bcc':
                if (!_self.keepBcc) {
                    // skip BCC values
                    return;
                }
                break;
        }

        value = _self._encodeHeaderValue(key, value);

        // skip empty lines
        if (!(value || '').toString().trim()) {
            return;
        }

        headers.push(libmime.foldLines(key + ': ' + value, 76));
    }.bind(this));

    return headers.join('\r\n');
};

/**
 * Streams the rfc2822 message from the current node. If this is a root node,
 * mandatory header fields are set if missing (Date, Message-Id, MIME-Version)
 *
 * @return {String} Compiled message
 */
MimeNode.prototype.createReadStream = function (options) {
    options = options || {};

    var outputStream = new PassThrough(options);
    var transform;

    this.stream(outputStream, options, function (err) {
        if (err) {
            outputStream.emit('error', err);
            return;
        }
        outputStream.end();
    });

    for (var i = 0, len = this._transforms.length; i < len; i++) {
        transform = typeof this._transforms[i] === 'function' ? this._transforms[i]() : this._transforms[i];
        outputStream.once('error', function (err) {
            transform.emit('error', err);
        });
        outputStream = outputStream.pipe(transform);
    }

    return outputStream;
};

/**
 * Appends a transform stream object to the transforms list. Final output
 * is passed through this stream before exposing
 *
 * @param {Object} transform Read-Write stream
 */
MimeNode.prototype.transform = function (transform) {
    this._transforms.push(transform);
};

MimeNode.prototype.stream = function (outputStream, options, done) {
    var _self = this;
    var transferEncoding = this.getTransferEncoding();
    var contentStream;
    var localStream;

    // protect actual callback against multiple triggering
    var returned = false;
    var callback = function (err) {
        if (returned) {
            return;
        }
        returned = true;
        done(err);
    };

    // pushes node content
    function sendContent() {
        if (_self.content) {

            if (Object.prototype.toString.call(_self.content) === '[object Error]') {
                // content is already errored
                return callback(_self.content);
            }

            if (typeof _self.content.pipe === 'function') {
                _self.content.removeListener('error', _self._contentErrorHandler);
                _self._contentErrorHandler = function (err) {
                    return callback(err);
                };
                _self.content.once('error', _self._contentErrorHandler);
            }

            if (['quoted-printable', 'base64'].indexOf(transferEncoding) >= 0) {
                contentStream = new(transferEncoding === 'base64' ? libbase64 : libqp).Encoder(options);

                contentStream.pipe(outputStream, {
                    end: false
                });
                contentStream.once('end', finalize);
                contentStream.once('error', function (err) {
                    return callback(err);
                });

                localStream = _self._getStream(_self.content);
                localStream.pipe(contentStream);
            } else {
                // anything that is not QP or Base54 passes as-is
                localStream = _self._getStream(_self.content);
                localStream.pipe(outputStream, {
                    end: false
                });
                localStream.once('end', finalize);
            }

            localStream.once('error', function (err) {
                return callback(err);
            });

            return;
        } else {
            return setImmediate(finalize);
        }
    }

    // for multipart nodes, push child nodes
    // for content nodes end the stream
    function finalize() {
        var childId = 0;
        var processChildNode = function () {
            if (childId >= _self.childNodes.length) {
                outputStream.write('\r\n--' + _self.boundary + '--\r\n');
                return callback();
            }
            var child = _self.childNodes[childId++];
            outputStream.write((childId > 1 ? '\r\n' : '') + '--' + _self.boundary + '\r\n');
            child.stream(outputStream, options, function (err) {
                if (err) {
                    return callback(err);
                }
                setImmediate(processChildNode);
            });
        };

        if (_self.multipart) {
            setImmediate(processChildNode);
        } else {
            return callback();
        }
    }

    if (this._raw) {
        setImmediate(function () {
            if (Object.prototype.toString.call(_self._raw) === '[object Error]') {
                // content is already errored
                return callback(_self._raw);
            }

            // remove default error handler (if set)
            if (typeof _self._raw.pipe === 'function') {
                _self._raw.removeListener('error', _self._contentErrorHandler);
            }

            var raw = _self._getStream(_self._raw);
            raw.pipe(outputStream, {
                end: false
            });
            raw.on('error', function (err) {
                outputStream.emit('error', err);
            });
            raw.on('end', finalize);
        });
    } else {
        outputStream.write(this.buildHeaders() + '\r\n\r\n');
        setImmediate(sendContent);
    }
};

/**
 * Sets envelope to be used instead of the generated one
 *
 * @return {Object} SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
 */
MimeNode.prototype.setEnvelope = function (envelope) {
    var list;

    this._envelope = {
        from: false,
        to: []
    };

    if (envelope.from) {
        list = [];
        this._convertAddresses(this._parseAddresses(envelope.from), list);
        list = list.filter(function (address) {
            return address && address.address;
        });
        if (list.length && list[0]) {
            this._envelope.from = list[0].address;
        }
    }
    ['to', 'cc', 'bcc'].forEach(function (key) {
        if (envelope[key]) {
            this._convertAddresses(this._parseAddresses(envelope[key]), this._envelope.to);
        }
    }.bind(this));

    this._envelope.to = this._envelope.to.map(function (to) {
        return to.address;
    }).filter(function (address) {
        return address;
    });

    var standardFields = ['to', 'cc', 'bcc', 'from'];
    Object.keys(envelope).forEach(function (key) {
        if (standardFields.indexOf(key) === -1) {
            this._envelope[key] = envelope[key];
        }
    }.bind(this));

    return this;
};

/**
 * Generates and returns an object with parsed address fields
 *
 * @return {Object} Address object
 */
MimeNode.prototype.getAddresses = function () {
    var addresses = {};

    this._headers.forEach(function (header) {
        var key = header.key.toLowerCase();
        if (['from', 'sender', 'reply-to', 'to', 'cc', 'bcc'].indexOf(key) >= 0) {
            if (!Array.isArray(addresses[key])) {
                addresses[key] = [];
            }

            this._convertAddresses(this._parseAddresses(header.value), addresses[key]);
        }
    }.bind(this));

    return addresses;
};

/**
 * Generates and returns SMTP envelope with the sender address and a list of recipients addresses
 *
 * @return {Object} SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
 */
MimeNode.prototype.getEnvelope = function () {
    if (this._envelope) {
        return this._envelope;
    }

    var envelope = {
        from: false,
        to: []
    };
    this._headers.forEach(function (header) {
        var list = [];
        if (header.key === 'From' || (!envelope.from && ['Reply-To', 'Sender'].indexOf(header.key) >= 0)) {
            this._convertAddresses(this._parseAddresses(header.value), list);
            if (list.length && list[0]) {
                envelope.from = list[0].address;
            }
        } else if (['To', 'Cc', 'Bcc'].indexOf(header.key) >= 0) {
            this._convertAddresses(this._parseAddresses(header.value), envelope.to);
        }
    }.bind(this));

    envelope.to = envelope.to.map(function (to) {
        return to.address;
    });

    return envelope;
};

/**
 * Returns Message-Id value. If it does not exist, then creates one
 *
 * @return {String} Message-Id value
 */
MimeNode.prototype.messageId = function () {
    var messageId = this.getHeader('Message-ID');
    // You really should define your own Message-Id field!
    if (!messageId) {
        messageId = this._generateMessageId();
        this.setHeader('Message-ID', messageId);
    }
    return messageId;
};

/**
 * Sets pregenerated content that will be used as the output of this node
 *
 * @param {String|Buffer|Stream} Raw MIME contents
 */
MimeNode.prototype.setRaw = function (raw) {
    var _self = this;

    this._raw = raw;

    if (this._raw && typeof this._raw.pipe === 'function') {
        // pre-stream handler. might be triggered if a stream is set as content
        // and 'error' fires before anything is done with this stream
        this._contentErrorHandler = function (err) {
            _self._raw.removeListener('error', _self._contentErrorHandler);
            _self._raw = err;
        };
        _self._raw.once('error', this._contentErrorHandler);
    }

    return this;
};

/////// PRIVATE METHODS

/**
 * Detects and returns handle to a stream related with the content.
 *
 * @param {Mixed} content Node content
 * @returns {Object} Stream object
 */
MimeNode.prototype._getStream = function (content) {
    var contentStream;

    if (typeof content.pipe === 'function') {
        // assume as stream
        return content;
    } else if (content && typeof content.path === 'string' && !content.href) {
        if (this.disableFileAccess) {
            contentStream = new PassThrough();
            setImmediate(function () {
                contentStream.emit('error', new Error('File access rejected for ' + content.path));
            });
            return contentStream;
        }
        // read file
        return fs.createReadStream(content.path);
    } else if (content && typeof content.href === 'string') {
        if (this.disableUrlAccess) {
            contentStream = new PassThrough();
            setImmediate(function () {
                contentStream.emit('error', new Error('Url access rejected for ' + content.href));
            });
            return contentStream;
        }
        // fetch URL
        return fetch(content.href);
    } else {
        // pass string or buffer content as a stream
        contentStream = new PassThrough();
        setImmediate(function () {
            contentStream.end(content || '');
        });
        return contentStream;
    }
};

/**
 * Parses addresses. Takes in a single address or an array or an
 * array of address arrays (eg. To: [[first group], [second group],...])
 *
 * @param {Mixed} addresses Addresses to be parsed
 * @return {Array} An array of address objects
 */
MimeNode.prototype._parseAddresses = function (addresses) {
    return [].concat.apply([], [].concat(addresses).map(function (address) {
        if (address && address.address) {
            address.address = this._normalizeAddress(address.address);
            address.name = address.name || '';
            return [address];
        }
        return addressparser(address);
    }.bind(this)));
};

/**
 * Normalizes a header key, uses Camel-Case form, except for uppercase MIME-
 *
 * @param {String} key Key to be normalized
 * @return {String} key in Camel-Case form
 */
MimeNode.prototype._normalizeHeaderKey = function (key) {
    return (key || '').toString().
        // no newlines in keys
    replace(/\r?\n|\r/g, ' ').
    trim().toLowerCase().
        // use uppercase words, except MIME
    replace(/^X\-SMTPAPI$|^(MIME|DKIM)\b|^[a-z]|\-(SPF|FBL|ID|MD5)$|\-[a-z]/ig,
            function (c) {
                return c.toUpperCase();
            }).
        // special case
    replace(/^Content\-Features$/i, 'Content-features');
};

/**
 * Checks if the content type is multipart and defines boundary if needed.
 * Doesn't return anything, modifies object argument instead.
 *
 * @param {Object} structured Parsed header value for 'Content-Type' key
 */
MimeNode.prototype._handleContentType = function (structured) {
    this.contentType = structured.value.trim().toLowerCase();

    this.multipart = this.contentType.split('/').reduce(function (prev, value) {
        return prev === 'multipart' ? value : false;
    });

    if (this.multipart) {
        this.boundary = structured.params.boundary = structured.params.boundary || this.boundary || this._generateBoundary();
    } else {
        this.boundary = false;
    }
};

/**
 * Generates a multipart boundary value
 *
 * @return {String} boundary value
 */
MimeNode.prototype._generateBoundary = function () {
    return this.rootNode.boundaryPrefix + '-?=_' + this._nodeId + '-' + this.rootNode.baseBoundary;
};

/**
 * Encodes a header value for use in the generated rfc2822 email.
 *
 * @param {String} key Header key
 * @param {String} value Header value
 */
MimeNode.prototype._encodeHeaderValue = function (key, value) {
    key = this._normalizeHeaderKey(key);

    switch (key) {

        // Structured headers
        case 'From':
        case 'Sender':
        case 'To':
        case 'Cc':
        case 'Bcc':
        case 'Reply-To':
            return this._convertAddresses(this._parseAddresses(value));

            // values enclosed in <>
        case 'Message-ID':
        case 'In-Reply-To':
        case 'Content-Id':
            value = (value || '').toString().replace(/\r?\n|\r/g, ' ');

            if (value.charAt(0) !== '<') {
                value = '<' + value;
            }

            if (value.charAt(value.length - 1) !== '>') {
                value = value + '>';
            }
            return value;

            // space separated list of values enclosed in <>
        case 'References':
            value = [].concat.apply([], [].concat(value || '').map(function (elm) {
                elm = (elm || '').toString().replace(/\r?\n|\r/g, ' ').trim();
                return elm.replace(/<[^>]*>/g, function (str) {
                    return str.replace(/\s/g, '');
                }).split(/\s+/);
            })).map(function (elm) {
                if (elm.charAt(0) !== '<') {
                    elm = '<' + elm;
                }
                if (elm.charAt(elm.length - 1) !== '>') {
                    elm = elm + '>';
                }
                return elm;
            });

            return value.join(' ').trim();

        case 'Date':
            if (Object.prototype.toString.call(value) === '[object Date]') {
                return value.toUTCString().replace(/GMT/, '+0000');
            }

            value = (value || '').toString().replace(/\r?\n|\r/g, ' ');
            return this._encodeWords(value);

        default:
            value = (value || '').toString().replace(/\r?\n|\r/g, ' ');
            // encodeWords only encodes if needed, otherwise the original string is returned
            return this._encodeWords(value);
    }
};

/**
 * Rebuilds address object using punycode and other adjustments
 *
 * @param {Array} addresses An array of address objects
 * @param {Array} [uniqueList] An array to be populated with addresses
 * @return {String} address string
 */
MimeNode.prototype._convertAddresses = function (addresses, uniqueList) {
    var values = [];

    uniqueList = uniqueList || [];

    [].concat(addresses || []).forEach(function (address) {
        if (address.address) {
            address.address = this._normalizeAddress(address.address);

            if (!address.name) {
                values.push(address.address);
            } else if (address.name) {
                values.push(this._encodeAddressName(address.name) + ' <' + address.address + '>');
            }

            if (address.address) {
                if (!uniqueList.filter(
                        function (a) {
                            return a.address === address.address;
                        }).length) {
                    uniqueList.push(address);
                }
            }
        } else if (address.group) {
            values.push(this._encodeAddressName(address.name) + ':' + (address.group.length ? this._convertAddresses(address.group, uniqueList) : '').trim() + ';');
        }
    }.bind(this));

    return values.join(', ');
};

/**
 * Normalizes an email address
 *
 * @param {Array} address An array of address objects
 * @return {String} address string
 */
MimeNode.prototype._normalizeAddress = function (address) {
    address = (address || '').toString().trim();

    var lastAt = address.lastIndexOf('@');
    var user = address.substr(0, lastAt);
    var domain = address.substr(lastAt + 1);

    // Usernames are not touched and are kept as is even if these include unicode
    // Domains are punycoded by default
    // 'jõgeva.ee' will be converted to 'xn--jgeva-dua.ee'
    // non-unicode domains are left as is

    return user + '@' + punycode.toASCII(domain.toLowerCase());
};

/**
 * If needed, mime encodes the name part
 *
 * @param {String} name Name part of an address
 * @returns {String} Mime word encoded string if needed
 */
MimeNode.prototype._encodeAddressName = function (name) {
    if (!/^[\w ']*$/.test(name)) {
        if (/^[\x20-\x7e]*$/.test(name)) {
            return '"' + name.replace(/([\\"])/g, '\\$1') + '"';
        } else {
            return libmime.encodeWord(name, this._getTextEncoding(name), 52);
        }
    }
    return name;
};

/**
 * If needed, mime encodes the name part
 *
 * @param {String} name Name part of an address
 * @returns {String} Mime word encoded string if needed
 */
MimeNode.prototype._encodeWords = function (value) {
    return libmime.encodeWords(value, this._getTextEncoding(value), 52);
};

/**
 * Detects best mime encoding for a text value
 *
 * @param {String} value Value to check for
 * @return {String} either 'Q' or 'B'
 */
MimeNode.prototype._getTextEncoding = function (value) {
    value = (value || '').toString();

    var encoding = this.textEncoding;
    var latinLen;
    var nonLatinLen;

    if (!encoding) {
        // count latin alphabet symbols and 8-bit range symbols + control symbols
        // if there are more latin characters, then use quoted-printable
        // encoding, otherwise use base64
        nonLatinLen = (value.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\u0080-\uFFFF]/g) || []).length;
        latinLen = (value.match(/[a-z]/gi) || []).length;
        // if there are more latin symbols than binary/unicode, then prefer Q, otherwise B
        encoding = nonLatinLen < latinLen ? 'Q' : 'B';
    }
    return encoding;
};

/**
 * Generates a message id
 *
 * @return {String} Random Message-ID value
 */
MimeNode.prototype._generateMessageId = function () {
    return '<' + [2, 2, 2, 6].reduce(
            // crux to generate UUID-like random strings
            function (prev, len) {
                return prev + '-' + crypto.randomBytes(len).toString('hex');
            }, crypto.randomBytes(4).toString('hex')) +
        '@' +
        // try to use the domain of the FROM address or fallback to server hostname
        (this.getEnvelope().from || this.hostname || os.hostname() || 'localhost').split('@').pop() + '>';
};
