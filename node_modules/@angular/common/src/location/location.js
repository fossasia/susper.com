/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, Injectable } from '@angular/core';
import { LocationStrategy } from './location_strategy';
/**
 *  Depending on which {@link LocationStrategy} is used, `Location` will either persist
  * to the URL's path or the URL's hash segment.
  * *
  * Note: it's better to use {@link Router#navigate} service to trigger route changes. Use
  * `Location` only if you need to interact with or create normalized URLs outside of
  * routing.
  * *
  * `Location` is responsible for normalizing the URL against the application's base href.
  * A normalized URL is absolute from the URL host, includes the application's base href, and has no
  * trailing slash:
  * - `/my/app/user/123` is normalized
  * - `my/app/user/123` **is not** normalized
  * - `/my/app/user/123/` **is not** normalized
  * *
  * ### Example
  * {@example common/location/ts/path_location_component.ts region='LocationComponent'}
 */
export var Location = (function () {
    /**
     * @param {?} platformStrategy
     */
    function Location(platformStrategy) {
        var _this = this;
        /** @internal */
        this._subject = new EventEmitter();
        this._platformStrategy = platformStrategy;
        var browserBaseHref = this._platformStrategy.getBaseHref();
        this._baseHref = Location.stripTrailingSlash(_stripIndexHtml(browserBaseHref));
        this._platformStrategy.onPopState(function (ev) {
            _this._subject.emit({
                'url': _this.path(true),
                'pop': true,
                'type': ev.type,
            });
        });
    }
    /**
     * @param {?=} includeHash
     * @return {?}
     */
    Location.prototype.path = function (includeHash) {
        if (includeHash === void 0) { includeHash = false; }
        return this.normalize(this._platformStrategy.path(includeHash));
    };
    /**
     *  Normalizes the given path and compares to the current normalized path.
     * @param {?} path
     * @param {?=} query
     * @return {?}
     */
    Location.prototype.isCurrentPathEqualTo = function (path, query) {
        if (query === void 0) { query = ''; }
        return this.path() == this.normalize(path + Location.normalizeQueryParams(query));
    };
    /**
     *  Given a string representing a URL, returns the normalized URL path without leading or
      * trailing slashes.
     * @param {?} url
     * @return {?}
     */
    Location.prototype.normalize = function (url) {
        return Location.stripTrailingSlash(_stripBaseHref(this._baseHref, _stripIndexHtml(url)));
    };
    /**
     *  Given a string representing a URL, returns the platform-specific external URL path.
      * If the given URL doesn't begin with a leading slash (`'/'`), this method adds one
      * before normalizing. This method will also add a hash if `HashLocationStrategy` is
      * used, or the `APP_BASE_HREF` if the `PathLocationStrategy` is in use.
     * @param {?} url
     * @return {?}
     */
    Location.prototype.prepareExternalUrl = function (url) {
        if (url && url[0] !== '/') {
            url = '/' + url;
        }
        return this._platformStrategy.prepareExternalUrl(url);
    };
    /**
     *  Changes the browsers URL to the normalized version of the given URL, and pushes a
      * new item onto the platform's history.
     * @param {?} path
     * @param {?=} query
     * @return {?}
     */
    Location.prototype.go = function (path, query) {
        if (query === void 0) { query = ''; }
        this._platformStrategy.pushState(null, '', path, query);
    };
    /**
     *  Changes the browsers URL to the normalized version of the given URL, and replaces
      * the top item on the platform's history stack.
     * @param {?} path
     * @param {?=} query
     * @return {?}
     */
    Location.prototype.replaceState = function (path, query) {
        if (query === void 0) { query = ''; }
        this._platformStrategy.replaceState(null, '', path, query);
    };
    /**
     *  Navigates forward in the platform's history.
     * @return {?}
     */
    Location.prototype.forward = function () { this._platformStrategy.forward(); };
    /**
     *  Navigates back in the platform's history.
     * @return {?}
     */
    Location.prototype.back = function () { this._platformStrategy.back(); };
    /**
     *  Subscribe to the platform's `popState` events.
     * @param {?} onNext
     * @param {?=} onThrow
     * @param {?=} onReturn
     * @return {?}
     */
    Location.prototype.subscribe = function (onNext, onThrow, onReturn) {
        if (onThrow === void 0) { onThrow = null; }
        if (onReturn === void 0) { onReturn = null; }
        return this._subject.subscribe({ next: onNext, error: onThrow, complete: onReturn });
    };
    /**
     *  Given a string of url parameters, prepend with '?' if needed, otherwise return parameters as
      * is.
     * @param {?} params
     * @return {?}
     */
    Location.normalizeQueryParams = function (params) {
        return params && params[0] !== '?' ? '?' + params : params;
    };
    /**
     *  Given 2 parts of a url, join them with a slash if needed.
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    Location.joinWithSlash = function (start, end) {
        if (start.length == 0) {
            return end;
        }
        if (end.length == 0) {
            return start;
        }
        var /** @type {?} */ slashes = 0;
        if (start.endsWith('/')) {
            slashes++;
        }
        if (end.startsWith('/')) {
            slashes++;
        }
        if (slashes == 2) {
            return start + end.substring(1);
        }
        if (slashes == 1) {
            return start + end;
        }
        return start + '/' + end;
    };
    /**
     *  If url has a trailing slash, remove it, otherwise return url as is.
     * @param {?} url
     * @return {?}
     */
    Location.stripTrailingSlash = function (url) { return url.replace(/\/$/, ''); };
    Location.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Location.ctorParameters = function () { return [
        { type: LocationStrategy, },
    ]; };
    return Location;
}());
function Location_tsickle_Closure_declarations() {
    /** @type {?} */
    Location.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Location.ctorParameters;
    /** @type {?} */
    Location.prototype._subject;
    /** @type {?} */
    Location.prototype._baseHref;
    /** @type {?} */
    Location.prototype._platformStrategy;
}
/**
 * @param {?} baseHref
 * @param {?} url
 * @return {?}
 */
function _stripBaseHref(baseHref, url) {
    return baseHref && url.startsWith(baseHref) ? url.substring(baseHref.length) : url;
}
/**
 * @param {?} url
 * @return {?}
 */
function _stripIndexHtml(url) {
    return url.replace(/\/index.html$/, '');
}
//# sourceMappingURL=location.js.map