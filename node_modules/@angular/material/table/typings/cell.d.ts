/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2 } from '@angular/core';
import { CdkCell, CdkCellDef, CdkColumnDef, CdkHeaderCell, CdkHeaderCellDef } from '@angular/cdk/table';
/** Workaround for https://github.com/angular/angular/issues/17849 */
export declare const _MdCellDef: typeof CdkCellDef;
export declare const _MdHeaderCellDef: typeof CdkHeaderCellDef;
export declare const _MdColumnDef: typeof CdkColumnDef;
export declare const _MdHeaderCell: typeof CdkHeaderCell;
export declare const _MdCell: typeof CdkCell;
/**
 * Cell definition for the md-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
export declare class MdCellDef extends _MdCellDef {
}
/**
 * Header cell definition for the md-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
export declare class MdHeaderCellDef extends _MdHeaderCellDef {
}
/**
 * Column definition for the md-table.
 * Defines a set of cells available for a table column.
 */
export declare class MdColumnDef extends _MdColumnDef {
    /** Unique name for this column. */
    name: string;
    _matColumnDefName: string;
}
/** Header cell template container that adds the right classes and role. */
export declare class MdHeaderCell extends _MdHeaderCell {
    constructor(columnDef: CdkColumnDef, elementRef: ElementRef, renderer: Renderer2);
}
/** Cell template container that adds the right classes and role. */
export declare class MdCell extends _MdCell {
    constructor(columnDef: CdkColumnDef, elementRef: ElementRef, renderer: Renderer2);
}
