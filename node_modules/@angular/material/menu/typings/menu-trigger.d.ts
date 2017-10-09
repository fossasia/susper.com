import { Direction, Directionality } from '@angular/cdk/bidi';
import { Overlay, RepositionScrollStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { AfterContentInit, ElementRef, EventEmitter, InjectionToken, OnDestroy, ViewContainerRef } from '@angular/core';
import { MatMenu } from './menu-directive';
import { MatMenuItem } from './menu-item';
import { MatMenuPanel } from './menu-panel';
/** Injection token that determines the scroll handling while the menu is open. */
export declare const MAT_MENU_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MAT_MENU_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => RepositionScrollStrategy;
/** @docs-private */
export declare const MAT_MENU_SCROLL_STRATEGY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: typeof Overlay[];
    useFactory: (overlay: Overlay) => () => RepositionScrollStrategy;
};
/** Default top padding of the menu panel. */
export declare const MENU_PANEL_TOP_PADDING = 8;
/**
 * This directive is intended to be used in conjunction with an mat-menu tag.  It is
 * responsible for toggling the display of the provided menu instance.
 */
export declare class MatMenuTrigger implements AfterContentInit, OnDestroy {
    private _overlay;
    private _element;
    private _viewContainerRef;
    private _scrollStrategy;
    private _parentMenu;
    private _menuItemInstance;
    private _dir;
    private _portal;
    private _overlayRef;
    private _menuOpen;
    private _closeSubscription;
    private _positionSubscription;
    private _hoverSubscription;
    private _openedByMouse;
    /** @deprecated */
    _deprecatedMatMenuTriggerFor: MatMenuPanel;
    /** References the menu instance that the trigger is associated with. */
    menu: MatMenuPanel;
    /** Event emitted when the associated menu is opened. */
    onMenuOpen: EventEmitter<void>;
    /** Event emitted when the associated menu is closed. */
    onMenuClose: EventEmitter<void>;
    constructor(_overlay: Overlay, _element: ElementRef, _viewContainerRef: ViewContainerRef, _scrollStrategy: any, _parentMenu: MatMenu, _menuItemInstance: MatMenuItem, _dir: Directionality);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Whether the menu is open. */
    readonly menuOpen: boolean;
    /** The text direction of the containing app. */
    readonly dir: Direction;
    /** Whether the menu triggers a sub-menu or a top-level one. */
    triggersSubmenu(): boolean;
    /** Toggles the menu between the open and closed states. */
    toggleMenu(): void;
    /** Opens the menu. */
    openMenu(): void;
    /** Closes the menu. */
    closeMenu(): void;
    /** Focuses the menu trigger. */
    focus(): void;
    /** Closes the menu and does the necessary cleanup. */
    private _destroyMenu();
    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     */
    private _initMenu();
    /** Updates the menu elevation based on the amount of parent menus that it has. */
    private _setMenuElevation();
    /**
     * This method resets the menu when it's closed, most importantly restoring
     * focus to the menu trigger if the menu was opened via the keyboard.
     */
    private _resetMenu();
    private _setIsMenuOpen(isOpen);
    /**
     * This method checks that a valid instance of MatMenu has been passed into
     * matMenuTriggerFor. If not, an exception is thrown.
     */
    private _checkMenu();
    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    private _createOverlay();
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @returns OverlayConfig
     */
    private _getOverlayConfig();
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    private _subscribeToPositions(position);
    /**
     * This method builds the position strategy for the overlay, so the menu is properly connected
     * to the trigger.
     * @returns ConnectedPositionStrategy
     */
    private _getPosition();
    /** Cleans up the active subscriptions. */
    private _cleanUpSubscriptions();
    /** Returns a stream that emits whenever an action that should close the menu occurs. */
    private _menuClosingActions();
    /** Handles mouse presses on the trigger. */
    _handleMousedown(event: MouseEvent): void;
    /** Handles key presses on the trigger. */
    _handleKeydown(event: KeyboardEvent): void;
    /** Handles click events on the trigger. */
    _handleClick(event: MouseEvent): void;
}
