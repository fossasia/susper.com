"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// In order to keep refactoring low, simply export from ast-tools.
// TODO: move all dependencies of this file to ast-tools directly.
var ast_tools_1 = require("../lib/ast-tools");
exports.bootstrapItem = ast_tools_1.bootstrapItem;
exports.insertImport = ast_tools_1.insertImport;
exports.addPathToRoutes = ast_tools_1.addPathToRoutes;
exports.addItemsToRouteProperties = ast_tools_1.addItemsToRouteProperties;
exports.confirmComponentExport = ast_tools_1.confirmComponentExport;
exports.resolveComponentPath = ast_tools_1.resolveComponentPath;
exports.applyChanges = ast_tools_1.applyChanges;
//# sourceMappingURL=/users/hans/sources/angular-cli/utilities/route-utils.js.map