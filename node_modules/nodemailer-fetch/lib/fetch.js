'use strict';

var http = require('http');
var https = require('https');
var urllib = require('url');
var zlib = require('zlib');
var PassThrough = require('stream').PassThrough;
var Cookies = require('./cookies');

var MAX_REDIRECTS = 5;

module.exports = function (url, options) {
    return fetch(url, options);
};

module.exports.Cookies = Cookies;

function fetch(url, options) {
    options = options || {};

    options.fetchRes = options.fetchRes || new PassThrough();
    options.cookies = options.cookies || new Cookies();
    options.redirects = options.redirects || 0;
    options.maxRedirects = isNaN(options.maxRedirects) ? MAX_REDIRECTS : options.maxRedirects;

    if (options.cookie) {
        [].concat(options.cookie || []).forEach(function (cookie) {
            options.cookies.set(cookie, url);
        });
        options.cookie = false;
    }

    var fetchRes = options.fetchRes;
    var parsed = urllib.parse(url);
    var method = (options.method || '').toString().trim().toUpperCase() || 'GET';
    var finished = false;
    var cookies;
    var body;

    var handler = parsed.protocol === 'https:' ? https : http;

    var headers = {
        'accept-encoding': 'gzip,deflate'
    };

    Object.keys(options.headers || {}).forEach(function (key) {
        headers[key.toLowerCase().trim()] = options.headers[key];
    });

    if (options.userAgent) {
        headers['User-Agent'] = options.userAgent;
    }

    if (parsed.auth) {
        headers.Authorization = 'Basic ' + new Buffer(parsed.auth).toString('base64');
    }

    if ((cookies = options.cookies.get(url))) {
        headers.cookie = cookies;
    }

    if (options.body) {
        if (options.contentType !== false) {
            headers['Content-Type'] = options.contentType || 'application/x-www-form-urlencoded';
        }

        if (typeof options.body.pipe === 'function') {
            // it's a stream
            headers['Transfer-Encoding'] = 'chunked';
            body = options.body;
            body.on('error', function (err) {
                if (finished) {
                    return;
                }
                finished = true;
                fetchRes.emit('error', err);
            });
        } else {
            if (options.body instanceof Buffer) {
                body = options.body;
            } else if (typeof options.body === 'object') {
                body = new Buffer(Object.keys(options.body).map(function (key) {
                    var value = options.body[key].toString().trim();
                    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
                }).join('&'));
            } else {
                body = new Buffer(options.body.toString().trim());
            }

            headers['Content-Type'] = options.contentType || 'application/x-www-form-urlencoded';
            headers['Content-Length'] = body.length;
        }
        // if method is not provided, use POST instead of GET
        method = (options.method || '').toString().trim().toUpperCase() || 'POST';
    }

    var req;
    var reqOptions = {
        method: method,
        host: parsed.hostname,
        path: parsed.path,
        port: parsed.port ? parsed.port : (parsed.protocol === 'https:' ? 443 : 80),
        headers: headers,
        rejectUnauthorized: false,
        agent: false
    };

    if (options.tls) {
        Object.keys(options.tls).forEach(function (key) {
            reqOptions[key] = options.tls[key];
        });
    }

    try {
        req = handler.request(reqOptions);
    } catch (E) {
        finished = true;
        setImmediate(function () {
            fetchRes.emit('error', E);
        });
        return fetchRes;
    }

    if (options.timeout) {
        req.setTimeout(options.timeout, function () {
            if (finished) {
                return;
            }
            finished = true;
            req.abort();
            fetchRes.emit('error', new Error('Request Tiemout'));
        });
    }

    req.on('error', function (err) {
        if (finished) {
            return;
        }
        finished = true;
        fetchRes.emit('error', err);
    });

    req.on('response', function (res) {
        var inflate;

        if (finished) {
            return;
        }

        switch (res.headers['content-encoding']) {
            case 'gzip':
            case 'deflate':
                inflate = zlib.createUnzip();
                break;
        }

        if (res.headers['set-cookie']) {
            [].concat(res.headers['set-cookie'] || []).forEach(function (cookie) {
                options.cookies.set(cookie, url);
            });
        }

        if ([301, 302, 303, 307, 308].indexOf(res.statusCode) >= 0 && res.headers.location) {
            // redirect
            options.redirects++;
            if (options.redirects > options.maxRedirects) {
                finished = true;
                fetchRes.emit('error', new Error('Maximum redirect count exceeded'));
                req.abort();
                return;
            }
            return fetch(urllib.resolve(url, res.headers.location), options);
        }

        if (res.statusCode >= 300) {
            finished = true;
            fetchRes.emit('error', new Error('Invalid status code ' + res.statusCode));
            req.abort();
            return;
        }

        res.on('error', function (err) {
            if (finished) {
                return;
            }
            finished = true;
            fetchRes.emit('error', err);
            req.abort();
        });

        if (inflate) {
            res.pipe(inflate).pipe(fetchRes);
            inflate.on('error', function (err) {
                if (finished) {
                    return;
                }
                finished = true;
                fetchRes.emit('error', err);
                req.abort();
            });
        } else {
            res.pipe(fetchRes);
        }
    });

    setImmediate(function () {
        if (body) {
            try {
                if (typeof body.pipe === 'function') {
                    return body.pipe(req);
                } else {
                    req.write(body);
                }
            } catch (err) {
                finished = true;
                fetchRes.emit('error', err);
                return;
            }
        }
        req.end();
    });

    return fetchRes;
}
