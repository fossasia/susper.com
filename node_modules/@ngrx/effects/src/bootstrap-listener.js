import { OpaqueToken } from '@angular/core';
export var afterBootstrapEffects = new OpaqueToken('ngrx:effects: Bootstrap Effects');
export function runAfterBootstrapEffects(injector, subscription) {
    return function () {
        var effectInstances = injector.get(afterBootstrapEffects, false);
        if (effectInstances) {
            subscription.addEffects(effectInstances);
        }
    };
}
//# sourceMappingURL=bootstrap-listener.js.map