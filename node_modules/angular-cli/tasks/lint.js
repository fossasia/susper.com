"use strict";
var Task = require('../ember-cli/lib/models/task');
var chalk = require('chalk');
var child_process_1 = require('child_process');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Task.extend({
    run: function () {
        var ui = this.ui;
        return new Promise(function (resolve, reject) {
            child_process_1.exec('npm run lint', function (err, stdout) {
                ui.writeLine(stdout);
                if (err) {
                    ui.writeLine(chalk.red('Lint errors found in the listed files.'));
                    reject();
                }
                else {
                    ui.writeLine(chalk.green('All files pass linting.'));
                    resolve();
                }
            });
        });
    }
});
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/tasks/lint.js.map