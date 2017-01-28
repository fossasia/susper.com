"use strict";
/** Forked from https://github.com/webpack/compression-webpack-plugin. */
var async = require('async');
var url = require('url');
var RawSource = require('webpack-sources/lib/RawSource');
var CompressionPlugin = (function () {
    function CompressionPlugin(options) {
        if (options === void 0) { options = {}; }
        this.asset = '[path].gz[query]';
        this.compressionOptions = {};
        this.threshold = 0;
        this.minRatio = 0.8;
        if (options.hasOwnProperty('asset')) {
            this.asset = options.asset;
        }
        var algorithm = options.hasOwnProperty('algorithm') ? options.algorithm : 'gzip';
        var zlib = require('zlib');
        this.compressionOptions = {};
        this.algorithm = zlib[algorithm];
        if (!this.algorithm) {
            throw new Error("Algorithm not found in zlib: \"" + algorithm + "\".");
        }
        this.compressionOptions = {
            level: options.level || 9,
            flush: options.flush,
            chunkSize: options.chunkSize,
            windowBits: options.windowBits,
            memLevel: options.memLevel,
            strategy: options.strategy,
            dictionary: options.dictionary
        };
        if (options.hasOwnProperty('test')) {
            if (Array.isArray(options.test)) {
                this.test = options.test;
            }
            else {
                this.test = [options.test];
            }
        }
        if (options.hasOwnProperty('threshold')) {
            this.threshold = options.threshold;
        }
        if (options.hasOwnProperty('minRatio')) {
            this.minRatio = options.minRatio;
        }
    }
    CompressionPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.plugin('this-compilation', function (compilation) {
            compilation.plugin('optimize-assets', function (assets, callback) {
                async.forEach(Object.keys(assets), function (file, callback) {
                    if (_this.test.every(function (t) { return !t.test(file); })) {
                        return callback();
                    }
                    var asset = assets[file];
                    var content = asset.source();
                    if (!Buffer.isBuffer(content)) {
                        content = new Buffer(content, 'utf-8');
                    }
                    var originalSize = content.length;
                    if (originalSize < _this.threshold) {
                        return callback();
                    }
                    _this.algorithm(content, _this.compressionOptions, function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        if (result.length / originalSize > _this.minRatio) {
                            return callback();
                        }
                        var parse = url.parse(file);
                        var newFile = _this.asset
                            .replace(/\[file]/g, file)
                            .replace(/\[path]/g, parse.pathname)
                            .replace(/\[query]/g, parse.query || '');
                        assets[newFile] = new RawSource(result);
                        callback();
                    });
                }, callback);
            });
        });
    };
    return CompressionPlugin;
}());
exports.CompressionPlugin = CompressionPlugin;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/lib/webpack/compression-plugin.js.map