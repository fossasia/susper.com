'use strict';

var SMTPConnection = require('smtp-connection');
var packageData = require('../package.json');
var wellknown = require('nodemailer-wellknown');
var shared = require('nodemailer-shared');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

// expose to the world
module.exports = function (options) {
    return new SMTPTransport(options);
};

/**
 * Creates a SMTP transport object for Nodemailer
 *
 * @constructor
 * @param {Object} options Connection options
 */
function SMTPTransport(options) {
    EventEmitter.call(this);

    options = options || {};
    if (typeof options === 'string') {
        options = {
            url: options
        };
    }

    var urlData;
    var service = options.service;

    if (typeof options.getSocket === 'function') {
        this.getSocket = options.getSocket;
    }

    if (options.url) {
        urlData = shared.parseConnectionUrl(options.url);
        service = service || urlData.service;
    }

    this.options = assign(
        false, // create new object
        options, // regular options
        urlData, // url options
        service && wellknown(service) // wellknown options
    );

    this.logger = shared.getLogger(this.options);

    // temporary object
    var connection = new SMTPConnection(this.options);

    this.name = 'SMTP';
    this.version = packageData.version + '[client:' + connection.version + ']';
}
util.inherits(SMTPTransport, EventEmitter);

/**
 * Placeholder function for creating proxy sockets. This method immediatelly returns
 * without a socket
 *
 * @param {Object} options Connection options
 * @param {Function} callback Callback function to run with the socket keys
 */
SMTPTransport.prototype.getSocket = function (options, callback) {
    // return immediatelly
    return callback(null, false);
};

/**
 * Sends an e-mail using the selected settings
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function
 */
SMTPTransport.prototype.send = function (mail, callback) {

    this.getSocket(this.options, function (err, socketOptions) {
        if (err) {
            return callback(err);
        }

        var options = this.options;
        if (socketOptions && socketOptions.connection) {
            this.logger.info('Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
            // only copy options if we need to modify it
            options = assign(false, options);
            Object.keys(socketOptions).forEach(function (key) {
                options[key] = socketOptions[key];
            });
        }

        var connection = new SMTPConnection(options);
        var returned = false;

        connection.once('error', function (err) {
            if (returned) {
                return;
            }
            returned = true;
            connection.close();
            return callback(err);
        });

        connection.once('end', function () {
            if (returned) {
                return;
            }
            returned = true;
            return callback(new Error('Connection closed'));
        });

        var sendMessage = function () {
            var envelope = mail.message.getEnvelope();
            var messageId = (mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
            var recipients = [].concat(envelope.to || []);
            if (recipients.length > 3) {
                recipients.push('...and ' + recipients.splice(2).length + ' more');
            }

            this.logger.info('Sending message <%s> to <%s>', messageId, recipients.join(', '));

            connection.send(envelope, mail.message.createReadStream(), function (err, info) {
                if (returned) {
                    return;
                }
                returned = true;

                connection.close();
                if (err) {
                    return callback(err);
                }
                info.envelope = {
                    from: envelope.from,
                    to: envelope.to
                };
                info.messageId = messageId;
                return callback(null, info);
            });
        }.bind(this);

        connection.connect(function () {
            if (returned) {
                return;
            }

            if (this.options.auth) {
                connection.login(this.options.auth, function (err) {
                    if (returned) {
                        return;
                    }

                    if (err) {
                        returned = true;
                        connection.close();
                        return callback(err);
                    }

                    sendMessage();
                });
            } else {
                sendMessage();
            }
        }.bind(this));
    }.bind(this));
};

/**
 * Verifies SMTP configuration
 *
 * @param {Function} callback Callback function
 */
SMTPTransport.prototype.verify = function (callback) {
    var promise;

    if (!callback && typeof Promise === 'function') {
        promise = new Promise(function (resolve, reject) {
            callback = shared.callbackPromise(resolve, reject);
        });
    }

    this.getSocket(this.options, function (err, socketOptions) {
        if (err) {
            return callback(err);
        }

        var options = this.options;
        if (socketOptions && socketOptions.connection) {
            this.logger.info('Using proxied socket from %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort);
            options = assign(false, options);
            Object.keys(socketOptions).forEach(function (key) {
                options[key] = socketOptions[key];
            });
        }

        var connection = new SMTPConnection(options);
        var returned = false;

        connection.once('error', function (err) {
            if (returned) {
                return;
            }
            returned = true;
            connection.close();
            return callback(err);
        });

        connection.once('end', function () {
            if (returned) {
                return;
            }
            returned = true;
            return callback(new Error('Connection closed'));
        });

        var finalize = function () {
            if (returned) {
                return;
            }
            returned = true;
            connection.quit();
            return callback(null, true);
        };

        connection.connect(function () {
            if (returned) {
                return;
            }

            if (this.options.auth) {
                connection.login(this.options.auth, function (err) {
                    if (returned) {
                        return;
                    }

                    if (err) {
                        returned = true;
                        connection.close();
                        return callback(err);
                    }

                    finalize();
                });
            } else {
                finalize();
            }
        }.bind(this));
    }.bind(this));

    return promise;
};

/**
 * Copies properties from source objects to target objects
 */
function assign( /* target, ... sources */ ) {
    var args = Array.prototype.slice.call(arguments);
    var target = args.shift() || {};

    args.forEach(function (source) {
        Object.keys(source || {}).forEach(function (key) {
            if (['tls', 'auth'].indexOf(key) >= 0 && source[key] && typeof source[key] === 'object') {
                // tls and auth are special keys that need to be enumerated separately
                // other objects are passed as is
                if (!target[key]) {
                    // esnure that target has this key
                    target[key] = {};
                }
                Object.keys(source[key]).forEach(function (subKey) {
                    target[key][subKey] = source[key][subKey];
                });
            } else {
                target[key] = source[key];
            }
        });
    });
    return target;
}
