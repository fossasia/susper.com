/* jshint node:true */
/* global Promise */
import _loadCoverage from './loadCoverage';
import _remap from './remap';
import _writeReport from './writeReport';
import MemoryStore from '../utils/node!istanbul/lib/store/memory';

export const loadCoverage = _loadCoverage;
export const remap = _remap;
export const writeReport = _writeReport;

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
export default function (sources, reports, reportOptions) {
	let sourceStore = new MemoryStore();
	const collector = _remap(_loadCoverage(sources), {
		sources: sourceStore,
	});

	if (!Object.keys(sourceStore.map).length) {
		sourceStore = undefined;
	}


	return Promise.all(
		Object.keys(reports)
			.map(reportType =>
				_writeReport(collector, reportType, reportOptions || {}, reports[reportType], sourceStore)
			)
	);
};
