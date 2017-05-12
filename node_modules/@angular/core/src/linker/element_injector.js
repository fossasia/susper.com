/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injector, THROW_IF_NOT_FOUND } from '../di/injector';
export var ElementInjector = (function (_super) {
    __extends(ElementInjector, _super);
    /**
     * @param {?} _view
     * @param {?} _nodeIndex
     */
    function ElementInjector(_view, _nodeIndex) {
        _super.call(this);
        this._view = _view;
        this._nodeIndex = _nodeIndex;
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    ElementInjector.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = THROW_IF_NOT_FOUND; }
        return this._view.injectorGet(token, this._nodeIndex, notFoundValue);
    };
    return ElementInjector;
}(Injector));
function ElementInjector_tsickle_Closure_declarations() {
    /** @type {?} */
    ElementInjector.prototype._view;
    /** @type {?} */
    ElementInjector.prototype._nodeIndex;
}
//# sourceMappingURL=element_injector.js.map