var DisplayProcessor = require('../../src/display-processor');

function TestProcessor(options) {
  this.test = options.test;
}

TestProcessor.prototype = new DisplayProcessor();

TestProcessor.prototype.displayJasmineStarted = function (runner, log) {
  return log + this.test;
};

TestProcessor.prototype.displaySuite = function (suite, log) {
  return log + this.test;
};

TestProcessor.prototype.displaySpecStarted = function (spec, log) {
  return spec.description + this.test;
};

TestProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return log + this.test;
};

TestProcessor.prototype.displayFailedSpec = function (spec, log) {
  return log + this.test;
};

TestProcessor.prototype.displayPendingSpec = function (spec, log) {
  return log + this.test;
};

module.exports = TestProcessor;
