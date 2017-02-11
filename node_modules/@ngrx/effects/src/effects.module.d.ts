import { Type, OpaqueToken } from '@angular/core';
export declare class EffectsModule {
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
}
