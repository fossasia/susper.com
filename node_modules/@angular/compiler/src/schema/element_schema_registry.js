/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @abstract
 */
export var ElementSchemaRegistry = (function () {
    function ElementSchemaRegistry() {
    }
    /**
     * @abstract
     * @param {?} tagName
     * @param {?} propName
     * @param {?} schemaMetas
     * @return {?}
     */
    ElementSchemaRegistry.prototype.hasProperty = function (tagName, propName, schemaMetas) { };
    /**
     * @abstract
     * @param {?} tagName
     * @param {?} schemaMetas
     * @return {?}
     */
    ElementSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) { };
    /**
     * @abstract
     * @param {?} elementName
     * @param {?} propName
     * @param {?} isAttribute
     * @return {?}
     */
    ElementSchemaRegistry.prototype.securityContext = function (elementName, propName, isAttribute) { };
    /**
     * @abstract
     * @return {?}
     */
    ElementSchemaRegistry.prototype.allKnownElementNames = function () { };
    /**
     * @abstract
     * @param {?} propName
     * @return {?}
     */
    ElementSchemaRegistry.prototype.getMappedPropName = function (propName) { };
    /**
     * @abstract
     * @return {?}
     */
    ElementSchemaRegistry.prototype.getDefaultComponentElementName = function () { };
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    ElementSchemaRegistry.prototype.validateProperty = function (name) { };
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    ElementSchemaRegistry.prototype.validateAttribute = function (name) { };
    /**
     * @abstract
     * @param {?} propName
     * @return {?}
     */
    ElementSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) { };
    /**
     * @abstract
     * @param {?} camelCaseProp
     * @param {?} userProvidedProp
     * @param {?} val
     * @return {?}
     */
    ElementSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) { };
    return ElementSchemaRegistry;
}());
//# sourceMappingURL=element_schema_registry.js.map