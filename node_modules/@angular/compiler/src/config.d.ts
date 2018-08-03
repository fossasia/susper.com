/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { MissingTranslationStrategy, ViewEncapsulation } from '@angular/core';
export declare class CompilerConfig {
    defaultEncapsulation: ViewEncapsulation | null;
    enableLegacyTemplate: boolean;
    useJit: boolean;
    missingTranslation: MissingTranslationStrategy | null;
    constructor({defaultEncapsulation, useJit, missingTranslation, enableLegacyTemplate}?: {
        defaultEncapsulation?: ViewEncapsulation;
        useJit?: boolean;
        missingTranslation?: MissingTranslationStrategy;
        enableLegacyTemplate?: boolean;
    });
}
