import { OpaqueToken, OnDestroy } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Actions } from './actions';
export declare const effects: OpaqueToken;
export declare class EffectsSubscription extends Subscription implements OnDestroy {
    private store;
    parent: EffectsSubscription;
    constructor(store: Observer<Actions>, parent: EffectsSubscription, effectInstances?: any[]);
    addEffects(effectInstances: any[]): void;
    ngOnDestroy(): void;
}
