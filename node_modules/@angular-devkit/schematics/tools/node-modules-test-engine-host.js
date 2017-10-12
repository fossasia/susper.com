"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const tools_1 = require("@angular-devkit/schematics/tools");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1tb2R1bGVzLXRlc3QtZW5naW5lLWhvc3QuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy90b29scy9ub2RlLW1vZHVsZXMtdGVzdC1lbmdpbmUtaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDREQUF5RTtBQUd6RTs7O0dBR0c7QUFDSCwrQkFBdUMsU0FBUSw2QkFBcUI7SUFBcEU7O1FBQ1UsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQWNuRCxDQUFDO0lBWkMsa0JBQWtCLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFUyxzQkFBc0IsQ0FBQyxJQUFZO1FBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLENBQUM7Q0FDRjtBQWZELDhEQWVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgTm9kZU1vZHVsZXNFbmdpbmVIb3N0IH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdG9vbHMnO1xuXG5cbi8qKlxuICogQW4gRW5naW5lSG9zdCB0aGF0IHVzZXMgYSByZWdpc3RyeSB0byBzdXBlciBzZWVkIGxvY2F0aW9ucyBvZiBjb2xsZWN0aW9uLmpzb24gZmlsZXMsIGJ1dFxuICogcmV2ZXJ0IGJhY2sgdG8gdXNpbmcgbm9kZSBtb2R1bGVzIHJlc29sdXRpb24uIFRoaXMgaXMgZG9uZSBmb3IgdGVzdGluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5vZGVNb2R1bGVzVGVzdEVuZ2luZUhvc3QgZXh0ZW5kcyBOb2RlTW9kdWxlc0VuZ2luZUhvc3Qge1xuICBwcml2YXRlIF9jb2xsZWN0aW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cbiAgcmVnaXN0ZXJDb2xsZWN0aW9uKG5hbWU6IHN0cmluZywgcGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5fY29sbGVjdGlvbnMuc2V0KG5hbWUsIHBhdGgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9yZXNvbHZlQ29sbGVjdGlvblBhdGgobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBtYXliZVBhdGggPSB0aGlzLl9jb2xsZWN0aW9ucy5nZXQobmFtZSk7XG4gICAgaWYgKG1heWJlUGF0aCkge1xuICAgICAgcmV0dXJuIG1heWJlUGF0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gc3VwZXIuX3Jlc29sdmVDb2xsZWN0aW9uUGF0aChuYW1lKTtcbiAgfVxufVxuIl19