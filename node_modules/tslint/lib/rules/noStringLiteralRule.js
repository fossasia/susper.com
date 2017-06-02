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
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "no-string-literal",
    description: "Disallows object access via string literals.",
    rationale: "Encourages using strongly-typed property access.",
    optionsDescription: "Not configurable.",
    options: null,
    optionExamples: [true],
    type: "functionality",
    typescriptOnly: false,
    hasFix: true,
};
/* tslint:enable:object-literal-sort-keys */
Rule.FAILURE_STRING = "object access via string literals is disallowed";
exports.Rule = Rule;
function walk(ctx) {
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (tsutils_1.isElementAccessExpression(node)) {
            var argument = node.argumentExpression;
            if (argument !== undefined && tsutils_1.isStringLiteral(argument) && tsutils_1.isValidPropertyAccess(argument.text)) {
                ctx.addFailureAtNode(argument, Rule.FAILURE_STRING, 
                // expr['foo'] -> expr.foo
                Lint.Replacement.replaceFromTo(node.expression.end, node.end, "." + argument.text));
            }
        }
        return ts.forEachChild(node, cb);
    });
}
