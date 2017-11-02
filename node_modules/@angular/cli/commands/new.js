"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const chalk_1 = require("chalk");
const config_1 = require("../models/config");
const validate_project_name_1 = require("../utilities/validate-project-name");
const common_tags_1 = require("common-tags");
const { cyan } = chalk_1.default;
const Command = require('../ember-cli/lib/models/command');
const SilentError = require('silent-error');
const NewCommand = Command.extend({
    name: 'new',
    aliases: ['n'],
    description: `Creates a new directory and a new Angular app eg. "ng new [name]".`,
    works: 'outsideProject',
    availableOptions: [
        {
            name: 'dry-run',
            type: Boolean,
            default: false,
            aliases: ['d'],
            description: common_tags_1.oneLine `
        Run through without making any changes.
        Will list all files that would have been created when running "ng new".
      `
        },
        {
            name: 'verbose',
            type: Boolean,
            default: false,
            aliases: ['v'],
            description: 'Adds more details to output logging.'
        },
        {
            name: 'link-cli',
            type: Boolean,
            default: false,
            aliases: ['lc'],
            description: 'Automatically link the `@angular/cli` package.',
            hidden: true
        },
        {
            name: 'skip-install',
            type: Boolean,
            default: false,
            aliases: ['si'],
            description: 'Skip installing packages.'
        },
        {
            name: 'skip-commit',
            type: Boolean,
            default: false,
            aliases: ['sc'],
            description: 'Skip committing the first commit to git.'
        },
        {
            name: 'collection',
            type: String,
            aliases: ['c'],
            description: 'Schematics collection to use.'
        }
    ],
    isProject: function (projectPath) {
        return config_1.CliConfig.fromProject(projectPath) !== null;
    },
    getCollectionName(rawArgs) {
        let collectionName = config_1.CliConfig.fromGlobal().get('defaults.schematics.collection');
        if (rawArgs) {
            const parsedArgs = this.parseArgs(rawArgs, false);
            if (parsedArgs.options.collection) {
                collectionName = parsedArgs.options.collection;
            }
        }
        return collectionName;
    },
    beforeRun: function (rawArgs) {
        const isHelp = ['--help', '-h'].includes(rawArgs[0]);
        if (isHelp) {
            return;
        }
        const schematicName = config_1.CliConfig.getValue('defaults.schematics.newApp');
        if (/^\d/.test(rawArgs[1])) {
            SilentError.debugOrThrow('@angular/cli/commands/generate', `The \`ng new ${rawArgs[0]}\` file name cannot begin with a digit.`);
        }
        const SchematicGetOptionsTask = require('../tasks/schematic-get-options').default;
        const getOptionsTask = new SchematicGetOptionsTask({
            ui: this.ui,
            project: this.project
        });
        return getOptionsTask.run({
            schematicName,
            collectionName: this.getCollectionName(rawArgs)
        })
            .then((availableOptions) => {
            this.registerOptions({
                availableOptions: availableOptions
            });
        });
    },
    run: function (commandOptions, rawArgs) {
        const packageName = rawArgs.shift();
        if (!packageName) {
            return Promise.reject(new SilentError(`The "ng ${this.name}" command requires a name argument to be specified eg. ` +
                chalk_1.default.yellow('ng new [name] ') +
                `For more details, use "ng help".`));
        }
        validate_project_name_1.validateProjectName(packageName);
        commandOptions.name = packageName;
        if (commandOptions.dryRun) {
            commandOptions.skipGit = true;
        }
        commandOptions.directory = commandOptions.directory || packageName;
        const directoryName = path.join(process.cwd(), commandOptions.directory);
        if (fs.existsSync(directoryName) && this.isProject(directoryName)) {
            throw new SilentError(common_tags_1.oneLine `
        Directory ${directoryName} exists and is already an Angular CLI project.
      `);
        }
        if (commandOptions.collection) {
            commandOptions.collectionName = commandOptions.collection;
        }
        else {
            commandOptions.collectionName = this.getCollectionName(rawArgs);
        }
        const InitTask = require('../tasks/init').default;
        const initTask = new InitTask({
            project: this.project,
            tasks: this.tasks,
            ui: this.ui,
        });
        // Ensure skipGit has a boolean value.
        commandOptions.skipGit = commandOptions.skipGit === undefined ? false : commandOptions.skipGit;
        return initTask.run(commandOptions, rawArgs);
    },
    printDetailedHelp: function () {
        const collectionName = this.getCollectionName();
        const schematicName = config_1.CliConfig.getValue('defaults.schematics.newApp');
        const SchematicGetHelpOutputTask = require('../tasks/schematic-get-help-output').default;
        const getHelpOutputTask = new SchematicGetHelpOutputTask({
            ui: this.ui,
            project: this.project
        });
        return getHelpOutputTask.run({
            schematicName,
            collectionName,
            nonSchematicOptions: this.availableOptions.filter((o) => !o.hidden)
        })
            .then((output) => {
            const outputLines = [
                cyan(`ng new ${cyan('[name]')} ${cyan('<options...>')}`),
                ...output
            ];
            return outputLines.join('\n');
        });
    }
});
NewCommand.overrideCore = true;
exports.default = NewCommand;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/commands/new.js.map