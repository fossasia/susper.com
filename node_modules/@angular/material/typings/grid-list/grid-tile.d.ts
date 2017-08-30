/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Renderer2, ElementRef, QueryList, AfterContentInit } from '@angular/core';
import { MdLine, MdLineSetter } from '../core';
export declare class MdGridTile {
    private _renderer;
    private _element;
    _rowspan: number;
    _colspan: number;
    constructor(_renderer: Renderer2, _element: ElementRef);
    /** Amount of rows that the grid tile takes up. */
    rowspan: number;
    /** Amount of columns that the grid tile takes up. */
    colspan: number;
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     */
    _setStyle(property: string, value: string): void;
}
export declare class MdGridTileText implements AfterContentInit {
    private _renderer;
    private _element;
    /**
     *  Helper that watches the number of lines in a text area and sets
     * a class on the host element that matches the line count.
     */
    _lineSetter: MdLineSetter;
    _lines: QueryList<MdLine>;
    constructor(_renderer: Renderer2, _element: ElementRef);
    ngAfterContentInit(): void;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdGridAvatarCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdGridTileHeaderCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdGridTileFooterCssMatStyler {
}
