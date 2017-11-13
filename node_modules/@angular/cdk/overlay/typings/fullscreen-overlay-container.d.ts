import { OverlayContainer } from './overlay-container';
/**
 * The FullscreenOverlayContainer is the alternative to OverlayContainer
 * that supports correct displaying of overlay elements in Fullscreen mode
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
 * It should be provided in the root component that way:
 * providers: [
 *   {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
 * ],
 */
export declare class FullscreenOverlayContainer extends OverlayContainer {
    protected _createContainer(): void;
    private _adjustParentForFullscreenChange();
    private _addFullscreenChangeListener(fn);
    /**
     * When the page is put into fullscreen mode, a specific element is specified.
     * Only that element and its children are visible when in fullscreen mode.
    */
    getFullscreenElement(): Element;
}
