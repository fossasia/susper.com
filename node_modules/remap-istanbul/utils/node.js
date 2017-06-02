/* jshint node:true */
/* global define:true */
/*jshint -W079 */
if (typeof define !== 'function') { /* istanbul ignore next */ var define = require('amdefine')(module); }
define(['require', 'exports'], function (amdRequire, exports) {
	var global = (function () {
		return this;
	})();
	var nodeRequire = global.require && global.require.nodeRequire || require;
	var module = nodeRequire('module');
	function load(id, contextRequire, fn) {
		if ((id.indexOf('/') > -1) && module._findPath && module._nodeModulePaths) {
			var localModulePath = module._findPath(id, module._nodeModulePaths(contextRequire.toUrl('.')));
			if (localModulePath !== false) {
				id = localModulePath;
			}
		}
		var oldDefine = global.define;
		var result;
		global.define = undefined;
		try {
			result = nodeRequire(id);
		}
		finally {
			global.define = oldDefine;
		}
		fn(result);
	}
	exports.load = load;
	function normalize(id, fn) {
		if (id.charAt(0) === '.') {
			id = amdRequire.toUrl(fn('./' + id));
		}
		return id;
	}
	exports.normalize = normalize;
});
