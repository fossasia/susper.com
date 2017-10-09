/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Logger } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs/Observable';
export interface SchematicSchemaT {
}
export declare class SchematicTestRunner {
    private _collectionName;
    private _engineHost;
    private _engine;
    private _collection;
    private _logger;
    private _registry;
    constructor(_collectionName: string, collectionPath: string);
    readonly logger: Logger;
    runSchematicAsync(schematicName: string, opts?: SchematicSchemaT, tree?: Tree): Observable<Tree>;
    runSchematic(schematicName: string, opts?: SchematicSchemaT, tree?: Tree): Tree;
}
