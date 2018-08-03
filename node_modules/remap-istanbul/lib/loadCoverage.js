(function (define) {
	define(['module', 'exports', '../utils/node!istanbul', 'fs'], function (module, exports, _nodeIstanbul, _fs) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = loadCoverage;

		var _fs2 = _interopRequireDefault(_fs);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		/**
   * Takes sources of coverage information and adds them to a collector which then can be subsequently
   * remapped.
   * @param  {Array|string}           sources  The source(s) of the JSON coverage information
   * @param  {Object}                 options? A hash of options that can be set:
   *                                               readJSON?: A function that can read and parse a JSON file
   *                                               warn?: A function that logs warning messages
   * @return {Object}                          The loaded coverage object
   */
		function loadCoverage(sources) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var warn = options.warn || console.warn;

			var readJSON = options.readJSON || function (filePath) {
				if (!_fs2.default.existsSync(filePath)) {
					warn(new Error('Cannot find file: "' + filePath + '"'));
					return {};
				}
				return JSON.parse(_fs2.default.readFileSync(filePath));
			};

			if (typeof sources === 'string') {
				sources = [sources];
			}
			if (!sources.length) {
				warn(new SyntaxError('No coverage files supplied!'));
			}
			var collector = new _nodeIstanbul.Collector();
			sources.forEach(function (filePath) {
				collector.add(readJSON(filePath));
			});

			return collector.getFinalCoverage();
		};
		module.exports = exports['default'];
	});
})(typeof define !== 'function' ? require('amdefine')(module) : define);
//# sourceMappingURL=loadCoverage.js.map