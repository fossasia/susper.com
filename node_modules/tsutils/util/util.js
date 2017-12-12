"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var node_1 = require("../typeguard/node");
tslib_1.__exportStar(require("./control-flow"), exports);
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
    var scanner = ts.createScanner(sourceFile.languageVersion, false, sourceFile.languageVariant, fullText);
    return forEachToken(node, function (token) {
        var tokenStart = token.kind === ts.SyntaxKind.JsxText ? token.pos : token.getStart(sourceFile);
        if (tokenStart !== token.pos) {
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
        return cb(fullText, token.kind, { end: token.end, pos: tokenStart }, token.parent);
    }, sourceFile);
}
exports.forEachTokenWithTrivia = forEachTokenWithTrivia;
function forEachComment(node, cb, sourceFile) {
    if (sourceFile === void 0) { sourceFile = node.getSourceFile(); }
    var fullText = sourceFile.text;
    var notJsx = sourceFile.languageVariant !== ts.LanguageVariant.JSX;
    return forEachToken(node, function (token) {
        if (token.kind !== ts.SyntaxKind.JsxText)
            ts.forEachLeadingCommentRange(fullText, token.pos, commentCallback);
        if (notJsx || canHaveTrailingTrivia(token))
            return ts.forEachTrailingCommentRange(fullText, token.end, commentCallback);
    }, sourceFile);
    function commentCallback(pos, end, kind) {
        cb(fullText, { pos: pos, end: end, kind: kind });
    }
}
exports.forEachComment = forEachComment;
function canHaveTrailingTrivia(_a) {
    var kind = _a.kind, parent = _a.parent;
    if (kind === ts.SyntaxKind.CloseBraceToken)
        return parent.kind !== ts.SyntaxKind.JsxExpression ||
            parent.parent.kind !== ts.SyntaxKind.JsxElement && parent.parent.kind !== ts.SyntaxKind.JsxFragment;
    if (kind === ts.SyntaxKind.GreaterThanToken) {
        switch (parent.kind) {
            case ts.SyntaxKind.JsxOpeningElement:
            case ts.SyntaxKind.JsxOpeningFragment:
                return false;
            case ts.SyntaxKind.JsxClosingElement:
            case ts.SyntaxKind.JsxSelfClosingElement:
            case ts.SyntaxKind.JsxClosingFragment:
                switch (parent.parent.parent.kind) {
                    case ts.SyntaxKind.JsxElement:
                    case ts.SyntaxKind.JsxFragment:
                        return false;
                    default:
                        return true;
                }
        }
    }
    return kind !== ts.SyntaxKind.JsxText;
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
    return scan.isIdentifier() && scan.getTextPos() === text.length && scan.getTokenPos() === 0;
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
    return scan.getToken() === ts.SyntaxKind.NumericLiteral && scan.getTextPos() === text.length && scan.getTokenPos() === 0;
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
        case ts.SyntaxKind.JsxFragment:
            for (var _h = 0, _j = node.children; _h < _j.length; _h++) {
                var child = _j[_h];
                if (child.kind !== ts.SyntaxKind.JsxText && hasSideEffects(child, options))
                    return true;
            }
            if (node.kind === ts.SyntaxKind.JsxFragment)
                return false;
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
            case ts.SyntaxKind.JsxFragment:
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
    var kind = node.kind;
    switch (kind) {
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
        if (this._sourceFile.isDeclarationFile)
            this._options &= ~24;
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
            else if (node_1.isModuleDeclaration(statement) &&
                this._options & (3 | 4) &&
                statement.body !== undefined && statement.name.kind === ts.SyntaxKind.StringLiteral &&
                ts.isExternalModule(this._sourceFile)) {
                this._findImports(statement.body.statements);
            }
            else if (this._options & 24) {
                ts.forEachChild(statement, this._findDynamic);
            }
        }
    };
    ImportFinder.prototype._addImport = function (expression) {
        if (node_1.isTextualLiteral(expression))
            this._result.push(expression);
    };
    return ImportFinder;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQWlDO0FBQ2pDLDBDQUcyQjtBQUczQix5REFBK0I7QUFFL0Isd0JBQXdELElBQWEsRUFBRSxJQUFPLEVBQUUsVUFBMEI7SUFDdEcsR0FBRyxDQUFDLENBQWdCLFVBQTRCLEVBQTVCLEtBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBNUIsY0FBNEIsRUFBNUIsSUFBNEI7UUFBM0MsSUFBTSxLQUFLLFNBQUE7UUFDWixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztZQUNwQixNQUFNLENBQWMsS0FBSyxDQUFDO0tBQUE7QUFDdEMsQ0FBQztBQUpELHdDQUlDO0FBRUQscUJBQTRCLElBQW1CO0lBQzNDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQy9FLENBQUM7QUFGRCxrQ0FFQztBQUVELG9CQUEyQixJQUFtQjtJQUMxQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQzNDLENBQUM7QUFGRCxnQ0FFQztBQUVELDBCQUFpQyxJQUFtQjtJQUNoRCxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztBQUN6RixDQUFDO0FBRkQsNENBRUM7QUFFRCx3QkFBK0IsSUFBbUI7SUFDOUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUM7QUFDckYsQ0FBQztBQUZELHdDQUVDO0FBRUQscUJB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