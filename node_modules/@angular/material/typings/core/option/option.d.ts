import { ChangeDetectorRef, ElementRef, EventEmitter, QueryList } from '@angular/core';
import { MatOptgroup } from './optgroup';
/** Event object emitted by MatOption when selected or deselected. */
export declare class MatOptionSelectionChange {
    source: MatOption;
    isUserInput: boolean;
    constructor(source: MatOption, isUserInput?: boolean);
}
/**
 * Single option inside of a `<mat-select>` element.
 */
export declare class MatOption {
    private _element;
    private _changeDetectorRef;
    readonly group: MatOptgroup;
    private _selected;
    private _active;
    private _multiple;
    private _disableRipple;
    /** Whether the option is disabled.  */
    private _disabled;
    private _id;
    /** Whether the wrapping component is in multiple selection mode. */
    multiple: boolean;
    /** The unique ID of the option. */
    readonly id: string;
    /** Whether or not the option is currently selected. */
    readonly selected: boolean;
    /** The form value of the option. */
    value: any;
    /** Whether the option is disabled. */
    disabled: any;
    /** Whether ripples for the option are disabled. */
    disableRipple: boolean;
    /** Event emitted when the option is selected or deselected. */
    onSelectionChange: EventEmitter<MatOptionSelectionChange>;
    constructor(_element: ElementRef, _changeDetectorRef: ChangeDetectorRef, group: MatOptgroup);
    /**
     * Whether or not the option is currently active and ready to be selected.
     * An active option displays styles as if it is focused, but the
     * focus is actually retained somewhere else. This comes in handy
     * for components like autocomplete where focus must remain on the input.
     */
    readonly active: boolean;
    /**
     * The displayed value of the option. It is necessary to show the selected option in the
     * select's trigger.
     */
    readonly viewValue: string;
    /** Selects the option. */
    select(): void;
    /** Deselects the option. */
    deselect(): void;
    /** Sets focus onto this option. */
    focus(): void;
    /**
     * This method sets display styles on the option to make it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     */
    setActiveStyles(): void;
    /**
     * This method removes display styles on the option that made it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     */
    setInactiveStyles(): void;
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel(): string;
    /** Ensures the option is selected when activated from the keyboard. */
    _handleKeydown(event: KeyboardEvent): void;
    /**
     * Selects the option while indicating the selection came from the user. Used to
     * determine if the select's view -> model callback should be invoked.
     */
    _selectViaInteraction(): void;
    /** Returns the correct tabindex for the option depending on disabled state. */
    _getTabIndex(): string;
    /** Gets the host DOM element. */
    _getHostElement(): HTMLElement;
    /** Emits the selection change event. */
    private _emitSelectionChangeEvent(isUserInput?);
    /**
     * Counts the amount of option group labels that precede the specified option.
     * @param optionIndex Index of the option at which to start counting.
     * @param options Flat list of all of the options.
     * @param optionGroups Flat list of all of the option groups.
     */
    static countGroupLabelsBeforeOption(optionIndex: number, options: QueryList<MatOption>, optionGroups: QueryList<MatOptgroup>): number;
}
