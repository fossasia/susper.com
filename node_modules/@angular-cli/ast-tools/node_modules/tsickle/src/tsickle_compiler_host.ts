import * as path from 'path';
import {SourceMapConsumer, SourceMapGenerator} from 'source-map';
import * as ts from 'typescript';

import {convertDecorators} from './decorator-annotator';
import {processES5} from './es5processor';
import {ModulesManifest} from './modules_manifest';
import {annotate} from './tsickle';

/**
 * Tsickle can perform 2 different precompilation transforms - decorator downleveling
 * and closurization.  Both require tsc to have already type checked their
 * input, so they can't both be run in one call to tsc. If you only want one of
 * the transforms, you can specify it in the constructor, if you want both, you'll
 * have to specify it by calling reconfigureForRun() with the appropriate Pass.
 */
export enum Pass {
  NONE,
  DECORATOR_DOWNLEVEL,
  CLOSURIZE
}

export interface Options {
  googmodule?: boolean;
  es5Mode?: boolean;
  prelude?: string;
  /**
   * If true, convert every type to the Closure {?} type, which means
   * "don't check types".
   */
  untyped?: boolean;
  /**
   * If provided a function that logs an internal warning.
   * These warnings are not actionable by an end user and should be hidden
   * by default.
   */
  logWarning?: (warning: ts.Diagnostic) => void;
  /** If provided, a set of paths whose types should always generate as {?}. */
  typeBlackListPaths?: Set<string>;
  /**
   * Convert shorthand "/index" imports to full path (include the "/index").
   * Annotation will be slower because every import must be resolved.
   */
  convertIndexImportShorthand?: boolean;
}

/**
 *  Provides hooks to customize TsickleCompilerHost's behavior for different
 *  compilation environments.
 */
export interface TsickleHost {
  /**
   * If true, tsickle and decorator downlevel processing will be skipped for
   * that file.
   */
  shouldSkipTsickleProcessing(fileName: string): boolean;
  /**
   * Takes a context (the current file) and the path of the file to import
   *  and generates a googmodule module name
   */
  pathToModuleName(context: string, importPath: string): string;
  /**
   * Tsickle treats warnings as errors, if true, ignore warnings.  This might be
   * useful for e.g. third party code.
   */
  shouldIgnoreWarningsForPath(filePath: string): boolean;
  /**
   * If we do googmodule processing, we polyfill module.id, since that's
   * part of ES6 modules.  This function determines what the module.id will be
   * for each file.
   */
  fileNameToModuleId(fileName: string): string;
}

const ANNOTATION_SUPPORT = `
interface DecoratorInvocation {
  type: Function;
  args?: any[];
}
`;


/**
 * TsickleCompilerHost does tsickle processing of input files, including
 * closure type annotation processing, decorator downleveling and
 * require -> googmodule rewriting.
 */
export class TsickleCompilerHost implements ts.CompilerHost {
  // The manifest of JS modules output by the compiler.
  public modulesManifest: ModulesManifest = new ModulesManifest();

  /** Error messages produced by tsickle, if any. */
  public diagnostics: ts.Diagnostic[] = [];

  /** externs.js files produced by tsickle, if any. */
  public externs: {[fileName: string]: string} = {};

  private decoratorDownlevelSourceMaps = new Map<string, SourceMapGenerator>();
  private tsickleSourceMaps = new Map<string, SourceMapGenerator>();

  constructor(
      private delegate: ts.CompilerHost, private tscOptions: ts.CompilerOptions,
      private options: Options, private environment: TsickleHost,
      private runConfiguration?: {oldProgram: ts.Program, pass: Pass}) {}

  /**
   * Tsickle can perform 2 kinds of precompilation source transforms - decorator
   * downleveling and closurization.  They can't be run in the same run of the
   * typescript compiler, because they both depend on type information that comes
   * from running the compiler.  We need to use the same compiler host to run both
   * so we have all the source map data when finally write out.  Thus if we want
   * to run both transforms, we call reconfigureForRun() between the calls to
   * ts.createProgram().
   */
  public reconfigureForRun(oldProgram: ts.Program, pass: Pass) {
    this.runConfiguration = {oldProgram, pass};
  }

  getSourceFile(
      fileName: string, languageVersion: ts.ScriptTarget,
      onError?: (message: string) => void): ts.SourceFile {
    if (this.runConfiguration === undefined || this.runConfiguration.pass === Pass.NONE) {
      return this.delegate.getSourceFile(fileName, languageVersion, onError);
    }

    const sourceFile = this.runConfiguration.oldProgram.getSourceFile(fileName);
    switch (this.runConfiguration.pass) {
      case Pass.DECORATOR_DOWNLEVEL:
        return this.downlevelDecorators(
            sourceFile, this.runConfiguration.oldProgram, fileName, languageVersion);
      case Pass.CLOSURIZE:
        return this.closurize(
            sourceFile, this.runConfiguration.oldProgram, fileName, languageVersion);
      default:
        throw new Error('tried to use TsickleCompilerHost with unknown pass enum');
    }
  }

  writeFile(
      fileName: string, content: string, writeByteOrderMark: boolean,
      onError?: (message: string) => void, sourceFiles?: ts.SourceFile[]): void {
    if (path.extname(fileName) !== '.map') {
      fileName = this.delegate.getCanonicalFileName(fileName);
      if (this.options.googmodule && !fileName.match(/\.d\.ts$/)) {
        content = this.convertCommonJsToGoogModule(fileName, content);
      }
    } else {
      content = this.combineSourceMaps(content);
    }

    this.delegate.writeFile(fileName, content, writeByteOrderMark, onError, sourceFiles);
  }

  sourceMapConsumerToGenerator(sourceMapConsumer: SourceMapConsumer): SourceMapGenerator {
    return SourceMapGenerator.fromSourceMap(sourceMapConsumer);
  }

  sourceMapGeneratorToConsumer(sourceMapGenerator: SourceMapGenerator): SourceMapConsumer {
    const rawSourceMap = sourceMapGenerator.toJSON();
    return new SourceMapConsumer(rawSourceMap);
  }

  sourceMapTextToConsumer(sourceMapText: string): SourceMapConsumer {
    const sourceMapJson: any = sourceMapText;
    return new SourceMapConsumer(sourceMapJson);
  }

  combineSourceMaps(tscSourceMapText: string): string {
    const tscSourceMapConsumer = this.sourceMapTextToConsumer(tscSourceMapText);
    const tscSourceMapGenerator = this.sourceMapConsumerToGenerator(tscSourceMapConsumer);
    if (this.tsickleSourceMaps.size > 0) {
      // TODO(lucassloan): remove when the .d.ts has the correct types
      for (const sourceFileName of (tscSourceMapConsumer as any).sources) {
        const tsickleSourceMapGenerator = this.tsickleSourceMaps.get(sourceFileName)!;
        const tsickleSourceMapConsumer =
            this.sourceMapGeneratorToConsumer(tsickleSourceMapGenerator);
        tscSourceMapGenerator.applySourceMap(tsickleSourceMapConsumer);
      }
    }
    if (this.decoratorDownlevelSourceMaps.size > 0) {
      // TODO(lucassloan): remove when the .d.ts has the correct types
      for (const sourceFileName of (tscSourceMapConsumer as any).sources) {
        const decoratorDownlevelSourceMapGenerator =
            this.decoratorDownlevelSourceMaps.get(sourceFileName)!;
        const decoratorDownlevelSourceMapConsumer =
            this.sourceMapGeneratorToConsumer(decoratorDownlevelSourceMapGenerator);
        tscSourceMapGenerator.applySourceMap(decoratorDownlevelSourceMapConsumer);
      }
    }

    return tscSourceMapGenerator.toString();
  }

  convertCommonJsToGoogModule(fileName: string, content: string): string {
    const moduleId = this.environment.fileNameToModuleId(fileName);

    let {output, referencedModules} = processES5(
        fileName, moduleId, content, this.environment.pathToModuleName.bind(this.environment),
        this.options.es5Mode, this.options.prelude);

    const moduleName = this.environment.pathToModuleName('', fileName);
    this.modulesManifest.addModule(fileName, moduleName);
    for (let referenced of referencedModules) {
      this.modulesManifest.addReferencedModule(fileName, referenced);
    }

    return output;
  }

  private downlevelDecorators(
      sourceFile: ts.SourceFile, program: ts.Program, fileName: string,
      languageVersion: ts.ScriptTarget): ts.SourceFile {
    if (this.environment.shouldSkipTsickleProcessing(fileName)) return sourceFile;
    let fileContent = sourceFile.text;
    const converted = convertDecorators(program.getTypeChecker(), sourceFile);
    if (converted.diagnostics) {
      this.diagnostics.push(...converted.diagnostics);
    }
    if (converted.output === fileContent) {
      // No changes; reuse the existing parse.
      return sourceFile;
    }
    fileContent = converted.output + ANNOTATION_SUPPORT;
    this.decoratorDownlevelSourceMaps.set(fileName, converted.sourceMap);
    return ts.createSourceFile(fileName, fileContent, languageVersion, true);
  }

  private closurize(
      sourceFile: ts.SourceFile, program: ts.Program, fileName: string,
      languageVersion: ts.ScriptTarget): ts.SourceFile {
    let isDefinitions = /\.d\.ts$/.test(fileName);
    // Don't tsickle-process any d.ts that isn't a compilation target;
    // this means we don't process e.g. lib.d.ts.
    if (isDefinitions && this.environment.shouldSkipTsickleProcessing(fileName)) return sourceFile;

    let {output, externs, diagnostics, sourceMap} =
        annotate(program, sourceFile, this.options, this.delegate, this.tscOptions);
    if (externs) {
      this.externs[fileName] = externs;
    }
    if (this.environment.shouldIgnoreWarningsForPath(sourceFile.path)) {
      // All diagnostics (including warnings) are treated as errors.
      // If we've decided to ignore them, just discard them.
      // Warnings include stuff like "don't use @type in your jsdoc"; tsickle
      // warns and then fixes up the code to be Closure-compatible anyway.
      diagnostics = diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error);
    }
    this.diagnostics = diagnostics;
    this.tsickleSourceMaps.set(path.parse(fileName).base, sourceMap);
    return ts.createSourceFile(fileName, output, languageVersion, true);
  }

  /** Concatenate all generated externs definitions together into a string. */
  getGeneratedExterns(): string {
    let allExterns = '';
    for (let fileName of Object.keys(this.externs)) {
      allExterns += `// externs from ${fileName}:\n`;
      allExterns += this.externs[fileName];
    }
    return allExterns;
  }

  // Delegate everything else to the original compiler host.

  fileExists(fileName: string): boolean {
    return this.delegate.fileExists(fileName);
  }

  getCurrentDirectory(): string {
    return this.delegate.getCurrentDirectory();
  };

  useCaseSensitiveFileNames(): boolean {
    return this.delegate.useCaseSensitiveFileNames();
  }

  getNewLine(): string {
    return this.delegate.getNewLine();
  }

  getDirectories(path: string) {
    return this.delegate.getDirectories(path);
  }

  readFile(fileName: string): string {
    return this.delegate.readFile(fileName);
  }

  getDefaultLibFileName(options: ts.CompilerOptions): string {
    return this.delegate.getDefaultLibFileName(options);
  }

  getCanonicalFileName(fileName: string): string {
    return this.delegate.getCanonicalFileName(fileName);
  }
}
