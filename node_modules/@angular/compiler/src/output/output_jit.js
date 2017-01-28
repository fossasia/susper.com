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
import { identifierName } from '../compile_metadata';
import { EmitterVisitorContext } from './abstract_emitter';
import { AbstractJsEmitterVisitor } from './abstract_js_emitter';
/**
 * @param {?} sourceUrl
 * @param {?} expr
 * @param {?} declarations
 * @param {?} vars
 * @return {?}
 */
function evalExpression(sourceUrl, expr, declarations, vars) {
    var /** @type {?} */ fnBody = declarations + "\nreturn " + expr + "\n//# sourceURL=" + sourceUrl;
    var /** @type {?} */ fnArgNames = [];
    var /** @type {?} */ fnArgValues = [];
    for (var argName in vars) {
        fnArgNames.push(argName);
        fnArgValues.push(vars[argName]);
    }
    return new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat(fnBody))))().apply(void 0, fnArgValues);
}
/**
 * @param {?} sourceUrl
 * @param {?} statements
 * @param {?} resultVar
 * @return {?}
 */
export function jitStatements(sourceUrl, statements, resultVar) {
    var /** @type {?} */ converter = new JitEmitterVisitor();
    var /** @type {?} */ ctx = EmitterVisitorContext.createRoot([resultVar]);
    converter.visitAllStatements(statements, ctx);
    return evalExpression(sourceUrl, resultVar, ctx.toSource(), converter.getArgs());
}
var JitEmitterVisitor = (function (_super) {
    __extends(JitEmitterVisitor, _super);
    function JitEmitterVisitor() {
        _super.apply(this, arguments);
        this._evalArgNames = [];
        this._evalArgValues = [];
    }
    /**
     * @return {?}
     */
    JitEmitterVisitor.prototype.getArgs = function () {
        var /** @type {?} */ result = {};
        for (var /** @type {?} */ i = 0; i < this._evalArgNames.length; i++) {
            result[this._evalArgNames[i]] = this._evalArgValues[i];
        }
        return result;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    JitEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
        var /** @type {?} */ value = ast.value.reference;
        var /** @type {?} */ id = this._evalArgValues.indexOf(value);
        if (id === -1) {
            id = this._evalArgValues.length;
            this._evalArgValues.push(value);
            var /** @type {?} */ name_1 = identifierName(ast.value) || 'val';
            this._evalArgNames.push("jit_" + name_1 + id);
        }
        ctx.print(this._evalArgNames[id]);
        return null;
    };
    return JitEmitterVisitor;
}(AbstractJsEmitterVisitor));
function JitEmitterVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    JitEmitterVisitor.prototype._evalArgNames;
    /** @type {?} */
    JitEmitterVisitor.prototype._evalArgValues;
}
//# sourceMappingURL=output_jit.js.map