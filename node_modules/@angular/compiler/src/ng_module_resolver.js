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
import { NgModule } from '@angular/core';
import { ListWrapper } from './facade/collection';
import { isPresent, stringify } from './facade/lang';
import { CompilerInjectable } from './injectable';
import { ReflectorReader, reflector } from './private_import_core';
/**
 * @param {?} obj
 * @return {?}
 */
function _isNgModuleMetadata(obj) {
    return obj instanceof NgModule;
}
/**
 *  Resolves types to {@link NgModule}.
 */
export var NgModuleResolver = (function () {
    /**
     * @param {?=} _reflector
     */
    function NgModuleResolver(_reflector) {
        if (_reflector === void 0) { _reflector = reflector; }
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    NgModuleResolver.prototype.isNgModule = function (type) { return this._reflector.annotations(type).some(_isNgModuleMetadata); };
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    NgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ ngModuleMeta = ListWrapper.findLast(this._reflector.annotations(type), _isNgModuleMetadata);
        if (isPresent(ngModuleMeta)) {
            return ngModuleMeta;
        }
        else {
            if (throwIfNotFound) {
                throw new Error("No NgModule metadata found for '" + stringify(type) + "'.");
            }
            return null;
        }
    };
    NgModuleResolver = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [ReflectorReader])
    ], NgModuleResolver);
    return NgModuleResolver;
}());
function NgModuleResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleResolver.prototype._reflector;
}
//# sourceMappingURL=ng_module_resolver.js.map