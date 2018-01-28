/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TaskConfiguration, TaskConfigurationGenerator } from '@angular-devkit/schematics';
import { NodePackageTaskOptions } from './options';
export declare class NodePackageInstallTask implements TaskConfigurationGenerator<NodePackageTaskOptions> {
    workingDirectory: string | undefined;
    quiet: boolean;
    constructor(workingDirectory?: string | undefined);
    toConfiguration(): TaskConfiguration<NodePackageTaskOptions>;
}
