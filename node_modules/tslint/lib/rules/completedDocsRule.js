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
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("../index");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super.apply(this, arguments) || this;
    }
    Rule.prototype.applyWithProgram = function (sourceFile, langSvc) {
        var options = this.getOptions();
        var completedDocsWalker = new CompletedDocsWalker(sourceFile, options, langSvc.getProgram());
        var nodesToCheck = this.getNodesToCheck(options.ruleArguments);
        completedDocsWalker.setNodesToCheck(nodesToCheck);
        return this.applyWithWalker(completedDocsWalker);
    };
    Rule.prototype.getNodesToCheck = function (ruleArguments) {
        return ruleArguments.length === 0 ? Rule.defaultArguments : ruleArguments;
    };
    return Rule;
}(Lint.Rules.TypedRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "completed-docs",
    description: "Enforces documentation for important items be filled out.",
    optionsDescription: (_a = ["\n            Either `true` to enable for all, or any of\n            `[\"classes\", \"functions\", \"methods\", \"properties\"]\n            to choose individual ones.`"], _a.raw = ["\n            Either \\`true\\` to enable for all, or any of\n            \\`[\"classes\", \"functions\", \"methods\", \"properties\"]\n            to choose individual ones.\\`"], Lint.Utils.dedent(_a)),
    options: {
        type: "array",
        items: {
            type: "string",
            enum: ["classes", "functions", "methods", "properties"],
        },
    },
    optionExamples: ["true", "[true, \"classes\", \"functions\"]"],
    type: "style",
    typescriptOnly: false,
};
/* tslint:enable:object-literal-sort-keys */
Rule.FAILURE_STRING_EXIST = " must have documentation.";
Rule.ARGUMENT_CLASSES = "classes";
Rule.ARGUMENT_FUNCTIONS = "functions";
Rule.ARGUMENT_METHODS = "methods";
Rule.ARGUMENT_PROPERTIES = "properties";
Rule.defaultArguments = [
    Rule.ARGUMENT_CLASSES,
    Rule.ARGUMENT_FUNCTIONS,
    Rule.ARGUMENT_METHODS,
    Rule.ARGUMENT_PROPERTIES,
];
exports.Rule = Rule;
var CompletedDocsWalker = (function (_super) {
    __extends(CompletedDocsWalker, _super);
    function CompletedDocsWalker() {
        return _super.apply(this, arguments) || this;
    }
    CompletedDocsWalker.prototype.setNodesToCheck = function (nodesToCheck) {
        this.nodesToCheck = new Set(nodesToCheck);
    };
    CompletedDocsWalker.prototype.visitClassDeclaration = function (node) {
        this.checkComments(node, Rule.ARGUMENT_CLASSES);
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitFunctionDeclaration = function (node) {
        this.checkComments(node, Rule.ARGUMENT_FUNCTIONS);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitPropertyDeclaration = function (node) {
        this.checkComments(node, Rule.ARGUMENT_PROPERTIES);
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.visitMethodDeclaration = function (node) {
        this.checkComments(node, Rule.ARGUMENT_METHODS);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    CompletedDocsWalker.prototype.checkComments = function (node, nodeToCheck) {
        if (!this.nodesToCheck.has(nodeToCheck) || node.name === undefined) {
            return;
        }
        var comments = this.getTypeChecker().getSymbolAtLocation(node.name).getDocumentationComment();
        if (comments.map(function (comment) { return comment.text; }).join("").trim() === "") {
            this.addDocumentationFailure(node, nodeToCheck);
        }
    };
    CompletedDocsWalker.prototype.addDocumentationFailure = function (node, nodeToCheck) {
        var start = node.getStart();
        var width = node.getText().split(/\r|\n/g)[0].length;
        var description = nodeToCheck[0].toUpperCase() + nodeToCheck.substring(1) + Rule.FAILURE_STRING_EXIST;
        this.addFailureAt(start, width, description);
    };
    return CompletedDocsWalker;
}(Lint.ProgramAwareRuleWalker));
exports.CompletedDocsWalker = CompletedDocsWalker;
var _a;
