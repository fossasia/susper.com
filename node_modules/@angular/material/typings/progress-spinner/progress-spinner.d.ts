/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2, SimpleChanges, OnChanges } from '@angular/core';
import { CanColor } from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';
/** Possible mode for a progress spinner. */
export declare type ProgressSpinnerMode = 'determinate' | 'indeterminate';
/** @docs-private */
export declare class MatProgressSpinnerBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MatProgressSpinnerMixinBase: (new (...args: any[]) => CanColor) & typeof MatProgressSpinnerBase;
/**
 * <mat-progress-spinner> component.
 */
export declare class MatProgressSpinner extends _MatProgressSpinnerMixinBase implements CanColor, OnChanges {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    private _document;
    private _value;
    private readonly _baseSize;
    private readonly _baseStrokeWidth;
    private _fallbackAnimation;
    /** The width and height of the host element. Will grow with stroke width. **/
    _elementSize: number;
    /** Tracks diameters of existing instances to de-dupe generated styles (default d = 100) */
    static diameters: Set<number>;
    /** The diameter of the progress spinner (will set width and height of svg). */
    diameter: number;
    _diameter: number;
    /** Stroke width of the progress spinner. */
    strokeWidth: number;
    /** Mode of the progress circle */
    mode: ProgressSpinnerMode;
    /** Value of the progress circle. */
    value: number;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, platform: Platform, _document: any);
    ngOnChanges(changes: SimpleChanges): void;
    /** The radius of the spinner, adjusted for stroke width. */
    readonly _circleRadius: number;
    /** The view box of the spinner's svg element. */
    readonly _viewBox: string;
    /** The stroke circumference of the svg circle. */
    readonly _strokeCircumference: number;
    /** The dash offset of the svg circle. */
    readonly _strokeDashOffset: number | null;
    /** Sets the diameter and adds diameter-specific styles if necessary. */
    private _setDiameterAndInitStyles(size);
    /** Dynamically generates a style tag containing the correct animation for this diameter. */
    private _attachStyleNode();
    /** Generates animation styles adjusted for the spinner's diameter. */
    private _getAnimationText();
}
/**
 * <mat-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <mat-progress-spinner> instance.
 */
export declare class MatSpinner extends MatProgressSpinner {
    constructor(renderer: Renderer2, elementRef: ElementRef, platform: Platform, document: any);
}
