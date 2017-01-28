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
import { NumberWrapper, isPresent } from '../facade/lang';
import { CompilerInjectable } from '../injectable';
export var TokenType = {};
TokenType.Character = 0;
TokenType.Identifier = 1;
TokenType.Keyword = 2;
TokenType.String = 3;
TokenType.Operator = 4;
TokenType.Number = 5;
TokenType.Error = 6;
TokenType[TokenType.Character] = "Character";
TokenType[TokenType.Identifier] = "Identifier";
TokenType[TokenType.Keyword] = "Keyword";
TokenType[TokenType.String] = "String";
TokenType[TokenType.Operator] = "Operator";
TokenType[TokenType.Number] = "Number";
TokenType[TokenType.Error] = "Error";
var /** @type {?} */ KEYWORDS = ['var', 'let', 'null', 'undefined', 'true', 'false', 'if', 'else', 'this'];
export var Lexer = (function () {
    function Lexer() {
    }
    /**
     * @param {?} text
     * @return {?}
     */
    Lexer.prototype.tokenize = function (text) {
        var /** @type {?} */ scanner = new _Scanner(text);
        var /** @type {?} */ tokens = [];
        var /** @type {?} */ token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    };
    Lexer = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [])
    ], Lexer);
    return Lexer;
}());
export var Token = (function () {
    /**
     * @param {?} index
     * @param {?} type
     * @param {?} numValue
     * @param {?} strValue
     */
    function Token(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    /**
     * @param {?} code
     * @return {?}
     */
    Token.prototype.isCharacter = function (code) {
        return this.type == TokenType.Character && this.numValue == code;
    };
    /**
     * @return {?}
     */
    Token.prototype.isNumber = function () { return this.type == TokenType.Number; };
    /**
     * @return {?}
     */
    Token.prototype.isString = function () { return this.type == TokenType.String; };
    /**
     * @param {?} operater
     * @return {?}
     */
    Token.prototype.isOperator = function (operater) {
        return this.type == TokenType.Operator && this.strValue == operater;
    };
    /**
     * @return {?}
     */
    Token.prototype.isIdentifier = function () { return this.type == TokenType.Identifier; };
    /**
     * @return {?}
     */
    Token.prototype.isKeyword = function () { return this.type == TokenType.Keyword; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordLet = function () { return this.type == TokenType.Keyword && this.strValue == 'let'; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordNull = function () { return this.type == TokenType.Keyword && this.strValue == 'null'; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordUndefined = function () {
        return this.type == TokenType.Keyword && this.strValue == 'undefined';
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordTrue = function () { return this.type == TokenType.Keyword && this.strValue == 'true'; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordFalse = function () { return this.type == TokenType.Keyword && this.strValue == 'false'; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordThis = function () { return this.type == TokenType.Keyword && this.strValue == 'this'; };
    /**
     * @return {?}
     */
    Token.prototype.isError = function () { return this.type == TokenType.Error; };
    /**
     * @return {?}
     */
    Token.prototype.toNumber = function () { return this.type == TokenType.Number ? this.numValue : -1; };
    /**
     * @return {?}
     */
    Token.prototype.toString = function () {
        switch (this.type) {
            case TokenType.Character:
            case TokenType.Identifier:
            case TokenType.Keyword:
            case TokenType.Operator:
            case TokenType.String:
            case TokenType.Error:
                return this.strValue;
            case TokenType.Number:
                return this.numValue.toString();
            default:
                return null;
        }
    };
    return Token;
}());
function Token_tsickle_Closure_declarations() {
    /** @type {?} */
    Token.prototype.index;
    /** @type {?} */
    Token.prototype.type;
    /** @type {?} */
    Token.prototype.numValue;
    /** @type {?} */
    Token.prototype.strValue;
}
/**
 * @param {?} index
 * @param {?} code
 * @return {?}
 */
function newCharacterToken(index, code) {
    return new Token(index, TokenType.Character, code, String.fromCharCode(code));
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newIdentifierToken(index, text) {
    return new Token(index, TokenType.Identifier, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newKeywordToken(index, text) {
    return new Token(index, TokenType.Keyword, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newOperatorToken(index, text) {
    return new Token(index, TokenType.Operator, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newStringToken(index, text) {
    return new Token(index, TokenType.String, 0, text);
}
/**
 * @param {?} index
 * @param {?} n
 * @return {?}
 */
function newNumberToken(index, n) {
    return new Token(index, TokenType.Number, n, '');
}
/**
 * @param {?} index
 * @param {?} message
 * @return {?}
 */
function newErrorToken(index, message) {
    return new Token(index, TokenType.Error, 0, message);
}
export var /** @type {?} */ EOF = new Token(-1, TokenType.Character, 0, '');
var _Scanner = (function () {
    /**
     * @param {?} input
     */
    function _Scanner(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
    }
    /**
     * @return {?}
     */
    _Scanner.prototype.advance = function () {
        this.peek = ++this.index >= this.length ? chars.$EOF : this.input.charCodeAt(this.index);
    };
    /**
     * @return {?}
     */
    _Scanner.prototype.scanToken = function () {
        var /** @type {?} */ input = this.input, /** @type {?} */ length = this.length;
        var /** @type {?} */ peek = this.peek, /** @type {?} */ index = this.index;
        // Skip whitespace.
        while (peek <= chars.$SPACE) {
            if (++index >= length) {
                peek = chars.$EOF;
                break;
            }
            else {
                peek = input.charCodeAt(index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        // Handle identifiers and numbers.
        if (isIdentifierStart(peek))
            return this.scanIdentifier();
        if (chars.isDigit(peek))
            return this.scanNumber(index);
        var /** @type {?} */ start = index;
        switch (peek) {
            case chars.$PERIOD:
                this.advance();
                return chars.isDigit(this.peek) ? this.scanNumber(start) :
                    newCharacterToken(start, chars.$PERIOD);
            case chars.$LPAREN:
            case chars.$RPAREN:
            case chars.$LBRACE:
            case chars.$RBRACE:
            case chars.$LBRACKET:
            case chars.$RBRACKET:
            case chars.$COMMA:
            case chars.$COLON:
            case chars.$SEMICOLON:
                return this.scanCharacter(start, peek);
            case chars.$SQ:
            case chars.$DQ:
                return this.scanString();
            case chars.$HASH:
            case chars.$PLUS:
            case chars.$MINUS:
            case chars.$STAR:
            case chars.$SLASH:
            case chars.$PERCENT:
            case chars.$CARET:
                return this.scanOperator(start, String.fromCharCode(peek));
            case chars.$QUESTION:
                return this.scanComplexOperator(start, '?', chars.$PERIOD, '.');
            case chars.$LT:
            case chars.$GT:
                return this.scanComplexOperator(start, String.fromCharCode(peek), chars.$EQ, '=');
            case chars.$BANG:
            case chars.$EQ:
                return this.scanComplexOperator(start, String.fromCharCode(peek), chars.$EQ, '=', chars.$EQ, '=');
            case chars.$AMPERSAND:
                return this.scanComplexOperator(start, '&', chars.$AMPERSAND, '&');
            case chars.$BAR:
                return this.scanComplexOperator(start, '|', chars.$BAR, '|');
            case chars.$NBSP:
                while (chars.isWhitespace(this.peek))
                    this.advance();
                return this.scanToken();
        }
        this.advance();
        return this.error("Unexpected character [" + String.fromCharCode(peek) + "]", 0);
    };
    /**
     * @param {?} start
     * @param {?} code
     * @return {?}
     */
    _Scanner.prototype.scanCharacter = function (start, code) {
        this.advance();
        return newCharacterToken(start, code);
    };
    /**
     * @param {?} start
     * @param {?} str
     * @return {?}
     */
    _Scanner.prototype.scanOperator = function (start, str) {
        this.advance();
        return newOperatorToken(start, str);
    };
    /**
     *  Tokenize a 2/3 char long operator
      * *
     * @param {?} start start index in the expression
     * @param {?} one first symbol (always part of the operator)
     * @param {?} twoCode code point for the second symbol
     * @param {?} two second symbol (part of the operator when the second code point matches)
     * @param {?=} threeCode code point for the third symbol
     * @param {?=} three third symbol (part of the operator when provided and matches source expression)
     * @return {?}
     */
    _Scanner.prototype.scanComplexOperator = function (start, one, twoCode, two, threeCode, three) {
        this.advance();
        var /** @type {?} */ str = one;
        if (this.peek == twoCode) {
            this.advance();
            str += two;
        }
        if (isPresent(threeCode) && this.peek == threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, str);
    };
    /**
     * @return {?}
     */
    _Scanner.prototype.scanIdentifier = function () {
        var /** @type {?} */ start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        var /** @type {?} */ str = this.input.substring(start, this.index);
        return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, str) :
            newIdentifierToken(start, str);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    _Scanner.prototype.scanNumber = function (start) {
        var /** @type {?} */ simple = (this.index === start);
        this.advance(); // Skip initial digit.
        while (true) {
            if (chars.isDigit(this.peek)) {
            }
            else if (this.peek == chars.$PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                    this.advance();
                if (!chars.isDigit(this.peek))
                    return this.error('Invalid exponent', -1);
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        var /** @type {?} */ str = this.input.substring(start, this.index);
        var /** @type {?} */ value = simple ? NumberWrapper.parseIntAutoRadix(str) : parseFloat(str);
        return newNumberToken(start, value);
    };
    /**
     * @return {?}
     */
    _Scanner.prototype.scanString = function () {
        var /** @type {?} */ start = this.index;
        var /** @type {?} */ quote = this.peek;
        this.advance(); // Skip initial quote.
        var /** @type {?} */ buffer = '';
        var /** @type {?} */ marker = this.index;
        var /** @type {?} */ input = this.input;
        while (this.peek != quote) {
            if (this.peek == chars.$BACKSLASH) {
                buffer += input.substring(marker, this.index);
                this.advance();
                var /** @type {?} */ unescapedCode = void 0;
                if (this.peek == chars.$u) {
                    // 4 character hex code for unicode character.
                    var /** @type {?} */ hex = input.substring(this.index + 1, this.index + 5);
                    if (/^[0-9a-f]+$/i.test(hex)) {
                        unescapedCode = parseInt(hex, 16);
                    }
                    else {
                        return this.error("Invalid unicode escape [\\u" + hex + "]", 0);
                    }
                    for (var /** @type {?} */ i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer += String.fromCharCode(unescapedCode);
                marker = this.index;
            }
            else if (this.peek == chars.$EOF) {
                return this.error('Unterminated quote', 0);
            }
            else {
                this.advance();
            }
        }
        var /** @type {?} */ last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        return newStringToken(start, buffer + last);
    };
    /**
     * @param {?} message
     * @param {?} offset
     * @return {?}
     */
    _Scanner.prototype.error = function (message, offset) {
        var /** @type {?} */ position = this.index + offset;
        return newErrorToken(position, "Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
    };
    return _Scanner;
}());
function _Scanner_tsickle_Closure_declarations() {
    /** @type {?} */
    _Scanner.prototype.length;
    /** @type {?} */
    _Scanner.prototype.peek;
    /** @type {?} */
    _Scanner.prototype.index;
    /** @type {?} */
    _Scanner.prototype.input;
}
/**
 * @param {?} code
 * @return {?}
 */
function isIdentifierStart(code) {
    return (chars.$a <= code && code <= chars.$z) || (chars.$A <= code && code <= chars.$Z) ||
        (code == chars.$_) || (code == chars.$$);
}
/**
 * @param {?} input
 * @return {?}
 */
export function isIdentifier(input) {
    if (input.length == 0)
        return false;
    var /** @type {?} */ scanner = new _Scanner(input);
    if (!isIdentifierStart(scanner.peek))
        return false;
    scanner.advance();
    while (scanner.peek !== chars.$EOF) {
        if (!isIdentifierPart(scanner.peek))
            return false;
        scanner.advance();
    }
    return true;
}
/**
 * @param {?} code
 * @return {?}
 */
function isIdentifierPart(code) {
    return chars.isAsciiLetter(code) || chars.isDigit(code) || (code == chars.$_) ||
        (code == chars.$$);
}
/**
 * @param {?} code
 * @return {?}
 */
function isExponentStart(code) {
    return code == chars.$e || code == chars.$E;
}
/**
 * @param {?} code
 * @return {?}
 */
function isExponentSign(code) {
    return code == chars.$MINUS || code == chars.$PLUS;
}
/**
 * @param {?} code
 * @return {?}
 */
export function isQuote(code) {
    return code === chars.$SQ || code === chars.$DQ || code === chars.$BT;
}
/**
 * @param {?} code
 * @return {?}
 */
function unescape(code) {
    switch (code) {
        case chars.$n:
            return chars.$LF;
        case chars.$f:
            return chars.$FF;
        case chars.$r:
            return chars.$CR;
        case chars.$t:
            return chars.$TAB;
        case chars.$v:
            return chars.$VTAB;
        default:
            return code;
    }
}
//# sourceMappingURL=lexer.js.map