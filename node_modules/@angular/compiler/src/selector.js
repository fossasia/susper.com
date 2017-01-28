/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getHtmlTagDefinition } from './ml_parser/html_tags';
var /** @type {?} */ _SELECTOR_REGEXP = new RegExp('(\\:not\\()|' +
    '([-\\w]+)|' +
    '(?:\\.([-\\w]+))|' +
    '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])|' +
    '(\\))|' +
    '(\\s*,\\s*)', // ","
'g');
/**
 *  A css selector contains an element name,
  * css classes and attribute/value pairs with the purpose
  * of selecting subsets out of them.
 */
export var CssSelector = (function () {
    function CssSelector() {
        this.element = null;
        this.classNames = [];
        this.attrs = [];
        this.notSelectors = [];
    }
    /**
     * @param {?} selector
     * @return {?}
     */
    CssSelector.parse = function (selector) {
        var /** @type {?} */ results = [];
        var /** @type {?} */ _addResult = function (res, cssSel) {
            if (cssSel.notSelectors.length > 0 && !cssSel.element && cssSel.classNames.length == 0 &&
                cssSel.attrs.length == 0) {
                cssSel.element = '*';
            }
            res.push(cssSel);
        };
        var /** @type {?} */ cssSelector = new CssSelector();
        var /** @type {?} */ match;
        var /** @type {?} */ current = cssSelector;
        var /** @type {?} */ inNot = false;
        _SELECTOR_REGEXP.lastIndex = 0;
        while (match = _SELECTOR_REGEXP.exec(selector)) {
            if (match[1]) {
                if (inNot) {
                    throw new Error('Nesting :not is not allowed in a selector');
                }
                inNot = true;
                current = new CssSelector();
                cssSelector.notSelectors.push(current);
            }
            if (match[2]) {
                current.setElement(match[2]);
            }
            if (match[3]) {
                current.addClassName(match[3]);
            }
            if (match[4]) {
                current.addAttribute(match[4], match[5]);
            }
            if (match[6]) {
                inNot = false;
                current = cssSelector;
            }
            if (match[7]) {
                if (inNot) {
                    throw new Error('Multiple selectors in :not are not supported');
                }
                _addResult(results, cssSelector);
                cssSelector = current = new CssSelector();
            }
        }
        _addResult(results, cssSelector);
        return results;
    };
    /**
     * @return {?}
     */
    CssSelector.prototype.isElementSelector = function () {
        return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 &&
            this.notSelectors.length === 0;
    };
    /**
     * @return {?}
     */
    CssSelector.prototype.hasElementSelector = function () { return !!this.element; };
    /**
     * @param {?=} element
     * @return {?}
     */
    CssSelector.prototype.setElement = function (element) {
        if (element === void 0) { element = null; }
        this.element = element;
    };
    /**
     *  Gets a template string for an element that matches the selector.
     * @return {?}
     */
    CssSelector.prototype.getMatchingElementTemplate = function () {
        var /** @type {?} */ tagName = this.element || 'div';
        var /** @type {?} */ classAttr = this.classNames.length > 0 ? " class=\"" + this.classNames.join(' ') + "\"" : '';
        var /** @type {?} */ attrs = '';
        for (var /** @type {?} */ i = 0; i < this.attrs.length; i += 2) {
            var /** @type {?} */ attrName = this.attrs[i];
            var /** @type {?} */ attrValue = this.attrs[i + 1] !== '' ? "=\"" + this.attrs[i + 1] + "\"" : '';
            attrs += " " + attrName + attrValue;
        }
        return getHtmlTagDefinition(tagName).isVoid ? "<" + tagName + classAttr + attrs + "/>" :
            "<" + tagName + classAttr + attrs + "></" + tagName + ">";
    };
    /**
     * @param {?} name
     * @param {?=} value
     * @return {?}
     */
    CssSelector.prototype.addAttribute = function (name, value) {
        if (value === void 0) { value = ''; }
        this.attrs.push(name, value && value.toLowerCase() || '');
    };
    /**
     * @param {?} name
     * @return {?}
     */
    CssSelector.prototype.addClassName = function (name) { this.classNames.push(name.toLowerCase()); };
    /**
     * @return {?}
     */
    CssSelector.prototype.toString = function () {
        var /** @type {?} */ res = this.element || '';
        if (this.classNames) {
            this.classNames.forEach(function (klass) { return res += "." + klass; });
        }
        if (this.attrs) {
            for (var /** @type {?} */ i = 0; i < this.attrs.length; i += 2) {
                var /** @type {?} */ name_1 = this.attrs[i];
                var /** @type {?} */ value = this.attrs[i + 1];
                res += "[" + name_1 + (value ? '=' + value : '') + "]";
            }
        }
        this.notSelectors.forEach(function (notSelector) { return res += ":not(" + notSelector + ")"; });
        return res;
    };
    return CssSelector;
}());
function CssSelector_tsickle_Closure_declarations() {
    /** @type {?} */
    CssSelector.prototype.element;
    /** @type {?} */
    CssSelector.prototype.classNames;
    /** @type {?} */
    CssSelector.prototype.attrs;
    /** @type {?} */
    CssSelector.prototype.notSelectors;
}
/**
 *  Reads a list of CssSelectors and allows to calculate which ones
  * are contained in a given CssSelector.
 */
export var SelectorMatcher = (function () {
    function SelectorMatcher() {
        this._elementMap = new Map();
        this._elementPartialMap = new Map();
        this._classMap = new Map();
        this._classPartialMap = new Map();
        this._attrValueMap = new Map();
        this._attrValuePartialMap = new Map();
        this._listContexts = [];
    }
    /**
     * @param {?} notSelectors
     * @return {?}
     */
    SelectorMatcher.createNotMatcher = function (notSelectors) {
        var /** @type {?} */ notMatcher = new SelectorMatcher();
        notMatcher.addSelectables(notSelectors, null);
        return notMatcher;
    };
    /**
     * @param {?} cssSelectors
     * @param {?=} callbackCtxt
     * @return {?}
     */
    SelectorMatcher.prototype.addSelectables = function (cssSelectors, callbackCtxt) {
        var /** @type {?} */ listContext = null;
        if (cssSelectors.length > 1) {
            listContext = new SelectorListContext(cssSelectors);
            this._listContexts.push(listContext);
        }
        for (var /** @type {?} */ i = 0; i < cssSelectors.length; i++) {
            this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
        }
    };
    /**
     *  Add an object that can be found later on by calling `match`.
     * @param {?} cssSelector A css selector
     * @param {?} callbackCtxt An opaque object that will be given to the callback of the `match` function
     * @param {?} listContext
     * @return {?}
     */
    SelectorMatcher.prototype._addSelectable = function (cssSelector, callbackCtxt, listContext) {
        var /** @type {?} */ matcher = this;
        var /** @type {?} */ element = cssSelector.element;
        var /** @type {?} */ classNames = cssSelector.classNames;
        var /** @type {?} */ attrs = cssSelector.attrs;
        var /** @type {?} */ selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
        if (element) {
            var /** @type {?} */ isTerminal = attrs.length === 0 && classNames.length === 0;
            if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
            }
            else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
            }
        }
        if (classNames) {
            for (var /** @type {?} */ i = 0; i < classNames.length; i++) {
                var /** @type {?} */ isTerminal = attrs.length === 0 && i === classNames.length - 1;
                var /** @type {?} */ className = classNames[i];
                if (isTerminal) {
                    this._addTerminal(matcher._classMap, className, selectable);
                }
                else {
                    matcher = this._addPartial(matcher._classPartialMap, className);
                }
            }
        }
        if (attrs) {
            for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
                var /** @type {?} */ isTerminal = i === attrs.length - 2;
                var /** @type {?} */ name_2 = attrs[i];
                var /** @type {?} */ value = attrs[i + 1];
                if (isTerminal) {
                    var /** @type {?} */ terminalMap = matcher._attrValueMap;
                    var /** @type {?} */ terminalValuesMap = terminalMap.get(name_2);
                    if (!terminalValuesMap) {
                        terminalValuesMap = new Map();
                        terminalMap.set(name_2, terminalValuesMap);
                    }
                    this._addTerminal(terminalValuesMap, value, selectable);
                }
                else {
                    var /** @type {?} */ partialMap = matcher._attrValuePartialMap;
                    var /** @type {?} */ partialValuesMap = partialMap.get(name_2);
                    if (!partialValuesMap) {
                        partialValuesMap = new Map();
                        partialMap.set(name_2, partialValuesMap);
                    }
                    matcher = this._addPartial(partialValuesMap, value);
                }
            }
        }
    };
    /**
     * @param {?} map
     * @param {?} name
     * @param {?} selectable
     * @return {?}
     */
    SelectorMatcher.prototype._addTerminal = function (map, name, selectable) {
        var /** @type {?} */ terminalList = map.get(name);
        if (!terminalList) {
            terminalList = [];
            map.set(name, terminalList);
        }
        terminalList.push(selectable);
    };
    /**
     * @param {?} map
     * @param {?} name
     * @return {?}
     */
    SelectorMatcher.prototype._addPartial = function (map, name) {
        var /** @type {?} */ matcher = map.get(name);
        if (!matcher) {
            matcher = new SelectorMatcher();
            map.set(name, matcher);
        }
        return matcher;
    };
    /**
     *  Find the objects that have been added via `addSelectable`
      * whose css selector is contained in the given css selector.
     * @param {?} cssSelector A css selector
     * @param {?} matchedCallback This callback will be called with the object handed into `addSelectable`
     * @return {?} boolean true if a match was found
     */
    SelectorMatcher.prototype.match = function (cssSelector, matchedCallback) {
        var /** @type {?} */ result = false;
        var /** @type {?} */ element = cssSelector.element;
        var /** @type {?} */ classNames = cssSelector.classNames;
        var /** @type {?} */ attrs = cssSelector.attrs;
        for (var /** @type {?} */ i = 0; i < this._listContexts.length; i++) {
            this._listContexts[i].alreadyMatched = false;
        }
        result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
        result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
            result;
        if (classNames) {
            for (var /** @type {?} */ i = 0; i < classNames.length; i++) {
                var /** @type {?} */ className = classNames[i];
                result =
                    this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result =
                    this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                        result;
            }
        }
        if (attrs) {
            for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
                var /** @type {?} */ name_3 = attrs[i];
                var /** @type {?} */ value = attrs[i + 1];
                var /** @type {?} */ terminalValuesMap = this._attrValueMap.get(name_3);
                if (value) {
                    result =
                        this._matchTerminal(terminalValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchTerminal(terminalValuesMap, value, cssSelector, matchedCallback) || result;
                var /** @type {?} */ partialValuesMap = this._attrValuePartialMap.get(name_3);
                if (value) {
                    result = this._matchPartial(partialValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchPartial(partialValuesMap, value, cssSelector, matchedCallback) || result;
            }
        }
        return result;
    };
    /**
     * @param {?} map
     * @param {?} name
     * @param {?} cssSelector
     * @param {?} matchedCallback
     * @return {?}
     */
    SelectorMatcher.prototype._matchTerminal = function (map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        var /** @type {?} */ selectables = map.get(name) || [];
        var /** @type {?} */ starSelectables = map.get('*');
        if (starSelectables) {
            selectables = selectables.concat(starSelectables);
        }
        if (selectables.length === 0) {
            return false;
        }
        var /** @type {?} */ selectable;
        var /** @type {?} */ result = false;
        for (var /** @type {?} */ i = 0; i < selectables.length; i++) {
            selectable = selectables[i];
            result = selectable.finalize(cssSelector, matchedCallback) || result;
        }
        return result;
    };
    /**
     * @param {?} map
     * @param {?} name
     * @param {?} cssSelector
     * @param {?} matchedCallback
     * @return {?}
     */
    SelectorMatcher.prototype._matchPartial = function (map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        var /** @type {?} */ nestedSelector = map.get(name);
        if (!nestedSelector) {
            return false;
        }
        // TODO(perf): get rid of recursion and measure again
        // TODO(perf): don't pass the whole selector into the recursion,
        // but only the not processed parts
        return nestedSelector.match(cssSelector, matchedCallback);
    };
    return SelectorMatcher;
}());
function SelectorMatcher_tsickle_Closure_declarations() {
    /** @type {?} */
    SelectorMatcher.prototype._elementMap;
    /** @type {?} */
    SelectorMatcher.prototype._elementPartialMap;
    /** @type {?} */
    SelectorMatcher.prototype._classMap;
    /** @type {?} */
    SelectorMatcher.prototype._classPartialMap;
    /** @type {?} */
    SelectorMatcher.prototype._attrValueMap;
    /** @type {?} */
    SelectorMatcher.prototype._attrValuePartialMap;
    /** @type {?} */
    SelectorMatcher.prototype._listContexts;
}
export var SelectorListContext = (function () {
    /**
     * @param {?} selectors
     */
    function SelectorListContext(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
    }
    return SelectorListContext;
}());
function SelectorListContext_tsickle_Closure_declarations() {
    /** @type {?} */
    SelectorListContext.prototype.alreadyMatched;
    /** @type {?} */
    SelectorListContext.prototype.selectors;
}
// Store context to pass back selector and context when a selector is matched
export var SelectorContext = (function () {
    /**
     * @param {?} selector
     * @param {?} cbContext
     * @param {?} listContext
     */
    function SelectorContext(selector, cbContext, listContext) {
        this.selector = selector;
        this.cbContext = cbContext;
        this.listContext = listContext;
        this.notSelectors = selector.notSelectors;
    }
    /**
     * @param {?} cssSelector
     * @param {?} callback
     * @return {?}
     */
    SelectorContext.prototype.finalize = function (cssSelector, callback) {
        var /** @type {?} */ result = true;
        if (this.notSelectors.length > 0 && (!this.listContext || !this.listContext.alreadyMatched)) {
            var /** @type {?} */ notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
            result = !notMatcher.match(cssSelector, null);
        }
        if (result && callback && (!this.listContext || !this.listContext.alreadyMatched)) {
            if (this.listContext) {
                this.listContext.alreadyMatched = true;
            }
            callback(this.selector, this.cbContext);
        }
        return result;
    };
    return SelectorContext;
}());
function SelectorContext_tsickle_Closure_declarations() {
    /** @type {?} */
    SelectorContext.prototype.notSelectors;
    /** @type {?} */
    SelectorContext.prototype.selector;
    /** @type {?} */
    SelectorContext.prototype.cbContext;
    /** @type {?} */
    SelectorContext.prototype.listContext;
}
//# sourceMappingURL=selector.js.map