/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { QueryList } from '@angular/core';
import { Subject } from 'rxjs/Subject';
/**
 * This interface is for items that can be passed to a ListKeyManager.
 */
export interface ListKeyManagerOption {
    disabled?: boolean;
    getLabel?(): string;
}
/**
 * This class manages keyboard events for selectable lists. If you pass it a query list
 * of items, it will set the active item correctly when arrow events occur.
 */
export declare class ListKeyManager<T extends ListKeyManagerOption> {
    private _items;
    private _activeItemIndex;
    private _activeItem;
    private _wrap;
    private _letterKeyStream;
    private _typeaheadSubscription;
    private _pressedLetters;
    constructor(_items: QueryList<T>);
    /**
     * Stream that emits any time the TAB key is pressed, so components can react
     * when focus is shifted off of the list.
     */
    tabOut: Subject<void>;
    /**
     * Turns on wrapping mode, which ensures that the active item will wrap to
     * the other end of list when there are no more items in the given direction.
     */
    withWrap(): this;
    /**
     * Turns on typeahead mode which allows users to set the active item by typing.
     * @param debounceInterval Time to wait after the last keystroke before setting the active item.
     */
    withTypeAhead(debounceInterval?: number): this;
    /**
     * Sets the active item to the item at the index specified.
     * @param index The index of the item to be set as active.
     */
    setActiveItem(index: number): void;
    /**
     * Sets the active item depending on the key event passed in.
     * @param event Keyboard event to be used for determining which element should be active.
     */
    onKeydown(event: KeyboardEvent): void;
    /** Index of the currently active item. */
    readonly activeItemIndex: number | null;
    /** The active item. */
    readonly activeItem: T | null;
    /** Sets the active item to the first enabled item in the list. */
    setFirstItemActive(): void;
    /** Sets the active item to the last enabled item in the list. */
    setLastItemActive(): void;
    /** Sets the active item to the next enabled item in the list. */
    setNextItemActive(): void;
    /** Sets the active item to a previous enabled item in the list. */
    setPreviousItemActive(): void;
    /**
     * Allows setting of the activeItemIndex without any other effects.
     * @param index The new activeItemIndex.
     */
    updateActiveItemIndex(index: number): void;
    /**
     * This method sets the active item, given a list of items and the delta between the
     * currently active item and the new active item. It will calculate differently
     * depending on whether wrap mode is turned on.
     */
    private _setActiveItemByDelta(delta, items?);
    /**
     * Sets the active item properly given "wrap" mode. In other words, it will continue to move
     * down the list until it finds an item that is not disabled, and it will wrap if it
     * encounters either end of the list.
     */
    private _setActiveInWrapMode(delta, items);
    /**
     * Sets the active item properly given the default mode. In other words, it will
     * continue to move down the list until it finds an item that is not disabled. If
     * it encounters either end of the list, it will stop and not wrap.
     */
    private _setActiveInDefaultMode(delta, items);
    /**
     * Sets the active item to the first enabled item starting at the index specified. If the
     * item is disabled, it will move in the fallbackDelta direction until it either
     * finds an enabled item or encounters the end of the list.
     */
    private _setActiveItemByIndex(index, fallbackDelta, items?);
}
