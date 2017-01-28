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
import { DomAdapter } from '../dom/dom_adapter';
import { isPresent } from '../facade/lang';
/**
 *  Provides DOM operations in any browser environment.
  * *
  * can introduce XSS risks.
 * @abstract
 */
export var GenericBrowserDomAdapter = (function (_super) {
    __extends(GenericBrowserDomAdapter, _super);
    function GenericBrowserDomAdapter() {
        var _this = this;
        _super.call(this);
        this._animationPrefix = null;
        this._transitionEnd = null;
        try {
            var element_1 = this.createElement('div', this.defaultDoc());
            if (isPresent(this.getStyle(element_1, 'animationName'))) {
                this._animationPrefix = '';
            }
            else {
                var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (isPresent(this.getStyle(element_1, domPrefixes[i] + 'AnimationName'))) {
                        this._animationPrefix = '-' + domPrefixes[i].toLowerCase() + '-';
                        break;
                    }
                }
            }
            var transEndEventNames_1 = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
            };
            Object.keys(transEndEventNames_1).forEach(function (key) {
                if (isPresent(_this.getStyle(element_1, key))) {
                    _this._transitionEnd = transEndEventNames_1[key];
                }
            });
        }
        catch (e) {
            this._animationPrefix = null;
            this._transitionEnd = null;
        }
    }
    /**
     * @param {?} el
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.getDistributedNodes = function (el) { return ((el)).getDistributedNodes(); };
    /**
     * @param {?} el
     * @param {?} baseUrl
     * @param {?} href
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.resolveAndSetHref = function (el, baseUrl, href) {
        el.href = href == null ? baseUrl : baseUrl + '/../' + href;
    };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.supportsDOMEvents = function () { return true; };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.supportsNativeShadowDOM = function () {
        return typeof ((this.defaultDoc().body)).createShadowRoot === 'function';
    };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.getAnimationPrefix = function () { return this._animationPrefix ? this._animationPrefix : ''; };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.getTransitionEnd = function () { return this._transitionEnd ? this._transitionEnd : ''; };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.supportsAnimation = function () {
        return isPresent(this._animationPrefix) && isPresent(this._transitionEnd);
    };
    return GenericBrowserDomAdapter;
}(DomAdapter));
function GenericBrowserDomAdapter_tsickle_Closure_declarations() {
    /** @type {?} */
    GenericBrowserDomAdapter.prototype._animationPrefix;
    /** @type {?} */
    GenericBrowserDomAdapter.prototype._transitionEnd;
}
//# sourceMappingURL=generic_browser_adapter.js.map