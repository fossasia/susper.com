/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { IterableChanges, IterableDiffer, IterableDiffers, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { CdkCellDef } from './cell';
/**
 * The row template that can be used by the md-table. Should not be used outside of the
 * material library.
 */
export declare const CDK_ROW_TEMPLATE: string;
/**
 * Base class for the CdkHeaderRowDef and CdkRowDef that handles checking their columns inputs
 * for changes and notifying the table.
 */
export declare abstract class BaseRowDef {
    template: TemplateRef<any>;
    protected _differs: IterableDiffers;
    /** The columns to be displayed on this row. */
    columns: string[];
    /** Differ used to check if any changes were made to the columns. */
    protected _columnsDiffer: IterableDiffer<any>;
    constructor(template: TemplateRef<any>, _differs: IterableDiffers);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Returns the difference between the current columns and the columns from the last diff, or null
     * if there is no difference.
     */
    getColumnsDiff(): IterableChanges<any> | null;
}
/**
 * Header row definition for the CDK table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
export declare class CdkHeaderRowDef extends BaseRowDef {
    constructor(template: TemplateRef<any>, _differs: IterableDiffers);
}
/**
 * Data row definition for the CDK table.
 * Captures the header row's template and other row properties such as the columns to display.
 */
export declare class CdkRowDef extends BaseRowDef {
    constructor(template: TemplateRef<any>, _differs: IterableDiffers);
}
/** Context provided to the row cells */
export interface CdkCellOutletRowContext<T> {
    /** Data for the row that this cell is located within. */
    $implicit: T;
    /** Index location of the row that this cell is located within. */
    index?: number;
    /** Length of the number of total rows. */
    count?: number;
    /** True if this cell is contained in the first row. */
    first?: boolean;
    /** True if this cell is contained in the last row. */
    last?: boolean;
    /** True if this cell is contained in a row with an even-numbered index. */
    even?: boolean;
    /** True if this cell is contained in a row with an odd-numbered index. */
    odd?: boolean;
}
/**
 * Outlet for rendering cells inside of a row or header row.
 * @docs-private
 */
export declare class CdkCellOutlet {
    _viewContainer: ViewContainerRef;
    /** The ordered list of cells to render within this outlet's view container */
    cells: CdkCellDef[];
    /** The data context to be provided to each cell */
    context: any;
    /**
     * Static property containing the latest constructed instance of this class.
     * Used by the CDK table when each CdkHeaderRow and CdkRow component is created using
     * createEmbeddedView. After one of these components are created, this property will provide
     * a handle to provide that component's cells and context. After init, the CdkCellOutlet will
     * construct the cells with the provided context.
     */
    static mostRecentCellOutlet: CdkCellOutlet;
    constructor(_viewContainer: ViewContainerRef);
}
/** Header template container that contains the cell outlet. Adds the right class and role. */
export declare class CdkHeaderRow {
}
/** Data row template container that contains the cell outlet. Adds the right class and role. */
export declare class CdkRow {
}
