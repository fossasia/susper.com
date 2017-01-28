"use strict";
var fs = require('fs');
var path = require('path');
var os = require('os');
var chalk = require('chalk');
var EmberGenerateCommand = require('../ember-cli/lib/commands/generate');
var Blueprint = require('../ember-cli/lib/models/blueprint');
var SilentError = require('silent-error');
var GenerateCommand = EmberGenerateCommand.extend({
    name: 'generate',
    beforeRun: function (rawArgs) {
        if (!rawArgs.length) {
            return;
        }
        // map the blueprint name to allow for aliases
        rawArgs[0] = mapBlueprintName(rawArgs[0]);
        if (rawArgs[0] !== '--help' &&
            !fs.existsSync(path.join(__dirname, '..', 'blueprints', rawArgs[0]))) {
            SilentError.debugOrThrow('angular-cli/commands/generate', "Invalid blueprint: " + rawArgs[0]);
        }
        if (!rawArgs[1]) {
            SilentError.debugOrThrow('angular-cli/commands/generate', "The `ng generate " + rawArgs[0] + "` command requires a name to be specified.");
        }
        // Override default help to hide ember blueprints
        EmberGenerateCommand.prototype.printDetailedHelp = function () {
            var blueprintList = fs.readdirSync(path.join(__dirname, '..', 'blueprints'));
            var blueprints = blueprintList
                .filter(function (bp) { return bp.indexOf('-test') === -1; })
                .filter(function (bp) { return bp !== 'ng2'; })
                .filter(function (bp) { return bp !== 'mobile'; })
                .map(function (bp) { return Blueprint.load(path.join(__dirname, '..', 'blueprints', bp)); });
            var output = '';
            blueprints
                .forEach(function (bp) {
                output += bp.printBasicHelp(false) + os.EOL;
            });
            this.ui.writeLine(chalk.cyan('  Available blueprints'));
            this.ui.writeLine(output);
        };
        return EmberGenerateCommand.prototype.beforeRun.apply(this, arguments);
    }
});
function mapBlueprintName(name) {
    var mappedName = aliasMap[name];
    return mappedName ? mappedName : name;
}
var aliasMap = {
    'cl': 'class',
    'c': 'component',
    'd': 'directive',
    'e': 'enum',
    'm': 'module',
    'p': 'pipe',
    'r': 'route',
    's': 'service'
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GenerateCommand;
GenerateCommand.overrideCore = true;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/commands/generate.js.map