"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const config_1 = require("../config");
const karma_webpack_emitless_error_1 = require("../../plugins/karma-webpack-emitless-error");
/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('istanbul-instrumenter-loader')
 *
 */
function getTestConfig(testConfig) {
    const configPath = config_1.CliConfig.configFilePath();
    const projectRoot = path.dirname(configPath);
    const appConfig = config_1.CliConfig.fromProject().config.apps[0];
    const extraRules = [];
    if (testConfig.codeCoverage && config_1.CliConfig.fromProject()) {
        const codeCoverageExclude = config_1.CliConfig.fromProject().get('test.codeCoverage.exclude');
        let exclude = [
            /\.(e2e|spec)\.ts$/,
            /node_modules/
        ];
        if (codeCoverageExclude) {
            codeCoverageExclude.forEach((excludeGlob) => {
                const excludeFiles = glob
                    .sync(path.join(projectRoot, excludeGlob), { nodir: true })
                    .map(file => path.normalize(file));
                exclude.push(...excludeFiles);
            });
        }
        extraRules.push({
            test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
            enforce: 'post',
            exclude
        });
    }
    return {
        devtool: testConfig.sourcemaps ? 'inline-source-map' : 'eval',
        entry: {
            test: path.resolve(projectRoot, appConfig.root, appConfig.test)
        },
        module: {
            rules: [].concat(extraRules)
        },
        plugins: [
            new webpack.SourceMapDevToolPlugin({
                filename: null,
                test: /\.(ts|js)($|\?)/i // process .js and .ts files only
            }),
            new karma_webpack_emitless_error_1.KarmaWebpackEmitlessError()
        ]
    };
}
exports.getTestConfig = getTestConfig;
//# sourceMappingURL=/users/hans/sources/angular-cli/models/webpack-configs/test.js.map