"use strict";
// TODO: remove this commented AJV require.
// We don't actually require AJV, but there is a bug with NPM and peer dependencies that is
// whose workaround is to depend on AJV.
// See https://github.com/angular/angular-cli/issues/9691#issuecomment-367322703 for details.
// We need to add a require here to satisfy the dependency checker.
// require('ajv');
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cli = require('../../ember-cli/lib/cli');
const UI = require('../../ember-cli/lib/ui');
function loadCommands() {
    return {
        'build': require('../../commands/build').default,
        'serve': require('../../commands/serve').default,
        'eject': require('../../commands/eject').default,
        'new': require('../../commands/new').default,
        'generate': require('../../commands/generate').default,
        'destroy': require('../../commands/destroy').default,
        'test': require('../../commands/test').default,
        'e2e': require('../../commands/e2e').default,
        'help': require('../../commands/help').default,
        'lint': require('../../commands/lint').default,
        'version': require('../../commands/version').default,
        'completion': require('../../commands/completion').default,
        'doc': require('../../commands/doc').default,
        'xi18n': require('../../commands/xi18n').default,
        'update': require('../../commands/update').default,
        // Easter eggs.
        'make-this-awesome': require('../../commands/easter-egg').default,
        // Configuration.
        'set': require('../../commands/set').default,
        'get': require('../../commands/get').default
    };
}
function default_1(options) {
    // patch UI to not print Ember-CLI warnings (which don't apply to Angular CLI)
    UI.prototype.writeWarnLine = function () { };
    options.cli = {
        name: 'ng',
        root: path.join(__dirname, '..', '..'),
        npmPackage: '@angular/cli'
    };
    options.commands = loadCommands();
    // ensure the environemnt variable for dynamic paths
    process.env.PWD = path.normalize(process.env.PWD || process.cwd());
    process.env.CLI_ROOT = process.env.CLI_ROOT || path.resolve(__dirname, '..', '..');
    return cli(options);
}
exports.default = default_1;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/lib/cli/index.js.map