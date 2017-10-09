/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Subject'), require('@angular/cdk/rxjs')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Subject', '@angular/cdk/rxjs'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.cdk = global.ng.cdk || {}, global.ng.cdk.observers = global.ng.cdk.observers || {}),global.ng.core,global.Rx,global.ng.cdk.rxjs));
}(this, (function (exports,_angular_core,rxjs_Subject,_angular_cdk_rxjs) { 'use strict';

/**
 * Factory that creates a new MutationObserver and allows us to stub it out in unit tests.
 * \@docs-private
 */
var MatMutationObserverFactory = (function () {
    function MatMutationObserverFactory() {
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    MatMutationObserverFactory.prototype.create = function (callback) {
        return typeof MutationObserver === 'undefined' ? null : new MutationObserver(callback);
    };
    MatMutationObserverFactory.decorators = [
        { type: _angular_core.Injectable },
    ];
    /**
     * @nocollapse
     */
    MatMutationObserverFactory.ctorParameters = function () { return []; };
    return MatMutationObserverFactory;
}());
/**
 * Directive that triggers a callback whenever the content of
 * its associated element has changed.
 */
var ObserveContent = (function () {
    /**
     * @param {?} _mutationObserverFactory
     * @param {?} _elementRef
     * @param {?} _ngZone
     */
    function ObserveContent(_mutationObserverFactory, _elementRef, _ngZone) {
        this._mutationObserverFactory = _mutationObserverFactory;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        /**
         * Event emitted for each change in the element's content.
         */
        this.event = new _angular_core.EventEmitter();
        /**
         * Used for debouncing the emitted values to the observeContent event.
         */
        this._debouncer = new rxjs_Subject.Subject();
    }
    /**
     * @return {?}
     */
    ObserveContent.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this.debounce > 0) {
            this._ngZone.runOutsideAngular(function () {
                _angular_cdk_rxjs.RxChain.from(_this._debouncer)
                    .call(_angular_cdk_rxjs.debounceTime, _this.debounce)
                    .subscribe(function (mutations) { return _this.event.emit(mutations); });
            });
        }
        else {
            this._debouncer.subscribe(function (mutations) { return _this.event.emit(mutations); });
        }
        this._observer = this._ngZone.runOutsideAngular(function () {
            return _this._mutationObserverFactory.create(function (mutations) {
                _this._debouncer.next(mutations);
            });
        });
        if (this._observer) {
            this._observer.observe(this._elementRef.nativeElement, {
                characterData: true,
                childList: true,
                subtree: true
            });
        }
    };
    /**
     * @return {?}
     */
    ObserveContent.prototype.ngOnDestroy = function () {
        if (this._observer) {
            this._observer.disconnect();
        }
        this._debouncer.complete();
    };
    ObserveContent.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: '[cdkObserveContent]',
                    exportAs: 'cdkObserveContent',
                },] },
    ];
    /**
     * @nocollapse
     */
    ObserveContent.ctorParameters = function () { return [
        { type: MatMutationObserverFactory, },
        { type: _angular_core.ElementRef, },
        { type: _angular_core.NgZone, },
    ]; };
    ObserveContent.propDecorators = {
        'event': [{ type: _angular_core.Output, args: ['cdkObserveContent',] },],
        'debounce': [{ type: _angular_core.Input },],
    };
    return ObserveContent;
}());
var ObserversModule = (function () {
    function ObserversModule() {
    }
    ObserversModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    exports: [ObserveContent],
                    declarations: [ObserveContent],
                    providers: [MatMutationObserverFactory]
                },] },
    ];
    /**
     * @nocollapse
     */
    ObserversModule.ctorParameters = function () { return []; };
    return ObserversModule;
}());

exports.MatMutationObserverFactory = MatMutationObserverFactory;
exports.ObserveContent = ObserveContent;
exports.ObserversModule = ObserversModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cdk-observers.umd.js.map
