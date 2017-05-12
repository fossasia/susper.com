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
import { CompileStylesheetMetadata, identifierModuleUrl, identifierName } from './compile_metadata';
import { CompilerInjectable } from './injectable';
import * as o from './output/output_ast';
import { ShadowCss } from './shadow_css';
import { UrlResolver } from './url_resolver';
var /** @type {?} */ COMPONENT_VARIABLE = '%COMP%';
var /** @type {?} */ HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
var /** @type {?} */ CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
export var StylesCompileDependency = (function () {
    /**
     * @param {?} name
     * @param {?} moduleUrl
     * @param {?} isShimmed
     * @param {?} valuePlaceholder
     */
    function StylesCompileDependency(name, moduleUrl, isShimmed, valuePlaceholder) {
        this.name = name;
        this.moduleUrl = moduleUrl;
        this.isShimmed = isShimmed;
        this.valuePlaceholder = valuePlaceholder;
    }
    return StylesCompileDependency;
}());
function StylesCompileDependency_tsickle_Closure_declarations() {
    /** @type {?} */
    StylesCompileDependency.prototype.name;
    /** @type {?} */
    StylesCompileDependency.prototype.moduleUrl;
    /** @type {?} */
    StylesCompileDependency.prototype.isShimmed;
    /** @type {?} */
    StylesCompileDependency.prototype.valuePlaceholder;
}
export var StylesCompileResult = (function () {
    /**
     * @param {?} componentStylesheet
     * @param {?} externalStylesheets
     */
    function StylesCompileResult(componentStylesheet, externalStylesheets) {
        this.componentStylesheet = componentStylesheet;
        this.externalStylesheets = externalStylesheets;
    }
    return StylesCompileResult;
}());
function StylesCompileResult_tsickle_Closure_declarations() {
    /** @type {?} */
    StylesCompileResult.prototype.componentStylesheet;
    /** @type {?} */
    StylesCompileResult.prototype.externalStylesheets;
}
export var CompiledStylesheet = (function () {
    /**
     * @param {?} statements
     * @param {?} stylesVar
     * @param {?} dependencies
     * @param {?} isShimmed
     * @param {?} meta
     */
    function CompiledStylesheet(statements, stylesVar, dependencies, isShimmed, meta) {
        this.statements = statements;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
        this.isShimmed = isShimmed;
        this.meta = meta;
    }
    return CompiledStylesheet;
}());
function CompiledStylesheet_tsickle_Closure_declarations() {
    /** @type {?} */
    CompiledStylesheet.prototype.statements;
    /** @type {?} */
    CompiledStylesheet.prototype.stylesVar;
    /** @type {?} */
    CompiledStylesheet.prototype.dependencies;
    /** @type {?} */
    CompiledStylesheet.prototype.isShimmed;
    /** @type {?} */
    CompiledStylesheet.prototype.meta;
}
export var StyleCompiler = (function () {
    /**
     * @param {?} _urlResolver
     */
    function StyleCompiler(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new ShadowCss();
    }
    /**
     * @param {?} comp
     * @return {?}
     */
    StyleCompiler.prototype.compileComponent = function (comp) {
        var _this = this;
        var /** @type {?} */ externalStylesheets = [];
        var /** @type {?} */ componentStylesheet = this._compileStyles(comp, new CompileStylesheetMetadata({
            styles: comp.template.styles,
            styleUrls: comp.template.styleUrls,
            moduleUrl: identifierModuleUrl(comp.type)
        }), true);
        comp.template.externalStylesheets.forEach(function (stylesheetMeta) {
            var /** @type {?} */ compiledStylesheet = _this._compileStyles(comp, stylesheetMeta, false);
            externalStylesheets.push(compiledStylesheet);
        });
        return new StylesCompileResult(componentStylesheet, externalStylesheets);
    };
    /**
     * @param {?} comp
     * @param {?} stylesheet
     * @param {?} isComponentStylesheet
     * @return {?}
     */
    StyleCompiler.prototype._compileStyles = function (comp, stylesheet, isComponentStylesheet) {
        var _this = this;
        var /** @type {?} */ shim = comp.template.encapsulation === ViewEncapsulation.Emulated;
        var /** @type {?} */ styleExpressions = stylesheet.styles.map(function (plainStyle) { return o.literal(_this._shimIfNeeded(plainStyle, shim)); });
        var /** @type {?} */ dependencies = [];
        for (var /** @type {?} */ i = 0; i < stylesheet.styleUrls.length; i++) {
            var /** @type {?} */ identifier = { reference: null };
            dependencies.push(new StylesCompileDependency(getStylesVarName(null), stylesheet.styleUrls[i], shim, identifier));
            styleExpressions.push(new o.ExternalExpr(identifier));
        }
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        var /** @type {?} */ stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
        var /** @type {?} */ stmt = o.variable(stylesVar)
            .set(o.literalArr(styleExpressions, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])))
            .toDeclStmt(null, [o.StmtModifier.Final]);
        return new CompiledStylesheet([stmt], stylesVar, dependencies, shim, stylesheet);
    };
    /**
     * @param {?} style
     * @param {?} shim
     * @return {?}
     */
    StyleCompiler.prototype._shimIfNeeded = function (style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    };
    StyleCompiler = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [UrlResolver])
    ], StyleCompiler);
    return StyleCompiler;
}());
function StyleCompiler_tsickle_Closure_declarations() {
    /** @type {?} */
    StyleCompiler.prototype._shadowCss;
    /** @type {?} */
    StyleCompiler.prototype._urlResolver;
}
/**
 * @param {?} component
 * @return {?}
 */
function getStylesVarName(component) {
    var /** @type {?} */ result = "styles";
    if (component) {
        result += "_" + identifierName(component.type);
    }
    return result;
}
//# sourceMappingURL=style_compiler.js.map