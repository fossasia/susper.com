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
import { MdCommonModule } from '@angular/material/core';
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
const TOUCHEND_HIDE_DELAY = 1500;
/**
 * Time in ms to throttle repositioning after scroll events.
 */
const SCROLL_THROTTLE_MS = 20;
/**
 * CSS class that will be attached to the overlay panel.
 */
const TOOLTIP_PANEL_CLASS = 'mat-tooltip-panel';
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @param {?} position
 * @return {?}
 */
function getMdTooltipInvalidPositionError(position) {
    return Error(`Tooltip position "${position}" is invalid.`);
}
/**
 * Injection token that determines the scroll handling while a tooltip is visible.
 */
const MD_TOOLTIP_SCROLL_STRATEGY = new InjectionToken('md-tooltip-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS });
}
/**
 * \@docs-private
 */
const MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER = {
    provide: MD_TOOLTIP_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY
};
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.google.com/components/tooltips.html
 */
class MdTooltip {
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
    constructor(renderer, _overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _platform, _ariaDescriber, _scrollStrategy, _dir) {
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
                renderer.listen(_elementRef.nativeElement, 'mouseenter', () => this.show());
            this._leaveListener =
                renderer.listen(_elementRef.nativeElement, 'mouseleave', () => this.hide());
        }
    }
    /**
     * Allows the user to define the position of the tooltip relative to the parent element
     * @return {?}
     */
    get position() { return this._position; }
    /**
     * @param {?} value
     * @return {?}
     */
    set position(value) {
        if (value !== this._position) {
            this._position = value;
            // TODO(andrewjs): When the overlay's position can be dynamically changed, do not destroy
            // the tooltip.
            if (this._tooltipInstance) {
                this._disposeTooltip();
            }
        }
    }
    /**
     * Disables the display of the tooltip.
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        // If tooltip is disabled, hide immediately.
        if (this._disabled) {
            this.hide(0);
        }
    }
    /**
     * @deprecated
     * @return {?}
     */
    get _positionDeprecated() { return this._position; }
    /**
     * @param {?} value
     * @return {?}
     */
    set _positionDeprecated(value) { this._position = value; }
    /**
     * The message to be displayed in the tooltip
     * @return {?}
     */
    get message() { return this._message; }
    /**
     * @param {?} value
     * @return {?}
     */
    set message(value) {
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this._message);
        // If the message is not a string (e.g. number), convert it to a string and trim it.
        this._message = value != null ? `${value}`.trim() : '';
        this._updateTooltipMessage();
        this._ariaDescriber.describe(this._elementRef.nativeElement, this.message);
    }
    /**
     * Classes to be passed to the tooltip. Supports the same syntax as `ngClass`.
     * @return {?}
     */
    get tooltipClass() { return this._tooltipClass; }
    /**
     * @param {?} value
     * @return {?}
     */
    set tooltipClass(value) {
        this._tooltipClass = value;
        if (this._tooltipInstance) {
            this._setTooltipClass(this._tooltipClass);
        }
    }
    /**
     * @deprecated
     * @return {?}
     */
    get _deprecatedMessage() { return this.message; }
    /**
     * @param {?} v
     * @return {?}
     */
    set _deprecatedMessage(v) { this.message = v; }
    /**
     * @return {?}
     */
    get _matMessage() { return this.message; }
    /**
     * @param {?} v
     * @return {?}
     */
    set _matMessage(v) { this.message = v; }
    /**
     * @return {?}
     */
    get _matPosition() { return this.position; }
    /**
     * @param {?} v
     * @return {?}
     */
    set _matPosition(v) { this.position = v; }
    /**
     * @return {?}
     */
    get _matDisabled() { return this.disabled; }
    /**
     * @param {?} v
     * @return {?}
     */
    set _matDisabled(v) { this.disabled = v; }
    /**
     * @return {?}
     */
    get _matHideDelay() { return this.hideDelay; }
    /**
     * @param {?} v
     * @return {?}
     */
    set _matHideDelay(v) { this.hideDelay = v; }
    /**
     * @return {?}
     */
    get _matShowDelay() { return this.showDelay; }
    /**
     * @param {?} v
     * @return {?}
     */
    set _matShowDelay(v) { this.showDelay = v; }
    /**
     * @return {?}
     */
    get _matClass() { return this.tooltipClass; }
    /**
     * @param {?} v
     * @return {?}
     */
    set _matClass(v) { this.tooltipClass = v; }
    /**
     * Dispose the tooltip when destroyed.
     * @return {?}
     */
    ngOnDestroy() {
        if (this._tooltipInstance) {
            this._disposeTooltip();
        }
        // Clean up the event listeners set in the constructor
        if (!this._platform.IOS) {
            this._enterListener();
            this._leaveListener();
        }
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.message);
    }
    /**
     * Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    show(delay = this.showDelay) {
        if (this.disabled || !this.message) {
            return;
        }
        if (!this._tooltipInstance) {
            this._createTooltip();
        }
        this._setTooltipClass(this._tooltipClass);
        this._updateTooltipMessage(); /** @type {?} */
        ((this._tooltipInstance)).show(this._position, delay);
    }
    /**
     * Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    hide(delay = this.hideDelay) {
        if (this._tooltipInstance) {
            this._tooltipInstance.hide(delay);
        }
    }
    /**
     * Shows/hides the tooltip
     * @return {?}
     */
    toggle() {
        this._isTooltipVisible() ? this.hide() : this.show();
    }
    /**
     * Returns true if the tooltip is currently visible to the user
     * @return {?}
     */
    _isTooltipVisible() {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible();
    }
    /**
     * Handles the keydown events on the host element.
     * @param {?} e
     * @return {?}
     */
    _handleKeydown(e) {
        if (this._isTooltipVisible() && e.keyCode === ESCAPE) {
            e.stopPropagation();
            this.hide(0);
        }
    }
    /**
     * Create the tooltip to display
     * @return {?}
     */
    _createTooltip() {
        let /** @type {?} */ overlayRef = this._createOverlay();
        let /** @type {?} */ portal = new ComponentPortal(TooltipComponent, this._viewContainerRef);
        this._tooltipInstance = overlayRef.attach(portal).instance; /** @type {?} */
        ((
        // Dispose the overlay when finished the shown tooltip.
        this._tooltipInstance)).afterHidden().subscribe(() => {
            // Check first if the tooltip has already been removed through this components destroy.
            if (this._tooltipInstance) {
                this._disposeTooltip();
            }
        });
    }
    /**
     * Create the overlay config and position strategy
     * @return {?}
     */
    _createOverlay() {
        const /** @type {?} */ origin = this._getOrigin();
        const /** @type {?} */ position = this._getOverlayPosition();
        // Create connected position strategy that listens for scroll events to reposition.
        // After position changes occur and the overlay is clipped by a parent scrollable then
        // close the tooltip.
        const /** @type {?} */ strategy = this._overlay.position().connectedTo(this._elementRef, origin, position);
        strategy.withScrollableContainers(this._scrollDispatcher.getScrollContainers(this._elementRef));
        strategy.onPositionChange.subscribe(change => {
            if (change.scrollableViewProperties.isOverlayClipped &&
                this._tooltipInstance && this._tooltipInstance.isVisible()) {
                this.hide(0);
            }
        });
        const /** @type {?} */ config = new OverlayConfig({
            direction: this._dir ? this._dir.value : 'ltr',
            positionStrategy: strategy,
            panelClass: TOOLTIP_PANEL_CLASS,
            scrollStrategy: this._scrollStrategy()
        });
        this._overlayRef = this._overlay.create(config);
        return this._overlayRef;
    }
    /**
     * Disposes the current tooltip and the overlay it is attached to
     * @return {?}
     */
    _disposeTooltip() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._tooltipInstance = null;
    }
    /**
     * Returns the origin position based on the user's position preference
     * @return {?}
     */
    _getOrigin() {
        if (this.position == 'above' || this.position == 'below') {
            return { originX: 'center', originY: this.position == 'above' ? 'top' : 'bottom' };
        }
        const /** @type {?} */ isDirectionLtr = !this._dir || this._dir.value == 'ltr';
        if (this.position == 'left' ||
            this.position == 'before' && isDirectionLtr ||
            this.position == 'after' && !isDirectionLtr) {
            return { originX: 'start', originY: 'center' };
        }
        if (this.position == 'right' ||
            this.position == 'after' && isDirectionLtr ||
            this.position == 'before' && !isDirectionLtr) {
            return { originX: 'end', originY: 'center' };
        }
        throw getMdTooltipInvalidPositionError(this.position);
    }
    /**
     * Returns the overlay position based on the user's preference
     * @return {?}
     */
    _getOverlayPosition() {
        if (this.position == 'above') {
            return { overlayX: 'center', overlayY: 'bottom' };
        }
        if (this.position == 'below') {
            return { overlayX: 'center', overlayY: 'top' };
        }
        const /** @type {?} */ isLtr = !this._dir || this._dir.value == 'ltr';
        if (this.position == 'left' ||
            this.position == 'before' && isLtr ||
            this.position == 'after' && !isLtr) {
            return { overlayX: 'end', overlayY: 'center' };
        }
        if (this.position == 'right' ||
            this.position == 'after' && isLtr ||
            this.position == 'before' && !isLtr) {
            return { overlayX: 'start', overlayY: 'center' };
        }
        throw getMdTooltipInvalidPositionError(this.position);
    }
    /**
     * Updates the tooltip message and repositions the overlay according to the new message length
     * @return {?}
     */
    _updateTooltipMessage() {
        // Must wait for the message to be painted to the tooltip so that the overlay can properly
        // calculate the correct positioning based on the size of the text.
        if (this._tooltipInstance) {
            this._tooltipInstance.message = this.message;
            this._tooltipInstance._markForCheck();
            first.call(this._ngZone.onMicrotaskEmpty.asObservable()).subscribe(() => {
                if (this._tooltipInstance) {
                    ((this._overlayRef)).updatePosition();
                }
            });
        }
    }
    /**
     * Updates the tooltip class
     * @param {?} tooltipClass
     * @return {?}
     */
    _setTooltipClass(tooltipClass) {
        if (this._tooltipInstance) {
            this._tooltipInstance.tooltipClass = tooltipClass;
            this._tooltipInstance._markForCheck();
        }
    }
}
MdTooltip.decorators = [
    { type: Directive, args: [{
                selector: '[md-tooltip], [mdTooltip], [mat-tooltip], [matTooltip]',
                host: {
                    '(longpress)': 'show()',
                    '(focus)': 'show()',
                    '(blur)': 'hide(0)',
                    '(keydown)': '_handleKeydown($event)',
                    '(touchend)': 'hide(' + TOUCHEND_HIDE_DELAY + ')',
                },
                exportAs: 'mdTooltip, matTooltip',
            },] },
];
/**
 * @nocollapse
 */
MdTooltip.ctorParameters = () => [
    { type: Renderer2, },
    { type: Overlay, },
    { type: ElementRef, },
    { type: ScrollDispatcher, },
    { type: ViewContainerRef, },
    { type: NgZone, },
    { type: Platform, },
    { type: AriaDescriber, },
    { type: undefined, decorators: [{ type: Inject, args: [MD_TOOLTIP_SCROLL_STRATEGY,] },] },
    { type: Directionality, decorators: [{ type: Optional },] },
];
MdTooltip.propDecorators = {
    'position': [{ type: Input, args: ['mdTooltipPosition',] },],
    'disabled': [{ type: Input, args: ['mdTooltipDisabled',] },],
    '_positionDeprecated': [{ type: Input, args: ['tooltip-position',] },],
    'showDelay': [{ type: Input, args: ['mdTooltipShowDelay',] },],
    'hideDelay': [{ type: Input, args: ['mdTooltipHideDelay',] },],
    'message': [{ type: Input, args: ['mdTooltip',] },],
    'tooltipClass': [{ type: Input, args: ['mdTooltipClass',] },],
    '_deprecatedMessage': [{ type: Input, args: ['md-tooltip',] },],
    '_matMessage': [{ type: Input, args: ['matTooltip',] },],
    '_matPosition': [{ type: Input, args: ['matTooltipPosition',] },],
    '_matDisabled': [{ type: Input, args: ['matTooltipDisabled',] },],
    '_matHideDelay': [{ type: Input, args: ['matTooltipHideDelay',] },],
    '_matShowDelay': [{ type: Input, args: ['matTooltipShowDelay',] },],
    '_matClass': [{ type: Input, args: ['matTooltipClass',] },],
};
/**
 * Internal component that wraps the tooltip's content.
 * \@docs-private
 */
class TooltipComponent {
    /**
     * @param {?} _dir
     * @param {?} _changeDetectorRef
     */
    constructor(_dir, _changeDetectorRef) {
        this._dir = _dir;
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
    show(position, delay) {
        // Cancel the delayed hide if it is scheduled
        if (this._hideTimeoutId) {
            clearTimeout(this._hideTimeoutId);
        }
        this._setTransformOrigin(position);
        this._showTimeoutId = setTimeout(() => {
            this._visibility = 'visible';
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            this._markForCheck();
        }, delay);
    }
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param {?} delay Amount of milliseconds to delay showing the tooltip.
     * @return {?}
     */
    hide(delay) {
        // Cancel the delayed show if it is scheduled
        if (this._showTimeoutId) {
            clearTimeout(this._showTimeoutId);
        }
        this._hideTimeoutId = setTimeout(() => {
            this._visibility = 'hidden';
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            this._markForCheck();
        }, delay);
    }
    /**
     * Returns an observable that notifies when the tooltip has been hidden from view
     * @return {?}
     */
    afterHidden() {
        return this._onHide.asObservable();
    }
    /**
     * Whether the tooltip is being displayed
     * @return {?}
     */
    isVisible() {
        return this._visibility === 'visible';
    }
    /**
     * Sets the tooltip transform origin according to the tooltip position
     * @param {?} value
     * @return {?}
     */
    _setTransformOrigin(value) {
        const /** @type {?} */ isLtr = !this._dir || this._dir.value == 'ltr';
        switch (value) {
            case 'before':
                this._transformOrigin = isLtr ? 'right' : 'left';
                break;
            case 'after':
                this._transformOrigin = isLtr ? 'left' : 'right';
                break;
            case 'left':
                this._transformOrigin = 'right';
                break;
            case 'right':
                this._transformOrigin = 'left';
                break;
            case 'above':
                this._transformOrigin = 'bottom';
                break;
            case 'below':
                this._transformOrigin = 'top';
                break;
            default: throw getMdTooltipInvalidPositionError(value);
        }
    }
    /**
     * @return {?}
     */
    _animationStart() {
        this._closeOnInteraction = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _animationDone(event) {
        const /** @type {?} */ toState = (event.toState);
        if (toState === 'hidden' && !this.isVisible()) {
            this._onHide.next();
        }
        if (toState === 'visible' || toState === 'hidden') {
            // Note: as of Angular 4.3, the animations module seems to fire the `start` callback before
            // the end if animations are disabled. Make this call async to ensure that it still fires
            // at the appropriate time.
            Promise.resolve().then(() => this._closeOnInteraction = true);
        }
    }
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.google.com/components/tooltips.html#tooltips-interaction
     * @return {?}
     */
    _handleBodyInteraction() {
        if (this._closeOnInteraction) {
            this.hide(0);
        }
    }
    /**
     * Marks that the tooltip needs to be checked in the next change detection run.
     * Mainly used for rendering the initial text before positioning a tooltip, which
     * can be problematic in components with OnPush change detection.
     * @return {?}
     */
    _markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
}
TooltipComponent.decorators = [
    { type: Component, args: [{selector: 'md-tooltip-component, mat-tooltip-component',
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
TooltipComponent.ctorParameters = () => [
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
];

class MdTooltipModule {
}
MdTooltipModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    OverlayModule,
                    MdCommonModule,
                    PlatformModule,
                    A11yModule,
                ],
                exports: [MdTooltip, TooltipComponent, MdCommonModule],
                declarations: [MdTooltip, TooltipComponent],
                entryComponents: [TooltipComponent],
                providers: [MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER, ARIA_DESCRIBER_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
MdTooltipModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MdTooltipModule, TOUCHEND_HIDE_DELAY, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, getMdTooltipInvalidPositionError, MD_TOOLTIP_SCROLL_STRATEGY, MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY, MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER, MdTooltip, TooltipComponent, MdTooltip as MatTooltip, MdTooltipModule as MatTooltipModule, MD_TOOLTIP_SCROLL_STRATEGY as MAT_TOOLTIP_SCROLL_STRATEGY, MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER as MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER, MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY as MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY };
//# sourceMappingURL=tooltip.js.map
