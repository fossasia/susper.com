'use strict';

/*
 * Request
 *
 * Copyright(c) 2014 Francois-Guillaume Ribreau <npm@fgribreau.com>
 * MIT Licensed
 *
 */
var extend = require('extend');
var when = require('when');
var request = require('request');
var RetryStrategies = require('./strategies');
var _ = require('lodash');

var DEFAULTS = {
  maxAttempts: 5, // try 5 times
  retryDelay: 5000, // wait for 5s before trying again
  fullResponse: true, // resolve promise with the full response object
  promiseFactory: defaultPromiseFactory // Function to use a different promise implementation library
};

// Default promise factory which use bluebird
function defaultPromiseFactory(resolver) {
  return when.promise(resolver);
}

/**
 * It calls the promiseFactory function passing it the resolver for the promise
 *
 * @param {Object} requestInstance - The Request Retry instance
 * @param {Function} promiseFactoryFn - The Request Retry instance
 * @return {Object} - The promise instance
 */
function makePromise(requestInstance, promiseFactoryFn) {

  // Resolver function wich assigns the promise (resolve, reject) functions
  // to the requestInstance
  function Resolver(resolve, reject) {
    this._resolve = resolve;
    this._reject = reject;
  }

  return promiseFactoryFn(Resolver.bind(requestInstance));
}

function Request(url, options, f, retryConfig) {
  // ('url')
  if(_.isString(url)){
    // ('url', f)
    if(_.isFunction(options)){
      f = options;
    }

    if(!_.isObject(options)){
      options = {};
    }

    // ('url', {object})
    options.url = url;
  }

  if(_.isObject(url)){
    if(_.isFunction(options)){
      f = options;
    }
    options = url;
  }

  this.maxAttempts = retryConfig.maxAttempts;
  this.retryDelay = retryConfig.retryDelay;
  this.fullResponse = retryConfig.fullResponse;
  this.attempts = 0;

  /**
   * Option object
   * @type {Object}
   */
  this.options = options;

  /**
   * Return true if the request should be retried
   * @type {Function} (err, response) -> Boolean
   */
  this.retryStrategy = _.isFunction(options.retryStrategy) ? options.retryStrategy : RetryStrategies.HTTPOrNetworkError;

  /**
   * Return a number representing how long request-retry should wait before trying again the request
   * @type {Boolean} (err, response, body) -> Number
   */
  this.delayStrategy = _.isFunction(options.delayStrategy) ? options.delayStrategy : function() { return this.retryDelay; };

  this._timeout = null;
  this._req = null;

  this._callback = _.isFunction(f) ? _.once(f) : null;

  // create the promise only when no callback was provided
  if (!this._callback) {
    this._promise = makePromise(this, retryConfig.promiseFactory);
  }

  this.reply = function requestRetryReply(err, response, body) {
    if (this._callback) {
      return this._callback(err, response, body);
    }

    if (err) {
      return this._reject(err);
    }

    // resolve with the full response or just the body
    response = this.fullResponse ? response : body;
    this._resolve(response);
  };
}

Request.request = request;

Request.prototype._tryUntilFail = function () {
  this.maxAttempts--;
  this.attempts++;

  this._req = Request.request(this.options, function (err, response, body) {
    if (response) {
      response.attempts = this.attempts;
    }

    if (err) {
      err.attempts = this.attempts;
    }

    if (this.retryStrategy(err, response, body) && this.maxAttempts > 0) {
      this._timeout = setTimeout(this._tryUntilFail.bind(this), this.delayStrategy.call(this, err, response, body));
      return;
    }

    this.reply(err, response, body);
  }.bind(this));
};

Request.prototype.abort = function () {
  if (this._req) {
    this._req.abort();
  }
  clearTimeout(this._timeout);
  this.reply(new Error('Aborted'));
};

// expose request methods from RequestRetry
['end', 'on', 'emit', 'once', 'setMaxListeners', 'start', 'removeListener', 'pipe', 'write', 'auth'].forEach(function (requestMethod) {
  Request.prototype[requestMethod] = function exposedRequestMethod () {
    return this._req[requestMethod].apply(this._req, arguments);
  };
});

// expose promise methods
['then', 'catch', 'finally', 'fail', 'done'].forEach(function (promiseMethod) {
  Request.prototype[promiseMethod] = function exposedPromiseMethod () {
    if (this._callback) {
      throw new Error('A callback was provided but waiting a promise, use only one pattern');
    }
    return this._promise[promiseMethod].apply(this._promise, arguments);
  };
});

function Factory(url, options, f) {
  var retryConfig = _.chain(_.isObject(url) ? url : options || {}).defaults(DEFAULTS).pick(Object.keys(DEFAULTS)).value();
  var req = new Request(url, options, f, retryConfig);
  req._tryUntilFail();
  return req;
}

// adds a helper for HTTP method `verb` to object `obj`
function makeHelper(obj, verb) {
  obj[verb] = function helper(url, options, f) {
    // ('url')
    if(_.isString(url)){
      // ('url', f)
      if(_.isFunction(options)){
        f = options;
      }

      if(!_.isObject(options)){
        options = {};
      }

      // ('url', {object})
      options.url = url;
    }

    if(_.isObject(url)){
      if(_.isFunction(options)){
        f = options;
      }
      options = url;
    }

    options.method = verb.toUpperCase();
    return obj(options, f);
  };
}

function defaults(defaultOptions, defaultF) {
  var factory = function (options, f) {
    if (typeof options === "string") {
      options = { uri: options };
    }
    return Factory.apply(null, [ extend(true, {}, defaultOptions, options), f || defaultF ]);
  };

  factory.defaults = function (newDefaultOptions, newDefaultF) {
    return defaults.apply(null, [ extend(true, {}, defaultOptions, newDefaultOptions), newDefaultF || defaultF ]);
  };

  factory.Request = Request;
  factory.RetryStrategies = RetryStrategies;

  ['get', 'head', 'post', 'put', 'patch', 'delete'].forEach(function (verb) {
    makeHelper(factory, verb);
  });
  factory.del = factory['delete'];

  ['jar', 'cookie'].forEach(function (method) {
    factory[method] = factory.Request.request[method];
  });

  return factory;
}

module.exports = Factory;

Factory.defaults = defaults;
Factory.Request = Request;
Factory.RetryStrategies = RetryStrategies;

// define .get/.post/... helpers
['get', 'head', 'post', 'put', 'patch', 'delete'].forEach(function (verb) {
  makeHelper(Factory, verb);
});
Factory.del = Factory['delete'];

['jar', 'cookie'].forEach(function (method) {
  Factory[method] = Factory.Request.request[method];
});
