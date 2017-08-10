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
const prefix_functions_1 = require("../transforms/prefix-functions");
const scrub_file_1 = require("../transforms/scrub-file");
const hasDecorators = /decorators/;
const hasCtorParameters = /ctorParameters/;
const hasTsHelpers = /var (__extends|__decorate|__metadata|__param) = /;
const isAngularModuleFile = /\.es5\.js$/;
const whitelistedAngularModules = [
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)animations(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)common(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)compiler(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)core(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)forms(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)http(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)platform-browser-dynamic(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)platform-browser(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)platform-webworker-dynamic(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)platform-webworker(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)router(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)upgrade(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)material(\\|\/)/,
    /(\\|\/)node_modules(\\|\/)@angular(\\|\/)cdk(\\|\/)/,
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
    if (hasTsHelpers.test(content)) {
        getTransforms.push(import_tslib_1.getImportTslibTransformer);
    }
    if (inputFilePath
        && isAngularModuleFile.test(inputFilePath)
        && whitelistedAngularModules.some((re) => re.test(inputFilePath))) {
        getTransforms.push(
        // getPrefixFunctionsTransformer is rather dangerous, apply only to known pure modules.
        // It will mark both `require()` calls and `console.log(stuff)` as pure.
        // We only apply it to whitelisted modules, since we know they are safe.
        // getPrefixFunctionsTransformer needs to be before getFoldFileTransformer.
        prefix_functions_1.getPrefixFunctionsTransformer, scrub_file_1.getScrubFileTransformer, class_fold_1.getFoldFileTransformer);
    }
    else if (hasDecorators.test(content) || hasCtorParameters.test(content)) {
        getTransforms.push(scrub_file_1.getScrubFileTransformer, class_fold_1.getFoldFileTransformer);
    }
    return transform_javascript_1.transformJavascript(Object.assign({}, options, { getTransforms, content }));
}
exports.buildOptimizer = buildOptimizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtb3B0aW1pemVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvYnVpbGQtb3B0aW1pemVyL2J1aWxkLW9wdGltaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDJCQUFrQztBQUNsQywwRUFBaUc7QUFDakcseURBQWtFO0FBQ2xFLDZEQUF1RTtBQUN2RSxxRUFBK0U7QUFDL0UseURBQW1FO0FBR25FLE1BQU0sYUFBYSxHQUFHLFlBQVksQ0FBQztBQUNuQyxNQUFNLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO0FBQzNDLE1BQU0sWUFBWSxHQUFHLGtEQUFrRCxDQUFDO0FBQ3hFLE1BQU0sbUJBQW1CLEdBQUcsWUFBWSxDQUFDO0FBQ3pDLE1BQU0seUJBQXlCLEdBQUc7SUFDaEMsNERBQTREO0lBQzVELHdEQUF3RDtJQUN4RCwwREFBMEQ7SUFDMUQsc0RBQXNEO0lBQ3RELHVEQUF1RDtJQUN2RCxzREFBc0Q7SUFDdEQsMEVBQTBFO0lBQzFFLGtFQUFrRTtJQUNsRSw0RUFBNEU7SUFDNUUsb0VBQW9FO0lBQ3BFLHdEQUF3RDtJQUN4RCx5REFBeUQ7SUFDekQsMERBQTBEO0lBQzFELHFEQUFxRDtDQUN0RCxDQUFDO0FBVUYsd0JBQStCLE9BQThCO0lBRTNELE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFDbEMsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUUxQixFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sR0FBRyxpQkFBWSxDQUFDLGFBQXVCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFFekIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsYUFBYSxDQUFDLElBQUksQ0FBQyx3Q0FBeUIsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxhQUFhO1dBQ1osbUJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztXQUN2Qyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FDbEUsQ0FBQyxDQUFDLENBQUM7UUFDRCxhQUFhLENBQUMsSUFBSTtRQUNoQix1RkFBdUY7UUFDdkYsd0VBQXdFO1FBQ3hFLHdFQUF3RTtRQUN4RSwyRUFBMkU7UUFDM0UsZ0RBQTZCLEVBQzdCLG9DQUF1QixFQUN2QixtQ0FBc0IsQ0FDdkIsQ0FBQztJQUNKLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFFLGFBQWEsQ0FBQyxJQUFJLENBQ2hCLG9DQUF1QixFQUN2QixtQ0FBc0IsQ0FDdkIsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLENBQUMsMENBQW1CLG1CQUFNLE9BQU8sSUFBRSxhQUFhLEVBQUUsT0FBTyxJQUFHLENBQUM7QUFDckUsQ0FBQztBQXpDRCx3Q0F5Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1KYXZhc2NyaXB0T3V0cHV0LCB0cmFuc2Zvcm1KYXZhc2NyaXB0IH0gZnJvbSAnLi4vaGVscGVycy90cmFuc2Zvcm0tamF2YXNjcmlwdCc7XG5pbXBvcnQgeyBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyIH0gZnJvbSAnLi4vdHJhbnNmb3Jtcy9jbGFzcy1mb2xkJztcbmltcG9ydCB7IGdldEltcG9ydFRzbGliVHJhbnNmb3JtZXIgfSBmcm9tICcuLi90cmFuc2Zvcm1zL2ltcG9ydC10c2xpYic7XG5pbXBvcnQgeyBnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lciB9IGZyb20gJy4uL3RyYW5zZm9ybXMvcHJlZml4LWZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBnZXRTY3J1YkZpbGVUcmFuc2Zvcm1lciB9IGZyb20gJy4uL3RyYW5zZm9ybXMvc2NydWItZmlsZSc7XG5cblxuY29uc3QgaGFzRGVjb3JhdG9ycyA9IC9kZWNvcmF0b3JzLztcbmNvbnN0IGhhc0N0b3JQYXJhbWV0ZXJzID0gL2N0b3JQYXJhbWV0ZXJzLztcbmNvbnN0IGhhc1RzSGVscGVycyA9IC92YXIgKF9fZXh0ZW5kc3xfX2RlY29yYXRlfF9fbWV0YWRhdGF8X19wYXJhbSkgPSAvO1xuY29uc3QgaXNBbmd1bGFyTW9kdWxlRmlsZSA9IC9cXC5lczVcXC5qcyQvO1xuY29uc3Qgd2hpdGVsaXN0ZWRBbmd1bGFyTW9kdWxlcyA9IFtcbiAgLyhcXFxcfFxcLylub2RlX21vZHVsZXMoXFxcXHxcXC8pQGFuZ3VsYXIoXFxcXHxcXC8pYW5pbWF0aW9ucyhcXFxcfFxcLykvLFxuICAvKFxcXFx8XFwvKW5vZGVfbW9kdWxlcyhcXFxcfFxcLylAYW5ndWxhcihcXFxcfFxcLyljb21tb24oXFxcXHxcXC8pLyxcbiAgLyhcXFxcfFxcLylub2RlX21vZHVsZXMoXFxcXHxcXC8pQGFuZ3VsYXIoXFxcXHxcXC8pY29tcGlsZXIoXFxcXHxcXC8pLyxcbiAgLyhcXFxcfFxcLylub2RlX21vZHVsZXMoXFxcXHxcXC8pQGFuZ3VsYXIoXFxcXHxcXC8pY29yZShcXFxcfFxcLykvLFxuICAvKFxcXFx8XFwvKW5vZGVfbW9kdWxlcyhcXFxcfFxcLylAYW5ndWxhcihcXFxcfFxcLylmb3JtcyhcXFxcfFxcLykvLFxuICAvKFxcXFx8XFwvKW5vZGVfbW9kdWxlcyhcXFxcfFxcLylAYW5ndWxhcihcXFxcfFxcLylodHRwKFxcXFx8XFwvKS8sXG4gIC8oXFxcXHxcXC8pbm9kZV9tb2R1bGVzKFxcXFx8XFwvKUBhbmd1bGFyKFxcXFx8XFwvKXBsYXRmb3JtLWJyb3dzZXItZHluYW1pYyhcXFxcfFxcLykvLFxuICAvKFxcXFx8XFwvKW5vZGVfbW9kdWxlcyhcXFxcfFxcLylAYW5ndWxhcihcXFxcfFxcLylwbGF0Zm9ybS1icm93c2VyKFxcXFx8XFwvKS8sXG4gIC8oXFxcXHxcXC8pbm9kZV9tb2R1bGVzKFxcXFx8XFwvKUBhbmd1bGFyKFxcXFx8XFwvKXBsYXRmb3JtLXdlYndvcmtlci1keW5hbWljKFxcXFx8XFwvKS8sXG4gIC8oXFxcXHxcXC8pbm9kZV9tb2R1bGVzKFxcXFx8XFwvKUBhbmd1bGFyKFxcXFx8XFwvKXBsYXRmb3JtLXdlYndvcmtlcihcXFxcfFxcLykvLFxuICAvKFxcXFx8XFwvKW5vZGVfbW9kdWxlcyhcXFxcfFxcLylAYW5ndWxhcihcXFxcfFxcLylyb3V0ZXIoXFxcXHxcXC8pLyxcbiAgLyhcXFxcfFxcLylub2RlX21vZHVsZXMoXFxcXHxcXC8pQGFuZ3VsYXIoXFxcXHxcXC8pdXBncmFkZShcXFxcfFxcLykvLFxuICAvKFxcXFx8XFwvKW5vZGVfbW9kdWxlcyhcXFxcfFxcLylAYW5ndWxhcihcXFxcfFxcLyltYXRlcmlhbChcXFxcfFxcLykvLFxuICAvKFxcXFx8XFwvKW5vZGVfbW9kdWxlcyhcXFxcfFxcLylAYW5ndWxhcihcXFxcfFxcLyljZGsoXFxcXHxcXC8pLyxcbl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnVpbGRPcHRpbWl6ZXJPcHRpb25zIHtcbiAgY29udGVudD86IHN0cmluZztcbiAgaW5wdXRGaWxlUGF0aD86IHN0cmluZztcbiAgb3V0cHV0RmlsZVBhdGg/OiBzdHJpbmc7XG4gIGVtaXRTb3VyY2VNYXA/OiBib29sZWFuO1xuICBzdHJpY3Q/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRPcHRpbWl6ZXIob3B0aW9uczogQnVpbGRPcHRpbWl6ZXJPcHRpb25zKTogVHJhbnNmb3JtSmF2YXNjcmlwdE91dHB1dCB7XG5cbiAgY29uc3QgeyBpbnB1dEZpbGVQYXRoIH0gPSBvcHRpb25zO1xuICBsZXQgeyBjb250ZW50IH0gPSBvcHRpb25zO1xuXG4gIGlmICghaW5wdXRGaWxlUGF0aCAmJiBjb250ZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VpdGhlciBmaWxlUGF0aCBvciBjb250ZW50IG11c3QgYmUgc3BlY2lmaWVkIGluIG9wdGlvbnMuJyk7XG4gIH1cblxuICBpZiAoY29udGVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29udGVudCA9IHJlYWRGaWxlU3luYyhpbnB1dEZpbGVQYXRoIGFzIHN0cmluZywgJ1VURi04Jyk7XG4gIH1cblxuICAvLyBEZXRlcm1pbmUgd2hpY2ggdHJhbnNmb3JtcyB0byBhcHBseS5cbiAgY29uc3QgZ2V0VHJhbnNmb3JtcyA9IFtdO1xuXG4gIGlmIChoYXNUc0hlbHBlcnMudGVzdChjb250ZW50KSkge1xuICAgIGdldFRyYW5zZm9ybXMucHVzaChnZXRJbXBvcnRUc2xpYlRyYW5zZm9ybWVyKTtcbiAgfVxuXG4gIGlmIChpbnB1dEZpbGVQYXRoXG4gICAgJiYgaXNBbmd1bGFyTW9kdWxlRmlsZS50ZXN0KGlucHV0RmlsZVBhdGgpXG4gICAgJiYgd2hpdGVsaXN0ZWRBbmd1bGFyTW9kdWxlcy5zb21lKChyZSkgPT4gcmUudGVzdChpbnB1dEZpbGVQYXRoKSlcbiAgKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy5wdXNoKFxuICAgICAgLy8gZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIgaXMgcmF0aGVyIGRhbmdlcm91cywgYXBwbHkgb25seSB0byBrbm93biBwdXJlIG1vZHVsZXMuXG4gICAgICAvLyBJdCB3aWxsIG1hcmsgYm90aCBgcmVxdWlyZSgpYCBjYWxscyBhbmQgYGNvbnNvbGUubG9nKHN0dWZmKWAgYXMgcHVyZS5cbiAgICAgIC8vIFdlIG9ubHkgYXBwbHkgaXQgdG8gd2hpdGVsaXN0ZWQgbW9kdWxlcywgc2luY2Ugd2Uga25vdyB0aGV5IGFyZSBzYWZlLlxuICAgICAgLy8gZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIgbmVlZHMgdG8gYmUgYmVmb3JlIGdldEZvbGRGaWxlVHJhbnNmb3JtZXIuXG4gICAgICBnZXRQcmVmaXhGdW5jdGlvbnNUcmFuc2Zvcm1lcixcbiAgICAgIGdldFNjcnViRmlsZVRyYW5zZm9ybWVyLFxuICAgICAgZ2V0Rm9sZEZpbGVUcmFuc2Zvcm1lcixcbiAgICApO1xuICB9IGVsc2UgaWYgKGhhc0RlY29yYXRvcnMudGVzdChjb250ZW50KSB8fCBoYXNDdG9yUGFyYW1ldGVycy50ZXN0KGNvbnRlbnQpKSB7XG4gICAgZ2V0VHJhbnNmb3Jtcy5wdXNoKFxuICAgICAgZ2V0U2NydWJGaWxlVHJhbnNmb3JtZXIsXG4gICAgICBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gdHJhbnNmb3JtSmF2YXNjcmlwdCh7IC4uLm9wdGlvbnMsIGdldFRyYW5zZm9ybXMsIGNvbnRlbnQgfSk7XG59XG4iXX0=