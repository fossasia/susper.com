"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const schematics_1 = require("@angular-devkit/schematics");
const semver = require("semver");
const npm_1 = require("../utility/npm");
const angularPackagesName = [
    '@angular/animations',
    '@angular/bazel',
    '@angular/benchpress',
    '@angular/common',
    '@angular/compiler',
    '@angular/compiler-cli',
    '@angular/core',
    '@angular/forms',
    '@angular/http',
    '@angular/language-service',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/platform-server',
    '@angular/platform-webworker',
    '@angular/platform-webworker-dynamic',
    '@angular/router',
    '@angular/service-worker',
    '@angular/upgrade',
];
function default_1(options) {
    const version = options.version || 'latest';
    if (semver.valid(version)) {
        if (!semver.gt(version, '4.0.0')) {
            throw new schematics_1.SchematicsException('You cannot use a version of Angular older than 4.');
        }
    }
    return npm_1.updatePackageJson(angularPackagesName, options.version, options.loose);
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NjaGVtYXRpY3MvcGFja2FnZV91cGRhdGUvX2FuZ3VsYXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwyREFBdUU7QUFDdkUsaUNBQWlDO0FBRWpDLHdDQUFtRDtBQUduRCxNQUFNLG1CQUFtQixHQUFHO0lBQzFCLHFCQUFxQjtJQUNyQixnQkFBZ0I7SUFDaEIscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsZUFBZTtJQUNmLDJCQUEyQjtJQUMzQiwyQkFBMkI7SUFDM0IsbUNBQW1DO0lBQ25DLDBCQUEwQjtJQUMxQiw2QkFBNkI7SUFDN0IscUNBQXFDO0lBQ3JDLGlCQUFpQjtJQUNqQix5QkFBeUI7SUFDekIsa0JBQWtCO0NBQ25CLENBQUM7QUFFRixtQkFBd0IsT0FBK0I7SUFDckQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUM7SUFDNUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxJQUFJLGdDQUFtQixDQUFDLG1EQUFtRCxDQUFDLENBQUM7UUFDckYsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsdUJBQWlCLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQVRELDRCQVNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgUnVsZSwgU2NoZW1hdGljc0V4Y2VwdGlvbiB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHsgU2NoZW1hdGljc1VwZGF0ZVNjaGVtYSB9IGZyb20gJy4uL3NjaGVtYSc7XG5pbXBvcnQgeyB1cGRhdGVQYWNrYWdlSnNvbiB9IGZyb20gJy4uL3V0aWxpdHkvbnBtJztcblxuXG5jb25zdCBhbmd1bGFyUGFja2FnZXNOYW1lID0gW1xuICAnQGFuZ3VsYXIvYW5pbWF0aW9ucycsXG4gICdAYW5ndWxhci9iYXplbCcsXG4gICdAYW5ndWxhci9iZW5jaHByZXNzJyxcbiAgJ0Bhbmd1bGFyL2NvbW1vbicsXG4gICdAYW5ndWxhci9jb21waWxlcicsXG4gICdAYW5ndWxhci9jb21waWxlci1jbGknLFxuICAnQGFuZ3VsYXIvY29yZScsXG4gICdAYW5ndWxhci9mb3JtcycsXG4gICdAYW5ndWxhci9odHRwJyxcbiAgJ0Bhbmd1bGFyL2xhbmd1YWdlLXNlcnZpY2UnLFxuICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlcicsXG4gICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMnLFxuICAnQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyJyxcbiAgJ0Bhbmd1bGFyL3BsYXRmb3JtLXdlYndvcmtlcicsXG4gICdAYW5ndWxhci9wbGF0Zm9ybS13ZWJ3b3JrZXItZHluYW1pYycsXG4gICdAYW5ndWxhci9yb3V0ZXInLFxuICAnQGFuZ3VsYXIvc2VydmljZS13b3JrZXInLFxuICAnQGFuZ3VsYXIvdXBncmFkZScsXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBTY2hlbWF0aWNzVXBkYXRlU2NoZW1hKTogUnVsZSB7XG4gIGNvbnN0IHZlcnNpb24gPSBvcHRpb25zLnZlcnNpb24gfHwgJ2xhdGVzdCc7XG4gIGlmIChzZW12ZXIudmFsaWQodmVyc2lvbikpIHtcbiAgICBpZiAoIXNlbXZlci5ndCh2ZXJzaW9uLCAnNC4wLjAnKSkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ1lvdSBjYW5ub3QgdXNlIGEgdmVyc2lvbiBvZiBBbmd1bGFyIG9sZGVyIHRoYW4gNC4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdXBkYXRlUGFja2FnZUpzb24oYW5ndWxhclBhY2thZ2VzTmFtZSwgb3B0aW9ucy52ZXJzaW9uLCBvcHRpb25zLmxvb3NlKTtcbn1cbiJdfQ==