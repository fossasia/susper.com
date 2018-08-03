"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
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
    const typeChecker = getTypeChecker();
    // Collect all imports and used identifiers
    const specialCaseNames = new Set();
    const usedSymbols = new Set();
    const imports = new Array();
    ts.forEachChild(sourceFile, function visit(node) {
        // Skip removed nodes
        if (removedNodes.includes(node)) {
            return;
        }
        // Record import and skip
        if (ts.isImportDeclaration(node)) {
            imports.push(node);
            return;
        }
        if (ts.isIdentifier(node)) {
            usedSymbols.add(typeChecker.getSymbolAtLocation(node));
        }
        else if (ts.isExportSpecifier(node)) {
            // Export specifiers return the non-local symbol from the above
            // so check the name string instead
            specialCaseNames.add((node.propertyName || node.name).text);
            return;
        }
        else if (ts.isShorthandPropertyAssignment(node)) {
            // Shorthand property assignments return the object property's symbol not the import's
            specialCaseNames.add(node.name.text);
        }
        ts.forEachChild(node, visit);
    });
    if (imports.length === 0) {
        return [];
    }
    const isUnused = (node) => {
        if (specialCaseNames.has(node.text)) {
            return false;
        }
        const symbol = typeChecker.getSymbolAtLocation(node);
        return symbol && !usedSymbols.has(symbol);
    };
    for (const node of imports) {
        if (!node.importClause) {
            // "import 'abc';"
            continue;
        }
        if (node.importClause.name) {
            // "import XYZ from 'abc';"
            if (isUnused(node.importClause.name)) {
                ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, node));
            }
        }
        else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            // "import * as XYZ from 'abc';"
            if (isUnused(node.importClause.namedBindings.name)) {
                ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, node));
            }
        }
        else if (ts.isNamedImports(node.importClause.namedBindings)) {
            // "import { XYZ, ... } from 'abc';"
            const specifierOps = [];
            for (const specifier of node.importClause.namedBindings.elements) {
                if (isUnused(specifier.propertyName || specifier.name)) {
                    specifierOps.push(new interfaces_1.RemoveNodeOperation(sourceFile, specifier));
                }
            }
            if (specifierOps.length === node.importClause.namedBindings.elements.length) {
                ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, node));
            }
            else {
                ops.push(...specifierOps);
            }
        }
    }
    return ops;
}
exports.elideImports = elideImports;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/transformers/elide_imports.js.map