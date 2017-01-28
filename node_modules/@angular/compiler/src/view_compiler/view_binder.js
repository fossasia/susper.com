/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { tokenReference } from '../compile_metadata';
import { templateVisitAll } from '../template_parser/template_ast';
import { bindOutputs } from './event_binder';
import { bindDirectiveAfterContentLifecycleCallbacks, bindDirectiveAfterViewLifecycleCallbacks, bindDirectiveWrapperLifecycleCallbacks, bindInjectableDestroyLifecycleCallbacks, bindPipeDestroyLifecycleCallbacks } from './lifecycle_binder';
import { bindDirectiveHostProps, bindDirectiveInputs, bindRenderInputs, bindRenderText } from './property_binder';
/**
 * @param {?} view
 * @param {?} parsedTemplate
 * @param {?} schemaRegistry
 * @return {?}
 */
export function bindView(view, parsedTemplate, schemaRegistry) {
    var /** @type {?} */ visitor = new ViewBinderVisitor(view, schemaRegistry);
    templateVisitAll(visitor, parsedTemplate);
    view.pipes.forEach(function (pipe) { bindPipeDestroyLifecycleCallbacks(pipe.meta, pipe.instance, pipe.view); });
}
var ViewBinderVisitor = (function () {
    /**
     * @param {?} view
     * @param {?} _schemaRegistry
     */
    function ViewBinderVisitor(view, _schemaRegistry) {
        this.view = view;
        this._schemaRegistry = _schemaRegistry;
        this._nodeIndex = 0;
    }
    /**
     * @param {?} ast
     * @param {?} parent
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitBoundText = function (ast, parent) {
        var /** @type {?} */ node = this.view.nodes[this._nodeIndex++];
        bindRenderText(ast, node, this.view);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} parent
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitText = function (ast, parent) {
        this._nodeIndex++;
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} parent
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitNgContent = function (ast, parent) { return null; };
    /**
     * @param {?} ast
     * @param {?} parent
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitElement = function (ast, parent) {
        var _this = this;
        var /** @type {?} */ compileElement = (this.view.nodes[this._nodeIndex++]);
        var /** @type {?} */ hasEvents = bindOutputs(ast.outputs, ast.directives, compileElement, true);
        bindRenderInputs(ast.inputs, ast.outputs, hasEvents, compileElement);
        ast.directives.forEach(function (directiveAst, dirIndex) {
            var /** @type {?} */ directiveWrapperInstance = compileElement.directiveWrapperInstance.get(directiveAst.directive.type.reference);
            bindDirectiveInputs(directiveAst, directiveWrapperInstance, dirIndex, compileElement);
            bindDirectiveHostProps(directiveAst, directiveWrapperInstance, compileElement, ast.name, _this._schemaRegistry);
        });
        templateVisitAll(this, ast.children, compileElement);
        // afterContent and afterView lifecycles need to be called bottom up
        // so that children are notified before parents
        ast.directives.forEach(function (directiveAst) {
            var /** @type {?} */ directiveInstance = compileElement.instances.get(directiveAst.directive.type.reference);
            var /** @type {?} */ directiveWrapperInstance = compileElement.directiveWrapperInstance.get(directiveAst.directive.type.reference);
            bindDirectiveAfterContentLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            bindDirectiveAfterViewLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            bindDirectiveWrapperLifecycleCallbacks(directiveAst, directiveWrapperInstance, compileElement);
        });
        ast.providers.forEach(function (providerAst) {
            var /** @type {?} */ providerInstance = compileElement.instances.get(tokenReference(providerAst.token));
            bindInjectableDestroyLifecycleCallbacks(providerAst, providerInstance, compileElement);
        });
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} parent
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitEmbeddedTemplate = function (ast, parent) {
        var /** @type {?} */ compileElement = (this.view.nodes[this._nodeIndex++]);
        bindOutputs(ast.outputs, ast.directives, compileElement, false);
        ast.directives.forEach(function (directiveAst, dirIndex) {
            var /** @type {?} */ directiveInstance = compileElement.instances.get(directiveAst.directive.type.reference);
            var /** @type {?} */ directiveWrapperInstance = compileElement.directiveWrapperInstance.get(directiveAst.directive.type.reference);
            bindDirectiveInputs(directiveAst, directiveWrapperInstance, dirIndex, compileElement);
            bindDirectiveAfterContentLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            bindDirectiveAfterViewLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            bindDirectiveWrapperLifecycleCallbacks(directiveAst, directiveWrapperInstance, compileElement);
        });
        ast.providers.forEach(function (providerAst) {
            var /** @type {?} */ providerInstance = compileElement.instances.get(tokenReference(providerAst.token));
            bindInjectableDestroyLifecycleCallbacks(providerAst, providerInstance, compileElement);
        });
        bindView(compileElement.embeddedView, ast.children, this._schemaRegistry);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitAttr = function (ast, ctx) { return null; };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitDirective = function (ast, ctx) { return null; };
    /**
     * @param {?} ast
     * @param {?} eventTargetAndNames
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitEvent = function (ast, eventTargetAndNames) {
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitReference = function (ast, ctx) { return null; };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitVariable = function (ast, ctx) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitDirectiveProperty = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBinderVisitor.prototype.visitElementProperty = function (ast, context) { return null; };
    return ViewBinderVisitor;
}());
function ViewBinderVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewBinderVisitor.prototype._nodeIndex;
    /** @type {?} */
    ViewBinderVisitor.prototype.view;
    /** @type {?} */
    ViewBinderVisitor.prototype._schemaRegistry;
}
//# sourceMappingURL=view_binder.js.map