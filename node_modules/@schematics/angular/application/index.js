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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL2FwcGxpY2F0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsMkRBZW9DO0FBQ3BDLGlDQUFpQztBQUNqQywwQ0FBMEM7QUFDMUMsb0RBQStFO0FBQy9FLDhDQUFpRDtBQUlqRCxnQ0FBZ0MsU0FBaUIsRUFBRSxTQUFpQjtJQUNsRSxNQUFNLENBQUMsQ0FBQyxJQUFVO1FBQ2hCLE1BQU0sVUFBVSxHQUFHLEdBQUcsU0FBUyxJQUFJLFNBQVMsb0JBQW9CLENBQUM7UUFDakUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLElBQUksZ0NBQW1CLENBQUMsUUFBUSxVQUFVLGtCQUFrQixDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUNELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFekYsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7UUFFMUMsTUFBTSxhQUFhLEdBQUcsNkJBQWlCLENBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLEVBQ2YsMkJBQTJCLENBQUMsQ0FBQztRQUNyRSxNQUFNLGdCQUFnQixHQUFHLGdDQUFvQixDQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUNkLGVBQWUsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sT0FBTyxHQUFHO1lBQ2QsR0FBRyxhQUFhO1lBQ2hCLEdBQUcsZ0JBQWdCO1NBQ3BCLENBQUM7UUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLHFCQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hELENBQUM7UUFDSCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU1QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELDJCQUEyQixJQUFZO0lBQ3JDLE1BQU0sWUFBWSxHQUFhLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsZUFBZTtRQUNsRCxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsb0JBQW9CO1FBQ3JELGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUU5RCxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUNELG1CQUF5QixPQUEyQjtJQUNsRCxNQUFNLENBQUMsQ0FBQyxJQUFVLEVBQUUsT0FBeUI7UUFDM0MsTUFBTSxlQUFlLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxPQUFPLENBQUM7UUFDakQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPO1lBQ3ZDO2dCQUNFLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztnQkFDaEMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxjQUFjO2dCQUN0QyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUztnQkFDeEIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLO2FBQ3hCO1lBQ0Q7Z0JBQ0UsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUUsT0FBTyxDQUFDLEtBQUs7YUFDeEIsQ0FBQztRQUNKLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDO1FBRTdDLE1BQU0sQ0FBQyxrQkFBSyxDQUFDO1lBQ1gsc0JBQVMsQ0FDUCxrQkFBSyxDQUFDLGdCQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3BCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsbUJBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLGlCQUFJLEVBQUU7Z0JBQ3BELE9BQU8sQ0FBQyxPQUFPLEdBQUcsbUJBQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxpQkFBSSxFQUFFO2dCQUM5RSxxQkFBUSxpQkFDTixLQUFLLEVBQUUsV0FBVyxFQUNsQixLQUFLLEVBQUUsR0FBRyxJQUNQLE9BQWlCLEVBQ3BCO2dCQUNGLGlCQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUN4QixDQUFDLENBQUM7WUFDTCxzQkFBUyxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLElBQUksRUFBRSxJQUFJO2dCQUNWLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztnQkFDeEIsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxTQUFTO2dCQUM5QyxJQUFJLEVBQUUsS0FBSzthQUNaLENBQUM7WUFDRixzQkFBUyxDQUFDLFdBQVcsa0JBQ25CLElBQUksRUFBRSxLQUFLLEVBQ1gsUUFBUSxFQUFFLGVBQWUsRUFDekIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLFNBQVMsRUFDOUMsSUFBSSxFQUFFLElBQUksSUFDUCxnQkFBZ0IsRUFDbkI7WUFDRixzQkFBc0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztZQUNwRCxzQkFBUyxDQUNQLGtCQUFLLENBQUMsZ0JBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDMUIsZ0JBQWdCLENBQUMsY0FBYyxHQUFHLG1CQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLGlCQUFJLEVBQUU7Z0JBQ2xGLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLG1CQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLGlCQUFJLEVBQUU7Z0JBQzVFLHFCQUFRLGlCQUNOLEtBQUssRUFBRSxXQUFXLElBQ2YsT0FBYyxJQUNqQixRQUFRLEVBQUUsZUFBZSxJQUN0QixnQkFBZ0IsRUFDbkI7Z0JBQ0YsaUJBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDO2FBQ25ELENBQUMsRUFBRSwwQkFBYSxDQUFDLFNBQVMsQ0FBQztTQUMvQixDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQztBQUNKLENBQUM7QUE3REQsNEJBNkRDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgTWVyZ2VTdHJhdGVneSxcbiAgUnVsZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbiAgU2NoZW1hdGljc0V4Y2VwdGlvbixcbiAgVHJlZSxcbiAgYXBwbHksXG4gIGNoYWluLFxuICBmaWx0ZXIsXG4gIG1lcmdlV2l0aCxcbiAgbW92ZSxcbiAgbm9vcCxcbiAgc2NoZW1hdGljLFxuICB0ZW1wbGF0ZSxcbiAgdXJsLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCAqIGFzIHN0cmluZ1V0aWxzIGZyb20gJy4uL3N0cmluZ3MnO1xuaW1wb3J0IHsgYWRkQm9vdHN0cmFwVG9Nb2R1bGUsIGFkZEltcG9ydFRvTW9kdWxlIH0gZnJvbSAnLi4vdXRpbGl0eS9hc3QtdXRpbHMnO1xuaW1wb3J0IHsgSW5zZXJ0Q2hhbmdlIH0gZnJvbSAnLi4vdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIEFwcGxpY2F0aW9uT3B0aW9ucyB9IGZyb20gJy4vc2NoZW1hJztcblxuXG5mdW5jdGlvbiBhZGRCb290c3RyYXBUb05nTW9kdWxlKGRpcmVjdG9yeTogc3RyaW5nLCBzb3VyY2VEaXI6IHN0cmluZyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBtb2R1bGVQYXRoID0gYCR7ZGlyZWN0b3J5fS8ke3NvdXJjZURpcn0vYXBwL2FwcC5tb2R1bGUudHNgO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBob3N0LnJlYWQobW9kdWxlUGF0aCk7XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgRmlsZSAke21vZHVsZVBhdGh9IGRvZXMgbm90IGV4aXN0LmApO1xuICAgIH1cbiAgICBjb25zdCBzb3VyY2VUZXh0ID0gY29udGVudC50b1N0cmluZygndXRmLTgnKTtcbiAgICBjb25zdCBzb3VyY2UgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKG1vZHVsZVBhdGgsIHNvdXJjZVRleHQsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIHRydWUpO1xuXG4gICAgY29uc3QgY29tcG9uZW50TW9kdWxlID0gJy4vYXBwLmNvbXBvbmVudCc7XG5cbiAgICBjb25zdCBpbXBvcnRDaGFuZ2VzID0gYWRkSW1wb3J0VG9Nb2R1bGUoc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQnJvd3Nlck1vZHVsZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJyk7XG4gICAgY29uc3QgYm9vdHN0cmFwQ2hhbmdlcyA9IGFkZEJvb3RzdHJhcFRvTW9kdWxlKHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FwcENvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE1vZHVsZSk7XG4gICAgY29uc3QgY2hhbmdlcyA9IFtcbiAgICAgIC4uLmltcG9ydENoYW5nZXMsXG4gICAgICAuLi5ib290c3RyYXBDaGFuZ2VzLFxuICAgIF07XG5cbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUobW9kdWxlUGF0aCk7XG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBtaW5pbWFsUGF0aEZpbHRlcihwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgdG9SZW1vdmVMaXN0OiBSZWdFeHBbXSA9IFsvZTJlXFwvLywgL2VkaXRvcmNvbmZpZy8sIC9SRUFETUUvLCAva2FybWEuY29uZi5qcy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL3Byb3RyYWN0b3IuY29uZi5qcy8sIC90ZXN0LnRzLywgL3RzY29uZmlnLnNwZWMuanNvbi8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL3RzbGludC5qc29uLywgL2Zhdmljb24uaWNvL107XG5cbiAgcmV0dXJuICF0b1JlbW92ZUxpc3Quc29tZShyZSA9PiByZS50ZXN0KHBhdGgpKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgYXBwUm9vdFNlbGVjdG9yID0gYCR7b3B0aW9ucy5wcmVmaXh9LXJvb3RgO1xuICAgIGNvbnN0IGNvbXBvbmVudE9wdGlvbnMgPSAhb3B0aW9ucy5taW5pbWFsID9cbiAgICAgIHtcbiAgICAgICAgaW5saW5lU3R5bGU6IG9wdGlvbnMuaW5saW5lU3R5bGUsXG4gICAgICAgIGlubGluZVRlbXBsYXRlOiBvcHRpb25zLmlubGluZVRlbXBsYXRlLFxuICAgICAgICBzcGVjOiAhb3B0aW9ucy5za2lwVGVzdHMsXG4gICAgICAgIHN0eWxlZXh0OiBvcHRpb25zLnN0eWxlLFxuICAgICAgfSA6XG4gICAgICB7XG4gICAgICAgIGlubGluZVN0eWxlOiB0cnVlLFxuICAgICAgICBpbmxpbmVUZW1wbGF0ZTogdHJ1ZSxcbiAgICAgICAgc3BlYzogZmFsc2UsXG4gICAgICAgIHN0eWxlZXh0OiBvcHRpb25zLnN0eWxlLFxuICAgICAgfTtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBvcHRpb25zLnNvdXJjZURpciB8fCAnc3JjJztcblxuICAgIHJldHVybiBjaGFpbihbXG4gICAgICBtZXJnZVdpdGgoXG4gICAgICAgIGFwcGx5KHVybCgnLi9maWxlcycpLCBbXG4gICAgICAgICAgb3B0aW9ucy5taW5pbWFsID8gZmlsdGVyKG1pbmltYWxQYXRoRmlsdGVyKSA6IG5vb3AoKSxcbiAgICAgICAgICBvcHRpb25zLnNraXBHaXQgPyBmaWx0ZXIocGF0aCA9PiAhcGF0aC5lbmRzV2l0aCgnL19fZG90X19naXRpZ25vcmUnKSkgOiBub29wKCksXG4gICAgICAgICAgdGVtcGxhdGUoe1xuICAgICAgICAgICAgdXRpbHM6IHN0cmluZ1V0aWxzLFxuICAgICAgICAgICAgJ2RvdCc6ICcuJyxcbiAgICAgICAgICAgIC4uLm9wdGlvbnMgYXMgb2JqZWN0LFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1vdmUob3B0aW9ucy5kaXJlY3RvcnkpLFxuICAgICAgICBdKSksXG4gICAgICBzY2hlbWF0aWMoJ21vZHVsZScsIHtcbiAgICAgICAgbmFtZTogJ2FwcCcsXG4gICAgICAgIGNvbW1vbk1vZHVsZTogZmFsc2UsXG4gICAgICAgIGZsYXQ6IHRydWUsXG4gICAgICAgIHJvdXRpbmc6IG9wdGlvbnMucm91dGluZyxcbiAgICAgICAgcm91dGluZ1Njb3BlOiAnUm9vdCcsXG4gICAgICAgIHNvdXJjZURpcjogb3B0aW9ucy5kaXJlY3RvcnkgKyAnLycgKyBzb3VyY2VEaXIsXG4gICAgICAgIHNwZWM6IGZhbHNlLFxuICAgICAgfSksXG4gICAgICBzY2hlbWF0aWMoJ2NvbXBvbmVudCcsIHtcbiAgICAgICAgbmFtZTogJ2FwcCcsXG4gICAgICAgIHNlbGVjdG9yOiBhcHBSb290U2VsZWN0b3IsXG4gICAgICAgIHNvdXJjZURpcjogb3B0aW9ucy5kaXJlY3RvcnkgKyAnLycgKyBzb3VyY2VEaXIsXG4gICAgICAgIGZsYXQ6IHRydWUsXG4gICAgICAgIC4uLmNvbXBvbmVudE9wdGlvbnMsXG4gICAgICB9KSxcbiAgICAgIGFkZEJvb3RzdHJhcFRvTmdNb2R1bGUob3B0aW9ucy5kaXJlY3RvcnksIHNvdXJjZURpciksXG4gICAgICBtZXJnZVdpdGgoXG4gICAgICAgIGFwcGx5KHVybCgnLi9vdGhlci1maWxlcycpLCBbXG4gICAgICAgICAgY29tcG9uZW50T3B0aW9ucy5pbmxpbmVUZW1wbGF0ZSA/IGZpbHRlcihwYXRoID0+ICFwYXRoLmVuZHNXaXRoKCcuaHRtbCcpKSA6IG5vb3AoKSxcbiAgICAgICAgICAhY29tcG9uZW50T3B0aW9ucy5zcGVjID8gZmlsdGVyKHBhdGggPT4gIXBhdGguZW5kc1dpdGgoJy5zcGVjLnRzJykpIDogbm9vcCgpLFxuICAgICAgICAgIHRlbXBsYXRlKHtcbiAgICAgICAgICAgIHV0aWxzOiBzdHJpbmdVdGlscyxcbiAgICAgICAgICAgIC4uLm9wdGlvbnMgYXMgYW55LCAgLy8gdHNsaW50OmRpc2FibGUtbGluZTpuby1hbnlcbiAgICAgICAgICAgIHNlbGVjdG9yOiBhcHBSb290U2VsZWN0b3IsXG4gICAgICAgICAgICAuLi5jb21wb25lbnRPcHRpb25zLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1vdmUob3B0aW9ucy5kaXJlY3RvcnkgKyAnLycgKyBzb3VyY2VEaXIgKyAnL2FwcCcpLFxuICAgICAgICBdKSwgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGUpLFxuICAgIF0pKGhvc3QsIGNvbnRleHQpO1xuICB9O1xufVxuIl19