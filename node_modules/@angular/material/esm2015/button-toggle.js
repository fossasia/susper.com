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
import { MatCommonModule, mixinDisabled } from '@angular/material/core';
import { A11yModule, FocusMonitor } from '@angular/cdk/a11y';
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER, UniqueSelectionDispatcher } from '@angular/cdk/collections';

/**
 * \@docs-private
 */
class MatButtonToggleGroupBase {
}
const _MatButtonToggleGroupMixinBase = mixinDisabled(MatButtonToggleGroupBase);
/**
 * Provider Expression that allows mat-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * \@docs-private
 */
const MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatButtonToggleGroup),
    multi: true
};
let _uniqueIdCounter = 0;
/**
 * Change event object emitted by MatButtonToggle.
 */
class MatButtonToggleChange {
}
/**
 * Exclusive selection button toggle group that behaves like a radio-button group.
 */
class MatButtonToggleGroup extends _MatButtonToggleGroupMixinBase {
    /**
     * @param {?} _changeDetector
     */
    constructor(_changeDetector) {
        super();
        this._changeDetector = _changeDetector;
        /**
         * The value for the button toggle group. Should match currently selected button toggle.
         */
        this._value = null;
        /**
         * The HTML name attribute applied to toggles in this group.
         */
        this._name = `mat-button-toggle-group-${_uniqueIdCounter++}`;
        /**
         * Whether the button toggle group should be vertical.
         */
        this._vertical = false;
        /**
         * The currently selected button toggle, should match the value.
         */
        this._selected = null;
        /**
         * The method to be called in order to update ngModel.
         * Now `ngModel` binding is not supported in multiple selection mode.
         */
        this._controlValueAccessorChangeFn = () => { };
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         */
        this._onTouched = () => { };
        /**
         * Event emitted when the group's value changes.
         */
        this.change = new EventEmitter();
    }
    /**
     * `name` attribute for the underlying `input` element.
     * @return {?}
     */
    get name() {
        return this._name;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set name(value) {
        this._name = value;
        this._updateButtonToggleNames();
    }
    /**
     * Whether the toggle group is vertical.
     * @return {?}
     */
    get vertical() {
        return this._vertical;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
    }
    /**
     * Value of the toggle group.
     * @return {?}
     */
    get value() {
        return this._value;
    }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set value(newValue) {
        if (this._value != newValue) {
            this._value = newValue;
            this._updateSelectedButtonToggleFromValue();
        }
    }
    /**
     * Whether the toggle group is selected.
     * @return {?}
     */
    get selected() {
        return this._selected;
    }
    /**
     * @param {?} selected
     * @return {?}
     */
    set selected(selected) {
        this._selected = selected;
        this.value = selected ? selected.value : null;
        if (selected && !selected.checked) {
            selected.checked = true;
        }
    }
    /**
     * @return {?}
     */
    _updateButtonToggleNames() {
        if (this._buttonToggles) {
            this._buttonToggles.forEach((toggle) => {
                toggle.name = this._name;
            });
        }
    }
    /**
     * @return {?}
     */
    _updateSelectedButtonToggleFromValue() {
        let /** @type {?} */ isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._buttonToggles != null && !isAlreadySelected) {
            let /** @type {?} */ matchingButtonToggle = this._buttonToggles.filter(buttonToggle => buttonToggle.value == this._value)[0];
            if (matchingButtonToggle) {
                this.selected = matchingButtonToggle;
            }
            else if (this.value == null) {
                this.selected = null;
                this._buttonToggles.forEach(buttonToggle => {
                    buttonToggle.checked = false;
                });
            }
        }
    }
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    _emitChangeEvent() {
        let /** @type {?} */ event = new MatButtonToggleChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value Value to be set to the model.
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
        this._changeDetector.markForCheck();
    }
    /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On change callback function.
     * @return {?}
     */
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On touch callback function.
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled Whether the component should be disabled.
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._markButtonTogglesForCheck();
    }
    /**
     * @return {?}
     */
    _markButtonTogglesForCheck() {
        if (this._buttonToggles) {
            this._buttonToggles.forEach((toggle) => toggle._markForCheck());
        }
    }
}
MatButtonToggleGroup.decorators = [
    { type: Directive, args: [{
                selector: 'mat-button-toggle-group:not([multiple])',
                providers: [MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR],
                inputs: ['disabled'],
                host: {
                    'role': 'radiogroup',
                    'class': 'mat-button-toggle-group',
                    '[class.mat-button-toggle-vertical]': 'vertical'
                },
                exportAs: 'matButtonToggleGroup',
            },] },
];
/**
 * @nocollapse
 */
MatButtonToggleGroup.ctorParameters = () => [
    { type: ChangeDetectorRef, },
];
MatButtonToggleGroup.propDecorators = {
    '_buttonToggles': [{ type: ContentChildren, args: [forwardRef(() => MatButtonToggle),] },],
    'name': [{ type: Input },],
    'vertical': [{ type: Input },],
    'value': [{ type: Input },],
    'selected': [{ type: Input },],
    'change': [{ type: Output },],
};
/**
 * Multiple selection button-toggle group. `ngModel` is not supported in this mode.
 */
class MatButtonToggleGroupMultiple extends _MatButtonToggleGroupMixinBase {
    constructor() {
        super(...arguments);
        /**
         * Whether the button toggle group should be vertical.
         */
        this._vertical = false;
    }
    /**
     * Whether the toggle group is vertical.
     * @return {?}
     */
    get vertical() {
        return this._vertical;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
    }
}
MatButtonToggleGroupMultiple.decorators = [
    { type: Directive, args: [{
                selector: 'mat-button-toggle-group[multiple]',
                exportAs: 'matButtonToggleGroup',
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
MatButtonToggleGroupMultiple.ctorParameters = () => [];
MatButtonToggleGroupMultiple.propDecorators = {
    'vertical': [{ type: Input },],
};
/**
 * Single button inside of a toggle group.
 */
class MatButtonToggle {
    /**
     * @param {?} toggleGroup
     * @param {?} toggleGroupMultiple
     * @param {?} _changeDetectorRef
     * @param {?} _buttonToggleDispatcher
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _focusMonitor
     */
    constructor(toggleGroup, toggleGroupMultiple, _changeDetectorRef, _buttonToggleDispatcher, _renderer, _elementRef, _focusMonitor) {
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
        this._removeUniqueSelectionListener = () => { };
        /**
         * Event emitted when the group value changes.
         */
        this.change = new EventEmitter();
        this.buttonToggleGroup = toggleGroup;
        this.buttonToggleGroupMultiple = toggleGroupMultiple;
        if (this.buttonToggleGroup) {
            this._removeUniqueSelectionListener =
                _buttonToggleDispatcher.listen((id, name) => {
                    if (id != this.id && name == this.name) {
                        this.checked = false;
                        this._changeDetectorRef.markForCheck();
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
    /**
     * Unique ID for the underlying `input` element.
     * @return {?}
     */
    get inputId() {
        return `${this.id}-input`;
    }
    /**
     * Whether the button is checked.
     * @return {?}
     */
    get checked() { return this._checked; }
    /**
     * @param {?} newCheckedState
     * @return {?}
     */
    set checked(newCheckedState) {
        if (this._isSingleSelector && newCheckedState) {
            // Notify all button toggles with the same name (in the same group) to un-check.
            this._buttonToggleDispatcher.notify(this.id, this.name);
            this._changeDetectorRef.markForCheck();
        }
        this._checked = newCheckedState;
        if (newCheckedState && this._isSingleSelector && this.buttonToggleGroup.value != this.value) {
            this.buttonToggleGroup.selected = this;
        }
    }
    /**
     * MatButtonToggleGroup reads this to assign its own value.
     * @return {?}
     */
    get value() {
        return this._value;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        if (this._value != value) {
            if (this.buttonToggleGroup != null && this.checked) {
                this.buttonToggleGroup.value = value;
            }
            this._value = value;
        }
    }
    /**
     * Whether the button is disabled.
     * @return {?}
     */
    get disabled() {
        return this._disabled || (this.buttonToggleGroup != null && this.buttonToggleGroup.disabled) ||
            (this.buttonToggleGroupMultiple != null && this.buttonToggleGroupMultiple.disabled);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.id == null) {
            this.id = `mat-button-toggle-${_uniqueIdCounter++}`;
        }
        if (this.buttonToggleGroup && this._value == this.buttonToggleGroup.value) {
            this._checked = true;
        }
        this._focusMonitor.monitor(this._elementRef.nativeElement, this._renderer, true);
    }
    /**
     * Focuses the button.
     * @return {?}
     */
    focus() {
        this._inputElement.nativeElement.focus();
    }
    /**
     * Toggle the state of the current button toggle.
     * @return {?}
     */
    _toggle() {
        this.checked = !this.checked;
    }
    /**
     * Checks the button toggle due to an interaction with the underlying native input.
     * @param {?} event
     * @return {?}
     */
    _onInputChange(event) {
        event.stopPropagation();
        if (this._isSingleSelector) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button toggle as checked.
            let /** @type {?} */ groupValueChanged = this.buttonToggleGroup.selected != this;
            this.checked = true;
            this.buttonToggleGroup.selected = this;
            this.buttonToggleGroup._onTouched();
            if (groupValueChanged) {
                this.buttonToggleGroup._emitChangeEvent();
            }
        }
        else {
            this._toggle();
        }
        // Emit a change event when the native input does.
        this._emitChangeEvent();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onInputClick(event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    }
    /**
     * Dispatch change event with current value.
     * @return {?}
     */
    _emitChangeEvent() {
        let /** @type {?} */ event = new MatButtonToggleChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._removeUniqueSelectionListener();
    }
    /**
     * Marks the button toggle as needing checking for change detection.
     * This method is exposed because the parent button toggle group will directly
     * update bound properties of the radio button.
     * @return {?}
     */
    _markForCheck() {
        // When group value changes, the button will not be notified. Use `markForCheck` to explicit
        // update button toggle's status
        this._changeDetectorRef.markForCheck();
    }
}
MatButtonToggle.decorators = [
    { type: Component, args: [{selector: 'mat-button-toggle',
                template: "<label [attr.for]=\"inputId\" class=\"mat-button-toggle-label\"><input #input class=\"mat-button-toggle-input cdk-visually-hidden\" [type]=\"_type\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled || null\" [name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onInputChange($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-button-toggle-label-content\"><ng-content></ng-content></div></label><div class=\"mat-button-toggle-focus-overlay\"></div>",
                styles: [".mat-button-toggle-group,.mat-button-toggle-standalone{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);position:relative;display:inline-flex;flex-direction:row;border-radius:2px;cursor:pointer;white-space:nowrap;overflow:hidden}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle-disabled .mat-button-toggle-label-content{cursor:default}.mat-button-toggle{white-space:nowrap;position:relative}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:1}.mat-button-toggle-label-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:inline-block;line-height:36px;padding:0 16px;cursor:pointer}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{border-radius:inherit;pointer-events:none;opacity:0;top:0;left:0;right:0;bottom:0;position:absolute}"],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                exportAs: 'matButtonToggle',
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
MatButtonToggle.ctorParameters = () => [
    { type: MatButtonToggleGroup, decorators: [{ type: Optional },] },
    { type: MatButtonToggleGroupMultiple, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
    { type: UniqueSelectionDispatcher, },
    { type: Renderer2, },
    { type: ElementRef, },
    { type: FocusMonitor, },
];
MatButtonToggle.propDecorators = {
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

class MatButtonToggleModule {
}
MatButtonToggleModule.decorators = [
    { type: NgModule, args: [{
                imports: [MatCommonModule, A11yModule],
                exports: [
                    MatButtonToggleGroup,
                    MatButtonToggleGroupMultiple,
                    MatButtonToggle,
                    MatCommonModule,
                ],
                declarations: [MatButtonToggleGroup, MatButtonToggleGroupMultiple, MatButtonToggle],
                providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MatButtonToggleModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MatButtonToggleGroupBase, _MatButtonToggleGroupMixinBase, MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleGroupMultiple, MatButtonToggle, MatButtonToggleModule };
//# sourceMappingURL=button-toggle.js.map
