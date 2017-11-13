/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, Inject, Injectable, InjectionToken, Input, NgModule, Optional, Output, SkipSelf } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

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
const DIR_DOCUMENT = new InjectionToken('mat-dir-doc');
/**
 * The directionality (LTR / RTL) context for the application (or a subtree of it).
 * Exposes the current direction and a stream of direction changes.
 */
class Directionality {
    /**
     * @param {?=} _document
     */
    constructor(_document) {
        this.value = 'ltr';
        this.change = new EventEmitter();
        if (_document) {
            // TODO: handle 'auto' value -
            // We still need to account for dir="auto".
            // It looks like HTMLElemenet.dir is also "auto" when that's set to the attribute,
            // but getComputedStyle return either "ltr" or "rtl". avoiding getComputedStyle for now
            const bodyDir = _document.body ? _document.body.dir : null;
            const htmlDir = _document.documentElement ? _document.documentElement.dir : null;
            this.value = (bodyDir || htmlDir || 'ltr');
        }
    }
}
Directionality.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
Directionality.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DIR_DOCUMENT,] },] },
];
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
const DIRECTIONALITY_PROVIDER = {
    // If there is already a Directionality available, use that. Otherwise, provide a new one.
    provide: Directionality,
    deps: [[new Optional(), new SkipSelf(), Directionality], [new Optional(), DOCUMENT]],
    useFactory: DIRECTIONALITY_PROVIDER_FACTORY
};

/**
 * Directive to listen for changes of direction of part of the DOM.
 *
 * Would provide itself in case a component looks for the Directionality service
 */
class Dir {
    constructor() {
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
        this.change = new EventEmitter();
    }
    /**
     * \@docs-private
     * @return {?}
     */
    get dir() {
        return this._dir;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set dir(v) {
        let /** @type {?} */ old = this._dir;
        this._dir = v;
        if (old !== this._dir && this._isInitialized) {
            this.change.emit();
        }
    }
    /**
     * Current layout direction of the element.
     * @return {?}
     */
    get value() { return this.dir; }
    /**
     * Initialize once default value has been set.
     * @return {?}
     */
    ngAfterContentInit() {
        this._isInitialized = true;
    }
}
Dir.decorators = [
    { type: Directive, args: [{
                selector: '[dir]',
                providers: [{ provide: Directionality, useExisting: Dir }],
                host: { '[dir]': 'dir' },
                exportAs: 'dir',
            },] },
];
/**
 * @nocollapse
 */
Dir.ctorParameters = () => [];
Dir.propDecorators = {
    'change': [{ type: Output, args: ['dirChange',] },],
    'dir': [{ type: Input, args: ['dir',] },],
};

class BidiModule {
}
BidiModule.decorators = [
    { type: NgModule, args: [{
                exports: [Dir],
                declarations: [Dir],
                providers: [
                    { provide: DIR_DOCUMENT, useExisting: DOCUMENT },
                    Directionality,
                ]
            },] },
];
/**
 * @nocollapse
 */
BidiModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { Directionality, DIRECTIONALITY_PROVIDER_FACTORY, DIRECTIONALITY_PROVIDER, DIR_DOCUMENT, Dir, BidiModule };
//# sourceMappingURL=bidi.js.map
