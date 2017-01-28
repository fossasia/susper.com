/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 *  *
 */
export var RouterOutletMap = (function () {
    function RouterOutletMap() {
        /** @internal */
        this._outlets = {};
    }
    /**
     *  Adds an outlet to this map.
     * @param {?} name
     * @param {?} outlet
     * @return {?}
     */
    RouterOutletMap.prototype.registerOutlet = function (name, outlet) { this._outlets[name] = outlet; };
    /**
     *  Removes an outlet from this map.
     * @param {?} name
     * @return {?}
     */
    RouterOutletMap.prototype.removeOutlet = function (name) { this._outlets[name] = undefined; };
    return RouterOutletMap;
}());
function RouterOutletMap_tsickle_Closure_declarations() {
    /** @type {?} */
    RouterOutletMap.prototype._outlets;
}
//# sourceMappingURL=router_outlet_map.js.map