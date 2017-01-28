import * as dependentFilesUtils from './get-dependent-files';
import { Change } from './change';
import { Host } from '@angular-cli/ast-tools';
/**
 * Rewrites import module of dependent files when the file is moved.
 * Also, rewrites export module of related index file of the given file.
 */
export declare class ModuleResolver {
    oldFilePath: string;
    newFilePath: string;
    rootPath: string;
    constructor(oldFilePath: string, newFilePath: string, rootPath: string);
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
    applySortedChangePromise(changes: Change[], host?: Host): Promise<void>;
    /**
     * Assesses the import specifier and determines if it is a relative import.
     *
     * @return {boolean} boolean value if the import specifier is a relative import.
     */
    isRelativeImport(importClause: dependentFilesUtils.ModuleImport): boolean;
    /**
     * Rewrites the import specifiers of all the dependent files (cases for no index file).
     *
     * @todo Implement the logic for rewriting imports of the dependent files when the file
     *       being moved has index file in its old path and/or in its new path.
     *
     * @return {Promise<Change[]>}
     */
    resolveDependentFiles(): Promise<Change[]>;
    /**
     * Rewrites the file's own relative imports after it has been moved to new path.
     *
     * @return {Promise<Change[]>}
     */
    resolveOwnImports(): Promise<Change[]>;
}
