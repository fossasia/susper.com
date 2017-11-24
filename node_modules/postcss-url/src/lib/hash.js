'use strict';

const crypto = require('crypto');
const xxh = require('xxhashjs');
const HEXBASE = 16;

const defaultHashOptions = {
    method: 'xxhash32',
    shrink: 8
};

const getxxhash = (content, options) => {
    const hashFunc = options.method === 'xxhash32' ? xxh.h32 : xxh.h64;
    const seed = 0;

    return hashFunc(seed)
    .update(content)
    .digest()
    .toString(HEXBASE);
};

const getHash = (content, options) => {
    if (typeof options.method === 'function') {
        return options.method(content);
    }

    if (options.method.indexOf('xxhash') === 0) {
        return getxxhash(content, options);
    }

    try {
        const hashFunc = crypto.createHash(options.method);

        return hashFunc.update(content)
        .digest('hex');
    } catch (e) {
        return null;
    }
};

module.exports = function(content, options) {
    options = options || defaultHashOptions;

    let hash = getHash(content, options);

    if (hash == null) {
        // bad hash method; fallback to defaults
        // TODO: warning/error reporting?
        hash = getHash(content, defaultHashOptions);
    }

    return options.shrink ? hash.substr(0, options.shrink) : hash;
};
