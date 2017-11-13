(function (define) {
	define(['module', 'exports', './loadCoverage', './remap', './writeReport', '../utils/node!istanbul/lib/store/memory'], function (module, exports, _loadCoverage, _remap, _writeReport, _memory) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = gruntPlugin;

		var _loadCoverage2 = _interopRequireDefault(_loadCoverage);

		var _remap2 = _interopRequireDefault(_remap);

		var _writeReport2 = _interopRequireDefault(_writeReport);

		var _memory2 = _interopRequireDefault(_memory);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		/* jshint node: true */
		/* global Promise */

		function gruntPlugin(grunt) {
			grunt.registerMultiTask('remapIstanbul', function () {
				var done = this.async();
				var options = this.options();
				var sources = new _memory2.default();
				var p = [];

				function warn(message) {
					if (options.fail) {
						grunt.fail.warn(message);
					} else {
						grunt.log.error(message);
					}
				}

				this.files.forEach(function (file) {
					var coverage = (0, _remap2.default)((0, _loadCoverage2.default)(file.src, {
						readJSON: grunt.readJSON,
						warn: warn
					}), {
						readFile: grunt.readFile,
						readJSON: grunt.readJSON,
						warn: warn,
						sources: sources,
						basePath: file.basePath,
						useAbsolutePaths: options.useAbsolutePaths,
						exclude: options.exclude
					});

					if (!Object.keys(sources.map).length) {
						sources = undefined;
					}

					if (file.type && file.dest) {
						p.push((0, _writeReport2.default)(coverage, file.type, {}, file.dest, sources));
					} else {
						p = p.concat(Object.keys(options.reports).map(function (key) {
							return (0, _writeReport2.default)(coverage, key, options.reportOpts || {}, options.reports[key], sources);
						}));
					}
				});

				Promise.all(p).then(function () {
					done();
				}, grunt.fail.fatal);
			});
		};
		module.exports = exports['default'];
	});
})(typeof define !== 'function' ? require('amdefine')(module) : define);
//# sourceMappingURL=gruntRemapIstanbul.js.map