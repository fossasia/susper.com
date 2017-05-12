import { deserializeSummaries, summaryFileName } from './summary_serializer';
var /** @type {?} */ STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
export var AotSummaryResolver = (function () {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     */
    function AotSummaryResolver(host, staticSymbolCache) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.summaryCache = new Map();
        this.loadedFilePaths = new Set();
    }
    /**
     * @param {?} symbol
     * @return {?}
     */
    AotSummaryResolver.prototype._assertNoMembers = function (symbol) {
        if (symbol.members.length) {
            throw new Error("Internal state: StaticSymbols in summaries can't have members! " + JSON.stringify(symbol));
        }
    };
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    AotSummaryResolver.prototype.resolveSummary = function (staticSymbol) {
        this._assertNoMembers(staticSymbol);
        var /** @type {?} */ summary = this.summaryCache.get(staticSymbol);
        if (!summary) {
            this._loadSummaryFile(staticSymbol.filePath);
            summary = this.summaryCache.get(staticSymbol);
        }
        return summary;
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    AotSummaryResolver.prototype.getSymbolsOf = function (filePath) {
        this._loadSummaryFile(filePath);
        return Array.from(this.summaryCache.keys()).filter(function (symbol) { return symbol.filePath === filePath; });
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    AotSummaryResolver.prototype._loadSummaryFile = function (filePath) {
        var _this = this;
        if (this.loadedFilePaths.has(filePath)) {
            return;
        }
        this.loadedFilePaths.add(filePath);
        if (!this.host.isSourceFile(filePath)) {
            var /** @type {?} */ summaryFilePath = summaryFileName(filePath);
            var /** @type {?} */ json = void 0;
            try {
                json = this.host.loadSummary(summaryFilePath);
            }
            catch (e) {
                console.error("Error loading summary file " + summaryFilePath);
                throw e;
            }
            if (json) {
                var /** @type {?} */ readSummaries = deserializeSummaries(this.staticSymbolCache, json);
                readSummaries.forEach(function (summary) { _this.summaryCache.set(summary.symbol, summary); });
            }
        }
    };
    return AotSummaryResolver;
}());
function AotSummaryResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    AotSummaryResolver.prototype.summaryCache;
    /** @type {?} */
    AotSummaryResolver.prototype.loadedFilePaths;
    /** @type {?} */
    AotSummaryResolver.prototype.host;
    /** @type {?} */
    AotSummaryResolver.prototype.staticSymbolCache;
}
//# sourceMappingURL=summary_resolver.js.map