"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var config_1 = require('./config/config');
var common_tags_1 = require('common-tags');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
exports.CLI_CONFIG_FILE_NAME = 'angular-cli.json';
function _findUp(name, from) {
    var currentDir = from;
    while (currentDir && currentDir !== path.parse(currentDir).root) {
        var p = path.join(currentDir, name);
        if (fs.existsSync(p)) {
            return p;
        }
        currentDir = path.dirname(currentDir);
    }
    return null;
}
function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
var CliConfig = (function (_super) {
    __extends(CliConfig, _super);
    function CliConfig() {
        _super.apply(this, arguments);
    }
    CliConfig.configFilePath = function (projectPath) {
        // Find the configuration, either where specified, in the angular-cli project
        // (if it's in node_modules) or from the current process.
        return (projectPath && _findUp(exports.CLI_CONFIG_FILE_NAME, projectPath))
            || _findUp(exports.CLI_CONFIG_FILE_NAME, process.cwd())
            || _findUp(exports.CLI_CONFIG_FILE_NAME, __dirname);
    };
    CliConfig.fromProject = function () {
        var configPath = this.configFilePath();
        var globalConfigPath = path.join(getUserHome(), exports.CLI_CONFIG_FILE_NAME);
        if (!configPath) {
            return config_1.CliConfig.fromJson({});
        }
        var cliConfig = config_1.CliConfig.fromConfigPath(CliConfig.configFilePath(), [globalConfigPath]);
        var aliases = [
            cliConfig.alias('apps.0.root', 'defaults.sourceDir'),
            cliConfig.alias('apps.0.prefix', 'defaults.prefix')
        ];
        // If any of them returned true, output a deprecation warning.
        if (aliases.some(function (x) { return !!x; })) {
            console.error(chalk.yellow((_a = ["\n        The \"defaults.prefix\" and \"defaults.sourceDir\" properties of angular-cli.json\n        are deprecated in favor of \"apps[0].root\" and \"apps[0].prefix\".\n\n        Please update in order to avoid errors in future versions of angular-cli.\n      "], _a.raw = ["\n        The \"defaults.prefix\" and \"defaults.sourceDir\" properties of angular-cli.json\n        are deprecated in favor of \"apps[0].root\" and \"apps[0].prefix\".\\n\n        Please update in order to avoid errors in future versions of angular-cli.\n      "], common_tags_1.oneLine(_a))));
        }
        return cliConfig;
        var _a;
    };
    return CliConfig;
}(config_1.CliConfig));
exports.CliConfig = CliConfig;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/models/config.js.map