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
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = function (moduleReference) {
        return "No need to reference \"" + moduleReference + "\", since it is imported.";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoReferenceImportWalker(sourceFile, this.ruleName, undefined));
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-reference-import",
        description: 'Don\'t `<reference types="foo" />` if you import `foo` anyway.',
        optionsDescription: "Not configurable.",
        options: null,
        type: "style",
        typescriptOnly: true,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoReferenceImportWalker = /** @class */ (function (_super) {
    tslib_1.__extends(NoReferenceImportWalker, _super);
    function NoReferenceImportWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imports = new Set();
        return _this;
    }
    NoReferenceImportWalker.prototype.walk = function (sourceFile) {
        if (sourceFile.typeReferenceDirectives.length === 0) {
            return;
        }
        this.findImports(sourceFile.statements);
        for (var _i = 0, _a = sourceFile.typeReferenceDirectives; _i < _a.length; _i++) {
            var ref = _a[_i];
            if (this.imports.has(ref.fileName)) {
                this.addFailure(ref.pos, ref.end, Rule.FAILURE_STRING(ref.fileName));
            }
        }
    };
    NoReferenceImportWalker.prototype.findImports = function (statements) {
        for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
            var statement = statements_1[_i];
            if (tsutils_1.isImportDeclaration(statement)) {
                this.addImport(statement.moduleSpecifier);
            }
            else if (tsutils_1.isImportEqualsDeclaration(statement)) {
                if (statement.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference &&
                    statement.moduleReference.expression !== undefined) {
                    this.addImport(statement.moduleReference.expression);
                }
            }
            else if (tsutils_1.isModuleDeclaration(statement) && statement.body !== undefined && this.sourceFile.isDeclarationFile) {
                // There can't be any imports in a module augmentation or namespace
                this.findImportsInModule(statement.body);
            }
        }
    };
    NoReferenceImportWalker.prototype.findImportsInModule = function (body) {
        if (body.kind === ts.SyntaxKind.ModuleBlock) {
            return this.findImports(body.statements);
        }
        else if (body.kind === ts.SyntaxKind.ModuleDeclaration && body.body !== undefined) {
            return this.findImportsInModule(body.body);
        }
    };
    NoReferenceImportWalker.prototype.addImport = function (specifier) {
        if (tsutils_1.isStringLiteral(specifier)) {
            this.imports.add(specifier.text);
        }
    };
    return NoReferenceImportWalker;
}(Lint.AbstractWalker));
