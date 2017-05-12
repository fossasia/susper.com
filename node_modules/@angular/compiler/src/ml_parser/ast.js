/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export var Text = (function () {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    function Text(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Text.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
    return Text;
}());
function Text_tsickle_Closure_declarations() {
    /** @type {?} */
    Text.prototype.value;
    /** @type {?} */
    Text.prototype.sourceSpan;
}
export var Expansion = (function () {
    /**
     * @param {?} switchValue
     * @param {?} type
     * @param {?} cases
     * @param {?} sourceSpan
     * @param {?} switchValueSourceSpan
     */
    function Expansion(switchValue, type, cases, sourceSpan, switchValueSourceSpan) {
        this.switchValue = switchValue;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
        this.switchValueSourceSpan = switchValueSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Expansion.prototype.visit = function (visitor, context) { return visitor.visitExpansion(this, context); };
    return Expansion;
}());
function Expansion_tsickle_Closure_declarations() {
    /** @type {?} */
    Expansion.prototype.switchValue;
    /** @type {?} */
    Expansion.prototype.type;
    /** @type {?} */
    Expansion.prototype.cases;
    /** @type {?} */
    Expansion.prototype.sourceSpan;
    /** @type {?} */
    Expansion.prototype.switchValueSourceSpan;
}
export var ExpansionCase = (function () {
    /**
     * @param {?} value
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} valueSourceSpan
     * @param {?} expSourceSpan
     */
    function ExpansionCase(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
        this.value = value;
        this.expression = expression;
        this.sourceSpan = sourceSpan;
        this.valueSourceSpan = valueSourceSpan;
        this.expSourceSpan = expSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ExpansionCase.prototype.visit = function (visitor, context) { return visitor.visitExpansionCase(this, context); };
    return ExpansionCase;
}());
function ExpansionCase_tsickle_Closure_declarations() {
    /** @type {?} */
    ExpansionCase.prototype.value;
    /** @type {?} */
    ExpansionCase.prototype.expression;
    /** @type {?} */
    ExpansionCase.prototype.sourceSpan;
    /** @type {?} */
    ExpansionCase.prototype.valueSourceSpan;
    /** @type {?} */
    ExpansionCase.prototype.expSourceSpan;
}
export var Attribute = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?=} valueSpan
     */
    function Attribute(name, value, sourceSpan, valueSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.valueSpan = valueSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Attribute.prototype.visit = function (visitor, context) { return visitor.visitAttribute(this, context); };
    return Attribute;
}());
function Attribute_tsickle_Closure_declarations() {
    /** @type {?} */
    Attribute.prototype.name;
    /** @type {?} */
    Attribute.prototype.value;
    /** @type {?} */
    Attribute.prototype.sourceSpan;
    /** @type {?} */
    Attribute.prototype.valueSpan;
}
export var Element = (function () {
    /**
     * @param {?} name
     * @param {?} attrs
     * @param {?} children
     * @param {?} sourceSpan
     * @param {?} startSourceSpan
     * @param {?} endSourceSpan
     */
    function Element(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan) {
        this.name = name;
        this.attrs = attrs;
        this.children = children;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Element.prototype.visit = function (visitor, context) { return visitor.visitElement(this, context); };
    return Element;
}());
function Element_tsickle_Closure_declarations() {
    /** @type {?} */
    Element.prototype.name;
    /** @type {?} */
    Element.prototype.attrs;
    /** @type {?} */
    Element.prototype.children;
    /** @type {?} */
    Element.prototype.sourceSpan;
    /** @type {?} */
    Element.prototype.startSourceSpan;
    /** @type {?} */
    Element.prototype.endSourceSpan;
}
export var Comment = (function () {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    function Comment(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Comment.prototype.visit = function (visitor, context) { return visitor.visitComment(this, context); };
    return Comment;
}());
function Comment_tsickle_Closure_declarations() {
    /** @type {?} */
    Comment.prototype.value;
    /** @type {?} */
    Comment.prototype.sourceSpan;
}
/**
 * @param {?} visitor
 * @param {?} nodes
 * @param {?=} context
 * @return {?}
 */
export function visitAll(visitor, nodes, context) {
    if (context === void 0) { context = null; }
    var /** @type {?} */ result = [];
    var /** @type {?} */ visit = visitor.visit ?
        function (ast) { return visitor.visit(ast, context) || ast.visit(visitor, context); } :
        function (ast) { return ast.visit(visitor, context); };
    nodes.forEach(function (ast) {
        var /** @type {?} */ astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}
//# sourceMappingURL=ast.js.map