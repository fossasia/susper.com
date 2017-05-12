/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPresent } from '../facade/lang';
import * as o from '../output/output_ast';
var _DebugState = (function () {
    /**
     * @param {?} nodeIndex
     * @param {?} sourceAst
     */
    function _DebugState(nodeIndex, sourceAst) {
        this.nodeIndex = nodeIndex;
        this.sourceAst = sourceAst;
    }
    return _DebugState;
}());
function _DebugState_tsickle_Closure_declarations() {
    /** @type {?} */
    _DebugState.prototype.nodeIndex;
    /** @type {?} */
    _DebugState.prototype.sourceAst;
}
var /** @type {?} */ NULL_DEBUG_STATE = new _DebugState(null, null);
export var CompileMethod = (function () {
    /**
     * @param {?} _view
     */
    function CompileMethod(_view) {
        this._view = _view;
        this._newState = NULL_DEBUG_STATE;
        this._currState = NULL_DEBUG_STATE;
        this._bodyStatements = [];
        this._debugEnabled = this._view.genConfig.genDebugInfo;
    }
    /**
     * @return {?}
     */
    CompileMethod.prototype._updateDebugContextIfNeeded = function () {
        if (this._newState.nodeIndex !== this._currState.nodeIndex ||
            this._newState.sourceAst !== this._currState.sourceAst) {
            var /** @type {?} */ expr = this._updateDebugContext(this._newState);
            if (isPresent(expr)) {
                this._bodyStatements.push(expr.toStmt());
            }
        }
    };
    /**
     * @param {?} newState
     * @return {?}
     */
    CompileMethod.prototype._updateDebugContext = function (newState) {
        this._currState = this._newState = newState;
        if (this._debugEnabled) {
            var /** @type {?} */ sourceLocation = isPresent(newState.sourceAst) ? newState.sourceAst.sourceSpan.start : null;
            return o.THIS_EXPR.callMethod('debug', [
                o.literal(newState.nodeIndex),
                isPresent(sourceLocation) ? o.literal(sourceLocation.line) : o.NULL_EXPR,
                isPresent(sourceLocation) ? o.literal(sourceLocation.col) : o.NULL_EXPR
            ]);
        }
        else {
            return null;
        }
    };
    /**
     * @param {?} nodeIndex
     * @param {?} templateAst
     * @return {?}
     */
    CompileMethod.prototype.resetDebugInfoExpr = function (nodeIndex, templateAst) {
        var /** @type {?} */ res = this._updateDebugContext(new _DebugState(nodeIndex, templateAst));
        return res || o.NULL_EXPR;
    };
    /**
     * @param {?} nodeIndex
     * @param {?} templateAst
     * @return {?}
     */
    CompileMethod.prototype.resetDebugInfo = function (nodeIndex, templateAst) {
        this._newState = new _DebugState(nodeIndex, templateAst);
    };
    /**
     * @param {...?} stmts
     * @return {?}
     */
    CompileMethod.prototype.push = function () {
        var stmts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stmts[_i - 0] = arguments[_i];
        }
        this.addStmts(stmts);
    };
    /**
     * @param {?} stmt
     * @return {?}
     */
    CompileMethod.prototype.addStmt = function (stmt) {
        this._updateDebugContextIfNeeded();
        this._bodyStatements.push(stmt);
    };
    /**
     * @param {?} stmts
     * @return {?}
     */
    CompileMethod.prototype.addStmts = function (stmts) {
        this._updateDebugContextIfNeeded();
        (_a = this._bodyStatements).push.apply(_a, stmts);
        var _a;
    };
    /**
     * @return {?}
     */
    CompileMethod.prototype.finish = function () { return this._bodyStatements; };
    /**
     * @return {?}
     */
    CompileMethod.prototype.isEmpty = function () { return this._bodyStatements.length === 0; };
    return CompileMethod;
}());
function CompileMethod_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileMethod.prototype._newState;
    /** @type {?} */
    CompileMethod.prototype._currState;
    /** @type {?} */
    CompileMethod.prototype._debugEnabled;
    /** @type {?} */
    CompileMethod.prototype._bodyStatements;
    /** @type {?} */
    CompileMethod.prototype._view;
}
//# sourceMappingURL=compile_method.js.map