'use strict';

var SMTPConnection = require('smtp-connection');
var packageData = require('../package.json');
var wellknown = require('nodemailer-wellknown');
var assign = require('./assign');
var PoolResource = require('./pool-resource');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var shared = require('nodemailer-shared');

// expose to the world
module.exports = function (options) {
    return new SMTPPool(options);
};

/**
 * Creates a SMTP pool transport object for Nodemailer
 *
 * @constructor
 * @param {Object} options SMTP Connection options
 */
function SMTPPool(options) {
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

    this.options.maxConnections = this.options.maxConnections || 5;
    this.options.maxMessages = this.options.maxMessages || 100;

    this.logger = this.options.logger = shared.getLogger(this.options);

    // temporary object
    var connection = new SMTPConnection(this.options);

    this.name = 'SMTP (pool)';
    this.version = packageData.version + '[client:' + connection.version + ']';

    this._rateLimit = {
        counter: 0,
        timeout: null,
        waiting: [],
        checkpoint: false
    };
    this._closed = false;
    this._queue = [];
    this._connections = [];
    this._connectionCounter = 0;

    this.idling = true;

    setImmediate(function () {
        if (this.idling) {
            this.emit('idle');
        }
    }.bind(this));
}
util.inherits(SMTPPool, EventEmitter);

/**
 * Placeholder function for creating proxy sockets. This method immediatelly returns
 * without a socket
 *
 * @param {Object} options Connection options
 * @param {Function} callback Callback function to run with the socket keys
 */
SMTPPool.prototype.getSocket = function (options, callback) {
    // return immediatelly
    return callback(null, false);
};

/**
 * Queues an e-mail to be sent using the selected settings
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function
 */
SMTPPool.prototype.send = function (mail, callback) {
    if (this._closed) {
        return false;
    }

    this._queue.push({
        mail: mail,
        callback: callback
    });

    if (this.idling && this._queue.length >= this.options.maxConnections) {
        this.idling = false;
    }

    setImmediate(this._processMessages.bind(this));

    return true;
};

/**
 * Closes all connections in the pool. If there is a message being sent, the connection
 * is closed later
 */
SMTPPool.prototype.close = function () {
    var connection;
    var len = this._connections.length;
    this._closed = true;

    // clear rate limit timer if it exists
    clearTimeout(this._rateLimit.timeout);

    // remove all available connections
    for (var i = len - 1; i >= 0; i--) {
        if (this._connections[i] && this._connections[i].available) {
            connection = this._connections[i];
            connection.close();
            this.logger.info('Connection #%s removed', connection.id);
        }
    }

    if (len && !this._connections.length) {
        this.logger.debug('All connections removed');
    }

    // make sure that entire queue would be cleaned
    var invokeCallbacks = function () {
        if (!this._queue.length) {
            this.logger.debug('Pending queue elements cleared');
            return;
        }
        var element = this._queue.shift();
        if (element && typeof element.callback === 'function') {
            try {
                element.callback(new Error('Connection pool was closed'));
            } catch (E) {
                this.logger.error('Callback error for #%s: %s', connection.id, E.message);
            }
        }
        setImmediate(invokeCallbacks);
    }.bind(this);
    setImmediate(invokeCallbacks);
};

/**
 * Check the queue and available connections. If there is a message to be sent and there is
 * an available connection, then use this connection to send the mail
 */
SMTPPool.prototype._processMessages = function () {
    var connection;
    var i, len;

    // do nothing if already closed
    if (this._closed) {
        return;
    }

    // do nothing if queue is empty
    if (!this._queue.length) {
        if (!this.idling) {
            // no pending jobs
            this.idling = true;
            this.emit('idle');
        }
        return;
    }

    // find first available connection
    for (i = 0, len = this._connections.length; i < len; i++) {
        if (this._connections[i].available) {
            connection = this._connections[i];
            break;
        }
    }

    if (!connection && this._connections.length < this.options.maxConnections) {
        connection = this._createConnection();
    }

    if (!connection) {
        // no more free connection slots available
        this.idling = false;
        return;
    }

    // check if there is free space in the processing queue
    if (!this.idling && this._queue.length < this.options.maxConnections) {
        this.idling = true;
        this.emit('idle');
    }

    var element = connection.queueElement = this._queue.shift();
    element.messageId = (connection.queueElement.mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');

    connection.available = false;

    this.logger.debug('Assigned message <%s> to #%s (%s)', element.messageId, connection.id, connection.messages + 1);

    if (this.options.rateLimit) {
        this._rateLimit.counter++;
        if (!this._rateLimit.checkpoint) {
            this._rateLimit.checkpoint = Date.now();
        }
    }

    connection.send(element.mail, function (err, info) {
        // only process callback if current handler is not changed
        if (element === connection.queueElement) {
            try {
                element.callback(err, info);
            } catch (E) {
                this.logger.error('Callback error for #%s: %s', connection.id, E.message);
            }
            connection.queueElement = false;
        }
    }.bind(this));
};

/**
 * Creates a new pool resource
 */
SMTPPool.prototype._createConnection = function () {
    var connection = new PoolResource(this);

    connection.id = ++this._connectionCounter;

    this.logger.info('Created new pool resource #%s', connection.id);

    // resource comes available
    connection.on('available', function () {
        this.logger.debug('Connection #%s became available', connection.id);

        if (this._closed) {
            // if already closed run close() that will remove this connections from connections list
            this.close();
        } else {
            // check if there's anything else to send
            this._processMessages();
        }
    }.bind(this));

    // resource is terminated with an error
    connection.once('error', function (err) {
        if (err.code !== 'EMAXLIMIT') {
            this.logger.error('Pool Error for #%s: %s', connection.id, err.message);
        } else {
            this.logger.debug('Max messages limit exchausted for #%s', connection.id);
        }

        if (connection.queueElement) {
            try {
                connection.queueElement.callback(err);
            } catch (E) {
                this.logger.error('Callback error for #%s: %s', connection.id, E.message);
            }
            connection.queueElement = false;
        }

        // remove the erroneus connection from connections list
        this._removeConnection(connection);

        this._continueProcessing();
    }.bind(this));

    connection.once('close', function () {
        this.logger.info('Connection #%s was closed', connection.id);

        this._removeConnection(connection);

        if (connection.queueElement) {
            // If the connection closed when sending, add the message to the queue again
            // Note that we must wait a bit.. because the callback of the 'error' handler might be called
            // in the next event loop
            setTimeout(function () {
                if (connection.queueElement) {
                    this.logger.debug('Re-queued message <%s> for #%s', connection.queueElement.messageId, connection.id);
                    this._queue.unshift(connection.queueElement);
                    connection.queueElement = false;
                }
                this._continueProcessing();
            }.bind(this), 50);
        } else {
            this._continueProcessing();
        }
    }.bind(this));

    this._connections.push(connection);

    return connection;
};

/**
 * Continue to process message if the pool hasn't closed
 */
SMTPPool.prototype._continueProcessing = function () {
    if (this._closed) {
        this.close();
    } else {
        setTimeout(this._processMessages.bind(this), 100);
    }
};

/**
 * Remove resource from pool
 *
 * @param {Object} connection The PoolResource to remove
 */
SMTPPool.prototype._removeConnection = function (connection) {
    var index = this._connections.indexOf(connection);

    if (index !== -1) {
        this._connections.splice(index, 1);
    }
};

/**
 * Checks if connections have hit current rate limit and if so, queues the availability callback
 *
 * @param {Function} callback Callback function to run once rate limiter has been cleared
 */
SMTPPool.prototype._checkRateLimit = function (callback) {
    if (!this.options.rateLimit) {
        return callback();
    }

    var now = Date.now();

    if (this._rateLimit.counter < this.options.rateLimit) {
        return callback();
    }

    this._rateLimit.waiting.push(callback);

    if (this._rateLimit.checkpoint <= now - 1000) {
        return this._clearRateLimit();
    } else if (!this._rateLimit.timeout) {
        this._rateLimit.timeout = setTimeout(this._clearRateLimit.bind(this), 1000 - (now - this._rateLimit.checkpoint));
        this._rateLimit.checkpoint = now;
    }
};

/**
 * Clears current rate limit limitation and runs paused callback
 */
SMTPPool.prototype._clearRateLimit = function () {
    clearTimeout(this._rateLimit.timeout);
    this._rateLimit.timeout = null;
    this._rateLimit.counter = 0;
    this._rateLimit.checkpoint = false;

    // resume all paused connections
    while (this._rateLimit.waiting.length) {
        var cb = this._rateLimit.waiting.shift();
        setImmediate(cb);
    }
};

/**
 * Returns true if there are free slots in the queue
 */
SMTPPool.prototype.isIdle = function () {
    return this.idling;
};

/**
 * Verifies SMTP configuration
 *
 * @param {Function} callback Callback function
 */
SMTPPool.prototype.verify = function (callback) {
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
            this.logger.info('Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
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
