/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs/Subject';
/**
 * Class to be used to power selecting one or more options from a list.
 */
export declare class SelectionModel<T> {
    private _isMulti;
    private _emitChanges;
    /** Currently-selected values. */
    private _selection;
    /** Keeps track of the deselected options that haven't been emitted by the change event. */
    private _deselectedToEmit;
    /** Keeps track of the selected option that haven't been emitted by the change event. */
    private _selectedToEmit;
    /** Cache for the array value of the selected items. */
    private _selected;
    /** Selected value(s). */
    readonly selected: T[];
    /** Event emitted when the value has changed. */
    onChange: Subject<SelectionChange<T>> | null;
    constructor(_isMulti?: boolean, initiallySelectedValues?: T[], _emitChanges?: boolean);
    /**
     * Selects a value or an array of values.
     */
    select(value: T): void;
    /**
     * Deselects a value or an array of values.
     */
    deselect(value: T): void;
    /**
     * Toggles a value between selected and deselected.
     */
    toggle(value: T): void;
    /**
     * Clears all of the selected values.
     */
    clear(): void;
    /**
     * Determines whether a value is selected.
     */
    isSelected(value: T): boolean;
    /**
     * Determines whether the model does not have a value.
     */
    isEmpty(): boolean;
    /**
     * Determines whether the model has a value.
     */
    hasValue(): boolean;
    /**
     * Sorts the selected values based on a predicate function.
     */
    sort(predicate?: (a: T, b: T) => number): void;
    /** Emits a change event and clears the records of selected and deselected values. */
    private _emitChangeEvent();
    /** Selects a value. */
    private _markSelected(value);
    /** Deselects a value. */
    private _unmarkSelected(value);
    /** Clears out the selected values. */
    private _unmarkAll();
}
/**
 * Describes an event emitted when the value of a MdSelectionModel has changed.
 * @docs-private
 */
export declare class SelectionChange<T> {
    added: T[] | undefined;
    removed: T[] | undefined;
    constructor(added?: T[] | undefined, removed?: T[] | undefined);
}
