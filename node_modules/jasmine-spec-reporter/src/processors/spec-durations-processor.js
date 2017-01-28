var DisplayProcessor = require('../display-processor');

function SpecDurationsProcessor() {}

SpecDurationsProcessor.prototype = new DisplayProcessor();

function displayDuration(spec, log) {
  return log + ' (' + spec.duration + ')';
}

SpecDurationsProcessor.prototype.displaySuccessfulSpec  = displayDuration;
SpecDurationsProcessor.prototype.displayFailedSpec      = displayDuration;

module.exports = SpecDurationsProcessor;
