"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// We only use typescript for type information here.
// @ignoreDep typescript
const chalk_1 = require("chalk");
const fs = require("fs");
const glob = require("glob");
const minimatch_1 = require("minimatch");
const path = require("path");
const semver_1 = require("semver");
const require_project_module_1 = require("../utilities/require-project-module");
const strip_bom_1 = require("../utilities/strip-bom");
const SilentError = require('silent-error');
const Task = require('../ember-cli/lib/models/task');
class LintTaskOptions {
    constructor() {
        this.format = 'prose';
        this.silent = false;
        this.typeCheck = false;
    }
}
exports.LintTaskOptions = LintTaskOptions;
exports.default = Task.extend({
    run: function (options) {
        options = Object.assign({}, new LintTaskOptions(), options);
        const ui = this.ui;
        const projectRoot = this.project.root;
        const lintConfigs = options.configs || [];
        if (lintConfigs.length === 0) {
            if (!options.silent) {
                ui.writeLine(chalk_1.default.yellow('No lint configuration(s) found.'));
            }
            return Promise.resolve(0);
        }
        const projectTslint = require_project_module_1.requireProjectModule(projectRoot, 'tslint');
        const Linter = projectTslint.Linter;
        const Configuration = projectTslint.Configuration;
        const result = lintConfigs
            .map((config) => {
            let program;
            if (config.project) {
                program = Linter.createProgram(config.project);
            }
            else if (options.typeCheck) {
                if (!options.silent) {
                    ui.writeLine(chalk_1.default.yellow('A "project" must be specified to enable type checking.'));
                }
            }
            const files = getFilesToLint(program, config, Linter);
            const lintOptions = {
                fix: options.fix,
                formatter: options.format
            };
            // TSLint < 5.5 has a bug with fix and project used in combination.
            // previous behavior of typeCheck option is maintained for those versions
            if (semver_1.satisfies(Linter.VERSION, '< 5.5') && !options.typeCheck) {
                program = undefined;
            }
            const linter = new Linter(lintOptions, program);
            let lastDirectory;
            let configLoad;
            for (const file of files) {
                const contents = getFileContents(file, config, program);
                // Only check for a new tslint config if path changes
                const currentDirectory = path.dirname(file);
                if (currentDirectory !== lastDirectory) {
                    configLoad = Configuration.findConfiguration(config.tslintConfig, file);
                    lastDirectory = currentDirectory;
                }
                linter.lint(file, contents, configLoad.results);
            }
            return linter.getResult();
        })
            .reduce((total, current) => {
            const failures = current.failures
                .filter(cf => !total.failures.some(ef => ef.equals(cf)));
            total.failures = total.failures.concat(...failures);
            if (current.fixes) {
                total.fixes = (total.fixes || []).concat(...current.fixes);
            }
            if (current.errorCount !== undefined) {
                total.errorCount += current.errorCount;
            }
            else {
                // Handle pre-warning/error bifurcation
                total.errorCount += failures.length;
            }
            if (current.warningCount !== undefined) {
                total.warningCount += current.warningCount;
            }
            return total;
        }, {
            failures: [],
            fixes: undefined,
            errorCount: 0,
            warningCount: 0,
        });
        if (!options.silent) {
            const Formatter = projectTslint.findFormatter(options.format);
            if (!Formatter) {
                throw new SilentError(chalk_1.default.red(`Invalid lint format "${options.format}".`));
            }
            const formatter = new Formatter();
            const output = formatter.format(result.failures, result.fixes);
            if (output) {
                ui.writeLine(output);
            }
        }
        // print formatter output directly for non human-readable formats
        if (['prose', 'verbose', 'stylish'].indexOf(options.format) == -1) {
            options.silent = true;
        }
        if (result.warningCount > 0 && !options.silent) {
            ui.writeLine(chalk_1.default.yellow('Lint warnings found in the listed files.'));
        }
        if (result.errorCount > 0 && !options.silent) {
            ui.writeLine(chalk_1.default.red('Lint errors found in the listed files.'));
        }
        if (result.warningCount === 0 && result.errorCount === 0 && !options.silent) {
            ui.writeLine(chalk_1.default.green('All files pass linting.'));
        }
        return options.force || result.errorCount === 0 ? Promise.resolve(0) : Promise.resolve(2);
    }
});
function normalizeArrayOption(option) {
    return Array.isArray(option) ? option : [option];
}
function getFilesToLint(program, lintConfig, linter) {
    const providedFiles = lintConfig.files && normalizeArrayOption(lintConfig.files);
    const ignore = lintConfig.exclude && normalizeArrayOption(lintConfig.exclude);
    if (providedFiles) {
        return providedFiles
            .map(file => glob.sync(file, { ignore, nodir: true }))
            .reduce((prev, curr) => prev.concat(curr), []);
    }
    if (!program) {
        return [];
    }
    let programFiles = linter.getFileNames(program);
    if (ignore && ignore.length > 0) {
        const ignoreMatchers = ignore.map(pattern => new minimatch_1.Minimatch(pattern, { dot: true }));
        programFiles = programFiles
            .filter(file => !ignoreMatchers.some(matcher => matcher.match(file)));
    }
    return programFiles;
}
function getFileContents(file, config, program) {
    // The linter retrieves the SourceFile TS node directly if a program is used
    if (program) {
        if (program.getSourceFile(file) == undefined) {
            const message = `File '${file}' is not part of the TypeScript project '${config.project}'.`;
            throw new SilentError(chalk_1.default.red(message));
        }
        return undefined;
    }
    // NOTE: The tslint CLI checks for and excludes MPEG transport streams; this does not.
    try {
        return strip_bom_1.stripBom(fs.readFileSync(file, 'utf-8'));
    }
    catch (e) {
        throw new SilentError(`Could not read file '${file}'.`);
    }
}
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/tasks/lint.js.map