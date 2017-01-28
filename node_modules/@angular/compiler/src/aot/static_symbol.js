/**
 *  A token representing the a reference to a static type.
  * *
  * This token is unique for a filePath and name and can be used as a hash table key.
 */
export var StaticSymbol = (function () {
    /**
     * @param {?} filePath
     * @param {?} name
     * @param {?=} members
     */
    function StaticSymbol(filePath, name, members) {
        this.filePath = filePath;
        this.name = name;
        this.members = members;
    }
    return StaticSymbol;
}());
function StaticSymbol_tsickle_Closure_declarations() {
    /** @type {?} */
    StaticSymbol.prototype.filePath;
    /** @type {?} */
    StaticSymbol.prototype.name;
    /** @type {?} */
    StaticSymbol.prototype.members;
}
/**
 *  A cache of static symbol used by the StaticReflector to return the same symbol for the
  * same symbol values.
 */
export var StaticSymbolCache = (function () {
    function StaticSymbolCache() {
        this.cache = new Map();
    }
    /**
     * @param {?} declarationFile
     * @param {?} name
     * @param {?=} members
     * @return {?}
     */
    StaticSymbolCache.prototype.get = function (declarationFile, name, members) {
        members = members || [];
        var /** @type {?} */ memberSuffix = members.length ? "." + members.join('.') : '';
        var /** @type {?} */ key = "\"" + declarationFile + "\"." + name + memberSuffix;
        var /** @type {?} */ result = this.cache.get(key);
        if (!result) {
            result = new StaticSymbol(declarationFile, name, members);
            this.cache.set(key, result);
        }
        return result;
    };
    return StaticSymbolCache;
}());
function StaticSymbolCache_tsickle_Closure_declarations() {
    /** @type {?} */
    StaticSymbolCache.prototype.cache;
}
//# sourceMappingURL=static_symbol.js.map