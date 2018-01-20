import * as ts from 'typescript';
import { CompilerOptions } from './ngtools_api';
import { CancellationToken } from './gather_diagnostics';
export declare enum MESSAGE_KIND {
    Init = 0,
    Update = 1,
}
export declare abstract class TypeCheckerMessage {
    kind: MESSAGE_KIND;
    constructor(kind: MESSAGE_KIND);
}
export declare class InitMessage extends TypeCheckerMessage {
    compilerOptions: ts.CompilerOptions;
    basePath: string;
    jitMode: boolean;
    rootNames: string[];
    constructor(compilerOptions: ts.CompilerOptions, basePath: string, jitMode: boolean, rootNames: string[]);
}
export declare class UpdateMessage extends TypeCheckerMessage {
    rootNames: string[];
    changedCompilationFiles: string[];
    constructor(rootNames: string[], changedCompilationFiles: string[]);
}
export declare const AUTO_START_ARG = "9d93e901-158a-4cf9-ba1b-2f0582ffcfeb";
export declare class TypeChecker {
    private _compilerOptions;
    private _JitMode;
    private _rootNames;
    private _program;
    private _compilerHost;
    constructor(_compilerOptions: CompilerOptions, _basePath: string, _JitMode: boolean, _rootNames: string[]);
    private _update(rootNames, changedCompilationFiles);
    private _createOrUpdateProgram();
    private _diagnose(cancellationToken);
    update(rootNames: string[], changedCompilationFiles: string[], cancellationToken: CancellationToken): void;
}
