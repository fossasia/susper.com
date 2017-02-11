var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { OpaqueToken, Inject, SkipSelf, Optional, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { mergeEffects } from './effects';
export var effects = new OpaqueToken('ngrx/effects: Effects');
export var EffectsSubscription = (function (_super) {
    __extends(EffectsSubscription, _super);
    function EffectsSubscription(store, parent, effectInstances) {
        _super.call(this);
        this.store = store;
        this.parent = parent;
        if (Boolean(parent)) {
            parent.add(this);
        }
        if (Boolean(effectInstances)) {
            this.addEffects(effectInstances);
        }
    }
    EffectsSubscription.prototype.addEffects = function (effectInstances) {
        var sources = effectInstances.map(mergeEffects);
        var merged = merge.apply(void 0, sources);
        this.add(merged.subscribe(this.store));
    };
    EffectsSubscription.prototype.ngOnDestroy = function () {
        if (!this.closed) {
            this.unsubscribe();
        }
    };
    EffectsSubscription.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EffectsSubscription.ctorParameters = [
        { type: undefined, decorators: [{ type: Inject, args: [Store,] },] },
        { type: EffectsSubscription, decorators: [{ type: Optional }, { type: SkipSelf },] },
        { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [effects,] },] },
    ];
    return EffectsSubscription;
}(Subscription));
//# sourceMappingURL=effects-subscription.js.map