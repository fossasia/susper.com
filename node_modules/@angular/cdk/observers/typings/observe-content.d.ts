/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, EventEmitter, OnDestroy, AfterContentInit, NgZone } from '@angular/core';
/**
 * Factory that creates a new MutationObserver and allows us to stub it out in unit tests.
 * @docs-private
 */
export declare class MatMutationObserverFactory {
    create(callback: MutationCallback): MutationObserver | null;
}
/**
 * Directive that triggers a callback whenever the content of
 * its associated element has changed.
 */
export declare class ObserveContent implements AfterContentInit, OnDestroy {
    private _mutationObserverFactory;
    private _elementRef;
    private _ngZone;
    private _observer;
    /** Event emitted for each change in the element's content. */
    event: EventEmitter<MutationRecord[]>;
    /** Used for debouncing the emitted values to the observeContent event. */
    private _debouncer;
    /** Debounce interval for emitting the changes. */
    debounce: number;
    constructor(_mutationObserverFactory: MatMutationObserverFactory, _elementRef: ElementRef, _ngZone: NgZone);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}
export declare class ObserversModule {
}
