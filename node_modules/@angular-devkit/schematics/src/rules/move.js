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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZS5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvcnVsZXMvbW92ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUFpRDtBQUdqRCxpQ0FBaUM7QUFHakMsZ0JBQXVCLElBQVksRUFBRSxFQUFXO0lBQzlDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDVixJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHLGdCQUFTLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sTUFBTSxHQUFHLGdCQUFTLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBRW5DLE1BQU0sQ0FBQyxDQUFDLEtBQWdCLEVBQUUsRUFBRTtRQUMxQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDO2dCQUNMLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsSUFBSSxFQUFFLGdCQUFTLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbkUsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQW5CRCx3QkFtQkM7QUFHRCxjQUFxQixJQUFZLEVBQUUsRUFBVztJQUM1QyxNQUFNLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRkQsb0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBub3JtYWxpemUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBGaWxlT3BlcmF0b3IsIFJ1bGUgfSBmcm9tICcuLi9lbmdpbmUvaW50ZXJmYWNlJztcbmltcG9ydCB7IEZpbGVFbnRyeSB9IGZyb20gJy4uL3RyZWUvaW50ZXJmYWNlJztcbmltcG9ydCB7IGZvckVhY2ggfSBmcm9tICcuL2Jhc2UnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlT3AoZnJvbTogc3RyaW5nLCB0bz86IHN0cmluZyk6IEZpbGVPcGVyYXRvciB7XG4gIGlmICh0byA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdG8gPSBmcm9tO1xuICAgIGZyb20gPSAnLyc7XG4gIH1cblxuICBjb25zdCBmcm9tUGF0aCA9IG5vcm1hbGl6ZSgnLycgKyBmcm9tKTtcbiAgY29uc3QgdG9QYXRoID0gbm9ybWFsaXplKCcvJyArIHRvKTtcblxuICByZXR1cm4gKGVudHJ5OiBGaWxlRW50cnkpID0+IHtcbiAgICBpZiAoZW50cnkucGF0aC5zdGFydHNXaXRoKGZyb21QYXRoKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29udGVudDogZW50cnkuY29udGVudCxcbiAgICAgICAgcGF0aDogbm9ybWFsaXplKHRvUGF0aCArICcvJyArIGVudHJ5LnBhdGguc3Vic3RyKGZyb21QYXRoLmxlbmd0aCkpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZW50cnk7XG4gIH07XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmUoZnJvbTogc3RyaW5nLCB0bz86IHN0cmluZyk6IFJ1bGUge1xuICByZXR1cm4gZm9yRWFjaChtb3ZlT3AoZnJvbSwgdG8pKTtcbn1cbiJdfQ==