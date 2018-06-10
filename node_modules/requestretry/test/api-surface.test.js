'use strict';

var request = require('../');
var t = require('chai').assert;

describe('API surface', function () {

  describe('request methods', function(){
    it('should work with .on', function(f){
      request('http://httpbin.org/delay/0.1').on('end', function(){
        f();
      });
    });
  });

  describe('callback api', function(){
    [['request', request], ['request.get', request.get]].forEach(function(pair){
      it('should work with '+pair[0]+'(url, f)', function (done) {
        pair[1]('http://www.filltext.com/?rows=1', function (err, response, body) {
          t.strictEqual(response.statusCode, 200);
          t.strictEqual(response.body, '[{}]');
          done();
        });
      });

      it('should work with '+pair[0]+'(url, object, f)', function (done) {
        pair[1]('http://www.filltext.com/?rows=1', {
          json:true,
        }, function (err, response, body) {
          t.strictEqual(response.statusCode, 200);
          t.deepEqual(response.body, [{}]);
          done();
        });
      });

      it('should work with '+pair[0]+'(object, f)', function (done) {
        pair[1]({
          url: 'http://www.filltext.com/?rows=1',
          json:true
        }, function (err, response, body) {
          t.strictEqual(response.statusCode, 200);
          t.deepEqual(response.body, [{}]);
          done();
        });
      });
    });
  });

  describe('promise api', function(){
    [['request', request], ['request.get', request.get]].forEach(function(pair){
      it('should work with '+pair[0]+'(url)', function (done) {
        pair[1]('http://www.filltext.com/?rows=1')
        .then(function (response) {
          t.strictEqual(response.statusCode, 200);
          t.strictEqual(response.body, '[{}]');
          done();
        });
      });

      it('should work with request(url, object)', function (done) {
        pair[1]('http://www.filltext.com/?rows=1', {
          json:true,
        })
        .then(function (response) {
          t.strictEqual(response.statusCode, 200);
          t.deepEqual(response.body, [{}]);
          done();
        });
      });

      it('should work with '+pair[0]+'(object)', function (done) {
        pair[1]({
          url: 'http://www.filltext.com/?rows=1',
          json:true
        })
        .then(function (response) {
          t.strictEqual(response.statusCode, 200);
          t.deepEqual(response.body, [{}]);
          done();
        });
      });
    });
  });
});
