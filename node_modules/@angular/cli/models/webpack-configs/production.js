"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const semver = require("semver");
const common_tags_1 = require("common-tags");
const static_asset_1 = require("../../plugins/static-asset");
const glob_copy_webpack_plugin_1 = require("../../plugins/glob-copy-webpack-plugin");
exports.getProdConfig = function (wco) {
    const { projectRoot, buildOptions, appConfig } = wco;
    let extraPlugins = [];
    let entryPoints = {};
    if (appConfig.serviceWorker) {
        const nodeModules = path.resolve(projectRoot, 'node_modules');
        const swModule = path.resolve(nodeModules, '@angular/service-worker');
        // @angular/service-worker is required to be installed when serviceWorker is true.
        if (!fs.existsSync(swModule)) {
            throw new Error(common_tags_1.stripIndent `
        Your project is configured with serviceWorker = true, but @angular/service-worker
        is not installed. Run \`npm install --save-dev @angular/service-worker\`
        and try again, or run \`ng set apps.0.serviceWorker=false\` in your .angular-cli.json.
      `);
        }
        // Read the version of @angular/service-worker and throw if it doesn't match the
        // expected version.
        const allowedVersion = '>= 1.0.0-beta.5 < 2.0.0';
        const swPackageJson = fs.readFileSync(`${swModule}/package.json`).toString();
        const swVersion = JSON.parse(swPackageJson)['version'];
        if (!semver.satisfies(swVersion, allowedVersion)) {
            throw new Error(common_tags_1.stripIndent `
        The installed version of @angular/service-worker is ${swVersion}. This version of the CLI
        requires the @angular/service-worker version to satisfy ${allowedVersion}. Please upgrade
        your service worker version.
      `);
        }
        // Path to the worker script itself.
        const workerPath = path.resolve(swModule, 'bundles/worker-basic.min.js');
        // Path to a small script to register a service worker.
        const registerPath = path.resolve(swModule, 'build/assets/register-basic.min.js');
        // Sanity check - both of these files should be present in @angular/service-worker.
        if (!fs.existsSync(workerPath) || !fs.existsSync(registerPath)) {
            throw new Error(common_tags_1.stripIndent `
        The installed version of @angular/service-worker isn't supported by the CLI.
        Please install a supported version. The following files should exist:
        - ${registerPath}
        - ${workerPath}
      `);
        }
        extraPlugins.push(new glob_copy_webpack_plugin_1.GlobCopyWebpackPlugin({
            patterns: ['ngsw-manifest.json', 'src/ngsw-manifest.json'],
            globOptions: {
                optional: true,
            },
        }));
        // Load the Webpack plugin for manifest generation and install it.
        const AngularServiceWorkerPlugin = require('@angular/service-worker/build/webpack')
            .AngularServiceWorkerPlugin;
        extraPlugins.push(new AngularServiceWorkerPlugin({
            baseHref: buildOptions.baseHref || '/',
        }));
        // Copy the worker script into assets.
        const workerContents = fs.readFileSync(workerPath).toString();
        extraPlugins.push(new static_asset_1.StaticAssetPlugin('worker-basic.min.js', workerContents));
        // Add a script to index.html that registers the service worker.
        // TODO(alxhub): inline this script somehow.
        entryPoints['sw-register'] = [registerPath];
    }
    return {
        entry: entryPoints,
        plugins: [
            new webpack.EnvironmentPlugin({
                'NODE_ENV': 'production'
            }),
            new webpack.HashedModuleIdsPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                mangle: { screw_ie8: true },
                compress: { screw_ie8: true, warnings: buildOptions.verbose },
                sourceMap: buildOptions.sourcemaps
            })
        ].concat(extraPlugins)
    };
};
//# sourceMappingURL=/users/hansl/sources/angular-cli/models/webpack-configs/production.js.map