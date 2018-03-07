"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
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
        let packageTask;
        if (!options.skipInstall) {
            packageTask = context.addTask(new tasks_1.NodePackageInstallTask(options.directory));
            if (options.linkCli) {
                packageTask = context.addTask(new tasks_1.NodePackageLinkTask('@angular/cli', options.directory), [packageTask]);
            }
        }
        if (!options.skipGit) {
            context.addTask(new tasks_1.RepositoryInitializerTask(options.directory, options.commit), packageTask ? [packageTask] : []);
        }
        return schematics_1.chain([
            schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
                options.minimal ? schematics_1.filter(minimalPathFilter) : schematics_1.noop(),
                options.skipGit ? schematics_1.filter(path => !path.endsWith('/__dot__gitignore')) : schematics_1.noop(),
                options.serviceWorker ? schematics_1.noop() : schematics_1.filter(path => !path.endsWith('/ngsw-config.json')),
                schematics_1.template(Object.assign({ utils: core_1.strings }, options, { 'dot': '.', sourcedir: sourceDir })),
                schematics_1.move(options.directory),
            ])),
            schematics_1.schematic('module', {
                name: 'app',
                commonModule: false,
                flat: true,
                routing: options.routing,
                routingScope: 'Root',
                path: options.path,
                sourceDir: options.directory + '/' + sourceDir,
                spec: false,
            }),
            schematics_1.schematic('component', Object.assign({ name: 'app', selector: appRootSelector, sourceDir: options.directory + '/' + sourceDir, flat: true, path: options.path, skipImport: true }, componentOptions)),
            schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./other-files'), [
                componentOptions.inlineTemplate ? schematics_1.filter(path => !path.endsWith('.html')) : schematics_1.noop(),
                !componentOptions.spec ? schematics_1.filter(path => !path.endsWith('.spec.ts')) : schematics_1.noop(),
                schematics_1.template(Object.assign({ utils: core_1.strings }, options, { selector: appRootSelector }, componentOptions)),
                schematics_1.move(options.directory + '/' + sourceDir + '/app'),
            ]), schematics_1.MergeStrategy.Overwrite),
        ])(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NjaGVtYXRpY3MvYW5ndWxhci9hcHBsaWNhdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUErQztBQUMvQywyREFjb0M7QUFDcEMsNERBSTBDO0FBSTFDLDJCQUEyQixJQUFZO0lBQ3JDLE1BQU0sWUFBWSxHQUFhLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsZUFBZTtRQUNsRCxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsb0JBQW9CO1FBQ3JELGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUU5RCxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFDRCxtQkFBeUIsT0FBMkI7SUFDbEQsTUFBTSxDQUFDLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUMvQyxNQUFNLGVBQWUsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQztRQUNqRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDO2dCQUNFLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztnQkFDaEMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxjQUFjO2dCQUN0QyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUztnQkFDeEIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLO2FBQ3hCLENBQUMsQ0FBQztZQUNIO2dCQUNFLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixjQUFjLEVBQUUsSUFBSTtnQkFDcEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLO2FBQ3hCLENBQUM7UUFDSixNQUFNLFNBQVMsR0FB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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFJLEVBQUU7Z0JBQ2xGLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFJLEVBQUU7Z0JBQzVFLHFCQUFRLGlCQUNOLEtBQUssRUFBRSxjQUFPLElBQ1gsT0FBYyxJQUNqQixRQUFRLEVBQUUsZUFBZSxJQUN0QixnQkFBZ0IsRUFDbkI7Z0JBQ0YsaUJBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDO2FBQ25ELENBQUMsRUFBRSwwQkFBYSxDQUFDLFNBQVMsQ0FBQztTQUMvQixDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFyRkQsNEJBcUZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgc3RyaW5ncyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIE1lcmdlU3RyYXRlZ3ksXG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFRyZWUsXG4gIGFwcGx5LFxuICBjaGFpbixcbiAgZmlsdGVyLFxuICBtZXJnZVdpdGgsXG4gIG1vdmUsXG4gIG5vb3AsXG4gIHNjaGVtYXRpYyxcbiAgdGVtcGxhdGUsXG4gIHVybCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgTm9kZVBhY2thZ2VJbnN0YWxsVGFzayxcbiAgTm9kZVBhY2thZ2VMaW5rVGFzayxcbiAgUmVwb3NpdG9yeUluaXRpYWxpemVyVGFzayxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIEFwcGxpY2F0aW9uT3B0aW9ucyB9IGZyb20gJy4vc2NoZW1hJztcblxuXG5mdW5jdGlvbiBtaW5pbWFsUGF0aEZpbHRlcihwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgdG9SZW1vdmVMaXN0OiBSZWdFeHBbXSA9IFsvZTJlXFwvLywgL2VkaXRvcmNvbmZpZy8sIC9SRUFETUUvLCAva2FybWEuY29uZi5qcy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL3Byb3RyYWN0b3IuY29uZi5qcy8sIC90ZXN0LnRzLywgL3RzY29uZmlnLnNwZWMuanNvbi8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL3RzbGludC5qc29uLywgL2Zhdmljb24uaWNvL107XG5cbiAgcmV0dXJuICF0b1JlbW92ZUxpc3Quc29tZShyZSA9PiByZS50ZXN0KHBhdGgpKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgYXBwUm9vdFNlbGVjdG9yID0gYCR7b3B0aW9ucy5wcmVmaXh9LXJvb3RgO1xuICAgIGNvbnN0IGNvbXBvbmVudE9wdGlvbnMgPSAhb3B0aW9ucy5taW5pbWFsID9cbiAgICAgIHtcbiAgICAgICAgaW5saW5lU3R5bGU6IG9wdGlvbnMuaW5saW5lU3R5bGUsXG4gICAgICAgIGlubGluZVRlbXBsYXRlOiBvcHRpb25zLmlubGluZVRlbXBsYXRlLFxuICAgICAgICBzcGVjOiAhb3B0aW9ucy5za2lwVGVzdHMsXG4gICAgICAgIHN0eWxlZXh0OiBvcHRpb25zLnN0eWxlLFxuICAgICAgfSA6XG4gICAgICB7XG4gICAgICAgIGlubGluZVN0eWxlOiB0cnVlLFxuICAgICAgICBpbmxpbmVUZW1wbGF0ZTogdHJ1ZSxcbiAgICAgICAgc3BlYzogZmFsc2UsXG4gICAgICAgIHN0eWxlZXh0OiBvcHRpb25zLnN0eWxlLFxuICAgICAgfTtcbiAgICBjb25zdCBzb3VyY2VEaXIgPSBvcHRpb25zLnNvdXJjZURpciB8fCAnc3JjJztcblxuICAgIGxldCBwYWNrYWdlVGFzaztcbiAgICBpZiAoIW9wdGlvbnMuc2tpcEluc3RhbGwpIHtcbiAgICAgIHBhY2thZ2VUYXNrID0gY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKG9wdGlvbnMuZGlyZWN0b3J5KSk7XG4gICAgICBpZiAob3B0aW9ucy5saW5rQ2xpKSB7XG4gICAgICAgIHBhY2thZ2VUYXNrID0gY29udGV4dC5hZGRUYXNrKFxuICAgICAgICAgIG5ldyBOb2RlUGFja2FnZUxpbmtUYXNrKCdAYW5ndWxhci9jbGknLCBvcHRpb25zLmRpcmVjdG9yeSksXG4gICAgICAgICAgW3BhY2thZ2VUYXNrXSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLnNraXBHaXQpIHtcbiAgICAgIGNvbnRleHQuYWRkVGFzayhcbiAgICAgICAgbmV3IFJlcG9zaXRvcnlJbml0aWFsaXplclRhc2soXG4gICAgICAgICAgb3B0aW9ucy5kaXJlY3RvcnksXG4gICAgICAgICAgb3B0aW9ucy5jb21taXQsXG4gICAgICAgICksXG4gICAgICAgIHBhY2thZ2VUYXNrID8gW3BhY2thZ2VUYXNrXSA6IFtdLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgbWVyZ2VXaXRoKFxuICAgICAgICBhcHBseSh1cmwoJy4vZmlsZXMnKSwgW1xuICAgICAgICAgIG9wdGlvbnMubWluaW1hbCA/IGZpbHRlcihtaW5pbWFsUGF0aEZpbHRlcikgOiBub29wKCksXG4gICAgICAgICAgb3B0aW9ucy5za2lwR2l0ID8gZmlsdGVyKHBhdGggPT4gIXBhdGguZW5kc1dpdGgoJy9fX2RvdF9fZ2l0aWdub3JlJykpIDogbm9vcCgpLFxuICAgICAgICAgIG9wdGlvbnMuc2VydmljZVdvcmtlciA/IG5vb3AoKSA6IGZpbHRlcihwYXRoID0+ICFwYXRoLmVuZHNXaXRoKCcvbmdzdy1jb25maWcuanNvbicpKSxcbiAgICAgICAgICB0ZW1wbGF0ZSh7XG4gICAgICAgICAgICB1dGlsczogc3RyaW5ncyxcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICAnZG90JzogJy4nLFxuICAgICAgICAgICAgc291cmNlZGlyOiBzb3VyY2VEaXIsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbW92ZShvcHRpb25zLmRpcmVjdG9yeSksXG4gICAgICAgIF0pKSxcbiAgICAgIHNjaGVtYXRpYygnbW9kdWxlJywge1xuICAgICAgICBuYW1lOiAnYXBwJyxcbiAgICAgICAgY29tbW9uTW9kdWxlOiBmYWxzZSxcbiAgICAgICAgZmxhdDogdHJ1ZSxcbiAgICAgICAgcm91dGluZzogb3B0aW9ucy5yb3V0aW5nLFxuICAgICAgICByb3V0aW5nU2NvcGU6ICdSb290JyxcbiAgICAgICAgcGF0aDogb3B0aW9ucy5wYXRoLFxuICAgICAgICBzb3VyY2VEaXI6IG9wdGlvbnMuZGlyZWN0b3J5ICsgJy8nICsgc291cmNlRGlyLFxuICAgICAgICBzcGVjOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgICAgc2NoZW1hdGljKCdjb21wb25lbnQnLCB7XG4gICAgICAgIG5hbWU6ICdhcHAnLFxuICAgICAgICBzZWxlY3RvcjogYXBwUm9vdFNlbGVjdG9yLFxuICAgICAgICBzb3VyY2VEaXI6IG9wdGlvbnMuZGlyZWN0b3J5ICsgJy8nICsgc291cmNlRGlyLFxuICAgICAgICBmbGF0OiB0cnVlLFxuICAgICAgICBwYXRoOiBvcHRpb25zLnBhdGgsXG4gICAgICAgIHNraXBJbXBvcnQ6IHRydWUsXG4gICAgICAgIC4uLmNvbXBvbmVudE9wdGlvbnMsXG4gICAgICB9KSxcbiAgICAgIG1lcmdlV2l0aChcbiAgICAgICAgYXBwbHkodXJsKCcuL290aGVyLWZpbGVzJyksIFtcbiAgICAgICAgICBjb21wb25lbnRPcHRpb25zLmlubGluZVRlbXBsYXRlID8gZmlsdGVyKHBhdGggPT4gIXBhdGguZW5kc1dpdGgoJy5odG1sJykpIDogbm9vcCgpLFxuICAgICAgICAgICFjb21wb25lbnRPcHRpb25zLnNwZWMgPyBmaWx0ZXIocGF0aCA9PiAhcGF0aC5lbmRzV2l0aCgnLnNwZWMudHMnKSkgOiBub29wKCksXG4gICAgICAgICAgdGVtcGxhdGUoe1xuICAgICAgICAgICAgdXRpbHM6IHN0cmluZ3MsXG4gICAgICAgICAgICAuLi5vcHRpb25zIGFzIGFueSwgIC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bm8tYW55XG4gICAgICAgICAgICBzZWxlY3RvcjogYXBwUm9vdFNlbGVjdG9yLFxuICAgICAgICAgICAgLi4uY29tcG9uZW50T3B0aW9ucyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBtb3ZlKG9wdGlvbnMuZGlyZWN0b3J5ICsgJy8nICsgc291cmNlRGlyICsgJy9hcHAnKSxcbiAgICAgICAgXSksIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlKSxcbiAgICBdKShob3N0LCBjb250ZXh0KTtcbiAgfTtcbn1cbiJdfQ==