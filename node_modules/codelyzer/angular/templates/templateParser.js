"use strict";
var core_1 = require("@angular/core");
var compiler = require("@angular/compiler");
var config_1 = require("../config");
var refId = 0;
var dummyMetadataFactory = function (selector, exportAs) {
    if (refId > 1e10) {
        refId = 0;
    }
    return {
        inputs: {},
        outputs: {},
        hostListeners: {},
        hostProperties: {},
        hostAttributes: {},
        isSummary: true,
        type: {
            diDeps: [],
            lifecycleHooks: [],
            isHost: false,
            reference: ++refId + '-ref'
        },
        isComponent: false,
        selector: selector,
        exportAs: exportAs,
        providers: [],
        viewProviders: [],
        queries: [],
        entryComponents: [],
        changeDetection: 0,
        template: {
            isSummary: true,
            animations: [],
            ngContentSelectors: [],
            encapsulation: 0
        }
    };
};
var defaultDirectives = [];
exports.parseTemplate = function (template, directives) {
    if (directives === void 0) { directives = []; }
    defaultDirectives = directives.map(function (d) { return dummyMetadataFactory(d.selector, d.exportAs); });
    var TemplateParser = compiler.TemplateParser;
    var expressionParser = new compiler.Parser(new compiler.Lexer());
    var elementSchemaRegistry = new compiler.DomElementSchemaRegistry();
    var ngConsole = new core_1.__core_private__.Console();
    var htmlParser = new compiler.I18NHtmlParser(new compiler.HtmlParser());
    var tmplParser = new TemplateParser(expressionParser, elementSchemaRegistry, htmlParser, ngConsole, []);
    var interpolation = config_1.Config.interpolation;
    var summaryKind = (compiler.CompileSummaryKind || {}).Template;
    var templateMetadata = {
        encapsulation: 0,
        template: template,
        templateUrl: '',
        styles: [],
        styleUrls: [],
        ngContentSelectors: [],
        animations: [],
        externalStylesheets: [],
        interpolation: interpolation,
        toSummary: function () {
            return {
                isSummary: true,
                animations: this.animations.map(function (anim) { return anim.name; }),
                ngContentSelectors: this.ngContentSelectors,
                encapsulation: this.encapsulation,
                summaryKind: summaryKind
            };
        }
    };
    var type = {
        diDeps: [],
        lifecycleHooks: [],
        reference: null,
        isHost: false,
        name: '',
        prefix: '',
        moduleUrl: '',
        value: '',
        identifier: null
    };
    return tmplParser.tryParse(compiler.CompileDirectiveMetadata.create({ type: type, template: templateMetadata }), template, defaultDirectives, [], [core_1.NO_ERRORS_SCHEMA], '').templateAst;
};
