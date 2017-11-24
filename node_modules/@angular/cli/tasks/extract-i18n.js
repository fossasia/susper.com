"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const webpack = require("webpack");
const webpack_1 = require("@ngtools/webpack");
const webpack_xi18n_config_1 = require("../models/webpack-xi18n-config");
const app_utils_1 = require("../utilities/app-utils");
const webpack_configs_1 = require("../models/webpack-configs");
const stats_1 = require("../utilities/stats");
const Task = require('../ember-cli/lib/models/task');
const MemoryFS = require('memory-fs');
exports.Extracti18nTask = Task.extend({
    run: function (runTaskOptions) {
        const appConfig = app_utils_1.getAppFromConfig(runTaskOptions.app);
        const useExperimentalAngularCompiler = webpack_1.AngularCompilerPlugin.isSupported();
        // We need to determine the outFile name so that AngularCompiler can retrieve it.
        let outFile = runTaskOptions.outFile || getI18nOutfile(runTaskOptions.i18nFormat);
        if (useExperimentalAngularCompiler && runTaskOptions.outputPath) {
            // AngularCompilerPlugin doesn't support genDir so we have to adjust outFile instead.
            outFile = path_1.join(runTaskOptions.outputPath, outFile);
        }
        const config = new webpack_xi18n_config_1.XI18nWebpackConfig({
            genDir: runTaskOptions.outputPath || appConfig.root,
            buildDir: '.tmp',
            i18nFormat: runTaskOptions.i18nFormat,
            locale: runTaskOptions.locale,
            outFile: outFile,
            verbose: runTaskOptions.verbose,
            progress: runTaskOptions.progress,
            app: runTaskOptions.app,
            aot: useExperimentalAngularCompiler,
        }, appConfig).buildConfig();
        const webpackCompiler = webpack(config);
        webpackCompiler.outputFileSystem = new MemoryFS();
        const statsConfig = webpack_configs_1.getWebpackStatsConfig(runTaskOptions.verbose);
        return new Promise((resolve, reject) => {
            const callback = (err, stats) => {
                if (err) {
                    return reject(err);
                }
                const json = stats.toJson('verbose');
                if (stats.hasWarnings()) {
                    this.ui.writeLine(stats_1.statsWarningsToString(json, statsConfig));
                }
                if (stats.hasErrors()) {
                    reject(stats_1.statsErrorsToString(json, statsConfig));
                }
                else {
                    resolve();
                }
            };
            webpackCompiler.run(callback);
        });
    }
});
function getI18nOutfile(format) {
    switch (format) {
        case 'xmb':
            return 'messages.xmb';
        case 'xlf':
        case 'xlif':
        case 'xliff':
        case 'xlf2':
        case 'xliff2':
            return 'messages.xlf';
        default:
            throw new Error(`Unsupported format "${format}"`);
    }
}
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/tasks/extract-i18n.js.map