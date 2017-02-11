(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/observable/merge'), require('rxjs/operator/ignoreElements'), require('@angular/core'), require('@ngrx/store'), require('rxjs/Observable'), require('rxjs/operator/filter'), require('rxjs/Subscription')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rxjs/observable/merge', 'rxjs/operator/ignoreElements', '@angular/core', '@ngrx/store', 'rxjs/Observable', 'rxjs/operator/filter', 'rxjs/Subscription'], factory) :
    (factory((global.ngrx = global.ngrx || {}, global.ngrx.effects = global.ngrx.effects || {}),global.Rx.Observable,global.Rx.Observable.prototype,global.ng.core,global.ngrx.store,global.Rx,global.Rx.Observable.prototype,global.Rx));
}(this, (function (exports,rxjs_observable_merge,rxjs_operator_ignoreElements,_angular_core,_ngrx_store,rxjs_Observable,rxjs_operator_filter,rxjs_Subscription) { 'use strict';

var METADATA_KEY = '@ngrx/effects';
function Effect(_a) {
    var dispatch = (_a === void 0 ? { dispatch: true } : _a).dispatch;
    return function (target, propertyName) {
        if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
            Reflect.defineMetadata(METADATA_KEY, [], target);
        }
        var effects = Reflect.getOwnMetadata(METADATA_KEY, target);
        var metadata = { propertyName: propertyName, dispatch: dispatch };
        Reflect.defineMetadata(METADATA_KEY, effects.concat([metadata]), target);
    };
}
function getEffectsMetadata(instance) {
    var target = Object.getPrototypeOf(instance);
    if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
        return [];
    }
    return Reflect.getOwnMetadata(METADATA_KEY, target);
}
function mergeEffects(instance) {
    var observables = getEffectsMetadata(instance).map(function (_a) {
        var propertyName = _a.propertyName, dispatch = _a.dispatch;
        var observable = typeof instance[propertyName] === 'function' ?
            instance[propertyName]() : instance[propertyName];
        if (dispatch === false) {
            return rxjs_operator_ignoreElements.ignoreElements.call(observable);
        }
        return observable;
    });
    return rxjs_observable_merge.merge.apply(void 0, observables);
}

var __extends = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Actions = (function (_super) {
    __extends(Actions, _super);
    function Actions(actionsSubject) {
        _super.call(this);
        this.source = actionsSubject;
    }
    Actions.prototype.lift = function (operator) {
        var observable = new Actions(this);
        observable.operator = operator;
        return observable;
    };
    Actions.prototype.ofType = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        return rxjs_operator_filter.filter.call(this, function (_a) {
            var type = _a.type;
            var len = keys.length;
            if (len === 1) {
                return type === keys[0];
            }
            else {
                for (var i = 0; i < len; i++) {
                    if (keys[i] === type) {
                        return true;
                    }
                }
            }
            return false;
        });
    };
    Actions.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    Actions.ctorParameters = [
        { type: rxjs_Observable.Observable, decorators: [{ type: _angular_core.Inject, args: [_ngrx_store.Dispatcher,] },] },
    ];
    return Actions;
}(rxjs_Observable.Observable));

var __extends$1 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var effects = new _angular_core.OpaqueToken('ngrx/effects: Effects');
var EffectsSubscription = (function (_super) {
    __extends$1(EffectsSubscription, _super);
    function EffectsSubscription(store, parent, effectInstances) {
        _super.call(this);
        this.store = store;
        this.parent = parent;
        if (Boolean(parent)) {
            parent.add(this);
        }
        if (Boolean(effectInstances)) {
            this.addEffects(effectInstances);
        }
    }
    EffectsSubscription.prototype.addEffects = function (effectInstances) {
        var sources = effectInstances.map(mergeEffects);
        var merged = rxjs_observable_merge.merge.apply(void 0, sources);
        this.add(merged.subscribe(this.store));
    };
    EffectsSubscription.prototype.ngOnDestroy = function () {
        if (!this.closed) {
            this.unsubscribe();
        }
    };
    EffectsSubscription.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    EffectsSubscription.ctorParameters = [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_ngrx_store.Store,] },] },
        { type: EffectsSubscription, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
        { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [effects,] },] },
    ];
    return EffectsSubscription;
}(rxjs_Subscription.Subscription));

var afterBootstrapEffects = new _angular_core.OpaqueToken('ngrx:effects: Bootstrap Effects');
function runAfterBootstrapEffects(injector, subscription) {
    return function () {
        var effectInstances = injector.get(afterBootstrapEffects, false);
        if (effectInstances) {
            subscription.addEffects(effectInstances);
        }
    };
}

var EffectsModule = (function () {
    function EffectsModule() {
    }
    EffectsModule.run = function (type) {
        return {
            ngModule: EffectsModule,
            providers: [
                EffectsSubscription,
                type,
                { provide: effects, useExisting: type, multi: true }
            ]
        };
    };
    EffectsModule.runAfterBootstrap = function (type) {
        return {
            ngModule: EffectsModule,
            providers: [
                type,
                { provide: afterBootstrapEffects, useExisting: type, multi: true }
            ]
        };
    };
    EffectsModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [
                        Actions,
                        EffectsSubscription,
                        {
                            provide: _angular_core.APP_BOOTSTRAP_LISTENER,
                            multi: true,
                            deps: [_angular_core.Injector, EffectsSubscription],
                            useFactory: runAfterBootstrapEffects
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    EffectsModule.ctorParameters = [];
    return EffectsModule;
}());

function toPayload(action) {
    return action.payload;
}

exports.Effect = Effect;
exports.mergeEffects = mergeEffects;
exports.Actions = Actions;
exports.EffectsModule = EffectsModule;
exports.EffectsSubscription = EffectsSubscription;
exports.toPayload = toPayload;

Object.defineProperty(exports, '__esModule', { value: true });

})));