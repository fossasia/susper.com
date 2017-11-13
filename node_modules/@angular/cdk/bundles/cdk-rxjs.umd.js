/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/operator/finally'), require('rxjs/operator/catch'), require('rxjs/operator/do'), require('rxjs/operator/map'), require('rxjs/operator/filter'), require('rxjs/operator/share'), require('rxjs/operator/first'), require('rxjs/operator/switchMap'), require('rxjs/operator/startWith'), require('rxjs/operator/debounceTime'), require('rxjs/operator/auditTime'), require('rxjs/operator/takeUntil'), require('rxjs/operator/delay')) :
	typeof define === 'function' && define.amd ? define(['exports', 'rxjs/operator/finally', 'rxjs/operator/catch', 'rxjs/operator/do', 'rxjs/operator/map', 'rxjs/operator/filter', 'rxjs/operator/share', 'rxjs/operator/first', 'rxjs/operator/switchMap', 'rxjs/operator/startWith', 'rxjs/operator/debounceTime', 'rxjs/operator/auditTime', 'rxjs/operator/takeUntil', 'rxjs/operator/delay'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.cdk = global.ng.cdk || {}, global.ng.cdk.rxjs = global.ng.cdk.rxjs || {}),global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,rxjs_operator_finally,rxjs_operator_catch,rxjs_operator_do,rxjs_operator_map,rxjs_operator_filter,rxjs_operator_share,rxjs_operator_first,rxjs_operator_switchMap,rxjs_operator_startWith,rxjs_operator_debounceTime,rxjs_operator_auditTime,rxjs_operator_takeUntil,rxjs_operator_delay) { 'use strict';

/**
 * Utility class used to chain RxJS operators.
 *
 * This class is the concrete implementation, but the type used by the user when chaining
 * is StrictRxChain. The strict chain enforces types on the operators to the same level as
 * the prototype-added equivalents.
 */
var RxChain = (function () {
    /**
     * @param {?} _context
     */
    function RxChain(_context) {
        this._context = _context;
    }
    /**
     * Starts a new chain and specifies the initial `this` value.
     * @template O
     * @param {?} context Initial `this` value for the chain.
     * @return {?}
     */
    RxChain.from = function (context) {
        return new RxChain(context);
    };
    /**
     * Invokes an RxJS operator as a part of the chain.
     * @param {?} operator Operator to be invoked.
     * @param {...?} args Arguments to be passed to the operator.
     * @return {?}
     */
    RxChain.prototype.call = function (operator) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._context = operator.call.apply(operator, [this._context].concat(args));
        return this;
    };
    /**
     * Subscribes to the result of the chain.
     * @param {?} fn Callback to be invoked when the result emits a value.
     * @return {?}
     */
    RxChain.prototype.subscribe = function (fn) {
        return this._context.subscribe(fn);
    };
    /**
     * Returns the result of the chain.
     * @return {?}
     */
    RxChain.prototype.result = function () {
        return this._context;
    };
    return RxChain;
}());

var FinallyBrand = (function () {
    function FinallyBrand() {
    }
    return FinallyBrand;
}());
var CatchBrand = (function () {
    function CatchBrand() {
    }
    return CatchBrand;
}());
var DoBrand = (function () {
    function DoBrand() {
    }
    return DoBrand;
}());
var MapBrand = (function () {
    function MapBrand() {
    }
    return MapBrand;
}());
var FilterBrand = (function () {
    function FilterBrand() {
    }
    return FilterBrand;
}());
var ShareBrand = (function () {
    function ShareBrand() {
    }
    return ShareBrand;
}());
var FirstBrand = (function () {
    function FirstBrand() {
    }
    return FirstBrand;
}());
var SwitchMapBrand = (function () {
    function SwitchMapBrand() {
    }
    return SwitchMapBrand;
}());
var StartWithBrand = (function () {
    function StartWithBrand() {
    }
    return StartWithBrand;
}());
var DebounceTimeBrand = (function () {
    function DebounceTimeBrand() {
    }
    return DebounceTimeBrand;
}());
var AuditTimeBrand = (function () {
    function AuditTimeBrand() {
    }
    return AuditTimeBrand;
}());
var TakeUntilBrand = (function () {
    function TakeUntilBrand() {
    }
    return TakeUntilBrand;
}());
var DelayBrand = (function () {
    function DelayBrand() {
    }
    return DelayBrand;
}());
// We add `Function` to the type intersection to make this nomically different from
// `finallyOperatorType` while still being structurally the same. Without this, TypeScript tries to
// reduce `typeof _finallyOperator & FinallyBrand` to `finallyOperatorType<T>` and then fails
// because `T` isn't known.
var finallyOperator = (rxjs_operator_finally._finally);
var catchOperator = (rxjs_operator_catch._catch);
var doOperator = (rxjs_operator_do._do);
var map$1 = (rxjs_operator_map.map);
var filter$1 = (rxjs_operator_filter.filter);
var share$1 = (rxjs_operator_share.share);
var first$1 = (rxjs_operator_first.first);
var switchMap$1 = (rxjs_operator_switchMap.switchMap);
var startWith$1 = (rxjs_operator_startWith.startWith);
var debounceTime$1 = (rxjs_operator_debounceTime.debounceTime);
var auditTime$1 = (rxjs_operator_auditTime.auditTime);
var takeUntil$1 = (rxjs_operator_takeUntil.takeUntil);
var delay$1 = (rxjs_operator_delay.delay);

exports.RxChain = RxChain;
exports.FinallyBrand = FinallyBrand;
exports.CatchBrand = CatchBrand;
exports.DoBrand = DoBrand;
exports.MapBrand = MapBrand;
exports.FilterBrand = FilterBrand;
exports.ShareBrand = ShareBrand;
exports.FirstBrand = FirstBrand;
exports.SwitchMapBrand = SwitchMapBrand;
exports.StartWithBrand = StartWithBrand;
exports.DebounceTimeBrand = DebounceTimeBrand;
exports.AuditTimeBrand = AuditTimeBrand;
exports.TakeUntilBrand = TakeUntilBrand;
exports.DelayBrand = DelayBrand;
exports.finallyOperator = finallyOperator;
exports.catchOperator = catchOperator;
exports.doOperator = doOperator;
exports.map = map$1;
exports.filter = filter$1;
exports.share = share$1;
exports.first = first$1;
exports.switchMap = switchMap$1;
exports.startWith = startWith$1;
exports.debounceTime = debounceTime$1;
exports.auditTime = auditTime$1;
exports.takeUntil = takeUntil$1;
exports.delay = delay$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cdk-rxjs.umd.js.map
