/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, NgModule, Optional, Renderer2, ViewEncapsulation } from '@angular/core';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { MatCommonModule, mixinColor } from '@angular/material/core';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';
import { DOCUMENT } from '@angular/common';

/**
 * \@docs-private
 */
var MatProgressSpinnerBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MatProgressSpinnerBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MatProgressSpinnerBase;
}());
var _MatProgressSpinnerMixinBase = mixinColor(MatProgressSpinnerBase, 'primary');
var INDETERMINATE_ANIMATION_TEMPLATE = "\n @keyframes mat-progress-spinner-stroke-rotate-DIAMETER {\n    0%      { stroke-dashoffset: START_VALUE;  transform: rotate(0); }\n    12.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(0); }\n    12.51%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(72.5deg); }\n    25%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(72.5deg); }\n\n    25.1%   { stroke-dashoffset: START_VALUE;  transform: rotate(270deg); }\n    37.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(270deg); }\n    37.51%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(161.5deg); }\n    50%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(161.5deg); }\n\n    50.01%  { stroke-dashoffset: START_VALUE;  transform: rotate(180deg); }\n    62.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(180deg); }\n    62.51%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(251.5deg); }\n    75%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(251.5deg); }\n\n    75.01%  { stroke-dashoffset: START_VALUE;  transform: rotate(90deg); }\n    87.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(90deg); }\n    87.51%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(341.5deg); }\n    100%    { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(341.5deg); }\n  }\n";
/**
 * <mat-progress-spinner> component.
 */
var MatProgressSpinner = (function (_super) {
    __extends(MatProgressSpinner, _super);
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} platform
     * @param {?} _document
     */
    function MatProgressSpinner(_renderer, _elementRef, platform, _document) {
        var _this = _super.call(this, _renderer, _elementRef) || this;
        _this._renderer = _renderer;
        _this._elementRef = _elementRef;
        _this._document = _document;
        _this._baseSize = 100;
        _this._baseStrokeWidth = 10;
        _this._fallbackAnimation = false;
        /**
         * The width and height of the host element. Will grow with stroke width. *
         */
        _this._elementSize = _this._baseSize;
        _this._diameter = _this._baseSize;
        /**
         * Stroke width of the progress spinner.
         */
        _this.strokeWidth = 10;
        /**
         * Mode of the progress circle
         */
        _this.mode = 'determinate';
        _this._fallbackAnimation = platform.EDGE || platform.TRIDENT;
        // On IE and Edge, we can't animate the `stroke-dashoffset`
        // reliably so we fall back to a non-spec animation.
        var animationClass = _this._fallbackAnimation ?
            'mat-progress-spinner-indeterminate-fallback-animation' :
            'mat-progress-spinner-indeterminate-animation';
        _renderer.addClass(_elementRef.nativeElement, animationClass);
        return _this;
    }
    Object.defineProperty(MatProgressSpinner.prototype, "diameter", {
        /**
         * The diameter of the progress spinner (will set width and height of svg).
         * @return {?}
         */
        get: function () {
            return this._diameter;
        },
        /**
         * @param {?} size
         * @return {?}
         */
        set: function (size) {
            this._setDiameterAndInitStyles(size);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "value", {
        /**
         * Value of the progress circle.
         * @return {?}
         */
        get: function () {
            return this.mode === 'determinate' ? this._value : 0;
        },
        /**
         * @param {?} newValue
         * @return {?}
         */
        set: function (newValue) {
            if (newValue != null && this.mode === 'determinate') {
                this._value = Math.max(0, Math.min(100, newValue));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    MatProgressSpinner.prototype.ngOnChanges = function (changes) {
        if (changes.strokeWidth || changes.diameter) {
            this._elementSize =
                this._diameter + Math.max(this.strokeWidth - this._baseStrokeWidth, 0);
        }
    };
    Object.defineProperty(MatProgressSpinner.prototype, "_circleRadius", {
        /**
         * The radius of the spinner, adjusted for stroke width.
         * @return {?}
         */
        get: function () {
            return (this.diameter - this._baseStrokeWidth) / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "_viewBox", {
        /**
         * The view box of the spinner's svg element.
         * @return {?}
         */
        get: function () {
            return "0 0 " + this._elementSize + " " + this._elementSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "_strokeCircumference", {
        /**
         * The stroke circumference of the svg circle.
         * @return {?}
         */
        get: function () {
            return 2 * Math.PI * this._circleRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatProgressSpinner.prototype, "_strokeDashOffset", {
        /**
         * The dash offset of the svg circle.
         * @return {?}
         */
        get: function () {
            if (this.mode === 'determinate') {
                return this._strokeCircumference * (100 - this._value) / 100;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the diameter and adds diameter-specific styles if necessary.
     * @param {?} size
     * @return {?}
     */
    MatProgressSpinner.prototype._setDiameterAndInitStyles = function (size) {
        this._diameter = size;
        if (!MatProgressSpinner.diameters.has(this.diameter) && !this._fallbackAnimation) {
            this._attachStyleNode();
        }
    };
    /**
     * Dynamically generates a style tag containing the correct animation for this diameter.
     * @return {?}
     */
    MatProgressSpinner.prototype._attachStyleNode = function () {
        var /** @type {?} */ styleTag = this._renderer.createElement('style');
        styleTag.textContent = this._getAnimationText();
        this._renderer.appendChild(this._document.head, styleTag);
        MatProgressSpinner.diameters.add(this.diameter);
    };
    /**
     * Generates animation styles adjusted for the spinner's diameter.
     * @return {?}
     */
    MatProgressSpinner.prototype._getAnimationText = function () {
        return INDETERMINATE_ANIMATION_TEMPLATE
            .replace(/START_VALUE/g, "" + 0.95 * this._strokeCircumference)
            .replace(/END_VALUE/g, "" + 0.2 * this._strokeCircumference)
            .replace(/DIAMETER/g, "" + this.diameter);
    };
    /**
     * Tracks diameters of existing instances to de-dupe generated styles (default d = 100)
     */
    MatProgressSpinner.diameters = new Set([100]);
    MatProgressSpinner.decorators = [
        { type: Component, args: [{selector: 'mat-progress-spinner',
                    exportAs: 'matProgressSpinner',
                    host: {
                        'role': 'progressbar',
                        'class': 'mat-progress-spinner',
                        '[style.width.px]': '_elementSize',
                        '[style.height.px]': '_elementSize',
                        '[attr.aria-valuemin]': 'mode === "determinate" ? 0 : null',
                        '[attr.aria-valuemax]': 'mode === "determinate" ? 100 : null',
                        '[attr.aria-valuenow]': 'value',
                        '[attr.mode]': 'mode',
                    },
                    inputs: ['color'],
                    template: "<svg [style.width.px]=\"_elementSize\" [style.height.px]=\"_elementSize\" [attr.viewBox]=\"_viewBox\" preserveAspectRatio=\"xMidYMid meet\" focusable=\"false\"><circle cx=\"50%\" cy=\"50%\" [attr.r]=\"_circleRadius\" [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + diameter\" [style.stroke-dashoffset.px]=\"_strokeDashOffset\" [style.stroke-dasharray.px]=\"_strokeCircumference\" [style.transform.rotate]=\"'360deg'\" [style.stroke-width.px]=\"strokeWidth\"></circle></svg>",
                    styles: [".mat-progress-spinner{display:block;position:relative}.mat-progress-spinner svg{position:absolute;transform:translate(-50%,-50%) rotate(-90deg);top:50%;left:50%;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:transparent;transform-origin:center;transition:stroke-dashoffset 225ms linear}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{animation:mat-progress-spinner-linear-rotate 2s linear infinite}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition-property:stroke;animation-duration:4s;animation-timing-function:cubic-bezier(.35,0,.25,1);animation-iteration-count:infinite}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{animation:mat-progress-spinner-stroke-rotate-fallback 10s cubic-bezier(.87,.03,.33,1) infinite}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition-property:stroke}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.60617px;transform:rotate(0)}12.5%{stroke-dashoffset:56.54867px;transform:rotate(0)}12.51%{stroke-dashoffset:56.54867px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.60617px;transform:rotateX(180deg) rotate(72.5deg)}25.1%{stroke-dashoffset:268.60617px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.54867px;transform:rotate(270deg)}37.51%{stroke-dashoffset:56.54867px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.60617px;transform:rotateX(180deg) rotate(161.5deg)}50.01%{stroke-dashoffset:268.60617px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.54867px;transform:rotate(180deg)}62.51%{stroke-dashoffset:56.54867px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.60617px;transform:rotateX(180deg) rotate(251.5deg)}75.01%{stroke-dashoffset:268.60617px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.54867px;transform:rotate(90deg)}87.51%{stroke-dashoffset:56.54867px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.60617px;transform:rotateX(180deg) rotate(341.5deg)}}@keyframes mat-progress-spinner-stroke-rotate-fallback{0%{transform:rotate(0)}25%{transform:rotate(1170deg)}50%{transform:rotate(2340deg)}75%{transform:rotate(3510deg)}100%{transform:rotate(4680deg)}}"],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatProgressSpinner.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ElementRef, },
        { type: Platform, },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
    ]; };
    MatProgressSpinner.propDecorators = {
        'diameter': [{ type: Input },],
        'strokeWidth': [{ type: Input },],
        'mode': [{ type: Input },],
        'value': [{ type: Input },],
    };
    return MatProgressSpinner;
}(_MatProgressSpinnerMixinBase));
/**
 * <mat-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <mat-progress-spinner> instance.
 */
var MatSpinner = (function (_super) {
    __extends(MatSpinner, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} platform
     * @param {?} document
     */
    function MatSpinner(renderer, elementRef, platform, document) {
        var _this = _super.call(this, renderer, elementRef, platform, document) || this;
        _this.mode = 'indeterminate';
        return _this;
    }
    MatSpinner.decorators = [
        { type: Component, args: [{selector: 'mat-spinner',
                    host: {
                        'role': 'progressbar',
                        'mode': 'indeterminate',
                        'class': 'mat-spinner mat-progress-spinner',
                        '[style.width.px]': '_elementSize',
                        '[style.height.px]': '_elementSize',
                    },
                    inputs: ['color'],
                    template: "<svg [style.width.px]=\"_elementSize\" [style.height.px]=\"_elementSize\" [attr.viewBox]=\"_viewBox\" preserveAspectRatio=\"xMidYMid meet\" focusable=\"false\"><circle cx=\"50%\" cy=\"50%\" [attr.r]=\"_circleRadius\" [style.animation-name]=\"'mat-progress-spinner-stroke-rotate-' + diameter\" [style.stroke-dashoffset.px]=\"_strokeDashOffset\" [style.stroke-dasharray.px]=\"_strokeCircumference\" [style.transform.rotate]=\"'360deg'\" [style.stroke-width.px]=\"strokeWidth\"></circle></svg>",
                    styles: [".mat-progress-spinner{display:block;position:relative}.mat-progress-spinner svg{position:absolute;transform:translate(-50%,-50%) rotate(-90deg);top:50%;left:50%;transform-origin:center;overflow:visible}.mat-progress-spinner circle{fill:transparent;transform-origin:center;transition:stroke-dashoffset 225ms linear}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate]{animation:mat-progress-spinner-linear-rotate 2s linear infinite}.mat-progress-spinner.mat-progress-spinner-indeterminate-animation[mode=indeterminate] circle{transition-property:stroke;animation-duration:4s;animation-timing-function:cubic-bezier(.35,0,.25,1);animation-iteration-count:infinite}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate]{animation:mat-progress-spinner-stroke-rotate-fallback 10s cubic-bezier(.87,.03,.33,1) infinite}.mat-progress-spinner.mat-progress-spinner-indeterminate-fallback-animation[mode=indeterminate] circle{transition-property:stroke}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-stroke-rotate-100{0%{stroke-dashoffset:268.60617px;transform:rotate(0)}12.5%{stroke-dashoffset:56.54867px;transform:rotate(0)}12.51%{stroke-dashoffset:56.54867px;transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:268.60617px;transform:rotateX(180deg) rotate(72.5deg)}25.1%{stroke-dashoffset:268.60617px;transform:rotate(270deg)}37.5%{stroke-dashoffset:56.54867px;transform:rotate(270deg)}37.51%{stroke-dashoffset:56.54867px;transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:268.60617px;transform:rotateX(180deg) rotate(161.5deg)}50.01%{stroke-dashoffset:268.60617px;transform:rotate(180deg)}62.5%{stroke-dashoffset:56.54867px;transform:rotate(180deg)}62.51%{stroke-dashoffset:56.54867px;transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:268.60617px;transform:rotateX(180deg) rotate(251.5deg)}75.01%{stroke-dashoffset:268.60617px;transform:rotate(90deg)}87.5%{stroke-dashoffset:56.54867px;transform:rotate(90deg)}87.51%{stroke-dashoffset:56.54867px;transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:268.60617px;transform:rotateX(180deg) rotate(341.5deg)}}@keyframes mat-progress-spinner-stroke-rotate-fallback{0%{transform:rotate(0)}25%{transform:rotate(1170deg)}50%{transform:rotate(2340deg)}75%{transform:rotate(3510deg)}100%{transform:rotate(4680deg)}}"],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatSpinner.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ElementRef, },
        { type: Platform, },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
    ]; };
    return MatSpinner;
}(MatProgressSpinner));

var MatProgressSpinnerModule = (function () {
    function MatProgressSpinnerModule() {
    }
    MatProgressSpinnerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [MatCommonModule, PlatformModule],
                    exports: [
                        MatProgressSpinner,
                        MatSpinner,
                        MatCommonModule
                    ],
                    declarations: [
                        MatProgressSpinner,
                        MatSpinner
                    ],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatProgressSpinnerModule.ctorParameters = function () { return []; };
    return MatProgressSpinnerModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { MatProgressSpinnerModule, MatProgressSpinnerBase, _MatProgressSpinnerMixinBase, MatProgressSpinner, MatSpinner };
//# sourceMappingURL=progress-spinner.es5.js.map
