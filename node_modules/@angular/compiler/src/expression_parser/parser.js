/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as chars from '../chars';
import { escapeRegExp, isBlank, isPresent } from '../facade/lang';
import { CompilerInjectable } from '../injectable';
import { DEFAULT_INTERPOLATION_CONFIG } from '../ml_parser/interpolation_config';
import { ASTWithSource, Binary, BindingPipe, Chain, Conditional, EmptyExpr, FunctionCall, ImplicitReceiver, Interpolation, KeyedRead, KeyedWrite, LiteralArray, LiteralMap, LiteralPrimitive, MethodCall, ParseSpan, ParserError, PrefixNot, PropertyRead, PropertyWrite, Quote, SafeMethodCall, SafePropertyRead, TemplateBinding } from './ast';
import { EOF, Lexer, TokenType, isIdentifier, isQuote } from './lexer';
export var SplitInterpolation = (function () {
    /**
     * @param {?} strings
     * @param {?} expressions
     * @param {?} offsets
     */
    function SplitInterpolation(strings, expressions, offsets) {
        this.strings = strings;
        this.expressions = expressions;
        this.offsets = offsets;
    }
    return SplitInterpolation;
}());
function SplitInterpolation_tsickle_Closure_declarations() {
    /** @type {?} */
    SplitInterpolation.prototype.strings;
    /** @type {?} */
    SplitInterpolation.prototype.expressions;
    /** @type {?} */
    SplitInterpolation.prototype.offsets;
}
export var TemplateBindingParseResult = (function () {
    /**
     * @param {?} templateBindings
     * @param {?} warnings
     * @param {?} errors
     */
    function TemplateBindingParseResult(templateBindings, warnings, errors) {
        this.templateBindings = templateBindings;
        this.warnings = warnings;
        this.errors = errors;
    }
    return TemplateBindingParseResult;
}());
function TemplateBindingParseResult_tsickle_Closure_declarations() {
    /** @type {?} */
    TemplateBindingParseResult.prototype.templateBindings;
    /** @type {?} */
    TemplateBindingParseResult.prototype.warnings;
    /** @type {?} */
    TemplateBindingParseResult.prototype.errors;
}
/**
 * @param {?} config
 * @return {?}
 */
function _createInterpolateRegExp(config) {
    var /** @type {?} */ pattern = escapeRegExp(config.start) + '([\\s\\S]*?)' + escapeRegExp(config.end);
    return new RegExp(pattern, 'g');
}
export var Parser = (function () {
    /**
     * @param {?} _lexer
     */
    function Parser(_lexer) {
        this._lexer = _lexer;
        this.errors = [];
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseAction = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        this._checkNoInterpolation(input, location, interpolationConfig);
        var /** @type {?} */ sourceToLex = this._stripComments(input);
        var /** @type {?} */ tokens = this._lexer.tokenize(this._stripComments(input));
        var /** @type {?} */ ast = new _ParseAST(input, location, tokens, sourceToLex.length, true, this.errors, input.length - sourceToLex.length)
            .parseChain();
        return new ASTWithSource(ast, input, location, this.errors);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseBinding = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ ast = this._parseBindingAst(input, location, interpolationConfig);
        return new ASTWithSource(ast, input, location, this.errors);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseSimpleBinding = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ ast = this._parseBindingAst(input, location, interpolationConfig);
        var /** @type {?} */ errors = SimpleExpressionChecker.check(ast);
        if (errors.length > 0) {
            this._reportError("Host binding expression cannot contain " + errors.join(' '), input, location);
        }
        return new ASTWithSource(ast, input, location, this.errors);
    };
    /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     * @return {?}
     */
    Parser.prototype._reportError = function (message, input, errLocation, ctxLocation) {
        this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    Parser.prototype._parseBindingAst = function (input, location, interpolationConfig) {
        // Quotes expressions use 3rd-party expression language. We don't want to use
        // our lexer or parser for that, so we check for that ahead of time.
        var /** @type {?} */ quote = this._parseQuote(input, location);
        if (isPresent(quote)) {
            return quote;
        }
        this._checkNoInterpolation(input, location, interpolationConfig);
        var /** @type {?} */ sourceToLex = this._stripComments(input);
        var /** @type {?} */ tokens = this._lexer.tokenize(sourceToLex);
        return new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, input.length - sourceToLex.length)
            .parseChain();
    };
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    Parser.prototype._parseQuote = function (input, location) {
        if (isBlank(input))
            return null;
        var /** @type {?} */ prefixSeparatorIndex = input.indexOf(':');
        if (prefixSeparatorIndex == -1)
            return null;
        var /** @type {?} */ prefix = input.substring(0, prefixSeparatorIndex).trim();
        if (!isIdentifier(prefix))
            return null;
        var /** @type {?} */ uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
        return new Quote(new ParseSpan(0, input.length), prefix, uninterpretedExpression, location);
    };
    /**
     * @param {?} prefixToken
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    Parser.prototype.parseTemplateBindings = function (prefixToken, input, location) {
        var /** @type {?} */ tokens = this._lexer.tokenize(input);
        if (prefixToken) {
            // Prefix the tokens with the tokens from prefixToken but have them take no space (0 index).
            var /** @type {?} */ prefixTokens = this._lexer.tokenize(prefixToken).map(function (t) {
                t.index = 0;
                return t;
            });
            tokens.unshift.apply(tokens, prefixTokens);
        }
        return new _ParseAST(input, location, tokens, input.length, false, this.errors, 0)
            .parseTemplateBindings();
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseInterpolation = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ split = this.splitInterpolation(input, location, interpolationConfig);
        if (split == null)
            return null;
        var /** @type {?} */ expressions = [];
        for (var /** @type {?} */ i = 0; i < split.expressions.length; ++i) {
            var /** @type {?} */ expressionText = split.expressions[i];
            var /** @type {?} */ sourceToLex = this._stripComments(expressionText);
            var /** @type {?} */ tokens = this._lexer.tokenize(this._stripComments(split.expressions[i]));
            var /** @type {?} */ ast = new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, split.offsets[i] + (expressionText.length - sourceToLex.length))
                .parseChain();
            expressions.push(ast);
        }
        return new ASTWithSource(new Interpolation(new ParseSpan(0, isBlank(input) ? 0 : input.length), split.strings, expressions), input, location, this.errors);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.splitInterpolation = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ regexp = _createInterpolateRegExp(interpolationConfig);
        var /** @type {?} */ parts = input.split(regexp);
        if (parts.length <= 1) {
            return null;
        }
        var /** @type {?} */ strings = [];
        var /** @type {?} */ expressions = [];
        var /** @type {?} */ offsets = [];
        var /** @type {?} */ offset = 0;
        for (var /** @type {?} */ i = 0; i < parts.length; i++) {
            var /** @type {?} */ part = parts[i];
            if (i % 2 === 0) {
                // fixed string
                strings.push(part);
                offset += part.length;
            }
            else if (part.trim().length > 0) {
                offset += interpolationConfig.start.length;
                expressions.push(part);
                offsets.push(offset);
                offset += part.length + interpolationConfig.end.length;
            }
            else {
                this._reportError('Blank expressions are not allowed in interpolated strings', input, "at column " + this._findInterpolationErrorColumn(parts, i, interpolationConfig) + " in", location);
                expressions.push('$implict');
                offsets.push(offset);
            }
        }
        return new SplitInterpolation(strings, expressions, offsets);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    Parser.prototype.wrapLiteralPrimitive = function (input, location) {
        return new ASTWithSource(new LiteralPrimitive(new ParseSpan(0, isBlank(input) ? 0 : input.length), input), input, location, this.errors);
    };
    /**
     * @param {?} input
     * @return {?}
     */
    Parser.prototype._stripComments = function (input) {
        var /** @type {?} */ i = this._commentStart(input);
        return isPresent(i) ? input.substring(0, i).trim() : input;
    };
    /**
     * @param {?} input
     * @return {?}
     */
    Parser.prototype._commentStart = function (input) {
        var /** @type {?} */ outerQuote = null;
        for (var /** @type {?} */ i = 0; i < input.length - 1; i++) {
            var /** @type {?} */ char = input.charCodeAt(i);
            var /** @type {?} */ nextChar = input.charCodeAt(i + 1);
            if (char === chars.$SLASH && nextChar == chars.$SLASH && isBlank(outerQuote))
                return i;
            if (outerQuote === char) {
                outerQuote = null;
            }
            else if (isBlank(outerQuote) && isQuote(char)) {
                outerQuote = char;
            }
        }
        return null;
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    Parser.prototype._checkNoInterpolation = function (input, location, interpolationConfig) {
        var /** @type {?} */ regexp = _createInterpolateRegExp(interpolationConfig);
        var /** @type {?} */ parts = input.split(regexp);
        if (parts.length > 1) {
            this._reportError("Got interpolation (" + interpolationConfig.start + interpolationConfig.end + ") where expression was expected", input, "at column " + this._findInterpolationErrorColumn(parts, 1, interpolationConfig) + " in", location);
        }
    };
    /**
     * @param {?} parts
     * @param {?} partInErrIdx
     * @param {?} interpolationConfig
     * @return {?}
     */
    Parser.prototype._findInterpolationErrorColumn = function (parts, partInErrIdx, interpolationConfig) {
        var /** @type {?} */ errLocation = '';
        for (var /** @type {?} */ j = 0; j < partInErrIdx; j++) {
            errLocation += j % 2 === 0 ?
                parts[j] :
                "" + interpolationConfig.start + parts[j] + interpolationConfig.end;
        }
        return errLocation.length;
    };
    Parser = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [Lexer])
    ], Parser);
    return Parser;
}());
function Parser_tsickle_Closure_declarations() {
    /** @type {?} */
    Parser.prototype.errors;
    /** @type {?} */
    Parser.prototype._lexer;
}
export var _ParseAST = (function () {
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} tokens
     * @param {?} inputLength
     * @param {?} parseAction
     * @param {?} errors
     * @param {?} offset
     */
    function _ParseAST(input, location, tokens, inputLength, parseAction, errors, offset) {
        this.input = input;
        this.location = location;
        this.tokens = tokens;
        this.inputLength = inputLength;
        this.parseAction = parseAction;
        this.errors = errors;
        this.offset = offset;
        this.rparensExpected = 0;
        this.rbracketsExpected = 0;
        this.rbracesExpected = 0;
        this.index = 0;
    }
    /**
     * @param {?} offset
     * @return {?}
     */
    _ParseAST.prototype.peek = function (offset) {
        var /** @type {?} */ i = this.index + offset;
        return i < this.tokens.length ? this.tokens[i] : EOF;
    };
    Object.defineProperty(_ParseAST.prototype, "next", {
        /**
         * @return {?}
         */
        get: function () { return this.peek(0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_ParseAST.prototype, "inputIndex", {
        /**
         * @return {?}
         */
        get: function () {
            return (this.index < this.tokens.length) ? this.next.index + this.offset :
                this.inputLength + this.offset;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} start
     * @return {?}
     */
    _ParseAST.prototype.span = function (start) { return new ParseSpan(start, this.inputIndex); };
    /**
     * @return {?}
     */
    _ParseAST.prototype.advance = function () { this.index++; };
    /**
     * @param {?} code
     * @return {?}
     */
    _ParseAST.prototype.optionalCharacter = function (code) {
        if (this.next.isCharacter(code)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.peekKeywordLet = function () { return this.next.isKeywordLet(); };
    /**
     * @param {?} code
     * @return {?}
     */
    _ParseAST.prototype.expectCharacter = function (code) {
        if (this.optionalCharacter(code))
            return;
        this.error("Missing expected " + String.fromCharCode(code));
    };
    /**
     * @param {?} op
     * @return {?}
     */
    _ParseAST.prototype.optionalOperator = function (op) {
        if (this.next.isOperator(op)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * @param {?} operator
     * @return {?}
     */
    _ParseAST.prototype.expectOperator = function (operator) {
        if (this.optionalOperator(operator))
            return;
        this.error("Missing expected operator " + operator);
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.expectIdentifierOrKeyword = function () {
        var /** @type {?} */ n = this.next;
        if (!n.isIdentifier() && !n.isKeyword()) {
            this.error("Unexpected token " + n + ", expected identifier or keyword");
            return '';
        }
        this.advance();
        return n.toString();
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.expectIdentifierOrKeywordOrString = function () {
        var /** @type {?} */ n = this.next;
        if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
            this.error("Unexpected token " + n + ", expected identifier, keyword, or string");
            return '';
        }
        this.advance();
        return n.toString();
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseChain = function () {
        var /** @type {?} */ exprs = [];
        var /** @type {?} */ start = this.inputIndex;
        while (this.index < this.tokens.length) {
            var /** @type {?} */ expr = this.parsePipe();
            exprs.push(expr);
            if (this.optionalCharacter(chars.$SEMICOLON)) {
                if (!this.parseAction) {
                    this.error('Binding expression cannot contain chained expression');
                }
                while (this.optionalCharacter(chars.$SEMICOLON)) {
                } // read all semicolons
            }
            else if (this.index < this.tokens.length) {
                this.error("Unexpected token '" + this.next + "'");
            }
        }
        if (exprs.length == 0)
            return new EmptyExpr(this.span(start));
        if (exprs.length == 1)
            return exprs[0];
        return new Chain(this.span(start), exprs);
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parsePipe = function () {
        var /** @type {?} */ result = this.parseExpression();
        if (this.optionalOperator('|')) {
            if (this.parseAction) {
                this.error('Cannot have a pipe in an action expression');
            }
            do {
                var /** @type {?} */ name_1 = this.expectIdentifierOrKeyword();
                var /** @type {?} */ args = [];
                while (this.optionalCharacter(chars.$COLON)) {
                    args.push(this.parseExpression());
                }
                result = new BindingPipe(this.span(result.span.start), result, name_1, args);
            } while (this.optionalOperator('|'));
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseExpression = function () { return this.parseConditional(); };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseConditional = function () {
        var /** @type {?} */ start = this.inputIndex;
        var /** @type {?} */ result = this.parseLogicalOr();
        if (this.optionalOperator('?')) {
            var /** @type {?} */ yes = this.parsePipe();
            var /** @type {?} */ no = void 0;
            if (!this.optionalCharacter(chars.$COLON)) {
                var /** @type {?} */ end = this.inputIndex;
                var /** @type {?} */ expression = this.input.substring(start, end);
                this.error("Conditional expression " + expression + " requires all 3 expressions");
                no = new EmptyExpr(this.span(start));
            }
            else {
                no = this.parsePipe();
            }
            return new Conditional(this.span(start), result, yes, no);
        }
        else {
            return result;
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseLogicalOr = function () {
        // '||'
        var /** @type {?} */ result = this.parseLogicalAnd();
        while (this.optionalOperator('||')) {
            var /** @type {?} */ right = this.parseLogicalAnd();
            result = new Binary(this.span(result.span.start), '||', result, right);
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseLogicalAnd = function () {
        // '&&'
        var /** @type {?} */ result = this.parseEquality();
        while (this.optionalOperator('&&')) {
            var /** @type {?} */ right = this.parseEquality();
            result = new Binary(this.span(result.span.start), '&&', result, right);
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseEquality = function () {
        // '==','!=','===','!=='
        var /** @type {?} */ result = this.parseRelational();
        while (this.next.type == TokenType.Operator) {
            var /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '==':
                case '===':
                case '!=':
                case '!==':
                    this.advance();
                    var /** @type {?} */ right = this.parseRelational();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseRelational = function () {
        // '<', '>', '<=', '>='
        var /** @type {?} */ result = this.parseAdditive();
        while (this.next.type == TokenType.Operator) {
            var /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '<':
                case '>':
                case '<=':
                case '>=':
                    this.advance();
                    var /** @type {?} */ right = this.parseAdditive();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseAdditive = function () {
        // '+', '-'
        var /** @type {?} */ result = this.parseMultiplicative();
        while (this.next.type == TokenType.Operator) {
            var /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '+':
                case '-':
                    this.advance();
                    var /** @type {?} */ right = this.parseMultiplicative();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseMultiplicative = function () {
        // '*', '%', '/'
        var /** @type {?} */ result = this.parsePrefix();
        while (this.next.type == TokenType.Operator) {
            var /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '*':
                case '%':
                case '/':
                    this.advance();
                    var /** @type {?} */ right = this.parsePrefix();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parsePrefix = function () {
        if (this.next.type == TokenType.Operator) {
            var /** @type {?} */ start = this.inputIndex;
            var /** @type {?} */ operator = this.next.strValue;
            var /** @type {?} */ result = void 0;
            switch (operator) {
                case '+':
                    this.advance();
                    return this.parsePrefix();
                case '-':
                    this.advance();
                    result = this.parsePrefix();
                    return new Binary(this.span(start), operator, new LiteralPrimitive(new ParseSpan(start, start), 0), result);
                case '!':
                    this.advance();
                    result = this.parsePrefix();
                    return new PrefixNot(this.span(start), result);
            }
        }
        return this.parseCallChain();
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseCallChain = function () {
        var /** @type {?} */ result = this.parsePrimary();
        while (true) {
            if (this.optionalCharacter(chars.$PERIOD)) {
                result = this.parseAccessMemberOrMethodCall(result, false);
            }
            else if (this.optionalOperator('?.')) {
                result = this.parseAccessMemberOrMethodCall(result, true);
            }
            else if (this.optionalCharacter(chars.$LBRACKET)) {
                this.rbracketsExpected++;
                var /** @type {?} */ key = this.parsePipe();
                this.rbracketsExpected--;
                this.expectCharacter(chars.$RBRACKET);
                if (this.optionalOperator('=')) {
                    var /** @type {?} */ value = this.parseConditional();
                    result = new KeyedWrite(this.span(result.span.start), result, key, value);
                }
                else {
                    result = new KeyedRead(this.span(result.span.start), result, key);
                }
            }
            else if (this.optionalCharacter(chars.$LPAREN)) {
                this.rparensExpected++;
                var /** @type {?} */ args = this.parseCallArguments();
                this.rparensExpected--;
                this.expectCharacter(chars.$RPAREN);
                result = new FunctionCall(this.span(result.span.start), result, args);
            }
            else {
                return result;
            }
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parsePrimary = function () {
        var /** @type {?} */ start = this.inputIndex;
        if (this.optionalCharacter(chars.$LPAREN)) {
            this.rparensExpected++;
            var /** @type {?} */ result = this.parsePipe();
            this.rparensExpected--;
            this.expectCharacter(chars.$RPAREN);
            return result;
        }
        else if (this.next.isKeywordNull()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), null);
        }
        else if (this.next.isKeywordUndefined()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), void 0);
        }
        else if (this.next.isKeywordTrue()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), true);
        }
        else if (this.next.isKeywordFalse()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), false);
        }
        else if (this.next.isKeywordThis()) {
            this.advance();
            return new ImplicitReceiver(this.span(start));
        }
        else if (this.optionalCharacter(chars.$LBRACKET)) {
            this.rbracketsExpected++;
            var /** @type {?} */ elements = this.parseExpressionList(chars.$RBRACKET);
            this.rbracketsExpected--;
            this.expectCharacter(chars.$RBRACKET);
            return new LiteralArray(this.span(start), elements);
        }
        else if (this.next.isCharacter(chars.$LBRACE)) {
            return this.parseLiteralMap();
        }
        else if (this.next.isIdentifier()) {
            return this.parseAccessMemberOrMethodCall(new ImplicitReceiver(this.span(start)), false);
        }
        else if (this.next.isNumber()) {
            var /** @type {?} */ value = this.next.toNumber();
            this.advance();
            return new LiteralPrimitive(this.span(start), value);
        }
        else if (this.next.isString()) {
            var /** @type {?} */ literalValue = this.next.toString();
            this.advance();
            return new LiteralPrimitive(this.span(start), literalValue);
        }
        else if (this.index >= this.tokens.length) {
            this.error("Unexpected end of expression: " + this.input);
            return new EmptyExpr(this.span(start));
        }
        else {
            this.error("Unexpected token " + this.next);
            return new EmptyExpr(this.span(start));
        }
    };
    /**
     * @param {?} terminator
     * @return {?}
     */
    _ParseAST.prototype.parseExpressionList = function (terminator) {
        var /** @type {?} */ result = [];
        if (!this.next.isCharacter(terminator)) {
            do {
                result.push(this.parsePipe());
            } while (this.optionalCharacter(chars.$COMMA));
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseLiteralMap = function () {
        var /** @type {?} */ keys = [];
        var /** @type {?} */ values = [];
        var /** @type {?} */ start = this.inputIndex;
        this.expectCharacter(chars.$LBRACE);
        if (!this.optionalCharacter(chars.$RBRACE)) {
            this.rbracesExpected++;
            do {
                var /** @type {?} */ key = this.expectIdentifierOrKeywordOrString();
                keys.push(key);
                this.expectCharacter(chars.$COLON);
                values.push(this.parsePipe());
            } while (this.optionalCharacter(chars.$COMMA));
            this.rbracesExpected--;
            this.expectCharacter(chars.$RBRACE);
        }
        return new LiteralMap(this.span(start), keys, values);
    };
    /**
     * @param {?} receiver
     * @param {?=} isSafe
     * @return {?}
     */
    _ParseAST.prototype.parseAccessMemberOrMethodCall = function (receiver, isSafe) {
        if (isSafe === void 0) { isSafe = false; }
        var /** @type {?} */ start = receiver.span.start;
        var /** @type {?} */ id = this.expectIdentifierOrKeyword();
        if (this.optionalCharacter(chars.$LPAREN)) {
            this.rparensExpected++;
            var /** @type {?} */ args = this.parseCallArguments();
            this.expectCharacter(chars.$RPAREN);
            this.rparensExpected--;
            var /** @type {?} */ span = this.span(start);
            return isSafe ? new SafeMethodCall(span, receiver, id, args) :
                new MethodCall(span, receiver, id, args);
        }
        else {
            if (isSafe) {
                if (this.optionalOperator('=')) {
                    this.error('The \'?.\' operator cannot be used in the assignment');
                    return new EmptyExpr(this.span(start));
                }
                else {
                    return new SafePropertyRead(this.span(start), receiver, id);
                }
            }
            else {
                if (this.optionalOperator('=')) {
                    if (!this.parseAction) {
                        this.error('Bindings cannot contain assignments');
                        return new EmptyExpr(this.span(start));
                    }
                    var /** @type {?} */ value = this.parseConditional();
                    return new PropertyWrite(this.span(start), receiver, id, value);
                }
                else {
                    return new PropertyRead(this.span(start), receiver, id);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseCallArguments = function () {
        if (this.next.isCharacter(chars.$RPAREN))
            return [];
        var /** @type {?} */ positionals = [];
        do {
            positionals.push(this.parsePipe());
        } while (this.optionalCharacter(chars.$COMMA));
        return (positionals);
    };
    /**
     *  An identifier, a keyword, a string with an optional `-` inbetween.
     * @return {?}
     */
    _ParseAST.prototype.expectTemplateBindingKey = function () {
        var /** @type {?} */ result = '';
        var /** @type {?} */ operatorFound = false;
        do {
            result += this.expectIdentifierOrKeywordOrString();
            operatorFound = this.optionalOperator('-');
            if (operatorFound) {
                result += '-';
            }
        } while (operatorFound);
        return result.toString();
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseTemplateBindings = function () {
        var /** @type {?} */ bindings = [];
        var /** @type {?} */ prefix = null;
        var /** @type {?} */ warnings = [];
        while (this.index < this.tokens.length) {
            var /** @type {?} */ start = this.inputIndex;
            var /** @type {?} */ keyIsVar = this.peekKeywordLet();
            if (keyIsVar) {
                this.advance();
            }
            var /** @type {?} */ key = this.expectTemplateBindingKey();
            if (!keyIsVar) {
                if (prefix == null) {
                    prefix = key;
                }
                else {
                    key = prefix + key[0].toUpperCase() + key.substring(1);
                }
            }
            this.optionalCharacter(chars.$COLON);
            var /** @type {?} */ name_2 = null;
            var /** @type {?} */ expression = null;
            if (keyIsVar) {
                if (this.optionalOperator('=')) {
                    name_2 = this.expectTemplateBindingKey();
                }
                else {
                    name_2 = '\$implicit';
                }
            }
            else if (this.next !== EOF && !this.peekKeywordLet()) {
                var /** @type {?} */ start_1 = this.inputIndex;
                var /** @type {?} */ ast = this.parsePipe();
                var /** @type {?} */ source = this.input.substring(start_1 - this.offset, this.inputIndex - this.offset);
                expression = new ASTWithSource(ast, source, this.location, this.errors);
            }
            bindings.push(new TemplateBinding(this.span(start), key, keyIsVar, name_2, expression));
            if (!this.optionalCharacter(chars.$SEMICOLON)) {
                this.optionalCharacter(chars.$COMMA);
            }
        }
        return new TemplateBindingParseResult(bindings, warnings, this.errors);
    };
    /**
     * @param {?} message
     * @param {?=} index
     * @return {?}
     */
    _ParseAST.prototype.error = function (message, index) {
        if (index === void 0) { index = null; }
        this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
        this.skip();
    };
    /**
     * @param {?=} index
     * @return {?}
     */
    _ParseAST.prototype.locationText = function (index) {
        if (index === void 0) { index = null; }
        if (isBlank(index))
            index = this.index;
        return (index < this.tokens.length) ? "at column " + (this.tokens[index].index + 1) + " in" :
            "at the end of the expression";
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.skip = function () {
        var /** @type {?} */ n = this.next;
        while (this.index < this.tokens.length && !n.isCharacter(chars.$SEMICOLON) &&
            (this.rparensExpected <= 0 || !n.isCharacter(chars.$RPAREN)) &&
            (this.rbracesExpected <= 0 || !n.isCharacter(chars.$RBRACE)) &&
            (this.rbracketsExpected <= 0 || !n.isCharacter(chars.$RBRACKET))) {
            if (this.next.isError()) {
                this.errors.push(new ParserError(this.next.toString(), this.input, this.locationText(), this.location));
            }
            this.advance();
            n = this.next;
        }
    };
    return _ParseAST;
}());
function _ParseAST_tsickle_Closure_declarations() {
    /** @type {?} */
    _ParseAST.prototype.rparensExpected;
    /** @type {?} */
    _ParseAST.prototype.rbracketsExpected;
    /** @type {?} */
    _ParseAST.prototype.rbracesExpected;
    /** @type {?} */
    _ParseAST.prototype.index;
    /** @type {?} */
    _ParseAST.prototype.input;
    /** @type {?} */
    _ParseAST.prototype.location;
    /** @type {?} */
    _ParseAST.prototype.tokens;
    /** @type {?} */
    _ParseAST.prototype.inputLength;
    /** @type {?} */
    _ParseAST.prototype.parseAction;
    /** @type {?} */
    _ParseAST.prototype.errors;
    /** @type {?} */
    _ParseAST.prototype.offset;
}
var SimpleExpressionChecker = (function () {
    function SimpleExpressionChecker() {
        this.errors = [];
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    SimpleExpressionChecker.check = function (ast) {
        var /** @type {?} */ s = new SimpleExpressionChecker();
        ast.visit(s);
        return s.errors;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitImplicitReceiver = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitInterpolation = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitLiteralPrimitive = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPropertyRead = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPropertyWrite = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitSafePropertyRead = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitMethodCall = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitSafeMethodCall = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitFunctionCall = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitLiteralArray = function (ast, context) { this.visitAll(ast.expressions); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitLiteralMap = function (ast, context) { this.visitAll(ast.values); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitBinary = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPrefixNot = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitConditional = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPipe = function (ast, context) { this.errors.push('pipes'); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitKeyedRead = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitKeyedWrite = function (ast, context) { };
    /**
     * @param {?} asts
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitAll = function (asts) {
        var _this = this;
        return asts.map(function (node) { return node.visit(_this); });
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitChain = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitQuote = function (ast, context) { };
    return SimpleExpressionChecker;
}());
function SimpleExpressionChecker_tsickle_Closure_declarations() {
    /** @type {?} */
    SimpleExpressionChecker.prototype.errors;
}
//# sourceMappingURL=parser.js.map