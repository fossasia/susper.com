/**
 *  An interface for retrieving documents by URL that the compiler uses
  * to load templates.
 */
export var ResourceLoader = (function () {
    function ResourceLoader() {
    }
    /**
     * @param {?} url
     * @return {?}
     */
    ResourceLoader.prototype.get = function (url) { return null; };
    return ResourceLoader;
}());
//# sourceMappingURL=resource_loader.js.map