require('coffee-script/register');
var path = require('path');
var Jasmine = require('jasmine');
var SpecReporter = require('../src/jasmine-spec-reporter.js');
var noop = function () {};

var jrunner = new Jasmine();
jrunner.configureDefaultReporter({print: noop});
jasmine.getEnv().addReporter(new SpecReporter({
  displayStacktrace: 'none',
  displayFailuresSummary: true,
  displayPendingSummary: true,
  displaySuccessfulSpec: true,
  displayFailedSpec: true,
  displayPendingSpec: true,
  displaySpecDuration: false,
  displaySuiteNumber: false,
  colors: {
    success: 'green',
    failure: 'red',
    pending: 'yellow'
  },
  prefixes: {
    success: '✓ ',
    failure: '✗ ',
    pending: '* '
  },
  customProcessors: []
}));
jrunner.projectBaseDir = '';
jrunner.specDir = '';
jrunner.addSpecFiles([path.resolve('example/example-spec.coffee')]);
jrunner.execute();
