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
"use strict";
var fs = require("fs");
var path = require("path");
var configuration_1 = require("./configuration");
var utils_1 = require("./utils");
var moduleDirectory = path.dirname(module.filename);
var CORE_RULES_DIRECTORY = path.resolve(moduleDirectory, ".", "rules");
var shownDeprecations = [];
function loadRules(ruleConfiguration, enableDisableRuleMap, rulesDirectories, isJs) {
    var rules = [];
    var notFoundRules = [];
    var notAllowedInJsRules = [];
    for (var ruleName in ruleConfiguration) {
        if (ruleConfiguration.hasOwnProperty(ruleName)) {
            var ruleValue = ruleConfiguration[ruleName];
            var Rule = findRule(ruleName, rulesDirectories);
            if (Rule == null) {
                notFoundRules.push(ruleName);
            }
            else {
                if (isJs && Rule.metadata && Rule.metadata.typescriptOnly != null && Rule.metadata.typescriptOnly) {
                    notAllowedInJsRules.push(ruleName);
                }
                else {
                    var ruleSpecificList = (ruleName in enableDisableRuleMap ? enableDisableRuleMap[ruleName] : []);
                    var disabledIntervals = buildDisabledIntervalsFromSwitches(ruleSpecificList);
                    rules.push(new Rule(ruleName, ruleValue, disabledIntervals));
                    if (Rule.metadata && Rule.metadata.deprecationMessage && shownDeprecations.indexOf(Rule.metadata.ruleName) === -1) {
                        console.warn(Rule.metadata.ruleName + " is deprecated. " + Rule.metadata.deprecationMessage);
                        shownDeprecations.push(Rule.metadata.ruleName);
                    }
                }
            }
        }
    }
    if (notFoundRules.length > 0) {
        var warning = (_a = ["\n            Could not find implementations for the following rules specified in the configuration:\n                ", "\n            Try upgrading TSLint and/or ensuring that you have all necessary custom rules installed.\n            If TSLint was recently upgraded, you may have old rules configured which need to be cleaned up.\n        "], _a.raw = ["\n            Could not find implementations for the following rules specified in the configuration:\n                ", "\n            Try upgrading TSLint and/or ensuring that you have all necessary custom rules installed.\n            If TSLint was recently upgraded, you may have old rules configured which need to be cleaned up.\n        "], utils_1.dedent(_a, notFoundRules.join("\n                ")));
        console.warn(warning);
    }
    if (notAllowedInJsRules.length > 0) {
        var warning = (_b = ["\n            Following rules specified in configuration couldn't be applied to .js or .jsx files:\n                ", "\n            Make sure to exclude them from \"jsRules\" section of your tslint.json.\n        "], _b.raw = ["\n            Following rules specified in configuration couldn't be applied to .js or .jsx files:\n                ", "\n            Make sure to exclude them from \"jsRules\" section of your tslint.json.\n        "], utils_1.dedent(_b, notAllowedInJsRules.join("\n                ")));
        console.warn(warning);
    }
    if (rules.length === 0) {
        console.warn("No valid rules have been specified");
    }
    return rules;
    var _a, _b;
}
exports.loadRules = loadRules;
function findRule(name, rulesDirectories) {
    var camelizedName = transformName(name);
    // first check for core rules
    var Rule = loadRule(CORE_RULES_DIRECTORY, camelizedName);
    if (Rule != null) {
        return Rule;
    }
    var directories = configuration_1.getRulesDirectories(rulesDirectories);
    for (var _i = 0, directories_1 = directories; _i < directories_1.length; _i++) {
        var rulesDirectory = directories_1[_i];
        // then check for rules within the first level of rulesDirectory
        if (rulesDirectory != null) {
            Rule = loadRule(rulesDirectory, camelizedName);
            if (Rule != null) {
                return Rule;
            }
        }
    }
    return undefined;
}
exports.findRule = findRule;
function transformName(name) {
    // camelize strips out leading and trailing underscores and dashes, so make sure they aren't passed to camelize
    // the regex matches the groups (leading underscores and dashes)(other characters)(trailing underscores and dashes)
    var nameMatch = name.match(/^([-_]*)(.*?)([-_]*)$/);
    if (nameMatch == null) {
        return name + "Rule";
    }
    return nameMatch[1] + utils_1.camelize(nameMatch[2]) + nameMatch[3] + "Rule";
}
/**
 * @param directory - An absolute path to a directory of rules
 * @param ruleName - A name of a rule in filename format. ex) "someLintRule"
 */
function loadRule(directory, ruleName) {
    var fullPath = path.join(directory, ruleName);
    if (fs.existsSync(fullPath + ".js")) {
        var ruleModule = require(fullPath);
        if (ruleModule && ruleModule.Rule) {
            return ruleModule.Rule;
        }
    }
    return undefined;
}
/**
 * creates disabled intervals for rule based on list of switchers for it
 * @param ruleSpecificList - contains all switchers for rule states sorted top-down and strictly alternating between enabled and disabled
 */
function buildDisabledIntervalsFromSwitches(ruleSpecificList) {
    var disabledIntervalList = [];
    // starting from second element in the list since first is always enabled in position 0;
    var i = 1;
    while (i < ruleSpecificList.length) {
        var startPosition = ruleSpecificList[i].position;
        // rule enabled state is always alternating therefore we can use position of next switch as end of disabled interval
        // set endPosition as Infinity in case when last switch for rule in a file is disabled
        var endPosition = ruleSpecificList[i + 1] ? ruleSpecificList[i + 1].position : Infinity;
        disabledIntervalList.push({
            endPosition: endPosition,
            startPosition: startPosition,
        });
        i += 2;
    }
    return disabledIntervalList;
}
