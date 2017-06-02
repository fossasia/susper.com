/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare const MODULE_SUFFIX = "";
export declare function camelCaseToDashCase(input: string): string;
export declare function dashCaseToCamelCase(input: string): string;
export declare function splitAtColon(input: string, defaultValues: string[]): string[];
export declare function splitAtPeriod(input: string, defaultValues: string[]): string[];
export declare function visitValue(value: any, visitor: ValueVisitor, context: any): any;
export declare function isDefined(val: any): boolean;
export declare function noUndefined<T>(val: T | undefined): T;
export interface ValueVisitor {
    visitArray(arr: any[], context: any): any;
    visitStringMap(map: {
        [key: string]: any;
    }, context: any): any;
    visitPrimitive(value: any, context: any): any;
    visitOther(value: any, context: any): any;
}
export declare class ValueTransformer implements ValueVisitor {
    visitArray(arr: any[], context: any): any;
    visitStringMap(map: {
        [key: string]: any;
    }, context: any): any;
    visitPrimitive(value: any, context: any): any;
    visitOther(value: any, context: any): any;
}
export declare class SyncAsyncResult<T> {
    syncResult: T | null;
    asyncResult: Promise<T> | null;
    constructor(syncResult: T | null, asyncResult?: Promise<T> | null);
}
export declare function syntaxError(msg: string): Error;
export declare function isSyntaxError(error: Error): boolean;
export declare function escapeRegExp(s: string): string;
export declare function utf8Encode(str: string): string;
