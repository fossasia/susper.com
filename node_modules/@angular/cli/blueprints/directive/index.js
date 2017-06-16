"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const path = require("path");
const common_tags_1 = require("common-tags");
const ast_tools_1 = require("../../lib/ast-tools");
const config_1 = require("../../models/config");
const app_utils_1 = require("../../utilities/app-utils");
const resolve_module_file_1 = require("../../utilities/resolve-module-file");
const dynamic_path_parser_1 = require("../../utilities/dynamic-path-parser");
const stringUtils = require('ember-cli-string-utils');
const astUtils = require('../../utilities/ast-utils');
const findParentModule = require('../../utilities/find-parent-module').default;
const Blueprint = require('../../ember-cli/lib/models/blueprint');
const getFiles = Blueprint.prototype.files;
exports.default = Blueprint.extend({
    name: 'directive',
    description: '',
    aliases: ['d'],
    availableOptions: [
        {
            name: 'flat',
            type: Boolean,
            description: 'Flag to indicate if a dir is created.'
        },
        {
            name: 'prefix',
            type: String,
            default: null,
            description: 'Specifies whether to use the prefix.'
        },
        {
            name: 'spec',
            type: Boolean,
            description: 'Specifies if a spec file is generated.'
        },
        {
            name: 'skip-import',
            type: Boolean,
            default: false,
            description: 'Allows for skipping the module import.'
        },
        {
            name: 'module',
            type: String, aliases: ['m'],
            description: 'Allows specification of the declaring module.'
        },
        {
            name: 'export',
            type: Boolean,
            default: false,
            description: 'Specifies if declaring module exports the component.'
        },
        {
            name: 'app',
            type: String,
            aliases: ['a'],
            description: 'Specifies app name to use.'
        }
    ],
    beforeInstall: function (options) {
        const appConfig = app_utils_1.getAppFromConfig(this.options.app);
        if (options.module) {
            this.pathToModule =
                resolve_module_file_1.resolveModulePath(options.module, this.project, this.project.root, appConfig);
        }
        else {
            try {
                this.pathToModule = findParentModule(this.project.root, appConfig.root, this.generatePath);
            }
            catch (e) {
                if (!options.skipImport) {
                    throw `Error locating module for declaration\n\t${e}`;
                }
            }
        }
    },
    normalizeEntityName: function (entityName) {
        const appConfig = app_utils_1.getAppFromConfig(this.options.app);
        const dynamicPathOptions = {
            project: this.project,
            entityName,
            appConfig,
            dryRun: this.options.dryRun
        };
        const parsedPath = dynamic_path_parser_1.dynamicPathParser(dynamicPathOptions);
        this.dynamicPath = parsedPath;
        const defaultPrefix = (appConfig && appConfig.prefix) || '';
        let prefix = (this.options.prefix === 'false' || this.options.prefix === '')
            ? '' : (this.options.prefix || defaultPrefix);
        prefix = prefix && `${prefix}-`;
        this.selector = stringUtils.camelize(prefix + parsedPath.name);
        return parsedPath.name;
    },
    locals: function (options) {
        options.spec = options.spec !== undefined ?
            options.spec : config_1.CliConfig.getValue('defaults.directive.spec');
        options.flat = options.flat !== undefined ?
            options.flat : config_1.CliConfig.getValue('defaults.directive.flat');
        return {
            dynamicPath: this.dynamicPath.dir,
            flat: options.flat,
            selector: this.selector
        };
    },
    files: function () {
        let fileList = getFiles.call(this);
        if (this.options && !this.options.spec) {
            fileList = fileList.filter(p => p.indexOf('__name__.directive.spec.ts') < 0);
        }
        return fileList;
    },
    fileMapTokens: function (options) {
        // Return custom template variables here.
        return {
            __path__: () => {
                let dir = this.dynamicPath.dir;
                if (!options.locals.flat) {
                    dir += path.sep + options.dasherizedModuleName;
                }
                this.generatePath = dir;
                return dir;
            }
        };
    },
    afterInstall: function (options) {
        const appConfig = app_utils_1.getAppFromConfig(this.options.app);
        if (options.prefix && appConfig.prefix && appConfig.prefix !== options.prefix) {
            console.log(chalk.yellow(common_tags_1.oneLine `You are using different prefix from app,
       you might get lint errors. Please update "tslint.json" accordingly.`));
        }
        const returns = [];
        const className = stringUtils.classify(`${options.entity.name}Directive`);
        const fileName = stringUtils.dasherize(`${options.entity.name}.directive`);
        const fullGeneratePath = path.join(this.project.root, this.generatePath);
        const moduleDir = path.parse(this.pathToModule).dir;
        const relativeDir = path.relative(moduleDir, fullGeneratePath);
        const normalizeRelativeDir = relativeDir.startsWith('.') ? relativeDir : `./${relativeDir}`;
        const importPath = relativeDir ? `${normalizeRelativeDir}/${fileName}` : `./${fileName}`;
        if (!options.skipImport) {
            if (options.dryRun) {
                this._writeStatusToUI(chalk.yellow, 'update', path.relative(this.project.root, this.pathToModule));
                return;
            }
            returns.push(astUtils.addDeclarationToModule(this.pathToModule, className, importPath)
                .then((change) => change.apply(ast_tools_1.NodeHost))
                .then((result) => {
                if (options.export) {
                    return astUtils.addExportToModule(this.pathToModule, className, importPath)
                        .then((change) => change.apply(ast_tools_1.NodeHost));
                }
                return result;
            }));
            this._writeStatusToUI(chalk.yellow, 'update', path.relative(this.project.root, this.pathToModule));
            this.addModifiedFile(this.pathToModule);
        }
        return Promise.all(returns);
    }
});
//# sourceMappingURL=/users/hans/sources/angular-cli/blueprints/directive/index.js.map