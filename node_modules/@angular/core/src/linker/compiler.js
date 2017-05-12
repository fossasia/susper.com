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
import { Injectable, OpaqueToken } from '../di';
import { BaseError } from '../facade/errors';
import { stringify } from '../facade/lang';
/**
 *  Indicates that a component is still being loaded in a synchronous compile.
  * *
 */
export var ComponentStillLoadingError = (function (_super) {
    __extends(ComponentStillLoadingError, _super);
    /**
     * @param {?} compType
     */
    function ComponentStillLoadingError(compType) {
        _super.call(this, "Can't compile synchronously as " + stringify(compType) + " is still being loaded!");
        this.compType = compType;
    }
    return ComponentStillLoadingError;
}(BaseError));
function ComponentStillLoadingError_tsickle_Closure_declarations() {
    /** @type {?} */
    ComponentStillLoadingError.prototype.compType;
}
/**
 *  Combination of NgModuleFactory and ComponentFactorys.
  * *
 */
export var ModuleWithComponentFactories = (function () {
    /**
     * @param {?} ngModuleFactory
     * @param {?} componentFactories
     */
    function ModuleWithComponentFactories(ngModuleFactory, componentFactories) {
        this.ngModuleFactory = ngModuleFactory;
        this.componentFactories = componentFactories;
    }
    return ModuleWithComponentFactories;
}());
function ModuleWithComponentFactories_tsickle_Closure_declarations() {
    /** @type {?} */
    ModuleWithComponentFactories.prototype.ngModuleFactory;
    /** @type {?} */
    ModuleWithComponentFactories.prototype.componentFactories;
}
/**
 * @return {?}
 */
function _throwError() {
    throw new Error("Runtime compiler is not loaded");
}
/**
 *  Low-level service for running the angular compiler during runtime
  * to create {@link ComponentFactory}s, which
  * can later be used to create and render a Component instance.
  * *
  * Each `@NgModule` provides an own `Compiler` to its injector,
  * that will use the directives/pipes of the ng module for compilation
  * of components.
 */
export var Compiler = (function () {
    function Compiler() {
    }
    /**
     *  Compiles the given NgModule and all of its components. All templates of the components listed
      * in `entryComponents`
      * have to be inlined. Otherwise throws a {@link ComponentStillLoadingError}.
     * @param {?} moduleType
     * @return {?}
     */
    Compiler.prototype.compileModuleSync = function (moduleType) { throw _throwError(); };
    /**
     *  Compiles the given NgModule and all of its components
     * @param {?} moduleType
     * @return {?}
     */
    Compiler.prototype.compileModuleAsync = function (moduleType) { throw _throwError(); };
    /**
     *  Same as {@link compileModuleSync} but also creates ComponentFactories for all components.
     * @param {?} moduleType
     * @return {?}
     */
    Compiler.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        throw _throwError();
    };
    /**
     *  Same as {@link compileModuleAsync} but also creates ComponentFactories for all components.
     * @param {?} moduleType
     * @return {?}
     */
    Compiler.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        throw _throwError();
    };
    /**
     *  Exposes the CSS-style selectors that have been used in `ngContent` directives within
      * the template of the given component.
      * This is used by the `upgrade` library to compile the appropriate transclude content
      * in the Angular 1 wrapper component.
     * @param {?} component
     * @return {?}
     */
    Compiler.prototype.getNgContentSelectors = function (component) { throw _throwError(); };
    /**
     *  Clears all caches.
     * @return {?}
     */
    Compiler.prototype.clearCache = function () { };
    /**
     *  Clears the cache for the given component/ngModule.
     * @param {?} type
     * @return {?}
     */
    Compiler.prototype.clearCacheFor = function (type) { };
    Compiler.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Compiler.ctorParameters = function () { return []; };
    return Compiler;
}());
function Compiler_tsickle_Closure_declarations() {
    /** @type {?} */
    Compiler.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Compiler.ctorParameters;
}
/**
 * Token to provide CompilerOptions in the platform injector.
 *
 * @experimental
 */
export var /** @type {?} */ COMPILER_OPTIONS = new OpaqueToken('compilerOptions');
/**
 *  A factory for creating a Compiler
  * *
 * @abstract
 */
export var CompilerFactory = (function () {
    function CompilerFactory() {
    }
    /**
     * @abstract
     * @param {?=} options
     * @return {?}
     */
    CompilerFactory.prototype.createCompiler = function (options) { };
    return CompilerFactory;
}());
//# sourceMappingURL=compiler.js.map