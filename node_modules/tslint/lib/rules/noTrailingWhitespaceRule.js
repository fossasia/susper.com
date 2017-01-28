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
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoTrailingWhitespaceWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "no-trailing-whitespace",
    description: "Disallows trailing whitespace at the end of a line.",
    rationale: "Keeps version control diffs clean as it prevents accidental whitespace from being committed.",
    optionsDescription: "Not configurable.",
    hasFix: true,
    options: null,
    optionExamples: ["true"],
    type: "maintainability",
    typescriptOnly: false,
};
/* tslint:enable:object-literal-sort-keys */
Rule.FAILURE_STRING = "trailing whitespace";
exports.Rule = Rule;
var NoTrailingWhitespaceWalker = (function (_super) {
    __extends(NoTrailingWhitespaceWalker, _super);
    function NoTrailingWhitespaceWalker() {
        return _super.apply(this, arguments) || this;
    }
    NoTrailingWhitespaceWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        var lastSeenWasWhitespace = false;
        var lastSeenWhitespacePosition = 0;
        Lint.forEachToken(node, false, function (fullText, kind, pos) {
            if (kind === ts.SyntaxKind.NewLineTrivia || kind === ts.SyntaxKind.EndOfFileToken) {
                if (lastSeenWasWhitespace) {
                    _this.reportFailure(lastSeenWhitespacePosition, pos.tokenStart);
                }
                lastSeenWasWhitespace = false;
            }
            else if (kind === ts.SyntaxKind.WhitespaceTrivia) {
                lastSeenWasWhitespace = true;
                lastSeenWhitespacePosition = pos.tokenStart;
            }
            else {
                if (kind === ts.SyntaxKind.SingleLineCommentTrivia) {
                    var commentText = fullText.substring(pos.tokenStart + 2, pos.end);
                    var match = /\s+$/.exec(commentText);
                    if (match !== null) {
                        _this.reportFailure(pos.end - match[0].length, pos.end);
                    }
                }
                else if (kind === ts.SyntaxKind.MultiLineCommentTrivia) {
                    var startPos = pos.tokenStart + 2;
                    var commentText = fullText.substring(startPos, pos.end - 2);
                    var lines = commentText.split("\n");
                    // we don't want to check the content of the last comment line, as it is always followed by */
                    var len = lines.length - 1;
                    for (var i = 0; i < len; ++i) {
                        var line = lines[i];
                        // remove carriage return at the end, it is does not account to trailing whitespace
                        if (line.endsWith("\r")) {
                            line = line.substr(0, line.length - 1);
                        }
                        var start = line.search(/\s+$/);
                        if (start !== -1) {
                            _this.reportFailure(startPos + start, startPos + line.length);
                        }
                        startPos += lines[i].length + 1;
                    }
                }
                lastSeenWasWhitespace = false;
            }
        });
    };
    NoTrailingWhitespaceWalker.prototype.reportFailure = function (start, end) {
        this.addFailureFromStartToEnd(start, end, Rule.FAILURE_STRING, this.createFix(this.deleteText(start, end - start)));
    };
    return NoTrailingWhitespaceWalker;
}(Lint.RuleWalker));
