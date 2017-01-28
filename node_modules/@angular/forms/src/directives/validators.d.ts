/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnChanges, Provider, SimpleChanges } from '@angular/core';
import { AbstractControl } from '../model';
/**
 * An interface that can be implemented by classes that can act as validators.
 *
 * ## Usage
 *
 * ```typescript
 * @Directive({
 *   selector: '[custom-validator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(c: Control): {[key: string]: any} {
 *     return {"custom": true};
 *   }
 * }
 * ```
 *
 * @stable
 */
export interface Validator {
    validate(c: AbstractControl): {
        [key: string]: any;
    };
    registerOnValidatorChange?(fn: () => void): void;
}
export declare const REQUIRED_VALIDATOR: Provider;
export declare const CHECKBOX_REQUIRED_VALIDATOR: Provider;
/**
 * A Directive that adds the `required` validator to any controls marked with the
 * `required` attribute, via the {@link NG_VALIDATORS} binding.
 *
 * ### Example
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @stable
 */
export declare class RequiredValidator implements Validator {
    private _required;
    private _onChange;
    required: boolean;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
    registerOnValidatorChange(fn: () => void): void;
}
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute, via the {@link NG_VALIDATORS} binding.
 *
 * ### Example
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @experimental
 */
export declare class CheckboxRequiredValidator extends RequiredValidator {
    validate(c: AbstractControl): {
        [key: string]: any;
    };
}
/**
 * @stable
 */
export interface ValidatorFn {
    (c: AbstractControl): {
        [key: string]: any;
    };
}
/**
 * @stable
 */
export interface AsyncValidatorFn {
    (c: AbstractControl): any;
}
/**
 * Provider which adds {@link MinLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
export declare const MIN_LENGTH_VALIDATOR: any;
/**
 * A directive which installs the {@link MinLengthValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 * @stable
 */
export declare class MinLengthValidator implements Validator, OnChanges {
    private _validator;
    private _onChange;
    minlength: string;
    ngOnChanges(changes: SimpleChanges): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator();
}
/**
 * Provider which adds {@link MaxLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
export declare const MAX_LENGTH_VALIDATOR: any;
/**
 * A directive which installs the {@link MaxLengthValidator} for any `formControlName,
 * `formControl`,
 * or control with `ngModel` that also has a `maxlength` attribute.
 *
 * @stable
 */
export declare class MaxLengthValidator implements Validator, OnChanges {
    private _validator;
    private _onChange;
    maxlength: string;
    ngOnChanges(changes: SimpleChanges): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator();
}
export declare const PATTERN_VALIDATOR: any;
/**
 * A Directive that adds the `pattern` validator to any controls marked with the
 * `pattern` attribute, via the {@link NG_VALIDATORS} binding. Uses attribute value
 * as the regex to validate Control value against.  Follows pattern attribute
 * semantics; i.e. regex must match entire Control value.
 *
 * ### Example
 *
 * ```
 * <input [name]="fullName" pattern="[a-zA-Z ]*" ngModel>
 * ```
 * @stable
 */
export declare class PatternValidator implements Validator, OnChanges {
    private _validator;
    private _onChange;
    pattern: string;
    ngOnChanges(changes: SimpleChanges): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator();
}
