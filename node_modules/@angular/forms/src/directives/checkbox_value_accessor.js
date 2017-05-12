/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Renderer, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
export var /** @type {?} */ CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return CheckboxControlValueAccessor; }),
    multi: true,
};
/**
 *  The accessor for writing a value and listening to changes on a checkbox input element.
  * *
  * ### Example
  * ```
  * <input type="checkbox" name="rememberLogin" ngModel>
  * ```
  * *
  * @stable
 */
export var CheckboxControlValueAccessor = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function CheckboxControlValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    /**
     * @param {?} value
     * @return {?}
     */
    CheckboxControlValueAccessor.prototype.writeValue = function (value) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'checked', value);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    CheckboxControlValueAccessor.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    CheckboxControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    CheckboxControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    CheckboxControlValueAccessor.decorators = [
        { type: Directive, args: [{
                    selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
                    host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
                    providers: [CHECKBOX_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    CheckboxControlValueAccessor.ctorParameters = function () { return [
        { type: Renderer, },
        { type: ElementRef, },
    ]; };
    return CheckboxControlValueAccessor;
}());
function CheckboxControlValueAccessor_tsickle_Closure_declarations() {
    /** @type {?} */
    CheckboxControlValueAccessor.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CheckboxControlValueAccessor.ctorParameters;
    /** @type {?} */
    CheckboxControlValueAccessor.prototype.onChange;
    /** @type {?} */
    CheckboxControlValueAccessor.prototype.onTouched;
    /** @type {?} */
    CheckboxControlValueAccessor.prototype._renderer;
    /** @type {?} */
    CheckboxControlValueAccessor.prototype._elementRef;
}
//# sourceMappingURL=checkbox_value_accessor.js.map