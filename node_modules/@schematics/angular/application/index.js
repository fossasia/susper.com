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
                schematics_1.template(Object.assign({ utils: stringUtils }, options, { 'dot': '.', sourcedir: sourceDir })),
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
            schematics_1.schematic('component', Object.assign({ name: 'app', selector: appRootSelector, sourceDir: options.directory + '/' + sourceDir, flat: true, path: options.path }, componentOptions)),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL2FwcGxpY2F0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsMkRBZW9DO0FBQ3BDLGlDQUFpQztBQUNqQywwQ0FBMEM7QUFDMUMsb0RBQStFO0FBQy9FLDhDQUFpRDtBQUlqRCxnQ0FBZ0MsU0FBaUIsRUFBRSxTQUFpQjtJQUNsRSxNQUFNLENBQUMsQ0FBQyxJQUFVO1FBQ2hCLE1BQU0sVUFBVSxHQUFHLEdBQUcsU0FBUyxJQUFJLFNBQVMsb0JBQW9CLENBQUM7UUFDakUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLElBQUksZ0NBQW1CLENBQUMsUUFBUSxVQUFVLGtCQUFrQixDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUNELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFekYsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7UUFFMUMsTUFBTSxhQUFhLEdBQUcsNkJBQWlCLENBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLEVBQ2YsMkJBQTJCLENBQUMsQ0FBQztRQUNyRSxNQUFNLGdCQUFnQixHQUFHLGdDQUFvQixDQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUNkLGVBQWUsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sT0FBTyxHQUFH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QUFTLEdBQUcsR0FBRyxHQUFHLFNBQVM7Z0JBQzlDLElBQUksRUFBRSxLQUFLO2FBQ1osQ0FBQztZQUNGLHNCQUFTLENBQUMsV0FBVyxrQkFDbkIsSUFBSSxFQUFFLEtBQUssRUFDWCxRQUFRLEVBQUUsZUFBZSxFQUN6QixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsU0FBUyxFQUM5QyxJQUFJLEVBQUUsSUFBSSxFQUNWLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxJQUNmLGdCQUFnQixFQUNuQjtZQUNGLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO1lBQ3BELHNCQUFTLENBQ1Asa0JBQUssQ0FBQyxnQkFBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFO2dCQUMxQixnQkFBZ0IsQ0FBQyxjQUFjLEdBQUcsbUJBQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsaUJBQUksRUFBRTtnQkFDbEYsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsbUJBQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsaUJBQUksRUFBRTtnQkFDNUUscUJBQVEsaUJBQ04sS0FBSyxFQUFFLFdBQVcsSUFDZixPQUFjLElBQ2pCLFFBQVEsRUFBRSxlQUFlLElBQ3RCLGdCQUFnQixFQUNuQjtnQkFDRixpQkFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUM7YUFDbkQsQ0FBQyxFQUFFLDBCQUFhLENBQUMsU0FBUyxDQUFDO1NBQy9CLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWpFRCw0QkFpRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBNZXJnZVN0cmF0ZWd5LFxuICBSdWxlLFxuICBTY2hlbWF0aWNDb250ZXh0LFxuICBTY2hlbWF0aWNzRXhjZXB0aW9uLFxuICBUcmVlLFxuICBhcHBseSxcbiAgY2hhaW4sXG4gIGZpbHRlcixcbiAgbWVyZ2VXaXRoLFxuICBtb3ZlLFxuICBub29wLFxuICBzY2hlbWF0aWMsXG4gIHRlbXBsYXRlLFxuICB1cmwsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0ICogYXMgc3RyaW5nVXRpbHMgZnJvbSAnLi4vc3RyaW5ncyc7XG5pbXBvcnQgeyBhZGRCb290c3RyYXBUb01vZHVsZSwgYWRkSW1wb3J0VG9Nb2R1bGUgfSBmcm9tICcuLi91dGlsaXR5L2FzdC11dGlscyc7XG5pbXBvcnQgeyBJbnNlcnRDaGFuZ2UgfSBmcm9tICcuLi91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgQXBwbGljYXRpb25PcHRpb25zIH0gZnJvbSAnLi9zY2hlbWEnO1xuXG5cbmZ1bmN0aW9uIGFkZEJvb3RzdHJhcFRvTmdNb2R1bGUoZGlyZWN0b3J5OiBzdHJpbmcsIHNvdXJjZURpcjogc3RyaW5nKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBgJHtkaXJlY3Rvcnl9LyR7c291cmNlRGlyfS9hcHAvYXBwLm1vZHVsZS50c2A7XG4gICAgY29uc3QgY29udGVudCA9IGhvc3QucmVhZChtb2R1bGVQYXRoKTtcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7bW9kdWxlUGF0aH0gZG9lcyBub3QgZXhpc3QuYCk7XG4gICAgfVxuICAgIGNvbnN0IHNvdXJjZVRleHQgPSBjb250ZW50LnRvU3RyaW5nKCd1dGYtOCcpO1xuICAgIGNvbnN0IHNvdXJjZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUobW9kdWxlUGF0aCwgc291cmNlVGV4dCwgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBjb21wb25lbnRNb2R1bGUgPSAnLi9hcHAuY29tcG9uZW50JztcblxuICAgIGNvbnN0IGltcG9ydENoYW5nZXMgPSBhZGRJbXBvcnRUb01vZHVsZShzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZVBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdCcm93c2VyTW9kdWxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInKTtcbiAgICBjb25zdCBib290c3RyYXBDaGFuZ2VzID0gYWRkQm9vdHN0cmFwVG9Nb2R1bGUoc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQXBwQ29tcG9uZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50TW9kdWxlKTtcbiAgICBjb25zdCBjaGFuZ2VzID0gW1xuICAgICAgLi4uaW1wb3J0Q2hhbmdlcyxcbiAgICAgIC4uLmJvb3RzdHJhcENoYW5nZXMsXG4gICAgXTtcblxuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShtb2R1bGVQYXRoKTtcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG4gICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1pbmltYWxQYXRoRmlsdGVyKHBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCB0b1JlbW92ZUxpc3Q6IFJlZ0V4cFtdID0gWy9lMmVcXC8vLCAvZWRpdG9yY29uZmlnLywgL1JFQURNRS8sIC9rYXJtYS5jb25mLmpzLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvcHJvdHJhY3Rvci5jb25mLmpzLywgL3Rlc3QudHMvLCAvdHNjb25maWcuc3BlYy5qc29uLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvdHNsaW50Lmpzb24vLCAvZmF2aWNvbi5pY28vXTtcblxuICByZXR1cm4gIXRvUmVtb3ZlTGlzdC5zb21lKHJlID0+IHJlLnRlc3QocGF0aCkpO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCBhcHBSb290U2VsZWN0b3IgPSBgJHtvcHRpb25zLnByZWZpeH0tcm9vdGA7XG4gICAgY29uc3QgY29tcG9uZW50T3B0aW9ucyA9ICFvcHRpb25zLm1pbmltYWwgP1xuICAgICAge1xuICAgICAgICBpbmxpbmVTdHlsZTogb3B0aW9ucy5pbmxpbmVTdHlsZSxcbiAgICAgICAgaW5saW5lVGVtcGxhdGU6IG9wdGlvbnMuaW5saW5lVGVtcGxhdGUsXG4gICAgICAgIHNwZWM6ICFvcHRpb25zLnNraXBUZXN0cyxcbiAgICAgICAgc3R5bGVleHQ6IG9wdGlvbnMuc3R5bGUsXG4gICAgICB9IDpcbiAgICAgIHtcbiAgICAgICAgaW5saW5lU3R5bGU6IHRydWUsXG4gICAgICAgIGlubGluZVRlbXBsYXRlOiB0cnVlLFxuICAgICAgICBzcGVjOiBmYWxzZSxcbiAgICAgICAgc3R5bGVleHQ6IG9wdGlvbnMuc3R5bGUsXG4gICAgICB9O1xuICAgIGNvbnN0IHNvdXJjZURpciA9IG9wdGlvbnMuc291cmNlRGlyIHx8ICdzcmMnO1xuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIG1lcmdlV2l0aChcbiAgICAgICAgYXBwbHkodXJsKCcuL2ZpbGVzJyksIFtcbiAgICAgICAgICBvcHRpb25zLm1pbmltYWwgPyBmaWx0ZXIobWluaW1hbFBhdGhGaWx0ZXIpIDogbm9vcCgpLFxuICAgICAgICAgIG9wdGlvbnMuc2tpcEdpdCA/IGZpbHRlcihwYXRoID0+ICFwYXRoLmVuZHNXaXRoKCcvX19kb3RfX2dpdGlnbm9yZScpKSA6IG5vb3AoKSxcbiAgICAgICAgICBvcHRpb25zLnNlcnZpY2VXb3JrZXIgPyBub29wKCkgOiBmaWx0ZXIocGF0aCA9PiAhcGF0aC5lbmRzV2l0aCgnL25nc3ctY29uZmlnLmpzb24nKSksXG4gICAgICAgICAgdGVtcGxhdGUoe1xuICAgICAgICAgICAgdXRpbHM6IHN0cmluZ1V0aWxzLFxuICAgICAgICAgICAgLi4ub3B0aW9ucyBhcyBvYmplY3QsXG4gICAgICAgICAgICAnZG90JzogJy4nLFxuICAgICAgICAgICAgc291cmNlZGlyOiBzb3VyY2VEaXIsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbW92ZShvcHRpb25zLmRpcmVjdG9yeSksXG4gICAgICAgIF0pKSxcbiAgICAgIHNjaGVtYXRpYygnbW9kdWxlJywge1xuICAgICAgICBuYW1lOiAnYXBwJyxcbiAgICAgICAgY29tbW9uTW9kdWxlOiBmYWxzZSxcbiAgICAgICAgZmxhdDogdHJ1ZSxcbiAgICAgICAgcm91dGluZzogb3B0aW9ucy5yb3V0aW5nLFxuICAgICAgICByb3V0aW5nU2NvcGU6ICdSb290JyxcbiAgICAgICAgcGF0aDogb3B0aW9ucy5wYXRoLFxuICAgICAgICBzb3VyY2VEaXI6IG9wdGlvbnMuZGlyZWN0b3J5ICsgJy8nICsgc291cmNlRGlyLFxuICAgICAgICBzcGVjOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgICAgc2NoZW1hdGljKCdjb21wb25lbnQnLCB7XG4gICAgICAgIG5hbWU6ICdhcHAnLFxuICAgICAgICBzZWxlY3RvcjogYXBwUm9vdFNlbGVjdG9yLFxuICAgICAgICBzb3VyY2VEaXI6IG9wdGlvbnMuZGlyZWN0b3J5ICsgJy8nICsgc291cmNlRGlyLFxuICAgICAgICBmbGF0OiB0cnVlLFxuICAgICAgICBwYXRoOiBvcHRpb25zLnBhdGgsXG4gICAgICAgIC4uLmNvbXBvbmVudE9wdGlvbnMsXG4gICAgICB9KSxcbiAgICAgIGFkZEJvb3RzdHJhcFRvTmdNb2R1bGUob3B0aW9ucy5kaXJlY3RvcnksIHNvdXJjZURpciksXG4gICAgICBtZXJnZVdpdGgoXG4gICAgICAgIGFwcGx5KHVybCgnLi9vdGhlci1maWxlcycpLCBbXG4gICAgICAgICAgY29tcG9uZW50T3B0aW9ucy5pbmxpbmVUZW1wbGF0ZSA/IGZpbHRlcihwYXRoID0+ICFwYXRoLmVuZHNXaXRoKCcuaHRtbCcpKSA6IG5vb3AoKSxcbiAgICAgICAgICAhY29tcG9uZW50T3B0aW9ucy5zcGVjID8gZmlsdGVyKHBhdGggPT4gIXBhdGguZW5kc1dpdGgoJy5zcGVjLnRzJykpIDogbm9vcCgpLFxuICAgICAgICAgIHRlbXBsYXRlKHtcbiAgICAgICAgICAgIHV0aWxzOiBzdHJpbmdVdGlscyxcbiAgICAgICAgICAgIC4uLm9wdGlvbnMgYXMgYW55LCAgLy8gdHNsaW50OmRpc2FibGUtbGluZTpuby1hbnlcbiAgICAgICAgICAgIHNlbGVjdG9yOiBhcHBSb290U2VsZWN0b3IsXG4gICAgICAgICAgICAuLi5jb21wb25lbnRPcHRpb25zLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1vdmUob3B0aW9ucy5kaXJlY3RvcnkgKyAnLycgKyBzb3VyY2VEaXIgKyAnL2FwcCcpLFxuICAgICAgICBdKSwgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGUpLFxuICAgIF0pKGhvc3QsIGNvbnRleHQpO1xuICB9O1xufVxuIl19