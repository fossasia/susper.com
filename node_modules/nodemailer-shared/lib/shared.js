'use strict';

var urllib = require('url');
var util = require('util');
var fs = require('fs');
var fetch = require('nodemailer-fetch');

/**
 * Parses connection url to a structured configuration object
 *
 * @param {String} str Connection url
 * @return {Object} Configuration object
 */
module.exports.parseConnectionUrl = function (str) {
    str = str || '';
    var options = {};

    [urllib.parse(str, true)].forEach(function (url) {
        var auth;

        switch (url.protocol) {
            case 'smtp:':
                options.secure = false;
                break;
            case 'smtps:':
                options.secure = true;
                break;
            case 'direct:':
                options.direct = true;
                break;
        }

        if (!isNaN(url.port) && Number(url.port)) {
            options.port = Number(url.port);
        }

        if (url.hostname) {
            options.host = url.hostname;
        }

        if (url.auth) {
            auth = url.auth.split(':');

            if (!options.auth) {
                options.auth = {};
            }

            options.auth.user = auth.shift();
            options.auth.pass = auth.join(':');
        }

        Object.keys(url.query || {}).forEach(function (key) {
            var obj = options;
            var lKey = key;
            var value = url.query[key];

            if (!isNaN(value)) {
                value = Number(value);
            }

            switch (value) {
                case 'true':
                    value = true;
                    break;
                case 'false':
                    value = false;
                    break;
            }

            // tls is nested object
            if (key.indexOf('tls.') === 0) {
                lKey = key.substr(4);
                if (!options.tls) {
                    options.tls = {};
                }
                obj = options.tls;
            } else if (key.indexOf('.') >= 0) {
                // ignore nested properties besides tls
                return;
            }

            if (!(lKey in obj)) {
                obj[lKey] = value;
            }
        });
    });

    return options;
};

/**
 * Returns a bunyan-compatible logger interface. Uses either provided logger or
 * creates a default console logger
 *
 * @param {Object} [options] Options object that might include 'logger' value
 * @return {Object} bunyan compatible logger
 */
module.exports.getLogger = function (options) {
    options = options || {};

    if (!options.logger) {
        // use vanity logger
        return {
            info: function () {},
            debug: function () {},
            error: function () {}
        };
    }

    if (options.logger === true) {
        // create console logger
        return createDefaultLogger();
    }

    // return whatever was passed
    return options.logger;
};

/**
 * Wrapper for creating a callback than either resolves or rejects a promise
 * based on input
 *
 * @param {Function} resolve Function to run if callback is called
 * @param {Function} reject Function to run if callback ends with an error
 */
module.exports.callbackPromise = function (resolve, reject) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        var err = args.shift();
        if (err) {
            reject(err);
        } else {
            resolve.apply(null, args);
        }
    };
};

/**
 * Resolves a String or a Buffer value for content value. Useful if the value
 * is a Stream or a file or an URL. If the value is a Stream, overwrites
 * the stream object with the resolved value (you can't stream a value twice).
 *
 * This is useful when you want to create a plugin that needs a content value,
 * for example the `html` or `text` value as a String or a Buffer but not as
 * a file path or an URL.
 *
 * @param {Object} data An object or an Array you want to resolve an element for
 * @param {String|Number} key Property name or an Array index
 * @param {Function} callback Callback function with (err, value)
 */
module.exports.resolveContent = function (data, key, callback) {
    var promise;

    if (!callback && typeof Promise === 'function') {
        promise = new Promise(function (resolve, reject) {
            callback = module.exports.callbackPromise(resolve, reject);
        });
    }

    var content = data && data[key] && data[key].content || data[key];
    var contentStream;
    var encoding = (typeof data[key] === 'object' && data[key].encoding || 'utf8')
        .toString()
        .toLowerCase()
        .replace(/[-_\s]/g, '');

    if (!content) {
        return callback(null, content);
    }

    if (typeof content === 'object') {
        if (typeof content.pipe === 'function') {
            return resolveStream(content, function (err, value) {
                if (err) {
                    return callback(err);
                }
                // we can't stream twice the same content, so we need
                // to replace the stream object with the streaming result
                data[key] = value;
                callback(null, value);
            });
        } else if (/^https?:\/\//i.test(content.path || content.href)) {
            contentStream = fetch(content.path || content.href);
            return resolveStream(contentStream, callback);
        } else if (/^data:/i.test(content.path || content.href)) {
            var parts = (content.path || content.href).match(/^data:((?:[^;]*;)*(?:[^,]*)),(.*)$/i);
            if (!parts) {
                return callback(null, new Buffer(0));
            }
            return callback(null, /\bbase64$/i.test(parts[1]) ? new Buffer(parts[2], 'base64') : new Buffer(decodeURIComponent(parts[2])));
        } else if (content.path) {
            return resolveStream(fs.createReadStream(content.path), callback);
        }
    }

    if (typeof data[key].content === 'string' && ['utf8', 'usascii', 'ascii'].indexOf(encoding) < 0) {
        content = new Buffer(data[key].content, encoding);
    }

    // default action, return as is
    setImmediate(callback.bind(null, null, content));

    return promise;
};

/**
 * Streams a stream value into a Buffer
 *
 * @param {Object} stream Readable stream
 * @param {Function} callback Callback function with (err, value)
 */
function resolveStream(stream, callback) {
    var responded = false;
    var chunks = [];
    var chunklen = 0;

    stream.on('error', function (err) {
        if (responded) {
            return;
        }

        responded = true;
        callback(err);
    });

    stream.on('readable', function () {
        var chunk;
        while ((chunk = stream.read()) !== null) {
            chunks.push(chunk);
            chunklen += chunk.length;
        }
    });

    stream.on('end', function () {
        if (responded) {
            return;
        }
        responded = true;

        var value;

        try {
            value = Buffer.concat(chunks, chunklen);
        } catch (E) {
            return callback(E);
        }
        callback(null, value);
    });
}

/**
 * Generates a bunyan-like logger that prints to console
 *
 * @returns {Object} Bunyan logger instance
 */
function createDefaultLogger() {

    var logger = {
        _print: function ( /* level, message */ ) {
            var args = Array.prototype.slice.call(arguments);
            var level = args.shift();
            var message;

            if (args.length > 1) {
                message = util.format.apply(util, args);
            } else {
                message = args.shift();
            }

            console.log('[%s] %s: %s',
                new Date().toISOString().substr(0, 19).replace(/T/, ' '),
                level.toUpperCase(),
                message);
        }
    };

    logger.info = logger._print.bind(null, 'info');
    logger.debug = logger._print.bind(null, 'debug');
    logger.error = logger._print.bind(null, 'error');

    return logger;
}
