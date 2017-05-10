"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const path = require("path");
const rimraf = require("rimraf");
const Task = require('../ember-cli/lib/models/task');
const webpack_xi18n_config_1 = require("../models/webpack-xi18n-config");
const app_utils_1 = require("../utilities/app-utils");
exports.Extracti18nTask = Task.extend({
    run: function (runTaskOptions) {
        const project = this.project;
        const appConfig = app_utils_1.getAppFromConfig(runTaskOptions.app);
        const buildDir = '.tmp';
        const genDir = runTaskOptions.outputPath || appConfig.root;
        const config = new webpack_xi18n_config_1.XI18nWebpackConfig({
            genDir,
            buildDir,
            i18nFormat: runTaskOptions.i18nFormat,
            locale: runTaskOptions.locale,
            outFile: runTaskOptions.outFile,
            verbose: runTaskOptions.verbose,
            progress: runTaskOptions.progress,
            app: runTaskOptions.app,
        }, appConfig).buildConfig();
        const webpackCompiler = webpack(config);
        return new Promise((resolve, reject) => {
            const callback = (err, stats) => {
                if (err) {
                    return reject(err);
                }
                if (stats.hasErrors()) {
                    reject();
                }
                else {
                    resolve();
                }
            };
            webpackCompiler.run(callback);
        })
            .then(() => {
            // Deletes temporary build folder
            rimraf.sync(path.resolve(project.root, buildDir));
        })
            .catch((err) => {
            if (err) {
                this.ui.writeError('\nAn error occured during the i18n extraction:\n'
                    + ((err && err.stack) || err));
            }
        });
    }
});
//# sourceMappingURL=/users/hansl/sources/angular-cli/tasks/extract-i18n.js.map