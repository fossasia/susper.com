/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ElementRef, InjectionToken, NgZone, OnDestroy, Renderer2, ViewContainerRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs/Observable';
import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { OriginConnectionPosition, Overlay, OverlayConnectionPosition, OverlayRef, RepositionScrollStrategy, ScrollStrategy } from '@angular/cdk/overlay';
export declare type TooltipPosition = 'left' | 'right' | 'above' | 'below' | 'before' | 'after';
/** Time in ms to delay before changing the tooltip visibility to hidden */
export declare const TOUCHEND_HIDE_DELAY = 1500;
/** Time in ms to throttle repositioning after scroll events. */
export declare const SCROLL_THROTTLE_MS = 20;
/** CSS class that will be attached to the overlay panel. */
export declare const TOOLTIP_PANEL_CLASS = "mat-tooltip-panel";
/** Creates an error to be thrown if the user supplied an invalid tooltip position. */
export declare function getMdTooltipInvalidPositionError(position: string): Error;
/** Injection token that determines the scroll handling while a tooltip is visible. */
export declare const MD_TOOLTIP_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => RepositionScrollStrategy;
/** @docs-private */
export declare const MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER: {
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
export declare class MdTooltip implements OnDestroy {
    private _overlay;
    private _elementRef;
    private _scrollDispatcher;
    private _viewContainerRef;
    private _ngZone;
    private _renderer;
    private _platform;
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
    /** @deprecated */
    _deprecatedMessage: string;
    _matMessage: string;
    _matPosition: TooltipPosition;
    _matDisabled: boolean;
    _matHideDelay: number;
    _matShowDelay: number;
    _matClass: string | string[] | Set<string> | {
        [key: string]: any;
    };
    private _enterListener;
    private _leaveListener;
    constructor(_overlay: Overlay, _elementRef: ElementRef, _scrollDispatcher: ScrollDispatcher, _viewContainerRef: ViewContainerRef, _ngZone: NgZone, _renderer: Renderer2, _platform: Platform, _scrollStrategy: any, _dir: Directionality);
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
    /** Create the tooltip to display */
    private _createTooltip();
    /** Create the overlay config and position strategy */
    private _createOverlay();
    /** Disposes the current tooltip and the overlay it is attached to */
    private _disposeTooltip();
    /** Returns the origin position based on the user's position preference */
    _getOrigin(): OriginConnectionPosition;
    /** Returns the overlay position based on the user's preference */
    _getOverlayPosition(): OverlayConnectionPosition;
    /** Updates the tooltip message and repositions the overlay according to the new message length */
    private _setTooltipMessage(message);
    /** Updates the tooltip class */
    private _setTooltipClass(tooltipClass);
}
export declare type TooltipVisibility = 'initial' | 'visible' | 'hidden';
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
export declare class TooltipComponent {
    private _dir;
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
    _closeOnInteraction: boolean;
    /** The transform origin used in the animation for showing and hiding the tooltip */
    _transformOrigin: string;
    /** Subject for notifying that the tooltip has been hidden from the view */
    private _onHide;
    constructor(_dir: Directionality, _changeDetectorRef: ChangeDetectorRef);
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
    /**
     * Returns an observable that notifies when the tooltip has been hidden from view
     */
    afterHidden(): Observable<void>;
    /**
     * Whether the tooltip is being displayed
     */
    isVisible(): boolean;
    /** Sets the tooltip transform origin according to the tooltip position */
    _setTransformOrigin(value: TooltipPosition): void;
    _afterVisibilityAnimation(e: AnimationEvent): void;
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
