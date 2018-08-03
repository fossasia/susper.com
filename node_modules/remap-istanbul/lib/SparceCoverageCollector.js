(function (define) {
	define(['module', 'exports'], function (module, exports) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});

		function _classCallCheck(instance, Constructor) {
			if (!(instance instanceof Constructor)) {
				throw new TypeError("Cannot call a class as a function");
			}
		}

		var _createClass = function () {
			function defineProperties(target, props) {
				for (var i = 0; i < props.length; i++) {
					var descriptor = props[i];
					descriptor.enumerable = descriptor.enumerable || false;
					descriptor.configurable = true;
					if ("value" in descriptor) descriptor.writable = true;
					Object.defineProperty(target, descriptor.key, descriptor);
				}
			}

			return function (Constructor, protoProps, staticProps) {
				if (protoProps) defineProperties(Constructor.prototype, protoProps);
				if (staticProps) defineProperties(Constructor, staticProps);
				return Constructor;
			};
		}();

		var SparceCoverageCollector = function () {
			function SparceCoverageCollector() {
				_classCallCheck(this, SparceCoverageCollector);

				this.srcCoverage = {};
				this.metaInfo = {};
			}

			_createClass(SparceCoverageCollector, [{
				key: 'getSourceCoverage',
				value: function getSourceCoverage(filename) {
					var data = this.srcCoverage[filename];
					if (!data) {
						data = this.srcCoverage[filename] = {
							path: filename,
							statementMap: {},
							fnMap: {},
							branchMap: {},
							s: {},
							b: {},
							f: {}
						};
						this.metaInfo[filename] = {
							indexes: {},
							lastIndex: {
								s: 0,
								b: 0,
								f: 0
							}
						};
					}

					return {
						data: data,
						meta: this.metaInfo[filename]
					};
				}
			}, {
				key: 'setCoverage',
				value: function setCoverage(filePath, fileCoverage) {
					this.srcCoverage[filePath] = fileCoverage;
				}
			}, {
				key: 'setSourceCode',
				value: function setSourceCode(filePath, source) {
					this.getSourceCoverage(filePath).data.code = source;
				}
			}, {
				key: 'getFinalCoverage',
				value: function getFinalCoverage() {
					return this.srcCoverage;
				}
			}, {
				key: 'updateBranch',
				value: function updateBranch(source, srcItem, hits) {
					var _getSourceCoverage = this.getSourceCoverage(source),
					    data = _getSourceCoverage.data,
					    meta = _getSourceCoverage.meta;

					var key = ['b'];
					srcItem.locations.map(function (loc) {
						return key.push(loc.start.line, loc.start.column, loc.end.line, loc.end.line);
					});

					key = key.join(':');

					var index = meta.indexes[key];
					if (!index) {
						meta.lastIndex.b += 1;
						index = meta.lastIndex.b;
						meta.indexes[key] = index;
						data.branchMap[index] = srcItem;
					}

					if (!data.b[index]) {
						data.b[index] = hits.map(function (v) {
							return v;
						});
					} else {
						for (var i = 0; i < hits.length; i += 1) {
							data.b[index][i] += hits[i];
						}
					}
				}
			}, {
				key: 'updateFunction',
				value: function updateFunction(source, srcItem, hits) {
					var _getSourceCoverage2 = this.getSourceCoverage(source),
					    data = _getSourceCoverage2.data,
					    meta = _getSourceCoverage2.meta;

					var key = ['f', srcItem.loc.start.line, srcItem.loc.start.column, srcItem.loc.end.line, srcItem.loc.end.column].join(':');

					var index = meta.indexes[key];
					if (!index) {
						meta.lastIndex.f += 1;
						index = meta.lastIndex.f;
						meta.indexes[key] = index;
						data.fnMap[index] = srcItem;
					}

					data.f[index] = data.f[index] || 0;
					data.f[index] += hits;
				}
			}, {
				key: 'updateStatement',
				value: function updateStatement(source, srcItem, hits) {
					var _getSourceCoverage3 = this.getSourceCoverage(source),
					    data = _getSourceCoverage3.data,
					    meta = _getSourceCoverage3.meta;

					var key = ['s', srcItem.start.line, srcItem.start.column, srcItem.end.line, srcItem.end.column].join(':');

					var index = meta.indexes[key];
					if (!index) {
						meta.lastIndex.s += 1;
						index = meta.lastIndex.s;
						meta.indexes[key] = index;
						data.statementMap[index] = srcItem;
					}

					data.s[index] = data.s[index] || 0;
					data.s[index] += hits;
				}
			}]);

			return SparceCoverageCollector;
		}();

		exports.default = SparceCoverageCollector;
		module.exports = exports['default'];
	});
})(typeof define !== 'function' ? require('amdefine')(module) : define);
//# sourceMappingURL=SparceCoverageCollector.js.map