'use strict';

var stream = require('stream');
var util = require('util');
var Transform = stream.Transform;

// expose to the world
module.exports = {
    encode: encode,
    decode: decode,
    wrap: wrap,
    Encoder: Encoder,
    Decoder: Decoder
};

/**
 * Encodes a Buffer into a base64 encoded string
 *
 * @param {Buffer} buffer Buffer to convert
 * @returns {String} base64 encoded string
 */
function encode(buffer) {
    if (typeof buffer === 'string') {
        buffer = new Buffer(buffer, 'utf-8');
    }

    return buffer.toString('base64');
}

/**
 * Decodes a base64 encoded string to a Buffer object
 *
 * @param {String} str base64 encoded string
 * @returns {Buffer} Decoded value
 */
function decode(str) {
    str = (str || '');
    return new Buffer(str, 'base64');
}

/**
 * Adds soft line breaks to a base64 string
 *
 * @param {String} str base64 encoded string that might need line wrapping
 * @param {Number} [lineLength=76] Maximum allowed length for a line
 * @returns {String} Soft-wrapped base64 encoded string
 */
function wrap(str, lineLength) {
    str = (str || '').toString();
    lineLength = lineLength || 76;

    if (str.length <= lineLength) {
        return str;
    }

    return str.replace(new RegExp('.{' + lineLength + '}', 'g'), '$&\r\n').trim();
}

/**
 * Creates a transform stream for encoding data to base64 encoding
 *
 * @constructor
 * @param {Object} options Stream options
 * @param {Number} [options.lineLength=76] Maximum lenght for lines, set to false to disable wrapping
 */
function Encoder(options) {
    // init Transform
    this.options = options || {};

    if (this.options.lineLength !== false) {
        this.options.lineLength = this.options.lineLength || 76;
    }

    this._curLine = '';
    this._remainingBytes = false;

    this.inputBytes = 0;
    this.outputBytes = 0;

    Transform.call(this, this.options);
}
util.inherits(Encoder, Transform);

Encoder.prototype._transform = function(chunk, encoding, done) {
    var b64, _self = this;

    if (encoding !== 'buffer') {
        chunk = new Buffer(chunk, encoding);
    }

    if (!chunk || !chunk.length) {
        return done();
    }

    this.inputBytes += chunk.length;

    if (this._remainingBytes && this._remainingBytes.length) {
        chunk = Buffer.concat([this._remainingBytes, chunk]);
        this._remainingBytes = false;
    }

    if (chunk.length % 3) {
        this._remainingBytes = chunk.slice(chunk.length - chunk.length % 3);
        chunk = chunk.slice(0, chunk.length - chunk.length % 3);
    } else {
        this._remainingBytes = false;
    }

    b64 = this._curLine + encode(chunk);

    if (this.options.lineLength) {
        b64 = wrap(b64, this.options.lineLength);
        b64 = b64.replace(/(^|\n)([^\n]*)$/, function(match, lineBreak, lastLine) {
            _self._curLine = lastLine;
            return lineBreak;
        });
    }

    if (b64) {
        this.outputBytes += b64.length;
        this.push(b64);
    }

    done();
};

Encoder.prototype._flush = function(done) {
    if (this._remainingBytes && this._remainingBytes.length) {
        this._curLine += encode(this._remainingBytes);
    }
    if (this._curLine) {
        this._curLine = wrap(this._curLine, this.options.lineLength);
        this.outputBytes += this._curLine.length;
        this.push(this._curLine, 'ascii');
        this._curLine = '';
    }
    done();
};

/**
 * Creates a transform stream for decoding base64 encoded strings
 *
 * @constructor
 * @param {Object} options Stream options
 */
function Decoder(options) {
    // init Transform
    this.options = options || {};
    this._curLine = '';

    this.inputBytes = 0;
    this.outputBytes = 0;

    Transform.call(this, this.options);
}
util.inherits(Decoder, Transform);

Decoder.prototype._transform = function(chunk, encoding, done) {
    var b64, buf;

    chunk = chunk.toString('ascii');

    if (!chunk || !chunk.length) {
        return done();
    }

    this.inputBytes += chunk.length;

    b64 = (this._curLine + chunk);
    this._curLine = '';

    b64 = b64.replace(/[^a-zA-Z0-9+\/=]/g, '');

    if (b64.length % 4) {
        this._curLine = b64.substr(-b64.length % 4);
        if (this._curLine.length == b64.length) {
            b64 = '';
        } else {
            b64 = b64.substr(0, this._curLine.length);
        }
    }

    if (b64) {
        buf = decode(b64);
        this.outputBytes += buf.length;
        this.push(buf);
    }

    done();
};

Decoder.prototype._flush = function(done) {
    var b64, buf;
    if (this._curLine) {
        buf = decode(this._curLine);
        this.outputBytes += buf.length;
        this.push(buf);
        this._curLine = '';
    }
    done();
};