"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const fs = require("./fs");
exports.fs = fs;
__export(require("./cli-logger"));
__export(require("./host"));
var resolve_1 = require("./resolve");
exports.ModuleNotFoundException = resolve_1.ModuleNotFoundException;
exports.resolve = resolve_1.resolve;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9ub2RlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsMkJBQTJCO0FBTWxCLGdCQUFFO0FBSlgsa0NBQTZCO0FBQzdCLDRCQUF1QjtBQUN2QixxQ0FBNkU7QUFBcEUsNENBQUEsdUJBQXVCLENBQUE7QUFBa0IsNEJBQUEsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnLi9mcyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vY2xpLWxvZ2dlcic7XG5leHBvcnQgKiBmcm9tICcuL2hvc3QnO1xuZXhwb3J0IHsgTW9kdWxlTm90Rm91bmRFeGNlcHRpb24sIFJlc29sdmVPcHRpb25zLCByZXNvbHZlIH0gZnJvbSAnLi9yZXNvbHZlJztcblxuZXhwb3J0IHsgZnMgfTtcbiJdfQ==