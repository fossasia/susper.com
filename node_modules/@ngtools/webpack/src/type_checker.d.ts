import * as ts from 'typescript';
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
