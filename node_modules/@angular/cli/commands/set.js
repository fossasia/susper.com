"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../models/config");
const SilentError = require('silent-error');
const Command = require('../ember-cli/lib/models/command');
const SetCommand = Command.extend({
    name: 'set',
    description: 'Set a value in the configuration.',
    works: 'everywhere',
    availableOptions: [
        {
            name: 'global',
            type: Boolean,
            'default': false,
            aliases: ['g'],
            description: 'Set the value in the global configuration rather than in your project\'s.'
        },
    ],
    asBoolean: function (raw) {
        if (raw == 'true' || raw == '1') {
            return true;
        }
        else if (raw == 'false' || raw == '' || raw == '0') {
            return false;
        }
        else {
            throw new SilentError(`Invalid boolean value: "${raw}"`);
        }
    },
    asNumber: function (raw) {
        if (Number.isNaN(+raw)) {
            throw new SilentError(`Invalid number value: "${raw}"`);
        }
        return +raw;
    },
    run: function (commandOptions, rawArgs) {
        return new Promise(resolve => {
            const config = commandOptions.global ? config_1.CliConfig.fromGlobal() : config_1.CliConfig.fromProject();
            if (config === null) {
                throw new SilentError('No config found. If you want to use global configuration, '
                    + 'you need the --global argument.');
            }
            let [jsonPath, rawValue] = rawArgs;
            if (rawValue === undefined) {
                [jsonPath, rawValue] = jsonPath.split('=', 2);
                if (rawValue === undefined) {
                    throw new SilentError('Must specify a value.');
                }
            }
            const type = config.typeOf(jsonPath);
            let value = rawValue;
            switch (type) {
                case 'boolean':
                    value = this.asBoolean(rawValue);
                    break;
                case 'number':
                    value = this.asNumber(rawValue);
                    break;
                case 'string':
                    value = rawValue;
                    break;
                default: value = parseValue(rawValue, jsonPath);
            }
            config.set(jsonPath, value);
            config.save();
            resolve();
        });
    }
});
function parseValue(rawValue, path) {
    try {
        return JSON.parse(rawValue);
    }
    catch (error) {
        throw new SilentError(`No node found at path ${path}`);
    }
}
exports.default = SetCommand;
//# sourceMappingURL=/users/hansl/sources/angular-cli/commands/set.js.map