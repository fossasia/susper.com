/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Compiler, OpaqueToken } from '@angular/core';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { flatten, wrapIntoObservable } from './utils/collection';
/**
 * @experimental
 */
export var /** @type {?} */ ROUTES = new OpaqueToken('ROUTES');
export var LoadedRouterConfig = (function () {
    /**
     * @param {?} routes
     * @param {?} injector
     * @param {?} factoryResolver
     * @param {?} injectorFactory
     */
    function LoadedRouterConfig(routes, injector, factoryResolver, injectorFactory) {
        this.routes = routes;
        this.injector = injector;
        this.factoryResolver = factoryResolver;
        this.injectorFactory = injectorFactory;
    }
    return LoadedRouterConfig;
}());
function LoadedRouterConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    LoadedRouterConfig.prototype.routes;
    /** @type {?} */
    LoadedRouterConfig.prototype.injector;
    /** @type {?} */
    LoadedRouterConfig.prototype.factoryResolver;
    /** @type {?} */
    LoadedRouterConfig.prototype.injectorFactory;
}
export var RouterConfigLoader = (function () {
    /**
     * @param {?} loader
     * @param {?} compiler
     */
    function RouterConfigLoader(loader, compiler) {
        this.loader = loader;
        this.compiler = compiler;
    }
    /**
     * @param {?} parentInjector
     * @param {?} loadChildren
     * @return {?}
     */
    RouterConfigLoader.prototype.load = function (parentInjector, loadChildren) {
        return map.call(this.loadModuleFactory(loadChildren), function (r) {
            var /** @type {?} */ ref = r.create(parentInjector);
            var /** @type {?} */ injectorFactory = function (parent) { return r.create(parent).injector; };
            return new LoadedRouterConfig(flatten(ref.injector.get(ROUTES)), ref.injector, ref.componentFactoryResolver, injectorFactory);
        });
    };
    /**
     * @param {?} loadChildren
     * @return {?}
     */
    RouterConfigLoader.prototype.loadModuleFactory = function (loadChildren) {
        var _this = this;
        if (typeof loadChildren === 'string') {
            return fromPromise(this.loader.load(loadChildren));
        }
        else {
            var /** @type {?} */ offlineMode_1 = this.compiler instanceof Compiler;
            return mergeMap.call(wrapIntoObservable(loadChildren()), function (t) { return offlineMode_1 ? of(/** @type {?} */ (t)) : fromPromise(_this.compiler.compileModuleAsync(t)); });
        }
    };
    return RouterConfigLoader;
}());
function RouterConfigLoader_tsickle_Closure_declarations() {
    /** @type {?} */
    RouterConfigLoader.prototype.loader;
    /** @type {?} */
    RouterConfigLoader.prototype.compiler;
}
//# sourceMappingURL=router_config_loader.js.map