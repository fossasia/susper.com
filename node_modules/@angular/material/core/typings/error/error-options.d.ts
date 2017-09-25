/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
/** Injection token that can be used to specify the global error options. */
export declare const MD_ERROR_GLOBAL_OPTIONS: InjectionToken<ErrorOptions>;
export declare type ErrorStateMatcher = (control: FormControl, form: FormGroupDirective | NgForm) => boolean;
export interface ErrorOptions {
    errorStateMatcher?: ErrorStateMatcher;
}
/** Returns whether control is invalid and is either touched or is a part of a submitted form. */
export declare function defaultErrorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean;
/** Returns whether control is invalid and is either dirty or is a part of a submitted form. */
export declare function showOnDirtyErrorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean;
