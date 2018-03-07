"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const tools_1 = require("../tools");
/**
 * An EngineHost that uses a registry to super seed locations of collection.json files, but
 * revert back to using node modules resolution. This is done for testing.
 */
class NodeModulesTestEngineHost extends tools_1.NodeModulesEngineHost {
    constructor() {
        super(...arguments);
        this._collections = new Map();
    }
    registerCollection(name, path) {
        this._collections.set(name, path);
    }
    _resolveCollectionPath(name) {
        const maybePath = this._collections.get(name);
        if (maybePath) {
            return maybePath;
        }
        return super._resolveCollectionPath(name);
    }
}
exports.NodeModulesTestEngineHost = NodeModulesTestEngineHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1tb2R1bGVzLXRlc3QtZW5naW5lLWhvc3QuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L3NjaGVtYXRpY3MvdG9vbHMvbm9kZS1tb2R1bGVzLXRlc3QtZW5naW5lLWhvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxvQ0FBaUQ7QUFHakQ7OztHQUdHO0FBQ0gsK0JBQXVDLFNBQVEsNkJBQXFCO0lBQXBFOztRQUNVLGlCQUFZLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFjbkQsQ0FBQztJQVpDLGtCQUFrQixDQUFDLElBQVksRUFBRSxJQUFZO1FBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRVMsc0JBQXNCLENBQUMsSUFBWTtRQUMzQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0Y7QUFmRCw4REFlQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IE5vZGVNb2R1bGVzRW5naW5lSG9zdCB9IGZyb20gJy4uL3Rvb2xzJztcblxuXG4vKipcbiAqIEFuIEVuZ2luZUhvc3QgdGhhdCB1c2VzIGEgcmVnaXN0cnkgdG8gc3VwZXIgc2VlZCBsb2NhdGlvbnMgb2YgY29sbGVjdGlvbi5qc29uIGZpbGVzLCBidXRcbiAqIHJldmVydCBiYWNrIHRvIHVzaW5nIG5vZGUgbW9kdWxlcyByZXNvbHV0aW9uLiBUaGlzIGlzIGRvbmUgZm9yIHRlc3RpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb2RlTW9kdWxlc1Rlc3RFbmdpbmVIb3N0IGV4dGVuZHMgTm9kZU1vZHVsZXNFbmdpbmVIb3N0IHtcbiAgcHJpdmF0ZSBfY29sbGVjdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXG4gIHJlZ2lzdGVyQ29sbGVjdGlvbihuYW1lOiBzdHJpbmcsIHBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuX2NvbGxlY3Rpb25zLnNldChuYW1lLCBwYXRoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcmVzb2x2ZUNvbGxlY3Rpb25QYXRoKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgbWF5YmVQYXRoID0gdGhpcy5fY29sbGVjdGlvbnMuZ2V0KG5hbWUpO1xuICAgIGlmIChtYXliZVBhdGgpIHtcbiAgICAgIHJldHVybiBtYXliZVBhdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1cGVyLl9yZXNvbHZlQ29sbGVjdGlvblBhdGgobmFtZSk7XG4gIH1cbn1cbiJdfQ==