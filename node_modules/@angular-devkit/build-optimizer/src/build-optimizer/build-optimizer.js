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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtb3B0aW1pemVyLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL2J1aWxkLW9wdGltaXplci9idWlsZC1vcHRpbWl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwyQkFBa0M7QUFDbEMsMEVBSXlDO0FBQ3pDLHlEQUFrRTtBQUNsRSw2REFBd0Y7QUFDeEYsaUVBQThGO0FBQzlGLHFFQUErRTtBQUMvRSx5REFBa0Y7QUFDbEYseURBQWtGO0FBR2xGLHNEQUFzRDtBQUN0RCxNQUFNLHlCQUF5QixHQUFHO0lBQ2hDLG9EQUFvRDtJQUNwRCxnREFBZ0Q7SUFDaEQsa0RBQWtEO0lBQ2xELDhDQUE4QztJQUM5QywrQ0FBK0M7SUFDL0MsOENBQThDO0lBQzlDLGtFQUFrRTtJQUNsRSwwREFBMEQ7SUFDMUQsb0VBQW9FO0lBQ3BFLDREQUE0RDtJQUM1RCxnREFBZ0Q7SUFDaEQsaURBQWlEO0lBQ2pELGtEQUFrRDtJQUNsRCw2Q0FBNkM7Q0FDOUMsQ0FBQztBQUVGLE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsMkRBQTJEO0lBQzNELFlBQVk7SUFDWiw4QkFBOEI7SUFDOUIsMERBQTBEO0lBQzFELDBDQUEwQztJQUMxQyxZQUFZO0NBQ2IsQ0FBQztBQUVGLG1GQUFtRjtBQUNuRix5RkFBeUY7QUFDekYsTUFBTSxXQUFXLEdBQUc7SUFDbEIsb0JBQW9CO0lBQ3BCLGtCQUFrQjtDQUNuQixDQUFDO0FBRUYsK0JBQStCLFFBQWdCO0lBQzdDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FDcEQseUJBQXlCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxD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QkFBdUIsR0FBK0I7UUFDMUQsT0FBTyxFQUFFLE9BQU87UUFDaEIsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO1FBQ3BDLGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYztRQUN0QyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7UUFDcEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3RCLGFBQWE7UUFDYixTQUFTO0tBQ1YsQ0FBQztJQUVGLE1BQU0sQ0FBQywwQ0FBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFsRkQsd0NBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHtcbiAgVHJhbnNmb3JtSmF2YXNjcmlwdE9wdGlvbnMsXG4gIFRyYW5zZm9ybUphdmFzY3JpcHRPdXRwdXQsXG4gIHRyYW5zZm9ybUphdmFzY3JpcHQsXG59IGZyb20gJy4uL2hlbHBlcnMvdHJhbnNmb3JtLWphdmFzY3JpcHQnO1xuaW1wb3J0IHsgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lciB9IGZyb20gJy4uL3RyYW5zZm9ybXMvY2xhc3MtZm9sZCc7XG5pbXBvcnQgeyBnZXRJbXBvcnRUc2xpYlRyYW5zZm9ybWVyLCB0ZXN0SW1wb3J0VHNsaWIgfSBmcm9tICcuLi90cmFuc2Zvcm1zL2ltcG9ydC10c2xpYic7XG5pbXBvcnQgeyBnZXRQcmVmaXhDbGFzc2VzVHJhbnNmb3JtZXIsIHRlc3RQcmVmaXhDbGFzc2VzIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9wcmVmaXgtY2xhc3Nlcyc7XG5pbXBvcnQgeyBnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lciB9IGZyb20gJy4uL3RyYW5zZm9ybXMvcHJlZml4LWZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBnZXRTY3J1YkZpbGVUcmFuc2Zvcm1lciwgdGVzdFNjcnViRmlsZSB9IGZyb20gJy4uL3RyYW5zZm9ybXMvc2NydWItZmlsZSc7XG5pbXBvcnQgeyBnZXRXcmFwRW51bXNUcmFuc2Zvcm1lciwgdGVzdFdyYXBFbnVtcyB9IGZyb20gJy4uL3RyYW5zZm9ybXMvd3JhcC1lbnVtcyc7XG5cblxuLy8gQW5ndWxhciBwYWNrYWdlcyBhcmUga25vd24gdG8gaGF2ZSBubyBzaWRlIGVmZmVjdHMuXG5jb25zdCB3aGl0ZWxpc3RlZEFuZ3VsYXJNb2R1bGVzID0gW1xuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11hbmltYXRpb25zW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWNvbW1vbltcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11jb21waWxlcltcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL11jb3JlW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWZvcm1zW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWh0dHBbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXXBsYXRmb3JtLWJyb3dzZXJbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcGxhdGZvcm0td2Vid29ya2VyLWR5bmFtaWNbXFxcXC9dLyxcbiAgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQGFuZ3VsYXJbXFxcXC9dcGxhdGZvcm0td2Vid29ya2VyW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXXJvdXRlcltcXFxcL10vLFxuICAvW1xcXFwvXW5vZGVfbW9kdWxlc1tcXFxcL11AYW5ndWxhcltcXFxcL111cGdyYWRlW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXW1hdGVyaWFsW1xcXFwvXS8sXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXWNka1tcXFxcL10vLFxuXTtcblxuY29uc3QgZXM1QW5ndWxhck1vZHVsZXMgPSBbXG4gIC8vIEFuZ3VsYXIgNCBwYWNrYWdpbmcgZm9ybWF0IGhhcyAuZXM1LmpzIGFzIHRoZSBleHRlbnNpb24uXG4gIC9cXC5lczVcXC5qcyQvLCAvLyBBbmd1bGFyIDRcbiAgLy8gQW5ndWxhciA1IGhhcyBlc201IGZvbGRlcnMuXG4gIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUBhbmd1bGFyW1xcXFwvXVteXFxcXC9dK1tcXFxcL11lc201W1xcXFwvXS8sXG4gIC8vIEFsbCBBbmd1bGFyIHZlcnNpb25zIGhhdmUgVU1EIHdpdGggZXM1LlxuICAvXFwudW1kXFwuanMkLyxcbl07XG5cbi8vIEZhY3RvcmllcyBjcmVhdGVkIGJ5IEFPVCBhcmUga25vd24gdG8gaGF2ZSBubyBzaWRlIGVmZmVjdHMgYW5kIGNvbnRhaW4gZXM1IGNvZGUuXG4vLyBJbiBBbmd1bGFyIDIvNCB0aGUgZmlsZSBwYXRoIGZvciBmYWN0b3JpZXMgY2FuIGJlIGAudHNgLCBidXQgaW4gQW5ndWxhciA1IGl0IGlzIGAuanNgLlxuY29uc3QgbmdGYWN0b3JpZXMgPSBbXG4gIC9cXC5uZ2ZhY3RvcnlcXC5banRdcy8sXG4gIC9cXC5uZ3N0eWxlXFwuW2p0XXMvLFxuXTtcblxuZnVuY3Rpb24gaXNLbm93blNpZGVFZmZlY3RGcmVlKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5nRmFjdG9yaWVzLnNvbWUoKHJlKSA9PiByZS50ZXN0KGZpbGVQYXRoKSkgfHwgKFxuICAgIHdoaXRlbGlzdGVkQW5ndWxhck1vZHVsZXMuc29tZSgocmUpID0+IHJlLnRlc3QoZmlsZVBhdGgpKVxuICAgICYmIGVzNUFuZ3VsYXJNb2R1bGVzLnNvbWUoKHJlKSA9PiByZS50ZXN0KGZpbGVQYXRoKSlcbiAgKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCdWlsZE9wdGltaXplck9wdGlvbnMge1xuICBjb250ZW50Pzogc3RyaW5nO1xuICBvcmlnaW5hbEZpbGVQYXRoPzogc3RyaW5nO1xuICBpbnB1dEZpbGVQYXRoPzogc3RyaW5nO1xuICBvdXRwdXRGaWxlUGF0aD86IHN0cmluZztcbiAgZW1pdFNvdXJjZU1hcD86IGJvb2xlYW47XG4gIHN0cmljdD86IGJvb2xlYW47XG4gIGlzU2lkZUVmZmVjdEZyZWU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRPcHRpbWl6ZXIob3B0aW9uczogQnVpbGRPcHRpbWl6ZXJPcHRpb25zKTogVHJhbnNmb3JtSmF2YXNjcmlwdE91dHB1dCB7XG5cbiAgY29uc3QgeyBpbnB1dEZpbGVQYXRoIH0gPSBvcHRpb25zO1xuICBsZXQgeyBvcmlnaW5hbEZpbGVQYXRoLCBjb250ZW50IH0gPSBvcHRpb25zO1xuXG4gIGlmICghb3JpZ2luYWxGaWxlUGF0aCAmJiBpbnB1dEZpbGVQYXRoKSB7XG4gICAgb3JpZ2luYWxGaWxlUGF0aCA9IGlucHV0RmlsZVBhdGg7XG4gIH1cblxuICBpZiAoIWlucHV0RmlsZVBhdGggJiYgY29udGVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFaXRoZXIgZmlsZVBhdGggb3IgY29udGVudCBtdXN0IGJlIHNwZWNpZmllZCBpbiBvcHRpb25zLicpO1xuICB9XG5cbiAgaWYgKGNvbnRlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnRlbnQgPSByZWFkRmlsZVN5bmMoaW5wdXRGaWxlUGF0aCBhcyBzdHJpbmcsICdVVEYtOCcpO1xuICB9XG5cbiAgaWYgKCFjb250ZW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IG51bGwsXG4gICAgICBzb3VyY2VNYXA6IG51bGwsXG4gICAgICBlbWl0U2tpcHBlZDogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgaXNXZWJwYWNrQnVuZGxlID0gY29udGVudC5pbmRleE9mKCdfX3dlYnBhY2tfcmVxdWlyZV9fJykgIT09IC0xO1xuXG4gIC8vIERldGVybWluZSB3aGljaCB0cmFuc2Zvcm1zIHRvIGFwcGx5LlxuICBjb25zdCBnZXRUcmFuc2Zvcm1zID0gW107XG5cbiAgbGV0IHR5cGVDaGVjayA9IGZhbHNlO1xuICBpZiAob3B0aW9ucy5pc1NpZGVFZmZlY3RGcmVlIHx8IG9yaWdpbmFsRmlsZVBhdGggJiYgaXNLbm93blNpZGVFZmZlY3RGcmVlKG9yaWdpbmFsRmlsZVBhdGgpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy5wdXNoKFxuICAgICAgLy8gZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIgaXMgcmF0aGVyIGRhbmdlcm91cywgYXBwbHkgb25seSB0byBrbm93biBwdXJlIGVzNSBtb2R1bGVzLlxuICAgICAgLy8gSXQgd2lsbCBtYXJrIGJvdGggYHJlcXVpcmUoKWAgY2FsbHMgYW5kIGBjb25zb2xlLmxvZyhzdHVmZilgIGFzIHB1cmUuXG4gICAgICAvLyBXZSBvbmx5IGFwcGx5IGl0IHRvIHdoaXRlbGlzdGVkIG1vZHVsZXMsIHNpbmNlIHdlIGtub3cgdGhleSBhcmUgc2FmZS5cbiAgICAgIC8vIGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyIG5lZWRzIHRvIGJlIGJlZm9yZSBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyLlxuICAgICAgZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIsXG4gICAgICBnZXRTY3J1YkZpbGVUcmFuc2Zvcm1lcixcbiAgICAgIGdldEZvbGRGaWxlVHJhbnNmb3JtZXIsXG4gICAgKTtcbiAgICB0eXBlQ2hlY2sgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHRlc3RTY3J1YkZpbGUoY29udGVudCkpIHtcbiAgICAvLyBBbHdheXMgdGVzdCBhcyB0aGVzZSByZXF1aXJlIHRoZSB0eXBlIGNoZWNrZXJcbiAgICBnZXRUcmFuc2Zvcm1zLnB1c2goXG4gICAgICBnZXRTY3J1YkZpbGVUcmFuc2Zvcm1lcixcbiAgICAgIGdldEZvbGRGaWxlVHJhbnNmb3JtZXIsXG4gICAgKTtcbiAgICB0eXBlQ2hlY2sgPSB0cnVlO1xuICB9XG5cbiAgLy8gdGVzdHMgYXJlIG5vdCBuZWVkZWQgZm9yIGZhc3QgcGF0aFxuICAvLyB1c2FnZSB3aWxsIGJlIGV4cGFuZGVkIG9uY2UgdHJhbnNmb3JtZXJzIGFyZSB2ZXJpZmllZCBzYWZlXG4gIGNvbnN0IGlnbm9yZVRlc3QgPSAhb3B0aW9ucy5lbWl0U291cmNlTWFwICYmICF0eXBlQ2hlY2s7XG5cbiAgaWYgKHRlc3RQcmVmaXhDbGFzc2VzKGNvbnRlbnQpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy51bnNoaWZ0KGdldFByZWZpeENsYXNzZXNUcmFuc2Zvcm1lcik7XG4gIH1cblxuICAvLyBUaGlzIHRyYW5zZm9ybSBpbnRyb2R1Y2VzIGltcG9ydC9yZXF1aXJlKCkgY2FsbHMsIGJ1dCB0aGlzIHdvbid0IHdvcmsgcHJvcGVybHkgb24gbGlicmFyaWVzXG4gIC8vIGJ1aWx0IHdpdGggV2VicGFjay4gVGhlc2UgbGlicmFyaWVzIHVzZSBfX3dlYnBhY2tfcmVxdWlyZV9fKCkgY2FsbHMgaW5zdGVhZCwgd2hpY2ggd2lsbCBicmVha1xuICAvLyB3aXRoIGEgbmV3IGltcG9ydCB0aGF0IHdhc24ndCBwYXJ0IG9mIGl0J3Mgb3JpZ2luYWwgbW9kdWxlIGxpc3QuXG4gIC8vIFdlIGlnbm9yZSB0aGlzIHRyYW5zZm9ybSBmb3Igc3VjaCBsaWJyYXJpZXMuXG4gIGlmICghaXNXZWJwYWNrQnVuZGxlICYmIChpZ25vcmVUZXN0IHx8IHRlc3RJbXBvcnRUc2xpYihjb250ZW50KSkpIHtcbiAgICBnZXRUcmFuc2Zvcm1zLnVuc2hpZnQoZ2V0SW1wb3J0VHNsaWJUcmFuc2Zvcm1lcik7XG4gIH1cblxuICBpZiAodGVzdFdyYXBFbnVtcyhjb250ZW50KSkge1xuICAgIGdldFRyYW5zZm9ybXMudW5zaGlmdChnZXRXcmFwRW51bXNUcmFuc2Zvcm1lcik7XG4gIH1cblxuICBjb25zdCB0cmFuc2Zvcm1KYXZhc2NyaXB0T3B0czogVHJhbnNmb3JtSmF2YXNjcmlwdE9wdGlvbnMgPSB7XG4gICAgY29udGVudDogY29udGVudCxcbiAgICBpbnB1dEZpbGVQYXRoOiBvcHRpb25zLmlucHV0RmlsZVBhdGgsXG4gICAgb3V0cHV0RmlsZVBhdGg6IG9wdGlvbnMub3V0cHV0RmlsZVBhdGgsXG4gICAgZW1pdFNvdXJjZU1hcDogb3B0aW9ucy5lbWl0U291cmNlTWFwLFxuICAgIHN0cmljdDogb3B0aW9ucy5zdHJpY3QsXG4gICAgZ2V0VHJhbnNmb3JtcyxcbiAgICB0eXBlQ2hlY2ssXG4gIH07XG5cbiAgcmV0dXJuIHRyYW5zZm9ybUphdmFzY3JpcHQodHJhbnNmb3JtSmF2YXNjcmlwdE9wdHMpO1xufVxuIl19