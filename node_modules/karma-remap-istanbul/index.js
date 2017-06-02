'use strict';

const istanbul = require('istanbul');
const remap = require('remap-istanbul/lib/remap');
const writeReport = require('remap-istanbul/lib/writeReport');

function KarmaRemapIstanbul(baseReporterDecorator, logger, config) {
  baseReporterDecorator(this);

  const log = logger.create('reporter.remap-istanbul');

  const remapIstanbulReporterConfig = config.remapIstanbulReporter || {};
  const reports = remapIstanbulReporterConfig.reports || {};
  const remapOptions = remapIstanbulReporterConfig.remapOptions || {};
  const reportOptions = remapIstanbulReporterConfig.reportOptions || {};

  const coverageMap = new WeakMap();

  const baseReporterOnRunStart = this.onRunStart;
  this.onRunStart = function () {
    baseReporterOnRunStart.apply(this, arguments);
  };

  this.onBrowserComplete = function (browser, result) {
    if (!result || !result.coverage) {
      return;
    }

    coverageMap.set(browser, result.coverage);
  };

  let reportFinished = () => {};

  const baseReporterOnRunComplete = this.onRunComplete;
  this.onRunComplete = function (browsers) {
    baseReporterOnRunComplete.apply(this, arguments);

    // Collect the unmapped coverage information for all browsers in this run
    const unmappedCoverage = (() => {
      const collector = new istanbul.Collector();

      browsers.forEach(browser => {
        const coverage = coverageMap.get(browser);
        coverageMap.delete(browser);

        if (!coverage) {
          return;
        }

        collector.add(coverage);
      });

      return collector.getFinalCoverage();
    })();

    let sourceStore = istanbul.Store.create('memory');

    const collector = remap(unmappedCoverage, Object.assign({
      sources: sourceStore
    }, remapOptions));

    if (Object.keys(sourceStore.map).length === 0) {
      sourceStore = undefined;
    }

    Promise.all(Object.keys(reports).map(reportType => {
      const destination = reports[reportType];

      log.debug('Writing coverage to %s', destination);

      return writeReport(collector, reportType, reportOptions, destination, sourceStore);
    })).catch(err => {
      log.error(err);
    }).then(() => {
      collector.dispose();

      reportFinished();

      // Reassign `onExit` to just call `done` since all reports have been written
      this.onExit = function (done) {
        done();
      };
    });
  };

  this.onExit = function (done) {
    // Reports have not been written, so assign `done` to `reportFinished`
    reportFinished = done;
  };
}

KarmaRemapIstanbul.$inject = ['baseReporterDecorator', 'logger', 'config'];

module.exports = {
  'reporter:karma-remap-istanbul': ['type', KarmaRemapIstanbul]
};
