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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9ydWxlcy9tb3ZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQWlEO0FBR2pELGlDQUFpQztBQUdqQyxnQkFBdUIsSUFBWSxFQUFFLEVBQVc7SUFDOUMsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckIsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNWLElBQUksR0FBRyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTSxRQUFRLEdBQUcsZ0JBQVMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkMsTUFBTSxNQUFNLEdBQUcsZ0JBQVMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFFbkMsTUFBTSxDQUFDLENBQUMsS0FBZ0IsRUFBRSxFQUFFO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUM7Z0JBQ0wsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO2dCQUN0QixJQUFJLEVBQUUsZ0JBQVMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNuRSxDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUM7QUFDSixDQUFDO0FBbkJELHdCQW1CQztBQUdELGNBQXFCLElBQVksRUFBRSxFQUFXO0lBQzVDLE1BQU0sQ0FBQyxjQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFGRCxvQkFFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IEZpbGVPcGVyYXRvciwgUnVsZSB9IGZyb20gJy4uL2VuZ2luZS9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRmlsZUVudHJ5IH0gZnJvbSAnLi4vdHJlZS9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJy4vYmFzZSc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmVPcChmcm9tOiBzdHJpbmcsIHRvPzogc3RyaW5nKTogRmlsZU9wZXJhdG9yIHtcbiAgaWYgKHRvID09PSB1bmRlZmluZWQpIHtcbiAgICB0byA9IGZyb207XG4gICAgZnJvbSA9ICcvJztcbiAgfVxuXG4gIGNvbnN0IGZyb21QYXRoID0gbm9ybWFsaXplKCcvJyArIGZyb20pO1xuICBjb25zdCB0b1BhdGggPSBub3JtYWxpemUoJy8nICsgdG8pO1xuXG4gIHJldHVybiAoZW50cnk6IEZpbGVFbnRyeSkgPT4ge1xuICAgIGlmIChlbnRyeS5wYXRoLnN0YXJ0c1dpdGgoZnJvbVBhdGgpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb250ZW50OiBlbnRyeS5jb250ZW50LFxuICAgICAgICBwYXRoOiBub3JtYWxpemUodG9QYXRoICsgJy8nICsgZW50cnkucGF0aC5zdWJzdHIoZnJvbVBhdGgubGVuZ3RoKSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBlbnRyeTtcbiAgfTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbW92ZShmcm9tOiBzdHJpbmcsIHRvPzogc3RyaW5nKTogUnVsZSB7XG4gIHJldHVybiBmb3JFYWNoKG1vdmVPcChmcm9tLCB0bykpO1xufVxuIl19