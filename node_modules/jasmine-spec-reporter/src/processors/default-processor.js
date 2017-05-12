var DisplayProcessor = require('../display-processor');

function DefaultProcessor() {}

DefaultProcessor.prototype = new DisplayProcessor();

DefaultProcessor.prototype.displayJasmineStarted = function () {
  return 'Spec started';
};

DefaultProcessor.prototype.displaySuite = function (suite) {
  return suite.description;
};

function displaySpecDescription(spec) {
  return spec.description;
}

DefaultProcessor.prototype.displaySuccessfulSpec  = displaySpecDescription;
DefaultProcessor.prototype.displayFailedSpec      = displaySpecDescription;
DefaultProcessor.prototype.displayPendingSpec     = displaySpecDescription;

module.exports = DefaultProcessor;
