/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, NgZone } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { RippleRef } from './ripple-ref';
/** Fade-in duration for the ripples. Can be modified with the speedFactor option. */
export declare const RIPPLE_FADE_IN_DURATION = 450;
/** Fade-out duration for the ripples in milliseconds. This can't be modified by the speedFactor. */
export declare const RIPPLE_FADE_OUT_DURATION = 400;
export declare type RippleConfig = {
    color?: string;
    centered?: boolean;
    radius?: number;
    speedFactor?: number;
    persistent?: boolean;
};
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * @docs-private
 */
export declare class RippleRenderer {
    private _ngZone;
    private _ruler;
    /** Element where the ripples are being added to. */
    private _containerElement;
    /** Element which triggers the ripple elements on mouse events. */
    private _triggerElement;
    /** Whether the mouse is currently down or not. */
    private _isMousedown;
    /** Events to be registered on the trigger element. */
    private _triggerEvents;
    /** Set of currently active ripple references. */
    private _activeRipples;
    /** Ripple config for all ripples created by events. */
    rippleConfig: RippleConfig;
    /** Whether mouse ripples should be created or not. */
    rippleDisabled: boolean;
    constructor(elementRef: ElementRef, _ngZone: NgZone, _ruler: ViewportRuler, platform: Platform);
    /** Fades in a ripple at the given coordinates. */
    fadeInRipple(pageX: number, pageY: number, config?: RippleConfig): RippleRef;
    /** Fades out a ripple reference. */
    fadeOutRipple(rippleRef: RippleRef): void;
    /** Fades out all currently active ripples. */
    fadeOutAll(): void;
    /** Sets the trigger element and registers the mouse events. */
    setTriggerElement(element: HTMLElement | null): void;
    /** Listener being called on mousedown event. */
    private onMousedown(event);
    /** Listener being called on mouseup event. */
    private onMouseup();
    /** Listener being called on mouseleave event. */
    private onMouseLeave();
    /** Runs a timeout outside of the Angular zone to avoid triggering the change detection. */
    private runTimeoutOutsideZone(fn, delay?);
}
