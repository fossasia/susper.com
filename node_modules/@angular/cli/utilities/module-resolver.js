'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const dependentFilesUtils = require("./get-dependent-files");
const change_1 = require("./change");
const ast_tools_1 = require("../lib/ast-tools");
/**
 * Rewrites import module of dependent files when the file is moved.
 * Also, rewrites export module of related index file of the given file.
 */
class ModuleResolver {
    constructor(oldFilePath, newFilePath, rootPath) {
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
    applySortedChangePromise(changes, host = ast_tools_1.NodeHost) {
        return changes
            .sort((currentChange, nextChange) => nextChange.order - currentChange.order)
            .reduce((newChange, change) => newChange.then(() => change.apply(host)), Promise.resolve());
    }
    /**
     * Assesses the import specifier and determines if it is a relative import.
     *
     * @return {boolean} boolean value if the import specifier is a relative import.
     */
    isRelativeImport(importClause) {
        let singleSlash = importClause.specifierText.charAt(0) === '/';
        let currentDirSyntax = importClause.specifierText.slice(0, 2) === './';
        let parentDirSyntax = importClause.specifierText.slice(0, 3) === '../';
        return singleSlash || currentDirSyntax || parentDirSyntax;
    }
    /**
     * Rewrites the import specifiers of all the dependent files (cases for no index file).
     *
     * @todo Implement the logic for rewriting imports of the dependent files when the file
     *       being moved has index file in its old path and/or in its new path.
     *
     * @return {Promise<Change[]>}
     */
    resolveDependentFiles() {
        return dependentFilesUtils.getDependentFiles(this.oldFilePath, this.rootPath)
            .then((files) => {
            let changes = [];
            let fileBaseName = path.basename(this.oldFilePath, '.ts');
            // Filter out the spec file associated with to-be-promoted component unit.
            let relavantFiles = Object.keys(files).filter((file) => {
                if (path.extname(path.basename(file, '.ts')) === '.spec') {
                    return path.basename(path.basename(file, '.ts'), '.spec') !== fileBaseName;
                }
                else {
                    return true;
                }
            });
            relavantFiles.forEach(file => {
                let tempChanges = files[file]
                    .map(specifier => {
                    let componentName = path.basename(this.oldFilePath, '.ts');
                    let fileDir = path.dirname(file);
                    let changeText = path.relative(fileDir, path.join(this.newFilePath, componentName));
                    if (changeText.length > 0 && changeText.charAt(0) !== '.') {
                        changeText = `.${path.sep}${changeText}`;
                    }
                    ;
                    let position = specifier.end - specifier.specifierText.length;
                    return new change_1.ReplaceChange(file, position - 1, specifier.specifierText, changeText);
                });
                changes = changes.concat(tempChanges);
            });
            return changes;
        });
    }
    /**
     * Rewrites the file's own relative imports after it has been moved to new path.
     *
     * @return {Promise<Change[]>}
     */
    resolveOwnImports() {
        return dependentFilesUtils.createTsSourceFile(this.oldFilePath)
            .then((tsFile) => dependentFilesUtils.getImportClauses(tsFile))
            .then(moduleSpecifiers => {
            let changes = moduleSpecifiers
                .filter(importClause => this.isRelativeImport(importClause))
                .map(specifier => {
                let specifierText = specifier.specifierText;
                let moduleAbsolutePath = path.resolve(path.dirname(this.oldFilePath), specifierText);
                let changeText = path.relative(this.newFilePath, moduleAbsolutePath);
                if (changeText.length > 0 && changeText.charAt(0) !== '.') {
                    changeText = `.${path.sep}${changeText}`;
                }
                let position = specifier.end - specifier.specifierText.length;
                return new change_1.ReplaceChange(this.oldFilePath, position - 1, specifierText, changeText);
            });
            return changes;
        });
    }
}
exports.ModuleResolver = ModuleResolver;
//# sourceMappingURL=/users/hansl/sources/angular-cli/utilities/module-resolver.js.map