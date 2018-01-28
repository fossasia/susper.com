/**
 * Refer to the angular shematics library to let the dependency validator
 * know it is used..
 *
 * require('@schematics/angular')
 */
import { Collection, Engine, Schematic } from '@angular-devkit/schematics';
import { FileSystemCollectionDesc, FileSystemSchematicDesc, NodeModulesEngineHost } from '@angular-devkit/schematics/tools';
export declare function getEngineHost(): NodeModulesEngineHost;
export declare function getEngine(): Engine<FileSystemCollectionDesc, FileSystemSchematicDesc>;
export declare function getCollection(collectionName: string): Collection<any, any>;
export declare function getSchematic(collection: Collection<any, any>, schematicName: string): Schematic<any, any>;
