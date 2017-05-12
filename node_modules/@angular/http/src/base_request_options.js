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
import { Injectable } from '@angular/core';
import { RequestMethod } from './enums';
import { Headers } from './headers';
import { normalizeMethodName } from './http_utils';
import { URLSearchParams } from './url_search_params';
/**
 *  Creates a request options object to be optionally provided when instantiating a
  * {@link Request}.
  * *
  * This class is based on the `RequestInit` description in the [Fetch
  * Spec](https://fetch.spec.whatwg.org/#requestinit).
  * *
  * All values are null by default. Typical defaults can be found in the {@link BaseRequestOptions}
  * class, which sub-classes `RequestOptions`.
  * *
  * ### Example ([live demo](http://plnkr.co/edit/7Wvi3lfLq41aQPKlxB4O?p=preview))
  * *
  * ```typescript
  * import {RequestOptions, Request, RequestMethod} from '@angular/http';
  * *
  * var options = new RequestOptions({
  * method: RequestMethod.Post,
  * url: 'https://google.com'
  * });
  * var req = new Request(options);
  * console.log('req.method:', RequestMethod[req.method]); // Post
  * console.log('options.url:', options.url); // https://google.com
  * ```
  * *
 */
export var RequestOptions = (function () {
    /**
     * @param {?=} __0
     */
    function RequestOptions(_a) {
        var _b = _a === void 0 ? {} : _a, method = _b.method, headers = _b.headers, body = _b.body, url = _b.url, search = _b.search, withCredentials = _b.withCredentials, responseType = _b.responseType;
        this.method = method != null ? normalizeMethodName(method) : null;
        this.headers = headers != null ? headers : null;
        this.body = body != null ? body : null;
        this.url = url != null ? url : null;
        this.search =
            search != null ? (typeof search === 'string' ? new URLSearchParams(search) : search) : null;
        this.withCredentials = withCredentials != null ? withCredentials : null;
        this.responseType = responseType != null ? responseType : null;
    }
    /**
     *  Creates a copy of the `RequestOptions` instance, using the optional input as values to override
      * existing values. This method will not change the values of the instance on which it is being
      * called.
      * *
      * Note that `headers` and `search` will override existing values completely if present in
      * the `options` object. If these values should be merged, it should be done prior to calling
      * `merge` on the `RequestOptions` instance.
      * *
      * ### Example ([live demo](http://plnkr.co/edit/6w8XA8YTkDRcPYpdB9dk?p=preview))
      * *
      * ```typescript
      * import {RequestOptions, Request, RequestMethod} from '@angular/http';
      * *
      * var options = new RequestOptions({
      * method: RequestMethod.Post
      * });
      * var req = new Request(options.merge({
      * url: 'https://google.com'
      * }));
      * console.log('req.method:', RequestMethod[req.method]); // Post
      * console.log('options.url:', options.url); // null
      * console.log('req.url:', req.url); // https://google.com
      * ```
     * @param {?=} options
     * @return {?}
     */
    RequestOptions.prototype.merge = function (options) {
        return new RequestOptions({
            method: options && options.method != null ? options.method : this.method,
            headers: options && options.headers != null ? options.headers : new Headers(this.headers),
            body: options && options.body != null ? options.body : this.body,
            url: options && options.url != null ? options.url : this.url,
            search: options && options.search != null ?
                (typeof options.search === 'string' ? new URLSearchParams(options.search) :
                    options.search.clone()) :
                this.search,
            withCredentials: options && options.withCredentials != null ? options.withCredentials :
                this.withCredentials,
            responseType: options && options.responseType != null ? options.responseType :
                this.responseType
        });
    };
    return RequestOptions;
}());
function RequestOptions_tsickle_Closure_declarations() {
    /**
     * Http method with which to execute a {@link Request}.
     * Acceptable methods are defined in the {@link RequestMethod} enum.
     * @type {?}
     */
    RequestOptions.prototype.method;
    /**
     * {@link Headers} to be attached to a {@link Request}.
     * @type {?}
     */
    RequestOptions.prototype.headers;
    /**
     * Body to be used when creating a {@link Request}.
     * @type {?}
     */
    RequestOptions.prototype.body;
    /**
     * Url with which to perform a {@link Request}.
     * @type {?}
     */
    RequestOptions.prototype.url;
    /**
     * Search parameters to be included in a {@link Request}.
     * @type {?}
     */
    RequestOptions.prototype.search;
    /**
     * Enable use credentials for a {@link Request}.
     * @type {?}
     */
    RequestOptions.prototype.withCredentials;
    /** @type {?} */
    RequestOptions.prototype.responseType;
}
/**
 *  Subclass of {@link RequestOptions}, with default values.
  * *
  * Default values:
  * * method: {@link RequestMethod RequestMethod.Get}
  * * headers: empty {@link Headers} object
  * *
  * This class could be extended and bound to the {@link RequestOptions} class
  * when configuring an {@link Injector}, in order to override the default options
  * used by {@link Http} to create and send {@link Request Requests}.
  * *
  * ### Example ([live demo](http://plnkr.co/edit/LEKVSx?p=preview))
  * *
  * ```typescript
  * import {provide} from '@angular/core';
  * import {bootstrap} from '@angular/platform-browser/browser';
  * import {HTTP_PROVIDERS, Http, BaseRequestOptions, RequestOptions} from '@angular/http';
  * import {App} from './myapp';
  * *
  * class MyOptions extends BaseRequestOptions {
  * search: string = 'coreTeam=true';
  * }
  * *
  * bootstrap(App, [HTTP_PROVIDERS, {provide: RequestOptions, useClass: MyOptions}]);
  * ```
  * *
  * The options could also be extended when manually creating a {@link Request}
  * object.
  * *
  * ### Example ([live demo](http://plnkr.co/edit/oyBoEvNtDhOSfi9YxaVb?p=preview))
  * *
  * ```
  * import {BaseRequestOptions, Request, RequestMethod} from '@angular/http';
  * *
  * var options = new BaseRequestOptions();
  * var req = new Request(options.merge({
  * method: RequestMethod.Post,
  * url: 'https://google.com'
  * }));
  * console.log('req.method:', RequestMethod[req.method]); // Post
  * console.log('options.url:', options.url); // null
  * console.log('req.url:', req.url); // https://google.com
  * ```
  * *
 */
export var BaseRequestOptions = (function (_super) {
    __extends(BaseRequestOptions, _super);
    function BaseRequestOptions() {
        _super.call(this, { method: RequestMethod.Get, headers: new Headers() });
    }
    BaseRequestOptions.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BaseRequestOptions.ctorParameters = function () { return []; };
    return BaseRequestOptions;
}(RequestOptions));
function BaseRequestOptions_tsickle_Closure_declarations() {
    /** @type {?} */
    BaseRequestOptions.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BaseRequestOptions.ctorParameters;
}
//# sourceMappingURL=base_request_options.js.map