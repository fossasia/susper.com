var DisplayProcessor = require('../display-processor');

function SpecPrefixesProcessor(prefixes) {
  var successSymbol = '✓ ',
      failureSymbol = '✗ ',
      pendingSymbol = '* ';

  if (process && process.platform === 'win32') {
    successSymbol = '\u221A ';
    failureSymbol = '\u00D7 ';
    pendingSymbol = '* ';
  }

  this.prefixes = {
    success: prefixes && prefixes.success !== undefined ? prefixes.success : successSymbol,
    failure: prefixes && prefixes.failure !== undefined ? prefixes.failure : failureSymbol,
    pending: prefixes && prefixes.pending !== undefined ? prefixes.pending : pendingSymbol
  }
}

SpecPrefixesProcessor.prototype = new DisplayProcessor();

SpecPrefixesProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return this.prefixes.success + log;
};

SpecPrefixesProcessor.prototype.displayFailedSpec = function (spec, log) {
  return this.prefixes.failure + log;
};

SpecPrefixesProcessor.prototype.displayPendingSpec = function (spec, log) {
  return this.prefixes.pending + log;
};

module.exports = SpecPrefixesProcessor;
