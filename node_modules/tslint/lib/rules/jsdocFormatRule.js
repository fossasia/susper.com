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
var utils = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "jsdoc-format",
    description: "Enforces basic format rules for JSDoc comments.",
    descriptionDetails: (_a = ["\n            The following rules are enforced for JSDoc comments (comments starting with `/**`):\n\n            * each line contains an asterisk and asterisks must be aligned\n            * each asterisk must be followed by either a space or a newline (except for the first and the last)\n            * the only characters before the asterisk on each line must be whitespace characters\n            * one line comments must start with `/** ` and end with `*/`"], _a.raw = ["\n            The following rules are enforced for JSDoc comments (comments starting with \\`/**\\`):\n\n            * each line contains an asterisk and asterisks must be aligned\n            * each asterisk must be followed by either a space or a newline (except for the first and the last)\n            * the only characters before the asterisk on each line must be whitespace characters\n            * one line comments must start with \\`/** \\` and end with \\`*/\\`"], Lint.Utils.dedent(_a)),
    rationale: "Helps maintain a consistent, readable style for JSDoc comments.",
    optionsDescription: "Not configurable.",
    options: null,
    optionExamples: [true],
    type: "style",
    typescriptOnly: false,
};
/* tslint:enable:object-literal-sort-keys */
Rule.ALIGNMENT_FAILURE_STRING = "asterisks in jsdoc must be aligned";
Rule.FORMAT_FAILURE_STRING = "jsdoc is not formatted correctly on this line";
exports.Rule = Rule;
function walk(ctx) {
    return utils.forEachComment(ctx.sourceFile, function (fullText, _a) {
        var kind = _a.kind, pos = _a.pos, end = _a.end;
        if (kind !== ts.SyntaxKind.MultiLineCommentTrivia ||
            fullText[pos + 2] !== "*" || fullText[pos + 3] === "*" || fullText[pos + 3] === "/") {
            return;
        }
        var lines = fullText.slice(pos + 3, end - 2).split("\n");
        var firstLine = lines[0];
        if (lines.length === 1) {
            if (firstLine[0] !== " " || !firstLine.endsWith(" ")) {
                ctx.addFailure(pos, end, Rule.FORMAT_FAILURE_STRING);
            }
            return;
        }
        var alignColumn = getAlignColumn(ctx.sourceFile, pos + 1);
        var lineStart = pos + firstLine.length + 4; // +3 for the comment start "/**" and +1 for the newline
        var endIndex = lines.length - 1;
        for (var i = 1; i < endIndex; ++i) {
            var line = lines[i].endsWith("\r") ? lines[i].slice(0, -1) : lines[i];
            // regex is: start of string, followed by any amount of whitespace, followed by *,
            // followed by either a space or the end of the string
            if (!/^\s*\*(?: |$)/.test(line)) {
                ctx.addFailureAt(lineStart, line.length, Rule.FORMAT_FAILURE_STRING);
            }
            if (line.indexOf("*") !== alignColumn) {
                ctx.addFailureAt(lineStart, line.length, Rule.ALIGNMENT_FAILURE_STRING);
            }
            lineStart += lines[i].length + 1; // + 1 for the splitted-out newline
        }
        var lastLine = lines[endIndex];
        // last line should only consist of whitespace
        if (lastLine.search(/\S/) !== -1) {
            ctx.addFailure(lineStart, end, Rule.FORMAT_FAILURE_STRING);
        }
        if (lastLine.length !== alignColumn) {
            ctx.addFailure(lineStart, end, Rule.ALIGNMENT_FAILURE_STRING);
        }
    });
}
function getAlignColumn(sourceFile, pos) {
    var result = ts.getLineAndCharacterOfPosition(sourceFile, pos);
    // handle files starting with BOM
    return result.line === 0 && sourceFile.text[0] === "\uFEFF"
        ? result.character - 1
        : result.character;
}
var _a;
