import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CanColor, CanDisable, CanDisableRipple, HasTabIndex, MatRipple } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
/**
 * Provider Expression that allows mat-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export declare const MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR: any;
/**
 * Represents the different states that require custom transitions between them.
 * @docs-private
 */
export declare enum TransitionCheckState {
    /** The initial state of the component before any user interaction. */
    Init = 0,
    /** The state representing the component when it's becoming checked. */
    Checked = 1,
    /** The state representing the component when it's becoming unchecked. */
    Unchecked = 2,
    /** The state representing the component when it's becoming indeterminate. */
    Indeterminate = 3,
}
/** Change event object emitted by MatCheckbox. */
export declare class MatCheckboxChange {
    /** The source MatCheckbox of the event. */
    source: MatCheckbox;
    /** The new `checked` value of the checkbox. */
    checked: boolean;
}
/** @docs-private */
export declare class MatCheckboxBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MatCheckboxMixinBase: (new (...args: any[]) => HasTabIndex) & (new (...args: any[]) => CanColor) & (new (...args: any[]) => CanDisableRipple) & (new (...args: any[]) => CanDisable) & typeof MatCheckboxBase;
/**
 * A material design checkbox component. Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. A MatCheckbox can be either checked, unchecked, indeterminate, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 * See: https://www.google.com/design/spec/components/selection-controls.html
 */
export declare class MatCheckbox extends _MatCheckboxMixinBase implements ControlValueAccessor, AfterViewInit, OnDestroy, CanColor, CanDisable, HasTabIndex, CanDisableRipple {
    private _changeDetectorRef;
    private _focusMonitor;
    /**
     * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
     * take precedence so this may be omitted.
     */
    ariaLabel: string;
    /**
     * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
     */
    ariaLabelledby: string | null;
    private _uniqueId;
    /** A unique id for the checkbox input. If none is supplied, it will be auto-generated. */
    id: string;
    /** Returns the unique id for the visual hidden input. */
    readonly inputId: string;
    private _required;
    /** Whether the checkbox is required. */
    required: boolean;
    /**
     * Whether or not the checkbox should appear before or after the label.
     * @deprecated
     */
    align: 'start' | 'end';
    /** Whether the label should appear after or before the checkbox. Defaults to 'after' */
    labelPosition: 'before' | 'after';
    /** Name value will be applied to the input element if present */
    name: string | null;
    /** Event emitted when the checkbox's `checked` value changes. */
    change: EventEmitter<MatCheckboxChange>;
    /** Event emitted when the checkbox's `indeterminate` value changes. */
    indeterminateChange: EventEmitter<boolean>;
    /** The value attribute of the native input element */
    value: string;
    /** The native `<input type="checkbox"> element */
    _inputElement: ElementRef;
    /** Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor. */
    _ripple: MatRipple;
    /**
     * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
     * @docs-private
     */
    onTouched: () => any;
    private _currentAnimationClass;
    private _currentCheckState;
    private _checked;
    private _indeterminate;
    private _controlValueAccessorChangeFn;
    /** Reference to the focused state ripple. */
    private _focusRipple;
    constructor(renderer: Renderer2, elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef, _focusMonitor: FocusMonitor, tabIndex: string);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Whether the checkbox is checked.
     */
    checked: boolean;
    /**
     * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
     * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
     * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
     * set to false.
     */
    indeterminate: boolean;
    _isRippleDisabled(): boolean;
    /** Method being called whenever the label text changes. */
    _onLabelTextChange(): void;
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value Value to be set to the model.
     */
    writeValue(value: any): void;
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Function to be called on change.
     */
    registerOnChange(fn: (value: any) => void): void;
    /**
     * Registers a callback to be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be triggered when the checkbox is touched.
     */
    registerOnTouched(fn: any): void;
    /**
     * Sets the checkbox's disabled state. Implemented as a part of ControlValueAccessor.
     * @param isDisabled Whether the checkbox should be disabled.
     */
    setDisabledState(isDisabled: boolean): void;
    private _transitionCheckState(newState);
    private _emitChangeEvent();
    /** Function is called whenever the focus changes for the input element. */
    private _onInputFocusChange(focusOrigin);
    /** Toggles the `checked` state of the checkbox. */
    toggle(): void;
    /**
     * Event handler for checkbox input element.
     * Toggles checked state if element is not disabled.
     * Do not toggle on (change) event since IE doesn't fire change event when
     *   indeterminate checkbox is clicked.
     * @param event
     */
    _onInputClick(event: Event): void;
    /** Focuses the checkbox. */
    focus(): void;
    _onInteractionEvent(event: Event): void;
    private _getAnimationClassForCheckStateTransition(oldState, newState);
    /** Fades out the focus state ripple. */
    private _removeFocusRipple();
}
