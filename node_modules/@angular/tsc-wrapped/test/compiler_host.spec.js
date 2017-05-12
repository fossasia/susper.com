/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var ts = require('typescript');
var compiler_host_1 = require('../src/compiler_host');
var test_support_1 = require('./test_support');
describe('Compiler Host', function () {
    function makeProgram(fileName, source) {
        var fn = test_support_1.writeTempFile(fileName, source);
        var opts = {
            target: ts.ScriptTarget.ES5,
            types: [],
            genDir: '/tmp',
            basePath: '/tmp',
            noEmit: true,
        };
        // TsickleCompilerHost wants a ts.Program, which is the result of
        // parsing and typechecking the code before tsickle processing.
        // So we must create and run the entire stack of CompilerHost.
        var host = ts.createCompilerHost(opts);
        var program = ts.createProgram([fn], opts, host);
        // To get types resolved, you must first call getPreEmitDiagnostics.
        var diags = compiler_host_1.formatDiagnostics(ts.getPreEmitDiagnostics(program));
        expect(diags).toEqual('');
        return [program, host, opts];
    }
    it('inserts JSDoc annotations', function () {
        var _a = makeProgram('foo.ts', 'let x: number = 123'), program = _a[0], host = _a[1], opts = _a[2];
        var tsickleHost = new compiler_host_1.TsickleCompilerHost(host, program, opts);
        var f = tsickleHost.getSourceFile(program.getRootFileNames()[0], ts.ScriptTarget.ES5);
        expect(f.text).toContain('/** @type {?} */');
    });
    it('reports diagnostics about existing JSDoc', function () {
        var _a = makeProgram('error.ts', '/** @param {string} x*/ function f(x: string){};'), program = _a[0], host = _a[1], opts = _a[2];
        var tsickleHost = new compiler_host_1.TsickleCompilerHost(host, program, opts);
        var f = tsickleHost.getSourceFile(program.getRootFileNames()[0], ts.ScriptTarget.ES5);
        expect(compiler_host_1.formatDiagnostics(tsickleHost.diagnostics)).toContain('redundant with TypeScript types');
    });
});
//# sourceMappingURL=compiler_host.spec.js.map