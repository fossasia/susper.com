/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList, Renderer2 } from '@angular/core';
import { CanDisable, CanDisableRipple, HasTabIndex, MatLine } from '@angular/material/core';
/** @docs-private */
export declare class MatSelectionListBase {
}
export declare const _MatSelectionListMixinBase: (new (...args: any[]) => HasTabIndex) & (new (...args: any[]) => CanDisableRipple) & (new (...args: any[]) => CanDisable) & typeof MatSelectionListBase;
/** @docs-private */
export declare class MatListOptionBase {
}
export declare const _MatListOptionMixinBase: (new (...args: any[]) => CanDisableRipple) & typeof MatListOptionBase;
/** Event emitted by a selection-list whenever the state of an option is changed. */
export interface MatSelectionListOptionEvent {
    option: MatListOption;
}
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is checked.
 */
export declare class MatListOption extends _MatListOptionMixinBase implements AfterContentInit, OnInit, OnDestroy, FocusableOption, CanDisableRipple {
    private _renderer;
    private _element;
    private _changeDetector;
    selectionList: MatSelectionList;
    private _lineSetter;
    private _selected;
    private _disabled;
    /** Whether the option has focus. */
    _hasFocus: boolean;
    _lines: QueryList<MatLine>;
    /** Whether the label should appear before or after the checkbox. Defaults to 'after' */
    checkboxPosition: 'before' | 'after';
    /** Value of the option */
    value: any;
    /** Whether the option is disabled. */
    disabled: any;
    /** Whether the option is selected. */
    selected: boolean;
    /** Emitted when the option is selected. */
    selectChange: EventEmitter<MatSelectionListOptionEvent>;
    /** Emitted when the option is deselected. */
    deselected: EventEmitter<MatSelectionListOptionEvent>;
    constructor(_renderer: Renderer2, _element: ElementRef, _changeDetector: ChangeDetectorRef, selectionList: MatSelectionList);
    ngOnInit(): void;
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
    /** Retrieves the DOM element of the component host. */
    _getHostElement(): HTMLElement;
}
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
export declare class MatSelectionList extends _MatSelectionListMixinBase implements FocusableOption, CanDisable, CanDisableRipple, HasTabIndex, AfterContentInit {
    private _element;
    /** The FocusKeyManager which handles focus. */
    _keyManager: FocusKeyManager<MatListOption>;
    /** The option components contained within this selection-list. */
    options: QueryList<MatListOption>;
    /** The currently selected options. */
    selectedOptions: SelectionModel<MatListOption>;
    constructor(_element: ElementRef, tabIndex: string);
    ngAfterContentInit(): void;
    /** Focus the selection-list. */
    focus(): void;
    /** Selects all of the options. */
    selectAll(): void;
    /** Deselects all of the options. */
    deselectAll(): void;
    /** Sets the focused option of the selection-list. */
    _setFocusedOption(option: MatListOption): void;
    /** Removes an option from the selection list and updates the active item. */
    _removeOptionFromList(option: MatListOption): void;
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
    /** Returns the index of the specified list option. */
    private _getOptionIndex(option);
}
