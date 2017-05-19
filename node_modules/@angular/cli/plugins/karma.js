"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const utils_1 = require("../models/webpack-configs/utils");
const webpack_test_config_1 = require("../models/webpack-test-config");
const karma_webpack_throw_error_1 = require("./karma-webpack-throw-error");
const getAppFromConfig = require('../utilities/app-utils').getAppFromConfig;
function isDirectory(path) {
    try {
        return fs.statSync(path).isDirectory();
    }
    catch (_) {
        return false;
    }
}
// Add files to the Karma files array.
function addKarmaFiles(files, newFiles, prepend = false) {
    const defaults = {
        included: true,
        served: true,
        watched: true
    };
    const processedFiles = newFiles
        .filter(file => glob.sync(file.pattern, { nodir: true }).length != 0)
        .map(file => (Object.assign({}, defaults, file)));
    // It's important to not replace the array, because
    // karma already has a reference to the existing array.
    if (prepend) {
        files.unshift(...processedFiles);
    }
    else {
        files.push(...processedFiles);
    }
}
const init = (config) => {
    const appConfig = getAppFromConfig(config.angularCli.app);
    const appRoot = path.join(config.basePath, appConfig.root);
    const testConfig = Object.assign({
        environment: 'dev',
        codeCoverage: false,
        sourcemaps: true,
        progress: true,
    }, config.angularCli);
    // Add assets. This logic is mimics the one present in GlobCopyWebpackPlugin.
    if (appConfig.assets) {
        config.proxies = config.proxies || {};
        appConfig.assets.forEach((pattern) => {
            // Convert all string patterns to Pattern type.
            pattern = typeof pattern === 'string' ? { glob: pattern } : pattern;
            // Add defaults.
            // Input is always resolved relative to the appRoot.
            pattern.input = path.resolve(appRoot, pattern.input || '');
            pattern.output = pattern.output || '';
            pattern.glob = pattern.glob || '';
            // Build karma file pattern.
            const assetPath = path.join(pattern.input, pattern.glob);
            const filePattern = isDirectory(assetPath) ? assetPath + '/**' : assetPath;
            addKarmaFiles(config.files, [{ pattern: filePattern, included: false }]);
            // The `files` entry serves the file from `/base/{asset.input}/{asset.glob}`.
            // We need to add a URL rewrite that exposes the asset as `/{asset.output}/{asset.glob}`.
            let relativePath, proxyPath;
            if (fs.existsSync(assetPath)) {
                relativePath = path.relative(config.basePath, assetPath);
                proxyPath = path.join(pattern.output, pattern.glob);
            }
            else {
                // For globs (paths that don't exist), proxy pattern.output to pattern.input.
                relativePath = path.relative(config.basePath, pattern.input);
                proxyPath = path.join(pattern.output);
            }
            // Proxy paths must have only forward slashes.
            proxyPath = proxyPath.replace(/\\/g, '/');
            config.proxies['/' + proxyPath] = '/base/' + relativePath;
        });
    }
    // Add webpack config.
    const webpackConfig = new webpack_test_config_1.WebpackTestConfig(testConfig, appConfig).buildConfig();
    const webpackMiddlewareConfig = {
        noInfo: true,
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        },
        watchOptions: {
            poll: testConfig.poll
        }
    };
    // If Karma is being ran in single run mode, throw errors.
    if (config.singleRun) {
        webpackConfig.plugins.push(new karma_webpack_throw_error_1.KarmaWebpackThrowError());
    }
    config.webpack = Object.assign(webpackConfig, config.webpack);
    config.webpackMiddleware = Object.assign(webpackMiddlewareConfig, config.webpackMiddleware);
    // Replace the @angular/cli preprocessor with webpack+sourcemap.
    Object.keys(config.preprocessors)
        .filter((file) => config.preprocessors[file].indexOf('@angular/cli') !== -1)
        .map((file) => config.preprocessors[file])
        .map((arr) => arr.splice(arr.indexOf('@angular/cli'), 1, 'webpack', 'sourcemap'));
    // Add global scripts. This logic mimics the one in webpack-configs/common.
    if (appConfig.scripts && appConfig.scripts.length > 0) {
        const globalScriptPatterns = utils_1.extraEntryParser(appConfig.scripts, appRoot, 'scripts')
            .filter(script => !(script.output || script.lazy))
            .map(script => ({ pattern: path.resolve(appRoot, script.input) }));
        addKarmaFiles(config.files, globalScriptPatterns, true);
    }
    // Add polyfills file before everything else
    if (appConfig.polyfills) {
        const polyfillsFile = path.resolve(appRoot, appConfig.polyfills);
        config.preprocessors[polyfillsFile] = ['webpack', 'sourcemap'];
        addKarmaFiles(config.files, [{ pattern: polyfillsFile }], true);
    }
};
init.$inject = ['config'];
// Dummy preprocessor, just to keep karma from showing a warning.
const preprocessor = () => (content, _file, done) => done(null, content);
preprocessor.$inject = [];
// Also export karma-webpack and karma-sourcemap-loader.
module.exports = Object.assign({
    'framework:@angular/cli': ['factory', init],
    'preprocessor:@angular/cli': ['factory', preprocessor]
}, require('karma-webpack'), require('karma-sourcemap-loader'));
//# sourceMappingURL=/users/hans/sources/angular-cli/plugins/karma.js.map