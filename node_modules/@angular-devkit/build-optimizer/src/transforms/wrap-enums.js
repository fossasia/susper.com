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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC1lbnVtcy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvd3JhcC1lbnVtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUNqQyxvREFBc0Q7QUFHdEQsdUJBQThCLE9BQWU7SUFDM0MsTUFBTSxPQUFPLEdBQUc7UUFDZCxpQ0FBaUM7UUFDakMsNkdBQTZHO1FBQzdHLHFLQUFxSztRQUNySywyQkFBMkI7S0FFNUIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQVZELHNDQVVDO0FBRUQscUJBQXFCLElBQWE7SUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLO1dBQ2pDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXO1dBQ3ZDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVO1dBQ3RDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhO1dBQ3pDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7QUFDaEQsQ0FBQztBQUVEO0lBQ0UsTUFBTSxDQUFDLENBQUMsT0FBaUMsRUFBaUMsRUFBRTtRQUMxRSxNQUFNLFdBQVcsR0FBa0MsQ0FBQyxFQUFpQixFQUFFLEVBQUU7WUFFdkUsTUFBTSxNQUFNLEdBQUcsb0JBQW9CLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENB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Ii8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHsgZHJpbGxkb3duTm9kZXMgfSBmcm9tICcuLi9oZWxwZXJzL2FzdC11dGlscyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RXcmFwRW51bXMoY29udGVudDogc3RyaW5nKSB7XG4gIGNvbnN0IHJlZ2V4ZXMgPSBbXG4gICAgLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgL3ZhciAoXFxTKykgPSBcXHtcXH07XFxyP1xcbihcXDFcXC4oXFxTKykgPSBcXGQrO1xccj9cXG4pK1xcMVxcW1xcMVxcLihcXFMrKVxcXSA9IFwiXFw0XCI7XFxyP1xcbihcXDFcXFtcXDFcXC4oXFxTKylcXF0gPSBcIlxcUytcIjtcXHI/XFxuKikrLyxcbiAgICAvdmFyIChcXFMrKTsoXFwvXFwqQF9fUFVSRV9fXFwqXFwvKSpcXHI/XFxuXFwoZnVuY3Rpb24gXFwoXFwxXFwpIFxce1xccysoXFwxXFxbXFwxXFxbXCIoXFxTKylcIlxcXSA9IDBcXF0gPSBcIlxcNFwiOyhcXHMrXFwxXFxbXFwxXFxbXCJcXFMrXCJcXF0gPSBcXGRcXF0gPSBcIlxcUytcIjspKlxccj9cXG4pXFx9XFwpXFwoXFwxIFxcfFxcfCBcXChcXDEgPSBcXHtcXH1cXClcXCk7LyxcbiAgICAvXFwvXFwqXFwqIEBlbnVtIFxce1xcdytcXH0gXFwqXFwvLyxcbiAgLy8gdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGhcbiAgXTtcblxuICByZXR1cm4gcmVnZXhlcy5zb21lKChyZWdleCkgPT4gcmVnZXgudGVzdChjb250ZW50KSk7XG59XG5cbmZ1bmN0aW9uIGlzQmxvY2tMaWtlKG5vZGU6IHRzLk5vZGUpOiBub2RlIGlzIHRzLkJsb2NrTGlrZSB7XG4gIHJldHVybiBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQmxvY2tcbiAgICAgIHx8IG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5Nb2R1bGVCbG9ja1xuICAgICAgfHwgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNhc2VDbGF1c2VcbiAgICAgIHx8IG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5EZWZhdWx0Q2xhdXNlXG4gICAgICB8fCBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuU291cmNlRmlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdyYXBFbnVtc1RyYW5zZm9ybWVyKCk6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybWVyOiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiA9IChzZjogdHMuU291cmNlRmlsZSkgPT4ge1xuXG4gICAgICBjb25zdCByZXN1bHQgPSB2aXNpdEJsb2NrU3RhdGVtZW50cyhzZi5zdGF0ZW1lbnRzLCBjb250ZXh0KTtcblxuICAgICAgcmV0dXJuIHRzLnVwZGF0ZVNvdXJjZUZpbGVOb2RlKHNmLCByZXN1bHQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtZXI7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHZpc2l0QmxvY2tTdGF0ZW1lbnRzKFxuICBzdGF0ZW1lbnRzOiB0cy5Ob2RlQXJyYXk8dHMuU3RhdGVtZW50PixcbiAgY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0LFxuKTogdHMuTm9kZUFycmF5PHRzLlN0YXRlbWVudD4ge1xuXG4gIC8vIGNvcHkgb2Ygc3RhdGVtZW50cyB0byBtb2RpZnk7IGxhenkgaW5pdGlhbGl6ZWRcbiAgbGV0IHVwZGF0ZWRTdGF0ZW1lbnRzOiBBcnJheTx0cy5TdGF0ZW1lbnQ+IHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0IHZpc2l0b3I6IHRzLlZpc2l0b3IgPSAobm9kZSkgPT4ge1xuICAgIGlmIChpc0Jsb2NrTGlrZShub2RlKSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdmlzaXRCbG9ja1N0YXRlbWVudHMobm9kZS5zdGF0ZW1lbnRzLCBjb250ZXh0KTtcbiAgICAgIGlmIChyZXN1bHQgPT09IG5vZGUuc3RhdGVtZW50cykge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAobm9kZS5raW5kKSB7XG4gICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5CbG9jazpcbiAgICAgICAgICByZXR1cm4gdHMudXBkYXRlQmxvY2sobm9kZSBhcyB0cy5CbG9jaywgcmVzdWx0KTtcbiAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLk1vZHVsZUJsb2NrOlxuICAgICAgICAgIHJldHVybiB0cy51cGRhdGVNb2R1bGVCbG9jayhub2RlIGFzIHRzLk1vZHVsZUJsb2NrLCByZXN1bHQpO1xuICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuQ2FzZUNsYXVzZTpcbiAgICAgICAgICBjb25zdCBjbGF1c2UgPSBub2RlIGFzIHRzLkNhc2VDbGF1c2U7XG5cbiAgICAgICAgICByZXR1cm4gdHMudXBkYXRlQ2FzZUNsYXVzZShjbGF1c2UsIGNsYXVzZS5leHByZXNzaW9uLCByZXN1bHQpO1xuICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuRGVmYXVsdENsYXVzZTpcbiAgICAgICAgICByZXR1cm4gdHMudXBkYXRlRGVmYXVsdENsYXVzZShub2RlIGFzIHRzLkRlZmF1bHRDbGF1c2UsIHJlc3VsdCk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChub2RlLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gJ29JbmRleCcgaXMgdGhlIG9yaWdpbmFsIHN0YXRlbWVudCBpbmRleDsgJ3VJbmRleCcgaXMgdGhlIHVwZGF0ZWQgc3RhdGVtZW50IGluZGV4XG4gIGZvciAobGV0IG9JbmRleCA9IDAsIHVJbmRleCA9IDA7IG9JbmRleCA8IHN0YXRlbWVudHMubGVuZ3RoOyBvSW5kZXgrKywgdUluZGV4KyspIHtcbiAgICBjb25zdCBjdXJyZW50U3RhdGVtZW50ID0gc3RhdGVtZW50c1tvSW5kZXhdO1xuXG4gICAgLy8gdGhlc2UgY2FuJ3QgY29udGFpbiBhbiBlbnVtIGRlY2xhcmF0aW9uXG4gICAgaWYgKGN1cnJlbnRTdGF0ZW1lbnQua2luZCA9PT0gdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbikge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZW51bSBkZWNsYXJhdGlvbnMgbXVzdDpcbiAgICAvLyAgICogbm90IGJlIGxhc3Qgc3RhdGVtZW50XG4gICAgLy8gICAqIGJlIGEgdmFyaWFibGUgc3RhdGVtZW50XG4gICAgLy8gICAqIGhhdmUgb25seSBvbmUgZGVjbGFyYXRpb25cbiAgICAvLyAgICogaGF2ZSBhbiBpZGVudGlmZXIgYXMgYSBkZWNsYXJhdGlvbiBuYW1lXG4gICAgaWYgKG9JbmRleCA8IHN0YXRlbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAmJiB0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KGN1cnJlbnRTdGF0ZW1lbnQpXG4gICAgICAgICYmIGN1cnJlbnRTdGF0ZW1lbnQuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5sZW5ndGggPT09IDEpIHtcblxuICAgICAgY29uc3QgdmFyaWFibGVEZWNsYXJhdGlvbiA9IGN1cnJlbnRTdGF0ZW1lbnQuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9uc1swXTtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIodmFyaWFibGVEZWNsYXJhdGlvbi5uYW1lKSkge1xuICAgICAgICBjb25zdCBuYW1lID0gdmFyaWFibGVEZWNsYXJhdGlvbi5uYW1lLnRleHQ7XG5cbiAgICAgICAgaWYgKCF2YXJpYWJsZURlY2xhcmF0aW9uLmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgY29uc3QgZW51bVN0YXRlbWVudHMgPSBmaW5kVHMyXzNFbnVtU3RhdGVtZW50cyhuYW1lLCBzdGF0ZW1lbnRzW29JbmRleCArIDFdKTtcbiAgICAgICAgICBpZiAoZW51bVN0YXRlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gZm91bmQgYW4gZW51bVxuICAgICAgICAgICAgaWYgKCF1cGRhdGVkU3RhdGVtZW50cykge1xuICAgICAgICAgICAgICB1cGRhdGVkU3RhdGVtZW50cyA9IHN0YXRlbWVudHMuc2xpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB3cmFwcGVyIGFuZCByZXBsYWNlIHZhcmlhYmxlIHN0YXRlbWVudCBhbmQgSUlGRVxuICAgICAgICAgICAgdXBkYXRlZFN0YXRlbWVudHMuc3BsaWNlKHVJbmRleCwgMiwgY3JlYXRlV3JhcHBlZEVudW0oXG4gICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZW1lbnQsXG4gICAgICAgICAgICAgIGVudW1TdGF0ZW1lbnRzLFxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICAgIC8vIHNraXAgSUlGRSBzdGF0ZW1lbnRcbiAgICAgICAgICAgIG9JbmRleCsrO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24odmFyaWFibGVEZWNsYXJhdGlvbi5pbml0aWFsaXplcilcbiAgICAgICAgICAgICAgICAgICAmJiB2YXJpYWJsZURlY2xhcmF0aW9uLmluaXRpYWxpemVyLnByb3BlcnRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgbmV4dFN0YXRlbWVudHMgPSBzdGF0ZW1lbnRzLnNsaWNlKG9JbmRleCArIDEpO1xuICAgICAgICAgIGNvbnN0IGVudW1TdGF0ZW1lbnRzID0gZmluZFRzMl8yRW51bVN0YXRlbWVudHMobmFtZSwgbmV4dFN0YXRlbWVudHMpO1xuICAgICAgICAgIGlmIChlbnVtU3RhdGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBmb3VuZCBhbiBlbnVtXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZWRTdGF0ZW1lbnRzKSB7XG4gICAgICAgICAgICAgIHVwZGF0ZWRTdGF0ZW1lbnRzID0gc3RhdGVtZW50cy5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY3JlYXRlIHdyYXBwZXIgYW5kIHJlcGxhY2UgdmFyaWFibGUgc3RhdGVtZW50IGFuZCBlbnVtIG1lbWJlciBzdGF0ZW1lbnRzXG4gICAgICAgICAgICB1cGRhdGVkU3RhdGVtZW50cy5zcGxpY2UodUluZGV4LCBlbnVtU3RhdGVtZW50cy5sZW5ndGggKyAxLCBjcmVhdGVXcmFwcGVkRW51bShcbiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgY3VycmVudFN0YXRlbWVudCxcbiAgICAgICAgICAgICAgZW51bVN0YXRlbWVudHMsXG4gICAgICAgICAgICAgIHZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIsXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICAgIC8vIHNraXAgZW51bSBtZW1iZXIgZGVjbGFyYXRpb25zXG4gICAgICAgICAgICBvSW5kZXggKz0gZW51bVN0YXRlbWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24odmFyaWFibGVEZWNsYXJhdGlvbi5pbml0aWFsaXplcilcbiAgICAgICAgICAmJiB2YXJpYWJsZURlY2xhcmF0aW9uLmluaXRpYWxpemVyLnByb3BlcnRpZXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgY29uc3QgbGl0ZXJhbFByb3BlcnR5Q291bnQgPSB2YXJpYWJsZURlY2xhcmF0aW9uLmluaXRpYWxpemVyLnByb3BlcnRpZXMubGVuZ3RoO1xuICAgICAgICAgIGNvbnN0IG5leHRTdGF0ZW1lbnRzID0gc3RhdGVtZW50cy5zbGljZShvSW5kZXggKyAxKTtcbiAgICAgICAgICBjb25zdCBlbnVtU3RhdGVtZW50cyA9IGZpbmRUc2lja2xlRW51bVN0YXRlbWVudHMobmFtZSwgbmV4dFN0YXRlbWVudHMpO1xuICAgICAgICAgIGlmIChlbnVtU3RhdGVtZW50cy5sZW5ndGggPT09IGxpdGVyYWxQcm9wZXJ0eUNvdW50KSB7XG4gICAgICAgICAgICAvLyBmb3VuZCBhbiBlbnVtXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZWRTdGF0ZW1lbnRzKSB7XG4gICAgICAgICAgICAgIHVwZGF0ZWRTdGF0ZW1lbnRzID0gc3RhdGVtZW50cy5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY3JlYXRlIHdyYXBwZXIgYW5kIHJlcGxhY2UgdmFyaWFibGUgc3RhdGVtZW50IGFuZCBlbnVtIG1lbWJlciBzdGF0ZW1lbnRzXG4gICAgICAgICAgICB1cGRhdGVkU3RhdGVtZW50cy5zcGxpY2UodUluZGV4LCBlbnVtU3RhdGVtZW50cy5sZW5ndGggKyAxLCBjcmVhdGVXcmFwcGVkRW51bShcbiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgY3VycmVudFN0YXRlbWVudCxcbiAgICAgICAgICAgICAgZW51bVN0YXRlbWVudHMsXG4gICAgICAgICAgICAgIHZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIsXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICAgIC8vIHNraXAgZW51bSBtZW1iZXIgZGVjbGFyYXRpb25zXG4gICAgICAgICAgICBvSW5kZXggKz0gZW51bVN0YXRlbWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gdHMudmlzaXROb2RlKGN1cnJlbnRTdGF0ZW1lbnQsIHZpc2l0b3IpO1xuICAgIGlmIChyZXN1bHQgIT09IGN1cnJlbnRTdGF0ZW1lbnQpIHtcbiAgICAgIGlmICghdXBkYXRlZFN0YXRlbWVudHMpIHtcbiAgICAgICAgdXBkYXRlZFN0YXRlbWVudHMgPSBzdGF0ZW1lbnRzLnNsaWNlKCk7XG4gICAgICB9XG4gICAgICB1cGRhdGVkU3RhdGVtZW50c1t1SW5kZXhdID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIGNoYW5nZXMsIHJldHVybiB1cGRhdGVkIHN0YXRlbWVudHNcbiAgLy8gb3RoZXJ3aXNlLCByZXR1cm4gb3JpZ2luYWwgYXJyYXkgaW5zdGFuY2VcbiAgcmV0dXJuIHVwZGF0ZWRTdGF0ZW1lbnRzID8gdHMuY3JlYXRlTm9kZUFycmF5KHVwZGF0ZWRTdGF0ZW1lbnRzKSA6IHN0YXRlbWVudHM7XG59XG5cbi8vIFRTIDIuMyBlbnVtcyBoYXZlIHN0YXRlbWVudHMgdGhhdCBhcmUgaW5zaWRlIGEgSUlGRS5cbmZ1bmN0aW9uIGZpbmRUczJfM0VudW1TdGF0ZW1lbnRzKG5hbWU6IHN0cmluZywgc3RhdGVtZW50OiB0cy5TdGF0ZW1lbnQpOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50W10ge1xuICBjb25zdCBlbnVtU3RhdGVtZW50czogdHMuRXhwcmVzc2lvblN0YXRlbWVudFtdID0gW107XG4gIGNvbnN0IG5vTm9kZXM6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnRbXSA9IFtdO1xuXG4gIGNvbnN0IGZ1bmNFeHByID0gZHJpbGxkb3duTm9kZXM8dHMuRnVuY3Rpb25FeHByZXNzaW9uPihzdGF0ZW1lbnQsXG4gICAgW1xuICAgICAgeyBwcm9wOiBudWxsLCBraW5kOiB0cy5TeW50YXhLaW5kLkV4cHJlc3Npb25TdGF0ZW1lbnQgfSxcbiAgICAgIHsgcHJvcDogJ2V4cHJlc3Npb24nLCBraW5kOiB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uIH0sXG4gICAgICB7IHByb3A6ICdleHByZXNzaW9uJywga2luZDogdHMuU3ludGF4S2luZC5QYXJlbnRoZXNpemVkRXhwcmVzc2lvbiB9LFxuICAgICAgeyBwcm9wOiAnZXhwcmVzc2lvbicsIGtpbmQ6IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25FeHByZXNzaW9uIH0sXG4gICAgXSk7XG5cbiAgaWYgKGZ1bmNFeHByID09PSBudWxsKSB7IHJldHVybiBub05vZGVzOyB9XG5cbiAgaWYgKCEoXG4gICAgZnVuY0V4cHIucGFyYW1ldGVycy5sZW5ndGggPT09IDFcbiAgICAmJiBmdW5jRXhwci5wYXJhbWV0ZXJzWzBdLm5hbWUua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyXG4gICAgJiYgKGZ1bmNFeHByLnBhcmFtZXRlcnNbMF0ubmFtZSBhcyB0cy5JZGVudGlmaWVyKS50ZXh0ID09PSBuYW1lXG4gICkpIHtcbiAgICByZXR1cm4gbm9Ob2RlcztcbiAgfVxuXG4gIC8vIEluIFRTIDIuMyBlbnVtcywgdGhlIElJRkUgY29udGFpbnMgb25seSBleHByZXNzaW9ucyB3aXRoIGEgY2VydGFpbiBmb3JtYXQuXG4gIC8vIElmIHdlIGZpbmQgYW55IHRoYXQgaXMgZGlmZmVyZW50LCB3ZSBpZ25vcmUgdGhlIHdob2xlIHRoaW5nLlxuICBmb3IgKGNvbnN0IGlubmVyU3RtdCBvZiBmdW5jRXhwci5ib2R5LnN0YXRlbWVudHMpIHtcblxuICAgIGNvbnN0IGlubmVyQmluRXhwciA9IGRyaWxsZG93bk5vZGVzPHRzLkJpbmFyeUV4cHJlc3Npb24+KGlubmVyU3RtdCxcbiAgICAgIFtcbiAgICAgICAgeyBwcm9wOiBudWxsLCBraW5kOiB0cy5TeW50YXhLaW5kLkV4cHJlc3Npb25TdGF0ZW1lbnQgfSxcbiAgICAgICAgeyBwcm9wOiAnZXhwcmVzc2lvbicsIGtpbmQ6IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbiB9LFxuICAgICAgXSk7XG5cbiAgICBpZiAoaW5uZXJCaW5FeHByID09PSBudWxsKSB7IHJldHVybiBub05vZGVzOyB9XG5cbiAgICBjb25zdCBleHByU3RtdCA9IGlubmVyU3RtdCBhcyB0cy5FeHByZXNzaW9uU3RhdGVtZW50O1xuXG4gICAgaWYgKCEoaW5uZXJCaW5FeHByLm9wZXJhdG9yVG9rZW4ua2luZCA9PT0gdHMuU3ludGF4S2luZC5GaXJzdEFzc2lnbm1lbnRcbiAgICAgICAgJiYgaW5uZXJCaW5FeHByLmxlZnQua2luZCA9PT0gdHMuU3ludGF4S2luZC5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbikpIHtcbiAgICAgIHJldHVybiBub05vZGVzO1xuICAgIH1cblxuICAgIGNvbnN0IGlubmVyRWxlbUFjYyA9IGlubmVyQmluRXhwci5sZWZ0IGFzIHRzLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uO1xuXG4gICAgaWYgKCEoXG4gICAgICBpbm5lckVsZW1BY2MuZXhwcmVzc2lvbi5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXJcbiAgICAgICYmIChpbm5lckVsZW1BY2MuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyKS50ZXh0ID09PSBuYW1lXG4gICAgICAmJiBpbm5lckVsZW1BY2MuYXJndW1lbnRFeHByZXNzaW9uXG4gICAgICAmJiBpbm5lckVsZW1BY2MuYXJndW1lbnRFeHByZXNzaW9uLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvblxuICAgICkpIHtcbiAgICAgIHJldHVybiBub05vZGVzO1xuICAgIH1cblxuICAgIGNvbnN0IGlubmVyQXJnQmluRXhwciA9IGlubmVyRWxlbUFjYy5hcmd1bWVudEV4cHJlc3Npb24gYXMgdHMuQmluYXJ5RXhwcmVzc2lvbjtcblxuICAgIGlmIChpbm5lckFyZ0JpbkV4cHIubGVmdC5raW5kICE9PSB0cy5TeW50YXhLaW5kLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgICByZXR1cm4gbm9Ob2RlcztcbiAgICB9XG5cbiAgICBjb25zdCBpbm5lckFyZ0VsZW1BY2MgPSBpbm5lckFyZ0JpbkV4cHIubGVmdCBhcyB0cy5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbjtcblxuICAgIGlmICghKFxuICAgICAgaW5uZXJBcmdFbGVtQWNjLmV4cHJlc3Npb24ua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyXG4gICAgICAmJiAoaW5uZXJBcmdFbGVtQWNjLmV4cHJlc3Npb24gYXMgdHMuSWRlbnRpZmllcikudGV4dCA9PT0gbmFtZVxuICAgICkpIHtcbiAgICAgIHJldHVybiBub05vZGVzO1xuICAgIH1cblxuICAgIGVudW1TdGF0ZW1lbnRzLnB1c2goZXhwclN0bXQpO1xuICB9XG5cbiAgcmV0dXJuIGVudW1TdGF0ZW1lbnRzO1xufVxuXG4vLyBUUyAyLjIgZW51bXMgaGF2ZSBzdGF0ZW1lbnRzIGFmdGVyIHRoZSB2YXJpYWJsZSBkZWNsYXJhdGlvbiwgd2l0aCBpbmRleCBzdGF0ZW1lbnRzIGZvbGxvd2VkXG4vLyBieSB2YWx1ZSBzdGF0ZW1lbnRzLlxuZnVuY3Rpb24gZmluZFRzMl8yRW51bVN0YXRlbWVudHMoXG4gIG5hbWU6IHN0cmluZyxcbiAgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10sXG4pOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50W10ge1xuICBjb25zdCBlbnVtU3RhdGVtZW50czogdHMuRXhwcmVzc2lvblN0YXRlbWVudFtdID0gW107XG4gIGxldCBiZWZvcmVWYWx1ZVN0YXRlbWVudHMgPSB0cnVlO1xuXG4gIGZvciAoY29uc3Qgc3RtdCBvZiBzdGF0ZW1lbnRzKSB7XG4gICAgLy8gRW5zdXJlIGFsbCBzdGF0ZW1lbnRzIGFyZSBvZiB0aGUgZXhwZWN0ZWQgZm9ybWF0IGFuZCB1c2luZyB0aGUgcmlnaHQgaWRlbnRpZmVyLlxuICAgIC8vIFdoZW4gd2UgZmluZCBhIHN0YXRlbWVudCB0aGF0IGlzbid0IHBhcnQgb2YgdGhlIGVudW0sIHJldHVybiB3aGF0IHdlIGNvbGxlY3RlZCBzbyBmYXIuXG4gICAgY29uc3QgYmluRXhwciA9IGRyaWxsZG93bk5vZGVzPHRzLkJpbmFyeUV4cHJlc3Npb24+KHN0bXQsXG4gICAgICBbXG4gICAgICAgIHsgcHJvcDogbnVsbCwga2luZDogdHMuU3ludGF4S2luZC5FeHByZXNzaW9uU3RhdGVtZW50IH0sXG4gICAgICAgIHsgcHJvcDogJ2V4cHJlc3Npb24nLCBraW5kOiB0cy5TeW50YXhLaW5kLkJpbmFyeUV4cHJlc3Npb24gfSxcbiAgICAgIF0pO1xuXG4gICAgaWYgKGJpbkV4cHIgPT09IG51bGxcbiAgICAgIHx8IChiaW5FeHByLmxlZnQua2luZCAhPT0gdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb25cbiAgICAgICAgJiYgYmluRXhwci5sZWZ0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24pXG4gICAgKSB7XG4gICAgICByZXR1cm4gYmVmb3JlVmFsdWVTdGF0ZW1lbnRzID8gW10gOiBlbnVtU3RhdGVtZW50cztcbiAgICB9XG5cbiAgICBjb25zdCBleHByU3RtdCA9IHN0bXQgYXMgdHMuRXhwcmVzc2lvblN0YXRlbWVudDtcbiAgICBjb25zdCBsZWZ0RXhwciA9IGJpbkV4cHIubGVmdCBhcyB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24gfCB0cy5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbjtcblxuICAgIGlmICghKGxlZnRFeHByLmV4cHJlc3Npb24ua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyXG4gICAgICAgICYmIChsZWZ0RXhwci5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXIpLnRleHQgPT09IG5hbWUpKSB7XG4gICAgICByZXR1cm4gYmVmb3JlVmFsdWVTdGF0ZW1lbnRzID8gW10gOiBlbnVtU3RhdGVtZW50cztcbiAgICB9XG5cbiAgICBpZiAoIWJlZm9yZVZhbHVlU3RhdGVtZW50cyAmJiBsZWZ0RXhwci5raW5kID09PSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbikge1xuICAgICAgLy8gV2Ugc2hvdWxkbid0IGZpbmQgaW5kZXggc3RhdGVtZW50cyBhZnRlciB2YWx1ZSBzdGF0ZW1lbnRzLlxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSBpZiAoYmVmb3JlVmFsdWVTdGF0ZW1lbnRzICYmIGxlZnRFeHByLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24pIHtcbiAgICAgIGJlZm9yZVZhbHVlU3RhdGVtZW50cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGVudW1TdGF0ZW1lbnRzLnB1c2goZXhwclN0bXQpO1xuICB9XG5cbiAgcmV0dXJuIGVudW1TdGF0ZW1lbnRzO1xufVxuXG4vLyBUc2lja2xlIGVudW1zIGhhdmUgYSB2YXJpYWJsZSBzdGF0ZW1lbnQgd2l0aCBpbmRleGVzLCBmb2xsb3dlZCBieSB2YWx1ZSBzdGF0ZW1lbnRzLlxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2RldmtpdC9pc3N1ZXMvMjI5I2lzc3VlY29tbWVudC0zMzg1MTIwNTYgZm9yZSBtb3JlIGluZm9ybWF0aW9uLlxuZnVuY3Rpb24gZmluZFRzaWNrbGVFbnVtU3RhdGVtZW50cyhcbiAgbmFtZTogc3RyaW5nLFxuICBzdGF0ZW1lbnRzOiB0cy5TdGF0ZW1lbnRbXSxcbik6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnRbXSB7XG4gIGNvbnN0IGVudW1TdGF0ZW1lbnRzOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50W10gPSBbXTtcbiAgLy8gbGV0IGJlZm9yZVZhbHVlU3RhdGVtZW50cyA9IHRydWU7XG5cbiAgZm9yIChjb25zdCBzdG10IG9mIHN0YXRlbWVudHMpIHtcbiAgICAvLyBFbnN1cmUgYWxsIHN0YXRlbWVudHMgYXJlIG9mIHRoZSBleHBlY3RlZCBmb3JtYXQgYW5kIHVzaW5nIHRoZSByaWdodCBpZGVudGlmZXIuXG4gICAgLy8gV2hlbiB3ZSBmaW5kIGEgc3RhdGVtZW50IHRoYXQgaXNuJ3QgcGFydCBvZiB0aGUgZW51bSwgcmV0dXJuIHdoYXQgd2UgY29sbGVjdGVkIHNvIGZhci5cbiAgICBjb25zdCBiaW5FeHByID0gZHJpbGxkb3duTm9kZXM8dHMuQmluYXJ5RXhwcmVzc2lvbj4oc3RtdCxcbiAgICAgIFtcbiAgICAgICAgeyBwcm9wOiBudWxsLCBraW5kOiB0cy5TeW50YXhLaW5kLkV4cHJlc3Npb25TdGF0ZW1lbnQgfSxcbiAgICAgICAgeyBwcm9wOiAnZXhwcmVzc2lvbicsIGtpbmQ6IHRzLlN5bnRheEtpbmQuQmluYXJ5RXhwcmVzc2lvbiB9LFxuICAgICAgXSk7XG5cbiAgICBpZiAoYmluRXhwciA9PT0gbnVsbCB8fCBiaW5FeHByLmxlZnQua2luZCAhPT0gdHMuU3ludGF4S2luZC5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbikge1xuICAgICAgcmV0dXJuIGVudW1TdGF0ZW1lbnRzO1xuICAgIH1cblxuICAgIGNvbnN0IGV4cHJTdG10ID0gc3RtdCBhcyB0cy5FeHByZXNzaW9uU3RhdGVtZW50O1xuICAgIGNvbnN0IGxlZnRFeHByID0gYmluRXhwci5sZWZ0IGFzIHRzLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uO1xuXG4gICAgaWYgKCEobGVmdEV4cHIuZXhwcmVzc2lvbi5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXJcbiAgICAgICAgJiYgKGxlZnRFeHByLmV4cHJlc3Npb24gYXMgdHMuSWRlbnRpZmllcikudGV4dCA9PT0gbmFtZSkpIHtcbiAgICAgIHJldHVybiBlbnVtU3RhdGVtZW50cztcbiAgICB9XG4gICAgZW51bVN0YXRlbWVudHMucHVzaChleHByU3RtdCk7XG4gIH1cblxuICByZXR1cm4gZW51bVN0YXRlbWVudHM7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVdyYXBwZWRFbnVtKFxuICBuYW1lOiBzdHJpbmcsXG4gIGhvc3ROb2RlOiB0cy5WYXJpYWJsZVN0YXRlbWVudCxcbiAgc3RhdGVtZW50czogQXJyYXk8dHMuU3RhdGVtZW50PixcbiAgbGl0ZXJhbEluaXRpYWxpemVyOiB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbiB8IHVuZGVmaW5lZCxcbik6IHRzLlN0YXRlbWVudCB7XG4gIGNvbnN0IHB1cmVGdW5jdGlvbkNvbW1lbnQgPSAnQF9fUFVSRV9fJztcblxuICBsaXRlcmFsSW5pdGlhbGl6ZXIgPSBsaXRlcmFsSW5pdGlhbGl6ZXIgfHwgdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbCgpO1xuICBjb25zdCBpbm5lclZhclN0bXQgPSB0cy5jcmVhdGVWYXJpYWJsZVN0YXRlbWVudChcbiAgICB1bmRlZmluZWQsXG4gICAgdHMuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoW1xuICAgICAgdHMuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbihuYW1lLCB1bmRlZmluZWQsIGxpdGVyYWxJbml0aWFsaXplciksXG4gICAgXSksXG4gICk7XG5cbiAgY29uc3QgaW5uZXJSZXR1cm4gPSB0cy5jcmVhdGVSZXR1cm4odHMuY3JlYXRlSWRlbnRpZmllcihuYW1lKSk7XG5cbiAgLy8gTk9URTogVFMgMi40KyBoYXMgYSBjcmVhdGUgSUlGRSBoZWxwZXIgbWV0aG9kXG4gIGNvbnN0IGlpZmUgPSB0cy5jcmVhdGVDYWxsKFxuICAgIHRzLmNyZWF0ZVBhcmVuKFxuICAgICAgdHMuY3JlYXRlRnVuY3Rpb25FeHByZXNzaW9uKFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIFtdLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHRzLmNyZWF0ZUJsb2NrKFtcbiAgICAgICAgICBpbm5lclZhclN0bXQsXG4gICAgICAgICAgLi4uc3RhdGVtZW50cyxcbiAgICAgICAgICBpbm5lclJldHVybixcbiAgICAgICAgXSksXG4gICAgICApLFxuICAgICksXG4gICAgdW5kZWZpbmVkLFxuICAgIFtdLFxuICApO1xuXG4gIC8vIFVwZGF0ZSBleGlzdGluZyBob3N0IG5vZGUgd2l0aCB0aGUgcHVyZSBjb21tZW50IGJlZm9yZSB0aGUgdmFyaWFibGUgZGVjbGFyYXRpb24gaW5pdGlhbGl6ZXIuXG4gIGNvbnN0IHZhcmlhYmxlRGVjbGFyYXRpb24gPSBob3N0Tm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zWzBdO1xuICBjb25zdCBvdXRlclZhclN0bXQgPSB0cy51cGRhdGVWYXJpYWJsZVN0YXRlbWVudChcbiAgICBob3N0Tm9kZSxcbiAgICBob3N0Tm9kZS5tb2RpZmllcnMsXG4gICAgdHMudXBkYXRlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoXG4gICAgICBob3N0Tm9kZS5kZWNsYXJhdGlvbkxpc3QsXG4gICAgICBbXG4gICAgICAgIHRzLnVwZGF0ZVZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgICAgdmFyaWFibGVEZWNsYXJhdGlvbixcbiAgICAgICAgICB2YXJpYWJsZURlY2xhcmF0aW9uLm5hbWUsXG4gICAgICAgICAgdmFyaWFibGVEZWNsYXJhdGlvbi50eXBlLFxuICAgICAgICAgIHRzLmFkZFN5bnRoZXRpY0xlYWRpbmdDb21tZW50KFxuICAgICAgICAgICAgaWlmZSwgdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhLCBwdXJlRnVuY3Rpb25Db21tZW50LCBmYWxzZSxcbiAgICAgICAgICApLFxuICAgICAgICApLFxuICAgICAgXSxcbiAgICApLFxuICApO1xuXG4gIHJldHVybiBvdXRlclZhclN0bXQ7XG59XG4iXX0=