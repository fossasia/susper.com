/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare type BudgetType = 'all' | 'allScript' | 'any' | 'anyScript' | 'bundle' | 'initial';
export interface Budget {
    /**
     * The type of budget
     */
    type: BudgetType;
    /**
     * The name of the bundle
     */
    name?: string;
    /**
     * The baseline size for comparison.
     */
    baseline?: string;
    /**
     * The maximum threshold for warning relative to the baseline.
     */
    maximumWarning?: string;
    /**
     * The maximum threshold for error relative to the baseline.
     */
    maximumError?: string;
    /**
     * The minimum threshold for warning relative to the baseline.
     */
    minimumWarning?: string;
    /**
     * The minimum threshold for error relative to the baseline.
     */
    minimumError?: string;
    /**
     * The threshold for warning relative to the baseline (min & max).
     */
    warning?: string;
    /**
     * The threshold for error relative to the baseline (min & max).
     */
    error?: string;
}
export interface Compilation {
    assets: any;
    chunks: any[];
    warnings: string[];
    errors: string[];
}
export interface Size {
    size: number;
    label?: string;
}
export declare function calculateSizes(budget: Budget, compilation: Compilation): Size[];
export declare abstract class Calculator {
    protected budget: Budget;
    protected compilation: Compilation;
    constructor(budget: Budget, compilation: Compilation);
    abstract calculate(): Size[];
}
/**
 * Calculate the bytes given a string value.
 */
export declare function calculateBytes(val: string, baseline?: string, factor?: ('pos' | 'neg')): number;
