"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-implicit-dependencies
const benchmark_1 = require("@_/benchmark");
const path_1 = require("./path");
const p1 = '/b/././a/tt/../../../a/b/./d/../c';
const p2 = '/a/tt/../../../a/b/./d';
describe('Virtual FS Path', () => {
    benchmark_1.benchmark('normalize', () => path_1.normalize(p1));
    benchmark_1.benchmark('join', () => path_1.join(path_1.normalize(p1), path_1.normalize(p2)));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aF9iZW5jaG1hcmsuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL3ZpcnR1YWwtZnMvcGF0aF9iZW5jaG1hcmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwwQ0FBMEM7QUFDMUMsNENBQXlDO0FBQ3pDLGlDQUF5QztBQUd6QyxNQUFNLEVBQUUsR0FBRyxtQ0FBbUMsQ0FBQztBQUMvQyxNQUFNLEVBQUUsR0FBRyx3QkFBd0IsQ0FBQztBQUdwQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQy9CLHFCQUFTLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxxQkFBUyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFJLENBQUMsZ0JBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgYmVuY2htYXJrIH0gZnJvbSAnQF8vYmVuY2htYXJrJztcbmltcG9ydCB7IGpvaW4sIG5vcm1hbGl6ZSB9IGZyb20gJy4vcGF0aCc7XG5cblxuY29uc3QgcDEgPSAnL2IvLi8uL2EvdHQvLi4vLi4vLi4vYS9iLy4vZC8uLi9jJztcbmNvbnN0IHAyID0gJy9hL3R0Ly4uLy4uLy4uL2EvYi8uL2QnO1xuXG5cbmRlc2NyaWJlKCdWaXJ0dWFsIEZTIFBhdGgnLCAoKSA9PiB7XG4gIGJlbmNobWFyaygnbm9ybWFsaXplJywgKCkgPT4gbm9ybWFsaXplKHAxKSk7XG4gIGJlbmNobWFyaygnam9pbicsICgpID0+IGpvaW4obm9ybWFsaXplKHAxKSwgbm9ybWFsaXplKHAyKSkpO1xufSk7XG4iXX0=