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
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from './dom_tokens';
export var SharedStylesHost = (function () {
    function SharedStylesHost() {
        /** @internal */
        this._styles = [];
        /** @internal */
        this._stylesSet = new Set();
    }
    /**
     * @param {?} styles
     * @return {?}
     */
    SharedStylesHost.prototype.addStyles = function (styles) {
        var _this = this;
        var /** @type {?} */ additions = [];
        styles.forEach(function (style) {
            if (!_this._stylesSet.has(style)) {
                _this._stylesSet.add(style);
                _this._styles.push(style);
                additions.push(style);
            }
        });
        this.onStylesAdded(additions);
    };
    /**
     * @param {?} additions
     * @return {?}
     */
    SharedStylesHost.prototype.onStylesAdded = function (additions) { };
    /**
     * @return {?}
     */
    SharedStylesHost.prototype.getAllStyles = function () { return this._styles; };
    SharedStylesHost.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SharedStylesHost.ctorParameters = function () { return []; };
    return SharedStylesHost;
}());
function SharedStylesHost_tsickle_Closure_declarations() {
    /** @type {?} */
    SharedStylesHost.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SharedStylesHost.ctorParameters;
    /** @type {?} */
    SharedStylesHost.prototype._styles;
    /** @type {?} */
    SharedStylesHost.prototype._stylesSet;
}
export var DomSharedStylesHost = (function (_super) {
    __extends(DomSharedStylesHost, _super);
    /**
     * @param {?} doc
     */
    function DomSharedStylesHost(doc) {
        _super.call(this);
        this._hostNodes = new Set();
        this._hostNodes.add(doc.head);
    }
    /**
     * @param {?} styles
     * @param {?} host
     * @return {?}
     */
    DomSharedStylesHost.prototype._addStylesToHost = function (styles, host) {
        for (var /** @type {?} */ i = 0; i < styles.length; i++) {
            var /** @type {?} */ styleEl = document.createElement('style');
            styleEl.textContent = styles[i];
            host.appendChild(styleEl);
        }
    };
    /**
     * @param {?} hostNode
     * @return {?}
     */
    DomSharedStylesHost.prototype.addHost = function (hostNode) {
        this._addStylesToHost(this._styles, hostNode);
        this._hostNodes.add(hostNode);
    };
    /**
     * @param {?} hostNode
     * @return {?}
     */
    DomSharedStylesHost.prototype.removeHost = function (hostNode) { this._hostNodes.delete(hostNode); };
    /**
     * @param {?} additions
     * @return {?}
     */
    DomSharedStylesHost.prototype.onStylesAdded = function (additions) {
        var _this = this;
        this._hostNodes.forEach(function (hostNode) { _this._addStylesToHost(additions, hostNode); });
    };
    DomSharedStylesHost.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DomSharedStylesHost.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    ]; };
    return DomSharedStylesHost;
}(SharedStylesHost));
function DomSharedStylesHost_tsickle_Closure_declarations() {
    /** @type {?} */
    DomSharedStylesHost.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DomSharedStylesHost.ctorParameters;
    /** @type {?} */
    DomSharedStylesHost.prototype._hostNodes;
}
//# sourceMappingURL=shared_styles_host.js.map