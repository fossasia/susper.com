/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Pipe, resolveForwardRef } from '@angular/core';
import { ListWrapper } from './facade/collection';
import { isPresent, stringify } from './facade/lang';
import { CompilerInjectable } from './injectable';
import { ReflectorReader, reflector } from './private_import_core';
/**
 * @param {?} type
 * @return {?}
 */
function _isPipeMetadata(type) {
    return type instanceof Pipe;
}
/**
 *  Resolve a `Type` for {@link Pipe}.
  * *
  * This interface can be overridden by the application developer to create custom behavior.
  * *
  * See {@link Compiler}
 */
export var PipeResolver = (function () {
    /**
     * @param {?=} _reflector
     */
    function PipeResolver(_reflector) {
        if (_reflector === void 0) { _reflector = reflector; }
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    PipeResolver.prototype.isPipe = function (type) {
        var /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(_isPipeMetadata);
    };
    /**
     *  Return {@link Pipe} for a given `Type`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    PipeResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ metas = this._reflector.annotations(resolveForwardRef(type));
        if (isPresent(metas)) {
            var /** @type {?} */ annotation = ListWrapper.findLast(metas, _isPipeMetadata);
            if (isPresent(annotation)) {
                return annotation;
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Pipe decorator found on " + stringify(type));
        }
        return null;
    };
    PipeResolver = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [ReflectorReader])
    ], PipeResolver);
    return PipeResolver;
}());
function PipeResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    PipeResolver.prototype._reflector;
}
//# sourceMappingURL=pipe_resolver.js.map