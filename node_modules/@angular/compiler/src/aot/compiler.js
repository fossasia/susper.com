/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationCompiler } from '../animation/animation_compiler';
import { createHostComponentMeta, identifierModuleUrl, identifierName } from '../compile_metadata';
import { ListWrapper } from '../facade/collection';
import { Identifiers, createIdentifier, createIdentifierToken } from '../identifiers';
import * as o from '../output/output_ast';
import { ComponentFactoryDependency, DirectiveWrapperDependency, ViewClassDependency } from '../view_compiler/view_compiler';
import { GeneratedFile } from './generated_file';
import { serializeSummaries, summaryFileName } from './summary_serializer';
export var AotCompiler = (function () {
    /**
     * @param {?} _host
     * @param {?} _metadataResolver
     * @param {?} _templateParser
     * @param {?} _styleCompiler
     * @param {?} _viewCompiler
     * @param {?} _dirWrapperCompiler
     * @param {?} _ngModuleCompiler
     * @param {?} _outputEmitter
     * @param {?} _summaryResolver
     * @param {?} _localeId
     * @param {?} _translationFormat
     * @param {?} _animationParser
     * @param {?} _symbolResolver
     */
    function AotCompiler(_host, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _dirWrapperCompiler, _ngModuleCompiler, _outputEmitter, _summaryResolver, _localeId, _translationFormat, _animationParser, _symbolResolver) {
        this._host = _host;
        this._metadataResolver = _metadataResolver;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._dirWrapperCompiler = _dirWrapperCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._outputEmitter = _outputEmitter;
        this._summaryResolver = _summaryResolver;
        this._localeId = _localeId;
        this._translationFormat = _translationFormat;
        this._animationParser = _animationParser;
        this._symbolResolver = _symbolResolver;
        this._animationCompiler = new AnimationCompiler();
    }
    /**
     * @return {?}
     */
    AotCompiler.prototype.clearCache = function () { this._metadataResolver.clearCache(); };
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    AotCompiler.prototype.compileAll = function (rootFiles) {
        var _this = this;
        var /** @type {?} */ programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
        var _a = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver), ngModuleByPipeOrDirective = _a.ngModuleByPipeOrDirective, files = _a.files, ngModules = _a.ngModules;
        return Promise
            .all(ngModules.map(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () {
            var /** @type {?} */ sourceModules = files.map(function (file) { return _this._compileSrcFile(file.srcUrl, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables); });
            return ListWrapper.flatten(sourceModules);
        });
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @return {?}
     */
    AotCompiler.prototype._compileSrcFile = function (srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
        var _this = this;
        var /** @type {?} */ fileSuffix = _splitTypescriptSuffix(srcFileUrl)[1];
        var /** @type {?} */ statements = [];
        var /** @type {?} */ exportedVars = [];
        var /** @type {?} */ generatedFiles = [];
        generatedFiles.push(this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables));
        // compile all ng modules
        exportedVars.push.apply(exportedVars, ngModules.map(function (ngModuleType) { return _this._compileModule(ngModuleType, statements); }));
        // compile directive wrappers
        exportedVars.push.apply(exportedVars, directives.map(function (directiveType) { return _this._compileDirectiveWrapper(directiveType, statements); }));
        // compile components
        directives.forEach(function (dirType) {
            var /** @type {?} */ compMeta = _this._metadataResolver.getDirectiveMetadata(/** @type {?} */ (dirType));
            if (!compMeta.isComponent) {
                return Promise.resolve(null);
            }
            var /** @type {?} */ ngModule = ngModuleByPipeOrDirective.get(dirType);
            if (!ngModule) {
                throw new Error("Internal Error: cannot determine the module for component " + identifierName(compMeta.type) + "!");
            }
            _assertComponent(compMeta);
            // compile styles
            var /** @type {?} */ stylesCompileResults = _this._styleCompiler.compileComponent(compMeta);
            stylesCompileResults.externalStylesheets.forEach(function (compiledStyleSheet) {
                generatedFiles.push(_this._codgenStyles(srcFileUrl, compiledStyleSheet, fileSuffix));
            });
            // compile components
            exportedVars.push(_this._compileComponentFactory(compMeta, ngModule, fileSuffix, statements), _this._compileComponent(compMeta, ngModule, ngModule.transitiveModule.directives, stylesCompileResults.componentStylesheet, fileSuffix, statements));
        });
        if (statements.length > 0) {
            var /** @type {?} */ srcModule = this._codegenSourceModule(srcFileUrl, _ngfactoryModuleUrl(srcFileUrl), statements, exportedVars);
            generatedFiles.unshift(srcModule);
        }
        return generatedFiles;
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @return {?}
     */
    AotCompiler.prototype._createSummary = function (srcFileUrl, directives, pipes, ngModules, injectables) {
        var _this = this;
        var /** @type {?} */ symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileUrl)
            .map(function (symbol) { return _this._symbolResolver.resolveSymbol(symbol); });
        var /** @type {?} */ typeSummaries = ngModules.map(function (ref) { return _this._metadataResolver.getNgModuleSummary(ref); }).concat(directives.map(function (ref) { return _this._metadataResolver.getDirectiveSummary(ref); }), pipes.map(function (ref) { return _this._metadataResolver.getPipeSummary(ref); }), injectables.map(function (ref) { return _this._metadataResolver.getInjectableSummary(ref); }));
        var /** @type {?} */ json = serializeSummaries(this._host, this._summaryResolver, this._symbolResolver, symbolSummaries, typeSummaries);
        return new GeneratedFile(srcFileUrl, summaryFileName(srcFileUrl), json);
    };
    /**
     * @param {?} ngModuleType
     * @param {?} targetStatements
     * @return {?}
     */
    AotCompiler.prototype._compileModule = function (ngModuleType, targetStatements) {
        var _this = this;
        var /** @type {?} */ ngModule = this._metadataResolver.getNgModuleMetadata(ngModuleType);
        var /** @type {?} */ providers = [];
        if (this._localeId) {
            providers.push({
                token: createIdentifierToken(Identifiers.LOCALE_ID),
                useValue: this._localeId,
            });
        }
        if (this._translationFormat) {
            providers.push({
                token: createIdentifierToken(Identifiers.TRANSLATIONS_FORMAT),
                useValue: this._translationFormat
            });
        }
        var /** @type {?} */ appCompileResult = this._ngModuleCompiler.compile(ngModule, providers);
        appCompileResult.dependencies.forEach(function (dep) {
            dep.placeholder.reference = _this._symbolResolver.getStaticSymbol(_ngfactoryModuleUrl(identifierModuleUrl(dep.comp)), _componentFactoryName(dep.comp));
        });
        targetStatements.push.apply(targetStatements, appCompileResult.statements);
        return appCompileResult.ngModuleFactoryVar;
    };
    /**
     * @param {?} directiveType
     * @param {?} targetStatements
     * @return {?}
     */
    AotCompiler.prototype._compileDirectiveWrapper = function (directiveType, targetStatements) {
        var /** @type {?} */ dirMeta = this._metadataResolver.getDirectiveMetadata(directiveType);
        var /** @type {?} */ dirCompileResult = this._dirWrapperCompiler.compile(dirMeta);
        targetStatements.push.apply(targetStatements, dirCompileResult.statements);
        return dirCompileResult.dirWrapperClassVar;
    };
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} fileSuffix
     * @param {?} targetStatements
     * @return {?}
     */
    AotCompiler.prototype._compileComponentFactory = function (compMeta, ngModule, fileSuffix, targetStatements) {
        var /** @type {?} */ hostMeta = createHostComponentMeta(this._symbolResolver.getStaticSymbol(identifierModuleUrl(compMeta.type), identifierName(compMeta.type) + "_Host"), compMeta);
        var /** @type {?} */ hostViewFactoryVar = this._compileComponent(hostMeta, ngModule, [compMeta.type], null, fileSuffix, targetStatements);
        var /** @type {?} */ compFactoryVar = _componentFactoryName(compMeta.type);
        targetStatements.push(o.variable(compFactoryVar)
            .set(o.importExpr(createIdentifier(Identifiers.ComponentFactory), [o.importType(compMeta.type)])
            .instantiate([
            o.literal(compMeta.selector),
            o.variable(hostViewFactoryVar),
            o.importExpr(compMeta.type),
        ], o.importType(createIdentifier(Identifiers.ComponentFactory), [o.importType(compMeta.type)], [o.TypeModifier.Const])))
            .toDeclStmt(null, [o.StmtModifier.Final]));
        return compFactoryVar;
    };
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @param {?} componentStyles
     * @param {?} fileSuffix
     * @param {?} targetStatements
     * @return {?}
     */
    AotCompiler.prototype._compileComponent = function (compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix, targetStatements) {
        var _this = this;
        var /** @type {?} */ parsedAnimations = this._animationParser.parseComponent(compMeta);
        var /** @type {?} */ directives = directiveIdentifiers.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
        var /** @type {?} */ pipes = ngModule.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
        var /** @type {?} */ parsedTemplate = this._templateParser.parse(compMeta, compMeta.template.template, directives, pipes, ngModule.schemas, identifierName(compMeta.type));
        var /** @type {?} */ stylesExpr = componentStyles ? o.variable(componentStyles.stylesVar) : o.literalArr([]);
        var /** @type {?} */ compiledAnimations = this._animationCompiler.compile(identifierName(compMeta.type), parsedAnimations);
        var /** @type {?} */ viewResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, stylesExpr, pipes, compiledAnimations);
        if (componentStyles) {
            targetStatements.push.apply(targetStatements, _resolveStyleStatements(this._symbolResolver, componentStyles, fileSuffix));
        }
        compiledAnimations.forEach(function (entry) { return targetStatements.push.apply(targetStatements, entry.statements); });
        targetStatements.push.apply(targetStatements, _resolveViewStatements(this._symbolResolver, viewResult));
        return viewResult.viewClassVar;
    };
    /**
     * @param {?} fileUrl
     * @param {?} stylesCompileResult
     * @param {?} fileSuffix
     * @return {?}
     */
    AotCompiler.prototype._codgenStyles = function (fileUrl, stylesCompileResult, fileSuffix) {
        _resolveStyleStatements(this._symbolResolver, stylesCompileResult, fileSuffix);
        return this._codegenSourceModule(fileUrl, _stylesModuleUrl(stylesCompileResult.meta.moduleUrl, stylesCompileResult.isShimmed, fileSuffix), stylesCompileResult.statements, [stylesCompileResult.stylesVar]);
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} genFileUrl
     * @param {?} statements
     * @param {?} exportedVars
     * @return {?}
     */
    AotCompiler.prototype._codegenSourceModule = function (srcFileUrl, genFileUrl, statements, exportedVars) {
        return new GeneratedFile(srcFileUrl, genFileUrl, this._outputEmitter.emitStatements(genFileUrl, statements, exportedVars));
    };
    return AotCompiler;
}());
function AotCompiler_tsickle_Closure_declarations() {
    /** @type {?} */
    AotCompiler.prototype._animationCompiler;
    /** @type {?} */
    AotCompiler.prototype._host;
    /** @type {?} */
    AotCompiler.prototype._metadataResolver;
    /** @type {?} */
    AotCompiler.prototype._templateParser;
    /** @type {?} */
    AotCompiler.prototype._styleCompiler;
    /** @type {?} */
    AotCompiler.prototype._viewCompiler;
    /** @type {?} */
    AotCompiler.prototype._dirWrapperCompiler;
    /** @type {?} */
    AotCompiler.prototype._ngModuleCompiler;
    /** @type {?} */
    AotCompiler.prototype._outputEmitter;
    /** @type {?} */
    AotCompiler.prototype._summaryResolver;
    /** @type {?} */
    AotCompiler.prototype._localeId;
    /** @type {?} */
    AotCompiler.prototype._translationFormat;
    /** @type {?} */
    AotCompiler.prototype._animationParser;
    /** @type {?} */
    AotCompiler.prototype._symbolResolver;
}
/**
 * @param {?} reflector
 * @param {?} compileResult
 * @return {?}
 */
function _resolveViewStatements(reflector, compileResult) {
    compileResult.dependencies.forEach(function (dep) {
        if (dep instanceof ViewClassDependency) {
            var /** @type {?} */ vfd = (dep);
            vfd.placeholder.reference =
                reflector.getStaticSymbol(_ngfactoryModuleUrl(identifierModuleUrl(vfd.comp)), dep.name);
        }
        else if (dep instanceof ComponentFactoryDependency) {
            var /** @type {?} */ cfd = (dep);
            cfd.placeholder.reference = reflector.getStaticSymbol(_ngfactoryModuleUrl(identifierModuleUrl(cfd.comp)), _componentFactoryName(cfd.comp));
        }
        else if (dep instanceof DirectiveWrapperDependency) {
            var /** @type {?} */ dwd = (dep);
            dwd.placeholder.reference =
                reflector.getStaticSymbol(_ngfactoryModuleUrl(identifierModuleUrl(dwd.dir)), dwd.name);
        }
    });
    return compileResult.statements;
}
/**
 * @param {?} reflector
 * @param {?} compileResult
 * @param {?} fileSuffix
 * @return {?}
 */
function _resolveStyleStatements(reflector, compileResult, fileSuffix) {
    compileResult.dependencies.forEach(function (dep) {
        dep.valuePlaceholder.reference = reflector.getStaticSymbol(_stylesModuleUrl(dep.moduleUrl, dep.isShimmed, fileSuffix), dep.name);
    });
    return compileResult.statements;
}
/**
 * @param {?} dirUrl
 * @return {?}
 */
function _ngfactoryModuleUrl(dirUrl) {
    var /** @type {?} */ urlWithSuffix = _splitTypescriptSuffix(dirUrl);
    return urlWithSuffix[0] + ".ngfactory" + urlWithSuffix[1];
}
/**
 * @param {?} comp
 * @return {?}
 */
function _componentFactoryName(comp) {
    return identifierName(comp) + "NgFactory";
}
/**
 * @param {?} stylesheetUrl
 * @param {?} shim
 * @param {?} suffix
 * @return {?}
 */
function _stylesModuleUrl(stylesheetUrl, shim, suffix) {
    return "" + stylesheetUrl + (shim ? '.shim' : '') + ".ngstyle" + suffix;
}
/**
 * @param {?} meta
 * @return {?}
 */
function _assertComponent(meta) {
    if (!meta.isComponent) {
        throw new Error("Could not compile '" + identifierName(meta.type) + "' because it is not a component.");
    }
}
/**
 * @param {?} path
 * @return {?}
 */
function _splitTypescriptSuffix(path) {
    if (path.endsWith('.d.ts')) {
        return [path.slice(0, -5), '.ts'];
    }
    var /** @type {?} */ lastDot = path.lastIndexOf('.');
    if (lastDot !== -1) {
        return [path.substring(0, lastDot), path.substring(lastDot)];
    }
    return [path, ''];
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
export function analyzeNgModules(programStaticSymbols, host, metadataResolver) {
    var _a = _createNgModules(programStaticSymbols, host, metadataResolver), ngModules = _a.ngModules, symbolsMissingModule = _a.symbolsMissingModule;
    return _analyzeNgModules(programStaticSymbols, ngModules, symbolsMissingModule, metadataResolver);
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
export function analyzeAndValidateNgModules(programStaticSymbols, host, metadataResolver) {
    var /** @type {?} */ result = analyzeNgModules(programStaticSymbols, host, metadataResolver);
    if (result.symbolsMissingModule && result.symbolsMissingModule.length) {
        var /** @type {?} */ messages = result.symbolsMissingModule.map(function (s) { return ("Cannot determine the module for class " + s.name + " in " + s.filePath + "!"); });
        throw new Error(messages.join('\n'));
    }
    return result;
}
/**
 * @param {?} programSymbols
 * @param {?} ngModuleMetas
 * @param {?} symbolsMissingModule
 * @param {?} metadataResolver
 * @return {?}
 */
function _analyzeNgModules(programSymbols, ngModuleMetas, symbolsMissingModule, metadataResolver) {
    var /** @type {?} */ moduleMetasByRef = new Map();
    ngModuleMetas.forEach(function (ngModule) { return moduleMetasByRef.set(ngModule.type.reference, ngModule); });
    var /** @type {?} */ ngModuleByPipeOrDirective = new Map();
    var /** @type {?} */ ngModulesByFile = new Map();
    var /** @type {?} */ ngDirectivesByFile = new Map();
    var /** @type {?} */ ngPipesByFile = new Map();
    var /** @type {?} */ ngInjectablesByFile = new Map();
    var /** @type {?} */ filePaths = new Set();
    // Make sure we produce an analyzed file for each input file
    programSymbols.forEach(function (symbol) {
        var /** @type {?} */ filePath = symbol.filePath;
        filePaths.add(filePath);
        if (metadataResolver.isInjectable(symbol)) {
            ngInjectablesByFile.set(filePath, (ngInjectablesByFile.get(filePath) || []).concat(symbol));
        }
    });
    // Looping over all modules to construct:
    // - a map from file to modules `ngModulesByFile`,
    // - a map from file to directives `ngDirectivesByFile`,
    // - a map from file to pipes `ngPipesByFile`,
    // - a map from directive/pipe to module `ngModuleByPipeOrDirective`.
    ngModuleMetas.forEach(function (ngModuleMeta) {
        var /** @type {?} */ srcFileUrl = ngModuleMeta.type.reference.filePath;
        filePaths.add(srcFileUrl);
        ngModulesByFile.set(srcFileUrl, (ngModulesByFile.get(srcFileUrl) || []).concat(ngModuleMeta.type.reference));
        ngModuleMeta.declaredDirectives.forEach(function (dirIdentifier) {
            var /** @type {?} */ fileUrl = dirIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngDirectivesByFile.set(fileUrl, (ngDirectivesByFile.get(fileUrl) || []).concat(dirIdentifier.reference));
            ngModuleByPipeOrDirective.set(dirIdentifier.reference, ngModuleMeta);
        });
        ngModuleMeta.declaredPipes.forEach(function (pipeIdentifier) {
            var /** @type {?} */ fileUrl = pipeIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngPipesByFile.set(fileUrl, (ngPipesByFile.get(fileUrl) || []).concat(pipeIdentifier.reference));
            ngModuleByPipeOrDirective.set(pipeIdentifier.reference, ngModuleMeta);
        });
    });
    var /** @type {?} */ files = [];
    filePaths.forEach(function (srcUrl) {
        var /** @type {?} */ directives = ngDirectivesByFile.get(srcUrl) || [];
        var /** @type {?} */ pipes = ngPipesByFile.get(srcUrl) || [];
        var /** @type {?} */ ngModules = ngModulesByFile.get(srcUrl) || [];
        var /** @type {?} */ injectables = ngInjectablesByFile.get(srcUrl) || [];
        files.push({ srcUrl: srcUrl, directives: directives, pipes: pipes, ngModules: ngModules, injectables: injectables });
    });
    return {
        // map directive/pipe to module
        ngModuleByPipeOrDirective: ngModuleByPipeOrDirective,
        // list modules and directives for every source file
        files: files,
        ngModules: ngModuleMetas, symbolsMissingModule: symbolsMissingModule
    };
}
/**
 * @param {?} staticSymbolResolver
 * @param {?} files
 * @param {?} host
 * @return {?}
 */
export function extractProgramSymbols(staticSymbolResolver, files, host) {
    var /** @type {?} */ staticSymbols = [];
    files.filter(function (fileName) { return host.isSourceFile(fileName); }).forEach(function (sourceFile) {
        staticSymbolResolver.getSymbolsOf(sourceFile).forEach(function (symbol) {
            var /** @type {?} */ resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            var /** @type {?} */ symbolMeta = resolvedSymbol.metadata;
            if (symbolMeta) {
                if (symbolMeta.__symbolic != 'error') {
                    // Ignore symbols that are only included to record error information.
                    staticSymbols.push(resolvedSymbol.symbol);
                }
            }
        });
    });
    return staticSymbols;
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
function _createNgModules(programStaticSymbols, host, metadataResolver) {
    var /** @type {?} */ ngModules = new Map();
    var /** @type {?} */ programPipesAndDirectives = [];
    var /** @type {?} */ ngModulePipesAndDirective = new Set();
    var /** @type {?} */ addNgModule = function (staticSymbol) {
        if (ngModules.has(staticSymbol) || !host.isSourceFile(staticSymbol.filePath)) {
            return false;
        }
        var /** @type {?} */ ngModule = metadataResolver.getNgModuleMetadata(staticSymbol, false);
        if (ngModule) {
            ngModules.set(ngModule.type.reference, ngModule);
            ngModule.declaredDirectives.forEach(function (dir) { return ngModulePipesAndDirective.add(dir.reference); });
            ngModule.declaredPipes.forEach(function (pipe) { return ngModulePipesAndDirective.add(pipe.reference); });
            // For every input module add the list of transitively included modules
            ngModule.transitiveModule.modules.forEach(function (modMeta) { return addNgModule(modMeta.reference); });
        }
        return !!ngModule;
    };
    programStaticSymbols.forEach(function (staticSymbol) {
        if (!addNgModule(staticSymbol) &&
            (metadataResolver.isDirective(staticSymbol) || metadataResolver.isPipe(staticSymbol))) {
            programPipesAndDirectives.push(staticSymbol);
        }
    });
    // Throw an error if any of the program pipe or directives is not declared by a module
    var /** @type {?} */ symbolsMissingModule = programPipesAndDirectives.filter(function (s) { return !ngModulePipesAndDirective.has(s); });
    return { ngModules: Array.from(ngModules.values()), symbolsMissingModule: symbolsMissingModule };
}
//# sourceMappingURL=compiler.js.map