"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var typeguard_1 = require("./typeguard");
function getChildOfKind(node, kind, sourceFile) {
    for (var _i = 0, _a = node.getChildren(sourceFile); _i < _a.length; _i++) {
        var child = _a[_i];
        if (child.kind === kind)
            return child;
    }
}
exports.getChildOfKind = getChildOfKind;
function isTokenKind(kind) {
    return kind >= ts.SyntaxKind.FirstToken && kind <= ts.SyntaxKind.LastToken ||
        kind === ts.SyntaxKind.JsxText;
}
exports.isTokenKind = isTokenKind;
function isNodeKind(kind) {
    return kind >= ts.SyntaxKind.FirstNode &&
        kind !== ts.SyntaxKind.JsxText;
}
exports.isNodeKind = isNodeKind;
function isAssignmentKind(kind) {
    return kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment;
}
exports.isAssignmentKind = isAssignmentKind;
function isTypeNodeKind(kind) {
    return kind >= ts.SyntaxKind.FirstTypeNode && kind <= ts.SyntaxKind.LastTypeNode;
}
exports.isTypeNodeKind = isTypeNodeKind;
function isJsDocKind(kind) {
    return kind >= ts.SyntaxKind.FirstJSDocNode && kind <= ts.SyntaxKind.LastJSDocNode;
}
exports.isJsDocKind = isJsDocKind;
function hasModifier(modifiers) {
    var kinds = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        kinds[_i - 1] = arguments[_i];
    }
    if (modifiers === undefined)
        return false;
    for (var _a = 0, modifiers_1 = modifiers; _a < modifiers_1.length; _a++) {
        var modifier = modifiers_1[_a];
        if (kinds.indexOf(modifier.kind) !== -1)
            return true;
    }
    return false;
}
exports.hasModifier = hasModifier;
function isParameterProperty(node) {
    return hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword, ts.SyntaxKind.ProtectedKeyword, ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ReadonlyKeyword);
}
exports.isParameterProperty = isParameterProperty;
function hasAccessModifier(node) {
    return hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword, ts.SyntaxKind.ProtectedKeyword, ts.SyntaxKind.PrivateKeyword);
}
exports.hasAccessModifier = hasAccessModifier;
function getPreviousStatement(statement) {
    var parent = statement.parent;
    if (typeguard_1.isBlockLike(parent)) {
        var index = parent.statements.indexOf(statement);
        if (index > 0)
            return parent.statements[index - 1];
    }
}
exports.getPreviousStatement = getPreviousStatement;
function getNextStatement(statement) {
    var parent = statement.parent;
    if (typeguard_1.isBlockLike(parent)) {
        var index = parent.statements.indexOf(statement);
        if (index < parent.statements.length)
            return parent.statements[index + 1];
    }
}
exports.getNextStatement = getNextStatement;
function getPreviousToken(node, sourceFile) {
    var parent = node.parent;
    while (parent !== undefined && parent.pos === node.pos)
        parent = parent.parent;
    if (parent === undefined)
        return;
    return findPreviousInternal(parent, node.pos, sourceFile);
}
exports.getPreviousToken = getPreviousToken;
function findPreviousInternal(node, pos, sourceFile) {
    var children = node.getChildren(sourceFile);
    for (var i = children.length - 1; i >= 0; --i) {
        var child = children[i];
        if (child.pos < pos && child.kind !== ts.SyntaxKind.JSDocComment) {
            if (isTokenKind(child.kind))
                return child;
            return findPreviousInternal(child, pos, sourceFile);
        }
    }
}
function getNextToken(node, sourceFile) {
    var parent = node.parent;
    while (parent !== undefined && parent.end === node.end)
        parent = parent.parent;
    if (parent === undefined)
        return;
    return findNextInternal(parent, node.end, sourceFile);
}
exports.getNextToken = getNextToken;
function findNextInternal(node, end, sourceFile) {
    for (var _i = 0, _a = node.getChildren(sourceFile); _i < _a.length; _i++) {
        var child = _a[_i];
        if (child.end > end && child.kind !== ts.SyntaxKind.JSDocComment) {
            if (isTokenKind(child.kind))
                return child;
            return findNextInternal(child, end, sourceFile);
        }
    }
}
function getPropertyName(propertyName) {
    if (propertyName.kind === ts.SyntaxKind.ComputedPropertyName) {
        if (!typeguard_1.isLiteralExpression(propertyName.expression))
            return;
        return propertyName.expression.text;
    }
    return propertyName.text;
}
exports.getPropertyName = getPropertyName;
function forEachDestructuringIdentifier(pattern, fn) {
    for (var _i = 0, _a = pattern.elements; _i < _a.length; _i++) {
        var element = _a[_i];
        if (element.kind !== ts.SyntaxKind.BindingElement)
            continue;
        var result = void 0;
        if (element.name.kind === ts.SyntaxKind.Identifier) {
            result = fn(element);
        }
        else {
            result = forEachDestructuringIdentifier(element.name, fn);
        }
        if (result)
            return result;
    }
}
exports.forEachDestructuringIdentifier = forEachDestructuringIdentifier;
function forEachDeclaredVariable(declarationList, cb) {
    for (var _i = 0, _a = declarationList.declarations; _i < _a.length; _i++) {
        var declaration = _a[_i];
        var result = void 0;
        if (declaration.name.kind === ts.SyntaxKind.Identifier) {
            result = cb(declaration);
        }
        else {
            result = forEachDestructuringIdentifier(declaration.name, cb);
        }
        if (result)
            return result;
    }
}
exports.forEachDeclaredVariable = forEachDeclaredVariable;
var VariableDeclarationKind;
(function (VariableDeclarationKind) {
    VariableDeclarationKind[VariableDeclarationKind["Var"] = 0] = "Var";
    VariableDeclarationKind[VariableDeclarationKind["Let"] = 1] = "Let";
    VariableDeclarationKind[VariableDeclarationKind["Const"] = 2] = "Const";
})(VariableDeclarationKind = exports.VariableDeclarationKind || (exports.VariableDeclarationKind = {}));
function getVariableDeclarationKind(declarationList) {
    if ((declarationList.flags & ts.NodeFlags.Let) !== 0)
        return 1;
    if ((declarationList.flags & ts.NodeFlags.Const) !== 0)
        return 2;
    return 0;
}
exports.getVariableDeclarationKind = getVariableDeclarationKind;
function isBlockScopedVariableDeclarationList(declarationList) {
    return getVariableDeclarationKind(declarationList) !== 0;
}
exports.isBlockScopedVariableDeclarationList = isBlockScopedVariableDeclarationList;
function isBlockScopedVariableDeclaration(declaration) {
    return declaration.parent.kind === ts.SyntaxKind.CatchClause ||
        isBlockScopedVariableDeclarationList(declaration.parent);
}
exports.isBlockScopedVariableDeclaration = isBlockScopedVariableDeclaration;
var ScopeBoundary;
(function (ScopeBoundary) {
    ScopeBoundary[ScopeBoundary["None"] = 0] = "None";
    ScopeBoundary[ScopeBoundary["Function"] = 1] = "Function";
    ScopeBoundary[ScopeBoundary["Block"] = 2] = "Block";
})(ScopeBoundary = exports.ScopeBoundary || (exports.ScopeBoundary = {}));
function isScopeBoundary(node) {
    if (isFunctionScopeBoundary(node))
        return 1;
    if (isBlockScopeBoundary(node))
        return 2;
    return 0;
}
exports.isScopeBoundary = isScopeBoundary;
function isFunctionScopeBoundary(node) {
    switch (node.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.ModuleDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.EnumDeclaration:
            return true;
        case ts.SyntaxKind.SourceFile:
            return ts.isExternalModule(node);
        default:
            return false;
    }
}
exports.isFunctionScopeBoundary = isFunctionScopeBoundary;
function isBlockScopeBoundary(node) {
    switch (node.kind) {
        case ts.SyntaxKind.Block:
            var parent = node.parent;
            return parent.kind !== ts.SyntaxKind.CatchClause &&
                (parent.kind === ts.SyntaxKind.SourceFile ||
                    !isFunctionScopeBoundary(parent));
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.CaseBlock:
        case ts.SyntaxKind.CatchClause:
            return true;
        default:
            return false;
    }
}
exports.isBlockScopeBoundary = isBlockScopeBoundary;
function hasOwnThisReference(node) {
    switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.FunctionExpression:
            return true;
        case ts.SyntaxKind.FunctionDeclaration:
            return node.body !== undefined;
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            return node.parent.kind === ts.SyntaxKind.ObjectLiteralExpression;
        default:
            return false;
    }
}
exports.hasOwnThisReference = hasOwnThisReference;
function forEachToken(node, cb, sourceFile) {
    if (sourceFile === void 0) { sourceFile = node.getSourceFile(); }
    return (function iterate(child) {
        if (isTokenKind(child.kind))
            return cb(child);
        if (child.kind !== ts.SyntaxKind.JSDocComment)
            return child.getChildren(sourceFile).forEach(iterate);
    })(node);
}
exports.forEachToken = forEachToken;
function forEachTokenWithTrivia(node, cb, sourceFile) {
    if (sourceFile === void 0) { sourceFile = node.getSourceFile(); }
    var fullText = sourceFile.text;
    var notJsx = sourceFile.languageVariant !== ts.LanguageVariant.JSX;
    var scanner = ts.createScanner(sourceFile.languageVersion, false, sourceFile.languageVariant, fullText);
    return forEachToken(node, function (token) {
        var tokenStart = token.getStart(sourceFile);
        var end = token.end;
        if (tokenStart !== token.pos && (notJsx || canHaveLeadingTrivia(token))) {
            scanner.setTextPos(token.pos);
            var position = void 0;
            do {
                var kind = scanner.scan();
                position = scanner.getTextPos();
                cb(fullText, kind, { pos: scanner.getTokenPos(), end: position }, token.parent);
            } while (position < tokenStart);
        }
        return cb(fullText, token.kind, { end: end, pos: tokenStart }, token.parent);
    }, sourceFile);
}
exports.forEachTokenWithTrivia = forEachTokenWithTrivia;
function forEachComment(node, cb, sourceFile) {
    if (sourceFile === void 0) { sourceFile = node.getSourceFile(); }
    var fullText = sourceFile.text;
    var notJsx = sourceFile.languageVariant !== ts.LanguageVariant.JSX;
    return forEachToken(node, function (token) {
        if (notJsx || canHaveLeadingTrivia(token)) {
            var comments = ts.getLeadingCommentRanges(fullText, token.pos);
            if (comments !== undefined)
                for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
                    var comment = comments_1[_i];
                    cb(fullText, comment);
                }
        }
        if (notJsx || canHaveTrailingTrivia(token)) {
            var comments = ts.getTrailingCommentRanges(fullText, token.end);
            if (comments !== undefined)
                for (var _a = 0, comments_2 = comments; _a < comments_2.length; _a++) {
                    var comment = comments_2[_a];
                    cb(fullText, comment);
                }
        }
    }, sourceFile);
}
exports.forEachComment = forEachComment;
function canHaveLeadingTrivia(_a) {
    var kind = _a.kind, parent = _a.parent;
    if (kind === ts.SyntaxKind.OpenBraceToken)
        return parent.kind !== ts.SyntaxKind.JsxExpression || parent.parent.kind !== ts.SyntaxKind.JsxElement;
    if (kind === ts.SyntaxKind.LessThanToken) {
        if (parent.kind === ts.SyntaxKind.JsxClosingElement)
            return false;
        if (parent.kind === ts.SyntaxKind.JsxOpeningElement || parent.kind === ts.SyntaxKind.JsxSelfClosingElement)
            return parent.parent.parent.kind !== ts.SyntaxKind.JsxElement;
    }
    return kind !== ts.SyntaxKind.JsxText;
}
function canHaveTrailingTrivia(_a) {
    var kind = _a.kind, parent = _a.parent;
    if (kind === ts.SyntaxKind.CloseBraceToken)
        return parent.kind !== ts.SyntaxKind.JsxExpression || parent.parent.kind !== ts.SyntaxKind.JsxElement;
    if (kind === ts.SyntaxKind.GreaterThanToken) {
        if (parent.kind === ts.SyntaxKind.JsxOpeningElement)
            return false;
        if (parent.kind === ts.SyntaxKind.JsxClosingElement || parent.kind === ts.SyntaxKind.JsxSelfClosingElement)
            return parent.parent.parent.kind !== ts.SyntaxKind.JsxElement;
    }
    return kind !== ts.SyntaxKind.JsxText;
}
function endsControlFlow(statement) {
    return getControlFlowEnd(statement) !== 0;
}
exports.endsControlFlow = endsControlFlow;
var StatementType;
(function (StatementType) {
    StatementType[StatementType["None"] = 0] = "None";
    StatementType[StatementType["Break"] = 1] = "Break";
    StatementType[StatementType["Other"] = 2] = "Other";
})(StatementType || (StatementType = {}));
function getControlFlowEnd(statement) {
    while (typeguard_1.isBlockLike(statement)) {
        if (statement.statements.length === 0)
            return 0;
        statement = statement.statements[statement.statements.length - 1];
    }
    return hasReturnBreakContinueThrow(statement);
}
function hasReturnBreakContinueThrow(statement) {
    if (statement.kind === ts.SyntaxKind.ReturnStatement ||
        statement.kind === ts.SyntaxKind.ContinueStatement ||
        statement.kind === ts.SyntaxKind.ThrowStatement)
        return 2;
    if (statement.kind === ts.SyntaxKind.BreakStatement)
        return 1;
    if (typeguard_1.isIfStatement(statement)) {
        if (statement.elseStatement === undefined)
            return 0;
        var then = getControlFlowEnd(statement.thenStatement);
        if (!then)
            return then;
        return Math.min(then, getControlFlowEnd(statement.elseStatement));
    }
    if (typeguard_1.isSwitchStatement(statement)) {
        var hasDefault = false;
        var fallthrough = false;
        for (var _i = 0, _a = statement.caseBlock.clauses; _i < _a.length; _i++) {
            var clause = _a[_i];
            var retVal = getControlFlowEnd(clause);
            if (retVal === 0) {
                fallthrough = true;
            }
            else if (retVal === 1) {
                return 0;
            }
            else {
                fallthrough = false;
            }
            hasDefault = hasDefault || clause.kind === ts.SyntaxKind.DefaultClause;
        }
        return !fallthrough && hasDefault ? 2 : 0;
    }
    return 0;
}
function getLineRanges(sourceFile) {
    var lineStarts = sourceFile.getLineStarts();
    var result = [];
    var length = lineStarts.length;
    for (var i = 1; i < length; ++i) {
        result.push({
            end: lineStarts[i],
            pos: lineStarts[i - 1],
        });
    }
    result.push({
        end: sourceFile.end,
        pos: lineStarts[length - 1],
    });
    return result;
}
exports.getLineRanges = getLineRanges;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUNqQyx5Q0FBaUc7QUFFakcsd0JBQStCLElBQWEsRUFBRSxJQUFtQixFQUFFLFVBQTBCO0lBQ3pGLEdBQUcsQ0FBQyxDQUFnQixVQUE0QixFQUE1QixLQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQTVCLGNBQTRCLEVBQTVCLElBQTRCO1FBQTNDLElBQU0sS0FBSyxTQUFBO1FBQ1osRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7WUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUFBO0FBQ3pCLENBQUM7QUFKRCx3Q0FJQztBQUVELHFCQUE0QixJQUFtQjtJQUMzQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVM7UUFDdEUsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLENBQUM7QUFIRCxrQ0FHQztBQUVELG9CQUEyQixJQUFtQjtJQUMxQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUztRQUNsQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7QUFDdkMsQ0FBQztBQUhELGdDQUdDO0FBRUQsMEJBQWlDLElBQW1CO0lBQ2hELE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO0FBQ3pGLENBQUM7QUFGRCw0Q0FFQztBQUVELHdCQUErQixJQUFtQjtJQUM5QyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxJQUFJ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