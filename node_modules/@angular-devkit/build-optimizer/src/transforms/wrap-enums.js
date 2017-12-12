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
function testWrapEnums(content) {
    const regexes = [
        // tslint:disable:max-line-length
        /var (\S+) = \{\};\r?\n(\1\.(\S+) = \d+;\r?\n)+\1\[\1\.(\S+)\] = "\4";\r?\n(\1\[\1\.(\S+)\] = "\S+";\r?\n*)+/,
        /var (\S+);(\/\*@__PURE__\*\/)*\r?\n\(function \(\1\) \{\s+(\1\[\1\["(\S+)"\] = 0\] = "\4";(\s+\1\[\1\["\S+"\] = \d\] = "\S+";)*\r?\n)\}\)\(\1 \|\| \(\1 = \{\}\)\);/,
        /\/\*\* @enum \{\w+\} \*\//,
    ];
    return regexes.some((regex) => regex.test(content));
}
exports.testWrapEnums = testWrapEnums;
function isBlockLike(node) {
    return node.kind === ts.SyntaxKind.Block
        || node.kind === ts.SyntaxKind.ModuleBlock
        || node.kind === ts.SyntaxKind.CaseClause
        || node.kind === ts.SyntaxKind.DefaultClause
        || node.kind === ts.SyntaxKind.SourceFile;
}
function getWrapEnumsTransformer() {
    return (context) => {
        const transformer = (sf) => {
            const result = visitBlockStatements(sf.statements, context);
            return ts.updateSourceFileNode(sf, result);
        };
        return transformer;
    };
}
exports.getWrapEnumsTransformer = getWrapEnumsTransformer;
function visitBlockStatements(statements, context) {
    // copy of statements to modify; lazy initialized
    let updatedStatements;
    const visitor = (node) => {
        if (isBlockLike(node)) {
            const result = visitBlockStatements(node.statements, context);
            if (result === node.statements) {
                return node;
            }
            switch (node.kind) {
                case ts.SyntaxKind.Block:
                    return ts.updateBlock(node, result);
                case ts.SyntaxKind.ModuleBlock:
                    return ts.updateModuleBlock(node, result);
                case ts.SyntaxKind.CaseClause:
                    const clause = node;
                    return ts.updateCaseClause(clause, clause.expression, result);
                case ts.SyntaxKind.DefaultClause:
                    return ts.updateDefaultClause(node, result);
                default:
                    return node;
            }
        }
        else {
            return ts.visitEachChild(node, visitor, context);
        }
    };
    // 'oIndex' is the original statement index; 'uIndex' is the updated statement index
    for (let oIndex = 0, uIndex = 0; oIndex < statements.length; oIndex++, uIndex++) {
        const currentStatement = statements[oIndex];
        // these can't contain an enum declaration
        if (currentStatement.kind === ts.SyntaxKind.ImportDeclaration) {
            continue;
        }
        // enum declarations must:
        //   * not be last statement
        //   * be a variable statement
        //   * have only one declaration
        //   * have an identifer as a declaration name
        if (oIndex < statements.length - 1
            && ts.isVariableStatement(currentStatement)
            && currentStatement.declarationList.declarations.length === 1) {
            const variableDeclaration = currentStatement.declarationList.declarations[0];
            if (ts.isIdentifier(variableDeclaration.name)) {
                const name = variableDeclaration.name.text;
                if (!variableDeclaration.initializer) {
                    const enumStatements = findTs2_3EnumStatements(name, statements[oIndex + 1]);
                    if (enumStatements.length > 0) {
                        // found an enum
                        if (!updatedStatements) {
                            updatedStatements = statements.slice();
                        }
                        // create wrapper and replace variable statement and IIFE
                        updatedStatements.splice(uIndex, 2, createWrappedEnum(name, currentStatement, enumStatements, undefined));
                        // skip IIFE statement
                        oIndex++;
                        continue;
                    }
                }
                else if (ts.isObjectLiteralExpression(variableDeclaration.initializer)
                    && variableDeclaration.initializer.properties.length === 0) {
                    const nextStatements = statements.slice(oIndex + 1);
                    const enumStatements = findTs2_2EnumStatements(name, nextStatements);
                    if (enumStatements.length > 0) {
                        // found an enum
                        if (!updatedStatements) {
                            updatedStatements = statements.slice();
                        }
                        // create wrapper and replace variable statement and enum member statements
                        updatedStatements.splice(uIndex, enumStatements.length + 1, createWrappedEnum(name, currentStatement, enumStatements, variableDeclaration.initializer));
                        // skip enum member declarations
                        oIndex += enumStatements.length;
                        continue;
                    }
                }
                else if (ts.isObjectLiteralExpression(variableDeclaration.initializer)
                    && variableDeclaration.initializer.properties.length !== 0) {
                    const literalPropertyCount = variableDeclaration.initializer.properties.length;
                    const nextStatements = statements.slice(oIndex + 1);
                    const enumStatements = findTsickleEnumStatements(name, nextStatements);
                    if (enumStatements.length === literalPropertyCount) {
                        // found an enum
                        if (!updatedStatements) {
                            updatedStatements = statements.slice();
                        }
                        // create wrapper and replace variable statement and enum member statements
                        updatedStatements.splice(uIndex, enumStatements.length + 1, createWrappedEnum(name, currentStatement, enumStatements, variableDeclaration.initializer));
                        // skip enum member declarations
                        oIndex += enumStatements.length;
                        continue;
                    }
                }
            }
        }
        const result = ts.visitNode(currentStatement, visitor);
        if (result !== currentStatement) {
            if (!updatedStatements) {
                updatedStatements = statements.slice();
            }
            updatedStatements[uIndex] = result;
        }
    }
    // if changes, return updated statements
    // otherwise, return original array instance
    return updatedStatements ? ts.createNodeArray(updatedStatements) : statements;
}
// TS 2.3 enums have statements that are inside a IIFE.
function findTs2_3EnumStatements(name, statement) {
    const enumStatements = [];
    const noNodes = [];
    const funcExpr = ast_utils_1.drilldownNodes(statement, [
        { prop: null, kind: ts.SyntaxKind.ExpressionStatement },
        { prop: 'expression', kind: ts.SyntaxKind.CallExpression },
        { prop: 'expression', kind: ts.SyntaxKind.ParenthesizedExpression },
        { prop: 'expression', kind: ts.SyntaxKind.FunctionExpression },
    ]);
    if (funcExpr === null) {
        return noNodes;
    }
    if (!(funcExpr.parameters.length === 1
        && funcExpr.parameters[0].name.kind === ts.SyntaxKind.Identifier
        && funcExpr.parameters[0].name.text === name)) {
        return noNodes;
    }
    // In TS 2.3 enums, the IIFE contains only expressions with a certain format.
    // If we find any that is different, we ignore the whole thing.
    for (const innerStmt of funcExpr.body.statements) {
        const innerBinExpr = ast_utils_1.drilldownNodes(innerStmt, [
            { prop: null, kind: ts.SyntaxKind.ExpressionStatement },
            { prop: 'expression', kind: ts.SyntaxKind.BinaryExpression },
        ]);
        if (innerBinExpr === null) {
            return noNodes;
        }
        const exprStmt = innerStmt;
        if (!(innerBinExpr.operatorToken.kind === ts.SyntaxKind.FirstAssignment
            && innerBinExpr.left.kind === ts.SyntaxKind.ElementAccessExpression)) {
            return noNodes;
        }
        const innerElemAcc = innerBinExpr.left;
        if (!(innerElemAcc.expression.kind === ts.SyntaxKind.Identifier
            && innerElemAcc.expression.text === name
            && innerElemAcc.argumentExpression
            && innerElemAcc.argumentExpression.kind === ts.SyntaxKind.BinaryExpression)) {
            return noNodes;
        }
        const innerArgBinExpr = innerElemAcc.argumentExpression;
        if (innerArgBinExpr.left.kind !== ts.SyntaxKind.ElementAccessExpression) {
            return noNodes;
        }
        const innerArgElemAcc = innerArgBinExpr.left;
        if (!(innerArgElemAcc.expression.kind === ts.SyntaxKind.Identifier
            && innerArgElemAcc.expression.text === name)) {
            return noNodes;
        }
        enumStatements.push(exprStmt);
    }
    return enumStatements;
}
// TS 2.2 enums have statements after the variable declaration, with index statements followed
// by value statements.
function findTs2_2EnumStatements(name, statements) {
    const enumStatements = [];
    let beforeValueStatements = true;
    for (const stmt of statements) {
        // Ensure all statements are of the expected format and using the right identifer.
        // When we find a statement that isn't part of the enum, return what we collected so far.
        const binExpr = ast_utils_1.drilldownNodes(stmt, [
            { prop: null, kind: ts.SyntaxKind.ExpressionStatement },
            { prop: 'expression', kind: ts.SyntaxKind.BinaryExpression },
        ]);
        if (binExpr === null
            || (binExpr.left.kind !== ts.SyntaxKind.PropertyAccessExpression
                && binExpr.left.kind !== ts.SyntaxKind.ElementAccessExpression)) {
            return beforeValueStatements ? [] : enumStatements;
        }
        const exprStmt = stmt;
        const leftExpr = binExpr.left;
        if (!(leftExpr.expression.kind === ts.SyntaxKind.Identifier
            && leftExpr.expression.text === name)) {
            return beforeValueStatements ? [] : enumStatements;
        }
        if (!beforeValueStatements && leftExpr.kind === ts.SyntaxKind.PropertyAccessExpression) {
            // We shouldn't find index statements after value statements.
            return [];
        }
        else if (beforeValueStatements && leftExpr.kind === ts.SyntaxKind.ElementAccessExpression) {
            beforeValueStatements = false;
        }
        enumStatements.push(exprStmt);
    }
    return enumStatements;
}
// Tsickle enums have a variable statement with indexes, followed by value statements.
// See https://github.com/angular/devkit/issues/229#issuecomment-338512056 fore more information.
function findTsickleEnumStatements(name, statements) {
    const enumStatements = [];
    // let beforeValueStatements = true;
    for (const stmt of statements) {
        // Ensure all statements are of the expected format and using the right identifer.
        // When we find a statement that isn't part of the enum, return what we collected so far.
        const binExpr = ast_utils_1.drilldownNodes(stmt, [
            { prop: null, kind: ts.SyntaxKind.ExpressionStatement },
            { prop: 'expression', kind: ts.SyntaxKind.BinaryExpression },
        ]);
        if (binExpr === null || binExpr.left.kind !== ts.SyntaxKind.ElementAccessExpression) {
            return enumStatements;
        }
        const exprStmt = stmt;
        const leftExpr = binExpr.left;
        if (!(leftExpr.expression.kind === ts.SyntaxKind.Identifier
            && leftExpr.expression.text === name)) {
            return enumStatements;
        }
        enumStatements.push(exprStmt);
    }
    return enumStatements;
}
function createWrappedEnum(name, hostNode, statements, literalInitializer) {
    const pureFunctionComment = '@__PURE__';
    literalInitializer = literalInitializer || ts.createObjectLiteral();
    const innerVarStmt = ts.createVariableStatement(undefined, ts.createVariableDeclarationList([
        ts.createVariableDeclaration(name, undefined, literalInitializer),
    ]));
    const innerReturn = ts.createReturn(ts.createIdentifier(name));
    // NOTE: TS 2.4+ has a create IIFE helper method
    const iife = ts.createCall(ts.createParen(ts.createFunctionExpression(undefined, undefined, undefined, undefined, [], undefined, ts.createBlock([
        innerVarStmt,
        ...statements,
        innerReturn,
    ]))), undefined, []);
    // Update existing host node with the pure comment before the variable declaration initializer.
    const variableDeclaration = hostNode.declarationList.declarations[0];
    const outerVarStmt = ts.updateVariableStatement(hostNode, hostNode.modifiers, ts.updateVariableDeclarationList(hostNode.declarationList, [
        ts.updateVariableDeclaration(variableDeclaration, variableDeclaration.name, variableDeclaration.type, ts.addSyntheticLeadingComment(iife, ts.SyntaxKind.MultiLineCommentTrivia, pureFunctionComment, false)),
    ]));
    return outerVarStmt;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC1lbnVtcy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvd3JhcC1lbnVtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUNqQyxvREFBc0Q7QUFHdEQsdUJBQThCLE9BQWU7SUFDM0MsTUFBTSxPQUFPLEdBQUc7UUFDZCxpQ0FBaUM7UUFDakMsNkdBQTZHO1FBQzdHLHFLQUFxSztRQUNySywyQkFBMkI7S0FFNUIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBVkQsc0NBVUM7QUFFRCxxQkFBcUIsSUFBYTtJQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUs7V0FDakMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVc7V0FDdkMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVU7V0FDdEMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWE7V0FDekMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztBQUNoRCxDQUFDO0FBRUQ7SUFDRSxNQUFNLENBQUMsQ0FBQyxPQUFpQztRQUN2QyxNQUFNLFdBQVcsR0FBa0MsQ0FBQyxFQUFpQjtZQUVuRSxNQUFNLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRTVELE1BQU0sQ0FBQyxFQUFFLENB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SUFFRixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRS9ELGdEQUFnRDtJQUNoRCxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxDQUN4QixFQUFFLENBQUMsV0FBVyxDQUNaLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDekIsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULEVBQUUsRUFDRixTQUFTLEVBQ1QsRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUNiLFlBQVk7UUFDWixHQUFHLFVBQVU7UUFDYixXQUFXO0tBQ1osQ0FBQyxDQUNILENBQ0YsRUFDRCxTQUFTLEVBQ1QsRUFBRSxDQUNILENBQUM7SUFFRiwrRkFBK0Y7SUFDL0YsTUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRSxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQzdDLFFBQVEsRUFDUixRQUFRLENBQUMsU0FBUyxFQUNsQixFQUFFLENBQUMsNkJBQTZCLENBQzlCLFFBQVEsQ0FBQyxlQUFlLEVBQ3hCO1FBQ0UsRUFBRSxDQUFDLHlCQUF5QixDQUMxQixtQkFBbUIsRUFDbkIsbUJBQW1CLENBQUMsSUFBSSxFQUN4QixtQkFBbUIsQ0FBQyxJQUFJLEVBQ3hCLEVBQUUsQ0FBQywwQkFBMEIsQ0FDM0IsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsS0FBSyxDQUN2RSxDQUNGO0tBQ0YsQ0FDRixDQUNGLENBQUM7SUFFRixNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3RCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7IGRyaWxsZG93bk5vZGVzIH0gZnJvbSAnLi4vaGVscGVycy9hc3QtdXRpbHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0V3JhcEVudW1zKGNvbnRlbnQ6IHN0cmluZykge1xuICBjb25zdCByZWdleGVzID0gW1xuICAgIC8vIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aFxuICAgIC92YXIgKFxcUyspID0gXFx7XFx9O1xccj9cXG4oXFwxXFwuKFxcUyspID0gXFxkKztcXHI/XFxuKStcXDFcXFtcXDFcXC4oXFxTKylcXF0gPSBcIlxcNFwiO1xccj9cXG4oXFwxXFxbXFwxXFwuKFxcUyspXFxdID0gXCJcXFMrXCI7XFxyP1xcbiopKy8sXG4gICAgL3ZhciAoXFxTKyk7KFxcL1xcKkBfX1BVUkVfX1xcKlxcLykqXFxyP1xcblxcKGZ1bmN0aW9uIFxcKFxcMVxcKSBcXHtcXHMrKFxcMVxcW1xcMVxcW1wiKFxcUyspXCJcXF0gPSAwXFxdID0gXCJcXDRcIjsoXFxzK1xcMVxcW1xcMVxcW1wiXFxTK1wiXFxdID0gXFxkXFxdID0gXCJcXFMrXCI7KSpcXHI/XFxuKVxcfVxcKVxcKFxcMSBcXHxcXHwgXFwoXFwxID0gXFx7XFx9XFwpXFwpOy8sXG4gICAgL1xcL1xcKlxcKiBAZW51bSBcXHtcXHcrXFx9IFxcKlxcLy8sXG4gIC8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG4gIF07XG5cbiAgcmV0dXJuIHJlZ2V4ZXMuc29tZSgocmVnZXgpID0+IHJlZ2V4LnRlc3QoY29udGVudCkpO1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrTGlrZShub2RlOiB0cy5Ob2RlKTogbm9kZSBpcyB0cy5CbG9ja0xpa2Uge1xuICByZXR1cm4gbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkJsb2NrXG4gICAgICB8fCBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTW9kdWxlQmxvY2tcbiAgICAgIHx8IG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5DYXNlQ2xhdXNlXG4gICAgICB8fCBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRGVmYXVsdENsYXVzZVxuICAgICAgfHwgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlNvdXJjZUZpbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRXcmFwRW51bXNUcmFuc2Zvcm1lcigpOiB0cy5UcmFuc2Zvcm1lckZhY3Rvcnk8dHMuU291cmNlRmlsZT4ge1xuICByZXR1cm4gKGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCk6IHRzLlRyYW5zZm9ybWVyPHRzLlNvdXJjZUZpbGU+ID0+IHtcbiAgICBjb25zdCB0cmFuc2Zvcm1lcjogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPSAoc2Y6IHRzLlNvdXJjZUZpbGUpID0+IHtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gdmlzaXRCbG9ja1N0YXRlbWVudHMoc2Yuc3RhdGVtZW50cywgY29udGV4dCk7XG5cbiAgICAgIHJldHVybiB0cy51cGRhdGVTb3VyY2VGaWxlTm9kZShzZiwgcmVzdWx0KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyO1xuICB9O1xufVxuXG5mdW5jdGlvbiB2aXNpdEJsb2NrU3RhdGVtZW50cyhcbiAgc3RhdGVtZW50czogdHMuTm9kZUFycmF5PHRzLlN0YXRlbWVudD4sXG4gIGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCxcbik6IHRzLk5vZGVBcnJheTx0cy5TdGF0ZW1lbnQ+IHtcblxuICAvLyBjb3B5IG9mIHN0YXRlbWVudHMgdG8gbW9kaWZ5OyBsYXp5IGluaXRpYWxpemVkXG4gIGxldCB1cGRhdGVkU3RhdGVtZW50czogQXJyYXk8dHMuU3RhdGVtZW50PiB8IHVuZGVmaW5lZDtcblxuICBjb25zdCB2aXNpdG9yOiB0cy5WaXNpdG9yID0gKG5vZGUpID0+IHtcbiAgICBpZiAoaXNCbG9ja0xpa2Uobm9kZSkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHZpc2l0QmxvY2tTdGF0ZW1lbnRzKG5vZGUuc3RhdGVtZW50cywgY29udGV4dCk7XG4gICAgICBpZiAocmVzdWx0ID09PSBub2RlLnN0YXRlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICB9XG4gICAgICBzd2l0Y2ggKG5vZGUua2luZCkge1xuICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuQmxvY2s6XG4gICAgICAgICAgcmV0dXJuIHRzLnVwZGF0ZUJsb2NrKG5vZGUgYXMgdHMuQmxvY2ssIHJlc3VsdCk7XG4gICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5Nb2R1bGVCbG9jazpcbiAgICAgICAgICByZXR1cm4gdHMudXBkYXRlTW9kdWxlQmxvY2sobm9kZSBhcyB0cy5Nb2R1bGVCbG9jaywgcmVzdWx0KTtcbiAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkNhc2VDbGF1c2U6XG4gICAgICAgICAgY29uc3QgY2xhdXNlID0gbm9kZSBhcyB0cy5DYXNlQ2xhdXNlO1xuXG4gICAgICAgICAgcmV0dXJuIHRzLnVwZGF0ZUNhc2VDbGF1c2UoY2xhdXNlLCBjbGF1c2UuZXhwcmVzc2lvbiwgcmVzdWx0KTtcbiAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkRlZmF1bHRDbGF1c2U6XG4gICAgICAgICAgcmV0dXJuIHRzLnVwZGF0ZURlZmF1bHRDbGF1c2Uobm9kZSBhcyB0cy5EZWZhdWx0Q2xhdXNlLCByZXN1bHQpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgfVxuICB9O1xuXG4gIC8vICdvSW5kZXgnIGlzIHRoZSBvcmlnaW5hbCBzdGF0ZW1lbnQgaW5kZXg7ICd1SW5kZXgnIGlzIHRoZSB1cGRhdGVkIHN0YXRlbWVudCBpbmRleFxuICBmb3IgKGxldCBvSW5kZXggPSAwLCB1SW5kZXggPSAwOyBvSW5kZXggPCBzdGF0ZW1lbnRzLmxlbmd0aDsgb0luZGV4KyssIHVJbmRleCsrKSB7XG4gICAgY29uc3QgY3VycmVudFN0YXRlbWVudCA9IHN0YXRlbWVudHNbb0luZGV4XTtcblxuICAgIC8vIHRoZXNlIGNhbid0IGNvbnRhaW4gYW4gZW51bSBkZWNsYXJhdGlvblxuICAgIGlmIChjdXJyZW50U3RhdGVtZW50LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb24pIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGVudW0gZGVjbGFyYXRpb25zIG11c3Q6XG4gICAgLy8gICAqIG5vdCBiZSBsYXN0IHN0YXRlbWVudFxuICAgIC8vICAgKiBiZSBhIHZhcmlhYmxlIHN0YXRlbWVudFxuICAgIC8vICAgKiBoYXZlIG9ubHkgb25lIGRlY2xhcmF0aW9uXG4gICAgLy8gICAqIGhhdmUgYW4gaWRlbnRpZmVyIGFzIGEgZGVjbGFyYXRpb24gbmFtZVxuICAgIGlmIChvSW5kZXggPCBzdGF0ZW1lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgJiYgdHMuaXNWYXJpYWJsZVN0YXRlbWVudChjdXJyZW50U3RhdGVtZW50KVxuICAgICAgICAmJiBjdXJyZW50U3RhdGVtZW50LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMubGVuZ3RoID09PSAxKSB7XG5cbiAgICAgIGNvbnN0IHZhcmlhYmxlRGVjbGFyYXRpb24gPSBjdXJyZW50U3RhdGVtZW50LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbMF07XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKHZhcmlhYmxlRGVjbGFyYXRpb24ubmFtZSkpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHZhcmlhYmxlRGVjbGFyYXRpb24ubmFtZS50ZXh0O1xuXG4gICAgICAgIGlmICghdmFyaWFibGVEZWNsYXJhdGlvbi5pbml0aWFsaXplcikge1xuICAgICAgICAgIGNvbnN0IGVudW1TdGF0ZW1lbnRzID0gZmluZFRzMl8zRW51bVN0YXRlbWVudHMobmFtZSwgc3RhdGVtZW50c1tvSW5kZXggKyAxXSk7XG4gICAgICAgICAgaWYgKGVudW1TdGF0ZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIGZvdW5kIGFuIGVudW1cbiAgICAgICAgICAgIGlmICghdXBkYXRlZFN0YXRlbWVudHMpIHtcbiAgICAgICAgICAgICAgdXBkYXRlZFN0YXRlbWVudHMgPSBzdGF0ZW1lbnRzLnNsaWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjcmVhdGUgd3JhcHBlciBhbmQgcmVwbGFjZSB2YXJpYWJsZSBzdGF0ZW1lbnQgYW5kIElJRkVcbiAgICAgICAgICAgIHVwZGF0ZWRTdGF0ZW1lbnRzLnNwbGljZSh1SW5kZXgsIDIsIGNyZWF0ZVdyYXBwZWRFbnVtKFxuICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICBjdXJyZW50U3RhdGVtZW50LFxuICAgICAgICAgICAgICBlbnVtU3RhdGVtZW50cyxcbiAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAvLyBza2lwIElJRkUgc3RhdGVtZW50XG4gICAgICAgICAgICBvSW5kZXgrKztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0cy5pc09iamVjdExpdGVyYWxFeHByZXNzaW9uKHZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIpXG4gICAgICAgICAgICAgICAgICAgJiYgdmFyaWFibGVEZWNsYXJhdGlvbi5pbml0aWFsaXplci5wcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IG5leHRTdGF0ZW1lbnRzID0gc3RhdGVtZW50cy5zbGljZShvSW5kZXggKyAxKTtcbiAgICAgICAgICBjb25zdCBlbnVtU3RhdGVtZW50cyA9IGZpbmRUczJfMkVudW1TdGF0ZW1lbnRzKG5hbWUsIG5leHRTdGF0ZW1lbnRzKTtcbiAgICAgICAgICBpZiAoZW51bVN0YXRlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gZm91bmQgYW4gZW51bVxuICAgICAgICAgICAgaWYgKCF1cGRhdGVkU3RhdGVtZW50cykge1xuICAgICAgICAgICAgICB1cGRhdGVkU3RhdGVtZW50cyA9IHN0YXRlbWVudHMuc2xpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB3cmFwcGVyIGFuZCByZXBsYWNlIHZhcmlhYmxlIHN0YXRlbWVudCBhbmQgZW51bSBtZW1iZXIgc3RhdGVtZW50c1xuICAgICAgICAgICAgdXBkYXRlZFN0YXRlbWVudHMuc3BsaWNlKHVJbmRleCwgZW51bVN0YXRlbWVudHMubGVuZ3RoICsgMSwgY3JlYXRlV3JhcHBlZEVudW0oXG4gICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZW1lbnQsXG4gICAgICAgICAgICAgIGVudW1TdGF0ZW1lbnRzLFxuICAgICAgICAgICAgICB2YXJpYWJsZURlY2xhcmF0aW9uLmluaXRpYWxpemVyLFxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAvLyBza2lwIGVudW0gbWVtYmVyIGRlY2xhcmF0aW9uc1xuICAgICAgICAgICAgb0luZGV4ICs9IGVudW1TdGF0ZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0cy5pc09iamVjdExpdGVyYWxFeHByZXNzaW9uKHZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIpXG4gICAgICAgICAgJiYgdmFyaWFibGVEZWNsYXJhdGlvbi5pbml0aWFsaXplci5wcm9wZXJ0aWVzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGNvbnN0IGxpdGVyYWxQcm9wZXJ0eUNvdW50ID0gdmFyaWFibGVEZWNsYXJhdGlvbi5pbml0aWFsaXplci5wcm9wZXJ0aWVzLmxlbmd0aDtcbiAgICAgICAgICBjb25zdCBuZXh0U3RhdGVtZW50cyA9IHN0YXRlbWVudHMuc2xpY2Uob0luZGV4ICsgMSk7XG4gICAgICAgICAgY29uc3QgZW51bVN0YXRlbWVudHMgPSBmaW5kVHNpY2tsZUVudW1TdGF0ZW1lbnRzKG5hbWUsIG5leHRTdGF0ZW1lbnRzKTtcbiAgICAgICAgICBpZiAoZW51bVN0YXRlbWVudHMubGVuZ3RoID09PSBsaXRlcmFsUHJvcGVydHlDb3VudCkge1xuICAgICAgICAgICAgLy8gZm91bmQgYW4gZW51bVxuICAgICAgICAgICAgaWYgKCF1cGRhdGVkU3RhdGVtZW50cykge1xuICAgICAgICAgICAgICB1cGRhdGVkU3RhdGVtZW50cyA9IHN0YXRlbWVudHMuc2xpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB3cmFwcGVyIGFuZCByZXBsYWNlIHZhcmlhYmxlIHN0YXRlbWVudCBhbmQgZW51bSBtZW1iZXIgc3RhdGVtZW50c1xuICAgICAgICAgICAgdXBkYXRlZFN0YXRlbWVudHMuc3BsaWNlKHVJbmRleCwgZW51bVN0YXRlbWVudHMubGVuZ3RoICsgMSwgY3JlYXRlV3JhcHBlZEVudW0oXG4gICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZW1lbnQsXG4gICAgICAgICAgICAgIGVudW1TdGF0ZW1lbnRzLFxuICAgICAgICAgICAgICB2YXJpYWJsZURlY2xhcmF0aW9uLmluaXRpYWxpemVyLFxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAvLyBza2lwIGVudW0gbWVtYmVyIGRlY2xhcmF0aW9uc1xuICAgICAgICAgICAgb0luZGV4ICs9IGVudW1TdGF0ZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHRzLnZpc2l0Tm9kZShjdXJyZW50U3RhdGVtZW50LCB2aXNpdG9yKTtcbiAgICBpZiAocmVzdWx0ICE9PSBjdXJyZW50U3RhdGVtZW50KSB7XG4gICAgICBpZiAoIXVwZGF0ZWRTdGF0ZW1lbnRzKSB7XG4gICAgICAgIHVwZGF0ZWRTdGF0ZW1lbnRzID0gc3RhdGVtZW50cy5zbGljZSgpO1xuICAgICAgfVxuICAgICAgdXBkYXRlZFN0YXRlbWVudHNbdUluZGV4XSA9IHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBjaGFuZ2VzLCByZXR1cm4gdXBkYXRlZCBzdGF0ZW1lbnRzXG4gIC8vIG90aGVyd2lzZSwgcmV0dXJuIG9yaWdpbmFsIGFycmF5IGluc3RhbmNlXG4gIHJldHVybiB1cGRhdGVkU3RhdGVtZW50cyA/IHRzLmNyZWF0ZU5vZGVBcnJheSh1cGRhdGVkU3RhdGVtZW50cykgOiBzdGF0ZW1lbnRzO1xufVxuXG4vLyBUUyAyLjMgZW51bXMgaGF2ZSBzdGF0ZW1lbnRzIHRoYXQgYXJlIGluc2lkZSBhIElJRkUuXG5mdW5jdGlvbiBmaW5kVHMyXzNFbnVtU3RhdGVtZW50cyhuYW1lOiBzdHJpbmcsIHN0YXRlbWVudDogdHMuU3RhdGVtZW50KTogdHMuRXhwcmVzc2lvblN0YXRlbWVudFtdIHtcbiAgY29uc3QgZW51bVN0YXRlbWVudHM6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnRbXSA9IFtdO1xuICBjb25zdCBub05vZGVzOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50W10gPSBbXTtcblxuICBjb25zdCBmdW5jRXhwciA9IGRyaWxsZG93bk5vZGVzPHRzLkZ1bmN0aW9uRXhwcmVzc2lvbj4oc3RhdGVtZW50LFxuICAgIFtcbiAgICAgIHsgcHJvcDogbnVsbCwga2luZDogdHMuU3ludGF4S2luZC5FeHByZXNzaW9uU3RhdGVtZW50IH0sXG4gICAgICB7IHByb3A6ICdleHByZXNzaW9uJywga2luZDogdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbiB9LFxuICAgICAgeyBwcm9wOiAnZXhwcmVzc2lvbicsIGtpbmQ6IHRzLlN5bnRheEtpbmQuUGFyZW50aGVzaXplZEV4cHJlc3Npb24gfSxcbiAgICAgIHsgcHJvcDogJ2V4cHJlc3Npb24nLCBraW5kOiB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRXhwcmVzc2lvbiB9LFxuICAgIF0pO1xuXG4gIGlmIChmdW5jRXhwciA9PT0gbnVsbCkgeyByZXR1cm4gbm9Ob2RlczsgfVxuXG4gIGlmICghKFxuICAgIGZ1bmNFeHByLnBhcmFtZXRlcnMubGVuZ3RoID09PSAxXG4gICAgJiYgZnVuY0V4cHIucGFyYW1ldGVyc1swXS5uYW1lLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllclxuICAgICYmIChmdW5jRXhwci5wYXJhbWV0ZXJzWzBdLm5hbWUgYXMgdHMuSWRlbnRpZmllcikudGV4dCA9PT0gbmFtZVxuICApKSB7XG4gICAgcmV0dXJuIG5vTm9kZXM7XG4gIH1cblxuICAvLyBJbiBUUyAyLjMgZW51bXMsIHRoZSBJSUZFIGNvbnRhaW5zIG9ubHkgZXhwcmVzc2lvbnMgd2l0aCBhIGNlcnRhaW4gZm9ybWF0LlxuICAvLyBJZiB3ZSBmaW5kIGFueSB0aGF0IGlzIGRpZmZlcmVudCwgd2UgaWdub3JlIHRoZSB3aG9sZSB0aGluZy5cbiAgZm9yIChjb25zdCBpbm5lclN0bXQgb2YgZnVuY0V4cHIuYm9keS5zdGF0ZW1lbnRzKSB7XG5cbiAgICBjb25zdCBpbm5lckJpbkV4cHIgPSBkcmlsbGRvd25Ob2Rlczx0cy5CaW5hcnlFeHByZXNzaW9uPihpbm5lclN0bXQsXG4gICAgICBbXG4gICAgICAgIHsgcHJvcDogbnVsbCwga2luZDogdHMuU3ludGF4S2luZC5FeHByZXNzaW9uU3RhdGVtZW50IH0sXG4gICAgICAgIHsgcHJvcDogJ2V4cHJlc3Npb24nLCBraW5kOiB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb24gfSxcbiAgICAgIF0pO1xuXG4gICAgaWYgKGlubmVyQmluRXhwciA9PT0gbnVsbCkgeyByZXR1cm4gbm9Ob2RlczsgfVxuXG4gICAgY29uc3QgZXhwclN0bXQgPSBpbm5lclN0bXQgYXMgdHMuRXhwcmVzc2lvblN0YXRlbWVudDtcblxuICAgIGlmICghKGlubmVyQmluRXhwci5vcGVyYXRvclRva2VuLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRmlyc3RBc3NpZ25tZW50XG4gICAgICAgICYmIGlubmVyQmluRXhwci5sZWZ0LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24pKSB7XG4gICAgICByZXR1cm4gbm9Ob2RlcztcbiAgICB9XG5cbiAgICBjb25zdCBpbm5lckVsZW1BY2MgPSBpbm5lckJpbkV4cHIubGVmdCBhcyB0cy5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbjtcblxuICAgIGlmICghKFxuICAgICAgaW5uZXJFbGVtQWNjLmV4cHJlc3Npb24ua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyXG4gICAgICAmJiAoaW5uZXJFbGVtQWNjLmV4cHJlc3Npb24gYXMgdHMuSWRlbnRpZmllcikudGV4dCA9PT0gbmFtZVxuICAgICAgJiYgaW5uZXJFbGVtQWNjLmFyZ3VtZW50RXhwcmVzc2lvblxuICAgICAgJiYgaW5uZXJFbGVtQWNjLmFyZ3VtZW50RXhwcmVzc2lvbi5raW5kID09PSB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb25cbiAgICApKSB7XG4gICAgICByZXR1cm4gbm9Ob2RlcztcbiAgICB9XG5cbiAgICBjb25zdCBpbm5lckFyZ0JpbkV4cHIgPSBpbm5lckVsZW1BY2MuYXJndW1lbnRFeHByZXNzaW9uIGFzIHRzLkJpbmFyeUV4cHJlc3Npb247XG5cbiAgICBpZiAoaW5uZXJBcmdCaW5FeHByLmxlZnQua2luZCAhPT0gdHMuU3ludGF4S2luZC5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbikge1xuICAgICAgcmV0dXJuIG5vTm9kZXM7XG4gICAgfVxuXG4gICAgY29uc3QgaW5uZXJBcmdFbGVtQWNjID0gaW5uZXJBcmdCaW5FeHByLmxlZnQgYXMgdHMuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb247XG5cbiAgICBpZiAoIShcbiAgICAgIGlubmVyQXJnRWxlbUFjYy5leHByZXNzaW9uLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllclxuICAgICAgJiYgKGlubmVyQXJnRWxlbUFjYy5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXIpLnRleHQgPT09IG5hbWVcbiAgICApKSB7XG4gICAgICByZXR1cm4gbm9Ob2RlcztcbiAgICB9XG5cbiAgICBlbnVtU3RhdGVtZW50cy5wdXNoKGV4cHJTdG10KTtcbiAgfVxuXG4gIHJldHVybiBlbnVtU3RhdGVtZW50cztcbn1cblxuLy8gVFMgMi4yIGVudW1zIGhhdmUgc3RhdGVtZW50cyBhZnRlciB0aGUgdmFyaWFibGUgZGVjbGFyYXRpb24sIHdpdGggaW5kZXggc3RhdGVtZW50cyBmb2xsb3dlZFxuLy8gYnkgdmFsdWUgc3RhdGVtZW50cy5cbmZ1bmN0aW9uIGZpbmRUczJfMkVudW1TdGF0ZW1lbnRzKFxuICBuYW1lOiBzdHJpbmcsXG4gIHN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdLFxuKTogdHMuRXhwcmVzc2lvblN0YXRlbWVudFtdIHtcbiAgY29uc3QgZW51bVN0YXRlbWVudHM6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnRbXSA9IFtdO1xuICBsZXQgYmVmb3JlVmFsdWVTdGF0ZW1lbnRzID0gdHJ1ZTtcblxuICBmb3IgKGNvbnN0IHN0bXQgb2Ygc3RhdGVtZW50cykge1xuICAgIC8vIEVuc3VyZSBhbGwgc3RhdGVtZW50cyBhcmUgb2YgdGhlIGV4cGVjdGVkIGZvcm1hdCBhbmQgdXNpbmcgdGhlIHJpZ2h0IGlkZW50aWZlci5cbiAgICAvLyBXaGVuIHdlIGZpbmQgYSBzdGF0ZW1lbnQgdGhhdCBpc24ndCBwYXJ0IG9mIHRoZSBlbnVtLCByZXR1cm4gd2hhdCB3ZSBjb2xsZWN0ZWQgc28gZmFyLlxuICAgIGNvbnN0IGJpbkV4cHIgPSBkcmlsbGRvd25Ob2Rlczx0cy5CaW5hcnlFeHByZXNzaW9uPihzdG10LFxuICAgICAgW1xuICAgICAgICB7IHByb3A6IG51bGwsIGtpbmQ6IHRzLlN5bnRheEtpbmQuRXhwcmVzc2lvblN0YXRlbWVudCB9LFxuICAgICAgICB7IHByb3A6ICdleHByZXNzaW9uJywga2luZDogdHMuU3ludGF4S2luZC5CaW5hcnlFeHByZXNzaW9uIH0sXG4gICAgICBdKTtcblxuICAgIGlmIChiaW5FeHByID09PSBudWxsXG4gICAgICB8fCAoYmluRXhwci5sZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uXG4gICAgICAgICYmIGJpbkV4cHIubGVmdC5raW5kICE9PSB0cy5TeW50YXhLaW5kLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKVxuICAgICkge1xuICAgICAgcmV0dXJuIGJlZm9yZVZhbHVlU3RhdGVtZW50cyA/IFtdIDogZW51bVN0YXRlbWVudHM7XG4gICAgfVxuXG4gICAgY29uc3QgZXhwclN0bXQgPSBzdG10IGFzIHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQ7XG4gICAgY29uc3QgbGVmdEV4cHIgPSBiaW5FeHByLmxlZnQgYXMgdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uIHwgdHMuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb247XG5cbiAgICBpZiAoIShsZWZ0RXhwci5leHByZXNzaW9uLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllclxuICAgICAgICAmJiAobGVmdEV4cHIuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyKS50ZXh0ID09PSBuYW1lKSkge1xuICAgICAgcmV0dXJuIGJlZm9yZVZhbHVlU3RhdGVtZW50cyA/IFtdIDogZW51bVN0YXRlbWVudHM7XG4gICAgfVxuXG4gICAgaWYgKCFiZWZvcmVWYWx1ZVN0YXRlbWVudHMgJiYgbGVmdEV4cHIua2luZCA9PT0gdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24pIHtcbiAgICAgIC8vIFdlIHNob3VsZG4ndCBmaW5kIGluZGV4IHN0YXRlbWVudHMgYWZ0ZXIgdmFsdWUgc3RhdGVtZW50cy5cbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2UgaWYgKGJlZm9yZVZhbHVlU3RhdGVtZW50cyAmJiBsZWZ0RXhwci5raW5kID09PSB0cy5TeW50YXhLaW5kLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgICBiZWZvcmVWYWx1ZVN0YXRlbWVudHMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBlbnVtU3RhdGVtZW50cy5wdXNoKGV4cHJTdG10KTtcbiAgfVxuXG4gIHJldHVybiBlbnVtU3RhdGVtZW50cztcbn1cblxuLy8gVHNpY2tsZSBlbnVtcyBoYXZlIGEgdmFyaWFibGUgc3RhdGVtZW50IHdpdGggaW5kZXhlcywgZm9sbG93ZWQgYnkgdmFsdWUgc3RhdGVtZW50cy5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9kZXZraXQvaXNzdWVzLzIyOSNpc3N1ZWNvbW1lbnQtMzM4NTEyMDU2IGZvcmUgbW9yZSBpbmZvcm1hdGlvbi5cbmZ1bmN0aW9uIGZpbmRUc2lja2xlRW51bVN0YXRlbWVudHMoXG4gIG5hbWU6IHN0cmluZyxcbiAgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10sXG4pOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50W10ge1xuICBjb25zdCBlbnVtU3RhdGVtZW50czogdHMuRXhwcmVzc2lvblN0YXRlbWVudFtdID0gW107XG4gIC8vIGxldCBiZWZvcmVWYWx1ZVN0YXRlbWVudHMgPSB0cnVlO1xuXG4gIGZvciAoY29uc3Qgc3RtdCBvZiBzdGF0ZW1lbnRzKSB7XG4gICAgLy8gRW5zdXJlIGFsbCBzdGF0ZW1lbnRzIGFyZSBvZiB0aGUgZXhwZWN0ZWQgZm9ybWF0IGFuZCB1c2luZyB0aGUgcmlnaHQgaWRlbnRpZmVyLlxuICAgIC8vIFdoZW4gd2UgZmluZCBhIHN0YXRlbWVudCB0aGF0IGlzbid0IHBhcnQgb2YgdGhlIGVudW0sIHJldHVybiB3aGF0IHdlIGNvbGxlY3RlZCBzbyBmYXIuXG4gICAgY29uc3QgYmluRXhwciA9IGRyaWxsZG93bk5vZGVzPHRzLkJpbmFyeUV4cHJlc3Npb24+KHN0bXQsXG4gICAgICBbXG4gICAgICAgIHsgcHJvcDogbnVsbCwga2luZDogdHMuU3ludGF4S2luZC5FeHByZXNzaW9uU3RhdGVtZW50IH0sXG4gICAgICAgIHsgcHJvcDogJ2V4cHJlc3Npb24nLCBraW5kOiB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb24gfSxcbiAgICAgIF0pO1xuXG4gICAgaWYgKGJpbkV4cHIgPT09IG51bGwgfHwgYmluRXhwci5sZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24pIHtcbiAgICAgIHJldHVybiBlbnVtU3RhdGVtZW50cztcbiAgICB9XG5cbiAgICBjb25zdCBleHByU3RtdCA9IHN0bXQgYXMgdHMuRXhwcmVzc2lvblN0YXRlbWVudDtcbiAgICBjb25zdCBsZWZ0RXhwciA9IGJpbkV4cHIubGVmdCBhcyB0cy5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbjtcblxuICAgIGlmICghKGxlZnRFeHByLmV4cHJlc3Npb24ua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyXG4gICAgICAgICYmIChsZWZ0RXhwci5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXIpLnRleHQgPT09IG5hbWUpKSB7XG4gICAgICByZXR1cm4gZW51bVN0YXRlbWVudHM7XG4gICAgfVxuICAgIGVudW1TdGF0ZW1lbnRzLnB1c2goZXhwclN0bXQpO1xuICB9XG5cbiAgcmV0dXJuIGVudW1TdGF0ZW1lbnRzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVXcmFwcGVkRW51bShcbiAgbmFtZTogc3RyaW5nLFxuICBob3N0Tm9kZTogdHMuVmFyaWFibGVTdGF0ZW1lbnQsXG4gIHN0YXRlbWVudHM6IEFycmF5PHRzLlN0YXRlbWVudD4sXG4gIGxpdGVyYWxJbml0aWFsaXplcjogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24gfCB1bmRlZmluZWQsXG4pOiB0cy5TdGF0ZW1lbnQge1xuICBjb25zdCBwdXJlRnVuY3Rpb25Db21tZW50ID0gJ0BfX1BVUkVfXyc7XG5cbiAgbGl0ZXJhbEluaXRpYWxpemVyID0gbGl0ZXJhbEluaXRpYWxpemVyIHx8IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoKTtcbiAgY29uc3QgaW5uZXJWYXJTdG10ID0gdHMuY3JlYXRlVmFyaWFibGVTdGF0ZW1lbnQoXG4gICAgdW5kZWZpbmVkLFxuICAgIHRzLmNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KFtcbiAgICAgIHRzLmNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb24obmFtZSwgdW5kZWZpbmVkLCBsaXRlcmFsSW5pdGlhbGl6ZXIpLFxuICAgIF0pLFxuICApO1xuXG4gIGNvbnN0IGlubmVyUmV0dXJuID0gdHMuY3JlYXRlUmV0dXJuKHRzLmNyZWF0ZUlkZW50aWZpZXIobmFtZSkpO1xuXG4gIC8vIE5PVEU6IFRTIDIuNCsgaGFzIGEgY3JlYXRlIElJRkUgaGVscGVyIG1ldGhvZFxuICBjb25zdCBpaWZlID0gdHMuY3JlYXRlQ2FsbChcbiAgICB0cy5jcmVhdGVQYXJlbihcbiAgICAgIHRzLmNyZWF0ZUZ1bmN0aW9uRXhwcmVzc2lvbihcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBbXSxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB0cy5jcmVhdGVCbG9jayhbXG4gICAgICAgICAgaW5uZXJWYXJTdG10LFxuICAgICAgICAgIC4uLnN0YXRlbWVudHMsXG4gICAgICAgICAgaW5uZXJSZXR1cm4sXG4gICAgICAgIF0pLFxuICAgICAgKSxcbiAgICApLFxuICAgIHVuZGVmaW5lZCxcbiAgICBbXSxcbiAgKTtcblxuICAvLyBVcGRhdGUgZXhpc3RpbmcgaG9zdCBub2RlIHdpdGggdGhlIHB1cmUgY29tbWVudCBiZWZvcmUgdGhlIHZhcmlhYmxlIGRlY2xhcmF0aW9uIGluaXRpYWxpemVyLlxuICBjb25zdCB2YXJpYWJsZURlY2xhcmF0aW9uID0gaG9zdE5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9uc1swXTtcbiAgY29uc3Qgb3V0ZXJWYXJTdG10ID0gdHMudXBkYXRlVmFyaWFibGVTdGF0ZW1lbnQoXG4gICAgaG9zdE5vZGUsXG4gICAgaG9zdE5vZGUubW9kaWZpZXJzLFxuICAgIHRzLnVwZGF0ZVZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KFxuICAgICAgaG9zdE5vZGUuZGVjbGFyYXRpb25MaXN0LFxuICAgICAgW1xuICAgICAgICB0cy51cGRhdGVWYXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICAgIHZhcmlhYmxlRGVjbGFyYXRpb24sXG4gICAgICAgICAgdmFyaWFibGVEZWNsYXJhdGlvbi5uYW1lLFxuICAgICAgICAgIHZhcmlhYmxlRGVjbGFyYXRpb24udHlwZSxcbiAgICAgICAgICB0cy5hZGRTeW50aGV0aWNMZWFkaW5nQ29tbWVudChcbiAgICAgICAgICAgIGlpZmUsIHRzLlN5bnRheEtpbmQuTXVsdGlMaW5lQ29tbWVudFRyaXZpYSwgcHVyZUZ1bmN0aW9uQ29tbWVudCwgZmFsc2UsXG4gICAgICAgICAgKSxcbiAgICAgICAgKSxcbiAgICAgIF0sXG4gICAgKSxcbiAgKTtcblxuICByZXR1cm4gb3V0ZXJWYXJTdG10O1xufVxuIl19