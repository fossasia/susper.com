"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
const check_package_manager_1 = require("../utilities/check-package-manager");
const validate_project_name_1 = require("../utilities/validate-project-name");
const config_1 = require("../models/config");
const Task = require('../ember-cli/lib/models/task');
const SilentError = require('silent-error');
const packageJson = require('../package.json');
exports.default = Task.extend({
    run: function (commandOptions, _rawArgs) {
        if (commandOptions.dryRun) {
            commandOptions.skipInstall = true;
            commandOptions.skipGit = true;
        }
        const project = this.project;
        const packageName = commandOptions.name !== '.' && commandOptions.name || project.name();
        if (commandOptions.style === undefined) {
            commandOptions.style = config_1.CliConfig.fromGlobal().get('defaults.styleExt');
        }
        if (!packageName) {
            const message = 'The `ng ' + this.name + '` command requires a ' +
                'package.json in current folder with name attribute or a specified name via arguments. ' +
                'For more details, use `ng help`.';
            return Promise.reject(new SilentError(message));
        }
        validate_project_name_1.validateProjectName(packageName);
        const SchematicRunTask = require('../tasks/schematic-run').default;
        const schematicRunTask = new SchematicRunTask({
            ui: this.ui,
            project: this.project
        });
        const cwd = this.project.root;
        const schematicName = config_1.CliConfig.fromGlobal().get('defaults.schematics.newApp');
        commandOptions.version = packageJson.version;
        if (!commandOptions.skipCommit) {
            const commitMessage = fs.readFileSync(path.join(__dirname, '../utilities/INITIAL_COMMIT_MESSAGE.txt'), 'utf-8');
            commandOptions.commit = {
                message: commitMessage,
                name: process.env.GIT_AUTHOR_NAME || 'Angular CLI',
                email: process.env.GIT_AUTHOR_EMAIL || 'angular-cli@angular.io',
            };
        }
        const runOptions = {
            taskOptions: commandOptions,
            workingDir: cwd,
            emptyHost: true,
            collectionName: commandOptions.collectionName,
            schematicName
        };
        return schematicRunTask.run(runOptions)
            .then(() => {
            if (!commandOptions.skipInstall) {
                return check_package_manager_1.checkYarnOrCNPM();
            }
        })
            .then(() => {
            if (!commandOptions.dryRun) {
                process.chdir(commandOptions.directory);
                this.ui.writeLine(chalk_1.default.green(`Project '${packageName}' successfully created.`));
            }
        });
    }
});
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/tasks/init.js.map