/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, QueryList, Renderer2 } from '@angular/core';
import { CanDisable, CanDisableRipple, MdLine } from '@angular/material/core';
/** @docs-private */
export declare class MdSelectionListBase {
}
export declare const _MdSelectionListMixinBase: (new (...args: any[]) => CanDisableRipple) & (new (...args: any[]) => CanDisable) & typeof MdSelectionListBase;
/** @docs-private */
export declare class MdListOptionBase {
}
export declare const _MdListOptionMixinBase: (new (...args: any[]) => CanDisableRipple) & typeof MdListOptionBase;
/** Event emitted by a selection-list whenever the state of an option is changed. */
export interface MdSelectionListOptionEvent {
    option: MdListOption;
}
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is checked.
 */
export declare class MdListOption extends _MdListOptionMixinBase implements AfterContentInit, OnDestroy, FocusableOption, CanDisableRipple {
    private _renderer;
    private _element;
    private _changeDetector;
    selectionList: MdSelectionList;
    private _lineSetter;
    private _selected;
    private _disabled;
    /** Whether the option has focus. */
    _hasFocus: boolean;
    _lines: QueryList<MdLine>;
    /** Whether the label should appear before or after the checkbox. Defaults to 'after' */
    checkboxPosition: 'before' | 'after';
    /** Value of the option */
    value: any;
    /** Whether the option is disabled. */
    disabled: any;
    /** Whether the option is selected. */
    selected: boolean;
    /** Emitted when the option is focused. */
    onFocus: EventEmitter<MdSelectionListOptionEvent>;
    /** Emitted when the option is selected. */
    selectChange: EventEmitter<MdSelectionListOptionEvent>;
    /** Emitted when the option is deselected. */
    deselected: EventEmitter<MdSelectionListOptionEvent>;
    /** Emitted when the option is destroyed. */
    destroyed: EventEmitter<MdSelectionListOptionEvent>;
    constructor(_renderer: Renderer2, _element: ElementRef, _changeDetector: ChangeDetectorRef, selectionList: MdSelectionList);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Toggles the selection state of the option. */
    toggle(): void;
    /** Allows for programmatic focusing of the option. */
    focus(): void;
    /** Whether this list item should show a ripple effect when clicked.  */
    _isRippleDisabled(): any;
    _handleClick(): void;
    _handleFocus(): void;
    _handleBlur(): void;
    /** Retrieves the DOM element of the component host. */
    _getHostElement(): HTMLElement;
}
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
export declare class MdSelectionList extends _MdSelectionListMixinBase implements FocusableOption, CanDisable, CanDisableRipple, AfterContentInit, OnDestroy {
    private _element;
    /** Tab index for the selection-list. */
    _tabIndex: number;
    /** Subscription to all list options' onFocus events */
    private _optionFocusSubscription;
    /** Subscription to all list options' destroy events  */
    private _optionDestroyStream;
    /** The FocusKeyManager which handles focus. */
    _keyManager: FocusKeyManager<MdListOption>;
    /** The option components contained within this selection-list. */
    options: QueryList<MdListOption>;
    /** The currently selected options. */
    selectedOptions: SelectionModel<MdListOption>;
    constructor(_element: ElementRef);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Focus the selection-list. */
    focus(): void;
    /** Selects all of the options. */
    selectAll(): void;
    /** Deselects all of the options. */
    deselectAll(): void;
    /** Map all the options' destroy event subscriptions and merge them into one stream. */
    private _onDestroySubscription();
    /** Map all the options' onFocus event subscriptions and merge them into one stream. */
    private _onFocusSubscription();
    /** Passes relevant key presses to our key manager. */
    _keydown(event: KeyboardEvent): void;
    /** Toggles the selected state of the currently focused option. */
    private _toggleSelectOnFocusedOption();
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of options.
     */
    private _isValidIndex(index);
}
