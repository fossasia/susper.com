"use strict";
/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var resolve = require("resolve");
var error_1 = require("./error");
var utils_1 = require("./utils");
exports.CONFIG_FILENAME = "tslint.json";
exports.DEFAULT_CONFIG = {
    defaultSeverity: "error",
    extends: ["tslint:recommended"],
    jsRules: new Map(),
    rules: new Map(),
    rulesDirectory: [],
};
exports.EMPTY_CONFIG = {
    defaultSeverity: "error",
    extends: [],
    jsRules: new Map(),
    rules: new Map(),
    rulesDirectory: [],
};
var BUILT_IN_CONFIG = /^tslint:(.*)$/;
/**
 * Searches for a TSLint configuration and returns the data from the config.
 * @param configFile A path to a config file, this can be null if the location of a config is not known
 * @param inputFilePath A path containing the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns Load status for a TSLint configuration object
 */
function findConfiguration(configFile, inputFilePath) {
    var configPath = findConfigurationPath(configFile, inputFilePath);
    var loadResult = { path: configPath };
    try {
        loadResult.results = loadConfigurationFromPath(configPath);
        return loadResult;
    }
    catch (error) {
        throw new error_1.FatalError("Failed to load " + configPath + ": " + error.message, error);
    }
}
exports.findConfiguration = findConfiguration;
/**
 * Searches for a TSLint configuration and returns the path to it.
 * Could return undefined if not configuration is found.
 * @param suppliedConfigFilePath A path to an known config file supplied by a user. Pass null here if
 * the location of the config file is not known and you want to search for one.
 * @param inputFilePath A path to the current file being linted. This is the starting location
 * of the search for a configuration.
 * @returns An absolute path to a tslint.json file
 * or undefined if neither can be found.
 */
function findConfigurationPath(suppliedConfigFilePath, inputFilePath) {
    if (suppliedConfigFilePath != null) {
        if (!fs.existsSync(suppliedConfigFilePath)) {
            throw new error_1.FatalError("Could not find config file at: " + path.resolve(suppliedConfigFilePath));
        }
        else {
            return path.resolve(suppliedConfigFilePath);
        }
    }
    else {
        // convert to dir if it's a file or doesn't exist
        var useDirName = false;
        try {
            var stats = fs.statSync(inputFilePath);
            if (stats.isFile()) {
                useDirName = true;
            }
        }
        catch (e) {
            // throws if file doesn't exist
            useDirName = true;
        }
        if (useDirName) {
            inputFilePath = path.dirname(inputFilePath);
        }
        // search for tslint.json from input file location
        var configFilePath = findup(exports.CONFIG_FILENAME, inputFilePath);
        if (configFilePath !== undefined) {
            return path.resolve(configFilePath);
        }
        // search for tslint.json in home directory
        var homeDir = getHomeDir();
        if (homeDir != null) {
            configFilePath = path.join(homeDir, exports.CONFIG_FILENAME);
            if (fs.existsSync(configFilePath)) {
                return path.resolve(configFilePath);
            }
        }
        // no path could be found
        return undefined;
    }
}
exports.findConfigurationPath = findConfigurationPath;
/**
 * Find a file by name in a directory or any ancestory directory.
 * This is case-insensitive, so it can find 'TsLiNt.JsOn' when searching for 'tslint.json'.
 */
function findup(filename, directory) {
    while (true) {
        var res = findFile(directory);
        if (res !== undefined) {
            return path.join(directory, res);
        }
        var parent = path.dirname(directory);
        if (parent === directory) {
            return undefined;
        }
        directory = parent;
    }
    function findFile(cwd) {
        if (fs.existsSync(path.join(cwd, filename))) {
            return filename;
        }
        // TODO: remove in v6.0.0
        // Try reading in the entire directory and looking for a file with different casing.
        var filenameLower = filename.toLowerCase();
        var result = fs.readdirSync(cwd).find(function (entry) { return entry.toLowerCase() === filenameLower; });
        if (result !== undefined) {
            error_1.showWarningOnce("Using mixed case tslint.json is deprecated. Found: " + path.join(cwd, result));
        }
        return result;
    }
}
/**
 * Used Node semantics to load a configuration file given configFilePath.
 * For example:
 * '/path/to/config' will be treated as an absolute path
 * './path/to/config' will be treated as a relative path
 * 'path/to/config' will attempt to load a to/config file inside a node module named path
 * @param configFilePath The configuration to load
 * @param originalFilePath The entry point configuration file
 * @returns a configuration object for TSLint loaded from the file at configFilePath
 */
function loadConfigurationFromPath(configFilePath, originalFilePath) {
    if (originalFilePath === void 0) { originalFilePath = configFilePath; }
    if (configFilePath == null) {
        return exports.DEFAULT_CONFIG;
    }
    else {
        var resolvedConfigFilePath = resolveConfigurationPath(configFilePath);
        var rawConfigFile = void 0;
        if (path.extname(resolvedConfigFilePath) === ".json") {
            var fileContent = utils_1.stripComments(fs.readFileSync(resolvedConfigFilePath)
                .toString()
                .replace(/^\uFEFF/, ""));
            try {
                rawConfigFile = JSON.parse(fileContent);
            }
            catch (e) {
                var error = e;
                // include the configuration file being parsed in the error since it may differ from the directly referenced config
                throw configFilePath === originalFilePath ? error : new Error(error.message + " in " + configFilePath);
            }
        }
        else {
            rawConfigFile = require(resolvedConfigFilePath);
            delete require.cache[resolvedConfigFilePath];
        }
        var configFileDir_1 = path.dirname(resolvedConfigFilePath);
        var configFile = parseConfigFile(rawConfigFile, configFileDir_1);
        // load configurations, in order, using their identifiers or relative paths
        // apply the current configuration last by placing it last in this array
        var configs = configFile.extends.map(function (name) {
            var nextConfigFilePath = resolveConfigurationPath(name, configFileDir_1);
            return loadConfigurationFromPath(nextConfigFilePath, originalFilePath);
        }).concat([configFile]);
        return configs.reduce(extendConfigurationFile, exports.EMPTY_CONFIG);
    }
}
exports.loadConfigurationFromPath = loadConfigurationFromPath;
/**
 * Resolve configuration file path or node_module reference
 * @param filePath Relative ("./path"), absolute ("/path"), node module ("path"), or built-in ("tslint:path")
 */
function resolveConfigurationPath(filePath, relativeTo) {
    var matches = filePath.match(BUILT_IN_CONFIG);
    var isBuiltInConfig = matches != null && matches.length > 0;
    if (isBuiltInConfig) {
        var configName = matches[1];
        try {
            return require.resolve("./configs/" + configName);
        }
        catch (err) {
            throw new Error(filePath + " is not a built-in config, try \"tslint:recommended\" instead.");
        }
    }
    var basedir = relativeTo !== undefined ? relativeTo : process.cwd();
    try {
        return resolve.sync(filePath, { basedir: basedir });
    }
    catch (err) {
        try {
            return require.resolve(filePath);
        }
        catch (err) {
            throw new Error("Invalid \"extends\" configuration value - could not require \"" + filePath + "\". " +
                "Review the Node lookup algorithm (https://nodejs.org/api/modules.html#modules_all_together) " +
                "for the approximate method TSLint uses to find the referenced configuration file.");
        }
    }
}
function extendConfigurationFile(targetConfig, nextConfigSource) {
    function combineProperties(targetProperty, nextProperty) {
        var combinedProperty = {};
        add(targetProperty);
        // next config source overwrites the target config object
        add(nextProperty);
        return combinedProperty;
        function add(property) {
            if (property !== undefined) {
                for (var name in property) {
                    if (utils_1.hasOwnProperty(property, name)) {
                        combinedProperty[name] = property[name];
                    }
                }
            }
        }
    }
    function combineMaps(target, next) {
        var combined = new Map();
        target.forEach(function (options, ruleName) {
            combined.set(ruleName, options);
        });
        next.forEach(function (options, ruleName) {
            var combinedRule = combined.get(ruleName);
            if (combinedRule != null) {
                combined.set(ruleName, combineProperties(combinedRule, options));
            }
            else {
                combined.set(ruleName, options);
            }
        });
        return combined;
    }
    var combinedRulesDirs = targetConfig.rulesDirectory.concat(nextConfigSource.rulesDirectory);
    var dedupedRulesDirs = Array.from(new Set(combinedRulesDirs));
    return {
        extends: [],
        jsRules: combineMaps(targetConfig.jsRules, nextConfigSource.jsRules),
        linterOptions: combineProperties(targetConfig.linterOptions, nextConfigSource.linterOptions),
        rules: combineMaps(targetConfig.rules, nextConfigSource.rules),
        rulesDirectory: dedupedRulesDirs,
    };
}
exports.extendConfigurationFile = extendConfigurationFile;
function getHomeDir() {
    var environment = global.process.env;
    var paths = [
        environment.USERPROFILE,
        environment.HOME,
        environment.HOMEPATH,
        environment.HOMEDRIVE + environment.HOMEPATH,
    ];
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var homePath = paths_1[_i];
        if (homePath != null && fs.existsSync(homePath)) {
            return homePath;
        }
    }
    return undefined;
}
// returns the absolute path (contrary to what the name implies)
function getRelativePath(directory, relativeTo) {
    if (directory != null) {
        var basePath = relativeTo !== undefined ? relativeTo : process.cwd();
        return path.resolve(basePath, directory);
    }
    return undefined;
}
exports.getRelativePath = getRelativePath;
// check if directory should be used as path or if it should be resolved like a module
// matches if directory starts with '/', './', '../', 'node_modules/' or equals '.' or '..'
function useAsPath(directory) {
    return /^(?:\.?\.?(?:\/|$)|node_modules\/)/.test(directory);
}
exports.useAsPath = useAsPath;
/**
 * @param directories A path(s) to a directory of custom rules
 * @param relativeTo A path that directories provided are relative to.
 * For example, if the directories come from a tslint.json file, this path
 * should be the path to the tslint.json file.
 * @return An array of absolute paths to directories potentially containing rules
 */
function getRulesDirectories(directories, relativeTo) {
    return utils_1.arrayify(directories)
        .map(function (dir) {
        if (!useAsPath(dir)) {
            try {
                return path.dirname(resolve.sync(dir, { basedir: relativeTo }));
            }
            catch (err) {
                // swallow error and fallback to using directory as path
            }
        }
        var absolutePath = getRelativePath(dir, relativeTo);
        if (absolutePath != null) {
            if (!fs.existsSync(absolutePath)) {
                throw new error_1.FatalError("Could not find custom rule directory: " + dir);
            }
        }
        return absolutePath;
    })
        .filter(function (dir) { return dir !== undefined; });
}
exports.getRulesDirectories = getRulesDirectories;
/**
 * Parses the options of a single rule and upgrades legacy settings such as `true`, `[true, "option"]`
 *
 * @param ruleConfigValue The raw option setting of a rule
 */
function parseRuleOptions(ruleConfigValue, rawDefaultRuleSeverity) {
    var ruleArguments;
    var defaultRuleSeverity = "error";
    if (rawDefaultRuleSeverity !== undefined) {
        switch (rawDefaultRuleSeverity.toLowerCase()) {
            case "warn":
            case "warning":
                defaultRuleSeverity = "warning";
                break;
            case "off":
            case "none":
                defaultRuleSeverity = "off";
                break;
            default:
                defaultRuleSeverity = "error";
        }
    }
    var ruleSeverity = defaultRuleSeverity;
    if (ruleConfigValue == null) {
        ruleArguments = [];
        ruleSeverity = "off";
    }
    else if (Array.isArray(ruleConfigValue)) {
        if (ruleConfigValue.length > 0) {
            // old style: array
            ruleArguments = ruleConfigValue.slice(1);
            ruleSeverity = ruleConfigValue[0] === true ? defaultRuleSeverity : "off";
        }
    }
    else if (typeof ruleConfigValue === "boolean") {
        // old style: boolean
        ruleArguments = [];
        ruleSeverity = ruleConfigValue ? defaultRuleSeverity : "off";
    }
    else if (typeof ruleConfigValue === "object") {
        if (ruleConfigValue.severity !== undefined) {
            switch (ruleConfigValue.severity.toLowerCase()) {
                case "default":
                    ruleSeverity = defaultRuleSeverity;
                    break;
                case "error":
                    ruleSeverity = "error";
                    break;
                case "warn":
                case "warning":
                    ruleSeverity = "warning";
                    break;
                case "off":
                case "none":
                    ruleSeverity = "off";
                    break;
                default:
                    console.warn("Invalid severity level: " + ruleConfigValue.severity);
                    ruleSeverity = defaultRuleSeverity;
            }
        }
        if (ruleConfigValue.options != null) {
            ruleArguments = utils_1.arrayify(ruleConfigValue.options);
        }
    }
    return {
        ruleArguments: ruleArguments,
        ruleSeverity: ruleSeverity,
    };
}
/**
 * Parses a config file and normalizes legacy config settings
 *
 * @param configFile The raw object read from the JSON of a config file
 * @param configFileDir The directory of the config file
 */
function parseConfigFile(configFile, configFileDir) {
    return {
        extends: utils_1.arrayify(configFile.extends),
        jsRules: parseRules(configFile.jsRules),
        linterOptions: configFile.linterOptions !== undefined ? configFile.linterOptions : {},
        rules: parseRules(configFile.rules),
        rulesDirectory: getRulesDirectories(configFile.rulesDirectory, configFileDir),
    };
    function parseRules(config) {
        var map = new Map();
        if (config !== undefined) {
            for (var ruleName in config) {
                if (utils_1.hasOwnProperty(config, ruleName)) {
                    map.set(ruleName, parseRuleOptions(config[ruleName], configFile.defaultSeverity));
                }
            }
        }
        return map;
    }
}
exports.parseConfigFile = parseConfigFile;
/**
 * Fills in default values for `IOption` properties and outputs an array of `IOption`
 */
function convertRuleOptions(ruleConfiguration) {
    var output = [];
    ruleConfiguration.forEach(function (_a, ruleName) {
        var ruleArguments = _a.ruleArguments, ruleSeverity = _a.ruleSeverity;
        var options = {
            disabledIntervals: [],
            ruleArguments: ruleArguments != null ? ruleArguments : [],
            ruleName: ruleName,
            ruleSeverity: ruleSeverity != null ? ruleSeverity : "error",
        };
        output.push(options);
    });
    return output;
}
exports.convertRuleOptions = convertRuleOptions;
