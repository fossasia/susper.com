"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignoreDep typescript
const path = require("path");
const ts = require("typescript");
const ast_helpers_1 = require("./ast_helpers");
const interfaces_1 = require("./interfaces");
const make_transform_1 = require("./make_transform");
function exportLazyModuleMap(shouldTransform, lazyRoutesCb) {
    const standardTransform = function (sourceFile) {
        const ops = [];
        const lazyRoutes = lazyRoutesCb();
        if (!shouldTransform(sourceFile.fileName)) {
            return ops;
        }
        const dirName = path.normalize(path.dirname(sourceFile.fileName));
        const modules = Object.keys(lazyRoutes)
            .map((loadChildrenString) => {
            const [, moduleName] = loadChildrenString.split('#');
            const modulePath = lazyRoutes[loadChildrenString];
            return {
                modulePath,
                moduleName,
                loadChildrenString
            };
        });
        modules.forEach((module, index) => {
            const relativePath = path.relative(dirName, module.modulePath).replace(/\\/g, '/');
            // Create the new namespace import node.
            const namespaceImport = ts.createNamespaceImport(ts.createIdentifier(`__lazy_${index}__`));
            const importClause = ts.createImportClause(undefined, namespaceImport);
            const newImport = ts.createImportDeclaration(undefined, undefined, importClause, ts.createLiteral(relativePath));
            ops.push(new interfaces_1.AddNodeOperation(sourceFile, ast_helpers_1.getFirstNode(sourceFile), newImport));
        });
        const lazyModuleObjectLiteral = ts.createObjectLiteral(modules.map((mod, idx) => {
            let [modulePath, moduleName] = mod.loadChildrenString.split('#');
            if (modulePath.match(/\.ngfactory/)) {
                modulePath = modulePath.replace('.ngfactory', '');
                moduleName = moduleName.replace('NgFactory', '');
            }
            return ts.createPropertyAssignment(ts.createLiteral(`${modulePath}#${moduleName}`), ts.createPropertyAccess(ts.createIdentifier(`__lazy_${idx}__`), mod.moduleName));
        }));
        const lazyModuleVariableStmt = ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ExportKeyword)], [ts.createVariableDeclaration('LAZY_MODULE_MAP', undefined, lazyModuleObjectLiteral)]);
        ops.push(new interfaces_1.AddNodeOperation(sourceFile, ast_helpers_1.getLastNode(sourceFile), undefined, lazyModuleVariableStmt));
        return ops;
    };
    return make_transform_1.makeTransform(standardTransform);
}
exports.exportLazyModuleMap = exportLazyModuleMap;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/transformers/export_lazy_module_map.js.map