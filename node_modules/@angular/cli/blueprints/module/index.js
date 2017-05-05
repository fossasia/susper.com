"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../models/config");
const app_utils_1 = require("../../utilities/app-utils");
const dynamic_path_parser_1 = require("../../utilities/dynamic-path-parser");
const path = require('path');
const Blueprint = require('../../ember-cli/lib/models/blueprint');
const getFiles = Blueprint.prototype.files;
exports.default = Blueprint.extend({
    description: '',
    aliases: ['m'],
    availableOptions: [
        {
            name: 'spec',
            type: Boolean,
            description: 'Specifies if a spec file is generated.'
        },
        {
            name: 'flat',
            type: Boolean,
            description: 'Flag to indicate if a dir is created.'
        },
        {
            name: 'routing',
            type: Boolean,
            default: false,
            description: 'Specifies if a routing module file should be generated.'
        },
        {
            name: 'app',
            type: String,
            aliases: ['a'],
            description: 'Specifies app name to use.'
        }
    ],
    normalizeEntityName: function (entityName) {
        this.entityName = entityName;
        const appConfig = app_utils_1.getAppFromConfig(this.options.app);
        const parsedPath = dynamic_path_parser_1.dynamicPathParser(this.project, entityName, appConfig);
        this.dynamicPath = parsedPath;
        return parsedPath.name;
    },
    locals: function (options) {
        options.flat = options.flat !== undefined ?
            options.flat : config_1.CliConfig.getValue('defaults.module.flat');
        options.spec = options.spec !== undefined ?
            options.spec : config_1.CliConfig.getValue('defaults.module.spec');
        return {
            dynamicPath: this.dynamicPath.dir,
            flat: options.flat,
            spec: options.spec,
            routing: options.routing
        };
    },
    files: function () {
        let fileList = getFiles.call(this);
        if (!this.options || !this.options.spec) {
            fileList = fileList.filter(p => p.indexOf('__name__.module.spec.ts') < 0);
        }
        if (this.options && !this.options.routing) {
            fileList = fileList.filter(p => p.indexOf('__name__-routing.module.ts') < 0);
        }
        return fileList;
    },
    fileMapTokens: function (options) {
        // Return custom template variables here.
        this.dasherizedModuleName = options.dasherizedModuleName;
        return {
            __path__: () => {
                this.generatePath = this.dynamicPath.dir;
                if (!options.locals.flat) {
                    this.generatePath += path.sep + options.dasherizedModuleName;
                }
                return this.generatePath;
            }
        };
    }
});
//# sourceMappingURL=/users/hans/sources/angular-cli/blueprints/module/index.js.map