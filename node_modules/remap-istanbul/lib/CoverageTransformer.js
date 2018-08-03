(function (define) {
	define(['module', 'exports', '../utils/node!istanbul', '../utils/node!path', '../utils/node!fs', '../utils/node!source-map', './SparceCoverageCollector', './getMapping', './remapFunction', './remapBranch'], function (module, exports, _nodeIstanbul, _nodePath, _nodeFs, _nodeSourceMap, _SparceCoverageCollector, _getMapping, _remapFunction, _remapBranch) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});

		var _nodePath2 = _interopRequireDefault(_nodePath);

		var _nodeFs2 = _interopRequireDefault(_nodeFs);

		var _SparceCoverageCollector2 = _interopRequireDefault(_SparceCoverageCollector);

		var _getMapping2 = _interopRequireDefault(_getMapping);

		var _remapFunction2 = _interopRequireDefault(_remapFunction);

		var _remapBranch2 = _interopRequireDefault(_remapBranch);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		function _defineProperty(obj, key, value) {
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true
				});
			} else {
				obj[key] = value;
			}

			return obj;
		}

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

		var sourceMapRegEx = /(?:\/{2}[#@]{1,2}|\/\*)\s+sourceMappingURL\s*=\s*(data:(?:[^;]+;)+base64,)?(\S+)(?:\n\s*)?$/;

		var CoverageTransformer = function () {
			function CoverageTransformer(options) {
				_classCallCheck(this, CoverageTransformer);

				this.basePath = options.basePath;
				this.warn = options.warn || console.warn;

				this.exclude = function () {
					return false;
				};
				if (options.exclude) {
					if (typeof options.exclude === 'function') {
						this.exclude = options.exclude;
					} else if (typeof options.exclude === 'string') {
						this.exclude = function (fileName) {
							return fileName.indexOf(options.exclude) > -1;
						};
					} else {
						this.exclude = function (fileName) {
							return fileName.match(options.exclude);
						};
					}
				}

				this.mapFileName = options.mapFileName || function (fileName) {
					return fileName;
				};

				this.useAbsolutePaths = !!options.useAbsolutePaths;

				this.readJSON = options.readJSON || function readJSON(filePath) {
					if (!_nodeFs2.default.existsSync(filePath)) {
						this.warn(Error('Could not find file: "' + filePath + '"'));
						return null;
					}
					return JSON.parse(_nodeFs2.default.readFileSync(filePath));
				};

				this.readFile = options.readFile || function readFile(filePath) {
					if (!_nodeFs2.default.existsSync(filePath)) {
						this.warn(new Error('Could not find file: "' + filePath + '"'));
						return '';
					}
					return _nodeFs2.default.readFileSync(filePath);
				};

				this.sourceStore = options.sources;

				this.sparceCoverageCollector = new _SparceCoverageCollector2.default();
			}

			_createClass(CoverageTransformer, [{
				key: 'addFileCoverage',
				value: function addFileCoverage(filePath, fileCoverage) {
					var _this = this;

					if (this.exclude(filePath)) {
						this.warn('Excluding: "' + filePath + '"');
						return;
					}

					var rawSourceMap = void 0;
					var sourceMapDir = _nodePath2.default.dirname(filePath);
					var codeIsArray = true;
					if (fileCoverage.inputSourceMap) {
						rawSourceMap = fileCoverage.inputSourceMap;
					} else {
						/* coverage.json can sometimes include the code inline */
						var codeFromFile = false;
						var jsText = fileCoverage.code;
						if (!jsText) {
							jsText = this.readFile(filePath);
							codeFromFile = true;
						}
						if (Array.isArray(jsText)) {
							/* sometimes the source is an array */
							jsText = jsText.join('\n');
						} else {
							codeIsArray = false;
						}
						var match = sourceMapRegEx.exec(jsText);

						if (!match && !codeFromFile) {
							codeIsArray = false;
							jsText = this.readFile(filePath);
							match = sourceMapRegEx.exec(jsText);
						}

						if (match) {
							if (match[1]) {
								rawSourceMap = JSON.parse(new Buffer(match[2], 'base64').toString('utf8'));
							} else {
								var sourceMapPath = _nodePath2.default.join(sourceMapDir, match[2]);
								rawSourceMap = this.readJSON(sourceMapPath);
								sourceMapDir = _nodePath2.default.dirname(sourceMapPath);
							}
						}
					}

					if (!rawSourceMap) {
						/* We couldn't find a source map, so will copy coverage after warning. */
						this.warn(new Error('Could not find source map for: "' + filePath + '"'));
						try {
							fileCoverage.code = String(_nodeFs2.default.readFileSync(filePath)).split('\n');
						} catch (error) {
							this.warn(new Error('Could find source for : "' + filePath + '"'));
						}
						this.sparceCoverageCollector.setCoverage(filePath, fileCoverage);
						return;
					}

					sourceMapDir = this.basePath || sourceMapDir;

					// Clean up source map paths:
					// * prepend sourceRoot if it is set
					// * replace relative paths in source maps with absolute
					rawSourceMap.sources = rawSourceMap.sources.map(function (srcPath) {
						var tempVal = srcPath;
						if (rawSourceMap.sourceRoot) {
							tempVal = /\/$/g.test(rawSourceMap.sourceRoot) ? rawSourceMap.sourceRoot + srcPath : srcPath;
						}
						return tempVal.substr(0, 1) === '.' ? _nodePath2.default.resolve(sourceMapDir, tempVal) : tempVal;
					});

					var sourceMap = new _nodeSourceMap.SourceMapConsumer(rawSourceMap);

					/* if there are inline sources and a store to put them into, we will populate it */
					var inlineSourceMap = {};
					var origSourceFilename = void 0;
					var origFileName = void 0;
					var fileName = void 0;

					if (sourceMap.sourcesContent) {
						origSourceFilename = rawSourceMap.sources[0];

						if (origSourceFilename && _nodePath2.default.extname(origSourceFilename) !== '' && rawSourceMap.sources.length === 1) {
							origFileName = rawSourceMap.file;
							fileName = filePath.replace(_nodePath2.default.extname(origFileName), _nodePath2.default.extname(origSourceFilename));
							rawSourceMap.file = fileName;
							rawSourceMap.sources = [fileName];
							rawSourceMap.sourceRoot = '';
							sourceMap = new _nodeSourceMap.SourceMapConsumer(rawSourceMap);
						}

						sourceMap.sourcesContent.forEach(function (source, idx) {
							inlineSourceMap[sourceMap.sources[idx]] = true;
							_this.sparceCoverageCollector.setSourceCode(sourceMap.sources[idx], codeIsArray ? source.split('\n') : source);
							if (_this.sourceStore) {
								_this.sourceStore.set(sourceMap.sources[idx], source);
							}
						});
					}

					var resolvePath = function resolvePath(source) {
						var resolvedSource = source in inlineSourceMap ? source : _nodePath2.default.resolve(sourceMapDir, source);

						if (!_this.useAbsolutePaths && !(source in inlineSourceMap)) {
							resolvedSource = _nodePath2.default.relative(process.cwd(), resolvedSource);
						}
						return resolvedSource;
					};

					var getMappingResolved = function getMappingResolved(location) {
						var mapping = (0, _getMapping2.default)(sourceMap, location);
						if (!mapping) return null;

						return Object.assign(mapping, { source: resolvePath(mapping.source) });
					};

					Object.keys(fileCoverage.branchMap).forEach(function (index) {
						var genItem = fileCoverage.branchMap[index];
						var hits = fileCoverage.b[index];

						var info = (0, _remapBranch2.default)(genItem, getMappingResolved);

						if (info) {
							_this.sparceCoverageCollector.updateBranch(info.source, info.srcItem, hits);
						}
					});

					Object.keys(fileCoverage.fnMap).forEach(function (index) {
						var genItem = fileCoverage.fnMap[index];
						var hits = fileCoverage.f[index];

						var info = (0, _remapFunction2.default)(genItem, getMappingResolved);

						if (info) {
							_this.sparceCoverageCollector.updateFunction(info.source, info.srcItem, hits);
						}
					});

					Object.keys(fileCoverage.statementMap).forEach(function (index) {
						var genItem = fileCoverage.statementMap[index];
						var hits = fileCoverage.s[index];

						var mapping = getMappingResolved(genItem);

						if (mapping) {
							_this.sparceCoverageCollector.updateStatement(mapping.source, mapping.loc, hits);
						}
					});

					// todo: refactor exposing implementation details
					var srcCoverage = this.sparceCoverageCollector.getFinalCoverage();

					if (sourceMap.sourcesContent && this.basePath) {
						// Convert path to use base path option
						var getPath = function getPath(filePath) {
							var absolutePath = _nodePath2.default.resolve(_this.basePath, filePath);
							if (!_this.useAbsolutePaths) {
								return _nodePath2.default.relative(process.cwd(), absolutePath);
							}
							return absolutePath;
						};
						var fullSourceMapPath = getPath(origFileName.replace(_nodePath2.default.extname(origFileName), _nodePath2.default.extname(origSourceFilename)));
						srcCoverage[fullSourceMapPath] = srcCoverage[fileName];
						srcCoverage[fullSourceMapPath].path = fullSourceMapPath;
						delete srcCoverage[fileName];
					}
				}
			}, {
				key: 'addCoverage',
				value: function addCoverage(item) {
					var _this2 = this;

					Object.keys(item).forEach(function (filePath) {
						var fileCoverage = item[filePath];
						_this2.addFileCoverage(filePath, fileCoverage);
					});
				}
			}, {
				key: 'getFinalCoverage',
				value: function getFinalCoverage() {
					var _this3 = this;

					var collector = new _nodeIstanbul.Collector();

					var srcCoverage = this.sparceCoverageCollector.getFinalCoverage();

					Object.keys(srcCoverage).filter(function (filePath) {
						return !_this3.exclude(filePath);
					}).forEach(function (filename) {
						var coverage = Object.assign({}, srcCoverage[filename]);
						coverage.path = _this3.mapFileName(filename);
						if (_this3.sourceStore && coverage.path !== filename) {
							var source = _this3.sourceStore.get(filename);
							_this3.sourceStore.set(coverage.path, source);
						}
						collector.add(_defineProperty({}, coverage.path, coverage));
					});

					/* refreshes the line counts for reports */
					collector.getFinalCoverage();

					return collector;
				}
			}]);

			return CoverageTransformer;
		}();

		exports.default = CoverageTransformer;
		module.exports = exports['default'];
	});
})(typeof define !== 'function' ? require('amdefine')(module) : define);
//# sourceMappingURL=CoverageTransformer.js.map