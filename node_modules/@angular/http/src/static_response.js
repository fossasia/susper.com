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
import { Body } from './body';
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
export var Response = (function (_super) {
    __extends(Response, _super);
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
function Response_tsickle_Closure_declarations() {
    /**
     * One of "basic", "cors", "default", "error, or "opaque".
     * *
     * Defaults to "default".
     * @type {?}
     */
    Response.prototype.type;
    /**
     * True if the response's status is within 200-299
     * @type {?}
     */
    Response.prototype.ok;
    /**
     * URL of response.
     * *
     * Defaults to empty string.
     * @type {?}
     */
    Response.prototype.url;
    /**
     * Status code returned by server.
     * *
     * Defaults to 200.
     * @type {?}
     */
    Response.prototype.status;
    /**
     * Text representing the corresponding reason phrase to the `status`, as defined in [ietf rfc 2616
     * section 6.1.1](https://tools.ietf.org/html/rfc2616#section-6.1.1)
     * *
     * Defaults to "OK"
     * @type {?}
     */
    Response.prototype.statusText;
    /**
     * Non-standard property
     * *
     * Denotes how many of the response body's bytes have been loaded, for example if the response is
     * the result of a progress event.
     * @type {?}
     */
    Response.prototype.bytesLoaded;
    /**
     * Non-standard property
     * *
     * Denotes how many bytes are expected in the final response body.
     * @type {?}
     */
    Response.prototype.totalBytes;
    /**
     * Headers object based on the `Headers` class in the [Fetch
     * Spec](https://fetch.spec.whatwg.org/#headers-class).
     * @type {?}
     */
    Response.prototype.headers;
}
//# sourceMappingURL=static_response.js.map