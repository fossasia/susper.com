/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, QueryList, EventEmitter, Renderer2, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { Directionality } from '../core';
import { FocusTrapFactory } from '../core/a11y/focus-trap';
/** Throws an exception when two MdDrawer are matching the same position. */
export declare function throwMdDuplicatedDrawerError(position: string): void;
/**
 * Drawer toggle promise result.
 * @deprecated
 */
export declare class MdDrawerToggleResult {
    type: 'open' | 'close';
    animationFinished: boolean;
    constructor(type: 'open' | 'close', animationFinished: boolean);
}
/**
 * <md-drawer> component.
 *
 * This component corresponds to a drawer that can be opened on the drawer container.
 *
 * Please refer to README.md for examples on how to use it.
 */
export declare class MdDrawer implements AfterContentInit, OnDestroy {
    private _elementRef;
    private _focusTrapFactory;
    private _doc;
    private _focusTrap;
    private _elementFocusedBeforeDrawerWasOpened;
    /** Whether the drawer is initialized. Used for disabling the initial animation. */
    private _enableAnimations;
    /** The side that the drawer is attached to. */
    position: "start" | "end";
    private _position;
    /** @deprecated */
    align: "start" | "end";
    /** Mode of the drawer; one of 'over', 'push' or 'side'. */
    mode: 'over' | 'push' | 'side';
    /** Whether the drawer can be closed with the escape key or not. */
    disableClose: boolean;
    private _disableClose;
    /** Whether the drawer is opened. */
    private _opened;
    /** Emits whenever the drawer has started animating. */
    _animationStarted: EventEmitter<void>;
    /** Whether the drawer is animating. Used to prevent overlapping animations. */
    _isAnimating: boolean;
    /** Current state of the sidenav animation. */
    _animationState: 'open-instant' | 'open' | 'void';
    /**
     * Promise that resolves when the open/close animation completes. It is here for backwards
     * compatibility and should be removed next time we do drawer breaking changes.
     * @deprecated
     */
    private _currentTogglePromise;
    /** Event emitted when the drawer is fully opened. */
    onOpen: EventEmitter<void | MdDrawerToggleResult>;
    /** Event emitted when the drawer is fully closed. */
    onClose: EventEmitter<void | MdDrawerToggleResult>;
    /** Event emitted when the drawer's position changes. */
    onPositionChanged: EventEmitter<void>;
    /** @deprecated */
    onAlignChanged: EventEmitter<void>;
    readonly isFocusTrapEnabled: boolean;
    constructor(_elementRef: ElementRef, _focusTrapFactory: FocusTrapFactory, _doc: any);
    /**
     * If focus is currently inside the drawer, restores it to where it was before the drawer
     * opened.
     */
    private _restoreFocus();
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Whether the drawer is opened. We overload this because we trigger an event when it
     * starts or end.
     */
    opened: boolean;
    /** Open the drawer. */
    open(): Promise<MdDrawerToggleResult>;
    /** Close the drawer. */
    close(): Promise<MdDrawerToggleResult>;
    /**
     * Toggle this drawer.
     * @param isOpen Whether the drawer should be open.
     */
    toggle(isOpen?: boolean): Promise<MdDrawerToggleResult>;
    /**
     * Handles the keyboard events.
     * @docs-private
     */
    handleKeydown(event: KeyboardEvent): void;
    _onAnimationStart(): void;
    _onAnimationEnd(event: AnimationEvent): void;
    readonly _width: any;
}
/**
 * <md-drawer-container> component.
 *
 * This is the parent component to one or two <md-drawer>s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
export declare class MdDrawerContainer implements AfterContentInit {
    private _dir;
    private _element;
    private _renderer;
    private _ngZone;
    private _changeDetectorRef;
    _drawers: QueryList<MdDrawer>;
    /** The drawer child with the `start` position. */
    readonly start: MdDrawer | null;
    /** The drawer child with the `end` position. */
    readonly end: MdDrawer | null;
    /** Event emitted when the drawer backdrop is clicked. */
    backdropClick: EventEmitter<void>;
    /** The drawer at the start/end position, independent of direction. */
    private _start;
    private _end;
    /**
     * The drawer at the left/right. When direction changes, these will change as well.
     * They're used as aliases for the above to set the left/right style properly.
     * In LTR, _left == _start and _right == _end.
     * In RTL, _left == _end and _right == _start.
     */
    private _left;
    private _right;
    /** Inline styles to be applied to the container. */
    _styles: {
        marginLeft: string;
        marginRight: string;
        transform: string;
    };
    constructor(_dir: Directionality, _element: ElementRef, _renderer: Renderer2, _ngZone: NgZone, _changeDetectorRef: ChangeDetectorRef);
    ngAfterContentInit(): void;
    /** Calls `open` of both start and end drawers */
    open(): void;
    /** Calls `close` of both start and end drawers */
    close(): void;
    /**
     * Subscribes to drawer events in order to set a class on the main container element when the
     * drawer is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     */
    private _watchDrawerToggle(drawer);
    /**
     * Subscribes to drawer onPositionChanged event in order to re-validate drawers when the position
     * changes.
     */
    private _watchDrawerPosition(drawer);
    /** Toggles the 'mat-drawer-opened' class on the main 'md-drawer-container' element. */
    private _setContainerClass(isAdd);
    /** Validate the state of the drawer children components. */
    private _validateDrawers();
    _onBackdropClicked(): void;
    _closeModalDrawer(): void;
    _isShowingBackdrop(): boolean;
    private _isDrawerOpen(drawer);
    /**
     * Return the width of the drawer, if it's in the proper mode and opened.
     * This may relayout the view, so do not call this often.
     * @param drawer
     * @param mode
     */
    private _getDrawerEffectiveWidth(drawer, mode);
    /**
     * Recalculates and updates the inline styles. Note that this
     * should be used sparingly, because it causes a reflow.
     */
    private _updateStyles();
}
