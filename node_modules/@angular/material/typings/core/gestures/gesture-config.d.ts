import { HammerGestureConfig } from '@angular/platform-browser';
import { HammerInstance } from './gesture-annotations';
export declare class GestureConfig extends HammerGestureConfig {
    private _hammer;
    events: string[];
    constructor();
    /**
     * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
     *
     * Our gesture names come from the Material Design gestures spec:
     * https://www.google.com/design/spec/patterns/gestures.html#gestures-touch-mechanics
     *
     * More information on default recognizers can be found in Hammer docs:
     * http://hammerjs.github.io/recognizer-pan/
     * http://hammerjs.github.io/recognizer-press/
     *
     * @param element Element to which to assign the new HammerJS gestures.
     * @returns Newly-created HammerJS instance.
     */
    buildHammer(element: HTMLElement): HammerInstance;
    /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
    private _createRecognizer(base, options, ...inheritances);
}
