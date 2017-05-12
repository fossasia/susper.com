/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Input, KeyValueDiffers, Renderer } from '@angular/core';
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
export var NgStyle = (function () {
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
        { type: Directive, args: [{ selector: '[ngStyle]' },] },
    ];
    /** @nocollapse */
    NgStyle.ctorParameters = function () { return [
        { type: KeyValueDiffers, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    NgStyle.propDecorators = {
        'ngStyle': [{ type: Input },],
    };
    return NgStyle;
}());
function NgStyle_tsickle_Closure_declarations() {
    /** @type {?} */
    NgStyle.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgStyle.ctorParameters;
    /** @type {?} */
    NgStyle.propDecorators;
    /** @type {?} */
    NgStyle.prototype._ngStyle;
    /** @type {?} */
    NgStyle.prototype._differ;
    /** @type {?} */
    NgStyle.prototype._differs;
    /** @type {?} */
    NgStyle.prototype._ngEl;
    /** @type {?} */
    NgStyle.prototype._renderer;
}
//# sourceMappingURL=ng_style.js.map