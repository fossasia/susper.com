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
// NOTE: 'isXXXX' helper functions can be replaced with native TS helpers with TS 2.4+
function isVariableStatement(node) {
    return node.kind === ts.SyntaxKind.VariableStatement;
}
function isIdentifier(node) {
    return node.kind === ts.SyntaxKind.Identifier;
}
function isObjectLiteralExpression(node) {
    return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
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
            && isVariableStatement(currentStatement)
            && currentStatement.declarationList.declarations.length === 1) {
            const variableDeclaration = currentStatement.declarationList.declarations[0];
            if (isIdentifier(variableDeclaration.name)) {
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
                else if (isObjectLiteralExpression(variableDeclaration.initializer)
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
                else if (isObjectLiteralExpression(variableDeclaration.initializer)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC1lbnVtcy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvd3JhcC1lbnVtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUNqQyxvREFBc0Q7QUFHdEQsdUJBQThCLE9BQWU7SUFDM0MsTUFBTSxPQUFPLEdBQUc7UUFDZCxpQ0FBaUM7UUFDakMsNkdBQTZHO1FBQzdHLHFLQUFxSztRQUNySywyQkFBMkI7S0FFNUIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBVkQsc0NBVUM7QUFFRCxxQkFBcUIsSUFBYTtJQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUs7V0FDakMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVc7V0FDdkMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVU7V0FDdEMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWE7V0FDekMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztBQUNoRCxDQUFDO0FBRUQsc0ZBQXNGO0FBRXRGLDZCQUE2QixJQUFhO0lBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUM7QUFDdkQsQ0FBQztBQUVELHNCQUFzQixJQUFhO0lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFB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MEJBQTBCLENBQzNCLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLEtBQUssQ0FDdkUsQ0FDRjtLQUNGLENBQ0YsQ0FDRixDQUFDO0lBRUYsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN0QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgeyBkcmlsbGRvd25Ob2RlcyB9IGZyb20gJy4uL2hlbHBlcnMvYXN0LXV0aWxzJztcblxuXG5leHBvcnQgZnVuY3Rpb24gdGVzdFdyYXBFbnVtcyhjb250ZW50OiBzdHJpbmcpIHtcbiAgY29uc3QgcmVnZXhlcyA9IFtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbiAgICAvdmFyIChcXFMrKSA9IFxce1xcfTtcXHI/XFxuKFxcMVxcLihcXFMrKSA9IFxcZCs7XFxyP1xcbikrXFwxXFxbXFwxXFwuKFxcUyspXFxdID0gXCJcXDRcIjtcXHI/XFxuKFxcMVxcW1xcMVxcLihcXFMrKVxcXSA9IFwiXFxTK1wiO1xccj9cXG4qKSsvLFxuICAgIC92YXIgKFxcUyspOyhcXC9cXCpAX19QVVJFX19cXCpcXC8pKlxccj9cXG5cXChmdW5jdGlvbiBcXChcXDFcXCkgXFx7XFxzKyhcXDFcXFtcXDFcXFtcIihcXFMrKVwiXFxdID0gMFxcXSA9IFwiXFw0XCI7KFxccytcXDFcXFtcXDFcXFtcIlxcUytcIlxcXSA9IFxcZFxcXSA9IFwiXFxTK1wiOykqXFxyP1xcbilcXH1cXClcXChcXDEgXFx8XFx8IFxcKFxcMSA9IFxce1xcfVxcKVxcKTsvLFxuICAgIC9cXC9cXCpcXCogQGVudW0gXFx7XFx3K1xcfSBcXCpcXC8vLFxuICAvLyB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aFxuICBdO1xuXG4gIHJldHVybiByZWdleGVzLnNvbWUoKHJlZ2V4KSA9PiByZWdleC50ZXN0KGNvbnRlbnQpKTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja0xpa2Uobm9kZTogdHMuTm9kZSk6IG5vZGUgaXMgdHMuQmxvY2tMaWtlIHtcbiAgcmV0dXJuIG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5CbG9ja1xuICAgICAgfHwgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLk1vZHVsZUJsb2NrXG4gICAgICB8fCBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2FzZUNsYXVzZVxuICAgICAgfHwgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkRlZmF1bHRDbGF1c2VcbiAgICAgIHx8IG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5Tb3VyY2VGaWxlO1xufVxuXG4vLyBOT1RFOiAnaXNYWFhYJyBoZWxwZXIgZnVuY3Rpb25zIGNhbiBiZSByZXBsYWNlZCB3aXRoIG5hdGl2ZSBUUyBoZWxwZXJzIHdpdGggVFMgMi40K1xuXG5mdW5jdGlvbiBpc1ZhcmlhYmxlU3RhdGVtZW50KG5vZGU6IHRzLk5vZGUpOiBub2RlIGlzIHRzLlZhcmlhYmxlU3RhdGVtZW50IHtcbiAgcmV0dXJuIG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5WYXJpYWJsZVN0YXRlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNJZGVudGlmaWVyKG5vZGU6IHRzLk5vZGUpOiBub2RlIGlzIHRzLklkZW50aWZpZXIge1xuICByZXR1cm4gbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXI7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obm9kZTogdHMuTm9kZSk6IG5vZGUgaXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24ge1xuICByZXR1cm4gbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLk9iamVjdExpdGVyYWxFeHByZXNzaW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V3JhcEVudW1zVHJhbnNmb3JtZXIoKTogdHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLlNvdXJjZUZpbGU+IHtcbiAgcmV0dXJuIChjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpOiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtZXI6IHRzLlRyYW5zZm9ybWVyPHRzLlNvdXJjZUZpbGU+ID0gKHNmOiB0cy5Tb3VyY2VGaWxlKSA9PiB7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHZpc2l0QmxvY2tTdGF0ZW1lbnRzKHNmLnN0YXRlbWVudHMsIGNvbnRleHQpO1xuXG4gICAgICByZXR1cm4gdHMudXBkYXRlU291cmNlRmlsZU5vZGUoc2YsIHJlc3VsdCk7XG4gICAgfTtcblxuICAgIHJldHVybiB0cmFuc2Zvcm1lcjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdmlzaXRCbG9ja1N0YXRlbWVudHMoXG4gIHN0YXRlbWVudHM6IHRzLk5vZGVBcnJheTx0cy5TdGF0ZW1lbnQ+LFxuICBjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQsXG4pOiB0cy5Ob2RlQXJyYXk8dHMuU3RhdGVtZW50PiB7XG5cbiAgLy8gY29weSBvZiBzdGF0ZW1lbnRzIHRvIG1vZGlmeTsgbGF6eSBpbml0aWFsaXplZFxuICBsZXQgdXBkYXRlZFN0YXRlbWVudHM6IEFycmF5PHRzLlN0YXRlbWVudD4gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3QgdmlzaXRvcjogdHMuVmlzaXRvciA9IChub2RlKSA9PiB7XG4gICAgaWYgKGlzQmxvY2tMaWtlKG5vZGUpKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB2aXNpdEJsb2NrU3RhdGVtZW50cyhub2RlLnN0YXRlbWVudHMsIGNvbnRleHQpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gbm9kZS5zdGF0ZW1lbnRzKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgICAgc3dpdGNoIChub2RlLmtpbmQpIHtcbiAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkJsb2NrOlxuICAgICAgICAgIHJldHVybiB0cy51cGRhdGVCbG9jayhub2RlIGFzIHRzLkJsb2NrLCByZXN1bHQpO1xuICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuTW9kdWxlQmxvY2s6XG4gICAgICAgICAgcmV0dXJuIHRzLnVwZGF0ZU1vZHVsZUJsb2NrKG5vZGUgYXMgdHMuTW9kdWxlQmxvY2ssIHJlc3VsdCk7XG4gICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5DYXNlQ2xhdXNlOlxuICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IG5vZGUgYXMgdHMuQ2FzZUNsYXVzZTtcblxuICAgICAgICAgIHJldHVybiB0cy51cGRhdGVDYXNlQ2xhdXNlKGNsYXVzZSwgY2xhdXNlLmV4cHJlc3Npb24sIHJlc3VsdCk7XG4gICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5EZWZhdWx0Q2xhdXNlOlxuICAgICAgICAgIHJldHVybiB0cy51cGRhdGVEZWZhdWx0Q2xhdXNlKG5vZGUgYXMgdHMuRGVmYXVsdENsYXVzZSwgcmVzdWx0KTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgIH1cbiAgfTtcblxuICAvLyAnb0luZGV4JyBpcyB0aGUgb3JpZ2luYWwgc3RhdGVtZW50IGluZGV4OyAndUluZGV4JyBpcyB0aGUgdXBkYXRlZCBzdGF0ZW1lbnQgaW5kZXhcbiAgZm9yIChsZXQgb0luZGV4ID0gMCwgdUluZGV4ID0gMDsgb0luZGV4IDwgc3RhdGVtZW50cy5sZW5ndGg7IG9JbmRleCsrLCB1SW5kZXgrKykge1xuICAgIGNvbnN0IGN1cnJlbnRTdGF0ZW1lbnQgPSBzdGF0ZW1lbnRzW29JbmRleF07XG5cbiAgICAvLyB0aGVzZSBjYW4ndCBjb250YWluIGFuIGVudW0gZGVjbGFyYXRpb25cbiAgICBpZiAoY3VycmVudFN0YXRlbWVudC5raW5kID09PSB0cy5TeW50YXhLaW5kLkltcG9ydERlY2xhcmF0aW9uKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBlbnVtIGRlY2xhcmF0aW9ucyBtdXN0OlxuICAgIC8vICAgKiBub3QgYmUgbGFzdCBzdGF0ZW1lbnRcbiAgICAvLyAgICogYmUgYSB2YXJpYWJsZSBzdGF0ZW1lbnRcbiAgICAvLyAgICogaGF2ZSBvbmx5IG9uZSBkZWNsYXJhdGlvblxuICAgIC8vICAgKiBoYXZlIGFuIGlkZW50aWZlciBhcyBhIGRlY2xhcmF0aW9uIG5hbWVcbiAgICBpZiAob0luZGV4IDwgc3RhdGVtZW50cy5sZW5ndGggLSAxXG4gICAgICAgICYmIGlzVmFyaWFibGVTdGF0ZW1lbnQoY3VycmVudFN0YXRlbWVudClcbiAgICAgICAgJiYgY3VycmVudFN0YXRlbWVudC5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zLmxlbmd0aCA9PT0gMSkge1xuXG4gICAgICBjb25zdCB2YXJpYWJsZURlY2xhcmF0aW9uID0gY3VycmVudFN0YXRlbWVudC5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zWzBdO1xuICAgICAgaWYgKGlzSWRlbnRpZmllcih2YXJpYWJsZURlY2xhcmF0aW9uLm5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSB2YXJpYWJsZURlY2xhcmF0aW9uLm5hbWUudGV4dDtcblxuICAgICAgICBpZiAoIXZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICBjb25zdCBlbnVtU3RhdGVtZW50cyA9IGZpbmRUczJfM0VudW1TdGF0ZW1lbnRzKG5hbWUsIHN0YXRlbWVudHNbb0luZGV4ICsgMV0pO1xuICAgICAgICAgIGlmIChlbnVtU3RhdGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBmb3VuZCBhbiBlbnVtXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZWRTdGF0ZW1lbnRzKSB7XG4gICAgICAgICAgICAgIHVwZGF0ZWRTdGF0ZW1lbnRzID0gc3RhdGVtZW50cy5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY3JlYXRlIHdyYXBwZXIgYW5kIHJlcGxhY2UgdmFyaWFibGUgc3RhdGVtZW50IGFuZCBJSUZFXG4gICAgICAgICAgICB1cGRhdGVkU3RhdGVtZW50cy5zcGxpY2UodUluZGV4LCAyLCBjcmVhdGVXcmFwcGVkRW51bShcbiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgY3VycmVudFN0YXRlbWVudCxcbiAgICAgICAgICAgICAgZW51bVN0YXRlbWVudHMsXG4gICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgLy8gc2tpcCBJSUZFIHN0YXRlbWVudFxuICAgICAgICAgICAgb0luZGV4Kys7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbih2YXJpYWJsZURlY2xhcmF0aW9uLmluaXRpYWxpemVyKVxuICAgICAgICAgICAgICAgICAgICYmIHZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIucHJvcGVydGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBjb25zdCBuZXh0U3RhdGVtZW50cyA9IHN0YXRlbWVudHMuc2xpY2Uob0luZGV4ICsgMSk7XG4gICAgICAgICAgY29uc3QgZW51bVN0YXRlbWVudHMgPSBmaW5kVHMyXzJFbnVtU3RhdGVtZW50cyhuYW1lLCBuZXh0U3RhdGVtZW50cyk7XG4gICAgICAgICAgaWYgKGVudW1TdGF0ZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIGZvdW5kIGFuIGVudW1cbiAgICAgICAgICAgIGlmICghdXBkYXRlZFN0YXRlbWVudHMpIHtcbiAgICAgICAgICAgICAgdXBkYXRlZFN0YXRlbWVudHMgPSBzdGF0ZW1lbnRzLnNsaWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjcmVhdGUgd3JhcHBlciBhbmQgcmVwbGFjZSB2YXJpYWJsZSBzdGF0ZW1lbnQgYW5kIGVudW0gbWVtYmVyIHN0YXRlbWVudHNcbiAgICAgICAgICAgIHVwZGF0ZWRTdGF0ZW1lbnRzLnNwbGljZSh1SW5kZXgsIGVudW1TdGF0ZW1lbnRzLmxlbmd0aCArIDEsIGNyZWF0ZVdyYXBwZWRFbnVtKFxuICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICBjdXJyZW50U3RhdGVtZW50LFxuICAgICAgICAgICAgICBlbnVtU3RhdGVtZW50cyxcbiAgICAgICAgICAgICAgdmFyaWFibGVEZWNsYXJhdGlvbi5pbml0aWFsaXplcixcbiAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgLy8gc2tpcCBlbnVtIG1lbWJlciBkZWNsYXJhdGlvbnNcbiAgICAgICAgICAgIG9JbmRleCArPSBlbnVtU3RhdGVtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbih2YXJpYWJsZURlY2xhcmF0aW9uLmluaXRpYWxpemVyKVxuICAgICAgICAgICYmIHZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIucHJvcGVydGllcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICBjb25zdCBsaXRlcmFsUHJvcGVydHlDb3VudCA9IHZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIucHJvcGVydGllcy5sZW5ndGg7XG4gICAgICAgICAgY29uc3QgbmV4dFN0YXRlbWVudHMgPSBzdGF0ZW1lbnRzLnNsaWNlKG9JbmRleCArIDEpO1xuICAgICAgICAgIGNvbnN0IGVudW1TdGF0ZW1lbnRzID0gZmluZFRzaWNrbGVFbnVtU3RhdGVtZW50cyhuYW1lLCBuZXh0U3RhdGVtZW50cyk7XG4gICAgICAgICAgaWYgKGVudW1TdGF0ZW1lbnRzLmxlbmd0aCA9PT0gbGl0ZXJhbFByb3BlcnR5Q291bnQpIHtcbiAgICAgICAgICAgIC8vIGZvdW5kIGFuIGVudW1cbiAgICAgICAgICAgIGlmICghdXBkYXRlZFN0YXRlbWVudHMpIHtcbiAgICAgICAgICAgICAgdXBkYXRlZFN0YXRlbWVudHMgPSBzdGF0ZW1lbnRzLnNsaWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjcmVhdGUgd3JhcHBlciBhbmQgcmVwbGFjZSB2YXJpYWJsZSBzdGF0ZW1lbnQgYW5kIGVudW0gbWVtYmVyIHN0YXRlbWVudHNcbiAgICAgICAgICAgIHVwZGF0ZWRTdGF0ZW1lbnRzLnNwbGljZSh1SW5kZXgsIGVudW1TdGF0ZW1lbnRzLmxlbmd0aCArIDEsIGNyZWF0ZVdyYXBwZWRFbnVtKFxuICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICBjdXJyZW50U3RhdGVtZW50LFxuICAgICAgICAgICAgICBlbnVtU3RhdGVtZW50cyxcbiAgICAgICAgICAgICAgdmFyaWFibGVEZWNsYXJhdGlvbi5pbml0aWFsaXplcixcbiAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgLy8gc2tpcCBlbnVtIG1lbWJlciBkZWNsYXJhdGlvbnNcbiAgICAgICAgICAgIG9JbmRleCArPSBlbnVtU3RhdGVtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSB0cy52aXNpdE5vZGUoY3VycmVudFN0YXRlbWVudCwgdmlzaXRvcik7XG4gICAgaWYgKHJlc3VsdCAhPT0gY3VycmVudFN0YXRlbWVudCkge1xuICAgICAgaWYgKCF1cGRhdGVkU3RhdGVtZW50cykge1xuICAgICAgICB1cGRhdGVkU3RhdGVtZW50cyA9IHN0YXRlbWVudHMuc2xpY2UoKTtcbiAgICAgIH1cbiAgICAgIHVwZGF0ZWRTdGF0ZW1lbnRzW3VJbmRleF0gPSByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgY2hhbmdlcywgcmV0dXJuIHVwZGF0ZWQgc3RhdGVtZW50c1xuICAvLyBvdGhlcndpc2UsIHJldHVybiBvcmlnaW5hbCBhcnJheSBpbnN0YW5jZVxuICByZXR1cm4gdXBkYXRlZFN0YXRlbWVudHMgPyB0cy5jcmVhdGVOb2RlQXJyYXkodXBkYXRlZFN0YXRlbWVudHMpIDogc3RhdGVtZW50cztcbn1cblxuLy8gVFMgMi4zIGVudW1zIGhhdmUgc3RhdGVtZW50cyB0aGF0IGFyZSBpbnNpZGUgYSBJSUZFLlxuZnVuY3Rpb24gZmluZFRzMl8zRW51bVN0YXRlbWVudHMobmFtZTogc3RyaW5nLCBzdGF0ZW1lbnQ6IHRzLlN0YXRlbWVudCk6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnRbXSB7XG4gIGNvbnN0IGVudW1TdGF0ZW1lbnRzOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50W10gPSBbXTtcbiAgY29uc3Qgbm9Ob2RlczogdHMuRXhwcmVzc2lvblN0YXRlbWVudFtdID0gW107XG5cbiAgY29uc3QgZnVuY0V4cHIgPSBkcmlsbGRvd25Ob2Rlczx0cy5GdW5jdGlvbkV4cHJlc3Npb24+KHN0YXRlbWVudCxcbiAgICBbXG4gICAgICB7IHByb3A6IG51bGwsIGtpbmQ6IHRzLlN5bnRheEtpbmQuRXhwcmVzc2lvblN0YXRlbWVudCB9LFxuICAgICAgeyBwcm9wOiAnZXhwcmVzc2lvbicsIGtpbmQ6IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24gfSxcbiAgICAgIHsgcHJvcDogJ2V4cHJlc3Npb24nLCBraW5kOiB0cy5TeW50YXhLaW5kLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uIH0sXG4gICAgICB7IHByb3A6ICdleHByZXNzaW9uJywga2luZDogdHMuU3ludGF4S2luZC5GdW5jdGlvbkV4cHJlc3Npb24gfSxcbiAgICBdKTtcblxuICBpZiAoZnVuY0V4cHIgPT09IG51bGwpIHsgcmV0dXJuIG5vTm9kZXM7IH1cblxuICBpZiAoIShcbiAgICBmdW5jRXhwci5wYXJhbWV0ZXJzLmxlbmd0aCA9PT0gMVxuICAgICYmIGZ1bmNFeHByLnBhcmFtZXRlcnNbMF0ubmFtZS5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXJcbiAgICAmJiAoZnVuY0V4cHIucGFyYW1ldGVyc1swXS5uYW1lIGFzIHRzLklkZW50aWZpZXIpLnRleHQgPT09IG5hbWVcbiAgKSkge1xuICAgIHJldHVybiBub05vZGVzO1xuICB9XG5cbiAgLy8gSW4gVFMgMi4zIGVudW1zLCB0aGUgSUlGRSBjb250YWlucyBvbmx5IGV4cHJlc3Npb25zIHdpdGggYSBjZXJ0YWluIGZvcm1hdC5cbiAgLy8gSWYgd2UgZmluZCBhbnkgdGhhdCBpcyBkaWZmZXJlbnQsIHdlIGlnbm9yZSB0aGUgd2hvbGUgdGhpbmcuXG4gIGZvciAoY29uc3QgaW5uZXJTdG10IG9mIGZ1bmNFeHByLmJvZHkuc3RhdGVtZW50cykge1xuXG4gICAgY29uc3QgaW5uZXJCaW5FeHByID0gZHJpbGxkb3duTm9kZXM8dHMuQmluYXJ5RXhwcmVzc2lvbj4oaW5uZXJTdG10LFxuICAgICAgW1xuICAgICAgICB7IHByb3A6IG51bGwsIGtpbmQ6IHRzLlN5bnRheEtpbmQuRXhwcmVzc2lvblN0YXRlbWVudCB9LFxuICAgICAgICB7IHByb3A6ICdleHByZXNzaW9uJywga2luZDogdHMuU3ludGF4S2luZC5CaW5hcnlFeHByZXNzaW9uIH0sXG4gICAgICBdKTtcblxuICAgIGlmIChpbm5lckJpbkV4cHIgPT09IG51bGwpIHsgcmV0dXJuIG5vTm9kZXM7IH1cblxuICAgIGNvbnN0IGV4cHJTdG10ID0gaW5uZXJTdG10IGFzIHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQ7XG5cbiAgICBpZiAoIShpbm5lckJpbkV4cHIub3BlcmF0b3JUb2tlbi5raW5kID09PSB0cy5TeW50YXhLaW5kLkZpcnN0QXNzaWdubWVudFxuICAgICAgICAmJiBpbm5lckJpbkV4cHIubGVmdC5raW5kID09PSB0cy5TeW50YXhLaW5kLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKSkge1xuICAgICAgcmV0dXJuIG5vTm9kZXM7XG4gICAgfVxuXG4gICAgY29uc3QgaW5uZXJFbGVtQWNjID0gaW5uZXJCaW5FeHByLmxlZnQgYXMgdHMuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb247XG5cbiAgICBpZiAoIShcbiAgICAgIGlubmVyRWxlbUFjYy5leHByZXNzaW9uLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllclxuICAgICAgJiYgKGlubmVyRWxlbUFjYy5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXIpLnRleHQgPT09IG5hbWVcbiAgICAgICYmIGlubmVyRWxlbUFjYy5hcmd1bWVudEV4cHJlc3Npb25cbiAgICAgICYmIGlubmVyRWxlbUFjYy5hcmd1bWVudEV4cHJlc3Npb24ua2luZCA9PT0gdHMuU3ludGF4S2luZC5CaW5hcnlFeHByZXNzaW9uXG4gICAgKSkge1xuICAgICAgcmV0dXJuIG5vTm9kZXM7XG4gICAgfVxuXG4gICAgY29uc3QgaW5uZXJBcmdCaW5FeHByID0gaW5uZXJFbGVtQWNjLmFyZ3VtZW50RXhwcmVzc2lvbiBhcyB0cy5CaW5hcnlFeHByZXNzaW9uO1xuXG4gICAgaWYgKGlubmVyQXJnQmluRXhwci5sZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24pIHtcbiAgICAgIHJldHVybiBub05vZGVzO1xuICAgIH1cblxuICAgIGNvbnN0IGlubmVyQXJnRWxlbUFjYyA9IGlubmVyQXJnQmluRXhwci5sZWZ0IGFzIHRzLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uO1xuXG4gICAgaWYgKCEoXG4gICAgICBpbm5lckFyZ0VsZW1BY2MuZXhwcmVzc2lvbi5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXJcbiAgICAgICYmIChpbm5lckFyZ0VsZW1BY2MuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyKS50ZXh0ID09PSBuYW1lXG4gICAgKSkge1xuICAgICAgcmV0dXJuIG5vTm9kZXM7XG4gICAgfVxuXG4gICAgZW51bVN0YXRlbWVudHMucHVzaChleHByU3RtdCk7XG4gIH1cblxuICByZXR1cm4gZW51bVN0YXRlbWVudHM7XG59XG5cbi8vIFRTIDIuMiBlbnVtcyBoYXZlIHN0YXRlbWVudHMgYWZ0ZXIgdGhlIHZhcmlhYmxlIGRlY2xhcmF0aW9uLCB3aXRoIGluZGV4IHN0YXRlbWVudHMgZm9sbG93ZWRcbi8vIGJ5IHZhbHVlIHN0YXRlbWVudHMuXG5mdW5jdGlvbiBmaW5kVHMyXzJFbnVtU3RhdGVtZW50cyhcbiAgbmFtZTogc3RyaW5nLFxuICBzdGF0ZW1lbnRzOiB0cy5TdGF0ZW1lbnRbXSxcbik6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnRbXSB7XG4gIGNvbnN0IGVudW1TdGF0ZW1lbnRzOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50W10gPSBbXTtcbiAgbGV0IGJlZm9yZVZhbHVlU3RhdGVtZW50cyA9IHRydWU7XG5cbiAgZm9yIChjb25zdCBzdG10IG9mIHN0YXRlbWVudHMpIHtcbiAgICAvLyBFbnN1cmUgYWxsIHN0YXRlbWVudHMgYXJlIG9mIHRoZSBleHBlY3RlZCBmb3JtYXQgYW5kIHVzaW5nIHRoZSByaWdodCBpZGVudGlmZXIuXG4gICAgLy8gV2hlbiB3ZSBmaW5kIGEgc3RhdGVtZW50IHRoYXQgaXNuJ3QgcGFydCBvZiB0aGUgZW51bSwgcmV0dXJuIHdoYXQgd2UgY29sbGVjdGVkIHNvIGZhci5cbiAgICBjb25zdCBiaW5FeHByID0gZHJpbGxkb3duTm9kZXM8dHMuQmluYXJ5RXhwcmVzc2lvbj4oc3RtdCxcbiAgICAgIFtcbiAgICAgICAgeyBwcm9wOiBudWxsLCBraW5kOiB0cy5TeW50YXhLaW5kLkV4cHJlc3Npb25TdGF0ZW1lbnQgfSxcbiAgICAgICAgeyBwcm9wOiAnZXhwcmVzc2lvbicsIGtpbmQ6IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbiB9LFxuICAgICAgXSk7XG5cbiAgICBpZiAoYmluRXhwciA9PT0gbnVsbFxuICAgICAgfHwgKGJpbkV4cHIubGVmdC5raW5kICE9PSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvblxuICAgICAgICAmJiBiaW5FeHByLmxlZnQua2luZCAhPT0gdHMuU3ludGF4S2luZC5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbilcbiAgICApIHtcbiAgICAgIHJldHVybiBiZWZvcmVWYWx1ZVN0YXRlbWVudHMgPyBbXSA6IGVudW1TdGF0ZW1lbnRzO1xuICAgIH1cblxuICAgIGNvbnN0IGV4cHJTdG10ID0gc3RtdCBhcyB0cy5FeHByZXNzaW9uU3RhdGVtZW50O1xuICAgIGNvbnN0IGxlZnRFeHByID0gYmluRXhwci5sZWZ0IGFzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbiB8IHRzLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uO1xuXG4gICAgaWYgKCEobGVmdEV4cHIuZXhwcmVzc2lvbi5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXJcbiAgICAgICAgJiYgKGxlZnRFeHByLmV4cHJlc3Npb24gYXMgdHMuSWRlbnRpZmllcikudGV4dCA9PT0gbmFtZSkpIHtcbiAgICAgIHJldHVybiBiZWZvcmVWYWx1ZVN0YXRlbWVudHMgPyBbXSA6IGVudW1TdGF0ZW1lbnRzO1xuICAgIH1cblxuICAgIGlmICghYmVmb3JlVmFsdWVTdGF0ZW1lbnRzICYmIGxlZnRFeHByLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgICAvLyBXZSBzaG91bGRuJ3QgZmluZCBpbmRleCBzdGF0ZW1lbnRzIGFmdGVyIHZhbHVlIHN0YXRlbWVudHMuXG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIGlmIChiZWZvcmVWYWx1ZVN0YXRlbWVudHMgJiYgbGVmdEV4cHIua2luZCA9PT0gdHMuU3ludGF4S2luZC5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbikge1xuICAgICAgYmVmb3JlVmFsdWVTdGF0ZW1lbnRzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZW51bVN0YXRlbWVudHMucHVzaChleHByU3RtdCk7XG4gIH1cblxuICByZXR1cm4gZW51bVN0YXRlbWVudHM7XG59XG5cbi8vIFRzaWNrbGUgZW51bXMgaGF2ZSBhIHZhcmlhYmxlIHN0YXRlbWVudCB3aXRoIGluZGV4ZXMsIGZvbGxvd2VkIGJ5IHZhbHVlIHN0YXRlbWVudHMuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvZGV2a2l0L2lzc3Vlcy8yMjkjaXNzdWVjb21tZW50LTMzODUxMjA1NiBmb3JlIG1vcmUgaW5mb3JtYXRpb24uXG5mdW5jdGlvbiBmaW5kVHNpY2tsZUVudW1TdGF0ZW1lbnRzKFxuICBuYW1lOiBzdHJpbmcsXG4gIHN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdLFxuKTogdHMuRXhwcmVzc2lvblN0YXRlbWVudFtdIHtcbiAgY29uc3QgZW51bVN0YXRlbWVudHM6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnRbXSA9IFtdO1xuICAvLyBsZXQgYmVmb3JlVmFsdWVTdGF0ZW1lbnRzID0gdHJ1ZTtcblxuICBmb3IgKGNvbnN0IHN0bXQgb2Ygc3RhdGVtZW50cykge1xuICAgIC8vIEVuc3VyZSBhbGwgc3RhdGVtZW50cyBhcmUgb2YgdGhlIGV4cGVjdGVkIGZvcm1hdCBhbmQgdXNpbmcgdGhlIHJpZ2h0IGlkZW50aWZlci5cbiAgICAvLyBXaGVuIHdlIGZpbmQgYSBzdGF0ZW1lbnQgdGhhdCBpc24ndCBwYXJ0IG9mIHRoZSBlbnVtLCByZXR1cm4gd2hhdCB3ZSBjb2xsZWN0ZWQgc28gZmFyLlxuICAgIGNvbnN0IGJpbkV4cHIgPSBkcmlsbGRvd25Ob2Rlczx0cy5CaW5hcnlFeHByZXNzaW9uPihzdG10LFxuICAgICAgW1xuICAgICAgICB7IHByb3A6IG51bGwsIGtpbmQ6IHRzLlN5bnRheEtpbmQuRXhwcmVzc2lvblN0YXRlbWVudCB9LFxuICAgICAgICB7IHByb3A6ICdleHByZXNzaW9uJywga2luZDogdHMuU3ludGF4S2luZC5CaW5hcnlFeHByZXNzaW9uIH0sXG4gICAgICBdKTtcblxuICAgIGlmIChiaW5FeHByID09PSBudWxsIHx8IGJpbkV4cHIubGVmdC5raW5kICE9PSB0cy5TeW50YXhLaW5kLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgICByZXR1cm4gZW51bVN0YXRlbWVudHM7XG4gICAgfVxuXG4gICAgY29uc3QgZXhwclN0bXQgPSBzdG10IGFzIHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQ7XG4gICAgY29uc3QgbGVmdEV4cHIgPSBiaW5FeHByLmxlZnQgYXMgdHMuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb247XG5cbiAgICBpZiAoIShsZWZ0RXhwci5leHByZXNzaW9uLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllclxuICAgICAgICAmJiAobGVmdEV4cHIuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyKS50ZXh0ID09PSBuYW1lKSkge1xuICAgICAgcmV0dXJuIGVudW1TdGF0ZW1lbnRzO1xuICAgIH1cbiAgICBlbnVtU3RhdGVtZW50cy5wdXNoKGV4cHJTdG10KTtcbiAgfVxuXG4gIHJldHVybiBlbnVtU3RhdGVtZW50cztcbn1cblxuZnVuY3Rpb24gY3JlYXRlV3JhcHBlZEVudW0oXG4gIG5hbWU6IHN0cmluZyxcbiAgaG9zdE5vZGU6IHRzLlZhcmlhYmxlU3RhdGVtZW50LFxuICBzdGF0ZW1lbnRzOiBBcnJheTx0cy5TdGF0ZW1lbnQ+LFxuICBsaXRlcmFsSW5pdGlhbGl6ZXI6IHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uIHwgdW5kZWZpbmVkLFxuKTogdHMuU3RhdGVtZW50IHtcbiAgY29uc3QgcHVyZUZ1bmN0aW9uQ29tbWVudCA9ICdAX19QVVJFX18nO1xuXG4gIGxpdGVyYWxJbml0aWFsaXplciA9IGxpdGVyYWxJbml0aWFsaXplciB8fCB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKCk7XG4gIGNvbnN0IGlubmVyVmFyU3RtdCA9IHRzLmNyZWF0ZVZhcmlhYmxlU3RhdGVtZW50KFxuICAgIHVuZGVmaW5lZCxcbiAgICB0cy5jcmVhdGVWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChbXG4gICAgICB0cy5jcmVhdGVWYXJpYWJsZURlY2xhcmF0aW9uKG5hbWUsIHVuZGVmaW5lZCwgbGl0ZXJhbEluaXRpYWxpemVyKSxcbiAgICBdKSxcbiAgKTtcblxuICBjb25zdCBpbm5lclJldHVybiA9IHRzLmNyZWF0ZVJldHVybih0cy5jcmVhdGVJZGVudGlmaWVyKG5hbWUpKTtcblxuICAvLyBOT1RFOiBUUyAyLjQrIGhhcyBhIGNyZWF0ZSBJSUZFIGhlbHBlciBtZXRob2RcbiAgY29uc3QgaWlmZSA9IHRzLmNyZWF0ZUNhbGwoXG4gICAgdHMuY3JlYXRlUGFyZW4oXG4gICAgICB0cy5jcmVhdGVGdW5jdGlvbkV4cHJlc3Npb24oXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgW10sXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdHMuY3JlYXRlQmxvY2soW1xuICAgICAgICAgIGlubmVyVmFyU3RtdCxcbiAgICAgICAgICAuLi5zdGF0ZW1lbnRzLFxuICAgICAgICAgIGlubmVyUmV0dXJuLFxuICAgICAgICBdKSxcbiAgICAgICksXG4gICAgKSxcbiAgICB1bmRlZmluZWQsXG4gICAgW10sXG4gICk7XG5cbiAgLy8gVXBkYXRlIGV4aXN0aW5nIGhvc3Qgbm9kZSB3aXRoIHRoZSBwdXJlIGNvbW1lbnQgYmVmb3JlIHRoZSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBpbml0aWFsaXplci5cbiAgY29uc3QgdmFyaWFibGVEZWNsYXJhdGlvbiA9IGhvc3ROb2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbMF07XG4gIGNvbnN0IG91dGVyVmFyU3RtdCA9IHRzLnVwZGF0ZVZhcmlhYmxlU3RhdGVtZW50KFxuICAgIGhvc3ROb2RlLFxuICAgIGhvc3ROb2RlLm1vZGlmaWVycyxcbiAgICB0cy51cGRhdGVWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChcbiAgICAgIGhvc3ROb2RlLmRlY2xhcmF0aW9uTGlzdCxcbiAgICAgIFtcbiAgICAgICAgdHMudXBkYXRlVmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAgICB2YXJpYWJsZURlY2xhcmF0aW9uLFxuICAgICAgICAgIHZhcmlhYmxlRGVjbGFyYXRpb24ubmFtZSxcbiAgICAgICAgICB2YXJpYWJsZURlY2xhcmF0aW9uLnR5cGUsXG4gICAgICAgICAgdHMuYWRkU3ludGhldGljTGVhZGluZ0NvbW1lbnQoXG4gICAgICAgICAgICBpaWZlLCB0cy5TeW50YXhLaW5kLk11bHRpTGluZUNvbW1lbnRUcml2aWEsIHB1cmVGdW5jdGlvbkNvbW1lbnQsIGZhbHNlLFxuICAgICAgICAgICksXG4gICAgICAgICksXG4gICAgICBdLFxuICAgICksXG4gICk7XG5cbiAgcmV0dXJuIG91dGVyVmFyU3RtdDtcbn1cbiJdfQ==