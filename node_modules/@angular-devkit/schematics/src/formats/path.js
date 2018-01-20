"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
exports.pathFormat = {
    name: 'path',
    formatter: {
        async: false,
        validate: (path) => {
            // Check path is normalized already.
            return path === core_1.normalize(path);
            // TODO: check if path is valid (is that just checking if it's normalized?)
            // TODO: check path is from root of schematics even if passed absolute
            // TODO: error out if path is outside of host
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9mb3JtYXRzL3BhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrQ0FBeUQ7QUFHNUMsUUFBQSxVQUFVLEdBQXdCO0lBQzdDLElBQUksRUFBRSxNQUFNO0lBQ1osU0FBUyxFQUFFO1FBQ1QsS0FBSyxFQUFFLEtBQUs7UUFDWixRQUFRLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUN6QixvQ0FBb0M7WUFDcEMsTUFBTSxDQUFDLElBQUksS0FBSyxnQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLDJFQUEyRTtZQUMzRSxzRUFBc0U7WUFDdEUsNkNBQTZDO1FBQy9DLENBQUM7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IG5vcm1hbGl6ZSwgc2NoZW1hIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuXG5cbmV4cG9ydCBjb25zdCBwYXRoRm9ybWF0OiBzY2hlbWEuU2NoZW1hRm9ybWF0ID0ge1xuICBuYW1lOiAncGF0aCcsXG4gIGZvcm1hdHRlcjoge1xuICAgIGFzeW5jOiBmYWxzZSxcbiAgICB2YWxpZGF0ZTogKHBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgLy8gQ2hlY2sgcGF0aCBpcyBub3JtYWxpemVkIGFscmVhZHkuXG4gICAgICByZXR1cm4gcGF0aCA9PT0gbm9ybWFsaXplKHBhdGgpO1xuICAgICAgLy8gVE9ETzogY2hlY2sgaWYgcGF0aCBpcyB2YWxpZCAoaXMgdGhhdCBqdXN0IGNoZWNraW5nIGlmIGl0J3Mgbm9ybWFsaXplZD8pXG4gICAgICAvLyBUT0RPOiBjaGVjayBwYXRoIGlzIGZyb20gcm9vdCBvZiBzY2hlbWF0aWNzIGV2ZW4gaWYgcGFzc2VkIGFic29sdXRlXG4gICAgICAvLyBUT0RPOiBlcnJvciBvdXQgaWYgcGF0aCBpcyBvdXRzaWRlIG9mIGhvc3RcbiAgICB9LFxuICB9LFxufTtcbiJdfQ==