(function (define) {
	define(['module', 'exports', './loadCoverage', './remap', './writeReport', '../utils/node!istanbul/lib/store/memory'], function (module, exports, _loadCoverage2, _remap2, _writeReport2, _memory) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.writeReport = exports.remap = exports.loadCoverage = undefined;

		exports.default = function (sources, reports, reportOptions) {
			var sourceStore = new _memory2.default();
			var collector = (0, _remap3.default)((0, _loadCoverage3.default)(sources), {
				sources: sourceStore
			});

			if (!Object.keys(sourceStore.map).length) {
				sourceStore = undefined;
			}

			return Promise.all(Object.keys(reports).map(function (reportType) {
				return (0, _writeReport3.default)(collector, reportType, reportOptions || {}, reports[reportType], sourceStore);
			}));
		};

		var _loadCoverage3 = _interopRequireDefault(_loadCoverage2);

		var _remap3 = _interopRequireDefault(_remap2);

		var _writeReport3 = _interopRequireDefault(_writeReport2);

		var _memory2 = _interopRequireDefault(_memory);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		/* jshint node:true */
		/* global Promise */
		var loadCoverage = exports.loadCoverage = _loadCoverage3.default;
		var remap = exports.remap = _remap3.default;
		var writeReport = exports.writeReport = _writeReport3.default;

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
		;
		module.exports = exports['default'];
		module.exports.loadCoverage = exports['loadCoverage'];
		module.exports.remap = exports['remap'];
		module.exports.writeReport = exports['writeReport'];
	});
})(typeof define !== 'function' ? require('amdefine')(module) : define);
//# sourceMappingURL=main.js.map