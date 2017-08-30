/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2, EventEmitter, OnInit, OnDestroy, QueryList, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { UniqueSelectionDispatcher, FocusOriginMonitor } from '../core';
import { CanDisable } from '../core/common-behaviors/disabled';
/** Acceptable types for a button toggle. */
export declare type ToggleType = 'checkbox' | 'radio';
/** @docs-private */
export declare class MdButtonToggleGroupBase {
}
export declare const _MdButtonToggleGroupMixinBase: (new (...args: any[]) => CanDisable) & typeof MdButtonToggleGroupBase;
/**
 * Provider Expression that allows md-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export declare const MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR: any;
/** Change event object emitted by MdButtonToggle. */
export declare class MdButtonToggleChange {
    /** The MdButtonToggle that emits the event. */
    source: MdButtonToggle | null;
    /** The value assigned to the MdButtonToggle. */
    value: any;
}
/** Exclusive selection button toggle group that behaves like a radio-button group. */
export declare class MdButtonToggleGroup extends _MdButtonToggleGroupMixinBase implements ControlValueAccessor, CanDisable {
    private _changeDetector;
    /** The value for the button toggle group. Should match currently selected button toggle. */
    private _value;
    /** The HTML name attribute applied to toggles in this group. */
    private _name;
    /** Whether the button toggle group should be vertical. */
    private _vertical;
    /** The currently selected button toggle, should match the value. */
    private _selected;
    /**
     * The method to be called in order to update ngModel.
     * Now `ngModel` binding is not supported in multiple selection mode.
     */
    _controlValueAccessorChangeFn: (value: any) => void;
    /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
    onTouched: () => any;
    /** Child button toggle buttons. */
    _buttonToggles: QueryList<MdButtonToggle>;
    /** `name` attribute for the underlying `input` element. */
    name: string;
    /** Whether the toggle group is vertical. */
    vertical: boolean;
    /** Value of the toggle group. */
    value: any;
    /** Whether the toggle group is selected. */
    selected: MdButtonToggle | null;
    /** Event emitted when the group's value changes. */
    change: EventEmitter<MdButtonToggleChange>;
    constructor(_changeDetector: ChangeDetectorRef);
    private _updateButtonToggleNames();
    private _updateSelectedButtonToggleFromValue();
    /** Dispatch change event with current selection and group value. */
    _emitChangeEvent(): void;
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value Value to be set to the model.
     */
    writeValue(value: any): void;
    /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn On change callback function.
     */
    registerOnChange(fn: (value: any) => void): void;
    /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn On touch callback function.
     */
    registerOnTouched(fn: any): void;
    /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param isDisabled Whether the component should be disabled.
     */
    setDisabledState(isDisabled: boolean): void;
}
/** Multiple selection button-toggle group. `ngModel` is not supported in this mode. */
export declare class MdButtonToggleGroupMultiple extends _MdButtonToggleGroupMixinBase implements CanDisable {
    /** Whether the button toggle group should be vertical. */
    private _vertical;
    /** Whether the toggle group is vertical. */
    vertical: boolean;
}
/** Single button inside of a toggle group. */
export declare class MdButtonToggle implements OnInit, OnDestroy {
    private _changeDetectorRef;
    private _buttonToggleDispatcher;
    private _renderer;
    private _elementRef;
    private _focusOriginMonitor;
    /**
     * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
     * take precedence so this may be omitted.
     */
    ariaLabel: string;
    /**
     * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
     */
    ariaLabelledby: string | null;
    /** Whether or not this button toggle is checked. */
    private _checked;
    /** Type of the button toggle. Either 'radio' or 'checkbox'. */
    _type: ToggleType;
    /** Whether or not this button toggle is disabled. */
    private _disabled;
    /** Value assigned to this button toggle. */
    private _value;
    /** Whether or not the button toggle is a single selection. */
    private _isSingleSelector;
    /** Unregister function for _buttonToggleDispatcher **/
    private _removeUniqueSelectionListener;
    _inputElement: ElementRef;
    /** The parent button toggle group (exclusive selection). Optional. */
    buttonToggleGroup: MdButtonToggleGroup;
    /** The parent button toggle group (multiple selection). Optional. */
    buttonToggleGroupMultiple: MdButtonToggleGroupMultiple;
    /** Unique ID for the underlying `input` element. */
    readonly inputId: string;
    /** The unique ID for this button toggle. */
    id: string;
    /** HTML's 'name' attribute used to group radios for unique selection. */
    name: string;
    /** Whether the button is checked. */
    checked: boolean;
    /** MdButtonToggleGroup reads this to assign its own value. */
    value: any;
    /** Whether the button is disabled. */
    disabled: boolean;
    /** Event emitted when the group value changes. */
    change: EventEmitter<MdButtonToggleChange>;
    constructor(toggleGroup: MdButtonToggleGroup, toggleGroupMultiple: MdButtonToggleGroupMultiple, _changeDetectorRef: ChangeDetectorRef, _buttonToggleDispatcher: UniqueSelectionDispatcher, _renderer: Renderer2, _elementRef: ElementRef, _focusOriginMonitor: FocusOriginMonitor);
    ngOnInit(): void;
    /** Focuses the button. */
    focus(): void;
    /** Toggle the state of the current button toggle. */
    private _toggle();
    /** Checks the button toggle due to an interaction with the underlying native input. */
    _onInputChange(event: Event): void;
    _onInputClick(event: Event): void;
    /** Dispatch change event with current value. */
    private _emitChangeEvent();
    ngOnDestroy(): void;
}
