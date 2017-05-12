/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, Pipe, WrappedValue } from '@angular/core';
import { isPromise } from '../private_import_core';
import { InvalidPipeArgumentError } from './invalid_pipe_argument_error';
var ObservableStrategy = (function () {
    function ObservableStrategy() {
    }
    /**
     * @param {?} async
     * @param {?} updateLatestValue
     * @return {?}
     */
    ObservableStrategy.prototype.createSubscription = function (async, updateLatestValue) {
        return async.subscribe({ next: updateLatestValue, error: function (e) { throw e; } });
    };
    /**
     * @param {?} subscription
     * @return {?}
     */
    ObservableStrategy.prototype.dispose = function (subscription) { subscription.unsubscribe(); };
    /**
     * @param {?} subscription
     * @return {?}
     */
    ObservableStrategy.prototype.onDestroy = function (subscription) { subscription.unsubscribe(); };
    return ObservableStrategy;
}());
var PromiseStrategy = (function () {
    function PromiseStrategy() {
    }
    /**
     * @param {?} async
     * @param {?} updateLatestValue
     * @return {?}
     */
    PromiseStrategy.prototype.createSubscription = function (async, updateLatestValue) {
        return async.then(updateLatestValue, function (e) { throw e; });
    };
    /**
     * @param {?} subscription
     * @return {?}
     */
    PromiseStrategy.prototype.dispose = function (subscription) { };
    /**
     * @param {?} subscription
     * @return {?}
     */
    PromiseStrategy.prototype.onDestroy = function (subscription) { };
    return PromiseStrategy;
}());
var /** @type {?} */ _promiseStrategy = new PromiseStrategy();
var /** @type {?} */ _observableStrategy = new ObservableStrategy();
/**
 *  The `async` pipe subscribes to an `Observable` or `Promise` and returns the latest value it has
  * emitted. When a new value is emitted, the `async` pipe marks the component to be checked for
  * changes. When the component gets destroyed, the `async` pipe unsubscribes automatically to avoid
  * potential memory leaks.
  * *
  * *
  * ## Examples
  * *
  * This example binds a `Promise` to the view. Clicking the `Resolve` button resolves the
  * promise.
  * *
  * {@example common/pipes/ts/async_pipe.ts region='AsyncPipePromise'}
  * *
  * It's also possible to use `async` with Observables. The example below binds the `time` Observable
  * to the view. The Observable continuously updates the view with the current time.
  * *
  * {@example common/pipes/ts/async_pipe.ts region='AsyncPipeObservable'}
  * *
 */
export var AsyncPipe = (function () {
    /**
     * @param {?} _ref
     */
    function AsyncPipe(_ref) {
        this._ref = _ref;
        this._latestValue = null;
        this._latestReturnedValue = null;
        this._subscription = null;
        this._obj = null;
        this._strategy = null;
    }
    /**
     * @return {?}
     */
    AsyncPipe.prototype.ngOnDestroy = function () {
        if (this._subscription) {
            this._dispose();
        }
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    AsyncPipe.prototype.transform = function (obj) {
        if (!this._obj) {
            if (obj) {
                this._subscribe(obj);
            }
            this._latestReturnedValue = this._latestValue;
            return this._latestValue;
        }
        if (obj !== this._obj) {
            this._dispose();
            return this.transform(obj);
        }
        if (this._latestValue === this._latestReturnedValue) {
            return this._latestReturnedValue;
        }
        this._latestReturnedValue = this._latestValue;
        return WrappedValue.wrap(this._latestValue);
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    AsyncPipe.prototype._subscribe = function (obj) {
        var _this = this;
        this._obj = obj;
        this._strategy = this._selectStrategy(obj);
        this._subscription = this._strategy.createSubscription(obj, function (value) { return _this._updateLatestValue(obj, value); });
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    AsyncPipe.prototype._selectStrategy = function (obj) {
        if (isPromise(obj)) {
            return _promiseStrategy;
        }
        if (((obj)).subscribe) {
            return _observableStrategy;
        }
        throw new InvalidPipeArgumentError(AsyncPipe, obj);
    };
    /**
     * @return {?}
     */
    AsyncPipe.prototype._dispose = function () {
        this._strategy.dispose(this._subscription);
        this._latestValue = null;
        this._latestReturnedValue = null;
        this._subscription = null;
        this._obj = null;
    };
    /**
     * @param {?} async
     * @param {?} value
     * @return {?}
     */
    AsyncPipe.prototype._updateLatestValue = function (async, value) {
        if (async === this._obj) {
            this._latestValue = value;
            this._ref.markForCheck();
        }
    };
    AsyncPipe.decorators = [
        { type: Pipe, args: [{ name: 'async', pure: false },] },
    ];
    /** @nocollapse */
    AsyncPipe.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    return AsyncPipe;
}());
function AsyncPipe_tsickle_Closure_declarations() {
    /** @type {?} */
    AsyncPipe.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    AsyncPipe.ctorParameters;
    /** @type {?} */
    AsyncPipe.prototype._latestValue;
    /** @type {?} */
    AsyncPipe.prototype._latestReturnedValue;
    /** @type {?} */
    AsyncPipe.prototype._subscription;
    /** @type {?} */
    AsyncPipe.prototype._obj;
    /** @type {?} */
    AsyncPipe.prototype._strategy;
    /** @type {?} */
    AsyncPipe.prototype._ref;
}
//# sourceMappingURL=async_pipe.js.map