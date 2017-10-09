/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-browser')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/platform-browser'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.cdk = global.ng.cdk || {}, global.ng.cdk.bidi = global.ng.cdk.bidi || {}),global.ng.core,global.ng.platformBrowser));
}(this, (function (exports,_angular_core,_angular_platformBrowser) { 'use strict';

/**
 * Injection token used to inject the document into Directionality.
 * This is used so that the value can be faked in tests.
 *
 * We can't use the real document in tests because changing the real `dir` causes geometry-based
 * tests in Safari to fail.
 *
 * We also can't re-provide the DOCUMENT token from platform-brower because the unit tests
 * themselves use things like `querySelector` in test code.
 */
var DIR_DOCUMENT = new _angular_core.InjectionToken('mat-dir-doc');
/**
 * The directionality (LTR / RTL) context for the application (or a subtree of it).
 * Exposes the current direction and a stream of direction changes.
 */
var Directionality = (function () {
    /**
     * @param {?=} _document
     */
    function Directionality(_document) {
        this.value = 'ltr';
        this.change = new _angular_core.EventEmitter();
        if (_document) {
            // TODO: handle 'auto' value -
            // We still need to account for dir="auto".
            // It looks like HTMLElemenet.dir is also "auto" when that's set to the attribute,
            // but getComputedStyle return either "ltr" or "rtl". avoiding getComputedStyle for now
            var bodyDir = _document.body ? _document.body.dir : null;
            var htmlDir = _document.documentElement ? _document.documentElement.dir : null;
            this.value = (bodyDir || htmlDir || 'ltr');
        }
    }
    Directionality.decorators = [
        { type: _angular_core.Injectable },
    ];
    /**
     * @nocollapse
     */
    Directionality.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [DIR_DOCUMENT,] },] },
    ]; };
    return Directionality;
}());
/**
 * \@docs-private
 * @param {?} parentDirectionality
 * @param {?} _document
 * @return {?}
 */
function DIRECTIONALITY_PROVIDER_FACTORY(parentDirectionality, _document) {
    return parentDirectionality || new Directionality(_document);
}
/**
 * \@docs-private
 */
var DIRECTIONALITY_PROVIDER = {
    // If there is already a Directionality available, use that. Otherwise, provide a new one.
    provide: Directionality,
    deps: [[new _angular_core.Optional(), new _angular_core.SkipSelf(), Directionality], [new _angular_core.Optional(), _angular_platformBrowser.DOCUMENT]],
    useFactory: DIRECTIONALITY_PROVIDER_FACTORY
};

/**
 * Directive to listen for changes of direction of part of the DOM.
 *
 * Would provide itself in case a component looks for the Directionality service
 */
var Dir = (function () {
    function Dir() {
        /**
         * Layout direction of the element.
         */
        this._dir = 'ltr';
        /**
         * Whether the `value` has been set to its initial value.
         */
        this._isInitialized = false;
        /**
         * Event emitted when the direction changes.
         */
        this.change = new _angular_core.EventEmitter();
    }
    Object.defineProperty(Dir.prototype, "dir", {
        /**
         * \@docs-private
         * @return {?}
         */
        get: function () {
            return this._dir;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            var /** @type {?} */ old = this._dir;
            this._dir = v;
            if (old !== this._dir && this._isInitialized) {
                this.change.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dir.prototype, "value", {
        /**
         * Current layout direction of the element.
         * @return {?}
         */
        get: function () { return this.dir; },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize once default value has been set.
     * @return {?}
     */
    Dir.prototype.ngAfterContentInit = function () {
        this._isInitialized = true;
    };
    Dir.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: '[dir]',
                    providers: [{ provide: Directionality, useExisting: Dir }],
                    host: { '[dir]': 'dir' },
                    exportAs: 'dir',
                },] },
    ];
    /**
     * @nocollapse
     */
    Dir.ctorParameters = function () { return []; };
    Dir.propDecorators = {
        'change': [{ type: _angular_core.Output, args: ['dirChange',] },],
        'dir': [{ type: _angular_core.Input, args: ['dir',] },],
    };
    return Dir;
}());

var BidiModule = (function () {
    function BidiModule() {
    }
    BidiModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    exports: [Dir],
                    declarations: [Dir],
                    providers: [
                        { provide: DIR_DOCUMENT, useExisting: _angular_platformBrowser.DOCUMENT },
                        Directionality,
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    BidiModule.ctorParameters = function () { return []; };
    return BidiModule;
}());

exports.Directionality = Directionality;
exports.DIRECTIONALITY_PROVIDER_FACTORY = DIRECTIONALITY_PROVIDER_FACTORY;
exports.DIRECTIONALITY_PROVIDER = DIRECTIONALITY_PROVIDER;
exports.DIR_DOCUMENT = DIR_DOCUMENT;
exports.Dir = Dir;
exports.BidiModule = BidiModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cdk-bidi.umd.js.map
