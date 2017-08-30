/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, ElementRef } from '@angular/core';
import { MdChipList } from './chip-list';
export interface MdChipInputEvent {
    input: HTMLInputElement;
    value: string;
}
export declare class MdChipInput {
    protected _elementRef: ElementRef;
    _chipList: MdChipList;
    /** Register input for chip list */
    chipList: MdChipList;
    /**
     * Whether or not the chipEnd event will be emitted when the input is blurred.
     */
    addOnBlur: boolean;
    _addOnBlur: boolean;
    /**
     * The list of key codes that will trigger a chipEnd event.
     *
     * Defaults to `[ENTER]`.
     */
    separatorKeyCodes: number[];
    /** Emitted when a chip is to be added. */
    chipEnd: EventEmitter<MdChipInputEvent>;
    matChipList: MdChipList;
    matAddOnBlur: boolean;
    matSeparatorKeyCodes: number[];
    /** The native input element to which this directive is attached. */
    protected _inputElement: HTMLInputElement;
    constructor(_elementRef: ElementRef);
    /** Utility method to make host definition/tests more clear. */
    _keydown(event?: KeyboardEvent): void;
    /** Checks to see if the blur should emit the (chipEnd) event. */
    _blur(): void;
    /** Checks to see if the (chipEnd) event needs to be emitted. */
    _emitChipEnd(event?: KeyboardEvent): void;
}
