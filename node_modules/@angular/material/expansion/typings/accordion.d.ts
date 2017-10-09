/** MatAccordion's display modes. */
export declare type MatAccordionDisplayMode = 'default' | 'flat';
/**
 * Directive whose purpose is to manage the expanded state of CdkAccordionItem children.
 */
export declare class CdkAccordion {
    /** A readonly id value to use for unique selection coordination. */
    readonly id: string;
    /** Whether the accordion should allow multiple expanded accordion items simulateously. */
    multi: boolean;
    private _multi;
    /** Whether the expansion indicator should be hidden. */
    hideToggle: boolean;
    private _hideToggle;
    /**
     * The display mode used for all expansion panels in the accordion. Currently two display
     * modes exist:
     *   default - a gutter-like spacing is placed around any expanded panel, placing the expanded
     *     panel at a different elevation from the reset of the accordion.
     *  flat - no spacing is placed around expanded panels, showing all panels at the same
     *     elevation.
     */
    displayMode: MatAccordionDisplayMode;
}
/**
 * Directive for a Material Design Accordion.
 */
export declare class MatAccordion extends CdkAccordion {
}
