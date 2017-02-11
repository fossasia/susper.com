import { NgModule } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { EffectsRunner } from './runner';
export function _createActions(runner) {
    return new Actions(runner);
}
export var EffectsTestingModule = (function () {
    function EffectsTestingModule() {
    }
    EffectsTestingModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        EffectsRunner,
                        { provide: Actions, deps: [EffectsRunner], useFactory: _createActions }
                    ]
                },] },
    ];
    /** @nocollapse */
    EffectsTestingModule.ctorParameters = [];
    return EffectsTestingModule;
}());
//# sourceMappingURL=testing.module.js.map