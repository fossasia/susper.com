import { Observable } from 'rxjs/Observable';
export interface EffectMetadata {
    propertyName: string;
    dispatch: boolean;
}
export declare function Effect({dispatch}?: {
    dispatch: boolean;
}): PropertyDecorator;
export declare function getEffectsMetadata(instance: any): EffectMetadata[];
export declare function mergeEffects(instance: any): Observable<any>;
