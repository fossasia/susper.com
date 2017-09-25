/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export declare class MdCalendarCell {
    value: number;
    displayValue: string;
    ariaLabel: string;
    enabled: boolean;
    constructor(value: number, displayValue: string, ariaLabel: string, enabled: boolean);
}
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
export declare class MdCalendarBody {
    /** The label for the table. (e.g. "Jan 2017"). */
    label: string;
    /** The cells to display in the table. */
    rows: MdCalendarCell[][];
    /** The value in the table that corresponds to today. */
    todayValue: number;
    /** The value in the table that is currently selected. */
    selectedValue: number;
    /** The minimum number of free cells needed to fit the label in the first row. */
    labelMinRequiredCells: number;
    /** The number of columns in the table. */
    numCols: number;
    /** Whether to allow selection of disabled cells. */
    allowDisabledSelection: boolean;
    /** The cell number of the active cell in the table. */
    activeCell: number;
    /**
     * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
     * maintained even as the table resizes.
     */
    cellAspectRatio: number;
    /** Emits when a new value is selected. */
    selectedValueChange: EventEmitter<number>;
    _cellClicked(cell: MdCalendarCell): void;
    /** The number of blank cells to put at the beginning for the first row. */
    readonly _firstRowOffset: number;
    _isActiveCell(rowIndex: number, colIndex: number): boolean;
}
