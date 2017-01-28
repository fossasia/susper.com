"use strict";
var path = require('path');
var fs = require('fs');
var Command = require('../ember-cli/lib/models/command');
var CompletionCommand = Command.extend({
    name: 'completion',
    description: 'Adds autocomplete functionality to `ng` commands and subcommands',
    works: 'everywhere',
    run: function () {
        var scriptPath = path.resolve(__dirname, '..', 'utilities', 'completion.sh');
        var scriptOutput = fs.readFileSync(scriptPath, 'utf8');
        console.log(scriptOutput);
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompletionCommand;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/commands/completion.js.map