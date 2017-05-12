/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { extractMessages } from './extractor_merger';
/**
 *  A container for message extracted from the templates.
 */
export var MessageBundle = (function () {
    /**
     * @param {?} _htmlParser
     * @param {?} _implicitTags
     * @param {?} _implicitAttrs
     */
    function MessageBundle(_htmlParser, _implicitTags, _implicitAttrs) {
        this._htmlParser = _htmlParser;
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
        this._messages = [];
    }
    /**
     * @param {?} html
     * @param {?} url
     * @param {?} interpolationConfig
     * @return {?}
     */
    MessageBundle.prototype.updateFromTemplate = function (html, url, interpolationConfig) {
        var /** @type {?} */ htmlParserResult = this._htmlParser.parse(html, url, true, interpolationConfig);
        if (htmlParserResult.errors.length) {
            return htmlParserResult.errors;
        }
        var /** @type {?} */ i18nParserResult = extractMessages(htmlParserResult.rootNodes, interpolationConfig, this._implicitTags, this._implicitAttrs);
        if (i18nParserResult.errors.length) {
            return i18nParserResult.errors;
        }
        (_a = this._messages).push.apply(_a, i18nParserResult.messages);
        var _a;
    };
    /**
     * @return {?}
     */
    MessageBundle.prototype.getMessages = function () { return this._messages; };
    /**
     * @param {?} serializer
     * @return {?}
     */
    MessageBundle.prototype.write = function (serializer) { return serializer.write(this._messages); };
    return MessageBundle;
}());
function MessageBundle_tsickle_Closure_declarations() {
    /** @type {?} */
    MessageBundle.prototype._messages;
    /** @type {?} */
    MessageBundle.prototype._htmlParser;
    /** @type {?} */
    MessageBundle.prototype._implicitTags;
    /** @type {?} */
    MessageBundle.prototype._implicitAttrs;
}
//# sourceMappingURL=message_bundle.js.map