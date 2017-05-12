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
import { tokenName, tokenReference } from './compile_metadata';
import { isBlank, isPresent } from './facade/lang';
import { Identifiers, resolveIdentifier } from './identifiers';
import { ParseError } from './parse_util';
import { ProviderAst, ProviderAstType } from './template_parser/template_ast';
export var ProviderError = (function (_super) {
    __extends(ProviderError, _super);
    /**
     * @param {?} message
     * @param {?} span
     */
    function ProviderError(message, span) {
        _super.call(this, span, message);
    }
    return ProviderError;
}(ParseError));
export var ProviderViewContext = (function () {
    /**
     * @param {?} component
     * @param {?} sourceSpan
     */
    function ProviderViewContext(component, sourceSpan) {
        var _this = this;
        this.component = component;
        this.sourceSpan = sourceSpan;
        this.errors = [];
        this.viewQueries = _getViewQueries(component);
        this.viewProviders = new Map();
        component.viewProviders.forEach(function (provider) {
            if (isBlank(_this.viewProviders.get(tokenReference(provider.token)))) {
                _this.viewProviders.set(tokenReference(provider.token), true);
            }
        });
    }
    return ProviderViewContext;
}());
function ProviderViewContext_tsickle_Closure_declarations() {
    /** @type {?} */
    ProviderViewContext.prototype.viewQueries;
    /** @type {?} */
    ProviderViewContext.prototype.viewProviders;
    /** @type {?} */
    ProviderViewContext.prototype.errors;
    /** @type {?} */
    ProviderViewContext.prototype.component;
    /** @type {?} */
    ProviderViewContext.prototype.sourceSpan;
}
export var ProviderElementContext = (function () {
    /**
     * @param {?} viewContext
     * @param {?} _parent
     * @param {?} _isViewRoot
     * @param {?} _directiveAsts
     * @param {?} attrs
     * @param {?} refs
     * @param {?} _sourceSpan
     */
    function ProviderElementContext(viewContext, _parent, _isViewRoot, _directiveAsts, attrs, refs, _sourceSpan) {
        var _this = this;
        this.viewContext = viewContext;
        this._parent = _parent;
        this._isViewRoot = _isViewRoot;
        this._directiveAsts = _directiveAsts;
        this._sourceSpan = _sourceSpan;
        this._transformedProviders = new Map();
        this._seenProviders = new Map();
        this._hasViewContainer = false;
        this._attrs = {};
        attrs.forEach(function (attrAst) { return _this._attrs[attrAst.name] = attrAst.value; });
        var directivesMeta = _directiveAsts.map(function (directiveAst) { return directiveAst.directive; });
        this._allProviders =
            _resolveProvidersFromDirectives(directivesMeta, _sourceSpan, viewContext.errors);
        this._contentQueries = _getContentQueries(directivesMeta);
        var queriedTokens = new Map();
        Array.from(this._allProviders.values()).forEach(function (provider) {
            _this._addQueryReadsTo(provider.token, queriedTokens);
        });
        refs.forEach(function (refAst) { _this._addQueryReadsTo({ value: refAst.name }, queriedTokens); });
        if (isPresent(queriedTokens.get(resolveIdentifier(Identifiers.ViewContainerRef)))) {
            this._hasViewContainer = true;
        }
        // create the providers that we know are eager first
        Array.from(this._allProviders.values()).forEach(function (provider) {
            var eager = provider.eager || isPresent(queriedTokens.get(tokenReference(provider.token)));
            if (eager) {
                _this._getOrCreateLocalProvider(provider.providerType, provider.token, true);
            }
        });
    }
    /**
     * @return {?}
     */
    ProviderElementContext.prototype.afterElement = function () {
        var _this = this;
        // collect lazy providers
        Array.from(this._allProviders.values()).forEach(function (provider) {
            _this._getOrCreateLocalProvider(provider.providerType, provider.token, false);
        });
    };
    Object.defineProperty(ProviderElementContext.prototype, "transformProviders", {
        /**
         * @return {?}
         */
        get: function () {
            return Array.from(this._transformedProviders.values());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "transformedDirectiveAsts", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ sortedProviderTypes = this.transformProviders.map(function (provider) { return provider.token.identifier; });
            var /** @type {?} */ sortedDirectives = this._directiveAsts.slice();
            sortedDirectives.sort(function (dir1, dir2) { return sortedProviderTypes.indexOf(dir1.directive.type) -
                sortedProviderTypes.indexOf(dir2.directive.type); });
            return sortedDirectives;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "transformedHasViewContainer", {
        /**
         * @return {?}
         */
        get: function () { return this._hasViewContainer; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} token
     * @param {?} queryReadTokens
     * @return {?}
     */
    ProviderElementContext.prototype._addQueryReadsTo = function (token, queryReadTokens) {
        this._getQueriesFor(token).forEach(function (query) {
            var /** @type {?} */ queryReadToken = query.read || token;
            if (isBlank(queryReadTokens.get(tokenReference(queryReadToken)))) {
                queryReadTokens.set(tokenReference(queryReadToken), true);
            }
        });
    };
    /**
     * @param {?} token
     * @return {?}
     */
    ProviderElementContext.prototype._getQueriesFor = function (token) {
        var /** @type {?} */ result = [];
        var /** @type {?} */ currentEl = this;
        var /** @type {?} */ distance = 0;
        var /** @type {?} */ queries;
        while (currentEl !== null) {
            queries = currentEl._contentQueries.get(tokenReference(token));
            if (isPresent(queries)) {
                result.push.apply(result, queries.filter(function (query) { return query.descendants || distance <= 1; }));
            }
            if (currentEl._directiveAsts.length > 0) {
                distance++;
            }
            currentEl = currentEl._parent;
        }
        queries = this.viewContext.viewQueries.get(tokenReference(token));
        if (isPresent(queries)) {
            result.push.apply(result, queries);
        }
        return result;
    };
    /**
     * @param {?} requestingProviderType
     * @param {?} token
     * @param {?} eager
     * @return {?}
     */
    ProviderElementContext.prototype._getOrCreateLocalProvider = function (requestingProviderType, token, eager) {
        var _this = this;
        var /** @type {?} */ resolvedProvider = this._allProviders.get(tokenReference(token));
        if (!resolvedProvider || ((requestingProviderType === ProviderAstType.Directive ||
            requestingProviderType === ProviderAstType.PublicService) &&
            resolvedProvider.providerType === ProviderAstType.PrivateService) ||
            ((requestingProviderType === ProviderAstType.PrivateService ||
                requestingProviderType === ProviderAstType.PublicService) &&
                resolvedProvider.providerType === ProviderAstType.Builtin)) {
            return null;
        }
        var /** @type {?} */ transformedProviderAst = this._transformedProviders.get(tokenReference(token));
        if (isPresent(transformedProviderAst)) {
            return transformedProviderAst;
        }
        if (isPresent(this._seenProviders.get(tokenReference(token)))) {
            this.viewContext.errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + tokenName(token), this._sourceSpan));
            return null;
        }
        this._seenProviders.set(tokenReference(token), true);
        var /** @type {?} */ transformedProviders = resolvedProvider.providers.map(function (provider) {
            var /** @type {?} */ transformedUseValue = provider.useValue;
            var /** @type {?} */ transformedUseExisting = provider.useExisting;
            var /** @type {?} */ transformedDeps;
            if (isPresent(provider.useExisting)) {
                var /** @type {?} */ existingDiDep = _this._getDependency(resolvedProvider.providerType, { token: provider.useExisting }, eager);
                if (isPresent(existingDiDep.token)) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = null;
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (isPresent(provider.useFactory)) {
                var /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
            }
            else if (isPresent(provider.useClass)) {
                var /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
            }
            return _transformProvider(provider, {
                useExisting: transformedUseExisting,
                useValue: transformedUseValue,
                deps: transformedDeps
            });
        });
        transformedProviderAst =
            _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
        this._transformedProviders.set(tokenReference(token), transformedProviderAst);
        return transformedProviderAst;
    };
    /**
     * @param {?} requestingProviderType
     * @param {?} dep
     * @param {?=} eager
     * @return {?}
     */
    ProviderElementContext.prototype._getLocalDependency = function (requestingProviderType, dep, eager) {
        if (eager === void 0) { eager = null; }
        if (dep.isAttribute) {
            var /** @type {?} */ attrValue = this._attrs[dep.token.value];
            return { isValue: true, value: attrValue == null ? null : attrValue };
        }
        if (isPresent(dep.token)) {
            // access builtints
            if ((requestingProviderType === ProviderAstType.Directive ||
                requestingProviderType === ProviderAstType.Component)) {
                if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Renderer) ||
                    tokenReference(dep.token) === resolveIdentifier(Identifiers.ElementRef) ||
                    tokenReference(dep.token) === resolveIdentifier(Identifiers.ChangeDetectorRef) ||
                    tokenReference(dep.token) === resolveIdentifier(Identifiers.TemplateRef)) {
                    return dep;
                }
                if (tokenReference(dep.token) === resolveIdentifier(Identifiers.ViewContainerRef)) {
                    this._hasViewContainer = true;
                }
            }
            // access the injector
            if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Injector)) {
                return dep;
            }
            // access providers
            if (isPresent(this._getOrCreateLocalProvider(requestingProviderType, dep.token, eager))) {
                return dep;
            }
        }
        return null;
    };
    /**
     * @param {?} requestingProviderType
     * @param {?} dep
     * @param {?=} eager
     * @return {?}
     */
    ProviderElementContext.prototype._getDependency = function (requestingProviderType, dep, eager) {
        if (eager === void 0) { eager = null; }
        var /** @type {?} */ currElement = this;
        var /** @type {?} */ currEager = eager;
        var /** @type {?} */ result = null;
        if (!dep.isSkipSelf) {
            result = this._getLocalDependency(requestingProviderType, dep, eager);
        }
        if (dep.isSelf) {
            if (!result && dep.isOptional) {
                result = { isValue: true, value: null };
            }
        }
        else {
            // check parent elements
            while (!result && isPresent(currElement._parent)) {
                var /** @type {?} */ prevElement = currElement;
                currElement = currElement._parent;
                if (prevElement._isViewRoot) {
                    currEager = false;
                }
                result = currElement._getLocalDependency(ProviderAstType.PublicService, dep, currEager);
            }
            // check @Host restriction
            if (!result) {
                if (!dep.isHost || this.viewContext.component.isHost ||
                    this.viewContext.component.type.reference === tokenReference(dep.token) ||
                    isPresent(this.viewContext.viewProviders.get(tokenReference(dep.token)))) {
                    result = dep;
                }
                else {
                    result = dep.isOptional ? result = { isValue: true, value: null } : null;
                }
            }
        }
        if (!result) {
            this.viewContext.errors.push(new ProviderError("No provider for " + tokenName(dep.token), this._sourceSpan));
        }
        return result;
    };
    return ProviderElementContext;
}());
function ProviderElementContext_tsickle_Closure_declarations() {
    /** @type {?} */
    ProviderElementContext.prototype._contentQueries;
    /** @type {?} */
    ProviderElementContext.prototype._transformedProviders;
    /** @type {?} */
    ProviderElementContext.prototype._seenProviders;
    /** @type {?} */
    ProviderElementContext.prototype._allProviders;
    /** @type {?} */
    ProviderElementContext.prototype._attrs;
    /** @type {?} */
    ProviderElementContext.prototype._hasViewContainer;
    /** @type {?} */
    ProviderElementContext.prototype.viewContext;
    /** @type {?} */
    ProviderElementContext.prototype._parent;
    /** @type {?} */
    ProviderElementContext.prototype._isViewRoot;
    /** @type {?} */
    ProviderElementContext.prototype._directiveAsts;
    /** @type {?} */
    ProviderElementContext.prototype._sourceSpan;
}
export var NgModuleProviderAnalyzer = (function () {
    /**
     * @param {?} ngModule
     * @param {?} extraProviders
     * @param {?} sourceSpan
     */
    function NgModuleProviderAnalyzer(ngModule, extraProviders, sourceSpan) {
        var _this = this;
        this._transformedProviders = new Map();
        this._seenProviders = new Map();
        this._errors = [];
        this._allProviders = new Map();
        ngModule.transitiveModule.modules.forEach(function (ngModuleType) {
            var ngModuleProvider = { token: { identifier: ngModuleType }, useClass: ngModuleType };
            _resolveProviders([ngModuleProvider], ProviderAstType.PublicService, true, sourceSpan, _this._errors, _this._allProviders);
        });
        _resolveProviders(ngModule.transitiveModule.providers.map(function (entry) { return entry.provider; }).concat(extraProviders), ProviderAstType.PublicService, false, sourceSpan, this._errors, this._allProviders);
    }
    /**
     * @return {?}
     */
    NgModuleProviderAnalyzer.prototype.parse = function () {
        var _this = this;
        Array.from(this._allProviders.values()).forEach(function (provider) {
            _this._getOrCreateLocalProvider(provider.token, provider.eager);
        });
        if (this._errors.length > 0) {
            var /** @type {?} */ errorString = this._errors.join('\n');
            throw new Error("Provider parse errors:\n" + errorString);
        }
        return Array.from(this._transformedProviders.values());
    };
    /**
     * @param {?} token
     * @param {?} eager
     * @return {?}
     */
    NgModuleProviderAnalyzer.prototype._getOrCreateLocalProvider = function (token, eager) {
        var _this = this;
        var /** @type {?} */ resolvedProvider = this._allProviders.get(tokenReference(token));
        if (!resolvedProvider) {
            return null;
        }
        var /** @type {?} */ transformedProviderAst = this._transformedProviders.get(tokenReference(token));
        if (isPresent(transformedProviderAst)) {
            return transformedProviderAst;
        }
        if (isPresent(this._seenProviders.get(tokenReference(token)))) {
            this._errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + tokenName(token), resolvedProvider.sourceSpan));
            return null;
        }
        this._seenProviders.set(tokenReference(token), true);
        var /** @type {?} */ transformedProviders = resolvedProvider.providers.map(function (provider) {
            var /** @type {?} */ transformedUseValue = provider.useValue;
            var /** @type {?} */ transformedUseExisting = provider.useExisting;
            var /** @type {?} */ transformedDeps;
            if (isPresent(provider.useExisting)) {
                var /** @type {?} */ existingDiDep = _this._getDependency({ token: provider.useExisting }, eager, resolvedProvider.sourceSpan);
                if (isPresent(existingDiDep.token)) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = null;
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (isPresent(provider.useFactory)) {
                var /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(dep, eager, resolvedProvider.sourceSpan); });
            }
            else if (isPresent(provider.useClass)) {
                var /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(dep, eager, resolvedProvider.sourceSpan); });
            }
            return _transformProvider(provider, {
                useExisting: transformedUseExisting,
                useValue: transformedUseValue,
                deps: transformedDeps
            });
        });
        transformedProviderAst =
            _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
        this._transformedProviders.set(tokenReference(token), transformedProviderAst);
        return transformedProviderAst;
    };
    /**
     * @param {?} dep
     * @param {?=} eager
     * @param {?} requestorSourceSpan
     * @return {?}
     */
    NgModuleProviderAnalyzer.prototype._getDependency = function (dep, eager, requestorSourceSpan) {
        if (eager === void 0) { eager = null; }
        var /** @type {?} */ foundLocal = false;
        if (!dep.isSkipSelf && isPresent(dep.token)) {
            // access the injector
            if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Injector) ||
                tokenReference(dep.token) === resolveIdentifier(Identifiers.ComponentFactoryResolver)) {
                foundLocal = true;
            }
            else if (isPresent(this._getOrCreateLocalProvider(dep.token, eager))) {
                foundLocal = true;
            }
        }
        var /** @type {?} */ result = dep;
        if (dep.isSelf && !foundLocal) {
            if (dep.isOptional) {
                result = { isValue: true, value: null };
            }
            else {
                this._errors.push(new ProviderError("No provider for " + tokenName(dep.token), requestorSourceSpan));
            }
        }
        return result;
    };
    return NgModuleProviderAnalyzer;
}());
function NgModuleProviderAnalyzer_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleProviderAnalyzer.prototype._transformedProviders;
    /** @type {?} */
    NgModuleProviderAnalyzer.prototype._seenProviders;
    /** @type {?} */
    NgModuleProviderAnalyzer.prototype._allProviders;
    /** @type {?} */
    NgModuleProviderAnalyzer.prototype._errors;
}
/**
 * @param {?} provider
 * @param {?} __1
 * @return {?}
 */
function _transformProvider(provider, _a) {
    var useExisting = _a.useExisting, useValue = _a.useValue, deps = _a.deps;
    return {
        token: provider.token,
        useClass: provider.useClass,
        useExisting: useExisting,
        useFactory: provider.useFactory,
        useValue: useValue,
        deps: deps,
        multi: provider.multi
    };
}
/**
 * @param {?} provider
 * @param {?} __1
 * @return {?}
 */
function _transformProviderAst(provider, _a) {
    var eager = _a.eager, providers = _a.providers;
    return new ProviderAst(provider.token, provider.multiProvider, provider.eager || eager, providers, provider.providerType, provider.lifecycleHooks, provider.sourceSpan);
}
/**
 * @param {?} directives
 * @param {?} sourceSpan
 * @param {?} targetErrors
 * @return {?}
 */
function _resolveProvidersFromDirectives(directives, sourceSpan, targetErrors) {
    var /** @type {?} */ providersByToken = new Map();
    directives.forEach(function (directive) {
        var /** @type {?} */ dirProvider = { token: { identifier: directive.type }, useClass: directive.type };
        _resolveProviders([dirProvider], directive.isComponent ? ProviderAstType.Component : ProviderAstType.Directive, true, sourceSpan, targetErrors, providersByToken);
    });
    // Note: directives need to be able to overwrite providers of a component!
    var /** @type {?} */ directivesWithComponentFirst = directives.filter(function (dir) { return dir.isComponent; }).concat(directives.filter(function (dir) { return !dir.isComponent; }));
    directivesWithComponentFirst.forEach(function (directive) {
        _resolveProviders(directive.providers, ProviderAstType.PublicService, false, sourceSpan, targetErrors, providersByToken);
        _resolveProviders(directive.viewProviders, ProviderAstType.PrivateService, false, sourceSpan, targetErrors, providersByToken);
    });
    return providersByToken;
}
/**
 * @param {?} providers
 * @param {?} providerType
 * @param {?} eager
 * @param {?} sourceSpan
 * @param {?} targetErrors
 * @param {?} targetProvidersByToken
 * @return {?}
 */
function _resolveProviders(providers, providerType, eager, sourceSpan, targetErrors, targetProvidersByToken) {
    providers.forEach(function (provider) {
        var /** @type {?} */ resolvedProvider = targetProvidersByToken.get(tokenReference(provider.token));
        if (isPresent(resolvedProvider) && !!resolvedProvider.multiProvider !== !!provider.multi) {
            targetErrors.push(new ProviderError("Mixing multi and non multi provider is not possible for token " + tokenName(resolvedProvider.token), sourceSpan));
        }
        if (!resolvedProvider) {
            var /** @type {?} */ lifecycleHooks = provider.token.identifier &&
                ((provider.token.identifier)).lifecycleHooks ?
                ((provider.token.identifier)).lifecycleHooks :
                [];
            resolvedProvider = new ProviderAst(provider.token, provider.multi, eager || lifecycleHooks.length > 0, [provider], providerType, lifecycleHooks, sourceSpan);
            targetProvidersByToken.set(tokenReference(provider.token), resolvedProvider);
        }
        else {
            if (!provider.multi) {
                resolvedProvider.providers.length = 0;
            }
            resolvedProvider.providers.push(provider);
        }
    });
}
/**
 * @param {?} component
 * @return {?}
 */
function _getViewQueries(component) {
    var /** @type {?} */ viewQueries = new Map();
    if (isPresent(component.viewQueries)) {
        component.viewQueries.forEach(function (query) { return _addQueryToTokenMap(viewQueries, query); });
    }
    return viewQueries;
}
/**
 * @param {?} directives
 * @return {?}
 */
function _getContentQueries(directives) {
    var /** @type {?} */ contentQueries = new Map();
    directives.forEach(function (directive) {
        if (isPresent(directive.queries)) {
            directive.queries.forEach(function (query) { return _addQueryToTokenMap(contentQueries, query); });
        }
    });
    return contentQueries;
}
/**
 * @param {?} map
 * @param {?} query
 * @return {?}
 */
function _addQueryToTokenMap(map, query) {
    query.selectors.forEach(function (token) {
        var /** @type {?} */ entry = map.get(tokenReference(token));
        if (!entry) {
            entry = [];
            map.set(tokenReference(token), entry);
        }
        entry.push(query);
    });
}
//# sourceMappingURL=provider_analyzer.js.map