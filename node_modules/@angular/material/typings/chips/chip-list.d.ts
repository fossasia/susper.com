/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatChip, MatChipEvent, MatChipSelectionChange } from './chip';
import { MatChipInput } from './chip-input';
/** Change event object that is emitted when the chip list value has changed. */
export declare class MatChipListChange {
    source: MatChipList;
    value: any;
    constructor(source: MatChipList, value: any);
}
/**
 * A material design chips component (named ChipList for it's similarity to the List component).
 */
export declare class MatChipList implements MatFormFieldControl<any>, ControlValueAccessor, AfterContentInit, OnInit, OnDestroy {
    protected _renderer: Renderer2;
    protected _elementRef: ElementRef;
    private _changeDetectorRef;
    private _dir;
    private _parentForm;
    private _parentFormGroup;
    ngControl: NgControl;
    readonly controlType: string;
    /**
     * Stream that emits whenever the state of the input changes such that the wrapping `MatFormField`
     * needs to run change detection.
     */
    stateChanges: Subject<void>;
    /** When a chip is destroyed, we track the index so we can focus the appropriate next chip. */
    protected _lastDestroyedIndex: number | null;
    /** Track which chips we're listening to for focus/destruction. */
    protected _chipSet: WeakMap<MatChip, boolean>;
    /** Subscription to tabbing out from the chip list. */
    private _tabOutSubscription;
    /** Subscription to changes in the chip list. */
    private _changeSubscription;
    /** Subscription to focus changes in the chips. */
    private _chipFocusSubscription;
    /** Subscription to blur changes in the chips. */
    private _chipBlurSubscription;
    /** Subscription to selection changes in chips. */
    private _chipSelectionSubscription;
    /** Subscription to remove changes in chips. */
    private _chipRemoveSubscription;
    /** Whether or not the chip is selectable. */
    protected _selectable: boolean;
    /** Whether the component is in multiple selection mode. */
    private _multiple;
    /** The chip input to add more chips */
    protected _chipInput: MatChipInput;
    /** The aria-describedby attribute on the chip list for improved a11y. */
    protected _ariaDescribedby: string;
    /** Id of the chip list */
    protected _id: string;
    /** Uid of the chip list */
    protected _uid: string;
    /** Whether this is required */
    protected _required: boolean;
    /** Whether this is disabled */
    protected _disabled: boolean;
    protected _value: any;
    /** Placeholder for the chip list. Alternatively, placeholder can be set on MatChipInput */
    protected _placeholder: string;
    /** Tab index for the chip list. */
    _tabIndex: number;
    /**
     * User defined tab index.
     * When it is not null, use user defined tab index. Otherwise use _tabIndex
     */
    _userTabIndex: number | null;
    /** The FocusKeyManager which handles focus. */
    _keyManager: FocusKeyManager<MatChip>;
    /** Function when touched */
    _onTouched: () => void;
    /** Function when changed */
    _onChange: (value: any) => void;
    _selectionModel: SelectionModel<MatChip>;
    /** Comparison function to specify which option is displayed. Defaults to object equality. */
    private _compareWith;
    /** The array of selected chips inside chip list. */
    readonly selected: MatChip[] | MatChip;
    /** Whether the user should be allowed to select multiple chips. */
    multiple: boolean;
    /**
     * A function to compare the option values with the selected values. The first argument
     * is a value from an option. The second is a value from the selection. A boolean
     * should be returned.
     */
    compareWith: (o1: any, o2: any) => boolean;
    /** Required for FormFieldControl */
    value: any;
    /** Required for FormFieldControl. The ID of the chip list */
    id: string;
    /** Required for FormFieldControl. Whether the chip list is required. */
    required: any;
    /** For FormFieldControl. Use chip input's placholder if there's a chip input */
    placeholder: string;
    /** Whether any chips or the matChipInput inside of this chip-list has focus. */
    readonly focused: boolean;
    /** Whether this chip-list contains no chips and no matChipInput. */
    readonly empty: boolean;
    readonly shouldPlaceholderFloat: boolean;
    /** Whether this chip-list is disabled. */
    disabled: any;
    /** Whether the chip list is in an error state. */
    readonly errorState: boolean;
    /** Orientation of the chip list. */
    ariaOrientation: 'horizontal' | 'vertical';
    /**
     * Whether or not this chip is selectable. When a chip is not selectable,
     * its selected state is always ignored.
     */
    selectable: boolean;
    tabIndex: number;
    /** Combined stream of all of the child chips' selection change events. */
    readonly chipSelectionChanges: Observable<MatChipSelectionChange>;
    /** Combined stream of all of the child chips' focus change events. */
    readonly chipFocusChanges: Observable<MatChipEvent>;
    /** Combined stream of all of the child chips' blur change events. */
    readonly chipBlurChanges: Observable<MatChipEvent>;
    /** Combined stream of all of the child chips' remove change events. */
    readonly chipRemoveChanges: Observable<MatChipEvent>;
    /** Event emitted when the selected chip list value has been changed by the user. */
    change: EventEmitter<MatChipListChange>;
    /**
     * Event that emits whenever the raw value of the chip-list changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    valueChange: EventEmitter<any>;
    /** The chip components contained within this chip list. */
    chips: QueryList<MatChip>;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef, _dir: Directionality, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl);
    ngAfterContentInit(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Associates an HTML input element with this chip list. */
    registerInput(inputElement: MatChipInput): void;
    setDescribedByIds(ids: string[]): void;
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(disabled: boolean): void;
    onContainerClick(): void;
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
     * Check the tab index as you should not be allowed to focus an empty list.
     */
    protected _updateTabIndex(): void;
    /**
     * Update key manager's active item when chip is deleted.
     * If the deleted chip is the last chip in chip list, focus the new last chip.
     * Otherwise focus the next chip in the list.
     * Save `_lastDestroyedIndex` so we can set the correct focus.
     */
    protected _updateKeyManager(chip: MatChip): void;
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
    _setSelectionByValue(value: any, isUserInput?: boolean): void;
    /**
     * Finds and selects the chip based on its value.
     * @returns Chip that has the corresponding value.
     */
    private _selectValue(value, isUserInput?);
    private _initializeSelection();
    /**
     * Deselects every chip in the list.
     * @param skip Chip that should not be deselected.
     */
    private _clearSelection(skip?);
    /**
     * Sorts the model values, ensuring that they keep the same
     * order that they have in the panel.
     */
    private _sortValues();
    /** Emits change event to set the model value. */
    private _propagateChanges(fallbackValue?);
    /** When blurred, mark the field as touched when focus moved outside the chip list. */
    _blur(): void;
    /** Mark the field as touched */
    _markAsTouched(): void;
    private _resetChips();
    private _dropSubscriptions();
    /** Listens to user-generated selection events on each chip. */
    private _listenToChipsSelection();
    /** Listens to user-generated selection events on each chip. */
    private _listenToChipsFocus();
    private _listenToChipsRemoved();
}
