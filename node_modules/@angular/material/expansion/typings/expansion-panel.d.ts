import { ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CanDisable, UniqueSelectionDispatcher } from '@angular/material/core';
import { Subject } from 'rxjs/Subject';
import { MdAccordion } from './accordion';
import { AccordionItem } from './accordion-item';
/** @docs-private */
export declare class MdExpansionPanelBase extends AccordionItem {
    constructor(accordion: MdAccordion, _changeDetectorRef: ChangeDetectorRef, _uniqueSelectionDispatcher: UniqueSelectionDispatcher);
}
export declare const _MdExpansionPanelMixinBase: (new (...args: any[]) => CanDisable) & typeof MdExpansionPanelBase;
/** MdExpansionPanel's states. */
export declare type MdExpansionPanelState = 'expanded' | 'collapsed';
/** Time and timing curve for expansion panel animations. */
export declare const EXPANSION_PANEL_ANIMATION_TIMING = "225ms cubic-bezier(0.4,0.0,0.2,1)";
/**
 * <md-expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the CdkAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.
 */
export declare class MdExpansionPanel extends _MdExpansionPanelMixinBase implements CanDisable, OnChanges, OnDestroy {
    /** Whether the toggle indicator should be hidden. */
    hideToggle: boolean;
    /** Stream that emits for changes in `@Input` properties. */
    _inputChanges: Subject<SimpleChanges>;
    constructor(accordion: MdAccordion, _changeDetectorRef: ChangeDetectorRef, _uniqueSelectionDispatcher: UniqueSelectionDispatcher);
    /** Whether the expansion indicator should be hidden. */
    _getHideToggle(): boolean;
    /** Determines whether the expansion panel should have spacing between it and its siblings. */
    _hasSpacing(): boolean;
    /** Gets the expanded state string. */
    _getExpandedState(): MdExpansionPanelState;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}
export declare class MdExpansionPanelActionRow {
}
