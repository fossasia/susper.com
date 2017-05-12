import * as ts from 'typescript';
/**
 * Interface that represents a module specifier and its position in the source file.
 * Use for storing a string literal, start position and end position of ImportClause node kinds.
 */
export interface ModuleImport {
    specifierText: string;
    pos: number;
    end: number;
}
export interface ModuleMap {
    [key: string]: ModuleImport[];
}
/**
 * Create a SourceFile as defined by Typescript Compiler API.
 * Generate a AST structure from a source file.
 *
 * @param fileName source file for which AST is to be extracted
 */
export declare function createTsSourceFile(fileName: string): Promise<ts.SourceFile>;
/**
 * Traverses through AST of a given file of kind 'ts.SourceFile', filters out child
 * nodes of the kind 'ts.SyntaxKind.ImportDeclaration' and returns import clauses as
 * ModuleImport[]
 *
 * @param {ts.SourceFile} node: Typescript Node of whose AST is being traversed
 *
 * @return {ModuleImport[]} traverses through ts.Node and returns an array of moduleSpecifiers.
 */
export declare function getImportClauses(node: ts.SourceFile): ModuleImport[];
/**
 * Find the file, 'index.ts' given the directory name and return boolean value
 * based on its findings.
 *
 * @param dirPath
 *
 * @return a boolean value after it searches for a barrel (index.ts by convention) in a given path
 */
export declare function hasIndexFile(dirPath: string): Promise<Boolean>;
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
export declare function getAllAssociatedFiles(fileName: string): Promise<string[]>;
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
export declare function getDependentFiles(fileName: string, rootPath: string): Promise<ModuleMap>;
