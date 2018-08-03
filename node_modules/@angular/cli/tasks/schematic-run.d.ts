import { logging } from '@angular-devkit/core';
export interface SchematicRunOptions {
    taskOptions: SchematicOptions;
    workingDir: string;
    emptyHost: boolean;
    collectionName: string;
    schematicName: string;
    logger: logging.Logger;
}
export interface SchematicOptions {
    dryRun: boolean;
    force: boolean;
    [key: string]: any;
}
export interface SchematicOutput {
    modifiedFiles: string[];
}
declare const _default: any;
export default _default;
