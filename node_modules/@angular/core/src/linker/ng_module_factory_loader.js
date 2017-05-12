/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 *  Used to load ng module factories.
 * @abstract
 */
export var NgModuleFactoryLoader = (function () {
    function NgModuleFactoryLoader() {
    }
    /**
     * @abstract
     * @param {?} path
     * @return {?}
     */
    NgModuleFactoryLoader.prototype.load = function (path) { };
    return NgModuleFactoryLoader;
}());
var /** @type {?} */ moduleFactories = new Map();
/**
 *  Registers a loaded module. Should only be called from generated NgModuleFactory code.
 * @param {?} id
 * @param {?} factory
 * @return {?}
 */
export function registerModuleFactory(id, factory) {
    var /** @type {?} */ existing = moduleFactories.get(id);
    if (existing) {
        throw new Error("Duplicate module registered for " + id + " - " + existing.moduleType.name + " vs " + factory.moduleType.name);
    }
    moduleFactories.set(id, factory);
}
/**
 * @return {?}
 */
export function clearModulesForTest() {
    moduleFactories = new Map();
}
/**
 *  Returns the NgModuleFactory with the given id, if it exists and has been loaded.
  * Factories for modules that do not specify an `id` cannot be retrieved. Throws if the module
  * cannot be found.
 * @param {?} id
 * @return {?}
 */
export function getModuleFactory(id) {
    var /** @type {?} */ factory = moduleFactories.get(id);
    if (!factory)
        throw new Error("No module with ID " + id + " loaded");
    return factory;
}
//# sourceMappingURL=ng_module_factory_loader.js.map