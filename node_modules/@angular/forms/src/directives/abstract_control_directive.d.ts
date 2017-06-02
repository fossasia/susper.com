/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '../model';
import { ValidationErrors } from './validators';
/**
 * Base class for control directives.
 *
 * Only used internally in the forms module.
 *
 * @stable
 */
export declare abstract class AbstractControlDirective {
    readonly abstract control: AbstractControl | null;
    readonly value: any;
    readonly valid: boolean | null;
    readonly invalid: boolean | null;
    readonly pending: boolean | null;
    readonly errors: ValidationErrors | null;
    readonly pristine: boolean | null;
    readonly dirty: boolean | null;
    readonly touched: boolean | null;
    readonly untouched: boolean | null;
    readonly disabled: boolean | null;
    readonly enabled: boolean | null;
    readonly statusChanges: Observable<any> | null;
    readonly valueChanges: Observable<any> | null;
    readonly path: string[] | null;
    reset(value?: any): void;
    hasError(errorCode: string, path?: string[]): boolean;
    getError(errorCode: string, path?: string[]): any;
}
