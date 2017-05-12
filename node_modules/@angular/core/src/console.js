/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from './di';
import { print, warn } from './facade/lang';
export var Console = (function () {
    function Console() {
    }
    /**
     * @param {?} message
     * @return {?}
     */
    Console.prototype.log = function (message) { print(message); };
    /**
     * @param {?} message
     * @return {?}
     */
    Console.prototype.warn = function (message) { warn(message); };
    Console.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Console.ctorParameters = function () { return []; };
    return Console;
}());
function Console_tsickle_Closure_declarations() {
    /** @type {?} */
    Console.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Console.ctorParameters;
}
//# sourceMappingURL=console.js.map