/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, OnInit, ElementRef, AfterViewChecked } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { TemplatePortal, PortalHostDirective } from '@angular/cdk/portal';
import { Directionality, Direction } from '@angular/cdk/bidi';
/**
 * These position states are used internally as animation states for the tab body. Setting the
 * position state to left, right, or center will transition the tab body from its current
 * position to its respective state. If there is not current position (void, in the case of a new
 * tab body), then there will be no transition animation to its state.
 *
 * In the case of a new tab body that should immediately be centered with an animating transition,
 * then left-origin-center or right-origin-center can be used, which will use left or right as its
 * psuedo-prior state.
 */
export declare type MatTabBodyPositionState = 'left' | 'center' | 'right' | 'left-origin-center' | 'right-origin-center';
/**
 * The origin state is an internally used state that is set on a new tab body indicating if it
 * began to the left or right of the prior selected index. For example, if the selected index was
 * set to 1, and a new tab is created and selected at index 2, then the tab body would have an
 * origin of right because its index was greater than the prior selected index.
 */
export declare type MatTabBodyOriginState = 'left' | 'right';
/**
 * Wrapper for the contents of a tab.
 * @docs-private
 */
export declare class MatTabBody implements OnInit, AfterViewChecked {
    private _elementRef;
    private _dir;
    /** The portal host inside of this container into which the tab body content will be loaded. */
    _portalHost: PortalHostDirective;
    /** Event emitted when the tab begins to animate towards the center as the active tab. */
    _onCentering: EventEmitter<number>;
    /** Event emitted when the tab completes its animation towards the center. */
    _onCentered: EventEmitter<void>;
    /** The tab body content to display. */
    _content: TemplatePortal<any>;
    /** The shifted index position of the tab body, where zero represents the active center tab. */
    _position: MatTabBodyPositionState;
    position: number;
    /** The origin position from which this tab should appear when it is centered into view. */
    _origin: MatTabBodyOriginState;
    /** The origin position from which this tab should appear when it is centered into view. */
    origin: number;
    constructor(_elementRef: ElementRef, _dir: Directionality);
    /**
     * After initialized, check if the content is centered and has an origin. If so, set the
     * special position states that transition the tab from the left or right before centering.
     */
    ngOnInit(): void;
    /**
     * After the view has been set, check if the tab content is set to the center and attach the
     * content if it is not already attached.
     */
    ngAfterViewChecked(): void;
    _onTranslateTabStarted(e: AnimationEvent): void;
    _onTranslateTabComplete(e: AnimationEvent): void;
    /** The text direction of the containing app. */
    _getLayoutDirection(): Direction;
    /** Whether the provided position state is considered center, regardless of origin. */
    private _isCenterPosition(position);
}
