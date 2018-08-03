import { Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { AppConfig } from '../utility/config';
export declare function findBootstrapModuleCall(host: Tree, mainPath: string): ts.CallExpression | null;
export declare function findBootstrapModulePath(host: Tree, mainPath: string): string;
export declare function getAppModulePath(host: Tree, app: AppConfig): string & {
    __PRIVATE_DEVKIT_PATH: void;
};
