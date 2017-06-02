(function (define) {
	define(['module', 'exports', '../../utils/node!istanbul/lib/collector', '../../utils/node!istanbul/lib/report/json'], function (module, exports, _collector, _json) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});

		var _collector2 = _interopRequireDefault(_collector);

		var _json2 = _interopRequireDefault(_json);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		function JsonCoverageReporter() {
			var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this._collector = new _collector2.default();
			this._reporter = new _json2.default({
				file: config.filename,
				watermarks: config.watermarks
			});
		}

		JsonCoverageReporter.prototype.coverage = function coverage(sessionId, coverageData) {
			this._collector.add(coverageData);
		};

		JsonCoverageReporter.prototype.runEnd = function runEnd() {
			this._reporter.writeReport(this._collector, true);
		};

		exports.default = JsonCoverageReporter;
		module.exports = exports['default'];
	});
})(typeof define !== 'function' ? require('amdefine')(module) : define);
//# sourceMappingURL=JsonCoverage.js.map