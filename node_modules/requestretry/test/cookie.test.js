'use strict';

var request = require('../');
var t = require('chai').assert;

describe('Cookie', function () {
    it('should work with custom cookie jar', function (done) {
        const j = request.jar();
        var url = 'http://httpbin.org/cookies/set?k2=v2&k1=v1';
        request({
            url,
            jar: j,
            json: true
        }, function (err, response, body) {
            t.strictEqual(response.statusCode, 200);
            var cookies = j.getCookies(url);
            t.strictEqual(cookies.length, 2);
            t.strictEqual(cookies.filter(c => c.key === 'k1')[0].value, 'v1');
            t.strictEqual(cookies.filter(c => c.key === 'k2')[0].value, 'v2');
            done();
        });
    });
});