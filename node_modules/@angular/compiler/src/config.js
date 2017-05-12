/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ViewEncapsulation, isDevMode } from '@angular/core';
import { Identifiers, createIdentifier } from './identifiers';
/**
 * @return {?}
 */
function unimplemented() {
    throw new Error('unimplemented');
}
export var CompilerConfig = (function () {
    /**
     * @param {?=} __0
     */
    function CompilerConfig(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.renderTypes, renderTypes = _c === void 0 ? new DefaultRenderTypes() : _c, _d = _b.defaultEncapsulation, defaultEncapsulation = _d === void 0 ? ViewEncapsulation.Emulated : _d, genDebugInfo = _b.genDebugInfo, logBindingUpdate = _b.logBindingUpdate, _e = _b.useJit, useJit = _e === void 0 ? true : _e;
        this.renderTypes = renderTypes;
        this.defaultEncapsulation = defaultEncapsulation;
        this._genDebugInfo = genDebugInfo;
        this._logBindingUpdate = logBindingUpdate;
        this.useJit = useJit;
    }
    Object.defineProperty(CompilerConfig.prototype, "genDebugInfo", {
        /**
         * @return {?}
         */
        get: function () {
            return this._genDebugInfo === void 0 ? isDevMode() : this._genDebugInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompilerConfig.prototype, "logBindingUpdate", {
        /**
         * @return {?}
         */
        get: function () {
            return this._logBindingUpdate === void 0 ? isDevMode() : this._logBindingUpdate;
        },
        enumerable: true,
        configurable: true
    });
    return CompilerConfig;
}());
function CompilerConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    CompilerConfig.prototype.renderTypes;
    /** @type {?} */
    CompilerConfig.prototype.defaultEncapsulation;
    /** @type {?} */
    CompilerConfig.prototype._genDebugInfo;
    /** @type {?} */
    CompilerConfig.prototype._logBindingUpdate;
    /** @type {?} */
    CompilerConfig.prototype.useJit;
}
/**
 *  Types used for the renderer.
  * Can be replaced to specialize the generated output to a specific renderer
  * to help tree shaking.
 * @abstract
 */
export var RenderTypes = (function () {
    function RenderTypes() {
    }
    Object.defineProperty(RenderTypes.prototype, "renderer", {
        /**
         * @return {?}
         */
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderTypes.prototype, "renderText", {
        /**
         * @return {?}
         */
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderTypes.prototype, "renderElement", {
        /**
         * @return {?}
         */
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderTypes.prototype, "renderComment", {
        /**
         * @return {?}
         */
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderTypes.prototype, "renderNode", {
        /**
         * @return {?}
         */
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderTypes.prototype, "renderEvent", {
        /**
         * @return {?}
         */
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    return RenderTypes;
}());
export var DefaultRenderTypes = (function () {
    function DefaultRenderTypes() {
        this.renderText = null;
        this.renderElement = null;
        this.renderComment = null;
        this.renderNode = null;
        this.renderEvent = null;
    }
    Object.defineProperty(DefaultRenderTypes.prototype, "renderer", {
        /**
         * @return {?}
         */
        get: function () { return createIdentifier(Identifiers.Renderer); },
        enumerable: true,
        configurable: true
    });
    ;
    return DefaultRenderTypes;
}());
function DefaultRenderTypes_tsickle_Closure_declarations() {
    /** @type {?} */
    DefaultRenderTypes.prototype.renderText;
    /** @type {?} */
    DefaultRenderTypes.prototype.renderElement;
    /** @type {?} */
    DefaultRenderTypes.prototype.renderComment;
    /** @type {?} */
    DefaultRenderTypes.prototype.renderNode;
    /** @type {?} */
    DefaultRenderTypes.prototype.renderEvent;
}
//# sourceMappingURL=config.js.map