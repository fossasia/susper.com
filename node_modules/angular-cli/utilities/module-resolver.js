'use strict';
var path = require('path');
var dependentFilesUtils = require('./get-dependent-files');
var change_1 = require('./change');
var ast_tools_1 = require('@angular-cli/ast-tools');
/**
 * Rewrites import module of dependent files when the file is moved.
 * Also, rewrites export module of related index file of the given file.
 */
var ModuleResolver = (function () {
    function ModuleResolver(oldFilePath, newFilePath, rootPath) {
        this.oldFilePath = oldFilePath;
        this.newFilePath = newFilePath;
        this.rootPath = rootPath;
    }
    /**
     * Changes are applied from the bottom of a file to the top.
     * An array of Change instances are sorted based upon the order,
     * then apply() method is called sequentially.
     *
     * @param changes {Change []}
     * @param host {Host}
     * @return Promise after all apply() method of Change class is called
     *         to all Change instances sequentially.
     */
    ModuleResolver.prototype.applySortedChangePromise = function (changes, host) {
        if (host === void 0) { host = ast_tools_1.NodeHost; }
        return changes
            .sort(function (currentChange, nextChange) { return nextChange.order - currentChange.order; })
            .reduce(function (newChange, change) { return newChange.then(function () { return change.apply(host); }); }, Promise.resolve());
    };
    /**
     * Assesses the import specifier and determines if it is a relative import.
     *
     * @return {boolean} boolean value if the import specifier is a relative import.
     */
    ModuleResolver.prototype.isRelativeImport = function (importClause) {
        var singleSlash = importClause.specifierText.charAt(0) === '/';
        var currentDirSyntax = importClause.specifierText.slice(0, 2) === './';
        var parentDirSyntax = importClause.specifierText.slice(0, 3) === '../';
        return singleSlash || currentDirSyntax || parentDirSyntax;
    };
    /**
     * Rewrites the import specifiers of all the dependent files (cases for no index file).
     *
     * @todo Implement the logic for rewriting imports of the dependent files when the file
     *       being moved has index file in its old path and/or in its new path.
     *
     * @return {Promise<Change[]>}
     */
    ModuleResolver.prototype.resolveDependentFiles = function () {
        var _this = this;
        return dependentFilesUtils.getDependentFiles(this.oldFilePath, this.rootPath)
            .then(function (files) {
            var changes = [];
            var fileBaseName = path.basename(_this.oldFilePath, '.ts');
            // Filter out the spec file associated with to-be-promoted component unit.
            var relavantFiles = Object.keys(files).filter(function (file) {
                if (path.extname(path.basename(file, '.ts')) === '.spec') {
                    return path.basename(path.basename(file, '.ts'), '.spec') !== fileBaseName;
                }
                else {
                    return true;
                }
            });
            relavantFiles.forEach(function (file) {
                var tempChanges = files[file]
                    .map(function (specifier) {
                    var componentName = path.basename(_this.oldFilePath, '.ts');
                    var fileDir = path.dirname(file);
                    var changeText = path.relative(fileDir, path.join(_this.newFilePath, componentName));
                    if (changeText.length > 0 && changeText.charAt(0) !== '.') {
                        changeText = "." + path.sep + changeText;
                    }
                    ;
                    var position = specifier.end - specifier.specifierText.length;
                    return new change_1.ReplaceChange(file, position - 1, specifier.specifierText, changeText);
                });
                changes = changes.concat(tempChanges);
            });
            return changes;
        });
    };
    /**
     * Rewrites the file's own relative imports after it has been moved to new path.
     *
     * @return {Promise<Change[]>}
     */
    ModuleResolver.prototype.resolveOwnImports = function () {
        var _this = this;
        return dependentFilesUtils.createTsSourceFile(this.oldFilePath)
            .then(function (tsFile) { return dependentFilesUtils.getImportClauses(tsFile); })
            .then(function (moduleSpecifiers) {
            var changes = moduleSpecifiers
                .filter(function (importClause) { return _this.isRelativeImport(importClause); })
                .map(function (specifier) {
                var specifierText = specifier.specifierText;
                var moduleAbsolutePath = path.resolve(path.dirname(_this.oldFilePath), specifierText);
                var changeText = path.relative(_this.newFilePath, moduleAbsolutePath);
                if (changeText.length > 0 && changeText.charAt(0) !== '.') {
                    changeText = "." + path.sep + changeText;
                }
                var position = specifier.end - specifier.specifierText.length;
                return new change_1.ReplaceChange(_this.oldFilePath, position - 1, specifierText, changeText);
            });
            return changes;
        });
    };
    return ModuleResolver;
}());
exports.ModuleResolver = ModuleResolver;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/utilities/module-resolver.js.map