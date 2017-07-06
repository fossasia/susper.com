'use strict';

var core = require('./core');

/**
 * Small nifty thick that allows us to download a fresh set regexs from t3h
 * Int3rNetz when we want to. We will be using the compiled version by default
 * but users can opt-in for updates.
 *
 * @param {Boolean} refresh Refresh the dataset from the remote
 * @api public
 */
module.exports = function updater() {
  try {
    require('./lib/update').update(function updating(err, results) {
      if (err) {
        console.log('[useragent] Failed to update the parsed due to an error:');
        console.log('[useragent] '+ (err.message ? err.message : err));
        return;
      }

      regexps = results;

      // OperatingSystem parsers:
      osparsers = regexps.os;
      osparserslength = osparsers.length;

      // UserAgent parsers:
      agentparsers = regexps.browser;
      agentparserslength = agentparsers.length;

      // Device parsers:
      deviceparsers = regexps.device;
      deviceparserslength = deviceparsers.length;
    });
  } catch (e) {
    console.error('[useragent] If you want to use automatic updating, please add:');
    console.error('[useragent]   - request (npm install request --save)');
    console.error('[useragent]   - yamlparser (npm install yamlparser --save)');
    console.error('[useragent] To your own package.json');
  }
};


Object.keys(core).forEach(function(key){
  module.exports[key] = core[key];
});

// Override the exports with our newly set module.exports
exports = module.exports;
