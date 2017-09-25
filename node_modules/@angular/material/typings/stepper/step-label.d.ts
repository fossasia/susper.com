/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplateRef } from '@angular/core';
import { CdkStepLabel } from '@angular/cdk/stepper';
/** Workaround for https://github.com/angular/angular/issues/17849 */
export declare const _MdStepLabel: typeof CdkStepLabel;
export declare class MdStepLabel extends _MdStepLabel {
    constructor(template: TemplateRef<any>);
}
