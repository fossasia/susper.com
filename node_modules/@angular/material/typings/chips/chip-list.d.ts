/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, QueryList, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { MdChip } from './chip';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
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
export declare class MdChipList implements AfterContentInit, OnDestroy {
    protected _renderer: Renderer2;
    protected _elementRef: ElementRef;
    private _dir;
    /** When a chip is destroyed, we track the index so we can focus the appropriate next chip. */
    protected _lastDestroyedIndex: number | null;
    /** Track which chips we're listening to for focus/destruction. */
    protected _chipSet: WeakMap<MdChip, boolean>;
    /** Subscription to tabbing out from the chip list. */
    private _tabOutSubscription;
    /** Whether or not the chip is selectable. */
    protected _selectable: boolean;
    protected _inputElement: HTMLInputElement;
    /** Tab index for the chip list. */
    _tabIndex: number;
    /**
     * User defined tab index.
     * When it is not null, use user defined tab index. Otherwise use _tabIndex
     */
    _userTabIndex: number | null;
    /** The FocusKeyManager which handles focus. */
    _keyManager: FocusKeyManager<MdChip>;
    /** The chip components contained within this chip list. */
    chips: QueryList<MdChip>;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _dir: Directionality);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Whether or not this chip is selectable. When a chip is not selectable,
     * it's selected state is always ignored.
     */
    selectable: boolean;
    tabIndex: number;
    /** Associates an HTML input element with this chip list. */
    registerInput(inputElement: HTMLInputElement): void;
    /**
     * Focuses the the first non-disabled chip in this chip list, or the associated input when there
     * are no eligible chips.
     */
    focus(): void;
    /** Attempt to focus an input if we have one. */
    _focusInput(): void;
    /**
     * Pass events to the keyboard manager. Available here for tests.
     */
    _keydown(event: KeyboardEvent): void;
    /**
     * Iterate through the list of chips and add them to our list of
     * subscribed chips.
     *
     * @param chips The list of chips to be subscribed.
     */
    protected _subscribeChips(chips: QueryList<MdChip>): void;
    /**
     * Check the tab index as you should not be allowed to focus an empty list.
     */
    protected _updateTabIndex(): void;
    /**
     * Add a specific chip to our subscribed list. If the chip has
     * already been subscribed, this ensures it is only subscribed
     * once.
     *
     * @param chip The chip to be subscribed (or checked for existing
     * subscription).
     */
    protected _addChip(chip: MdChip): void;
    /**
     * Checks to see if a focus chip was recently destroyed so that we can refocus the next closest
     * one.
     */
    protected _updateFocusForDestroyedChips(): void;
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of chips.
     */
    private _isValidIndex(index);
    private _isInputEmpty(element);
}
