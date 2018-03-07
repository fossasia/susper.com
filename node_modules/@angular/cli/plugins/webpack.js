"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Exports the webpack plugins we use internally.
var base_href_webpack_plugin_1 = require("../lib/base-href-webpack/base-href-webpack-plugin");
exports.BaseHrefWebpackPlugin = base_href_webpack_plugin_1.BaseHrefWebpackPlugin;
var cleancss_webpack_plugin_1 = require("./cleancss-webpack-plugin");
exports.CleanCssWebpackPlugin = cleancss_webpack_plugin_1.CleanCssWebpackPlugin;
var glob_copy_webpack_plugin_1 = require("./glob-copy-webpack-plugin");
exports.GlobCopyWebpackPlugin = glob_copy_webpack_plugin_1.GlobCopyWebpackPlugin;
var bundle_budget_1 = require("./bundle-budget");
exports.BundleBudgetPlugin = bundle_budget_1.BundleBudgetPlugin;
var named_lazy_chunks_webpack_plugin_1 = require("./named-lazy-chunks-webpack-plugin");
exports.NamedLazyChunksWebpackPlugin = named_lazy_chunks_webpack_plugin_1.NamedLazyChunksWebpackPlugin;
var scripts_webpack_plugin_1 = require("./scripts-webpack-plugin");
exports.ScriptsWebpackPlugin = scripts_webpack_plugin_1.ScriptsWebpackPlugin;
var suppress_entry_chunks_webpack_plugin_1 = require("./suppress-entry-chunks-webpack-plugin");
exports.SuppressExtractedTextChunksWebpackPlugin = suppress_entry_chunks_webpack_plugin_1.SuppressExtractedTextChunksWebpackPlugin;
var postcss_cli_resources_1 = require("./postcss-cli-resources");
exports.PostcssCliResources = postcss_cli_resources_1.default;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/plugins/webpack.js.map