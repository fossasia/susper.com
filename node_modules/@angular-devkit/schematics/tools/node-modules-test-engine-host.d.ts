/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NodeModulesEngineHost } from '../tools';
/**
 * An EngineHost that uses a registry to super seed locations of collection.json files, but
 * revert back to using node modules resolution. This is done for testing.
 */
export declare class NodeModulesTestEngineHost extends NodeModulesEngineHost {
    private _collections;
    registerCollection(name: string, path: string): void;
    protected _resolveCollectionPath(name: string): string;
}
