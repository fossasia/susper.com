"use strict";
var Command = require('../ember-cli/lib/models/command');
var doc_1 = require('../tasks/doc');
var DocCommand = Command.extend({
    name: 'doc',
    description: 'Opens the official Angular documentation for a given keyword.',
    works: 'everywhere',
    anonymousOptions: [
        '<keyword>'
    ],
    run: function (commandOptions, rawArgs) {
        var keyword = rawArgs[0];
        var docTask = new doc_1.DocTask({
            ui: this.ui,
            analytics: this.analytics,
            project: this.project
        });
        return docTask.run(keyword);
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DocCommand;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/commands/doc.js.map