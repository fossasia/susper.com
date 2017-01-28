/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Input, IterableDiffers, KeyValueDiffers, Renderer } from '@angular/core';
import { isListLikeIterable } from '../facade/collection';
import { isPresent, stringify } from '../facade/lang';
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
export var NgClass = (function () {
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
        { type: Directive, args: [{ selector: '[ngClass]' },] },
    ];
    /** @nocollapse */
    NgClass.ctorParameters = function () { return [
        { type: IterableDiffers, },
        { type: KeyValueDiffers, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    NgClass.propDecorators = {
        'klass': [{ type: Input, args: ['class',] },],
        'ngClass': [{ type: Input },],
    };
    return NgClass;
}());
function NgClass_tsickle_Closure_declarations() {
    /** @type {?} */
    NgClass.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgClass.ctorParameters;
    /** @type {?} */
    NgClass.propDecorators;
    /** @type {?} */
    NgClass.prototype._iterableDiffer;
    /** @type {?} */
    NgClass.prototype._keyValueDiffer;
    /** @type {?} */
    NgClass.prototype._initialClasses;
    /** @type {?} */
    NgClass.prototype._rawClass;
    /** @type {?} */
    NgClass.prototype._iterableDiffers;
    /** @type {?} */
    NgClass.prototype._keyValueDiffers;
    /** @type {?} */
    NgClass.prototype._ngEl;
    /** @type {?} */
    NgClass.prototype._renderer;
}
//# sourceMappingURL=ng_class.js.map