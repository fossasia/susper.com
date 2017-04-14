"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const path = require("path");
const suppress_entry_chunks_webpack_plugin_1 = require("../../plugins/suppress-entry-chunks-webpack-plugin");
const utils_1 = require("./utils");
const eject_1 = require("../../tasks/eject");
const cssnano = require('cssnano');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('exports-loader')
 * require('style-loader')
 * require('postcss-loader')
 * require('css-loader')
 * require('stylus')
 * require('stylus-loader')
 * require('less')
 * require('less-loader')
 * require('node-sass')
 * require('sass-loader')
 */
function getStylesConfig(wco) {
    const { projectRoot, buildOptions, appConfig } = wco;
    const appRoot = path.resolve(projectRoot, appConfig.root);
    const entryPoints = {};
    const globalStylePaths = [];
    const extraPlugins = [];
    // style-loader does not support sourcemaps without absolute publicPath, so it's
    // better to disable them when not extracting css
    // https://github.com/webpack-contrib/style-loader#recommended-configuration
    const cssSourceMap = buildOptions.extractCss && buildOptions.sourcemaps;
    // Minify/optimize css in production.
    const cssnanoPlugin = cssnano({ safe: true, autoprefixer: false });
    // Convert absolute resource URLs to account for base-href and deploy-url.
    const baseHref = wco.buildOptions.baseHref || '';
    const deployUrl = wco.buildOptions.deployUrl || '';
    const postcssUrlOptions = {
        url: (URL) => {
            // Only convert root relative URLs, which CSS-Loader won't process into require().
            if (!URL.startsWith('/') || URL.startsWith('//')) {
                return URL;
            }
            if (deployUrl.match(/:\/\//)) {
                // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                return `${deployUrl.replace(/\/$/, '')}${URL}`;
            }
            else if (baseHref.match(/:\/\//)) {
                // If baseHref contains a scheme, include it as is.
                return baseHref.replace(/\/$/, '') +
                    `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
            }
            else {
                // Join together base-href, deploy-url and the original URL.
                // Also dedupe multiple slashes into single ones.
                return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
            }
        }
    };
    const urlPlugin = postcssUrl(postcssUrlOptions);
    // We need to save baseHref and deployUrl for the Ejected webpack config to work (we reuse
    //  the function defined above).
    postcssUrlOptions.baseHref = baseHref;
    postcssUrlOptions.deployUrl = deployUrl;
    // Save the original options as arguments for eject.
    urlPlugin[eject_1.postcssArgs] = postcssUrlOptions;
    // PostCSS plugins.
    const postCssPlugins = [autoprefixer(), urlPlugin].concat(buildOptions.target === 'production' ? [cssnanoPlugin] : []);
    // determine hashing format
    const hashFormat = utils_1.getOutputHashFormat(buildOptions.outputHashing);
    // use includePaths from appConfig
    const includePaths = [];
    if (appConfig.stylePreprocessorOptions
        && appConfig.stylePreprocessorOptions.includePaths
        && appConfig.stylePreprocessorOptions.includePaths.length > 0) {
        appConfig.stylePreprocessorOptions.includePaths.forEach((includePath) => includePaths.push(path.resolve(appRoot, includePath)));
    }
    // process global styles
    if (appConfig.styles.length > 0) {
        const globalStyles = utils_1.extraEntryParser(appConfig.styles, appRoot, 'styles');
        // add style entry points
        globalStyles.forEach(style => entryPoints[style.entry]
            ? entryPoints[style.entry].push(style.path)
            : entryPoints[style.entry] = [style.path]);
        // add global css paths
        globalStylePaths.push(...globalStyles.map((style) => style.path));
    }
    // set base rules to derive final rules from
    const baseRules = [
        { test: /\.css$/, loaders: [] },
        { test: /\.scss$|\.sass$/, loaders: ['sass-loader'] },
        { test: /\.less$/, loaders: ['less-loader'] },
        // stylus-loader doesn't support webpack.LoaderOptionsPlugin properly,
        // so we need to add options in its query
        {
            test: /\.styl$/, loaders: [`stylus-loader?${JSON.stringify({
                    sourceMap: cssSourceMap,
                    paths: includePaths
                })}`]
        }
    ];
    const commonLoaders = [
        // css-loader doesn't support webpack.LoaderOptionsPlugin properly,
        // so we need to add options in its query
        `css-loader?${JSON.stringify({ sourceMap: cssSourceMap, importLoaders: 1 })}`,
        'postcss-loader'
    ];
    // load component css as raw strings
    let rules = baseRules.map(({ test, loaders }) => ({
        exclude: globalStylePaths, test, loaders: [
            'exports-loader?module.exports.toString()',
            ...commonLoaders,
            ...loaders
        ]
    }));
    // load global css as css files
    if (globalStylePaths.length > 0) {
        rules.push(...baseRules.map(({ test, loaders }) => {
            const extractTextPlugin = {
                use: [
                    ...commonLoaders,
                    ...loaders
                ],
                fallback: 'style-loader',
                // publicPath needed as a workaround https://github.com/angular/angular-cli/issues/4035
                publicPath: ''
            };
            const ret = {
                include: globalStylePaths, test, loaders: ExtractTextPlugin.extract(extractTextPlugin)
            };
            // Save the original options as arguments for eject.
            ret[eject_1.pluginArgs] = extractTextPlugin;
            return ret;
        }));
    }
    // supress empty .js files in css only entry points
    if (buildOptions.extractCss) {
        extraPlugins.push(new suppress_entry_chunks_webpack_plugin_1.SuppressExtractedTextChunksWebpackPlugin());
    }
    return {
        entry: entryPoints,
        module: { rules },
        plugins: [
            // extract global css from js files into own css file
            new ExtractTextPlugin({
                filename: `[name]${hashFormat.extract}.bundle.css`,
                disable: !buildOptions.extractCss
            }),
            new webpack.LoaderOptionsPlugin({
                sourceMap: cssSourceMap,
                options: {
                    postcss: postCssPlugins,
                    // css-loader, stylus-loader don't support LoaderOptionsPlugin properly
                    // options are in query instead
                    sassLoader: { sourceMap: cssSourceMap, includePaths },
                    // less-loader doesn't support paths
                    lessLoader: { sourceMap: cssSourceMap },
                    // context needed as a workaround https://github.com/jtangelder/sass-loader/issues/285
                    context: projectRoot,
                },
            })
        ].concat(extraPlugins)
    };
}
exports.getStylesConfig = getStylesConfig;
//# sourceMappingURL=/users/hansl/sources/angular-cli/models/webpack-configs/styles.js.map