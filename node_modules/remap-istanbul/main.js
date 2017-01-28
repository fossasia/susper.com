/* jshint node:true */
/* global Promise */
var loadCoverage = require('./lib/loadCoverage');
var remap = require('./lib/remap');
var writeReport = require('./lib/writeReport');
var MemoryStore = require('istanbul/lib/store/memory');

/**
 * The basic API for utilising remap-istanbul
 * @param  {Array|string} sources The sources that could be consumed and remapped.
 *                                For muliple sources to be combined together, provide
 *                                an array of strings.
 * @param  {Object} reports An object where each key is the report type required and the value
 *                          is the destination for the report.
 * @param  {Object} reportOptions? An object containing the report options.
 * @return {Promise}         A promise that will resolve when all the reports are written.
 */
module.exports = function (sources, reports, reportOptions) {
	var sourceStore = new MemoryStore();
	var collector = remap(loadCoverage(sources), {
		sources: sourceStore
	});

	if (!Object.keys(sourceStore.map).length) {
		sourceStore = undefined;
	}

	var p = Object.keys(reports).map(function (reportType) {
		return writeReport(collector, reportType, reportOptions || {}, reports[reportType], sourceStore);
	});
	return Promise.all(p);
};
module.exports.loadCoverage = loadCoverage;
module.exports.remap = remap;
module.exports.writeReport = writeReport;
