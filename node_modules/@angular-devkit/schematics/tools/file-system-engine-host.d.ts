/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { RuleFactory } from '@angular-devkit/schematics';
import { FileSystemCollectionDesc, FileSystemSchematicDesc } from './description';
import { FileSystemEngineHostBase } from './file-system-engine-host-base';
/**
 * A simple EngineHost that uses a root with one directory per collection inside of it. The
 * collection declaration follows the same rules as the regular FileSystemEngineHostBase.
 */
export declare class FileSystemEngineHost extends FileSystemEngineHostBase {
    protected _root: string;
    constructor(_root: string);
    protected _resolveCollectionPath(name: string): string;
    protected _resolveReferenceString(refString: string, parentPath: string): {
        ref: RuleFactory<{}>;
        path: string;
    } | null;
    protected _transformCollectionDescription(name: string, desc: Partial<FileSystemCollectionDesc>): FileSystemCollectionDesc;
    protected _transformSchematicDescription(name: string, _collection: FileSystemCollectionDesc, desc: Partial<FileSystemSchematicDesc>): FileSystemSchematicDesc;
}
