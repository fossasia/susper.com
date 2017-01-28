/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertInterpolationSymbols } from '../assertions';
export var InterpolationConfig = (function () {
    /**
     * @param {?} start
     * @param {?} end
     */
    function InterpolationConfig(start, end) {
        this.start = start;
        this.end = end;
    }
    /**
     * @param {?} markers
     * @return {?}
     */
    InterpolationConfig.fromArray = function (markers) {
        if (!markers) {
            return DEFAULT_INTERPOLATION_CONFIG;
        }
        assertInterpolationSymbols('interpolation', markers);
        return new InterpolationConfig(markers[0], markers[1]);
    };
    ;
    return InterpolationConfig;
}());
function InterpolationConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    InterpolationConfig.prototype.start;
    /** @type {?} */
    InterpolationConfig.prototype.end;
}
export var /** @type {?} */ DEFAULT_INTERPOLATION_CONFIG = new InterpolationConfig('{{', '}}');
//# sourceMappingURL=interpolation_config.js.map