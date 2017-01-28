/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Identifiers, createIdentifier } from '../identifiers';
import * as o from '../output/output_ast';
export var CheckBindingField = (function () {
    /**
     * @param {?} expression
     * @param {?} bindingId
     */
    function CheckBindingField(expression, bindingId) {
        this.expression = expression;
        this.bindingId = bindingId;
    }
    return CheckBindingField;
}());
function CheckBindingField_tsickle_Closure_declarations() {
    /** @type {?} */
    CheckBindingField.prototype.expression;
    /** @type {?} */
    CheckBindingField.prototype.bindingId;
}
/**
 * @param {?} builder
 * @return {?}
 */
export function createCheckBindingField(builder) {
    var /** @type {?} */ bindingId = "" + builder.fields.length;
    var /** @type {?} */ fieldExpr = createBindFieldExpr(bindingId);
    // private is fine here as no child view will reference the cached value...
    builder.fields.push(new o.ClassField(fieldExpr.name, null, [o.StmtModifier.Private]));
    builder.ctorStmts.push(o.THIS_EXPR.prop(fieldExpr.name)
        .set(o.importExpr(createIdentifier(Identifiers.UNINITIALIZED)))
        .toStmt());
    return new CheckBindingField(fieldExpr, bindingId);
}
/**
 * @param {?} evalResult
 * @param {?} fieldExpr
 * @param {?} throwOnChangeVar
 * @param {?} actions
 * @return {?}
 */
export function createCheckBindingStmt(evalResult, fieldExpr, throwOnChangeVar, actions) {
    var /** @type {?} */ condition = o.importExpr(createIdentifier(Identifiers.checkBinding)).callFn([
        throwOnChangeVar, fieldExpr, evalResult.currValExpr
    ]);
    if (evalResult.forceUpdate) {
        condition = evalResult.forceUpdate.or(condition);
    }
    return evalResult.stmts.concat([
        new o.IfStmt(condition, actions.concat([(o.THIS_EXPR.prop(fieldExpr.name).set(evalResult.currValExpr).toStmt())
        ]))
    ]);
}
/**
 * @param {?} bindingId
 * @return {?}
 */
function createBindFieldExpr(bindingId) {
    return o.THIS_EXPR.prop("_expr_" + bindingId);
}
//# sourceMappingURL=binding_util.js.map