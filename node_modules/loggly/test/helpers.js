/*
 * helpers.js: Test helpers for node-loggly
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    loggly = require('../lib/loggly');

var helpers = exports;

helpers.validConfig = function (config) {
  return config
    && config.subdomain !== 'test-subdomain'
    && config.auth
    && config.auth.username !== 'test-username'
    && config.auth.password !== 'test-password'
    && config.token;
};

helpers.loadConfig = function () {
  try {
    var config = require('./config');
    if (!helpers.validConfig(config)) {
      throw new Error(util.format('test/config.json: invalid data %j', config));
    }

    helpers.config = config || {};
    return helpers.config;
  }
  catch (ex) {
    console.log('Error parsing test/config.json');
    throw ex;
  }
};

helpers.assertSearch = function (err, results) {
  assert.isNull(err);
  assert.isObject(results);
  assert.isArray(results.events);
  assert.isTrue(typeof results.total_events !== 'undefined');
};
