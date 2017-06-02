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
var OPTION_NO_PUBLIC = "no-public";
var OPTION_CHECK_ACCESSOR = "check-accessor";
var OPTION_CHECK_CONSTRUCTOR = "check-constructor";
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.FAILURE_STRING_FACTORY = function (memberType, memberName) {
        memberName = memberName === undefined ? "" : " '" + memberName + "'";
        return "The " + memberType + memberName + " must be marked either 'private', 'public', or 'protected'";
    };
    Rule.prototype.apply = function (sourceFile) {
        var options = this.ruleArguments;
        var noPublic = options.indexOf(OPTION_NO_PUBLIC) !== -1;
        var checkAccessor = options.indexOf(OPTION_CHECK_ACCESSOR) !== -1;
        var checkConstructor = options.indexOf(OPTION_CHECK_CONSTRUCTOR) !== -1;
        if (noPublic) {
            if (checkAccessor || checkConstructor) {
                throw new Error("If 'no-public' is present, it should be the only option.");
            }
            checkAccessor = checkConstructor = true;
        }
        return this.applyWithFunction(sourceFile, function (ctx) { return walk(ctx, noPublic, checkAccessor, checkConstructor); });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "member-access",
    description: "Requires explicit visibility declarations for class members.",
    rationale: "Explicit visibility declarations can make code more readable and accessible for those new to TS.",
    optionsDescription: (_a = ["\n            These arguments may be optionally provided:\n\n            * `\"no-public\"` forbids public accessibility to be specified, because this is the default.\n            * `\"check-accessor\"` enforces explicit visibility on get/set accessors\n            * `\"check-constructor\"`  enforces explicit visibility on constructors"], _a.raw = ["\n            These arguments may be optionally provided:\n\n            * \\`\"no-public\"\\` forbids public accessibility to be specified, because this is the default.\n            * \\`\"check-accessor\"\\` enforces explicit visibility on get/set accessors\n            * \\`\"check-constructor\"\\`  enforces explicit visibility on constructors"], Lint.Utils.dedent(_a)),
    options: {
        type: "array",
        items: {
            type: "string",
            enum: [OPTION_NO_PUBLIC, OPTION_CHECK_ACCESSOR, OPTION_CHECK_CONSTRUCTOR],
        },
        minLength: 0,
        maxLength: 3,
    },
    optionExamples: [true, [true, OPTION_NO_PUBLIC], [true, OPTION_CHECK_ACCESSOR]],
    type: "typescript",
    typescriptOnly: true,
};
/* tslint:enable:object-literal-sort-keys */
Rule.FAILURE_STRING_NO_PUBLIC = "'public' is implicit.";
exports.Rule = Rule;
function walk(ctx, noPublic, checkAccessor, checkConstructor) {
    return ts.forEachChild(ctx.sourceFile, function recur(node) {
        if (tsutils_1.isClassLikeDeclaration(node)) {
            for (var _i = 0, _a = node.members; _i < _a.length; _i++) {
                var child = _a[_i];
                if (shouldCheck(child)) {
                    check(child);
                }
            }
        }
        return ts.forEachChild(node, recur);
    });
    function shouldCheck(node) {
        switch (node.kind) {
            case ts.SyntaxKind.Constructor:
                return checkConstructor;
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor:
                return checkAccessor;
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.PropertyDeclaration:
                return true;
            default:
                return false;
        }
    }
    function check(node) {
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword, ts.SyntaxKind.PrivateKeyword)) {
            return;
        }
        var isPublic = Lint.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword);
        if (noPublic && isPublic) {
            var publicKeyword = node.modifiers.find(function (m) { return m.kind === ts.SyntaxKind.PublicKeyword; });
            ctx.addFailureAtNode(publicKeyword, Rule.FAILURE_STRING_NO_PUBLIC);
        }
        if (!noPublic && !isPublic) {
            var nameNode = tsutils_1.isConstructorDeclaration(node)
                ? tsutils_1.getChildOfKind(node, ts.SyntaxKind.ConstructorKeyword)
                : node.name !== undefined ? node.name : node;
            var memberName = node.name !== undefined && tsutils_1.isIdentifier(node.name) ? node.name.text : undefined;
            ctx.addFailureAtNode(nameNode, Rule.FAILURE_STRING_FACTORY(memberType(node), memberName));
        }
    }
}
function memberType(node) {
    switch (node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
            return "class method";
        case ts.SyntaxKind.PropertyDeclaration:
            return "class property";
        case ts.SyntaxKind.Constructor:
            return "class constructor";
        case ts.SyntaxKind.GetAccessor:
            return "get property accessor";
        case ts.SyntaxKind.SetAccessor:
            return "set property accessor";
        default:
            throw new Error("unhandled node type " + ts.SyntaxKind[node.kind]);
    }
}
var _a;
