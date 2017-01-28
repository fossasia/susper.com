"use strict";
var Task = require('../ember-cli/lib/models/task');
var chalk = require('chalk');
var child_process_1 = require('child_process');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Task.extend({
    run: function () {
        var ui = this.ui;
        return new Promise(function (resolve, reject) {
            ui.writeLine(chalk.green('Installing packages for tooling via npm.'));
            child_process_1.exec('npm install', function (err, stdout, stderr) {
                if (err) {
                    ui.writeLine(stderr);
                    ui.writeLine(chalk.red('Package install failed, see above.'));
                    reject();
                }
                else {
                    ui.writeLine(chalk.green('Installed packages for tooling via npm.'));
                    resolve();
                }
            });
        });
    }
});
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/tasks/npm-install.js.map