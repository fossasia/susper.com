/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Host, Input, Optional, Renderer, forwardRef } from '@angular/core';
import { isPrimitive, looseIdentical } from '../facade/lang';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
export var /** @type {?} */ SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return SelectControlValueAccessor; }),
    multi: true
};
/**
 * @param {?} id
 * @param {?} value
 * @return {?}
 */
function _buildValueString(id, value) {
    if (id == null)
        return "" + value;
    if (!isPrimitive(value))
        value = 'Object';
    return (id + ": " + value).slice(0, 50);
}
/**
 * @param {?} valueString
 * @return {?}
 */
function _extractId(valueString) {
    return valueString.split(':')[0];
}
/**
 *  *
  * Used by {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName}
  * to keep the view synced with the {@link FormControl} model.
  * *
  * *
  * If you have imported the {@link FormsModule} or the {@link ReactiveFormsModule}, this
  * value accessor will be active on any select control that has a form directive. You do
  * **not** need to add a special selector to activate it.
  * *
  * ### How to use select controls with form directives
  * *
  * To use a select in a template-driven form, simply add an `ngModel` and a `name`
  * attribute to the main `<select>` tag.
  * *
  * If your option values are simple strings, you can bind to the normal `value` property
  * on the option.  If your option values happen to be objects (and you'd like to save the
  * selection in your form as an object), use `ngValue` instead:
  * *
  * {@example forms/ts/selectControl/select_control_example.ts region='Component'}
  * *
  * In reactive forms, you'll also want to add your form directive (`formControlName` or
  * `formControl`) on the main `<select>` tag. Like in the former example, you have the
  * choice of binding to the  `value` or `ngValue` property on the select's options.
  * *
  * {@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
  * *
  * Note: We listen to the 'change' event because 'input' events aren't fired
  * for selects in Firefox and IE:
  * https://bugzilla.mozilla.org/show_bug.cgi?id=1024350
  * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4660045/
  * *
  * * **npm package**: `@angular/forms`
  * *
 */
export var SelectControlValueAccessor = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function SelectControlValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    /**
     * @param {?} value
     * @return {?}
     */
    SelectControlValueAccessor.prototype.writeValue = function (value) {
        this.value = value;
        var /** @type {?} */ valueString = _buildValueString(this._getOptionId(value), value);
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', valueString);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    SelectControlValueAccessor.prototype.registerOnChange = function (fn) {
        var _this = this;
        this.onChange = function (valueString) {
            _this.value = valueString;
            fn(_this._getOptionValue(valueString));
        };
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    SelectControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    SelectControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    /**
     * @return {?}
     */
    SelectControlValueAccessor.prototype._registerOption = function () { return (this._idCounter++).toString(); };
    /**
     * @param {?} value
     * @return {?}
     */
    SelectControlValueAccessor.prototype._getOptionId = function (value) {
        for (var _i = 0, _a = Array.from(this._optionMap.keys()); _i < _a.length; _i++) {
            var id = _a[_i];
            if (looseIdentical(this._optionMap.get(id), value))
                return id;
        }
        return null;
    };
    /**
     * @param {?} valueString
     * @return {?}
     */
    SelectControlValueAccessor.prototype._getOptionValue = function (valueString) {
        var /** @type {?} */ id = _extractId(valueString);
        return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
    };
    SelectControlValueAccessor.decorators = [
        { type: Directive, args: [{
                    selector: 'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
                    host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                    providers: [SELECT_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    SelectControlValueAccessor.ctorParameters = function () { return [
        { type: Renderer, },
        { type: ElementRef, },
    ]; };
    return SelectControlValueAccessor;
}());
function SelectControlValueAccessor_tsickle_Closure_declarations() {
    /** @type {?} */
    SelectControlValueAccessor.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SelectControlValueAccessor.ctorParameters;
    /** @type {?} */
    SelectControlValueAccessor.prototype.value;
    /** @type {?} */
    SelectControlValueAccessor.prototype._optionMap;
    /** @type {?} */
    SelectControlValueAccessor.prototype._idCounter;
    /** @type {?} */
    SelectControlValueAccessor.prototype.onChange;
    /** @type {?} */
    SelectControlValueAccessor.prototype.onTouched;
    /** @type {?} */
    SelectControlValueAccessor.prototype._renderer;
    /** @type {?} */
    SelectControlValueAccessor.prototype._elementRef;
}
/**
 *  *
  * *
  * See docs for {@link SelectControlValueAccessor} for usage examples.
  * *
 */
export var NgSelectOption = (function () {
    /**
     * @param {?} _element
     * @param {?} _renderer
     * @param {?} _select
     */
    function NgSelectOption(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select)
            this.id = this._select._registerOption();
    }
    Object.defineProperty(NgSelectOption.prototype, "ngValue", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._select == null)
                return;
            this._select._optionMap.set(this.id, value);
            this._setElementValue(_buildValueString(this.id, value));
            this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgSelectOption.prototype, "value", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._setElementValue(value);
            if (this._select)
                this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} value
     * @return {?}
     */
    NgSelectOption.prototype._setElementValue = function (value) {
        this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
    };
    /**
     * @return {?}
     */
    NgSelectOption.prototype.ngOnDestroy = function () {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    };
    NgSelectOption.decorators = [
        { type: Directive, args: [{ selector: 'option' },] },
    ];
    /** @nocollapse */
    NgSelectOption.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer, },
        { type: SelectControlValueAccessor, decorators: [{ type: Optional }, { type: Host },] },
    ]; };
    NgSelectOption.propDecorators = {
        'ngValue': [{ type: Input, args: ['ngValue',] },],
        'value': [{ type: Input, args: ['value',] },],
    };
    return NgSelectOption;
}());
function NgSelectOption_tsickle_Closure_declarations() {
    /** @type {?} */
    NgSelectOption.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgSelectOption.ctorParameters;
    /** @type {?} */
    NgSelectOption.propDecorators;
    /** @type {?} */
    NgSelectOption.prototype.id;
    /** @type {?} */
    NgSelectOption.prototype._element;
    /** @type {?} */
    NgSelectOption.prototype._renderer;
    /** @type {?} */
    NgSelectOption.prototype._select;
}
//# sourceMappingURL=select_control_value_accessor.js.map