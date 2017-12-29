"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// @ignoreDep typescript
const semver_1 = require("semver");
// Test if typescript is available. This is a hack. We should be using peerDependencies instead
// but can't until we split global and local packages.
// See https://github.com/angular/angular-cli/issues/8107#issuecomment-338185872
try {
    const version = require('typescript').version;
    if (!semver_1.gte(version, '2.0.2')) {
        throw new Error();
    }
}
catch (e) {
    throw new Error('Could not find local "typescript" package.'
        + 'The "@ngtools/webpack" package requires a local "typescript@^2.0.2" package to be installed.'
        + e);
}
__export(require("./plugin"));
__export(require("./angular_compiler_plugin"));
__export(require("./extract_i18n_plugin"));
var loader_1 = require("./loader");
exports.default = loader_1.ngcLoader;
var paths_plugin_1 = require("./paths-plugin");
exports.PathsPlugin = paths_plugin_1.PathsPlugin;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/index.js.map