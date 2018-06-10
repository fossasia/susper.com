/*
 * search.js: chainable search functions for Loggly
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var events = require('events'),
    util = require('util'),
    qs = require('querystring'),
    timespan = require('timespan'),
    common = require('./common');

//
// ### function Search (options, client, callback)
// #### @options {Object} Options for the search instance
// #### @client {Loggly} Loggly API client
// Chainable search object for Loggly API
//
var Search = exports.Search = function (options, client) {
  if (!options || (!options.query && !options.q)) {
    throw new Error('options.query is required to execute a Loggly search.');
  }

  events.EventEmitter.call(this);

  if (options.query) {
    options.q = options.query;
    delete options.query;
  }

  this.options = options;
  this.client  = client;

  //
  // If we're passed a callback, run immediately.
  //
  if (options.callback) {
    this.callback = options.callback;
    delete options.callback;
    this.run();
  }
};

//
// Inherit from events.EventEmitter
//
util.inherits(Search, events.EventEmitter);

//
// ### function run (callback)
// #### @callback {function} Continuation to respond to when complete
// Runs the search query for for this instance with the query, and
// other parameters that have been configured on it.
//
Search.prototype.run = function (callback) {
  var self = this,
      responded;

  //
  // Trim the search query
  //
  this.options.q.trim();

  //
  // Update the callback for this instance if it's passed
  //
  this.callback = callback || this.callback;
  if (!this.callback) {
    throw new Error('Cannot run search without a callback function.');
  }

  //
  // ### function respond (arguments...)
  // Responds only once.
  //
  function respond() {
    if (!responded) {
      responded = true;
      self.callback.apply(null, arguments);
    }
  }

  //
  // ### function awaitResults (rsid)
  // Checks the Loggly API on an interval for the
  // results from the specified `rsid`.
  //
  function awaitResults(rsid) {
    if (!rsid || !rsid.id) {
      return respond(rsid);
    }

    common.loggly({
      uri:  self.client.logglyUrl('events?' + qs.stringify({ rsid: rsid.id })),
      auth: self.client.auth,
      json: true
    }, respond, function (res, body) {
      var results;
      try { results = JSON.parse(body) }
      catch (ex) { return respond(ex) }
      respond(null, results);
    });
  }

  //
  // Check any time ranges (if supplied) to ensure
  // they are valid.
  //
  this._checkRange();

  common.loggly({
    uri:  this.client.logglyUrl('search?' + qs.stringify(this.options)),
    auth: this.client.auth,
    json: true
  }, this.callback, function (res, body) {
    var rsid;
    try { rsid = JSON.parse(body).rsid }
    catch (ex) { rsid = ex }

    self.emit('rsid', rsid);
    awaitResults(rsid);
  });

  return this;
};

//
// ### function _checkRange ()
// Checks if the range that has been configured for this
// instance is valid and updates if it is not.
//
Search.prototype._checkRange = function () {
  if (!this.options.until && !this.options.from) {
    return;
  }

  this.options.until = this.options.until || 'now';
  this.options.from  = this.options.from  || '-24h';

  if (!timespan.parseDate(this.options.until)) {
    this.options.until = 'now';
  }

  if (!timespan.parseDate(this.options.from)) {
    this.options.from = '-24h';
  }

  if (timespan.fromDates(this.options.from, this.options.until) < 0
    || this.options.until === this.options.from) {
    //
    // If the length of the timespan for this Search instance is
    // negative then set it to default values
    //
    this.options.until = 'now';
    this.options.from = '-24h';
  }

  return this;
};
