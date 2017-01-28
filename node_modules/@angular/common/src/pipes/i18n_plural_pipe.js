/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Pipe } from '@angular/core';
import { isBlank } from '../facade/lang';
import { NgLocalization, getPluralCategory } from '../localization';
import { InvalidPipeArgumentError } from './invalid_pipe_argument_error';
var /** @type {?} */ _INTERPOLATION_REGEXP = /#/g;
/**
 *  *
  * Where:
  * - `expression` is a number.
  * - `mapping` is an object that mimics the ICU format, see
  * http://userguide.icu-project.org/formatparse/messages
  * *
  * ## Example
  * *
  * {@example common/pipes/ts/i18n_pipe.ts region='I18nPluralPipeComponent'}
  * *
 */
export var I18nPluralPipe = (function () {
    /**
     * @param {?} _localization
     */
    function I18nPluralPipe(_localization) {
        this._localization = _localization;
    }
    /**
     * @param {?} value
     * @param {?} pluralMap
     * @return {?}
     */
    I18nPluralPipe.prototype.transform = function (value, pluralMap) {
        if (isBlank(value))
            return '';
        if (typeof pluralMap !== 'object' || pluralMap === null) {
            throw new InvalidPipeArgumentError(I18nPluralPipe, pluralMap);
        }
        var /** @type {?} */ key = getPluralCategory(value, Object.keys(pluralMap), this._localization);
        return pluralMap[key].replace(_INTERPOLATION_REGEXP, value.toString());
    };
    I18nPluralPipe.decorators = [
        { type: Pipe, args: [{ name: 'i18nPlural', pure: true },] },
    ];
    /** @nocollapse */
    I18nPluralPipe.ctorParameters = function () { return [
        { type: NgLocalization, },
    ]; };
    return I18nPluralPipe;
}());
function I18nPluralPipe_tsickle_Closure_declarations() {
    /** @type {?} */
    I18nPluralPipe.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    I18nPluralPipe.ctorParameters;
    /** @type {?} */
    I18nPluralPipe.prototype._localization;
}
//# sourceMappingURL=i18n_plural_pipe.js.map