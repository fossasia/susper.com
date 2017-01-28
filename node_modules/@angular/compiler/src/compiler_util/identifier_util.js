/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPresent } from '../facade/lang';
import { Identifiers, createEnumIdentifier, createIdentifier } from '../identifiers';
import * as o from '../output/output_ast';
/**
 * @param {?} token
 * @return {?}
 */
export function createDiTokenExpression(token) {
    if (isPresent(token.value)) {
        return o.literal(token.value);
    }
    else {
        return o.importExpr(token.identifier);
    }
}
/**
 * @param {?} values
 * @return {?}
 */
export function createInlineArray(values) {
    if (values.length === 0) {
        return o.importExpr(createIdentifier(Identifiers.EMPTY_INLINE_ARRAY));
    }
    var /** @type {?} */ log2 = Math.log(values.length) / Math.log(2);
    var /** @type {?} */ index = Math.ceil(log2);
    var /** @type {?} */ identifierSpec = index < Identifiers.inlineArrays.length ? Identifiers.inlineArrays[index] :
        Identifiers.InlineArrayDynamic;
    var /** @type {?} */ identifier = createIdentifier(identifierSpec);
    return o.importExpr(identifier).instantiate([(o.literal(values.length))
    ].concat(values));
}
/**
 * @param {?} fn
 * @param {?} argCount
 * @param {?} pureProxyProp
 * @param {?} builder
 * @return {?}
 */
export function createPureProxy(fn, argCount, pureProxyProp, builder) {
    builder.fields.push(new o.ClassField(pureProxyProp.name, null));
    var /** @type {?} */ pureProxyId = argCount < Identifiers.pureProxies.length ? Identifiers.pureProxies[argCount] : null;
    if (!pureProxyId) {
        throw new Error("Unsupported number of argument for pure functions: " + argCount);
    }
    builder.ctorStmts.push(o.THIS_EXPR.prop(pureProxyProp.name)
        .set(o.importExpr(createIdentifier(pureProxyId)).callFn([fn]))
        .toStmt());
}
/**
 * @param {?} enumType
 * @param {?} enumValue
 * @return {?}
 */
export function createEnumExpression(enumType, enumValue) {
    var /** @type {?} */ enumName = Object.keys(enumType.runtime).find(function (propName) { return enumType.runtime[propName] === enumValue; });
    if (!enumName) {
        throw new Error("Unknown enum value " + enumValue + " in " + enumType.name);
    }
    return o.importExpr(createEnumIdentifier(enumType, enumName));
}
//# sourceMappingURL=identifier_util.js.map