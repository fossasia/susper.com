'use strict';

var request = require('../');
var t = require('chai').assert;
var sinon = require('sinon');

describe('Request attempts', function () {
  it('should show 1 attempt after a successful call', function (done) {
    request.get('http://www.filltext.com/?rows=1', function (err, response, body) {
      t.strictEqual(response.statusCode, 200);
      t.strictEqual(response.attempts, 1);
      done();
    });
  });

  it('should show 3 attempts after some retries', function (done) {
    request({
      url: 'http://www.filltext.com/?rows=1&err=500', // return a 500 status
      maxAttempts: 3,
      retryDelay: 100
    }, function (err, response, body) {
      t.strictEqual(response.statusCode, 500);
      t.strictEqual(response.attempts, 3);
      done();
    });
  });

  it('should show 3 attempts after retry even when a network error happens and response object is undefined', function (done) {
    request({
      url: 'http://www.whatever-non-existant-domain-here.com/', // return a Could not resolve host: error
      maxAttempts: 3,
      retryDelay: 100
    }, function (err, response, body) {
      t.strictEqual(err.attempts, 3);
      t.strictEqual(response, undefined);
      done();
    });
  });

  it('should call delay strategy 2 times after some retries', function (done) {
    var mockDelayStrategy = sinon.stub().returns(500);
    var startTime = process.hrtime();
    request({
      url: 'http://www.filltext.com/?rows=1&err=500', // return a 500 status
      maxAttempts: 3,
      retryDelay: 1000000, // Set to large delay to prove it will not be used
      delayStrategy: mockDelayStrategy
    }, function (err, response, body) {
      var endTime = process.hrtime(startTime); // process.hrtime returns an array [seconds, nanoseconds]
      var timeDiff = endTime[0] * 1000 + endTime[1]/1000000;

      t.isAtLeast(timeDiff, 1000, 'delayStrategy\'s return value was not used or was used incorrectly');
      t.isTrue(mockDelayStrategy.calledTwice, 'mockDelayStrategy was called an incorrect amount of times'); // reason it's called 2 and not 3 times is because there is no delay for the first call
      done();
    });
  });
});

