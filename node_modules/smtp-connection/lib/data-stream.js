'use strict';

var stream = require('stream');
var Transform = stream.Transform;
var util = require('util');

module.exports = DataStream;

/**
 * Escapes dots in the beginning of lines. Ends the stream with <CR><LF>.<CR><LF>
 * Also makes sure that only <CR><LF> sequences are used for linebreaks
 *
 * @param {Object} options Stream options
 */
function DataStream(options) {
    // init Transform
    this.options = options || {};
    this._curLine = '';

    this.inByteCount = 0;
    this.outByteCount = 0;
    this.lastByte = false;

    Transform.call(this, this.options);
}
util.inherits(DataStream, Transform);

/**
 * Escapes dots
 */
DataStream.prototype._transform = function (chunk, encoding, done) {
    var chunks = [];
    var chunklen = 0;
    var i, len, lastPos = 0;
    var buf;

    if (!chunk || !chunk.length) {
        return done();
    }

    if (typeof chunk === 'string') {
        chunk = new Buffer(chunk);
    }

    this.inByteCount += chunk.length;

    for (i = 0, len = chunk.length; i < len; i++) {
        if (chunk[i] === 0x2E) { // .
            if (
                (i && chunk[i - 1] === 0x0A) ||
                (!i && (!this.lastByte || this.lastByte === 0x0A))
            ) {
                buf = chunk.slice(lastPos, i + 1);
                chunks.push(buf);
                chunks.push(new Buffer('.'));
                chunklen += buf.length + 1;
                lastPos = i + 1;
            }
        } else if (chunk[i] === 0x0A) { // .
            if (
                (i && chunk[i - 1] !== 0x0D) ||
                (!i && this.lastByte !== 0x0D)
            ) {
                if (i > lastPos) {
                    buf = chunk.slice(lastPos, i);
                    chunks.push(buf);
                    chunklen += buf.length + 2;
                } else {
                    chunklen += 2;
                }
                chunks.push(new Buffer('\r\n'));
                lastPos = i + 1;
            }
        }
    }

    if (chunklen) {
        // add last piece
        if (lastPos < chunk.length) {
            buf = chunk.slice(lastPos);
            chunks.push(buf);
            chunklen += buf.length;
        }

        this.outByteCount += chunklen;
        this.push(Buffer.concat(chunks, chunklen));
    } else {
        this.outByteCount += chunk.length;
        this.push(chunk);
    }

    this.lastByte = chunk[chunk.length - 1];
    done();
};

/**
 * Finalizes the stream with a dot on a single line
 */
DataStream.prototype._flush = function (done) {
    var buf;
    if (this.lastByte === 0x0A) {
        buf = new Buffer('.\r\n');
    } else if (this.lastByte === 0x0D) {
        buf = new Buffer('\n.\r\n');
    } else {
        buf = new Buffer('\r\n.\r\n');
    }
    this.outByteCount += buf.length;
    this.push(buf);
    done();
};
