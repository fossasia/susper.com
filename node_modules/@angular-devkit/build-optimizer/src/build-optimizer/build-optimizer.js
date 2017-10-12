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
    if (inputFilePath
        && whitelistedAngularModules.some((re) => re.test(inputFilePath))
        && es5AngularModules.some((re) => re.test(inputFilePath))) {
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
    return transform_javascript_1.transformJavascript(Object.assign({}, options, { getTransforms, content }));
}
exports.buildOptimizer = buildOptimizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtb3B0aW1pemVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvYnVpbGQtb3B0aW1pemVyL2J1aWxkLW9wdGltaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDJCQUFrQztBQUNsQywwRUFBaUc7QUFDakcseURBQWtFO0FBQ2xFLDZEQUF3RjtBQUN4RixpRUFBOEY7QUFDOUYscUVBQStFO0FBQy9FLHlEQUFrRjtBQUNsRix5REFBa0Y7QUFHbEYsTUFBTSx5QkFBeUIsR0FBRztJQUNoQyxvREFBb0Q7SUFDcEQsZ0RBQWdEO0lBQ2hELGtEQUFrRDtJQUNsRCw4Q0FBOEM7SUFDOUMsK0NBQStDO0lBQy9DLDhDQUE4QztJQUM5QyxrRUFBa0U7SUFDbEUsMERBQTBEO0lBQzFELG9FQUFvRTtJQUNwRSw0REFBNEQ7SUFDNUQsZ0RBQWdEO0lBQ2hELGlEQUFpRDtJQUNqRCxrREFBa0Q7SUFDbEQsNkNBQTZDO0NBQzlDLENBQUM7QUFFRixNQUFNLGlCQUFpQixHQUFHO0lBQ3hCLDJEQUEyRDtJQUMzRCxZQUFZO0lBQ1osOEJBQThCO0lBQzlCLDBEQUEwRDtJQUMxRCwwQ0FBMEM7SUFDMUMsWUFBWTtDQUNiLENBQUM7QUFVRix3QkFBK0IsT0FBOEI7SUFFM0QsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUNsQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBRTFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsT0FBTyxHQUFHLGlCQUFZLENBQUMsYUFBdUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsdUNBQXVDO0lBQ3ZDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUV6QixFQUFFLENBQUMsQ0FBQywwQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixhQUFhLENBQUMsSUFBSSxDQUFDLG9DQUF1QixDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLDhCQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGFBQWEsQ0FBQyxJQUFJLENBQUMsd0NBQXlCLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsa0NBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLGFBQWEsQ0FBQyxJQUFJLENBQUMsNENBQTJCLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsYUFBYTtXQUNaLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1dBQzlELGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUMxRCxDQUFDLENBQUMsQ0FBQztRQUNELGFBQWEsQ0FBQyxJQUFJO1FBQ2hCLDJGQUEyRjtRQUMzRix3RUFBd0U7UUFDeEUsd0VBQXdFO1FBQ3hFLDJFQUEyRTtRQUMzRSxnREFBNkIsRUFDN0Isb0NBQXVCLEVBQ3ZCLG1DQUFzQixDQUN2QixDQUFDO0lBQ0osQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQywwQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxhQUFhLENBQUMsSUFBSSxDQUNoQixvQ0FBdUIsRUFDdkIsbUNBQXNCLENBQ3ZCLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLDBDQUFtQixtQkFBTSxPQUFPLElBQUUsYUFBYSxFQUFFLE9BQU8sSUFBRyxDQUFDO0FBQ3JFLENBQUM7QUFqREQsd0NBaURDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtSmF2YXNjcmlwdE91dHB1dCwgdHJhbnNmb3JtSmF2YXNjcmlwdCB9IGZyb20gJy4uL2hlbHBlcnMvdHJhbnNmb3JtLWphdmFzY3JpcHQnO1xuaW1wb3J0IHsgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lciB9IGZyb20gJy4uL3RyYW5zZm9ybXMvY2xhc3MtZm9sZCc7XG5pbXBvcnQgeyBnZXRJbXBvcnRUc2xpYlRyYW5zZm9ybWVyLCB0ZXN0SW1wb3J0VHNsaWIgfSBmcm9tICcuLi90cmFuc2Zvcm1zL2ltcG9ydC10c2xpYic7XG5pbXBvcnQgeyBnZXRQcmVmaXhDbGFzc2VzVHJhbnNmb3JtZXIsIHRlc3RQcmVmaXhDbGFzc2VzIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9wcmVmaXgtY2xhc3Nlcyc7XG5pbXBvcnQgeyBnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lciB9IGZyb20gJy4uL3RyYW5zZm9ybXMvcHJlZml4LWZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBnZXRTY3J1YkZpbGVUcmFuc2Zvcm1lciwgdGVzdFNjcnViRmlsZSB9IGZyb20gJy4uL3RyYW5zZm9ybXMvc2NydWItZmlsZSc7XG5pbXBvcnQgeyBnZXRXcmFwRW51bXNUcmFuc2Zvcm1lciwgdGVzdFdyYXBFbnVtcyB9IGZyb20gJy4uL3RyYW5zZm9ybXMvd3JhcC1lbnVtcyc7XG5cblxuY29uc3Qgd2hpdGVsaXN0ZWRBbmd1bGFyTW9kdWxlcyA9IFtcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dYW5pbWF0aW9uc1tcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11jb21tb25bXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dY29tcGlsZXJbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dY29yZVtcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11mb3Jtc1tcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11odHRwW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXXBsYXRmb3JtLWJyb3dzZXItZHluYW1pY1tcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11wbGF0Zm9ybS1icm93c2VyW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXXBsYXRmb3JtLXdlYndvcmtlci1keW5hbWljW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXXBsYXRmb3JtLXdlYndvcmtlcltcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11yb3V0ZXJbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9ddXBncmFkZVtcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11tYXRlcmlhbFtcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11jZGtbXFxcXC9dLyxcbl07XG5cbmNvbnN0IGVzNUFuZ3VsYXJNb2R1bGVzID0gW1xuICAvLyBBbmd1bGFyIDQgcGFja2FnaW5nIGZvcm1hdCBoYXMgLmVzNS5qcyBhcyB0aGUgZXh0ZW5zaW9uLlxuICAvXFwuZXM1XFwuanMkLywgLy8gQW5ndWxhciA0XG4gIC8vIEFuZ3VsYXIgNSBoYXMgZXNtNSBmb2xkZXJzLlxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11bXlxcXFwvXStbXFxcXC9dZXNtNVtcXFxcL10vLFxuICAvLyBBbGwgQW5ndWxhciB2ZXJzaW9ucyBoYXZlIFVNRCB3aXRoIGVzNS5cbiAgL1xcLnVtZFxcLmpzJC8sXG5dO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkT3B0aW1pemVyT3B0aW9ucyB7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG4gIGlucHV0RmlsZVBhdGg/OiBzdHJpbmc7XG4gIG91dHB1dEZpbGVQYXRoPzogc3RyaW5nO1xuICBlbWl0U291cmNlTWFwPzogYm9vbGVhbjtcbiAgc3RyaWN0PzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkT3B0aW1pemVyKG9wdGlvbnM6IEJ1aWxkT3B0aW1pemVyT3B0aW9ucyk6IFRyYW5zZm9ybUphdmFzY3JpcHRPdXRwdXQge1xuXG4gIGNvbnN0IHsgaW5wdXRGaWxlUGF0aCB9ID0gb3B0aW9ucztcbiAgbGV0IHsgY29udGVudCB9ID0gb3B0aW9ucztcblxuICBpZiAoIWlucHV0RmlsZVBhdGggJiYgY29udGVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFaXRoZXIgZmlsZVBhdGggb3IgY29udGVudCBtdXN0IGJlIHNwZWNpZmllZCBpbiBvcHRpb25zLicpO1xuICB9XG5cbiAgaWYgKGNvbnRlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnRlbnQgPSByZWFkRmlsZVN5bmMoaW5wdXRGaWxlUGF0aCBhcyBzdHJpbmcsICdVVEYtOCcpO1xuICB9XG5cbiAgLy8gRGV0ZXJtaW5lIHdoaWNoIHRyYW5zZm9ybXMgdG8gYXBwbHkuXG4gIGNvbnN0IGdldFRyYW5zZm9ybXMgPSBbXTtcblxuICBpZiAodGVzdFdyYXBFbnVtcyhjb250ZW50KSkge1xuICAgIGdldFRyYW5zZm9ybXMucHVzaChnZXRXcmFwRW51bXNUcmFuc2Zvcm1lcik7XG4gIH1cblxuICBpZiAodGVzdEltcG9ydFRzbGliKGNvbnRlbnQpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy5wdXNoKGdldEltcG9ydFRzbGliVHJhbnNmb3JtZXIpO1xuICB9XG5cbiAgaWYgKHRlc3RQcmVmaXhDbGFzc2VzKGNvbnRlbnQpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy5wdXNoKGdldFByZWZpeENsYXNzZXNUcmFuc2Zvcm1lcik7XG4gIH1cblxuICBpZiAoaW5wdXRGaWxlUGF0aFxuICAgICYmIHdoaXRlbGlzdGVkQW5ndWxhck1vZHVsZXMuc29tZSgocmUpID0+IHJlLnRlc3QoaW5wdXRGaWxlUGF0aCkpXG4gICAgJiYgZXM1QW5ndWxhck1vZHVsZXMuc29tZSgocmUpID0+IHJlLnRlc3QoaW5wdXRGaWxlUGF0aCkpXG4gICkge1xuICAgIGdldFRyYW5zZm9ybXMucHVzaChcbiAgICAgIC8vIGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyIGlzIHJhdGhlciBkYW5nZXJvdXMsIGFwcGx5IG9ubHkgdG8ga25vd24gcHVyZSBlczUgbW9kdWxlcy5cbiAgICAgIC8vIEl0IHdpbGwgbWFyayBib3RoIGByZXF1aXJlKClgIGNhbGxzIGFuZCBgY29uc29sZS5sb2coc3R1ZmYpYCBhcyBwdXJlLlxuICAgICAgLy8gV2Ugb25seSBhcHBseSBpdCB0byB3aGl0ZWxpc3RlZCBtb2R1bGVzLCBzaW5jZSB3ZSBrbm93IHRoZXkgYXJlIHNhZmUuXG4gICAgICAvLyBnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lciBuZWVkcyB0byBiZSBiZWZvcmUgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lci5cbiAgICAgIGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyLFxuICAgICAgZ2V0U2NydWJGaWxlVHJhbnNmb3JtZXIsXG4gICAgICBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyLFxuICAgICk7XG4gIH0gZWxzZSBpZiAodGVzdFNjcnViRmlsZShjb250ZW50KSkge1xuICAgIGdldFRyYW5zZm9ybXMucHVzaChcbiAgICAgIGdldFNjcnViRmlsZVRyYW5zZm9ybWVyLFxuICAgICAgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lcixcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHRyYW5zZm9ybUphdmFzY3JpcHQoeyAuLi5vcHRpb25zLCBnZXRUcmFuc2Zvcm1zLCBjb250ZW50IH0pO1xufVxuIl19