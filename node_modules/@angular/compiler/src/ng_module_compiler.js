/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { identifierModuleUrl, identifierName, tokenName, tokenReference } from './compile_metadata';
import { createDiTokenExpression } from './compiler_util/identifier_util';
import { isPresent } from './facade/lang';
import { Identifiers, createIdentifier, resolveIdentifier } from './identifiers';
import { CompilerInjectable } from './injectable';
import { createClassStmt } from './output/class_builder';
import * as o from './output/output_ast';
import { convertValueToOutputAst } from './output/value_util';
import { ParseLocation, ParseSourceFile, ParseSourceSpan } from './parse_util';
import { LifecycleHooks } from './private_import_core';
import { NgModuleProviderAnalyzer } from './provider_analyzer';
export var ComponentFactoryDependency = (function () {
    /**
     * @param {?} comp
     * @param {?} placeholder
     */
    function ComponentFactoryDependency(comp, placeholder) {
        this.comp = comp;
        this.placeholder = placeholder;
    }
    return ComponentFactoryDependency;
}());
function ComponentFactoryDependency_tsickle_Closure_declarations() {
    /** @type {?} */
    ComponentFactoryDependency.prototype.comp;
    /** @type {?} */
    ComponentFactoryDependency.prototype.placeholder;
}
export var NgModuleCompileResult = (function () {
    /**
     * @param {?} statements
     * @param {?} ngModuleFactoryVar
     * @param {?} dependencies
     */
    function NgModuleCompileResult(statements, ngModuleFactoryVar, dependencies) {
        this.statements = statements;
        this.ngModuleFactoryVar = ngModuleFactoryVar;
        this.dependencies = dependencies;
    }
    return NgModuleCompileResult;
}());
function NgModuleCompileResult_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleCompileResult.prototype.statements;
    /** @type {?} */
    NgModuleCompileResult.prototype.ngModuleFactoryVar;
    /** @type {?} */
    NgModuleCompileResult.prototype.dependencies;
}
export var NgModuleCompiler = (function () {
    function NgModuleCompiler() {
    }
    /**
     * @param {?} ngModuleMeta
     * @param {?} extraProviders
     * @return {?}
     */
    NgModuleCompiler.prototype.compile = function (ngModuleMeta, extraProviders) {
        var /** @type {?} */ moduleUrl = identifierModuleUrl(ngModuleMeta.type);
        var /** @type {?} */ sourceFileName = isPresent(moduleUrl) ?
            "in NgModule " + identifierName(ngModuleMeta.type) + " in " + moduleUrl :
            "in NgModule " + identifierName(ngModuleMeta.type);
        var /** @type {?} */ sourceFile = new ParseSourceFile('', sourceFileName);
        var /** @type {?} */ sourceSpan = new ParseSourceSpan(new ParseLocation(sourceFile, null, null, null), new ParseLocation(sourceFile, null, null, null));
        var /** @type {?} */ deps = [];
        var /** @type {?} */ bootstrapComponentFactories = [];
        var /** @type {?} */ entryComponentFactories = ngModuleMeta.transitiveModule.entryComponents.map(function (entryComponent) {
            var /** @type {?} */ id = { reference: null };
            if (ngModuleMeta.bootstrapComponents.some(function (id) { return id.reference === entryComponent.reference; })) {
                bootstrapComponentFactories.push(id);
            }
            deps.push(new ComponentFactoryDependency(entryComponent, id));
            return id;
        });
        var /** @type {?} */ builder = new _InjectorBuilder(ngModuleMeta, entryComponentFactories, bootstrapComponentFactories, sourceSpan);
        var /** @type {?} */ providerParser = new NgModuleProviderAnalyzer(ngModuleMeta, extraProviders, sourceSpan);
        providerParser.parse().forEach(function (provider) { return builder.addProvider(provider); });
        var /** @type {?} */ injectorClass = builder.build();
        var /** @type {?} */ ngModuleFactoryVar = identifierName(ngModuleMeta.type) + "NgFactory";
        var /** @type {?} */ ngModuleFactoryStmt = o.variable(ngModuleFactoryVar)
            .set(o.importExpr(createIdentifier(Identifiers.NgModuleFactory))
            .instantiate([o.variable(injectorClass.name), o.importExpr(ngModuleMeta.type)], o.importType(createIdentifier(Identifiers.NgModuleFactory), [o.importType(ngModuleMeta.type)], [o.TypeModifier.Const])))
            .toDeclStmt(null, [o.StmtModifier.Final]);
        var /** @type {?} */ stmts = [injectorClass, ngModuleFactoryStmt];
        if (ngModuleMeta.id) {
            var /** @type {?} */ registerFactoryStmt = o.importExpr(createIdentifier(Identifiers.RegisterModuleFactoryFn))
                .callFn([o.literal(ngModuleMeta.id), o.variable(ngModuleFactoryVar)])
                .toStmt();
            stmts.push(registerFactoryStmt);
        }
        return new NgModuleCompileResult(stmts, ngModuleFactoryVar, deps);
    };
    NgModuleCompiler = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [])
    ], NgModuleCompiler);
    return NgModuleCompiler;
}());
var _InjectorBuilder = (function () {
    /**
     * @param {?} _ngModuleMeta
     * @param {?} _entryComponentFactories
     * @param {?} _bootstrapComponentFactories
     * @param {?} _sourceSpan
     */
    function _InjectorBuilder(_ngModuleMeta, _entryComponentFactories, _bootstrapComponentFactories, _sourceSpan) {
        this._ngModuleMeta = _ngModuleMeta;
        this._entryComponentFactories = _entryComponentFactories;
        this._bootstrapComponentFactories = _bootstrapComponentFactories;
        this._sourceSpan = _sourceSpan;
        this.fields = [];
        this.getters = [];
        this.methods = [];
        this.ctorStmts = [];
        this._tokens = [];
        this._instances = new Map();
        this._createStmts = [];
        this._destroyStmts = [];
    }
    /**
     * @param {?} resolvedProvider
     * @return {?}
     */
    _InjectorBuilder.prototype.addProvider = function (resolvedProvider) {
        var _this = this;
        var /** @type {?} */ providerValueExpressions = resolvedProvider.providers.map(function (provider) { return _this._getProviderValue(provider); });
        var /** @type {?} */ propName = "_" + tokenName(resolvedProvider.token) + "_" + this._instances.size;
        var /** @type {?} */ instance = this._createProviderProperty(propName, resolvedProvider, providerValueExpressions, resolvedProvider.multiProvider, resolvedProvider.eager);
        if (resolvedProvider.lifecycleHooks.indexOf(LifecycleHooks.OnDestroy) !== -1) {
            this._destroyStmts.push(instance.callMethod('ngOnDestroy', []).toStmt());
        }
        this._tokens.push(resolvedProvider.token);
        this._instances.set(tokenReference(resolvedProvider.token), instance);
    };
    /**
     * @return {?}
     */
    _InjectorBuilder.prototype.build = function () {
        var _this = this;
        var /** @type {?} */ getMethodStmts = this._tokens.map(function (token) {
            var /** @type {?} */ providerExpr = _this._instances.get(tokenReference(token));
            return new o.IfStmt(InjectMethodVars.token.identical(createDiTokenExpression(token)), [new o.ReturnStatement(providerExpr)]);
        });
        var /** @type {?} */ methods = [
            new o.ClassMethod('createInternal', [], this._createStmts.concat(new o.ReturnStatement(this._instances.get(this._ngModuleMeta.type.reference))), o.importType(this._ngModuleMeta.type)),
            new o.ClassMethod('getInternal', [
                new o.FnParam(InjectMethodVars.token.name, o.DYNAMIC_TYPE),
                new o.FnParam(InjectMethodVars.notFoundResult.name, o.DYNAMIC_TYPE)
            ], getMethodStmts.concat([new o.ReturnStatement(InjectMethodVars.notFoundResult)]), o.DYNAMIC_TYPE),
            new o.ClassMethod('destroyInternal', [], this._destroyStmts),
        ];
        var /** @type {?} */ parentArgs = [
            o.variable(InjectorProps.parent.name),
            o.literalArr(this._entryComponentFactories.map(function (componentFactory) { return o.importExpr(componentFactory); })),
            o.literalArr(this._bootstrapComponentFactories.map(function (componentFactory) { return o.importExpr(componentFactory); }))
        ];
        var /** @type {?} */ injClassName = identifierName(this._ngModuleMeta.type) + "Injector";
        return createClassStmt({
            name: injClassName,
            ctorParams: [new o.FnParam(InjectorProps.parent.name, o.importType(createIdentifier(Identifiers.Injector)))],
            parent: o.importExpr(createIdentifier(Identifiers.NgModuleInjector), [o.importType(this._ngModuleMeta.type)]),
            parentArgs: parentArgs,
            builders: [{ methods: methods }, this]
        });
    };
    /**
     * @param {?} provider
     * @return {?}
     */
    _InjectorBuilder.prototype._getProviderValue = function (provider) {
        var _this = this;
        var /** @type {?} */ result;
        if (isPresent(provider.useExisting)) {
            result = this._getDependency({ token: provider.useExisting });
        }
        else if (isPresent(provider.useFactory)) {
            var /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
            var /** @type {?} */ depsExpr = deps.map(function (dep) { return _this._getDependency(dep); });
            result = o.importExpr(provider.useFactory).callFn(depsExpr);
        }
        else if (isPresent(provider.useClass)) {
            var /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
            var /** @type {?} */ depsExpr = deps.map(function (dep) { return _this._getDependency(dep); });
            result =
                o.importExpr(provider.useClass).instantiate(depsExpr, o.importType(provider.useClass));
        }
        else {
            result = convertValueToOutputAst(provider.useValue);
        }
        return result;
    };
    /**
     * @param {?} propName
     * @param {?} provider
     * @param {?} providerValueExpressions
     * @param {?} isMulti
     * @param {?} isEager
     * @return {?}
     */
    _InjectorBuilder.prototype._createProviderProperty = function (propName, provider, providerValueExpressions, isMulti, isEager) {
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
            this.fields.push(new o.ClassField(propName, type));
            this._createStmts.push(o.THIS_EXPR.prop(propName).set(resolvedProviderValueExpr).toStmt());
        }
        else {
            var /** @type {?} */ internalField = "_" + propName;
            this.fields.push(new o.ClassField(internalField, type));
            // Note: Equals is important for JS so that it also checks the undefined case!
            var /** @type {?} */ getterStmts = [
                new o.IfStmt(o.THIS_EXPR.prop(internalField).isBlank(), [o.THIS_EXPR.prop(internalField).set(resolvedProviderValueExpr).toStmt()]),
                new o.ReturnStatement(o.THIS_EXPR.prop(internalField))
            ];
            this.getters.push(new o.ClassGetter(propName, getterStmts, type));
        }
        return o.THIS_EXPR.prop(propName);
    };
    /**
     * @param {?} dep
     * @return {?}
     */
    _InjectorBuilder.prototype._getDependency = function (dep) {
        var /** @type {?} */ result = null;
        if (dep.isValue) {
            result = o.literal(dep.value);
        }
        if (!dep.isSkipSelf) {
            if (dep.token &&
                (tokenReference(dep.token) === resolveIdentifier(Identifiers.Injector) ||
                    tokenReference(dep.token) === resolveIdentifier(Identifiers.ComponentFactoryResolver))) {
                result = o.THIS_EXPR;
            }
            if (!result) {
                result = this._instances.get(tokenReference(dep.token));
            }
        }
        if (!result) {
            var /** @type {?} */ args = [createDiTokenExpression(dep.token)];
            if (dep.isOptional) {
                args.push(o.NULL_EXPR);
            }
            result = InjectorProps.parent.callMethod('get', args);
        }
        return result;
    };
    return _InjectorBuilder;
}());
function _InjectorBuilder_tsickle_Closure_declarations() {
    /** @type {?} */
    _InjectorBuilder.prototype.fields;
    /** @type {?} */
    _InjectorBuilder.prototype.getters;
    /** @type {?} */
    _InjectorBuilder.prototype.methods;
    /** @type {?} */
    _InjectorBuilder.prototype.ctorStmts;
    /** @type {?} */
    _InjectorBuilder.prototype._tokens;
    /** @type {?} */
    _InjectorBuilder.prototype._instances;
    /** @type {?} */
    _InjectorBuilder.prototype._createStmts;
    /** @type {?} */
    _InjectorBuilder.prototype._destroyStmts;
    /** @type {?} */
    _InjectorBuilder.prototype._ngModuleMeta;
    /** @type {?} */
    _InjectorBuilder.prototype._entryComponentFactories;
    /** @type {?} */
    _InjectorBuilder.prototype._bootstrapComponentFactories;
    /** @type {?} */
    _InjectorBuilder.prototype._sourceSpan;
}
var InjectorProps = (function () {
    function InjectorProps() {
    }
    InjectorProps.parent = o.THIS_EXPR.prop('parent');
    return InjectorProps;
}());
function InjectorProps_tsickle_Closure_declarations() {
    /** @type {?} */
    InjectorProps.parent;
}
var InjectMethodVars = (function () {
    function InjectMethodVars() {
    }
    InjectMethodVars.token = o.variable('token');
    InjectMethodVars.notFoundResult = o.variable('notFoundResult');
    return InjectMethodVars;
}());
function InjectMethodVars_tsickle_Closure_declarations() {
    /** @type {?} */
    InjectMethodVars.token;
    /** @type {?} */
    InjectMethodVars.notFoundResult;
}
//# sourceMappingURL=ng_module_compiler.js.map