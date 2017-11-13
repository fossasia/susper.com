"use strict";
/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
var Lint = require("../index");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.FAILURE_STRING = function (module) {
        return "Multiple imports from '" + module + "' can be combined into one.";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-duplicate-imports",
        description: (_a = ["\n            Disallows multiple import statements from the same module."], _a.raw = ["\n            Disallows multiple import statements from the same module."], Lint.Utils.dedent(_a)),
        rationale: (_b = ["\n            Using a single import statement per module will make the code clearer because you can see everything being imported\n            from that module on one line."], _b.raw = ["\n            Using a single import statement per module will make the code clearer because you can see everything being imported\n            from that module on one line."], Lint.Utils.dedent(_b)),
        optionsDescription: "Not configurable",
        options: null,
        optionExamples: [true],
        type: "maintainability",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    var seen = new Set();
    for (var _i = 0, _a = tsutils_1.findImports(ctx.sourceFile, 1 /* ImportDeclaration */); _i < _a.length; _i++) {
        var _b = _a[_i], text = _b.text, parent = _b.parent;
        if (seen.has(text)) {
            ctx.addFailureAtNode(parent, Rule.FAILURE_STRING(text));
        }
        else {
            seen.add(text);
        }
    }
}
var _a, _b;
