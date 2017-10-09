/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationEvent } from '@angular/animations';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnDestroy, QueryList, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs/Subject';
/** Throws an exception when two MatDrawer are matching the same position. */
export declare function throwMatDuplicatedDrawerError(position: string): void;
/**
 * Drawer toggle promise result.
 * @deprecated
 */
export declare class MatDrawerToggleResult {
    type: 'open' | 'close';
    animationFinished: boolean;
    constructor(type: 'open' | 'close', animationFinished: boolean);
}
export declare class MatDrawerContent implements AfterContentInit {
    private _changeDetectorRef;
    private _container;
    /**
     * Margins to be applied to the content. These are used to push / shrink the drawer content when a
     * drawer is open. We use margin rather than transform even for push mode because transform breaks
     * fixed position elements inside of the transformed element.
     */
    _margins: {
        left: number;
        right: number;
    };
    constructor(_changeDetectorRef: ChangeDetectorRef, _container: MatDrawerContainer);
    ngAfterContentInit(): void;
}
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
export declare class MatDrawer implements AfterContentInit, OnDestroy {
    private _elementRef;
    private _focusTrapFactory;
    private _doc;
    private _focusTrap;
    private _elementFocusedBeforeDrawerWasOpened;
    /** Whether the drawer is initialized. Used for disabling the initial animation. */
    private _enableAnimations;
    /** The side that the drawer is attached to. */
    position: 'start' | 'end';
    private _position;
    /** @deprecated */
    align: 'start' | 'end';
    /** Mode of the drawer; one of 'over', 'push' or 'side'. */
    mode: 'over' | 'push' | 'side';
    private _mode;
    /** Whether the drawer can be closed with the escape key or by clicking on the backdrop. */
    disableClose: boolean;
    private _disableClose;
    /** Whether the drawer is opened. */
    private _opened;
    /** Emits whenever the drawer has started animating. */
    _animationStarted: EventEmitter<AnimationEvent>;
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
    onOpen: EventEmitter<void | MatDrawerToggleResult>;
    /** Event emitted when the drawer is fully closed. */
    onClose: EventEmitter<void | MatDrawerToggleResult>;
    /** Event emitted when the drawer's position changes. */
    onPositionChanged: EventEmitter<void>;
    /** @deprecated */
    onAlignChanged: EventEmitter<void>;
    /**
     * An observable that emits when the drawer mode changes. This is used by the drawer container to
     * to know when to when the mode changes so it can adapt the margins on the content.
     */
    _modeChanged: Subject<{}>;
    readonly _isFocusTrapEnabled: boolean;
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
    open(): Promise<MatDrawerToggleResult>;
    /** Close the drawer. */
    close(): Promise<MatDrawerToggleResult>;
    /**
     * Toggle this drawer.
     * @param isOpen Whether the drawer should be open.
     */
    toggle(isOpen?: boolean): Promise<MatDrawerToggleResult>;
    /**
     * Handles the keyboard events.
     * @docs-private
     */
    handleKeydown(event: KeyboardEvent): void;
    _onAnimationStart(event: AnimationEvent): void;
    _onAnimationEnd(event: AnimationEvent): void;
    readonly _width: any;
}
/**
 * <mat-drawer-container> component.
 *
 * This is the parent component to one or two <mat-drawer>s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
export declare class MatDrawerContainer implements AfterContentInit, OnDestroy {
    private _dir;
    private _element;
    private _renderer;
    private _ngZone;
    private _changeDetectorRef;
    _drawers: QueryList<MatDrawer>;
    _content: MatDrawerContent;
    /** The drawer child with the `start` position. */
    readonly start: MatDrawer | null;
    /** The drawer child with the `end` position. */
    readonly end: MatDrawer | null;
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
    /** Emits when the component is destroyed. */
    private _destroyed;
    _contentMargins: Subject<{
        left: number;
        right: number;
    }>;
    constructor(_dir: Directionality, _element: ElementRef, _renderer: Renderer2, _ngZone: NgZone, _changeDetectorRef: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
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
     * Subscribes to drawer onPositionChanged event in order to
     * re-validate drawers when the position changes.
     */
    private _watchDrawerPosition(drawer);
    /** Subscribes to changes in drawer mode so we can run change detection. */
    private _watchDrawerMode(drawer);
    /** Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element. */
    private _setContainerClass(isAdd);
    /** Validate the state of the drawer children components. */
    private _validateDrawers();
    _onBackdropClicked(): void;
    _closeModalDrawer(): void;
    _isShowingBackdrop(): boolean;
    private _isDrawerOpen(drawer);
    /**
     * Recalculates and updates the inline styles for the content. Note that this should be used
     * sparingly, because it causes a reflow.
     */
    private _updateContentMargins();
}
