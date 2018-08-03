(function (define) {
	define(['module', 'exports', './remap', './writeReport', './checkThreshold', '../utils/node!istanbul/lib/store/memory', '../utils/node!gulp-util', '../utils/node!through2'], function (module, exports, _remap, _writeReport, _checkThreshold, _memory, _nodeGulpUtil, _nodeThrough) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = gulpPlugin;

		var _remap2 = _interopRequireDefault(_remap);

		var _writeReport2 = _interopRequireDefault(_writeReport);

		var _checkThreshold2 = _interopRequireDefault(_checkThreshold);

		var _memory2 = _interopRequireDefault(_memory);

		var _nodeThrough2 = _interopRequireDefault(_nodeThrough);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		/* global Promise */

		/* jshint node: true */
		/* jshint -W079 */
		function gulpPlugin() {
			var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			return _nodeThrough2.default.obj(function (file, enc, cb) {
				if (!opts.warn) {
					opts.warn = function (message) {
						if (opts.fail) {
							cb(new _nodeGulpUtil.PluginError('remap-istanbul', message));
						} else {
							console.error(message);
						}
					};
				}

				opts.sources = new _memory2.default();

				if (file.isNull()) {
					cb(null, file);
				}

				if (file.isStream()) {
					cb(new _nodeGulpUtil.PluginError('remap-istanbul', 'Streaming not supported'));
				}

				var collector = (0, _remap2.default)(JSON.parse(file.contents.toString('utf8')), opts);

				var thresholdCheckFailed = false;
				if (opts.check) {
					thresholdCheckFailed = (0, _checkThreshold2.default)(opts.check, collector);
				}

				var sources = void 0;
				if (Object.keys(opts.sources.map).length) {
					sources = opts.sources;
				}

				var p = [];
				if (opts.reports) {
					Object.keys(opts.reports).forEach(function (key) {
						p.push((0, _writeReport2.default)(collector, key, opts.reportOpts || {}, opts.reports[key], sources));
					});
				}

				file.contents = new Buffer(JSON.stringify(collector.getFinalCoverage()));

				Promise.all(p).then(function () {
					if (thresholdCheckFailed) {
						return cb(new _nodeGulpUtil.PluginError('remap-istanbul', 'Coverage threshold not met'));
					} else {
						cb(null, file);
					}
				});
			});
		};
		module.exports = exports['default'];
	});
})(typeof define !== 'function' ? require('amdefine')(module) : define);
//# sourceMappingURL=gulpRemapIstanbul.js.map