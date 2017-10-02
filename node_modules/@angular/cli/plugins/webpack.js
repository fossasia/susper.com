"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Exports the webpack plugins we use internally.
var base_href_webpack_plugin_1 = require("../lib/base-href-webpack/base-href-webpack-plugin");
exports.BaseHrefWebpackPlugin = base_href_webpack_plugin_1.BaseHrefWebpackPlugin;
var glob_copy_webpack_plugin_1 = require("./glob-copy-webpack-plugin");
exports.GlobCopyWebpackPlugin = glob_copy_webpack_plugin_1.GlobCopyWebpackPlugin;
var insert_concat_assets_webpack_plugin_1 = require("./insert-concat-assets-webpack-plugin");
exports.InsertConcatAssetsWebpackPlugin = insert_concat_assets_webpack_plugin_1.InsertConcatAssetsWebpackPlugin;
var named_lazy_chunks_webpack_plugin_1 = require("./named-lazy-chunks-webpack-plugin");
exports.NamedLazyChunksWebpackPlugin = named_lazy_chunks_webpack_plugin_1.NamedLazyChunksWebpackPlugin;
var suppress_entry_chunks_webpack_plugin_1 = require("./suppress-entry-chunks-webpack-plugin");
exports.SuppressExtractedTextChunksWebpackPlugin = suppress_entry_chunks_webpack_plugin_1.SuppressExtractedTextChunksWebpackPlugin;
//# sourceMappingURL=/users/hansl/sources/angular-cli/plugins/webpack.js.map