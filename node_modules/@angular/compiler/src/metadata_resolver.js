/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AnimationAnimateMetadata, AnimationGroupMetadata, AnimationKeyframesSequenceMetadata, AnimationStateDeclarationMetadata, AnimationStateTransitionMetadata, AnimationStyleMetadata, AnimationWithStepsMetadata, Attribute, Component, Host, Inject, Injectable, OpaqueToken, Optional, Self, SkipSelf, Type, resolveForwardRef } from '@angular/core';
import { StaticSymbol } from './aot/static_symbol';
import { assertArrayOfStrings, assertInterpolationSymbols } from './assertions';
import * as cpl from './compile_metadata';
import { DirectiveNormalizer } from './directive_normalizer';
import { DirectiveResolver } from './directive_resolver';
import { isBlank, isPresent, stringify } from './facade/lang';
import { Identifiers, resolveIdentifier } from './identifiers';
import { CompilerInjectable } from './injectable';
import { hasLifecycleHook } from './lifecycle_reflector';
import { NgModuleResolver } from './ng_module_resolver';
import { PipeResolver } from './pipe_resolver';
import { ComponentStillLoadingError, LIFECYCLE_HOOKS_VALUES, ReflectorReader, reflector } from './private_import_core';
import { ElementSchemaRegistry } from './schema/element_schema_registry';
import { SummaryResolver } from './summary_resolver';
import { getUrlScheme } from './url_resolver';
import { MODULE_SUFFIX, SyntaxError, ValueTransformer, visitValue } from './util';
export var /** @type {?} */ ERROR_COLLECTOR_TOKEN = new OpaqueToken('ErrorCollector');
// Design notes:
// - don't lazily create metadata:
//   For some metadata, we need to do async work sometimes,
//   so the user has to kick off this loading.
//   But we want to report errors even when the async work is
//   not required to check that the user would have been able
//   to wait correctly.
export var CompileMetadataResolver = (function () {
    /**
     * @param {?} _ngModuleResolver
     * @param {?} _directiveResolver
     * @param {?} _pipeResolver
     * @param {?} _summaryResolver
     * @param {?} _schemaRegistry
     * @param {?} _directiveNormalizer
     * @param {?=} _reflector
     * @param {?=} _errorCollector
     */
    function CompileMetadataResolver(_ngModuleResolver, _directiveResolver, _pipeResolver, _summaryResolver, _schemaRegistry, _directiveNormalizer, _reflector, _errorCollector) {
        if (_reflector === void 0) { _reflector = reflector; }
        this._ngModuleResolver = _ngModuleResolver;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._summaryResolver = _summaryResolver;
        this._schemaRegistry = _schemaRegistry;
        this._directiveNormalizer = _directiveNormalizer;
        this._reflector = _reflector;
        this._errorCollector = _errorCollector;
        this._directiveCache = new Map();
        this._summaryCache = new Map();
        this._pipeCache = new Map();
        this._ngModuleCache = new Map();
        this._ngModuleOfTypes = new Map();
    }
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.clearCacheFor = function (type) {
        var /** @type {?} */ dirMeta = this._directiveCache.get(type);
        this._directiveCache.delete(type);
        this._summaryCache.delete(type);
        this._pipeCache.delete(type);
        this._ngModuleOfTypes.delete(type);
        // Clear all of the NgModule as they contain transitive information!
        this._ngModuleCache.clear();
        if (dirMeta) {
            this._directiveNormalizer.clearCacheFor(dirMeta);
        }
    };
    /**
     * @return {?}
     */
    CompileMetadataResolver.prototype.clearCache = function () {
        this._directiveCache.clear();
        this._summaryCache.clear();
        this._pipeCache.clear();
        this._ngModuleCache.clear();
        this._ngModuleOfTypes.clear();
        this._directiveNormalizer.clearCache();
    };
    /**
     * @param {?} entry
     * @return {?}
     */
    CompileMetadataResolver.prototype.getAnimationEntryMetadata = function (entry) {
        var _this = this;
        var /** @type {?} */ defs = entry.definitions.map(function (def) { return _this._getAnimationStateMetadata(def); });
        return new cpl.CompileAnimationEntryMetadata(entry.name, defs);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    CompileMetadataResolver.prototype._getAnimationStateMetadata = function (value) {
        if (value instanceof AnimationStateDeclarationMetadata) {
            var /** @type {?} */ styles = this._getAnimationStyleMetadata(value.styles);
            return new cpl.CompileAnimationStateDeclarationMetadata(value.stateNameExpr, styles);
        }
        if (value instanceof AnimationStateTransitionMetadata) {
            return new cpl.CompileAnimationStateTransitionMetadata(value.stateChangeExpr, this._getAnimationMetadata(value.steps));
        }
        return null;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    CompileMetadataResolver.prototype._getAnimationStyleMetadata = function (value) {
        return new cpl.CompileAnimationStyleMetadata(value.offset, value.styles);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    CompileMetadataResolver.prototype._getAnimationMetadata = function (value) {
        var _this = this;
        if (value instanceof AnimationStyleMetadata) {
            return this._getAnimationStyleMetadata(value);
        }
        if (value instanceof AnimationKeyframesSequenceMetadata) {
            return new cpl.CompileAnimationKeyframesSequenceMetadata(value.steps.map(function (entry) { return _this._getAnimationStyleMetadata(entry); }));
        }
        if (value instanceof AnimationAnimateMetadata) {
            var /** @type {?} */ animateData = (this
                ._getAnimationMetadata(value.styles));
            return new cpl.CompileAnimationAnimateMetadata(value.timings, animateData);
        }
        if (value instanceof AnimationWithStepsMetadata) {
            var /** @type {?} */ steps = value.steps.map(function (step) { return _this._getAnimationMetadata(step); });
            if (value instanceof AnimationGroupMetadata) {
                return new cpl.CompileAnimationGroupMetadata(steps);
            }
            return new cpl.CompileAnimationSequenceMetadata(steps);
        }
        return null;
    };
    /**
     * @param {?} type
     * @param {?} kind
     * @return {?}
     */
    CompileMetadataResolver.prototype._loadSummary = function (type, kind) {
        var /** @type {?} */ typeSummary = this._summaryCache.get(type);
        if (!typeSummary) {
            var /** @type {?} */ summary = this._summaryResolver.resolveSummary(type);
            typeSummary = summary ? summary.type : null;
            this._summaryCache.set(type, typeSummary);
        }
        return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
    };
    /**
     * @param {?} directiveType
     * @param {?} isSync
     * @return {?}
     */
    CompileMetadataResolver.prototype._loadDirectiveMetadata = function (directiveType, isSync) {
        var _this = this;
        if (this._directiveCache.has(directiveType)) {
            return;
        }
        directiveType = resolveForwardRef(directiveType);
        var _a = this.getNonNormalizedDirectiveMetadata(directiveType), annotation = _a.annotation, metadata = _a.metadata;
        var /** @type {?} */ createDirectiveMetadata = function (templateMetadata) {
            var /** @type {?} */ normalizedDirMeta = new cpl.CompileDirectiveMetadata({
                type: metadata.type,
                isComponent: metadata.isComponent,
                selector: metadata.selector,
                exportAs: metadata.exportAs,
                changeDetection: metadata.changeDetection,
                inputs: metadata.inputs,
                outputs: metadata.outputs,
                hostListeners: metadata.hostListeners,
                hostProperties: metadata.hostProperties,
                hostAttributes: metadata.hostAttributes,
                providers: metadata.providers,
                viewProviders: metadata.viewProviders,
                queries: metadata.queries,
                viewQueries: metadata.viewQueries,
                entryComponents: metadata.entryComponents,
                template: templateMetadata
            });
            _this._directiveCache.set(directiveType, normalizedDirMeta);
            _this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
            return normalizedDirMeta;
        };
        if (metadata.isComponent) {
            var /** @type {?} */ templateMeta = this._directiveNormalizer.normalizeTemplate({
                componentType: directiveType,
                moduleUrl: componentModuleUrl(this._reflector, directiveType, annotation),
                encapsulation: metadata.template.encapsulation,
                template: metadata.template.template,
                templateUrl: metadata.template.templateUrl,
                styles: metadata.template.styles,
                styleUrls: metadata.template.styleUrls,
                animations: metadata.template.animations,
                interpolation: metadata.template.interpolation
            });
            if (templateMeta.syncResult) {
                createDirectiveMetadata(templateMeta.syncResult);
                return null;
            }
            else {
                if (isSync) {
                    this._reportError(new ComponentStillLoadingError(directiveType), directiveType);
                    return null;
                }
                return templateMeta.asyncResult.then(createDirectiveMetadata);
            }
        }
        else {
            // directive
            createDirectiveMetadata(null);
            return null;
        }
    };
    /**
     * @param {?} directiveType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getNonNormalizedDirectiveMetadata = function (directiveType) {
        var _this = this;
        directiveType = resolveForwardRef(directiveType);
        var /** @type {?} */ dirMeta = this._directiveResolver.resolve(directiveType);
        if (!dirMeta) {
            return null;
        }
        var /** @type {?} */ nonNormalizedTemplateMetadata;
        if (dirMeta instanceof Component) {
            // component
            assertArrayOfStrings('styles', dirMeta.styles);
            assertArrayOfStrings('styleUrls', dirMeta.styleUrls);
            assertInterpolationSymbols('interpolation', dirMeta.interpolation);
            var /** @type {?} */ animations = dirMeta.animations ?
                dirMeta.animations.map(function (e) { return _this.getAnimationEntryMetadata(e); }) :
                null;
            nonNormalizedTemplateMetadata = new cpl.CompileTemplateMetadata({
                encapsulation: dirMeta.encapsulation,
                template: dirMeta.template,
                templateUrl: dirMeta.templateUrl,
                styles: dirMeta.styles,
                styleUrls: dirMeta.styleUrls,
                animations: animations,
                interpolation: dirMeta.interpolation
            });
        }
        var /** @type {?} */ changeDetectionStrategy = null;
        var /** @type {?} */ viewProviders = [];
        var /** @type {?} */ entryComponentMetadata = [];
        var /** @type {?} */ selector = dirMeta.selector;
        if (dirMeta instanceof Component) {
            // Component
            changeDetectionStrategy = dirMeta.changeDetection;
            if (dirMeta.viewProviders) {
                viewProviders = this._getProvidersMetadata(dirMeta.viewProviders, entryComponentMetadata, "viewProviders for \"" + stringifyType(directiveType) + "\"", [], directiveType);
            }
            if (dirMeta.entryComponents) {
                entryComponentMetadata = flattenAndDedupeArray(dirMeta.entryComponents)
                    .map(function (type) { return _this._getIdentifierMetadata(type); })
                    .concat(entryComponentMetadata);
            }
            if (!selector) {
                selector = this._schemaRegistry.getDefaultComponentElementName();
            }
        }
        else {
            // Directive
            if (!selector) {
                this._reportError(new SyntaxError("Directive " + stringifyType(directiveType) + " has no selector, please add it!"), directiveType);
                selector = 'error';
            }
        }
        var /** @type {?} */ providers = [];
        if (isPresent(dirMeta.providers)) {
            providers = this._getProvidersMetadata(dirMeta.providers, entryComponentMetadata, "providers for \"" + stringifyType(directiveType) + "\"", [], directiveType);
        }
        var /** @type {?} */ queries = [];
        var /** @type {?} */ viewQueries = [];
        if (isPresent(dirMeta.queries)) {
            queries = this._getQueriesMetadata(dirMeta.queries, false, directiveType);
            viewQueries = this._getQueriesMetadata(dirMeta.queries, true, directiveType);
        }
        var /** @type {?} */ metadata = cpl.CompileDirectiveMetadata.create({
            selector: selector,
            exportAs: dirMeta.exportAs,
            isComponent: !!nonNormalizedTemplateMetadata,
            type: this._getTypeMetadata(directiveType),
            template: nonNormalizedTemplateMetadata,
            changeDetection: changeDetectionStrategy,
            inputs: dirMeta.inputs,
            outputs: dirMeta.outputs,
            host: dirMeta.host,
            providers: providers,
            viewProviders: viewProviders,
            queries: queries,
            viewQueries: viewQueries,
            entryComponents: entryComponentMetadata
        });
        return { metadata: metadata, annotation: dirMeta };
    };
    /**
     *  Gets the metadata for the given directive.
      * This assumes `loadNgModuleMetadata` has been called first.
     * @param {?} directiveType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getDirectiveMetadata = function (directiveType) {
        var /** @type {?} */ dirMeta = this._directiveCache.get(directiveType);
        if (!dirMeta) {
            this._reportError(new SyntaxError("Illegal state: getDirectiveMetadata can only be called after loadNgModuleMetadata for a module that declares it. Directive " + stringifyType(directiveType) + "."), directiveType);
        }
        return dirMeta;
    };
    /**
     * @param {?} dirType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getDirectiveSummary = function (dirType) {
        var /** @type {?} */ dirSummary = (this._loadSummary(dirType, cpl.CompileSummaryKind.Directive));
        if (!dirSummary) {
            this._reportError(new SyntaxError("Illegal state: Could not load the summary for directive " + stringifyType(dirType) + "."), dirType);
        }
        return dirSummary;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.isDirective = function (type) { return this._directiveResolver.isDirective(type); };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.isPipe = function (type) { return this._pipeResolver.isPipe(type); };
    /**
     * @param {?} moduleType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getNgModuleSummary = function (moduleType) {
        var /** @type {?} */ moduleSummary = (this._loadSummary(moduleType, cpl.CompileSummaryKind.NgModule));
        if (!moduleSummary) {
            var /** @type {?} */ moduleMeta = this.getNgModuleMetadata(moduleType, false);
            moduleSummary = moduleMeta ? moduleMeta.toSummary() : null;
            if (moduleSummary) {
                this._summaryCache.set(moduleType, moduleSummary);
            }
        }
        return moduleSummary;
    };
    /**
     *  Loads the declared directives and pipes of an NgModule.
     * @param {?} moduleType
     * @param {?} isSync
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    CompileMetadataResolver.prototype.loadNgModuleDirectiveAndPipeMetadata = function (moduleType, isSync, throwIfNotFound) {
        var _this = this;
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
        var /** @type {?} */ loading = [];
        if (ngModule) {
            ngModule.declaredDirectives.forEach(function (id) {
                var /** @type {?} */ promise = _this._loadDirectiveMetadata(id.reference, isSync);
                if (promise) {
                    loading.push(promise);
                }
            });
            ngModule.declaredPipes.forEach(function (id) { return _this._loadPipeMetadata(id.reference); });
        }
        return Promise.all(loading);
    };
    /**
     * @param {?} moduleType
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    CompileMetadataResolver.prototype.getNgModuleMetadata = function (moduleType, throwIfNotFound) {
        var _this = this;
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        moduleType = resolveForwardRef(moduleType);
        var /** @type {?} */ compileMeta = this._ngModuleCache.get(moduleType);
        if (compileMeta) {
            return compileMeta;
        }
        var /** @type {?} */ meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
        if (!meta) {
            return null;
        }
        var /** @type {?} */ declaredDirectives = [];
        var /** @type {?} */ exportedNonModuleIdentifiers = [];
        var /** @type {?} */ declaredPipes = [];
        var /** @type {?} */ importedModules = [];
        var /** @type {?} */ exportedModules = [];
        var /** @type {?} */ providers = [];
        var /** @type {?} */ entryComponents = [];
        var /** @type {?} */ bootstrapComponents = [];
        var /** @type {?} */ schemas = [];
        if (meta.imports) {
            flattenAndDedupeArray(meta.imports).forEach(function (importedType) {
                var /** @type {?} */ importedModuleType;
                if (isValidType(importedType)) {
                    importedModuleType = importedType;
                }
                else if (importedType && importedType.ngModule) {
                    var /** @type {?} */ moduleWithProviders = importedType;
                    importedModuleType = moduleWithProviders.ngModule;
                    if (moduleWithProviders.providers) {
                        providers.push.apply(providers, _this._getProvidersMetadata(moduleWithProviders.providers, entryComponents, "provider for the NgModule '" + stringifyType(importedModuleType) + "'", [], importedType));
                    }
                }
                if (importedModuleType) {
                    var /** @type {?} */ importedModuleSummary = _this.getNgModuleSummary(importedModuleType);
                    if (!importedModuleSummary) {
                        _this._reportError(new SyntaxError("Unexpected " + _this._getTypeDescriptor(importedType) + " '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                        return;
                    }
                    importedModules.push(importedModuleSummary);
                }
                else {
                    _this._reportError(new SyntaxError("Unexpected value '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
            });
        }
        if (meta.exports) {
            flattenAndDedupeArray(meta.exports).forEach(function (exportedType) {
                if (!isValidType(exportedType)) {
                    _this._reportError(new SyntaxError("Unexpected value '" + stringifyType(exportedType) + "' exported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
                var /** @type {?} */ exportedModuleSummary = _this.getNgModuleSummary(exportedType);
                if (exportedModuleSummary) {
                    exportedModules.push(exportedModuleSummary);
                }
                else {
                    exportedNonModuleIdentifiers.push(_this._getIdentifierMetadata(exportedType));
                }
            });
        }
        // Note: This will be modified later, so we rely on
        // getting a new instance every time!
        var /** @type {?} */ transitiveModule = this._getTransitiveNgModuleMetadata(importedModules, exportedModules);
        if (meta.declarations) {
            flattenAndDedupeArray(meta.declarations).forEach(function (declaredType) {
                if (!isValidType(declaredType)) {
                    _this._reportError(new SyntaxError("Unexpected value '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
                var /** @type {?} */ declaredIdentifier = _this._getIdentifierMetadata(declaredType);
                if (_this._directiveResolver.isDirective(declaredType)) {
                    transitiveModule.addDirective(declaredIdentifier);
                    declaredDirectives.push(declaredIdentifier);
                    _this._addTypeToModule(declaredType, moduleType);
                }
                else if (_this._pipeResolver.isPipe(declaredType)) {
                    transitiveModule.addPipe(declaredIdentifier);
                    transitiveModule.pipes.push(declaredIdentifier);
                    declaredPipes.push(declaredIdentifier);
                    _this._addTypeToModule(declaredType, moduleType);
                }
                else {
                    _this._reportError(new SyntaxError("Unexpected " + _this._getTypeDescriptor(declaredType) + " '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
            });
        }
        var /** @type {?} */ exportedDirectives = [];
        var /** @type {?} */ exportedPipes = [];
        exportedNonModuleIdentifiers.forEach(function (exportedId) {
            if (transitiveModule.directivesSet.has(exportedId.reference)) {
                exportedDirectives.push(exportedId);
                transitiveModule.addExportedDirective(exportedId);
            }
            else if (transitiveModule.pipesSet.has(exportedId.reference)) {
                exportedPipes.push(exportedId);
                transitiveModule.addExportedPipe(exportedId);
            }
            else {
                _this._reportError(new SyntaxError("Can't export " + _this._getTypeDescriptor(exportedId.reference) + " " + stringifyType(exportedId.reference) + " from " + stringifyType(moduleType) + " as it was neither declared nor imported!"), moduleType);
            }
        });
        // The providers of the module have to go last
        // so that they overwrite any other provider we already added.
        if (meta.providers) {
            providers.push.apply(providers, this._getProvidersMetadata(meta.providers, entryComponents, "provider for the NgModule '" + stringifyType(moduleType) + "'", [], moduleType));
        }
        if (meta.entryComponents) {
            entryComponents.push.apply(entryComponents, flattenAndDedupeArray(meta.entryComponents)
                .map(function (type) { return _this._getIdentifierMetadata(type); }));
        }
        if (meta.bootstrap) {
            flattenAndDedupeArray(meta.bootstrap).forEach(function (type) {
                if (!isValidType(type)) {
                    _this._reportError(new SyntaxError("Unexpected value '" + stringifyType(type) + "' used in the bootstrap property of module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
                bootstrapComponents.push(_this._getIdentifierMetadata(type));
            });
        }
        entryComponents.push.apply(entryComponents, bootstrapComponents);
        if (meta.schemas) {
            schemas.push.apply(schemas, flattenAndDedupeArray(meta.schemas));
        }
        compileMeta = new cpl.CompileNgModuleMetadata({
            type: this._getTypeMetadata(moduleType),
            providers: providers,
            entryComponents: entryComponents,
            bootstrapComponents: bootstrapComponents,
            schemas: schemas,
            declaredDirectives: declaredDirectives,
            exportedDirectives: exportedDirectives,
            declaredPipes: declaredPipes,
            exportedPipes: exportedPipes,
            importedModules: importedModules,
            exportedModules: exportedModules,
            transitiveModule: transitiveModule,
            id: meta.id,
        });
        entryComponents.forEach(function (id) { return transitiveModule.addEntryComponent(id); });
        providers.forEach(function (provider) { return transitiveModule.addProvider(provider, compileMeta.type); });
        transitiveModule.addModule(compileMeta.type);
        this._ngModuleCache.set(moduleType, compileMeta);
        return compileMeta;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype._getTypeDescriptor = function (type) {
        if (this._directiveResolver.isDirective(type)) {
            return 'directive';
        }
        if (this._pipeResolver.isPipe(type)) {
            return 'pipe';
        }
        if (this._ngModuleResolver.isNgModule(type)) {
            return 'module';
        }
        if (((type)).provide) {
            return 'provider';
        }
        return 'value';
    };
    /**
     * @param {?} type
     * @param {?} moduleType
     * @return {?}
     */
    CompileMetadataResolver.prototype._addTypeToModule = function (type, moduleType) {
        var /** @type {?} */ oldModule = this._ngModuleOfTypes.get(type);
        if (oldModule && oldModule !== moduleType) {
            this._reportError(new SyntaxError(("Type " + stringifyType(type) + " is part of the declarations of 2 modules: " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + "! ") +
                ("Please consider moving " + stringifyType(type) + " to a higher module that imports " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ". ") +
                ("You can also create a new NgModule that exports and includes " + stringifyType(type) + " then import that NgModule in " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ".")), moduleType);
        }
        this._ngModuleOfTypes.set(type, moduleType);
    };
    /**
     * @param {?} importedModules
     * @param {?} exportedModules
     * @return {?}
     */
    CompileMetadataResolver.prototype._getTransitiveNgModuleMetadata = function (importedModules, exportedModules) {
        // collect `providers` / `entryComponents` from all imported and all exported modules
        var /** @type {?} */ result = new cpl.TransitiveCompileNgModuleMetadata();
        var /** @type {?} */ modulesByToken = new Map();
        importedModules.concat(exportedModules).forEach(function (modSummary) {
            modSummary.modules.forEach(function (mod) { return result.addModule(mod); });
            modSummary.entryComponents.forEach(function (comp) { return result.addEntryComponent(comp); });
            var /** @type {?} */ addedTokens = new Set();
            modSummary.providers.forEach(function (entry) {
                var /** @type {?} */ tokenRef = cpl.tokenReference(entry.provider.token);
                var /** @type {?} */ prevModules = modulesByToken.get(tokenRef);
                if (!prevModules) {
                    prevModules = new Set();
                    modulesByToken.set(tokenRef, prevModules);
                }
                var /** @type {?} */ moduleRef = entry.module.reference;
                // Note: the providers of one module may still contain multiple providers
                // per token (e.g. for multi providers), and we need to preserve these.
                if (addedTokens.has(tokenRef) || !prevModules.has(moduleRef)) {
                    prevModules.add(moduleRef);
                    addedTokens.add(tokenRef);
                    result.addProvider(entry.provider, entry.module);
                }
            });
        });
        exportedModules.forEach(function (modSummary) {
            modSummary.exportedDirectives.forEach(function (id) { return result.addExportedDirective(id); });
            modSummary.exportedPipes.forEach(function (id) { return result.addExportedPipe(id); });
        });
        importedModules.forEach(function (modSummary) {
            modSummary.exportedDirectives.forEach(function (id) { return result.addDirective(id); });
            modSummary.exportedPipes.forEach(function (id) { return result.addPipe(id); });
        });
        return result;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype._getIdentifierMetadata = function (type) {
        type = resolveForwardRef(type);
        return { reference: type };
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.isInjectable = function (type) {
        var /** @type {?} */ annotations = this._reflector.annotations(type);
        // Note: We need an exact check here as @Component / @Directive / ... inherit
        // from @CompilerInjectable!
        return annotations.some(function (ann) { return ann.constructor === Injectable; });
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.getInjectableSummary = function (type) {
        return { summaryKind: cpl.CompileSummaryKind.Injectable, type: this._getTypeMetadata(type) };
    };
    /**
     * @param {?} type
     * @param {?=} dependencies
     * @return {?}
     */
    CompileMetadataResolver.prototype._getInjectableMetadata = function (type, dependencies) {
        if (dependencies === void 0) { dependencies = null; }
        var /** @type {?} */ typeSummary = this._loadSummary(type, cpl.CompileSummaryKind.Injectable);
        if (typeSummary) {
            return typeSummary.type;
        }
        return this._getTypeMetadata(type, dependencies);
    };
    /**
     * @param {?} type
     * @param {?=} dependencies
     * @return {?}
     */
    CompileMetadataResolver.prototype._getTypeMetadata = function (type, dependencies) {
        if (dependencies === void 0) { dependencies = null; }
        var /** @type {?} */ identifier = this._getIdentifierMetadata(type);
        return {
            reference: identifier.reference,
            diDeps: this._getDependenciesMetadata(identifier.reference, dependencies),
            lifecycleHooks: LIFECYCLE_HOOKS_VALUES.filter(function (hook) { return hasLifecycleHook(hook, identifier.reference); }),
        };
    };
    /**
     * @param {?} factory
     * @param {?=} dependencies
     * @return {?}
     */
    CompileMetadataResolver.prototype._getFactoryMetadata = function (factory, dependencies) {
        if (dependencies === void 0) { dependencies = null; }
        factory = resolveForwardRef(factory);
        return { reference: factory, diDeps: this._getDependenciesMetadata(factory, dependencies) };
    };
    /**
     *  Gets the metadata for the given pipe.
      * This assumes `loadNgModuleMetadata` has been called first.
     * @param {?} pipeType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getPipeMetadata = function (pipeType) {
        var /** @type {?} */ pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            this._reportError(new SyntaxError("Illegal state: getPipeMetadata can only be called after loadNgModuleMetadata for a module that declares it. Pipe " + stringifyType(pipeType) + "."), pipeType);
        }
        return pipeMeta;
    };
    /**
     * @param {?} pipeType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getPipeSummary = function (pipeType) {
        var /** @type {?} */ pipeSummary = (this._loadSummary(pipeType, cpl.CompileSummaryKind.Pipe));
        if (!pipeSummary) {
            this._reportError(new SyntaxError("Illegal state: Could not load the summary for pipe " + stringifyType(pipeType) + "."), pipeType);
        }
        return pipeSummary;
    };
    /**
     * @param {?} pipeType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getOrLoadPipeMetadata = function (pipeType) {
        var /** @type {?} */ pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            pipeMeta = this._loadPipeMetadata(pipeType);
        }
        return pipeMeta;
    };
    /**
     * @param {?} pipeType
     * @return {?}
     */
    CompileMetadataResolver.prototype._loadPipeMetadata = function (pipeType) {
        pipeType = resolveForwardRef(pipeType);
        var /** @type {?} */ pipeAnnotation = this._pipeResolver.resolve(pipeType);
        var /** @type {?} */ pipeMeta = new cpl.CompilePipeMetadata({
            type: this._getTypeMetadata(pipeType),
            name: pipeAnnotation.name,
            pure: pipeAnnotation.pure
        });
        this._pipeCache.set(pipeType, pipeMeta);
        this._summaryCache.set(pipeType, pipeMeta.toSummary());
        return pipeMeta;
    };
    /**
     * @param {?} typeOrFunc
     * @param {?} dependencies
     * @return {?}
     */
    CompileMetadataResolver.prototype._getDependenciesMetadata = function (typeOrFunc, dependencies) {
        var _this = this;
        var /** @type {?} */ hasUnknownDeps = false;
        var /** @type {?} */ params = dependencies || this._reflector.parameters(typeOrFunc) || [];
        var /** @type {?} */ dependenciesMetadata = params.map(function (param) {
            var /** @type {?} */ isAttribute = false;
            var /** @type {?} */ isHost = false;
            var /** @type {?} */ isSelf = false;
            var /** @type {?} */ isSkipSelf = false;
            var /** @type {?} */ isOptional = false;
            var /** @type {?} */ token = null;
            if (Array.isArray(param)) {
                param.forEach(function (paramEntry) {
                    if (paramEntry instanceof Host) {
                        isHost = true;
                    }
                    else if (paramEntry instanceof Self) {
                        isSelf = true;
                    }
                    else if (paramEntry instanceof SkipSelf) {
                        isSkipSelf = true;
                    }
                    else if (paramEntry instanceof Optional) {
                        isOptional = true;
                    }
                    else if (paramEntry instanceof Attribute) {
                        isAttribute = true;
                        token = paramEntry.attributeName;
                    }
                    else if (paramEntry instanceof Inject) {
                        token = paramEntry.token;
                    }
                    else if (isValidType(paramEntry) && isBlank(token)) {
                        token = paramEntry;
                    }
                });
            }
            else {
                token = param;
            }
            if (isBlank(token)) {
                hasUnknownDeps = true;
                return null;
            }
            return {
                isAttribute: isAttribute,
                isHost: isHost,
                isSelf: isSelf,
                isSkipSelf: isSkipSelf,
                isOptional: isOptional,
                token: _this._getTokenMetadata(token)
            };
        });
        if (hasUnknownDeps) {
            var /** @type {?} */ depsTokens = dependenciesMetadata.map(function (dep) { return dep ? stringifyType(dep.token) : '?'; }).join(', ');
            this._reportError(new SyntaxError("Can't resolve all parameters for " + stringifyType(typeOrFunc) + ": (" + depsTokens + ")."), typeOrFunc);
        }
        return dependenciesMetadata;
    };
    /**
     * @param {?} token
     * @return {?}
     */
    CompileMetadataResolver.prototype._getTokenMetadata = function (token) {
        token = resolveForwardRef(token);
        var /** @type {?} */ compileToken;
        if (typeof token === 'string') {
            compileToken = { value: token };
        }
        else {
            compileToken = { identifier: { reference: token } };
        }
        return compileToken;
    };
    /**
     * @param {?} providers
     * @param {?} targetEntryComponents
     * @param {?=} debugInfo
     * @param {?=} compileProviders
     * @param {?=} type
     * @return {?}
     */
    CompileMetadataResolver.prototype._getProvidersMetadata = function (providers, targetEntryComponents, debugInfo, compileProviders, type) {
        var _this = this;
        if (compileProviders === void 0) { compileProviders = []; }
        providers.forEach(function (provider, providerIdx) {
            if (Array.isArray(provider)) {
                _this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
            }
            else {
                provider = resolveForwardRef(provider);
                var /** @type {?} */ providerMeta = void 0;
                if (provider && typeof provider == 'object' && provider.hasOwnProperty('provide')) {
                    providerMeta = new cpl.ProviderMeta(provider.provide, provider);
                }
                else if (isValidType(provider)) {
                    providerMeta = new cpl.ProviderMeta(provider, { useClass: provider });
                }
                else {
                    var /** @type {?} */ providersInfo = ((providers.reduce(function (soFar, seenProvider, seenProviderIdx) {
                        if (seenProviderIdx < providerIdx) {
                            soFar.push("" + stringifyType(seenProvider));
                        }
                        else if (seenProviderIdx == providerIdx) {
                            soFar.push("?" + stringifyType(seenProvider) + "?");
                        }
                        else if (seenProviderIdx == providerIdx + 1) {
                            soFar.push('...');
                        }
                        return soFar;
                    }, [])))
                        .join(', ');
                    _this._reportError(new SyntaxError("Invalid " + (debugInfo ? debugInfo : 'provider') + " - only instances of Provider and Type are allowed, got: [" + providersInfo + "]"), type);
                }
                if (providerMeta.token === resolveIdentifier(Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
                    targetEntryComponents.push.apply(targetEntryComponents, _this._getEntryComponentsFromProvider(providerMeta, type));
                }
                else {
                    compileProviders.push(_this.getProviderMetadata(providerMeta));
                }
            }
        });
        return compileProviders;
    };
    /**
     * @param {?} provider
     * @param {?=} type
     * @return {?}
     */
    CompileMetadataResolver.prototype._getEntryComponentsFromProvider = function (provider, type) {
        var _this = this;
        var /** @type {?} */ components = [];
        var /** @type {?} */ collectedIdentifiers = [];
        if (provider.useFactory || provider.useExisting || provider.useClass) {
            this._reportError(new SyntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports useValue!"), type);
            return [];
        }
        if (!provider.multi) {
            this._reportError(new SyntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports 'multi = true'!"), type);
            return [];
        }
        extractIdentifiers(provider.useValue, collectedIdentifiers);
        collectedIdentifiers.forEach(function (identifier) {
            if (_this._directiveResolver.isDirective(identifier.reference) ||
                _this._loadSummary(identifier.reference, cpl.CompileSummaryKind.Directive)) {
                components.push(identifier);
            }
        });
        return components;
    };
    /**
     * @param {?} provider
     * @return {?}
     */
    CompileMetadataResolver.prototype.getProviderMetadata = function (provider) {
        var /** @type {?} */ compileDeps;
        var /** @type {?} */ compileTypeMetadata = null;
        var /** @type {?} */ compileFactoryMetadata = null;
        var /** @type {?} */ token = this._getTokenMetadata(provider.token);
        if (provider.useClass) {
            compileTypeMetadata = this._getInjectableMetadata(provider.useClass, provider.dependencies);
            compileDeps = compileTypeMetadata.diDeps;
            if (provider.token === provider.useClass) {
                // use the compileTypeMetadata as it contains information about lifecycleHooks...
                token = { identifier: compileTypeMetadata };
            }
        }
        else if (provider.useFactory) {
            compileFactoryMetadata = this._getFactoryMetadata(provider.useFactory, provider.dependencies);
            compileDeps = compileFactoryMetadata.diDeps;
        }
        return {
            token: token,
            useClass: compileTypeMetadata,
            useValue: provider.useValue,
            useFactory: compileFactoryMetadata,
            useExisting: provider.useExisting ? this._getTokenMetadata(provider.useExisting) : null,
            deps: compileDeps,
            multi: provider.multi
        };
    };
    /**
     * @param {?} queries
     * @param {?} isViewQuery
     * @param {?} directiveType
     * @return {?}
     */
    CompileMetadataResolver.prototype._getQueriesMetadata = function (queries, isViewQuery, directiveType) {
        var _this = this;
        var /** @type {?} */ res = [];
        Object.keys(queries).forEach(function (propertyName) {
            var /** @type {?} */ query = queries[propertyName];
            if (query.isViewQuery === isViewQuery) {
                res.push(_this._getQueryMetadata(query, propertyName, directiveType));
            }
        });
        return res;
    };
    /**
     * @param {?} selector
     * @return {?}
     */
    CompileMetadataResolver.prototype._queryVarBindings = function (selector) { return selector.split(/\s*,\s*/); };
    /**
     * @param {?} q
     * @param {?} propertyName
     * @param {?} typeOrFunc
     * @return {?}
     */
    CompileMetadataResolver.prototype._getQueryMetadata = function (q, propertyName, typeOrFunc) {
        var _this = this;
        var /** @type {?} */ selectors;
        if (typeof q.selector === 'string') {
            selectors =
                this._queryVarBindings(q.selector).map(function (varName) { return _this._getTokenMetadata(varName); });
        }
        else {
            if (!q.selector) {
                this._reportError(new SyntaxError("Can't construct a query for the property \"" + propertyName + "\" of \"" + stringifyType(typeOrFunc) + "\" since the query selector wasn't defined."), typeOrFunc);
            }
            selectors = [this._getTokenMetadata(q.selector)];
        }
        return {
            selectors: selectors,
            first: q.first,
            descendants: q.descendants, propertyName: propertyName,
            read: q.read ? this._getTokenMetadata(q.read) : null
        };
    };
    /**
     * @param {?} error
     * @param {?=} type
     * @param {?=} otherType
     * @return {?}
     */
    CompileMetadataResolver.prototype._reportError = function (error, type, otherType) {
        if (this._errorCollector) {
            this._errorCollector(error, type);
            if (otherType) {
                this._errorCollector(error, otherType);
            }
        }
        else {
            throw error;
        }
    };
    /** @nocollapse */
    CompileMetadataResolver.ctorParameters = function () { return [
        { type: NgModuleResolver, },
        { type: DirectiveResolver, },
        { type: PipeResolver, },
        { type: SummaryResolver, },
        { type: ElementSchemaRegistry, },
        { type: DirectiveNormalizer, },
        { type: ReflectorReader, },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ERROR_COLLECTOR_TOKEN,] },] },
    ]; };
    CompileMetadataResolver = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [NgModuleResolver, DirectiveResolver, PipeResolver, SummaryResolver, ElementSchemaRegistry, DirectiveNormalizer, ReflectorReader, Function])
    ], CompileMetadataResolver);
    return CompileMetadataResolver;
}());
function CompileMetadataResolver_tsickle_Closure_declarations() {
    /**
     * @nocollapse
     * @type {?}
     */
    CompileMetadataResolver.ctorParameters;
    /** @type {?} */
    CompileMetadataResolver.prototype._directiveCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._summaryCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._pipeCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._ngModuleCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._ngModuleOfTypes;
    /** @type {?} */
    CompileMetadataResolver.prototype._ngModuleResolver;
    /** @type {?} */
    CompileMetadataResolver.prototype._directiveResolver;
    /** @type {?} */
    CompileMetadataResolver.prototype._pipeResolver;
    /** @type {?} */
    CompileMetadataResolver.prototype._summaryResolver;
    /** @type {?} */
    CompileMetadataResolver.prototype._schemaRegistry;
    /** @type {?} */
    CompileMetadataResolver.prototype._directiveNormalizer;
    /** @type {?} */
    CompileMetadataResolver.prototype._reflector;
    /** @type {?} */
    CompileMetadataResolver.prototype._errorCollector;
}
/**
 * @param {?} tree
 * @param {?=} out
 * @return {?}
 */
function flattenArray(tree, out) {
    if (out === void 0) { out = []; }
    if (tree) {
        for (var /** @type {?} */ i = 0; i < tree.length; i++) {
            var /** @type {?} */ item = resolveForwardRef(tree[i]);
            if (Array.isArray(item)) {
                flattenArray(item, out);
            }
            else {
                out.push(item);
            }
        }
    }
    return out;
}
/**
 * @param {?} array
 * @return {?}
 */
function dedupeArray(array) {
    if (array) {
        return Array.from(new Set(array));
    }
    return [];
}
/**
 * @param {?} tree
 * @return {?}
 */
function flattenAndDedupeArray(tree) {
    return dedupeArray(flattenArray(tree));
}
/**
 * @param {?} value
 * @return {?}
 */
function isValidType(value) {
    return (value instanceof StaticSymbol) || (value instanceof Type);
}
/**
 * @param {?} reflector
 * @param {?} type
 * @param {?} cmpMetadata
 * @return {?}
 */
export function componentModuleUrl(reflector, type, cmpMetadata) {
    if (type instanceof StaticSymbol) {
        return type.filePath;
    }
    var /** @type {?} */ moduleId = cmpMetadata.moduleId;
    if (typeof moduleId === 'string') {
        var /** @type {?} */ scheme = getUrlScheme(moduleId);
        return scheme ? moduleId : "package:" + moduleId + MODULE_SUFFIX;
    }
    else if (moduleId !== null && moduleId !== void 0) {
        throw new SyntaxError(("moduleId should be a string in \"" + stringifyType(type) + "\". See https://goo.gl/wIDDiL for more information.\n") +
            "If you're using Webpack you should inline the template and the styles, see https://goo.gl/X2J8zc.");
    }
    return reflector.importUri(type);
}
/**
 * @param {?} value
 * @param {?} targetIdentifiers
 * @return {?}
 */
function extractIdentifiers(value, targetIdentifiers) {
    visitValue(value, new _CompileValueConverter(), targetIdentifiers);
}
var _CompileValueConverter = (function (_super) {
    __extends(_CompileValueConverter, _super);
    function _CompileValueConverter() {
        _super.apply(this, arguments);
    }
    /**
     * @param {?} value
     * @param {?} targetIdentifiers
     * @return {?}
     */
    _CompileValueConverter.prototype.visitOther = function (value, targetIdentifiers) {
        targetIdentifiers.push({ reference: value });
    };
    return _CompileValueConverter;
}(ValueTransformer));
/**
 * @param {?} type
 * @return {?}
 */
function stringifyType(type) {
    if (type instanceof StaticSymbol) {
        return type.name + " in " + type.filePath;
    }
    else {
        return stringify(type);
    }
}
//# sourceMappingURL=metadata_resolver.js.map