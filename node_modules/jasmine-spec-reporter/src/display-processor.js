function DisplayProcessor () {}

DisplayProcessor.prototype.displayJasmineStarted = function (info, log) {
  return log;
};

DisplayProcessor.prototype.displaySuite = function (suite, log) {
  return log;
};

DisplayProcessor.prototype.displaySpecStarted = function (spec, log) {
  return log;
};

DisplayProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return log;
};

DisplayProcessor.prototype.displayFailedSpec = function (spec, log) {
  return log;
};

DisplayProcessor.prototype.displayPendingSpec = function (spec, log) {
  return log;
};

module.exports = DisplayProcessor;
