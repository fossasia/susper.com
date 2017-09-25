"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const entry_1 = require("./entry");
const virtual_1 = require("./virtual");
class FileSystemTree extends virtual_1.VirtualTree {
    constructor(_host, asCreate = false) {
        super();
        this._host = _host;
        this._recursiveFileList().forEach(([system, schematic]) => {
            if (asCreate) {
                this.create(schematic, _host.readFile(system));
            }
            else {
                this._root.set(schematic, new entry_1.LazyFileEntry(schematic, () => _host.readFile(system)));
            }
        });
    }
    _recursiveFileList() {
        const host = this._host;
        const list = [];
        function recurse(systemPath, schematicPath) {
            for (const name of host.listDirectory(systemPath)) {
                const systemName = host.join(systemPath, name);
                const normalizedPath = core_1.normalize(schematicPath + '/' + name);
                if (host.isDirectory(normalizedPath)) {
                    recurse(systemName, normalizedPath);
                }
                else {
                    list.push([systemName, normalizedPath]);
                }
            }
        }
        recurse('', '/');
        return list;
    }
}
exports.FileSystemTree = FileSystemTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy90cmVlL2ZpbGVzeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBdUQ7QUFDdkQsbUNBQXdDO0FBQ3hDLHVDQUF3QztBQVl4QyxvQkFBNEIsU0FBUSxxQkFBVztJQUM3QyxZQUFvQixLQUF5QixFQUFFLFFBQVEsR0FBRyxLQUFLO1FBQzdELEtBQUssRUFBRSxDQUFDO1FBRFUsVUFBSyxHQUFMLEtBQUssQ0FBb0I7UUFHM0MsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxxQkFBYSxDQUFDLFNBQVMsRUFBRSxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hGLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFUyxrQkFBa0I7UUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixNQUFNLElBQUksR0FBcUIsRUFBRSxDQUFDO1FBRWxDLGlCQUFpQixVQUFrQixFQUFFLGFBQXFCO1lBQ3hELEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxjQUFjLEdBQUcsZ0JBQVMsQ0FBQyxhQUFhLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO2dCQUM3RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckMsT0FBTyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQWpDRCx3Q0FpQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBQYXRoLCBub3JtYWxpemUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBMYXp5RmlsZUVudHJ5IH0gZnJvbSAnLi9lbnRyeSc7XG5pbXBvcnQgeyBWaXJ0dWFsVHJlZSB9IGZyb20gJy4vdmlydHVhbCc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBGaWxlU3lzdGVtVHJlZUhvc3Qge1xuICBsaXN0RGlyZWN0b3J5OiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmdbXTtcbiAgaXNEaXJlY3Rvcnk6IChwYXRoOiBzdHJpbmcpID0+IGJvb2xlYW47XG4gIHJlYWRGaWxlOiAocGF0aDogc3RyaW5nKSA9PiBCdWZmZXI7XG5cbiAgam9pbjogKHBhdGgxOiBzdHJpbmcsIG90aGVyOiBzdHJpbmcpID0+IHN0cmluZztcbn1cblxuXG5leHBvcnQgY2xhc3MgRmlsZVN5c3RlbVRyZWUgZXh0ZW5kcyBWaXJ0dWFsVHJlZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2hvc3Q6IEZpbGVTeXN0ZW1UcmVlSG9zdCwgYXNDcmVhdGUgPSBmYWxzZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9yZWN1cnNpdmVGaWxlTGlzdCgpLmZvckVhY2goKFtzeXN0ZW0sIHNjaGVtYXRpY10pID0+IHtcbiAgICAgIGlmIChhc0NyZWF0ZSkge1xuICAgICAgICB0aGlzLmNyZWF0ZShzY2hlbWF0aWMsIF9ob3N0LnJlYWRGaWxlKHN5c3RlbSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcm9vdC5zZXQoc2NoZW1hdGljLCBuZXcgTGF6eUZpbGVFbnRyeShzY2hlbWF0aWMsICgpID0+IF9ob3N0LnJlYWRGaWxlKHN5c3RlbSkpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcmVjdXJzaXZlRmlsZUxpc3QoKTogWyBzdHJpbmcsIFBhdGggXVtdIHtcbiAgICBjb25zdCBob3N0ID0gdGhpcy5faG9zdDtcbiAgICBjb25zdCBsaXN0OiBbc3RyaW5nLCBQYXRoXVtdID0gW107XG5cbiAgICBmdW5jdGlvbiByZWN1cnNlKHN5c3RlbVBhdGg6IHN0cmluZywgc2NoZW1hdGljUGF0aDogc3RyaW5nKSB7XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgaG9zdC5saXN0RGlyZWN0b3J5KHN5c3RlbVBhdGgpKSB7XG4gICAgICAgIGNvbnN0IHN5c3RlbU5hbWUgPSBob3N0LmpvaW4oc3lzdGVtUGF0aCwgbmFtZSk7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gbm9ybWFsaXplKHNjaGVtYXRpY1BhdGggKyAnLycgKyBuYW1lKTtcbiAgICAgICAgaWYgKGhvc3QuaXNEaXJlY3Rvcnkobm9ybWFsaXplZFBhdGgpKSB7XG4gICAgICAgICAgcmVjdXJzZShzeXN0ZW1OYW1lLCBub3JtYWxpemVkUGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGlzdC5wdXNoKFtzeXN0ZW1OYW1lLCBub3JtYWxpemVkUGF0aF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVjdXJzZSgnJywgJy8nKTtcblxuICAgIHJldHVybiBsaXN0O1xuICB9XG59XG4iXX0=