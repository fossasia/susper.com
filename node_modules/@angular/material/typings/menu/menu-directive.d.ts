/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, EventEmitter, OnDestroy, QueryList, TemplateRef, ElementRef, InjectionToken } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { MenuPositionX, MenuPositionY } from './menu-positions';
import { MdMenuItem } from './menu-item';
import { MdMenuPanel } from './menu-panel';
import { Observable } from 'rxjs/Observable';
import { Direction } from '@angular/cdk/bidi';
/** Default `md-menu` options that can be overridden. */
export interface MdMenuDefaultOptions {
    xPosition: MenuPositionX;
    yPosition: MenuPositionY;
    overlapTrigger: boolean;
}
/** Injection token to be used to override the default options for `md-menu`. */
export declare const MD_MENU_DEFAULT_OPTIONS: InjectionToken<MdMenuDefaultOptions>;
export declare class MdMenu implements AfterContentInit, MdMenuPanel, OnDestroy {
    private _elementRef;
    private _defaultOptions;
    private _keyManager;
    private _xPosition;
    private _yPosition;
    private _previousElevation;
    /** Subscription to tab events on the menu panel */
    private _tabSubscription;
    /** Config object to be passed into the menu's ngClass */
    _classList: any;
    /** Current state of the panel animation. */
    _panelAnimationState: 'void' | 'enter-start' | 'enter';
    /** Parent menu of the current menu panel. */
    parentMenu: MdMenuPanel | undefined;
    /** Layout direction of the menu. */
    direction: Direction;
    /** Position of the menu in the X axis. */
    xPosition: MenuPositionX;
    /** Position of the menu in the Y axis. */
    yPosition: MenuPositionY;
    templateRef: TemplateRef<any>;
    /** List of the items inside of a menu. */
    items: QueryList<MdMenuItem>;
    /** Whether the menu should overlap its trigger. */
    overlapTrigger: boolean;
    /**
     * This method takes classes set on the host md-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @param classes list of class names
     */
    classList: string;
    /** Event emitted when the menu is closed. */
    close: EventEmitter<void | "click" | "keydown">;
    constructor(_elementRef: ElementRef, _defaultOptions: MdMenuDefaultOptions);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Stream that emits whenever the hovered menu item changes. */
    hover(): Observable<MdMenuItem>;
    /** Handle a keyboard event from the menu, delegating to the appropriate action. */
    _handleKeydown(event: KeyboardEvent): void;
    /**
     * Focus the first item in the menu. This method is used by the menu trigger
     * to focus the first item when the menu is opened by the ENTER key.
     */
    focusFirstItem(): void;
    /**
     * It's necessary to set position-based classes to ensure the menu panel animation
     * folds out from the correct direction.
     */
    setPositionClasses(posX?: "before" | "after", posY?: "above" | "below"): void;
    /**
     * Sets the menu panel elevation.
     * @param depth Number of parent menus that come before the menu.
     */
    setElevation(depth: number): void;
    /** Starts the enter animation. */
    _startAnimation(): void;
    /** Resets the panel animation to its initial state. */
    _resetAnimation(): void;
    /** Callback that is invoked when the panel animation completes. */
    _onAnimationDone(event: AnimationEvent): void;
}
