import { Constructor } from './constructor';
/** @docs-private */
export interface CanDisableRipple {
    disableRipple: boolean;
}
/** Mixin to augment a directive with a `disableRipple` property. */
export declare function mixinDisableRipple<T extends Constructor<{}>>(base: T): Constructor<CanDisableRipple> & T;
