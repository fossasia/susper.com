"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task = require('../ember-cli/lib/models/task');
const chalk = require("chalk");
const child_process_1 = require("child_process");
const check_package_manager_1 = require("../utilities/check-package-manager");
exports.default = Task.extend({
    run: function () {
        const ui = this.ui;
        let packageManager = this.packageManager;
        if (packageManager === 'default') {
            packageManager = 'npm';
        }
        return check_package_manager_1.checkYarnOrCNPM().then(function () {
            ui.writeLine(chalk.green(`Installing packages for tooling via ${packageManager}.`));
            let installCommand = `${packageManager} install`;
            if (packageManager === 'npm') {
                installCommand = `${packageManager} --quiet install`;
            }
            child_process_1.exec(installCommand, (err, _stdout, stderr) => {
                if (err) {
                    ui.writeLine(stderr);
                    const message = 'Package install failed, see above.';
                    ui.writeLine(chalk.red(message));
                    throw new Error(message);
                }
                else {
                    ui.writeLine(chalk.green(`Installed packages for tooling via ${packageManager}.`));
                }
            });
        });
    }
});
//# sourceMappingURL=/users/hansl/sources/angular-cli/tasks/npm-install.js.map