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
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
export declare class MdMonthView<D> implements AfterContentInit {
    _dateAdapter: DateAdapter<D>;
    private _dateFormats;
    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     */
    activeDate: D;
    private _activeDate;
    /** The currently selected date. */
    selected: D;
    private _selected;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Emits when a new date is selected. */
    selectedChange: EventEmitter<D | null>;
    /** Emits when any date is selected. */
    userSelection: EventEmitter<void>;
    /** The label for this month (e.g. "January 2017"). */
    _monthLabel: string;
    /** Grid of calendar cells representing the dates of the month. */
    _weeks: MdCalendarCell[][];
    /** The number of blank cells in the first row before the 1st of the month. */
    _firstWeekOffset: number;
    /**
     * The date of the month that the currently selected Date falls on.
     * Null if the currently selected Date is in another month.
     */
    _selectedDate: number | null;
    /** The date of the month that today falls on. Null if today is in another month. */
    _todayDate: number | null;
    /** The names of the weekdays. */
    _weekdays: {
        long: string;
        narrow: string;
    }[];
    constructor(_dateAdapter: DateAdapter<D>, _dateFormats: MdDateFormats);
    ngAfterContentInit(): void;
    /** Handles when a new date is selected. */
    _dateSelected(date: number): void;
    /** Initializes this month view. */
    private _init();
    /** Creates MdCalendarCells for the dates in this month. */
    private _createWeekCells();
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    private _getDateInCurrentMonth(date);
    /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
    private _hasSameMonthAndYear(d1, d2);
}
