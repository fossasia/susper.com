"use strict";
var SilentError = require('silent-error');
var Command = require('../ember-cli/lib/models/command');
var config_1 = require('../models/config');
var SetCommand = Command.extend({
    name: 'set',
    description: 'Set a value in the configuration.',
    works: 'everywhere',
    availableOptions: [
        { name: 'global', type: Boolean, default: false, aliases: ['g'] },
    ],
    asBoolean: function (raw) {
        if (raw == 'true' || raw == '1') {
            return true;
        }
        else if (raw == 'false' || raw == '' || raw == '0') {
            return false;
        }
        else {
            throw new SilentError("Invalid boolean value: \"" + raw + "\"");
        }
    },
    asNumber: function (raw) {
        if (Number.isNaN(+raw)) {
            throw new SilentError("Invalid number value: \"" + raw + "\"");
        }
        return +raw;
    },
    run: function (commandOptions, rawArgs) {
        var _this = this;
        return new Promise(function (resolve) {
            var jsonPath = rawArgs[0], rawValue = rawArgs[1];
            var config = config_1.CliConfig.fromProject();
            var type = config.typeOf(jsonPath);
            var value = rawValue;
            switch (type) {
                case 'boolean':
                    value = _this.asBoolean(rawValue);
                    break;
                case 'number':
                    value = _this.asNumber(rawValue);
                    break;
                case 'string':
                    value = rawValue;
                    break;
                default: value = JSON.parse(rawValue);
            }
            config.set(jsonPath, value);
            config.save();
            resolve();
        });
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SetCommand;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/commands/set.js.map