var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { CompileSummaryKind } from '../compile_metadata';
import { ValueTransformer, visitValue } from '../util';
import { StaticSymbol } from './static_symbol';
var /** @type {?} */ STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
/**
 * @param {?} host
 * @param {?} summaryResolver
 * @param {?} symbolResolver
 * @param {?} symbols
 * @param {?} types
 * @return {?}
 */
export function serializeSummaries(host, summaryResolver, symbolResolver, symbols, types) {
    var /** @type {?} */ serializer = new Serializer(host);
    // for symbols, we use everything except for the class metadata itself
    // (we keep the statics though), as the class metadata is contained in the
    // CompileTypeSummary.
    symbols.forEach(function (resolvedSymbol) { return serializer.addOrMergeSummary({ symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata }); });
    // Add summaries that are referenced by the given symbols (transitively)
    // Note: the serializer.symbols array might be growing while
    // we execute the loop!
    for (var /** @type {?} */ processedIndex = 0; processedIndex < serializer.symbols.length; processedIndex++) {
        var /** @type {?} */ symbol = serializer.symbols[processedIndex];
        if (!host.isSourceFile(symbol.filePath)) {
            var /** @type {?} */ summary = summaryResolver.resolveSummary(symbol);
            if (!summary) {
                // some symbols might originate from a plain typescript library
                // that just exported .d.ts and .metadata.json files, i.e. where no summary
                // files were created.
                var /** @type {?} */ resolvedSymbol = symbolResolver.resolveSymbol(symbol);
                if (resolvedSymbol) {
                    summary = { symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata };
                }
            }
            if (summary) {
                serializer.addOrMergeSummary(summary);
            }
        }
    }
    // Add type summaries.
    // Note: We don't add the summaries of all referenced symbols as for the ResolvedSymbols,
    // as the type summaries already contain the transitive data that they require
    // (in a minimal way).
    types.forEach(function (typeSummary) {
        serializer.addOrMergeSummary({ symbol: typeSummary.type.reference, metadata: { __symbolic: 'class' }, type: typeSummary });
        if (typeSummary.summaryKind === CompileSummaryKind.NgModule) {
            var /** @type {?} */ ngModuleSummary = (typeSummary);
            ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach(function (id) {
                var /** @type {?} */ symbol = id.reference;
                if (!host.isSourceFile(symbol.filePath)) {
                    serializer.addOrMergeSummary(summaryResolver.resolveSummary(symbol));
                }
            });
        }
    });
    return serializer.serialize();
}
/**
 * @param {?} symbolCache
 * @param {?} json
 * @return {?}
 */
export function deserializeSummaries(symbolCache, json) {
    var /** @type {?} */ deserializer = new Deserializer(symbolCache);
    return deserializer.deserialize(json);
}
/**
 * @param {?} fileName
 * @return {?}
 */
export function summaryFileName(fileName) {
    var /** @type {?} */ fileNameWithoutSuffix = fileName.replace(STRIP_SRC_FILE_SUFFIXES, '');
    return fileNameWithoutSuffix + ".ngsummary.json";
}
var Serializer = (function (_super) {
    __extends(Serializer, _super);
    /**
     * @param {?} host
     */
    function Serializer(host) {
        _super.call(this);
        this.host = host;
        this.symbols = [];
        this.indexBySymbol = new Map();
        this.processedSummaryBySymbol = new Map();
        this.processedSummaries = [];
    }
    /**
     * @param {?} summary
     * @return {?}
     */
    Serializer.prototype.addOrMergeSummary = function (summary) {
        var /** @type {?} */ symbolMeta = summary.metadata;
        if (symbolMeta && symbolMeta.__symbolic === 'class') {
            // For classes, we only keep their statics, but not the metadata
            // of the class itself as that has been captured already via other summaries
            // (e.g. DirectiveSummary, ...).
            symbolMeta = { __symbolic: 'class', statics: symbolMeta.statics };
        }
        var /** @type {?} */ processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
        if (!processedSummary) {
            processedSummary = this.processValue({ symbol: summary.symbol });
            this.processedSummaries.push(processedSummary);
            this.processedSummaryBySymbol.set(summary.symbol, processedSummary);
        }
        // Note: == by purpose to compare with undefined!
        if (processedSummary.metadata == null && symbolMeta != null) {
            processedSummary.metadata = this.processValue(symbolMeta);
        }
        // Note: == by purpose to compare with undefined!
        if (processedSummary.type == null && summary.type != null) {
            processedSummary.type = this.processValue(summary.type);
        }
    };
    /**
     * @return {?}
     */
    Serializer.prototype.serialize = function () {
        var _this = this;
        return JSON.stringify({
            summaries: this.processedSummaries,
            symbols: this.symbols.map(function (symbol, index) {
                return {
                    __symbol: index,
                    name: symbol.name,
                    // We convert the source filenames tinto output filenames,
                    // as the generated summary file will be used when teh current
                    // compilation unit is used as a library
                    filePath: _this.host.getOutputFileName(symbol.filePath)
                };
            })
        });
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Serializer.prototype.processValue = function (value) { return visitValue(value, this, null); };
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    Serializer.prototype.visitOther = function (value, context) {
        if (value instanceof StaticSymbol) {
            var /** @type {?} */ index = this.indexBySymbol.get(value);
            // Note: == by purpose to compare with undefined!
            if (index == null) {
                index = this.indexBySymbol.size;
                this.indexBySymbol.set(value, index);
                this.symbols.push(value);
            }
            return { __symbol: index };
        }
    };
    return Serializer;
}(ValueTransformer));
function Serializer_tsickle_Closure_declarations() {
    /** @type {?} */
    Serializer.prototype.symbols;
    /** @type {?} */
    Serializer.prototype.indexBySymbol;
    /** @type {?} */
    Serializer.prototype.processedSummaryBySymbol;
    /** @type {?} */
    Serializer.prototype.processedSummaries;
    /** @type {?} */
    Serializer.prototype.host;
}
var Deserializer = (function (_super) {
    __extends(Deserializer, _super);
    /**
     * @param {?} symbolCache
     */
    function Deserializer(symbolCache) {
        _super.call(this);
        this.symbolCache = symbolCache;
    }
    /**
     * @param {?} json
     * @return {?}
     */
    Deserializer.prototype.deserialize = function (json) {
        var _this = this;
        var /** @type {?} */ data = JSON.parse(json);
        this.symbols = data.symbols.map(function (serializedSymbol) { return _this.symbolCache.get(serializedSymbol.filePath, serializedSymbol.name); });
        return visitValue(data.summaries, this, null);
    };
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    Deserializer.prototype.visitStringMap = function (map, context) {
        if ('__symbol' in map) {
            return this.symbols[map['__symbol']];
        }
        else {
            return _super.prototype.visitStringMap.call(this, map, context);
        }
    };
    return Deserializer;
}(ValueTransformer));
function Deserializer_tsickle_Closure_declarations() {
    /** @type {?} */
    Deserializer.prototype.symbols;
    /** @type {?} */
    Deserializer.prototype.symbolCache;
}
//# sourceMappingURL=summary_serializer.js.map