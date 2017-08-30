/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnInit, OnDestroy, NgZone, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ScrollDispatcher } from './scroll-dispatcher';
/**
 * Sends an event when the directive's element is scrolled. Registers itself with the
 * ScrollDispatcher service to include itself as part of its collection of scrolling events that it
 * can be listened to through the service.
 */
export declare class Scrollable implements OnInit, OnDestroy {
    private _elementRef;
    private _scroll;
    private _ngZone;
    private _renderer;
    private _elementScrolled;
    private _scrollListener;
    constructor(_elementRef: ElementRef, _scroll: ScrollDispatcher, _ngZone: NgZone, _renderer: Renderer2);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Returns observable that emits when a scroll event is fired on the host element.
     */
    elementScrolled(): Observable<any>;
    getElementRef(): ElementRef;
}
