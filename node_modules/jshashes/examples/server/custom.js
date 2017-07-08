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

console.log('jsHashes\nCustom encoding values example...\n');

// custom string value to use for hash encoding
var custom = 'abc123';

console.log('MD5 -> ' + MD5.any(str,custom));
console.log('SHA1 -> ' + SHA1.any(str,custom));
console.log('SHA256 -> ' + SHA256.any(str,custom));
console.log('SHA512 -> ' + SHA512.any(str,custom));
console.log('RIPEMD160 -> ' + RMD160.any(str,custom));
