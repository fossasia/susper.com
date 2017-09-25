/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { MdCommonModule } from '@angular/material/core';

/**
 * Content of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
class MdCardContent {
}
MdCardContent.decorators = [
    { type: Directive, args: [{
                selector: 'md-card-content, mat-card-content',
                host: { 'class': 'mat-card-content' }
            },] },
];
/**
 * @nocollapse
 */
MdCardContent.ctorParameters = () => [];
/**
 * Title of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
class MdCardTitle {
}
MdCardTitle.decorators = [
    { type: Directive, args: [{
                selector: `md-card-title, mat-card-title, [md-card-title], [mat-card-title],
             [mdCardTitle], [matCardTitle]`,
                host: {
                    'class': 'mat-card-title'
                }
            },] },
];
/**
 * @nocollapse
 */
MdCardTitle.ctorParameters = () => [];
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
class MdCardSubtitle {
}
MdCardSubtitle.decorators = [
    { type: Directive, args: [{
                selector: `md-card-subtitle, mat-card-subtitle, [md-card-subtitle], [mat-card-subtitle],
             [mdCardSubtitle], [matCardSubtitle]`,
                host: {
                    'class': 'mat-card-subtitle'
                }
            },] },
];
/**
 * @nocollapse
 */
MdCardSubtitle.ctorParameters = () => [];
/**
 * Action section of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
class MdCardActions {
    constructor() {
        /**
         * Position of the actions inside the card.
         */
        this.align = 'start';
    }
}
MdCardActions.decorators = [
    { type: Directive, args: [{
                selector: 'md-card-actions, mat-card-actions',
                host: {
                    'class': 'mat-card-actions',
                    '[class.mat-card-actions-align-end]': 'align === "end"',
                }
            },] },
];
/**
 * @nocollapse
 */
MdCardActions.ctorParameters = () => [];
MdCardActions.propDecorators = {
    'align': [{ type: Input },],
};
/**
 * Footer of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
class MdCardFooter {
}
MdCardFooter.decorators = [
    { type: Directive, args: [{
                selector: 'md-card-footer, mat-card-footer',
                host: { 'class': 'mat-card-footer' }
            },] },
];
/**
 * @nocollapse
 */
MdCardFooter.ctorParameters = () => [];
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
class MdCardImage {
}
MdCardImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-image], [mat-card-image], [mdCardImage], [matCardImage]',
                host: { 'class': 'mat-card-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardImage.ctorParameters = () => [];
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
class MdCardSmImage {
}
MdCardSmImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-sm-image], [mat-card-sm-image], [mdCardImageSmall], [matCardImageSmall]',
                host: { 'class': 'mat-card-sm-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardSmImage.ctorParameters = () => [];
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
class MdCardMdImage {
}
MdCardMdImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-md-image], [mat-card-md-image], [mdCardImageMedium], [matCardImageMedium]',
                host: { 'class': 'mat-card-md-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardMdImage.ctorParameters = () => [];
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
class MdCardLgImage {
}
MdCardLgImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-lg-image], [mat-card-lg-image], [mdCardImageLarge], [matCardImageLarge]',
                host: { 'class': 'mat-card-lg-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardLgImage.ctorParameters = () => [];
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
class MdCardXlImage {
}
MdCardXlImage.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-xl-image], [mat-card-xl-image], [mdCardImageXLarge], [matCardImageXLarge]',
                host: { 'class': 'mat-card-xl-image' }
            },] },
];
/**
 * @nocollapse
 */
MdCardXlImage.ctorParameters = () => [];
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
class MdCardAvatar {
}
MdCardAvatar.decorators = [
    { type: Directive, args: [{
                selector: '[md-card-avatar], [mat-card-avatar], [mdCardAvatar], [matCardAvatar]',
                host: { 'class': 'mat-card-avatar' }
            },] },
];
/**
 * @nocollapse
 */
MdCardAvatar.ctorParameters = () => [];
/**
 * A basic content container component that adds the styles of a Material design card.
 *
 * While this component can be used alone, it also provides a number
 * of preset styles for common card sections, including:
 * - md-card-title
 * - md-card-subtitle
 * - md-card-content
 * - md-card-actions
 * - md-card-footer
 */
class MdCard {
}
MdCard.decorators = [
    { type: Component, args: [{selector: 'md-card, mat-card',
                template: "<ng-content></ng-content><ng-content select=\"md-card-footer, mat-card-footer\"></ng-content>",
                styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);display:block;position:relative;padding:24px;border-radius:2px}.mat-card:not([class*=mat-elevation-z]){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.mat-card{outline:solid 1px}}.mat-card-flat{box-shadow:none}.mat-card-actions,.mat-card-content,.mat-card-subtitle,.mat-card-title{display:block;margin-bottom:16px}.mat-card-actions{margin-left:-16px;margin-right:-16px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 48px);margin:0 -24px 16px -24px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-footer{display:block;margin:0 -24px -24px -24px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button{margin:0 4px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header-text{margin:0 8px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0}.mat-card-lg-image,.mat-card-md-image,.mat-card-sm-image{margin:-8px 0}.mat-card-title-group{display:flex;justify-content:space-between;margin:0 -8px}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}@media (max-width:600px){.mat-card{padding:24px 16px}.mat-card-actions{margin-left:-8px;margin-right:-8px}.mat-card-image{width:calc(100% + 32px);margin:16px -16px}.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}.mat-card-header{margin:-8px 0 0 0}.mat-card-footer{margin-left:-16px;margin-right:-16px}}.mat-card-content>:first-child,.mat-card>:first-child{margin-top:0}.mat-card-content>:last-child:not(.mat-card-footer),.mat-card>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-24px}.mat-card>.mat-card-actions:last-child{margin-bottom:-16px;padding-bottom:0}.mat-card-actions .mat-button:first-child,.mat-card-actions .mat-raised-button:first-child{margin-left:0;margin-right:0}.mat-card-subtitle:not(:first-child),.mat-card-title:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card' }
            },] },
];
/**
 * @nocollapse
 */
MdCard.ctorParameters = () => [];
/**
 * Component intended to be used within the `<md-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 * \@docs-private
 */
class MdCardHeader {
}
MdCardHeader.decorators = [
    { type: Component, args: [{selector: 'md-card-header, mat-card-header',
                template: "<ng-content select=\"[md-card-avatar], [mat-card-avatar], [mdCardAvatar], [matCardAvatar]\"></ng-content><div class=\"mat-card-header-text\"><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle, [md-card-title], [mat-card-title], [md-card-subtitle], [mat-card-subtitle]\"></ng-content></div><ng-content></ng-content>",
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card-header' }
            },] },
];
/**
 * @nocollapse
 */
MdCardHeader.ctorParameters = () => [];
/**
 * Component intended to be used within the <md-card> component. It adds styles for a preset
 * layout that groups an image with a title section.
 * \@docs-private
 */
class MdCardTitleGroup {
}
MdCardTitleGroup.decorators = [
    { type: Component, args: [{selector: 'md-card-title-group, mat-card-title-group',
                template: "<div><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle, [md-card-title], [mat-card-title], [md-card-subtitle], [mat-card-subtitle]\"></ng-content></div><ng-content select=\"img\"></ng-content><ng-content></ng-content>",
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card-title-group' }
            },] },
];
/**
 * @nocollapse
 */
MdCardTitleGroup.ctorParameters = () => [];

class MdCardModule {
}
MdCardModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule],
                exports: [
                    MdCard,
                    MdCardHeader,
                    MdCardTitleGroup,
                    MdCardContent,
                    MdCardTitle,
                    MdCardSubtitle,
                    MdCardActions,
                    MdCardFooter,
                    MdCardSmImage,
                    MdCardMdImage,
                    MdCardLgImage,
                    MdCardImage,
                    MdCardXlImage,
                    MdCardAvatar,
                    MdCommonModule,
                ],
                declarations: [
                    MdCard, MdCardHeader, MdCardTitleGroup, MdCardContent, MdCardTitle, MdCardSubtitle,
                    MdCardActions, MdCardFooter, MdCardSmImage, MdCardMdImage, MdCardLgImage, MdCardImage,
                    MdCardXlImage, MdCardAvatar,
                ],
            },] },
];
/**
 * @nocollapse
 */
MdCardModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MdCardContent, MdCardTitle, MdCardSubtitle, MdCardActions, MdCardFooter, MdCardImage, MdCardSmImage, MdCardMdImage, MdCardLgImage, MdCardXlImage, MdCardAvatar, MdCard, MdCardHeader, MdCardTitleGroup, MdCardModule, MdCard as MatCard, MdCardActions as MatCardActions, MdCardAvatar as MatCardAvatar, MdCardContent as MatCardContent, MdCardFooter as MatCardFooter, MdCardHeader as MatCardHeader, MdCardImage as MatCardImage, MdCardLgImage as MatCardLgImage, MdCardMdImage as MatCardMatImage, MdCardModule as MatCardModule, MdCardSmImage as MatCardSmImage, MdCardSubtitle as MatCardSubtitle, MdCardTitle as MatCardTitle, MdCardTitleGroup as MatCardTitleGroup, MdCardXlImage as MatCardXlImage };
//# sourceMappingURL=card.js.map
