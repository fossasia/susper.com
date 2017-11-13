/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Optional, NgZone, OnDestroy } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { ScrollDispatcher } from './scroll-dispatcher';
import { Observable } from 'rxjs/Observable';
/** Time in ms to throttle the resize events by default. */
export declare const DEFAULT_RESIZE_TIME = 20;
/**
 * Simple utility for getting the bounds of the browser viewport.
 * @docs-private
 */
export declare class ViewportRuler implements OnDestroy {
    /** Cached document client rectangle. */
    private _documentRect?;
    /** Stream of viewport change events. */
    private _change;
    /** Subscriptions to streams that invalidate the cached viewport dimensions. */
    private _invalidateCacheSubscriptions;
    constructor(platform: Platform, ngZone: NgZone, scrollDispatcher: ScrollDispatcher);
    ngOnDestroy(): void;
    /** Gets a ClientRect for the viewport's bounds. */
    getViewportRect(documentRect?: ClientRect | undefined): ClientRect;
    /**
     * Gets the (top, left) scroll position of the viewport.
     * @param documentRect
     */
    getViewportScrollPosition(documentRect?: ClientRect | undefined): {
        top: number;
        left: number;
    };
    /**
     * Returns a stream that emits whenever the size of the viewport changes.
     * @param throttle Time in milliseconds to throttle the stream.
     */
    change(throttleTime?: number): Observable<string>;
    /** Caches the latest client rectangle of the document element. */
    _cacheViewportGeometry(): void;
}
/** @docs-private */
export declare function VIEWPORT_RULER_PROVIDER_FACTORY(parentRuler: ViewportRuler, platform: Platform, ngZone: NgZone, scrollDispatcher: ScrollDispatcher): ViewportRuler;
/** @docs-private */
export declare const VIEWPORT_RULER_PROVIDER: {
    provide: typeof ViewportRuler;
    deps: (typeof ScrollDispatcher | Optional[] | typeof NgZone | typeof Platform)[];
    useFactory: (parentRuler: ViewportRuler, platform: Platform, ngZone: NgZone, scrollDispatcher: ScrollDispatcher) => ViewportRuler;
};
