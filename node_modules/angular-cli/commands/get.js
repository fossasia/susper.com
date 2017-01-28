"use strict";
var chalk = require('chalk');
var config_1 = require('../models/config');
var Command = require('../ember-cli/lib/models/command');
var GetCommand = Command.extend({
    name: 'get',
    description: 'Get a value from the configuration.',
    works: 'everywhere',
    availableOptions: [],
    run: function (commandOptions, rawArgs) {
        return new Promise(function (resolve) {
            var config = config_1.CliConfig.fromProject();
            var value = config.get(rawArgs[0]);
            if (value === null) {
                console.error(chalk.red('Value cannot be found.'));
            }
            else if (typeof value == 'object') {
                console.log(JSON.stringify(value));
            }
            else {
                console.log(value);
            }
            resolve();
        });
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GetCommand;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/commands/get.js.map