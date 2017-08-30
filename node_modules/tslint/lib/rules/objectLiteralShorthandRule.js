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
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "object-literal-shorthand",
        description: "Enforces use of ES6 object literal shorthand when possible.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.LONGHAND_PROPERTY = "Expected property shorthand in object literal ";
    Rule.LONGHAND_METHOD = "Expected method shorthand in object literal ";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (tsutils_1.isPropertyAssignment(node)) {
            if (node.name.kind === ts.SyntaxKind.Identifier &&
                tsutils_1.isIdentifier(node.initializer) &&
                node.name.text === node.initializer.text) {
                ctx.addFailureAtNode(node, Rule.LONGHAND_PROPERTY + "('{" + node.name.text + "}').", Lint.Replacement.deleteFromTo(node.name.end, node.end));
            }
            else if (tsutils_1.isFunctionExpression(node.initializer) &&
                // allow named function expressions
                node.initializer.name === undefined) {
                var _a = handleLonghandMethod(node.name, node.initializer, ctx.sourceFile), name = _a[0], fix = _a[1];
                ctx.addFailureAtNode(node, Rule.LONGHAND_METHOD + "('{" + name + "() {...}}').", fix);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
function handleLonghandMethod(name, initializer, sourceFile) {
    var nameStart = name.getStart(sourceFile);
    var fix = Lint.Replacement.deleteFromTo(name.end, tsutils_1.getChildOfKind(initializer, ts.SyntaxKind.OpenParenToken).pos);
    var prefix = "";
    if (initializer.asteriskToken !== undefined) {
        prefix = "*";
    }
    if (tsutils_1.hasModifier(initializer.modifiers, ts.SyntaxKind.AsyncKeyword)) {
        prefix = "async " + prefix;
    }
    if (prefix !== "") {
        fix = [fix, Lint.Replacement.appendText(nameStart, prefix)];
    }
    return [prefix + sourceFile.text.substring(nameStart, name.end), fix];
}
