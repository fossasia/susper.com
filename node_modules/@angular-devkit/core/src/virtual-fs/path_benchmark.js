"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const benchmark_1 = require("@_/benchmark");
const path_1 = require("./path");
const p1 = '/b/././a/tt/../../../a/b/./d/../c';
const p2 = '/a/tt/../../../a/b/./d';
describe('Virtual FS Path', () => {
    benchmark_1.benchmark('normalize', () => path_1.normalize(p1));
    benchmark_1.benchmark('join', () => path_1.join(path_1.normalize(p1), path_1.normalize(p2)));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aF9iZW5jaG1hcmsuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvdmlydHVhbC1mcy9wYXRoX2JlbmNobWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDRDQUF5QztBQUN6QyxpQ0FBeUM7QUFHekMsTUFBTSxFQUFFLEdBQUcsbUNBQW1DLENBQUM7QUFDL0MsTUFBTSxFQUFFLEdBQUcsd0JBQXdCLENBQUM7QUFHcEMsUUFBUSxDQUFDLGlCQUFpQixFQUFFO0lBQzFCLHFCQUFTLENBQUMsV0FBVyxFQUFFLE1BQU0sZ0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVDLHFCQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sV0FBSSxDQUFDLGdCQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsZ0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBiZW5jaG1hcmsgfSBmcm9tICdAXy9iZW5jaG1hcmsnO1xuaW1wb3J0IHsgam9pbiwgbm9ybWFsaXplIH0gZnJvbSAnLi9wYXRoJztcblxuXG5jb25zdCBwMSA9ICcvYi8uLy4vYS90dC8uLi8uLi8uLi9hL2IvLi9kLy4uL2MnO1xuY29uc3QgcDIgPSAnL2EvdHQvLi4vLi4vLi4vYS9iLy4vZCc7XG5cblxuZGVzY3JpYmUoJ1ZpcnR1YWwgRlMgUGF0aCcsICgpID0+IHtcbiAgYmVuY2htYXJrKCdub3JtYWxpemUnLCAoKSA9PiBub3JtYWxpemUocDEpKTtcbiAgYmVuY2htYXJrKCdqb2luJywgKCkgPT4gam9pbihub3JtYWxpemUocDEpLCBub3JtYWxpemUocDIpKSk7XG59KTtcbiJdfQ==