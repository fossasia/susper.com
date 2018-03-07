"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const node_1 = require("@angular-devkit/core/node");
const fs_1 = require("fs");
const path_1 = require("path");
class FileSystemHost {
    constructor(_root) {
        this._root = _root;
    }
    listDirectory(path) {
        return fs_1.readdirSync(path_1.join(this._root, path));
    }
    isDirectory(path) {
        return node_1.fs.isDirectory(path_1.join(this._root, path));
    }
    readFile(path) {
        return fs_1.readFileSync(path_1.join(this._root, path));
    }
    exists(path) {
        return fs_1.existsSync(this.join(this._root, path));
    }
    join(path1, path2) {
        return path_1.join(path1, path2);
    }
}
exports.FileSystemHost = FileSystemHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1zeXN0ZW0taG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy90b29scy9maWxlLXN5c3RlbS1ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsb0RBQStDO0FBQy9DLDJCQUEyRDtBQUMzRCwrQkFBNEI7QUFHNUI7SUFDRSxZQUFvQixLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtJQUFHLENBQUM7SUFFckMsYUFBYSxDQUFDLElBQVk7UUFDeEIsTUFBTSxDQUFDLGdCQUFXLENBQUMsV0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ0QsV0FBVyxDQUFDLElBQVk7UUFDdEIsTUFBTSxDQUFDLFNBQUUsQ0FBQyxXQUFXLENBQUMsV0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsUUFBUSxDQUFDLElBQVk7UUFDbkIsTUFBTSxDQUFDLGlCQUFZLENBQUMsV0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQVk7UUFDakIsTUFBTSxDQUFDLGVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQWEsRUFBRSxLQUFhO1FBQy9CLE1BQU0sQ0FBQyxXQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRjtBQW5CRCx3Q0FtQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBmcyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL25vZGUnO1xuaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jLCByZWFkZGlyU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IEZpbGVTeXN0ZW1UcmVlSG9zdCB9IGZyb20gJy4uL3NyYyc7XG5cbmV4cG9ydCBjbGFzcyBGaWxlU3lzdGVtSG9zdCBpbXBsZW1lbnRzIEZpbGVTeXN0ZW1UcmVlSG9zdCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3Jvb3Q6IHN0cmluZykge31cblxuICBsaXN0RGlyZWN0b3J5KHBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiByZWFkZGlyU3luYyhqb2luKHRoaXMuX3Jvb3QsIHBhdGgpKTtcbiAgfVxuICBpc0RpcmVjdG9yeShwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gZnMuaXNEaXJlY3Rvcnkoam9pbih0aGlzLl9yb290LCBwYXRoKSk7XG4gIH1cbiAgcmVhZEZpbGUocGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJlYWRGaWxlU3luYyhqb2luKHRoaXMuX3Jvb3QsIHBhdGgpKTtcbiAgfVxuICBleGlzdHMocGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGV4aXN0c1N5bmModGhpcy5qb2luKHRoaXMuX3Jvb3QsIHBhdGgpKTtcbiAgfVxuXG4gIGpvaW4ocGF0aDE6IHN0cmluZywgcGF0aDI6IHN0cmluZykge1xuICAgIHJldHVybiBqb2luKHBhdGgxLCBwYXRoMik7XG4gIH1cbn1cbiJdfQ==