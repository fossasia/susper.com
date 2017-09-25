/// <reference types="node" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Path } from '@angular-devkit/core';
import { VirtualTree } from './virtual';
export interface FileSystemTreeHost {
    listDirectory: (path: string) => string[];
    isDirectory: (path: string) => boolean;
    readFile: (path: string) => Buffer;
    join: (path1: string, other: string) => string;
}
export declare class FileSystemTree extends VirtualTree {
    private _host;
    constructor(_host: FileSystemTreeHost, asCreate?: boolean);
    protected _recursiveFileList(): [string, Path][];
}
