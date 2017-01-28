"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require('reflect-metadata');
__export(require('./plugin'));
var loader_1 = require('./loader');
exports.default = loader_1.ngcLoader;
var paths_plugin_1 = require('./paths-plugin');
exports.PathsPlugin = paths_plugin_1.PathsPlugin;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@ngtools/webpack/src/index.js.map