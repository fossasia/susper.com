/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DEFAULT_INTERPOLATION_CONFIG } from '../ml_parser/interpolation_config';
import { ParseTreeResult } from '../ml_parser/parser';
import { mergeTranslations } from './extractor_merger';
import { Xliff } from './serializers/xliff';
import { Xmb } from './serializers/xmb';
import { Xtb } from './serializers/xtb';
import { TranslationBundle } from './translation_bundle';
export var I18NHtmlParser = (function () {
    /**
     * @param {?} _htmlParser
     * @param {?=} _translations
     * @param {?=} _translationsFormat
     */
    function I18NHtmlParser(_htmlParser, _translations, _translationsFormat) {
        this._htmlParser = _htmlParser;
        this._translations = _translations;
        this._translationsFormat = _translationsFormat;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    I18NHtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ parseResult = this._htmlParser.parse(source, url, parseExpansionForms, interpolationConfig);
        if (!this._translations || this._translations === '') {
            // Do not enable i18n when no translation bundle is provided
            return parseResult;
        }
        // TODO(vicb): add support for implicit tags / attributes
        if (parseResult.errors.length) {
            return new ParseTreeResult(parseResult.rootNodes, parseResult.errors);
        }
        var /** @type {?} */ serializer = this._createSerializer();
        var /** @type {?} */ translationBundle = TranslationBundle.load(this._translations, url, serializer);
        return mergeTranslations(parseResult.rootNodes, translationBundle, interpolationConfig, [], {});
    };
    /**
     * @return {?}
     */
    I18NHtmlParser.prototype._createSerializer = function () {
        var /** @type {?} */ format = (this._translationsFormat || 'xlf').toLowerCase();
        switch (format) {
            case 'xmb':
                return new Xmb();
            case 'xtb':
                return new Xtb();
            case 'xliff':
            case 'xlf':
            default:
                return new Xliff();
        }
    };
    return I18NHtmlParser;
}());
function I18NHtmlParser_tsickle_Closure_declarations() {
    /** @type {?} */
    I18NHtmlParser.prototype.getTagDefinition;
    /** @type {?} */
    I18NHtmlParser.prototype._htmlParser;
    /** @type {?} */
    I18NHtmlParser.prototype._translations;
    /** @type {?} */
    I18NHtmlParser.prototype._translationsFormat;
}
//# sourceMappingURL=i18n_html_parser.js.map