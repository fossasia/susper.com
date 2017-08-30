/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DoCheck, ElementRef, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Platform } from '@angular/cdk/platform';
import { ErrorOptions, ErrorStateMatcher } from '../core/error/error-options';
import { Subject } from 'rxjs/Subject';
import { MdFormFieldControl } from '../form-field/index';
/** Directive that allows a native input to work inside a `MdFormField`. */
export declare class MdInput implements MdFormFieldControl<any>, OnChanges, OnDestroy, DoCheck {
    private _elementRef;
    private _renderer;
    private _platform;
    ngControl: NgControl;
    private _parentForm;
    private _parentFormGroup;
    /** Variables used as cache for getters and setters. */
    private _type;
    private _disabled;
    private _required;
    private _id;
    private _uid;
    private _errorOptions;
    private _previousNativeValue;
    /** Whether the input is focused. */
    focused: boolean;
    /** Whether the input is in an error state. */
    errorState: boolean;
    /** The aria-describedby attribute on the input for improved a11y. */
    _ariaDescribedby: string;
    /**
     * Stream that emits whenever the state of the input changes such that the wrapping `MdFormField`
     * needs to run change detection.
     */
    stateChanges: Subject<void>;
    /** Whether the element is disabled. */
    disabled: any;
    /** Unique id of the element. */
    id: string;
    /** Placeholder attribute of the element. */
    placeholder: string;
    /** Whether the element is required. */
    required: any;
    /** Input type of the element. */
    type: string;
    /** A function used to control when error messages are shown. */
    errorStateMatcher: ErrorStateMatcher;
    /** The input element's value. */
    value: string;
    private _neverEmptyInputTypes;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _platform: Platform, ngControl: NgControl, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, errorOptions: ErrorOptions);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngDoCheck(): void;
    /** Callback for the cases where the focused state of the input changes. */
    _focusChanged(isFocused: boolean): void;
    _onInput(): void;
    /** Re-evaluates the error state. This is only relevant with @angular/forms. */
    private _updateErrorState();
    /** Does some manual dirty checking on the native input `value` property. */
    private _dirtyCheckNativeValue();
    /** Make sure the input is a supported type. */
    private _validateType();
    /** Checks whether the input type is one of the types that are never empty. */
    private _isNeverEmpty();
    /** Checks whether the input is invalid based on the native validation. */
    private _isBadInput();
    /** Determines if the component host is a textarea. If not recognizable it returns false. */
    private _isTextarea();
    readonly empty: boolean;
    setDescribedByIds(ids: string[]): void;
    focus(): void;
}
