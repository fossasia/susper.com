/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export var /** @type {?} */ $EOF = 0;
export var /** @type {?} */ $TAB = 9;
export var /** @type {?} */ $LF = 10;
export var /** @type {?} */ $VTAB = 11;
export var /** @type {?} */ $FF = 12;
export var /** @type {?} */ $CR = 13;
export var /** @type {?} */ $SPACE = 32;
export var /** @type {?} */ $BANG = 33;
export var /** @type {?} */ $DQ = 34;
export var /** @type {?} */ $HASH = 35;
export var /** @type {?} */ $$ = 36;
export var /** @type {?} */ $PERCENT = 37;
export var /** @type {?} */ $AMPERSAND = 38;
export var /** @type {?} */ $SQ = 39;
export var /** @type {?} */ $LPAREN = 40;
export var /** @type {?} */ $RPAREN = 41;
export var /** @type {?} */ $STAR = 42;
export var /** @type {?} */ $PLUS = 43;
export var /** @type {?} */ $COMMA = 44;
export var /** @type {?} */ $MINUS = 45;
export var /** @type {?} */ $PERIOD = 46;
export var /** @type {?} */ $SLASH = 47;
export var /** @type {?} */ $COLON = 58;
export var /** @type {?} */ $SEMICOLON = 59;
export var /** @type {?} */ $LT = 60;
export var /** @type {?} */ $EQ = 61;
export var /** @type {?} */ $GT = 62;
export var /** @type {?} */ $QUESTION = 63;
export var /** @type {?} */ $0 = 48;
export var /** @type {?} */ $9 = 57;
export var /** @type {?} */ $A = 65;
export var /** @type {?} */ $E = 69;
export var /** @type {?} */ $F = 70;
export var /** @type {?} */ $X = 88;
export var /** @type {?} */ $Z = 90;
export var /** @type {?} */ $LBRACKET = 91;
export var /** @type {?} */ $BACKSLASH = 92;
export var /** @type {?} */ $RBRACKET = 93;
export var /** @type {?} */ $CARET = 94;
export var /** @type {?} */ $_ = 95;
export var /** @type {?} */ $a = 97;
export var /** @type {?} */ $e = 101;
export var /** @type {?} */ $f = 102;
export var /** @type {?} */ $n = 110;
export var /** @type {?} */ $r = 114;
export var /** @type {?} */ $t = 116;
export var /** @type {?} */ $u = 117;
export var /** @type {?} */ $v = 118;
export var /** @type {?} */ $x = 120;
export var /** @type {?} */ $z = 122;
export var /** @type {?} */ $LBRACE = 123;
export var /** @type {?} */ $BAR = 124;
export var /** @type {?} */ $RBRACE = 125;
export var /** @type {?} */ $NBSP = 160;
export var /** @type {?} */ $PIPE = 124;
export var /** @type {?} */ $TILDA = 126;
export var /** @type {?} */ $AT = 64;
export var /** @type {?} */ $BT = 96;
/**
 * @param {?} code
 * @return {?}
 */
export function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
}
/**
 * @param {?} code
 * @return {?}
 */
export function isDigit(code) {
    return $0 <= code && code <= $9;
}
/**
 * @param {?} code
 * @return {?}
 */
export function isAsciiLetter(code) {
    return code >= $a && code <= $z || code >= $A && code <= $Z;
}
/**
 * @param {?} code
 * @return {?}
 */
export function isAsciiHexDigit(code) {
    return code >= $a && code <= $f || code >= $A && code <= $F || isDigit(code);
}
//# sourceMappingURL=chars.js.map