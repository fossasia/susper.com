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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvZm9ybWF0cy9wYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0NBQXlEO0FBRzVDLFFBQUEsVUFBVSxHQUF3QjtJQUM3QyxJQUFJLEVBQUUsTUFBTTtJQUNaLFNBQVMsRUFBRTtRQUNULEtBQUssRUFBRSxLQUFLO1FBQ1osUUFBUSxFQUFFLENBQUMsSUFBWSxFQUFFLEVBQUU7WUFDekIsb0NBQW9DO1lBQ3BDLE1BQU0sQ0FBQyxJQUFJLEtBQUssZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQywyRUFBMkU7WUFDM0Usc0VBQXNFO1lBQ3RFLDZDQUE2QztRQUMvQyxDQUFDO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBub3JtYWxpemUsIHNjaGVtYSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcblxuXG5leHBvcnQgY29uc3QgcGF0aEZvcm1hdDogc2NoZW1hLlNjaGVtYUZvcm1hdCA9IHtcbiAgbmFtZTogJ3BhdGgnLFxuICBmb3JtYXR0ZXI6IHtcbiAgICBhc3luYzogZmFsc2UsXG4gICAgdmFsaWRhdGU6IChwYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgIC8vIENoZWNrIHBhdGggaXMgbm9ybWFsaXplZCBhbHJlYWR5LlxuICAgICAgcmV0dXJuIHBhdGggPT09IG5vcm1hbGl6ZShwYXRoKTtcbiAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHBhdGggaXMgdmFsaWQgKGlzIHRoYXQganVzdCBjaGVja2luZyBpZiBpdCdzIG5vcm1hbGl6ZWQ/KVxuICAgICAgLy8gVE9ETzogY2hlY2sgcGF0aCBpcyBmcm9tIHJvb3Qgb2Ygc2NoZW1hdGljcyBldmVuIGlmIHBhc3NlZCBhYnNvbHV0ZVxuICAgICAgLy8gVE9ETzogZXJyb3Igb3V0IGlmIHBhdGggaXMgb3V0c2lkZSBvZiBob3N0XG4gICAgfSxcbiAgfSxcbn07XG4iXX0=