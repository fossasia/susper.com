import { BlockScrollStrategy, Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { InjectionToken, Injector, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatDialogConfig } from './dialog-config';
import { MatDialogRef } from './dialog-ref';
export declare const MAT_DIALOG_DATA: InjectionToken<any>;
/** Injection token that determines the scroll handling while the dialog is open. */
export declare const MAT_DIALOG_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => BlockScrollStrategy;
/** @docs-private */
export declare const MAT_DIALOG_SCROLL_STRATEGY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: typeof Overlay[];
    useFactory: (overlay: Overlay) => () => BlockScrollStrategy;
};
/**
 * Service to open Material Design modal dialogs.
 */
export declare class MatDialog {
    private _overlay;
    private _injector;
    private _scrollStrategy;
    private _parentDialog;
    private _openDialogsAtThisLevel;
    private _afterAllClosedAtThisLevel;
    private _afterOpenAtThisLevel;
    private _boundKeydown;
    /** Keeps track of the currently-open dialogs. */
    readonly openDialogs: MatDialogRef<any>[];
    /** Stream that emits when a dialog has been opened. */
    readonly afterOpen: Subject<MatDialogRef<any>>;
    readonly _afterAllClosed: any;
    /**
     * Stream that emits when all open dialog have finished closing.
     * Will emit on subscribe if there are no open dialogs to begin with.
     */
    afterAllClosed: Observable<void>;
    constructor(_overlay: Overlay, _injector: Injector, location: Location, _scrollStrategy: any, _parentDialog: MatDialog);
    /**
     * Opens a modal dialog containing the given component.
     * @param componentOrTemplateRef Type of the component to load into the dialog,
     *     or a TemplateRef to instantiate as the dialog content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened dialog.
     */
    open<T>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: MatDialogConfig): MatDialogRef<T>;
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll(): void;
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id: string): MatDialogRef<any> | undefined;
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param config The dialog configuration.
     * @returns A promise resolving to the OverlayRef for the created overlay.
     */
    private _createOverlay(config);
    /**
     * Creates an overlay config from a dialog config.
     * @param dialogConfig The dialog configuration.
     * @returns The overlay configuration.
     */
    private _getOverlayConfig(dialogConfig);
    /**
     * Attaches an MatDialogContainer to a dialog's already-created overlay.
     * @param overlay Reference to the dialog's underlying overlay.
     * @param config The dialog configuration.
     * @returns A promise resolving to a ComponentRef for the attached container.
     */
    private _attachDialogContainer(overlay, config);
    /**
     * Attaches the user-provided component to the already-created MatDialogContainer.
     * @param componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param dialogContainer Reference to the wrapping MatDialogContainer.
     * @param overlayRef Reference to the overlay in which the dialog resides.
     * @param config The dialog configuration.
     * @returns A promise resolving to the MatDialogRef that should be returned to the user.
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
