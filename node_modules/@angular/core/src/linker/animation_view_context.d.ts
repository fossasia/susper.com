import { AnimationPlayer } from '../animation/animation_player';
import { AnimationQueue } from '../animation/animation_queue';
export declare class AnimationViewContext {
    private _animationQueue;
    private _players;
    constructor(_animationQueue: AnimationQueue);
    onAllActiveAnimationsDone(callback: () => any): void;
    queueAnimation(element: any, animationName: string, player: AnimationPlayer): void;
    getAnimationPlayers(element: any, animationName?: string): AnimationPlayer[];
}
