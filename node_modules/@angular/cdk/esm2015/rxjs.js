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
class RxChain {
    /**
     * @param {?} _context
     */
    constructor(_context) {
        this._context = _context;
    }
    /**
     * Starts a new chain and specifies the initial `this` value.
     * @template O
     * @param {?} context Initial `this` value for the chain.
     * @return {?}
     */
    static from(context) {
        return new RxChain(context);
    }
    /**
     * Invokes an RxJS operator as a part of the chain.
     * @param {?} operator Operator to be invoked.
     * @param {...?} args Arguments to be passed to the operator.
     * @return {?}
     */
    call(operator, ...args) {
        this._context = operator.call(this._context, ...args);
        return this;
    }
    /**
     * Subscribes to the result of the chain.
     * @param {?} fn Callback to be invoked when the result emits a value.
     * @return {?}
     */
    subscribe(fn) {
        return this._context.subscribe(fn);
    }
    /**
     * Returns the result of the chain.
     * @return {?}
     */
    result() {
        return this._context;
    }
}

class FinallyBrand {
}
class CatchBrand {
}
class DoBrand {
}
class MapBrand {
}
class FilterBrand {
}
class ShareBrand {
}
class FirstBrand {
}
class SwitchMapBrand {
}
class StartWithBrand {
}
class DebounceTimeBrand {
}
class AuditTimeBrand {
}
class TakeUntilBrand {
}
class DelayBrand {
}
// We add `Function` to the type intersection to make this nomically different from
// `finallyOperatorType` while still being structurally the same. Without this, TypeScript tries to
// reduce `typeof _finallyOperator & FinallyBrand` to `finallyOperatorType<T>` and then fails
// because `T` isn't known.
const finallyOperator = (_finally);
const catchOperator = (_catch);
const doOperator = (_do);
const map$1 = (map);
const filter$1 = (filter);
const share$1 = (share);
const first$1 = (first);
const switchMap$1 = (switchMap);
const startWith$1 = (startWith);
const debounceTime$1 = (debounceTime);
const auditTime$1 = (auditTime);
const takeUntil$1 = (takeUntil);
const delay$1 = (delay);

/**
 * Generated bundle index. Do not edit.
 */

export { RxChain, FinallyBrand, CatchBrand, DoBrand, MapBrand, FilterBrand, ShareBrand, FirstBrand, SwitchMapBrand, StartWithBrand, DebounceTimeBrand, AuditTimeBrand, TakeUntilBrand, DelayBrand, finallyOperator, catchOperator, doOperator, map$1 as map, filter$1 as filter, share$1 as share, first$1 as first, switchMap$1 as switchMap, startWith$1 as startWith, debounceTime$1 as debounceTime, auditTime$1 as auditTime, takeUntil$1 as takeUntil, delay$1 as delay };
//# sourceMappingURL=rxjs.js.map
