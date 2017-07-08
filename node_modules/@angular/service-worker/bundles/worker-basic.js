(function () {
'use strict';

var BrowserClock = (function () {
    function BrowserClock() {
    }
    BrowserClock.prototype.dateNow = function () {
        return Date.now();
    };
    BrowserClock.prototype.setTimeout = function (fn, delay) {
        return setTimeout(fn, delay);
    };
    return BrowserClock;
}());

var NgSwCacheImpl = (function () {
    function NgSwCacheImpl(caches, adapter) {
        this.caches = caches;
        this.adapter = adapter;
    }
    NgSwCacheImpl.prototype.normalize = function (req) {
        if (typeof req == 'string') {
            return this.adapter.newRequest(req);
        }
        return req;
    };
    NgSwCacheImpl.prototype.load = function (cache, req) {
        var _this = this;
        return this.caches.open(cache)
            .then(function (cache) { return cache.match(_this.normalize(req)); });
    };
    NgSwCacheImpl.prototype.store = function (cache, req, resp) {
        var _this = this;
        return this.caches.open(cache)
            .then(function (cache) { return cache.put(_this.normalize(req), resp); });
    };
    NgSwCacheImpl.prototype.invalidate = function (cache, req) {
        var _this = this;
        return this.caches.open(cache)
            .then(function (cache) { return cache.delete(_this.normalize(req)); });
    };
    NgSwCacheImpl.prototype.remove = function (cache) {
        return this.caches.delete(cache);
    };
    NgSwCacheImpl.prototype.keys = function () {
        return this.caches.keys();
    };
    NgSwCacheImpl.prototype.keysOf = function (cache) {
        return this.caches.open(cache)
            .then(function (cache) { return cache.keys(); });
    };
    return NgSwCacheImpl;
}());

function nop(event) { }
var NgSwEvents = (function () {
    function NgSwEvents(scope) {
        var _this = this;
        this.install = nop;
        this.activate = nop;
        this.fetch = nop;
        this.message = nop;
        this.push = nop;
        scope.addEventListener('install', function (event) { return _this.install(event); });
        scope.addEventListener('activate', function (event) { return _this.activate(event); });
        scope.addEventListener('fetch', function (event) { return _this.fetch(event); });
        scope.addEventListener('message', function (event) { return _this.message(event); });
        scope.addEventListener('push', function (event) { return _this.push(event); });
    }
    return NgSwEvents;
}());

var NgSwFetch = (function () {
    function NgSwFetch(scope, adapter) {
        this.scope = scope;
        this.adapter = adapter;
    }
    NgSwFetch.prototype._request = function (req) {
        var _this = this;
        return this
            .scope
            .fetch(req)
            .catch(function (err) { return _this.adapter.newResponse('', { status: 503 }); });
    };
    NgSwFetch.prototype._followRedirectIfAny = function (resp, limit, origUrl) {
        var _this = this;
        if (!!resp['redirected']) {
            if (limit <= 0) {
                return Promise.reject("Hit redirect limit when attempting to fetch " + origUrl + ".");
            }
            if (!resp.url) {
                return resp;
            }
            return this
                ._request(this.adapter.newRequest(resp.url))
                .then(function (newResp) { return _this._followRedirectIfAny(newResp, limit - 1, origUrl); });
        }
        return resp;
    };
    NgSwFetch.prototype.request = function (req, redirectSafe) {
        var _this = this;
        if (redirectSafe === void 0) { redirectSafe = false; }
        if (!redirectSafe) {
            return this._request(req);
        }
        return this._request(req).then(function (resp) { return _this._followRedirectIfAny(resp, 3, req.url); });
    };
    NgSwFetch.prototype.refresh = function (req) {
        var request;
        if (typeof req == 'string') {
            request = this.adapter.newRequest(this._cacheBust(req));
        }
        else {
            request = this.adapter.newRequest(this._cacheBust(req.url), req);
        }
        return this.request(request, false);
    };
    NgSwFetch.prototype._cacheBust = function (url) {
        var bust = Math.random();
        if (url.indexOf('?') == -1) {
            return url + "?ngsw-cache-bust=" + bust;
        }
        return url + "&ngsw-cache-bust=" + bust;
    };
    return NgSwFetch;
}());

function cacheFromNetworkOp(worker, url, cache, cacheBust) {
    if (cacheBust === void 0) { cacheBust = true; }
    var limit = 3;
    var helper = function (url) {
        if (limit-- === 0) {
            return Promise.reject("Hit redirect limit when attempting to fetch " + url + ".");
        }
        var req = worker.adapter.newRequest(url);
        var reqPromise = null;
        return worker.refresh(req, cacheBust).then(function (res) {
            if (res['redirected'] && res.url && res.url !== '') {
                return helper(res.url);
            }
            return res;
        });
    };
    var op = function () { return helper(url)
        .then(function (resp) { return worker.cache.store(cache, url, resp); }); };
    op.desc = { type: 'cacheFromNetworkOp', worker: worker, url: url, cache: cache };
    return op;
}
function copyExistingCacheOp(oldWorker, newWorker, url, cache) {
    var op = function () { return oldWorker
        .cache
        .load(cache, url)
        .then(function (resp) { return !!resp
        ? newWorker.cache.store(cache, url, resp).then(function () { return true; })
        : null; }); };
    op.desc = { type: 'copyExistingCacheOp', oldWorker: oldWorker, newWorker: newWorker, url: url, cache: cache };
    return op;
}
function copyExistingOrFetchOp(oldWorker, newWorker, url, cache) {
    var op = function () { return copyExistingCacheOp(oldWorker, newWorker, url, cache)()
        .then(function (res) {
        if (!res) {
            return cacheFromNetworkOp(newWorker, url, cache)();
        }
        return res;
    }); };
    op.desc = { type: 'copyExistingOrFetchOp', oldWorker: oldWorker, newWorker: newWorker, url: url, cache: cache };
    return op;
}
function deleteCacheOp(worker, key) {
    var op = function () { return worker.cache.remove(key); };
    op.desc = { type: 'deleteCacheOp', worker: worker, key: key };
    return op;
}
function fetchFromCacheInstruction(worker, req, cache) {
    var op = function (next) { return worker.cache.load(cache, req)
        .then(function (res) { return !!res ? res : next(); }); };
    op.desc = { type: 'fetchFromCacheInstruction', worker: worker, req: req, cache: cache };
    return op;
}
function fetchFromNetworkInstruction(worker, req, shouldRefresh) {
    if (shouldRefresh === void 0) { shouldRefresh = true; }
    var op = function (next) { return shouldRefresh ? worker.refresh(req) : worker.scope.fetch(req); };
    op.desc = { type: 'fetchFromNetworkInstruction', worker: worker, req: req };
    return op;
}
function rewriteUrlInstruction(worker, req, destUrl) {
    var newReq = worker.adapter.newRequest(destUrl);
    var op = function (next) { return worker.fetch(newReq); };
    op.desc = { type: 'rewriteUrlInstruction', worker: worker, req: req, destUrl: destUrl };
    return op;
}

var VersionWorkerImpl = (function () {
    function VersionWorkerImpl(streamController, scope, manifest, adapter, cache, clock, fetcher, plugins) {
        this.streamController = streamController;
        this.scope = scope;
        this.manifest = manifest;
        this.adapter = adapter;
        this.cache = cache;
        this.clock = clock;
        this.fetcher = fetcher;
        this.plugins = plugins;
    }
    VersionWorkerImpl.prototype.refresh = function (req, cacheBust) {
        if (cacheBust === void 0) { cacheBust = true; }
        if (cacheBust) {
            return this.fetcher.refresh(req);
        }
        else {
            return this.fetcher.request(req);
        }
    };
    VersionWorkerImpl.prototype.fetch = function (req) {
        var _this = this;
        var fromNetwork = fetchFromNetworkInstruction(this, req, false);
        return this
            .plugins
            .filter(function (plugin) { return !!plugin.fetch; })
            .map(function (plugin) { return plugin.fetch(req); })
            .filter(function (instruction) { return !!instruction; })
            .reduceRight(function (delegate, curr) { return function () { return curr(delegate); }; }, function () { return _this.fetcher.request(req, true); })();
    };
    VersionWorkerImpl.prototype.validate = function () {
        return Promise
            .all(this
            .plugins
            .filter(function (plugin) { return !!plugin.validate; })
            .map(function (plugin) { return plugin.validate(); }))
            .then(function (results) { return results.every(function (v) { return v; }); });
    };
    VersionWorkerImpl.prototype.setup = function (previous) {
        var operations = [];
        for (var i = 0; i < this.plugins.length; i++) {
            var plugin = this.plugins[i];
            if (plugin.update && previous) {
                plugin.update(operations, previous.plugins[i]);
            }
            else {
                plugin.setup(operations);
            }
        }
        return operations.reduce(function (prev, curr) { return prev.then(function () { return curr(); }); }, Promise.resolve(null));
    };
    VersionWorkerImpl.prototype.cleanup = function () {
        return this.plugins.reduce(function (ops, plugin) {
            if (plugin.cleanup) {
                plugin.cleanup(ops);
            }
            return ops;
        }, []);
    };
    VersionWorkerImpl.prototype.message = function (message, id) {
        this
            .plugins
            .filter(function (plugin) { return !!plugin.message; })
            .forEach(function (plugin) { return plugin.message(message, id); });
    };
    VersionWorkerImpl.prototype.messageClosed = function (id) {
        this
            .plugins
            .filter(function (plugin) { return !!plugin.messageClosed; })
            .forEach(function (plugin) { return plugin.messageClosed(id); });
    };
    VersionWorkerImpl.prototype.sendToStream = function (id, message) {
        this.streamController.sendToStream(id, message);
    };
    VersionWorkerImpl.prototype.closeStream = function (id) {
        this.streamController.closeStream(id);
    };
    VersionWorkerImpl.prototype.push = function (data) {
        this
            .plugins
            .filter(function (plugin) { return !!plugin.push; })
            .forEach(function (plugin) { return plugin.push(data); });
    };
    VersionWorkerImpl.prototype.showNotification = function (title, options) {
        this.scope.registration.showNotification(title, options);
    };
    return VersionWorkerImpl;
}());

var ScopedCache = (function () {
    function ScopedCache(delegate, prefix) {
        this.delegate = delegate;
        this.prefix = prefix;
    }
    ScopedCache.prototype.load = function (cache, req) {
        return this.delegate.load(this.prefix + cache, req);
    };
    ScopedCache.prototype.store = function (cache, req, resp) {
        return this.delegate.store(this.prefix + cache, req, resp);
    };
    ScopedCache.prototype.remove = function (cache) {
        return this.delegate.remove(this.prefix + cache);
    };
    ScopedCache.prototype.invalidate = function (cache, req) {
        return this.delegate.invalidate(this.prefix + cache, req);
    };
    ScopedCache.prototype.keys = function () {
        var _this = this;
        return this
            .delegate
            .keys()
            .then(function (keys) { return keys
            .filter(function (key) { return key.startsWith(_this.prefix); })
            .map(function (key) { return key.substr(_this.prefix.length); }); });
    };
    ScopedCache.prototype.keysOf = function (cache) {
        return this
            .delegate
            .keysOf(this.prefix + cache);
    };
    return ScopedCache;
}());

var Verbosity;
(function (Verbosity) {
    Verbosity[Verbosity["DEBUG"] = 1] = "DEBUG";
    Verbosity[Verbosity["TECHNICAL"] = 2] = "TECHNICAL";
    Verbosity[Verbosity["INFO"] = 3] = "INFO";
    Verbosity[Verbosity["STATUS"] = 4] = "STATUS";
    Verbosity[Verbosity["DISABLED"] = 1000] = "DISABLED";
})(Verbosity || (Verbosity = {}));
var Logger = (function () {
    function Logger() {
        this.buffer = [];
        this.verbosity = Verbosity.DISABLED;
        this.messages = function () { return null; };
    }
    Logger.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._log(Verbosity.DEBUG, message, args);
    };
    Logger.prototype.technical = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._log(Verbosity.TECHNICAL, message, args);
    };
    Logger.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._log(Verbosity.INFO, message, args);
    };
    Logger.prototype.status = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._log(Verbosity.STATUS, message, args);
    };
    Logger.prototype.log = function (verbosity, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this._log(verbosity, message, args);
    };
    Logger.prototype.setVerbosity = function (verbosity) {
        this.verbosity = verbosity;
    };
    Logger.prototype.release = function () {
        var _this = this;
        this.buffer.forEach(function (entry) { return _this.messages(entry); });
        this.buffer = null;
    };
    Logger.prototype._log = function (verbosity, start, args) {
        var _this = this;
        var message = start;
        if (args.length > 0) {
            message = start + " " + args.map(function (v) { return _this._serialize(v); }).join(' ');
        }
        if (verbosity < this.verbosity) {
            // Skip this message.
            return;
        }
        if (this.buffer !== null) {
            this.buffer.push({ verbosity: verbosity, message: message });
        }
        else {
            this.messages({ verbosity: verbosity, message: message });
        }
    };
    Logger.prototype._serialize = function (v) {
        if (typeof v !== 'object') {
            return "" + v;
        }
        return JSON.stringify(v);
    };
    return Logger;
}());
var ConsoleHandler = (function () {
    function ConsoleHandler() {
    }
    ConsoleHandler.prototype.handle = function (entry) {
        console.log(Verbosity[entry.verbosity].toString() + ": " + entry.message);
    };
    return ConsoleHandler;
}());
var HttpHandler = (function () {
    function HttpHandler(url) {
        this.url = url;
    }
    HttpHandler.prototype.handle = function (entry) {
        fetch(this.url, { body: Verbosity[entry.verbosity].toString() + ": " + entry.message, method: 'POST' });
    };
    return HttpHandler;
}());
var LOGGER = new Logger();
var LOG = LOGGER;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var hashes = createCommonjsModule(function (module, exports) {
/**
 * jshashes - https://github.com/h2non/jshashes
 * Released under the "New BSD" license
 *
 * Algorithms specification:
 *
 * MD5 - http://www.ietf.org/rfc/rfc1321.txt
 * RIPEMD-160 - http://homes.esat.kuleuven.be/~bosselae/ripemd160.html
 * SHA1   - http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 * SHA256 - http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 * SHA512 - http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 * HMAC - http://www.ietf.org/rfc/rfc2104.txt
 */
(function() {
  var Hashes;

  function utf8Encode(str) {
    var x, y, output = '',
      i = -1,
      l;

    if (str && str.length) {
      l = str.length;
      while ((i += 1) < l) {
        /* Decode utf-16 surrogate pairs */
        x = str.charCodeAt(i);
        y = i + 1 < l ? str.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
          x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
          i += 1;
        }
        /* Encode output as utf-8 */
        if (x <= 0x7F) {
          output += String.fromCharCode(x);
        } else if (x <= 0x7FF) {
          output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
            0x80 | (x & 0x3F));
        } else if (x <= 0xFFFF) {
          output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
            0x80 | ((x >>> 6) & 0x3F),
            0x80 | (x & 0x3F));
        } else if (x <= 0x1FFFFF) {
          output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
            0x80 | ((x >>> 12) & 0x3F),
            0x80 | ((x >>> 6) & 0x3F),
            0x80 | (x & 0x3F));
        }
      }
    }
    return output;
  }

  function utf8Decode(str) {
    var i, ac, c1, c2, c3, arr = [],
      l;
    i = ac = c1 = c2 = c3 = 0;

    if (str && str.length) {
      l = str.length;
      str += '';

      while (i < l) {
        c1 = str.charCodeAt(i);
        ac += 1;
        if (c1 < 128) {
          arr[ac] = String.fromCharCode(c1);
          i += 1;
        } else if (c1 > 191 && c1 < 224) {
          c2 = str.charCodeAt(i + 1);
          arr[ac] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = str.charCodeAt(i + 1);
          c3 = str.charCodeAt(i + 2);
          arr[ac] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
    }
    return arr.join('');
  }

  /**
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */

  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
      msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /**
   * Bitwise rotate a 32-bit number to the left.
   */

  function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /**
   * Convert a raw string to a hex string
   */

  function rstr2hex(input, hexcase) {
    var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef',
      output = '',
      x, i = 0,
      l = input.length;
    for (; i < l; i += 1) {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
  }

  /**
   * Encode a string as utf-16
   */

  function str2rstr_utf16le(input) {
    var i, l = input.length,
      output = '';
    for (i = 0; i < l; i += 1) {
      output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
    }
    return output;
  }

  function str2rstr_utf16be(input) {
    var i, l = input.length,
      output = '';
    for (i = 0; i < l; i += 1) {
      output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
    }
    return output;
  }

  /**
   * Convert an array of big-endian words to a string
   */

  function binb2rstr(input) {
    var i, l = input.length * 32,
      output = '';
    for (i = 0; i < l; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
    }
    return output;
  }

  /**
   * Convert an array of little-endian words to a string
   */

  function binl2rstr(input) {
    var i, l = input.length * 32,
      output = '';
    for (i = 0; i < l; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
  }

  /**
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */

  function rstr2binl(input) {
    var i, l = input.length * 8,
      output = Array(input.length >> 2),
      lo = output.length;
    for (i = 0; i < lo; i += 1) {
      output[i] = 0;
    }
    for (i = 0; i < l; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return output;
  }

  /**
   * Convert a raw string to an array of big-endian words
   * Characters >255 have their high-byte silently ignored.
   */

  function rstr2binb(input) {
    var i, l = input.length * 8,
      output = Array(input.length >> 2),
      lo = output.length;
    for (i = 0; i < lo; i += 1) {
      output[i] = 0;
    }
    for (i = 0; i < l; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    }
    return output;
  }

  /**
   * Convert a raw string to an arbitrary string encoding
   */

  function rstr2any(input, encoding) {
    var divisor = encoding.length,
      remainders = Array(),
      i, q, x, ld, quotient, dividend, output, full_length;

    /* Convert to an array of 16-bit big-endian values, forming the dividend */
    dividend = Array(Math.ceil(input.length / 2));
    ld = dividend.length;
    for (i = 0; i < ld; i += 1) {
      dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
    }

    /**
     * Repeatedly perform a long division. The binary array forms the dividend,
     * the length of the encoding is the divisor. Once computed, the quotient
     * forms the dividend for the next step. We stop when the dividend is zerHashes.
     * All remainders are stored for later use.
     */
    while (dividend.length > 0) {
      quotient = Array();
      x = 0;
      for (i = 0; i < dividend.length; i += 1) {
        x = (x << 16) + dividend[i];
        q = Math.floor(x / divisor);
        x -= q * divisor;
        if (quotient.length > 0 || q > 0) {
          quotient[quotient.length] = q;
        }
      }
      remainders[remainders.length] = x;
      dividend = quotient;
    }

    /* Convert the remainders to the output string */
    output = '';
    for (i = remainders.length - 1; i >= 0; i--) {
      output += encoding.charAt(remainders[i]);
    }

    /* Append leading zero equivalents */
    full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    for (i = output.length; i < full_length; i += 1) {
      output = encoding[0] + output;
    }
    return output;
  }

  /**
   * Convert a raw string to a base-64 string
   */

  function rstr2b64(input, b64pad) {
    var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      output = '',
      len = input.length,
      i, j, triplet;
    b64pad = b64pad || '=';
    for (i = 0; i < len; i += 3) {
      triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
      for (j = 0; j < 4; j += 1) {
        if (i * 8 + j * 6 > input.length * 8) {
          output += b64pad;
        } else {
          output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
        }
      }
    }
    return output;
  }

  Hashes = {
    /**
     * @property {String} version
     * @readonly
     */
    VERSION: '1.0.6',
    /**
     * @member Hashes
     * @class Base64
     * @constructor
     */
    Base64: function() {
      // private properties
      var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        pad = '=', // default pad according with the RFC standard
        url = false, // URL encoding support @todo
        utf8 = true; // by default enable UTF-8 support encoding

      // public method for encoding
      this.encode = function(input) {
        var i, j, triplet,
          output = '',
          len = input.length;

        pad = pad || '=';
        input = (utf8) ? utf8Encode(input) : input;

        for (i = 0; i < len; i += 3) {
          triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
          for (j = 0; j < 4; j += 1) {
            if (i * 8 + j * 6 > len * 8) {
              output += pad;
            } else {
              output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
          }
        }
        return output;
      };

      // public method for decoding
      this.decode = function(input) {
        // var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var i, o1, o2, o3, h1, h2, h3, h4, bits, ac,
          dec = '',
          arr = [];
        if (!input) {
          return input;
        }

        i = ac = 0;
        input = input.replace(new RegExp('\\' + pad, 'gi'), ''); // use '='
        //input += '';

        do { // unpack four hexets into three octets using index points in b64
          h1 = tab.indexOf(input.charAt(i += 1));
          h2 = tab.indexOf(input.charAt(i += 1));
          h3 = tab.indexOf(input.charAt(i += 1));
          h4 = tab.indexOf(input.charAt(i += 1));

          bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

          o1 = bits >> 16 & 0xff;
          o2 = bits >> 8 & 0xff;
          o3 = bits & 0xff;
          ac += 1;

          if (h3 === 64) {
            arr[ac] = String.fromCharCode(o1);
          } else if (h4 === 64) {
            arr[ac] = String.fromCharCode(o1, o2);
          } else {
            arr[ac] = String.fromCharCode(o1, o2, o3);
          }
        } while (i < input.length);

        dec = arr.join('');
        dec = (utf8) ? utf8Decode(dec) : dec;

        return dec;
      };

      // set custom pad string
      this.setPad = function(str) {
        pad = str || pad;
        return this;
      };
      // set custom tab string characters
      this.setTab = function(str) {
        tab = str || tab;
        return this;
      };
      this.setUTF8 = function(bool) {
        if (typeof bool === 'boolean') {
          utf8 = bool;
        }
        return this;
      };
    },

    /**
     * CRC-32 calculation
     * @member Hashes
     * @method CRC32
     * @static
     * @param {String} str Input String
     * @return {String}
     */
    CRC32: function(str) {
      var crc = 0,
        x = 0,
        y = 0,
        table, i, iTop;
      str = utf8Encode(str);

      table = [
        '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 ',
        '79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 ',
        '84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F ',
        '63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD ',
        'A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC ',
        '51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 ',
        'B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 ',
        '06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 ',
        'E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 ',
        '12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 ',
        'D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 ',
        '33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 ',
        'CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 ',
        '9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E ',
        '7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D ',
        '806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 ',
        '60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA ',
        'AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 ',
        '5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 ',
        'B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 ',
        '05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 ',
        'F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA ',
        '11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 ',
        'D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F ',
        '30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E ',
        'C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D'
      ].join('');

      crc = crc ^ (-1);
      for (i = 0, iTop = str.length; i < iTop; i += 1) {
        y = (crc ^ str.charCodeAt(i)) & 0xFF;
        x = '0x' + table.substr(y * 9, 8);
        crc = (crc >>> 8) ^ x;
      }
      // always return a positive number (that's what >>> 0 does)
      return (crc ^ (-1)) >>> 0;
    },
    /**
     * @member Hashes
     * @class MD5
     * @constructor
     * @param {Object} [config]
     *
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See <http://pajhome.org.uk/crypt/md5> for more infHashes.
     */
    MD5: function(options) {
      /**
       * Private config properties. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * See {@link Hashes.MD5#method-setUpperCase} and {@link Hashes.SHA1#method-setUpperCase}
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false, // hexadecimal output case format. false - lowercase; true - uppercase
        b64pad = (options && typeof options.pad === 'string') ? options.pad : '=', // base-64 pad character. Defaults to '=' for strict RFC compliance
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true; // enable/disable utf8 encoding

      // privileged (public) methods
      this.hex = function(s) {
        return rstr2hex(rstr(s, utf8), hexcase);
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d), hexcase);
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * Enable/disable uppercase hexadecimal returned string
       * @param {Boolean}
       * @return {Object} this
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * Defines a base64 pad string
       * @param {String} Pad
       * @return {Object} this
       */
      this.setPad = function(a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * Defines a base64 pad string
       * @param {Boolean}
       * @return {Object} [this]
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      // private methods

      /**
       * Calculate the MD5 of a raw string
       */

      function rstr(s) {
        s = (utf8) ? utf8Encode(s) : s;
        return binl2rstr(binl(rstr2binl(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-MD5, of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        var bkey, ipad, opad, hash, i;

        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;
        bkey = rstr2binl(key);
        if (bkey.length > 16) {
          bkey = binl(bkey, key.length * 8);
        }

        ipad = Array(16), opad = Array(16);
        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl(opad.concat(hash), 512 + 128));
      }

      /**
       * Calculate the MD5 of an array of little-endian words, and a bit length.
       */

      function binl(x, len) {
        var i, olda, oldb, oldc, oldd,
          a = 1732584193,
          b = -271733879,
          c = -1732584194,
          d = 271733878;

        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;

          a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
          d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

          a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
          a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

          a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
          c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

          a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
          d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

          a = safe_add(a, olda);
          b = safe_add(b, oldb);
          c = safe_add(c, oldc);
          d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);
      }

      /**
       * These functions implement the four basic operations the algorithm uses.
       */

      function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
      }

      function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
      }

      function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
      }

      function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
      }

      function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
      }
    },
    /**
     * @member Hashes
     * @class Hashes.SHA1
     * @param {Object} [config]
     * @constructor
     *
     * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined in FIPS 180-1
     * Version 2.2 Copyright Paul Johnston 2000 - 2009.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See http://pajhome.org.uk/crypt/md5 for details.
     */
    SHA1: function(options) {
      /**
       * Private config properties. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * See {@link Hashes.MD5#method-setUpperCase} and {@link Hashes.SHA1#method-setUpperCase}
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false, // hexadecimal output case format. false - lowercase; true - uppercase
        b64pad = (options && typeof options.pad === 'string') ? options.pad : '=', // base-64 pad character. Defaults to '=' for strict RFC compliance
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true; // enable/disable utf8 encoding

      // public methods
      this.hex = function(s) {
        return rstr2hex(rstr(s, utf8), hexcase);
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s, utf8), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * @description Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {string} Pad
       * @return {Object} this
       * @public
       */
      this.setPad = function(a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      // private methods

      /**
       * Calculate the SHA-512 of a raw string
       */

      function rstr(s) {
        s = (utf8) ? utf8Encode(s) : s;
        return binb2rstr(binb(rstr2binb(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-SHA1 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        var bkey, ipad, opad, i, hash;
        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;
        bkey = rstr2binb(key);

        if (bkey.length > 16) {
          bkey = binb(bkey, key.length * 8);
        }
        ipad = Array(16), opad = Array(16);
        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binb(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
        return binb2rstr(binb(opad.concat(hash), 512 + 160));
      }

      /**
       * Calculate the SHA-1 of an array of big-endian words, and a bit length
       */

      function binb(x, len) {
        var i, j, t, olda, oldb, oldc, oldd, olde,
          w = Array(80),
          a = 1732584193,
          b = -271733879,
          c = -1732584194,
          d = 271733878,
          e = -1009589776;

        /* append padding */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        for (i = 0; i < x.length; i += 16) {
          olda = a,
          oldb = b;
          oldc = c;
          oldd = d;
          olde = e;

          for (j = 0; j < 80; j += 1) {
            if (j < 16) {
              w[j] = x[i + j];
            } else {
              w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
              safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
          }

          a = safe_add(a, olda);
          b = safe_add(b, oldb);
          c = safe_add(c, oldc);
          d = safe_add(d, oldd);
          e = safe_add(e, olde);
        }
        return Array(a, b, c, d, e);
      }

      /**
       * Perform the appropriate triplet combination function for the current
       * iteration
       */

      function sha1_ft(t, b, c, d) {
        if (t < 20) {
          return (b & c) | ((~b) & d);
        }
        if (t < 40) {
          return b ^ c ^ d;
        }
        if (t < 60) {
          return (b & c) | (b & d) | (c & d);
        }
        return b ^ c ^ d;
      }

      /**
       * Determine the appropriate additive constant for the current iteration
       */

      function sha1_kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
          (t < 60) ? -1894007588 : -899497514;
      }
    },
    /**
     * @class Hashes.SHA256
     * @param {config}
     *
     * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined in FIPS 180-2
     * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See http://pajhome.org.uk/crypt/md5 for details.
     * Also http://anmar.eu.org/projects/jssha2/
     */
    SHA256: function(options) {
      /**
       * Private properties configuration variables. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * @see this.setUpperCase() method
       * @see this.setPad() method
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false, // hexadecimal output case format. false - lowercase; true - uppercase  */
        b64pad = (options && typeof options.pad === 'string') ? options.pad : '=',
        /* base-64 pad character. Default '=' for strict RFC compliance   */
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true,
        /* enable/disable utf8 encoding */
        sha256_K;

      /* privileged (public) methods */
      this.hex = function(s) {
        return rstr2hex(rstr(s, utf8));
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s, utf8), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {string} Pad
       * @return {Object} this
       * @public
       */
      this.setPad = function(a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      // private methods

      /**
       * Calculate the SHA-512 of a raw string
       */

      function rstr(s, utf8) {
        s = (utf8) ? utf8Encode(s) : s;
        return binb2rstr(binb(rstr2binb(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-sha256 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;
        var hash, i = 0,
          bkey = rstr2binb(key),
          ipad = Array(16),
          opad = Array(16);

        if (bkey.length > 16) {
          bkey = binb(bkey, key.length * 8);
        }

        for (; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        hash = binb(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
        return binb2rstr(binb(opad.concat(hash), 512 + 256));
      }

      /*
       * Main sha256 function, with its support functions
       */

      function sha256_S(X, n) {
        return (X >>> n) | (X << (32 - n));
      }

      function sha256_R(X, n) {
        return (X >>> n);
      }

      function sha256_Ch(x, y, z) {
        return ((x & y) ^ ((~x) & z));
      }

      function sha256_Maj(x, y, z) {
        return ((x & y) ^ (x & z) ^ (y & z));
      }

      function sha256_Sigma0256(x) {
        return (sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22));
      }

      function sha256_Sigma1256(x) {
        return (sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25));
      }

      function sha256_Gamma0256(x) {
        return (sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3));
      }

      function sha256_Gamma1256(x) {
        return (sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10));
      }

      function sha256_Sigma0512(x) {
        return (sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39));
      }

      function sha256_Sigma1512(x) {
        return (sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41));
      }

      function sha256_Gamma0512(x) {
        return (sha256_S(x, 1) ^ sha256_S(x, 8) ^ sha256_R(x, 7));
      }

      function sha256_Gamma1512(x) {
        return (sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6));
      }

      sha256_K = [
        1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
        1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
        264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
        113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
        1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
        430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
        1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998
      ];

      function binb(m, l) {
        var HASH = [1779033703, -1150833019, 1013904242, -1521486534,
          1359893119, -1694144372, 528734635, 1541459225
        ];
        var W = new Array(64);
        var a, b, c, d, e, f, g, h;
        var i, j, T1, T2;

        /* append padding */
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for (i = 0; i < m.length; i += 16) {
          a = HASH[0];
          b = HASH[1];
          c = HASH[2];
          d = HASH[3];
          e = HASH[4];
          f = HASH[5];
          g = HASH[6];
          h = HASH[7];

          for (j = 0; j < 64; j += 1) {
            if (j < 16) {
              W[j] = m[j + i];
            } else {
              W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]),
                sha256_Gamma0256(W[j - 15])), W[j - 16]);
            }

            T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
              sha256_K[j]), W[j]);
            T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
          }

          HASH[0] = safe_add(a, HASH[0]);
          HASH[1] = safe_add(b, HASH[1]);
          HASH[2] = safe_add(c, HASH[2]);
          HASH[3] = safe_add(d, HASH[3]);
          HASH[4] = safe_add(e, HASH[4]);
          HASH[5] = safe_add(f, HASH[5]);
          HASH[6] = safe_add(g, HASH[6]);
          HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
      }

    },

    /**
     * @class Hashes.SHA512
     * @param {config}
     *
     * A JavaScript implementation of the Secure Hash Algorithm, SHA-512, as defined in FIPS 180-2
     * Version 2.2 Copyright Anonymous Contributor, Paul Johnston 2000 - 2009.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See http://pajhome.org.uk/crypt/md5 for details.
     */
    SHA512: function(options) {
      /**
       * Private properties configuration variables. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * @see this.setUpperCase() method
       * @see this.setPad() method
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false,
        /* hexadecimal output case format. false - lowercase; true - uppercase  */
        b64pad = (options && typeof options.pad === 'string') ? options.pad : '=',
        /* base-64 pad character. Default '=' for strict RFC compliance   */
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true,
        /* enable/disable utf8 encoding */
        sha512_k;

      /* privileged (public) methods */
      this.hex = function(s) {
        return rstr2hex(rstr(s));
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * @description Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {string} Pad
       * @return {Object} this
       * @public
       */
      this.setPad = function(a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      /* private methods */

      /**
       * Calculate the SHA-512 of a raw string
       */

      function rstr(s) {
        s = (utf8) ? utf8Encode(s) : s;
        return binb2rstr(binb(rstr2binb(s), s.length * 8));
      }
      /*
       * Calculate the HMAC-SHA-512 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;

        var hash, i = 0,
          bkey = rstr2binb(key),
          ipad = Array(32),
          opad = Array(32);

        if (bkey.length > 32) {
          bkey = binb(bkey, key.length * 8);
        }

        for (; i < 32; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        hash = binb(ipad.concat(rstr2binb(data)), 1024 + data.length * 8);
        return binb2rstr(binb(opad.concat(hash), 1024 + 512));
      }

      /**
       * Calculate the SHA-512 of an array of big-endian dwords, and a bit length
       */

      function binb(x, len) {
        var j, i, l,
          W = new Array(80),
          hash = new Array(16),
          //Initial hash values
          H = [
            new int64(0x6a09e667, -205731576),
            new int64(-1150833019, -2067093701),
            new int64(0x3c6ef372, -23791573),
            new int64(-1521486534, 0x5f1d36f1),
            new int64(0x510e527f, -1377402159),
            new int64(-1694144372, 0x2b3e6c1f),
            new int64(0x1f83d9ab, -79577749),
            new int64(0x5be0cd19, 0x137e2179)
          ],
          T1 = new int64(0, 0),
          T2 = new int64(0, 0),
          a = new int64(0, 0),
          b = new int64(0, 0),
          c = new int64(0, 0),
          d = new int64(0, 0),
          e = new int64(0, 0),
          f = new int64(0, 0),
          g = new int64(0, 0),
          h = new int64(0, 0),
          //Temporary variables not specified by the document
          s0 = new int64(0, 0),
          s1 = new int64(0, 0),
          Ch = new int64(0, 0),
          Maj = new int64(0, 0),
          r1 = new int64(0, 0),
          r2 = new int64(0, 0),
          r3 = new int64(0, 0);

        if (sha512_k === undefined) {
          //SHA512 constants
          sha512_k = [
            new int64(0x428a2f98, -685199838), new int64(0x71374491, 0x23ef65cd),
            new int64(-1245643825, -330482897), new int64(-373957723, -2121671748),
            new int64(0x3956c25b, -213338824), new int64(0x59f111f1, -1241133031),
            new int64(-1841331548, -1357295717), new int64(-1424204075, -630357736),
            new int64(-670586216, -1560083902), new int64(0x12835b01, 0x45706fbe),
            new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, -704662302),
            new int64(0x72be5d74, -226784913), new int64(-2132889090, 0x3b1696b1),
            new int64(-1680079193, 0x25c71235), new int64(-1046744716, -815192428),
            new int64(-459576895, -1628353838), new int64(-272742522, 0x384f25e3),
            new int64(0xfc19dc6, -1953704523), new int64(0x240ca1cc, 0x77ac9c65),
            new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
            new int64(0x5cb0a9dc, -1119749164), new int64(0x76f988da, -2096016459),
            new int64(-1740746414, -295247957), new int64(-1473132947, 0x2db43210),
            new int64(-1341970488, -1728372417), new int64(-1084653625, -1091629340),
            new int64(-958395405, 0x3da88fc2), new int64(-710438585, -1828018395),
            new int64(0x6ca6351, -536640913), new int64(0x14292967, 0xa0e6e70),
            new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
            new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, -1651133473),
            new int64(0x650a7354, -1951439906), new int64(0x766a0abb, 0x3c77b2a8),
            new int64(-2117940946, 0x47edaee6), new int64(-1838011259, 0x1482353b),
            new int64(-1564481375, 0x4cf10364), new int64(-1474664885, -1136513023),
            new int64(-1035236496, -789014639), new int64(-949202525, 0x654be30),
            new int64(-778901479, -688958952), new int64(-694614492, 0x5565a910),
            new int64(-200395387, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
            new int64(0x19a4c116, -1194143544), new int64(0x1e376c08, 0x5141ab53),
            new int64(0x2748774c, -544281703), new int64(0x34b0bcb5, -509917016),
            new int64(0x391c0cb3, -976659869), new int64(0x4ed8aa4a, -482243893),
            new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, -692930397),
            new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
            new int64(-2067236844, -1578062990), new int64(-1933114872, 0x1a6439ec),
            new int64(-1866530822, 0x23631e28), new int64(-1538233109, -561857047),
            new int64(-1090935817, -1295615723), new int64(-965641998, -479046869),
            new int64(-903397682, -366583396), new int64(-779700025, 0x21c0c207),
            new int64(-354779690, -840897762), new int64(-176337025, -294727304),
            new int64(0x6f067aa, 0x72176fba), new int64(0xa637dc5, -1563912026),
            new int64(0x113f9804, -1090974290), new int64(0x1b710b35, 0x131c471b),
            new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
            new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, -1676669620),
            new int64(0x4cc5d4be, -885112138), new int64(0x597f299c, -60457430),
            new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)
          ];
        }

        for (i = 0; i < 80; i += 1) {
          W[i] = new int64(0, 0);
        }

        // append padding to the source string. The format is described in the FIPS.
        x[len >> 5] |= 0x80 << (24 - (len & 0x1f));
        x[((len + 128 >> 10) << 5) + 31] = len;
        l = x.length;
        for (i = 0; i < l; i += 32) { //32 dwords is the block size
          int64copy(a, H[0]);
          int64copy(b, H[1]);
          int64copy(c, H[2]);
          int64copy(d, H[3]);
          int64copy(e, H[4]);
          int64copy(f, H[5]);
          int64copy(g, H[6]);
          int64copy(h, H[7]);

          for (j = 0; j < 16; j += 1) {
            W[j].h = x[i + 2 * j];
            W[j].l = x[i + 2 * j + 1];
          }

          for (j = 16; j < 80; j += 1) {
            //sigma1
            int64rrot(r1, W[j - 2], 19);
            int64revrrot(r2, W[j - 2], 29);
            int64shr(r3, W[j - 2], 6);
            s1.l = r1.l ^ r2.l ^ r3.l;
            s1.h = r1.h ^ r2.h ^ r3.h;
            //sigma0
            int64rrot(r1, W[j - 15], 1);
            int64rrot(r2, W[j - 15], 8);
            int64shr(r3, W[j - 15], 7);
            s0.l = r1.l ^ r2.l ^ r3.l;
            s0.h = r1.h ^ r2.h ^ r3.h;

            int64add4(W[j], s1, W[j - 7], s0, W[j - 16]);
          }

          for (j = 0; j < 80; j += 1) {
            //Ch
            Ch.l = (e.l & f.l) ^ (~e.l & g.l);
            Ch.h = (e.h & f.h) ^ (~e.h & g.h);

            //Sigma1
            int64rrot(r1, e, 14);
            int64rrot(r2, e, 18);
            int64revrrot(r3, e, 9);
            s1.l = r1.l ^ r2.l ^ r3.l;
            s1.h = r1.h ^ r2.h ^ r3.h;

            //Sigma0
            int64rrot(r1, a, 28);
            int64revrrot(r2, a, 2);
            int64revrrot(r3, a, 7);
            s0.l = r1.l ^ r2.l ^ r3.l;
            s0.h = r1.h ^ r2.h ^ r3.h;

            //Maj
            Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
            Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);

            int64add5(T1, h, s1, Ch, sha512_k[j], W[j]);
            int64add(T2, s0, Maj);

            int64copy(h, g);
            int64copy(g, f);
            int64copy(f, e);
            int64add(e, d, T1);
            int64copy(d, c);
            int64copy(c, b);
            int64copy(b, a);
            int64add(a, T1, T2);
          }
          int64add(H[0], H[0], a);
          int64add(H[1], H[1], b);
          int64add(H[2], H[2], c);
          int64add(H[3], H[3], d);
          int64add(H[4], H[4], e);
          int64add(H[5], H[5], f);
          int64add(H[6], H[6], g);
          int64add(H[7], H[7], h);
        }

        //represent the hash as an array of 32-bit dwords
        for (i = 0; i < 8; i += 1) {
          hash[2 * i] = H[i].h;
          hash[2 * i + 1] = H[i].l;
        }
        return hash;
      }

      //A constructor for 64-bit numbers

      function int64(h, l) {
        this.h = h;
        this.l = l;
        //this.toString = int64toString;
      }

      //Copies src into dst, assuming both are 64-bit numbers

      function int64copy(dst, src) {
        dst.h = src.h;
        dst.l = src.l;
      }

      //Right-rotates a 64-bit number by shift
      //Won't handle cases of shift>=32
      //The function revrrot() is for that

      function int64rrot(dst, x, shift) {
        dst.l = (x.l >>> shift) | (x.h << (32 - shift));
        dst.h = (x.h >>> shift) | (x.l << (32 - shift));
      }

      //Reverses the dwords of the source and then rotates right by shift.
      //This is equivalent to rotation by 32+shift

      function int64revrrot(dst, x, shift) {
        dst.l = (x.h >>> shift) | (x.l << (32 - shift));
        dst.h = (x.l >>> shift) | (x.h << (32 - shift));
      }

      //Bitwise-shifts right a 64-bit number by shift
      //Won't handle shift>=32, but it's never needed in SHA512

      function int64shr(dst, x, shift) {
        dst.l = (x.l >>> shift) | (x.h << (32 - shift));
        dst.h = (x.h >>> shift);
      }

      //Adds two 64-bit numbers
      //Like the original implementation, does not rely on 32-bit operations

      function int64add(dst, x, y) {
        var w0 = (x.l & 0xffff) + (y.l & 0xffff);
        var w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16);
        var w2 = (x.h & 0xffff) + (y.h & 0xffff) + (w1 >>> 16);
        var w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
        dst.l = (w0 & 0xffff) | (w1 << 16);
        dst.h = (w2 & 0xffff) | (w3 << 16);
      }

      //Same, except with 4 addends. Works faster than adding them one by one.

      function int64add4(dst, a, b, c, d) {
        var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff);
        var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16);
        var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (w1 >>> 16);
        var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
        dst.l = (w0 & 0xffff) | (w1 << 16);
        dst.h = (w2 & 0xffff) | (w3 << 16);
      }

      //Same, except with 5 addends

      function int64add5(dst, a, b, c, d, e) {
        var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff) + (e.l & 0xffff),
          w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (w0 >>> 16),
          w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (e.h & 0xffff) + (w1 >>> 16),
          w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (w2 >>> 16);
        dst.l = (w0 & 0xffff) | (w1 << 16);
        dst.h = (w2 & 0xffff) | (w3 << 16);
      }
    },
    /**
     * @class Hashes.RMD160
     * @constructor
     * @param {Object} [config]
     *
     * A JavaScript implementation of the RIPEMD-160 Algorithm
     * Version 2.2 Copyright Jeremy Lin, Paul Johnston 2000 - 2009.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See http://pajhome.org.uk/crypt/md5 for details.
     * Also http://www.ocf.berkeley.edu/~jjlin/jsotp/
     */
    RMD160: function(options) {
      /**
       * Private properties configuration variables. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * @see this.setUpperCase() method
       * @see this.setPad() method
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false,
        /* hexadecimal output case format. false - lowercase; true - uppercase  */
        b64pad = (options && typeof options.pad === 'string') ? options.pa : '=',
        /* base-64 pad character. Default '=' for strict RFC compliance   */
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true,
        /* enable/disable utf8 encoding */
        rmd160_r1 = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
          7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
          3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
          1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
          4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
        ],
        rmd160_r2 = [
          5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
          6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
          15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
          8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
          12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
        ],
        rmd160_s1 = [
          11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
          7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
          11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
          11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
          9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
        ],
        rmd160_s2 = [
          8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
          9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
          9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
          15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
          8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
        ];

      /* privileged (public) methods */
      this.hex = function(s) {
        return rstr2hex(rstr(s, utf8));
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s, utf8), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * @description Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {string} Pad
       * @return {Object} this
       * @public
       */
      this.setPad = function(a) {
        if (typeof a !== 'undefined') {
          b64pad = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      /* private methods */

      /**
       * Calculate the rmd160 of a raw string
       */

      function rstr(s) {
        s = (utf8) ? utf8Encode(s) : s;
        return binl2rstr(binl(rstr2binl(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-rmd160 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;
        var i, hash,
          bkey = rstr2binl(key),
          ipad = Array(16),
          opad = Array(16);

        if (bkey.length > 16) {
          bkey = binl(bkey, key.length * 8);
        }

        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl(opad.concat(hash), 512 + 160));
      }

      /**
       * Convert an array of little-endian words to a string
       */

      function binl2rstr(input) {
        var i, output = '',
          l = input.length * 32;
        for (i = 0; i < l; i += 8) {
          output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
      }

      /**
       * Calculate the RIPE-MD160 of an array of little-endian words, and a bit length.
       */

      function binl(x, len) {
        var T, j, i, l,
          h0 = 0x67452301,
          h1 = 0xefcdab89,
          h2 = 0x98badcfe,
          h3 = 0x10325476,
          h4 = 0xc3d2e1f0,
          A1, B1, C1, D1, E1,
          A2, B2, C2, D2, E2;

        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        l = x.length;

        for (i = 0; i < l; i += 16) {
          A1 = A2 = h0;
          B1 = B2 = h1;
          C1 = C2 = h2;
          D1 = D2 = h3;
          E1 = E2 = h4;
          for (j = 0; j <= 79; j += 1) {
            T = safe_add(A1, rmd160_f(j, B1, C1, D1));
            T = safe_add(T, x[i + rmd160_r1[j]]);
            T = safe_add(T, rmd160_K1(j));
            T = safe_add(bit_rol(T, rmd160_s1[j]), E1);
            A1 = E1;
            E1 = D1;
            D1 = bit_rol(C1, 10);
            C1 = B1;
            B1 = T;
            T = safe_add(A2, rmd160_f(79 - j, B2, C2, D2));
            T = safe_add(T, x[i + rmd160_r2[j]]);
            T = safe_add(T, rmd160_K2(j));
            T = safe_add(bit_rol(T, rmd160_s2[j]), E2);
            A2 = E2;
            E2 = D2;
            D2 = bit_rol(C2, 10);
            C2 = B2;
            B2 = T;
          }

          T = safe_add(h1, safe_add(C1, D2));
          h1 = safe_add(h2, safe_add(D1, E2));
          h2 = safe_add(h3, safe_add(E1, A2));
          h3 = safe_add(h4, safe_add(A1, B2));
          h4 = safe_add(h0, safe_add(B1, C2));
          h0 = T;
        }
        return [h0, h1, h2, h3, h4];
      }

      // specific algorithm methods

      function rmd160_f(j, x, y, z) {
        return (0 <= j && j <= 15) ? (x ^ y ^ z) :
          (16 <= j && j <= 31) ? (x & y) | (~x & z) :
          (32 <= j && j <= 47) ? (x | ~y) ^ z :
          (48 <= j && j <= 63) ? (x & z) | (y & ~z) :
          (64 <= j && j <= 79) ? x ^ (y | ~z) :
          'rmd160_f: j out of range';
      }

      function rmd160_K1(j) {
        return (0 <= j && j <= 15) ? 0x00000000 :
          (16 <= j && j <= 31) ? 0x5a827999 :
          (32 <= j && j <= 47) ? 0x6ed9eba1 :
          (48 <= j && j <= 63) ? 0x8f1bbcdc :
          (64 <= j && j <= 79) ? 0xa953fd4e :
          'rmd160_K1: j out of range';
      }

      function rmd160_K2(j) {
        return (0 <= j && j <= 15) ? 0x50a28be6 :
          (16 <= j && j <= 31) ? 0x5c4dd124 :
          (32 <= j && j <= 47) ? 0x6d703ef3 :
          (48 <= j && j <= 63) ? 0x7a6d76e9 :
          (64 <= j && j <= 79) ? 0x00000000 :
          'rmd160_K2: j out of range';
      }
    }
  };

  // exposes Hashes
  (function(window, undefined) {
    var freeExports = false;
    if (typeof exports === 'object') {
      freeExports = exports;
      if (exports && typeof commonjsGlobal === 'object' && commonjsGlobal && commonjsGlobal === commonjsGlobal.global) {
        window = commonjsGlobal;
      }
    }

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
      // define as an anonymous module, so, through path mapping, it can be aliased
      define(function() {
        return Hashes;
      });
    } else if (freeExports) {
      // in Node.js or RingoJS v0.8.0+
      if (typeof module === 'object' && module && module.exports === freeExports) {
        module.exports = Hashes;
      }
      // in Narwhal or RingoJS v0.7.0-
      else {
        freeExports.Hashes = Hashes;
      }
    } else {
      // in a browser or Rhino
      window.Hashes = Hashes;
    }
  }(this));
}()); // IIFE
});

var SHA1 = hashes.SHA1;

function parseManifest(data) {
    var manifest = JSON.parse(data);
    manifest._json = data;
    manifest._hash = new SHA1().hex(data);
    return manifest;
}

var driverId = 0;
/**
 * Possible states for the service worker.
 */
var DriverState;
(function (DriverState) {
    // Just starting up - this is the initial state. The worker is not servicing requests yet.
    // Crucially, it does not know if it is an active worker, or is being freshly installed or
    // updated.
    DriverState[DriverState["STARTUP"] = 0] = "STARTUP";
    // The service worker has an active manifest and is currently serving traffic.
    DriverState[DriverState["READY"] = 1] = "READY";
    // The service worker is READY, but also has an updated manifest staged. When a fetch
    // is received and no current tabs are open, the worker may choose to activate the
    // pending manifest and discard the old one, in which case it will transition to READY.
    DriverState[DriverState["UPDATE_PENDING"] = 2] = "UPDATE_PENDING";
    // The worker has started up, but had no active manifest cached. In this case, it must
    // download from the network.
    DriverState[DriverState["INSTALLING"] = 3] = "INSTALLING";
    // Something happened that prevented the worker from reaching a good state. In the LAME
    // state the worker forwards all requests directly to the network, effectively self-disabling.
    // The worker will not recover from this state until it is terminated.
    DriverState[DriverState["LAME"] = 4] = "LAME";
})(DriverState || (DriverState = {}));
/**
 * Manages the lifecycle of the Angular service worker.
 *
 * `Driver` is a singleton within the worker. It attempts to instantiate a `VersionWorker`,
 * a class that serves fetch (and other) events according to the instructions defined in a
 * particular version of a manifest file. The `Driver` maintains an active `VersionWorker`
 * and routes events to it when possible. A state machine ensures the `Driver` always
 * responds to traffic correctly.
 *
 * A principle consideration for choosing a 'correct' manifest with which to serve traffic
 * is when to switch to a new (updated) version of the manifest. `Driver` is responsible
 * for periodically downloading fresh versions of the manifest from the server, staging
 * a new `VersionWorker` if the manifest has been updated, and deciding when to switch app
 * traffic from the old to the new manifest. A large part of `Driver`'s logic is devoted
 * to this update process.
 *
 * At a high level, updates follow this process:
 *
 * 1) When a new `Driver` is created (worker startup), it initializes into a READY state
 *    and then checks for an updated manifest from the network.
 *
 * 2) If such a manifest is found, the `Driver` creates a new `VersionWorker` and attempts
 *    to set it up successfully, updating files from the old `VersionWorker` currently
 *    serving traffic.
 *
 * 3) If that update is successful, the driver queues the new manifest as staged and
 *    enters an UPDATE_PENDING state.
 *
 * 4) On the next `fetch` event that meets all the criteria for an update, the `Driver`
 *    activates the stage manifest, begins serving traffic with the new `VersionWorker`,
 *    and instructs the old `VersionWorker to clear up.
 */
var Driver = (function () {
    function Driver(manifestUrl, plugins, scope, adapter, cache, events, fetcher, clock) {
        var _this = this;
        this.manifestUrl = manifestUrl;
        this.plugins = plugins;
        this.scope = scope;
        this.adapter = adapter;
        this.cache = cache;
        this.events = events;
        this.fetcher = fetcher;
        this.clock = clock;
        // The worker always starts in STARTUP.
        this.state = DriverState.STARTUP;
        // A hash of the pending manifest, if the worker is in an UPDATE_PENDING state.
        this.pendingUpdateHash = null;
        // The next available id for observable streams used to communicate with application tabs.
        this.streamId = 0;
        // A map of stream ids to `MessagePort`s that communicate with application tabs.
        this.streams = {};
        // The worker's lifecycle log, which is appended to when lifecycle events happen. This
        // is not ever cleared, but should not grow very large.
        this.lifecycleLog = [];
        // Stream IDs that are actively listening for update lifecycle events.
        this.updateListeners = [];
        this.id = driverId++;
        // Set up Promises for testing.
        this.ready = new Promise(function (resolve) { return _this.readyResolve = resolve; });
        this.updatePending = new Promise(function (resolve) { return _this.updatePendingResolve = resolve; });
        // All SW caching should go through this cache.
        this.scopedCache = new ScopedCache(this.cache, 'ngsw:');
        // Subscribe to all the service worker lifecycle events:
        events.install = function (event) {
            _this.lifecycle('install event');
            event.waitUntil(Promise.resolve()
                .then(function () { return _this.reset(); })
                .then(function () { return _this.scope.skipWaiting(); }));
        };
        events.activate = function (event) {
            _this.lifecycle('activate event');
            // Kick off the startup process right away, so the worker doesn't wait for fetch
            // events before getting a manifest and installing the app.
            if (!_this.init) {
                _this.startup();
            }
            // Take over all active pages. At this point the worker is still in STARTUP, so
            // all requests will fall back on the network.
            event.waitUntil(_this.scope.clients.claim());
        };
        events.fetch = function (event) {
            var req = event.request;
            // Handle the log event no matter what state the worker is in.
            if (req.url.endsWith('/ngsw.log')) {
                event.respondWith(_this
                    .status()
                    .then(function (status) { return _this.adapter.newResponse(JSON.stringify(status, null, 2)); }));
                return;
            }
            // Skip fetch events when in LAME state - no need to wait for init for this.
            // Since the worker doesn't call event.respondWith(), the browser will go to
            // the network for this request.
            if (_this.state === DriverState.LAME) {
                return;
            }
            // If this is the first request and the worker is in STARTUP, kick off the startup
            // process. This is a normal step for subsequent startups of the worker (during the
            // first one, the activate event usually kicks off the startup process).
            if (_this.state === DriverState.STARTUP && !_this.init) {
                _this.startup();
            }
            // Should not happen, but just in case, throw an error.
            if (!_this.init) {
                throw new Error("init Promise not present in state " + DriverState[_this.state]);
            }
            event.respondWith(_this
                .init
                .then(function () {
                switch (_this.state) {
                    case DriverState.READY:
                        // The worker is ready and this.active is set to a VersionWorker.
                        return _this.active.fetch(req);
                    case DriverState.UPDATE_PENDING:
                        // The worker is ready but has a pending update. Decide whether to activate
                        // the pending manifest before servicing the request.
                        return _this
                            .maybeUpdate(event.clientId)
                            .then(function () { return _this.active.fetch(req); });
                    case DriverState.INSTALLING:
                    case DriverState.LAME:
                        // Whether the worker is still INSTALLING or has freshly transitioned to a
                        // LAME state, serve the request with the network.
                        return _this.fetcher.request(req, true);
                    default:
                        // Shouldn't happen, but just be safe and serve the request from the network.
                        return _this.fetcher.request(req, true);
                }
            }));
        };
        events.message = function (event) {
            // Skip all events in the LAME state.
            if (_this.state === DriverState.LAME) {
                return;
            }
            // Start up if needed (see fetch above).
            if (_this.state === DriverState.STARTUP && !_this.init) {
                _this.startup();
            }
            if (!_this.init) {
                throw new Error("init Promise not present in state " + DriverState[_this.state]);
            }
            // Some sanity checks against the incoming message - is it intended for the worker?
            if (event.ports.length !== 1 || !event.data || !event.data.hasOwnProperty('$ngsw')) {
                return;
            }
            // Wait for initialization.
            _this.init.then(function () {
                // Did the worker reach a good state?
                if (_this.state !== DriverState.READY && _this.state !== DriverState.UPDATE_PENDING) {
                    // No - drop the message, it can't be handled until the worker is in a good state.
                    return;
                }
                // The message includes a MessagePort for sending responses. Set this up as a stream.
                var respond = event.ports[0];
                var id = _this.streamId++;
                _this.streams[id] = respond;
                // Send the id as the first response. This can be used by the client to notify of an
                // "unsubscription" to this request.
                respond.postMessage({ '$ngsw': true, 'id': id });
                // Handle the actual payload.
                _this.handleMessage(event.data, id);
            });
        };
        events.push = function (event) {
            // Skip all PUSH messages in the LAME state. Technically this isn't valid per the spec,
            // but better to ignore them than throw random errors.
            if (_this.state === DriverState.LAME) {
                return;
            }
            // Start up if needed (see fetch above).
            if (_this.state === DriverState.STARTUP && !_this.init) {
                _this.startup();
            }
            if (!_this.init) {
                throw new Error("init Promise not present in state " + DriverState[_this.state]);
            }
            Promise
                .all([
                _this.init,
                event.data.text(),
            ])
                .then(function (results) { return results[1]; })
                .then(function (data) {
                // Make sure the worker ended up in a good state after initialization.
                if (_this.state !== DriverState.READY && _this.state !== DriverState.UPDATE_PENDING) {
                    // If not, drop the push message. Again, not valid per the spec, but safer than attempting
                    // to handle and throwing errors.
                    return;
                }
                // Handle the message with the active VersionWorker.
                _this.active.push(data);
            });
        };
    }
    /**
     * Write a message to the lifecycle log.
     */
    Driver.prototype.lifecycle = function (msg) {
        this.lifecycleLog.push(msg);
    };
    /**
     * Attempt to reset the service worker to a pristine state, as if one had never been installed
     * before.
     *
     * This involves removing all of the caches that fall under the `ScopedCache` used by the
     * worker.
     */
    Driver.prototype.reset = function () {
        var _this = this;
        return this
            .scopedCache
            .keys()
            .then(function (keys) { return Promise
            .all(keys.map(function (key) { return _this.scopedCache.remove(key); }))
            .then(function () { return _this.lifecycle("reset removed " + keys.length + " ngsw: caches"); }); });
    };
    /**
     * Start up the worker.
     *
     * this.init is set up as a Promise that resolves when the worker exits the STARTUP state.
     * In the background, it also kicks off a check for a new version of the manifest.
     *
     * In the usual update flow, this means that the worker will first transition to READY,
     * and then to UPDATE_PENDING when the updated manifest is set up and ready to be served.
     */
    Driver.prototype.startup = function () {
        var _this = this;
        this.init = this.initialize();
        this.init.then(function () { return _this.checkForUpdate(); });
    };
    /**
     * Possibly switch to a pending manifest if it's safe to do so.
     *
     * Safety is determined by whether there are other application tabs open, since they may
     * be depending on the worker to serve lazily-loaded js from the previous version of the
     * app, or it may be using a shared IndexedDB across all the tabs that can't be updated
     * yet, etc.
     */
    Driver.prototype.maybeUpdate = function (clientId) {
        var _this = this;
        return this
            .scope
            .clients
            .matchAll()
            .then(function (clients) {
            // Currently, the only criteria is that this must be a fresh tab (no current
            // clients).
            if (clients.length !== 0) {
                return null;
            }
            return _this.doUpdate();
        });
    };
    /**
     * Switch to the staged worker (if any).
     *
     * After updating, the worker will be in state READY, always. If a staged manifest
     * was present and validated, it will be set as active.
     *
     * If `expectVersion` is set but the staged manifest does not match the expected
     * version, the update is skipped and the result resolves to false.
     */
    Driver.prototype.doUpdate = function (expectVersion) {
        var _this = this;
        return this
            .fetchManifestFromCache('staged')
            .then(function (manifest) {
            // If no staged manifest exists in the cache, just transition to READY now.
            if (!manifest) {
                _this.transition(DriverState.READY);
                return false;
            }
            // If a particular version is expected 
            if (!!expectVersion && manifest._hash !== expectVersion) {
                return false;
            }
            return _this
                .openManifest(manifest)
                .then(function (worker) { return _this
                .clearStaged()
                .then(function () { return worker ? _this.setManifest(manifest, 'active') : null; })
                .then(function () {
                if (worker) {
                    // Set this.active to the new worker.
                    var oldActive_1 = _this.active;
                    _this.active = worker;
                    // At this point, the old worker can clean up its caches as they're no longer
                    // needed.
                    _this
                        .cleanup(oldActive_1)
                        .then(function () { return _this.lifecycle("cleaned up old version " + oldActive_1.manifest._hash); });
                    // Notify update listeners that an update has occurred.
                    _this.updateListeners.forEach(function (id) {
                        _this.sendToStream(id, {
                            type: 'activation',
                            version: manifest._hash,
                        });
                    });
                    _this.lifecycle("updated to manifest " + manifest._hash);
                }
                // Regardless of whether the manifest successfully validated, it is no longer
                // a pending update, so transition to READY.
                _this.transition(DriverState.READY);
                return true;
            }); });
        });
    };
    /**
     * Clear the currently active manifest (if any).
     */
    Driver.prototype.clearActive = function () {
        // Fail if the worker is in a state which expects an active manifest to be present.
        if (this.state === DriverState.READY || this.state === DriverState.UPDATE_PENDING) {
            return Promise.reject("Cannot clear the active manifest when it's being used.");
        }
        return this.scopedCache.invalidate('active', this.manifestUrl);
    };
    /**
     * Clear the currently staged manifest (if any).
     */
    Driver.prototype.clearStaged = function () {
        return this.scopedCache.invalidate('staged', this.manifestUrl);
    };
    /**
     * Check the network for a new version of the manifest, and stage it if possible.
     *
     * This will request a new copy of the manifest from the network and compare it with
     * both the active manifest and any staged manifest if present.
     *
     * If the manifest is newer than the active or the staged manifest, it will be loaded
     * and the setup process run for all installed plugins. If it passes that process, it
     * will be set as the staged manifest, and the worker state will be set to UPDATE_PENDING.
     *
     * checkForUpdate() returns a boolean indicating whether a staged update is pending,
     * regardless of whether this particular call caused the update to become staged.
     */
    Driver.prototype.checkForUpdate = function () {
        var _this = this;
        // If the driver isn't in a good serving state, there is no reasonable course of action
        // if an update would be found, so don't check.
        if (this.state !== DriverState.READY && this.state !== DriverState.UPDATE_PENDING) {
            this.lifecycle("skipping update check, in state " + DriverState[this.state]);
            return Promise.resolve(false);
        }
        // If the worker is in the UPDATE_PENDING state, then no need to check, there is an update.
        if (this.state === DriverState.UPDATE_PENDING) {
            return Promise.resolve(true);
        }
        return Promise
            .all([
            this.fetchManifestFromCache('active'),
            this.fetchManifestFromCache('staged'),
            this.fetchManifestFromNetwork(),
        ])
            .then(function (manifests) {
            var active = manifests[0], staged = manifests[1], network = manifests[2];
            // If the request for a manifest from the network was unsuccessful, there's no
            // way to tell if an update is available, so skip.
            if (!network) {
                // Even if the network request failed, there could still be a pending manifest.
                // This technically shouldn't happen since the worker should have been placed in
                // the UPDATE_PENDING state by initialize(), but this is here for safety.
                if (!!staged) {
                    // If there is a staged manifest, transition to UPDATE_PENDING.
                    _this.pendingUpdateHash = staged._hash;
                    _this.transition(DriverState.UPDATE_PENDING);
                    return true;
                }
                else {
                    return false;
                }
            }
            // If the network manifest is currently the active manifest, no update is available.
            if (!!active && active._hash === network._hash) {
                return false;
            }
            // If the network manifest is already staged, just go to UPDATE_PENDING. Theoretically
            // this shouldn't happen since initialize() should have already transitioned to
            // UPDATE_PENDING, but as above, this is here for safety.
            if (!!staged && staged._hash === network._hash) {
                _this.lifecycle("network manifest " + network._hash + " is already staged");
                _this.pendingUpdateHash = staged._hash;
                _this.transition(DriverState.UPDATE_PENDING);
                return true;
            }
            // A Promise which may do extra work before the update.
            var start = Promise.resolve();
            // If there is a staged manifest, then before setting up the update, remove it.
            if (!!staged) {
                _this.lifecycle("staged manifest " + staged._hash + " is old, removing");
                start = _this.clearStaged();
            }
            return start
                .then(function () { return _this.setupManifest(network, _this.active); })
                .then(function () { return _this.setManifest(network, 'staged'); })
                .then(function () {
                // Finally, transition to UPDATE_PENDING to indicate updates should be checked.
                _this.pendingUpdateHash = network._hash;
                _this.transition(DriverState.UPDATE_PENDING);
                _this.lifecycle("staged update to " + network._hash);
                return true;
            });
        });
    };
    /**
     * Transitions the worker out of the STARTUP state, by either serving the active
     * manifest or installing from the network if one is not present.
     *
     * Initialization can fail, which will result in the worker ending up in a LAME
     * state where it effectively disables itself until the next startup.
     *
     * This function returns a Promise which, when resolved, guarantees the worker is
     * no longer in a STARTUP state.
     */
    Driver.prototype.initialize = function () {
        var _this = this;
        // Fail if the worker is initialized twice.
        if (!!this.init) {
            throw new Error("double initialization!");
        }
        // Initialization is only valid in the STARTUP state.
        if (this.state !== DriverState.STARTUP) {
            return Promise.reject(new Error("driver: initialize() called when not in STARTUP state"));
        }
        return Promise
            .all([
            this.fetchManifestFromCache('active'),
            this.fetchManifestFromCache('staged'),
        ])
            .then(function (manifests) {
            var active = manifests[0], staged = manifests[1];
            if (!active) {
                // If there's no active manifest, then a network installation is required.
                _this.transition(DriverState.INSTALLING);
                // Installing from the network is asynchronous, but initialization doesn't block on
                // it. Therefore the Promise returned from doInstallFromNetwork() is ignored.
                _this.doInstallFromNetwork();
                return null;
            }
            return _this
                .openManifest(active)
                .then(function (worker) {
                if (!worker) {
                    // The active manifest is somehow invalid. Nothing to do but enter a LAME state
                    // and remove it, and hope the next time the worker is initialized, a fresh copy
                    // will be installed from the network without issues.
                    _this.transition(DriverState.LAME);
                    return _this.clearActive();
                }
                _this.lifecycle("manifest " + active._hash + " activated");
                _this.active = worker;
                // If a staged manifest exist, go to UPDATE_PENDING instead of READY.
                if (!!staged) {
                    if (staged._hash === active._hash) {
                        _this.lifecycle("staged manifest " + staged._hash + " is already active, cleaning it up");
                        _this.transition(DriverState.READY);
                        return _this.clearStaged();
                    }
                    else {
                        _this.lifecycle("staged manifest " + staged._hash + " present at initialization");
                        _this.pendingUpdateHash = staged._hash;
                        _this.transition(DriverState.UPDATE_PENDING);
                        return null;
                    }
                }
                _this.transition(DriverState.READY);
            });
        });
    };
    /**
     * Fetch and install a manifest from the network.
     *
     * If successful, the manifest will become active and the worker will finish in state
     * READY. If any errors are encountered, the worker will transition to a LAME state.
     */
    Driver.prototype.doInstallFromNetwork = function () {
        var _this = this;
        return this
            .fetchManifestFromNetwork()
            .then(function (manifest) {
            if (!manifest) {
                // If it wasn't successful, there's no graceful way to recover, so go to a
                // LAME state.
                _this.lifecycle('no network manifest found to install from');
                _this.transition(DriverState.LAME);
                return null;
            }
            return _this
                .setupManifest(manifest, null)
                .then(function (worker) {
                if (!worker) {
                    _this.lifecycle('network manifest setup failed');
                    _this.transition(DriverState.LAME);
                    return null;
                }
                _this
                    .setManifest(manifest, 'active')
                    .then(function () {
                    // Set this.active and transition to READY.
                    _this.active = worker;
                    _this.lifecycle("installed version " + manifest._hash + " from network");
                    _this.transition(DriverState.READY);
                });
            });
        });
    };
    /**
     * Fetch a cached copy of the manifest.
     */
    Driver.prototype.fetchManifestFromCache = function (cache) {
        var _this = this;
        return this
            .scopedCache
            .load(cache, this.manifestUrl)
            .then(function (resp) { return _this.manifestFromResponse(resp); });
    };
    /**
     * Fetch a copy of the manifest from the network.
     *
     * Resolves with null on a failure.
     */
    Driver.prototype.fetchManifestFromNetwork = function () {
        var _this = this;
        return this
            .fetcher
            .refresh(this.manifestUrl)
            .then(function (resp) { return _this.manifestFromResponse(resp); })
            .catch(function () { return null; });
    };
    /**
     * Parse the given `Response` and return a `Manifest` object.
     */
    Driver.prototype.manifestFromResponse = function (resp) {
        if (!resp || resp.status !== 200) {
            return null;
        }
        return resp.text().then(function (body) { return parseManifest(body); });
    };
    /**
     * Store the given `Manifest` in the given cache.
     */
    Driver.prototype.setManifest = function (manifest, cache) {
        return this.scopedCache.store(cache, this.manifestUrl, this.adapter.newResponse(manifest._json));
    };
    /**
     * Construct a `VersionWorker` for the given manifest.
     *
     * This worker will have all of the plugins specified during the bootstrap process installed,
     * but not yet initialized (setup()).
     */
    Driver.prototype.workerFromManifest = function (manifest) {
        var plugins = [];
        var worker = new VersionWorkerImpl(this, this.scope, manifest, this.adapter, new ScopedCache(this.scopedCache, "manifest:" + manifest._hash + ":"), this.clock, this.fetcher, plugins);
        plugins.push.apply(plugins, this.plugins.map(function (factory) { return factory(worker); }));
        return worker;
    };
    /**
     * Instantiates a `VersionWorker` from a manifest and runs it through its setup process.
     *
     * Optionally, the worker can be directed to update from an existing `VersionWorker`
     * instead of performing a fresh setup. This can save time if resources have not changed
     * between the old and new manifests.
     */
    Driver.prototype.setupManifest = function (manifest, existing) {
        if (existing === void 0) { existing = null; }
        var worker = this.workerFromManifest(manifest);
        return worker
            .setup(existing)
            .then(function () { return worker; });
    };
    /**
     * Instantiates a `VersionWorker` from a manifest that was previously set up according
     * by `setupManifest`.
     *
     * The worker will be validated (its caches checked against the manifest to assure all
     * resources listed are cached properly). If it passes validation, the returned Promise
     * will resolve with the worker instance, if not it resolves with `null`.
     */
    Driver.prototype.openManifest = function (manifest) {
        var _this = this;
        var worker = this.workerFromManifest(manifest);
        return worker
            .validate()
            .then(function (valid) {
            if (!valid) {
                // The worker wasn't valid - something was missing from the caches.
                _this.lifecycle("cached version " + manifest._hash + " not valid");
                // Attempt to recover by cleaning up the worker. This should allow it to be
                // freshly installed the next time the `Driver` starts.
                return _this
                    .cleanup(worker)
                    .then(function () { return null; });
            }
            return worker;
        });
    };
    /**
     * Run a `VersionWorker` through its cleanup process, resolving when it completes.
     */
    Driver.prototype.cleanup = function (worker) {
        return worker
            .cleanup()
            .reduce(function (prev, curr) { return prev.then(function (resp) { return curr(); }); }, Promise.resolve(null));
    };
    /**
     * Fetch the status of the `Driver`, including current state and lifecycle messages.
     */
    Driver.prototype.status = function () {
        return Promise.resolve({
            state: DriverState[this.state],
            lifecycleLog: this.lifecycleLog,
        });
    };
    /**
     * Transition into a new state.
     *
     * `transition` logs the transition, and also handles resolving several promises useful
     * for testing the more asynchronous parts of the `Driver` which aren't exposed via the
     * more public API.
     */
    Driver.prototype.transition = function (state) {
        var _this = this;
        this.lifecycle("transition from " + DriverState[this.state] + " to " + DriverState[state]);
        this.state = state;
        // If the `DRIVER` entered the READY state, resolve the ready Promise.
        if (state === DriverState.READY && this.readyResolve !== null) {
            var resolve = this.readyResolve;
            this.readyResolve = null;
            resolve();
        }
        // If the driver entered the UPDATE_PENDING state, resolve the update pending Promise,
        // and reset the ready Promise.
        if (state === DriverState.UPDATE_PENDING && this.updatePendingResolve !== null) {
            this.ready = new Promise(function (resolve) { return _this.readyResolve = resolve; });
            var resolve = this.updatePendingResolve;
            this.updatePendingResolve = null;
            resolve();
        }
        // If the driver entered the UPDATE_PENDING state, notify all update subscribers
        // about the pending update.
        if (state === DriverState.UPDATE_PENDING && this.pendingUpdateHash !== null) {
            this.updateListeners.forEach(function (id) { return _this.sendToStream(id, {
                type: 'pending',
                version: _this.pendingUpdateHash,
            }); });
        }
        else if (state !== DriverState.UPDATE_PENDING) {
            // Reset the pending update hash if not transitioning to UPDATE_PENDING.
            this.pendingUpdateHash = null;
        }
    };
    /**
     * Process a `postMessage` received by the worker.
     */
    Driver.prototype.handleMessage = function (message, id) {
        var _this = this;
        // If the `Driver` is not in a known good state, nothing to do but exit.
        if (this.state !== DriverState.READY && this.state !== DriverState.UPDATE_PENDING) {
            this.lifecycle("can't handle message in state " + DriverState[this.state]);
            return;
        }
        // The message has a 'cmd' key which determines the action the `Driver` will take.
        // Some commands are handled directly by the `Driver`, the rest are passed on to the
        // active `VersionWorker` to be handled by a plugin.
        switch (message['cmd']) {
            // A ping is a request for the service worker to assert it is up and running by
            // completing the "Observable" stream.
            case 'ping':
                this.lifecycle("responding to ping on " + id);
                this.closeStream(id);
                break;
            // An update message is a request for the service worker to keep the application
            // apprised of any pending update events, such as a new manifest becoming pending.
            case 'update':
                this.updateListeners.push(id);
                // Since this is a new subscriber, check if there's a pending update now and
                // deliver an initial event if so.
                if (this.state === DriverState.UPDATE_PENDING && this.pendingUpdateHash !== null) {
                    this.sendToStream(id, {
                        type: 'pending',
                        version: this.pendingUpdateHash,
                    });
                }
                break;
            // Check for a pending update, fetching a new manifest from the network if necessary,
            // and return the result as a boolean value beore completing.
            case 'checkUpdate':
                this.checkForUpdate().then(function (value) {
                    _this.sendToStream(id, value);
                    _this.closeStream(id);
                });
                break;
            case 'activateUpdate':
                this.doUpdate(message['version'] || undefined).then(function (success) {
                    _this.sendToStream(id, success);
                    _this.closeStream(id);
                });
                break;
            // 'cancel' is a special command that the other side has unsubscribed from the stream.
            // Plugins may choose to take action as a result.
            case 'cancel':
                // Attempt to look up the stream the client is requesting to cancel.
                var idToCancel = message['id'];
                if (!this.streams.hasOwnProperty(id)) {
                    // Not found - nothing to do but exit.
                    return;
                }
                // Notify the active `VersionWorker` that the client has unsubscribed.
                this.active.messageClosed(id);
                // This listener may have been a subscriber to 'update' events.
                this.maybeRemoveUpdateListener(id);
                // Finally, remove the stream.
                delete this.streams[id];
                break;
            // A request to stream the service worker debugging log. Only one of these is valid
            // at a time.
            case 'log':
                LOGGER.messages = function (message) {
                    _this.sendToStream(id, message);
                };
                break;
            // If the command is unknown, delegate to the active `VersionWorker` to handle it.
            default:
                this.active.message(message, id);
        }
    };
    /**
     * Remove the given stream id from the set of subscribers to update events, if present.
     */
    Driver.prototype.maybeRemoveUpdateListener = function (id) {
        var idx = this.updateListeners.indexOf(id);
        if (idx !== -1) {
            this.updateListeners.splice(idx, 1);
        }
    };
    /**
     * Post a message to the stream with the given id.
     */
    Driver.prototype.sendToStream = function (id, message) {
        if (!this.streams.hasOwnProperty(id)) {
            return;
        }
        this.streams[id].postMessage(message);
    };
    /**
     * Complete the stream with the given id.
     *
     * Per the protocol between the service worker and client tabs, a completion is modeled as
     * a null message.
     */
    Driver.prototype.closeStream = function (id) {
        if (!this.streams.hasOwnProperty(id)) {
            return;
        }
        this.streams[id].postMessage(null);
        delete this.streams[id];
    };
    return Driver;
}());

var PAGE_SCOPE_FROM_SW_SCOPE = /^(https?:\/\/[^/]+)(\/.*)?$/;
// The scope is the global object.
var scope = ((typeof self !== 'undefined') ? self : global);
function copyRequest(req) {
    var copy = {
        method: req.method,
        headers: req.headers,
        credentials: req.credentials,
        cache: req.cache,
        redirect: req.redirect,
        referrer: req.referrer,
    };
    if (req.mode.toString() !== 'navigate') {
        copy['mode'] = req.mode;
    }
    return copy;
}
var NgSwBrowserAdapter = (function () {
    function NgSwBrowserAdapter() {
        this._scope = PAGE_SCOPE_FROM_SW_SCOPE.exec(scope.registration.scope)[1];
    }
    NgSwBrowserAdapter.prototype.newRequest = function (req, init) {
        if (init && init instanceof Request) {
            init = copyRequest(init);
        }
        return new Request(req, init);
    };
    NgSwBrowserAdapter.prototype.newResponse = function (body, init) {
        return new Response(body, init);
    };
    Object.defineProperty(NgSwBrowserAdapter.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        enumerable: true,
        configurable: true
    });
    return NgSwBrowserAdapter;
}());
function bootstrapServiceWorker(options) {
    var manifestUrl = (options && options.manifestUrl) || '/ngsw-manifest.json';
    var plugins = (options && options.plugins) || [];
    var adapter = new NgSwBrowserAdapter();
    var cache = new NgSwCacheImpl(scope.caches, adapter);
    var events = new NgSwEvents(scope);
    var fetch = new NgSwFetch(scope, adapter);
    var clock = new BrowserClock();
    LOGGER.setVerbosity(options.logLevel);
    if (!!options.logHandlers) {
        LOGGER.messages = (function (entry) { return options.logHandlers.forEach(function (handler) { return handler.handle(entry); }); });
    }
    LOGGER.release();
    return new Driver(manifestUrl, plugins, scope, adapter, cache, events, fetch, clock);
}

var UrlMatcher = (function () {
    function UrlMatcher(pattern, config, scope) {
        if (config === void 0) { config = {}; }
        this.pattern = pattern;
        this.scope = scope;
        this.match = config.match || "exact";
        if (this.match === 'regex') {
            this._regex = new RegExp(pattern);
        }
    }
    UrlMatcher.prototype.matches = function (url) {
        // Strip the scope from the URL if present.
        if (url.startsWith(this.scope)) {
            url = url.substr(this.scope.length);
        }
        switch (this.match) {
            case 'exact':
                return this.pattern === url;
            case 'prefix':
                return url.startsWith(this.pattern);
            case 'regex':
                return this._regex.test(url);
        }
    };
    return UrlMatcher;
}());

/**
 * A linked list of items kept in sorted order, according to the given
 * comparison function.
 *
 * Inserting and removing are O(n), the pop() operation is O(1).
 */
var SortedLinkedList = (function () {
    /**
     * Create a new, empty list with the given comparison function.
     */
    function SortedLinkedList(compare) {
        this.compare = compare;
        /**
         * Head of the list, which is null if there are no elements.
         */
        this.head = null;
        /**
         * Tail of the list, which is null if there are no elements.
         */
        this.tail = null;
        /**
         * Tracks the current length of the list.
         */
        this.length = 0;
    }
    /**
     * Insert a new element in a position determined by the
     * comparison function.
     *
     * This is O(n).
     */
    SortedLinkedList.prototype.insert = function (value) {
        // No matter what, inserting will increase the length by one.
        this.length++;
        // Special case insertion into an empty list.
        if (this.head === null) {
            // The head and tail will be the same node, which will have
            // no siblings.
            this.head = this.tail = { value: value, next: null, prev: null };
            return;
        }
        // Scan through the list until `curr` becomes the node after the
        // point where `value` is to be inserted.
        var curr = this.head;
        while (curr !== null) {
            var cmp = this.compare(value, curr.value);
            if (cmp <= 0) {
                // `value` must be inserted before `curr`.
                // At this point though, `curr` could still be at the head
                // of the list, which means that `value` should be the new
                // head.
                if (curr.prev === null) {
                    // `curr` is indeed the current head. Construct a new node
                    // for `value` which has its next sibling as the current
                    // head, and assign it to the current head's previous
                    // sibling reference and also to the list head reference
                    // in one assignment statement.
                    // In other words, go from:
                    //   curr <-> ...
                    // to:
                    //   N(value) <-> curr <-> ...
                    this.head = this.head.prev = { value: value, next: this.head, prev: null };
                }
                else {
                    // `curr` is in the middle of the list, so split `curr` and
                    // `curr.prev` and insert the new node in between.
                    // In other words, go from:
                    //   ... <-> prev <-> curr <-> ...
                    // to:
                    //   ... <-> prev <-> N(value) <-> curr <-> ...
                    curr.prev = curr.prev.next = { value: value, next: curr, prev: curr.prev };
                }
                // New value has been inserted successfully.
                return;
            }
            // Keep iterating through the list until the end is reached or
            // the value is inserted.
            curr = curr.next;
        }
        // Off the end of the list. This means the value belongs after
        // the list tail.
        // Construct the new node to go after the tail, and assign it in
        // one statement.
        // In other words, go from:
        //   ... <-> tail
        // to:
        //   ... <-> tail <-> N(value)
        this.tail = this.tail.next = { value: value, next: null, prev: this.tail };
    };
    /**
     * Remove a value from the list.
     *
     * This is O(n).
     */
    SortedLinkedList.prototype.remove = function (value) {
        // Start at the head of the list and scan through until the
        // value is found or the end of the list is reached.
        var curr = this.head;
        while (curr !== null) {
            // Check the current node to see if it's the one which
            // contains `value.
            if (curr.value === value) {
                // Found it. To remove it, splice prev and next together,
                // if they're set. If they're not, then special logic is
                // needed to handle removes at the head and tail of the
                // list. This splice happens in two steps - the first
                // fixes the pointers in the `prev` direction, the second
                // fixes them in the `next` direction.
                // If the previous node is set, set the pointer from
                // the previous node to skip over `curr`.
                if (curr.prev !== null) {
                    curr.prev.next = curr.next;
                }
                else {
                    // The current node is actually the head (no previous
                    // sibling) so set the new head to be the next node.
                    // The new head's previous pointer also needs to be
                    // fixed (set to null).
                    this.head = curr.next;
                    // There may not be a new head if `curr` was also the
                    // tail.
                    if (this.head !== null) {
                        // Fix the new head's previous pointer.
                        this.head.prev = null;
                    }
                }
                // If the next node is set, set the pointer from the
                // next node back to skip over `curr` in the `prev`
                // direction.
                if (curr.next !== null) {
                    curr.next.prev = curr.prev;
                }
                else {
                    // The current node is actually the tail (no next
                    // sibling, so set the new tail to be the previous
                    // node. The new tail's next pointer also needs to be
                    // fixed (set to null).
                    this.tail = curr.prev;
                    // There may not be a new tail if `curr` was also the
                    // head.
                    if (this.tail !== null) {
                        // Fix the new tail's next pointer.
                        this.tail.next = null;
                    }
                }
                // The node has now been removed, so decrement the
                // length to reflect that.
                this.length--;
                return;
            }
            // Keep iterating through the list.
            curr = curr.next;
        }
        // Ran off the end of the list, but the value wasn't found.
        // This is not an error.
    };
    /**
     * Remove and return the head of the list, or return `null`
     * if the list is empty.
     */
    SortedLinkedList.prototype.pop = function () {
        // If the list is empty, there will be no head node, so
        // check that condition first.
        if (this.head === null) {
            return null;
        }
        // The list is not empty, so go ahead and decrement length
        // to reflect the removal that's about to happen.
        this.length--;
        // Grab the value out of the current head before we remove it.
        var value = this.head.value;
        // In the special case that the list only has one item, set
        // head and tail to null to put the list into an empty state.
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
            return value;
        }
        // this.head.next is guaranteed to be non-null since the special
        // case above was not triggered, so it becomes the new head.
        this.head.next.prev = null;
        this.head = this.head.next;
        return value;
    };
    return SortedLinkedList;
}());

var DEFAULT_CACHE_SIZE = 100;
/**
 * Optionally applies a side effect, returning a `Promise` which waits for the
 * side effect to be applied if it exists, or resolves immediately if not.
 */
function maybeRun(sideEffect) {
    return !!sideEffect ? sideEffect() : Promise.resolve();
}
/**
 * Represents a specific cache group with a single policy.
 */
var DynamicGroup = (function () {
    /**
     * Consumers should use `DynamicGroup.open` instead.
     */
    function DynamicGroup(strategy, config, adapter, cache, matchers, metadata, clock) {
        var _this = this;
        // Obligatory Javaesque assignment of class properties.
        this.strategy = strategy;
        this.config = config;
        this.adapter = adapter;
        this.cache = cache;
        this.matchers = matchers;
        this.metadata = metadata;
        this.clock = clock;
        // Construct the queue with a comparison strategy based on the expiration
        // strategy chosen by the user.
        switch (config.cache.strategy) {
            case 'fifo':
                this.queue = new SortedLinkedList(this.fifoCompare.bind(this));
                break;
            case 'lfu':
                this.queue = new SortedLinkedList(this.lfuCompare.bind(this));
                break;
            case 'lru':
                this.queue = new SortedLinkedList(this.lruCompare.bind(this));
                break;
            default:
                throw new Error("Unknown cache strategy: " + config.cache.strategy);
        }
        Object.keys(this.metadata).forEach(function (url) { return _this.queue.insert(url); });
    }
    /**
     * Constructs a new `DynamicGroup`, based on the given manifest. If this group has
     * never existed before, it will be empty. If it has, the existing metadata will be
     * read out of
     */
    DynamicGroup.open = function (config, adapter, delegateCache, clock, strategies) {
        // The cache passed to open() isn't scoped, so construct a new one that's scoped.
        var cache = new ScopedCache(delegateCache, "dynamic:" + config.name + ":");
        // Select the desired strategy with which to process requests. If the user
        // asked for an invalid strategy, complain.
        var strategy = strategies[config.cache.optimizeFor];
        if (!strategy) {
            throw new Error("No registered optimizeFor handler (" + config.cache.optimizeFor + ") for group " + config.name);
        }
        // Construct the chain of `UrlMatcher`s for all of the URL matching configurations
        // provided in the manifest.
        var matchers = Object
            .keys(config.urls)
            .map(function (url) { return new UrlMatcher(url, config.urls[url], adapter.scope); });
        // Look through the metadata cache for all cached requests, load the metadata for
        // them, and add it to a metadata map, keyed by URL. If this is a fresh cache and
        // there are no requests, then cache.keysOf() will return an empty array, and the
        // resulting metadata map will be empty.
        return cache
            .keysOf('metadata')
            .then(function (keys) { return Promise.all(keys.map(function (key) { return cache
            .load('metadata', key)
            .then(function (resp) { return resp.json(); })
            .then(function (metadata) { return ({ url: key.url, metadata: metadata }); }); })); })
            .then(function (metadata) { return metadata.reduce(function (acc, curr) {
            acc[curr.url] = curr.metadata;
            return acc;
        }, {}); })
            .then(function (metadata) { return new DynamicGroup(strategy, config, adapter, cache, matchers, metadata, clock); });
    };
    /**
     * Match a `Request` against the URL patterns configured for this group.
     */
    DynamicGroup.prototype.matches = function (req) {
        return this.matchers.some(function (matcher) { return matcher.matches(req.url); });
    };
    /**
     * A comparison function for FIFO expiration, that compares two URLs by time added.
     */
    DynamicGroup.prototype.fifoCompare = function (urlA, urlB) {
        var a = this.metadata[urlA];
        var b = this.metadata[urlB];
        return compare(a.addedTs, b.addedTs);
    };
    /**
     * A comparison function for LFU expiration, that compares two URLs by access count.
     */
    DynamicGroup.prototype.lfuCompare = function (urlA, urlB) {
        var a = this.metadata[urlA];
        var b = this.metadata[urlB];
        return compare(a.accessCount, b.accessCount);
    };
    /**
     * A comparison function for LRU expiration, that compares two URLs by time accessed.
     */
    DynamicGroup.prototype.lruCompare = function (urlA, urlB) {
        var a = this.metadata[urlA];
        var b = this.metadata[urlB];
        return compare(a.accessedTs, b.accessedTs);
    };
    /**
     * Fetch a given request from the cache only.
     */
    DynamicGroup.prototype.fetchFromCache = function (req) {
        var _this = this;
        // Firstly, check for metadata. If it doesn't exist, there's no point in
        // continuing, the request isn't cached.
        var metadata = this.metadata[req.url];
        if (!metadata) {
            return Promise.resolve({ response: null });
        }
        // If the user's configured a maxAgeMs value for the cache, check the age of the
        // cached response against it. If it's too old, it needs to be removed from the
        // cache.
        var cacheAge = this.clock.dateNow() - metadata.addedTs;
        if (!!this.config.cache.maxAgeMs && cacheAge > this.config.cache.maxAgeMs) {
            // TODO: Possibly do this as a side effect and not inline.
            // Remove from the in-memory tracking.
            this.queue.remove(req.url);
            delete this.metadata[req.url];
            // And invalidate the entry in the actual cache.
            return Promise
                .all([
                this.cache.invalidate('cache', req.url),
                this.cache.invalidate('metadata', req.url),
            ])
                .then(function () { return ({ response: null }); });
        }
        // The cached response is valid and can be used.
        return this
            .cache
            .load('cache', req.url)
            .then(function (response) {
            // Something went wrong, abort.
            // TODO: maybe need to invalidate the metadata here?
            if (!response) {
                return { response: null };
            }
            // The response is ready, but the metadata needs to be updated. Since this is
            // outside the critical path for servicing the request, it is done in a side
            // effect.
            var sideEffect = function () {
                // Update the 'accessed' stats.
                metadata.accessCount++;
                metadata.accessedTs = _this.clock.dateNow();
                // Return a promise that saves the metadata to the metadata cache.
                return _this
                    .cache
                    .store('metadata', req.url, _this.adapter.newResponse(JSON.stringify(metadata)))
                    .then(function () {
                    _this.queue.remove(req.url);
                    _this.queue.insert(req.url);
                });
            };
            // Finally, construct the final `ResponseWithSideEffects`.
            return { response: response, cacheAge: cacheAge, sideEffect: sideEffect };
        });
    };
    // Fetch a request from the network and store the response in the cache.
    DynamicGroup.prototype.fetchAndCache = function (req, delegate) {
        var _this = this;
        // Call the delegate to run the rest of the fetch pipeline and get the response
        // from downstream plugins.
        return delegate()
            .then(function (response) {
            // Don't cache unsuccessful responses.
            if (!response.ok) {
                return { response: response };
            }
            // TODO: check response size to implement maxSizeBytes.
            // Need to clone the response, as the body will be read twice
            var toCache = response.clone();
            // Adding to the cache is implemented as a side effect.
            var sideEffect = function () {
                // Check if the request already has associated metadata. If it does, then
                // it needs to be updated, otherwise insert new metadata (possibly causing an
                // eviction).
                var metadata = _this.metadata[req.url];
                return !metadata
                    ? _this.insertIntoCache(req.url, toCache)
                    : _this.updateIntoCache(req.url, toCache);
            };
            // Return the response together with the side effect that will cache it.
            return { response: response, sideEffect: sideEffect };
        });
    };
    /**
     * Handle fetching a request, using the configured strategy. `delegate` will invoke
     * the rest of the worker's fetch pipeline, ultimately fetching the request from the
     * network.
     */
    DynamicGroup.prototype.fetch = function (req, delegate) {
        // If the request is mutating (not GET, OPTIONS, or HEAD) then it needs to go to the
        // server directly, bypassing the cache.
        if (req.method !== 'GET' && req.method !== 'OPTIONS' && req.method !== 'HEAD') {
            // TODO: invalidate cache on mutating request.
            var res = delegate().then(function (response) { return ({ response: response }); });
        }
        // Otherwise, delegate to the dynamic caching strategy to handle this request.
        return this.strategy.fetch(this, req, delegate);
    };
    /**
     * Insert a new URL into the cache, returning a `Promise` that resolves when all
     * the metadata updates are complete.
     */
    DynamicGroup.prototype.insertIntoCache = function (url, res) {
        var _this = this;
        // This should never happen, but sanity check that this entry does not have metadata
        // already.
        if (this.metadata[url]) {
            return Promise.reject(new Error("insertIntoCache(" + url + ") but url is already cached"));
        }
        // New metadata entry for this respones.
        var now = this.clock.dateNow();
        var metadata = {
            addedTs: now,
            accessCount: 1,
            accessedTs: now,
        };
        // Start a Promise chain to keep the code organized.
        return Promise
            .resolve()
            .then(function () {
            var maybeEvict = Promise.resolve();
            // Evict items until the cache has room for the new entry.
            var queueLength = _this.queue.length;
            while (queueLength >= (_this.config.cache.maxEntries || DEFAULT_CACHE_SIZE)) {
                queueLength--;
                maybeEvict = maybeEvict.then(function () {
                    // Need to evict something. Pick the top item on the queue and remove it.
                    var evictUrl = _this.queue.pop();
                    delete _this.metadata[evictUrl];
                    // Process the eviction, removing both the cached data and its metadata.
                    return Promise.all([
                        _this.cache.invalidate('cache', evictUrl),
                        _this.cache.invalidate('metadata', evictUrl),
                    ]);
                });
            }
            return maybeEvict;
        })
            .then(function () { return Promise.all([
            _this.cache.store('cache', url, res),
            _this.cache.store('metadata', url, _this.adapter.newResponse(JSON.stringify(metadata))),
        ]); })
            .then(function () {
            // After insertion is complete, track the changes in the in-memory metadata.
            _this.metadata[url] = metadata;
            _this.queue.insert(url);
        });
    };
    DynamicGroup.prototype.updateIntoCache = function (url, res) {
        var _this = this;
        var metadata = this.metadata[url];
        if (!metadata) {
            return Promise.reject(new Error("updateIntoCache(" + url + ") but url is not cached"));
        }
        // Update metadata.
        metadata.accessCount++;
        metadata.addedTs = metadata.accessedTs = this.clock.dateNow();
        return Promise
            .all([
            this.cache.store('cache', url, res),
            this.cache.store('metadata', url, this.adapter.newResponse(JSON.stringify(metadata))),
        ])
            .then(function () {
            _this.queue.remove(url);
            _this.queue.insert(url);
        });
    };
    return DynamicGroup;
}());
/**
 * Compare two numbers, returning -1, 0, or 1 depending on order.
 */
function compare(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a === b) {
        return 0;
    }
    else {
        return 1;
    }
}

function Dynamic(strategies) {
    return function (worker) { return new DynamicImpl(worker, strategies); };
}
/**
 * A plugin which implements dynamic content caching - the caching of requests to
 * arbitrary URLs.
 */
var DynamicImpl = (function () {
    function DynamicImpl(worker, strategies) {
        var _this = this;
        this.worker = worker;
        /**
         * Map of `optimizeFor` strategies to their implementations.
         */
        this.strategies = {};
        // Extract the dynamic section of the manifest.
        this.manifest = worker.manifest['dynamic'];
        // Initially there are no side effects.
        this.sideEffectQueue = Promise.resolve();
        // Build the `strategies` map from all configured strategies.
        strategies.forEach(function (strategy) { return _this.strategies[strategy.name] = strategy; });
    }
    /**
     * After installation, setup the group array for immediate use. On
     * subsequent startups, this step is performed by `validate()`.
     */
    DynamicImpl.prototype.setup = function (ops) {
        var _this = this;
        // If no dynamic caching configuration is provided, skip this plugin.
        if (!this.manifest) {
            return;
        }
        // Ensure even on first installation, the cache groups are loaded and
        // ready to serve traffic.
        ops.push(function () { return _this._setupGroups(); });
    };
    DynamicImpl.prototype.fetch = function (req) {
        var _this = this;
        // If no dynamic caching configuration is provided, skip this plugin.
        if (!this.manifest) {
            return null;
        }
        // Return an instruction that applies dynamic content caching.
        var instruction = function (next) {
            // There may be multiple groups configured. Check whether the request matches any
            // of them.
            var groups = _this.group.filter(function (group) { return group.matches(req); });
            if (groups.length === 0) {
                // It doesn't match any groups - continue down the chain.
                return next();
            }
            // It has matched at least one group. Only the first group is considered.
            return _this
                .sideEffectQueue
                .then(function () { return groups[0].fetch(req, next); })
                .then(function (result) {
                if (!!result.sideEffect) {
                    // If there is a side effect, queue it to happen asynchronously.
                    var effect_1 = result.sideEffect;
                    _this.sideEffectQueue = _this
                        .sideEffectQueue
                        .then(function () { return effect_1(); })
                        .catch(function () { });
                }
                // Extract the response and return it.
                return result.response;
            });
        };
        return instruction;
    };
    /**
     * Ensure all configuration is valid and the Dynamic plugin is ready to serve
     * traffic.
     */
    DynamicImpl.prototype.validate = function () {
        // If no configuration was provided, this plugin is not active.
        if (!this.manifest) {
            return Promise.resolve(true);
        }
        return this
            ._setupGroups()
            .then(function () { return true; })
            .catch(function () { return false; });
    };
    /*
     * For every group configured in the manifest, instantiate the DynamicGroup
     * associated with it, which will validate the configuration. This is an async
     * operation as initializing the DynamicGroup involves loading stored state
     * from the cache.
     */
    DynamicImpl.prototype._setupGroups = function () {
        var _this = this;
        return Promise
            .all(this.manifest.group.map(function (config) {
            return DynamicGroup.open(config, _this.worker.adapter, _this.worker.cache, _this.worker.clock, _this.strategies);
        }))
            .then(function (groups) { return _this.group = groups; });
    };
    return DynamicImpl;
}());

/**
 * A dynamic caching strategy which optimizes for the freshness of data it
 * returns, by always attempting a server fetch first.
 *
 * In the freshness strategy, requests are always sent to the server first.
 * If the network request times out (according to the timeout value passed
 * in the configuration), cached values are used instead, if available.
 *
 * If the network request times out but the cache does not contain data,
 * the network value will still be returned eventually.
 *
 * Regardless of whether the request times out or not, if the network fetch
 * eventually completes then the result is cached for future use.
 */
var FreshnessStrategy = (function () {
    function FreshnessStrategy() {
    }
    Object.defineProperty(FreshnessStrategy.prototype, "name", {
        /**
         * Name of the strategy (matched to the value in `optimizeFor`).
         */
        get: function () {
            return 'freshness';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Reads the cache configuration from the group's config.
     */
    FreshnessStrategy.prototype.config = function (group) {
        return group.config.cache;
    };
    /**
     * Makes a request using this strategy, falling back on the `delegate` if
     * the cache is not being used.
     */
    FreshnessStrategy.prototype.fetch = function (group, req, delegate) {
        // Firstly, read the configuration.
        var config = this.config(group);
        var unrestrictedFetch = group
            .fetchAndCache(req, delegate)
            .catch(function () { return ({ response: null }); });
        // By default, wait for the network request indefinitely.
        var networkFetch = unrestrictedFetch;
        // If a timeout is defined, then only wait that long before reverting to
        // the cache.
        if (!!config.networkTimeoutMs) {
            // Race the indefinite fetch operation with a timer that returns a null
            // response after the configured network timeout.
            networkFetch = Promise.race([
                unrestrictedFetch,
                this
                    .timeout(config.networkTimeoutMs, group.clock)
                    .then(function () { return ({ response: null }); }),
            ]);
        }
        return networkFetch
            .then(function (rse) {
            if (rse.response === null) {
                // Network request failed or timed out. Check the cache to see if
                // this request is available there.
                return group
                    .fetchFromCache(req)
                    .then(function (cacheRse) {
                    // Regardless of whether the cache hit, the network request may
                    // still be going, so set up a side effect that runs the cache
                    // effect first and the network effect following. This ensures
                    // the network result will be cached if/when it comes back.
                    var sideEffect = function () { return maybeRun(cacheRse.sideEffect)
                        .then(function () { return unrestrictedFetch; })
                        .then(function (netRse) { return maybeRun(netRse.sideEffect); }); };
                    // Check whether the cache had the data or not.
                    if (cacheRse.response !== null) {
                        // Cache hit, the response is available in the cache.
                        return {
                            response: cacheRse.response,
                            cacheAge: cacheRse.cacheAge,
                            sideEffect: sideEffect,
                        };
                    }
                    else {
                        // The cache was missing the data. Right now, just fall back
                        // on the indefinite fetch from the network.
                        return unrestrictedFetch;
                    }
                });
            }
            else {
                // The network returned in time, no need to consult the cache.
                return rse;
            }
        });
    };
    /**
     * Constructs a promise that resolves after a delay.
     */
    FreshnessStrategy.prototype.timeout = function (delay, clock) {
        return new Promise(function (resolve) { return clock.setTimeout(resolve, delay); });
    };
    return FreshnessStrategy;
}());

/**
 * A dynamic caching strategy which optimizes for the performance of requests
 * it serves, by placing the cache before the network.
 *
 * In the performance strategy, requests always hit the cache first. If cached
 * data is available it is returned immediately, and the network is not (usually)
 * consulted.
 *
 * An exception to this rule is if the user configures a `refreshAheadMs` age.
 * If cached responses are older than this configured age, a network request will
 * be made in the background to update them, even though the cached value is
 * returned to the consumer anyway. This allows caches to still be effective while
 * not letting them become too stale.
 *
 * If data is not available in the cache, it is fetched from the network and
 * cached.
 */
var PerformanceStrategy = (function () {
    function PerformanceStrategy() {
    }
    Object.defineProperty(PerformanceStrategy.prototype, "name", {
        /**
         * Name of the strategy (matched to the value in `optimizeFor`).
         */
        get: function () {
            return 'performance';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Reads the cache configuration from the group's config.
     */
    PerformanceStrategy.prototype.config = function (group) {
        return group.config.cache;
    };
    /**
     * Makes a request using this strategy, falling back on the `delegate` if
     * the cache is not being used.
     */
    PerformanceStrategy.prototype.fetch = function (group, req, delegate) {
        // Firstly, read the configuration.
        var config = this.config(group);
        return group
            .fetchFromCache(req)
            .then(function (rse) {
            // Check whether the cache had data.
            if (rse.response === null) {
                // No response found, fall back on the network.
                return group.fetchAndCache(req, delegate);
            }
            else if (!!rse.cacheAge && config.refreshAheadMs !== undefined && rse.cacheAge >= config.refreshAheadMs) {
                // Response found, but it's old enough to trigger refresh ahead.
                // The side affect in rse.sideEffect is to update the metadata for the cache,
                // but that can be ignored since a fresh fetch will also update the metadata.
                // So return the cached response, but with a side effect that fetches from
                // the network and ignores the result, but runs that side effect instead
                // (which will update the cache to contain the new, fresh data).
                return {
                    response: rse.response,
                    cacheAge: rse.cacheAge,
                    sideEffect: function () { return group
                        .fetchAndCache(req, delegate)
                        .then(function (raRse) { return maybeRun(raRse.sideEffect); }); },
                };
            }
            else {
                // Response found, and refresh ahead behavior was not triggered. Just return
                // the response directly.
                return rse;
            }
        });
    };
    return PerformanceStrategy;
}());

function ExternalContentCache(options) {
    var manifestKey = (options && options.manifestKey) || 'external';
    return function (worker) { return new ExternalPlugin(worker, manifestKey); };
}
var ExternalPlugin = (function () {
    function ExternalPlugin(worker, key) {
        this.worker = worker;
        this.key = key;
        this.cacheKey = key === 'external' ? key : "external:" + key;
    }
    Object.defineProperty(ExternalPlugin.prototype, "externalManifest", {
        get: function () {
            return this.worker.manifest[this.key];
        },
        enumerable: true,
        configurable: true
    });
    ExternalPlugin.prototype.setup = function (operations) {
        var _this = this;
        if (!this.externalManifest || !this.externalManifest.urls) {
            return;
        }
        operations.push.apply(operations, this
            .externalManifest
            .urls
            .map(function (url) { return cacheFromNetworkOp(_this.worker, url.url, _this.cacheKey); }));
    };
    ExternalPlugin.prototype.fetch = function (req) {
        return fetchFromCacheInstruction(this.worker, req, this.cacheKey);
    };
    return ExternalPlugin;
}());

function RouteRedirection() {
    return function (worker) { return new RouteRedirectionImpl(worker); };
}
var RouteRedirectionImpl = (function () {
    function RouteRedirectionImpl(worker) {
        this.worker = worker;
    }
    Object.defineProperty(RouteRedirectionImpl.prototype, "routeManifest", {
        get: function () {
            return this.worker.manifest['routing'];
        },
        enumerable: true,
        configurable: true
    });
    RouteRedirectionImpl.prototype.hasExtension = function (path) {
        var lastSegment = path.substr(path.lastIndexOf('/') + 1);
        return lastSegment.indexOf('.') !== -1;
    };
    RouteRedirectionImpl.prototype.setup = function (operations) {
        // No setup needed.
    };
    RouteRedirectionImpl.prototype.fetch = function (req) {
        var _this = this;
        var manifest = this.routeManifest;
        if (!manifest || !manifest.routes) {
            return;
        }
        var _a = parseUrl(req.url), base = _a[0], path = _a[1];
        var matchesRoutingTable = Object.keys(manifest.routes).some(function (route) {
            var config = manifest.routes[route];
            if (config['match']) {
                var matcher = new UrlMatcher(route, config, _this.worker.adapter.scope);
                return matcher.matches(req.url);
            }
            else {
                var oldConfig = config;
                var matchesPath = oldConfig.prefix
                    ? path.indexOf(route) === 0
                    : path === route;
                var matchesPathAndExtension = matchesPath &&
                    (!oldConfig.onlyWithoutExtension || !_this.hasExtension(path));
                return matchesPathAndExtension;
            }
        });
        if (matchesRoutingTable) {
            return rewriteUrlInstruction(this.worker, req, base + manifest.index);
        }
        else {
            return null;
        }
    };
    return RouteRedirectionImpl;
}());
function parseUrl(full) {
    var isHttp = full.toLowerCase().startsWith('http://');
    var isHttps = full.toLowerCase().startsWith('https://');
    if (!isHttp && !isHttps) {
        // Relative url.
        return ['', full];
    }
    var protocol = 'http://';
    var protocolSuffix = full.substr('http://'.length);
    if (isHttps) {
        protocol = 'https://';
        protocolSuffix = full.substr('https://'.length);
    }
    var rootSlash = protocolSuffix.indexOf('/');
    if (rootSlash === -1) {
        return [full, '/'];
    }
    return [full.substr(0, protocol.length + rootSlash), protocolSuffix.substr(rootSlash)];
}

function StaticContentCache(options) {
    var manifestKey = (options && options.manifestKey) || 'static';
    return function (worker) { return new StaticContentCacheImpl(worker, manifestKey); };
}
var StaticContentCacheImpl = (function () {
    function StaticContentCacheImpl(worker, key) {
        this.worker = worker;
        this.key = key;
        this.cacheKey = key === 'static' ? key : "static:" + key;
    }
    Object.defineProperty(StaticContentCacheImpl.prototype, "staticManifest", {
        get: function () {
            return this.worker.manifest[this.key];
        },
        enumerable: true,
        configurable: true
    });
    StaticContentCacheImpl.prototype.shouldCacheBustFn = function () {
        var shouldCacheBust = function (url) { return true; };
        if (!!this.staticManifest.versioned && Array.isArray(this.staticManifest.versioned)) {
            var regexes_1 = this.staticManifest.versioned.map(function (expr) { return new RegExp(expr); });
            shouldCacheBust = function (url) { return !regexes_1.some(function (regex) { return regex.test(url); }); };
        }
        return shouldCacheBust;
    };
    StaticContentCacheImpl.prototype.setup = function (operations) {
        var _this = this;
        var shouldCacheBust = this.shouldCacheBustFn();
        operations.push.apply(operations, Object
            .keys(this.staticManifest.urls)
            .map(function (url) { return function () {
            return _this
                .worker
                .cache
                .load(_this.cacheKey, url)
                .then(function (resp) {
                if (!!resp) {
                    LOG.technical("setup(" + _this.cacheKey + ", " + url + "): no need to refresh " + url + " in the cache");
                    return null;
                }
                LOG.technical("setup(" + _this.cacheKey + ", " + url + "): caching from network");
                return cacheFromNetworkOp(_this.worker, url, _this.cacheKey, shouldCacheBust(url))();
            });
        }; }));
    };
    StaticContentCacheImpl.prototype.update = function (operations, previous) {
        var _this = this;
        var shouldCacheBust = this.shouldCacheBustFn();
        operations.push.apply(operations, Object
            .keys(this.staticManifest.urls)
            .map(function (url) {
            var hash = _this.staticManifest.urls[url];
            var previousHash = previous.staticManifest.urls[url];
            if (previousHash === hash) {
                LOG.technical("update(" + _this.cacheKey + ", " + url + "): no need to refresh " + url + " in the cache");
                return copyExistingOrFetchOp(previous.worker, _this.worker, url, _this.cacheKey);
            }
            else {
                LOG.technical("update(" + _this.cacheKey + ", " + url + "): caching from network");
                return cacheFromNetworkOp(_this.worker, url, _this.cacheKey, shouldCacheBust(url));
            }
        }));
    };
    StaticContentCacheImpl.prototype.fetch = function (req) {
        return fetchFromCacheInstruction(this.worker, req, this.cacheKey);
    };
    StaticContentCacheImpl.prototype.cleanup = function (operations) {
        operations.push(deleteCacheOp(this.worker, this.cacheKey));
    };
    StaticContentCacheImpl.prototype.validate = function () {
        var _this = this;
        return Promise
            .all(Object
            .keys(this.staticManifest.urls)
            .map(function (url) { return _this.worker.cache.load(_this.cacheKey, url); }))
            .then(function (resps) { return resps.every(function (resp) { return !!resp && resp.ok; }); });
    };
    return StaticContentCacheImpl;
}());

var EMPTY_MANIFEST = {};
var NOTIFICATION_OPTION_NAMES = [
    'actions',
    'body',
    'dir',
    'icon',
    'lang',
    'renotify',
    'requireInteraction',
    'tag',
    'vibrate',
    'data'
];
function Push() {
    return function (worker) { return new PushImpl(worker); };
}
var PushImpl = (function () {
    function PushImpl(worker) {
        this.worker = worker;
        this.streams = [];
        this.buffer = [];
    }
    Object.defineProperty(PushImpl.prototype, "pushManifest", {
        get: function () {
            return this.worker.manifest['push'] || EMPTY_MANIFEST;
        },
        enumerable: true,
        configurable: true
    });
    PushImpl.prototype.setup = function (ops) { };
    PushImpl.prototype.message = function (message, id) {
        var _this = this;
        switch (message['cmd']) {
            case 'push':
                this.streams.push(id);
                if (this.buffer !== null) {
                    this.buffer.forEach(function (message) { return _this.worker.sendToStream(id, message); });
                    this.buffer = null;
                }
                break;
        }
    };
    PushImpl.prototype.messageClosed = function (id) {
        var index = this.streams.indexOf(id);
        if (index === -1) {
            return;
        }
        this.streams.splice(index, 1);
        if (this.streams.length === 0) {
            this.buffer = [];
        }
    };
    PushImpl.prototype.push = function (data) {
        var _this = this;
        var message;
        try {
            message = JSON.parse(data);
        }
        catch (e) {
            // If the string can't be parsed, display it verbatim.
            message = {
                notification: {
                    title: data,
                },
            };
        }
        this.maybeShowNotification(message);
        if (this.buffer !== null) {
            this.buffer.push(message);
        }
        else {
            this.streams.forEach(function (id) {
                _this.worker.sendToStream(id, message);
            });
        }
    };
    PushImpl.prototype.maybeShowNotification = function (data) {
        if (!data.notification || !data.notification.title) {
            return;
        }
        var manifest = this.pushManifest;
        if (!manifest.showNotifications || (!!manifest.backgroundOnly && this.buffer === null)) {
            return;
        }
        var desc = data.notification;
        var options = {};
        NOTIFICATION_OPTION_NAMES
            .filter(function (name) { return desc.hasOwnProperty(name); })
            .forEach(function (name) { return options[name] = desc[name]; });
        this.worker.showNotification(desc['title'], options);
    };
    return PushImpl;
}());

bootstrapServiceWorker({
    manifestUrl: 'ngsw-manifest.json',
    plugins: [
        StaticContentCache(),
        Dynamic([
            new FreshnessStrategy(),
            new PerformanceStrategy(),
        ]),
        ExternalContentCache(),
        RouteRedirection(),
        Push(),
    ],
});

}());