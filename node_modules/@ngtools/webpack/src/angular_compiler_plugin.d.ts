import * as ts from 'typescript';
import { Tapable } from './webpack';
/**
 * Option Constants
 */
export interface AngularCompilerPluginOptions {
    sourceMap?: boolean;
    tsConfigPath: string;
    basePath?: string;
    entryModule?: string;
    mainPath?: string;
    skipCodeGeneration?: boolean;
    hostReplacementPaths?: {
        [path: string]: string;
    };
    singleFileIncludes?: string[];
    i18nInFile?: string;
    i18nInFormat?: string;
    i18nOutFile?: string;
    i18nOutFormat?: string;
    locale?: string;
    missingTranslation?: string;
    platform?: PLATFORM;
    compilerOptions?: ts.CompilerOptions;
}
export declare enum PLATFORM {
    Browser = 0,
    Server = 1,
}
export declare class AngularCompilerPlugin implements Tapable {
    private _options;
    private _compilerOptions;
    private _rootNames;
    private _singleFileIncludes;
    private _program;
    private _compilerHost;
    private _moduleResolutionCache;
    private _resourceLoader;
    private _lazyRoutes;
    private _tsConfigPath;
    private _entryModule;
    private _mainPath;
    private _basePath;
    private _transformers;
    private _platform;
    private _JitMode;
    private _emitSkipped;
    private _changedFileExtensions;
    private _firstRun;
    private _donePromise;
    private _normalizedLocale;
    private _warnings;
    private _errors;
    private _forkTypeChecker;
    private _typeCheckerProcess;
    private _forkedTypeCheckerInitialized;
    private readonly _ngCompilerSupportsNewApi;
    constructor(options: AngularCompilerPluginOptions);
    readonly options: AngularCompilerPluginOptions;
    readonly done: Promise<void>;
    readonly entryModule: {
        path: string;
        className: string;
    };
    static isSupported(): boolean;
    private _setupOptions(options);
    private _getTsProgram();
    private _getChangedTsFiles();
    updateChangedFileExtensions(extension: string): void;
    private _getChangedCompilationFiles();
    private _createOrUpdateProgram();
    private _getLazyRoutesFromNgtools();
    private _findLazyRoutesInAst(changedFilePaths);
    private _listLazyRoutesFromProgram();
    private _processLazyRoutes(discoveredLazyRoutes);
    private _createForkedTypeChecker();
    private _killForkedTypeChecker();
    private _updateForkedTypeChecker(rootNames, changedCompilationFiles);
    apply(compiler: any): void;
    private _make(compilation, cb);
    private pushCompilationErrors(compilation);
    private _makeTransformers();
    private _update();
    writeI18nOutFile(): void;
    getCompiledFile(fileName: string): {
        outputText: string;
        sourceMap: string;
        errorDependencies: string[];
    };
    getDependencies(fileName: string): string[];
    getResourceDependencies(fileName: string): string[];
    private _emit(sourceFiles);
    private _validateLocale(locale);
}
