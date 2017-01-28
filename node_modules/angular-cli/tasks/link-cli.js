"use strict";
var Task = require('../ember-cli/lib/models/task');
var chalk = require('chalk');
var child_process_1 = require('child_process');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Task.extend({
    run: function () {
        var ui = this.ui;
        return new Promise(function (resolve, reject) {
            child_process_1.exec('npm link angular-cli', function (err) {
                if (err) {
                    ui.writeLine(chalk.red('Couldn\'t do \'npm link angular-cli\'.'));
                    reject();
                }
                else {
                    ui.writeLine(chalk.green('Successfully linked to angular-cli.'));
                    resolve();
                }
            });
        });
    }
});
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/tasks/link-cli.js.map