import { NgZone } from '../zone/ng_zone';
import { AnimationPlayer } from './animation_player';
export declare class AnimationQueue {
    private _zone;
    entries: AnimationPlayer[];
    constructor(_zone: NgZone);
    enqueue(player: AnimationPlayer): void;
    flush(): void;
    private _triggerAnimations();
}
