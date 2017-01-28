/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DirectiveWrapperExpressions } from '../directive_wrapper_compiler';
import * as o from '../output/output_ast';
import { LifecycleHooks } from '../private_import_core';
import { ProviderAstType } from '../template_parser/template_ast';
import { DetectChangesVars } from './constants';
var /** @type {?} */ STATE_IS_NEVER_CHECKED = o.THIS_EXPR.prop('numberOfChecks').identical(new o.LiteralExpr(0));
var /** @type {?} */ NOT_THROW_ON_CHANGES = o.not(DetectChangesVars.throwOnChange);
/**
 * @param {?} directiveMeta
 * @param {?} directiveInstance
 * @param {?} compileElement
 * @return {?}
 */
export function bindDirectiveAfterContentLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
    var /** @type {?} */ view = compileElement.view;
    var /** @type {?} */ lifecycleHooks = directiveMeta.type.lifecycleHooks;
    var /** @type {?} */ afterContentLifecycleCallbacksMethod = view.afterContentLifecycleCallbacksMethod;
    afterContentLifecycleCallbacksMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    if (lifecycleHooks.indexOf(LifecycleHooks.AfterContentInit) !== -1) {
        afterContentLifecycleCallbacksMethod.addStmt(new o.IfStmt(STATE_IS_NEVER_CHECKED, [directiveInstance.callMethod('ngAfterContentInit', []).toStmt()]));
    }
    if (lifecycleHooks.indexOf(LifecycleHooks.AfterContentChecked) !== -1) {
        afterContentLifecycleCallbacksMethod.addStmt(directiveInstance.callMethod('ngAfterContentChecked', []).toStmt());
    }
}
/**
 * @param {?} directiveMeta
 * @param {?} directiveInstance
 * @param {?} compileElement
 * @return {?}
 */
export function bindDirectiveAfterViewLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
    var /** @type {?} */ view = compileElement.view;
    var /** @type {?} */ lifecycleHooks = directiveMeta.type.lifecycleHooks;
    var /** @type {?} */ afterViewLifecycleCallbacksMethod = view.afterViewLifecycleCallbacksMethod;
    afterViewLifecycleCallbacksMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    if (lifecycleHooks.indexOf(LifecycleHooks.AfterViewInit) !== -1) {
        afterViewLifecycleCallbacksMethod.addStmt(new o.IfStmt(STATE_IS_NEVER_CHECKED, [directiveInstance.callMethod('ngAfterViewInit', []).toStmt()]));
    }
    if (lifecycleHooks.indexOf(LifecycleHooks.AfterViewChecked) !== -1) {
        afterViewLifecycleCallbacksMethod.addStmt(directiveInstance.callMethod('ngAfterViewChecked', []).toStmt());
    }
}
/**
 * @param {?} dir
 * @param {?} directiveWrapperIntance
 * @param {?} compileElement
 * @return {?}
 */
export function bindDirectiveWrapperLifecycleCallbacks(dir, directiveWrapperIntance, compileElement) {
    compileElement.view.destroyMethod.addStmts(DirectiveWrapperExpressions.ngOnDestroy(dir.directive, directiveWrapperIntance));
    compileElement.view.detachMethod.addStmts(DirectiveWrapperExpressions.ngOnDetach(dir.hostProperties, directiveWrapperIntance, o.THIS_EXPR, compileElement.compViewExpr || o.THIS_EXPR, compileElement.renderNode));
}
/**
 * @param {?} provider
 * @param {?} providerInstance
 * @param {?} compileElement
 * @return {?}
 */
export function bindInjectableDestroyLifecycleCallbacks(provider, providerInstance, compileElement) {
    var /** @type {?} */ onDestroyMethod = compileElement.view.destroyMethod;
    onDestroyMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    if (provider.providerType !== ProviderAstType.Directive &&
        provider.providerType !== ProviderAstType.Component &&
        provider.lifecycleHooks.indexOf(LifecycleHooks.OnDestroy) !== -1) {
        onDestroyMethod.addStmt(providerInstance.callMethod('ngOnDestroy', []).toStmt());
    }
}
/**
 * @param {?} pipeMeta
 * @param {?} pipeInstance
 * @param {?} view
 * @return {?}
 */
export function bindPipeDestroyLifecycleCallbacks(pipeMeta, pipeInstance, view) {
    var /** @type {?} */ onDestroyMethod = view.destroyMethod;
    if (pipeMeta.type.lifecycleHooks.indexOf(LifecycleHooks.OnDestroy) !== -1) {
        onDestroyMethod.addStmt(pipeInstance.callMethod('ngOnDestroy', []).toStmt());
    }
}
//# sourceMappingURL=lifecycle_binder.js.map