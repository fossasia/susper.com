/// <reference types="chai" />
import { NgToolkitError } from '../error';
import { Serializer } from './serializer';
export declare class InvalidSchema extends NgToolkitError {
}
export declare class MissingImplementationError extends NgToolkitError {
}
export declare class SettingReadOnlyPropertyError extends NgToolkitError {
}
export interface Schema {
    [key: string]: any;
}
/** This interface is defined to simplify the arguments passed in to the SchemaTreeNode. */
export declare type TreeNodeConstructorArgument<T> = {
    parent?: SchemaTreeNode<T>;
    name?: string;
    value: T;
    forward: SchemaTreeNode<any>;
    schema: Schema;
};
/**
 * Holds all the information, including the value, of a node in the schema tree.
 */
export declare abstract class SchemaTreeNode<T> {
    protected _parent: SchemaTreeNode<any>;
    protected _defined: boolean;
    protected _dirty: boolean;
    protected _schema: Schema;
    protected _name: string;
    protected _value: T;
    protected _forward: SchemaTreeNode<any>;
    constructor(nodeMetaData: TreeNodeConstructorArgument<T>);
    dispose(): void;
    readonly defined: boolean;
    dirty: boolean;
    readonly abstract type: string;
    abstract destroy(): void;
    readonly name: string;
    readonly readOnly: boolean;
    readonly parent: SchemaTreeNode<any>;
    readonly children: {
        [key: string]: SchemaTreeNode<any>;
    };
    abstract get(): T;
    set(v: T): void;
    abstract serialize(serializer: Serializer, value?: T): void;
    protected static _defineProperty<T>(proto: any, treeNode: SchemaTreeNode<T>): void;
}
/** Base Class used for Non-Leaves TreeNode. Meaning they can have children. */
export declare abstract class NonLeafSchemaTreeNode<T> extends SchemaTreeNode<T> {
    dispose(): void;
    readonly readOnly: boolean;
    get(): T;
    destroy(): void;
    protected _createChildProperty<T>(name: string, value: T, forward: SchemaTreeNode<T>, schema: Schema, define?: boolean): SchemaTreeNode<T>;
}
/** A Schema Tree Node that represents an object. */
export declare class ObjectSchemaTreeNode extends NonLeafSchemaTreeNode<{
    [key: string]: any;
}> {
    protected _children: {
        [key: string]: SchemaTreeNode<any>;
    };
    constructor(metaData: TreeNodeConstructorArgument<any>);
    serialize(serializer: Serializer, value?: {
        [key: string]: any;
    }): void;
    readonly children: {
        [key: string]: SchemaTreeNode<any>;
    };
    readonly type: string;
}
/** A Schema Tree Node that represents an array. */
export declare class ArraySchemaTreeNode extends NonLeafSchemaTreeNode<Array<any>> {
    protected _items: SchemaTreeNode<any>[];
    constructor(metaData: TreeNodeConstructorArgument<Array<any>>);
    readonly children: {
        [key: string]: any;
    };
    readonly type: string;
    serialize(serializer: Serializer, value?: any[]): void;
}
/**
 * The root class of the tree node. Receives a prototype that will be filled with the
 * properties of the Schema root.
 */
export declare class RootSchemaTreeNode extends ObjectSchemaTreeNode {
    constructor(proto: any, metaData: TreeNodeConstructorArgument<Object>);
}
/** A leaf in the schema tree. Must contain a single primitive value. */
export declare abstract class LeafSchemaTreeNode<T> extends SchemaTreeNode<T> {
    private _default;
    constructor(metaData: TreeNodeConstructorArgument<T>);
    get(): any;
    set(v: T): void;
    destroy(): void;
    abstract convert(v: any): T;
    serialize(serializer: Serializer, value?: T): void;
}
