/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, NgModule, NgZone, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdCommonModule, mixinColor } from '@angular/material/core';

/**
 * A single degree in radians.
 */
const DEGREE_IN_RADIANS = Math.PI / 180;
/**
 * Duration of the indeterminate animation.
 */
const DURATION_INDETERMINATE = 667;
/**
 * Duration of the indeterminate animation.
 */
const DURATION_DETERMINATE = 225;
/**
 * Start animation value of the indeterminate animation
 */
const startIndeterminate = 3;
/**
 * End animation value of the indeterminate animation
 */
const endIndeterminate = 80;
/**
 * Maximum angle for the arc. The angle can't be exactly 360, because the arc becomes hidden.
 */
const MAX_ANGLE = 359.99 / 100;
/**
 * Whether the user's browser supports requestAnimationFrame.
 */
const HAS_RAF = typeof requestAnimationFrame !== 'undefined';
/**
 * Default stroke width as a percentage of the viewBox.
 */
const PROGRESS_SPINNER_STROKE_WIDTH = 10;
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MdProgressSpinnerCssMatStyler {
}
MdProgressSpinnerCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-progress-spinner, mat-progress-spinner',
                host: { 'class': 'mat-progress-spinner' }
            },] },
];
/**
 * @nocollapse
 */
MdProgressSpinnerCssMatStyler.ctorParameters = () => [];
/**
 * \@docs-private
 */
class MdProgressSpinnerBase {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
}
const _MdProgressSpinnerMixinBase = mixinColor(MdProgressSpinnerBase, 'primary');
/**
 * <md-progress-spinner> component.
 */
class MdProgressSpinner extends _MdProgressSpinnerMixinBase {
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _ngZone
     */
    constructor(renderer, elementRef, _ngZone) {
        super(renderer, elementRef);
        this._ngZone = _ngZone;
        /**
         * The id of the last requested animation.
         */
        this._lastAnimationId = 0;
        this._mode = 'determinate';
        /**
         * Stroke width of the progress spinner. By default uses 10px as stroke width.
         */
        this.strokeWidth = PROGRESS_SPINNER_STROKE_WIDTH;
    }
    /**
     * Values for aria max and min are only defined as numbers when in a determinate mode.  We do this
     * because voiceover does not report the progress indicator as indeterminate if the aria min
     * and/or max value are number values.
     * @return {?}
     */
    get _ariaValueMin() {
        return this.mode == 'determinate' ? 0 : null;
    }
    /**
     * @return {?}
     */
    get _ariaValueMax() {
        return this.mode == 'determinate' ? 100 : null;
    }
    /**
     * \@docs-private
     * @return {?}
     */
    get interdeterminateInterval() {
        return this._interdeterminateInterval;
    }
    /**
     * \@docs-private
     * @param {?} interval
     * @return {?}
     */
    set interdeterminateInterval(interval) {
        if (this._interdeterminateInterval) {
            clearInterval(this._interdeterminateInterval);
        }
        this._interdeterminateInterval = interval;
    }
    /**
     * Clean up any animations that were running.
     * @return {?}
     */
    ngOnDestroy() {
        this._cleanupIndeterminateAnimation();
    }
    /**
     * Value of the progress circle. It is bound to the host as the attribute aria-valuenow.
     * @return {?}
     */
    get value() {
        if (this.mode == 'determinate') {
            return this._value;
        }
        return 0;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set value(v) {
        if (v != null && this.mode == 'determinate') {
            let /** @type {?} */ newValue = clamp(v);
            this._animateCircle(this.value || 0, newValue);
            this._value = newValue;
        }
    }
    /**
     * Mode of the progress circle
     *
     * Input must be one of the values from ProgressMode, defaults to 'determinate'.
     * mode is bound to the host as the attribute host.
     * @return {?}
     */
    get mode() { return this._mode; }
    /**
     * @param {?} mode
     * @return {?}
     */
    set mode(mode) {
        if (mode !== this._mode) {
            if (mode === 'indeterminate') {
                this._startIndeterminateAnimation();
            }
            else {
                this._cleanupIndeterminateAnimation();
                this._animateCircle(0, this._value);
            }
            this._mode = mode;
        }
    }
    /**
     * Animates the circle from one percentage value to another.
     *
     * @param {?} animateFrom The percentage of the circle filled starting the animation.
     * @param {?} animateTo The percentage of the circle filled ending the animation.
     * @param {?=} ease The easing function to manage the pace of change in the animation.
     * @param {?=} duration The length of time to show the animation, in milliseconds.
     * @param {?=} rotation The starting angle of the circle fill, with 0° represented at the top center
     *    of the circle.
     * @return {?}
     */
    _animateCircle(animateFrom, animateTo, ease = linearEase, duration = DURATION_DETERMINATE, rotation = 0) {
        let /** @type {?} */ id = ++this._lastAnimationId;
        let /** @type {?} */ startTime = Date.now();
        let /** @type {?} */ changeInValue = animateTo - animateFrom;
        // No need to animate it if the values are the same
        if (animateTo === animateFrom) {
            this._renderArc(animateTo, rotation);
        }
        else {
            let /** @type {?} */ animation = () => {
                // If there is no requestAnimationFrame, skip ahead to the end of the animation.
                let /** @type {?} */ elapsedTime = HAS_RAF ?
                    Math.max(0, Math.min(Date.now() - startTime, duration)) :
                    duration;
                this._renderArc(ease(elapsedTime, animateFrom, changeInValue, duration), rotation);
                // Prevent overlapping animations by checking if a new animation has been called for and
                // if the animation has lasted longer than the animation duration.
                if (id === this._lastAnimationId && elapsedTime < duration) {
                    requestAnimationFrame(animation);
                }
            };
            // Run the animation outside of Angular's zone, in order to avoid
            // hitting ZoneJS and change detection on each frame.
            this._ngZone.runOutsideAngular(animation);
        }
    }
    /**
     * Starts the indeterminate animation interval, if it is not already running.
     * @return {?}
     */
    _startIndeterminateAnimation() {
        let /** @type {?} */ rotationStartPoint = 0;
        let /** @type {?} */ start = startIndeterminate;
        let /** @type {?} */ end = endIndeterminate;
        let /** @type {?} */ duration = DURATION_INDETERMINATE;
        let /** @type {?} */ animate = () => {
            this._animateCircle(start, end, materialEase, duration, rotationStartPoint);
            // Prevent rotation from reaching Number.MAX_SAFE_INTEGER.
            rotationStartPoint = (rotationStartPoint + end) % 100;
            let /** @type {?} */ temp = start;
            start = -end;
            end = -temp;
        };
        if (!this.interdeterminateInterval) {
            this._ngZone.runOutsideAngular(() => {
                this.interdeterminateInterval = setInterval(animate, duration + 50, 0, false);
                animate();
            });
        }
    }
    /**
     * Removes interval, ending the animation.
     * @return {?}
     */
    _cleanupIndeterminateAnimation() {
        this.interdeterminateInterval = null;
    }
    /**
     * Renders the arc onto the SVG element. Proxies `getArc` while setting the proper
     * DOM attribute on the `<path>`.
     * @param {?} currentValue
     * @param {?=} rotation
     * @return {?}
     */
    _renderArc(currentValue, rotation = 0) {
        if (this._path) {
            const /** @type {?} */ svgArc = getSvgArc(currentValue, rotation, this.strokeWidth);
            this._renderer.setAttribute(this._path.nativeElement, 'd', svgArc);
        }
    }
}
MdProgressSpinner.decorators = [
    { type: Component, args: [{selector: 'md-progress-spinner, mat-progress-spinner',
                host: {
                    'role': 'progressbar',
                    'class': 'mat-progress-spinner',
                    '[attr.aria-valuemin]': '_ariaValueMin',
                    '[attr.aria-valuemax]': '_ariaValueMax',
                    '[attr.aria-valuenow]': 'value',
                    '[attr.mode]': 'mode',
                },
                inputs: ['color'],
                template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\" focusable=\"false\"><path #path [style.strokeWidth]=\"strokeWidth\"></path></svg>",
                styles: [".mat-progress-spinner{display:block;height:100px;width:100px;overflow:hidden}.mat-progress-spinner svg{height:100%;width:100%;transform-origin:center}.mat-progress-spinner path{fill:transparent;transition:stroke .3s cubic-bezier(.35,0,.25,1)}.mat-progress-spinner[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:mat-progress-spinner-sporadic-rotate,mat-progress-spinner-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
MdProgressSpinner.ctorParameters = () => [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: NgZone, },
];
MdProgressSpinner.propDecorators = {
    '_path': [{ type: ViewChild, args: ['path',] },],
    'strokeWidth': [{ type: Input },],
    'value': [{ type: Input },],
    'mode': [{ type: Input },],
};
/**
 * <md-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <md-progress-spinner> instance.
 */
class MdSpinner extends MdProgressSpinner {
    /**
     * @param {?} elementRef
     * @param {?} ngZone
     * @param {?} renderer
     */
    constructor(elementRef, ngZone, renderer) {
        super(renderer, elementRef, ngZone);
        this.mode = 'indeterminate';
    }
}
MdSpinner.decorators = [
    { type: Component, args: [{selector: 'md-spinner, mat-spinner',
                host: {
                    'role': 'progressbar',
                    'mode': 'indeterminate',
                    'class': 'mat-spinner mat-progress-spinner',
                },
                inputs: ['color'],
                template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\" focusable=\"false\"><path #path [style.strokeWidth]=\"strokeWidth\"></path></svg>",
                styles: [".mat-progress-spinner{display:block;height:100px;width:100px;overflow:hidden}.mat-progress-spinner svg{height:100%;width:100%;transform-origin:center}.mat-progress-spinner path{fill:transparent;transition:stroke .3s cubic-bezier(.35,0,.25,1)}.mat-progress-spinner[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:mat-progress-spinner-sporadic-rotate,mat-progress-spinner-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
MdSpinner.ctorParameters = () => [
    { type: ElementRef, },
    { type: NgZone, },
    { type: Renderer2, },
];
/**
 * Clamps a value to be between 0 and 100.
 * @param {?} v
 * @return {?}
 */
function clamp(v) {
    return Math.max(0, Math.min(100, v));
}
/**
 * Converts Polar coordinates to Cartesian.
 * @param {?} radius
 * @param {?} pathRadius
 * @param {?} angleInDegrees
 * @return {?}
 */
function polarToCartesian(radius, pathRadius, angleInDegrees) {
    let /** @type {?} */ angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;
    return (radius + (pathRadius * Math.cos(angleInRadians))) +
        ',' + (radius + (pathRadius * Math.sin(angleInRadians)));
}
/**
 * Easing function for linear animation.
 * @param {?} currentTime
 * @param {?} startValue
 * @param {?} changeInValue
 * @param {?} duration
 * @return {?}
 */
function linearEase(currentTime, startValue, changeInValue, duration) {
    return changeInValue * currentTime / duration + startValue;
}
/**
 * Easing function to match material design indeterminate animation.
 * @param {?} currentTime
 * @param {?} startValue
 * @param {?} changeInValue
 * @param {?} duration
 * @return {?}
 */
function materialEase(currentTime, startValue, changeInValue, duration) {
    let /** @type {?} */ time = currentTime / duration;
    let /** @type {?} */ timeCubed = Math.pow(time, 3);
    let /** @type {?} */ timeQuad = Math.pow(time, 4);
    let /** @type {?} */ timeQuint = Math.pow(time, 5);
    return startValue + changeInValue * ((6 * timeQuint) + (-15 * timeQuad) + (10 * timeCubed));
}
/**
 * Determines the path value to define the arc.  Converting percentage values to to polar
 * coordinates on the circle, and then to cartesian coordinates in the viewport.
 *
 * @param {?} currentValue The current percentage value of the progress circle, the percentage of the
 *    circle to fill.
 * @param {?} rotation The starting point of the circle with 0 being the 0 degree point.
 * @param {?} strokeWidth Stroke width of the progress spinner arc.
 * @return {?} A string for an SVG path representing a circle filled from the starting point to the
 *    percentage value provided.
 */
function getSvgArc(currentValue, rotation, strokeWidth) {
    let /** @type {?} */ startPoint = rotation || 0;
    let /** @type {?} */ radius = 50;
    let /** @type {?} */ pathRadius = radius - strokeWidth;
    let /** @type {?} */ startAngle = startPoint * MAX_ANGLE;
    let /** @type {?} */ endAngle = currentValue * MAX_ANGLE;
    let /** @type {?} */ start = polarToCartesian(radius, pathRadius, startAngle);
    let /** @type {?} */ end = polarToCartesian(radius, pathRadius, endAngle + startAngle);
    let /** @type {?} */ arcSweep = endAngle < 0 ? 0 : 1;
    let /** @type {?} */ largeArcFlag;
    if (endAngle < 0) {
        largeArcFlag = endAngle >= -180 ? 0 : 1;
    }
    else {
        largeArcFlag = endAngle <= 180 ? 0 : 1;
    }
    return `M${start}A${pathRadius},${pathRadius} 0 ${largeArcFlag},${arcSweep} ${end}`;
}

class MdProgressSpinnerModule {
}
MdProgressSpinnerModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule],
                exports: [
                    MdProgressSpinner,
                    MdSpinner,
                    MdCommonModule,
                    MdProgressSpinnerCssMatStyler
                ],
                declarations: [
                    MdProgressSpinner,
                    MdSpinner,
                    MdProgressSpinnerCssMatStyler
                ],
            },] },
];
/**
 * @nocollapse
 */
MdProgressSpinnerModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MdProgressSpinnerModule, PROGRESS_SPINNER_STROKE_WIDTH, MdProgressSpinnerCssMatStyler, MdProgressSpinnerBase, _MdProgressSpinnerMixinBase, MdProgressSpinner, MdSpinner, MdProgressSpinner as MatProgressSpinner, MdProgressSpinnerBase as MatProgressSpinnerBase, MdProgressSpinnerCssMatStyler as MatProgressSpinnerCssMatStyler, MdProgressSpinnerModule as MatProgressSpinnerModule, MdSpinner as MatSpinner };
//# sourceMappingURL=progress-spinner.js.map
