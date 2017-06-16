"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// In order to keep refactoring low, simply export from ast-tools.
// TODO: move all dependencies of this file to ast-tools directly.
var ast_tools_1 = require("../lib/ast-tools");
exports.getSource = ast_tools_1.getSource;
exports.getSourceNodes = ast_tools_1.getSourceNodes;
exports.findNodes = ast_tools_1.findNodes;
exports.insertAfterLastOccurrence = ast_tools_1.insertAfterLastOccurrence;
exports.getContentOfKeyLiteral = ast_tools_1.getContentOfKeyLiteral;
exports.getDecoratorMetadata = ast_tools_1.getDecoratorMetadata;
exports.addDeclarationToModule = ast_tools_1.addDeclarationToModule;
exports.addProviderToModule = ast_tools_1.addProviderToModule;
exports.addImportToModule = ast_tools_1.addImportToModule;
exports.addExportToModule = ast_tools_1.addExportToModule;
//# sourceMappingURL=/users/hans/sources/angular-cli/utilities/ast-utils.js.map