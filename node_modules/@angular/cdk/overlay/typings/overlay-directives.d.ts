/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, EventEmitter, InjectionToken, OnChanges, OnDestroy, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { Overlay } from './overlay';
import { OverlayRef } from './overlay-ref';
import { ConnectedOverlayPositionChange, ConnectionPositionPair } from './position/connected-position';
import { RepositionScrollStrategy, ScrollStrategy } from './scroll/index';
/** Injection token that determines the scroll handling while the connected overlay is open. */
export declare const MAT_CONNECTED_OVERLAY_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MAT_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => RepositionScrollStrategy;
/** @docs-private */
export declare const MAT_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: typeof Overlay[];
    useFactory: (overlay: Overlay) => () => RepositionScrollStrategy;
};
/**
 * Directive applied to an element to make it usable as an origin for an Overlay using a
 * ConnectedPositionStrategy.
 */
export declare class OverlayOrigin {
    elementRef: ElementRef;
    constructor(elementRef: ElementRef);
}
/**
 * Directive to facilitate declarative creation of an Overlay using a ConnectedPositionStrategy.
 */
export declare class ConnectedOverlayDirective implements OnDestroy, OnChanges {
    private _overlay;
    private _renderer;
    private _scrollStrategy;
    private _dir;
    private _overlayRef;
    private _templatePortal;
    private _hasBackdrop;
    private _backdropSubscription;
    private _positionSubscription;
    private _offsetX;
    private _offsetY;
    private _position;
    private _escapeListener;
    /** Origin for the connected overlay. */
    origin: OverlayOrigin;
    /** Registered connected position pairs. */
    positions: ConnectionPositionPair[];
    /** The offset in pixels for the overlay connection point on the x-axis */
    offsetX: number;
    /** The offset in pixels for the overlay connection point on the y-axis */
    offsetY: number;
    /** The width of the overlay panel. */
    width: number | string;
    /** The height of the overlay panel. */
    height: number | string;
    /** The min width of the overlay panel. */
    minWidth: number | string;
    /** The min height of the overlay panel. */
    minHeight: number | string;
    /** The custom class to be set on the backdrop element. */
    backdropClass: string;
    /** Strategy to be used when handling scroll events while the overlay is open. */
    scrollStrategy: ScrollStrategy;
    /** Whether the overlay is open. */
    open: boolean;
    /** Whether or not the overlay should attach a backdrop. */
    hasBackdrop: any;
    /** @deprecated */
    _deprecatedOrigin: OverlayOrigin;
    /** @deprecated */
    _deprecatedPositions: ConnectionPositionPair[];
    /** @deprecated */
    _deprecatedOffsetX: number;
    /** @deprecated */
    _deprecatedOffsetY: number;
    /** @deprecated */
    _deprecatedWidth: number | string;
    /** @deprecated */
    _deprecatedHeight: number | string;
    /** @deprecated */
    _deprecatedMinWidth: number | string;
    /** @deprecated */
    _deprecatedMinHeight: number | string;
    /** @deprecated */
    _deprecatedBackdropClass: string;
    /** @deprecated */
    _deprecatedScrollStrategy: ScrollStrategy;
    /** @deprecated */
    _deprecatedOpen: boolean;
    /** @deprecated */
    _deprecatedHasBackdrop: any;
    /** Event emitted when the backdrop is clicked. */
    backdropClick: EventEmitter<void>;
    /** Event emitted when the position has changed. */
    positionChange: EventEmitter<ConnectedOverlayPositionChange>;
    /** Event emitted when the overlay has been attached. */
    attach: EventEmitter<void>;
    /** Event emitted when the overlay has been detached. */
    detach: EventEmitter<void>;
    constructor(_overlay: Overlay, _renderer: Renderer2, templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, _scrollStrategy: any, _dir: Directionality);
    /** The associated overlay reference. */
    readonly overlayRef: OverlayRef;
    /** The element's layout direction. */
    readonly dir: Direction;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /** Creates an overlay */
    private _createOverlay();
    /** Builds the overlay config based on the directive's inputs */
    private _buildConfig();
    /** Returns the position strategy of the overlay to be set on the overlay config */
    private _createPositionStrategy();
    private _handlePositionChanges(strategy);
    /** Attaches the overlay and subscribes to backdrop clicks if backdrop exists */
    private _attachOverlay();
    /** Detaches the overlay and unsubscribes to backdrop clicks if backdrop exists */
    private _detachOverlay();
    /** Destroys the overlay created by this directive. */
    private _destroyOverlay();
    /** Sets the event listener that closes the overlay when pressing Escape. */
    private _initEscapeListener();
}
