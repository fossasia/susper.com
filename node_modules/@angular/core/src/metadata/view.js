/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export var ViewEncapsulation = {};
ViewEncapsulation.Emulated = 0;
ViewEncapsulation.Native = 1;
ViewEncapsulation.None = 2;
ViewEncapsulation[ViewEncapsulation.Emulated] = "Emulated";
ViewEncapsulation[ViewEncapsulation.Native] = "Native";
ViewEncapsulation[ViewEncapsulation.None] = "None";
/**
 *  Metadata properties available for configuring Views.
  * *
  * For details on the `@Component` annotation, see {@link Component}.
  * *
  * ### Example
  * *
  * ```
  * selector: 'greet',
  * template: 'Hello {{name}}!',
  * })
  * class Greet {
  * name: string;
  * *
  * constructor() {
  * this.name = 'World';
  * }
  * }
  * ```
  * *
 * @deprecated Use Component instead.
  * *
  * {@link Component}
 */
export var ViewMetadata = (function () {
    /**
     * @param {?=} __0
     */
    function ViewMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, templateUrl = _b.templateUrl, template = _b.template, encapsulation = _b.encapsulation, styles = _b.styles, styleUrls = _b.styleUrls, animations = _b.animations, interpolation = _b.interpolation;
        this.templateUrl = templateUrl;
        this.template = template;
        this.styleUrls = styleUrls;
        this.styles = styles;
        this.encapsulation = encapsulation;
        this.animations = animations;
        this.interpolation = interpolation;
    }
    return ViewMetadata;
}());
function ViewMetadata_tsickle_Closure_declarations() {
    /**
     * {@link Component.templateUrl}
     * @type {?}
     */
    ViewMetadata.prototype.templateUrl;
    /**
     * {@link Component.template}
     * @type {?}
     */
    ViewMetadata.prototype.template;
    /**
     * {@link Component.stylesUrl}
     * @type {?}
     */
    ViewMetadata.prototype.styleUrls;
    /**
     * {@link Component.styles}
     * @type {?}
     */
    ViewMetadata.prototype.styles;
    /**
     * {@link Component.encapsulation}
     * @type {?}
     */
    ViewMetadata.prototype.encapsulation;
    /**
     * {@link Component.animation}
     * @type {?}
     */
    ViewMetadata.prototype.animations;
    /**
     * {@link Component.interpolation}
     * @type {?}
     */
    ViewMetadata.prototype.interpolation;
}
//# sourceMappingURL=view.js.map