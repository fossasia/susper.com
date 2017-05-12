/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { isBlank } from '../facade/lang';
export var ParserError = (function () {
    /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     */
    function ParserError(message, input, errLocation, ctxLocation) {
        this.input = input;
        this.errLocation = errLocation;
        this.ctxLocation = ctxLocation;
        this.message = "Parser Error: " + message + " " + errLocation + " [" + input + "] in " + ctxLocation;
    }
    return ParserError;
}());
function ParserError_tsickle_Closure_declarations() {
    /** @type {?} */
    ParserError.prototype.message;
    /** @type {?} */
    ParserError.prototype.input;
    /** @type {?} */
    ParserError.prototype.errLocation;
    /** @type {?} */
    ParserError.prototype.ctxLocation;
}
export var ParseSpan = (function () {
    /**
     * @param {?} start
     * @param {?} end
     */
    function ParseSpan(start, end) {
        this.start = start;
        this.end = end;
    }
    return ParseSpan;
}());
function ParseSpan_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseSpan.prototype.start;
    /** @type {?} */
    ParseSpan.prototype.end;
}
export var AST = (function () {
    /**
     * @param {?} span
     */
    function AST(span) {
        this.span = span;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    AST.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return null;
    };
    /**
     * @return {?}
     */
    AST.prototype.toString = function () { return 'AST'; };
    return AST;
}());
function AST_tsickle_Closure_declarations() {
    /** @type {?} */
    AST.prototype.span;
}
/**
 *  Represents a quoted expression of the form:
  * *
  * quote = prefix `:` uninterpretedExpression
  * prefix = identifier
  * uninterpretedExpression = arbitrary string
  * *
  * A quoted expression is meant to be pre-processed by an AST transformer that
  * converts it into another AST that no longer contains quoted expressions.
  * It is meant to allow third-party developers to extend Angular template
  * expression language. The `uninterpretedExpression` part of the quote is
  * therefore not interpreted by the Angular's own expression parser.
 */
export var Quote = (function (_super) {
    __extends(Quote, _super);
    /**
     * @param {?} span
     * @param {?} prefix
     * @param {?} uninterpretedExpression
     * @param {?} location
     */
    function Quote(span, prefix, uninterpretedExpression, location) {
        _super.call(this, span);
        this.prefix = prefix;
        this.uninterpretedExpression = uninterpretedExpression;
        this.location = location;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Quote.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitQuote(this, context);
    };
    /**
     * @return {?}
     */
    Quote.prototype.toString = function () { return 'Quote'; };
    return Quote;
}(AST));
function Quote_tsickle_Closure_declarations() {
    /** @type {?} */
    Quote.prototype.prefix;
    /** @type {?} */
    Quote.prototype.uninterpretedExpression;
    /** @type {?} */
    Quote.prototype.location;
}
export var EmptyExpr = (function (_super) {
    __extends(EmptyExpr, _super);
    function EmptyExpr() {
        _super.apply(this, arguments);
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    EmptyExpr.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        // do nothing
    };
    return EmptyExpr;
}(AST));
export var ImplicitReceiver = (function (_super) {
    __extends(ImplicitReceiver, _super);
    function ImplicitReceiver() {
        _super.apply(this, arguments);
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    ImplicitReceiver.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitImplicitReceiver(this, context);
    };
    return ImplicitReceiver;
}(AST));
/**
 *  Multiple expressions separated by a semicolon.
 */
export var Chain = (function (_super) {
    __extends(Chain, _super);
    /**
     * @param {?} span
     * @param {?} expressions
     */
    function Chain(span, expressions) {
        _super.call(this, span);
        this.expressions = expressions;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Chain.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitChain(this, context);
    };
    return Chain;
}(AST));
function Chain_tsickle_Closure_declarations() {
    /** @type {?} */
    Chain.prototype.expressions;
}
export var Conditional = (function (_super) {
    __extends(Conditional, _super);
    /**
     * @param {?} span
     * @param {?} condition
     * @param {?} trueExp
     * @param {?} falseExp
     */
    function Conditional(span, condition, trueExp, falseExp) {
        _super.call(this, span);
        this.condition = condition;
        this.trueExp = trueExp;
        this.falseExp = falseExp;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Conditional.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitConditional(this, context);
    };
    return Conditional;
}(AST));
function Conditional_tsickle_Closure_declarations() {
    /** @type {?} */
    Conditional.prototype.condition;
    /** @type {?} */
    Conditional.prototype.trueExp;
    /** @type {?} */
    Conditional.prototype.falseExp;
}
export var PropertyRead = (function (_super) {
    __extends(PropertyRead, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     */
    function PropertyRead(span, receiver, name) {
        _super.call(this, span);
        this.receiver = receiver;
        this.name = name;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    PropertyRead.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitPropertyRead(this, context);
    };
    return PropertyRead;
}(AST));
function PropertyRead_tsickle_Closure_declarations() {
    /** @type {?} */
    PropertyRead.prototype.receiver;
    /** @type {?} */
    PropertyRead.prototype.name;
}
export var PropertyWrite = (function (_super) {
    __extends(PropertyWrite, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} value
     */
    function PropertyWrite(span, receiver, name, value) {
        _super.call(this, span);
        this.receiver = receiver;
        this.name = name;
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    PropertyWrite.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitPropertyWrite(this, context);
    };
    return PropertyWrite;
}(AST));
function PropertyWrite_tsickle_Closure_declarations() {
    /** @type {?} */
    PropertyWrite.prototype.receiver;
    /** @type {?} */
    PropertyWrite.prototype.name;
    /** @type {?} */
    PropertyWrite.prototype.value;
}
export var SafePropertyRead = (function (_super) {
    __extends(SafePropertyRead, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     */
    function SafePropertyRead(span, receiver, name) {
        _super.call(this, span);
        this.receiver = receiver;
        this.name = name;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    SafePropertyRead.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitSafePropertyRead(this, context);
    };
    return SafePropertyRead;
}(AST));
function SafePropertyRead_tsickle_Closure_declarations() {
    /** @type {?} */
    SafePropertyRead.prototype.receiver;
    /** @type {?} */
    SafePropertyRead.prototype.name;
}
export var KeyedRead = (function (_super) {
    __extends(KeyedRead, _super);
    /**
     * @param {?} span
     * @param {?} obj
     * @param {?} key
     */
    function KeyedRead(span, obj, key) {
        _super.call(this, span);
        this.obj = obj;
        this.key = key;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    KeyedRead.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitKeyedRead(this, context);
    };
    return KeyedRead;
}(AST));
function KeyedRead_tsickle_Closure_declarations() {
    /** @type {?} */
    KeyedRead.prototype.obj;
    /** @type {?} */
    KeyedRead.prototype.key;
}
export var KeyedWrite = (function (_super) {
    __extends(KeyedWrite, _super);
    /**
     * @param {?} span
     * @param {?} obj
     * @param {?} key
     * @param {?} value
     */
    function KeyedWrite(span, obj, key, value) {
        _super.call(this, span);
        this.obj = obj;
        this.key = key;
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    KeyedWrite.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitKeyedWrite(this, context);
    };
    return KeyedWrite;
}(AST));
function KeyedWrite_tsickle_Closure_declarations() {
    /** @type {?} */
    KeyedWrite.prototype.obj;
    /** @type {?} */
    KeyedWrite.prototype.key;
    /** @type {?} */
    KeyedWrite.prototype.value;
}
export var BindingPipe = (function (_super) {
    __extends(BindingPipe, _super);
    /**
     * @param {?} span
     * @param {?} exp
     * @param {?} name
     * @param {?} args
     */
    function BindingPipe(span, exp, name, args) {
        _super.call(this, span);
        this.exp = exp;
        this.name = name;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    BindingPipe.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitPipe(this, context);
    };
    return BindingPipe;
}(AST));
function BindingPipe_tsickle_Closure_declarations() {
    /** @type {?} */
    BindingPipe.prototype.exp;
    /** @type {?} */
    BindingPipe.prototype.name;
    /** @type {?} */
    BindingPipe.prototype.args;
}
export var LiteralPrimitive = (function (_super) {
    __extends(LiteralPrimitive, _super);
    /**
     * @param {?} span
     * @param {?} value
     */
    function LiteralPrimitive(span, value) {
        _super.call(this, span);
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    LiteralPrimitive.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitLiteralPrimitive(this, context);
    };
    return LiteralPrimitive;
}(AST));
function LiteralPrimitive_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralPrimitive.prototype.value;
}
export var LiteralArray = (function (_super) {
    __extends(LiteralArray, _super);
    /**
     * @param {?} span
     * @param {?} expressions
     */
    function LiteralArray(span, expressions) {
        _super.call(this, span);
        this.expressions = expressions;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    LiteralArray.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitLiteralArray(this, context);
    };
    return LiteralArray;
}(AST));
function LiteralArray_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralArray.prototype.expressions;
}
export var LiteralMap = (function (_super) {
    __extends(LiteralMap, _super);
    /**
     * @param {?} span
     * @param {?} keys
     * @param {?} values
     */
    function LiteralMap(span, keys, values) {
        _super.call(this, span);
        this.keys = keys;
        this.values = values;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    LiteralMap.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitLiteralMap(this, context);
    };
    return LiteralMap;
}(AST));
function LiteralMap_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralMap.prototype.keys;
    /** @type {?} */
    LiteralMap.prototype.values;
}
export var Interpolation = (function (_super) {
    __extends(Interpolation, _super);
    /**
     * @param {?} span
     * @param {?} strings
     * @param {?} expressions
     */
    function Interpolation(span, strings, expressions) {
        _super.call(this, span);
        this.strings = strings;
        this.expressions = expressions;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Interpolation.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitInterpolation(this, context);
    };
    return Interpolation;
}(AST));
function Interpolation_tsickle_Closure_declarations() {
    /** @type {?} */
    Interpolation.prototype.strings;
    /** @type {?} */
    Interpolation.prototype.expressions;
}
export var Binary = (function (_super) {
    __extends(Binary, _super);
    /**
     * @param {?} span
     * @param {?} operation
     * @param {?} left
     * @param {?} right
     */
    function Binary(span, operation, left, right) {
        _super.call(this, span);
        this.operation = operation;
        this.left = left;
        this.right = right;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Binary.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitBinary(this, context);
    };
    return Binary;
}(AST));
function Binary_tsickle_Closure_declarations() {
    /** @type {?} */
    Binary.prototype.operation;
    /** @type {?} */
    Binary.prototype.left;
    /** @type {?} */
    Binary.prototype.right;
}
export var PrefixNot = (function (_super) {
    __extends(PrefixNot, _super);
    /**
     * @param {?} span
     * @param {?} expression
     */
    function PrefixNot(span, expression) {
        _super.call(this, span);
        this.expression = expression;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    PrefixNot.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitPrefixNot(this, context);
    };
    return PrefixNot;
}(AST));
function PrefixNot_tsickle_Closure_declarations() {
    /** @type {?} */
    PrefixNot.prototype.expression;
}
export var MethodCall = (function (_super) {
    __extends(MethodCall, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} args
     */
    function MethodCall(span, receiver, name, args) {
        _super.call(this, span);
        this.receiver = receiver;
        this.name = name;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    MethodCall.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitMethodCall(this, context);
    };
    return MethodCall;
}(AST));
function MethodCall_tsickle_Closure_declarations() {
    /** @type {?} */
    MethodCall.prototype.receiver;
    /** @type {?} */
    MethodCall.prototype.name;
    /** @type {?} */
    MethodCall.prototype.args;
}
export var SafeMethodCall = (function (_super) {
    __extends(SafeMethodCall, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} args
     */
    function SafeMethodCall(span, receiver, name, args) {
        _super.call(this, span);
        this.receiver = receiver;
        this.name = name;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    SafeMethodCall.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitSafeMethodCall(this, context);
    };
    return SafeMethodCall;
}(AST));
function SafeMethodCall_tsickle_Closure_declarations() {
    /** @type {?} */
    SafeMethodCall.prototype.receiver;
    /** @type {?} */
    SafeMethodCall.prototype.name;
    /** @type {?} */
    SafeMethodCall.prototype.args;
}
export var FunctionCall = (function (_super) {
    __extends(FunctionCall, _super);
    /**
     * @param {?} span
     * @param {?} target
     * @param {?} args
     */
    function FunctionCall(span, target, args) {
        _super.call(this, span);
        this.target = target;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    FunctionCall.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitFunctionCall(this, context);
    };
    return FunctionCall;
}(AST));
function FunctionCall_tsickle_Closure_declarations() {
    /** @type {?} */
    FunctionCall.prototype.target;
    /** @type {?} */
    FunctionCall.prototype.args;
}
export var ASTWithSource = (function (_super) {
    __extends(ASTWithSource, _super);
    /**
     * @param {?} ast
     * @param {?} source
     * @param {?} location
     * @param {?} errors
     */
    function ASTWithSource(ast, source, location, errors) {
        _super.call(this, new ParseSpan(0, isBlank(source) ? 0 : source.length));
        this.ast = ast;
        this.source = source;
        this.location = location;
        this.errors = errors;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    ASTWithSource.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return this.ast.visit(visitor, context);
    };
    /**
     * @return {?}
     */
    ASTWithSource.prototype.toString = function () { return this.source + " in " + this.location; };
    return ASTWithSource;
}(AST));
function ASTWithSource_tsickle_Closure_declarations() {
    /** @type {?} */
    ASTWithSource.prototype.ast;
    /** @type {?} */
    ASTWithSource.prototype.source;
    /** @type {?} */
    ASTWithSource.prototype.location;
    /** @type {?} */
    ASTWithSource.prototype.errors;
}
export var TemplateBinding = (function () {
    /**
     * @param {?} span
     * @param {?} key
     * @param {?} keyIsVar
     * @param {?} name
     * @param {?} expression
     */
    function TemplateBinding(span, key, keyIsVar, name, expression) {
        this.span = span;
        this.key = key;
        this.keyIsVar = keyIsVar;
        this.name = name;
        this.expression = expression;
    }
    return TemplateBinding;
}());
function TemplateBinding_tsickle_Closure_declarations() {
    /** @type {?} */
    TemplateBinding.prototype.span;
    /** @type {?} */
    TemplateBinding.prototype.key;
    /** @type {?} */
    TemplateBinding.prototype.keyIsVar;
    /** @type {?} */
    TemplateBinding.prototype.name;
    /** @type {?} */
    TemplateBinding.prototype.expression;
}
export var RecursiveAstVisitor = (function () {
    function RecursiveAstVisitor() {
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitBinary = function (ast, context) {
        ast.left.visit(this);
        ast.right.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitChain = function (ast, context) { return this.visitAll(ast.expressions, context); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitConditional = function (ast, context) {
        ast.condition.visit(this);
        ast.trueExp.visit(this);
        ast.falseExp.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitPipe = function (ast, context) {
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitFunctionCall = function (ast, context) {
        ast.target.visit(this);
        this.visitAll(ast.args, context);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitImplicitReceiver = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitInterpolation = function (ast, context) {
        return this.visitAll(ast.expressions, context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitKeyedRead = function (ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitKeyedWrite = function (ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        ast.value.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitLiteralArray = function (ast, context) {
        return this.visitAll(ast.expressions, context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitLiteralMap = function (ast, context) { return this.visitAll(ast.values, context); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitLiteralPrimitive = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitMethodCall = function (ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitPrefixNot = function (ast, context) {
        ast.expression.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitPropertyRead = function (ast, context) {
        ast.receiver.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitPropertyWrite = function (ast, context) {
        ast.receiver.visit(this);
        ast.value.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitSafePropertyRead = function (ast, context) {
        ast.receiver.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitSafeMethodCall = function (ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    };
    /**
     * @param {?} asts
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitAll = function (asts, context) {
        var _this = this;
        asts.forEach(function (ast) { return ast.visit(_this, context); });
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitQuote = function (ast, context) { return null; };
    return RecursiveAstVisitor;
}());
export var AstTransformer = (function () {
    function AstTransformer() {
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitImplicitReceiver = function (ast, context) { return ast; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitInterpolation = function (ast, context) {
        return new Interpolation(ast.span, ast.strings, this.visitAll(ast.expressions));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitLiteralPrimitive = function (ast, context) {
        return new LiteralPrimitive(ast.span, ast.value);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitPropertyRead = function (ast, context) {
        return new PropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitPropertyWrite = function (ast, context) {
        return new PropertyWrite(ast.span, ast.receiver.visit(this), ast.name, ast.value);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitSafePropertyRead = function (ast, context) {
        return new SafePropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitMethodCall = function (ast, context) {
        return new MethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitSafeMethodCall = function (ast, context) {
        return new SafeMethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitFunctionCall = function (ast, context) {
        return new FunctionCall(ast.span, ast.target.visit(this), this.visitAll(ast.args));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitLiteralArray = function (ast, context) {
        return new LiteralArray(ast.span, this.visitAll(ast.expressions));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitLiteralMap = function (ast, context) {
        return new LiteralMap(ast.span, ast.keys, this.visitAll(ast.values));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitBinary = function (ast, context) {
        return new Binary(ast.span, ast.operation, ast.left.visit(this), ast.right.visit(this));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitPrefixNot = function (ast, context) {
        return new PrefixNot(ast.span, ast.expression.visit(this));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitConditional = function (ast, context) {
        return new Conditional(ast.span, ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitPipe = function (ast, context) {
        return new BindingPipe(ast.span, ast.exp.visit(this), ast.name, this.visitAll(ast.args));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitKeyedRead = function (ast, context) {
        return new KeyedRead(ast.span, ast.obj.visit(this), ast.key.visit(this));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitKeyedWrite = function (ast, context) {
        return new KeyedWrite(ast.span, ast.obj.visit(this), ast.key.visit(this), ast.value.visit(this));
    };
    /**
     * @param {?} asts
     * @return {?}
     */
    AstTransformer.prototype.visitAll = function (asts) {
        var /** @type {?} */ res = new Array(asts.length);
        for (var /** @type {?} */ i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitChain = function (ast, context) {
        return new Chain(ast.span, this.visitAll(ast.expressions));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitQuote = function (ast, context) {
        return new Quote(ast.span, ast.prefix, ast.uninterpretedExpression, ast.location);
    };
    return AstTransformer;
}());
//# sourceMappingURL=ast.js.map