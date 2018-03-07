"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const source_map_1 = require("source-map");
const loaderUtils = require('loader-utils');
const build_optimizer_1 = require("./build-optimizer");
function buildOptimizerLoader(content, previousSourceMap) {
    this.cacheable();
    const options = loaderUtils.getOptions(this) || {};
    // Make up names of the intermediate files so we can chain the sourcemaps.
    const inputFilePath = this.resourcePath + '.pre-build-optimizer.js';
    const outputFilePath = this.resourcePath + '.post-build-optimizer.js';
    const boOutput = build_optimizer_1.buildOptimizer({
        content,
        originalFilePath: this.resourcePath,
        inputFilePath,
        outputFilePath,
        emitSourceMap: options.sourceMap,
    });
    if (boOutput.emitSkipped || boOutput.content === null) {
        // Webpack typings for previousSourceMap are wrong, they are JSON objects and not strings.
        // tslint:disable-next-line:no-any
        this.callback(null, content, previousSourceMap);
        return;
    }
    const intermediateSourceMap = boOutput.sourceMap;
    let newContent = boOutput.content;
    let newSourceMap;
    if (options.sourceMap && intermediateSourceMap) {
        // Webpack doesn't need sourceMappingURL since we pass them on explicitely.
        newContent = newContent.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '');
        if (previousSourceMap) {
            // If there's a previous sourcemap, we have to chain them.
            // See https://github.com/mozilla/source-map/issues/216#issuecomment-150839869 for a simple
            // source map chaining example.
            // Use http://sokra.github.io/source-map-visualization/ to validate sourcemaps make sense.
            // Force the previous sourcemap to use the filename we made up for it.
            // In order for source maps to be chained, the consumed source map `file` needs to be in the
            // consumers source map `sources` array.
            previousSourceMap.file = inputFilePath;
            // Chain the sourcemaps.
            const consumer = new source_map_1.SourceMapConsumer(intermediateSourceMap);
            const generator = source_map_1.SourceMapGenerator.fromSourceMap(consumer);
            generator.applySourceMap(new source_map_1.SourceMapConsumer(previousSourceMap));
            newSourceMap = generator.toJSON();
        }
        else {
            // Otherwise just return our generated sourcemap.
            newSourceMap = intermediateSourceMap;
        }
    }
    // Webpack typings for previousSourceMap are wrong, they are JSON objects and not strings.
    // tslint:disable-next-line:no-any
    this.callback(null, newContent, newSourceMap);
}
exports.default = buildOptimizerLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvYnVpbGQtb3B0aW1pemVyL3dlYnBhY2stbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsMkNBQWlGO0FBR2pGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUU1Qyx1REFBbUQ7QUFPbkQsOEJBQ3VDLE9BQWUsRUFBRSxpQkFBK0I7SUFDckYsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2pCLE1BQU0sT0FBTyxHQUFnQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVoRiwwRUFBMEU7SUFDMUUsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyx5QkFBeUIsQ0FBQztJQUNwRSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLDBCQUEwQixDQUFDO0lBRXRFLE1BQU0sUUFBUSxHQUFHLGdDQUFjLENBQUM7UUFDOUIsT0FBTztRQUNQLGdCQUFnQixFQUFFLElBQUksQ0FBQyxZQUFZO1FBQ25DLGFBQWE7UUFDYixjQUFjO1FBQ2QsYUFBYSxFQUFFLE9BQU8sQ0FBQyxTQUFTO0tBQ2pDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RELDBGQUEwRjtRQUMxRixrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGlCQUF3QixDQUFDLENBQUM7UUFFdkQsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUVELE1BQU0scUJBQXFCLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztJQUNqRCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0lBRWxDLElBQUksWUFBWSxDQUFDO0lBRWpCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQy9DLDJFQUEyRTtRQUMzRSxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxvQ0FBb0MsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUxRSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDdEIsMERBQTBEO1lBQzFELDJGQUEyRjtZQUMzRiwrQkFBK0I7WUFDL0IsMEZBQTBGO1lBRTFGLHNFQUFzRTtZQUN0RSw0RkFBNEY7WUFDNUYsd0NBQXdDO1lBQ3hDLGlCQUFpQixDQUFDLElBQUksR0FBRyxhQUFhLENBQUM7WUFFdkMsd0JBQXdCO1lBQ3hCLE1BQU0sUUFBUSxHQUFHLElBQUksOEJBQWlCLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUM5RCxNQUFNLFNBQVMsR0FBRywrQkFBa0IsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0QsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLDhCQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUNuRSxZQUFZLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLGlEQUFpRDtZQUNqRCxZQUFZLEdBQUcscUJBQXFCLENBQUM7UUFDdkMsQ0FBQztJQUNILENBQUM7SUFFRCwwRkFBMEY7SUFDMUYsa0NBQWtDO0lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxZQUFtQixDQUFDLENBQUM7QUFDdkQsQ0FBQztBQTNERCx1Q0EyREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyLCBTb3VyY2VNYXBHZW5lcmF0b3IgfSBmcm9tICdzb3VyY2UtbWFwJztcbmltcG9ydCAqIGFzIHdlYnBhY2sgZnJvbSAnd2VicGFjayc7ICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuXG5jb25zdCBsb2FkZXJVdGlscyA9IHJlcXVpcmUoJ2xvYWRlci11dGlscycpO1xuXG5pbXBvcnQgeyBidWlsZE9wdGltaXplciB9IGZyb20gJy4vYnVpbGQtb3B0aW1pemVyJztcblxuXG5pbnRlcmZhY2UgQnVpbGRPcHRpbWl6ZXJMb2FkZXJPcHRpb25zIHtcbiAgc291cmNlTWFwOiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZE9wdGltaXplckxvYWRlclxuICAodGhpczogd2VicGFjay5sb2FkZXIuTG9hZGVyQ29udGV4dCwgY29udGVudDogc3RyaW5nLCBwcmV2aW91c1NvdXJjZU1hcDogUmF3U291cmNlTWFwKSB7XG4gIHRoaXMuY2FjaGVhYmxlKCk7XG4gIGNvbnN0IG9wdGlvbnM6IEJ1aWxkT3B0aW1pemVyTG9hZGVyT3B0aW9ucyA9IGxvYWRlclV0aWxzLmdldE9wdGlvbnModGhpcykgfHwge307XG5cbiAgLy8gTWFrZSB1cCBuYW1lcyBvZiB0aGUgaW50ZXJtZWRpYXRlIGZpbGVzIHNvIHdlIGNhbiBjaGFpbiB0aGUgc291cmNlbWFwcy5cbiAgY29uc3QgaW5wdXRGaWxlUGF0aCA9IHRoaXMucmVzb3VyY2VQYXRoICsgJy5wcmUtYnVpbGQtb3B0aW1pemVyLmpzJztcbiAgY29uc3Qgb3V0cHV0RmlsZVBhdGggPSB0aGlzLnJlc291cmNlUGF0aCArICcucG9zdC1idWlsZC1vcHRpbWl6ZXIuanMnO1xuXG4gIGNvbnN0IGJvT3V0cHV0ID0gYnVpbGRPcHRpbWl6ZXIoe1xuICAgIGNvbnRlbnQsXG4gICAgb3JpZ2luYWxGaWxlUGF0aDogdGhpcy5yZXNvdXJjZVBhdGgsXG4gICAgaW5wdXRGaWxlUGF0aCxcbiAgICBvdXRwdXRGaWxlUGF0aCxcbiAgICBlbWl0U291cmNlTWFwOiBvcHRpb25zLnNvdXJjZU1hcCxcbiAgfSk7XG5cbiAgaWYgKGJvT3V0cHV0LmVtaXRTa2lwcGVkIHx8IGJvT3V0cHV0LmNvbnRlbnQgPT09IG51bGwpIHtcbiAgICAvLyBXZWJwYWNrIHR5cGluZ3MgZm9yIHByZXZpb3VzU291cmNlTWFwIGFyZSB3cm9uZywgdGhleSBhcmUgSlNPTiBvYmplY3RzIGFuZCBub3Qgc3RyaW5ncy5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgdGhpcy5jYWxsYmFjayhudWxsLCBjb250ZW50LCBwcmV2aW91c1NvdXJjZU1hcCBhcyBhbnkpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgaW50ZXJtZWRpYXRlU291cmNlTWFwID0gYm9PdXRwdXQuc291cmNlTWFwO1xuICBsZXQgbmV3Q29udGVudCA9IGJvT3V0cHV0LmNvbnRlbnQ7XG5cbiAgbGV0IG5ld1NvdXJjZU1hcDtcblxuICBpZiAob3B0aW9ucy5zb3VyY2VNYXAgJiYgaW50ZXJtZWRpYXRlU291cmNlTWFwKSB7XG4gICAgLy8gV2VicGFjayBkb2Vzbid0IG5lZWQgc291cmNlTWFwcGluZ1VSTCBzaW5jZSB3ZSBwYXNzIHRoZW0gb24gZXhwbGljaXRlbHkuXG4gICAgbmV3Q29udGVudCA9IG5ld0NvbnRlbnQucmVwbGFjZSgvXlxcL1xcLyMgc291cmNlTWFwcGluZ1VSTD1bXlxcclxcbl0qL2dtLCAnJyk7XG5cbiAgICBpZiAocHJldmlvdXNTb3VyY2VNYXApIHtcbiAgICAgIC8vIElmIHRoZXJlJ3MgYSBwcmV2aW91cyBzb3VyY2VtYXAsIHdlIGhhdmUgdG8gY2hhaW4gdGhlbS5cbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL2lzc3Vlcy8yMTYjaXNzdWVjb21tZW50LTE1MDgzOTg2OSBmb3IgYSBzaW1wbGVcbiAgICAgIC8vIHNvdXJjZSBtYXAgY2hhaW5pbmcgZXhhbXBsZS5cbiAgICAgIC8vIFVzZSBodHRwOi8vc29rcmEuZ2l0aHViLmlvL3NvdXJjZS1tYXAtdmlzdWFsaXphdGlvbi8gdG8gdmFsaWRhdGUgc291cmNlbWFwcyBtYWtlIHNlbnNlLlxuXG4gICAgICAvLyBGb3JjZSB0aGUgcHJldmlvdXMgc291cmNlbWFwIHRvIHVzZSB0aGUgZmlsZW5hbWUgd2UgbWFkZSB1cCBmb3IgaXQuXG4gICAgICAvLyBJbiBvcmRlciBmb3Igc291cmNlIG1hcHMgdG8gYmUgY2hhaW5lZCwgdGhlIGNvbnN1bWVkIHNvdXJjZSBtYXAgYGZpbGVgIG5lZWRzIHRvIGJlIGluIHRoZVxuICAgICAgLy8gY29uc3VtZXJzIHNvdXJjZSBtYXAgYHNvdXJjZXNgIGFycmF5LlxuICAgICAgcHJldmlvdXNTb3VyY2VNYXAuZmlsZSA9IGlucHV0RmlsZVBhdGg7XG5cbiAgICAgIC8vIENoYWluIHRoZSBzb3VyY2VtYXBzLlxuICAgICAgY29uc3QgY29uc3VtZXIgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoaW50ZXJtZWRpYXRlU291cmNlTWFwKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRvciA9IFNvdXJjZU1hcEdlbmVyYXRvci5mcm9tU291cmNlTWFwKGNvbnN1bWVyKTtcbiAgICAgIGdlbmVyYXRvci5hcHBseVNvdXJjZU1hcChuZXcgU291cmNlTWFwQ29uc3VtZXIocHJldmlvdXNTb3VyY2VNYXApKTtcbiAgICAgIG5ld1NvdXJjZU1hcCA9IGdlbmVyYXRvci50b0pTT04oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlIGp1c3QgcmV0dXJuIG91ciBnZW5lcmF0ZWQgc291cmNlbWFwLlxuICAgICAgbmV3U291cmNlTWFwID0gaW50ZXJtZWRpYXRlU291cmNlTWFwO1xuICAgIH1cbiAgfVxuXG4gIC8vIFdlYnBhY2sgdHlwaW5ncyBmb3IgcHJldmlvdXNTb3VyY2VNYXAgYXJlIHdyb25nLCB0aGV5IGFyZSBKU09OIG9iamVjdHMgYW5kIG5vdCBzdHJpbmdzLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gIHRoaXMuY2FsbGJhY2sobnVsbCwgbmV3Q29udGVudCwgbmV3U291cmNlTWFwIGFzIGFueSk7XG59XG4iXX0=