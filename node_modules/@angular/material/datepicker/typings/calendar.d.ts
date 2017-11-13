import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { DateAdapter, MatDateFormats } from '@angular/material/core';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatMonthView } from './month-view';
import { MatYearView } from './year-view';
/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
export declare class MatCalendar<D> implements AfterContentInit, OnDestroy, OnChanges {
    private _elementRef;
    private _intl;
    private _ngZone;
    private _dateAdapter;
    private _dateFormats;
    private _intlChanges;
    /** A date representing the period (month or year) to start the calendar in. */
    startAt: D | null;
    private _startAt;
    /** Whether the calendar should be started in month or year view. */
    startView: 'month' | 'year';
    /** The currently selected date. */
    selected: D | null;
    private _selected;
    /** The minimum selectable date. */
    minDate: D | null;
    private _minDate;
    /** The maximum selectable date. */
    maxDate: D | null;
    private _maxDate;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Emits when the currently selected date changes. */
    selectedChange: EventEmitter<D>;
    /** Emits when any date is selected. */
    _userSelection: EventEmitter<void>;
    /** Reference to the current month view component. */
    monthView: MatMonthView<D>;
    /** Reference to the current year view component. */
    yearView: MatYearView<D>;
    /** Date filter for the month and year views. */
    _dateFilterForViews: (date: D) => boolean;
    /**
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     */
    _activeDate: D;
    private _clampedActiveDate;
    /** Whether the calendar is in month view. */
    _monthView: boolean;
    /** The label for the current calendar view. */
    readonly _periodButtonText: string;
    readonly _periodButtonLabel: string;
    /** The label for the the previous button. */
    readonly _prevButtonLabel: string;
    /** The label for the the next button. */
    readonly _nextButtonLabel: string;
    constructor(_elementRef: ElementRef, _intl: MatDatepickerIntl, _ngZone: NgZone, _dateAdapter: DateAdapter<D>, _dateFormats: MatDateFormats, changeDetectorRef: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /** Handles date selection in the month view. */
    _dateSelected(date: D): void;
    _userSelected(): void;
    /** Handles month selection in the year view. */
    _monthSelected(month: D): void;
    /** Handles user clicks on the period label. */
    _currentPeriodClicked(): void;
    /** Handles user clicks on the previous button. */
    _previousClicked(): void;
    /** Handles user clicks on the next button. */
    _nextClicked(): void;
    /** Whether the previous period button is enabled. */
    _previousEnabled(): boolean;
    /** Whether the next period button is enabled. */
    _nextEnabled(): boolean;
    /** Handles keydown events on the calendar body. */
    _handleCalendarBodyKeydown(event: KeyboardEvent): void;
    /** Focuses the active cell after the microtask queue is empty. */
    _focusActiveCell(): void;
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    private _isSameView(date1, date2);
    /** Handles keydown events on the calendar body when calendar is in month view. */
    private _handleCalendarBodyKeydownInMonthView(event);
    /** Handles keydown events on the calendar body when calendar is in year view. */
    private _handleCalendarBodyKeydownInYearView(event);
    /**
     * Determine the date for the month that comes before the given month in the same column in the
     * calendar table.
     */
    private _prevMonthInSameCol(date);
    /**
     * Determine the date for the month that comes after the given month in the same column in the
     * calendar table.
     */
    private _nextMonthInSameCol(date);
}
