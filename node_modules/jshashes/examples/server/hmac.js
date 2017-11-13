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

console.log('jsHashes\nHashes example with HMAC salt key encoding...\n');

// HMAC salt key
var key = 'th!$-!S-@-k3Y';

// hexadecimal
console.log('Hexadecimal:');
console.log('MD5 -> ' + MD5.hex_hmac(str,key));
console.log('SHA1 -> ' + SHA1.hex_hmac(str,key));
console.log('SHA256 -> ' + SHA256.hex_hmac(str,key));
console.log('SHA512 -> ' + SHA512.hex_hmac(str,key));
console.log('RIPEMD160 -> ' + RMD160.hex_hmac(str,key));

// base64
console.log('\nBase64:');
console.log('MD5 -> ' + MD5.b64_hmac(str,key));
console.log('SHA1 -> ' + SHA1.b64_hmac(str,key));
console.log('SHA256 -> ' + SHA256.b64_hmac(str,key));
console.log('SHA512 -> ' + SHA512.b64_hmac(str,key));
console.log('RIPEMD160 -> ' + RMD160.b64_hmac(str,key));

// custom encoding values

var custom = 'abc123';

console.log('\nCustom encoding values:');
console.log('MD5 -> ' + MD5.any_hmac(str,key,custom));
console.log('SHA1 -> ' + SHA1.any_hmac(str,key,custom));
console.log('SHA256 -> ' + SHA256.any_hmac(str,key,custom));
console.log('SHA512 -> ' + SHA512.any_hmac(str,key,custom));
console.log('RIPEMD160 -> ' + RMD160.any_hmac(str,key,custom));
