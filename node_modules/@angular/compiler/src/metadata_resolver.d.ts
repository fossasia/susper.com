/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationEntryMetadata, Component, Directive, OpaqueToken, Type } from '@angular/core';
import * as cpl from './compile_metadata';
import { DirectiveNormalizer } from './directive_normalizer';
import { DirectiveResolver } from './directive_resolver';
import { NgModuleResolver } from './ng_module_resolver';
import { PipeResolver } from './pipe_resolver';
import { ReflectorReader } from './private_import_core';
import { ElementSchemaRegistry } from './schema/element_schema_registry';
import { SummaryResolver } from './summary_resolver';
export declare type ErrorCollector = (error: any, type?: any) => void;
export declare const ERROR_COLLECTOR_TOKEN: OpaqueToken;
export declare class CompileMetadataResolver {
    private _ngModuleResolver;
    private _directiveResolver;
    private _pipeResolver;
    private _summaryResolver;
    private _schemaRegistry;
    private _directiveNormalizer;
    private _reflector;
    private _errorCollector;
    private _directiveCache;
    private _summaryCache;
    private _pipeCache;
    private _ngModuleCache;
    private _ngModuleOfTypes;
    constructor(_ngModuleResolver: NgModuleResolver, _directiveResolver: DirectiveResolver, _pipeResolver: PipeResolver, _summaryResolver: SummaryResolver<any>, _schemaRegistry: ElementSchemaRegistry, _directiveNormalizer: DirectiveNormalizer, _reflector?: ReflectorReader, _errorCollector?: ErrorCollector);
    clearCacheFor(type: Type<any>): void;
    clearCache(): void;
    getAnimationEntryMetadata(entry: AnimationEntryMetadata): cpl.CompileAnimationEntryMetadata;
    private _getAnimationStateMetadata(value);
    private _getAnimationStyleMetadata(value);
    private _getAnimationMetadata(value);
    private _loadSummary(type, kind);
    private _loadDirectiveMetadata(directiveType, isSync);
    getNonNormalizedDirectiveMetadata(directiveType: any): {
        annotation: Directive;
        metadata: cpl.CompileDirectiveMetadata;
    };
    /**
     * Gets the metadata for the given directive.
     * This assumes `loadNgModuleMetadata` has been called first.
     */
    getDirectiveMetadata(directiveType: any): cpl.CompileDirectiveMetadata;
    getDirectiveSummary(dirType: any): cpl.CompileDirectiveSummary;
    isDirective(type: any): boolean;
    isPipe(type: any): boolean;
    getNgModuleSummary(moduleType: any): cpl.CompileNgModuleSummary;
    /**
     * Loads the declared directives and pipes of an NgModule.
     */
    loadNgModuleDirectiveAndPipeMetadata(moduleType: any, isSync: boolean, throwIfNotFound?: boolean): Promise<any>;
    getNgModuleMetadata(moduleType: any, throwIfNotFound?: boolean): cpl.CompileNgModuleMetadata;
    private _getTypeDescriptor(type);
    private _addTypeToModule(type, moduleType);
    private _getTransitiveNgModuleMetadata(importedModules, exportedModules);
    private _getIdentifierMetadata(type);
    isInjectable(type: any): boolean;
    getInjectableSummary(type: any): cpl.CompileTypeSummary;
    private _getInjectableMetadata(type, dependencies?);
    private _getTypeMetadata(type, dependencies?);
    private _getFactoryMetadata(factory, dependencies?);
    /**
     * Gets the metadata for the given pipe.
     * This assumes `loadNgModuleMetadata` has been called first.
     */
    getPipeMetadata(pipeType: any): cpl.CompilePipeMetadata;
    getPipeSummary(pipeType: any): cpl.CompilePipeSummary;
    getOrLoadPipeMetadata(pipeType: any): cpl.CompilePipeMetadata;
    private _loadPipeMetadata(pipeType);
    private _getDependenciesMetadata(typeOrFunc, dependencies);
    private _getTokenMetadata(token);
    private _getProvidersMetadata(providers, targetEntryComponents, debugInfo?, compileProviders?, type?);
    private _getEntryComponentsFromProvider(provider, type?);
    getProviderMetadata(provider: cpl.ProviderMeta): cpl.CompileProviderMetadata;
    private _getQueriesMetadata(queries, isViewQuery, directiveType);
    private _queryVarBindings(selector);
    private _getQueryMetadata(q, propertyName, typeOrFunc);
    private _reportError(error, type?, otherType?);
}
export declare function componentModuleUrl(reflector: ReflectorReader, type: Type<any>, cmpMetadata: Component): string;
