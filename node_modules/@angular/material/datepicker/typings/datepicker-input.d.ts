import { AfterContentInit, ElementRef, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';
import { DateAdapter, MatDateFormats } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatDatepicker } from './datepicker';
export declare const MAT_DATEPICKER_VALUE_ACCESSOR: any;
export declare const MAT_DATEPICKER_VALIDATORS: any;
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 */
export declare class MatDatepickerInputEvent<D> {
    target: MatDatepickerInput<D>;
    targetElement: HTMLElement;
    /** The new value for the target datepicker input. */
    value: D | null;
    constructor(target: MatDatepickerInput<D>, targetElement: HTMLElement);
}
/** Directive used to connect an input to a MatDatepicker. */
export declare class MatDatepickerInput<D> implements AfterContentInit, ControlValueAccessor, OnDestroy, Validator {
    private _elementRef;
    private _renderer;
    private _dateAdapter;
    private _dateFormats;
    private _formField;
    /** The datepicker that this input is associated with. */
    matDatepicker: MatDatepicker<D>;
    _datepicker: MatDatepicker<D>;
    private registerDatepicker(value);
    matDatepickerFilter: (date: D | null) => boolean;
    _dateFilter: (date: D | null) => boolean;
    /** The value of the input. */
    value: D | null;
    private _value;
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
    dateChange: EventEmitter<MatDatepickerInputEvent<D>>;
    /** Emits when an `input` event is fired on this `<input>`. */
    dateInput: EventEmitter<MatDatepickerInputEvent<D>>;
    /** Emits when the value changes (either due to user input or programmatic change). */
    _valueChange: EventEmitter<D | null>;
    /** Emits when the disabled state has changed */
    _disabledChange: EventEmitter<boolean>;
    _onTouched: () => void;
    private _cvaOnChange;
    private _validatorOnChange;
    private _datepickerSubscription;
    private _localeSubscription;
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
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _dateAdapter: DateAdapter<D>, _dateFormats: MatDateFormats, _formField: MatFormField);
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
