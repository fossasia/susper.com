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
import { Injectable, SecurityContext } from '@angular/core';
import { sanitizeHtml } from './html_sanitizer';
import { sanitizeStyle } from './style_sanitizer';
import { sanitizeUrl } from './url_sanitizer';
export { SecurityContext };
/**
 *  DomSanitizer helps preventing Cross Site Scripting Security bugs (XSS) by sanitizing
  * values to be safe to use in the different DOM contexts.
  * *
  * For example, when binding a URL in an `<a [href]="someValue">` hyperlink, `someValue` will be
  * sanitized so that an attacker cannot inject e.g. a `javascript:` URL that would execute code on
  * the website.
  * *
  * In specific situations, it might be necessary to disable sanitization, for example if the
  * application genuinely needs to produce a `javascript:` style link with a dynamic value in it.
  * Users can bypass security by constructing a value with one of the `bypassSecurityTrust...`
  * methods, and then binding to that value from the template.
  * *
  * These situations should be very rare, and extraordinary care must be taken to avoid creating a
  * Cross Site Scripting (XSS) security bug!
  * *
  * When using `bypassSecurityTrust...`, make sure to call the method as early as possible and as
  * close as possible to the source of the value, to make it easy to verify no security bug is
  * created by its use.
  * *
  * It is not required (and not recommended) to bypass security if the value is safe, e.g. a URL that
  * does not start with a suspicious protocol, or an HTML snippet that does not contain dangerous
  * code. The sanitizer leaves safe values intact.
  * *
  * sanitization for the value passed in. Carefully check and audit all values and code paths going
  * into this call. Make sure any user data is appropriately escaped for this security context.
  * For more detail, see the [Security Guide](http://g.co/ng/security).
  * *
 * @abstract
 */
export var DomSanitizer = (function () {
    function DomSanitizer() {
    }
    /**
     *  Sanitizes a value for use in the given SecurityContext.
      * *
      * If value is trusted for the context, this method will unwrap the contained safe value and use
      * it directly. Otherwise, value will be sanitized to be safe in the given context, for example
      * by replacing URLs that have an unsafe protocol part (such as `javascript:`). The implementation
      * is responsible to make sure that the value can definitely be safely used in the given context.
     * @abstract
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.sanitize = function (context, value) { };
    /**
     *  Bypass security and trust the given value to be safe HTML. Only use this when the bound HTML
      * is unsafe (e.g. contains `<script>` tags) and the code should be executed. The sanitizer will
      * leave safe HTML intact, so in most situations this method should not be used.
      * *
      * **WARNING:** calling this method with untrusted user data exposes your application to XSS
      * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustHtml = function (value) { };
    /**
     *  Bypass security and trust the given value to be safe style value (CSS).
      * *
      * **WARNING:** calling this method with untrusted user data exposes your application to XSS
      * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustStyle = function (value) { };
    /**
     *  Bypass security and trust the given value to be safe JavaScript.
      * *
      * **WARNING:** calling this method with untrusted user data exposes your application to XSS
      * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustScript = function (value) { };
    /**
     *  Bypass security and trust the given value to be a safe style URL, i.e. a value that can be used
      * in hyperlinks or `<img src>`.
      * *
      * **WARNING:** calling this method with untrusted user data exposes your application to XSS
      * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustUrl = function (value) { };
    /**
     *  Bypass security and trust the given value to be a safe resource URL, i.e. a location that may
      * be used to load executable code from, like `<script src>`, or `<iframe src>`.
      * *
      * **WARNING:** calling this method with untrusted user data exposes your application to XSS
      * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustResourceUrl = function (value) { };
    return DomSanitizer;
}());
export var DomSanitizerImpl = (function (_super) {
    __extends(DomSanitizerImpl, _super);
    function DomSanitizerImpl() {
        _super.apply(this, arguments);
    }
    /**
     * @param {?} ctx
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.sanitize = function (ctx, value) {
        if (value == null)
            return null;
        switch (ctx) {
            case SecurityContext.NONE:
                return value;
            case SecurityContext.HTML:
                if (value instanceof SafeHtmlImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'HTML');
                return sanitizeHtml(String(value));
            case SecurityContext.STYLE:
                if (value instanceof SafeStyleImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'Style');
                return sanitizeStyle(value);
            case SecurityContext.SCRIPT:
                if (value instanceof SafeScriptImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'Script');
                throw new Error('unsafe value used in a script context');
            case SecurityContext.URL:
                if (value instanceof SafeResourceUrlImpl || value instanceof SafeUrlImpl) {
                    // Allow resource URLs in URL contexts, they are strictly more trusted.
                    return value.changingThisBreaksApplicationSecurity;
                }
                this.checkNotSafeValue(value, 'URL');
                return sanitizeUrl(String(value));
            case SecurityContext.RESOURCE_URL:
                if (value instanceof SafeResourceUrlImpl) {
                    return value.changingThisBreaksApplicationSecurity;
                }
                this.checkNotSafeValue(value, 'ResourceURL');
                throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
            default:
                throw new Error("Unexpected SecurityContext " + ctx + " (see http://g.co/ng/security#xss)");
        }
    };
    /**
     * @param {?} value
     * @param {?} expectedType
     * @return {?}
     */
    DomSanitizerImpl.prototype.checkNotSafeValue = function (value, expectedType) {
        if (value instanceof SafeValueImpl) {
            throw new Error(("Required a safe " + expectedType + ", got a " + value.getTypeName() + " ") +
                "(see http://g.co/ng/security#xss)");
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustHtml = function (value) { return new SafeHtmlImpl(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustStyle = function (value) { return new SafeStyleImpl(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustScript = function (value) { return new SafeScriptImpl(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustUrl = function (value) { return new SafeUrlImpl(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustResourceUrl = function (value) {
        return new SafeResourceUrlImpl(value);
    };
    DomSanitizerImpl.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DomSanitizerImpl.ctorParameters = function () { return []; };
    return DomSanitizerImpl;
}(DomSanitizer));
function DomSanitizerImpl_tsickle_Closure_declarations() {
    /** @type {?} */
    DomSanitizerImpl.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DomSanitizerImpl.ctorParameters;
}
/**
 * @abstract
 */
var SafeValueImpl = (function () {
    /**
     * @param {?} changingThisBreaksApplicationSecurity
     */
    function SafeValueImpl(changingThisBreaksApplicationSecurity) {
        this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
        // empty
    }
    /**
     * @abstract
     * @return {?}
     */
    SafeValueImpl.prototype.getTypeName = function () { };
    /**
     * @return {?}
     */
    SafeValueImpl.prototype.toString = function () {
        return ("SafeValue must use [property]=binding: " + this.changingThisBreaksApplicationSecurity) +
            " (see http://g.co/ng/security#xss)";
    };
    return SafeValueImpl;
}());
function SafeValueImpl_tsickle_Closure_declarations() {
    /** @type {?} */
    SafeValueImpl.prototype.changingThisBreaksApplicationSecurity;
}
var SafeHtmlImpl = (function (_super) {
    __extends(SafeHtmlImpl, _super);
    function SafeHtmlImpl() {
        _super.apply(this, arguments);
    }
    /**
     * @return {?}
     */
    SafeHtmlImpl.prototype.getTypeName = function () { return 'HTML'; };
    return SafeHtmlImpl;
}(SafeValueImpl));
var SafeStyleImpl = (function (_super) {
    __extends(SafeStyleImpl, _super);
    function SafeStyleImpl() {
        _super.apply(this, arguments);
    }
    /**
     * @return {?}
     */
    SafeStyleImpl.prototype.getTypeName = function () { return 'Style'; };
    return SafeStyleImpl;
}(SafeValueImpl));
var SafeScriptImpl = (function (_super) {
    __extends(SafeScriptImpl, _super);
    function SafeScriptImpl() {
        _super.apply(this, arguments);
    }
    /**
     * @return {?}
     */
    SafeScriptImpl.prototype.getTypeName = function () { return 'Script'; };
    return SafeScriptImpl;
}(SafeValueImpl));
var SafeUrlImpl = (function (_super) {
    __extends(SafeUrlImpl, _super);
    function SafeUrlImpl() {
        _super.apply(this, arguments);
    }
    /**
     * @return {?}
     */
    SafeUrlImpl.prototype.getTypeName = function () { return 'URL'; };
    return SafeUrlImpl;
}(SafeValueImpl));
var SafeResourceUrlImpl = (function (_super) {
    __extends(SafeResourceUrlImpl, _super);
    function SafeResourceUrlImpl() {
        _super.apply(this, arguments);
    }
    /**
     * @return {?}
     */
    SafeResourceUrlImpl.prototype.getTypeName = function () { return 'ResourceURL'; };
    return SafeResourceUrlImpl;
}(SafeValueImpl));
//# sourceMappingURL=dom_sanitization_service.js.map