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
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs/Subject';
import { MatFormFieldControl } from '@angular/material/form-field';
/** Directive that allows a native input to work inside a `MatFormField`. */
export declare class MatInput implements MatFormFieldControl<any>, OnChanges, OnDestroy, DoCheck {
    protected _elementRef: ElementRef;
    protected _renderer: Renderer2;
    protected _platform: Platform;
    ngControl: NgControl;
    protected _parentForm: NgForm;
    protected _parentFormGroup: FormGroupDirective;
    private _defaultErrorStateMatcher;
    /** Variables used as cache for getters and setters. */
    protected _type: string;
    protected _disabled: boolean;
    protected _required: boolean;
    protected _id: string;
    protected _uid: string;
    protected _previousNativeValue: string;
    private _readonly;
    /** Whether the input is focused. */
    focused: boolean;
    /** Whether the input is in an error state. */
    errorState: boolean;
    /** The aria-describedby attribute on the input for improved a11y. */
    _ariaDescribedby: string;
    /**
     * Stream that emits whenever the state of the input changes such that the wrapping `MatFormField`
     * needs to run change detection.
     */
    stateChanges: Subject<void>;
    /** A name for this control that can be used by `mat-form-field`. */
    controlType: string;
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
    /** An object used to control when error messages are shown. */
    errorStateMatcher: ErrorStateMatcher;
    /** The input element's value. */
    value: string;
    /** Whether the element is readonly. */
    readonly: any;
    protected _neverEmptyInputTypes: string[];
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _platform: Platform, ngControl: NgControl, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, _defaultErrorStateMatcher: ErrorStateMatcher);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngDoCheck(): void;
    focus(): void;
    /** Callback for the cases where the focused state of the input changes. */
    _focusChanged(isFocused: boolean): void;
    _onInput(): void;
    /** Re-evaluates the error state. This is only relevant with @angular/forms. */
    protected _updateErrorState(): void;
    /** Does some manual dirty checking on the native input `value` property. */
    protected _dirtyCheckNativeValue(): void;
    /** Make sure the input is a supported type. */
    protected _validateType(): void;
    /** Checks whether the input type is one of the types that are never empty. */
    protected _isNeverEmpty(): boolean;
    /** Checks whether the input is invalid based on the native validation. */
    protected _isBadInput(): boolean;
    /** Determines if the component host is a textarea. If not recognizable it returns false. */
    protected _isTextarea(): boolean;
    readonly empty: boolean;
    readonly shouldPlaceholderFloat: boolean;
    setDescribedByIds(ids: string[]): void;
    onContainerClick(): void;
}
