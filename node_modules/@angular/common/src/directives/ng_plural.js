/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Attribute, Directive, Host, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { NgLocalization, getPluralCategory } from '../localization';
import { SwitchView } from './ng_switch';
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
export var NgPlural = (function () {
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
        { type: Directive, args: [{ selector: '[ngPlural]' },] },
    ];
    /** @nocollapse */
    NgPlural.ctorParameters = function () { return [
        { type: NgLocalization, },
    ]; };
    NgPlural.propDecorators = {
        'ngPlural': [{ type: Input },],
    };
    return NgPlural;
}());
function NgPlural_tsickle_Closure_declarations() {
    /** @type {?} */
    NgPlural.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgPlural.ctorParameters;
    /** @type {?} */
    NgPlural.propDecorators;
    /** @type {?} */
    NgPlural.prototype._switchValue;
    /** @type {?} */
    NgPlural.prototype._activeView;
    /** @type {?} */
    NgPlural.prototype._caseViews;
    /** @type {?} */
    NgPlural.prototype._localization;
}
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
export var NgPluralCase = (function () {
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
        { type: Directive, args: [{ selector: '[ngPluralCase]' },] },
    ];
    /** @nocollapse */
    NgPluralCase.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Attribute, args: ['ngPluralCase',] },] },
        { type: TemplateRef, },
        { type: ViewContainerRef, },
        { type: NgPlural, decorators: [{ type: Host },] },
    ]; };
    return NgPluralCase;
}());
function NgPluralCase_tsickle_Closure_declarations() {
    /** @type {?} */
    NgPluralCase.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgPluralCase.ctorParameters;
    /** @type {?} */
    NgPluralCase.prototype.value;
}
//# sourceMappingURL=ng_plural.js.map