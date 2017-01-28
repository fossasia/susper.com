"use strict";
var Task = require('../ember-cli/lib/models/task');
var chalk = require('chalk');
var child_process_1 = require('child_process');
exports.E2eTask = Task.extend({
    run: function () {
        var _this = this;
        var ui = this.ui;
        var exitCode = 0;
        return new Promise(function (resolve) {
            child_process_1.exec("npm run e2e -- " + _this.project.ngConfig.config.e2e.protractor.config, function (err, stdout, stderr) {
                ui.writeLine(stdout);
                if (err) {
                    ui.writeLine(stderr);
                    ui.writeLine(chalk.red('Some end-to-end tests failed, see above.'));
                    exitCode = 1;
                }
                else {
                    ui.writeLine(chalk.green('All end-to-end tests pass.'));
                }
                resolve(exitCode);
            });
        });
    }
});
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/tasks/e2e.js.map