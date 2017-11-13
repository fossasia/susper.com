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
var ts = require("typescript");
var Lint = require("../index");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var text = sourceFile.text;
        // ignore shebang if it exists
        var offset = text.startsWith("#!") ? text.indexOf("\n") : 0;
        // returns the text of the first comment or undefined
        var commentText = ts.forEachLeadingCommentRange(text, offset, function (pos, end, kind) { return text.substring(pos + 2, kind === ts.SyntaxKind.SingleLineCommentTrivia ? end : end - 2); });
        if (commentText === undefined || !new RegExp(this.ruleArguments[0]).test(commentText)) {
            if (offset !== 0) {
                ++offset; // show warning in next line after shebang
            }
            return [new Lint.RuleFailure(sourceFile, offset, offset, Rule.FAILURE_STRING, this.ruleName)];
        }
        return [];
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "file-header",
        description: "Enforces a certain header comment for all files, matched by a regular expression.",
        optionsDescription: "Regular expression to match the header.",
        options: {
            type: "string",
        },
        optionExamples: [[true, "Copyright \\d{4}"]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "missing file header";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
