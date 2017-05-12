/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject, PACKAGE_ROOT_URL } from '@angular/core';
import { isBlank, isPresent } from './facade/lang';
import { CompilerInjectable } from './injectable';
/**
 *  Create a {@link UrlResolver} with no package prefix.
 * @return {?}
 */
export function createUrlResolverWithoutPackagePrefix() {
    return new UrlResolver();
}
/**
 * @return {?}
 */
export function createOfflineCompileUrlResolver() {
    return new UrlResolver('.');
}
/**
 * A default provider for {@link PACKAGE_ROOT_URL} that maps to '/'.
 */
export var /** @type {?} */ DEFAULT_PACKAGE_URL_PROVIDER = {
    provide: PACKAGE_ROOT_URL,
    useValue: '/'
};
/**
 *  Used by the {@link Compiler} when resolving HTML and CSS template URLs.
  * *
  * This class can be overridden by the application developer to create custom behavior.
  * *
  * See {@link Compiler}
  * *
  * ## Example
  * *
  * {@example compiler/ts/url_resolver/url_resolver.ts region='url_resolver'}
  * *
  * ensure that the entire template comes from a trusted source.
  * Attacker-controlled data introduced by a template could expose your
  * application to XSS risks. For more detail, see the [Security Guide](http://g.co/ng/security).
 */
export var UrlResolver = (function () {
    /**
     * @param {?=} _packagePrefix
     */
    function UrlResolver(_packagePrefix) {
        if (_packagePrefix === void 0) { _packagePrefix = null; }
        this._packagePrefix = _packagePrefix;
    }
    /**
     *  Resolves the `url` given the `baseUrl`:
      * - when the `url` is null, the `baseUrl` is returned,
      * - if `url` is relative ('path/to/here', './path/to/here'), the resolved url is a combination of
      * `baseUrl` and `url`,
      * - if `url` is absolute (it has a scheme: 'http://', 'https://' or start with '/'), the `url` is
      * returned as is (ignoring the `baseUrl`)
     * @param {?} baseUrl
     * @param {?} url
     * @return {?}
     */
    UrlResolver.prototype.resolve = function (baseUrl, url) {
        var /** @type {?} */ resolvedUrl = url;
        if (isPresent(baseUrl) && baseUrl.length > 0) {
            resolvedUrl = _resolveUrl(baseUrl, resolvedUrl);
        }
        var /** @type {?} */ resolvedParts = _split(resolvedUrl);
        var /** @type {?} */ prefix = this._packagePrefix;
        if (isPresent(prefix) && isPresent(resolvedParts) &&
            resolvedParts[_ComponentIndex.Scheme] == 'package') {
            var /** @type {?} */ path = resolvedParts[_ComponentIndex.Path];
            prefix = prefix.replace(/\/+$/, '');
            path = path.replace(/^\/+/, '');
            return prefix + "/" + path;
        }
        return resolvedUrl;
    };
    /** @nocollapse */
    UrlResolver.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [PACKAGE_ROOT_URL,] },] },
    ]; };
    UrlResolver = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [String])
    ], UrlResolver);
    return UrlResolver;
}());
function UrlResolver_tsickle_Closure_declarations() {
    /**
     * @nocollapse
     * @type {?}
     */
    UrlResolver.ctorParameters;
    /** @type {?} */
    UrlResolver.prototype._packagePrefix;
}
/**
 *  Extract the scheme of a URL.
 * @param {?} url
 * @return {?}
 */
export function getUrlScheme(url) {
    var /** @type {?} */ match = _split(url);
    return (match && match[_ComponentIndex.Scheme]) || '';
}
/**
 *  Builds a URI string from already-encoded parts.
  * *
  * No encoding is performed.  Any component may be omitted as either null or
  * undefined.
  * *
 * @param {?=} opt_scheme The scheme such as 'http'.
 * @param {?=} opt_userInfo The user name before the '@'.
 * @param {?=} opt_domain The domain such as 'www.google.com', already
  * URI-encoded.
 * @param {?=} opt_port The port number.
 * @param {?=} opt_path The path, already URI-encoded.  If it is not
  * empty, it must begin with a slash.
 * @param {?=} opt_queryData The URI-encoded query data.
 * @param {?=} opt_fragment The URI-encoded fragment identifier.
 * @return {?} The fully combined URI.
 */
function _buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var /** @type {?} */ out = [];
    if (isPresent(opt_scheme)) {
        out.push(opt_scheme + ':');
    }
    if (isPresent(opt_domain)) {
        out.push('//');
        if (isPresent(opt_userInfo)) {
            out.push(opt_userInfo + '@');
        }
        out.push(opt_domain);
        if (isPresent(opt_port)) {
            out.push(':' + opt_port);
        }
    }
    if (isPresent(opt_path)) {
        out.push(opt_path);
    }
    if (isPresent(opt_queryData)) {
        out.push('?' + opt_queryData);
    }
    if (isPresent(opt_fragment)) {
        out.push('#' + opt_fragment);
    }
    return out.join('');
}
/**
 * A regular expression for breaking a URI into its component parts.
 *
 * {@link http://www.gbiv.com/protocols/uri/rfc/rfc3986.html#RFC2234} says
 * As the "first-match-wins" algorithm is identical to the "greedy"
 * disambiguation method used by POSIX regular expressions, it is natural and
 * commonplace to use a regular expression for parsing the potential five
 * components of a URI reference.
 *
 * The following line is the regular expression for breaking-down a
 * well-formed URI reference into its components.
 *
 * <pre>
 * ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
 *  12            3  4          5       6  7        8 9
 * </pre>
 *
 * The numbers in the second line above are only to assist readability; they
 * indicate the reference points for each subexpression (i.e., each paired
 * parenthesis). We refer to the value matched for subexpression <n> as $<n>.
 * For example, matching the above expression to
 * <pre>
 *     http://www.ics.uci.edu/pub/ietf/uri/#Related
 * </pre>
 * results in the following subexpression matches:
 * <pre>
 *    $1 = http:
 *    $2 = http
 *    $3 = //www.ics.uci.edu
 *    $4 = www.ics.uci.edu
 *    $5 = /pub/ietf/uri/
 *    $6 = <undefined>
 *    $7 = <undefined>
 *    $8 = #Related
 *    $9 = Related
 * </pre>
 * where <undefined> indicates that the component is not present, as is the
 * case for the query component in the above example. Therefore, we can
 * determine the value of the five components as
 * <pre>
 *    scheme    = $2
 *    authority = $4
 *    path      = $5
 *    query     = $7
 *    fragment  = $9
 * </pre>
 *
 * The regular expression has been modified slightly to expose the
 * userInfo, domain, and port separately from the authority.
 * The modified version yields
 * <pre>
 *    $1 = http              scheme
 *    $2 = <undefined>       userInfo -\
 *    $3 = www.ics.uci.edu   domain     | authority
 *    $4 = <undefined>       port     -/
 *    $5 = /pub/ietf/uri/    path
 *    $6 = <undefined>       query without ?
 *    $7 = Related           fragment without #
 * </pre>
 * @type {!RegExp}
 * @internal
 */
var /** @type {?} */ _splitRe = new RegExp('^' +
    '(?:' +
    '([^:/?#.]+)' +
    // used by other URL parts such as :,
    // ?, /, #, and .
    ':)?' +
    '(?://' +
    '(?:([^/?#]*)@)?' +
    '([\\w\\d\\-\\u0100-\\uffff.%]*)' +
    // digits, dashes, dots, percent
    // escapes, and unicode characters.
    '(?::([0-9]+))?' +
    ')?' +
    '([^?#]+)?' +
    '(?:\\?([^#]*))?' +
    '(?:#(.*))?' +
    '$');
var _ComponentIndex = {};
_ComponentIndex.Scheme = 1;
_ComponentIndex.UserInfo = 2;
_ComponentIndex.Domain = 3;
_ComponentIndex.Port = 4;
_ComponentIndex.Path = 5;
_ComponentIndex.QueryData = 6;
_ComponentIndex.Fragment = 7;
_ComponentIndex[_ComponentIndex.Scheme] = "Scheme";
_ComponentIndex[_ComponentIndex.UserInfo] = "UserInfo";
_ComponentIndex[_ComponentIndex.Domain] = "Domain";
_ComponentIndex[_ComponentIndex.Port] = "Port";
_ComponentIndex[_ComponentIndex.Path] = "Path";
_ComponentIndex[_ComponentIndex.QueryData] = "QueryData";
_ComponentIndex[_ComponentIndex.Fragment] = "Fragment";
/**
 *  Splits a URI into its component parts.
  * *
  * Each component can be accessed via the component indices; for example:
  * <pre>
  * goog.uri.utils.split(someStr)[goog.uri.utils.CompontentIndex.QUERY_DATA];
  * </pre>
  * *
 * @param {?} uri The URI string to examine.
 * @return {?} Each component still URI-encoded.
  * Each component that is present will contain the encoded value, whereas
  * components that are not present will be undefined or empty, depending
  * on the browser's regular expression implementation.  Never null, since
  * arbitrary strings may still look like path names.
 */
function _split(uri) {
    return uri.match(_splitRe);
}
/**
 *  Removes dot segments in given path component, as described in
  * RFC 3986, section 5.2.4.
  * *
 * @param {?} path A non-empty path component.
 * @return {?} Path component with removed dot segments.
 */
function _removeDotSegments(path) {
    if (path == '/')
        return '/';
    var /** @type {?} */ leadingSlash = path[0] == '/' ? '/' : '';
    var /** @type {?} */ trailingSlash = path[path.length - 1] === '/' ? '/' : '';
    var /** @type {?} */ segments = path.split('/');
    var /** @type {?} */ out = [];
    var /** @type {?} */ up = 0;
    for (var /** @type {?} */ pos = 0; pos < segments.length; pos++) {
        var /** @type {?} */ segment = segments[pos];
        switch (segment) {
            case '':
            case '.':
                break;
            case '..':
                if (out.length > 0) {
                    out.pop();
                }
                else {
                    up++;
                }
                break;
            default:
                out.push(segment);
        }
    }
    if (leadingSlash == '') {
        while (up-- > 0) {
            out.unshift('..');
        }
        if (out.length === 0)
            out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
}
/**
 *  Takes an array of the parts from split and canonicalizes the path part
  * and then joins all the parts.
 * @param {?} parts
 * @return {?}
 */
function _joinAndCanonicalizePath(parts) {
    var /** @type {?} */ path = parts[_ComponentIndex.Path];
    path = isBlank(path) ? '' : _removeDotSegments(path);
    parts[_ComponentIndex.Path] = path;
    return _buildFromEncodedParts(parts[_ComponentIndex.Scheme], parts[_ComponentIndex.UserInfo], parts[_ComponentIndex.Domain], parts[_ComponentIndex.Port], path, parts[_ComponentIndex.QueryData], parts[_ComponentIndex.Fragment]);
}
/**
 *  Resolves a URL.
 * @param {?} base The URL acting as the base URL.
 * @param {?} url
 * @return {?}
 */
function _resolveUrl(base, url) {
    var /** @type {?} */ parts = _split(encodeURI(url));
    var /** @type {?} */ baseParts = _split(base);
    if (isPresent(parts[_ComponentIndex.Scheme])) {
        return _joinAndCanonicalizePath(parts);
    }
    else {
        parts[_ComponentIndex.Scheme] = baseParts[_ComponentIndex.Scheme];
    }
    for (var /** @type {?} */ i = _ComponentIndex.Scheme; i <= _ComponentIndex.Port; i++) {
        if (isBlank(parts[i])) {
            parts[i] = baseParts[i];
        }
    }
    if (parts[_ComponentIndex.Path][0] == '/') {
        return _joinAndCanonicalizePath(parts);
    }
    var /** @type {?} */ path = baseParts[_ComponentIndex.Path];
    if (isBlank(path))
        path = '/';
    var /** @type {?} */ index = path.lastIndexOf('/');
    path = path.substring(0, index + 1) + parts[_ComponentIndex.Path];
    parts[_ComponentIndex.Path] = path;
    return _joinAndCanonicalizePath(parts);
}
//# sourceMappingURL=url_resolver.js.map