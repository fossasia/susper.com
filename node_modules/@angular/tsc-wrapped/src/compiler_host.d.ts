import * as ts from 'typescript';
import NgOptions from './options';
export declare function formatDiagnostics(d: ts.Diagnostic[]): string;
/**
 * Implementation of CompilerHost that forwards all methods to another instance.
 * Useful for partial implementations to override only methods they care about.
 */
export declare abstract class DelegatingHost implements ts.CompilerHost {
    protected delegate: ts.CompilerHost;
    constructor(delegate: ts.CompilerHost);
    getSourceFile: (fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void) => ts.SourceFile;
    getCancellationToken: () => ts.CancellationToken;
    getDefaultLibFileName: (options: ts.CompilerOptions) => string;
    getDefaultLibLocation: () => string;
    writeFile: ts.WriteFileCallback;
    getCurrentDirectory: () => string;
    getDirectories: (path: string) => string[];
    getCanonicalFileName: (fileName: string) => string;
    useCaseSensitiveFileNames: () => boolean;
    getNewLine: () => string;
    fileExists: (fileName: string) => boolean;
    readFile: (fileName: string) => string;
    trace: (s: string) => void;
    directoryExists: (directoryName: string) => boolean;
}
export declare class DecoratorDownlevelCompilerHost extends DelegatingHost {
    private program;
    private ANNOTATION_SUPPORT;
    /** Error messages produced by tsickle, if any. */
    diagnostics: ts.Diagnostic[];
    constructor(delegate: ts.CompilerHost, program: ts.Program);
    getSourceFile: (fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void) => ts.SourceFile;
}
export declare class TsickleCompilerHost extends DelegatingHost {
    private oldProgram;
    private options;
    /** Error messages produced by tsickle, if any. */
    diagnostics: ts.Diagnostic[];
    constructor(delegate: ts.CompilerHost, oldProgram: ts.Program, options: NgOptions);
    getSourceFile: (fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void) => ts.SourceFile;
}
export declare class MetadataWriterHost extends DelegatingHost {
    private ngOptions;
    private metadataCollector;
    private metadataCollector1;
    constructor(delegate: ts.CompilerHost, ngOptions: NgOptions);
    private writeMetadata(emitFilePath, sourceFile);
    writeFile: ts.WriteFileCallback;
}
