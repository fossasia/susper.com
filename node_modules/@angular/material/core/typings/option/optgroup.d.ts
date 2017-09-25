import { CanDisable } from '../common-behaviors/disabled';
/** @docs-private */
export declare class MdOptgroupBase {
}
export declare const _MdOptgroupMixinBase: (new (...args: any[]) => CanDisable) & typeof MdOptgroupBase;
/**
 * Component that is used to group instances of `md-option`.
 */
export declare class MdOptgroup extends _MdOptgroupMixinBase implements CanDisable {
    /** Label for the option group. */
    label: string;
    /** Unique id for the underlying label. */
    _labelId: string;
}
