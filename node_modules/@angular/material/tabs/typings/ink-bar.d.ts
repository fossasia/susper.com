/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Renderer2, ElementRef, NgZone } from '@angular/core';
/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * @docs-private
 */
export declare class MatInkBar {
    private _renderer;
    private _elementRef;
    private _ngZone;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _ngZone: NgZone);
    /**
     * Calculates the styles from the provided element in order to align the ink-bar to that element.
     * Shows the ink bar if previously set as hidden.
     * @param element
     */
    alignToElement(element: HTMLElement): void;
    /** Shows the ink bar. */
    show(): void;
    /** Hides the ink bar. */
    hide(): void;
    /**
     * Sets the proper styles to the ink bar element.
     * @param element
     */
    private _setStyles(element);
}
