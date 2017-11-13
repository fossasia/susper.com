/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { A11yModule, ARIA_DESCRIBER_PROVIDER, AriaDescriber } from '@angular/cdk/a11y';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Inject, InjectionToken, Input, NgModule, NgZone, Optional, Renderer2, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE } from '@angular/cdk/keycodes';
import { ComponentPortal } from '@angular/cdk/portal';
import { first } from '@angular/cdk/rxjs';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Subject } from 'rxjs/Subject';

/**
 * Time in ms to delay before changing the tooltip visibility to hidden
 */
var TOUCHEND_HIDE_DELAY = 1500;
/**
 * Time in ms to throttle repositioning after scroll events.
 */
var SCROLL_THROTTLE_MS = 20;
/**
 * CSS class that will be attached to the overlay panel.
 */
var TOOLTIP_PANEL_CLASS = 'mat-tooltip-panel';
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @param {?} position
 * @return {?}
 */
function getMatTooltipInvalidPositionError(position) {
    return Error("Tooltip position \"" + position + "\" is invalid.");
}
/**
 * Injection token that determines the scroll handling while a tooltip is visible.
 */
var MAT_TOOLTIP_SCROLL_STRATEGY = new InjectionToken('mat-tooltip-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS }); };
}
/**
 * \@docs-private
 */
var MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_TOOLTIP_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY
};
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.google.com/components/tooltips.html
 */
var MatTooltip = (function () {
    /**
     * @param {?} renderer
     * @param {?} _overlay
     * @param {?} _elementRef
     * @param {?} _scrollDispatcher
     * @param {?} _viewContainerRef
     * @param {?} _ngZone
     * @param {?} _platform
     * @param {?} _ariaDescriber
     * @param {?} _scrollStrategy
     * @param {?} _dir
     */
    function MatTooltip(renderer, _overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _platform, _ariaDescriber, _scrollStrategy, _dir) {
        var _this = this;
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._scrollDispatcher = _scrollDispatcher;
        this._viewContainerRef = _viewContainerRef;
        this._ngZone = _ngZone;
        this._platform = _platform;
        this._ariaDescriber = _ariaDescriber;
        this._scrollStrategy = _scrollStrategy;
        this._dir = _dir;
        this._position = 'below';
        this._disabled = false;
        /**
         * The default delay in ms before showing the tooltip after show is called
         */
        this.showDelay = 0;
        /**
         * The default delay in ms before hiding the tooltip after hide is called
         */
        this.hideDelay = 0;
        this._message = '';
        // The mouse events shouldn't be bound on iOS devices, because
        // they can prevent the first tap from firing its click event.
        if (!_platform.IOS) {
            this._enterListener =
                renderer.listen(_elementRef.nativeElement, 'mouseenter', function () { return _this.show(); });
            this._leaveListener =
                renderer.listen(_elementRef.nativeElement, 'mouseleave', function () { return _this.hide(); });
        }
    }
    Object.defineProperty(MatTooltip.prototype, "position", {
        /**
         * Allows the user to define the position of the tooltip relative to the parent element
         * @return {?}
         */
        get: function () { return this._position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== this._position) {
                this._position = value;
                // TODO(andrewjs): When the overlay's position can be dynamically changed, do not destroy
                // the tooltip.
                if (this._tooltipInstance) {
                    this._disposeTooltip();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTooltip.prototype, "disabled", {
        /**
         * Disables the display of the tooltip.
         * @return {?}
         */
        get: function () { return this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
            // If tooltip is disabled, hide immediately.
            if (this._disabled) {
                this.hide(0);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTooltip.prototype, "_positionDeprecated", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this._position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTooltip.prototype, "message", {
        /**
         * The message to be displayed in the tooltip
         * @return {?}
         */
        get: function () { return this._message; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this._message);
            // If the message is not a string (e.g. number), convert it to a string and trim it.
            this._message = value != null ? ("" + value).trim() : '';
            this._updateTooltipMessage();
            this._ariaDescriber.describe(this._elementRef.nativeElement, this.message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTooltip.prototype, "tooltipClass", {
        /**
         * Classes to be passed to the tooltip. Supports the same syntax as `ngClass`.
         * @return {?}
         */
        get: function () { return this._tooltipClass; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._tooltipClass = value;
            if (this._tooltipInstance) {
                this._setTooltipClass(this._tooltipClass);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose the tooltip when destroyed.
     * @return {?}
     */
    MatTooltip.prototype.ngOnDestroy = function () {
        if (this._tooltipInstance) {
            this._disposeTooltip();
        }
        // Clean up the event listeners set in the constructor
        if (!this._platform.IOS) {
            this._enterListener();
            this._leaveListener();
        }
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.message);
    };
    /**
     * Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    MatTooltip.prototype.show = function (delay) {
        if (delay === void 0) { delay = this.showDelay; }
        if (this.disabled || !this.message) {
            return;
        }
        if (!this._tooltipInstance) {
            this._createTooltip();
        }
        this._setTooltipClass(this._tooltipClass);
        this._updateTooltipMessage(); /** @type {?} */
        ((this._tooltipInstance)).show(this._position, delay);
    };
    /**
     * Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    MatTooltip.prototype.hide = function (delay) {
        if (delay === void 0) { delay = this.hideDelay; }
        if (this._tooltipInstance) {
            this._tooltipInstance.hide(delay);
        }
    };
    /**
     * Shows/hides the tooltip
     * @return {?}
     */
    MatTooltip.prototype.toggle = function () {
        this._isTooltipVisible() ? this.hide() : this.show();
    };
    /**
     * Returns true if the tooltip is currently visible to the user
     * @return {?}
     */
    MatTooltip.prototype._isTooltipVisible = function () {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible();
    };
    /**
     * Handles the keydown events on the host element.
     * @param {?} e
     * @return {?}
     */
    MatTooltip.prototype._handleKeydown = function (e) {
        if (this._isTooltipVisible() && e.keyCode === ESCAPE) {
            e.stopPropagation();
            this.hide(0);
        }
    };
    /**
     * Create the tooltip to display
     * @return {?}
     */
    MatTooltip.prototype._createTooltip = function () {
        var _this = this;
        var /** @type {?} */ overlayRef = this._createOverlay();
        var /** @type {?} */ portal = new ComponentPortal(TooltipComponent, this._viewContainerRef);
        this._tooltipInstance = overlayRef.attach(portal).instance; /** @type {?} */
        ((
        // Dispose the overlay when finished the shown tooltip.
        this._tooltipInstance)).afterHidden().subscribe(function () {
            // Check first if the tooltip has already been removed through this components destroy.
            if (_this._tooltipInstance) {
                _this._disposeTooltip();
            }
        });
    };
    /**
     * Create the overlay config and position strategy
     * @return {?}
     */
    MatTooltip.prototype._createOverlay = function () {
        var _this = this;
        var /** @type {?} */ origin = this._getOrigin();
        var /** @type {?} */ overlay = this._getOverlayPosition();
        // Create connected position strategy that listens for scroll events to reposition.
        var /** @type {?} */ strategy = this._overlay
            .position()
            .connectedTo(this._elementRef, origin.main, overlay.main)
            .withFallbackPosition(origin.fallback, overlay.fallback);
        strategy.withScrollableContainers(this._scrollDispatcher.getScrollContainers(this._elementRef));
        strategy.onPositionChange.subscribe(function (change) {
            if (_this._tooltipInstance) {
                if (change.scrollableViewProperties.isOverlayClipped && _this._tooltipInstance.isVisible()) {
                    // After position changes occur and the overlay is clipped by
                    // a parent scrollable then close the tooltip.
                    _this.hide(0);
                }
                else {
                    // Otherwise recalculate the origin based on the new position.
                    _this._tooltipInstance._setTransformOrigin(change.connectionPair);
                }
            }
        });
        var /** @type {?} */ config = new OverlayConfig({
            direction: this._dir ? this._dir.value : 'ltr',
            positionStrategy: strategy,
            panelClass: TOOLTIP_PANEL_CLASS,
            scrollStrategy: this._scrollStrategy()
        });
        this._overlayRef = this._overlay.create(config);
        return this._overlayRef;
    };
    /**
     * Disposes the current tooltip and the overlay it is attached to
     * @return {?}
     */
    MatTooltip.prototype._disposeTooltip = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._tooltipInstance = null;
    };
    /**
     * Returns the origin position and a fallback position based on the user's position preference.
     * The fallback position is the inverse of the origin (e.g. 'below' -> 'above').
     * @return {?}
     */
    MatTooltip.prototype._getOrigin = function () {
        var /** @type {?} */ isDirectionLtr = !this._dir || this._dir.value == 'ltr';
        var /** @type {?} */ position;
        if (this.position == 'above' || this.position == 'below') {
            position = { originX: 'center', originY: this.position == 'above' ? 'top' : 'bottom' };
        }
        else if (this.position == 'left' ||
            this.position == 'before' && isDirectionLtr ||
            this.position == 'after' && !isDirectionLtr) {
            position = { originX: 'start', originY: 'center' };
        }
        else if (this.position == 'right' ||
            this.position == 'after' && isDirectionLtr ||
            this.position == 'before' && !isDirectionLtr) {
            position = { originX: 'end', originY: 'center' };
        }
        else {
            throw getMatTooltipInvalidPositionError(this.position);
        }
        var _a = this._invertPosition(position.originX, position.originY), x = _a.x, y = _a.y;
        return {
            main: position,
            fallback: { originX: x, originY: y }
        };
    };
    /**
     * Returns the overlay position and a fallback position based on the user's preference
     * @return {?}
     */
    MatTooltip.prototype._getOverlayPosition = function () {
        var /** @type {?} */ isLtr = !this._dir || this._dir.value == 'ltr';
        var /** @type {?} */ position;
        if (this.position == 'above') {
            position = { overlayX: 'center', overlayY: 'bottom' };
        }
        else if (this.position == 'below') {
            position = { overlayX: 'center', overlayY: 'top' };
        }
        else if (this.position == 'left' ||
            this.position == 'before' && isLtr ||
            this.position == 'after' && !isLtr) {
            position = { overlayX: 'end', overlayY: 'center' };
        }
        else if (this.position == 'right' ||
            this.position == 'after' && isLtr ||
            this.position == 'before' && !isLtr) {
            position = { overlayX: 'start', overlayY: 'center' };
        }
        else {
            throw getMatTooltipInvalidPositionError(this.position);
        }
        var _a = this._invertPosition(position.overlayX, position.overlayY), x = _a.x, y = _a.y;
        return {
            main: position,
            fallback: { overlayX: x, overlayY: y }
        };
    };
    /**
     * Updates the tooltip message and repositions the overlay according to the new message length
     * @return {?}
     */
    MatTooltip.prototype._updateTooltipMessage = function () {
        var _this = this;
        // Must wait for the message to be painted to the tooltip so that the overlay can properly
        // calculate the correct positioning based on the size of the text.
        if (this._tooltipInstance) {
            this._tooltipInstance.message = this.message;
            this._tooltipInstance._markForCheck();
            first.call(this._ngZone.onMicrotaskEmpty.asObservable()).subscribe(function () {
                if (_this._tooltipInstance) {
                    ((_this._overlayRef)).updatePosition();
                }
            });
        }
    };
    /**
     * Updates the tooltip class
     * @param {?} tooltipClass
     * @return {?}
     */
    MatTooltip.prototype._setTooltipClass = function (tooltipClass) {
        if (this._tooltipInstance) {
            this._tooltipInstance.tooltipClass = tooltipClass;
            this._tooltipInstance._markForCheck();
        }
    };
    /**
     * Inverts an overlay position.
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    MatTooltip.prototype._invertPosition = function (x, y) {
        if (this.position === 'above' || this.position === 'below') {
            if (y === 'top') {
                y = 'bottom';
            }
            else if (y === 'bottom') {
                y = 'top';
            }
        }
        else {
            if (x === 'end') {
                x = 'start';
            }
            else if (x === 'start') {
                x = 'end';
            }
        }
        return { x: x, y: y };
    };
    MatTooltip.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-tooltip], [matTooltip]',
                    exportAs: 'matTooltip',
                    host: {
                        '(longpress)': 'show()',
                        '(focus)': 'show()',
                        '(blur)': 'hide(0)',
                        '(keydown)': '_handleKeydown($event)',
                        '(touchend)': 'hide(' + TOUCHEND_HIDE_DELAY + ')',
                    },
                },] },
    ];
    /**
     * @nocollapse
     */
    MatTooltip.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: Overlay, },
        { type: ElementRef, },
        { type: ScrollDispatcher, },
        { type: ViewContainerRef, },
        { type: NgZone, },
        { type: Platform, },
        { type: AriaDescriber, },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_TOOLTIP_SCROLL_STRATEGY,] },] },
        { type: Directionality, decorators: [{ type: Optional },] },
    ]; };
    MatTooltip.propDecorators = {
        'position': [{ type: Input, args: ['matTooltipPosition',] },],
        'disabled': [{ type: Input, args: ['matTooltipDisabled',] },],
        '_positionDeprecated': [{ type: Input, args: ['tooltip-position',] },],
        'showDelay': [{ type: Input, args: ['matTooltipShowDelay',] },],
        'hideDelay': [{ type: Input, args: ['matTooltipHideDelay',] },],
        'message': [{ type: Input, args: ['matTooltip',] },],
        'tooltipClass': [{ type: Input, args: ['matTooltipClass',] },],
    };
    return MatTooltip;
}());
/**
 * Internal component that wraps the tooltip's content.
 * \@docs-private
 */
var TooltipComponent = (function () {
    /**
     * @param {?} _changeDetectorRef
     */
    function TooltipComponent(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Property watched by the animation framework to show or hide the tooltip
         */
        this._visibility = 'initial';
        /**
         * Whether interactions on the page should close the tooltip
         */
        this._closeOnInteraction = false;
        /**
         * The transform origin used in the animation for showing and hiding the tooltip
         */
        this._transformOrigin = 'bottom';
        /**
         * Subject for notifying that the tooltip has been hidden from the view
         */
        this._onHide = new Subject();
    }
    /**
     * Shows the tooltip with an animation originating from the provided origin
     * @param {?} position Position of the tooltip.
     * @param {?} delay Amount of milliseconds to the delay showing the tooltip.
     * @return {?}
     */
    TooltipComponent.prototype.show = function (position, delay) {
        var _this = this;
        // Cancel the delayed hide if it is scheduled
        if (this._hideTimeoutId) {
            clearTimeout(this._hideTimeoutId);
        }
        // Body interactions should cancel the tooltip if there is a delay in showing.
        this._closeOnInteraction = true;
        this._position = position;
        this._showTimeoutId = setTimeout(function () {
            _this._visibility = 'visible';
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            _this._markForCheck();
        }, delay);
    };
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param {?} delay Amount of milliseconds to delay showing the tooltip.
     * @return {?}
     */
    TooltipComponent.prototype.hide = function (delay) {
        var _this = this;
        // Cancel the delayed show if it is scheduled
        if (this._showTimeoutId) {
            clearTimeout(this._showTimeoutId);
        }
        this._hideTimeoutId = setTimeout(function () {
            _this._visibility = 'hidden';
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            _this._markForCheck();
        }, delay);
    };
    /**
     * Returns an observable that notifies when the tooltip has been hidden from view.
     * @return {?}
     */
    TooltipComponent.prototype.afterHidden = function () {
        return this._onHide.asObservable();
    };
    /**
     * Whether the tooltip is being displayed.
     * @return {?}
     */
    TooltipComponent.prototype.isVisible = function () {
        return this._visibility === 'visible';
    };
    /**
     * Sets the tooltip transform origin according to the position of the tooltip overlay.
     * @param {?} overlayPosition
     * @return {?}
     */
    TooltipComponent.prototype._setTransformOrigin = function (overlayPosition) {
        var /** @type {?} */ axis = (this._position === 'above' || this._position === 'below') ? 'Y' : 'X';
        var /** @type {?} */ position = axis == 'X' ? overlayPosition.overlayX : overlayPosition.overlayY;
        if (position === 'top' || position === 'bottom') {
            this._transformOrigin = position;
        }
        else if (position === 'start') {
            this._transformOrigin = 'left';
        }
        else if (position === 'end') {
            this._transformOrigin = 'right';
        }
        else {
            throw getMatTooltipInvalidPositionError(this._position);
        }
    };
    /**
     * @return {?}
     */
    TooltipComponent.prototype._animationStart = function () {
        this._closeOnInteraction = false;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TooltipComponent.prototype._animationDone = function (event) {
        var _this = this;
        var /** @type {?} */ toState = (event.toState);
        if (toState === 'hidden' && !this.isVisible()) {
            this._onHide.next();
        }
        if (toState === 'visible' || toState === 'hidden') {
            // Note: as of Angular 4.3, the animations module seems to fire the `start` callback before
            // the end if animations are disabled. Make this call async to ensure that it still fires
            // at the appropriate time.
            Promise.resolve().then(function () { return _this._closeOnInteraction = true; });
        }
    };
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.google.com/components/tooltips.html#tooltips-interaction
     * @return {?}
     */
    TooltipComponent.prototype._handleBodyInteraction = function () {
        if (this._closeOnInteraction) {
            this.hide(0);
        }
    };
    /**
     * Marks that the tooltip needs to be checked in the next change detection run.
     * Mainly used for rendering the initial text before positioning a tooltip, which
     * can be problematic in components with OnPush change detection.
     * @return {?}
     */
    TooltipComponent.prototype._markForCheck = function () {
        this._changeDetectorRef.markForCheck();
    };
    TooltipComponent.decorators = [
        { type: Component, args: [{selector: 'mat-tooltip-component',
                    template: "<div class=\"mat-tooltip\" [ngClass]=\"tooltipClass\" [style.transform-origin]=\"_transformOrigin\" [@state]=\"_visibility\" (@state.start)=\"_animationStart()\" (@state.done)=\"_animationDone($event)\">{{message}}</div>",
                    styles: [".mat-tooltip-panel{pointer-events:none!important}.mat-tooltip{color:#fff;border-radius:2px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px}@media screen and (-ms-high-contrast:active){.mat-tooltip{outline:solid 1px}}"],
                    encapsulation: ViewEncapsulation.None,
                    preserveWhitespaces: false,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    animations: [
                        trigger('state', [
                            state('initial, void, hidden', style({ transform: 'scale(0)' })),
                            state('visible', style({ transform: 'scale(1)' })),
                            transition('* => visible', animate('150ms cubic-bezier(0.0, 0.0, 0.2, 1)')),
                            transition('* => hidden', animate('150ms cubic-bezier(0.4, 0.0, 1, 1)')),
                        ])
                    ],
                    host: {
                        // Forces the element to have a layout in IE and Edge. This fixes issues where the element
                        // won't be rendered if the animations are disabled or there is no web animations polyfill.
                        '[style.zoom]': '_visibility === "visible" ? 1 : null',
                        '(body:click)': 'this._handleBodyInteraction()',
                        'aria-hidden': 'true',
                    }
                },] },
    ];
    /**
     * @nocollapse
     */
    TooltipComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    return TooltipComponent;
}());

var MatTooltipModule = (function () {
    function MatTooltipModule() {
    }
    MatTooltipModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        OverlayModule,
                        MatCommonModule,
                        PlatformModule,
                        A11yModule,
                    ],
                    exports: [MatTooltip, TooltipComponent, MatCommonModule],
                    declarations: [MatTooltip, TooltipComponent],
                    entryComponents: [TooltipComponent],
                    providers: [MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER, ARIA_DESCRIBER_PROVIDER],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatTooltipModule.ctorParameters = function () { return []; };
    return MatTooltipModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { MatTooltipModule, TOUCHEND_HIDE_DELAY, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, getMatTooltipInvalidPositionError, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY, MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER, MatTooltip, TooltipComponent };
//# sourceMappingURL=tooltip.es5.js.map
