var Hashes = require('../../hashes');
 
function randomString(string_length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	string_length = string_length || 50;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

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

var num = 10000;
var str = randomString(100);

console.log('Simple benchmark test generating ' + num + ' hashes for each algorithm.');
console.log('String: "' + str + '"\n');

console.log('* MD5');
var time = new Date().getTime();
for (var i=0; i<num; i++) {
	MD5.hex(str);
}
console.log('** Done in: ' + Math.round( new Date().getTime() - time ) + ' miliseconds');

console.log('* SHA1');
time = new Date().getTime();
for (var i=0; i<num; i++) {
	SHA1.hex(str);
}
console.log('** Done in: ' + Math.round( new Date().getTime() - time ) + ' miliseconds');

console.log('* SHA256');
time =  new Date().getTime();
for (var i=0; i<num; i++) {
	SHA256.hex(str);
}
console.log('** Done in: ' + Math.round( new Date().getTime() - time ) + ' miliseconds');

console.log('* SHA512');
time = new Date().getTime();
for (var i=0; i<num; i++) {
	SHA512.hex(str);
}
console.log('** Done in: ' + Math.round( new Date().getTime() - time ) + ' miliseconds');

console.log('* RMD160');
time =  new Date().getTime();
for (var i=0; i<num; i++) {
	RMD160.hex(str);
}
console.log('** Done in: ' + Math.round( new Date().getTime() - time ) + ' miliseconds');
