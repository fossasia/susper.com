import { Injector, OpaqueToken } from '@angular/core';
import { EffectsSubscription } from './effects-subscription';
export declare const afterBootstrapEffects: OpaqueToken;
export declare function runAfterBootstrapEffects(injector: Injector, subscription: EffectsSubscription): () => void;
