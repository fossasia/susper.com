/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { unimplemented } from '../facade/errors';
import { stringify } from '../facade/lang';
var /** @type {?} */ _THROW_IF_NOT_FOUND = new Object();
export var /** @type {?} */ THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
var _NullInjector = (function () {
    function _NullInjector() {
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    _NullInjector.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = _THROW_IF_NOT_FOUND; }
        if (notFoundValue === _THROW_IF_NOT_FOUND) {
            throw new Error("No provider for " + stringify(token) + "!");
        }
        return notFoundValue;
    };
    return _NullInjector;
}());
/**
 *  ```
  * const injector: Injector = ...;
  * injector.get(...);
  * ```
  * *
  * For more details, see the {@linkDocs guide/dependency-injection "Dependency Injection Guide"}.
  * *
  * ### Example
  * *
  * {@example core/di/ts/injector_spec.ts region='Injector'}
  * *
  * `Injector` returns itself when given `Injector` as a token:
  * {@example core/di/ts/injector_spec.ts region='injectInjector'}
  * *
 * @abstract
 */
export var Injector = (function () {
    function Injector() {
    }
    /**
     *  Retrieves an instance from the injector based on the provided token.
      * If not found:
      * - Throws {@link NoProviderError} if no `notFoundValue` that is not equal to
      * Injector.THROW_IF_NOT_FOUND is given
      * - Returns the `notFoundValue` otherwise
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    Injector.prototype.get = function (token, notFoundValue) { return unimplemented(); };
    Injector.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
    Injector.NULL = new _NullInjector();
    return Injector;
}());
function Injector_tsickle_Closure_declarations() {
    /** @type {?} */
    Injector.THROW_IF_NOT_FOUND;
    /** @type {?} */
    Injector.NULL;
}
//# sourceMappingURL=injector.js.map