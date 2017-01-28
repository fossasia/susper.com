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
import { tokenName, tokenReference } from '../compile_metadata';
import { createDiTokenExpression } from '../compiler_util/identifier_util';
import { DirectiveWrapperCompiler, DirectiveWrapperExpressions } from '../directive_wrapper_compiler';
import { isPresent } from '../facade/lang';
import { Identifiers, createIdentifier, createIdentifierToken, identifierToken, resolveIdentifier } from '../identifiers';
import * as o from '../output/output_ast';
import { convertValueToOutputAst } from '../output/value_util';
import { ProviderAst, ProviderAstType } from '../template_parser/template_ast';
import { CompileMethod } from './compile_method';
import { CompileQuery, addQueryToTokenMap, createQueryList } from './compile_query';
import { InjectMethodVars } from './constants';
import { ComponentFactoryDependency, DirectiveWrapperDependency } from './deps';
import { getPropertyInView, injectFromViewParentInjector } from './util';
export var CompileNode = (function () {
    /**
     * @param {?} parent
     * @param {?} view
     * @param {?} nodeIndex
     * @param {?} renderNode
     * @param {?} sourceAst
     */
    function CompileNode(parent, view, nodeIndex, renderNode, sourceAst) {
        this.parent = parent;
        this.view = view;
        this.nodeIndex = nodeIndex;
        this.renderNode = renderNode;
        this.sourceAst = sourceAst;
    }
    /**
     * @return {?}
     */
    CompileNode.prototype.isNull = function () { return !this.renderNode; };
    /**
     * @return {?}
     */
    CompileNode.prototype.isRootElement = function () { return this.view != this.parent.view; };
    return CompileNode;
}());
function CompileNode_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileNode.prototype.parent;
    /** @type {?} */
    CompileNode.prototype.view;
    /** @type {?} */
    CompileNode.prototype.nodeIndex;
    /** @type {?} */
    CompileNode.prototype.renderNode;
    /** @type {?} */
    CompileNode.prototype.sourceAst;
}
export var CompileElement = (function (_super) {
    __extends(CompileElement, _super);
    /**
     * @param {?} parent
     * @param {?} view
     * @param {?} nodeIndex
     * @param {?} renderNode
     * @param {?} sourceAst
     * @param {?} component
     * @param {?} _directives
     * @param {?} _resolvedProvidersArray
     * @param {?} hasViewContainer
     * @param {?} hasEmbeddedView
     * @param {?} references
     */
    function CompileElement(parent, view, nodeIndex, renderNode, sourceAst, component, _directives, _resolvedProvidersArray, hasViewContainer, hasEmbeddedView, references) {
        var _this = this;
        _super.call(this, parent, view, nodeIndex, renderNode, sourceAst);
        this.component = component;
        this._directives = _directives;
        this._resolvedProvidersArray = _resolvedProvidersArray;
        this.hasViewContainer = hasViewContainer;
        this.hasEmbeddedView = hasEmbeddedView;
        this.compViewExpr = null;
        this.instances = new Map();
        this.directiveWrapperInstance = new Map();
        this._queryCount = 0;
        this._queries = new Map();
        this.contentNodesByNgContentIndex = null;
        this.referenceTokens = {};
        references.forEach(function (ref) { return _this.referenceTokens[ref.name] = ref.value; });
        this.elementRef =
            o.importExpr(createIdentifier(Identifiers.ElementRef)).instantiate([this.renderNode]);
        this.instances.set(resolveIdentifier(Identifiers.ElementRef), this.elementRef);
        this.instances.set(resolveIdentifier(Identifiers.Injector), o.THIS_EXPR.callMethod('injector', [o.literal(this.nodeIndex)]));
        this.instances.set(resolveIdentifier(Identifiers.Renderer), o.THIS_EXPR.prop('renderer'));
        if (this.hasViewContainer || this.hasEmbeddedView) {
            this._createViewContainer();
        }
        if (this.component) {
            this._createComponentFactoryResolver();
        }
    }
    /**
     * @return {?}
     */
    CompileElement.createNull = function () {
        return new CompileElement(null, null, null, null, null, null, [], [], false, false, []);
    };
    /**
     * @return {?}
     */
    CompileElement.prototype._createViewContainer = function () {
        var /** @type {?} */ fieldName = "_vc_" + this.nodeIndex;
        var /** @type {?} */ parentNodeIndex = this.isRootElement() ? null : this.parent.nodeIndex;
        // private is fine here as no child view will reference a ViewContainer
        this.view.fields.push(new o.ClassField(fieldName, o.importType(createIdentifier(Identifiers.ViewContainer)), [o.StmtModifier.Private]));
        var /** @type {?} */ statement = o.THIS_EXPR.prop(fieldName)
            .set(o.importExpr(createIdentifier(Identifiers.ViewContainer)).instantiate([
            o.literal(this.nodeIndex), o.literal(parentNodeIndex), o.THIS_EXPR, this.renderNode
        ]))
            .toStmt();
        this.view.createMethod.addStmt(statement);
        this.viewContainer = o.THIS_EXPR.prop(fieldName);
        this.instances.set(resolveIdentifier(Identifiers.ViewContainer), this.viewContainer);
        this.view.viewContainers.push(this.viewContainer);
    };
    /**
     * @return {?}
     */
    CompileElement.prototype._createComponentFactoryResolver = function () {
        var _this = this;
        var /** @type {?} */ entryComponents = this.component.entryComponents.map(function (entryComponent) {
            var /** @type {?} */ id = { reference: null };
            _this.view.targetDependencies.push(new ComponentFactoryDependency(entryComponent, id));
            return id;
        });
        if (!entryComponents || entryComponents.length === 0) {
            return;
        }
        var /** @type {?} */ createComponentFactoryResolverExpr = o.importExpr(createIdentifier(Identifiers.CodegenComponentFactoryResolver)).instantiate([
            o.literalArr(entryComponents.map(function (entryComponent) { return o.importExpr(entryComponent); })),
            injectFromViewParentInjector(this.view, createIdentifierToken(Identifiers.ComponentFactoryResolver), false)
        ]);
        var /** @type {?} */ provider = {
            token: createIdentifierToken(Identifiers.ComponentFactoryResolver),
            useValue: createComponentFactoryResolverExpr
        };
        // Add ComponentFactoryResolver as first provider as it does not have deps on other providers
        // ProviderAstType.PrivateService as only the component and its view can see it,
        // but nobody else
        this._resolvedProvidersArray.unshift(new ProviderAst(provider.token, false, true, [provider], ProviderAstType.PrivateService, [], this.sourceAst.sourceSpan));
    };
    /**
     * @param {?} compViewExpr
     * @return {?}
     */
    CompileElement.prototype.setComponentView = function (compViewExpr) {
        this.compViewExpr = compViewExpr;
        this.contentNodesByNgContentIndex =
            new Array(this.component.template.ngContentSelectors.length);
        for (var /** @type {?} */ i = 0; i < this.contentNodesByNgContentIndex.length; i++) {
            this.contentNodesByNgContentIndex[i] = [];
        }
    };
    /**
     * @param {?} embeddedView
     * @return {?}
     */
    CompileElement.prototype.setEmbeddedView = function (embeddedView) {
        this.embeddedView = embeddedView;
        if (isPresent(embeddedView)) {
            var /** @type {?} */ createTemplateRefExpr = o.importExpr(createIdentifier(Identifiers.TemplateRef_)).instantiate([
                o.THIS_EXPR, o.literal(this.nodeIndex), this.renderNode
            ]);
            var /** @type {?} */ provider = {
                token: createIdentifierToken(Identifiers.TemplateRef),
                useValue: createTemplateRefExpr
            };
            // Add TemplateRef as first provider as it does not have deps on other providers
            this._resolvedProvidersArray.unshift(new ProviderAst(provider.token, false, true, [provider], ProviderAstType.Builtin, [], this.sourceAst.sourceSpan));
        }
    };
    /**
     * @return {?}
     */
    CompileElement.prototype.beforeChildren = function () {
        var _this = this;
        if (this.hasViewContainer) {
            this.instances.set(resolveIdentifier(Identifiers.ViewContainerRef), this.viewContainer.prop('vcRef'));
        }
        this._resolvedProviders = new Map();
        this._resolvedProvidersArray.forEach(function (provider) { return _this._resolvedProviders.set(tokenReference(provider.token), provider); });
        // create all the provider instances, some in the view constructor,
        // some as getters. We rely on the fact that they are already sorted topologically.
        Array.from(this._resolvedProviders.values()).forEach(function (resolvedProvider) {
            var /** @type {?} */ isDirectiveWrapper = resolvedProvider.providerType === ProviderAstType.Component ||
                resolvedProvider.providerType === ProviderAstType.Directive;
            var /** @type {?} */ providerValueExpressions = resolvedProvider.providers.map(function (provider) {
                if (provider.useExisting) {
                    return _this._getDependency(resolvedProvider.providerType, { token: provider.useExisting });
                }
                else if (provider.useFactory) {
                    var /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
                    var /** @type {?} */ depsExpr = deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep); });
                    return o.importExpr(provider.useFactory).callFn(depsExpr);
                }
                else if (provider.useClass) {
                    var /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
                    var /** @type {?} */ depsExpr = deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep); });
                    if (isDirectiveWrapper) {
                        var /** @type {?} */ directiveWrapperIdentifier = { reference: null };
                        _this.view.targetDependencies.push(new DirectiveWrapperDependency(provider.useClass, DirectiveWrapperCompiler.dirWrapperClassName(provider.useClass), directiveWrapperIdentifier));
                        return DirectiveWrapperExpressions.create(directiveWrapperIdentifier, depsExpr);
                    }
                    else {
                        return o.importExpr(provider.useClass)
                            .instantiate(depsExpr, o.importType(provider.useClass));
                    }
                }
                else {
                    return convertValueToOutputAst(provider.useValue);
                }
            });
            var /** @type {?} */ propName = "_" + tokenName(resolvedProvider.token) + "_" + _this.nodeIndex + "_" + _this.instances.size;
            var /** @type {?} */ instance = createProviderProperty(propName, resolvedProvider, providerValueExpressions, resolvedProvider.multiProvider, resolvedProvider.eager, _this);
            if (isDirectiveWrapper) {
                _this.directiveWrapperInstance.set(tokenReference(resolvedProvider.token), instance);
                _this.instances.set(tokenReference(resolvedProvider.token), DirectiveWrapperExpressions.context(instance));
            }
            else {
                _this.instances.set(tokenReference(resolvedProvider.token), instance);
            }
        });
        var _loop_1 = function(i) {
            var /** @type {?} */ directive = this_1._directives[i];
            var /** @type {?} */ directiveInstance = this_1.instances.get(tokenReference(identifierToken(directive.type)));
            directive.queries.forEach(function (queryMeta) { _this._addQuery(queryMeta, directiveInstance); });
        };
        var this_1 = this;
        for (var /** @type {?} */ i = 0; i < this._directives.length; i++) {
            _loop_1(i);
        }
        var /** @type {?} */ queriesWithReads = [];
        Array.from(this._resolvedProviders.values()).forEach(function (resolvedProvider) {
            var /** @type {?} */ queriesForProvider = _this._getQueriesFor(resolvedProvider.token);
            queriesWithReads.push.apply(queriesWithReads, queriesForProvider.map(function (query) { return new _QueryWithRead(query, resolvedProvider.token); }));
        });
        Object.keys(this.referenceTokens).forEach(function (varName) {
            var /** @type {?} */ token = _this.referenceTokens[varName];
            var /** @type {?} */ varValue;
            if (token) {
                varValue = _this.instances.get(tokenReference(token));
            }
            else {
                varValue = _this.renderNode;
            }
            _this.view.locals.set(varName, varValue);
            var /** @type {?} */ varToken = { value: varName };
            queriesWithReads.push.apply(queriesWithReads, _this._getQueriesFor(varToken).map(function (query) { return new _QueryWithRead(query, varToken); }));
        });
        queriesWithReads.forEach(function (queryWithRead) {
            var /** @type {?} */ value;
            if (isPresent(queryWithRead.read.identifier)) {
                // query for an identifier
                value = _this.instances.get(tokenReference(queryWithRead.read));
            }
            else {
                // query for a reference
                var /** @type {?} */ token = _this.referenceTokens[queryWithRead.read.value];
                if (isPresent(token)) {
                    value = _this.instances.get(tokenReference(token));
                }
                else {
                    value = _this.elementRef;
                }
            }
            if (isPresent(value)) {
                queryWithRead.query.addValue(value, _this.view);
            }
        });
    };
    /**
     * @param {?} childNodeCount
     * @return {?}
     */
    CompileElement.prototype.afterChildren = function (childNodeCount) {
        var _this = this;
        Array.from(this._resolvedProviders.values()).forEach(function (resolvedProvider) {
            // Note: afterChildren is called after recursing into children.
            // This is good so that an injector match in an element that is closer to a requesting element
            // matches first.
            var /** @type {?} */ providerExpr = _this.instances.get(tokenReference(resolvedProvider.token));
            // Note: view providers are only visible on the injector of that element.
            // This is not fully correct as the rules during codegen don't allow a directive
            // to get hold of a view provdier on the same element. We still do this semantic
            // as it simplifies our model to having only one runtime injector per element.
            var /** @type {?} */ providerChildNodeCount = resolvedProvider.providerType === ProviderAstType.PrivateService ? 0 : childNodeCount;
            _this.view.injectorGetMethod.addStmt(createInjectInternalCondition(_this.nodeIndex, providerChildNodeCount, resolvedProvider, providerExpr));
        });
        Array.from(this._queries.values())
            .forEach(function (queries) { return queries.forEach(function (q) {
            return q.afterChildren(_this.view.createMethod, _this.view.updateContentQueriesMethod);
        }); });
    };
    /**
     * @param {?} ngContentIndex
     * @param {?} nodeExpr
     * @return {?}
     */
    CompileElement.prototype.addContentNode = function (ngContentIndex, nodeExpr) {
        this.contentNodesByNgContentIndex[ngContentIndex].push(nodeExpr);
    };
    /**
     * @return {?}
     */
    CompileElement.prototype.getComponent = function () {
        return isPresent(this.component) ?
            this.instances.get(tokenReference(identifierToken(this.component.type))) :
            null;
    };
    /**
     * @return {?}
     */
    CompileElement.prototype.getProviderTokens = function () {
        return Array.from(this._resolvedProviders.values())
            .map(function (resolvedProvider) { return createDiTokenExpression(resolvedProvider.token); });
    };
    /**
     * @param {?} token
     * @return {?}
     */
    CompileElement.prototype._getQueriesFor = function (token) {
        var /** @type {?} */ result = [];
        var /** @type {?} */ currentEl = this;
        var /** @type {?} */ distance = 0;
        var /** @type {?} */ queries;
        while (!currentEl.isNull()) {
            queries = currentEl._queries.get(tokenReference(token));
            if (isPresent(queries)) {
                result.push.apply(result, queries.filter(function (query) { return query.meta.descendants || distance <= 1; }));
            }
            if (currentEl._directives.length > 0) {
                distance++;
            }
            currentEl = currentEl.parent;
        }
        queries = this.view.componentView.viewQueries.get(tokenReference(token));
        if (isPresent(queries)) {
            result.push.apply(result, queries);
        }
        return result;
    };
    /**
     * @param {?} queryMeta
     * @param {?} directiveInstance
     * @return {?}
     */
    CompileElement.prototype._addQuery = function (queryMeta, directiveInstance) {
        var /** @type {?} */ propName = "_query_" + tokenName(queryMeta.selectors[0]) + "_" + this.nodeIndex + "_" + this._queryCount++;
        var /** @type {?} */ queryList = createQueryList(queryMeta, directiveInstance, propName, this.view);
        var /** @type {?} */ query = new CompileQuery(queryMeta, queryList, directiveInstance, this.view);
        addQueryToTokenMap(this._queries, query);
        return query;
    };
    /**
     * @param {?} requestingProviderType
     * @param {?} dep
     * @return {?}
     */
    CompileElement.prototype._getLocalDependency = function (requestingProviderType, dep) {
        var /** @type {?} */ result = null;
        if (isPresent(dep.token)) {
            // access builtins with special visibility
            if (!result) {
                if (tokenReference(dep.token) === resolveIdentifier(Identifiers.ChangeDetectorRef)) {
                    if (requestingProviderType === ProviderAstType.Component) {
                        return this.compViewExpr.prop('ref');
                    }
                    else {
                        return getPropertyInView(o.THIS_EXPR.prop('ref'), this.view, this.view.componentView);
                    }
                }
            }
            // access regular providers on the element
            if (!result) {
                var /** @type {?} */ resolvedProvider = this._resolvedProviders.get(tokenReference(dep.token));
                // don't allow directives / public services to access private services.
                // only components and private services can access private services.
                if (resolvedProvider && (requestingProviderType === ProviderAstType.Directive ||
                    requestingProviderType === ProviderAstType.PublicService) &&
                    resolvedProvider.providerType === ProviderAstType.PrivateService) {
                    return null;
                }
                result = this.instances.get(tokenReference(dep.token));
            }
        }
        return result;
    };
    /**
     * @param {?} requestingProviderType
     * @param {?} dep
     * @return {?}
     */
    CompileElement.prototype._getDependency = function (requestingProviderType, dep) {
        var /** @type {?} */ currElement = this;
        var /** @type {?} */ result = null;
        if (dep.isValue) {
            result = o.literal(dep.value);
        }
        if (!result && !dep.isSkipSelf) {
            result = this._getLocalDependency(requestingProviderType, dep);
        }
        // check parent elements
        while (!result && !currElement.parent.isNull()) {
            currElement = currElement.parent;
            result = currElement._getLocalDependency(ProviderAstType.PublicService, { token: dep.token });
        }
        if (!result) {
            result = injectFromViewParentInjector(this.view, dep.token, dep.isOptional);
        }
        if (!result) {
            result = o.NULL_EXPR;
        }
        return getPropertyInView(result, this.view, currElement.view);
    };
    return CompileElement;
}(CompileNode));
function CompileElement_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileElement.prototype.compViewExpr;
    /** @type {?} */
    CompileElement.prototype.viewContainer;
    /** @type {?} */
    CompileElement.prototype.elementRef;
    /** @type {?} */
    CompileElement.prototype.instances;
    /** @type {?} */
    CompileElement.prototype.directiveWrapperInstance;
    /** @type {?} */
    CompileElement.prototype._resolvedProviders;
    /** @type {?} */
    CompileElement.prototype._queryCount;
    /** @type {?} */
    CompileElement.prototype._queries;
    /** @type {?} */
    CompileElement.prototype.contentNodesByNgContentIndex;
    /** @type {?} */
    CompileElement.prototype.embeddedView;
    /** @type {?} */
    CompileElement.prototype.referenceTokens;
    /** @type {?} */
    CompileElement.prototype.component;
    /** @type {?} */
    CompileElement.prototype._directives;
    /** @type {?} */
    CompileElement.prototype._resolvedProvidersArray;
    /** @type {?} */
    CompileElement.prototype.hasViewContainer;
    /** @type {?} */
    CompileElement.prototype.hasEmbeddedView;
}
/**
 * @param {?} nodeIndex
 * @param {?} childNodeCount
 * @param {?} provider
 * @param {?} providerExpr
 * @return {?}
 */
function createInjectInternalCondition(nodeIndex, childNodeCount, provider, providerExpr) {
    var /** @type {?} */ indexCondition;
    if (childNodeCount > 0) {
        indexCondition = o.literal(nodeIndex)
            .lowerEquals(InjectMethodVars.requestNodeIndex)
            .and(InjectMethodVars.requestNodeIndex.lowerEquals(o.literal(nodeIndex + childNodeCount)));
    }
    else {
        indexCondition = o.literal(nodeIndex).identical(InjectMethodVars.requestNodeIndex);
    }
    return new o.IfStmt(InjectMethodVars.token.identical(createDiTokenExpression(provider.token)).and(indexCondition), [new o.ReturnStatement(providerExpr)]);
}
/**
 * @param {?} propName
 * @param {?} provider
 * @param {?} providerValueExpressions
 * @param {?} isMulti
 * @param {?} isEager
 * @param {?} compileElement
 * @return {?}
 */
function createProviderProperty(propName, provider, providerValueExpressions, isMulti, isEager, compileElement) {
    var /** @type {?} */ view = compileElement.view;
    var /** @type {?} */ resolvedProviderValueExpr;
    var /** @type {?} */ type;
    if (isMulti) {
        resolvedProviderValueExpr = o.literalArr(providerValueExpressions);
        type = new o.ArrayType(o.DYNAMIC_TYPE);
    }
    else {
        resolvedProviderValueExpr = providerValueExpressions[0];
        type = providerValueExpressions[0].type;
    }
    if (!type) {
        type = o.DYNAMIC_TYPE;
    }
    if (isEager) {
        view.fields.push(new o.ClassField(propName, type));
        view.createMethod.addStmt(o.THIS_EXPR.prop(propName).set(resolvedProviderValueExpr).toStmt());
    }
    else {
        var /** @type {?} */ internalField = "_" + propName;
        view.fields.push(new o.ClassField(internalField, type));
        var /** @type {?} */ getter = new CompileMethod(view);
        getter.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
        // Note: Equals is important for JS so that it also checks the undefined case!
        getter.addStmt(new o.IfStmt(o.THIS_EXPR.prop(internalField).isBlank(), [o.THIS_EXPR.prop(internalField).set(resolvedProviderValueExpr).toStmt()]));
        getter.addStmt(new o.ReturnStatement(o.THIS_EXPR.prop(internalField)));
        view.getters.push(new o.ClassGetter(propName, getter.finish(), type));
    }
    return o.THIS_EXPR.prop(propName);
}
var _QueryWithRead = (function () {
    /**
     * @param {?} query
     * @param {?} match
     */
    function _QueryWithRead(query, match) {
        this.query = query;
        this.read = query.meta.read || match;
    }
    return _QueryWithRead;
}());
function _QueryWithRead_tsickle_Closure_declarations() {
    /** @type {?} */
    _QueryWithRead.prototype.read;
    /** @type {?} */
    _QueryWithRead.prototype.query;
}
//# sourceMappingURL=compile_element.js.map