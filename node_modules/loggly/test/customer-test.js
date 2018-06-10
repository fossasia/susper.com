/*
 * search-test.js: Tests for Loggly search requests
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    helpers = require('./helpers');

var options = {},
    testContext = {},
    config = helpers.loadConfig(),
    loggly = require('../lib/loggly').createClient(config);

vows.describe('node-loggly/customer').addBatch({
  "When using the node-loggly client": {
    "the customer() method": {
      topic: function () {
        loggly.customer(this.callback);
      },
      "should return a valid customer": function (err, customer) {
        assert.isNull(err);
        assert.isArray(customer.tokens);
        assert.isString(customer.subdomain);
        assert.isObject(customer.subscription);
      }
    }
  }
}).export(module);