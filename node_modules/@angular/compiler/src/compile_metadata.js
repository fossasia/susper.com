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
import { ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { StaticSymbol } from './aot/static_symbol';
import { ListWrapper } from './facade/collection';
import { isPresent, stringify } from './facade/lang';
import { reflector } from './private_import_core';
import { CssSelector } from './selector';
import { splitAtColon } from './util';
/**
 * @return {?}
 */
function unimplemented() {
    throw new Error('unimplemented');
}
// group 0: "[prop] or (event) or @trigger"
// group 1: "prop" from "[prop]"
// group 2: "event" from "(event)"
// group 3: "@trigger" from "@trigger"
var /** @type {?} */ HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
export var CompileAnimationEntryMetadata = (function () {
    /**
     * @param {?=} name
     * @param {?=} definitions
     */
    function CompileAnimationEntryMetadata(name, definitions) {
        if (name === void 0) { name = null; }
        if (definitions === void 0) { definitions = null; }
        this.name = name;
        this.definitions = definitions;
    }
    return CompileAnimationEntryMetadata;
}());
function CompileAnimationEntryMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileAnimationEntryMetadata.prototype.name;
    /** @type {?} */
    CompileAnimationEntryMetadata.prototype.definitions;
}
/**
 * @abstract
 */
export var CompileAnimationStateMetadata = (function () {
    function CompileAnimationStateMetadata() {
    }
    return CompileAnimationStateMetadata;
}());
export var CompileAnimationStateDeclarationMetadata = (function (_super) {
    __extends(CompileAnimationStateDeclarationMetadata, _super);
    /**
     * @param {?} stateNameExpr
     * @param {?} styles
     */
    function CompileAnimationStateDeclarationMetadata(stateNameExpr, styles) {
        _super.call(this);
        this.stateNameExpr = stateNameExpr;
        this.styles = styles;
    }
    return CompileAnimationStateDeclarationMetadata;
}(CompileAnimationStateMetadata));
function CompileAnimationStateDeclarationMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileAnimationStateDeclarationMetadata.prototype.stateNameExpr;
    /** @type {?} */
    CompileAnimationStateDeclarationMetadata.prototype.styles;
}
export var CompileAnimationStateTransitionMetadata = (function (_super) {
    __extends(CompileAnimationStateTransitionMetadata, _super);
    /**
     * @param {?} stateChangeExpr
     * @param {?} steps
     */
    function CompileAnimationStateTransitionMetadata(stateChangeExpr, steps) {
        _super.call(this);
        this.stateChangeExpr = stateChangeExpr;
        this.steps = steps;
    }
    return CompileAnimationStateTransitionMetadata;
}(CompileAnimationStateMetadata));
function CompileAnimationStateTransitionMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileAnimationStateTransitionMetadata.prototype.stateChangeExpr;
    /** @type {?} */
    CompileAnimationStateTransitionMetadata.prototype.steps;
}
/**
 * @abstract
 */
export var CompileAnimationMetadata = (function () {
    function CompileAnimationMetadata() {
    }
    return CompileAnimationMetadata;
}());
export var CompileAnimationKeyframesSequenceMetadata = (function (_super) {
    __extends(CompileAnimationKeyframesSequenceMetadata, _super);
    /**
     * @param {?=} steps
     */
    function CompileAnimationKeyframesSequenceMetadata(steps) {
        if (steps === void 0) { steps = []; }
        _super.call(this);
        this.steps = steps;
    }
    return CompileAnimationKeyframesSequenceMetadata;
}(CompileAnimationMetadata));
function CompileAnimationKeyframesSequenceMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileAnimationKeyframesSequenceMetadata.prototype.steps;
}
export var CompileAnimationStyleMetadata = (function (_super) {
    __extends(CompileAnimationStyleMetadata, _super);
    /**
     * @param {?} offset
     * @param {?=} styles
     */
    function CompileAnimationStyleMetadata(offset, styles) {
        if (styles === void 0) { styles = null; }
        _super.call(this);
        this.offset = offset;
        this.styles = styles;
    }
    return CompileAnimationStyleMetadata;
}(CompileAnimationMetadata));
function CompileAnimationStyleMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileAnimationStyleMetadata.prototype.offset;
    /** @type {?} */
    CompileAnimationStyleMetadata.prototype.styles;
}
export var CompileAnimationAnimateMetadata = (function (_super) {
    __extends(CompileAnimationAnimateMetadata, _super);
    /**
     * @param {?=} timings
     * @param {?=} styles
     */
    function CompileAnimationAnimateMetadata(timings, styles) {
        if (timings === void 0) { timings = 0; }
        if (styles === void 0) { styles = null; }
        _super.call(this);
        this.timings = timings;
        this.styles = styles;
    }
    return CompileAnimationAnimateMetadata;
}(CompileAnimationMetadata));
function CompileAnimationAnimateMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileAnimationAnimateMetadata.prototype.timings;
    /** @type {?} */
    CompileAnimationAnimateMetadata.prototype.styles;
}
/**
 * @abstract
 */
export var CompileAnimationWithStepsMetadata = (function (_super) {
    __extends(CompileAnimationWithStepsMetadata, _super);
    /**
     * @param {?=} steps
     */
    function CompileAnimationWithStepsMetadata(steps) {
        if (steps === void 0) { steps = null; }
        _super.call(this);
        this.steps = steps;
    }
    return CompileAnimationWithStepsMetadata;
}(CompileAnimationMetadata));
function CompileAnimationWithStepsMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileAnimationWithStepsMetadata.prototype.steps;
}
export var CompileAnimationSequenceMetadata = (function (_super) {
    __extends(CompileAnimationSequenceMetadata, _super);
    /**
     * @param {?=} steps
     */
    function CompileAnimationSequenceMetadata(steps) {
        if (steps === void 0) { steps = null; }
        _super.call(this, steps);
    }
    return CompileAnimationSequenceMetadata;
}(CompileAnimationWithStepsMetadata));
export var CompileAnimationGroupMetadata = (function (_super) {
    __extends(CompileAnimationGroupMetadata, _super);
    /**
     * @param {?=} steps
     */
    function CompileAnimationGroupMetadata(steps) {
        if (steps === void 0) { steps = null; }
        _super.call(this, steps);
    }
    return CompileAnimationGroupMetadata;
}(CompileAnimationWithStepsMetadata));
/**
 * @param {?} name
 * @return {?}
 */
function _sanitizeIdentifier(name) {
    return name.replace(/\W/g, '_');
}
var /** @type {?} */ _anonymousTypeIndex = 0;
/**
 * @param {?} compileIdentifier
 * @return {?}
 */
export function identifierName(compileIdentifier) {
    if (!compileIdentifier || !compileIdentifier.reference) {
        return null;
    }
    var /** @type {?} */ ref = compileIdentifier.reference;
    if (ref instanceof StaticSymbol) {
        return ref.name;
    }
    if (ref['__anonymousType']) {
        return ref['__anonymousType'];
    }
    var /** @type {?} */ identifier = stringify(ref);
    if (identifier.indexOf('(') >= 0) {
        // case: anonymous functions!
        identifier = "anonymous_" + _anonymousTypeIndex++;
        ref['__anonymousType'] = identifier;
    }
    else {
        identifier = _sanitizeIdentifier(identifier);
    }
    return identifier;
}
/**
 * @param {?} compileIdentifier
 * @return {?}
 */
export function identifierModuleUrl(compileIdentifier) {
    var /** @type {?} */ ref = compileIdentifier.reference;
    if (ref instanceof StaticSymbol) {
        return ref.filePath;
    }
    return reflector.importUri(ref);
}
export var CompileSummaryKind = {};
CompileSummaryKind.Pipe = 0;
CompileSummaryKind.Directive = 1;
CompileSummaryKind.NgModule = 2;
CompileSummaryKind.Injectable = 3;
CompileSummaryKind[CompileSummaryKind.Pipe] = "Pipe";
CompileSummaryKind[CompileSummaryKind.Directive] = "Directive";
CompileSummaryKind[CompileSummaryKind.NgModule] = "NgModule";
CompileSummaryKind[CompileSummaryKind.Injectable] = "Injectable";
/**
 * @param {?} token
 * @return {?}
 */
export function tokenName(token) {
    return isPresent(token.value) ? _sanitizeIdentifier(token.value) :
        identifierName(token.identifier);
}
/**
 * @param {?} token
 * @return {?}
 */
export function tokenReference(token) {
    if (isPresent(token.identifier)) {
        return token.identifier.reference;
    }
    else {
        return token.value;
    }
}
/**
 *  Metadata about a stylesheet
 */
export var CompileStylesheetMetadata = (function () {
    /**
     * @param {?=} __0
     */
    function CompileStylesheetMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, moduleUrl = _b.moduleUrl, styles = _b.styles, styleUrls = _b.styleUrls;
        this.moduleUrl = moduleUrl;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
    }
    return CompileStylesheetMetadata;
}());
function CompileStylesheetMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileStylesheetMetadata.prototype.moduleUrl;
    /** @type {?} */
    CompileStylesheetMetadata.prototype.styles;
    /** @type {?} */
    CompileStylesheetMetadata.prototype.styleUrls;
}
/**
 *  Metadata regarding compilation of a template.
 */
export var CompileTemplateMetadata = (function () {
    /**
     * @param {?=} __0
     */
    function CompileTemplateMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, encapsulation = _b.encapsulation, template = _b.template, templateUrl = _b.templateUrl, styles = _b.styles, styleUrls = _b.styleUrls, externalStylesheets = _b.externalStylesheets, animations = _b.animations, ngContentSelectors = _b.ngContentSelectors, interpolation = _b.interpolation;
        this.encapsulation = encapsulation;
        this.template = template;
        this.templateUrl = templateUrl;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
        this.externalStylesheets = _normalizeArray(externalStylesheets);
        this.animations = animations ? ListWrapper.flatten(animations) : [];
        this.ngContentSelectors = ngContentSelectors || [];
        if (interpolation && interpolation.length != 2) {
            throw new Error("'interpolation' should have a start and an end symbol.");
        }
        this.interpolation = interpolation;
    }
    /**
     * @return {?}
     */
    CompileTemplateMetadata.prototype.toSummary = function () {
        return {
            animations: this.animations.map(function (anim) { return anim.name; }),
            ngContentSelectors: this.ngContentSelectors,
            encapsulation: this.encapsulation
        };
    };
    return CompileTemplateMetadata;
}());
function CompileTemplateMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileTemplateMetadata.prototype.encapsulation;
    /** @type {?} */
    CompileTemplateMetadata.prototype.template;
    /** @type {?} */
    CompileTemplateMetadata.prototype.templateUrl;
    /** @type {?} */
    CompileTemplateMetadata.prototype.styles;
    /** @type {?} */
    CompileTemplateMetadata.prototype.styleUrls;
    /** @type {?} */
    CompileTemplateMetadata.prototype.externalStylesheets;
    /** @type {?} */
    CompileTemplateMetadata.prototype.animations;
    /** @type {?} */
    CompileTemplateMetadata.prototype.ngContentSelectors;
    /** @type {?} */
    CompileTemplateMetadata.prototype.interpolation;
}
/**
 *  Metadata regarding compilation of a directive.
 */
export var CompileDirectiveMetadata = (function () {
    /**
     * @param {?=} __0
     */
    function CompileDirectiveMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, isHost = _b.isHost, type = _b.type, isComponent = _b.isComponent, selector = _b.selector, exportAs = _b.exportAs, changeDetection = _b.changeDetection, inputs = _b.inputs, outputs = _b.outputs, hostListeners = _b.hostListeners, hostProperties = _b.hostProperties, hostAttributes = _b.hostAttributes, providers = _b.providers, viewProviders = _b.viewProviders, queries = _b.queries, viewQueries = _b.viewQueries, entryComponents = _b.entryComponents, template = _b.template;
        this.isHost = !!isHost;
        this.type = type;
        this.isComponent = isComponent;
        this.selector = selector;
        this.exportAs = exportAs;
        this.changeDetection = changeDetection;
        this.inputs = inputs;
        this.outputs = outputs;
        this.hostListeners = hostListeners;
        this.hostProperties = hostProperties;
        this.hostAttributes = hostAttributes;
        this.providers = _normalizeArray(providers);
        this.viewProviders = _normalizeArray(viewProviders);
        this.queries = _normalizeArray(queries);
        this.viewQueries = _normalizeArray(viewQueries);
        this.entryComponents = _normalizeArray(entryComponents);
        this.template = template;
    }
    /**
     * @param {?=} __0
     * @return {?}
     */
    CompileDirectiveMetadata.create = function (_a) {
        var _b = _a === void 0 ? {} : _a, isHost = _b.isHost, type = _b.type, isComponent = _b.isComponent, selector = _b.selector, exportAs = _b.exportAs, changeDetection = _b.changeDetection, inputs = _b.inputs, outputs = _b.outputs, host = _b.host, providers = _b.providers, viewProviders = _b.viewProviders, queries = _b.queries, viewQueries = _b.viewQueries, entryComponents = _b.entryComponents, template = _b.template;
        var /** @type {?} */ hostListeners = {};
        var /** @type {?} */ hostProperties = {};
        var /** @type {?} */ hostAttributes = {};
        if (isPresent(host)) {
            Object.keys(host).forEach(function (key) {
                var /** @type {?} */ value = host[key];
                var /** @type {?} */ matches = key.match(HOST_REG_EXP);
                if (matches === null) {
                    hostAttributes[key] = value;
                }
                else if (isPresent(matches[1])) {
                    hostProperties[matches[1]] = value;
                }
                else if (isPresent(matches[2])) {
                    hostListeners[matches[2]] = value;
                }
            });
        }
        var /** @type {?} */ inputsMap = {};
        if (isPresent(inputs)) {
            inputs.forEach(function (bindConfig) {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                var /** @type {?} */ parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                inputsMap[parts[0]] = parts[1];
            });
        }
        var /** @type {?} */ outputsMap = {};
        if (isPresent(outputs)) {
            outputs.forEach(function (bindConfig) {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                var /** @type {?} */ parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                outputsMap[parts[0]] = parts[1];
            });
        }
        return new CompileDirectiveMetadata({
            isHost: isHost,
            type: type,
            isComponent: !!isComponent, selector: selector, exportAs: exportAs, changeDetection: changeDetection,
            inputs: inputsMap,
            outputs: outputsMap,
            hostListeners: hostListeners,
            hostProperties: hostProperties,
            hostAttributes: hostAttributes,
            providers: providers,
            viewProviders: viewProviders,
            queries: queries,
            viewQueries: viewQueries,
            entryComponents: entryComponents,
            template: template,
        });
    };
    /**
     * @return {?}
     */
    CompileDirectiveMetadata.prototype.toSummary = function () {
        return {
            summaryKind: CompileSummaryKind.Directive,
            type: this.type,
            isComponent: this.isComponent,
            selector: this.selector,
            exportAs: this.exportAs,
            inputs: this.inputs,
            outputs: this.outputs,
            hostListeners: this.hostListeners,
            hostProperties: this.hostProperties,
            hostAttributes: this.hostAttributes,
            providers: this.providers,
            viewProviders: this.viewProviders,
            queries: this.queries,
            entryComponents: this.entryComponents,
            changeDetection: this.changeDetection,
            template: this.template && this.template.toSummary()
        };
    };
    return CompileDirectiveMetadata;
}());
function CompileDirectiveMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileDirectiveMetadata.prototype.isHost;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.type;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.isComponent;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.selector;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.exportAs;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.changeDetection;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.inputs;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.outputs;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.hostListeners;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.hostProperties;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.hostAttributes;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.providers;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.viewProviders;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.queries;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.viewQueries;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.entryComponents;
    /** @type {?} */
    CompileDirectiveMetadata.prototype.template;
}
/**
 *  Construct {@link CompileDirectiveMetadata} from {@link ComponentTypeMetadata} and a selector.
 * @param {?} typeReference
 * @param {?} compMeta
 * @return {?}
 */
export function createHostComponentMeta(typeReference, compMeta) {
    var /** @type {?} */ template = CssSelector.parse(compMeta.selector)[0].getMatchingElementTemplate();
    return CompileDirectiveMetadata.create({
        isHost: true,
        type: { reference: typeReference, diDeps: [], lifecycleHooks: [] },
        template: new CompileTemplateMetadata({
            encapsulation: ViewEncapsulation.None,
            template: template,
            templateUrl: '',
            styles: [],
            styleUrls: [],
            ngContentSelectors: [],
            animations: []
        }),
        changeDetection: ChangeDetectionStrategy.Default,
        inputs: [],
        outputs: [],
        host: {},
        isComponent: true,
        selector: '*',
        providers: [],
        viewProviders: [],
        queries: [],
        viewQueries: []
    });
}
export var CompilePipeMetadata = (function () {
    /**
     * @param {?=} __0
     */
    function CompilePipeMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, type = _b.type, name = _b.name, pure = _b.pure;
        this.type = type;
        this.name = name;
        this.pure = !!pure;
    }
    /**
     * @return {?}
     */
    CompilePipeMetadata.prototype.toSummary = function () {
        return {
            summaryKind: CompileSummaryKind.Pipe,
            type: this.type,
            name: this.name,
            pure: this.pure
        };
    };
    return CompilePipeMetadata;
}());
function CompilePipeMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompilePipeMetadata.prototype.type;
    /** @type {?} */
    CompilePipeMetadata.prototype.name;
    /** @type {?} */
    CompilePipeMetadata.prototype.pure;
}
/**
 *  Metadata regarding compilation of a module.
 */
export var CompileNgModuleMetadata = (function () {
    /**
     * @param {?=} __0
     */
    function CompileNgModuleMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, type = _b.type, providers = _b.providers, declaredDirectives = _b.declaredDirectives, exportedDirectives = _b.exportedDirectives, declaredPipes = _b.declaredPipes, exportedPipes = _b.exportedPipes, entryComponents = _b.entryComponents, bootstrapComponents = _b.bootstrapComponents, importedModules = _b.importedModules, exportedModules = _b.exportedModules, schemas = _b.schemas, transitiveModule = _b.transitiveModule, id = _b.id;
        this.type = type;
        this.declaredDirectives = _normalizeArray(declaredDirectives);
        this.exportedDirectives = _normalizeArray(exportedDirectives);
        this.declaredPipes = _normalizeArray(declaredPipes);
        this.exportedPipes = _normalizeArray(exportedPipes);
        this.providers = _normalizeArray(providers);
        this.entryComponents = _normalizeArray(entryComponents);
        this.bootstrapComponents = _normalizeArray(bootstrapComponents);
        this.importedModules = _normalizeArray(importedModules);
        this.exportedModules = _normalizeArray(exportedModules);
        this.schemas = _normalizeArray(schemas);
        this.id = id;
        this.transitiveModule = transitiveModule;
    }
    /**
     * @return {?}
     */
    CompileNgModuleMetadata.prototype.toSummary = function () {
        return {
            summaryKind: CompileSummaryKind.NgModule,
            type: this.type,
            entryComponents: this.transitiveModule.entryComponents,
            providers: this.transitiveModule.providers,
            modules: this.transitiveModule.modules,
            exportedDirectives: this.transitiveModule.exportedDirectives,
            exportedPipes: this.transitiveModule.exportedPipes
        };
    };
    return CompileNgModuleMetadata;
}());
function CompileNgModuleMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileNgModuleMetadata.prototype.type;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.declaredDirectives;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.exportedDirectives;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.declaredPipes;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.exportedPipes;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.entryComponents;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.bootstrapComponents;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.providers;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.importedModules;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.exportedModules;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.schemas;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.id;
    /** @type {?} */
    CompileNgModuleMetadata.prototype.transitiveModule;
}
export var TransitiveCompileNgModuleMetadata = (function () {
    function TransitiveCompileNgModuleMetadata() {
        this.directivesSet = new Set();
        this.directives = [];
        this.exportedDirectivesSet = new Set();
        this.exportedDirectives = [];
        this.pipesSet = new Set();
        this.pipes = [];
        this.exportedPipesSet = new Set();
        this.exportedPipes = [];
        this.modulesSet = new Set();
        this.modules = [];
        this.entryComponentsSet = new Set();
        this.entryComponents = [];
        this.providers = [];
    }
    /**
     * @param {?} provider
     * @param {?} module
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addProvider = function (provider, module) {
        this.providers.push({ provider: provider, module: module });
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addDirective = function (id) {
        if (!this.directivesSet.has(id.reference)) {
            this.directivesSet.add(id.reference);
            this.directives.push(id);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addExportedDirective = function (id) {
        if (!this.exportedDirectivesSet.has(id.reference)) {
            this.exportedDirectivesSet.add(id.reference);
            this.exportedDirectives.push(id);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addPipe = function (id) {
        if (!this.pipesSet.has(id.reference)) {
            this.pipesSet.add(id.reference);
            this.pipes.push(id);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addExportedPipe = function (id) {
        if (!this.exportedPipesSet.has(id.reference)) {
            this.exportedPipesSet.add(id.reference);
            this.exportedPipes.push(id);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addModule = function (id) {
        if (!this.modulesSet.has(id.reference)) {
            this.modulesSet.add(id.reference);
            this.modules.push(id);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addEntryComponent = function (id) {
        if (!this.entryComponentsSet.has(id.reference)) {
            this.entryComponentsSet.add(id.reference);
            this.entryComponents.push(id);
        }
    };
    return TransitiveCompileNgModuleMetadata;
}());
function TransitiveCompileNgModuleMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.directivesSet;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.directives;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.exportedDirectivesSet;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.exportedDirectives;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.pipesSet;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.pipes;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.exportedPipesSet;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.exportedPipes;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.modulesSet;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.modules;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.entryComponentsSet;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.entryComponents;
    /** @type {?} */
    TransitiveCompileNgModuleMetadata.prototype.providers;
}
/**
 * @param {?} obj
 * @return {?}
 */
function _normalizeArray(obj) {
    return obj || [];
}
export var ProviderMeta = (function () {
    /**
     * @param {?} token
     * @param {?} __1
     */
    function ProviderMeta(token, _a) {
        var useClass = _a.useClass, useValue = _a.useValue, useExisting = _a.useExisting, useFactory = _a.useFactory, deps = _a.deps, multi = _a.multi;
        this.token = token;
        this.useClass = useClass;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory;
        this.dependencies = deps;
        this.multi = !!multi;
    }
    return ProviderMeta;
}());
function ProviderMeta_tsickle_Closure_declarations() {
    /** @type {?} */
    ProviderMeta.prototype.token;
    /** @type {?} */
    ProviderMeta.prototype.useClass;
    /** @type {?} */
    ProviderMeta.prototype.useValue;
    /** @type {?} */
    ProviderMeta.prototype.useExisting;
    /** @type {?} */
    ProviderMeta.prototype.useFactory;
    /** @type {?} */
    ProviderMeta.prototype.dependencies;
    /** @type {?} */
    ProviderMeta.prototype.multi;
}
//# sourceMappingURL=compile_metadata.js.map