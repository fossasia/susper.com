/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ScrollStrategy } from './scroll-strategy';
import { OverlayRef } from '../overlay-ref';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
/**
 * Strategy that will close the overlay as soon as the user starts scrolling.
 */
export declare class CloseScrollStrategy implements ScrollStrategy {
    private _scrollDispatcher;
    private _scrollSubscription;
    private _overlayRef;
    constructor(_scrollDispatcher: ScrollDispatcher);
    attach(overlayRef: OverlayRef): void;
    enable(): void;
    disable(): void;
}
