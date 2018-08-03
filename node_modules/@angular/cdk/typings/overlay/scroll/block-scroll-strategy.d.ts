/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ScrollStrategy } from './scroll-strategy';
import { ViewportRuler } from '@angular/cdk/scrolling';
/**
 * Strategy that will prevent the user from scrolling while the overlay is visible.
 */
export declare class BlockScrollStrategy implements ScrollStrategy {
    private _viewportRuler;
    private _previousHTMLStyles;
    private _previousScrollPosition;
    private _isEnabled;
    constructor(_viewportRuler: ViewportRuler);
    attach(): void;
    enable(): void;
    disable(): void;
    private _canBeEnabled();
}
