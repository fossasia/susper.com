import * as ts from 'typescript';
/** Tsickle settings passed on the command line. */
export interface Settings {
    /** If provided, path to save externs to. */
    externsPath?: string;
    /** If provided, convert every type to the Closure {?} type */
    isUntyped: boolean;
    /** If true, log internal debug warnings to the console. */
    verbose?: boolean;
}
/**
 * Compiles TypeScript code into Closure-compiler-ready JS.
 * Doesn't write any files to disk; all JS content is returned in a map.
 */
export declare function toClosureJS(options: ts.CompilerOptions, fileNames: string[], settings: Settings, allDiagnostics: ts.Diagnostic[], files?: Map<string, string>): {
    jsFiles: Map<string, string>;
    externs: string;
} | null;
