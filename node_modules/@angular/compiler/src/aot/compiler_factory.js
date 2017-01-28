/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ViewEncapsulation } from '@angular/core';
import { AnimationParser } from '../animation/animation_parser';
import { CompilerConfig } from '../config';
import { DirectiveNormalizer } from '../directive_normalizer';
import { DirectiveResolver } from '../directive_resolver';
import { DirectiveWrapperCompiler } from '../directive_wrapper_compiler';
import { Lexer } from '../expression_parser/lexer';
import { Parser } from '../expression_parser/parser';
import { I18NHtmlParser } from '../i18n/i18n_html_parser';
import { CompileMetadataResolver } from '../metadata_resolver';
import { HtmlParser } from '../ml_parser/html_parser';
import { NgModuleCompiler } from '../ng_module_compiler';
import { NgModuleResolver } from '../ng_module_resolver';
import { TypeScriptEmitter } from '../output/ts_emitter';
import { PipeResolver } from '../pipe_resolver';
import { Console } from '../private_import_core';
import { DomElementSchemaRegistry } from '../schema/dom_element_schema_registry';
import { StyleCompiler } from '../style_compiler';
import { TemplateParser } from '../template_parser/template_parser';
import { createOfflineCompileUrlResolver } from '../url_resolver';
import { ViewCompiler } from '../view_compiler/view_compiler';
import { AotCompiler } from './compiler';
import { StaticAndDynamicReflectionCapabilities } from './static_reflection_capabilities';
import { StaticReflector } from './static_reflector';
import { StaticSymbolCache } from './static_symbol';
import { StaticSymbolResolver } from './static_symbol_resolver';
import { AotSummaryResolver } from './summary_resolver';
/**
 *  Creates a new AotCompiler based on options and a host.
 * @param {?} compilerHost
 * @param {?} options
 * @return {?}
 */
export function createAotCompiler(compilerHost, options) {
    var /** @type {?} */ translations = options.translations || '';
    var /** @type {?} */ urlResolver = createOfflineCompileUrlResolver();
    var /** @type {?} */ symbolCache = new StaticSymbolCache();
    var /** @type {?} */ summaryResolver = new AotSummaryResolver(compilerHost, symbolCache);
    var /** @type {?} */ symbolResolver = new StaticSymbolResolver(compilerHost, symbolCache, summaryResolver);
    var /** @type {?} */ staticReflector = new StaticReflector(symbolResolver);
    StaticAndDynamicReflectionCapabilities.install(staticReflector);
    var /** @type {?} */ htmlParser = new I18NHtmlParser(new HtmlParser(), translations, options.i18nFormat);
    var /** @type {?} */ config = new CompilerConfig({
        genDebugInfo: options.debug === true,
        defaultEncapsulation: ViewEncapsulation.Emulated,
        logBindingUpdate: false,
        useJit: false
    });
    var /** @type {?} */ normalizer = new DirectiveNormalizer({ get: function (url) { return compilerHost.loadResource(url); } }, urlResolver, htmlParser, config);
    var /** @type {?} */ expressionParser = new Parser(new Lexer());
    var /** @type {?} */ elementSchemaRegistry = new DomElementSchemaRegistry();
    var /** @type {?} */ console = new Console();
    var /** @type {?} */ tmplParser = new TemplateParser(expressionParser, elementSchemaRegistry, htmlParser, console, []);
    var /** @type {?} */ resolver = new CompileMetadataResolver(new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, staticReflector);
    // TODO(vicb): do not pass options.i18nFormat here
    var /** @type {?} */ compiler = new AotCompiler(compilerHost, resolver, tmplParser, new StyleCompiler(urlResolver), new ViewCompiler(config, elementSchemaRegistry), new DirectiveWrapperCompiler(config, expressionParser, elementSchemaRegistry, console), new NgModuleCompiler(), new TypeScriptEmitter(compilerHost), summaryResolver, options.locale, options.i18nFormat, new AnimationParser(elementSchemaRegistry), symbolResolver);
    return { compiler: compiler, reflector: staticReflector };
}
//# sourceMappingURL=compiler_factory.js.map