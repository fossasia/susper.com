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
    Rule.FAILURE_STRING = function (module) {
        return "Multiple imports from '" + module + "' can be combined into one.";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoDuplicateImportsWalker(sourceFile, this.ruleName, undefined));
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
var NoDuplicateImportsWalker = /** @class */ (function (_super) {
    tslib_1.__extends(NoDuplicateImportsWalker, _super);
    function NoDuplicateImportsWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.seenImports = new Set();
        return _this;
    }
    NoDuplicateImportsWalker.prototype.walk = function (sourceFile) {
        this.checkStatements(sourceFile.statements);
    };
    NoDuplicateImportsWalker.prototype.checkStatements = function (statements) {
        for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
            var statement = statements_1[_i];
            if (tsutils_1.isImportDeclaration(statement)) {
                this.checkImport(statement);
            }
            else if (this.sourceFile.isDeclarationFile && tsutils_1.isModuleDeclaration(statement) &&
                statement.body !== undefined && statement.name.kind === ts.SyntaxKind.StringLiteral) {
                // module augmentations in declaration files can contain imports
                this.checkStatements(statement.body.statements);
            }
        }
    };
    NoDuplicateImportsWalker.prototype.checkImport = function (statement) {
        if (tsutils_1.isTextualLiteral(statement.moduleSpecifier)) {
            if (this.seenImports.has(statement.moduleSpecifier.text)) {
                return this.addFailureAtNode(statement, Rule.FAILURE_STRING(statement.moduleSpecifier.text));
            }
            this.seenImports.add(statement.moduleSpecifier.text);
        }
    };
    return NoDuplicateImportsWalker;
}(Lint.AbstractWalker));
var _a, _b;
