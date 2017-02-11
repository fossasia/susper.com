import { NgModule, Injector, APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { Actions } from './actions';
import { EffectsSubscription, effects } from './effects-subscription';
import { runAfterBootstrapEffects, afterBootstrapEffects } from './bootstrap-listener';
export var EffectsModule = (function () {
    function EffectsModule() {
    }
    EffectsModule.run = function (type) {
        return {
            ngModule: EffectsModule,
            providers: [
                EffectsSubscription,
                type,
                { provide: effects, useExisting: type, multi: true }
            ]
        };
    };
    EffectsModule.runAfterBootstrap = function (type) {
        return {
            ngModule: EffectsModule,
            providers: [
                type,
                { provide: afterBootstrapEffects, useExisting: type, multi: true }
            ]
        };
    };
    EffectsModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        Actions,
                        EffectsSubscription,
                        {
                            provide: APP_BOOTSTRAP_LISTENER,
                            multi: true,
                            deps: [Injector, EffectsSubscription],
                            useFactory: runAfterBootstrapEffects
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    EffectsModule.ctorParameters = [];
    return EffectsModule;
}());
//# sourceMappingURL=effects.module.js.map