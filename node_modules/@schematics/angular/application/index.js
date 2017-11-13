"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const schematics_1 = require("@angular-devkit/schematics");
const ts = require("typescript");
const stringUtils = require("../strings");
const ast_utils_1 = require("../utility/ast-utils");
const change_1 = require("../utility/change");
function addBootstrapToNgModule(directory, sourceDir) {
    return (host) => {
        const modulePath = `${directory}/${sourceDir}/app/app.module.ts`;
        const content = host.read(modulePath);
        if (!content) {
            throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
        }
        const sourceText = content.toString('utf-8');
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
        const componentModule = './app.component';
        const importChanges = ast_utils_1.addImportToModule(source, modulePath, 'BrowserModule', '@angular/platform-browser');
        const bootstrapChanges = ast_utils_1.addBootstrapToModule(source, modulePath, 'AppComponent', componentModule);
        const changes = [
            ...importChanges,
            ...bootstrapChanges,
        ];
        const recorder = host.beginUpdate(modulePath);
        for (const change of changes) {
            if (change instanceof change_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);
        return host;
    };
}
function minimalPathFilter(path) {
    const toRemoveList = [/e2e\//, /editorconfig/, /README/, /karma.conf.js/,
        /protractor.conf.js/, /test.ts/, /tsconfig.spec.json/,
        /tslint.json/, /favicon.ico/];
    return !toRemoveList.some(re => re.test(path));
}
function default_1(options) {
    return (host, context) => {
        const appRootSelector = `${options.prefix}-root`;
        const componentOptions = !options.minimal ?
            {
                inlineStyle: options.inlineStyle,
                inlineTemplate: options.inlineTemplate,
                spec: !options.skipTests,
                styleext: options.style,
            } :
            {
                inlineStyle: true,
                inlineTemplate: true,
                spec: false,
                styleext: options.style,
            };
        const sourceDir = options.sourceDir || 'src';
        return schematics_1.chain([
            schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
                options.minimal ? schematics_1.filter(minimalPathFilter) : schematics_1.noop(),
                options.skipGit ? schematics_1.filter(path => !path.endsWith('/__dot__gitignore')) : schematics_1.noop(),
                options.serviceWorker ? schematics_1.noop() : schematics_1.filter(path => !path.endsWith('/ngsw-config.json')),
                schematics_1.template(Object.assign({ utils: stringUtils, 'dot': '.' }, options)),
                schematics_1.move(options.directory),
            ])),
            schematics_1.schematic('module', {
                name: 'app',
                commonModule: false,
                flat: true,
                routing: options.routing,
                routingScope: 'Root',
                sourceDir: options.directory + '/' + sourceDir,
                spec: false,
            }),
            schematics_1.schematic('component', Object.assign({ name: 'app', selector: appRootSelector, sourceDir: options.directory + '/' + sourceDir, flat: true }, componentOptions)),
            addBootstrapToNgModule(options.directory, sourceDir),
            schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./other-files'), [
                componentOptions.inlineTemplate ? schematics_1.filter(path => !path.endsWith('.html')) : schematics_1.noop(),
                !componentOptions.spec ? schematics_1.filter(path => !path.endsWith('.spec.ts')) : schematics_1.noop(),
                schematics_1.template(Object.assign({ utils: stringUtils }, options, { selector: appRootSelector }, componentOptions)),
                schematics_1.move(options.directory + '/' + sourceDir + '/app'),
            ]), schematics_1.MergeStrategy.Overwrite),
        ])(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL2FwcGxpY2F0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsMkRBZW9DO0FBQ3BDLGlDQUFpQztBQUNqQywwQ0FBMEM7QUFDMUMsb0RBQStFO0FBQy9FLDhDQUFpRDtBQUlqRCxnQ0FBZ0MsU0FBaUIsRUFBRSxTQUFpQjtJQUNsRSxNQUFNLENBQUMsQ0FBQyxJQUFVO1FBQ2hCLE1BQU0sVUFBVSxHQUFHLEdBQUcsU0FBUyxJQUFJLFNBQVMsb0JBQW9CLENBQUM7UUFDakUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLElBQUksZ0NBQW1CLENBQUMsUUFBUSxVQUFVLGtCQUFrQixDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUNELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFekYsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7UUFFMUMsTUFBTSxhQUFhLEdBQUcsNkJBQWlCLENBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLEVBQ2YsMkJBQTJCLENBQUMsQ0FBQztRQUNyRSxNQUFNLGdCQUFnQixHQUFHLGdDQUFvQixDQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUNkLGVBQWUsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sT0FBTyxHQUFH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QUFDO1lBQ0Ysc0JBQVMsQ0FBQyxXQUFXLGtCQUNuQixJQUFJLEVBQUUsS0FBSyxFQUNYLFFBQVEsRUFBRSxlQUFlLEVBQ3pCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxTQUFTLEVBQzlDLElBQUksRUFBRSxJQUFJLElBQ1AsZ0JBQWdCLEVBQ25CO1lBQ0Ysc0JBQXNCLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7WUFDcEQsc0JBQVMsQ0FDUCxrQkFBSyxDQUFDLGdCQUFHLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQzFCLGdCQUFnQixDQUFDLGNBQWMsR0FBRyxtQkFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxpQkFBSSxFQUFFO2dCQUNsRixDQUFDLGdCQUFnQixDQUFDLElBQUksR0FBRyxtQkFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxpQkFBSSxFQUFFO2dCQUM1RSxxQkFBUSxpQkFDTixLQUFLLEVBQUUsV0FBVyxJQUNmLE9BQWMsSUFDakIsUUFBUSxFQUFFLGVBQWUsSUFDdEIsZ0JBQWdCLEVBQ25CO2dCQUNGLGlCQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQzthQUNuRCxDQUFDLEVBQUUsMEJBQWEsQ0FBQyxTQUFTLENBQUM7U0FDL0IsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUM7QUFDSixDQUFDO0FBOURELDRCQThEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIE1lcmdlU3RyYXRlZ3ksXG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG4gIGFwcGx5LFxuICBjaGFpbixcbiAgZmlsdGVyLFxuICBtZXJnZVdpdGgsXG4gIG1vdmUsXG4gIG5vb3AsXG4gIHNjaGVtYXRpYyxcbiAgdGVtcGxhdGUsXG4gIHVybCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgKiBhcyBzdHJpbmdVdGlscyBmcm9tICcuLi9zdHJpbmdzJztcbmltcG9ydCB7IGFkZEJvb3RzdHJhcFRvTW9kdWxlLCBhZGRJbXBvcnRUb01vZHVsZSB9IGZyb20gJy4uL3V0aWxpdHkvYXN0LXV0aWxzJztcbmltcG9ydCB7IEluc2VydENoYW5nZSB9IGZyb20gJy4uL3V0aWxpdHkvY2hhbmdlJztcbmltcG9ydCB7IFNjaGVtYSBhcyBBcHBsaWNhdGlvbk9wdGlvbnMgfSBmcm9tICcuL3NjaGVtYSc7XG5cblxuZnVuY3Rpb24gYWRkQm9vdHN0cmFwVG9OZ01vZHVsZShkaXJlY3Rvcnk6IHN0cmluZywgc291cmNlRGlyOiBzdHJpbmcpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3QgbW9kdWxlUGF0aCA9IGAke2RpcmVjdG9yeX0vJHtzb3VyY2VEaXJ9L2FwcC9hcHAubW9kdWxlLnRzYDtcbiAgICBjb25zdCBjb250ZW50ID0gaG9zdC5yZWFkKG1vZHVsZVBhdGgpO1xuICAgIGlmICghY29udGVudCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEZpbGUgJHttb2R1bGVQYXRofSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgICB9XG4gICAgY29uc3Qgc291cmNlVGV4dCA9IGNvbnRlbnQudG9TdHJpbmcoJ3V0Zi04Jyk7XG4gICAgY29uc3Qgc291cmNlID0gdHMuY3JlYXRlU291cmNlRmlsZShtb2R1bGVQYXRoLCBzb3VyY2VUZXh0LCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCB0cnVlKTtcblxuICAgIGNvbnN0IGNvbXBvbmVudE1vZHVsZSA9ICcuL2FwcC5jb21wb25lbnQnO1xuXG4gICAgY29uc3QgaW1wb3J0Q2hhbmdlcyA9IGFkZEltcG9ydFRvTW9kdWxlKHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Jyb3dzZXJNb2R1bGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlcicpO1xuICAgIGNvbnN0IGJvb3RzdHJhcENoYW5nZXMgPSBhZGRCb290c3RyYXBUb01vZHVsZShzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZVBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcHBDb21wb25lbnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRNb2R1bGUpO1xuICAgIGNvbnN0IGNoYW5nZXMgPSBbXG4gICAgICAuLi5pbXBvcnRDaGFuZ2VzLFxuICAgICAgLi4uYm9vdHN0cmFwQ2hhbmdlcyxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKG1vZHVsZVBhdGgpO1xuICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGNoYW5nZXMpIHtcbiAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChjaGFuZ2UucG9zLCBjaGFuZ2UudG9BZGQpO1xuICAgICAgfVxuICAgIH1cbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWluaW1hbFBhdGhGaWx0ZXIocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IHRvUmVtb3ZlTGlzdDogUmVnRXhwW10gPSBbL2UyZVxcLy8sIC9lZGl0b3Jjb25maWcvLCAvUkVBRE1FLywgL2thcm1hLmNvbmYuanMvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC9wcm90cmFjdG9yLmNvbmYuanMvLCAvdGVzdC50cy8sIC90c2NvbmZpZy5zcGVjLmpzb24vLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC90c2xpbnQuanNvbi8sIC9mYXZpY29uLmljby9dO1xuXG4gIHJldHVybiAhdG9SZW1vdmVMaXN0LnNvbWUocmUgPT4gcmUudGVzdChwYXRoKSk7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IGFwcFJvb3RTZWxlY3RvciA9IGAke29wdGlvbnMucHJlZml4fS1yb290YDtcbiAgICBjb25zdCBjb21wb25lbnRPcHRpb25zID0gIW9wdGlvbnMubWluaW1hbCA/XG4gICAgICB7XG4gICAgICAgIGlubGluZVN0eWxlOiBvcHRpb25zLmlubGluZVN0eWxlLFxuICAgICAgICBpbmxpbmVUZW1wbGF0ZTogb3B0aW9ucy5pbmxpbmVUZW1wbGF0ZSxcbiAgICAgICAgc3BlYzogIW9wdGlvbnMuc2tpcFRlc3RzLFxuICAgICAgICBzdHlsZWV4dDogb3B0aW9ucy5zdHlsZSxcbiAgICAgIH0gOlxuICAgICAge1xuICAgICAgICBpbmxpbmVTdHlsZTogdHJ1ZSxcbiAgICAgICAgaW5saW5lVGVtcGxhdGU6IHRydWUsXG4gICAgICAgIHNwZWM6IGZhbHNlLFxuICAgICAgICBzdHlsZWV4dDogb3B0aW9ucy5zdHlsZSxcbiAgICAgIH07XG4gICAgY29uc3Qgc291cmNlRGlyID0gb3B0aW9ucy5zb3VyY2VEaXIgfHwgJ3NyYyc7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgbWVyZ2VXaXRoKFxuICAgICAgICBhcHBseSh1cmwoJy4vZmlsZXMnKSwgW1xuICAgICAgICAgIG9wdGlvbnMubWluaW1hbCA/IGZpbHRlcihtaW5pbWFsUGF0aEZpbHRlcikgOiBub29wKCksXG4gICAgICAgICAgb3B0aW9ucy5za2lwR2l0ID8gZmlsdGVyKHBhdGggPT4gIXBhdGguZW5kc1dpdGgoJy9fX2RvdF9fZ2l0aWdub3JlJykpIDogbm9vcCgpLFxuICAgICAgICAgIG9wdGlvbnMuc2VydmljZVdvcmtlciA/IG5vb3AoKSA6IGZpbHRlcihwYXRoID0+ICFwYXRoLmVuZHNXaXRoKCcvbmdzdy1jb25maWcuanNvbicpKSxcbiAgICAgICAgICB0ZW1wbGF0ZSh7XG4gICAgICAgICAgICB1dGlsczogc3RyaW5nVXRpbHMsXG4gICAgICAgICAgICAnZG90JzogJy4nLFxuICAgICAgICAgICAgLi4ub3B0aW9ucyBhcyBvYmplY3QsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbW92ZShvcHRpb25zLmRpcmVjdG9yeSksXG4gICAgICAgIF0pKSxcbiAgICAgIHNjaGVtYXRpYygnbW9kdWxlJywge1xuICAgICAgICBuYW1lOiAnYXBwJyxcbiAgICAgICAgY29tbW9uTW9kdWxlOiBmYWxzZSxcbiAgICAgICAgZmxhdDogdHJ1ZSxcbiAgICAgICAgcm91dGluZzogb3B0aW9ucy5yb3V0aW5nLFxuICAgICAgICByb3V0aW5nU2NvcGU6ICdSb290JyxcbiAgICAgICAgc291cmNlRGlyOiBvcHRpb25zLmRpcmVjdG9yeSArICcvJyArIHNvdXJjZURpcixcbiAgICAgICAgc3BlYzogZmFsc2UsXG4gICAgICB9KSxcbiAgICAgIHNjaGVtYXRpYygnY29tcG9uZW50Jywge1xuICAgICAgICBuYW1lOiAnYXBwJyxcbiAgICAgICAgc2VsZWN0b3I6IGFwcFJvb3RTZWxlY3RvcixcbiAgICAgICAgc291cmNlRGlyOiBvcHRpb25zLmRpcmVjdG9yeSArICcvJyArIHNvdXJjZURpcixcbiAgICAgICAgZmxhdDogdHJ1ZSxcbiAgICAgICAgLi4uY29tcG9uZW50T3B0aW9ucyxcbiAgICAgIH0pLFxuICAgICAgYWRkQm9vdHN0cmFwVG9OZ01vZHVsZShvcHRpb25zLmRpcmVjdG9yeSwgc291cmNlRGlyKSxcbiAgICAgIG1lcmdlV2l0aChcbiAgICAgICAgYXBwbHkodXJsKCcuL290aGVyLWZpbGVzJyksIFtcbiAgICAgICAgICBjb21wb25lbnRPcHRpb25zLmlubGluZVRlbXBsYXRlID8gZmlsdGVyKHBhdGggPT4gIXBhdGguZW5kc1dpdGgoJy5odG1sJykpIDogbm9vcCgpLFxuICAgICAgICAgICFjb21wb25lbnRPcHRpb25zLnNwZWMgPyBmaWx0ZXIocGF0aCA9PiAhcGF0aC5lbmRzV2l0aCgnLnNwZWMudHMnKSkgOiBub29wKCksXG4gICAgICAgICAgdGVtcGxhdGUoe1xuICAgICAgICAgICAgdXRpbHM6IHN0cmluZ1V0aWxzLFxuICAgICAgICAgICAgLi4ub3B0aW9ucyBhcyBhbnksICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWFueVxuICAgICAgICAgICAgc2VsZWN0b3I6IGFwcFJvb3RTZWxlY3RvcixcbiAgICAgICAgICAgIC4uLmNvbXBvbmVudE9wdGlvbnMsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbW92ZShvcHRpb25zLmRpcmVjdG9yeSArICcvJyArIHNvdXJjZURpciArICcvYXBwJyksXG4gICAgICAgIF0pLCBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZSksXG4gICAgXSkoaG9zdCwgY29udGV4dCk7XG4gIH07XG59XG4iXX0=