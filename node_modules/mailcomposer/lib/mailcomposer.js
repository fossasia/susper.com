'use strict';

var BuildMail = require('buildmail');
var libmime = require('libmime');

module.exports = function (mail) {
    return new MailComposer(mail).compile();
};

module.exports.MailComposer = MailComposer;

/**
 * Creates the object for composing a BuildMail instance out from the mail options
 *
 * @constructor
 * @param {Object} mail Mail options
 */
function MailComposer(mail) {
    if (!(this instanceof MailComposer)) {
        return new MailComposer(mail);
    }

    this.mail = mail || {};
    this.message = false;
}

/**
 * Builds BuildMail instance
 */
MailComposer.prototype.compile = function () {
    this._alternatives = this.getAlternatives();
    this._htmlNode = this._alternatives.filter(function (alternative) {
        return /^text\/html\b/i.test(alternative.contentType);
    }).pop();
    this._attachments = this.getAttachments(!!this._htmlNode);

    this._useRelated = !!(this._htmlNode && this._attachments.related.length);
    this._useAlternative = this._alternatives.length > 1;
    this._useMixed = this._attachments.attached.length > 1 || (this._alternatives.length && this._attachments.attached.length === 1);

    // Compose MIME tree
    if (this.mail.raw) {
        this.message = new BuildMail().setRaw(this.mail.raw);
    } else if (this._useMixed) {
        this.message = this._createMixed();
    } else if (this._useAlternative) {
        this.message = this._createAlternative();
    } else if (this._useRelated) {
        this.message = this._createRelated();
    } else {
        this.message = this._createContentNode(false, [].concat(this._alternatives || []).concat(this._attachments.attached || []).shift() || {
            contentType: 'text/plain',
            content: ''
        });
    }

    // Add custom headers
    if (this.mail.headers) {
        this.message.addHeader(this.mail.headers);
    }

    // Add headers to the root node, always overrides custom headers
    [
        'from',
        'sender',
        'to',
        'cc',
        'bcc',
        'reply-to',
        'in-reply-to',
        'references',
        'subject',
        'message-id',
        'date'
    ].forEach(function (header) {
        var key = header.replace(/-(\w)/g, function (o, c) {
            return c.toUpperCase();
        });
        if (this.mail[key]) {
            this.message.setHeader(header, this.mail[key]);
        }
    }.bind(this));

    // Sets custom envelope
    if (this.mail.envelope) {
        this.message.setEnvelope(this.mail.envelope);
    }

    // ensure Message-Id value
    this.message.messageId();

    return this.message;
};

/**
 * List all attachments. Resulting attachment objects can be used as input for BuildMail nodes
 *
 * @param {Boolean} findRelated If true separate related attachments from attached ones
 * @returns {Object} An object of arrays (`related` and `attached`)
 */
MailComposer.prototype.getAttachments = function (findRelated) {
    var attachments = [].concat(this.mail.attachments || []).map(function (attachment, i) {
        var data;
        var isMessageNode = /^message\//i.test(attachment.contentType);

        if (/^data:/i.test(attachment.path || attachment.href)) {
            attachment = this._processDataUrl(attachment);
        }

        data = {
            contentType: attachment.contentType ||
                libmime.detectMimeType(attachment.filename || attachment.path || attachment.href || 'bin'),
            contentDisposition: attachment.contentDisposition || (isMessageNode ? 'inline' : 'attachment'),
            contentTransferEncoding: attachment.contentTransferEncoding
        };

        if (attachment.filename) {
            data.filename = attachment.filename;
        } else if (!isMessageNode && attachment.filename !== false) {
            data.filename = (attachment.path || attachment.href || '').split('/').pop() || 'attachment-' + (i + 1);
            if (data.filename.indexOf('.') < 0) {
                data.filename += '.' + libmime.detectExtension(data.contentType);
            }
        }

        if (/^https?:\/\//i.test(attachment.path)) {
            attachment.href = attachment.path;
            attachment.path = undefined;
        }

        if (attachment.cid) {
            data.cid = attachment.cid;
        }

        if (attachment.raw) {
            data.raw = attachment.raw;
        } else if (attachment.path) {
            data.content = {
                path: attachment.path
            };
        } else if (attachment.href) {
            data.content = {
                href: attachment.href
            };
        } else {
            data.content = attachment.content || '';
        }

        if (attachment.encoding) {
            data.encoding = attachment.encoding;
        }

        if (attachment.headers) {
            data.headers = attachment.headers;
        }

        return data;
    }.bind(this));

    if (!findRelated) {
        return {
            attached: attachments,
            related: []
        };
    } else {
        return {
            attached: attachments.filter(function (attachment) {
                return !attachment.cid;
            }),
            related: attachments.filter(function (attachment) {
                return !!attachment.cid;
            })
        };
    }
};

/**
 * List alternatives. Resulting objects can be used as input for BuildMail nodes
 *
 * @returns {Array} An array of alternative elements. Includes the `text` and `html` values as well
 */
MailComposer.prototype.getAlternatives = function () {
    var alternatives = [],
        text, html, watchHtml, icalEvent;

    if (this.mail.text) {
        if (typeof this.mail.text === 'object' && (this.mail.text.content || this.mail.text.path || this.mail.text.href || this.mail.text.raw)) {
            text = this.mail.text;
        } else {
            text = {
                content: this.mail.text
            };
        }
        text.contentType = 'text/plain' + (!text.encoding && libmime.isPlainText(text.content) ? '' : '; charset=utf-8');
    }

    if (this.mail.watchHtml) {
        if (typeof this.mail.watchHtml === 'object' && (this.mail.watchHtml.content || this.mail.watchHtml.path || this.mail.watchHtml.href || this.mail.watchHtml.raw)) {
            watchHtml = this.mail.watchHtml;
        } else {
            watchHtml = {
                content: this.mail.watchHtml
            };
        }
        watchHtml.contentType = 'text/watch-html' + (!watchHtml.encoding && libmime.isPlainText(watchHtml.content) ? '' : '; charset=utf-8');
    }

    if (this.mail.icalEvent) {
        if (typeof this.mail.icalEvent === 'object' && (this.mail.icalEvent.content || this.mail.icalEvent.path || this.mail.icalEvent.href || this.mail.icalEvent.raw)) {
            icalEvent = this.mail.icalEvent;
        } else {
            icalEvent = {
                content: this.mail.icalEvent
            };
        }
        icalEvent.contentType = 'text/calendar; charset="utf-8"; method=' + (icalEvent.method || 'PUBLISH').toString().trim().toUpperCase();
        if (!icalEvent.headers) {
            icalEvent.headers = {};
        }
        icalEvent.headers['Content-Transfer-Encoding'] = 'base64';
    }

    if (this.mail.html) {
        if (typeof this.mail.html === 'object' && (this.mail.html.content || this.mail.html.path || this.mail.html.href || this.mail.html.raw)) {
            html = this.mail.html;
        } else {
            html = {
                content: this.mail.html
            };
        }
        html.contentType = 'text/html' + (!html.encoding && libmime.isPlainText(html.content) ? '' : '; charset=utf-8');
    }

    [].
    concat(text || []).
    concat(watchHtml || []).
    concat(html || []).
    concat(icalEvent || []).
    concat(this.mail.alternatives || []).
    forEach(function (alternative) {
        var data;

        if (/^data:/i.test(alternative.path || alternative.href)) {
            alternative = this._processDataUrl(alternative);
        }

        data = {
            contentType: alternative.contentType ||
                libmime.detectMimeType(alternative.filename || alternative.path || alternative.href || 'txt'),
            contentTransferEncoding: alternative.contentTransferEncoding
        };

        if (alternative.filename) {
            data.filename = alternative.filename;
        }

        if (/^https?:\/\//i.test(alternative.path)) {
            alternative.href = alternative.path;
            alternative.path = undefined;
        }

        if (alternative.raw) {
            data.raw = alternative.raw;
        } else if (alternative.path) {
            data.content = {
                path: alternative.path
            };
        } else if (alternative.href) {
            data.content = {
                href: alternative.href
            };
        } else {
            data.content = alternative.content || '';
        }

        if (alternative.encoding) {
            data.encoding = alternative.encoding;
        }

        if (alternative.headers) {
            data.headers = alternative.headers;
        }

        alternatives.push(data);
    }.bind(this));

    return alternatives;
};

/**
 * Builds multipart/mixed node. It should always contain different type of elements on the same level
 * eg. text + attachments
 *
 * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
 * @returns {Object} BuildMail node element
 */
MailComposer.prototype._createMixed = function (parentNode) {
    var node;

    if (!parentNode) {
        node = new BuildMail('multipart/mixed', {
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    } else {
        node = parentNode.createChild('multipart/mixed', {
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    }

    if (this._useAlternative) {
        this._createAlternative(node);
    } else if (this._useRelated) {
        this._createRelated(node);
    }

    [].concat(!this._useAlternative && this._alternatives || []).concat(this._attachments.attached || []).forEach(function (element) {
        // if the element is a html node from related subpart then ignore it
        if (!this._useRelated || element !== this._htmlNode) {
            this._createContentNode(node, element);
        }
    }.bind(this));

    return node;
};

/**
 * Builds multipart/alternative node. It should always contain same type of elements on the same level
 * eg. text + html view of the same data
 *
 * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
 * @returns {Object} BuildMail node element
 */
MailComposer.prototype._createAlternative = function (parentNode) {
    var node;

    if (!parentNode) {
        node = new BuildMail('multipart/alternative', {
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    } else {
        node = parentNode.createChild('multipart/alternative', {
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    }

    this._alternatives.forEach(function (alternative) {
        if (this._useRelated && this._htmlNode === alternative) {
            this._createRelated(node);
        } else {
            this._createContentNode(node, alternative);
        }
    }.bind(this));

    return node;
};

/**
 * Builds multipart/related node. It should always contain html node with related attachments
 *
 * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
 * @returns {Object} BuildMail node element
 */
MailComposer.prototype._createRelated = function (parentNode) {
    var node;

    if (!parentNode) {
        node = new BuildMail('multipart/related; type="text/html"', {
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    } else {
        node = parentNode.createChild('multipart/related; type="text/html"', {
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    }

    this._createContentNode(node, this._htmlNode);

    this._attachments.related.forEach(function (alternative) {
        this._createContentNode(node, alternative);
    }.bind(this));

    return node;
};

/**
 * Creates a regular node with contents
 *
 * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
 * @param {Object} element Node data
 * @returns {Object} BuildMail node element
 */
MailComposer.prototype._createContentNode = function (parentNode, element) {
    element = element || {};
    element.content = element.content || '';

    var node;
    var encoding = (element.encoding || 'utf8')
        .toString()
        .toLowerCase()
        .replace(/[-_\s]/g, '');

    if (!parentNode) {
        node = new BuildMail(element.contentType, {
            filename: element.filename,
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    } else {
        node = parentNode.createChild(element.contentType, {
            filename: element.filename,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    }

    // add custom headers
    if (element.headers) {
        node.addHeader(element.headers);
    }

    if (element.cid) {
        node.setHeader('Content-Id', '<' + element.cid.replace(/[<>]/g, '') + '>');
    }

    if (element.contentTransferEncoding) {
        node.setHeader('Content-Transfer-Encoding', element.contentTransferEncoding);
    } else if (this.mail.encoding && /^text\//i.test(element.contentType)) {
        node.setHeader('Content-Transfer-Encoding', this.mail.encoding);
    }

    if (!/^text\//i.test(element.contentType) || element.contentDisposition) {
        node.setHeader('Content-Disposition', element.contentDisposition || (element.cid ? 'inline' : 'attachment'));
    }

    if (typeof element.content === 'string' && ['utf8', 'usascii', 'ascii'].indexOf(encoding) < 0) {
        element.content = new Buffer(element.content, encoding);
    }

    // prefer pregenerated raw content
    if (element.raw) {
        node.setRaw(element.raw);
    } else {
        node.setContent(element.content);
    }

    return node;
};

/**
 * Parses data uri and converts it to a Buffer
 *
 * @param {Object} element Content element
 * @return {Object} Parsed element
 */
MailComposer.prototype._processDataUrl = function (element) {
    var parts = (element.path || element.href).match(/^data:((?:[^;]*;)*(?:[^,]*)),(.*)$/i);
    if (!parts) {
        return element;
    }

    element.content = /\bbase64$/i.test(parts[1]) ? new Buffer(parts[2], 'base64') : new Buffer(decodeURIComponent(parts[2]));

    if ('path' in element) {
        element.path = false;
    }

    if ('href' in element) {
        element.href = false;
    }

    parts[1].split(';').forEach(function (item) {
        if (/^\w+\/[^\/]+$/i.test(item)) {
            element.contentType = element.contentType || item.toLowerCase();
        }
    });

    return element;
};
