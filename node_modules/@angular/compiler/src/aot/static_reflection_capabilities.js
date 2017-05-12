/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ReflectionCapabilities, reflector } from '../private_import_core';
export var StaticAndDynamicReflectionCapabilities = (function () {
    /**
     * @param {?} staticDelegate
     */
    function StaticAndDynamicReflectionCapabilities(staticDelegate) {
        this.staticDelegate = staticDelegate;
        this.dynamicDelegate = new ReflectionCapabilities();
    }
    /**
     * @param {?} staticDelegate
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.install = function (staticDelegate) {
        reflector.updateCapabilities(new StaticAndDynamicReflectionCapabilities(staticDelegate));
    };
    /**
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.isReflectionEnabled = function () { return true; };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.factory = function (type) { return this.dynamicDelegate.factory(type); };
    /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.hasLifecycleHook = function (type, lcProperty) {
        return isStaticType(type) ? this.staticDelegate.hasLifecycleHook(type, lcProperty) :
            this.dynamicDelegate.hasLifecycleHook(type, lcProperty);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.parameters = function (type) {
        return isStaticType(type) ? this.staticDelegate.parameters(type) :
            this.dynamicDelegate.parameters(type);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.annotations = function (type) {
        return isStaticType(type) ? this.staticDelegate.annotations(type) :
            this.dynamicDelegate.annotations(type);
    };
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.propMetadata = function (typeOrFunc) {
        return isStaticType(typeOrFunc) ? this.staticDelegate.propMetadata(typeOrFunc) :
            this.dynamicDelegate.propMetadata(typeOrFunc);
    };
    /**
     * @param {?} name
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.getter = function (name) { return this.dynamicDelegate.getter(name); };
    /**
     * @param {?} name
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.setter = function (name) { return this.dynamicDelegate.setter(name); };
    /**
     * @param {?} name
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.method = function (name) { return this.dynamicDelegate.method(name); };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.importUri = function (type) { return this.staticDelegate.importUri(type); };
    /**
     * @param {?} name
     * @param {?} moduleUrl
     * @param {?} runtime
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.resolveIdentifier = function (name, moduleUrl, runtime) {
        return this.staticDelegate.resolveIdentifier(name, moduleUrl);
    };
    /**
     * @param {?} enumIdentifier
     * @param {?} name
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.resolveEnum = function (enumIdentifier, name) {
        if (isStaticType(enumIdentifier)) {
            return this.staticDelegate.resolveEnum(enumIdentifier, name);
        }
        else {
            return null;
        }
    };
    return StaticAndDynamicReflectionCapabilities;
}());
function StaticAndDynamicReflectionCapabilities_tsickle_Closure_declarations() {
    /** @type {?} */
    StaticAndDynamicReflectionCapabilities.prototype.dynamicDelegate;
    /** @type {?} */
    StaticAndDynamicReflectionCapabilities.prototype.staticDelegate;
}
/**
 * @param {?} type
 * @return {?}
 */
function isStaticType(type) {
    return typeof type === 'object' && type.name && type.filePath;
}
//# sourceMappingURL=static_reflection_capabilities.js.map