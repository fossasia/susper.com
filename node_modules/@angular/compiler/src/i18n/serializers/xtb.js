/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ml from '../../ml_parser/ast';
import { XmlParser } from '../../ml_parser/xml_parser';
import * as i18n from '../i18n_ast';
import { I18nError } from '../parse_util';
import { digest } from './xmb';
var /** @type {?} */ _TRANSLATIONS_TAG = 'translationbundle';
var /** @type {?} */ _TRANSLATION_TAG = 'translation';
var /** @type {?} */ _PLACEHOLDER_TAG = 'ph';
export var Xtb = (function () {
    function Xtb() {
    }
    /**
     * @param {?} messages
     * @return {?}
     */
    Xtb.prototype.write = function (messages) { throw new Error('Unsupported'); };
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    Xtb.prototype.load = function (content, url) {
        // xtb to xml nodes
        var /** @type {?} */ xtbParser = new XtbParser();
        var _a = xtbParser.parse(content, url), mlNodesByMsgId = _a.mlNodesByMsgId, errors = _a.errors;
        // xml nodes to i18n nodes
        var /** @type {?} */ i18nNodesByMsgId = {};
        var /** @type {?} */ converter = new XmlToI18n();
        Object.keys(mlNodesByMsgId).forEach(function (msgId) {
            var _a = converter.convert(mlNodesByMsgId[msgId]), i18nNodes = _a.i18nNodes, e = _a.errors;
            errors.push.apply(errors, e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error("xtb parse errors:\n" + errors.join('\n'));
        }
        return i18nNodesByMsgId;
    };
    /**
     * @param {?} message
     * @return {?}
     */
    Xtb.prototype.digest = function (message) { return digest(message); };
    return Xtb;
}());
// Extract messages as xml nodes from the xtb file
var XtbParser = (function () {
    function XtbParser() {
    }
    /**
     * @param {?} xtb
     * @param {?} url
     * @return {?}
     */
    XtbParser.prototype.parse = function (xtb, url) {
        this._bundleDepth = 0;
        this._mlNodesByMsgId = {};
        var /** @type {?} */ xml = new XmlParser().parse(xtb, url, true);
        this._errors = xml.errors;
        ml.visitAll(this, xml.rootNodes);
        return {
            mlNodesByMsgId: this._mlNodesByMsgId,
            errors: this._errors,
        };
    };
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitElement = function (element, context) {
        switch (element.name) {
            case _TRANSLATIONS_TAG:
                this._bundleDepth++;
                if (this._bundleDepth > 1) {
                    this._addError(element, "<" + _TRANSLATIONS_TAG + "> elements can not be nested");
                }
                ml.visitAll(this, element.children, null);
                this._bundleDepth--;
                break;
            case _TRANSLATION_TAG:
                var /** @type {?} */ idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                if (!idAttr) {
                    this._addError(element, "<" + _TRANSLATION_TAG + "> misses the \"id\" attribute");
                }
                else {
                    var /** @type {?} */ id = idAttr.value;
                    if (this._mlNodesByMsgId.hasOwnProperty(id)) {
                        this._addError(element, "Duplicated translations for msg " + id);
                    }
                    else {
                        this._mlNodesByMsgId[id] = element.children;
                    }
                }
                break;
            default:
                this._addError(element, 'Unexpected tag');
        }
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitAttribute = function (attribute, context) { };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitText = function (text, context) { };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitComment = function (comment, context) { };
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitExpansion = function (expansion, context) { };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitExpansionCase = function (expansionCase, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XtbParser.prototype._addError = function (node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    };
    return XtbParser;
}());
function XtbParser_tsickle_Closure_declarations() {
    /** @type {?} */
    XtbParser.prototype._bundleDepth;
    /** @type {?} */
    XtbParser.prototype._errors;
    /** @type {?} */
    XtbParser.prototype._mlNodesByMsgId;
}
// Convert ml nodes (xtb syntax) to i18n nodes
var XmlToI18n = (function () {
    function XmlToI18n() {
    }
    /**
     * @param {?} nodes
     * @return {?}
     */
    XmlToI18n.prototype.convert = function (nodes) {
        this._errors = [];
        return {
            i18nNodes: ml.visitAll(this, nodes),
            errors: this._errors,
        };
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitText = function (text, context) { return new i18n.Text(text.value, text.sourceSpan); };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitExpansion = function (icu, context) {
        var /** @type {?} */ caseMap = {};
        ml.visitAll(this, icu.cases).forEach(function (c) {
            caseMap[c.value] = new i18n.Container(c.nodes, icu.sourceSpan);
        });
        return new i18n.Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitExpansionCase = function (icuCase, context) {
        return {
            value: icuCase.value,
            nodes: ml.visitAll(this, icuCase.expression),
        };
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitElement = function (el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            var /** @type {?} */ nameAttr = el.attrs.find(function (attr) { return attr.name === 'name'; });
            if (nameAttr) {
                return new i18n.Placeholder('', nameAttr.value, el.sourceSpan);
            }
            this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"name\" attribute");
        }
        else {
            this._addError(el, "Unexpected tag");
        }
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitComment = function (comment, context) { };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XmlToI18n.prototype._addError = function (node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    };
    return XmlToI18n;
}());
function XmlToI18n_tsickle_Closure_declarations() {
    /** @type {?} */
    XmlToI18n.prototype._errors;
}
//# sourceMappingURL=xtb.js.map