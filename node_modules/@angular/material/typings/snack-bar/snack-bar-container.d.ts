/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentRef, EmbeddedViewRef, NgZone, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { BasePortalHost, ComponentPortal, PortalHostDirective } from '@angular/cdk/portal';
import { Observable } from 'rxjs/Observable';
import { MdSnackBarConfig } from './snack-bar-config';
export declare type SnackBarState = 'initial' | 'visible' | 'complete' | 'void';
export declare const SHOW_ANIMATION = "225ms cubic-bezier(0.4,0.0,1,1)";
export declare const HIDE_ANIMATION = "195ms cubic-bezier(0.0,0.0,0.2,1)";
/**
 * Internal component that wraps user-provided snack bar content.
 * @docs-private
 */
export declare class MdSnackBarContainer extends BasePortalHost implements OnDestroy {
    private _ngZone;
    private _renderer;
    private _elementRef;
    /** The portal host inside of this container into which the snack bar content will be loaded. */
    _portalHost: PortalHostDirective;
    /** Subject for notifying that the snack bar has exited from view. */
    private onExit;
    /** Subject for notifying that the snack bar has finished entering the view. */
    private onEnter;
    /** The state of the snack bar animations. */
    animationState: SnackBarState;
    /** The snack bar configuration. */
    snackBarConfig: MdSnackBarConfig;
    constructor(_ngZone: NgZone, _renderer: Renderer2, _elementRef: ElementRef);
    /** Attach a component portal as content to this snack bar container. */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /** Attach a template portal as content to this snack bar container. */
    attachTemplatePortal(): EmbeddedViewRef<any>;
    /** Handle end of animations, updating the state of the snackbar. */
    onAnimationEnd(event: AnimationEvent): void;
    /** Begin animation of snack bar entrance into view. */
    enter(): void;
    /** Returns an observable resolving when the enter animation completes.  */
    _onEnter(): Observable<void>;
    /** Begin animation of the snack bar exiting from view. */
    exit(): Observable<void>;
    /** Returns an observable that completes after the closing animation is done. */
    _onExit(): Observable<void>;
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     */
    ngOnDestroy(): void;
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     */
    private _completeExit();
}
