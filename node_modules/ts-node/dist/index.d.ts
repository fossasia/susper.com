import { BaseError } from 'make-error';
import * as TS from 'typescript';
export interface TSCommon {
    version: typeof TS.version;
    sys: typeof TS.sys;
    ScriptSnapshot: typeof TS.ScriptSnapshot;
    displayPartsToString: typeof TS.displayPartsToString;
    createLanguageService: typeof TS.createLanguageService;
    getDefaultLibFilePath: typeof TS.getDefaultLibFilePath;
    getPreEmitDiagnostics: typeof TS.getPreEmitDiagnostics;
    flattenDiagnosticMessageText: typeof TS.flattenDiagnosticMessageText;
    transpileModule: typeof TS.transpileModule;
    findConfigFile(path: string, fileExists?: (path: string) => boolean): string;
    readConfigFile(path: string, readFile?: (path: string) => string): {
        config?: any;
        error?: TS.Diagnostic;
    };
    parseJsonConfigFileContent?(json: any, host: any, basePath: string, existingOptions: any, configFileName: string): any;
    parseConfigFile?(json: any, host: any, basePath: string): any;
}
export declare const VERSION: any;
export interface Options {
    fast?: boolean;
    lazy?: boolean;
    cache?: boolean;
    cacheDirectory?: string;
    compiler?: string;
    project?: string;
    ignoreWarnings?: Array<number | string>;
    disableWarnings?: boolean;
    getFile?: (fileName: string) => string;
    getVersion?: (fileName: string) => string;
    fileExists?: (fileName: string) => boolean;
    compilerOptions?: any;
}
export interface TypeInfo {
    name: string;
    comment: string;
}
export interface Register {
    cwd: string;
    compile(fileName: string): string;
    getTypeInfo(fileName: string, position: number): TypeInfo;
}
export declare function register(opts?: Options): () => Register;
export declare function getVersion(fileName: string): string;
export declare function fileExists(fileName: string): boolean;
export declare function getDirectories(path: string): string[];
export declare function directoryExists(path: string): boolean;
export declare function getFile(fileName: string): string;
export declare class TSError extends BaseError {
    name: string;
    diagnostics: string[];
    constructor(diagnostics: string[]);
}
