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
import { identifierModuleUrl, identifierName } from './compile_metadata';
import { createCheckBindingField, createCheckBindingStmt } from './compiler_util/binding_util';
import { EventHandlerVars, convertActionBinding, convertPropertyBinding } from './compiler_util/expression_converter';
import { triggerAnimation, writeToRenderer } from './compiler_util/render_util';
import { CompilerConfig } from './config';
import { Parser } from './expression_parser/parser';
import { Identifiers, createIdentifier } from './identifiers';
import { CompilerInjectable } from './injectable';
import { DEFAULT_INTERPOLATION_CONFIG } from './ml_parser/interpolation_config';
import { createClassStmt } from './output/class_builder';
import * as o from './output/output_ast';
import { ParseErrorLevel, ParseLocation, ParseSourceFile, ParseSourceSpan } from './parse_util';
import { Console, LifecycleHooks } from './private_import_core';
import { ElementSchemaRegistry } from './schema/element_schema_registry';
import { BindingParser } from './template_parser/binding_parser';
export var DirectiveWrapperCompileResult = (function () {
    /**
     * @param {?} statements
     * @param {?} dirWrapperClassVar
     */
    function DirectiveWrapperCompileResult(statements, dirWrapperClassVar) {
        this.statements = statements;
        this.dirWrapperClassVar = dirWrapperClassVar;
    }
    return DirectiveWrapperCompileResult;
}());
function DirectiveWrapperCompileResult_tsickle_Closure_declarations() {
    /** @type {?} */
    DirectiveWrapperCompileResult.prototype.statements;
    /** @type {?} */
    DirectiveWrapperCompileResult.prototype.dirWrapperClassVar;
}
var /** @type {?} */ CONTEXT_FIELD_NAME = 'context';
var /** @type {?} */ CHANGES_FIELD_NAME = '_changes';
var /** @type {?} */ CHANGED_FIELD_NAME = '_changed';
var /** @type {?} */ EVENT_HANDLER_FIELD_NAME = '_eventHandler';
var /** @type {?} */ CURR_VALUE_VAR = o.variable('currValue');
var /** @type {?} */ THROW_ON_CHANGE_VAR = o.variable('throwOnChange');
var /** @type {?} */ FORCE_UPDATE_VAR = o.variable('forceUpdate');
var /** @type {?} */ VIEW_VAR = o.variable('view');
var /** @type {?} */ COMPONENT_VIEW_VAR = o.variable('componentView');
var /** @type {?} */ RENDER_EL_VAR = o.variable('el');
var /** @type {?} */ EVENT_NAME_VAR = o.variable('eventName');
var /** @type {?} */ RESET_CHANGES_STMT = o.THIS_EXPR.prop(CHANGES_FIELD_NAME).set(o.literalMap([])).toStmt();
/**
 *  We generate directive wrappers to prevent code bloat when a directive is used.
  * A directive wrapper encapsulates
  * the dirty checking for `@Input`, the handling of `@HostListener` / `@HostBinding`
  * and calling the lifecyclehooks `ngOnInit`, `ngOnChanges`, `ngDoCheck`.
  * *
  * So far, only `@Input` and the lifecycle hooks have been implemented.
 */
export var DirectiveWrapperCompiler = (function () {
    /**
     * @param {?} compilerConfig
     * @param {?} _exprParser
     * @param {?} _schemaRegistry
     * @param {?} _console
     */
    function DirectiveWrapperCompiler(compilerConfig, _exprParser, _schemaRegistry, _console) {
        this.compilerConfig = compilerConfig;
        this._exprParser = _exprParser;
        this._schemaRegistry = _schemaRegistry;
        this._console = _console;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    DirectiveWrapperCompiler.dirWrapperClassName = function (id) {
        return "Wrapper_" + identifierName(id);
    };
    /**
     * @param {?} dirMeta
     * @return {?}
     */
    DirectiveWrapperCompiler.prototype.compile = function (dirMeta) {
        var /** @type {?} */ hostParseResult = parseHostBindings(dirMeta, this._exprParser, this._schemaRegistry);
        reportParseErrors(hostParseResult.errors, this._console);
        var /** @type {?} */ builder = new DirectiveWrapperBuilder(this.compilerConfig, dirMeta);
        Object.keys(dirMeta.inputs).forEach(function (inputFieldName) {
            addCheckInputMethod(inputFieldName, builder);
        });
        addNgDoCheckMethod(builder);
        addCheckHostMethod(hostParseResult.hostProps, hostParseResult.hostListeners, builder);
        addHandleEventMethod(hostParseResult.hostListeners, builder);
        addSubscribeMethod(dirMeta, builder);
        var /** @type {?} */ classStmt = builder.build();
        return new DirectiveWrapperCompileResult([classStmt], classStmt.name);
    };
    DirectiveWrapperCompiler = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [CompilerConfig, Parser, ElementSchemaRegistry, Console])
    ], DirectiveWrapperCompiler);
    return DirectiveWrapperCompiler;
}());
function DirectiveWrapperCompiler_tsickle_Closure_declarations() {
    /** @type {?} */
    DirectiveWrapperCompiler.prototype.compilerConfig;
    /** @type {?} */
    DirectiveWrapperCompiler.prototype._exprParser;
    /** @type {?} */
    DirectiveWrapperCompiler.prototype._schemaRegistry;
    /** @type {?} */
    DirectiveWrapperCompiler.prototype._console;
}
var DirectiveWrapperBuilder = (function () {
    /**
     * @param {?} compilerConfig
     * @param {?} dirMeta
     */
    function DirectiveWrapperBuilder(compilerConfig, dirMeta) {
        this.compilerConfig = compilerConfig;
        this.dirMeta = dirMeta;
        this.fields = [];
        this.getters = [];
        this.methods = [];
        this.ctorStmts = [];
        this.detachStmts = [];
        this.destroyStmts = [];
        var dirLifecycleHooks = dirMeta.type.lifecycleHooks;
        this.genChanges = dirLifecycleHooks.indexOf(LifecycleHooks.OnChanges) !== -1 ||
            this.compilerConfig.logBindingUpdate;
        this.ngOnChanges = dirLifecycleHooks.indexOf(LifecycleHooks.OnChanges) !== -1;
        this.ngOnInit = dirLifecycleHooks.indexOf(LifecycleHooks.OnInit) !== -1;
        this.ngDoCheck = dirLifecycleHooks.indexOf(LifecycleHooks.DoCheck) !== -1;
        this.ngOnDestroy = dirLifecycleHooks.indexOf(LifecycleHooks.OnDestroy) !== -1;
        if (this.ngOnDestroy) {
            this.destroyStmts.push(o.THIS_EXPR.prop(CONTEXT_FIELD_NAME).callMethod('ngOnDestroy', []).toStmt());
        }
    }
    /**
     * @return {?}
     */
    DirectiveWrapperBuilder.prototype.build = function () {
        var /** @type {?} */ dirDepParamNames = [];
        for (var /** @type {?} */ i = 0; i < this.dirMeta.type.diDeps.length; i++) {
            dirDepParamNames.push("p" + i);
        }
        var /** @type {?} */ methods = [
            new o.ClassMethod('ngOnDetach', [
                new o.FnParam(VIEW_VAR.name, o.importType(createIdentifier(Identifiers.AppView), [o.DYNAMIC_TYPE])),
                new o.FnParam(COMPONENT_VIEW_VAR.name, o.importType(createIdentifier(Identifiers.AppView), [o.DYNAMIC_TYPE])),
                new o.FnParam(RENDER_EL_VAR.name, o.DYNAMIC_TYPE),
            ], this.detachStmts),
            new o.ClassMethod('ngOnDestroy', [], this.destroyStmts),
        ];
        var /** @type {?} */ fields = [
            new o.ClassField(EVENT_HANDLER_FIELD_NAME, o.FUNCTION_TYPE, [o.StmtModifier.Private]),
            new o.ClassField(CONTEXT_FIELD_NAME, o.importType(this.dirMeta.type)),
            new o.ClassField(CHANGED_FIELD_NAME, o.BOOL_TYPE, [o.StmtModifier.Private]),
        ];
        var /** @type {?} */ ctorStmts = [o.THIS_EXPR.prop(CHANGED_FIELD_NAME).set(o.literal(false)).toStmt()];
        if (this.genChanges) {
            fields.push(new o.ClassField(CHANGES_FIELD_NAME, new o.MapType(o.DYNAMIC_TYPE), [o.StmtModifier.Private]));
            ctorStmts.push(RESET_CHANGES_STMT);
        }
        ctorStmts.push(o.THIS_EXPR.prop(CONTEXT_FIELD_NAME)
            .set(o.importExpr(this.dirMeta.type)
            .instantiate(dirDepParamNames.map(function (paramName) { return o.variable(paramName); })))
            .toStmt());
        return createClassStmt({
            name: DirectiveWrapperCompiler.dirWrapperClassName(this.dirMeta.type),
            ctorParams: dirDepParamNames.map(function (paramName) { return new o.FnParam(paramName, o.DYNAMIC_TYPE); }),
            builders: [{ fields: fields, ctorStmts: ctorStmts, methods: methods }, this]
        });
    };
    return DirectiveWrapperBuilder;
}());
function DirectiveWrapperBuilder_tsickle_Closure_declarations() {
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.fields;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.getters;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.methods;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.ctorStmts;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.detachStmts;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.destroyStmts;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.genChanges;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.ngOnChanges;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.ngOnInit;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.ngDoCheck;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.ngOnDestroy;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.compilerConfig;
    /** @type {?} */
    DirectiveWrapperBuilder.prototype.dirMeta;
}
/**
 * @param {?} builder
 * @return {?}
 */
function addNgDoCheckMethod(builder) {
    var /** @type {?} */ changedVar = o.variable('changed');
    var /** @type {?} */ stmts = [
        changedVar.set(o.THIS_EXPR.prop(CHANGED_FIELD_NAME)).toDeclStmt(),
        o.THIS_EXPR.prop(CHANGED_FIELD_NAME).set(o.literal(false)).toStmt(),
    ];
    var /** @type {?} */ lifecycleStmts = [];
    if (builder.genChanges) {
        var /** @type {?} */ onChangesStmts = [];
        if (builder.ngOnChanges) {
            onChangesStmts.push(o.THIS_EXPR.prop(CONTEXT_FIELD_NAME)
                .callMethod('ngOnChanges', [o.THIS_EXPR.prop(CHANGES_FIELD_NAME)])
                .toStmt());
        }
        if (builder.compilerConfig.logBindingUpdate) {
            onChangesStmts.push(o.importExpr(createIdentifier(Identifiers.setBindingDebugInfoForChanges))
                .callFn([VIEW_VAR.prop('renderer'), RENDER_EL_VAR, o.THIS_EXPR.prop(CHANGES_FIELD_NAME)])
                .toStmt());
        }
        onChangesStmts.push(RESET_CHANGES_STMT);
        lifecycleStmts.push(new o.IfStmt(changedVar, onChangesStmts));
    }
    if (builder.ngOnInit) {
        lifecycleStmts.push(new o.IfStmt(VIEW_VAR.prop('numberOfChecks').identical(new o.LiteralExpr(0)), [o.THIS_EXPR.prop(CONTEXT_FIELD_NAME).callMethod('ngOnInit', []).toStmt()]));
    }
    if (builder.ngDoCheck) {
        lifecycleStmts.push(o.THIS_EXPR.prop(CONTEXT_FIELD_NAME).callMethod('ngDoCheck', []).toStmt());
    }
    if (lifecycleStmts.length > 0) {
        stmts.push(new o.IfStmt(o.not(THROW_ON_CHANGE_VAR), lifecycleStmts));
    }
    stmts.push(new o.ReturnStatement(changedVar));
    builder.methods.push(new o.ClassMethod('ngDoCheck', [
        new o.FnParam(VIEW_VAR.name, o.importType(createIdentifier(Identifiers.AppView), [o.DYNAMIC_TYPE])),
        new o.FnParam(RENDER_EL_VAR.name, o.DYNAMIC_TYPE),
        new o.FnParam(THROW_ON_CHANGE_VAR.name, o.BOOL_TYPE),
    ], stmts, o.BOOL_TYPE));
}
/**
 * @param {?} input
 * @param {?} builder
 * @return {?}
 */
function addCheckInputMethod(input, builder) {
    var /** @type {?} */ field = createCheckBindingField(builder);
    var /** @type {?} */ onChangeStatements = [
        o.THIS_EXPR.prop(CHANGED_FIELD_NAME).set(o.literal(true)).toStmt(),
        o.THIS_EXPR.prop(CONTEXT_FIELD_NAME).prop(input).set(CURR_VALUE_VAR).toStmt(),
    ];
    if (builder.genChanges) {
        onChangeStatements.push(o.THIS_EXPR.prop(CHANGES_FIELD_NAME)
            .key(o.literal(input))
            .set(o.importExpr(createIdentifier(Identifiers.SimpleChange))
            .instantiate([field.expression, CURR_VALUE_VAR]))
            .toStmt());
    }
    var /** @type {?} */ methodBody = createCheckBindingStmt({ currValExpr: CURR_VALUE_VAR, forceUpdate: FORCE_UPDATE_VAR, stmts: [] }, field.expression, THROW_ON_CHANGE_VAR, onChangeStatements);
    builder.methods.push(new o.ClassMethod("check_" + input, [
        new o.FnParam(CURR_VALUE_VAR.name, o.DYNAMIC_TYPE),
        new o.FnParam(THROW_ON_CHANGE_VAR.name, o.BOOL_TYPE),
        new o.FnParam(FORCE_UPDATE_VAR.name, o.BOOL_TYPE),
    ], methodBody));
}
/**
 * @param {?} hostProps
 * @param {?} hostEvents
 * @param {?} builder
 * @return {?}
 */
function addCheckHostMethod(hostProps, hostEvents, builder) {
    var /** @type {?} */ stmts = [];
    var /** @type {?} */ methodParams = [
        new o.FnParam(VIEW_VAR.name, o.importType(createIdentifier(Identifiers.AppView), [o.DYNAMIC_TYPE])),
        new o.FnParam(COMPONENT_VIEW_VAR.name, o.importType(createIdentifier(Identifiers.AppView), [o.DYNAMIC_TYPE])),
        new o.FnParam(RENDER_EL_VAR.name, o.DYNAMIC_TYPE),
        new o.FnParam(THROW_ON_CHANGE_VAR.name, o.BOOL_TYPE),
    ];
    hostProps.forEach(function (hostProp, hostPropIdx) {
        var /** @type {?} */ field = createCheckBindingField(builder);
        var /** @type {?} */ evalResult = convertPropertyBinding(builder, null, o.THIS_EXPR.prop(CONTEXT_FIELD_NAME), hostProp.value, field.bindingId);
        if (!evalResult) {
            return;
        }
        var /** @type {?} */ securityContextExpr;
        if (hostProp.needsRuntimeSecurityContext) {
            securityContextExpr = o.variable("secCtx_" + methodParams.length);
            methodParams.push(new o.FnParam(securityContextExpr.name, o.importType(createIdentifier(Identifiers.SecurityContext))));
        }
        var /** @type {?} */ checkBindingStmts;
        if (hostProp.isAnimation) {
            var _a = triggerAnimation(VIEW_VAR, COMPONENT_VIEW_VAR, hostProp, hostEvents, o.THIS_EXPR.prop(EVENT_HANDLER_FIELD_NAME)
                .or(o.importExpr(createIdentifier(Identifiers.noop))), RENDER_EL_VAR, evalResult.currValExpr, field.expression), updateStmts = _a.updateStmts, detachStmts = _a.detachStmts;
            checkBindingStmts = updateStmts;
            (_b = builder.detachStmts).push.apply(_b, detachStmts);
        }
        else {
            checkBindingStmts = writeToRenderer(VIEW_VAR, hostProp, RENDER_EL_VAR, evalResult.currValExpr, builder.compilerConfig.logBindingUpdate, securityContextExpr);
        }
        stmts.push.apply(stmts, createCheckBindingStmt(evalResult, field.expression, THROW_ON_CHANGE_VAR, checkBindingStmts));
        var _b;
    });
    builder.methods.push(new o.ClassMethod('checkHost', methodParams, stmts));
}
/**
 * @param {?} hostListeners
 * @param {?} builder
 * @return {?}
 */
function addHandleEventMethod(hostListeners, builder) {
    var /** @type {?} */ resultVar = o.variable("result");
    var /** @type {?} */ actionStmts = [resultVar.set(o.literal(true)).toDeclStmt(o.BOOL_TYPE)];
    hostListeners.forEach(function (hostListener, eventIdx) {
        var /** @type {?} */ evalResult = convertActionBinding(builder, null, o.THIS_EXPR.prop(CONTEXT_FIELD_NAME), hostListener.handler, "sub_" + eventIdx);
        var /** @type {?} */ trueStmts = evalResult.stmts;
        if (evalResult.preventDefault) {
            trueStmts.push(resultVar.set(evalResult.preventDefault.and(resultVar)).toStmt());
        }
        // TODO(tbosch): convert this into a `switch` once our OutputAst supports it.
        actionStmts.push(new o.IfStmt(EVENT_NAME_VAR.equals(o.literal(hostListener.fullName)), trueStmts));
    });
    actionStmts.push(new o.ReturnStatement(resultVar));
    builder.methods.push(new o.ClassMethod('handleEvent', [
        new o.FnParam(EVENT_NAME_VAR.name, o.STRING_TYPE),
        new o.FnParam(EventHandlerVars.event.name, o.DYNAMIC_TYPE)
    ], actionStmts, o.BOOL_TYPE));
}
/**
 * @param {?} dirMeta
 * @param {?} builder
 * @return {?}
 */
function addSubscribeMethod(dirMeta, builder) {
    var /** @type {?} */ methodParams = [
        new o.FnParam(VIEW_VAR.name, o.importType(createIdentifier(Identifiers.AppView), [o.DYNAMIC_TYPE])),
        new o.FnParam(EVENT_HANDLER_FIELD_NAME, o.DYNAMIC_TYPE)
    ];
    var /** @type {?} */ stmts = [
        o.THIS_EXPR.prop(EVENT_HANDLER_FIELD_NAME).set(o.variable(EVENT_HANDLER_FIELD_NAME)).toStmt()
    ];
    Object.keys(dirMeta.outputs).forEach(function (emitterPropName, emitterIdx) {
        var /** @type {?} */ eventName = dirMeta.outputs[emitterPropName];
        var /** @type {?} */ paramName = "emit" + emitterIdx;
        methodParams.push(new o.FnParam(paramName, o.BOOL_TYPE));
        var /** @type {?} */ subscriptionFieldName = "subscription" + emitterIdx;
        builder.fields.push(new o.ClassField(subscriptionFieldName, o.DYNAMIC_TYPE));
        stmts.push(new o.IfStmt(o.variable(paramName), [
            o.THIS_EXPR.prop(subscriptionFieldName)
                .set(o.THIS_EXPR.prop(CONTEXT_FIELD_NAME)
                .prop(emitterPropName)
                .callMethod(o.BuiltinMethod.SubscribeObservable, [o.variable(EVENT_HANDLER_FIELD_NAME)
                    .callMethod(o.BuiltinMethod.Bind, [VIEW_VAR, o.literal(eventName)])]))
                .toStmt()
        ]));
        builder.destroyStmts.push(o.THIS_EXPR.prop(subscriptionFieldName)
            .and(o.THIS_EXPR.prop(subscriptionFieldName).callMethod('unsubscribe', []))
            .toStmt());
    });
    builder.methods.push(new o.ClassMethod('subscribe', methodParams, stmts));
}
var ParseResult = (function () {
    /**
     * @param {?} hostProps
     * @param {?} hostListeners
     * @param {?} errors
     */
    function ParseResult(hostProps, hostListeners, errors) {
        this.hostProps = hostProps;
        this.hostListeners = hostListeners;
        this.errors = errors;
    }
    return ParseResult;
}());
function ParseResult_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseResult.prototype.hostProps;
    /** @type {?} */
    ParseResult.prototype.hostListeners;
    /** @type {?} */
    ParseResult.prototype.errors;
}
/**
 * @param {?} dirMeta
 * @param {?} exprParser
 * @param {?} schemaRegistry
 * @return {?}
 */
function parseHostBindings(dirMeta, exprParser, schemaRegistry) {
    var /** @type {?} */ errors = [];
    var /** @type {?} */ parser = new BindingParser(exprParser, DEFAULT_INTERPOLATION_CONFIG, schemaRegistry, [], errors);
    var /** @type {?} */ moduleUrl = identifierModuleUrl(dirMeta.type);
    var /** @type {?} */ sourceFileName = moduleUrl ?
        "in Directive " + identifierName(dirMeta.type) + " in " + moduleUrl :
        "in Directive " + identifierName(dirMeta.type);
    var /** @type {?} */ sourceFile = new ParseSourceFile('', sourceFileName);
    var /** @type {?} */ sourceSpan = new ParseSourceSpan(new ParseLocation(sourceFile, null, null, null), new ParseLocation(sourceFile, null, null, null));
    var /** @type {?} */ parsedHostProps = parser.createDirectiveHostPropertyAsts(dirMeta.toSummary(), sourceSpan);
    var /** @type {?} */ parsedHostListeners = parser.createDirectiveHostEventAsts(dirMeta.toSummary(), sourceSpan);
    return new ParseResult(parsedHostProps, parsedHostListeners, errors);
}
/**
 * @param {?} parseErrors
 * @param {?} console
 * @return {?}
 */
function reportParseErrors(parseErrors, console) {
    var /** @type {?} */ warnings = parseErrors.filter(function (error) { return error.level === ParseErrorLevel.WARNING; });
    var /** @type {?} */ errors = parseErrors.filter(function (error) { return error.level === ParseErrorLevel.FATAL; });
    if (warnings.length > 0) {
        this._console.warn("Directive parse warnings:\n" + warnings.join('\n'));
    }
    if (errors.length > 0) {
        throw new Error("Directive parse errors:\n" + errors.join('\n'));
    }
}
export var DirectiveWrapperExpressions = (function () {
    function DirectiveWrapperExpressions() {
    }
    /**
     * @param {?} dir
     * @param {?} depsExpr
     * @return {?}
     */
    DirectiveWrapperExpressions.create = function (dir, depsExpr) {
        return o.importExpr(dir).instantiate(depsExpr, o.importType(dir));
    };
    /**
     * @param {?} dirWrapper
     * @return {?}
     */
    DirectiveWrapperExpressions.context = function (dirWrapper) {
        return dirWrapper.prop(CONTEXT_FIELD_NAME);
    };
    /**
     * @param {?} dirWrapper
     * @param {?} view
     * @param {?} renderElement
     * @param {?} throwOnChange
     * @return {?}
     */
    DirectiveWrapperExpressions.ngDoCheck = function (dirWrapper, view, renderElement, throwOnChange) {
        return dirWrapper.callMethod('ngDoCheck', [view, renderElement, throwOnChange]);
    };
    /**
     * @param {?} hostProps
     * @param {?} dirWrapper
     * @param {?} view
     * @param {?} componentView
     * @param {?} renderElement
     * @param {?} throwOnChange
     * @param {?} runtimeSecurityContexts
     * @return {?}
     */
    DirectiveWrapperExpressions.checkHost = function (hostProps, dirWrapper, view, componentView, renderElement, throwOnChange, runtimeSecurityContexts) {
        if (hostProps.length) {
            return [dirWrapper
                    .callMethod('checkHost', [view, componentView, renderElement, throwOnChange].concat(runtimeSecurityContexts))
                    .toStmt()];
        }
        else {
            return [];
        }
    };
    /**
     * @param {?} hostProps
     * @param {?} dirWrapper
     * @param {?} view
     * @param {?} componentView
     * @param {?} renderEl
     * @return {?}
     */
    DirectiveWrapperExpressions.ngOnDetach = function (hostProps, dirWrapper, view, componentView, renderEl) {
        if (hostProps.some(function (prop) { return prop.isAnimation; })) {
            return [dirWrapper
                    .callMethod('ngOnDetach', [
                    view,
                    componentView,
                    renderEl,
                ])
                    .toStmt()];
        }
        else {
            return [];
        }
    };
    /**
     * @param {?} dir
     * @param {?} dirWrapper
     * @return {?}
     */
    DirectiveWrapperExpressions.ngOnDestroy = function (dir, dirWrapper) {
        if (dir.type.lifecycleHooks.indexOf(LifecycleHooks.OnDestroy) !== -1 ||
            Object.keys(dir.outputs).length > 0) {
            return [dirWrapper.callMethod('ngOnDestroy', []).toStmt()];
        }
        else {
            return [];
        }
    };
    /**
     * @param {?} dirMeta
     * @param {?} hostProps
     * @param {?} usedEvents
     * @param {?} dirWrapper
     * @param {?} view
     * @param {?} eventListener
     * @return {?}
     */
    DirectiveWrapperExpressions.subscribe = function (dirMeta, hostProps, usedEvents, dirWrapper, view, eventListener) {
        var /** @type {?} */ needsSubscribe = false;
        var /** @type {?} */ eventFlags = [];
        Object.keys(dirMeta.outputs).forEach(function (propName) {
            var /** @type {?} */ eventName = dirMeta.outputs[propName];
            var /** @type {?} */ eventUsed = usedEvents.indexOf(eventName) > -1;
            needsSubscribe = needsSubscribe || eventUsed;
            eventFlags.push(o.literal(eventUsed));
        });
        hostProps.forEach(function (hostProp) {
            if (hostProp.isAnimation && usedEvents.length > 0) {
                needsSubscribe = true;
            }
        });
        if (needsSubscribe) {
            return [
                dirWrapper.callMethod('subscribe', [view, eventListener].concat(eventFlags)).toStmt()
            ];
        }
        else {
            return [];
        }
    };
    /**
     * @param {?} hostEvents
     * @param {?} dirWrapper
     * @param {?} eventName
     * @param {?} event
     * @return {?}
     */
    DirectiveWrapperExpressions.handleEvent = function (hostEvents, dirWrapper, eventName, event) {
        return dirWrapper.callMethod('handleEvent', [eventName, event]);
    };
    return DirectiveWrapperExpressions;
}());
//# sourceMappingURL=directive_wrapper_compiler.js.map