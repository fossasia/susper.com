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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfb3B0aW1pemVyL3NyYy9idWlsZC1vcHRpbWl6ZXIvd2VicGFjay1sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwyQ0FBaUY7QUFFakYsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRTVDLHVEQUFtRDtBQU9uRCw4QkFDdUMsT0FBZSxFQUFFLGlCQUErQjtJQUNyRixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDakIsTUFBTSxPQUFPLEdBQWdDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBRWhGLDBFQUEwRTtJQUMxRSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDO0lBQ3BFLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsMEJBQTBCLENBQUM7SUFFdEUsTUFBTSxRQUFRLEdBQUcsZ0NBQWMsQ0FBQztRQUM5QixPQUFPO1FBQ1AsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFlBQVk7UUFDbkMsYUFBYTtRQUNiLGNBQWM7UUFDZCxhQUFhLEVBQUUsT0FBTyxDQUFDLFNBQVM7S0FDakMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsSUFBSSxRQUFRLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdEQsMEZBQTBGO1FBQzFGLGtDQUFrQztRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsaUJBQXdCLENBQUMsQ0FBQztRQUV2RCxNQUFNLENBQUM7SUFDVCxDQUFDO0lBRUQsTUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO0lBQ2pELElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFFbEMsSUFBSSxZQUFZLENBQUM7SUFFakIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7UUFDL0MsMkVBQTJFO1FBQzNFLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTFFLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUN0QiwwREFBMEQ7WUFDMUQsMkZBQTJGO1lBQzNGLCtCQUErQjtZQUMvQiwwRkFBMEY7WUFFMUYsc0VBQXNFO1lBQ3RFLDRGQUE0RjtZQUM1Rix3Q0FBd0M7WUFDeEMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztZQUV2Qyx3QkFBd0I7WUFDeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSw4QkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzlELE1BQU0sU0FBUyxHQUFHLCtCQUFrQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3RCxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksOEJBQWlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ25FLFlBQVksR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04saURBQWlEO1lBQ2pELFlBQVksR0FBRyxxQkFBcUIsQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztJQUVELDBGQUEwRjtJQUMxRixrQ0FBa0M7SUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFlBQW1CLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBM0RELHVDQTJEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IFJhd1NvdXJjZU1hcCwgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0ICogYXMgd2VicGFjayBmcm9tICd3ZWJwYWNrJztcbmNvbnN0IGxvYWRlclV0aWxzID0gcmVxdWlyZSgnbG9hZGVyLXV0aWxzJyk7XG5cbmltcG9ydCB7IGJ1aWxkT3B0aW1pemVyIH0gZnJvbSAnLi9idWlsZC1vcHRpbWl6ZXInO1xuXG5cbmludGVyZmFjZSBCdWlsZE9wdGltaXplckxvYWRlck9wdGlvbnMge1xuICBzb3VyY2VNYXA6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkT3B0aW1pemVyTG9hZGVyXG4gICh0aGlzOiB3ZWJwYWNrLmxvYWRlci5Mb2FkZXJDb250ZXh0LCBjb250ZW50OiBzdHJpbmcsIHByZXZpb3VzU291cmNlTWFwOiBSYXdTb3VyY2VNYXApIHtcbiAgdGhpcy5jYWNoZWFibGUoKTtcbiAgY29uc3Qgb3B0aW9uczogQnVpbGRPcHRpbWl6ZXJMb2FkZXJPcHRpb25zID0gbG9hZGVyVXRpbHMuZ2V0T3B0aW9ucyh0aGlzKSB8fCB7fTtcblxuICAvLyBNYWtlIHVwIG5hbWVzIG9mIHRoZSBpbnRlcm1lZGlhdGUgZmlsZXMgc28gd2UgY2FuIGNoYWluIHRoZSBzb3VyY2VtYXBzLlxuICBjb25zdCBpbnB1dEZpbGVQYXRoID0gdGhpcy5yZXNvdXJjZVBhdGggKyAnLnByZS1idWlsZC1vcHRpbWl6ZXIuanMnO1xuICBjb25zdCBvdXRwdXRGaWxlUGF0aCA9IHRoaXMucmVzb3VyY2VQYXRoICsgJy5wb3N0LWJ1aWxkLW9wdGltaXplci5qcyc7XG5cbiAgY29uc3QgYm9PdXRwdXQgPSBidWlsZE9wdGltaXplcih7XG4gICAgY29udGVudCxcbiAgICBvcmlnaW5hbEZpbGVQYXRoOiB0aGlzLnJlc291cmNlUGF0aCxcbiAgICBpbnB1dEZpbGVQYXRoLFxuICAgIG91dHB1dEZpbGVQYXRoLFxuICAgIGVtaXRTb3VyY2VNYXA6IG9wdGlvbnMuc291cmNlTWFwLFxuICB9KTtcblxuICBpZiAoYm9PdXRwdXQuZW1pdFNraXBwZWQgfHwgYm9PdXRwdXQuY29udGVudCA9PT0gbnVsbCkge1xuICAgIC8vIFdlYnBhY2sgdHlwaW5ncyBmb3IgcHJldmlvdXNTb3VyY2VNYXAgYXJlIHdyb25nLCB0aGV5IGFyZSBKU09OIG9iamVjdHMgYW5kIG5vdCBzdHJpbmdzLlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICB0aGlzLmNhbGxiYWNrKG51bGwsIGNvbnRlbnQsIHByZXZpb3VzU291cmNlTWFwIGFzIGFueSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBpbnRlcm1lZGlhdGVTb3VyY2VNYXAgPSBib091dHB1dC5zb3VyY2VNYXA7XG4gIGxldCBuZXdDb250ZW50ID0gYm9PdXRwdXQuY29udGVudDtcblxuICBsZXQgbmV3U291cmNlTWFwO1xuXG4gIGlmIChvcHRpb25zLnNvdXJjZU1hcCAmJiBpbnRlcm1lZGlhdGVTb3VyY2VNYXApIHtcbiAgICAvLyBXZWJwYWNrIGRvZXNuJ3QgbmVlZCBzb3VyY2VNYXBwaW5nVVJMIHNpbmNlIHdlIHBhc3MgdGhlbSBvbiBleHBsaWNpdGVseS5cbiAgICBuZXdDb250ZW50ID0gbmV3Q29udGVudC5yZXBsYWNlKC9eXFwvXFwvIyBzb3VyY2VNYXBwaW5nVVJMPVteXFxyXFxuXSovZ20sICcnKTtcblxuICAgIGlmIChwcmV2aW91c1NvdXJjZU1hcCkge1xuICAgICAgLy8gSWYgdGhlcmUncyBhIHByZXZpb3VzIHNvdXJjZW1hcCwgd2UgaGF2ZSB0byBjaGFpbiB0aGVtLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvaXNzdWVzLzIxNiNpc3N1ZWNvbW1lbnQtMTUwODM5ODY5IGZvciBhIHNpbXBsZVxuICAgICAgLy8gc291cmNlIG1hcCBjaGFpbmluZyBleGFtcGxlLlxuICAgICAgLy8gVXNlIGh0dHA6Ly9zb2tyYS5naXRodWIuaW8vc291cmNlLW1hcC12aXN1YWxpemF0aW9uLyB0byB2YWxpZGF0ZSBzb3VyY2VtYXBzIG1ha2Ugc2Vuc2UuXG5cbiAgICAgIC8vIEZvcmNlIHRoZSBwcmV2aW91cyBzb3VyY2VtYXAgdG8gdXNlIHRoZSBmaWxlbmFtZSB3ZSBtYWRlIHVwIGZvciBpdC5cbiAgICAgIC8vIEluIG9yZGVyIGZvciBzb3VyY2UgbWFwcyB0byBiZSBjaGFpbmVkLCB0aGUgY29uc3VtZWQgc291cmNlIG1hcCBgZmlsZWAgbmVlZHMgdG8gYmUgaW4gdGhlXG4gICAgICAvLyBjb25zdW1lcnMgc291cmNlIG1hcCBgc291cmNlc2AgYXJyYXkuXG4gICAgICBwcmV2aW91c1NvdXJjZU1hcC5maWxlID0gaW5wdXRGaWxlUGF0aDtcblxuICAgICAgLy8gQ2hhaW4gdGhlIHNvdXJjZW1hcHMuXG4gICAgICBjb25zdCBjb25zdW1lciA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcihpbnRlcm1lZGlhdGVTb3VyY2VNYXApO1xuICAgICAgY29uc3QgZ2VuZXJhdG9yID0gU291cmNlTWFwR2VuZXJhdG9yLmZyb21Tb3VyY2VNYXAoY29uc3VtZXIpO1xuICAgICAgZ2VuZXJhdG9yLmFwcGx5U291cmNlTWFwKG5ldyBTb3VyY2VNYXBDb25zdW1lcihwcmV2aW91c1NvdXJjZU1hcCkpO1xuICAgICAgbmV3U291cmNlTWFwID0gZ2VuZXJhdG9yLnRvSlNPTigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UganVzdCByZXR1cm4gb3VyIGdlbmVyYXRlZCBzb3VyY2VtYXAuXG4gICAgICBuZXdTb3VyY2VNYXAgPSBpbnRlcm1lZGlhdGVTb3VyY2VNYXA7XG4gICAgfVxuICB9XG5cbiAgLy8gV2VicGFjayB0eXBpbmdzIGZvciBwcmV2aW91c1NvdXJjZU1hcCBhcmUgd3JvbmcsIHRoZXkgYXJlIEpTT04gb2JqZWN0cyBhbmQgbm90IHN0cmluZ3MuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgdGhpcy5jYWxsYmFjayhudWxsLCBuZXdDb250ZW50LCBuZXdTb3VyY2VNYXAgYXMgYW55KTtcbn1cbiJdfQ==