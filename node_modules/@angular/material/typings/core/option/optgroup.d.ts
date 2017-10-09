import { CanDisable } from '../common-behaviors/disabled';
/** @docs-private */
export declare class MatOptgroupBase {
}
export declare const _MatOptgroupMixinBase: (new (...args: any[]) => CanDisable) & typeof MatOptgroupBase;
/**
 * Component that is used to group instances of `mat-option`.
 */
export declare class MatOptgroup extends _MatOptgroupMixinBase implements CanDisable {
    /** Label for the option group. */
    label: string;
    /** Unique id for the underlying label. */
    _labelId: string;
}
