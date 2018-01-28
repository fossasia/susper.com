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
    let { originalFilePath, content } = options;
    if (!originalFilePath && inputFilePath) {
        originalFilePath = inputFilePath;
    }
    if (!inputFilePath && content === undefined) {
        throw new Error('Either filePath or content must be specified in options.');
    }
    if (content === undefined) {
        content = fs_1.readFileSync(inputFilePath, 'UTF-8');
    }
    if (!content) {
        return {
            content: null,
            sourceMap: null,
            emitSkipped: true,
        };
    }
    const isWebpackBundle = content.indexOf('__webpack_require__') !== -1;
    // Determine which transforms to apply.
    const getTransforms = [];
    let typeCheck = false;
    if (options.isSideEffectFree || originalFilePath && isKnownSideEffectFree(originalFilePath)) {
        getTransforms.push(
        // getPrefixFunctionsTransformer is rather dangerous, apply only to known pure es5 modules.
        // It will mark both `require()` calls and `console.log(stuff)` as pure.
        // We only apply it to whitelisted modules, since we know they are safe.
        // getPrefixFunctionsTransformer needs to be before getFoldFileTransformer.
        prefix_functions_1.getPrefixFunctionsTransformer, scrub_file_1.getScrubFileTransformer, class_fold_1.getFoldFileTransformer);
        typeCheck = true;
    }
    else if (scrub_file_1.testScrubFile(content)) {
        // Always test as these require the type checker
        getTransforms.push(scrub_file_1.getScrubFileTransformer, class_fold_1.getFoldFileTransformer);
        typeCheck = true;
    }
    // tests are not needed for fast path
    // usage will be expanded once transformers are verified safe
    const ignoreTest = !options.emitSourceMap && !typeCheck;
    if (prefix_classes_1.testPrefixClasses(content)) {
        getTransforms.unshift(prefix_classes_1.getPrefixClassesTransformer);
    }
    // This transform introduces import/require() calls, but this won't work properly on libraries
    // built with Webpack. These libraries use __webpack_require__() calls instead, which will break
    // with a new import that wasn't part of it's original module list.
    // We ignore this transform for such libraries.
    if (!isWebpackBundle && (ignoreTest || import_tslib_1.testImportTslib(content))) {
        getTransforms.unshift(import_tslib_1.getImportTslibTransformer);
    }
    if (wrap_enums_1.testWrapEnums(content)) {
        getTransforms.unshift(wrap_enums_1.getWrapEnumsTransformer);
    }
    const transformJavascriptOpts = {
        content: content,
        inputFilePath: options.inputFilePath,
        outputFilePath: options.outputFilePath,
        emitSourceMap: options.emitSourceMap,
        strict: options.strict,
        getTransforms,
        typeCheck,
    };
    return transform_javascript_1.transformJavascript(transformJavascriptOpts);
}
exports.buildOptimizer = buildOptimizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtb3B0aW1pemVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvYnVpbGQtb3B0aW1pemVyL2J1aWxkLW9wdGltaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDJCQUFrQztBQUNsQywwRUFJeUM7QUFDekMseURBQWtFO0FBQ2xFLDZEQUF3RjtBQUN4RixpRUFBOEY7QUFDOUYscUVBQStFO0FBQy9FLHlEQUFrRjtBQUNsRix5REFBa0Y7QUFHbEYsc0RBQXNEO0FBQ3RELE1BQU0seUJBQXlCLEdBQUc7SUFDaEMsb0RBQW9EO0lBQ3BELGdEQUFnRDtJQUNoRCxrREFBa0Q7SUFDbEQsOENBQThDO0lBQzlDLCtDQUErQztJQUMvQyw4Q0FBOEM7SUFDOUMsa0VBQWtFO0lBQ2xFLDBEQUEwRDtJQUMxRCxvRUFBb0U7SUFDcEUsNERBQTREO0lBQzVELGdEQUFnRDtJQUNoRCxpREFBaUQ7SUFDakQsa0RBQWtEO0lBQ2xELDZDQUE2QztDQUM5QyxDQUFDO0FBRUYsTUFBTSxpQkFBaUIsR0FBRztJQUN4QiwyREFBMkQ7SUFDM0QsWUFBWTtJQUNaLDhCQUE4QjtJQUM5QiwwREFBMEQ7SUFDMUQsMENBQTBDO0lBQzFDLFlBQVk7Q0FDYixDQUFDO0FBRUYsbUZBQW1GO0FBQ25GLHlGQUF5RjtBQUN6RixNQUFNLFdBQVcsR0FBRztJQUNsQixvQkFBb0I7SUFDcEIsa0JBQWtCO0NBQ25CLENBQUM7QUFFRiwrQkFBK0IsUUFBZ0I7SUFDN0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUNwRCx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7V0FDdEQsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQ3JELENBQUM7QUFDSixDQUFDO0FBWUQsd0JBQStCLE9BQThCO0lBRTNELE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFDbEMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUU1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDdkMsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO0lBQ25DLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sR0FBRyxpQkFBWSxDQUFDLGFBQXVCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNiLE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxJQUFJO1lBQ2IsU0FBUyxFQUFFLElBQUk7WUFDZixXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUV0RSx1Q0FBdUM7SUFDdkMsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBRXpCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN0QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLElBQUksZ0JBQWdCLElBQUkscUJBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUYsYUFBYSxDQUFDLElBQUk7UUFDaEIsMkZBQTJGO1FBQzNGLHdFQUF3RTtRQUN4RSx3RUFBd0U7UUFDeEUsMkVBQTJFO1FBQzNFLGdEQUE2QixFQUM3QixvQ0FBdUIsRUFDdkIsbUNBQXNCLENBQ3ZCLENBQUM7UUFDRixTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsMEJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsZ0RBQWdEO1FBQ2hELGFBQWEsQ0FBQyxJQUFJLENBQ2hCLG9DQUF1QixFQUN2QixtQ0FBc0IsQ0FDdkIsQ0FBQztRQUNGLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELHFDQUFxQztJQUNyQyw2REFBNkQ7SUFDN0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLENBQUMsU0FBUyxDQUFDO0lBRXhELEVBQUUsQ0FBQyxDQUFDLGtDQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixhQUFhLENBQUMsT0FBTyxDQUFDLDRDQUEyQixDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELDhGQUE4RjtJQUM5RixnR0FBZ0c7SUFDaEcsbUVBQW1FO0lBQ25FLCtDQUErQztJQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsSUFBSSxDQUFDLFVBQVUsSUFBSSw4QkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLGFBQWEsQ0FBQyxPQUFPLENBQUMsd0NBQXlCLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsMEJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsYUFBYSxDQUFDLE9BQU8sQ0FBQyxvQ0FBdUIsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxNQUFNLHVCQUF1QixHQUErQjtRQUMxRCxPQUFPLEVBQUUsT0FBTztRQUNoQixhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7UUFDcEMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxjQUFjO1FBQ3RDLGFBQWEsRUFBRSxPQUFPLENBQUMsYUFBYTtRQUNwQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07UUFDdEIsYUFBYTtRQUNiLFNBQVM7S0FDVixDQUFDO0lBRUYsTUFBTSxDQUFDLDBDQUFtQixDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdEQsQ0FBQztBQWxGRCx3Q0FrRkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQge1xuICBUcmFuc2Zvcm1KYXZhc2NyaXB0T3B0aW9ucyxcbiAgVHJhbnNmb3JtSmF2YXNjcmlwdE91dHB1dCxcbiAgdHJhbnNmb3JtSmF2YXNjcmlwdCxcbn0gZnJvbSAnLi4vaGVscGVycy90cmFuc2Zvcm0tamF2YXNjcmlwdCc7XG5pbXBvcnQgeyBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9jbGFzcy1mb2xkJztcbmltcG9ydCB7IGdldEltcG9ydFRzbGliVHJhbnNmb3JtZXIsIHRlc3RJbXBvcnRUc2xpYiB9IGZyb20gJy4uL3RyYW5zZm9ybXMvaW1wb3J0LXRzbGliJztcbmltcG9ydCB7IGdldFByZWZpeENsYXNzZXNUcmFuc2Zvcm1lciwgdGVzdFByZWZpeENsYXNzZXMgfSBmcm9tICcuLi90cmFuc2Zvcm1zL3ByZWZpeC1jbGFzc2VzJztcbmltcG9ydCB7IGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9wcmVmaXgtZnVuY3Rpb25zJztcbmltcG9ydCB7IGdldFNjcnViRmlsZVRyYW5zZm9ybWVyLCB0ZXN0U2NydWJGaWxlIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9zY3J1Yi1maWxlJztcbmltcG9ydCB7IGdldFdyYXBFbnVtc1RyYW5zZm9ybWVyLCB0ZXN0V3JhcEVudW1zIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy93cmFwLWVudW1zJztcblxuXG4vLyBBbmd1bGFyIHBhY2thZ2VzIGFyZSBrbm93biB0byBoYXZlIG5vIHNpZGUgZWZmZWN0cy5cbmNvbnN0IHdoaXRlbGlzdGVkQW5ndWxhck1vZHVsZXMgPSBbXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWFuaW1hdGlvbnNbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dY29tbW9uW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWNvbXBpbGVyW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWNvcmVbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dZm9ybXNbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9daHR0cFtcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWNbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcGxhdGZvcm0tYnJvd3NlcltcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11wbGF0Zm9ybS13ZWJ3b3JrZXItZHluYW1pY1tcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11wbGF0Zm9ybS13ZWJ3b3JrZXJbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcm91dGVyW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXXVwZ3JhZGVbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dbWF0ZXJpYWxbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dY2RrW1xcXFwvXS8sXG5dO1xuXG5jb25zdCBlczVBbmd1bGFyTW9kdWxlcyA9IFtcbiAgLy8gQW5ndWxhciA0IHBhY2thZ2luZyBmb3JtYXQgaGFzIC5lczUuanMgYXMgdGhlIGV4dGVuc2lvbi5cbiAgL1xcLmVzNVxcLmpzJC8sIC8vIEFuZ3VsYXIgNFxuICAvLyBBbmd1bGFyIDUgaGFzIGVzbTUgZm9sZGVycy5cbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dW15cXFxcL10rW1xcXFwvXWVzbTVbXFxcXC9dLyxcbiAgLy8gQWxsIEFuZ3VsYXIgdmVyc2lvbnMgaGF2ZSBVTUQgd2l0aCBlczUuXG4gIC9cXC51bWRcXC5qcyQvLFxuXTtcblxuLy8gRmFjdG9yaWVzIGNyZWF0ZWQgYnkgQU9UIGFyZSBrbm93biB0byBoYXZlIG5vIHNpZGUgZWZmZWN0cyBhbmQgY29udGFpbiBlczUgY29kZS5cbi8vIEluIEFuZ3VsYXIgMi80IHRoZSBmaWxlIHBhdGggZm9yIGZhY3RvcmllcyBjYW4gYmUgYC50c2AsIGJ1dCBpbiBBbmd1bGFyIDUgaXQgaXMgYC5qc2AuXG5jb25zdCBuZ0ZhY3RvcmllcyA9IFtcbiAgL1xcLm5nZmFjdG9yeVxcLltqdF1zLyxcbiAgL1xcLm5nc3R5bGVcXC5banRdcy8sXG5dO1xuXG5mdW5jdGlvbiBpc0tub3duU2lkZUVmZmVjdEZyZWUoZmlsZVBhdGg6IHN0cmluZykge1xuICByZXR1cm4gbmdGYWN0b3JpZXMuc29tZSgocmUpID0+IHJlLnRlc3QoZmlsZVBhdGgpKSB8fCAoXG4gICAgd2hpdGVsaXN0ZWRBbmd1bGFyTW9kdWxlcy5zb21lKChyZSkgPT4gcmUudGVzdChmaWxlUGF0aCkpXG4gICAgJiYgZXM1QW5ndWxhck1vZHVsZXMuc29tZSgocmUpID0+IHJlLnRlc3QoZmlsZVBhdGgpKVxuICApO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkT3B0aW1pemVyT3B0aW9ucyB7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG4gIG9yaWdpbmFsRmlsZVBhdGg/OiBzdHJpbmc7XG4gIGlucHV0RmlsZVBhdGg/OiBzdHJpbmc7XG4gIG91dHB1dEZpbGVQYXRoPzogc3RyaW5nO1xuICBlbWl0U291cmNlTWFwPzogYm9vbGVhbjtcbiAgc3RyaWN0PzogYm9vbGVhbjtcbiAgaXNTaWRlRWZmZWN0RnJlZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE9wdGltaXplcihvcHRpb25zOiBCdWlsZE9wdGltaXplck9wdGlvbnMpOiBUcmFuc2Zvcm1KYXZhc2NyaXB0T3V0cHV0IHtcblxuICBjb25zdCB7IGlucHV0RmlsZVBhdGggfSA9IG9wdGlvbnM7XG4gIGxldCB7IG9yaWdpbmFsRmlsZVBhdGgsIGNvbnRlbnQgfSA9IG9wdGlvbnM7XG5cbiAgaWYgKCFvcmlnaW5hbEZpbGVQYXRoICYmIGlucHV0RmlsZVBhdGgpIHtcbiAgICBvcmlnaW5hbEZpbGVQYXRoID0gaW5wdXRGaWxlUGF0aDtcbiAgfVxuXG4gIGlmICghaW5wdXRGaWxlUGF0aCAmJiBjb250ZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VpdGhlciBmaWxlUGF0aCBvciBjb250ZW50IG11c3QgYmUgc3BlY2lmaWVkIGluIG9wdGlvbnMuJyk7XG4gIH1cblxuICBpZiAoY29udGVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29udGVudCA9IHJlYWRGaWxlU3luYyhpbnB1dEZpbGVQYXRoIGFzIHN0cmluZywgJ1VURi04Jyk7XG4gIH1cblxuICBpZiAoIWNvbnRlbnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDogbnVsbCxcbiAgICAgIHNvdXJjZU1hcDogbnVsbCxcbiAgICAgIGVtaXRTa2lwcGVkOiB0cnVlLFxuICAgIH07XG4gIH1cblxuICBjb25zdCBpc1dlYnBhY2tCdW5kbGUgPSBjb250ZW50LmluZGV4T2YoJ19fd2VicGFja19yZXF1aXJlX18nKSAhPT0gLTE7XG5cbiAgLy8gRGV0ZXJtaW5lIHdoaWNoIHRyYW5zZm9ybXMgdG8gYXBwbHkuXG4gIGNvbnN0IGdldFRyYW5zZm9ybXMgPSBbXTtcblxuICBsZXQgdHlwZUNoZWNrID0gZmFsc2U7XG4gIGlmIChvcHRpb25zLmlzU2lkZUVmZmVjdEZyZWUgfHwgb3JpZ2luYWxGaWxlUGF0aCAmJiBpc0tub3duU2lkZUVmZmVjdEZyZWUob3JpZ2luYWxGaWxlUGF0aCkpIHtcbiAgICBnZXRUcmFuc2Zvcm1zLnB1c2goXG4gICAgICAvLyBnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lciBpcyByYXRoZXIgZGFuZ2Vyb3VzLCBhcHBseSBvbmx5IHRvIGtub3duIHB1cmUgZXM1IG1vZHVsZXMuXG4gICAgICAvLyBJdCB3aWxsIG1hcmsgYm90aCBgcmVxdWlyZSgpYCBjYWxscyBhbmQgYGNvbnNvbGUubG9nKHN0dWZmKWAgYXMgcHVyZS5cbiAgICAgIC8vIFdlIG9ubHkgYXBwbHkgaXQgdG8gd2hpdGVsaXN0ZWQgbW9kdWxlcywgc2luY2Ugd2Uga25vdyB0aGV5IGFyZSBzYWZlLlxuICAgICAgLy8gZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIgbmVlZHMgdG8gYmUgYmVmb3JlIGdldEZvbGRGaWxlVHJhbnNmb3JtZXIuXG4gICAgICBnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lcixcbiAgICAgIGdldFNjcnViRmlsZVRyYW5zZm9ybWVyLFxuICAgICAgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lcixcbiAgICApO1xuICAgIHR5cGVDaGVjayA9IHRydWU7XG4gIH0gZWxzZSBpZiAodGVzdFNjcnViRmlsZShjb250ZW50KSkge1xuICAgIC8vIEFsd2F5cyB0ZXN0IGFzIHRoZXNlIHJlcXVpcmUgdGhlIHR5cGUgY2hlY2tlclxuICAgIGdldFRyYW5zZm9ybXMucHVzaChcbiAgICAgIGdldFNjcnViRmlsZVRyYW5zZm9ybWVyLFxuICAgICAgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lcixcbiAgICApO1xuICAgIHR5cGVDaGVjayA9IHRydWU7XG4gIH1cblxuICAvLyB0ZXN0cyBhcmUgbm90IG5lZWRlZCBmb3IgZmFzdCBwYXRoXG4gIC8vIHVzYWdlIHdpbGwgYmUgZXhwYW5kZWQgb25jZSB0cmFuc2Zvcm1lcnMgYXJlIHZlcmlmaWVkIHNhZmVcbiAgY29uc3QgaWdub3JlVGVzdCA9ICFvcHRpb25zLmVtaXRTb3VyY2VNYXAgJiYgIXR5cGVDaGVjaztcblxuICBpZiAodGVzdFByZWZpeENsYXNzZXMoY29udGVudCkpIHtcbiAgICBnZXRUcmFuc2Zvcm1zLnVuc2hpZnQoZ2V0UHJlZml4Q2xhc3Nlc1RyYW5zZm9ybWVyKTtcbiAgfVxuXG4gIC8vIFRoaXMgdHJhbnNmb3JtIGludHJvZHVjZXMgaW1wb3J0L3JlcXVpcmUoKSBjYWxscywgYnV0IHRoaXMgd29uJ3Qgd29yayBwcm9wZXJseSBvbiBsaWJyYXJpZXNcbiAgLy8gYnVpbHQgd2l0aCBXZWJwYWNrLiBUaGVzZSBsaWJyYXJpZXMgdXNlIF9fd2VicGFja19yZXF1aXJlX18oKSBjYWxscyBpbnN0ZWFkLCB3aGljaCB3aWxsIGJyZWFrXG4gIC8vIHdpdGggYSBuZXcgaW1wb3J0IHRoYXQgd2Fzbid0IHBhcnQgb2YgaXQncyBvcmlnaW5hbCBtb2R1bGUgbGlzdC5cbiAgLy8gV2UgaWdub3JlIHRoaXMgdHJhbnNmb3JtIGZvciBzdWNoIGxpYnJhcmllcy5cbiAgaWYgKCFpc1dlYnBhY2tCdW5kbGUgJiYgKGlnbm9yZVRlc3QgfHwgdGVzdEltcG9ydFRzbGliKGNvbnRlbnQpKSkge1xuICAgIGdldFRyYW5zZm9ybXMudW5zaGlmdChnZXRJbXBvcnRUc2xpYlRyYW5zZm9ybWVyKTtcbiAgfVxuXG4gIGlmICh0ZXN0V3JhcEVudW1zKGNvbnRlbnQpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy51bnNoaWZ0KGdldFdyYXBFbnVtc1RyYW5zZm9ybWVyKTtcbiAgfVxuXG4gIGNvbnN0IHRyYW5zZm9ybUphdmFzY3JpcHRPcHRzOiBUcmFuc2Zvcm1KYXZhc2NyaXB0T3B0aW9ucyA9IHtcbiAgICBjb250ZW50OiBjb250ZW50LFxuICAgIGlucHV0RmlsZVBhdGg6IG9wdGlvbnMuaW5wdXRGaWxlUGF0aCxcbiAgICBvdXRwdXRGaWxlUGF0aDogb3B0aW9ucy5vdXRwdXRGaWxlUGF0aCxcbiAgICBlbWl0U291cmNlTWFwOiBvcHRpb25zLmVtaXRTb3VyY2VNYXAsXG4gICAgc3RyaWN0OiBvcHRpb25zLnN0cmljdCxcbiAgICBnZXRUcmFuc2Zvcm1zLFxuICAgIHR5cGVDaGVjayxcbiAgfTtcblxuICByZXR1cm4gdHJhbnNmb3JtSmF2YXNjcmlwdCh0cmFuc2Zvcm1KYXZhc2NyaXB0T3B0cyk7XG59XG4iXX0=