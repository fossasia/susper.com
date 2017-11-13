/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentChecked, AfterContentInit, AfterViewChecked, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, QueryList, Renderer2 } from '@angular/core';
import { MatTab } from './tab';
import { CanColor, CanDisableRipple, ThemePalette } from '@angular/material/core';
/** A simple change event emitted on focus or selection changes. */
export declare class MatTabChangeEvent {
    index: number;
    tab: MatTab;
}
/** Possible positions for the tab header. */
export declare type MatTabHeaderPosition = 'above' | 'below';
/** @docs-private */
export declare class MatTabGroupBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MatTabGroupMixinBase: (new (...args: any[]) => CanColor) & (new (...args: any[]) => CanDisableRipple) & typeof MatTabGroupBase;
/**
 * Material design tab-group component.  Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://www.google.com/design/spec/components/tabs.html
 */
export declare class MatTabGroup extends _MatTabGroupMixinBase implements AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, CanColor, CanDisableRipple {
    private _changeDetectorRef;
    _tabs: QueryList<MatTab>;
    _tabBodyWrapper: ElementRef;
    /** Whether this component has been initialized. */
    private _isInitialized;
    /** The tab index that should be selected after the content has been checked. */
    private _indexToSelect;
    /** Snapshot of the height of the tab body wrapper before another tab is activated. */
    private _tabBodyWrapperHeight;
    /** Subscription to tabs being added/removed. */
    private _tabsSubscription;
    /** Subscription to changes in the tab labels. */
    private _tabLabelSubscription;
    /** Whether the tab group should grow to the size of the active tab. */
    dynamicHeight: boolean;
    private _dynamicHeight;
    /** @deprecated */
    _dynamicHeightDeprecated: boolean;
    /** The index of the active tab. */
    selectedIndex: number | null;
    private _selectedIndex;
    /** Position of the tab header. */
    headerPosition: MatTabHeaderPosition;
    /** Background color of the tab group. */
    backgroundColor: ThemePalette;
    private _backgroundColor;
    /** Output to enable support for two-way binding on `[(selectedIndex)]` */
    selectedIndexChange: EventEmitter<number>;
    /** Event emitted when focus has changed within a tab group. */
    focusChange: EventEmitter<MatTabChangeEvent>;
    /** Event emitted when the tab selection has changed. */
    selectedTabChange: EventEmitter<MatTabChangeEvent>;
    /**
     * Event emitted when the tab selection has changed.
     * @deprecated Use `selectedTabChange` instead.
     */
    selectChange: EventEmitter<MatTabChangeEvent>;
    private _groupId;
    constructor(_renderer: Renderer2, elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef);
    /**
     * After the content is checked, this component knows what tabs have been defined
     * and what the selected index should be. This is where we can know exactly what position
     * each tab should be in according to the new selected index, and additionally we know how
     * a new selected tab should transition in (from the left or right).
     */
    ngAfterContentChecked(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Waits one frame for the view to update, then updates the ink bar
     * Note: This must be run outside of the zone or it will create an infinite change detection loop.
     */
    ngAfterViewChecked(): void;
    _focusChanged(index: number): void;
    private _createChangeEvent(index);
    /**
     * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
     * on the MatTab component, whereas the data binding is inside the MatTabGroup. In order for the
     * binding to be updated, we need to subscribe to changes in it and trigger change detection
     * manually.
     */
    private _subscribeToTabLabels();
    /** Returns a unique id for each tab label element */
    _getTabLabelId(i: number): string;
    /** Returns a unique id for each tab content element */
    _getTabContentId(i: number): string;
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     */
    _setTabBodyWrapperHeight(tabHeight: number): void;
    /** Removes the height of the tab body wrapper. */
    _removeTabBodyWrapperHeight(): void;
}
