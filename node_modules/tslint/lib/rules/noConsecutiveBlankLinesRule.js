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
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require("typescript");
var Lint = require("../index");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING_FACTORY = function (allowed) {
        return allowed === 1
            ? "Consecutive blank lines are forbidden"
            : "Exceeds the " + allowed + " allowed consecutive blank lines";
    };
    ;
    /**
     * Disable the rule if the option is provided but non-numeric or less than the minimum.
     */
    Rule.prototype.isEnabled = function () {
        if (!_super.prototype.isEnabled.call(this)) {
            return false;
        }
        var options = this.getOptions();
        var allowedBlanks = options.ruleArguments && options.ruleArguments[0] || Rule.DEFAULT_ALLOWED_BLANKS;
        return typeof allowedBlanks === "number" && allowedBlanks >= Rule.MINIMUM_ALLOWED_BLANKS;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoConsecutiveBlankLinesWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.DEFAULT_ALLOWED_BLANKS = 1;
Rule.MINIMUM_ALLOWED_BLANKS = 1;
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "no-consecutive-blank-lines",
    description: "Disallows one or more blank lines in a row.",
    rationale: "Helps maintain a readable style in your codebase.",
    optionsDescription: (_a = ["\n            An optional number of maximum allowed sequential blanks can be specified. If no value\n            is provided, a default of $(Rule.DEFAULT_ALLOWED_BLANKS) will be used."], _a.raw = ["\n            An optional number of maximum allowed sequential blanks can be specified. If no value\n            is provided, a default of $(Rule.DEFAULT_ALLOWED_BLANKS) will be used."], Lint.Utils.dedent(_a)),
    options: {
        type: "number",
        minimum: "$(Rule.MINIMUM_ALLOWED_BLANKS)",
    },
    optionExamples: ["true", "[true, 2]"],
    type: "style",
    typescriptOnly: false,
};
exports.Rule = Rule;
var NoConsecutiveBlankLinesWalker = (function (_super) {
    __extends(NoConsecutiveBlankLinesWalker, _super);
    function NoConsecutiveBlankLinesWalker() {
        return _super.apply(this, arguments) || this;
    }
    NoConsecutiveBlankLinesWalker.prototype.walk = function (node) {
        var templateIntervals = this.getTemplateIntervals(node);
        var lineStarts = node.getLineStarts();
        var options = this.getOptions();
        var allowedBlanks = options && options[0] || Rule.DEFAULT_ALLOWED_BLANKS;
        var failureMessage = Rule.FAILURE_STRING_FACTORY(allowedBlanks);
        var sourceFileText = node.getFullText();
        var soureFileLines = sourceFileText.split(/\n/);
        // find all the lines that are blank or only contain whitespace
        var blankLineIndexes = [];
        soureFileLines.forEach(function (txt, i) {
            if (txt.trim() === "") {
                blankLineIndexes.push(i);
            }
        });
        // now only throw failures for the fisrt number from groups of consecutive blank line indexes
        var sequences = [];
        var lastVal = -2;
        for (var _i = 0, blankLineIndexes_1 = blankLineIndexes; _i < blankLineIndexes_1.length; _i++) {
            var line = blankLineIndexes_1[_i];
            line > lastVal + 1 ? sequences.push([line]) : sequences[sequences.length - 1].push(line);
            lastVal = line;
        }
        var _loop_1 = function (arr) {
            if (arr.length <= allowedBlanks) {
                return "continue";
            }
            var startLineNum = arr[0];
            var pos = lineStarts[startLineNum + 1];
            var isInTemplate = templateIntervals.some(function (interval) { return pos >= interval.startPosition && pos < interval.endPosition; });
            if (!isInTemplate) {
                this_1.addFailureAt(pos, 1, failureMessage);
            }
        };
        var this_1 = this;
        for (var _a = 0, sequences_1 = sequences; _a < sequences_1.length; _a++) {
            var arr = sequences_1[_a];
            _loop_1(arr);
        }
    };
    NoConsecutiveBlankLinesWalker.prototype.getTemplateIntervals = function (sourceFile) {
        var intervals = [];
        var cb = function (node) {
            if (node.kind >= ts.SyntaxKind.FirstTemplateToken &&
                node.kind <= ts.SyntaxKind.LastTemplateToken) {
                intervals.push({
                    endPosition: node.getEnd(),
                    startPosition: node.getStart(sourceFile),
                });
            }
            else {
                ts.forEachChild(node, cb);
            }
        };
        ts.forEachChild(sourceFile, cb);
        return intervals;
    };
    return NoConsecutiveBlankLinesWalker;
}(Lint.RuleWalker));
var _a;
