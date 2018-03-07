"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const webpack_1 = require("../../plugins/webpack");
const utils_1 = require("./utils");
const eject_1 = require("../../tasks/eject");
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssImports = require('postcss-import');
const PostcssCliResources = require('../../plugins/webpack').PostcssCliResources;
function getStylesConfig(wco) {
    const { projectRoot, buildOptions, appConfig } = wco;
    const appRoot = path.resolve(projectRoot, appConfig.root);
    const entryPoints = {};
    const globalStylePaths = [];
    const extraPlugins = [];
    const cssSourceMap = buildOptions.sourcemaps;
    // Maximum resource size to inline (KiB)
    const maximumInlineSize = 10;
    // Minify/optimize css in production.
    const minimizeCss = buildOptions.target === 'production';
    // determine hashing format
    const hashFormat = utils_1.getOutputHashFormat(buildOptions.outputHashing);
    // Convert absolute resource URLs to account for base-href and deploy-url.
    const baseHref = wco.buildOptions.baseHref || '';
    const deployUrl = wco.buildOptions.deployUrl || '';
    const postcssPluginCreator = function (loader) {
        return [
            postcssImports({
                resolve: (url, context) => {
                    return new Promise((resolve, reject) => {
                        let hadTilde = false;
                        if (url && url.startsWith('~')) {
                            url = url.substr(1);
                            hadTilde = true;
                        }
                        loader.resolve(context, (hadTilde ? '' : './') + url, (err, result) => {
                            if (err) {
                                if (hadTilde) {
                                    reject(err);
                                    return;
                                }
                                loader.resolve(context, url, (err, result) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(result);
                                    }
                                });
                            }
                            else {
                                resolve(result);
                            }
                        });
                    });
                },
                load: (filename) => {
                    return new Promise((resolve, reject) => {
                        loader.fs.readFile(filename, (err, data) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            const content = data.toString();
                            resolve(content);
                        });
                    });
                }
            }),
            postcssUrl({
                filter: ({ url }) => url.startsWith('~'),
                url: ({ url }) => {
                    const fullPath = path.join(projectRoot, 'node_modules', url.substr(1));
                    return path.relative(loader.context, fullPath).replace(/\\/g, '/');
                }
            }),
            postcssUrl([
                {
                    // Only convert root relative URLs, which CSS-Loader won't process into require().
                    filter: ({ url }) => url.startsWith('/') && !url.startsWith('//'),
                    url: ({ url }) => {
                        if (deployUrl.match(/:\/\//) || deployUrl.startsWith('/')) {
                            // If deployUrl is absolute or root relative, ignore baseHref & use deployUrl as is.
                            return `${deployUrl.replace(/\/$/, '')}${url}`;
                        }
                        else if (baseHref.match(/:\/\//)) {
                            // If baseHref contains a scheme, include it as is.
                            return baseHref.replace(/\/$/, '') +
                                `/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
                        }
                        else {
                            // Join together base-href, deploy-url and the original URL.
                            // Also dedupe multiple slashes into single ones.
                            return `/${baseHref}/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
                        }
                    }
                },
                {
                    // TODO: inline .cur if not supporting IE (use browserslist to check)
                    filter: (asset) => {
                        return maximumInlineSize > 0 && !asset.hash && !asset.absolutePath.endsWith('.cur');
                    },
                    url: 'inline',
                    // NOTE: maxSize is in KB
                    maxSize: maximumInlineSize,
                    fallback: 'rebase',
                },
                { url: 'rebase' },
            ]),
            PostcssCliResources({
                deployUrl: loader.loaders[loader.loaderIndex].options.ident == 'extracted' ? '' : deployUrl,
                loader,
                filename: `[name]${hashFormat.file}.[ext]`,
            }),
            autoprefixer({ grid: true }),
        ];
    };
    postcssPluginCreator[eject_1.postcssArgs] = {
        imports: {
            '@angular/cli/plugins/webpack': 'PostcssCliResources',
        },
        variableImports: {
            'autoprefixer': 'autoprefixer',
            'postcss-url': 'postcssUrl',
            'postcss-import': 'postcssImports',
        },
        variables: { hashFormat, baseHref, deployUrl, projectRoot, maximumInlineSize }
    };
    // use includePaths from appConfig
    const includePaths = [];
    let lessPathOptions;
    if (appConfig.stylePreprocessorOptions
        && appConfig.stylePreprocessorOptions.includePaths
        && appConfig.stylePreprocessorOptions.includePaths.length > 0) {
        appConfig.stylePreprocessorOptions.includePaths.forEach((includePath) => includePaths.push(path.resolve(appRoot, includePath)));
        lessPathOptions = {
            paths: includePaths,
        };
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
        { test: /\.css$/, use: [] },
        { test: /\.scss$|\.sass$/, use: [{
                    loader: 'sass-loader',
                    options: {
                        sourceMap: cssSourceMap,
                        // bootstrap-sass requires a minimum precision of 8
                        precision: 8,
                        includePaths
                    }
                }]
        },
        { test: /\.less$/, use: [{
                    loader: 'less-loader',
                    options: Object.assign({ sourceMap: cssSourceMap }, lessPathOptions)
                }]
        },
        {
            test: /\.styl$/, use: [{
                    loader: 'stylus-loader',
                    options: {
                        sourceMap: cssSourceMap,
                        paths: includePaths
                    }
                }]
        }
    ];
    const commonLoaders = [
        { loader: 'raw-loader' },
    ];
    // load component css as raw strings
    const rules = baseRules.map(({ test, use }) => ({
        exclude: globalStylePaths, test, use: [
            ...commonLoaders,
            {
                loader: 'postcss-loader',
                options: {
                    ident: 'embedded',
                    plugins: postcssPluginCreator,
                    sourceMap: cssSourceMap
                }
            },
            ...use
        ]
    }));
    // load global css as css files
    if (globalStylePaths.length > 0) {
        rules.push(...baseRules.map(({ test, use }) => {
            const extractTextPlugin = {
                use: [
                    ...commonLoaders,
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: buildOptions.extractCss ? 'extracted' : 'embedded',
                            plugins: postcssPluginCreator,
                            sourceMap: cssSourceMap
                        }
                    },
                    ...use
                ],
                // publicPath needed as a workaround https://github.com/angular/angular-cli/issues/4035
                publicPath: ''
            };
            const ret = {
                include: globalStylePaths,
                test,
                use: buildOptions.extractCss ? ExtractTextPlugin.extract(extractTextPlugin)
                    : ['style-loader', ...extractTextPlugin.use]
            };
            // Save the original options as arguments for eject.
            if (buildOptions.extractCss) {
                ret[eject_1.pluginArgs] = extractTextPlugin;
            }
            return ret;
        }));
    }
    if (buildOptions.extractCss) {
        // extract global css from js files into own css file
        extraPlugins.push(new ExtractTextPlugin({ filename: `[name]${hashFormat.extract}.bundle.css` }));
        // suppress empty .js files in css only entry points
        extraPlugins.push(new webpack_1.SuppressExtractedTextChunksWebpackPlugin());
    }
    if (minimizeCss) {
        extraPlugins.push(new webpack_1.CleanCssWebpackPlugin({
            sourceMap: cssSourceMap,
            // component styles retain their original file name
            test: (file) => /\.(?:css|scss|sass|less|styl)$/.test(file),
        }));
    }
    return {
        entry: entryPoints,
        module: { rules },
        plugins: [].concat(extraPlugins)
    };
}
exports.getStylesConfig = getStylesConfig;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/models/webpack-configs/styles.js.map