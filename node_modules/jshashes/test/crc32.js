/**
 * Test CRC32 functionality.
 */
var assert = require('assert');
var jsHashes = require('../');

// Test vectors from https://quickhash.com/
// This is actually what quickhash.com calls "CRC32(b)", a "variation
// of CRC32, it is a 32-bit Frame Check Sequence of the formal
// standard 'ITU V.42'."
var testVectors = {
    "": 0x00000000,
    "a": 0xe8b7be43,
    "abc": 0x352441c2,
    "abcdefghijklmnopqrstuvwxyz": 0x4c2750bd,
    "message checksum": 0xf853178f,
    "The quick brown fox jumps over the lazy dog": 0x414fa339,
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789": 0x1fc2e6d2
};

describe('Test CRC32', function() {
    Object.keys(testVectors).forEach(function(data) {
        it('should checksum '+JSON.stringify(data)+' correctly', function() {
            assert.equal(jsHashes.CRC32(data), testVectors[data]);
        });
    });
});
