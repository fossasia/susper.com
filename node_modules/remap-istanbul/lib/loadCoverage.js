/* jshint node: true */
/*jshint -W079 */
if (typeof define !== 'function') { /* istanbul ignore next */ var define = require('amdefine')(module); }
define([
	'require',
	'exports',
	'./node!istanbul/lib/collector',
	'./node!fs'
], function (require, exports, Collector, fs) {

	/**
	 * Takes sources of coverage information and adds them to a collector which then can be subsequently
	 * remapped.
	 * @param  {Array|string}           sources  The source(s) of the JSON coverage information
	 * @param  {Object}                 options? A hash of options that can be set:
	 *                                               readJSON?: A function that can read and parse a JSON file
	 *                                               warn?: A function that logs warning messages
	 * @return {Object}                          The loaded coverage object
	 */
	return function loadCoverage(sources, options) {
		options = options || {};

		var warn = options.warn || console.warn;

		var readJSON = options.readJSON || function readJSON(filePath) {
			if (!fs.existsSync(filePath)) {
				warn(new Error('Cannot find file: "' + filePath + '"'));
				return {};
			}
			return JSON.parse(fs.readFileSync(filePath));
		};

		if (typeof sources === 'string') {
			sources = [ sources ];
		}
		if (!sources.length) {
			warn(new SyntaxError('No coverage files supplied!'));
		}
		var collector = new Collector();
		sources.forEach(function (filePath) {
			collector.add(readJSON(filePath));
		});

		return collector.getFinalCoverage();
	};
});
