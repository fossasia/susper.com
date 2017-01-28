/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, LOCALE_ID, Pipe } from '@angular/core';
import { NumberWrapper, isBlank, isPresent } from '../facade/lang';
import { NumberFormatStyle, NumberFormatter } from './intl';
import { InvalidPipeArgumentError } from './invalid_pipe_argument_error';
var /** @type {?} */ _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
/**
 * @param {?} pipe
 * @param {?} locale
 * @param {?} value
 * @param {?} style
 * @param {?} digits
 * @param {?=} currency
 * @param {?=} currencyAsSymbol
 * @return {?}
 */
function formatNumber(pipe, locale, value, style, digits, currency, currencyAsSymbol) {
    if (currency === void 0) { currency = null; }
    if (currencyAsSymbol === void 0) { currencyAsSymbol = false; }
    if (isBlank(value))
        return null;
    // Convert strings to numbers
    value = typeof value === 'string' && NumberWrapper.isNumeric(value) ? +value : value;
    if (typeof value !== 'number') {
        throw new InvalidPipeArgumentError(pipe, value);
    }
    var /** @type {?} */ minInt;
    var /** @type {?} */ minFraction;
    var /** @type {?} */ maxFraction;
    if (style !== NumberFormatStyle.Currency) {
        // rely on Intl default for currency
        minInt = 1;
        minFraction = 0;
        maxFraction = 3;
    }
    if (digits) {
        var /** @type {?} */ parts = digits.match(_NUMBER_FORMAT_REGEXP);
        if (parts === null) {
            throw new Error(digits + " is not a valid digit info for number pipes");
        }
        if (isPresent(parts[1])) {
            minInt = NumberWrapper.parseIntAutoRadix(parts[1]);
        }
        if (isPresent(parts[3])) {
            minFraction = NumberWrapper.parseIntAutoRadix(parts[3]);
        }
        if (isPresent(parts[5])) {
            maxFraction = NumberWrapper.parseIntAutoRadix(parts[5]);
        }
    }
    return NumberFormatter.format(/** @type {?} */ (value), locale, style, {
        minimumIntegerDigits: minInt,
        minimumFractionDigits: minFraction,
        maximumFractionDigits: maxFraction,
        currency: currency,
        currencyAsSymbol: currencyAsSymbol,
    });
}
/**
 *  *
  * Formats a number as text. Group sizing and separator and other locale-specific
  * configurations are based on the active locale.
  * *
  * where `expression` is a number:
  * - `digitInfo` is a `string` which has a following format: <br>
  * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>
  * - `minIntegerDigits` is the minimum number of integer digits to use. Defaults to `1`.
  * - `minFractionDigits` is the minimum number of digits after fraction. Defaults to `0`.
  * - `maxFractionDigits` is the maximum number of digits after fraction. Defaults to `3`.
  * *
  * For more information on the acceptable range for each of these numbers and other
  * details see your native internationalization library.
  * *
  * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
  * and may require a polyfill. See {@linkDocs guide/browser-support} for details.
  * *
  * ### Example
  * *
  * {@example common/pipes/ts/number_pipe.ts region='NumberPipe'}
  * *
 */
export var DecimalPipe = (function () {
    /**
     * @param {?} _locale
     */
    function DecimalPipe(_locale) {
        this._locale = _locale;
    }
    /**
     * @param {?} value
     * @param {?=} digits
     * @return {?}
     */
    DecimalPipe.prototype.transform = function (value, digits) {
        if (digits === void 0) { digits = null; }
        return formatNumber(DecimalPipe, this._locale, value, NumberFormatStyle.Decimal, digits);
    };
    DecimalPipe.decorators = [
        { type: Pipe, args: [{ name: 'number' },] },
    ];
    /** @nocollapse */
    DecimalPipe.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
    ]; };
    return DecimalPipe;
}());
function DecimalPipe_tsickle_Closure_declarations() {
    /** @type {?} */
    DecimalPipe.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DecimalPipe.ctorParameters;
    /** @type {?} */
    DecimalPipe.prototype._locale;
}
/**
 *  *
  * *
  * Formats a number as percentage.
  * *
  * - `digitInfo` See {@link DecimalPipe} for detailed description.
  * *
  * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
  * and may require a polyfill. See {@linkDocs guide/browser-support} for details.
  * *
  * ### Example
  * *
  * {@example common/pipes/ts/number_pipe.ts region='PercentPipe'}
  * *
 */
export var PercentPipe = (function () {
    /**
     * @param {?} _locale
     */
    function PercentPipe(_locale) {
        this._locale = _locale;
    }
    /**
     * @param {?} value
     * @param {?=} digits
     * @return {?}
     */
    PercentPipe.prototype.transform = function (value, digits) {
        if (digits === void 0) { digits = null; }
        return formatNumber(PercentPipe, this._locale, value, NumberFormatStyle.Percent, digits);
    };
    PercentPipe.decorators = [
        { type: Pipe, args: [{ name: 'percent' },] },
    ];
    /** @nocollapse */
    PercentPipe.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
    ]; };
    return PercentPipe;
}());
function PercentPipe_tsickle_Closure_declarations() {
    /** @type {?} */
    PercentPipe.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    PercentPipe.ctorParameters;
    /** @type {?} */
    PercentPipe.prototype._locale;
}
/**
 *  *
  * Use `currency` to format a number as currency.
  * *
  * - `currencyCode` is the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code, such
  * as `USD` for the US dollar and `EUR` for the euro.
  * - `symbolDisplay` is a boolean indicating whether to use the currency symbol or code.
  * - `true`: use symbol (e.g. `$`).
  * - `false`(default): use code (e.g. `USD`).
  * - `digitInfo` See {@link DecimalPipe} for detailed description.
  * *
  * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
  * and may require a polyfill. See {@linkDocs guide/browser-support} for details.
  * *
  * ### Example
  * *
  * {@example common/pipes/ts/number_pipe.ts region='CurrencyPipe'}
  * *
 */
export var CurrencyPipe = (function () {
    /**
     * @param {?} _locale
     */
    function CurrencyPipe(_locale) {
        this._locale = _locale;
    }
    /**
     * @param {?} value
     * @param {?=} currencyCode
     * @param {?=} symbolDisplay
     * @param {?=} digits
     * @return {?}
     */
    CurrencyPipe.prototype.transform = function (value, currencyCode, symbolDisplay, digits) {
        if (currencyCode === void 0) { currencyCode = 'USD'; }
        if (symbolDisplay === void 0) { symbolDisplay = false; }
        if (digits === void 0) { digits = null; }
        return formatNumber(CurrencyPipe, this._locale, value, NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
    };
    CurrencyPipe.decorators = [
        { type: Pipe, args: [{ name: 'currency' },] },
    ];
    /** @nocollapse */
    CurrencyPipe.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
    ]; };
    return CurrencyPipe;
}());
function CurrencyPipe_tsickle_Closure_declarations() {
    /** @type {?} */
    CurrencyPipe.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CurrencyPipe.ctorParameters;
    /** @type {?} */
    CurrencyPipe.prototype._locale;
}
//# sourceMappingURL=number_pipe.js.map