"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const config_1 = require("../config");
/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('istanbul-instrumenter-loader')
 *
 */
function getTestConfig(wco) {
    const { projectRoot, buildOptions, appConfig } = wco;
    const nodeModules = path.resolve(projectRoot, 'node_modules');
    const extraRules = [];
    const extraPlugins = [];
    if (buildOptions.codeCoverage && config_1.CliConfig.fromProject()) {
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
            options: { esModules: true },
            enforce: 'post',
            exclude
        });
    }
    return {
        devtool: buildOptions.sourcemaps ? 'inline-source-map' : 'eval',
        entry: {
            main: path.resolve(projectRoot, appConfig.root, appConfig.test)
        },
        module: {
            rules: [].concat(extraRules)
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                minChunks: Infinity,
                name: 'inline'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                chunks: ['main'],
                minChunks: (module) => module.resource && module.resource.startsWith(nodeModules)
            })
        ].concat(extraPlugins)
    };
}
exports.getTestConfig = getTestConfig;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/models/webpack-configs/test.js.map