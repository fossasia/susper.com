/**
 * Test HMAC functionality.
 */
var assert = require('assert');
var jsHashes = require('../');

var MD5 = new jsHashes.MD5;
MD5.setUTF8(false);

// test vectors from http://www.ietf.org/rfc/rfc2104.txt
describe('Test MD5 HMAC (rfc2104)', function() {
    it("should pass test vector #1", function() {
        var key = '\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b';
        assert.equal(MD5.hex_hmac(key, 'Hi There'),
                     "9294727a3638bb1c13f48ef8158bfc9d");
    });
    it("should pass test vector #2", function() {
        assert.equal(MD5.hex_hmac("Jefe", "what do ya want for nothing?"),
                     "750c783e6ab0b503eaa86e310a5db738");
    });
    it("should pass test vector #3", function() {
        var key = '', data = '', i;
        for (i=0; i<16; i++) {
            key += '\xAA';
        }
        for (i=0; i<50; i++) {
            data += '\xDD';
        }
        assert.equal(MD5.hex_hmac(key, data),
                     '56be34521d144c88dbb8c733f0e8b3f6');
    });
});

// test vectors from
// http://en.wikipedia.org/wiki/Hash-based_message_authentication_code
// SHA512/RMD160 from https://quickhash.com/
var testVectors = [
    {
        key: "",
        data: "",
        hmac: {
            MD5: "74e6f7298a9c2d168935f58c001bad88",
            SHA1: "fbdb1d1b18aa6c08324b7d64b71fb76370690e1d",
            SHA256: "b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad",
            SHA512: "b936cee86c9f87aa5d3c6f2e84cb5a4239a5fe50480a6ec66b70ab5b1f4ac6730c6c515421b327ec1d69402e53dfb49ad7381eb067b338fd7b0cb22247225d47",
            RMD160: "44d86b658a3e7cbc1a2010848b53e35c917720ca"
        }
    },
    {
        key: "key",
        data: "The quick brown fox jumps over the lazy dog",
        hmac: {
            MD5: "80070713463e7749b90c2dc24911e275",
            SHA1: "de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9",
            SHA256: "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8",
            SHA512: "b42af09057bac1e2d41708e48a902e09b5ff7f12ab428a4fe86653c73dd248fb82f948a549f7b791a5b41915ee4d1ec3935357e4e2317250d0372afa2ebeeb3a",
            RMD160: "50278a77d4d7670561ab72e867383aef6ce50b3e"
        }
    },
    // Test key > block size
    // These vectors are from https://quickhash.com/
    {
        key: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        data: "The quick brown fox jumps over the lazy dog",
        hmac: {
            MD5: "8e86bf7840bbe52ba3f45030dba9d39a",
            SHA1: "ee114807434bea4ab839b940286f0c3f5b4f8a11",
            SHA256: "359706cae34991529dbf545ed055bed283da8b7339807db6affa2ae517d8b389",
            SHA512: "3135e1514cd8f6b471feb6980eedd1858047dd0c1fd44b135fade32d053b9a649f6c448fb81a6f0dc77f28f7d2505cd475aea018f90ff6961bd775acf3b8daad",
            RMD160: "5031d8b3399e949d4a48c9fcf10ae537b7294cbb"
        }
    }
];
describe('Test HMAC (wikipedia test vectors)', function() {
    testVectors.forEach(function(tv) {
        var key = tv.key, data = tv.data;
        describe('key='+JSON.stringify(key)+" data="+JSON.stringify(data), function() {
            Object.keys(tv.hmac).forEach(function(h) {
                it('should have the correct HMAC_'+h, function() {
                    var HF = new jsHashes[h]();
                    assert.equal(HF.hex_hmac(key, data), tv.hmac[h]);
                });
            });
        });
    });
});
