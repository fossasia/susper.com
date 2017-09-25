/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MdDialogRef } from './dialog-ref';
import { MdDialogContainer } from './dialog-container';
/**
 * Button that will close the current dialog.
 */
export declare class MdDialogClose implements OnChanges {
    dialogRef: MdDialogRef<any>;
    /** Screenreader label for the button. */
    ariaLabel: string;
    /** Dialog close input. */
    dialogResult: any;
    _matDialogClose: any;
    _mdDialogClose: any;
    _matDialogCloseResult: any;
    constructor(dialogRef: MdDialogRef<any>);
    ngOnChanges(changes: SimpleChanges): void;
}
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
export declare class MdDialogTitle implements OnInit {
    private _container;
    id: string;
    constructor(_container: MdDialogContainer);
    ngOnInit(): void;
}
/**
 * Scrollable content container of a dialog.
 */
export declare class MdDialogContent {
}
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
export declare class MdDialogActions {
}
