/**
 *  An instance of this class is returned as an event parameter when an animation
  * callback is captured for an animation either during the start or done phase.
  * *
  * ```typescript
  * host: {
  * '[@myAnimationTrigger]': 'someExpression',
  * '(@myAnimationTrigger.start)': 'captureStartEvent($event)',
  * '(@myAnimationTrigger.done)': 'captureDoneEvent($event)',
  * },
  * animations: [
  * trigger("myAnimationTrigger", [
  * // ...
  * ])
  * ]
  * })
  * class MyComponent {
  * someExpression: any = false;
  * captureStartEvent(event: AnimationTransitionEvent) {
  * // the toState, fromState and totalTime data is accessible from the event variable
  * }
  * *
  * captureDoneEvent(event: AnimationTransitionEvent) {
  * // the toState, fromState and totalTime data is accessible from the event variable
  * }
  * }
  * ```
  * *
 */
export var AnimationTransitionEvent = (function () {
    /**
     * @param {?} __0
     */
    function AnimationTransitionEvent(_a) {
        var fromState = _a.fromState, toState = _a.toState, totalTime = _a.totalTime, phaseName = _a.phaseName;
        this.fromState = fromState;
        this.toState = toState;
        this.totalTime = totalTime;
        this.phaseName = phaseName;
    }
    return AnimationTransitionEvent;
}());
function AnimationTransitionEvent_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationTransitionEvent.prototype.fromState;
    /** @type {?} */
    AnimationTransitionEvent.prototype.toState;
    /** @type {?} */
    AnimationTransitionEvent.prototype.totalTime;
    /** @type {?} */
    AnimationTransitionEvent.prototype.phaseName;
}
//# sourceMappingURL=animation_transition_event.js.map