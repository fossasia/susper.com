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
export declare const _MatCellDef: typeof CdkCellDef;
export declare const _MatHeaderCellDef: typeof CdkHeaderCellDef;
export declare const _MatColumnDef: typeof CdkColumnDef;
export declare const _MatHeaderCell: typeof CdkHeaderCell;
export declare const _MatCell: typeof CdkCell;
/**
 * Cell definition for the mat-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
export declare class MatCellDef extends _MatCellDef {
}
/**
 * Header cell definition for the mat-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
export declare class MatHeaderCellDef extends _MatHeaderCellDef {
}
/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
export declare class MatColumnDef extends _MatColumnDef {
    /** Unique name for this column. */
    name: string;
}
/** Header cell template container that adds the right classes and role. */
export declare class MatHeaderCell extends _MatHeaderCell {
    constructor(columnDef: CdkColumnDef, elementRef: ElementRef, renderer: Renderer2);
}
/** Cell template container that adds the right classes and role. */
export declare class MatCell extends _MatCell {
    constructor(columnDef: CdkColumnDef, elementRef: ElementRef, renderer: Renderer2);
}
