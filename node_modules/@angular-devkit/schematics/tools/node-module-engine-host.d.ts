import { RuleFactory } from '@angular-devkit/schematics';
import { FileSystemCollectionDesc, FileSystemSchematicDesc } from './description';
import { FileSystemEngineHostBase } from './file-system-engine-host-base';
/**
 * A simple EngineHost that uses NodeModules to resolve collections.
 */
export declare class NodeModulesEngineHost extends FileSystemEngineHostBase {
    constructor();
    protected _resolvePackageJson(name: string, basedir?: string): string;
    protected _resolvePath(name: string, basedir?: string): string;
    protected _resolveCollectionPath(name: string): string;
    protected _resolveReferenceString(refString: string, parentPath: string): {
        ref: RuleFactory<{}>;
        path: string;
    } | null;
    protected _transformCollectionDescription(name: string, desc: Partial<FileSystemCollectionDesc>): FileSystemCollectionDesc;
    protected _transformSchematicDescription(name: string, _collection: FileSystemCollectionDesc, desc: Partial<FileSystemSchematicDesc>): FileSystemSchematicDesc;
}
