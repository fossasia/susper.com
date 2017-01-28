"use strict";
var syntaxKind_1 = require("../util/syntaxKind");
var urlResolver_1 = require("./urlResolvers/urlResolver");
var pathResolver_1 = require("./urlResolvers/pathResolver");
var logger_1 = require("../util/logger");
var utils_1 = require("../util/utils");
var config_1 = require("./config");
var metadata_1 = require("./metadata");
var kinds = syntaxKind_1.current();
var normalizeTransformed = function (t) {
    if (!t.map) {
        t.source = t.code;
    }
    return t;
};
var MetadataReader = (function () {
    function MetadataReader(_fileResolver, _urlResolver) {
        this._fileResolver = _fileResolver;
        this._urlResolver = _urlResolver;
        this._urlResolver = this._urlResolver || new urlResolver_1.UrlResolver(new pathResolver_1.PathResolver());
    }
    MetadataReader.prototype.read = function (d) {
        var directiveDecorator = null;
        var componentDecorator = null;
        (d.decorators || []).forEach(function (dec) {
            var expr = dec.expression;
            if (expr && expr.kind === kinds.CallExpression && expr.expression) {
                expr = expr.expression;
            }
            var identifier = expr;
            if (expr && expr.kind === kinds.Identifier && identifier.text) {
                if (identifier.text === 'Component') {
                    componentDecorator = dec;
                }
                else if (identifier.text === 'Directive') {
                    directiveDecorator = dec;
                }
            }
        });
        if (directiveDecorator) {
            return this.readDirectiveMetadata(d, directiveDecorator);
        }
        if (componentDecorator) {
            return this.readComponentMetadata(d, componentDecorator);
        }
        return null;
    };
    MetadataReader.prototype.readDirectiveMetadata = function (d, dec) {
        var expr = this.getDecoratorArgument(dec);
        var metadata = new metadata_1.DirectiveMetadata();
        metadata.controller = d;
        metadata.decorator = dec;
        if (!expr) {
            return metadata;
        }
        expr.properties.forEach(function (p) {
            if (p.kind !== kinds.PropertyAssignment) {
                return;
            }
            var prop = p;
            if (prop.name.text === 'selector' && utils_1.isSimpleTemplateString(prop.initializer)) {
                metadata.selector = prop.initializer.text;
            }
        });
        return metadata;
    };
    MetadataReader.prototype.readComponentTemplateMetadata = function (dec, external) {
        var inlineTemplate = utils_1.getDecoratorPropertyInitializer(dec, 'template');
        if (inlineTemplate && utils_1.isSimpleTemplateString(inlineTemplate)) {
            var transformed = normalizeTransformed(config_1.Config.transformTemplate(inlineTemplate.text, null, dec));
            return {
                template: transformed,
                url: null,
                node: inlineTemplate
            };
        }
        else {
            if (external.templateUrl) {
                try {
                    var template = this._fileResolver.resolve(external.templateUrl);
                    var transformed = normalizeTransformed(config_1.Config.transformTemplate(template, external.templateUrl, dec));
                    return {
                        template: transformed,
                        url: external.templateUrl,
                        node: null
                    };
                }
                catch (e) {
                    logger_1.logger.info('Cannot read the external template ' + external.templateUrl);
                }
            }
        }
    };
    MetadataReader.prototype.readComponentStylesMetadata = function (dec, external) {
        var _this = this;
        var inlineStyles = utils_1.getDecoratorPropertyInitializer(dec, 'styles');
        var styles;
        if (inlineStyles && inlineStyles.kind === kinds.ArrayLiteralExpression) {
            inlineStyles.elements.forEach(function (inlineStyle) {
                if (utils_1.isSimpleTemplateString(inlineStyle)) {
                    styles = styles || [];
                    styles.push({
                        style: normalizeTransformed(config_1.Config.transformStyle(inlineStyle.text, null, dec)),
                        url: null,
                        node: inlineStyle,
                    });
                }
            });
        }
        else if (external.styleUrls) {
            try {
                styles = external.styleUrls.map(function (url) {
                    var style = _this._fileResolver.resolve(url);
                    var transformed = normalizeTransformed(config_1.Config.transformStyle(style, url, dec));
                    return {
                        style: transformed, url: url,
                        node: null
                    };
                });
            }
            catch (e) {
                logger_1.logger.info('Unable to read external style. ' + e.toString());
            }
        }
        return styles;
    };
    MetadataReader.prototype.readComponentMetadata = function (d, dec) {
        var expr = this.getDecoratorArgument(dec);
        var metadata = this.readDirectiveMetadata(d, dec);
        var result = new metadata_1.ComponentMetadata();
        result.selector = metadata.selector;
        result.controller = metadata.controller;
        if (!expr) {
            return result;
        }
        var external = this._urlResolver.resolve(dec);
        result.template = this.readComponentTemplateMetadata(dec, external);
        result.styles = this.readComponentStylesMetadata(dec, external);
        return result;
    };
    MetadataReader.prototype.getDecoratorArgument = function (decorator) {
        var expr = decorator.expression;
        if (expr && expr.arguments && expr.arguments.length) {
            var arg = expr.arguments[0];
            if (arg.kind === kinds.ObjectLiteralExpression && arg.properties) {
                return arg;
            }
        }
        return null;
    };
    return MetadataReader;
}());
exports.MetadataReader = MetadataReader;
