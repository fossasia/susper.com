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

vows.describe('node-loggly/search').addBatch({
  "When using the node-loggly client": {
    "the search() method": {
      "when searching without chaining": {
        topic: function () {
          loggly.search('logging message', this.callback)
        },
        "should return a set of valid search results": function (err, results) {
          helpers.assertSearch(err, results);
        }
      },
      "when searching with chaining": {
        topic: function () {
          loggly.search('logging message')
            .run(this.callback);
        },
        "should return a set of valid search results": function (err, results) {
          helpers.assertSearch(err, results);
        }
      }
    },
    "the _checkRange() method": {
      "with invalid options set": {
        "should correct them": function () {
          var search = loggly.search({ query: 'invalid logging message', from: 'now', until: '-1d' })
            ._checkRange();

          assert.equal(search.options.from, 'now');
          assert.equal(search.options.until, '-1d');
        }
      },
      "with valid options set": {
        "should not modify them": function () {
          var search = loggly.search({ query: 'valid logging message', from: '-2M', until: 'now' })
            ._checkRange();

          assert.equal(search.options.from, '-2M');
          assert.equal(search.options.until, 'now');
        }
      }
    }
  }
}).export(module);