"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const fs = require("fs");
function isFile(filePath) {
    let stat;
    try {
        stat = fs.statSync(filePath);
    }
    catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) {
            return false;
        }
        throw e;
    }
    return stat.isFile() || stat.isFIFO();
}
exports.isFile = isFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9ub2RlL2ZzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gseUJBQXlCO0FBR3pCLGdCQUF1QixRQUFnQjtJQUNyQyxJQUFJLElBQUksQ0FBQztJQUNULElBQUksQ0FBQztRQUNILElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQztJQUNWLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN4QyxDQUFDO0FBWkQsd0JBWUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmlsZShmaWxlUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGxldCBzdGF0O1xuICB0cnkge1xuICAgIHN0YXQgPSBmcy5zdGF0U3luYyhmaWxlUGF0aCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSAmJiAoZS5jb2RlID09PSAnRU5PRU5UJyB8fCBlLmNvZGUgPT09ICdFTk9URElSJykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfVxuXG4gIHJldHVybiBzdGF0LmlzRmlsZSgpIHx8IHN0YXQuaXNGSUZPKCk7XG59XG4iXX0=