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
import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { getDOM } from '../../dom/dom_adapter';
import { supportsState } from './history';
/**
 *  `PlatformLocation` encapsulates all of the direct calls to platform APIs.
  * This class should not be used directly by an application developer. Instead, use
  * {@link Location}.
 */
export var BrowserPlatformLocation = (function (_super) {
    __extends(BrowserPlatformLocation, _super);
    function BrowserPlatformLocation() {
        _super.call(this);
        this._init();
    }
    /**
     * @return {?}
     */
    BrowserPlatformLocation.prototype._init = function () {
        this._location = getDOM().getLocation();
        this._history = getDOM().getHistory();
    };
    Object.defineProperty(BrowserPlatformLocation.prototype, "location", {
        /**
         * @return {?}
         */
        get: function () { return this._location; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    BrowserPlatformLocation.prototype.getBaseHrefFromDOM = function () { return getDOM().getBaseHref(); };
    /**
     * @param {?} fn
     * @return {?}
     */
    BrowserPlatformLocation.prototype.onPopState = function (fn) {
        getDOM().getGlobalEventTarget('window').addEventListener('popstate', fn, false);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    BrowserPlatformLocation.prototype.onHashChange = function (fn) {
        getDOM().getGlobalEventTarget('window').addEventListener('hashchange', fn, false);
    };
    Object.defineProperty(BrowserPlatformLocation.prototype, "pathname", {
        /**
         * @return {?}
         */
        get: function () { return this._location.pathname; },
        /**
         * @param {?} newPath
         * @return {?}
         */
        set: function (newPath) { this._location.pathname = newPath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserPlatformLocation.prototype, "search", {
        /**
         * @return {?}
         */
        get: function () { return this._location.search; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserPlatformLocation.prototype, "hash", {
        /**
         * @return {?}
         */
        get: function () { return this._location.hash; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} url
     * @return {?}
     */
    BrowserPlatformLocation.prototype.pushState = function (state, title, url) {
        if (supportsState()) {
            this._history.pushState(state, title, url);
        }
        else {
            this._location.hash = url;
        }
    };
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} url
     * @return {?}
     */
    BrowserPlatformLocation.prototype.replaceState = function (state, title, url) {
        if (supportsState()) {
            this._history.replaceState(state, title, url);
        }
        else {
            this._location.hash = url;
        }
    };
    /**
     * @return {?}
     */
    BrowserPlatformLocation.prototype.forward = function () { this._history.forward(); };
    /**
     * @return {?}
     */
    BrowserPlatformLocation.prototype.back = function () { this._history.back(); };
    BrowserPlatformLocation.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BrowserPlatformLocation.ctorParameters = function () { return []; };
    return BrowserPlatformLocation;
}(PlatformLocation));
function BrowserPlatformLocation_tsickle_Closure_declarations() {
    /** @type {?} */
    BrowserPlatformLocation.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BrowserPlatformLocation.ctorParameters;
    /** @type {?} */
    BrowserPlatformLocation.prototype._location;
    /** @type {?} */
    BrowserPlatformLocation.prototype._history;
}
//# sourceMappingURL=browser_platform_location.js.map