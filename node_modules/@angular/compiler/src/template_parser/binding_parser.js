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
import { SecurityContext } from '@angular/core';
import { EmptyExpr, RecursiveAstVisitor } from '../expression_parser/ast';
import { isPresent } from '../facade/lang';
import { mergeNsAndName } from '../ml_parser/tags';
import { ParseError, ParseErrorLevel, ParseSourceSpan } from '../parse_util';
import { CssSelector } from '../selector';
import { splitAtColon, splitAtPeriod } from '../util';
import { BoundElementPropertyAst, BoundEventAst, PropertyBindingType, VariableAst } from './template_ast';
var /** @type {?} */ PROPERTY_PARTS_SEPARATOR = '.';
var /** @type {?} */ ATTRIBUTE_PREFIX = 'attr';
var /** @type {?} */ CLASS_PREFIX = 'class';
var /** @type {?} */ STYLE_PREFIX = 'style';
var /** @type {?} */ ANIMATE_PROP_PREFIX = 'animate-';
export var BoundPropertyType = {};
BoundPropertyType.DEFAULT = 0;
BoundPropertyType.LITERAL_ATTR = 1;
BoundPropertyType.ANIMATION = 2;
BoundPropertyType[BoundPropertyType.DEFAULT] = "DEFAULT";
BoundPropertyType[BoundPropertyType.LITERAL_ATTR] = "LITERAL_ATTR";
BoundPropertyType[BoundPropertyType.ANIMATION] = "ANIMATION";
/**
 *  Represents a parsed property.
 */
export var BoundProperty = (function () {
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} type
     * @param {?} sourceSpan
     */
    function BoundProperty(name, expression, type, sourceSpan) {
        this.name = name;
        this.expression = expression;
        this.type = type;
        this.sourceSpan = sourceSpan;
    }
    Object.defineProperty(BoundProperty.prototype, "isLiteral", {
        /**
         * @return {?}
         */
        get: function () { return this.type === BoundPropertyType.LITERAL_ATTR; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundProperty.prototype, "isAnimation", {
        /**
         * @return {?}
         */
        get: function () { return this.type === BoundPropertyType.ANIMATION; },
        enumerable: true,
        configurable: true
    });
    return BoundProperty;
}());
function BoundProperty_tsickle_Closure_declarations() {
    /** @type {?} */
    BoundProperty.prototype.name;
    /** @type {?} */
    BoundProperty.prototype.expression;
    /** @type {?} */
    BoundProperty.prototype.type;
    /** @type {?} */
    BoundProperty.prototype.sourceSpan;
}
/**
 *  Parses bindings in templates and in the directive host area.
 */
export var BindingParser = (function () {
    /**
     * @param {?} _exprParser
     * @param {?} _interpolationConfig
     * @param {?} _schemaRegistry
     * @param {?} pipes
     * @param {?} _targetErrors
     */
    function BindingParser(_exprParser, _interpolationConfig, _schemaRegistry, pipes, _targetErrors) {
        var _this = this;
        this._exprParser = _exprParser;
        this._interpolationConfig = _interpolationConfig;
        this._schemaRegistry = _schemaRegistry;
        this._targetErrors = _targetErrors;
        this.pipesByName = new Map();
        pipes.forEach(function (pipe) { return _this.pipesByName.set(pipe.name, pipe); });
    }
    /**
     * @param {?} dirMeta
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype.createDirectiveHostPropertyAsts = function (dirMeta, sourceSpan) {
        var _this = this;
        if (dirMeta.hostProperties) {
            var /** @type {?} */ boundProps_1 = [];
            Object.keys(dirMeta.hostProperties).forEach(function (propName) {
                var /** @type {?} */ expression = dirMeta.hostProperties[propName];
                if (typeof expression === 'string') {
                    _this.parsePropertyBinding(propName, expression, true, sourceSpan, [], boundProps_1);
                }
                else {
                    _this._reportError("Value of the host property binding \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
                }
            });
            return boundProps_1.map(function (prop) { return _this.createElementPropertyAst(dirMeta.selector, prop); });
        }
    };
    /**
     * @param {?} dirMeta
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype.createDirectiveHostEventAsts = function (dirMeta, sourceSpan) {
        var _this = this;
        if (dirMeta.hostListeners) {
            var /** @type {?} */ targetEventAsts_1 = [];
            Object.keys(dirMeta.hostListeners).forEach(function (propName) {
                var /** @type {?} */ expression = dirMeta.hostListeners[propName];
                if (typeof expression === 'string') {
                    _this.parseEvent(propName, expression, sourceSpan, [], targetEventAsts_1);
                }
                else {
                    _this._reportError("Value of the host listener \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
                }
            });
            return targetEventAsts_1;
        }
    };
    /**
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype.parseInterpolation = function (value, sourceSpan) {
        var /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            var /** @type {?} */ ast = this._exprParser.parseInterpolation(value, sourceInfo, this._interpolationConfig);
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    };
    /**
     * @param {?} name
     * @param {?} prefixToken
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @param {?} targetVars
     * @return {?}
     */
    BindingParser.prototype.parseInlineTemplateBinding = function (name, prefixToken, value, sourceSpan, targetMatchableAttrs, targetProps, targetVars) {
        var /** @type {?} */ bindings = this._parseTemplateBindings(prefixToken, value, sourceSpan);
        for (var /** @type {?} */ i = 0; i < bindings.length; i++) {
            var /** @type {?} */ binding = bindings[i];
            if (binding.keyIsVar) {
                targetVars.push(new VariableAst(binding.key, binding.name, sourceSpan));
            }
            else if (isPresent(binding.expression)) {
                this._parsePropertyAst(binding.key, binding.expression, sourceSpan, targetMatchableAttrs, targetProps);
            }
            else {
                targetMatchableAttrs.push([binding.key, '']);
                this.parseLiteralAttr(binding.key, null, sourceSpan, targetMatchableAttrs, targetProps);
            }
        }
    };
    /**
     * @param {?} prefixToken
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._parseTemplateBindings = function (prefixToken, value, sourceSpan) {
        var _this = this;
        var /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            var /** @type {?} */ bindingsResult = this._exprParser.parseTemplateBindings(prefixToken, value, sourceInfo);
            this._reportExpressionParserErrors(bindingsResult.errors, sourceSpan);
            bindingsResult.templateBindings.forEach(function (binding) {
                if (isPresent(binding.expression)) {
                    _this._checkPipes(binding.expression, sourceSpan);
                }
            });
            bindingsResult.warnings.forEach(function (warning) { _this._reportError(warning, sourceSpan, ParseErrorLevel.WARNING); });
            return bindingsResult.templateBindings;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return [];
        }
    };
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype.parseLiteralAttr = function (name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        if (_isAnimationLabel(name)) {
            name = name.substring(1);
            if (value) {
                this._reportError("Assigning animation triggers via @prop=\"exp\" attributes with an expression is invalid." +
                    " Use property bindings (e.g. [@prop]=\"exp\") or use an attribute without a value (e.g. @prop) instead.", sourceSpan, ParseErrorLevel.FATAL);
            }
            this._parseAnimation(name, value, sourceSpan, targetMatchableAttrs, targetProps);
        }
        else {
            targetProps.push(new BoundProperty(name, this._exprParser.wrapLiteralPrimitive(value, ''), BoundPropertyType.LITERAL_ATTR, sourceSpan));
        }
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} isHost
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype.parsePropertyBinding = function (name, expression, isHost, sourceSpan, targetMatchableAttrs, targetProps) {
        var /** @type {?} */ isAnimationProp = false;
        if (name.startsWith(ANIMATE_PROP_PREFIX)) {
            isAnimationProp = true;
            name = name.substring(ANIMATE_PROP_PREFIX.length);
        }
        else if (_isAnimationLabel(name)) {
            isAnimationProp = true;
            name = name.substring(1);
        }
        if (isAnimationProp) {
            this._parseAnimation(name, expression, sourceSpan, targetMatchableAttrs, targetProps);
        }
        else {
            this._parsePropertyAst(name, this._parseBinding(expression, isHost, sourceSpan), sourceSpan, targetMatchableAttrs, targetProps);
        }
    };
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype.parsePropertyInterpolation = function (name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        var /** @type {?} */ expr = this.parseInterpolation(value, sourceSpan);
        if (isPresent(expr)) {
            this._parsePropertyAst(name, expr, sourceSpan, targetMatchableAttrs, targetProps);
            return true;
        }
        return false;
    };
    /**
     * @param {?} name
     * @param {?} ast
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype._parsePropertyAst = function (name, ast, sourceSpan, targetMatchableAttrs, targetProps) {
        targetMatchableAttrs.push([name, ast.source]);
        targetProps.push(new BoundProperty(name, ast, BoundPropertyType.DEFAULT, sourceSpan));
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype._parseAnimation = function (name, expression, sourceSpan, targetMatchableAttrs, targetProps) {
        // This will occur when a @trigger is not paired with an expression.
        // For animations it is valid to not have an expression since */void
        // states will be applied by angular when the element is attached/detached
        var /** @type {?} */ ast = this._parseBinding(expression || 'null', false, sourceSpan);
        targetMatchableAttrs.push([name, ast.source]);
        targetProps.push(new BoundProperty(name, ast, BoundPropertyType.ANIMATION, sourceSpan));
    };
    /**
     * @param {?} value
     * @param {?} isHostBinding
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._parseBinding = function (value, isHostBinding, sourceSpan) {
        var /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            var /** @type {?} */ ast = isHostBinding ?
                this._exprParser.parseSimpleBinding(value, sourceInfo, this._interpolationConfig) :
                this._exprParser.parseBinding(value, sourceInfo, this._interpolationConfig);
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    };
    /**
     * @param {?} elementSelector
     * @param {?} boundProp
     * @return {?}
     */
    BindingParser.prototype.createElementPropertyAst = function (elementSelector, boundProp) {
        if (boundProp.isAnimation) {
            return new BoundElementPropertyAst(boundProp.name, PropertyBindingType.Animation, SecurityContext.NONE, false, boundProp.expression, null, boundProp.sourceSpan);
        }
        var /** @type {?} */ unit = null;
        var /** @type {?} */ bindingType;
        var /** @type {?} */ boundPropertyName = null;
        var /** @type {?} */ parts = boundProp.name.split(PROPERTY_PARTS_SEPARATOR);
        var /** @type {?} */ securityContexts;
        // Check check for special cases (prefix style, attr, class)
        if (parts.length > 1) {
            if (parts[0] == ATTRIBUTE_PREFIX) {
                boundPropertyName = parts[1];
                this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, true);
                securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, true);
                var /** @type {?} */ nsSeparatorIdx = boundPropertyName.indexOf(':');
                if (nsSeparatorIdx > -1) {
                    var /** @type {?} */ ns = boundPropertyName.substring(0, nsSeparatorIdx);
                    var /** @type {?} */ name_1 = boundPropertyName.substring(nsSeparatorIdx + 1);
                    boundPropertyName = mergeNsAndName(ns, name_1);
                }
                bindingType = PropertyBindingType.Attribute;
            }
            else if (parts[0] == CLASS_PREFIX) {
                boundPropertyName = parts[1];
                bindingType = PropertyBindingType.Class;
                securityContexts = [SecurityContext.NONE];
            }
            else if (parts[0] == STYLE_PREFIX) {
                unit = parts.length > 2 ? parts[2] : null;
                boundPropertyName = parts[1];
                bindingType = PropertyBindingType.Style;
                securityContexts = [SecurityContext.STYLE];
            }
        }
        // If not a special case, use the full property name
        if (boundPropertyName === null) {
            boundPropertyName = this._schemaRegistry.getMappedPropName(boundProp.name);
            securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, false);
            bindingType = PropertyBindingType.Property;
            this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, false);
        }
        return new BoundElementPropertyAst(boundPropertyName, bindingType, securityContexts.length === 1 ? securityContexts[0] : null, securityContexts.length > 1, boundProp.expression, unit, boundProp.sourceSpan);
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetEvents
     * @return {?}
     */
    BindingParser.prototype.parseEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        if (_isAnimationLabel(name)) {
            name = name.substr(1);
            this._parseAnimationEvent(name, expression, sourceSpan, targetEvents);
        }
        else {
            this._parseEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents);
        }
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetEvents
     * @return {?}
     */
    BindingParser.prototype._parseAnimationEvent = function (name, expression, sourceSpan, targetEvents) {
        var /** @type {?} */ matches = splitAtPeriod(name, [name, '']);
        var /** @type {?} */ eventName = matches[0];
        var /** @type {?} */ phase = matches[1].toLowerCase();
        if (phase) {
            switch (phase) {
                case 'start':
                case 'done':
                    var /** @type {?} */ ast = this._parseAction(expression, sourceSpan);
                    targetEvents.push(new BoundEventAst(eventName, null, phase, ast, sourceSpan));
                    break;
                default:
                    this._reportError("The provided animation output phase value \"" + phase + "\" for \"@" + eventName + "\" is not supported (use start or done)", sourceSpan);
                    break;
            }
        }
        else {
            this._reportError("The animation trigger output event (@" + eventName + ") is missing its phase value name (start or done are currently supported)", sourceSpan);
        }
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetEvents
     * @return {?}
     */
    BindingParser.prototype._parseEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        // long format: 'target: eventName'
        var _a = splitAtColon(name, [null, name]), target = _a[0], eventName = _a[1];
        var /** @type {?} */ ast = this._parseAction(expression, sourceSpan);
        targetMatchableAttrs.push([name, ast.source]);
        targetEvents.push(new BoundEventAst(eventName, target, null, ast, sourceSpan));
        // Don't detect directives for event names for now,
        // so don't add the event name to the matchableAttrs
    };
    /**
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._parseAction = function (value, sourceSpan) {
        var /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            var /** @type {?} */ ast = this._exprParser.parseAction(value, sourceInfo, this._interpolationConfig);
            if (ast) {
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            }
            if (!ast || ast.ast instanceof EmptyExpr) {
                this._reportError("Empty expressions are not allowed", sourceSpan);
                return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
            }
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    };
    /**
     * @param {?} message
     * @param {?} sourceSpan
     * @param {?=} level
     * @return {?}
     */
    BindingParser.prototype._reportError = function (message, sourceSpan, level) {
        if (level === void 0) { level = ParseErrorLevel.FATAL; }
        this._targetErrors.push(new ParseError(sourceSpan, message, level));
    };
    /**
     * @param {?} errors
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._reportExpressionParserErrors = function (errors, sourceSpan) {
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            this._reportError(error.message, sourceSpan);
        }
    };
    /**
     * @param {?} ast
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._checkPipes = function (ast, sourceSpan) {
        var _this = this;
        if (isPresent(ast)) {
            var /** @type {?} */ collector = new PipeCollector();
            ast.visit(collector);
            collector.pipes.forEach(function (ast, pipeName) {
                if (!_this.pipesByName.has(pipeName)) {
                    _this._reportError("The pipe '" + pipeName + "' could not be found", new ParseSourceSpan(sourceSpan.start.moveBy(ast.span.start), sourceSpan.start.moveBy(ast.span.end)));
                }
            });
        }
    };
    /**
     * @param {?} propName the name of the property / attribute
     * @param {?} sourceSpan
     * @param {?} isAttr true when binding to an attribute
     * @return {?}
     */
    BindingParser.prototype._validatePropertyOrAttributeName = function (propName, sourceSpan, isAttr) {
        var /** @type {?} */ report = isAttr ? this._schemaRegistry.validateAttribute(propName) :
            this._schemaRegistry.validateProperty(propName);
        if (report.error) {
            this._reportError(report.msg, sourceSpan, ParseErrorLevel.FATAL);
        }
    };
    return BindingParser;
}());
function BindingParser_tsickle_Closure_declarations() {
    /** @type {?} */
    BindingParser.prototype.pipesByName;
    /** @type {?} */
    BindingParser.prototype._exprParser;
    /** @type {?} */
    BindingParser.prototype._interpolationConfig;
    /** @type {?} */
    BindingParser.prototype._schemaRegistry;
    /** @type {?} */
    BindingParser.prototype._targetErrors;
}
export var PipeCollector = (function (_super) {
    __extends(PipeCollector, _super);
    function PipeCollector() {
        _super.apply(this, arguments);
        this.pipes = new Map();
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    PipeCollector.prototype.visitPipe = function (ast, context) {
        this.pipes.set(ast.name, ast);
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    };
    return PipeCollector;
}(RecursiveAstVisitor));
function PipeCollector_tsickle_Closure_declarations() {
    /** @type {?} */
    PipeCollector.prototype.pipes;
}
/**
 * @param {?} name
 * @return {?}
 */
function _isAnimationLabel(name) {
    return name[0] == '@';
}
/**
 * @param {?} registry
 * @param {?} selector
 * @param {?} propName
 * @param {?} isAttribute
 * @return {?}
 */
export function calcPossibleSecurityContexts(registry, selector, propName, isAttribute) {
    var /** @type {?} */ ctxs = [];
    CssSelector.parse(selector).forEach(function (selector) {
        var /** @type {?} */ elementNames = selector.element ? [selector.element] : registry.allKnownElementNames();
        var /** @type {?} */ notElementNames = new Set(selector.notSelectors.filter(function (selector) { return selector.isElementSelector(); })
            .map(function (selector) { return selector.element; }));
        var /** @type {?} */ possibleElementNames = elementNames.filter(function (elementName) { return !notElementNames.has(elementName); });
        ctxs.push.apply(ctxs, possibleElementNames.map(function (elementName) { return registry.securityContext(elementName, propName, isAttribute); }));
    });
    return ctxs.length === 0 ? [SecurityContext.NONE] : Array.from(new Set(ctxs)).sort();
}
//# sourceMappingURL=binding_parser.js.map