"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const link_cli_1 = require("../tasks/link-cli");
const npm_install_1 = require("../tasks/npm-install");
const validate_project_name_1 = require("../utilities/validate-project-name");
const check_package_manager_1 = require("../utilities/check-package-manager");
const config_1 = require("../models/config");
const Task = require('../ember-cli/lib/models/task');
const Promise = require('../ember-cli/lib/ext/promise');
const SilentError = require('silent-error');
const normalizeBlueprint = require('../ember-cli/lib/utilities/normalize-blueprint-option');
const GitInit = require('../tasks/git-init');
exports.default = Task.extend({
    run: function (commandOptions, rawArgs) {
        if (commandOptions.dryRun) {
            commandOptions.skipInstall = true;
        }
        const installBlueprint = new this.tasks.InstallBlueprint({
            ui: this.ui,
            project: this.project
        });
        // needs an explicit check in case it's just 'undefined'
        // due to passing of options from 'new' and 'addon'
        let gitInit;
        if (commandOptions.skipGit === false) {
            gitInit = new GitInit({
                ui: this.ui,
                project: this.project
            });
        }
        const packageManager = config_1.CliConfig.fromGlobal().get('packageManager');
        let npmInstall;
        if (!commandOptions.skipInstall) {
            npmInstall = new npm_install_1.default({
                ui: this.ui,
                project: this.project,
                packageManager
            });
        }
        let linkCli;
        if (commandOptions.linkCli) {
            linkCli = new link_cli_1.default({
                ui: this.ui,
                project: this.project,
                packageManager
            });
        }
        const project = this.project;
        const packageName = commandOptions.name !== '.' && commandOptions.name || project.name();
        if (!packageName) {
            const message = 'The `ng ' + this.name + '` command requires a ' +
                'package.json in current folder with name attribute or a specified name via arguments. ' +
                'For more details, use `ng help`.';
            return Promise.reject(new SilentError(message));
        }
        const blueprintOpts = {
            dryRun: commandOptions.dryRun,
            blueprint: 'ng',
            rawName: packageName,
            targetFiles: rawArgs || '',
            rawArgs: rawArgs.toString(),
            sourceDir: commandOptions.sourceDir,
            style: commandOptions.style,
            prefix: commandOptions.prefix.trim() || 'app',
            routing: commandOptions.routing,
            inlineStyle: commandOptions.inlineStyle,
            inlineTemplate: commandOptions.inlineTemplate,
            ignoredUpdateFiles: ['favicon.ico'],
            skipGit: commandOptions.skipGit,
            skipTests: commandOptions.skipTests
        };
        validate_project_name_1.validateProjectName(packageName);
        blueprintOpts.blueprint = normalizeBlueprint(blueprintOpts.blueprint);
        return installBlueprint.run(blueprintOpts)
            .then(function () {
            if (commandOptions.skipGit === false) {
                return gitInit.run(commandOptions, rawArgs);
            }
        })
            .then(function () {
            if (!commandOptions.skipInstall) {
                return npmInstall.run();
            }
        })
            .then(function () {
            if (commandOptions.linkCli) {
                return linkCli.run();
            }
        })
            .then(check_package_manager_1.checkYarnOrCNPM)
            .then(() => {
            this.ui.writeLine(chalk.green(`Project '${packageName}' successfully created.`));
        });
    }
});
//# sourceMappingURL=/users/hans/sources/angular-cli/tasks/init.js.map