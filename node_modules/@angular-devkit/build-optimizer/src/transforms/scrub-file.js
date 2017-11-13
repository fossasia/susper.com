"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ts = require("typescript");
const ast_utils_1 = require("../helpers/ast-utils");
function testScrubFile(content) {
    const markers = [
        'decorators',
        '__decorate',
        'propDecorators',
        'ctorParameters',
    ];
    return markers.some((marker) => content.indexOf(marker) !== -1);
}
exports.testScrubFile = testScrubFile;
// Don't remove `ctorParameters` from these.
const platformWhitelist = [
    'PlatformRef_',
    'TestabilityRegistry',
    'Console',
    'BrowserPlatformLocation',
];
const angularSpecifiers = [
    // Class level decorators.
    'Component',
    'Directive',
    'Injectable',
    'NgModule',
    'Pipe',
    // Property level decorators.
    'ContentChild',
    'ContentChildren',
    'HostBinding',
    'HostListener',
    'Input',
    'Output',
    'ViewChild',
    'ViewChildren',
];
function getScrubFileTransformer(program) {
    const checker = program.getTypeChecker();
    return (context) => {
        const transformer = (sf) => {
            const ngMetadata = findAngularMetadata(sf);
            const tslibImports = findTslibImports(sf);
            const nodes = [];
            ts.forEachChild(sf, checkNodeForDecorators);
            function checkNodeForDecorators(node) {
                if (node.kind !== ts.SyntaxKind.ExpressionStatement) {
                    // TS 2.4 nests decorators inside downleveled class IIFEs, so we
                    // must recurse into them to find the relevant expression statements.
                    return ts.forEachChild(node, checkNodeForDecorators);
                }
                const exprStmt = node;
                if (isDecoratorAssignmentExpression(exprStmt)) {
                    nodes.push(...pickDecorationNodesToRemove(exprStmt, ngMetadata, checker));
                }
                if (isDecorateAssignmentExpression(exprStmt, tslibImports, checker)) {
                    nodes.push(...pickDecorateNodesToRemove(exprStmt, tslibImports, ngMetadata, checker));
                }
                if (isAngularDecoratorMetadataExpression(exprStmt, ngMetadata, tslibImports, checker)) {
                    nodes.push(node);
                }
                if (isPropDecoratorAssignmentExpression(exprStmt)) {
                    nodes.push(...pickPropDecorationNodesToRemove(exprStmt, ngMetadata, checker));
                }
                if (isCtorParamsAssignmentExpression(exprStmt)
                    && !isCtorParamsWhitelistedService(exprStmt)) {
                    nodes.push(node);
                }
            }
            const visitor = (node) => {
                // Check if node is a statement to be dropped.
                if (nodes.find((n) => n === node)) {
                    // According to @mhegazy returning undefined is supported.
                    // https://github.com/Microsoft/TypeScript/pull/17044
                    // tslint:disable-next-line:no-any
                    return undefined;
                }
                // Otherwise return node as is.
                return ts.visitEachChild(node, visitor, context);
            };
            return ts.visitNode(sf, visitor);
        };
        return transformer;
    };
}
exports.getScrubFileTransformer = getScrubFileTransformer;
function expect(node, kind) {
    if (node.kind !== kind) {
        throw new Error('Invalid node type.');
    }
    return node;
}
exports.expect = expect;
function nameOfSpecifier(node) {
    return node.name && node.name.text || '<unknown>';
}
function findAngularMetadata(node) {
    let specs = [];
    ts.forEachChild(node, (child) => {
        if (child.kind === ts.SyntaxKind.ImportDeclaration) {
            const importDecl = child;
            if (isAngularCoreImport(importDecl)) {
                specs.push(...ast_utils_1.collectDeepNodes(node, ts.SyntaxKind.ImportSpecifier)
                    .filter((spec) => isAngularCoreSpecifier(spec)));
            }
        }
    });
    const localDecl = findAllDeclarations(node)
        .filter((decl) => angularSpecifiers.indexOf(decl.name.text) !== -1);
    if (localDecl.length === angularSpecifiers.length) {
        specs = specs.concat(localDecl);
    }
    return specs;
}
function findAllDeclarations(node) {
    const nodes = [];
    ts.forEachChild(node, (child) => {
        if (child.kind === ts.SyntaxKind.VariableStatement) {
            const vStmt = child;
            vStmt.declarationList.declarations.forEach((decl) => {
                if (decl.name.kind !== ts.SyntaxKind.Identifier) {
                    return;
                }
                nodes.push(decl);
            });
        }
    });
    return nodes;
}
function isAngularCoreImport(node) {
    return true &&
        node.moduleSpecifier &&
        node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral &&
        node.moduleSpecifier.text === '@angular/core';
}
function isAngularCoreSpecifier(node) {
    return angularSpecifiers.indexOf(nameOfSpecifier(node)) !== -1;
}
// Check if assignment is `Clazz.decorators = [...];`.
function isDecoratorAssignmentExpression(exprStmt) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.BinaryExpression) {
        return false;
    }
    const expr = exprStmt.expression;
    if (expr.left.kind !== ts.SyntaxKind.PropertyAccessExpression) {
        return false;
    }
    const propAccess = expr.left;
    if (propAccess.expression.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    if (propAccess.name.text !== 'decorators') {
        return false;
    }
    if (expr.operatorToken.kind !== ts.SyntaxKind.FirstAssignment) {
        return false;
    }
    if (expr.right.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return false;
    }
    return true;
}
// Check if assignment is `Clazz = __decorate([...], Clazz)`.
function isDecorateAssignmentExpression(exprStmt, tslibImports, checker) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.BinaryExpression) {
        return false;
    }
    const expr = exprStmt.expression;
    if (expr.left.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    const classIdent = expr.left;
    let callExpr;
    if (expr.right.kind === ts.SyntaxKind.CallExpression) {
        callExpr = expr.right;
    }
    else if (expr.right.kind === ts.SyntaxKind.BinaryExpression) {
        // `Clazz = Clazz_1 = __decorate([...], Clazz)` can be found when there are static property
        // accesses.
        const innerExpr = expr.right;
        if (innerExpr.left.kind !== ts.SyntaxKind.Identifier
            || innerExpr.right.kind !== ts.SyntaxKind.CallExpression) {
            return false;
        }
        callExpr = innerExpr.right;
    }
    else {
        return false;
    }
    if (!isTslibHelper(callExpr, '__decorate', tslibImports, checker)) {
        return false;
    }
    if (callExpr.arguments.length !== 2) {
        return false;
    }
    if (callExpr.arguments[1].kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    const classArg = callExpr.arguments[1];
    if (classIdent.text !== classArg.text) {
        return false;
    }
    if (callExpr.arguments[0].kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return false;
    }
    return true;
}
// Check if expression is `__decorate([smt, __metadata("design:type", Object)], ...)`.
function isAngularDecoratorMetadataExpression(exprStmt, ngMetadata, tslibImports, checker) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.CallExpression) {
        return false;
    }
    const callExpr = exprStmt.expression;
    if (!isTslibHelper(callExpr, '__decorate', tslibImports, checker)) {
        return false;
    }
    if (callExpr.arguments.length !== 4) {
        return false;
    }
    if (callExpr.arguments[0].kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return false;
    }
    const decorateArray = callExpr.arguments[0];
    // Check first array entry for Angular decorators.
    if (decorateArray.elements[0].kind !== ts.SyntaxKind.CallExpression) {
        return false;
    }
    const decoratorCall = decorateArray.elements[0];
    if (decoratorCall.expression.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    const decoratorId = decoratorCall.expression;
    if (!identifierIsMetadata(decoratorId, ngMetadata, checker)) {
        return false;
    }
    // Check second array entry for __metadata call.
    if (decorateArray.elements[1].kind !== ts.SyntaxKind.CallExpression) {
        return false;
    }
    const metadataCall = decorateArray.elements[1];
    if (!isTslibHelper(metadataCall, '__metadata', tslibImports, checker)) {
        return false;
    }
    return true;
}
// Check if assignment is `Clazz.propDecorators = [...];`.
function isPropDecoratorAssignmentExpression(exprStmt) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.BinaryExpression) {
        return false;
    }
    const expr = exprStmt.expression;
    if (expr.left.kind !== ts.SyntaxKind.PropertyAccessExpression) {
        return false;
    }
    const propAccess = expr.left;
    if (propAccess.expression.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    if (propAccess.name.text !== 'propDecorators') {
        return false;
    }
    if (expr.operatorToken.kind !== ts.SyntaxKind.FirstAssignment) {
        return false;
    }
    if (expr.right.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
        return false;
    }
    return true;
}
// Check if assignment is `Clazz.ctorParameters = [...];`.
function isCtorParamsAssignmentExpression(exprStmt) {
    if (exprStmt.expression.kind !== ts.SyntaxKind.BinaryExpression) {
        return false;
    }
    const expr = exprStmt.expression;
    if (expr.left.kind !== ts.SyntaxKind.PropertyAccessExpression) {
        return false;
    }
    const propAccess = expr.left;
    if (propAccess.name.text !== 'ctorParameters') {
        return false;
    }
    if (propAccess.expression.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    if (expr.operatorToken.kind !== ts.SyntaxKind.FirstAssignment) {
        return false;
    }
    if (expr.right.kind !== ts.SyntaxKind.FunctionExpression
        && expr.right.kind !== ts.SyntaxKind.ArrowFunction) {
        return false;
    }
    return true;
}
function isCtorParamsWhitelistedService(exprStmt) {
    const expr = exprStmt.expression;
    const propAccess = expr.left;
    const serviceId = propAccess.expression;
    return platformWhitelist.indexOf(serviceId.text) !== -1;
}
// Remove Angular decorators from`Clazz.decorators = [...];`, or expression itself if all are
// removed.
function pickDecorationNodesToRemove(exprStmt, ngMetadata, checker) {
    const expr = expect(exprStmt.expression, ts.SyntaxKind.BinaryExpression);
    const literal = expect(expr.right, ts.SyntaxKind.ArrayLiteralExpression);
    if (!literal.elements.every((elem) => elem.kind === ts.SyntaxKind.ObjectLiteralExpression)) {
        return [];
    }
    const elements = literal.elements;
    const ngDecorators = elements.filter((elem) => isAngularDecorator(elem, ngMetadata, checker));
    return (elements.length > ngDecorators.length) ? ngDecorators : [exprStmt];
}
// Remove Angular decorators from `Clazz = __decorate([...], Clazz)`, or expression itself if all
// are removed.
function pickDecorateNodesToRemove(exprStmt, tslibImports, ngMetadata, checker) {
    const expr = expect(exprStmt.expression, ts.SyntaxKind.BinaryExpression);
    const classId = expect(expr.left, ts.SyntaxKind.Identifier);
    let callExpr;
    if (expr.right.kind === ts.SyntaxKind.CallExpression) {
        callExpr = expect(expr.right, ts.SyntaxKind.CallExpression);
    }
    else if (expr.right.kind === ts.SyntaxKind.BinaryExpression) {
        const innerExpr = expr.right;
        callExpr = expect(innerExpr.right, ts.SyntaxKind.CallExpression);
    }
    else {
        return [];
    }
    const arrLiteral = expect(callExpr.arguments[0], ts.SyntaxKind.ArrayLiteralExpression);
    if (!arrLiteral.elements.every((elem) => elem.kind === ts.SyntaxKind.CallExpression)) {
        return [];
    }
    const elements = arrLiteral.elements;
    const ngDecoratorCalls = elements.filter((el) => {
        if (el.expression.kind !== ts.SyntaxKind.Identifier) {
            return false;
        }
        const id = el.expression;
        return identifierIsMetadata(id, ngMetadata, checker);
    });
    // Only remove constructor parameter metadata on non-whitelisted classes.
    if (platformWhitelist.indexOf(classId.text) === -1) {
        const metadataCalls = elements.filter((el) => {
            if (!isTslibHelper(el, '__metadata', tslibImports, checker)) {
                return false;
            }
            if (el.arguments.length < 2) {
                return false;
            }
            if (el.arguments[0].kind !== ts.SyntaxKind.StringLiteral) {
                return false;
            }
            const metadataTypeId = el.arguments[0];
            if (metadataTypeId.text !== 'design:paramtypes') {
                return false;
            }
            return true;
        });
        ngDecoratorCalls.push(...metadataCalls);
    }
    // If all decorators are metadata decorators then return the whole `Class = __decorate([...])'`
    // statement so that it is removed in entirety
    return (elements.length === ngDecoratorCalls.length) ? [exprStmt] : ngDecoratorCalls;
}
// Remove Angular decorators from`Clazz.propDecorators = [...];`, or expression itself if all
// are removed.
function pickPropDecorationNodesToRemove(exprStmt, ngMetadata, checker) {
    const expr = expect(exprStmt.expression, ts.SyntaxKind.BinaryExpression);
    const literal = expect(expr.right, ts.SyntaxKind.ObjectLiteralExpression);
    if (!literal.properties.every((elem) => elem.kind === ts.SyntaxKind.PropertyAssignment &&
        elem.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression)) {
        return [];
    }
    const assignments = literal.properties;
    // Consider each assignment individually. Either the whole assignment will be removed or
    // a particular decorator within will.
    const toRemove = assignments
        .map((assign) => {
        const decorators = expect(assign.initializer, ts.SyntaxKind.ArrayLiteralExpression).elements;
        if (!decorators.every((el) => el.kind === ts.SyntaxKind.ObjectLiteralExpression)) {
            return [];
        }
        const decsToRemove = decorators.filter((expression) => {
            const lit = expect(expression, ts.SyntaxKind.ObjectLiteralExpression);
            return isAngularDecorator(lit, ngMetadata, checker);
        });
        if (decsToRemove.length === decorators.length) {
            return [assign];
        }
        return decsToRemove;
    })
        .reduce((accum, toRm) => accum.concat(toRm), []);
    // If every node to be removed is a property assignment (full property's decorators) and
    // all properties are accounted for, remove the whole assignment. Otherwise, remove the
    // nodes which were marked as safe.
    if (toRemove.length === assignments.length &&
        toRemove.every((node) => node.kind === ts.SyntaxKind.PropertyAssignment)) {
        return [exprStmt];
    }
    return toRemove;
}
function isAngularDecorator(literal, ngMetadata, checker) {
    const types = literal.properties.filter(isTypeProperty);
    if (types.length !== 1) {
        return false;
    }
    const assign = expect(types[0], ts.SyntaxKind.PropertyAssignment);
    if (assign.initializer.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    const id = assign.initializer;
    const res = identifierIsMetadata(id, ngMetadata, checker);
    return res;
}
function isTypeProperty(prop) {
    if (prop.kind !== ts.SyntaxKind.PropertyAssignment) {
        return false;
    }
    const assignment = prop;
    if (assignment.name.kind !== ts.SyntaxKind.Identifier) {
        return false;
    }
    const name = assignment.name;
    return name.text === 'type';
}
// Check if an identifier is part of the known Angular Metadata.
function identifierIsMetadata(id, metadata, checker) {
    const symbol = checker.getSymbolAtLocation(id);
    if (!symbol || !symbol.declarations || !symbol.declarations.length) {
        return false;
    }
    return symbol
        .declarations
        .some((spec) => metadata.indexOf(spec) !== -1);
}
// Check if an import is a tslib helper import (`import * as tslib from "tslib";`)
function isTslibImport(node) {
    return !!(node.moduleSpecifier &&
        node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral &&
        node.moduleSpecifier.text === 'tslib' &&
        node.importClause &&
        node.importClause.namedBindings &&
        node.importClause.namedBindings.kind === ts.SyntaxKind.NamespaceImport);
}
// Find all namespace imports for `tslib`.
function findTslibImports(node) {
    const imports = [];
    ts.forEachChild(node, (child) => {
        if (child.kind === ts.SyntaxKind.ImportDeclaration) {
            const importDecl = child;
            if (isTslibImport(importDecl)) {
                const importClause = importDecl.importClause;
                const namespaceImport = importClause.namedBindings;
                imports.push(namespaceImport);
            }
        }
    });
    return imports;
}
// Check if an identifier is part of the known tslib identifiers.
function identifierIsTslib(id, tslibImports, checker) {
    const symbol = checker.getSymbolAtLocation(id);
    if (!symbol || !symbol.declarations || !symbol.declarations.length) {
        return false;
    }
    return symbol
        .declarations
        .some((spec) => tslibImports.indexOf(spec) !== -1);
}
// Check if a function call is a tslib helper.
function isTslibHelper(callExpr, helper, tslibImports, checker) {
    let callExprIdent = callExpr.expression;
    if (callExpr.expression.kind !== ts.SyntaxKind.Identifier) {
        if (callExpr.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            const propAccess = callExpr.expression;
            const left = propAccess.expression;
            callExprIdent = propAccess.name;
            if (left.kind !== ts.SyntaxKind.Identifier) {
                return false;
            }
            const id = left;
            if (!identifierIsTslib(id, tslibImports, checker)) {
                return false;
            }
        }
        else {
            return false;
        }
    }
    // node.text on a name that starts with two underscores will return three instead.
    // Unless it's an expression like tslib.__decorate, in which case it's only 2.
    if (callExprIdent.text !== `_${helper}` && callExprIdent.text !== helper) {
        return false;
    }
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NydWItZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvc2NydWItZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUNqQyxvREFBd0Q7QUFHeEQsdUJBQThCLE9BQWU7SUFDM0MsTUFBTSxPQUFPLEdBQUc7UUFDZCxZQUFZO1FBQ1osWUFBWTtRQUNaLGdCQUFnQjtRQUNoQixnQkFBZ0I7S0FDakIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBVEQsc0NBU0M7QUFFRCw0Q0FBNEM7QUFDNUMsTUFBTSxpQkFBaUIsR0FBRztJQUN4QixjQUFjO0lBQ2QscUJBQXFCO0lBQ3JCLFNBQVM7SUFDVCx5QkFBeUI7Q0FDMUIsQ0FBQztBQUVGLE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsMEJBQTBCO0lBQzFCLFdBQVc7SUFDWCxXQUFXO0lBQ1gsWUFBWTtJQUNaLFVBQVU7SUFDVixNQUFNO0lBRU4sNkJBQTZCO0lBQzdCLGNBQWM7SUFDZCxpQkFBaUI7SUFDakIsYUFBYTtJQUNiLGNBQWM7SUFDZCxPQUFPO0lBQ1AsUUFBUTtJQUNSLFdBQVc7SUFDWCxjQUFjO0NBQ2YsQ0FBQztBQUVGLGlDQUF3QyxPQUFtQjtJQUN6RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFekMsTUFBTSxDQUFDLENBQUMsT0FBaUM7UUFFdkMsTUFBTSxXQUFXLEdBQWtDLENBQUMsRUFBaUI7WUFFbkUsTUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsRUFB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QUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUF5QyxDQUFDO1lBQ3RFLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFDbkMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFFaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDZixDQUFDO1lBRUQsTUFBTSxFQUFFLEdBQUcsSUFBcUIsQ0FBQztZQUVqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2YsQ0FBQztRQUVILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQztJQUVELGtGQUFrRjtJQUNsRiw4RUFBOEU7SUFDOUUsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgeyBjb2xsZWN0RGVlcE5vZGVzIH0gZnJvbSAnLi4vaGVscGVycy9hc3QtdXRpbHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0U2NydWJGaWxlKGNvbnRlbnQ6IHN0cmluZykge1xuICBjb25zdCBtYXJrZXJzID0gW1xuICAgICdkZWNvcmF0b3JzJyxcbiAgICAnX19kZWNvcmF0ZScsXG4gICAgJ3Byb3BEZWNvcmF0b3JzJyxcbiAgICAnY3RvclBhcmFtZXRlcnMnLFxuICBdO1xuXG4gIHJldHVybiBtYXJrZXJzLnNvbWUoKG1hcmtlcikgPT4gY29udGVudC5pbmRleE9mKG1hcmtlcikgIT09IC0xKTtcbn1cblxuLy8gRG9uJ3QgcmVtb3ZlIGBjdG9yUGFyYW1ldGVyc2AgZnJvbSB0aGVzZS5cbmNvbnN0IHBsYXRmb3JtV2hpdGVsaXN0ID0gW1xuICAnUGxhdGZvcm1SZWZfJyxcbiAgJ1Rlc3RhYmlsaXR5UmVnaXN0cnknLFxuICAnQ29uc29sZScsXG4gICdCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbicsXG5dO1xuXG5jb25zdCBhbmd1bGFyU3BlY2lmaWVycyA9IFtcbiAgLy8gQ2xhc3MgbGV2ZWwgZGVjb3JhdG9ycy5cbiAgJ0NvbXBvbmVudCcsXG4gICdEaXJlY3RpdmUnLFxuICAnSW5qZWN0YWJsZScsXG4gICdOZ01vZHVsZScsXG4gICdQaXBlJyxcblxuICAvLyBQcm9wZXJ0eSBsZXZlbCBkZWNvcmF0b3JzLlxuICAnQ29udGVudENoaWxkJyxcbiAgJ0NvbnRlbnRDaGlsZHJlbicsXG4gICdIb3N0QmluZGluZycsXG4gICdIb3N0TGlzdGVuZXInLFxuICAnSW5wdXQnLFxuICAnT3V0cHV0JyxcbiAgJ1ZpZXdDaGlsZCcsXG4gICdWaWV3Q2hpbGRyZW4nLFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjcnViRmlsZVRyYW5zZm9ybWVyKHByb2dyYW06IHRzLlByb2dyYW0pOiB0cy5UcmFuc2Zvcm1lckZhY3Rvcnk8dHMuU291cmNlRmlsZT4ge1xuICBjb25zdCBjaGVja2VyID0gcHJvZ3JhbS5nZXRUeXBlQ2hlY2tlcigpO1xuXG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuXG4gICAgY29uc3QgdHJhbnNmb3JtZXI6IHRzLlRyYW5zZm9ybWVyPHRzLlNvdXJjZUZpbGU+ID0gKHNmOiB0cy5Tb3VyY2VGaWxlKSA9PiB7XG5cbiAgICAgIGNvbnN0IG5nTWV0YWRhdGEgPSBmaW5kQW5ndWxhck1ldGFkYXRhKHNmKTtcbiAgICAgIGNvbnN0IHRzbGliSW1wb3J0cyA9IGZpbmRUc2xpYkltcG9ydHMoc2YpO1xuXG4gICAgICBjb25zdCBub2RlczogdHMuTm9kZVtdID0gW107XG4gICAgICB0cy5mb3JFYWNoQ2hpbGQoc2YsIGNoZWNrTm9kZUZvckRlY29yYXRvcnMpO1xuXG4gICAgICBmdW5jdGlvbiBjaGVja05vZGVGb3JEZWNvcmF0b3JzKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKG5vZGUua2luZCAhPT0gdHMuU3ludGF4S2luZC5FeHByZXNzaW9uU3RhdGVtZW50KSB7XG4gICAgICAgICAgLy8gVFMgMi40IG5lc3RzIGRlY29yYXRvcnMgaW5zaWRlIGRvd25sZXZlbGVkIGNsYXNzIElJRkVzLCBzbyB3ZVxuICAgICAgICAgIC8vIG11c3QgcmVjdXJzZSBpbnRvIHRoZW0gdG8gZmluZCB0aGUgcmVsZXZhbnQgZXhwcmVzc2lvbiBzdGF0ZW1lbnRzLlxuICAgICAgICAgIHJldHVybiB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgY2hlY2tOb2RlRm9yRGVjb3JhdG9ycyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXhwclN0bXQgPSBub2RlIGFzIHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQ7XG4gICAgICAgIGlmIChpc0RlY29yYXRvckFzc2lnbm1lbnRFeHByZXNzaW9uKGV4cHJTdG10KSkge1xuICAgICAgICAgIG5vZGVzLnB1c2goLi4ucGlja0RlY29yYXRpb25Ob2Rlc1RvUmVtb3ZlKGV4cHJTdG10LCBuZ01ldGFkYXRhLCBjaGVja2VyKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRGVjb3JhdGVBc3NpZ25tZW50RXhwcmVzc2lvbihleHByU3RtdCwgdHNsaWJJbXBvcnRzLCBjaGVja2VyKSkge1xuICAgICAgICAgIG5vZGVzLnB1c2goLi4ucGlja0RlY29yYXRlTm9kZXNUb1JlbW92ZShleHByU3RtdCwgdHNsaWJJbXBvcnRzLCBuZ01ldGFkYXRhLCBjaGVja2VyKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQW5ndWxhckRlY29yYXRvck1ldGFkYXRhRXhwcmVzc2lvbihleHByU3RtdCwgbmdNZXRhZGF0YSwgdHNsaWJJbXBvcnRzLCBjaGVja2VyKSkge1xuICAgICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJvcERlY29yYXRvckFzc2lnbm1lbnRFeHByZXNzaW9uKGV4cHJTdG10KSkge1xuICAgICAgICAgIG5vZGVzLnB1c2goLi4ucGlja1Byb3BEZWNvcmF0aW9uTm9kZXNUb1JlbW92ZShleHByU3RtdCwgbmdNZXRhZGF0YSwgY2hlY2tlcikpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0N0b3JQYXJhbXNBc3NpZ25tZW50RXhwcmVzc2lvbihleHByU3RtdClcbiAgICAgICAgICAmJiAhaXNDdG9yUGFyYW1zV2hpdGVsaXN0ZWRTZXJ2aWNlKGV4cHJTdG10KSkge1xuICAgICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgdmlzaXRvcjogdHMuVmlzaXRvciA9IChub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSA9PiB7XG4gICAgICAgIC8vIENoZWNrIGlmIG5vZGUgaXMgYSBzdGF0ZW1lbnQgdG8gYmUgZHJvcHBlZC5cbiAgICAgICAgaWYgKG5vZGVzLmZpbmQoKG4pID0+IG4gPT09IG5vZGUpKSB7XG4gICAgICAgICAgLy8gQWNjb3JkaW5nIHRvIEBtaGVnYXp5IHJldHVybmluZyB1bmRlZmluZWQgaXMgc3VwcG9ydGVkLlxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9wdWxsLzE3MDQ0XG4gICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQgYXMgYW55O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHJldHVybiBub2RlIGFzIGlzLlxuICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gdHMudmlzaXROb2RlKHNmLCB2aXNpdG9yKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhwZWN0PFQgZXh0ZW5kcyB0cy5Ob2RlPihub2RlOiB0cy5Ob2RlLCBraW5kOiB0cy5TeW50YXhLaW5kKTogVCB7XG4gIGlmIChub2RlLmtpbmQgIT09IGtpbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbm9kZSB0eXBlLicpO1xuICB9XG5cbiAgcmV0dXJuIG5vZGUgYXMgVDtcbn1cblxuZnVuY3Rpb24gbmFtZU9mU3BlY2lmaWVyKG5vZGU6IHRzLkltcG9ydFNwZWNpZmllcik6IHN0cmluZyB7XG4gIHJldHVybiBub2RlLm5hbWUgJiYgbm9kZS5uYW1lLnRleHQgfHwgJzx1bmtub3duPic7XG59XG5cbmZ1bmN0aW9uIGZpbmRBbmd1bGFyTWV0YWRhdGEobm9kZTogdHMuTm9kZSk6IHRzLk5vZGVbXSB7XG4gIGxldCBzcGVjczogdHMuTm9kZVtdID0gW107XG4gIHRzLmZvckVhY2hDaGlsZChub2RlLCAoY2hpbGQpID0+IHtcbiAgICBpZiAoY2hpbGQua2luZCA9PT0gdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbikge1xuICAgICAgY29uc3QgaW1wb3J0RGVjbCA9IGNoaWxkIGFzIHRzLkltcG9ydERlY2xhcmF0aW9uO1xuICAgICAgaWYgKGlzQW5ndWxhckNvcmVJbXBvcnQoaW1wb3J0RGVjbCkpIHtcbiAgICAgICAgc3BlY3MucHVzaCguLi5jb2xsZWN0RGVlcE5vZGVzPHRzLkltcG9ydFNwZWNpZmllcj4obm9kZSwgdHMuU3ludGF4S2luZC5JbXBvcnRTcGVjaWZpZXIpXG4gICAgICAgICAgLmZpbHRlcigoc3BlYykgPT4gaXNBbmd1bGFyQ29yZVNwZWNpZmllcihzcGVjKSkpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgbG9jYWxEZWNsID0gZmluZEFsbERlY2xhcmF0aW9ucyhub2RlKVxuICAgIC5maWx0ZXIoKGRlY2wpID0+IGFuZ3VsYXJTcGVjaWZpZXJzLmluZGV4T2YoKGRlY2wubmFtZSBhcyB0cy5JZGVudGlmaWVyKS50ZXh0KSAhPT0gLTEpO1xuICBpZiAobG9jYWxEZWNsLmxlbmd0aCA9PT0gYW5ndWxhclNwZWNpZmllcnMubGVuZ3RoKSB7XG4gICAgc3BlY3MgPSBzcGVjcy5jb25jYXQobG9jYWxEZWNsKTtcbiAgfVxuXG4gIHJldHVybiBzcGVjcztcbn1cblxuZnVuY3Rpb24gZmluZEFsbERlY2xhcmF0aW9ucyhub2RlOiB0cy5Ob2RlKTogdHMuVmFyaWFibGVEZWNsYXJhdGlvbltdIHtcbiAgY29uc3Qgbm9kZXM6IHRzLlZhcmlhYmxlRGVjbGFyYXRpb25bXSA9IFtdO1xuICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgaWYgKGNoaWxkLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgIGNvbnN0IHZTdG10ID0gY2hpbGQgYXMgdHMuVmFyaWFibGVTdGF0ZW1lbnQ7XG4gICAgICB2U3RtdC5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zLmZvckVhY2goKGRlY2wpID0+IHtcbiAgICAgICAgaWYgKGRlY2wubmFtZS5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbm9kZXMucHVzaChkZWNsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBpc0FuZ3VsYXJDb3JlSW1wb3J0KG5vZGU6IHRzLkltcG9ydERlY2xhcmF0aW9uKTogYm9vbGVhbiB7XG4gIHJldHVybiB0cnVlICYmXG4gICAgbm9kZS5tb2R1bGVTcGVjaWZpZXIgJiZcbiAgICBub2RlLm1vZHVsZVNwZWNpZmllci5raW5kID09PSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwgJiZcbiAgICAobm9kZS5tb2R1bGVTcGVjaWZpZXIgYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dCA9PT0gJ0Bhbmd1bGFyL2NvcmUnO1xufVxuXG5mdW5jdGlvbiBpc0FuZ3VsYXJDb3JlU3BlY2lmaWVyKG5vZGU6IHRzLkltcG9ydFNwZWNpZmllcik6IGJvb2xlYW4ge1xuICByZXR1cm4gYW5ndWxhclNwZWNpZmllcnMuaW5kZXhPZihuYW1lT2ZTcGVjaWZpZXIobm9kZSkpICE9PSAtMTtcbn1cblxuLy8gQ2hlY2sgaWYgYXNzaWdubWVudCBpcyBgQ2xhenouZGVjb3JhdG9ycyA9IFsuLi5dO2AuXG5mdW5jdGlvbiBpc0RlY29yYXRvckFzc2lnbm1lbnRFeHByZXNzaW9uKGV4cHJTdG10OiB0cy5FeHByZXNzaW9uU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gIGlmIChleHByU3RtdC5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBleHByID0gZXhwclN0bXQuZXhwcmVzc2lvbiBhcyB0cy5CaW5hcnlFeHByZXNzaW9uO1xuICBpZiAoZXhwci5sZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHByb3BBY2Nlc3MgPSBleHByLmxlZnQgYXMgdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uO1xuICBpZiAocHJvcEFjY2Vzcy5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAocHJvcEFjY2Vzcy5uYW1lLnRleHQgIT09ICdkZWNvcmF0b3JzJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZXhwci5vcGVyYXRvclRva2VuLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuRmlyc3RBc3NpZ25tZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChleHByLnJpZ2h0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBDaGVjayBpZiBhc3NpZ25tZW50IGlzIGBDbGF6eiA9IF9fZGVjb3JhdGUoWy4uLl0sIENsYXp6KWAuXG5mdW5jdGlvbiBpc0RlY29yYXRlQXNzaWdubWVudEV4cHJlc3Npb24oXG4gIGV4cHJTdG10OiB0cy5FeHByZXNzaW9uU3RhdGVtZW50LFxuICB0c2xpYkltcG9ydHM6IHRzLk5hbWVzcGFjZUltcG9ydFtdLFxuICBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbik6IGJvb2xlYW4ge1xuXG4gIGlmIChleHByU3RtdC5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBleHByID0gZXhwclN0bXQuZXhwcmVzc2lvbiBhcyB0cy5CaW5hcnlFeHByZXNzaW9uO1xuICBpZiAoZXhwci5sZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBjbGFzc0lkZW50ID0gZXhwci5sZWZ0IGFzIHRzLklkZW50aWZpZXI7XG4gIGxldCBjYWxsRXhwcjogdHMuQ2FsbEV4cHJlc3Npb247XG5cbiAgaWYgKGV4cHIucmlnaHQua2luZCA9PT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbikge1xuICAgIGNhbGxFeHByID0gZXhwci5yaWdodCBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcbiAgfSBlbHNlIGlmIChleHByLnJpZ2h0LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbikge1xuICAgIC8vIGBDbGF6eiA9IENsYXp6XzEgPSBfX2RlY29yYXRlKFsuLi5dLCBDbGF6eilgIGNhbiBiZSBmb3VuZCB3aGVuIHRoZXJlIGFyZSBzdGF0aWMgcHJvcGVydHlcbiAgICAvLyBhY2Nlc3Nlcy5cbiAgICBjb25zdCBpbm5lckV4cHIgPSBleHByLnJpZ2h0IGFzIHRzLkJpbmFyeUV4cHJlc3Npb247XG4gICAgaWYgKGlubmVyRXhwci5sZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllclxuICAgICAgfHwgaW5uZXJFeHByLnJpZ2h0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2FsbEV4cHIgPSBpbm5lckV4cHIucmlnaHQgYXMgdHMuQ2FsbEV4cHJlc3Npb247XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFpc1RzbGliSGVscGVyKGNhbGxFeHByLCAnX19kZWNvcmF0ZScsIHRzbGliSW1wb3J0cywgY2hlY2tlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoY2FsbEV4cHIuYXJndW1lbnRzLmxlbmd0aCAhPT0gMikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoY2FsbEV4cHIuYXJndW1lbnRzWzFdLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBjbGFzc0FyZyA9IGNhbGxFeHByLmFyZ3VtZW50c1sxXSBhcyB0cy5JZGVudGlmaWVyO1xuICBpZiAoY2xhc3NJZGVudC50ZXh0ICE9PSBjbGFzc0FyZy50ZXh0KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChjYWxsRXhwci5hcmd1bWVudHNbMF0ua2luZCAhPT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIENoZWNrIGlmIGV4cHJlc3Npb24gaXMgYF9fZGVjb3JhdGUoW3NtdCwgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdCldLCAuLi4pYC5cbmZ1bmN0aW9uIGlzQW5ndWxhckRlY29yYXRvck1ldGFkYXRhRXhwcmVzc2lvbihcbiAgZXhwclN0bXQ6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQsXG4gIG5nTWV0YWRhdGE6IHRzLk5vZGVbXSxcbiAgdHNsaWJJbXBvcnRzOiB0cy5OYW1lc3BhY2VJbXBvcnRbXSxcbiAgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4pOiBib29sZWFuIHtcblxuICBpZiAoZXhwclN0bXQuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGNhbGxFeHByID0gZXhwclN0bXQuZXhwcmVzc2lvbiBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcbiAgaWYgKCFpc1RzbGliSGVscGVyKGNhbGxFeHByLCAnX19kZWNvcmF0ZScsIHRzbGliSW1wb3J0cywgY2hlY2tlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGNhbGxFeHByLmFyZ3VtZW50cy5sZW5ndGggIT09IDQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGNhbGxFeHByLmFyZ3VtZW50c1swXS5raW5kICE9PSB0cy5TeW50YXhLaW5kLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgZGVjb3JhdGVBcnJheSA9IGNhbGxFeHByLmFyZ3VtZW50c1swXSBhcyB0cy5BcnJheUxpdGVyYWxFeHByZXNzaW9uO1xuICAvLyBDaGVjayBmaXJzdCBhcnJheSBlbnRyeSBmb3IgQW5ndWxhciBkZWNvcmF0b3JzLlxuICBpZiAoZGVjb3JhdGVBcnJheS5lbGVtZW50c1swXS5raW5kICE9PSB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGRlY29yYXRvckNhbGwgPSBkZWNvcmF0ZUFycmF5LmVsZW1lbnRzWzBdIGFzIHRzLkNhbGxFeHByZXNzaW9uO1xuICBpZiAoZGVjb3JhdG9yQ2FsbC5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBkZWNvcmF0b3JJZCA9IGRlY29yYXRvckNhbGwuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyO1xuICBpZiAoIWlkZW50aWZpZXJJc01ldGFkYXRhKGRlY29yYXRvcklkLCBuZ01ldGFkYXRhLCBjaGVja2VyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBDaGVjayBzZWNvbmQgYXJyYXkgZW50cnkgZm9yIF9fbWV0YWRhdGEgY2FsbC5cbiAgaWYgKGRlY29yYXRlQXJyYXkuZWxlbWVudHNbMV0ua2luZCAhPT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBtZXRhZGF0YUNhbGwgPSBkZWNvcmF0ZUFycmF5LmVsZW1lbnRzWzFdIGFzIHRzLkNhbGxFeHByZXNzaW9uO1xuICBpZiAoIWlzVHNsaWJIZWxwZXIobWV0YWRhdGFDYWxsLCAnX19tZXRhZGF0YScsIHRzbGliSW1wb3J0cywgY2hlY2tlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gQ2hlY2sgaWYgYXNzaWdubWVudCBpcyBgQ2xhenoucHJvcERlY29yYXRvcnMgPSBbLi4uXTtgLlxuZnVuY3Rpb24gaXNQcm9wRGVjb3JhdG9yQXNzaWdubWVudEV4cHJlc3Npb24oZXhwclN0bXQ6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgaWYgKGV4cHJTdG10LmV4cHJlc3Npb24ua2luZCAhPT0gdHMuU3ludGF4S2luZC5CaW5hcnlFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGV4cHIgPSBleHByU3RtdC5leHByZXNzaW9uIGFzIHRzLkJpbmFyeUV4cHJlc3Npb247XG4gIGlmIChleHByLmxlZnQua2luZCAhPT0gdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgcHJvcEFjY2VzcyA9IGV4cHIubGVmdCBhcyB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG4gIGlmIChwcm9wQWNjZXNzLmV4cHJlc3Npb24ua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChwcm9wQWNjZXNzLm5hbWUudGV4dCAhPT0gJ3Byb3BEZWNvcmF0b3JzJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZXhwci5vcGVyYXRvclRva2VuLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuRmlyc3RBc3NpZ25tZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChleHByLnJpZ2h0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gQ2hlY2sgaWYgYXNzaWdubWVudCBpcyBgQ2xhenouY3RvclBhcmFtZXRlcnMgPSBbLi4uXTtgLlxuZnVuY3Rpb24gaXNDdG9yUGFyYW1zQXNzaWdubWVudEV4cHJlc3Npb24oZXhwclN0bXQ6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgaWYgKGV4cHJTdG10LmV4cHJlc3Npb24ua2luZCAhPT0gdHMuU3ludGF4S2luZC5CaW5hcnlFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGV4cHIgPSBleHByU3RtdC5leHByZXNzaW9uIGFzIHRzLkJpbmFyeUV4cHJlc3Npb247XG4gIGlmIChleHByLmxlZnQua2luZCAhPT0gdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgcHJvcEFjY2VzcyA9IGV4cHIubGVmdCBhcyB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG4gIGlmIChwcm9wQWNjZXNzLm5hbWUudGV4dCAhPT0gJ2N0b3JQYXJhbWV0ZXJzJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAocHJvcEFjY2Vzcy5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZXhwci5vcGVyYXRvclRva2VuLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuRmlyc3RBc3NpZ25tZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChleHByLnJpZ2h0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25FeHByZXNzaW9uXG4gICAgJiYgZXhwci5yaWdodC5raW5kICE9PSB0cy5TeW50YXhLaW5kLkFycm93RnVuY3Rpb25cbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzQ3RvclBhcmFtc1doaXRlbGlzdGVkU2VydmljZShleHByU3RtdDogdHMuRXhwcmVzc2lvblN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICBjb25zdCBleHByID0gZXhwclN0bXQuZXhwcmVzc2lvbiBhcyB0cy5CaW5hcnlFeHByZXNzaW9uO1xuICBjb25zdCBwcm9wQWNjZXNzID0gZXhwci5sZWZ0IGFzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjtcbiAgY29uc3Qgc2VydmljZUlkID0gcHJvcEFjY2Vzcy5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXI7XG5cbiAgcmV0dXJuIHBsYXRmb3JtV2hpdGVsaXN0LmluZGV4T2Yoc2VydmljZUlkLnRleHQpICE9PSAtMTtcbn1cblxuLy8gUmVtb3ZlIEFuZ3VsYXIgZGVjb3JhdG9ycyBmcm9tYENsYXp6LmRlY29yYXRvcnMgPSBbLi4uXTtgLCBvciBleHByZXNzaW9uIGl0c2VsZiBpZiBhbGwgYXJlXG4vLyByZW1vdmVkLlxuZnVuY3Rpb24gcGlja0RlY29yYXRpb25Ob2Rlc1RvUmVtb3ZlKFxuICBleHByU3RtdDogdHMuRXhwcmVzc2lvblN0YXRlbWVudCxcbiAgbmdNZXRhZGF0YTogdHMuTm9kZVtdLFxuICBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbik6IHRzLk5vZGVbXSB7XG5cbiAgY29uc3QgZXhwciA9IGV4cGVjdDx0cy5CaW5hcnlFeHByZXNzaW9uPihleHByU3RtdC5leHByZXNzaW9uLCB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb24pO1xuICBjb25zdCBsaXRlcmFsID0gZXhwZWN0PHRzLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24+KGV4cHIucmlnaHQsXG4gICAgdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKTtcbiAgaWYgKCFsaXRlcmFsLmVsZW1lbnRzLmV2ZXJ5KChlbGVtKSA9PiBlbGVtLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGNvbnN0IGVsZW1lbnRzID0gbGl0ZXJhbC5lbGVtZW50cyBhcyB0cy5Ob2RlQXJyYXk8dHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24+O1xuICBjb25zdCBuZ0RlY29yYXRvcnMgPSBlbGVtZW50cy5maWx0ZXIoKGVsZW0pID0+IGlzQW5ndWxhckRlY29yYXRvcihlbGVtLCBuZ01ldGFkYXRhLCBjaGVja2VyKSk7XG5cbiAgcmV0dXJuIChlbGVtZW50cy5sZW5ndGggPiBuZ0RlY29yYXRvcnMubGVuZ3RoKSA/IG5nRGVjb3JhdG9ycyA6IFtleHByU3RtdF07XG59XG5cbi8vIFJlbW92ZSBBbmd1bGFyIGRlY29yYXRvcnMgZnJvbSBgQ2xhenogPSBfX2RlY29yYXRlKFsuLi5dLCBDbGF6eilgLCBvciBleHByZXNzaW9uIGl0c2VsZiBpZiBhbGxcbi8vIGFyZSByZW1vdmVkLlxuZnVuY3Rpb24gcGlja0RlY29yYXRlTm9kZXNUb1JlbW92ZShcbiAgZXhwclN0bXQ6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQsXG4gIHRzbGliSW1wb3J0czogdHMuTmFtZXNwYWNlSW1wb3J0W10sXG4gIG5nTWV0YWRhdGE6IHRzLk5vZGVbXSxcbiAgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4pOiB0cy5Ob2RlW10ge1xuXG4gIGNvbnN0IGV4cHIgPSBleHBlY3Q8dHMuQmluYXJ5RXhwcmVzc2lvbj4oZXhwclN0bXQuZXhwcmVzc2lvbiwgdHMuU3ludGF4S2luZC5CaW5hcnlFeHByZXNzaW9uKTtcbiAgY29uc3QgY2xhc3NJZCA9IGV4cGVjdDx0cy5JZGVudGlmaWVyPihleHByLmxlZnQsIHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcik7XG4gIGxldCBjYWxsRXhwcjogdHMuQ2FsbEV4cHJlc3Npb247XG5cbiAgaWYgKGV4cHIucmlnaHQua2luZCA9PT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbikge1xuICAgIGNhbGxFeHByID0gZXhwZWN0PHRzLkNhbGxFeHByZXNzaW9uPihleHByLnJpZ2h0LCB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmIChleHByLnJpZ2h0LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbikge1xuICAgIGNvbnN0IGlubmVyRXhwciA9IGV4cHIucmlnaHQgYXMgdHMuQmluYXJ5RXhwcmVzc2lvbjtcbiAgICBjYWxsRXhwciA9IGV4cGVjdDx0cy5DYWxsRXhwcmVzc2lvbj4oaW5uZXJFeHByLnJpZ2h0LCB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBhcnJMaXRlcmFsID0gZXhwZWN0PHRzLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24+KGNhbGxFeHByLmFyZ3VtZW50c1swXSxcbiAgICB0cy5TeW50YXhLaW5kLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24pO1xuXG4gIGlmICghYXJyTGl0ZXJhbC5lbGVtZW50cy5ldmVyeSgoZWxlbSkgPT4gZWxlbS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjb25zdCBlbGVtZW50cyA9IGFyckxpdGVyYWwuZWxlbWVudHMgYXMgdHMuTm9kZUFycmF5PHRzLkNhbGxFeHByZXNzaW9uPjtcbiAgY29uc3QgbmdEZWNvcmF0b3JDYWxscyA9IGVsZW1lbnRzLmZpbHRlcigoZWwpID0+IHtcbiAgICBpZiAoZWwuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBlbC5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXI7XG5cbiAgICByZXR1cm4gaWRlbnRpZmllcklzTWV0YWRhdGEoaWQsIG5nTWV0YWRhdGEsIGNoZWNrZXIpO1xuICB9KTtcblxuICAvLyBPbmx5IHJlbW92ZSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgbWV0YWRhdGEgb24gbm9uLXdoaXRlbGlzdGVkIGNsYXNzZXMuXG4gIGlmIChwbGF0Zm9ybVdoaXRlbGlzdC5pbmRleE9mKGNsYXNzSWQudGV4dCkgPT09IC0xKSB7XG4gICAgY29uc3QgbWV0YWRhdGFDYWxscyA9IGVsZW1lbnRzLmZpbHRlcigoZWwpID0+IHtcbiAgICAgIGlmICghaXNUc2xpYkhlbHBlcihlbCwgJ19fbWV0YWRhdGEnLCB0c2xpYkltcG9ydHMsIGNoZWNrZXIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChlbC5hcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoZWwuYXJndW1lbnRzWzBdLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zdCBtZXRhZGF0YVR5cGVJZCA9IGVsLmFyZ3VtZW50c1swXSBhcyB0cy5TdHJpbmdMaXRlcmFsO1xuICAgICAgaWYgKG1ldGFkYXRhVHlwZUlkLnRleHQgIT09ICdkZXNpZ246cGFyYW10eXBlcycpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICBuZ0RlY29yYXRvckNhbGxzLnB1c2goLi4ubWV0YWRhdGFDYWxscyk7XG4gIH1cblxuICAvLyBJZiBhbGwgZGVjb3JhdG9ycyBhcmUgbWV0YWRhdGEgZGVjb3JhdG9ycyB0aGVuIHJldHVybiB0aGUgd2hvbGUgYENsYXNzID0gX19kZWNvcmF0ZShbLi4uXSknYFxuICAvLyBzdGF0ZW1lbnQgc28gdGhhdCBpdCBpcyByZW1vdmVkIGluIGVudGlyZXR5XG4gIHJldHVybiAoZWxlbWVudHMubGVuZ3RoID09PSBuZ0RlY29yYXRvckNhbGxzLmxlbmd0aCkgPyBbZXhwclN0bXRdIDogbmdEZWNvcmF0b3JDYWxscztcbn1cblxuLy8gUmVtb3ZlIEFuZ3VsYXIgZGVjb3JhdG9ycyBmcm9tYENsYXp6LnByb3BEZWNvcmF0b3JzID0gWy4uLl07YCwgb3IgZXhwcmVzc2lvbiBpdHNlbGYgaWYgYWxsXG4vLyBhcmUgcmVtb3ZlZC5cbmZ1bmN0aW9uIHBpY2tQcm9wRGVjb3JhdGlvbk5vZGVzVG9SZW1vdmUoXG4gIGV4cHJTdG10OiB0cy5FeHByZXNzaW9uU3RhdGVtZW50LFxuICBuZ01ldGFkYXRhOiB0cy5Ob2RlW10sXG4gIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuKTogdHMuTm9kZVtdIHtcblxuICBjb25zdCBleHByID0gZXhwZWN0PHRzLkJpbmFyeUV4cHJlc3Npb24+KGV4cHJTdG10LmV4cHJlc3Npb24sIHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbik7XG4gIGNvbnN0IGxpdGVyYWwgPSBleHBlY3Q8dHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24+KGV4cHIucmlnaHQsXG4gICAgdHMuU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbik7XG4gIGlmICghbGl0ZXJhbC5wcm9wZXJ0aWVzLmV2ZXJ5KChlbGVtKSA9PiBlbGVtLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBc3NpZ25tZW50ICYmXG4gICAgKGVsZW0gYXMgdHMuUHJvcGVydHlBc3NpZ25tZW50KS5pbml0aWFsaXplci5raW5kID09PSB0cy5TeW50YXhLaW5kLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24pKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGNvbnN0IGFzc2lnbm1lbnRzID0gbGl0ZXJhbC5wcm9wZXJ0aWVzIGFzIHRzLk5vZGVBcnJheTx0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQ+O1xuICAvLyBDb25zaWRlciBlYWNoIGFzc2lnbm1lbnQgaW5kaXZpZHVhbGx5LiBFaXRoZXIgdGhlIHdob2xlIGFzc2lnbm1lbnQgd2lsbCBiZSByZW1vdmVkIG9yXG4gIC8vIGEgcGFydGljdWxhciBkZWNvcmF0b3Igd2l0aGluIHdpbGwuXG4gIGNvbnN0IHRvUmVtb3ZlID0gYXNzaWdubWVudHNcbiAgICAubWFwKChhc3NpZ24pID0+IHtcbiAgICAgIGNvbnN0IGRlY29yYXRvcnMgPVxuICAgICAgICBleHBlY3Q8dHMuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbj4oYXNzaWduLmluaXRpYWxpemVyLFxuICAgICAgICAgIHRzLlN5bnRheEtpbmQuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbikuZWxlbWVudHM7XG4gICAgICBpZiAoIWRlY29yYXRvcnMuZXZlcnkoKGVsKSA9PiBlbC5raW5kID09PSB0cy5TeW50YXhLaW5kLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBjb25zdCBkZWNzVG9SZW1vdmUgPSBkZWNvcmF0b3JzLmZpbHRlcigoZXhwcmVzc2lvbikgPT4ge1xuICAgICAgICBjb25zdCBsaXQgPSBleHBlY3Q8dHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24+KGV4cHJlc3Npb24sXG4gICAgICAgICAgdHMuU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbik7XG5cbiAgICAgICAgcmV0dXJuIGlzQW5ndWxhckRlY29yYXRvcihsaXQsIG5nTWV0YWRhdGEsIGNoZWNrZXIpO1xuICAgICAgfSk7XG4gICAgICBpZiAoZGVjc1RvUmVtb3ZlLmxlbmd0aCA9PT0gZGVjb3JhdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFthc3NpZ25dO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGVjc1RvUmVtb3ZlO1xuICAgIH0pXG4gICAgLnJlZHVjZSgoYWNjdW0sIHRvUm0pID0+IGFjY3VtLmNvbmNhdCh0b1JtKSwgW10gYXMgdHMuTm9kZVtdKTtcbiAgLy8gSWYgZXZlcnkgbm9kZSB0byBiZSByZW1vdmVkIGlzIGEgcHJvcGVydHkgYXNzaWdubWVudCAoZnVsbCBwcm9wZXJ0eSdzIGRlY29yYXRvcnMpIGFuZFxuICAvLyBhbGwgcHJvcGVydGllcyBhcmUgYWNjb3VudGVkIGZvciwgcmVtb3ZlIHRoZSB3aG9sZSBhc3NpZ25tZW50LiBPdGhlcndpc2UsIHJlbW92ZSB0aGVcbiAgLy8gbm9kZXMgd2hpY2ggd2VyZSBtYXJrZWQgYXMgc2FmZS5cbiAgaWYgKHRvUmVtb3ZlLmxlbmd0aCA9PT0gYXNzaWdubWVudHMubGVuZ3RoICYmXG4gICAgdG9SZW1vdmUuZXZlcnkoKG5vZGUpID0+IG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFzc2lnbm1lbnQpKSB7XG4gICAgcmV0dXJuIFtleHByU3RtdF07XG4gIH1cblxuICByZXR1cm4gdG9SZW1vdmU7XG59XG5cbmZ1bmN0aW9uIGlzQW5ndWxhckRlY29yYXRvcihcbiAgbGl0ZXJhbDogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24sXG4gIG5nTWV0YWRhdGE6IHRzLk5vZGVbXSxcbiAgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4pOiBib29sZWFuIHtcblxuICBjb25zdCB0eXBlcyA9IGxpdGVyYWwucHJvcGVydGllcy5maWx0ZXIoaXNUeXBlUHJvcGVydHkpO1xuICBpZiAodHlwZXMubGVuZ3RoICE9PSAxKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGFzc2lnbiA9IGV4cGVjdDx0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQ+KHR5cGVzWzBdLCB0cy5TeW50YXhLaW5kLlByb3BlcnR5QXNzaWdubWVudCk7XG4gIGlmIChhc3NpZ24uaW5pdGlhbGl6ZXIua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGlkID0gYXNzaWduLmluaXRpYWxpemVyIGFzIHRzLklkZW50aWZpZXI7XG4gIGNvbnN0IHJlcyA9IGlkZW50aWZpZXJJc01ldGFkYXRhKGlkLCBuZ01ldGFkYXRhLCBjaGVja2VyKTtcblxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBpc1R5cGVQcm9wZXJ0eShwcm9wOiB0cy5PYmplY3RMaXRlcmFsRWxlbWVudCk6IGJvb2xlYW4ge1xuICBpZiAocHJvcC5raW5kICE9PSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QXNzaWdubWVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBhc3NpZ25tZW50ID0gcHJvcCBhcyB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQ7XG4gIGlmIChhc3NpZ25tZW50Lm5hbWUua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IG5hbWUgPSBhc3NpZ25tZW50Lm5hbWUgYXMgdHMuSWRlbnRpZmllcjtcblxuICByZXR1cm4gbmFtZS50ZXh0ID09PSAndHlwZSc7XG59XG5cbi8vIENoZWNrIGlmIGFuIGlkZW50aWZpZXIgaXMgcGFydCBvZiB0aGUga25vd24gQW5ndWxhciBNZXRhZGF0YS5cbmZ1bmN0aW9uIGlkZW50aWZpZXJJc01ldGFkYXRhKFxuICBpZDogdHMuSWRlbnRpZmllcixcbiAgbWV0YWRhdGE6IHRzLk5vZGVbXSxcbiAgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4pOiBib29sZWFuIHtcbiAgY29uc3Qgc3ltYm9sID0gY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKGlkKTtcbiAgaWYgKCFzeW1ib2wgfHwgIXN5bWJvbC5kZWNsYXJhdGlvbnMgfHwgIXN5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHN5bWJvbFxuICAgIC5kZWNsYXJhdGlvbnNcbiAgICAuc29tZSgoc3BlYykgPT4gbWV0YWRhdGEuaW5kZXhPZihzcGVjKSAhPT0gLTEpO1xufVxuXG4vLyBDaGVjayBpZiBhbiBpbXBvcnQgaXMgYSB0c2xpYiBoZWxwZXIgaW1wb3J0IChgaW1wb3J0ICogYXMgdHNsaWIgZnJvbSBcInRzbGliXCI7YClcbmZ1bmN0aW9uIGlzVHNsaWJJbXBvcnQobm9kZTogdHMuSW1wb3J0RGVjbGFyYXRpb24pOiBib29sZWFuIHtcbiAgcmV0dXJuICEhKG5vZGUubW9kdWxlU3BlY2lmaWVyICYmXG4gICAgbm9kZS5tb2R1bGVTcGVjaWZpZXIua2luZCA9PT0gdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsICYmXG4gICAgKG5vZGUubW9kdWxlU3BlY2lmaWVyIGFzIHRzLlN0cmluZ0xpdGVyYWwpLnRleHQgPT09ICd0c2xpYicgJiZcbiAgICBub2RlLmltcG9ydENsYXVzZSAmJlxuICAgIG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MgJiZcbiAgICBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTmFtZXNwYWNlSW1wb3J0KTtcbn1cblxuLy8gRmluZCBhbGwgbmFtZXNwYWNlIGltcG9ydHMgZm9yIGB0c2xpYmAuXG5mdW5jdGlvbiBmaW5kVHNsaWJJbXBvcnRzKG5vZGU6IHRzLk5vZGUpOiB0cy5OYW1lc3BhY2VJbXBvcnRbXSB7XG4gIGNvbnN0IGltcG9ydHM6IHRzLk5hbWVzcGFjZUltcG9ydFtdID0gW107XG4gIHRzLmZvckVhY2hDaGlsZChub2RlLCAoY2hpbGQpID0+IHtcbiAgICBpZiAoY2hpbGQua2luZCA9PT0gdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbikge1xuICAgICAgY29uc3QgaW1wb3J0RGVjbCA9IGNoaWxkIGFzIHRzLkltcG9ydERlY2xhcmF0aW9uO1xuICAgICAgaWYgKGlzVHNsaWJJbXBvcnQoaW1wb3J0RGVjbCkpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0Q2xhdXNlID0gaW1wb3J0RGVjbC5pbXBvcnRDbGF1c2UgYXMgdHMuSW1wb3J0Q2xhdXNlO1xuICAgICAgICBjb25zdCBuYW1lc3BhY2VJbXBvcnQgPSBpbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncyBhcyB0cy5OYW1lc3BhY2VJbXBvcnQ7XG4gICAgICAgIGltcG9ydHMucHVzaChuYW1lc3BhY2VJbXBvcnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGltcG9ydHM7XG59XG5cbi8vIENoZWNrIGlmIGFuIGlkZW50aWZpZXIgaXMgcGFydCBvZiB0aGUga25vd24gdHNsaWIgaWRlbnRpZmllcnMuXG5mdW5jdGlvbiBpZGVudGlmaWVySXNUc2xpYihcbiAgaWQ6IHRzLklkZW50aWZpZXIsXG4gIHRzbGliSW1wb3J0czogdHMuTmFtZXNwYWNlSW1wb3J0W10sXG4gIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHN5bWJvbCA9IGNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihpZCk7XG4gIGlmICghc3ltYm9sIHx8ICFzeW1ib2wuZGVjbGFyYXRpb25zIHx8ICFzeW1ib2wuZGVjbGFyYXRpb25zLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBzeW1ib2xcbiAgICAuZGVjbGFyYXRpb25zXG4gICAgLnNvbWUoKHNwZWMpID0+IHRzbGliSW1wb3J0cy5pbmRleE9mKHNwZWMgYXMgdHMuTmFtZXNwYWNlSW1wb3J0KSAhPT0gLTEpO1xufVxuXG4vLyBDaGVjayBpZiBhIGZ1bmN0aW9uIGNhbGwgaXMgYSB0c2xpYiBoZWxwZXIuXG5mdW5jdGlvbiBpc1RzbGliSGVscGVyKFxuICBjYWxsRXhwcjogdHMuQ2FsbEV4cHJlc3Npb24sXG4gIGhlbHBlcjogc3RyaW5nLFxuICB0c2xpYkltcG9ydHM6IHRzLk5hbWVzcGFjZUltcG9ydFtdLFxuICBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbikge1xuXG4gIGxldCBjYWxsRXhwcklkZW50ID0gY2FsbEV4cHIuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyO1xuXG4gIGlmIChjYWxsRXhwci5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgIGlmIChjYWxsRXhwci5leHByZXNzaW9uLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgICBjb25zdCBwcm9wQWNjZXNzID0gY2FsbEV4cHIuZXhwcmVzc2lvbiBhcyB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG4gICAgICBjb25zdCBsZWZ0ID0gcHJvcEFjY2Vzcy5leHByZXNzaW9uO1xuICAgICAgY2FsbEV4cHJJZGVudCA9IHByb3BBY2Nlc3MubmFtZTtcblxuICAgICAgaWYgKGxlZnQua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaWQgPSBsZWZ0IGFzIHRzLklkZW50aWZpZXI7XG5cbiAgICAgIGlmICghaWRlbnRpZmllcklzVHNsaWIoaWQsIHRzbGliSW1wb3J0cywgY2hlY2tlcikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBub2RlLnRleHQgb24gYSBuYW1lIHRoYXQgc3RhcnRzIHdpdGggdHdvIHVuZGVyc2NvcmVzIHdpbGwgcmV0dXJuIHRocmVlIGluc3RlYWQuXG4gIC8vIFVubGVzcyBpdCdzIGFuIGV4cHJlc3Npb24gbGlrZSB0c2xpYi5fX2RlY29yYXRlLCBpbiB3aGljaCBjYXNlIGl0J3Mgb25seSAyLlxuICBpZiAoY2FsbEV4cHJJZGVudC50ZXh0ICE9PSBgXyR7aGVscGVyfWAgJiYgY2FsbEV4cHJJZGVudC50ZXh0ICE9PSBoZWxwZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==