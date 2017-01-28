/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject, OpaqueToken, Optional } from '@angular/core';
import { identifierName } from '../compile_metadata';
import { Parser } from '../expression_parser/parser';
import { isPresent } from '../facade/lang';
import { I18NHtmlParser } from '../i18n/i18n_html_parser';
import { Identifiers, createIdentifierToken, identifierToken } from '../identifiers';
import { CompilerInjectable } from '../injectable';
import * as html from '../ml_parser/ast';
import { ParseTreeResult } from '../ml_parser/html_parser';
import { expandNodes } from '../ml_parser/icu_ast_expander';
import { InterpolationConfig } from '../ml_parser/interpolation_config';
import { splitNsName } from '../ml_parser/tags';
import { ParseError, ParseErrorLevel, ParseSourceSpan } from '../parse_util';
import { Console } from '../private_import_core';
import { ProviderElementContext, ProviderViewContext } from '../provider_analyzer';
import { ElementSchemaRegistry } from '../schema/element_schema_registry';
import { CssSelector, SelectorMatcher } from '../selector';
import { isStyleUrlResolvable } from '../style_url_resolver';
import { SyntaxError } from '../util';
import { BindingParser } from './binding_parser';
import { AttrAst, BoundDirectivePropertyAst, BoundTextAst, DirectiveAst, ElementAst, EmbeddedTemplateAst, NgContentAst, PropertyBindingType, ReferenceAst, TextAst, VariableAst, templateVisitAll } from './template_ast';
import { PreparsedElementType, preparseElement } from './template_preparser';
// Group 1 = "bind-"
// Group 2 = "let-"
// Group 3 = "ref-/#"
// Group 4 = "on-"
// Group 5 = "bindon-"
// Group 6 = "@"
// Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
// Group 8 = identifier inside [()]
// Group 9 = identifier inside []
// Group 10 = identifier inside ()
var /** @type {?} */ BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
var /** @type {?} */ KW_BIND_IDX = 1;
var /** @type {?} */ KW_LET_IDX = 2;
var /** @type {?} */ KW_REF_IDX = 3;
var /** @type {?} */ KW_ON_IDX = 4;
var /** @type {?} */ KW_BINDON_IDX = 5;
var /** @type {?} */ KW_AT_IDX = 6;
var /** @type {?} */ IDENT_KW_IDX = 7;
var /** @type {?} */ IDENT_BANANA_BOX_IDX = 8;
var /** @type {?} */ IDENT_PROPERTY_IDX = 9;
var /** @type {?} */ IDENT_EVENT_IDX = 10;
var /** @type {?} */ TEMPLATE_ELEMENT = 'template';
var /** @type {?} */ TEMPLATE_ATTR = 'template';
var /** @type {?} */ TEMPLATE_ATTR_PREFIX = '*';
var /** @type {?} */ CLASS_ATTR = 'class';
var /** @type {?} */ TEXT_CSS_SELECTOR = CssSelector.parse('*')[0];
/**
 * Provides an array of {@link TemplateAstVisitor}s which will be used to transform
 * parsed templates before compilation is invoked, allowing custom expression syntax
 * and other advanced transformations.
 *
 * This is currently an internal-only feature and not meant for general use.
 */
export var /** @type {?} */ TEMPLATE_TRANSFORMS = new OpaqueToken('TemplateTransforms');
export var TemplateParseError = (function (_super) {
    __extends(TemplateParseError, _super);
    /**
     * @param {?} message
     * @param {?} span
     * @param {?} level
     */
    function TemplateParseError(message, span, level) {
        _super.call(this, span, message, level);
    }
    return TemplateParseError;
}(ParseError));
export var TemplateParseResult = (function () {
    /**
     * @param {?=} templateAst
     * @param {?=} errors
     */
    function TemplateParseResult(templateAst, errors) {
        this.templateAst = templateAst;
        this.errors = errors;
    }
    return TemplateParseResult;
}());
function TemplateParseResult_tsickle_Closure_declarations() {
    /** @type {?} */
    TemplateParseResult.prototype.templateAst;
    /** @type {?} */
    TemplateParseResult.prototype.errors;
}
export var TemplateParser = (function () {
    /**
     * @param {?} _exprParser
     * @param {?} _schemaRegistry
     * @param {?} _htmlParser
     * @param {?} _console
     * @param {?} transforms
     */
    function TemplateParser(_exprParser, _schemaRegistry, _htmlParser, _console, transforms) {
        this._exprParser = _exprParser;
        this._schemaRegistry = _schemaRegistry;
        this._htmlParser = _htmlParser;
        this._console = _console;
        this.transforms = transforms;
    }
    /**
     * @param {?} component
     * @param {?} template
     * @param {?} directives
     * @param {?} pipes
     * @param {?} schemas
     * @param {?} templateUrl
     * @return {?}
     */
    TemplateParser.prototype.parse = function (component, template, directives, pipes, schemas, templateUrl) {
        var /** @type {?} */ result = this.tryParse(component, template, directives, pipes, schemas, templateUrl);
        var /** @type {?} */ warnings = result.errors.filter(function (error) { return error.level === ParseErrorLevel.WARNING; });
        var /** @type {?} */ errors = result.errors.filter(function (error) { return error.level === ParseErrorLevel.FATAL; });
        if (warnings.length > 0) {
            this._console.warn("Template parse warnings:\n" + warnings.join('\n'));
        }
        if (errors.length > 0) {
            var /** @type {?} */ errorString = errors.join('\n');
            throw new SyntaxError("Template parse errors:\n" + errorString);
        }
        return result.templateAst;
    };
    /**
     * @param {?} component
     * @param {?} template
     * @param {?} directives
     * @param {?} pipes
     * @param {?} schemas
     * @param {?} templateUrl
     * @return {?}
     */
    TemplateParser.prototype.tryParse = function (component, template, directives, pipes, schemas, templateUrl) {
        return this.tryParseHtml(this.expandHtml(this._htmlParser.parse(template, templateUrl, true, this.getInterpolationConfig(component))), component, template, directives, pipes, schemas, templateUrl);
    };
    /**
     * @param {?} htmlAstWithErrors
     * @param {?} component
     * @param {?} template
     * @param {?} directives
     * @param {?} pipes
     * @param {?} schemas
     * @param {?} templateUrl
     * @return {?}
     */
    TemplateParser.prototype.tryParseHtml = function (htmlAstWithErrors, component, template, directives, pipes, schemas, templateUrl) {
        var /** @type {?} */ result;
        var /** @type {?} */ errors = htmlAstWithErrors.errors;
        if (htmlAstWithErrors.rootNodes.length > 0) {
            var /** @type {?} */ uniqDirectives = removeSummaryDuplicates(directives);
            var /** @type {?} */ uniqPipes = removeSummaryDuplicates(pipes);
            var /** @type {?} */ providerViewContext = new ProviderViewContext(component, htmlAstWithErrors.rootNodes[0].sourceSpan);
            var /** @type {?} */ interpolationConfig = void 0;
            if (component.template && component.template.interpolation) {
                interpolationConfig = {
                    start: component.template.interpolation[0],
                    end: component.template.interpolation[1]
                };
            }
            var /** @type {?} */ bindingParser = new BindingParser(this._exprParser, interpolationConfig, this._schemaRegistry, uniqPipes, errors);
            var /** @type {?} */ parseVisitor = new TemplateParseVisitor(providerViewContext, uniqDirectives, bindingParser, this._schemaRegistry, schemas, errors);
            result = html.visitAll(parseVisitor, htmlAstWithErrors.rootNodes, EMPTY_ELEMENT_CONTEXT);
            errors.push.apply(errors, providerViewContext.errors);
        }
        else {
            result = [];
        }
        this._assertNoReferenceDuplicationOnTemplate(result, errors);
        if (errors.length > 0) {
            return new TemplateParseResult(result, errors);
        }
        if (isPresent(this.transforms)) {
            this.transforms.forEach(function (transform) { result = templateVisitAll(transform, result); });
        }
        return new TemplateParseResult(result, errors);
    };
    /**
     * @param {?} htmlAstWithErrors
     * @param {?=} forced
     * @return {?}
     */
    TemplateParser.prototype.expandHtml = function (htmlAstWithErrors, forced) {
        if (forced === void 0) { forced = false; }
        var /** @type {?} */ errors = htmlAstWithErrors.errors;
        if (errors.length == 0 || forced) {
            // Transform ICU messages to angular directives
            var /** @type {?} */ expandedHtmlAst = expandNodes(htmlAstWithErrors.rootNodes);
            errors.push.apply(errors, expandedHtmlAst.errors);
            htmlAstWithErrors = new ParseTreeResult(expandedHtmlAst.nodes, errors);
        }
        return htmlAstWithErrors;
    };
    /**
     * @param {?} component
     * @return {?}
     */
    TemplateParser.prototype.getInterpolationConfig = function (component) {
        if (component.template) {
            return InterpolationConfig.fromArray(component.template.interpolation);
        }
    };
    /**
     * @param {?} result
     * @param {?} errors
     * @return {?}
     */
    TemplateParser.prototype._assertNoReferenceDuplicationOnTemplate = function (result, errors) {
        var /** @type {?} */ existingReferences = [];
        result.filter(function (element) { return !!((element)).references; })
            .forEach(function (element) { return ((element)).references.forEach(function (reference) {
            var /** @type {?} */ name = reference.name;
            if (existingReferences.indexOf(name) < 0) {
                existingReferences.push(name);
            }
            else {
                var /** @type {?} */ error = new TemplateParseError("Reference \"#" + name + "\" is defined several times", reference.sourceSpan, ParseErrorLevel.FATAL);
                errors.push(error);
            }
        }); });
    };
    /** @nocollapse */
    TemplateParser.ctorParameters = function () { return [
        { type: Parser, },
        { type: ElementSchemaRegistry, },
        { type: I18NHtmlParser, },
        { type: Console, },
        { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [TEMPLATE_TRANSFORMS,] },] },
    ]; };
    TemplateParser = __decorate([
        CompilerInjectable(), 
        __metadata('design:paramtypes', [Parser, ElementSchemaRegistry, I18NHtmlParser, Console, Array])
    ], TemplateParser);
    return TemplateParser;
}());
function TemplateParser_tsickle_Closure_declarations() {
    /**
     * @nocollapse
     * @type {?}
     */
    TemplateParser.ctorParameters;
    /** @type {?} */
    TemplateParser.prototype._exprParser;
    /** @type {?} */
    TemplateParser.prototype._schemaRegistry;
    /** @type {?} */
    TemplateParser.prototype._htmlParser;
    /** @type {?} */
    TemplateParser.prototype._console;
    /** @type {?} */
    TemplateParser.prototype.transforms;
}
var TemplateParseVisitor = (function () {
    /**
     * @param {?} providerViewContext
     * @param {?} directives
     * @param {?} _bindingParser
     * @param {?} _schemaRegistry
     * @param {?} _schemas
     * @param {?} _targetErrors
     */
    function TemplateParseVisitor(providerViewContext, directives, _bindingParser, _schemaRegistry, _schemas, _targetErrors) {
        var _this = this;
        this.providerViewContext = providerViewContext;
        this._bindingParser = _bindingParser;
        this._schemaRegistry = _schemaRegistry;
        this._schemas = _schemas;
        this._targetErrors = _targetErrors;
        this.selectorMatcher = new SelectorMatcher();
        this.directivesIndex = new Map();
        this.ngContentCount = 0;
        directives.forEach(function (directive, index) {
            var selector = CssSelector.parse(directive.selector);
            _this.selectorMatcher.addSelectables(selector, directive);
            _this.directivesIndex.set(directive, index);
        });
    }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitExpansion = function (expansion, context) { return null; };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitExpansionCase = function (expansionCase, context) { return null; };
    /**
     * @param {?} text
     * @param {?} parent
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitText = function (text, parent) {
        var /** @type {?} */ ngContentIndex = parent.findNgContentIndex(TEXT_CSS_SELECTOR);
        var /** @type {?} */ expr = this._bindingParser.parseInterpolation(text.value, text.sourceSpan);
        if (isPresent(expr)) {
            return new BoundTextAst(expr, ngContentIndex, text.sourceSpan);
        }
        else {
            return new TextAst(text.value, ngContentIndex, text.sourceSpan);
        }
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitAttribute = function (attribute, context) {
        return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitComment = function (comment, context) { return null; };
    /**
     * @param {?} element
     * @param {?} parent
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitElement = function (element, parent) {
        var _this = this;
        var /** @type {?} */ nodeName = element.name;
        var /** @type {?} */ preparsedElement = preparseElement(element);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE) {
            // Skipping <script> for security reasons
            // Skipping <style> as we already processed them
            // in the StyleCompiler
            return null;
        }
        if (preparsedElement.type === PreparsedElementType.STYLESHEET &&
            isStyleUrlResolvable(preparsedElement.hrefAttr)) {
            // Skipping stylesheets with either relative urls or package scheme as we already processed
            // them in the StyleCompiler
            return null;
        }
        var /** @type {?} */ matchableAttrs = [];
        var /** @type {?} */ elementOrDirectiveProps = [];
        var /** @type {?} */ elementOrDirectiveRefs = [];
        var /** @type {?} */ elementVars = [];
        var /** @type {?} */ events = [];
        var /** @type {?} */ templateElementOrDirectiveProps = [];
        var /** @type {?} */ templateMatchableAttrs = [];
        var /** @type {?} */ templateElementVars = [];
        var /** @type {?} */ hasInlineTemplates = false;
        var /** @type {?} */ attrs = [];
        var /** @type {?} */ lcElName = splitNsName(nodeName.toLowerCase())[1];
        var /** @type {?} */ isTemplateElement = lcElName == TEMPLATE_ELEMENT;
        element.attrs.forEach(function (attr) {
            var /** @type {?} */ hasBinding = _this._parseAttr(isTemplateElement, attr, matchableAttrs, elementOrDirectiveProps, events, elementOrDirectiveRefs, elementVars);
            var /** @type {?} */ templateBindingsSource = undefined;
            var /** @type {?} */ prefixToken = undefined;
            if (_this._normalizeAttributeName(attr.name) == TEMPLATE_ATTR) {
                templateBindingsSource = attr.value;
            }
            else if (attr.name.startsWith(TEMPLATE_ATTR_PREFIX)) {
                templateBindingsSource = attr.value;
                prefixToken = attr.name.substring(TEMPLATE_ATTR_PREFIX.length); // remove the star
            }
            var /** @type {?} */ hasTemplateBinding = isPresent(templateBindingsSource);
            if (hasTemplateBinding) {
                if (hasInlineTemplates) {
                    _this._reportError("Can't have multiple template bindings on one element. Use only one attribute named 'template' or prefixed with *", attr.sourceSpan);
                }
                hasInlineTemplates = true;
                _this._bindingParser.parseInlineTemplateBinding(attr.name, prefixToken, templateBindingsSource, attr.sourceSpan, templateMatchableAttrs, templateElementOrDirectiveProps, templateElementVars);
            }
            if (!hasBinding && !hasTemplateBinding) {
                // don't include the bindings as attributes as well in the AST
                attrs.push(_this.visitAttribute(attr, null));
                matchableAttrs.push([attr.name, attr.value]);
            }
        });
        var /** @type {?} */ elementCssSelector = createElementCssSelector(nodeName, matchableAttrs);
        var _a = this._parseDirectives(this.selectorMatcher, elementCssSelector), directiveMetas = _a.directives, matchElement = _a.matchElement;
        var /** @type {?} */ references = [];
        var /** @type {?} */ directiveAsts = this._createDirectiveAsts(isTemplateElement, element.name, directiveMetas, elementOrDirectiveProps, elementOrDirectiveRefs, element.sourceSpan, references);
        var /** @type {?} */ elementProps = this._createElementPropertyAsts(element.name, elementOrDirectiveProps, directiveAsts);
        var /** @type {?} */ isViewRoot = parent.isTemplateElement || hasInlineTemplates;
        var /** @type {?} */ providerContext = new ProviderElementContext(this.providerViewContext, parent.providerContext, isViewRoot, directiveAsts, attrs, references, element.sourceSpan);
        var /** @type {?} */ children = html.visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children, ElementContext.create(isTemplateElement, directiveAsts, isTemplateElement ? parent.providerContext : providerContext));
        providerContext.afterElement();
        // Override the actual selector when the `ngProjectAs` attribute is provided
        var /** @type {?} */ projectionSelector = isPresent(preparsedElement.projectAs) ?
            CssSelector.parse(preparsedElement.projectAs)[0] :
            elementCssSelector;
        var /** @type {?} */ ngContentIndex = parent.findNgContentIndex(projectionSelector);
        var /** @type {?} */ parsedElement;
        if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
            if (element.children && !element.children.every(_isEmptyTextNode)) {
                this._reportError("<ng-content> element cannot have content.", element.sourceSpan);
            }
            parsedElement = new NgContentAst(this.ngContentCount++, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
        }
        else if (isTemplateElement) {
            this._assertAllEventsPublishedByDirectives(directiveAsts, events);
            this._assertNoComponentsNorElementBindingsOnTemplate(directiveAsts, elementProps, element.sourceSpan);
            parsedElement = new EmbeddedTemplateAst(attrs, events, references, elementVars, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, children, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
        }
        else {
            this._assertElementExists(matchElement, element);
            this._assertOnlyOneComponent(directiveAsts, element.sourceSpan);
            var /** @type {?} */ ngContentIndex_1 = hasInlineTemplates ? null : parent.findNgContentIndex(projectionSelector);
            parsedElement = new ElementAst(nodeName, attrs, elementProps, events, references, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, children, hasInlineTemplates ? null : ngContentIndex_1, element.sourceSpan, element.endSourceSpan);
            this._findComponentDirectives(directiveAsts)
                .forEach(function (componentDirectiveAst) { return _this._validateElementAnimationInputOutputs(componentDirectiveAst.hostProperties, componentDirectiveAst.hostEvents, componentDirectiveAst.directive.template); });
            var /** @type {?} */ componentTemplate = providerContext.viewContext.component.template;
            this._validateElementAnimationInputOutputs(elementProps, events, componentTemplate.toSummary());
        }
        if (hasInlineTemplates) {
            var /** @type {?} */ templateCssSelector = createElementCssSelector(TEMPLATE_ELEMENT, templateMatchableAttrs);
            var templateDirectiveMetas = this._parseDirectives(this.selectorMatcher, templateCssSelector).directives;
            var /** @type {?} */ templateDirectiveAsts = this._createDirectiveAsts(true, element.name, templateDirectiveMetas, templateElementOrDirectiveProps, [], element.sourceSpan, []);
            var /** @type {?} */ templateElementProps = this._createElementPropertyAsts(element.name, templateElementOrDirectiveProps, templateDirectiveAsts);
            this._assertNoComponentsNorElementBindingsOnTemplate(templateDirectiveAsts, templateElementProps, element.sourceSpan);
            var /** @type {?} */ templateProviderContext = new ProviderElementContext(this.providerViewContext, parent.providerContext, parent.isTemplateElement, templateDirectiveAsts, [], [], element.sourceSpan);
            templateProviderContext.afterElement();
            parsedElement = new EmbeddedTemplateAst([], [], [], templateElementVars, templateProviderContext.transformedDirectiveAsts, templateProviderContext.transformProviders, templateProviderContext.transformedHasViewContainer, [parsedElement], ngContentIndex, element.sourceSpan);
        }
        return parsedElement;
    };
    /**
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} template
     * @return {?}
     */
    TemplateParseVisitor.prototype._validateElementAnimationInputOutputs = function (inputs, outputs, template) {
        var _this = this;
        var /** @type {?} */ triggerLookup = new Set();
        template.animations.forEach(function (entry) { triggerLookup.add(entry); });
        var /** @type {?} */ animationInputs = inputs.filter(function (input) { return input.isAnimation; });
        animationInputs.forEach(function (input) {
            var /** @type {?} */ name = input.name;
            if (!triggerLookup.has(name)) {
                _this._reportError("Couldn't find an animation entry for \"" + name + "\"", input.sourceSpan);
            }
        });
        outputs.forEach(function (output) {
            if (output.isAnimation) {
                var /** @type {?} */ found = animationInputs.find(function (input) { return input.name == output.name; });
                if (!found) {
                    _this._reportError("Unable to listen on (@" + output.name + "." + output.phase + ") because the animation trigger [@" + output.name + "] isn't being used on the same element", output.sourceSpan);
                }
            }
        });
    };
    /**
     * @param {?} isTemplateElement
     * @param {?} attr
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @param {?} targetEvents
     * @param {?} targetRefs
     * @param {?} targetVars
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseAttr = function (isTemplateElement, attr, targetMatchableAttrs, targetProps, targetEvents, targetRefs, targetVars) {
        var /** @type {?} */ name = this._normalizeAttributeName(attr.name);
        var /** @type {?} */ value = attr.value;
        var /** @type {?} */ srcSpan = attr.sourceSpan;
        var /** @type {?} */ bindParts = name.match(BIND_NAME_REGEXP);
        var /** @type {?} */ hasBinding = false;
        if (bindParts !== null) {
            hasBinding = true;
            if (isPresent(bindParts[KW_BIND_IDX])) {
                this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
            }
            else if (bindParts[KW_LET_IDX]) {
                if (isTemplateElement) {
                    var /** @type {?} */ identifier = bindParts[IDENT_KW_IDX];
                    this._parseVariable(identifier, value, srcSpan, targetVars);
                }
                else {
                    this._reportError("\"let-\" is only supported on template elements.", srcSpan);
                }
            }
            else if (bindParts[KW_REF_IDX]) {
                var /** @type {?} */ identifier = bindParts[IDENT_KW_IDX];
                this._parseReference(identifier, value, srcSpan, targetRefs);
            }
            else if (bindParts[KW_ON_IDX]) {
                this._bindingParser.parseEvent(bindParts[IDENT_KW_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
            }
            else if (bindParts[KW_BINDON_IDX]) {
                this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                this._parseAssignmentEvent(bindParts[IDENT_KW_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
            }
            else if (bindParts[KW_AT_IDX]) {
                this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
            }
            else if (bindParts[IDENT_BANANA_BOX_IDX]) {
                this._bindingParser.parsePropertyBinding(bindParts[IDENT_BANANA_BOX_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                this._parseAssignmentEvent(bindParts[IDENT_BANANA_BOX_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
            }
            else if (bindParts[IDENT_PROPERTY_IDX]) {
                this._bindingParser.parsePropertyBinding(bindParts[IDENT_PROPERTY_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
            }
            else if (bindParts[IDENT_EVENT_IDX]) {
                this._bindingParser.parseEvent(bindParts[IDENT_EVENT_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
            }
        }
        else {
            hasBinding = this._bindingParser.parsePropertyInterpolation(name, value, srcSpan, targetMatchableAttrs, targetProps);
        }
        if (!hasBinding) {
            this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
        }
        return hasBinding;
    };
    /**
     * @param {?} attrName
     * @return {?}
     */
    TemplateParseVisitor.prototype._normalizeAttributeName = function (attrName) {
        return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
    };
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetVars
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseVariable = function (identifier, value, sourceSpan, targetVars) {
        if (identifier.indexOf('-') > -1) {
            this._reportError("\"-\" is not allowed in variable names", sourceSpan);
        }
        targetVars.push(new VariableAst(identifier, value, sourceSpan));
    };
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetRefs
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseReference = function (identifier, value, sourceSpan, targetRefs) {
        if (identifier.indexOf('-') > -1) {
            this._reportError("\"-\" is not allowed in reference names", sourceSpan);
        }
        targetRefs.push(new ElementOrDirectiveRef(identifier, value, sourceSpan));
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetEvents
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseAssignmentEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        this._bindingParser.parseEvent(name + "Change", expression + "=$event", sourceSpan, targetMatchableAttrs, targetEvents);
    };
    /**
     * @param {?} selectorMatcher
     * @param {?} elementCssSelector
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseDirectives = function (selectorMatcher, elementCssSelector) {
        var _this = this;
        // Need to sort the directives so that we get consistent results throughout,
        // as selectorMatcher uses Maps inside.
        // Also deduplicate directives as they might match more than one time!
        var /** @type {?} */ directives = new Array(this.directivesIndex.size);
        // Whether any directive selector matches on the element name
        var /** @type {?} */ matchElement = false;
        selectorMatcher.match(elementCssSelector, function (selector, directive) {
            directives[_this.directivesIndex.get(directive)] = directive;
            matchElement = matchElement || selector.hasElementSelector();
        });
        return {
            directives: directives.filter(function (dir) { return !!dir; }),
            matchElement: matchElement,
        };
    };
    /**
     * @param {?} isTemplateElement
     * @param {?} elementName
     * @param {?} directives
     * @param {?} props
     * @param {?} elementOrDirectiveRefs
     * @param {?} elementSourceSpan
     * @param {?} targetReferences
     * @return {?}
     */
    TemplateParseVisitor.prototype._createDirectiveAsts = function (isTemplateElement, elementName, directives, props, elementOrDirectiveRefs, elementSourceSpan, targetReferences) {
        var _this = this;
        var /** @type {?} */ matchedReferences = new Set();
        var /** @type {?} */ component = null;
        var /** @type {?} */ directiveAsts = directives.map(function (directive) {
            var /** @type {?} */ sourceSpan = new ParseSourceSpan(elementSourceSpan.start, elementSourceSpan.end, "Directive " + identifierName(directive.type));
            if (directive.isComponent) {
                component = directive;
            }
            var /** @type {?} */ directiveProperties = [];
            var /** @type {?} */ hostProperties = _this._bindingParser.createDirectiveHostPropertyAsts(directive, sourceSpan);
            // Note: We need to check the host properties here as well,
            // as we don't know the element name in the DirectiveWrapperCompiler yet.
            _this._checkPropertiesInSchema(elementName, hostProperties);
            var /** @type {?} */ hostEvents = _this._bindingParser.createDirectiveHostEventAsts(directive, sourceSpan);
            _this._createDirectivePropertyAsts(directive.inputs, props, directiveProperties);
            elementOrDirectiveRefs.forEach(function (elOrDirRef) {
                if ((elOrDirRef.value.length === 0 && directive.isComponent) ||
                    (directive.exportAs == elOrDirRef.value)) {
                    targetReferences.push(new ReferenceAst(elOrDirRef.name, identifierToken(directive.type), elOrDirRef.sourceSpan));
                    matchedReferences.add(elOrDirRef.name);
                }
            });
            return new DirectiveAst(directive, directiveProperties, hostProperties, hostEvents, sourceSpan);
        });
        elementOrDirectiveRefs.forEach(function (elOrDirRef) {
            if (elOrDirRef.value.length > 0) {
                if (!matchedReferences.has(elOrDirRef.name)) {
                    _this._reportError("There is no directive with \"exportAs\" set to \"" + elOrDirRef.value + "\"", elOrDirRef.sourceSpan);
                }
            }
            else if (!component) {
                var /** @type {?} */ refToken = null;
                if (isTemplateElement) {
                    refToken = createIdentifierToken(Identifiers.TemplateRef);
                }
                targetReferences.push(new ReferenceAst(elOrDirRef.name, refToken, elOrDirRef.sourceSpan));
            }
        }); // fix syntax highlighting issue: `
        return directiveAsts;
    };
    /**
     * @param {?} directiveProperties
     * @param {?} boundProps
     * @param {?} targetBoundDirectiveProps
     * @return {?}
     */
    TemplateParseVisitor.prototype._createDirectivePropertyAsts = function (directiveProperties, boundProps, targetBoundDirectiveProps) {
        if (directiveProperties) {
            var /** @type {?} */ boundPropsByName_1 = new Map();
            boundProps.forEach(function (boundProp) {
                var /** @type {?} */ prevValue = boundPropsByName_1.get(boundProp.name);
                if (!prevValue || prevValue.isLiteral) {
                    // give [a]="b" a higher precedence than a="b" on the same element
                    boundPropsByName_1.set(boundProp.name, boundProp);
                }
            });
            Object.keys(directiveProperties).forEach(function (dirProp) {
                var /** @type {?} */ elProp = directiveProperties[dirProp];
                var /** @type {?} */ boundProp = boundPropsByName_1.get(elProp);
                // Bindings are optional, so this binding only needs to be set up if an expression is given.
                if (boundProp) {
                    targetBoundDirectiveProps.push(new BoundDirectivePropertyAst(dirProp, boundProp.name, boundProp.expression, boundProp.sourceSpan));
                }
            });
        }
    };
    /**
     * @param {?} elementName
     * @param {?} props
     * @param {?} directives
     * @return {?}
     */
    TemplateParseVisitor.prototype._createElementPropertyAsts = function (elementName, props, directives) {
        var _this = this;
        var /** @type {?} */ boundElementProps = [];
        var /** @type {?} */ boundDirectivePropsIndex = new Map();
        directives.forEach(function (directive) {
            directive.inputs.forEach(function (prop) {
                boundDirectivePropsIndex.set(prop.templateName, prop);
            });
        });
        props.forEach(function (prop) {
            if (!prop.isLiteral && !boundDirectivePropsIndex.get(prop.name)) {
                boundElementProps.push(_this._bindingParser.createElementPropertyAst(elementName, prop));
            }
        });
        this._checkPropertiesInSchema(elementName, boundElementProps);
        return boundElementProps;
    };
    /**
     * @param {?} directives
     * @return {?}
     */
    TemplateParseVisitor.prototype._findComponentDirectives = function (directives) {
        return directives.filter(function (directive) { return directive.directive.isComponent; });
    };
    /**
     * @param {?} directives
     * @return {?}
     */
    TemplateParseVisitor.prototype._findComponentDirectiveNames = function (directives) {
        return this._findComponentDirectives(directives)
            .map(function (directive) { return identifierName(directive.directive.type); });
    };
    /**
     * @param {?} directives
     * @param {?} sourceSpan
     * @return {?}
     */
    TemplateParseVisitor.prototype._assertOnlyOneComponent = function (directives, sourceSpan) {
        var /** @type {?} */ componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 1) {
            this._reportError("More than one component matched on this element.\n" +
                "Make sure that only one component's selector can match a given element.\n" +
                ("Conflicting components: " + componentTypeNames.join(',')), sourceSpan);
        }
    };
    /**
     *  Make sure that non-angular tags conform to the schemas.
      * *
      * Note: An element is considered an angular tag when at least one directive selector matches the
      * tag name.
      * *
     * @param {?} matchElement Whether any directive has matched on the tag name
     * @param {?} element the html element
     * @return {?}
     */
    TemplateParseVisitor.prototype._assertElementExists = function (matchElement, element) {
        var /** @type {?} */ elName = element.name.replace(/^:xhtml:/, '');
        if (!matchElement && !this._schemaRegistry.hasElement(elName, this._schemas)) {
            var /** @type {?} */ errorMsg = ("'" + elName + "' is not a known element:\n") +
                ("1. If '" + elName + "' is an Angular component, then verify that it is part of this module.\n") +
                ("2. If '" + elName + "' is a Web Component then add \"CUSTOM_ELEMENTS_SCHEMA\" to the '@NgModule.schemas' of this component to suppress this message.");
            this._reportError(errorMsg, element.sourceSpan);
        }
    };
    /**
     * @param {?} directives
     * @param {?} elementProps
     * @param {?} sourceSpan
     * @return {?}
     */
    TemplateParseVisitor.prototype._assertNoComponentsNorElementBindingsOnTemplate = function (directives, elementProps, sourceSpan) {
        var _this = this;
        var /** @type {?} */ componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 0) {
            this._reportError("Components on an embedded template: " + componentTypeNames.join(','), sourceSpan);
        }
        elementProps.forEach(function (prop) {
            _this._reportError("Property binding " + prop.name + " not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", sourceSpan);
        });
    };
    /**
     * @param {?} directives
     * @param {?} events
     * @return {?}
     */
    TemplateParseVisitor.prototype._assertAllEventsPublishedByDirectives = function (directives, events) {
        var _this = this;
        var /** @type {?} */ allDirectiveEvents = new Set();
        directives.forEach(function (directive) {
            Object.keys(directive.directive.outputs).forEach(function (k) {
                var /** @type {?} */ eventName = directive.directive.outputs[k];
                allDirectiveEvents.add(eventName);
            });
        });
        events.forEach(function (event) {
            if (isPresent(event.target) || !allDirectiveEvents.has(event.name)) {
                _this._reportError("Event binding " + event.fullName + " not emitted by any directive on an embedded template. Make sure that the event name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", event.sourceSpan);
            }
        });
    };
    /**
     * @param {?} elementName
     * @param {?} boundProps
     * @return {?}
     */
    TemplateParseVisitor.prototype._checkPropertiesInSchema = function (elementName, boundProps) {
        var _this = this;
        boundProps.forEach(function (boundProp) {
            if (boundProp.type === PropertyBindingType.Property &&
                !_this._schemaRegistry.hasProperty(elementName, boundProp.name, _this._schemas)) {
                var /** @type {?} */ errorMsg = "Can't bind to '" + boundProp.name + "' since it isn't a known property of '" + elementName + "'.";
                if (elementName.indexOf('-') > -1) {
                    errorMsg +=
                        ("\n1. If '" + elementName + "' is an Angular component and it has '" + boundProp.name + "' input, then verify that it is part of this module.") +
                            ("\n2. If '" + elementName + "' is a Web Component then add \"CUSTOM_ELEMENTS_SCHEMA\" to the '@NgModule.schemas' of this component to suppress this message.\n");
                }
                _this._reportError(errorMsg, boundProp.sourceSpan);
            }
        });
    };
    /**
     * @param {?} message
     * @param {?} sourceSpan
     * @param {?=} level
     * @return {?}
     */
    TemplateParseVisitor.prototype._reportError = function (message, sourceSpan, level) {
        if (level === void 0) { level = ParseErrorLevel.FATAL; }
        this._targetErrors.push(new ParseError(sourceSpan, message, level));
    };
    return TemplateParseVisitor;
}());
function TemplateParseVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    TemplateParseVisitor.prototype.selectorMatcher;
    /** @type {?} */
    TemplateParseVisitor.prototype.directivesIndex;
    /** @type {?} */
    TemplateParseVisitor.prototype.ngContentCount;
    /** @type {?} */
    TemplateParseVisitor.prototype.providerViewContext;
    /** @type {?} */
    TemplateParseVisitor.prototype._bindingParser;
    /** @type {?} */
    TemplateParseVisitor.prototype._schemaRegistry;
    /** @type {?} */
    TemplateParseVisitor.prototype._schemas;
    /** @type {?} */
    TemplateParseVisitor.prototype._targetErrors;
}
var NonBindableVisitor = (function () {
    function NonBindableVisitor() {
    }
    /**
     * @param {?} ast
     * @param {?} parent
     * @return {?}
     */
    NonBindableVisitor.prototype.visitElement = function (ast, parent) {
        var /** @type {?} */ preparsedElement = preparseElement(ast);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE ||
            preparsedElement.type === PreparsedElementType.STYLESHEET) {
            // Skipping <script> for security reasons
            // Skipping <style> and stylesheets as we already processed them
            // in the StyleCompiler
            return null;
        }
        var /** @type {?} */ attrNameAndValues = ast.attrs.map(function (attrAst) { return [attrAst.name, attrAst.value]; });
        var /** @type {?} */ selector = createElementCssSelector(ast.name, attrNameAndValues);
        var /** @type {?} */ ngContentIndex = parent.findNgContentIndex(selector);
        var /** @type {?} */ children = html.visitAll(this, ast.children, EMPTY_ELEMENT_CONTEXT);
        return new ElementAst(ast.name, html.visitAll(this, ast.attrs), [], [], [], [], [], false, children, ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    NonBindableVisitor.prototype.visitComment = function (comment, context) { return null; };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    NonBindableVisitor.prototype.visitAttribute = function (attribute, context) {
        return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
    };
    /**
     * @param {?} text
     * @param {?} parent
     * @return {?}
     */
    NonBindableVisitor.prototype.visitText = function (text, parent) {
        var /** @type {?} */ ngContentIndex = parent.findNgContentIndex(TEXT_CSS_SELECTOR);
        return new TextAst(text.value, ngContentIndex, text.sourceSpan);
    };
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    NonBindableVisitor.prototype.visitExpansion = function (expansion, context) { return expansion; };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    NonBindableVisitor.prototype.visitExpansionCase = function (expansionCase, context) { return expansionCase; };
    return NonBindableVisitor;
}());
var ElementOrDirectiveRef = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    function ElementOrDirectiveRef(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    return ElementOrDirectiveRef;
}());
function ElementOrDirectiveRef_tsickle_Closure_declarations() {
    /** @type {?} */
    ElementOrDirectiveRef.prototype.name;
    /** @type {?} */
    ElementOrDirectiveRef.prototype.value;
    /** @type {?} */
    ElementOrDirectiveRef.prototype.sourceSpan;
}
/**
 * @param {?} classAttrValue
 * @return {?}
 */
export function splitClasses(classAttrValue) {
    return classAttrValue.trim().split(/\s+/g);
}
var ElementContext = (function () {
    /**
     * @param {?} isTemplateElement
     * @param {?} _ngContentIndexMatcher
     * @param {?} _wildcardNgContentIndex
     * @param {?} providerContext
     */
    function ElementContext(isTemplateElement, _ngContentIndexMatcher, _wildcardNgContentIndex, providerContext) {
        this.isTemplateElement = isTemplateElement;
        this._ngContentIndexMatcher = _ngContentIndexMatcher;
        this._wildcardNgContentIndex = _wildcardNgContentIndex;
        this.providerContext = providerContext;
    }
    /**
     * @param {?} isTemplateElement
     * @param {?} directives
     * @param {?} providerContext
     * @return {?}
     */
    ElementContext.create = function (isTemplateElement, directives, providerContext) {
        var /** @type {?} */ matcher = new SelectorMatcher();
        var /** @type {?} */ wildcardNgContentIndex = null;
        var /** @type {?} */ component = directives.find(function (directive) { return directive.directive.isComponent; });
        if (component) {
            var /** @type {?} */ ngContentSelectors = component.directive.template.ngContentSelectors;
            for (var /** @type {?} */ i = 0; i < ngContentSelectors.length; i++) {
                var /** @type {?} */ selector = ngContentSelectors[i];
                if (selector === '*') {
                    wildcardNgContentIndex = i;
                }
                else {
                    matcher.addSelectables(CssSelector.parse(ngContentSelectors[i]), i);
                }
            }
        }
        return new ElementContext(isTemplateElement, matcher, wildcardNgContentIndex, providerContext);
    };
    /**
     * @param {?} selector
     * @return {?}
     */
    ElementContext.prototype.findNgContentIndex = function (selector) {
        var /** @type {?} */ ngContentIndices = [];
        this._ngContentIndexMatcher.match(selector, function (selector, ngContentIndex) { ngContentIndices.push(ngContentIndex); });
        ngContentIndices.sort();
        if (isPresent(this._wildcardNgContentIndex)) {
            ngContentIndices.push(this._wildcardNgContentIndex);
        }
        return ngContentIndices.length > 0 ? ngContentIndices[0] : null;
    };
    return ElementContext;
}());
function ElementContext_tsickle_Closure_declarations() {
    /** @type {?} */
    ElementContext.prototype.isTemplateElement;
    /** @type {?} */
    ElementContext.prototype._ngContentIndexMatcher;
    /** @type {?} */
    ElementContext.prototype._wildcardNgContentIndex;
    /** @type {?} */
    ElementContext.prototype.providerContext;
}
/**
 * @param {?} elementName
 * @param {?} matchableAttrs
 * @return {?}
 */
export function createElementCssSelector(elementName, matchableAttrs) {
    var /** @type {?} */ cssSelector = new CssSelector();
    var /** @type {?} */ elNameNoNs = splitNsName(elementName)[1];
    cssSelector.setElement(elNameNoNs);
    for (var /** @type {?} */ i = 0; i < matchableAttrs.length; i++) {
        var /** @type {?} */ attrName = matchableAttrs[i][0];
        var /** @type {?} */ attrNameNoNs = splitNsName(attrName)[1];
        var /** @type {?} */ attrValue = matchableAttrs[i][1];
        cssSelector.addAttribute(attrNameNoNs, attrValue);
        if (attrName.toLowerCase() == CLASS_ATTR) {
            var /** @type {?} */ classes = splitClasses(attrValue);
            classes.forEach(function (className) { return cssSelector.addClassName(className); });
        }
    }
    return cssSelector;
}
var /** @type {?} */ EMPTY_ELEMENT_CONTEXT = new ElementContext(true, new SelectorMatcher(), null, null);
var /** @type {?} */ NON_BINDABLE_VISITOR = new NonBindableVisitor();
/**
 * @param {?} node
 * @return {?}
 */
function _isEmptyTextNode(node) {
    return node instanceof html.Text && node.value.trim().length == 0;
}
/**
 * @param {?} items
 * @return {?}
 */
export function removeSummaryDuplicates(items) {
    var /** @type {?} */ map = new Map();
    items.forEach(function (item) {
        if (!map.get(item.type.reference)) {
            map.set(item.type.reference, item);
        }
    });
    return Array.from(map.values());
}
//# sourceMappingURL=template_parser.js.map