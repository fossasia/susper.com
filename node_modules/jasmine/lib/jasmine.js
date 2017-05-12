var path = require('path'),
    util = require('util'),
    glob = require('glob'),
    exit = require('./exit'),
    CompletionReporter = require('./reporters/completion_reporter'),
    ConsoleSpecFilter = require('./filters/console_spec_filter');

module.exports = Jasmine;
module.exports.ConsoleReporter = require('./reporters/console_reporter');

function Jasmine(options) {
  options = options || {};
  var jasmineCore = options.jasmineCore || require('jasmine-core');
  this.jasmineCorePath = path.join(jasmineCore.files.path, 'jasmine.js');
  this.jasmine = jasmineCore.boot(jasmineCore);
  this.projectBaseDir = options.projectBaseDir || path.resolve();
  this.printDeprecation = options.printDeprecation || require('./printDeprecation');
  this.specFiles = [];
  this.helperFiles = [];
  this.env = this.jasmine.getEnv();
  this.reportersCount = 0;
  this.completionReporter = new CompletionReporter();
  this.onCompleteCallbackAdded = false;
  this.exit = exit;
  this.showingColors = true;
  this.reporter = new module.exports.ConsoleReporter();
  this.env.addReporter(this.reporter);

  var jasmineRunner = this;
  this.completionReporter.onComplete(function(passed) {
    jasmineRunner.exitCodeCompletion(passed);
  });

  this.coreVersion = function() {
    return jasmineCore.version();
  };
}

Jasmine.prototype.randomizeTests = function(value) {
  this.env.randomizeTests(value);
};

Jasmine.prototype.seed = function(value) {
  this.env.seed(value);
};

Jasmine.prototype.showColors = function(value) {
  this.showingColors = value;
};

Jasmine.prototype.addSpecFile = function(filePath) {
  this.specFiles.push(filePath);
};

Jasmine.prototype.addReporter = function(reporter) {
  this.env.addReporter(reporter);
  this.reportersCount++;
};

Jasmine.prototype.provideFallbackReporter = function(reporter) {
  this.env.provideFallbackReporter(reporter);
};

Jasmine.prototype.configureDefaultReporter = function(options) {
  options.timer = options.timer || new this.jasmine.Timer();
  options.print = options.print || function() {
    process.stdout.write(util.format.apply(this, arguments));
  };
  options.showColors = options.hasOwnProperty('showColors') ? options.showColors : true;
  options.jasmineCorePath = options.jasmineCorePath || this.jasmineCorePath;

  if(options.onComplete) {
    this.printDeprecation('Passing in an onComplete function to configureDefaultReporter is deprecated.');
  }
  this.reporter.setOptions(options);
};

Jasmine.prototype.addMatchers = function(matchers) {
  this.jasmine.Expectation.addMatchers(matchers);
};

Jasmine.prototype.loadSpecs = function() {
  this.specFiles.forEach(function(file) {
    require(file);
  });
};

Jasmine.prototype.loadHelpers = function() {
  this.helperFiles.forEach(function(file) {
    require(file);
  });
};

Jasmine.prototype.loadConfigFile = function(configFilePath) {
  try {
    var absoluteConfigFilePath = path.resolve(this.projectBaseDir, configFilePath || 'spec/support/jasmine.json');
    var config = require(absoluteConfigFilePath);
    this.loadConfig(config);
  } catch (e) {
    if(configFilePath || e.code != 'MODULE_NOT_FOUND') { throw e; }
  }
};

Jasmine.prototype.loadConfig = function(config) {
  var jasmineRunner = this;
  jasmineRunner.specDir = config.spec_dir || '';

  if(config.helpers) {
    config.helpers.forEach(function(helperFile) {
      var filePaths = glob.sync(path.join(jasmineRunner.projectBaseDir, jasmineRunner.specDir, helperFile));
      filePaths.forEach(function(filePath) {
        if(jasmineRunner.helperFiles.indexOf(filePath) === -1) {
          jasmineRunner.helperFiles.push(filePath);
        }
      });
    });
  }

  this.env.throwOnExpectationFailure(config.stopSpecOnExpectationFailure);
  this.env.randomizeTests(config.random);

  if(config.spec_files) {
    jasmineRunner.addSpecFiles(config.spec_files);
  }
};

Jasmine.prototype.addSpecFiles = function(files) {
  var jasmineRunner = this;

  files.forEach(function(specFile) {
    var filePaths = glob.sync(path.join(jasmineRunner.projectBaseDir, jasmineRunner.specDir, specFile));
    filePaths.forEach(function(filePath) {
      if(jasmineRunner.specFiles.indexOf(filePath) === -1) {
        jasmineRunner.specFiles.push(filePath);
      }
    });
  });
};

Jasmine.prototype.onComplete = function(onCompleteCallback) {
  this.completionReporter.onComplete(onCompleteCallback);
};

Jasmine.prototype.stopSpecOnExpectationFailure = function(value) {
  this.env.throwOnExpectationFailure(value);
};

Jasmine.prototype.exitCodeCompletion = function(passed) {
  if(passed) {
    this.exit(0, process.platform, process.version, process.exit, require('exit'));
  }
  else {
    this.exit(1, process.platform, process.version, process.exit, require('exit'));
  }
};

Jasmine.prototype.execute = function(files, filterString) {
  this.loadHelpers();
  this.configureDefaultReporter({ showColors: this.showingColors });

  if(filterString) {
    var specFilter = new ConsoleSpecFilter({
      filterString: filterString
    });
    this.env.specFilter = function(spec) {
      return specFilter.matches(spec.getFullName());
    };
  }

  if (files && files.length > 0) {
    this.specDir = '';
    this.specFiles = [];
    this.addSpecFiles(files);
  }

  this.loadSpecs();

  this.addReporter(this.completionReporter);
  this.env.execute();
};
