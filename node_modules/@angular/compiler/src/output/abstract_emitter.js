/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isBlank, isPresent } from '../facade/lang';
import * as o from './output_ast';
var /** @type {?} */ _SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
var /** @type {?} */ _LEGAL_IDENTIFIER_RE = /^[$A-Z_][0-9A-Z_$]*$/i;
export var /** @type {?} */ CATCH_ERROR_VAR = o.variable('error');
export var /** @type {?} */ CATCH_STACK_VAR = o.variable('stack');
/**
 * @abstract
 */
export var OutputEmitter = (function () {
    function OutputEmitter() {
    }
    /**
     * @abstract
     * @param {?} moduleUrl
     * @param {?} stmts
     * @param {?} exportedVars
     * @return {?}
     */
    OutputEmitter.prototype.emitStatements = function (moduleUrl, stmts, exportedVars) { };
    return OutputEmitter;
}());
var _EmittedLine = (function () {
    /**
     * @param {?} indent
     */
    function _EmittedLine(indent) {
        this.indent = indent;
        this.parts = [];
    }
    return _EmittedLine;
}());
function _EmittedLine_tsickle_Closure_declarations() {
    /** @type {?} */
    _EmittedLine.prototype.parts;
    /** @type {?} */
    _EmittedLine.prototype.indent;
}
export var EmitterVisitorContext = (function () {
    /**
     * @param {?} _exportedVars
     * @param {?} _indent
     */
    function EmitterVisitorContext(_exportedVars, _indent) {
        this._exportedVars = _exportedVars;
        this._indent = _indent;
        this._classes = [];
        this._lines = [new _EmittedLine(_indent)];
    }
    /**
     * @param {?} exportedVars
     * @return {?}
     */
    EmitterVisitorContext.createRoot = function (exportedVars) {
        return new EmitterVisitorContext(exportedVars, 0);
    };
    Object.defineProperty(EmitterVisitorContext.prototype, "_currentLine", {
        /**
         * @return {?}
         */
        get: function () { return this._lines[this._lines.length - 1]; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} varName
     * @return {?}
     */
    EmitterVisitorContext.prototype.isExportedVar = function (varName) { return this._exportedVars.indexOf(varName) !== -1; };
    /**
     * @param {?=} lastPart
     * @return {?}
     */
    EmitterVisitorContext.prototype.println = function (lastPart) {
        if (lastPart === void 0) { lastPart = ''; }
        this.print(lastPart, true);
    };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.lineIsEmpty = function () { return this._currentLine.parts.length === 0; };
    /**
     * @param {?} part
     * @param {?=} newLine
     * @return {?}
     */
    EmitterVisitorContext.prototype.print = function (part, newLine) {
        if (newLine === void 0) { newLine = false; }
        if (part.length > 0) {
            this._currentLine.parts.push(part);
        }
        if (newLine) {
            this._lines.push(new _EmittedLine(this._indent));
        }
    };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.removeEmptyLastLine = function () {
        if (this.lineIsEmpty()) {
            this._lines.pop();
        }
    };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.incIndent = function () {
        this._indent++;
        this._currentLine.indent = this._indent;
    };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.decIndent = function () {
        this._indent--;
        this._currentLine.indent = this._indent;
    };
    /**
     * @param {?} clazz
     * @return {?}
     */
    EmitterVisitorContext.prototype.pushClass = function (clazz) { this._classes.push(clazz); };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.popClass = function () { return this._classes.pop(); };
    Object.defineProperty(EmitterVisitorContext.prototype, "currentClass", {
        /**
         * @return {?}
         */
        get: function () {
            return this._classes.length > 0 ? this._classes[this._classes.length - 1] : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.toSource = function () {
        var /** @type {?} */ lines = this._lines;
        if (lines[lines.length - 1].parts.length === 0) {
            lines = lines.slice(0, lines.length - 1);
        }
        return lines
            .map(function (line) {
            if (line.parts.length > 0) {
                return _createIndent(line.indent) + line.parts.join('');
            }
            else {
                return '';
            }
        })
            .join('\n');
    };
    return EmitterVisitorContext;
}());
function EmitterVisitorContext_tsickle_Closure_declarations() {
    /** @type {?} */
    EmitterVisitorContext.prototype._lines;
    /** @type {?} */
    EmitterVisitorContext.prototype._classes;
    /** @type {?} */
    EmitterVisitorContext.prototype._exportedVars;
    /** @type {?} */
    EmitterVisitorContext.prototype._indent;
}
/**
 * @abstract
 */
export var AbstractEmitterVisitor = (function () {
    /**
     * @param {?} _escapeDollarInStrings
     */
    function AbstractEmitterVisitor(_escapeDollarInStrings) {
        this._escapeDollarInStrings = _escapeDollarInStrings;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitExpressionStmt = function (stmt, ctx) {
        stmt.expr.visitExpression(this, ctx);
        ctx.println(';');
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitReturnStmt = function (stmt, ctx) {
        ctx.print("return ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(';');
        return null;
    };
    /**
     * @abstract
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitCastExpr = function (ast, context) { };
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) { };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitIfStmt = function (stmt, ctx) {
        ctx.print("if (");
        stmt.condition.visitExpression(this, ctx);
        ctx.print(") {");
        var /** @type {?} */ hasElseCase = isPresent(stmt.falseCase) && stmt.falseCase.length > 0;
        if (stmt.trueCase.length <= 1 && !hasElseCase) {
            ctx.print(" ");
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.removeEmptyLastLine();
            ctx.print(" ");
        }
        else {
            ctx.println();
            ctx.incIndent();
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.decIndent();
            if (hasElseCase) {
                ctx.println("} else {");
                ctx.incIndent();
                this.visitAllStatements(stmt.falseCase, ctx);
                ctx.decIndent();
            }
        }
        ctx.println("}");
        return null;
    };
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) { };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitThrowStmt = function (stmt, ctx) {
        ctx.print("throw ");
        stmt.error.visitExpression(this, ctx);
        ctx.println(";");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitCommentStmt = function (stmt, ctx) {
        var /** @type {?} */ lines = stmt.comment.split('\n');
        lines.forEach(function (line) { ctx.println("// " + line); });
        return null;
    };
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) { };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitWriteVarExpr = function (expr, ctx) {
        var /** @type {?} */ lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print('(');
        }
        ctx.print(expr.name + " = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(')');
        }
        return null;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitWriteKeyExpr = function (expr, ctx) {
        var /** @type {?} */ lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print('(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print("[");
        expr.index.visitExpression(this, ctx);
        ctx.print("] = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(')');
        }
        return null;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitWritePropExpr = function (expr, ctx) {
        var /** @type {?} */ lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print('(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print("." + expr.name + " = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(')');
        }
        return null;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitInvokeMethodExpr = function (expr, ctx) {
        expr.receiver.visitExpression(this, ctx);
        var /** @type {?} */ name = expr.name;
        if (isPresent(expr.builtin)) {
            name = this.getBuiltinMethodName(expr.builtin);
            if (isBlank(name)) {
                // some builtins just mean to skip the call.
                return null;
            }
        }
        ctx.print("." + name + "(");
        this.visitAllExpressions(expr.args, ctx, ",");
        ctx.print(")");
        return null;
    };
    /**
     * @abstract
     * @param {?} method
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.getBuiltinMethodName = function (method) { };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr, ctx) {
        expr.fn.visitExpression(this, ctx);
        ctx.print("(");
        this.visitAllExpressions(expr.args, ctx, ',');
        ctx.print(")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitReadVarExpr = function (ast, ctx) {
        var /** @type {?} */ varName = ast.name;
        if (isPresent(ast.builtin)) {
            switch (ast.builtin) {
                case o.BuiltinVar.Super:
                    varName = 'super';
                    break;
                case o.BuiltinVar.This:
                    varName = 'this';
                    break;
                case o.BuiltinVar.CatchError:
                    varName = CATCH_ERROR_VAR.name;
                    break;
                case o.BuiltinVar.CatchStack:
                    varName = CATCH_STACK_VAR.name;
                    break;
                default:
                    throw new Error("Unknown builtin variable " + ast.builtin);
            }
        }
        ctx.print(varName);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
        ctx.print("new ");
        ast.classExpr.visitExpression(this, ctx);
        ctx.print("(");
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitLiteralExpr = function (ast, ctx) {
        var /** @type {?} */ value = ast.value;
        if (typeof value === 'string') {
            ctx.print(escapeIdentifier(value, this._escapeDollarInStrings));
        }
        else {
            ctx.print("" + value);
        }
        return null;
    };
    /**
     * @abstract
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) { };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitConditionalExpr = function (ast, ctx) {
        ctx.print("(");
        ast.condition.visitExpression(this, ctx);
        ctx.print('? ');
        ast.trueCase.visitExpression(this, ctx);
        ctx.print(': ');
        ast.falseCase.visitExpression(this, ctx);
        ctx.print(")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitNotExpr = function (ast, ctx) {
        ctx.print('!');
        ast.condition.visitExpression(this, ctx);
        return null;
    };
    /**
     * @abstract
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) { };
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) { };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
        var /** @type {?} */ opStr;
        switch (ast.operator) {
            case o.BinaryOperator.Equals:
                opStr = '==';
                break;
            case o.BinaryOperator.Identical:
                opStr = '===';
                break;
            case o.BinaryOperator.NotEquals:
                opStr = '!=';
                break;
            case o.BinaryOperator.NotIdentical:
                opStr = '!==';
                break;
            case o.BinaryOperator.And:
                opStr = '&&';
                break;
            case o.BinaryOperator.Or:
                opStr = '||';
                break;
            case o.BinaryOperator.Plus:
                opStr = '+';
                break;
            case o.BinaryOperator.Minus:
                opStr = '-';
                break;
            case o.BinaryOperator.Divide:
                opStr = '/';
                break;
            case o.BinaryOperator.Multiply:
                opStr = '*';
                break;
            case o.BinaryOperator.Modulo:
                opStr = '%';
                break;
            case o.BinaryOperator.Lower:
                opStr = '<';
                break;
            case o.BinaryOperator.LowerEquals:
                opStr = '<=';
                break;
            case o.BinaryOperator.Bigger:
                opStr = '>';
                break;
            case o.BinaryOperator.BiggerEquals:
                opStr = '>=';
                break;
            default:
                throw new Error("Unknown operator " + ast.operator);
        }
        ctx.print("(");
        ast.lhs.visitExpression(this, ctx);
        ctx.print(" " + opStr + " ");
        ast.rhs.visitExpression(this, ctx);
        ctx.print(")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitReadPropExpr = function (ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(".");
        ctx.print(ast.name);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitReadKeyExpr = function (ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print("[");
        ast.index.visitExpression(this, ctx);
        ctx.print("]");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
        var /** @type {?} */ useNewLine = ast.entries.length > 1;
        ctx.print("[", useNewLine);
        ctx.incIndent();
        this.visitAllExpressions(ast.entries, ctx, ',', useNewLine);
        ctx.decIndent();
        ctx.print("]", useNewLine);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitLiteralMapExpr = function (ast, ctx) {
        var _this = this;
        var /** @type {?} */ useNewLine = ast.entries.length > 1;
        ctx.print("{", useNewLine);
        ctx.incIndent();
        this.visitAllObjects(function (entry) {
            ctx.print(escapeIdentifier(entry.key, _this._escapeDollarInStrings, entry.quoted) + ": ");
            entry.value.visitExpression(_this, ctx);
        }, ast.entries, ctx, ',', useNewLine);
        ctx.decIndent();
        ctx.print("}", useNewLine);
        return null;
    };
    /**
     * @param {?} expressions
     * @param {?} ctx
     * @param {?} separator
     * @param {?=} newLine
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitAllExpressions = function (expressions, ctx, separator, newLine) {
        var _this = this;
        if (newLine === void 0) { newLine = false; }
        this.visitAllObjects(function (expr) { return expr.visitExpression(_this, ctx); }, expressions, ctx, separator, newLine);
    };
    /**
     * @param {?} handler
     * @param {?} expressions
     * @param {?} ctx
     * @param {?} separator
     * @param {?=} newLine
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitAllObjects = function (handler, expressions, ctx, separator, newLine) {
        if (newLine === void 0) { newLine = false; }
        for (var /** @type {?} */ i = 0; i < expressions.length; i++) {
            if (i > 0) {
                ctx.print(separator, newLine);
            }
            handler(expressions[i]);
        }
        if (newLine) {
            ctx.println();
        }
    };
    /**
     * @param {?} statements
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitAllStatements = function (statements, ctx) {
        var _this = this;
        statements.forEach(function (stmt) { return stmt.visitStatement(_this, ctx); });
    };
    return AbstractEmitterVisitor;
}());
function AbstractEmitterVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    AbstractEmitterVisitor.prototype._escapeDollarInStrings;
}
/**
 * @param {?} input
 * @param {?} escapeDollar
 * @param {?=} alwaysQuote
 * @return {?}
 */
export function escapeIdentifier(input, escapeDollar, alwaysQuote) {
    if (alwaysQuote === void 0) { alwaysQuote = true; }
    if (isBlank(input)) {
        return null;
    }
    var /** @type {?} */ body = input.replace(_SINGLE_QUOTE_ESCAPE_STRING_RE, function () {
        var match = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            match[_i - 0] = arguments[_i];
        }
        if (match[0] == '$') {
            return escapeDollar ? '\\$' : '$';
        }
        else if (match[0] == '\n') {
            return '\\n';
        }
        else if (match[0] == '\r') {
            return '\\r';
        }
        else {
            return "\\" + match[0];
        }
    });
    var /** @type {?} */ requiresQuotes = alwaysQuote || !_LEGAL_IDENTIFIER_RE.test(body);
    return requiresQuotes ? "'" + body + "'" : body;
}
/**
 * @param {?} count
 * @return {?}
 */
function _createIndent(count) {
    var /** @type {?} */ res = '';
    for (var /** @type {?} */ i = 0; i < count; i++) {
        res += '  ';
    }
    return res;
}
//# sourceMappingURL=abstract_emitter.js.map