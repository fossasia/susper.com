/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationEvent } from '@angular/animations';
import { AriaDescriber } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { OriginConnectionPosition, Overlay, OverlayConnectionPosition, OverlayRef, RepositionScrollStrategy, ScrollStrategy, ConnectionPositionPair } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, ElementRef, InjectionToken, NgZone, OnDestroy, Renderer2, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
export declare type TooltipPosition = 'left' | 'right' | 'above' | 'below' | 'before' | 'after';
/** Time in ms to delay before changing the tooltip visibility to hidden */
export declare const TOUCHEND_HIDE_DELAY = 1500;
/** Time in ms to throttle repositioning after scroll events. */
export declare const SCROLL_THROTTLE_MS = 20;
/** CSS class that will be attached to the overlay panel. */
export declare const TOOLTIP_PANEL_CLASS = "mat-tooltip-panel";
/** Creates an error to be thrown if the user supplied an invalid tooltip position. */
export declare function getMatTooltipInvalidPositionError(position: string): Error;
/** Injection token that determines the scroll handling while a tooltip is visible. */
export declare const MAT_TOOLTIP_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => RepositionScrollStrategy;
/** @docs-private */
export declare const MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: typeof Overlay[];
    useFactory: (overlay: Overlay) => () => RepositionScrollStrategy;
};
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.google.com/components/tooltips.html
 */
export declare class MatTooltip implements OnDestroy {
    private _overlay;
    private _elementRef;
    private _scrollDispatcher;
    private _viewContainerRef;
    private _ngZone;
    private _platform;
    private _ariaDescriber;
    private _scrollStrategy;
    private _dir;
    _overlayRef: OverlayRef | null;
    _tooltipInstance: TooltipComponent | null;
    private _position;
    private _disabled;
    private _tooltipClass;
    /** Allows the user to define the position of the tooltip relative to the parent element */
    position: TooltipPosition;
    /** Disables the display of the tooltip. */
    disabled: boolean;
    /** @deprecated */
    _positionDeprecated: TooltipPosition;
    /** The default delay in ms before showing the tooltip after show is called */
    showDelay: number;
    /** The default delay in ms before hiding the tooltip after hide is called */
    hideDelay: number;
    private _message;
    /** The message to be displayed in the tooltip */
    message: string;
    /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
    tooltipClass: string | string[] | Set<string> | {
        [key: string]: any;
    };
    private _enterListener;
    private _leaveListener;
    constructor(renderer: Renderer2, _overlay: Overlay, _elementRef: ElementRef, _scrollDispatcher: ScrollDispatcher, _viewContainerRef: ViewContainerRef, _ngZone: NgZone, _platform: Platform, _ariaDescriber: AriaDescriber, _scrollStrategy: any, _dir: Directionality);
    /**
     * Dispose the tooltip when destroyed.
     */
    ngOnDestroy(): void;
    /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
    show(delay?: number): void;
    /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
    hide(delay?: number): void;
    /** Shows/hides the tooltip */
    toggle(): void;
    /** Returns true if the tooltip is currently visible to the user */
    _isTooltipVisible(): boolean;
    /** Handles the keydown events on the host element. */
    _handleKeydown(e: KeyboardEvent): void;
    /** Create the tooltip to display */
    private _createTooltip();
    /** Create the overlay config and position strategy */
    private _createOverlay();
    /** Disposes the current tooltip and the overlay it is attached to */
    private _disposeTooltip();
    /**
     * Returns the origin position and a fallback position based on the user's position preference.
     * The fallback position is the inverse of the origin (e.g. 'below' -> 'above').
     */
    _getOrigin(): {
        main: OriginConnectionPosition;
        fallback: OriginConnectionPosition;
    };
    /** Returns the overlay position and a fallback position based on the user's preference */
    _getOverlayPosition(): {
        main: OverlayConnectionPosition;
        fallback: OverlayConnectionPosition;
    };
    /** Updates the tooltip message and repositions the overlay according to the new message length */
    private _updateTooltipMessage();
    /** Updates the tooltip class */
    private _setTooltipClass(tooltipClass);
    /** Inverts an overlay position. */
    private _invertPosition(x, y);
}
export declare type TooltipVisibility = 'initial' | 'visible' | 'hidden';
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
export declare class TooltipComponent {
    private _changeDetectorRef;
    /** Message to display in the tooltip */
    message: string;
    /** Classes to be added to the tooltip. Supports the same syntax as `ngClass`. */
    tooltipClass: string | string[] | Set<string> | {
        [key: string]: any;
    };
    /** The timeout ID of any current timer set to show the tooltip */
    _showTimeoutId: number;
    /** The timeout ID of any current timer set to hide the tooltip */
    _hideTimeoutId: number;
    /** Property watched by the animation framework to show or hide the tooltip */
    _visibility: TooltipVisibility;
    /** Whether interactions on the page should close the tooltip */
    private _closeOnInteraction;
    /** The transform origin used in the animation for showing and hiding the tooltip */
    _transformOrigin: 'top' | 'bottom' | 'left' | 'right';
    /** Current position of the tooltip. */
    private _position;
    /** Subject for notifying that the tooltip has been hidden from the view */
    private _onHide;
    constructor(_changeDetectorRef: ChangeDetectorRef);
    /**
     * Shows the tooltip with an animation originating from the provided origin
     * @param position Position of the tooltip.
     * @param delay Amount of milliseconds to the delay showing the tooltip.
     */
    show(position: TooltipPosition, delay: number): void;
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param delay Amount of milliseconds to delay showing the tooltip.
     */
    hide(delay: number): void;
    /** Returns an observable that notifies when the tooltip has been hidden from view. */
    afterHidden(): Observable<void>;
    /** Whether the tooltip is being displayed. */
    isVisible(): boolean;
    /** Sets the tooltip transform origin according to the position of the tooltip overlay. */
    _setTransformOrigin(overlayPosition: ConnectionPositionPair): void;
    _animationStart(): void;
    _animationDone(event: AnimationEvent): void;
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.google.com/components/tooltips.html#tooltips-interaction
     */
    _handleBodyInteraction(): void;
    /**
     * Marks that the tooltip needs to be checked in the next change detection run.
     * Mainly used for rendering the initial text before positioning a tooltip, which
     * can be problematic in components with OnPush change detection.
     */
    _markForCheck(): void;
}
