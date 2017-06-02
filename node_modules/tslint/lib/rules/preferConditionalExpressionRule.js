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
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = function (assigned) {
        return "Use a conditional expression instead of assigning to '" + assigned + "' in multiple places.";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "prefer-conditional-expression",
    description: (_a = ["\n            Recommends to use a conditional expression instead of assigning to the same thing in each branch of an if statement."], _a.raw = ["\n            Recommends to use a conditional expression instead of assigning to the same thing in each branch of an if statement."], Lint.Utils.dedent(_a)),
    rationale: (_b = ["\n            This reduces duplication and can eliminate an unnecessary variable declaration."], _b.raw = ["\n            This reduces duplication and can eliminate an unnecessary variable declaration."], Lint.Utils.dedent(_b)),
    optionsDescription: "Not configurable.",
    options: null,
    optionExamples: [true],
    type: "functionality",
    typescriptOnly: false,
};
exports.Rule = Rule;
function walk(ctx) {
    var sourceFile = ctx.sourceFile;
    return ts.forEachChild(sourceFile, function cb(node) {
        if (tsutils_1.isIfStatement(node)) {
            var assigned = detect(node, sourceFile);
            if (assigned !== undefined) {
                ctx.addFailureAtNode(Lint.childOfKind(node, ts.SyntaxKind.IfKeyword), Rule.FAILURE_STRING(assigned.getText(sourceFile)));
                // Be careful not to fail again for the "else if"
                ts.forEachChild(node.expression, cb);
                ts.forEachChild(node.thenStatement, cb);
                if (node.elseStatement !== undefined) {
                    ts.forEachChild(node.elseStatement, cb);
                }
                return;
            }
        }
        return ts.forEachChild(node, cb);
    });
}
function detect(_a, sourceFile) {
    var thenStatement = _a.thenStatement, elseStatement = _a.elseStatement;
    if (elseStatement === undefined) {
        return undefined;
    }
    var elze = tsutils_1.isIfStatement(elseStatement) ? detect(elseStatement, sourceFile) : getAssigned(elseStatement, sourceFile);
    if (elze === undefined) {
        return undefined;
    }
    var then = getAssigned(thenStatement, sourceFile);
    return then !== undefined && nodeEquals(elze, then, sourceFile) ? then : undefined;
}
/** Returns the left side of an assignment. */
function getAssigned(node, sourceFile) {
    if (tsutils_1.isBlock(node)) {
        return node.statements.length === 1 ? getAssigned(node.statements[0], sourceFile) : undefined;
    }
    else if (tsutils_1.isExpressionStatement(node) && tsutils_1.isBinaryExpression(node.expression)) {
        var _a = node.expression, kind = _a.operatorToken.kind, left = _a.left, right = _a.right;
        return kind === ts.SyntaxKind.EqualsToken && tsutils_1.isSameLine(sourceFile, right.getStart(sourceFile), right.end) ? left : undefined;
    }
    else {
        return undefined;
    }
}
function nodeEquals(a, b, sourceFile) {
    return a.getText(sourceFile) === b.getText(sourceFile);
}
var _a, _b;
