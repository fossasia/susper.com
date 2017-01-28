/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ValueTransformer, visitValue } from '../util';
import { StaticSymbol } from './static_symbol';
export var ResolvedStaticSymbol = (function () {
    /**
     * @param {?} symbol
     * @param {?} metadata
     */
    function ResolvedStaticSymbol(symbol, metadata) {
        this.symbol = symbol;
        this.metadata = metadata;
    }
    return ResolvedStaticSymbol;
}());
function ResolvedStaticSymbol_tsickle_Closure_declarations() {
    /** @type {?} */
    ResolvedStaticSymbol.prototype.symbol;
    /** @type {?} */
    ResolvedStaticSymbol.prototype.metadata;
}
var /** @type {?} */ SUPPORTED_SCHEMA_VERSION = 3;
/**
 *  This class is responsible for loading metadata per symbol,
  * and normalizing references between symbols.
 */
export var StaticSymbolResolver = (function () {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     * @param {?} summaryResolver
     * @param {?=} errorRecorder
     */
    function StaticSymbolResolver(host, staticSymbolCache, summaryResolver, errorRecorder) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.summaryResolver = summaryResolver;
        this.errorRecorder = errorRecorder;
        this.metadataCache = new Map();
        this.resolvedSymbols = new Map();
        this.resolvedFilePaths = new Set();
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype.resolveSymbol = function (staticSymbol) {
        if (staticSymbol.members.length > 0) {
            return this._resolveSymbolMembers(staticSymbol);
        }
        var /** @type {?} */ result = this._resolveSymbolFromSummary(staticSymbol);
        if (!result) {
            // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
            // have summaries, only .d.ts files. So we always need to check both, the summary
            // and metadata.
            this._createSymbolsOf(staticSymbol.filePath);
            result = this.resolvedSymbols.get(staticSymbol);
        }
        return result;
    };
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype._resolveSymbolMembers = function (staticSymbol) {
        var /** @type {?} */ members = staticSymbol.members;
        var /** @type {?} */ baseResolvedSymbol = this.resolveSymbol(this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name));
        if (!baseResolvedSymbol) {
            return null;
        }
        var /** @type {?} */ baseMetadata = baseResolvedSymbol.metadata;
        if (baseMetadata instanceof StaticSymbol) {
            return new ResolvedStaticSymbol(staticSymbol, this.getStaticSymbol(baseMetadata.filePath, baseMetadata.name, members));
        }
        else if (baseMetadata && baseMetadata.__symbolic === 'class') {
            if (baseMetadata.statics && members.length === 1) {
                return new ResolvedStaticSymbol(staticSymbol, baseMetadata.statics[members[0]]);
            }
        }
        else {
            var /** @type {?} */ value = baseMetadata;
            for (var /** @type {?} */ i = 0; i < members.length && value; i++) {
                value = value[members[i]];
            }
            return new ResolvedStaticSymbol(staticSymbol, value);
        }
        return null;
    };
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype._resolveSymbolFromSummary = function (staticSymbol) {
        var /** @type {?} */ summary = this.summaryResolver.resolveSummary(staticSymbol);
        return summary ? new ResolvedStaticSymbol(staticSymbol, summary.metadata) : null;
    };
    /**
     *  getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
      * All types passed to the StaticResolver should be pseudo-types returned by this method.
      * *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members
     * @return {?}
     */
    StaticSymbolResolver.prototype.getStaticSymbol = function (declarationFile, name, members) {
        return this.staticSymbolCache.get(declarationFile, name, members);
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    StaticSymbolResolver.prototype.getSymbolsOf = function (filePath) {
        // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
        // have summaries, only .d.ts files. So we always need to check both, the summary
        // and metadata.
        var /** @type {?} */ symbols = new Set(this.summaryResolver.getSymbolsOf(filePath));
        this._createSymbolsOf(filePath);
        this.resolvedSymbols.forEach(function (resolvedSymbol) {
            if (resolvedSymbol.symbol.filePath === filePath) {
                symbols.add(resolvedSymbol.symbol);
            }
        });
        return Array.from(symbols);
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    StaticSymbolResolver.prototype._createSymbolsOf = function (filePath) {
        var _this = this;
        if (this.resolvedFilePaths.has(filePath)) {
            return;
        }
        this.resolvedFilePaths.add(filePath);
        var /** @type {?} */ resolvedSymbols = [];
        var /** @type {?} */ metadata = this.getModuleMetadata(filePath);
        if (metadata['metadata']) {
            // handle direct declarations of the symbol
            Object.keys(metadata['metadata']).forEach(function (symbolName) {
                var /** @type {?} */ symbolMeta = metadata['metadata'][symbolName];
                resolvedSymbols.push(_this.createResolvedSymbol(_this.getStaticSymbol(filePath, symbolName), symbolMeta));
            });
        }
        // handle the symbols in one of the re-export location
        if (metadata['exports']) {
            var _loop_1 = function(moduleExport) {
                // handle the symbols in the list of explicitly re-exported symbols.
                if (moduleExport.export) {
                    moduleExport.export.forEach(function (exportSymbol) {
                        var /** @type {?} */ symbolName;
                        if (typeof exportSymbol === 'string') {
                            symbolName = exportSymbol;
                        }
                        else {
                            symbolName = exportSymbol.as;
                        }
                        var /** @type {?} */ symName = symbolName;
                        if (typeof exportSymbol !== 'string') {
                            symName = exportSymbol.name;
                        }
                        var /** @type {?} */ resolvedModule = _this.resolveModule(moduleExport.from, filePath);
                        if (resolvedModule) {
                            var /** @type {?} */ targetSymbol = _this.getStaticSymbol(resolvedModule, symName);
                            var /** @type {?} */ sourceSymbol = _this.getStaticSymbol(filePath, symbolName);
                            resolvedSymbols.push(new ResolvedStaticSymbol(sourceSymbol, targetSymbol));
                        }
                    });
                }
                else {
                    // handle the symbols via export * directives.
                    var /** @type {?} */ resolvedModule = this_1.resolveModule(moduleExport.from, filePath);
                    if (resolvedModule) {
                        var /** @type {?} */ nestedExports = this_1.getSymbolsOf(resolvedModule);
                        nestedExports.forEach(function (targetSymbol) {
                            var /** @type {?} */ sourceSymbol = _this.getStaticSymbol(filePath, targetSymbol.name);
                            resolvedSymbols.push(new ResolvedStaticSymbol(sourceSymbol, targetSymbol));
                        });
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = metadata['exports']; _i < _a.length; _i++) {
                var moduleExport = _a[_i];
                _loop_1(moduleExport);
            }
        }
        resolvedSymbols.forEach(function (resolvedSymbol) { return _this.resolvedSymbols.set(resolvedSymbol.symbol, resolvedSymbol); });
    };
    /**
     * @param {?} sourceSymbol
     * @param {?} metadata
     * @return {?}
     */
    StaticSymbolResolver.prototype.createResolvedSymbol = function (sourceSymbol, metadata) {
        var /** @type {?} */ self = this;
        var ReferenceTransformer = (function (_super) {
            __extends(ReferenceTransformer, _super);
            function ReferenceTransformer() {
                _super.apply(this, arguments);
            }
            /**
             * @param {?} map
             * @param {?} functionParams
             * @return {?}
             */
            ReferenceTransformer.prototype.visitStringMap = function (map, functionParams) {
                var /** @type {?} */ symbolic = map['__symbolic'];
                if (symbolic === 'function') {
                    var /** @type {?} */ oldLen = functionParams.length;
                    functionParams.push.apply(functionParams, (map['parameters'] || []));
                    var /** @type {?} */ result = _super.prototype.visitStringMap.call(this, map, functionParams);
                    functionParams.length = oldLen;
                    return result;
                }
                else if (symbolic === 'reference') {
                    var /** @type {?} */ module_1 = map['module'];
                    var /** @type {?} */ name_1 = map['name'];
                    if (!name_1) {
                        return null;
                    }
                    var /** @type {?} */ filePath = void 0;
                    if (module_1) {
                        filePath = self.resolveModule(module_1, sourceSymbol.filePath);
                        if (!filePath) {
                            return {
                                __symbolic: 'error',
                                message: "Could not resolve " + module_1 + " relative to " + sourceSymbol.filePath + "."
                            };
                        }
                    }
                    else {
                        var /** @type {?} */ isFunctionParam = functionParams.indexOf(name_1) >= 0;
                        if (!isFunctionParam) {
                            filePath = sourceSymbol.filePath;
                        }
                    }
                    if (filePath) {
                        return self.getStaticSymbol(filePath, name_1);
                    }
                    else {
                        // reference to a function parameter
                        return { __symbolic: 'reference', name: name_1 };
                    }
                }
                else {
                    return _super.prototype.visitStringMap.call(this, map, functionParams);
                }
            };
            return ReferenceTransformer;
        }(ValueTransformer));
        var /** @type {?} */ transformedMeta = visitValue(metadata, new ReferenceTransformer(), []);
        return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
    };
    /**
     * @param {?} error
     * @param {?} context
     * @param {?=} path
     * @return {?}
     */
    StaticSymbolResolver.prototype.reportError = function (error, context, path) {
        if (this.errorRecorder) {
            this.errorRecorder(error, (context && context.filePath) || path);
        }
        else {
            throw error;
        }
    };
    /**
     * @param {?} module an absolute path to a module file.
     * @return {?}
     */
    StaticSymbolResolver.prototype.getModuleMetadata = function (module) {
        var /** @type {?} */ moduleMetadata = this.metadataCache.get(module);
        if (!moduleMetadata) {
            var /** @type {?} */ moduleMetadatas = this.host.getMetadataFor(module);
            if (moduleMetadatas) {
                var /** @type {?} */ maxVersion_1 = -1;
                moduleMetadatas.forEach(function (md) {
                    if (md['version'] > maxVersion_1) {
                        maxVersion_1 = md['version'];
                        moduleMetadata = md;
                    }
                });
            }
            if (!moduleMetadata) {
                moduleMetadata =
                    { __symbolic: 'module', version: SUPPORTED_SCHEMA_VERSION, module: module, metadata: {} };
            }
            if (moduleMetadata['version'] != SUPPORTED_SCHEMA_VERSION) {
                var /** @type {?} */ errorMessage = moduleMetadata['version'] == 2 ?
                    "Unsupported metadata version " + moduleMetadata['version'] + " for module " + module + ". This module should be compiled with a newer version of ngc" :
                    "Metadata version mismatch for module " + module + ", found version " + moduleMetadata['version'] + ", expected " + SUPPORTED_SCHEMA_VERSION;
                this.reportError(new Error(errorMessage), null);
            }
            this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
    };
    /**
     * @param {?} module
     * @param {?} symbolName
     * @param {?=} containingFile
     * @return {?}
     */
    StaticSymbolResolver.prototype.getSymbolByModule = function (module, symbolName, containingFile) {
        var /** @type {?} */ filePath = this.resolveModule(module, containingFile);
        if (!filePath) {
            throw new Error("Could not resolve module " + module + " relative to " + containingFile);
        }
        return this.getStaticSymbol(filePath, symbolName);
    };
    /**
     * @param {?} module
     * @param {?} containingFile
     * @return {?}
     */
    StaticSymbolResolver.prototype.resolveModule = function (module, containingFile) {
        try {
            return this.host.moduleNameToFileName(module, containingFile);
        }
        catch (e) {
            console.error("Could not resolve module '" + module + "' relative to file " + containingFile);
            this.reportError(new e, null, containingFile);
        }
    };
    return StaticSymbolResolver;
}());
function StaticSymbolResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    StaticSymbolResolver.prototype.metadataCache;
    /** @type {?} */
    StaticSymbolResolver.prototype.resolvedSymbols;
    /** @type {?} */
    StaticSymbolResolver.prototype.resolvedFilePaths;
    /** @type {?} */
    StaticSymbolResolver.prototype.host;
    /** @type {?} */
    StaticSymbolResolver.prototype.staticSymbolCache;
    /** @type {?} */
    StaticSymbolResolver.prototype.summaryResolver;
    /** @type {?} */
    StaticSymbolResolver.prototype.errorRecorder;
}
//# sourceMappingURL=static_symbol_resolver.js.map