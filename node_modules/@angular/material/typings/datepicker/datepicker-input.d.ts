/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { MdDatepicker } from './datepicker';
import { AbstractControl, ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';
import { MdFormField } from '../form-field/index';
import { DateAdapter } from '../core/datetime/index';
import { MdDateFormats } from '../core/datetime/date-formats';
export declare const MD_DATEPICKER_VALUE_ACCESSOR: any;
export declare const MD_DATEPICKER_VALIDATORS: any;
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MdDatepickerInputEvent instead.
 */
export declare class MdDatepickerInputEvent<D> {
    target: MdDatepickerInput<D>;
    targetElement: HTMLElement;
    /** The new value for the target datepicker input. */
    value: D | null;
    constructor(target: MdDatepickerInput<D>, targetElement: HTMLElement);
}
/** Directive used to connect an input to a MdDatepicker. */
export declare class MdDatepickerInput<D> implements AfterContentInit, ControlValueAccessor, OnDestroy, Validator {
    private _elementRef;
    private _renderer;
    private _dateAdapter;
    private _dateFormats;
    private _mdFormField;
    /** The datepicker that this input is associated with. */
    mdDatepicker: MdDatepicker<D>;
    _datepicker: MdDatepicker<D>;
    matDatepicker: MdDatepicker<D>;
    mdDatepickerFilter: (date: D | null) => boolean;
    _dateFilter: (date: D | null) => boolean;
    matDatepickerFilter: (date: D | null) => boolean;
    /** The value of the input. */
    value: D | null;
    /** The minimum valid date. */
    min: D | null;
    private _min;
    /** The maximum valid date. */
    max: D | null;
    private _max;
    /** Whether the datepicker-input is disabled. */
    disabled: any;
    private _disabled;
    /** Emits when a `change` event is fired on this `<input>`. */
    dateChange: EventEmitter<MdDatepickerInputEvent<D>>;
    /** Emits when an `input` event is fired on this `<input>`. */
    dateInput: EventEmitter<MdDatepickerInputEvent<D>>;
    /** Emits when the value changes (either due to user input or programmatic change). */
    _valueChange: EventEmitter<D | null>;
    _onTouched: () => void;
    private _cvaOnChange;
    private _validatorOnChange;
    private _datepickerSubscription;
    /** The form control validator for whether the input parses. */
    private _parseValidator;
    /** The form control validator for the min date. */
    private _minValidator;
    /** The form control validator for the max date. */
    private _maxValidator;
    /** The form control validator for the date filter. */
    private _filterValidator;
    /** The combined form control validator for this input. */
    private _validator;
    /** Whether the last value set on the input was valid. */
    private _lastValueValid;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _dateAdapter: DateAdapter<D>, _dateFormats: MdDateFormats, _mdFormField: MdFormField);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    registerOnValidatorChange(fn: () => void): void;
    validate(c: AbstractControl): ValidationErrors | null;
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getPopupConnectionElementRef(): ElementRef;
    writeValue(value: D): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(disabled: boolean): void;
    _onKeydown(event: KeyboardEvent): void;
    _onInput(value: string): void;
    _onChange(): void;
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    private _getValidDateOrNull(obj);
}
