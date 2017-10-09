/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2 } from '@angular/core';
import { CanColor } from '@angular/material/core';
export declare class MatToolbarRow {
}
/** @docs-private */
export declare class MatToolbarBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MatToolbarMixinBase: (new (...args: any[]) => CanColor) & typeof MatToolbarBase;
export declare class MatToolbar extends _MatToolbarMixinBase implements CanColor {
    constructor(renderer: Renderer2, elementRef: ElementRef);
}
