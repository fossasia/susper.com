'use strict';

var iconv = require('iconv-lite');

/**
 * Character set encoding and decoding functions
 */
var charset = module.exports = {

    /**
     * Encodes an unicode string into an Buffer object as UTF-8
     *
     * We force UTF-8 here, no strange encodings allowed.
     *
     * @param {String} str String to be encoded
     * @return {Buffer} UTF-8 encoded typed array
     */
    encode: function (str) {
        return new Buffer(str, 'utf-8');
    },

    /**
     * Decodes a string from Buffer to an unicode string using specified encoding
     *
     * @param {Buffer} buf Binary data to be decoded
     * @param {String} [fromCharset='UTF-8'] Binary data is decoded into string using this charset
     * @return {String} Decded string
     */
    decode: function (buf, fromCharset) {
        fromCharset = charset.normalizeCharset(fromCharset || 'UTF-8');

        if (/^(us\-)?ascii|utf\-8|7bit$/i.test(fromCharset)) {
            return buf.toString('utf-8');
        }

        return iconv.decode(buf, fromCharset);
    },

    /**
     * Convert a string from specific encoding to UTF-8 Buffer
     *
     * @param {String|Buffer} str String to be encoded
     * @param {String} [fromCharset='UTF-8'] Source encoding for the string
     * @return {Buffer} UTF-8 encoded typed array
     */
    convert: function (data, fromCharset) {
        fromCharset = charset.normalizeCharset(fromCharset || 'UTF-8');

        var bufString;

        if (typeof data !== 'string') {
            if (/^(us\-)?ascii|utf\-8|7bit$/i.test(fromCharset)) {
                return data;
            }
            bufString = charset.decode(data, fromCharset);
            return charset.encode(bufString);
        }
        return charset.encode(data);
    },

    /**
     * Converts well known invalid character set names to proper names.
     * eg. win-1257 will be converted to WINDOWS-1257
     *
     * @param {String} charset Charset name to convert
     * @return {String} Canoninicalized charset name
     */
    normalizeCharset: function (charset) {
        var match;

        if ((match = charset.match(/^utf[\-_]?(\d+)$/i))) {
            return 'UTF-' + match[1];
        }

        if ((match = charset.match(/^win(?:dows)?[\-_]?(\d+)$/i))) {
            return 'WINDOWS-' + match[1];
        }

        if ((match = charset.match(/^latin[\-_]?(\d+)$/i))) {
            return 'ISO-8859-' + match[1];
        }

        return charset;
    }
};
