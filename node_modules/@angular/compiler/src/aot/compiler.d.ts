import { AnimationParser } from '../animation/animation_parser';
import { CompileNgModuleMetadata } from '../compile_metadata';
import { DirectiveWrapperCompiler } from '../directive_wrapper_compiler';
import { CompileMetadataResolver } from '../metadata_resolver';
import { NgModuleCompiler } from '../ng_module_compiler';
import { OutputEmitter } from '../output/abstract_emitter';
import { StyleCompiler } from '../style_compiler';
import { SummaryResolver } from '../summary_resolver';
import { TemplateParser } from '../template_parser/template_parser';
import { ViewCompiler } from '../view_compiler/view_compiler';
import { AotCompilerHost } from './compiler_host';
import { GeneratedFile } from './generated_file';
import { StaticSymbol } from './static_symbol';
import { StaticSymbolResolver } from './static_symbol_resolver';
export declare class AotCompiler {
    private _host;
    private _metadataResolver;
    private _templateParser;
    private _styleCompiler;
    private _viewCompiler;
    private _dirWrapperCompiler;
    private _ngModuleCompiler;
    private _outputEmitter;
    private _summaryResolver;
    private _localeId;
    private _translationFormat;
    private _animationParser;
    private _symbolResolver;
    private _animationCompiler;
    constructor(_host: AotCompilerHost, _metadataResolver: CompileMetadataResolver, _templateParser: TemplateParser, _styleCompiler: StyleCompiler, _viewCompiler: ViewCompiler, _dirWrapperCompiler: DirectiveWrapperCompiler, _ngModuleCompiler: NgModuleCompiler, _outputEmitter: OutputEmitter, _summaryResolver: SummaryResolver<StaticSymbol>, _localeId: string, _translationFormat: string, _animationParser: AnimationParser, _symbolResolver: StaticSymbolResolver);
    clearCache(): void;
    compileAll(rootFiles: string[]): Promise<GeneratedFile[]>;
    private _compileSrcFile(srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables);
    private _createSummary(srcFileUrl, directives, pipes, ngModules, injectables);
    private _compileModule(ngModuleType, targetStatements);
    private _compileDirectiveWrapper(directiveType, targetStatements);
    private _compileComponentFactory(compMeta, ngModule, fileSuffix, targetStatements);
    private _compileComponent(compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix, targetStatements);
    private _codgenStyles(fileUrl, stylesCompileResult, fileSuffix);
    private _codegenSourceModule(srcFileUrl, genFileUrl, statements, exportedVars);
}
export interface NgAnalyzedModules {
    ngModules: CompileNgModuleMetadata[];
    ngModuleByPipeOrDirective: Map<StaticSymbol, CompileNgModuleMetadata>;
    files: Array<{
        srcUrl: string;
        directives: StaticSymbol[];
        pipes: StaticSymbol[];
        ngModules: StaticSymbol[];
        injectables: StaticSymbol[];
    }>;
    symbolsMissingModule?: StaticSymbol[];
}
export interface NgAnalyzeModulesHost {
    isSourceFile(filePath: string): boolean;
}
export declare function analyzeNgModules(programStaticSymbols: StaticSymbol[], host: NgAnalyzeModulesHost, metadataResolver: CompileMetadataResolver): NgAnalyzedModules;
export declare function analyzeAndValidateNgModules(programStaticSymbols: StaticSymbol[], host: NgAnalyzeModulesHost, metadataResolver: CompileMetadataResolver): NgAnalyzedModules;
export declare function extractProgramSymbols(staticSymbolResolver: StaticSymbolResolver, files: string[], host: NgAnalyzeModulesHost): StaticSymbol[];
