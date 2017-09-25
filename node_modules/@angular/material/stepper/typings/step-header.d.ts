import { MdStepLabel } from './step-label';
export declare class MdStepHeader {
    /** Icon for the given step. */
    icon: string;
    /** Label of the given step. */
    label: MdStepLabel | string;
    /** Index of the given step. */
    index: any;
    private _index;
    /** Whether the given step is selected. */
    selected: any;
    private _selected;
    /** Whether the given step label is active. */
    active: any;
    private _active;
    /** Whether the given step is optional. */
    optional: any;
    private _optional;
    /** Returns string label of given step if it is a text label. */
    _stringLabel(): string | null;
    /** Returns MdStepLabel if the label of given step is a template label. */
    _templateLabel(): MdStepLabel | null;
}
