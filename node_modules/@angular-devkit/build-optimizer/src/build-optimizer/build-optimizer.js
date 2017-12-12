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
    if (options.isSideEffectFree || originalFilePath && isKnownSideEffectFree(originalFilePath)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtb3B0aW1pemVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvYnVpbGQtb3B0aW1pemVyL2J1aWxkLW9wdGltaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDJCQUFrQztBQUNsQywwRUFJeUM7QUFDekMseURBQWtFO0FBQ2xFLDZEQUF3RjtBQUN4RixpRUFBOEY7QUFDOUYscUVBQStFO0FBQy9FLHlEQUFrRjtBQUNsRix5REFBa0Y7QUFHbEYsc0RBQXNEO0FBQ3RELE1BQU0seUJBQXlCLEdBQUc7SUFDaEMsb0RBQW9EO0lBQ3BELGdEQUFnRDtJQUNoRCxrREFBa0Q7SUFDbEQsOENBQThDO0lBQzlDLCtDQUErQztJQUMvQyw4Q0FBOEM7SUFDOUMsa0VBQWtFO0lBQ2xFLDBEQUEwRDtJQUMxRCxvRUFBb0U7SUFDcEUsNERBQTREO0lBQzVELGdEQUFnRDtJQUNoRCxpREFBaUQ7SUFDakQsa0RBQWtEO0lBQ2xELDZDQUE2QztDQUM5QyxDQUFDO0FBRUYsTUFBTSxpQkFBaUIsR0FBRztJQUN4QiwyREFBMkQ7SUFDM0QsWUFBWTtJQUNaLDhCQUE4QjtJQUM5QiwwREFBMEQ7SUFDMUQsMENBQTBDO0lBQzFDLFlBQVk7Q0FDYixDQUFDO0FBRUYsbUZBQW1GO0FBQ25GLHlGQUF5RjtBQUN6RixNQUFNLFdBQVcsR0FBRztJQUNsQixvQkFBb0I7SUFDcEIsa0JBQWtCO0NBQ25CLENBQUM7QUFFRiwrQkFBK0IsUUFBZ0I7SUFDN0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQ3BELHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1dBQ3RELGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQ3JELENBQUM7QUFDSixDQUFDO0FBWUQsd0JBQStCLE9BQThCO0lBRTNELE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFDbEMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUU1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDdkMsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO0lBQ25DLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sR0FBRyxpQkFBWSxDQUFDLGFBQXVCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFFekIsRUFBRSxDQUFDLENBQUMsMEJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsYUFBYSxDQUFDLElBQUksQ0FBQyxvQ0FBdUIsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyw4QkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixhQUFhLENBQUMsSUFBSSxDQUFDLHdDQUF5QixDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLGtDQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixhQUFhLENBQUMsSUFBSSxDQUFDLDRDQUEyQixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxnQkFBZ0IsSUFBSSxxQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RixhQUFhLENBQUMsSUFBSTtRQUNoQiwyRkFBMkY7UUFDM0Ysd0VBQXdFO1FBQ3hFLHdFQUF3RTtRQUN4RSwyRUFBMkU7UUFDM0UsZ0RBQTZCLEVBQzdCLG9DQUF1QixFQUN2QixtQ0FBc0IsQ0FDdkIsQ0FBQztJQUNKLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsMEJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsYUFBYSxDQUFDLElBQUksQ0FDaEIsb0NBQXVCLEVBQ3ZCLG1DQUFzQixDQUN2QixDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sdUJBQXVCLEdBQStCO1FBQzFELE9BQU8sRUFBRSxPQUFPO1FBQ2hCLGFBQWEsRUFBRSxPQUFPLENBQUMsYUFBYTtRQUNwQyxjQUFjLEVBQUUsT0FBTyxDQUFDLGNBQWM7UUFDdEMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO1FBQ3BDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtRQUN0QixhQUFhO0tBQ2QsQ0FBQztJQUVGLE1BQU0sQ0FBQywwQ0FBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUEzREQsd0NBMkRDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHtcbiAgVHJhbnNmb3JtSmF2YXNjcmlwdE9wdGlvbnMsXG4gIFRyYW5zZm9ybUphdmFzY3JpcHRPdXRwdXQsXG4gIHRyYW5zZm9ybUphdmFzY3JpcHQsXG59IGZyb20gJy4uL2hlbHBlcnMvdHJhbnNmb3JtLWphdmFzY3JpcHQnO1xuaW1wb3J0IHsgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lciB9IGZyb20gJy4uL3RyYW5zZm9ybXMvY2xhc3MtZm9sZCc7XG5pbXBvcnQgeyBnZXRJbXBvcnRUc2xpYlRyYW5zZm9ybWVyLCB0ZXN0SW1wb3J0VHNsaWIgfSBmcm9tICcuLi90cmFuc2Zvcm1zL2ltcG9ydC10c2xpYic7XG5pbXBvcnQgeyBnZXRQcmVmaXhDbGFzc2VzVHJhbnNmb3JtZXIsIHRlc3RQcmVmaXhDbGFzc2VzIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9wcmVmaXgtY2xhc3Nlcyc7XG5pbXBvcnQgeyBnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lciB9IGZyb20gJy4uL3RyYW5zZm9ybXMvcHJlZml4LWZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBnZXRTY3J1YkZpbGVUcmFuc2Zvcm1lciwgdGVzdFNjcnViRmlsZSB9IGZyb20gJy4uL3RyYW5zZm9ybXMvc2NydWItZmlsZSc7XG5pbXBvcnQgeyBnZXRXcmFwRW51bXNUcmFuc2Zvcm1lciwgdGVzdFdyYXBFbnVtcyB9IGZyb20gJy4uL3RyYW5zZm9ybXMvd3JhcC1lbnVtcyc7XG5cblxuLy8gQW5ndWxhciBwYWNrYWdlcyBhcmUga25vd24gdG8gaGF2ZSBubyBzaWRlIGVmZmVjdHMuXG5jb25zdCB3aGl0ZWxpc3RlZEFuZ3VsYXJNb2R1bGVzID0gW1xuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11hbmltYXRpb25zW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWNvbW1vbltcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11jb21waWxlcltcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11jb3JlW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWZvcm1zW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWh0dHBbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXXBsYXRmb3JtLWJyb3dzZXJbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcGxhdGZvcm0td2Vid29ya2VyLWR5bmFtaWNbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcGxhdGZvcm0td2Vid29ya2VyW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXXJvdXRlcltcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL111cGdyYWRlW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXW1hdGVyaWFsW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWNka1tcXFxcL10vLFxuXTtcblxuY29uc3QgZXM1QW5ndWxhck1vZHVsZXMgPSBbXG4gIC8vIEFuZ3VsYXIgNCBwYWNrYWdpbmcgZm9ybWF0IGhhcyAuZXM1LmpzIGFzIHRoZSBleHRlbnNpb24uXG4gIC9cXC5lczVcXC5qcyQvLCAvLyBBbmd1bGFyIDRcbiAgLy8gQW5ndWxhciA1IGhhcyBlc201IGZvbGRlcnMuXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXVteXFxcXC9dK1tcXFxcL11lc201W1xcXFwvXS8sXG4gIC8vIEFsbCBBbmd1bGFyIHZlcnNpb25zIGhhdmUgVU1EIHdpdGggZXM1LlxuICAvXFwudW1kXFwuanMkLyxcbl07XG5cbi8vIEZhY3RvcmllcyBjcmVhdGVkIGJ5IEFPVCBhcmUga25vd24gdG8gaGF2ZSBubyBzaWRlIGVmZmVjdHMgYW5kIGNvbnRhaW4gZXM1IGNvZGUuXG4vLyBJbiBBbmd1bGFyIDIvNCB0aGUgZmlsZSBwYXRoIGZvciBmYWN0b3JpZXMgY2FuIGJlIGAudHNgLCBidXQgaW4gQW5ndWxhciA1IGl0IGlzIGAuanNgLlxuY29uc3QgbmdGYWN0b3JpZXMgPSBbXG4gIC9cXC5uZ2ZhY3RvcnlcXC5banRdcy8sXG4gIC9cXC5uZ3N0eWxlXFwuW2p0XXMvLFxuXTtcblxuZnVuY3Rpb24gaXNLbm93blNpZGVFZmZlY3RGcmVlKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5nRmFjdG9yaWVzLnNvbWUoKHJlKSA9PiByZS50ZXN0KGZpbGVQYXRoKSkgfHwgKFxuICAgIHdoaXRlbGlzdGVkQW5ndWxhck1vZHVsZXMuc29tZSgocmUpID0+IHJlLnRlc3QoZmlsZVBhdGgpKVxuICAgICYmIGVzNUFuZ3VsYXJNb2R1bGVzLnNvbWUoKHJlKSA9PiByZS50ZXN0KGZpbGVQYXRoKSlcbiAgKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCdWlsZE9wdGltaXplck9wdGlvbnMge1xuICBjb250ZW50Pzogc3RyaW5nO1xuICBvcmlnaW5hbEZpbGVQYXRoPzogc3RyaW5nO1xuICBpbnB1dEZpbGVQYXRoPzogc3RyaW5nO1xuICBvdXRwdXRGaWxlUGF0aD86IHN0cmluZztcbiAgZW1pdFNvdXJjZU1hcD86IGJvb2xlYW47XG4gIHN0cmljdD86IGJvb2xlYW47XG4gIGlzU2lkZUVmZmVjdEZyZWU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRPcHRpbWl6ZXIob3B0aW9uczogQnVpbGRPcHRpbWl6ZXJPcHRpb25zKTogVHJhbnNmb3JtSmF2YXNjcmlwdE91dHB1dCB7XG5cbiAgY29uc3QgeyBpbnB1dEZpbGVQYXRoIH0gPSBvcHRpb25zO1xuICBsZXQgeyBvcmlnaW5hbEZpbGVQYXRoLCBjb250ZW50IH0gPSBvcHRpb25zO1xuXG4gIGlmICghb3JpZ2luYWxGaWxlUGF0aCAmJiBpbnB1dEZpbGVQYXRoKSB7XG4gICAgb3JpZ2luYWxGaWxlUGF0aCA9IGlucHV0RmlsZVBhdGg7XG4gIH1cblxuICBpZiAoIWlucHV0RmlsZVBhdGggJiYgY29udGVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFaXRoZXIgZmlsZVBhdGggb3IgY29udGVudCBtdXN0IGJlIHNwZWNpZmllZCBpbiBvcHRpb25zLicpO1xuICB9XG5cbiAgaWYgKGNvbnRlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnRlbnQgPSByZWFkRmlsZVN5bmMoaW5wdXRGaWxlUGF0aCBhcyBzdHJpbmcsICdVVEYtOCcpO1xuICB9XG5cbiAgLy8gRGV0ZXJtaW5lIHdoaWNoIHRyYW5zZm9ybXMgdG8gYXBwbHkuXG4gIGNvbnN0IGdldFRyYW5zZm9ybXMgPSBbXTtcblxuICBpZiAodGVzdFdyYXBFbnVtcyhjb250ZW50KSkge1xuICAgIGdldFRyYW5zZm9ybXMucHVzaChnZXRXcmFwRW51bXNUcmFuc2Zvcm1lcik7XG4gIH1cblxuICBpZiAodGVzdEltcG9ydFRzbGliKGNvbnRlbnQpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy5wdXNoKGdldEltcG9ydFRzbGliVHJhbnNmb3JtZXIpO1xuICB9XG5cbiAgaWYgKHRlc3RQcmVmaXhDbGFzc2VzKGNvbnRlbnQpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy5wdXNoKGdldFByZWZpeENsYXNzZXNUcmFuc2Zvcm1lcik7XG4gIH1cblxuICBpZiAob3B0aW9ucy5pc1NpZGVFZmZlY3RGcmVlIHx8IG9yaWdpbmFsRmlsZVBhdGggJiYgaXNLbm93blNpZGVFZmZlY3RGcmVlKG9yaWdpbmFsRmlsZVBhdGgpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy5wdXNoKFxuICAgICAgLy8gZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIgaXMgcmF0aGVyIGRhbmdlcm91cywgYXBwbHkgb25seSB0byBrbm93biBwdXJlIGVzNSBtb2R1bGVzLlxuICAgICAgLy8gSXQgd2lsbCBtYXJrIGJvdGggYHJlcXVpcmUoKWAgY2FsbHMgYW5kIGBjb25zb2xlLmxvZyhzdHVmZilgIGFzIHB1cmUuXG4gICAgICAvLyBXZSBvbmx5IGFwcGx5IGl0IHRvIHdoaXRlbGlzdGVkIG1vZHVsZXMsIHNpbmNlIHdlIGtub3cgdGhleSBhcmUgc2FmZS5cbiAgICAgIC8vIGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyIG5lZWRzIHRvIGJlIGJlZm9yZSBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyLlxuICAgICAgZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIsXG4gICAgICBnZXRTY3J1YkZpbGVUcmFuc2Zvcm1lcixcbiAgICAgIGdldEZvbGRGaWxlVHJhbnNmb3JtZXIsXG4gICAgKTtcbiAgfSBlbHNlIGlmICh0ZXN0U2NydWJGaWxlKGNvbnRlbnQpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy5wdXNoKFxuICAgICAgZ2V0U2NydWJGaWxlVHJhbnNmb3JtZXIsXG4gICAgICBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyLFxuICAgICk7XG4gIH1cblxuICBjb25zdCB0cmFuc2Zvcm1KYXZhc2NyaXB0T3B0czogVHJhbnNmb3JtSmF2YXNjcmlwdE9wdGlvbnMgPSB7XG4gICAgY29udGVudDogY29udGVudCxcbiAgICBpbnB1dEZpbGVQYXRoOiBvcHRpb25zLmlucHV0RmlsZVBhdGgsXG4gICAgb3V0cHV0RmlsZVBhdGg6IG9wdGlvbnMub3V0cHV0RmlsZVBhdGgsXG4gICAgZW1pdFNvdXJjZU1hcDogb3B0aW9ucy5lbWl0U291cmNlTWFwLFxuICAgIHN0cmljdDogb3B0aW9ucy5zdHJpY3QsXG4gICAgZ2V0VHJhbnNmb3JtcyxcbiAgfTtcblxuICByZXR1cm4gdHJhbnNmb3JtSmF2YXNjcmlwdCh0cmFuc2Zvcm1KYXZhc2NyaXB0T3B0cyk7XG59XG4iXX0=