<div align="center">
  <br><p><strong>request-retry</strong> - HTTP(s) request retry on recoverable errors.</p>
</div>

------------------------------------------------

[![Build Status](https://img.shields.io/circleci/project/FGRibreau/node-request-retry.svg)](https://circleci.com/gh/FGRibreau/node-request-retry/) [![Coverage Status](https://img.shields.io/coveralls/FGRibreau/node-request-retry/master.svg)](https://coveralls.io/github/FGRibreau/node-request-retry?branch=master) [![Deps](	https://img.shields.io/david/FGRibreau/node-request-retry.svg)](https://david-dm.org/FGRibreau/node-request-retry) [![NPM version](https://img.shields.io/npm/v/requestretry.svg)](http://badge.fury.io/js/requestretry) [![Downloads](http://img.shields.io/npm/dm/requestretry.svg)](https://www.npmjs.com/package/requestretry)

[![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/francois-guillaume-ribreau?utm_source=github&utm_medium=button&utm_term=francois-guillaume-ribreau&utm_campaign=github)  [![available-for-advisory](https://img.shields.io/badge/available%20for%20consulting%20advisory-yes-ff69b4.svg?)](http://bit.ly/2c7uFJq) ![extra](https://img.shields.io/badge/actively%20maintained-yes-ff69b4.svg)

![NPM](https://nodei.co/npm/requestretry.png?downloadRank=true) ![NPM](https://nodei.co/npm-dl/requestretry.png?months=3&height=2)

When the connection fails with one of `ECONNRESET`, `ENOTFOUND`, `ESOCKETTIMEDOUT`, `ETIMEDOUT`, `ECONNREFUSED`, `EHOSTUNREACH`, `EPIPE`, `EAI_AGAIN` or when an HTTP 5xx error occurrs, the request will automatically be re-attempted as these are often recoverable errors and will go away on retry.


> ## ❤️ Shameless plug
> - [**Charts, simple as a URL**. No more server-side rendering pain, 1 url = 1 chart](https://image-charts.com)
> - [Looking for a free **Redis GUI**?](http://redsmin.com) [Or for **real-time alerting** & monitoring for Redis?](http://redsmin.com)

## Installation

Install with [npm](https://npmjs.org/package/requestretry).

    npm install --save requestretry

## Usage

Request-retry is a drop-in replacement for [request](https://github.com/mikeal/request) but adds two new options `maxAttempts` and `retryDelay`. It also adds one property to the response (or the error object, upon a network error), `attempts`. It supports callbacks or promises.

### With callbacks

```javascript
var request = require('requestretry');

request({
  url: 'https://api.domain.com/v1/a/b',
  json: true,

  // The below parameters are specific to request-retry
  maxAttempts: 5,   // (default) try 5 times
  retryDelay: 5000,  // (default) wait for 5s before trying again
  retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
}, function(err, response, body){
  // this callback will only be called when the request succeeded or after maxAttempts or on error
  if (response) {
    console.log('The number of request attempts: ' + response.attempts);
  }
});
```

### With promises

When you're using promises, you can pass the two following options:
- `fullResponse` _(default true)_ - To resolve the promise with the full response or just the body
- `promiseFactory` _(default whenjs)_ - A function to allow the usage of a different promise implementation library

```javascript
request({
  url: 'https://api.domain.com/v1/a/b',
  json: true,

  fullResponse: true // (default) To resolve the promise with the full response or just the body
})
.then(function (response) {
  // response = The full response object or just the body
})
.catch(function(error) {
  // error = Any occurred error
})
```

**Using `promiseFactory` option to use a different promise implementation library**

```javascript
// See the tests for different libraries usage examples

/**
 * @param  {Function} resolver The promise resolver function
 * @return {Object} The promise instance
 */
function customPromiseFactory(resolver) {
  // With when.js
  return require('when').promise(resolver);

  // With RSVP.js
  var Promise = require('rsvp').Promise;

  return new Promise(resolver);
}

request({
  url: 'https://api.domain.com/v1/a/b',
  json: true,

  // Custom promise factory function
  promiseFactory: customPromiseFactory
})
.then(function (response) {
  // response = The full response object or just the body
})
.catch(function(error) {
  // error = Any occurred error
})
```

## How to define your own retry strategy

A retry strategy let you specify when request-retry should retry a request

```javascript
/**
 * @param  {Null | Object} err
 * @param  {Object} response
 * @param  {Object} body
 * @return {Boolean} true if the request should be retried
 */
function myRetryStrategy(err, response, body){
  // retry the request if we had an error or if the response was a 'Bad Gateway'
  return err || response.statusCode === 502;
}

request({
  url: 'https://api.domain.com/v1/a/b'
  json:true,
  retryStrategy: myRetryStrategy
}, function(err, response, body){
  // this callback will only be called when the request succeeded or after maxAttempts or on error
});
```

## How to define your own delay strategy

A delay strategy let you specify how long request-retry should wait before trying again the request

```javascript
/**
 * @param  {Null | Object} err
 * @param  {Object} response
 * @param  {Object} body
 * @return {Number} number of milliseconds to wait before trying again the request
 */
function myDelayStrategy(err, response, body){
  // set delay of retry to a random number between 500 and 3500 ms
  return Math.floor(Math.random() * (3500 - 500 + 1) + 500);
}

request({
  url: 'https://api.domain.com/v1/a/b'
  json:true,
  delayStrategy: myDelayStrategy // delayStrategy is called 1 less times than the maxAttempts set
}, function(err, response, body){
  // this callback will only be called when the request succeeded or after maxAttempts or on error
});
```

Here is how to implement an exponential backoff strategy:

```javascript
/**
 * @param   {Number} attempts The number of times that the request has been attempted.
 * @return  {Number} number of milliseconds to wait before retrying again the request.
 */
function getExponentialBackoff(attempts) {
  return (Math.pow(2, attempts) * 100) + Math.floor(Math.random() * 50);
}

function constructExponentialBackoffStrategy() {
  let attempts = 0;
  return () => {
    attempts += 1;
    return getExponentialBackoff(attempts);
  };
}

request({
  url: 'https://api.domain.com/v1/a/b'
  json:true,
  delayStrategy: constructExponentialBackoffStrategy() // need to invoke the function to return the closure.
}, function(err, response, body){
  // this callback will only be called when the request succeeded or after maxAttempts or on error
});
```

## Modifying `request` options

You can use the `defaults` method to provide default options like so:

```javascript
var request = require('requestretry').defaults({ json: true, retryStrategy: myRetryStrategy });
```

## API surface

As with `request`, several helpers are provided for various HTTP methods and usage:

* `request(options [, callback])`.
* `request(url [, callback])` - same as `request(options [, callback])`.
* `request(url, options [, callback])` - same as `request(options [, callback])`.
* `request.get(url [, callback])` - same as `request(options [, callback])`, defaults `options.method` to `GET`.
* `request.get(url, options  [, callback])` - same as `request(options [, callback])`, defaults `options.method` to `GET`.
* `request.head(url)` - same as `request(options [, callback])`, defaults `options.method` to `HEAD`.
* `request.post(url)` - same as `request(options [, callback])`, defaults `options.method` to `POST`.
* `request.put(url)` - same as `request(options [, callback])`, defaults `options.method` to `PUT`.
* `request.patch(url)` - same as `request(options [, callback])`, defaults `options.method` to `PATCH`.
* `request.del(url)` - same as `request(options [, callback])`, defaults `options.method` to `DELETE`.
* `request.delete(url)` - same as `request(options [, callback])`, defaults `options.method` to `DELETE`.

## [Changelog](CHANGELOG.md)

## You want to support my work?

I maintain this project in my free time, if it helped you, well, I would be grateful to buy a beer thanks to your [paypal](https://paypal.me/fgribreau) or [Bitcoins](https://www.coinbase.com/fgribreau), donation!

[Francois-Guillaume Ribreau](http://fgribreau.com) (npm@fgribreau.com)
