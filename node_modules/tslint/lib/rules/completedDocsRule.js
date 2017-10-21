"use strict";
/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var exclusionFactory_1 = require("./completed-docs/exclusionFactory");
exports.ALL = "all";
exports.ARGUMENT_CLASSES = "classes";
exports.ARGUMENT_ENUMS = "enums";
exports.ARGUMENT_ENUM_MEMBERS = "enum-members";
exports.ARGUMENT_FUNCTIONS = "functions";
exports.ARGUMENT_INTERFACES = "interfaces";
exports.ARGUMENT_METHODS = "methods";
exports.ARGUMENT_NAMESPACES = "namespaces";
exports.ARGUMENT_PROPERTIES = "properties";
exports.ARGUMENT_TYPES = "types";
exports.ARGUMENT_VARIABLES = "variables";
exports.DESCRIPTOR_TAGS = "tags";
exports.DESCRIPTOR_LOCATIONS = "locations";
exports.DESCRIPTOR_PRIVACIES = "privacies";
exports.DESCRIPTOR_VISIBILITIES = "visibilities";
exports.LOCATION_INSTANCE = "instance";
exports.LOCATION_STATIC = "static";
exports.PRIVACY_PRIVATE = "private";
exports.PRIVACY_PROTECTED = "protected";
exports.PRIVACY_PUBLIC = "public";
exports.TAGS_FOR_CONTENT = "content";
exports.TAGS_FOR_EXISTENCE = "exists";
exports.VISIBILITY_EXPORTED = "exported";
exports.VISIBILITY_INTERNAL = "internal";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* tslint:enable:object-literal-sort-keys */
        _this.exclusionFactory = new exclusionFactory_1.ExclusionFactory();
        return _this;
    }
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        var options = this.getOptions();
        var completedDocsWalker = new CompletedDocsWalker(sourceFile, options, program);
        completedDocsWalker.setExclusionsMap(this.getExclusionsMap(options.ruleArguments));
        return this.applyWithWalker(completedDocsWalker);
    };
    Rule.prototype.getExclusionsMap = function (ruleArguments) {
        if (ruleArguments.length === 0) {
            ruleArguments = [Rule.defaultArguments];
        }
        return this.exclusionFactory.constructExclusionsMap(ruleArguments);
    };
    Rule.FAILURE_STRING_EXIST = "Documentation must exist for ";
    Rule.defaultArguments = (_a = {},
        _a[exports.ARGUMENT_CLASSES] = true,
        _a[exports.ARGUMENT_FUNCTIONS] = true,
        _a[exports.ARGUMENT_METHODS] = (_b = {},
            _b[exports.DESCRIPTOR_TAGS] = (_c = {},
                _c[exports.TAGS_FOR_CONTENT] = {
                    see: ".*",
                },
                _c[exports.TAGS_FOR_EXISTENCE] = [
                    "deprecated",
                    "inheritdoc",
                ],
                _c),
            _b),
        _a[exports.ARGUMENT_PROPERTIES] = (_d = {},
            _d[exports.DESCRIPTOR_TAGS] = (_e = {},
                _e[exports.TAGS_FOR_CONTENT] = {
                    see: ".*",
                },
                _e[exports.TAGS_FOR_EXISTENCE] = [
                    "deprecated",
                    "inheritdoc",
                ],
                _e),
            _d),
        _a);
    Rule.ARGUMENT_DESCRIPTOR_BLOCK = {
        properties: (_f = {},
            _f[exports.DESCRIPTOR_TAGS] = {
                properties: (_g = {},
                    _g[exports.TAGS_FOR_CONTENT] = {
                        items: {
                            type: "string",
                        },
                        type: "object",
                    },
                    _g[exports.TAGS_FOR_EXISTENCE] = {
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    _g),
            },
            _f[exports.DESCRIPTOR_VISIBILITIES] = {
                enum: [
                    exports.ALL,
                    exports.VISIBILITY_EXPORTED,
                    exports.VISIBILITY_INTERNAL,
                ],
                type: "string",
            },
            _f),
        type: "object",
    };
    Rule.ARGUMENT_DESCRIPTOR_CLASS = {
        properties: (_h = {},
            _h[exports.DESCRIPTOR_TAGS] = {
                properties: (_j = {},
                    _j[exports.TAGS_FOR_CONTENT] = {
                        items: {
                            type: "string",
                        },
                        type: "object",
                    },
                    _j[exports.TAGS_FOR_EXISTENCE] = {
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    _j),
            },
            _h[exports.DESCRIPTOR_LOCATIONS] = {
                enum: [
                    exports.ALL,
                    exports.LOCATION_INSTANCE,
                    exports.LOCATION_STATIC,
                ],
                type: "string",
            },
            _h[exports.DESCRIPTOR_PRIVACIES] = {
                enum: [
                    exports.ALL,
                    exports.PRIVACY_PRIVATE,
                    exports.PRIVACY_PROTECTED,
                    exports.PRIVACY_PUBLIC,
                ],
                type: "string",
            },
            _h),
        type: "object",
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "completed-docs",
        description: "Enforces documentation for important items be filled out.",
        optionsDescription: (_k = ["\n            `true` to enable for [", "]],\n            or an array with each item in one of two formats:\n\n            * `string` to enable for that type\n            * `object` keying types to when their documentation is required:\n                * `\"", "\"` and `\"", "\"` may specify:\n                    * `\"", "\"`:\n                        * `\"", "\"`\n                        * `\"", "\"`\n                        * `\"", "\"`\n                        * `\"", "\"`\n                    * `\"", "\"`:\n                        * `\"", "\"`\n                        * `\"", "\"`\n                        * `\"", "\"`\n                * Other types may specify `\"", "\"`:\n                    * `\"", "\"`\n                    * `\"", "\"`\n                    * `\"", "\"`\n                * All types may also provide `\"", "\"`\n                  with members specifying tags that allow the docs to not have a body.\n                    * `\"", "\"`: Object mapping tags to `RegExp` bodies content allowed to count as complete docs.\n                    * `\"", "\"`: Array of tags that must only exist to count as complete docs.\n\n            Types that may be enabled are:\n\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`"], _k.raw = ["\n            \\`true\\` to enable for [", "]],\n            or an array with each item in one of two formats:\n\n            * \\`string\\` to enable for that type\n            * \\`object\\` keying types to when their documentation is required:\n                * \\`\"", "\"\\` and \\`\"", "\"\\` may specify:\n                    * \\`\"", "\"\\`:\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                    * \\`\"", "\"\\`:\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                * Other types may specify \\`\"", "\"\\`:\n                    * \\`\"", "\"\\`\n                    * \\`\"", "\"\\`\n                    * \\`\"", "\"\\`\n                * All types may also provide \\`\"", "\"\\`\n                  with members specifying tags that allow the docs to not have a body.\n                    * \\`\"", "\"\\`: Object mapping tags to \\`RegExp\\` bodies content allowed to count as complete docs.\n                    * \\`\"", "\"\\`: Array of tags that must only exist to count as complete docs.\n\n            Types that may be enabled are:\n\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`"], Lint.Utils.dedent(_k, Object.keys(Rule.defaultArguments).join(", "), exports.ARGUMENT_METHODS, exports.ARGUMENT_PROPERTIES, exports.DESCRIPTOR_PRIVACIES, exports.ALL, exports.PRIVACY_PRIVATE, exports.PRIVACY_PROTECTED, exports.PRIVACY_PUBLIC, exports.DESCRIPTOR_LOCATIONS, exports.ALL, exports.LOCATION_INSTANCE, exports.LOCATION_STATIC, exports.DESCRIPTOR_VISIBILITIES, exports.ALL, exports.VISIBILITY_EXPORTED, exports.VISIBILITY_INTERNAL, exports.DESCRIPTOR_TAGS, exports.TAGS_FOR_CONTENT, exports.TAGS_FOR_EXISTENCE, exports.ARGUMENT_CLASSES, exports.ARGUMENT_ENUMS, exports.ARGUMENT_ENUM_MEMBERS, exports.ARGUMENT_FUNCTIONS, exports.ARGUMENT_INTERFACES, exports.ARGUMENT_METHODS, exports.ARGUMENT_NAMESPACES, exports.ARGUMENT_PROPERTIES, exports.ARGUMENT_TYPES, exports.ARGUMENT_VARIABLES)),
        options: {
            type: "array",
            items: {
                anyOf: [
                    {
                        options: [
                            exports.ARGUMENT_CLASSES,
                            exports.ARGUMENT_ENUMS,
                            exports.ARGUMENT_FUNCTIONS,
                            exports.ARGUMENT_INTERFACES,
                            exports.ARGUMENT_METHODS,
                            exports.ARGUMENT_NAMESPACES,
                            exports.ARGUMENT_PROPERTIES,
                            exports.ARGUMENT_TYPES,
                            exports.ARGUMENT_VARIABLES,
                        ],
                        type: "string",
                    },
                    {
                        type: "object",
                        properties: (_l = {},
                            _l[exports.ARGUMENT_CLASSES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _l[exports.ARGUMENT_ENUMS] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _l[exports.ARGUMENT_ENUM_MEMBERS] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _l[exports.ARGUMENT_FUNCTIONS] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _l[exports.ARGUMENT_INTERFACES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _l[exports.ARGUMENT_METHODS] = Rule.ARGUMENT_DESCRIPTOR_CLASS,
                            _l[exports.ARGUMENT_NAMESPACES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _l[exports.ARGUMENT_PROPERTIES] = Rule.ARGUMENT_DESCRIPTOR_CLASS,
                            _l[exports.ARGUMENT_TYPES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _l[exports.ARGUMENT_VARIABLES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _l),
                    },
                ],
            },
        },
        optionExamples: [
            true,
            [true, exports.ARGUMENT_ENUMS, exports.ARGUMENT_FUNCTIONS, exports.ARGUMENT_METHODS],
            [
                true,
                (_m = {},
                    _m[exports.ARGUMENT_ENUMS] = true,
                    _m[exports.ARGUMENT_FUNCTIONS] = (_o = {},
                        _o[exports.DESCRIPTOR_VISIBILITIES] = [exports.VISIBILITY_EXPORTED],
                        _o),
                    _m[exports.ARGUMENT_METHODS] = (_p = {},
                        _p[exports.DESCRIPTOR_LOCATIONS] = exports.LOCATION_INSTANCE,
                        _p[exports.DESCRIPTOR_PRIVACIES] = [exports.PRIVACY_PUBLIC, exports.PRIVACY_PROTECTED],
                        _p),
                    _m[exports.DESCRIPTOR_TAGS] = (_q = {},
                        _q[exports.TAGS_FOR_CONTENT] = {
                            see: ["#.*"],
                        },
                        _q[exports.TAGS_FOR_EXISTENCE] = ["inheritdoc"],
                        _q),
                    _m),
            ],
        ],
        type: "style",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
var CompletedDocsWalker = /** @class */ (function (_super) {
    tslib_1.__extends(CompletedDocsWalker, _super);
    function CompletedDocsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CompletedDocsWalker.prototype.setExclusionsMap = function (exclusionsMap) {
        this.exclusionsMap = exclusionsMap;
    };
    CompletedDocsWalker.prototype.visitClassDeclaration = function (node) {
        this.checkNode(node, exports.ARGUMENT_CLASSES);
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitEnumDeclaration = function (node) {
        this.checkNode(node, exports.ARGUMENT_ENUMS);
        _super.prototype.visitEnumDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitEnumMember = function (node) {
        // Enum members don't have modifiers, so use the parent
        // enum declaration when checking the requirements.
        this.checkNode(node, exports.ARGUMENT_ENUM_MEMBERS, node.parent);
        _super.prototype.visitEnumMember.call(this, node);
    };
    CompletedDocsWalker.prototype.visitFunctionDeclaration = function (node) {
        this.checkNode(node, exports.ARGUMENT_FUNCTIONS);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitInterfaceDeclaration = function (node) {
        this.checkNode(node, exports.ARGUMENT_INTERFACES);
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitMethodDeclaration = function (node) {
        this.checkNode(node, exports.ARGUMENT_METHODS);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitModuleDeclaration = function (node) {
        this.checkNode(node, exports.ARGUMENT_NAMESPACES);
        _super.prototype.visitModuleDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitPropertyDeclaration = function (node) {
        this.checkNode(node, exports.ARGUMENT_PROPERTIES);
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitTypeAliasDeclaration = function (node) {
        this.checkNode(node, exports.ARGUMENT_TYPES);
        _super.prototype.visitTypeAliasDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitVariableDeclaration = function (node) {
        this.checkVariable(node);
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.checkNode = function (node, nodeType, requirementNode) {
        if (requirementNode === void 0) { requirementNode = node; }
        var name = node.name;
        if (name === undefined) {
            return;
        }
        var exclusions = this.exclusionsMap.get(nodeType);
        if (exclusions === undefined) {
            return;
        }
        for (var _i = 0, exclusions_1 = exclusions; _i < exclusions_1.length; _i++) {
            var exclusion = exclusions_1[_i];
            if (exclusion.excludes(requirementNode)) {
                return;
            }
        }
        var symbol = this.getTypeChecker().getSymbolAtLocation(name);
        if (symbol === undefined) {
            return;
        }
        var comments = symbol.getDocumentationComment();
        this.checkComments(node, this.describeNode(nodeType), comments, requirementNode);
    };
    CompletedDocsWalker.prototype.checkVariable = function (node) {
        // Only check variables in variable declaration lists
        // and not variables in catch clauses and for loops.
        var list = node.parent;
        if (!tsutils_1.isVariableDeclarationList(list)) {
            return;
        }
        var statement = list.parent;
        if (!tsutils_1.isVariableStatement(statement)) {
            return;
        }
        // Only check variables at the namespace/module-level or file-level
        // and not variables declared inside functions and other things.
        switch (statement.parent.kind) {
            case ts.SyntaxKind.SourceFile:
            case ts.SyntaxKind.ModuleBlock:
                this.checkNode(node, exports.ARGUMENT_VARIABLES, statement);
        }
    };
    CompletedDocsWalker.prototype.checkComments = function (node, nodeDescriptor, comments, requirementNode) {
        if (comments.map(function (comment) { return comment.text; }).join("").trim() === "") {
            this.addDocumentationFailure(node, nodeDescriptor, requirementNode);
        }
    };
    CompletedDocsWalker.prototype.addDocumentationFailure = function (node, nodeType, requirementNode) {
        var start = node.getStart();
        var width = node.getText().split(/\r|\n/g)[0].length;
        var description = this.describeDocumentationFailure(requirementNode, nodeType);
        this.addFailureAt(start, width, description);
    };
    CompletedDocsWalker.prototype.describeDocumentationFailure = function (node, nodeType) {
        var _this = this;
        var description = Rule.FAILURE_STRING_EXIST;
        if (node.modifiers !== undefined) {
            description += node.modifiers.map(function (modifier) { return _this.describeModifier(modifier.kind); }).join(",") + " ";
        }
        return "" + description + nodeType + ".";
    };
    CompletedDocsWalker.prototype.describeModifier = function (kind) {
        var description = ts.SyntaxKind[kind].toLowerCase().split("keyword")[0];
        var alias = CompletedDocsWalker.modifierAliases[description];
        return alias !== undefined ? alias : description;
    };
    CompletedDocsWalker.prototype.describeNode = function (nodeType) {
        return nodeType.replace("-", " ");
    };
    CompletedDocsWalker.modifierAliases = {
        export: "exported",
    };
    return CompletedDocsWalker;
}(Lint.ProgramAwareRuleWalker));
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
