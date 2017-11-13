/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BaseException } from '../../../exception/exception';
import { JsonSchemaRegistry } from '../registry';
import { JsonSchema } from '../schema';
import { JsonSchemaSerializer } from './interface';
export declare class InvalidRangeException<T> extends BaseException {
    constructor(name: string, value: T, comparator: string, expected: T);
}
export declare class InvalidValueException extends BaseException {
    constructor(name: string, value: {}, expected: string);
}
export declare class InvalidSchemaException extends BaseException {
    constructor(schema: JsonSchema);
}
export declare class InvalidPropertyNameException extends BaseException {
    readonly path: string;
    constructor(path: string);
}
export declare class RequiredValueMissingException extends BaseException {
    readonly path: string;
    constructor(path: string);
}
export declare const exceptions: {
    InvalidRangeException: typeof InvalidRangeException;
    InvalidSchemaException: typeof InvalidSchemaException;
    InvalidValueException: typeof InvalidValueException;
    InvalidPropertyNameException: typeof InvalidPropertyNameException;
    RequiredValueMissingException: typeof RequiredValueMissingException;
};
export interface JavascriptSerializerOptions {
    ignoreExtraProperties?: boolean;
    allowAccessUndefinedObjects?: boolean;
}
export declare class JavascriptSerializer<T> extends JsonSchemaSerializer<(value: T) => T> {
    private _options;
    private _uniqueSet;
    constructor(_options?: JavascriptSerializerOptions | undefined);
    protected _unique(name: string): string;
    serialize(ref: string, registry: JsonSchemaRegistry): (value: T) => any;
}
