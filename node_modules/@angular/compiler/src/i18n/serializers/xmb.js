/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { decimalDigest } from '../digest';
import * as xml from './xml_helper';
var /** @type {?} */ _MESSAGES_TAG = 'messagebundle';
var /** @type {?} */ _MESSAGE_TAG = 'msg';
var /** @type {?} */ _PLACEHOLDER_TAG = 'ph';
var /** @type {?} */ _EXEMPLE_TAG = 'ex';
var /** @type {?} */ _DOCTYPE = "<!ELEMENT messagebundle (msg)*>\n<!ATTLIST messagebundle class CDATA #IMPLIED>\n\n<!ELEMENT msg (#PCDATA|ph|source)*>\n<!ATTLIST msg id CDATA #IMPLIED>\n<!ATTLIST msg seq CDATA #IMPLIED>\n<!ATTLIST msg name CDATA #IMPLIED>\n<!ATTLIST msg desc CDATA #IMPLIED>\n<!ATTLIST msg meaning CDATA #IMPLIED>\n<!ATTLIST msg obsolete (obsolete) #IMPLIED>\n<!ATTLIST msg xml:space (default|preserve) \"default\">\n<!ATTLIST msg is_hidden CDATA #IMPLIED>\n\n<!ELEMENT source (#PCDATA)>\n\n<!ELEMENT ph (#PCDATA|ex)*>\n<!ATTLIST ph name CDATA #REQUIRED>\n\n<!ELEMENT ex (#PCDATA)>";
export var Xmb = (function () {
    function Xmb() {
    }
    /**
     * @param {?} messages
     * @return {?}
     */
    Xmb.prototype.write = function (messages) {
        var _this = this;
        var /** @type {?} */ exampleVisitor = new ExampleVisitor();
        var /** @type {?} */ visitor = new _Visitor();
        var /** @type {?} */ visited = {};
        var /** @type {?} */ rootNode = new xml.Tag(_MESSAGES_TAG);
        messages.forEach(function (message) {
            var /** @type {?} */ id = _this.digest(message);
            // deduplicate messages
            if (visited[id])
                return;
            visited[id] = true;
            var /** @type {?} */ attrs = { id: id };
            if (message.description) {
                attrs['desc'] = message.description;
            }
            if (message.meaning) {
                attrs['meaning'] = message.meaning;
            }
            rootNode.children.push(new xml.CR(2), new xml.Tag(_MESSAGE_TAG, attrs, visitor.serialize(message.nodes)));
        });
        rootNode.children.push(new xml.CR());
        return xml.serialize([
            new xml.Declaration({ version: '1.0', encoding: 'UTF-8' }),
            new xml.CR(),
            new xml.Doctype(_MESSAGES_TAG, _DOCTYPE),
            new xml.CR(),
            exampleVisitor.addDefaultExamples(rootNode),
            new xml.CR(),
        ]);
    };
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    Xmb.prototype.load = function (content, url) {
        throw new Error('Unsupported');
    };
    /**
     * @param {?} message
     * @return {?}
     */
    Xmb.prototype.digest = function (message) { return digest(message); };
    return Xmb;
}());
var _Visitor = (function () {
    function _Visitor() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    _Visitor.prototype.visitText = function (text, context) { return [new xml.Text(text.value)]; };
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    _Visitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        var /** @type {?} */ nodes = [];
        container.children.forEach(function (node) { return nodes.push.apply(nodes, node.visit(_this)); });
        return nodes;
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    _Visitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ nodes = [new xml.Text("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function (c) {
            nodes.push.apply(nodes, [new xml.Text(c + " {")].concat(icu.cases[c].visit(_this), [new xml.Text("} ")]));
        });
        nodes.push(new xml.Text("}"));
        return nodes;
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _Visitor.prototype.visitTagPlaceholder = function (ph, context) {
        var /** @type {?} */ startEx = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text("<" + ph.tag + ">")]);
        var /** @type {?} */ startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { name: ph.startName }, [startEx]);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [startTagPh];
        }
        var /** @type {?} */ closeEx = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text("</" + ph.tag + ">")]);
        var /** @type {?} */ closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { name: ph.closeName }, [closeEx]);
        return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _Visitor.prototype.visitPlaceholder = function (ph, context) {
        return [new xml.Tag(_PLACEHOLDER_TAG, { name: ph.name })];
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _Visitor.prototype.visitIcuPlaceholder = function (ph, context) {
        return [new xml.Tag(_PLACEHOLDER_TAG, { name: ph.name })];
    };
    /**
     * @param {?} nodes
     * @return {?}
     */
    _Visitor.prototype.serialize = function (nodes) {
        var _this = this;
        return (_a = []).concat.apply(_a, nodes.map(function (node) { return node.visit(_this); }));
        var _a;
    };
    return _Visitor;
}());
/**
 * @param {?} message
 * @return {?}
 */
export function digest(message) {
    return decimalDigest(message);
}
// TC requires at least one non-empty example on placeholders
var ExampleVisitor = (function () {
    function ExampleVisitor() {
    }
    /**
     * @param {?} node
     * @return {?}
     */
    ExampleVisitor.prototype.addDefaultExamples = function (node) {
        node.visit(this);
        return node;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    ExampleVisitor.prototype.visitTag = function (tag) {
        var _this = this;
        if (tag.name === _PLACEHOLDER_TAG) {
            if (!tag.children || tag.children.length == 0) {
                var /** @type {?} */ exText = new xml.Text(tag.attrs['name'] || '...');
                tag.children = [new xml.Tag(_EXEMPLE_TAG, {}, [exText])];
            }
        }
        else if (tag.children) {
            tag.children.forEach(function (node) { return node.visit(_this); });
        }
    };
    /**
     * @param {?} text
     * @return {?}
     */
    ExampleVisitor.prototype.visitText = function (text) { };
    /**
     * @param {?} decl
     * @return {?}
     */
    ExampleVisitor.prototype.visitDeclaration = function (decl) { };
    /**
     * @param {?} doctype
     * @return {?}
     */
    ExampleVisitor.prototype.visitDoctype = function (doctype) { };
    return ExampleVisitor;
}());
//# sourceMappingURL=xmb.js.map