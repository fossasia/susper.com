(function (define) {
	define(['module', 'exports', '../utils/node!source-map'], function (module, exports, _nodeSourceMap) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = getMapping;


		/**
   * A function that determines the original position for a given location
   * @param  {SourceMapConsumer} sourceMap        The source map
   * @param  {Object}            location         The original location Object
   * @return {Object}                             The remapped location Object
   */
		function getMapping(sourceMap, location) {
			/* istanbul ignore if: edge case too hard to test for with babel malformation */
			if (location.start.line < 1 || location.start.column < 0) {
				return null;
			}
			/* istanbul ignore if: edge case too hard to test for with babel malformation */
			if (location.end.line < 1 || location.end.column < 0) {
				return null;
			}

			var start = sourceMap.originalPositionFor(location.start);
			var end = sourceMap.originalPositionFor(location.end);

			/* istanbul ignore if: edge case too hard to test for */
			if (!start || !end) {
				return null;
			}
			if (!start.source || !end.source || start.source !== end.source) {
				return null;
			}
			/* istanbul ignore if: edge case too hard to test for */
			if (start.line === null || start.column === null) {
				return null;
			}
			/* istanbul ignore if: edge case too hard to test for */
			if (end.line === null || end.column === null) {
				return null;
			}

			if (start.line === end.line && start.column === end.column) {
				end = sourceMap.originalPositionFor({
					line: location.end.line,
					column: location.end.column,
					bias: _nodeSourceMap.SourceMapConsumer.LEAST_UPPER_BOUND
				});
				end.column -= 1;
			}

			return {
				source: start.source,
				loc: {
					start: {
						line: start.line,
						column: start.column
					},
					end: {
						line: end.line,
						column: end.column
					},
					skip: location.skip
				}
			};
		}
		module.exports = exports['default'];
	});
})(typeof define !== 'function' ? require('amdefine')(module) : define);
//# sourceMappingURL=getMapping.js.map