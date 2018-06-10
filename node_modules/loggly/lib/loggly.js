/*
 * loggly.js: Wrapper for node-loggly object
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var loggly = exports;

//
// Export node-loggly core client APIs
//
loggly.version       = require('../package.json').version;
loggly.createClient  = require('./loggly/client').createClient;
loggly.serialize     = require('./loggly/common').serialize;
loggly.Loggly        = require('./loggly/client').Loggly;

//
// Export Resources for node-loggly
//
loggly.Search = require('./loggly/search').Search;
