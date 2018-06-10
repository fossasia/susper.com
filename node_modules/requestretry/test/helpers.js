'use strict';

var http = require('http');
var request = require('../').defaults({ json: true });
var t = require('chai').assert;

describe('Helpers', function () {

  var server;
  var url;

  before(function (done) {
    server = http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ method: req.method }));
      res.end();
    });
    server.listen(0, 'localhost', function () {
      url = 'http://' + server.address().address + ':' + server.address().port;
      done();
    });
  });

  it('should provide .get()', function (done) {
    request.get(url, function (err, resp, body) {
      t.strictEqual(resp.statusCode, 200);
      t.strictEqual(resp.request.method, 'GET');
      t.strictEqual(body.method, 'GET');
      done();
    });
  });

  it('should provide .head()', function (done) {
    request.head(url, function (err, resp, body) {
      t.strictEqual(resp.statusCode, 200);
      t.strictEqual(resp.request.method, 'HEAD');
      t.strictEqual(body, undefined);
      done();
    });
  });

  it('should provide .post()', function (done) {
    request.post(url, function (err, resp, body) {
      t.strictEqual(resp.statusCode, 200);
      t.strictEqual(resp.request.method, 'POST');
      t.strictEqual(body.method, 'POST');
      done();
    });
  });

  it('should provide .put()', function (done) {
    request.put(url, function (err, resp, body) {
      t.strictEqual(resp.statusCode, 200);
      t.strictEqual(resp.request.method, 'PUT');
      t.strictEqual(body.method, 'PUT');
      done();
    });
  });

  it('should provide .patch()', function (done) {
    request.patch(url, function (err, resp, body) {
      t.strictEqual(resp.statusCode, 200);
      t.strictEqual(resp.request.method, 'PATCH');
      t.strictEqual(body.method, 'PATCH');
      done();
    });
  });

  it('should provide .delete()', function (done) {
    request.delete(url, function (err, resp, body) {
      t.strictEqual(resp.statusCode, 200);
      t.strictEqual(resp.request.method, 'DELETE');
      t.strictEqual(body.method, 'DELETE');
      done();
    });
  });

  it('should provide .del()', function (done) {
    request.del(url, function (err, resp, body) {
      t.strictEqual(resp.statusCode, 200);
      t.strictEqual(resp.request.method, 'DELETE');
      t.strictEqual(body.method, 'DELETE');
      done();
    });
  });

  after(function (done) {
    if (server) {
      server.close(function () {
        done();
      });
    } else {
      done();
    }
  });

});