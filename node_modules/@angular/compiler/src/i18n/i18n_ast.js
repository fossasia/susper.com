/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export var Message = (function () {
    /**
     * @param {?} nodes message AST
     * @param {?} placeholders maps placeholder names to static content
     * @param {?} placeholderToMessage maps placeholder names to messages (used for nested ICU messages)
     * @param {?} meaning
     * @param {?} description
     */
    function Message(nodes, placeholders, placeholderToMessage, meaning, description) {
        this.nodes = nodes;
        this.placeholders = placeholders;
        this.placeholderToMessage = placeholderToMessage;
        this.meaning = meaning;
        this.description = description;
    }
    return Message;
}());
function Message_tsickle_Closure_declarations() {
    /** @type {?} */
    Message.prototype.nodes;
    /** @type {?} */
    Message.prototype.placeholders;
    /** @type {?} */
    Message.prototype.placeholderToMessage;
    /** @type {?} */
    Message.prototype.meaning;
    /** @type {?} */
    Message.prototype.description;
}
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
     * @param {?=} context
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
// TODO(vicb): do we really need this node (vs an array) ?
export var Container = (function () {
    /**
     * @param {?} children
     * @param {?} sourceSpan
     */
    function Container(children, sourceSpan) {
        this.children = children;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Container.prototype.visit = function (visitor, context) { return visitor.visitContainer(this, context); };
    return Container;
}());
function Container_tsickle_Closure_declarations() {
    /** @type {?} */
    Container.prototype.children;
    /** @type {?} */
    Container.prototype.sourceSpan;
}
export var Icu = (function () {
    /**
     * @param {?} expression
     * @param {?} type
     * @param {?} cases
     * @param {?} sourceSpan
     */
    function Icu(expression, type, cases, sourceSpan) {
        this.expression = expression;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Icu.prototype.visit = function (visitor, context) { return visitor.visitIcu(this, context); };
    return Icu;
}());
function Icu_tsickle_Closure_declarations() {
    /** @type {?} */
    Icu.prototype.expressionPlaceholder;
    /** @type {?} */
    Icu.prototype.expression;
    /** @type {?} */
    Icu.prototype.type;
    /** @type {?} */
    Icu.prototype.cases;
    /** @type {?} */
    Icu.prototype.sourceSpan;
}
export var TagPlaceholder = (function () {
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} startName
     * @param {?} closeName
     * @param {?} children
     * @param {?} isVoid
     * @param {?} sourceSpan
     */
    function TagPlaceholder(tag, attrs, startName, closeName, children, isVoid, sourceSpan) {
        this.tag = tag;
        this.attrs = attrs;
        this.startName = startName;
        this.closeName = closeName;
        this.children = children;
        this.isVoid = isVoid;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    TagPlaceholder.prototype.visit = function (visitor, context) { return visitor.visitTagPlaceholder(this, context); };
    return TagPlaceholder;
}());
function TagPlaceholder_tsickle_Closure_declarations() {
    /** @type {?} */
    TagPlaceholder.prototype.tag;
    /** @type {?} */
    TagPlaceholder.prototype.attrs;
    /** @type {?} */
    TagPlaceholder.prototype.startName;
    /** @type {?} */
    TagPlaceholder.prototype.closeName;
    /** @type {?} */
    TagPlaceholder.prototype.children;
    /** @type {?} */
    TagPlaceholder.prototype.isVoid;
    /** @type {?} */
    TagPlaceholder.prototype.sourceSpan;
}
export var Placeholder = (function () {
    /**
     * @param {?} value
     * @param {?} name
     * @param {?} sourceSpan
     */
    function Placeholder(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Placeholder.prototype.visit = function (visitor, context) { return visitor.visitPlaceholder(this, context); };
    return Placeholder;
}());
function Placeholder_tsickle_Closure_declarations() {
    /** @type {?} */
    Placeholder.prototype.value;
    /** @type {?} */
    Placeholder.prototype.name;
    /** @type {?} */
    Placeholder.prototype.sourceSpan;
}
export var IcuPlaceholder = (function () {
    /**
     * @param {?} value
     * @param {?} name
     * @param {?} sourceSpan
     */
    function IcuPlaceholder(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    IcuPlaceholder.prototype.visit = function (visitor, context) { return visitor.visitIcuPlaceholder(this, context); };
    return IcuPlaceholder;
}());
function IcuPlaceholder_tsickle_Closure_declarations() {
    /** @type {?} */
    IcuPlaceholder.prototype.value;
    /** @type {?} */
    IcuPlaceholder.prototype.name;
    /** @type {?} */
    IcuPlaceholder.prototype.sourceSpan;
}
//# sourceMappingURL=i18n_ast.js.map