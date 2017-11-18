/// <reference types="node" />
import { FileSystemTreeHost } from '@angular-devkit/schematics';
export declare class FileSystemHost implements FileSystemTreeHost {
    private _root;
    constructor(_root: string);
    listDirectory(path: string): string[];
    isDirectory(path: string): boolean;
    readFile(path: string): Buffer;
    exists(path: string): boolean;
    join(path1: string, path2: string): string;
}
