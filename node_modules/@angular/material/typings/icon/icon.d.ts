/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { MdIconRegistry } from './icon-registry';
import { CanColor } from '../core/common-behaviors/color';
/** @docs-private */
export declare class MdIconBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MdIconMixinBase: (new (...args: any[]) => CanColor) & typeof MdIconBase;
/**
 * Component to display an icon. It can be used in the following ways:
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   MdIconRegistry. If the svgIcon value contains a colon it is assumed to be in the format
 *   "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.
 *   Examples:
 *     <md-icon svgIcon="left-arrow"></md-icon>
 *     <md-icon svgIcon="animals:cat"></md-icon>
 *
 * - Use a font ligature as an icon by putting the ligature text in the content of the <md-icon>
 *   component. By default the Material icons font is used as described at
 *   http://google.github.io/material-design-icons/#icon-font-for-the-web. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with MdIconRegistry.registerFontClassAlias.
 *   Examples:
 *     <md-icon>home</md-icon>
 *     <md-icon fontSet="myfont">sun</md-icon>
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fortawesome.github.io/Font-Awesome/examples/
 *   Example:
 *     <md-icon fontSet="fa" fontIcon="alarm"></md-icon>
 */
export declare class MdIcon extends _MdIconMixinBase implements OnChanges, OnInit, CanColor {
    private _mdIconRegistry;
    /** Name of the icon in the SVG icon set. */
    svgIcon: string;
    /** Font set that the icon is a part of. */
    fontSet: string;
    /** Name of an icon within a font set. */
    fontIcon: string;
    private _previousFontSetClass;
    private _previousFontIconClass;
    constructor(renderer: Renderer2, elementRef: ElementRef, _mdIconRegistry: MdIconRegistry, ariaHidden: string);
    /**
     * Splits an svgIcon binding value into its icon set and icon name components.
     * Returns a 2-element array of [(icon set), (icon name)].
     * The separator for the two fields is ':'. If there is no separator, an empty
     * string is returned for the icon set and the entire value is returned for
     * the icon name. If the argument is falsy, returns an array of two empty strings.
     * Throws an error if the name contains two or more ':' separators.
     * Examples:
     *   'social:cake' -> ['social', 'cake']
     *   'penguin' -> ['', 'penguin']
     *   null -> ['', '']
     *   'a:b:c' -> (throws Error)
     */
    private _splitIconName(iconName);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    private _usingFontIcon();
    private _setSvgElement(svg);
    private _clearSvgElement();
    private _updateFontIconClasses();
}
