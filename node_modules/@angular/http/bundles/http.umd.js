/**
 * @license Angular v2.4.0
 * (c) 2010-2016 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Observable'), require('@angular/platform-browser')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Observable', '@angular/platform-browser'], factory) :
    (factory((global.ng = global.ng || {}, global.ng.http = global.ng.http || {}),global.ng.core,global.Rx,global.ng.platformBrowser));
}(this, function (exports,_angular_core,rxjs_Observable,_angular_platformBrowser) { 'use strict';

    /**
     *  A backend for http that uses the `XMLHttpRequest` browser API.
      * *
      * Take care not to evaluate this in non-browser contexts.
      * *
     */
    var BrowserXhr = (function () {
        function BrowserXhr() {
        }
        /**
         * @return {?}
         */
        BrowserXhr.prototype.build = function () { return ((new XMLHttpRequest())); };
        BrowserXhr.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        BrowserXhr.ctorParameters = function () { return []; };
        return BrowserXhr;
    }());

    var RequestMethod = {};
    RequestMethod.Get = 0;
    RequestMethod.Post = 1;
    RequestMethod.Put = 2;
    RequestMethod.Delete = 3;
    RequestMethod.Options = 4;
    RequestMethod.Head = 5;
    RequestMethod.Patch = 6;
    RequestMethod[RequestMethod.Get] = "Get";
    RequestMethod[RequestMethod.Post] = "Post";
    RequestMethod[RequestMethod.Put] = "Put";
    RequestMethod[RequestMethod.Delete] = "Delete";
    RequestMethod[RequestMethod.Options] = "Options";
    RequestMethod[RequestMethod.Head] = "Head";
    RequestMethod[RequestMethod.Patch] = "Patch";
    var ReadyState = {};
    ReadyState.Unsent = 0;
    ReadyState.Open = 1;
    ReadyState.HeadersReceived = 2;
    ReadyState.Loading = 3;
    ReadyState.Done = 4;
    ReadyState.Cancelled = 5;
    ReadyState[ReadyState.Unsent] = "Unsent";
    ReadyState[ReadyState.Open] = "Open";
    ReadyState[ReadyState.HeadersReceived] = "HeadersReceived";
    ReadyState[ReadyState.Loading] = "Loading";
    ReadyState[ReadyState.Done] = "Done";
    ReadyState[ReadyState.Cancelled] = "Cancelled";
    var ResponseType = {};
    ResponseType.Basic = 0;
    ResponseType.Cors = 1;
    ResponseType.Default = 2;
    ResponseType.Error = 3;
    ResponseType.Opaque = 4;
    ResponseType[ResponseType.Basic] = "Basic";
    ResponseType[ResponseType.Cors] = "Cors";
    ResponseType[ResponseType.Default] = "Default";
    ResponseType[ResponseType.Error] = "Error";
    ResponseType[ResponseType.Opaque] = "Opaque";
    var ContentType = {};
    ContentType.NONE = 0;
    ContentType.JSON = 1;
    ContentType.FORM = 2;
    ContentType.FORM_DATA = 3;
    ContentType.TEXT = 4;
    ContentType.BLOB = 5;
    ContentType.ARRAY_BUFFER = 6;
    ContentType[ContentType.NONE] = "NONE";
    ContentType[ContentType.JSON] = "JSON";
    ContentType[ContentType.FORM] = "FORM";
    ContentType[ContentType.FORM_DATA] = "FORM_DATA";
    ContentType[ContentType.TEXT] = "TEXT";
    ContentType[ContentType.BLOB] = "BLOB";
    ContentType[ContentType.ARRAY_BUFFER] = "ARRAY_BUFFER";
    var ResponseContentType = {};
    ResponseContentType.Text = 0;
    ResponseContentType.Json = 1;
    ResponseContentType.ArrayBuffer = 2;
    ResponseContentType.Blob = 3;
    ResponseContentType[ResponseContentType.Text] = "Text";
    ResponseContentType[ResponseContentType.Json] = "Json";
    ResponseContentType[ResponseContentType.ArrayBuffer] = "ArrayBuffer";
    ResponseContentType[ResponseContentType.Blob] = "Blob";

    /**
     *  Polyfill for [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers/Headers), as
      * specified in the [Fetch Spec](https://fetch.spec.whatwg.org/#headers-class).
      * *
      * The only known difference between this `Headers` implementation and the spec is the
      * lack of an `entries` method.
      * *
      * ### Example
      * *
      * ```
      * import {Headers} from '@angular/http';
      * *
      * var firstHeaders = new Headers();
      * firstHeaders.append('Content-Type', 'image/jpeg');
      * console.log(firstHeaders.get('Content-Type')) //'image/jpeg'
      * *
      * // Create headers from Plain Old JavaScript Object
      * var secondHeaders = new Headers({
      * 'X-My-Custom-Header': 'Angular'
      * });
      * console.log(secondHeaders.get('X-My-Custom-Header')); //'Angular'
      * *
      * var thirdHeaders = new Headers(secondHeaders);
      * console.log(thirdHeaders.get('X-My-Custom-Header')); //'Angular'
      * ```
      * *
     */
    var Headers = (function () {
        /**
         * @param {?=} headers
         */
        function Headers(headers) {
            var _this = this;
            /** @internal header names are lower case */
            this._headers = new Map();
            /** @internal map lower case names to actual names */
            this._normalizedNames = new Map();
            if (!headers) {
                return;
            }
            if (headers instanceof Headers) {
                headers.forEach(function (values, name) {
                    values.forEach(function (value) { return _this.append(name, value); });
                });
                return;
            }
            Object.keys(headers).forEach(function (name) {
                var values = Array.isArray(headers[name]) ? headers[name] : [headers[name]];
                _this.delete(name);
                values.forEach(function (value) { return _this.append(name, value); });
            });
        }
        /**
         *  Returns a new Headers instance from the given DOMString of Response Headers
         * @param {?} headersString
         * @return {?}
         */
        Headers.fromResponseHeaderString = function (headersString) {
            var /** @type {?} */ headers = new Headers();
            headersString.split('\n').forEach(function (line) {
                var /** @type {?} */ index = line.indexOf(':');
                if (index > 0) {
                    var /** @type {?} */ name_1 = line.slice(0, index);
                    var /** @type {?} */ value = line.slice(index + 1).trim();
                    headers.set(name_1, value);
                }
            });
            return headers;
        };
        /**
         *  Appends a header to existing list of header values for a given header name.
         * @param {?} name
         * @param {?} value
         * @return {?}
         */
        Headers.prototype.append = function (name, value) {
            var /** @type {?} */ values = this.getAll(name);
            if (values === null) {
                this.set(name, value);
            }
            else {
                values.push(value);
            }
        };
        /**
         *  Deletes all header values for the given name.
         * @param {?} name
         * @return {?}
         */
        Headers.prototype.delete = function (name) {
            var /** @type {?} */ lcName = name.toLowerCase();
            this._normalizedNames.delete(lcName);
            this._headers.delete(lcName);
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        Headers.prototype.forEach = function (fn) {
            var _this = this;
            this._headers.forEach(function (values, lcName) { return fn(values, _this._normalizedNames.get(lcName), _this._headers); });
        };
        /**
         *  Returns first header that matches given name.
         * @param {?} name
         * @return {?}
         */
        Headers.prototype.get = function (name) {
            var /** @type {?} */ values = this.getAll(name);
            if (values === null) {
                return null;
            }
            return values.length > 0 ? values[0] : null;
        };
        /**
         *  Checks for existence of header by given name.
         * @param {?} name
         * @return {?}
         */
        Headers.prototype.has = function (name) { return this._headers.has(name.toLowerCase()); };
        /**
         *  Returns the names of the headers
         * @return {?}
         */
        Headers.prototype.keys = function () { return Array.from(this._normalizedNames.values()); };
        /**
         *  Sets or overrides header value for given name.
         * @param {?} name
         * @param {?} value
         * @return {?}
         */
        Headers.prototype.set = function (name, value) {
            if (Array.isArray(value)) {
                if (value.length) {
                    this._headers.set(name.toLowerCase(), [value.join(',')]);
                }
            }
            else {
                this._headers.set(name.toLowerCase(), [value]);
            }
            this.mayBeSetNormalizedName(name);
        };
        /**
         *  Returns values of all headers.
         * @return {?}
         */
        Headers.prototype.values = function () { return Array.from(this._headers.values()); };
        /**
         * @return {?}
         */
        Headers.prototype.toJSON = function () {
            var _this = this;
            var /** @type {?} */ serialized = {};
            this._headers.forEach(function (values, name) {
                var /** @type {?} */ split = [];
                values.forEach(function (v) { return split.push.apply(split, v.split(',')); });
                serialized[_this._normalizedNames.get(name)] = split;
            });
            return serialized;
        };
        /**
         *  Returns list of header values for a given name.
         * @param {?} name
         * @return {?}
         */
        Headers.prototype.getAll = function (name) {
            return this.has(name) ? this._headers.get(name.toLowerCase()) : null;
        };
        /**
         *  This method is not implemented.
         * @return {?}
         */
        Headers.prototype.entries = function () { throw new Error('"entries" method is not implemented on Headers class'); };
        /**
         * @param {?} name
         * @return {?}
         */
        Headers.prototype.mayBeSetNormalizedName = function (name) {
            var /** @type {?} */ lcName = name.toLowerCase();
            if (!this._normalizedNames.has(lcName)) {
                this._normalizedNames.set(lcName, name);
            }
        };
        return Headers;
    }());

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
     *  Creates a response options object to be optionally provided when instantiating a
      * {@link Response}.
      * *
      * This class is based on the `ResponseInit` description in the [Fetch
      * Spec](https://fetch.spec.whatwg.org/#responseinit).
      * *
      * All values are null by default. Typical defaults can be found in the
      * {@link BaseResponseOptions} class, which sub-classes `ResponseOptions`.
      * *
      * This class may be used in tests to build {@link Response Responses} for
      * mock responses (see {@link MockBackend}).
      * *
      * ### Example ([live demo](http://plnkr.co/edit/P9Jkk8e8cz6NVzbcxEsD?p=preview))
      * *
      * ```typescript
      * import {ResponseOptions, Response} from '@angular/http';
      * *
      * var options = new ResponseOptions({
      * body: '{"name":"Jeff"}'
      * });
      * var res = new Response(options);
      * *
      * console.log('res.json():', res.json()); // Object {name: "Jeff"}
      * ```
      * *
     */
    var ResponseOptions = (function () {
        /**
         * @param {?=} __0
         */
        function ResponseOptions(_a) {
            var _b = _a === void 0 ? {} : _a, body = _b.body, status = _b.status, headers = _b.headers, statusText = _b.statusText, type = _b.type, url = _b.url;
            this.body = body != null ? body : null;
            this.status = status != null ? status : null;
            this.headers = headers != null ? headers : null;
            this.statusText = statusText != null ? statusText : null;
            this.type = type != null ? type : null;
            this.url = url != null ? url : null;
        }
        /**
         *  Creates a copy of the `ResponseOptions` instance, using the optional input as values to
          * override
          * existing values. This method will not change the values of the instance on which it is being
          * called.
          * *
          * This may be useful when sharing a base `ResponseOptions` object inside tests,
          * where certain properties may change from test to test.
          * *
          * ### Example ([live demo](http://plnkr.co/edit/1lXquqFfgduTFBWjNoRE?p=preview))
          * *
          * ```typescript
          * import {ResponseOptions, Response} from '@angular/http';
          * *
          * var options = new ResponseOptions({
          * body: {name: 'Jeff'}
          * });
          * var res = new Response(options.merge({
          * url: 'https://google.com'
          * }));
          * console.log('options.url:', options.url); // null
          * console.log('res.json():', res.json()); // Object {name: "Jeff"}
          * console.log('res.url:', res.url); // https://google.com
          * ```
         * @param {?=} options
         * @return {?}
         */
        ResponseOptions.prototype.merge = function (options) {
            return new ResponseOptions({
                body: options && options.body != null ? options.body : this.body,
                status: options && options.status != null ? options.status : this.status,
                headers: options && options.headers != null ? options.headers : this.headers,
                statusText: options && options.statusText != null ? options.statusText : this.statusText,
                type: options && options.type != null ? options.type : this.type,
                url: options && options.url != null ? options.url : this.url,
            });
        };
        return ResponseOptions;
    }());
    /**
     *  Subclass of {@link ResponseOptions}, with default values.
      * *
      * Default values:
      * * status: 200
      * * headers: empty {@link Headers} object
      * *
      * This class could be extended and bound to the {@link ResponseOptions} class
      * when configuring an {@link Injector}, in order to override the default options
      * used by {@link Http} to create {@link Response Responses}.
      * *
      * ### Example ([live demo](http://plnkr.co/edit/qv8DLT?p=preview))
      * *
      * ```typescript
      * import {provide} from '@angular/core';
      * import {bootstrap} from '@angular/platform-browser/browser';
      * import {HTTP_PROVIDERS, Headers, Http, BaseResponseOptions, ResponseOptions} from
      * '@angular/http';
      * import {App} from './myapp';
      * *
      * class MyOptions extends BaseResponseOptions {
      * headers:Headers = new Headers({network: 'github'});
      * }
      * *
      * bootstrap(App, [HTTP_PROVIDERS, {provide: ResponseOptions, useClass: MyOptions}]);
      * ```
      * *
      * The options could also be extended when manually creating a {@link Response}
      * object.
      * *
      * ### Example ([live demo](http://plnkr.co/edit/VngosOWiaExEtbstDoix?p=preview))
      * *
      * ```
      * import {BaseResponseOptions, Response} from '@angular/http';
      * *
      * var options = new BaseResponseOptions();
      * var res = new Response(options.merge({
      * body: 'Angular',
      * headers: new Headers({framework: 'angular'})
      * }));
      * console.log('res.headers.get("framework"):', res.headers.get('framework')); // angular
      * console.log('res.text():', res.text()); // Angular;
      * ```
      * *
     */
    var BaseResponseOptions = (function (_super) {
        __extends$1(BaseResponseOptions, _super);
        function BaseResponseOptions() {
            _super.call(this, { status: 200, statusText: 'Ok', type: ResponseType.Default, headers: new Headers() });
        }
        BaseResponseOptions.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        BaseResponseOptions.ctorParameters = function () { return []; };
        return BaseResponseOptions;
    }(ResponseOptions));

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     *  Abstract class from which real backends are derived.
      * *
      * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
      * {@link Request}.
      * *
     * @abstract
     */
    var ConnectionBackend = (function () {
        function ConnectionBackend() {
        }
        /**
         * @abstract
         * @param {?} request
         * @return {?}
         */
        ConnectionBackend.prototype.createConnection = function (request) { };
        return ConnectionBackend;
    }());
    /**
     *  Abstract class from which real connections are derived.
      * *
     * @abstract
     */
    var Connection = (function () {
        function Connection() {
        }
        return Connection;
    }());
    /**
     *  An XSRFStrategy configures XSRF protection (e.g. via headers) on an HTTP request.
      * *
     * @abstract
     */
    var XSRFStrategy = (function () {
        function XSRFStrategy() {
        }
        /**
         * @abstract
         * @param {?} req
         * @return {?}
         */
        XSRFStrategy.prototype.configureRequest = function (req) { };
        return XSRFStrategy;
    }());

    /**
     * @param {?} method
     * @return {?}
     */
    function normalizeMethodName(method) {
        if (typeof method !== 'string')
            return method;
        switch (method.toUpperCase()) {
            case 'GET':
                return RequestMethod.Get;
            case 'POST':
                return RequestMethod.Post;
            case 'PUT':
                return RequestMethod.Put;
            case 'DELETE':
                return RequestMethod.Delete;
            case 'OPTIONS':
                return RequestMethod.Options;
            case 'HEAD':
                return RequestMethod.Head;
            case 'PATCH':
                return RequestMethod.Patch;
        }
        throw new Error("Invalid request method. The method \"" + method + "\" is not supported.");
    }
    var /** @type {?} */ isSuccess = function (status) { return (status >= 200 && status < 300); };
    /**
     * @param {?} xhr
     * @return {?}
     */
    function getResponseURL(xhr) {
        if ('responseURL' in xhr) {
            return xhr.responseURL;
        }
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
            return xhr.getResponseHeader('X-Request-URL');
        }
        return;
    }
    /**
     * @param {?} input
     * @return {?}
     */
    function stringToArrayBuffer(input) {
        var /** @type {?} */ view = new Uint16Array(input.length);
        for (var /** @type {?} */ i = 0, /** @type {?} */ strLen = input.length; i < strLen; i++) {
            view[i] = input.charCodeAt(i);
        }
        return view.buffer;
    }

    /**
     * @license undefined
      * Copyright Google Inc. All Rights Reserved.
      * *
      * Use of this source code is governed by an MIT-style license that can be
      * found in the LICENSE file at https://angular.io/license
     * @param {?=} rawParams
     * @return {?}
     */
    function paramParser(rawParams) {
        if (rawParams === void 0) { rawParams = ''; }
        var /** @type {?} */ map = new Map();
        if (rawParams.length > 0) {
            var /** @type {?} */ params = rawParams.split('&');
            params.forEach(function (param) {
                var /** @type {?} */ eqIdx = param.indexOf('=');
                var _a = eqIdx == -1 ? [param, ''] : [param.slice(0, eqIdx), param.slice(eqIdx + 1)], key = _a[0], val = _a[1];
                var /** @type {?} */ list = map.get(key) || [];
                list.push(val);
                map.set(key, list);
            });
        }
        return map;
    }
    /**
     *  *
     */
    var QueryEncoder = (function () {
        function QueryEncoder() {
        }
        /**
         * @param {?} k
         * @return {?}
         */
        QueryEncoder.prototype.encodeKey = function (k) { return standardEncoding(k); };
        /**
         * @param {?} v
         * @return {?}
         */
        QueryEncoder.prototype.encodeValue = function (v) { return standardEncoding(v); };
        return QueryEncoder;
    }());
    /**
     * @param {?} v
     * @return {?}
     */
    function standardEncoding(v) {
        return encodeURIComponent(v)
            .replace(/%40/gi, '@')
            .replace(/%3A/gi, ':')
            .replace(/%24/gi, '$')
            .replace(/%2C/gi, ',')
            .replace(/%3B/gi, ';')
            .replace(/%2B/gi, '+')
            .replace(/%3D/gi, '=')
            .replace(/%3F/gi, '?')
            .replace(/%2F/gi, '/');
    }
    /**
     *  Map-like representation of url search parameters, based on
      * [URLSearchParams](https://url.spec.whatwg.org/#urlsearchparams) in the url living standard,
      * with several extensions for merging URLSearchParams objects:
      * - setAll()
      * - appendAll()
      * - replaceAll()
      * *
      * This class accepts an optional second parameter of ${@link QueryEncoder},
      * which is used to serialize parameters before making a request. By default,
      * `QueryEncoder` encodes keys and values of parameters using `encodeURIComponent`,
      * and then un-encodes certain characters that are allowed to be part of the query
      * according to IETF RFC 3986: https://tools.ietf.org/html/rfc3986.
      * *
      * These are the characters that are not encoded: `! $ \' ( ) * + , ; A 9 - . _ ~ ? /`
      * *
      * If the set of allowed query characters is not acceptable for a particular backend,
      * `QueryEncoder` can be subclassed and provided as the 2nd argument to URLSearchParams.
      * *
      * ```
      * import {URLSearchParams, QueryEncoder} from '@angular/http';
      * class MyQueryEncoder extends QueryEncoder {
      * encodeKey(k: string): string {
      * return myEncodingFunction(k);
      * }
      * *
      * encodeValue(v: string): string {
      * return myEncodingFunction(v);
      * }
      * }
      * *
      * let params = new URLSearchParams('', new MyQueryEncoder());
      * ```
     */
    var URLSearchParams = (function () {
        /**
         * @param {?=} rawParams
         * @param {?=} queryEncoder
         */
        function URLSearchParams(rawParams, queryEncoder) {
            if (rawParams === void 0) { rawParams = ''; }
            if (queryEncoder === void 0) { queryEncoder = new QueryEncoder(); }
            this.rawParams = rawParams;
            this.queryEncoder = queryEncoder;
            this.paramsMap = paramParser(rawParams);
        }
        /**
         * @return {?}
         */
        URLSearchParams.prototype.clone = function () {
            var /** @type {?} */ clone = new URLSearchParams('', this.queryEncoder);
            clone.appendAll(this);
            return clone;
        };
        /**
         * @param {?} param
         * @return {?}
         */
        URLSearchParams.prototype.has = function (param) { return this.paramsMap.has(param); };
        /**
         * @param {?} param
         * @return {?}
         */
        URLSearchParams.prototype.get = function (param) {
            var /** @type {?} */ storedParam = this.paramsMap.get(param);
            return Array.isArray(storedParam) ? storedParam[0] : null;
        };
        /**
         * @param {?} param
         * @return {?}
         */
        URLSearchParams.prototype.getAll = function (param) { return this.paramsMap.get(param) || []; };
        /**
         * @param {?} param
         * @param {?} val
         * @return {?}
         */
        URLSearchParams.prototype.set = function (param, val) {
            if (val === void 0 || val === null) {
                this.delete(param);
                return;
            }
            var /** @type {?} */ list = this.paramsMap.get(param) || [];
            list.length = 0;
            list.push(val);
            this.paramsMap.set(param, list);
        };
        /**
         * @param {?} searchParams
         * @return {?}
         */
        URLSearchParams.prototype.setAll = function (searchParams) {
            var _this = this;
            searchParams.paramsMap.forEach(function (value, param) {
                var /** @type {?} */ list = _this.paramsMap.get(param) || [];
                list.length = 0;
                list.push(value[0]);
                _this.paramsMap.set(param, list);
            });
        };
        /**
         * @param {?} param
         * @param {?} val
         * @return {?}
         */
        URLSearchParams.prototype.append = function (param, val) {
            if (val === void 0 || val === null)
                return;
            var /** @type {?} */ list = this.paramsMap.get(param) || [];
            list.push(val);
            this.paramsMap.set(param, list);
        };
        /**
         * @param {?} searchParams
         * @return {?}
         */
        URLSearchParams.prototype.appendAll = function (searchParams) {
            var _this = this;
            searchParams.paramsMap.forEach(function (value, param) {
                var /** @type {?} */ list = _this.paramsMap.get(param) || [];
                for (var /** @type {?} */ i = 0; i < value.length; ++i) {
                    list.push(value[i]);
                }
                _this.paramsMap.set(param, list);
            });
        };
        /**
         * @param {?} searchParams
         * @return {?}
         */
        URLSearchParams.prototype.replaceAll = function (searchParams) {
            var _this = this;
            searchParams.paramsMap.forEach(function (value, param) {
                var /** @type {?} */ list = _this.paramsMap.get(param) || [];
                list.length = 0;
                for (var /** @type {?} */ i = 0; i < value.length; ++i) {
                    list.push(value[i]);
                }
                _this.paramsMap.set(param, list);
            });
        };
        /**
         * @return {?}
         */
        URLSearchParams.prototype.toString = function () {
            var _this = this;
            var /** @type {?} */ paramsList = [];
            this.paramsMap.forEach(function (values, k) {
                values.forEach(function (v) { return paramsList.push(_this.queryEncoder.encodeKey(k) + '=' + _this.queryEncoder.encodeValue(v)); });
            });
            return paramsList.join('&');
        };
        /**
         * @param {?} param
         * @return {?}
         */
        URLSearchParams.prototype.delete = function (param) { this.paramsMap.delete(param); };
        return URLSearchParams;
    }());

    /**
     *  HTTP request body used by both {@link Request} and {@link Response}
      * https://fetch.spec.whatwg.org/#body
     * @abstract
     */
    var Body = (function () {
        function Body() {
        }
        /**
         *  Attempts to return body as parsed `JSON` object, or raises an exception.
         * @return {?}
         */
        Body.prototype.json = function () {
            if (typeof this._body === 'string') {
                return JSON.parse(/** @type {?} */ (this._body));
            }
            if (this._body instanceof ArrayBuffer) {
                return JSON.parse(this.text());
            }
            return this._body;
        };
        /**
         *  Returns the body as a string, presuming `toString()` can be called on the response body.
         * @return {?}
         */
        Body.prototype.text = function () {
            if (this._body instanceof URLSearchParams) {
                return this._body.toString();
            }
            if (this._body instanceof ArrayBuffer) {
                return String.fromCharCode.apply(null, new Uint16Array(/** @type {?} */ (this._body)));
            }
            if (this._body == null) {
                return '';
            }
            if (typeof this._body === 'object') {
                return JSON.stringify(this._body, null, 2);
            }
            return this._body.toString();
        };
        /**
         *  Return the body as an ArrayBuffer
         * @return {?}
         */
        Body.prototype.arrayBuffer = function () {
            if (this._body instanceof ArrayBuffer) {
                return (this._body);
            }
            return stringToArrayBuffer(this.text());
        };
        /**
         *  Returns the request's body as a Blob, assuming that body exists.
         * @return {?}
         */
        Body.prototype.blob = function () {
            if (this._body instanceof Blob) {
                return (this._body);
            }
            if (this._body instanceof ArrayBuffer) {
                return new Blob([this._body]);
            }
            throw new Error('The request body isn\'t either a blob or an array buffer');
        };
        return Body;
    }());

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
     *  Creates `Response` instances from provided values.
      * *
      * Though this object isn't
      * usually instantiated by end-users, it is the primary object interacted with when it comes time to
      * add data to a view.
      * *
      * ### Example
      * *
      * ```
      * http.request('my-friends.txt').subscribe(response => this.friends = response.text());
      * ```
      * *
      * The Response's interface is inspired by the Response constructor defined in the [Fetch
      * Spec](https://fetch.spec.whatwg.org/#response-class), but is considered a static value whose body
      * can be accessed many times. There are other differences in the implementation, but this is the
      * most significant.
      * *
     */
    var Response = (function (_super) {
        __extends$2(Response, _super);
        /**
         * @param {?} responseOptions
         */
        function Response(responseOptions) {
            _super.call(this);
            this._body = responseOptions.body;
            this.status = responseOptions.status;
            this.ok = (this.status >= 200 && this.status <= 299);
            this.statusText = responseOptions.statusText;
            this.headers = responseOptions.headers;
            this.type = responseOptions.type;
            this.url = responseOptions.url;
        }
        /**
         * @return {?}
         */
        Response.prototype.toString = function () {
            return "Response with status: " + this.status + " " + this.statusText + " for URL: " + this.url;
        };
        return Response;
    }(Body));

    var /** @type {?} */ _nextRequestId = 0;
    var /** @type {?} */ JSONP_HOME = '__ng_jsonp__';
    var /** @type {?} */ _jsonpConnections = null;
    /**
     * @return {?}
     */
    function _getJsonpConnections() {
        var /** @type {?} */ w = typeof window == 'object' ? window : {};
        if (_jsonpConnections === null) {
            _jsonpConnections = w[JSONP_HOME] = {};
        }
        return _jsonpConnections;
    }
    // Make sure not to evaluate this in a non-browser environment!
    var BrowserJsonp = (function () {
        function BrowserJsonp() {
        }
        /**
         * @param {?} url
         * @return {?}
         */
        BrowserJsonp.prototype.build = function (url) {
            var /** @type {?} */ node = document.createElement('script');
            node.src = url;
            return node;
        };
        /**
         * @return {?}
         */
        BrowserJsonp.prototype.nextRequestID = function () { return "__req" + _nextRequestId++; };
        /**
         * @param {?} id
         * @return {?}
         */
        BrowserJsonp.prototype.requestCallback = function (id) { return JSONP_HOME + "." + id + ".finished"; };
        /**
         * @param {?} id
         * @param {?} connection
         * @return {?}
         */
        BrowserJsonp.prototype.exposeConnection = function (id, connection) {
            var /** @type {?} */ connections = _getJsonpConnections();
            connections[id] = connection;
        };
        /**
         * @param {?} id
         * @return {?}
         */
        BrowserJsonp.prototype.removeConnection = function (id) {
            var /** @type {?} */ connections = _getJsonpConnections();
            connections[id] = null;
        };
        /**
         * @param {?} node
         * @return {?}
         */
        BrowserJsonp.prototype.send = function (node) { document.body.appendChild(/** @type {?} */ ((node))); };
        /**
         * @param {?} node
         * @return {?}
         */
        BrowserJsonp.prototype.cleanup = function (node) {
            if (node.parentNode) {
                node.parentNode.removeChild(/** @type {?} */ ((node)));
            }
        };
        BrowserJsonp.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        BrowserJsonp.ctorParameters = function () { return []; };
        return BrowserJsonp;
    }());

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
    var /** @type {?} */ JSONP_ERR_NO_CALLBACK = 'JSONP injected script did not invoke callback.';
    var /** @type {?} */ JSONP_ERR_WRONG_METHOD = 'JSONP requests must use GET request method.';
    /**
     *  Abstract base class for an in-flight JSONP request.
      * *
     * @abstract
     */
    var JSONPConnection = (function () {
        function JSONPConnection() {
        }
        /**
         *  Callback called when the JSONP request completes, to notify the application
          * of the new data.
         * @abstract
         * @param {?=} data
         * @return {?}
         */
        JSONPConnection.prototype.finished = function (data) { };
        return JSONPConnection;
    }());
    var JSONPConnection_ = (function (_super) {
        __extends(JSONPConnection_, _super);
        /**
         * @param {?} req
         * @param {?} _dom
         * @param {?=} baseResponseOptions
         */
        function JSONPConnection_(req, _dom, baseResponseOptions) {
            var _this = this;
            _super.call(this);
            this._dom = _dom;
            this.baseResponseOptions = baseResponseOptions;
            this._finished = false;
            if (req.method !== RequestMethod.Get) {
                throw new TypeError(JSONP_ERR_WRONG_METHOD);
            }
            this.request = req;
            this.response = new rxjs_Observable.Observable(function (responseObserver) {
                _this.readyState = ReadyState.Loading;
                var id = _this._id = _dom.nextRequestID();
                _dom.exposeConnection(id, _this);
                // Workaround Dart
                // url = url.replace(/=JSONP_CALLBACK(&|$)/, `generated method`);
                var callback = _dom.requestCallback(_this._id);
                var url = req.url;
                if (url.indexOf('=JSONP_CALLBACK&') > -1) {
                    url = url.replace('=JSONP_CALLBACK&', "=" + callback + "&");
                }
                else if (url.lastIndexOf('=JSONP_CALLBACK') === url.length - '=JSONP_CALLBACK'.length) {
                    url = url.substring(0, url.length - '=JSONP_CALLBACK'.length) + ("=" + callback);
                }
                var script = _this._script = _dom.build(url);
                var onLoad = function (event) {
                    if (_this.readyState === ReadyState.Cancelled)
                        return;
                    _this.readyState = ReadyState.Done;
                    _dom.cleanup(script);
                    if (!_this._finished) {
                        var responseOptions_1 = new ResponseOptions({ body: JSONP_ERR_NO_CALLBACK, type: ResponseType.Error, url: url });
                        if (baseResponseOptions) {
                            responseOptions_1 = baseResponseOptions.merge(responseOptions_1);
                        }
                        responseObserver.error(new Response(responseOptions_1));
                        return;
                    }
                    var responseOptions = new ResponseOptions({ body: _this._responseData, url: url });
                    if (_this.baseResponseOptions) {
                        responseOptions = _this.baseResponseOptions.merge(responseOptions);
                    }
                    responseObserver.next(new Response(responseOptions));
                    responseObserver.complete();
                };
                var onError = function (error) {
                    if (_this.readyState === ReadyState.Cancelled)
                        return;
                    _this.readyState = ReadyState.Done;
                    _dom.cleanup(script);
                    var responseOptions = new ResponseOptions({ body: error.message, type: ResponseType.Error });
                    if (baseResponseOptions) {
                        responseOptions = baseResponseOptions.merge(responseOptions);
                    }
                    responseObserver.error(new Response(responseOptions));
                };
                script.addEventListener('load', onLoad);
                script.addEventListener('error', onError);
                _dom.send(script);
                return function () {
                    _this.readyState = ReadyState.Cancelled;
                    script.removeEventListener('load', onLoad);
                    script.removeEventListener('error', onError);
                    _this._dom.cleanup(script);
                };
            });
        }
        /**
         * @param {?=} data
         * @return {?}
         */
        JSONPConnection_.prototype.finished = function (data) {
            // Don't leak connections
            this._finished = true;
            this._dom.removeConnection(this._id);
            if (this.readyState === ReadyState.Cancelled)
                return;
            this._responseData = data;
        };
        return JSONPConnection_;
    }(JSONPConnection));
    /**
     *  A {@link ConnectionBackend} that uses the JSONP strategy of making requests.
      * *
     * @abstract
     */
    var JSONPBackend = (function (_super) {
        __extends(JSONPBackend, _super);
        function JSONPBackend() {
            _super.apply(this, arguments);
        }
        return JSONPBackend;
    }(ConnectionBackend));
    var JSONPBackend_ = (function (_super) {
        __extends(JSONPBackend_, _super);
        /**
         * @param {?} _browserJSONP
         * @param {?} _baseResponseOptions
         */
        function JSONPBackend_(_browserJSONP, _baseResponseOptions) {
            _super.call(this);
            this._browserJSONP = _browserJSONP;
            this._baseResponseOptions = _baseResponseOptions;
        }
        /**
         * @param {?} request
         * @return {?}
         */
        JSONPBackend_.prototype.createConnection = function (request) {
            return new JSONPConnection_(request, this._browserJSONP, this._baseResponseOptions);
        };
        JSONPBackend_.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        JSONPBackend_.ctorParameters = function () { return [
            { type: BrowserJsonp, },
            { type: ResponseOptions, },
        ]; };
        return JSONPBackend_;
    }(JSONPBackend));

    var /** @type {?} */ XSSI_PREFIX = /^\)\]\}',?\n/;
    /**
     *  Creates connections using `XMLHttpRequest`. Given a fully-qualified
      * request, an `XHRConnection` will immediately create an `XMLHttpRequest` object and send the
      * request.
      * *
      * This class would typically not be created or interacted with directly inside applications, though
      * the {@link MockConnection} may be interacted with in tests.
      * *
     */
    var XHRConnection = (function () {
        /**
         * @param {?} req
         * @param {?} browserXHR
         * @param {?=} baseResponseOptions
         */
        function XHRConnection(req, browserXHR, baseResponseOptions) {
            var _this = this;
            this.request = req;
            this.response = new rxjs_Observable.Observable(function (responseObserver) {
                var _xhr = browserXHR.build();
                _xhr.open(RequestMethod[req.method].toUpperCase(), req.url);
                if (req.withCredentials != null) {
                    _xhr.withCredentials = req.withCredentials;
                }
                // load event handler
                var onLoad = function () {
                    // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                    var status = _xhr.status === 1223 ? 204 : _xhr.status;
                    var body = null;
                    // HTTP 204 means no content
                    if (status !== 204) {
                        // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                        // response/responseType properties were introduced in ResourceLoader Level2 spec
                        // (supported by IE10)
                        body = (typeof _xhr.response === 'undefined') ? _xhr.responseText : _xhr.response;
                        // Implicitly strip a potential XSSI prefix.
                        if (typeof body === 'string') {
                            body = body.replace(XSSI_PREFIX, '');
                        }
                    }
                    // fix status code when it is 0 (0 status is undocumented).
                    // Occurs when accessing file resources or on Android 4.1 stock browser
                    // while retrieving files from application cache.
                    if (status === 0) {
                        status = body ? 200 : 0;
                    }
                    var headers = Headers.fromResponseHeaderString(_xhr.getAllResponseHeaders());
                    // IE 9 does not provide the way to get URL of response
                    var url = getResponseURL(_xhr) || req.url;
                    var statusText = _xhr.statusText || 'OK';
                    var responseOptions = new ResponseOptions({ body: body, status: status, headers: headers, statusText: statusText, url: url });
                    if (baseResponseOptions != null) {
                        responseOptions = baseResponseOptions.merge(responseOptions);
                    }
                    var response = new Response(responseOptions);
                    response.ok = isSuccess(status);
                    if (response.ok) {
                        responseObserver.next(response);
                        // TODO(gdi2290): defer complete if array buffer until done
                        responseObserver.complete();
                        return;
                    }
                    responseObserver.error(response);
                };
                // error event handler
                var onError = function (err) {
                    var responseOptions = new ResponseOptions({
                        body: err,
                        type: ResponseType.Error,
                        status: _xhr.status,
                        statusText: _xhr.statusText,
                    });
                    if (baseResponseOptions != null) {
                        responseOptions = baseResponseOptions.merge(responseOptions);
                    }
                    responseObserver.error(new Response(responseOptions));
                };
                _this.setDetectedContentType(req, _xhr);
                if (req.headers == null) {
                    req.headers = new Headers();
                }
                if (!req.headers.has('Accept')) {
                    req.headers.append('Accept', 'application/json, text/plain, */*');
                }
                req.headers.forEach(function (values, name) { return _xhr.setRequestHeader(name, values.join(',')); });
                // Select the correct buffer type to store the response
                if (req.responseType != null && _xhr.responseType != null) {
                    switch (req.responseType) {
                        case ResponseContentType.ArrayBuffer:
                            _xhr.responseType = 'arraybuffer';
                            break;
                        case ResponseContentType.Json:
                            _xhr.responseType = 'json';
                            break;
                        case ResponseContentType.Text:
                            _xhr.responseType = 'text';
                            break;
                        case ResponseContentType.Blob:
                            _xhr.responseType = 'blob';
                            break;
                        default:
                            throw new Error('The selected responseType is not supported');
                    }
                }
                _xhr.addEventListener('load', onLoad);
                _xhr.addEventListener('error', onError);
                _xhr.send(_this.request.getBody());
                return function () {
                    _xhr.removeEventListener('load', onLoad);
                    _xhr.removeEventListener('error', onError);
                    _xhr.abort();
                };
            });
        }
        /**
         * @param {?} req
         * @param {?} _xhr
         * @return {?}
         */
        XHRConnection.prototype.setDetectedContentType = function (req /** TODO Request */, _xhr /** XMLHttpRequest */) {
            // Skip if a custom Content-Type header is provided
            if (req.headers != null && req.headers.get('Content-Type') != null) {
                return;
            }
            // Set the detected content type
            switch (req.contentType) {
                case ContentType.NONE:
                    break;
                case ContentType.JSON:
                    _xhr.setRequestHeader('content-type', 'application/json');
                    break;
                case ContentType.FORM:
                    _xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                    break;
                case ContentType.TEXT:
                    _xhr.setRequestHeader('content-type', 'text/plain');
                    break;
                case ContentType.BLOB:
                    var /** @type {?} */ blob = req.blob();
                    if (blob.type) {
                        _xhr.setRequestHeader('content-type', blob.type);
                    }
                    break;
            }
        };
        return XHRConnection;
    }());
    /**
     *  `XSRFConfiguration` sets up Cross Site Request Forgery (XSRF) protection for the application
      * using a cookie. See {@link https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)}
      * for more information on XSRF.
      * *
      * Applications can configure custom cookie and header names by binding an instance of this class
      * with different `cookieName` and `headerName` values. See the main HTTP documentation for more
      * details.
      * *
     */
    var CookieXSRFStrategy = (function () {
        /**
         * @param {?=} _cookieName
         * @param {?=} _headerName
         */
        function CookieXSRFStrategy(_cookieName, _headerName) {
            if (_cookieName === void 0) { _cookieName = 'XSRF-TOKEN'; }
            if (_headerName === void 0) { _headerName = 'X-XSRF-TOKEN'; }
            this._cookieName = _cookieName;
            this._headerName = _headerName;
        }
        /**
         * @param {?} req
         * @return {?}
         */
        CookieXSRFStrategy.prototype.configureRequest = function (req) {
            var /** @type {?} */ xsrfToken = _angular_platformBrowser.__platform_browser_private__.getDOM().getCookie(this._cookieName);
            if (xsrfToken) {
                req.headers.set(this._headerName, xsrfToken);
            }
        };
        return CookieXSRFStrategy;
    }());
    /**
     *  Creates {@link XHRConnection} instances.
      * *
      * This class would typically not be used by end users, but could be
      * overridden if a different backend implementation should be used,
      * such as in a node backend.
      * *
      * ### Example
      * *
      * ```
      * import {Http, MyNodeBackend, HTTP_PROVIDERS, BaseRequestOptions} from '@angular/http';
      * viewProviders: [
      * HTTP_PROVIDERS,
      * {provide: Http, useFactory: (backend, options) => {
      * return new Http(backend, options);
      * }, deps: [MyNodeBackend, BaseRequestOptions]}]
      * })
      * class MyComponent {
      * constructor(http:Http) {
      * http.request('people.json').subscribe(res => this.people = res.json());
      * }
      * }
      * ```
     */
    var XHRBackend = (function () {
        /**
         * @param {?} _browserXHR
         * @param {?} _baseResponseOptions
         * @param {?} _xsrfStrategy
         */
        function XHRBackend(_browserXHR, _baseResponseOptions, _xsrfStrategy) {
            this._browserXHR = _browserXHR;
            this._baseResponseOptions = _baseResponseOptions;
            this._xsrfStrategy = _xsrfStrategy;
        }
        /**
         * @param {?} request
         * @return {?}
         */
        XHRBackend.prototype.createConnection = function (request) {
            this._xsrfStrategy.configureRequest(request);
            return new XHRConnection(request, this._browserXHR, this._baseResponseOptions);
        };
        XHRBackend.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        XHRBackend.ctorParameters = function () { return [
            { type: BrowserXhr, },
            { type: ResponseOptions, },
            { type: XSRFStrategy, },
        ]; };
        return XHRBackend;
    }());

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
    var RequestOptions = (function () {
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
    var BaseRequestOptions = (function (_super) {
        __extends$3(BaseRequestOptions, _super);
        function BaseRequestOptions() {
            _super.call(this, { method: RequestMethod.Get, headers: new Headers() });
        }
        BaseRequestOptions.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        BaseRequestOptions.ctorParameters = function () { return []; };
        return BaseRequestOptions;
    }(RequestOptions));

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __extends$5 = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     *  Creates `Request` instances from provided values.
      * *
      * The Request's interface is inspired by the Request constructor defined in the [Fetch
      * Spec](https://fetch.spec.whatwg.org/#request-class),
      * but is considered a static value whose body can be accessed many times. There are other
      * differences in the implementation, but this is the most significant.
      * *
      * `Request` instances are typically created by higher-level classes, like {@link Http} and
      * {@link Jsonp}, but it may occasionally be useful to explicitly create `Request` instances.
      * One such example is when creating services that wrap higher-level services, like {@link Http},
      * where it may be useful to generate a `Request` with arbitrary headers and search params.
      * *
      * ```typescript
      * import {Injectable, Injector} from '@angular/core';
      * import {HTTP_PROVIDERS, Http, Request, RequestMethod} from '@angular/http';
      * *
      * class AutoAuthenticator {
      * constructor(public http:Http) {}
      * request(url:string) {
      * return this.http.request(new Request({
      * method: RequestMethod.Get,
      * url: url,
      * search: 'password=123'
      * }));
      * }
      * }
      * *
      * var injector = Injector.resolveAndCreate([HTTP_PROVIDERS, AutoAuthenticator]);
      * var authenticator = injector.get(AutoAuthenticator);
      * authenticator.request('people.json').subscribe(res => {
      * //URL should have included '?password=123'
      * console.log('people', res.json());
      * });
      * ```
      * *
     */
    var Request = (function (_super) {
        __extends$5(Request, _super);
        /**
         * @param {?} requestOptions
         */
        function Request(requestOptions) {
            _super.call(this);
            // TODO: assert that url is present
            var url = requestOptions.url;
            this.url = requestOptions.url;
            if (requestOptions.search) {
                var search = requestOptions.search.toString();
                if (search.length > 0) {
                    var prefix = '?';
                    if (this.url.indexOf('?') != -1) {
                        prefix = (this.url[this.url.length - 1] == '&') ? '' : '&';
                    }
                    // TODO: just delete search-query-looking string in url?
                    this.url = url + prefix + search;
                }
            }
            this._body = requestOptions.body;
            this.method = normalizeMethodName(requestOptions.method);
            // TODO(jeffbcross): implement behavior
            // Defaults to 'omit', consistent with browser
            this.headers = new Headers(requestOptions.headers);
            this.contentType = this.detectContentType();
            this.withCredentials = requestOptions.withCredentials;
            this.responseType = requestOptions.responseType;
        }
        /**
         *  Returns the content type enum based on header options.
         * @return {?}
         */
        Request.prototype.detectContentType = function () {
            switch (this.headers.get('content-type')) {
                case 'application/json':
                    return ContentType.JSON;
                case 'application/x-www-form-urlencoded':
                    return ContentType.FORM;
                case 'multipart/form-data':
                    return ContentType.FORM_DATA;
                case 'text/plain':
                case 'text/html':
                    return ContentType.TEXT;
                case 'application/octet-stream':
                    return ContentType.BLOB;
                default:
                    return this.detectContentTypeFromBody();
            }
        };
        /**
         *  Returns the content type of request's body based on its type.
         * @return {?}
         */
        Request.prototype.detectContentTypeFromBody = function () {
            if (this._body == null) {
                return ContentType.NONE;
            }
            else if (this._body instanceof URLSearchParams) {
                return ContentType.FORM;
            }
            else if (this._body instanceof FormData) {
                return ContentType.FORM_DATA;
            }
            else if (this._body instanceof Blob$1) {
                return ContentType.BLOB;
            }
            else if (this._body instanceof ArrayBuffer$1) {
                return ContentType.ARRAY_BUFFER;
            }
            else if (this._body && typeof this._body == 'object') {
                return ContentType.JSON;
            }
            else {
                return ContentType.TEXT;
            }
        };
        /**
         *  Returns the request's body according to its type. If body is undefined, return
          * null.
         * @return {?}
         */
        Request.prototype.getBody = function () {
            switch (this.contentType) {
                case ContentType.JSON:
                    return this.text();
                case ContentType.FORM:
                    return this.text();
                case ContentType.FORM_DATA:
                    return this._body;
                case ContentType.TEXT:
                    return this.text();
                case ContentType.BLOB:
                    return this.blob();
                case ContentType.ARRAY_BUFFER:
                    return this.arrayBuffer();
                default:
                    return null;
            }
        };
        return Request;
    }(Body));
    var /** @type {?} */ noop = function () { };
    var /** @type {?} */ w = typeof window == 'object' ? window : noop;
    var /** @type {?} */ FormData = ((w) /** TODO #9100 */)['FormData'] || noop;
    var /** @type {?} */ Blob$1 = ((w) /** TODO #9100 */)['Blob'] || noop;
    var /** @type {?} */ ArrayBuffer$1 = ((w) /** TODO #9100 */)['ArrayBuffer'] || noop;

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __extends$4 = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * @param {?} backend
     * @param {?} request
     * @return {?}
     */
    function httpRequest(backend, request) {
        return backend.createConnection(request).response;
    }
    /**
     * @param {?} defaultOpts
     * @param {?} providedOpts
     * @param {?} method
     * @param {?} url
     * @return {?}
     */
    function mergeOptions(defaultOpts, providedOpts, method, url) {
        var /** @type {?} */ newOptions = defaultOpts;
        if (providedOpts) {
            // Hack so Dart can used named parameters
            return newOptions.merge(new RequestOptions({
                method: providedOpts.method || method,
                url: providedOpts.url || url,
                search: providedOpts.search,
                headers: providedOpts.headers,
                body: providedOpts.body,
                withCredentials: providedOpts.withCredentials,
                responseType: providedOpts.responseType
            }));
        }
        return newOptions.merge(new RequestOptions({ method: method, url: url }));
    }
    /**
     *  Performs http requests using `XMLHttpRequest` as the default backend.
      * *
      * `Http` is available as an injectable class, with methods to perform http requests. Calling
      * `request` returns an `Observable` which will emit a single {@link Response} when a
      * response is received.
      * *
      * ### Example
      * *
      * ```typescript
      * import {Http, HTTP_PROVIDERS} from '@angular/http';
      * import 'rxjs/add/operator/map'
      * selector: 'http-app',
      * viewProviders: [HTTP_PROVIDERS],
      * templateUrl: 'people.html'
      * })
      * class PeopleComponent {
      * constructor(http: Http) {
      * http.get('people.json')
      * // Call map on the response observable to get the parsed people object
      * .map(res => res.json())
      * // Subscribe to the observable to get the parsed people object and attach it to the
      * // component
      * .subscribe(people => this.people = people);
      * }
      * }
      * ```
      * *
      * *
      * ### Example
      * *
      * ```
      * http.get('people.json').subscribe((res:Response) => this.people = res.json());
      * ```
      * *
      * The default construct used to perform requests, `XMLHttpRequest`, is abstracted as a "Backend" (
      * {@link XHRBackend} in this case), which could be mocked with dependency injection by replacing
      * the {@link XHRBackend} provider, as in the following example:
      * *
      * ### Example
      * *
      * ```typescript
      * import {BaseRequestOptions, Http} from '@angular/http';
      * import {MockBackend} from '@angular/http/testing';
      * var injector = Injector.resolveAndCreate([
      * BaseRequestOptions,
      * MockBackend,
      * {provide: Http, useFactory:
      * function(backend, defaultOptions) {
      * return new Http(backend, defaultOptions);
      * },
      * deps: [MockBackend, BaseRequestOptions]}
      * ]);
      * var http = injector.get(Http);
      * http.get('request-from-mock-backend.json').subscribe((res:Response) => doSomething(res));
      * ```
      * *
     */
    var Http = (function () {
        /**
         * @param {?} _backend
         * @param {?} _defaultOptions
         */
        function Http(_backend, _defaultOptions) {
            this._backend = _backend;
            this._defaultOptions = _defaultOptions;
        }
        /**
         *  Performs any type of http request. First argument is required, and can either be a url or
          * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
          * object can be provided as the 2nd argument. The options object will be merged with the values
          * of {@link BaseRequestOptions} before performing the request.
         * @param {?} url
         * @param {?=} options
         * @return {?}
         */
        Http.prototype.request = function (url, options) {
            var /** @type {?} */ responseObservable;
            if (typeof url === 'string') {
                responseObservable = httpRequest(this._backend, new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Get, /** @type {?} */ (url))));
            }
            else if (url instanceof Request) {
                responseObservable = httpRequest(this._backend, url);
            }
            else {
                throw new Error('First argument must be a url string or Request instance.');
            }
            return responseObservable;
        };
        /**
         *  Performs a request with `get` http method.
         * @param {?} url
         * @param {?=} options
         * @return {?}
         */
        Http.prototype.get = function (url, options) {
            return this.request(new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Get, url)));
        };
        /**
         *  Performs a request with `post` http method.
         * @param {?} url
         * @param {?} body
         * @param {?=} options
         * @return {?}
         */
        Http.prototype.post = function (url, body, options) {
            return this.request(new Request(mergeOptions(this._defaultOptions.merge(new RequestOptions({ body: body })), options, RequestMethod.Post, url)));
        };
        /**
         *  Performs a request with `put` http method.
         * @param {?} url
         * @param {?} body
         * @param {?=} options
         * @return {?}
         */
        Http.prototype.put = function (url, body, options) {
            return this.request(new Request(mergeOptions(this._defaultOptions.merge(new RequestOptions({ body: body })), options, RequestMethod.Put, url)));
        };
        /**
         *  Performs a request with `delete` http method.
         * @param {?} url
         * @param {?=} options
         * @return {?}
         */
        Http.prototype.delete = function (url, options) {
            return this.request(new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Delete, url)));
        };
        /**
         *  Performs a request with `patch` http method.
         * @param {?} url
         * @param {?} body
         * @param {?=} options
         * @return {?}
         */
        Http.prototype.patch = function (url, body, options) {
            return this.request(new Request(mergeOptions(this._defaultOptions.merge(new RequestOptions({ body: body })), options, RequestMethod.Patch, url)));
        };
        /**
         *  Performs a request with `head` http method.
         * @param {?} url
         * @param {?=} options
         * @return {?}
         */
        Http.prototype.head = function (url, options) {
            return this.request(new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Head, url)));
        };
        /**
         *  Performs a request with `options` http method.
         * @param {?} url
         * @param {?=} options
         * @return {?}
         */
        Http.prototype.options = function (url, options) {
            return this.request(new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Options, url)));
        };
        Http.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        Http.ctorParameters = function () { return [
            { type: ConnectionBackend, },
            { type: RequestOptions, },
        ]; };
        return Http;
    }());
    /**
     * @experimental
     */
    var Jsonp = (function (_super) {
        __extends$4(Jsonp, _super);
        /**
         * @param {?} backend
         * @param {?} defaultOptions
         */
        function Jsonp(backend, defaultOptions) {
            _super.call(this, backend, defaultOptions);
        }
        /**
         *  Performs any type of http request. First argument is required, and can either be a url or
          * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
          * object can be provided as the 2nd argument. The options object will be merged with the values
          * of {@link BaseRequestOptions} before performing the request.
          * *
          * supported by all current browsers. Because JSONP creates a `<script>` element with
          * contents retrieved from a remote source, attacker-controlled data introduced by an untrusted
          * source could expose your application to XSS risks. Data exposed by JSONP may also be
          * readable by malicious third-party websites. In addition, JSONP introduces potential risk for
          * future security issues (e.g. content sniffing).  For more detail, see the
          * [Security Guide](http://g.co/ng/security).
         * @param {?} url
         * @param {?=} options
         * @return {?}
         */
        Jsonp.prototype.request = function (url, options) {
            var /** @type {?} */ responseObservable;
            if (typeof url === 'string') {
                url =
                    new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Get, /** @type {?} */ (url)));
            }
            if (url instanceof Request) {
                if (url.method !== RequestMethod.Get) {
                    throw new Error('JSONP requests must use GET request method.');
                }
                responseObservable = httpRequest(this._backend, url);
            }
            else {
                throw new Error('First argument must be a url string or Request instance.');
            }
            return responseObservable;
        };
        Jsonp.decorators = [
            { type: _angular_core.Injectable },
        ];
        /** @nocollapse */
        Jsonp.ctorParameters = function () { return [
            { type: ConnectionBackend, },
            { type: RequestOptions, },
        ]; };
        return Jsonp;
    }(Http));

    /**
     * @return {?}
     */
    function _createDefaultCookieXSRFStrategy() {
        return new CookieXSRFStrategy();
    }
    /**
     * @param {?} xhrBackend
     * @param {?} requestOptions
     * @return {?}
     */
    function httpFactory(xhrBackend, requestOptions) {
        return new Http(xhrBackend, requestOptions);
    }
    /**
     * @param {?} jsonpBackend
     * @param {?} requestOptions
     * @return {?}
     */
    function jsonpFactory(jsonpBackend, requestOptions) {
        return new Jsonp(jsonpBackend, requestOptions);
    }
    /**
     *  The module that includes http's providers
      * *
     */
    var HttpModule = (function () {
        function HttpModule() {
        }
        HttpModule.decorators = [
            { type: _angular_core.NgModule, args: [{
                        providers: [
                            // TODO(pascal): use factory type annotations once supported in DI
                            // issue: https://github.com/angular/angular/issues/3183
                            { provide: Http, useFactory: httpFactory, deps: [XHRBackend, RequestOptions] },
                            BrowserXhr,
                            { provide: RequestOptions, useClass: BaseRequestOptions },
                            { provide: ResponseOptions, useClass: BaseResponseOptions },
                            XHRBackend,
                            { provide: XSRFStrategy, useFactory: _createDefaultCookieXSRFStrategy },
                        ],
                    },] },
        ];
        /** @nocollapse */
        HttpModule.ctorParameters = function () { return []; };
        return HttpModule;
    }());
    /**
     *  The module that includes jsonp's providers
      * *
     */
    var JsonpModule = (function () {
        function JsonpModule() {
        }
        JsonpModule.decorators = [
            { type: _angular_core.NgModule, args: [{
                        providers: [
                            // TODO(pascal): use factory type annotations once supported in DI
                            // issue: https://github.com/angular/angular/issues/3183
                            { provide: Jsonp, useFactory: jsonpFactory, deps: [JSONPBackend, RequestOptions] },
                            BrowserJsonp,
                            { provide: RequestOptions, useClass: BaseRequestOptions },
                            { provide: ResponseOptions, useClass: BaseResponseOptions },
                            { provide: JSONPBackend, useClass: JSONPBackend_ },
                        ],
                    },] },
        ];
        /** @nocollapse */
        JsonpModule.ctorParameters = function () { return []; };
        return JsonpModule;
    }());

    /**
     * @stable
     */
    var /** @type {?} */ VERSION = new _angular_core.Version('2.4.0');

    exports.BrowserXhr = BrowserXhr;
    exports.JSONPBackend = JSONPBackend;
    exports.JSONPConnection = JSONPConnection;
    exports.CookieXSRFStrategy = CookieXSRFStrategy;
    exports.XHRBackend = XHRBackend;
    exports.XHRConnection = XHRConnection;
    exports.BaseRequestOptions = BaseRequestOptions;
    exports.RequestOptions = RequestOptions;
    exports.BaseResponseOptions = BaseResponseOptions;
    exports.ResponseOptions = ResponseOptions;
    exports.ReadyState = ReadyState;
    exports.RequestMethod = RequestMethod;
    exports.ResponseContentType = ResponseContentType;
    exports.ResponseType = ResponseType;
    exports.Headers = Headers;
    exports.Http = Http;
    exports.Jsonp = Jsonp;
    exports.HttpModule = HttpModule;
    exports.JsonpModule = JsonpModule;
    exports.Connection = Connection;
    exports.ConnectionBackend = ConnectionBackend;
    exports.XSRFStrategy = XSRFStrategy;
    exports.Request = Request;
    exports.Response = Response;
    exports.QueryEncoder = QueryEncoder;
    exports.URLSearchParams = URLSearchParams;
    exports.VERSION = VERSION;

}));