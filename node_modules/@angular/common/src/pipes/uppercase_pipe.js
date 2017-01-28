/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Pipe } from '@angular/core';
import { isBlank } from '../facade/lang';
import { InvalidPipeArgumentError } from './invalid_pipe_argument_error';
/**
 *  *
  * Converts value into an uppercase string using `String.prototype.toUpperCase()`.
  * *
  * ### Example
  * *
  * {@example common/pipes/ts/lowerupper_pipe.ts region='LowerUpperPipe'}
  * *
 */
export var UpperCasePipe = (function () {
    function UpperCasePipe() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    UpperCasePipe.prototype.transform = function (value) {
        if (isBlank(value))
            return value;
        if (typeof value !== 'string') {
            throw new InvalidPipeArgumentError(UpperCasePipe, value);
        }
        return value.toUpperCase();
    };
    UpperCasePipe.decorators = [
        { type: Pipe, args: [{ name: 'uppercase' },] },
    ];
    /** @nocollapse */
    UpperCasePipe.ctorParameters = function () { return []; };
    return UpperCasePipe;
}());
function UpperCasePipe_tsickle_Closure_declarations() {
    /** @type {?} */
    UpperCasePipe.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    UpperCasePipe.ctorParameters;
}
//# sourceMappingURL=uppercase_pipe.js.map