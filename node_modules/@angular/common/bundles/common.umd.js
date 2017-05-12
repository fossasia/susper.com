/**
 * @license Angular v2.4.0
 * (c) 2010-2016 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
    (factory((global.ng = global.ng || {}, global.ng.common = global.ng.common || {}),global.ng.core));
}(this, function (exports,_angular_core) { 'use strict';

    /**
     *  This class should not be used directly by an application developer. Instead, use
      * {@link Location}.
      * *
      * `PlatformLocation` encapsulates all calls to DOM apis, which allows the Router to be platform
      * agnostic.
      * This means that we can have different implementation of `PlatformLocation` for the different
      * platforms
      * that angular supports. For example, the default `PlatformLocation` is {@link
      * BrowserPlatformLocation},
      * however when you run your app in a WebWorker you use {@link WebWorkerPlatformLocation}.
      * *
      * The `PlatformLocation` class is used directly by all implementations of {@link LocationStrategy}
      * when
      * they need to interact with the DOM apis like pushState, popState, etc...
      * *
      * {@link LocationStrategy} in turn is used by the {@link Location} service which is used directly
      * by
      * the {@link Router} in order to navigate between routes. Since all interactions between {@link
      * Router} /
      * {@link Location} / {@link LocationStrategy} and DOM apis flow through the `PlatformLocation`
      * class
      * they are all platform independent.
      * *
     * @abstract
     */
    var PlatformLocation = (function () {
        function PlatformLocation() {
        }
        /**
         * @abstract
         * @return {?}
         */
        PlatformLocation.prototype.getBaseHrefFromDOM = function () { };
        /**
         * @abstract
         * @param {?} fn
         * @return {?}
         */
        PlatformLocation.prototype.onPopState = function (fn) { };
        /**
         * @abstract
         * @param {?} fn
         * @return {?}
         */
        PlatformLocation.prototype.onHashChange = function (fn) { };
        Object.defineProperty(PlatformLocation.prototype, "pathname", {
            /**
             * @return {?}
             */
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformLocation.prototype, "search", {
            /**
             * @return {?}
             */
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformLocation.prototype, "hash", {
            /**
             * @return {?}
             */
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        /**
         * @abstract
         * @param {?} state
         * @param {?} title
         * @param {?} url
         * @return {?}
         */
        PlatformLocation.prototype.replaceState = function (state, title, url) { };
        /**
         * @abstract
         * @param {?} state
         * @param {?} title
         * @param {?} url
         * @return {?}
         */
        PlatformLocation.prototype.pushState = function (state, title, url) { };
        /**
         * @abstract
         * @return {?}
         */
        PlatformLocation.prototype.forward = function () { };
        /**
         * @abstract
         * @return {?}
         */
        PlatformLocation.prototype.back = function () { };
        return PlatformLocation;
    }());

    /**
     *  `LocationStrategy` is responsible for representing and reading route state
      * from the browser's URL. Angular provides two strategies:
      * {@link HashLocationStrategy} and {@link PathLocationStrategy}.
      * *
      * This is used under the hood of the {@link Location} service.
      * *
      * Applications should use the {@link Router} or {@link Location} services to
      * interact with application route state.
      * *
      * For instance, {@link HashLocationStrategy} produces URLs like
      * `http://example.com#/foo`, and {@link PathLocationStrategy} produces
      * `http://example.com/foo` as an equivalent URL.
      * *
      * See these two classes for more.
      * *
     * @abstract
     */
    var LocationStrategy = (function () {
        function LocationStrategy() {
        }
        /**
         * @abstract
         * @param {?=} includeHash
         * @return {?}
         */
        LocationStrategy.prototype.path = function (includeHash) { };
        /**
         * @abstract
         * @param {?} internal
         * @return {?}
         */
        LocationStrategy.prototype.prepareExternalUrl = function (internal) { };
        /**
         * @abstract
         * @param {?} state
         * @param {?} title
         * @param {?} url
         * @param {?} queryParams
         * @return {?}
         */
        LocationStrategy.prototype.pushState = function (state, title, url, queryParams) { };
        /**
         * @abstract
         * @param {?} state
         * @param {?} title
         * @param {?} url
         * @param {?} queryParams
         * @return {?}
         */
        LocationStrategy.prototype.replaceState = function (state, title, url, queryParams) { };
        /**
         * @abstract
         * @return {?}
         */
        LocationStrategy.prototype.forward = function () { };
        /**
         * @abstract
         * @return {?}
         */
        LocationStrategy.prototype.back = function () { };
        /**
         * @abstract
         * @param {?} fn
         * @return {?}
         */
        LocationStrategy.prototype.onPopState = function (fn) { };
        /**
         * @abstract
         * @return {?}
         */
        LocationStrategy.prototype.getBaseHref = function () { };
        return LocationStrategy;
    }());
    /**
     * The `APP_BASE_HREF` token represents the base href to be used with the
     * {@link PathLocationStrategy}.
     *
     * If you're using {@link PathLocationStrategy}, you must provide a provider to a string
     * representing the URL prefix that should be preserved when generating and recognizing
     * URLs.
     *
     * ### Example
     *
     * ```typescript
     * import {Component, NgModule} from '@angular/core';
     * import {APP_BASE_HREF} from '@angular/common';
     *
     * @NgModule({
     *   providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}]
     * })
     * class AppModule {}
     * ```
     *
     * @stable
     */
    var /** @type {?} */ APP_BASE_HREF = new _angular_core.OpaqueToken('appBaseHref');

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var /** @type {?} */ globalScope;
    if (typeof window === 'undefined') {
        if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
            // TODO: Replace any with WorkerGlobalScope from lib.webworker.d.ts #3492
            globalScope = (self);
        }
        else {
            globalScope = (global);
        }
    }
    else {
        globalScope = (window);
    }
    // Need to declare a new variable for global here since TypeScript
    // exports the original value of the symbol.
    var /** @type {?} */ _global = globalScope;
    /**
     * @param {?} type
     * @return {?}
     */
    function getTypeNameForDebugging(type) {
        return type['name'] || typeof type;
    }
    // TODO: remove calls to assert in production environment
    // Note: Can't just export this and import in in other files
    // as `assert` is a reserved keyword in Dart
    _global.assert = function assert(condition) {
        // TODO: to be fixed properly via #2830, noop for now
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    function isPresent(obj) {
        return obj != null;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    function isBlank(obj) {
        return obj == null;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    function isDate(obj) {
        return obj instanceof Date && !isNaN(obj.valueOf());
    }
    /**
     * @param {?} token
     * @return {?}
     */
    function stringify(token) {
        if (typeof token === 'string') {
            return token;
        }
        if (token == null) {
            return '' + token;
        }
        if (token.overriddenName) {
            return "" + token.overriddenName;
        }
        if (token.name) {
            return "" + token.name;
        }
        var /** @type {?} */ res = token.toString();
        var /** @type {?} */ newLineIndex = res.indexOf('\n');
        return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
    }
    var NumberWrapper = (function () {
        function NumberWrapper() {
        }
        /**
         * @param {?} text
         * @return {?}
         */
        NumberWrapper.parseIntAutoRadix = function (text) {
            var /** @type {?} */ result = parseInt(text);
            if (isNaN(result)) {
                throw new Error('Invalid integer literal when parsing ' + text);
            }
            return result;
        };
        /**
         * @param {?} value
         * @return {?}
         */
        NumberWrapper.isNumeric = function (value) { return !isNaN(value - parseFloat(value)); };
        return NumberWrapper;
    }());
    /**
     * @param {?} o
     * @return {?}
     */
    function isJsObject(o) {
        return o !== null && (typeof o === 'function' || typeof o === 'object');
    }
    var /** @type {?} */ _symbolIterator = null;
    /**
     * @return {?}
     */
    function getSymbolIterator() {
        if (!_symbolIterator) {
            if (((globalScope)).Symbol && Symbol.iterator) {
                _symbolIterator = Symbol.iterator;
            }
            else {
                // es6-shim specific logic
                var /** @type {?} */ keys = Object.getOwnPropertyNames(Map.prototype);
                for (var /** @type {?} */ i = 0; i < keys.length; ++i) {
                    var /** @type {?} */ key = keys[i];
                    if (key !== 'entries' && key !== 'size' &&
                        ((Map)).prototype[key] === Map.prototype['entries']) {
                        _symbolIterator = key;
                    }
                }
            }
        }
        return _symbolIterator;
    }

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
    var Location = (function () {
        /**
         * @param {?} platformStrategy
         */
        function Location(platformStrategy) {
            var _this = this;
            /** @internal */
            this._subject = new _angular_core.EventEmitter();
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
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        Location.ctorParameters = function () { return [
            { type: LocationStrategy, },
        ]; };
        return Location;
    }());
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
    var HashLocationStrategy = (function (_super) {
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
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        HashLocationStrategy.ctorParameters = function () { return [
            { type: PlatformLocation, },
            { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [APP_BASE_HREF,] },] },
        ]; };
        return HashLocationStrategy;
    }(LocationStrategy));

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __extends$1 = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     *  `PathLocationStrategy` is a {@link LocationStrategy} used to configure the
      * {@link Location} service to represent its state in the
      * [path](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax) of the
      * browser's URL.
      * *
      * If you're using `PathLocationStrategy`, you must provide a {@link APP_BASE_HREF}
      * or add a base element to the document. This URL prefix that will be preserved
      * when generating and recognizing URLs.
      * *
      * For instance, if you provide an `APP_BASE_HREF` of `'/my/app'` and call
      * `location.go('/foo')`, the browser's URL will become
      * `example.com/my/app/foo`.
      * *
      * Similarly, if you add `<base href='/my/app'/>` to the document and call
      * `location.go('/foo')`, the browser's URL will become
      * `example.com/my/app/foo`.
      * *
      * ### Example
      * *
      * {@example common/location/ts/path_location_component.ts region='LocationComponent'}
      * *
     */
    var PathLocationStrategy = (function (_super) {
        __extends$1(PathLocationStrategy, _super);
        /**
         * @param {?} _platformLocation
         * @param {?=} href
         */
        function PathLocationStrategy(_platformLocation, href) {
            _super.call(this);
            this._platformLocation = _platformLocation;
            if (isBlank(href)) {
                href = this._platformLocation.getBaseHrefFromDOM();
            }
            if (isBlank(href)) {
                throw new Error("No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.");
            }
            this._baseHref = href;
        }
        /**
         * @param {?} fn
         * @return {?}
         */
        PathLocationStrategy.prototype.onPopState = function (fn) {
            this._platformLocation.onPopState(fn);
            this._platformLocation.onHashChange(fn);
        };
        /**
         * @return {?}
         */
        PathLocationStrategy.prototype.getBaseHref = function () { return this._baseHref; };
        /**
         * @param {?} internal
         * @return {?}
         */
        PathLocationStrategy.prototype.prepareExternalUrl = function (internal) {
            return Location.joinWithSlash(this._baseHref, internal);
        };
        /**
         * @param {?=} includeHash
         * @return {?}
         */
        PathLocationStrategy.prototype.path = function (includeHash) {
            if (includeHash === void 0) { includeHash = false; }
            var /** @type {?} */ pathname = this._platformLocation.pathname +
                Location.normalizeQueryParams(this._platformLocation.search);
            var /** @type {?} */ hash = this._platformLocation.hash;
            return hash && includeHash ? "" + pathname + hash : pathname;
        };
        /**
         * @param {?} state
         * @param {?} title
         * @param {?} url
         * @param {?} queryParams
         * @return {?}
         */
        PathLocationStrategy.prototype.pushState = function (state, title, url, queryParams) {
            var /** @type {?} */ externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
            this._platformLocation.pushState(state, title, externalUrl);
        };
        /**
         * @param {?} state
         * @param {?} title
         * @param {?} url
         * @param {?} queryParams
         * @return {?}
         */
        PathLocationStrategy.prototype.replaceState = function (state, title, url, queryParams) {
            var /** @type {?} */ externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
            this._platformLocation.replaceState(state, title, externalUrl);
        };
        /**
         * @return {?}
         */
        PathLocationStrategy.prototype.forward = function () { this._platformLocation.forward(); };
        /**
         * @return {?}
         */
        PathLocationStrategy.prototype.back = function () { this._platformLocation.back(); };
        PathLocationStrategy.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        PathLocationStrategy.ctorParameters = function () { return [
            { type: PlatformLocation, },
            { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [APP_BASE_HREF,] },] },
        ]; };
        return PathLocationStrategy;
    }(LocationStrategy));

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __extends$2 = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * @abstract
     */
    var NgLocalization = (function () {
        function NgLocalization() {
        }
        /**
         * @abstract
         * @param {?} value
         * @return {?}
         */
        NgLocalization.prototype.getPluralCategory = function (value) { };
        return NgLocalization;
    }());
    /**
     *  Returns the plural category for a given value.
      * - "=value" when the case exists,
      * - the plural category otherwise
      * *
     * @param {?} value
     * @param {?} cases
     * @param {?} ngLocalization
     * @return {?}
     */
    function getPluralCategory(value, cases, ngLocalization) {
        var /** @type {?} */ key = "=" + value;
        if (cases.indexOf(key) > -1) {
            return key;
        }
        key = ngLocalization.getPluralCategory(value);
        if (cases.indexOf(key) > -1) {
            return key;
        }
        if (cases.indexOf('other') > -1) {
            return 'other';
        }
        throw new Error("No plural message found for value \"" + value + "\"");
    }
    /**
     *  Returns the plural case based on the locale
      * *
     */
    var NgLocaleLocalization = (function (_super) {
        __extends$2(NgLocaleLocalization, _super);
        /**
         * @param {?} _locale
         */
        function NgLocaleLocalization(_locale) {
            _super.call(this);
            this._locale = _locale;
        }
        /**
         * @param {?} value
         * @return {?}
         */
        NgLocaleLocalization.prototype.getPluralCategory = function (value) {
            var /** @type {?} */ plural = getPluralCase(this._locale, value);
            switch (plural) {
                case Plural.Zero:
                    return 'zero';
                case Plural.One:
                    return 'one';
                case Plural.Two:
                    return 'two';
                case Plural.Few:
                    return 'few';
                case Plural.Many:
                    return 'many';
                default:
                    return 'other';
            }
        };
        NgLocaleLocalization.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        NgLocaleLocalization.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_core.LOCALE_ID,] },] },
        ]; };
        return NgLocaleLocalization;
    }(NgLocalization));
    var Plural = {};
    Plural.Zero = 0;
    Plural.One = 1;
    Plural.Two = 2;
    Plural.Few = 3;
    Plural.Many = 4;
    Plural.Other = 5;
    Plural[Plural.Zero] = "Zero";
    Plural[Plural.One] = "One";
    Plural[Plural.Two] = "Two";
    Plural[Plural.Few] = "Few";
    Plural[Plural.Many] = "Many";
    Plural[Plural.Other] = "Other";
    /**
     *  Returns the plural case based on the locale
      * *
     * @param {?} locale
     * @param {?} nLike
     * @return {?}
     */
    function getPluralCase(locale, nLike) {
        // TODO(vicb): lazy compute
        if (typeof nLike === 'string') {
            nLike = parseInt(/** @type {?} */ (nLike), 10);
        }
        var /** @type {?} */ n = (nLike);
        var /** @type {?} */ nDecimal = n.toString().replace(/^[^.]*\.?/, '');
        var /** @type {?} */ i = Math.floor(Math.abs(n));
        var /** @type {?} */ v = nDecimal.length;
        var /** @type {?} */ f = parseInt(nDecimal, 10);
        var /** @type {?} */ t = parseInt(n.toString().replace(/^[^.]*\.?|0+$/g, ''), 10) || 0;
        var /** @type {?} */ lang = locale.split('-')[0].toLowerCase();
        switch (lang) {
            case 'af':
            case 'asa':
            case 'az':
            case 'bem':
            case 'bez':
            case 'bg':
            case 'brx':
            case 'ce':
            case 'cgg':
            case 'chr':
            case 'ckb':
            case 'ee':
            case 'el':
            case 'eo':
            case 'es':
            case 'eu':
            case 'fo':
            case 'fur':
            case 'gsw':
            case 'ha':
            case 'haw':
            case 'hu':
            case 'jgo':
            case 'jmc':
            case 'ka':
            case 'kk':
            case 'kkj':
            case 'kl':
            case 'ks':
            case 'ksb':
            case 'ky':
            case 'lb':
            case 'lg':
            case 'mas':
            case 'mgo':
            case 'ml':
            case 'mn':
            case 'nb':
            case 'nd':
            case 'ne':
            case 'nn':
            case 'nnh':
            case 'nyn':
            case 'om':
            case 'or':
            case 'os':
            case 'ps':
            case 'rm':
            case 'rof':
            case 'rwk':
            case 'saq':
            case 'seh':
            case 'sn':
            case 'so':
            case 'sq':
            case 'ta':
            case 'te':
            case 'teo':
            case 'tk':
            case 'tr':
            case 'ug':
            case 'uz':
            case 'vo':
            case 'vun':
            case 'wae':
            case 'xog':
                if (n === 1)
                    return Plural.One;
                return Plural.Other;
            case 'agq':
            case 'bas':
            case 'cu':
            case 'dav':
            case 'dje':
            case 'dua':
            case 'dyo':
            case 'ebu':
            case 'ewo':
            case 'guz':
            case 'kam':
            case 'khq':
            case 'ki':
            case 'kln':
            case 'kok':
            case 'ksf':
            case 'lrc':
            case 'lu':
            case 'luo':
            case 'luy':
            case 'mer':
            case 'mfe':
            case 'mgh':
            case 'mua':
            case 'mzn':
            case 'nmg':
            case 'nus':
            case 'qu':
            case 'rn':
            case 'rw':
            case 'sbp':
            case 'twq':
            case 'vai':
            case 'yav':
            case 'yue':
            case 'zgh':
            case 'ak':
            case 'ln':
            case 'mg':
            case 'pa':
            case 'ti':
                if (n === Math.floor(n) && n >= 0 && n <= 1)
                    return Plural.One;
                return Plural.Other;
            case 'am':
            case 'as':
            case 'bn':
            case 'fa':
            case 'gu':
            case 'hi':
            case 'kn':
            case 'mr':
            case 'zu':
                if (i === 0 || n === 1)
                    return Plural.One;
                return Plural.Other;
            case 'ar':
                if (n === 0)
                    return Plural.Zero;
                if (n === 1)
                    return Plural.One;
                if (n === 2)
                    return Plural.Two;
                if (n % 100 === Math.floor(n % 100) && n % 100 >= 3 && n % 100 <= 10)
                    return Plural.Few;
                if (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 99)
                    return Plural.Many;
                return Plural.Other;
            case 'ast':
            case 'ca':
            case 'de':
            case 'en':
            case 'et':
            case 'fi':
            case 'fy':
            case 'gl':
            case 'it':
            case 'nl':
            case 'sv':
            case 'sw':
            case 'ur':
            case 'yi':
                if (i === 1 && v === 0)
                    return Plural.One;
                return Plural.Other;
            case 'be':
                if (n % 10 === 1 && !(n % 100 === 11))
                    return Plural.One;
                if (n % 10 === Math.floor(n % 10) && n % 10 >= 2 && n % 10 <= 4 &&
                    !(n % 100 >= 12 && n % 100 <= 14))
                    return Plural.Few;
                if (n % 10 === 0 || n % 10 === Math.floor(n % 10) && n % 10 >= 5 && n % 10 <= 9 ||
                    n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 14)
                    return Plural.Many;
                return Plural.Other;
            case 'br':
                if (n % 10 === 1 && !(n % 100 === 11 || n % 100 === 71 || n % 100 === 91))
                    return Plural.One;
                if (n % 10 === 2 && !(n % 100 === 12 || n % 100 === 72 || n % 100 === 92))
                    return Plural.Two;
                if (n % 10 === Math.floor(n % 10) && (n % 10 >= 3 && n % 10 <= 4 || n % 10 === 9) &&
                    !(n % 100 >= 10 && n % 100 <= 19 || n % 100 >= 70 && n % 100 <= 79 ||
                        n % 100 >= 90 && n % 100 <= 99))
                    return Plural.Few;
                if (!(n === 0) && n % 1e6 === 0)
                    return Plural.Many;
                return Plural.Other;
            case 'bs':
            case 'hr':
            case 'sr':
                if (v === 0 && i % 10 === 1 && !(i % 100 === 11) || f % 10 === 1 && !(f % 100 === 11))
                    return Plural.One;
                if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 &&
                    !(i % 100 >= 12 && i % 100 <= 14) ||
                    f % 10 === Math.floor(f % 10) && f % 10 >= 2 && f % 10 <= 4 &&
                        !(f % 100 >= 12 && f % 100 <= 14))
                    return Plural.Few;
                return Plural.Other;
            case 'cs':
            case 'sk':
                if (i === 1 && v === 0)
                    return Plural.One;
                if (i === Math.floor(i) && i >= 2 && i <= 4 && v === 0)
                    return Plural.Few;
                if (!(v === 0))
                    return Plural.Many;
                return Plural.Other;
            case 'cy':
                if (n === 0)
                    return Plural.Zero;
                if (n === 1)
                    return Plural.One;
                if (n === 2)
                    return Plural.Two;
                if (n === 3)
                    return Plural.Few;
                if (n === 6)
                    return Plural.Many;
                return Plural.Other;
            case 'da':
                if (n === 1 || !(t === 0) && (i === 0 || i === 1))
                    return Plural.One;
                return Plural.Other;
            case 'dsb':
            case 'hsb':
                if (v === 0 && i % 100 === 1 || f % 100 === 1)
                    return Plural.One;
                if (v === 0 && i % 100 === 2 || f % 100 === 2)
                    return Plural.Two;
                if (v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 3 && i % 100 <= 4 ||
                    f % 100 === Math.floor(f % 100) && f % 100 >= 3 && f % 100 <= 4)
                    return Plural.Few;
                return Plural.Other;
            case 'ff':
            case 'fr':
            case 'hy':
            case 'kab':
                if (i === 0 || i === 1)
                    return Plural.One;
                return Plural.Other;
            case 'fil':
                if (v === 0 && (i === 1 || i === 2 || i === 3) ||
                    v === 0 && !(i % 10 === 4 || i % 10 === 6 || i % 10 === 9) ||
                    !(v === 0) && !(f % 10 === 4 || f % 10 === 6 || f % 10 === 9))
                    return Plural.One;
                return Plural.Other;
            case 'ga':
                if (n === 1)
                    return Plural.One;
                if (n === 2)
                    return Plural.Two;
                if (n === Math.floor(n) && n >= 3 && n <= 6)
                    return Plural.Few;
                if (n === Math.floor(n) && n >= 7 && n <= 10)
                    return Plural.Many;
                return Plural.Other;
            case 'gd':
                if (n === 1 || n === 11)
                    return Plural.One;
                if (n === 2 || n === 12)
                    return Plural.Two;
                if (n === Math.floor(n) && (n >= 3 && n <= 10 || n >= 13 && n <= 19))
                    return Plural.Few;
                return Plural.Other;
            case 'gv':
                if (v === 0 && i % 10 === 1)
                    return Plural.One;
                if (v === 0 && i % 10 === 2)
                    return Plural.Two;
                if (v === 0 &&
                    (i % 100 === 0 || i % 100 === 20 || i % 100 === 40 || i % 100 === 60 || i % 100 === 80))
                    return Plural.Few;
                if (!(v === 0))
                    return Plural.Many;
                return Plural.Other;
            case 'he':
                if (i === 1 && v === 0)
                    return Plural.One;
                if (i === 2 && v === 0)
                    return Plural.Two;
                if (v === 0 && !(n >= 0 && n <= 10) && n % 10 === 0)
                    return Plural.Many;
                return Plural.Other;
            case 'is':
                if (t === 0 && i % 10 === 1 && !(i % 100 === 11) || !(t === 0))
                    return Plural.One;
                return Plural.Other;
            case 'ksh':
                if (n === 0)
                    return Plural.Zero;
                if (n === 1)
                    return Plural.One;
                return Plural.Other;
            case 'kw':
            case 'naq':
            case 'se':
            case 'smn':
                if (n === 1)
                    return Plural.One;
                if (n === 2)
                    return Plural.Two;
                return Plural.Other;
            case 'lag':
                if (n === 0)
                    return Plural.Zero;
                if ((i === 0 || i === 1) && !(n === 0))
                    return Plural.One;
                return Plural.Other;
            case 'lt':
                if (n % 10 === 1 && !(n % 100 >= 11 && n % 100 <= 19))
                    return Plural.One;
                if (n % 10 === Math.floor(n % 10) && n % 10 >= 2 && n % 10 <= 9 &&
                    !(n % 100 >= 11 && n % 100 <= 19))
                    return Plural.Few;
                if (!(f === 0))
                    return Plural.Many;
                return Plural.Other;
            case 'lv':
            case 'prg':
                if (n % 10 === 0 || n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 19 ||
                    v === 2 && f % 100 === Math.floor(f % 100) && f % 100 >= 11 && f % 100 <= 19)
                    return Plural.Zero;
                if (n % 10 === 1 && !(n % 100 === 11) || v === 2 && f % 10 === 1 && !(f % 100 === 11) ||
                    !(v === 2) && f % 10 === 1)
                    return Plural.One;
                return Plural.Other;
            case 'mk':
                if (v === 0 && i % 10 === 1 || f % 10 === 1)
                    return Plural.One;
                return Plural.Other;
            case 'mt':
                if (n === 1)
                    return Plural.One;
                if (n === 0 || n % 100 === Math.floor(n % 100) && n % 100 >= 2 && n % 100 <= 10)
                    return Plural.Few;
                if (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 19)
                    return Plural.Many;
                return Plural.Other;
            case 'pl':
                if (i === 1 && v === 0)
                    return Plural.One;
                if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 &&
                    !(i % 100 >= 12 && i % 100 <= 14))
                    return Plural.Few;
                if (v === 0 && !(i === 1) && i % 10 === Math.floor(i % 10) && i % 10 >= 0 && i % 10 <= 1 ||
                    v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 ||
                    v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 12 && i % 100 <= 14)
                    return Plural.Many;
                return Plural.Other;
            case 'pt':
                if (n === Math.floor(n) && n >= 0 && n <= 2 && !(n === 2))
                    return Plural.One;
                return Plural.Other;
            case 'ro':
                if (i === 1 && v === 0)
                    return Plural.One;
                if (!(v === 0) || n === 0 ||
                    !(n === 1) && n % 100 === Math.floor(n % 100) && n % 100 >= 1 && n % 100 <= 19)
                    return Plural.Few;
                return Plural.Other;
            case 'ru':
            case 'uk':
                if (v === 0 && i % 10 === 1 && !(i % 100 === 11))
                    return Plural.One;
                if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 &&
                    !(i % 100 >= 12 && i % 100 <= 14))
                    return Plural.Few;
                if (v === 0 && i % 10 === 0 ||
                    v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 ||
                    v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 11 && i % 100 <= 14)
                    return Plural.Many;
                return Plural.Other;
            case 'shi':
                if (i === 0 || n === 1)
                    return Plural.One;
                if (n === Math.floor(n) && n >= 2 && n <= 10)
                    return Plural.Few;
                return Plural.Other;
            case 'si':
                if (n === 0 || n === 1 || i === 0 && f === 1)
                    return Plural.One;
                return Plural.Other;
            case 'sl':
                if (v === 0 && i % 100 === 1)
                    return Plural.One;
                if (v === 0 && i % 100 === 2)
                    return Plural.Two;
                if (v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 3 && i % 100 <= 4 || !(v === 0))
                    return Plural.Few;
                return Plural.Other;
            case 'tzm':
                if (n === Math.floor(n) && n >= 0 && n <= 1 || n === Math.floor(n) && n >= 11 && n <= 99)
                    return Plural.One;
                return Plural.Other;
            default:
                return Plural.Other;
        }
    }

    /**
     * @param {?} obj
     * @return {?}
     */
    function isListLikeIterable(obj) {
        if (!isJsObject(obj))
            return false;
        return Array.isArray(obj) ||
            (!(obj instanceof Map) &&
                getSymbolIterator() in obj); // JS Iterable have a Symbol.iterator prop
    }

    /**
     *  *
      * *
      * ```
      * <some-element [ngClass]="'first second'">...</some-element>
      * *
      * <some-element [ngClass]="['first', 'second']">...</some-element>
      * *
      * <some-element [ngClass]="{'first': true, 'second': true, 'third': false}">...</some-element>
      * *
      * <some-element [ngClass]="stringExp|arrayExp|objExp">...</some-element>
      * ```
      * *
      * *
      * The CSS classes are updated as follows, depending on the type of the expression evaluation:
      * - `string` - the CSS classes listed in the string (space delimited) are added,
      * - `Array` - the CSS classes declared as Array elements are added,
      * - `Object` - keys are CSS classes that get added when the expression given in the value
      * evaluates to a truthy value, otherwise they are removed.
      * *
     */
    var NgClass = (function () {
        /**
         * @param {?} _iterableDiffers
         * @param {?} _keyValueDiffers
         * @param {?} _ngEl
         * @param {?} _renderer
         */
        function NgClass(_iterableDiffers, _keyValueDiffers, _ngEl, _renderer) {
            this._iterableDiffers = _iterableDiffers;
            this._keyValueDiffers = _keyValueDiffers;
            this._ngEl = _ngEl;
            this._renderer = _renderer;
            this._initialClasses = [];
        }
        Object.defineProperty(NgClass.prototype, "klass", {
            /**
             * @param {?} v
             * @return {?}
             */
            set: function (v) {
                this._applyInitialClasses(true);
                this._initialClasses = typeof v === 'string' ? v.split(/\s+/) : [];
                this._applyInitialClasses(false);
                this._applyClasses(this._rawClass, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgClass.prototype, "ngClass", {
            /**
             * @param {?} v
             * @return {?}
             */
            set: function (v) {
                this._cleanupClasses(this._rawClass);
                this._iterableDiffer = null;
                this._keyValueDiffer = null;
                this._rawClass = typeof v === 'string' ? v.split(/\s+/) : v;
                if (this._rawClass) {
                    if (isListLikeIterable(this._rawClass)) {
                        this._iterableDiffer = this._iterableDiffers.find(this._rawClass).create(null);
                    }
                    else {
                        this._keyValueDiffer = this._keyValueDiffers.find(this._rawClass).create(null);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        NgClass.prototype.ngDoCheck = function () {
            if (this._iterableDiffer) {
                var /** @type {?} */ changes = this._iterableDiffer.diff(this._rawClass);
                if (changes) {
                    this._applyIterableChanges(changes);
                }
            }
            else if (this._keyValueDiffer) {
                var /** @type {?} */ changes = this._keyValueDiffer.diff(this._rawClass);
                if (changes) {
                    this._applyKeyValueChanges(changes);
                }
            }
        };
        /**
         * @param {?} rawClassVal
         * @return {?}
         */
        NgClass.prototype._cleanupClasses = function (rawClassVal) {
            this._applyClasses(rawClassVal, true);
            this._applyInitialClasses(false);
        };
        /**
         * @param {?} changes
         * @return {?}
         */
        NgClass.prototype._applyKeyValueChanges = function (changes) {
            var _this = this;
            changes.forEachAddedItem(function (record) { return _this._toggleClass(record.key, record.currentValue); });
            changes.forEachChangedItem(function (record) { return _this._toggleClass(record.key, record.currentValue); });
            changes.forEachRemovedItem(function (record) {
                if (record.previousValue) {
                    _this._toggleClass(record.key, false);
                }
            });
        };
        /**
         * @param {?} changes
         * @return {?}
         */
        NgClass.prototype._applyIterableChanges = function (changes) {
            var _this = this;
            changes.forEachAddedItem(function (record) {
                if (typeof record.item === 'string') {
                    _this._toggleClass(record.item, true);
                }
                else {
                    throw new Error("NgClass can only toggle CSS classes expressed as strings, got " + stringify(record.item));
                }
            });
            changes.forEachRemovedItem(function (record) { return _this._toggleClass(record.item, false); });
        };
        /**
         * @param {?} isCleanup
         * @return {?}
         */
        NgClass.prototype._applyInitialClasses = function (isCleanup) {
            var _this = this;
            this._initialClasses.forEach(function (klass) { return _this._toggleClass(klass, !isCleanup); });
        };
        /**
         * @param {?} rawClassVal
         * @param {?} isCleanup
         * @return {?}
         */
        NgClass.prototype._applyClasses = function (rawClassVal, isCleanup) {
            var _this = this;
            if (rawClassVal) {
                if (Array.isArray(rawClassVal) || rawClassVal instanceof Set) {
                    ((rawClassVal)).forEach(function (klass) { return _this._toggleClass(klass, !isCleanup); });
                }
                else {
                    Object.keys(rawClassVal).forEach(function (klass) {
                        if (isPresent(rawClassVal[klass]))
                            _this._toggleClass(klass, !isCleanup);
                    });
                }
            }
        };
        /**
         * @param {?} klass
         * @param {?} enabled
         * @return {?}
         */
        NgClass.prototype._toggleClass = function (klass, enabled) {
            var _this = this;
            klass = klass.trim();
            if (klass) {
                klass.split(/\s+/g).forEach(function (klass) { _this._renderer.setElementClass(_this._ngEl.nativeElement, klass, enabled); });
            }
        };
        NgClass.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngClass]' },] },
        ];
        /** @nocollapse */
        NgClass.ctorParameters = function () { return [
            { type: _angular_core.IterableDiffers, },
            { type: _angular_core.KeyValueDiffers, },
            { type: _angular_core.ElementRef, },
            { type: _angular_core.Renderer, },
        ]; };
        NgClass.propDecorators = {
            'klass': [{ type: _angular_core.Input, args: ['class',] },],
            'ngClass': [{ type: _angular_core.Input },],
        };
        return NgClass;
    }());

    var NgForRow = (function () {
        /**
         * @param {?} $implicit
         * @param {?} index
         * @param {?} count
         */
        function NgForRow($implicit, index, count) {
            this.$implicit = $implicit;
            this.index = index;
            this.count = count;
        }
        Object.defineProperty(NgForRow.prototype, "first", {
            /**
             * @return {?}
             */
            get: function () { return this.index === 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgForRow.prototype, "last", {
            /**
             * @return {?}
             */
            get: function () { return this.index === this.count - 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgForRow.prototype, "even", {
            /**
             * @return {?}
             */
            get: function () { return this.index % 2 === 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgForRow.prototype, "odd", {
            /**
             * @return {?}
             */
            get: function () { return !this.even; },
            enumerable: true,
            configurable: true
        });
        return NgForRow;
    }());
    /**
     *  The `NgFor` directive instantiates a template once per item from an iterable. The context for
      * each instantiated template inherits from the outer context with the given loop variable set
      * to the current item from the iterable.
      * *
      * ### Local Variables
      * *
      * `NgFor` provides several exported values that can be aliased to local variables:
      * *
      * * `index` will be set to the current loop iteration for each template context.
      * * `first` will be set to a boolean value indicating whether the item is the first one in the
      * iteration.
      * * `last` will be set to a boolean value indicating whether the item is the last one in the
      * iteration.
      * * `even` will be set to a boolean value indicating whether this item has an even index.
      * * `odd` will be set to a boolean value indicating whether this item has an odd index.
      * *
      * ### Change Propagation
      * *
      * When the contents of the iterator changes, `NgFor` makes the corresponding changes to the DOM:
      * *
      * * When an item is added, a new instance of the template is added to the DOM.
      * * When an item is removed, its template instance is removed from the DOM.
      * * When items are reordered, their respective templates are reordered in the DOM.
      * * Otherwise, the DOM element for that item will remain the same.
      * *
      * Angular uses object identity to track insertions and deletions within the iterator and reproduce
      * those changes in the DOM. This has important implications for animations and any stateful
      * controls
      * (such as `<input>` elements which accept user input) that are present. Inserted rows can be
      * animated in, deleted rows can be animated out, and unchanged rows retain any unsaved state such
      * as user input.
      * *
      * It is possible for the identities of elements in the iterator to change while the data does not.
      * This can happen, for example, if the iterator produced from an RPC to the server, and that
      * RPC is re-run. Even if the data hasn't changed, the second response will produce objects with
      * different identities, and Angular will tear down the entire DOM and rebuild it (as if all old
      * elements were deleted and all new elements inserted). This is an expensive operation and should
      * be avoided if possible.
      * *
      * To customize the default tracking algorithm, `NgFor` supports `trackBy` option.
      * `trackBy` takes a function which has two arguments: `index` and `item`.
      * If `trackBy` is given, Angular tracks changes by the return value of the function.
      * *
      * ### Syntax
      * *
      * - `<li *ngFor="let item of items; let i = index; trackBy: trackByFn">...</li>`
      * - `<li template="ngFor let item of items; let i = index; trackBy: trackByFn">...</li>`
      * *
      * With `<template>` element:
      * *
      * ```
      * <template ngFor let-item [ngForOf]="items" let-i="index" [ngForTrackBy]="trackByFn">
      * <li>...</li>
      * </template>
      * ```
      * *
      * ### Example
      * *
      * See a [live demo](http://plnkr.co/edit/KVuXxDp0qinGDyo307QW?p=preview) for a more detailed
      * example.
      * *
     */
    var NgFor = (function () {
        /**
         * @param {?} _viewContainer
         * @param {?} _template
         * @param {?} _differs
         * @param {?} _cdr
         */
        function NgFor(_viewContainer, _template, _differs, _cdr) {
            this._viewContainer = _viewContainer;
            this._template = _template;
            this._differs = _differs;
            this._cdr = _cdr;
            this._differ = null;
        }
        Object.defineProperty(NgFor.prototype, "ngForTemplate", {
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) {
                if (value) {
                    this._template = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} changes
         * @return {?}
         */
        NgFor.prototype.ngOnChanges = function (changes) {
            if ('ngForOf' in changes) {
                // React on ngForOf changes only once all inputs have been initialized
                var /** @type {?} */ value = changes['ngForOf'].currentValue;
                if (!this._differ && value) {
                    try {
                        this._differ = this._differs.find(value).create(this._cdr, this.ngForTrackBy);
                    }
                    catch (e) {
                        throw new Error("Cannot find a differ supporting object '" + value + "' of type '" + getTypeNameForDebugging(value) + "'. NgFor only supports binding to Iterables such as Arrays.");
                    }
                }
            }
        };
        /**
         * @return {?}
         */
        NgFor.prototype.ngDoCheck = function () {
            if (this._differ) {
                var /** @type {?} */ changes = this._differ.diff(this.ngForOf);
                if (changes)
                    this._applyChanges(changes);
            }
        };
        /**
         * @param {?} changes
         * @return {?}
         */
        NgFor.prototype._applyChanges = function (changes) {
            var _this = this;
            var /** @type {?} */ insertTuples = [];
            changes.forEachOperation(function (item, adjustedPreviousIndex, currentIndex) {
                if (item.previousIndex == null) {
                    var /** @type {?} */ view = _this._viewContainer.createEmbeddedView(_this._template, new NgForRow(null, null, null), currentIndex);
                    var /** @type {?} */ tuple = new RecordViewTuple(item, view);
                    insertTuples.push(tuple);
                }
                else if (currentIndex == null) {
                    _this._viewContainer.remove(adjustedPreviousIndex);
                }
                else {
                    var /** @type {?} */ view = _this._viewContainer.get(adjustedPreviousIndex);
                    _this._viewContainer.move(view, currentIndex);
                    var /** @type {?} */ tuple = new RecordViewTuple(item, /** @type {?} */ (view));
                    insertTuples.push(tuple);
                }
            });
            for (var /** @type {?} */ i = 0; i < insertTuples.length; i++) {
                this._perViewChange(insertTuples[i].view, insertTuples[i].record);
            }
            for (var /** @type {?} */ i = 0, /** @type {?} */ ilen = this._viewContainer.length; i < ilen; i++) {
                var /** @type {?} */ viewRef = (this._viewContainer.get(i));
                viewRef.context.index = i;
                viewRef.context.count = ilen;
            }
            changes.forEachIdentityChange(function (record) {
                var /** @type {?} */ viewRef = (_this._viewContainer.get(record.currentIndex));
                viewRef.context.$implicit = record.item;
            });
        };
        /**
         * @param {?} view
         * @param {?} record
         * @return {?}
         */
        NgFor.prototype._perViewChange = function (view, record) {
            view.context.$implicit = record.item;
        };
        NgFor.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngFor][ngForOf]' },] },
        ];
        /** @nocollapse */
        NgFor.ctorParameters = function () { return [
            { type: _angular_core.ViewContainerRef, },
            { type: _angular_core.TemplateRef, },
            { type: _angular_core.IterableDiffers, },
            { type: _angular_core.ChangeDetectorRef, },
        ]; };
        NgFor.propDecorators = {
            'ngForOf': [{ type: _angular_core.Input },],
            'ngForTrackBy': [{ type: _angular_core.Input },],
            'ngForTemplate': [{ type: _angular_core.Input },],
        };
        return NgFor;
    }());
    var RecordViewTuple = (function () {
        /**
         * @param {?} record
         * @param {?} view
         */
        function RecordViewTuple(record, view) {
            this.record = record;
            this.view = view;
        }
        return RecordViewTuple;
    }());

    /**
     *  Removes or recreates a portion of the DOM tree based on an {expression}.
      * *
      * If the expression assigned to `ngIf` evaluates to a falsy value then the element
      * is removed from the DOM, otherwise a clone of the element is reinserted into the DOM.
      * *
      * ### Example ([live demo](http://plnkr.co/edit/fe0kgemFBtmQOY31b4tw?p=preview)):
      * *
      * ```
      * <div *ngIf="errorCount > 0" class="error">
      * <!-- Error message displayed when the errorCount property in the current context is greater
      * than 0. -->
      * {{errorCount}} errors detected
      * </div>
      * ```
      * *
      * ### Syntax
      * *
      * - `<div *ngIf="condition">...</div>`
      * - `<div template="ngIf condition">...</div>`
      * - `<template [ngIf]="condition"><div>...</div></template>`
      * *
     */
    var NgIf = (function () {
        /**
         * @param {?} _viewContainer
         * @param {?} _template
         */
        function NgIf(_viewContainer, _template) {
            this._viewContainer = _viewContainer;
            this._template = _template;
            this._hasView = false;
        }
        Object.defineProperty(NgIf.prototype, "ngIf", {
            /**
             * @param {?} condition
             * @return {?}
             */
            set: function (condition) {
                if (condition && !this._hasView) {
                    this._hasView = true;
                    this._viewContainer.createEmbeddedView(this._template);
                }
                else if (!condition && this._hasView) {
                    this._hasView = false;
                    this._viewContainer.clear();
                }
            },
            enumerable: true,
            configurable: true
        });
        NgIf.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngIf]' },] },
        ];
        /** @nocollapse */
        NgIf.ctorParameters = function () { return [
            { type: _angular_core.ViewContainerRef, },
            { type: _angular_core.TemplateRef, },
        ]; };
        NgIf.propDecorators = {
            'ngIf': [{ type: _angular_core.Input },],
        };
        return NgIf;
    }());

    var SwitchView = (function () {
        /**
         * @param {?} _viewContainerRef
         * @param {?} _templateRef
         */
        function SwitchView(_viewContainerRef, _templateRef) {
            this._viewContainerRef = _viewContainerRef;
            this._templateRef = _templateRef;
            this._created = false;
        }
        /**
         * @return {?}
         */
        SwitchView.prototype.create = function () {
            this._created = true;
            this._viewContainerRef.createEmbeddedView(this._templateRef);
        };
        /**
         * @return {?}
         */
        SwitchView.prototype.destroy = function () {
            this._created = false;
            this._viewContainerRef.clear();
        };
        /**
         * @param {?} created
         * @return {?}
         */
        SwitchView.prototype.enforceState = function (created) {
            if (created && !this._created) {
                this.create();
            }
            else if (!created && this._created) {
                this.destroy();
            }
        };
        return SwitchView;
    }());
    /**
     *  *
      * expression.
      * *
      * ```
      * <container-element [ngSwitch]="switch_expression">
      * <some-element *ngSwitchCase="match_expression_1">...</some-element>
      * <some-element *ngSwitchCase="match_expression_2">...</some-element>
      * <some-other-element *ngSwitchCase="match_expression_3">...</some-other-element>
      * <ng-container *ngSwitchCase="match_expression_3">
      * <!-- use a ng-container to group multiple root nodes -->
      * <inner-element></inner-element>
      * <inner-other-element></inner-other-element>
      * </ng-container>
      * <some-element *ngSwitchDefault>...</some-element>
      * </container-element>
      * ```
      * *
      * `NgSwitch` stamps out nested views when their match expression value matches the value of the
      * switch expression.
      * *
      * In other words:
      * - you define a container element (where you place the directive with a switch expression on the
      * `[ngSwitch]="..."` attribute)
      * - you define inner views inside the `NgSwitch` and place a `*ngSwitchCase` attribute on the view
      * root elements.
      * *
      * Elements within `NgSwitch` but outside of a `NgSwitchCase` or `NgSwitchDefault` directives will
      * be preserved at the location.
      * *
      * The `ngSwitchCase` directive informs the parent `NgSwitch` of which view to display when the
      * expression is evaluated.
      * When no matching expression is found on a `ngSwitchCase` view, the `ngSwitchDefault` view is
      * stamped out.
      * *
     */
    var NgSwitch = (function () {
        function NgSwitch() {
            this._defaultUsed = false;
            this._caseCount = 0;
            this._lastCaseCheckIndex = 0;
            this._lastCasesMatched = false;
        }
        Object.defineProperty(NgSwitch.prototype, "ngSwitch", {
            /**
             * @param {?} newValue
             * @return {?}
             */
            set: function (newValue) {
                this._ngSwitch = newValue;
                if (this._caseCount === 0) {
                    this._updateDefaultCases(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        NgSwitch.prototype._addCase = function () { return this._caseCount++; };
        /**
         * @param {?} view
         * @return {?}
         */
        NgSwitch.prototype._addDefault = function (view) {
            if (!this._defaultViews) {
                this._defaultViews = [];
            }
            this._defaultViews.push(view);
        };
        /**
         * @param {?} value
         * @return {?}
         */
        NgSwitch.prototype._matchCase = function (value) {
            var /** @type {?} */ matched = value == this._ngSwitch;
            this._lastCasesMatched = this._lastCasesMatched || matched;
            this._lastCaseCheckIndex++;
            if (this._lastCaseCheckIndex === this._caseCount) {
                this._updateDefaultCases(!this._lastCasesMatched);
                this._lastCaseCheckIndex = 0;
                this._lastCasesMatched = false;
            }
            return matched;
        };
        /**
         * @param {?} useDefault
         * @return {?}
         */
        NgSwitch.prototype._updateDefaultCases = function (useDefault) {
            if (this._defaultViews && useDefault !== this._defaultUsed) {
                this._defaultUsed = useDefault;
                for (var /** @type {?} */ i = 0; i < this._defaultViews.length; i++) {
                    var /** @type {?} */ defaultView = this._defaultViews[i];
                    defaultView.enforceState(useDefault);
                }
            }
        };
        NgSwitch.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngSwitch]' },] },
        ];
        /** @nocollapse */
        NgSwitch.ctorParameters = function () { return []; };
        NgSwitch.propDecorators = {
            'ngSwitch': [{ type: _angular_core.Input },],
        };
        return NgSwitch;
    }());
    /**
     *  *
      * given expression evaluate to respectively the same/different value as the switch
      * expression.
      * *
      * ```
      * <container-element [ngSwitch]="switch_expression">
      * <some-element *ngSwitchCase="match_expression_1">...</some-element>
      * </container-element>
      * *```
      * *
      * Insert the sub-tree when the expression evaluates to the same value as the enclosing switch
      * expression.
      * *
      * If multiple match expressions match the switch expression value, all of them are displayed.
      * *
      * See {@link NgSwitch} for more details and example.
      * *
     */
    var NgSwitchCase = (function () {
        /**
         * @param {?} viewContainer
         * @param {?} templateRef
         * @param {?} ngSwitch
         */
        function NgSwitchCase(viewContainer, templateRef, ngSwitch) {
            this.ngSwitch = ngSwitch;
            ngSwitch._addCase();
            this._view = new SwitchView(viewContainer, templateRef);
        }
        /**
         * @return {?}
         */
        NgSwitchCase.prototype.ngDoCheck = function () { this._view.enforceState(this.ngSwitch._matchCase(this.ngSwitchCase)); };
        NgSwitchCase.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngSwitchCase]' },] },
        ];
        /** @nocollapse */
        NgSwitchCase.ctorParameters = function () { return [
            { type: _angular_core.ViewContainerRef, },
            { type: _angular_core.TemplateRef, },
            { type: NgSwitch, decorators: [{ type: _angular_core.Host },] },
        ]; };
        NgSwitchCase.propDecorators = {
            'ngSwitchCase': [{ type: _angular_core.Input },],
        };
        return NgSwitchCase;
    }());
    /**
     *  match the
      * switch expression.
      * *
      * ```
      * <container-element [ngSwitch]="switch_expression">
      * <some-element *ngSwitchCase="match_expression_1">...</some-element>
      * <some-other-element *ngSwitchDefault>...</some-other-element>
      * </container-element>
      * ```
      * *
      * *
      * Insert the sub-tree when no case expressions evaluate to the same value as the enclosing switch
      * expression.
      * *
      * See {@link NgSwitch} for more details and example.
      * *
     */
    var NgSwitchDefault = (function () {
        /**
         * @param {?} viewContainer
         * @param {?} templateRef
         * @param {?} ngSwitch
         */
        function NgSwitchDefault(viewContainer, templateRef, ngSwitch) {
            ngSwitch._addDefault(new SwitchView(viewContainer, templateRef));
        }
        NgSwitchDefault.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngSwitchDefault]' },] },
        ];
        /** @nocollapse */
        NgSwitchDefault.ctorParameters = function () { return [
            { type: _angular_core.ViewContainerRef, },
            { type: _angular_core.TemplateRef, },
            { type: NgSwitch, decorators: [{ type: _angular_core.Host },] },
        ]; };
        return NgSwitchDefault;
    }());

    /**
     *  *
      * *
      * ```
      * <some-element [ngPlural]="value">
      * <ng-container *ngPluralCase="'=0'">there is nothing</ng-container>
      * <ng-container *ngPluralCase="'=1'">there is one</ng-container>
      * <ng-container *ngPluralCase="'few'">there are a few</ng-container>
      * <ng-container *ngPluralCase="'other'">there are exactly #</ng-container>
      * </some-element>
      * ```
      * *
      * *
      * Displays DOM sub-trees that match the switch expression value, or failing that, DOM sub-trees
      * that match the switch expression's pluralization category.
      * *
      * To use this directive you must provide a container element that sets the `[ngPlural]` attribute
      * to a switch expression. Inner elements with a `[ngPluralCase]` will display based on their
      * expression:
      * - if `[ngPluralCase]` is set to a value starting with `=`, it will only display if the value
      * matches the switch expression exactly,
      * - otherwise, the view will be treated as a "category match", and will only display if exact
      * value matches aren't found and the value maps to its category for the defined locale.
      * *
      * See http://cldr.unicode.org/index/cldr-spec/plural-rules
      * *
     */
    var NgPlural = (function () {
        /**
         * @param {?} _localization
         */
        function NgPlural(_localization) {
            this._localization = _localization;
            this._caseViews = {};
        }
        Object.defineProperty(NgPlural.prototype, "ngPlural", {
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) {
                this._switchValue = value;
                this._updateView();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} value
         * @param {?} switchView
         * @return {?}
         */
        NgPlural.prototype.addCase = function (value, switchView) { this._caseViews[value] = switchView; };
        /**
         * @return {?}
         */
        NgPlural.prototype._updateView = function () {
            this._clearViews();
            var /** @type {?} */ cases = Object.keys(this._caseViews);
            var /** @type {?} */ key = getPluralCategory(this._switchValue, cases, this._localization);
            this._activateView(this._caseViews[key]);
        };
        /**
         * @return {?}
         */
        NgPlural.prototype._clearViews = function () {
            if (this._activeView)
                this._activeView.destroy();
        };
        /**
         * @param {?} view
         * @return {?}
         */
        NgPlural.prototype._activateView = function (view) {
            if (view) {
                this._activeView = view;
                this._activeView.create();
            }
        };
        NgPlural.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngPlural]' },] },
        ];
        /** @nocollapse */
        NgPlural.ctorParameters = function () { return [
            { type: NgLocalization, },
        ]; };
        NgPlural.propDecorators = {
            'ngPlural': [{ type: _angular_core.Input },],
        };
        return NgPlural;
    }());
    /**
     *  *
      * given expression matches the plural expression according to CLDR rules.
      * *
      * ```
      * <some-element [ngPlural]="value">
      * <ng-container *ngPluralCase="'=0'">...</ng-container>
      * <ng-container *ngPluralCase="'other'">...</ng-container>
      * </some-element>
      * *```
      * *
      * See {@link NgPlural} for more details and example.
      * *
     */
    var NgPluralCase = (function () {
        /**
         * @param {?} value
         * @param {?} template
         * @param {?} viewContainer
         * @param {?} ngPlural
         */
        function NgPluralCase(value, template, viewContainer, ngPlural) {
            this.value = value;
            ngPlural.addCase(value, new SwitchView(viewContainer, template));
        }
        NgPluralCase.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngPluralCase]' },] },
        ];
        /** @nocollapse */
        NgPluralCase.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['ngPluralCase',] },] },
            { type: _angular_core.TemplateRef, },
            { type: _angular_core.ViewContainerRef, },
            { type: NgPlural, decorators: [{ type: _angular_core.Host },] },
        ]; };
        return NgPluralCase;
    }());

    /**
     *  *
      * *
      * ```
      * <some-element [ngStyle]="{'font-style': styleExp}">...</some-element>
      * *
      * <some-element [ngStyle]="{'max-width.px': widthExp}">...</some-element>
      * *
      * <some-element [ngStyle]="objExp">...</some-element>
      * ```
      * *
      * *
      * The styles are updated according to the value of the expression evaluation:
      * - keys are style names with an optional `.<unit>` suffix (ie 'top.px', 'font-style.em'),
      * - values are the values assigned to those properties (expressed in the given unit).
      * *
     */
    var NgStyle = (function () {
        /**
         * @param {?} _differs
         * @param {?} _ngEl
         * @param {?} _renderer
         */
        function NgStyle(_differs, _ngEl, _renderer) {
            this._differs = _differs;
            this._ngEl = _ngEl;
            this._renderer = _renderer;
        }
        Object.defineProperty(NgStyle.prototype, "ngStyle", {
            /**
             * @param {?} v
             * @return {?}
             */
            set: function (v) {
                this._ngStyle = v;
                if (!this._differ && v) {
                    this._differ = this._differs.find(v).create(null);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        NgStyle.prototype.ngDoCheck = function () {
            if (this._differ) {
                var /** @type {?} */ changes = this._differ.diff(this._ngStyle);
                if (changes) {
                    this._applyChanges(changes);
                }
            }
        };
        /**
         * @param {?} changes
         * @return {?}
         */
        NgStyle.prototype._applyChanges = function (changes) {
            var _this = this;
            changes.forEachRemovedItem(function (record) { return _this._setStyle(record.key, null); });
            changes.forEachAddedItem(function (record) { return _this._setStyle(record.key, record.currentValue); });
            changes.forEachChangedItem(function (record) { return _this._setStyle(record.key, record.currentValue); });
        };
        /**
         * @param {?} nameAndUnit
         * @param {?} value
         * @return {?}
         */
        NgStyle.prototype._setStyle = function (nameAndUnit, value) {
            var _a = nameAndUnit.split('.'), name = _a[0], unit = _a[1];
            value = value && unit ? "" + value + unit : value;
            this._renderer.setElementStyle(this._ngEl.nativeElement, name, value);
        };
        NgStyle.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngStyle]' },] },
        ];
        /** @nocollapse */
        NgStyle.ctorParameters = function () { return [
            { type: _angular_core.KeyValueDiffers, },
            { type: _angular_core.ElementRef, },
            { type: _angular_core.Renderer, },
        ]; };
        NgStyle.propDecorators = {
            'ngStyle': [{ type: _angular_core.Input },],
        };
        return NgStyle;
    }());

    /**
     *  *
      * *
      * ```
      * <template [ngTemplateOutlet]="templateRefExpression"
      * [ngOutletContext]="objectExpression">
      * </template>
      * ```
      * *
      * *
      * You can attach a context object to the `EmbeddedViewRef` by setting `[ngOutletContext]`.
      * `[ngOutletContext]` should be an object, the object's keys will be the local template variables
      * available within the `TemplateRef`.
      * *
      * Note: using the key `$implicit` in the context object will set it's value as default.
      * *
     */
    var NgTemplateOutlet = (function () {
        /**
         * @param {?} _viewContainerRef
         */
        function NgTemplateOutlet(_viewContainerRef) {
            this._viewContainerRef = _viewContainerRef;
        }
        Object.defineProperty(NgTemplateOutlet.prototype, "ngOutletContext", {
            /**
             * @param {?} context
             * @return {?}
             */
            set: function (context) { this._context = context; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgTemplateOutlet.prototype, "ngTemplateOutlet", {
            /**
             * @param {?} templateRef
             * @return {?}
             */
            set: function (templateRef) { this._templateRef = templateRef; },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} changes
         * @return {?}
         */
        NgTemplateOutlet.prototype.ngOnChanges = function (changes) {
            if (this._viewRef) {
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._viewRef));
            }
            if (this._templateRef) {
                this._viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, this._context);
            }
        };
        NgTemplateOutlet.decorators = [
            { type: _angular_core.Directive, args: [{ selector: '[ngTemplateOutlet]' },] },
        ];
        /** @nocollapse */
        NgTemplateOutlet.ctorParameters = function () { return [
            { type: _angular_core.ViewContainerRef, },
        ]; };
        NgTemplateOutlet.propDecorators = {
            'ngOutletContext': [{ type: _angular_core.Input },],
            'ngTemplateOutlet': [{ type: _angular_core.Input },],
        };
        return NgTemplateOutlet;
    }());

    /**
     * A collection of Angular directives that are likely to be used in each and every Angular
     * application.
     */
    var /** @type {?} */ COMMON_DIRECTIVES = [
        NgClass,
        NgFor,
        NgIf,
        NgTemplateOutlet,
        NgStyle,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        NgPlural,
        NgPluralCase,
    ];

    var /** @type {?} */ isPromise = _angular_core.__core_private__.isPromise;

    var __extends$4 = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * @stable
     */
    var BaseError = (function (_super) {
        __extends$4(BaseError, _super);
        /**
         * @param {?} message
         */
        function BaseError(message) {
            _super.call(this, message);
            // Errors don't use current this, instead they create a new instance.
            // We have to do forward all of our api to the nativeInstance.
            // TODO(bradfordcsmith): Remove this hack when
            //     google/closure-compiler/issues/2102 is fixed.
            var nativeError = new Error(message);
            this._nativeError = nativeError;
        }
        Object.defineProperty(BaseError.prototype, "message", {
            /**
             * @return {?}
             */
            get: function () { return this._nativeError.message; },
            /**
             * @param {?} message
             * @return {?}
             */
            set: function (message) { this._nativeError.message = message; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseError.prototype, "name", {
            /**
             * @return {?}
             */
            get: function () { return this._nativeError.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseError.prototype, "stack", {
            /**
             * @return {?}
             */
            get: function () { return ((this._nativeError)).stack; },
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) { ((this._nativeError)).stack = value; },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        BaseError.prototype.toString = function () { return this._nativeError.toString(); };
        return BaseError;
    }(Error));
    /**
     * @stable
     */
    var WrappedError = (function (_super) {
        __extends$4(WrappedError, _super);
        /**
         * @param {?} message
         * @param {?} error
         */
        function WrappedError(message, error) {
            _super.call(this, message + " caused by: " + (error instanceof Error ? error.message : error));
            this.originalError = error;
        }
        Object.defineProperty(WrappedError.prototype, "stack", {
            /**
             * @return {?}
             */
            get: function () {
                return (((this.originalError instanceof Error ? this.originalError : this._nativeError)))
                    .stack;
            },
            enumerable: true,
            configurable: true
        });
        return WrappedError;
    }(BaseError));

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __extends$3 = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var InvalidPipeArgumentError = (function (_super) {
        __extends$3(InvalidPipeArgumentError, _super);
        /**
         * @param {?} type
         * @param {?} value
         */
        function InvalidPipeArgumentError(type, value) {
            _super.call(this, "Invalid argument '" + value + "' for pipe '" + stringify(type) + "'");
        }
        return InvalidPipeArgumentError;
    }(BaseError));

    var ObservableStrategy = (function () {
        function ObservableStrategy() {
        }
        /**
         * @param {?} async
         * @param {?} updateLatestValue
         * @return {?}
         */
        ObservableStrategy.prototype.createSubscription = function (async, updateLatestValue) {
            return async.subscribe({ next: updateLatestValue, error: function (e) { throw e; } });
        };
        /**
         * @param {?} subscription
         * @return {?}
         */
        ObservableStrategy.prototype.dispose = function (subscription) { subscription.unsubscribe(); };
        /**
         * @param {?} subscription
         * @return {?}
         */
        ObservableStrategy.prototype.onDestroy = function (subscription) { subscription.unsubscribe(); };
        return ObservableStrategy;
    }());
    var PromiseStrategy = (function () {
        function PromiseStrategy() {
        }
        /**
         * @param {?} async
         * @param {?} updateLatestValue
         * @return {?}
         */
        PromiseStrategy.prototype.createSubscription = function (async, updateLatestValue) {
            return async.then(updateLatestValue, function (e) { throw e; });
        };
        /**
         * @param {?} subscription
         * @return {?}
         */
        PromiseStrategy.prototype.dispose = function (subscription) { };
        /**
         * @param {?} subscription
         * @return {?}
         */
        PromiseStrategy.prototype.onDestroy = function (subscription) { };
        return PromiseStrategy;
    }());
    var /** @type {?} */ _promiseStrategy = new PromiseStrategy();
    var /** @type {?} */ _observableStrategy = new ObservableStrategy();
    /**
     *  The `async` pipe subscribes to an `Observable` or `Promise` and returns the latest value it has
      * emitted. When a new value is emitted, the `async` pipe marks the component to be checked for
      * changes. When the component gets destroyed, the `async` pipe unsubscribes automatically to avoid
      * potential memory leaks.
      * *
      * *
      * ## Examples
      * *
      * This example binds a `Promise` to the view. Clicking the `Resolve` button resolves the
      * promise.
      * *
      * {@example common/pipes/ts/async_pipe.ts region='AsyncPipePromise'}
      * *
      * It's also possible to use `async` with Observables. The example below binds the `time` Observable
      * to the view. The Observable continuously updates the view with the current time.
      * *
      * {@example common/pipes/ts/async_pipe.ts region='AsyncPipeObservable'}
      * *
     */
    var AsyncPipe = (function () {
        /**
         * @param {?} _ref
         */
        function AsyncPipe(_ref) {
            this._ref = _ref;
            this._latestValue = null;
            this._latestReturnedValue = null;
            this._subscription = null;
            this._obj = null;
            this._strategy = null;
        }
        /**
         * @return {?}
         */
        AsyncPipe.prototype.ngOnDestroy = function () {
            if (this._subscription) {
                this._dispose();
            }
        };
        /**
         * @param {?} obj
         * @return {?}
         */
        AsyncPipe.prototype.transform = function (obj) {
            if (!this._obj) {
                if (obj) {
                    this._subscribe(obj);
                }
                this._latestReturnedValue = this._latestValue;
                return this._latestValue;
            }
            if (obj !== this._obj) {
                this._dispose();
                return this.transform(obj);
            }
            if (this._latestValue === this._latestReturnedValue) {
                return this._latestReturnedValue;
            }
            this._latestReturnedValue = this._latestValue;
            return _angular_core.WrappedValue.wrap(this._latestValue);
        };
        /**
         * @param {?} obj
         * @return {?}
         */
        AsyncPipe.prototype._subscribe = function (obj) {
            var _this = this;
            this._obj = obj;
            this._strategy = this._selectStrategy(obj);
            this._subscription = this._strategy.createSubscription(obj, function (value) { return _this._updateLatestValue(obj, value); });
        };
        /**
         * @param {?} obj
         * @return {?}
         */
        AsyncPipe.prototype._selectStrategy = function (obj) {
            if (isPromise(obj)) {
                return _promiseStrategy;
            }
            if (((obj)).subscribe) {
                return _observableStrategy;
            }
            throw new InvalidPipeArgumentError(AsyncPipe, obj);
        };
        /**
         * @return {?}
         */
        AsyncPipe.prototype._dispose = function () {
            this._strategy.dispose(this._subscription);
            this._latestValue = null;
            this._latestReturnedValue = null;
            this._subscription = null;
            this._obj = null;
        };
        /**
         * @param {?} async
         * @param {?} value
         * @return {?}
         */
        AsyncPipe.prototype._updateLatestValue = function (async, value) {
            if (async === this._obj) {
                this._latestValue = value;
                this._ref.markForCheck();
            }
        };
        AsyncPipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'async', pure: false },] },
        ];
        /** @nocollapse */
        AsyncPipe.ctorParameters = function () { return [
            { type: _angular_core.ChangeDetectorRef, },
        ]; };
        return AsyncPipe;
    }());

    var NumberFormatStyle = {};
    NumberFormatStyle.Decimal = 0;
    NumberFormatStyle.Percent = 1;
    NumberFormatStyle.Currency = 2;
    NumberFormatStyle[NumberFormatStyle.Decimal] = "Decimal";
    NumberFormatStyle[NumberFormatStyle.Percent] = "Percent";
    NumberFormatStyle[NumberFormatStyle.Currency] = "Currency";
    var NumberFormatter = (function () {
        function NumberFormatter() {
        }
        /**
         * @param {?} num
         * @param {?} locale
         * @param {?} style
         * @param {?=} __3
         * @return {?}
         */
        NumberFormatter.format = function (num, locale, style, _a) {
            var _b = _a === void 0 ? {} : _a, minimumIntegerDigits = _b.minimumIntegerDigits, minimumFractionDigits = _b.minimumFractionDigits, maximumFractionDigits = _b.maximumFractionDigits, currency = _b.currency, _c = _b.currencyAsSymbol, currencyAsSymbol = _c === void 0 ? false : _c;
            var /** @type {?} */ options = {
                minimumIntegerDigits: minimumIntegerDigits,
                minimumFractionDigits: minimumFractionDigits,
                maximumFractionDigits: maximumFractionDigits,
                style: NumberFormatStyle[style].toLowerCase()
            };
            if (style == NumberFormatStyle.Currency) {
                options.currency = currency;
                options.currencyDisplay = currencyAsSymbol ? 'symbol' : 'code';
            }
            return new Intl.NumberFormat(locale, options).format(num);
        };
        return NumberFormatter;
    }());
    var /** @type {?} */ DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsazZEwGjJ']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|J+|j+|m+|s+|a|z|Z|G+|w+))(.*)/;
    var /** @type {?} */ PATTERN_ALIASES = {
        // Keys are quoted so they do not get renamed during closure compilation.
        'yMMMdjms': datePartGetterFactory(combine([
            digitCondition('year', 1),
            nameCondition('month', 3),
            digitCondition('day', 1),
            digitCondition('hour', 1),
            digitCondition('minute', 1),
            digitCondition('second', 1),
        ])),
        'yMdjm': datePartGetterFactory(combine([
            digitCondition('year', 1), digitCondition('month', 1), digitCondition('day', 1),
            digitCondition('hour', 1), digitCondition('minute', 1)
        ])),
        'yMMMMEEEEd': datePartGetterFactory(combine([
            digitCondition('year', 1), nameCondition('month', 4), nameCondition('weekday', 4),
            digitCondition('day', 1)
        ])),
        'yMMMMd': datePartGetterFactory(combine([digitCondition('year', 1), nameCondition('month', 4), digitCondition('day', 1)])),
        'yMMMd': datePartGetterFactory(combine([digitCondition('year', 1), nameCondition('month', 3), digitCondition('day', 1)])),
        'yMd': datePartGetterFactory(combine([digitCondition('year', 1), digitCondition('month', 1), digitCondition('day', 1)])),
        'jms': datePartGetterFactory(combine([digitCondition('hour', 1), digitCondition('second', 1), digitCondition('minute', 1)])),
        'jm': datePartGetterFactory(combine([digitCondition('hour', 1), digitCondition('minute', 1)]))
    };
    var /** @type {?} */ DATE_FORMATS = {
        // Keys are quoted so they do not get renamed.
        'yyyy': datePartGetterFactory(digitCondition('year', 4)),
        'yy': datePartGetterFactory(digitCondition('year', 2)),
        'y': datePartGetterFactory(digitCondition('year', 1)),
        'MMMM': datePartGetterFactory(nameCondition('month', 4)),
        'MMM': datePartGetterFactory(nameCondition('month', 3)),
        'MM': datePartGetterFactory(digitCondition('month', 2)),
        'M': datePartGetterFactory(digitCondition('month', 1)),
        'LLLL': datePartGetterFactory(nameCondition('month', 4)),
        'L': datePartGetterFactory(nameCondition('month', 1)),
        'dd': datePartGetterFactory(digitCondition('day', 2)),
        'd': datePartGetterFactory(digitCondition('day', 1)),
        'HH': digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), false)))),
        'H': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), false))),
        'hh': digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), true)))),
        'h': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
        'jj': datePartGetterFactory(digitCondition('hour', 2)),
        'j': datePartGetterFactory(digitCondition('hour', 1)),
        'mm': digitModifier(datePartGetterFactory(digitCondition('minute', 2))),
        'm': datePartGetterFactory(digitCondition('minute', 1)),
        'ss': digitModifier(datePartGetterFactory(digitCondition('second', 2))),
        's': datePartGetterFactory(digitCondition('second', 1)),
        // while ISO 8601 requires fractions to be prefixed with `.` or `,`
        // we can be just safely rely on using `sss` since we currently don't support single or two digit
        // fractions
        'sss': datePartGetterFactory(digitCondition('second', 3)),
        'EEEE': datePartGetterFactory(nameCondition('weekday', 4)),
        'EEE': datePartGetterFactory(nameCondition('weekday', 3)),
        'EE': datePartGetterFactory(nameCondition('weekday', 2)),
        'E': datePartGetterFactory(nameCondition('weekday', 1)),
        'a': hourClockExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
        'Z': timeZoneGetter('short'),
        'z': timeZoneGetter('long'),
        'ww': datePartGetterFactory({}),
        // first Thursday of the year. not support ?
        'w': datePartGetterFactory({}),
        // of the year not support ?
        'G': datePartGetterFactory(nameCondition('era', 1)),
        'GG': datePartGetterFactory(nameCondition('era', 2)),
        'GGG': datePartGetterFactory(nameCondition('era', 3)),
        'GGGG': datePartGetterFactory(nameCondition('era', 4))
    };
    /**
     * @param {?} inner
     * @return {?}
     */
    function digitModifier(inner) {
        return function (date, locale) {
            var /** @type {?} */ result = inner(date, locale);
            return result.length == 1 ? '0' + result : result;
        };
    }
    /**
     * @param {?} inner
     * @return {?}
     */
    function hourClockExtractor(inner) {
        return function (date, locale) { return inner(date, locale).split(' ')[1]; };
    }
    /**
     * @param {?} inner
     * @return {?}
     */
    function hourExtractor(inner) {
        return function (date, locale) { return inner(date, locale).split(' ')[0]; };
    }
    /**
     * @param {?} date
     * @param {?} locale
     * @param {?} options
     * @return {?}
     */
    function intlDateFormat(date, locale, options) {
        return new Intl.DateTimeFormat(locale, options).format(date).replace(/[\u200e\u200f]/g, '');
    }
    /**
     * @param {?} timezone
     * @return {?}
     */
    function timeZoneGetter(timezone) {
        // To workaround `Intl` API restriction for single timezone let format with 24 hours
        var /** @type {?} */ options = { hour: '2-digit', hour12: false, timeZoneName: timezone };
        return function (date, locale) {
            var /** @type {?} */ result = intlDateFormat(date, locale, options);
            // Then extract first 3 letters that related to hours
            return result ? result.substring(3) : '';
        };
    }
    /**
     * @param {?} options
     * @param {?} value
     * @return {?}
     */
    function hour12Modify(options, value) {
        options.hour12 = value;
        return options;
    }
    /**
     * @param {?} prop
     * @param {?} len
     * @return {?}
     */
    function digitCondition(prop, len) {
        var /** @type {?} */ result = {};
        result[prop] = len === 2 ? '2-digit' : 'numeric';
        return result;
    }
    /**
     * @param {?} prop
     * @param {?} len
     * @return {?}
     */
    function nameCondition(prop, len) {
        var /** @type {?} */ result = {};
        if (len < 4) {
            result[prop] = len > 1 ? 'short' : 'narrow';
        }
        else {
            result[prop] = 'long';
        }
        return result;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    function combine(options) {
        return (_a = ((Object))).assign.apply(_a, [{}].concat(options));
        var _a;
    }
    /**
     * @param {?} ret
     * @return {?}
     */
    function datePartGetterFactory(ret) {
        return function (date, locale) { return intlDateFormat(date, locale, ret); };
    }
    var /** @type {?} */ DATE_FORMATTER_CACHE = new Map();
    /**
     * @param {?} format
     * @param {?} date
     * @param {?} locale
     * @return {?}
     */
    function dateFormatter(format, date, locale) {
        var /** @type {?} */ fn = PATTERN_ALIASES[format];
        if (fn)
            return fn(date, locale);
        var /** @type {?} */ cacheKey = format;
        var /** @type {?} */ parts = DATE_FORMATTER_CACHE.get(cacheKey);
        if (!parts) {
            parts = [];
            var /** @type {?} */ match = void 0;
            DATE_FORMATS_SPLIT.exec(format);
            while (format) {
                match = DATE_FORMATS_SPLIT.exec(format);
                if (match) {
                    parts = parts.concat(match.slice(1));
                    format = parts.pop();
                }
                else {
                    parts.push(format);
                    format = null;
                }
            }
            DATE_FORMATTER_CACHE.set(cacheKey, parts);
        }
        return parts.reduce(function (text, part) {
            var /** @type {?} */ fn = DATE_FORMATS[part];
            return text + (fn ? fn(date, locale) : partToTime(part));
        }, '');
    }
    /**
     * @param {?} part
     * @return {?}
     */
    function partToTime(part) {
        return part === '\'\'' ? '\'' : part.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
    }
    var DateFormatter = (function () {
        function DateFormatter() {
        }
        /**
         * @param {?} date
         * @param {?} locale
         * @param {?} pattern
         * @return {?}
         */
        DateFormatter.format = function (date, locale, pattern) {
            return dateFormatter(pattern, date, locale);
        };
        return DateFormatter;
    }());

    /**
     *  *
      * Where:
      * - `expression` is a date object or a number (milliseconds since UTC epoch) or an ISO string
      * (https://www.w3.org/TR/NOTE-datetime).
      * - `format` indicates which date/time components to include. The format can be predifined as
      * shown below or custom as shown in the table.
      * - `'medium'`: equivalent to `'yMMMdjms'` (e.g. `Sep 3, 2010, 12:05:08 PM` for `en-US`)
      * - `'short'`: equivalent to `'yMdjm'` (e.g. `9/3/2010, 12:05 PM` for `en-US`)
      * - `'fullDate'`: equivalent to `'yMMMMEEEEd'` (e.g. `Friday, September 3, 2010` for `en-US`)
      * - `'longDate'`: equivalent to `'yMMMMd'` (e.g. `September 3, 2010` for `en-US`)
      * - `'mediumDate'`: equivalent to `'yMMMd'` (e.g. `Sep 3, 2010` for `en-US`)
      * - `'shortDate'`: equivalent to `'yMd'` (e.g. `9/3/2010` for `en-US`)
      * - `'mediumTime'`: equivalent to `'jms'` (e.g. `12:05:08 PM` for `en-US`)
      * - `'shortTime'`: equivalent to `'jm'` (e.g. `12:05 PM` for `en-US`)
      * *
      * *
      * | Component | Symbol | Narrow | Short Form   | Long Form         | Numeric   | 2-digit   |
      * |-----------|:------:|--------|--------------|-------------------|-----------|-----------|
      * | era       |   G    | G (A)  | GGG (AD)     | GGGG (Anno Domini)| -         | -         |
      * | year      |   y    | -      | -            | -                 | y (2015)  | yy (15)   |
      * | month     |   M    | L (S)  | MMM (Sep)    | MMMM (September)  | M (9)     | MM (09)   |
      * | day       |   d    | -      | -            | -                 | d (3)     | dd (03)   |
      * | weekday   |   E    | E (S)  | EEE (Sun)    | EEEE (Sunday)     | -         | -         |
      * | hour      |   j    | -      | -            | -                 | j (13)    | jj (13)   |
      * | hour12    |   h    | -      | -            | -                 | h (1 PM)  | hh (01 PM)|
      * | hour24    |   H    | -      | -            | -                 | H (13)    | HH (13)   |
      * | minute    |   m    | -      | -            | -                 | m (5)     | mm (05)   |
      * | second    |   s    | -      | -            | -                 | s (9)     | ss (09)   |
      * | timezone  |   z    | -      | -            | z (Pacific Standard Time)| -  | -         |
      * | timezone  |   Z    | -      | Z (GMT-8:00) | -                 | -         | -         |
      * | timezone  |   a    | -      | a (PM)       | -                 | -         | -         |
      * *
      * In javascript, only the components specified will be respected (not the ordering,
      * punctuations, ...) and details of the formatting will be dependent on the locale.
      * *
      * Timezone of the formatted text will be the local system timezone of the end-user's machine.
      * *
      * When the expression is a ISO string without time (e.g. 2016-09-19) the time zone offset is not
      * applied and the formatted text will have the same day, month and year of the expression.
      * *
      * WARNINGS:
      * - this pipe is marked as pure hence it will not be re-evaluated when the input is mutated.
      * Instead users should treat the date as an immutable object and change the reference when the
      * pipe needs to re-run (this is to avoid reformatting the date on every change detection run
      * which would be an expensive operation).
      * - this pipe uses the Internationalization API. Therefore it is only reliable in Chrome and Opera
      * browsers.
      * *
      * ### Examples
      * *
      * Assuming `dateObj` is (year: 2015, month: 6, day: 15, hour: 21, minute: 43, second: 11)
      * in the _local_ time and locale is 'en-US':
      * *
      * ```
      * {{ dateObj | date }}               // output is 'Jun 15, 2015'
      * {{ dateObj | date:'medium' }}      // output is 'Jun 15, 2015, 9:43:11 PM'
      * {{ dateObj | date:'shortTime' }}   // output is '9:43 PM'
      * {{ dateObj | date:'mmss' }}        // output is '43:11'
      * ```
      * *
      * {@example common/pipes/ts/date_pipe.ts region='DatePipe'}
      * *
     */
    var DatePipe = (function () {
        /**
         * @param {?} _locale
         */
        function DatePipe(_locale) {
            this._locale = _locale;
        }
        /**
         * @param {?} value
         * @param {?=} pattern
         * @return {?}
         */
        DatePipe.prototype.transform = function (value, pattern) {
            if (pattern === void 0) { pattern = 'mediumDate'; }
            var /** @type {?} */ date;
            if (isBlank$1(value))
                return null;
            if (typeof value === 'string') {
                value = value.trim();
            }
            if (isDate(value)) {
                date = value;
            }
            else if (NumberWrapper.isNumeric(value)) {
                date = new Date(parseFloat(value));
            }
            else if (typeof value === 'string' && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
                /**
                * For ISO Strings without time the day, month and year must be extracted from the ISO String
                * before Date creation to avoid time offset and errors in the new Date.
                * If we only replace '-' with ',' in the ISO String ("2015,01,01"), and try to create a new
                * date, some browsers (e.g. IE 9) will throw an invalid Date error
                * If we leave the '-' ("2015-01-01") and try to create a new Date("2015-01-01") the timeoffset
                * is applied
                * Note: ISO months are 0 for January, 1 for February, ...
                */
                var _a = value.split('-').map(function (val) { return parseInt(val, 10); }), y = _a[0], m = _a[1], d = _a[2];
                date = new Date(y, m - 1, d);
            }
            else {
                date = new Date(value);
            }
            if (!isDate(date)) {
                throw new InvalidPipeArgumentError(DatePipe, value);
            }
            return DateFormatter.format(date, this._locale, DatePipe._ALIASES[pattern] || pattern);
        };
        /** @internal */
        DatePipe._ALIASES = {
            'medium': 'yMMMdjms',
            'short': 'yMdjm',
            'fullDate': 'yMMMMEEEEd',
            'longDate': 'yMMMMd',
            'mediumDate': 'yMMMd',
            'shortDate': 'yMd',
            'mediumTime': 'jms',
            'shortTime': 'jm'
        };
        DatePipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'date', pure: true },] },
        ];
        /** @nocollapse */
        DatePipe.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_core.LOCALE_ID,] },] },
        ]; };
        return DatePipe;
    }());
    /**
     * @param {?} obj
     * @return {?}
     */
    function isBlank$1(obj) {
        return obj == null || obj === '';
    }

    var /** @type {?} */ _INTERPOLATION_REGEXP = /#/g;
    /**
     *  *
      * Where:
      * - `expression` is a number.
      * - `mapping` is an object that mimics the ICU format, see
      * http://userguide.icu-project.org/formatparse/messages
      * *
      * ## Example
      * *
      * {@example common/pipes/ts/i18n_pipe.ts region='I18nPluralPipeComponent'}
      * *
     */
    var I18nPluralPipe = (function () {
        /**
         * @param {?} _localization
         */
        function I18nPluralPipe(_localization) {
            this._localization = _localization;
        }
        /**
         * @param {?} value
         * @param {?} pluralMap
         * @return {?}
         */
        I18nPluralPipe.prototype.transform = function (value, pluralMap) {
            if (isBlank(value))
                return '';
            if (typeof pluralMap !== 'object' || pluralMap === null) {
                throw new InvalidPipeArgumentError(I18nPluralPipe, pluralMap);
            }
            var /** @type {?} */ key = getPluralCategory(value, Object.keys(pluralMap), this._localization);
            return pluralMap[key].replace(_INTERPOLATION_REGEXP, value.toString());
        };
        I18nPluralPipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'i18nPlural', pure: true },] },
        ];
        /** @nocollapse */
        I18nPluralPipe.ctorParameters = function () { return [
            { type: NgLocalization, },
        ]; };
        return I18nPluralPipe;
    }());

    /**
     *  *
      * Where `mapping` is an object that indicates the text that should be displayed
      * for different values of the provided `expression`.
      * If none of the keys of the mapping match the value of the `expression`, then the content
      * of the `other` key is returned when present, otherwise an empty string is returned.
      * *
      * ## Example
      * *
      * {@example common/pipes/ts/i18n_pipe.ts region='I18nSelectPipeComponent'}
      * *
      * @experimental
     */
    var I18nSelectPipe = (function () {
        function I18nSelectPipe() {
        }
        /**
         * @param {?} value
         * @param {?} mapping
         * @return {?}
         */
        I18nSelectPipe.prototype.transform = function (value, mapping) {
            if (value == null)
                return '';
            if (typeof mapping !== 'object' || typeof value !== 'string') {
                throw new InvalidPipeArgumentError(I18nSelectPipe, mapping);
            }
            if (mapping.hasOwnProperty(value)) {
                return mapping[value];
            }
            if (mapping.hasOwnProperty('other')) {
                return mapping['other'];
            }
            return '';
        };
        I18nSelectPipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'i18nSelect', pure: true },] },
        ];
        /** @nocollapse */
        I18nSelectPipe.ctorParameters = function () { return []; };
        return I18nSelectPipe;
    }());

    /**
     *  *
      * Converts value into string using `JSON.stringify`. Useful for debugging.
      * *
      * ### Example
      * {@example common/pipes/ts/json_pipe.ts region='JsonPipe'}
      * *
     */
    var JsonPipe = (function () {
        function JsonPipe() {
        }
        /**
         * @param {?} value
         * @return {?}
         */
        JsonPipe.prototype.transform = function (value) { return JSON.stringify(value, null, 2); };
        JsonPipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'json', pure: false },] },
        ];
        /** @nocollapse */
        JsonPipe.ctorParameters = function () { return []; };
        return JsonPipe;
    }());

    /**
     *  *
      * Converts value into a lowercase string using `String.prototype.toLowerCase()`.
      * *
      * ### Example
      * *
      * {@example common/pipes/ts/lowerupper_pipe.ts region='LowerUpperPipe'}
      * *
     */
    var LowerCasePipe = (function () {
        function LowerCasePipe() {
        }
        /**
         * @param {?} value
         * @return {?}
         */
        LowerCasePipe.prototype.transform = function (value) {
            if (isBlank(value))
                return value;
            if (typeof value !== 'string') {
                throw new InvalidPipeArgumentError(LowerCasePipe, value);
            }
            return value.toLowerCase();
        };
        LowerCasePipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'lowercase' },] },
        ];
        /** @nocollapse */
        LowerCasePipe.ctorParameters = function () { return []; };
        return LowerCasePipe;
    }());

    var /** @type {?} */ _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
    /**
     * @param {?} pipe
     * @param {?} locale
     * @param {?} value
     * @param {?} style
     * @param {?} digits
     * @param {?=} currency
     * @param {?=} currencyAsSymbol
     * @return {?}
     */
    function formatNumber(pipe, locale, value, style, digits, currency, currencyAsSymbol) {
        if (currency === void 0) { currency = null; }
        if (currencyAsSymbol === void 0) { currencyAsSymbol = false; }
        if (isBlank(value))
            return null;
        // Convert strings to numbers
        value = typeof value === 'string' && NumberWrapper.isNumeric(value) ? +value : value;
        if (typeof value !== 'number') {
            throw new InvalidPipeArgumentError(pipe, value);
        }
        var /** @type {?} */ minInt;
        var /** @type {?} */ minFraction;
        var /** @type {?} */ maxFraction;
        if (style !== NumberFormatStyle.Currency) {
            // rely on Intl default for currency
            minInt = 1;
            minFraction = 0;
            maxFraction = 3;
        }
        if (digits) {
            var /** @type {?} */ parts = digits.match(_NUMBER_FORMAT_REGEXP);
            if (parts === null) {
                throw new Error(digits + " is not a valid digit info for number pipes");
            }
            if (isPresent(parts[1])) {
                minInt = NumberWrapper.parseIntAutoRadix(parts[1]);
            }
            if (isPresent(parts[3])) {
                minFraction = NumberWrapper.parseIntAutoRadix(parts[3]);
            }
            if (isPresent(parts[5])) {
                maxFraction = NumberWrapper.parseIntAutoRadix(parts[5]);
            }
        }
        return NumberFormatter.format(/** @type {?} */ (value), locale, style, {
            minimumIntegerDigits: minInt,
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction,
            currency: currency,
            currencyAsSymbol: currencyAsSymbol,
        });
    }
    /**
     *  *
      * Formats a number as text. Group sizing and separator and other locale-specific
      * configurations are based on the active locale.
      * *
      * where `expression` is a number:
      * - `digitInfo` is a `string` which has a following format: <br>
      * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>
      * - `minIntegerDigits` is the minimum number of integer digits to use. Defaults to `1`.
      * - `minFractionDigits` is the minimum number of digits after fraction. Defaults to `0`.
      * - `maxFractionDigits` is the maximum number of digits after fraction. Defaults to `3`.
      * *
      * For more information on the acceptable range for each of these numbers and other
      * details see your native internationalization library.
      * *
      * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
      * and may require a polyfill. See {@linkDocs guide/browser-support} for details.
      * *
      * ### Example
      * *
      * {@example common/pipes/ts/number_pipe.ts region='NumberPipe'}
      * *
     */
    var DecimalPipe = (function () {
        /**
         * @param {?} _locale
         */
        function DecimalPipe(_locale) {
            this._locale = _locale;
        }
        /**
         * @param {?} value
         * @param {?=} digits
         * @return {?}
         */
        DecimalPipe.prototype.transform = function (value, digits) {
            if (digits === void 0) { digits = null; }
            return formatNumber(DecimalPipe, this._locale, value, NumberFormatStyle.Decimal, digits);
        };
        DecimalPipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'number' },] },
        ];
        /** @nocollapse */
        DecimalPipe.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_core.LOCALE_ID,] },] },
        ]; };
        return DecimalPipe;
    }());
    /**
     *  *
      * *
      * Formats a number as percentage.
      * *
      * - `digitInfo` See {@link DecimalPipe} for detailed description.
      * *
      * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
      * and may require a polyfill. See {@linkDocs guide/browser-support} for details.
      * *
      * ### Example
      * *
      * {@example common/pipes/ts/number_pipe.ts region='PercentPipe'}
      * *
     */
    var PercentPipe = (function () {
        /**
         * @param {?} _locale
         */
        function PercentPipe(_locale) {
            this._locale = _locale;
        }
        /**
         * @param {?} value
         * @param {?=} digits
         * @return {?}
         */
        PercentPipe.prototype.transform = function (value, digits) {
            if (digits === void 0) { digits = null; }
            return formatNumber(PercentPipe, this._locale, value, NumberFormatStyle.Percent, digits);
        };
        PercentPipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'percent' },] },
        ];
        /** @nocollapse */
        PercentPipe.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_core.LOCALE_ID,] },] },
        ]; };
        return PercentPipe;
    }());
    /**
     *  *
      * Use `currency` to format a number as currency.
      * *
      * - `currencyCode` is the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code, such
      * as `USD` for the US dollar and `EUR` for the euro.
      * - `symbolDisplay` is a boolean indicating whether to use the currency symbol or code.
      * - `true`: use symbol (e.g. `$`).
      * - `false`(default): use code (e.g. `USD`).
      * - `digitInfo` See {@link DecimalPipe} for detailed description.
      * *
      * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
      * and may require a polyfill. See {@linkDocs guide/browser-support} for details.
      * *
      * ### Example
      * *
      * {@example common/pipes/ts/number_pipe.ts region='CurrencyPipe'}
      * *
     */
    var CurrencyPipe = (function () {
        /**
         * @param {?} _locale
         */
        function CurrencyPipe(_locale) {
            this._locale = _locale;
        }
        /**
         * @param {?} value
         * @param {?=} currencyCode
         * @param {?=} symbolDisplay
         * @param {?=} digits
         * @return {?}
         */
        CurrencyPipe.prototype.transform = function (value, currencyCode, symbolDisplay, digits) {
            if (currencyCode === void 0) { currencyCode = 'USD'; }
            if (symbolDisplay === void 0) { symbolDisplay = false; }
            if (digits === void 0) { digits = null; }
            return formatNumber(CurrencyPipe, this._locale, value, NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
        };
        CurrencyPipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'currency' },] },
        ];
        /** @nocollapse */
        CurrencyPipe.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_core.LOCALE_ID,] },] },
        ]; };
        return CurrencyPipe;
    }());

    /**
     *  *
      * Where the input expression is a `List` or `String`, and:
      * - `start`: The starting index of the subset to return.
      * - **a positive integer**: return the item at `start` index and all items after
      * in the list or string expression.
      * - **a negative integer**: return the item at `start` index from the end and all items after
      * in the list or string expression.
      * - **if positive and greater than the size of the expression**: return an empty list or string.
      * - **if negative and greater than the size of the expression**: return entire list or string.
      * - `end`: The ending index of the subset to return.
      * - **omitted**: return all items until the end.
      * - **if positive**: return all items before `end` index of the list or string.
      * - **if negative**: return all items before `end` index from the end of the list or string.
      * *
      * All behavior is based on the expected behavior of the JavaScript API `Array.prototype.slice()`
      * and `String.prototype.slice()`.
      * *
      * When operating on a [List], the returned list is always a copy even when all
      * the elements are being returned.
      * *
      * When operating on a blank value, the pipe returns the blank value.
      * *
      * ## List Example
      * *
      * This `ngFor` example:
      * *
      * {@example common/pipes/ts/slice_pipe.ts region='SlicePipe_list'}
      * *
      * produces the following:
      * *
      * <li>b</li>
      * <li>c</li>
      * *
      * ## String Examples
      * *
      * {@example common/pipes/ts/slice_pipe.ts region='SlicePipe_string'}
      * *
     */
    var SlicePipe = (function () {
        function SlicePipe() {
        }
        /**
         * @param {?} value
         * @param {?} start
         * @param {?=} end
         * @return {?}
         */
        SlicePipe.prototype.transform = function (value, start, end) {
            if (isBlank(value))
                return value;
            if (!this.supports(value)) {
                throw new InvalidPipeArgumentError(SlicePipe, value);
            }
            return value.slice(start, end);
        };
        /**
         * @param {?} obj
         * @return {?}
         */
        SlicePipe.prototype.supports = function (obj) { return typeof obj === 'string' || Array.isArray(obj); };
        SlicePipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'slice', pure: false },] },
        ];
        /** @nocollapse */
        SlicePipe.ctorParameters = function () { return []; };
        return SlicePipe;
    }());

    /**
     *  *
      * Converts value into an uppercase string using `String.prototype.toUpperCase()`.
      * *
      * ### Example
      * *
      * {@example common/pipes/ts/lowerupper_pipe.ts region='LowerUpperPipe'}
      * *
     */
    var UpperCasePipe = (function () {
        function UpperCasePipe() {
        }
        /**
         * @param {?} value
         * @return {?}
         */
        UpperCasePipe.prototype.transform = function (value) {
            if (isBlank(value))
                return value;
            if (typeof value !== 'string') {
                throw new InvalidPipeArgumentError(UpperCasePipe, value);
            }
            return value.toUpperCase();
        };
        UpperCasePipe.decorators = [
            { type: _angular_core.Pipe, args: [{ name: 'uppercase' },] },
        ];
        /** @nocollapse */
        UpperCasePipe.ctorParameters = function () { return []; };
        return UpperCasePipe;
    }());

    /**
     * A collection of Angular pipes that are likely to be used in each and every application.
     */
    var /** @type {?} */ COMMON_PIPES = [
        AsyncPipe,
        UpperCasePipe,
        LowerCasePipe,
        JsonPipe,
        SlicePipe,
        DecimalPipe,
        PercentPipe,
        CurrencyPipe,
        DatePipe,
        I18nPluralPipe,
        I18nSelectPipe,
    ];

    /**
     *  The module that includes all the basic Angular directives like {@link NgIf}, {@link NgFor}, ...
      * *
     */
    var CommonModule = (function () {
        function CommonModule() {
        }
        CommonModule.decorators = [
            { type: _angular_core.NgModule, args: [{
                        declarations: [COMMON_DIRECTIVES, COMMON_PIPES],
                        exports: [COMMON_DIRECTIVES, COMMON_PIPES],
                        providers: [
                            { provide: NgLocalization, useClass: NgLocaleLocalization },
                        ],
                    },] },
        ];
        /** @nocollapse */
        CommonModule.ctorParameters = function () { return []; };
        return CommonModule;
    }());

    /**
     * @stable
     */
    var /** @type {?} */ VERSION = new _angular_core.Version('2.4.0');

    exports.NgLocalization = NgLocalization;
    exports.CommonModule = CommonModule;
    exports.NgClass = NgClass;
    exports.NgFor = NgFor;
    exports.NgIf = NgIf;
    exports.NgPlural = NgPlural;
    exports.NgPluralCase = NgPluralCase;
    exports.NgStyle = NgStyle;
    exports.NgSwitch = NgSwitch;
    exports.NgSwitchCase = NgSwitchCase;
    exports.NgSwitchDefault = NgSwitchDefault;
    exports.NgTemplateOutlet = NgTemplateOutlet;
    exports.AsyncPipe = AsyncPipe;
    exports.DatePipe = DatePipe;
    exports.I18nPluralPipe = I18nPluralPipe;
    exports.I18nSelectPipe = I18nSelectPipe;
    exports.JsonPipe = JsonPipe;
    exports.LowerCasePipe = LowerCasePipe;
    exports.CurrencyPipe = CurrencyPipe;
    exports.DecimalPipe = DecimalPipe;
    exports.PercentPipe = PercentPipe;
    exports.SlicePipe = SlicePipe;
    exports.UpperCasePipe = UpperCasePipe;
    exports.VERSION = VERSION;
    exports.Version = _angular_core.Version;
    exports.PlatformLocation = PlatformLocation;
    exports.LocationStrategy = LocationStrategy;
    exports.APP_BASE_HREF = APP_BASE_HREF;
    exports.HashLocationStrategy = HashLocationStrategy;
    exports.PathLocationStrategy = PathLocationStrategy;
    exports.Location = Location;

}));