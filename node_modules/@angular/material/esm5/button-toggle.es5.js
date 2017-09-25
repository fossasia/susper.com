import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, Input, NgModule, Optional, Output, Renderer2, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MdCommonModule, UNIQUE_SELECTION_DISPATCHER_PROVIDER, UniqueSelectionDispatcher, mixinDisabled } from '@angular/material/core';
import { A11yModule, FocusMonitor } from '@angular/cdk/a11y';
/**
 * \@docs-private
 */
var MdButtonToggleGroupBase = (function () {
    function MdButtonToggleGroupBase() {
    }
    return MdButtonToggleGroupBase;
}());
var _MdButtonToggleGroupMixinBase = mixinDisabled(MdButtonToggleGroupBase);
/**
 * Provider Expression that allows md-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * \@docs-private
 */
var MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdButtonToggleGroup; }),
    multi: true
};
var _uniqueIdCounter = 0;
/**
 * Change event object emitted by MdButtonToggle.
 */
var MdButtonToggleChange = (function () {
    function MdButtonToggleChange() {
    }
    return MdButtonToggleChange;
}());
/**
 * Exclusive selection button toggle group that behaves like a radio-button group.
 */
var MdButtonToggleGroup = (function (_super) {
    tslib_1.__extends(MdButtonToggleGroup, _super);
    /**
     * @param {?} _changeDetector
     */
    function MdButtonToggleGroup(_changeDetector) {
        var _this = _super.call(this) || this;
        _this._changeDetector = _changeDetector;
        /**
         * The value for the button toggle group. Should match currently selected button toggle.
         */
        _this._value = null;
        /**
         * The HTML name attribute applied to toggles in this group.
         */
        _this._name = "md-button-toggle-group-" + _uniqueIdCounter++;
        /**
         * Whether the button toggle group should be vertical.
         */
        _this._vertical = false;
        /**
         * The currently selected button toggle, should match the value.
         */
        _this._selected = null;
        /**
         * The method to be called in order to update ngModel.
         * Now `ngModel` binding is not supported in multiple selection mode.
         */
        _this._controlValueAccessorChangeFn = function () { };
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         */
        _this.onTouched = function () { };
        /**
         * Event emitted when the group's value changes.
         */
        _this.change = new EventEmitter();
        return _this;
    }
    Object.defineProperty(MdButtonToggleGroup.prototype, "name", {
        /**
         * `name` attribute for the underlying `input` element.
         * @return {?}
         */
        get: function () {
            return this._name;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._name = value;
            this._updateButtonToggleNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "vertical", {
        /**
         * Whether the toggle group is vertical.
         * @return {?}
         */
        get: function () {
            return this._vertical;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "value", {
        /**
         * Value of the toggle group.
         * @return {?}
         */
        get: function () {
            return this._value;
        },
        /**
         * @param {?} newValue
         * @return {?}
         */
        set: function (newValue) {
            if (this._value != newValue) {
                this._value = newValue;
                this._updateSelectedButtonToggleFromValue();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "selected", {
        /**
         * Whether the toggle group is selected.
         * @return {?}
         */
        get: function () {
            return this._selected;
        },
        /**
         * @param {?} selected
         * @return {?}
         */
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            if (selected && !selected.checked) {
                selected.checked = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdButtonToggleGroup.prototype._updateButtonToggleNames = function () {
        var _this = this;
        if (this._buttonToggles) {
            this._buttonToggles.forEach(function (toggle) {
                toggle.name = _this._name;
            });
        }
    };
    /**
     * @return {?}
     */
    MdButtonToggleGroup.prototype._updateSelectedButtonToggleFromValue = function () {
        var _this = this;
        var /** @type {?} */ isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._buttonToggles != null && !isAlreadySelected) {
            var /** @type {?} */ matchingButtonToggle = this._buttonToggles.filter(function (buttonToggle) { return buttonToggle.value == _this._value; })[0];
            if (matchingButtonToggle) {
                this.selected = matchingButtonToggle;
            }
            else if (this.value == null) {
                this.selected = null;
                this._buttonToggles.forEach(function (buttonToggle) {
                    buttonToggle.checked = false;
                });
            }
        }
    };
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    MdButtonToggleGroup.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdButtonToggleChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value Value to be set to the model.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.writeValue = function (value) {
        this.value = value;
        this._changeDetector.markForCheck();
    };
    /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On change callback function.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On touch callback function.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled Whether the component should be disabled.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    return MdButtonToggleGroup;
}(_MdButtonToggleGroupMixinBase));
MdButtonToggleGroup.decorators = [
    { type: Directive, args: [{
                selector: 'md-button-toggle-group:not([multiple]), mat-button-toggle-group:not([multiple])',
                providers: [MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR],
                inputs: ['disabled'],
                host: {
                    'role': 'radiogroup',
                    'class': 'mat-button-toggle-group',
                    '[class.mat-button-toggle-vertical]': 'vertical'
                },
                exportAs: 'mdButtonToggleGroup, matButtonToggleGroup',
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggleGroup.ctorParameters = function () { return [
    { type: ChangeDetectorRef, },
]; };
MdButtonToggleGroup.propDecorators = {
    '_buttonToggles': [{ type: ContentChildren, args: [forwardRef(function () { return MdButtonToggle; }),] },],
    'name': [{ type: Input },],
    'vertical': [{ type: Input },],
    'value': [{ type: Input },],
    'selected': [{ type: Input },],
    'change': [{ type: Output },],
};
/**
 * Multiple selection button-toggle group. `ngModel` is not supported in this mode.
 */
var MdButtonToggleGroupMultiple = (function (_super) {
    tslib_1.__extends(MdButtonToggleGroupMultiple, _super);
    function MdButtonToggleGroupMultiple() {
        var _this = _super.apply(this, arguments) || this;
        /**
         * Whether the button toggle group should be vertical.
         */
        _this._vertical = false;
        return _this;
    }
    Object.defineProperty(MdButtonToggleGroupMultiple.prototype, "vertical", {
        /**
         * Whether the toggle group is vertical.
         * @return {?}
         */
        get: function () {
            return this._vertical;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    return MdButtonToggleGroupMultiple;
}(_MdButtonToggleGroupMixinBase));
MdButtonToggleGroupMultiple.decorators = [
    { type: Directive, args: [{
                selector: 'md-button-toggle-group[multiple], mat-button-toggle-group[multiple]',
                exportAs: 'mdButtonToggleGroup, matButtonToggleGroup',
                inputs: ['disabled'],
                host: {
                    'class': 'mat-button-toggle-group',
                    '[class.mat-button-toggle-vertical]': 'vertical',
                    'role': 'group'
                }
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggleGroupMultiple.ctorParameters = function () { return []; };
MdButtonToggleGroupMultiple.propDecorators = {
    'vertical': [{ type: Input },],
};
/**
 * Single button inside of a toggle group.
 */
var MdButtonToggle = (function () {
    /**
     * @param {?} toggleGroup
     * @param {?} toggleGroupMultiple
     * @param {?} _changeDetectorRef
     * @param {?} _buttonToggleDispatcher
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _focusMonitor
     */
    function MdButtonToggle(toggleGroup, toggleGroupMultiple, _changeDetectorRef, _buttonToggleDispatcher, _renderer, _elementRef, _focusMonitor) {
        var _this = this;
        this._changeDetectorRef = _changeDetectorRef;
        this._buttonToggleDispatcher = _buttonToggleDispatcher;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        /**
         * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
         * take precedence so this may be omitted.
         */
        this.ariaLabel = '';
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        this.ariaLabelledby = null;
        /**
         * Whether or not this button toggle is checked.
         */
        this._checked = false;
        /**
         * Whether or not this button toggle is disabled.
         */
        this._disabled = false;
        /**
         * Value assigned to this button toggle.
         */
        this._value = null;
        /**
         * Whether or not the button toggle is a single selection.
         */
        this._isSingleSelector = false;
        /**
         * Unregister function for _buttonToggleDispatcher *
         */
        this._removeUniqueSelectionListener = function () { };
        /**
         * Event emitted when the group value changes.
         */
        this.change = new EventEmitter();
        this.buttonToggleGroup = toggleGroup;
        this.buttonToggleGroupMultiple = toggleGroupMultiple;
        if (this.buttonToggleGroup) {
            this._removeUniqueSelectionListener =
                _buttonToggleDispatcher.listen(function (id, name) {
                    if (id != _this.id && name == _this.name) {
                        _this.checked = false;
                        _this._changeDetectorRef.markForCheck();
                    }
                });
            this._type = 'radio';
            this.name = this.buttonToggleGroup.name;
            this._isSingleSelector = true;
        }
        else {
            // Even if there is no group at all, treat the button toggle as a checkbox so it can be
            // toggled on or off.
            this._type = 'checkbox';
            this._isSingleSelector = false;
        }
    }
    Object.defineProperty(MdButtonToggle.prototype, "inputId", {
        /**
         * Unique ID for the underlying `input` element.
         * @return {?}
         */
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "checked", {
        /**
         * Whether the button is checked.
         * @return {?}
         */
        get: function () { return this._checked; },
        /**
         * @param {?} newCheckedState
         * @return {?}
         */
        set: function (newCheckedState) {
            if (this._isSingleSelector && newCheckedState) {
                // Notify all button toggles with the same name (in the same group) to un-check.
                this._buttonToggleDispatcher.notify(this.id, this.name);
                this._changeDetectorRef.markForCheck();
            }
            this._checked = newCheckedState;
            if (newCheckedState && this._isSingleSelector && this.buttonToggleGroup.value != this.value) {
                this.buttonToggleGroup.selected = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "value", {
        /**
         * MdButtonToggleGroup reads this to assign its own value.
         * @return {?}
         */
        get: function () {
            return this._value;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._value != value) {
                if (this.buttonToggleGroup != null && this.checked) {
                    this.buttonToggleGroup.value = value;
                }
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "disabled", {
        /**
         * Whether the button is disabled.
         * @return {?}
         */
        get: function () {
            return this._disabled || (this.buttonToggleGroup != null && this.buttonToggleGroup.disabled) ||
                (this.buttonToggleGroupMultiple != null && this.buttonToggleGroupMultiple.disabled);
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdButtonToggle.prototype.ngOnInit = function () {
        if (this.id == null) {
            this.id = "md-button-toggle-" + _uniqueIdCounter++;
        }
        if (this.buttonToggleGroup && this._value == this.buttonToggleGroup.value) {
            this._checked = true;
        }
        this._focusMonitor.monitor(this._elementRef.nativeElement, this._renderer, true);
    };
    /**
     * Focuses the button.
     * @return {?}
     */
    MdButtonToggle.prototype.focus = function () {
        this._inputElement.nativeElement.focus();
    };
    /**
     * Toggle the state of the current button toggle.
     * @return {?}
     */
    MdButtonToggle.prototype._toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Checks the button toggle due to an interaction with the underlying native input.
     * @param {?} event
     * @return {?}
     */
    MdButtonToggle.prototype._onInputChange = function (event) {
        event.stopPropagation();
        if (this._isSingleSelector) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button toggle as checked.
            var /** @type {?} */ groupValueChanged = this.buttonToggleGroup.selected != this;
            this.checked = true;
            this.buttonToggleGroup.selected = this;
            this.buttonToggleGroup.onTouched();
            if (groupValueChanged) {
                this.buttonToggleGroup._emitChangeEvent();
            }
        }
        else {
            this._toggle();
        }
        // Emit a change event when the native input does.
        this._emitChangeEvent();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdButtonToggle.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Dispatch change event with current value.
     * @return {?}
     */
    MdButtonToggle.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdButtonToggleChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    };
    /**
     * @return {?}
     */
    MdButtonToggle.prototype.ngOnDestroy = function () {
        this._removeUniqueSelectionListener();
    };
    return MdButtonToggle;
}());
MdButtonToggle.decorators = [
    { type: Component, args: [{ selector: 'md-button-toggle, mat-button-toggle',
                template: "<label [attr.for]=\"inputId\" class=\"mat-button-toggle-label\"><input #input class=\"mat-button-toggle-input cdk-visually-hidden\" [type]=\"_type\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled || null\" [name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onInputChange($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-button-toggle-label-content\"><ng-content></ng-content></div></label><div class=\"mat-button-toggle-focus-overlay\"></div>",
                styles: [".mat-button-toggle-group,.mat-button-toggle-standalone{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);position:relative;display:inline-flex;flex-direction:row;border-radius:2px;cursor:pointer;white-space:nowrap;overflow:hidden}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle-disabled .mat-button-toggle-label-content{cursor:default}.mat-button-toggle{white-space:nowrap;position:relative}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:1}.mat-button-toggle-label-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:inline-block;line-height:36px;padding:0 16px;cursor:pointer}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{border-radius:inherit;pointer-events:none;opacity:0;top:0;left:0;right:0;bottom:0;position:absolute}"],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    '[class.mat-button-toggle-standalone]': '!buttonToggleGroup && !buttonToggleGroupMultiple',
                    '[class.mat-button-toggle-checked]': 'checked',
                    '[class.mat-button-toggle-disabled]': 'disabled',
                    'class': 'mat-button-toggle',
                    '[attr.id]': 'id',
                }
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggle.ctorParameters = function () { return [
    { type: MdButtonToggleGroup, decorators: [{ type: Optional },] },
    { type: MdButtonToggleGroupMultiple, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
    { type: UniqueSelectionDispatcher, },
    { type: Renderer2, },
    { type: ElementRef, },
    { type: FocusMonitor, },
]; };
MdButtonToggle.propDecorators = {
    'ariaLabel': [{ type: Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: Input, args: ['aria-labelledby',] },],
    '_inputElement': [{ type: ViewChild, args: ['input',] },],
    'id': [{ type: Input },],
    'name': [{ type: Input },],
    'checked': [{ type: Input },],
    'value': [{ type: Input },],
    'disabled': [{ type: Input },],
    'change': [{ type: Output },],
};
var MdButtonToggleModule = (function () {
    function MdButtonToggleModule() {
    }
    return MdButtonToggleModule;
}());
MdButtonToggleModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule, A11yModule],
                exports: [
                    MdButtonToggleGroup,
                    MdButtonToggleGroupMultiple,
                    MdButtonToggle,
                    MdCommonModule,
                ],
                declarations: [MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle],
                providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggleModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdButtonToggleGroupBase, _MdButtonToggleGroupMixinBase, MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, MdButtonToggleChange, MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle, MdButtonToggleModule, MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR as MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, MdButtonToggle as MatButtonToggle, MdButtonToggleChange as MatButtonToggleChange, MdButtonToggleGroup as MatButtonToggleGroup, MdButtonToggleGroupBase as MatButtonToggleGroupBase, MdButtonToggleGroupMultiple as MatButtonToggleGroupMultiple, MdButtonToggleModule as MatButtonToggleModule };
//# sourceMappingURL=button-toggle.es5.js.map
