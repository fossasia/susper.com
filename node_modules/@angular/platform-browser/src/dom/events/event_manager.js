/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, NgZone, OpaqueToken } from '@angular/core';
import { getDOM } from '../dom_adapter';
/**
 * @stable
 */
export var /** @type {?} */ EVENT_MANAGER_PLUGINS = new OpaqueToken('EventManagerPlugins');
/**
 * @stable
 */
export var EventManager = (function () {
    /**
     * @param {?} plugins
     * @param {?} _zone
     */
    function EventManager(plugins, _zone) {
        var _this = this;
        this._zone = _zone;
        this._eventNameToPlugin = new Map();
        plugins.forEach(function (p) { return p.manager = _this; });
        this._plugins = plugins.slice().reverse();
    }
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManager.prototype.addEventListener = function (element, eventName, handler) {
        var /** @type {?} */ plugin = this._findPluginFor(eventName);
        return plugin.addEventListener(element, eventName, handler);
    };
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManager.prototype.addGlobalEventListener = function (target, eventName, handler) {
        var /** @type {?} */ plugin = this._findPluginFor(eventName);
        return plugin.addGlobalEventListener(target, eventName, handler);
    };
    /**
     * @return {?}
     */
    EventManager.prototype.getZone = function () { return this._zone; };
    /**
     * @param {?} eventName
     * @return {?}
     */
    EventManager.prototype._findPluginFor = function (eventName) {
        var /** @type {?} */ plugin = this._eventNameToPlugin.get(eventName);
        if (plugin) {
            return plugin;
        }
        var /** @type {?} */ plugins = this._plugins;
        for (var /** @type {?} */ i = 0; i < plugins.length; i++) {
            var /** @type {?} */ plugin_1 = plugins[i];
            if (plugin_1.supports(eventName)) {
                this._eventNameToPlugin.set(eventName, plugin_1);
                return plugin_1;
            }
        }
        throw new Error("No event manager plugin found for event " + eventName);
    };
    EventManager.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EventManager.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: Inject, args: [EVENT_MANAGER_PLUGINS,] },] },
        { type: NgZone, },
    ]; };
    return EventManager;
}());
function EventManager_tsickle_Closure_declarations() {
    /** @type {?} */
    EventManager.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    EventManager.ctorParameters;
    /** @type {?} */
    EventManager.prototype._plugins;
    /** @type {?} */
    EventManager.prototype._eventNameToPlugin;
    /** @type {?} */
    EventManager.prototype._zone;
}
/**
 * @abstract
 */
export var EventManagerPlugin = (function () {
    function EventManagerPlugin() {
    }
    /**
     * @abstract
     * @param {?} eventName
     * @return {?}
     */
    EventManagerPlugin.prototype.supports = function (eventName) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManagerPlugin.prototype.addEventListener = function (element, eventName, handler) { };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManagerPlugin.prototype.addGlobalEventListener = function (element, eventName, handler) {
        var /** @type {?} */ target = getDOM().getGlobalEventTarget(element);
        if (!target) {
            throw new Error("Unsupported event target " + target + " for event " + eventName);
        }
        return this.addEventListener(target, eventName, handler);
    };
    ;
    return EventManagerPlugin;
}());
function EventManagerPlugin_tsickle_Closure_declarations() {
    /** @type {?} */
    EventManagerPlugin.prototype.manager;
}
//# sourceMappingURL=event_manager.js.map