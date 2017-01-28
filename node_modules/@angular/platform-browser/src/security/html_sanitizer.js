/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isDevMode } from '@angular/core';
import { getDOM } from '../dom/dom_adapter';
import { sanitizeSrcset, sanitizeUrl } from './url_sanitizer';
/** A <body> element that can be safely used to parse untrusted HTML. Lazily initialized below. */
var /** @type {?} */ inertElement = null;
/** Lazily initialized to make sure the DOM adapter gets set before use. */
var /** @type {?} */ DOM = null;
/**
 *  Returns an HTML element that is guaranteed to not execute code when creating elements in it.
 * @return {?}
 */
function getInertElement() {
    if (inertElement)
        return inertElement;
    DOM = getDOM();
    // Prefer using <template> element if supported.
    var /** @type {?} */ templateEl = DOM.createElement('template');
    if ('content' in templateEl)
        return templateEl;
    var /** @type {?} */ doc = DOM.createHtmlDocument();
    inertElement = DOM.querySelector(doc, 'body');
    if (inertElement == null) {
        // usually there should be only one body element in the document, but IE doesn't have any, so we
        // need to create one.
        var /** @type {?} */ html = DOM.createElement('html', doc);
        inertElement = DOM.createElement('body', doc);
        DOM.appendChild(html, inertElement);
        DOM.appendChild(doc, html);
    }
    return inertElement;
}
/**
 * @param {?} tags
 * @return {?}
 */
function tagSet(tags) {
    var /** @type {?} */ res = {};
    for (var _i = 0, _a = tags.split(','); _i < _a.length; _i++) {
        var t = _a[_i];
        res[t] = true;
    }
    return res;
}
/**
 * @param {...?} sets
 * @return {?}
 */
function merge() {
    var sets = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sets[_i - 0] = arguments[_i];
    }
    var /** @type {?} */ res = {};
    for (var _a = 0, sets_1 = sets; _a < sets_1.length; _a++) {
        var s = sets_1[_a];
        for (var v in s) {
            if (s.hasOwnProperty(v))
                res[v] = true;
        }
    }
    return res;
}
// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements
// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var /** @type {?} */ VOID_ELEMENTS = tagSet('area,br,col,hr,img,wbr');
// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var /** @type {?} */ OPTIONAL_END_TAG_BLOCK_ELEMENTS = tagSet('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr');
var /** @type {?} */ OPTIONAL_END_TAG_INLINE_ELEMENTS = tagSet('rp,rt');
var /** @type {?} */ OPTIONAL_END_TAG_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, OPTIONAL_END_TAG_BLOCK_ELEMENTS);
// Safe Block Elements - HTML5
var /** @type {?} */ BLOCK_ELEMENTS = merge(OPTIONAL_END_TAG_BLOCK_ELEMENTS, tagSet('address,article,' +
    'aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,' +
    'h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul'));
// Inline Elements - HTML5
var /** @type {?} */ INLINE_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, tagSet('a,abbr,acronym,audio,b,' +
    'bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,' +
    'samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video'));
var /** @type {?} */ VALID_ELEMENTS = merge(VOID_ELEMENTS, BLOCK_ELEMENTS, INLINE_ELEMENTS, OPTIONAL_END_TAG_ELEMENTS);
// Attributes that have href and hence need to be sanitized
var /** @type {?} */ URI_ATTRS = tagSet('background,cite,href,itemtype,longdesc,poster,src,xlink:href');
// Attributes that have special href set hence need to be sanitized
var /** @type {?} */ SRCSET_ATTRS = tagSet('srcset');
var /** @type {?} */ HTML_ATTRS = tagSet('abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,' +
    'compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,' +
    'ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,' +
    'scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap,' +
    'valign,value,vspace,width');
// NB: This currently conciously doesn't support SVG. SVG sanitization has had several security
// issues in the past, so it seems safer to leave it out if possible. If support for binding SVG via
// innerHTML is required, SVG attributes should be added here.
// NB: Sanitization does not allow <form> elements or other active elements (<button> etc). Those
// can be sanitized, but they increase security surface area without a legitimate use case, so they
// are left out here.
var /** @type {?} */ VALID_ATTRS = merge(URI_ATTRS, SRCSET_ATTRS, HTML_ATTRS);
/**
 *  SanitizingHtmlSerializer serializes a DOM fragment, stripping out any unsafe elements and unsafe
  * attributes.
 */
var SanitizingHtmlSerializer = (function () {
    function SanitizingHtmlSerializer() {
        this.sanitizedSomething = false;
        this.buf = [];
    }
    /**
     * @param {?} el
     * @return {?}
     */
    SanitizingHtmlSerializer.prototype.sanitizeChildren = function (el) {
        // This cannot use a TreeWalker, as it has to run on Angular's various DOM adapters.
        // However this code never accesses properties off of `document` before deleting its contents
        // again, so it shouldn't be vulnerable to DOM clobbering.
        var /** @type {?} */ current = el.firstChild;
        while (current) {
            if (DOM.isElementNode(current)) {
                this.startElement(/** @type {?} */ (current));
            }
            else if (DOM.isTextNode(current)) {
                this.chars(DOM.nodeValue(current));
            }
            else {
                // Strip non-element, non-text nodes.
                this.sanitizedSomething = true;
            }
            if (DOM.firstChild(current)) {
                current = DOM.firstChild(current);
                continue;
            }
            while (current) {
                // Leaving the element. Walk up and to the right, closing tags as we go.
                if (DOM.isElementNode(current)) {
                    this.endElement(/** @type {?} */ (current));
                }
                if (DOM.nextSibling(current)) {
                    current = DOM.nextSibling(current);
                    break;
                }
                current = DOM.parentElement(current);
            }
        }
        return this.buf.join('');
    };
    /**
     * @param {?} element
     * @return {?}
     */
    SanitizingHtmlSerializer.prototype.startElement = function (element) {
        var _this = this;
        var /** @type {?} */ tagName = DOM.nodeName(element).toLowerCase();
        if (!VALID_ELEMENTS.hasOwnProperty(tagName)) {
            this.sanitizedSomething = true;
            return;
        }
        this.buf.push('<');
        this.buf.push(tagName);
        DOM.attributeMap(element).forEach(function (value, attrName) {
            var /** @type {?} */ lower = attrName.toLowerCase();
            if (!VALID_ATTRS.hasOwnProperty(lower)) {
                _this.sanitizedSomething = true;
                return;
            }
            // TODO(martinprobst): Special case image URIs for data:image/...
            if (URI_ATTRS[lower])
                value = sanitizeUrl(value);
            if (SRCSET_ATTRS[lower])
                value = sanitizeSrcset(value);
            _this.buf.push(' ');
            _this.buf.push(attrName);
            _this.buf.push('="');
            _this.buf.push(encodeEntities(value));
            _this.buf.push('"');
        });
        this.buf.push('>');
    };
    /**
     * @param {?} current
     * @return {?}
     */
    SanitizingHtmlSerializer.prototype.endElement = function (current) {
        var /** @type {?} */ tagName = DOM.nodeName(current).toLowerCase();
        if (VALID_ELEMENTS.hasOwnProperty(tagName) && !VOID_ELEMENTS.hasOwnProperty(tagName)) {
            this.buf.push('</');
            this.buf.push(tagName);
            this.buf.push('>');
        }
    };
    /**
     * @param {?} chars
     * @return {?}
     */
    SanitizingHtmlSerializer.prototype.chars = function (chars /** TODO #9100 */) { this.buf.push(encodeEntities(chars)); };
    return SanitizingHtmlSerializer;
}());
function SanitizingHtmlSerializer_tsickle_Closure_declarations() {
    /** @type {?} */
    SanitizingHtmlSerializer.prototype.sanitizedSomething;
    /** @type {?} */
    SanitizingHtmlSerializer.prototype.buf;
}
// Regular Expressions for parsing tags and attributes
var /** @type {?} */ SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
// ! to ~ is the ASCII range.
var /** @type {?} */ NON_ALPHANUMERIC_REGEXP = /([^\#-~ |!])/g;
/**
 *  Escapes all potentially dangerous characters, so that the
  * resulting string can be safely inserted into attribute or
  * element text.
 * @param {?} value
 * @return {?}
 */
function encodeEntities(value) {
    return value.replace(/&/g, '&amp;')
        .replace(SURROGATE_PAIR_REGEXP, function (match) {
        var /** @type {?} */ hi = match.charCodeAt(0);
        var /** @type {?} */ low = match.charCodeAt(1);
        return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    })
        .replace(NON_ALPHANUMERIC_REGEXP, function (match) { return '&#' + match.charCodeAt(0) + ';'; })
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
/**
 *  When IE9-11 comes across an unknown namespaced attribute e.g. 'xlink:foo' it adds 'xmlns:ns1'
  * attribute to declare ns1 namespace and prefixes the attribute with 'ns1' (e.g. 'ns1:xlink:foo').
  * *
  * This is undesirable since we don't want to allow any of these custom attributes. This method
  * strips them all.
 * @param {?} el
 * @return {?}
 */
function stripCustomNsAttrs(el) {
    DOM.attributeMap(el).forEach(function (_, attrName) {
        if (attrName === 'xmlns:ns1' || attrName.indexOf('ns1:') === 0) {
            DOM.removeAttribute(el, attrName);
        }
    });
    for (var _i = 0, _a = DOM.childNodesAsList(el); _i < _a.length; _i++) {
        var n = _a[_i];
        if (DOM.isElementNode(n))
            stripCustomNsAttrs(/** @type {?} */ (n));
    }
}
/**
 *  Sanitizes the given unsafe, untrusted HTML fragment, and returns HTML text that is safe to add to
  * the DOM in a browser environment.
 * @param {?} unsafeHtmlInput
 * @return {?}
 */
export function sanitizeHtml(unsafeHtmlInput) {
    try {
        var /** @type {?} */ containerEl = getInertElement();
        // Make sure unsafeHtml is actually a string (TypeScript types are not enforced at runtime).
        var /** @type {?} */ unsafeHtml = unsafeHtmlInput ? String(unsafeHtmlInput) : '';
        // mXSS protection. Repeatedly parse the document to make sure it stabilizes, so that a browser
        // trying to auto-correct incorrect HTML cannot cause formerly inert HTML to become dangerous.
        var /** @type {?} */ mXSSAttempts = 5;
        var /** @type {?} */ parsedHtml = unsafeHtml;
        do {
            if (mXSSAttempts === 0) {
                throw new Error('Failed to sanitize html because the input is unstable');
            }
            mXSSAttempts--;
            unsafeHtml = parsedHtml;
            DOM.setInnerHTML(containerEl, unsafeHtml);
            if (((DOM.defaultDoc())).documentMode) {
                // strip custom-namespaced attributes on IE<=11
                stripCustomNsAttrs(containerEl);
            }
            parsedHtml = DOM.getInnerHTML(containerEl);
        } while (unsafeHtml !== parsedHtml);
        var /** @type {?} */ sanitizer = new SanitizingHtmlSerializer();
        var /** @type {?} */ safeHtml = sanitizer.sanitizeChildren(DOM.getTemplateContent(containerEl) || containerEl);
        // Clear out the body element.
        var /** @type {?} */ parent_1 = DOM.getTemplateContent(containerEl) || containerEl;
        for (var _i = 0, _a = DOM.childNodesAsList(parent_1); _i < _a.length; _i++) {
            var child = _a[_i];
            DOM.removeChild(parent_1, child);
        }
        if (isDevMode() && sanitizer.sanitizedSomething) {
            DOM.log('WARNING: sanitizing HTML stripped some content (see http://g.co/ng/security#xss).');
        }
        return safeHtml;
    }
    catch (e) {
        // In case anything goes wrong, clear out inertElement to reset the entire DOM structure.
        inertElement = null;
        throw e;
    }
}
//# sourceMappingURL=html_sanitizer.js.map