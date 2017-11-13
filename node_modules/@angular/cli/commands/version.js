"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command = require('../ember-cli/lib/models/command');
const common_tags_1 = require("common-tags");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const chalk_1 = require("chalk");
const config_1 = require("../models/config");
const VersionCommand = Command.extend({
    name: 'version',
    description: 'Outputs Angular CLI version.',
    aliases: ['v', '--version', '-v'],
    works: 'everywhere',
    availableOptions: [],
    run: function (_options) {
        let versions = {};
        let angular = {};
        let angularCoreVersion = '';
        let angularSameAsCore = [];
        const pkg = require(path.resolve(__dirname, '..', 'package.json'));
        let projPkg;
        try {
            projPkg = require(path.resolve(this.project.root, 'package.json'));
        }
        catch (exception) {
            projPkg = undefined;
        }
        const roots = ['@angular-devkit/', '@ngtools/', '@schematics/', 'typescript', 'webpack'];
        let ngCliVersion = pkg.version;
        if (!__dirname.match(/node_modules/)) {
            let gitBranch = '??';
            try {
                const gitRefName = '' + child_process.execSync('git symbolic-ref HEAD', { cwd: __dirname });
                gitBranch = path.basename(gitRefName.replace('\n', ''));
            }
            catch (e) {
            }
            ngCliVersion = `local (v${pkg.version}, branch: ${gitBranch})`;
        }
        const config = config_1.CliConfig.fromProject();
        if (config && config.config && config.config.project) {
            if (config.config.project.ejected) {
                ngCliVersion += ' (e)';
            }
        }
        if (projPkg) {
            roots.forEach(root => {
                versions = Object.assign(versions, this.getDependencyVersions(projPkg, root));
            });
            angular = this.getDependencyVersions(projPkg, '@angular/');
            // Filter all angular versions that are the same as core.
            angularCoreVersion = angular['@angular/core'];
            if (angularCoreVersion) {
                for (const angularPackage of Object.keys(angular)) {
                    if (angular[angularPackage] == angularCoreVersion) {
                        angularSameAsCore.push(angularPackage.replace(/^@angular\//, ''));
                        delete angular[angularPackage];
                    }
                }
            }
        }
        const asciiArt = `
    _                      _                 ____ _     ___
   / \\   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
  / △ \\ | '_ \\ / _\` | | | | |/ _\` | '__|   | |   | |    | |
 / ___ \\| | | | (_| | |_| | | (_| | |      | |___| |___ | |
/_/   \\_\\_| |_|\\__, |\\__,_|_|\\__,_|_|       \\____|_____|___|
               |___/
    `;
        this.ui.writeLine(common_tags_1.stripIndents `
    ${chalk_1.default.red(asciiArt)}
    Angular CLI: ${ngCliVersion}
    Node: ${process.versions.node}
    OS: ${process.platform} ${process.arch}
    Angular: ${angularCoreVersion}
    ... ${angularSameAsCore.sort().reduce((acc, name) => {
            // Perform a simple word wrap around 60.
            if (acc.length == 0) {
                return [name];
            }
            const line = (acc[acc.length - 1] + ', ' + name);
            if (line.length > 60) {
                acc.push(name);
            }
            else {
                acc[acc.length - 1] = line;
            }
            return acc;
        }, []).join('\n... ')}

    ${Object.keys(angular).map(module => module + ': ' + angular[module]).sort().join('\n')}
    ${Object.keys(versions).map(module => module + ': ' + versions[module]).sort().join('\n')}
    `);
    },
    getDependencyVersions: function (pkg, prefix) {
        const modules = {};
        const deps = Object.keys(pkg['dependencies'] || {})
            .concat(Object.keys(pkg['devDependencies'] || {}))
            .filter(depName => depName && depName.startsWith(prefix));
        if (prefix[0] == '@') {
            try {
                fs.readdirSync(path.resolve(this.project.root, 'node_modules', prefix))
                    .map(name => prefix + name)
                    .forEach(name => deps.push(name));
            }
            catch (_) { }
        }
        else {
            modules[prefix] = this.getVersion(prefix);
        }
        deps.forEach(name => modules[name] = this.getVersion(name));
        return modules;
    },
    getVersion: function (moduleName) {
        try {
            const modulePkg = require(path.resolve(this.project.root, 'node_modules', moduleName, 'package.json'));
            return modulePkg.version;
        }
        catch (e) {
            return 'error';
        }
    }
});
VersionCommand.overrideCore = true;
exports.default = VersionCommand;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/commands/version.js.map