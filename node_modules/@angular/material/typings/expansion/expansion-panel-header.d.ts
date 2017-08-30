/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { MdExpansionPanel } from './expansion-panel';
import { FocusOriginMonitor } from '../core/style/index';
/**
 * <md-expansion-panel-header> component.
 *
 * This component corresponds to the header element of an <md-expansion-panel>.
 *
 * Please refer to README.md for examples on how to use it.
 */
export declare class MdExpansionPanelHeader implements OnDestroy {
    panel: MdExpansionPanel;
    private _renderer;
    private _element;
    private _focusOriginMonitor;
    private _changeDetectorRef;
    private _parentChangeSubscription;
    constructor(panel: MdExpansionPanel, _renderer: Renderer2, _element: ElementRef, _focusOriginMonitor: FocusOriginMonitor, _changeDetectorRef: ChangeDetectorRef);
    /** Toggles the expanded state of the panel. */
    _toggle(): void;
    /** Gets whether the panel is expanded. */
    _isExpanded(): boolean;
    /** Gets the expanded state string of the panel. */
    _getExpandedState(): string;
    /** Gets the panel id. */
    _getPanelId(): string;
    /** Gets whether the expand indicator should be shown. */
    _showToggle(): boolean;
    /** Handle keyup event calling to toggle() if appropriate. */
    _keyup(event: KeyboardEvent): void;
    ngOnDestroy(): void;
}
/**
 * <md-panel-description> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
export declare class MdExpansionPanelDescription {
}
/**
 * <md-panel-title> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
export declare class MdExpansionPanelTitle {
}
