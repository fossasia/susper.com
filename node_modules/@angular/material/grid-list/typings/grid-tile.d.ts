/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Renderer2, ElementRef, QueryList, AfterContentInit } from '@angular/core';
import { MatLine, MatLineSetter } from '@angular/material/core';
export declare class MatGridTile {
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
    _setStyle(property: string, value: any): void;
}
export declare class MatGridTileText implements AfterContentInit {
    private _renderer;
    private _element;
    /**
     *  Helper that watches the number of lines in a text area and sets
     * a class on the host element that matches the line count.
     */
    _lineSetter: MatLineSetter;
    _lines: QueryList<MatLine>;
    constructor(_renderer: Renderer2, _element: ElementRef);
    ngAfterContentInit(): void;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatGridAvatarCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatGridTileHeaderCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatGridTileFooterCssMatStyler {
}
