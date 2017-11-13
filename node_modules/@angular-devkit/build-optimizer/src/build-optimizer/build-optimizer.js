"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const fs_1 = require("fs");
const transform_javascript_1 = require("../helpers/transform-javascript");
const class_fold_1 = require("../transforms/class-fold");
const import_tslib_1 = require("../transforms/import-tslib");
const prefix_classes_1 = require("../transforms/prefix-classes");
const prefix_functions_1 = require("../transforms/prefix-functions");
const scrub_file_1 = require("../transforms/scrub-file");
const wrap_enums_1 = require("../transforms/wrap-enums");
// Angular packages are known to have no side effects.
const whitelistedAngularModules = [
    /[\\/]node_modules[\\/]@angular[\\/]animations[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]common[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]compiler[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]core[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]forms[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]http[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]platform-browser-dynamic[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]platform-browser[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]platform-webworker-dynamic[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]platform-webworker[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]router[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]upgrade[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]material[\\/]/,
    /[\\/]node_modules[\\/]@angular[\\/]cdk[\\/]/,
];
const es5AngularModules = [
    // Angular 4 packaging format has .es5.js as the extension.
    /\.es5\.js$/,
    // Angular 5 has esm5 folders.
    /[\\/]node_modules[\\/]@angular[\\/][^\\/]+[\\/]esm5[\\/]/,
    // All Angular versions have UMD with es5.
    /\.umd\.js$/,
];
// Factories created by AOT are known to have no side effects and contain es5 code.
// In Angular 2/4 the file path for factories can be `.ts`, but in Angular 5 it is `.js`.
const ngFactories = [
    /\.ngfactory\.[jt]s/,
    /\.ngstyle\.[jt]s/,
];
function isKnownSideEffectFree(filePath) {
    return ngFactories.some((re) => re.test(filePath)) || (whitelistedAngularModules.some((re) => re.test(filePath))
        && es5AngularModules.some((re) => re.test(filePath)));
}
function buildOptimizer(options) {
    const { inputFilePath } = options;
    let { content } = options;
    if (!inputFilePath && content === undefined) {
        throw new Error('Either filePath or content must be specified in options.');
    }
    if (content === undefined) {
        content = fs_1.readFileSync(inputFilePath, 'UTF-8');
    }
    // Determine which transforms to apply.
    const getTransforms = [];
    if (wrap_enums_1.testWrapEnums(content)) {
        getTransforms.push(wrap_enums_1.getWrapEnumsTransformer);
    }
    if (import_tslib_1.testImportTslib(content)) {
        getTransforms.push(import_tslib_1.getImportTslibTransformer);
    }
    if (prefix_classes_1.testPrefixClasses(content)) {
        getTransforms.push(prefix_classes_1.getPrefixClassesTransformer);
    }
    if (options.isSideEffectFree || inputFilePath && isKnownSideEffectFree(inputFilePath)) {
        getTransforms.push(
        // getPrefixFunctionsTransformer is rather dangerous, apply only to known pure es5 modules.
        // It will mark both `require()` calls and `console.log(stuff)` as pure.
        // We only apply it to whitelisted modules, since we know they are safe.
        // getPrefixFunctionsTransformer needs to be before getFoldFileTransformer.
        prefix_functions_1.getPrefixFunctionsTransformer, scrub_file_1.getScrubFileTransformer, class_fold_1.getFoldFileTransformer);
    }
    else if (scrub_file_1.testScrubFile(content)) {
        getTransforms.push(scrub_file_1.getScrubFileTransformer, class_fold_1.getFoldFileTransformer);
    }
    const transformJavascriptOpts = {
        content: content,
        inputFilePath: options.inputFilePath,
        outputFilePath: options.outputFilePath,
        emitSourceMap: options.emitSourceMap,
        strict: options.strict,
        getTransforms,
    };
    return transform_javascript_1.transformJavascript(transformJavascriptOpts);
}
exports.buildOptimizer = buildOptimizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtb3B0aW1pemVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvYnVpbGQtb3B0aW1pemVyL2J1aWxkLW9wdGltaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDJCQUFrQztBQUNsQywwRUFJeUM7QUFDekMseURBQWtFO0FBQ2xFLDZEQUF3RjtBQUN4RixpRUFBOEY7QUFDOUYscUVBQStFO0FBQy9FLHlEQUFrRjtBQUNsRix5REFBa0Y7QUFHbEYsc0RBQXNEO0FBQ3RELE1BQU0seUJBQXlCLEdBQUc7SUFDaEMsb0RBQW9EO0lBQ3BELGdEQUFnRDtJQUNoRCxrREFBa0Q7SUFDbEQsOENBQThDO0lBQzlDLCtDQUErQztJQUMvQyw4Q0FBOEM7SUFDOUMsa0VBQWtFO0lBQ2xFLDBEQUEwRDtJQUMxRCxvRUFBb0U7SUFDcEUsNERBQTREO0lBQzVELGdEQUFnRDtJQUNoRCxpREFBaUQ7SUFDakQsa0RBQWtEO0lBQ2xELDZDQUE2QztDQUM5QyxDQUFDO0FBRUYsTUFBTSxpQkFBaUIsR0FBRztJQUN4QiwyREFBMkQ7SUFDM0QsWUFBWTtJQUNaLDhCQUE4QjtJQUM5QiwwREFBMEQ7SUFDMUQsMENBQTBDO0lBQzFDLFlBQVk7Q0FDYixDQUFDO0FBRUYsbUZBQW1GO0FBQ25GLHlGQUF5RjtBQUN6RixNQUFNLFdBQVcsR0FBRztJQUNsQixvQkFBb0I7SUFDcEIsa0JBQWtCO0NBQ25CLENBQUM7QUFFRiwrQkFBK0IsUUFBZ0I7SUFDN0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQ3BELHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1dBQ3RELGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQ3JELENBQUM7QUFDSixDQUFDO0FBV0Qsd0JBQStCLE9BQThCO0lBRTNELE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFDbEMsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUUxQixFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sR0FBRyxpQkFBWSxDQUFDLGFBQXVCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFFekIsRUFBRSxDQUFDLENBQUMsMEJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsYUFBYSxDQUFDLElBQUksQ0FBQyxvQ0FBdUIsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyw4QkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixhQUFhLENBQUMsSUFBSSxDQUFDLHdDQUF5QixDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLGtDQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixhQUFhLENBQUMsSUFBSSxDQUFDLDRDQUEyQixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxhQUFhLElBQUkscUJBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLGFBQWEsQ0FBQyxJQUFJO1FBQ2hCLDJGQUEyRjtRQUMzRix3RUFBd0U7UUFDeEUsd0VBQXdFO1FBQ3hFLDJFQUEyRTtRQUMzRSxnREFBNkIsRUFDN0Isb0NBQXVCLEVBQ3ZCLG1DQUFzQixDQUN2QixDQUFDO0lBQ0osQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywwQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxhQUFhLENBQUMsSUFBSSxDQUNoQixvQ0FBdUIsRUFDdkIsbUNBQXNCLENBQ3ZCLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSx1QkFBdUIsR0FBK0I7UUFDMUQsT0FBTyxFQUFFLE9BQU87UUFDaEIsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO1FBQ3BDLGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYztRQUN0QyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7UUFDcEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3RCLGFBQWE7S0FDZCxDQUFDO0lBRUYsTUFBTSxDQUFDLDBDQUFtQixDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdEQsQ0FBQztBQXZERCx3Q0F1REMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQge1xuICBUcmFuc2Zvcm1KYXZhc2NyaXB0T3B0aW9ucyxcbiAgVHJhbnNmb3JtSmF2YXNjcmlwdE91dHB1dCxcbiAgdHJhbnNmb3JtSmF2YXNjcmlwdCxcbn0gZnJvbSAnLi4vaGVscGVycy90cmFuc2Zvcm0tamF2YXNjcmlwdCc7XG5pbXBvcnQgeyBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9jbGFzcy1mb2xkJztcbmltcG9ydCB7IGdldEltcG9ydFRzbGliVHJhbnNmb3JtZXIsIHRlc3RJbXBvcnRUc2xpYiB9IGZyb20gJy4uL3RyYW5zZm9ybXMvaW1wb3J0LXRzbGliJztcbmltcG9ydCB7IGdldFByZWZpeENsYXNzZXNUcmFuc2Zvcm1lciwgdGVzdFByZWZpeENsYXNzZXMgfSBmcm9tICcuLi90cmFuc2Zvcm1zL3ByZWZpeC1jbGFzc2VzJztcbmltcG9ydCB7IGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9wcmVmaXgtZnVuY3Rpb25zJztcbmltcG9ydCB7IGdldFNjcnViRmlsZVRyYW5zZm9ybWVyLCB0ZXN0U2NydWJGaWxlIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9zY3J1Yi1maWxlJztcbmltcG9ydCB7IGdldFdyYXBFbnVtc1RyYW5zZm9ybWVyLCB0ZXN0V3JhcEVudW1zIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy93cmFwLWVudW1zJztcblxuXG4vLyBBbmd1bGFyIHBhY2thZ2VzIGFyZSBrbm93biB0byBoYXZlIG5vIHNpZGUgZWZmZWN0cy5cbmNvbnN0IHdoaXRlbGlzdGVkQW5ndWxhck1vZHVsZXMgPSBbXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWFuaW1hdGlvbnNbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dY29tbW9uW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWNvbXBpbGVyW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWNvcmVbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dZm9ybXNbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9daHR0cFtcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWNbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcGxhdGZvcm0tYnJvd3NlcltcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11wbGF0Zm9ybS13ZWJ3b3JrZXItZHluYW1pY1tcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11wbGF0Zm9ybS13ZWJ3b3JrZXJbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcm91dGVyW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXXVwZ3JhZGVbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dbWF0ZXJpYWxbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dY2RrW1xcXFwvXS8sXG5dO1xuXG5jb25zdCBlczVBbmd1bGFyTW9kdWxlcyA9IFtcbiAgLy8gQW5ndWxhciA0IHBhY2thZ2luZyBmb3JtYXQgaGFzIC5lczUuanMgYXMgdGhlIGV4dGVuc2lvbi5cbiAgL1xcLmVzNVxcLmpzJC8sIC8vIEFuZ3VsYXIgNFxuICAvLyBBbmd1bGFyIDUgaGFzIGVzbTUgZm9sZGVycy5cbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dW15cXFxcL10rW1xcXFwvXWVzbTVbXFxcXC9dLyxcbiAgLy8gQWxsIEFuZ3VsYXIgdmVyc2lvbnMgaGF2ZSBVTUQgd2l0aCBlczUuXG4gIC9cXC51bWRcXC5qcyQvLFxuXTtcblxuLy8gRmFjdG9yaWVzIGNyZWF0ZWQgYnkgQU9UIGFyZSBrbm93biB0byBoYXZlIG5vIHNpZGUgZWZmZWN0cyBhbmQgY29udGFpbiBlczUgY29kZS5cbi8vIEluIEFuZ3VsYXIgMi80IHRoZSBmaWxlIHBhdGggZm9yIGZhY3RvcmllcyBjYW4gYmUgYC50c2AsIGJ1dCBpbiBBbmd1bGFyIDUgaXQgaXMgYC5qc2AuXG5jb25zdCBuZ0ZhY3RvcmllcyA9IFtcbiAgL1xcLm5nZmFjdG9yeVxcLltqdF1zLyxcbiAgL1xcLm5nc3R5bGVcXC5banRdcy8sXG5dO1xuXG5mdW5jdGlvbiBpc0tub3duU2lkZUVmZmVjdEZyZWUoZmlsZVBhdGg6IHN0cmluZykge1xuICByZXR1cm4gbmdGYWN0b3JpZXMuc29tZSgocmUpID0+IHJlLnRlc3QoZmlsZVBhdGgpKSB8fCAoXG4gICAgd2hpdGVsaXN0ZWRBbmd1bGFyTW9kdWxlcy5zb21lKChyZSkgPT4gcmUudGVzdChmaWxlUGF0aCkpXG4gICAgJiYgZXM1QW5ndWxhck1vZHVsZXMuc29tZSgocmUpID0+IHJlLnRlc3QoZmlsZVBhdGgpKVxuICApO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkT3B0aW1pemVyT3B0aW9ucyB7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG4gIGlucHV0RmlsZVBhdGg/OiBzdHJpbmc7XG4gIG91dHB1dEZpbGVQYXRoPzogc3RyaW5nO1xuICBlbWl0U291cmNlTWFwPzogYm9vbGVhbjtcbiAgc3RyaWN0PzogYm9vbGVhbjtcbiAgaXNTaWRlRWZmZWN0RnJlZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE9wdGltaXplcihvcHRpb25zOiBCdWlsZE9wdGltaXplck9wdGlvbnMpOiBUcmFuc2Zvcm1KYXZhc2NyaXB0T3V0cHV0IHtcblxuICBjb25zdCB7IGlucHV0RmlsZVBhdGggfSA9IG9wdGlvbnM7XG4gIGxldCB7IGNvbnRlbnQgfSA9IG9wdGlvbnM7XG5cbiAgaWYgKCFpbnB1dEZpbGVQYXRoICYmIGNvbnRlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRWl0aGVyIGZpbGVQYXRoIG9yIGNvbnRlbnQgbXVzdCBiZSBzcGVjaWZpZWQgaW4gb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGlmIChjb250ZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICBjb250ZW50ID0gcmVhZEZpbGVTeW5jKGlucHV0RmlsZVBhdGggYXMgc3RyaW5nLCAnVVRGLTgnKTtcbiAgfVxuXG4gIC8vIERldGVybWluZSB3aGljaCB0cmFuc2Zvcm1zIHRvIGFwcGx5LlxuICBjb25zdCBnZXRUcmFuc2Zvcm1zID0gW107XG5cbiAgaWYgKHRlc3RXcmFwRW51bXMoY29udGVudCkpIHtcbiAgICBnZXRUcmFuc2Zvcm1zLnB1c2goZ2V0V3JhcEVudW1zVHJhbnNmb3JtZXIpO1xuICB9XG5cbiAgaWYgKHRlc3RJbXBvcnRUc2xpYihjb250ZW50KSkge1xuICAgIGdldFRyYW5zZm9ybXMucHVzaChnZXRJbXBvcnRUc2xpYlRyYW5zZm9ybWVyKTtcbiAgfVxuXG4gIGlmICh0ZXN0UHJlZml4Q2xhc3Nlcyhjb250ZW50KSkge1xuICAgIGdldFRyYW5zZm9ybXMucHVzaChnZXRQcmVmaXhDbGFzc2VzVHJhbnNmb3JtZXIpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaXNTaWRlRWZmZWN0RnJlZSB8fCBpbnB1dEZpbGVQYXRoICYmIGlzS25vd25TaWRlRWZmZWN0RnJlZShpbnB1dEZpbGVQYXRoKSkge1xuICAgIGdldFRyYW5zZm9ybXMucHVzaChcbiAgICAgIC8vIGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyIGlzIHJhdGhlciBkYW5nZXJvdXMsIGFwcGx5IG9ubHkgdG8ga25vd24gcHVyZSBlczUgbW9kdWxlcy5cbiAgICAgIC8vIEl0IHdpbGwgbWFyayBib3RoIGByZXF1aXJlKClgIGNhbGxzIGFuZCBgY29uc29sZS5sb2coc3R1ZmYpYCBhcyBwdXJlLlxuICAgICAgLy8gV2Ugb25seSBhcHBseSBpdCB0byB3aGl0ZWxpc3RlZCBtb2R1bGVzLCBzaW5jZSB3ZSBrbm93IHRoZXkgYXJlIHNhZmUuXG4gICAgICAvLyBnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lciBuZWVkcyB0byBiZSBiZWZvcmUgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lci5cbiAgICAgIGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyLFxuICAgICAgZ2V0U2NydWJGaWxlVHJhbnNmb3JtZXIsXG4gICAgICBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyLFxuICAgICk7XG4gIH0gZWxzZSBpZiAodGVzdFNjcnViRmlsZShjb250ZW50KSkge1xuICAgIGdldFRyYW5zZm9ybXMucHVzaChcbiAgICAgIGdldFNjcnViRmlsZVRyYW5zZm9ybWVyLFxuICAgICAgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lcixcbiAgICApO1xuICB9XG5cbiAgY29uc3QgdHJhbnNmb3JtSmF2YXNjcmlwdE9wdHM6IFRyYW5zZm9ybUphdmFzY3JpcHRPcHRpb25zID0ge1xuICAgIGNvbnRlbnQ6IGNvbnRlbnQsXG4gICAgaW5wdXRGaWxlUGF0aDogb3B0aW9ucy5pbnB1dEZpbGVQYXRoLFxuICAgIG91dHB1dEZpbGVQYXRoOiBvcHRpb25zLm91dHB1dEZpbGVQYXRoLFxuICAgIGVtaXRTb3VyY2VNYXA6IG9wdGlvbnMuZW1pdFNvdXJjZU1hcCxcbiAgICBzdHJpY3Q6IG9wdGlvbnMuc3RyaWN0LFxuICAgIGdldFRyYW5zZm9ybXMsXG4gIH07XG5cbiAgcmV0dXJuIHRyYW5zZm9ybUphdmFzY3JpcHQodHJhbnNmb3JtSmF2YXNjcmlwdE9wdHMpO1xufVxuIl19