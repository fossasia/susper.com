/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, SchemaMetadata, Type, ViewEncapsulation } from '@angular/core';
import { LifecycleHooks } from './private_import_core';
export declare class CompileAnimationEntryMetadata {
    name: string;
    definitions: CompileAnimationStateMetadata[];
    constructor(name?: string, definitions?: CompileAnimationStateMetadata[]);
}
export declare abstract class CompileAnimationStateMetadata {
}
export declare class CompileAnimationStateDeclarationMetadata extends CompileAnimationStateMetadata {
    stateNameExpr: string;
    styles: CompileAnimationStyleMetadata;
    constructor(stateNameExpr: string, styles: CompileAnimationStyleMetadata);
}
export declare class CompileAnimationStateTransitionMetadata extends CompileAnimationStateMetadata {
    stateChangeExpr: string;
    steps: CompileAnimationMetadata;
    constructor(stateChangeExpr: string, steps: CompileAnimationMetadata);
}
export declare abstract class CompileAnimationMetadata {
}
export declare class CompileAnimationKeyframesSequenceMetadata extends CompileAnimationMetadata {
    steps: CompileAnimationStyleMetadata[];
    constructor(steps?: CompileAnimationStyleMetadata[]);
}
export declare class CompileAnimationStyleMetadata extends CompileAnimationMetadata {
    offset: number;
    styles: Array<string | {
        [key: string]: string | number;
    }>;
    constructor(offset: number, styles?: Array<string | {
        [key: string]: string | number;
    }>);
}
export declare class CompileAnimationAnimateMetadata extends CompileAnimationMetadata {
    timings: string | number;
    styles: CompileAnimationStyleMetadata | CompileAnimationKeyframesSequenceMetadata;
    constructor(timings?: string | number, styles?: CompileAnimationStyleMetadata | CompileAnimationKeyframesSequenceMetadata);
}
export declare abstract class CompileAnimationWithStepsMetadata extends CompileAnimationMetadata {
    steps: CompileAnimationMetadata[];
    constructor(steps?: CompileAnimationMetadata[]);
}
export declare class CompileAnimationSequenceMetadata extends CompileAnimationWithStepsMetadata {
    constructor(steps?: CompileAnimationMetadata[]);
}
export declare class CompileAnimationGroupMetadata extends CompileAnimationWithStepsMetadata {
    constructor(steps?: CompileAnimationMetadata[]);
}
export declare function identifierName(compileIdentifier: CompileIdentifierMetadata): string;
export declare function identifierModuleUrl(compileIdentifier: CompileIdentifierMetadata): string;
export interface CompileIdentifierMetadata {
    reference: any;
}
export declare enum CompileSummaryKind {
    Pipe = 0,
    Directive = 1,
    NgModule = 2,
    Injectable = 3,
}
/**
 * A CompileSummary is the data needed to use a directive / pipe / module
 * in other modules / components. However, this data is not enough to compile
 * the directive / module itself.
 */
export interface CompileTypeSummary {
    summaryKind: CompileSummaryKind;
    type: CompileTypeMetadata;
}
export interface CompileDiDependencyMetadata {
    isAttribute?: boolean;
    isSelf?: boolean;
    isHost?: boolean;
    isSkipSelf?: boolean;
    isOptional?: boolean;
    isValue?: boolean;
    token?: CompileTokenMetadata;
    value?: any;
}
export interface CompileProviderMetadata {
    token: CompileTokenMetadata;
    useClass?: CompileTypeMetadata;
    useValue?: any;
    useExisting?: CompileTokenMetadata;
    useFactory?: CompileFactoryMetadata;
    deps?: CompileDiDependencyMetadata[];
    multi?: boolean;
}
export interface CompileFactoryMetadata extends CompileIdentifierMetadata {
    diDeps: CompileDiDependencyMetadata[];
    reference: any;
}
export declare function tokenName(token: CompileTokenMetadata): string;
export declare function tokenReference(token: CompileTokenMetadata): any;
export interface CompileTokenMetadata {
    value?: any;
    identifier?: CompileIdentifierMetadata | CompileTypeMetadata;
}
/**
 * Metadata regarding compilation of a type.
 */
export interface CompileTypeMetadata extends CompileIdentifierMetadata {
    diDeps: CompileDiDependencyMetadata[];
    lifecycleHooks: LifecycleHooks[];
    reference: any;
}
export interface CompileQueryMetadata {
    selectors: Array<CompileTokenMetadata>;
    descendants: boolean;
    first: boolean;
    propertyName: string;
    read: CompileTokenMetadata;
}
/**
 * Metadata about a stylesheet
 */
export declare class CompileStylesheetMetadata {
    moduleUrl: string;
    styles: string[];
    styleUrls: string[];
    constructor({moduleUrl, styles, styleUrls}?: {
        moduleUrl?: string;
        styles?: string[];
        styleUrls?: string[];
    });
}
/**
 * Summary Metadata regarding compilation of a template.
 */
export interface CompileTemplateSummary {
    animations: string[];
    ngContentSelectors: string[];
    encapsulation: ViewEncapsulation;
}
/**
 * Metadata regarding compilation of a template.
 */
export declare class CompileTemplateMetadata {
    encapsulation: ViewEncapsulation;
    template: string;
    templateUrl: string;
    styles: string[];
    styleUrls: string[];
    externalStylesheets: CompileStylesheetMetadata[];
    animations: CompileAnimationEntryMetadata[];
    ngContentSelectors: string[];
    interpolation: [string, string];
    constructor({encapsulation, template, templateUrl, styles, styleUrls, externalStylesheets, animations, ngContentSelectors, interpolation}?: {
        encapsulation?: ViewEncapsulation;
        template?: string;
        templateUrl?: string;
        styles?: string[];
        styleUrls?: string[];
        externalStylesheets?: CompileStylesheetMetadata[];
        ngContentSelectors?: string[];
        animations?: CompileAnimationEntryMetadata[];
        interpolation?: [string, string];
    });
    toSummary(): CompileTemplateSummary;
}
export interface CompileDirectiveSummary extends CompileTypeSummary {
    type: CompileTypeMetadata;
    isComponent: boolean;
    selector: string;
    exportAs: string;
    inputs: {
        [key: string]: string;
    };
    outputs: {
        [key: string]: string;
    };
    hostListeners: {
        [key: string]: string;
    };
    hostProperties: {
        [key: string]: string;
    };
    hostAttributes: {
        [key: string]: string;
    };
    providers: CompileProviderMetadata[];
    viewProviders: CompileProviderMetadata[];
    queries: CompileQueryMetadata[];
    entryComponents: CompileIdentifierMetadata[];
    changeDetection: ChangeDetectionStrategy;
    template: CompileTemplateSummary;
}
/**
 * Metadata regarding compilation of a directive.
 */
export declare class CompileDirectiveMetadata {
    static create({isHost, type, isComponent, selector, exportAs, changeDetection, inputs, outputs, host, providers, viewProviders, queries, viewQueries, entryComponents, template}?: {
        isHost?: boolean;
        type?: CompileTypeMetadata;
        isComponent?: boolean;
        selector?: string;
        exportAs?: string;
        changeDetection?: ChangeDetectionStrategy;
        inputs?: string[];
        outputs?: string[];
        host?: {
            [key: string]: string;
        };
        providers?: CompileProviderMetadata[];
        viewProviders?: CompileProviderMetadata[];
        queries?: CompileQueryMetadata[];
        viewQueries?: CompileQueryMetadata[];
        entryComponents?: CompileIdentifierMetadata[];
        template?: CompileTemplateMetadata;
    }): CompileDirectiveMetadata;
    isHost: boolean;
    type: CompileTypeMetadata;
    isComponent: boolean;
    selector: string;
    exportAs: string;
    changeDetection: ChangeDetectionStrategy;
    inputs: {
        [key: string]: string;
    };
    outputs: {
        [key: string]: string;
    };
    hostListeners: {
        [key: string]: string;
    };
    hostProperties: {
        [key: string]: string;
    };
    hostAttributes: {
        [key: string]: string;
    };
    providers: CompileProviderMetadata[];
    viewProviders: CompileProviderMetadata[];
    queries: CompileQueryMetadata[];
    viewQueries: CompileQueryMetadata[];
    entryComponents: CompileIdentifierMetadata[];
    template: CompileTemplateMetadata;
    constructor({isHost, type, isComponent, selector, exportAs, changeDetection, inputs, outputs, hostListeners, hostProperties, hostAttributes, providers, viewProviders, queries, viewQueries, entryComponents, template}?: {
        isHost?: boolean;
        type?: CompileTypeMetadata;
        isComponent?: boolean;
        selector?: string;
        exportAs?: string;
        changeDetection?: ChangeDetectionStrategy;
        inputs?: {
            [key: string]: string;
        };
        outputs?: {
            [key: string]: string;
        };
        hostListeners?: {
            [key: string]: string;
        };
        hostProperties?: {
            [key: string]: string;
        };
        hostAttributes?: {
            [key: string]: string;
        };
        providers?: CompileProviderMetadata[];
        viewProviders?: CompileProviderMetadata[];
        queries?: CompileQueryMetadata[];
        viewQueries?: CompileQueryMetadata[];
        entryComponents?: CompileIdentifierMetadata[];
        template?: CompileTemplateMetadata;
    });
    toSummary(): CompileDirectiveSummary;
}
/**
 * Construct {@link CompileDirectiveMetadata} from {@link ComponentTypeMetadata} and a selector.
 */
export declare function createHostComponentMeta(typeReference: any, compMeta: CompileDirectiveMetadata): CompileDirectiveMetadata;
export interface CompilePipeSummary extends CompileTypeSummary {
    type: CompileTypeMetadata;
    name: string;
    pure: boolean;
}
export declare class CompilePipeMetadata {
    type: CompileTypeMetadata;
    name: string;
    pure: boolean;
    constructor({type, name, pure}?: {
        type?: CompileTypeMetadata;
        name?: string;
        pure?: boolean;
    });
    toSummary(): CompilePipeSummary;
}
export interface CompileNgModuleSummary extends CompileTypeSummary {
    type: CompileTypeMetadata;
    exportedDirectives: CompileIdentifierMetadata[];
    exportedPipes: CompileIdentifierMetadata[];
    entryComponents: CompileIdentifierMetadata[];
    providers: {
        provider: CompileProviderMetadata;
        module: CompileIdentifierMetadata;
    }[];
    modules: CompileTypeMetadata[];
}
/**
 * Metadata regarding compilation of a module.
 */
export declare class CompileNgModuleMetadata {
    type: CompileTypeMetadata;
    declaredDirectives: CompileIdentifierMetadata[];
    exportedDirectives: CompileIdentifierMetadata[];
    declaredPipes: CompileIdentifierMetadata[];
    exportedPipes: CompileIdentifierMetadata[];
    entryComponents: CompileIdentifierMetadata[];
    bootstrapComponents: CompileIdentifierMetadata[];
    providers: CompileProviderMetadata[];
    importedModules: CompileNgModuleSummary[];
    exportedModules: CompileNgModuleSummary[];
    schemas: SchemaMetadata[];
    id: string;
    transitiveModule: TransitiveCompileNgModuleMetadata;
    constructor({type, providers, declaredDirectives, exportedDirectives, declaredPipes, exportedPipes, entryComponents, bootstrapComponents, importedModules, exportedModules, schemas, transitiveModule, id}?: {
        type?: CompileTypeMetadata;
        providers?: CompileProviderMetadata[];
        declaredDirectives?: CompileIdentifierMetadata[];
        exportedDirectives?: CompileIdentifierMetadata[];
        declaredPipes?: CompileIdentifierMetadata[];
        exportedPipes?: CompileIdentifierMetadata[];
        entryComponents?: CompileIdentifierMetadata[];
        bootstrapComponents?: CompileIdentifierMetadata[];
        importedModules?: CompileNgModuleSummary[];
        exportedModules?: CompileNgModuleSummary[];
        transitiveModule?: TransitiveCompileNgModuleMetadata;
        schemas?: SchemaMetadata[];
        id?: string;
    });
    toSummary(): CompileNgModuleSummary;
}
export declare class TransitiveCompileNgModuleMetadata {
    directivesSet: Set<any>;
    directives: CompileIdentifierMetadata[];
    exportedDirectivesSet: Set<any>;
    exportedDirectives: CompileIdentifierMetadata[];
    pipesSet: Set<any>;
    pipes: CompileIdentifierMetadata[];
    exportedPipesSet: Set<any>;
    exportedPipes: CompileIdentifierMetadata[];
    modulesSet: Set<any>;
    modules: CompileTypeMetadata[];
    entryComponentsSet: Set<any>;
    entryComponents: CompileIdentifierMetadata[];
    providers: {
        provider: CompileProviderMetadata;
        module: CompileIdentifierMetadata;
    }[];
    addProvider(provider: CompileProviderMetadata, module: CompileIdentifierMetadata): void;
    addDirective(id: CompileIdentifierMetadata): void;
    addExportedDirective(id: CompileIdentifierMetadata): void;
    addPipe(id: CompileIdentifierMetadata): void;
    addExportedPipe(id: CompileIdentifierMetadata): void;
    addModule(id: CompileTypeMetadata): void;
    addEntryComponent(id: CompileIdentifierMetadata): void;
}
export declare class ProviderMeta {
    token: any;
    useClass: Type<any>;
    useValue: any;
    useExisting: any;
    useFactory: Function;
    dependencies: Object[];
    multi: boolean;
    constructor(token: any, {useClass, useValue, useExisting, useFactory, deps, multi}: {
        useClass?: Type<any>;
        useValue?: any;
        useExisting?: any;
        useFactory?: Function;
        deps?: Object[];
        multi?: boolean;
    });
}
