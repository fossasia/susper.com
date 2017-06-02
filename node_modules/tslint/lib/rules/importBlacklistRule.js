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
    Rule.prototype.isEnabled = function () {
        return _super.prototype.isEnabled.call(this) && this.ruleArguments.length > 0;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ImportBlacklistWalker(sourceFile, this.ruleName, this.ruleArguments));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "import-blacklist",
    description: (_a = ["\n            Disallows importing the specified modules directly via `import` and `require`.\n            Instead only sub modules may be imported from that module."], _a.raw = ["\n            Disallows importing the specified modules directly via \\`import\\` and \\`require\\`.\n            Instead only sub modules may be imported from that module."], Lint.Utils.dedent(_a)),
    rationale: (_b = ["\n            Some libraries allow importing their submodules instead of the entire module.\n            This is good practise as it avoids loading unused modules."], _b.raw = ["\n            Some libraries allow importing their submodules instead of the entire module.\n            This is good practise as it avoids loading unused modules."], Lint.Utils.dedent(_b)),
    optionsDescription: "A list of blacklisted modules.",
    options: {
        type: "array",
        items: {
            type: "string",
        },
        minLength: 1,
    },
    optionExamples: [true, [true, "rxjs", "lodash"]],
    type: "functionality",
    typescriptOnly: false,
};
Rule.FAILURE_STRING = "This import is blacklisted, import a submodule instead";
exports.Rule = Rule;
var ImportBlacklistWalker = (function (_super) {
    tslib_1.__extends(ImportBlacklistWalker, _super);
    function ImportBlacklistWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImportBlacklistWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var findRequire = function (node) {
            if (tsutils_1.isCallExpression(node) && node.arguments.length === 1 &&
                tsutils_1.isIdentifier(node.expression) && node.expression.text === "require") {
                _this.checkForBannedImport(node.arguments[0]);
            }
            return ts.forEachChild(node, findRequire);
        };
        for (var _i = 0, _a = sourceFile.statements; _i < _a.length; _i++) {
            var statement = _a[_i];
            if (tsutils_1.isImportDeclaration(statement)) {
                this.checkForBannedImport(statement.moduleSpecifier);
            }
            else if (tsutils_1.isImportEqualsDeclaration(statement)) {
                if (tsutils_1.isExternalModuleReference(statement.moduleReference) && statement.moduleReference.expression !== undefined) {
                    this.checkForBannedImport(statement.moduleReference.expression);
                }
            }
            else {
                ts.forEachChild(statement, findRequire);
            }
        }
    };
    ImportBlacklistWalker.prototype.checkForBannedImport = function (expression) {
        if (tsutils_1.isTextualLiteral(expression) && this.options.indexOf(expression.text) !== -1) {
            this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING);
        }
    };
    return ImportBlacklistWalker;
}(Lint.AbstractWalker));
var _a, _b;
