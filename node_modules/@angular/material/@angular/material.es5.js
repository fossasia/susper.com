import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Host, Inject, Injectable, InjectionToken, Injector, Input, LOCALE_ID, NgModule, NgZone, Optional, Output, Renderer2, SecurityContext, Self, SkipSelf, TemplateRef, Version, ViewChild, ViewContainerRef, ViewEncapsulation, forwardRef, isDevMode } from '@angular/core';
import { A11yModule, ActiveDescendantKeyManager, FocusKeyManager, FocusTrap, FocusTrapDeprecatedDirective, FocusTrapDirective, FocusTrapFactory, InteractivityChecker, LIVE_ANNOUNCER_ELEMENT_TOKEN, LIVE_ANNOUNCER_PROVIDER, LiveAnnouncer, isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { BidiModule, Dir, Directionality } from '@angular/cdk/bidi';
import { ObserveContent, ObserversModule } from '@angular/cdk/observers';
import { BlockScrollStrategy, CloseScrollStrategy, ConnectedOverlayDirective, ConnectedOverlayPositionChange, ConnectedPositionStrategy, ConnectionPositionPair, FullscreenOverlayContainer, GlobalPositionStrategy, NoopScrollStrategy, OVERLAY_PROVIDERS, Overlay, OverlayContainer, OverlayModule, OverlayOrigin, OverlayRef, OverlayState, RepositionScrollStrategy, ScrollDispatcher, ScrollStrategyOptions, Scrollable, ScrollingVisibility, VIEWPORT_RULER_PROVIDER, ViewportRuler } from '@angular/cdk/overlay';
import { BasePortalHost, ComponentPortal, DomPortalHost, Portal, PortalHostDirective, PortalModule, TemplatePortal, TemplatePortalDirective } from '@angular/cdk/portal';
import { DOCUMENT, DomSanitizer, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
import { ScrollDispatchModule, ScrollDispatcher as ScrollDispatcher$1, VIEWPORT_RULER_PROVIDER as VIEWPORT_RULER_PROVIDER$1, ViewportRuler as ViewportRuler$1 } from '@angular/cdk/scrolling';
import { Platform, PlatformModule, getSupportedInputTypes } from '@angular/cdk/platform';
import { A, BACKSPACE, DELETE, DOWN_ARROW, END, ENTER, ESCAPE, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, SPACE, TAB, UP_ARROW, Z } from '@angular/cdk/keycodes';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { CheckboxRequiredValidator, FormGroupDirective, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, NgForm, Validators } from '@angular/forms';
import { RxChain, auditTime, catchOperator, doOperator, filter, finallyOperator, first, map, share, startWith, switchMap, takeUntil } from '@angular/cdk/rxjs';
import { merge } from 'rxjs/observable/merge';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { defer } from 'rxjs/observable/defer';
import { CDK_ROW_TEMPLATE, CDK_TABLE_TEMPLATE, CdkCell, CdkCellDef, CdkColumnDef, CdkHeaderCell, CdkHeaderCellDef, CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef, CdkTable, CdkTableModule } from '@angular/cdk/table';
/**
 * Current version of Angular Material.
 */
var VERSION = new Version('2.0.0-beta.10');
var MATERIAL_COMPATIBILITY_MODE = new InjectionToken('md-compatibility-mode');
/**
 * Returns an exception to be thrown if the consumer has used
 * an invalid Material prefix on a component.
 * \@docs-private
 * @param {?} prefix
 * @param {?} nodeName
 * @return {?}
 */
function getMdCompatibilityInvalidPrefixError(prefix, nodeName) {
    return Error("The \"" + prefix + "-\" prefix cannot be used in ng-material v1 compatibility mode. " +
        ("It was used on an \"" + nodeName.toLowerCase() + "\" element."));
}
/**
 * Selector that matches all elements that may have style collisions with AngularJS Material.
 */
var MAT_ELEMENTS_SELECTOR = "\n  [mat-button],\n  [mat-fab],\n  [mat-icon-button],\n  [mat-mini-fab],\n  [mat-raised-button],\n  [matCardSubtitle],\n  [matCardTitle],\n  [matCellDef],\n  [matColumnDef],\n  [matDialogActions],\n  [matDialogClose],\n  [matDialogContent],\n  [matDialogTitle],\n  [matHeaderCellDef],\n  [matHeaderRowDef],\n  [matLine],\n  [matRowDef],\n  [matTabLabel],\n  [matTabLink],\n  [matTabNav],\n  [matTooltip],\n  [matInput],\n  [matPrefix],\n  [matSuffix],\n  mat-autocomplete,\n  mat-button-toggle,\n  mat-button-toggle,\n  mat-button-toggle-group,\n  mat-card,\n  mat-card-actions,\n  mat-card-content,\n  mat-card-footer,\n  mat-card-header,\n  mat-card-subtitle,\n  mat-card-title,\n  mat-card-title-group,\n  mat-cell,\n  mat-checkbox,\n  mat-chip,\n  mat-dialog-actions,\n  mat-dialog-container,\n  mat-dialog-content,\n  mat-divider,\n  mat-error,\n  mat-grid-list,\n  mat-grid-tile,\n  mat-grid-tile-footer,\n  mat-grid-tile-header,\n  mat-header-cell,\n  mat-header-row,\n  mat-hint,\n  mat-icon,\n  mat-input-container,\n  mat-form-field,\n  mat-list,\n  mat-list-item,\n  mat-menu,\n  mat-nav-list,\n  mat-option,\n  mat-placeholder,\n  mat-progress-bar,\n  mat-pseudo-checkbox,\n  mat-radio-button,\n  mat-radio-group,\n  mat-row,\n  mat-select,\n  mat-sidenav,\n  mat-sidenav-container,\n  mat-slider,\n  mat-spinner,\n  mat-tab,\n  mat-table,\n  mat-tab-group,\n  mat-toolbar";
/**
 * Selector that matches all elements that may have style collisions with AngularJS Material.
 */
var MD_ELEMENTS_SELECTOR = "\n  [md-button],\n  [md-fab],\n  [md-icon-button],\n  [md-mini-fab],\n  [md-raised-button],\n  [mdCardSubtitle],\n  [mdCardTitle],\n  [mdCellDef],\n  [mdColumnDef],\n  [mdDialogActions],\n  [mdDialogClose],\n  [mdDialogContent],\n  [mdDialogTitle],\n  [mdHeaderCellDef],\n  [mdHeaderRowDef],\n  [mdLine],\n  [mdRowDef],\n  [mdTabLabel],\n  [mdTabLink],\n  [mdTabNav],\n  [mdTooltip],\n  [mdInput],\n  [mdPrefix],\n  [mdSuffix],\n  md-autocomplete,\n  md-button-toggle,\n  md-button-toggle,\n  md-button-toggle-group,\n  md-card,\n  md-card-actions,\n  md-card-content,\n  md-card-footer,\n  md-card-header,\n  md-card-subtitle,\n  md-card-title,\n  md-card-title-group,\n  md-cell,\n  md-checkbox,\n  md-chip,\n  md-dialog-actions,\n  md-dialog-container,\n  md-dialog-content,\n  md-divider,\n  md-error,\n  md-grid-list,\n  md-grid-tile,\n  md-grid-tile-footer,\n  md-grid-tile-header,\n  md-header-cell,\n  md-header-row,\n  md-hint,\n  md-icon,\n  md-input-container,\n  md-form-field,\n  md-list,\n  md-list-item,\n  md-menu,\n  md-nav-list,\n  md-option,\n  md-placeholder,\n  md-progress-bar,\n  md-pseudo-checkbox,\n  md-radio-button,\n  md-radio-group,\n  md-row,\n  md-select,\n  md-sidenav,\n  md-sidenav-container,\n  md-slider,\n  md-spinner,\n  md-tab,\n  md-table,\n  md-tab-group,\n  md-toolbar";
/**
 * Directive that enforces that the `mat-` prefix cannot be used.
 */
var MatPrefixRejector = (function () {
    /**
     * @param {?} isCompatibilityMode
     * @param {?} elementRef
     */
    function MatPrefixRejector(isCompatibilityMode, elementRef) {
        if (!isCompatibilityMode) {
            throw getMdCompatibilityInvalidPrefixError('mat', elementRef.nativeElement.nodeName);
        }
    }
    return MatPrefixRejector;
}());
MatPrefixRejector.decorators = [
    { type: Directive, args: [{ selector: MAT_ELEMENTS_SELECTOR },] },
];
/**
 * @nocollapse
 */
MatPrefixRejector.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
    { type: ElementRef, },
]; };
/**
 * Directive that enforces that the `md-` prefix cannot be used.
 */
var MdPrefixRejector = (function () {
    /**
     * @param {?} isCompatibilityMode
     * @param {?} elementRef
     */
    function MdPrefixRejector(isCompatibilityMode, elementRef) {
        if (isCompatibilityMode) {
            throw getMdCompatibilityInvalidPrefixError('md', elementRef.nativeElement.nodeName);
        }
    }
    return MdPrefixRejector;
}());
MdPrefixRejector.decorators = [
    { type: Directive, args: [{ selector: MD_ELEMENTS_SELECTOR },] },
];
/**
 * @nocollapse
 */
MdPrefixRejector.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
    { type: ElementRef, },
]; };
/**
 * Module that enforces the default compatibility mode settings. When this module is loaded
 * without NoConflictStyleCompatibilityMode also being imported, it will throw an error if
 * there are any uses of the `mat-` prefix.
 */
var CompatibilityModule = (function () {
    function CompatibilityModule() {
    }
    return CompatibilityModule;
}());
CompatibilityModule.decorators = [
    { type: NgModule, args: [{
                declarations: [MatPrefixRejector, MdPrefixRejector],
                exports: [MatPrefixRejector, MdPrefixRejector],
            },] },
];
/**
 * @nocollapse
 */
CompatibilityModule.ctorParameters = function () { return []; };
/**
 * Module that enforces "no-conflict" compatibility mode settings. When this module is loaded,
 * it will throw an error if there are any uses of the `md-` prefix.
 */
var NoConflictStyleCompatibilityMode = (function () {
    function NoConflictStyleCompatibilityMode() {
    }
    return NoConflictStyleCompatibilityMode;
}());
NoConflictStyleCompatibilityMode.decorators = [
    { type: NgModule, args: [{
                providers: [{
                        provide: MATERIAL_COMPATIBILITY_MODE, useValue: true,
                    }],
            },] },
];
/**
 * @nocollapse
 */
NoConflictStyleCompatibilityMode.ctorParameters = function () { return []; };
/**
 * Injection token that configures whether the Material sanity checks are enabled.
 */
var MATERIAL_SANITY_CHECKS = new InjectionToken('md-sanity-checks');
/**
 * Module that captures anything that should be loaded and/or run for *all* Angular Material
 * components. This includes Bidi, compatibility mode, etc.
 *
 * This module should be imported to each top-level component module (e.g., MdTabsModule).
 */
var MdCommonModule = (function () {
    /**
     * @param {?} _document
     * @param {?} _sanityChecksEnabled
     */
    function MdCommonModule(_document, _sanityChecksEnabled) {
        this._document = _document;
        /**
         * Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype).
         */
        this._hasDoneGlobalChecks = false;
        if (_sanityChecksEnabled && !this._hasDoneGlobalChecks && _document && isDevMode()) {
            this._checkDoctype();
            this._checkTheme();
            this._hasDoneGlobalChecks = true;
        }
    }
    /**
     * @return {?}
     */
    MdCommonModule.prototype._checkDoctype = function () {
        if (!this._document.doctype) {
            console.warn('Current document does not have a doctype. This may cause ' +
                'some Angular Material components not to behave as expected.');
        }
    };
    /**
     * @return {?}
     */
    MdCommonModule.prototype._checkTheme = function () {
        if (typeof getComputedStyle === 'function') {
            var /** @type {?} */ testElement = this._document.createElement('div');
            testElement.classList.add('mat-theme-loaded-marker');
            this._document.body.appendChild(testElement);
            if (getComputedStyle(testElement).display !== 'none') {
                console.warn('Could not find Angular Material core theme. Most Material ' +
                    'components may not work as expected. For more info refer ' +
                    'to the theming guide: https://material.angular.io/guide/theming');
            }
            this._document.body.removeChild(testElement);
        }
    };
    return MdCommonModule;
}());
MdCommonModule.decorators = [
    { type: NgModule, args: [{
                imports: [CompatibilityModule, BidiModule],
                exports: [CompatibilityModule, BidiModule],
                providers: [{
                        provide: MATERIAL_SANITY_CHECKS, useValue: true,
                    }],
            },] },
];
/**
 * @nocollapse
 */
MdCommonModule.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_SANITY_CHECKS,] },] },
]; };
/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a \@ContentChildren(MdLine) query, then
 * counted by checking the query list's length.
 */
var MdLine = (function () {
    function MdLine() {
    }
    return MdLine;
}());
MdLine.decorators = [
    { type: Directive, args: [{
                selector: '[md-line], [mat-line], [mdLine], [matLine]',
                host: { 'class': 'mat-line' }
            },] },
];
/**
 * @nocollapse
 */
MdLine.ctorParameters = function () { return []; };
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * \@docs-private
 */
var MdLineSetter = (function () {
    /**
     * @param {?} _lines
     * @param {?} _renderer
     * @param {?} _element
     */
    function MdLineSetter(_lines, _renderer, _element) {
        var _this = this;
        this._lines = _lines;
        this._renderer = _renderer;
        this._element = _element;
        this._setLineClass(this._lines.length);
        this._lines.changes.subscribe(function () {
            _this._setLineClass(_this._lines.length);
        });
    }
    /**
     * @param {?} count
     * @return {?}
     */
    MdLineSetter.prototype._setLineClass = function (count) {
        this._resetClasses();
        if (count === 2 || count === 3) {
            this._setClass("mat-" + count + "-line", true);
        }
        else if (count > 3) {
            this._setClass("mat-multi-line", true);
        }
    };
    /**
     * @return {?}
     */
    MdLineSetter.prototype._resetClasses = function () {
        this._setClass('mat-2-line', false);
        this._setClass('mat-3-line', false);
        this._setClass('mat-multi-line', false);
    };
    /**
     * @param {?} className
     * @param {?} isAdd
     * @return {?}
     */
    MdLineSetter.prototype._setClass = function (className, isAdd) {
        if (isAdd) {
            this._renderer.addClass(this._element.nativeElement, className);
        }
        else {
            this._renderer.removeClass(this._element.nativeElement, className);
        }
    };
    return MdLineSetter;
}());
var MdLineModule = (function () {
    function MdLineModule() {
    }
    return MdLineModule;
}());
MdLineModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule],
                exports: [MdLine, MdCommonModule],
                declarations: [MdLine],
            },] },
];
/**
 * @nocollapse
 */
MdLineModule.ctorParameters = function () { return []; };
var RippleState = {};
RippleState.FADING_IN = 0;
RippleState.VISIBLE = 1;
RippleState.FADING_OUT = 2;
RippleState.HIDDEN = 3;
RippleState[RippleState.FADING_IN] = "FADING_IN";
RippleState[RippleState.VISIBLE] = "VISIBLE";
RippleState[RippleState.FADING_OUT] = "FADING_OUT";
RippleState[RippleState.HIDDEN] = "HIDDEN";
/**
 * Reference to a previously launched ripple element.
 */
var RippleRef = (function () {
    /**
     * @param {?} _renderer
     * @param {?} element
     * @param {?} config
     */
    function RippleRef(_renderer, element, config) {
        this._renderer = _renderer;
        this.element = element;
        this.config = config;
        /**
         * Current state of the ripple reference.
         */
        this.state = RippleState.HIDDEN;
    }
    /**
     * Fades out the ripple element.
     * @return {?}
     */
    RippleRef.prototype.fadeOut = function () {
        this._renderer.fadeOutRipple(this);
    };
    return RippleRef;
}());
/**
 * Fade-in duration for the ripples. Can be modified with the speedFactor option.
 */
var RIPPLE_FADE_IN_DURATION = 450;
/**
 * Fade-out duration for the ripples in milliseconds. This can't be modified by the speedFactor.
 */
var RIPPLE_FADE_OUT_DURATION = 400;
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * \@docs-private
 */
var RippleRenderer = (function () {
    /**
     * @param {?} elementRef
     * @param {?} _ngZone
     * @param {?} _ruler
     * @param {?} platform
     */
    function RippleRenderer(elementRef, _ngZone, _ruler, platform) {
        this._ngZone = _ngZone;
        this._ruler = _ruler;
        /**
         * Whether the mouse is currently down or not.
         */
        this._isMousedown = false;
        /**
         * Events to be registered on the trigger element.
         */
        this._triggerEvents = new Map();
        /**
         * Set of currently active ripple references.
         */
        this._activeRipples = new Set();
        /**
         * Ripple config for all ripples created by events.
         */
        this.rippleConfig = {};
        /**
         * Whether mouse ripples should be created or not.
         */
        this.rippleDisabled = false;
        // Only do anything if we're on the browser.
        if (platform.isBrowser) {
            this._containerElement = elementRef.nativeElement;
            // Specify events which need to be registered on the trigger.
            this._triggerEvents.set('mousedown', this.onMousedown.bind(this));
            this._triggerEvents.set('mouseup', this.onMouseup.bind(this));
            this._triggerEvents.set('mouseleave', this.onMouseLeave.bind(this));
            // By default use the host element as trigger element.
            this.setTriggerElement(this._containerElement);
        }
    }
    /**
     * Fades in a ripple at the given coordinates.
     * @param {?} pageX
     * @param {?} pageY
     * @param {?=} config
     * @return {?}
     */
    RippleRenderer.prototype.fadeInRipple = function (pageX, pageY, config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        var /** @type {?} */ containerRect = this._containerElement.getBoundingClientRect();
        if (config.centered) {
            pageX = containerRect.left + containerRect.width / 2;
            pageY = containerRect.top + containerRect.height / 2;
        }
        else {
            // Subtract scroll values from the coordinates because calculations below
            // are always relative to the viewport rectangle.
            var /** @type {?} */ scrollPosition = this._ruler.getViewportScrollPosition();
            pageX -= scrollPosition.left;
            pageY -= scrollPosition.top;
        }
        var /** @type {?} */ radius = config.radius || distanceToFurthestCorner(pageX, pageY, containerRect);
        var /** @type {?} */ duration = RIPPLE_FADE_IN_DURATION * (1 / (config.speedFactor || 1));
        var /** @type {?} */ offsetX = pageX - containerRect.left;
        var /** @type {?} */ offsetY = pageY - containerRect.top;
        var /** @type {?} */ ripple = document.createElement('div');
        ripple.classList.add('mat-ripple-element');
        ripple.style.left = offsetX - radius + "px";
        ripple.style.top = offsetY - radius + "px";
        ripple.style.height = radius * 2 + "px";
        ripple.style.width = radius * 2 + "px";
        // If the color is not set, the default CSS color will be used.
        ripple.style.backgroundColor = config.color || null;
        ripple.style.transitionDuration = duration + "ms";
        this._containerElement.appendChild(ripple);
        // By default the browser does not recalculate the styles of dynamically created
        // ripple elements. This is critical because then the `scale` would not animate properly.
        enforceStyleRecalculation(ripple);
        ripple.style.transform = 'scale(1)';
        // Exposed reference to the ripple that will be returned.
        var /** @type {?} */ rippleRef = new RippleRef(this, ripple, config);
        rippleRef.state = RippleState.FADING_IN;
        // Add the ripple reference to the list of all active ripples.
        this._activeRipples.add(rippleRef);
        // Wait for the ripple element to be completely faded in.
        // Once it's faded in, the ripple can be hidden immediately if the mouse is released.
        this.runTimeoutOutsideZone(function () {
            rippleRef.state = RippleState.VISIBLE;
            if (!config.persistent && !_this._isMousedown) {
                rippleRef.fadeOut();
            }
        }, duration);
        return rippleRef;
    };
    /**
     * Fades out a ripple reference.
     * @param {?} rippleRef
     * @return {?}
     */
    RippleRenderer.prototype.fadeOutRipple = function (rippleRef) {
        // For ripples that are not active anymore, don't re-un the fade-out animation.
        if (!this._activeRipples.delete(rippleRef)) {
            return;
        }
        var /** @type {?} */ rippleEl = rippleRef.element;
        rippleEl.style.transitionDuration = RIPPLE_FADE_OUT_DURATION + "ms";
        rippleEl.style.opacity = '0';
        rippleRef.state = RippleState.FADING_OUT;
        // Once the ripple faded out, the ripple can be safely removed from the DOM.
        this.runTimeoutOutsideZone(function () {
            rippleRef.state = RippleState.HIDDEN; /** @type {?} */
            ((rippleEl.parentNode)).removeChild(rippleEl);
        }, RIPPLE_FADE_OUT_DURATION);
    };
    /**
     * Fades out all currently active ripples.
     * @return {?}
     */
    RippleRenderer.prototype.fadeOutAll = function () {
        this._activeRipples.forEach(function (ripple) { return ripple.fadeOut(); });
    };
    /**
     * Sets the trigger element and registers the mouse events.
     * @param {?} element
     * @return {?}
     */
    RippleRenderer.prototype.setTriggerElement = function (element) {
        var _this = this;
        // Remove all previously register event listeners from the trigger element.
        if (this._triggerElement) {
            this._triggerEvents.forEach(function (fn, type) {
                ((_this._triggerElement)).removeEventListener(type, fn);
            });
        }
        if (element) {
            // If the element is not null, register all event listeners on the trigger element.
            this._ngZone.runOutsideAngular(function () {
                _this._triggerEvents.forEach(function (fn, type) { return element.addEventListener(type, fn); });
            });
        }
        this._triggerElement = element;
    };
    /**
     * Listener being called on mousedown event.
     * @param {?} event
     * @return {?}
     */
    RippleRenderer.prototype.onMousedown = function (event) {
        if (!this.rippleDisabled) {
            this._isMousedown = true;
            this.fadeInRipple(event.pageX, event.pageY, this.rippleConfig);
        }
    };
    /**
     * Listener being called on mouseup event.
     * @return {?}
     */
    RippleRenderer.prototype.onMouseup = function () {
        this._isMousedown = false;
        // Fade-out all ripples that are completely visible and not persistent.
        this._activeRipples.forEach(function (ripple) {
            if (!ripple.config.persistent && ripple.state === RippleState.VISIBLE) {
                ripple.fadeOut();
            }
        });
    };
    /**
     * Listener being called on mouseleave event.
     * @return {?}
     */
    RippleRenderer.prototype.onMouseLeave = function () {
        if (this._isMousedown) {
            this.onMouseup();
        }
    };
    /**
     * Runs a timeout outside of the Angular zone to avoid triggering the change detection.
     * @param {?} fn
     * @param {?=} delay
     * @return {?}
     */
    RippleRenderer.prototype.runTimeoutOutsideZone = function (fn, delay) {
        if (delay === void 0) { delay = 0; }
        this._ngZone.runOutsideAngular(function () { return setTimeout(fn, delay); });
    };
    return RippleRenderer;
}());
/**
 * @param {?} element
 * @return {?}
 */
function enforceStyleRecalculation(element) {
    // Enforce a style recalculation by calling `getComputedStyle` and accessing any property.
    // Calling `getPropertyValue` is important to let optimizers know that this is not a noop.
    // See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    window.getComputedStyle(element).getPropertyValue('opacity');
}
/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 * @param {?} x
 * @param {?} y
 * @param {?} rect
 * @return {?}
 */
function distanceToFurthestCorner(x, y, rect) {
    var /** @type {?} */ distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    var /** @type {?} */ distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
}
/**
 * Injection token that can be used to specify the global ripple options.
 */
var MD_RIPPLE_GLOBAL_OPTIONS = new InjectionToken('md-ripple-global-options');
var MdRipple = (function () {
    /**
     * @param {?} elementRef
     * @param {?} ngZone
     * @param {?} ruler
     * @param {?} platform
     * @param {?} globalOptions
     */
    function MdRipple(elementRef, ngZone, ruler, platform, globalOptions) {
        /**
         * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
         * will be the distance from the center of the ripple to the furthest corner of the host element's
         * bounding rectangle.
         */
        this.radius = 0;
        /**
         * If set, the normal duration of ripple animations is divided by this value. For example,
         * setting it to 0.5 will cause the animations to take twice as long.
         * A changed speedFactor will not modify the fade-out duration of the ripples.
         */
        this.speedFactor = 1;
        this._rippleRenderer = new RippleRenderer(elementRef, ngZone, ruler, platform);
        this._globalOptions = globalOptions ? globalOptions : {};
        this._updateRippleRenderer();
    }
    Object.defineProperty(MdRipple.prototype, "_matRippleTrigger", {
        /**
         * @return {?}
         */
        get: function () { return this.trigger; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.trigger = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleCentered", {
        /**
         * @return {?}
         */
        get: function () { return this.centered; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.centered = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleDisabled", {
        /**
         * @return {?}
         */
        get: function () { return this.disabled; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.disabled = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleRadius", {
        /**
         * @return {?}
         */
        get: function () { return this.radius; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.radius = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleSpeedFactor", {
        /**
         * @return {?}
         */
        get: function () { return this.speedFactor; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.speedFactor = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleColor", {
        /**
         * @return {?}
         */
        get: function () { return this.color; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.color = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRipple.prototype, "_matRippleUnbounded", {
        /**
         * @return {?}
         */
        get: function () { return this.unbounded; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.unbounded = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    MdRipple.prototype.ngOnChanges = function (changes) {
        if (changes['trigger'] && this.trigger) {
            this._rippleRenderer.setTriggerElement(this.trigger);
        }
        this._updateRippleRenderer();
    };
    /**
     * @return {?}
     */
    MdRipple.prototype.ngOnDestroy = function () {
        // Set the trigger element to null to cleanup all listeners.
        this._rippleRenderer.setTriggerElement(null);
    };
    /**
     * Launches a manual ripple at the specified position.
     * @param {?} pageX
     * @param {?} pageY
     * @param {?=} config
     * @return {?}
     */
    MdRipple.prototype.launch = function (pageX, pageY, config) {
        if (config === void 0) { config = this.rippleConfig; }
        return this._rippleRenderer.fadeInRipple(pageX, pageY, config);
    };
    /**
     * Fades out all currently showing ripple elements.
     * @return {?}
     */
    MdRipple.prototype.fadeOutAll = function () {
        this._rippleRenderer.fadeOutAll();
    };
    Object.defineProperty(MdRipple.prototype, "rippleConfig", {
        /**
         * Ripple configuration from the directive's input values.
         * @return {?}
         */
        get: function () {
            return {
                centered: this.centered,
                speedFactor: this.speedFactor * (this._globalOptions.baseSpeedFactor || 1),
                radius: this.radius,
                color: this.color
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the ripple renderer with the latest ripple configuration.
     * @return {?}
     */
    MdRipple.prototype._updateRippleRenderer = function () {
        this._rippleRenderer.rippleDisabled = this._globalOptions.disabled || this.disabled;
        this._rippleRenderer.rippleConfig = this.rippleConfig;
    };
    return MdRipple;
}());
MdRipple.decorators = [
    { type: Directive, args: [{
                selector: '[md-ripple], [mat-ripple], [mdRipple], [matRipple]',
                exportAs: 'mdRipple',
                host: {
                    'class': 'mat-ripple',
                    '[class.mat-ripple-unbounded]': 'unbounded'
                }
            },] },
];
/**
 * @nocollapse
 */
MdRipple.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: NgZone, },
    { type: ViewportRuler$1, },
    { type: Platform, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_RIPPLE_GLOBAL_OPTIONS,] },] },
]; };
MdRipple.propDecorators = {
    'trigger': [{ type: Input, args: ['mdRippleTrigger',] },],
    'centered': [{ type: Input, args: ['mdRippleCentered',] },],
    'disabled': [{ type: Input, args: ['mdRippleDisabled',] },],
    'radius': [{ type: Input, args: ['mdRippleRadius',] },],
    'speedFactor': [{ type: Input, args: ['mdRippleSpeedFactor',] },],
    'color': [{ type: Input, args: ['mdRippleColor',] },],
    'unbounded': [{ type: Input, args: ['mdRippleUnbounded',] },],
    '_matRippleTrigger': [{ type: Input, args: ['matRippleTrigger',] },],
    '_matRippleCentered': [{ type: Input, args: ['matRippleCentered',] },],
    '_matRippleDisabled': [{ type: Input, args: ['matRippleDisabled',] },],
    '_matRippleRadius': [{ type: Input, args: ['matRippleRadius',] },],
    '_matRippleSpeedFactor': [{ type: Input, args: ['matRippleSpeedFactor',] },],
    '_matRippleColor': [{ type: Input, args: ['matRippleColor',] },],
    '_matRippleUnbounded': [{ type: Input, args: ['matRippleUnbounded',] },],
};
var MdRippleModule = (function () {
    function MdRippleModule() {
    }
    return MdRippleModule;
}());
MdRippleModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule, PlatformModule, ScrollDispatchModule],
                exports: [MdRipple, MdCommonModule],
                declarations: [MdRipple],
                providers: [VIEWPORT_RULER_PROVIDER$1],
            },] },
];
/**
 * @nocollapse
 */
MdRippleModule.ctorParameters = function () { return []; };
/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that theming is meant to be handled by the parent element, e.g.
 * `mat-primary .mat-pseudo-checkbox`.
 *
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with <md-checkbox> and should *not* be used if the user would directly interact
 * with the checkbox. The pseudo-checkbox should only be used as an implementation detail of
 * more complex components that appropriately handle selected / checked state.
 * \@docs-private
 */
var MdPseudoCheckbox = (function () {
    function MdPseudoCheckbox() {
        /**
         * Display state of the checkbox.
         */
        this.state = 'unchecked';
        /**
         * Whether the checkbox is disabled.
         */
        this.disabled = false;
    }
    return MdPseudoCheckbox;
}());
MdPseudoCheckbox.decorators = [
    { type: Component, args: [{ encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                selector: 'md-pseudo-checkbox, mat-pseudo-checkbox',
                styles: [".mat-pseudo-checkbox{width:20px;height:20px;border:2px solid;border-radius:2px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;transition:border-color 90ms cubic-bezier(0,0,.2,.1),background-color 90ms cubic-bezier(0,0,.2,.1)}.mat-pseudo-checkbox::after{position:absolute;opacity:0;content:'';border-bottom:2px solid currentColor;transition:opacity 90ms cubic-bezier(0,0,.2,.1)}.mat-pseudo-checkbox.mat-pseudo-checkbox-checked,.mat-pseudo-checkbox.mat-pseudo-checkbox-indeterminate{border:none}.mat-pseudo-checkbox-disabled{cursor:default}.mat-pseudo-checkbox-indeterminate::after{top:9px;left:2px;width:16px;opacity:1}.mat-pseudo-checkbox-checked::after{top:5px;left:3px;width:12px;height:5px;border-left:2px solid currentColor;transform:rotate(-45deg);opacity:1}"],
                template: '',
                host: {
                    'class': 'mat-pseudo-checkbox',
                    '[class.mat-pseudo-checkbox-indeterminate]': 'state === "indeterminate"',
                    '[class.mat-pseudo-checkbox-checked]': 'state === "checked"',
                    '[class.mat-pseudo-checkbox-disabled]': 'disabled',
                },
            },] },
];
/**
 * @nocollapse
 */
MdPseudoCheckbox.ctorParameters = function () { return []; };
MdPseudoCheckbox.propDecorators = {
    'state': [{ type: Input },],
    'disabled': [{ type: Input },],
};
var MdPseudoCheckboxModule = (function () {
    function MdPseudoCheckboxModule() {
    }
    return MdPseudoCheckboxModule;
}());
MdPseudoCheckboxModule.decorators = [
    { type: NgModule, args: [{
                exports: [MdPseudoCheckbox],
                declarations: [MdPseudoCheckbox]
            },] },
];
/**
 * @nocollapse
 */
MdPseudoCheckboxModule.ctorParameters = function () { return []; };
/**
 * Mixin to augment a directive with a `disabled` property.
 * @template T
 * @param {?} base
 * @return {?}
 */
function mixinDisabled(base) {
    return (function (_super) {
        tslib_1.__extends(class_1, _super);
        /**
         * @param {...?} args
         */
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this._disabled = false;
            return _this;
        }
        Object.defineProperty(class_1.prototype, "disabled", {
            /**
             * @return {?}
             */
            get: function () { return this._disabled; },
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) { this._disabled = coerceBooleanProperty(value); },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(base));
}
/**
 * \@docs-private
 */
var MdOptgroupBase = (function () {
    function MdOptgroupBase() {
    }
    return MdOptgroupBase;
}());
var _MdOptgroupMixinBase = mixinDisabled(MdOptgroupBase);
// Counter for unique group ids.
var _uniqueOptgroupIdCounter = 0;
/**
 * Component that is used to group instances of `md-option`.
 */
var MdOptgroup = (function (_super) {
    tslib_1.__extends(MdOptgroup, _super);
    function MdOptgroup() {
        var _this = _super.apply(this, arguments) || this;
        /**
         * Unique id for the underlying label.
         */
        _this._labelId = "mat-optgroup-label-" + _uniqueOptgroupIdCounter++;
        return _this;
    }
    return MdOptgroup;
}(_MdOptgroupMixinBase));
MdOptgroup.decorators = [
    { type: Component, args: [{ selector: 'md-optgroup, mat-optgroup',
                template: "<label class=\"mat-optgroup-label\" [id]=\"_labelId\">{{ label }}</label><ng-content select=\"md-option, mat-option\"></ng-content>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: ['disabled'],
                host: {
                    'class': 'mat-optgroup',
                    'role': 'group',
                    '[class.mat-optgroup-disabled]': 'disabled',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-labelledby]': '_labelId',
                }
            },] },
];
/**
 * @nocollapse
 */
MdOptgroup.ctorParameters = function () { return []; };
MdOptgroup.propDecorators = {
    'label': [{ type: Input },],
};
/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
var _uniqueIdCounter = 0;
/**
 * Event object emitted by MdOption when selected or deselected.
 */
var MdOptionSelectionChange = (function () {
    /**
     * @param {?} source
     * @param {?=} isUserInput
     */
    function MdOptionSelectionChange(source, isUserInput) {
        if (isUserInput === void 0) { isUserInput = false; }
        this.source = source;
        this.isUserInput = isUserInput;
    }
    return MdOptionSelectionChange;
}());
/**
 * Single option inside of a `<md-select>` element.
 */
var MdOption = (function () {
    /**
     * @param {?} _element
     * @param {?} _changeDetectorRef
     * @param {?} group
     * @param {?} _isCompatibilityMode
     */
    function MdOption(_element, _changeDetectorRef, group, _isCompatibilityMode) {
        this._element = _element;
        this._changeDetectorRef = _changeDetectorRef;
        this.group = group;
        this._isCompatibilityMode = _isCompatibilityMode;
        this._selected = false;
        this._active = false;
        this._multiple = false;
        this._disableRipple = false;
        /**
         * Whether the option is disabled.
         */
        this._disabled = false;
        this._id = "md-option-" + _uniqueIdCounter++;
        /**
         * Event emitted when the option is selected or deselected.
         */
        this.onSelectionChange = new EventEmitter();
    }
    Object.defineProperty(MdOption.prototype, "multiple", {
        /**
         * Whether the wrapping component is in multiple selection mode.
         * @return {?}
         */
        get: function () { return this._multiple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== this._multiple) {
                this._multiple = value;
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "id", {
        /**
         * The unique ID of the option.
         * @return {?}
         */
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "selected", {
        /**
         * Whether or not the option is currently selected.
         * @return {?}
         */
        get: function () { return this._selected; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "disabled", {
        /**
         * Whether the option is disabled.
         * @return {?}
         */
        get: function () { return (this.group && this.group.disabled) || this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "disableRipple", {
        /**
         * Whether ripples for the option are disabled.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disableRipple = value;
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "active", {
        /**
         * Whether or not the option is currently active and ready to be selected.
         * An active option displays styles as if it is focused, but the
         * focus is actually retained somewhere else. This comes in handy
         * for components like autocomplete where focus must remain on the input.
         * @return {?}
         */
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "viewValue", {
        /**
         * The displayed value of the option. It is necessary to show the selected option in the
         * select's trigger.
         * @return {?}
         */
        get: function () {
            // TODO(kara): Add input property alternative for node envs.
            return (this._getHostElement().textContent || '').trim();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Selects the option.
     * @return {?}
     */
    MdOption.prototype.select = function () {
        this._selected = true;
        this._changeDetectorRef.markForCheck();
        this._emitSelectionChangeEvent();
    };
    /**
     * Deselects the option.
     * @return {?}
     */
    MdOption.prototype.deselect = function () {
        this._selected = false;
        this._changeDetectorRef.markForCheck();
        this._emitSelectionChangeEvent();
    };
    /**
     * Sets focus onto this option.
     * @return {?}
     */
    MdOption.prototype.focus = function () {
        var /** @type {?} */ element = this._getHostElement();
        if (typeof element.focus === 'function') {
            element.focus();
        }
    };
    /**
     * This method sets display styles on the option to make it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     * @return {?}
     */
    MdOption.prototype.setActiveStyles = function () {
        if (!this._active) {
            this._active = true;
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * This method removes display styles on the option that made it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     * @return {?}
     */
    MdOption.prototype.setInactiveStyles = function () {
        if (this._active) {
            this._active = false;
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * Gets the label to be used when determining whether the option should be focused.
     * @return {?}
     */
    MdOption.prototype.getLabel = function () {
        return this.viewValue;
    };
    /**
     * Ensures the option is selected when activated from the keyboard.
     * @param {?} event
     * @return {?}
     */
    MdOption.prototype._handleKeydown = function (event) {
        if (event.keyCode === ENTER || event.keyCode === SPACE) {
            this._selectViaInteraction();
            // Prevent the page from scrolling down and form submits.
            event.preventDefault();
        }
    };
    /**
     * Selects the option while indicating the selection came from the user. Used to
     * determine if the select's view -> model callback should be invoked.
     * @return {?}
     */
    MdOption.prototype._selectViaInteraction = function () {
        if (!this.disabled) {
            this._selected = this.multiple ? !this._selected : true;
            this._changeDetectorRef.markForCheck();
            this._emitSelectionChangeEvent(true);
        }
    };
    /**
     * Returns the correct tabindex for the option depending on disabled state.
     * @return {?}
     */
    MdOption.prototype._getTabIndex = function () {
        return this.disabled ? '-1' : '0';
    };
    /**
     * Gets the host DOM element.
     * @return {?}
     */
    MdOption.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    /**
     * Emits the selection change event.
     * @param {?=} isUserInput
     * @return {?}
     */
    MdOption.prototype._emitSelectionChangeEvent = function (isUserInput) {
        if (isUserInput === void 0) { isUserInput = false; }
        this.onSelectionChange.emit(new MdOptionSelectionChange(this, isUserInput));
    };
    /**
     * Counts the amount of option group labels that precede the specified option.
     * @param {?} optionIndex Index of the option at which to start counting.
     * @param {?} options Flat list of all of the options.
     * @param {?} optionGroups Flat list of all of the option groups.
     * @return {?}
     */
    MdOption.countGroupLabelsBeforeOption = function (optionIndex, options, optionGroups) {
        if (optionGroups.length) {
            var /** @type {?} */ optionsArray = options.toArray();
            var /** @type {?} */ groups = optionGroups.toArray();
            var /** @type {?} */ groupCounter = 0;
            for (var /** @type {?} */ i = 0; i < optionIndex + 1; i++) {
                if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) {
                    groupCounter++;
                }
            }
            return groupCounter;
        }
        return 0;
    };
    return MdOption;
}());
MdOption.decorators = [
    { type: Component, args: [{ selector: 'md-option, mat-option',
                host: {
                    'role': 'option',
                    '[attr.tabindex]': '_getTabIndex()',
                    '[class.mat-selected]': 'selected',
                    '[class.mat-option-multiple]': 'multiple',
                    '[class.mat-active]': 'active',
                    '[id]': 'id',
                    '[attr.aria-selected]': 'selected.toString()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[class.mat-option-disabled]': 'disabled',
                    '(click)': '_selectViaInteraction()',
                    '(keydown)': '_handleKeydown($event)',
                    'class': 'mat-option',
                },
                template: "<span [ngSwitch]=\"_isCompatibilityMode\" *ngIf=\"multiple\"><mat-pseudo-checkbox class=\"mat-option-pseudo-checkbox\" *ngSwitchCase=\"true\" [state]=\"selected ? 'checked' : ''\"></mat-pseudo-checkbox><md-pseudo-checkbox class=\"mat-option-pseudo-checkbox\" *ngSwitchDefault [state]=\"selected ? 'checked' : ''\"></md-pseudo-checkbox></span><ng-content></ng-content><div class=\"mat-option-ripple\" md-ripple [mdRippleTrigger]=\"_getHostElement()\" [mdRippleDisabled]=\"disabled || disableRipple\"></div>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdOption.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
    { type: MdOptgroup, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
]; };
MdOption.propDecorators = {
    'value': [{ type: Input },],
    'disabled': [{ type: Input },],
    'onSelectionChange': [{ type: Output },],
};
var MdOptionModule = (function () {
    function MdOptionModule() {
    }
    return MdOptionModule;
}());
MdOptionModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdRippleModule, CommonModule, MdPseudoCheckboxModule],
                exports: [MdOption, MdOptgroup],
                declarations: [MdOption, MdOptgroup]
            },] },
];
/**
 * @nocollapse
 */
MdOptionModule.ctorParameters = function () { return []; };
var GestureConfig = (function (_super) {
    tslib_1.__extends(GestureConfig, _super);
    function GestureConfig() {
        var _this = _super.call(this) || this;
        _this._hammer = typeof window !== 'undefined' ? ((window)).Hammer : null;
        /* List of new event names to add to the gesture support list */
        _this.events = _this._hammer ? [
            'longpress',
            'slide',
            'slidestart',
            'slideend',
            'slideright',
            'slideleft'
        ] : [];
        if (!_this._hammer && isDevMode()) {
            console.warn('Could not find HammerJS. Certain Angular Material ' +
                'components may not work correctly.');
        }
        return _this;
    }
    /**
     * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
     *
     * Our gesture names come from the Material Design gestures spec:
     * https://www.google.com/design/spec/patterns/gestures.html#gestures-touch-mechanics
     *
     * More information on default recognizers can be found in Hammer docs:
     * http://hammerjs.github.io/recognizer-pan/
     * http://hammerjs.github.io/recognizer-press/
     *
     * @param {?} element Element to which to assign the new HammerJS gestures.
     * @return {?} Newly-created HammerJS instance.
     */
    GestureConfig.prototype.buildHammer = function (element) {
        var /** @type {?} */ mc = new this._hammer(element);
        // Default Hammer Recognizers.
        var /** @type {?} */ pan = new this._hammer.Pan();
        var /** @type {?} */ swipe = new this._hammer.Swipe();
        var /** @type {?} */ press = new this._hammer.Press();
        // Notice that a HammerJS recognizer can only depend on one other recognizer once.
        // Otherwise the previous `recognizeWith` will be dropped.
        // TODO: Confirm threshold numbers with Material Design UX Team
        var /** @type {?} */ slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
        var /** @type {?} */ longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
        // Overwrite the default `pan` event to use the swipe event.
        pan.recognizeWith(swipe);
        // Add customized gestures to Hammer manager
        mc.add([swipe, press, pan, slide, longpress]);
        return (mc);
    };
    /**
     * Creates a new recognizer, without affecting the default recognizers of HammerJS
     * @param {?} base
     * @param {?} options
     * @param {...?} inheritances
     * @return {?}
     */
    GestureConfig.prototype._createRecognizer = function (base, options) {
        var inheritances = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            inheritances[_i - 2] = arguments[_i];
        }
        var /** @type {?} */ recognizer = new ((base.constructor))(options);
        inheritances.push(base);
        inheritances.forEach(function (item) { return recognizer.recognizeWith(item); });
        return recognizer;
    };
    return GestureConfig;
}(HammerGestureConfig));
GestureConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
GestureConfig.ctorParameters = function () { return []; };
/**
 * Class to coordinate unique selection based on name.
 * Intended to be consumed as an Angular service.
 * This service is needed because native radio change events are only fired on the item currently
 * being selected, and we still need to uncheck the previous selection.
 *
 * This service does not *store* any IDs and names because they may change at any time, so it is
 * less error-prone if they are simply passed through when the events occur.
 */
var UniqueSelectionDispatcher = (function () {
    function UniqueSelectionDispatcher() {
        this._listeners = [];
    }
    /**
     * Notify other items that selection for the given name has been set.
     * @param {?} id ID of the item.
     * @param {?} name Name of the item.
     * @return {?}
     */
    UniqueSelectionDispatcher.prototype.notify = function (id, name) {
        for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(id, name);
        }
    };
    /**
     * Listen for future changes to item selection.
     * @param {?} listener
     * @return {?} Function used to deregister listener
     *
     */
    UniqueSelectionDispatcher.prototype.listen = function (listener) {
        var _this = this;
        this._listeners.push(listener);
        return function () {
            _this._listeners = _this._listeners.filter(function (registered) {
                return listener !== registered;
            });
        };
    };
    return UniqueSelectionDispatcher;
}());
UniqueSelectionDispatcher.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
UniqueSelectionDispatcher.ctorParameters = function () { return []; };
/**
 * \@docs-private
 * @param {?} parentDispatcher
 * @return {?}
 */
function UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY(parentDispatcher) {
    return parentDispatcher || new UniqueSelectionDispatcher();
}
/**
 * \@docs-private
 */
var UNIQUE_SELECTION_DISPATCHER_PROVIDER = {
    // If there is already a dispatcher available, use that. Otherwise, provide a new one.
    provide: UniqueSelectionDispatcher,
    deps: [[new Optional(), new SkipSelf(), UniqueSelectionDispatcher]],
    useFactory: UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY
};
// This is the value used by AngularJS Material. Through trial and error (on iPhone 6S) they found
// that a value of around 650ms seems appropriate.
var TOUCH_BUFFER_MS = 650;
/**
 * Monitors mouse and keyboard events to determine the cause of focus events.
 */
var FocusOriginMonitor = (function () {
    /**
     * @param {?} _ngZone
     * @param {?} _platform
     */
    function FocusOriginMonitor(_ngZone, _platform) {
        var _this = this;
        this._ngZone = _ngZone;
        this._platform = _platform;
        /**
         * The focus origin that the next focus event is a result of.
         */
        this._origin = null;
        /**
         * Whether the window has just been focused.
         */
        this._windowFocused = false;
        /**
         * Weak map of elements being monitored to their info.
         */
        this._elementInfo = new WeakMap();
        this._ngZone.runOutsideAngular(function () { return _this._registerDocumentEvents(); });
    }
    /**
     * Monitors focus on an element and applies appropriate CSS classes.
     * @param {?} element The element to monitor
     * @param {?} renderer The renderer to use to apply CSS classes to the element.
     * @param {?} checkChildren Whether to count the element as focused when its children are focused.
     * @return {?} An observable that emits when the focus state of the element changes.
     *     When the element is blurred, null will be emitted.
     */
    FocusOriginMonitor.prototype.monitor = function (element, renderer, checkChildren) {
        var _this = this;
        // Do nothing if we're not on the browser platform.
        if (!this._platform.isBrowser) {
            return of(null);
        }
        // Check if we're already monitoring this element.
        if (this._elementInfo.has(element)) {
            var /** @type {?} */ cachedInfo = this._elementInfo.get(element); /** @type {?} */
            ((cachedInfo)).checkChildren = checkChildren;
            return ((cachedInfo)).subject.asObservable();
        }
        // Create monitored element info.
        var /** @type {?} */ info = {
            unlisten: function () { },
            checkChildren: checkChildren,
            renderer: renderer,
            subject: new Subject()
        };
        this._elementInfo.set(element, info);
        // Start listening. We need to listen in capture phase since focus events don't bubble.
        var /** @type {?} */ focusListener = function (event) { return _this._onFocus(event, element); };
        var /** @type {?} */ blurListener = function (event) { return _this._onBlur(event, element); };
        this._ngZone.runOutsideAngular(function () {
            element.addEventListener('focus', focusListener, true);
            element.addEventListener('blur', blurListener, true);
        });
        // Create an unlisten function for later.
        info.unlisten = function () {
            element.removeEventListener('focus', focusListener, true);
            element.removeEventListener('blur', blurListener, true);
        };
        return info.subject.asObservable();
    };
    /**
     * Stops monitoring an element and removes all focus classes.
     * @param {?} element The element to stop monitoring.
     * @return {?}
     */
    FocusOriginMonitor.prototype.stopMonitoring = function (element) {
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (elementInfo) {
            elementInfo.unlisten();
            elementInfo.subject.complete();
            this._setClasses(element);
            this._elementInfo.delete(element);
        }
    };
    /**
     * Focuses the element via the specified focus origin.
     * @param {?} element The element to focus.
     * @param {?} origin The focus origin.
     * @return {?}
     */
    FocusOriginMonitor.prototype.focusVia = function (element, origin) {
        this._setOriginForCurrentEventQueue(origin);
        element.focus();
    };
    /**
     * Register necessary event listeners on the document and window.
     * @return {?}
     */
    FocusOriginMonitor.prototype._registerDocumentEvents = function () {
        var _this = this;
        // Do nothing if we're not on the browser platform.
        if (!this._platform.isBrowser) {
            return;
        }
        // Note: we listen to events in the capture phase so we can detect them even if the user stops
        // propagation.
        // On keydown record the origin and clear any touch event that may be in progress.
        document.addEventListener('keydown', function () {
            _this._lastTouchTarget = null;
            _this._setOriginForCurrentEventQueue('keyboard');
        }, true);
        // On mousedown record the origin only if there is not touch target, since a mousedown can
        // happen as a result of a touch event.
        document.addEventListener('mousedown', function () {
            if (!_this._lastTouchTarget) {
                _this._setOriginForCurrentEventQueue('mouse');
            }
        }, true);
        // When the touchstart event fires the focus event is not yet in the event queue. This means
        // we can't rely on the trick used above (setting timeout of 0ms). Instead we wait 650ms to
        // see if a focus happens.
        document.addEventListener('touchstart', function (event) {
            if (_this._touchTimeout != null) {
                clearTimeout(_this._touchTimeout);
            }
            _this._lastTouchTarget = event.target;
            _this._touchTimeout = setTimeout(function () { return _this._lastTouchTarget = null; }, TOUCH_BUFFER_MS);
        }, true);
        // Make a note of when the window regains focus, so we can restore the origin info for the
        // focused element.
        window.addEventListener('focus', function () {
            _this._windowFocused = true;
            setTimeout(function () { return _this._windowFocused = false; }, 0);
        });
    };
    /**
     * Sets the focus classes on the element based on the given focus origin.
     * @param {?} element The element to update the classes on.
     * @param {?=} origin The focus origin.
     * @return {?}
     */
    FocusOriginMonitor.prototype._setClasses = function (element, origin) {
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (elementInfo) {
            var /** @type {?} */ toggleClass = function (className, shouldSet) {
                shouldSet ? elementInfo.renderer.addClass(element, className) :
                    elementInfo.renderer.removeClass(element, className);
            };
            toggleClass('cdk-focused', !!origin);
            toggleClass('cdk-touch-focused', origin === 'touch');
            toggleClass('cdk-keyboard-focused', origin === 'keyboard');
            toggleClass('cdk-mouse-focused', origin === 'mouse');
            toggleClass('cdk-program-focused', origin === 'program');
        }
    };
    /**
     * Sets the origin and schedules an async function to clear it at the end of the event queue.
     * @param {?} origin The origin to set.
     * @return {?}
     */
    FocusOriginMonitor.prototype._setOriginForCurrentEventQueue = function (origin) {
        var _this = this;
        this._origin = origin;
        setTimeout(function () { return _this._origin = null; }, 0);
    };
    /**
     * Checks whether the given focus event was caused by a touchstart event.
     * @param {?} event The focus event to check.
     * @return {?} Whether the event was caused by a touch.
     */
    FocusOriginMonitor.prototype._wasCausedByTouch = function (event) {
        // Note(mmalerba): This implementation is not quite perfect, there is a small edge case.
        // Consider the following dom structure:
        //
        // <div #parent tabindex="0" cdkFocusClasses>
        //   <div #child (click)="#parent.focus()"></div>
        // </div>
        //
        // If the user touches the #child element and the #parent is programmatically focused as a
        // result, this code will still consider it to have been caused by the touch event and will
        // apply the cdk-touch-focused class rather than the cdk-program-focused class. This is a
        // relatively small edge-case that can be worked around by using
        // focusVia(parentEl, renderer,  'program') to focus the parent element.
        //
        // If we decide that we absolutely must handle this case correctly, we can do so by listening
        // for the first focus event after the touchstart, and then the first blur event after that
        // focus event. When that blur event fires we know that whatever follows is not a result of the
        // touchstart.
        var /** @type {?} */ focusTarget = event.target;
        return this._lastTouchTarget instanceof Node && focusTarget instanceof Node &&
            (focusTarget === this._lastTouchTarget || focusTarget.contains(this._lastTouchTarget));
    };
    /**
     * Handles focus events on a registered element.
     * @param {?} event The focus event.
     * @param {?} element The monitored element.
     * @return {?}
     */
    FocusOriginMonitor.prototype._onFocus = function (event, element) {
        // NOTE(mmalerba): We currently set the classes based on the focus origin of the most recent
        // focus event affecting the monitored element. If we want to use the origin of the first event
        // instead we should check for the cdk-focused class here and return if the element already has
        // it. (This only matters for elements that have includesChildren = true).
        // If we are not counting child-element-focus as focused, make sure that the event target is the
        // monitored element itself.
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (!elementInfo || (!elementInfo.checkChildren && element !== event.target)) {
            return;
        }
        // If we couldn't detect a cause for the focus event, it's due to one of three reasons:
        // 1) The window has just regained focus, in which case we want to restore the focused state of
        //    the element from before the window blurred.
        // 2) It was caused by a touch event, in which case we mark the origin as 'touch'.
        // 3) The element was programmatically focused, in which case we should mark the origin as
        //    'program'.
        if (!this._origin) {
            if (this._windowFocused && this._lastFocusOrigin) {
                this._origin = this._lastFocusOrigin;
            }
            else if (this._wasCausedByTouch(event)) {
                this._origin = 'touch';
            }
            else {
                this._origin = 'program';
            }
        }
        this._setClasses(element, this._origin);
        elementInfo.subject.next(this._origin);
        this._lastFocusOrigin = this._origin;
        this._origin = null;
    };
    /**
     * Handles blur events on a registered element.
     * @param {?} event The blur event.
     * @param {?} element The monitored element.
     * @return {?}
     */
    FocusOriginMonitor.prototype._onBlur = function (event, element) {
        // If we are counting child-element-focus as focused, make sure that we aren't just blurring in
        // order to focus another child of the monitored element.
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (!elementInfo || (elementInfo.checkChildren && event.relatedTarget instanceof Node &&
            element.contains(event.relatedTarget))) {
            return;
        }
        this._setClasses(element);
        elementInfo.subject.next(null);
    };
    return FocusOriginMonitor;
}());
FocusOriginMonitor.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
FocusOriginMonitor.ctorParameters = function () { return [
    { type: NgZone, },
    { type: Platform, },
]; };
/**
 * Directive that determines how a particular element was focused (via keyboard, mouse, touch, or
 * programmatically) and adds corresponding classes to the element.
 *
 * There are two variants of this directive:
 * 1) cdkMonitorElementFocus: does not consider an element to be focused if one of its children is
 *    focused.
 * 2) cdkMonitorSubtreeFocus: considers an element focused if it or any of its children are focused.
 */
var CdkMonitorFocus = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _focusOriginMonitor
     * @param {?} renderer
     */
    function CdkMonitorFocus(_elementRef, _focusOriginMonitor, renderer) {
        var _this = this;
        this._elementRef = _elementRef;
        this._focusOriginMonitor = _focusOriginMonitor;
        this.cdkFocusChange = new EventEmitter();
        this._monitorSubscription = this._focusOriginMonitor.monitor(this._elementRef.nativeElement, renderer, this._elementRef.nativeElement.hasAttribute('cdkMonitorSubtreeFocus'))
            .subscribe(function (origin) { return _this.cdkFocusChange.emit(origin); });
    }
    /**
     * @return {?}
     */
    CdkMonitorFocus.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._elementRef.nativeElement);
        this._monitorSubscription.unsubscribe();
    };
    return CdkMonitorFocus;
}());
CdkMonitorFocus.decorators = [
    { type: Directive, args: [{
                selector: '[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]',
            },] },
];
/**
 * @nocollapse
 */
CdkMonitorFocus.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: FocusOriginMonitor, },
    { type: Renderer2, },
]; };
CdkMonitorFocus.propDecorators = {
    'cdkFocusChange': [{ type: Output },],
};
/**
 * \@docs-private
 * @param {?} parentDispatcher
 * @param {?} ngZone
 * @param {?} platform
 * @return {?}
 */
function FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY(parentDispatcher, ngZone, platform) {
    return parentDispatcher || new FocusOriginMonitor(ngZone, platform);
}
/**
 * \@docs-private
 */
var FOCUS_ORIGIN_MONITOR_PROVIDER = {
    // If there is already a FocusOriginMonitor available, use that. Otherwise, provide a new one.
    provide: FocusOriginMonitor,
    deps: [[new Optional(), new SkipSelf(), FocusOriginMonitor], NgZone, Platform],
    useFactory: FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY
};
/**
 * Applies a CSS transform to an element, including browser-prefixed properties.
 * @param {?} element
 * @param {?} transformValue
 * @return {?}
 */
function applyCssTransform(element, transformValue) {
    // It's important to trim the result, because the browser will ignore the set operation
    // if the string contains only whitespace.
    var /** @type {?} */ value = transformValue.trim();
    element.style.transform = value;
    element.style.webkitTransform = value;
}
var StyleModule = (function () {
    function StyleModule() {
    }
    return StyleModule;
}());
StyleModule.decorators = [
    { type: NgModule, args: [{
                imports: [PlatformModule],
                declarations: [CdkMonitorFocus],
                exports: [CdkMonitorFocus],
                providers: [FOCUS_ORIGIN_MONITOR_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
StyleModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var AnimationCurves = (function () {
    function AnimationCurves() {
    }
    return AnimationCurves;
}());
AnimationCurves.STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
AnimationCurves.DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
AnimationCurves.ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
AnimationCurves.SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
/**
 * \@docs-private
 */
var AnimationDurations = (function () {
    function AnimationDurations() {
    }
    return AnimationDurations;
}());
AnimationDurations.COMPLEX = '375ms';
AnimationDurations.ENTERING = '225ms';
AnimationDurations.EXITING = '195ms';
/**
 * Adapts type `D` to be usable as a date by cdk-based components that work with dates.
 * @abstract
 */
var DateAdapter = (function () {
    function DateAdapter() {
    }
    /**
     * Gets the year component of the given date.
     * @abstract
     * @param {?} date The date to extract the year from.
     * @return {?} The year component.
     */
    DateAdapter.prototype.getYear = function (date) { };
    /**
     * Gets the month component of the given date.
     * @abstract
     * @param {?} date The date to extract the month from.
     * @return {?} The month component (0-indexed, 0 = January).
     */
    DateAdapter.prototype.getMonth = function (date) { };
    /**
     * Gets the date of the month component of the given date.
     * @abstract
     * @param {?} date The date to extract the date of the month from.
     * @return {?} The month component (1-indexed, 1 = first of month).
     */
    DateAdapter.prototype.getDate = function (date) { };
    /**
     * Gets the day of the week component of the given date.
     * @abstract
     * @param {?} date The date to extract the day of the week from.
     * @return {?} The month component (0-indexed, 0 = Sunday).
     */
    DateAdapter.prototype.getDayOfWeek = function (date) { };
    /**
     * Gets a list of names for the months.
     * @abstract
     * @param {?} style The naming style (e.g. long = 'January', short = 'Jan', narrow = 'J').
     * @return {?} An ordered list of all month names, starting with January.
     */
    DateAdapter.prototype.getMonthNames = function (style$$1) { };
    /**
     * Gets a list of names for the dates of the month.
     * @abstract
     * @return {?} An ordered list of all date of the month names, starting with '1'.
     */
    DateAdapter.prototype.getDateNames = function () { };
    /**
     * Gets a list of names for the days of the week.
     * @abstract
     * @param {?} style The naming style (e.g. long = 'Sunday', short = 'Sun', narrow = 'S').
     * @return {?} An ordered list of all weekday names, starting with Sunday.
     */
    DateAdapter.prototype.getDayOfWeekNames = function (style$$1) { };
    /**
     * Gets the name for the year of the given date.
     * @abstract
     * @param {?} date The date to get the year name for.
     * @return {?} The name of the given year (e.g. '2017').
     */
    DateAdapter.prototype.getYearName = function (date) { };
    /**
     * Gets the first day of the week.
     * @abstract
     * @return {?} The first day of the week (0-indexed, 0 = Sunday).
     */
    DateAdapter.prototype.getFirstDayOfWeek = function () { };
    /**
     * Gets the number of days in the month of the given date.
     * @abstract
     * @param {?} date The date whose month should be checked.
     * @return {?} The number of days in the month of the given date.
     */
    DateAdapter.prototype.getNumDaysInMonth = function (date) { };
    /**
     * Clones the given date.
     * @abstract
     * @param {?} date The date to clone
     * @return {?} A new date equal to the given date.
     */
    DateAdapter.prototype.clone = function (date) { };
    /**
     * Creates a date with the given year, month, and date. Does not allow over/under-flow of the
     * month and date.
     * @abstract
     * @param {?} year The full year of the date. (e.g. 89 means the year 89, not the year 1989).
     * @param {?} month The month of the date (0-indexed, 0 = January). Must be an integer 0 - 11.
     * @param {?} date The date of month of the date. Must be an integer 1 - length of the given month.
     * @return {?} The new date, or null if invalid.
     */
    DateAdapter.prototype.createDate = function (year, month, date) { };
    /**
     * Gets today's date.
     * @abstract
     * @return {?} Today's date.
     */
    DateAdapter.prototype.today = function () { };
    /**
     * Parses a date from a value.
     * @abstract
     * @param {?} value The value to parse.
     * @param {?} parseFormat The expected format of the value being parsed
     *     (type is implementation-dependent).
     * @return {?} The parsed date.
     */
    DateAdapter.prototype.parse = function (value, parseFormat) { };
    /**
     * Formats a date as a string.
     * @abstract
     * @param {?} date The value to format.
     * @param {?} displayFormat The format to use to display the date as a string.
     * @return {?} The formatted date string.
     */
    DateAdapter.prototype.format = function (date, displayFormat) { };
    /**
     * Adds the given number of years to the date. Years are counted as if flipping 12 pages on the
     * calendar for each year and then finding the closest date in the new month. For example when
     * adding 1 year to Feb 29, 2016, the resulting date will be Feb 28, 2017.
     * @abstract
     * @param {?} date The date to add years to.
     * @param {?} years The number of years to add (may be negative).
     * @return {?} A new date equal to the given one with the specified number of years added.
     */
    DateAdapter.prototype.addCalendarYears = function (date, years) { };
    /**
     * Adds the given number of months to the date. Months are counted as if flipping a page on the
     * calendar for each month and then finding the closest date in the new month. For example when
     * adding 1 month to Jan 31, 2017, the resulting date will be Feb 28, 2017.
     * @abstract
     * @param {?} date The date to add months to.
     * @param {?} months The number of months to add (may be negative).
     * @return {?} A new date equal to the given one with the specified number of months added.
     */
    DateAdapter.prototype.addCalendarMonths = function (date, months) { };
    /**
     * Adds the given number of days to the date. Days are counted as if moving one cell on the
     * calendar for each day.
     * @abstract
     * @param {?} date The date to add days to.
     * @param {?} days The number of days to add (may be negative).
     * @return {?} A new date equal to the given one with the specified number of days added.
     */
    DateAdapter.prototype.addCalendarDays = function (date, days) { };
    /**
     * Gets the RFC 3339 compatible date string (https://tools.ietf.org/html/rfc3339)  for the given
     * date.
     * @abstract
     * @param {?} date The date to get the ISO date string for.
     * @return {?} The ISO date string date string.
     */
    DateAdapter.prototype.getISODateString = function (date) { };
    /**
     * Checks whether the given object is considered a date instance by this DateAdapter.
     * @abstract
     * @param {?} obj The object to check
     * @return {?} Whether the object is a date instance.
     */
    DateAdapter.prototype.isDateInstance = function (obj) { };
    /**
     * Checks whether the given date is valid.
     * @abstract
     * @param {?} date The date to check.
     * @return {?} Whether the date is valid.
     */
    DateAdapter.prototype.isValid = function (date) { };
    /**
     * Sets the locale used for all dates.
     * @param {?} locale The new locale.
     * @return {?}
     */
    DateAdapter.prototype.setLocale = function (locale) {
        this.locale = locale;
    };
    /**
     * Compares two dates.
     * @param {?} first The first date to compare.
     * @param {?} second The second date to compare.
     * @return {?} 0 if the dates are equal, a number less than 0 if the first date is earlier,
     *     a number greater than 0 if the first date is later.
     */
    DateAdapter.prototype.compareDate = function (first$$1, second) {
        return this.getYear(first$$1) - this.getYear(second) ||
            this.getMonth(first$$1) - this.getMonth(second) ||
            this.getDate(first$$1) - this.getDate(second);
    };
    /**
     * Checks if two dates are equal.
     * @param {?} first The first date to check.
     * @param {?} second The second date to check.
     *     Null dates are considered equal to other null dates.
     * @return {?}
     */
    DateAdapter.prototype.sameDate = function (first$$1, second) {
        return first$$1 && second ? !this.compareDate(first$$1, second) : first$$1 == second;
    };
    /**
     * Clamp the given date between min and max dates.
     * @param {?} date The date to clamp.
     * @param {?=} min The minimum value to allow. If null or omitted no min is enforced.
     * @param {?=} max The maximum value to allow. If null or omitted no max is enforced.
     * @return {?} `min` if `date` is less than `min`, `max` if date is greater than `max`,
     *     otherwise `date`.
     */
    DateAdapter.prototype.clampDate = function (date, min, max) {
        if (min && this.compareDate(date, min) < 0) {
            return min;
        }
        if (max && this.compareDate(date, max) > 0) {
            return max;
        }
        return date;
    };
    return DateAdapter;
}());
/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param {?} dest The object which will have properties copied to it.
 * @param {...?} sources The source objects from which properties will be copied.
 * @return {?}
 */
function extendObject(dest) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (dest == null) {
        throw TypeError('Cannot convert undefined or null to object');
    }
    for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
        var source = sources_1[_a];
        if (source != null) {
            for (var /** @type {?} */ key in source) {
                if (source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}
/**
 * Whether the browser supports the Intl API.
 */
var SUPPORTS_INTL_API = typeof Intl != 'undefined';
/**
 * The default month names to use if Intl API is not available.
 */
var DEFAULT_MONTH_NAMES = {
    'long': [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'
    ],
    'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
};
/**
 * The default date names to use if Intl API is not available.
 */
var DEFAULT_DATE_NAMES = range(31, function (i) { return String(i + 1); });
/**
 * The default day of the week names to use if Intl API is not available.
 */
var DEFAULT_DAY_OF_WEEK_NAMES = {
    'long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};
/**
 * Creates an array and fills it with values.
 * @template T
 * @param {?} length
 * @param {?} valueFunction
 * @return {?}
 */
function range(length, valueFunction) {
    var /** @type {?} */ valuesArray = Array(length);
    for (var /** @type {?} */ i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}
/**
 * Adapts the native JS Date for use with cdk-based components that work with dates.
 */
var NativeDateAdapter = (function (_super) {
    tslib_1.__extends(NativeDateAdapter, _super);
    /**
     * @param {?} localeId
     */
    function NativeDateAdapter(localeId) {
        var _this = _super.call(this) || this;
        /**
         * Whether to use `timeZone: 'utc'` with `Intl.DateTimeFormat` when formatting dates.
         * Without this `Intl.DateTimeFormat` sometimes chooses the wrong timeZone, which can throw off
         * the result. (e.g. in the en-US locale `new Date(1800, 7, 14).toLocaleDateString()`
         * will produce `'8/13/1800'`.
         */
        _this.useUtcForDisplay = true;
        _super.prototype.setLocale.call(_this, localeId);
        return _this;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getYear = function (date) {
        return date.getFullYear();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getMonth = function (date) {
        return date.getMonth();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getDate = function (date) {
        return date.getDate();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getDayOfWeek = function (date) {
        return date.getDay();
    };
    /**
     * @param {?} style
     * @return {?}
     */
    NativeDateAdapter.prototype.getMonthNames = function (style$$1) {
        var _this = this;
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf_1 = new Intl.DateTimeFormat(this.locale, { month: style$$1 });
            return range(12, function (i) { return _this._stripDirectionalityCharacters(dtf_1.format(new Date(2017, i, 1))); });
        }
        return DEFAULT_MONTH_NAMES[style$$1];
    };
    /**
     * @return {?}
     */
    NativeDateAdapter.prototype.getDateNames = function () {
        var _this = this;
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf_2 = new Intl.DateTimeFormat(this.locale, { day: 'numeric' });
            return range(31, function (i) { return _this._stripDirectionalityCharacters(dtf_2.format(new Date(2017, 0, i + 1))); });
        }
        return DEFAULT_DATE_NAMES;
    };
    /**
     * @param {?} style
     * @return {?}
     */
    NativeDateAdapter.prototype.getDayOfWeekNames = function (style$$1) {
        var _this = this;
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf_3 = new Intl.DateTimeFormat(this.locale, { weekday: style$$1 });
            return range(7, function (i) { return _this._stripDirectionalityCharacters(dtf_3.format(new Date(2017, 0, i + 1))); });
        }
        return DEFAULT_DAY_OF_WEEK_NAMES[style$$1];
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getYearName = function (date) {
        if (SUPPORTS_INTL_API) {
            var /** @type {?} */ dtf = new Intl.DateTimeFormat(this.locale, { year: 'numeric' });
            return this._stripDirectionalityCharacters(dtf.format(date));
        }
        return String(this.getYear(date));
    };
    /**
     * @return {?}
     */
    NativeDateAdapter.prototype.getFirstDayOfWeek = function () {
        // We can't tell using native JS Date what the first day of the week is, we default to Sunday.
        return 0;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getNumDaysInMonth = function (date) {
        return this.getDate(this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0));
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.clone = function (date) {
        return this.createDate(this.getYear(date), this.getMonth(date), this.getDate(date));
    };
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.createDate = function (year, month, date) {
        // Check for invalid month and date (except upper bound on date which we have to check after
        // creating the Date).
        if (month < 0 || month > 11) {
            throw Error("Invalid month index \"" + month + "\". Month index has to be between 0 and 11.");
        }
        if (date < 1) {
            throw Error("Invalid date \"" + date + "\". Date has to be greater than 0.");
        }
        var /** @type {?} */ result = this._createDateWithOverflow(year, month, date);
        // Check that the date wasn't above the upper bound for the month, causing the month to overflow
        if (result.getMonth() != month) {
            throw Error("Invalid date \"" + date + "\" for month with index \"" + month + "\".");
        }
        return result;
    };
    /**
     * @return {?}
     */
    NativeDateAdapter.prototype.today = function () {
        return new Date();
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NativeDateAdapter.prototype.parse = function (value) {
        // We have no way using the native JS Date to set the parse format or locale, so we ignore these
        // parameters.
        if (typeof value == 'number') {
            return new Date(value);
        }
        return value ? new Date(Date.parse(value)) : null;
    };
    /**
     * @param {?} date
     * @param {?} displayFormat
     * @return {?}
     */
    NativeDateAdapter.prototype.format = function (date, displayFormat) {
        if (!this.isValid(date)) {
            throw Error('NativeDateAdapter: Cannot format invalid date.');
        }
        if (SUPPORTS_INTL_API) {
            if (this.useUtcForDisplay) {
                date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
                displayFormat = extendObject({}, displayFormat, { timeZone: 'utc' });
            }
            var /** @type {?} */ dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
            return this._stripDirectionalityCharacters(dtf.format(date));
        }
        return this._stripDirectionalityCharacters(date.toDateString());
    };
    /**
     * @param {?} date
     * @param {?} years
     * @return {?}
     */
    NativeDateAdapter.prototype.addCalendarYears = function (date, years) {
        return this.addCalendarMonths(date, years * 12);
    };
    /**
     * @param {?} date
     * @param {?} months
     * @return {?}
     */
    NativeDateAdapter.prototype.addCalendarMonths = function (date, months) {
        var /** @type {?} */ newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));
        // It's possible to wind up in the wrong month if the original month has more days than the new
        // month. In this case we want to go to the last day of the desired month.
        // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
        // guarantee this.
        if (this.getMonth(newDate) != ((this.getMonth(date) + months) % 12 + 12) % 12) {
            newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
        }
        return newDate;
    };
    /**
     * @param {?} date
     * @param {?} days
     * @return {?}
     */
    NativeDateAdapter.prototype.addCalendarDays = function (date, days) {
        return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.getISODateString = function (date) {
        return [
            date.getUTCFullYear(),
            this._2digit(date.getUTCMonth() + 1),
            this._2digit(date.getUTCDate())
        ].join('-');
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    NativeDateAdapter.prototype.isDateInstance = function (obj) {
        return obj instanceof Date;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype.isValid = function (date) {
        return !isNaN(date.getTime());
    };
    /**
     * Creates a date but allows the month and date to overflow.
     * @param {?} year
     * @param {?} month
     * @param {?} date
     * @return {?}
     */
    NativeDateAdapter.prototype._createDateWithOverflow = function (year, month, date) {
        var /** @type {?} */ result = new Date(year, month, date);
        // We need to correct for the fact that JS native Date treats years in range [0, 99] as
        // abbreviations for 19xx.
        if (year >= 0 && year < 100) {
            result.setFullYear(this.getYear(result) - 1900);
        }
        return result;
    };
    /**
     * Pads a number to make it two digits.
     * @param {?} n The number to pad.
     * @return {?} The padded number.
     */
    NativeDateAdapter.prototype._2digit = function (n) {
        return ('00' + n).slice(-2);
    };
    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     * @param {?} str The string to strip direction characters from.
     * @return {?} The stripped string.
     */
    NativeDateAdapter.prototype._stripDirectionalityCharacters = function (str) {
        return str.replace(/[\u200e\u200f]/g, '');
    };
    return NativeDateAdapter;
}(DateAdapter));
NativeDateAdapter.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NativeDateAdapter.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [LOCALE_ID,] },] },
]; };
var MD_DATE_FORMATS = new InjectionToken('md-date-formats');
var MD_NATIVE_DATE_FORMATS = {
    parse: {
        dateInput: null,
    },
    display: {
        dateInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};
var NativeDateModule = (function () {
    function NativeDateModule() {
    }
    return NativeDateModule;
}());
NativeDateModule.decorators = [
    { type: NgModule, args: [{
                providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }],
            },] },
];
/**
 * @nocollapse
 */
NativeDateModule.ctorParameters = function () { return []; };
var MdNativeDateModule = (function () {
    function MdNativeDateModule() {
    }
    return MdNativeDateModule;
}());
MdNativeDateModule.decorators = [
    { type: NgModule, args: [{
                imports: [NativeDateModule],
                providers: [{ provide: MD_DATE_FORMATS, useValue: MD_NATIVE_DATE_FORMATS }],
            },] },
];
/**
 * @nocollapse
 */
MdNativeDateModule.ctorParameters = function () { return []; };
/**
 * InjectionToken that can be used to specify the global placeholder options.
 */
var MD_PLACEHOLDER_GLOBAL_OPTIONS = new InjectionToken('md-placeholder-global-options');
/**
 * Injection token that can be used to specify the global error options.
 */
var MD_ERROR_GLOBAL_OPTIONS = new InjectionToken('md-error-global-options');
/**
 * Returns whether control is invalid and is either touched or is a part of a submitted form.
 * @param {?} control
 * @param {?} form
 * @return {?}
 */
function defaultErrorStateMatcher(control, form) {
    var /** @type {?} */ isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.touched || isSubmitted));
}
/**
 * Returns whether control is invalid and is either dirty or is a part of a submitted form.
 * @param {?} control
 * @param {?} form
 * @return {?}
 */
function showOnDirtyErrorStateMatcher(control, form) {
    var /** @type {?} */ isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.dirty || isSubmitted));
}
/**
 * @deprecated
 */
var MdCoreModule = (function () {
    function MdCoreModule() {
    }
    return MdCoreModule;
}());
MdCoreModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    MdLineModule,
                    BidiModule,
                    MdRippleModule,
                    ObserversModule,
                    PortalModule,
                    OverlayModule,
                    A11yModule,
                    MdOptionModule,
                    MdPseudoCheckboxModule,
                ],
                exports: [
                    MdLineModule,
                    BidiModule,
                    MdRippleModule,
                    ObserversModule,
                    PortalModule,
                    OverlayModule,
                    A11yModule,
                    MdOptionModule,
                    MdPseudoCheckboxModule,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdCoreModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var MdButtonToggleGroupBase = (function () {
    function MdButtonToggleGroupBase() {
    }
    return MdButtonToggleGroupBase;
}());
var _MdButtonToggleGroupMixinBase = mixinDisabled(MdButtonToggleGroupBase);
/**
 * Provider Expression that allows md-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * \@docs-private
 */
var MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdButtonToggleGroup; }),
    multi: true
};
var _uniqueIdCounter$1 = 0;
/**
 * Change event object emitted by MdButtonToggle.
 */
var MdButtonToggleChange = (function () {
    function MdButtonToggleChange() {
    }
    return MdButtonToggleChange;
}());
/**
 * Exclusive selection button toggle group that behaves like a radio-button group.
 */
var MdButtonToggleGroup = (function (_super) {
    tslib_1.__extends(MdButtonToggleGroup, _super);
    /**
     * @param {?} _changeDetector
     */
    function MdButtonToggleGroup(_changeDetector) {
        var _this = _super.call(this) || this;
        _this._changeDetector = _changeDetector;
        /**
         * The value for the button toggle group. Should match currently selected button toggle.
         */
        _this._value = null;
        /**
         * The HTML name attribute applied to toggles in this group.
         */
        _this._name = "md-button-toggle-group-" + _uniqueIdCounter$1++;
        /**
         * Whether the button toggle group should be vertical.
         */
        _this._vertical = false;
        /**
         * The currently selected button toggle, should match the value.
         */
        _this._selected = null;
        /**
         * The method to be called in order to update ngModel.
         * Now `ngModel` binding is not supported in multiple selection mode.
         */
        _this._controlValueAccessorChangeFn = function () { };
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         */
        _this.onTouched = function () { };
        /**
         * Event emitted when the group's value changes.
         */
        _this.change = new EventEmitter();
        return _this;
    }
    Object.defineProperty(MdButtonToggleGroup.prototype, "name", {
        /**
         * `name` attribute for the underlying `input` element.
         * @return {?}
         */
        get: function () {
            return this._name;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._name = value;
            this._updateButtonToggleNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "vertical", {
        /**
         * Whether the toggle group is vertical.
         * @return {?}
         */
        get: function () {
            return this._vertical;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "value", {
        /**
         * Value of the toggle group.
         * @return {?}
         */
        get: function () {
            return this._value;
        },
        /**
         * @param {?} newValue
         * @return {?}
         */
        set: function (newValue) {
            if (this._value != newValue) {
                this._value = newValue;
                this._updateSelectedButtonToggleFromValue();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "selected", {
        /**
         * Whether the toggle group is selected.
         * @return {?}
         */
        get: function () {
            return this._selected;
        },
        /**
         * @param {?} selected
         * @return {?}
         */
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            if (selected && !selected.checked) {
                selected.checked = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdButtonToggleGroup.prototype._updateButtonToggleNames = function () {
        var _this = this;
        if (this._buttonToggles) {
            this._buttonToggles.forEach(function (toggle) {
                toggle.name = _this._name;
            });
        }
    };
    /**
     * @return {?}
     */
    MdButtonToggleGroup.prototype._updateSelectedButtonToggleFromValue = function () {
        var _this = this;
        var /** @type {?} */ isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._buttonToggles != null && !isAlreadySelected) {
            var /** @type {?} */ matchingButtonToggle = this._buttonToggles.filter(function (buttonToggle) { return buttonToggle.value == _this._value; })[0];
            if (matchingButtonToggle) {
                this.selected = matchingButtonToggle;
            }
            else if (this.value == null) {
                this.selected = null;
                this._buttonToggles.forEach(function (buttonToggle) {
                    buttonToggle.checked = false;
                });
            }
        }
    };
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    MdButtonToggleGroup.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdButtonToggleChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value Value to be set to the model.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.writeValue = function (value) {
        this.value = value;
        this._changeDetector.markForCheck();
    };
    /**
     * Registers a callback that will be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On change callback function.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback that will be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn On touch callback function.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Toggles the disabled state of the component. Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled Whether the component should be disabled.
     * @return {?}
     */
    MdButtonToggleGroup.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    return MdButtonToggleGroup;
}(_MdButtonToggleGroupMixinBase));
MdButtonToggleGroup.decorators = [
    { type: Directive, args: [{
                selector: 'md-button-toggle-group:not([multiple]), mat-button-toggle-group:not([multiple])',
                providers: [MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR],
                inputs: ['disabled'],
                host: {
                    'role': 'radiogroup',
                    'class': 'mat-button-toggle-group',
                    '[class.mat-button-toggle-vertical]': 'vertical'
                },
                exportAs: 'mdButtonToggleGroup',
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggleGroup.ctorParameters = function () { return [
    { type: ChangeDetectorRef, },
]; };
MdButtonToggleGroup.propDecorators = {
    '_buttonToggles': [{ type: ContentChildren, args: [forwardRef(function () { return MdButtonToggle; }),] },],
    'name': [{ type: Input },],
    'vertical': [{ type: Input },],
    'value': [{ type: Input },],
    'selected': [{ type: Input },],
    'change': [{ type: Output },],
};
/**
 * Multiple selection button-toggle group. `ngModel` is not supported in this mode.
 */
var MdButtonToggleGroupMultiple = (function (_super) {
    tslib_1.__extends(MdButtonToggleGroupMultiple, _super);
    function MdButtonToggleGroupMultiple() {
        var _this = _super.apply(this, arguments) || this;
        /**
         * Whether the button toggle group should be vertical.
         */
        _this._vertical = false;
        return _this;
    }
    Object.defineProperty(MdButtonToggleGroupMultiple.prototype, "vertical", {
        /**
         * Whether the toggle group is vertical.
         * @return {?}
         */
        get: function () {
            return this._vertical;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    return MdButtonToggleGroupMultiple;
}(_MdButtonToggleGroupMixinBase));
MdButtonToggleGroupMultiple.decorators = [
    { type: Directive, args: [{
                selector: 'md-button-toggle-group[multiple], mat-button-toggle-group[multiple]',
                exportAs: 'mdButtonToggleGroup',
                inputs: ['disabled'],
                host: {
                    'class': 'mat-button-toggle-group',
                    '[class.mat-button-toggle-vertical]': 'vertical',
                    'role': 'group'
                }
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggleGroupMultiple.ctorParameters = function () { return []; };
MdButtonToggleGroupMultiple.propDecorators = {
    'vertical': [{ type: Input },],
};
/**
 * Single button inside of a toggle group.
 */
var MdButtonToggle = (function () {
    /**
     * @param {?} toggleGroup
     * @param {?} toggleGroupMultiple
     * @param {?} _changeDetectorRef
     * @param {?} _buttonToggleDispatcher
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _focusOriginMonitor
     */
    function MdButtonToggle(toggleGroup, toggleGroupMultiple, _changeDetectorRef, _buttonToggleDispatcher, _renderer, _elementRef, _focusOriginMonitor) {
        var _this = this;
        this._changeDetectorRef = _changeDetectorRef;
        this._buttonToggleDispatcher = _buttonToggleDispatcher;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._focusOriginMonitor = _focusOriginMonitor;
        /**
         * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
         * take precedence so this may be omitted.
         */
        this.ariaLabel = '';
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        this.ariaLabelledby = null;
        /**
         * Whether or not this button toggle is checked.
         */
        this._checked = false;
        /**
         * Whether or not this button toggle is disabled.
         */
        this._disabled = false;
        /**
         * Value assigned to this button toggle.
         */
        this._value = null;
        /**
         * Whether or not the button toggle is a single selection.
         */
        this._isSingleSelector = false;
        /**
         * Unregister function for _buttonToggleDispatcher *
         */
        this._removeUniqueSelectionListener = function () { };
        /**
         * Event emitted when the group value changes.
         */
        this.change = new EventEmitter();
        this.buttonToggleGroup = toggleGroup;
        this.buttonToggleGroupMultiple = toggleGroupMultiple;
        if (this.buttonToggleGroup) {
            this._removeUniqueSelectionListener =
                _buttonToggleDispatcher.listen(function (id, name) {
                    if (id != _this.id && name == _this.name) {
                        _this.checked = false;
                        _this._changeDetectorRef.markForCheck();
                    }
                });
            this._type = 'radio';
            this.name = this.buttonToggleGroup.name;
            this._isSingleSelector = true;
        }
        else {
            // Even if there is no group at all, treat the button toggle as a checkbox so it can be
            // toggled on or off.
            this._type = 'checkbox';
            this._isSingleSelector = false;
        }
    }
    Object.defineProperty(MdButtonToggle.prototype, "inputId", {
        /**
         * Unique ID for the underlying `input` element.
         * @return {?}
         */
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "checked", {
        /**
         * Whether the button is checked.
         * @return {?}
         */
        get: function () { return this._checked; },
        /**
         * @param {?} newCheckedState
         * @return {?}
         */
        set: function (newCheckedState) {
            if (this._isSingleSelector && newCheckedState) {
                // Notify all button toggles with the same name (in the same group) to un-check.
                this._buttonToggleDispatcher.notify(this.id, this.name);
                this._changeDetectorRef.markForCheck();
            }
            this._checked = newCheckedState;
            if (newCheckedState && this._isSingleSelector && this.buttonToggleGroup.value != this.value) {
                this.buttonToggleGroup.selected = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "value", {
        /**
         * MdButtonToggleGroup reads this to assign its own value.
         * @return {?}
         */
        get: function () {
            return this._value;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._value != value) {
                if (this.buttonToggleGroup != null && this.checked) {
                    this.buttonToggleGroup.value = value;
                }
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "disabled", {
        /**
         * Whether the button is disabled.
         * @return {?}
         */
        get: function () {
            return this._disabled || (this.buttonToggleGroup != null && this.buttonToggleGroup.disabled) ||
                (this.buttonToggleGroupMultiple != null && this.buttonToggleGroupMultiple.disabled);
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdButtonToggle.prototype.ngOnInit = function () {
        if (this.id == null) {
            this.id = "md-button-toggle-" + _uniqueIdCounter$1++;
        }
        if (this.buttonToggleGroup && this._value == this.buttonToggleGroup.value) {
            this._checked = true;
        }
        this._focusOriginMonitor.monitor(this._elementRef.nativeElement, this._renderer, true);
    };
    /**
     * Focuses the button.
     * @return {?}
     */
    MdButtonToggle.prototype.focus = function () {
        this._inputElement.nativeElement.focus();
    };
    /**
     * Toggle the state of the current button toggle.
     * @return {?}
     */
    MdButtonToggle.prototype._toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Checks the button toggle due to an interaction with the underlying native input.
     * @param {?} event
     * @return {?}
     */
    MdButtonToggle.prototype._onInputChange = function (event) {
        event.stopPropagation();
        if (this._isSingleSelector) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button toggle as checked.
            var /** @type {?} */ groupValueChanged = this.buttonToggleGroup.selected != this;
            this.checked = true;
            this.buttonToggleGroup.selected = this;
            this.buttonToggleGroup.onTouched();
            if (groupValueChanged) {
                this.buttonToggleGroup._emitChangeEvent();
            }
        }
        else {
            this._toggle();
        }
        // Emit a change event when the native input does.
        this._emitChangeEvent();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdButtonToggle.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Dispatch change event with current value.
     * @return {?}
     */
    MdButtonToggle.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdButtonToggleChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    };
    /**
     * @return {?}
     */
    MdButtonToggle.prototype.ngOnDestroy = function () {
        this._removeUniqueSelectionListener();
    };
    return MdButtonToggle;
}());
MdButtonToggle.decorators = [
    { type: Component, args: [{ selector: 'md-button-toggle, mat-button-toggle',
                template: "<label [attr.for]=\"inputId\" class=\"mat-button-toggle-label\"><input #input class=\"mat-button-toggle-input cdk-visually-hidden\" [type]=\"_type\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled || null\" [name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onInputChange($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-button-toggle-label-content\"><ng-content></ng-content></div></label><div class=\"mat-button-toggle-focus-overlay\"></div>",
                styles: [".mat-button-toggle-group,.mat-button-toggle-standalone{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);position:relative;display:inline-flex;flex-direction:row;border-radius:2px;cursor:pointer;white-space:nowrap}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle-disabled .mat-button-toggle-label-content{cursor:default}.mat-button-toggle{white-space:nowrap;position:relative}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:1}.mat-button-toggle-label-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:inline-block;line-height:36px;padding:0 16px;cursor:pointer}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{border-radius:inherit;pointer-events:none;opacity:0;top:0;left:0;right:0;bottom:0;position:absolute}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    '[class.mat-button-toggle-standalone]': '!buttonToggleGroup && !buttonToggleGroupMultiple',
                    '[class.mat-button-toggle-checked]': 'checked',
                    '[class.mat-button-toggle-disabled]': 'disabled',
                    'class': 'mat-button-toggle',
                    '[attr.id]': 'id',
                }
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggle.ctorParameters = function () { return [
    { type: MdButtonToggleGroup, decorators: [{ type: Optional },] },
    { type: MdButtonToggleGroupMultiple, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
    { type: UniqueSelectionDispatcher, },
    { type: Renderer2, },
    { type: ElementRef, },
    { type: FocusOriginMonitor, },
]; };
MdButtonToggle.propDecorators = {
    'ariaLabel': [{ type: Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: Input, args: ['aria-labelledby',] },],
    '_inputElement': [{ type: ViewChild, args: ['input',] },],
    'id': [{ type: Input },],
    'name': [{ type: Input },],
    'checked': [{ type: Input },],
    'value': [{ type: Input },],
    'disabled': [{ type: Input },],
    'change': [{ type: Output },],
};
var MdButtonToggleModule = (function () {
    function MdButtonToggleModule() {
    }
    return MdButtonToggleModule;
}());
MdButtonToggleModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule, StyleModule],
                exports: [
                    MdButtonToggleGroup,
                    MdButtonToggleGroupMultiple,
                    MdButtonToggle,
                    MdCommonModule,
                ],
                declarations: [MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle],
                providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MdButtonToggleModule.ctorParameters = function () { return []; };
/**
 * Mixin to augment a directive with a `color` property.
 * @template T
 * @param {?} base
 * @param {?=} defaultColor
 * @return {?}
 */
function mixinColor(base, defaultColor) {
    return (function (_super) {
        tslib_1.__extends(class_2, _super);
        /**
         * @param {...?} args
         */
        function class_2() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            // Set the default color that can be specified from the mixin.
            _this.color = defaultColor;
            return _this;
        }
        Object.defineProperty(class_2.prototype, "color", {
            /**
             * @return {?}
             */
            get: function () { return this._color; },
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) {
                var /** @type {?} */ colorPalette = value || defaultColor;
                if (colorPalette !== this._color) {
                    if (this._color) {
                        this._renderer.removeClass(this._elementRef.nativeElement, "mat-" + this._color);
                    }
                    if (colorPalette) {
                        this._renderer.addClass(this._elementRef.nativeElement, "mat-" + colorPalette);
                    }
                    this._color = colorPalette;
                }
            },
            enumerable: true,
            configurable: true
        });
        return class_2;
    }(base));
}
/**
 * Mixin to augment a directive with a `disableRipple` property.
 * @template T
 * @param {?} base
 * @return {?}
 */
function mixinDisableRipple(base) {
    return (function (_super) {
        tslib_1.__extends(class_3, _super);
        /**
         * @param {...?} args
         */
        function class_3() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this._disableRipple = false;
            return _this;
        }
        Object.defineProperty(class_3.prototype, "disableRipple", {
            /**
             * Whether the ripple effect is disabled or not.
             * @return {?}
             */
            get: function () { return this._disableRipple; },
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) { this._disableRipple = coerceBooleanProperty(value); },
            enumerable: true,
            configurable: true
        });
        return class_3;
    }(base));
}
/**
 * Default color palette for round buttons (md-fab and md-mini-fab)
 */
var DEFAULT_ROUND_BUTTON_COLOR = 'accent';
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdButtonCssMatStyler = (function () {
    function MdButtonCssMatStyler() {
    }
    return MdButtonCssMatStyler;
}());
MdButtonCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'button[md-button], button[mat-button], a[md-button], a[mat-button]',
                host: { 'class': 'mat-button' }
            },] },
];
/**
 * @nocollapse
 */
MdButtonCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdRaisedButtonCssMatStyler = (function () {
    function MdRaisedButtonCssMatStyler() {
    }
    return MdRaisedButtonCssMatStyler;
}());
MdRaisedButtonCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'button[md-raised-button], button[mat-raised-button], ' +
                    'a[md-raised-button], a[mat-raised-button]',
                host: { 'class': 'mat-raised-button' }
            },] },
];
/**
 * @nocollapse
 */
MdRaisedButtonCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdIconButtonCssMatStyler = (function () {
    function MdIconButtonCssMatStyler() {
    }
    return MdIconButtonCssMatStyler;
}());
MdIconButtonCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'button[md-icon-button], button[mat-icon-button], a[md-icon-button], a[mat-icon-button]',
                host: { 'class': 'mat-icon-button' }
            },] },
];
/**
 * @nocollapse
 */
MdIconButtonCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdFab = (function () {
    /**
     * @param {?} button
     * @param {?} anchor
     */
    function MdFab(button, anchor) {
        // Set the default color palette for the md-fab components.
        (button || anchor).color = DEFAULT_ROUND_BUTTON_COLOR;
    }
    return MdFab;
}());
MdFab.decorators = [
    { type: Directive, args: [{
                selector: 'button[md-fab], button[mat-fab], a[md-fab], a[mat-fab]',
                host: { 'class': 'mat-fab' }
            },] },
];
/**
 * @nocollapse
 */
MdFab.ctorParameters = function () { return [
    { type: MdButton, decorators: [{ type: Self }, { type: Optional }, { type: Inject, args: [forwardRef(function () { return MdButton; }),] },] },
    { type: MdAnchor, decorators: [{ type: Self }, { type: Optional }, { type: Inject, args: [forwardRef(function () { return MdAnchor; }),] },] },
]; };
/**
 * Directive that targets mini-fab buttons and anchors. It's used to apply the `mat-` class
 * to all mini-fab buttons and also is responsible for setting the default color palette.
 * \@docs-private
 */
var MdMiniFab = (function () {
    /**
     * @param {?} button
     * @param {?} anchor
     */
    function MdMiniFab(button, anchor) {
        // Set the default color palette for the md-mini-fab components.
        (button || anchor).color = DEFAULT_ROUND_BUTTON_COLOR;
    }
    return MdMiniFab;
}());
MdMiniFab.decorators = [
    { type: Directive, args: [{
                selector: 'button[md-mini-fab], button[mat-mini-fab], a[md-mini-fab], a[mat-mini-fab]',
                host: { 'class': 'mat-mini-fab' }
            },] },
];
/**
 * @nocollapse
 */
MdMiniFab.ctorParameters = function () { return [
    { type: MdButton, decorators: [{ type: Self }, { type: Optional }, { type: Inject, args: [forwardRef(function () { return MdButton; }),] },] },
    { type: MdAnchor, decorators: [{ type: Self }, { type: Optional }, { type: Inject, args: [forwardRef(function () { return MdAnchor; }),] },] },
]; };
/**
 * \@docs-private
 */
var MdButtonBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdButtonBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdButtonBase;
}());
var _MdButtonMixinBase = mixinColor(mixinDisabled(mixinDisableRipple(MdButtonBase)));
/**
 * Material design button.
 */
var MdButton = (function (_super) {
    tslib_1.__extends(MdButton, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _platform
     * @param {?} _focusOriginMonitor
     */
    function MdButton(renderer, elementRef, _platform, _focusOriginMonitor) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._platform = _platform;
        _this._focusOriginMonitor = _focusOriginMonitor;
        /**
         * Whether the button is round.
         */
        _this._isRoundButton = _this._hasAttributeWithPrefix('fab', 'mini-fab');
        /**
         * Whether the button is icon button.
         */
        _this._isIconButton = _this._hasAttributeWithPrefix('icon-button');
        _this._focusOriginMonitor.monitor(_this._elementRef.nativeElement, _this._renderer, true);
        return _this;
    }
    /**
     * @return {?}
     */
    MdButton.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._elementRef.nativeElement);
    };
    /**
     * Focuses the button.
     * @return {?}
     */
    MdButton.prototype.focus = function () {
        this._getHostElement().focus();
    };
    /**
     * @return {?}
     */
    MdButton.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    /**
     * @return {?}
     */
    MdButton.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    /**
     * Gets whether the button has one of the given attributes
     * with either an 'md-' or 'mat-' prefix.
     * @param {...?} unprefixedAttributeNames
     * @return {?}
     */
    MdButton.prototype._hasAttributeWithPrefix = function () {
        var _this = this;
        var unprefixedAttributeNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            unprefixedAttributeNames[_i] = arguments[_i];
        }
        // If not on the browser, say that there are none of the attributes present.
        // Since these only affect how the ripple displays (and ripples only happen on the client),
        // detecting these attributes isn't necessary when not on the browser.
        if (!this._platform.isBrowser) {
            return false;
        }
        return unprefixedAttributeNames.some(function (suffix) {
            var /** @type {?} */ el = _this._getHostElement();
            return el.hasAttribute('md-' + suffix) || el.hasAttribute('mat-' + suffix);
        });
    };
    return MdButton;
}(_MdButtonMixinBase));
MdButton.decorators = [
    { type: Component, args: [{ selector: "button[md-button], button[md-raised-button], button[md-icon-button],\n             button[md-fab], button[md-mini-fab],\n             button[mat-button], button[mat-raised-button], button[mat-icon-button],\n             button[mat-fab], button[mat-mini-fab]",
                host: {
                    '[disabled]': 'disabled || null',
                },
                template: "<span class=\"mat-button-wrapper\"><ng-content></ng-content></span><div md-ripple class=\"mat-button-ripple\" [class.mat-button-ripple-round]=\"_isRoundButton || _isIconButton\" [mdRippleDisabled]=\"_isRippleDisabled()\" [mdRippleCentered]=\"_isIconButton\" [mdRippleTrigger]=\"_getHostElement()\"></div><div class=\"mat-button-focus-overlay\"></div>",
                styles: [".mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:88px;line-height:36px;padding:0 16px;border-radius:2px}[disabled].mat-button,[disabled].mat-fab,[disabled].mat-icon-button,[disabled].mat-mini-fab,[disabled].mat-raised-button{cursor:default}.cdk-keyboard-focused.mat-button .mat-button-focus-overlay,.cdk-keyboard-focused.mat-fab .mat-button-focus-overlay,.cdk-keyboard-focused.mat-icon-button .mat-button-focus-overlay,.cdk-keyboard-focused.mat-mini-fab .mat-button-focus-overlay,.cdk-keyboard-focused.mat-raised-button .mat-button-focus-overlay{opacity:1}.mat-button::-moz-focus-inner,.mat-fab::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-mini-fab::-moz-focus-inner,.mat-raised-button::-moz-focus-inner{border:0}.mat-fab,.mat-mini-fab,.mat-raised-button{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transform:translate3d(0,0,0);transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mat-fab:not([disabled]):active,.mat-mini-fab:not([disabled]):active,.mat-raised-button:not([disabled]):active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}[disabled].mat-fab,[disabled].mat-mini-fab,[disabled].mat-raised-button{box-shadow:none}.mat-button .mat-button-focus-overlay,.mat-icon-button .mat-button-focus-overlay{transition:none;opacity:0}.mat-button:hover .mat-button-focus-overlay{opacity:1}.mat-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-fab .mat-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.mat-mini-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.mat-mini-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-mini-fab .mat-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.mat-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.mat-icon-button .mat-icon,.mat-icon-button i{line-height:24px}.mat-button,.mat-icon-button,.mat-raised-button{color:currentColor}.mat-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*{vertical-align:middle}.mat-button-focus-overlay,.mat-button-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-focus-overlay{background-color:rgba(0,0,0,.12);border-radius:inherit;opacity:0;transition:opacity .2s cubic-bezier(.35,0,.25,1),background-color .2s cubic-bezier(.35,0,.25,1)}@media screen and (-ms-high-contrast:active){.mat-button-focus-overlay{background-color:rgba(255,255,255,.5)}}.mat-button-ripple-round{border-radius:50%;z-index:1}@media screen and (-ms-high-contrast:active){.mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{outline:solid 1px}}"],
                inputs: ['disabled', 'disableRipple', 'color'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdButton.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: Platform, },
    { type: FocusOriginMonitor, },
]; };
/**
 * Raised Material design button.
 */
var MdAnchor = (function (_super) {
    tslib_1.__extends(MdAnchor, _super);
    /**
     * @param {?} platform
     * @param {?} focusOriginMonitor
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MdAnchor(platform, focusOriginMonitor, elementRef, renderer) {
        return _super.call(this, renderer, elementRef, platform, focusOriginMonitor) || this;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    MdAnchor.prototype._haltDisabledEvents = function (event) {
        // A disabled button shouldn't apply any actions
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    return MdAnchor;
}(MdButton));
MdAnchor.decorators = [
    { type: Component, args: [{ selector: "a[md-button], a[md-raised-button], a[md-icon-button], a[md-fab], a[md-mini-fab],\n             a[mat-button], a[mat-raised-button], a[mat-icon-button], a[mat-fab], a[mat-mini-fab]",
                host: {
                    '[attr.tabindex]': 'disabled ? -1 : 0',
                    '[attr.disabled]': 'disabled || null',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '(click)': '_haltDisabledEvents($event)',
                },
                inputs: ['disabled', 'disableRipple', 'color'],
                template: "<span class=\"mat-button-wrapper\"><ng-content></ng-content></span><div md-ripple class=\"mat-button-ripple\" [class.mat-button-ripple-round]=\"_isRoundButton || _isIconButton\" [mdRippleDisabled]=\"_isRippleDisabled()\" [mdRippleCentered]=\"_isIconButton\" [mdRippleTrigger]=\"_getHostElement()\"></div><div class=\"mat-button-focus-overlay\"></div>",
                styles: [".mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:88px;line-height:36px;padding:0 16px;border-radius:2px}[disabled].mat-button,[disabled].mat-fab,[disabled].mat-icon-button,[disabled].mat-mini-fab,[disabled].mat-raised-button{cursor:default}.cdk-keyboard-focused.mat-button .mat-button-focus-overlay,.cdk-keyboard-focused.mat-fab .mat-button-focus-overlay,.cdk-keyboard-focused.mat-icon-button .mat-button-focus-overlay,.cdk-keyboard-focused.mat-mini-fab .mat-button-focus-overlay,.cdk-keyboard-focused.mat-raised-button .mat-button-focus-overlay{opacity:1}.mat-button::-moz-focus-inner,.mat-fab::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-mini-fab::-moz-focus-inner,.mat-raised-button::-moz-focus-inner{border:0}.mat-fab,.mat-mini-fab,.mat-raised-button{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transform:translate3d(0,0,0);transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mat-fab:not([disabled]):active,.mat-mini-fab:not([disabled]):active,.mat-raised-button:not([disabled]):active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}[disabled].mat-fab,[disabled].mat-mini-fab,[disabled].mat-raised-button{box-shadow:none}.mat-button .mat-button-focus-overlay,.mat-icon-button .mat-button-focus-overlay{transition:none;opacity:0}.mat-button:hover .mat-button-focus-overlay{opacity:1}.mat-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-fab .mat-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.mat-mini-fab{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.mat-mini-fab:not([disabled]):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-mini-fab .mat-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.mat-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.mat-icon-button .mat-icon,.mat-icon-button i{line-height:24px}.mat-button,.mat-icon-button,.mat-raised-button{color:currentColor}.mat-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*{vertical-align:middle}.mat-button-focus-overlay,.mat-button-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-focus-overlay{background-color:rgba(0,0,0,.12);border-radius:inherit;opacity:0;transition:opacity .2s cubic-bezier(.35,0,.25,1),background-color .2s cubic-bezier(.35,0,.25,1)}@media screen and (-ms-high-contrast:active){.mat-button-focus-overlay{background-color:rgba(255,255,255,.5)}}.mat-button-ripple-round{border-radius:50%;z-index:1}@media screen and (-ms-high-contrast:active){.mat-button,.mat-fab,.mat-icon-button,.mat-mini-fab,.mat-raised-button{outline:solid 1px}}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdAnchor.ctorParameters = function () { return [
    { type: Platform, },
    { type: FocusOriginMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
]; };
var MdButtonModule = (function () {
    function MdButtonModule() {
    }
    return MdButtonModule;
}());
MdButtonModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MdRippleModule,
                    MdCommonModule,
                    StyleModule,
                ],
                exports: [
                    MdButton,
                    MdAnchor,
                    MdMiniFab,
                    MdFab,
                    MdCommonModule,
                    MdButtonCssMatStyler,
                    MdRaisedButtonCssMatStyler,
                    MdIconButtonCssMatStyler,
                ],
                declarations: [
                    MdButton,
                    MdAnchor,
                    MdMiniFab,
                    MdFab,
                    MdButtonCssMatStyler,
                    MdRaisedButtonCssMatStyler,
                    MdIconButtonCssMatStyler,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdButtonModule.ctorParameters = function () { return []; };
// Increasing integer for generating unique ids for checkbox components.
var nextUniqueId = 0;
/**
 * Provider Expression that allows md-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * \@docs-private
 */
var MD_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdCheckbox; }),
    multi: true
};
var TransitionCheckState = {};
TransitionCheckState.Init = 0;
TransitionCheckState.Checked = 1;
TransitionCheckState.Unchecked = 2;
TransitionCheckState.Indeterminate = 3;
TransitionCheckState[TransitionCheckState.Init] = "Init";
TransitionCheckState[TransitionCheckState.Checked] = "Checked";
TransitionCheckState[TransitionCheckState.Unchecked] = "Unchecked";
TransitionCheckState[TransitionCheckState.Indeterminate] = "Indeterminate";
/**
 * Change event object emitted by MdCheckbox.
 */
var MdCheckboxChange = (function () {
    function MdCheckboxChange() {
    }
    return MdCheckboxChange;
}());
/**
 * \@docs-private
 */
var MdCheckboxBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdCheckboxBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdCheckboxBase;
}());
var _MdCheckboxMixinBase = mixinColor(mixinDisableRipple(mixinDisabled(MdCheckboxBase)), 'accent');
/**
 * A material design checkbox component. Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. A MdCheckbox can be either checked, unchecked, indeterminate, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 * See: https://www.google.com/design/spec/components/selection-controls.html
 */
var MdCheckbox = (function (_super) {
    tslib_1.__extends(MdCheckbox, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _changeDetectorRef
     * @param {?} _focusOriginMonitor
     */
    function MdCheckbox(renderer, elementRef, _changeDetectorRef, _focusOriginMonitor) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._focusOriginMonitor = _focusOriginMonitor;
        /**
         * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
         * take precedence so this may be omitted.
         */
        _this.ariaLabel = '';
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        _this.ariaLabelledby = null;
        _this._uniqueId = "md-checkbox-" + ++nextUniqueId;
        /**
         * A unique id for the checkbox input. If none is supplied, it will be auto-generated.
         */
        _this.id = _this._uniqueId;
        /**
         * Whether the label should appear after or before the checkbox. Defaults to 'after'
         */
        _this.labelPosition = 'after';
        /**
         * Tabindex value that is passed to the underlying input element.
         */
        _this.tabIndex = 0;
        /**
         * Name value will be applied to the input element if present
         */
        _this.name = null;
        /**
         * Event emitted when the checkbox's `checked` value changes.
         */
        _this.change = new EventEmitter();
        /**
         * Event emitted when the checkbox's `indeterminate` value changes.
         */
        _this.indeterminateChange = new EventEmitter();
        /**
         * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
         * \@docs-private
         */
        _this.onTouched = function () { };
        _this._currentAnimationClass = '';
        _this._currentCheckState = TransitionCheckState.Init;
        _this._checked = false;
        _this._indeterminate = false;
        _this._controlValueAccessorChangeFn = function () { };
        return _this;
    }
    Object.defineProperty(MdCheckbox.prototype, "inputId", {
        /**
         * Returns the unique id for the visual hidden input.
         * @return {?}
         */
        get: function () { return (this.id || this._uniqueId) + "-input"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "required", {
        /**
         * Whether the checkbox is required.
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "align", {
        /**
         * Whether or not the checkbox should appear before or after the label.
         * @deprecated
         * @return {?}
         */
        get: function () {
            // align refers to the checkbox relative to the label, while labelPosition refers to the
            // label relative to the checkbox. As such, they are inverted.
            return this.labelPosition == 'after' ? 'start' : 'end';
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.labelPosition = (v == 'start') ? 'after' : 'before';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdCheckbox.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._focusOriginMonitor
            .monitor(this._inputElement.nativeElement, this._renderer, false)
            .subscribe(function (focusOrigin) { return _this._onInputFocusChange(focusOrigin); });
    };
    /**
     * @return {?}
     */
    MdCheckbox.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._inputElement.nativeElement);
    };
    Object.defineProperty(MdCheckbox.prototype, "checked", {
        /**
         * Whether the checkbox is checked.
         * @return {?}
         */
        get: function () {
            return this._checked;
        },
        /**
         * @param {?} checked
         * @return {?}
         */
        set: function (checked) {
            if (checked != this.checked) {
                this._checked = checked;
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "indeterminate", {
        /**
         * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
         * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
         * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
         * set to false.
         * @return {?}
         */
        get: function () {
            return this._indeterminate;
        },
        /**
         * @param {?} indeterminate
         * @return {?}
         */
        set: function (indeterminate) {
            var /** @type {?} */ changed = indeterminate != this._indeterminate;
            this._indeterminate = indeterminate;
            if (changed) {
                if (this._indeterminate) {
                    this._transitionCheckState(TransitionCheckState.Indeterminate);
                }
                else {
                    this._transitionCheckState(this.checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
                }
                this.indeterminateChange.emit(this._indeterminate);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdCheckbox.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    /**
     * Method being called whenever the label text changes.
     * @return {?}
     */
    MdCheckbox.prototype._onLabelTextChange = function () {
        // This method is getting called whenever the label of the checkbox changes.
        // Since the checkbox uses the OnPush strategy we need to notify it about the change
        // that has been recognized by the cdkObserveContent directive.
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value Value to be set to the model.
     * @return {?}
     */
    MdCheckbox.prototype.writeValue = function (value) {
        this.checked = !!value;
    };
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Function to be called on change.
     * @return {?}
     */
    MdCheckbox.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback to be triggered when the control has been touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be triggered when the checkbox is touched.
     * @return {?}
     */
    MdCheckbox.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Sets the checkbox's disabled state. Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled Whether the checkbox should be disabled.
     * @return {?}
     */
    MdCheckbox.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    };
    /**
     * @param {?} newState
     * @return {?}
     */
    MdCheckbox.prototype._transitionCheckState = function (newState) {
        var /** @type {?} */ oldState = this._currentCheckState;
        var /** @type {?} */ renderer = this._renderer;
        var /** @type {?} */ elementRef = this._elementRef;
        if (oldState === newState) {
            return;
        }
        if (this._currentAnimationClass.length > 0) {
            renderer.removeClass(elementRef.nativeElement, this._currentAnimationClass);
        }
        this._currentAnimationClass = this._getAnimationClassForCheckStateTransition(oldState, newState);
        this._currentCheckState = newState;
        if (this._currentAnimationClass.length > 0) {
            renderer.addClass(elementRef.nativeElement, this._currentAnimationClass);
        }
    };
    /**
     * @return {?}
     */
    MdCheckbox.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdCheckboxChange();
        event.source = this;
        event.checked = this.checked;
        this._controlValueAccessorChangeFn(this.checked);
        this.change.emit(event);
    };
    /**
     * Function is called whenever the focus changes for the input element.
     * @param {?} focusOrigin
     * @return {?}
     */
    MdCheckbox.prototype._onInputFocusChange = function (focusOrigin) {
        if (!this._focusRipple && focusOrigin === 'keyboard') {
            this._focusRipple = this._ripple.launch(0, 0, { persistent: true, centered: true });
        }
        else if (!focusOrigin) {
            this._removeFocusRipple();
            this.onTouched();
        }
    };
    /**
     * Toggles the `checked` state of the checkbox.
     * @return {?}
     */
    MdCheckbox.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Event handler for checkbox input element.
     * Toggles checked state if element is not disabled.
     * Do not toggle on (change) event since IE doesn't fire change event when
     *   indeterminate checkbox is clicked.
     * @param {?} event
     * @return {?}
     */
    MdCheckbox.prototype._onInputClick = function (event) {
        var _this = this;
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `checkbox` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
        this._removeFocusRipple();
        if (!this.disabled) {
            // When user manually click on the checkbox, `indeterminate` is set to false.
            if (this._indeterminate) {
                Promise.resolve().then(function () {
                    _this._indeterminate = false;
                    _this.indeterminateChange.emit(_this._indeterminate);
                });
            }
            this.toggle();
            this._transitionCheckState(this._checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this._emitChangeEvent();
        }
    };
    /**
     * Focuses the checkbox.
     * @return {?}
     */
    MdCheckbox.prototype.focus = function () {
        this._focusOriginMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdCheckbox.prototype._onInteractionEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
    };
    /**
     * @param {?} oldState
     * @param {?} newState
     * @return {?}
     */
    MdCheckbox.prototype._getAnimationClassForCheckStateTransition = function (oldState, newState) {
        var /** @type {?} */ animSuffix = '';
        switch (oldState) {
            case TransitionCheckState.Init:
                // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
                // [checked] bound to it.
                if (newState === TransitionCheckState.Checked) {
                    animSuffix = 'unchecked-checked';
                }
                else if (newState == TransitionCheckState.Indeterminate) {
                    animSuffix = 'unchecked-indeterminate';
                }
                else {
                    return '';
                }
                break;
            case TransitionCheckState.Unchecked:
                animSuffix = newState === TransitionCheckState.Checked ?
                    'unchecked-checked' : 'unchecked-indeterminate';
                break;
            case TransitionCheckState.Checked:
                animSuffix = newState === TransitionCheckState.Unchecked ?
                    'checked-unchecked' : 'checked-indeterminate';
                break;
            case TransitionCheckState.Indeterminate:
                animSuffix = newState === TransitionCheckState.Checked ?
                    'indeterminate-checked' : 'indeterminate-unchecked';
                break;
        }
        return "mat-checkbox-anim-" + animSuffix;
    };
    /**
     * Fades out the focus state ripple.
     * @return {?}
     */
    MdCheckbox.prototype._removeFocusRipple = function () {
        if (this._focusRipple) {
            this._focusRipple.fadeOut();
            this._focusRipple = null;
        }
    };
    return MdCheckbox;
}(_MdCheckboxMixinBase));
MdCheckbox.decorators = [
    { type: Component, args: [{ selector: 'md-checkbox, mat-checkbox',
                template: "<label [attr.for]=\"inputId\" class=\"mat-checkbox-layout\" #label><div class=\"mat-checkbox-inner-container\" [class.mat-checkbox-inner-container-no-side-margin]=\"!checkboxLabel.textContent || !checkboxLabel.textContent.trim()\"><input #input class=\"mat-checkbox-input cdk-visually-hidden\" type=\"checkbox\" [id]=\"inputId\" [required]=\"required\" [checked]=\"checked\" [value]=\"value\" [disabled]=\"disabled\" [name]=\"name\" [tabIndex]=\"tabIndex\" [indeterminate]=\"indeterminate\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onInteractionEvent($event)\" (click)=\"_onInputClick($event)\"><div md-ripple class=\"mat-checkbox-ripple\" [mdRippleTrigger]=\"label\" [mdRippleDisabled]=\"_isRippleDisabled()\" [mdRippleCentered]=\"true\"></div><div class=\"mat-checkbox-frame\"></div><div class=\"mat-checkbox-background\"><svg version=\"1.1\" focusable=\"false\" class=\"mat-checkbox-checkmark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" xml:space=\"preserve\"><path class=\"mat-checkbox-checkmark-path\" fill=\"none\" stroke=\"white\" d=\"M4.1,12.7 9,17.6 20.3,6.3\"/></svg><div class=\"mat-checkbox-mixedmark\"></div></div></div><span class=\"mat-checkbox-label\" #checkboxLabel (cdkObserveContent)=\"_onLabelTextChange()\"><span style=\"display:none\">&nbsp;</span><ng-content></ng-content></span></label>",
                styles: ["@keyframes mat-checkbox-fade-in-background{0%{opacity:0}50%{opacity:1}}@keyframes mat-checkbox-fade-out-background{0%,50%{opacity:1}100%{opacity:0}}@keyframes mat-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:22.91026}50%{animation-timing-function:cubic-bezier(0,0,.2,.1)}100%{stroke-dashoffset:0}}@keyframes mat-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0,0,0,1)}100%{transform:scaleX(1)}}@keyframes mat-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(.4,0,1,1);stroke-dashoffset:0}to{stroke-dashoffset:-22.91026}}@keyframes mat-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0,0,.2,.1);opacity:1;transform:rotate(0)}to{opacity:0;transform:rotate(45deg)}}@keyframes mat-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(.14,0,0,1);opacity:0;transform:rotate(45deg)}to{opacity:1;transform:rotate(360deg)}}@keyframes mat-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:cubic-bezier(0,0,.2,.1);opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:rotate(0)}}@keyframes mat-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(.14,0,0,1);opacity:1;transform:rotate(0)}to{opacity:0;transform:rotate(315deg)}}@keyframes mat-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;opacity:1;transform:scaleX(1)}100%,32.8%{opacity:0;transform:scaleX(0)}}.mat-checkbox-checkmark,.mat-checkbox-mixedmark{width:calc(100% - 4px)}.mat-checkbox-background,.mat-checkbox-frame{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:2px;box-sizing:border-box;pointer-events:none}.mat-checkbox{transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1);cursor:pointer}.mat-checkbox-layout{cursor:inherit;align-items:baseline;vertical-align:middle;display:inline-flex}.mat-checkbox-inner-container{display:inline-block;height:20px;line-height:0;margin:auto;margin-right:8px;order:0;position:relative;vertical-align:middle;white-space:nowrap;width:20px;flex-shrink:0}[dir=rtl] .mat-checkbox-inner-container{margin-left:8px;margin-right:auto}.mat-checkbox-inner-container-no-side-margin{margin-left:0;margin-right:0}.mat-checkbox-frame{background-color:transparent;transition:border-color 90ms cubic-bezier(0,0,.2,.1);border-width:2px;border-style:solid}.mat-checkbox-background{align-items:center;display:inline-flex;justify-content:center;transition:background-color 90ms cubic-bezier(0,0,.2,.1),opacity 90ms cubic-bezier(0,0,.2,.1)}.mat-checkbox-checkmark{top:0;left:0;right:0;bottom:0;position:absolute;width:100%}.mat-checkbox-checkmark-path{stroke-dashoffset:22.91026;stroke-dasharray:22.91026;stroke-width:2.66667px}.mat-checkbox-mixedmark{height:2px;opacity:0;transform:scaleX(0) rotate(0)}.mat-checkbox-label-before .mat-checkbox-inner-container{order:1;margin-left:8px;margin-right:auto}[dir=rtl] .mat-checkbox-label-before .mat-checkbox-inner-container{margin-left:auto;margin-right:8px}.mat-checkbox-checked .mat-checkbox-checkmark{opacity:1}.mat-checkbox-checked .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-checked .mat-checkbox-mixedmark{transform:scaleX(1) rotate(-45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark{opacity:0;transform:rotate(45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-indeterminate .mat-checkbox-mixedmark{opacity:1;transform:scaleX(1) rotate(0)}.mat-checkbox-unchecked .mat-checkbox-background{background-color:transparent}.mat-checkbox-disabled{cursor:default}.mat-checkbox-anim-unchecked-checked .mat-checkbox-background{animation:180ms linear 0s mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-checked .mat-checkbox-checkmark-path{animation:180ms linear 0s mat-checkbox-unchecked-checked-checkmark-path}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-background{animation:180ms linear 0s mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0s mat-checkbox-unchecked-indeterminate-mixedmark}.mat-checkbox-anim-checked-unchecked .mat-checkbox-background{animation:180ms linear 0s mat-checkbox-fade-out-background}.mat-checkbox-anim-checked-unchecked .mat-checkbox-checkmark-path{animation:90ms linear 0s mat-checkbox-checked-unchecked-checkmark-path}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-checkmark{animation:90ms linear 0s mat-checkbox-checked-indeterminate-checkmark}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0s mat-checkbox-checked-indeterminate-mixedmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-checkmark{animation:.5s linear 0s mat-checkbox-indeterminate-checked-checkmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-mixedmark{animation:.5s linear 0s mat-checkbox-indeterminate-checked-mixedmark}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-background{animation:180ms linear 0s mat-checkbox-fade-out-background}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-mixedmark{animation:.3s linear 0s mat-checkbox-indeterminate-unchecked-mixedmark}.mat-checkbox-input{bottom:0;left:50%}.mat-checkbox-ripple{position:absolute;left:-15px;top:-15px;right:-15px;bottom:-15px;border-radius:50%;z-index:1;pointer-events:none}"],
                host: {
                    'class': 'mat-checkbox',
                    '[id]': 'id',
                    '[class.mat-checkbox-indeterminate]': 'indeterminate',
                    '[class.mat-checkbox-checked]': 'checked',
                    '[class.mat-checkbox-disabled]': 'disabled',
                    '[class.mat-checkbox-label-before]': 'labelPosition == "before"',
                },
                providers: [MD_CHECKBOX_CONTROL_VALUE_ACCESSOR],
                inputs: ['disabled', 'disableRipple', 'color'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdCheckbox.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
    { type: FocusOriginMonitor, },
]; };
MdCheckbox.propDecorators = {
    'ariaLabel': [{ type: Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: Input, args: ['aria-labelledby',] },],
    'id': [{ type: Input },],
    'required': [{ type: Input },],
    'align': [{ type: Input },],
    'labelPosition': [{ type: Input },],
    'tabIndex': [{ type: Input },],
    'name': [{ type: Input },],
    'change': [{ type: Output },],
    'indeterminateChange': [{ type: Output },],
    'value': [{ type: Input },],
    '_inputElement': [{ type: ViewChild, args: ['input',] },],
    '_ripple': [{ type: ViewChild, args: [MdRipple,] },],
    'checked': [{ type: Input },],
    'indeterminate': [{ type: Input },],
};
var _MdCheckboxRequiredValidator = CheckboxRequiredValidator;
var MD_CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MdCheckboxRequiredValidator; }),
    multi: true
};
/**
 * Validator for Material checkbox's required attribute in template-driven checkbox.
 * Current CheckboxRequiredValidator only work with `input type=checkbox` and does not
 * work with `md-checkbox`.
 */
var MdCheckboxRequiredValidator = (function (_super) {
    tslib_1.__extends(MdCheckboxRequiredValidator, _super);
    function MdCheckboxRequiredValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdCheckboxRequiredValidator;
}(_MdCheckboxRequiredValidator));
MdCheckboxRequiredValidator.decorators = [
    { type: Directive, args: [{
                selector: "md-checkbox[required][formControlName],\n             mat-checkbox[required][formControlName],\n             md-checkbox[required][formControl], md-checkbox[required][ngModel],\n             mat-checkbox[required][formControl], mat-checkbox[required][ngModel]",
                providers: [MD_CHECKBOX_REQUIRED_VALIDATOR],
                host: { '[attr.required]': 'required ? "" : null' }
            },] },
];
/**
 * @nocollapse
 */
MdCheckboxRequiredValidator.ctorParameters = function () { return []; };
var MdCheckboxModule = (function () {
    function MdCheckboxModule() {
    }
    return MdCheckboxModule;
}());
MdCheckboxModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, MdRippleModule, MdCommonModule, ObserversModule],
                exports: [MdCheckbox, MdCheckboxRequiredValidator, MdCommonModule],
                declarations: [MdCheckbox, MdCheckboxRequiredValidator],
                providers: [FocusOriginMonitor]
            },] },
];
/**
 * @nocollapse
 */
MdCheckboxModule.ctorParameters = function () { return []; };
// Increasing integer for generating unique ids for radio components.
var nextUniqueId$1 = 0;
/**
 * Provider Expression that allows md-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * \@docs-private
 */
var MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdRadioGroup; }),
    multi: true
};
/**
 * Change event object emitted by MdRadio and MdRadioGroup.
 */
var MdRadioChange = (function () {
    function MdRadioChange() {
    }
    return MdRadioChange;
}());
/**
 * \@docs-private
 */
var MdRadioGroupBase = (function () {
    function MdRadioGroupBase() {
    }
    return MdRadioGroupBase;
}());
var _MdRadioGroupMixinBase = mixinDisabled(MdRadioGroupBase);
/**
 * A group of radio buttons. May contain one or more `<md-radio-button>` elements.
 */
var MdRadioGroup = (function (_super) {
    tslib_1.__extends(MdRadioGroup, _super);
    /**
     * @param {?} _changeDetector
     */
    function MdRadioGroup(_changeDetector) {
        var _this = _super.call(this) || this;
        _this._changeDetector = _changeDetector;
        /**
         * Selected value for group. Should equal the value of the selected radio button if there *is*
         * a corresponding radio button with a matching value. If there is *not* such a corresponding
         * radio button, this value persists to be applied in case a new radio button is added with a
         * matching value.
         */
        _this._value = null;
        /**
         * The HTML name attribute applied to radio buttons in this group.
         */
        _this._name = "md-radio-group-" + nextUniqueId$1++;
        /**
         * The currently selected radio button. Should match value.
         */
        _this._selected = null;
        /**
         * Whether the `value` has been set to its initial value.
         */
        _this._isInitialized = false;
        /**
         * Whether the labels should appear after or before the radio-buttons. Defaults to 'after'
         */
        _this._labelPosition = 'after';
        /**
         * Whether the radio group is disabled.
         */
        _this._disabled = false;
        /**
         * Whether the radio group is required.
         */
        _this._required = false;
        /**
         * The method to be called in order to update ngModel
         */
        _this._controlValueAccessorChangeFn = function () { };
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         * \@docs-private
         */
        _this.onTouched = function () { };
        /**
         * Event emitted when the group value changes.
         * Change events are only emitted when the value changes due to user interaction with
         * a radio button (the same behavior as `<input type-"radio">`).
         */
        _this.change = new EventEmitter();
        return _this;
    }
    Object.defineProperty(MdRadioGroup.prototype, "name", {
        /**
         * Name of the radio button group. All radio buttons inside this group will use this name.
         * @return {?}
         */
        get: function () { return this._name; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._name = value;
            this._updateRadioButtonNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "align", {
        /**
         * Alignment of the radio-buttons relative to their labels. Can be 'before' or 'after'.
         * @deprecated
         * @return {?}
         */
        get: function () {
            // align refers to the checkbox relative to the label, while labelPosition refers to the
            // label relative to the checkbox. As such, they are inverted.
            return this.labelPosition == 'after' ? 'start' : 'end';
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.labelPosition = (v == 'start') ? 'after' : 'before';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "labelPosition", {
        /**
         * Whether the labels should appear after or before the radio-buttons. Defaults to 'after'
         * @return {?}
         */
        get: function () {
            return this._labelPosition;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._labelPosition = (v == 'before') ? 'before' : 'after';
            this._markRadiosForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "value", {
        /**
         * Value of the radio button.
         * @return {?}
         */
        get: function () { return this._value; },
        /**
         * @param {?} newValue
         * @return {?}
         */
        set: function (newValue) {
            if (this._value != newValue) {
                // Set this before proceeding to ensure no circular loop occurs with selection.
                this._value = newValue;
                this._updateSelectedRadioFromValue();
                this._checkSelectedRadioButton();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdRadioGroup.prototype._checkSelectedRadioButton = function () {
        if (this._selected && !this._selected.checked) {
            this._selected.checked = true;
        }
    };
    Object.defineProperty(MdRadioGroup.prototype, "selected", {
        /**
         * Whether the radio button is selected.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} selected
         * @return {?}
         */
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            this._checkSelectedRadioButton();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "disabled", {
        /**
         * Whether the radio group is disabled
         * @return {?}
         */
        get: function () { return this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
            this._markRadiosForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "required", {
        /**
         * Whether the radio group is required
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._required = coerceBooleanProperty(value);
            this._markRadiosForCheck();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
     * @return {?}
     */
    MdRadioGroup.prototype.ngAfterContentInit = function () {
        // Mark this component as initialized in AfterContentInit because the initial value can
        // possibly be set by NgModel on MdRadioGroup, and it is possible that the OnInit of the
        // NgModel occurs *after* the OnInit of the MdRadioGroup.
        this._isInitialized = true;
    };
    /**
     * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
     * radio buttons upon their blur.
     * @return {?}
     */
    MdRadioGroup.prototype._touch = function () {
        if (this.onTouched) {
            this.onTouched();
        }
    };
    /**
     * @return {?}
     */
    MdRadioGroup.prototype._updateRadioButtonNames = function () {
        var _this = this;
        if (this._radios) {
            this._radios.forEach(function (radio) {
                radio.name = _this.name;
            });
        }
    };
    /**
     * Updates the `selected` radio button from the internal _value state.
     * @return {?}
     */
    MdRadioGroup.prototype._updateSelectedRadioFromValue = function () {
        var _this = this;
        // If the value already matches the selected radio, do nothing.
        var /** @type {?} */ isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._radios != null && !isAlreadySelected) {
            this._selected = null;
            this._radios.forEach(function (radio) {
                radio.checked = _this.value == radio.value;
                if (radio.checked) {
                    _this._selected = radio;
                }
            });
        }
    };
    /**
     * Dispatch change event with current selection and group value.
     * @return {?}
     */
    MdRadioGroup.prototype._emitChangeEvent = function () {
        if (this._isInitialized) {
            var /** @type {?} */ event = new MdRadioChange();
            event.source = this._selected;
            event.value = this._value;
            this.change.emit(event);
        }
    };
    /**
     * @return {?}
     */
    MdRadioGroup.prototype._markRadiosForCheck = function () {
        if (this._radios) {
            this._radios.forEach(function (radio) { return radio._markForCheck(); });
        }
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    MdRadioGroup.prototype.writeValue = function (value) {
        this.value = value;
        this._changeDetector.markForCheck();
    };
    /**
     * Registers a callback to be triggered when the model value changes.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    MdRadioGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback to be triggered when the control is touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    MdRadioGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled Whether the control should be disabled.
     * @return {?}
     */
    MdRadioGroup.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this._changeDetector.markForCheck();
    };
    return MdRadioGroup;
}(_MdRadioGroupMixinBase));
MdRadioGroup.decorators = [
    { type: Directive, args: [{
                selector: 'md-radio-group, mat-radio-group',
                providers: [MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
                host: {
                    'role': 'radiogroup',
                    'class': 'mat-radio-group',
                },
                inputs: ['disabled'],
            },] },
];
/**
 * @nocollapse
 */
MdRadioGroup.ctorParameters = function () { return [
    { type: ChangeDetectorRef, },
]; };
MdRadioGroup.propDecorators = {
    'change': [{ type: Output },],
    '_radios': [{ type: ContentChildren, args: [forwardRef(function () { return MdRadioButton; }),] },],
    'name': [{ type: Input },],
    'align': [{ type: Input },],
    'labelPosition': [{ type: Input },],
    'value': [{ type: Input },],
    'selected': [{ type: Input },],
    'disabled': [{ type: Input },],
    'required': [{ type: Input },],
};
/**
 * \@docs-private
 */
var MdRadioButtonBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdRadioButtonBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdRadioButtonBase;
}());
// As per Material design specifications the selection control radio should use the accent color
// palette by default. https://material.io/guidelines/components/selection-controls.html
var _MdRadioButtonMixinBase = mixinColor(mixinDisableRipple(MdRadioButtonBase), 'accent');
/**
 * A radio-button. May be inside of
 */
var MdRadioButton = (function (_super) {
    tslib_1.__extends(MdRadioButton, _super);
    /**
     * @param {?} radioGroup
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _changeDetector
     * @param {?} _focusOriginMonitor
     * @param {?} _radioDispatcher
     */
    function MdRadioButton(radioGroup, elementRef, renderer, _changeDetector, _focusOriginMonitor, _radioDispatcher) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._changeDetector = _changeDetector;
        _this._focusOriginMonitor = _focusOriginMonitor;
        _this._radioDispatcher = _radioDispatcher;
        _this._uniqueId = "md-radio-" + ++nextUniqueId$1;
        /**
         * The unique ID for the radio button.
         */
        _this.id = _this._uniqueId;
        /**
         * Event emitted when the checked state of this radio button changes.
         * Change events are only emitted when the value changes due to user interaction with
         * the radio button (the same behavior as `<input type-"radio">`).
         */
        _this.change = new EventEmitter();
        /**
         * Whether this radio is checked.
         */
        _this._checked = false;
        /**
         * Value assigned to this radio.
         */
        _this._value = null;
        /**
         * Unregister function for _radioDispatcher *
         */
        _this._removeUniqueSelectionListener = function () { };
        // Assertions. Ideally these should be stripped out by the compiler.
        // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
        _this.radioGroup = radioGroup;
        _this._removeUniqueSelectionListener =
            _radioDispatcher.listen(function (id, name) {
                if (id != _this.id && name == _this.name) {
                    _this.checked = false;
                }
            });
        return _this;
    }
    Object.defineProperty(MdRadioButton.prototype, "checked", {
        /**
         * Whether this radio button is checked.
         * @return {?}
         */
        get: function () {
            return this._checked;
        },
        /**
         * @param {?} newCheckedState
         * @return {?}
         */
        set: function (newCheckedState) {
            if (this._checked != newCheckedState) {
                this._checked = newCheckedState;
                if (newCheckedState && this.radioGroup && this.radioGroup.value != this.value) {
                    this.radioGroup.selected = this;
                }
                else if (!newCheckedState && this.radioGroup && this.radioGroup.value == this.value) {
                    // When unchecking the selected radio button, update the selected radio
                    // property on the group.
                    this.radioGroup.selected = null;
                }
                if (newCheckedState) {
                    // Notify all radio buttons with the same name to un-check.
                    this._radioDispatcher.notify(this.id, this.name);
                }
                this._changeDetector.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "value", {
        /**
         * The value of this radio button.
         * @return {?}
         */
        get: function () {
            return this._value;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._value != value) {
                this._value = value;
                if (this.radioGroup != null) {
                    if (!this.checked) {
                        // Update checked when the value changed to match the radio group's value
                        this.checked = this.radioGroup.value == value;
                    }
                    if (this.checked) {
                        this.radioGroup.selected = this;
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "align", {
        /**
         * Whether or not the radio-button should appear before or after the label.
         * @deprecated
         * @return {?}
         */
        get: function () {
            // align refers to the checkbox relative to the label, while labelPosition refers to the
            // label relative to the checkbox. As such, they are inverted.
            return this.labelPosition == 'after' ? 'start' : 'end';
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.labelPosition = (v == 'start') ? 'after' : 'before';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "labelPosition", {
        /**
         * Whether the label should appear after or before the radio button. Defaults to 'after'
         * @return {?}
         */
        get: function () {
            return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition) || 'after';
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._labelPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "disabled", {
        /**
         * Whether the radio button is disabled.
         * @return {?}
         */
        get: function () {
            return this._disabled || (this.radioGroup != null && this.radioGroup.disabled);
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "required", {
        /**
         * Whether the radio button is required.
         * @return {?}
         */
        get: function () {
            return this._required || (this.radioGroup && this.radioGroup.required);
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._required = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "inputId", {
        /**
         * ID of the native input element inside `<md-radio-button>`
         * @return {?}
         */
        get: function () { return (this.id || this._uniqueId) + "-input"; },
        enumerable: true,
        configurable: true
    });
    /**
     * Focuses the radio button.
     * @return {?}
     */
    MdRadioButton.prototype.focus = function () {
        this._focusOriginMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
    };
    /**
     * Marks the radio button as needing checking for change detection.
     * This method is exposed because the parent radio group will directly
     * update bound properties of the radio button.
     * @return {?}
     */
    MdRadioButton.prototype._markForCheck = function () {
        // When group value changes, the button will not be notified. Use `markForCheck` to explicit
        // update radio button's status
        this._changeDetector.markForCheck();
    };
    /**
     * @return {?}
     */
    MdRadioButton.prototype.ngOnInit = function () {
        if (this.radioGroup) {
            // If the radio is inside a radio group, determine if it should be checked
            this.checked = this.radioGroup.value === this._value;
            // Copy name from parent radio group
            this.name = this.radioGroup.name;
        }
    };
    /**
     * @return {?}
     */
    MdRadioButton.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._focusOriginMonitor
            .monitor(this._inputElement.nativeElement, this._renderer, false)
            .subscribe(function (focusOrigin) { return _this._onInputFocusChange(focusOrigin); });
    };
    /**
     * @return {?}
     */
    MdRadioButton.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._inputElement.nativeElement);
        this._removeUniqueSelectionListener();
    };
    /**
     * Dispatch change event with current value.
     * @return {?}
     */
    MdRadioButton.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdRadioChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    };
    /**
     * @return {?}
     */
    MdRadioButton.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdRadioButton.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `radio-button` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Triggered when the radio button received a click or the input recognized any change.
     * Clicking on a label element, will trigger a change event on the associated input.
     * @param {?} event
     * @return {?}
     */
    MdRadioButton.prototype._onInputChange = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        var /** @type {?} */ groupValueChanged = this.radioGroup && this.value != this.radioGroup.value;
        this.checked = true;
        this._emitChangeEvent();
        if (this.radioGroup) {
            this.radioGroup._controlValueAccessorChangeFn(this.value);
            this.radioGroup._touch();
            if (groupValueChanged) {
                this.radioGroup._emitChangeEvent();
            }
        }
    };
    /**
     * Function is called whenever the focus changes for the input element.
     * @param {?} focusOrigin
     * @return {?}
     */
    MdRadioButton.prototype._onInputFocusChange = function (focusOrigin) {
        if (!this._focusRipple && focusOrigin === 'keyboard') {
            this._focusRipple = this._ripple.launch(0, 0, { persistent: true, centered: true });
        }
        else if (!focusOrigin) {
            if (this.radioGroup) {
                this.radioGroup._touch();
            }
            if (this._focusRipple) {
                this._focusRipple.fadeOut();
                this._focusRipple = null;
            }
        }
    };
    return MdRadioButton;
}(_MdRadioButtonMixinBase));
MdRadioButton.decorators = [
    { type: Component, args: [{ selector: 'md-radio-button, mat-radio-button',
                template: "<label [attr.for]=\"inputId\" class=\"mat-radio-label\" #label><div class=\"mat-radio-container\"><div class=\"mat-radio-outer-circle\"></div><div class=\"mat-radio-inner-circle\"></div><div md-ripple class=\"mat-radio-ripple\" [mdRippleTrigger]=\"label\" [mdRippleDisabled]=\"_isRippleDisabled()\" [mdRippleCentered]=\"true\"></div></div><input #input class=\"mat-radio-input cdk-visually-hidden\" type=\"radio\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" [required]=\"required\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onInputChange($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-radio-label-content\" [class.mat-radio-label-before]=\"labelPosition == 'before'\"><span style=\"display:none\">&nbsp;</span><ng-content></ng-content></div></label>",
                styles: [".mat-radio-button{display:inline-block}.mat-radio-label{cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle}.mat-radio-container{box-sizing:border-box;display:inline-block;height:20px;position:relative;width:20px}.mat-radio-outer-circle{box-sizing:border-box;height:20px;left:0;position:absolute;top:0;transition:border-color ease 280ms;width:20px;border-width:2px;border-style:solid;border-radius:50%}.mat-radio-inner-circle{border-radius:50%;box-sizing:border-box;height:20px;left:0;position:absolute;top:0;transition:transform ease 280ms,background-color ease 280ms;width:20px;transform:scale(.001)}.mat-radio-checked .mat-radio-inner-circle{transform:scale(.5)}.mat-radio-label-content{display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .mat-radio-label-content{padding-right:8px;padding-left:0}.mat-radio-label-content.mat-radio-label-before{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .mat-radio-label-content.mat-radio-label-before{padding-right:0;padding-left:8px}.mat-radio-disabled,.mat-radio-disabled .mat-radio-label{cursor:default}.mat-radio-ripple{position:absolute;left:-15px;top:-15px;right:-15px;bottom:-15px;border-radius:50%;z-index:1;pointer-events:none}"],
                inputs: ['color', 'disableRipple'],
                encapsulation: ViewEncapsulation.None,
                host: {
                    'class': 'mat-radio-button',
                    '[class.mat-radio-checked]': 'checked',
                    '[class.mat-radio-disabled]': 'disabled',
                    '[attr.id]': 'id',
                    // Note: under normal conditions focus shouldn't land on this element, however it may be
                    // programmatically set, for example inside of a focus trap, in this case we want to forward
                    // the focus to the native element.
                    '(focus)': '_inputElement.nativeElement.focus()',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdRadioButton.ctorParameters = function () { return [
    { type: MdRadioGroup, decorators: [{ type: Optional },] },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: ChangeDetectorRef, },
    { type: FocusOriginMonitor, },
    { type: UniqueSelectionDispatcher, },
]; };
MdRadioButton.propDecorators = {
    'id': [{ type: Input },],
    'name': [{ type: Input },],
    'ariaLabel': [{ type: Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: Input, args: ['aria-labelledby',] },],
    'checked': [{ type: Input },],
    'value': [{ type: Input },],
    'align': [{ type: Input },],
    'labelPosition': [{ type: Input },],
    'disabled': [{ type: Input },],
    'required': [{ type: Input },],
    'change': [{ type: Output },],
    '_ripple': [{ type: ViewChild, args: [MdRipple,] },],
    '_inputElement': [{ type: ViewChild, args: ['input',] },],
};
var MdRadioModule = (function () {
    function MdRadioModule() {
    }
    return MdRadioModule;
}());
MdRadioModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, MdRippleModule, MdCommonModule],
                exports: [MdRadioGroup, MdRadioButton, MdCommonModule],
                providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER, VIEWPORT_RULER_PROVIDER, FocusOriginMonitor],
                declarations: [MdRadioGroup, MdRadioButton],
            },] },
];
/**
 * @nocollapse
 */
MdRadioModule.ctorParameters = function () { return []; };
/**
 * This animation shrinks the placeholder text to 75% of its normal size and translates
 * it to either the top left corner (ltr) or top right corner (rtl) of the trigger,
 * depending on the text direction of the application.
 */
var transformPlaceholder = trigger('transformPlaceholder', [
    state('floating-ltr', style({
        top: '-22px',
        left: '-2px',
        transform: 'scale(0.75)'
    })),
    state('floating-rtl', style({
        top: '-22px',
        left: '2px',
        transform: 'scale(0.75)'
    })),
    transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);
/**
 * This animation transforms the select's overlay panel on and off the page.
 *
 * When the panel is attached to the DOM, it expands its width by the amount of padding, scales it
 * up to 100% on the Y axis, fades in its border, and translates slightly up and to the
 * side to ensure the option text correctly overlaps the trigger text.
 *
 * When the panel is removed from the DOM, it simply fades out linearly.
 */
var transformPanel = trigger('transformPanel', [
    state('showing', style({
        opacity: 1,
        minWidth: 'calc(100% + 32px)',
        transform: 'scaleY(1)'
    })),
    state('showing-multiple', style({
        opacity: 1,
        minWidth: 'calc(100% + 64px)',
        transform: 'scaleY(1)'
    })),
    transition('void => *', [
        style({
            opacity: 0,
            minWidth: '100%',
            transform: 'scaleY(0)'
        }),
        animate('150ms cubic-bezier(0.25, 0.8, 0.25, 1)')
    ]),
    transition('* => void', [
        animate('250ms 100ms linear', style({ opacity: 0 }))
    ])
]);
/**
 * This animation fades in the background color and text content of the
 * select's options. It is time delayed to occur 100ms after the overlay
 * panel has transformed in.
 */
var fadeInContent = trigger('fadeInContent', [
    state('showing', style({ opacity: 1 })),
    transition('void => showing', [
        style({ opacity: 0 }),
        animate('150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)')
    ])
]);
/**
 * Returns an exception to be thrown when attempting to change a select's `multiple` option
 * after initialization.
 * \@docs-private
 * @return {?}
 */
function getMdSelectDynamicMultipleError() {
    return Error('Cannot change `multiple` mode of select after initialization.');
}
/**
 * Returns an exception to be thrown when attempting to assign a non-array value to a select
 * in `multiple` mode. Note that `undefined` and `null` are still valid values to allow for
 * resetting the value.
 * \@docs-private
 * @return {?}
 */
function getMdSelectNonArrayValueError() {
    return Error('Cannot assign truthy non-array value to select in `multiple` mode.');
}
/**
 * Returns an exception to be thrown when assigning a non-function value to the comparator
 * used to determine if a value corresponds to an option. Note that whether the function
 * actually takes two values and returns a boolean is not checked.
 * @return {?}
 */
function getMdSelectNonFunctionValueError() {
    return Error('Cannot assign a non-function value to `compareWith`.');
}
/**
 * The fixed height of every option element (option, group header etc.).
 */
var SELECT_ITEM_HEIGHT = 48;
/**
 * The max height of the select's overlay panel
 */
var SELECT_PANEL_MAX_HEIGHT = 256;
/**
 * The max number of options visible at once in the select panel.
 */
var SELECT_MAX_OPTIONS_DISPLAYED = Math.floor(SELECT_PANEL_MAX_HEIGHT / SELECT_ITEM_HEIGHT);
/**
 * The fixed height of the select's trigger element.
 */
var SELECT_TRIGGER_HEIGHT = 30;
/**
 * Must adjust for the difference in height between the option and the trigger,
 * so the text will align on the y axis.
 */
var SELECT_OPTION_HEIGHT_ADJUSTMENT = (SELECT_ITEM_HEIGHT - SELECT_TRIGGER_HEIGHT) / 2;
/**
 * The panel's padding on the x-axis
 */
var SELECT_PANEL_PADDING_X = 16;
/**
 * The panel's x axis padding if it is indented (e.g. there is an option group).
 */
var SELECT_PANEL_INDENT_PADDING_X = SELECT_PANEL_PADDING_X * 2;
/**
 * Distance between the panel edge and the option text in
 * multi-selection mode.
 *
 * (SELECT_PADDING * 1.75) + 20 = 48
 * The padding is multiplied by 1.75 because the checkbox's margin is half the padding, and
 * the browser adds ~4px, because we're using inline elements.
 * The checkbox width is 20px.
 */
var SELECT_MULTIPLE_PANEL_PADDING_X = SELECT_PANEL_PADDING_X * 1.75 + 20;
/**
 * The panel's padding on the y-axis. This padding indicates there are more
 * options available if you scroll.
 */
var SELECT_PANEL_PADDING_Y = 16;
/**
 * The select panel will only "fit" inside the viewport if it is positioned at
 * this value or more away from the viewport boundary.
 */
var SELECT_PANEL_VIEWPORT_PADDING = 8;
/**
 * Default minimum width of the trigger based on the CSS.
 * Used as a fallback for server-side rendering.
 * \@docs-private
 */
var SELECT_TRIGGER_MIN_WIDTH = 112;
/**
 * Injection token that determines the scroll handling while a select is open.
 */
var MD_SELECT_SCROLL_STRATEGY = new InjectionToken('md-select-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MD_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition(); };
}
/**
 * \@docs-private
 */
var MD_SELECT_SCROLL_STRATEGY_PROVIDER = {
    provide: MD_SELECT_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MD_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Change event object that is emitted when the select value has changed.
 */
var MdSelectChange = (function () {
    /**
     * @param {?} source
     * @param {?} value
     */
    function MdSelectChange(source, value) {
        this.source = source;
        this.value = value;
    }
    return MdSelectChange;
}());
/**
 * \@docs-private
 */
var MdSelectBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdSelectBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdSelectBase;
}());
var _MdSelectMixinBase = mixinColor(mixinDisabled(MdSelectBase), 'primary');
/**
 * Allows the user to customize the trigger that is displayed when the select has a value.
 */
var MdSelectTrigger = (function () {
    function MdSelectTrigger() {
    }
    return MdSelectTrigger;
}());
MdSelectTrigger.decorators = [
    { type: Directive, args: [{
                selector: 'md-select-trigger, mat-select-trigger'
            },] },
];
/**
 * @nocollapse
 */
MdSelectTrigger.ctorParameters = function () { return []; };
var MdSelect = (function (_super) {
    tslib_1.__extends(MdSelect, _super);
    /**
     * @param {?} _viewportRuler
     * @param {?} _changeDetectorRef
     * @param {?} _overlay
     * @param {?} _platform
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _dir
     * @param {?} _parentForm
     * @param {?} _parentFormGroup
     * @param {?} _control
     * @param {?} tabIndex
     * @param {?} placeholderOptions
     * @param {?} _scrollStrategyFactory
     */
    function MdSelect(_viewportRuler, _changeDetectorRef, _overlay, _platform, renderer, elementRef, _dir, _parentForm, _parentFormGroup, _control, tabIndex, placeholderOptions, _scrollStrategyFactory) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._viewportRuler = _viewportRuler;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._overlay = _overlay;
        _this._platform = _platform;
        _this._dir = _dir;
        _this._parentForm = _parentForm;
        _this._parentFormGroup = _parentFormGroup;
        _this._control = _control;
        _this._scrollStrategyFactory = _scrollStrategyFactory;
        /**
         * Whether or not the overlay panel is open.
         */
        _this._panelOpen = false;
        /**
         * Whether filling out the select is required in the form.
         */
        _this._required = false;
        /**
         * The scroll position of the overlay panel, calculated to center the selected option.
         */
        _this._scrollTop = 0;
        /**
         * Whether the component is in multiple selection mode.
         */
        _this._multiple = false;
        /**
         * Comparison function to specify which option is displayed. Defaults to object equality.
         */
        _this._compareWith = function (o1, o2) { return o1 === o2; };
        /**
         * The animation state of the placeholder.
         */
        _this._placeholderState = '';
        /**
         * View -> model callback called when value changes
         */
        _this._onChange = function () { };
        /**
         * View -> model callback called when select has been touched
         */
        _this._onTouched = function () { };
        /**
         * The IDs of child options to be passed to the aria-owns attribute.
         */
        _this._optionIds = '';
        /**
         * The value of the select panel's transform-origin property.
         */
        _this._transformOrigin = 'top';
        /**
         * Whether the panel's animation is done.
         */
        _this._panelDoneAnimating = false;
        /**
         * Strategy that will be used to handle scrolling while the select panel is open.
         */
        _this._scrollStrategy = _this._scrollStrategyFactory();
        /**
         * The y-offset of the overlay panel in relation to the trigger's top start corner.
         * This must be adjusted to align the selected option text over the trigger text.
         * when the panel opens. Will change based on the y-position of the selected option.
         */
        _this._offsetY = 0;
        /**
         * This position config ensures that the top "start" corner of the overlay
         * is aligned with with the top "start" of the origin by default (overlapping
         * the trigger completely). If the panel cannot fit below the trigger, it
         * will fall back to a position above the trigger.
         */
        _this._positions = [
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'top',
            },
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'bottom',
            },
        ];
        _this._disableRipple = false;
        /**
         * Aria label of the select. If not specified, the placeholder will be used as label.
         */
        _this.ariaLabel = '';
        /**
         * Input that can be used to specify the `aria-labelledby` attribute.
         */
        _this.ariaLabelledby = '';
        /**
         * Event emitted when the select has been opened.
         */
        _this.onOpen = new EventEmitter();
        /**
         * Event emitted when the select has been closed.
         */
        _this.onClose = new EventEmitter();
        /**
         * Event emitted when the selected value has been changed by the user.
         */
        _this.change = new EventEmitter();
        /**
         * Event that emits whenever the raw value of the select changes. This is here primarily
         * to facilitate the two-way binding for the `value` input.
         * \@docs-private
         */
        _this.valueChange = new EventEmitter();
        if (_this._control) {
            _this._control.valueAccessor = _this;
        }
        _this._tabIndex = parseInt(tabIndex) || 0;
        _this._placeholderOptions = placeholderOptions ? placeholderOptions : {};
        _this.floatPlaceholder = _this._placeholderOptions.float || 'auto';
        return _this;
    }
    Object.defineProperty(MdSelect.prototype, "placeholder", {
        /**
         * Placeholder to be shown if no value has been selected.
         * @return {?}
         */
        get: function () { return this._placeholder; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            var _this = this;
            this._placeholder = value;
            // Must wait to record the trigger width to ensure placeholder width is included.
            Promise.resolve(null).then(function () { return _this._setTriggerWidth(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "required", {
        /**
         * Whether the component is required.
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "multiple", {
        /**
         * Whether the user should be allowed to select multiple options.
         * @return {?}
         */
        get: function () { return this._multiple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._selectionModel) {
                throw getMdSelectDynamicMultipleError();
            }
            this._multiple = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "compareWith", {
        /**
         * A function to compare the option values with the selected values. The first argument
         * is a value from an option. The second is a value from the selection. A boolean
         * should be returned.
         * @return {?}
         */
        get: function () { return this._compareWith; },
        /**
         * @param {?} fn
         * @return {?}
         */
        set: function (fn) {
            if (typeof fn !== 'function') {
                throw getMdSelectNonFunctionValueError();
            }
            this._compareWith = fn;
            if (this._selectionModel) {
                // A different comparator means the selection could change.
                this._initializeSelection();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "floatPlaceholder", {
        /**
         * Whether to float the placeholder text.
         * @return {?}
         */
        get: function () { return this._floatPlaceholder; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._floatPlaceholder = value || this._placeholderOptions.float || 'auto';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "tabIndex", {
        /**
         * Tab index for the select element.
         * @return {?}
         */
        get: function () { return this.disabled ? -1 : this._tabIndex; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (typeof value !== 'undefined') {
                this._tabIndex = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "value", {
        /**
         * Value of the select control.
         * @return {?}
         */
        get: function () { return this._value; },
        /**
         * @param {?} newValue
         * @return {?}
         */
        set: function (newValue) {
            this.writeValue(newValue);
            this._value = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "disableRipple", {
        /**
         * Whether ripples for all options in the select are disabled.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disableRipple = coerceBooleanProperty(value);
            this._setOptionDisableRipple();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "optionSelectionChanges", {
        /**
         * Combined stream of all of the child options' change events.
         * @return {?}
         */
        get: function () {
            return merge.apply(void 0, this.options.map(function (option) { return option.onSelectionChange; }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSelect.prototype.ngOnInit = function () {
        this._selectionModel = new SelectionModel(this.multiple, undefined, false);
    };
    /**
     * @return {?}
     */
    MdSelect.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._initKeyManager();
        this._changeSubscription = startWith.call(this.options.changes, null).subscribe(function () {
            _this._resetOptions();
            _this._initializeSelection();
        });
    };
    /**
     * @return {?}
     */
    MdSelect.prototype.ngOnDestroy = function () {
        this._dropSubscriptions();
        if (this._changeSubscription) {
            this._changeSubscription.unsubscribe();
        }
        if (this._tabSubscription) {
            this._tabSubscription.unsubscribe();
        }
    };
    /**
     * Toggles the overlay panel open or closed.
     * @return {?}
     */
    MdSelect.prototype.toggle = function () {
        this.panelOpen ? this.close() : this.open();
    };
    /**
     * Opens the overlay panel.
     * @return {?}
     */
    MdSelect.prototype.open = function () {
        if (this.disabled || !this.options.length) {
            return;
        }
        if (!this._triggerWidth) {
            this._setTriggerWidth();
        }
        this._calculateOverlayPosition();
        this._placeholderState = this._floatPlaceholderState();
        this._panelOpen = true;
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Closes the overlay panel and focuses the host element.
     * @return {?}
     */
    MdSelect.prototype.close = function () {
        if (this._panelOpen) {
            this._panelOpen = false;
            if (this._selectionModel.isEmpty()) {
                this._placeholderState = '';
            }
            this._changeDetectorRef.markForCheck();
            this.focus();
        }
    };
    /**
     * Sets the select's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} value New value to be written to the model.
     * @return {?}
     */
    MdSelect.prototype.writeValue = function (value) {
        if (this.options) {
            this._setSelectionByValue(value);
        }
    };
    /**
     * Saves a callback function to be invoked when the select's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the value changes.
     * @return {?}
     */
    MdSelect.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    /**
     * Saves a callback function to be invoked when the select is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the component has been touched.
     * @return {?}
     */
    MdSelect.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /**
     * Disables the select. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param {?} isDisabled Sets whether the component is disabled.
     * @return {?}
     */
    MdSelect.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    };
    Object.defineProperty(MdSelect.prototype, "panelOpen", {
        /**
         * Whether or not the overlay panel is open.
         * @return {?}
         */
        get: function () {
            return this._panelOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "selected", {
        /**
         * The currently selected option.
         * @return {?}
         */
        get: function () {
            return this.multiple ? this._selectionModel.selected : this._selectionModel.selected[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "triggerValue", {
        /**
         * The value displayed in the trigger.
         * @return {?}
         */
        get: function () {
            if (!this._selectionModel || this._selectionModel.isEmpty()) {
                return '';
            }
            if (this._multiple) {
                var /** @type {?} */ selectedOptions = this._selectionModel.selected.map(function (option) { return option.viewValue; });
                if (this._isRtl()) {
                    selectedOptions.reverse();
                }
                // TODO(crisbeto): delimiter should be configurable for proper localization.
                return selectedOptions.join(', ');
            }
            return this._selectionModel.selected[0].viewValue;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Whether the element is in RTL mode.
     * @return {?}
     */
    MdSelect.prototype._isRtl = function () {
        return this._dir ? this._dir.value === 'rtl' : false;
    };
    /**
     * Sets the width of the trigger element. This is necessary to match
     * the overlay width to the trigger width.
     * @return {?}
     */
    MdSelect.prototype._setTriggerWidth = function () {
        this._triggerWidth = this._platform.isBrowser ? this._getTriggerRect().width :
            SELECT_TRIGGER_MIN_WIDTH;
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Handles the keyboard interactions of a closed select.
     * @param {?} event
     * @return {?}
     */
    MdSelect.prototype._handleClosedKeydown = function (event) {
        if (!this.disabled) {
            if (event.keyCode === ENTER || event.keyCode === SPACE) {
                event.preventDefault(); // prevents the page from scrolling down when pressing space
                this.open();
            }
            else if (event.keyCode === UP_ARROW || event.keyCode === DOWN_ARROW) {
                this._handleArrowKey(event);
            }
        }
    };
    /**
     * Handles keypresses inside the panel.
     * @param {?} event
     * @return {?}
     */
    MdSelect.prototype._handlePanelKeydown = function (event) {
        if (event.keyCode === HOME || event.keyCode === END) {
            event.preventDefault();
            event.keyCode === HOME ? this._keyManager.setFirstItemActive() :
                this._keyManager.setLastItemActive();
        }
        else {
            this._keyManager.onKeydown(event);
        }
    };
    /**
     * When the panel element is finished transforming in (though not fading in), it
     * emits an event and focuses an option if the panel is open.
     * @return {?}
     */
    MdSelect.prototype._onPanelDone = function () {
        if (this.panelOpen) {
            this._focusCorrectOption();
            this.onOpen.emit();
        }
        else {
            this.onClose.emit();
            this._panelDoneAnimating = false;
            this.overlayDir.offsetX = 0;
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * When the panel content is done fading in, the _panelDoneAnimating property is
     * set so the proper class can be added to the panel.
     * @return {?}
     */
    MdSelect.prototype._onFadeInDone = function () {
        this._panelDoneAnimating = this.panelOpen;
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Calls the touched callback only if the panel is closed. Otherwise, the trigger will
     * "blur" to the panel when it opens, causing a false positive.
     * @return {?}
     */
    MdSelect.prototype._onBlur = function () {
        if (!this.disabled && !this.panelOpen) {
            this._onTouched();
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * Callback that is invoked when the overlay panel has been attached.
     * @return {?}
     */
    MdSelect.prototype._onAttached = function () {
        this._calculateOverlayOffsetX();
        this._setScrollTop();
    };
    /**
     * Whether the select has a value.
     * @return {?}
     */
    MdSelect.prototype._hasValue = function () {
        return this._selectionModel && this._selectionModel.hasValue();
    };
    /**
     * Whether the select is in an error state.
     * @return {?}
     */
    MdSelect.prototype._isErrorState = function () {
        var /** @type {?} */ isInvalid = this._control && this._control.invalid;
        var /** @type {?} */ isTouched = this._control && this._control.touched;
        var /** @type {?} */ isSubmitted = (this._parentFormGroup && this._parentFormGroup.submitted) ||
            (this._parentForm && this._parentForm.submitted);
        return !!(isInvalid && (isTouched || isSubmitted));
    };
    /**
     * Sets the scroll position of the scroll container. This must be called after
     * the overlay pane is attached or the scroll container element will not yet be
     * present in the DOM.
     * @return {?}
     */
    MdSelect.prototype._setScrollTop = function () {
        var /** @type {?} */ scrollContainer = this.overlayDir.overlayRef.overlayElement.querySelector('.mat-select-panel'); /** @type {?} */
        ((scrollContainer)).scrollTop = this._scrollTop;
    };
    /**
     * @return {?}
     */
    MdSelect.prototype._initializeSelection = function () {
        var _this = this;
        // Defer setting the value in order to avoid the "Expression
        // has changed after it was checked" errors from Angular.
        Promise.resolve().then(function () {
            _this._setSelectionByValue(_this._control ? _this._control.value : _this._value);
        });
    };
    /**
     * Sets the selected option based on a value. If no option can be
     * found with the designated value, the select trigger is cleared.
     * @param {?} value
     * @param {?=} isUserInput
     * @return {?}
     */
    MdSelect.prototype._setSelectionByValue = function (value, isUserInput) {
        var _this = this;
        if (isUserInput === void 0) { isUserInput = false; }
        var /** @type {?} */ isArray = Array.isArray(value);
        if (this.multiple && value && !isArray) {
            throw getMdSelectNonArrayValueError();
        }
        this._clearSelection();
        if (isArray) {
            value.forEach(function (currentValue) { return _this._selectValue(currentValue, isUserInput); });
            this._sortValues();
        }
        else {
            var /** @type {?} */ correspondingOption = this._selectValue(value, isUserInput);
            // Shift focus to the active item. Note that we shouldn't do this in multiple
            // mode, because we don't know what option the user interacted with last.
            if (correspondingOption) {
                this._keyManager.setActiveItem(this.options.toArray().indexOf(correspondingOption));
            }
        }
        this._setValueWidth();
        if (this._selectionModel.isEmpty()) {
            this._placeholderState = '';
        }
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Finds and selects and option based on its value.
     * @param {?} value
     * @param {?=} isUserInput
     * @return {?} Option that has the corresponding value.
     */
    MdSelect.prototype._selectValue = function (value, isUserInput) {
        var _this = this;
        if (isUserInput === void 0) { isUserInput = false; }
        var /** @type {?} */ correspondingOption = this.options.find(function (option) {
            try {
                // Treat null as a special reset value.
                return option.value != null && _this._compareWith(option.value, value);
            }
            catch (error) {
                if (isDevMode()) {
                    // Notify developers of errors in their comparator.
                    console.warn(error);
                }
                return false;
            }
        });
        if (correspondingOption) {
            isUserInput ? correspondingOption._selectViaInteraction() : correspondingOption.select();
            this._selectionModel.select(correspondingOption);
        }
        return correspondingOption;
    };
    /**
     * Clears the select trigger and deselects every option in the list.
     * @param {?=} skip Option that should not be deselected.
     * @return {?}
     */
    MdSelect.prototype._clearSelection = function (skip) {
        this._selectionModel.clear();
        this.options.forEach(function (option) {
            if (option !== skip) {
                option.deselect();
            }
        });
    };
    /**
     * @return {?}
     */
    MdSelect.prototype._getTriggerRect = function () {
        return this.trigger.nativeElement.getBoundingClientRect();
    };
    /**
     * Sets up a key manager to listen to keyboard events on the overlay panel.
     * @return {?}
     */
    MdSelect.prototype._initKeyManager = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.options).withTypeAhead();
        this._tabSubscription = this._keyManager.tabOut.subscribe(function () { return _this.close(); });
    };
    /**
     * Drops current option subscriptions and IDs and resets from scratch.
     * @return {?}
     */
    MdSelect.prototype._resetOptions = function () {
        this._dropSubscriptions();
        this._listenToOptions();
        this._setOptionIds();
        this._setOptionMultiple();
        this._setOptionDisableRipple();
    };
    /**
     * Listens to user-generated selection events on each option.
     * @return {?}
     */
    MdSelect.prototype._listenToOptions = function () {
        var _this = this;
        this._optionSubscription = filter.call(this.optionSelectionChanges, function (event) { return event.isUserInput; }).subscribe(function (event) {
            _this._onSelect(event.source);
            _this._setValueWidth();
            if (!_this.multiple) {
                _this.close();
            }
        });
    };
    /**
     * Invoked when an option is clicked.
     * @param {?} option
     * @return {?}
     */
    MdSelect.prototype._onSelect = function (option) {
        var /** @type {?} */ wasSelected = this._selectionModel.isSelected(option);
        // TODO(crisbeto): handle blank/null options inside multi-select.
        if (this.multiple) {
            this._selectionModel.toggle(option);
            wasSelected ? option.deselect() : option.select();
            this._sortValues();
        }
        else {
            this._clearSelection(option.value == null ? undefined : option);
            if (option.value == null) {
                this._propagateChanges(option.value);
            }
            else {
                this._selectionModel.select(option);
            }
        }
        if (wasSelected !== this._selectionModel.isSelected(option)) {
            this._propagateChanges();
        }
    };
    /**
     * Sorts the model values, ensuring that they keep the same
     * order that they have in the panel.
     * @return {?}
     */
    MdSelect.prototype._sortValues = function () {
        var _this = this;
        if (this._multiple) {
            this._selectionModel.clear();
            this.options.forEach(function (option) {
                if (option.selected) {
                    _this._selectionModel.select(option);
                }
            });
        }
    };
    /**
     * Unsubscribes from all option subscriptions.
     * @return {?}
     */
    MdSelect.prototype._dropSubscriptions = function () {
        if (this._optionSubscription) {
            this._optionSubscription.unsubscribe();
            this._optionSubscription = null;
        }
    };
    /**
     * Emits change event to set the model value.
     * @param {?=} fallbackValue
     * @return {?}
     */
    MdSelect.prototype._propagateChanges = function (fallbackValue) {
        var /** @type {?} */ valueToEmit = null;
        if (Array.isArray(this.selected)) {
            valueToEmit = this.selected.map(function (option) { return option.value; });
        }
        else {
            valueToEmit = this.selected ? this.selected.value : fallbackValue;
        }
        this._value = valueToEmit;
        this._onChange(valueToEmit);
        this.change.emit(new MdSelectChange(this, valueToEmit));
        this.valueChange.emit(valueToEmit);
    };
    /**
     * Records option IDs to pass to the aria-owns property.
     * @return {?}
     */
    MdSelect.prototype._setOptionIds = function () {
        this._optionIds = this.options.map(function (option) { return option.id; }).join(' ');
    };
    /**
     * Sets the `multiple` property on each option. The promise is necessary
     * in order to avoid Angular errors when modifying the property after init.
     * @return {?}
     */
    MdSelect.prototype._setOptionMultiple = function () {
        var _this = this;
        if (this.multiple) {
            Promise.resolve(null).then(function () {
                _this.options.forEach(function (option) { return option.multiple = _this.multiple; });
            });
        }
    };
    /**
     * Sets the `disableRipple` property on each option.
     * @return {?}
     */
    MdSelect.prototype._setOptionDisableRipple = function () {
        var _this = this;
        if (this.options) {
            this.options.forEach(function (option) { return option.disableRipple = _this.disableRipple; });
        }
    };
    /**
     * Must set the width of the selected option's value programmatically
     * because it is absolutely positioned and otherwise will not clip
     * overflow. The selection arrow is 9px wide, add 4px of padding = 13
     * @return {?}
     */
    MdSelect.prototype._setValueWidth = function () {
        this._selectedValueWidth = this._triggerWidth - 13;
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Focuses the selected item. If no option is selected, it will focus
     * the first item instead.
     * @return {?}
     */
    MdSelect.prototype._focusCorrectOption = function () {
        if (this._selectionModel.isEmpty()) {
            this._keyManager.setFirstItemActive();
        }
        else {
            this._keyManager.setActiveItem(/** @type {?} */ ((this._getOptionIndex(this._selectionModel.selected[0]))));
        }
    };
    /**
     * Focuses the select element.
     * @return {?}
     */
    MdSelect.prototype.focus = function () {
        this._elementRef.nativeElement.focus();
    };
    /**
     * Gets the index of the provided option in the option list.
     * @param {?} option
     * @return {?}
     */
    MdSelect.prototype._getOptionIndex = function (option) {
        return this.options.reduce(function (result, current, index) {
            return result === undefined ? (option === current ? index : undefined) : result;
        }, undefined);
    };
    /**
     * Calculates the scroll position and x- and y-offsets of the overlay panel.
     * @return {?}
     */
    MdSelect.prototype._calculateOverlayPosition = function () {
        var /** @type {?} */ items = this._getItemCount();
        var /** @type {?} */ panelHeight = Math.min(items * SELECT_ITEM_HEIGHT, SELECT_PANEL_MAX_HEIGHT);
        var /** @type {?} */ scrollContainerHeight = items * SELECT_ITEM_HEIGHT;
        // The farthest the panel can be scrolled before it hits the bottom
        var /** @type {?} */ maxScroll = scrollContainerHeight - panelHeight;
        if (this._hasValue()) {
            var /** @type {?} */ selectedOptionOffset = ((this._getOptionIndex(this._selectionModel.selected[0])));
            selectedOptionOffset += MdOption.countGroupLabelsBeforeOption(selectedOptionOffset, this.options, this.optionGroups);
            // We must maintain a scroll buffer so the selected option will be scrolled to the
            // center of the overlay panel rather than the top.
            var /** @type {?} */ scrollBuffer = panelHeight / 2;
            this._scrollTop = this._calculateOverlayScroll(selectedOptionOffset, scrollBuffer, maxScroll);
            this._offsetY = this._calculateOverlayOffsetY(selectedOptionOffset, scrollBuffer, maxScroll);
        }
        else {
            // If no option is selected, the panel centers on the first option. In this case,
            // we must only adjust for the height difference between the option element
            // and the trigger element, then multiply it by -1 to ensure the panel moves
            // in the correct direction up the page.
            var /** @type {?} */ groupLabels = MdOption.countGroupLabelsBeforeOption(0, this.options, this.optionGroups);
            this._offsetY = (SELECT_ITEM_HEIGHT - SELECT_TRIGGER_HEIGHT) / 2 * -1 -
                (groupLabels * SELECT_ITEM_HEIGHT);
        }
        this._checkOverlayWithinViewport(maxScroll);
    };
    /**
     * Calculates the scroll position of the select's overlay panel.
     *
     * Attempts to center the selected option in the panel. If the option is
     * too high or too low in the panel to be scrolled to the center, it clamps the
     * scroll position to the min or max scroll positions respectively.
     * @param {?} selectedIndex
     * @param {?} scrollBuffer
     * @param {?} maxScroll
     * @return {?}
     */
    MdSelect.prototype._calculateOverlayScroll = function (selectedIndex, scrollBuffer, maxScroll) {
        var /** @type {?} */ optionOffsetFromScrollTop = SELECT_ITEM_HEIGHT * selectedIndex;
        var /** @type {?} */ halfOptionHeight = SELECT_ITEM_HEIGHT / 2;
        // Starts at the optionOffsetFromScrollTop, which scrolls the option to the top of the
        // scroll container, then subtracts the scroll buffer to scroll the option down to
        // the center of the overlay panel. Half the option height must be re-added to the
        // scrollTop so the option is centered based on its middle, not its top edge.
        var /** @type {?} */ optimalScrollPosition = optionOffsetFromScrollTop - scrollBuffer + halfOptionHeight;
        return clampValue(0, optimalScrollPosition, maxScroll);
    };
    /**
     * Figures out the appropriate animation state for the placeholder.
     * @return {?}
     */
    MdSelect.prototype._getPlaceholderAnimationState = function () {
        if (this.floatPlaceholder === 'never') {
            return '';
        }
        if (this.floatPlaceholder === 'always') {
            return this._floatPlaceholderState();
        }
        return this._placeholderState;
    };
    /**
     * Determines the CSS `opacity` of the placeholder element.
     * @return {?}
     */
    MdSelect.prototype._getPlaceholderOpacity = function () {
        return (this.floatPlaceholder !== 'never' || this._selectionModel.isEmpty()) ? '1' : '0';
    };
    Object.defineProperty(MdSelect.prototype, "_ariaLabel", {
        /**
         * Returns the aria-label of the select component.
         * @return {?}
         */
        get: function () {
            // If an ariaLabelledby value has been set, the select should not overwrite the
            // `aria-labelledby` value by setting the ariaLabel to the placeholder.
            return this.ariaLabelledby ? null : this.ariaLabel || this.placeholder;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the x-offset of the overlay panel in relation to the trigger's top start corner.
     * This must be adjusted to align the selected option text over the trigger text when
     * the panel opens. Will change based on LTR or RTL text direction. Note that the offset
     * can't be calculated until the panel has been attached, because we need to know the
     * content width in order to constrain the panel within the viewport.
     * @return {?}
     */
    MdSelect.prototype._calculateOverlayOffsetX = function () {
        var /** @type {?} */ overlayRect = this.overlayDir.overlayRef.overlayElement.getBoundingClientRect();
        var /** @type {?} */ viewportRect = this._viewportRuler.getViewportRect();
        var /** @type {?} */ isRtl = this._isRtl();
        var /** @type {?} */ paddingWidth = this.multiple ? SELECT_MULTIPLE_PANEL_PADDING_X + SELECT_PANEL_PADDING_X :
            SELECT_PANEL_PADDING_X * 2;
        var /** @type {?} */ offsetX;
        // Adjust the offset, depending on the option padding.
        if (this.multiple) {
            offsetX = SELECT_MULTIPLE_PANEL_PADDING_X;
        }
        else {
            var /** @type {?} */ selected = this._selectionModel.selected[0] || this.options.first;
            offsetX = selected && selected.group ? SELECT_PANEL_INDENT_PADDING_X : SELECT_PANEL_PADDING_X;
        }
        // Invert the offset in LTR.
        if (!isRtl) {
            offsetX *= -1;
        }
        // Determine how much the select overflows on each side.
        var /** @type {?} */ leftOverflow = 0 - (overlayRect.left + offsetX - (isRtl ? paddingWidth : 0));
        var /** @type {?} */ rightOverflow = overlayRect.right + offsetX - viewportRect.width
            + (isRtl ? 0 : paddingWidth);
        // If the element overflows on either side, reduce the offset to allow it to fit.
        if (leftOverflow > 0) {
            offsetX += leftOverflow + SELECT_PANEL_VIEWPORT_PADDING;
        }
        else if (rightOverflow > 0) {
            offsetX -= rightOverflow + SELECT_PANEL_VIEWPORT_PADDING;
        }
        // Set the offset directly in order to avoid having to go through change detection and
        // potentially triggering "changed after it was checked" errors.
        this.overlayDir.offsetX = offsetX;
        this.overlayDir.overlayRef.updatePosition();
    };
    /**
     * Calculates the y-offset of the select's overlay panel in relation to the
     * top start corner of the trigger. It has to be adjusted in order for the
     * selected option to be aligned over the trigger when the panel opens.
     * @param {?} selectedIndex
     * @param {?} scrollBuffer
     * @param {?} maxScroll
     * @return {?}
     */
    MdSelect.prototype._calculateOverlayOffsetY = function (selectedIndex, scrollBuffer, maxScroll) {
        var /** @type {?} */ optionOffsetFromPanelTop;
        if (this._scrollTop === 0) {
            optionOffsetFromPanelTop = selectedIndex * SELECT_ITEM_HEIGHT;
        }
        else if (this._scrollTop === maxScroll) {
            var /** @type {?} */ firstDisplayedIndex = this._getItemCount() - SELECT_MAX_OPTIONS_DISPLAYED;
            var /** @type {?} */ selectedDisplayIndex = selectedIndex - firstDisplayedIndex;
            // Because the panel height is longer than the height of the options alone,
            // there is always extra padding at the top or bottom of the panel. When
            // scrolled to the very bottom, this padding is at the top of the panel and
            // must be added to the offset.
            optionOffsetFromPanelTop =
                selectedDisplayIndex * SELECT_ITEM_HEIGHT + SELECT_PANEL_PADDING_Y;
        }
        else {
            // If the option was scrolled to the middle of the panel using a scroll buffer,
            // its offset will be the scroll buffer minus the half height that was added to
            // center it.
            optionOffsetFromPanelTop = scrollBuffer - SELECT_ITEM_HEIGHT / 2;
        }
        // The final offset is the option's offset from the top, adjusted for the height
        // difference, multiplied by -1 to ensure that the overlay moves in the correct
        // direction up the page.
        return optionOffsetFromPanelTop * -1 - SELECT_OPTION_HEIGHT_ADJUSTMENT;
    };
    /**
     * Checks that the attempted overlay position will fit within the viewport.
     * If it will not fit, tries to adjust the scroll position and the associated
     * y-offset so the panel can open fully on-screen. If it still won't fit,
     * sets the offset back to 0 to allow the fallback position to take over.
     * @param {?} maxScroll
     * @return {?}
     */
    MdSelect.prototype._checkOverlayWithinViewport = function (maxScroll) {
        var /** @type {?} */ viewportRect = this._viewportRuler.getViewportRect();
        var /** @type {?} */ triggerRect = this._getTriggerRect();
        var /** @type {?} */ topSpaceAvailable = triggerRect.top - SELECT_PANEL_VIEWPORT_PADDING;
        var /** @type {?} */ bottomSpaceAvailable = viewportRect.height - triggerRect.bottom - SELECT_PANEL_VIEWPORT_PADDING;
        var /** @type {?} */ panelHeightTop = Math.abs(this._offsetY);
        var /** @type {?} */ totalPanelHeight = Math.min(this._getItemCount() * SELECT_ITEM_HEIGHT, SELECT_PANEL_MAX_HEIGHT);
        var /** @type {?} */ panelHeightBottom = totalPanelHeight - panelHeightTop - triggerRect.height;
        if (panelHeightBottom > bottomSpaceAvailable) {
            this._adjustPanelUp(panelHeightBottom, bottomSpaceAvailable);
        }
        else if (panelHeightTop > topSpaceAvailable) {
            this._adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll);
        }
        else {
            this._transformOrigin = this._getOriginBasedOnOption();
        }
    };
    /**
     * Adjusts the overlay panel up to fit in the viewport.
     * @param {?} panelHeightBottom
     * @param {?} bottomSpaceAvailable
     * @return {?}
     */
    MdSelect.prototype._adjustPanelUp = function (panelHeightBottom, bottomSpaceAvailable) {
        var /** @type {?} */ distanceBelowViewport = panelHeightBottom - bottomSpaceAvailable;
        // Scrolls the panel up by the distance it was extending past the boundary, then
        // adjusts the offset by that amount to move the panel up into the viewport.
        this._scrollTop -= distanceBelowViewport;
        this._offsetY -= distanceBelowViewport;
        this._transformOrigin = this._getOriginBasedOnOption();
        // If the panel is scrolled to the very top, it won't be able to fit the panel
        // by scrolling, so set the offset to 0 to allow the fallback position to take
        // effect.
        if (this._scrollTop <= 0) {
            this._scrollTop = 0;
            this._offsetY = 0;
            this._transformOrigin = "50% bottom 0px";
        }
    };
    /**
     * Adjusts the overlay panel down to fit in the viewport.
     * @param {?} panelHeightTop
     * @param {?} topSpaceAvailable
     * @param {?} maxScroll
     * @return {?}
     */
    MdSelect.prototype._adjustPanelDown = function (panelHeightTop, topSpaceAvailable, maxScroll) {
        var /** @type {?} */ distanceAboveViewport = panelHeightTop - topSpaceAvailable;
        // Scrolls the panel down by the distance it was extending past the boundary, then
        // adjusts the offset by that amount to move the panel down into the viewport.
        this._scrollTop += distanceAboveViewport;
        this._offsetY += distanceAboveViewport;
        this._transformOrigin = this._getOriginBasedOnOption();
        // If the panel is scrolled to the very bottom, it won't be able to fit the
        // panel by scrolling, so set the offset to 0 to allow the fallback position
        // to take effect.
        if (this._scrollTop >= maxScroll) {
            this._scrollTop = maxScroll;
            this._offsetY = 0;
            this._transformOrigin = "50% top 0px";
            return;
        }
    };
    /**
     * Sets the transform origin point based on the selected option.
     * @return {?}
     */
    MdSelect.prototype._getOriginBasedOnOption = function () {
        var /** @type {?} */ originY = Math.abs(this._offsetY) - SELECT_OPTION_HEIGHT_ADJUSTMENT + SELECT_ITEM_HEIGHT / 2;
        return "50% " + originY + "px 0px";
    };
    /**
     * Figures out the floating placeholder state value.
     * @return {?}
     */
    MdSelect.prototype._floatPlaceholderState = function () {
        return this._isRtl() ? 'floating-rtl' : 'floating-ltr';
    };
    /**
     * Handles the user pressing the arrow keys on a closed select.
     * @param {?} event
     * @return {?}
     */
    MdSelect.prototype._handleArrowKey = function (event) {
        if (this._multiple) {
            event.preventDefault();
            this.open();
        }
        else {
            var /** @type {?} */ prevActiveItem = this._keyManager.activeItem;
            // Cycle though the select options even when the select is closed,
            // matching the behavior of the native select element.
            // TODO(crisbeto): native selects also cycle through the options with left/right arrows,
            // however the key manager only supports up/down at the moment.
            this._keyManager.onKeydown(event);
            var /** @type {?} */ currentActiveItem = (this._keyManager.activeItem);
            if (currentActiveItem !== prevActiveItem) {
                this._clearSelection();
                this._setSelectionByValue(currentActiveItem.value, true);
                this._propagateChanges();
            }
        }
    };
    /**
     * Calculates the amount of items in the select. This includes options and group labels.
     * @return {?}
     */
    MdSelect.prototype._getItemCount = function () {
        return this.options.length + this.optionGroups.length;
    };
    return MdSelect;
}(_MdSelectMixinBase));
MdSelect.decorators = [
    { type: Component, args: [{ selector: 'md-select, mat-select',
                template: "<div cdk-overlay-origin class=\"mat-select-trigger\" aria-hidden=\"true\" (click)=\"toggle()\" #origin=\"cdkOverlayOrigin\" #trigger><span class=\"mat-select-placeholder\" [class.mat-floating-placeholder]=\"_hasValue()\" [@transformPlaceholder]=\"_getPlaceholderAnimationState()\" [style.opacity]=\"_getPlaceholderOpacity()\" [style.width.px]=\"_selectedValueWidth\">{{ placeholder }} </span><span class=\"mat-select-value\" *ngIf=\"_hasValue()\"><span class=\"mat-select-value-text\" [ngSwitch]=\"!!customTrigger\"><span *ngSwitchDefault>{{ triggerValue }}</span><ng-content select=\"md-select-trigger, mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content></span></span><span class=\"mat-select-arrow\"></span> <span class=\"mat-select-underline\"></span></div><ng-template cdk-connected-overlay hasBackdrop backdropClass=\"cdk-overlay-transparent-backdrop\" [scrollStrategy]=\"_scrollStrategy\" [origin]=\"origin\" [open]=\"panelOpen\" [positions]=\"_positions\" [minWidth]=\"_triggerWidth\" [offsetY]=\"_offsetY\" (backdropClick)=\"close()\" (attach)=\"_onAttached()\" (detach)=\"close()\"><div class=\"mat-select-panel {{ 'mat-' + color }}\" [ngClass]=\"panelClass\" [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\" (@transformPanel.done)=\"_onPanelDone()\" (keydown)=\"_handlePanelKeydown($event)\" [style.transformOrigin]=\"_transformOrigin\" [class.mat-select-panel-done-animating]=\"_panelDoneAnimating\"><div class=\"mat-select-content\" [@fadeInContent]=\"'showing'\" (@fadeInContent.done)=\"_onFadeInDone()\"><ng-content></ng-content></div></div></ng-template>",
                styles: [".mat-select{display:inline-block;outline:0}.mat-select-trigger{display:flex;align-items:center;height:30px;min-width:112px;cursor:pointer;position:relative;box-sizing:border-box}.mat-select-disabled .mat-select-trigger{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-select-underline{position:absolute;bottom:0;left:0;right:0;height:1px}.mat-select:focus .mat-select-underline{height:2px}.mat-select-disabled .mat-select-underline{background-color:transparent;background-position:0 bottom}.mat-select-placeholder{position:relative;padding:0 2px;transform-origin:left top;flex-grow:1}.mat-select-placeholder.mat-floating-placeholder{top:-22px;left:-2px;text-align:left;transform:scale(.75)}[dir=rtl] .mat-select-placeholder{transform-origin:right top}[dir=rtl] .mat-select-placeholder.mat-floating-placeholder{left:2px;text-align:right}.mat-select-required .mat-select-placeholder::after{content:'*'}.mat-select-value{position:absolute;max-width:calc(100% - 18px);flex-grow:1;top:0;left:0;bottom:0;display:flex;align-items:center}[dir=rtl] .mat-select-value{left:auto;right:0}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:30px}.mat-select-arrow{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;margin:0 4px}.mat-select-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%}.mat-select-panel:not([class*=mat-elevation-z]){box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.mat-select-panel{outline:solid 1px}}"],
                inputs: ['color', 'disabled'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'role': 'listbox',
                    '[attr.tabindex]': 'tabIndex',
                    '[attr.aria-label]': '_ariaLabel',
                    '[attr.aria-labelledby]': 'ariaLabelledby',
                    '[attr.aria-required]': 'required.toString()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-invalid]': '_isErrorState()',
                    '[attr.aria-owns]': '_optionIds',
                    '[attr.aria-multiselectable]': 'multiple',
                    '[class.mat-select-disabled]': 'disabled',
                    '[class.mat-select-invalid]': '_isErrorState()',
                    '[class.mat-select-required]': 'required',
                    'class': 'mat-select',
                    '(keydown)': '_handleClosedKeydown($event)',
                    '(blur)': '_onBlur()',
                },
                animations: [
                    transformPlaceholder,
                    transformPanel,
                    fadeInContent
                ],
                exportAs: 'mdSelect',
            },] },
];
/**
 * @nocollapse
 */
MdSelect.ctorParameters = function () { return [
    { type: ViewportRuler, },
    { type: ChangeDetectorRef, },
    { type: Overlay, },
    { type: Platform, },
    { type: Renderer2, },
    { type: ElementRef, },
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: NgForm, decorators: [{ type: Optional },] },
    { type: FormGroupDirective, decorators: [{ type: Optional },] },
    { type: NgControl, decorators: [{ type: Self }, { type: Optional },] },
    { type: undefined, decorators: [{ type: Attribute, args: ['tabindex',] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_PLACEHOLDER_GLOBAL_OPTIONS,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [MD_SELECT_SCROLL_STRATEGY,] },] },
]; };
MdSelect.propDecorators = {
    'trigger': [{ type: ViewChild, args: ['trigger',] },],
    'overlayDir': [{ type: ViewChild, args: [ConnectedOverlayDirective,] },],
    'options': [{ type: ContentChildren, args: [MdOption, { descendants: true },] },],
    'optionGroups': [{ type: ContentChildren, args: [MdOptgroup,] },],
    'panelClass': [{ type: Input },],
    'customTrigger': [{ type: ContentChild, args: [MdSelectTrigger,] },],
    'placeholder': [{ type: Input },],
    'required': [{ type: Input },],
    'multiple': [{ type: Input },],
    'compareWith': [{ type: Input },],
    'floatPlaceholder': [{ type: Input },],
    'tabIndex': [{ type: Input },],
    'value': [{ type: Input },],
    'disableRipple': [{ type: Input },],
    'ariaLabel': [{ type: Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: Input, args: ['aria-labelledby',] },],
    'onOpen': [{ type: Output },],
    'onClose': [{ type: Output },],
    'change': [{ type: Output },],
    'valueChange': [{ type: Output },],
};
/**
 * Clamps a value n between min and max values.
 * @param {?} min
 * @param {?} n
 * @param {?} max
 * @return {?}
 */
function clampValue(min, n, max) {
    return Math.min(Math.max(min, n), max);
}
var MdSelectModule = (function () {
    function MdSelectModule() {
    }
    return MdSelectModule;
}());
MdSelectModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    OverlayModule,
                    MdOptionModule,
                    MdCommonModule,
                ],
                exports: [MdSelect, MdSelectTrigger, MdOptionModule, MdCommonModule],
                declarations: [MdSelect, MdSelectTrigger],
                providers: [MD_SELECT_SCROLL_STRATEGY_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MdSelectModule.ctorParameters = function () { return []; };
// Increasing integer for generating unique ids for slide-toggle components.
var nextUniqueId$2 = 0;
var MD_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdSlideToggle; }),
    multi: true
};
/**
 * Change event object emitted by a MdSlideToggle.
 */
var MdSlideToggleChange = (function () {
    function MdSlideToggleChange() {
    }
    return MdSlideToggleChange;
}());
/**
 * \@docs-private
 */
var MdSlideToggleBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdSlideToggleBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdSlideToggleBase;
}());
var _MdSlideToggleMixinBase = mixinColor(mixinDisableRipple(mixinDisabled(MdSlideToggleBase)), 'accent');
/**
 * Represents a slidable "switch" toggle that can be moved between on and off.
 */
var MdSlideToggle = (function (_super) {
    tslib_1.__extends(MdSlideToggle, _super);
    /**
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _platform
     * @param {?} _focusOriginMonitor
     * @param {?} _changeDetectorRef
     */
    function MdSlideToggle(elementRef, renderer, _platform, _focusOriginMonitor, _changeDetectorRef) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._platform = _platform;
        _this._focusOriginMonitor = _focusOriginMonitor;
        _this._changeDetectorRef = _changeDetectorRef;
        _this.onChange = function (_) { };
        _this.onTouched = function () { };
        _this._uniqueId = "md-slide-toggle-" + ++nextUniqueId$2;
        _this._required = false;
        _this._checked = false;
        /**
         * Name value will be applied to the input element if present
         */
        _this.name = null;
        /**
         * A unique id for the slide-toggle input. If none is supplied, it will be auto-generated.
         */
        _this.id = _this._uniqueId;
        /**
         * Used to specify the tabIndex value for the underlying input element.
         */
        _this.tabIndex = 0;
        /**
         * Whether the label should appear after or before the slide-toggle. Defaults to 'after'
         */
        _this.labelPosition = 'after';
        /**
         * Used to set the aria-label attribute on the underlying input element.
         */
        _this.ariaLabel = null;
        /**
         * Used to set the aria-labelledby attribute on the underlying input element.
         */
        _this.ariaLabelledby = null;
        /**
         * An event will be dispatched each time the slide-toggle changes its value.
         */
        _this.change = new EventEmitter();
        return _this;
    }
    Object.defineProperty(MdSlideToggle.prototype, "required", {
        /**
         * Whether the slide-toggle is required.
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "checked", {
        /**
         * Whether the slide-toggle element is checked or not
         * @return {?}
         */
        get: function () { return this._checked; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._checked = !!value;
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "inputId", {
        /**
         * Returns the unique id for the visual hidden input.
         * @return {?}
         */
        get: function () { return (this.id || this._uniqueId) + "-input"; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSlideToggle.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._slideRenderer = new SlideToggleRenderer(this._elementRef, this._platform);
        this._focusOriginMonitor
            .monitor(this._inputElement.nativeElement, this._renderer, false)
            .subscribe(function (focusOrigin) { return _this._onInputFocusChange(focusOrigin); });
    };
    /**
     * @return {?}
     */
    MdSlideToggle.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._inputElement.nativeElement);
    };
    /**
     * This function will called if the underlying input changed its value through user interaction.
     * @param {?} event
     * @return {?}
     */
    MdSlideToggle.prototype._onChangeEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        // Sync the value from the underlying input element with the slide-toggle component.
        this.checked = this._inputElement.nativeElement.checked;
        // Emit our custom change event if the native input emitted one.
        // It is important to only emit it, if the native input triggered one, because we don't want
        // to trigger a change event, when the `checked` variable changes programmatically.
        this._emitChangeEvent();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlideToggle.prototype._onInputClick = function (event) {
        // In some situations the user will release the mouse on the label element. The label element
        // redirects the click to the underlying input element and will result in a value change.
        // Prevent the default behavior if dragging, because the value will be set after drag.
        if (this._slideRenderer.dragging) {
            event.preventDefault();
        }
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    MdSlideToggle.prototype.writeValue = function (value) {
        this.checked = !!value;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    MdSlideToggle.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    MdSlideToggle.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    MdSlideToggle.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Focuses the slide-toggle.
     * @return {?}
     */
    MdSlideToggle.prototype.focus = function () {
        this._focusOriginMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
    };
    /**
     * Toggles the checked state of the slide-toggle.
     * @return {?}
     */
    MdSlideToggle.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Function is called whenever the focus changes for the input element.
     * @param {?} focusOrigin
     * @return {?}
     */
    MdSlideToggle.prototype._onInputFocusChange = function (focusOrigin) {
        if (!this._focusRipple && focusOrigin === 'keyboard') {
            // For keyboard focus show a persistent ripple as focus indicator.
            this._focusRipple = this._ripple.launch(0, 0, { persistent: true, centered: true });
        }
        else if (!focusOrigin) {
            this.onTouched();
            // Fade out and clear the focus ripple if one is currently present.
            if (this._focusRipple) {
                this._focusRipple.fadeOut();
                this._focusRipple = null;
            }
        }
    };
    /**
     * Emits a change event on the `change` output. Also notifies the FormControl about the change.
     * @return {?}
     */
    MdSlideToggle.prototype._emitChangeEvent = function () {
        var /** @type {?} */ event = new MdSlideToggleChange();
        event.source = this;
        event.checked = this.checked;
        this.change.emit(event);
        this.onChange(this.checked);
    };
    /**
     * @return {?}
     */
    MdSlideToggle.prototype._onDragStart = function () {
        if (!this.disabled) {
            this._slideRenderer.startThumbDrag(this.checked);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlideToggle.prototype._onDrag = function (event) {
        if (this._slideRenderer.dragging) {
            this._slideRenderer.updateThumbPosition(event.deltaX);
        }
    };
    /**
     * @return {?}
     */
    MdSlideToggle.prototype._onDragEnd = function () {
        var _this = this;
        if (this._slideRenderer.dragging) {
            var /** @type {?} */ _previousChecked = this.checked;
            this.checked = this._slideRenderer.dragPercentage > 50;
            if (_previousChecked !== this.checked) {
                this._emitChangeEvent();
            }
            // The drag should be stopped outside of the current event handler, because otherwise the
            // click event will be fired before and will revert the drag change.
            setTimeout(function () { return _this._slideRenderer.stopThumbDrag(); });
        }
    };
    return MdSlideToggle;
}(_MdSlideToggleMixinBase));
MdSlideToggle.decorators = [
    { type: Component, args: [{ selector: 'md-slide-toggle, mat-slide-toggle',
                host: {
                    'class': 'mat-slide-toggle',
                    '[id]': 'id',
                    '[class.mat-checked]': 'checked',
                    '[class.mat-disabled]': 'disabled',
                    '[class.mat-slide-toggle-label-before]': 'labelPosition == "before"',
                },
                template: "<label class=\"mat-slide-toggle-label\" #label><div class=\"mat-slide-toggle-bar\"><input #input class=\"mat-slide-toggle-input cdk-visually-hidden\" type=\"checkbox\" [id]=\"inputId\" [required]=\"required\" [tabIndex]=\"tabIndex\" [checked]=\"checked\" [disabled]=\"disabled\" [attr.name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onChangeEvent($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-slide-toggle-thumb-container\" (slidestart)=\"_onDragStart()\" (slide)=\"_onDrag($event)\" (slideend)=\"_onDragEnd()\"><div class=\"mat-slide-toggle-thumb\"></div><div class=\"mat-slide-toggle-ripple\" md-ripple [mdRippleTrigger]=\"label\" [mdRippleCentered]=\"true\" [mdRippleDisabled]=\"disableRipple || disabled\"></div></div></div><span class=\"mat-slide-toggle-content\"><ng-content></ng-content></span></label>",
                styles: [".mat-slide-toggle{display:inline-block;height:24px;line-height:24px;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0}.mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(16px,0,0)}.mat-slide-toggle.mat-disabled .mat-slide-toggle-label,.mat-slide-toggle.mat-disabled .mat-slide-toggle-thumb-container{cursor:default}.mat-slide-toggle-label{display:flex;flex:1;flex-direction:row;align-items:center;cursor:pointer}.mat-slide-toggle-label-before .mat-slide-toggle-label{order:1}.mat-slide-toggle-label-before .mat-slide-toggle-bar{order:2}.mat-slide-toggle-bar,[dir=rtl] .mat-slide-toggle-label-before .mat-slide-toggle-bar{margin-right:8px;margin-left:0}.mat-slide-toggle-label-before .mat-slide-toggle-bar,[dir=rtl] .mat-slide-toggle-bar{margin-left:8px;margin-right:0}.mat-slide-toggle-thumb-container{position:absolute;z-index:1;width:20px;height:20px;top:-3px;left:0;transform:translate3d(0,0,0);transition:all 80ms linear;transition-property:transform;cursor:-webkit-grab;cursor:grab}.mat-slide-toggle-thumb-container.mat-dragging,.mat-slide-toggle-thumb-container:active{cursor:-webkit-grabbing;cursor:grabbing;transition-duration:0s}.mat-slide-toggle-thumb{height:20px;width:20px;border-radius:50%;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.mat-slide-toggle-thumb{background:#fff;border:solid 1px #000}}.mat-slide-toggle-bar{position:relative;width:36px;height:14px;border-radius:8px}@media screen and (-ms-high-contrast:active){.mat-slide-toggle-bar{background:#fff}}.mat-slide-toggle-input{bottom:0;left:10px}.mat-slide-toggle-bar,.mat-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}.mat-slide-toggle-ripple{position:absolute;top:-13px;left:-13px;height:46px;width:46px;border-radius:50%;z-index:1;pointer-events:none}"],
                providers: [MD_SLIDE_TOGGLE_VALUE_ACCESSOR],
                inputs: ['disabled', 'disableRipple', 'color'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdSlideToggle.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: Platform, },
    { type: FocusOriginMonitor, },
    { type: ChangeDetectorRef, },
]; };
MdSlideToggle.propDecorators = {
    'name': [{ type: Input },],
    'id': [{ type: Input },],
    'tabIndex': [{ type: Input },],
    'labelPosition': [{ type: Input },],
    'ariaLabel': [{ type: Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: Input, args: ['aria-labelledby',] },],
    'required': [{ type: Input },],
    'checked': [{ type: Input },],
    'change': [{ type: Output },],
    '_inputElement': [{ type: ViewChild, args: ['input',] },],
    '_ripple': [{ type: ViewChild, args: [MdRipple,] },],
};
/**
 * Renderer for the Slide Toggle component, which separates DOM modification in its own class
 */
var SlideToggleRenderer = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} platform
     */
    function SlideToggleRenderer(_elementRef, platform) {
        this._elementRef = _elementRef;
        /**
         * Whether the thumb is currently being dragged.
         */
        this.dragging = false;
        // We only need to interact with these elements when we're on the browser, so only grab
        // the reference in that case.
        if (platform.isBrowser) {
            this._thumbEl = _elementRef.nativeElement.querySelector('.mat-slide-toggle-thumb-container');
            this._thumbBarEl = _elementRef.nativeElement.querySelector('.mat-slide-toggle-bar');
        }
    }
    /**
     * Initializes the drag of the slide-toggle.
     * @param {?} checked
     * @return {?}
     */
    SlideToggleRenderer.prototype.startThumbDrag = function (checked) {
        if (this.dragging) {
            return;
        }
        this._thumbBarWidth = this._thumbBarEl.clientWidth - this._thumbEl.clientWidth;
        this._thumbEl.classList.add('mat-dragging');
        this._previousChecked = checked;
        this.dragging = true;
    };
    /**
     * Resets the current drag and returns the new checked value.
     * @return {?}
     */
    SlideToggleRenderer.prototype.stopThumbDrag = function () {
        if (!this.dragging) {
            return false;
        }
        this.dragging = false;
        this._thumbEl.classList.remove('mat-dragging');
        // Reset the transform because the component will take care of the thumb position after drag.
        applyCssTransform(this._thumbEl, '');
        return this.dragPercentage > 50;
    };
    /**
     * Updates the thumb containers position from the specified distance.
     * @param {?} distance
     * @return {?}
     */
    SlideToggleRenderer.prototype.updateThumbPosition = function (distance) {
        this.dragPercentage = this._getDragPercentage(distance);
        // Calculate the moved distance based on the thumb bar width.
        var /** @type {?} */ dragX = (this.dragPercentage / 100) * this._thumbBarWidth;
        applyCssTransform(this._thumbEl, "translate3d(" + dragX + "px, 0, 0)");
    };
    /**
     * Retrieves the percentage of thumb from the moved distance. Percentage as fraction of 100.
     * @param {?} distance
     * @return {?}
     */
    SlideToggleRenderer.prototype._getDragPercentage = function (distance) {
        var /** @type {?} */ percentage = (distance / this._thumbBarWidth) * 100;
        // When the toggle was initially checked, then we have to start the drag at the end.
        if (this._previousChecked) {
            percentage += 100;
        }
        return Math.max(0, Math.min(percentage, 100));
    };
    return SlideToggleRenderer;
}());
var MdSlideToggleModule = (function () {
    function MdSlideToggleModule() {
    }
    return MdSlideToggleModule;
}());
MdSlideToggleModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdRippleModule, MdCommonModule, PlatformModule],
                exports: [MdSlideToggle, MdCommonModule],
                declarations: [MdSlideToggle],
                providers: [
                    FOCUS_ORIGIN_MONITOR_PROVIDER,
                    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
                ],
            },] },
];
/**
 * @nocollapse
 */
MdSlideToggleModule.ctorParameters = function () { return []; };
/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 */
var MIN_AUTO_TICK_SEPARATION = 30;
/**
 * The thumb gap size for a disabled slider.
 */
var DISABLED_THUMB_GAP = 7;
/**
 * The thumb gap size for a non-active slider at its minimum value.
 */
var MIN_VALUE_NONACTIVE_THUMB_GAP = 7;
/**
 * The thumb gap size for an active slider at its minimum value.
 */
var MIN_VALUE_ACTIVE_THUMB_GAP = 10;
/**
 * Provider Expression that allows md-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 */
var MD_SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdSlider; }),
    multi: true
};
/**
 * A simple change event emitted by the MdSlider component.
 */
var MdSliderChange = (function () {
    function MdSliderChange() {
    }
    return MdSliderChange;
}());
/**
 * \@docs-private
 */
var MdSliderBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdSliderBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdSliderBase;
}());
var _MdSliderMixinBase = mixinColor(mixinDisabled(MdSliderBase), 'accent');
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
var MdSlider = (function (_super) {
    tslib_1.__extends(MdSlider, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _focusOriginMonitor
     * @param {?} _changeDetectorRef
     * @param {?} _dir
     */
    function MdSlider(renderer, elementRef, _focusOriginMonitor, _changeDetectorRef, _dir) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._focusOriginMonitor = _focusOriginMonitor;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._dir = _dir;
        _this._invert = false;
        _this._max = 100;
        _this._min = 0;
        _this._step = 1;
        _this._thumbLabel = false;
        _this._tickInterval = 0;
        _this._value = null;
        _this._vertical = false;
        /**
         * Event emitted when the slider value has changed.
         */
        _this.change = new EventEmitter();
        /**
         * Event emitted when the slider thumb moves.
         */
        _this.input = new EventEmitter();
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         */
        _this.onTouched = function () { };
        _this._percent = 0;
        /**
         * Whether or not the thumb is sliding.
         * Used to determine if there should be a transition for the thumb and fill track.
         */
        _this._isSliding = false;
        /**
         * Whether or not the slider is active (clicked or sliding).
         * Used to shrink and grow the thumb as according to the Material Design spec.
         */
        _this._isActive = false;
        /**
         * The size of a tick interval as a percentage of the size of the track.
         */
        _this._tickIntervalPercent = 0;
        /**
         * The dimensions of the slider.
         */
        _this._sliderDimensions = null;
        _this._controlValueAccessorChangeFn = function () { };
        _this._focusOriginMonitor
            .monitor(_this._elementRef.nativeElement, renderer, true)
            .subscribe(function (origin) { return _this._isActive = !!origin && origin !== 'keyboard'; });
        return _this;
    }
    Object.defineProperty(MdSlider.prototype, "invert", {
        /**
         * Whether the slider is inverted.
         * @return {?}
         */
        get: function () { return this._invert; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._invert = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "max", {
        /**
         * The maximum value that the slider can have.
         * @return {?}
         */
        get: function () { return this._max; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._max = coerceNumberProperty(v, this._max);
            this._percent = this._calculatePercentage(this._value);
            // Since this also modifies the percentage, we need to let the change detection know.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "min", {
        /**
         * The minimum value that the slider can have.
         * @return {?}
         */
        get: function () { return this._min; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._min = coerceNumberProperty(v, this._min);
            // If the value wasn't explicitly set by the user, set it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            this._percent = this._calculatePercentage(this._value);
            // Since this also modifies the percentage, we need to let the change detection know.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "step", {
        /**
         * The values at which the thumb will snap.
         * @return {?}
         */
        get: function () { return this._step; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._step = coerceNumberProperty(v, this._step);
            if (this._step % 1 !== 0) {
                this._roundLabelTo = ((this._step.toString().split('.').pop())).length;
            }
            // Since this could modify the label, we need to notify the change detection.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "thumbLabel", {
        /**
         * Whether or not to show the thumb label.
         * @return {?}
         */
        get: function () { return this._thumbLabel; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._thumbLabel = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_thumbLabelDeprecated", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this._thumbLabel; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._thumbLabel = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "tickInterval", {
        /**
         * How often to show ticks. Relative to the step so that a tick always appears on a step.
         * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
         * @return {?}
         */
        get: function () { return this._tickInterval; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value === 'auto') {
                this._tickInterval = 'auto';
            }
            else if (typeof value === 'number' || typeof value === 'string') {
                this._tickInterval = coerceNumberProperty(value, /** @type {?} */ (this._tickInterval));
            }
            else {
                this._tickInterval = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_tickIntervalDeprecated", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this.tickInterval; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.tickInterval = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "value", {
        /**
         * Value of the slider.
         * @return {?}
         */
        get: function () {
            // If the value needs to be read and it is still uninitialized, initialize it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            return this._value;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            if (v !== this._value) {
                this._value = coerceNumberProperty(v, this._value || 0);
                this._percent = this._calculatePercentage(this._value);
                // Since this also modifies the percentage, we need to let the change detection know.
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "vertical", {
        /**
         * Whether the slider is vertical.
         * @return {?}
         */
        get: function () { return this._vertical; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "displayValue", {
        /**
         * The value to be used for display purposes.
         * @return {?}
         */
        get: function () {
            // Note that this could be improved further by rounding something like 0.999 to 1 or
            // 0.899 to 0.9, however it is very performance sensitive, because it gets called on
            // every change detection cycle.
            if (this._roundLabelTo && this.value && this.value % 1 !== 0) {
                return this.value.toFixed(this._roundLabelTo);
            }
            return this.value || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "percent", {
        /**
         * The percentage of the slider that coincides with the value.
         * @return {?}
         */
        get: function () { return this._clamp(this._percent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_invertAxis", {
        /**
         * Whether the axis of the slider is inverted.
         * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's value).
         * @return {?}
         */
        get: function () {
            // Standard non-inverted mode for a vertical slider should be dragging the thumb from bottom to
            // top. However from a y-axis standpoint this is inverted.
            return this.vertical ? !this.invert : this.invert;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_isMinValue", {
        /**
         * Whether the slider is at its minimum value.
         * @return {?}
         */
        get: function () {
            return this.percent === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_thumbGap", {
        /**
         * The amount of space to leave between the slider thumb and the track fill & track background
         * elements.
         * @return {?}
         */
        get: function () {
            if (this.disabled) {
                return DISABLED_THUMB_GAP;
            }
            if (this._isMinValue && !this.thumbLabel) {
                return this._isActive ? MIN_VALUE_ACTIVE_THUMB_GAP : MIN_VALUE_NONACTIVE_THUMB_GAP;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_trackBackgroundStyles", {
        /**
         * CSS styles for the track background element.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            var /** @type {?} */ sign = this._invertMouseCoords ? '-' : '';
            return {
                'transform': "translate" + axis + "(" + sign + this._thumbGap + "px) scale" + axis + "(" + (1 - this.percent) + ")"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_trackFillStyles", {
        /**
         * CSS styles for the track fill element.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            var /** @type {?} */ sign = this._invertMouseCoords ? '' : '-';
            return {
                'transform': "translate" + axis + "(" + sign + this._thumbGap + "px) scale" + axis + "(" + this.percent + ")"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_ticksContainerStyles", {
        /**
         * CSS styles for the ticks container element.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the ticks container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var /** @type {?} */ sign = !this.vertical && this._direction == 'rtl' ? '' : '-';
            var /** @type {?} */ offset = this._tickIntervalPercent / 2 * 100;
            return {
                'transform': "translate" + axis + "(" + sign + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_ticksStyles", {
        /**
         * CSS styles for the ticks element.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ tickSize = this._tickIntervalPercent * 100;
            var /** @type {?} */ backgroundSize = this.vertical ? "2px " + tickSize + "%" : tickSize + "% 2px";
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            // Depending on the direction we pushed the ticks container, push the ticks the opposite
            // direction to re-center them but clip off the end edge. In RTL languages we need to flip the
            // ticks 180 degrees so we're really cutting off the end edge abd not the start.
            var /** @type {?} */ sign = !this.vertical && this._direction == 'rtl' ? '-' : '';
            var /** @type {?} */ rotate = !this.vertical && this._direction == 'rtl' ? ' rotate(180deg)' : '';
            var /** @type {?} */ styles = {
                'backgroundSize': backgroundSize,
                // Without translateZ ticks sometimes jitter as the slider moves on Chrome & Firefox.
                'transform': "translateZ(0) translate" + axis + "(" + sign + tickSize / 2 + "%)" + rotate
            };
            if (this._isMinValue && this._thumbGap) {
                var /** @type {?} */ side = this.vertical ?
                    (this._invertAxis ? 'Bottom' : 'Top') :
                    (this._invertAxis ? 'Right' : 'Left');
                styles["padding" + side] = this._thumbGap + "px";
            }
            return styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_thumbContainerStyles", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the thumb container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var /** @type {?} */ invertOffset = (this._direction == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
            var /** @type {?} */ offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
            return {
                'transform': "translate" + axis + "(-" + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_invertMouseCoords", {
        /**
         * Whether mouse events should be converted to a slider position by calculating their distance
         * from the right or bottom edge of the slider as opposed to the top or left.
         * @return {?}
         */
        get: function () {
            return (this._direction == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_direction", {
        /**
         * The language direction for this slider element.
         * @return {?}
         */
        get: function () {
            return (this._dir && this._dir.value == 'rtl') ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSlider.prototype.ngOnDestroy = function () {
        this._focusOriginMonitor.stopMonitoring(this._elementRef.nativeElement);
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onMouseenter = function () {
        if (this.disabled) {
            return;
        }
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlider.prototype._onClick = function (event) {
        if (this.disabled) {
            return;
        }
        var /** @type {?} */ oldValue = this.value;
        this._isSliding = false;
        this._focusHostElement();
        this._updateValueFromPosition({ x: event.clientX, y: event.clientY });
        /* Emit a change and input event if the value changed. */
        if (oldValue != this.value) {
            this._emitInputEvent();
            this._emitChangeEvent();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlider.prototype._onSlide = function (event) {
        if (this.disabled) {
            return;
        }
        // The slide start event sometimes fails to fire on iOS, so if we're not already in the sliding
        // state, call the slide start handler manually.
        if (!this._isSliding) {
            this._onSlideStart(null);
        }
        // Prevent the slide from selecting anything else.
        event.preventDefault();
        var /** @type {?} */ oldValue = this.value;
        this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
        // Native range elements always emit `input` events when the value changed while sliding.
        if (oldValue != this.value) {
            this._emitInputEvent();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlider.prototype._onSlideStart = function (event) {
        if (this.disabled) {
            return;
        }
        // Simulate mouseenter in case this is a mobile device.
        this._onMouseenter();
        this._isSliding = true;
        this._focusHostElement();
        this._valueOnSlideStart = this.value;
        if (event) {
            this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
            event.preventDefault();
        }
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onSlideEnd = function () {
        this._isSliding = false;
        if (this._valueOnSlideStart != this.value) {
            this._emitChangeEvent();
        }
        this._valueOnSlideStart = null;
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onFocus = function () {
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onBlur = function () {
        this.onTouched();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdSlider.prototype._onKeydown = function (event) {
        if (this.disabled) {
            return;
        }
        var /** @type {?} */ oldValue = this.value;
        switch (event.keyCode) {
            case PAGE_UP:
                this._increment(10);
                break;
            case PAGE_DOWN:
                this._increment(-10);
                break;
            case END:
                this.value = this.max;
                break;
            case HOME:
                this.value = this.min;
                break;
            case LEFT_ARROW:
                // NOTE: For a sighted user it would make more sense that when they press an arrow key on an
                // inverted slider the thumb moves in that direction. However for a blind user, nothing
                // about the slider indicates that it is inverted. They will expect left to be decrement,
                // regardless of how it appears on the screen. For speakers ofRTL languages, they probably
                // expect left to mean increment. Therefore we flip the meaning of the side arrow keys for
                // RTL. For inverted sliders we prefer a good a11y experience to having it "look right" for
                // sighted users, therefore we do not swap the meaning.
                this._increment(this._direction == 'rtl' ? 1 : -1);
                break;
            case UP_ARROW:
                this._increment(1);
                break;
            case RIGHT_ARROW:
                // See comment on LEFT_ARROW about the conditions under which we flip the meaning.
                this._increment(this._direction == 'rtl' ? -1 : 1);
                break;
            case DOWN_ARROW:
                this._increment(-1);
                break;
            default:
                // Return if the key is not one that we explicitly handle to avoid calling preventDefault on
                // it.
                return;
        }
        if (oldValue != this.value) {
            this._emitInputEvent();
            this._emitChangeEvent();
        }
        this._isSliding = true;
        event.preventDefault();
    };
    /**
     * @return {?}
     */
    MdSlider.prototype._onKeyup = function () {
        this._isSliding = false;
    };
    /**
     * Increments the slider by the given number of steps (negative number decrements).
     * @param {?} numSteps
     * @return {?}
     */
    MdSlider.prototype._increment = function (numSteps) {
        this.value = this._clamp((this.value || 0) + this.step * numSteps, this.min, this.max);
    };
    /**
     * Calculate the new value from the new physical location. The value will always be snapped.
     * @param {?} pos
     * @return {?}
     */
    MdSlider.prototype._updateValueFromPosition = function (pos) {
        if (!this._sliderDimensions) {
            return;
        }
        var /** @type {?} */ offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        var /** @type {?} */ size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        var /** @type {?} */ posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        var /** @type {?} */ percent = this._clamp((posComponent - offset) / size);
        if (this._invertMouseCoords) {
            percent = 1 - percent;
        }
        var /** @type {?} */ exactValue = this._calculateValue(percent);
        // This calculation finds the closest step by finding the closest whole number divisible by the
        // step relative to the min.
        var /** @type {?} */ closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
        // The value needs to snap to the min and max.
        this.value = this._clamp(closestValue, this.min, this.max);
    };
    /**
     * Emits a change event if the current value is different from the last emitted value.
     * @return {?}
     */
    MdSlider.prototype._emitChangeEvent = function () {
        this._controlValueAccessorChangeFn(this.value);
        this.change.emit(this._createChangeEvent());
    };
    /**
     * Emits an input event when the current value is different from the last emitted value.
     * @return {?}
     */
    MdSlider.prototype._emitInputEvent = function () {
        this.input.emit(this._createChangeEvent());
    };
    /**
     * Updates the amount of space between ticks as a percentage of the width of the slider.
     * @return {?}
     */
    MdSlider.prototype._updateTickIntervalPercent = function () {
        if (!this.tickInterval || !this._sliderDimensions) {
            return;
        }
        if (this.tickInterval == 'auto') {
            var /** @type {?} */ trackSize = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
            var /** @type {?} */ pixelsPerStep = trackSize * this.step / (this.max - this.min);
            var /** @type {?} */ stepsPerTick = Math.ceil(MIN_AUTO_TICK_SEPARATION / pixelsPerStep);
            var /** @type {?} */ pixelsPerTick = stepsPerTick * this.step;
            this._tickIntervalPercent = pixelsPerTick / trackSize;
        }
        else {
            this._tickIntervalPercent = this.tickInterval * this.step / (this.max - this.min);
        }
    };
    /**
     * Creates a slider change object from the specified value.
     * @param {?=} value
     * @return {?}
     */
    MdSlider.prototype._createChangeEvent = function (value) {
        if (value === void 0) { value = this.value; }
        var /** @type {?} */ event = new MdSliderChange();
        event.source = this;
        event.value = value;
        return event;
    };
    /**
     * Calculates the percentage of the slider that a value is.
     * @param {?} value
     * @return {?}
     */
    MdSlider.prototype._calculatePercentage = function (value) {
        return ((value || 0) - this.min) / (this.max - this.min);
    };
    /**
     * Calculates the value a percentage of the slider corresponds to.
     * @param {?} percentage
     * @return {?}
     */
    MdSlider.prototype._calculateValue = function (percentage) {
        return this.min + percentage * (this.max - this.min);
    };
    /**
     * Return a number between two numbers.
     * @param {?} value
     * @param {?=} min
     * @param {?=} max
     * @return {?}
     */
    MdSlider.prototype._clamp = function (value, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return Math.max(min, Math.min(value, max));
    };
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     * @return {?}
     */
    MdSlider.prototype._getSliderDimensions = function () {
        return this._sliderWrapper ? this._sliderWrapper.nativeElement.getBoundingClientRect() : null;
    };
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     * @return {?}
     */
    MdSlider.prototype._focusHostElement = function () {
        this._elementRef.nativeElement.focus();
    };
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    MdSlider.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * Registers a callback to eb triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    MdSlider.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn Callback to be registered.
     * @return {?}
     */
    MdSlider.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    MdSlider.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    return MdSlider;
}(_MdSliderMixinBase));
MdSlider.decorators = [
    { type: Component, args: [{ selector: 'md-slider, mat-slider',
                providers: [MD_SLIDER_VALUE_ACCESSOR],
                host: {
                    '(focus)': '_onFocus()',
                    '(blur)': '_onBlur()',
                    '(click)': '_onClick($event)',
                    '(keydown)': '_onKeydown($event)',
                    '(keyup)': '_onKeyup()',
                    '(mouseenter)': '_onMouseenter()',
                    '(slide)': '_onSlide($event)',
                    '(slideend)': '_onSlideEnd()',
                    '(slidestart)': '_onSlideStart($event)',
                    'class': 'mat-slider',
                    'role': 'slider',
                    'tabindex': '0',
                    '[attr.aria-disabled]': 'disabled',
                    '[attr.aria-valuemax]': 'max',
                    '[attr.aria-valuemin]': 'min',
                    '[attr.aria-valuenow]': 'value',
                    '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
                    '[class.mat-slider-disabled]': 'disabled',
                    '[class.mat-slider-has-ticks]': 'tickInterval',
                    '[class.mat-slider-horizontal]': '!vertical',
                    '[class.mat-slider-axis-inverted]': '_invertAxis',
                    '[class.mat-slider-sliding]': '_isSliding',
                    '[class.mat-slider-thumb-label-showing]': 'thumbLabel',
                    '[class.mat-slider-vertical]': 'vertical',
                    '[class.mat-slider-min-value]': '_isMinValue',
                    '[class.mat-slider-hide-last-tick]': 'disabled || _isMinValue && _thumbGap && _invertAxis',
                },
                template: "<div class=\"mat-slider-wrapper\" #sliderWrapper><div class=\"mat-slider-track-wrapper\"><div class=\"mat-slider-track-background\" [ngStyle]=\"_trackBackgroundStyles\"></div><div class=\"mat-slider-track-fill\" [ngStyle]=\"_trackFillStyles\"></div></div><div class=\"mat-slider-ticks-container\" [ngStyle]=\"_ticksContainerStyles\"><div class=\"mat-slider-ticks\" [ngStyle]=\"_ticksStyles\"></div></div><div class=\"mat-slider-thumb-container\" [ngStyle]=\"_thumbContainerStyles\"><div class=\"mat-slider-focus-ring\"></div><div class=\"mat-slider-thumb\"></div><div class=\"mat-slider-thumb-label\"><span class=\"mat-slider-thumb-label-text\">{{displayValue}}</span></div></div></div>",
                styles: [".mat-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:0;vertical-align:middle}.mat-slider-wrapper{position:absolute}.mat-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mat-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-track-background{position:absolute;transform-origin:100% 100%;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mat-slider-ticks{background-repeat:repeat;background-clip:content-box;box-sizing:border-box;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-thumb-container{position:absolute;z-index:1;transition:transform .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1),opacity .4s cubic-bezier(.25,.8,.25,1)}.cdk-keyboard-focused .mat-slider-focus-ring{transform:scale(1);opacity:1}.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb,.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb-label{cursor:-webkit-grab;cursor:grab}.mat-slider-sliding:not(.mat-slider-disabled) .mat-slider-thumb,.mat-slider-sliding:not(.mat-slider-disabled) .mat-slider-thumb-label,.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb-label:active,.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb:active{cursor:-webkit-grabbing;cursor:grabbing}.mat-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid transparent;border-radius:50%;transform:scale(.7);transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1),border-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform .4s cubic-bezier(.25,.8,.25,1),border-radius .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-sliding .mat-slider-thumb-container,.mat-slider-sliding .mat-slider-track-background,.mat-slider-sliding .mat-slider-track-fill{transition-duration:0s}.mat-slider-has-ticks .mat-slider-wrapper::after{content:'';position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after{opacity:1}.mat-slider-has-ticks.cdk-focused:not(.mat-slider-disabled) .mat-slider-ticks,.mat-slider-has-ticks:hover:not(.mat-slider-disabled) .mat-slider-ticks{opacity:1}.mat-slider-thumb-label-showing .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-thumb-label-showing .mat-slider-thumb-label{display:flex}.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:100% 100%}.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:0 0}.cdk-focused.mat-slider-thumb-label-showing .mat-slider-thumb{transform:scale(0)}.cdk-focused .mat-slider-thumb-label{border-radius:50% 50% 0}.cdk-focused .mat-slider-thumb-label-text{opacity:1}.cdk-mouse-focused .mat-slider-thumb,.cdk-program-focused .mat-slider-thumb,.cdk-touch-focused .mat-slider-thumb{border-width:2px;transform:scale(1)}.mat-slider-disabled .mat-slider-focus-ring{transform:scale(0);opacity:0}.mat-slider-disabled .mat-slider-thumb{border-width:4px;transform:scale(.5)}.mat-slider-disabled .mat-slider-thumb-label{display:none}.mat-slider-horizontal{height:48px;min-width:128px}.mat-slider-horizontal .mat-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mat-slider-horizontal .mat-slider-wrapper::after{height:2px;border-left-width:2px;right:0;top:0}.mat-slider-horizontal .mat-slider-track-wrapper{height:2px;width:100%}.mat-slider-horizontal .mat-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mat-slider-horizontal .mat-slider-track-background{height:2px;width:100%;transform:scaleX(1)}.mat-slider-horizontal .mat-slider-ticks-container{height:2px;width:100%}.mat-slider-horizontal .mat-slider-ticks{height:2px;width:100%}.mat-slider-horizontal .mat-slider-thumb-container{width:100%;height:0;top:50%}.mat-slider-horizontal .mat-slider-focus-ring{top:-15px;right:-15px}.mat-slider-horizontal .mat-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(.01) rotate(45deg)}.mat-slider-horizontal .mat-slider-thumb-label-text{transform:rotate(-45deg)}.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label{transform:rotate(45deg)}.mat-slider-vertical{width:48px;min-height:128px}.mat-slider-vertical .mat-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mat-slider-vertical .mat-slider-wrapper::after{width:2px;border-top-width:2px;bottom:0;left:0}.mat-slider-vertical .mat-slider-track-wrapper{height:100%;width:2px}.mat-slider-vertical .mat-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mat-slider-vertical .mat-slider-track-background{height:100%;width:2px;transform:scaleY(1)}.mat-slider-vertical .mat-slider-ticks-container{width:2px;height:100%}.mat-slider-vertical .mat-slider-focus-ring{bottom:-15px;left:-15px}.mat-slider-vertical .mat-slider-ticks{width:2px;height:100%}.mat-slider-vertical .mat-slider-thumb-container{height:100%;width:0;left:50%}.mat-slider-vertical .mat-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(.01) rotate(-45deg)}.mat-slider-vertical .mat-slider-thumb-label-text{transform:rotate(45deg)}.mat-slider-vertical.cdk-focused .mat-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mat-slider-wrapper::after{left:0;right:auto}[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .mat-slider-horizontal .mat-slider-track-background{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill{transform-origin:0 0}[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background{transform-origin:100% 100%}"],
                inputs: ['disabled', 'color'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdSlider.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: FocusOriginMonitor, },
    { type: ChangeDetectorRef, },
    { type: Directionality, decorators: [{ type: Optional },] },
]; };
MdSlider.propDecorators = {
    'invert': [{ type: Input },],
    'max': [{ type: Input },],
    'min': [{ type: Input },],
    'step': [{ type: Input },],
    'thumbLabel': [{ type: Input },],
    '_thumbLabelDeprecated': [{ type: Input, args: ['thumb-label',] },],
    'tickInterval': [{ type: Input },],
    '_tickIntervalDeprecated': [{ type: Input, args: ['tick-interval',] },],
    'value': [{ type: Input },],
    'vertical': [{ type: Input },],
    'change': [{ type: Output },],
    'input': [{ type: Output },],
    '_sliderWrapper': [{ type: ViewChild, args: ['sliderWrapper',] },],
};
var MdSliderModule = (function () {
    function MdSliderModule() {
    }
    return MdSliderModule;
}());
MdSliderModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, MdCommonModule, StyleModule, BidiModule],
                exports: [MdSlider, MdCommonModule],
                declarations: [MdSlider],
                providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }]
            },] },
];
/**
 * @nocollapse
 */
MdSliderModule.ctorParameters = function () { return []; };
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
         * Whether the drawer can be closed with the escape key or not.
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
        // If a `Dir` directive exists up the tree, listen direction changes and update the left/right
        // properties to point to the proper start/end.
        if (_dir != null) {
            _dir.change.subscribe(function () { return _this._validateDrawers(); });
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
        takeUntil.call(drawer.onPositionChanged, this._drawers.changes).subscribe(function () { return first.call(_this._ngZone.onMicrotaskEmpty).subscribe(function () { return _this._validateDrawers(); }); });
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
 * \@docs-private
 */
var MdListBase = (function () {
    function MdListBase() {
    }
    return MdListBase;
}());
var _MdListMixinBase = mixinDisableRipple(MdListBase);
/**
 * \@docs-private
 */
var MdListItemBase = (function () {
    function MdListItemBase() {
    }
    return MdListItemBase;
}());
var _MdListItemMixinBase = mixinDisableRipple(MdListItemBase);
var MdListDivider = (function () {
    function MdListDivider() {
    }
    return MdListDivider;
}());
MdListDivider.decorators = [
    { type: Directive, args: [{
                selector: 'md-divider, mat-divider',
                host: {
                    'role': 'separator',
                    'aria-orientation': 'horizontal'
                }
            },] },
];
/**
 * @nocollapse
 */
MdListDivider.ctorParameters = function () { return []; };
var MdList = (function (_super) {
    tslib_1.__extends(MdList, _super);
    function MdList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdList;
}(_MdListMixinBase));
MdList.decorators = [
    { type: Component, args: [{ selector: 'md-list, mat-list, md-nav-list, mat-nav-list',
                host: { 'role': 'list' },
                template: '<ng-content></ng-content>',
                styles: [".mat-subheader{display:block;box-sizing:border-box;padding:16px}.mat-list .mat-subheader{margin:0}.mat-list,.mat-nav-list,.mat-selection-list{padding-top:8px;display:block}.mat-list .mat-subheader,.mat-nav-list .mat-subheader,.mat-selection-list .mat-subheader{height:48px;line-height:16px}.mat-list .mat-subheader:first-child,.mat-nav-list .mat-subheader:first-child,.mat-selection-list .mat-subheader:first-child{margin-top:-8px}.mat-list .mat-list-item,.mat-nav-list .mat-list-item,.mat-selection-list .mat-list-item{display:block}.mat-list .mat-list-item .mat-list-item-content,.mat-nav-list .mat-list-item .mat-list-item-content,.mat-selection-list .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-item .mat-list-item-content-reverse,.mat-nav-list .mat-list-item .mat-list-item-content-reverse,.mat-selection-list .mat-list-item .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list .mat-list-item .mat-list-item-ripple,.mat-nav-list .mat-list-item .mat-list-item-ripple,.mat-selection-list .mat-list-item .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-selection-list .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-item .mat-list-text,.mat-nav-list .mat-list-item .mat-list-text,.mat-selection-list .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-item .mat-list-text>*,.mat-nav-list .mat-list-item .mat-list-text>*,.mat-selection-list .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-item .mat-list-text:empty,.mat-nav-list .mat-list-item .mat-list-text:empty,.mat-selection-list .mat-list-item .mat-list-text:empty{display:none}.mat-list .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list .mat-list-item .mat-list-text:nth-child(2),.mat-selection-list .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list .mat-list-item .mat-list-avatar,.mat-nav-list .mat-list-item .mat-list-avatar,.mat-selection-list .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-item .mat-list-icon,.mat-nav-list .mat-list-item .mat-list-icon,.mat-selection-list .mat-list-item .mat-list-icon{width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list .mat-list-option,.mat-nav-list .mat-list-option,.mat-selection-list .mat-list-option{display:block}.mat-list .mat-list-option .mat-list-item-content,.mat-nav-list .mat-list-option .mat-list-item-content,.mat-selection-list .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-option .mat-list-item-content-reverse,.mat-nav-list .mat-list-option .mat-list-item-content-reverse,.mat-selection-list .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list .mat-list-option .mat-list-item-ripple,.mat-nav-list .mat-list-option .mat-list-item-ripple,.mat-selection-list .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-selection-list .mat-list-option.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-option.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-2-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-option.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-3-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-option.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-multi-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-option .mat-list-text,.mat-nav-list .mat-list-option .mat-list-text,.mat-selection-list .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-option .mat-list-text>*,.mat-nav-list .mat-list-option .mat-list-text>*,.mat-selection-list .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-option .mat-list-text:empty,.mat-nav-list .mat-list-option .mat-list-text:empty,.mat-selection-list .mat-list-option .mat-list-text:empty{display:none}.mat-list .mat-list-option .mat-list-text:nth-child(2),.mat-nav-list .mat-list-option .mat-list-text:nth-child(2),.mat-selection-list .mat-list-option .mat-list-text:nth-child(2){padding:0}.mat-list .mat-list-option .mat-list-avatar,.mat-nav-list .mat-list-option .mat-list-avatar,.mat-selection-list .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-option .mat-list-icon,.mat-nav-list .mat-list-option .mat-list-icon,.mat-selection-list .mat-list-option .mat-list-icon{width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list[dense],.mat-nav-list[dense],.mat-selection-list[dense]{padding-top:4px;display:block}.mat-list[dense] .mat-subheader,.mat-nav-list[dense] .mat-subheader,.mat-selection-list[dense] .mat-subheader{height:40px;line-height:8px}.mat-list[dense] .mat-subheader:first-child,.mat-nav-list[dense] .mat-subheader:first-child,.mat-selection-list[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list[dense] .mat-list-item,.mat-nav-list[dense] .mat-list-item,.mat-selection-list[dense] .mat-list-item{display:block}.mat-list[dense] .mat-list-item .mat-list-item-content,.mat-nav-list[dense] .mat-list-item .mat-list-item-content,.mat-selection-list[dense] .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-item .mat-list-item-content-reverse,.mat-nav-list[dense] .mat-list-item .mat-list-item-content-reverse,.mat-selection-list[dense] .mat-list-item .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list[dense] .mat-list-item .mat-list-item-ripple,.mat-nav-list[dense] .mat-list-item .mat-list-item-ripple,.mat-selection-list[dense] .mat-list-item .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-item .mat-list-text,.mat-nav-list[dense] .mat-list-item .mat-list-text,.mat-selection-list[dense] .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-item .mat-list-text>*,.mat-nav-list[dense] .mat-list-item .mat-list-text>*,.mat-selection-list[dense] .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-item .mat-list-text:empty,.mat-nav-list[dense] .mat-list-item .mat-list-text:empty,.mat-selection-list[dense] .mat-list-item .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list[dense] .mat-list-item .mat-list-text:nth-child(2),.mat-selection-list[dense] .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list[dense] .mat-list-item .mat-list-avatar,.mat-nav-list[dense] .mat-list-item .mat-list-avatar,.mat-selection-list[dense] .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-item .mat-list-icon,.mat-nav-list[dense] .mat-list-item .mat-list-icon,.mat-selection-list[dense] .mat-list-item .mat-list-icon{width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list[dense] .mat-list-option,.mat-nav-list[dense] .mat-list-option,.mat-selection-list[dense] .mat-list-option{display:block}.mat-list[dense] .mat-list-option .mat-list-item-content,.mat-nav-list[dense] .mat-list-option .mat-list-item-content,.mat-selection-list[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-option .mat-list-item-content-reverse,.mat-nav-list[dense] .mat-list-option .mat-list-item-content-reverse,.mat-selection-list[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list[dense] .mat-list-option .mat-list-item-ripple,.mat-nav-list[dense] .mat-list-option .mat-list-item-ripple,.mat-selection-list[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-option.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-2-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-option.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-3-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-option .mat-list-text,.mat-nav-list[dense] .mat-list-option .mat-list-text,.mat-selection-list[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-option .mat-list-text>*,.mat-nav-list[dense] .mat-list-option .mat-list-text>*,.mat-selection-list[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-option .mat-list-text:empty,.mat-nav-list[dense] .mat-list-option .mat-list-text:empty,.mat-selection-list[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-option .mat-list-text:nth-child(2),.mat-nav-list[dense] .mat-list-option .mat-list-text:nth-child(2),.mat-selection-list[dense] .mat-list-option .mat-list-text:nth-child(2){padding:0}.mat-list[dense] .mat-list-option .mat-list-avatar,.mat-nav-list[dense] .mat-list-option .mat-list-avatar,.mat-selection-list[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-option .mat-list-icon,.mat-nav-list[dense] .mat-list-option .mat-list-icon,.mat-selection-list[dense] .mat-list-option .mat-list-icon{width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-divider{display:block;border-top-style:solid;border-top-width:1px;margin:0}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item-content{cursor:pointer}.mat-nav-list .mat-list-item-content.mat-list-item-focus,.mat-nav-list .mat-list-item-content:hover{outline:0}"],
                inputs: ['disableRipple'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdList.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListCssMatStyler = (function () {
    function MdListCssMatStyler() {
    }
    return MdListCssMatStyler;
}());
MdListCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-list, mat-list',
                host: { 'class': 'mat-list' }
            },] },
];
/**
 * @nocollapse
 */
MdListCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdNavListCssMatStyler = (function () {
    function MdNavListCssMatStyler() {
    }
    return MdNavListCssMatStyler;
}());
MdNavListCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-nav-list, mat-nav-list',
                host: { 'class': 'mat-nav-list' }
            },] },
];
/**
 * @nocollapse
 */
MdNavListCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdDividerCssMatStyler = (function () {
    function MdDividerCssMatStyler() {
    }
    return MdDividerCssMatStyler;
}());
MdDividerCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-divider, mat-divider',
                host: { 'class': 'mat-divider' }
            },] },
];
/**
 * @nocollapse
 */
MdDividerCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListAvatarCssMatStyler = (function () {
    function MdListAvatarCssMatStyler() {
    }
    return MdListAvatarCssMatStyler;
}());
MdListAvatarCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-list-avatar], [mat-list-avatar], [mdListAvatar], [matListAvatar]',
                host: { 'class': 'mat-list-avatar' }
            },] },
];
/**
 * @nocollapse
 */
MdListAvatarCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListIconCssMatStyler = (function () {
    function MdListIconCssMatStyler() {
    }
    return MdListIconCssMatStyler;
}());
MdListIconCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-list-icon], [mat-list-icon], [mdListIcon], [matListIcon]',
                host: { 'class': 'mat-list-icon' }
            },] },
];
/**
 * @nocollapse
 */
MdListIconCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListSubheaderCssMatStyler = (function () {
    function MdListSubheaderCssMatStyler() {
    }
    return MdListSubheaderCssMatStyler;
}());
MdListSubheaderCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-subheader], [mat-subheader], [mdSubheader], [matSubheader]',
                host: { 'class': 'mat-subheader' }
            },] },
];
/**
 * @nocollapse
 */
MdListSubheaderCssMatStyler.ctorParameters = function () { return []; };
var MdListItem = (function (_super) {
    tslib_1.__extends(MdListItem, _super);
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _list
     * @param {?} navList
     */
    function MdListItem(_renderer, _element, _list, navList) {
        var _this = _super.call(this) || this;
        _this._renderer = _renderer;
        _this._element = _element;
        _this._list = _list;
        _this._isNavList = false;
        _this._isNavList = !!navList;
        return _this;
    }
    Object.defineProperty(MdListItem.prototype, "_hasAvatar", {
        /**
         * @param {?} avatar
         * @return {?}
         */
        set: function (avatar) {
            if (avatar != null) {
                this._renderer.addClass(this._element.nativeElement, 'mat-list-item-avatar');
            }
            else {
                this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-avatar');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdListItem.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    MdListItem.prototype.isRippleEnabled = function () {
        return !this.disableRipple && this._isNavList && !this._list.disableRipple;
    };
    /**
     * @return {?}
     */
    MdListItem.prototype._handleFocus = function () {
        this._renderer.addClass(this._element.nativeElement, 'mat-list-item-focus');
    };
    /**
     * @return {?}
     */
    MdListItem.prototype._handleBlur = function () {
        this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-focus');
    };
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    MdListItem.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    return MdListItem;
}(_MdListItemMixinBase));
MdListItem.decorators = [
    { type: Component, args: [{ selector: 'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
                host: {
                    'role': 'listitem',
                    'class': 'mat-list-item',
                    '(focus)': '_handleFocus()',
                    '(blur)': '_handleBlur()',
                },
                inputs: ['disableRipple'],
                template: "<div class=\"mat-list-item-content\"><div class=\"mat-list-item-ripple\" md-ripple [mdRippleTrigger]=\"_getHostElement()\" [mdRippleDisabled]=\"!isRippleEnabled()\"></div><ng-content select=\"[md-list-avatar], [md-list-icon], [mat-list-avatar], [mat-list-icon], [mdListAvatar], [mdListIcon], [matListAvatar], [matListIcon]\"></ng-content><div class=\"mat-list-text\"><ng-content select=\"[md-line], [mat-line], [mdLine], [matLine]\"></ng-content></div><ng-content></ng-content></div>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdListItem.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: MdList, decorators: [{ type: Optional },] },
    { type: MdNavListCssMatStyler, decorators: [{ type: Optional },] },
]; };
MdListItem.propDecorators = {
    '_lines': [{ type: ContentChildren, args: [MdLine,] },],
    '_hasAvatar': [{ type: ContentChild, args: [MdListAvatarCssMatStyler,] },],
};
var MdSelectionListBase = (function () {
    function MdSelectionListBase() {
    }
    return MdSelectionListBase;
}());
var _MdSelectionListMixinBase = mixinDisabled(MdSelectionListBase);
var FOCUSED_STYLE = 'mat-list-item-focus';
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is checked.
 */
var MdListOption = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _changeDetector
     * @param {?} selectionList
     */
    function MdListOption(_renderer, _element, _changeDetector, selectionList) {
        this._renderer = _renderer;
        this._element = _element;
        this._changeDetector = _changeDetector;
        this.selectionList = selectionList;
        this._disableRipple = false;
        this._selected = false;
        /**
         * Whether the checkbox is disabled.
         */
        this._disabled = false;
        /**
         * Whether the option has focus.
         */
        this._hasFocus = false;
        /**
         * Whether the label should appear before or after the checkbox. Defaults to 'after'
         */
        this.checkboxPosition = 'after';
        /**
         * Emitted when the option is focused.
         */
        this.onFocus = new EventEmitter();
        /**
         * Emitted when the option is selected.
         */
        this.selectChange = new EventEmitter();
        /**
         * Emitted when the option is deselected.
         */
        this.deselected = new EventEmitter();
        /**
         * Emitted when the option is destroyed.
         */
        this.destroyed = new EventEmitter();
    }
    Object.defineProperty(MdListOption.prototype, "disableRipple", {
        /**
         * Whether the ripple effect on click should be disabled. This applies only to list items that are
         * part of a selection list. The value of `disableRipple` on the `md-selection-list` overrides
         * this flag
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableRipple = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdListOption.prototype, "disabled", {
        /**
         * Whether the option is disabled.
         * @return {?}
         */
        get: function () { return (this.selectionList && this.selectionList.disabled) || this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdListOption.prototype, "value", {
        /**
         * @return {?}
         */
        get: function () { return this._value; },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) { this._value = coerceBooleanProperty(val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdListOption.prototype, "selected", {
        /**
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) { this._selected = coerceBooleanProperty(val); },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdListOption.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
        if (this.selectionList.disabled) {
            this.disabled = true;
        }
    };
    /**
     * @return {?}
     */
    MdListOption.prototype.ngOnDestroy = function () {
        this.destroyed.emit({ option: this });
    };
    /**
     * @return {?}
     */
    MdListOption.prototype.toggle = function () {
        this.selected = !this.selected;
        this.selectionList.selectedOptions.toggle(this);
        this._changeDetector.markForCheck();
    };
    /**
     * Allows for programmatic focusing of the option.
     * @return {?}
     */
    MdListOption.prototype.focus = function () {
        this._element.nativeElement.focus();
        this.onFocus.emit({ option: this });
    };
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    MdListOption.prototype.isRippleEnabled = function () {
        return !this.disableRipple && !this.selectionList.disableRipple;
    };
    /**
     * @return {?}
     */
    MdListOption.prototype._handleClick = function () {
        if (!this.disabled) {
            this.toggle();
        }
    };
    /**
     * @return {?}
     */
    MdListOption.prototype._handleFocus = function () {
        this._hasFocus = true;
        this._renderer.addClass(this._element.nativeElement, FOCUSED_STYLE);
    };
    /**
     * @return {?}
     */
    MdListOption.prototype._handleBlur = function () {
        this._renderer.removeClass(this._element.nativeElement, FOCUSED_STYLE);
    };
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    MdListOption.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    return MdListOption;
}());
MdListOption.decorators = [
    { type: Component, args: [{ selector: 'md-list-option, mat-list-option',
                host: {
                    'role': 'option',
                    'class': 'mat-list-item mat-list-option',
                    '(focus)': '_handleFocus()',
                    '(blur)': '_handleBlur()',
                    '(click)': '_handleClick()',
                    'tabindex': '-1',
                    '[attr.aria-selected]': 'selected.toString()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                },
                template: "<div class=\"mat-list-item-content\" [class.mat-list-item-content-reverse]=\"checkboxPosition == 'after'\" [class.mat-list-item-disabled]=\"disabled\"><div class=\"mat-list-item-ripple\" md-ripple [mdRippleTrigger]=\"_getHostElement()\" [mdRippleDisabled]=\"!isRippleEnabled()\"></div><md-pseudo-checkbox [state]=\"selected ? 'checked' : 'unchecked'\" #autocheckbox [disabled]=\"disabled\"></md-pseudo-checkbox><div class=\"mat-list-text\"><ng-content></ng-content></div></div>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdListOption.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
    { type: MdSelectionList, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return MdSelectionList; }),] },] },
]; };
MdListOption.propDecorators = {
    'disableRipple': [{ type: Input },],
    '_lines': [{ type: ContentChildren, args: [MdLine,] },],
    'checkboxPosition': [{ type: Input },],
    'disabled': [{ type: Input },],
    'value': [{ type: Input },],
    'selected': [{ type: Input },],
    'selectChange': [{ type: Output },],
    'deselected': [{ type: Output },],
    'destroyed': [{ type: Output },],
};
var MdSelectionList = (function (_super) {
    tslib_1.__extends(MdSelectionList, _super);
    /**
     * @param {?} _element
     */
    function MdSelectionList(_element) {
        var _this = _super.call(this) || this;
        _this._element = _element;
        _this._disableRipple = false;
        /**
         * Tab index for the selection-list.
         */
        _this._tabIndex = 0;
        /**
         * options which are selected.
         */
        _this.selectedOptions = new SelectionModel(true);
        return _this;
    }
    Object.defineProperty(MdSelectionList.prototype, "disableRipple", {
        /**
         * Whether the ripple effect should be disabled on the list-items or not.
         * This flag only has an effect for `mat-selection-list` components.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableRipple = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSelectionList.prototype.ngAfterContentInit = function () {
        this._keyManager = new FocusKeyManager(this.options).withWrap();
        if (this.disabled) {
            this._tabIndex = -1;
        }
        this._optionFocusSubscription = this._onFocusSubscription();
        this._optionDestroyStream = this._onDestroySubscription();
    };
    /**
     * @return {?}
     */
    MdSelectionList.prototype.ngOnDestroy = function () {
        if (this._optionDestroyStream) {
            this._optionDestroyStream.unsubscribe();
        }
        if (this._optionFocusSubscription) {
            this._optionFocusSubscription.unsubscribe();
        }
    };
    /**
     * @return {?}
     */
    MdSelectionList.prototype.focus = function () {
        this._element.nativeElement.focus();
    };
    /**
     * Map all the options' destroy event subscriptions and merge them into one stream.
     * @return {?}
     */
    MdSelectionList.prototype._onDestroySubscription = function () {
        var _this = this;
        return RxChain.from(this.options.changes)
            .call(startWith, this.options)
            .call(switchMap, function (options) {
            return merge.apply(void 0, options.map(function (option) { return option.destroyed; }));
        }).subscribe(function (e) {
            var /** @type {?} */ optionIndex = _this.options.toArray().indexOf(e.option);
            if (e.option._hasFocus) {
                // Check whether the option is the last item
                if (optionIndex < _this.options.length - 1) {
                    _this._keyManager.setActiveItem(optionIndex);
                }
                else if (optionIndex - 1 >= 0) {
                    _this._keyManager.setActiveItem(optionIndex - 1);
                }
            }
            e.option.destroyed.unsubscribe();
        });
    };
    /**
     * Map all the options' onFocus event subscriptions and merge them into one stream.
     * @return {?}
     */
    MdSelectionList.prototype._onFocusSubscription = function () {
        var _this = this;
        return RxChain.from(this.options.changes)
            .call(startWith, this.options)
            .call(switchMap, function (options) {
            return merge.apply(void 0, options.map(function (option) { return option.onFocus; }));
        }).subscribe(function (e) {
            var /** @type {?} */ optionIndex = _this.options.toArray().indexOf(e.option);
            _this._keyManager.updateActiveItemIndex(optionIndex);
        });
    };
    /**
     * Passes relevant key presses to our key manager.
     * @param {?} event
     * @return {?}
     */
    MdSelectionList.prototype._keydown = function (event) {
        switch (event.keyCode) {
            case SPACE:
                this._toggleSelectOnFocusedOption();
                // Always prevent space from scrolling the page since the list has focus
                event.preventDefault();
                break;
            default:
                this._keyManager.onKeydown(event);
        }
    };
    /**
     * Toggles the selected state of the currently focused option.
     * @return {?}
     */
    MdSelectionList.prototype._toggleSelectOnFocusedOption = function () {
        var /** @type {?} */ focusedIndex = this._keyManager.activeItemIndex;
        if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
            var /** @type {?} */ focusedOption = this.options.toArray()[focusedIndex];
            if (focusedOption) {
                focusedOption.toggle();
            }
        }
    };
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param {?} index The index to be checked.
     * @return {?} True if the index is valid for our list of options.
     */
    MdSelectionList.prototype._isValidIndex = function (index) {
        return index >= 0 && index < this.options.length;
    };
    return MdSelectionList;
}(_MdSelectionListMixinBase));
MdSelectionList.decorators = [
    { type: Component, args: [{ selector: 'md-selection-list, mat-selection-list',
                inputs: ['disabled'],
                host: {
                    'role': 'listbox',
                    '[attr.tabindex]': '_tabIndex',
                    'class': 'mat-selection-list',
                    '(focus)': 'focus()',
                    '(keydown)': '_keydown($event)',
                    '[attr.aria-disabled]': 'disabled.toString()'
                },
                template: '<ng-content></ng-content>',
                styles: [".mat-subheader{display:block;box-sizing:border-box;padding:16px}.mat-list .mat-subheader{margin:0}.mat-list,.mat-nav-list,.mat-selection-list{padding-top:8px;display:block}.mat-list .mat-subheader,.mat-nav-list .mat-subheader,.mat-selection-list .mat-subheader{height:48px;line-height:16px}.mat-list .mat-subheader:first-child,.mat-nav-list .mat-subheader:first-child,.mat-selection-list .mat-subheader:first-child{margin-top:-8px}.mat-list .mat-list-item,.mat-nav-list .mat-list-item,.mat-selection-list .mat-list-item{display:block}.mat-list .mat-list-item .mat-list-item-content,.mat-nav-list .mat-list-item .mat-list-item-content,.mat-selection-list .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-item .mat-list-item-content-reverse,.mat-nav-list .mat-list-item .mat-list-item-content-reverse,.mat-selection-list .mat-list-item .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list .mat-list-item .mat-list-item-ripple,.mat-nav-list .mat-list-item .mat-list-item-ripple,.mat-selection-list .mat-list-item .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-selection-list .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-item .mat-list-text,.mat-nav-list .mat-list-item .mat-list-text,.mat-selection-list .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-item .mat-list-text>*,.mat-nav-list .mat-list-item .mat-list-text>*,.mat-selection-list .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-item .mat-list-text:empty,.mat-nav-list .mat-list-item .mat-list-text:empty,.mat-selection-list .mat-list-item .mat-list-text:empty{display:none}.mat-list .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list .mat-list-item .mat-list-text:nth-child(2),.mat-selection-list .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list .mat-list-item .mat-list-avatar,.mat-nav-list .mat-list-item .mat-list-avatar,.mat-selection-list .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-item .mat-list-icon,.mat-nav-list .mat-list-item .mat-list-icon,.mat-selection-list .mat-list-item .mat-list-icon{width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list .mat-list-option,.mat-nav-list .mat-list-option,.mat-selection-list .mat-list-option{display:block}.mat-list .mat-list-option .mat-list-item-content,.mat-nav-list .mat-list-option .mat-list-item-content,.mat-selection-list .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-option .mat-list-item-content-reverse,.mat-nav-list .mat-list-option .mat-list-item-content-reverse,.mat-selection-list .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list .mat-list-option .mat-list-item-ripple,.mat-nav-list .mat-list-option .mat-list-item-ripple,.mat-selection-list .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-selection-list .mat-list-option.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-option.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-2-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-option.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-3-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-option.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-multi-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-option .mat-list-text,.mat-nav-list .mat-list-option .mat-list-text,.mat-selection-list .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-option .mat-list-text>*,.mat-nav-list .mat-list-option .mat-list-text>*,.mat-selection-list .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-option .mat-list-text:empty,.mat-nav-list .mat-list-option .mat-list-text:empty,.mat-selection-list .mat-list-option .mat-list-text:empty{display:none}.mat-list .mat-list-option .mat-list-text:nth-child(2),.mat-nav-list .mat-list-option .mat-list-text:nth-child(2),.mat-selection-list .mat-list-option .mat-list-text:nth-child(2){padding:0}.mat-list .mat-list-option .mat-list-avatar,.mat-nav-list .mat-list-option .mat-list-avatar,.mat-selection-list .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-option .mat-list-icon,.mat-nav-list .mat-list-option .mat-list-icon,.mat-selection-list .mat-list-option .mat-list-icon{width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list[dense],.mat-nav-list[dense],.mat-selection-list[dense]{padding-top:4px;display:block}.mat-list[dense] .mat-subheader,.mat-nav-list[dense] .mat-subheader,.mat-selection-list[dense] .mat-subheader{height:40px;line-height:8px}.mat-list[dense] .mat-subheader:first-child,.mat-nav-list[dense] .mat-subheader:first-child,.mat-selection-list[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list[dense] .mat-list-item,.mat-nav-list[dense] .mat-list-item,.mat-selection-list[dense] .mat-list-item{display:block}.mat-list[dense] .mat-list-item .mat-list-item-content,.mat-nav-list[dense] .mat-list-item .mat-list-item-content,.mat-selection-list[dense] .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-item .mat-list-item-content-reverse,.mat-nav-list[dense] .mat-list-item .mat-list-item-content-reverse,.mat-selection-list[dense] .mat-list-item .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list[dense] .mat-list-item .mat-list-item-ripple,.mat-nav-list[dense] .mat-list-item .mat-list-item-ripple,.mat-selection-list[dense] .mat-list-item .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-item .mat-list-text,.mat-nav-list[dense] .mat-list-item .mat-list-text,.mat-selection-list[dense] .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-item .mat-list-text>*,.mat-nav-list[dense] .mat-list-item .mat-list-text>*,.mat-selection-list[dense] .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-item .mat-list-text:empty,.mat-nav-list[dense] .mat-list-item .mat-list-text:empty,.mat-selection-list[dense] .mat-list-item .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list[dense] .mat-list-item .mat-list-text:nth-child(2),.mat-selection-list[dense] .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list[dense] .mat-list-item .mat-list-avatar,.mat-nav-list[dense] .mat-list-item .mat-list-avatar,.mat-selection-list[dense] .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-item .mat-list-icon,.mat-nav-list[dense] .mat-list-item .mat-list-icon,.mat-selection-list[dense] .mat-list-item .mat-list-icon{width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list[dense] .mat-list-option,.mat-nav-list[dense] .mat-list-option,.mat-selection-list[dense] .mat-list-option{display:block}.mat-list[dense] .mat-list-option .mat-list-item-content,.mat-nav-list[dense] .mat-list-option .mat-list-item-content,.mat-selection-list[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-option .mat-list-item-content-reverse,.mat-nav-list[dense] .mat-list-option .mat-list-item-content-reverse,.mat-selection-list[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list[dense] .mat-list-option .mat-list-item-ripple,.mat-nav-list[dense] .mat-list-option .mat-list-item-ripple,.mat-selection-list[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-option.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-2-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-option.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-3-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-option .mat-list-text,.mat-nav-list[dense] .mat-list-option .mat-list-text,.mat-selection-list[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-option .mat-list-text>*,.mat-nav-list[dense] .mat-list-option .mat-list-text>*,.mat-selection-list[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-option .mat-list-text:empty,.mat-nav-list[dense] .mat-list-option .mat-list-text:empty,.mat-selection-list[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-option .mat-list-text:nth-child(2),.mat-nav-list[dense] .mat-list-option .mat-list-text:nth-child(2),.mat-selection-list[dense] .mat-list-option .mat-list-text:nth-child(2){padding:0}.mat-list[dense] .mat-list-option .mat-list-avatar,.mat-nav-list[dense] .mat-list-option .mat-list-avatar,.mat-selection-list[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-option .mat-list-icon,.mat-nav-list[dense] .mat-list-option .mat-list-icon,.mat-selection-list[dense] .mat-list-option .mat-list-icon{width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-divider{display:block;border-top-style:solid;border-top-width:1px;margin:0}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item-content{cursor:pointer}.mat-nav-list .mat-list-item-content.mat-list-item-focus,.mat-nav-list .mat-list-item-content:hover{outline:0}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdSelectionList.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
MdSelectionList.propDecorators = {
    'options': [{ type: ContentChildren, args: [MdListOption,] },],
    'disableRipple': [{ type: Input },],
};
var MdListModule = (function () {
    function MdListModule() {
    }
    return MdListModule;
}());
MdListModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdLineModule, MdRippleModule, MdCommonModule, MdPseudoCheckboxModule, CommonModule],
                exports: [
                    MdList,
                    MdListItem,
                    MdListDivider,
                    MdListAvatarCssMatStyler,
                    MdLineModule,
                    MdCommonModule,
                    MdListIconCssMatStyler,
                    MdListCssMatStyler,
                    MdNavListCssMatStyler,
                    MdDividerCssMatStyler,
                    MdListSubheaderCssMatStyler,
                    MdPseudoCheckboxModule,
                    MdSelectionList,
                    MdListOption
                ],
                declarations: [
                    MdList,
                    MdListItem,
                    MdListDivider,
                    MdListAvatarCssMatStyler,
                    MdListIconCssMatStyler,
                    MdListCssMatStyler,
                    MdNavListCssMatStyler,
                    MdDividerCssMatStyler,
                    MdListSubheaderCssMatStyler,
                    MdSelectionList,
                    MdListOption
                ],
            },] },
];
/**
 * @nocollapse
 */
MdListModule.ctorParameters = function () { return []; };
/**
 * Converts values into strings. Falsy values become empty strings.
 * \@docs-private
 * @param {?} value
 * @return {?}
 */
function coerceToString(value) {
    return "" + (value || '');
}
/**
 * Converts a value that might be a string into a number.
 * \@docs-private
 * @param {?} value
 * @return {?}
 */
function coerceToNumber(value) {
    return typeof value === 'string' ? parseInt(value, 10) : value;
}
var MdGridTile = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _element
     */
    function MdGridTile(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        this._rowspan = 1;
        this._colspan = 1;
    }
    Object.defineProperty(MdGridTile.prototype, "rowspan", {
        /**
         * Amount of rows that the grid tile takes up.
         * @return {?}
         */
        get: function () { return this._rowspan; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._rowspan = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridTile.prototype, "colspan", {
        /**
         * Amount of columns that the grid tile takes up.
         * @return {?}
         */
        get: function () { return this._colspan; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._colspan = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    MdGridTile.prototype._setStyle = function (property, value) {
        this._renderer.setStyle(this._element.nativeElement, property, value);
    };
    return MdGridTile;
}());
MdGridTile.decorators = [
    { type: Component, args: [{ selector: 'md-grid-tile, mat-grid-tile',
                host: {
                    'class': 'mat-grid-tile',
                },
                template: "<figure class=\"mat-figure\"><ng-content></ng-content></figure>",
                styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-footer,.mat-grid-tile .mat-grid-tile-header{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-footer>*,.mat-grid-tile .mat-grid-tile-header>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-grid-tile .mat-grid-tile-footer.mat-2-line,.mat-grid-tile .mat-grid-tile-header.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdGridTile.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
MdGridTile.propDecorators = {
    'rowspan': [{ type: Input },],
    'colspan': [{ type: Input },],
};
var MdGridTileText = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _element
     */
    function MdGridTileText(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
    }
    /**
     * @return {?}
     */
    MdGridTileText.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    return MdGridTileText;
}());
MdGridTileText.decorators = [
    { type: Component, args: [{ selector: 'md-grid-tile-header, mat-grid-tile-header, md-grid-tile-footer, mat-grid-tile-footer',
                template: "<ng-content select=\"[md-grid-avatar], [mat-grid-avatar], [mdGridAvatar], [matGridAvatar]\"></ng-content><div class=\"mat-grid-list-text\"><ng-content select=\"[md-line], [mat-line], [mdLine], [matLine]\"></ng-content></div><ng-content></ng-content>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdGridTileText.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
MdGridTileText.propDecorators = {
    '_lines': [{ type: ContentChildren, args: [MdLine,] },],
};
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdGridAvatarCssMatStyler = (function () {
    function MdGridAvatarCssMatStyler() {
    }
    return MdGridAvatarCssMatStyler;
}());
MdGridAvatarCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-grid-avatar], [mat-grid-avatar], [mdGridAvatar], [matGridAvatar]',
                host: { 'class': 'mat-grid-avatar' }
            },] },
];
/**
 * @nocollapse
 */
MdGridAvatarCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdGridTileHeaderCssMatStyler = (function () {
    function MdGridTileHeaderCssMatStyler() {
    }
    return MdGridTileHeaderCssMatStyler;
}());
MdGridTileHeaderCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-grid-tile-header, mat-grid-tile-header',
                host: { 'class': 'mat-grid-tile-header' }
            },] },
];
/**
 * @nocollapse
 */
MdGridTileHeaderCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdGridTileFooterCssMatStyler = (function () {
    function MdGridTileFooterCssMatStyler() {
    }
    return MdGridTileFooterCssMatStyler;
}());
MdGridTileFooterCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-grid-tile-footer, mat-grid-tile-footer',
                host: { 'class': 'mat-grid-tile-footer' }
            },] },
];
/**
 * @nocollapse
 */
MdGridTileFooterCssMatStyler.ctorParameters = function () { return []; };
/**
 * Class for determining, from a list of tiles, the (row, col) position of each of those tiles
 * in the grid. This is necessary (rather than just rendering the tiles in normal document flow)
 * because the tiles can have a rowspan.
 *
 * The positioning algorithm greedily places each tile as soon as it encounters a gap in the grid
 * large enough to accommodate it so that the tiles still render in the same order in which they
 * are given.
 *
 * The basis of the algorithm is the use of an array to track the already placed tiles. Each
 * element of the array corresponds to a column, and the value indicates how many cells in that
 * column are already occupied; zero indicates an empty cell. Moving "down" to the next row
 * decrements each value in the tracking array (indicating that the column is one cell closer to
 * being free).
 *
 * \@docs-private
 */
var TileCoordinator = (function () {
    /**
     * @param {?} numColumns
     * @param {?} tiles
     */
    function TileCoordinator(numColumns, tiles) {
        var _this = this;
        /**
         * Index at which the search for the next gap will start.
         */
        this.columnIndex = 0;
        /**
         * The current row index.
         */
        this.rowIndex = 0;
        this.tracker = new Array(numColumns);
        this.tracker.fill(0, 0, this.tracker.length);
        this.positions = tiles.map(function (tile) { return _this._trackTile(tile); });
    }
    Object.defineProperty(TileCoordinator.prototype, "rowCount", {
        /**
         * Gets the total number of rows occupied by tiles
         * @return {?}
         */
        get: function () { return this.rowIndex + 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TileCoordinator.prototype, "rowspan", {
        /**
         * Gets the total span of rows occupied by tiles.
         * Ex: A list with 1 row that contains a tile with rowspan 2 will have a total rowspan of 2.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ lastRowMax = Math.max.apply(Math, this.tracker);
            // if any of the tiles has a rowspan that pushes it beyond the total row count,
            // add the difference to the rowcount
            return lastRowMax > 1 ? this.rowCount + lastRowMax - 1 : this.rowCount;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calculates the row and col position of a tile.
     * @param {?} tile
     * @return {?}
     */
    TileCoordinator.prototype._trackTile = function (tile) {
        // Find a gap large enough for this tile.
        var /** @type {?} */ gapStartIndex = this._findMatchingGap(tile.colspan);
        // Place tile in the resulting gap.
        this._markTilePosition(gapStartIndex, tile);
        // The next time we look for a gap, the search will start at columnIndex, which should be
        // immediately after the tile that has just been placed.
        this.columnIndex = gapStartIndex + tile.colspan;
        return new TilePosition(this.rowIndex, gapStartIndex);
    };
    /**
     * Finds the next available space large enough to fit the tile.
     * @param {?} tileCols
     * @return {?}
     */
    TileCoordinator.prototype._findMatchingGap = function (tileCols) {
        if (tileCols > this.tracker.length) {
            throw Error("md-grid-list: tile with colspan " + tileCols + " is wider than " +
                ("grid with cols=\"" + this.tracker.length + "\"."));
        }
        // Start index is inclusive, end index is exclusive.
        var /** @type {?} */ gapStartIndex = -1;
        var /** @type {?} */ gapEndIndex = -1;
        // Look for a gap large enough to fit the given tile. Empty spaces are marked with a zero.
        do {
            // If we've reached the end of the row, go to the next row.
            if (this.columnIndex + tileCols > this.tracker.length) {
                this._nextRow();
                continue;
            }
            gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
            // If there are no more empty spaces in this row at all, move on to the next row.
            if (gapStartIndex == -1) {
                this._nextRow();
                continue;
            }
            gapEndIndex = this._findGapEndIndex(gapStartIndex);
            // If a gap large enough isn't found, we want to start looking immediately after the current
            // gap on the next iteration.
            this.columnIndex = gapStartIndex + 1;
            // Continue iterating until we find a gap wide enough for this tile.
        } while (gapEndIndex - gapStartIndex < tileCols);
        return gapStartIndex;
    };
    /**
     * Move "down" to the next row.
     * @return {?}
     */
    TileCoordinator.prototype._nextRow = function () {
        this.columnIndex = 0;
        this.rowIndex++;
        // Decrement all spaces by one to reflect moving down one row.
        for (var /** @type {?} */ i = 0; i < this.tracker.length; i++) {
            this.tracker[i] = Math.max(0, this.tracker[i] - 1);
        }
    };
    /**
     * Finds the end index (exclusive) of a gap given the index from which to start looking.
     * The gap ends when a non-zero value is found.
     * @param {?} gapStartIndex
     * @return {?}
     */
    TileCoordinator.prototype._findGapEndIndex = function (gapStartIndex) {
        for (var /** @type {?} */ i = gapStartIndex + 1; i < this.tracker.length; i++) {
            if (this.tracker[i] != 0) {
                return i;
            }
        }
        // The gap ends with the end of the row.
        return this.tracker.length;
    };
    /**
     * Update the tile tracker to account for the given tile in the given space.
     * @param {?} start
     * @param {?} tile
     * @return {?}
     */
    TileCoordinator.prototype._markTilePosition = function (start, tile) {
        for (var /** @type {?} */ i = 0; i < tile.colspan; i++) {
            this.tracker[start + i] = tile.rowspan;
        }
    };
    return TileCoordinator;
}());
/**
 * Simple data structure for tile position (row, col).
 * \@docs-private
 */
var TilePosition = (function () {
    /**
     * @param {?} row
     * @param {?} col
     */
    function TilePosition(row, col) {
        this.row = row;
        this.col = col;
    }
    return TilePosition;
}());
/**
 * Sets the style properties for an individual tile, given the position calculated by the
 * Tile Coordinator.
 * \@docs-private
 * @abstract
 */
var TileStyler = (function () {
    function TileStyler() {
        this._rows = 0;
        this._rowspan = 0;
    }
    /**
     * Adds grid-list layout info once it is available. Cannot be processed in the constructor
     * because these properties haven't been calculated by that point.
     *
     * @param {?} gutterSize Size of the grid's gutter.
     * @param {?} tracker Instance of the TileCoordinator.
     * @param {?} cols Amount of columns in the grid.
     * @param {?} direction Layout direction of the grid.
     * @return {?}
     */
    TileStyler.prototype.init = function (gutterSize, tracker, cols, direction) {
        this._gutterSize = normalizeUnits(gutterSize);
        this._rows = tracker.rowCount;
        this._rowspan = tracker.rowspan;
        this._cols = cols;
        this._direction = direction;
    };
    /**
     * Computes the amount of space a single 1x1 tile would take up (width or height).
     * Used as a basis for other calculations.
     * @param {?} sizePercent Percent of the total grid-list space that one 1x1 tile would take up.
     * @param {?} gutterFraction Fraction of the gutter size taken up by one 1x1 tile.
     * @return {?} The size of a 1x1 tile as an expression that can be evaluated via CSS calc().
     */
    TileStyler.prototype.getBaseTileSize = function (sizePercent, gutterFraction) {
        // Take the base size percent (as would be if evenly dividing the size between cells),
        // and then subtracting the size of one gutter. However, since there are no gutters on the
        // edges, each tile only uses a fraction (gutterShare = numGutters / numCells) of the gutter
        // size. (Imagine having one gutter per tile, and then breaking up the extra gutter on the
        // edge evenly among the cells).
        return "(" + sizePercent + "% - ( " + this._gutterSize + " * " + gutterFraction + " ))";
    };
    /**
     * Gets The horizontal or vertical position of a tile, e.g., the 'top' or 'left' property value.
     * @param {?} baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param {?} offset Number of tiles that have already been rendered in the row/column.
     * @return {?} Position of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTilePosition = function (baseSize, offset) {
        // The position comes the size of a 1x1 tile plus gutter for each previous tile in the
        // row/column (offset).
        return calc("(" + baseSize + " + " + this._gutterSize + ") * " + offset);
    };
    /**
     * Gets the actual size of a tile, e.g., width or height, taking rowspan or colspan into account.
     * @param {?} baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param {?} span The tile's rowspan or colspan.
     * @return {?} Size of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTileSize = function (baseSize, span) {
        return "(" + baseSize + " * " + span + ") + (" + (span - 1) + " * " + this._gutterSize + ")";
    };
    /**
     * Sets the style properties to be applied to a tile for the given row and column index.
     * @param {?} tile Tile to which to apply the styling.
     * @param {?} rowIndex Index of the tile's row.
     * @param {?} colIndex Index of the tile's column.
     * @return {?}
     */
    TileStyler.prototype.setStyle = function (tile, rowIndex, colIndex) {
        // Percent of the available horizontal space that one column takes up.
        var /** @type {?} */ percentWidthPerTile = 100 / this._cols;
        // Fraction of the vertical gutter size that each column takes up.
        // For example, if there are 5 columns, each column uses 4/5 = 0.8 times the gutter width.
        var /** @type {?} */ gutterWidthFractionPerTile = (this._cols - 1) / this._cols;
        this.setColStyles(tile, colIndex, percentWidthPerTile, gutterWidthFractionPerTile);
        this.setRowStyles(tile, rowIndex, percentWidthPerTile, gutterWidthFractionPerTile);
    };
    /**
     * Sets the horizontal placement of the tile in the list.
     * @param {?} tile
     * @param {?} colIndex
     * @param {?} percentWidth
     * @param {?} gutterWidth
     * @return {?}
     */
    TileStyler.prototype.setColStyles = function (tile, colIndex, percentWidth, gutterWidth) {
        // Base horizontal size of a column.
        var /** @type {?} */ baseTileWidth = this.getBaseTileSize(percentWidth, gutterWidth);
        // The width and horizontal position of each tile is always calculated the same way, but the
        // height and vertical position depends on the rowMode.
        var /** @type {?} */ side = this._direction === 'ltr' ? 'left' : 'right';
        tile._setStyle(side, this.getTilePosition(baseTileWidth, colIndex));
        tile._setStyle('width', calc(this.getTileSize(baseTileWidth, tile.colspan)));
    };
    /**
     * Calculates the total size taken up by gutters across one axis of a list.
     * @return {?}
     */
    TileStyler.prototype.getGutterSpan = function () {
        return this._gutterSize + " * (" + this._rowspan + " - 1)";
    };
    /**
     * Calculates the total size taken up by tiles across one axis of a list.
     * @param {?} tileHeight Height of the tile.
     * @return {?}
     */
    TileStyler.prototype.getTileSpan = function (tileHeight) {
        return this._rowspan + " * " + this.getTileSize(tileHeight, 1);
    };
    /**
     * Sets the vertical placement of the tile in the list.
     * This method will be implemented by each type of TileStyler.
     * \@docs-private
     * @abstract
     * @param {?} tile
     * @param {?} rowIndex
     * @param {?} percentWidth
     * @param {?} gutterWidth
     * @return {?}
     */
    TileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) { };
    /**
     * Calculates the computed height and returns the correct style property to set.
     * This method can be implemented by each type of TileStyler.
     * \@docs-private
     * @return {?}
     */
    TileStyler.prototype.getComputedHeight = function () { return null; };
    return TileStyler;
}());
/**
 * This type of styler is instantiated when the user passes in a fixed row height.
 * Example <md-grid-list cols="3" rowHeight="100px">
 * \@docs-private
 */
var FixedTileStyler = (function (_super) {
    tslib_1.__extends(FixedTileStyler, _super);
    /**
     * @param {?} fixedRowHeight
     */
    function FixedTileStyler(fixedRowHeight) {
        var _this = _super.call(this) || this;
        _this.fixedRowHeight = fixedRowHeight;
        return _this;
    }
    /**
     * @param {?} gutterSize
     * @param {?} tracker
     * @param {?} cols
     * @param {?} direction
     * @return {?}
     */
    FixedTileStyler.prototype.init = function (gutterSize, tracker, cols, direction) {
        _super.prototype.init.call(this, gutterSize, tracker, cols, direction);
        this.fixedRowHeight = normalizeUnits(this.fixedRowHeight);
    };
    /**
     * @param {?} tile
     * @param {?} rowIndex
     * @return {?}
     */
    FixedTileStyler.prototype.setRowStyles = function (tile, rowIndex) {
        tile._setStyle('top', this.getTilePosition(this.fixedRowHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(this.fixedRowHeight, tile.rowspan)));
    };
    /**
     * @return {?}
     */
    FixedTileStyler.prototype.getComputedHeight = function () {
        return [
            'height', calc(this.getTileSpan(this.fixedRowHeight) + " + " + this.getGutterSpan())
        ];
    };
    return FixedTileStyler;
}(TileStyler));
/**
 * This type of styler is instantiated when the user passes in a width:height ratio
 * for the row height.  Example <md-grid-list cols="3" rowHeight="3:1">
 * \@docs-private
 */
var RatioTileStyler = (function (_super) {
    tslib_1.__extends(RatioTileStyler, _super);
    /**
     * @param {?} value
     */
    function RatioTileStyler(value) {
        var _this = _super.call(this) || this;
        _this._parseRatio(value);
        return _this;
    }
    /**
     * @param {?} tile
     * @param {?} rowIndex
     * @param {?} percentWidth
     * @param {?} gutterWidth
     * @return {?}
     */
    RatioTileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) {
        var /** @type {?} */ percentHeightPerTile = percentWidth / this.rowHeightRatio;
        this.baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterWidth);
        // Use padding-top and margin-top to maintain the given aspect ratio, as
        // a percentage-based value for these properties is applied versus the *width* of the
        // containing block. See http://www.w3.org/TR/CSS2/box.html#margin-properties
        tile._setStyle('margin-top', this.getTilePosition(this.baseTileHeight, rowIndex));
        tile._setStyle('padding-top', calc(this.getTileSize(this.baseTileHeight, tile.rowspan)));
    };
    /**
     * @return {?}
     */
    RatioTileStyler.prototype.getComputedHeight = function () {
        return [
            'padding-bottom', calc(this.getTileSpan(this.baseTileHeight) + " + " + this.getGutterSpan())
        ];
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RatioTileStyler.prototype._parseRatio = function (value) {
        var /** @type {?} */ ratioParts = value.split(':');
        if (ratioParts.length !== 2) {
            throw Error("md-grid-list: invalid ratio given for row-height: \"" + value + "\"");
        }
        this.rowHeightRatio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);
    };
    return RatioTileStyler;
}(TileStyler));
/**
 * This type of styler is instantiated when the user selects a "fit" row height mode.
 * In other words, the row height will reflect the total height of the container divided
 * by the number of rows.  Example <md-grid-list cols="3" rowHeight="fit">
 *
 * \@docs-private
 */
var FitTileStyler = (function (_super) {
    tslib_1.__extends(FitTileStyler, _super);
    function FitTileStyler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} tile
     * @param {?} rowIndex
     * @return {?}
     */
    FitTileStyler.prototype.setRowStyles = function (tile, rowIndex) {
        // Percent of the available vertical space that one row takes up.
        var /** @type {?} */ percentHeightPerTile = 100 / this._rowspan;
        // Fraction of the horizontal gutter size that each column takes up.
        var /** @type {?} */ gutterHeightPerTile = (this._rows - 1) / this._rows;
        // Base vertical size of a column.
        var /** @type {?} */ baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterHeightPerTile);
        tile._setStyle('top', this.getTilePosition(baseTileHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(baseTileHeight, tile.rowspan)));
    };
    return FitTileStyler;
}(TileStyler));
/**
 * Wraps a CSS string in a calc function
 * @param {?} exp
 * @return {?}
 */
function calc(exp) { return "calc(" + exp + ")"; }
/**
 * Appends pixels to a CSS string if no units are given.
 * @param {?} value
 * @return {?}
 */
function normalizeUnits(value) {
    return (value.match(/px|em|rem/)) ? value : value + 'px';
}
// TODO(kara): Conditional (responsive) column count / row size.
// TODO(kara): Re-layout on window resize / media change (debounced).
// TODO(kara): gridTileHeader and gridTileFooter.
var MD_FIT_MODE = 'fit';
var MdGridList = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _dir
     */
    function MdGridList(_renderer, _element, _dir) {
        this._renderer = _renderer;
        this._element = _element;
        this._dir = _dir;
        /**
         * The amount of space between tiles. This will be something like '5px' or '2em'.
         */
        this._gutter = '1px';
    }
    Object.defineProperty(MdGridList.prototype, "cols", {
        /**
         * Amount of columns in the grid list.
         * @return {?}
         */
        get: function () { return this._cols; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._cols = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "gutterSize", {
        /**
         * Size of the grid list's gutter in pixels.
         * @return {?}
         */
        get: function () { return this._gutter; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._gutter = coerceToString(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "rowHeight", {
        /**
         * Set internal representation of row height from the user-provided value.
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._rowHeight = coerceToString(value);
            this._setTileStyler();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdGridList.prototype.ngOnInit = function () {
        this._checkCols();
        this._checkRowHeight();
    };
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     * @return {?}
     */
    MdGridList.prototype.ngAfterContentChecked = function () {
        this._layoutTiles();
    };
    /**
     * Throw a friendly error if cols property is missing
     * @return {?}
     */
    MdGridList.prototype._checkCols = function () {
        if (!this.cols) {
            throw Error("md-grid-list: must pass in number of columns. " +
                "Example: <md-grid-list cols=\"3\">");
        }
    };
    /**
     * Default to equal width:height if rowHeight property is missing
     * @return {?}
     */
    MdGridList.prototype._checkRowHeight = function () {
        if (!this._rowHeight) {
            this._tileStyler = new RatioTileStyler('1:1');
        }
    };
    /**
     * Creates correct Tile Styler subtype based on rowHeight passed in by user
     * @return {?}
     */
    MdGridList.prototype._setTileStyler = function () {
        if (this._rowHeight === MD_FIT_MODE) {
            this._tileStyler = new FitTileStyler();
        }
        else if (this._rowHeight && this._rowHeight.indexOf(':') > -1) {
            this._tileStyler = new RatioTileStyler(this._rowHeight);
        }
        else {
            this._tileStyler = new FixedTileStyler(this._rowHeight);
        }
    };
    /**
     * Computes and applies the size and position for all children grid tiles.
     * @return {?}
     */
    MdGridList.prototype._layoutTiles = function () {
        var _this = this;
        var /** @type {?} */ tracker = new TileCoordinator(this.cols, this._tiles);
        var /** @type {?} */ direction = this._dir ? this._dir.value : 'ltr';
        this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
        this._tiles.forEach(function (tile, index) {
            var /** @type {?} */ pos = tracker.positions[index];
            _this._tileStyler.setStyle(tile, pos.row, pos.col);
        });
        this._setListStyle(this._tileStyler.getComputedHeight());
    };
    /**
     * Sets style on the main grid-list element, given the style name and value.
     * @param {?} style
     * @return {?}
     */
    MdGridList.prototype._setListStyle = function (style$$1) {
        if (style$$1) {
            this._renderer.setStyle(this._element.nativeElement, style$$1[0], style$$1[1]);
        }
    };
    return MdGridList;
}());
MdGridList.decorators = [
    { type: Component, args: [{ selector: 'md-grid-list, mat-grid-list',
                template: "<div><ng-content></ng-content></div>",
                styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-footer,.mat-grid-tile .mat-grid-tile-header{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-footer>*,.mat-grid-tile .mat-grid-tile-header>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-grid-tile .mat-grid-tile-footer.mat-2-line,.mat-grid-tile .mat-grid-tile-header.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}"],
                host: {
                    'class': 'mat-grid-list',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdGridList.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: Directionality, decorators: [{ type: Optional },] },
]; };
MdGridList.propDecorators = {
    '_tiles': [{ type: ContentChildren, args: [MdGridTile,] },],
    'cols': [{ type: Input },],
    'gutterSize': [{ type: Input },],
    'rowHeight': [{ type: Input },],
};
var MdGridListModule = (function () {
    function MdGridListModule() {
    }
    return MdGridListModule;
}());
MdGridListModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdLineModule, MdCommonModule],
                exports: [
                    MdGridList,
                    MdGridTile,
                    MdGridTileText,
                    MdLineModule,
                    MdCommonModule,
                    MdGridTileHeaderCssMatStyler,
                    MdGridTileFooterCssMatStyler,
                    MdGridAvatarCssMatStyler
                ],
                declarations: [
                    MdGridList,
                    MdGridTile,
                    MdGridTileText,
                    MdGridTileHeaderCssMatStyler,
                    MdGridTileFooterCssMatStyler,
                    MdGridAvatarCssMatStyler
                ],
            },] },
];
/**
 * @nocollapse
 */
MdGridListModule.ctorParameters = function () { return []; };
/**
 * Content of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardContent = (function () {
    function MdCardContent() {
    }
    return MdCardContent;
}());
MdCardContent.decorators = [
    { type: Directive, args: [{
                selector: 'md-card-content, mat-card-content',
                host: { 'class': 'mat-card-content' }
            },] },
];
/**
 * @nocollapse
 */
MdCardContent.ctorParameters = function () { return []; };
/**
 * Title of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardTitle = (function () {
    function MdCardTitle() {
    }
    return MdCardTitle;
}());
MdCardTitle.decorators = [
    { type: Directive, args: [{
                selector: "md-card-title, mat-card-title, [md-card-title], [mat-card-title],\n             [mdCardTitle], [matCardTitle]",
                host: {
                    'class': 'mat-card-title'
                }
            },] },
];
/**
 * @nocollapse
 */
MdCardTitle.ctorParameters = function () { return []; };
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardSubtitle = (function () {
    function MdCardSubtitle() {
    }
    return MdCardSubtitle;
}());
MdCardSubtitle.decorators = [
    { type: Directive, args: [{
                selector: "md-card-subtitle, mat-card-subtitle, [md-card-subtitle], [mat-card-subtitle],\n             [mdCardSubtitle], [matCardSubtitle]",
                host: {
                    'class': 'mat-card-subtitle'
                }
            },] },
];
/**
 * @nocollapse
 */
MdCardSubtitle.ctorParameters = function () { return []; };
/**
 * Action section of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardActions = (function () {
    function MdCardActions() {
        /**
         * Position of the actions inside the card.
         */
        this.align = 'start';
    }
    return MdCardActions;
}());
MdCardActions.decorators = [
    { type: Directive, args: [{
                selector: 'md-card-actions, mat-card-actions',
                host: {
                    'class': 'mat-card-actions',
                    '[class.mat-card-actions-align-end]': 'align === "end"',
                }
            },] },
];
/**
 * @nocollapse
 */
MdCardActions.ctorParameters = function () { return []; };
MdCardActions.propDecorators = {
    'align': [{ type: Input },],
};
/**
 * Footer of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
var MdCardFooter = (function () {
    function MdCardFooter() {
    }
    return MdCardFooter;
}());
MdCardFooter.decorators = [
    { type: Directive, args: [{
                selector: 'md-card-footer, mat-card-footer',
                host: { 'class': 'mat-card-footer' }
            },] },
];
/**
 * @nocollapse
 */
MdCardFooter.ctorParameters = function () { return []; };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardImage = (function () {
    function MdCardImage() {
    }
    return MdCardImage;
}());
MdCardImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-image], [mat-card-image], [mdCardImage], [matCardImage]',
                host: { 'class': 'mat-card-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardImage.ctorParameters = function () { return []; };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardSmImage = (function () {
    function MdCardSmImage() {
    }
    return MdCardSmImage;
}());
MdCardSmImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-sm-image], [mat-card-sm-image], [mdCardImageSmall], [matCardImageSmall]',
                host: { 'class': 'mat-card-sm-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardSmImage.ctorParameters = function () { return []; };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardMdImage = (function () {
    function MdCardMdImage() {
    }
    return MdCardMdImage;
}());
MdCardMdImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-md-image], [mat-card-md-image], [mdCardImageMedium], [matCardImageMedium]',
                host: { 'class': 'mat-card-md-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardMdImage.ctorParameters = function () { return []; };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardLgImage = (function () {
    function MdCardLgImage() {
    }
    return MdCardLgImage;
}());
MdCardLgImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-lg-image], [mat-card-lg-image], [mdCardImageLarge], [matCardImageLarge]',
                host: { 'class': 'mat-card-lg-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardLgImage.ctorParameters = function () { return []; };
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardXlImage = (function () {
    function MdCardXlImage() {
    }
    return MdCardXlImage;
}());
MdCardXlImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-xl-image], [mat-card-xl-image], [mdCardImageXLarge], [matCardImageXLarge]',
                host: { 'class': 'mat-card-xl-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardXlImage.ctorParameters = function () { return []; };
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
var MdCardAvatar = (function () {
    function MdCardAvatar() {
    }
    return MdCardAvatar;
}());
MdCardAvatar.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-avatar], [mat-card-avatar], [mdCardAvatar], [matCardAvatar]',
                host: { 'class': 'mat-card-avatar' }
            },] },
];
/**
 * @nocollapse
 */
MdCardAvatar.ctorParameters = function () { return []; };
/**
 * A basic content container component that adds the styles of a Material design card.
 *
 * While this component can be used alone, it also provides a number
 * of preset styles for common card sections, including:
 * - md-card-title
 * - md-card-subtitle
 * - md-card-content
 * - md-card-actions
 * - md-card-footer
 */
var MdCard = (function () {
    function MdCard() {
    }
    return MdCard;
}());
MdCard.decorators = [
    { type: Component, args: [{ selector: 'md-card, mat-card',
                template: "<ng-content></ng-content><ng-content select=\"md-card-footer, mat-card-footer\"></ng-content>",
                styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);display:block;position:relative;padding:24px;border-radius:2px}.mat-card:not([class*=mat-elevation-z]){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.mat-card{outline:solid 1px}}.mat-card-flat{box-shadow:none}.mat-card-actions,.mat-card-content,.mat-card-subtitle,.mat-card-title{display:block;margin-bottom:16px}.mat-card-actions{margin-left:-16px;margin-right:-16px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 48px);margin:0 -24px 16px -24px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-footer{display:block;margin:0 -24px -24px -24px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button{margin:0 4px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header-text{margin:0 8px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0}.mat-card-lg-image,.mat-card-md-image,.mat-card-sm-image{margin:-8px 0}.mat-card-title-group{display:flex;justify-content:space-between;margin:0 -8px}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}@media (max-width:600px){.mat-card{padding:24px 16px}.mat-card-actions{margin-left:-8px;margin-right:-8px}.mat-card-image{width:calc(100% + 32px);margin:16px -16px}.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}.mat-card-header{margin:-8px 0 0 0}.mat-card-footer{margin-left:-16px;margin-right:-16px}}.mat-card-content>:first-child,.mat-card>:first-child{margin-top:0}.mat-card-content>:last-child:not(.mat-card-footer),.mat-card>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-24px}.mat-card>.mat-card-actions:last-child{margin-bottom:-16px;padding-bottom:0}.mat-card-actions .mat-button:first-child,.mat-card-actions .mat-raised-button:first-child{margin-left:0;margin-right:0}.mat-card-subtitle:not(:first-child),.mat-card-title:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card' }
            },] },
];
/**
 * @nocollapse
 */
MdCard.ctorParameters = function () { return []; };
/**
 * Component intended to be used within the `<md-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 * \@docs-private
 */
var MdCardHeader = (function () {
    function MdCardHeader() {
    }
    return MdCardHeader;
}());
MdCardHeader.decorators = [
    { type: Component, args: [{ selector: 'md-card-header, mat-card-header',
                template: "<ng-content select=\"[md-card-avatar], [mat-card-avatar], [mdCardAvatar], [matCardAvatar]\"></ng-content><div class=\"mat-card-header-text\"><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle, [md-card-title], [mat-card-title], [md-card-subtitle], [mat-card-subtitle]\"></ng-content></div><ng-content></ng-content>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card-header' }
            },] },
];
/**
 * @nocollapse
 */
MdCardHeader.ctorParameters = function () { return []; };
/**
 * Component intended to be used within the <md-card> component. It adds styles for a preset
 * layout that groups an image with a title section.
 * \@docs-private
 */
var MdCardTitleGroup = (function () {
    function MdCardTitleGroup() {
    }
    return MdCardTitleGroup;
}());
MdCardTitleGroup.decorators = [
    { type: Component, args: [{ selector: 'md-card-title-group, mat-card-title-group',
                template: "<div><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle, [md-card-title], [mat-card-title], [md-card-subtitle], [mat-card-subtitle]\"></ng-content></div><ng-content select=\"img\"></ng-content><ng-content></ng-content>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card-title-group' }
            },] },
];
/**
 * @nocollapse
 */
MdCardTitleGroup.ctorParameters = function () { return []; };
var MdCardModule = (function () {
    function MdCardModule() {
    }
    return MdCardModule;
}());
MdCardModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule],
                exports: [
                    MdCard,
                    MdCardHeader,
                    MdCardTitleGroup,
                    MdCardContent,
                    MdCardTitle,
                    MdCardSubtitle,
                    MdCardActions,
                    MdCardFooter,
                    MdCardSmImage,
                    MdCardMdImage,
                    MdCardLgImage,
                    MdCardImage,
                    MdCardXlImage,
                    MdCardAvatar,
                    MdCommonModule,
                ],
                declarations: [
                    MdCard, MdCardHeader, MdCardTitleGroup, MdCardContent, MdCardTitle, MdCardSubtitle,
                    MdCardActions, MdCardFooter, MdCardSmImage, MdCardMdImage, MdCardLgImage, MdCardImage,
                    MdCardXlImage, MdCardAvatar,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdCardModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var MdChipBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdChipBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdChipBase;
}());
var _MdChipMixinBase = mixinColor(mixinDisabled(MdChipBase), 'primary');
/**
 * Dummy directive to add CSS class to basic chips.
 * \@docs-private
 */
var MdBasicChip = (function () {
    function MdBasicChip() {
    }
    return MdBasicChip;
}());
MdBasicChip.decorators = [
    { type: Directive, args: [{
                selector: "md-basic-chip, [md-basic-chip], mat-basic-chip, [mat-basic-chip]",
                host: { 'class': 'mat-basic-chip' }
            },] },
];
/**
 * @nocollapse
 */
MdBasicChip.ctorParameters = function () { return []; };
/**
 * Material design styled Chip component. Used inside the MdChipList component.
 */
var MdChip = (function (_super) {
    tslib_1.__extends(MdChip, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    function MdChip(renderer, elementRef) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._selected = false;
        _this._selectable = true;
        _this._removable = true;
        /**
         * Whether the chip has focus.
         */
        _this._hasFocus = false;
        /**
         * Emits when the chip is focused.
         */
        _this._onFocus = new Subject();
        /**
         * Emitted when the chip is selected.
         */
        _this.select = new EventEmitter();
        /**
         * Emitted when the chip is deselected.
         */
        _this.deselect = new EventEmitter();
        /**
         * Emitted when the chip is destroyed.
         */
        _this.destroy = new EventEmitter();
        /**
         * Emitted when a chip is to be removed.
         */
        _this.onRemove = new EventEmitter();
        return _this;
    }
    Object.defineProperty(MdChip.prototype, "selected", {
        /**
         * Whether the chip is selected.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selected = coerceBooleanProperty(value);
            (this.selected ? this.select : this.deselect).emit({ chip: this });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "selectable", {
        /**
         * Whether or not the chips are selectable. When a chip is not selectable,
         * changes to it's selected state are always ignored.
         * @return {?}
         */
        get: function () {
            return this._selectable;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selectable = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "removable", {
        /**
         * Determines whether or not the chip displays the remove styling and emits (remove) events.
         * @return {?}
         */
        get: function () {
            return this._removable;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._removable = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "ariaSelected", {
        /**
         * @return {?}
         */
        get: function () {
            return this.selectable ? this.selected.toString() : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdChip.prototype.ngOnDestroy = function () {
        this.destroy.emit({ chip: this });
    };
    /**
     * Toggles the current selected state of this chip.
     * @return {?}
     */
    MdChip.prototype.toggleSelected = function () {
        this.selected = !this.selected;
        return this.selected;
    };
    /**
     * Allows for programmatic focusing of the chip.
     * @return {?}
     */
    MdChip.prototype.focus = function () {
        this._elementRef.nativeElement.focus();
        this._onFocus.next({ chip: this });
    };
    /**
     * Allows for programmatic removal of the chip. Called by the MdChipList when the DELETE or
     * BACKSPACE keys are pressed.
     *
     * Informs any listeners of the removal request. Does not remove the chip from the DOM.
     * @return {?}
     */
    MdChip.prototype.remove = function () {
        if (this.removable) {
            this.onRemove.emit({ chip: this });
        }
    };
    /**
     * Ensures events fire properly upon click.
     * @param {?} event
     * @return {?}
     */
    MdChip.prototype._handleClick = function (event) {
        // Check disabled
        if (this.disabled) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        this.focus();
    };
    /**
     * Handle custom key presses.
     * @param {?} event
     * @return {?}
     */
    MdChip.prototype._handleKeydown = function (event) {
        if (this.disabled) {
            return;
        }
        switch (event.keyCode) {
            case DELETE:
            case BACKSPACE:
                // If we are removable, remove the focused chip
                this.remove();
                // Always prevent so page navigation does not occur
                event.preventDefault();
                break;
            case SPACE:
                // If we are selectable, toggle the focused chip
                if (this.selectable) {
                    this.toggleSelected();
                }
                // Always prevent space from scrolling the page since the list has focus
                event.preventDefault();
                break;
        }
    };
    return MdChip;
}(_MdChipMixinBase));
MdChip.decorators = [
    { type: Directive, args: [{
                selector: "md-basic-chip, [md-basic-chip], md-chip, [md-chip],\n             mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]",
                inputs: ['color', 'disabled'],
                exportAs: 'mdChip',
                host: {
                    'class': 'mat-chip',
                    'tabindex': '-1',
                    'role': 'option',
                    '[class.mat-chip-selected]': 'selected',
                    '[attr.disabled]': 'disabled || null',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-selected]': 'ariaSelected',
                    '(click)': '_handleClick($event)',
                    '(keydown)': '_handleKeydown($event)',
                    '(focus)': '_hasFocus = true',
                    '(blur)': '_hasFocus = false',
                }
            },] },
];
/**
 * @nocollapse
 */
MdChip.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
MdChip.propDecorators = {
    '_chipRemove': [{ type: ContentChild, args: [forwardRef(function () { return MdChipRemove; }),] },],
    'selected': [{ type: Input },],
    'selectable': [{ type: Input },],
    'removable': [{ type: Input },],
    'select': [{ type: Output },],
    'deselect': [{ type: Output },],
    'destroy': [{ type: Output },],
    'onRemove': [{ type: Output, args: ['remove',] },],
};
/**
 * Applies proper (click) support and adds styling for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 *     <md-chip>
 *       <md-icon mdChipRemove>cancel</md-icon>
 *     </md-chip>
 *
 * You *may* use a custom icon, but you may need to override the `md-chip-remove` positioning styles
 * to properly center the icon within the chip.
 */
var MdChipRemove = (function () {
    /**
     * @param {?} _parentChip
     */
    function MdChipRemove(_parentChip) {
        this._parentChip = _parentChip;
    }
    /**
     * Calls the parent chip's public `remove()` method if applicable.
     * @return {?}
     */
    MdChipRemove.prototype._handleClick = function () {
        if (this._parentChip.removable) {
            this._parentChip.remove();
        }
    };
    return MdChipRemove;
}());
MdChipRemove.decorators = [
    { type: Directive, args: [{
                selector: '[mdChipRemove], [matChipRemove]',
                host: {
                    'class': 'mat-chip-remove',
                    '(click)': '_handleClick($event)'
                }
            },] },
];
/**
 * @nocollapse
 */
MdChipRemove.ctorParameters = function () { return [
    { type: MdChip, },
]; };
/**
 * A material design chips component (named ChipList for it's similarity to the List component).
 *
 * Example:
 *
 *     <md-chip-list>
 *       <md-chip>Chip 1<md-chip>
 *       <md-chip>Chip 2<md-chip>
 *     </md-chip-list>
 */
var MdChipList = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _dir
     */
    function MdChipList(_renderer, _elementRef, _dir) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._dir = _dir;
        /**
         * When a chip is destroyed, we track the index so we can focus the appropriate next chip.
         */
        this._lastDestroyedIndex = null;
        /**
         * Track which chips we're listening to for focus/destruction.
         */
        this._chipSet = new WeakMap();
        /**
         * Whether or not the chip is selectable.
         */
        this._selectable = true;
        /**
         * Tab index for the chip list.
         */
        this._tabIndex = 0;
        /**
         * User defined tab index.
         * When it is not null, use user defined tab index. Otherwise use _tabIndex
         */
        this._userTabIndex = null;
    }
    /**
     * @return {?}
     */
    MdChipList.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.chips).withWrap();
        // Prevents the chip list from capturing focus and redirecting
        // it back to the first chip when the user tabs out.
        this._tabOutSubscription = this._keyManager.tabOut.subscribe(function () {
            _this._tabIndex = -1;
            setTimeout(function () { return _this._tabIndex = _this._userTabIndex || 0; });
        });
        // Go ahead and subscribe all of the initial chips
        this._subscribeChips(this.chips);
        // Make sure we set our tab index at the start
        this._updateTabIndex();
        // When the list changes, re-subscribe
        this.chips.changes.subscribe(function (chips) {
            _this._subscribeChips(chips);
            // If we have 0 chips, attempt to focus an input (if available)
            if (chips.length === 0) {
                _this._focusInput();
            }
            // Check to see if we need to update our tab index
            _this._updateTabIndex();
            // Check to see if we have a destroyed chip and need to refocus
            _this._updateFocusForDestroyedChips();
        });
    };
    /**
     * @return {?}
     */
    MdChipList.prototype.ngOnDestroy = function () {
        if (this._tabOutSubscription) {
            this._tabOutSubscription.unsubscribe();
        }
    };
    Object.defineProperty(MdChipList.prototype, "selectable", {
        /**
         * Whether or not this chip is selectable. When a chip is not selectable,
         * it's selected state is always ignored.
         * @return {?}
         */
        get: function () {
            return this._selectable;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selectable = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipList.prototype, "tabIndex", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._userTabIndex = value;
            this._tabIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Associates an HTML input element with this chip list.
     * @param {?} inputElement
     * @return {?}
     */
    MdChipList.prototype.registerInput = function (inputElement) {
        this._inputElement = inputElement;
    };
    /**
     * Focuses the the first non-disabled chip in this chip list, or the associated input when there
     * are no eligible chips.
     * @return {?}
     */
    MdChipList.prototype.focus = function () {
        // TODO: ARIA says this should focus the first `selected` chip if any are selected.
        if (this.chips.length > 0) {
            this._keyManager.setFirstItemActive();
        }
        else {
            this._focusInput();
        }
    };
    /**
     * Attempt to focus an input if we have one.
     * @return {?}
     */
    MdChipList.prototype._focusInput = function () {
        if (this._inputElement) {
            this._inputElement.focus();
        }
    };
    /**
     * Pass events to the keyboard manager. Available here for tests.
     * @param {?} event
     * @return {?}
     */
    MdChipList.prototype._keydown = function (event) {
        var /** @type {?} */ code = event.keyCode;
        var /** @type {?} */ target = (event.target);
        var /** @type {?} */ isInputEmpty = this._isInputEmpty(target);
        var /** @type {?} */ isRtl = this._dir && this._dir.value == 'rtl';
        var /** @type {?} */ isPrevKey = (code === (isRtl ? RIGHT_ARROW : LEFT_ARROW));
        var /** @type {?} */ isNextKey = (code === (isRtl ? LEFT_ARROW : RIGHT_ARROW));
        var /** @type {?} */ isBackKey = (code === BACKSPACE || code == DELETE || code == UP_ARROW || isPrevKey);
        // If they are on an empty input and hit backspace/delete/left arrow, focus the last chip
        if (isInputEmpty && isBackKey) {
            this._keyManager.setLastItemActive();
            event.preventDefault();
            return;
        }
        // If they are on a chip, check for space/left/right, otherwise pass to our key manager (like
        // up/down keys)
        if (target && target.classList.contains('mat-chip')) {
            if (isPrevKey) {
                this._keyManager.setPreviousItemActive();
                event.preventDefault();
            }
            else if (isNextKey) {
                this._keyManager.setNextItemActive();
                event.preventDefault();
            }
            else {
                this._keyManager.onKeydown(event);
            }
        }
    };
    /**
     * Iterate through the list of chips and add them to our list of
     * subscribed chips.
     *
     * @param {?} chips The list of chips to be subscribed.
     * @return {?}
     */
    MdChipList.prototype._subscribeChips = function (chips) {
        var _this = this;
        chips.forEach(function (chip) { return _this._addChip(chip); });
    };
    /**
     * Check the tab index as you should not be allowed to focus an empty list.
     * @return {?}
     */
    MdChipList.prototype._updateTabIndex = function () {
        // If we have 0 chips, we should not allow keyboard focus
        this._tabIndex = this._userTabIndex || (this.chips.length === 0 ? -1 : 0);
    };
    /**
     * Add a specific chip to our subscribed list. If the chip has
     * already been subscribed, this ensures it is only subscribed
     * once.
     *
     * @param {?} chip The chip to be subscribed (or checked for existing
     * subscription).
     * @return {?}
     */
    MdChipList.prototype._addChip = function (chip) {
        var _this = this;
        // If we've already been subscribed to a parent, do nothing
        if (this._chipSet.has(chip)) {
            return;
        }
        // Watch for focus events outside of the keyboard navigation
        chip._onFocus.subscribe(function () {
            var /** @type {?} */ chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex)) {
                _this._keyManager.updateActiveItemIndex(chipIndex);
            }
        });
        // On destroy, remove the item from our list, and setup our destroyed focus check
        chip.destroy.subscribe(function () {
            var /** @type {?} */ chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex)) {
                if (chip._hasFocus) {
                    // Check whether the chip is the last item
                    if (chipIndex < _this.chips.length - 1) {
                        _this._keyManager.setActiveItem(chipIndex);
                    }
                    else if (chipIndex - 1 >= 0) {
                        _this._keyManager.setActiveItem(chipIndex - 1);
                    }
                }
                if (_this._keyManager.activeItemIndex === chipIndex) {
                    _this._lastDestroyedIndex = chipIndex;
                }
            }
            _this._chipSet.delete(chip);
            chip.destroy.unsubscribe();
        });
        this._chipSet.set(chip, true);
    };
    /**
     * Checks to see if a focus chip was recently destroyed so that we can refocus the next closest
     * one.
     * @return {?}
     */
    MdChipList.prototype._updateFocusForDestroyedChips = function () {
        var /** @type {?} */ chipsArray = this.chips;
        if (this._lastDestroyedIndex != null && chipsArray.length > 0) {
            // Check whether the destroyed chip was the last item
            var /** @type {?} */ newFocusIndex = Math.min(this._lastDestroyedIndex, chipsArray.length - 1);
            this._keyManager.setActiveItem(newFocusIndex);
            var /** @type {?} */ focusChip = this._keyManager.activeItem;
            // Focus the chip
            if (focusChip) {
                focusChip.focus();
            }
        }
        // Reset our destroyed index
        this._lastDestroyedIndex = null;
    };
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param {?} index The index to be checked.
     * @return {?} True if the index is valid for our list of chips.
     */
    MdChipList.prototype._isValidIndex = function (index) {
        return index >= 0 && index < this.chips.length;
    };
    /**
     * @param {?} element
     * @return {?}
     */
    MdChipList.prototype._isInputEmpty = function (element) {
        if (element && element.nodeName.toLowerCase() === 'input') {
            var /** @type {?} */ input = (element);
            return !input.value;
        }
        return false;
    };
    return MdChipList;
}());
MdChipList.decorators = [
    { type: Component, args: [{ selector: 'md-chip-list, mat-chip-list',
                template: "<div class=\"mat-chip-list-wrapper\"><ng-content></ng-content></div>",
                exportAs: 'mdChipList',
                host: {
                    '[attr.tabindex]': '_tabIndex',
                    'role': 'listbox',
                    'class': 'mat-chip-list',
                    '(focus)': 'focus()',
                    '(keydown)': '_keydown($event)'
                },
                queries: {
                    chips: new ContentChildren(MdChip)
                },
                styles: [".mat-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:flex-start}.mat-chip:not(.mat-basic-chip){transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);display:inline-flex;padding:7px 12px;border-radius:24px;align-items:center;cursor:default}.mat-chip:not(.mat-basic-chip)+.mat-chip:not(.mat-basic-chip){margin:0 0 0 8px}[dir=rtl] .mat-chip:not(.mat-basic-chip)+.mat-chip:not(.mat-basic-chip){margin:0 8px 0 0}.mat-form-field-prefix .mat-chip:not(.mat-basic-chip):last-child{margin-right:8px}[dir=rtl] .mat-form-field-prefix .mat-chip:not(.mat-basic-chip):last-child{margin-left:8px}.mat-chip:not(.mat-basic-chip) .mat-chip-remove.mat-icon{width:1em;height:1em}.mat-chip:not(.mat-basic-chip):focus{box-shadow:0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12);outline:0}@media screen and (-ms-high-contrast:active){.mat-chip:not(.mat-basic-chip){outline:solid 1px}}.mat-chip-list-stacked .mat-chip-list-wrapper{display:block}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){display:block;margin:0;margin-bottom:8px}[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){margin:0;margin-bottom:8px}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child,[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child{margin-bottom:0}.mat-form-field-prefix .mat-chip-list-wrapper{margin-bottom:8px}.mat-chip-remove{margin-right:-4px;margin-left:6px;cursor:pointer}[dir=rtl] .mat-chip-remove{margin-right:6px;margin-left:-4px}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdChipList.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: Directionality, decorators: [{ type: Optional },] },
]; };
MdChipList.propDecorators = {
    'selectable': [{ type: Input },],
    'tabIndex': [{ type: Input },],
};
var MdChipInput = (function () {
    /**
     * @param {?} _elementRef
     */
    function MdChipInput(_elementRef) {
        this._elementRef = _elementRef;
        this._addOnBlur = false;
        /**
         * The list of key codes that will trigger a chipEnd event.
         *
         * Defaults to `[ENTER]`.
         */
        // TODO(tinayuangao): Support Set here
        this.separatorKeyCodes = [ENTER];
        /**
         * Emitted when a chip is to be added.
         */
        this.chipEnd = new EventEmitter();
        this._inputElement = this._elementRef.nativeElement;
    }
    Object.defineProperty(MdChipInput.prototype, "chipList", {
        /**
         * Register input for chip list
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value) {
                this._chipList = value;
                this._chipList.registerInput(this._inputElement);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "addOnBlur", {
        /**
         * Whether or not the chipEnd event will be emitted when the input is blurred.
         * @return {?}
         */
        get: function () { return this._addOnBlur; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._addOnBlur = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "matChipList", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.chipList = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "matAddOnBlur", {
        /**
         * @return {?}
         */
        get: function () { return this._addOnBlur; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.addOnBlur = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChipInput.prototype, "matSeparatorKeyCodes", {
        /**
         * @return {?}
         */
        get: function () { return this.separatorKeyCodes; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.separatorKeyCodes = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * Utility method to make host definition/tests more clear.
     * @param {?=} event
     * @return {?}
     */
    MdChipInput.prototype._keydown = function (event) {
        this._emitChipEnd(event);
    };
    /**
     * Checks to see if the blur should emit the (chipEnd) event.
     * @return {?}
     */
    MdChipInput.prototype._blur = function () {
        if (this.addOnBlur) {
            this._emitChipEnd();
        }
    };
    /**
     * Checks to see if the (chipEnd) event needs to be emitted.
     * @param {?=} event
     * @return {?}
     */
    MdChipInput.prototype._emitChipEnd = function (event) {
        if (!this._inputElement.value && !!event) {
            this._chipList._keydown(event);
        }
        if (!event || this.separatorKeyCodes.indexOf(event.keyCode) > -1) {
            this.chipEnd.emit({ input: this._inputElement, value: this._inputElement.value });
            if (event) {
                event.preventDefault();
            }
        }
    };
    return MdChipInput;
}());
MdChipInput.decorators = [
    { type: Directive, args: [{
                selector: 'input[mdChipInputFor], input[matChipInputFor]',
                host: {
                    'class': 'mat-chip-input',
                    '(keydown)': '_keydown($event)',
                    '(blur)': '_blur()'
                }
            },] },
];
/**
 * @nocollapse
 */
MdChipInput.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
MdChipInput.propDecorators = {
    'chipList': [{ type: Input, args: ['mdChipInputFor',] },],
    'addOnBlur': [{ type: Input, args: ['mdChipInputAddOnBlur',] },],
    'separatorKeyCodes': [{ type: Input, args: ['mdChipInputSeparatorKeyCodes',] },],
    'chipEnd': [{ type: Output, args: ['mdChipInputTokenEnd',] },],
    'matChipList': [{ type: Input, args: ['matChipInputFor',] },],
    'matAddOnBlur': [{ type: Input, args: ['matChipInputAddOnBlur',] },],
    'matSeparatorKeyCodes': [{ type: Input, args: ['matChipInputSeparatorKeyCodes',] },],
};
var MdChipsModule = (function () {
    function MdChipsModule() {
    }
    return MdChipsModule;
}());
MdChipsModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                exports: [MdChipList, MdChip, MdChipInput, MdChipRemove, MdChipRemove, MdBasicChip],
                declarations: [MdChipList, MdChip, MdChipInput, MdChipRemove, MdChipRemove, MdBasicChip]
            },] },
];
/**
 * @nocollapse
 */
MdChipsModule.ctorParameters = function () { return []; };
/**
 * Returns an exception to be thrown in the case when attempting to
 * load an icon with a name that cannot be found.
 * \@docs-private
 * @param {?} iconName
 * @return {?}
 */
function getMdIconNameNotFoundError(iconName) {
    return Error("Unable to find icon with the name \"" + iconName + "\"");
}
/**
 * Returns an exception to be thrown when the consumer attempts to use
 * `<md-icon>` without including \@angular/http.
 * \@docs-private
 * @return {?}
 */
function getMdIconNoHttpProviderError() {
    return Error('Could not find Http provider for use with Angular Material icons. ' +
        'Please include the HttpModule from @angular/http in your app imports.');
}
/**
 * Returns an exception to be thrown when a URL couldn't be sanitized.
 * \@docs-private
 * @param {?} url URL that was attempted to be sanitized.
 * @return {?}
 */
function getMdIconFailedToSanitizeError(url) {
    return Error("The URL provided to MdIconRegistry was not trusted as a resource URL " +
        ("via Angular's DomSanitizer. Attempted URL was \"" + url + "\"."));
}
/**
 * Configuration for an icon, including the URL and possibly the cached SVG element.
 * \@docs-private
 */
var SvgIconConfig = (function () {
    /**
     * @param {?} url
     */
    function SvgIconConfig(url) {
        this.url = url;
        this.svgElement = null;
    }
    return SvgIconConfig;
}());
/**
 * Service to register and display icons used by the <md-icon> component.
 * - Registers icon URLs by namespace and name.
 * - Registers icon set URLs by namespace.
 * - Registers aliases for CSS classes, for use with icon fonts.
 * - Loads icons from URLs and extracts individual icons from icon sets.
 */
var MdIconRegistry = (function () {
    /**
     * @param {?} _http
     * @param {?} _sanitizer
     */
    function MdIconRegistry(_http, _sanitizer) {
        this._http = _http;
        this._sanitizer = _sanitizer;
        /**
         * URLs and cached SVG elements for individual icons. Keys are of the format "[namespace]:[icon]".
         */
        this._svgIconConfigs = new Map();
        /**
         * SvgIconConfig objects and cached SVG elements for icon sets, keyed by namespace.
         * Multiple icon sets can be registered under the same namespace.
         */
        this._iconSetConfigs = new Map();
        /**
         * Cache for icons loaded by direct URLs.
         */
        this._cachedIconsByUrl = new Map();
        /**
         * In-progress icon fetches. Used to coalesce multiple requests to the same URL.
         */
        this._inProgressUrlFetches = new Map();
        /**
         * Map from font identifiers to their CSS class names. Used for icon fonts.
         */
        this._fontCssClassesByAlias = new Map();
        /**
         * The CSS class to apply when an <md-icon> component has no icon name, url, or font specified.
         * The default 'material-icons' value assumes that the material icon font has been loaded as
         * described at http://google.github.io/material-design-icons/#icon-font-for-the-web
         */
        this._defaultFontSetClass = 'material-icons';
    }
    /**
     * Registers an icon by URL in the default namespace.
     * @param {?} iconName Name under which the icon should be registered.
     * @param {?} url
     * @return {?}
     */
    MdIconRegistry.prototype.addSvgIcon = function (iconName, url) {
        return this.addSvgIconInNamespace('', iconName, url);
    };
    /**
     * Registers an icon by URL in the specified namespace.
     * @param {?} namespace Namespace in which the icon should be registered.
     * @param {?} iconName Name under which the icon should be registered.
     * @param {?} url
     * @return {?}
     */
    MdIconRegistry.prototype.addSvgIconInNamespace = function (namespace, iconName, url) {
        var /** @type {?} */ key = iconKey(namespace, iconName);
        this._svgIconConfigs.set(key, new SvgIconConfig(url));
        return this;
    };
    /**
     * Registers an icon set by URL in the default namespace.
     * @param {?} url
     * @return {?}
     */
    MdIconRegistry.prototype.addSvgIconSet = function (url) {
        return this.addSvgIconSetInNamespace('', url);
    };
    /**
     * Registers an icon set by URL in the specified namespace.
     * @param {?} namespace Namespace in which to register the icon set.
     * @param {?} url
     * @return {?}
     */
    MdIconRegistry.prototype.addSvgIconSetInNamespace = function (namespace, url) {
        var /** @type {?} */ config = new SvgIconConfig(url);
        var /** @type {?} */ configNamespace = this._iconSetConfigs.get(namespace);
        if (configNamespace) {
            configNamespace.push(config);
        }
        else {
            this._iconSetConfigs.set(namespace, [config]);
        }
        return this;
    };
    /**
     * Defines an alias for a CSS class name to be used for icon fonts. Creating an mdIcon
     * component with the alias as the fontSet input will cause the class name to be applied
     * to the <md-icon> element.
     *
     * @param {?} alias Alias for the font.
     * @param {?=} className Class name override to be used instead of the alias.
     * @return {?}
     */
    MdIconRegistry.prototype.registerFontClassAlias = function (alias, className) {
        if (className === void 0) { className = alias; }
        this._fontCssClassesByAlias.set(alias, className);
        return this;
    };
    /**
     * Returns the CSS class name associated with the alias by a previous call to
     * registerFontClassAlias. If no CSS class has been associated, returns the alias unmodified.
     * @param {?} alias
     * @return {?}
     */
    MdIconRegistry.prototype.classNameForFontAlias = function (alias) {
        return this._fontCssClassesByAlias.get(alias) || alias;
    };
    /**
     * Sets the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     *
     * @param {?} className
     * @return {?}
     */
    MdIconRegistry.prototype.setDefaultFontSetClass = function (className) {
        this._defaultFontSetClass = className;
        return this;
    };
    /**
     * Returns the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     * @return {?}
     */
    MdIconRegistry.prototype.getDefaultFontSetClass = function () {
        return this._defaultFontSetClass;
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) from the given URL.
     * The response from the URL may be cached so this will not always cause an HTTP request, but
     * the produced element will always be a new copy of the originally fetched icon. (That is,
     * it will not contain any modifications made to elements previously returned).
     *
     * @param {?} safeUrl URL from which to fetch the SVG icon.
     * @return {?}
     */
    MdIconRegistry.prototype.getSvgIconFromUrl = function (safeUrl) {
        var _this = this;
        var /** @type {?} */ url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        if (!url) {
            throw getMdIconFailedToSanitizeError(safeUrl);
        }
        var /** @type {?} */ cachedIcon = this._cachedIconsByUrl.get(url);
        if (cachedIcon) {
            return of(cloneSvg(cachedIcon));
        }
        return RxChain.from(this._loadSvgIconFromConfig(new SvgIconConfig(url)))
            .call(doOperator, function (svg) { return _this._cachedIconsByUrl.set(/** @type {?} */ ((url)), svg); })
            .call(map, function (svg) { return cloneSvg(svg); })
            .result();
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) with the given name
     * and namespace. The icon must have been previously registered with addIcon or addIconSet;
     * if not, the Observable will throw an error.
     *
     * @param {?} name Name of the icon to be retrieved.
     * @param {?=} namespace Namespace in which to look for the icon.
     * @return {?}
     */
    MdIconRegistry.prototype.getNamedSvgIcon = function (name, namespace) {
        if (namespace === void 0) { namespace = ''; }
        // Return (copy of) cached icon if possible.
        var /** @type {?} */ key = iconKey(namespace, name);
        var /** @type {?} */ config = this._svgIconConfigs.get(key);
        if (config) {
            return this._getSvgFromConfig(config);
        }
        // See if we have any icon sets registered for the namespace.
        var /** @type {?} */ iconSetConfigs = this._iconSetConfigs.get(namespace);
        if (iconSetConfigs) {
            return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
        }
        return _throw(getMdIconNameNotFoundError(key));
    };
    /**
     * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
     * @param {?} config
     * @return {?}
     */
    MdIconRegistry.prototype._getSvgFromConfig = function (config) {
        if (config.svgElement) {
            // We already have the SVG element for this icon, return a copy.
            return of(cloneSvg(config.svgElement));
        }
        else {
            // Fetch the icon from the config's URL, cache it, and return a copy.
            return RxChain.from(this._loadSvgIconFromConfig(config))
                .call(doOperator, function (svg) { return config.svgElement = svg; })
                .call(map, function (svg) { return cloneSvg(svg); })
                .result();
        }
    };
    /**
     * Attempts to find an icon with the specified name in any of the SVG icon sets.
     * First searches the available cached icons for a nested element with a matching name, and
     * if found copies the element to a new <svg> element. If not found, fetches all icon sets
     * that have not been cached, and searches again after all fetches are completed.
     * The returned Observable produces the SVG element if possible, and throws
     * an error if no icon with the specified name can be found.
     * @param {?} name
     * @param {?} iconSetConfigs
     * @return {?}
     */
    MdIconRegistry.prototype._getSvgFromIconSetConfigs = function (name, iconSetConfigs) {
        var _this = this;
        // For all the icon set SVG elements we've fetched, see if any contain an icon with the
        // requested name.
        var /** @type {?} */ namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
        if (namedIcon) {
            // We could cache namedIcon in _svgIconConfigs, but since we have to make a copy every
            // time anyway, there's probably not much advantage compared to just always extracting
            // it from the icon set.
            return of(namedIcon);
        }
        // Not found in any cached icon sets. If there are icon sets with URLs that we haven't
        // fetched, fetch them now and look for iconName in the results.
        var /** @type {?} */ iconSetFetchRequests = iconSetConfigs
            .filter(function (iconSetConfig) { return !iconSetConfig.svgElement; })
            .map(function (iconSetConfig) {
            return RxChain.from(_this._loadSvgIconSetFromConfig(iconSetConfig))
                .call(catchOperator, function (err) {
                var /** @type {?} */ url = _this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, iconSetConfig.url);
                // Swallow errors fetching individual URLs so the combined Observable won't
                // necessarily fail.
                console.log("Loading icon set URL: " + url + " failed: " + err);
                return of(null);
            })
                .call(doOperator, function (svg) {
                // Cache the SVG element.
                if (svg) {
                    iconSetConfig.svgElement = svg;
                }
            })
                .result();
        });
        // Fetch all the icon set URLs. When the requests complete, every IconSet should have a
        // cached SVG element (unless the request failed), and we can check again for the icon.
        return map.call(forkJoin.call(Observable, iconSetFetchRequests), function () {
            var /** @type {?} */ foundIcon = _this._extractIconWithNameFromAnySet(name, iconSetConfigs);
            if (!foundIcon) {
                throw getMdIconNameNotFoundError(name);
            }
            return foundIcon;
        });
    };
    /**
     * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     * @param {?} iconName
     * @param {?} iconSetConfigs
     * @return {?}
     */
    MdIconRegistry.prototype._extractIconWithNameFromAnySet = function (iconName, iconSetConfigs) {
        // Iterate backwards, so icon sets added later have precedence.
        for (var /** @type {?} */ i = iconSetConfigs.length - 1; i >= 0; i--) {
            var /** @type {?} */ config = iconSetConfigs[i];
            if (config.svgElement) {
                var /** @type {?} */ foundIcon = this._extractSvgIconFromSet(config.svgElement, iconName);
                if (foundIcon) {
                    return foundIcon;
                }
            }
        }
        return null;
    };
    /**
     * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     * @param {?} config
     * @return {?}
     */
    MdIconRegistry.prototype._loadSvgIconFromConfig = function (config) {
        var _this = this;
        return map.call(this._fetchUrl(config.url), function (svgText) { return _this._createSvgElementForSingleIcon(svgText); });
    };
    /**
     * Loads the content of the icon set URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     * @param {?} config
     * @return {?}
     */
    MdIconRegistry.prototype._loadSvgIconSetFromConfig = function (config) {
        var _this = this;
        // TODO: Document that icons should only be loaded from trusted sources.
        return map.call(this._fetchUrl(config.url), function (svgText) { return _this._svgElementFromString(svgText); });
    };
    /**
     * Creates a DOM element from the given SVG string, and adds default attributes.
     * @param {?} responseText
     * @return {?}
     */
    MdIconRegistry.prototype._createSvgElementForSingleIcon = function (responseText) {
        var /** @type {?} */ svg = this._svgElementFromString(responseText);
        this._setSvgAttributes(svg);
        return svg;
    };
    /**
     * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     * @param {?} iconSet
     * @param {?} iconName
     * @return {?}
     */
    MdIconRegistry.prototype._extractSvgIconFromSet = function (iconSet, iconName) {
        var /** @type {?} */ iconNode = iconSet.querySelector('#' + iconName);
        if (!iconNode) {
            return null;
        }
        // If the icon node is itself an <svg> node, clone and return it directly. If not, set it as
        // the content of a new <svg> node.
        if (iconNode.tagName.toLowerCase() === 'svg') {
            return this._setSvgAttributes(/** @type {?} */ (iconNode.cloneNode(true)));
        }
        // If the node is a <symbol>, it won't be rendered so we have to convert it into <svg>. Note
        // that the same could be achieved by referring to it via <use href="#id">, however the <use>
        // tag is problematic on Firefox, because it needs to include the current page path.
        if (iconNode.nodeName.toLowerCase() === 'symbol') {
            return this._setSvgAttributes(this._toSvgElement(iconNode));
        }
        // createElement('SVG') doesn't work as expected; the DOM ends up with
        // the correct nodes, but the SVG content doesn't render. Instead we
        // have to create an empty SVG node using innerHTML and append its content.
        // Elements created using DOMParser.parseFromString have the same problem.
        // http://stackoverflow.com/questions/23003278/svg-innerhtml-in-firefox-can-not-display
        var /** @type {?} */ svg = this._svgElementFromString('<svg></svg>');
        // Clone the node so we don't remove it from the parent icon set element.
        svg.appendChild(iconNode.cloneNode(true));
        return this._setSvgAttributes(svg);
    };
    /**
     * Creates a DOM element from the given SVG string.
     * @param {?} str
     * @return {?}
     */
    MdIconRegistry.prototype._svgElementFromString = function (str) {
        // TODO: Is there a better way than innerHTML? Renderer doesn't appear to have a method for
        // creating an element from an HTML string.
        var /** @type {?} */ div = document.createElement('DIV');
        div.innerHTML = str;
        var /** @type {?} */ svg = (div.querySelector('svg'));
        if (!svg) {
            throw Error('<svg> tag not found');
        }
        return svg;
    };
    /**
     * Converts an element into an SVG node by cloning all of its children.
     * @param {?} element
     * @return {?}
     */
    MdIconRegistry.prototype._toSvgElement = function (element) {
        var /** @type {?} */ svg = this._svgElementFromString('<svg></svg>');
        for (var /** @type {?} */ i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].nodeType === Node.ELEMENT_NODE) {
                svg.appendChild(element.childNodes[i].cloneNode(true));
            }
        }
        return svg;
    };
    /**
     * Sets the default attributes for an SVG element to be used as an icon.
     * @param {?} svg
     * @return {?}
     */
    MdIconRegistry.prototype._setSvgAttributes = function (svg) {
        if (!svg.getAttribute('xmlns')) {
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        svg.setAttribute('fit', '');
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.
        return svg;
    };
    /**
     * Returns an Observable which produces the string contents of the given URL. Results may be
     * cached, so future calls with the same URL may not cause another HTTP request.
     * @param {?} safeUrl
     * @return {?}
     */
    MdIconRegistry.prototype._fetchUrl = function (safeUrl) {
        var _this = this;
        if (!this._http) {
            throw getMdIconNoHttpProviderError();
        }
        var /** @type {?} */ url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        if (!url) {
            throw getMdIconFailedToSanitizeError(safeUrl);
        }
        // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
        // already a request in progress for that URL. It's necessary to call share() on the
        // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
        var /** @type {?} */ inProgressFetch = this._inProgressUrlFetches.get(url);
        if (inProgressFetch) {
            return inProgressFetch;
        }
        // TODO(jelbourn): for some reason, the `finally` operator "loses" the generic type on the
        // Observable. Figure out why and fix it.
        var /** @type {?} */ req = RxChain.from(this._http.get(url))
            .call(map, function (response) { return response.text(); })
            .call(finallyOperator, function () { return _this._inProgressUrlFetches.delete(url); })
            .call(share)
            .result();
        this._inProgressUrlFetches.set(url, req);
        return req;
    };
    return MdIconRegistry;
}());
MdIconRegistry.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MdIconRegistry.ctorParameters = function () { return [
    { type: Http, decorators: [{ type: Optional },] },
    { type: DomSanitizer, },
]; };
/**
 * \@docs-private
 * @param {?} parentRegistry
 * @param {?} http
 * @param {?} sanitizer
 * @return {?}
 */
function ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry, http, sanitizer) {
    return parentRegistry || new MdIconRegistry(http, sanitizer);
}
/**
 * \@docs-private
 */
var ICON_REGISTRY_PROVIDER = {
    // If there is already an MdIconRegistry available, use that. Otherwise, provide a new one.
    provide: MdIconRegistry,
    deps: [[new Optional(), new SkipSelf(), MdIconRegistry], [new Optional(), Http], DomSanitizer],
    useFactory: ICON_REGISTRY_PROVIDER_FACTORY
};
/**
 * Clones an SVGElement while preserving type information.
 * @param {?} svg
 * @return {?}
 */
function cloneSvg(svg) {
    return (svg.cloneNode(true));
}
/**
 * Returns the cache key to use for an icon namespace and name.
 * @param {?} namespace
 * @param {?} name
 * @return {?}
 */
function iconKey(namespace, name) {
    return namespace + ':' + name;
}
/**
 * \@docs-private
 */
var MdIconBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdIconBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdIconBase;
}());
var _MdIconMixinBase = mixinColor(MdIconBase);
/**
 * Component to display an icon. It can be used in the following ways:
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   MdIconRegistry. If the svgIcon value contains a colon it is assumed to be in the format
 *   "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.
 *   Examples:
 *     <md-icon svgIcon="left-arrow"></md-icon>
 *     <md-icon svgIcon="animals:cat"></md-icon>
 *
 * - Use a font ligature as an icon by putting the ligature text in the content of the <md-icon>
 *   component. By default the Material icons font is used as described at
 *   http://google.github.io/material-design-icons/#icon-font-for-the-web. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with MdIconRegistry.registerFontClassAlias.
 *   Examples:
 *     <md-icon>home</md-icon>
 *     <md-icon fontSet="myfont">sun</md-icon>
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fortawesome.github.io/Font-Awesome/examples/
 *   Example:
 *     <md-icon fontSet="fa" fontIcon="alarm"></md-icon>
 */
var MdIcon = (function (_super) {
    tslib_1.__extends(MdIcon, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _mdIconRegistry
     * @param {?} ariaHidden
     */
    function MdIcon(renderer, elementRef, _mdIconRegistry, ariaHidden) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._mdIconRegistry = _mdIconRegistry;
        // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
        // the right thing to do for the majority of icon use-cases.
        if (!ariaHidden) {
            renderer.setAttribute(elementRef.nativeElement, 'aria-hidden', 'true');
        }
        return _this;
    }
    /**
     * Splits an svgIcon binding value into its icon set and icon name components.
     * Returns a 2-element array of [(icon set), (icon name)].
     * The separator for the two fields is ':'. If there is no separator, an empty
     * string is returned for the icon set and the entire value is returned for
     * the icon name. If the argument is falsy, returns an array of two empty strings.
     * Throws an error if the name contains two or more ':' separators.
     * Examples:
     *   'social:cake' -> ['social', 'cake']
     *   'penguin' -> ['', 'penguin']
     *   null -> ['', '']
     *   'a:b:c' -> (throws Error)
     * @param {?} iconName
     * @return {?}
     */
    MdIcon.prototype._splitIconName = function (iconName) {
        if (!iconName) {
            return ['', ''];
        }
        var /** @type {?} */ parts = iconName.split(':');
        switch (parts.length) {
            case 1: return ['', parts[0]]; // Use default namespace.
            case 2: return (parts);
            default: throw Error("Invalid icon name: \"" + iconName + "\"");
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    MdIcon.prototype.ngOnChanges = function (changes) {
        var _this = this;
        // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
        if (changes.svgIcon) {
            if (this.svgIcon) {
                var _a = this._splitIconName(this.svgIcon), namespace = _a[0], iconName = _a[1];
                first.call(this._mdIconRegistry.getNamedSvgIcon(iconName, namespace)).subscribe(function (svg) { return _this._setSvgElement(svg); }, function (err) { return console.log("Error retrieving icon: " + err.message); });
            }
            else {
                this._clearSvgElement();
            }
        }
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    };
    /**
     * @return {?}
     */
    MdIcon.prototype.ngOnInit = function () {
        // Update font classes because ngOnChanges won't be called if none of the inputs are present,
        // e.g. <md-icon>arrow</md-icon>. In this case we need to add a CSS class for the default font.
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    };
    /**
     * @return {?}
     */
    MdIcon.prototype._usingFontIcon = function () {
        return !this.svgIcon;
    };
    /**
     * @param {?} svg
     * @return {?}
     */
    MdIcon.prototype._setSvgElement = function (svg) {
        this._clearSvgElement();
        this._renderer.appendChild(this._elementRef.nativeElement, svg);
    };
    /**
     * @return {?}
     */
    MdIcon.prototype._clearSvgElement = function () {
        var /** @type {?} */ layoutElement = this._elementRef.nativeElement;
        var /** @type {?} */ childCount = layoutElement.childNodes.length;
        // Remove existing child nodes and add the new SVG element. Note that we can't
        // use innerHTML, because IE will throw if the element has a data binding.
        for (var /** @type {?} */ i = 0; i < childCount; i++) {
            this._renderer.removeChild(layoutElement, layoutElement.childNodes[i]);
        }
    };
    /**
     * @return {?}
     */
    MdIcon.prototype._updateFontIconClasses = function () {
        if (!this._usingFontIcon()) {
            return;
        }
        var /** @type {?} */ elem = this._elementRef.nativeElement;
        var /** @type {?} */ fontSetClass = this.fontSet ?
            this._mdIconRegistry.classNameForFontAlias(this.fontSet) :
            this._mdIconRegistry.getDefaultFontSetClass();
        if (fontSetClass != this._previousFontSetClass) {
            if (this._previousFontSetClass) {
                this._renderer.removeClass(elem, this._previousFontSetClass);
            }
            if (fontSetClass) {
                this._renderer.addClass(elem, fontSetClass);
            }
            this._previousFontSetClass = fontSetClass;
        }
        if (this.fontIcon != this._previousFontIconClass) {
            if (this._previousFontIconClass) {
                this._renderer.removeClass(elem, this._previousFontIconClass);
            }
            if (this.fontIcon) {
                this._renderer.addClass(elem, this.fontIcon);
            }
            this._previousFontIconClass = this.fontIcon;
        }
    };
    return MdIcon;
}(_MdIconMixinBase));
MdIcon.decorators = [
    { type: Component, args: [{ template: '<ng-content></ng-content>',
                selector: 'md-icon, mat-icon',
                styles: [".mat-icon{background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px}"],
                inputs: ['color'],
                host: {
                    'role': 'img',
                    'class': 'mat-icon',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdIcon.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: MdIconRegistry, },
    { type: undefined, decorators: [{ type: Attribute, args: ['aria-hidden',] },] },
]; };
MdIcon.propDecorators = {
    'svgIcon': [{ type: Input },],
    'fontSet': [{ type: Input },],
    'fontIcon': [{ type: Input },],
};
var MdIconModule = (function () {
    function MdIconModule() {
    }
    return MdIconModule;
}());
MdIconModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule],
                exports: [MdIcon, MdCommonModule],
                declarations: [MdIcon],
                providers: [ICON_REGISTRY_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
MdIconModule.ctorParameters = function () { return []; };
/**
 * A single degree in radians.
 */
var DEGREE_IN_RADIANS = Math.PI / 180;
/**
 * Duration of the indeterminate animation.
 */
var DURATION_INDETERMINATE = 667;
/**
 * Duration of the indeterminate animation.
 */
var DURATION_DETERMINATE = 225;
/**
 * Start animation value of the indeterminate animation
 */
var startIndeterminate = 3;
/**
 * End animation value of the indeterminate animation
 */
var endIndeterminate = 80;
/**
 * Maximum angle for the arc. The angle can't be exactly 360, because the arc becomes hidden.
 */
var MAX_ANGLE = 359.99 / 100;
/**
 * Whether the user's browser supports requestAnimationFrame.
 */
var HAS_RAF = typeof requestAnimationFrame !== 'undefined';
/**
 * Default stroke width as a percentage of the viewBox.
 */
var PROGRESS_SPINNER_STROKE_WIDTH = 10;
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdProgressSpinnerCssMatStyler = (function () {
    function MdProgressSpinnerCssMatStyler() {
    }
    return MdProgressSpinnerCssMatStyler;
}());
MdProgressSpinnerCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-progress-spinner, mat-progress-spinner',
                host: { 'class': 'mat-progress-spinner' }
            },] },
];
/**
 * @nocollapse
 */
MdProgressSpinnerCssMatStyler.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var MdProgressSpinnerBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdProgressSpinnerBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdProgressSpinnerBase;
}());
var _MdProgressSpinnerMixinBase = mixinColor(MdProgressSpinnerBase, 'primary');
/**
 * <md-progress-spinner> component.
 */
var MdProgressSpinner = (function (_super) {
    tslib_1.__extends(MdProgressSpinner, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _ngZone
     */
    function MdProgressSpinner(renderer, elementRef, _ngZone) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._ngZone = _ngZone;
        /**
         * The id of the last requested animation.
         */
        _this._lastAnimationId = 0;
        _this._mode = 'determinate';
        /**
         * Stroke width of the progress spinner. By default uses 10px as stroke width.
         */
        _this.strokeWidth = PROGRESS_SPINNER_STROKE_WIDTH;
        return _this;
    }
    Object.defineProperty(MdProgressSpinner.prototype, "_ariaValueMin", {
        /**
         * Values for aria max and min are only defined as numbers when in a determinate mode.  We do this
         * because voiceover does not report the progress indicator as indeterminate if the aria min
         * and/or max value are number values.
         * @return {?}
         */
        get: function () {
            return this.mode == 'determinate' ? 0 : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressSpinner.prototype, "_ariaValueMax", {
        /**
         * @return {?}
         */
        get: function () {
            return this.mode == 'determinate' ? 100 : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressSpinner.prototype, "interdeterminateInterval", {
        /**
         * \@docs-private
         * @return {?}
         */
        get: function () {
            return this._interdeterminateInterval;
        },
        /**
         * \@docs-private
         * @param {?} interval
         * @return {?}
         */
        set: function (interval) {
            if (this._interdeterminateInterval) {
                clearInterval(this._interdeterminateInterval);
            }
            this._interdeterminateInterval = interval;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clean up any animations that were running.
     * @return {?}
     */
    MdProgressSpinner.prototype.ngOnDestroy = function () {
        this._cleanupIndeterminateAnimation();
    };
    Object.defineProperty(MdProgressSpinner.prototype, "value", {
        /**
         * Value of the progress circle. It is bound to the host as the attribute aria-valuenow.
         * @return {?}
         */
        get: function () {
            if (this.mode == 'determinate') {
                return this._value;
            }
            return 0;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            if (v != null && this.mode == 'determinate') {
                var /** @type {?} */ newValue = clamp(v);
                this._animateCircle(this.value || 0, newValue);
                this._value = newValue;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressSpinner.prototype, "mode", {
        /**
         * Mode of the progress circle
         *
         * Input must be one of the values from ProgressMode, defaults to 'determinate'.
         * mode is bound to the host as the attribute host.
         * @return {?}
         */
        get: function () { return this._mode; },
        /**
         * @param {?} mode
         * @return {?}
         */
        set: function (mode) {
            if (mode !== this._mode) {
                if (mode === 'indeterminate') {
                    this._startIndeterminateAnimation();
                }
                else {
                    this._cleanupIndeterminateAnimation();
                    this._animateCircle(0, this._value);
                }
                this._mode = mode;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Animates the circle from one percentage value to another.
     *
     * @param {?} animateFrom The percentage of the circle filled starting the animation.
     * @param {?} animateTo The percentage of the circle filled ending the animation.
     * @param {?=} ease The easing function to manage the pace of change in the animation.
     * @param {?=} duration The length of time to show the animation, in milliseconds.
     * @param {?=} rotation The starting angle of the circle fill, with 0° represented at the top center
     *    of the circle.
     * @return {?}
     */
    MdProgressSpinner.prototype._animateCircle = function (animateFrom, animateTo, ease, duration, rotation) {
        var _this = this;
        if (ease === void 0) { ease = linearEase; }
        if (duration === void 0) { duration = DURATION_DETERMINATE; }
        if (rotation === void 0) { rotation = 0; }
        var /** @type {?} */ id = ++this._lastAnimationId;
        var /** @type {?} */ startTime = Date.now();
        var /** @type {?} */ changeInValue = animateTo - animateFrom;
        // No need to animate it if the values are the same
        if (animateTo === animateFrom) {
            this._renderArc(animateTo, rotation);
        }
        else {
            var /** @type {?} */ animation_1 = function () {
                // If there is no requestAnimationFrame, skip ahead to the end of the animation.
                var /** @type {?} */ elapsedTime = HAS_RAF ?
                    Math.max(0, Math.min(Date.now() - startTime, duration)) :
                    duration;
                _this._renderArc(ease(elapsedTime, animateFrom, changeInValue, duration), rotation);
                // Prevent overlapping animations by checking if a new animation has been called for and
                // if the animation has lasted longer than the animation duration.
                if (id === _this._lastAnimationId && elapsedTime < duration) {
                    requestAnimationFrame(animation_1);
                }
            };
            // Run the animation outside of Angular's zone, in order to avoid
            // hitting ZoneJS and change detection on each frame.
            this._ngZone.runOutsideAngular(animation_1);
        }
    };
    /**
     * Starts the indeterminate animation interval, if it is not already running.
     * @return {?}
     */
    MdProgressSpinner.prototype._startIndeterminateAnimation = function () {
        var _this = this;
        var /** @type {?} */ rotationStartPoint = 0;
        var /** @type {?} */ start = startIndeterminate;
        var /** @type {?} */ end = endIndeterminate;
        var /** @type {?} */ duration = DURATION_INDETERMINATE;
        var /** @type {?} */ animate$$1 = function () {
            _this._animateCircle(start, end, materialEase, duration, rotationStartPoint);
            // Prevent rotation from reaching Number.MAX_SAFE_INTEGER.
            rotationStartPoint = (rotationStartPoint + end) % 100;
            var /** @type {?} */ temp = start;
            start = -end;
            end = -temp;
        };
        if (!this.interdeterminateInterval) {
            this._ngZone.runOutsideAngular(function () {
                _this.interdeterminateInterval = setInterval(animate$$1, duration + 50, 0, false);
                animate$$1();
            });
        }
    };
    /**
     * Removes interval, ending the animation.
     * @return {?}
     */
    MdProgressSpinner.prototype._cleanupIndeterminateAnimation = function () {
        this.interdeterminateInterval = null;
    };
    /**
     * Renders the arc onto the SVG element. Proxies `getArc` while setting the proper
     * DOM attribute on the `<path>`.
     * @param {?} currentValue
     * @param {?=} rotation
     * @return {?}
     */
    MdProgressSpinner.prototype._renderArc = function (currentValue, rotation) {
        if (rotation === void 0) { rotation = 0; }
        if (this._path) {
            var /** @type {?} */ svgArc = getSvgArc(currentValue, rotation, this.strokeWidth);
            this._renderer.setAttribute(this._path.nativeElement, 'd', svgArc);
        }
    };
    return MdProgressSpinner;
}(_MdProgressSpinnerMixinBase));
MdProgressSpinner.decorators = [
    { type: Component, args: [{ selector: 'md-progress-spinner, mat-progress-spinner',
                host: {
                    'role': 'progressbar',
                    'class': 'mat-progress-spinner',
                    '[attr.aria-valuemin]': '_ariaValueMin',
                    '[attr.aria-valuemax]': '_ariaValueMax',
                    '[attr.aria-valuenow]': 'value',
                    '[attr.mode]': 'mode',
                },
                inputs: ['color'],
                template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\" focusable=\"false\"><path #path [style.strokeWidth]=\"strokeWidth\"></path></svg>",
                styles: [".mat-progress-spinner{display:block;height:100px;width:100px;overflow:hidden}.mat-progress-spinner svg{height:100%;width:100%;transform-origin:center}.mat-progress-spinner path{fill:transparent;transition:stroke .3s cubic-bezier(.35,0,.25,1)}.mat-progress-spinner[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:mat-progress-spinner-sporadic-rotate,mat-progress-spinner-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdProgressSpinner.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: NgZone, },
]; };
MdProgressSpinner.propDecorators = {
    '_path': [{ type: ViewChild, args: ['path',] },],
    'strokeWidth': [{ type: Input },],
    'value': [{ type: Input },],
    'mode': [{ type: Input },],
};
/**
 * <md-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <md-progress-spinner> instance.
 */
var MdSpinner = (function (_super) {
    tslib_1.__extends(MdSpinner, _super);
    /**
     * @param {?} elementRef
     * @param {?} ngZone
     * @param {?} renderer
     */
    function MdSpinner(elementRef, ngZone, renderer) {
        var _this = _super.call(this, renderer, elementRef, ngZone) || this;
        _this.mode = 'indeterminate';
        return _this;
    }
    return MdSpinner;
}(MdProgressSpinner));
MdSpinner.decorators = [
    { type: Component, args: [{ selector: 'md-spinner, mat-spinner',
                host: {
                    'role': 'progressbar',
                    'mode': 'indeterminate',
                    'class': 'mat-spinner mat-progress-spinner',
                },
                inputs: ['color'],
                template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\" focusable=\"false\"><path #path [style.strokeWidth]=\"strokeWidth\"></path></svg>",
                styles: [".mat-progress-spinner{display:block;height:100px;width:100px;overflow:hidden}.mat-progress-spinner svg{height:100%;width:100%;transform-origin:center}.mat-progress-spinner path{fill:transparent;transition:stroke .3s cubic-bezier(.35,0,.25,1)}.mat-progress-spinner[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:mat-progress-spinner-sporadic-rotate,mat-progress-spinner-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdSpinner.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: NgZone, },
    { type: Renderer2, },
]; };
/**
 * Clamps a value to be between 0 and 100.
 * @param {?} v
 * @return {?}
 */
function clamp(v) {
    return Math.max(0, Math.min(100, v));
}
/**
 * Converts Polar coordinates to Cartesian.
 * @param {?} radius
 * @param {?} pathRadius
 * @param {?} angleInDegrees
 * @return {?}
 */
function polarToCartesian(radius, pathRadius, angleInDegrees) {
    var /** @type {?} */ angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;
    return (radius + (pathRadius * Math.cos(angleInRadians))) +
        ',' + (radius + (pathRadius * Math.sin(angleInRadians)));
}
/**
 * Easing function for linear animation.
 * @param {?} currentTime
 * @param {?} startValue
 * @param {?} changeInValue
 * @param {?} duration
 * @return {?}
 */
function linearEase(currentTime, startValue, changeInValue, duration) {
    return changeInValue * currentTime / duration + startValue;
}
/**
 * Easing function to match material design indeterminate animation.
 * @param {?} currentTime
 * @param {?} startValue
 * @param {?} changeInValue
 * @param {?} duration
 * @return {?}
 */
function materialEase(currentTime, startValue, changeInValue, duration) {
    var /** @type {?} */ time = currentTime / duration;
    var /** @type {?} */ timeCubed = Math.pow(time, 3);
    var /** @type {?} */ timeQuad = Math.pow(time, 4);
    var /** @type {?} */ timeQuint = Math.pow(time, 5);
    return startValue + changeInValue * ((6 * timeQuint) + (-15 * timeQuad) + (10 * timeCubed));
}
/**
 * Determines the path value to define the arc.  Converting percentage values to to polar
 * coordinates on the circle, and then to cartesian coordinates in the viewport.
 *
 * @param {?} currentValue The current percentage value of the progress circle, the percentage of the
 *    circle to fill.
 * @param {?} rotation The starting point of the circle with 0 being the 0 degree point.
 * @param {?} strokeWidth Stroke width of the progress spinner arc.
 * @return {?} A string for an SVG path representing a circle filled from the starting point to the
 *    percentage value provided.
 */
function getSvgArc(currentValue, rotation, strokeWidth) {
    var /** @type {?} */ startPoint = rotation || 0;
    var /** @type {?} */ radius = 50;
    var /** @type {?} */ pathRadius = radius - strokeWidth;
    var /** @type {?} */ startAngle = startPoint * MAX_ANGLE;
    var /** @type {?} */ endAngle = currentValue * MAX_ANGLE;
    var /** @type {?} */ start = polarToCartesian(radius, pathRadius, startAngle);
    var /** @type {?} */ end = polarToCartesian(radius, pathRadius, endAngle + startAngle);
    var /** @type {?} */ arcSweep = endAngle < 0 ? 0 : 1;
    var /** @type {?} */ largeArcFlag;
    if (endAngle < 0) {
        largeArcFlag = endAngle >= -180 ? 0 : 1;
    }
    else {
        largeArcFlag = endAngle <= 180 ? 0 : 1;
    }
    return "M" + start + "A" + pathRadius + "," + pathRadius + " 0 " + largeArcFlag + "," + arcSweep + " " + end;
}
var MdProgressSpinnerModule = (function () {
    function MdProgressSpinnerModule() {
    }
    return MdProgressSpinnerModule;
}());
MdProgressSpinnerModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule],
                exports: [
                    MdProgressSpinner,
                    MdSpinner,
                    MdCommonModule,
                    MdProgressSpinnerCssMatStyler
                ],
                declarations: [
                    MdProgressSpinner,
                    MdSpinner,
                    MdProgressSpinnerCssMatStyler
                ],
            },] },
];
/**
 * @nocollapse
 */
MdProgressSpinnerModule.ctorParameters = function () { return []; };
/**
 * <md-progress-bar> component.
 */
var MdProgressBar = (function () {
    function MdProgressBar() {
        /**
         * Color of the progress bar.
         */
        this.color = 'primary';
        this._value = 0;
        this._bufferValue = 0;
        /**
         * Mode of the progress bar.
         *
         * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
         * 'determinate'.
         * Mirrored to mode attribute.
         */
        this.mode = 'determinate';
    }
    Object.defineProperty(MdProgressBar.prototype, "value", {
        /**
         * Value of the progressbar. Defaults to zero. Mirrored to aria-valuenow.
         * @return {?}
         */
        get: function () { return this._value; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._value = clamp$1(v || 0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressBar.prototype, "bufferValue", {
        /**
         * Buffer value of the progress bar. Defaults to zero.
         * @return {?}
         */
        get: function () { return this._bufferValue; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._bufferValue = clamp$1(v || 0); },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the current transform value for the progress bar's primary indicator.
     * @return {?}
     */
    MdProgressBar.prototype._primaryTransform = function () {
        var /** @type {?} */ scale = this.value / 100;
        return { transform: "scaleX(" + scale + ")" };
    };
    /**
     * Gets the current transform value for the progress bar's buffer indicator.  Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     * @return {?}
     */
    MdProgressBar.prototype._bufferTransform = function () {
        if (this.mode == 'buffer') {
            var /** @type {?} */ scale = this.bufferValue / 100;
            return { transform: "scaleX(" + scale + ")" };
        }
    };
    return MdProgressBar;
}());
MdProgressBar.decorators = [
    { type: Component, args: [{ selector: 'md-progress-bar, mat-progress-bar',
                host: {
                    'role': 'progressbar',
                    'aria-valuemin': '0',
                    'aria-valuemax': '100',
                    '[attr.aria-valuenow]': 'value',
                    '[attr.mode]': 'mode',
                    '[class.mat-primary]': 'color == "primary"',
                    '[class.mat-accent]': 'color == "accent"',
                    '[class.mat-warn]': 'color == "warn"',
                    'class': 'mat-progress-bar',
                },
                template: "<div class=\"mat-progress-bar-background mat-progress-bar-element\"></div><div class=\"mat-progress-bar-buffer mat-progress-bar-element\" [ngStyle]=\"_bufferTransform()\"></div><div class=\"mat-progress-bar-primary mat-progress-bar-fill mat-progress-bar-element\" [ngStyle]=\"_primaryTransform()\"></div><div class=\"mat-progress-bar-secondary mat-progress-bar-fill mat-progress-bar-element\"></div>",
                styles: [".mat-progress-bar{display:block;height:5px;overflow:hidden;position:relative;transform:translateZ(0);transition:opacity 250ms linear;width:100%}.mat-progress-bar .mat-progress-bar-element,.mat-progress-bar .mat-progress-bar-fill::after{height:100%;position:absolute;width:100%}.mat-progress-bar .mat-progress-bar-background{background-repeat:repeat-x;background-size:10px 4px;display:none}.mat-progress-bar .mat-progress-bar-buffer{transform-origin:top left;transition:transform 250ms ease}.mat-progress-bar .mat-progress-bar-secondary{display:none}.mat-progress-bar .mat-progress-bar-fill{animation:none;transform-origin:top left;transition:transform 250ms ease}.mat-progress-bar .mat-progress-bar-fill::after{animation:none;content:'';display:inline-block;left:0}.mat-progress-bar[dir=rtl],[dir=rtl] .mat-progress-bar{transform:rotateY(180deg)}.mat-progress-bar[mode=query]{transform:rotateZ(180deg)}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-fill,.mat-progress-bar[mode=query] .mat-progress-bar-fill{transition:none}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary,.mat-progress-bar[mode=query] .mat-progress-bar-primary{animation:mat-progress-bar-primary-indeterminate-translate 2s infinite linear;left:-145.166611%}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-primary.mat-progress-bar-fill::after{animation:mat-progress-bar-primary-indeterminate-scale 2s infinite linear}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary,.mat-progress-bar[mode=query] .mat-progress-bar-secondary{animation:mat-progress-bar-secondary-indeterminate-translate 2s infinite linear;left:-54.888891%;display:block}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-secondary.mat-progress-bar-fill::after{animation:mat-progress-bar-secondary-indeterminate-scale 2s infinite linear}.mat-progress-bar[mode=buffer] .mat-progress-bar-background{animation:mat-progress-bar-background-scroll 250ms infinite linear;display:block}@keyframes mat-progress-bar-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(.5,0,.70173,.49582);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);transform:translateX(83.67142%)}100%{transform:translateX(200.61106%)}}@keyframes mat-progress-bar-primary-indeterminate-scale{0%{transform:scaleX(.08)}36.65%{animation-timing-function:cubic-bezier(.33473,.12482,.78584,1);transform:scaleX(.08)}69.15%{animation-timing-function:cubic-bezier(.06,.11,.6,1);transform:scaleX(.66148)}100%{transform:scaleX(.08)}}@keyframes mat-progress-bar-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:translateX(37.65191%)}48.35%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:translateX(84.38617%)}100%{transform:translateX(160.27778%)}}@keyframes mat-progress-bar-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:scaleX(.08)}19.15%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:scaleX(.4571)}44.15%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:scaleX(.72796)}100%{transform:scaleX(.08)}}@keyframes mat-progress-bar-background-scroll{to{transform:translateX(-10px)}}"],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdProgressBar.ctorParameters = function () { return []; };
MdProgressBar.propDecorators = {
    'color': [{ type: Input },],
    'value': [{ type: Input },],
    'bufferValue': [{ type: Input },],
    'mode': [{ type: Input },],
};
/**
 * Clamps a value to be between two numbers, by default 0 and 100.
 * @param {?} v
 * @param {?=} min
 * @param {?=} max
 * @return {?}
 */
function clamp$1(v, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100; }
    return Math.max(min, Math.min(max, v));
}
var MdProgressBarModule = (function () {
    function MdProgressBarModule() {
    }
    return MdProgressBarModule;
}());
MdProgressBarModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, MdCommonModule],
                exports: [MdProgressBar, MdCommonModule],
                declarations: [MdProgressBar],
            },] },
];
/**
 * @nocollapse
 */
MdProgressBarModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 * @param {?} type
 * @return {?}
 */
function getMdInputUnsupportedTypeError(type) {
    return Error("Input type \"" + type + "\" isn't supported by mdInput.");
}
var nextUniqueId$4 = 0;
/**
 * Single error message to be shown underneath the form field.
 */
var MdError = (function () {
    function MdError() {
        this.id = "mat-error-" + nextUniqueId$4++;
    }
    return MdError;
}());
MdError.decorators = [
    { type: Directive, args: [{
                selector: 'md-error, mat-error',
                host: {
                    'class': 'mat-error',
                    'role': 'alert',
                    '[attr.id]': 'id',
                }
            },] },
];
/**
 * @nocollapse
 */
MdError.ctorParameters = function () { return []; };
MdError.propDecorators = {
    'id': [{ type: Input },],
};
/**
 * \@docs-private
 * @return {?}
 */
function getMdFormFieldPlaceholderConflictError() {
    return Error('Placeholder attribute and child element were both specified.');
}
/**
 * \@docs-private
 * @param {?} align
 * @return {?}
 */
function getMdFormFieldDuplicatedHintError(align) {
    return Error("A hint was already declared for 'align=\"" + align + "\"'.");
}
/**
 * \@docs-private
 * @return {?}
 */
function getMdFormFieldMissingControlError() {
    return Error('md-form-field must contain a MdFormFieldControl. ' +
        'Did you forget to add mdInput to the native input or textarea element?');
}
/**
 * An interface which allows a control to work inside of a `MdFormField`.
 * @abstract
 */
var MdFormFieldControl = (function () {
    function MdFormFieldControl() {
    }
    /**
     * Sets the list of element IDs that currently describe this control.
     * @abstract
     * @param {?} ids
     * @return {?}
     */
    MdFormFieldControl.prototype.setDescribedByIds = function (ids) { };
    /**
     * Focuses this control.
     * @abstract
     * @return {?}
     */
    MdFormFieldControl.prototype.focus = function () { };
    return MdFormFieldControl;
}());
var nextUniqueId$6 = 0;
/**
 * Hint text to be shown underneath the form field control.
 */
var MdHint = (function () {
    function MdHint() {
        /**
         * Whether to align the hint label at the start or end of the line.
         */
        this.align = 'start';
        /**
         * Unique ID for the hint. Used for the aria-describedby on the form field control.
         */
        this.id = "mat-hint-" + nextUniqueId$6++;
    }
    return MdHint;
}());
MdHint.decorators = [
    { type: Directive, args: [{
                selector: 'md-hint, mat-hint',
                host: {
                    'class': 'mat-hint',
                    '[class.mat-right]': 'align == "end"',
                    '[attr.id]': 'id',
                    // Remove align attribute to prevent it from interfering with layout.
                    '[attr.align]': 'null',
                }
            },] },
];
/**
 * @nocollapse
 */
MdHint.ctorParameters = function () { return []; };
MdHint.propDecorators = {
    'align': [{ type: Input },],
    'id': [{ type: Input },],
};
/**
 * The floating placeholder for an `MdFormField`.
 */
var MdPlaceholder = (function () {
    function MdPlaceholder() {
    }
    return MdPlaceholder;
}());
MdPlaceholder.decorators = [
    { type: Directive, args: [{
                selector: 'md-placeholder, mat-placeholder'
            },] },
];
/**
 * @nocollapse
 */
MdPlaceholder.ctorParameters = function () { return []; };
/**
 * Prefix to be placed the the front of the form field.
 */
var MdPrefix = (function () {
    function MdPrefix() {
    }
    return MdPrefix;
}());
MdPrefix.decorators = [
    { type: Directive, args: [{
                selector: '[mdPrefix], [matPrefix]',
            },] },
];
/**
 * @nocollapse
 */
MdPrefix.ctorParameters = function () { return []; };
/**
 * Suffix to be placed at the end of the form field.
 */
var MdSuffix = (function () {
    function MdSuffix() {
    }
    return MdSuffix;
}());
MdSuffix.decorators = [
    { type: Directive, args: [{
                selector: '[mdSuffix], [matSuffix]',
            },] },
];
/**
 * @nocollapse
 */
MdSuffix.ctorParameters = function () { return []; };
var nextUniqueId$5 = 0;
/**
 * Container for form controls that applies Material Design styling and behavior.
 */
var MdFormField = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _changeDetectorRef
     * @param {?} placeholderOptions
     */
    function MdFormField(_elementRef, _changeDetectorRef, placeholderOptions) {
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Color of the form field underline, based on the theme.
         */
        this.color = 'primary';
        /**
         * Override for the logic that disables the placeholder animation in certain cases.
         */
        this._showAlwaysAnimate = false;
        /**
         * State of the md-hint and md-error animations.
         */
        this._subscriptAnimationState = '';
        this._hintLabel = '';
        // Unique id for the hint label.
        this._hintLabelId = "md-hint-" + nextUniqueId$5++;
        this._placeholderOptions = placeholderOptions ? placeholderOptions : {};
        this.floatPlaceholder = this._placeholderOptions.float || 'auto';
    }
    Object.defineProperty(MdFormField.prototype, "dividerColor", {
        /**
         * @deprecated Use `color` instead.
         * @return {?}
         */
        get: function () { return this.color; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.color = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdFormField.prototype, "hideRequiredMarker", {
        /**
         * Whether the required marker should be hidden.
         * @return {?}
         */
        get: function () { return this._hideRequiredMarker; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._hideRequiredMarker = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdFormField.prototype, "_shouldAlwaysFloat", {
        /**
         * Whether the floating label should always float or not.
         * @return {?}
         */
        get: function () {
            return this._floatPlaceholder === 'always' && !this._showAlwaysAnimate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdFormField.prototype, "_canPlaceholderFloat", {
        /**
         * Whether the placeholder can float or not.
         * @return {?}
         */
        get: function () { return this._floatPlaceholder !== 'never'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdFormField.prototype, "hintLabel", {
        /**
         * Text for the form field hint.
         * @return {?}
         */
        get: function () { return this._hintLabel; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._hintLabel = value;
            this._processHints();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdFormField.prototype, "floatPlaceholder", {
        /**
         * Whether the placeholder should always float, never float or float as the user types.
         * @return {?}
         */
        get: function () { return this._floatPlaceholder; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== this._floatPlaceholder) {
                this._floatPlaceholder = value || this._placeholderOptions.float || 'auto';
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdFormField.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._validateControlChild();
        // Subscribe to changes in the child control state in order to update the form field UI.
        startWith.call(this._control.stateChanges, null).subscribe(function () {
            _this._validatePlaceholders();
            _this._syncDescribedByIds();
            _this._changeDetectorRef.markForCheck();
        });
        var /** @type {?} */ ngControl = this._control.ngControl;
        if (ngControl && ngControl.valueChanges) {
            ngControl.valueChanges.subscribe(function () {
                _this._changeDetectorRef.markForCheck();
            });
        }
        // Re-validate when the number of hints changes.
        startWith.call(this._hintChildren.changes, null).subscribe(function () {
            _this._processHints();
            _this._changeDetectorRef.markForCheck();
        });
        // Update the aria-described by when the number of errors changes.
        startWith.call(this._errorChildren.changes, null).subscribe(function () {
            _this._syncDescribedByIds();
            _this._changeDetectorRef.markForCheck();
        });
    };
    /**
     * @return {?}
     */
    MdFormField.prototype.ngAfterContentChecked = function () {
        this._validateControlChild();
    };
    /**
     * @return {?}
     */
    MdFormField.prototype.ngAfterViewInit = function () {
        // Avoid animations on load.
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    };
    /**
     * Determines whether a class from the NgControl should be forwarded to the host element.
     * @param {?} prop
     * @return {?}
     */
    MdFormField.prototype._shouldForward = function (prop) {
        var /** @type {?} */ ngControl = this._control ? this._control.ngControl : null;
        return ngControl && ((ngControl))[prop];
    };
    /**
     * Whether the form field has a placeholder.
     * @return {?}
     */
    MdFormField.prototype._hasPlaceholder = function () {
        return !!(this._control.placeholder || this._placeholderChild);
    };
    /**
     * Determines whether to display hints or errors.
     * @return {?}
     */
    MdFormField.prototype._getDisplayedMessages = function () {
        return (this._errorChildren && this._errorChildren.length > 0 &&
            this._control.errorState) ? 'error' : 'hint';
    };
    /**
     * Animates the placeholder up and locks it in position.
     * @return {?}
     */
    MdFormField.prototype._animateAndLockPlaceholder = function () {
        var _this = this;
        if (this._placeholder && this._canPlaceholderFloat) {
            this._showAlwaysAnimate = true;
            this._floatPlaceholder = 'always';
            first.call(fromEvent(this._placeholder.nativeElement, 'transitionend')).subscribe(function () {
                _this._showAlwaysAnimate = false;
            });
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `md-placeholder` directive).
     * @return {?}
     */
    MdFormField.prototype._validatePlaceholders = function () {
        if (this._control.placeholder && this._placeholderChild) {
            throw getMdFormFieldPlaceholderConflictError();
        }
    };
    /**
     * Does any extra processing that is required when handling the hints.
     * @return {?}
     */
    MdFormField.prototype._processHints = function () {
        this._validateHints();
        this._syncDescribedByIds();
    };
    /**
     * Ensure that there is a maximum of one of each `<md-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     * @return {?}
     */
    MdFormField.prototype._validateHints = function () {
        var _this = this;
        if (this._hintChildren) {
            var /** @type {?} */ startHint_1;
            var /** @type {?} */ endHint_1;
            this._hintChildren.forEach(function (hint) {
                if (hint.align == 'start') {
                    if (startHint_1 || _this.hintLabel) {
                        throw getMdFormFieldDuplicatedHintError('start');
                    }
                    startHint_1 = hint;
                }
                else if (hint.align == 'end') {
                    if (endHint_1) {
                        throw getMdFormFieldDuplicatedHintError('end');
                    }
                    endHint_1 = hint;
                }
            });
        }
    };
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     * @return {?}
     */
    MdFormField.prototype._syncDescribedByIds = function () {
        if (this._control) {
            var /** @type {?} */ ids = [];
            if (this._getDisplayedMessages() === 'hint') {
                var /** @type {?} */ startHint = this._hintChildren ?
                    this._hintChildren.find(function (hint) { return hint.align === 'start'; }) : null;
                var /** @type {?} */ endHint = this._hintChildren ?
                    this._hintChildren.find(function (hint) { return hint.align === 'end'; }) : null;
                if (startHint) {
                    ids.push(startHint.id);
                }
                else if (this._hintLabel) {
                    ids.push(this._hintLabelId);
                }
                if (endHint) {
                    ids.push(endHint.id);
                }
            }
            else if (this._errorChildren) {
                ids = this._errorChildren.map(function (mdError) { return mdError.id; });
            }
            this._control.setDescribedByIds(ids);
        }
    };
    /**
     * Throws an error if the form field's control is missing.
     * @return {?}
     */
    MdFormField.prototype._validateControlChild = function () {
        if (!this._control) {
            throw getMdFormFieldMissingControlError();
        }
    };
    return MdFormField;
}());
MdFormField.decorators = [
    { type: Component, args: [{
                selector: 'md-input-container, mat-input-container, md-form-field, mat-form-field',
                template: "<div class=\"mat-input-wrapper mat-form-field-wrapper\"><div class=\"mat-input-flex mat-form-field-flex\" #connectionContainer><div class=\"mat-input-prefix mat-form-field-prefix\" *ngIf=\"_prefixChildren.length\"><ng-content select=\"[mdPrefix], [matPrefix]\"></ng-content></div><div class=\"mat-input-infix mat-form-field-infix\"><ng-content></ng-content><span class=\"mat-input-placeholder-wrapper mat-form-field-placeholder-wrapper\"><label class=\"mat-input-placeholder mat-form-field-placeholder\" [attr.for]=\"_control.id\" [class.mat-empty]=\"_control.empty && !_shouldAlwaysFloat\" [class.mat-form-field-empty]=\"_control.empty && !_shouldAlwaysFloat\" [class.mat-float]=\"_canPlaceholderFloat\" [class.mat-form-field-float]=\"_canPlaceholderFloat\" [class.mat-accent]=\"color == 'accent'\" [class.mat-warn]=\"color == 'warn'\" #placeholder *ngIf=\"_hasPlaceholder()\"><ng-content select=\"md-placeholder, mat-placeholder\"></ng-content>{{_control.placeholder}} <span class=\"mat-placeholder-required mat-form-field-required-marker\" aria-hidden=\"true\" *ngIf=\"!hideRequiredMarker && _control.required\">*</span></label></span></div><div class=\"mat-input-suffix mat-form-field-suffix\" *ngIf=\"_suffixChildren.length\"><ng-content select=\"[mdSuffix], [matSuffix]\"></ng-content></div></div><div class=\"mat-input-underline mat-form-field-underline\" #underline [class.mat-disabled]=\"_control.disabled\"><span class=\"mat-input-ripple mat-form-field-ripple\" [class.mat-accent]=\"color == 'accent'\" [class.mat-warn]=\"color == 'warn'\"></span></div><div class=\"mat-input-subscript-wrapper mat-form-field-subscript-wrapper\" [ngSwitch]=\"_getDisplayedMessages()\"><div *ngSwitchCase=\"'error'\" [@transitionMessages]=\"_subscriptAnimationState\"><ng-content select=\"md-error, mat-error\"></ng-content></div><div class=\"mat-input-hint-wrapper mat-form-field-hint-wrapper\" *ngSwitchCase=\"'hint'\" [@transitionMessages]=\"_subscriptAnimationState\"><div *ngIf=\"hintLabel\" [id]=\"_hintLabelId\" class=\"mat-hint\">{{hintLabel}}</div><ng-content select=\"md-hint:not([align='end']), mat-hint:not([align='end'])\"></ng-content><div class=\"mat-input-hint-spacer mat-form-field-hint-spacer\"></div><ng-content select=\"md-hint[align='end'], mat-hint[align='end']\"></ng-content></div></div></div>",
                // MdInput is a directive and can't have styles, so we need to include its styles here.
                // The MdInput styles are fairly minimal so it shouldn't be a big deal for people who aren't using
                // MdInput.
                styles: [".mat-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-form-field{text-align:right}.mat-form-field-wrapper{position:relative}.mat-form-field-flex{display:inline-flex;align-items:baseline;width:100%}.mat-form-field-prefix,.mat-form-field-suffix{white-space:nowrap;flex:none}.mat-form-field-prefix .mat-icon,.mat-form-field-suffix .mat-icon{width:1em}.mat-form-field-prefix .mat-icon-button,.mat-form-field-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field-suffix .mat-icon-button .mat-icon{font-size:inherit}.mat-form-field-infix{display:block;position:relative;flex:auto}.mat-form-field-autofill-float:-webkit-autofill+.mat-form-field-placeholder-wrapper .mat-form-field-placeholder{display:none}.mat-form-field-autofill-float:-webkit-autofill+.mat-form-field-placeholder-wrapper .mat-form-field-float{display:block;transition:none}.mat-form-field-placeholder-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}.mat-form-field-placeholder{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform:perspective(100px);-ms-transform:none;transform-origin:0 0;transition:transform .4s cubic-bezier(.25,.8,.25,1),color .4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1);display:none}.mat-focused .mat-form-field-placeholder.mat-form-field-float,.mat-form-field-placeholder.mat-form-field-empty,.mat-form-field-placeholder.mat-form-field-float:not(.mat-form-field-empty){display:block}[dir=rtl] .mat-form-field-placeholder{transform-origin:100% 0;left:auto;right:0}.mat-form-field-placeholder:not(.mat-form-field-empty){transition:none}.mat-form-field-underline{position:absolute;height:1px;width:100%}.mat-form-field-underline.mat-disabled{background-position:0;background-color:transparent}.mat-form-field-underline .mat-form-field-ripple{position:absolute;height:1px;top:0;left:0;width:100%;transform-origin:50%;transform:scaleX(.5);visibility:hidden;transition:background-color .3s cubic-bezier(.55,0,.55,.2)}.mat-focused .mat-form-field-underline .mat-form-field-ripple{height:2px}.mat-focused .mat-form-field-underline .mat-form-field-ripple,.mat-form-field-invalid .mat-form-field-underline .mat-form-field-ripple{visibility:visible;transform:scaleX(1);transition:transform 150ms linear,background-color .3s cubic-bezier(.55,0,.55,.2)}.mat-form-field-subscript-wrapper{position:absolute;width:100%;overflow:hidden}.mat-form-field-placeholder-wrapper .mat-icon,.mat-form-field-subscript-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-form-field-hint-wrapper{display:flex}.mat-form-field-hint-spacer{flex:1 0 1em}.mat-error{display:block} .mat-input-element{font:inherit;background:0 0;color:currentColor;border:none;outline:0;padding:0;margin:0;width:100%;max-width:100%;resize:vertical;vertical-align:bottom}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element::placeholder{color:transparent!important}.mat-input-element::-moz-placeholder{color:transparent!important}.mat-input-element::-webkit-input-placeholder{color:transparent!important}.mat-input-element:-ms-input-placeholder{color:transparent!important}textarea.mat-input-element{overflow:auto}"],
                animations: [
                    // TODO(mmalerba): Use angular animations for placeholder animation as well.
                    trigger('transitionMessages', [
                        state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
                        transition('void => enter', [
                            style({ opacity: 0, transform: 'translateY(-100%)' }),
                            animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
                        ]),
                    ]),
                ],
                host: {
                    'class': 'mat-input-container mat-form-field',
                    '[class.mat-input-invalid]': '_control.errorState',
                    '[class.mat-form-field-invalid]': '_control.errorState',
                    '[class.mat-focused]': '_control.focused',
                    '[class.ng-untouched]': '_shouldForward("untouched")',
                    '[class.ng-touched]': '_shouldForward("touched")',
                    '[class.ng-pristine]': '_shouldForward("pristine")',
                    '[class.ng-dirty]': '_shouldForward("dirty")',
                    '[class.ng-valid]': '_shouldForward("valid")',
                    '[class.ng-invalid]': '_shouldForward("invalid")',
                    '[class.ng-pending]': '_shouldForward("pending")',
                    '(click)': '_control.focus()',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdFormField.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_PLACEHOLDER_GLOBAL_OPTIONS,] },] },
]; };
MdFormField.propDecorators = {
    'color': [{ type: Input },],
    'dividerColor': [{ type: Input },],
    'hideRequiredMarker': [{ type: Input },],
    'hintLabel': [{ type: Input },],
    'floatPlaceholder': [{ type: Input },],
    'underlineRef': [{ type: ViewChild, args: ['underline',] },],
    '_connectionContainerRef': [{ type: ViewChild, args: ['connectionContainer',] },],
    '_placeholder': [{ type: ViewChild, args: ['placeholder',] },],
    '_control': [{ type: ContentChild, args: [MdFormFieldControl,] },],
    '_placeholderChild': [{ type: ContentChild, args: [MdPlaceholder,] },],
    '_errorChildren': [{ type: ContentChildren, args: [MdError,] },],
    '_hintChildren': [{ type: ContentChildren, args: [MdHint,] },],
    '_prefixChildren': [{ type: ContentChildren, args: [MdPrefix,] },],
    '_suffixChildren': [{ type: ContentChildren, args: [MdSuffix,] },],
};
var MdFormFieldModule = (function () {
    function MdFormFieldModule() {
    }
    return MdFormFieldModule;
}());
MdFormFieldModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    MdError,
                    MdHint,
                    MdFormField,
                    MdPlaceholder,
                    MdPrefix,
                    MdSuffix,
                ],
                imports: [
                    CommonModule,
                    PlatformModule,
                ],
                exports: [
                    MdError,
                    MdHint,
                    MdFormField,
                    MdPlaceholder,
                    MdPrefix,
                    MdSuffix,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdFormFieldModule.ctorParameters = function () { return []; };
// Invalid input type. Using one of these will throw an MdInputUnsupportedTypeError.
var MD_INPUT_INVALID_TYPES = [
    'button',
    'checkbox',
    'color',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit'
];
var nextUniqueId$3 = 0;
/**
 * Directive that allows a native input to work inside a `MdFormField`.
 */
var MdInput = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _platform
     * @param {?} ngControl
     * @param {?} _parentForm
     * @param {?} _parentFormGroup
     * @param {?} errorOptions
     */
    function MdInput(_elementRef, _renderer, _platform, ngControl, _parentForm, _parentFormGroup, errorOptions) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._platform = _platform;
        this.ngControl = ngControl;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        /**
         * Variables used as cache for getters and setters.
         */
        this._type = 'text';
        this._disabled = false;
        this._required = false;
        this._uid = "md-input-" + nextUniqueId$3++;
        this._previousNativeValue = this.value;
        /**
         * Whether the input is focused.
         */
        this.focused = false;
        /**
         * Whether the input is in an error state.
         */
        this.errorState = false;
        /**
         * Stream that emits whenever the state of the input changes such that the wrapping `MdFormField`
         * needs to run change detection.
         */
        this.stateChanges = new Subject();
        /**
         * Placeholder attribute of the element.
         */
        this.placeholder = '';
        this._neverEmptyInputTypes = [
            'date',
            'datetime',
            'datetime-local',
            'month',
            'time',
            'week'
        ].filter(function (t) { return getSupportedInputTypes().has(t); });
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        this._errorOptions = errorOptions ? errorOptions : {};
        this.errorStateMatcher = this._errorOptions.errorStateMatcher || defaultErrorStateMatcher;
        // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
        // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
        // exists on iOS, we only bother to install the listener on iOS.
        if (_platform.IOS) {
            _renderer.listen(_elementRef.nativeElement, 'keyup', function (event) {
                var el = event.target;
                if (!el.value && !el.selectionStart && !el.selectionEnd) {
                    // Note: Just setting `0, 0` doesn't fix the issue. Setting `1, 1` fixes it for the first
                    // time that you type text and then hold delete. Toggling to `1, 1` and then back to
                    // `0, 0` seems to completely fix it.
                    el.setSelectionRange(1, 1);
                    el.setSelectionRange(0, 0);
                }
            });
        }
    }
    Object.defineProperty(MdInput.prototype, "disabled", {
        /**
         * Whether the element is disabled.
         * @return {?}
         */
        get: function () { return this.ngControl ? this.ngControl.disabled : this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "id", {
        /**
         * Unique id of the element.
         * @return {?}
         */
        get: function () { return this._id; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._id = value || this._uid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "required", {
        /**
         * Whether the element is required.
         * @return {?}
         */
        get: function () { return this._required; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "type", {
        /**
         * Input type of the element.
         * @return {?}
         */
        get: function () { return this._type; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._type = value || 'text';
            this._validateType();
            // When using Angular inputs, developers are no longer able to set the properties on the native
            // input element. To ensure that bindings for `type` work, we need to sync the setter
            // with the native property. Textarea elements don't support the type property or attribute.
            if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
                this._renderer.setProperty(this._elementRef.nativeElement, 'type', this._type);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "value", {
        /**
         * The input element's value.
         * @return {?}
         */
        get: function () { return this._elementRef.nativeElement.value; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== this.value) {
                this._elementRef.nativeElement.value = value;
                this.stateChanges.next();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdInput.prototype.ngOnChanges = function () {
        this.stateChanges.next();
    };
    /**
     * @return {?}
     */
    MdInput.prototype.ngOnDestroy = function () {
        this.stateChanges.complete();
    };
    /**
     * @return {?}
     */
    MdInput.prototype.ngDoCheck = function () {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this._updateErrorState();
        }
        else {
            // When the input isn't used together with `@angular/forms`, we need to check manually for
            // changes to the native `value` property in order to update the floating label.
            this._dirtyCheckNativeValue();
        }
    };
    /**
     * Callback for the cases where the focused state of the input changes.
     * @param {?} isFocused
     * @return {?}
     */
    MdInput.prototype._focusChanged = function (isFocused) {
        if (isFocused !== this.focused) {
            this.focused = isFocused;
            this.stateChanges.next();
        }
    };
    /**
     * @return {?}
     */
    MdInput.prototype._onInput = function () {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    };
    /**
     * Re-evaluates the error state. This is only relevant with \@angular/forms.
     * @return {?}
     */
    MdInput.prototype._updateErrorState = function () {
        var /** @type {?} */ oldState = this.errorState;
        var /** @type {?} */ ngControl = this.ngControl;
        var /** @type {?} */ parent = this._parentFormGroup || this._parentForm;
        var /** @type {?} */ newState = ngControl && this.errorStateMatcher(/** @type {?} */ (ngControl.control), parent);
        if (newState !== oldState) {
            this.errorState = newState;
            this.stateChanges.next();
        }
    };
    /**
     * Does some manual dirty checking on the native input `value` property.
     * @return {?}
     */
    MdInput.prototype._dirtyCheckNativeValue = function () {
        var /** @type {?} */ newValue = this.value;
        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    };
    /**
     * Make sure the input is a supported type.
     * @return {?}
     */
    MdInput.prototype._validateType = function () {
        if (MD_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
            throw getMdInputUnsupportedTypeError(this._type);
        }
    };
    /**
     * Checks whether the input type is one of the types that are never empty.
     * @return {?}
     */
    MdInput.prototype._isNeverEmpty = function () {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
    };
    /**
     * Checks whether the input is invalid based on the native validation.
     * @return {?}
     */
    MdInput.prototype._isBadInput = function () {
        // The `validity` property won't be present on platform-server.
        var /** @type {?} */ validity = ((this._elementRef.nativeElement)).validity;
        return validity && validity.badInput;
    };
    /**
     * Determines if the component host is a textarea. If not recognizable it returns false.
     * @return {?}
     */
    MdInput.prototype._isTextarea = function () {
        var /** @type {?} */ nativeElement = this._elementRef.nativeElement;
        // In Universal, we don't have access to `nodeName`, but the same can be achieved with `name`.
        // Note that this shouldn't be necessary once Angular switches to an API that resembles the
        // DOM closer.
        var /** @type {?} */ nodeName = this._platform.isBrowser ? nativeElement.nodeName : nativeElement.name;
        return nodeName ? nodeName.toLowerCase() === 'textarea' : false;
    };
    Object.defineProperty(MdInput.prototype, "empty", {
        /**
         * @return {?}
         */
        get: function () {
            return !this._isNeverEmpty() &&
                (this.value == null || this.value === '') &&
                // Check if the input contains bad input. If so, we know that it only appears empty because
                // the value failed to parse. From the user's perspective it is not empty.
                // TODO(mmalerba): Add e2e test for bad input case.
                !this._isBadInput();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} ids
     * @return {?}
     */
    MdInput.prototype.setDescribedByIds = function (ids) { this._ariaDescribedby = ids.join(' '); };
    /**
     * @return {?}
     */
    MdInput.prototype.focus = function () { this._elementRef.nativeElement.focus(); };
    return MdInput;
}());
MdInput.decorators = [
    { type: Directive, args: [{
                selector: "input[mdInput], textarea[mdInput], input[matInput], textarea[matInput]",
                host: {
                    'class': 'mat-input-element',
                    // Native input properties that are overwritten by Angular inputs need to be synced with
                    // the native input element. Otherwise property bindings for those don't work.
                    '[id]': 'id',
                    '[placeholder]': 'placeholder',
                    '[disabled]': 'disabled',
                    '[required]': 'required',
                    '[attr.aria-describedby]': '_ariaDescribedby || null',
                    '[attr.aria-invalid]': 'errorState',
                    '(blur)': '_focusChanged(false)',
                    '(focus)': '_focusChanged(true)',
                    '(input)': '_onInput()',
                },
                providers: [{ provide: MdFormFieldControl, useExisting: MdInput }],
            },] },
];
/**
 * @nocollapse
 */
MdInput.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: Platform, },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self },] },
    { type: NgForm, decorators: [{ type: Optional },] },
    { type: FormGroupDirective, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_ERROR_GLOBAL_OPTIONS,] },] },
]; };
MdInput.propDecorators = {
    'disabled': [{ type: Input },],
    'id': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'required': [{ type: Input },],
    'type': [{ type: Input },],
    'errorStateMatcher': [{ type: Input },],
};
/**
 * Directive to automatically resize a textarea to fit its content.
 */
var MdTextareaAutosize = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _platform
     * @param {?} formControl
     */
    function MdTextareaAutosize(_elementRef, _platform, formControl) {
        var _this = this;
        this._elementRef = _elementRef;
        this._platform = _platform;
        if (formControl && formControl.valueChanges) {
            formControl.valueChanges.subscribe(function () { return _this.resizeToFitContent(); });
        }
    }
    Object.defineProperty(MdTextareaAutosize.prototype, "minRows", {
        /**
         * @return {?}
         */
        get: function () { return this._minRows; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._minRows = value;
            this._setMinHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "maxRows", {
        /**
         * @return {?}
         */
        get: function () { return this._maxRows; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._maxRows = value;
            this._setMaxHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "_matAutosizeMinRows", {
        /**
         * @return {?}
         */
        get: function () { return this.minRows; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.minRows = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "_matAutosizeMaxRows", {
        /**
         * @return {?}
         */
        get: function () { return this.maxRows; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.maxRows = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the minimum height of the textarea as determined by minRows.
     * @return {?}
     */
    MdTextareaAutosize.prototype._setMinHeight = function () {
        var /** @type {?} */ minHeight = this.minRows && this._cachedLineHeight ?
            this.minRows * this._cachedLineHeight + "px" : null;
        if (minHeight) {
            this._setTextareaStyle('minHeight', minHeight);
        }
    };
    /**
     * Sets the maximum height of the textarea as determined by maxRows.
     * @return {?}
     */
    MdTextareaAutosize.prototype._setMaxHeight = function () {
        var /** @type {?} */ maxHeight = this.maxRows && this._cachedLineHeight ?
            this.maxRows * this._cachedLineHeight + "px" : null;
        if (maxHeight) {
            this._setTextareaStyle('maxHeight', maxHeight);
        }
    };
    /**
     * @return {?}
     */
    MdTextareaAutosize.prototype.ngAfterViewInit = function () {
        if (this._platform.isBrowser) {
            this._cacheTextareaLineHeight();
            this.resizeToFitContent();
        }
    };
    /**
     * Sets a style property on the textarea element.
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    MdTextareaAutosize.prototype._setTextareaStyle = function (property, value) {
        var /** @type {?} */ textarea = (this._elementRef.nativeElement);
        textarea.style[property] = value;
    };
    /**
     * Cache the height of a single-row textarea.
     *
     * We need to know how large a single "row" of a textarea is in order to apply minRows and
     * maxRows. For the initial version, we will assume that the height of a single line in the
     * textarea does not ever change.
     * @return {?}
     */
    MdTextareaAutosize.prototype._cacheTextareaLineHeight = function () {
        var /** @type {?} */ textarea = (this._elementRef.nativeElement);
        // Use a clone element because we have to override some styles.
        var /** @type {?} */ textareaClone = (textarea.cloneNode(false));
        textareaClone.rows = 1;
        // Use `position: absolute` so that this doesn't cause a browser layout and use
        // `visibility: hidden` so that nothing is rendered. Clear any other styles that
        // would affect the height.
        textareaClone.style.position = 'absolute';
        textareaClone.style.visibility = 'hidden';
        textareaClone.style.border = 'none';
        textareaClone.style.padding = '0';
        textareaClone.style.height = '';
        textareaClone.style.minHeight = '';
        textareaClone.style.maxHeight = '';
        // In Firefox it happens that textarea elements are always bigger than the specified amount
        // of rows. This is because Firefox tries to add extra space for the horizontal scrollbar.
        // As a workaround that removes the extra space for the scrollbar, we can just set overflow
        // to hidden. This ensures that there is no invalid calculation of the line height.
        // See Firefox bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=33654
        textareaClone.style.overflow = 'hidden'; /** @type {?} */
        ((textarea.parentNode)).appendChild(textareaClone);
        this._cachedLineHeight = textareaClone.clientHeight; /** @type {?} */
        ((textarea.parentNode)).removeChild(textareaClone);
        // Min and max heights have to be re-calculated if the cached line height changes
        this._setMinHeight();
        this._setMaxHeight();
    };
    /**
     * Resize the textarea to fit its content.
     * @return {?}
     */
    MdTextareaAutosize.prototype.resizeToFitContent = function () {
        var /** @type {?} */ textarea = (this._elementRef.nativeElement);
        if (textarea.value === this._previousValue) {
            return;
        }
        // Reset the textarea height to auto in order to shrink back to its default size.
        // Also temporarily force overflow:hidden, so scroll bars do not interfere with calculations.
        textarea.style.height = 'auto';
        textarea.style.overflow = 'hidden';
        // Use the scrollHeight to know how large the textarea *would* be if fit its entire value.
        textarea.style.height = textarea.scrollHeight + "px";
        textarea.style.overflow = '';
        this._previousValue = textarea.value;
    };
    return MdTextareaAutosize;
}());
MdTextareaAutosize.decorators = [
    { type: Directive, args: [{
                selector: "textarea[md-autosize], textarea[mdTextareaAutosize],\n             textarea[mat-autosize], textarea[matTextareaAutosize]",
                exportAs: 'mdTextareaAutosize',
                host: {
                    '(input)': 'resizeToFitContent()',
                    // Textarea elements that have the directive applied should have a single row by default.
                    // Browsers normally show two rows by default and therefore this limits the minRows binding.
                    'rows': '1',
                },
            },] },
];
/**
 * @nocollapse
 */
MdTextareaAutosize.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Platform, },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self },] },
]; };
MdTextareaAutosize.propDecorators = {
    'minRows': [{ type: Input, args: ['mdAutosizeMinRows',] },],
    'maxRows': [{ type: Input, args: ['mdAutosizeMaxRows',] },],
    '_matAutosizeMinRows': [{ type: Input, args: ['matAutosizeMinRows',] },],
    '_matAutosizeMaxRows': [{ type: Input, args: ['matAutosizeMaxRows',] },],
};
var MdInputModule = (function () {
    function MdInputModule() {
    }
    return MdInputModule;
}());
MdInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    MdInput,
                    MdTextareaAutosize,
                ],
                imports: [
                    CommonModule,
                    MdFormFieldModule,
                    PlatformModule,
                ],
                exports: [
                    // We re-export the `MdFormFieldModule` since `MdInput` will almost always be used together with
                    // `MdFormField`.
                    MdFormFieldModule,
                    MdInput,
                    MdTextareaAutosize,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdInputModule.ctorParameters = function () { return []; };
/**
 * Custom injector to be used when providing custom
 * injection tokens to components inside a portal.
 * \@docs-private
 */
var PortalInjector = (function () {
    /**
     * @param {?} _parentInjector
     * @param {?} _customTokens
     */
    function PortalInjector(_parentInjector, _customTokens) {
        this._parentInjector = _parentInjector;
        this._customTokens = _customTokens;
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    PortalInjector.prototype.get = function (token, notFoundValue) {
        var /** @type {?} */ value = this._customTokens.get(token);
        if (typeof value !== 'undefined') {
            return value;
        }
        return this._parentInjector.get(token, notFoundValue);
    };
    return PortalInjector;
}());
var MD_SNACK_BAR_DATA = new InjectionToken('MdSnackBarData');
/**
 * Configuration used when opening a snack-bar.
 */
var MdSnackBarConfig = (function () {
    function MdSnackBarConfig() {
        /**
         * The politeness level for the MdAriaLiveAnnouncer announcement.
         */
        this.politeness = 'assertive';
        /**
         * Message to be announced by the MdAriaLiveAnnouncer
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
    }
    return MdSnackBarConfig;
}());
/**
 * Reference to a snack bar dispatched from the snack bar service.
 */
var MdSnackBarRef = (function () {
    /**
     * @param {?} containerInstance
     * @param {?} _overlayRef
     */
    function MdSnackBarRef(containerInstance, _overlayRef) {
        var _this = this;
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
        this.onAction().subscribe(function () { return _this.dismiss(); });
        containerInstance._onExit().subscribe(function () { return _this._finishDismiss(); });
    }
    /**
     * Dismisses the snack bar.
     * @return {?}
     */
    MdSnackBarRef.prototype.dismiss = function () {
        if (!this._afterClosed.closed) {
            this.containerInstance.exit();
        }
        clearTimeout(this._durationTimeoutId);
    };
    /**
     * Marks the snackbar action clicked.
     * @return {?}
     */
    MdSnackBarRef.prototype.closeWithAction = function () {
        if (!this._onAction.closed) {
            this._onAction.next();
            this._onAction.complete();
        }
    };
    /**
     * Dismisses the snack bar after some duration
     * @param {?} duration
     * @return {?}
     */
    MdSnackBarRef.prototype._dismissAfter = function (duration) {
        var _this = this;
        this._durationTimeoutId = setTimeout(function () { return _this.dismiss(); }, duration);
    };
    /**
     * Marks the snackbar as opened
     * @return {?}
     */
    MdSnackBarRef.prototype._open = function () {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    };
    /**
     * Cleans up the DOM after closing.
     * @return {?}
     */
    MdSnackBarRef.prototype._finishDismiss = function () {
        this._overlayRef.dispose();
        this._afterClosed.next();
        this._afterClosed.complete();
    };
    /**
     * Gets an observable that is notified when the snack bar is finished closing.
     * @return {?}
     */
    MdSnackBarRef.prototype.afterDismissed = function () {
        return this._afterClosed.asObservable();
    };
    /**
     * Gets an observable that is notified when the snack bar has opened and appeared.
     * @return {?}
     */
    MdSnackBarRef.prototype.afterOpened = function () {
        return this.containerInstance._onEnter();
    };
    /**
     * Gets an observable that is notified when the snack bar action is called.
     * @return {?}
     */
    MdSnackBarRef.prototype.onAction = function () {
        return this._onAction.asObservable();
    };
    return MdSnackBarRef;
}());
// TODO(jelbourn): we can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
var SHOW_ANIMATION = '225ms cubic-bezier(0.4,0.0,1,1)';
var HIDE_ANIMATION = '195ms cubic-bezier(0.0,0.0,0.2,1)';
/**
 * Internal component that wraps user-provided snack bar content.
 * \@docs-private
 */
var MdSnackBarContainer = (function (_super) {
    tslib_1.__extends(MdSnackBarContainer, _super);
    /**
     * @param {?} _ngZone
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdSnackBarContainer(_ngZone, _renderer, _elementRef) {
        var _this = _super.call(this) || this;
        _this._ngZone = _ngZone;
        _this._renderer = _renderer;
        _this._elementRef = _elementRef;
        /**
         * Subject for notifying that the snack bar has exited from view.
         */
        _this.onExit = new Subject();
        /**
         * Subject for notifying that the snack bar has finished entering the view.
         */
        _this.onEnter = new Subject();
        /**
         * The state of the snack bar animations.
         */
        _this.animationState = 'initial';
        return _this;
    }
    /**
     * Attach a component portal as content to this snack bar container.
     * @template T
     * @param {?} portal
     * @return {?}
     */
    MdSnackBarContainer.prototype.attachComponentPortal = function (portal) {
        if (this._portalHost.hasAttached()) {
            throw Error('Attempting to attach snack bar content after content is already attached');
        }
        if (this.snackBarConfig.extraClasses) {
            // Not the most efficient way of adding classes, but the renderer doesn't allow us
            // to pass in an array or a space-separated list.
            for (var _i = 0, _a = this.snackBarConfig.extraClasses; _i < _a.length; _i++) {
                var cssClass = _a[_i];
                this._renderer.addClass(this._elementRef.nativeElement, cssClass);
            }
        }
        return this._portalHost.attachComponentPortal(portal);
    };
    /**
     * Attach a template portal as content to this snack bar container.
     * @return {?}
     */
    MdSnackBarContainer.prototype.attachTemplatePortal = function () {
        throw Error('Not yet implemented');
    };
    /**
     * Handle end of animations, updating the state of the snackbar.
     * @param {?} event
     * @return {?}
     */
    MdSnackBarContainer.prototype.onAnimationEnd = function (event) {
        if (event.toState === 'void' || event.toState === 'complete') {
            this._completeExit();
        }
        if (event.toState === 'visible') {
            // Note: we shouldn't use `this` inside the zone callback,
            // because it can cause a memory leak.
            var /** @type {?} */ onEnter_1 = this.onEnter;
            this._ngZone.run(function () {
                onEnter_1.next();
                onEnter_1.complete();
            });
        }
    };
    /**
     * Begin animation of snack bar entrance into view.
     * @return {?}
     */
    MdSnackBarContainer.prototype.enter = function () {
        this.animationState = 'visible';
    };
    /**
     * Returns an observable resolving when the enter animation completes.
     * @return {?}
     */
    MdSnackBarContainer.prototype._onEnter = function () {
        this.animationState = 'visible';
        return this.onEnter.asObservable();
    };
    /**
     * Begin animation of the snack bar exiting from view.
     * @return {?}
     */
    MdSnackBarContainer.prototype.exit = function () {
        this.animationState = 'complete';
        return this._onExit();
    };
    /**
     * Returns an observable that completes after the closing animation is done.
     * @return {?}
     */
    MdSnackBarContainer.prototype._onExit = function () {
        return this.onExit.asObservable();
    };
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     * @return {?}
     */
    MdSnackBarContainer.prototype.ngOnDestroy = function () {
        this._completeExit();
    };
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     * @return {?}
     */
    MdSnackBarContainer.prototype._completeExit = function () {
        // Note: we shouldn't use `this` inside the zone callback,
        // because it can cause a memory leak.
        var /** @type {?} */ onExit = this.onExit;
        first.call(this._ngZone.onMicrotaskEmpty).subscribe(function () {
            onExit.next();
            onExit.complete();
        });
    };
    return MdSnackBarContainer;
}(BasePortalHost));
MdSnackBarContainer.decorators = [
    { type: Component, args: [{ selector: 'snack-bar-container',
                template: "<ng-template cdkPortalHost></ng-template>",
                styles: [".mat-snack-bar-container{border-radius:2px;box-sizing:content-box;display:block;max-width:568px;min-width:288px;padding:14px 24px;transform:translateY(100%)}@media screen and (-ms-high-contrast:active){.mat-snack-bar-container{border:solid 1px}}"],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: {
                    'role': 'alert',
                    'class': 'mat-snack-bar-container',
                    '[@state]': 'animationState',
                    '(@state.done)': 'onAnimationEnd($event)'
                },
                animations: [
                    trigger('state', [
                        state('void', style({ transform: 'translateY(100%)' })),
                        state('initial', style({ transform: 'translateY(100%)' })),
                        state('visible', style({ transform: 'translateY(0%)' })),
                        state('complete', style({ transform: 'translateY(100%)' })),
                        transition('visible => complete', animate(HIDE_ANIMATION)),
                        transition('initial => visible, void => visible', animate(SHOW_ANIMATION)),
                    ])
                ],
            },] },
];
/**
 * @nocollapse
 */
MdSnackBarContainer.ctorParameters = function () { return [
    { type: NgZone, },
    { type: Renderer2, },
    { type: ElementRef, },
]; };
MdSnackBarContainer.propDecorators = {
    '_portalHost': [{ type: ViewChild, args: [PortalHostDirective,] },],
};
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
var SimpleSnackBar = (function () {
    /**
     * @param {?} snackBarRef
     * @param {?} data
     */
    function SimpleSnackBar(snackBarRef, data) {
        this.snackBarRef = snackBarRef;
        this.data = data;
    }
    /**
     * Performs the action on the snack bar.
     * @return {?}
     */
    SimpleSnackBar.prototype.action = function () {
        this.snackBarRef.closeWithAction();
    };
    Object.defineProperty(SimpleSnackBar.prototype, "hasAction", {
        /**
         * If the action button should be shown.
         * @return {?}
         */
        get: function () {
            return !!this.data.action;
        },
        enumerable: true,
        configurable: true
    });
    return SimpleSnackBar;
}());
SimpleSnackBar.decorators = [
    { type: Component, args: [{ selector: 'simple-snack-bar',
                template: "{{data.message}} <button class=\"mat-simple-snackbar-action\" *ngIf=\"hasAction\" (click)=\"action()\">{{data.action}}</button>",
                styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;line-height:20px}.mat-simple-snackbar-action{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;background:0 0;flex-shrink:0;margin-left:48px}[dir=rtl] .mat-simple-snackbar-action{margin-right:48px;margin-left:0}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-simple-snackbar',
                }
            },] },
];
/**
 * @nocollapse
 */
SimpleSnackBar.ctorParameters = function () { return [
    { type: MdSnackBarRef, },
    { type: undefined, decorators: [{ type: Inject, args: [MD_SNACK_BAR_DATA,] },] },
]; };
/**
 * Service to dispatch Material Design snack bar messages.
 */
var MdSnackBar = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _live
     * @param {?} _injector
     * @param {?} _parentSnackBar
     */
    function MdSnackBar(_overlay, _live, _injector, _parentSnackBar) {
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
    Object.defineProperty(MdSnackBar.prototype, "_openedSnackBarRef", {
        /**
         * Reference to the currently opened snackbar at *any* level.
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ parent = this._parentSnackBar;
            return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._parentSnackBar) {
                this._parentSnackBar._openedSnackBarRef = value;
            }
            else {
                this._snackBarRefAtThisLevel = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and dispatches a snack bar with a custom component for the content, removing any
     * currently opened snack bars.
     *
     * @template T
     * @param {?} component Component to be instantiated.
     * @param {?=} config Extra configuration for the snack bar.
     * @return {?}
     */
    MdSnackBar.prototype.openFromComponent = function (component, config) {
        var _this = this;
        var /** @type {?} */ _config = _applyConfigDefaults(config);
        var /** @type {?} */ snackBarRef = this._attach(component, _config);
        // When the snackbar is dismissed, clear the reference to it.
        snackBarRef.afterDismissed().subscribe(function () {
            // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
            if (_this._openedSnackBarRef == snackBarRef) {
                _this._openedSnackBarRef = null;
            }
        });
        if (this._openedSnackBarRef) {
            // If a snack bar is already in view, dismiss it and enter the
            // new snack bar after exit animation is complete.
            this._openedSnackBarRef.afterDismissed().subscribe(function () {
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
            snackBarRef.afterOpened().subscribe(function () { return snackBarRef._dismissAfter(/** @type {?} */ ((((_config)).duration))); });
        }
        if (_config.announcementMessage) {
            this._live.announce(_config.announcementMessage, _config.politeness);
        }
        this._openedSnackBarRef = snackBarRef;
        return this._openedSnackBarRef;
    };
    /**
     * Opens a snackbar with a message and an optional action.
     * @param {?} message The message to show in the snackbar.
     * @param {?=} action The label for the snackbar action.
     * @param {?=} config Additional configuration options for the snackbar.
     * @return {?}
     */
    MdSnackBar.prototype.open = function (message, action, config) {
        if (action === void 0) { action = ''; }
        var /** @type {?} */ _config = _applyConfigDefaults(config);
        // Since the user doesn't have access to the component, we can
        // override the data to pass in our own message and action.
        _config.data = { message: message, action: action };
        _config.announcementMessage = message;
        return this.openFromComponent(SimpleSnackBar, _config);
    };
    /**
     * Dismisses the currently-visible snack bar.
     * @return {?}
     */
    MdSnackBar.prototype.dismiss = function () {
        if (this._openedSnackBarRef) {
            this._openedSnackBarRef.dismiss();
        }
    };
    /**
     * Attaches the snack bar container component to the overlay.
     * @param {?} overlayRef
     * @param {?} config
     * @return {?}
     */
    MdSnackBar.prototype._attachSnackBarContainer = function (overlayRef, config) {
        var /** @type {?} */ containerPortal = new ComponentPortal(MdSnackBarContainer, config.viewContainerRef);
        var /** @type {?} */ containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.snackBarConfig = config;
        return containerRef.instance;
    };
    /**
     * Places a new component as the content of the snack bar container.
     * @template T
     * @param {?} component
     * @param {?} config
     * @return {?}
     */
    MdSnackBar.prototype._attach = function (component, config) {
        var /** @type {?} */ overlayRef = this._createOverlay(config);
        var /** @type {?} */ container = this._attachSnackBarContainer(overlayRef, config);
        var /** @type {?} */ snackBarRef = new MdSnackBarRef(container, overlayRef);
        var /** @type {?} */ injector = this._createInjector(config, snackBarRef);
        var /** @type {?} */ portal = new ComponentPortal(component, undefined, injector);
        var /** @type {?} */ contentRef = container.attachComponentPortal(portal);
        // We can't pass this via the injector, because the injector is created earlier.
        snackBarRef.instance = contentRef.instance;
        return snackBarRef;
    };
    /**
     * Creates a new overlay and places it in the correct location.
     * @param {?} config The user-specified snack bar config.
     * @return {?}
     */
    MdSnackBar.prototype._createOverlay = function (config) {
        var /** @type {?} */ state$$1 = new OverlayState();
        state$$1.direction = config.direction;
        state$$1.positionStrategy = this._overlay.position().global().centerHorizontally().bottom('0');
        return this._overlay.create(state$$1);
    };
    /**
     * Creates an injector to be used inside of a snack bar component.
     * @template T
     * @param {?} config Config that was used to create the snack bar.
     * @param {?} snackBarRef Reference to the snack bar.
     * @return {?}
     */
    MdSnackBar.prototype._createInjector = function (config, snackBarRef) {
        var /** @type {?} */ userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        var /** @type {?} */ injectionTokens = new WeakMap();
        injectionTokens.set(MdSnackBarRef, snackBarRef);
        injectionTokens.set(MD_SNACK_BAR_DATA, config.data);
        return new PortalInjector(userInjector || this._injector, injectionTokens);
    };
    return MdSnackBar;
}());
MdSnackBar.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MdSnackBar.ctorParameters = function () { return [
    { type: Overlay, },
    { type: LiveAnnouncer, },
    { type: Injector, },
    { type: MdSnackBar, decorators: [{ type: Optional }, { type: SkipSelf },] },
]; };
/**
 * Applies default options to the snackbar config.
 * @param {?=} config The configuration to which the defaults will be applied.
 * @return {?} The new configuration object with defaults applied.
 */
function _applyConfigDefaults(config) {
    return extendObject(new MdSnackBarConfig(), config);
}
var MdSnackBarModule = (function () {
    function MdSnackBarModule() {
    }
    return MdSnackBarModule;
}());
MdSnackBarModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    OverlayModule,
                    PortalModule,
                    CommonModule,
                    MdCommonModule,
                ],
                exports: [MdSnackBarContainer, MdCommonModule],
                declarations: [MdSnackBarContainer, SimpleSnackBar],
                entryComponents: [MdSnackBarContainer, SimpleSnackBar],
                providers: [MdSnackBar, LIVE_ANNOUNCER_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MdSnackBarModule.ctorParameters = function () { return []; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdTabLabelBaseClass = TemplatePortalDirective;
/**
 * Used to flag tab labels for use with the portal directive
 */
var MdTabLabel = (function (_super) {
    tslib_1.__extends(MdTabLabel, _super);
    /**
     * @param {?} templateRef
     * @param {?} viewContainerRef
     */
    function MdTabLabel(templateRef, viewContainerRef) {
        return _super.call(this, templateRef, viewContainerRef) || this;
    }
    return MdTabLabel;
}(_MdTabLabelBaseClass));
MdTabLabel.decorators = [
    { type: Directive, args: [{
                selector: '[md-tab-label], [mat-tab-label], [mdTabLabel], [matTabLabel]',
            },] },
];
/**
 * @nocollapse
 */
MdTabLabel.ctorParameters = function () { return [
    { type: TemplateRef, },
    { type: ViewContainerRef, },
]; };
/**
 * \@docs-private
 */
var MdTabBase = (function () {
    function MdTabBase() {
    }
    return MdTabBase;
}());
var _MdTabMixinBase = mixinDisabled(MdTabBase);
var MdTab = (function (_super) {
    tslib_1.__extends(MdTab, _super);
    /**
     * @param {?} _viewContainerRef
     */
    function MdTab(_viewContainerRef) {
        var _this = _super.call(this) || this;
        _this._viewContainerRef = _viewContainerRef;
        /**
         * The plain text label for the tab, used when there is no template label.
         */
        _this.textLabel = '';
        /**
         * The portal that will be the hosted content of the tab
         */
        _this._contentPortal = null;
        /**
         * Emits whenever the label changes.
         */
        _this._labelChange = new Subject();
        /**
         * The relatively indexed position where 0 represents the center, negative is left, and positive
         * represents the right.
         */
        _this.position = null;
        /**
         * The initial relatively index origin of the tab if it was created and selected after there
         * was already a selected tab. Provides context of what position the tab should originate from.
         */
        _this.origin = null;
        /**
         * Whether the tab is currently active.
         */
        _this.isActive = false;
        return _this;
    }
    Object.defineProperty(MdTab.prototype, "content", {
        /**
         * @return {?}
         */
        get: function () { return this._contentPortal; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    MdTab.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('textLabel')) {
            this._labelChange.next();
        }
    };
    /**
     * @return {?}
     */
    MdTab.prototype.ngOnDestroy = function () {
        this._labelChange.complete();
    };
    /**
     * @return {?}
     */
    MdTab.prototype.ngOnInit = function () {
        this._contentPortal = new TemplatePortal(this._content, this._viewContainerRef);
    };
    return MdTab;
}(_MdTabMixinBase));
MdTab.decorators = [
    { type: Component, args: [{ selector: 'md-tab, mat-tab',
                template: "<ng-template><ng-content></ng-content></ng-template>",
                inputs: ['disabled'],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                exportAs: 'mdTab',
            },] },
];
/**
 * @nocollapse
 */
MdTab.ctorParameters = function () { return [
    { type: ViewContainerRef, },
]; };
MdTab.propDecorators = {
    'templateLabel': [{ type: ContentChild, args: [MdTabLabel,] },],
    '_content': [{ type: ViewChild, args: [TemplateRef,] },],
    'textLabel': [{ type: Input, args: ['label',] },],
};
/**
 * Used to generate unique ID's for each tab component
 */
var nextId = 0;
/**
 * A simple change event emitted on focus or selection changes.
 */
var MdTabChangeEvent = (function () {
    function MdTabChangeEvent() {
    }
    return MdTabChangeEvent;
}());
/**
 * \@docs-private
 */
var MdTabGroupBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdTabGroupBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdTabGroupBase;
}());
var _MdTabGroupMixinBase = mixinColor(mixinDisableRipple(MdTabGroupBase), 'primary');
/**
 * Material design tab-group component.  Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://www.google.com/design/spec/components/tabs.html
 */
var MdTabGroup = (function (_super) {
    tslib_1.__extends(MdTabGroup, _super);
    /**
     * @param {?} _renderer
     * @param {?} elementRef
     * @param {?} _changeDetectorRef
     */
    function MdTabGroup(_renderer, elementRef, _changeDetectorRef) {
        var _this = _super.call(this, _renderer, elementRef) || this;
        _this._changeDetectorRef = _changeDetectorRef;
        /**
         * Whether this component has been initialized.
         */
        _this._isInitialized = false;
        /**
         * The tab index that should be selected after the content has been checked.
         */
        _this._indexToSelect = 0;
        /**
         * Snapshot of the height of the tab body wrapper before another tab is activated.
         */
        _this._tabBodyWrapperHeight = 0;
        _this._dynamicHeight = false;
        _this._selectedIndex = null;
        /**
         * Position of the tab header.
         */
        _this.headerPosition = 'above';
        /**
         * Event emitted when focus has changed within a tab group.
         */
        _this.focusChange = new EventEmitter();
        /**
         * Event emitted when the tab selection has changed.
         */
        _this.selectChange = new EventEmitter(true);
        _this._groupId = nextId++;
        return _this;
    }
    Object.defineProperty(MdTabGroup.prototype, "dynamicHeight", {
        /**
         * Whether the tab group should grow to the size of the active tab.
         * @return {?}
         */
        get: function () { return this._dynamicHeight; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._dynamicHeight = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "_dynamicHeightDeprecated", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this._dynamicHeight; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._dynamicHeight = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectedIndex", {
        /**
         * @return {?}
         */
        get: function () { return this._selectedIndex; },
        /**
         * The index of the active tab.
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._indexToSelect = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "backgroundColor", {
        /**
         * Background color of the tab group.
         * @return {?}
         */
        get: function () { return this._backgroundColor; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            var /** @type {?} */ nativeElement = this._elementRef.nativeElement;
            this._renderer.removeClass(nativeElement, "mat-background-" + this.backgroundColor);
            if (value) {
                this._renderer.addClass(nativeElement, "mat-background-" + value);
            }
            this._backgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectedIndexChange", {
        /**
         * Output to enable support for two-way binding on `[(selectedIndex)]`
         * @return {?}
         */
        get: function () {
            return map.call(this.selectChange, function (event) { return event.index; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * After the content is checked, this component knows what tabs have been defined
     * and what the selected index should be. This is where we can know exactly what position
     * each tab should be in according to the new selected index, and additionally we know how
     * a new selected tab should transition in (from the left or right).
     * @return {?}
     */
    MdTabGroup.prototype.ngAfterContentChecked = function () {
        var _this = this;
        // Clamp the next selected index to the bounds of 0 and the tabs length. Note the `|| 0`, which
        // ensures that values like NaN can't get through and which would otherwise throw the
        // component into an infinite loop (since Math.max(NaN, 0) === NaN).
        var /** @type {?} */ indexToSelect = this._indexToSelect =
            Math.min(this._tabs.length - 1, Math.max(this._indexToSelect || 0, 0));
        // If there is a change in selected index, emit a change event. Should not trigger if
        // the selected index has not yet been initialized.
        if (this._selectedIndex != indexToSelect && this._selectedIndex != null) {
            this.selectChange.emit(this._createChangeEvent(indexToSelect));
        }
        // Setup the position for each tab and optionally setup an origin on the next selected tab.
        this._tabs.forEach(function (tab, index) {
            tab.position = index - indexToSelect;
            tab.isActive = index === indexToSelect;
            // If there is already a selected tab, then set up an origin for the next selected tab
            // if it doesn't have one already.
            if (_this._selectedIndex != null && tab.position == 0 && !tab.origin) {
                tab.origin = indexToSelect - _this._selectedIndex;
            }
        });
        if (this._selectedIndex !== indexToSelect) {
            this._selectedIndex = indexToSelect;
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * @return {?}
     */
    MdTabGroup.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._subscribeToTabLabels();
        // Subscribe to changes in the amount of tabs, in order to be
        // able to re-render the content as new tabs are added or removed.
        this._tabsSubscription = this._tabs.changes.subscribe(function () {
            _this._subscribeToTabLabels();
            _this._changeDetectorRef.markForCheck();
        });
    };
    /**
     * @return {?}
     */
    MdTabGroup.prototype.ngOnDestroy = function () {
        if (this._tabsSubscription) {
            this._tabsSubscription.unsubscribe();
        }
        if (this._tabLabelSubscription) {
            this._tabLabelSubscription.unsubscribe();
        }
    };
    /**
     * Waits one frame for the view to update, then updates the ink bar
     * Note: This must be run outside of the zone or it will create an infinite change detection loop.
     * @return {?}
     */
    MdTabGroup.prototype.ngAfterViewChecked = function () {
        this._isInitialized = true;
    };
    /**
     * @param {?} index
     * @return {?}
     */
    MdTabGroup.prototype._focusChanged = function (index) {
        this.focusChange.emit(this._createChangeEvent(index));
    };
    /**
     * @param {?} index
     * @return {?}
     */
    MdTabGroup.prototype._createChangeEvent = function (index) {
        var /** @type {?} */ event = new MdTabChangeEvent;
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    };
    /**
     * Subscribes to changes in the tab labels. This is needed, because the \@Input for the label is
     * on the MdTab component, whereas the data binding is inside the MdTabGroup. In order for the
     * binding to be updated, we need to subscribe to changes in it and trigger change detection
     * manually.
     * @return {?}
     */
    MdTabGroup.prototype._subscribeToTabLabels = function () {
        var _this = this;
        if (this._tabLabelSubscription) {
            this._tabLabelSubscription.unsubscribe();
        }
        this._tabLabelSubscription = merge.apply(void 0, this._tabs.map(function (tab) { return tab._labelChange; })).subscribe(function () {
            _this._changeDetectorRef.markForCheck();
        });
    };
    /**
     * Returns a unique id for each tab label element
     * @param {?} i
     * @return {?}
     */
    MdTabGroup.prototype._getTabLabelId = function (i) {
        return "md-tab-label-" + this._groupId + "-" + i;
    };
    /**
     * Returns a unique id for each tab content element
     * @param {?} i
     * @return {?}
     */
    MdTabGroup.prototype._getTabContentId = function (i) {
        return "md-tab-content-" + this._groupId + "-" + i;
    };
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     * @param {?} tabHeight
     * @return {?}
     */
    MdTabGroup.prototype._setTabBodyWrapperHeight = function (tabHeight) {
        if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
            return;
        }
        this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', this._tabBodyWrapperHeight + 'px');
        // This conditional forces the browser to paint the height so that
        // the animation to the new height can have an origin.
        if (this._tabBodyWrapper.nativeElement.offsetHeight) {
            this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', tabHeight + 'px');
        }
    };
    /**
     * Removes the height of the tab body wrapper.
     * @return {?}
     */
    MdTabGroup.prototype._removeTabBodyWrapperHeight = function () {
        this._tabBodyWrapperHeight = this._tabBodyWrapper.nativeElement.clientHeight;
        this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', '');
    };
    return MdTabGroup;
}(_MdTabGroupMixinBase));
MdTabGroup.decorators = [
    { type: Component, args: [{ selector: 'md-tab-group, mat-tab-group',
                template: "<md-tab-header #tabHeader [selectedIndex]=\"selectedIndex\" [disableRipple]=\"disableRipple\" (indexFocused)=\"_focusChanged($event)\" (selectFocusedIndex)=\"selectedIndex = $event\"><div class=\"mat-tab-label\" role=\"tab\" mdTabLabelWrapper md-ripple *ngFor=\"let tab of _tabs; let i = index\" [id]=\"_getTabLabelId(i)\" [tabIndex]=\"selectedIndex == i ? 0 : -1\" [attr.aria-controls]=\"_getTabContentId(i)\" [attr.aria-selected]=\"selectedIndex == i\" [class.mat-tab-label-active]=\"selectedIndex == i\" [disabled]=\"tab.disabled\" [mdRippleDisabled]=\"disableRipple\" (click)=\"tabHeader.focusIndex = selectedIndex = i\"><ng-template [ngIf]=\"tab.templateLabel\"><ng-template [cdkPortalHost]=\"tab.templateLabel\"></ng-template></ng-template><ng-template [ngIf]=\"!tab.templateLabel\">{{tab.textLabel}}</ng-template></div></md-tab-header><div class=\"mat-tab-body-wrapper\" #tabBodyWrapper><md-tab-body role=\"tabpanel\" *ngFor=\"let tab of _tabs; let i = index\" [id]=\"_getTabContentId(i)\" [attr.aria-labelledby]=\"_getTabLabelId(i)\" [class.mat-tab-body-active]=\"selectedIndex == i\" [content]=\"tab.content\" [position]=\"tab.position\" [origin]=\"tab.origin\" (onCentered)=\"_removeTabBodyWrapperHeight()\" (onCentering)=\"_setTabBodyWrapperHeight($event)\"></md-tab-body></div>",
                styles: [".mat-tab-group{display:flex;flex-direction:column}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 12px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:0;opacity:1}.mat-tab-label.mat-tab-disabled{cursor:default;pointer-events:none}@media (max-width:600px){.mat-tab-label{min-width:72px}}.mat-tab-group[mat-stretch-tabs] .mat-tab-label,.mat-tab-group[md-stretch-tabs] .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height .5s cubic-bezier(.35,0,.25,1)}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: ['color', 'disableRipple'],
                host: {
                    'class': 'mat-tab-group',
                    '[class.mat-tab-group-dynamic-height]': 'dynamicHeight',
                    '[class.mat-tab-group-inverted-header]': 'headerPosition === "below"',
                }
            },] },
];
/**
 * @nocollapse
 */
MdTabGroup.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
]; };
MdTabGroup.propDecorators = {
    '_tabs': [{ type: ContentChildren, args: [MdTab,] },],
    '_tabBodyWrapper': [{ type: ViewChild, args: ['tabBodyWrapper',] },],
    'dynamicHeight': [{ type: Input },],
    '_dynamicHeightDeprecated': [{ type: Input, args: ['md-dynamic-height',] },],
    'selectedIndex': [{ type: Input },],
    'headerPosition': [{ type: Input },],
    'backgroundColor': [{ type: Input },],
    'selectedIndexChange': [{ type: Output },],
    'focusChange': [{ type: Output },],
    'selectChange': [{ type: Output },],
};
/**
 * \@docs-private
 */
var MdTabLabelWrapperBase = (function () {
    function MdTabLabelWrapperBase() {
    }
    return MdTabLabelWrapperBase;
}());
var _MdTabLabelWrapperMixinBase = mixinDisabled(MdTabLabelWrapperBase);
/**
 * Used in the `md-tab-group` view to display tab labels.
 * \@docs-private
 */
var MdTabLabelWrapper = (function (_super) {
    tslib_1.__extends(MdTabLabelWrapper, _super);
    /**
     * @param {?} elementRef
     */
    function MdTabLabelWrapper(elementRef) {
        var _this = _super.call(this) || this;
        _this.elementRef = elementRef;
        return _this;
    }
    /**
     * Sets focus on the wrapper element
     * @return {?}
     */
    MdTabLabelWrapper.prototype.focus = function () {
        this.elementRef.nativeElement.focus();
    };
    /**
     * @return {?}
     */
    MdTabLabelWrapper.prototype.getOffsetLeft = function () {
        return this.elementRef.nativeElement.offsetLeft;
    };
    /**
     * @return {?}
     */
    MdTabLabelWrapper.prototype.getOffsetWidth = function () {
        return this.elementRef.nativeElement.offsetWidth;
    };
    return MdTabLabelWrapper;
}(_MdTabLabelWrapperMixinBase));
MdTabLabelWrapper.decorators = [
    { type: Directive, args: [{
                selector: '[mdTabLabelWrapper], [matTabLabelWrapper]',
                inputs: ['disabled'],
                host: {
                    '[class.mat-tab-disabled]': 'disabled'
                }
            },] },
];
/**
 * @nocollapse
 */
MdTabLabelWrapper.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * \@docs-private
 */
var MdInkBar = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _ngZone
     */
    function MdInkBar(_renderer, _elementRef, _ngZone) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
    }
    /**
     * Calculates the styles from the provided element in order to align the ink-bar to that element.
     * Shows the ink bar if previously set as hidden.
     * @param {?} element
     * @return {?}
     */
    MdInkBar.prototype.alignToElement = function (element) {
        var _this = this;
        this.show();
        if (typeof requestAnimationFrame !== 'undefined') {
            this._ngZone.runOutsideAngular(function () {
                requestAnimationFrame(function () { return _this._setStyles(element); });
            });
        }
        else {
            this._setStyles(element);
        }
    };
    /**
     * Shows the ink bar.
     * @return {?}
     */
    MdInkBar.prototype.show = function () {
        this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'visible');
    };
    /**
     * Hides the ink bar.
     * @return {?}
     */
    MdInkBar.prototype.hide = function () {
        this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
    };
    /**
     * Sets the proper styles to the ink bar element.
     * @param {?} element
     * @return {?}
     */
    MdInkBar.prototype._setStyles = function (element) {
        var /** @type {?} */ left = element ? (element.offsetLeft || 0) + 'px' : '0';
        var /** @type {?} */ width = element ? (element.offsetWidth || 0) + 'px' : '0';
        this._renderer.setStyle(this._elementRef.nativeElement, 'left', left);
        this._renderer.setStyle(this._elementRef.nativeElement, 'width', width);
    };
    return MdInkBar;
}());
MdInkBar.decorators = [
    { type: Directive, args: [{
                selector: 'md-ink-bar, mat-ink-bar',
                host: {
                    'class': 'mat-ink-bar',
                },
            },] },
];
/**
 * @nocollapse
 */
MdInkBar.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: NgZone, },
]; };
/**
 * \@docs-private
 */
var MdTabNavBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdTabNavBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdTabNavBase;
}());
var _MdTabNavMixinBase = mixinDisableRipple(mixinColor(MdTabNavBase, 'primary'));
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
var MdTabNav = (function (_super) {
    tslib_1.__extends(MdTabNav, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _dir
     * @param {?} _ngZone
     * @param {?} _changeDetectorRef
     */
    function MdTabNav(renderer, elementRef, _dir, _ngZone, _changeDetectorRef) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._dir = _dir;
        _this._ngZone = _ngZone;
        _this._changeDetectorRef = _changeDetectorRef;
        /**
         * Subject that emits when the component has been destroyed.
         */
        _this._onDestroy = new Subject();
        _this._disableRipple = false;
        return _this;
    }
    Object.defineProperty(MdTabNav.prototype, "backgroundColor", {
        /**
         * Background color of the tab nav.
         * @return {?}
         */
        get: function () { return this._backgroundColor; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            var /** @type {?} */ nativeElement = this._elementRef.nativeElement;
            this._renderer.removeClass(nativeElement, "mat-background-" + this.backgroundColor);
            if (value) {
                this._renderer.addClass(nativeElement, "mat-background-" + value);
            }
            this._backgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabNav.prototype, "disableRipple", {
        /**
         * Whether ripples should be disabled for all links or not.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disableRipple = coerceBooleanProperty(value);
            this._setLinkDisableRipple();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Notifies the component that the active link has been changed.
     * @param {?} element
     * @return {?}
     */
    MdTabNav.prototype.updateActiveLink = function (element) {
        this._activeLinkChanged = this._activeLinkElement != element;
        this._activeLinkElement = element;
        if (this._activeLinkChanged) {
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * @return {?}
     */
    MdTabNav.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._resizeSubscription = this._ngZone.runOutsideAngular(function () {
            var /** @type {?} */ dirChange = _this._dir ? _this._dir.change : of(null);
            var /** @type {?} */ resize = typeof window !== 'undefined' ?
                auditTime.call(fromEvent(window, 'resize'), 10) :
                of(null);
            return takeUntil.call(merge(dirChange, resize), _this._onDestroy)
                .subscribe(function () { return _this._alignInkBar(); });
        });
        this._setLinkDisableRipple();
    };
    /**
     * Checks if the active link has been changed and, if so, will update the ink bar.
     * @return {?}
     */
    MdTabNav.prototype.ngAfterContentChecked = function () {
        if (this._activeLinkChanged) {
            this._alignInkBar();
            this._activeLinkChanged = false;
        }
    };
    /**
     * @return {?}
     */
    MdTabNav.prototype.ngOnDestroy = function () {
        this._onDestroy.next();
        if (this._resizeSubscription) {
            this._resizeSubscription.unsubscribe();
        }
    };
    /**
     * Aligns the ink bar to the active link.
     * @return {?}
     */
    MdTabNav.prototype._alignInkBar = function () {
        if (this._activeLinkElement) {
            this._inkBar.alignToElement(this._activeLinkElement.nativeElement);
        }
    };
    /**
     * Sets the `disableRipple` property on each link of the navigation bar.
     * @return {?}
     */
    MdTabNav.prototype._setLinkDisableRipple = function () {
        var _this = this;
        if (this._tabLinks) {
            this._tabLinks.forEach(function (link) { return link.disableRipple = _this.disableRipple; });
        }
    };
    return MdTabNav;
}(_MdTabNavMixinBase));
MdTabNav.decorators = [
    { type: Component, args: [{ selector: '[md-tab-nav-bar], [mat-tab-nav-bar]',
                inputs: ['color', 'disableRipple'],
                template: "<div class=\"mat-tab-links\" (cdkObserveContent)=\"_alignInkBar()\"><ng-content></ng-content><md-ink-bar></md-ink-bar></div>",
                styles: [".mat-tab-nav-bar{overflow:hidden;position:relative;flex-shrink:0}.mat-tab-links{position:relative}.mat-tab-link{height:48px;padding:0 12px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden}.mat-tab-link:focus{outline:0;opacity:1}.mat-tab-link.mat-tab-disabled{cursor:default;pointer-events:none}@media (max-width:600px){.mat-tab-link{min-width:72px}}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:.5s cubic-bezier(.35,0,.25,1)}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}"],
                host: { 'class': 'mat-tab-nav-bar' },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdTabNav.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: NgZone, },
    { type: ChangeDetectorRef, },
]; };
MdTabNav.propDecorators = {
    '_inkBar': [{ type: ViewChild, args: [MdInkBar,] },],
    '_tabLinks': [{ type: ContentChildren, args: [forwardRef(function () { return MdTabLink; }), { descendants: true },] },],
    'backgroundColor': [{ type: Input },],
};
var MdTabLinkBase = (function () {
    function MdTabLinkBase() {
    }
    return MdTabLinkBase;
}());
var _MdTabLinkMixinBase = mixinDisabled(MdTabLinkBase);
/**
 * Link inside of a `md-tab-nav-bar`.
 */
var MdTabLink = (function (_super) {
    tslib_1.__extends(MdTabLink, _super);
    /**
     * @param {?} _mdTabNavBar
     * @param {?} _elementRef
     * @param {?} ngZone
     * @param {?} ruler
     * @param {?} platform
     * @param {?} globalOptions
     */
    function MdTabLink(_mdTabNavBar, _elementRef, ngZone, ruler, platform, globalOptions) {
        var _this = _super.call(this) || this;
        _this._mdTabNavBar = _mdTabNavBar;
        _this._elementRef = _elementRef;
        /**
         * Whether the tab link is active or not.
         */
        _this._isActive = false;
        /**
         * Whether the ripples for this tab should be disabled or not.
         */
        _this._disableRipple = false;
        // Manually create a ripple instance that uses the tab link element as trigger element.
        // Notice that the lifecycle hooks for the ripple config won't be called anymore.
        _this._tabLinkRipple = new MdRipple(_elementRef, ngZone, ruler, platform, globalOptions);
        return _this;
    }
    Object.defineProperty(MdTabLink.prototype, "active", {
        /**
         * Whether the link is active.
         * @return {?}
         */
        get: function () { return this._isActive; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._isActive = value;
            if (value) {
                this._mdTabNavBar.updateActiveLink(this._elementRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabLink.prototype, "disableRipple", {
        /**
         * Whether ripples should be disabled or not.
         * @return {?}
         */
        get: function () { return this._disableRipple; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disableRipple = value;
            this._tabLinkRipple.disabled = this.disableRipple;
            this._tabLinkRipple._updateRippleRenderer();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabLink.prototype, "tabIndex", {
        /**
         * \@docs-private
         * @return {?}
         */
        get: function () {
            return this.disabled ? -1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdTabLink.prototype.ngOnDestroy = function () {
        // Manually call the ngOnDestroy lifecycle hook of the ripple instance because it won't be
        // called automatically since its instance is not created by Angular.
        this._tabLinkRipple.ngOnDestroy();
    };
    return MdTabLink;
}(_MdTabLinkMixinBase));
MdTabLink.decorators = [
    { type: Directive, args: [{
                selector: '[md-tab-link], [mat-tab-link], [mdTabLink], [matTabLink]',
                inputs: ['disabled'],
                host: {
                    'class': 'mat-tab-link',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.tabindex]': 'tabIndex',
                    '[class.mat-tab-disabled]': 'disabled'
                }
            },] },
];
/**
 * @nocollapse
 */
MdTabLink.ctorParameters = function () { return [
    { type: MdTabNav, },
    { type: ElementRef, },
    { type: NgZone, },
    { type: ViewportRuler$1, },
    { type: Platform, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_RIPPLE_GLOBAL_OPTIONS,] },] },
]; };
MdTabLink.propDecorators = {
    'active': [{ type: Input },],
};
/**
 * Wrapper for the contents of a tab.
 * \@docs-private
 */
var MdTabBody = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _dir
     */
    function MdTabBody(_elementRef, _dir) {
        this._elementRef = _elementRef;
        this._dir = _dir;
        /**
         * Event emitted when the tab begins to animate towards the center as the active tab.
         */
        this.onCentering = new EventEmitter();
        /**
         * Event emitted when the tab completes its animation towards the center.
         */
        this.onCentered = new EventEmitter(true);
    }
    Object.defineProperty(MdTabBody.prototype, "position", {
        /**
         * @param {?} position
         * @return {?}
         */
        set: function (position) {
            if (position < 0) {
                this._position = this._getLayoutDirection() == 'ltr' ? 'left' : 'right';
            }
            else if (position > 0) {
                this._position = this._getLayoutDirection() == 'ltr' ? 'right' : 'left';
            }
            else {
                this._position = 'center';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabBody.prototype, "origin", {
        /**
         * The origin position from which this tab should appear when it is centered into view.
         * @param {?} origin
         * @return {?}
         */
        set: function (origin) {
            if (origin == null) {
                return;
            }
            var /** @type {?} */ dir = this._getLayoutDirection();
            if ((dir == 'ltr' && origin <= 0) || (dir == 'rtl' && origin > 0)) {
                this._origin = 'left';
            }
            else {
                this._origin = 'right';
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * After initialized, check if the content is centered and has an origin. If so, set the
     * special position states that transition the tab from the left or right before centering.
     * @return {?}
     */
    MdTabBody.prototype.ngOnInit = function () {
        if (this._position == 'center' && this._origin) {
            this._position = this._origin == 'left' ? 'left-origin-center' : 'right-origin-center';
        }
    };
    /**
     * After the view has been set, check if the tab content is set to the center and attach the
     * content if it is not already attached.
     * @return {?}
     */
    MdTabBody.prototype.ngAfterViewChecked = function () {
        if (this._isCenterPosition(this._position) && !this._portalHost.hasAttached()) {
            this._portalHost.attach(this._content);
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    MdTabBody.prototype._onTranslateTabStarted = function (e) {
        if (this._isCenterPosition(e.toState)) {
            this.onCentering.emit(this._elementRef.nativeElement.clientHeight);
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    MdTabBody.prototype._onTranslateTabComplete = function (e) {
        // If the end state is that the tab is not centered, then detach the content.
        if (!this._isCenterPosition(e.toState) && !this._isCenterPosition(this._position)) {
            this._portalHost.detach();
        }
        // If the transition to the center is complete, emit an event.
        if (this._isCenterPosition(e.toState) && this._isCenterPosition(this._position)) {
            this.onCentered.emit();
        }
    };
    /**
     * The text direction of the containing app.
     * @return {?}
     */
    MdTabBody.prototype._getLayoutDirection = function () {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    };
    /**
     * Whether the provided position state is considered center, regardless of origin.
     * @param {?} position
     * @return {?}
     */
    MdTabBody.prototype._isCenterPosition = function (position) {
        return position == 'center' ||
            position == 'left-origin-center' ||
            position == 'right-origin-center';
    };
    return MdTabBody;
}());
MdTabBody.decorators = [
    { type: Component, args: [{ selector: 'md-tab-body, mat-tab-body',
                template: "<div class=\"mat-tab-body-content\" #content [@translateTab]=\"_position\" (@translateTab.start)=\"_onTranslateTabStarted($event)\" (@translateTab.done)=\"_onTranslateTabComplete($event)\"><ng-template cdkPortalHost></ng-template></div>",
                styles: [".mat-tab-body-content{height:100%;overflow:auto}.mat-tab-group-dynamic-height .mat-tab-body-content{overflow:hidden}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-tab-body',
                },
                animations: [
                    trigger('translateTab', [
                        state('void', style({ transform: 'translate3d(0%, 0, 0)' })),
                        state('left', style({ transform: 'translate3d(-100%, 0, 0)' })),
                        state('left-origin-center', style({ transform: 'translate3d(0%, 0, 0)' })),
                        state('right-origin-center', style({ transform: 'translate3d(0%, 0, 0)' })),
                        state('center', style({ transform: 'translate3d(0%, 0, 0)' })),
                        state('right', style({ transform: 'translate3d(100%, 0, 0)' })),
                        transition('* => left, * => right, left => center, right => center', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')),
                        transition('void => left-origin-center', [
                            style({ transform: 'translate3d(-100%, 0, 0)' }),
                            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
                        ]),
                        transition('void => right-origin-center', [
                            style({ transform: 'translate3d(100%, 0, 0)' }),
                            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
                        ])
                    ])
                ]
            },] },
];
/**
 * @nocollapse
 */
MdTabBody.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Directionality, decorators: [{ type: Optional },] },
]; };
MdTabBody.propDecorators = {
    '_portalHost': [{ type: ViewChild, args: [PortalHostDirective,] },],
    'onCentering': [{ type: Output },],
    'onCentered': [{ type: Output },],
    '_content': [{ type: Input, args: ['content',] },],
    'position': [{ type: Input, args: ['position',] },],
    'origin': [{ type: Input, args: ['origin',] },],
};
/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 */
var EXAGGERATED_OVERSCROLL = 60;
/**
 * \@docs-private
 */
var MdTabHeaderBase = (function () {
    function MdTabHeaderBase() {
    }
    return MdTabHeaderBase;
}());
var _MdTabHeaderMixinBase = mixinDisableRipple(MdTabHeaderBase);
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * \@docs-private
 */
var MdTabHeader = (function (_super) {
    tslib_1.__extends(MdTabHeader, _super);
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _changeDetectorRef
     * @param {?} _dir
     */
    function MdTabHeader(_elementRef, _renderer, _changeDetectorRef, _dir) {
        var _this = _super.call(this) || this;
        _this._elementRef = _elementRef;
        _this._renderer = _renderer;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._dir = _dir;
        /**
         * The tab index that is focused.
         */
        _this._focusIndex = 0;
        /**
         * The distance in pixels that the tab labels should be translated to the left.
         */
        _this._scrollDistance = 0;
        /**
         * Whether the header should scroll to the selected index after the view has been checked.
         */
        _this._selectedIndexChanged = false;
        /**
         * Combines listeners that will re-align the ink bar whenever they're invoked.
         */
        _this._realignInkBar = null;
        /**
         * Whether the controls for pagination should be displayed
         */
        _this._showPaginationControls = false;
        /**
         * Whether the tab list can be scrolled more towards the end of the tab label list.
         */
        _this._disableScrollAfter = true;
        /**
         * Whether the tab list can be scrolled more towards the beginning of the tab label list.
         */
        _this._disableScrollBefore = true;
        _this._selectedIndex = 0;
        /**
         * Event emitted when the option is selected.
         */
        _this.selectFocusedIndex = new EventEmitter();
        /**
         * Event emitted when a label is focused.
         */
        _this.indexFocused = new EventEmitter();
        return _this;
    }
    Object.defineProperty(MdTabHeader.prototype, "selectedIndex", {
        /**
         * The index of the active tab.
         * @return {?}
         */
        get: function () { return this._selectedIndex; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selectedIndexChanged = this._selectedIndex != value;
            this._selectedIndex = value;
            this._focusIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdTabHeader.prototype.ngAfterContentChecked = function () {
        // If the number of tab labels have changed, check if scrolling should be enabled
        if (this._tabLabelCount != this._labelWrappers.length) {
            this._updatePagination();
            this._tabLabelCount = this._labelWrappers.length;
            this._changeDetectorRef.markForCheck();
        }
        // If the selected index has changed, scroll to the label and check if the scrolling controls
        // should be disabled.
        if (this._selectedIndexChanged) {
            this._scrollToLabel(this._selectedIndex);
            this._checkScrollingControls();
            this._alignInkBarToSelectedTab();
            this._selectedIndexChanged = false;
            this._changeDetectorRef.markForCheck();
        }
        // If the scroll distance has been changed (tab selected, focused, scroll controls activated),
        // then translate the header to reflect this.
        if (this._scrollDistanceChanged) {
            this._updateTabScrollPosition();
            this._scrollDistanceChanged = false;
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdTabHeader.prototype._handleKeydown = function (event) {
        switch (event.keyCode) {
            case RIGHT_ARROW:
                this._focusNextTab();
                break;
            case LEFT_ARROW:
                this._focusPreviousTab();
                break;
            case ENTER:
            case SPACE:
                this.selectFocusedIndex.emit(this.focusIndex);
                event.preventDefault();
                break;
        }
    };
    /**
     * Aligns the ink bar to the selected tab on load.
     * @return {?}
     */
    MdTabHeader.prototype.ngAfterContentInit = function () {
        var _this = this;
        var /** @type {?} */ dirChange = this._dir ? this._dir.change : of(null);
        var /** @type {?} */ resize = typeof window !== 'undefined' ?
            auditTime.call(fromEvent(window, 'resize'), 150) :
            of(null);
        this._realignInkBar = startWith.call(merge(dirChange, resize), null).subscribe(function () {
            _this._updatePagination();
            _this._alignInkBarToSelectedTab();
        });
    };
    /**
     * @return {?}
     */
    MdTabHeader.prototype.ngOnDestroy = function () {
        if (this._realignInkBar) {
            this._realignInkBar.unsubscribe();
            this._realignInkBar = null;
        }
    };
    /**
     * Callback for when the MutationObserver detects that the content has changed.
     * @return {?}
     */
    MdTabHeader.prototype._onContentChanges = function () {
        this._updatePagination();
        this._alignInkBarToSelectedTab();
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Updating the view whether pagination should be enabled or not
     * @return {?}
     */
    MdTabHeader.prototype._updatePagination = function () {
        this._checkPaginationEnabled();
        this._checkScrollingControls();
        this._updateTabScrollPosition();
    };
    Object.defineProperty(MdTabHeader.prototype, "focusIndex", {
        /**
         * Tracks which element has focus; used for keyboard navigation
         * @return {?}
         */
        get: function () { return this._focusIndex; },
        /**
         * When the focus index is set, we must manually send focus to the correct label
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (!this._isValidIndex(value) || this._focusIndex == value) {
                return;
            }
            this._focusIndex = value;
            this.indexFocused.emit(value);
            this._setTabFocus(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     * @param {?} index
     * @return {?}
     */
    MdTabHeader.prototype._isValidIndex = function (index) {
        if (!this._labelWrappers) {
            return true;
        }
        var /** @type {?} */ tab = this._labelWrappers ? this._labelWrappers.toArray()[index] : null;
        return !!tab && !tab.disabled;
    };
    /**
     * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
     * scrolling is enabled.
     * @param {?} tabIndex
     * @return {?}
     */
    MdTabHeader.prototype._setTabFocus = function (tabIndex) {
        if (this._showPaginationControls) {
            this._scrollToLabel(tabIndex);
        }
        if (this._labelWrappers && this._labelWrappers.length) {
            this._labelWrappers.toArray()[tabIndex].focus();
            // Do not let the browser manage scrolling to focus the element, this will be handled
            // by using translation. In LTR, the scroll left should be 0. In RTL, the scroll width
            // should be the full width minus the offset width.
            var /** @type {?} */ containerEl = this._tabListContainer.nativeElement;
            var /** @type {?} */ dir = this._getLayoutDirection();
            if (dir == 'ltr') {
                containerEl.scrollLeft = 0;
            }
            else {
                containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
            }
        }
    };
    /**
     * Moves the focus towards the beginning or the end of the list depending on the offset provided.
     * Valid offsets are 1 and -1.
     * @param {?} offset
     * @return {?}
     */
    MdTabHeader.prototype._moveFocus = function (offset) {
        if (this._labelWrappers) {
            var /** @type {?} */ tabs = this._labelWrappers.toArray();
            for (var /** @type {?} */ i = this.focusIndex + offset; i < tabs.length && i >= 0; i += offset) {
                if (this._isValidIndex(i)) {
                    this.focusIndex = i;
                    return;
                }
            }
        }
    };
    /**
     * Increment the focus index by 1 until a valid tab is found.
     * @return {?}
     */
    MdTabHeader.prototype._focusNextTab = function () {
        this._moveFocus(this._getLayoutDirection() == 'ltr' ? 1 : -1);
    };
    /**
     * Decrement the focus index by 1 until a valid tab is found.
     * @return {?}
     */
    MdTabHeader.prototype._focusPreviousTab = function () {
        this._moveFocus(this._getLayoutDirection() == 'ltr' ? -1 : 1);
    };
    /**
     * The layout direction of the containing app.
     * @return {?}
     */
    MdTabHeader.prototype._getLayoutDirection = function () {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    };
    /**
     * Performs the CSS transformation on the tab list that will cause the list to scroll.
     * @return {?}
     */
    MdTabHeader.prototype._updateTabScrollPosition = function () {
        var /** @type {?} */ scrollDistance = this.scrollDistance;
        var /** @type {?} */ translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;
        this._renderer.setStyle(this._tabList.nativeElement, 'transform', "translate3d(" + translateX + "px, 0, 0)");
    };
    Object.defineProperty(MdTabHeader.prototype, "scrollDistance", {
        /**
         * @return {?}
         */
        get: function () { return this._scrollDistance; },
        /**
         * Sets the distance in pixels that the tab header should be transformed in the X-axis.
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), v));
            // Mark that the scroll distance has changed so that after the view is checked, the CSS
            // transformation can move the header.
            this._scrollDistanceChanged = true;
            this._checkScrollingControls();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
     * the end of the list, respectively). The distance to scroll is computed to be a third of the
     * length of the tab list view window.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @param {?} scrollDir
     * @return {?}
     */
    MdTabHeader.prototype._scrollHeader = function (scrollDir) {
        var /** @type {?} */ viewLength = this._tabListContainer.nativeElement.offsetWidth;
        // Move the scroll distance one-third the length of the tab list's viewport.
        this.scrollDistance += (scrollDir == 'before' ? -1 : 1) * viewLength / 3;
    };
    /**
     * Moves the tab list such that the desired tab label (marked by index) is moved into view.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @param {?} labelIndex
     * @return {?}
     */
    MdTabHeader.prototype._scrollToLabel = function (labelIndex) {
        var /** @type {?} */ selectedLabel = this._labelWrappers ? this._labelWrappers.toArray()[labelIndex] : null;
        if (!selectedLabel) {
            return;
        }
        // The view length is the visible width of the tab labels.
        var /** @type {?} */ viewLength = this._tabListContainer.nativeElement.offsetWidth;
        var /** @type {?} */ labelBeforePos, /** @type {?} */ labelAfterPos;
        if (this._getLayoutDirection() == 'ltr') {
            labelBeforePos = selectedLabel.getOffsetLeft();
            labelAfterPos = labelBeforePos + selectedLabel.getOffsetWidth();
        }
        else {
            labelAfterPos = this._tabList.nativeElement.offsetWidth - selectedLabel.getOffsetLeft();
            labelBeforePos = labelAfterPos - selectedLabel.getOffsetWidth();
        }
        var /** @type {?} */ beforeVisiblePos = this.scrollDistance;
        var /** @type {?} */ afterVisiblePos = this.scrollDistance + viewLength;
        if (labelBeforePos < beforeVisiblePos) {
            // Scroll header to move label to the before direction
            this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
        }
        else if (labelAfterPos > afterVisiblePos) {
            // Scroll header to move label to the after direction
            this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
        }
    };
    /**
     * Evaluate whether the pagination controls should be displayed. If the scroll width of the
     * tab list is wider than the size of the header container, then the pagination controls should
     * be shown.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @return {?}
     */
    MdTabHeader.prototype._checkPaginationEnabled = function () {
        var /** @type {?} */ isEnabled = this._tabList.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
        if (!isEnabled) {
            this.scrollDistance = 0;
        }
        if (isEnabled !== this._showPaginationControls) {
            this._changeDetectorRef.markForCheck();
        }
        this._showPaginationControls = isEnabled;
    };
    /**
     * Evaluate whether the before and after controls should be enabled or disabled.
     * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
     * before button. If the header is at the end of the list (scroll distance is equal to the
     * maximum distance we can scroll), then disable the after button.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @return {?}
     */
    MdTabHeader.prototype._checkScrollingControls = function () {
        // Check if the pagination arrows should be activated.
        this._disableScrollBefore = this.scrollDistance == 0;
        this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance();
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Determines what is the maximum length in pixels that can be set for the scroll distance. This
     * is equal to the difference in width between the tab list container and tab header container.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @return {?}
     */
    MdTabHeader.prototype._getMaxScrollDistance = function () {
        var /** @type {?} */ lengthOfTabList = this._tabList.nativeElement.scrollWidth;
        var /** @type {?} */ viewLength = this._tabListContainer.nativeElement.offsetWidth;
        return (lengthOfTabList - viewLength) || 0;
    };
    /**
     * Tells the ink-bar to align itself to the current label wrapper
     * @return {?}
     */
    MdTabHeader.prototype._alignInkBarToSelectedTab = function () {
        var /** @type {?} */ selectedLabelWrapper = this._labelWrappers && this._labelWrappers.length ?
            this._labelWrappers.toArray()[this.selectedIndex].elementRef.nativeElement :
            null;
        this._inkBar.alignToElement(selectedLabelWrapper);
    };
    return MdTabHeader;
}(_MdTabHeaderMixinBase));
MdTabHeader.decorators = [
    { type: Component, args: [{ selector: 'md-tab-header, mat-tab-header',
                template: "<div class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\" aria-hidden=\"true\" md-ripple [mdRippleDisabled]=\"_disableScrollBefore || disableRipple\" [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\" (click)=\"_scrollHeader('before')\"><div class=\"mat-tab-header-pagination-chevron\"></div></div><div class=\"mat-tab-label-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\"><div class=\"mat-tab-list\" #tabList role=\"tablist\" (cdkObserveContent)=\"_onContentChanges()\"><div class=\"mat-tab-labels\"><ng-content></ng-content></div><md-ink-bar></md-ink-bar></div></div><div class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\" aria-hidden=\"true\" md-ripple [mdRippleDisabled]=\"_disableScrollAfter || disableRipple\" [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\" (click)=\"_scrollHeader('after')\"><div class=\"mat-tab-header-pagination-chevron\"></div></div>",
                styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-label{height:48px;padding:0 12px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:0;opacity:1}.mat-tab-label.mat-tab-disabled{cursor:default;pointer-events:none}@media (max-width:600px){.mat-tab-label{min-width:72px}}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:.5s cubic-bezier(.35,0,.25,1)}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.mat-tab-header-pagination{position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-pagination-after,.mat-tab-header-rtl .mat-tab-header-pagination-before{padding-right:4px}.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:'';height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-list{flex-grow:1;position:relative;transition:transform .5s cubic-bezier(.35,0,.25,1)}.mat-tab-labels{display:flex}"],
                inputs: ['disableRipple'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-tab-header',
                    '[class.mat-tab-header-pagination-controls-enabled]': '_showPaginationControls',
                    '[class.mat-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
                }
            },] },
];
/**
 * @nocollapse
 */
MdTabHeader.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: ChangeDetectorRef, },
    { type: Directionality, decorators: [{ type: Optional },] },
]; };
MdTabHeader.propDecorators = {
    '_labelWrappers': [{ type: ContentChildren, args: [MdTabLabelWrapper,] },],
    '_inkBar': [{ type: ViewChild, args: [MdInkBar,] },],
    '_tabListContainer': [{ type: ViewChild, args: ['tabListContainer',] },],
    '_tabList': [{ type: ViewChild, args: ['tabList',] },],
    'selectedIndex': [{ type: Input },],
    'selectFocusedIndex': [{ type: Output },],
    'indexFocused': [{ type: Output },],
};
var MdTabsModule = (function () {
    function MdTabsModule() {
    }
    return MdTabsModule;
}());
MdTabsModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MdCommonModule,
                    PortalModule,
                    MdRippleModule,
                    ObserversModule,
                    ScrollDispatchModule,
                ],
                // Don't export all components because some are only to be used internally.
                exports: [
                    MdCommonModule,
                    MdTabGroup,
                    MdTabLabel,
                    MdTab,
                    MdTabNav,
                    MdTabLink,
                ],
                declarations: [
                    MdTabGroup,
                    MdTabLabel,
                    MdTab,
                    MdInkBar,
                    MdTabLabelWrapper,
                    MdTabNav,
                    MdTabLink,
                    MdTabBody,
                    MdTabHeader
                ],
                providers: [VIEWPORT_RULER_PROVIDER$1],
            },] },
];
/**
 * @nocollapse
 */
MdTabsModule.ctorParameters = function () { return []; };
var MdToolbarRow = (function () {
    function MdToolbarRow() {
    }
    return MdToolbarRow;
}());
MdToolbarRow.decorators = [
    { type: Directive, args: [{
                selector: 'md-toolbar-row, mat-toolbar-row',
                host: { 'class': 'mat-toolbar-row' },
            },] },
];
/**
 * @nocollapse
 */
MdToolbarRow.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var MdToolbarBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdToolbarBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdToolbarBase;
}());
var _MdToolbarMixinBase = mixinColor(MdToolbarBase);
var MdToolbar = (function (_super) {
    tslib_1.__extends(MdToolbar, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    function MdToolbar(renderer, elementRef) {
        return _super.call(this, renderer, elementRef) || this;
    }
    return MdToolbar;
}(_MdToolbarMixinBase));
MdToolbar.decorators = [
    { type: Component, args: [{ selector: 'md-toolbar, mat-toolbar',
                template: "<div class=\"mat-toolbar-layout\"><md-toolbar-row><ng-content></ng-content></md-toolbar-row><ng-content select=\"md-toolbar-row, mat-toolbar-row\"></ng-content></div>",
                styles: [".mat-toolbar{display:flex;box-sizing:border-box;width:100%;padding:0 16px;flex-direction:column}.mat-toolbar .mat-toolbar-row{display:flex;box-sizing:border-box;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar{min-height:64px}.mat-toolbar-row{height:64px}@media (max-width:600px){.mat-toolbar{min-height:56px}.mat-toolbar-row{height:56px}}"],
                inputs: ['color'],
                host: {
                    'class': 'mat-toolbar',
                    'role': 'toolbar'
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            },] },
];
/**
 * @nocollapse
 */
MdToolbar.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
var MdToolbarModule = (function () {
    function MdToolbarModule() {
    }
    return MdToolbarModule;
}());
MdToolbarModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule],
                exports: [MdToolbar, MdToolbarRow, MdCommonModule],
                declarations: [MdToolbar, MdToolbarRow],
            },] },
];
/**
 * @nocollapse
 */
MdToolbarModule.ctorParameters = function () { return []; };
/**
 * Time in ms to delay before changing the tooltip visibility to hidden
 */
var TOUCHEND_HIDE_DELAY = 1500;
/**
 * Time in ms to throttle repositioning after scroll events.
 */
var SCROLL_THROTTLE_MS = 20;
/**
 * CSS class that will be attached to the overlay panel.
 */
var TOOLTIP_PANEL_CLASS = 'mat-tooltip-panel';
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @param {?} position
 * @return {?}
 */
function getMdTooltipInvalidPositionError(position) {
    return Error("Tooltip position \"" + position + "\" is invalid.");
}
/**
 * Injection token that determines the scroll handling while a tooltip is visible.
 */
var MD_TOOLTIP_SCROLL_STRATEGY = new InjectionToken('md-tooltip-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS }); };
}
/**
 * \@docs-private
 */
var MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER = {
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
var MdTooltip = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _elementRef
     * @param {?} _scrollDispatcher
     * @param {?} _viewContainerRef
     * @param {?} _ngZone
     * @param {?} _renderer
     * @param {?} _platform
     * @param {?} _scrollStrategy
     * @param {?} _dir
     */
    function MdTooltip(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _renderer, _platform, _scrollStrategy, _dir) {
        var _this = this;
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._scrollDispatcher = _scrollDispatcher;
        this._viewContainerRef = _viewContainerRef;
        this._ngZone = _ngZone;
        this._renderer = _renderer;
        this._platform = _platform;
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
        // The mouse events shouldn't be bound on iOS devices, because
        // they can prevent the first tap from firing its click event.
        if (!_platform.IOS) {
            this._enterListener =
                _renderer.listen(_elementRef.nativeElement, 'mouseenter', function () { return _this.show(); });
            this._leaveListener =
                _renderer.listen(_elementRef.nativeElement, 'mouseleave', function () { return _this.hide(); });
        }
    }
    Object.defineProperty(MdTooltip.prototype, "position", {
        /**
         * Allows the user to define the position of the tooltip relative to the parent element
         * @return {?}
         */
        get: function () { return this._position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== this._position) {
                this._position = value;
                // TODO(andrewjs): When the overlay's position can be dynamically changed, do not destroy
                // the tooltip.
                if (this._tooltipInstance) {
                    this._disposeTooltip();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "disabled", {
        /**
         * Disables the display of the tooltip.
         * @return {?}
         */
        get: function () { return this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
            // If tooltip is disabled, hide immediately.
            if (this._disabled) {
                this.hide(0);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_positionDeprecated", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this._position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "message", {
        /**
         * The message to be displayed in the tooltip
         * @return {?}
         */
        get: function () { return this._message; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._message = value;
            this._setTooltipMessage(this._message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "tooltipClass", {
        /**
         * Classes to be passed to the tooltip. Supports the same syntax as `ngClass`.
         * @return {?}
         */
        get: function () { return this._tooltipClass; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._tooltipClass = value;
            if (this._tooltipInstance) {
                this._setTooltipClass(this._tooltipClass);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_deprecatedMessage", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this.message; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.message = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matMessage", {
        /**
         * @return {?}
         */
        get: function () { return this.message; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.message = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matPosition", {
        /**
         * @return {?}
         */
        get: function () { return this.position; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.position = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matDisabled", {
        /**
         * @return {?}
         */
        get: function () { return this.disabled; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.disabled = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matHideDelay", {
        /**
         * @return {?}
         */
        get: function () { return this.hideDelay; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.hideDelay = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matShowDelay", {
        /**
         * @return {?}
         */
        get: function () { return this.showDelay; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.showDelay = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_matClass", {
        /**
         * @return {?}
         */
        get: function () { return this.tooltipClass; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.tooltipClass = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose the tooltip when destroyed.
     * @return {?}
     */
    MdTooltip.prototype.ngOnDestroy = function () {
        if (this._tooltipInstance) {
            this._disposeTooltip();
        }
        // Clean up the event listeners set in the constructor
        if (!this._platform.IOS) {
            this._enterListener();
            this._leaveListener();
        }
    };
    /**
     * Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    MdTooltip.prototype.show = function (delay) {
        if (delay === void 0) { delay = this.showDelay; }
        if (this.disabled || !this._message || !this._message.trim()) {
            return;
        }
        if (!this._tooltipInstance) {
            this._createTooltip();
        }
        this._setTooltipClass(this._tooltipClass);
        this._setTooltipMessage(this._message); /** @type {?} */
        ((this._tooltipInstance)).show(this._position, delay);
    };
    /**
     * Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input
     * @param {?=} delay
     * @return {?}
     */
    MdTooltip.prototype.hide = function (delay) {
        if (delay === void 0) { delay = this.hideDelay; }
        if (this._tooltipInstance) {
            this._tooltipInstance.hide(delay);
        }
    };
    /**
     * Shows/hides the tooltip
     * @return {?}
     */
    MdTooltip.prototype.toggle = function () {
        this._isTooltipVisible() ? this.hide() : this.show();
    };
    /**
     * Returns true if the tooltip is currently visible to the user
     * @return {?}
     */
    MdTooltip.prototype._isTooltipVisible = function () {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible();
    };
    /**
     * Create the tooltip to display
     * @return {?}
     */
    MdTooltip.prototype._createTooltip = function () {
        var _this = this;
        var /** @type {?} */ overlayRef = this._createOverlay();
        var /** @type {?} */ portal = new ComponentPortal(TooltipComponent, this._viewContainerRef);
        this._tooltipInstance = overlayRef.attach(portal).instance; /** @type {?} */
        ((
        // Dispose the overlay when finished the shown tooltip.
        this._tooltipInstance)).afterHidden().subscribe(function () {
            // Check first if the tooltip has already been removed through this components destroy.
            if (_this._tooltipInstance) {
                _this._disposeTooltip();
            }
        });
    };
    /**
     * Create the overlay config and position strategy
     * @return {?}
     */
    MdTooltip.prototype._createOverlay = function () {
        var _this = this;
        var /** @type {?} */ origin = this._getOrigin();
        var /** @type {?} */ position = this._getOverlayPosition();
        // Create connected position strategy that listens for scroll events to reposition.
        // After position changes occur and the overlay is clipped by a parent scrollable then
        // close the tooltip.
        var /** @type {?} */ strategy = this._overlay.position().connectedTo(this._elementRef, origin, position);
        strategy.withScrollableContainers(this._scrollDispatcher.getScrollContainers(this._elementRef));
        strategy.onPositionChange.subscribe(function (change) {
            if (change.scrollableViewProperties.isOverlayClipped &&
                _this._tooltipInstance && _this._tooltipInstance.isVisible()) {
                _this.hide(0);
            }
        });
        var /** @type {?} */ config = new OverlayState();
        config.direction = this._dir ? this._dir.value : 'ltr';
        config.positionStrategy = strategy;
        config.panelClass = TOOLTIP_PANEL_CLASS;
        config.scrollStrategy = this._scrollStrategy();
        this._overlayRef = this._overlay.create(config);
        return this._overlayRef;
    };
    /**
     * Disposes the current tooltip and the overlay it is attached to
     * @return {?}
     */
    MdTooltip.prototype._disposeTooltip = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._tooltipInstance = null;
    };
    /**
     * Returns the origin position based on the user's position preference
     * @return {?}
     */
    MdTooltip.prototype._getOrigin = function () {
        if (this.position == 'above' || this.position == 'below') {
            return { originX: 'center', originY: this.position == 'above' ? 'top' : 'bottom' };
        }
        var /** @type {?} */ isDirectionLtr = !this._dir || this._dir.value == 'ltr';
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
    };
    /**
     * Returns the overlay position based on the user's preference
     * @return {?}
     */
    MdTooltip.prototype._getOverlayPosition = function () {
        if (this.position == 'above') {
            return { overlayX: 'center', overlayY: 'bottom' };
        }
        if (this.position == 'below') {
            return { overlayX: 'center', overlayY: 'top' };
        }
        var /** @type {?} */ isLtr = !this._dir || this._dir.value == 'ltr';
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
    };
    /**
     * Updates the tooltip message and repositions the overlay according to the new message length
     * @param {?} message
     * @return {?}
     */
    MdTooltip.prototype._setTooltipMessage = function (message) {
        var _this = this;
        // Must wait for the message to be painted to the tooltip so that the overlay can properly
        // calculate the correct positioning based on the size of the text.
        if (this._tooltipInstance) {
            this._tooltipInstance.message = message;
            this._tooltipInstance._markForCheck();
            first.call(this._ngZone.onMicrotaskEmpty).subscribe(function () {
                if (_this._tooltipInstance) {
                    ((_this._overlayRef)).updatePosition();
                }
            });
        }
    };
    /**
     * Updates the tooltip class
     * @param {?} tooltipClass
     * @return {?}
     */
    MdTooltip.prototype._setTooltipClass = function (tooltipClass) {
        if (this._tooltipInstance) {
            this._tooltipInstance.tooltipClass = tooltipClass;
            this._tooltipInstance._markForCheck();
        }
    };
    return MdTooltip;
}());
MdTooltip.decorators = [
    { type: Directive, args: [{
                selector: '[md-tooltip], [mdTooltip], [mat-tooltip], [matTooltip]',
                host: {
                    '(longpress)': 'show()',
                    '(touchend)': 'hide(' + TOUCHEND_HIDE_DELAY + ')',
                },
                exportAs: 'mdTooltip',
            },] },
];
/**
 * @nocollapse
 */
MdTooltip.ctorParameters = function () { return [
    { type: Overlay, },
    { type: ElementRef, },
    { type: ScrollDispatcher$1, },
    { type: ViewContainerRef, },
    { type: NgZone, },
    { type: Renderer2, },
    { type: Platform, },
    { type: undefined, decorators: [{ type: Inject, args: [MD_TOOLTIP_SCROLL_STRATEGY,] },] },
    { type: Directionality, decorators: [{ type: Optional },] },
]; };
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
var TooltipComponent = (function () {
    /**
     * @param {?} _dir
     * @param {?} _changeDetectorRef
     */
    function TooltipComponent(_dir, _changeDetectorRef) {
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
    TooltipComponent.prototype.show = function (position, delay) {
        var _this = this;
        // Cancel the delayed hide if it is scheduled
        if (this._hideTimeoutId) {
            clearTimeout(this._hideTimeoutId);
        }
        // Body interactions should cancel the tooltip if there is a delay in showing.
        this._closeOnInteraction = true;
        this._setTransformOrigin(position);
        this._showTimeoutId = setTimeout(function () {
            _this._visibility = 'visible';
            // If this was set to true immediately, then a body click that triggers show() would
            // trigger interaction and close the tooltip right after it was displayed.
            _this._closeOnInteraction = false;
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            _this._markForCheck();
            setTimeout(function () { return _this._closeOnInteraction = true; }, 0);
        }, delay);
    };
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param {?} delay Amount of milliseconds to delay showing the tooltip.
     * @return {?}
     */
    TooltipComponent.prototype.hide = function (delay) {
        var _this = this;
        // Cancel the delayed show if it is scheduled
        if (this._showTimeoutId) {
            clearTimeout(this._showTimeoutId);
        }
        this._hideTimeoutId = setTimeout(function () {
            _this._visibility = 'hidden';
            _this._closeOnInteraction = false;
            // Mark for check so if any parent component has set the
            // ChangeDetectionStrategy to OnPush it will be checked anyways
            _this._markForCheck();
        }, delay);
    };
    /**
     * Returns an observable that notifies when the tooltip has been hidden from view
     * @return {?}
     */
    TooltipComponent.prototype.afterHidden = function () {
        return this._onHide.asObservable();
    };
    /**
     * Whether the tooltip is being displayed
     * @return {?}
     */
    TooltipComponent.prototype.isVisible = function () {
        return this._visibility === 'visible';
    };
    /**
     * Sets the tooltip transform origin according to the tooltip position
     * @param {?} value
     * @return {?}
     */
    TooltipComponent.prototype._setTransformOrigin = function (value) {
        var /** @type {?} */ isLtr = !this._dir || this._dir.value == 'ltr';
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
    };
    /**
     * @param {?} e
     * @return {?}
     */
    TooltipComponent.prototype._afterVisibilityAnimation = function (e) {
        if (e.toState === 'hidden' && !this.isVisible()) {
            this._onHide.next();
        }
    };
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.google.com/components/tooltips.html#tooltips-interaction
     * @return {?}
     */
    TooltipComponent.prototype._handleBodyInteraction = function () {
        if (this._closeOnInteraction) {
            this.hide(0);
        }
    };
    /**
     * Marks that the tooltip needs to be checked in the next change detection run.
     * Mainly used for rendering the initial text before positioning a tooltip, which
     * can be problematic in components with OnPush change detection.
     * @return {?}
     */
    TooltipComponent.prototype._markForCheck = function () {
        this._changeDetectorRef.markForCheck();
    };
    return TooltipComponent;
}());
TooltipComponent.decorators = [
    { type: Component, args: [{ selector: 'md-tooltip-component, mat-tooltip-component',
                template: "<div class=\"mat-tooltip\" [ngClass]=\"tooltipClass\" [style.transform-origin]=\"_transformOrigin\" [@state]=\"_visibility\" (@state.done)=\"_afterVisibilityAnimation($event)\">{{message}}</div>",
                styles: [".mat-tooltip-panel{pointer-events:none!important}.mat-tooltip{color:#fff;border-radius:2px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px}@media screen and (-ms-high-contrast:active){.mat-tooltip{outline:solid 1px}}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('state', [
                        state('void', style({ transform: 'scale(0)' })),
                        state('initial', style({ transform: 'scale(0)' })),
                        state('visible', style({ transform: 'scale(1)' })),
                        state('hidden', style({ transform: 'scale(0)' })),
                        transition('* => visible', animate('150ms cubic-bezier(0.0, 0.0, 0.2, 1)')),
                        transition('* => hidden', animate('150ms cubic-bezier(0.4, 0.0, 1, 1)')),
                    ])
                ],
                host: {
                    // Forces the element to have a layout in IE and Edge. This fixes issues where the element
                    // won't be rendered if the animations are disabled or there is no web animations polyfill.
                    '[style.zoom]': '_visibility === "visible" ? 1 : null',
                    '(body:click)': 'this._handleBodyInteraction()'
                }
            },] },
];
/**
 * @nocollapse
 */
TooltipComponent.ctorParameters = function () { return [
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
]; };
var MdTooltipModule = (function () {
    function MdTooltipModule() {
    }
    return MdTooltipModule;
}());
MdTooltipModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    OverlayModule,
                    MdCommonModule,
                    PlatformModule
                ],
                exports: [MdTooltip, TooltipComponent, MdCommonModule],
                declarations: [MdTooltip, TooltipComponent],
                entryComponents: [TooltipComponent],
                providers: [MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
MdTooltipModule.ctorParameters = function () { return []; };
/**
 * Throws an exception for the case when menu trigger doesn't have a valid md-menu instance
 * \@docs-private
 * @return {?}
 */
function throwMdMenuMissingError() {
    throw Error("md-menu-trigger: must pass in an md-menu instance.\n\n    Example:\n      <md-menu #menu=\"mdMenu\"></md-menu>\n      <button [mdMenuTriggerFor]=\"menu\"></button>");
}
/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * \@docs-private
 * @return {?}
 */
function throwMdMenuInvalidPositionX() {
    throw Error("x-position value must be either 'before' or after'.\n      Example: <md-menu x-position=\"before\" #menu=\"mdMenu\"></md-menu>");
}
/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * \@docs-private
 * @return {?}
 */
function throwMdMenuInvalidPositionY() {
    throw Error("y-position value must be either 'above' or below'.\n      Example: <md-menu y-position=\"above\" #menu=\"mdMenu\"></md-menu>");
}
/**
 * \@docs-private
 */
var MdMenuItemBase = (function () {
    function MdMenuItemBase() {
    }
    return MdMenuItemBase;
}());
var _MdMenuItemMixinBase = mixinDisabled(MdMenuItemBase);
/**
 * This directive is intended to be used inside an md-menu tag.
 * It exists mostly to set the role attribute.
 */
var MdMenuItem = (function (_super) {
    tslib_1.__extends(MdMenuItem, _super);
    /**
     * @param {?} _elementRef
     */
    function MdMenuItem(_elementRef) {
        var _this = _super.call(this) || this;
        _this._elementRef = _elementRef;
        /**
         * Stream that emits when the menu item is hovered.
         */
        _this.hover = new Subject();
        /**
         * Whether the menu item is highlighted.
         */
        _this._highlighted = false;
        /**
         * Whether the menu item acts as a trigger for a sub-menu.
         */
        _this._triggersSubmenu = false;
        return _this;
    }
    /**
     * Focuses the menu item.
     * @return {?}
     */
    MdMenuItem.prototype.focus = function () {
        this._getHostElement().focus();
    };
    /**
     * @return {?}
     */
    MdMenuItem.prototype.ngOnDestroy = function () {
        this.hover.complete();
    };
    /**
     * Used to set the `tabindex`.
     * @return {?}
     */
    MdMenuItem.prototype._getTabIndex = function () {
        return this.disabled ? '-1' : '0';
    };
    /**
     * Returns the host DOM element.
     * @return {?}
     */
    MdMenuItem.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    /**
     * Prevents the default element actions if it is disabled.
     * @param {?} event
     * @return {?}
     */
    MdMenuItem.prototype._checkDisabled = function (event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    /**
     * Emits to the hover stream.
     * @return {?}
     */
    MdMenuItem.prototype._emitHoverEvent = function () {
        if (!this.disabled) {
            this.hover.next(this);
        }
    };
    return MdMenuItem;
}(_MdMenuItemMixinBase));
MdMenuItem.decorators = [
    { type: Component, args: [{ selector: '[md-menu-item], [mat-menu-item]',
                inputs: ['disabled'],
                host: {
                    'role': 'menuitem',
                    'class': 'mat-menu-item',
                    '[class.mat-menu-item-highlighted]': '_highlighted',
                    '[class.mat-menu-item-submenu-trigger]': '_triggersSubmenu',
                    '[attr.tabindex]': '_getTabIndex()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.disabled]': 'disabled || null',
                    '(click)': '_checkDisabled($event)',
                    '(mouseenter)': '_emitHoverEvent()',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: "<ng-content></ng-content><div class=\"mat-menu-ripple\" *ngIf=\"!disabled\" md-ripple [mdRippleTrigger]=\"_getHostElement()\"></div>",
                exportAs: 'mdMenuItem',
            },] },
];
/**
 * @nocollapse
 */
MdMenuItem.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
/**
 * Below are all the animations for the md-menu component.
 * Animation duration and timing values are based on:
 * https://material.io/guidelines/components/menus.html#menus-usage
 */
/**
 * This animation controls the menu panel's entry and exit from the page.
 *
 * When the menu panel is added to the DOM, it scales in and fades in its border.
 *
 * When the menu panel is removed from the DOM, it simply fades out after a brief
 * delay to display the ripple.
 */
// TODO(kara): switch to :enter and :leave once Mobile Safari is sorted out.
var transformMenu = trigger('transformMenu', [
    state('void', style({
        opacity: 0,
        // This starts off from 0.01, instead of 0, because there's an issue in the Angular animations
        // as of 4.2, which causes the animation to be skipped if it starts from 0.
        transform: 'scale(0.01, 0.01)'
    })),
    state('enter-start', style({
        opacity: 1,
        transform: 'scale(1, 0.5)'
    })),
    state('enter', style({
        transform: 'scale(1, 1)'
    })),
    transition('void => enter-start', animate('100ms linear')),
    transition('enter-start => enter', animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    transition('* => void', animate('150ms 50ms linear', style({ opacity: 0 })))
]);
/**
 * This animation fades in the background color and content of the menu panel
 * after its containing element is scaled in.
 */
var fadeInItems = trigger('fadeInItems', [
    state('showing', style({ opacity: 1 })),
    transition('void => *', [
        style({ opacity: 0 }),
        animate('400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)')
    ])
]);
/**
 * Injection token to be used to override the default options for `md-menu`.
 */
var MD_MENU_DEFAULT_OPTIONS = new InjectionToken('md-menu-default-options');
/**
 * Start elevation for the menu panel.
 * \@docs-private
 */
var MD_MENU_BASE_ELEVATION = 2;
var MdMenu = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _defaultOptions
     */
    function MdMenu(_elementRef, _defaultOptions) {
        this._elementRef = _elementRef;
        this._defaultOptions = _defaultOptions;
        this._xPosition = this._defaultOptions.xPosition;
        this._yPosition = this._defaultOptions.yPosition;
        /**
         * Config object to be passed into the menu's ngClass
         */
        this._classList = {};
        /**
         * Current state of the panel animation.
         */
        this._panelAnimationState = 'void';
        /**
         * Whether the menu should overlap its trigger.
         */
        this.overlapTrigger = this._defaultOptions.overlapTrigger;
        /**
         * Event emitted when the menu is closed.
         */
        this.close = new EventEmitter();
    }
    Object.defineProperty(MdMenu.prototype, "xPosition", {
        /**
         * Position of the menu in the X axis.
         * @return {?}
         */
        get: function () { return this._xPosition; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== 'before' && value !== 'after') {
                throwMdMenuInvalidPositionX();
            }
            this._xPosition = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenu.prototype, "yPosition", {
        /**
         * Position of the menu in the Y axis.
         * @return {?}
         */
        get: function () { return this._yPosition; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== 'above' && value !== 'below') {
                throwMdMenuInvalidPositionY();
            }
            this._yPosition = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenu.prototype, "classList", {
        /**
         * This method takes classes set on the host md-menu element and applies them on the
         * menu template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing menu from outside the component.
         * @param {?} classes list of class names
         * @return {?}
         */
        set: function (classes) {
            if (classes && classes.length) {
                this._classList = classes.split(' ').reduce(function (obj, className) {
                    obj[className] = true;
                    return obj;
                }, {});
                this._elementRef.nativeElement.className = '';
                this.setPositionClasses();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdMenu.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.items).withWrap();
        this._tabSubscription = this._keyManager.tabOut.subscribe(function () { return _this.close.emit('keydown'); });
    };
    /**
     * @return {?}
     */
    MdMenu.prototype.ngOnDestroy = function () {
        if (this._tabSubscription) {
            this._tabSubscription.unsubscribe();
        }
        this.close.emit();
        this.close.complete();
    };
    /**
     * Stream that emits whenever the hovered menu item changes.
     * @return {?}
     */
    MdMenu.prototype.hover = function () {
        return merge.apply(void 0, this.items.map(function (item) { return item.hover; }));
    };
    /**
     * Handle a keyboard event from the menu, delegating to the appropriate action.
     * @param {?} event
     * @return {?}
     */
    MdMenu.prototype._handleKeydown = function (event) {
        switch (event.keyCode) {
            case ESCAPE:
                this.close.emit('keydown');
                event.stopPropagation();
                break;
            case LEFT_ARROW:
                if (this.parentMenu && this.direction === 'ltr') {
                    this.close.emit('keydown');
                }
                break;
            case RIGHT_ARROW:
                if (this.parentMenu && this.direction === 'rtl') {
                    this.close.emit('keydown');
                }
                break;
            default:
                this._keyManager.onKeydown(event);
        }
    };
    /**
     * Focus the first item in the menu. This method is used by the menu trigger
     * to focus the first item when the menu is opened by the ENTER key.
     * @return {?}
     */
    MdMenu.prototype.focusFirstItem = function () {
        this._keyManager.setFirstItemActive();
    };
    /**
     * It's necessary to set position-based classes to ensure the menu panel animation
     * folds out from the correct direction.
     * @param {?=} posX
     * @param {?=} posY
     * @return {?}
     */
    MdMenu.prototype.setPositionClasses = function (posX, posY) {
        if (posX === void 0) { posX = this.xPosition; }
        if (posY === void 0) { posY = this.yPosition; }
        this._classList['mat-menu-before'] = posX === 'before';
        this._classList['mat-menu-after'] = posX === 'after';
        this._classList['mat-menu-above'] = posY === 'above';
        this._classList['mat-menu-below'] = posY === 'below';
    };
    /**
     * Sets the menu panel elevation.
     * @param {?} depth Number of parent menus that come before the menu.
     * @return {?}
     */
    MdMenu.prototype.setElevation = function (depth) {
        // The elevation starts at the base and increases by one for each level.
        var /** @type {?} */ newElevation = "mat-elevation-z" + (MD_MENU_BASE_ELEVATION + depth);
        var /** @type {?} */ customElevation = Object.keys(this._classList).find(function (c) { return c.startsWith('mat-elevation-z'); });
        if (!customElevation || customElevation === this._previousElevation) {
            if (this._previousElevation) {
                this._classList[this._previousElevation] = false;
            }
            this._classList[newElevation] = true;
            this._previousElevation = newElevation;
        }
    };
    /**
     * Starts the enter animation.
     * @return {?}
     */
    MdMenu.prototype._startAnimation = function () {
        this._panelAnimationState = 'enter-start';
    };
    /**
     * Resets the panel animation to its initial state.
     * @return {?}
     */
    MdMenu.prototype._resetAnimation = function () {
        this._panelAnimationState = 'void';
    };
    /**
     * Callback that is invoked when the panel animation completes.
     * @param {?} event
     * @return {?}
     */
    MdMenu.prototype._onAnimationDone = function (event) {
        // After the initial expansion is done, trigger the second phase of the enter animation.
        if (event.toState === 'enter-start') {
            this._panelAnimationState = 'enter';
        }
    };
    return MdMenu;
}());
MdMenu.decorators = [
    { type: Component, args: [{ selector: 'md-menu, mat-menu',
                template: "<ng-template><div class=\"mat-menu-panel\" [ngClass]=\"_classList\" (keydown)=\"_handleKeydown($event)\" (click)=\"close.emit('click')\" [@transformMenu]=\"_panelAnimationState\" (@transformMenu.done)=\"_onAnimationDone($event)\" role=\"menu\"><div class=\"mat-menu-content\" [@fadeInItems]=\"'showing'\"><ng-content></ng-content></div></div></ng-template>",
                styles: [".mat-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(100vh - 48px);border-radius:2px}.mat-menu-panel:not([class*=mat-elevation-z]){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.mat-menu-panel.mat-menu-after.mat-menu-below{transform-origin:left top}.mat-menu-panel.mat-menu-after.mat-menu-above{transform-origin:left bottom}.mat-menu-panel.mat-menu-before.mat-menu-below{transform-origin:right top}.mat-menu-panel.mat-menu-before.mat-menu-above{transform-origin:right bottom}[dir=rtl] .mat-menu-panel.mat-menu-after.mat-menu-below{transform-origin:right top}[dir=rtl] .mat-menu-panel.mat-menu-after.mat-menu-above{transform-origin:right bottom}[dir=rtl] .mat-menu-panel.mat-menu-before.mat-menu-below{transform-origin:left top}[dir=rtl] .mat-menu-panel.mat-menu-before.mat-menu-above{transform-origin:left bottom}.mat-menu-panel.ng-animating{pointer-events:none}@media screen and (-ms-high-contrast:active){.mat-menu-panel{outline:solid 1px}}.mat-menu-content{padding-top:8px;padding-bottom:8px}.mat-menu-item{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;position:relative}.mat-menu-item[disabled]{cursor:default}[dir=rtl] .mat-menu-item{text-align:right}.mat-menu-item .mat-icon{margin-right:16px}[dir=rtl] .mat-menu-item .mat-icon{margin-left:16px;margin-right:0}.mat-menu-item .mat-icon{vertical-align:middle}.mat-menu-item-submenu-trigger{padding-right:32px}.mat-menu-item-submenu-trigger::after{width:0;height:0;border-style:solid;border-width:5px 0 5px 5px;border-color:transparent transparent transparent currentColor;content:'';display:inline-block;position:absolute;top:50%;right:16px;transform:translateY(-50%)}[dir=rtl] .mat-menu-item-submenu-trigger{padding-right:8px;padding-left:32px}[dir=rtl] .mat-menu-item-submenu-trigger::after{right:auto;left:16px;transform:rotateY(180deg) translateY(-50%)}button.mat-menu-item{width:100%}.mat-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute}"],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                animations: [
                    transformMenu,
                    fadeInItems
                ],
                exportAs: 'mdMenu'
            },] },
];
/**
 * @nocollapse
 */
MdMenu.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: undefined, decorators: [{ type: Inject, args: [MD_MENU_DEFAULT_OPTIONS,] },] },
]; };
MdMenu.propDecorators = {
    'xPosition': [{ type: Input },],
    'yPosition': [{ type: Input },],
    'templateRef': [{ type: ViewChild, args: [TemplateRef,] },],
    'items': [{ type: ContentChildren, args: [MdMenuItem,] },],
    'overlapTrigger': [{ type: Input },],
    'classList': [{ type: Input, args: ['class',] },],
    'close': [{ type: Output },],
};
/**
 * Injection token that determines the scroll handling while the menu is open.
 */
var MD_MENU_SCROLL_STRATEGY = new InjectionToken('md-menu-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MD_MENU_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition(); };
}
/**
 * \@docs-private
 */
var MD_MENU_SCROLL_STRATEGY_PROVIDER = {
    provide: MD_MENU_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MD_MENU_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Default top padding of the menu panel.
 */
var MENU_PANEL_TOP_PADDING = 8;
/**
 * This directive is intended to be used in conjunction with an md-menu tag.  It is
 * responsible for toggling the display of the provided menu instance.
 */
var MdMenuTrigger = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _element
     * @param {?} _viewContainerRef
     * @param {?} _scrollStrategy
     * @param {?} _parentMenu
     * @param {?} _menuItemInstance
     * @param {?} _dir
     */
    function MdMenuTrigger(_overlay, _element, _viewContainerRef, _scrollStrategy, _parentMenu, _menuItemInstance, _dir) {
        this._overlay = _overlay;
        this._element = _element;
        this._viewContainerRef = _viewContainerRef;
        this._scrollStrategy = _scrollStrategy;
        this._parentMenu = _parentMenu;
        this._menuItemInstance = _menuItemInstance;
        this._dir = _dir;
        this._overlayRef = null;
        this._menuOpen = false;
        this._openedByMouse = false;
        /**
         * Event emitted when the associated menu is opened.
         */
        this.onMenuOpen = new EventEmitter();
        /**
         * Event emitted when the associated menu is closed.
         */
        this.onMenuClose = new EventEmitter();
        if (_menuItemInstance) {
            _menuItemInstance._triggersSubmenu = this.triggersSubmenu();
        }
    }
    Object.defineProperty(MdMenuTrigger.prototype, "_deprecatedMdMenuTriggerFor", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () {
            return this.menu;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.menu = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenuTrigger.prototype, "_deprecatedMatMenuTriggerFor", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () {
            return this.menu;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.menu = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenuTrigger.prototype, "_matMenuTriggerFor", {
        /**
         * @return {?}
         */
        get: function () {
            return this.menu;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.menu = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdMenuTrigger.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._checkMenu();
        this.menu.close.subscribe(function (reason) {
            _this.closeMenu();
            // If a click closed the menu, we should close the entire chain of nested menus.
            if (reason === 'click' && _this._parentMenu) {
                _this._parentMenu.close.emit(reason);
            }
        });
        if (this.triggersSubmenu()) {
            // Subscribe to changes in the hovered item in order to toggle the panel.
            this._hoverSubscription = filter
                .call(this._parentMenu.hover(), function (active) { return active === _this._menuItemInstance; })
                .subscribe(function () {
                _this._openedByMouse = true;
                _this.openMenu();
            });
        }
    };
    /**
     * @return {?}
     */
    MdMenuTrigger.prototype.ngOnDestroy = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._cleanUpSubscriptions();
    };
    Object.defineProperty(MdMenuTrigger.prototype, "menuOpen", {
        /**
         * Whether the menu is open.
         * @return {?}
         */
        get: function () {
            return this._menuOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenuTrigger.prototype, "dir", {
        /**
         * The text direction of the containing app.
         * @return {?}
         */
        get: function () {
            return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Whether the menu triggers a sub-menu or a top-level one.
     * @return {?}
     */
    MdMenuTrigger.prototype.triggersSubmenu = function () {
        return !!(this._menuItemInstance && this._parentMenu);
    };
    /**
     * Toggles the menu between the open and closed states.
     * @return {?}
     */
    MdMenuTrigger.prototype.toggleMenu = function () {
        return this._menuOpen ? this.closeMenu() : this.openMenu();
    };
    /**
     * Opens the menu.
     * @return {?}
     */
    MdMenuTrigger.prototype.openMenu = function () {
        var _this = this;
        if (!this._menuOpen) {
            this._createOverlay().attach(this._portal);
            this._closeSubscription = this._menuClosingActions().subscribe(function () { return _this.menu.close.emit(); });
            this._initMenu();
            if (this.menu instanceof MdMenu) {
                this.menu._startAnimation();
            }
        }
    };
    /**
     * Closes the menu.
     * @return {?}
     */
    MdMenuTrigger.prototype.closeMenu = function () {
        if (this._overlayRef && this.menuOpen) {
            this._resetMenu();
            this._overlayRef.detach();
            this._closeSubscription.unsubscribe();
            this.menu.close.emit();
            if (this.menu instanceof MdMenu) {
                this.menu._resetAnimation();
            }
        }
    };
    /**
     * Focuses the menu trigger.
     * @return {?}
     */
    MdMenuTrigger.prototype.focus = function () {
        this._element.nativeElement.focus();
    };
    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     * @return {?}
     */
    MdMenuTrigger.prototype._initMenu = function () {
        this.menu.parentMenu = this.triggersSubmenu() ? this._parentMenu : undefined;
        this.menu.direction = this.dir;
        this._setMenuElevation();
        this._setIsMenuOpen(true);
        // Should only set focus if opened via the keyboard, so keyboard users can
        // can easily navigate menu items. According to spec, mouse users should not
        // see the focus style.
        if (!this._openedByMouse) {
            this.menu.focusFirstItem();
        }
    };
    /**
     * Updates the menu elevation based on the amount of parent menus that it has.
     * @return {?}
     */
    MdMenuTrigger.prototype._setMenuElevation = function () {
        if (this.menu.setElevation) {
            var /** @type {?} */ depth = 0;
            var /** @type {?} */ parentMenu = this.menu.parentMenu;
            while (parentMenu) {
                depth++;
                parentMenu = parentMenu.parentMenu;
            }
            this.menu.setElevation(depth);
        }
    };
    /**
     * This method resets the menu when it's closed, most importantly restoring
     * focus to the menu trigger if the menu was opened via the keyboard.
     * @return {?}
     */
    MdMenuTrigger.prototype._resetMenu = function () {
        this._setIsMenuOpen(false);
        // Focus only needs to be reset to the host element if the menu was opened
        // by the keyboard and manually shifted to the first menu item.
        if (!this._openedByMouse) {
            this.focus();
        }
        this._openedByMouse = false;
    };
    /**
     * @param {?} isOpen
     * @return {?}
     */
    MdMenuTrigger.prototype._setIsMenuOpen = function (isOpen) {
        this._menuOpen = isOpen;
        this._menuOpen ? this.onMenuOpen.emit() : this.onMenuClose.emit();
        if (this.triggersSubmenu()) {
            this._menuItemInstance._highlighted = isOpen;
        }
    };
    /**
     * This method checks that a valid instance of MdMenu has been passed into
     * mdMenuTriggerFor. If not, an exception is thrown.
     * @return {?}
     */
    MdMenuTrigger.prototype._checkMenu = function () {
        if (!this.menu) {
            throwMdMenuMissingError();
        }
    };
    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     * @return {?}
     */
    MdMenuTrigger.prototype._createOverlay = function () {
        if (!this._overlayRef) {
            this._portal = new TemplatePortal(this.menu.templateRef, this._viewContainerRef);
            var /** @type {?} */ config = this._getOverlayConfig();
            this._subscribeToPositions(/** @type {?} */ (config.positionStrategy));
            this._overlayRef = this._overlay.create(config);
        }
        return this._overlayRef;
    };
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @return {?} OverlayState
     */
    MdMenuTrigger.prototype._getOverlayConfig = function () {
        var /** @type {?} */ overlayState = new OverlayState();
        overlayState.positionStrategy = this._getPosition();
        overlayState.hasBackdrop = !this.triggersSubmenu();
        overlayState.backdropClass = 'cdk-overlay-transparent-backdrop';
        overlayState.direction = this.dir;
        overlayState.scrollStrategy = this._scrollStrategy();
        return overlayState;
    };
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     * @param {?} position
     * @return {?}
     */
    MdMenuTrigger.prototype._subscribeToPositions = function (position) {
        var _this = this;
        this._positionSubscription = position.onPositionChange.subscribe(function (change) {
            var /** @type {?} */ posX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
            var /** @type {?} */ posY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';
            _this.menu.setPositionClasses(posX, posY);
        });
    };
    /**
     * This method builds the position strategy for the overlay, so the menu is properly connected
     * to the trigger.
     * @return {?} ConnectedPositionStrategy
     */
    MdMenuTrigger.prototype._getPosition = function () {
        var _a = this.menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'], originX = _a[0], originFallbackX = _a[1];
        var _b = this.menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'], overlayY = _b[0], overlayFallbackY = _b[1];
        var _c = [overlayY, overlayFallbackY], originY = _c[0], originFallbackY = _c[1];
        var _d = [originX, originFallbackX], overlayX = _d[0], overlayFallbackX = _d[1];
        var /** @type {?} */ offsetY = 0;
        if (this.triggersSubmenu()) {
            // When the menu is a sub-menu, it should always align itself
            // to the edges of the trigger, instead of overlapping it.
            overlayFallbackX = originX = this.menu.xPosition === 'before' ? 'start' : 'end';
            originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
            // TODO(crisbeto): this should be a function, once the overlay supports it.
            // Right now it will be wrong for the fallback positions.
            offsetY = overlayY === 'bottom' ? MENU_PANEL_TOP_PADDING : -MENU_PANEL_TOP_PADDING;
        }
        else if (!this.menu.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }
        return this._overlay.position()
            .connectedTo(this._element, { originX: originX, originY: originY }, { overlayX: overlayX, overlayY: overlayY })
            .withDirection(this.dir)
            .withOffsetY(offsetY)
            .withFallbackPosition({ originX: originFallbackX, originY: originY }, { overlayX: overlayFallbackX, overlayY: overlayY })
            .withFallbackPosition({ originX: originX, originY: originFallbackY }, { overlayX: overlayX, overlayY: overlayFallbackY })
            .withFallbackPosition({ originX: originFallbackX, originY: originFallbackY }, { overlayX: overlayFallbackX, overlayY: overlayFallbackY });
    };
    /**
     * Cleans up the active subscriptions.
     * @return {?}
     */
    MdMenuTrigger.prototype._cleanUpSubscriptions = function () {
        [
            this._closeSubscription,
            this._positionSubscription,
            this._hoverSubscription
        ]
            .filter(function (subscription) { return !!subscription; })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    /**
     * Returns a stream that emits whenever an action that should close the menu occurs.
     * @return {?}
     */
    MdMenuTrigger.prototype._menuClosingActions = function () {
        var _this = this;
        var /** @type {?} */ backdrop = ((this._overlayRef)).backdropClick();
        var /** @type {?} */ parentClose = this._parentMenu ? this._parentMenu.close : of(null);
        var /** @type {?} */ hover = this._parentMenu ? RxChain.from(this._parentMenu.hover())
            .call(filter, function (active) { return active !== _this._menuItemInstance; })
            .call(filter, function () { return _this._menuOpen; })
            .result() : of(null);
        return merge(backdrop, parentClose, hover);
    };
    /**
     * Handles mouse presses on the trigger.
     * @param {?} event
     * @return {?}
     */
    MdMenuTrigger.prototype._handleMousedown = function (event) {
        if (!isFakeMousedownFromScreenReader(event)) {
            this._openedByMouse = true;
        }
    };
    /**
     * Handles key presses on the trigger.
     * @param {?} event
     * @return {?}
     */
    MdMenuTrigger.prototype._handleKeydown = function (event) {
        var /** @type {?} */ keyCode = event.keyCode;
        if (this.triggersSubmenu() && ((keyCode === RIGHT_ARROW && this.dir === 'ltr') ||
            (keyCode === LEFT_ARROW && this.dir === 'rtl'))) {
            this.openMenu();
        }
    };
    /**
     * Handles click events on the trigger.
     * @param {?} event
     * @return {?}
     */
    MdMenuTrigger.prototype._handleClick = function (event) {
        if (this.triggersSubmenu()) {
            // Stop event propagation to avoid closing the parent menu.
            event.stopPropagation();
            this.openMenu();
        }
        else {
            this.toggleMenu();
        }
    };
    return MdMenuTrigger;
}());
MdMenuTrigger.decorators = [
    { type: Directive, args: [{
                selector: "[md-menu-trigger-for], [mat-menu-trigger-for],\n             [mdMenuTriggerFor], [matMenuTriggerFor]",
                host: {
                    'aria-haspopup': 'true',
                    '(mousedown)': '_handleMousedown($event)',
                    '(keydown)': '_handleKeydown($event)',
                    '(click)': '_handleClick($event)',
                },
                exportAs: 'mdMenuTrigger'
            },] },
];
/**
 * @nocollapse
 */
MdMenuTrigger.ctorParameters = function () { return [
    { type: Overlay, },
    { type: ElementRef, },
    { type: ViewContainerRef, },
    { type: undefined, decorators: [{ type: Inject, args: [MD_MENU_SCROLL_STRATEGY,] },] },
    { type: MdMenu, decorators: [{ type: Optional },] },
    { type: MdMenuItem, decorators: [{ type: Optional }, { type: Self },] },
    { type: Directionality, decorators: [{ type: Optional },] },
]; };
MdMenuTrigger.propDecorators = {
    '_deprecatedMdMenuTriggerFor': [{ type: Input, args: ['md-menu-trigger-for',] },],
    '_deprecatedMatMenuTriggerFor': [{ type: Input, args: ['mat-menu-trigger-for',] },],
    '_matMenuTriggerFor': [{ type: Input, args: ['matMenuTriggerFor',] },],
    'menu': [{ type: Input, args: ['mdMenuTriggerFor',] },],
    'onMenuOpen': [{ type: Output },],
    'onMenuClose': [{ type: Output },],
};
var MdMenuModule = (function () {
    function MdMenuModule() {
    }
    return MdMenuModule;
}());
MdMenuModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    OverlayModule,
                    CommonModule,
                    MdRippleModule,
                    MdCommonModule,
                ],
                exports: [MdMenu, MdMenuItem, MdMenuTrigger, MdCommonModule],
                declarations: [MdMenu, MdMenuItem, MdMenuTrigger],
                providers: [
                    MD_MENU_SCROLL_STRATEGY_PROVIDER,
                    {
                        provide: MD_MENU_DEFAULT_OPTIONS,
                        useValue: {
                            overlapTrigger: true,
                            xPosition: 'after',
                            yPosition: 'below',
                        },
                    }
                ],
            },] },
];
/**
 * @nocollapse
 */
MdMenuModule.ctorParameters = function () { return []; };
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
// TODO(jelbourn): resizing
// TODO(jelbourn): afterOpen
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
         * Subject for notifying the user that the dialog has finished closing.
         */
        this._afterClosed = new Subject();
        /**
         * Subject for notifying the user that the dialog has started closing.
         */
        this._beforeClose = new Subject();
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
     * @param {?} _ngZone
     * @param {?} _elementRef
     * @param {?} _focusTrapFactory
     * @param {?} _changeDetectorRef
     * @param {?} _document
     */
    function MdDialogContainer(_ngZone, _elementRef, _focusTrapFactory, _changeDetectorRef, _document) {
        var _this = _super.call(this) || this;
        _this._ngZone = _ngZone;
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
                styles: [".mat-dialog-container{box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);display:block;padding:24px;border-radius:2px;box-sizing:border-box;overflow:auto;max-width:80vw;outline:0;width:100%;height:100%}@media screen and (-ms-high-contrast:active){.mat-dialog-container{outline:solid 1px}}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:12px 0;display:flex;flex-wrap:wrap}.mat-dialog-actions:last-child{margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions .mat-button+.mat-button,.mat-dialog-actions .mat-button+.mat-raised-button,.mat-dialog-actions .mat-raised-button+.mat-button,.mat-dialog-actions .mat-raised-button+.mat-raised-button{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button+.mat-button,[dir=rtl] .mat-dialog-actions .mat-button+.mat-raised-button,[dir=rtl] .mat-dialog-actions .mat-raised-button+.mat-button,[dir=rtl] .mat-dialog-actions .mat-raised-button+.mat-raised-button{margin-left:0;margin-right:8px}"],
                encapsulation: ViewEncapsulation.None,
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
    { type: NgZone, },
    { type: ElementRef, },
    { type: FocusTrapFactory, },
    { type: ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
]; };
MdDialogContainer.propDecorators = {
    '_portalHost': [{ type: ViewChild, args: [PortalHostDirective,] },],
};
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
     * @param {?} _scrollStrategy
     * @param {?} _location
     * @param {?} _parentDialog
     */
    function MdDialog(_overlay, _injector, _scrollStrategy, _location, _parentDialog) {
        var _this = this;
        this._overlay = _overlay;
        this._injector = _injector;
        this._scrollStrategy = _scrollStrategy;
        this._location = _location;
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
        if (!_parentDialog && _location) {
            _location.subscribe(function () { return _this.closeAll(); });
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
        config = _applyConfigDefaults$1(config);
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
        var /** @type {?} */ overlayState = new OverlayState();
        overlayState.panelClass = dialogConfig.panelClass;
        overlayState.hasBackdrop = dialogConfig.hasBackdrop;
        overlayState.scrollStrategy = this._scrollStrategy();
        overlayState.direction = dialogConfig.direction;
        if (dialogConfig.backdropClass) {
            overlayState.backdropClass = dialogConfig.backdropClass;
        }
        overlayState.positionStrategy = this._overlay.position().global();
        return overlayState;
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
    { type: undefined, decorators: [{ type: Inject, args: [MD_DIALOG_SCROLL_STRATEGY,] },] },
    { type: Location, decorators: [{ type: Optional },] },
    { type: MdDialog, decorators: [{ type: Optional }, { type: SkipSelf },] },
]; };
/**
 * Applies default options to the dialog config.
 * @param {?=} config Config to be modified.
 * @return {?} The new configuration object.
 */
function _applyConfigDefaults$1(config) {
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
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
var _uniqueAutocompleteIdCounter = 0;
/**
 * Event object that is emitted when an autocomplete option is selected
 */
var MdAutocompleteSelectedEvent = (function () {
    /**
     * @param {?} source
     * @param {?} option
     */
    function MdAutocompleteSelectedEvent(source, option) {
        this.source = source;
        this.option = option;
    }
    return MdAutocompleteSelectedEvent;
}());
var MdAutocomplete = (function () {
    /**
     * @param {?} _changeDetectorRef
     */
    function MdAutocomplete(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Whether the autocomplete panel should be visible, depending on option length.
         */
        this.showPanel = false;
        /**
         * Function that maps an option's control value to its display value in the trigger.
         */
        this.displayWith = null;
        /**
         * Event that is emitted whenever an option from the list is selected.
         */
        this.optionSelected = new EventEmitter();
        /**
         * Unique ID to be used by autocomplete trigger's "aria-owns" property.
         */
        this.id = "md-autocomplete-" + _uniqueAutocompleteIdCounter++;
    }
    /**
     * @return {?}
     */
    MdAutocomplete.prototype.ngAfterContentInit = function () {
        this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
    };
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     * @param {?} scrollTop
     * @return {?}
     */
    MdAutocomplete.prototype._setScrollTop = function (scrollTop) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    };
    /**
     * Returns the panel's scrollTop.
     * @return {?}
     */
    MdAutocomplete.prototype._getScrollTop = function () {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    };
    /**
     * Panel should hide itself when the option list is empty.
     * @return {?}
     */
    MdAutocomplete.prototype._setVisibility = function () {
        var _this = this;
        Promise.resolve().then(function () {
            _this.showPanel = !!_this.options.length;
            _this._changeDetectorRef.markForCheck();
        });
    };
    /**
     * Emits the `select` event.
     * @param {?} option
     * @return {?}
     */
    MdAutocomplete.prototype._emitSelectEvent = function (option) {
        var /** @type {?} */ event = new MdAutocompleteSelectedEvent(this, option);
        this.optionSelected.emit(event);
    };
    /**
     * Sets a class on the panel based on whether it is visible.
     * @return {?}
     */
    MdAutocomplete.prototype._getClassList = function () {
        return {
            'mat-autocomplete-visible': this.showPanel,
            'mat-autocomplete-hidden': !this.showPanel
        };
    };
    return MdAutocomplete;
}());
MdAutocomplete.decorators = [
    { type: Component, args: [{ selector: 'md-autocomplete, mat-autocomplete',
                template: "<ng-template><div class=\"mat-autocomplete-panel\" role=\"listbox\" [id]=\"id\" [ngClass]=\"_getClassList()\" #panel><ng-content></ng-content></div></ng-template>",
                styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative}.mat-autocomplete-panel:not([class*=mat-elevation-z]){box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                exportAs: 'mdAutocomplete',
                host: {
                    'class': 'mat-autocomplete'
                }
            },] },
];
/**
 * @nocollapse
 */
MdAutocomplete.ctorParameters = function () { return [
    { type: ChangeDetectorRef, },
]; };
MdAutocomplete.propDecorators = {
    'template': [{ type: ViewChild, args: [TemplateRef,] },],
    'panel': [{ type: ViewChild, args: ['panel',] },],
    'options': [{ type: ContentChildren, args: [MdOption, { descendants: true },] },],
    'optionGroups': [{ type: ContentChildren, args: [MdOptgroup,] },],
    'displayWith': [{ type: Input },],
    'optionSelected': [{ type: Output },],
};
/**
 * The height of each autocomplete option.
 */
var AUTOCOMPLETE_OPTION_HEIGHT = 48;
/**
 * The total height of the autocomplete panel.
 */
var AUTOCOMPLETE_PANEL_HEIGHT = 256;
/**
 * Injection token that determines the scroll handling while the autocomplete panel is open.
 */
var MD_AUTOCOMPLETE_SCROLL_STRATEGY = new InjectionToken('md-autocomplete-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition(); };
}
/**
 * \@docs-private
 */
var MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER = {
    provide: MD_AUTOCOMPLETE_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * \@docs-private
 */
var MD_AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdAutocompleteTrigger; }),
    multi: true
};
/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 * @return {?}
 */
function getMdAutocompleteMissingPanelError() {
    return Error('Attempting to open an undefined instance of `md-autocomplete`. ' +
        'Make sure that the id passed to the `mdAutocomplete` is correct and that ' +
        'you\'re attempting to open it after the ngAfterContentInit hook.');
}
var MdAutocompleteTrigger = (function () {
    /**
     * @param {?} _element
     * @param {?} _overlay
     * @param {?} _viewContainerRef
     * @param {?} _zone
     * @param {?} _changeDetectorRef
     * @param {?} _scrollStrategy
     * @param {?} _dir
     * @param {?} _formField
     * @param {?} _document
     */
    function MdAutocompleteTrigger(_element, _overlay, _viewContainerRef, _zone, _changeDetectorRef, _scrollStrategy, _dir, _formField, _document) {
        this._element = _element;
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._zone = _zone;
        this._changeDetectorRef = _changeDetectorRef;
        this._scrollStrategy = _scrollStrategy;
        this._dir = _dir;
        this._formField = _formField;
        this._document = _document;
        this._panelOpen = false;
        /**
         * Whether or not the placeholder state is being overridden.
         */
        this._manuallyFloatingPlaceholder = false;
        /**
         * View -> model callback called when value changes
         */
        this._onChange = function () { };
        /**
         * View -> model callback called when autocomplete has been touched
         */
        this._onTouched = function () { };
    }
    Object.defineProperty(MdAutocompleteTrigger.prototype, "_matAutocomplete", {
        /**
         * Property with mat- prefix for no-conflict mode.
         * @return {?}
         */
        get: function () {
            return this.autocomplete;
        },
        /**
         * @param {?} autocomplete
         * @return {?}
         */
        set: function (autocomplete) {
            this.autocomplete = autocomplete;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.ngOnDestroy = function () {
        this._destroyPanel();
    };
    Object.defineProperty(MdAutocompleteTrigger.prototype, "panelOpen", {
        /**
         * @return {?}
         */
        get: function () {
            return this._panelOpen && this.autocomplete.showPanel;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opens the autocomplete suggestion panel.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.openPanel = function () {
        this._attachOverlay();
        this._floatPlaceholder();
    };
    /**
     * Closes the autocomplete suggestion panel.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.closePanel = function () {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
            this._closingActionsSubscription.unsubscribe();
        }
        this._resetPlaceholder();
        if (this._panelOpen) {
            this._panelOpen = false;
            // We need to trigger change detection manually, because
            // `fromEvent` doesn't seem to do it at the proper time.
            // This ensures that the placeholder is reset when the
            // user clicks outside.
            this._changeDetectorRef.detectChanges();
        }
    };
    Object.defineProperty(MdAutocompleteTrigger.prototype, "panelClosingActions", {
        /**
         * A stream of actions that should close the autocomplete panel, including
         * when an option is selected, on blur, and when TAB is pressed.
         * @return {?}
         */
        get: function () {
            return merge(this.optionSelections, this.autocomplete._keyManager.tabOut, this._outsideClickStream);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAutocompleteTrigger.prototype, "optionSelections", {
        /**
         * Stream of autocomplete option selections.
         * @return {?}
         */
        get: function () {
            return merge.apply(void 0, this.autocomplete.options.map(function (option) { return option.onSelectionChange; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAutocompleteTrigger.prototype, "activeOption", {
        /**
         * The currently active option, coerced to MdOption type.
         * @return {?}
         */
        get: function () {
            if (this.autocomplete && this.autocomplete._keyManager) {
                return this.autocomplete._keyManager.activeItem;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAutocompleteTrigger.prototype, "_outsideClickStream", {
        /**
         * Stream of clicks outside of the autocomplete panel.
         * @return {?}
         */
        get: function () {
            var _this = this;
            if (!this._document) {
                return of(null);
            }
            return RxChain.from(merge(fromEvent(this._document, 'click'), fromEvent(this._document, 'touchend'))).call(filter, function (event) {
                var /** @type {?} */ clickTarget = (event.target);
                var /** @type {?} */ formField = _this._formField ?
                    _this._formField._elementRef.nativeElement : null;
                return _this._panelOpen &&
                    clickTarget !== _this._element.nativeElement &&
                    (!formField || !formField.contains(clickTarget)) &&
                    (!!_this._overlayRef && !_this._overlayRef.overlayElement.contains(clickTarget));
            }).result();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the autocomplete's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} value New value to be written to the model.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.writeValue = function (value) {
        var _this = this;
        Promise.resolve(null).then(function () { return _this._setTriggerValue(value); });
    };
    /**
     * Saves a callback function to be invoked when the autocomplete's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the value changes.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    /**
     * Saves a callback function to be invoked when the autocomplete is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the component has been touched.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._handleKeydown = function (event) {
        var _this = this;
        if (event.keyCode === ESCAPE && this.panelOpen) {
            this._resetActiveItem();
            this.closePanel();
            event.stopPropagation();
        }
        else if (this.activeOption && event.keyCode === ENTER && this.panelOpen) {
            this.activeOption._selectViaInteraction();
            this._resetActiveItem();
            event.preventDefault();
        }
        else {
            var /** @type {?} */ prevActiveItem_1 = this.autocomplete._keyManager.activeItem;
            var /** @type {?} */ isArrowKey_1 = event.keyCode === UP_ARROW || event.keyCode === DOWN_ARROW;
            if (this.panelOpen) {
                this.autocomplete._keyManager.onKeydown(event);
            }
            else if (isArrowKey_1) {
                this.openPanel();
            }
            Promise.resolve().then(function () {
                if (isArrowKey_1 || _this.autocomplete._keyManager.activeItem !== prevActiveItem_1) {
                    _this._scrollToOption();
                }
            });
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._handleInput = function (event) {
        // We need to ensure that the input is focused, because IE will fire the `input`
        // event on focus/blur/load if the input has a placeholder. See:
        // https://connect.microsoft.com/IE/feedback/details/885747/
        if (document.activeElement === event.target) {
            this._onChange(((event.target)).value);
            this.openPanel();
        }
    };
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._handleFocus = function () {
        this._attachOverlay();
        this._floatPlaceholder(true);
    };
    /**
     * In "auto" mode, the placeholder will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the placeholder until the panel can be closed.
     * @param {?=} shouldAnimate Whether the placeholder should be animated when it is floated.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._floatPlaceholder = function (shouldAnimate) {
        if (shouldAnimate === void 0) { shouldAnimate = false; }
        if (this._formField && this._formField.floatPlaceholder === 'auto') {
            if (shouldAnimate) {
                this._formField._animateAndLockPlaceholder();
            }
            else {
                this._formField.floatPlaceholder = 'always';
            }
            this._manuallyFloatingPlaceholder = true;
        }
    };
    /**
     * If the placeholder has been manually elevated, return it to its normal state.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._resetPlaceholder = function () {
        if (this._manuallyFloatingPlaceholder) {
            this._formField.floatPlaceholder = 'auto';
            this._manuallyFloatingPlaceholder = false;
        }
    };
    /**
     * Given that we are not actually focusing active options, we must manually adjust scroll
     * to reveal options below the fold. First, we find the offset of the option from the top
     * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
     * the panel height + the option height, so the active option will be just visible at the
     * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
     * will become the offset. If that offset is visible within the panel already, the scrollTop is
     * not adjusted.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._scrollToOption = function () {
        var /** @type {?} */ activeOptionIndex = this.autocomplete._keyManager.activeItemIndex || 0;
        var /** @type {?} */ labelCount = MdOption.countGroupLabelsBeforeOption(activeOptionIndex, this.autocomplete.options, this.autocomplete.optionGroups);
        var /** @type {?} */ optionOffset = (activeOptionIndex + labelCount) * AUTOCOMPLETE_OPTION_HEIGHT;
        var /** @type {?} */ panelTop = this.autocomplete._getScrollTop();
        if (optionOffset < panelTop) {
            // Scroll up to reveal selected option scrolled above the panel top
            this.autocomplete._setScrollTop(optionOffset);
        }
        else if (optionOffset + AUTOCOMPLETE_OPTION_HEIGHT > panelTop + AUTOCOMPLETE_PANEL_HEIGHT) {
            // Scroll down to reveal selected option scrolled below the panel bottom
            var /** @type {?} */ newScrollTop = Math.max(0, optionOffset - AUTOCOMPLETE_PANEL_HEIGHT + AUTOCOMPLETE_OPTION_HEIGHT);
            this.autocomplete._setScrollTop(newScrollTop);
        }
    };
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._subscribeToClosingActions = function () {
        var _this = this;
        var /** @type {?} */ firstStable = first.call(this._zone.onStable);
        var /** @type {?} */ optionChanges = map.call(this.autocomplete.options.changes, function () { return _this._positionStrategy.recalculateLastPosition(); });
        // When the zone is stable initially, and when the option list changes...
        return RxChain.from(merge(firstStable, optionChanges))
            .call(switchMap, function () {
            _this._resetActiveItem();
            _this.autocomplete._setVisibility();
            return _this.panelClosingActions;
        })
            .call(first)
            .subscribe(function (event) { return _this._setValueAndClose(event); });
    };
    /**
     * Destroys the autocomplete suggestion panel.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._destroyPanel = function () {
        if (this._overlayRef) {
            this.closePanel();
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._setTriggerValue = function (value) {
        var /** @type {?} */ toDisplay = this.autocomplete.displayWith ? this.autocomplete.displayWith(value) : value;
        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
        var /** @type {?} */ inputValue = toDisplay != null ? toDisplay : '';
        // If it's used within a `MdFormField`, we should set it through the property so it can go
        // through change detection.
        if (this._formField) {
            this._formField._control.value = inputValue;
        }
        else {
            this._element.nativeElement.value = inputValue;
        }
    };
    /**
     * This method closes the panel, and if a value is specified, also sets the associated
     * control to that value. It will also mark the control as dirty if this interaction
     * stemmed from the user.
     * @param {?} event
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._setValueAndClose = function (event) {
        if (event && event.source) {
            this._clearPreviousSelectedOption(event.source);
            this._setTriggerValue(event.source.value);
            this._onChange(event.source.value);
            this._element.nativeElement.focus();
            this.autocomplete._emitSelectEvent(event.source);
        }
        this.closePanel();
    };
    /**
     * Clear any previous selected option and emit a selection change event for this option
     * @param {?} skip
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._clearPreviousSelectedOption = function (skip) {
        this.autocomplete.options.forEach(function (option) {
            if (option != skip && option.selected) {
                option.deselect();
            }
        });
    };
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._attachOverlay = function () {
        if (!this.autocomplete) {
            throw getMdAutocompleteMissingPanelError();
        }
        if (!this._overlayRef) {
            this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef);
            this._overlayRef = this._overlay.create(this._getOverlayConfig());
        }
        else {
            /** Update the panel width, in case the host width has changed */
            this._overlayRef.getState().width = this._getHostWidth();
            this._overlayRef.updateSize();
        }
        if (this._overlayRef && !this._overlayRef.hasAttached()) {
            this._overlayRef.attach(this._portal);
            this._closingActionsSubscription = this._subscribeToClosingActions();
        }
        this.autocomplete._setVisibility();
        this._panelOpen = true;
    };
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._getOverlayConfig = function () {
        var /** @type {?} */ overlayState = new OverlayState();
        overlayState.positionStrategy = this._getOverlayPosition();
        overlayState.width = this._getHostWidth();
        overlayState.direction = this._dir ? this._dir.value : 'ltr';
        overlayState.scrollStrategy = this._scrollStrategy();
        return overlayState;
    };
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._getOverlayPosition = function () {
        this._positionStrategy = this._overlay.position().connectedTo(this._getConnectedElement(), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' });
        return this._positionStrategy;
    };
    /**
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._getConnectedElement = function () {
        return this._formField ? this._formField._connectionContainerRef : this._element;
    };
    /**
     * Returns the width of the input element, so the panel width can match it.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._getHostWidth = function () {
        return this._getConnectedElement().nativeElement.getBoundingClientRect().width;
    };
    /**
     * Reset active item to -1 so arrow events will activate the correct options.
     * @return {?}
     */
    MdAutocompleteTrigger.prototype._resetActiveItem = function () {
        this.autocomplete._keyManager.setActiveItem(-1);
    };
    return MdAutocompleteTrigger;
}());
MdAutocompleteTrigger.decorators = [
    { type: Directive, args: [{
                selector: "input[mdAutocomplete], input[matAutocomplete],\n             textarea[mdAutocomplete], textarea[matAutocomplete]",
                host: {
                    'role': 'combobox',
                    'autocomplete': 'off',
                    'aria-autocomplete': 'list',
                    'aria-multiline': 'false',
                    '[attr.aria-activedescendant]': 'activeOption?.id',
                    '[attr.aria-expanded]': 'panelOpen.toString()',
                    '[attr.aria-owns]': 'autocomplete?.id',
                    // Note: we use `focusin`, as opposed to `focus`, in order to open the panel
                    // a little earlier. This avoids issues where IE delays the focusing of the input.
                    '(focusin)': '_handleFocus()',
                    '(blur)': '_onTouched()',
                    '(input)': '_handleInput($event)',
                    '(keydown)': '_handleKeydown($event)',
                },
                providers: [MD_AUTOCOMPLETE_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
MdAutocompleteTrigger.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Overlay, },
    { type: ViewContainerRef, },
    { type: NgZone, },
    { type: ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: Inject, args: [MD_AUTOCOMPLETE_SCROLL_STRATEGY,] },] },
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: MdFormField, decorators: [{ type: Optional }, { type: Host },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
]; };
MdAutocompleteTrigger.propDecorators = {
    'autocomplete': [{ type: Input, args: ['mdAutocomplete',] },],
    '_matAutocomplete': [{ type: Input, args: ['matAutocomplete',] },],
};
var MdAutocompleteModule = (function () {
    function MdAutocompleteModule() {
    }
    return MdAutocompleteModule;
}());
MdAutocompleteModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdOptionModule, OverlayModule, MdCommonModule, CommonModule],
                exports: [MdAutocomplete, MdOptionModule, MdAutocompleteTrigger, MdCommonModule],
                declarations: [MdAutocomplete, MdAutocompleteTrigger],
                providers: [MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
MdAutocompleteModule.ctorParameters = function () { return []; };
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * \@docs-private
 */
var MdCalendarCell = (function () {
    /**
     * @param {?} value
     * @param {?} displayValue
     * @param {?} ariaLabel
     * @param {?} enabled
     */
    function MdCalendarCell(value, displayValue, ariaLabel, enabled) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
    }
    return MdCalendarCell;
}());
/**
 * An internal component used to display calendar data in a table.
 * \@docs-private
 */
var MdCalendarBody = (function () {
    function MdCalendarBody() {
        /**
         * The number of columns in the table.
         */
        this.numCols = 7;
        /**
         * Whether to allow selection of disabled cells.
         */
        this.allowDisabledSelection = false;
        /**
         * The cell number of the active cell in the table.
         */
        this.activeCell = 0;
        /**
         * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
         * maintained even as the table resizes.
         */
        this.cellAspectRatio = 1;
        /**
         * Emits when a new value is selected.
         */
        this.selectedValueChange = new EventEmitter();
    }
    /**
     * @param {?} cell
     * @return {?}
     */
    MdCalendarBody.prototype._cellClicked = function (cell) {
        if (!this.allowDisabledSelection && !cell.enabled) {
            return;
        }
        this.selectedValueChange.emit(cell.value);
    };
    Object.defineProperty(MdCalendarBody.prototype, "_firstRowOffset", {
        /**
         * The number of blank cells to put at the beginning for the first row.
         * @return {?}
         */
        get: function () {
            return this.rows && this.rows.length && this.rows[0].length ?
                this.numCols - this.rows[0].length : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} rowIndex
     * @param {?} colIndex
     * @return {?}
     */
    MdCalendarBody.prototype._isActiveCell = function (rowIndex, colIndex) {
        var /** @type {?} */ cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    };
    return MdCalendarBody;
}());
MdCalendarBody.decorators = [
    { type: Component, args: [{ selector: '[md-calendar-body], [mat-calendar-body]',
                template: "<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\"><td class=\"mat-calendar-body-label\" [attr.colspan]=\"numCols\" [style.paddingTop.%]=\"50 * cellAspectRatio / numCols\" [style.paddingBottom.%]=\"50 * cellAspectRatio / numCols\">{{label}}</td></tr><tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\"><td *ngIf=\"rowIndex === 0 && _firstRowOffset\" aria-hidden=\"true\" class=\"mat-calendar-body-label\" [attr.colspan]=\"_firstRowOffset\" [style.paddingTop.%]=\"50 * cellAspectRatio / numCols\" [style.paddingBottom.%]=\"50 * cellAspectRatio / numCols\">{{_firstRowOffset >= labelMinRequiredCells ? label : ''}}</td><td *ngFor=\"let item of row; let colIndex = index\" role=\"gridcell\" class=\"mat-calendar-body-cell\" [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\" [class.mat-calendar-body-disabled]=\"!item.enabled\" [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\" [attr.aria-label]=\"item.ariaLabel\" [attr.aria-disabled]=\"!item.enabled || null\" (click)=\"_cellClicked(item)\" [style.width.%]=\"100 / numCols\" [style.paddingTop.%]=\"50 * cellAspectRatio / numCols\" [style.paddingBottom.%]=\"50 * cellAspectRatio / numCols\"><div class=\"mat-calendar-body-cell-content\" [class.mat-calendar-body-selected]=\"selectedValue === item.value\" [class.mat-calendar-body-today]=\"todayValue === item.value\">{{item.displayValue}}</div></td></tr>",
                styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-label{height:0;line-height:0;text-align:left;padding-left:4.71429%;padding-right:4.71429%}.mat-calendar-body-cell{position:relative;height:0;line-height:0;text-align:center;outline:0;cursor:pointer}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px}[dir=rtl] .mat-calendar-body-label{text-align:right}"],
                host: {
                    'class': 'mat-calendar-body',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdCalendarBody.ctorParameters = function () { return []; };
MdCalendarBody.propDecorators = {
    'label': [{ type: Input },],
    'rows': [{ type: Input },],
    'todayValue': [{ type: Input },],
    'selectedValue': [{ type: Input },],
    'labelMinRequiredCells': [{ type: Input },],
    'numCols': [{ type: Input },],
    'allowDisabledSelection': [{ type: Input },],
    'activeCell': [{ type: Input },],
    'cellAspectRatio': [{ type: Input },],
    'selectedValueChange': [{ type: Output },],
};
/**
 * \@docs-private
 * @param {?} provider
 * @return {?}
 */
function createMissingDateImplError(provider) {
    return Error("MdDatepicker: No provider found for " + provider + ". You must import one of the following " +
        "modules at your application root: MdNativeDateModule, or provide a custom implementation.");
}
var DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * \@docs-private
 */
var MdMonthView = (function () {
    /**
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     */
    function MdMonthView(_dateAdapter, _dateFormats) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /**
         * Emits when a new date is selected.
         */
        this.selectedChange = new EventEmitter();
        /**
         * Emits when any date is selected.
         */
        this.userSelection = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        var firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
        var narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
        var longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
        // Rotate the labels for days of the week based on the configured first day of the week.
        var weekdays = longWeekdays.map(function (long, i) {
            return { long: long, narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MdMonthView.prototype, "activeDate", {
        /**
         * The date to display in this month view (everything other than the month and year is ignored).
         * @return {?}
         */
        get: function () { return this._activeDate; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            var /** @type {?} */ oldActiveDate = this._activeDate;
            this._activeDate = value || this._dateAdapter.today();
            if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMonthView.prototype, "selected", {
        /**
         * The currently selected date.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selected = value;
            this._selectedDate = this._getDateInCurrentMonth(this.selected);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdMonthView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    /**
     * Handles when a new date is selected.
     * @param {?} date
     * @return {?}
     */
    MdMonthView.prototype._dateSelected = function (date) {
        if (this._selectedDate != date) {
            var /** @type {?} */ selectedYear = this._dateAdapter.getYear(this.activeDate);
            var /** @type {?} */ selectedMonth = this._dateAdapter.getMonth(this.activeDate);
            var /** @type {?} */ selectedDate = this._dateAdapter.createDate(selectedYear, selectedMonth, date);
            this.selectedChange.emit(selectedDate);
        }
        this.userSelection.emit();
    };
    /**
     * Initializes this month view.
     * @return {?}
     */
    MdMonthView.prototype._init = function () {
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
        this._todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
        this._monthLabel =
            this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                .toLocaleUpperCase();
        var /** @type {?} */ firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
        this._firstWeekOffset =
            (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
        this._createWeekCells();
    };
    /**
     * Creates MdCalendarCells for the dates in this month.
     * @return {?}
     */
    MdMonthView.prototype._createWeekCells = function () {
        var /** @type {?} */ daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
        var /** @type {?} */ dateNames = this._dateAdapter.getDateNames();
        this._weeks = [[]];
        for (var /** @type {?} */ i = 0, /** @type {?} */ cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell == DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            var /** @type {?} */ date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
            var /** @type {?} */ enabled = !this.dateFilter ||
                this.dateFilter(date);
            var /** @type {?} */ ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
            this._weeks[this._weeks.length - 1]
                .push(new MdCalendarCell(i + 1, dateNames[i], ariaLabel, enabled));
        }
    };
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     * @param {?} date
     * @return {?}
     */
    MdMonthView.prototype._getDateInCurrentMonth = function (date) {
        return this._hasSameMonthAndYear(date, this.activeDate) ?
            this._dateAdapter.getDate(date) : null;
    };
    /**
     * Checks whether the 2 dates are non-null and fall within the same month of the same year.
     * @param {?} d1
     * @param {?} d2
     * @return {?}
     */
    MdMonthView.prototype._hasSameMonthAndYear = function (d1, d2) {
        return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
            this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
    };
    return MdMonthView;
}());
MdMonthView.decorators = [
    { type: Component, args: [{ selector: 'md-month-view',
                template: "<table class=\"mat-calendar-table\"><thead class=\"mat-calendar-table-header\"><tr><th *ngFor=\"let day of _weekdays\" [attr.aria-label]=\"day.long\">{{day.narrow}}</th></tr><tr><th class=\"mat-calendar-table-header-divider\" colspan=\"7\" aria-hidden=\"true\"></th></tr></thead><tbody md-calendar-body role=\"grid\" [label]=\"_monthLabel\" [rows]=\"_weeks\" [todayValue]=\"_todayDate\" [selectedValue]=\"_selectedDate\" [labelMinRequiredCells]=\"3\" [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\" (selectedValueChange)=\"_dateSelected($event)\"></tbody></table>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdMonthView.ctorParameters = function () { return [
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_DATE_FORMATS,] },] },
]; };
MdMonthView.propDecorators = {
    'activeDate': [{ type: Input },],
    'selected': [{ type: Input },],
    'dateFilter': [{ type: Input },],
    'selectedChange': [{ type: Output },],
    'userSelection': [{ type: Output },],
};
/**
 * An internal component used to display a single year in the datepicker.
 * \@docs-private
 */
var MdYearView = (function () {
    /**
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     */
    function MdYearView(_dateAdapter, _dateFormats) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /**
         * Emits when a new month is selected.
         */
        this.selectedChange = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MdYearView.prototype, "activeDate", {
        /**
         * The date to display in this year view (everything other than the year is ignored).
         * @return {?}
         */
        get: function () { return this._activeDate; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            var /** @type {?} */ oldActiveDate = this._activeDate;
            this._activeDate = value || this._dateAdapter.today();
            if (this._dateAdapter.getYear(oldActiveDate) != this._dateAdapter.getYear(this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdYearView.prototype, "selected", {
        /**
         * The currently selected date.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selected = value;
            this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdYearView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    /**
     * Handles when a new month is selected.
     * @param {?} month
     * @return {?}
     */
    MdYearView.prototype._monthSelected = function (month) {
        var /** @type {?} */ daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1));
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
    };
    /**
     * Initializes this month view.
     * @return {?}
     */
    MdYearView.prototype._init = function () {
        var _this = this;
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._dateAdapter.today());
        this._yearLabel = this._dateAdapter.getYearName(this.activeDate);
        var /** @type {?} */ monthNames = this._dateAdapter.getMonthNames('short');
        // First row of months only contains 5 elements so we can fit the year label on the same row.
        this._months = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map(function (row) { return row.map(function (month) { return _this._createCellForMonth(month, monthNames[month]); }); });
    };
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     * @param {?} date
     * @return {?}
     */
    MdYearView.prototype._getMonthInCurrentYear = function (date) {
        return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ?
            this._dateAdapter.getMonth(date) : null;
    };
    /**
     * Creates an MdCalendarCell for the given month.
     * @param {?} month
     * @param {?} monthName
     * @return {?}
     */
    MdYearView.prototype._createCellForMonth = function (month, monthName) {
        var /** @type {?} */ ariaLabel = this._dateAdapter.format(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);
        return new MdCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
    };
    /**
     * Whether the given month is enabled.
     * @param {?} month
     * @return {?}
     */
    MdYearView.prototype._isMonthEnabled = function (month) {
        if (!this.dateFilter) {
            return true;
        }
        var /** @type {?} */ firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
        // If any date in the month is enabled count the month as enabled.
        for (var /** @type {?} */ date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    };
    return MdYearView;
}());
MdYearView.decorators = [
    { type: Component, args: [{ selector: 'md-year-view, mat-year-view',
                template: "<table class=\"mat-calendar-table\"><thead class=\"mat-calendar-table-header\"><tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr></thead><tbody md-calendar-body role=\"grid\" allowDisabledSelection=\"true\" [label]=\"_yearLabel\" [rows]=\"_months\" [todayValue]=\"_todayMonth\" [selectedValue]=\"_selectedMonth\" [labelMinRequiredCells]=\"2\" [numCols]=\"4\" [cellAspectRatio]=\"4 / 7\" [activeCell]=\"_dateAdapter.getMonth(activeDate)\" (selectedValueChange)=\"_monthSelected($event)\"></tbody></table>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdYearView.ctorParameters = function () { return [
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_DATE_FORMATS,] },] },
]; };
MdYearView.propDecorators = {
    'activeDate': [{ type: Input },],
    'selected': [{ type: Input },],
    'dateFilter': [{ type: Input },],
    'selectedChange': [{ type: Output },],
};
/**
 * Datepicker data that requires internationalization.
 */
var MdDatepickerIntl = (function () {
    function MdDatepickerIntl() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * A label for the calendar popup (used by screen readers).
         */
        this.calendarLabel = 'Calendar';
        /**
         * A label for the button used to open the calendar popup (used by screen readers).
         */
        this.openCalendarLabel = 'Open calendar';
        /**
         * A label for the previous month button (used by screen readers).
         */
        this.prevMonthLabel = 'Previous month';
        /**
         * A label for the next month button (used by screen readers).
         */
        this.nextMonthLabel = 'Next month';
        /**
         * A label for the previous year button (used by screen readers).
         */
        this.prevYearLabel = 'Previous year';
        /**
         * A label for the next year button (used by screen readers).
         */
        this.nextYearLabel = 'Next year';
        /**
         * A label for the 'switch to month view' button (used by screen readers).
         */
        this.switchToMonthViewLabel = 'Change to month view';
        /**
         * A label for the 'switch to year view' button (used by screen readers).
         */
        this.switchToYearViewLabel = 'Change to year view';
    }
    return MdDatepickerIntl;
}());
MdDatepickerIntl.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MdDatepickerIntl.ctorParameters = function () { return []; };
/**
 * A calendar that is used as part of the datepicker.
 * \@docs-private
 */
var MdCalendar = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _intl
     * @param {?} _ngZone
     * @param {?} _isCompatibilityMode
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} changeDetectorRef
     */
    function MdCalendar(_elementRef, _intl, _ngZone, _isCompatibilityMode, _dateAdapter, _dateFormats, changeDetectorRef) {
        var _this = this;
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this._isCompatibilityMode = _isCompatibilityMode;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /**
         * Whether the calendar should be started in month or year view.
         */
        this.startView = 'month';
        /**
         * Emits when the currently selected date changes.
         */
        this.selectedChange = new EventEmitter();
        /**
         * Emits when any date is selected.
         */
        this.userSelection = new EventEmitter();
        /**
         * Date filter for the month and year views.
         */
        this._dateFilterForViews = function (date) {
            return !!date &&
                (!_this.dateFilter || _this.dateFilter(date)) &&
                (!_this.minDate || _this._dateAdapter.compareDate(date, _this.minDate) >= 0) &&
                (!_this.maxDate || _this._dateAdapter.compareDate(date, _this.maxDate) <= 0);
        };
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        this._intlChanges = _intl.changes.subscribe(function () { return changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MdCalendar.prototype, "_activeDate", {
        /**
         * The current active date. This determines which time period is shown and which date is
         * highlighted when using keyboard navigation.
         * @return {?}
         */
        get: function () { return this._clampedActiveDate; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_periodButtonText", {
        /**
         * The label for the current calendar view.
         * @return {?}
         */
        get: function () {
            return this._monthView ?
                this._dateAdapter.format(this._activeDate, this._dateFormats.display.monthYearLabel)
                    .toLocaleUpperCase() :
                this._dateAdapter.getYearName(this._activeDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_periodButtonLabel", {
        /**
         * @return {?}
         */
        get: function () {
            return this._monthView ? this._intl.switchToYearViewLabel : this._intl.switchToMonthViewLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_prevButtonLabel", {
        /**
         * The label for the the previous button.
         * @return {?}
         */
        get: function () {
            return this._monthView ? this._intl.prevMonthLabel : this._intl.prevYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_nextButtonLabel", {
        /**
         * The label for the the next button.
         * @return {?}
         */
        get: function () {
            return this._monthView ? this._intl.nextMonthLabel : this._intl.nextYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdCalendar.prototype.ngAfterContentInit = function () {
        this._activeDate = this.startAt || this._dateAdapter.today();
        this._focusActiveCell();
        this._monthView = this.startView != 'year';
    };
    /**
     * @return {?}
     */
    MdCalendar.prototype.ngOnDestroy = function () {
        this._intlChanges.unsubscribe();
    };
    /**
     * Handles date selection in the month view.
     * @param {?} date
     * @return {?}
     */
    MdCalendar.prototype._dateSelected = function (date) {
        if (!this._dateAdapter.sameDate(date, this.selected)) {
            this.selectedChange.emit(date);
        }
    };
    /**
     * @return {?}
     */
    MdCalendar.prototype._userSelected = function () {
        this.userSelection.emit();
    };
    /**
     * Handles month selection in the year view.
     * @param {?} month
     * @return {?}
     */
    MdCalendar.prototype._monthSelected = function (month) {
        this._activeDate = month;
        this._monthView = true;
    };
    /**
     * Handles user clicks on the period label.
     * @return {?}
     */
    MdCalendar.prototype._currentPeriodClicked = function () {
        this._monthView = !this._monthView;
    };
    /**
     * Handles user clicks on the previous button.
     * @return {?}
     */
    MdCalendar.prototype._previousClicked = function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, -1) :
            this._dateAdapter.addCalendarYears(this._activeDate, -1);
    };
    /**
     * Handles user clicks on the next button.
     * @return {?}
     */
    MdCalendar.prototype._nextClicked = function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, 1) :
            this._dateAdapter.addCalendarYears(this._activeDate, 1);
    };
    /**
     * Whether the previous period button is enabled.
     * @return {?}
     */
    MdCalendar.prototype._previousEnabled = function () {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
    };
    /**
     * Whether the next period button is enabled.
     * @return {?}
     */
    MdCalendar.prototype._nextEnabled = function () {
        return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
    };
    /**
     * Handles keydown events on the calendar body.
     * @param {?} event
     * @return {?}
     */
    MdCalendar.prototype._handleCalendarBodyKeydown = function (event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        if (this._monthView) {
            this._handleCalendarBodyKeydownInMonthView(event);
        }
        else {
            this._handleCalendarBodyKeydownInYearView(event);
        }
    };
    /**
     * Focuses the active cell after the microtask queue is empty.
     * @return {?}
     */
    MdCalendar.prototype._focusActiveCell = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () { return first.call(_this._ngZone.onStable).subscribe(function () {
            _this._elementRef.nativeElement.querySelector('.mat-calendar-body-active').focus();
        }); });
    };
    /**
     * Whether the two dates represent the same view in the current view mode (month or year).
     * @param {?} date1
     * @param {?} date2
     * @return {?}
     */
    MdCalendar.prototype._isSameView = function (date1, date2) {
        return this._monthView ?
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2) :
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
    };
    /**
     * Handles keydown events on the calendar body when calendar is in month view.
     * @param {?} event
     * @return {?}
     */
    MdCalendar.prototype._handleCalendarBodyKeydownInMonthView = function (event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                break;
            case DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                break;
            case HOME:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                break;
            case END:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                    this._dateAdapter.getDate(this._activeDate)));
                break;
            case PAGE_UP:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, -1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case PAGE_DOWN:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, 1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case ENTER:
                if (this._dateFilterForViews(this._activeDate)) {
                    this._dateSelected(this._activeDate);
                    // Prevent unexpected default actions such as form submission.
                    event.preventDefault();
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /**
     * Handles keydown events on the calendar body when calendar is in year view.
     * @param {?} event
     * @return {?}
     */
    MdCalendar.prototype._handleCalendarBodyKeydownInYearView = function (event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._prevMonthInSameCol(this._activeDate);
                break;
            case DOWN_ARROW:
                this._activeDate = this._nextMonthInSameCol(this._activeDate);
                break;
            case HOME:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
                break;
            case END:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
                break;
            case PAGE_UP:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case PAGE_DOWN:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case ENTER:
                this._monthSelected(this._activeDate);
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /**
     * Determine the date for the month that comes before the given month in the same column in the
     * calendar table.
     * @param {?} date
     * @return {?}
     */
    MdCalendar.prototype._prevMonthInSameCol = function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var /** @type {?} */ increment = this._dateAdapter.getMonth(date) <= 4 ? -5 :
            (this._dateAdapter.getMonth(date) >= 7 ? -7 : -12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    /**
     * Determine the date for the month that comes after the given month in the same column in the
     * calendar table.
     * @param {?} date
     * @return {?}
     */
    MdCalendar.prototype._nextMonthInSameCol = function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var /** @type {?} */ increment = this._dateAdapter.getMonth(date) <= 4 ? 7 :
            (this._dateAdapter.getMonth(date) >= 7 ? 5 : 12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    return MdCalendar;
}());
MdCalendar.decorators = [
    { type: Component, args: [{ selector: 'md-calendar, mat-calendar',
                template: "<div class=\"mat-calendar-header\"><div class=\"mat-calendar-controls\"><button *ngIf=\"!_isCompatibilityMode\" md-button class=\"mat-calendar-period-button\" (click)=\"_currentPeriodClicked()\" [attr.aria-label]=\"_periodButtonLabel\">{{_periodButtonText}}<div class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"!_monthView\"></div></button> <button *ngIf=\"_isCompatibilityMode\" mat-button class=\"mat-calendar-period-button\" (click)=\"_currentPeriodClicked()\" [attr.aria-label]=\"_periodButtonLabel\">{{_periodButtonText}}<div class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"!_monthView\"></div></button><div class=\"mat-calendar-spacer\"></div><button *ngIf=\"!_isCompatibilityMode\" md-icon-button class=\"mat-calendar-previous-button\" [disabled]=\"!_previousEnabled()\" (click)=\"_previousClicked()\" [attr.aria-label]=\"_prevButtonLabel\"></button> <button *ngIf=\"_isCompatibilityMode\" mat-icon-button class=\"mat-calendar-previous-button\" [disabled]=\"!_previousEnabled()\" (click)=\"_previousClicked()\" [attr.aria-label]=\"_prevButtonLabel\"></button> <button *ngIf=\"!_isCompatibilityMode\" md-icon-button class=\"mat-calendar-next-button\" [disabled]=\"!_nextEnabled()\" (click)=\"_nextClicked()\" [attr.aria-label]=\"_nextButtonLabel\"></button> <button *ngIf=\"_isCompatibilityMode\" mat-icon-button class=\"mat-calendar-next-button\" [disabled]=\"!_nextEnabled()\" (click)=\"_nextClicked()\" [attr.aria-label]=\"_nextButtonLabel\"></button></div></div><div class=\"mat-calendar-content\" (keydown)=\"_handleCalendarBodyKeydown($event)\" [ngSwitch]=\"_monthView\" cdkMonitorSubtreeFocus><md-month-view *ngSwitchCase=\"true\" [activeDate]=\"_activeDate\" [selected]=\"selected\" [dateFilter]=\"_dateFilterForViews\" (selectedChange)=\"_dateSelected($event)\" (userSelection)=\"_userSelected()\"></md-month-view><md-year-view *ngSwitchDefault [activeDate]=\"_activeDate\" [selected]=\"selected\" [dateFilter]=\"_dateFilterForViews\" (selectedChange)=\"_monthSelected($event)\"></md-year-view></div>",
                styles: [".mat-calendar{display:block}.mat-calendar-header{padding:8px 8px 0 8px}.mat-calendar-content{padding:0 8px 8px 8px;outline:0}.mat-calendar-controls{display:flex;margin:5% calc(33% / 7 - 16px)}.mat-calendar-spacer{flex:1 1 auto}.mat-calendar-period-button{min-width:0}.mat-calendar-arrow{display:inline-block;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top-width:5px;border-top-style:solid;margin:0 0 0 5px;vertical-align:middle}.mat-calendar-arrow.mat-calendar-invert{transform:rotate(180deg)}[dir=rtl] .mat-calendar-arrow{margin:0 5px 0 0}.mat-calendar-next-button,.mat-calendar-previous-button{position:relative}.mat-calendar-next-button::after,.mat-calendar-previous-button::after{top:0;left:0;right:0;bottom:0;position:absolute;content:'';margin:15.5px;border:0 solid currentColor;border-top-width:2px}[dir=rtl] .mat-calendar-next-button,[dir=rtl] .mat-calendar-previous-button{transform:rotate(180deg)}.mat-calendar-previous-button::after{border-left-width:2px;transform:translateX(2px) rotate(-45deg)}.mat-calendar-next-button::after{border-right-width:2px;transform:translateX(-2px) rotate(45deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px 0}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:'';position:absolute;top:0;left:-8px;right:-8px;height:1px}"],
                host: {
                    'class': 'mat-calendar',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdCalendar.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: MdDatepickerIntl, },
    { type: NgZone, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_DATE_FORMATS,] },] },
    { type: ChangeDetectorRef, },
]; };
MdCalendar.propDecorators = {
    'startAt': [{ type: Input },],
    'startView': [{ type: Input },],
    'selected': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'dateFilter': [{ type: Input },],
    'selectedChange': [{ type: Output },],
    'userSelection': [{ type: Output },],
};
/**
 * Used to generate a unique ID for each datepicker instance.
 */
var datepickerUid = 0;
/**
 * Injection token that determines the scroll handling while the calendar is open.
 */
var MD_DATEPICKER_SCROLL_STRATEGY = new InjectionToken('md-datepicker-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition(); };
}
/**
 * \@docs-private
 */
var MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER = {
    provide: MD_DATEPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MdCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * \@docs-private
 */
var MdDatepickerContent = (function () {
    function MdDatepickerContent() {
    }
    /**
     * @return {?}
     */
    MdDatepickerContent.prototype.ngAfterContentInit = function () {
        this._calendar._focusActiveCell();
    };
    /**
     * Handles keydown event on datepicker content.
     * @param {?} event The event.
     * @return {?}
     */
    MdDatepickerContent.prototype._handleKeydown = function (event) {
        if (event.keyCode === ESCAPE) {
            this.datepicker.close();
            event.preventDefault();
            event.stopPropagation();
        }
    };
    return MdDatepickerContent;
}());
MdDatepickerContent.decorators = [
    { type: Component, args: [{ selector: 'md-datepicker-content, mat-datepicker-content',
                template: "<md-calendar cdkTrapFocus [id]=\"datepicker.id\" [startAt]=\"datepicker.startAt\" [startView]=\"datepicker.startView\" [minDate]=\"datepicker._minDate\" [maxDate]=\"datepicker._maxDate\" [dateFilter]=\"datepicker._dateFilter\" [selected]=\"datepicker._selected\" (selectedChange)=\"datepicker._select($event)\" (userSelection)=\"datepicker.close()\"></md-calendar>",
                styles: [".mat-datepicker-content{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);display:block}.mat-calendar{width:296px;height:354px}.mat-datepicker-content-touch{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);display:block;max-height:80vh;overflow:auto;margin:-24px}.mat-datepicker-content-touch .mat-calendar{min-width:250px;min-height:312px;max-width:750px;max-height:788px}@media all and (orientation:landscape){.mat-datepicker-content-touch .mat-calendar{width:64vh;height:80vh}}@media all and (orientation:portrait){.mat-datepicker-content-touch .mat-calendar{width:80vw;height:100vw}}"],
                host: {
                    'class': 'mat-datepicker-content',
                    '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                    '(keydown)': '_handleKeydown($event)',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdDatepickerContent.ctorParameters = function () { return []; };
MdDatepickerContent.propDecorators = {
    '_calendar': [{ type: ViewChild, args: [MdCalendar,] },],
};
/**
 * Component responsible for managing the datepicker popup/dialog.
 */
var MdDatepicker = (function () {
    /**
     * @param {?} _dialog
     * @param {?} _overlay
     * @param {?} _ngZone
     * @param {?} _viewContainerRef
     * @param {?} _scrollStrategy
     * @param {?} _dateAdapter
     * @param {?} _dir
     * @param {?} _document
     */
    function MdDatepicker(_dialog, _overlay, _ngZone, _viewContainerRef, _scrollStrategy, _dateAdapter, _dir, _document) {
        this._dialog = _dialog;
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._scrollStrategy = _scrollStrategy;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = _document;
        /**
         * The view that the calendar should start in.
         */
        this.startView = 'month';
        /**
         * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
         * than a popup and elements have more padding to allow for bigger touch targets.
         */
        this.touchUi = false;
        /**
         * Emits new selected date when selected date changes.
         * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
         */
        this.selectedChanged = new EventEmitter();
        /**
         * Whether the calendar is open.
         */
        this.opened = false;
        /**
         * The id for the datepicker calendar.
         */
        this.id = "md-datepicker-" + datepickerUid++;
        this._validSelected = null;
        /**
         * The element that was focused before the datepicker was opened.
         */
        this._focusedElementBeforeOpen = null;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
    }
    Object.defineProperty(MdDatepicker.prototype, "startAt", {
        /**
         * The date to open the calendar to initially.
         * @return {?}
         */
        get: function () {
            // If an explicit startAt is set we start there, otherwise we start at whatever the currently
            // selected value is.
            return this._startAt || (this._datepickerInput ? this._datepickerInput.value : null);
        },
        /**
         * @param {?} date
         * @return {?}
         */
        set: function (date) { this._startAt = date; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "disabled", {
        /**
         * Whether the datepicker pop-up should be disabled.
         * @return {?}
         */
        get: function () {
            return this._disabled === undefined ? this._datepickerInput.disabled : this._disabled;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_selected", {
        /**
         * The currently selected date.
         * @return {?}
         */
        get: function () { return this._validSelected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._validSelected = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_minDate", {
        /**
         * The minimum selectable date.
         * @return {?}
         */
        get: function () {
            return this._datepickerInput && this._datepickerInput.min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_maxDate", {
        /**
         * The maximum selectable date.
         * @return {?}
         */
        get: function () {
            return this._datepickerInput && this._datepickerInput.max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_dateFilter", {
        /**
         * @return {?}
         */
        get: function () {
            return this._datepickerInput && this._datepickerInput._dateFilter;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdDatepicker.prototype.ngOnDestroy = function () {
        this.close();
        if (this._popupRef) {
            this._popupRef.dispose();
        }
        if (this._inputSubscription) {
            this._inputSubscription.unsubscribe();
        }
    };
    /**
     * Selects the given date
     * @param {?} date
     * @return {?}
     */
    MdDatepicker.prototype._select = function (date) {
        var /** @type {?} */ oldValue = this._selected;
        this._selected = date;
        if (!this._dateAdapter.sameDate(oldValue, this._selected)) {
            this.selectedChanged.emit(date);
        }
    };
    /**
     * Register an input with this datepicker.
     * @param {?} input The datepicker input to register with this datepicker.
     * @return {?}
     */
    MdDatepicker.prototype._registerInput = function (input) {
        var _this = this;
        if (this._datepickerInput) {
            throw Error('An MdDatepicker can only be associated with a single input.');
        }
        this._datepickerInput = input;
        this._inputSubscription =
            this._datepickerInput._valueChange.subscribe(function (value) { return _this._selected = value; });
    };
    /**
     * Open the calendar.
     * @return {?}
     */
    MdDatepicker.prototype.open = function () {
        if (this.opened || this.disabled) {
            return;
        }
        if (!this._datepickerInput) {
            throw Error('Attempted to open an MdDatepicker with no associated input.');
        }
        if (this._document) {
            this._focusedElementBeforeOpen = this._document.activeElement;
        }
        this.touchUi ? this._openAsDialog() : this._openAsPopup();
        this.opened = true;
    };
    /**
     * Close the calendar.
     * @return {?}
     */
    MdDatepicker.prototype.close = function () {
        if (!this.opened) {
            return;
        }
        if (this._popupRef && this._popupRef.hasAttached()) {
            this._popupRef.detach();
        }
        if (this._dialogRef) {
            this._dialogRef.close();
            this._dialogRef = null;
        }
        if (this._calendarPortal && this._calendarPortal.isAttached) {
            this._calendarPortal.detach();
        }
        if (this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function') {
            this._focusedElementBeforeOpen.focus();
            this._focusedElementBeforeOpen = null;
        }
        this.opened = false;
    };
    /**
     * Open the calendar as a dialog.
     * @return {?}
     */
    MdDatepicker.prototype._openAsDialog = function () {
        var _this = this;
        this._dialogRef = this._dialog.open(MdDatepickerContent, {
            direction: this._dir ? this._dir.value : 'ltr',
            viewContainerRef: this._viewContainerRef,
        });
        this._dialogRef.afterClosed().subscribe(function () { return _this.close(); });
        this._dialogRef.componentInstance.datepicker = this;
    };
    /**
     * Open the calendar as a popup.
     * @return {?}
     */
    MdDatepicker.prototype._openAsPopup = function () {
        var _this = this;
        if (!this._calendarPortal) {
            this._calendarPortal = new ComponentPortal(MdDatepickerContent, this._viewContainerRef);
        }
        if (!this._popupRef) {
            this._createPopup();
        }
        if (!this._popupRef.hasAttached()) {
            var /** @type {?} */ componentRef = this._popupRef.attach(this._calendarPortal);
            componentRef.instance.datepicker = this;
            // Update the position once the calendar has rendered.
            first.call(this._ngZone.onStable).subscribe(function () { return _this._popupRef.updatePosition(); });
        }
        this._popupRef.backdropClick().subscribe(function () { return _this.close(); });
    };
    /**
     * Create the popup.
     * @return {?}
     */
    MdDatepicker.prototype._createPopup = function () {
        var /** @type {?} */ overlayState = new OverlayState();
        overlayState.positionStrategy = this._createPopupPositionStrategy();
        overlayState.hasBackdrop = true;
        overlayState.backdropClass = 'md-overlay-transparent-backdrop';
        overlayState.direction = this._dir ? this._dir.value : 'ltr';
        overlayState.scrollStrategy = this._scrollStrategy();
        this._popupRef = this._overlay.create(overlayState);
    };
    /**
     * Create the popup PositionStrategy.
     * @return {?}
     */
    MdDatepicker.prototype._createPopupPositionStrategy = function () {
        return this._overlay.position()
            .connectedTo(this._datepickerInput.getPopupConnectionElementRef(), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
            .withFallbackPosition({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' })
            .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' });
    };
    return MdDatepicker;
}());
MdDatepicker.decorators = [
    { type: Component, args: [{ selector: 'md-datepicker, mat-datepicker',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdDatepicker.ctorParameters = function () { return [
    { type: MdDialog, },
    { type: Overlay, },
    { type: NgZone, },
    { type: ViewContainerRef, },
    { type: undefined, decorators: [{ type: Inject, args: [MD_DATEPICKER_SCROLL_STRATEGY,] },] },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
]; };
MdDatepicker.propDecorators = {
    'startAt': [{ type: Input },],
    'startView': [{ type: Input },],
    'touchUi': [{ type: Input },],
    'disabled': [{ type: Input },],
    'selectedChanged': [{ type: Output },],
};
var MD_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdDatepickerInput; }),
    multi: true
};
var MD_DATEPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MdDatepickerInput; }),
    multi: true
};
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MdDatepickerInputEvent instead.
 */
var MdDatepickerInputEvent = (function () {
    /**
     * @param {?} target
     * @param {?} targetElement
     */
    function MdDatepickerInputEvent(target, targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
    return MdDatepickerInputEvent;
}());
/**
 * Directive used to connect an input to a MdDatepicker.
 */
var MdDatepickerInput = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} _mdFormField
     */
    function MdDatepickerInput(_elementRef, _renderer, _dateAdapter, _dateFormats, _mdFormField) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._mdFormField = _mdFormField;
        /**
         * Emits when a `change` event is fired on this `<input>`.
         */
        this.dateChange = new EventEmitter();
        /**
         * Emits when an `input` event is fired on this `<input>`.
         */
        this.dateInput = new EventEmitter();
        /**
         * Emits when the value changes (either due to user input or programmatic change).
         */
        this._valueChange = new EventEmitter();
        this._onTouched = function () { };
        this._cvaOnChange = function () { };
        this._validatorOnChange = function () { };
        /**
         * The form control validator for whether the input parses.
         */
        this._parseValidator = function () {
            return _this._lastValueValid ?
                null : { 'mdDatepickerParse': { 'text': _this._elementRef.nativeElement.value } };
        };
        /**
         * The form control validator for the min date.
         */
        this._minValidator = function (control) {
            return (!_this.min || !control.value ||
                _this._dateAdapter.compareDate(_this.min, control.value) <= 0) ?
                null : { 'mdDatepickerMin': { 'min': _this.min, 'actual': control.value } };
        };
        /**
         * The form control validator for the max date.
         */
        this._maxValidator = function (control) {
            return (!_this.max || !control.value ||
                _this._dateAdapter.compareDate(_this.max, control.value) >= 0) ?
                null : { 'mdDatepickerMax': { 'max': _this.max, 'actual': control.value } };
        };
        /**
         * The form control validator for the date filter.
         */
        this._filterValidator = function (control) {
            return !_this._dateFilter || !control.value || _this._dateFilter(control.value) ?
                null : { 'mdDatepickerFilter': true };
        };
        /**
         * The combined form control validator for this input.
         */
        this._validator = Validators.compose([this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator]);
        /**
         * Whether the last value set on the input was valid.
         */
        this._lastValueValid = false;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
    }
    Object.defineProperty(MdDatepickerInput.prototype, "mdDatepicker", {
        /**
         * The datepicker that this input is associated with.
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value) {
                this._datepicker = value;
                this._datepicker._registerInput(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "matDatepicker", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.mdDatepicker = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "mdDatepickerFilter", {
        /**
         * @param {?} filter
         * @return {?}
         */
        set: function (filter$$1) {
            this._dateFilter = filter$$1;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "matDatepickerFilter", {
        /**
         * @param {?} filter
         * @return {?}
         */
        set: function (filter$$1) {
            this.mdDatepickerFilter = filter$$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "value", {
        /**
         * The value of the input.
         * @return {?}
         */
        get: function () {
            return this._getValidDateOrNull(this._dateAdapter.parse(this._elementRef.nativeElement.value, this._dateFormats.parse.dateInput));
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value != null && !this._dateAdapter.isDateInstance(value)) {
                throw Error('Datepicker: value not recognized as a date object by DateAdapter.');
            }
            this._lastValueValid = !value || this._dateAdapter.isValid(value);
            value = this._getValidDateOrNull(value);
            var /** @type {?} */ oldDate = this.value;
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '');
            if (!this._dateAdapter.sameDate(oldDate, value)) {
                this._valueChange.emit(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "min", {
        /**
         * The minimum valid date.
         * @return {?}
         */
        get: function () { return this._min; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._min = value;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "max", {
        /**
         * The maximum valid date.
         * @return {?}
         */
        get: function () { return this._max; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._max = value;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepickerInput.prototype, "disabled", {
        /**
         * Whether the datepicker-input is disabled.
         * @return {?}
         */
        get: function () { return this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdDatepickerInput.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this._datepicker) {
            this._datepickerSubscription =
                this._datepicker.selectedChanged.subscribe(function (selected) {
                    _this.value = selected;
                    _this._cvaOnChange(selected);
                    _this._onTouched();
                    _this.dateInput.emit(new MdDatepickerInputEvent(_this, _this._elementRef.nativeElement));
                    _this.dateChange.emit(new MdDatepickerInputEvent(_this, _this._elementRef.nativeElement));
                });
        }
    };
    /**
     * @return {?}
     */
    MdDatepickerInput.prototype.ngOnDestroy = function () {
        if (this._datepickerSubscription) {
            this._datepickerSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MdDatepickerInput.prototype.registerOnValidatorChange = function (fn) {
        this._validatorOnChange = fn;
    };
    /**
     * @param {?} c
     * @return {?}
     */
    MdDatepickerInput.prototype.validate = function (c) {
        return this._validator ? this._validator(c) : null;
    };
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return {?} The element to connect the popup to.
     */
    MdDatepickerInput.prototype.getPopupConnectionElementRef = function () {
        return this._mdFormField ? this._mdFormField.underlineRef : this._elementRef;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    MdDatepickerInput.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MdDatepickerInput.prototype.registerOnChange = function (fn) {
        this._cvaOnChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MdDatepickerInput.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /**
     * @param {?} disabled
     * @return {?}
     */
    MdDatepickerInput.prototype.setDisabledState = function (disabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', disabled);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdDatepickerInput.prototype._onKeydown = function (event) {
        if (event.altKey && event.keyCode === DOWN_ARROW) {
            this._datepicker.open();
            event.preventDefault();
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    MdDatepickerInput.prototype._onInput = function (value) {
        var /** @type {?} */ date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
        this._lastValueValid = !date || this._dateAdapter.isValid(date);
        date = this._getValidDateOrNull(date);
        this._cvaOnChange(date);
        this._valueChange.emit(date);
        this.dateInput.emit(new MdDatepickerInputEvent(this, this._elementRef.nativeElement));
    };
    /**
     * @return {?}
     */
    MdDatepickerInput.prototype._onChange = function () {
        this.dateChange.emit(new MdDatepickerInputEvent(this, this._elementRef.nativeElement));
    };
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    MdDatepickerInput.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MdDatepickerInput;
}());
MdDatepickerInput.decorators = [
    { type: Directive, args: [{
                selector: 'input[mdDatepicker], input[matDatepicker]',
                providers: [MD_DATEPICKER_VALUE_ACCESSOR, MD_DATEPICKER_VALIDATORS],
                host: {
                    '[attr.aria-haspopup]': 'true',
                    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
                    '[attr.min]': 'min ? _dateAdapter.getISODateString(min) : null',
                    '[attr.max]': 'max ? _dateAdapter.getISODateString(max) : null',
                    '[disabled]': 'disabled',
                    '(input)': '_onInput($event.target.value)',
                    '(change)': '_onChange()',
                    '(blur)': '_onTouched()',
                    '(keydown)': '_onKeydown($event)',
                },
                exportAs: 'mdDatepickerInput',
            },] },
];
/**
 * @nocollapse
 */
MdDatepickerInput.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_DATE_FORMATS,] },] },
    { type: MdFormField, decorators: [{ type: Optional },] },
]; };
MdDatepickerInput.propDecorators = {
    'mdDatepicker': [{ type: Input },],
    'matDatepicker': [{ type: Input },],
    'mdDatepickerFilter': [{ type: Input },],
    'matDatepickerFilter': [{ type: Input },],
    'value': [{ type: Input },],
    'min': [{ type: Input },],
    'max': [{ type: Input },],
    'disabled': [{ type: Input },],
    'dateChange': [{ type: Output },],
    'dateInput': [{ type: Output },],
};
var MdDatepickerToggle = (function () {
    /**
     * @param {?} _intl
     * @param {?} changeDetectorRef
     */
    function MdDatepickerToggle(_intl, changeDetectorRef) {
        this._intl = _intl;
        this._intlChanges = _intl.changes.subscribe(function () { return changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MdDatepickerToggle.prototype, "disabled", {
        /**
         * Whether the toggle button is disabled.
         * @return {?}
         */
        get: function () {
            return this._disabled === undefined ? this.datepicker.disabled : this._disabled;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdDatepickerToggle.prototype.ngOnDestroy = function () {
        this._intlChanges.unsubscribe();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdDatepickerToggle.prototype._open = function (event) {
        if (this.datepicker && !this.disabled) {
            this.datepicker.open();
            event.stopPropagation();
        }
    };
    return MdDatepickerToggle;
}());
MdDatepickerToggle.decorators = [
    { type: Component, args: [{ selector: 'md-datepicker-toggle, mat-datepicker-toggle',
                template: "<button md-icon-button type=\"button\" [attr.aria-label]=\"_intl.openCalendarLabel\" [disabled]=\"disabled\" (click)=\"_open($event)\"><md-icon><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"100%\" height=\"100%\" fill=\"currentColor\" style=\"vertical-align: top\" focusable=\"false\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/></svg></md-icon></button>",
                host: {
                    'class': 'mat-datepicker-toggle',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdDatepickerToggle.ctorParameters = function () { return [
    { type: MdDatepickerIntl, },
    { type: ChangeDetectorRef, },
]; };
MdDatepickerToggle.propDecorators = {
    'datepicker': [{ type: Input, args: ['for',] },],
    'disabled': [{ type: Input },],
};
var MdDatepickerModule = (function () {
    function MdDatepickerModule() {
    }
    return MdDatepickerModule;
}());
MdDatepickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MdButtonModule,
                    MdDialogModule,
                    MdIconModule,
                    OverlayModule,
                    StyleModule,
                    A11yModule,
                ],
                exports: [
                    MdCalendar,
                    MdCalendarBody,
                    MdDatepicker,
                    MdDatepickerContent,
                    MdDatepickerInput,
                    MdDatepickerToggle,
                    MdMonthView,
                    MdYearView,
                ],
                declarations: [
                    MdCalendar,
                    MdCalendarBody,
                    MdDatepicker,
                    MdDatepickerContent,
                    MdDatepickerInput,
                    MdDatepickerToggle,
                    MdMonthView,
                    MdYearView,
                ],
                providers: [
                    MdDatepickerIntl,
                    MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER,
                ],
                entryComponents: [
                    MdDatepickerContent,
                ]
            },] },
];
/**
 * @nocollapse
 */
MdDatepickerModule.ctorParameters = function () { return []; };
/**
 * Unique ID counter
 */
var nextId$1 = 0;
/**
 * Directive whose purpose is to manage the expanded state of CdkAccordionItem children.
 */
var CdkAccordion = (function () {
    function CdkAccordion() {
        /**
         * A readonly id value to use for unique selection coordination.
         */
        this.id = "cdk-accordion-" + nextId$1++;
        this._multi = false;
        this._hideToggle = false;
        /**
         * The display mode used for all expansion panels in the accordion. Currently two display
         * modes exist:
         *   default - a gutter-like spacing is placed around any expanded panel, placing the expanded
         *     panel at a different elevation from the reset of the accordion.
         *  flat - no spacing is placed around expanded panels, showing all panels at the same
         *     elevation.
         */
        this.displayMode = 'default';
    }
    Object.defineProperty(CdkAccordion.prototype, "multi", {
        /**
         * Whether the accordion should allow multiple expanded accordion items simulateously.
         * @return {?}
         */
        get: function () { return this._multi; },
        /**
         * @param {?} multi
         * @return {?}
         */
        set: function (multi) { this._multi = coerceBooleanProperty(multi); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkAccordion.prototype, "hideToggle", {
        /**
         * Whether the expansion indicator should be hidden.
         * @return {?}
         */
        get: function () { return this._hideToggle; },
        /**
         * @param {?} show
         * @return {?}
         */
        set: function (show) { this._hideToggle = coerceBooleanProperty(show); },
        enumerable: true,
        configurable: true
    });
    return CdkAccordion;
}());
CdkAccordion.decorators = [
    { type: Directive, args: [{
                selector: 'cdk-accordion, [cdk-accordion]',
            },] },
];
/**
 * @nocollapse
 */
CdkAccordion.ctorParameters = function () { return []; };
CdkAccordion.propDecorators = {
    'multi': [{ type: Input },],
    'hideToggle': [{ type: Input },],
    'displayMode': [{ type: Input },],
};
/**
 * Directive for a Material Design Accordion.
 */
var MdAccordion = (function (_super) {
    tslib_1.__extends(MdAccordion, _super);
    function MdAccordion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdAccordion;
}(CdkAccordion));
MdAccordion.decorators = [
    { type: Directive, args: [{
                selector: 'mat-accordion, md-accordion',
                host: {
                    class: 'mat-accordion'
                }
            },] },
];
/**
 * @nocollapse
 */
MdAccordion.ctorParameters = function () { return []; };
/**
 * Used to generate unique ID for each expansion panel.
 */
var nextId$2 = 0;
/**
 * \@docs-private
 */
var AccordionItemBase = (function () {
    function AccordionItemBase() {
    }
    return AccordionItemBase;
}());
var _AccordionItemMixinBase = mixinDisabled(AccordionItemBase);
/**
 * An abstract class to be extended and decorated as a component.  Sets up all
 * events and attributes needed to be managed by a CdkAccordion parent.
 */
var AccordionItem = (function (_super) {
    tslib_1.__extends(AccordionItem, _super);
    /**
     * @param {?} accordion
     * @param {?} _changeDetectorRef
     * @param {?} _expansionDispatcher
     */
    function AccordionItem(accordion, _changeDetectorRef, _expansionDispatcher) {
        var _this = _super.call(this) || this;
        _this.accordion = accordion;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._expansionDispatcher = _expansionDispatcher;
        /**
         * Event emitted every time the MdAccordionChild is closed.
         */
        _this.closed = new EventEmitter();
        /**
         * Event emitted every time the MdAccordionChild is opened.
         */
        _this.opened = new EventEmitter();
        /**
         * Event emitted when the MdAccordionChild is destroyed.
         */
        _this.destroyed = new EventEmitter();
        /**
         * The unique MdAccordionChild id.
         */
        _this.id = "cdk-accordion-child-" + nextId$2++;
        /**
         * Unregister function for _expansionDispatcher *
         */
        _this._removeUniqueSelectionListener = function () { };
        _this._removeUniqueSelectionListener =
            _expansionDispatcher.listen(function (id, accordionId) {
                if (_this.accordion && !_this.accordion.multi &&
                    _this.accordion.id === accordionId && _this.id !== id) {
                    _this.expanded = false;
                }
            });
        return _this;
    }
    Object.defineProperty(AccordionItem.prototype, "expanded", {
        /**
         * Whether the MdAccordionChild is expanded.
         * @return {?}
         */
        get: function () { return this._expanded; },
        /**
         * @param {?} expanded
         * @return {?}
         */
        set: function (expanded) {
            // Only emit events and update the internal value if the value changes.
            if (this._expanded !== expanded) {
                this._expanded = expanded;
                if (expanded) {
                    this.opened.emit();
                    /**
                     * In the unique selection dispatcher, the id parameter is the id of the CdkAccordionItem,
                     * the name value is the id of the accordion.
                     */
                    var accordionId = this.accordion ? this.accordion.id : this.id;
                    this._expansionDispatcher.notify(this.id, accordionId);
                }
                else {
                    this.closed.emit();
                }
                // Ensures that the animation will run when the value is set outside of an `@Input`.
                // This includes cases like the open, close and toggle methods.
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Emits an event for the accordion item being destroyed.
     * @return {?}
     */
    AccordionItem.prototype.ngOnDestroy = function () {
        this.destroyed.emit();
        this._removeUniqueSelectionListener();
    };
    /**
     * Toggles the expanded state of the accordion item.
     * @return {?}
     */
    AccordionItem.prototype.toggle = function () {
        this.expanded = !this.expanded;
    };
    /**
     * Sets the expanded state of the accordion item to false.
     * @return {?}
     */
    AccordionItem.prototype.close = function () {
        this.expanded = false;
    };
    /**
     * Sets the expanded state of the accordion item to true.
     * @return {?}
     */
    AccordionItem.prototype.open = function () {
        this.expanded = true;
    };
    return AccordionItem;
}(_AccordionItemMixinBase));
AccordionItem.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
AccordionItem.ctorParameters = function () { return [
    { type: CdkAccordion, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
    { type: UniqueSelectionDispatcher, },
]; };
AccordionItem.propDecorators = {
    'closed': [{ type: Output },],
    'opened': [{ type: Output },],
    'destroyed': [{ type: Output },],
    'expanded': [{ type: Input },],
};
/**
 * Time and timing curve for expansion panel animations.
 */
var EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
/**
 * <md-expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the CdkAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MdExpansionPanel = (function (_super) {
    tslib_1.__extends(MdExpansionPanel, _super);
    /**
     * @param {?} accordion
     * @param {?} _changeDetectorRef
     * @param {?} _uniqueSelectionDispatcher
     */
    function MdExpansionPanel(accordion, _changeDetectorRef, _uniqueSelectionDispatcher) {
        var _this = _super.call(this, accordion, _changeDetectorRef, _uniqueSelectionDispatcher) || this;
        /**
         * Whether the toggle indicator should be hidden.
         */
        _this.hideToggle = false;
        /**
         * Stream that emits for changes in `\@Input` properties.
         */
        _this._inputChanges = new Subject();
        _this.accordion = accordion;
        return _this;
    }
    /**
     * Whether the expansion indicator should be hidden.
     * @return {?}
     */
    MdExpansionPanel.prototype._getHideToggle = function () {
        if (this.accordion) {
            return this.accordion.hideToggle;
        }
        return this.hideToggle;
    };
    /**
     * Determines whether the expansion panel should have spacing between it and its siblings.
     * @return {?}
     */
    MdExpansionPanel.prototype._hasSpacing = function () {
        if (this.accordion) {
            return (this.expanded ? this.accordion.displayMode : this._getExpandedState()) === 'default';
        }
        return false;
    };
    /**
     * Gets the expanded state string.
     * @return {?}
     */
    MdExpansionPanel.prototype._getExpandedState = function () {
        return this.expanded ? 'expanded' : 'collapsed';
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    MdExpansionPanel.prototype.ngOnChanges = function (changes) {
        this._inputChanges.next(changes);
    };
    /**
     * @return {?}
     */
    MdExpansionPanel.prototype.ngOnDestroy = function () {
        this._inputChanges.complete();
    };
    return MdExpansionPanel;
}(AccordionItem));
MdExpansionPanel.decorators = [
    { type: Component, args: [{ styles: [".mat-expansion-panel{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);box-sizing:content-box;display:block;margin:0;transition:margin 225ms cubic-bezier(.4,0,.2,1)}.mat-expansion-panel:not([class*=mat-elevation-z]){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.mat-expansion-panel-content{overflow:hidden}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion .mat-expansion-panel-spacing:first-child{margin-top:0}.mat-accordion .mat-expansion-panel-spacing:last-child{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button{margin-left:8px}[dir=rtl] .mat-action-row button.mat-button{margin-left:0;margin-right:8px}"],
                selector: 'md-expansion-panel, mat-expansion-panel',
                template: "<ng-content select=\"mat-expansion-panel-header, md-expansion-panel-header\"></ng-content><div [class.mat-expanded]=\"expanded\" class=\"mat-expansion-panel-content\" [@bodyExpansion]=\"_getExpandedState()\" [id]=\"id\"><div class=\"mat-expansion-panel-body\"><ng-content></ng-content></div><ng-content select=\"mat-action-row, md-action-row\"></ng-content></div>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: ['disabled'],
                host: {
                    'class': 'mat-expansion-panel',
                    '[class.mat-expanded]': 'expanded',
                    '[class.mat-expansion-panel-spacing]': '_hasSpacing()',
                },
                providers: [
                    { provide: AccordionItem, useExisting: forwardRef(function () { return MdExpansionPanel; }) }
                ],
                animations: [
                    trigger('bodyExpansion', [
                        state('collapsed', style({ height: '0px', visibility: 'hidden' })),
                        state('expanded', style({ height: '*', visibility: 'visible' })),
                        transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
                    ]),
                ],
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanel.ctorParameters = function () { return [
    { type: MdAccordion, decorators: [{ type: Optional }, { type: Host },] },
    { type: ChangeDetectorRef, },
    { type: UniqueSelectionDispatcher, },
]; };
MdExpansionPanel.propDecorators = {
    'hideToggle': [{ type: Input },],
};
var MdExpansionPanelActionRow = (function () {
    function MdExpansionPanelActionRow() {
    }
    return MdExpansionPanelActionRow;
}());
MdExpansionPanelActionRow.decorators = [
    { type: Directive, args: [{
                selector: 'mat-action-row, md-action-row',
                host: {
                    class: 'mat-action-row'
                }
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanelActionRow.ctorParameters = function () { return []; };
/**
 * <md-expansion-panel-header> component.
 *
 * This component corresponds to the header element of an <md-expansion-panel>.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MdExpansionPanelHeader = (function () {
    /**
     * @param {?} panel
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _focusOriginMonitor
     * @param {?} _changeDetectorRef
     */
    function MdExpansionPanelHeader(panel, _renderer, _element, _focusOriginMonitor, _changeDetectorRef) {
        var _this = this;
        this.panel = panel;
        this._renderer = _renderer;
        this._element = _element;
        this._focusOriginMonitor = _focusOriginMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._parentChangeSubscription = null;
        // Since the toggle state depends on an @Input on the panel, we
        // need to  subscribe and trigger change detection manually.
        this._parentChangeSubscription = merge(panel.opened, panel.closed, filter.call(panel._inputChanges, function (changes) { return !!(changes.hideToggle || changes.disabled); }))
            .subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
        _focusOriginMonitor.monitor(_element.nativeElement, _renderer, false);
    }
    /**
     * Toggles the expanded state of the panel.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._toggle = function () {
        if (!this.panel.disabled) {
            this.panel.toggle();
        }
    };
    /**
     * Gets whether the panel is expanded.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._isExpanded = function () {
        return this.panel.expanded;
    };
    /**
     * Gets the expanded state string of the panel.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._getExpandedState = function () {
        return this.panel._getExpandedState();
    };
    /**
     * Gets the panel id.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._getPanelId = function () {
        return this.panel.id;
    };
    /**
     * Gets whether the expand indicator should be shown.
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._showToggle = function () {
        return !this.panel.hideToggle && !this.panel.disabled;
    };
    /**
     * Handle keyup event calling to toggle() if appropriate.
     * @param {?} event
     * @return {?}
     */
    MdExpansionPanelHeader.prototype._keyup = function (event) {
        switch (event.keyCode) {
            // Toggle for space and enter keys.
            case SPACE:
            case ENTER:
                event.preventDefault();
                this._toggle();
                break;
            default:
                return;
        }
    };
    /**
     * @return {?}
     */
    MdExpansionPanelHeader.prototype.ngOnDestroy = function () {
        if (this._parentChangeSubscription) {
            this._parentChangeSubscription.unsubscribe();
            this._parentChangeSubscription = null;
        }
        this._focusOriginMonitor.stopMonitoring(this._element.nativeElement);
    };
    return MdExpansionPanelHeader;
}());
MdExpansionPanelHeader.decorators = [
    { type: Component, args: [{ selector: 'md-expansion-panel-header, mat-expansion-panel-header',
                styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:0}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-description,.mat-expansion-panel-header-title{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-description,[dir=rtl] .mat-expansion-panel-header-title{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:'';display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}"],
                template: "<span class=\"mat-content\"><ng-content select=\"md-panel-title, mat-panel-title\"></ng-content><ng-content select=\"md-panel-description, mat-panel-description\"></ng-content><ng-content></ng-content></span><span [@indicatorRotate]=\"_getExpandedState()\" *ngIf=\"_showToggle()\" class=\"mat-expansion-indicator\"></span>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-expansion-panel-header',
                    'role': 'button',
                    '[attr.tabindex]': 'panel.disabled ? -1 : 0',
                    '[attr.aria-controls]': '_getPanelId()',
                    '[attr.aria-expanded]': '_isExpanded()',
                    '[attr.aria-disabled]': 'panel.disabled',
                    '[class.mat-expanded]': '_isExpanded()',
                    '(click)': '_toggle()',
                    '(keyup)': '_keyup($event)',
                    '[@expansionHeight]': '_getExpandedState()',
                },
                animations: [
                    trigger('indicatorRotate', [
                        state('collapsed', style({ transform: 'rotate(0deg)' })),
                        state('expanded', style({ transform: 'rotate(180deg)' })),
                        transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
                    ]),
                    trigger('expansionHeight', [
                        state('collapsed', style({ height: '48px' })),
                        state('expanded', style({ height: '64px' })),
                        transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
                    ]),
                ],
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanelHeader.ctorParameters = function () { return [
    { type: MdExpansionPanel, decorators: [{ type: Host },] },
    { type: Renderer2, },
    { type: ElementRef, },
    { type: FocusOriginMonitor, },
    { type: ChangeDetectorRef, },
]; };
/**
 * <md-panel-description> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
var MdExpansionPanelDescription = (function () {
    function MdExpansionPanelDescription() {
    }
    return MdExpansionPanelDescription;
}());
MdExpansionPanelDescription.decorators = [
    { type: Directive, args: [{
                selector: 'md-panel-description, mat-panel-description',
                host: {
                    class: 'mat-expansion-panel-header-description'
                }
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanelDescription.ctorParameters = function () { return []; };
/**
 * <md-panel-title> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
var MdExpansionPanelTitle = (function () {
    function MdExpansionPanelTitle() {
    }
    return MdExpansionPanelTitle;
}());
MdExpansionPanelTitle.decorators = [
    { type: Directive, args: [{
                selector: 'md-panel-title, mat-panel-title',
                host: {
                    class: 'mat-expansion-panel-header-title'
                }
            },] },
];
/**
 * @nocollapse
 */
MdExpansionPanelTitle.ctorParameters = function () { return []; };
var MdExpansionModule = (function () {
    function MdExpansionModule() {
    }
    return MdExpansionModule;
}());
MdExpansionModule.decorators = [
    { type: NgModule, args: [{
                imports: [CompatibilityModule, CommonModule, StyleModule],
                exports: [
                    CdkAccordion,
                    MdAccordion,
                    MdExpansionPanel,
                    MdExpansionPanelActionRow,
                    MdExpansionPanelHeader,
                    MdExpansionPanelTitle,
                    MdExpansionPanelDescription
                ],
                declarations: [
                    CdkAccordion,
                    MdAccordion,
                    MdExpansionPanel,
                    MdExpansionPanelActionRow,
                    MdExpansionPanelHeader,
                    MdExpansionPanelTitle,
                    MdExpansionPanelDescription
                ],
                providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER]
            },] },
];
/**
 * @nocollapse
 */
MdExpansionModule.ctorParameters = function () { return []; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdTable = CdkTable;
/**
 * Wrapper for the CdkTable with Material design styles.
 */
var MdTable = (function (_super) {
    tslib_1.__extends(MdTable, _super);
    function MdTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdTable;
}(_MdTable));
MdTable.decorators = [
    { type: Component, args: [{ selector: 'md-table, mat-table',
                template: CDK_TABLE_TEMPLATE,
                styles: [".mat-table{display:block}.mat-header-row,.mat-row{display:flex;border-bottom-width:1px;border-bottom-style:solid;align-items:center;min-height:48px;padding:0 24px}.mat-cell,.mat-header-cell{flex:1}"],
                host: {
                    'class': 'mat-table',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdTable.ctorParameters = function () { return []; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdCellDef = CdkCellDef;
var _MdHeaderCellDef = CdkHeaderCellDef;
var _MdColumnDef = CdkColumnDef;
var _MdHeaderCell = CdkHeaderCell;
var _MdCell = CdkCell;
/**
 * Cell definition for the md-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
var MdCellDef = (function (_super) {
    tslib_1.__extends(MdCellDef, _super);
    function MdCellDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdCellDef;
}(_MdCellDef));
MdCellDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdCellDef], [matCellDef]',
                providers: [{ provide: CdkCellDef, useExisting: MdCellDef }]
            },] },
];
/**
 * @nocollapse
 */
MdCellDef.ctorParameters = function () { return []; };
/**
 * Header cell definition for the md-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
var MdHeaderCellDef = (function (_super) {
    tslib_1.__extends(MdHeaderCellDef, _super);
    function MdHeaderCellDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdHeaderCellDef;
}(_MdHeaderCellDef));
MdHeaderCellDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdHeaderCellDef], [matHeaderCellDef]',
                providers: [{ provide: CdkHeaderCellDef, useExisting: MdHeaderCellDef }]
            },] },
];
/**
 * @nocollapse
 */
MdHeaderCellDef.ctorParameters = function () { return []; };
/**
 * Column definition for the md-table.
 * Defines a set of cells available for a table column.
 */
var MdColumnDef = (function (_super) {
    tslib_1.__extends(MdColumnDef, _super);
    function MdColumnDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MdColumnDef.prototype, "_matColumnDefName", {
        /**
         * @return {?}
         */
        get: function () { return this.name; },
        /**
         * @param {?} name
         * @return {?}
         */
        set: function (name) { this.name = name; },
        enumerable: true,
        configurable: true
    });
    return MdColumnDef;
}(_MdColumnDef));
MdColumnDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdColumnDef], [matColumnDef]',
                providers: [{ provide: CdkColumnDef, useExisting: MdColumnDef }],
            },] },
];
/**
 * @nocollapse
 */
MdColumnDef.ctorParameters = function () { return []; };
MdColumnDef.propDecorators = {
    'name': [{ type: Input, args: ['mdColumnDef',] },],
    '_matColumnDefName': [{ type: Input, args: ['matColumnDef',] },],
};
/**
 * Header cell template container that adds the right classes and role.
 */
var MdHeaderCell = (function (_super) {
    tslib_1.__extends(MdHeaderCell, _super);
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MdHeaderCell(columnDef, elementRef, renderer) {
        var _this = _super.call(this, columnDef, elementRef, renderer) || this;
        renderer.addClass(elementRef.nativeElement, "mat-column-" + columnDef.cssClassFriendlyName);
        return _this;
    }
    return MdHeaderCell;
}(_MdHeaderCell));
MdHeaderCell.decorators = [
    { type: Directive, args: [{
                selector: 'md-header-cell, mat-header-cell',
                host: {
                    'class': 'mat-header-cell',
                    'role': 'columnheader',
                },
            },] },
];
/**
 * @nocollapse
 */
MdHeaderCell.ctorParameters = function () { return [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
]; };
/**
 * Cell template container that adds the right classes and role.
 */
var MdCell = (function (_super) {
    tslib_1.__extends(MdCell, _super);
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MdCell(columnDef, elementRef, renderer) {
        var _this = _super.call(this, columnDef, elementRef, renderer) || this;
        renderer.addClass(elementRef.nativeElement, "mat-column-" + columnDef.cssClassFriendlyName);
        return _this;
    }
    return MdCell;
}(_MdCell));
MdCell.decorators = [
    { type: Directive, args: [{
                selector: 'md-cell, mat-cell',
                host: {
                    'class': 'mat-cell',
                    'role': 'gridcell',
                },
            },] },
];
/**
 * @nocollapse
 */
MdCell.ctorParameters = function () { return [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
]; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdHeaderRowDef = CdkHeaderRowDef;
var _MdCdkRowDef = CdkRowDef;
var _MdHeaderRow = CdkHeaderRow;
var _MdRow = CdkRow;
/**
 * Header row definition for the md-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
var MdHeaderRowDef = (function (_super) {
    tslib_1.__extends(MdHeaderRowDef, _super);
    function MdHeaderRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdHeaderRowDef;
}(_MdHeaderRowDef));
MdHeaderRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdHeaderRowDef]',
                providers: [{ provide: CdkHeaderRowDef, useExisting: MdHeaderRowDef }],
                inputs: ['columns: mdHeaderRowDef'],
            },] },
];
/**
 * @nocollapse
 */
MdHeaderRowDef.ctorParameters = function () { return []; };
/**
 * Mat-compatible version of MdHeaderRowDef
 */
var MatHeaderRowDef = (function (_super) {
    tslib_1.__extends(MatHeaderRowDef, _super);
    function MatHeaderRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatHeaderRowDef;
}(_MdHeaderRowDef));
MatHeaderRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[matHeaderRowDef]',
                providers: [{ provide: CdkHeaderRowDef, useExisting: MatHeaderRowDef }],
                inputs: ['columns: matHeaderRowDef'],
            },] },
];
/**
 * @nocollapse
 */
MatHeaderRowDef.ctorParameters = function () { return []; };
/**
 * Data row definition for the md-table.
 * Captures the header row's template and other row properties such as the columns to display.
 */
var MdRowDef = (function (_super) {
    tslib_1.__extends(MdRowDef, _super);
    function MdRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdRowDef;
}(_MdCdkRowDef));
MdRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdRowDef]',
                providers: [{ provide: CdkRowDef, useExisting: MdRowDef }],
                inputs: ['columns: mdRowDefColumns'],
            },] },
];
/**
 * @nocollapse
 */
MdRowDef.ctorParameters = function () { return []; };
/**
 * Mat-compatible version of MdRowDef
 */
var MatRowDef = (function (_super) {
    tslib_1.__extends(MatRowDef, _super);
    function MatRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatRowDef;
}(_MdCdkRowDef));
MatRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[matRowDef]',
                providers: [{ provide: CdkRowDef, useExisting: MatRowDef }],
                inputs: ['columns: matRowDefColumns'],
            },] },
];
/**
 * @nocollapse
 */
MatRowDef.ctorParameters = function () { return []; };
/**
 * Header template container that contains the cell outlet. Adds the right class and role.
 */
var MdHeaderRow = (function (_super) {
    tslib_1.__extends(MdHeaderRow, _super);
    function MdHeaderRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdHeaderRow;
}(_MdHeaderRow));
MdHeaderRow.decorators = [
    { type: Component, args: [{
                selector: 'md-header-row, mat-header-row',
                template: CDK_ROW_TEMPLATE,
                host: {
                    'class': 'mat-header-row',
                    'role': 'row',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdHeaderRow.ctorParameters = function () { return []; };
/**
 * Data row template container that contains the cell outlet. Adds the right class and role.
 */
var MdRow = (function (_super) {
    tslib_1.__extends(MdRow, _super);
    function MdRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdRow;
}(_MdRow));
MdRow.decorators = [
    { type: Component, args: [{
                selector: 'md-row, mat-row',
                template: CDK_ROW_TEMPLATE,
                host: {
                    'class': 'mat-row',
                    'role': 'row',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdRow.ctorParameters = function () { return []; };
var MdTableModule = (function () {
    function MdTableModule() {
    }
    return MdTableModule;
}());
MdTableModule.decorators = [
    { type: NgModule, args: [{
                imports: [CdkTableModule, CommonModule, MdCommonModule],
                exports: [MdTable, MdCellDef, MdHeaderCellDef, MdColumnDef,
                    MdHeaderRowDef, MdRowDef,
                    MdHeaderCell, MdCell, MdHeaderRow, MdRow,
                    MatHeaderRowDef, MatRowDef],
                declarations: [MdTable, MdCellDef, MdHeaderCellDef, MdColumnDef,
                    MdHeaderRowDef, MdRowDef,
                    MdHeaderCell, MdCell, MdHeaderRow, MdRow,
                    MatHeaderRowDef, MatRowDef],
            },] },
];
/**
 * @nocollapse
 */
MdTableModule.ctorParameters = function () { return []; };
/**
 * \@docs-private
 * @param {?} id
 * @return {?}
 */
function getMdSortDuplicateMdSortableIdError(id) {
    return Error("Cannot have two MdSortables with the same id (" + id + ").");
}
/**
 * \@docs-private
 * @return {?}
 */
function getMdSortHeaderNotContainedWithinMdSortError() {
    return Error("MdSortHeader must be placed within a parent element with the MdSort directive.");
}
/**
 * \@docs-private
 * @return {?}
 */
function getMdSortHeaderMissingIdError() {
    return Error("MdSortHeader must be provided with a unique id.");
}
/**
 * Container for MdSortables to manage the sort state and provide default sort parameters.
 */
var MdSort = (function () {
    function MdSort() {
        /**
         * Collection of all registered sortables that this directive manages.
         */
        this.sortables = new Map();
        /**
         * The direction to set when an MdSortable is initially sorted.
         * May be overriden by the MdSortable's sort start.
         */
        this.start = 'asc';
        /**
         * The sort direction of the currently active MdSortable.
         */
        this.direction = '';
        /**
         * Event emitted when the user changes either the active sort or sort direction.
         */
        this.mdSortChange = new EventEmitter();
    }
    Object.defineProperty(MdSort.prototype, "disableClear", {
        /**
         * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
         * May be overriden by the MdSortable's disable clear input.
         * @return {?}
         */
        get: function () { return this._disableClear; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._disableClear = coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSort.prototype, "_matSortActive", {
        /**
         * @return {?}
         */
        get: function () { return this.active; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.active = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSort.prototype, "_matSortStart", {
        /**
         * @return {?}
         */
        get: function () { return this.start; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.start = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSort.prototype, "_matSortDirection", {
        /**
         * @return {?}
         */
        get: function () { return this.direction; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.direction = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSort.prototype, "_matSortDisableClear", {
        /**
         * @return {?}
         */
        get: function () { return this.disableClear; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.disableClear = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * Register function to be used by the contained MdSortables. Adds the MdSortable to the
     * collection of MdSortables.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.register = function (sortable) {
        if (!sortable.id) {
            throw getMdSortHeaderMissingIdError();
        }
        if (this.sortables.has(sortable.id)) {
            throw getMdSortDuplicateMdSortableIdError(sortable.id);
        }
        this.sortables.set(sortable.id, sortable);
    };
    /**
     * Unregister function to be used by the contained MdSortables. Removes the MdSortable from the
     * collection of contained MdSortables.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.deregister = function (sortable) {
        this.sortables.delete(sortable.id);
    };
    /**
     * Sets the active sort id and determines the new sort direction.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.sort = function (sortable) {
        if (this.active != sortable.id) {
            this.active = sortable.id;
            this.direction = sortable.start ? sortable.start : this.start;
        }
        else {
            this.direction = this.getNextSortDirection(sortable);
        }
        this.mdSortChange.next({ active: this.active, direction: this.direction });
    };
    /**
     * Returns the next sort direction of the active sortable, checking for potential overrides.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.getNextSortDirection = function (sortable) {
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        var /** @type {?} */ disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
        var /** @type {?} */ sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        var /** @type {?} */ nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    };
    return MdSort;
}());
MdSort.decorators = [
    { type: Directive, args: [{
                selector: '[mdSort], [matSort]',
            },] },
];
/**
 * @nocollapse
 */
MdSort.ctorParameters = function () { return []; };
MdSort.propDecorators = {
    'active': [{ type: Input, args: ['mdSortActive',] },],
    'start': [{ type: Input, args: ['mdSortStart',] },],
    'direction': [{ type: Input, args: ['mdSortDirection',] },],
    'disableClear': [{ type: Input, args: ['mdSortDisableClear',] },],
    '_matSortActive': [{ type: Input, args: ['matSortActive',] },],
    '_matSortStart': [{ type: Input, args: ['matSortStart',] },],
    '_matSortDirection': [{ type: Input, args: ['matSortDirection',] },],
    '_matSortDisableClear': [{ type: Input, args: ['matSortDisableClear',] },],
    'mdSortChange': [{ type: Output },],
};
/**
 * Returns the sort direction cycle to use given the provided parameters of order and clear.
 * @param {?} start
 * @param {?} disableClear
 * @return {?}
 */
function getSortDirectionCycle(start, disableClear) {
    var /** @type {?} */ sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}
/**
 * To modify the labels and text displayed, create a new instance of MdSortHeaderIntl and
 * include it in a custom provider.
 */
var MdSortHeaderIntl = (function () {
    function MdSortHeaderIntl() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * ARIA label for the sorting button.
         */
        this.sortButtonLabel = function (id) {
            return "Change sorting for " + id;
        };
        /**
         * A label to describe the current sort (visible only to screenreaders).
         */
        this.sortDescriptionLabel = function (id, direction) {
            return "Sorted by " + id + " " + (direction == 'asc' ? 'ascending' : 'descending');
        };
    }
    return MdSortHeaderIntl;
}());
MdSortHeaderIntl.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MdSortHeaderIntl.ctorParameters = function () { return []; };
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MdSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
var MdSortHeader = (function () {
    /**
     * @param {?} _intl
     * @param {?} changeDetectorRef
     * @param {?} _sort
     * @param {?} _cdkColumnDef
     */
    function MdSortHeader(_intl, changeDetectorRef, _sort, _cdkColumnDef) {
        this._intl = _intl;
        this._sort = _sort;
        this._cdkColumnDef = _cdkColumnDef;
        /**
         * Sets the position of the arrow that displays when sorted.
         */
        this.arrowPosition = 'after';
        if (!_sort) {
            throw getMdSortHeaderNotContainedWithinMdSortError();
        }
        this._rerenderSubscription = merge(_sort.mdSortChange, _intl.changes).subscribe(function () {
            changeDetectorRef.markForCheck();
        });
    }
    Object.defineProperty(MdSortHeader.prototype, "disableClear", {
        /**
         * Overrides the disable clear value of the containing MdSort for this MdSortable.
         * @return {?}
         */
        get: function () { return this._disableClear; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._disableClear = coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSortHeader.prototype, "_id", {
        /**
         * @return {?}
         */
        get: function () { return this.id; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.id = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSortHeader.prototype.ngOnInit = function () {
        if (!this.id && this._cdkColumnDef) {
            this.id = this._cdkColumnDef.name;
        }
        this._sort.register(this);
    };
    /**
     * @return {?}
     */
    MdSortHeader.prototype.ngOnDestroy = function () {
        this._sort.deregister(this);
        this._rerenderSubscription.unsubscribe();
    };
    /**
     * Whether this MdSortHeader is currently sorted in either ascending or descending order.
     * @return {?}
     */
    MdSortHeader.prototype._isSorted = function () {
        return this._sort.active == this.id && this._sort.direction;
    };
    return MdSortHeader;
}());
MdSortHeader.decorators = [
    { type: Component, args: [{ selector: '[md-sort-header], [mat-sort-header]',
                template: "<div class=\"mat-sort-header-container\" [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"><button class=\"mat-sort-header-button\" type=\"button\" [attr.aria-label]=\"_intl.sortButtonLabel(id)\"><ng-content></ng-content></button><div *ngIf=\"_isSorted()\" class=\"mat-sort-header-arrow\" [class.mat-sort-header-asc]=\"_sort.direction == 'asc'\" [class.mat-sort-header-desc]=\"_sort.direction == 'desc'\"><div class=\"mat-sort-header-stem\"></div><div class=\"mat-sort-header-pointer-left\"></div><div class=\"mat-sort-header-pointer-right\"></div></div></div><span class=\"cdk-visually-hidden\" *ngIf=\"_isSorted()\">{{_intl.sortDescriptionLabel(id, _sort.direction)}}</span>",
                styles: [".mat-sort-header-container{display:flex;cursor:pointer}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-button{border:none;background:0 0;display:flex;align-items:center;padding:0;cursor:pointer;outline:0;font:inherit;color:currentColor}.mat-sort-header-arrow{display:none;height:10px;width:10px;position:relative;margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-asc{display:block;transform:rotate(45deg)}.mat-sort-header-desc{display:block;transform:rotate(225deg);top:2px}.mat-sort-header-stem{background:currentColor;transform:rotate(135deg);height:10px;width:2px;margin:auto}.mat-sort-header-pointer-left{background:currentColor;width:2px;height:8px;position:absolute;bottom:0;right:0}.mat-sort-header-pointer-right{background:currentColor;width:8px;height:2px;position:absolute;bottom:0;right:0}"],
                host: {
                    '(click)': '_sort.sort(this)',
                    '[class.mat-sort-header-sorted]': '_isSorted()',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdSortHeader.ctorParameters = function () { return [
    { type: MdSortHeaderIntl, },
    { type: ChangeDetectorRef, },
    { type: MdSort, decorators: [{ type: Optional },] },
    { type: CdkColumnDef, decorators: [{ type: Optional },] },
]; };
MdSortHeader.propDecorators = {
    'id': [{ type: Input, args: ['md-sort-header',] },],
    'arrowPosition': [{ type: Input },],
    'start': [{ type: Input, args: ['start',] },],
    'disableClear': [{ type: Input },],
    '_id': [{ type: Input, args: ['mat-sort-header',] },],
};
var MdSortModule = (function () {
    function MdSortModule() {
    }
    return MdSortModule;
}());
MdSortModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MdSort, MdSortHeader],
                declarations: [MdSort, MdSortHeader],
                providers: [MdSortHeaderIntl]
            },] },
];
/**
 * @nocollapse
 */
MdSortModule.ctorParameters = function () { return []; };
/**
 * To modify the labels and text displayed, create a new instance of MdPaginatorIntl and
 * include it in a custom provider
 */
var MdPaginatorIntl = (function () {
    function MdPaginatorIntl() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * A label for the page size selector.
         */
        this.itemsPerPageLabel = 'Items per page:';
        /**
         * A label for the button that increments the current page.
         */
        this.nextPageLabel = 'Next page';
        /**
         * A label for the button that decrements the current page.
         */
        this.previousPageLabel = 'Previous page';
        /**
         * A label for the range of items within the current page and the length of the whole list.
         */
        this.getRangeLabel = function (page, pageSize, length) {
            if (length == 0 || pageSize == 0) {
                return "0 of " + length;
            }
            length = Math.max(length, 0);
            var startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            var endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
            return startIndex + 1 + " - " + endIndex + " of " + length;
        };
    }
    return MdPaginatorIntl;
}());
MdPaginatorIntl.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MdPaginatorIntl.ctorParameters = function () { return []; };
/**
 * The default page size if there is no page size and there are no provided page size options.
 */
var DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
var PageEvent = (function () {
    function PageEvent() {
    }
    return PageEvent;
}());
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
var MdPaginator = (function () {
    /**
     * @param {?} _intl
     * @param {?} _changeDetectorRef
     */
    function MdPaginator(_intl, _changeDetectorRef) {
        var _this = this;
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._pageIndex = 0;
        this._length = 0;
        this._pageSizeOptions = [];
        /**
         * Event emitted when the paginator changes the page size or page index.
         */
        this.page = new EventEmitter();
        this._intlChanges = _intl.changes.subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MdPaginator.prototype, "pageIndex", {
        /**
         * The zero-based page index of the displayed list of items. Defaulted to 0.
         * @return {?}
         */
        get: function () { return this._pageIndex; },
        /**
         * @param {?} pageIndex
         * @return {?}
         */
        set: function (pageIndex) {
            this._pageIndex = pageIndex;
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdPaginator.prototype, "length", {
        /**
         * The length of the total number of items that are being paginated. Defaulted to 0.
         * @return {?}
         */
        get: function () { return this._length; },
        /**
         * @param {?} length
         * @return {?}
         */
        set: function (length) {
            this._length = length;
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdPaginator.prototype, "pageSize", {
        /**
         * Number of items to display on a page. By default set to 50.
         * @return {?}
         */
        get: function () { return this._pageSize; },
        /**
         * @param {?} pageSize
         * @return {?}
         */
        set: function (pageSize) {
            this._pageSize = pageSize;
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdPaginator.prototype, "pageSizeOptions", {
        /**
         * The set of provided page size options to display to the user.
         * @return {?}
         */
        get: function () { return this._pageSizeOptions; },
        /**
         * @param {?} pageSizeOptions
         * @return {?}
         */
        set: function (pageSizeOptions) {
            this._pageSizeOptions = pageSizeOptions;
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdPaginator.prototype.ngOnInit = function () {
        this._initialized = true;
        this._updateDisplayedPageSizeOptions();
    };
    /**
     * @return {?}
     */
    MdPaginator.prototype.ngOnDestroy = function () {
        this._intlChanges.unsubscribe();
    };
    /**
     * Advances to the next page if it exists.
     * @return {?}
     */
    MdPaginator.prototype.nextPage = function () {
        if (!this.hasNextPage()) {
            return;
        }
        this.pageIndex++;
        this._emitPageEvent();
    };
    /**
     * Move back to the previous page if it exists.
     * @return {?}
     */
    MdPaginator.prototype.previousPage = function () {
        if (!this.hasPreviousPage()) {
            return;
        }
        this.pageIndex--;
        this._emitPageEvent();
    };
    /**
     * Whether there is a previous page.
     * @return {?}
     */
    MdPaginator.prototype.hasPreviousPage = function () {
        return this.pageIndex >= 1 && this.pageSize != 0;
    };
    /**
     * Whether there is a next page.
     * @return {?}
     */
    MdPaginator.prototype.hasNextPage = function () {
        var /** @type {?} */ numberOfPages = Math.ceil(this.length / this.pageSize) - 1;
        return this.pageIndex < numberOfPages && this.pageSize != 0;
    };
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     * @param {?} pageSize
     * @return {?}
     */
    MdPaginator.prototype._changePageSize = function (pageSize) {
        // Current page needs to be updated to reflect the new page size. Navigate to the page
        // containing the previous page's first item.
        var /** @type {?} */ startIndex = this.pageIndex * this.pageSize;
        this.pageIndex = Math.floor(startIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._emitPageEvent();
    };
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     * @return {?}
     */
    MdPaginator.prototype._updateDisplayedPageSizeOptions = function () {
        if (!this._initialized) {
            return;
        }
        // If no page size is provided, use the first page size option or the default page size.
        if (!this.pageSize) {
            this._pageSize = this.pageSizeOptions.length != 0 ?
                this.pageSizeOptions[0] :
                DEFAULT_PAGE_SIZE;
        }
        this._displayedPageSizeOptions = this.pageSizeOptions.slice();
        if (this._displayedPageSizeOptions.indexOf(this.pageSize) == -1) {
            this._displayedPageSizeOptions.push(this.pageSize);
        }
        // Sort the numbers using a number-specific sort function.
        this._displayedPageSizeOptions.sort(function (a, b) { return a - b; });
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Emits an event notifying that a change of the paginator's properties has been triggered.
     * @return {?}
     */
    MdPaginator.prototype._emitPageEvent = function () {
        this.page.next({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length
        });
    };
    return MdPaginator;
}());
MdPaginator.decorators = [
    { type: Component, args: [{ selector: 'md-paginator, mat-paginator',
                template: "<div class=\"mat-paginator-page-size\"><div class=\"mat-paginator-page-size-label\">{{_intl.itemsPerPageLabel}}</div><md-select *ngIf=\"_displayedPageSizeOptions.length > 1\" class=\"mat-paginator-page-size-select\" [value]=\"pageSize\" [aria-label]=\"_intl.itemsPerPageLabel\" (change)=\"_changePageSize($event.value)\"><md-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">{{pageSizeOption}}</md-option></md-select><div *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div></div><div class=\"mat-paginator-range-label\">{{_intl.getRangeLabel(pageIndex, pageSize, length)}}</div><button md-icon-button type=\"button\" class=\"mat-paginator-navigation-previous\" (click)=\"previousPage()\" [attr.aria-label]=\"_intl.previousPageLabel\" [mdTooltip]=\"_intl.previousPageLabel\" [mdTooltipPosition]=\"'above'\" [disabled]=\"!hasPreviousPage()\"><div class=\"mat-paginator-increment\"></div></button> <button md-icon-button type=\"button\" class=\"mat-paginator-navigation-next\" (click)=\"nextPage()\" [attr.aria-label]=\"_intl.nextPageLabel\" [mdTooltip]=\"_intl.nextPageLabel\" [mdTooltipPosition]=\"'above'\" [disabled]=\"!hasNextPage()\"><div class=\"mat-paginator-decrement\"></div></button>",
                styles: [".mat-paginator{display:flex;align-items:center;justify-content:flex-end;min-height:56px;padding:0 8px}.mat-paginator-page-size{display:flex;align-items:center}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{padding-top:0;margin:0 4px}.mat-paginator-page-size-select .mat-select-trigger{min-width:56px}.mat-paginator-range-label{margin:0 32px}.mat-paginator-increment-button+.mat-paginator-increment-button{margin:0 0 0 8px}[dir=rtl] .mat-paginator-increment-button+.mat-paginator-increment-button{margin:0 8px 0 0}.mat-paginator-decrement,.mat-paginator-increment{width:8px;height:8px}.mat-paginator-decrement,[dir=rtl] .mat-paginator-increment{transform:rotate(45deg)}.mat-paginator-increment,[dir=rtl] .mat-paginator-decrement{transform:rotate(225deg)}.mat-paginator-decrement{margin-left:12px}[dir=rtl] .mat-paginator-decrement{margin-right:12px}.mat-paginator-increment{margin-left:16px}[dir=rtl] .mat-paginator-increment{margin-right:16px}"],
                host: {
                    'class': 'mat-paginator',
                },
                providers: [
                    { provide: MATERIAL_COMPATIBILITY_MODE, useValue: false }
                ],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
MdPaginator.ctorParameters = function () { return [
    { type: MdPaginatorIntl, },
    { type: ChangeDetectorRef, },
]; };
MdPaginator.propDecorators = {
    'pageIndex': [{ type: Input },],
    'length': [{ type: Input },],
    'pageSize': [{ type: Input },],
    'pageSizeOptions': [{ type: Input },],
    'page': [{ type: Output },],
};
var MdPaginatorModule = (function () {
    function MdPaginatorModule() {
    }
    return MdPaginatorModule;
}());
MdPaginatorModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MdButtonModule,
                    MdSelectModule,
                    MdTooltipModule,
                ],
                exports: [MdPaginator],
                declarations: [MdPaginator],
                providers: [MdPaginatorIntl],
            },] },
];
/**
 * @nocollapse
 */
MdPaginatorModule.ctorParameters = function () { return []; };
var MATERIAL_MODULES = [
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdChipsModule,
    MdCheckboxModule,
    MdDatepickerModule,
    MdTableModule,
    MdDialogModule,
    MdExpansionModule,
    MdFormFieldModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSortModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    OverlayModule,
    PortalModule,
    BidiModule,
    StyleModule,
    A11yModule,
    PlatformModule,
    MdCommonModule,
    ObserversModule
];
/**
 * @deprecated
 */
var MaterialModule = (function () {
    function MaterialModule() {
    }
    return MaterialModule;
}());
MaterialModule.decorators = [
    { type: NgModule, args: [{
                imports: MATERIAL_MODULES,
                exports: MATERIAL_MODULES,
            },] },
];
/**
 * @nocollapse
 */
MaterialModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { VERSION, coerceBooleanProperty, coerceNumberProperty, ObserversModule, ObserveContent, SelectionModel, Dir, Directionality, BidiModule, Portal, BasePortalHost, ComponentPortal, TemplatePortal, PortalHostDirective, TemplatePortalDirective, PortalModule, DomPortalHost, GestureConfig, LiveAnnouncer, LIVE_ANNOUNCER_ELEMENT_TOKEN, LIVE_ANNOUNCER_PROVIDER, InteractivityChecker, FocusTrap, FocusTrapFactory, FocusTrapDeprecatedDirective, FocusTrapDirective, isFakeMousedownFromScreenReader, A11yModule, UniqueSelectionDispatcher, UNIQUE_SELECTION_DISPATCHER_PROVIDER, MdLineModule, MdLine, MdLineSetter, CompatibilityModule, NoConflictStyleCompatibilityMode, MdCommonModule, MATERIAL_SANITY_CHECKS, MD_PLACEHOLDER_GLOBAL_OPTIONS, MD_ERROR_GLOBAL_OPTIONS, defaultErrorStateMatcher, showOnDirtyErrorStateMatcher, MdCoreModule, MdOptionModule, MdOptionSelectionChange, MdOption, MdOptgroupBase, _MdOptgroupMixinBase, MdOptgroup, PlatformModule, Platform, getSupportedInputTypes, OVERLAY_PROVIDERS, OverlayModule, Overlay, OverlayContainer, FullscreenOverlayContainer, OverlayRef, OverlayState, ConnectedOverlayDirective, OverlayOrigin, ViewportRuler, GlobalPositionStrategy, ConnectedPositionStrategy, VIEWPORT_RULER_PROVIDER, ConnectionPositionPair, ScrollingVisibility, ConnectedOverlayPositionChange, Scrollable, ScrollDispatcher, ScrollStrategyOptions, RepositionScrollStrategy, CloseScrollStrategy, NoopScrollStrategy, BlockScrollStrategy, MdRipple, MD_RIPPLE_GLOBAL_OPTIONS, RippleRef, RippleState, RIPPLE_FADE_IN_DURATION, RIPPLE_FADE_OUT_DURATION, MdRippleModule, StyleModule, TOUCH_BUFFER_MS, FocusOriginMonitor, CdkMonitorFocus, FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY, FOCUS_ORIGIN_MONITOR_PROVIDER, applyCssTransform, UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, PAGE_UP, PAGE_DOWN, HOME, END, ENTER, SPACE, TAB, ESCAPE, BACKSPACE, DELETE, A, Z, MATERIAL_COMPATIBILITY_MODE, getMdCompatibilityInvalidPrefixError, MAT_ELEMENTS_SELECTOR, MD_ELEMENTS_SELECTOR, MatPrefixRejector, MdPrefixRejector, AnimationCurves, AnimationDurations, MdPseudoCheckboxModule, MdPseudoCheckbox, NativeDateModule, MdNativeDateModule, DateAdapter, MD_DATE_FORMATS, NativeDateAdapter, MD_NATIVE_DATE_FORMATS, MaterialModule, MdAutocompleteModule, MdAutocompleteSelectedEvent, MdAutocomplete, AUTOCOMPLETE_OPTION_HEIGHT, AUTOCOMPLETE_PANEL_HEIGHT, MD_AUTOCOMPLETE_SCROLL_STRATEGY, MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY, MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER, MD_AUTOCOMPLETE_VALUE_ACCESSOR, getMdAutocompleteMissingPanelError, MdAutocompleteTrigger, MdButtonModule, MdButtonCssMatStyler, MdRaisedButtonCssMatStyler, MdIconButtonCssMatStyler, MdFab, MdMiniFab, MdButtonBase, _MdButtonMixinBase, MdButton, MdAnchor, MdButtonToggleModule, MdButtonToggleGroupBase, _MdButtonToggleGroupMixinBase, MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, MdButtonToggleChange, MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle, MdCardModule, MdCardContent, MdCardTitle, MdCardSubtitle, MdCardActions, MdCardFooter, MdCardImage, MdCardSmImage, MdCardMdImage, MdCardLgImage, MdCardXlImage, MdCardAvatar, MdCard, MdCardHeader, MdCardTitleGroup, MdChipsModule, MdChipList, MdChipBase, _MdChipMixinBase, MdBasicChip, MdChip, MdChipRemove, MdChipInput, MdCheckboxModule, MD_CHECKBOX_CONTROL_VALUE_ACCESSOR, TransitionCheckState, MdCheckboxChange, MdCheckboxBase, _MdCheckboxMixinBase, MdCheckbox, _MdCheckboxRequiredValidator, MD_CHECKBOX_REQUIRED_VALIDATOR, MdCheckboxRequiredValidator, MdDatepickerModule, MdCalendar, MdCalendarCell, MdCalendarBody, MD_DATEPICKER_SCROLL_STRATEGY, MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY, MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER, MdDatepickerContent, MdDatepicker, MD_DATEPICKER_VALUE_ACCESSOR, MD_DATEPICKER_VALIDATORS, MdDatepickerInputEvent, MdDatepickerInput, MdDatepickerIntl, MdDatepickerToggle, MdMonthView, MdYearView, MdDialogModule, MD_DIALOG_DATA, MD_DIALOG_SCROLL_STRATEGY, MD_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY, MD_DIALOG_SCROLL_STRATEGY_PROVIDER, MdDialog, throwMdDialogContentAlreadyAttachedError, MdDialogContainer, MdDialogClose, MdDialogTitle, MdDialogContent, MdDialogActions, MdDialogConfig, MdDialogRef, MdExpansionModule, CdkAccordion, MdAccordion, AccordionItem, MdExpansionPanel, MdExpansionPanelActionRow, MdExpansionPanelHeader, MdExpansionPanelDescription, MdExpansionPanelTitle, MdFormFieldModule, MdError, MdFormField, MdFormFieldControl, getMdFormFieldPlaceholderConflictError, getMdFormFieldDuplicatedHintError, getMdFormFieldMissingControlError, MdHint, MdPlaceholder, MdPrefix, MdSuffix, MdGridListModule, MdGridTile, MdGridList, MdIconModule, MdIconBase, _MdIconMixinBase, MdIcon, getMdIconNameNotFoundError, getMdIconNoHttpProviderError, getMdIconFailedToSanitizeError, MdIconRegistry, ICON_REGISTRY_PROVIDER_FACTORY, ICON_REGISTRY_PROVIDER, MdInputModule, MdTextareaAutosize, MdInput, getMdInputUnsupportedTypeError, MdListModule, MdListBase, _MdListMixinBase, MdListItemBase, _MdListItemMixinBase, MdListDivider, MdList, MdListCssMatStyler, MdNavListCssMatStyler, MdDividerCssMatStyler, MdListAvatarCssMatStyler, MdListIconCssMatStyler, MdListSubheaderCssMatStyler, MdListItem, MdSelectionListBase, _MdSelectionListMixinBase, MdListOption, MdSelectionList, MdMenuModule, fadeInItems, transformMenu, MdMenu, MD_MENU_DEFAULT_OPTIONS, MdMenuItem, MdMenuTrigger, MdPaginatorModule, PageEvent, MdPaginator, MdPaginatorIntl, MdProgressBarModule, MdProgressBar, MdProgressSpinnerModule, PROGRESS_SPINNER_STROKE_WIDTH, MdProgressSpinnerCssMatStyler, MdProgressSpinnerBase, _MdProgressSpinnerMixinBase, MdProgressSpinner, MdSpinner, MdRadioModule, MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, MdRadioChange, MdRadioGroupBase, _MdRadioGroupMixinBase, MdRadioGroup, MdRadioButtonBase, _MdRadioButtonMixinBase, MdRadioButton, MdSelectModule, fadeInContent, transformPanel, transformPlaceholder, SELECT_ITEM_HEIGHT, SELECT_PANEL_MAX_HEIGHT, SELECT_MAX_OPTIONS_DISPLAYED, SELECT_TRIGGER_HEIGHT, SELECT_OPTION_HEIGHT_ADJUSTMENT, SELECT_PANEL_PADDING_X, SELECT_PANEL_INDENT_PADDING_X, SELECT_MULTIPLE_PANEL_PADDING_X, SELECT_PANEL_PADDING_Y, SELECT_PANEL_VIEWPORT_PADDING, MD_SELECT_SCROLL_STRATEGY, MD_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY, MD_SELECT_SCROLL_STRATEGY_PROVIDER, MdSelectChange, MdSelectBase, _MdSelectMixinBase, MdSelectTrigger, MdSelect, MdSidenavModule, throwMdDuplicatedDrawerError, MdDrawerToggleResult, MdDrawer, MdDrawerContainer, MdSidenav, MdSidenavContainer, MdSliderModule, MD_SLIDER_VALUE_ACCESSOR, MdSliderChange, MdSliderBase, _MdSliderMixinBase, MdSlider, MdSlideToggleModule, MD_SLIDE_TOGGLE_VALUE_ACCESSOR, MdSlideToggleChange, MdSlideToggleBase, _MdSlideToggleMixinBase, MdSlideToggle, MdSnackBarModule, MdSnackBar, SHOW_ANIMATION, HIDE_ANIMATION, MdSnackBarContainer, MD_SNACK_BAR_DATA, MdSnackBarConfig, MdSnackBarRef, SimpleSnackBar, MdSortModule, MdSortHeader, MdSortHeaderIntl, MdSort, MdTableModule, _MdCellDef, _MdHeaderCellDef, _MdColumnDef, _MdHeaderCell, _MdCell, MdCellDef, MdHeaderCellDef, MdColumnDef, MdHeaderCell, MdCell, _MdTable, MdTable, _MdHeaderRowDef, _MdCdkRowDef, _MdHeaderRow, _MdRow, MdHeaderRowDef, MatHeaderRowDef, MdRowDef, MatRowDef, MdHeaderRow, MdRow, MdTabsModule, MdInkBar, MdTabBody, MdTabHeader, MdTabLabelWrapper, MdTab, MdTabLabel, MdTabNav, MdTabLink, MdTabChangeEvent, MdTabGroupBase, _MdTabGroupMixinBase, MdTabGroup, MdTabNavBase, _MdTabNavMixinBase, MdTabLinkBase, _MdTabLinkMixinBase, MdToolbarModule, MdToolbarRow, MdToolbarBase, _MdToolbarMixinBase, MdToolbar, MdTooltipModule, TOUCHEND_HIDE_DELAY, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, getMdTooltipInvalidPositionError, MD_TOOLTIP_SCROLL_STRATEGY, MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY, MD_TOOLTIP_SCROLL_STRATEGY_PROVIDER, MdTooltip, TooltipComponent, mixinColor as ɵv, mixinDisableRipple as ɵw, mixinDisabled as ɵu, UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY as ɵb, RippleRenderer as ɵa, AccordionItemBase as ɵc, _AccordionItemMixinBase as ɵd, EXPANSION_PANEL_ANIMATION_TIMING as ɵe, MdGridAvatarCssMatStyler as ɵg, MdGridTileFooterCssMatStyler as ɵi, MdGridTileHeaderCssMatStyler as ɵh, MdGridTileText as ɵf, MdMenuItemBase as ɵj, _MdMenuItemMixinBase as ɵk, MD_MENU_SCROLL_STRATEGY as ɵl, MD_MENU_SCROLL_STRATEGY_PROVIDER as ɵn, MD_MENU_SCROLL_STRATEGY_PROVIDER_FACTORY as ɵm, MdTabBase as ɵs, _MdTabMixinBase as ɵt, MdTabHeaderBase as ɵo, _MdTabHeaderMixinBase as ɵp, MdTabLabelWrapperBase as ɵq, _MdTabLabelWrapperMixinBase as ɵr };
//# sourceMappingURL=material.es5.js.map
