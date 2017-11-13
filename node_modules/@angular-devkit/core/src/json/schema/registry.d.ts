/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BaseException } from '../../exception/exception';
import { JsonSchema } from './schema';
export declare class JsonSchemaNotFoundException extends BaseException {
    constructor(ref: string);
}
export declare class JsonSchemaRegistry {
    private _cache;
    constructor();
    addSchema(ref: string, schema: JsonSchema): void;
    hasSchema(ref: string): boolean;
    getSchemaFromRef(ref: string): JsonSchema;
}
