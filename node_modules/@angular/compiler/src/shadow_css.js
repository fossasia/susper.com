/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * This file is a port of shadowCSS from webcomponents.js to TypeScript.
 *
 * Please make sure to keep to edits in sync with the source file.
 *
 * Source:
 * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
 *
 * The original file level comment is reproduced below
 */
/*
  This is a limited shim for ShadowDOM css styling.
  https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#styles

  The intention here is to support only the styling features which can be
  relatively simply implemented. The goal is to allow users to avoid the
  most obvious pitfalls and do so without compromising performance significantly.
  For ShadowDOM styling that's not covered here, a set of best practices
  can be provided that should allow users to accomplish more complex styling.

  The following is a list of specific ShadowDOM styling features and a brief
  discussion of the approach used to shim.

  Shimmed features:

  * :host, :host-context: ShadowDOM allows styling of the shadowRoot's host
  element using the :host rule. To shim this feature, the :host styles are
  reformatted and prefixed with a given scope name and promoted to a
  document level stylesheet.
  For example, given a scope name of .foo, a rule like this:

    :host {
        background: red;
      }
    }

  becomes:

    .foo {
      background: red;
    }

  * encapsulation: Styles defined within ShadowDOM, apply only to
  dom inside the ShadowDOM. Polymer uses one of two techniques to implement
  this feature.

  By default, rules are prefixed with the host element tag name
  as a descendant selector. This ensures styling does not leak out of the 'top'
  of the element's ShadowDOM. For example,

  div {
      font-weight: bold;
    }

  becomes:

  x-foo div {
      font-weight: bold;
    }

  becomes:


  Alternatively, if WebComponents.ShadowCSS.strictStyling is set to true then
  selectors are scoped by adding an attribute selector suffix to each
  simple selector that contains the host element tag name. Each element
  in the element's ShadowDOM template is also given the scope attribute.
  Thus, these rules match only elements that have the scope attribute.
  For example, given a scope name of x-foo, a rule like this:

    div {
      font-weight: bold;
    }

  becomes:

    div[x-foo] {
      font-weight: bold;
    }

  Note that elements that are dynamically added to a scope must have the scope
  selector added to them manually.

  * upper/lower bound encapsulation: Styles which are defined outside a
  shadowRoot should not cross the ShadowDOM boundary and should not apply
  inside a shadowRoot.

  This styling behavior is not emulated. Some possible ways to do this that
  were rejected due to complexity and/or performance concerns include: (1) reset
  every possible property for every possible selector for a given scope name;
  (2) re-implement css in javascript.

  As an alternative, users should make sure to use selectors
  specific to the scope in which they are working.

  * ::distributed: This behavior is not emulated. It's often not necessary
  to style the contents of a specific insertion point and instead, descendants
  of the host element can be styled selectively. Users can also create an
  extra node around an insertion point and style that node's contents
  via descendent selectors. For example, with a shadowRoot like this:

    <style>
      ::content(div) {
        background: red;
      }
    </style>
    <content></content>

  could become:

    <style>
      / *@polyfill .content-container div * /
      ::content(div) {
        background: red;
      }
    </style>
    <div class="content-container">
      <content></content>
    </div>

  Note the use of @polyfill in the comment above a ShadowDOM specific style
  declaration. This is a directive to the styling shim to use the selector
  in comments in lieu of the next selector when running under polyfill.
*/
export var ShadowCss = (function () {
    function ShadowCss() {
        this.strictStyling = true;
    }
    /**
     * @param {?} cssText
     * @param {?} selector
     * @param {?=} hostSelector
     * @return {?}
     */
    ShadowCss.prototype.shimCssText = function (cssText, selector, hostSelector) {
        if (hostSelector === void 0) { hostSelector = ''; }
        var /** @type {?} */ sourceMappingUrl = extractSourceMappingUrl(cssText);
        cssText = stripComments(cssText);
        cssText = this._insertDirectives(cssText);
        return this._scopeCssText(cssText, selector, hostSelector) + sourceMappingUrl;
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._insertDirectives = function (cssText) {
        cssText = this._insertPolyfillDirectivesInCssText(cssText);
        return this._insertPolyfillRulesInCssText(cssText);
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._insertPolyfillDirectivesInCssText = function (cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentNextSelectorRe, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i - 0] = arguments[_i];
            }
            return m[2] + '{';
        });
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._insertPolyfillRulesInCssText = function (cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentRuleRe, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i - 0] = arguments[_i];
            }
            var /** @type {?} */ rule = m[0].replace(m[1], '').replace(m[2], '');
            return m[4] + rule;
        });
    };
    /**
     * @param {?} cssText
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._scopeCssText = function (cssText, scopeSelector, hostSelector) {
        var /** @type {?} */ unscopedRules = this._extractUnscopedRulesFromCssText(cssText);
        // replace :host and :host-context -shadowcsshost and -shadowcsshost respectively
        cssText = this._insertPolyfillHostInCssText(cssText);
        cssText = this._convertColonHost(cssText);
        cssText = this._convertColonHostContext(cssText);
        cssText = this._convertShadowDOMSelectors(cssText);
        if (scopeSelector) {
            cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
        }
        cssText = cssText + '\n' + unscopedRules;
        return cssText.trim();
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._extractUnscopedRulesFromCssText = function (cssText) {
        // Difference with webcomponents.js: does not handle comments
        var /** @type {?} */ r = '';
        var /** @type {?} */ m;
        _cssContentUnscopedRuleRe.lastIndex = 0;
        while ((m = _cssContentUnscopedRuleRe.exec(cssText)) !== null) {
            var /** @type {?} */ rule = m[0].replace(m[2], '').replace(m[1], m[4]);
            r += rule + '\n\n';
        }
        return r;
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._convertColonHost = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._convertColonHostContext = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
    };
    /**
     * @param {?} cssText
     * @param {?} regExp
     * @param {?} partReplacer
     * @return {?}
     */
    ShadowCss.prototype._convertColonRule = function (cssText, regExp, partReplacer) {
        // m[1] = :host(-context), m[2] = contents of (), m[3] rest of rule
        return cssText.replace(regExp, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i - 0] = arguments[_i];
            }
            if (m[2]) {
                var /** @type {?} */ parts = m[2].split(',');
                var /** @type {?} */ r = [];
                for (var /** @type {?} */ i = 0; i < parts.length; i++) {
                    var /** @type {?} */ p = parts[i].trim();
                    if (!p)
                        break;
                    r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
                }
                return r.join(',');
            }
            else {
                return _polyfillHostNoCombinator + m[3];
            }
        });
    };
    /**
     * @param {?} host
     * @param {?} part
     * @param {?} suffix
     * @return {?}
     */
    ShadowCss.prototype._colonHostContextPartReplacer = function (host, part, suffix) {
        if (part.indexOf(_polyfillHost) > -1) {
            return this._colonHostPartReplacer(host, part, suffix);
        }
        else {
            return host + part + suffix + ', ' + part + ' ' + host + suffix;
        }
    };
    /**
     * @param {?} host
     * @param {?} part
     * @param {?} suffix
     * @return {?}
     */
    ShadowCss.prototype._colonHostPartReplacer = function (host, part, suffix) {
        return host + part.replace(_polyfillHost, '') + suffix;
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._convertShadowDOMSelectors = function (cssText) {
        return _shadowDOMSelectorsRe.reduce(function (result, pattern) { return result.replace(pattern, ' '); }, cssText);
    };
    /**
     * @param {?} cssText
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._scopeSelectors = function (cssText, scopeSelector, hostSelector) {
        var _this = this;
        return processRules(cssText, function (rule) {
            var /** @type {?} */ selector = rule.selector;
            var /** @type {?} */ content = rule.content;
            if (rule.selector[0] != '@') {
                selector =
                    _this._scopeSelector(rule.selector, scopeSelector, hostSelector, _this.strictStyling);
            }
            else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') ||
                rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
                content = _this._scopeSelectors(rule.content, scopeSelector, hostSelector);
            }
            return new CssRule(selector, content);
        });
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @param {?} strict
     * @return {?}
     */
    ShadowCss.prototype._scopeSelector = function (selector, scopeSelector, hostSelector, strict) {
        var _this = this;
        return selector.split(',')
            .map(function (part) { return part.trim().split(_shadowDeepSelectors); })
            .map(function (deepParts) {
            var shallowPart = deepParts[0], otherParts = deepParts.slice(1);
            var /** @type {?} */ applyScope = function (shallowPart) {
                if (_this._selectorNeedsScoping(shallowPart, scopeSelector)) {
                    return strict ?
                        _this._applyStrictSelectorScope(shallowPart, scopeSelector, hostSelector) :
                        _this._applySelectorScope(shallowPart, scopeSelector, hostSelector);
                }
                else {
                    return shallowPart;
                }
            };
            return [applyScope(shallowPart)].concat(otherParts).join(' ');
        })
            .join(', ');
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @return {?}
     */
    ShadowCss.prototype._selectorNeedsScoping = function (selector, scopeSelector) {
        var /** @type {?} */ re = this._makeScopeMatcher(scopeSelector);
        return !re.test(selector);
    };
    /**
     * @param {?} scopeSelector
     * @return {?}
     */
    ShadowCss.prototype._makeScopeMatcher = function (scopeSelector) {
        var /** @type {?} */ lre = /\[/g;
        var /** @type {?} */ rre = /\]/g;
        scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
        return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._applySelectorScope = function (selector, scopeSelector, hostSelector) {
        // Difference from webcomponents.js: scopeSelector could not be an array
        return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._applySimpleSelectorScope = function (selector, scopeSelector, hostSelector) {
        // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
        _polyfillHostRe.lastIndex = 0;
        if (_polyfillHostRe.test(selector)) {
            var /** @type {?} */ replaceBy_1 = this.strictStyling ? "[" + hostSelector + "]" : scopeSelector;
            return selector
                .replace(_polyfillHostNoCombinatorRe, function (hnc, selector) {
                return selector.replace(/([^:]*)(:*)(.*)/, function (_, before, colon, after) {
                    return before + replaceBy_1 + colon + after;
                });
            })
                .replace(_polyfillHostRe, replaceBy_1 + ' ');
        }
        return scopeSelector + ' ' + selector;
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._applyStrictSelectorScope = function (selector, scopeSelector, hostSelector) {
        var _this = this;
        var /** @type {?} */ isRe = /\[is=([^\]]*)\]/g;
        scopeSelector = scopeSelector.replace(isRe, function (_) {
            var parts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parts[_i - 1] = arguments[_i];
            }
            return parts[0];
        });
        var /** @type {?} */ attrName = '[' + scopeSelector + ']';
        var /** @type {?} */ _scopeSelectorPart = function (p) {
            var /** @type {?} */ scopedP = p.trim();
            if (!scopedP) {
                return '';
            }
            if (p.indexOf(_polyfillHostNoCombinator) > -1) {
                scopedP = _this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
            }
            else {
                // remove :host since it should be unnecessary
                var /** @type {?} */ t = p.replace(_polyfillHostRe, '');
                if (t.length > 0) {
                    var /** @type {?} */ matches = t.match(/([^:]*)(:*)(.*)/);
                    if (matches) {
                        scopedP = matches[1] + attrName + matches[2] + matches[3];
                    }
                }
            }
            return scopedP;
        };
        var /** @type {?} */ safeContent = new SafeSelector(selector);
        selector = safeContent.content();
        var /** @type {?} */ scopedSelector = '';
        var /** @type {?} */ startIndex = 0;
        var /** @type {?} */ res;
        var /** @type {?} */ sep = /( |>|\+|~(?!=))\s*/g;
        var /** @type {?} */ scopeAfter = selector.indexOf(_polyfillHostNoCombinator);
        while ((res = sep.exec(selector)) !== null) {
            var /** @type {?} */ separator = res[1];
            var /** @type {?} */ part = selector.slice(startIndex, res.index).trim();
            // if a selector appears before :host-context it should not be shimmed as it
            // matches on ancestor elements and not on elements in the host's shadow
            var /** @type {?} */ scopedPart = startIndex >= scopeAfter ? _scopeSelectorPart(part) : part;
            scopedSelector += scopedPart + " " + separator + " ";
            startIndex = sep.lastIndex;
        }
        scopedSelector += _scopeSelectorPart(selector.substring(startIndex));
        // replace the placeholders with their original values
        return safeContent.restore(scopedSelector);
    };
    /**
     * @param {?} selector
     * @return {?}
     */
    ShadowCss.prototype._insertPolyfillHostInCssText = function (selector) {
        return selector.replace(_colonHostContextRe, _polyfillHostContext)
            .replace(_colonHostRe, _polyfillHost);
    };
    return ShadowCss;
}());
function ShadowCss_tsickle_Closure_declarations() {
    /** @type {?} */
    ShadowCss.prototype.strictStyling;
}
var SafeSelector = (function () {
    /**
     * @param {?} selector
     */
    function SafeSelector(selector) {
        var _this = this;
        this.placeholders = [];
        this.index = 0;
        // Replaces attribute selectors with placeholders.
        // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
        selector = selector.replace(/(\[[^\]]*\])/g, function (_, keep) {
            var replaceBy = "__ph-" + _this.index + "__";
            _this.placeholders.push(keep);
            _this.index++;
            return replaceBy;
        });
        // Replaces the expression in `:nth-child(2n + 1)` with a placeholder.
        // WS and "+" would otherwise be interpreted as selector separators.
        this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, function (_, pseudo, exp) {
            var replaceBy = "__ph-" + _this.index + "__";
            _this.placeholders.push(exp);
            _this.index++;
            return pseudo + replaceBy;
        });
    }
    ;
    /**
     * @param {?} content
     * @return {?}
     */
    SafeSelector.prototype.restore = function (content) {
        var _this = this;
        return content.replace(/__ph-(\d+)__/g, function (ph, index) { return _this.placeholders[+index]; });
    };
    /**
     * @return {?}
     */
    SafeSelector.prototype.content = function () { return this._content; };
    return SafeSelector;
}());
function SafeSelector_tsickle_Closure_declarations() {
    /** @type {?} */
    SafeSelector.prototype.placeholders;
    /** @type {?} */
    SafeSelector.prototype.index;
    /** @type {?} */
    SafeSelector.prototype._content;
}
var /** @type {?} */ _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim;
var /** @type {?} */ _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var /** @type {?} */ _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var /** @type {?} */ _polyfillHost = '-shadowcsshost';
// note: :host-context pre-processed to -shadowcsshostcontext.
var /** @type {?} */ _polyfillHostContext = '-shadowcsscontext';
var /** @type {?} */ _parenSuffix = ')(?:\\((' +
    '(?:\\([^)(]*\\)|[^)(]*)+?' +
    ')\\))?([^,{]*)';
var /** @type {?} */ _cssColonHostRe = new RegExp('(' + _polyfillHost + _parenSuffix, 'gim');
var /** @type {?} */ _cssColonHostContextRe = new RegExp('(' + _polyfillHostContext + _parenSuffix, 'gim');
var /** @type {?} */ _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
var /** @type {?} */ _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
var /** @type {?} */ _shadowDOMSelectorsRe = [
    /::shadow/g,
    /::content/g,
    // Deprecated selectors
    /\/shadow-deep\//g,
    /\/shadow\//g,
];
var /** @type {?} */ _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)/g;
var /** @type {?} */ _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
var /** @type {?} */ _polyfillHostRe = /-shadowcsshost/gim;
var /** @type {?} */ _colonHostRe = /:host/gim;
var /** @type {?} */ _colonHostContextRe = /:host-context/gim;
var /** @type {?} */ _commentRe = /\/\*\s*[\s\S]*?\*\//g;
/**
 * @param {?} input
 * @return {?}
 */
function stripComments(input) {
    return input.replace(_commentRe, '');
}
// all comments except inline source mapping
var /** @type {?} */ _sourceMappingUrlRe = /\/\*\s*#\s*sourceMappingURL=[\s\S]+?\*\//;
/**
 * @param {?} input
 * @return {?}
 */
function extractSourceMappingUrl(input) {
    var /** @type {?} */ matcher = input.match(_sourceMappingUrlRe);
    return matcher ? matcher[0] : '';
}
var /** @type {?} */ _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
var /** @type {?} */ _curlyRe = /([{}])/g;
var /** @type {?} */ OPEN_CURLY = '{';
var /** @type {?} */ CLOSE_CURLY = '}';
var /** @type {?} */ BLOCK_PLACEHOLDER = '%BLOCK%';
export var CssRule = (function () {
    /**
     * @param {?} selector
     * @param {?} content
     */
    function CssRule(selector, content) {
        this.selector = selector;
        this.content = content;
    }
    return CssRule;
}());
function CssRule_tsickle_Closure_declarations() {
    /** @type {?} */
    CssRule.prototype.selector;
    /** @type {?} */
    CssRule.prototype.content;
}
/**
 * @param {?} input
 * @param {?} ruleCallback
 * @return {?}
 */
export function processRules(input, ruleCallback) {
    var /** @type {?} */ inputWithEscapedBlocks = escapeBlocks(input);
    var /** @type {?} */ nextBlockIndex = 0;
    return inputWithEscapedBlocks.escapedString.replace(_ruleRe, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i - 0] = arguments[_i];
        }
        var /** @type {?} */ selector = m[2];
        var /** @type {?} */ content = '';
        var /** @type {?} */ suffix = m[4];
        var /** @type {?} */ contentPrefix = '';
        if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
            content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
            suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
            contentPrefix = '{';
        }
        var /** @type {?} */ rule = ruleCallback(new CssRule(selector, content));
        return "" + m[1] + rule.selector + m[3] + contentPrefix + rule.content + suffix;
    });
}
var StringWithEscapedBlocks = (function () {
    /**
     * @param {?} escapedString
     * @param {?} blocks
     */
    function StringWithEscapedBlocks(escapedString, blocks) {
        this.escapedString = escapedString;
        this.blocks = blocks;
    }
    return StringWithEscapedBlocks;
}());
function StringWithEscapedBlocks_tsickle_Closure_declarations() {
    /** @type {?} */
    StringWithEscapedBlocks.prototype.escapedString;
    /** @type {?} */
    StringWithEscapedBlocks.prototype.blocks;
}
/**
 * @param {?} input
 * @return {?}
 */
function escapeBlocks(input) {
    var /** @type {?} */ inputParts = input.split(_curlyRe);
    var /** @type {?} */ resultParts = [];
    var /** @type {?} */ escapedBlocks = [];
    var /** @type {?} */ bracketCount = 0;
    var /** @type {?} */ currentBlockParts = [];
    for (var /** @type {?} */ partIndex = 0; partIndex < inputParts.length; partIndex++) {
        var /** @type {?} */ part = inputParts[partIndex];
        if (part == CLOSE_CURLY) {
            bracketCount--;
        }
        if (bracketCount > 0) {
            currentBlockParts.push(part);
        }
        else {
            if (currentBlockParts.length > 0) {
                escapedBlocks.push(currentBlockParts.join(''));
                resultParts.push(BLOCK_PLACEHOLDER);
                currentBlockParts = [];
            }
            resultParts.push(part);
        }
        if (part == OPEN_CURLY) {
            bracketCount++;
        }
    }
    if (currentBlockParts.length > 0) {
        escapedBlocks.push(currentBlockParts.join(''));
        resultParts.push(BLOCK_PLACEHOLDER);
    }
    return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
}
//# sourceMappingURL=shadow_css.js.map