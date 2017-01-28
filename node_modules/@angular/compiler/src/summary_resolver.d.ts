/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileTypeSummary } from './compile_metadata';
export interface Summary<T> {
    symbol: T;
    metadata: any;
    type?: CompileTypeSummary;
}
export declare class SummaryResolver<T> {
    resolveSummary(reference: T): Summary<T>;
    getSymbolsOf(filePath: string): T[];
}
