/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 *  A segment of text within the template.
 */
export var TextAst = (function () {
    /**
     * @param {?} value
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    function TextAst(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    TextAst.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
    return TextAst;
}());
function TextAst_tsickle_Closure_declarations() {
    /** @type {?} */
    TextAst.prototype.value;
    /** @type {?} */
    TextAst.prototype.ngContentIndex;
    /** @type {?} */
    TextAst.prototype.sourceSpan;
}
/**
 *  A bound expression within the text of a template.
 */
export var BoundTextAst = (function () {
    /**
     * @param {?} value
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    function BoundTextAst(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BoundTextAst.prototype.visit = function (visitor, context) {
        return visitor.visitBoundText(this, context);
    };
    return BoundTextAst;
}());
function BoundTextAst_tsickle_Closure_declarations() {
    /** @type {?} */
    BoundTextAst.prototype.value;
    /** @type {?} */
    BoundTextAst.prototype.ngContentIndex;
    /** @type {?} */
    BoundTextAst.prototype.sourceSpan;
}
/**
 *  A plain attribute on an element.
 */
export var AttrAst = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    function AttrAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    AttrAst.prototype.visit = function (visitor, context) { return visitor.visitAttr(this, context); };
    return AttrAst;
}());
function AttrAst_tsickle_Closure_declarations() {
    /** @type {?} */
    AttrAst.prototype.name;
    /** @type {?} */
    AttrAst.prototype.value;
    /** @type {?} */
    AttrAst.prototype.sourceSpan;
}
/**
 *  A binding for an element property (e.g. `[property]="expression"`) or an animation trigger (e.g.
  * `[@trigger]="stateExp"`)
 */
export var BoundElementPropertyAst = (function () {
    /**
     * @param {?} name
     * @param {?} type
     * @param {?} securityContext
     * @param {?} needsRuntimeSecurityContext
     * @param {?} value
     * @param {?} unit
     * @param {?} sourceSpan
     */
    function BoundElementPropertyAst(name, type, securityContext, needsRuntimeSecurityContext, value, unit, sourceSpan) {
        this.name = name;
        this.type = type;
        this.securityContext = securityContext;
        this.needsRuntimeSecurityContext = needsRuntimeSecurityContext;
        this.value = value;
        this.unit = unit;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BoundElementPropertyAst.prototype.visit = function (visitor, context) {
        return visitor.visitElementProperty(this, context);
    };
    Object.defineProperty(BoundElementPropertyAst.prototype, "isAnimation", {
        /**
         * @return {?}
         */
        get: function () { return this.type === PropertyBindingType.Animation; },
        enumerable: true,
        configurable: true
    });
    return BoundElementPropertyAst;
}());
function BoundElementPropertyAst_tsickle_Closure_declarations() {
    /** @type {?} */
    BoundElementPropertyAst.prototype.name;
    /** @type {?} */
    BoundElementPropertyAst.prototype.type;
    /** @type {?} */
    BoundElementPropertyAst.prototype.securityContext;
    /** @type {?} */
    BoundElementPropertyAst.prototype.needsRuntimeSecurityContext;
    /** @type {?} */
    BoundElementPropertyAst.prototype.value;
    /** @type {?} */
    BoundElementPropertyAst.prototype.unit;
    /** @type {?} */
    BoundElementPropertyAst.prototype.sourceSpan;
}
/**
 *  A binding for an element event (e.g. `(event)="handler()"`) or an animation trigger event (e.g.
  * `(@trigger.phase)="callback($event)"`).
 */
export var BoundEventAst = (function () {
    /**
     * @param {?} name
     * @param {?} target
     * @param {?} phase
     * @param {?} handler
     * @param {?} sourceSpan
     */
    function BoundEventAst(name, target, phase, handler, sourceSpan) {
        this.name = name;
        this.target = target;
        this.phase = phase;
        this.handler = handler;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} name
     * @param {?} target
     * @param {?} phase
     * @return {?}
     */
    BoundEventAst.calcFullName = function (name, target, phase) {
        if (target) {
            return target + ":" + name;
        }
        else if (phase) {
            return "@" + name + "." + phase;
        }
        else {
            return name;
        }
    };
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BoundEventAst.prototype.visit = function (visitor, context) {
        return visitor.visitEvent(this, context);
    };
    Object.defineProperty(BoundEventAst.prototype, "fullName", {
        /**
         * @return {?}
         */
        get: function () { return BoundEventAst.calcFullName(this.name, this.target, this.phase); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundEventAst.prototype, "isAnimation", {
        /**
         * @return {?}
         */
        get: function () { return !!this.phase; },
        enumerable: true,
        configurable: true
    });
    return BoundEventAst;
}());
function BoundEventAst_tsickle_Closure_declarations() {
    /** @type {?} */
    BoundEventAst.prototype.name;
    /** @type {?} */
    BoundEventAst.prototype.target;
    /** @type {?} */
    BoundEventAst.prototype.phase;
    /** @type {?} */
    BoundEventAst.prototype.handler;
    /** @type {?} */
    BoundEventAst.prototype.sourceSpan;
}
/**
 *  A reference declaration on an element (e.g. `let someName="expression"`).
 */
export var ReferenceAst = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    function ReferenceAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReferenceAst.prototype.visit = function (visitor, context) {
        return visitor.visitReference(this, context);
    };
    return ReferenceAst;
}());
function ReferenceAst_tsickle_Closure_declarations() {
    /** @type {?} */
    ReferenceAst.prototype.name;
    /** @type {?} */
    ReferenceAst.prototype.value;
    /** @type {?} */
    ReferenceAst.prototype.sourceSpan;
}
/**
 *  A variable declaration on a <template> (e.g. `var-someName="someLocalName"`).
 */
export var VariableAst = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    function VariableAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    VariableAst.prototype.visit = function (visitor, context) {
        return visitor.visitVariable(this, context);
    };
    return VariableAst;
}());
function VariableAst_tsickle_Closure_declarations() {
    /** @type {?} */
    VariableAst.prototype.name;
    /** @type {?} */
    VariableAst.prototype.value;
    /** @type {?} */
    VariableAst.prototype.sourceSpan;
}
/**
 *  An element declaration in a template.
 */
export var ElementAst = (function () {
    /**
     * @param {?} name
     * @param {?} attrs
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} references
     * @param {?} directives
     * @param {?} providers
     * @param {?} hasViewContainer
     * @param {?} children
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     * @param {?} endSourceSpan
     */
    function ElementAst(name, attrs, inputs, outputs, references, directives, providers, hasViewContainer, children, ngContentIndex, sourceSpan, endSourceSpan) {
        this.name = name;
        this.attrs = attrs;
        this.inputs = inputs;
        this.outputs = outputs;
        this.references = references;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ElementAst.prototype.visit = function (visitor, context) {
        return visitor.visitElement(this, context);
    };
    return ElementAst;
}());
function ElementAst_tsickle_Closure_declarations() {
    /** @type {?} */
    ElementAst.prototype.name;
    /** @type {?} */
    ElementAst.prototype.attrs;
    /** @type {?} */
    ElementAst.prototype.inputs;
    /** @type {?} */
    ElementAst.prototype.outputs;
    /** @type {?} */
    ElementAst.prototype.references;
    /** @type {?} */
    ElementAst.prototype.directives;
    /** @type {?} */
    ElementAst.prototype.providers;
    /** @type {?} */
    ElementAst.prototype.hasViewContainer;
    /** @type {?} */
    ElementAst.prototype.children;
    /** @type {?} */
    ElementAst.prototype.ngContentIndex;
    /** @type {?} */
    ElementAst.prototype.sourceSpan;
    /** @type {?} */
    ElementAst.prototype.endSourceSpan;
}
/**
 *  A `<template>` element included in an Angular template.
 */
export var EmbeddedTemplateAst = (function () {
    /**
     * @param {?} attrs
     * @param {?} outputs
     * @param {?} references
     * @param {?} variables
     * @param {?} directives
     * @param {?} providers
     * @param {?} hasViewContainer
     * @param {?} children
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    function EmbeddedTemplateAst(attrs, outputs, references, variables, directives, providers, hasViewContainer, children, ngContentIndex, sourceSpan) {
        this.attrs = attrs;
        this.outputs = outputs;
        this.references = references;
        this.variables = variables;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    EmbeddedTemplateAst.prototype.visit = function (visitor, context) {
        return visitor.visitEmbeddedTemplate(this, context);
    };
    return EmbeddedTemplateAst;
}());
function EmbeddedTemplateAst_tsickle_Closure_declarations() {
    /** @type {?} */
    EmbeddedTemplateAst.prototype.attrs;
    /** @type {?} */
    EmbeddedTemplateAst.prototype.outputs;
    /** @type {?} */
    EmbeddedTemplateAst.prototype.references;
    /** @type {?} */
    EmbeddedTemplateAst.prototype.variables;
    /** @type {?} */
    EmbeddedTemplateAst.prototype.directives;
    /** @type {?} */
    EmbeddedTemplateAst.prototype.providers;
    /** @type {?} */
    EmbeddedTemplateAst.prototype.hasViewContainer;
    /** @type {?} */
    EmbeddedTemplateAst.prototype.children;
    /** @type {?} */
    EmbeddedTemplateAst.prototype.ngContentIndex;
    /** @type {?} */
    EmbeddedTemplateAst.prototype.sourceSpan;
}
/**
 *  A directive property with a bound value (e.g. `*ngIf="condition").
 */
export var BoundDirectivePropertyAst = (function () {
    /**
     * @param {?} directiveName
     * @param {?} templateName
     * @param {?} value
     * @param {?} sourceSpan
     */
    function BoundDirectivePropertyAst(directiveName, templateName, value, sourceSpan) {
        this.directiveName = directiveName;
        this.templateName = templateName;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BoundDirectivePropertyAst.prototype.visit = function (visitor, context) {
        return visitor.visitDirectiveProperty(this, context);
    };
    return BoundDirectivePropertyAst;
}());
function BoundDirectivePropertyAst_tsickle_Closure_declarations() {
    /** @type {?} */
    BoundDirectivePropertyAst.prototype.directiveName;
    /** @type {?} */
    BoundDirectivePropertyAst.prototype.templateName;
    /** @type {?} */
    BoundDirectivePropertyAst.prototype.value;
    /** @type {?} */
    BoundDirectivePropertyAst.prototype.sourceSpan;
}
/**
 *  A directive declared on an element.
 */
export var DirectiveAst = (function () {
    /**
     * @param {?} directive
     * @param {?} inputs
     * @param {?} hostProperties
     * @param {?} hostEvents
     * @param {?} sourceSpan
     */
    function DirectiveAst(directive, inputs, hostProperties, hostEvents, sourceSpan) {
        this.directive = directive;
        this.inputs = inputs;
        this.hostProperties = hostProperties;
        this.hostEvents = hostEvents;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    DirectiveAst.prototype.visit = function (visitor, context) {
        return visitor.visitDirective(this, context);
    };
    return DirectiveAst;
}());
function DirectiveAst_tsickle_Closure_declarations() {
    /** @type {?} */
    DirectiveAst.prototype.directive;
    /** @type {?} */
    DirectiveAst.prototype.inputs;
    /** @type {?} */
    DirectiveAst.prototype.hostProperties;
    /** @type {?} */
    DirectiveAst.prototype.hostEvents;
    /** @type {?} */
    DirectiveAst.prototype.sourceSpan;
}
/**
 *  A provider declared on an element
 */
export var ProviderAst = (function () {
    /**
     * @param {?} token
     * @param {?} multiProvider
     * @param {?} eager
     * @param {?} providers
     * @param {?} providerType
     * @param {?} lifecycleHooks
     * @param {?} sourceSpan
     */
    function ProviderAst(token, multiProvider, eager, providers, providerType, lifecycleHooks, sourceSpan) {
        this.token = token;
        this.multiProvider = multiProvider;
        this.eager = eager;
        this.providers = providers;
        this.providerType = providerType;
        this.lifecycleHooks = lifecycleHooks;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ProviderAst.prototype.visit = function (visitor, context) {
        // No visit method in the visitor for now...
        return null;
    };
    return ProviderAst;
}());
function ProviderAst_tsickle_Closure_declarations() {
    /** @type {?} */
    ProviderAst.prototype.token;
    /** @type {?} */
    ProviderAst.prototype.multiProvider;
    /** @type {?} */
    ProviderAst.prototype.eager;
    /** @type {?} */
    ProviderAst.prototype.providers;
    /** @type {?} */
    ProviderAst.prototype.providerType;
    /** @type {?} */
    ProviderAst.prototype.lifecycleHooks;
    /** @type {?} */
    ProviderAst.prototype.sourceSpan;
}
export var ProviderAstType = {};
ProviderAstType.PublicService = 0;
ProviderAstType.PrivateService = 1;
ProviderAstType.Component = 2;
ProviderAstType.Directive = 3;
ProviderAstType.Builtin = 4;
ProviderAstType[ProviderAstType.PublicService] = "PublicService";
ProviderAstType[ProviderAstType.PrivateService] = "PrivateService";
ProviderAstType[ProviderAstType.Component] = "Component";
ProviderAstType[ProviderAstType.Directive] = "Directive";
ProviderAstType[ProviderAstType.Builtin] = "Builtin";
/**
 *  Position where content is to be projected (instance of `<ng-content>` in a template).
 */
export var NgContentAst = (function () {
    /**
     * @param {?} index
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    function NgContentAst(index, ngContentIndex, sourceSpan) {
        this.index = index;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    NgContentAst.prototype.visit = function (visitor, context) {
        return visitor.visitNgContent(this, context);
    };
    return NgContentAst;
}());
function NgContentAst_tsickle_Closure_declarations() {
    /** @type {?} */
    NgContentAst.prototype.index;
    /** @type {?} */
    NgContentAst.prototype.ngContentIndex;
    /** @type {?} */
    NgContentAst.prototype.sourceSpan;
}
export var PropertyBindingType = {};
PropertyBindingType.Property = 0;
PropertyBindingType.Attribute = 1;
PropertyBindingType.Class = 2;
PropertyBindingType.Style = 3;
PropertyBindingType.Animation = 4;
PropertyBindingType[PropertyBindingType.Property] = "Property";
PropertyBindingType[PropertyBindingType.Attribute] = "Attribute";
PropertyBindingType[PropertyBindingType.Class] = "Class";
PropertyBindingType[PropertyBindingType.Style] = "Style";
PropertyBindingType[PropertyBindingType.Animation] = "Animation";
/**
 *  Visit every node in a list of {@link TemplateAst}s with the given {@link TemplateAstVisitor}.
 * @param {?} visitor
 * @param {?} asts
 * @param {?=} context
 * @return {?}
 */
export function templateVisitAll(visitor, asts, context) {
    if (context === void 0) { context = null; }
    var /** @type {?} */ result = [];
    var /** @type {?} */ visit = visitor.visit ?
        function (ast) { return visitor.visit(ast, context) || ast.visit(visitor, context); } :
        function (ast) { return ast.visit(visitor, context); };
    asts.forEach(function (ast) {
        var /** @type {?} */ astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}
//# sourceMappingURL=template_ast.js.map