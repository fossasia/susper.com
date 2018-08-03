"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolve = require('resolve');
// resolve dependencies within the target project
function resolveProjectModule(root, moduleName) {
    return resolve.sync(moduleName, { basedir: root });
}
exports.resolveProjectModule = resolveProjectModule;
// require dependencies within the target project
function requireProjectModule(root, moduleName) {
    return require(resolveProjectModule(root, moduleName));
}
exports.requireProjectModule = requireProjectModule;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/utilities/require-project-module.js.map