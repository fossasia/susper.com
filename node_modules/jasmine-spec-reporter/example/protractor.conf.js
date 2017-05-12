var SpecReporter = require('../src/jasmine-spec-reporter.js');

exports.config = {
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    silent: true,
    defaultTimeoutInterval: 360000,
    print: function () {
    }
  },
  specs: [
    './protractor-spec.js'
  ],
  capabilities: {
    browserName: 'chrome',
    'chromeOptions': {
      args: ['--test-type']
    }
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter());
  }
};
