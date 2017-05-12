/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { createEnumExpression } from '../compiler_util/identifier_util';
import { Identifiers } from '../identifiers';
import * as o from '../output/output_ast';
export var ViewTypeEnum = (function () {
    function ViewTypeEnum() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    ViewTypeEnum.fromValue = function (value) {
        return createEnumExpression(Identifiers.ViewType, value);
    };
    return ViewTypeEnum;
}());
export var ViewEncapsulationEnum = (function () {
    function ViewEncapsulationEnum() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    ViewEncapsulationEnum.fromValue = function (value) {
        return createEnumExpression(Identifiers.ViewEncapsulation, value);
    };
    return ViewEncapsulationEnum;
}());
export var ChangeDetectionStrategyEnum = (function () {
    function ChangeDetectionStrategyEnum() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    ChangeDetectionStrategyEnum.fromValue = function (value) {
        return createEnumExpression(Identifiers.ChangeDetectionStrategy, value);
    };
    return ChangeDetectionStrategyEnum;
}());
export var ChangeDetectorStatusEnum = (function () {
    function ChangeDetectorStatusEnum() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    ChangeDetectorStatusEnum.fromValue = function (value) {
        return createEnumExpression(Identifiers.ChangeDetectorStatus, value);
    };
    return ChangeDetectorStatusEnum;
}());
export var ViewConstructorVars = (function () {
    function ViewConstructorVars() {
    }
    ViewConstructorVars.viewUtils = o.variable('viewUtils');
    ViewConstructorVars.parentView = o.variable('parentView');
    ViewConstructorVars.parentIndex = o.variable('parentIndex');
    ViewConstructorVars.parentElement = o.variable('parentElement');
    return ViewConstructorVars;
}());
function ViewConstructorVars_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewConstructorVars.viewUtils;
    /** @type {?} */
    ViewConstructorVars.parentView;
    /** @type {?} */
    ViewConstructorVars.parentIndex;
    /** @type {?} */
    ViewConstructorVars.parentElement;
}
export var ViewProperties = (function () {
    function ViewProperties() {
    }
    ViewProperties.renderer = o.THIS_EXPR.prop('renderer');
    ViewProperties.viewUtils = o.THIS_EXPR.prop('viewUtils');
    return ViewProperties;
}());
function ViewProperties_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewProperties.renderer;
    /** @type {?} */
    ViewProperties.viewUtils;
}
export var InjectMethodVars = (function () {
    function InjectMethodVars() {
    }
    InjectMethodVars.token = o.variable('token');
    InjectMethodVars.requestNodeIndex = o.variable('requestNodeIndex');
    InjectMethodVars.notFoundResult = o.variable('notFoundResult');
    return InjectMethodVars;
}());
function InjectMethodVars_tsickle_Closure_declarations() {
    /** @type {?} */
    InjectMethodVars.token;
    /** @type {?} */
    InjectMethodVars.requestNodeIndex;
    /** @type {?} */
    InjectMethodVars.notFoundResult;
}
export var DetectChangesVars = (function () {
    function DetectChangesVars() {
    }
    DetectChangesVars.throwOnChange = o.variable("throwOnChange");
    DetectChangesVars.changes = o.variable("changes");
    DetectChangesVars.changed = o.variable("changed");
    return DetectChangesVars;
}());
function DetectChangesVars_tsickle_Closure_declarations() {
    /** @type {?} */
    DetectChangesVars.throwOnChange;
    /** @type {?} */
    DetectChangesVars.changes;
    /** @type {?} */
    DetectChangesVars.changed;
}
//# sourceMappingURL=constants.js.map