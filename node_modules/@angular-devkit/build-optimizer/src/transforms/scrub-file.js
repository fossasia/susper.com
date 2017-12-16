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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NydWItZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvc2NydWItZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUNqQyxvREFBd0Q7QUFHeEQsdUJBQThCLE9BQWU7SUFDM0MsTUFBTSxPQUFPLEdBQUc7UUFDZCxZQUFZO1FBQ1osWUFBWTtRQUNaLGdCQUFnQjtRQUNoQixnQkFBZ0I7S0FDakIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQVRELHNDQVNDO0FBRUQsNENBQTRDO0FBQzVDLE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsY0FBYztJQUNkLHFCQUFxQjtJQUNyQixTQUFTO0lBQ1QseUJBQXlCO0NBQzFCLENBQUM7QUFFRixNQUFNLGlCQUFpQixHQUFHO0lBQ3hCLDBCQUEwQjtJQUMxQixXQUFXO0lBQ1gsV0FBVztJQUNYLFlBQVk7SUFDWixVQUFVO0lBQ1YsTUFBTTtJQUVOLDZCQUE2QjtJQUM3QixjQUFjO0lBQ2QsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixjQUFjO0lBQ2QsT0FBTztJQUNQLFFBQVE7SUFDUixXQUFXO0lBQ1gsY0FBYztDQUNmLENBQUM7QUFFRixpQ0FBd0MsT0FBbUI7SUFDekQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRXpDLE1BQU0sQ0FBQyxDQUFDLE9BQWlDLEVBQWlDLEVBQUU7UUFFMUUsTUFBTSxXQUFXLEdBQWtDLENBQUMsRUFBaUIsRUFBRSxFQUFFO1lBRXZF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QUFLLENBQUM7SUFDZixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7IGNvbGxlY3REZWVwTm9kZXMgfSBmcm9tICcuLi9oZWxwZXJzL2FzdC11dGlscyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RTY3J1YkZpbGUoY29udGVudDogc3RyaW5nKSB7XG4gIGNvbnN0IG1hcmtlcnMgPSBbXG4gICAgJ2RlY29yYXRvcnMnLFxuICAgICdfX2RlY29yYXRlJyxcbiAgICAncHJvcERlY29yYXRvcnMnLFxuICAgICdjdG9yUGFyYW1ldGVycycsXG4gIF07XG5cbiAgcmV0dXJuIG1hcmtlcnMuc29tZSgobWFya2VyKSA9PiBjb250ZW50LmluZGV4T2YobWFya2VyKSAhPT0gLTEpO1xufVxuXG4vLyBEb24ndCByZW1vdmUgYGN0b3JQYXJhbWV0ZXJzYCBmcm9tIHRoZXNlLlxuY29uc3QgcGxhdGZvcm1XaGl0ZWxpc3QgPSBbXG4gICdQbGF0Zm9ybVJlZl8nLFxuICAnVGVzdGFiaWxpdHlSZWdpc3RyeScsXG4gICdDb25zb2xlJyxcbiAgJ0Jyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uJyxcbl07XG5cbmNvbnN0IGFuZ3VsYXJTcGVjaWZpZXJzID0gW1xuICAvLyBDbGFzcyBsZXZlbCBkZWNvcmF0b3JzLlxuICAnQ29tcG9uZW50JyxcbiAgJ0RpcmVjdGl2ZScsXG4gICdJbmplY3RhYmxlJyxcbiAgJ05nTW9kdWxlJyxcbiAgJ1BpcGUnLFxuXG4gIC8vIFByb3BlcnR5IGxldmVsIGRlY29yYXRvcnMuXG4gICdDb250ZW50Q2hpbGQnLFxuICAnQ29udGVudENoaWxkcmVuJyxcbiAgJ0hvc3RCaW5kaW5nJyxcbiAgJ0hvc3RMaXN0ZW5lcicsXG4gICdJbnB1dCcsXG4gICdPdXRwdXQnLFxuICAnVmlld0NoaWxkJyxcbiAgJ1ZpZXdDaGlsZHJlbicsXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2NydWJGaWxlVHJhbnNmb3JtZXIocHJvZ3JhbTogdHMuUHJvZ3JhbSk6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gIGNvbnN0IGNoZWNrZXIgPSBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCk7XG5cbiAgcmV0dXJuIChjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpOiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiA9PiB7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm1lcjogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPSAoc2Y6IHRzLlNvdXJjZUZpbGUpID0+IHtcblxuICAgICAgY29uc3QgbmdNZXRhZGF0YSA9IGZpbmRBbmd1bGFyTWV0YWRhdGEoc2YpO1xuICAgICAgY29uc3QgdHNsaWJJbXBvcnRzID0gZmluZFRzbGliSW1wb3J0cyhzZik7XG5cbiAgICAgIGNvbnN0IG5vZGVzOiB0cy5Ob2RlW10gPSBbXTtcbiAgICAgIHRzLmZvckVhY2hDaGlsZChzZiwgY2hlY2tOb2RlRm9yRGVjb3JhdG9ycyk7XG5cbiAgICAgIGZ1bmN0aW9uIGNoZWNrTm9kZUZvckRlY29yYXRvcnMobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgICAgICBpZiAobm9kZS5raW5kICE9PSB0cy5TeW50YXhLaW5kLkV4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICAgICAgICAvLyBUUyAyLjQgbmVzdHMgZGVjb3JhdG9ycyBpbnNpZGUgZG93bmxldmVsZWQgY2xhc3MgSUlGRXMsIHNvIHdlXG4gICAgICAgICAgLy8gbXVzdCByZWN1cnNlIGludG8gdGhlbSB0byBmaW5kIHRoZSByZWxldmFudCBleHByZXNzaW9uIHN0YXRlbWVudHMuXG4gICAgICAgICAgcmV0dXJuIHRzLmZvckVhY2hDaGlsZChub2RlLCBjaGVja05vZGVGb3JEZWNvcmF0b3JzKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBleHByU3RtdCA9IG5vZGUgYXMgdHMuRXhwcmVzc2lvblN0YXRlbWVudDtcbiAgICAgICAgaWYgKGlzRGVjb3JhdG9yQXNzaWdubWVudEV4cHJlc3Npb24oZXhwclN0bXQpKSB7XG4gICAgICAgICAgbm9kZXMucHVzaCguLi5waWNrRGVjb3JhdGlvbk5vZGVzVG9SZW1vdmUoZXhwclN0bXQsIG5nTWV0YWRhdGEsIGNoZWNrZXIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNEZWNvcmF0ZUFzc2lnbm1lbnRFeHByZXNzaW9uKGV4cHJTdG10LCB0c2xpYkltcG9ydHMsIGNoZWNrZXIpKSB7XG4gICAgICAgICAgbm9kZXMucHVzaCguLi5waWNrRGVjb3JhdGVOb2Rlc1RvUmVtb3ZlKGV4cHJTdG10LCB0c2xpYkltcG9ydHMsIG5nTWV0YWRhdGEsIGNoZWNrZXIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBbmd1bGFyRGVjb3JhdG9yTWV0YWRhdGFFeHByZXNzaW9uKGV4cHJTdG10LCBuZ01ldGFkYXRhLCB0c2xpYkltcG9ydHMsIGNoZWNrZXIpKSB7XG4gICAgICAgICAgbm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcm9wRGVjb3JhdG9yQXNzaWdubWVudEV4cHJlc3Npb24oZXhwclN0bXQpKSB7XG4gICAgICAgICAgbm9kZXMucHVzaCguLi5waWNrUHJvcERlY29yYXRpb25Ob2Rlc1RvUmVtb3ZlKGV4cHJTdG10LCBuZ01ldGFkYXRhLCBjaGVja2VyKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ3RvclBhcmFtc0Fzc2lnbm1lbnRFeHByZXNzaW9uKGV4cHJTdG10KVxuICAgICAgICAgICYmICFpc0N0b3JQYXJhbXNXaGl0ZWxpc3RlZFNlcnZpY2UoZXhwclN0bXQpKSB7XG4gICAgICAgICAgbm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2aXNpdG9yOiB0cy5WaXNpdG9yID0gKG5vZGU6IHRzLk5vZGUpOiB0cy5WaXNpdFJlc3VsdDx0cy5Ob2RlPiA9PiB7XG4gICAgICAgIC8vIENoZWNrIGlmIG5vZGUgaXMgYSBzdGF0ZW1lbnQgdG8gYmUgZHJvcHBlZC5cbiAgICAgICAgaWYgKG5vZGVzLmZpbmQoKG4pID0+IG4gPT09IG5vZGUpKSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSByZXR1cm4gbm9kZSBhcyBpcy5cbiAgICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHRzLnZpc2l0Tm9kZShzZiwgdmlzaXRvcik7XG4gICAgfTtcblxuICAgIHJldHVybiB0cmFuc2Zvcm1lcjtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cGVjdDxUIGV4dGVuZHMgdHMuTm9kZT4obm9kZTogdHMuTm9kZSwga2luZDogdHMuU3ludGF4S2luZCk6IFQge1xuICBpZiAobm9kZS5raW5kICE9PSBraW5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG5vZGUgdHlwZS4nKTtcbiAgfVxuXG4gIHJldHVybiBub2RlIGFzIFQ7XG59XG5cbmZ1bmN0aW9uIG5hbWVPZlNwZWNpZmllcihub2RlOiB0cy5JbXBvcnRTcGVjaWZpZXIpOiBzdHJpbmcge1xuICByZXR1cm4gbm9kZS5uYW1lICYmIG5vZGUubmFtZS50ZXh0IHx8ICc8dW5rbm93bj4nO1xufVxuXG5mdW5jdGlvbiBmaW5kQW5ndWxhck1ldGFkYXRhKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlW10ge1xuICBsZXQgc3BlY3M6IHRzLk5vZGVbXSA9IFtdO1xuICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgaWYgKGNoaWxkLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb24pIHtcbiAgICAgIGNvbnN0IGltcG9ydERlY2wgPSBjaGlsZCBhcyB0cy5JbXBvcnREZWNsYXJhdGlvbjtcbiAgICAgIGlmIChpc0FuZ3VsYXJDb3JlSW1wb3J0KGltcG9ydERlY2wpKSB7XG4gICAgICAgIHNwZWNzLnB1c2goLi4uY29sbGVjdERlZXBOb2Rlczx0cy5JbXBvcnRTcGVjaWZpZXI+KG5vZGUsIHRzLlN5bnRheEtpbmQuSW1wb3J0U3BlY2lmaWVyKVxuICAgICAgICAgIC5maWx0ZXIoKHNwZWMpID0+IGlzQW5ndWxhckNvcmVTcGVjaWZpZXIoc3BlYykpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGxvY2FsRGVjbCA9IGZpbmRBbGxEZWNsYXJhdGlvbnMobm9kZSlcbiAgICAuZmlsdGVyKChkZWNsKSA9PiBhbmd1bGFyU3BlY2lmaWVycy5pbmRleE9mKChkZWNsLm5hbWUgYXMgdHMuSWRlbnRpZmllcikudGV4dCkgIT09IC0xKTtcbiAgaWYgKGxvY2FsRGVjbC5sZW5ndGggPT09IGFuZ3VsYXJTcGVjaWZpZXJzLmxlbmd0aCkge1xuICAgIHNwZWNzID0gc3BlY3MuY29uY2F0KGxvY2FsRGVjbCk7XG4gIH1cblxuICByZXR1cm4gc3BlY3M7XG59XG5cbmZ1bmN0aW9uIGZpbmRBbGxEZWNsYXJhdGlvbnMobm9kZTogdHMuTm9kZSk6IHRzLlZhcmlhYmxlRGVjbGFyYXRpb25bXSB7XG4gIGNvbnN0IG5vZGVzOiB0cy5WYXJpYWJsZURlY2xhcmF0aW9uW10gPSBbXTtcbiAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIChjaGlsZCkgPT4ge1xuICAgIGlmIChjaGlsZC5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgICBjb25zdCB2U3RtdCA9IGNoaWxkIGFzIHRzLlZhcmlhYmxlU3RhdGVtZW50O1xuICAgICAgdlN0bXQuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5mb3JFYWNoKChkZWNsKSA9PiB7XG4gICAgICAgIGlmIChkZWNsLm5hbWUua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5vZGVzLnB1c2goZGVjbCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBub2Rlcztcbn1cblxuZnVuY3Rpb24gaXNBbmd1bGFyQ29yZUltcG9ydChub2RlOiB0cy5JbXBvcnREZWNsYXJhdGlvbik6IGJvb2xlYW4ge1xuICByZXR1cm4gdHJ1ZSAmJlxuICAgIG5vZGUubW9kdWxlU3BlY2lmaWVyICYmXG4gICAgbm9kZS5tb2R1bGVTcGVjaWZpZXIua2luZCA9PT0gdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsICYmXG4gICAgKG5vZGUubW9kdWxlU3BlY2lmaWVyIGFzIHRzLlN0cmluZ0xpdGVyYWwpLnRleHQgPT09ICdAYW5ndWxhci9jb3JlJztcbn1cblxuZnVuY3Rpb24gaXNBbmd1bGFyQ29yZVNwZWNpZmllcihub2RlOiB0cy5JbXBvcnRTcGVjaWZpZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGFuZ3VsYXJTcGVjaWZpZXJzLmluZGV4T2YobmFtZU9mU3BlY2lmaWVyKG5vZGUpKSAhPT0gLTE7XG59XG5cbi8vIENoZWNrIGlmIGFzc2lnbm1lbnQgaXMgYENsYXp6LmRlY29yYXRvcnMgPSBbLi4uXTtgLlxuZnVuY3Rpb24gaXNEZWNvcmF0b3JBc3NpZ25tZW50RXhwcmVzc2lvbihleHByU3RtdDogdHMuRXhwcmVzc2lvblN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICBpZiAoZXhwclN0bXQuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgZXhwciA9IGV4cHJTdG10LmV4cHJlc3Npb24gYXMgdHMuQmluYXJ5RXhwcmVzc2lvbjtcbiAgaWYgKGV4cHIubGVmdC5raW5kICE9PSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBwcm9wQWNjZXNzID0gZXhwci5sZWZ0IGFzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjtcbiAgaWYgKHByb3BBY2Nlc3MuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHByb3BBY2Nlc3MubmFtZS50ZXh0ICE9PSAnZGVjb3JhdG9ycycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGV4cHIub3BlcmF0b3JUb2tlbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLkZpcnN0QXNzaWdubWVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZXhwci5yaWdodC5raW5kICE9PSB0cy5TeW50YXhLaW5kLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gQ2hlY2sgaWYgYXNzaWdubWVudCBpcyBgQ2xhenogPSBfX2RlY29yYXRlKFsuLi5dLCBDbGF6eilgLlxuZnVuY3Rpb24gaXNEZWNvcmF0ZUFzc2lnbm1lbnRFeHByZXNzaW9uKFxuICBleHByU3RtdDogdHMuRXhwcmVzc2lvblN0YXRlbWVudCxcbiAgdHNsaWJJbXBvcnRzOiB0cy5OYW1lc3BhY2VJbXBvcnRbXSxcbiAgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4pOiBib29sZWFuIHtcblxuICBpZiAoZXhwclN0bXQuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgZXhwciA9IGV4cHJTdG10LmV4cHJlc3Npb24gYXMgdHMuQmluYXJ5RXhwcmVzc2lvbjtcbiAgaWYgKGV4cHIubGVmdC5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgY2xhc3NJZGVudCA9IGV4cHIubGVmdCBhcyB0cy5JZGVudGlmaWVyO1xuICBsZXQgY2FsbEV4cHI6IHRzLkNhbGxFeHByZXNzaW9uO1xuXG4gIGlmIChleHByLnJpZ2h0LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24pIHtcbiAgICBjYWxsRXhwciA9IGV4cHIucmlnaHQgYXMgdHMuQ2FsbEV4cHJlc3Npb247XG4gIH0gZWxzZSBpZiAoZXhwci5yaWdodC5raW5kID09PSB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb24pIHtcbiAgICAvLyBgQ2xhenogPSBDbGF6el8xID0gX19kZWNvcmF0ZShbLi4uXSwgQ2xhenopYCBjYW4gYmUgZm91bmQgd2hlbiB0aGVyZSBhcmUgc3RhdGljIHByb3BlcnR5XG4gICAgLy8gYWNjZXNzZXMuXG4gICAgY29uc3QgaW5uZXJFeHByID0gZXhwci5yaWdodCBhcyB0cy5CaW5hcnlFeHByZXNzaW9uO1xuICAgIGlmIChpbm5lckV4cHIubGVmdC5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXJcbiAgICAgIHx8IGlubmVyRXhwci5yaWdodC5raW5kICE9PSB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNhbGxFeHByID0gaW5uZXJFeHByLnJpZ2h0IGFzIHRzLkNhbGxFeHByZXNzaW9uO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghaXNUc2xpYkhlbHBlcihjYWxsRXhwciwgJ19fZGVjb3JhdGUnLCB0c2xpYkltcG9ydHMsIGNoZWNrZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGNhbGxFeHByLmFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGNhbGxFeHByLmFyZ3VtZW50c1sxXS5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgY2xhc3NBcmcgPSBjYWxsRXhwci5hcmd1bWVudHNbMV0gYXMgdHMuSWRlbnRpZmllcjtcbiAgaWYgKGNsYXNzSWRlbnQudGV4dCAhPT0gY2xhc3NBcmcudGV4dCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoY2FsbEV4cHIuYXJndW1lbnRzWzBdLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBDaGVjayBpZiBleHByZXNzaW9uIGlzIGBfX2RlY29yYXRlKFtzbXQsIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXSwgLi4uKWAuXG5mdW5jdGlvbiBpc0FuZ3VsYXJEZWNvcmF0b3JNZXRhZGF0YUV4cHJlc3Npb24oXG4gIGV4cHJTdG10OiB0cy5FeHByZXNzaW9uU3RhdGVtZW50LFxuICBuZ01ldGFkYXRhOiB0cy5Ob2RlW10sXG4gIHRzbGliSW1wb3J0czogdHMuTmFtZXNwYWNlSW1wb3J0W10sXG4gIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuKTogYm9vbGVhbiB7XG5cbiAgaWYgKGV4cHJTdG10LmV4cHJlc3Npb24ua2luZCAhPT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBjYWxsRXhwciA9IGV4cHJTdG10LmV4cHJlc3Npb24gYXMgdHMuQ2FsbEV4cHJlc3Npb247XG4gIGlmICghaXNUc2xpYkhlbHBlcihjYWxsRXhwciwgJ19fZGVjb3JhdGUnLCB0c2xpYkltcG9ydHMsIGNoZWNrZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChjYWxsRXhwci5hcmd1bWVudHMubGVuZ3RoICE9PSA0KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChjYWxsRXhwci5hcmd1bWVudHNbMF0ua2luZCAhPT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGRlY29yYXRlQXJyYXkgPSBjYWxsRXhwci5hcmd1bWVudHNbMF0gYXMgdHMuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbjtcbiAgLy8gQ2hlY2sgZmlyc3QgYXJyYXkgZW50cnkgZm9yIEFuZ3VsYXIgZGVjb3JhdG9ycy5cbiAgaWYgKGRlY29yYXRlQXJyYXkuZWxlbWVudHNbMF0ua2luZCAhPT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBkZWNvcmF0b3JDYWxsID0gZGVjb3JhdGVBcnJheS5lbGVtZW50c1swXSBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcbiAgaWYgKGRlY29yYXRvckNhbGwuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgZGVjb3JhdG9ySWQgPSBkZWNvcmF0b3JDYWxsLmV4cHJlc3Npb24gYXMgdHMuSWRlbnRpZmllcjtcbiAgaWYgKCFpZGVudGlmaWVySXNNZXRhZGF0YShkZWNvcmF0b3JJZCwgbmdNZXRhZGF0YSwgY2hlY2tlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQ2hlY2sgc2Vjb25kIGFycmF5IGVudHJ5IGZvciBfX21ldGFkYXRhIGNhbGwuXG4gIGlmIChkZWNvcmF0ZUFycmF5LmVsZW1lbnRzWzFdLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgbWV0YWRhdGFDYWxsID0gZGVjb3JhdGVBcnJheS5lbGVtZW50c1sxXSBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcbiAgaWYgKCFpc1RzbGliSGVscGVyKG1ldGFkYXRhQ2FsbCwgJ19fbWV0YWRhdGEnLCB0c2xpYkltcG9ydHMsIGNoZWNrZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIENoZWNrIGlmIGFzc2lnbm1lbnQgaXMgYENsYXp6LnByb3BEZWNvcmF0b3JzID0gWy4uLl07YC5cbmZ1bmN0aW9uIGlzUHJvcERlY29yYXRvckFzc2lnbm1lbnRFeHByZXNzaW9uKGV4cHJTdG10OiB0cy5FeHByZXNzaW9uU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gIGlmIChleHByU3RtdC5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBleHByID0gZXhwclN0bXQuZXhwcmVzc2lvbiBhcyB0cy5CaW5hcnlFeHByZXNzaW9uO1xuICBpZiAoZXhwci5sZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHByb3BBY2Nlc3MgPSBleHByLmxlZnQgYXMgdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uO1xuICBpZiAocHJvcEFjY2Vzcy5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAocHJvcEFjY2Vzcy5uYW1lLnRleHQgIT09ICdwcm9wRGVjb3JhdG9ycycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGV4cHIub3BlcmF0b3JUb2tlbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLkZpcnN0QXNzaWdubWVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZXhwci5yaWdodC5raW5kICE9PSB0cy5TeW50YXhLaW5kLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIENoZWNrIGlmIGFzc2lnbm1lbnQgaXMgYENsYXp6LmN0b3JQYXJhbWV0ZXJzID0gWy4uLl07YC5cbmZ1bmN0aW9uIGlzQ3RvclBhcmFtc0Fzc2lnbm1lbnRFeHByZXNzaW9uKGV4cHJTdG10OiB0cy5FeHByZXNzaW9uU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gIGlmIChleHByU3RtdC5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBleHByID0gZXhwclN0bXQuZXhwcmVzc2lvbiBhcyB0cy5CaW5hcnlFeHByZXNzaW9uO1xuICBpZiAoZXhwci5sZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHByb3BBY2Nlc3MgPSBleHByLmxlZnQgYXMgdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uO1xuICBpZiAocHJvcEFjY2Vzcy5uYW1lLnRleHQgIT09ICdjdG9yUGFyYW1ldGVycycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHByb3BBY2Nlc3MuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGV4cHIub3BlcmF0b3JUb2tlbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLkZpcnN0QXNzaWdubWVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZXhwci5yaWdodC5raW5kICE9PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRXhwcmVzc2lvblxuICAgICYmIGV4cHIucmlnaHQua2luZCAhPT0gdHMuU3ludGF4S2luZC5BcnJvd0Z1bmN0aW9uXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc0N0b3JQYXJhbXNXaGl0ZWxpc3RlZFNlcnZpY2UoZXhwclN0bXQ6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgY29uc3QgZXhwciA9IGV4cHJTdG10LmV4cHJlc3Npb24gYXMgdHMuQmluYXJ5RXhwcmVzc2lvbjtcbiAgY29uc3QgcHJvcEFjY2VzcyA9IGV4cHIubGVmdCBhcyB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG4gIGNvbnN0IHNlcnZpY2VJZCA9IHByb3BBY2Nlc3MuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyO1xuXG4gIHJldHVybiBwbGF0Zm9ybVdoaXRlbGlzdC5pbmRleE9mKHNlcnZpY2VJZC50ZXh0KSAhPT0gLTE7XG59XG5cbi8vIFJlbW92ZSBBbmd1bGFyIGRlY29yYXRvcnMgZnJvbWBDbGF6ei5kZWNvcmF0b3JzID0gWy4uLl07YCwgb3IgZXhwcmVzc2lvbiBpdHNlbGYgaWYgYWxsIGFyZVxuLy8gcmVtb3ZlZC5cbmZ1bmN0aW9uIHBpY2tEZWNvcmF0aW9uTm9kZXNUb1JlbW92ZShcbiAgZXhwclN0bXQ6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQsXG4gIG5nTWV0YWRhdGE6IHRzLk5vZGVbXSxcbiAgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4pOiB0cy5Ob2RlW10ge1xuXG4gIGNvbnN0IGV4cHIgPSBleHBlY3Q8dHMuQmluYXJ5RXhwcmVzc2lvbj4oZXhwclN0bXQuZXhwcmVzc2lvbiwgdHMuU3ludGF4S2luZC5CaW5hcnlFeHByZXNzaW9uKTtcbiAgY29uc3QgbGl0ZXJhbCA9IGV4cGVjdDx0cy5BcnJheUxpdGVyYWxFeHByZXNzaW9uPihleHByLnJpZ2h0LFxuICAgIHRzLlN5bnRheEtpbmQuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbik7XG4gIGlmICghbGl0ZXJhbC5lbGVtZW50cy5ldmVyeSgoZWxlbSkgPT4gZWxlbS5raW5kID09PSB0cy5TeW50YXhLaW5kLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjb25zdCBlbGVtZW50cyA9IGxpdGVyYWwuZWxlbWVudHMgYXMgdHMuTm9kZUFycmF5PHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uPjtcbiAgY29uc3QgbmdEZWNvcmF0b3JzID0gZWxlbWVudHMuZmlsdGVyKChlbGVtKSA9PiBpc0FuZ3VsYXJEZWNvcmF0b3IoZWxlbSwgbmdNZXRhZGF0YSwgY2hlY2tlcikpO1xuXG4gIHJldHVybiAoZWxlbWVudHMubGVuZ3RoID4gbmdEZWNvcmF0b3JzLmxlbmd0aCkgPyBuZ0RlY29yYXRvcnMgOiBbZXhwclN0bXRdO1xufVxuXG4vLyBSZW1vdmUgQW5ndWxhciBkZWNvcmF0b3JzIGZyb20gYENsYXp6ID0gX19kZWNvcmF0ZShbLi4uXSwgQ2xhenopYCwgb3IgZXhwcmVzc2lvbiBpdHNlbGYgaWYgYWxsXG4vLyBhcmUgcmVtb3ZlZC5cbmZ1bmN0aW9uIHBpY2tEZWNvcmF0ZU5vZGVzVG9SZW1vdmUoXG4gIGV4cHJTdG10OiB0cy5FeHByZXNzaW9uU3RhdGVtZW50LFxuICB0c2xpYkltcG9ydHM6IHRzLk5hbWVzcGFjZUltcG9ydFtdLFxuICBuZ01ldGFkYXRhOiB0cy5Ob2RlW10sXG4gIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuKTogdHMuTm9kZVtdIHtcblxuICBjb25zdCBleHByID0gZXhwZWN0PHRzLkJpbmFyeUV4cHJlc3Npb24+KGV4cHJTdG10LmV4cHJlc3Npb24sIHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbik7XG4gIGNvbnN0IGNsYXNzSWQgPSBleHBlY3Q8dHMuSWRlbnRpZmllcj4oZXhwci5sZWZ0LCB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpO1xuICBsZXQgY2FsbEV4cHI6IHRzLkNhbGxFeHByZXNzaW9uO1xuXG4gIGlmIChleHByLnJpZ2h0LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24pIHtcbiAgICBjYWxsRXhwciA9IGV4cGVjdDx0cy5DYWxsRXhwcmVzc2lvbj4oZXhwci5yaWdodCwgdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbik7XG4gIH0gZWxzZSBpZiAoZXhwci5yaWdodC5raW5kID09PSB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb24pIHtcbiAgICBjb25zdCBpbm5lckV4cHIgPSBleHByLnJpZ2h0IGFzIHRzLkJpbmFyeUV4cHJlc3Npb247XG4gICAgY2FsbEV4cHIgPSBleHBlY3Q8dHMuQ2FsbEV4cHJlc3Npb24+KGlubmVyRXhwci5yaWdodCwgdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgYXJyTGl0ZXJhbCA9IGV4cGVjdDx0cy5BcnJheUxpdGVyYWxFeHByZXNzaW9uPihjYWxsRXhwci5hcmd1bWVudHNbMF0sXG4gICAgdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKTtcblxuICBpZiAoIWFyckxpdGVyYWwuZWxlbWVudHMuZXZlcnkoKGVsZW0pID0+IGVsZW0ua2luZCA9PT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbikpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY29uc3QgZWxlbWVudHMgPSBhcnJMaXRlcmFsLmVsZW1lbnRzIGFzIHRzLk5vZGVBcnJheTx0cy5DYWxsRXhwcmVzc2lvbj47XG4gIGNvbnN0IG5nRGVjb3JhdG9yQ2FsbHMgPSBlbGVtZW50cy5maWx0ZXIoKGVsKSA9PiB7XG4gICAgaWYgKGVsLmV4cHJlc3Npb24ua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gZWwuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyO1xuXG4gICAgcmV0dXJuIGlkZW50aWZpZXJJc01ldGFkYXRhKGlkLCBuZ01ldGFkYXRhLCBjaGVja2VyKTtcbiAgfSk7XG5cbiAgLy8gT25seSByZW1vdmUgY29uc3RydWN0b3IgcGFyYW1ldGVyIG1ldGFkYXRhIG9uIG5vbi13aGl0ZWxpc3RlZCBjbGFzc2VzLlxuICBpZiAocGxhdGZvcm1XaGl0ZWxpc3QuaW5kZXhPZihjbGFzc0lkLnRleHQpID09PSAtMSkge1xuICAgIGNvbnN0IG1ldGFkYXRhQ2FsbHMgPSBlbGVtZW50cy5maWx0ZXIoKGVsKSA9PiB7XG4gICAgICBpZiAoIWlzVHNsaWJIZWxwZXIoZWwsICdfX21ldGFkYXRhJywgdHNsaWJJbXBvcnRzLCBjaGVja2VyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoZWwuYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGVsLmFyZ3VtZW50c1swXS5raW5kICE9PSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3QgbWV0YWRhdGFUeXBlSWQgPSBlbC5hcmd1bWVudHNbMF0gYXMgdHMuU3RyaW5nTGl0ZXJhbDtcbiAgICAgIGlmIChtZXRhZGF0YVR5cGVJZC50ZXh0ICE9PSAnZGVzaWduOnBhcmFtdHlwZXMnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgbmdEZWNvcmF0b3JDYWxscy5wdXNoKC4uLm1ldGFkYXRhQ2FsbHMpO1xuICB9XG5cbiAgLy8gSWYgYWxsIGRlY29yYXRvcnMgYXJlIG1ldGFkYXRhIGRlY29yYXRvcnMgdGhlbiByZXR1cm4gdGhlIHdob2xlIGBDbGFzcyA9IF9fZGVjb3JhdGUoWy4uLl0pJ2BcbiAgLy8gc3RhdGVtZW50IHNvIHRoYXQgaXQgaXMgcmVtb3ZlZCBpbiBlbnRpcmV0eVxuICByZXR1cm4gKGVsZW1lbnRzLmxlbmd0aCA9PT0gbmdEZWNvcmF0b3JDYWxscy5sZW5ndGgpID8gW2V4cHJTdG10XSA6IG5nRGVjb3JhdG9yQ2FsbHM7XG59XG5cbi8vIFJlbW92ZSBBbmd1bGFyIGRlY29yYXRvcnMgZnJvbWBDbGF6ei5wcm9wRGVjb3JhdG9ycyA9IFsuLi5dO2AsIG9yIGV4cHJlc3Npb24gaXRzZWxmIGlmIGFsbFxuLy8gYXJlIHJlbW92ZWQuXG5mdW5jdGlvbiBwaWNrUHJvcERlY29yYXRpb25Ob2Rlc1RvUmVtb3ZlKFxuICBleHByU3RtdDogdHMuRXhwcmVzc2lvblN0YXRlbWVudCxcbiAgbmdNZXRhZGF0YTogdHMuTm9kZVtdLFxuICBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbik6IHRzLk5vZGVbXSB7XG5cbiAgY29uc3QgZXhwciA9IGV4cGVjdDx0cy5CaW5hcnlFeHByZXNzaW9uPihleHByU3RtdC5leHByZXNzaW9uLCB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb24pO1xuICBjb25zdCBsaXRlcmFsID0gZXhwZWN0PHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uPihleHByLnJpZ2h0LFxuICAgIHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pO1xuICBpZiAoIWxpdGVyYWwucHJvcGVydGllcy5ldmVyeSgoZWxlbSkgPT4gZWxlbS5raW5kID09PSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QXNzaWdubWVudCAmJlxuICAgIChlbGVtIGFzIHRzLlByb3BlcnR5QXNzaWdubWVudCkuaW5pdGlhbGl6ZXIua2luZCA9PT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjb25zdCBhc3NpZ25tZW50cyA9IGxpdGVyYWwucHJvcGVydGllcyBhcyB0cy5Ob2RlQXJyYXk8dHMuUHJvcGVydHlBc3NpZ25tZW50PjtcbiAgLy8gQ29uc2lkZXIgZWFjaCBhc3NpZ25tZW50IGluZGl2aWR1YWxseS4gRWl0aGVyIHRoZSB3aG9sZSBhc3NpZ25tZW50IHdpbGwgYmUgcmVtb3ZlZCBvclxuICAvLyBhIHBhcnRpY3VsYXIgZGVjb3JhdG9yIHdpdGhpbiB3aWxsLlxuICBjb25zdCB0b1JlbW92ZSA9IGFzc2lnbm1lbnRzXG4gICAgLm1hcCgoYXNzaWduKSA9PiB7XG4gICAgICBjb25zdCBkZWNvcmF0b3JzID1cbiAgICAgICAgZXhwZWN0PHRzLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24+KGFzc2lnbi5pbml0aWFsaXplcixcbiAgICAgICAgICB0cy5TeW50YXhLaW5kLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24pLmVsZW1lbnRzO1xuICAgICAgaWYgKCFkZWNvcmF0b3JzLmV2ZXJ5KChlbCkgPT4gZWwua2luZCA9PT0gdHMuU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbikpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgY29uc3QgZGVjc1RvUmVtb3ZlID0gZGVjb3JhdG9ycy5maWx0ZXIoKGV4cHJlc3Npb24pID0+IHtcbiAgICAgICAgY29uc3QgbGl0ID0gZXhwZWN0PHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uPihleHByZXNzaW9uLFxuICAgICAgICAgIHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pO1xuXG4gICAgICAgIHJldHVybiBpc0FuZ3VsYXJEZWNvcmF0b3IobGl0LCBuZ01ldGFkYXRhLCBjaGVja2VyKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGRlY3NUb1JlbW92ZS5sZW5ndGggPT09IGRlY29yYXRvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbYXNzaWduXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlY3NUb1JlbW92ZTtcbiAgICB9KVxuICAgIC5yZWR1Y2UoKGFjY3VtLCB0b1JtKSA9PiBhY2N1bS5jb25jYXQodG9SbSksIFtdIGFzIHRzLk5vZGVbXSk7XG4gIC8vIElmIGV2ZXJ5IG5vZGUgdG8gYmUgcmVtb3ZlZCBpcyBhIHByb3BlcnR5IGFzc2lnbm1lbnQgKGZ1bGwgcHJvcGVydHkncyBkZWNvcmF0b3JzKSBhbmRcbiAgLy8gYWxsIHByb3BlcnRpZXMgYXJlIGFjY291bnRlZCBmb3IsIHJlbW92ZSB0aGUgd2hvbGUgYXNzaWdubWVudC4gT3RoZXJ3aXNlLCByZW1vdmUgdGhlXG4gIC8vIG5vZGVzIHdoaWNoIHdlcmUgbWFya2VkIGFzIHNhZmUuXG4gIGlmICh0b1JlbW92ZS5sZW5ndGggPT09IGFzc2lnbm1lbnRzLmxlbmd0aCAmJlxuICAgIHRvUmVtb3ZlLmV2ZXJ5KChub2RlKSA9PiBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBc3NpZ25tZW50KSkge1xuICAgIHJldHVybiBbZXhwclN0bXRdO1xuICB9XG5cbiAgcmV0dXJuIHRvUmVtb3ZlO1xufVxuXG5mdW5jdGlvbiBpc0FuZ3VsYXJEZWNvcmF0b3IoXG4gIGxpdGVyYWw6IHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uLFxuICBuZ01ldGFkYXRhOiB0cy5Ob2RlW10sXG4gIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuKTogYm9vbGVhbiB7XG5cbiAgY29uc3QgdHlwZXMgPSBsaXRlcmFsLnByb3BlcnRpZXMuZmlsdGVyKGlzVHlwZVByb3BlcnR5KTtcbiAgaWYgKHR5cGVzLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBhc3NpZ24gPSBleHBlY3Q8dHMuUHJvcGVydHlBc3NpZ25tZW50Pih0eXBlc1swXSwgdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFzc2lnbm1lbnQpO1xuICBpZiAoYXNzaWduLmluaXRpYWxpemVyLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBpZCA9IGFzc2lnbi5pbml0aWFsaXplciBhcyB0cy5JZGVudGlmaWVyO1xuICBjb25zdCByZXMgPSBpZGVudGlmaWVySXNNZXRhZGF0YShpZCwgbmdNZXRhZGF0YSwgY2hlY2tlcik7XG5cbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gaXNUeXBlUHJvcGVydHkocHJvcDogdHMuT2JqZWN0TGl0ZXJhbEVsZW1lbnQpOiBib29sZWFuIHtcbiAgaWYgKHByb3Aua2luZCAhPT0gdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFzc2lnbm1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgYXNzaWdubWVudCA9IHByb3AgYXMgdHMuUHJvcGVydHlBc3NpZ25tZW50O1xuICBpZiAoYXNzaWdubWVudC5uYW1lLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBuYW1lID0gYXNzaWdubWVudC5uYW1lIGFzIHRzLklkZW50aWZpZXI7XG5cbiAgcmV0dXJuIG5hbWUudGV4dCA9PT0gJ3R5cGUnO1xufVxuXG4vLyBDaGVjayBpZiBhbiBpZGVudGlmaWVyIGlzIHBhcnQgb2YgdGhlIGtub3duIEFuZ3VsYXIgTWV0YWRhdGEuXG5mdW5jdGlvbiBpZGVudGlmaWVySXNNZXRhZGF0YShcbiAgaWQ6IHRzLklkZW50aWZpZXIsXG4gIG1ldGFkYXRhOiB0cy5Ob2RlW10sXG4gIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHN5bWJvbCA9IGNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihpZCk7XG4gIGlmICghc3ltYm9sIHx8ICFzeW1ib2wuZGVjbGFyYXRpb25zIHx8ICFzeW1ib2wuZGVjbGFyYXRpb25zLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBzeW1ib2xcbiAgICAuZGVjbGFyYXRpb25zXG4gICAgLnNvbWUoKHNwZWMpID0+IG1ldGFkYXRhLmluZGV4T2Yoc3BlYykgIT09IC0xKTtcbn1cblxuLy8gQ2hlY2sgaWYgYW4gaW1wb3J0IGlzIGEgdHNsaWIgaGVscGVyIGltcG9ydCAoYGltcG9ydCAqIGFzIHRzbGliIGZyb20gXCJ0c2xpYlwiO2ApXG5mdW5jdGlvbiBpc1RzbGliSW1wb3J0KG5vZGU6IHRzLkltcG9ydERlY2xhcmF0aW9uKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIShub2RlLm1vZHVsZVNwZWNpZmllciAmJlxuICAgIG5vZGUubW9kdWxlU3BlY2lmaWVyLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCAmJlxuICAgIChub2RlLm1vZHVsZVNwZWNpZmllciBhcyB0cy5TdHJpbmdMaXRlcmFsKS50ZXh0ID09PSAndHNsaWInICYmXG4gICAgbm9kZS5pbXBvcnRDbGF1c2UgJiZcbiAgICBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzICYmXG4gICAgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5raW5kID09PSB0cy5TeW50YXhLaW5kLk5hbWVzcGFjZUltcG9ydCk7XG59XG5cbi8vIEZpbmQgYWxsIG5hbWVzcGFjZSBpbXBvcnRzIGZvciBgdHNsaWJgLlxuZnVuY3Rpb24gZmluZFRzbGliSW1wb3J0cyhub2RlOiB0cy5Ob2RlKTogdHMuTmFtZXNwYWNlSW1wb3J0W10ge1xuICBjb25zdCBpbXBvcnRzOiB0cy5OYW1lc3BhY2VJbXBvcnRbXSA9IFtdO1xuICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgaWYgKGNoaWxkLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb24pIHtcbiAgICAgIGNvbnN0IGltcG9ydERlY2wgPSBjaGlsZCBhcyB0cy5JbXBvcnREZWNsYXJhdGlvbjtcbiAgICAgIGlmIChpc1RzbGliSW1wb3J0KGltcG9ydERlY2wpKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydENsYXVzZSA9IGltcG9ydERlY2wuaW1wb3J0Q2xhdXNlIGFzIHRzLkltcG9ydENsYXVzZTtcbiAgICAgICAgY29uc3QgbmFtZXNwYWNlSW1wb3J0ID0gaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MgYXMgdHMuTmFtZXNwYWNlSW1wb3J0O1xuICAgICAgICBpbXBvcnRzLnB1c2gobmFtZXNwYWNlSW1wb3J0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBpbXBvcnRzO1xufVxuXG4vLyBDaGVjayBpZiBhbiBpZGVudGlmaWVyIGlzIHBhcnQgb2YgdGhlIGtub3duIHRzbGliIGlkZW50aWZpZXJzLlxuZnVuY3Rpb24gaWRlbnRpZmllcklzVHNsaWIoXG4gIGlkOiB0cy5JZGVudGlmaWVyLFxuICB0c2xpYkltcG9ydHM6IHRzLk5hbWVzcGFjZUltcG9ydFtdLFxuICBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbik6IGJvb2xlYW4ge1xuICBjb25zdCBzeW1ib2wgPSBjaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24oaWQpO1xuICBpZiAoIXN5bWJvbCB8fCAhc3ltYm9sLmRlY2xhcmF0aW9ucyB8fCAhc3ltYm9sLmRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gc3ltYm9sXG4gICAgLmRlY2xhcmF0aW9uc1xuICAgIC5zb21lKChzcGVjKSA9PiB0c2xpYkltcG9ydHMuaW5kZXhPZihzcGVjIGFzIHRzLk5hbWVzcGFjZUltcG9ydCkgIT09IC0xKTtcbn1cblxuLy8gQ2hlY2sgaWYgYSBmdW5jdGlvbiBjYWxsIGlzIGEgdHNsaWIgaGVscGVyLlxuZnVuY3Rpb24gaXNUc2xpYkhlbHBlcihcbiAgY2FsbEV4cHI6IHRzLkNhbGxFeHByZXNzaW9uLFxuICBoZWxwZXI6IHN0cmluZyxcbiAgdHNsaWJJbXBvcnRzOiB0cy5OYW1lc3BhY2VJbXBvcnRbXSxcbiAgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4pIHtcblxuICBsZXQgY2FsbEV4cHJJZGVudCA9IGNhbGxFeHByLmV4cHJlc3Npb24gYXMgdHMuSWRlbnRpZmllcjtcblxuICBpZiAoY2FsbEV4cHIuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICBpZiAoY2FsbEV4cHIuZXhwcmVzc2lvbi5raW5kID09PSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbikge1xuICAgICAgY29uc3QgcHJvcEFjY2VzcyA9IGNhbGxFeHByLmV4cHJlc3Npb24gYXMgdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uO1xuICAgICAgY29uc3QgbGVmdCA9IHByb3BBY2Nlc3MuZXhwcmVzc2lvbjtcbiAgICAgIGNhbGxFeHBySWRlbnQgPSBwcm9wQWNjZXNzLm5hbWU7XG5cbiAgICAgIGlmIChsZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlkID0gbGVmdCBhcyB0cy5JZGVudGlmaWVyO1xuXG4gICAgICBpZiAoIWlkZW50aWZpZXJJc1RzbGliKGlkLCB0c2xpYkltcG9ydHMsIGNoZWNrZXIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gbm9kZS50ZXh0IG9uIGEgbmFtZSB0aGF0IHN0YXJ0cyB3aXRoIHR3byB1bmRlcnNjb3JlcyB3aWxsIHJldHVybiB0aHJlZSBpbnN0ZWFkLlxuICAvLyBVbmxlc3MgaXQncyBhbiBleHByZXNzaW9uIGxpa2UgdHNsaWIuX19kZWNvcmF0ZSwgaW4gd2hpY2ggY2FzZSBpdCdzIG9ubHkgMi5cbiAgaWYgKGNhbGxFeHBySWRlbnQudGV4dCAhPT0gYF8ke2hlbHBlcn1gICYmIGNhbGxFeHBySWRlbnQudGV4dCAhPT0gaGVscGVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG4iXX0=