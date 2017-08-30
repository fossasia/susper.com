/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, Injector, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentType } from '@angular/cdk/portal';
import { BlockScrollStrategy, Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MdDialogConfig } from './dialog-config';
import { MdDialogRef } from './dialog-ref';
export declare const MD_DIALOG_DATA: InjectionToken<any>;
/** Injection token that determines the scroll handling while the dialog is open. */
export declare const MD_DIALOG_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MD_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => BlockScrollStrategy;
/** @docs-private */
export declare const MD_DIALOG_SCROLL_STRATEGY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: typeof Overlay[];
    useFactory: (overlay: Overlay) => () => BlockScrollStrategy;
};
/**
 * Service to open Material Design modal dialogs.
 */
export declare class MdDialog {
    private _overlay;
    private _injector;
    private _scrollStrategy;
    private _location;
    private _parentDialog;
    private _openDialogsAtThisLevel;
    private _afterAllClosedAtThisLevel;
    private _afterOpenAtThisLevel;
    private _boundKeydown;
    /** Keeps track of the currently-open dialogs. */
    readonly openDialogs: MdDialogRef<any>[];
    /** Stream that emits when a dialog has been opened. */
    readonly afterOpen: Subject<MdDialogRef<any>>;
    readonly _afterAllClosed: any;
    /**
     * Stream that emits when all open dialog have finished closing.
     * Will emit on subscribe if there are no open dialogs to begin with.
     */
    afterAllClosed: Observable<void>;
    constructor(_overlay: Overlay, _injector: Injector, _scrollStrategy: any, _location: Location, _parentDialog: MdDialog);
    /**
     * Opens a modal dialog containing the given component.
     * @param componentOrTemplateRef Type of the component to load into the dialog,
     *     or a TemplateRef to instantiate as the dialog content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened dialog.
     */
    open<T>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: MdDialogConfig): MdDialogRef<T>;
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll(): void;
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id: string): MdDialogRef<any> | undefined;
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param config The dialog configuration.
     * @returns A promise resolving to the OverlayRef for the created overlay.
     */
    private _createOverlay(config);
    /**
     * Creates an overlay state from a dialog config.
     * @param dialogConfig The dialog configuration.
     * @returns The overlay configuration.
     */
    private _getOverlayState(dialogConfig);
    /**
     * Attaches an MdDialogContainer to a dialog's already-created overlay.
     * @param overlay Reference to the dialog's underlying overlay.
     * @param config The dialog configuration.
     * @returns A promise resolving to a ComponentRef for the attached container.
     */
    private _attachDialogContainer(overlay, config);
    /**
     * Attaches the user-provided component to the already-created MdDialogContainer.
     * @param componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param dialogContainer Reference to the wrapping MdDialogContainer.
     * @param overlayRef Reference to the overlay in which the dialog resides.
     * @param config The dialog configuration.
     * @returns A promise resolving to the MdDialogRef that should be returned to the user.
     */
    private _attachDialogContent<T>(componentOrTemplateRef, dialogContainer, overlayRef, config);
    /**
     * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
     * of a dialog to close itself and, optionally, to return a value.
     * @param config Config object that is used to construct the dialog.
     * @param dialogRef Reference to the dialog.
     * @param container Dialog container element that wraps all of the contents.
     * @returns The custom injector that can be used inside the dialog.
     */
    private _createInjector<T>(config, dialogRef, dialogContainer);
    /**
     * Removes a dialog from the array of open dialogs.
     * @param dialogRef Dialog to be removed.
     */
    private _removeOpenDialog(dialogRef);
    /**
     * Handles global key presses while there are open dialogs. Closes the
     * top dialog when the user presses escape.
     */
    private _handleKeydown(event);
}
