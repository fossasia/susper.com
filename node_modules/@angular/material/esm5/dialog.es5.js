import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, Inject, Injectable, InjectionToken, Injector, Input, NgModule, Optional, SkipSelf, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { BasePortalHost, ComponentPortal, PortalHostDirective, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { A11yModule, FocusTrapFactory } from '@angular/cdk/a11y';
import { MdCommonModule, PortalInjector, extendObject } from '@angular/material/core';
import { ESCAPE } from '@angular/cdk/keycodes';
import { RxChain, filter, first, startWith } from '@angular/cdk/rxjs';
import { defer } from 'rxjs/observable/defer';
import { Subject } from 'rxjs/Subject';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/platform-browser';
/**
 * Configuration for opening a modal dialog with the MdDialog service.
 */
var MdDialogConfig = (function () {
    function MdDialogConfig() {
        /**
         * The ARIA role of the dialog element.
         */
        this.role = 'dialog';
        /**
         * Custom class for the overlay pane.
         */
        this.panelClass = '';
        /**
         * Whether the dialog has a backdrop.
         */
        this.hasBackdrop = true;
        /**
         * Custom class for the backdrop,
         */
        this.backdropClass = '';
        /**
         * Whether the user can use escape or clicking outside to close a modal.
         */
        this.disableClose = false;
        /**
         * Width of the dialog.
         */
        this.width = '';
        /**
         * Height of the dialog.
         */
        this.height = '';
        /**
         * Data being injected into the child component.
         */
        this.data = null;
        /**
         * Layout direction for the dialog's content.
         */
        this.direction = 'ltr';
        /**
         * ID of the element that describes the dialog.
         */
        this.ariaDescribedBy = null;
        // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
    }
    return MdDialogConfig;
}());
/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalHost without an origin.
 * \@docs-private
 * @return {?}
 */
function throwMdDialogContentAlreadyAttachedError() {
    throw Error('Attempting to attach dialog content after content is already attached');
}
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * \@docs-private
 */
var MdDialogContainer = (function (_super) {
    tslib_1.__extends(MdDialogContainer, _super);
    /**
     * @param {?} _elementRef
     * @param {?} _focusTrapFactory
     * @param {?} _changeDetectorRef
     * @param {?} _document
     */
    function MdDialogContainer(_elementRef, _focusTrapFactory, _changeDetectorRef, _document) {
        var _this = _super.call(this) || this;
        _this._elementRef = _elementRef;
        _this._focusTrapFactory = _focusTrapFactory;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._document = _document;
        /**
         * Element that was focused before the dialog was opened. Save this to restore upon close.
         */
        _this._elementFocusedBeforeDialogWasOpened = null;
        /**
         * State of the dialog animation.
         */
        _this._state = 'enter';
        /**
         * Emits when an animation state changes.
         */
        _this._animationStateChanged = new EventEmitter();
        /**
         * ID of the element that should be considered as the dialog's label.
         */
        _this._ariaLabelledBy = null;
        /**
         * Whether the container is currently mid-animation.
         */
        _this._isAnimating = false;
        return _this;
    }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @template T
     * @param {?} portal Portal to be attached as the dialog content.
     * @return {?}
     */
    MdDialogContainer.prototype.attachComponentPortal = function (portal) {
        if (this._portalHost.hasAttached()) {
            throwMdDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalHost.attachComponentPortal(portal);
    };
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @template C
     * @param {?} portal Portal to be attached as the dialog content.
     * @return {?}
     */
    MdDialogContainer.prototype.attachTemplatePortal = function (portal) {
        if (this._portalHost.hasAttached()) {
            throwMdDialogContentAlreadyAttachedError();
        }
        this._savePreviouslyFocusedElement();
        return this._portalHost.attachTemplatePortal(portal);
    };
    /**
     * Moves the focus inside the focus trap.
     * @return {?}
     */
    MdDialogContainer.prototype._trapFocus = function () {
        var _this = this;
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        }
        // If were to attempt to focus immediately, then the content of the dialog would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty.
        this._focusTrap.focusInitialElementWhenReady().then(function (hasMovedFocus) {
            // If we didn't find any focusable elements inside the dialog, focus the
            // container so the user can't tab into other elements behind it.
            if (!hasMovedFocus) {
                _this._elementRef.nativeElement.focus();
            }
        });
    };
    /**
     * Restores focus to the element that was focused before the dialog opened.
     * @return {?}
     */
    MdDialogContainer.prototype._restoreFocus = function () {
        var /** @type {?} */ toFocus = this._elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    };
    /**
     * Saves a reference to the element that was focused before the dialog was opened.
     * @return {?}
     */
    MdDialogContainer.prototype._savePreviouslyFocusedElement = function () {
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = (this._document.activeElement);
        }
    };
    /**
     * Callback, invoked whenever an animation on the host completes.
     * @param {?} event
     * @return {?}
     */
    MdDialogContainer.prototype._onAnimationDone = function (event) {
        if (event.toState === 'enter') {
            this._trapFocus();
        }
        else if (event.toState === 'exit') {
            this._restoreFocus();
        }
        this._animationStateChanged.emit(event);
        this._isAnimating = false;
    };
    /**
     * Callback, invoked when an animation on the host starts.
     * @param {?} event
     * @return {?}
     */
    MdDialogContainer.prototype._onAnimationStart = function (event) {
        this._isAnimating = true;
        this._animationStateChanged.emit(event);
    };
    /**
     * Starts the dialog exit animation.
     * @return {?}
     */
    MdDialogContainer.prototype._startExitAnimation = function () {
        this._state = 'exit';
        // Mark the container for check so it can react if the
        // view container is using OnPush change detection.
        this._changeDetectorRef.markForCheck();
    };
    return MdDialogContainer;
}(BasePortalHost));
MdDialogContainer.decorators = [
    { type: Component, args: [{ selector: 'md-dialog-container, mat-dialog-container',
                template: "<ng-template cdkPortalHost></ng-template>",
                styles: [".mat-dialog-container{box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);display:block;padding:24px;border-radius:2px;box-sizing:border-box;overflow:auto;max-width:80vw;outline:0;width:100%;height:100%}@media screen and (-ms-high-contrast:active){.mat-dialog-container{outline:solid 1px}}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch;-webkit-backface-visibility:hidden;backface-visibility:hidden}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:12px 0;display:flex;flex-wrap:wrap}.mat-dialog-actions:last-child{margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions .mat-button+.mat-button,.mat-dialog-actions .mat-button+.mat-raised-button,.mat-dialog-actions .mat-raised-button+.mat-button,.mat-dialog-actions .mat-raised-button+.mat-raised-button{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button+.mat-button,[dir=rtl] .mat-dialog-actions .mat-button+.mat-raised-button,[dir=rtl] .mat-dialog-actions .mat-raised-button+.mat-button,[dir=rtl] .mat-dialog-actions .mat-raised-button+.mat-raised-button{margin-left:0;margin-right:8px}"],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                animations: [
                    trigger('slideDialog', [
                        // Note: The `enter` animation doesn't transition to something like `translate3d(0, 0, 0)
                        // scale(1)`, because for some reason specifying the transform explicitly, causes IE both
                        // to blur the dialog content and decimate the animation performance. Leaving it as `none`
                        // solves both issues.
                        state('enter', style({ transform: 'none', opacity: 1 })),
                        state('void', style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })),
                        state('exit', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
                        transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
                    ])
                ],
                host: {
                    'class': 'mat-dialog-container',
                    'tabindex': '-1',
                    '[attr.role]': '_config?.role',
                    '[attr.aria-labelledby]': '_ariaLabelledBy',
                    '[attr.aria-describedby]': '_config?.ariaDescribedBy || null',
                    '[@slideDialog]': '_state',
                    '(@slideDialog.start)': '_onAnimationStart($event)',
                    '(@slideDialog.done)': '_onAnimationDone($event)',
                },
            },] },
];
/**
 * @nocollapse
 */
MdDialogContainer.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: FocusTrapFactory, },
    { type: ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
]; };
MdDialogContainer.propDecorators = {
    '_portalHost': [{ type: ViewChild, args: [PortalHostDirective,] },],
};
// TODO(jelbourn): resizing
// Counter for unique dialog ids.
var uniqueId = 0;
/**
 * Reference to a dialog opened via the MdDialog service.
 */
var MdDialogRef = (function () {
    /**
     * @param {?} _overlayRef
     * @param {?} _containerInstance
     * @param {?=} id
     */
    function MdDialogRef(_overlayRef, _containerInstance, id) {
        if (id === void 0) { id = "md-dialog-" + uniqueId++; }
        var _this = this;
        this._overlayRef = _overlayRef;
        this._containerInstance = _containerInstance;
        this.id = id;
        /**
         * Whether the user is allowed to close the dialog.
         */
        this.disableClose = this._containerInstance._config.disableClose;
        /**
         * Subject for notifying the user that the dialog has finished opening.
         */
        this._afterOpen = new Subject();
        /**
         * Subject for notifying the user that the dialog has finished closing.
         */
        this._afterClosed = new Subject();
        /**
         * Subject for notifying the user that the dialog has started closing.
         */
        this._beforeClose = new Subject();
        // Emit when opening animation completes
        RxChain.from(_containerInstance._animationStateChanged)
            .call(filter, function (event) { return event.phaseName === 'done' && event.toState === 'enter'; })
            .call(first)
            .subscribe(function () {
            _this._afterOpen.next();
            _this._afterOpen.complete();
        });
        // Dispose overlay when closing animation is complete
        RxChain.from(_containerInstance._animationStateChanged)
            .call(filter, function (event) { return event.phaseName === 'done' && event.toState === 'exit'; })
            .call(first)
            .subscribe(function () {
            _this._overlayRef.dispose();
            _this._afterClosed.next(_this._result);
            _this._afterClosed.complete();
            _this.componentInstance = null;
        });
    }
    /**
     * Close the dialog.
     * @param {?=} dialogResult Optional result to return to the dialog opener.
     * @return {?}
     */
    MdDialogRef.prototype.close = function (dialogResult) {
        var _this = this;
        this._result = dialogResult;
        // Transition the backdrop in parallel to the dialog.
        RxChain.from(this._containerInstance._animationStateChanged)
            .call(filter, function (event) { return event.phaseName === 'start'; })
            .call(first)
            .subscribe(function () {
            _this._beforeClose.next(dialogResult);
            _this._beforeClose.complete();
            _this._overlayRef.detachBackdrop();
        });
        this._containerInstance._startExitAnimation();
    };
    /**
     * Gets an observable that is notified when the dialog is finished opening.
     * @return {?}
     */
    MdDialogRef.prototype.afterOpen = function () {
        return this._afterOpen.asObservable();
    };
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     * @return {?}
     */
    MdDialogRef.prototype.afterClosed = function () {
        return this._afterClosed.asObservable();
    };
    /**
     * Gets an observable that is notified when the dialog has started closing.
     * @return {?}
     */
    MdDialogRef.prototype.beforeClose = function () {
        return this._beforeClose.asObservable();
    };
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     * @return {?}
     */
    MdDialogRef.prototype.backdropClick = function () {
        return this._overlayRef.backdropClick();
    };
    /**
     * Updates the dialog's position.
     * @param {?=} position New dialog position.
     * @return {?}
     */
    MdDialogRef.prototype.updatePosition = function (position) {
        var /** @type {?} */ strategy = this._getPositionStrategy();
        if (position && (position.left || position.right)) {
            position.left ? strategy.left(position.left) : strategy.right(position.right);
        }
        else {
            strategy.centerHorizontally();
        }
        if (position && (position.top || position.bottom)) {
            position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
        }
        else {
            strategy.centerVertically();
        }
        this._overlayRef.updatePosition();
        return this;
    };
    /**
     * Updates the dialog's width and height.
     * @param {?=} width New width of the dialog.
     * @param {?=} height New height of the dialog.
     * @return {?}
     */
    MdDialogRef.prototype.updateSize = function (width, height) {
        if (width === void 0) { width = 'auto'; }
        if (height === void 0) { height = 'auto'; }
        this._getPositionStrategy().width(width).height(height);
        this._overlayRef.updatePosition();
        return this;
    };
    /**
     * Returns whether the dialog is animating.
     * @return {?}
     */
    MdDialogRef.prototype._isAnimating = function () {
        return this._containerInstance._isAnimating;
    };
    /**
     * Fetches the position strategy object from the overlay ref.
     * @return {?}
     */
    MdDialogRef.prototype._getPositionStrategy = function () {
        return (this._overlayRef.getState().positionStrategy);
    };
    return MdDialogRef;
}());
var MD_DIALOG_DATA = new InjectionToken('MdDialogData');
/**
 * Injection token that determines the scroll handling while the dialog is open.
 */
var MD_DIALOG_SCROLL_STRATEGY = new InjectionToken('md-dialog-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MD_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.block(); };
}
/**
 * \@docs-private
 */
var MD_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: MD_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MD_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Service to open Material Design modal dialogs.
 */
var MdDialog = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _injector
     * @param {?} location
     * @param {?} _scrollStrategy
     * @param {?} _parentDialog
     */
    function MdDialog(_overlay, _injector, location, _scrollStrategy, _parentDialog) {
        var _this = this;
        this._overlay = _overlay;
        this._injector = _injector;
        this._scrollStrategy = _scrollStrategy;
        this._parentDialog = _parentDialog;
        this._openDialogsAtThisLevel = [];
        this._afterAllClosedAtThisLevel = new Subject();
        this._afterOpenAtThisLevel = new Subject();
        this._boundKeydown = this._handleKeydown.bind(this);
        /**
         * Stream that emits when all open dialog have finished closing.
         * Will emit on subscribe if there are no open dialogs to begin with.
         */
        this.afterAllClosed = defer(function () { return _this.openDialogs.length ?
            _this._afterAllClosed :
            startWith.call(_this._afterAllClosed, undefined); });
        // Close all of the dialogs when the user goes forwards/backwards in history or when the
        // location hash changes. Note that this usually doesn't include clicking on links (unless
        // the user is using the `HashLocationStrategy`).
        if (!_parentDialog && location) {
            location.subscribe(function () { return _this.closeAll(); });
        }
    }
    Object.defineProperty(MdDialog.prototype, "openDialogs", {
        /**
         * Keeps track of the currently-open dialogs.
         * @return {?}
         */
        get: function () {
            return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDialog.prototype, "afterOpen", {
        /**
         * Stream that emits when a dialog has been opened.
         * @return {?}
         */
        get: function () {
            return this._parentDialog ? this._parentDialog.afterOpen : this._afterOpenAtThisLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDialog.prototype, "_afterAllClosed", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ parent = this._parentDialog;
            return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opens a modal dialog containing the given component.
     * @template T
     * @param {?} componentOrTemplateRef Type of the component to load into the dialog,
     *     or a TemplateRef to instantiate as the dialog content.
     * @param {?=} config Extra configuration options.
     * @return {?} Reference to the newly-opened dialog.
     */
    MdDialog.prototype.open = function (componentOrTemplateRef, config) {
        var _this = this;
        var /** @type {?} */ inProgressDialog = this.openDialogs.find(function (dialog) { return dialog._isAnimating(); });
        // If there's a dialog that is in the process of being opened, return it instead.
        if (inProgressDialog) {
            return inProgressDialog;
        }
        config = _applyConfigDefaults(config);
        if (config.id && this.getDialogById(config.id)) {
            throw Error("Dialog with id \"" + config.id + "\" exists already. The dialog id must be unique.");
        }
        var /** @type {?} */ overlayRef = this._createOverlay(config);
        var /** @type {?} */ dialogContainer = this._attachDialogContainer(overlayRef, config);
        var /** @type {?} */ dialogRef = this._attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
        if (!this.openDialogs.length) {
            document.addEventListener('keydown', this._boundKeydown);
        }
        this.openDialogs.push(dialogRef);
        dialogRef.afterClosed().subscribe(function () { return _this._removeOpenDialog(dialogRef); });
        this.afterOpen.next(dialogRef);
        return dialogRef;
    };
    /**
     * Closes all of the currently-open dialogs.
     * @return {?}
     */
    MdDialog.prototype.closeAll = function () {
        var /** @type {?} */ i = this.openDialogs.length;
        while (i--) {
            // The `_openDialogs` property isn't updated after close until the rxjs subscription
            // runs on the next microtask, in addition to modifying the array as we're going
            // through it. We loop through all of them and call close without assuming that
            // they'll be removed from the list instantaneously.
            this.openDialogs[i].close();
        }
    };
    /**
     * Finds an open dialog by its id.
     * @param {?} id ID to use when looking up the dialog.
     * @return {?}
     */
    MdDialog.prototype.getDialogById = function (id) {
        return this.openDialogs.find(function (dialog) { return dialog.id === id; });
    };
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to the OverlayRef for the created overlay.
     */
    MdDialog.prototype._createOverlay = function (config) {
        var /** @type {?} */ overlayState = this._getOverlayState(config);
        return this._overlay.create(overlayState);
    };
    /**
     * Creates an overlay state from a dialog config.
     * @param {?} dialogConfig The dialog configuration.
     * @return {?} The overlay configuration.
     */
    MdDialog.prototype._getOverlayState = function (dialogConfig) {
        var /** @type {?} */ state$$1 = new OverlayConfig({
            positionStrategy: this._overlay.position().global(),
            scrollStrategy: this._scrollStrategy(),
            panelClass: dialogConfig.panelClass,
            hasBackdrop: dialogConfig.hasBackdrop,
            direction: dialogConfig.direction
        });
        if (dialogConfig.backdropClass) {
            state$$1.backdropClass = dialogConfig.backdropClass;
        }
        return state$$1;
    };
    /**
     * Attaches an MdDialogContainer to a dialog's already-created overlay.
     * @param {?} overlay Reference to the dialog's underlying overlay.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to a ComponentRef for the attached container.
     */
    MdDialog.prototype._attachDialogContainer = function (overlay, config) {
        var /** @type {?} */ containerPortal = new ComponentPortal(MdDialogContainer, config.viewContainerRef);
        var /** @type {?} */ containerRef = overlay.attach(containerPortal);
        containerRef.instance._config = config;
        return containerRef.instance;
    };
    /**
     * Attaches the user-provided component to the already-created MdDialogContainer.
     * @template T
     * @param {?} componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param {?} dialogContainer Reference to the wrapping MdDialogContainer.
     * @param {?} overlayRef Reference to the overlay in which the dialog resides.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to the MdDialogRef that should be returned to the user.
     */
    MdDialog.prototype._attachDialogContent = function (componentOrTemplateRef, dialogContainer, overlayRef, config) {
        // Create a reference to the dialog we're creating in order to give the user a handle
        // to modify and close it.
        var /** @type {?} */ dialogRef = new MdDialogRef(overlayRef, dialogContainer, config.id);
        // When the dialog backdrop is clicked, we want to close it.
        if (config.hasBackdrop) {
            overlayRef.backdropClick().subscribe(function () {
                if (!dialogRef.disableClose) {
                    dialogRef.close();
                }
            });
        }
        if (componentOrTemplateRef instanceof TemplateRef) {
            dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, /** @type {?} */ ((null)), /** @type {?} */ ({ $implicit: config.data, dialogRef: dialogRef })));
        }
        else {
            var /** @type {?} */ injector = this._createInjector(config, dialogRef, dialogContainer);
            var /** @type {?} */ contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, undefined, injector));
            dialogRef.componentInstance = contentRef.instance;
        }
        dialogRef
            .updateSize(config.width, config.height)
            .updatePosition(config.position);
        return dialogRef;
    };
    /**
     * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
     * of a dialog to close itself and, optionally, to return a value.
     * @template T
     * @param {?} config Config object that is used to construct the dialog.
     * @param {?} dialogRef Reference to the dialog.
     * @param {?} dialogContainer
     * @return {?} The custom injector that can be used inside the dialog.
     */
    MdDialog.prototype._createInjector = function (config, dialogRef, dialogContainer) {
        var /** @type {?} */ userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        var /** @type {?} */ injectionTokens = new WeakMap();
        injectionTokens.set(MdDialogRef, dialogRef);
        injectionTokens.set(MdDialogContainer, dialogContainer);
        injectionTokens.set(MD_DIALOG_DATA, config.data);
        return new PortalInjector(userInjector || this._injector, injectionTokens);
    };
    /**
     * Removes a dialog from the array of open dialogs.
     * @param {?} dialogRef Dialog to be removed.
     * @return {?}
     */
    MdDialog.prototype._removeOpenDialog = function (dialogRef) {
        var /** @type {?} */ index = this.openDialogs.indexOf(dialogRef);
        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // no open dialogs are left, call next on afterAllClosed Subject
            if (!this.openDialogs.length) {
                this._afterAllClosed.next();
                document.removeEventListener('keydown', this._boundKeydown);
            }
        }
    };
    /**
     * Handles global key presses while there are open dialogs. Closes the
     * top dialog when the user presses escape.
     * @param {?} event
     * @return {?}
     */
    MdDialog.prototype._handleKeydown = function (event) {
        var /** @type {?} */ topDialog = this.openDialogs[this.openDialogs.length - 1];
        var /** @type {?} */ canClose = topDialog ? !topDialog.disableClose : false;
        if (event.keyCode === ESCAPE && canClose) {
            topDialog.close();
        }
    };
    return MdDialog;
}());
MdDialog.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MdDialog.ctorParameters = function () { return [
    { type: Overlay, },
    { type: Injector, },
    { type: Location, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Inject, args: [MD_DIALOG_SCROLL_STRATEGY,] },] },
    { type: MdDialog, decorators: [{ type: Optional }, { type: SkipSelf },] },
]; };
/**
 * Applies default options to the dialog config.
 * @param {?=} config Config to be modified.
 * @return {?} The new configuration object.
 */
function _applyConfigDefaults(config) {
    return extendObject(new MdDialogConfig(), config);
}
/**
 * Counter used to generate unique IDs for dialog elements.
 */
var dialogElementUid = 0;
/**
 * Button that will close the current dialog.
 */
var MdDialogClose = (function () {
    /**
     * @param {?} dialogRef
     */
    function MdDialogClose(dialogRef) {
        this.dialogRef = dialogRef;
        /**
         * Screenreader label for the button.
         */
        this.ariaLabel = 'Close dialog';
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    MdDialogClose.prototype.ngOnChanges = function (changes) {
        var /** @type {?} */ proxiedChange = changes._matDialogClose || changes._mdDialogClose ||
            changes._matDialogCloseResult;
        if (proxiedChange) {
            this.dialogResult = proxiedChange.currentValue;
        }
    };
    return MdDialogClose;
}());
MdDialogClose.decorators = [
    { type: Directive, args: [{
                selector: "button[md-dialog-close], button[mat-dialog-close],\n             button[mdDialogClose], button[matDialogClose]",
                host: {
                    '(click)': 'dialogRef.close(dialogResult)',
                    '[attr.aria-label]': 'ariaLabel',
                    'type': 'button',
                }
            },] },
];
/**
 * @nocollapse
 */
MdDialogClose.ctorParameters = function () { return [
    { type: MdDialogRef, },
]; };
MdDialogClose.propDecorators = {
    'ariaLabel': [{ type: Input, args: ['aria-label',] },],
    'dialogResult': [{ type: Input, args: ['md-dialog-close',] },],
    '_matDialogClose': [{ type: Input, args: ['matDialogClose',] },],
    '_mdDialogClose': [{ type: Input, args: ['mdDialogClose',] },],
    '_matDialogCloseResult': [{ type: Input, args: ['mat-dialog-close',] },],
};
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
var MdDialogTitle = (function () {
    /**
     * @param {?} _container
     */
    function MdDialogTitle(_container) {
        this._container = _container;
        this.id = "md-dialog-title-" + dialogElementUid++;
    }
    /**
     * @return {?}
     */
    MdDialogTitle.prototype.ngOnInit = function () {
        var _this = this;
        if (this._container && !this._container._ariaLabelledBy) {
            Promise.resolve().then(function () { return _this._container._ariaLabelledBy = _this.id; });
        }
    };
    return MdDialogTitle;
}());
MdDialogTitle.decorators = [
    { type: Directive, args: [{
                selector: '[md-dialog-title], [mat-dialog-title], [mdDialogTitle], [matDialogTitle]',
                host: {
                    'class': 'mat-dialog-title',
                    '[id]': 'id',
                },
            },] },
];
/**
 * @nocollapse
 */
MdDialogTitle.ctorParameters = function () { return [
    { type: MdDialogContainer, decorators: [{ type: Optional },] },
]; };
MdDialogTitle.propDecorators = {
    'id': [{ type: Input },],
};
/**
 * Scrollable content container of a dialog.
 */
var MdDialogContent = (function () {
    function MdDialogContent() {
    }
    return MdDialogContent;
}());
MdDialogContent.decorators = [
    { type: Directive, args: [{
                selector: "[md-dialog-content], md-dialog-content, [mat-dialog-content], mat-dialog-content,\n             [mdDialogContent], [matDialogContent]",
                host: { 'class': 'mat-dialog-content' }
            },] },
];
/**
 * @nocollapse
 */
MdDialogContent.ctorParameters = function () { return []; };
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
var MdDialogActions = (function () {
    function MdDialogActions() {
    }
    return MdDialogActions;
}());
MdDialogActions.decorators = [
    { type: Directive, args: [{
                selector: "[md-dialog-actions], md-dialog-actions, [mat-dialog-actions], mat-dialog-actions,\n             [mdDialogActions], [matDialogActions]",
                host: { 'class': 'mat-dialog-actions' }
            },] },
];
/**
 * @nocollapse
 */
MdDialogActions.ctorParameters = function () { return []; };
var MdDialogModule = (function () {
    function MdDialogModule() {
    }
    return MdDialogModule;
}());
MdDialogModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    OverlayModule,
                    PortalModule,
                    A11yModule,
                    MdCommonModule,
                ],
                exports: [
                    MdDialogContainer,
                    MdDialogClose,
                    MdDialogTitle,
                    MdDialogContent,
                    MdDialogActions,
                    MdCommonModule,
                ],
                declarations: [
                    MdDialogContainer,
                    MdDialogClose,
                    MdDialogTitle,
                    MdDialogActions,
                    MdDialogContent,
                ],
                providers: [
                    MdDialog,
                    MD_DIALOG_SCROLL_STRATEGY_PROVIDER,
                ],
                entryComponents: [MdDialogContainer],
            },] },
];
/**
 * @nocollapse
 */
MdDialogModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdDialogModule, MD_DIALOG_DATA, MD_DIALOG_SCROLL_STRATEGY, MD_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY, MD_DIALOG_SCROLL_STRATEGY_PROVIDER, MdDialog, throwMdDialogContentAlreadyAttachedError, MdDialogContainer, MdDialogClose, MdDialogTitle, MdDialogContent, MdDialogActions, MdDialogConfig, MdDialogRef, MD_DIALOG_DATA as MAT_DIALOG_DATA, MD_DIALOG_SCROLL_STRATEGY as MAT_DIALOG_SCROLL_STRATEGY, MD_DIALOG_SCROLL_STRATEGY_PROVIDER as MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MD_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY as MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY, MdDialog as MatDialog, MdDialogActions as MatDialogActions, MdDialogClose as MatDialogClose, MdDialogConfig as MatDialogConfig, MdDialogContainer as MatDialogContainer, MdDialogContent as MatDialogContent, MdDialogModule as MatDialogModule, MdDialogRef as MatDialogRef, MdDialogTitle as MatDialogTitle };
//# sourceMappingURL=dialog.es5.js.map
