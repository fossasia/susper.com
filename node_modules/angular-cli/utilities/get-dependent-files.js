"use strict";
var fs = require('fs');
var ts = require('typescript');
var glob = require('glob');
var path = require('path');
var denodeify = require('denodeify');
var readFile = denodeify(fs.readFile);
var globSearch = denodeify(glob);
/**
 * Create a SourceFile as defined by Typescript Compiler API.
 * Generate a AST structure from a source file.
 *
 * @param fileName source file for which AST is to be extracted
 */
function createTsSourceFile(fileName) {
    return readFile(fileName, 'utf8')
        .then(function (contents) {
        return ts.createSourceFile(fileName, contents, ts.ScriptTarget.ES6, true);
    });
}
exports.createTsSourceFile = createTsSourceFile;
/**
 * Traverses through AST of a given file of kind 'ts.SourceFile', filters out child
 * nodes of the kind 'ts.SyntaxKind.ImportDeclaration' and returns import clauses as
 * ModuleImport[]
 *
 * @param {ts.SourceFile} node: Typescript Node of whose AST is being traversed
 *
 * @return {ModuleImport[]} traverses through ts.Node and returns an array of moduleSpecifiers.
 */
function getImportClauses(node) {
    return node.statements
        .filter(function (node) { return node.kind === ts.SyntaxKind.ImportDeclaration; }) // Only Imports.
        .map(function (node) {
        var moduleSpecifier = node.moduleSpecifier;
        return {
            specifierText: moduleSpecifier.getText().slice(1, -1),
            pos: moduleSpecifier.pos,
            end: moduleSpecifier.end
        };
    });
}
exports.getImportClauses = getImportClauses;
/**
 * Find the file, 'index.ts' given the directory name and return boolean value
 * based on its findings.
 *
 * @param dirPath
 *
 * @return a boolean value after it searches for a barrel (index.ts by convention) in a given path
 */
function hasIndexFile(dirPath) {
    return globSearch(path.join(dirPath, 'index.ts'), { nodir: true })
        .then(function (indexFile) {
        return indexFile.length > 0;
    });
}
exports.hasIndexFile = hasIndexFile;
/**
 * Function to get all the templates, stylesheets, and spec files of a given component unit
 * Assumption: When any component/service/pipe unit is generated, Angular CLI has a blueprint for
 *   creating associated files with the name of the generated unit. So, there are two
 *   assumptions made:
 *   a. the function only returns associated files that have names matching to the given unit.
 *   b. the function only looks for the associated files in the directory where the given unit
 *      exists.
 *
 * @todo read the metadata to look for the associated files of a given file.
 *
 * @param fileName
 *
 * @return absolute paths of '.html/.css/.sass/.spec.ts' files associated with the given file.
 *
 */
function getAllAssociatedFiles(fileName) {
    var fileDirName = path.dirname(fileName);
    var componentName = path.basename(fileName, '.ts');
    return globSearch(path.join(fileDirName, componentName + ".*"), { nodir: true })
        .then(function (files) {
        return files.filter(function (file) {
            return (path.basename(file) !== 'index.ts');
        });
    });
}
exports.getAllAssociatedFiles = getAllAssociatedFiles;
/**
 * Returns a map of all dependent file/s' path with their moduleSpecifier object
 * (specifierText, pos, end).
 *
 * @param fileName file upon which other files depend
 * @param rootPath root of the project
 *
 * @return {Promise<ModuleMap>} ModuleMap of all dependent file/s (specifierText, pos, end)
 *
 */
function getDependentFiles(fileName, rootPath) {
    return globSearch(path.join(rootPath, '**/*.ts'), { nodir: true })
        .then(function (files) { return Promise.all(files.map(function (file) { return createTsSourceFile(file); }))
        .then(function (tsFiles) { return tsFiles.map(function (file) { return getImportClauses(file); }); })
        .then(function (moduleSpecifiers) {
        var allFiles = {};
        files.forEach(function (file, index) {
            var sourcePath = path.normalize(file);
            allFiles[sourcePath] = moduleSpecifiers[index];
        });
        return allFiles;
    })
        .then(function (allFiles) {
        var relevantFiles = {};
        Object.keys(allFiles).forEach(function (filePath) {
            var tempModuleSpecifiers = allFiles[filePath]
                .filter(function (importClause) {
                // Filter only relative imports
                var singleSlash = importClause.specifierText.charAt(0) === '/';
                var currentDirSyntax = importClause.specifierText.slice(0, 2) === './';
                var parentDirSyntax = importClause.specifierText.slice(0, 3) === '../';
                return singleSlash || currentDirSyntax || parentDirSyntax;
            })
                .filter(function (importClause) {
                var modulePath = path.resolve(path.dirname(filePath), importClause.specifierText);
                var resolvedFileName = path.resolve(fileName);
                var fileBaseName = path.basename(resolvedFileName, '.ts');
                var parsedFilePath = path.join(path.dirname(resolvedFileName), fileBaseName);
                return (parsedFilePath === modulePath) || (resolvedFileName === modulePath);
            });
            if (tempModuleSpecifiers.length > 0) {
                relevantFiles[filePath] = tempModuleSpecifiers;
            }
            ;
        });
        return relevantFiles;
    }); });
}
exports.getDependentFiles = getDependentFiles;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/utilities/get-dependent-files.js.map