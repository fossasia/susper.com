/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ViewEncapsulation } from '@angular/core';
import { CompileStylesheetMetadata, CompileTemplateMetadata } from './compile_metadata';
import { CompilerConfig } from './config';
import { isBlank, isPresent, stringify } from './facade/lang';
import { CompilerInjectable } from './injectable';
import * as html from './ml_parser/ast';
import { HtmlParser } from './ml_parser/html_parser';
import { InterpolationConfig } from './ml_parser/interpolation_config';
import { ResourceLoader } from './resource_loader';
import { extractStyleUrls, isStyleUrlResolvable } from './style_url_resolver';
import { PreparsedElementType, preparseElement } from './template_parser/template_preparser';
import { UrlResolver } from './url_resolver';
import { SyncAsyncResult, SyntaxError } from './util';
export var DirectiveNormalizer = (function () {
    /**
     * @param {?} _resourceLoader
     * @param {?} _urlResolver
     * @param {?} _htmlParser
     * @param {?} _config
     */
    function DirectiveNormalizer(_resourceLoader, _urlResolver, _htmlParser, _config) {
        this._resourceLoader = _resourceLoader;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
        this._config = _config;
        this._resourceLoaderCache = new Map();
    }
    /**
     * @return {?}
     */
    DirectiveNormalizer.prototype.clearCache = function () { this._resourceLoaderCache.clear(); };
    /**
     * @param {?} normalizedDirective
     * @return {?}
     */
    DirectiveNormalizer.prototype.clearCacheFor = function (normalizedDirective) {
        var _this = this;
        if (!normalizedDirective.isComponent) {
            return;
        }
        this._resourceLoaderCache.delete(normalizedDirective.template.templateUrl);
        normalizedDirective.template.externalStylesheets.forEach(function (stylesheet) { _this._resourceLoaderCache.delete(stylesheet.moduleUrl); });
    };
    /**
     * @param {?} url
     * @return {?}
     */
    DirectiveNormalizer.prototype._fetch = function (url) {
        var /** @type {?} */ result = this._resourceLoaderCache.get(url);
        if (!result) {
            result = this._resourceLoader.get(url);
            this._resourceLoaderCache.set(url, result);
        }
        return result;
    };
    /**
     * @param {?} prenormData
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeTemplate = function (prenormData) {
        var _this = this;
        var /** @type {?} */ normalizedTemplateSync = null;
        var /** @type {?} */ normalizedTemplateAsync;
        if (isPresent(prenormData.template)) {
            normalizedTemplateSync = this.normalizeTemplateSync(prenormData);
            normalizedTemplateAsync = Promise.resolve(normalizedTemplateSync);
        }
        else if (prenormData.templateUrl) {
            normalizedTemplateAsync = this.normalizeTemplateAsync(prenormData);
        }
        else {
            throw new SyntaxError("No template specified for component " + stringify(prenormData.componentType));
        }
        if (normalizedTemplateSync && normalizedTemplateSync.styleUrls.length === 0) {
            // sync case
            return new SyncAsyncResult(normalizedTemplateSync);
        }
        else {
            // async case
            return new SyncAsyncResult(null, normalizedTemplateAsync.then(function (normalizedTemplate) { return _this.normalizeExternalStylesheets(normalizedTemplate); }));
        }
    };
    /**
     * @param {?} prenomData
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeTemplateSync = function (prenomData) {
        return this.normalizeLoadedTemplate(prenomData, prenomData.template, prenomData.moduleUrl);
    };
    /**
     * @param {?} prenomData
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeTemplateAsync = function (prenomData) {
        var _this = this;
        var /** @type {?} */ templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, prenomData.templateUrl);
        return this._fetch(templateUrl)
            .then(function (value) { return _this.normalizeLoadedTemplate(prenomData, value, templateUrl); });
    };
    /**
     * @param {?} prenomData
     * @param {?} template
     * @param {?} templateAbsUrl
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeLoadedTemplate = function (prenomData, template, templateAbsUrl) {
        var /** @type {?} */ interpolationConfig = InterpolationConfig.fromArray(prenomData.interpolation);
        var /** @type {?} */ rootNodesAndErrors = this._htmlParser.parse(template, stringify(prenomData.componentType), false, interpolationConfig);
        if (rootNodesAndErrors.errors.length > 0) {
            var /** @type {?} */ errorString = rootNodesAndErrors.errors.join('\n');
            throw new SyntaxError("Template parse errors:\n" + errorString);
        }
        var /** @type {?} */ templateMetadataStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({
            styles: prenomData.styles,
            styleUrls: prenomData.styleUrls,
            moduleUrl: prenomData.moduleUrl
        }));
        var /** @type {?} */ visitor = new TemplatePreparseVisitor();
        html.visitAll(visitor, rootNodesAndErrors.rootNodes);
        var /** @type {?} */ templateStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl }));
        var /** @type {?} */ encapsulation = prenomData.encapsulation;
        if (isBlank(encapsulation)) {
            encapsulation = this._config.defaultEncapsulation;
        }
        var /** @type {?} */ styles = templateMetadataStyles.styles.concat(templateStyles.styles);
        var /** @type {?} */ styleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
        if (encapsulation === ViewEncapsulation.Emulated && styles.length === 0 &&
            styleUrls.length === 0) {
            encapsulation = ViewEncapsulation.None;
        }
        return new CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: template,
            templateUrl: templateAbsUrl, styles: styles, styleUrls: styleUrls,
            ngContentSelectors: visitor.ngContentSelectors,
            animations: prenomData.animations,
            interpolation: prenomData.interpolation,
        });
    };
    /**
     * @param {?} templateMeta
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeExternalStylesheets = function (templateMeta) {
        return this._loadMissingExternalStylesheets(templateMeta.styleUrls)
            .then(function (externalStylesheets) { return new CompileTemplateMetadata({
            encapsulation: templateMeta.encapsulation,
            template: templateMeta.template,
            templateUrl: templateMeta.templateUrl,
            styles: templateMeta.styles,
            styleUrls: templateMeta.styleUrls,
            externalStylesheets: externalStylesheets,
            ngContentSelectors: templateMeta.ngContentSelectors,
            animations: templateMeta.animations,
            interpolation: templateMeta.interpolation
        }); });
    };
    /**
     * @param {?} styleUrls
     * @param {?=} loadedStylesheets
     * @return {?}
     */
    DirectiveNormalizer.prototype._loadMissingExternalStylesheets = function (styleUrls, loadedStylesheets) {
        var _this = this;
        if (loadedStylesheets === void 0) { loadedStylesheets = new Map(); }
        return Promise
            .all(styleUrls.filter(function (styleUrl) { return !loadedStylesheets.has(styleUrl); })
            .map(function (styleUrl) { return _this._fetch(styleUrl).then(function (loadedStyle) {
            var /** @type {?} */ stylesheet = _this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: [loadedStyle], moduleUrl: styleUrl }));
            loadedStylesheets.set(styleUrl, stylesheet);
            return _this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
        }); }))
            .then(function (_) { return Array.from(loadedStylesheets.values()); });
    };
    /**
     * @param {?} stylesheet
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeStylesheet = function (stylesheet) {
        var _this = this;
        var /** @type {?} */ allStyleUrls = stylesheet.styleUrls.filter(isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(stylesheet.moduleUrl, url); });
        var /** @type {?} */ allStyles = stylesheet.styles.map(function (style) {
            var /** @type {?} */ styleWithImports = extractStyleUrls(_this._urlResolver, stylesheet.moduleUrl, style);
            allStyleUrls.push.apply(allStyleUrls, styleWithImports.styleUrls);
            return styleWithImports.style;
        });
        return new CompileStylesheetMetadata({ styles: allStyles, styleUrls: allStyleUrls, moduleUrl: stylesheet.moduleUrl });
    };
    DirectiveNormalizer = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [ResourceLoader, UrlResolver, HtmlParser, CompilerConfig])
    ], DirectiveNormalizer);
    return DirectiveNormalizer;
}());
function DirectiveNormalizer_tsickle_Closure_declarations() {
    /** @type {?} */
    DirectiveNormalizer.prototype._resourceLoaderCache;
    /** @type {?} */
    DirectiveNormalizer.prototype._resourceLoader;
    /** @type {?} */
    DirectiveNormalizer.prototype._urlResolver;
    /** @type {?} */
    DirectiveNormalizer.prototype._htmlParser;
    /** @type {?} */
    DirectiveNormalizer.prototype._config;
}
var TemplatePreparseVisitor = (function () {
    function TemplatePreparseVisitor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitElement = function (ast, context) {
        var /** @type {?} */ preparsedElement = preparseElement(ast);
        switch (preparsedElement.type) {
            case PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case PreparsedElementType.STYLE:
                var /** @type {?} */ textContent_1 = '';
                ast.children.forEach(function (child) {
                    if (child instanceof html.Text) {
                        textContent_1 += child.value;
                    }
                });
                this.styles.push(textContent_1);
                break;
            case PreparsedElementType.STYLESHEET:
                this.styleUrls.push(preparsedElement.hrefAttr);
                break;
            default:
                break;
        }
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount++;
        }
        html.visitAll(this, ast.children);
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount--;
        }
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitComment = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitAttribute = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitText = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitExpansion = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitExpansionCase = function (ast, context) { return null; };
    return TemplatePreparseVisitor;
}());
function TemplatePreparseVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    TemplatePreparseVisitor.prototype.ngContentSelectors;
    /** @type {?} */
    TemplatePreparseVisitor.prototype.styles;
    /** @type {?} */
    TemplatePreparseVisitor.prototype.styleUrls;
    /** @type {?} */
    TemplatePreparseVisitor.prototype.ngNonBindableStackCount;
}
//# sourceMappingURL=directive_normalizer.js.map