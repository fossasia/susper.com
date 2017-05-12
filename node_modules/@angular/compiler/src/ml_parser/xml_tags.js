/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TagContentType } from './tags';
export var XmlTagDefinition = (function () {
    function XmlTagDefinition() {
        this.closedByParent = false;
        this.contentType = TagContentType.PARSABLE_DATA;
        this.isVoid = false;
        this.ignoreFirstLf = false;
        this.canSelfClose = true;
    }
    /**
     * @param {?} currentParent
     * @return {?}
     */
    XmlTagDefinition.prototype.requireExtraParent = function (currentParent) { return false; };
    /**
     * @param {?} name
     * @return {?}
     */
    XmlTagDefinition.prototype.isClosedByChild = function (name) { return false; };
    return XmlTagDefinition;
}());
function XmlTagDefinition_tsickle_Closure_declarations() {
    /** @type {?} */
    XmlTagDefinition.prototype.closedByParent;
    /** @type {?} */
    XmlTagDefinition.prototype.requiredParents;
    /** @type {?} */
    XmlTagDefinition.prototype.parentToAdd;
    /** @type {?} */
    XmlTagDefinition.prototype.implicitNamespacePrefix;
    /** @type {?} */
    XmlTagDefinition.prototype.contentType;
    /** @type {?} */
    XmlTagDefinition.prototype.isVoid;
    /** @type {?} */
    XmlTagDefinition.prototype.ignoreFirstLf;
    /** @type {?} */
    XmlTagDefinition.prototype.canSelfClose;
}
var /** @type {?} */ _TAG_DEFINITION = new XmlTagDefinition();
/**
 * @param {?} tagName
 * @return {?}
 */
export function getXmlTagDefinition(tagName) {
    return _TAG_DEFINITION;
}
//# sourceMappingURL=xml_tags.js.map