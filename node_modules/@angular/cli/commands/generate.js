"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const os = require("os");
const chalk = require('chalk');
const EmberGenerateCommand = require('../ember-cli/lib/commands/generate');
const Blueprint = require('../ember-cli/lib/models/blueprint');
const SilentError = require('silent-error');
const blueprintList = fs.readdirSync(path.join(__dirname, '..', 'blueprints'));
const blueprints = blueprintList
    .filter(bp => bp.indexOf('-test') === -1)
    .filter(bp => bp !== 'ng')
    .map(bp => Blueprint.load(path.join(__dirname, '..', 'blueprints', bp)));
const GenerateCommand = EmberGenerateCommand.extend({
    name: 'generate',
    blueprints: blueprints,
    beforeRun: function (rawArgs) {
        if (!rawArgs.length) {
            return;
        }
        // map the blueprint name to allow for aliases
        rawArgs[0] = mapBlueprintName(rawArgs[0]);
        const isHelp = ['--help', '-h'].indexOf(rawArgs[0]) > -1;
        if (!isHelp && !fs.existsSync(path.join(__dirname, '..', 'blueprints', rawArgs[0]))) {
            SilentError.debugOrThrow('@angular/cli/commands/generate', `Invalid blueprint: ${rawArgs[0]}`);
        }
        if (!isHelp && !rawArgs[1]) {
            SilentError.debugOrThrow('@angular/cli/commands/generate', `The \`ng generate ${rawArgs[0]}\` command requires a name to be specified.`);
        }
        // Override default help to hide ember blueprints
        EmberGenerateCommand.prototype.printDetailedHelp = function () {
            this.ui.writeLine(chalk.cyan('  Available blueprints'));
            this.ui.writeLine(blueprints.map(bp => bp.printBasicHelp(false)).join(os.EOL));
        };
        return EmberGenerateCommand.prototype.beforeRun.apply(this, arguments);
    }
});
function mapBlueprintName(name) {
    let mappedName = aliasMap[name];
    return mappedName ? mappedName : name;
}
const aliasMap = {
    'cl': 'class',
    'c': 'component',
    'd': 'directive',
    'e': 'enum',
    'g': 'guard',
    'i': 'interface',
    'm': 'module',
    'p': 'pipe',
    'r': 'route',
    's': 'service'
};
exports.default = GenerateCommand;
GenerateCommand.overrideCore = true;
//# sourceMappingURL=/users/hansl/sources/angular-cli/commands/generate.js.map