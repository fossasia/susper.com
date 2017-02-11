(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/ReplaySubject'), require('@ngrx/effects')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/ReplaySubject', '@ngrx/effects'], factory) :
    (factory((global.ngrx = global.ngrx || {}, global.ngrx.effects = global.ngrx.effects || {}, global.ngrx.effects.testing = global.ngrx.effects.testing || {}),global.ng.core,global.Rx,global.ngrx.effects));
}(this, (function (exports,_angular_core,rxjs_ReplaySubject,_ngrx_effects) { 'use strict';

var __extends = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EffectsRunner = (function (_super) {
    __extends(EffectsRunner, _super);
    function EffectsRunner() {
        _super.call(this);
    }
    EffectsRunner.prototype.queue = function (action) {
        this.next(action);
    };
    EffectsRunner.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    EffectsRunner.ctorParameters = [];
    return EffectsRunner;
}(rxjs_ReplaySubject.ReplaySubject));

function _createActions(runner) {
    return new _ngrx_effects.Actions(runner);
}
var EffectsTestingModule = (function () {
    function EffectsTestingModule() {
    }
    EffectsTestingModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [
                        EffectsRunner,
                        { provide: _ngrx_effects.Actions, deps: [EffectsRunner], useFactory: _createActions }
                    ]
                },] },
    ];
    /** @nocollapse */
    EffectsTestingModule.ctorParameters = [];
    return EffectsTestingModule;
}());

exports.EffectsRunner = EffectsRunner;
exports._createActions = _createActions;
exports.EffectsTestingModule = EffectsTestingModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));