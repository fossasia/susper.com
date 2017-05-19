"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const common_tags_1 = require("common-tags");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const find_up_1 = require("../utilities/find-up");
exports.CLI_CONFIG_FILE_NAME = '.angular-cli.json';
const CLI_CONFIG_FILE_NAME_ALT = 'angular-cli.json';
function getUserHome() {
    const envHomeName = (process.platform.startsWith('win')) ? 'USERPROFILE' : 'HOME';
    const env = process.env[envHomeName];
    if (env == null) {
        throw new Error('Missing environment variable ' + envHomeName);
    }
    return env;
}
const configCacheMap = new Map();
class CliConfig extends config_1.CliConfig {
    static configFilePath(projectPath) {
        const configNames = [exports.CLI_CONFIG_FILE_NAME, CLI_CONFIG_FILE_NAME_ALT];
        // Find the configuration, either where specified, in the Angular CLI project
        // (if it's in node_modules) or from the current process.
        return (projectPath && find_up_1.findUp(configNames, projectPath))
            || find_up_1.findUp(configNames, process.cwd())
            || find_up_1.findUp(configNames, __dirname);
    }
    static getValue(jsonPath) {
        let value;
        const projectConfig = CliConfig.fromProject();
        if (projectConfig) {
            value = projectConfig.get(jsonPath);
        }
        else {
            const globalConfig = CliConfig.fromGlobal();
            if (globalConfig) {
                value = globalConfig.get(jsonPath);
            }
        }
        return value;
    }
    static globalConfigFilePath() {
        let globalConfigPath = path.join(getUserHome(), exports.CLI_CONFIG_FILE_NAME);
        const altGlobalConfigPath = path.join(getUserHome(), CLI_CONFIG_FILE_NAME_ALT);
        if (!fs.existsSync(globalConfigPath) && fs.existsSync(altGlobalConfigPath)) {
            return altGlobalConfigPath;
        }
        return globalConfigPath;
    }
    static fromGlobal() {
        const globalConfigPath = this.globalConfigFilePath();
        if (configCacheMap.has(globalConfigPath)) {
            return configCacheMap.get(globalConfigPath);
        }
        const cliConfig = config_1.CliConfig.fromConfigPath(globalConfigPath);
        const aliases = [
            cliConfig.alias('apps.0.root', 'defaults.sourceDir'),
            cliConfig.alias('apps.0.prefix', 'defaults.prefix')
        ];
        // Additional aliases which do not emit any messages.
        cliConfig.alias('defaults.interface.prefix', 'defaults.inline.prefixInterfaces');
        cliConfig.alias('defaults.component.inlineStyle', 'defaults.inline.style');
        cliConfig.alias('defaults.component.inlineTemplate', 'defaults.inline.template');
        cliConfig.alias('defaults.component.spec', 'defaults.spec.component');
        cliConfig.alias('defaults.class.spec', 'defaults.spec.class');
        cliConfig.alias('defaults.component.directive', 'defaults.spec.directive');
        cliConfig.alias('defaults.component.module', 'defaults.spec.module');
        cliConfig.alias('defaults.component.pipe', 'defaults.spec.pipe');
        cliConfig.alias('defaults.component.service', 'defaults.spec.service');
        // If any of them returned true, output a deprecation warning.
        if (aliases.some(x => x)) {
            console.error(chalk.yellow(common_tags_1.oneLine `
        The "defaults.prefix" and "defaults.sourceDir" properties of .angular-cli.json
        are deprecated in favor of "apps[0].root" and "apps[0].prefix".\n
        Please update in order to avoid errors in future versions of Angular CLI.
      `));
        }
        configCacheMap.set(globalConfigPath, cliConfig);
        return cliConfig;
    }
    static fromProject(projectPath) {
        const configPath = this.configFilePath(projectPath);
        if (!configPath ||
            (configPath === this.globalConfigFilePath() && process.cwd() !== path.dirname(configPath))) {
            return null;
        }
        if (configCacheMap.has(configPath)) {
            return configCacheMap.get(configPath);
        }
        let globalConfigPath = path.join(getUserHome(), exports.CLI_CONFIG_FILE_NAME);
        const altGlobalConfigPath = path.join(getUserHome(), CLI_CONFIG_FILE_NAME_ALT);
        if (!fs.existsSync(globalConfigPath) && fs.existsSync(altGlobalConfigPath)) {
            globalConfigPath = altGlobalConfigPath;
        }
        const cliConfig = config_1.CliConfig.fromConfigPath(configPath, [globalConfigPath]);
        const aliases = [
            cliConfig.alias('apps.0.root', 'defaults.sourceDir'),
            cliConfig.alias('apps.0.prefix', 'defaults.prefix')
        ];
        // Additional aliases which do not emit any messages.
        cliConfig.alias('defaults.interface.prefix', 'defaults.inline.prefixInterfaces');
        cliConfig.alias('defaults.component.inlineStyle', 'defaults.inline.style');
        cliConfig.alias('defaults.component.inlineTemplate', 'defaults.inline.template');
        cliConfig.alias('defaults.component.spec', 'defaults.spec.component');
        cliConfig.alias('defaults.class.spec', 'defaults.spec.class');
        cliConfig.alias('defaults.component.directive', 'defaults.spec.directive');
        cliConfig.alias('defaults.component.module', 'defaults.spec.module');
        cliConfig.alias('defaults.component.pipe', 'defaults.spec.pipe');
        cliConfig.alias('defaults.component.service', 'defaults.spec.service');
        // If any of them returned true, output a deprecation warning.
        if (aliases.some(x => x)) {
            console.error(chalk.yellow(common_tags_1.oneLine `
        The "defaults.prefix" and "defaults.sourceDir" properties of .angular-cli.json
        are deprecated in favor of "apps[0].root" and "apps[0].prefix".\n
        Please update in order to avoid errors in future versions of Angular CLI.
      `));
        }
        configCacheMap.set(configPath, cliConfig);
        return cliConfig;
    }
}
exports.CliConfig = CliConfig;
//# sourceMappingURL=/users/hans/sources/angular-cli/models/config.js.map