/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ChangeDetectorRef, ElementRef, NgZone, OnDestroy, Renderer2, QueryList } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { CanDisableRipple } from '../../core/common-behaviors/disable-ripple';
import { CanDisable } from '../../core/common-behaviors/disabled';
import { RippleGlobalOptions } from '../../core';
import { CanColor, ThemePalette } from '../../core/common-behaviors/color';
import { MdInkBar } from '../ink-bar';
/** @docs-private */
export declare class MdTabNavBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MdTabNavMixinBase: (new (...args: any[]) => CanDisableRipple) & (new (...args: any[]) => CanColor) & typeof MdTabNavBase;
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export declare class MdTabNav extends _MdTabNavMixinBase implements AfterContentInit, CanColor, CanDisableRipple, OnDestroy {
    private _dir;
    private _ngZone;
    private _changeDetectorRef;
    /** Subject that emits when the component has been destroyed. */
    private _onDestroy;
    _activeLinkChanged: boolean;
    _activeLinkElement: ElementRef;
    _inkBar: MdInkBar;
    /** Query list of all tab links of the tab navigation. */
    _tabLinks: QueryList<MdTabLink>;
    /** Subscription for window.resize event **/
    private _resizeSubscription;
    /** Background color of the tab nav. */
    backgroundColor: ThemePalette;
    private _backgroundColor;
    /** Whether ripples should be disabled for all links or not. */
    disableRipple: boolean;
    private _disableRipple;
    constructor(renderer: Renderer2, elementRef: ElementRef, _dir: Directionality, _ngZone: NgZone, _changeDetectorRef: ChangeDetectorRef);
    /** Notifies the component that the active link has been changed. */
    updateActiveLink(element: ElementRef): void;
    ngAfterContentInit(): void;
    /** Checks if the active link has been changed and, if so, will update the ink bar. */
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
    /** Aligns the ink bar to the active link. */
    _alignInkBar(): void;
    /** Sets the `disableRipple` property on each link of the navigation bar. */
    private _setLinkDisableRipple();
}
export declare class MdTabLinkBase {
}
export declare const _MdTabLinkMixinBase: (new (...args: any[]) => CanDisable) & typeof MdTabLinkBase;
/**
 * Link inside of a `md-tab-nav-bar`.
 */
export declare class MdTabLink extends _MdTabLinkMixinBase implements OnDestroy, CanDisable {
    private _mdTabNavBar;
    private _elementRef;
    /** Whether the tab link is active or not. */
    private _isActive;
    /** Whether the ripples for this tab should be disabled or not. */
    private _disableRipple;
    /** Reference to the instance of the ripple for the tab link. */
    private _tabLinkRipple;
    /** Whether the link is active. */
    active: boolean;
    /** Whether ripples should be disabled or not. */
    disableRipple: boolean;
    /** @docs-private */
    readonly tabIndex: number;
    constructor(_mdTabNavBar: MdTabNav, _elementRef: ElementRef, ngZone: NgZone, ruler: ViewportRuler, platform: Platform, globalOptions: RippleGlobalOptions);
    ngOnDestroy(): void;
}
