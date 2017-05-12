/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { tokenReference } from '../compile_metadata';
import { createPureProxy } from '../compiler_util/identifier_util';
import { Identifiers, createIdentifier, resolveIdentifier } from '../identifiers';
import * as o from '../output/output_ast';
import { getPropertyInView, injectFromViewParentInjector } from './util';
export var CompilePipe = (function () {
    /**
     * @param {?} view
     * @param {?} meta
     */
    function CompilePipe(view, meta) {
        var _this = this;
        this.view = view;
        this.meta = meta;
        this._purePipeProxyCount = 0;
        this.instance = o.THIS_EXPR.prop("_pipe_" + meta.name + "_" + view.pipeCount++);
        var deps = this.meta.type.diDeps.map(function (diDep) {
            if (tokenReference(diDep.token) === resolveIdentifier(Identifiers.ChangeDetectorRef)) {
                return getPropertyInView(o.THIS_EXPR.prop('ref'), _this.view, _this.view.componentView);
            }
            return injectFromViewParentInjector(view, diDep.token, false);
        });
        this.view.fields.push(new o.ClassField(this.instance.name, o.importType(this.meta.type)));
        this.view.createMethod.resetDebugInfo(null, null);
        this.view.createMethod.addStmt(o.THIS_EXPR.prop(this.instance.name)
            .set(o.importExpr(this.meta.type).instantiate(deps))
            .toStmt());
    }
    /**
     * @param {?} view
     * @param {?} name
     * @param {?} args
     * @return {?}
     */
    CompilePipe.call = function (view, name, args) {
        var /** @type {?} */ compView = view.componentView;
        var /** @type {?} */ meta = _findPipeMeta(compView, name);
        var /** @type {?} */ pipe;
        if (meta.pure) {
            // pure pipes live on the component view
            pipe = compView.purePipes.get(name);
            if (!pipe) {
                pipe = new CompilePipe(compView, meta);
                compView.purePipes.set(name, pipe);
                compView.pipes.push(pipe);
            }
        }
        else {
            // Non pure pipes live on the view that called it
            pipe = new CompilePipe(view, meta);
            view.pipes.push(pipe);
        }
        return pipe._call(view, args);
    };
    Object.defineProperty(CompilePipe.prototype, "pure", {
        /**
         * @return {?}
         */
        get: function () { return this.meta.pure; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} callingView
     * @param {?} args
     * @return {?}
     */
    CompilePipe.prototype._call = function (callingView, args) {
        if (this.meta.pure) {
            // PurePipeProxies live on the view that called them.
            var /** @type {?} */ purePipeProxyInstance = o.THIS_EXPR.prop(this.instance.name + "_" + this._purePipeProxyCount++);
            var /** @type {?} */ pipeInstanceSeenFromPureProxy = getPropertyInView(this.instance, callingView, this.view);
            createPureProxy(pipeInstanceSeenFromPureProxy.prop('transform')
                .callMethod(o.BuiltinMethod.Bind, [pipeInstanceSeenFromPureProxy]), args.length, purePipeProxyInstance, { fields: callingView.fields, ctorStmts: callingView.createMethod });
            return o.importExpr(createIdentifier(Identifiers.castByValue))
                .callFn([purePipeProxyInstance, pipeInstanceSeenFromPureProxy.prop('transform')])
                .callFn(args);
        }
        else {
            return getPropertyInView(this.instance, callingView, this.view).callMethod('transform', args);
        }
    };
    return CompilePipe;
}());
function CompilePipe_tsickle_Closure_declarations() {
    /** @type {?} */
    CompilePipe.prototype.instance;
    /** @type {?} */
    CompilePipe.prototype._purePipeProxyCount;
    /** @type {?} */
    CompilePipe.prototype.view;
    /** @type {?} */
    CompilePipe.prototype.meta;
}
/**
 * @param {?} view
 * @param {?} name
 * @return {?}
 */
function _findPipeMeta(view, name) {
    var /** @type {?} */ pipeMeta = null;
    for (var /** @type {?} */ i = view.pipeMetas.length - 1; i >= 0; i--) {
        var /** @type {?} */ localPipeMeta = view.pipeMetas[i];
        if (localPipeMeta.name == name) {
            pipeMeta = localPipeMeta;
            break;
        }
    }
    if (!pipeMeta) {
        throw new Error("Illegal state: Could not find pipe " + name + " although the parser should have detected this error!");
    }
    return pipeMeta;
}
//# sourceMappingURL=compile_pipe.js.map