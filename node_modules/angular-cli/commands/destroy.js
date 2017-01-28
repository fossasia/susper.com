"use strict";
var Command = require('../ember-cli/lib/models/command');
var SilentError = require('silent-error');
var DestroyCommand = Command.extend({
    name: 'destroy',
    aliases: ['d'],
    works: 'insideProject',
    anonymousOptions: [
        '<blueprint>'
    ],
    run: function () {
        return Promise.reject(new SilentError('The destroy command is not supported by Angular-CLI.'));
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DestroyCommand;
DestroyCommand.overrideCore = true;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/commands/destroy.js.map