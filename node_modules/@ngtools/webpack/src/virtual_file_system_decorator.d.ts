/// <reference types="node" />
import { Stats } from 'fs';
import { InputFileSystem, NodeWatchFileSystemInterface, Callback } from './webpack';
import { WebpackCompilerHost } from './compiler_host';
export declare const NodeWatchFileSystem: NodeWatchFileSystemInterface;
export declare class VirtualFileSystemDecorator implements InputFileSystem {
    private _inputFileSystem;
    private _webpackCompilerHost;
    constructor(_inputFileSystem: InputFileSystem, _webpackCompilerHost: WebpackCompilerHost);
    private _readFileSync(path);
    private _statSync(path);
    getVirtualFilesPaths(): string[];
    stat(path: string, callback: Callback<any>): void;
    readdir(path: string, callback: Callback<any>): void;
    readFile(path: string, callback: Callback<any>): void;
    readJson(path: string, callback: Callback<any>): void;
    readlink(path: string, callback: Callback<any>): void;
    statSync(path: string): Stats;
    readdirSync(path: string): string[];
    readFileSync(path: string): string;
    readJsonSync(path: string): string;
    readlinkSync(path: string): string;
    purge(changes?: string[] | string): void;
}
export declare class VirtualWatchFileSystemDecorator extends NodeWatchFileSystem {
    private _virtualInputFileSystem;
    constructor(_virtualInputFileSystem: VirtualFileSystemDecorator);
    watch(files: any, dirs: any, missing: any, startTime: any, options: any, callback: any, callbackUndelayed: any): any;
}
