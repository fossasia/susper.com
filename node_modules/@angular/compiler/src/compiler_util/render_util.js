import { SecurityContext } from '@angular/core';
import { isPresent } from '../facade/lang';
import { Identifiers, createIdentifier } from '../identifiers';
import * as o from '../output/output_ast';
import { EMPTY_STATE as EMPTY_ANIMATION_STATE } from '../private_import_core';
import { BoundEventAst, PropertyBindingType } from '../template_parser/template_ast';
import { createEnumExpression } from './identifier_util';
/**
 * @param {?} view
 * @param {?} boundProp
 * @param {?} renderElement
 * @param {?} renderValue
 * @param {?} logBindingUpdate
 * @param {?=} securityContextExpression
 * @return {?}
 */
export function writeToRenderer(view, boundProp, renderElement, renderValue, logBindingUpdate, securityContextExpression) {
    var /** @type {?} */ updateStmts = [];
    var /** @type {?} */ renderer = view.prop('renderer');
    renderValue = sanitizedValue(view, boundProp, renderValue, securityContextExpression);
    switch (boundProp.type) {
        case PropertyBindingType.Property:
            if (logBindingUpdate) {
                updateStmts.push(o.importExpr(createIdentifier(Identifiers.setBindingDebugInfo))
                    .callFn([renderer, renderElement, o.literal(boundProp.name), renderValue])
                    .toStmt());
            }
            updateStmts.push(renderer
                .callMethod('setElementProperty', [renderElement, o.literal(boundProp.name), renderValue])
                .toStmt());
            break;
        case PropertyBindingType.Attribute:
            renderValue =
                renderValue.isBlank().conditional(o.NULL_EXPR, renderValue.callMethod('toString', []));
            updateStmts.push(renderer
                .callMethod('setElementAttribute', [renderElement, o.literal(boundProp.name), renderValue])
                .toStmt());
            break;
        case PropertyBindingType.Class:
            updateStmts.push(renderer
                .callMethod('setElementClass', [renderElement, o.literal(boundProp.name), renderValue])
                .toStmt());
            break;
        case PropertyBindingType.Style:
            var /** @type {?} */ strValue = renderValue.callMethod('toString', []);
            if (isPresent(boundProp.unit)) {
                strValue = strValue.plus(o.literal(boundProp.unit));
            }
            renderValue = renderValue.isBlank().conditional(o.NULL_EXPR, strValue);
            updateStmts.push(renderer
                .callMethod('setElementStyle', [renderElement, o.literal(boundProp.name), renderValue])
                .toStmt());
            break;
        case PropertyBindingType.Animation:
            throw new Error('Illegal state: Should not come here!');
    }
    return updateStmts;
}
/**
 * @param {?} view
 * @param {?} boundProp
 * @param {?} renderValue
 * @param {?=} securityContextExpression
 * @return {?}
 */
function sanitizedValue(view, boundProp, renderValue, securityContextExpression) {
    if (boundProp.securityContext === SecurityContext.NONE) {
        return renderValue; // No sanitization needed.
    }
    if (!boundProp.needsRuntimeSecurityContext) {
        securityContextExpression =
            createEnumExpression(Identifiers.SecurityContext, boundProp.securityContext);
    }
    if (!securityContextExpression) {
        throw new Error("internal error, no SecurityContext given " + boundProp.name);
    }
    var /** @type {?} */ ctx = view.prop('viewUtils').prop('sanitizer');
    var /** @type {?} */ args = [securityContextExpression, renderValue];
    return ctx.callMethod('sanitize', args);
}
/**
 * @param {?} view
 * @param {?} componentView
 * @param {?} boundProp
 * @param {?} boundOutputs
 * @param {?} eventListener
 * @param {?} renderElement
 * @param {?} renderValue
 * @param {?} lastRenderValue
 * @return {?}
 */
export function triggerAnimation(view, componentView, boundProp, boundOutputs, eventListener, renderElement, renderValue, lastRenderValue) {
    var /** @type {?} */ detachStmts = [];
    var /** @type {?} */ updateStmts = [];
    var /** @type {?} */ animationName = boundProp.name;
    var /** @type {?} */ animationFnExpr = componentView.prop('componentType').prop('animations').key(o.literal(animationName));
    // it's important to normalize the void value as `void` explicitly
    // so that the styles data can be obtained from the stringmap
    var /** @type {?} */ emptyStateValue = o.literal(EMPTY_ANIMATION_STATE);
    var /** @type {?} */ unitializedValue = o.importExpr(createIdentifier(Identifiers.UNINITIALIZED));
    var /** @type {?} */ animationTransitionVar = o.variable('animationTransition_' + animationName);
    updateStmts.push(animationTransitionVar
        .set(animationFnExpr.callFn([
        view, renderElement,
        lastRenderValue.equals(unitializedValue).conditional(emptyStateValue, lastRenderValue),
        renderValue.equals(unitializedValue).conditional(emptyStateValue, renderValue)
    ]))
        .toDeclStmt());
    detachStmts.push(animationTransitionVar
        .set(animationFnExpr.callFn([view, renderElement, lastRenderValue, emptyStateValue]))
        .toDeclStmt());
    var /** @type {?} */ registerStmts = [];
    var /** @type {?} */ animationStartMethodExists = boundOutputs.find(function (event) { return event.isAnimation && event.name == animationName && event.phase == 'start'; });
    if (animationStartMethodExists) {
        registerStmts.push(animationTransitionVar
            .callMethod('onStart', [eventListener.callMethod(o.BuiltinMethod.Bind, [view, o.literal(BoundEventAst.calcFullName(animationName, null, 'start'))])])
            .toStmt());
    }
    var /** @type {?} */ animationDoneMethodExists = boundOutputs.find(function (event) { return event.isAnimation && event.name == animationName && event.phase == 'done'; });
    if (animationDoneMethodExists) {
        registerStmts.push(animationTransitionVar
            .callMethod('onDone', [eventListener.callMethod(o.BuiltinMethod.Bind, [view, o.literal(BoundEventAst.calcFullName(animationName, null, 'done'))])])
            .toStmt());
    }
    updateStmts.push.apply(updateStmts, registerStmts);
    detachStmts.push.apply(detachStmts, registerStmts);
    return { updateStmts: updateStmts, detachStmts: detachStmts };
}
//# sourceMappingURL=render_util.js.map