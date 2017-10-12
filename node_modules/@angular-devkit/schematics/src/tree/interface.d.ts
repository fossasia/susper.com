/// <reference types="node" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Path, PathFragment } from '@angular-devkit/core';
import { Action } from './action';
export declare enum MergeStrategy {
    AllowOverwriteConflict = 2,
    AllowCreationConflict = 4,
    AllowDeleteConflict = 8,
    Default = 0,
    Error = 1,
    ContentOnly = 2,
    Overwrite = 14,
}
export interface FileEntry {
    readonly path: Path;
    readonly content: Buffer;
}
export interface DirEntry {
    readonly parent: DirEntry | null;
    readonly path: Path;
    readonly subdirs: PathFragment[];
    readonly subfiles: PathFragment[];
    dir(name: PathFragment): DirEntry;
    file(name: PathFragment): FileEntry | null;
}
export interface FilePredicate<T> {
    (path: Path, entry?: Readonly<FileEntry> | null): T;
}
export interface Tree {
    readonly root: DirEntry;
    readonly files: string[];
    exists(path: string): boolean;
    read(path: string): Buffer | null;
    get(path: string): FileEntry | null;
    getDir(path: string): DirEntry;
    overwrite(path: string, content: Buffer | string): void;
    beginUpdate(path: string): UpdateRecorder;
    commitUpdate(record: UpdateRecorder): void;
    create(path: string, content: Buffer | string): void;
    delete(path: string): void;
    rename(from: string, to: string): void;
    apply(action: Action, strategy?: MergeStrategy): void;
    readonly actions: Action[];
}
export interface UpdateRecorder {
    insertLeft(index: number, content: Buffer | string): UpdateRecorder;
    insertRight(index: number, content: Buffer | string): UpdateRecorder;
    remove(index: number, length: number): UpdateRecorder;
}
