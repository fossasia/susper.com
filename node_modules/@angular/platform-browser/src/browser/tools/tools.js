/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { global } from '../../facade/lang';
import { AngularTools } from './common_tools';
var /** @type {?} */ context = (global);
/**
 *  Enabled Angular 2 debug tools that are accessible via your browser's
  * developer console.
  * *
  * Usage:
  * *
  * 1. Open developer console (e.g. in Chrome Ctrl + Shift + j)
  * 1. Type `ng.` (usually the console will show auto-complete suggestion)
  * 1. Try the change detection profiler `ng.profiler.timeChangeDetection()`
  * then hit Enter.
  * *
 * @param {?} ref
 * @return {?}
 */
export function enableDebugTools(ref) {
    ((Object)).assign(context.ng, new AngularTools(ref));
    return ref;
}
/**
 *  Disables Angular 2 tools.
  * *
 * @return {?}
 */
export function disableDebugTools() {
    if (context.ng) {
        delete context.ng.profiler;
    }
}
//# sourceMappingURL=tools.js.map