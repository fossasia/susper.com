/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption } from '@angular/cdk/a11y';
import { ElementRef, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { CanColor, CanDisable } from '@angular/material/core';
import { Subject } from 'rxjs/Subject';
export interface MdChipEvent {
    chip: MdChip;
}
/** Event object emitted by MdChip when selected or deselected. */
export declare class MdChipSelectionChange {
    source: MdChip;
    selected: boolean;
    isUserInput: boolean;
    constructor(source: MdChip, selected: boolean, isUserInput?: boolean);
}
/** @docs-private */
export declare class MdChipBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MdChipMixinBase: (new (...args: any[]) => CanColor) & (new (...args: any[]) => CanDisable) & typeof MdChipBase;
/**
 * Dummy directive to add CSS class to basic chips.
 * @docs-private
 */
export declare class MdBasicChip {
}
/**
 * Material design styled Chip component. Used inside the MdChipList component.
 */
export declare class MdChip extends _MdChipMixinBase implements FocusableOption, OnDestroy, CanColor, CanDisable {
    _elementRef: ElementRef;
    protected _value: any;
    protected _selected: boolean;
    protected _selectable: boolean;
    protected _removable: boolean;
    /** Whether the chip has focus. */
    _hasFocus: boolean;
    /** Whether the chip is selected. */
    selected: boolean;
    /** The value of the chip. Defaults to the content inside <md-chip> tags. */
    value: any;
    /**
     * Whether or not the chips are selectable. When a chip is not selectable,
     * changes to it's selected state are always ignored.
     */
    selectable: boolean;
    /**
     * Determines whether or not the chip displays the remove styling and emits (remove) events.
     */
    removable: boolean;
    /** Emits when the chip is focused. */
    _onFocus: Subject<MdChipEvent>;
    /** Emits when the chip is blured. */
    _onBlur: Subject<MdChipEvent>;
    /** Emitted when the chip is selected or deselected. */
    selectionChange: EventEmitter<MdChipSelectionChange>;
    /** Emitted when the chip is destroyed. */
    destroyed: EventEmitter<MdChipEvent>;
    /**
     * Emitted when the chip is destroyed.
     * @deprecated Use 'destroyed' instead.
     */
    destroy: EventEmitter<MdChipEvent>;
    /** Emitted when a chip is to be removed. */
    removed: EventEmitter<MdChipEvent>;
    /**
     * Emitted when a chip is to be removed.
     * @deprecated Use `removed` instead.
     */
    onRemove: EventEmitter<MdChipEvent>;
    readonly ariaSelected: string | null;
    constructor(renderer: Renderer2, _elementRef: ElementRef);
    ngOnDestroy(): void;
    /** Selects the chip. */
    select(): void;
    /** Deselects the chip. */
    deselect(): void;
    /** Select this chip and emit selected event */
    selectViaInteraction(): void;
    /** Toggles the current selected state of this chip. */
    toggleSelected(isUserInput?: boolean): boolean;
    /** Allows for programmatic focusing of the chip. */
    focus(): void;
    /**
     * Allows for programmatic removal of the chip. Called by the MdChipList when the DELETE or
     * BACKSPACE keys are pressed.
     *
     * Informs any listeners of the removal request. Does not remove the chip from the DOM.
     */
    remove(): void;
    /** Ensures events fire properly upon click. */
    _handleClick(event: Event): void;
    /** Handle custom key presses. */
    _handleKeydown(event: KeyboardEvent): void;
    _blur(): void;
}
/**
 * Applies proper (click) support and adds styling for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 *     <md-chip>
 *       <md-icon mdChipRemove>cancel</md-icon>
 *     </md-chip>
 *
 * You *may* use a custom icon, but you may need to override the `md-chip-remove` positioning styles
 * to properly center the icon within the chip.
 */
export declare class MdChipRemove {
    protected _parentChip: MdChip;
    constructor(_parentChip: MdChip);
    /** Calls the parent chip's public `remove()` method if applicable. */
    _handleClick(): void;
}
