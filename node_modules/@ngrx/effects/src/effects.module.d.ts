import { Type, OpaqueToken } from '@angular/core';
import { EffectsSubscription } from './effects-subscription';
export declare class EffectsModule {
    private effectsSubscription;
    static run(type: Type<any>): {
        ngModule: typeof EffectsModule;
        providers: (Type<any> | {
            provide: OpaqueToken;
            useExisting: Type<any>;
            multi: boolean;
        })[];
    };
    static runAfterBootstrap(type: Type<any>): {
        ngModule: typeof EffectsModule;
        providers: (Type<any> | {
            provide: OpaqueToken;
            useExisting: Type<any>;
            multi: boolean;
        })[];
    };
    constructor(effectsSubscription: EffectsSubscription);
}
