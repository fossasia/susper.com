"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var node_1 = require("../typeguard/node");
function getChildOfKind(node, kind, sourceFile) {
    for (var _i = 0, _a = node.getChildren(sourceFile); _i < _a.length; _i++) {
        var child = _a[_i];
        if (child.kind === kind)
            return child;
    }
}
exports.getChildOfKind = getChildOfKind;
function isTokenKind(kind) {
    return kind >= ts.SyntaxKind.FirstToken && kind <= ts.SyntaxKind.LastToken;
}
exports.isTokenKind = isTokenKind;
function isNodeKind(kind) {
    return kind >= ts.SyntaxKind.FirstNode;
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
function isThisParameter(parameter) {
    return parameter.name.kind === ts.SyntaxKind.Identifier && parameter.name.originalKeywordKind === ts.SyntaxKind.ThisKeyword;
}
exports.isThisParameter = isThisParameter;
function getModifier(node, kind) {
    if (node.modifiers !== undefined)
        for (var _i = 0, _a = node.modifiers; _i < _a.length; _i++) {
            var modifier = _a[_i];
            if (modifier.kind === kind)
                return modifier;
        }
}
exports.getModifier = getModifier;
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
function isFlagSet(obj, flag) {
    return (obj.flags & flag) !== 0;
}
exports.isNodeFlagSet = isFlagSet;
exports.isTypeFlagSet = isFlagSet;
exports.isSymbolFlagSet = isFlagSet;
function isObjectFlagSet(objectType, flag) {
    return (objectType.objectFlags & flag) !== 0;
}
exports.isObjectFlagSet = isObjectFlagSet;
function isModifierFlagSet(node, flag) {
    return (ts.getCombinedModifierFlags(node) & flag) !== 0;
}
exports.isModifierFlagSet = isModifierFlagSet;
function isModfierFlagSet(node, flag) {
    return isModifierFlagSet(node, flag);
}
exports.isModfierFlagSet = isModfierFlagSet;
function getPreviousStatement(statement) {
    var parent = statement.parent;
    if (node_1.isBlockLike(parent)) {
        var index = parent.statements.indexOf(statement);
        if (index > 0)
            return parent.statements[index - 1];
    }
}
exports.getPreviousStatement = getPreviousStatement;
function getNextStatement(statement) {
    var parent = statement.parent;
    if (node_1.isBlockLike(parent)) {
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
    outer: while (true) {
        var children = parent.getChildren(sourceFile);
        for (var i = children.length - 1; i >= 0; --i) {
            var child = children[i];
            if (child.pos < node.pos && child.kind !== ts.SyntaxKind.JSDocComment) {
                if (isTokenKind(child.kind))
                    return child;
                parent = child;
                continue outer;
            }
        }
        return;
    }
}
exports.getPreviousToken = getPreviousToken;
function getNextToken(node, sourceFile) {
    if (sourceFile === void 0) { sourceFile = node.getSourceFile(); }
    if (node.kind === ts.SyntaxKind.SourceFile || node.kind === ts.SyntaxKind.EndOfFileToken)
        return;
    var end = node.end;
    node = node.parent;
    while (node.end === end) {
        if (node.parent === undefined)
            return node.endOfFileToken;
        node = node.parent;
    }
    return getTokenAtPositionWorker(node, end, sourceFile);
}
exports.getNextToken = getNextToken;
function getTokenAtPosition(parent, pos, sourceFile) {
    if (pos < parent.pos || pos >= parent.end)
        return;
    if (isTokenKind(parent.kind))
        return parent;
    if (sourceFile === undefined)
        sourceFile = parent.getSourceFile();
    return getTokenAtPositionWorker(parent, pos, sourceFile);
}
exports.getTokenAtPosition = getTokenAtPosition;
function getTokenAtPositionWorker(node, pos, sourceFile) {
    outer: while (true) {
        for (var _i = 0, _a = node.getChildren(sourceFile); _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.end > pos && child.kind !== ts.SyntaxKind.JSDocComment) {
                if (isTokenKind(child.kind))
                    return child;
                node = child;
                continue outer;
            }
        }
        return;
    }
}
function getCommentAtPosition(sourceFile, pos, parent) {
    if (parent === void 0) { parent = sourceFile; }
    var token = getTokenAtPosition(parent, pos, sourceFile);
    if (token === undefined || token.kind === ts.SyntaxKind.JsxText || pos >= token.end - (ts.tokenToString(token.kind) || '').length)
        return;
    var cb = function (start, end, kind) {
        return pos >= start && pos < end ? { end: end, kind: kind, pos: start } : undefined;
    };
    return token.pos !== 0 && ts.forEachTrailingCommentRange(sourceFile.text, token.pos, cb) ||
        ts.forEachLeadingCommentRange(sourceFile.text, token.pos, cb);
}
exports.getCommentAtPosition = getCommentAtPosition;
function isPositionInComment(sourceFile, pos, parent) {
    return getCommentAtPosition(sourceFile, pos, parent) !== undefined;
}
exports.isPositionInComment = isPositionInComment;
function getPropertyName(propertyName) {
    if (propertyName.kind === ts.SyntaxKind.ComputedPropertyName) {
        if (!node_1.isLiteralExpression(propertyName.expression))
            return;
        return propertyName.expression.text;
    }
    return propertyName.kind === ts.SyntaxKind.Identifier ? getIdentifierText(propertyName) : propertyName.text;
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
    if (declarationList.flags & ts.NodeFlags.Let)
        return 1;
    if (declarationList.flags & ts.NodeFlags.Const)
        return 2;
    return 0;
}
exports.getVariableDeclarationKind = getVariableDeclarationKind;
function isBlockScopedVariableDeclarationList(declarationList) {
    return (declarationList.flags & ts.NodeFlags.BlockScoped) !== 0;
}
exports.isBlockScopedVariableDeclarationList = isBlockScopedVariableDeclarationList;
function isBlockScopedVariableDeclaration(declaration) {
    var parent = declaration.parent;
    return parent.kind === ts.SyntaxKind.CatchClause ||
        isBlockScopedVariableDeclarationList(parent);
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
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.ModuleDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.EnumDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.ConstructorType:
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.MappedType:
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
function isFunctionWithBody(node) {
    switch (node.kind) {
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.Constructor:
            return node.body !== undefined;
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
            return true;
        default:
            return false;
    }
}
exports.isFunctionWithBody = isFunctionWithBody;
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
        var tokenStart = token.kind === ts.SyntaxKind.JsxText ? token.pos : token.getStart(sourceFile);
        var end = token.end;
        if (tokenStart !== token.pos && (notJsx || canHaveLeadingTrivia(token))) {
            scanner.setTextPos(token.pos);
            var kind = scanner.scan();
            var pos = scanner.getTokenPos();
            while (pos < tokenStart) {
                var textPos = scanner.getTextPos();
                cb(fullText, kind, { pos: pos, end: textPos }, token.parent);
                if (textPos === tokenStart)
                    break;
                kind = scanner.scan();
                pos = scanner.getTokenPos();
            }
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
        if (notJsx || canHaveLeadingTrivia(token))
            ts.forEachLeadingCommentRange(fullText, token.pos, commentCallback);
        if (notJsx || canHaveTrailingTrivia(token))
            return ts.forEachTrailingCommentRange(fullText, token.end, commentCallback);
    }, sourceFile);
    function commentCallback(pos, end, kind) {
        cb(fullText, { pos: pos, end: end, kind: kind });
    }
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
    while (node_1.isBlockLike(statement)) {
        if (statement.statements.length === 0)
            return 0;
        statement = statement.statements[statement.statements.length - 1];
    }
    return hasReturnBreakContinueThrow(statement);
}
function hasReturnBreakContinueThrow(statement) {
    switch (statement.kind) {
        case ts.SyntaxKind.ReturnStatement:
        case ts.SyntaxKind.ContinueStatement:
        case ts.SyntaxKind.ThrowStatement:
            return 2;
        case ts.SyntaxKind.BreakStatement:
            return 1;
    }
    if (node_1.isIfStatement(statement)) {
        if (statement.elseStatement === undefined)
            return 0;
        var then = getControlFlowEnd(statement.thenStatement);
        if (!then)
            return then;
        return Math.min(then, getControlFlowEnd(statement.elseStatement));
    }
    if (node_1.isSwitchStatement(statement)) {
        var hasDefault = false;
        var type = 0;
        for (var _i = 0, _a = statement.caseBlock.clauses; _i < _a.length; _i++) {
            var clause = _a[_i];
            type = getControlFlowEnd(clause);
            if (type === 1)
                return 0;
            if (clause.kind === ts.SyntaxKind.DefaultClause)
                hasDefault = true;
        }
        return hasDefault && type !== 0 ? 2 : 0;
    }
    return 0;
}
function getLineRanges(sourceFile) {
    var lineStarts = sourceFile.getLineStarts();
    var result = [];
    var length = lineStarts.length;
    var sourceText = sourceFile.text;
    var pos = 0;
    for (var i = 1; i < length; ++i) {
        var end = lineStarts[i];
        var lineEnd = end;
        for (; lineEnd > pos; --lineEnd)
            if (!ts.isLineBreak(sourceText.charCodeAt(lineEnd - 1)))
                break;
        result.push({
            pos: pos,
            end: end,
            contentLength: lineEnd - pos,
        });
        pos = end;
    }
    result.push({
        pos: pos,
        end: sourceFile.end,
        contentLength: sourceFile.end - pos,
    });
    return result;
}
exports.getLineRanges = getLineRanges;
var cachedScanner;
function scanToken(text) {
    if (cachedScanner === undefined)
        cachedScanner = ts.createScanner(ts.ScriptTarget.Latest, false);
    cachedScanner.setText(text);
    cachedScanner.scan();
    return cachedScanner;
}
function isValidIdentifier(text) {
    var scan = scanToken(text);
    return scan.isIdentifier() && scan.getTextPos() === text.length;
}
exports.isValidIdentifier = isValidIdentifier;
function isValidPropertyAccess(text) {
    if (!ts.isIdentifierStart(text.charCodeAt(0), ts.ScriptTarget.Latest))
        return false;
    for (var i = 1; i < text.length; ++i)
        if (!ts.isIdentifierPart(text.charCodeAt(i), ts.ScriptTarget.Latest))
            return false;
    return true;
}
exports.isValidPropertyAccess = isValidPropertyAccess;
function isValidPropertyName(text) {
    if (isValidPropertyAccess(text))
        return true;
    var scan = scanToken(text);
    return scan.getTextPos() === text.length &&
        scan.getToken() === ts.SyntaxKind.NumericLiteral && scan.getTokenValue() === text;
}
exports.isValidPropertyName = isValidPropertyName;
function isValidNumericLiteral(text) {
    var scan = scanToken(text);
    return scan.getToken() === ts.SyntaxKind.NumericLiteral && scan.getTextPos() === text.length;
}
exports.isValidNumericLiteral = isValidNumericLiteral;
function isSameLine(sourceFile, pos1, pos2) {
    return ts.getLineAndCharacterOfPosition(sourceFile, pos1).line === ts.getLineAndCharacterOfPosition(sourceFile, pos2).line;
}
exports.isSameLine = isSameLine;
var SideEffectOptions;
(function (SideEffectOptions) {
    SideEffectOptions[SideEffectOptions["None"] = 0] = "None";
    SideEffectOptions[SideEffectOptions["TaggedTemplate"] = 1] = "TaggedTemplate";
    SideEffectOptions[SideEffectOptions["Constructor"] = 2] = "Constructor";
    SideEffectOptions[SideEffectOptions["JsxElement"] = 4] = "JsxElement";
})(SideEffectOptions = exports.SideEffectOptions || (exports.SideEffectOptions = {}));
function hasSideEffects(node, options) {
    switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.PostfixUnaryExpression:
        case ts.SyntaxKind.AwaitExpression:
        case ts.SyntaxKind.YieldExpression:
        case ts.SyntaxKind.DeleteExpression:
            return true;
        case ts.SyntaxKind.TypeAssertionExpression:
        case ts.SyntaxKind.AsExpression:
        case ts.SyntaxKind.ParenthesizedExpression:
        case ts.SyntaxKind.NonNullExpression:
        case ts.SyntaxKind.VoidExpression:
        case ts.SyntaxKind.TypeOfExpression:
        case ts.SyntaxKind.PropertyAccessExpression:
        case ts.SyntaxKind.SpreadElement:
        case ts.SyntaxKind.PartiallyEmittedExpression:
            return hasSideEffects(node.expression, options);
        case ts.SyntaxKind.BinaryExpression:
            return isAssignmentKind(node.operatorToken.kind) ||
                hasSideEffects(node.left, options) ||
                hasSideEffects(node.right, options);
        case ts.SyntaxKind.PrefixUnaryExpression:
            switch (node.operator) {
                case ts.SyntaxKind.PlusPlusToken:
                case ts.SyntaxKind.MinusMinusToken:
                    return true;
                default:
                    return hasSideEffects(node.operand, options);
            }
        case ts.SyntaxKind.ElementAccessExpression:
            return hasSideEffects(node.expression, options) ||
                node.argumentExpression !== undefined &&
                    hasSideEffects(node.argumentExpression, options);
        case ts.SyntaxKind.ConditionalExpression:
            return hasSideEffects(node.condition, options) ||
                hasSideEffects(node.whenTrue, options) ||
                hasSideEffects(node.whenFalse, options);
        case ts.SyntaxKind.NewExpression:
            if (options & 2 || hasSideEffects(node.expression, options))
                return true;
            if (node.arguments !== undefined)
                for (var _i = 0, _a = node.arguments; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (hasSideEffects(child, options))
                        return true;
                }
            return false;
        case ts.SyntaxKind.TaggedTemplateExpression:
            if (options & 1 || hasSideEffects(node.tag, options))
                return true;
            node = node.template;
        case ts.SyntaxKind.TemplateExpression:
            for (var _b = 0, _c = node.templateSpans; _b < _c.length; _b++) {
                var child = _c[_b];
                if (hasSideEffects(child.expression, options))
                    return true;
            }
            return false;
        case ts.SyntaxKind.ClassExpression:
            return classExpressionHasSideEffects(node, options);
        case ts.SyntaxKind.ArrayLiteralExpression:
            for (var _d = 0, _e = node.elements; _d < _e.length; _d++) {
                var child = _e[_d];
                if (hasSideEffects(child, options))
                    return true;
            }
            return false;
        case ts.SyntaxKind.ObjectLiteralExpression:
            for (var _f = 0, _g = node.properties; _f < _g.length; _f++) {
                var child = _g[_f];
                if (child.name !== undefined && child.name.kind === ts.SyntaxKind.ComputedPropertyName &&
                    hasSideEffects(child.name.expression, options))
                    return true;
                switch (child.kind) {
                    case ts.SyntaxKind.PropertyAssignment:
                        if (hasSideEffects(child.initializer, options))
                            return true;
                        break;
                    case ts.SyntaxKind.SpreadAssignment:
                        if (hasSideEffects(child.expression, options))
                            return true;
                }
            }
            return false;
        case ts.SyntaxKind.JsxExpression:
            return node.expression !== undefined && hasSideEffects(node.expression, options);
        case ts.SyntaxKind.JsxElement:
            for (var _h = 0, _j = node.children; _h < _j.length; _h++) {
                var child = _j[_h];
                if (child.kind !== ts.SyntaxKind.JsxText && hasSideEffects(child, options))
                    return true;
            }
            node = node.openingElement;
        case ts.SyntaxKind.JsxSelfClosingElement:
        case ts.SyntaxKind.JsxOpeningElement:
            if (options & 4)
                return true;
            for (var _k = 0, _l = getJsxAttributes(node); _k < _l.length; _k++) {
                var child = _l[_k];
                if (child.kind === ts.SyntaxKind.JsxSpreadAttribute) {
                    if (hasSideEffects(child.expression, options))
                        return true;
                }
                else if (child.initializer !== undefined && hasSideEffects(child.initializer, options)) {
                    return true;
                }
            }
            return false;
        case ts.SyntaxKind.CommaListExpression:
            for (var _m = 0, _o = node.elements; _m < _o.length; _m++) {
                var child = _o[_m];
                if (hasSideEffects(child, options))
                    return true;
            }
            return false;
        default:
            return false;
    }
}
exports.hasSideEffects = hasSideEffects;
function getJsxAttributes(openElement) {
    var attributes = openElement.attributes;
    return Array.isArray(attributes) ? attributes : attributes.properties;
}
function classExpressionHasSideEffects(node, options) {
    if (node.heritageClauses !== undefined && node.heritageClauses[0].token === ts.SyntaxKind.ExtendsKeyword)
        for (var _i = 0, _a = node.heritageClauses[0].types; _i < _a.length; _i++) {
            var base = _a[_i];
            if (hasSideEffects(base.expression, options))
                return true;
        }
    for (var _b = 0, _c = node.members; _b < _c.length; _b++) {
        var child = _c[_b];
        if (child.name !== undefined && child.name.kind === ts.SyntaxKind.ComputedPropertyName &&
            hasSideEffects(child.name.expression, options) ||
            node_1.isPropertyDeclaration(child) && child.initializer !== undefined &&
                hasSideEffects(child.initializer, options))
            return true;
    }
    return false;
}
function getDeclarationOfBindingElement(node) {
    var parent = node.parent.parent;
    while (parent.kind === ts.SyntaxKind.BindingElement)
        parent = parent.parent.parent;
    return parent;
}
exports.getDeclarationOfBindingElement = getDeclarationOfBindingElement;
function isExpressionValueUsed(node) {
    while (true) {
        var parent = node.parent;
        switch (parent.kind) {
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.NewExpression:
            case ts.SyntaxKind.ElementAccessExpression:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.WithStatement:
            case ts.SyntaxKind.ThrowStatement:
            case ts.SyntaxKind.ReturnStatement:
            case ts.SyntaxKind.JsxExpression:
            case ts.SyntaxKind.JsxSpreadAttribute:
            case ts.SyntaxKind.JsxElement:
            case ts.SyntaxKind.JsxSelfClosingElement:
            case ts.SyntaxKind.ComputedPropertyName:
            case ts.SyntaxKind.ArrowFunction:
            case ts.SyntaxKind.ExportSpecifier:
            case ts.SyntaxKind.ExportAssignment:
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ExternalModuleReference:
            case ts.SyntaxKind.Decorator:
            case ts.SyntaxKind.TaggedTemplateExpression:
            case ts.SyntaxKind.TemplateSpan:
            case ts.SyntaxKind.ExpressionWithTypeArguments:
            case ts.SyntaxKind.TypeOfExpression:
            case ts.SyntaxKind.AwaitExpression:
            case ts.SyntaxKind.YieldExpression:
            case ts.SyntaxKind.LiteralType:
            case ts.SyntaxKind.JsxAttributes:
            case ts.SyntaxKind.JsxOpeningElement:
            case ts.SyntaxKind.JsxClosingElement:
            case ts.SyntaxKind.IfStatement:
            case ts.SyntaxKind.CaseClause:
            case ts.SyntaxKind.SwitchStatement:
                return true;
            case ts.SyntaxKind.PropertyAccessExpression:
                return parent.expression === node;
            case ts.SyntaxKind.QualifiedName:
                return parent.left === node;
            case ts.SyntaxKind.ShorthandPropertyAssignment:
                return parent.objectAssignmentInitializer === node ||
                    !isInDestructuringAssignment(parent);
            case ts.SyntaxKind.PropertyAssignment:
                return parent.initializer === node && !isInDestructuringAssignment(parent);
            case ts.SyntaxKind.SpreadAssignment:
            case ts.SyntaxKind.SpreadElement:
            case ts.SyntaxKind.ArrayLiteralExpression:
                return !isInDestructuringAssignment(parent);
            case ts.SyntaxKind.ParenthesizedExpression:
            case ts.SyntaxKind.AsExpression:
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.PrefixUnaryExpression:
            case ts.SyntaxKind.NonNullExpression:
                node = parent;
                break;
            case ts.SyntaxKind.ForStatement:
                return parent.condition === node;
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.ForOfStatement:
                return parent.expression === node;
            case ts.SyntaxKind.ConditionalExpression:
                if (parent.condition === node)
                    return true;
                node = parent;
                break;
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.BindingElement:
            case ts.SyntaxKind.VariableDeclaration:
            case ts.SyntaxKind.Parameter:
            case ts.SyntaxKind.EnumMember:
                return parent.initializer === node;
            case ts.SyntaxKind.ImportEqualsDeclaration:
                return parent.moduleReference === node;
            case ts.SyntaxKind.CommaListExpression:
                if (parent.elements[parent.elements.length - 1] !== node)
                    return false;
                node = parent;
                break;
            case ts.SyntaxKind.BinaryExpression:
                if (parent.right === node) {
                    if (parent.operatorToken.kind === ts.SyntaxKind.CommaToken) {
                        node = parent;
                        break;
                    }
                    return true;
                }
                switch (parent.operatorToken.kind) {
                    case ts.SyntaxKind.CommaToken:
                    case ts.SyntaxKind.EqualsToken:
                        return false;
                    case ts.SyntaxKind.EqualsEqualsEqualsToken:
                    case ts.SyntaxKind.EqualsEqualsToken:
                    case ts.SyntaxKind.ExclamationEqualsEqualsToken:
                    case ts.SyntaxKind.ExclamationEqualsToken:
                    case ts.SyntaxKind.InstanceOfKeyword:
                    case ts.SyntaxKind.PlusToken:
                    case ts.SyntaxKind.MinusToken:
                    case ts.SyntaxKind.AsteriskToken:
                    case ts.SyntaxKind.SlashToken:
                    case ts.SyntaxKind.PercentToken:
                    case ts.SyntaxKind.AsteriskAsteriskToken:
                    case ts.SyntaxKind.GreaterThanToken:
                    case ts.SyntaxKind.GreaterThanGreaterThanToken:
                    case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
                    case ts.SyntaxKind.GreaterThanEqualsToken:
                    case ts.SyntaxKind.LessThanToken:
                    case ts.SyntaxKind.LessThanLessThanToken:
                    case ts.SyntaxKind.LessThanEqualsToken:
                    case ts.SyntaxKind.AmpersandToken:
                    case ts.SyntaxKind.BarToken:
                    case ts.SyntaxKind.CaretToken:
                    case ts.SyntaxKind.BarBarToken:
                    case ts.SyntaxKind.AmpersandAmpersandToken:
                    case ts.SyntaxKind.InKeyword:
                        return true;
                    default:
                        node = parent;
                }
                break;
            default:
                return false;
        }
    }
}
exports.isExpressionValueUsed = isExpressionValueUsed;
function isInDestructuringAssignment(node) {
    switch (node.kind) {
        case ts.SyntaxKind.ShorthandPropertyAssignment:
            if (node.objectAssignmentInitializer !== undefined)
                return true;
        case ts.SyntaxKind.PropertyAssignment:
        case ts.SyntaxKind.SpreadAssignment:
            node = node.parent;
            break;
        case ts.SyntaxKind.SpreadElement:
            if (node.parent.kind !== ts.SyntaxKind.ArrayLiteralExpression)
                return false;
            node = node.parent;
    }
    while (true) {
        switch (node.parent.kind) {
            case ts.SyntaxKind.BinaryExpression:
                return node.parent.left === node &&
                    node.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken;
            case ts.SyntaxKind.ForOfStatement:
                return node.parent.initializer === node;
            case ts.SyntaxKind.ArrayLiteralExpression:
            case ts.SyntaxKind.ObjectLiteralExpression:
                node = node.parent;
                break;
            case ts.SyntaxKind.SpreadAssignment:
            case ts.SyntaxKind.PropertyAssignment:
                node = node.parent.parent;
                break;
            case ts.SyntaxKind.SpreadElement:
                if (node.parent.parent.kind !== ts.SyntaxKind.ArrayLiteralExpression)
                    return false;
                node = node.parent.parent;
                break;
            default:
                return false;
        }
    }
}
function isReassignmentTarget(node) {
    var parent = node.parent;
    switch (parent.kind) {
        case ts.SyntaxKind.PostfixUnaryExpression:
        case ts.SyntaxKind.DeleteExpression:
            return true;
        case ts.SyntaxKind.PrefixUnaryExpression:
            return parent.operator === ts.SyntaxKind.PlusPlusToken ||
                parent.operator === ts.SyntaxKind.MinusMinusToken;
        case ts.SyntaxKind.BinaryExpression:
            return parent.left === node &&
                isAssignmentKind(parent.operatorToken.kind);
        case ts.SyntaxKind.ShorthandPropertyAssignment:
            return parent.name === node &&
                isInDestructuringAssignment(parent);
        case ts.SyntaxKind.PropertyAssignment:
            return parent.initializer === node &&
                isInDestructuringAssignment(parent);
        case ts.SyntaxKind.ObjectLiteralExpression:
        case ts.SyntaxKind.ArrayLiteralExpression:
        case ts.SyntaxKind.SpreadElement:
        case ts.SyntaxKind.SpreadAssignment:
            return isInDestructuringAssignment(parent);
        case ts.SyntaxKind.ParenthesizedExpression:
            return isReassignmentTarget(parent);
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.ForInStatement:
            return parent.initializer === node;
    }
    return false;
}
exports.isReassignmentTarget = isReassignmentTarget;
function getIdentifierText(node) {
    return ts.unescapeIdentifier(node.text);
}
exports.getIdentifierText = getIdentifierText;
function canHaveJsDoc(node) {
    switch (node.kind) {
        case ts.SyntaxKind.Parameter:
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.ParenthesizedExpression:
        case ts.SyntaxKind.SpreadAssignment:
        case ts.SyntaxKind.ShorthandPropertyAssignment:
        case ts.SyntaxKind.PropertyAssignment:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.LabeledStatement:
        case ts.SyntaxKind.ExpressionStatement:
        case ts.SyntaxKind.VariableStatement:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.EnumMember:
        case ts.SyntaxKind.EnumDeclaration:
        case ts.SyntaxKind.ModuleDeclaration:
        case ts.SyntaxKind.ImportEqualsDeclaration:
        case ts.SyntaxKind.IndexSignature:
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.ConstructorType:
        case ts.SyntaxKind.JSDocFunctionType:
        case ts.SyntaxKind.EndOfFileToken:
            return true;
        default:
            return false;
    }
}
exports.canHaveJsDoc = canHaveJsDoc;
function getJsDoc(node, sourceFile) {
    if (node.kind === ts.SyntaxKind.EndOfFileToken)
        return parseJsDocWorker(node, sourceFile || node.parent);
    var result = [];
    for (var _i = 0, _a = node.getChildren(sourceFile); _i < _a.length; _i++) {
        var child = _a[_i];
        if (!node_1.isJsDoc(child))
            break;
        result.push(child);
    }
    return result;
}
exports.getJsDoc = getJsDoc;
function parseJsDocOfNode(node, considerTrailingComments, sourceFile) {
    if (sourceFile === void 0) { sourceFile = node.getSourceFile(); }
    if (canHaveJsDoc(node) && node.kind !== ts.SyntaxKind.EndOfFileToken) {
        var result = getJsDoc(node, sourceFile);
        if (result.length !== 0 || !considerTrailingComments)
            return result;
    }
    return parseJsDocWorker(node, sourceFile, considerTrailingComments);
}
exports.parseJsDocOfNode = parseJsDocOfNode;
function parseJsDocWorker(node, sourceFile, considerTrailingComments) {
    var nodeStart = node.getStart(sourceFile);
    var start = ts[considerTrailingComments && isSameLine(sourceFile, node.pos, nodeStart)
        ? 'forEachTrailingCommentRange'
        : 'forEachLeadingCommentRange'](sourceFile.text, node.pos, function (pos, _end, kind) { return kind === ts.SyntaxKind.MultiLineCommentTrivia && sourceFile.text[pos + 2] === '*' ? { pos: pos } : undefined; });
    if (start === undefined)
        return [];
    var startPos = start.pos;
    var text = sourceFile.text.slice(startPos, nodeStart);
    var newSourceFile = ts.createSourceFile('jsdoc.ts', text + "var a;", sourceFile.languageVersion);
    var result = getJsDoc(newSourceFile.statements[0], newSourceFile);
    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
        var doc = result_1[_i];
        updateNode(doc, node);
    }
    return result;
    function updateNode(n, parent) {
        n.pos += startPos;
        n.end += startPos;
        n.parent = parent;
        return ts.forEachChild(n, function (child) { return updateNode(child, n); }, function (children) {
            children.pos += startPos;
            children.end += startPos;
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                updateNode(child, n);
            }
        });
    }
}
var ImportKind;
(function (ImportKind) {
    ImportKind[ImportKind["ImportDeclaration"] = 1] = "ImportDeclaration";
    ImportKind[ImportKind["ImportEquals"] = 2] = "ImportEquals";
    ImportKind[ImportKind["ExportFrom"] = 4] = "ExportFrom";
    ImportKind[ImportKind["DynamicImport"] = 8] = "DynamicImport";
    ImportKind[ImportKind["Require"] = 16] = "Require";
    ImportKind[ImportKind["All"] = 31] = "All";
    ImportKind[ImportKind["AllImports"] = 27] = "AllImports";
    ImportKind[ImportKind["AllStaticImports"] = 3] = "AllStaticImports";
    ImportKind[ImportKind["AllImportExpressions"] = 24] = "AllImportExpressions";
    ImportKind[ImportKind["AllRequireLike"] = 18] = "AllRequireLike";
})(ImportKind = exports.ImportKind || (exports.ImportKind = {}));
var ImportOptions;
(function (ImportOptions) {
    ImportOptions[ImportOptions["ImportDeclaration"] = 1] = "ImportDeclaration";
    ImportOptions[ImportOptions["ImportEquals"] = 2] = "ImportEquals";
    ImportOptions[ImportOptions["ExportFrom"] = 4] = "ExportFrom";
    ImportOptions[ImportOptions["DynamicImport"] = 8] = "DynamicImport";
    ImportOptions[ImportOptions["Require"] = 16] = "Require";
    ImportOptions[ImportOptions["All"] = 31] = "All";
    ImportOptions[ImportOptions["AllImports"] = 27] = "AllImports";
    ImportOptions[ImportOptions["AllStaticImports"] = 3] = "AllStaticImports";
    ImportOptions[ImportOptions["AllDynamic"] = 24] = "AllDynamic";
    ImportOptions[ImportOptions["AllRequireLike"] = 18] = "AllRequireLike";
})(ImportOptions = exports.ImportOptions || (exports.ImportOptions = {}));
function findImports(sourceFile, options) {
    return new ImportFinder(sourceFile, options).find();
}
exports.findImports = findImports;
var ImportFinder = (function () {
    function ImportFinder(_sourceFile, _options) {
        var _this = this;
        this._sourceFile = _sourceFile;
        this._options = _options;
        this._result = [];
        this._findDynamic = function (node) {
            if (node_1.isCallExpression(node) && node.arguments.length === 1 &&
                (node.expression.kind === ts.SyntaxKind.ImportKeyword && _this._options & 8 ||
                    _this._options & 16 && node.expression.kind === ts.SyntaxKind.Identifier &&
                        node.expression.text === 'require'))
                _this._addImport(node.arguments[0]);
            ts.forEachChild(node, _this._findDynamic);
        };
    }
    ImportFinder.prototype.find = function () {
        this._findImports(this._sourceFile.statements);
        return this._result;
    };
    ImportFinder.prototype._findImports = function (statements) {
        for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
            var statement = statements_1[_i];
            if (node_1.isImportDeclaration(statement)) {
                if (this._options & 1)
                    this._addImport(statement.moduleSpecifier);
            }
            else if (node_1.isImportEqualsDeclaration(statement)) {
                if (this._options & 2 &&
                    statement.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference &&
                    statement.moduleReference.expression !== undefined)
                    this._addImport(statement.moduleReference.expression);
            }
            else if (node_1.isExportDeclaration(statement)) {
                if (statement.moduleSpecifier !== undefined && this._options & 4)
                    this._addImport(statement.moduleSpecifier);
            }
            else if (node_1.isModuleDeclaration(statement) && statement.body !== undefined && this._sourceFile.isDeclarationFile) {
                this._findImportsInModule(statement.body);
            }
            else if (this._options & 24 && !this._sourceFile.isDeclarationFile) {
                ts.forEachChild(statement, this._findDynamic);
            }
        }
    };
    ImportFinder.prototype._findImportsInModule = function (body) {
        if (body.kind === ts.SyntaxKind.ModuleBlock)
            return this._findImports(body.statements);
        if (body.kind === ts.SyntaxKind.ModuleDeclaration && body.body !== undefined)
            return this._findImportsInModule(body.body);
    };
    ImportFinder.prototype._addImport = function (expression) {
        if (node_1.isTextualLiteral(expression))
            this._result.push(expression);
    };
    return ImportFinder;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFDakMsMENBRzJCO0FBRTNCLHdCQUF3RCxJQUFhLEVBQUUsSUFBTyxFQUFFLFVBQTBCO0lBQ3RHLEdBQUcsQ0FBQyxDQUFnQixVQUE0QixFQUE1QixLQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQTVCLGNBQTRCLEVBQTVCLElBQTRCO1FBQTNDLElBQU0sS0FBSyxTQUFBO1FBQ1osRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7WUFDcEIsTUFBTSxDQUFjLEtBQUssQ0FBQztLQUFBO0FBQ3RDLENBQUM7QUFKRCx3Q0FJQztBQUVELHFCQUE0QixJQUFtQjtJQUMzQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztBQUMvRSxDQUFDO0FBRkQsa0NBRUM7QUFFRCxvQkFBMkIsSUFBbUI7SUFDMUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztBQUMzQyxDQUFDO0FBRkQsZ0NBRUM7QUFFRCwwQkFBaUMsSUFBbUI7SUFDaEQsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7QUFDekYsQ0FBQztBQUZELDRDQUVDO0FBRUQsd0JBQStCLElBQW1CO0lBQzlDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO0FBQ3JGLENBQUM7QUFGRCx3Q0FFQztBQUVELHFCQUE0QixJQUFtQjtJQUMz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