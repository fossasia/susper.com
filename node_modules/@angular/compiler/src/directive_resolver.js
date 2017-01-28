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
import { Component, Directive, HostBinding, HostListener, Input, Output, Query, resolveForwardRef } from '@angular/core';
import { ListWrapper, StringMapWrapper } from './facade/collection';
import { stringify } from './facade/lang';
import { CompilerInjectable } from './injectable';
import { ReflectorReader, reflector } from './private_import_core';
import { splitAtColon } from './util';
/*
 * Resolve a `Type` for {@link Directive}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
export var DirectiveResolver = (function () {
    /**
     * @param {?=} _reflector
     */
    function DirectiveResolver(_reflector) {
        if (_reflector === void 0) { _reflector = reflector; }
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    DirectiveResolver.prototype.isDirective = function (type) {
        var /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(isDirectiveMetadata);
    };
    /**
     *  Return {@link Directive} for a given `Type`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    DirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        if (typeMetadata) {
            var /** @type {?} */ metadata = ListWrapper.findLast(typeMetadata, isDirectiveMetadata);
            if (metadata) {
                var /** @type {?} */ propertyMetadata = this._reflector.propMetadata(type);
                return this._mergeWithPropertyMetadata(metadata, propertyMetadata, type);
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Directive annotation found on " + stringify(type));
        }
        return null;
    };
    /**
     * @param {?} dm
     * @param {?} propertyMetadata
     * @param {?} directiveType
     * @return {?}
     */
    DirectiveResolver.prototype._mergeWithPropertyMetadata = function (dm, propertyMetadata, directiveType) {
        var /** @type {?} */ inputs = [];
        var /** @type {?} */ outputs = [];
        var /** @type {?} */ host = {};
        var /** @type {?} */ queries = {};
        Object.keys(propertyMetadata).forEach(function (propName) {
            var /** @type {?} */ input = ListWrapper.findLast(propertyMetadata[propName], function (a) { return a instanceof Input; });
            if (input) {
                if (input.bindingPropertyName) {
                    inputs.push(propName + ": " + input.bindingPropertyName);
                }
                else {
                    inputs.push(propName);
                }
            }
            var /** @type {?} */ output = ListWrapper.findLast(propertyMetadata[propName], function (a) { return a instanceof Output; });
            if (output) {
                if (output.bindingPropertyName) {
                    outputs.push(propName + ": " + output.bindingPropertyName);
                }
                else {
                    outputs.push(propName);
                }
            }
            var /** @type {?} */ hostBindings = propertyMetadata[propName].filter(function (a) { return a && a instanceof HostBinding; });
            hostBindings.forEach(function (hostBinding) {
                if (hostBinding.hostPropertyName) {
                    var /** @type {?} */ startWith = hostBinding.hostPropertyName[0];
                    if (startWith === '(') {
                        throw new Error("@HostBinding can not bind to events. Use @HostListener instead.");
                    }
                    else if (startWith === '[') {
                        throw new Error("@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.");
                    }
                    host[("[" + hostBinding.hostPropertyName + "]")] = propName;
                }
                else {
                    host[("[" + propName + "]")] = propName;
                }
            });
            var /** @type {?} */ hostListeners = propertyMetadata[propName].filter(function (a) { return a && a instanceof HostListener; });
            hostListeners.forEach(function (hostListener) {
                var /** @type {?} */ args = hostListener.args || [];
                host[("(" + hostListener.eventName + ")")] = propName + "(" + args.join(',') + ")";
            });
            var /** @type {?} */ query = ListWrapper.findLast(propertyMetadata[propName], function (a) { return a instanceof Query; });
            if (query) {
                queries[propName] = query;
            }
        });
        return this._merge(dm, inputs, outputs, host, queries, directiveType);
    };
    /**
     * @param {?} def
     * @return {?}
     */
    DirectiveResolver.prototype._extractPublicName = function (def) { return splitAtColon(def, [null, def])[1].trim(); };
    /**
     * @param {?} bindings
     * @return {?}
     */
    DirectiveResolver.prototype._dedupeBindings = function (bindings) {
        var /** @type {?} */ names = new Set();
        var /** @type {?} */ reversedResult = [];
        // go last to first to allow later entries to overwrite previous entries
        for (var /** @type {?} */ i = bindings.length - 1; i >= 0; i--) {
            var /** @type {?} */ binding = bindings[i];
            var /** @type {?} */ name_1 = this._extractPublicName(binding);
            if (!names.has(name_1)) {
                names.add(name_1);
                reversedResult.push(binding);
            }
        }
        return reversedResult.reverse();
    };
    /**
     * @param {?} directive
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} host
     * @param {?} queries
     * @param {?} directiveType
     * @return {?}
     */
    DirectiveResolver.prototype._merge = function (directive, inputs, outputs, host, queries, directiveType) {
        var /** @type {?} */ mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
        var /** @type {?} */ mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
        var /** @type {?} */ mergedHost = directive.host ? StringMapWrapper.merge(directive.host, host) : host;
        var /** @type {?} */ mergedQueries = directive.queries ? StringMapWrapper.merge(directive.queries, queries) : queries;
        if (directive instanceof Component) {
            return new Component({
                selector: directive.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: directive.exportAs,
                moduleId: directive.moduleId,
                queries: mergedQueries,
                changeDetection: directive.changeDetection,
                providers: directive.providers,
                viewProviders: directive.viewProviders,
                entryComponents: directive.entryComponents,
                template: directive.template,
                templateUrl: directive.templateUrl,
                styles: directive.styles,
                styleUrls: directive.styleUrls,
                encapsulation: directive.encapsulation,
                animations: directive.animations,
                interpolation: directive.interpolation
            });
        }
        else {
            return new Directive({
                selector: directive.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: directive.exportAs,
                queries: mergedQueries,
                providers: directive.providers
            });
        }
    };
    DirectiveResolver = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [ReflectorReader])
    ], DirectiveResolver);
    return DirectiveResolver;
}());
function DirectiveResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    DirectiveResolver.prototype._reflector;
}
/**
 * @param {?} type
 * @return {?}
 */
function isDirectiveMetadata(type) {
    return type instanceof Directive;
}
//# sourceMappingURL=directive_resolver.js.map