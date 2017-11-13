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
const base_1 = require("./base");
function moveOp(from, to) {
    if (to === undefined) {
        to = from;
        from = '/';
    }
    const fromPath = core_1.normalize('/' + from);
    const toPath = core_1.normalize('/' + to);
    return (entry) => {
        if (entry.path.startsWith(fromPath)) {
            return {
                content: entry.content,
                path: core_1.normalize(toPath + '/' + entry.path.substr(fromPath.length)),
            };
        }
        return entry;
    };
}
exports.moveOp = moveOp;
function move(from, to) {
    return base_1.forEach(moveOp(from, to));
}
exports.move = move;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9ydWxlcy9tb3ZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQWlEO0FBR2pELGlDQUFpQztBQUdqQyxnQkFBdUIsSUFBWSxFQUFFLEVBQVc7SUFDOUMsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckIsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNWLElBQUksR0FBRyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTSxRQUFRLEdBQUcsZ0JBQVMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkMsTUFBTSxNQUFNLEdBQUcsZ0JBQVMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFFbkMsTUFBTSxDQUFDLENBQUMsS0FBZ0I7UUFDdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQztnQkFDTCxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87Z0JBQ3RCLElBQUksRUFBRSxnQkFBUyxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ25FLENBQUM7UUFDSixDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQztBQUNKLENBQUM7QUFuQkQsd0JBbUJDO0FBR0QsY0FBcUIsSUFBWSxFQUFFLEVBQVc7SUFDNUMsTUFBTSxDQUFDLGNBQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUZELG9CQUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgbm9ybWFsaXplIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgRmlsZU9wZXJhdG9yLCBSdWxlIH0gZnJvbSAnLi4vZW5naW5lL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBGaWxlRW50cnkgfSBmcm9tICcuLi90cmVlL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnLi9iYXNlJztcblxuXG5leHBvcnQgZnVuY3Rpb24gbW92ZU9wKGZyb206IHN0cmluZywgdG8/OiBzdHJpbmcpOiBGaWxlT3BlcmF0b3Ige1xuICBpZiAodG8gPT09IHVuZGVmaW5lZCkge1xuICAgIHRvID0gZnJvbTtcbiAgICBmcm9tID0gJy8nO1xuICB9XG5cbiAgY29uc3QgZnJvbVBhdGggPSBub3JtYWxpemUoJy8nICsgZnJvbSk7XG4gIGNvbnN0IHRvUGF0aCA9IG5vcm1hbGl6ZSgnLycgKyB0byk7XG5cbiAgcmV0dXJuIChlbnRyeTogRmlsZUVudHJ5KSA9PiB7XG4gICAgaWYgKGVudHJ5LnBhdGguc3RhcnRzV2l0aChmcm9tUGF0aCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbnRlbnQ6IGVudHJ5LmNvbnRlbnQsXG4gICAgICAgIHBhdGg6IG5vcm1hbGl6ZSh0b1BhdGggKyAnLycgKyBlbnRyeS5wYXRoLnN1YnN0cihmcm9tUGF0aC5sZW5ndGgpKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudHJ5O1xuICB9O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlKGZyb206IHN0cmluZywgdG8/OiBzdHJpbmcpOiBSdWxlIHtcbiAgcmV0dXJuIGZvckVhY2gobW92ZU9wKGZyb20sIHRvKSk7XG59XG4iXX0=