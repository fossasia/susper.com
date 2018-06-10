'use strict';

var request = require('../');
var t = require('chai').assert;

describe('Auth', function () {
    it('should work with Basic Authentication', function (done) {
        var r = request.defaults({
            json: true
        });
        r('http://httpbin.org/basic-auth/user/passwd', function (err, response, body) {
            t.strictEqual(response.statusCode, 200);
            t.strictEqual(body.authenticated, true);
            t.strictEqual(body.user, 'user');
            done();
        }).auth('user', 'passwd', false);
    });
});