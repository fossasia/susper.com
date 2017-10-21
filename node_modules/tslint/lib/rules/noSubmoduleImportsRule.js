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
var ts = require("typescript");
var Lint = require("../index");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-submodule-imports",
        description: (_a = ["\n            Disallows importing any submodule."], _a.raw = ["\n            Disallows importing any submodule."], Lint.Utils.dedent(_a)),
        rationale: (_b = ["\n            Submodules of some packages are treated as private APIs and the import\n            paths may change without deprecation periods. It's best to stick with\n            top-level package exports."], _b.raw = ["\n            Submodules of some packages are treated as private APIs and the import\n            paths may change without deprecation periods. It's best to stick with\n            top-level package exports."], Lint.Utils.dedent(_b)),
        optionsDescription: "A list of whitelisted package or submodule names.",
        options: {
            type: "array",
            items: {
                type: "string",
            },
        },
        optionExamples: [true, [true, "rxjs", "@angular/platform-browser", "@angular/core/testing"]],
        type: "functionality",
        typescriptOnly: false,
    };
    Rule.FAILURE_STRING = "Submodule import paths from this package are disallowed; import from the root instead";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    for (var _i = 0, _a = tsutils_1.findImports(ctx.sourceFile, 31 /* All */); _i < _a.length; _i++) {
        var name = _a[_i];
        // TODO remove assertion on upgrade to typescript@2.5.2
        if (!ts.isExternalModuleNameRelative(name.text) &&
            isSubmodulePath(name.text) &&
            !isWhitelisted(name.text, ctx.options)) {
            ctx.addFailureAtNode(name, Rule.FAILURE_STRING);
        }
    }
}
function isWhitelisted(path, whitelist) {
    for (var _i = 0, whitelist_1 = whitelist; _i < whitelist_1.length; _i++) {
        var option = whitelist_1[_i];
        if (path === option || path.startsWith(option + "/")) {
            return true;
        }
    }
    return false;
}
function isSubmodulePath(path) {
    return path.split("/").length > (path[0] === "@" ? 2 : 1);
}
var _a, _b;
