/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { _finally } from 'rxjs/operator/finally';
import { _catch } from 'rxjs/operator/catch';
import { _do } from 'rxjs/operator/do';
import { map } from 'rxjs/operator/map';
import { filter } from 'rxjs/operator/filter';
import { share } from 'rxjs/operator/share';
import { first } from 'rxjs/operator/first';
import { switchMap } from 'rxjs/operator/switchMap';
import { startWith } from 'rxjs/operator/startWith';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { auditTime } from 'rxjs/operator/auditTime';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { delay } from 'rxjs/operator/delay';

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
var finallyOperator = (_finally);
var catchOperator = (_catch);
var doOperator = (_do);
var map$1 = (map);
var filter$1 = (filter);
var share$1 = (share);
var first$1 = (first);
var switchMap$1 = (switchMap);
var startWith$1 = (startWith);
var debounceTime$1 = (debounceTime);
var auditTime$1 = (auditTime);
var takeUntil$1 = (takeUntil);
var delay$1 = (delay);

/**
 * Generated bundle index. Do not edit.
 */

export { RxChain, FinallyBrand, CatchBrand, DoBrand, MapBrand, FilterBrand, ShareBrand, FirstBrand, SwitchMapBrand, StartWithBrand, DebounceTimeBrand, AuditTimeBrand, TakeUntilBrand, DelayBrand, finallyOperator, catchOperator, doOperator, map$1 as map, filter$1 as filter, share$1 as share, first$1 as first, switchMap$1 as switchMap, startWith$1 as startWith, debounceTime$1 as debounceTime, auditTime$1 as auditTime, takeUntil$1 as takeUntil, delay$1 as delay };
//# sourceMappingURL=rxjs.es5.js.map
