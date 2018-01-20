"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_sources_1 = require("webpack-sources");
const loader_utils_1 = require("loader-utils");
const path = require("path");
const Chunk = require('webpack/lib/Chunk');
class ScriptsWebpackPlugin {
    constructor(options = {}) {
        this.options = options;
    }
    shouldSkip(compilation, scripts) {
        if (this._lastBuildTime == undefined) {
            this._lastBuildTime = Date.now();
            return false;
        }
        for (let i = 0; i < scripts.length; i++) {
            const scriptTime = compilation.fileTimestamps[scripts[i]];
            if (!scriptTime || scriptTime > this._lastBuildTime) {
                this._lastBuildTime = Date.now();
                return false;
            }
        }
        return true;
    }
    _insertOutput(compilation, { filename, source }, cached = false) {
        const chunk = new Chunk();
        chunk.rendered = !cached;
        chunk.id = this.options.name;
        chunk.ids = [chunk.id];
        chunk.name = this.options.name;
        chunk.isInitial = () => true;
        chunk.files.push(filename);
        compilation.chunks.push(chunk);
        compilation.assets[filename] = source;
    }
    apply(compiler) {
        if (!this.options.scripts || this.options.scripts.length === 0) {
            return;
        }
        const scripts = this.options.scripts
            .filter(script => !!script)
            .map(script => path.resolve(this.options.basePath || '', script));
        compiler.plugin('this-compilation', (compilation) => {
            compilation.plugin('additional-assets', (callback) => {
                if (this.shouldSkip(compilation, scripts)) {
                    if (this._cachedOutput) {
                        this._insertOutput(compilation, this._cachedOutput, true);
                    }
                    compilation.fileDependencies.push(...scripts);
                    callback();
                    return;
                }
                const sourceGetters = scripts.map(fullPath => {
                    return new Promise((resolve, reject) => {
                        compilation.inputFileSystem.readFile(fullPath, (err, data) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            const content = data.toString();
                            let source;
                            if (this.options.sourceMap) {
                                // TODO: Look for source map file (for '.min' scripts, etc.)
                                let adjustedPath = fullPath;
                                if (this.options.basePath) {
                                    adjustedPath = path.relative(this.options.basePath, fullPath);
                                }
                                source = new webpack_sources_1.OriginalSource(content, adjustedPath);
                            }
                            else {
                                source = new webpack_sources_1.RawSource(content);
                            }
                            resolve(source);
                        });
                    });
                });
                Promise.all(sourceGetters)
                    .then(sources => {
                    const concatSource = new webpack_sources_1.ConcatSource();
                    sources.forEach(source => {
                        concatSource.add(source);
                        concatSource.add('\n;');
                    });
                    const combinedSource = new webpack_sources_1.CachedSource(concatSource);
                    const filename = loader_utils_1.interpolateName({ resourcePath: 'scripts.js' }, this.options.filename, { content: combinedSource.source() });
                    const output = { filename, source: combinedSource };
                    this._insertOutput(compilation, output);
                    this._cachedOutput = output;
                    compilation.fileDependencies.push(...scripts);
                    callback();
                })
                    .catch((err) => callback(err));
            });
        });
    }
}
exports.ScriptsWebpackPlugin = ScriptsWebpackPlugin;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/plugins/scripts-webpack-plugin.js.map