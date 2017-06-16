"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_utils_1 = require("../../utilities/app-utils");
const dynamic_path_parser_1 = require("../../utilities/dynamic-path-parser");
const config_1 = require("../../models/config");
const stringUtils = require('ember-cli-string-utils');
const Blueprint = require('../../ember-cli/lib/models/blueprint');
const getFiles = Blueprint.prototype.files;
exports.default = Blueprint.extend({
    name: 'class',
    description: '',
    aliases: ['cl'],
    availableOptions: [
        {
            name: 'spec',
            type: Boolean,
            description: 'Specifies if a spec file is generated.'
        },
        {
            name: 'app',
            type: String,
            aliases: ['a'],
            description: 'Specifies app name to use.'
        }
    ],
    normalizeEntityName: function (entityName) {
        const appConfig = app_utils_1.getAppFromConfig(this.options.app);
        const dynamicPathOptions = {
            project: this.project,
            entityName: entityName.split('.')[0],
            appConfig,
            dryRun: this.options.dryRun
        };
        const parsedPath = dynamic_path_parser_1.dynamicPathParser(dynamicPathOptions);
        this.dynamicPath = parsedPath;
        return parsedPath.name;
    },
    locals: function (options) {
        const rawName = options.args[1];
        const nameParts = rawName.split('.')
            .filter(part => part.length !== 0);
        const classType = nameParts[1];
        this.fileName = stringUtils.dasherize(options.entity.name);
        if (classType) {
            this.fileName += '.' + classType.toLowerCase();
        }
        options.spec = options.spec !== undefined ?
            options.spec : config_1.CliConfig.getValue('defaults.class.spec');
        return {
            dynamicPath: this.dynamicPath.dir,
            flat: options.flat,
            fileName: this.fileName
        };
    },
    files: function () {
        let fileList = getFiles.call(this);
        if (this.options && !this.options.spec) {
            fileList = fileList.filter(p => p.indexOf('__name__.spec.ts') < 0);
        }
        return fileList;
    },
    fileMapTokens: function () {
        // Return custom template variables here.
        return {
            __path__: () => {
                this.generatePath = this.dynamicPath.dir;
                return this.generatePath;
            },
            __name__: () => {
                return this.fileName;
            }
        };
    }
});
//# sourceMappingURL=/users/hans/sources/angular-cli/blueprints/class/index.js.map