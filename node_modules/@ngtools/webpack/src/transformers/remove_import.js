"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignoreDep typescript
const ts = require("typescript");
const ast_helpers_1 = require("./ast_helpers");
const interfaces_1 = require("./interfaces");
// Remove an import if we have removed all identifiers for it.
// Mainly workaround for https://github.com/Microsoft/TypeScript/issues/17552.
function removeImport(sourceFile, removedIdentifiers) {
    const ops = [];
    if (removedIdentifiers.length === 0) {
        return [];
    }
    const identifierText = removedIdentifiers[0].text;
    // Find all imports that import `identifierText`.
    const allImports = ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.ImportDeclaration);
    const identifierImports = allImports
        .filter((node) => {
        // TODO: try to support removing `import * as X from 'XYZ'`.
        // Filter out import statements that are either `import 'XYZ'` or `import * as X from 'XYZ'`.
        const clause = node.importClause;
        if (!clause || clause.name || !clause.namedBindings) {
            return false;
        }
        return clause.namedBindings.kind == ts.SyntaxKind.NamedImports;
    })
        .filter((node) => {
        // Filter out imports that that don't have `identifierText`.
        const namedImports = node.importClause.namedBindings;
        return namedImports.elements.some((element) => {
            return element.name.text == identifierText;
        });
    });
    // Find all identifiers with `identifierText` in the source file.
    const allNodes = ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.Identifier)
        .filter(identifier => identifier.text === identifierText);
    // If there are more identifiers than the ones we already removed plus the ones we're going to
    // remove from imports, don't do anything.
    // This means that there's still a couple around that weren't removed and this would break code.
    if (allNodes.length > removedIdentifiers.length + identifierImports.length) {
        return [];
    }
    // Go through the imports.
    identifierImports.forEach((node) => {
        const namedImports = node.importClause.namedBindings;
        // Only one import, remove the whole declaration.
        if (namedImports.elements.length === 1) {
            ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, node));
        }
        else {
            namedImports.elements.forEach((element) => {
                // Multiple imports, remove only the single identifier.
                if (element.name.text == identifierText) {
                    ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, node));
                }
            });
        }
    });
    return ops;
}
exports.removeImport = removeImport;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/transformers/remove_import.js.map