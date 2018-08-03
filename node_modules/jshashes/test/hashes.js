/** Verify hashes. */
var assert = require('assert');
var jsHashes = require('../');

var JSH = {
    // new MD5 instance
    MD5: new jsHashes.MD5,
    // new SHA1 instance
    SHA1: new jsHashes.SHA1,
    // new SHA256 instance
    SHA256: new jsHashes.SHA256,
    // new SHA512 instace
    SHA512: new jsHashes.SHA512,
    // new RIPEMD-160 instace
    RMD160: new jsHashes.RMD160
};
var testVectors = {
    "Hello, world!": {
        MD5: "6cd3556deb0da54bca060b4c39479839",
        SHA1: "943a702d06f34599aee1f8da8ef9f7296031d699",
        SHA256: "315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3",
        SHA512: "c1527cd893c124773d811911970c8fe6e857d6df5dc9226bd8a160614c0cd963a4ddea2b94bb7d36021ef9d865d5cea294a82dd49a0bb269f51f6e7a57f79421"
    },
    // vectors from
    // http://www.ietf.org/rfc/rfc1321.txt
    // http://csrc.nist.gov/groups/ST/toolkit/documents/Examples/SHA1.pdf
    // http://csrc.nist.gov/groups/ST/toolkit/documents/Examples/SHA256.pdf
    // http://csrc.nist.gov/groups/ST/toolkit/documents/Examples/SHA512.pdf
    // http://homes.esat.kuleuven.be/~bosselae/ripemd160.html
    "": {
        MD5: "d41d8cd98f00b204e9800998ecf8427e",
        RMD160: "9c1185a5c5e9fc54612808977ee8f548b2258d31"
    },
    "a": {
        MD5: "0cc175b9c0f1b6a831c399e269772661",
        RMD160: "0bdc9d2d256b3ee9daae347be6f4dc835a467ffe"
    },
    "abc": {
        MD5: "900150983cd24fb0d6963f7d28e17f72",
        SHA1: "a9993e364706816aba3e25717850c26c9cd0d89d",
        SHA256: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
        SHA512: "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
        RMD160: "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc"
    },
    "message digest": {
        MD5: "f96b697d7cb7938d525a2f31aaf161d0",
        RMD160: "5d0689ef49d2fae572b881b123a85ffa21595f36"
    },
    "abcdefghijklmnopqrstuvwxyz": {
        MD5: "c3fcd3d76192e4007dfb496cca67e13b",
        RMD160: "f71c27109c692c1b56bbdceb5b9d2865b3708dbc"
    },
    "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq": {
        SHA1: "84983e441c3bd26ebaae4aa1f95129e5e54670f1",
        SHA256: "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
        RMD160: "12a053384a9c0c88e405a06c27dcf49ada62eb2b"
    },
    "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu": {
        SHA512: "8e959b75dae313da8cf4f72814fc143f8f7779c6eb9f7fa17299aeadb6889018501d289e4900f7e4331b99dec4b5433ac7d329eeb6dd26545e96e55b874be909"
    },
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789": {
        MD5: "d174ab98d277d9f5a5611c2c9f419d9f",
        RMD160: "b0e20b6e3116640286ed3a87a5713079b21f5189"
    },
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890": {
        MD5: "57edf4a22be3c955ac49da2e2107b67a",
        RMD160: "9b752e45573d4b39f4dbd3323cab82bf63326bfb"
    }
};

Object.keys(testVectors).forEach(function(v) {
    describe('Test vector: '+JSON.stringify(v), function() {
        Object.keys(testVectors[v]).forEach(function(h) {
            it('should have the proper '+h+' hash', function() {
                var HF = new jsHashes[h]();//JSH[h]
                var computedHash = HF.hex(v);
                assert.equal(computedHash, testVectors[v][h]);
            });
        });
    });
});
