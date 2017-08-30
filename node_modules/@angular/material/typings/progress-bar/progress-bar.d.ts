/**
 * <md-progress-bar> component.
 */
export declare class MdProgressBar {
    /** Color of the progress bar. */
    color: 'primary' | 'accent' | 'warn';
    private _value;
    /** Value of the progressbar. Defaults to zero. Mirrored to aria-valuenow. */
    value: number;
    private _bufferValue;
    /** Buffer value of the progress bar. Defaults to zero. */
    bufferValue: number;
    /**
     * Mode of the progress bar.
     *
     * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
     * 'determinate'.
     * Mirrored to mode attribute.
     */
    mode: 'determinate' | 'indeterminate' | 'buffer' | 'query';
    /** Gets the current transform value for the progress bar's primary indicator. */
    _primaryTransform(): {
        transform: string;
    };
    /**
     * Gets the current transform value for the progress bar's buffer indicator.  Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     */
    _bufferTransform(): {
        transform: string;
    } | undefined;
}
