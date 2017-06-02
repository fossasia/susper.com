"use strict";
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
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = function (maxCount) {
        var maxClassWord = maxCount === 1 ? "class per file is" : "classes per file are";
        return "A maximum of " + maxCount + " " + maxClassWord + " allowed.";
    };
    Rule.prototype.apply = function (sourceFile) {
        var argument = this.ruleArguments[0];
        var maxClasses = isNaN(argument) || argument > 0 ? argument : 1;
        return this.applyWithFunction(sourceFile, walk, { maxClasses: maxClasses });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "max-classes-per-file",
    description: (_a = ["\n            A file may not contain more than the specified number of classes"], _a.raw = ["\n            A file may not contain more than the specified number of classes"], Lint.Utils.dedent(_a)),
    rationale: (_b = ["\n            Ensures that files have a single responsibility so that that classes each exist in their own files"], _b.raw = ["\n            Ensures that files have a single responsibility so that that classes each exist in their own files"], Lint.Utils.dedent(_b)),
    optionsDescription: (_c = ["\n            The one required argument is an integer indicating the maximum number of classes that can appear in a file."], _c.raw = ["\n            The one required argument is an integer indicating the maximum number of classes that can appear in a file."], Lint.Utils.dedent(_c)),
    options: {
        type: "array",
        items: [
            {
                type: "number",
                minimum: 1,
            },
        ],
        additionalItems: false,
        minLength: 1,
        maxLength: 2,
    },
    optionExamples: [[true, 1], [true, 5]],
    type: "maintainability",
    typescriptOnly: false,
};
exports.Rule = Rule;
function walk(ctx) {
    var sourceFile = ctx.sourceFile, maxClasses = ctx.options.maxClasses;
    var classes = 0;
    return ts.forEachChild(sourceFile, function cb(node) {
        if (tsutils_1.isClassLikeDeclaration(node)) {
            classes++;
            if (classes > maxClasses) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING(maxClasses));
            }
        }
        return ts.forEachChild(node, cb);
    });
}
var _a, _b, _c;
