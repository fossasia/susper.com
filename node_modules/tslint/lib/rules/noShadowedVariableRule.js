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
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING_FACTORY = function (name) {
        return "Shadowed name: '" + name + "'";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoShadowedVariableWalker(sourceFile, this.ruleName, undefined));
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-shadowed-variable",
        description: "Disallows shadowing variable declarations.",
        rationale: "Shadowing a variable masks access to it and obscures to what value an identifier actually refers.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var Scope = (function () {
    function Scope(functionScope) {
        this.variables = new Map();
        this.variablesSeen = new Map();
        this.reassigned = new Set();
        // if no functionScope is provided we are in the process of creating a new function scope, which for consistency links to itself
        this.functionScope = functionScope !== undefined ? functionScope : this;
    }
    Scope.prototype.addVariable = function (identifier, blockScoped) {
        if (blockScoped === void 0) { blockScoped = true; }
        // block scoped variables go to the block scope, function scoped variables to the containing function scope
        var scope = blockScoped ? this : this.functionScope;
        var list = scope.variables.get(identifier.text);
        if (list === undefined) {
            scope.variables.set(identifier.text, [identifier]);
        }
        else {
            list.push(identifier);
        }
    };
    return Scope;
}());
var NoShadowedVariableWalker = (function (_super) {
    tslib_1.__extends(NoShadowedVariableWalker, _super);
    function NoShadowedVariableWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoShadowedVariableWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        this.scope = new Scope();
        var cb = function (node) {
            var parentScope = _this.scope;
            if (tsutils_1.isFunctionExpression(node) && node.name !== undefined) {
                /* special handling for named function expressions:
                   technically the name of the function is only visible inside of it,
                   but variables with the same name declared inside don't cause compiler errors.
                   Therefore we add an additional function scope only for the function name to avoid merging with other declarations */
                var functionScope = new Scope();
                functionScope.addVariable(node.name, false);
                _this.scope = new Scope();
                ts.forEachChild(node, cb);
                _this.onScopeEnd(functionScope);
                _this.scope = functionScope;
                _this.onScopeEnd(parentScope);
                _this.scope = parentScope;
                return;
            }
            var boundary = tsutils_1.isScopeBoundary(node);
            if (boundary === 2 /* Block */) {
                _this.scope = new Scope(parentScope.functionScope);
            }
            else if (boundary === 1 /* Function */) {
                _this.scope = new Scope();
            }
            switch (node.kind) {
                case ts.SyntaxKind.VariableDeclarationList:
                    _this.handleVariableDeclarationList(node);
                    break;
                case ts.SyntaxKind.ClassExpression:
                    if (node.name !== undefined) {
                        _this.scope.addVariable(node.name);
                    }
                    break;
                case ts.SyntaxKind.TypeParameter:
                    _this.scope.addVariable(node.name);
                    break;
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.ClassDeclaration:
                    if (node.name !== undefined) {
                        parentScope.addVariable(node.name, node.kind !== ts.SyntaxKind.FunctionDeclaration);
                    }
                    break;
                case ts.SyntaxKind.TypeAliasDeclaration:
                case ts.SyntaxKind.EnumDeclaration:
                case ts.SyntaxKind.InterfaceDeclaration:
                    parentScope.addVariable(node.name);
                    break;
                case ts.SyntaxKind.Parameter:
                    if (!tsutils_1.isThisParameter(node) && tsutils_1.isFunctionWithBody(node.parent)) {
                        _this.handleBindingName(node.name, false);
                    }
                    break;
                case ts.SyntaxKind.ModuleDeclaration:
                    if (node.parent.kind !== ts.SyntaxKind.ModuleDeclaration &&
                        node.name.kind === ts.SyntaxKind.Identifier) {
                        parentScope.addVariable(node.name, false);
                    }
                    break;
                case ts.SyntaxKind.ImportClause:
                    if (node.name !== undefined) {
                        _this.scope.addVariable(node.name, false);
                    }
                    break;
                case ts.SyntaxKind.NamespaceImport:
                case ts.SyntaxKind.ImportSpecifier:
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    _this.scope.addVariable(node.name, false);
            }
            if (boundary !== 0 /* None */) {
                ts.forEachChild(node, cb);
                _this.onScopeEnd(parentScope);
                _this.scope = parentScope;
            }
            else {
                return ts.forEachChild(node, cb);
            }
        };
        ts.forEachChild(sourceFile, cb);
        this.onScopeEnd();
    };
    NoShadowedVariableWalker.prototype.handleVariableDeclarationList = function (node) {
        var blockScoped = tsutils_1.isBlockScopedVariableDeclarationList(node);
        for (var _i = 0, _a = node.declarations; _i < _a.length; _i++) {
            var variable = _a[_i];
            this.handleBindingName(variable.name, blockScoped);
        }
    };
    NoShadowedVariableWalker.prototype.handleBindingName = function (node, blockScoped) {
        if (node.kind === ts.SyntaxKind.Identifier) {
            this.scope.addVariable(node, blockScoped);
        }
        else {
            for (var _i = 0, _a = node.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element.kind !== ts.SyntaxKind.OmittedExpression) {
                    this.handleBindingName(element.name, blockScoped);
                }
            }
        }
    };
    NoShadowedVariableWalker.prototype.onScopeEnd = function (parent) {
        var _this = this;
        var _a = this.scope, variables = _a.variables, variablesSeen = _a.variablesSeen;
        variablesSeen.forEach(function (identifiers, name) {
            if (variables.has(name)) {
                for (var _i = 0, identifiers_1 = identifiers; _i < identifiers_1.length; _i++) {
                    var identifier = identifiers_1[_i];
                    _this.addFailureAtNode(identifier, Rule.FAILURE_STRING_FACTORY(name));
                }
            }
            else if (parent !== undefined) {
                addToList(parent.variablesSeen, name, identifiers);
            }
        });
        if (parent !== undefined) {
            variables.forEach(function (identifiers, name) {
                addToList(parent.variablesSeen, name, identifiers);
            });
        }
    };
    return NoShadowedVariableWalker;
}(Lint.AbstractWalker));
function addToList(map, name, identifiers) {
    var list = map.get(name);
    if (list === undefined) {
        map.set(name, identifiers);
    }
    else {
        list.push.apply(list, identifiers);
    }
}
