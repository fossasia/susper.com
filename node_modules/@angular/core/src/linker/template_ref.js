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
import { ElementRef } from './element_ref';
/**
 *  Represents an Embedded Template that can be used to instantiate Embedded Views.
  * *
  * You can access a `TemplateRef`, in two ways. Via a directive placed on a `<template>` element (or
  * directive prefixed with `*`) and have the `TemplateRef` for this Embedded View injected into the
  * constructor of the directive using the `TemplateRef` Token. Alternatively you can query for the
  * `TemplateRef` from a Component or a Directive via {@link Query}.
  * *
  * To instantiate Embedded Views based on a Template, use
  * {@link ViewContainerRef#createEmbeddedView}, which will create the View and attach it to the
  * View Container.
 * @abstract
 */
export var TemplateRef = (function () {
    function TemplateRef() {
    }
    Object.defineProperty(TemplateRef.prototype, "elementRef", {
        /**
         * @return {?}
         */
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    /**
     * @abstract
     * @param {?} context
     * @return {?}
     */
    TemplateRef.prototype.createEmbeddedView = function (context) { };
    return TemplateRef;
}());
export var TemplateRef_ = (function (_super) {
    __extends(TemplateRef_, _super);
    /**
     * @param {?} _parentView
     * @param {?} _nodeIndex
     * @param {?} _nativeElement
     */
    function TemplateRef_(_parentView, _nodeIndex, _nativeElement) {
        _super.call(this);
        this._parentView = _parentView;
        this._nodeIndex = _nodeIndex;
        this._nativeElement = _nativeElement;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    TemplateRef_.prototype.createEmbeddedView = function (context) {
        var /** @type {?} */ view = this._parentView.createEmbeddedViewInternal(this._nodeIndex);
        view.create(context || ({}));
        return view.ref;
    };
    Object.defineProperty(TemplateRef_.prototype, "elementRef", {
        /**
         * @return {?}
         */
        get: function () { return new ElementRef(this._nativeElement); },
        enumerable: true,
        configurable: true
    });
    return TemplateRef_;
}(TemplateRef));
function TemplateRef__tsickle_Closure_declarations() {
    /** @type {?} */
    TemplateRef_.prototype._parentView;
    /** @type {?} */
    TemplateRef_.prototype._nodeIndex;
    /** @type {?} */
    TemplateRef_.prototype._nativeElement;
}
//# sourceMappingURL=template_ref.js.map