/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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
var ts = require("typescript");
var Lint = require("../index");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoMagicNumbersWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "no-magic-numbers",
    description: (_a = ["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."], _a.raw = ["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."], Lint.Utils.dedent(_a)),
    rationale: (_b = ["\n            Magic numbers should be avoided as they often lack documentation, forcing\n            them to be stored in variables gives them implicit documentation."], _b.raw = ["\n            Magic numbers should be avoided as they often lack documentation, forcing\n            them to be stored in variables gives them implicit documentation."], Lint.Utils.dedent(_b)),
    optionsDescription: "A list of allowed numbers.",
    options: {
        type: "array",
        items: {
            type: "number",
        },
        minLength: 1,
    },
    optionExamples: ["true", "[true, 1, 2, 3]"],
    type: "typescript",
    typescriptOnly: false,
};
/* tslint:enable:object-literal-sort-keys */
Rule.FAILURE_STRING = "'magic numbers' are not allowed";
Rule.ALLOWED_NODES = new Set([
    ts.SyntaxKind.ExportAssignment,
    ts.SyntaxKind.FirstAssignment,
    ts.SyntaxKind.LastAssignment,
    ts.SyntaxKind.PropertyAssignment,
    ts.SyntaxKind.ShorthandPropertyAssignment,
    ts.SyntaxKind.VariableDeclaration,
    ts.SyntaxKind.VariableDeclarationList,
    ts.SyntaxKind.EnumMember,
    ts.SyntaxKind.PropertyDeclaration,
    ts.SyntaxKind.Parameter,
]);
Rule.DEFAULT_ALLOWED = [-1, 0, 1];
exports.Rule = Rule;
var NoMagicNumbersWalker = (function (_super) {
    __extends(NoMagicNumbersWalker, _super);
    function NoMagicNumbersWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        var configOptions = _this.getOptions();
        var allowedNumbers = configOptions.length > 0 ? configOptions : Rule.DEFAULT_ALLOWED;
        _this.allowed = new Set(allowedNumbers.map(String));
        return _this;
    }
    NoMagicNumbersWalker.prototype.visitNode = function (node) {
        var num = getLiteralNumber(node);
        if (num !== undefined) {
            if (!Rule.ALLOWED_NODES.has(node.parent.kind) && !this.allowed.has(num)) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        else {
            _super.prototype.visitNode.call(this, node);
        }
    };
    return NoMagicNumbersWalker;
}(Lint.RuleWalker));
/** If node is a number literal, return a string representation of that number. */
function getLiteralNumber(node) {
    if (node.kind === ts.SyntaxKind.NumericLiteral) {
        return node.text;
    }
    if (node.kind !== ts.SyntaxKind.PrefixUnaryExpression) {
        return undefined;
    }
    var _a = node, operator = _a.operator, operand = _a.operand;
    if (operator === ts.SyntaxKind.MinusToken && operand.kind === ts.SyntaxKind.NumericLiteral) {
        return "-" + operand.text;
    }
    return undefined;
}
var _a, _b;
