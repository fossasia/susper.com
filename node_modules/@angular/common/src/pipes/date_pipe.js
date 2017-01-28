/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, LOCALE_ID, Pipe } from '@angular/core';
import { NumberWrapper, isDate } from '../facade/lang';
import { DateFormatter } from './intl';
import { InvalidPipeArgumentError } from './invalid_pipe_argument_error';
/**
 *  *
  * Where:
  * - `expression` is a date object or a number (milliseconds since UTC epoch) or an ISO string
  * (https://www.w3.org/TR/NOTE-datetime).
  * - `format` indicates which date/time components to include. The format can be predifined as
  * shown below or custom as shown in the table.
  * - `'medium'`: equivalent to `'yMMMdjms'` (e.g. `Sep 3, 2010, 12:05:08 PM` for `en-US`)
  * - `'short'`: equivalent to `'yMdjm'` (e.g. `9/3/2010, 12:05 PM` for `en-US`)
  * - `'fullDate'`: equivalent to `'yMMMMEEEEd'` (e.g. `Friday, September 3, 2010` for `en-US`)
  * - `'longDate'`: equivalent to `'yMMMMd'` (e.g. `September 3, 2010` for `en-US`)
  * - `'mediumDate'`: equivalent to `'yMMMd'` (e.g. `Sep 3, 2010` for `en-US`)
  * - `'shortDate'`: equivalent to `'yMd'` (e.g. `9/3/2010` for `en-US`)
  * - `'mediumTime'`: equivalent to `'jms'` (e.g. `12:05:08 PM` for `en-US`)
  * - `'shortTime'`: equivalent to `'jm'` (e.g. `12:05 PM` for `en-US`)
  * *
  * *
  * | Component | Symbol | Narrow | Short Form   | Long Form         | Numeric   | 2-digit   |
  * |-----------|:------:|--------|--------------|-------------------|-----------|-----------|
  * | era       |   G    | G (A)  | GGG (AD)     | GGGG (Anno Domini)| -         | -         |
  * | year      |   y    | -      | -            | -                 | y (2015)  | yy (15)   |
  * | month     |   M    | L (S)  | MMM (Sep)    | MMMM (September)  | M (9)     | MM (09)   |
  * | day       |   d    | -      | -            | -                 | d (3)     | dd (03)   |
  * | weekday   |   E    | E (S)  | EEE (Sun)    | EEEE (Sunday)     | -         | -         |
  * | hour      |   j    | -      | -            | -                 | j (13)    | jj (13)   |
  * | hour12    |   h    | -      | -            | -                 | h (1 PM)  | hh (01 PM)|
  * | hour24    |   H    | -      | -            | -                 | H (13)    | HH (13)   |
  * | minute    |   m    | -      | -            | -                 | m (5)     | mm (05)   |
  * | second    |   s    | -      | -            | -                 | s (9)     | ss (09)   |
  * | timezone  |   z    | -      | -            | z (Pacific Standard Time)| -  | -         |
  * | timezone  |   Z    | -      | Z (GMT-8:00) | -                 | -         | -         |
  * | timezone  |   a    | -      | a (PM)       | -                 | -         | -         |
  * *
  * In javascript, only the components specified will be respected (not the ordering,
  * punctuations, ...) and details of the formatting will be dependent on the locale.
  * *
  * Timezone of the formatted text will be the local system timezone of the end-user's machine.
  * *
  * When the expression is a ISO string without time (e.g. 2016-09-19) the time zone offset is not
  * applied and the formatted text will have the same day, month and year of the expression.
  * *
  * WARNINGS:
  * - this pipe is marked as pure hence it will not be re-evaluated when the input is mutated.
  * Instead users should treat the date as an immutable object and change the reference when the
  * pipe needs to re-run (this is to avoid reformatting the date on every change detection run
  * which would be an expensive operation).
  * - this pipe uses the Internationalization API. Therefore it is only reliable in Chrome and Opera
  * browsers.
  * *
  * ### Examples
  * *
  * Assuming `dateObj` is (year: 2015, month: 6, day: 15, hour: 21, minute: 43, second: 11)
  * in the _local_ time and locale is 'en-US':
  * *
  * ```
  * {{ dateObj | date }}               // output is 'Jun 15, 2015'
  * {{ dateObj | date:'medium' }}      // output is 'Jun 15, 2015, 9:43:11 PM'
  * {{ dateObj | date:'shortTime' }}   // output is '9:43 PM'
  * {{ dateObj | date:'mmss' }}        // output is '43:11'
  * ```
  * *
  * {@example common/pipes/ts/date_pipe.ts region='DatePipe'}
  * *
 */
export var DatePipe = (function () {
    /**
     * @param {?} _locale
     */
    function DatePipe(_locale) {
        this._locale = _locale;
    }
    /**
     * @param {?} value
     * @param {?=} pattern
     * @return {?}
     */
    DatePipe.prototype.transform = function (value, pattern) {
        if (pattern === void 0) { pattern = 'mediumDate'; }
        var /** @type {?} */ date;
        if (isBlank(value))
            return null;
        if (typeof value === 'string') {
            value = value.trim();
        }
        if (isDate(value)) {
            date = value;
        }
        else if (NumberWrapper.isNumeric(value)) {
            date = new Date(parseFloat(value));
        }
        else if (typeof value === 'string' && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
            /**
            * For ISO Strings without time the day, month and year must be extracted from the ISO String
            * before Date creation to avoid time offset and errors in the new Date.
            * If we only replace '-' with ',' in the ISO String ("2015,01,01"), and try to create a new
            * date, some browsers (e.g. IE 9) will throw an invalid Date error
            * If we leave the '-' ("2015-01-01") and try to create a new Date("2015-01-01") the timeoffset
            * is applied
            * Note: ISO months are 0 for January, 1 for February, ...
            */
            var _a = value.split('-').map(function (val) { return parseInt(val, 10); }), y = _a[0], m = _a[1], d = _a[2];
            date = new Date(y, m - 1, d);
        }
        else {
            date = new Date(value);
        }
        if (!isDate(date)) {
            throw new InvalidPipeArgumentError(DatePipe, value);
        }
        return DateFormatter.format(date, this._locale, DatePipe._ALIASES[pattern] || pattern);
    };
    /** @internal */
    DatePipe._ALIASES = {
        'medium': 'yMMMdjms',
        'short': 'yMdjm',
        'fullDate': 'yMMMMEEEEd',
        'longDate': 'yMMMMd',
        'mediumDate': 'yMMMd',
        'shortDate': 'yMd',
        'mediumTime': 'jms',
        'shortTime': 'jm'
    };
    DatePipe.decorators = [
        { type: Pipe, args: [{ name: 'date', pure: true },] },
    ];
    /** @nocollapse */
    DatePipe.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
    ]; };
    return DatePipe;
}());
function DatePipe_tsickle_Closure_declarations() {
    /** @type {?} */
    DatePipe._ALIASES;
    /** @type {?} */
    DatePipe.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DatePipe.ctorParameters;
    /** @type {?} */
    DatePipe.prototype._locale;
}
/**
 * @param {?} obj
 * @return {?}
 */
function isBlank(obj) {
    return obj == null || obj === '';
}
//# sourceMappingURL=date_pipe.js.map