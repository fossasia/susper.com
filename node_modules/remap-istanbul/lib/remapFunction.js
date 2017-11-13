(function (define) {
	define(["module", "exports"], function (module, exports) {
		"use strict";

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = remapFunction;
		function remapFunction(genItem, getMapping) {
			var mapping = getMapping(genItem.loc);

			if (!mapping) {
				return null;
			}

			var srcItem = {
				name: genItem.name,
				line: mapping.loc.start.line,
				loc: mapping.loc
			};

			if (genItem.skip) {
				srcItem.skip = genItem.skip;
			}

			return { srcItem: srcItem, source: mapping.source };
		}
		module.exports = exports["default"];
	});
})(typeof define !== 'function' ? require('amdefine')(module) : define);
//# sourceMappingURL=remapFunction.js.map