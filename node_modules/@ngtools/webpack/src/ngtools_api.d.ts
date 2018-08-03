import * as ts from 'typescript';
export declare const DEFAULT_ERROR_CODE = 100;
export declare const UNKNOWN_ERROR_CODE = 500;
export declare const SOURCE: "angular";
export interface Diagnostic {
    messageText: string;
    span?: any;
    category: ts.DiagnosticCategory;
    code: number;
    source: 'angular';
}
export interface CompilerOptions extends ts.CompilerOptions {
    basePath?: string;
    skipMetadataEmit?: boolean;
    strictMetadataEmit?: boolean;
    skipTemplateCodegen?: boolean;
    flatModuleOutFile?: string;
    flatModuleId?: string;
    generateCodeForLibraries?: boolean;
    annotateForClosureCompiler?: boolean;
    annotationsAs?: 'decorators' | 'static fields';
    trace?: boolean;
    enableLegacyTemplate?: boolean;
    disableExpressionLowering?: boolean;
    i18nOutLocale?: string;
    i18nOutFormat?: string;
    i18nOutFile?: string;
    i18nInFormat?: string;
    i18nInLocale?: string;
    i18nInFile?: string;
    i18nInMissingTranslations?: 'error' | 'warning' | 'ignore';
    preserveWhitespaces?: boolean;
}
export interface CompilerHost extends ts.CompilerHost {
    moduleNameToFileName(moduleName: string, containingFile?: string): string | null;
    fileNameToModuleName(importedFilePath: string, containingFilePath: string): string | null;
    resourceNameToFileName(resourceName: string, containingFilePath: string): string | null;
    toSummaryFileName(fileName: string, referringSrcFileName: string): string;
    fromSummaryFileName(fileName: string, referringLibFileName: string): string;
    readResource?(fileName: string): Promise<string> | string;
}
export interface CustomTransformers {
    beforeTs?: ts.TransformerFactory<ts.SourceFile>[];
    afterTs?: ts.TransformerFactory<ts.SourceFile>[];
}
export interface TsEmitArguments {
    program: ts.Program;
    host: CompilerHost;
    options: CompilerOptions;
    targetSourceFile?: ts.SourceFile;
    writeFile?: ts.WriteFileCallback;
    cancellationToken?: ts.CancellationToken;
    emitOnlyDtsFiles?: boolean;
    customTransformers?: ts.CustomTransformers;
}
export interface TsEmitCallback {
    (args: TsEmitArguments): ts.EmitResult;
}
export interface Program {
    getTsProgram(): ts.Program;
    getTsOptionDiagnostics(cancellationToken?: ts.CancellationToken): ts.Diagnostic[];
    getNgOptionDiagnostics(cancellationToken?: ts.CancellationToken): Diagnostic[];
    getTsSyntacticDiagnostics(sourceFile?: ts.SourceFile, cancellationToken?: ts.CancellationToken): ts.Diagnostic[];
    getNgStructuralDiagnostics(cancellationToken?: ts.CancellationToken): Diagnostic[];
    getTsSemanticDiagnostics(sourceFile?: ts.SourceFile, cancellationToken?: ts.CancellationToken): ts.Diagnostic[];
    getNgSemanticDiagnostics(fileName?: string, cancellationToken?: ts.CancellationToken): Diagnostic[];
    loadNgStructureAsync(): Promise<void>;
    listLazyRoutes?(): LazyRoute[];
    emit({emitFlags, cancellationToken, customTransformers, emitCallback}: {
        emitFlags?: any;
        cancellationToken?: ts.CancellationToken;
        customTransformers?: CustomTransformers;
        emitCallback?: TsEmitCallback;
    }): ts.EmitResult;
}
export interface LazyRoute {
    route: string;
    module: {
        name: string;
        filePath: string;
    };
    referencedModule: {
        name: string;
        filePath: string;
    };
}
export declare type Diagnostics = ReadonlyArray<ts.Diagnostic | Diagnostic>;
export interface CreateProgramInterface {
    ({rootNames, options, host, oldProgram}: {
        rootNames: string[];
        options: CompilerOptions;
        host: CompilerHost;
        oldProgram?: Program;
    }): Program;
}
export interface CreateCompilerHostInterface {
    ({options, tsHost}: {
        options: CompilerOptions;
        tsHost?: ts.CompilerHost;
    }): CompilerHost;
}
export interface FormatDiagnosticsInterface {
    (diags: Diagnostics): string;
}
export interface ParsedConfiguration {
    project: string;
    options: CompilerOptions;
    rootNames: string[];
    emitFlags: any;
    errors: Diagnostics;
}
export interface ReadConfigurationInterface {
    (project: string, existingOptions?: ts.CompilerOptions): ParsedConfiguration;
}
export declare function CompilerCliIsSupported(): void;
export declare const VERSION: any;
export declare const __NGTOOLS_PRIVATE_API_2: any;
export declare const createProgram: CreateProgramInterface;
export declare const createCompilerHost: CreateCompilerHostInterface;
export declare const formatDiagnostics: FormatDiagnosticsInterface;
export declare const readConfiguration: ReadConfigurationInterface;
export declare const EmitFlags: any;
