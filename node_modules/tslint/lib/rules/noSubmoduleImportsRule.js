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
        return this.applyWithWalker(new NoSubmoduleImportsWalker(sourceFile, this.ruleName, this.ruleArguments));
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
var NoSubmoduleImportsWalker = /** @class */ (function (_super) {
    tslib_1.__extends(NoSubmoduleImportsWalker, _super);
    function NoSubmoduleImportsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoSubmoduleImportsWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var findDynamicImport = function (node) {
            if (tsutils_1.isCallExpression(node) && node.arguments.length === 1 &&
                (tsutils_1.isIdentifier(node.expression) && node.expression.text === "require" ||
                    node.expression.kind === ts.SyntaxKind.ImportKeyword)) {
                _this.checkForBannedImport(node.arguments[0]);
            }
            return ts.forEachChild(node, findDynamicImport);
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
                ts.forEachChild(statement, findDynamicImport);
            }
        }
    };
    NoSubmoduleImportsWalker.prototype.checkForBannedImport = function (expression) {
        if (tsutils_1.isTextualLiteral(expression) &&
            // TODO remove assertion on upgrade to typescript@2.5.2
            !ts.isExternalModuleNameRelative(expression.text) &&
            isSubmodulePath(expression.text)) {
            /*
             * A submodule is being imported.
             * Check if its path contains any
             * of the whitelist packages.
             */
            for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
                var option = _a[_i];
                if (expression.text === option || expression.text.startsWith(option + "/")) {
                    return;
                }
            }
            this.addFailureAtNode(expression, Rule.FAILURE_STRING);
        }
    };
    return NoSubmoduleImportsWalker;
}(Lint.AbstractWalker));
function isScopedPath(path) {
    return path[0] === "@";
}
function isSubmodulePath(path) {
    return path.split("/").length > (isScopedPath(path) ? 2 : 1);
}
var _a, _b;
