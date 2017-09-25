import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Inject, Input, NgModule, NgZone, Optional, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule, FocusTrapFactory } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { ESCAPE, MdCommonModule, first, startWith, takeUntil } from '@angular/material/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/platform-browser';
import { merge } from 'rxjs/observable/merge';
import { Subscription } from 'rxjs/Subscription';
/**
 * Throws an exception when two MdDrawer are matching the same position.
 * @param {?} position
 * @return {?}
 */
function throwMdDuplicatedDrawerError(position) {
    throw Error("A drawer was already declared for 'position=\"" + position + "\"'");
}
/**
 * Drawer toggle promise result.
 * @deprecated
 */
var MdDrawerToggleResult = (function () {
    /**
     * @param {?} type
     * @param {?} animationFinished
     */
    function MdDrawerToggleResult(type, animationFinished) {
        this.type = type;
        this.animationFinished = animationFinished;
    }
    return MdDrawerToggleResult;
}());
/**
 * <md-drawer> component.
 *
 * This component corresponds to a drawer that can be opened on the drawer container.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MdDrawer = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _focusTrapFactory
     * @param {?} _doc
     */
    function MdDrawer(_elementRef, _focusTrapFactory, _doc) {
        var _this = this;
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._doc = _doc;
        this._elementFocusedBeforeDrawerWasOpened = null;
        /**
         * Whether the drawer is initialized. Used for disabling the initial animation.
         */
        this._enableAnimations = false;
        this._position = 'start';
        /**
         * Mode of the drawer; one of 'over', 'push' or 'side'.
         */
        this.mode = 'over';
        this._disableClose = false;
        /**
         * Whether the drawer is opened.
         */
        this._opened = false;
        /**
         * Emits whenever the drawer has started animating.
         */
        this._animationStarted = new EventEmitter();
        /**
         * Whether the drawer is animating. Used to prevent overlapping animations.
         */
        this._isAnimating = false;
        /**
         * Current state of the sidenav animation.
         */
        this._animationState = 'void';
        /**
         * Event emitted when the drawer is fully opened.
         */
        this.onOpen = new EventEmitter();
        /**
         * Event emitted when the drawer is fully closed.
         */
        this.onClose = new EventEmitter();
        /**
         * Event emitted when the drawer's position changes.
         */
        this.onPositionChanged = new EventEmitter();
        /**
         * @deprecated
         */
        this.onAlignChanged = new EventEmitter();
        this.onOpen.subscribe(function () {
            if (_this._doc) {
                _this._elementFocusedBeforeDrawerWasOpened = _this._doc.activeElement;
            }
            if (_this.isFocusTrapEnabled && _this._focusTrap) {
                _this._focusTrap.focusInitialElementWhenReady();
            }
        });
        this.onClose.subscribe(function () { return _this._restoreFocus(); });
    }
    Object.defineProperty(MdDrawer.prototype, "position", {
        /**
         * The side that the drawer is attached to.
         * @return {?}
         */
        get: function () { return this._position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            // Make sure we have a valid value.
            value = value === 'end' ? 'end' : 'start';
            if (value != this._position) {
                this._position = value;
                this.onAlignChanged.emit();
                this.onPositionChanged.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDrawer.prototype, "align", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this.position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDrawer.prototype, "disableClose", {
        /**
         * Whether the drawer can be closed with the escape key or by clicking on the backdrop.
         * @return {?}
         */
        get: function () { return this._disableClose; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableClose = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDrawer.prototype, "isFocusTrapEnabled", {
        /**
         * @return {?}
         */
        get: function () {
            // The focus trap is only enabled when the drawer is open in any mode other than side.
            return this.opened && this.mode !== 'side';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If focus is currently inside the drawer, restores it to where it was before the drawer
     * opened.
     * @return {?}
     */
    MdDrawer.prototype._restoreFocus = function () {
        var /** @type {?} */ activeEl = this._doc && this._doc.activeElement;
        if (activeEl && this._elementRef.nativeElement.contains(activeEl)) {
            if (this._elementFocusedBeforeDrawerWasOpened instanceof HTMLElement) {
                this._elementFocusedBeforeDrawerWasOpened.focus();
            }
            else {
                this._elementRef.nativeElement.blur();
            }
        }
        this._elementFocusedBeforeDrawerWasOpened = null;
    };
    /**
     * @return {?}
     */
    MdDrawer.prototype.ngAfterContentInit = function () {
        this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        this._focusTrap.enabled = this.isFocusTrapEnabled;
        this._enableAnimations = true;
    };
    /**
     * @return {?}
     */
    MdDrawer.prototype.ngOnDestroy = function () {
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    };
    Object.defineProperty(MdDrawer.prototype, "opened", {
        /**
         * Whether the drawer is opened. We overload this because we trigger an event when it
         * starts or end.
         * @return {?}
         */
        get: function () { return this._opened; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.toggle(coerceBooleanProperty(v));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Open the drawer.
     * @return {?}
     */
    MdDrawer.prototype.open = function () {
        return this.toggle(true);
    };
    /**
     * Close the drawer.
     * @return {?}
     */
    MdDrawer.prototype.close = function () {
        return this.toggle(false);
    };
    /**
     * Toggle this drawer.
     * @param {?=} isOpen Whether the drawer should be open.
     * @return {?}
     */
    MdDrawer.prototype.toggle = function (isOpen) {
        var _this = this;
        if (isOpen === void 0) { isOpen = !this.opened; }
        if (!this._isAnimating) {
            this._opened = isOpen;
            if (isOpen) {
                this._animationState = this._enableAnimations ? 'open' : 'open-instant';
            }
            else {
                this._animationState = 'void';
            }
            this._currentTogglePromise = new Promise(function (resolve) {
                first.call(isOpen ? _this.onOpen : _this.onClose).subscribe(resolve);
            });
            if (this._focusTrap) {
                this._focusTrap.enabled = this.isFocusTrapEnabled;
            }
        }
        // TODO(crisbeto): This promise is here for backwards-compatibility.
        // It should be removed next time we do breaking changes in the drawer.
        return ((this._currentTogglePromise));
    };
    /**
     * Handles the keyboard events.
     * \@docs-private
     * @param {?} event
     * @return {?}
     */
    MdDrawer.prototype.handleKeydown = function (event) {
        if (event.keyCode === ESCAPE && !this.disableClose) {
            this.close();
            event.stopPropagation();
        }
    };
    /**
     * @return {?}
     */
    MdDrawer.prototype._onAnimationStart = function () {
        this._isAnimating = true;
        this._animationStarted.emit();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdDrawer.prototype._onAnimationEnd = function (event) {
        var _this = this;
        var fromState = event.fromState, toState = event.toState;
        if (toState === 'open' && fromState === 'void') {
            this.onOpen.emit(new MdDrawerToggleResult('open', true));
        }
        else if (toState === 'void' && fromState === 'open') {
            this.onClose.emit(new MdDrawerToggleResult('close', true));
        }
        // Note: as of Angular 4.3, the animations module seems to fire the `start` callback before
        // the end if animations are disabled. Make this call async to ensure that it still fires
        // at the appropriate time.
        Promise.resolve().then(function () {
            _this._isAnimating = false;
            _this._currentTogglePromise = null;
        });
    };
    Object.defineProperty(MdDrawer.prototype, "_width", {
        /**
         * @return {?}
         */
        get: function () {
            return this._elementRef.nativeElement ? (this._elementRef.nativeElement.offsetWidth || 0) : 0;
        },
        enumerable: true,
        configurable: true
    });
    return MdDrawer;
}());
MdDrawer.decorators = [
    { type: Component, args: [{ selector: 'md-drawer, mat-drawer',
                template: "<ng-content></ng-content>",
                animations: [
                    trigger('transform', [
                        state('open, open-instant', style({
                            transform: 'translate3d(0, 0, 0)',
                            visibility: 'visible',
                        })),
                        state('void', style({
                            visibility: 'hidden',
                        })),
                        transition('void => open-instant', animate('0ms')),
                        transition('void <=> open, open-instant => void', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
                    ])
                ],
                host: {
                    'class': 'mat-drawer',
                    '[@transform]': '_animationState',
                    '(@transform.start)': '_onAnimationStart()',
                    '(@transform.done)': '_onAnimationEnd($event)',
                    '(keydown)': 'handleKeydown($event)',
                    // must prevent the browser from aligning text based on value
                    '[attr.align]': 'null',
                    '[class.mat-drawer-end]': 'position === "end"',
                    '[class.mat-drawer-over]': 'mode === "over"',
                    '[class.mat-drawer-push]': 'mode === "push"',
                    '[class.mat-drawer-side]': 'mode === "side"',
                    'tabIndex': '-1',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
MdDrawer.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: FocusTrapFactory, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
]; };
MdDrawer.propDecorators = {
    'position': [{ type: Input },],
    'align': [{ type: Input },],
    'mode': [{ type: Input },],
    'disableClose': [{ type: Input },],
    'onOpen': [{ type: Output, args: ['open',] },],
    'onClose': [{ type: Output, args: ['close',] },],
    'onPositionChanged': [{ type: Output, args: ['positionChanged',] },],
    'onAlignChanged': [{ type: Output, args: ['align-changed',] },],
    'opened': [{ type: Input },],
};
/**
 * <md-drawer-container> component.
 *
 * This is the parent component to one or two <md-drawer>s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
var MdDrawerContainer = (function () {
    /**
     * @param {?} _dir
     * @param {?} _element
     * @param {?} _renderer
     * @param {?} _ngZone
     * @param {?} _changeDetectorRef
     */
    function MdDrawerContainer(_dir, _element, _renderer, _ngZone, _changeDetectorRef) {
        var _this = this;
        this._dir = _dir;
        this._element = _element;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Event emitted when the drawer backdrop is clicked.
         */
        this.backdropClick = new EventEmitter();
        /**
         * Subscription to the Directionality change EventEmitter.
         */
        this._dirChangeSubscription = Subscription.EMPTY;
        // If a `Dir` directive exists up the tree, listen direction changes and update the left/right
        // properties to point to the proper start/end.
        if (_dir != null) {
            this._dirChangeSubscription = _dir.change.subscribe(function () { return _this._validateDrawers(); });
        }
    }
    Object.defineProperty(MdDrawerContainer.prototype, "start", {
        /**
         * The drawer child with the `start` position.
         * @return {?}
         */
        get: function () { return this._start; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDrawerContainer.prototype, "end", {
        /**
         * The drawer child with the `end` position.
         * @return {?}
         */
        get: function () { return this._end; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdDrawerContainer.prototype.ngAfterContentInit = function () {
        var _this = this;
        startWith.call(this._drawers.changes, null).subscribe(function () {
            _this._validateDrawers();
            _this._drawers.forEach(function (drawer) {
                _this._watchDrawerToggle(drawer);
                _this._watchDrawerPosition(drawer);
            });
        });
    };
    /**
     * @return {?}
     */
    MdDrawerContainer.prototype.ngOnDestroy = function () {
        this._dirChangeSubscription.unsubscribe();
    };
    /**
     * Calls `open` of both start and end drawers
     * @return {?}
     */
    MdDrawerContainer.prototype.open = function () {
        this._drawers.forEach(function (drawer) { return drawer.open(); });
    };
    /**
     * Calls `close` of both start and end drawers
     * @return {?}
     */
    MdDrawerContainer.prototype.close = function () {
        this._drawers.forEach(function (drawer) { return drawer.close(); });
    };
    /**
     * Subscribes to drawer events in order to set a class on the main container element when the
     * drawer is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     * @param {?} drawer
     * @return {?}
     */
    MdDrawerContainer.prototype._watchDrawerToggle = function (drawer) {
        var _this = this;
        takeUntil.call(drawer._animationStarted, this._drawers.changes).subscribe(function () {
            // Set the transition class on the container so that the animations occur. This should not
            // be set initially because animations should only be triggered via a change in state.
            _this._renderer.addClass(_this._element.nativeElement, 'mat-drawer-transition');
            _this._updateStyles();
            _this._changeDetectorRef.markForCheck();
        });
        if (drawer.mode !== 'side') {
            takeUntil.call(merge(drawer.onOpen, drawer.onClose), this._drawers.changes).subscribe(function () { return _this._setContainerClass(drawer.opened); });
        }
    };
    /**
     * Subscribes to drawer onPositionChanged event in order to re-validate drawers when the position
     * changes.
     * @param {?} drawer
     * @return {?}
     */
    MdDrawerContainer.prototype._watchDrawerPosition = function (drawer) {
        var _this = this;
        if (!drawer) {
            return;
        }
        // NOTE: We need to wait for the microtask queue to be empty before validating,
        // since both drawers may be swapping positions at the same time.
        takeUntil.call(drawer.onPositionChanged, this._drawers.changes).subscribe(function () {
            first.call(_this._ngZone.onMicrotaskEmpty.asObservable()).subscribe(function () {
                _this._validateDrawers();
            });
        });
    };
    /**
     * Toggles the 'mat-drawer-opened' class on the main 'md-drawer-container' element.
     * @param {?} isAdd
     * @return {?}
     */
    MdDrawerContainer.prototype._setContainerClass = function (isAdd) {
        if (isAdd) {
            this._renderer.addClass(this._element.nativeElement, 'mat-drawer-opened');
        }
        else {
            this._renderer.removeClass(this._element.nativeElement, 'mat-drawer-opened');
        }
    };
    /**
     * Validate the state of the drawer children components.
     * @return {?}
     */
    MdDrawerContainer.prototype._validateDrawers = function () {
        var _this = this;
        this._start = this._end = null;
        // Ensure that we have at most one start and one end drawer.
        this._drawers.forEach(function (drawer) {
            if (drawer.position == 'end') {
                if (_this._end != null) {
                    throwMdDuplicatedDrawerError('end');
                }
                _this._end = drawer;
            }
            else {
                if (_this._start != null) {
                    throwMdDuplicatedDrawerError('start');
                }
                _this._start = drawer;
            }
        });
        this._right = this._left = null;
        // Detect if we're LTR or RTL.
        if (this._dir == null || this._dir.value == 'ltr') {
            this._left = this._start;
            this._right = this._end;
        }
        else {
            this._left = this._end;
            this._right = this._start;
        }
    };
    /**
     * @return {?}
     */
    MdDrawerContainer.prototype._onBackdropClicked = function () {
        this.backdropClick.emit();
        this._closeModalDrawer();
    };
    /**
     * @return {?}
     */
    MdDrawerContainer.prototype._closeModalDrawer = function () {
        // Close all open drawers where closing is not disabled and the mode is not `side`.
        [this._start, this._end]
            .filter(function (drawer) { return drawer && !drawer.disableClose && drawer.mode !== 'side'; })
            .forEach(function (drawer) { return ((drawer)).close(); });
    };
    /**
     * @return {?}
     */
    MdDrawerContainer.prototype._isShowingBackdrop = function () {
        return (this._isDrawerOpen(this._start) && ((this._start)).mode != 'side')
            || (this._isDrawerOpen(this._end) && ((this._end)).mode != 'side');
    };
    /**
     * @param {?} drawer
     * @return {?}
     */
    MdDrawerContainer.prototype._isDrawerOpen = function (drawer) {
        return drawer != null && drawer.opened;
    };
    /**
     * Return the width of the drawer, if it's in the proper mode and opened.
     * This may relayout the view, so do not call this often.
     * @param {?} drawer
     * @param {?} mode
     * @return {?}
     */
    MdDrawerContainer.prototype._getDrawerEffectiveWidth = function (drawer, mode) {
        return (this._isDrawerOpen(drawer) && drawer.mode == mode) ? drawer._width : 0;
    };
    /**
     * Recalculates and updates the inline styles. Note that this
     * should be used sparingly, because it causes a reflow.
     * @return {?}
     */
    MdDrawerContainer.prototype._updateStyles = function () {
        var /** @type {?} */ marginLeft = this._left ? this._getDrawerEffectiveWidth(this._left, 'side') : 0;
        var /** @type {?} */ marginRight = this._right ? this._getDrawerEffectiveWidth(this._right, 'side') : 0;
        var /** @type {?} */ leftWidth = this._left ? this._getDrawerEffectiveWidth(this._left, 'push') : 0;
        var /** @type {?} */ rightWidth = this._right ? this._getDrawerEffectiveWidth(this._right, 'push') : 0;
        this._styles = {
            marginLeft: marginLeft + "px",
            marginRight: marginRight + "px",
            transform: "translate3d(" + (leftWidth - rightWidth) + "px, 0, 0)"
        };
    };
    return MdDrawerContainer;
}());
MdDrawerContainer.decorators = [
    { type: Component, args: [{ selector: 'md-drawer-container, mat-drawer-container',
                template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div><ng-content select=\"md-drawer, mat-drawer, md-sidenav, mat-sidenav\"></ng-content><div class=\"mat-drawer-content\" [ngStyle]=\"_styles\" cdk-scrollable><ng-content></ng-content></div>",
                styles: [".mat-drawer-container{position:relative;transform:translate3d(0,0,0);box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-opened{overflow:hidden}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:2;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}@media screen and (-ms-high-contrast:active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;transform:translate3d(0,0,0);display:block;height:100%;overflow:auto}.mat-drawer{position:relative;transform:translate3d(0,0,0);display:block;position:absolute;top:0;bottom:0;z-index:3;min-width:5vw;outline:0;box-sizing:border-box;height:100%;overflow-y:auto;transform:translate3d(-100%,0,0)}.mat-drawer.mat-drawer-side{z-index:1}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%,0,0)}[dir=rtl] .mat-drawer{transform:translate3d(100%,0,0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%,0,0)}.mat-drawer.mat-drawer-opened:not(.mat-drawer-side),.mat-drawer.mat-drawer-opening:not(.mat-drawer-side){box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)} .mat-drawer-transition .mat-drawer-content{transition-duration:.4s;transition-timing-function:cubic-bezier(.25,.8,.25,1);transition-property:transform,margin-left,margin-right}.mat-drawer-transition .mat-drawer-backdrop.mat-drawer-shown{transition:background-color .4s cubic-bezier(.25,.8,.25,1)}"],
                host: {
                    'class': 'mat-drawer-container',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
MdDrawerContainer.ctorParameters = function () { return [
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: NgZone, },
    { type: ChangeDetectorRef, },
]; };
MdDrawerContainer.propDecorators = {
    '_drawers': [{ type: ContentChildren, args: [MdDrawer,] },],
    'backdropClick': [{ type: Output },],
};
var MdSidenav = (function (_super) {
    tslib_1.__extends(MdSidenav, _super);
    function MdSidenav() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdSidenav;
}(MdDrawer));
MdSidenav.decorators = [
    { type: Component, args: [{ selector: 'md-sidenav, mat-sidenav',
                template: "<ng-content></ng-content>",
                animations: [
                    trigger('transform', [
                        state('open, open-instant', style({
                            transform: 'translate3d(0, 0, 0)',
                            visibility: 'visible',
                        })),
                        state('void', style({
                            visibility: 'hidden',
                        })),
                        transition('void => open-instant', animate('0ms')),
                        transition('void <=> open, open-instant => void', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
                    ])
                ],
                host: {
                    'class': 'mat-drawer mat-sidenav',
                    '[@transform]': '_animationState',
                    '(@transform.start)': '_onAnimationStart()',
                    '(@transform.done)': '_onAnimationEnd($event)',
                    '(keydown)': 'handleKeydown($event)',
                    // must prevent the browser from aligning text based on value
                    '[attr.align]': 'null',
                    '[class.mat-drawer-end]': 'position === "end"',
                    '[class.mat-drawer-over]': 'mode === "over"',
                    '[class.mat-drawer-push]': 'mode === "push"',
                    '[class.mat-drawer-side]': 'mode === "side"',
                    'tabIndex': '-1',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
MdSidenav.ctorParameters = function () { return []; };
var MdSidenavContainer = (function (_super) {
    tslib_1.__extends(MdSidenavContainer, _super);
    function MdSidenavContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdSidenavContainer;
}(MdDrawerContainer));
MdSidenavContainer.decorators = [
    { type: Component, args: [{ selector: 'md-sidenav-container, mat-sidenav-container',
                template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div><ng-content select=\"md-drawer, mat-drawer, md-sidenav, mat-sidenav\"></ng-content><div class=\"mat-drawer-content\" [ngStyle]=\"_styles\" cdk-scrollable><ng-content></ng-content></div>",
                styles: [".mat-drawer-container{position:relative;transform:translate3d(0,0,0);box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-opened{overflow:hidden}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:2;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}@media screen and (-ms-high-contrast:active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;transform:translate3d(0,0,0);display:block;height:100%;overflow:auto}.mat-drawer{position:relative;transform:translate3d(0,0,0);display:block;position:absolute;top:0;bottom:0;z-index:3;min-width:5vw;outline:0;box-sizing:border-box;height:100%;overflow-y:auto;transform:translate3d(-100%,0,0)}.mat-drawer.mat-drawer-side{z-index:1}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%,0,0)}[dir=rtl] .mat-drawer{transform:translate3d(100%,0,0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%,0,0)}.mat-drawer.mat-drawer-opened:not(.mat-drawer-side),.mat-drawer.mat-drawer-opening:not(.mat-drawer-side){box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)} .mat-drawer-transition .mat-drawer-content{transition-duration:.4s;transition-timing-function:cubic-bezier(.25,.8,.25,1);transition-property:transform,margin-left,margin-right}.mat-drawer-transition .mat-drawer-backdrop.mat-drawer-shown{transition:background-color .4s cubic-bezier(.25,.8,.25,1)}"],
                host: {
                    'class': 'mat-drawer-container mat-sidenav-container',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
MdSidenavContainer.ctorParameters = function () { return []; };
MdSidenavContainer.propDecorators = {
    '_drawers': [{ type: ContentChildren, args: [MdSidenav,] },],
};
var MdSidenavModule = (function () {
    function MdSidenavModule() {
    }
    return MdSidenavModule;
}());
MdSidenavModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, MdCommonModule, A11yModule, OverlayModule],
                exports: [MdDrawerContainer, MdDrawer, MdSidenavContainer, MdSidenav, MdCommonModule],
                declarations: [MdDrawerContainer, MdDrawer, MdSidenavContainer, MdSidenav],
            },] },
];
/**
 * @nocollapse
 */
MdSidenavModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdSidenavModule, throwMdDuplicatedDrawerError, MdDrawerToggleResult, MdDrawer, MdDrawerContainer, MdSidenav, MdSidenavContainer, MdDrawerToggleResult as MatDrawerToggleResult, MdDrawer as MatDrawer, MdDrawerContainer as MatDrawerContainer, MdSidenav as MatSidenav, MdSidenavContainer as MatSidenavContainer, MdSidenavModule as MatSidenavModule };
//# sourceMappingURL=sidenav.es5.js.map
