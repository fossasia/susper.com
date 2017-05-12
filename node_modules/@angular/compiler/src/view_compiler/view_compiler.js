/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CompilerConfig } from '../config';
import { CompilerInjectable } from '../injectable';
import { ElementSchemaRegistry } from '../schema/element_schema_registry';
import { CompileElement } from './compile_element';
import { CompileView } from './compile_view';
import { bindView } from './view_binder';
import { buildView, finishView } from './view_builder';
export { ComponentFactoryDependency, DirectiveWrapperDependency, ViewClassDependency } from './deps';
export var ViewCompileResult = (function () {
    /**
     * @param {?} statements
     * @param {?} viewClassVar
     * @param {?} dependencies
     */
    function ViewCompileResult(statements, viewClassVar, dependencies) {
        this.statements = statements;
        this.viewClassVar = viewClassVar;
        this.dependencies = dependencies;
    }
    return ViewCompileResult;
}());
function ViewCompileResult_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewCompileResult.prototype.statements;
    /** @type {?} */
    ViewCompileResult.prototype.viewClassVar;
    /** @type {?} */
    ViewCompileResult.prototype.dependencies;
}
export var ViewCompiler = (function () {
    /**
     * @param {?} _genConfig
     * @param {?} _schemaRegistry
     */
    function ViewCompiler(_genConfig, _schemaRegistry) {
        this._genConfig = _genConfig;
        this._schemaRegistry = _schemaRegistry;
    }
    /**
     * @param {?} component
     * @param {?} template
     * @param {?} styles
     * @param {?} pipes
     * @param {?} compiledAnimations
     * @return {?}
     */
    ViewCompiler.prototype.compileComponent = function (component, template, styles, pipes, compiledAnimations) {
        var /** @type {?} */ dependencies = [];
        var /** @type {?} */ view = new CompileView(component, this._genConfig, pipes, styles, compiledAnimations, 0, CompileElement.createNull(), [], dependencies);
        var /** @type {?} */ statements = [];
        buildView(view, template, dependencies);
        // Need to separate binding from creation to be able to refer to
        // variables that have been declared after usage.
        bindView(view, template, this._schemaRegistry);
        finishView(view, statements);
        return new ViewCompileResult(statements, view.classExpr.name, dependencies);
    };
    ViewCompiler = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [CompilerConfig, ElementSchemaRegistry])
    ], ViewCompiler);
    return ViewCompiler;
}());
function ViewCompiler_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewCompiler.prototype._genConfig;
    /** @type {?} */
    ViewCompiler.prototype._schemaRegistry;
}
//# sourceMappingURL=view_compiler.js.map