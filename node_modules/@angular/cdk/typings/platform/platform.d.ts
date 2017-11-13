/**
 * Service to detect the current platform by comparing the userAgent strings and
 * checking browser-specific global properties.
 * @docs-private
 */
export declare class Platform {
    isBrowser: boolean;
    /** Layout Engines */
    EDGE: boolean;
    TRIDENT: boolean;
    BLINK: boolean;
    WEBKIT: boolean;
    /** Browsers and Platform Types */
    IOS: boolean;
    FIREFOX: boolean;
    ANDROID: boolean;
    SAFARI: boolean;
}
