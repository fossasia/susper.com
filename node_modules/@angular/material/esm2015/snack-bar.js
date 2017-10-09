/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Injectable, InjectionToken, Injector, NgModule, NgZone, Optional, Renderer2, SkipSelf, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { BasePortalHost, ComponentPortal, PortalHostDirective, PortalInjector, PortalModule } from '@angular/cdk/portal';
import { LIVE_ANNOUNCER_PROVIDER, LiveAnnouncer } from '@angular/cdk/a11y';
import { MatCommonModule, extendObject } from '@angular/material/core';
import { Subject } from 'rxjs/Subject';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { first } from '@angular/cdk/rxjs';

/**
 * Reference to a snack bar dispatched from the snack bar service.
 */
class MatSnackBarRef {
    /**
     * @param {?} containerInstance
     * @param {?} _overlayRef
     */
    constructor(containerInstance, _overlayRef) {
        this._overlayRef = _overlayRef;
        /**
         * Subject for notifying the user that the snack bar has closed.
         */
        this._afterClosed = new Subject();
        /**
         * Subject for notifying the user that the snack bar has opened and appeared.
         */
        this._afterOpened = new Subject();
        /**
         * Subject for notifying the user that the snack bar action was called.
         */
        this._onAction = new Subject();
        this.containerInstance = containerInstance;
        // Dismiss snackbar on action.
        this.onAction().subscribe(() => this.dismiss());
        containerInstance._onExit.subscribe(() => this._finishDismiss());
    }
    /**
     * Dismisses the snack bar.
     * @return {?}
     */
    dismiss() {
        if (!this._afterClosed.closed) {
            this.containerInstance.exit();
        }
        clearTimeout(this._durationTimeoutId);
    }
    /**
     * Marks the snackbar action clicked.
     * @return {?}
     */
    closeWithAction() {
        if (!this._onAction.closed) {
            this._onAction.next();
            this._onAction.complete();
        }
    }
    /**
     * Dismisses the snack bar after some duration
     * @param {?} duration
     * @return {?}
     */
    _dismissAfter(duration) {
        this._durationTimeoutId = setTimeout(() => this.dismiss(), duration);
    }
    /**
     * Marks the snackbar as opened
     * @return {?}
     */
    _open() {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    }
    /**
     * Cleans up the DOM after closing.
     * @return {?}
     */
    _finishDismiss() {
        this._overlayRef.dispose();
        this._afterClosed.next();
        this._afterClosed.complete();
    }
    /**
     * Gets an observable that is notified when the snack bar is finished closing.
     * @return {?}
     */
    afterDismissed() {
        return this._afterClosed.asObservable();
    }
    /**
     * Gets an observable that is notified when the snack bar has opened and appeared.
     * @return {?}
     */
    afterOpened() {
        return this.containerInstance._onEnter;
    }
    /**
     * Gets an observable that is notified when the snack bar action is called.
     * @return {?}
     */
    onAction() {
        return this._onAction.asObservable();
    }
}

const MAT_SNACK_BAR_DATA = new InjectionToken('MatSnackBarData');
/**
 * Configuration used when opening a snack-bar.
 */
class MatSnackBarConfig {
    constructor() {
        /**
         * The politeness level for the MatAriaLiveAnnouncer announcement.
         */
        this.politeness = 'assertive';
        /**
         * Message to be announced by the MatAriaLiveAnnouncer
         */
        this.announcementMessage = '';
        /**
         * The length of time in milliseconds to wait before automatically dismissing the snack bar.
         */
        this.duration = 0;
        /**
         * Text layout direction for the snack bar.
         */
        this.direction = 'ltr';
        /**
         * Data being injected into the child component.
         */
        this.data = null;
        /**
         * The horizontal position to place the snack bar.
         */
        this.horizontalPosition = 'center';
        /**
         * The vertical position to place the snack bar.
         */
        this.verticalPosition = 'bottom';
    }
}

/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
class SimpleSnackBar {
    /**
     * @param {?} snackBarRef
     * @param {?} data
     */
    constructor(snackBarRef, data) {
        this.snackBarRef = snackBarRef;
        this.data = data;
    }
    /**
     * Performs the action on the snack bar.
     * @return {?}
     */
    action() {
        this.snackBarRef.closeWithAction();
    }
    /**
     * If the action button should be shown.
     * @return {?}
     */
    get hasAction() {
        return !!this.data.action;
    }
}
SimpleSnackBar.decorators = [
    { type: Component, args: [{selector: 'simple-snack-bar',
                template: "{{data.message}} <button class=\"mat-simple-snackbar-action\" *ngIf=\"hasAction\" (click)=\"action()\">{{data.action}}</button>",
                styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;line-height:20px}.mat-simple-snackbar-action{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;background:0 0;flex-shrink:0;margin-left:48px}[dir=rtl] .mat-simple-snackbar-action{margin-right:48px;margin-left:0}"],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-simple-snackbar',
                }
            },] },
];
/**
 * @nocollapse
 */
SimpleSnackBar.ctorParameters = () => [
    { type: MatSnackBarRef, },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_SNACK_BAR_DATA,] },] },
];

// TODO(jelbourn): we can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
const SHOW_ANIMATION = '225ms cubic-bezier(0.4,0.0,1,1)';
const HIDE_ANIMATION = '195ms cubic-bezier(0.0,0.0,0.2,1)';
/**
 * Internal component that wraps user-provided snack bar content.
 * \@docs-private
 */
class MatSnackBarContainer extends BasePortalHost {
    /**
     * @param {?} _ngZone
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _changeDetectorRef
     */
    constructor(_ngZone, _renderer, _elementRef, _changeDetectorRef) {
        super();
        this._ngZone = _ngZone;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Whether the component has been destroyed.
         */
        this._destroyed = false;
        /**
         * Subject for notifying that the snack bar has exited from view.
         */
        this._onExit = new Subject();
        /**
         * Subject for notifying that the snack bar has finished entering the view.
         */
        this._onEnter = new Subject();
        /**
         * The state of the snack bar animations.
         */
        this._animationState = 'void';
    }
    /**
     * Attach a component portal as content to this snack bar container.
     * @template T
     * @param {?} portal
     * @return {?}
     */
    attachComponentPortal(portal) {
        if (this._portalHost.hasAttached()) {
            throw Error('Attempting to attach snack bar content after content is already attached');
        }
        if (this.snackBarConfig.extraClasses) {
            // Not the most efficient way of adding classes, but the renderer doesn't allow us
            // to pass in an array or a space-separated list.
            for (let /** @type {?} */ cssClass of this.snackBarConfig.extraClasses) {
                this._renderer.addClass(this._elementRef.nativeElement, cssClass);
            }
        }
        if (this.snackBarConfig.horizontalPosition === 'center') {
            this._renderer.addClass(this._elementRef.nativeElement, 'mat-snack-bar-center');
        }
        if (this.snackBarConfig.verticalPosition === 'top') {
            this._renderer.addClass(this._elementRef.nativeElement, 'mat-snack-bar-top');
        }
        return this._portalHost.attachComponentPortal(portal);
    }
    /**
     * Attach a template portal as content to this snack bar container.
     * @return {?}
     */
    attachTemplatePortal() {
        throw Error('Not yet implemented');
    }
    /**
     * Handle end of animations, updating the state of the snackbar.
     * @param {?} event
     * @return {?}
     */
    onAnimationEnd(event) {
        const { fromState, toState } = event;
        if ((toState === 'void' && fromState !== 'void') || toState.startsWith('hidden')) {
            this._completeExit();
        }
        if (toState.startsWith('visible')) {
            // Note: we shouldn't use `this` inside the zone callback,
            // because it can cause a memory leak.
            const /** @type {?} */ onEnter = this._onEnter;
            this._ngZone.run(() => {
                onEnter.next();
                onEnter.complete();
            });
        }
    }
    /**
     * Begin animation of snack bar entrance into view.
     * @return {?}
     */
    enter() {
        if (!this._destroyed) {
            this._animationState = `visible-${this.snackBarConfig.verticalPosition}`;
            this._changeDetectorRef.detectChanges();
        }
    }
    /**
     * Begin animation of the snack bar exiting from view.
     * @return {?}
     */
    exit() {
        this._animationState = `hidden-${this.snackBarConfig.verticalPosition}`;
        return this._onExit;
    }
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed = true;
        this._completeExit();
    }
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     * @return {?}
     */
    _completeExit() {
        first.call(this._ngZone.onMicrotaskEmpty.asObservable()).subscribe(() => {
            this._onExit.next();
            this._onExit.complete();
        });
    }
}
MatSnackBarContainer.decorators = [
    { type: Component, args: [{selector: 'snack-bar-container',
                template: "<ng-template cdkPortalHost></ng-template>",
                styles: [".mat-snack-bar-container{border-radius:2px;box-sizing:content-box;display:block;margin:24px;max-width:568px;min-width:288px;padding:14px 24px;transform:translateY(100%) translateY(24px)}.mat-snack-bar-container.mat-snack-bar-center{margin:0;transform:translateY(100%)}.mat-snack-bar-container.mat-snack-bar-top{transform:translateY(-100%) translateY(-24px)}.mat-snack-bar-container.mat-snack-bar-top.mat-snack-bar-center{transform:translateY(-100%)}@media screen and (-ms-high-contrast:active){.mat-snack-bar-container{border:solid 1px}}"],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                host: {
                    'role': 'alert',
                    'class': 'mat-snack-bar-container',
                    '[@state]': '_animationState',
                    '(@state.done)': 'onAnimationEnd($event)'
                },
                animations: [
                    trigger('state', [
                        state('visible-top, visible-bottom', style({ transform: 'translateY(0%)' })),
                        transition('visible-top => hidden-top, visible-bottom => hidden-bottom', animate(HIDE_ANIMATION)),
                        transition('void => visible-top, void => visible-bottom', animate(SHOW_ANIMATION)),
                    ])
                ],
            },] },
];
/**
 * @nocollapse
 */
MatSnackBarContainer.ctorParameters = () => [
    { type: NgZone, },
    { type: Renderer2, },
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
];
MatSnackBarContainer.propDecorators = {
    '_portalHost': [{ type: ViewChild, args: [PortalHostDirective,] },],
};

/**
 * Service to dispatch Material Design snack bar messages.
 */
class MatSnackBar {
    /**
     * @param {?} _overlay
     * @param {?} _live
     * @param {?} _injector
     * @param {?} _parentSnackBar
     */
    constructor(_overlay, _live, _injector, _parentSnackBar) {
        this._overlay = _overlay;
        this._live = _live;
        this._injector = _injector;
        this._parentSnackBar = _parentSnackBar;
        /**
         * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
         * If there is a parent snack-bar service, all operations should delegate to that parent
         * via `_openedSnackBarRef`.
         */
        this._snackBarRefAtThisLevel = null;
    }
    /**
     * Reference to the currently opened snackbar at *any* level.
     * @return {?}
     */
    get _openedSnackBarRef() {
        const /** @type {?} */ parent = this._parentSnackBar;
        return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set _openedSnackBarRef(value) {
        if (this._parentSnackBar) {
            this._parentSnackBar._openedSnackBarRef = value;
        }
        else {
            this._snackBarRefAtThisLevel = value;
        }
    }
    /**
     * Creates and dispatches a snack bar with a custom component for the content, removing any
     * currently opened snack bars.
     *
     * @template T
     * @param {?} component Component to be instantiated.
     * @param {?=} config Extra configuration for the snack bar.
     * @return {?}
     */
    openFromComponent(component, config) {
        const /** @type {?} */ _config = _applyConfigDefaults(config);
        const /** @type {?} */ snackBarRef = this._attach(component, _config);
        // When the snackbar is dismissed, clear the reference to it.
        snackBarRef.afterDismissed().subscribe(() => {
            // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
            if (this._openedSnackBarRef == snackBarRef) {
                this._openedSnackBarRef = null;
            }
        });
        if (this._openedSnackBarRef) {
            // If a snack bar is already in view, dismiss it and enter the
            // new snack bar after exit animation is complete.
            this._openedSnackBarRef.afterDismissed().subscribe(() => {
                snackBarRef.containerInstance.enter();
            });
            this._openedSnackBarRef.dismiss();
        }
        else {
            // If no snack bar is in view, enter the new snack bar.
            snackBarRef.containerInstance.enter();
        }
        // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
        if (_config.duration && _config.duration > 0) {
            snackBarRef.afterOpened().subscribe(() => snackBarRef._dismissAfter(/** @type {?} */ ((((_config)).duration))));
        }
        if (_config.announcementMessage) {
            this._live.announce(_config.announcementMessage, _config.politeness);
        }
        this._openedSnackBarRef = snackBarRef;
        return this._openedSnackBarRef;
    }
    /**
     * Opens a snackbar with a message and an optional action.
     * @param {?} message The message to show in the snackbar.
     * @param {?=} action The label for the snackbar action.
     * @param {?=} config Additional configuration options for the snackbar.
     * @return {?}
     */
    open(message, action = '', config) {
        const /** @type {?} */ _config = _applyConfigDefaults(config);
        // Since the user doesn't have access to the component, we can
        // override the data to pass in our own message and action.
        _config.data = { message, action };
        _config.announcementMessage = message;
        return this.openFromComponent(SimpleSnackBar, _config);
    }
    /**
     * Dismisses the currently-visible snack bar.
     * @return {?}
     */
    dismiss() {
        if (this._openedSnackBarRef) {
            this._openedSnackBarRef.dismiss();
        }
    }
    /**
     * Attaches the snack bar container component to the overlay.
     * @param {?} overlayRef
     * @param {?} config
     * @return {?}
     */
    _attachSnackBarContainer(overlayRef, config) {
        const /** @type {?} */ containerPortal = new ComponentPortal(MatSnackBarContainer, config.viewContainerRef);
        const /** @type {?} */ containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.snackBarConfig = config;
        return containerRef.instance;
    }
    /**
     * Places a new component as the content of the snack bar container.
     * @template T
     * @param {?} component
     * @param {?} config
     * @return {?}
     */
    _attach(component, config) {
        const /** @type {?} */ overlayRef = this._createOverlay(config);
        const /** @type {?} */ container = this._attachSnackBarContainer(overlayRef, config);
        const /** @type {?} */ snackBarRef = new MatSnackBarRef(container, overlayRef);
        const /** @type {?} */ injector = this._createInjector(config, snackBarRef);
        const /** @type {?} */ portal = new ComponentPortal(component, undefined, injector);
        const /** @type {?} */ contentRef = container.attachComponentPortal(portal);
        // We can't pass this via the injector, because the injector is created earlier.
        snackBarRef.instance = contentRef.instance;
        return snackBarRef;
    }
    /**
     * Creates a new overlay and places it in the correct location.
     * @param {?} config The user-specified snack bar config.
     * @return {?}
     */
    _createOverlay(config) {
        const /** @type {?} */ overlayConfig = new OverlayConfig();
        overlayConfig.direction = config.direction;
        let /** @type {?} */ positionStrategy = this._overlay.position().global();
        // Set horizontal position.
        const /** @type {?} */ isRtl = config.direction === 'rtl';
        const /** @type {?} */ isLeft = (config.horizontalPosition === 'left' ||
            (config.horizontalPosition === 'start' && !isRtl) ||
            (config.horizontalPosition === 'end' && isRtl));
        const /** @type {?} */ isRight = !isLeft && config.horizontalPosition !== 'center';
        if (isLeft) {
            positionStrategy.left('0');
        }
        else if (isRight) {
            positionStrategy.right('0');
        }
        else {
            positionStrategy.centerHorizontally();
        }
        // Set horizontal position.
        if (config.verticalPosition === 'top') {
            positionStrategy.top('0');
        }
        else {
            positionStrategy.bottom('0');
        }
        overlayConfig.positionStrategy = positionStrategy;
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an injector to be used inside of a snack bar component.
     * @template T
     * @param {?} config Config that was used to create the snack bar.
     * @param {?} snackBarRef Reference to the snack bar.
     * @return {?}
     */
    _createInjector(config, snackBarRef) {
        const /** @type {?} */ userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const /** @type {?} */ injectionTokens = new WeakMap();
        injectionTokens.set(MatSnackBarRef, snackBarRef);
        injectionTokens.set(MAT_SNACK_BAR_DATA, config.data);
        return new PortalInjector(userInjector || this._injector, injectionTokens);
    }
}
MatSnackBar.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MatSnackBar.ctorParameters = () => [
    { type: Overlay, },
    { type: LiveAnnouncer, },
    { type: Injector, },
    { type: MatSnackBar, decorators: [{ type: Optional }, { type: SkipSelf },] },
];
/**
 * Applies default options to the snackbar config.
 * @param {?=} config The configuration to which the defaults will be applied.
 * @return {?} The new configuration object with defaults applied.
 */
function _applyConfigDefaults(config) {
    return extendObject(new MatSnackBarConfig(), config);
}

class MatSnackBarModule {
}
MatSnackBarModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    OverlayModule,
                    PortalModule,
                    CommonModule,
                    MatCommonModule,
                ],
                exports: [MatSnackBarContainer, MatCommonModule],
                declarations: [MatSnackBarContainer, SimpleSnackBar],
                entryComponents: [MatSnackBarContainer, SimpleSnackBar],
                providers: [MatSnackBar, LIVE_ANNOUNCER_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MatSnackBarModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MatSnackBarModule, MatSnackBar, SHOW_ANIMATION, HIDE_ANIMATION, MatSnackBarContainer, MAT_SNACK_BAR_DATA, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar };
//# sourceMappingURL=snack-bar.js.map
