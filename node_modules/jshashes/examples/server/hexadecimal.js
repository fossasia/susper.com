var Hashes = require('../../hashes');
  
// sample string
var str = 'This is a sample text';

// new MD5 instance
var MD5 = new Hashes.MD5;
// new SHA1 instance
var SHA1 = new Hashes.SHA1;
// new SHA256 instance
var SHA256 =  new Hashes.SHA256;
// new SHA512 instace
var SHA512 = new Hashes.SHA512;
// new RIPEMD160 instace
var RMD160 = new Hashes.RMD160;

console.log('jsHashes\nHexadecimal encoding hashes example...\n');

console.log('MD5 -> ' + MD5.hex(str));
console.log('SHA1 -> ' + SHA1.hex(str));
console.log('SHA256 -> ' + SHA256.hex(str));
console.log('SHA512 -> ' + SHA512.hex(str));
console.log('RIPEMD160 -> ' + RMD160.hex(str));
