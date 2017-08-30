/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, EventEmitter } from '@angular/core';
import { MdCalendarCell } from './calendar-body';
import { DateAdapter } from '../core/datetime/index';
import { MdDateFormats } from '../core/datetime/date-formats';
/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private
 */
export declare class MdYearView<D> implements AfterContentInit {
    _dateAdapter: DateAdapter<D>;
    private _dateFormats;
    /** The date to display in this year view (everything other than the year is ignored). */
    activeDate: D;
    private _activeDate;
    /** The currently selected date. */
    selected: D;
    private _selected;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Emits when a new month is selected. */
    selectedChange: EventEmitter<D>;
    /** Grid of calendar cells representing the months of the year. */
    _months: MdCalendarCell[][];
    /** The label for this year (e.g. "2017"). */
    _yearLabel: string;
    /** The month in this year that today falls on. Null if today is in a different year. */
    _todayMonth: number | null;
    /**
     * The month in this year that the selected Date falls on.
     * Null if the selected Date is in a different year.
     */
    _selectedMonth: number | null;
    constructor(_dateAdapter: DateAdapter<D>, _dateFormats: MdDateFormats);
    ngAfterContentInit(): void;
    /** Handles when a new month is selected. */
    _monthSelected(month: number): void;
    /** Initializes this month view. */
    private _init();
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     */
    private _getMonthInCurrentYear(date);
    /** Creates an MdCalendarCell for the given month. */
    private _createCellForMonth(month, monthName);
    /** Whether the given month is enabled. */
    private _isMonthEnabled(month);
}
