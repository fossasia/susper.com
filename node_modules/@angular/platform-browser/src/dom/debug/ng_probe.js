/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as core from '@angular/core';
import { StringMapWrapper } from '../../facade/collection';
import { DebugDomRootRenderer } from '../../private_import_core';
import { getDOM } from '../dom_adapter';
import { DomRootRenderer } from '../dom_renderer';
var /** @type {?} */ CORE_TOKENS = {
    'ApplicationRef': core.ApplicationRef,
    'NgZone': core.NgZone,
};
var /** @type {?} */ INSPECT_GLOBAL_NAME = 'ng.probe';
var /** @type {?} */ CORE_TOKENS_GLOBAL_NAME = 'ng.coreTokens';
/**
 *  Returns a {@link DebugElement} for the given native DOM element, or
  * null if the given native element does not have an Angular view associated
  * with it.
 * @param {?} element
 * @return {?}
 */
export function inspectNativeElement(element) {
    return core.getDebugNode(element);
}
/**
 *  Deprecated. Use the one from '@angular/core'.
 * @deprecated
 */
export var NgProbeToken = (function () {
    /**
     * @param {?} name
     * @param {?} token
     */
    function NgProbeToken(name, token) {
        this.name = name;
        this.token = token;
    }
    return NgProbeToken;
}());
function NgProbeToken_tsickle_Closure_declarations() {
    /** @type {?} */
    NgProbeToken.prototype.name;
    /** @type {?} */
    NgProbeToken.prototype.token;
}
/**
 * @param {?} rootRenderer
 * @param {?} extraTokens
 * @param {?} coreTokens
 * @return {?}
 */
export function _createConditionalRootRenderer(rootRenderer, extraTokens, coreTokens) {
    return core.isDevMode() ?
        _createRootRenderer(rootRenderer, (extraTokens || []).concat(coreTokens || [])) :
        rootRenderer;
}
/**
 * @param {?} rootRenderer
 * @param {?} extraTokens
 * @return {?}
 */
function _createRootRenderer(rootRenderer, extraTokens) {
    getDOM().setGlobalVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
    getDOM().setGlobalVar(CORE_TOKENS_GLOBAL_NAME, StringMapWrapper.merge(CORE_TOKENS, _ngProbeTokensToMap(extraTokens || [])));
    return new DebugDomRootRenderer(rootRenderer);
}
/**
 * @param {?} tokens
 * @return {?}
 */
function _ngProbeTokensToMap(tokens) {
    return tokens.reduce(function (prev, t) { return (prev[t.name] = t.token, prev); }, {});
}
/**
 * Providers which support debugging Angular applications (e.g. via `ng.probe`).
 */
export var /** @type {?} */ ELEMENT_PROBE_PROVIDERS = [{
        provide: core.RootRenderer,
        useFactory: _createConditionalRootRenderer,
        deps: [
            DomRootRenderer, [NgProbeToken, new core.Optional()],
            [core.NgProbeToken, new core.Optional()]
        ]
    }];
//# sourceMappingURL=ng_probe.js.map