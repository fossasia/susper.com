/**
 *  Interface that defines how import statements should be generated.
 * @abstract
 */
export var ImportResolver = (function () {
    function ImportResolver() {
    }
    /**
     *  Converts a file path to a module name that can be used as an `import.
      * I.e. `path/to/importedFile.ts` should be imported by `path/to/containingFile.ts`.
     * @abstract
     * @param {?} importedFilePath
     * @param {?} containingFilePath
     * @return {?}
     */
    ImportResolver.prototype.fileNameToModuleName = function (importedFilePath, containingFilePath) { };
    return ImportResolver;
}());
//# sourceMappingURL=path_util.js.map