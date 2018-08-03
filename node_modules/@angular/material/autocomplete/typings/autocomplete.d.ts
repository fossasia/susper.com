/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, QueryList, TemplateRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { MatOption, MatOptgroup } from '@angular/material/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
/** Event object that is emitted when an autocomplete option is selected */
export declare class MatAutocompleteSelectedEvent {
    source: MatAutocomplete;
    option: MatOption;
    constructor(source: MatAutocomplete, option: MatOption);
}
export declare class MatAutocomplete implements AfterContentInit {
    private _changeDetectorRef;
    private _elementRef;
    /** Manages active item in option list based on key events. */
    _keyManager: ActiveDescendantKeyManager<MatOption>;
    /** Whether the autocomplete panel should be visible, depending on option length. */
    showPanel: boolean;
    /** Whether the autocomplete panel is open. */
    readonly isOpen: boolean;
    _isOpen: boolean;
    /** @docs-private */
    template: TemplateRef<any>;
    /** Element for the panel containing the autocomplete options. */
    panel: ElementRef;
    /** @docs-private */
    options: QueryList<MatOption>;
    /** @docs-private */
    optionGroups: QueryList<MatOptgroup>;
    /** Function that maps an option's control value to its display value in the trigger. */
    displayWith: ((value: any) => string) | null;
    /** Event that is emitted whenever an option from the list is selected. */
    optionSelected: EventEmitter<MatAutocompleteSelectedEvent>;
    /**
     * Takes classes set on the host md-autocomplete element and applies them to the panel
     * inside the overlay container to allow for easy styling.
     */
    classList: string;
    _classList: {
        [key: string]: boolean;
    };
    /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
    id: string;
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef);
    ngAfterContentInit(): void;
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     */
    _setScrollTop(scrollTop: number): void;
    /** Returns the panel's scrollTop. */
    _getScrollTop(): number;
    /** Panel should hide itself when the option list is empty. */
    _setVisibility(): void;
    /** Emits the `select` event. */
    _emitSelectEvent(option: MatOption): void;
}
