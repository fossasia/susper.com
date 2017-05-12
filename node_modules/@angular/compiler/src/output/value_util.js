/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { visitValue } from '../util';
import * as o from './output_ast';
export var /** @type {?} */ QUOTED_KEYS = '$quoted$';
/**
 * @param {?} value
 * @param {?=} type
 * @return {?}
 */
export function convertValueToOutputAst(value, type) {
    if (type === void 0) { type = null; }
    return visitValue(value, new _ValueOutputAstTransformer(), type);
}
var _ValueOutputAstTransformer = (function () {
    function _ValueOutputAstTransformer() {
    }
    /**
     * @param {?} arr
     * @param {?} type
     * @return {?}
     */
    _ValueOutputAstTransformer.prototype.visitArray = function (arr, type) {
        var _this = this;
        return o.literalArr(arr.map(function (value) { return visitValue(value, _this, null); }), type);
    };
    /**
     * @param {?} map
     * @param {?} type
     * @return {?}
     */
    _ValueOutputAstTransformer.prototype.visitStringMap = function (map, type) {
        var _this = this;
        var /** @type {?} */ entries = [];
        var /** @type {?} */ quotedSet = new Set(map && map[QUOTED_KEYS]);
        Object.keys(map).forEach(function (key) {
            entries.push(new o.LiteralMapEntry(key, visitValue(map[key], _this, null), quotedSet.has(key)));
        });
        return new o.LiteralMapExpr(entries, type);
    };
    /**
     * @param {?} value
     * @param {?} type
     * @return {?}
     */
    _ValueOutputAstTransformer.prototype.visitPrimitive = function (value, type) { return o.literal(value, type); };
    /**
     * @param {?} value
     * @param {?} type
     * @return {?}
     */
    _ValueOutputAstTransformer.prototype.visitOther = function (value, type) {
        if (value instanceof o.Expression) {
            return value;
        }
        else {
            return o.importExpr({ reference: value });
        }
    };
    return _ValueOutputAstTransformer;
}());
//# sourceMappingURL=value_util.js.map