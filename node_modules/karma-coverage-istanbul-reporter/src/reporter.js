'use strict';

const istanbul = require('istanbul-api');
const util = require('./util');

const BROWSER_PLACEHOLDER = '%browser%';

function checkThresholds(thresholds, summary) {
  const failedTypes = [];

  Object.keys(thresholds).forEach(key => {
    const coverage = summary[key].pct;
    if (coverage < thresholds[key]) {
      failedTypes.push(key);
    }
  });

  return failedTypes;
}

function CoverageIstanbulReporter(baseReporterDecorator, logger, config) {
  baseReporterDecorator(this);

  const log = logger.create('reporter.coverage-istanbul');

  const browserCoverage = new WeakMap();

  this.onBrowserComplete = function (browser, result) {
    if (result && result.coverage) {
      browserCoverage.set(browser, result.coverage);
    }
  };

  const baseReporterOnRunComplete = this.onRunComplete;
  this.onRunComplete = function (browsers, results) {
    baseReporterOnRunComplete.apply(this, arguments);

    browsers.forEach(browser => {
      const coverageIstanbulReporter = Object.assign({}, config.coverageIstanbulReporter);
      if (coverageIstanbulReporter.dir) {
        coverageIstanbulReporter.dir = coverageIstanbulReporter.dir.replace(BROWSER_PLACEHOLDER, browser.name);
      }
      const reportConfig = istanbul.config.loadObject({
        reporting: coverageIstanbulReporter
      });
      const reportTypes = reportConfig.reporting.config.reports;

      const coverage = browserCoverage.get(browser);
      browserCoverage.delete(browser);

      if (!coverage) {
        return;
      }

      const reporter = istanbul.createReporter(reportConfig);
      reporter.addAll(reportTypes);

      const coverageMap = istanbul.libCoverage.createCoverageMap();
      const sourceMapStore = istanbul.libSourceMaps.createSourceMapStore();

      Object.keys(coverage).forEach(filename => {
        const fileCoverage = coverage[filename];
        if (fileCoverage.inputSourceMap && coverageIstanbulReporter.fixWebpackSourcePaths) {
          fileCoverage.inputSourceMap = util.fixWebpackSourcePaths(fileCoverage.inputSourceMap);
        }
        if (
          coverageIstanbulReporter.skipFilesWithNoCoverage &&
          Object.keys(fileCoverage.statementMap).length === 0 &&
          Object.keys(fileCoverage.fnMap).length === 0 &&
          Object.keys(fileCoverage.branchMap).length === 0
        ) {
          log.debug(`File [${filename}] ignored, nothing could be mapped`);
        } else {
          coverageMap.addFileCoverage(fileCoverage);
        }
      });

      const remappedCoverageMap = sourceMapStore.transformCoverage(coverageMap).map;

      log.debug('Writing coverage reports:', reportTypes);

      reporter.write(remappedCoverageMap);

      const thresholds = {
        emitWarning: false,
        global: {
          statements: 0,
          lines: 0,
          branches: 0,
          functions: 0
        },
        each: {
          statements: 0,
          lines: 0,
          branches: 0,
          functions: 0,
          overrides: {}
        }
      };

      const userThresholds = coverageIstanbulReporter.thresholds;

      if (userThresholds) {
        if (userThresholds.global || userThresholds.each) {
          Object.assign(thresholds.global, userThresholds.global);
          Object.assign(thresholds.each, userThresholds.each);
          if (userThresholds.emitWarning === true) {
            thresholds.emitWarning = true;
          }
        } else {
          Object.assign(thresholds.global, userThresholds);
        }
      }

      function logThresholdMessage(message) {
        if (thresholds.emitWarning) {
          log.warn(message);
        } else {
          log.error(message);
        }
      }

      let thresholdCheckFailed = false;

      // Adapted from https://github.com/istanbuljs/nyc/blob/98ebdff573be91e1098bb7259776a9082a5c1ce1/index.js#L463-L478
      const globalSummary = remappedCoverageMap.getCoverageSummary();
      const failedGlobalTypes = checkThresholds(thresholds.global, globalSummary);
      failedGlobalTypes.forEach(type => {
        thresholdCheckFailed = true;
        logThresholdMessage(`Coverage for ${type} (${globalSummary[type].pct}%) does not meet global threshold (${thresholds.global[type]}%)`);
      });

      remappedCoverageMap.files().forEach(file => {
        const fileThresholds = Object.assign({}, thresholds.each, util.overrideThresholds(file, thresholds.each.overrides, config.basePath));
        delete fileThresholds.overrides;
        const fileSummary = remappedCoverageMap.fileCoverageFor(file).toSummary().data;
        const failedFileTypes = checkThresholds(fileThresholds, fileSummary);

        failedFileTypes.forEach(type => {
          thresholdCheckFailed = true;
          if (coverageIstanbulReporter.fixWebpackSourcePaths) {
            file = util.fixWebpackFilePath(file);
          }
          logThresholdMessage(`Coverage for ${type} (${fileSummary[type].pct}%) in file ${file} does not meet per file threshold (${fileThresholds[type]}%)`);
        });
      });

      if (thresholdCheckFailed && results && !thresholds.emitWarning) {
        results.exitCode = 1;
      }
    });
  };
}

CoverageIstanbulReporter.$inject = ['baseReporterDecorator', 'logger', 'config'];

module.exports = {
  'reporter:coverage-istanbul': ['type', CoverageIstanbulReporter]
};
