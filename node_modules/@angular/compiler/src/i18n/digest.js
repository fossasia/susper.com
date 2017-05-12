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
/**
 * @param {?} message
 * @return {?}
 */
export function digest(message) {
    return sha1(serializeNodes(message.nodes).join('') + ("[" + message.meaning + "]"));
}
/**
 * @param {?} message
 * @return {?}
 */
export function decimalDigest(message) {
    var /** @type {?} */ visitor = new _SerializerIgnoreIcuExpVisitor();
    var /** @type {?} */ parts = message.nodes.map(function (a) { return a.visit(visitor, null); });
    return computeMsgId(parts.join(''), message.meaning);
}
/**
 *  Serialize the i18n ast to something xml-like in order to generate an UID.
  * *
  * The visitor is also used in the i18n parser tests
  * *
 */
var _SerializerVisitor = (function () {
    function _SerializerVisitor() {
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitText = function (text, context) { return text.value; };
    /**
     * @param {?} container
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        return "[" + container.children.map(function (child) { return child.visit(_this); }).join(', ') + "]";
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ strCases = Object.keys(icu.cases).map(function (k) { return (k + " {" + icu.cases[k].visit(_this) + "}"); });
        return "{" + icu.expression + ", " + icu.type + ", " + strCases.join(', ') + "}";
    };
    /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitTagPlaceholder = function (ph, context) {
        var _this = this;
        return ph.isVoid ?
            "<ph tag name=\"" + ph.startName + "\"/>" :
            "<ph tag name=\"" + ph.startName + "\">" + ph.children.map(function (child) { return child.visit(_this); }).join(', ') + "</ph name=\"" + ph.closeName + "\">";
    };
    /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitPlaceholder = function (ph, context) {
        return ph.value ? "<ph name=\"" + ph.name + "\">" + ph.value + "</ph>" : "<ph name=\"" + ph.name + "\"/>";
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
        return "<ph icu name=\"" + ph.name + "\">" + ph.value.visit(this) + "</ph>";
    };
    return _SerializerVisitor;
}());
var /** @type {?} */ serializerVisitor = new _SerializerVisitor();
/**
 * @param {?} nodes
 * @return {?}
 */
export function serializeNodes(nodes) {
    return nodes.map(function (a) { return a.visit(serializerVisitor, null); });
}
/**
 *  Serialize the i18n ast to something xml-like in order to generate an UID.
  * *
  * Ignore the ICU expressions so that message IDs stays identical if only the expression changes.
  * *
 */
var _SerializerIgnoreIcuExpVisitor = (function (_super) {
    __extends(_SerializerIgnoreIcuExpVisitor, _super);
    function _SerializerIgnoreIcuExpVisitor() {
        _super.apply(this, arguments);
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    _SerializerIgnoreIcuExpVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ strCases = Object.keys(icu.cases).map(function (k) { return (k + " {" + icu.cases[k].visit(_this) + "}"); });
        // Do not take the expression into account
        return "{" + icu.type + ", " + strCases.join(', ') + "}";
    };
    return _SerializerIgnoreIcuExpVisitor;
}(_SerializerVisitor));
/**
 *  Compute the SHA1 of the given string
  * *
  * see http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
  * *
  * WARNING: this function has not been designed not tested with security in mind.
  * DO NOT USE IT IN A SECURITY SENSITIVE CONTEXT.
 * @param {?} str
 * @return {?}
 */
export function sha1(str) {
    var /** @type {?} */ utf8 = utf8Encode(str);
    var /** @type {?} */ words32 = stringToWords32(utf8, Endian.Big);
    var /** @type {?} */ len = utf8.length * 8;
    var /** @type {?} */ w = new Array(80);
    var _a = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0], a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4];
    words32[len >> 5] |= 0x80 << (24 - len % 32);
    words32[((len + 64 >> 9) << 4) + 15] = len;
    for (var /** @type {?} */ i = 0; i < words32.length; i += 16) {
        var _b = [a, b, c, d, e], h0 = _b[0], h1 = _b[1], h2 = _b[2], h3 = _b[3], h4 = _b[4];
        for (var /** @type {?} */ j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = words32[i + j];
            }
            else {
                w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var _c = fk(j, b, c, d), f = _c[0], k = _c[1];
            var /** @type {?} */ temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
            _d = [d, c, rol32(b, 30), a, temp], e = _d[0], d = _d[1], c = _d[2], b = _d[3], a = _d[4];
        }
        _e = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)], a = _e[0], b = _e[1], c = _e[2], d = _e[3], e = _e[4];
    }
    return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
    var _d, _e;
}
/**
 * @param {?} index
 * @param {?} b
 * @param {?} c
 * @param {?} d
 * @return {?}
 */
function fk(index, b, c, d) {
    if (index < 20) {
        return [(b & c) | (~b & d), 0x5a827999];
    }
    if (index < 40) {
        return [b ^ c ^ d, 0x6ed9eba1];
    }
    if (index < 60) {
        return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
    }
    return [b ^ c ^ d, 0xca62c1d6];
}
/**
 *  Compute the fingerprint of the given string
  * *
  * The output is 64 bit number encoded as a decimal string
  * *
  * based on:
  * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java
 * @param {?} str
 * @return {?}
 */
export function fingerprint(str) {
    var /** @type {?} */ utf8 = utf8Encode(str);
    var _a = [hash32(utf8, 0), hash32(utf8, 102072)], hi = _a[0], lo = _a[1];
    if (hi == 0 && (lo == 0 || lo == 1)) {
        hi = hi ^ 0x130f9bef;
        lo = lo ^ -0x6b5f56d8;
    }
    return [hi, lo];
}
/**
 * @param {?} msg
 * @param {?} meaning
 * @return {?}
 */
export function computeMsgId(msg, meaning) {
    var _a = fingerprint(msg), hi = _a[0], lo = _a[1];
    if (meaning) {
        var _b = fingerprint(meaning), him = _b[0], lom = _b[1];
        _c = add64(rol64([hi, lo], 1), [him, lom]), hi = _c[0], lo = _c[1];
    }
    return byteStringToDecString(words32ToByteString([hi & 0x7fffffff, lo]));
    var _c;
}
/**
 * @param {?} str
 * @param {?} c
 * @return {?}
 */
function hash32(str, c) {
    var _a = [0x9e3779b9, 0x9e3779b9], a = _a[0], b = _a[1];
    var /** @type {?} */ i;
    var /** @type {?} */ len = str.length;
    for (i = 0; i + 12 <= len; i += 12) {
        a = add32(a, wordAt(str, i, Endian.Little));
        b = add32(b, wordAt(str, i + 4, Endian.Little));
        c = add32(c, wordAt(str, i + 8, Endian.Little));
        _b = mix([a, b, c]), a = _b[0], b = _b[1], c = _b[2];
    }
    a = add32(a, wordAt(str, i, Endian.Little));
    b = add32(b, wordAt(str, i + 4, Endian.Little));
    // the first byte of c is reserved for the length
    c = add32(c, len);
    c = add32(c, wordAt(str, i + 8, Endian.Little) << 8);
    return mix([a, b, c])[2];
    var _b;
}
/**
 * @param {?} __0
 * @return {?}
 */
function mix(_a) {
    var a = _a[0], b = _a[1], c = _a[2];
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 13;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 8;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 13;
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 12;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 16;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 5;
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 3;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 10;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 15;
    return [a, b, c];
}
var Endian = {};
Endian.Little = 0;
Endian.Big = 1;
Endian[Endian.Little] = "Little";
Endian[Endian.Big] = "Big";
/**
 * @param {?} str
 * @return {?}
 */
function utf8Encode(str) {
    var /** @type {?} */ encoded = '';
    for (var /** @type {?} */ index = 0; index < str.length; index++) {
        var /** @type {?} */ codePoint = decodeSurrogatePairs(str, index);
        if (codePoint <= 0x7f) {
            encoded += String.fromCharCode(codePoint);
        }
        else if (codePoint <= 0x7ff) {
            encoded += String.fromCharCode(0xc0 | codePoint >>> 6, 0x80 | codePoint & 0x3f);
        }
        else if (codePoint <= 0xffff) {
            encoded += String.fromCharCode(0xe0 | codePoint >>> 12, 0x80 | codePoint >>> 6 & 0x3f, 0x80 | codePoint & 0x3f);
        }
        else if (codePoint <= 0x1fffff) {
            encoded += String.fromCharCode(0xf0 | codePoint >>> 18, 0x80 | codePoint >>> 12 & 0x3f, 0x80 | codePoint >>> 6 & 0x3f, 0x80 | codePoint & 0x3f);
        }
    }
    return encoded;
}
/**
 * @param {?} str
 * @param {?} index
 * @return {?}
 */
function decodeSurrogatePairs(str, index) {
    if (index < 0 || index >= str.length) {
        throw new Error("index=" + index + " is out of range in \"" + str + "\"");
    }
    var /** @type {?} */ high = str.charCodeAt(index);
    if (high >= 0xd800 && high <= 0xdfff && str.length > index + 1) {
        var /** @type {?} */ low = byteAt(str, index + 1);
        if (low >= 0xdc00 && low <= 0xdfff) {
            return (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;
        }
    }
    return high;
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function add32(a, b) {
    return add32to64(a, b)[1];
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function add32to64(a, b) {
    var /** @type {?} */ low = (a & 0xffff) + (b & 0xffff);
    var /** @type {?} */ high = (a >>> 16) + (b >>> 16) + (low >>> 16);
    return [high >>> 16, (high << 16) | (low & 0xffff)];
}
/**
 * @param {?} __0
 * @param {?} __1
 * @return {?}
 */
function add64(_a, _b) {
    var ah = _a[0], al = _a[1];
    var bh = _b[0], bl = _b[1];
    var _c = add32to64(al, bl), carry = _c[0], l = _c[1];
    var /** @type {?} */ h = add32(add32(ah, bh), carry);
    return [h, l];
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function sub32(a, b) {
    var /** @type {?} */ low = (a & 0xffff) - (b & 0xffff);
    var /** @type {?} */ high = (a >> 16) - (b >> 16) + (low >> 16);
    return (high << 16) | (low & 0xffff);
}
/**
 * @param {?} a
 * @param {?} count
 * @return {?}
 */
function rol32(a, count) {
    return (a << count) | (a >>> (32 - count));
}
/**
 * @param {?} __0
 * @param {?} count
 * @return {?}
 */
function rol64(_a, count) {
    var hi = _a[0], lo = _a[1];
    var /** @type {?} */ h = (hi << count) | (lo >>> (32 - count));
    var /** @type {?} */ l = (lo << count) | (hi >>> (32 - count));
    return [h, l];
}
/**
 * @param {?} str
 * @param {?} endian
 * @return {?}
 */
function stringToWords32(str, endian) {
    var /** @type {?} */ words32 = Array((str.length + 3) >>> 2);
    for (var /** @type {?} */ i = 0; i < words32.length; i++) {
        words32[i] = wordAt(str, i * 4, endian);
    }
    return words32;
}
/**
 * @param {?} str
 * @param {?} index
 * @return {?}
 */
function byteAt(str, index) {
    return index >= str.length ? 0 : str.charCodeAt(index) & 0xff;
}
/**
 * @param {?} str
 * @param {?} index
 * @param {?} endian
 * @return {?}
 */
function wordAt(str, index, endian) {
    var /** @type {?} */ word = 0;
    if (endian === Endian.Big) {
        for (var /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << (24 - 8 * i);
        }
    }
    else {
        for (var /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << 8 * i;
        }
    }
    return word;
}
/**
 * @param {?} words32
 * @return {?}
 */
function words32ToByteString(words32) {
    return words32.reduce(function (str, word) { return str + word32ToByteString(word); }, '');
}
/**
 * @param {?} word
 * @return {?}
 */
function word32ToByteString(word) {
    var /** @type {?} */ str = '';
    for (var /** @type {?} */ i = 0; i < 4; i++) {
        str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
    }
    return str;
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToHexString(str) {
    var /** @type {?} */ hex = '';
    for (var /** @type {?} */ i = 0; i < str.length; i++) {
        var /** @type {?} */ b = byteAt(str, i);
        hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
    }
    return hex.toLowerCase();
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToDecString(str) {
    var /** @type {?} */ decimal = '';
    var /** @type {?} */ toThePower = '1';
    for (var /** @type {?} */ i = str.length - 1; i >= 0; i--) {
        decimal = addBigInt(decimal, numberTimesBigInt(byteAt(str, i), toThePower));
        toThePower = numberTimesBigInt(256, toThePower);
    }
    return decimal.split('').reverse().join('');
}
/**
 * @param {?} x
 * @param {?} y
 * @return {?}
 */
function addBigInt(x, y) {
    var /** @type {?} */ sum = '';
    var /** @type {?} */ len = Math.max(x.length, y.length);
    for (var /** @type {?} */ i = 0, /** @type {?} */ carry = 0; i < len || carry; i++) {
        var /** @type {?} */ tmpSum = carry + +(x[i] || 0) + +(y[i] || 0);
        if (tmpSum >= 10) {
            carry = 1;
            sum += tmpSum - 10;
        }
        else {
            carry = 0;
            sum += tmpSum;
        }
    }
    return sum;
}
/**
 * @param {?} num
 * @param {?} b
 * @return {?}
 */
function numberTimesBigInt(num, b) {
    var /** @type {?} */ product = '';
    var /** @type {?} */ bToThePower = b;
    for (; num !== 0; num = num >>> 1) {
        if (num & 1)
            product = addBigInt(product, bToThePower);
        bToThePower = addBigInt(bToThePower, bToThePower);
    }
    return product;
}
//# sourceMappingURL=digest.js.map