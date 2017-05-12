/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ViewEncapsulation } from '@angular/core';
import { analyzeAndValidateNgModules, extractProgramSymbols } from '../aot/compiler';
import { StaticAndDynamicReflectionCapabilities } from '../aot/static_reflection_capabilities';
import { StaticReflector } from '../aot/static_reflector';
import { StaticSymbolCache } from '../aot/static_symbol';
import { StaticSymbolResolver } from '../aot/static_symbol_resolver';
import { AotSummaryResolver } from '../aot/summary_resolver';
import { CompilerConfig } from '../config';
import { DirectiveNormalizer } from '../directive_normalizer';
import { DirectiveResolver } from '../directive_resolver';
import { CompileMetadataResolver } from '../metadata_resolver';
import { HtmlParser } from '../ml_parser/html_parser';
import { InterpolationConfig } from '../ml_parser/interpolation_config';
import { NgModuleResolver } from '../ng_module_resolver';
import { PipeResolver } from '../pipe_resolver';
import { DomElementSchemaRegistry } from '../schema/dom_element_schema_registry';
import { createOfflineCompileUrlResolver } from '../url_resolver';
import { I18NHtmlParser } from './i18n_html_parser';
import { MessageBundle } from './message_bundle';
export var Extractor = (function () {
    /**
     * @param {?} host
     * @param {?} staticSymbolResolver
     * @param {?} messageBundle
     * @param {?} metadataResolver
     */
    function Extractor(host, staticSymbolResolver, messageBundle, metadataResolver) {
        this.host = host;
        this.staticSymbolResolver = staticSymbolResolver;
        this.messageBundle = messageBundle;
        this.metadataResolver = metadataResolver;
    }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    Extractor.prototype.extract = function (rootFiles) {
        var _this = this;
        var /** @type {?} */ programSymbols = extractProgramSymbols(this.staticSymbolResolver, rootFiles, this.host);
        var _a = analyzeAndValidateNgModules(programSymbols, this.host, this.metadataResolver), ngModuleByPipeOrDirective = _a.ngModuleByPipeOrDirective, files = _a.files, ngModules = _a.ngModules;
        return Promise
            .all(ngModules.map(function (ngModule) { return _this.metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () {
            var /** @type {?} */ errors = [];
            files.forEach(function (file) {
                var /** @type {?} */ compMetas = [];
                file.directives.forEach(function (directiveType) {
                    var /** @type {?} */ dirMeta = _this.metadataResolver.getDirectiveMetadata(directiveType);
                    if (dirMeta && dirMeta.isComponent) {
                        compMetas.push(dirMeta);
                    }
                });
                compMetas.forEach(function (compMeta) {
                    var /** @type {?} */ html = compMeta.template.template;
                    var /** @type {?} */ interpolationConfig = InterpolationConfig.fromArray(compMeta.template.interpolation);
                    errors.push.apply(errors, _this.messageBundle.updateFromTemplate(html, file.srcUrl, interpolationConfig));
                });
            });
            if (errors.length) {
                throw new Error(errors.map(function (e) { return e.toString(); }).join('\n'));
            }
            return _this.messageBundle;
        });
    };
    /**
     * @param {?} host
     * @return {?}
     */
    Extractor.create = function (host) {
        var /** @type {?} */ htmlParser = new I18NHtmlParser(new HtmlParser());
        var /** @type {?} */ urlResolver = createOfflineCompileUrlResolver();
        var /** @type {?} */ symbolCache = new StaticSymbolCache();
        var /** @type {?} */ summaryResolver = new AotSummaryResolver(host, symbolCache);
        var /** @type {?} */ staticSymbolResolver = new StaticSymbolResolver(host, symbolCache, summaryResolver);
        var /** @type {?} */ staticReflector = new StaticReflector(staticSymbolResolver);
        StaticAndDynamicReflectionCapabilities.install(staticReflector);
        var /** @type {?} */ config = new CompilerConfig({
            genDebugInfo: false,
            defaultEncapsulation: ViewEncapsulation.Emulated,
            logBindingUpdate: false,
            useJit: false
        });
        var /** @type {?} */ normalizer = new DirectiveNormalizer({ get: function (url) { return host.loadResource(url); } }, urlResolver, htmlParser, config);
        var /** @type {?} */ elementSchemaRegistry = new DomElementSchemaRegistry();
        var /** @type {?} */ resolver = new CompileMetadataResolver(new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, staticReflector);
        // TODO(vicb): implicit tags & attributes
        var /** @type {?} */ messageBundle = new MessageBundle(htmlParser, [], {});
        var /** @type {?} */ extractor = new Extractor(host, staticSymbolResolver, messageBundle, resolver);
        return { extractor: extractor, staticReflector: staticReflector };
    };
    return Extractor;
}());
function Extractor_tsickle_Closure_declarations() {
    /** @type {?} */
    Extractor.prototype.host;
    /** @type {?} */
    Extractor.prototype.staticSymbolResolver;
    /** @type {?} */
    Extractor.prototype.messageBundle;
    /** @type {?} */
    Extractor.prototype.metadataResolver;
}
//# sourceMappingURL=extractor.js.map