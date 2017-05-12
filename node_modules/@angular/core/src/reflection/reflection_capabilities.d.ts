import { Type } from '../type';
import { PlatformReflectionCapabilities } from './platform_reflection_capabilities';
import { GetterFn, MethodFn, SetterFn } from './types';
/**
 * Attention: This regex has to hold even if the code is minified!
 */
export declare const DELEGATE_CTOR: RegExp;
export declare class ReflectionCapabilities implements PlatformReflectionCapabilities {
    private _reflect;
    constructor(reflect?: any);
    isReflectionEnabled(): boolean;
    factory<T>(t: Type<T>): (args: any[]) => T;
    private _ownParameters(type, parentCtor);
    parameters(type: Type<any>): any[][];
    private _ownAnnotations(typeOrFunc, parentCtor);
    annotations(typeOrFunc: Type<any>): any[];
    private _ownPropMetadata(typeOrFunc, parentCtor);
    propMetadata(typeOrFunc: any): {
        [key: string]: any[];
    };
    hasLifecycleHook(type: any, lcProperty: string): boolean;
    getter(name: string): GetterFn;
    setter(name: string): SetterFn;
    method(name: string): MethodFn;
    importUri(type: any): string;
    resolveIdentifier(name: string, moduleUrl: string, runtime: any): any;
    resolveEnum(enumIdentifier: any, name: string): any;
}
