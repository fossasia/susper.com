/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var fs = require('fs');
var path = require('path');
var main_1 = require('../src/main');
var test_support_1 = require('./test_support');
describe('tsc-wrapped', function () {
    var basePath;
    var write;
    beforeEach(function () {
        basePath = test_support_1.makeTempDir();
        write = function (fileName, content) {
            fs.writeFileSync(path.join(basePath, fileName), content, { encoding: 'utf-8' });
        };
        write('decorators.ts', '/** @Annotation */ export var Component: Function;');
        write('dep.ts', "\n      export const A = 1;\n      export const B = 2;\n    ");
        write('test.ts', "\n      import {Component} from './decorators';\n      export * from './dep';\n\n      @Component({})\n      export class Comp {\n        /**\n         * Comment that is\n         * multiple lines\n         */\n        method(x: string): void {}\n      }\n    ");
    });
    function readOut(ext) {
        return fs.readFileSync(path.join(basePath, 'built', "test." + ext), { encoding: 'utf-8' });
    }
    it('should report error if project not found', function () {
        main_1.main('not-exist', null)
            .then(function () { return fail('should report error'); })
            .catch(function (e) { return expect(e.message).toContain('ENOENT'); });
    });
    it('should pre-process sources', function (done) {
        write('tsconfig.json', "{\n      \"compilerOptions\": {\n        \"experimentalDecorators\": true,\n        \"types\": [],\n        \"outDir\": \"built\",\n        \"declaration\": true,\n        \"module\": \"es2015\"\n      },\n      \"angularCompilerOptions\": {\n        \"annotateForClosureCompiler\": true\n      },\n      \"files\": [\"test.ts\"]\n    }");
        main_1.main(basePath, { basePath: basePath })
            .then(function () {
            var out = readOut('js');
            // No helpers since decorators were lowered
            expect(out).not.toContain('__decorate');
            // Expand `export *`
            expect(out).toContain('export { A, B }');
            // Annotated for Closure compiler
            expect(out).toContain('* @param {?} x');
            // Comments should stay multi-line
            expect(out).not.toContain('Comment that is multiple lines');
            // Decorator is now an annotation
            expect(out).toMatch(/Comp.decorators = \[\s+\{ type: Component/);
            var decl = readOut('d.ts');
            expect(decl).toContain('declare class Comp');
            var metadata = readOut('metadata.json');
            expect(metadata).toContain('"Comp":{"__symbolic":"class"');
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    it('should allow all options disabled', function (done) {
        write('tsconfig.json', "{\n      \"compilerOptions\": {\n        \"experimentalDecorators\": true,\n        \"types\": [],\n        \"outDir\": \"built\",\n        \"declaration\": false,\n        \"module\": \"es2015\"\n      },\n      \"angularCompilerOptions\": {\n        \"annotateForClosureCompiler\": false,\n        \"annotationsAs\": \"decorators\",\n        \"skipMetadataEmit\": true,\n        \"skipTemplateCodegen\": true\n      },\n      \"files\": [\"test.ts\"]\n    }");
        main_1.main(basePath, { basePath: basePath })
            .then(function () {
            var out = readOut('js');
            // TypeScript's decorator emit
            expect(out).toContain('__decorate');
            // Not annotated for Closure compiler
            expect(out).not.toContain('* @param {?} x');
            expect(function () { return fs.accessSync(path.join(basePath, 'built', 'test.metadata.json')); }).toThrow();
            expect(function () { return fs.accessSync(path.join(basePath, 'built', 'test.d.ts')); }).toThrow();
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    it('should allow JSDoc annotations without decorator downleveling', function (done) {
        write('tsconfig.json', "{\n      \"compilerOptions\": {\n        \"experimentalDecorators\": true,\n        \"types\": [],\n        \"outDir\": \"built\",\n        \"declaration\": true\n      },\n      \"angularCompilerOptions\": {\n        \"annotateForClosureCompiler\": true,\n        \"annotationsAs\": \"decorators\"\n      },\n      \"files\": [\"test.ts\"]\n    }");
        main_1.main(basePath, { basePath: basePath }).then(function () { return done(); }).catch(function (e) { return done.fail(e); });
    });
    xit('should run quickly (performance baseline)', function (done) {
        for (var i = 0; i < 1000; i++) {
            write("input" + i + ".ts", "\n        import {Component} from './decorators';\n        @Component({})\n        export class Input" + i + " {\n          private __brand: string;\n        }\n      ");
        }
        write('tsconfig.json', "{\n      \"compilerOptions\": {\n        \"experimentalDecorators\": true,\n        \"types\": [],\n        \"outDir\": \"built\",\n        \"declaration\": true,\n        \"diagnostics\": true\n      },\n      \"angularCompilerOptions\": {\n        \"annotateForClosureCompiler\": false,\n        \"annotationsAs\": \"decorators\",\n        \"skipMetadataEmit\": true\n      },\n      \"include\": [\"input*.ts\"]\n    }");
        console.time('BASELINE');
        main_1.main(basePath, { basePath: basePath })
            .then(function () {
            console.timeEnd('BASELINE');
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    xit('should run quickly (performance test)', function (done) {
        for (var i = 0; i < 1000; i++) {
            write("input" + i + ".ts", "\n        import {Component} from './decorators';\n        @Component({})\n        export class Input" + i + " {\n          private __brand: string;\n        }\n      ");
        }
        write('tsconfig.json', "{\n      \"compilerOptions\": {\n        \"experimentalDecorators\": true,\n        \"types\": [],\n        \"outDir\": \"built\",\n        \"declaration\": true,\n        \"diagnostics\": true,\n        \"skipLibCheck\": true\n      },\n      \"angularCompilerOptions\": {\n        \"annotateForClosureCompiler\": true\n      },\n      \"include\": [\"input*.ts\"]\n    }");
        console.time('TSICKLE');
        main_1.main(basePath, { basePath: basePath })
            .then(function () {
            console.timeEnd('TSICKLE');
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
});
//# sourceMappingURL=main.spec.js.map