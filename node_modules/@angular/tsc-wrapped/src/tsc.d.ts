import * as ts from 'typescript';
import AngularCompilerOptions from './options';
/**
 * Our interface to the TypeScript standard compiler.
 * If you write an Angular compiler plugin for another build tool,
 * you should implement a similar interface.
 */
export interface CompilerInterface {
    readConfiguration(project: string, basePath: string): {
        parsed: ts.ParsedCommandLine;
        ngOptions: AngularCompilerOptions;
    };
    typeCheck(compilerHost: ts.CompilerHost, program: ts.Program): void;
    emit(program: ts.Program): number;
}
export declare class UserError extends Error {
    private _nativeError;
    constructor(message: string);
    message: string;
    readonly name: string;
    stack: any;
    toString(): string;
}
export declare function formatDiagnostics(diags: ts.Diagnostic[]): string;
export declare function check(diags: ts.Diagnostic[]): void;
export declare function validateAngularCompilerOptions(options: AngularCompilerOptions): ts.Diagnostic[];
export declare class Tsc implements CompilerInterface {
    private readFile;
    private readDirectory;
    ngOptions: AngularCompilerOptions;
    parsed: ts.ParsedCommandLine;
    private basePath;
    constructor(readFile?: (path: string, encoding?: string) => string, readDirectory?: (path: string, extensions?: string[], exclude?: string[], include?: string[]) => string[]);
    readConfiguration(project: string, basePath: string): {
        parsed: ts.ParsedCommandLine;
        ngOptions: AngularCompilerOptions;
    };
    typeCheck(compilerHost: ts.CompilerHost, program: ts.Program): void;
    emit(program: ts.Program): number;
}
export declare var tsc: CompilerInterface;
