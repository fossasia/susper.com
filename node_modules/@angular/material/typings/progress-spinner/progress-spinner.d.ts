/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnDestroy, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { CanColor } from '../core/common-behaviors/color';
/** Default stroke width as a percentage of the viewBox. */
export declare const PROGRESS_SPINNER_STROKE_WIDTH = 10;
export declare type ProgressSpinnerMode = 'determinate' | 'indeterminate';
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdProgressSpinnerCssMatStyler {
}
/** @docs-private */
export declare class MdProgressSpinnerBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MdProgressSpinnerMixinBase: (new (...args: any[]) => CanColor) & typeof MdProgressSpinnerBase;
/**
 * <md-progress-spinner> component.
 */
export declare class MdProgressSpinner extends _MdProgressSpinnerMixinBase implements OnDestroy, CanColor {
    private _ngZone;
    /** The id of the last requested animation. */
    private _lastAnimationId;
    /** The id of the indeterminate interval. */
    private _interdeterminateInterval;
    /** The SVG <path> node that is used to draw the circle. */
    private _path;
    private _mode;
    private _value;
    /** Stroke width of the progress spinner. By default uses 10px as stroke width. */
    strokeWidth: number;
    /**
     * Values for aria max and min are only defined as numbers when in a determinate mode.  We do this
     * because voiceover does not report the progress indicator as indeterminate if the aria min
     * and/or max value are number values.
     */
    readonly _ariaValueMin: number | null;
    readonly _ariaValueMax: number | null;
    /** @docs-private */
    /** @docs-private */
    interdeterminateInterval: number | null;
    /**
     * Clean up any animations that were running.
     */
    ngOnDestroy(): void;
    /** Value of the progress circle. It is bound to the host as the attribute aria-valuenow. */
    value: number;
    /**
     * Mode of the progress circle
     *
     * Input must be one of the values from ProgressMode, defaults to 'determinate'.
     * mode is bound to the host as the attribute host.
     */
    mode: ProgressSpinnerMode;
    constructor(renderer: Renderer2, elementRef: ElementRef, _ngZone: NgZone);
    /**
     * Animates the circle from one percentage value to another.
     *
     * @param animateFrom The percentage of the circle filled starting the animation.
     * @param animateTo The percentage of the circle filled ending the animation.
     * @param ease The easing function to manage the pace of change in the animation.
     * @param duration The length of time to show the animation, in milliseconds.
     * @param rotation The starting angle of the circle fill, with 0° represented at the top center
     *    of the circle.
     */
    private _animateCircle(animateFrom, animateTo, ease?, duration?, rotation?);
    /**
     * Starts the indeterminate animation interval, if it is not already running.
     */
    private _startIndeterminateAnimation();
    /**
     * Removes interval, ending the animation.
     */
    private _cleanupIndeterminateAnimation();
    /**
     * Renders the arc onto the SVG element. Proxies `getArc` while setting the proper
     * DOM attribute on the `<path>`.
     */
    private _renderArc(currentValue, rotation?);
}
/**
 * <md-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <md-progress-spinner> instance.
 */
export declare class MdSpinner extends MdProgressSpinner {
    constructor(elementRef: ElementRef, ngZone: NgZone, renderer: Renderer2);
}
