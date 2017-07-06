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
var OPTION_IGNORE_CASE = "ignore-case";
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING_FACTORY = function (name) {
        return "The key '" + name + "' is not sorted alphabetically";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, {
            ignoreCase: this.ruleArguments.indexOf(OPTION_IGNORE_CASE) !== -1,
        });
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "object-literal-sort-keys",
        description: "Requires keys in object literals to be sorted alphabetically",
        rationale: "Useful in preventing merge conflicts",
        optionsDescription: "You may optionally pass \"" + OPTION_IGNORE_CASE + "\" to compare keys case insensitive.",
        options: {
            type: "string",
            enum: [OPTION_IGNORE_CASE],
        },
        optionExamples: [
            true,
            [true, OPTION_IGNORE_CASE],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (tsutils_1.isObjectLiteralExpression(node) && node.properties.length > 1 &&
            !tsutils_1.isSameLine(ctx.sourceFile, node.properties.pos, node.end)) {
            var lastKey = void 0;
            var ignoreCase = ctx.options.ignoreCase;
            outer: for (var _i = 0, _a = node.properties; _i < _a.length; _i++) {
                var property = _a[_i];
                switch (property.kind) {
                    case ts.SyntaxKind.SpreadAssignment:
                        lastKey = undefined; // reset at spread
                        break;
                    case ts.SyntaxKind.ShorthandPropertyAssignment:
                    case ts.SyntaxKind.PropertyAssignment:
                        if (property.name.kind === ts.SyntaxKind.Identifier ||
                            property.name.kind === ts.SyntaxKind.StringLiteral) {
                            var key = ignoreCase ? property.name.text.toLowerCase() : property.name.text;
                            // comparison with undefined is expected
                            if (lastKey > key) {
                                ctx.addFailureAtNode(property.name, Rule.FAILURE_STRING_FACTORY(property.name.text));
                                break outer; // only show warning on first out-of-order property
                            }
                            lastKey = key;
                        }
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}
