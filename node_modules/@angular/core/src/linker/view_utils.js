/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationQueue } from '../animation/animation_queue';
import { devModeEqual } from '../change_detection/change_detection';
import { UNINITIALIZED } from '../change_detection/change_detection_util';
import { Injectable } from '../di';
import { isPresent, looseIdentical } from '../facade/lang';
import { RenderComponentType, RootRenderer } from '../render/api';
import { Sanitizer } from '../security';
import { VERSION } from '../version';
import { ExpressionChangedAfterItHasBeenCheckedError } from './errors';
export var ViewUtils = (function () {
    /**
     * @param {?} _renderer
     * @param {?} sanitizer
     * @param {?} animationQueue
     */
    function ViewUtils(_renderer, sanitizer, animationQueue) {
        this._renderer = _renderer;
        this.animationQueue = animationQueue;
        this._nextCompTypeId = 0;
        this.sanitizer = sanitizer;
    }
    /**
     * @param {?} renderComponentType
     * @return {?}
     */
    ViewUtils.prototype.renderComponent = function (renderComponentType) {
        return this._renderer.renderComponent(renderComponentType);
    };
    ViewUtils.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ViewUtils.ctorParameters = function () { return [
        { type: RootRenderer, },
        { type: Sanitizer, },
        { type: AnimationQueue, },
    ]; };
    return ViewUtils;
}());
function ViewUtils_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewUtils.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ViewUtils.ctorParameters;
    /** @type {?} */
    ViewUtils.prototype.sanitizer;
    /** @type {?} */
    ViewUtils.prototype._nextCompTypeId;
    /** @type {?} */
    ViewUtils.prototype._renderer;
    /** @type {?} */
    ViewUtils.prototype.animationQueue;
}
var /** @type {?} */ nextRenderComponentTypeId = 0;
/**
 * @param {?} templateUrl
 * @param {?} slotCount
 * @param {?} encapsulation
 * @param {?} styles
 * @param {?} animations
 * @return {?}
 */
export function createRenderComponentType(templateUrl, slotCount, encapsulation, styles, animations) {
    return new RenderComponentType("" + nextRenderComponentTypeId++, templateUrl, slotCount, encapsulation, styles, animations);
}
/**
 * @param {?} e
 * @param {?} array
 * @return {?}
 */
export function addToArray(e, array) {
    array.push(e);
}
/**
 * @param {?} valueCount
 * @param {?} constAndInterp
 * @return {?}
 */
export function interpolate(valueCount, constAndInterp) {
    var /** @type {?} */ result = '';
    for (var /** @type {?} */ i = 0; i < valueCount * 2; i = i + 2) {
        result = result + constAndInterp[i] + _toStringWithNull(constAndInterp[i + 1]);
    }
    return result + constAndInterp[valueCount * 2];
}
/**
 * @param {?} valueCount
 * @param {?} c0
 * @param {?} a1
 * @param {?} c1
 * @param {?=} a2
 * @param {?=} c2
 * @param {?=} a3
 * @param {?=} c3
 * @param {?=} a4
 * @param {?=} c4
 * @param {?=} a5
 * @param {?=} c5
 * @param {?=} a6
 * @param {?=} c6
 * @param {?=} a7
 * @param {?=} c7
 * @param {?=} a8
 * @param {?=} c8
 * @param {?=} a9
 * @param {?=} c9
 * @return {?}
 */
export function inlineInterpolate(valueCount, c0, a1, c1, a2, c2, a3, c3, a4, c4, a5, c5, a6, c6, a7, c7, a8, c8, a9, c9) {
    switch (valueCount) {
        case 1:
            return c0 + _toStringWithNull(a1) + c1;
        case 2:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;
        case 3:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3;
        case 4:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4;
        case 5:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;
        case 6:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6;
        case 7:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                c6 + _toStringWithNull(a7) + c7;
        case 8:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;
        case 9:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) + c9;
        default:
            throw new Error("Does not support more than 9 expressions");
    }
}
/**
 * @param {?} v
 * @return {?}
 */
function _toStringWithNull(v) {
    return v != null ? v.toString() : '';
}
/**
 * @param {?} throwOnChange
 * @param {?} oldValue
 * @param {?} newValue
 * @return {?}
 */
export function checkBinding(throwOnChange, oldValue, newValue) {
    if (throwOnChange) {
        if (!devModeEqual(oldValue, newValue)) {
            throw new ExpressionChangedAfterItHasBeenCheckedError(oldValue, newValue);
        }
        return false;
    }
    else {
        return !looseIdentical(oldValue, newValue);
    }
}
/**
 * @param {?} input
 * @param {?} value
 * @return {?}
 */
export function castByValue(input, value) {
    return (input);
}
export var /** @type {?} */ EMPTY_ARRAY = [];
export var /** @type {?} */ EMPTY_MAP = {};
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy1(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0 = UNINITIALIZED;
    return function (p0) {
        if (!looseIdentical(v0, p0)) {
            v0 = p0;
            result = fn(p0);
        }
        return result;
    };
}
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy2(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0 = UNINITIALIZED;
    var /** @type {?} */ v1 = UNINITIALIZED;
    return function (p0, p1) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1)) {
            v0 = p0;
            v1 = p1;
            result = fn(p0, p1);
        }
        return result;
    };
}
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy3(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0 = UNINITIALIZED;
    var /** @type {?} */ v1 = UNINITIALIZED;
    var /** @type {?} */ v2 = UNINITIALIZED;
    return function (p0, p1, p2) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2)) {
            v0 = p0;
            v1 = p1;
            v2 = p2;
            result = fn(p0, p1, p2);
        }
        return result;
    };
}
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy4(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0, /** @type {?} */ v1, /** @type {?} */ v2, /** @type {?} */ v3;
    v0 = v1 = v2 = v3 = UNINITIALIZED;
    return function (p0, p1, p2, p3) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
            !looseIdentical(v3, p3)) {
            v0 = p0;
            v1 = p1;
            v2 = p2;
            v3 = p3;
            result = fn(p0, p1, p2, p3);
        }
        return result;
    };
}
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy5(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0, /** @type {?} */ v1, /** @type {?} */ v2, /** @type {?} */ v3, /** @type {?} */ v4;
    v0 = v1 = v2 = v3 = v4 = UNINITIALIZED;
    return function (p0, p1, p2, p3, p4) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
            !looseIdentical(v3, p3) || !looseIdentical(v4, p4)) {
            v0 = p0;
            v1 = p1;
            v2 = p2;
            v3 = p3;
            v4 = p4;
            result = fn(p0, p1, p2, p3, p4);
        }
        return result;
    };
}
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy6(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0, /** @type {?} */ v1, /** @type {?} */ v2, /** @type {?} */ v3, /** @type {?} */ v4, /** @type {?} */ v5;
    v0 = v1 = v2 = v3 = v4 = v5 = UNINITIALIZED;
    return function (p0, p1, p2, p3, p4, p5) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
            !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5)) {
            v0 = p0;
            v1 = p1;
            v2 = p2;
            v3 = p3;
            v4 = p4;
            v5 = p5;
            result = fn(p0, p1, p2, p3, p4, p5);
        }
        return result;
    };
}
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy7(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0, /** @type {?} */ v1, /** @type {?} */ v2, /** @type {?} */ v3, /** @type {?} */ v4, /** @type {?} */ v5, /** @type {?} */ v6;
    v0 = v1 = v2 = v3 = v4 = v5 = v6 = UNINITIALIZED;
    return function (p0, p1, p2, p3, p4, p5, p6) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
            !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) ||
            !looseIdentical(v6, p6)) {
            v0 = p0;
            v1 = p1;
            v2 = p2;
            v3 = p3;
            v4 = p4;
            v5 = p5;
            v6 = p6;
            result = fn(p0, p1, p2, p3, p4, p5, p6);
        }
        return result;
    };
}
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy8(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0, /** @type {?} */ v1, /** @type {?} */ v2, /** @type {?} */ v3, /** @type {?} */ v4, /** @type {?} */ v5, /** @type {?} */ v6, /** @type {?} */ v7;
    v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = UNINITIALIZED;
    return function (p0, p1, p2, p3, p4, p5, p6, p7) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
            !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) ||
            !looseIdentical(v6, p6) || !looseIdentical(v7, p7)) {
            v0 = p0;
            v1 = p1;
            v2 = p2;
            v3 = p3;
            v4 = p4;
            v5 = p5;
            v6 = p6;
            v7 = p7;
            result = fn(p0, p1, p2, p3, p4, p5, p6, p7);
        }
        return result;
    };
}
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy9(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0, /** @type {?} */ v1, /** @type {?} */ v2, /** @type {?} */ v3, /** @type {?} */ v4, /** @type {?} */ v5, /** @type {?} */ v6, /** @type {?} */ v7, /** @type {?} */ v8;
    v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = UNINITIALIZED;
    return function (p0, p1, p2, p3, p4, p5, p6, p7, p8) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
            !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) ||
            !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8)) {
            v0 = p0;
            v1 = p1;
            v2 = p2;
            v3 = p3;
            v4 = p4;
            v5 = p5;
            v6 = p6;
            v7 = p7;
            v8 = p8;
            result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8);
        }
        return result;
    };
}
/**
 * @param {?} fn
 * @return {?}
 */
export function pureProxy10(fn) {
    var /** @type {?} */ result;
    var /** @type {?} */ v0, /** @type {?} */ v1, /** @type {?} */ v2, /** @type {?} */ v3, /** @type {?} */ v4, /** @type {?} */ v5, /** @type {?} */ v6, /** @type {?} */ v7, /** @type {?} */ v8, /** @type {?} */ v9;
    v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = v9 = UNINITIALIZED;
    return function (p0, p1, p2, p3, p4, p5, p6, p7, p8, p9) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
            !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) ||
            !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8) ||
            !looseIdentical(v9, p9)) {
            v0 = p0;
            v1 = p1;
            v2 = p2;
            v3 = p3;
            v4 = p4;
            v5 = p5;
            v6 = p6;
            v7 = p7;
            v8 = p8;
            v9 = p9;
            result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
        }
        return result;
    };
}
/**
 * @param {?} renderer
 * @param {?} el
 * @param {?} changes
 * @return {?}
 */
export function setBindingDebugInfoForChanges(renderer, el, changes) {
    Object.keys(changes).forEach(function (propName) {
        setBindingDebugInfo(renderer, el, propName, changes[propName].currentValue);
    });
}
/**
 * @param {?} renderer
 * @param {?} el
 * @param {?} propName
 * @param {?} value
 * @return {?}
 */
export function setBindingDebugInfo(renderer, el, propName, value) {
    try {
        renderer.setBindingDebugInfo(el, "ng-reflect-" + camelCaseToDashCase(propName), value ? value.toString() : null);
    }
    catch (e) {
        renderer.setBindingDebugInfo(el, "ng-reflect-" + camelCaseToDashCase(propName), '[ERROR] Exception while trying to serialize the value');
    }
}
var /** @type {?} */ CAMEL_CASE_REGEXP = /([A-Z])/g;
/**
 * @param {?} input
 * @return {?}
 */
function camelCaseToDashCase(input) {
    return input.replace(CAMEL_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i - 0] = arguments[_i];
        }
        return '-' + m[1].toLowerCase();
    });
}
/**
 * @param {?} renderer
 * @param {?} parentElement
 * @param {?} name
 * @param {?} attrs
 * @param {?=} debugInfo
 * @return {?}
 */
export function createRenderElement(renderer, parentElement, name, attrs, debugInfo) {
    var /** @type {?} */ el = renderer.createElement(parentElement, name, debugInfo);
    for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
        renderer.setElementAttribute(el, attrs.get(i), attrs.get(i + 1));
    }
    return el;
}
/**
 * @param {?} renderer
 * @param {?} elementName
 * @param {?} attrs
 * @param {?} rootSelectorOrNode
 * @param {?=} debugInfo
 * @return {?}
 */
export function selectOrCreateRenderHostElement(renderer, elementName, attrs, rootSelectorOrNode, debugInfo) {
    var /** @type {?} */ hostElement;
    if (isPresent(rootSelectorOrNode)) {
        hostElement = renderer.selectRootElement(rootSelectorOrNode, debugInfo);
        for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
            renderer.setElementAttribute(hostElement, attrs.get(i), attrs.get(i + 1));
        }
        renderer.setElementAttribute(hostElement, 'ng-version', VERSION.full);
    }
    else {
        hostElement = createRenderElement(renderer, null, elementName, attrs, debugInfo);
    }
    return hostElement;
}
/**
 * @param {?} view
 * @param {?} element
 * @param {?} eventNamesAndTargets
 * @param {?} listener
 * @return {?}
 */
export function subscribeToRenderElement(view, element, eventNamesAndTargets, listener) {
    var /** @type {?} */ disposables = createEmptyInlineArray(eventNamesAndTargets.length / 2);
    for (var /** @type {?} */ i = 0; i < eventNamesAndTargets.length; i += 2) {
        var /** @type {?} */ eventName = eventNamesAndTargets.get(i);
        var /** @type {?} */ eventTarget = eventNamesAndTargets.get(i + 1);
        var /** @type {?} */ disposable = void 0;
        if (eventTarget) {
            disposable = view.renderer.listenGlobal(eventTarget, eventName, listener.bind(view, eventTarget + ":" + eventName));
        }
        else {
            disposable = view.renderer.listen(element, eventName, listener.bind(view, eventName));
        }
        disposables.set(i / 2, disposable);
    }
    return disposeInlineArray.bind(null, disposables);
}
/**
 * @param {?} disposables
 * @return {?}
 */
function disposeInlineArray(disposables) {
    for (var /** @type {?} */ i = 0; i < disposables.length; i++) {
        disposables.get(i)();
    }
}
/**
 * @return {?}
 */
export function noop() { }
/**
 * @param {?} length
 * @return {?}
 */
function createEmptyInlineArray(length) {
    var /** @type {?} */ ctor;
    if (length <= 2) {
        ctor = InlineArray2;
    }
    else if (length <= 4) {
        ctor = InlineArray4;
    }
    else if (length <= 8) {
        ctor = InlineArray8;
    }
    else if (length <= 16) {
        ctor = InlineArray16;
    }
    else {
        ctor = InlineArrayDynamic;
    }
    return new ctor(length);
}
var InlineArray0 = (function () {
    function InlineArray0() {
        this.length = 0;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    InlineArray0.prototype.get = function (index) { return undefined; };
    /**
     * @param {?} index
     * @param {?} value
     * @return {?}
     */
    InlineArray0.prototype.set = function (index, value) { };
    return InlineArray0;
}());
function InlineArray0_tsickle_Closure_declarations() {
    /** @type {?} */
    InlineArray0.prototype.length;
}
export var InlineArray2 = (function () {
    /**
     * @param {?} length
     * @param {?=} _v0
     * @param {?=} _v1
     */
    function InlineArray2(length, _v0, _v1) {
        this.length = length;
        this._v0 = _v0;
        this._v1 = _v1;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    InlineArray2.prototype.get = function (index) {
        switch (index) {
            case 0:
                return this._v0;
            case 1:
                return this._v1;
            default:
                return undefined;
        }
    };
    /**
     * @param {?} index
     * @param {?} value
     * @return {?}
     */
    InlineArray2.prototype.set = function (index, value) {
        switch (index) {
            case 0:
                this._v0 = value;
                break;
            case 1:
                this._v1 = value;
                break;
        }
    };
    return InlineArray2;
}());
function InlineArray2_tsickle_Closure_declarations() {
    /** @type {?} */
    InlineArray2.prototype.length;
    /** @type {?} */
    InlineArray2.prototype._v0;
    /** @type {?} */
    InlineArray2.prototype._v1;
}
export var InlineArray4 = (function () {
    /**
     * @param {?} length
     * @param {?=} _v0
     * @param {?=} _v1
     * @param {?=} _v2
     * @param {?=} _v3
     */
    function InlineArray4(length, _v0, _v1, _v2, _v3) {
        this.length = length;
        this._v0 = _v0;
        this._v1 = _v1;
        this._v2 = _v2;
        this._v3 = _v3;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    InlineArray4.prototype.get = function (index) {
        switch (index) {
            case 0:
                return this._v0;
            case 1:
                return this._v1;
            case 2:
                return this._v2;
            case 3:
                return this._v3;
            default:
                return undefined;
        }
    };
    /**
     * @param {?} index
     * @param {?} value
     * @return {?}
     */
    InlineArray4.prototype.set = function (index, value) {
        switch (index) {
            case 0:
                this._v0 = value;
                break;
            case 1:
                this._v1 = value;
                break;
            case 2:
                this._v2 = value;
                break;
            case 3:
                this._v3 = value;
                break;
        }
    };
    return InlineArray4;
}());
function InlineArray4_tsickle_Closure_declarations() {
    /** @type {?} */
    InlineArray4.prototype.length;
    /** @type {?} */
    InlineArray4.prototype._v0;
    /** @type {?} */
    InlineArray4.prototype._v1;
    /** @type {?} */
    InlineArray4.prototype._v2;
    /** @type {?} */
    InlineArray4.prototype._v3;
}
export var InlineArray8 = (function () {
    /**
     * @param {?} length
     * @param {?=} _v0
     * @param {?=} _v1
     * @param {?=} _v2
     * @param {?=} _v3
     * @param {?=} _v4
     * @param {?=} _v5
     * @param {?=} _v6
     * @param {?=} _v7
     */
    function InlineArray8(length, _v0, _v1, _v2, _v3, _v4, _v5, _v6, _v7) {
        this.length = length;
        this._v0 = _v0;
        this._v1 = _v1;
        this._v2 = _v2;
        this._v3 = _v3;
        this._v4 = _v4;
        this._v5 = _v5;
        this._v6 = _v6;
        this._v7 = _v7;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    InlineArray8.prototype.get = function (index) {
        switch (index) {
            case 0:
                return this._v0;
            case 1:
                return this._v1;
            case 2:
                return this._v2;
            case 3:
                return this._v3;
            case 4:
                return this._v4;
            case 5:
                return this._v5;
            case 6:
                return this._v6;
            case 7:
                return this._v7;
            default:
                return undefined;
        }
    };
    /**
     * @param {?} index
     * @param {?} value
     * @return {?}
     */
    InlineArray8.prototype.set = function (index, value) {
        switch (index) {
            case 0:
                this._v0 = value;
                break;
            case 1:
                this._v1 = value;
                break;
            case 2:
                this._v2 = value;
                break;
            case 3:
                this._v3 = value;
                break;
            case 4:
                this._v4 = value;
                break;
            case 5:
                this._v5 = value;
                break;
            case 6:
                this._v6 = value;
                break;
            case 7:
                this._v7 = value;
                break;
        }
    };
    return InlineArray8;
}());
function InlineArray8_tsickle_Closure_declarations() {
    /** @type {?} */
    InlineArray8.prototype.length;
    /** @type {?} */
    InlineArray8.prototype._v0;
    /** @type {?} */
    InlineArray8.prototype._v1;
    /** @type {?} */
    InlineArray8.prototype._v2;
    /** @type {?} */
    InlineArray8.prototype._v3;
    /** @type {?} */
    InlineArray8.prototype._v4;
    /** @type {?} */
    InlineArray8.prototype._v5;
    /** @type {?} */
    InlineArray8.prototype._v6;
    /** @type {?} */
    InlineArray8.prototype._v7;
}
export var InlineArray16 = (function () {
    /**
     * @param {?} length
     * @param {?=} _v0
     * @param {?=} _v1
     * @param {?=} _v2
     * @param {?=} _v3
     * @param {?=} _v4
     * @param {?=} _v5
     * @param {?=} _v6
     * @param {?=} _v7
     * @param {?=} _v8
     * @param {?=} _v9
     * @param {?=} _v10
     * @param {?=} _v11
     * @param {?=} _v12
     * @param {?=} _v13
     * @param {?=} _v14
     * @param {?=} _v15
     */
    function InlineArray16(length, _v0, _v1, _v2, _v3, _v4, _v5, _v6, _v7, _v8, _v9, _v10, _v11, _v12, _v13, _v14, _v15) {
        this.length = length;
        this._v0 = _v0;
        this._v1 = _v1;
        this._v2 = _v2;
        this._v3 = _v3;
        this._v4 = _v4;
        this._v5 = _v5;
        this._v6 = _v6;
        this._v7 = _v7;
        this._v8 = _v8;
        this._v9 = _v9;
        this._v10 = _v10;
        this._v11 = _v11;
        this._v12 = _v12;
        this._v13 = _v13;
        this._v14 = _v14;
        this._v15 = _v15;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    InlineArray16.prototype.get = function (index) {
        switch (index) {
            case 0:
                return this._v0;
            case 1:
                return this._v1;
            case 2:
                return this._v2;
            case 3:
                return this._v3;
            case 4:
                return this._v4;
            case 5:
                return this._v5;
            case 6:
                return this._v6;
            case 7:
                return this._v7;
            case 8:
                return this._v8;
            case 9:
                return this._v9;
            case 10:
                return this._v10;
            case 11:
                return this._v11;
            case 12:
                return this._v12;
            case 13:
                return this._v13;
            case 14:
                return this._v14;
            case 15:
                return this._v15;
            default:
                return undefined;
        }
    };
    /**
     * @param {?} index
     * @param {?} value
     * @return {?}
     */
    InlineArray16.prototype.set = function (index, value) {
        switch (index) {
            case 0:
                this._v0 = value;
                break;
            case 1:
                this._v1 = value;
                break;
            case 2:
                this._v2 = value;
                break;
            case 3:
                this._v3 = value;
                break;
            case 4:
                this._v4 = value;
                break;
            case 5:
                this._v5 = value;
                break;
            case 6:
                this._v6 = value;
                break;
            case 7:
                this._v7 = value;
                break;
            case 8:
                this._v8 = value;
                break;
            case 9:
                this._v9 = value;
                break;
            case 10:
                this._v10 = value;
                break;
            case 11:
                this._v11 = value;
                break;
            case 12:
                this._v12 = value;
                break;
            case 13:
                this._v13 = value;
                break;
            case 14:
                this._v14 = value;
                break;
            case 15:
                this._v15 = value;
                break;
        }
    };
    return InlineArray16;
}());
function InlineArray16_tsickle_Closure_declarations() {
    /** @type {?} */
    InlineArray16.prototype.length;
    /** @type {?} */
    InlineArray16.prototype._v0;
    /** @type {?} */
    InlineArray16.prototype._v1;
    /** @type {?} */
    InlineArray16.prototype._v2;
    /** @type {?} */
    InlineArray16.prototype._v3;
    /** @type {?} */
    InlineArray16.prototype._v4;
    /** @type {?} */
    InlineArray16.prototype._v5;
    /** @type {?} */
    InlineArray16.prototype._v6;
    /** @type {?} */
    InlineArray16.prototype._v7;
    /** @type {?} */
    InlineArray16.prototype._v8;
    /** @type {?} */
    InlineArray16.prototype._v9;
    /** @type {?} */
    InlineArray16.prototype._v10;
    /** @type {?} */
    InlineArray16.prototype._v11;
    /** @type {?} */
    InlineArray16.prototype._v12;
    /** @type {?} */
    InlineArray16.prototype._v13;
    /** @type {?} */
    InlineArray16.prototype._v14;
    /** @type {?} */
    InlineArray16.prototype._v15;
}
export var InlineArrayDynamic = (function () {
    /**
     * @param {?} length
     * @param {...?} values
     */
    function InlineArrayDynamic(length) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        this.length = length;
        this._values = values;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    InlineArrayDynamic.prototype.get = function (index) { return this._values[index]; };
    /**
     * @param {?} index
     * @param {?} value
     * @return {?}
     */
    InlineArrayDynamic.prototype.set = function (index, value) { this._values[index] = value; };
    return InlineArrayDynamic;
}());
function InlineArrayDynamic_tsickle_Closure_declarations() {
    /** @type {?} */
    InlineArrayDynamic.prototype._values;
    /** @type {?} */
    InlineArrayDynamic.prototype.length;
}
export var /** @type {?} */ EMPTY_INLINE_ARRAY = new InlineArray0();
//# sourceMappingURL=view_utils.js.map