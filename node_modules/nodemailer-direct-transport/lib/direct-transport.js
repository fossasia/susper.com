'use strict';

var createQueue = require('./message-queue');
var SMTPConnection = require('smtp-connection');
var dns = require('dns');
var net = require('net');
var os = require('os');
var util = require('util');
var packageData = require('../package.json');
var EventEmitter = require('events').EventEmitter;
var shared = require('nodemailer-shared');

// Expose to the world
module.exports = function (options) {
    return new DirectMailer(options);
};

/**
 * Creates a new DirectMailer instance. Provides method 'send' to queue
 * outgoing e-mails. The queue is processed in the background.
 *
 * @constructor
 * @param {Object} [options] Optional options object
 */
function DirectMailer(options) {
    EventEmitter.call(this);
    this.options = options || {};
    this._queue = createQueue();
    this._started = false;
    this._lastId = 0;

    if (options && typeof options.getSocket === 'function') {
        this.getSocket = options.getSocket;
    }

    this.logger = shared.getLogger(this.options);

    // temporary object
    var connection = new SMTPConnection({});

    this.name = 'SMTP (direct)';
    this.version = packageData.version + '[client:' + connection.version + ']';
}
util.inherits(DirectMailer, EventEmitter);

// Adds a dynamic property 'length'
Object.defineProperty(DirectMailer.prototype, 'length', {
    get: function () {
        return this._queue._instantQueue.length + this._queue._sortedQueue.length;
    }
});

/**
 * Placeholder function for creating proxy sockets. This method immediatelly returns
 * without a socket
 *
 * @param {Object} options Connection options
 * @param {Function} callback Callback function to run with the socket keys
 */
DirectMailer.prototype.getSocket = function (options, callback) {
    // return immediatelly
    return callback(null, false);
};

/**
 * Adds an outgoing message to the queue. Recipient addresses are sorted
 * by the receiving domain and for every domain, a copy of the message is queued.
 *
 * If input is deemed invalid, an error is thrown, so be ready to catch these
 * when calling directmail.send(...)
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function
 */
DirectMailer.prototype.send = function (mail, callback) {

    var envelope = mail.message.getEnvelope();
    var domainEnvelopes = {};

    if (!envelope.from) {
        return callback(new Error('"From" address missing'));
    }

    envelope.to = [].concat(envelope.to || []);

    if (!envelope.to.length) {
        return callback('"Recipients" addresses missing');
    }

    // We cant't run existing streams more than once so we need to change these
    // to buffers. Filenames, URLs etc are not affected – for every
    // message copy a new file stream will be created
    this._clearStreams(mail, function (err) {
        if (err) {
            return callback(err);
        }

        this._formatMessage(mail.message);

        envelope.to.forEach(function (recipient) {
            recipient = (recipient || '').toString();

            var domain = (recipient.split('@').pop() || '').toLowerCase().trim();

            if (!domainEnvelopes[domain]) {
                domainEnvelopes[domain] = {
                    from: envelope.from,
                    to: [recipient]
                };
            } else if (domainEnvelopes[domain].to.indexOf(recipient) < 0) {
                domainEnvelopes[domain].to.push(recipient);
            }
        });

        var returned = 0;
        var domains = Object.keys(domainEnvelopes);
        var combinedInfo = {
            accepted: [],
            rejected: [],
            pending: [],
            errors: [],
            envelope: mail.message.getEnvelope()
        };

        domains.forEach((function (domain) {
            var called = false;
            var id = ++this._lastId;
            var item = {
                envelope: domainEnvelopes[domain],
                data: mail.data,
                message: mail.message,
                domain: domain,
                id: id,
                callback: function (err, info) {
                    if (called) {
                        this.logger.info('Callback for #%s already called. Updated values: %s', id, JSON.stringify(err || info));
                        return;
                    }

                    called = true;
                    returned++;

                    if (err) {
                        combinedInfo.errors.push(err);
                        if (err.recipients) {
                            combinedInfo.rejected = combinedInfo.rejected.concat(err.recipients || []);
                        }
                    } else if (info) {
                        combinedInfo.accepted = combinedInfo.accepted.concat(info.accepted || []);
                        combinedInfo.rejected = combinedInfo.rejected.concat(info.rejected || []);
                        combinedInfo.pending = combinedInfo.pending.concat(info.pending || []);
                        combinedInfo.messageId = info.messageId;
                    }

                    if (returned >= domains.length) {
                        if (combinedInfo.errors.length === domains.length) {
                            var error = new Error('Sending failed');
                            error.errors = combinedInfo.errors;
                            return callback(error);
                        } else {
                            return callback(null, combinedInfo);
                        }
                    }
                }.bind(this)
            };

            this._queue.insert(item);
        }).bind(this));

        // start send loop if needed
        if (!this._started) {
            this._started = true;

            // do not start the loop before current execution context is finished
            setImmediate(this._loop.bind(this));
        }

    }.bind(this));
};

/**
 * Looping function to fetch a message from the queue and send it.
 */
DirectMailer.prototype._loop = function () {

    // callback is fired when a message is added to the queue
    this._queue.get((function (data) {

        this.logger.info('Retrieved message #%s from the queue, resolving %s', data.id, data.domain);

        // Resolve destination MX server
        this._resolveMx(data.domain, (function (err, list) {

            if (err) {
                this.logger.info('Resolving %s for #%s failed', data.domain, data.id);
                this.logger.info(err);
            } else if (!list || !list.length) {
                this.logger.info('Could not resolve any MX servers for %s', data.domain);
            }
            if (err || !list || !list.length) {
                data.callback(err || new Error('Could not resolve MX for ' + data.domain));
                return setImmediate(this._loop.bind(this));
            }

            // Sort MX list by priority field
            list.sort(function (a, b) {
                return (a && a.priority || 0) - (b && b.priority || 0);
            });

            // Use the first server on the list
            var exchanges = list.map(function (item) {
                return item.exchange;
            });

            // Try to send the message
            this._process([].concat(exchanges), data, (function (err, response) {
                if (err) {
                    this.logger.info('Failed processing message #%s', data.id);
                } else {
                    this.logger.info('Server responded for #%s: %s', data.id, JSON.stringify(response));
                }

                if (err) {
                    if (err.responseCode && err.responseCode >= 500) {
                        err.domain = data.domain;
                        err.exchange = exchanges[0];
                        err.recipients = data.envelope.to;
                        data.callback(err);
                    } else {
                        data.replies = (data.replies || 0) + 1;
                        if (data.replies <= 5) {
                            this._queue.insert(data, this.options.retryDelay || data.replies * 15 * 60 * 1000);
                            this.logger.info('Message #%s requeued', data.id);
                            data.callback(null, {
                                pending: {
                                    domain: data.domain,
                                    exchange: exchanges[0],
                                    recipients: data.envelope.to,
                                    response: err.response
                                }
                            });
                        } else {
                            err.domain = data.domain;
                            err.exchange = exchanges[0];
                            err.recipients = data.envelope.to;
                            data.callback(err);
                        }
                    }
                } else {
                    data.callback(null, response);
                }

                setImmediate(this._loop.bind(this));
            }).bind(this));
        }).bind(this));
    }).bind(this));
};

/**
 * Sends a message to provided MX server
 *
 * @param {Array} exchanges Priority list of MX servers
 * @param {Object} data Message object
 * @param {Function} callback Callback to run once the message is either sent or sending fails
 */
DirectMailer.prototype._process = function (exchanges, data, callback) {
    var exchange = exchanges[0];

    this.logger.info('%s resolved to %s for #%s', data.domain, exchange, data.id);

    this.logger.info('Connecting to %s:%s for message #%s %s STARTTLS', exchange, this.options.port || 25, data.id, data.ignoreTLS ? 'without' : 'with');

    var options = {
        host: exchange,
        port: this.options.port || 25,
        requireTLS: !data.ignoreTLS,
        ignoreTLS: data.ignoreTLS,
        tls: {
            rejectUnauthorized: false
        }
    };

    // Add options from DirectMailer options to simplesmtp client
    Object.keys(this.options).forEach((function (key) {
        options[key] = this.options[key];
    }).bind(this));

    this.getSocket(options, function (err, socketOptions) {
        if (err) {
            // try next host
            exchanges.shift();
            if (!exchanges.length) {
                // no more hosts to try
                return callback(err);
            }
            this.logger.info('Failed to connect to %s, trying next MX', exchange);
            return this._process(exchanges, data, callback);
        }

        if (socketOptions && socketOptions.connection) {
            this.logger.info('Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
            Object.keys(socketOptions).forEach(function (key) {
                options[key] = socketOptions[key];
            });
        }

        var connection = new SMTPConnection(options);
        var returned = false;
        var connected = false;

        connection.once('error', function (err) {
            if (returned) {
                return;
            }
            returned = true;
            if (err.code === 'ETLS') {
                // STARTTLS failed, try again, this time without encryption
                data.ignoreTLS = true;
                return this._process(exchanges, data, callback);
            }
            if (!connected) {
                // try next host
                exchanges.shift();
                if (!exchanges.length) {
                    // no more hosts to try
                    return callback(err);
                }
                this.logger.info('Failed to connect to %s, trying next MX', exchange);
                return this._process(exchanges, data, callback);
            }
            return callback(err);
        }.bind(this));

        var sendMessage = function () {
            var messageId = (data.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
            var recipients = [].concat(data.envelope.to || []);
            if (recipients.length > 3) {
                recipients.push('...and ' + recipients.splice(2).length + ' more');
            }

            this.logger.info('Sending message <%s> to <%s>', messageId, recipients.join(', '));
            connection.send(data.envelope, data.message.createReadStream(), function (err, info) {
                if (returned) {
                    return;
                }
                returned = true;

                connection.close();
                if (err) {
                    return callback(err);
                }

                info.messageId = (data.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
                return callback(null, info);
            });
        }.bind(this);

        connection.connect(function () {
            connected = true;
            if (returned) {
                return;
            }
            sendMessage();
        }.bind(this));
    }.bind(this));
};

/**
 * Adds additional headers to the outgoing message
 *
 * @param {Object} message BuildMail message object
 */
DirectMailer.prototype._formatMessage = function (message) {
    var hostname = this._resolveHostname(this.options.name);

    // set the first header as 'Received:'
    message._headers.unshift({
        key: 'Received',
        value: 'from localhost (127.0.0.1) by ' + hostname + ' with SMTP; ' + Date()
    });
};

/**
 * Detects stream objects and resolves these to buffers before sending. File paths,
 * urls etc. are not affected.
 *
 * @param {Object} message BuildMail message object
 * @param {Function} callback Callback to run
 */
DirectMailer.prototype._clearStreams = function (mail, callback) {
    var streamNodes = [];

    function walkNode(node) {
        if (node.content && typeof node.content.pipe === 'function') {
            streamNodes.push(node);
        }
        if (node.childNodes && node.childNodes.length) {
            node.childNodes.forEach(walkNode);
        }
    }
    walkNode(mail.message);

    function resolveNodes() {
        if (!streamNodes.length) {
            return callback();
        }
        var node = streamNodes.shift();

        mail.resolveContent(node, 'content', function (err) {
            if (err) {
                return callback(err);
            }
            setImmediate(resolveNodes);
        });
    }

    resolveNodes();
};

/**
 * Resolves MX server for a domain. This solution is somewhat incomplete as
 * it only considers the hostname with lowest priority and ignores all the rest
 *
 * @param {String} domain Domain to resolve the MX to
 * @param {Function} callback Callback function to run
 */
DirectMailer.prototype._resolveMx = function (domain, callback) {
    domain = domain.replace(/^\[(ipv6:)?|\]$/gi, '');

    // Do not try to resolve the domain name if it is an IP address
    if (net.isIP(domain)) {
        return callback(null, [{
            priority: 0,
            exchange: domain
        }]);
    }

    dns.resolveMx(domain, function (err, list) {
        if (err) {
            if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
                // fallback to A
                dns.resolve4(domain, function (err, list) {
                    if (err) {
                        if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
                            // fallback to AAAA
                            dns.resolve6(domain, function (err, list) {
                                if (err) {
                                    return callback(err);
                                }

                                // return the first resolved Ipv6 with priority 0
                                return callback(null, [].concat(list || []).map(function (entry) {
                                    return {
                                        priority: 0,
                                        exchange: entry
                                    };
                                }).slice(0, 1));
                            });
                        } else {
                            return callback(err);
                        }
                        return;
                    }

                    // return the first resolved Ipv4 with priority 0
                    return callback(null, [].concat(list || []).map(function (entry) {
                        return {
                            priority: 0,
                            exchange: entry
                        };
                    }).slice(0, 1));
                });
            } else {
                return callback(err);
            }
            return;
        }
        callback(null, list);
    });
};

/**
 * Resolves current hostname. If resolved name is an IP address, uses 'localhost'.
 *
 * @param {String} [name] Preferred hostname
 * @return {String} Resolved hostname
 */
DirectMailer.prototype._resolveHostname = function (name) {
    if (!name || net.isIP(name.replace(/[\[\]]/g, '').trim())) {
        name = (os.hostname && os.hostname()) || '';
    }

    if (!name || net.isIP(name.replace(/[\[\]]/g, '').trim())) {
        name = 'localhost';
    }

    return name.toLowerCase();
};
