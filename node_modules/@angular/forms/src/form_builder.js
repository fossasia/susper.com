/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { isPresent } from './facade/lang';
import { FormArray, FormControl, FormGroup } from './model';
/**
 *  *
  * It is essentially syntactic sugar that shortens the `new FormGroup()`,
  * `new FormControl()`, and `new FormArray()` boilerplate that can build up in larger
  * forms.
  * *
  * *
  * To use, inject `FormBuilder` into your component class. You can then call its methods
  * directly.
  * *
  * {@example forms/ts/formBuilder/form_builder_example.ts region='Component'}
  * *
  * * **npm package**: `@angular/forms`
  * *
  * * **NgModule**: {@link ReactiveFormsModule}
  * *
 */
export var FormBuilder = (function () {
    function FormBuilder() {
    }
    /**
     *  Construct a new {@link FormGroup} with the given map of configuration.
      * Valid keys for the `extra` parameter map are `validator` and `asyncValidator`.
      * *
      * See the {@link FormGroup} constructor for more details.
     * @param {?} controlsConfig
     * @param {?=} extra
     * @return {?}
     */
    FormBuilder.prototype.group = function (controlsConfig, extra) {
        if (extra === void 0) { extra = null; }
        var /** @type {?} */ controls = this._reduceControls(controlsConfig);
        var /** @type {?} */ validator = isPresent(extra) ? extra['validator'] : null;
        var /** @type {?} */ asyncValidator = isPresent(extra) ? extra['asyncValidator'] : null;
        return new FormGroup(controls, validator, asyncValidator);
    };
    /**
     *  Construct a new {@link FormControl} with the given `formState`,`validator`, and
      * `asyncValidator`.
      * *
      * `formState` can either be a standalone value for the form control or an object
      * that contains both a value and a disabled status.
      * *
     * @param {?} formState
     * @param {?=} validator
     * @param {?=} asyncValidator
     * @return {?}
     */
    FormBuilder.prototype.control = function (formState, validator, asyncValidator) {
        if (validator === void 0) { validator = null; }
        if (asyncValidator === void 0) { asyncValidator = null; }
        return new FormControl(formState, validator, asyncValidator);
    };
    /**
     *  Construct a {@link FormArray} from the given `controlsConfig` array of
      * configuration, with the given optional `validator` and `asyncValidator`.
     * @param {?} controlsConfig
     * @param {?=} validator
     * @param {?=} asyncValidator
     * @return {?}
     */
    FormBuilder.prototype.array = function (controlsConfig, validator, asyncValidator) {
        var _this = this;
        if (validator === void 0) { validator = null; }
        if (asyncValidator === void 0) { asyncValidator = null; }
        var /** @type {?} */ controls = controlsConfig.map(function (c) { return _this._createControl(c); });
        return new FormArray(controls, validator, asyncValidator);
    };
    /**
     * @param {?} controlsConfig
     * @return {?}
     */
    FormBuilder.prototype._reduceControls = function (controlsConfig) {
        var _this = this;
        var /** @type {?} */ controls = {};
        Object.keys(controlsConfig).forEach(function (controlName) {
            controls[controlName] = _this._createControl(controlsConfig[controlName]);
        });
        return controls;
    };
    /**
     * @param {?} controlConfig
     * @return {?}
     */
    FormBuilder.prototype._createControl = function (controlConfig) {
        if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup ||
            controlConfig instanceof FormArray) {
            return controlConfig;
        }
        else if (Array.isArray(controlConfig)) {
            var /** @type {?} */ value = controlConfig[0];
            var /** @type {?} */ validator = controlConfig.length > 1 ? controlConfig[1] : null;
            var /** @type {?} */ asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
            return this.control(value, validator, asyncValidator);
        }
        else {
            return this.control(controlConfig);
        }
    };
    FormBuilder.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    FormBuilder.ctorParameters = function () { return []; };
    return FormBuilder;
}());
function FormBuilder_tsickle_Closure_declarations() {
    /** @type {?} */
    FormBuilder.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    FormBuilder.ctorParameters;
}
//# sourceMappingURL=form_builder.js.map