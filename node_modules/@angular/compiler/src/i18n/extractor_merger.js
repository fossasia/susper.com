/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as html from '../ml_parser/ast';
import { ParseTreeResult } from '../ml_parser/parser';
import * as i18n from './i18n_ast';
import { createI18nMessageFactory } from './i18n_parser';
import { I18nError } from './parse_util';
var /** @type {?} */ _I18N_ATTR = 'i18n';
var /** @type {?} */ _I18N_ATTR_PREFIX = 'i18n-';
var /** @type {?} */ _I18N_COMMENT_PREFIX_REGEXP = /^i18n:?/;
/**
 *  Extract translatable messages from an html AST
 * @param {?} nodes
 * @param {?} interpolationConfig
 * @param {?} implicitTags
 * @param {?} implicitAttrs
 * @return {?}
 */
export function extractMessages(nodes, interpolationConfig, implicitTags, implicitAttrs) {
    var /** @type {?} */ visitor = new _Visitor(implicitTags, implicitAttrs);
    return visitor.extract(nodes, interpolationConfig);
}
/**
 * @param {?} nodes
 * @param {?} translations
 * @param {?} interpolationConfig
 * @param {?} implicitTags
 * @param {?} implicitAttrs
 * @return {?}
 */
export function mergeTranslations(nodes, translations, interpolationConfig, implicitTags, implicitAttrs) {
    var /** @type {?} */ visitor = new _Visitor(implicitTags, implicitAttrs);
    return visitor.merge(nodes, translations, interpolationConfig);
}
export var ExtractionResult = (function () {
    /**
     * @param {?} messages
     * @param {?} errors
     */
    function ExtractionResult(messages, errors) {
        this.messages = messages;
        this.errors = errors;
    }
    return ExtractionResult;
}());
function ExtractionResult_tsickle_Closure_declarations() {
    /** @type {?} */
    ExtractionResult.prototype.messages;
    /** @type {?} */
    ExtractionResult.prototype.errors;
}
var _VisitorMode = {};
_VisitorMode.Extract = 0;
_VisitorMode.Merge = 1;
_VisitorMode[_VisitorMode.Extract] = "Extract";
_VisitorMode[_VisitorMode.Merge] = "Merge";
/**
 *  This Visitor is used:
  * 1. to extract all the translatable strings from an html AST (see `extract()`),
  * 2. to replace the translatable strings with the actual translations (see `merge()`)
  * *
 */
var _Visitor = (function () {
    /**
     * @param {?} _implicitTags
     * @param {?} _implicitAttrs
     */
    function _Visitor(_implicitTags, _implicitAttrs) {
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
    }
    /**
     *  Extracts the messages from the tree
     * @param {?} nodes
     * @param {?} interpolationConfig
     * @return {?}
     */
    _Visitor.prototype.extract = function (nodes, interpolationConfig) {
        var _this = this;
        this._init(_VisitorMode.Extract, interpolationConfig);
        nodes.forEach(function (node) { return node.visit(_this, null); });
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ExtractionResult(this._messages, this._errors);
    };
    /**
     *  Returns a tree where all translatable nodes are translated
     * @param {?} nodes
     * @param {?} translations
     * @param {?} interpolationConfig
     * @return {?}
     */
    _Visitor.prototype.merge = function (nodes, translations, interpolationConfig) {
        this._init(_VisitorMode.Merge, interpolationConfig);
        this._translations = translations;
        // Construct a single fake root element
        var /** @type {?} */ wrapper = new html.Element('wrapper', [], nodes, null, null, null);
        var /** @type {?} */ translatedNode = wrapper.visit(this, null);
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ParseTreeResult(translatedNode.children, this._errors);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitExpansionCase = function (icuCase, context) {
        // Parse cases for translatable html attributes
        var /** @type {?} */ expression = html.visitAll(this, icuCase.expression, context);
        if (this._mode === _VisitorMode.Merge) {
            return new html.ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
        }
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitExpansion = function (icu, context) {
        this._mayBeAddBlockChildren(icu);
        var /** @type {?} */ wasInIcu = this._inIcu;
        if (!this._inIcu) {
            // nested ICU messages should not be extracted but top-level translated as a whole
            if (this._isInTranslatableSection) {
                this._addMessage([icu]);
            }
            this._inIcu = true;
        }
        var /** @type {?} */ cases = html.visitAll(this, icu.cases, context);
        if (this._mode === _VisitorMode.Merge) {
            icu = new html.Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
        }
        this._inIcu = wasInIcu;
        return icu;
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitComment = function (comment, context) {
        var /** @type {?} */ isOpening = _isOpeningComment(comment);
        if (isOpening && this._isInTranslatableSection) {
            this._reportError(comment, 'Could not start a block inside a translatable section');
            return;
        }
        var /** @type {?} */ isClosing = _isClosingComment(comment);
        if (isClosing && !this._inI18nBlock) {
            this._reportError(comment, 'Trying to close an unopened block');
            return;
        }
        if (!this._inI18nNode && !this._inIcu) {
            if (!this._inI18nBlock) {
                if (isOpening) {
                    this._inI18nBlock = true;
                    this._blockStartDepth = this._depth;
                    this._blockChildren = [];
                    this._blockMeaningAndDesc = comment.value.replace(_I18N_COMMENT_PREFIX_REGEXP, '').trim();
                    this._openTranslatableSection(comment);
                }
            }
            else {
                if (isClosing) {
                    if (this._depth == this._blockStartDepth) {
                        this._closeTranslatableSection(comment, this._blockChildren);
                        this._inI18nBlock = false;
                        var /** @type {?} */ message = this._addMessage(this._blockChildren, this._blockMeaningAndDesc);
                        // merge attributes in sections
                        var /** @type {?} */ nodes = this._translateMessage(comment, message);
                        return html.visitAll(this, nodes);
                    }
                    else {
                        this._reportError(comment, 'I18N blocks should not cross element boundaries');
                        return;
                    }
                }
            }
        }
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitText = function (text, context) {
        if (this._isInTranslatableSection) {
            this._mayBeAddBlockChildren(text);
        }
        return text;
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitElement = function (el, context) {
        var _this = this;
        this._mayBeAddBlockChildren(el);
        this._depth++;
        var /** @type {?} */ wasInI18nNode = this._inI18nNode;
        var /** @type {?} */ wasInImplicitNode = this._inImplicitNode;
        var /** @type {?} */ childNodes;
        // Extract only top level nodes with the (implicit) "i18n" attribute if not in a block or an ICU
        // message
        var /** @type {?} */ i18nAttr = _getI18nAttr(el);
        var /** @type {?} */ isImplicit = this._implicitTags.some(function (tag) { return el.name === tag; }) && !this._inIcu &&
            !this._isInTranslatableSection;
        var /** @type {?} */ isTopLevelImplicit = !wasInImplicitNode && isImplicit;
        this._inImplicitNode = this._inImplicitNode || isImplicit;
        if (!this._isInTranslatableSection && !this._inIcu) {
            if (i18nAttr) {
                // explicit translation
                this._inI18nNode = true;
                var /** @type {?} */ message = this._addMessage(el.children, i18nAttr.value);
                childNodes = this._translateMessage(el, message);
            }
            else if (isTopLevelImplicit) {
                // implicit translation
                this._inI18nNode = true;
                var /** @type {?} */ message = this._addMessage(el.children);
                childNodes = this._translateMessage(el, message);
            }
            if (this._mode == _VisitorMode.Extract) {
                var /** @type {?} */ isTranslatable = i18nAttr || isTopLevelImplicit;
                if (isTranslatable) {
                    this._openTranslatableSection(el);
                }
                html.visitAll(this, el.children);
                if (isTranslatable) {
                    this._closeTranslatableSection(el, el.children);
                }
            }
            if (this._mode === _VisitorMode.Merge && !i18nAttr && !isTopLevelImplicit) {
                childNodes = [];
                el.children.forEach(function (child) {
                    var /** @type {?} */ visited = child.visit(_this, context);
                    if (visited && !_this._isInTranslatableSection) {
                        // Do not add the children from translatable sections (= i18n blocks here)
                        // They will be added when the section is close (i.e. on `<!-- /i18n -->`)
                        childNodes = childNodes.concat(visited);
                    }
                });
            }
        }
        else {
            if (i18nAttr || isTopLevelImplicit) {
                this._reportError(el, 'Could not mark an element as translatable inside a translatable section');
            }
            if (this._mode == _VisitorMode.Extract) {
                // Descend into child nodes for extraction
                html.visitAll(this, el.children);
            }
            if (this._mode == _VisitorMode.Merge) {
                // Translate attributes in ICU messages
                childNodes = [];
                el.children.forEach(function (child) {
                    var /** @type {?} */ visited = child.visit(_this, context);
                    if (visited && !_this._isInTranslatableSection) {
                        // Do not add the children from translatable sections (= i18n blocks here)
                        // They will be added when the section is close (i.e. on `<!-- /i18n -->`)
                        childNodes = childNodes.concat(visited);
                    }
                });
            }
        }
        this._visitAttributesOf(el);
        this._depth--;
        this._inI18nNode = wasInI18nNode;
        this._inImplicitNode = wasInImplicitNode;
        if (this._mode === _VisitorMode.Merge) {
            // There are no childNodes in translatable sections - those nodes will be replace anyway
            var /** @type {?} */ translatedAttrs = this._translateAttributes(el);
            return new html.Element(el.name, translatedAttrs, childNodes, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
        }
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitAttribute = function (attribute, context) {
        throw new Error('unreachable code');
    };
    /**
     * @param {?} mode
     * @param {?} interpolationConfig
     * @return {?}
     */
    _Visitor.prototype._init = function (mode, interpolationConfig) {
        this._mode = mode;
        this._inI18nBlock = false;
        this._inI18nNode = false;
        this._depth = 0;
        this._inIcu = false;
        this._msgCountAtSectionStart = void 0;
        this._errors = [];
        this._messages = [];
        this._inImplicitNode = false;
        this._createI18nMessage = createI18nMessageFactory(interpolationConfig);
    };
    /**
     * @param {?} el
     * @return {?}
     */
    _Visitor.prototype._visitAttributesOf = function (el) {
        var _this = this;
        var /** @type {?} */ explicitAttrNameToValue = {};
        var /** @type {?} */ implicitAttrNames = this._implicitAttrs[el.name] || [];
        el.attrs.filter(function (attr) { return attr.name.startsWith(_I18N_ATTR_PREFIX); })
            .forEach(function (attr) { return explicitAttrNameToValue[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
            attr.value; });
        el.attrs.forEach(function (attr) {
            if (attr.name in explicitAttrNameToValue) {
                _this._addMessage([attr], explicitAttrNameToValue[attr.name]);
            }
            else if (implicitAttrNames.some(function (name) { return attr.name === name; })) {
                _this._addMessage([attr]);
            }
        });
    };
    /**
     * @param {?} ast
     * @param {?=} meaningAndDesc
     * @return {?}
     */
    _Visitor.prototype._addMessage = function (ast, meaningAndDesc) {
        if (ast.length == 0 ||
            ast.length == 1 && ast[0] instanceof html.Attribute && !((ast[0])).value) {
            // Do not create empty messages
            return;
        }
        var _a = _splitMeaningAndDesc(meaningAndDesc), meaning = _a[0], description = _a[1];
        var /** @type {?} */ message = this._createI18nMessage(ast, meaning, description);
        this._messages.push(message);
        return message;
    };
    /**
     * @param {?} el
     * @param {?} message
     * @return {?}
     */
    _Visitor.prototype._translateMessage = function (el, message) {
        if (message && this._mode === _VisitorMode.Merge) {
            var /** @type {?} */ nodes = this._translations.get(message);
            if (nodes) {
                return nodes;
            }
            this._reportError(el, "Translation unavailable for message id=\"" + this._translations.digest(message) + "\"");
        }
        return [];
    };
    /**
     * @param {?} el
     * @return {?}
     */
    _Visitor.prototype._translateAttributes = function (el) {
        var _this = this;
        var /** @type {?} */ attributes = el.attrs;
        var /** @type {?} */ i18nAttributeMeanings = {};
        attributes.forEach(function (attr) {
            if (attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                i18nAttributeMeanings[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
                    _splitMeaningAndDesc(attr.value)[0];
            }
        });
        var /** @type {?} */ translatedAttributes = [];
        attributes.forEach(function (attr) {
            if (attr.name === _I18N_ATTR || attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                // strip i18n specific attributes
                return;
            }
            if (attr.value && attr.value != '' && i18nAttributeMeanings.hasOwnProperty(attr.name)) {
                var /** @type {?} */ meaning = i18nAttributeMeanings[attr.name];
                var /** @type {?} */ message = _this._createI18nMessage([attr], meaning, '');
                var /** @type {?} */ nodes = _this._translations.get(message);
                if (nodes) {
                    if (nodes[0] instanceof html.Text) {
                        var /** @type {?} */ value = ((nodes[0])).value;
                        translatedAttributes.push(new html.Attribute(attr.name, value, attr.sourceSpan));
                    }
                    else {
                        _this._reportError(el, "Unexpected translation for attribute \"" + attr.name + "\" (id=\"" + _this._translations.digest(message) + "\")");
                    }
                }
                else {
                    _this._reportError(el, "Translation unavailable for attribute \"" + attr.name + "\" (id=\"" + _this._translations.digest(message) + "\")");
                }
            }
            else {
                translatedAttributes.push(attr);
            }
        });
        return translatedAttributes;
    };
    /**
     *  Add the node as a child of the block when:
      * - we are in a block,
      * - we are not inside a ICU message (those are handled separately),
      * - the node is a "direct child" of the block
     * @param {?} node
     * @return {?}
     */
    _Visitor.prototype._mayBeAddBlockChildren = function (node) {
        if (this._inI18nBlock && !this._inIcu && this._depth == this._blockStartDepth) {
            this._blockChildren.push(node);
        }
    };
    /**
     *  Marks the start of a section, see `_endSection`
     * @param {?} node
     * @return {?}
     */
    _Visitor.prototype._openTranslatableSection = function (node) {
        if (this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section start');
        }
        else {
            this._msgCountAtSectionStart = this._messages.length;
        }
    };
    Object.defineProperty(_Visitor.prototype, "_isInTranslatableSection", {
        /**
         *  A translatable section could be:
          * - a translatable element,
          * - nodes between `<!-- i18n -->` and `<!-- /i18n -->` comments
         * @return {?}
         */
        get: function () {
            return this._msgCountAtSectionStart !== void 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  Terminates a section.
      * *
      * If a section has only one significant children (comments not significant) then we should not
      * keep the message from this children:
      * *
      * `<p i18n="meaning|description">{ICU message}</p>` would produce two messages:
      * - one for the <p> content with meaning and description,
      * - another one for the ICU message.
      * *
      * In this case the last message is discarded as it contains less information (the AST is
      * otherwise identical).
      * *
      * Note that we should still keep messages extracted from attributes inside the section (ie in the
      * ICU message here)
     * @param {?} node
     * @param {?} directChildren
     * @return {?}
     */
    _Visitor.prototype._closeTranslatableSection = function (node, directChildren) {
        if (!this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section end');
            return;
        }
        var /** @type {?} */ startIndex = this._msgCountAtSectionStart;
        var /** @type {?} */ significantChildren = directChildren.reduce(function (count, node) { return count + (node instanceof html.Comment ? 0 : 1); }, 0);
        if (significantChildren == 1) {
            for (var /** @type {?} */ i = this._messages.length - 1; i >= startIndex; i--) {
                var /** @type {?} */ ast = this._messages[i].nodes;
                if (!(ast.length == 1 && ast[0] instanceof i18n.Text)) {
                    this._messages.splice(i, 1);
                    break;
                }
            }
        }
        this._msgCountAtSectionStart = void 0;
    };
    /**
     * @param {?} node
     * @param {?} msg
     * @return {?}
     */
    _Visitor.prototype._reportError = function (node, msg) {
        this._errors.push(new I18nError(node.sourceSpan, msg));
    };
    return _Visitor;
}());
function _Visitor_tsickle_Closure_declarations() {
    /** @type {?} */
    _Visitor.prototype._inI18nNode;
    /** @type {?} */
    _Visitor.prototype._depth;
    /** @type {?} */
    _Visitor.prototype._inImplicitNode;
    /** @type {?} */
    _Visitor.prototype._blockMeaningAndDesc;
    /** @type {?} */
    _Visitor.prototype._blockChildren;
    /** @type {?} */
    _Visitor.prototype._blockStartDepth;
    /** @type {?} */
    _Visitor.prototype._inI18nBlock;
    /** @type {?} */
    _Visitor.prototype._inIcu;
    /** @type {?} */
    _Visitor.prototype._msgCountAtSectionStart;
    /** @type {?} */
    _Visitor.prototype._errors;
    /** @type {?} */
    _Visitor.prototype._mode;
    /** @type {?} */
    _Visitor.prototype._messages;
    /** @type {?} */
    _Visitor.prototype._translations;
    /** @type {?} */
    _Visitor.prototype._createI18nMessage;
    /** @type {?} */
    _Visitor.prototype._implicitTags;
    /** @type {?} */
    _Visitor.prototype._implicitAttrs;
}
/**
 * @param {?} n
 * @return {?}
 */
function _isOpeningComment(n) {
    return n instanceof html.Comment && n.value && n.value.startsWith('i18n');
}
/**
 * @param {?} n
 * @return {?}
 */
function _isClosingComment(n) {
    return n instanceof html.Comment && n.value && n.value === '/i18n';
}
/**
 * @param {?} p
 * @return {?}
 */
function _getI18nAttr(p) {
    return p.attrs.find(function (attr) { return attr.name === _I18N_ATTR; }) || null;
}
/**
 * @param {?} i18n
 * @return {?}
 */
function _splitMeaningAndDesc(i18n) {
    if (!i18n)
        return ['', ''];
    var /** @type {?} */ pipeIndex = i18n.indexOf('|');
    return pipeIndex == -1 ? ['', i18n] : [i18n.slice(0, pipeIndex), i18n.slice(pipeIndex + 1)];
}
//# sourceMappingURL=extractor_merger.js.map