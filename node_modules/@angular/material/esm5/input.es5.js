/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, Input, NgModule, Optional, Renderer2, Self } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Platform, getSupportedInputTypes } from '@angular/cdk/platform';
import { MD_ERROR_GLOBAL_OPTIONS, PlatformModule, defaultErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs/Subject';
import { MdFormFieldControl, MdFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
/**
 * \@docs-private
 * @param {?} type
 * @return {?}
 */
function getMdInputUnsupportedTypeError(type) {
    return Error("Input type \"" + type + "\" isn't supported by mdInput.");
}
// Invalid input type. Using one of these will throw an MdInputUnsupportedTypeError.
var MD_INPUT_INVALID_TYPES = [
    'button',
    'checkbox',
    'color',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit'
];
var nextUniqueId = 0;
/**
 * Directive that allows a native input to work inside a `MdFormField`.
 */
var MdInput = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _platform
     * @param {?} ngControl
     * @param {?} _parentForm
     * @param {?} _parentFormGroup
     * @param {?} errorOptions
     */
    function MdInput(_elementRef, _renderer, _platform, ngControl, _parentForm, _parentFormGroup, errorOptions) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._platform = _platform;
        this.ngControl = ngControl;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        /**
         * Variables used as cache for getters and setters.
         */
        this._type = 'text';
        this._disabled = false;
        this._required = false;
        this._uid = "md-input-" + nextUniqueId++;
        this._previousNativeValue = this.value;
        /**
         * Whether the input is focused.
         */
        this.focused = false;
        /**
         * Whether the input is in an error state.
         */
        this.errorState = false;
        /**
         * Stream that emits whenever the state of the input changes such that the wrapping `MdFormField`
         * needs to run change detection.
         */
        this.stateChanges = new Subject();
        /**
         * Placeholder attribute of the element.
         */
        this.placeholder = '';
        this._neverEmptyInputTypes = [
            'date',
            'datetime',
            'datetime-local',
            'month',
            'time',
            'week'
        ].filter(function (t) { return getSupportedInputTypes().has(t); });
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        this._errorOptions = errorOptions ? errorOptions : {};
        this.errorStateMatcher = this._errorOptions.errorStateMatcher || defaultErrorStateMatcher;
        // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
        // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
        // exists on iOS, we only bother to install the listener on iOS.
        if (_platform.IOS) {
            _renderer.listen(_elementRef.nativeElement, 'keyup', function (event) {
                var el = event.target;
                if (!el.value && !el.selectionStart && !el.selectionEnd) {
                    // Note: Just setting `0, 0` doesn't fix the issue. Setting `1, 1` fixes it for the first
                    // time that you type text and then hold delete. Toggling to `1, 1` and then back to
                    // `0, 0` seems to completely fix it.
                    el.setSelectionRange(1, 1);
                    el.setSelectionRange(0, 0);
                }
            });
        }
    }
    Object.defineProperty(MdInput.prototype, "disabled", {
        /**
         * Whether the element is disabled.
         * @return {?}
         */
        get: function () { return this.ngControl ? this.ngControl.disabled : this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "id", {
        /**
         * Unique id of the element.
         * @return {?}
         */
        get: function () { return this._id; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._id = value || this._uid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "required", {
        /**
         * Whether the element is required.
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "type", {
        /**
         * Input type of the element.
         * @return {?}
         */
        get: function () { return this._type; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._type = value || 'text';
            this._validateType();
            // When using Angular inputs, developers are no longer able to set the properties on the native
            // input element. To ensure that bindings for `type` work, we need to sync the setter
            // with the native property. Textarea elements don't support the type property or attribute.
            if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
                this._renderer.setProperty(this._elementRef.nativeElement, 'type', this._type);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "value", {
        /**
         * The input element's value.
         * @return {?}
         */
        get: function () { return this._elementRef.nativeElement.value; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== this.value) {
                this._elementRef.nativeElement.value = value;
                this.stateChanges.next();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdInput.prototype.ngOnChanges = function () {
        this.stateChanges.next();
    };
    /**
     * @return {?}
     */
    MdInput.prototype.ngOnDestroy = function () {
        this.stateChanges.complete();
    };
    /**
     * @return {?}
     */
    MdInput.prototype.ngDoCheck = function () {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this._updateErrorState();
        }
        else {
            // When the input isn't used together with `@angular/forms`, we need to check manually for
            // changes to the native `value` property in order to update the floating label.
            this._dirtyCheckNativeValue();
        }
    };
    /**
     * Callback for the cases where the focused state of the input changes.
     * @param {?} isFocused
     * @return {?}
     */
    MdInput.prototype._focusChanged = function (isFocused) {
        if (isFocused !== this.focused) {
            this.focused = isFocused;
            this.stateChanges.next();
        }
    };
    /**
     * @return {?}
     */
    MdInput.prototype._onInput = function () {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    };
    /**
     * Re-evaluates the error state. This is only relevant with \@angular/forms.
     * @return {?}
     */
    MdInput.prototype._updateErrorState = function () {
        var /** @type {?} */ oldState = this.errorState;
        var /** @type {?} */ ngControl = this.ngControl;
        var /** @type {?} */ parent = this._parentFormGroup || this._parentForm;
        var /** @type {?} */ newState = ngControl && this.errorStateMatcher(/** @type {?} */ (ngControl.control), parent);
        if (newState !== oldState) {
            this.errorState = newState;
            this.stateChanges.next();
        }
    };
    /**
     * Does some manual dirty checking on the native input `value` property.
     * @return {?}
     */
    MdInput.prototype._dirtyCheckNativeValue = function () {
        var /** @type {?} */ newValue = this.value;
        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    };
    /**
     * Make sure the input is a supported type.
     * @return {?}
     */
    MdInput.prototype._validateType = function () {
        if (MD_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
            throw getMdInputUnsupportedTypeError(this._type);
        }
    };
    /**
     * Checks whether the input type is one of the types that are never empty.
     * @return {?}
     */
    MdInput.prototype._isNeverEmpty = function () {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
    };
    /**
     * Checks whether the input is invalid based on the native validation.
     * @return {?}
     */
    MdInput.prototype._isBadInput = function () {
        // The `validity` property won't be present on platform-server.
        var /** @type {?} */ validity = ((this._elementRef.nativeElement)).validity;
        return validity && validity.badInput;
    };
    /**
     * Determines if the component host is a textarea. If not recognizable it returns false.
     * @return {?}
     */
    MdInput.prototype._isTextarea = function () {
        var /** @type {?} */ nativeElement = this._elementRef.nativeElement;
        // In Universal, we don't have access to `nodeName`, but the same can be achieved with `name`.
        // Note that this shouldn't be necessary once Angular switches to an API that resembles the
        // DOM closer.
        var /** @type {?} */ nodeName = this._platform.isBrowser ? nativeElement.nodeName : nativeElement.name;
        return nodeName ? nodeName.toLowerCase() === 'textarea' : false;
    };
    Object.defineProperty(MdInput.prototype, "empty", {
        /**
         * @return {?}
         */
        get: function () {
            return !this._isNeverEmpty() &&
                (this.value == null || this.value === '') &&
                // Check if the input contains bad input. If so, we know that it only appears empty because
                // the value failed to parse. From the user's perspective it is not empty.
                // TODO(mmalerba): Add e2e test for bad input case.
                !this._isBadInput();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} ids
     * @return {?}
     */
    MdInput.prototype.setDescribedByIds = function (ids) { this._ariaDescribedby = ids.join(' '); };
    /**
     * @return {?}
     */
    MdInput.prototype.focus = function () { this._elementRef.nativeElement.focus(); };
    return MdInput;
}());
MdInput.decorators = [
    { type: Directive, args: [{
                selector: "input[mdInput], textarea[mdInput], input[matInput], textarea[matInput]",
                host: {
                    'class': 'mat-input-element mat-form-field-autofill-control',
                    // Native input properties that are overwritten by Angular inputs need to be synced with
                    // the native input element. Otherwise property bindings for those don't work.
                    '[id]': 'id',
                    '[placeholder]': 'placeholder',
                    '[disabled]': 'disabled',
                    '[required]': 'required',
                    '[attr.aria-describedby]': '_ariaDescribedby || null',
                    '[attr.aria-invalid]': 'errorState',
                    '(blur)': '_focusChanged(false)',
                    '(focus)': '_focusChanged(true)',
                    '(input)': '_onInput()',
                },
                providers: [{ provide: MdFormFieldControl, useExisting: MdInput }],
            },] },
];
/**
 * @nocollapse
 */
MdInput.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: Platform, },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self },] },
    { type: NgForm, decorators: [{ type: Optional },] },
    { type: FormGroupDirective, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_ERROR_GLOBAL_OPTIONS,] },] },
]; };
MdInput.propDecorators = {
    'disabled': [{ type: Input },],
    'id': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'required': [{ type: Input },],
    'type': [{ type: Input },],
    'errorStateMatcher': [{ type: Input },],
};
/**
 * Directive to automatically resize a textarea to fit its content.
 */
var MdTextareaAutosize = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _platform
     */
    function MdTextareaAutosize(_elementRef, _platform) {
        this._elementRef = _elementRef;
        this._platform = _platform;
    }
    Object.defineProperty(MdTextareaAutosize.prototype, "minRows", {
        /**
         * @return {?}
         */
        get: function () { return this._minRows; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._minRows = value;
            this._setMinHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "maxRows", {
        /**
         * @return {?}
         */
        get: function () { return this._maxRows; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._maxRows = value;
            this._setMaxHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "_matAutosizeMinRows", {
        /**
         * @return {?}
         */
        get: function () { return this.minRows; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.minRows = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "_matAutosizeMaxRows", {
        /**
         * @return {?}
         */
        get: function () { return this.maxRows; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.maxRows = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the minimum height of the textarea as determined by minRows.
     * @return {?}
     */
    MdTextareaAutosize.prototype._setMinHeight = function () {
        var /** @type {?} */ minHeight = this.minRows && this._cachedLineHeight ?
            this.minRows * this._cachedLineHeight + "px" : null;
        if (minHeight) {
            this._setTextareaStyle('minHeight', minHeight);
        }
    };
    /**
     * Sets the maximum height of the textarea as determined by maxRows.
     * @return {?}
     */
    MdTextareaAutosize.prototype._setMaxHeight = function () {
        var /** @type {?} */ maxHeight = this.maxRows && this._cachedLineHeight ?
            this.maxRows * this._cachedLineHeight + "px" : null;
        if (maxHeight) {
            this._setTextareaStyle('maxHeight', maxHeight);
        }
    };
    /**
     * @return {?}
     */
    MdTextareaAutosize.prototype.ngAfterViewInit = function () {
        if (this._platform.isBrowser) {
            this._cacheTextareaLineHeight();
            this.resizeToFitContent();
        }
    };
    /**
     * Sets a style property on the textarea element.
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    MdTextareaAutosize.prototype._setTextareaStyle = function (property, value) {
        var /** @type {?} */ textarea = (this._elementRef.nativeElement);
        textarea.style[property] = value;
    };
    /**
     * Cache the height of a single-row textarea.
     *
     * We need to know how large a single "row" of a textarea is in order to apply minRows and
     * maxRows. For the initial version, we will assume that the height of a single line in the
     * textarea does not ever change.
     * @return {?}
     */
    MdTextareaAutosize.prototype._cacheTextareaLineHeight = function () {
        var /** @type {?} */ textarea = (this._elementRef.nativeElement);
        // Use a clone element because we have to override some styles.
        var /** @type {?} */ textareaClone = (textarea.cloneNode(false));
        textareaClone.rows = 1;
        // Use `position: absolute` so that this doesn't cause a browser layout and use
        // `visibility: hidden` so that nothing is rendered. Clear any other styles that
        // would affect the height.
        textareaClone.style.position = 'absolute';
        textareaClone.style.visibility = 'hidden';
        textareaClone.style.border = 'none';
        textareaClone.style.padding = '0';
        textareaClone.style.height = '';
        textareaClone.style.minHeight = '';
        textareaClone.style.maxHeight = '';
        // In Firefox it happens that textarea elements are always bigger than the specified amount
        // of rows. This is because Firefox tries to add extra space for the horizontal scrollbar.
        // As a workaround that removes the extra space for the scrollbar, we can just set overflow
        // to hidden. This ensures that there is no invalid calculation of the line height.
        // See Firefox bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=33654
        textareaClone.style.overflow = 'hidden'; /** @type {?} */
        ((textarea.parentNode)).appendChild(textareaClone);
        this._cachedLineHeight = textareaClone.clientHeight; /** @type {?} */
        ((textarea.parentNode)).removeChild(textareaClone);
        // Min and max heights have to be re-calculated if the cached line height changes
        this._setMinHeight();
        this._setMaxHeight();
    };
    /**
     * @return {?}
     */
    MdTextareaAutosize.prototype.ngDoCheck = function () {
        this.resizeToFitContent();
    };
    /**
     * Resize the textarea to fit its content.
     * @return {?}
     */
    MdTextareaAutosize.prototype.resizeToFitContent = function () {
        var /** @type {?} */ textarea = (this._elementRef.nativeElement);
        var /** @type {?} */ value = textarea.value;
        // Only resize of the value changed since these calculations can be expensive.
        if (value === this._previousValue) {
            return;
        }
        // Reset the textarea height to auto in order to shrink back to its default size.
        // Also temporarily force overflow:hidden, so scroll bars do not interfere with calculations.
        textarea.style.height = 'auto';
        textarea.style.overflow = 'hidden';
        // Use the scrollHeight to know how large the textarea *would* be if fit its entire value.
        textarea.style.height = textarea.scrollHeight + "px";
        textarea.style.overflow = '';
        this._previousValue = value;
    };
    return MdTextareaAutosize;
}());
MdTextareaAutosize.decorators = [
    { type: Directive, args: [{
                selector: "textarea[md-autosize], textarea[mdTextareaAutosize],\n             textarea[mat-autosize], textarea[matTextareaAutosize]",
                exportAs: 'mdTextareaAutosize, matTextareaAutosize',
                host: {
                    // Textarea elements that have the directive applied should have a single row by default.
                    // Browsers normally show two rows by default and therefore this limits the minRows binding.
                    'rows': '1',
                },
            },] },
];
/**
 * @nocollapse
 */
MdTextareaAutosize.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Platform, },
]; };
MdTextareaAutosize.propDecorators = {
    'minRows': [{ type: Input, args: ['mdAutosizeMinRows',] },],
    'maxRows': [{ type: Input, args: ['mdAutosizeMaxRows',] },],
    '_matAutosizeMinRows': [{ type: Input, args: ['matAutosizeMinRows',] },],
    '_matAutosizeMaxRows': [{ type: Input, args: ['matAutosizeMaxRows',] },],
};
var MdInputModule = (function () {
    function MdInputModule() {
    }
    return MdInputModule;
}());
MdInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    MdInput,
                    MdTextareaAutosize,
                ],
                imports: [
                    CommonModule,
                    MdFormFieldModule,
                    PlatformModule,
                ],
                exports: [
                    // We re-export the `MdFormFieldModule` since `MdInput` will almost always be used together with
                    // `MdFormField`.
                    MdFormFieldModule,
                    MdInput,
                    MdTextareaAutosize,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdInputModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdInputModule, MdTextareaAutosize, MdInput, getMdInputUnsupportedTypeError, MdInput as MatInput, MdInputModule as MatInputModule, MdTextareaAutosize as MatTextareaAutosize };
//# sourceMappingURL=input.es5.js.map
