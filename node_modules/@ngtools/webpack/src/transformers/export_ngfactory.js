"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignoreDep typescript
const ts = require("typescript");
const path_1 = require("path");
const ast_helpers_1 = require("./ast_helpers");
const interfaces_1 = require("./interfaces");
const make_transform_1 = require("./make_transform");
function exportNgFactory(shouldTransform, getEntryModule) {
    const standardTransform = function (sourceFile) {
        const ops = [];
        const entryModule = getEntryModule();
        if (!shouldTransform(sourceFile.fileName) || !entryModule) {
            return ops;
        }
        // Find all identifiers using the entry module class name.
        const entryModuleIdentifiers = ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.Identifier)
            .filter(identifier => identifier.text === entryModule.className);
        if (entryModuleIdentifiers.length === 0) {
            return [];
        }
        const relativeEntryModulePath = path_1.relative(path_1.dirname(sourceFile.fileName), entryModule.path);
        const normalizedEntryModulePath = `./${relativeEntryModulePath}`.replace(/\\/g, '/');
        // Get the module path from the import.
        let modulePath;
        entryModuleIdentifiers.forEach((entryModuleIdentifier) => {
            if (entryModuleIdentifier.parent.kind !== ts.SyntaxKind.ExportSpecifier) {
                return;
            }
            const exportSpec = entryModuleIdentifier.parent;
            const moduleSpecifier = exportSpec.parent.parent.moduleSpecifier;
            if (moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
                return;
            }
            modulePath = moduleSpecifier.text;
            // Add the transform operations.
            const factoryClassName = entryModule.className + 'NgFactory';
            const factoryModulePath = normalizedEntryModulePath + '.ngfactory';
            const namedExports = ts.createNamedExports([ts.createExportSpecifier(undefined, ts.createIdentifier(factoryClassName))]);
            const newImport = ts.createExportDeclaration(undefined, undefined, namedExports, ts.createLiteral(factoryModulePath));
            ops.push(new interfaces_1.AddNodeOperation(sourceFile, ast_helpers_1.getFirstNode(sourceFile), newImport));
        });
        return ops;
    };
    return make_transform_1.makeTransform(standardTransform);
}
exports.exportNgFactory = exportNgFactory;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/transformers/export_ngfactory.js.map