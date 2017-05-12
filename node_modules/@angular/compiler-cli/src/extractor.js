/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
/**
 * Extract i18n messages from source code
 */
// Must be imported first, because angular2 decorators throws on load.
require('reflect-metadata');
var compiler = require('@angular/compiler');
var path = require('path');
var compiler_host_1 = require('./compiler_host');
var path_mapped_compiler_host_1 = require('./path_mapped_compiler_host');
var Extractor = (function () {
    function Extractor(options, ngExtractor, host, ngCompilerHost, program) {
        this.options = options;
        this.ngExtractor = ngExtractor;
        this.host = host;
        this.ngCompilerHost = ngCompilerHost;
        this.program = program;
    }
    Extractor.prototype.extract = function (formatName) {
        var _this = this;
        // Checks the format and returns the extension
        var ext = this.getExtension(formatName);
        var promiseBundle = this.extractBundle();
        return promiseBundle.then(function (bundle) {
            var content = _this.serialize(bundle, ext);
            var dstPath = path.join(_this.options.genDir, "messages." + ext);
            _this.host.writeFile(dstPath, content, false);
        });
    };
    Extractor.prototype.extractBundle = function () {
        var _this = this;
        var files = this.program.getSourceFiles().map(function (sf) { return _this.ngCompilerHost.getCanonicalFileName(sf.fileName); });
        return this.ngExtractor.extract(files);
    };
    Extractor.prototype.serialize = function (bundle, ext) {
        var serializer;
        switch (ext) {
            case 'xmb':
                serializer = new compiler.Xmb();
                break;
            case 'xlf':
            default:
                serializer = new compiler.Xliff();
        }
        return bundle.write(serializer);
    };
    Extractor.prototype.getExtension = function (formatName) {
        var format = (formatName || 'xlf').toLowerCase();
        if (format === 'xmb')
            return 'xmb';
        if (format === 'xlf' || format === 'xlif')
            return 'xlf';
        throw new Error('Unsupported format "${formatName}"');
    };
    Extractor.create = function (options, program, tsCompilerHost, compilerHostContext, ngCompilerHost) {
        if (!ngCompilerHost) {
            var usePathMapping = !!options.rootDirs && options.rootDirs.length > 0;
            var context = compilerHostContext || new compiler_host_1.ModuleResolutionHostAdapter(tsCompilerHost);
            ngCompilerHost = usePathMapping ? new path_mapped_compiler_host_1.PathMappedCompilerHost(program, options, context) :
                new compiler_host_1.CompilerHost(program, options, context);
        }
        var ngExtractor = compiler.Extractor.create(ngCompilerHost).extractor;
        return new Extractor(options, ngExtractor, tsCompilerHost, ngCompilerHost, program);
    };
    return Extractor;
}());
exports.Extractor = Extractor;
//# sourceMappingURL=extractor.js.map