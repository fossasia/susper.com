/// <reference types="node" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CollectionDescription, EngineHost, RuleFactory, SchematicDescription, Source, TypedSchematicContext } from '@angular-devkit/schematics';
import { Url } from 'url';
export declare type FallbackCollectionDescription = {
    host: EngineHost<{}, {}>;
    description: CollectionDescription<{}>;
};
export declare type FallbackSchematicDescription = {
    description: SchematicDescription<{}, {}>;
};
export declare type OptionTransform<T extends object, R extends object> = (schematic: SchematicDescription<FallbackCollectionDescription, FallbackSchematicDescription>, options: T) => R;
/**
 * An EngineHost that support multiple hosts in a fallback configuration. If a host does not
 * have a collection/schematics, use the following host before giving up.
 */
export declare class FallbackEngineHost implements EngineHost<{}, {}> {
    private _hosts;
    private _transforms;
    constructor();
    addHost<CollectionT extends object, SchematicT extends object>(host: EngineHost<CollectionT, SchematicT>): void;
    registerOptionsTransform<T extends object, R extends object>(t: OptionTransform<T, R>): void;
    createCollectionDescription(name: string): CollectionDescription<FallbackCollectionDescription>;
    createSchematicDescription(name: string, collection: CollectionDescription<FallbackCollectionDescription>): SchematicDescription<FallbackCollectionDescription, FallbackSchematicDescription>;
    getSchematicRuleFactory<OptionT extends object>(schematic: SchematicDescription<FallbackCollectionDescription, FallbackSchematicDescription>, collection: CollectionDescription<FallbackCollectionDescription>): RuleFactory<OptionT>;
    createSourceFromUrl(url: Url, context: TypedSchematicContext<FallbackCollectionDescription, FallbackSchematicDescription>): Source | null;
    transformOptions<OptionT extends object, ResultT extends object>(schematic: SchematicDescription<FallbackCollectionDescription, FallbackSchematicDescription>, options: OptionT): ResultT;
}
