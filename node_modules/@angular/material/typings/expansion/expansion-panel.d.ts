/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { MdAccordion } from './accordion';
import { AccordionItem } from './accordion-item';
import { UniqueSelectionDispatcher } from '../core';
import { Subject } from 'rxjs/Subject';
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
export declare class MdExpansionPanel extends AccordionItem implements OnChanges, OnDestroy {
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
