/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FocusableOption } from '../core/a11y/focus-key-manager';
import { CanColor } from '../core/common-behaviors/color';
import { CanDisable } from '../core/common-behaviors/disabled';
export interface MdChipEvent {
    chip: MdChip;
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
    _chipRemove: MdChipRemove;
    /** Whether the chip is selected. */
    selected: boolean;
    protected _selected: boolean;
    /**
     * Whether or not the chips are selectable. When a chip is not selectable,
     * changes to it's selected state are always ignored.
     */
    selectable: boolean;
    protected _selectable: boolean;
    /**
     * Determines whether or not the chip displays the remove styling and emits (remove) events.
     */
    removable: boolean;
    protected _removable: boolean;
    /** Whether the chip has focus. */
    _hasFocus: boolean;
    /** Emits when the chip is focused. */
    _onFocus: Subject<MdChipEvent>;
    /** Emitted when the chip is selected. */
    select: EventEmitter<MdChipEvent>;
    /** Emitted when the chip is deselected. */
    deselect: EventEmitter<MdChipEvent>;
    /** Emitted when the chip is destroyed. */
    destroy: EventEmitter<MdChipEvent>;
    readonly ariaSelected: string | null;
    constructor(renderer: Renderer2, elementRef: ElementRef);
    /** Emitted when a chip is to be removed. */
    onRemove: EventEmitter<MdChipEvent>;
    ngOnDestroy(): void;
    /** Toggles the current selected state of this chip. */
    toggleSelected(): boolean;
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
