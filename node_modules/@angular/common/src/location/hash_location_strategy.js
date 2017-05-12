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
import { Inject, Injectable, Optional } from '@angular/core';
import { isPresent } from '../facade/lang';
import { Location } from './location';
import { APP_BASE_HREF, LocationStrategy } from './location_strategy';
import { PlatformLocation } from './platform_location';
/**
 *  `HashLocationStrategy` is a {@link LocationStrategy} used to configure the
  * {@link Location} service to represent its state in the
  * [hash fragment](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax)
  * of the browser's URL.
  * *
  * For instance, if you call `location.go('/foo')`, the browser's URL will become
  * `example.com#/foo`.
  * *
  * ### Example
  * *
  * {@example common/location/ts/hash_location_component.ts region='LocationComponent'}
  * *
 */
export var HashLocationStrategy = (function (_super) {
    __extends(HashLocationStrategy, _super);
    /**
     * @param {?} _platformLocation
     * @param {?=} _baseHref
     */
    function HashLocationStrategy(_platformLocation, _baseHref) {
        _super.call(this);
        this._platformLocation = _platformLocation;
        this._baseHref = '';
        if (isPresent(_baseHref)) {
            this._baseHref = _baseHref;
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    HashLocationStrategy.prototype.onPopState = function (fn) {
        this._platformLocation.onPopState(fn);
        this._platformLocation.onHashChange(fn);
    };
    /**
     * @return {?}
     */
    HashLocationStrategy.prototype.getBaseHref = function () { return this._baseHref; };
    /**
     * @param {?=} includeHash
     * @return {?}
     */
    HashLocationStrategy.prototype.path = function (includeHash) {
        if (includeHash === void 0) { includeHash = false; }
        // the hash value is always prefixed with a `#`
        // and if it is empty then it will stay empty
        var /** @type {?} */ path = this._platformLocation.hash;
        if (!isPresent(path))
            path = '#';
        return path.length > 0 ? path.substring(1) : path;
    };
    /**
     * @param {?} internal
     * @return {?}
     */
    HashLocationStrategy.prototype.prepareExternalUrl = function (internal) {
        var /** @type {?} */ url = Location.joinWithSlash(this._baseHref, internal);
        return url.length > 0 ? ('#' + url) : url;
    };
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} path
     * @param {?} queryParams
     * @return {?}
     */
    HashLocationStrategy.prototype.pushState = function (state, title, path, queryParams) {
        var /** @type {?} */ url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this._platformLocation.pathname;
        }
        this._platformLocation.pushState(state, title, url);
    };
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} path
     * @param {?} queryParams
     * @return {?}
     */
    HashLocationStrategy.prototype.replaceState = function (state, title, path, queryParams) {
        var /** @type {?} */ url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this._platformLocation.pathname;
        }
        this._platformLocation.replaceState(state, title, url);
    };
    /**
     * @return {?}
     */
    HashLocationStrategy.prototype.forward = function () { this._platformLocation.forward(); };
    /**
     * @return {?}
     */
    HashLocationStrategy.prototype.back = function () { this._platformLocation.back(); };
    HashLocationStrategy.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    HashLocationStrategy.ctorParameters = function () { return [
        { type: PlatformLocation, },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [APP_BASE_HREF,] },] },
    ]; };
    return HashLocationStrategy;
}(LocationStrategy));
function HashLocationStrategy_tsickle_Closure_declarations() {
    /** @type {?} */
    HashLocationStrategy.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    HashLocationStrategy.ctorParameters;
    /** @type {?} */
    HashLocationStrategy.prototype._baseHref;
    /** @type {?} */
    HashLocationStrategy.prototype._platformLocation;
}
//# sourceMappingURL=hash_location_strategy.js.map