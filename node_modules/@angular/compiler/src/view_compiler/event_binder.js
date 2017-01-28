/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventHandlerVars, convertActionBinding } from '../compiler_util/expression_converter';
import { createInlineArray } from '../compiler_util/identifier_util';
import { DirectiveWrapperExpressions } from '../directive_wrapper_compiler';
import { Identifiers, createIdentifier } from '../identifiers';
import * as o from '../output/output_ast';
import { CompileMethod } from './compile_method';
import { getHandleEventMethodName } from './util';
/**
 * @param {?} boundEvents
 * @param {?} directives
 * @param {?} compileElement
 * @param {?} bindToRenderer
 * @return {?}
 */
export function bindOutputs(boundEvents, directives, compileElement, bindToRenderer) {
    var /** @type {?} */ usedEvents = collectEvents(boundEvents, directives);
    if (!usedEvents.size) {
        return false;
    }
    if (bindToRenderer) {
        subscribeToRenderEvents(usedEvents, compileElement);
    }
    subscribeToDirectiveEvents(usedEvents, directives, compileElement);
    generateHandleEventMethod(boundEvents, directives, compileElement);
    return true;
}
/**
 * @param {?} boundEvents
 * @param {?} directives
 * @return {?}
 */
function collectEvents(boundEvents, directives) {
    var /** @type {?} */ usedEvents = new Map();
    boundEvents.forEach(function (event) { usedEvents.set(event.fullName, event); });
    directives.forEach(function (dirAst) {
        dirAst.hostEvents.forEach(function (event) { usedEvents.set(event.fullName, event); });
    });
    return usedEvents;
}
/**
 * @param {?} usedEvents
 * @param {?} compileElement
 * @return {?}
 */
function subscribeToRenderEvents(usedEvents, compileElement) {
    var /** @type {?} */ eventAndTargetExprs = [];
    usedEvents.forEach(function (event) {
        if (!event.phase) {
            eventAndTargetExprs.push(o.literal(event.name), o.literal(event.target));
        }
    });
    if (eventAndTargetExprs.length) {
        var /** @type {?} */ disposableVar = o.variable("disposable_" + compileElement.view.disposables.length);
        compileElement.view.disposables.push(disposableVar);
        compileElement.view.createMethod.addStmt(disposableVar
            .set(o.importExpr(createIdentifier(Identifiers.subscribeToRenderElement)).callFn([
            o.THIS_EXPR, compileElement.renderNode, createInlineArray(eventAndTargetExprs),
            handleEventExpr(compileElement)
        ]))
            .toDeclStmt(o.FUNCTION_TYPE, [o.StmtModifier.Private]));
    }
}
/**
 * @param {?} usedEvents
 * @param {?} directives
 * @param {?} compileElement
 * @return {?}
 */
function subscribeToDirectiveEvents(usedEvents, directives, compileElement) {
    var /** @type {?} */ usedEventNames = Array.from(usedEvents.keys());
    directives.forEach(function (dirAst) {
        var /** @type {?} */ dirWrapper = compileElement.directiveWrapperInstance.get(dirAst.directive.type.reference);
        compileElement.view.createMethod.addStmts(DirectiveWrapperExpressions.subscribe(dirAst.directive, dirAst.hostProperties, usedEventNames, dirWrapper, o.THIS_EXPR, handleEventExpr(compileElement)));
    });
}
/**
 * @param {?} boundEvents
 * @param {?} directives
 * @param {?} compileElement
 * @return {?}
 */
function generateHandleEventMethod(boundEvents, directives, compileElement) {
    var /** @type {?} */ hasComponentHostListener = directives.some(function (dirAst) { return dirAst.hostEvents.some(function (event) { return dirAst.directive.isComponent; }); });
    var /** @type {?} */ markPathToRootStart = hasComponentHostListener ? compileElement.compViewExpr : o.THIS_EXPR;
    var /** @type {?} */ handleEventStmts = new CompileMethod(compileElement.view);
    handleEventStmts.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    handleEventStmts.push(markPathToRootStart.callMethod('markPathToRootAsCheckOnce', []).toStmt());
    var /** @type {?} */ eventNameVar = o.variable('eventName');
    var /** @type {?} */ resultVar = o.variable('result');
    handleEventStmts.push(resultVar.set(o.literal(true)).toDeclStmt(o.BOOL_TYPE));
    directives.forEach(function (dirAst, dirIdx) {
        var /** @type {?} */ dirWrapper = compileElement.directiveWrapperInstance.get(dirAst.directive.type.reference);
        if (dirAst.hostEvents.length > 0) {
            handleEventStmts.push(resultVar
                .set(DirectiveWrapperExpressions
                .handleEvent(dirAst.hostEvents, dirWrapper, eventNameVar, EventHandlerVars.event)
                .and(resultVar))
                .toStmt());
        }
    });
    boundEvents.forEach(function (renderEvent, renderEventIdx) {
        var /** @type {?} */ evalResult = convertActionBinding(compileElement.view, compileElement.view, compileElement.view.componentContext, renderEvent.handler, "sub_" + renderEventIdx);
        var /** @type {?} */ trueStmts = evalResult.stmts;
        if (evalResult.preventDefault) {
            trueStmts.push(resultVar.set(evalResult.preventDefault.and(resultVar)).toStmt());
        }
        // TODO(tbosch): convert this into a `switch` once our OutputAst supports it.
        handleEventStmts.push(new o.IfStmt(eventNameVar.equals(o.literal(renderEvent.fullName)), trueStmts));
    });
    handleEventStmts.push(new o.ReturnStatement(resultVar));
    compileElement.view.methods.push(new o.ClassMethod(getHandleEventMethodName(compileElement.nodeIndex), [
        new o.FnParam(eventNameVar.name, o.STRING_TYPE),
        new o.FnParam(EventHandlerVars.event.name, o.DYNAMIC_TYPE)
    ], handleEventStmts.finish(), o.BOOL_TYPE));
}
/**
 * @param {?} compileElement
 * @return {?}
 */
function handleEventExpr(compileElement) {
    var /** @type {?} */ handleEventMethodName = getHandleEventMethodName(compileElement.nodeIndex);
    return o.THIS_EXPR.callMethod('eventHandler', [o.THIS_EXPR.prop(handleEventMethodName)]);
}
//# sourceMappingURL=event_binder.js.map