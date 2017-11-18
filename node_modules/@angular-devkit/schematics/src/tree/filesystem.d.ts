/// <reference types="node" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Path, PathFragment } from '@angular-devkit/core';
import { DirEntry, FileEntry, Tree } from './interface';
import { VirtualDirEntry, VirtualTree } from './virtual';
export interface FileSystemTreeHost {
    listDirectory: (path: string) => string[];
    isDirectory: (path: string) => boolean;
    readFile: (path: string) => Buffer;
    exists: (path: string) => boolean;
    join: (path1: string, other: string) => string;
}
export declare class FileSystemDirEntry extends VirtualDirEntry {
    protected _host: FileSystemTreeHost;
    protected _systemPath: string;
    constructor(_host: FileSystemTreeHost, tree: FileSystemTree, _systemPath?: string, path?: Path);
    protected _createDir(name: PathFragment): DirEntry;
    readonly parent: DirEntry | null;
    readonly subdirs: PathFragment[];
    readonly subfiles: PathFragment[];
    file(name: PathFragment): FileEntry | null;
}
export declare class FileSystemTree extends VirtualTree {
    private _host;
    protected _initialized: boolean;
    constructor(_host: FileSystemTreeHost);
    readonly tree: Map<Path, FileEntry>;
    get(path: string): FileEntry | null;
    branch(): Tree;
    protected _copyTo<T extends VirtualTree>(tree: T): void;
    protected _recursiveFileList(): [string, Path][];
}
export declare class FileSystemCreateTree extends FileSystemTree {
    constructor(host: FileSystemTreeHost);
}
