/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var /** @type {?} */ TAG_TO_PLACEHOLDER_NAMES = {
    'A': 'LINK',
    'B': 'BOLD_TEXT',
    'BR': 'LINE_BREAK',
    'EM': 'EMPHASISED_TEXT',
    'H1': 'HEADING_LEVEL1',
    'H2': 'HEADING_LEVEL2',
    'H3': 'HEADING_LEVEL3',
    'H4': 'HEADING_LEVEL4',
    'H5': 'HEADING_LEVEL5',
    'H6': 'HEADING_LEVEL6',
    'HR': 'HORIZONTAL_RULE',
    'I': 'ITALIC_TEXT',
    'LI': 'LIST_ITEM',
    'LINK': 'MEDIA_LINK',
    'OL': 'ORDERED_LIST',
    'P': 'PARAGRAPH',
    'Q': 'QUOTATION',
    'S': 'STRIKETHROUGH_TEXT',
    'SMALL': 'SMALL_TEXT',
    'SUB': 'SUBSTRIPT',
    'SUP': 'SUPERSCRIPT',
    'TBODY': 'TABLE_BODY',
    'TD': 'TABLE_CELL',
    'TFOOT': 'TABLE_FOOTER',
    'TH': 'TABLE_HEADER_CELL',
    'THEAD': 'TABLE_HEADER',
    'TR': 'TABLE_ROW',
    'TT': 'MONOSPACED_TEXT',
    'U': 'UNDERLINED_TEXT',
    'UL': 'UNORDERED_LIST',
};
/**
 *  Creates unique names for placeholder with different content.
  * *
  * Returns the same placeholder name when the content is identical.
  * *
 */
export var PlaceholderRegistry = (function () {
    function PlaceholderRegistry() {
        this._placeHolderNameCounts = {};
        this._signatureToName = {};
    }
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    PlaceholderRegistry.prototype.getStartTagPlaceholderName = function (tag, attrs, isVoid) {
        var /** @type {?} */ signature = this._hashTag(tag, attrs, isVoid);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var /** @type {?} */ upperTag = tag.toUpperCase();
        var /** @type {?} */ baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var /** @type {?} */ name = this._generateUniqueName(isVoid ? baseName : "START_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    PlaceholderRegistry.prototype.getCloseTagPlaceholderName = function (tag) {
        var /** @type {?} */ signature = this._hashClosingTag(tag);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var /** @type {?} */ upperTag = tag.toUpperCase();
        var /** @type {?} */ baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var /** @type {?} */ name = this._generateUniqueName("CLOSE_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    /**
     * @param {?} name
     * @param {?} content
     * @return {?}
     */
    PlaceholderRegistry.prototype.getPlaceholderName = function (name, content) {
        var /** @type {?} */ upperName = name.toUpperCase();
        var /** @type {?} */ signature = "PH: " + upperName + "=" + content;
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var /** @type {?} */ uniqueName = this._generateUniqueName(upperName);
        this._signatureToName[signature] = uniqueName;
        return uniqueName;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    PlaceholderRegistry.prototype.getUniquePlaceholder = function (name) {
        return this._generateUniqueName(name.toUpperCase());
    };
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    PlaceholderRegistry.prototype._hashTag = function (tag, attrs, isVoid) {
        var /** @type {?} */ start = "<" + tag;
        var /** @type {?} */ strAttrs = Object.keys(attrs).sort().map(function (name) { return (" " + name + "=" + attrs[name]); }).join('');
        var /** @type {?} */ end = isVoid ? '/>' : "></" + tag + ">";
        return start + strAttrs + end;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    PlaceholderRegistry.prototype._hashClosingTag = function (tag) { return this._hashTag("/" + tag, {}, false); };
    /**
     * @param {?} base
     * @return {?}
     */
    PlaceholderRegistry.prototype._generateUniqueName = function (base) {
        var /** @type {?} */ next = this._placeHolderNameCounts[base];
        this._placeHolderNameCounts[base] = next ? next + 1 : 1;
        return next ? base + "_" + next : base;
    };
    return PlaceholderRegistry;
}());
function PlaceholderRegistry_tsickle_Closure_declarations() {
    /** @type {?} */
    PlaceholderRegistry.prototype._placeHolderNameCounts;
    /** @type {?} */
    PlaceholderRegistry.prototype._signatureToName;
}
//# sourceMappingURL=placeholder.js.map