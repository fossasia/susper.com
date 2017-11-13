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
const javascript = require("./serializers/javascript");
exports.javascript = javascript;
__export(require("./registry"));
exports.serializers = {
    JavascriptSerializer: javascript.JavascriptSerializer,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvanNvbi9zY2hlbWEvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCx1REFBdUQ7QUFNOUMsZ0NBQVU7QUFKbkIsZ0NBQTJCO0FBTWQsUUFBQSxXQUFXLEdBQUc7SUFDekIsb0JBQW9CLEVBQUUsVUFBVSxDQUFDLG9CQUFvQjtDQUN0RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgamF2YXNjcmlwdCBmcm9tICcuL3NlcmlhbGl6ZXJzL2phdmFzY3JpcHQnO1xuXG5leHBvcnQgKiBmcm9tICcuL3JlZ2lzdHJ5JztcbmV4cG9ydCAqIGZyb20gJy4vc2NoZW1hJztcblxuXG5leHBvcnQgeyBqYXZhc2NyaXB0IH07XG5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVycyA9IHtcbiAgSmF2YXNjcmlwdFNlcmlhbGl6ZXI6IGphdmFzY3JpcHQuSmF2YXNjcmlwdFNlcmlhbGl6ZXIsXG59O1xuIl19