/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { logging } from '@angular-devkit/core';
import { Observable } from 'rxjs/Observable';
import { DelegateTree, Rule, SchematicContext, Tree } from '../src';
export declare class UnitTestTree extends DelegateTree {
    readonly files: string[];
    readContent(path: string): string;
}
export declare class SchematicTestRunner {
    private _collectionName;
    private _engineHost;
    private _engine;
    private _collection;
    private _logger;
    constructor(_collectionName: string, collectionPath: string);
    readonly logger: logging.Logger;
    runSchematicAsync<SchematicSchemaT>(schematicName: string, opts?: SchematicSchemaT, tree?: Tree): Observable<UnitTestTree>;
    runSchematic<SchematicSchemaT>(schematicName: string, opts?: SchematicSchemaT, tree?: Tree): UnitTestTree;
    callRule(rule: Rule, tree: Tree, parentContext?: Partial<SchematicContext>): Observable<Tree>;
}
