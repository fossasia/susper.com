var Hashes = require('../../hashes');
  
// sample string
var str = 'This is a sample text!';

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

console.log('jsHashes\nBase64 encoding hash example...\n');

console.log('MD5 -> ' + MD5.b64(str));
console.log('SHA1 -> ' + SHA1.b64(str));
console.log('SHA256 -> ' + SHA256.b64(str));
console.log('SHA512 -> ' + SHA512.b64(str));
console.log('RIPEMD160 -> ' + RMD160.b64(str));
