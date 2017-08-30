/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplatePortal } from '../core/portal/portal';
import { OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { CanDisable } from '../core/common-behaviors/disabled';
import { MdTabLabel } from './tab-label';
import { Subject } from 'rxjs/Subject';
/** @docs-private */
export declare class MdTabBase {
}
export declare const _MdTabMixinBase: (new (...args: any[]) => CanDisable) & typeof MdTabBase;
export declare class MdTab extends _MdTabMixinBase implements OnInit, CanDisable, OnChanges, OnDestroy {
    private _viewContainerRef;
    /** Content for the tab label given by <ng-template md-tab-label>. */
    templateLabel: MdTabLabel;
    /** Template inside the MdTab view that contains an <ng-content>. */
    _content: TemplateRef<any>;
    /** The plain text label for the tab, used when there is no template label. */
    textLabel: string;
    /** The portal that will be the hosted content of the tab */
    private _contentPortal;
    readonly content: TemplatePortal<any> | null;
    /** Emits whenever the label changes. */
    _labelChange: Subject<void>;
    /**
     * The relatively indexed position where 0 represents the center, negative is left, and positive
     * represents the right.
     */
    position: number | null;
    /**
     * The initial relatively index origin of the tab if it was created and selected after there
     * was already a selected tab. Provides context of what position the tab should originate from.
     */
    origin: number | null;
    /**
     * Whether the tab is currently active.
     */
    isActive: boolean;
    constructor(_viewContainerRef: ViewContainerRef);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
}
