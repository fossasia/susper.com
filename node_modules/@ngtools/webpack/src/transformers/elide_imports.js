"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignoreDep typescript
const ts = require("typescript");
const ast_helpers_1 = require("./ast_helpers");
const interfaces_1 = require("./interfaces");
// Remove imports for which all identifiers have been removed.
// Needs type checker, and works even if it's not the first transformer.
// Works by removing imports for symbols whose identifiers have all been removed.
// Doesn't use the `symbol.declarations` because that previous transforms might have removed nodes
// but the type checker doesn't know.
// See https://github.com/Microsoft/TypeScript/issues/17552 for more information.
function elideImports(sourceFile, removedNodes, getTypeChecker) {
    const ops = [];
    if (removedNodes.length === 0) {
        return [];
    }
    // Get all children identifiers inside the removed nodes.
    const removedIdentifiers = removedNodes
        .map((node) => ast_helpers_1.collectDeepNodes(node, ts.SyntaxKind.Identifier))
        .reduce((prev, curr) => prev.concat(curr), [])
        .concat(removedNodes.filter((node) => node.kind === ts.SyntaxKind.Identifier));
    if (removedIdentifiers.length === 0) {
        return [];
    }
    // Get all imports in the source file.
    const allImports = ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.ImportDeclaration);
    if (allImports.length === 0) {
        return [];
    }
    const removedSymbolMap = new Map();
    const typeChecker = getTypeChecker();
    // Find all imports that use a removed identifier and add them to the map.
    allImports
        .filter((node) => {
        // TODO: try to support removing `import * as X from 'XYZ'`.
        // Filter out import statements that are either `import 'XYZ'` or `import * as X from 'XYZ'`.
        const clause = node.importClause;
        if (!clause || clause.name || !clause.namedBindings) {
            return false;
        }
        return clause.namedBindings.kind == ts.SyntaxKind.NamedImports;
    })
        .forEach((importDecl) => {
        const importClause = importDecl.importClause;
        const namedImports = importClause.namedBindings;
        namedImports.elements.forEach((importSpec) => {
            const importId = importSpec.name;
            const symbol = typeChecker.getSymbolAtLocation(importId);
            const removedNodesForImportId = removedIdentifiers.filter((id) => id.text === importId.text && typeChecker.getSymbolAtLocation(id) === symbol);
            if (removedNodesForImportId.length > 0) {
                removedSymbolMap.set(importId.text, {
                    symbol,
                    importDecl,
                    importSpec,
                    singleImport: namedImports.elements.length === 1,
                    removed: removedNodesForImportId,
                    all: []
                });
            }
        });
    });
    if (removedSymbolMap.size === 0) {
        return [];
    }
    // Find all identifiers in the source file that have a removed symbol, and add them to the map.
    ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.Identifier)
        .forEach((id) => {
        if (removedSymbolMap.has(id.text)) {
            const symbol = removedSymbolMap.get(id.text);
            // Check if the symbol is the same or if it is a named export.
            // Named exports don't have the same symbol but will have the same name.
            if ((id.parent && id.parent.kind === ts.SyntaxKind.ExportSpecifier)
                || typeChecker.getSymbolAtLocation(id) === symbol.symbol) {
                symbol.all.push(id);
            }
        }
    });
    Array.from(removedSymbolMap.values())
        .filter((symbol) => {
        // If the number of removed imports plus one (the import specifier) is equal to the total
        // number of identifiers for that symbol, it's safe to remove the import.
        return symbol.removed.length + 1 === symbol.all.length;
    })
        .forEach((symbol) => {
        // Remove the whole declaration if it's a single import.
        const nodeToRemove = symbol.singleImport ? symbol.importDecl : symbol.importSpec;
        ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, nodeToRemove));
    });
    return ops;
}
exports.elideImports = elideImports;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/transformers/elide_imports.js.map