/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { QueryList, ElementRef, EventEmitter, AfterContentChecked, AfterContentInit, OnDestroy, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Directionality, Direction } from '@angular/cdk/bidi';
import { MdTabLabelWrapper } from './tab-label-wrapper';
import { MdInkBar } from './ink-bar';
import { CanDisableRipple } from '../core/common-behaviors/disable-ripple';
/**
 * The directions that scrolling can go in when the header's tabs exceed the header width. 'After'
 * will scroll the header towards the end of the tabs list and 'before' will scroll towards the
 * beginning of the list.
 */
export declare type ScrollDirection = 'after' | 'before';
/** @docs-private */
export declare class MdTabHeaderBase {
}
export declare const _MdTabHeaderMixinBase: (new (...args: any[]) => CanDisableRipple) & typeof MdTabHeaderBase;
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
export declare class MdTabHeader extends _MdTabHeaderMixinBase implements AfterContentChecked, AfterContentInit, OnDestroy, CanDisableRipple {
    private _elementRef;
    private _renderer;
    private _changeDetectorRef;
    private _dir;
    _labelWrappers: QueryList<MdTabLabelWrapper>;
    _inkBar: MdInkBar;
    _tabListContainer: ElementRef;
    _tabList: ElementRef;
    /** The tab index that is focused. */
    private _focusIndex;
    /** The distance in pixels that the tab labels should be translated to the left. */
    private _scrollDistance;
    /** Whether the header should scroll to the selected index after the view has been checked. */
    private _selectedIndexChanged;
    /** Combines listeners that will re-align the ink bar whenever they're invoked. */
    private _realignInkBar;
    /** Whether the controls for pagination should be displayed */
    _showPaginationControls: boolean;
    /** Whether the tab list can be scrolled more towards the end of the tab label list. */
    _disableScrollAfter: boolean;
    /** Whether the tab list can be scrolled more towards the beginning of the tab label list. */
    _disableScrollBefore: boolean;
    /**
     * The number of tab labels that are displayed on the header. When this changes, the header
     * should re-evaluate the scroll position.
     */
    private _tabLabelCount;
    /** Whether the scroll distance has changed and should be applied after the view is checked. */
    private _scrollDistanceChanged;
    private _selectedIndex;
    /** The index of the active tab. */
    selectedIndex: number;
    /** Event emitted when the option is selected. */
    selectFocusedIndex: EventEmitter<{}>;
    /** Event emitted when a label is focused. */
    indexFocused: EventEmitter<{}>;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _changeDetectorRef: ChangeDetectorRef, _dir: Directionality);
    ngAfterContentChecked(): void;
    _handleKeydown(event: KeyboardEvent): void;
    /**
     * Aligns the ink bar to the selected tab on load.
     */
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Callback for when the MutationObserver detects that the content has changed.
     */
    _onContentChanges(): void;
    /**
     * Updating the view whether pagination should be enabled or not
     */
    _updatePagination(): void;
    /** Tracks which element has focus; used for keyboard navigation */
    /** When the focus index is set, we must manually send focus to the correct label */
    focusIndex: number;
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     */
    _isValidIndex(index: number): boolean;
    /**
     * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
     * scrolling is enabled.
     */
    _setTabFocus(tabIndex: number): void;
    /**
     * Moves the focus towards the beginning or the end of the list depending on the offset provided.
     * Valid offsets are 1 and -1.
     */
    _moveFocus(offset: number): void;
    /** Increment the focus index by 1 until a valid tab is found. */
    _focusNextTab(): void;
    /** Decrement the focus index by 1 until a valid tab is found. */
    _focusPreviousTab(): void;
    /** The layout direction of the containing app. */
    _getLayoutDirection(): Direction;
    /** Performs the CSS transformation on the tab list that will cause the list to scroll. */
    _updateTabScrollPosition(): void;
    /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
    scrollDistance: number;
    /**
     * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
     * the end of the list, respectively). The distance to scroll is computed to be a third of the
     * length of the tab list view window.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _scrollHeader(scrollDir: ScrollDirection): void;
    /**
     * Moves the tab list such that the desired tab label (marked by index) is moved into view.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _scrollToLabel(labelIndex: number): void;
    /**
     * Evaluate whether the pagination controls should be displayed. If the scroll width of the
     * tab list is wider than the size of the header container, then the pagination controls should
     * be shown.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _checkPaginationEnabled(): void;
    /**
     * Evaluate whether the before and after controls should be enabled or disabled.
     * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
     * before button. If the header is at the end of the list (scroll distance is equal to the
     * maximum distance we can scroll), then disable the after button.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _checkScrollingControls(): void;
    /**
     * Determines what is the maximum length in pixels that can be set for the scroll distance. This
     * is equal to the difference in width between the tab list container and tab header container.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _getMaxScrollDistance(): number;
    /** Tells the ink-bar to align itself to the current label wrapper */
    private _alignInkBarToSelectedTab();
}
