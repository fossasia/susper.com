/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BaseException, schema } from '@angular-devkit/core';
import { Observable } from 'rxjs/Observable';
import { SchematicDescription } from '../src';
import { FileSystemCollectionDescription, FileSystemSchematicDescription } from './description';
export declare type SchematicDesc = SchematicDescription<FileSystemCollectionDescription, FileSystemSchematicDescription>;
export declare class InvalidInputOptions extends BaseException {
    constructor(options: any, errors: string[]);
}
export declare function validateOptionsWithSchema(registry: schema.SchemaRegistry): <T extends {}>(schematic: SchematicDescription<FileSystemCollectionDescription, FileSystemSchematicDescription>, options: T) => Observable<T>;
