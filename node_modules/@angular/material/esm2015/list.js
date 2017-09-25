/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Inject, Input, NgModule, Optional, Output, Renderer2, ViewEncapsulation, forwardRef } from '@angular/core';
import { MATERIAL_COMPATIBILITY_MODE, MdCommonModule, MdLine, MdLineModule, MdLineSetter, MdPseudoCheckboxModule, MdRippleModule, RxChain, SPACE, mixinDisableRipple, mixinDisabled, startWith, switchMap } from '@angular/material/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { merge } from 'rxjs/observable/merge';
import { Subscription } from 'rxjs/Subscription';

/**
 * \@docs-private
 */
class MdListBase {
}
const _MdListMixinBase = mixinDisableRipple(MdListBase);
/**
 * \@docs-private
 */
class MdListItemBase {
}
const _MdListItemMixinBase = mixinDisableRipple(MdListItemBase);
/**
 * Divider between items within a list.
 */
class MdListDivider {
}
MdListDivider.decorators = [
    { type: Directive, args: [{
                selector: 'md-divider, mat-divider',
                host: {
                    'role': 'separator',
                    'aria-orientation': 'horizontal'
                }
            },] },
];
/**
 * @nocollapse
 */
MdListDivider.ctorParameters = () => [];
/**
 * A Material Design list component.
 */
class MdList extends _MdListMixinBase {
}
MdList.decorators = [
    { type: Component, args: [{selector: 'md-list, mat-list, md-nav-list, mat-nav-list',
                host: { 'role': 'list' },
                template: '<ng-content></ng-content>',
                styles: [".mat-subheader{display:block;box-sizing:border-box;padding:16px}.mat-list .mat-subheader,.mat-nav-list .mat-subheader,.mat-selection-list .mat-subheader{margin:0}.mat-list,.mat-nav-list,.mat-selection-list{padding-top:8px;display:block}.mat-list .mat-subheader,.mat-nav-list .mat-subheader,.mat-selection-list .mat-subheader{height:48px;line-height:16px}.mat-list .mat-subheader:first-child,.mat-nav-list .mat-subheader:first-child,.mat-selection-list .mat-subheader:first-child{margin-top:-8px}.mat-list .mat-list-item,.mat-nav-list .mat-list-item,.mat-selection-list .mat-list-item{display:block}.mat-list .mat-list-item .mat-list-item-content,.mat-nav-list .mat-list-item .mat-list-item-content,.mat-selection-list .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-item .mat-list-item-content-reverse,.mat-nav-list .mat-list-item .mat-list-item-content-reverse,.mat-selection-list .mat-list-item .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list .mat-list-item .mat-list-item-ripple,.mat-nav-list .mat-list-item .mat-list-item-ripple,.mat-selection-list .mat-list-item .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-selection-list .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-item .mat-list-text,.mat-nav-list .mat-list-item .mat-list-text,.mat-selection-list .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-item .mat-list-text>*,.mat-nav-list .mat-list-item .mat-list-text>*,.mat-selection-list .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-item .mat-list-text:empty,.mat-nav-list .mat-list-item .mat-list-text:empty,.mat-selection-list .mat-list-item .mat-list-text:empty{display:none}.mat-list .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list .mat-list-item .mat-list-text:nth-child(2),.mat-selection-list .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list .mat-list-item .mat-list-avatar,.mat-nav-list .mat-list-item .mat-list-avatar,.mat-selection-list .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-item .mat-list-icon,.mat-nav-list .mat-list-item .mat-list-icon,.mat-selection-list .mat-list-item .mat-list-icon{width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list .mat-list-option,.mat-nav-list .mat-list-option,.mat-selection-list .mat-list-option{display:block}.mat-list .mat-list-option .mat-list-item-content,.mat-nav-list .mat-list-option .mat-list-item-content,.mat-selection-list .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-option .mat-list-item-content-reverse,.mat-nav-list .mat-list-option .mat-list-item-content-reverse,.mat-selection-list .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list .mat-list-option .mat-list-item-ripple,.mat-nav-list .mat-list-option .mat-list-item-ripple,.mat-selection-list .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-selection-list .mat-list-option.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-option.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-2-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-option.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-3-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-option.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-multi-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-option .mat-list-text,.mat-nav-list .mat-list-option .mat-list-text,.mat-selection-list .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-option .mat-list-text>*,.mat-nav-list .mat-list-option .mat-list-text>*,.mat-selection-list .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-option .mat-list-text:empty,.mat-nav-list .mat-list-option .mat-list-text:empty,.mat-selection-list .mat-list-option .mat-list-text:empty{display:none}.mat-list .mat-list-option .mat-list-text:nth-child(2),.mat-nav-list .mat-list-option .mat-list-text:nth-child(2),.mat-selection-list .mat-list-option .mat-list-text:nth-child(2){padding:0}.mat-list .mat-list-option .mat-list-avatar,.mat-nav-list .mat-list-option .mat-list-avatar,.mat-selection-list .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-option .mat-list-icon,.mat-nav-list .mat-list-option .mat-list-icon,.mat-selection-list .mat-list-option .mat-list-icon{width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list[dense],.mat-nav-list[dense],.mat-selection-list[dense]{padding-top:4px;display:block}.mat-list[dense] .mat-subheader,.mat-nav-list[dense] .mat-subheader,.mat-selection-list[dense] .mat-subheader{height:40px;line-height:8px}.mat-list[dense] .mat-subheader:first-child,.mat-nav-list[dense] .mat-subheader:first-child,.mat-selection-list[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list[dense] .mat-list-item,.mat-nav-list[dense] .mat-list-item,.mat-selection-list[dense] .mat-list-item{display:block}.mat-list[dense] .mat-list-item .mat-list-item-content,.mat-nav-list[dense] .mat-list-item .mat-list-item-content,.mat-selection-list[dense] .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-item .mat-list-item-content-reverse,.mat-nav-list[dense] .mat-list-item .mat-list-item-content-reverse,.mat-selection-list[dense] .mat-list-item .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list[dense] .mat-list-item .mat-list-item-ripple,.mat-nav-list[dense] .mat-list-item .mat-list-item-ripple,.mat-selection-list[dense] .mat-list-item .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-item .mat-list-text,.mat-nav-list[dense] .mat-list-item .mat-list-text,.mat-selection-list[dense] .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-item .mat-list-text>*,.mat-nav-list[dense] .mat-list-item .mat-list-text>*,.mat-selection-list[dense] .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-item .mat-list-text:empty,.mat-nav-list[dense] .mat-list-item .mat-list-text:empty,.mat-selection-list[dense] .mat-list-item .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list[dense] .mat-list-item .mat-list-text:nth-child(2),.mat-selection-list[dense] .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list[dense] .mat-list-item .mat-list-avatar,.mat-nav-list[dense] .mat-list-item .mat-list-avatar,.mat-selection-list[dense] .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-item .mat-list-icon,.mat-nav-list[dense] .mat-list-item .mat-list-icon,.mat-selection-list[dense] .mat-list-item .mat-list-icon{width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list[dense] .mat-list-option,.mat-nav-list[dense] .mat-list-option,.mat-selection-list[dense] .mat-list-option{display:block}.mat-list[dense] .mat-list-option .mat-list-item-content,.mat-nav-list[dense] .mat-list-option .mat-list-item-content,.mat-selection-list[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-option .mat-list-item-content-reverse,.mat-nav-list[dense] .mat-list-option .mat-list-item-content-reverse,.mat-selection-list[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list[dense] .mat-list-option .mat-list-item-ripple,.mat-nav-list[dense] .mat-list-option .mat-list-item-ripple,.mat-selection-list[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-option.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-2-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-option.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-3-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-option .mat-list-text,.mat-nav-list[dense] .mat-list-option .mat-list-text,.mat-selection-list[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-option .mat-list-text>*,.mat-nav-list[dense] .mat-list-option .mat-list-text>*,.mat-selection-list[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-option .mat-list-text:empty,.mat-nav-list[dense] .mat-list-option .mat-list-text:empty,.mat-selection-list[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-option .mat-list-text:nth-child(2),.mat-nav-list[dense] .mat-list-option .mat-list-text:nth-child(2),.mat-selection-list[dense] .mat-list-option .mat-list-text:nth-child(2){padding:0}.mat-list[dense] .mat-list-option .mat-list-avatar,.mat-nav-list[dense] .mat-list-option .mat-list-avatar,.mat-selection-list[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-option .mat-list-icon,.mat-nav-list[dense] .mat-list-option .mat-list-icon,.mat-selection-list[dense] .mat-list-option .mat-list-icon{width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-divider{display:block;border-top-style:solid;border-top-width:1px;margin:0}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item-content{cursor:pointer}.mat-nav-list .mat-list-item-content.mat-list-item-focus,.mat-nav-list .mat-list-item-content:hover{outline:0}.mat-list-option:not([disabled]){cursor:pointer}"],
                inputs: ['disableRipple'],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdList.ctorParameters = () => [];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MdListCssMatStyler {
}
MdListCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-list, mat-list',
                host: { 'class': 'mat-list' }
            },] },
];
/**
 * @nocollapse
 */
MdListCssMatStyler.ctorParameters = () => [];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MdNavListCssMatStyler {
}
MdNavListCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-nav-list, mat-nav-list',
                host: { 'class': 'mat-nav-list' }
            },] },
];
/**
 * @nocollapse
 */
MdNavListCssMatStyler.ctorParameters = () => [];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MdDividerCssMatStyler {
}
MdDividerCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-divider, mat-divider',
                host: { 'class': 'mat-divider' }
            },] },
];
/**
 * @nocollapse
 */
MdDividerCssMatStyler.ctorParameters = () => [];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MdListAvatarCssMatStyler {
}
MdListAvatarCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-list-avatar], [mat-list-avatar], [mdListAvatar], [matListAvatar]',
                host: { 'class': 'mat-list-avatar' }
            },] },
];
/**
 * @nocollapse
 */
MdListAvatarCssMatStyler.ctorParameters = () => [];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MdListIconCssMatStyler {
}
MdListIconCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-list-icon], [mat-list-icon], [mdListIcon], [matListIcon]',
                host: { 'class': 'mat-list-icon' }
            },] },
];
/**
 * @nocollapse
 */
MdListIconCssMatStyler.ctorParameters = () => [];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MdListSubheaderCssMatStyler {
}
MdListSubheaderCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-subheader], [mat-subheader], [mdSubheader], [matSubheader]',
                host: { 'class': 'mat-subheader' }
            },] },
];
/**
 * @nocollapse
 */
MdListSubheaderCssMatStyler.ctorParameters = () => [];
/**
 * An item within a Material Design list.
 */
class MdListItem extends _MdListItemMixinBase {
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _list
     * @param {?} navList
     */
    constructor(_renderer, _element, _list, navList) {
        super();
        this._renderer = _renderer;
        this._element = _element;
        this._list = _list;
        this._isNavList = false;
        this._isNavList = !!navList;
    }
    /**
     * @param {?} avatar
     * @return {?}
     */
    set _hasAvatar(avatar) {
        if (avatar != null) {
            this._renderer.addClass(this._element.nativeElement, 'mat-list-item-avatar');
        }
        else {
            this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-avatar');
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    }
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    _isRippleDisabled() {
        return !this._isNavList || this.disableRipple || this._list.disableRipple;
    }
    /**
     * @return {?}
     */
    _handleFocus() {
        this._renderer.addClass(this._element.nativeElement, 'mat-list-item-focus');
    }
    /**
     * @return {?}
     */
    _handleBlur() {
        this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-focus');
    }
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    _getHostElement() {
        return this._element.nativeElement;
    }
}
MdListItem.decorators = [
    { type: Component, args: [{selector: 'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
                host: {
                    'role': 'listitem',
                    'class': 'mat-list-item',
                    '(focus)': '_handleFocus()',
                    '(blur)': '_handleBlur()',
                },
                inputs: ['disableRipple'],
                template: "<div class=\"mat-list-item-content\"><div class=\"mat-list-item-ripple\" mat-ripple [matRippleTrigger]=\"_getHostElement()\" [matRippleDisabled]=\"_isRippleDisabled()\"></div><ng-content select=\"[md-list-avatar], [md-list-icon], [mat-list-avatar], [mat-list-icon], [mdListAvatar], [mdListIcon], [matListAvatar], [matListIcon]\"></ng-content><div class=\"mat-list-text\"><ng-content select=\"[md-line], [mat-line], [mdLine], [matLine]\"></ng-content></div><ng-content></ng-content></div>",
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                viewProviders: [{ provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }],
            },] },
];
/**
 * @nocollapse
 */
MdListItem.ctorParameters = () => [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: MdList, decorators: [{ type: Optional },] },
    { type: MdNavListCssMatStyler, decorators: [{ type: Optional },] },
];
MdListItem.propDecorators = {
    '_lines': [{ type: ContentChildren, args: [MdLine,] },],
    '_hasAvatar': [{ type: ContentChild, args: [MdListAvatarCssMatStyler,] },],
};

/**
 * \@docs-private
 */
class MdSelectionListBase {
}
const _MdSelectionListMixinBase = mixinDisableRipple(mixinDisabled(MdSelectionListBase));
/**
 * \@docs-private
 */
class MdListOptionBase {
}
const _MdListOptionMixinBase = mixinDisableRipple(MdListOptionBase);
const FOCUSED_STYLE = 'mat-list-item-focus';
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is checked.
 */
class MdListOption extends _MdListOptionMixinBase {
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _changeDetector
     * @param {?} selectionList
     */
    constructor(_renderer, _element, _changeDetector, selectionList) {
        super();
        this._renderer = _renderer;
        this._element = _element;
        this._changeDetector = _changeDetector;
        this.selectionList = selectionList;
        this._selected = false;
        this._disabled = false;
        /**
         * Whether the option has focus.
         */
        this._hasFocus = false;
        /**
         * Whether the label should appear before or after the checkbox. Defaults to 'after'
         */
        this.checkboxPosition = 'after';
        /**
         * Emitted when the option is focused.
         */
        this.onFocus = new EventEmitter();
        /**
         * Emitted when the option is selected.
         */
        this.selectChange = new EventEmitter();
        /**
         * Emitted when the option is deselected.
         */
        this.deselected = new EventEmitter();
        /**
         * Emitted when the option is destroyed.
         */
        this.destroyed = new EventEmitter();
    }
    /**
     * Whether the option is disabled.
     * @return {?}
     */
    get disabled() { return (this.selectionList && this.selectionList.disabled) || this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) { this._disabled = coerceBooleanProperty(value); }
    /**
     * Whether the option is selected.
     * @return {?}
     */
    get selected() { return this._selected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) { this._selected = coerceBooleanProperty(value); }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
        if (this.selectionList.disabled) {
            this.disabled = true;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.destroyed.emit({ option: this });
    }
    /**
     * Toggles the selection state of the option.
     * @return {?}
     */
    toggle() {
        this.selected = !this.selected;
        this.selectionList.selectedOptions.toggle(this);
        this._changeDetector.markForCheck();
    }
    /**
     * Allows for programmatic focusing of the option.
     * @return {?}
     */
    focus() {
        this._element.nativeElement.focus();
        this.onFocus.emit({ option: this });
    }
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    _isRippleDisabled() {
        return this.disabled || this.disableRipple || this.selectionList.disableRipple;
    }
    /**
     * @return {?}
     */
    _handleClick() {
        if (!this.disabled) {
            this.toggle();
        }
    }
    /**
     * @return {?}
     */
    _handleFocus() {
        this._hasFocus = true;
        this._renderer.addClass(this._element.nativeElement, FOCUSED_STYLE);
    }
    /**
     * @return {?}
     */
    _handleBlur() {
        this._renderer.removeClass(this._element.nativeElement, FOCUSED_STYLE);
    }
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    _getHostElement() {
        return this._element.nativeElement;
    }
}
MdListOption.decorators = [
    { type: Component, args: [{selector: 'md-list-option, mat-list-option',
                inputs: ['disableRipple'],
                host: {
                    'role': 'option',
                    'class': 'mat-list-item mat-list-option',
                    '(focus)': '_handleFocus()',
                    '(blur)': '_handleBlur()',
                    '(click)': '_handleClick()',
                    'tabindex': '-1',
                    '[class.mat-list-item-disabled]': 'disabled',
                    '[attr.aria-selected]': 'selected.toString()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                },
                template: "<div class=\"mat-list-item-content\" [class.mat-list-item-content-reverse]=\"checkboxPosition == 'after'\" [class.mat-list-item-disabled]=\"disabled\"><div mat-ripple class=\"mat-list-item-ripple\" [matRippleTrigger]=\"_getHostElement()\" [matRippleDisabled]=\"_isRippleDisabled()\"></div><mat-pseudo-checkbox #autocheckbox [state]=\"selected ? 'checked' : 'unchecked'\" [disabled]=\"disabled\"></mat-pseudo-checkbox><div class=\"mat-list-text\"><ng-content></ng-content></div></div>",
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                viewProviders: [{ provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }],
            },] },
];
/**
 * @nocollapse
 */
MdListOption.ctorParameters = () => [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
    { type: MdSelectionList, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => MdSelectionList),] },] },
];
MdListOption.propDecorators = {
    '_lines': [{ type: ContentChildren, args: [MdLine,] },],
    'checkboxPosition': [{ type: Input },],
    'value': [{ type: Input },],
    'disabled': [{ type: Input },],
    'selected': [{ type: Input },],
    'selectChange': [{ type: Output },],
    'deselected': [{ type: Output },],
    'destroyed': [{ type: Output },],
};
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
class MdSelectionList extends _MdSelectionListMixinBase {
    /**
     * @param {?} _element
     */
    constructor(_element) {
        super();
        this._element = _element;
        /**
         * Tab index for the selection-list.
         */
        this._tabIndex = 0;
        /**
         * Subscription to all list options' onFocus events
         */
        this._optionFocusSubscription = Subscription.EMPTY;
        /**
         * Subscription to all list options' destroy events
         */
        this._optionDestroyStream = Subscription.EMPTY;
        /**
         * The currently selected options.
         */
        this.selectedOptions = new SelectionModel(true);
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._keyManager = new FocusKeyManager(this.options).withWrap();
        if (this.disabled) {
            this._tabIndex = -1;
        }
        this._optionFocusSubscription = this._onFocusSubscription();
        this._optionDestroyStream = this._onDestroySubscription();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._optionDestroyStream.unsubscribe();
        this._optionFocusSubscription.unsubscribe();
    }
    /**
     * Focus the selection-list.
     * @return {?}
     */
    focus() {
        this._element.nativeElement.focus();
    }
    /**
     * Selects all of the options.
     * @return {?}
     */
    selectAll() {
        this.options.forEach(option => {
            if (!option.selected) {
                option.toggle();
            }
        });
    }
    /**
     * Deselects all of the options.
     * @return {?}
     */
    deselectAll() {
        this.options.forEach(option => {
            if (option.selected) {
                option.toggle();
            }
        });
    }
    /**
     * Map all the options' destroy event subscriptions and merge them into one stream.
     * @return {?}
     */
    _onDestroySubscription() {
        return RxChain.from(this.options.changes)
            .call(startWith, this.options)
            .call(switchMap, (options) => {
            return merge(...options.map(option => option.destroyed));
        }).subscribe((e) => {
            let /** @type {?} */ optionIndex = this.options.toArray().indexOf(e.option);
            if (e.option._hasFocus) {
                // Check whether the option is the last item
                if (optionIndex < this.options.length - 1) {
                    this._keyManager.setActiveItem(optionIndex);
                }
                else if (optionIndex - 1 >= 0) {
                    this._keyManager.setActiveItem(optionIndex - 1);
                }
            }
            e.option.destroyed.unsubscribe();
        });
    }
    /**
     * Map all the options' onFocus event subscriptions and merge them into one stream.
     * @return {?}
     */
    _onFocusSubscription() {
        return RxChain.from(this.options.changes)
            .call(startWith, this.options)
            .call(switchMap, (options) => {
            return merge(...options.map(option => option.onFocus));
        }).subscribe((e) => {
            let /** @type {?} */ optionIndex = this.options.toArray().indexOf(e.option);
            this._keyManager.updateActiveItemIndex(optionIndex);
        });
    }
    /**
     * Passes relevant key presses to our key manager.
     * @param {?} event
     * @return {?}
     */
    _keydown(event) {
        switch (event.keyCode) {
            case SPACE:
                this._toggleSelectOnFocusedOption();
                // Always prevent space from scrolling the page since the list has focus
                event.preventDefault();
                break;
            default:
                this._keyManager.onKeydown(event);
        }
    }
    /**
     * Toggles the selected state of the currently focused option.
     * @return {?}
     */
    _toggleSelectOnFocusedOption() {
        let /** @type {?} */ focusedIndex = this._keyManager.activeItemIndex;
        if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
            let /** @type {?} */ focusedOption = this.options.toArray()[focusedIndex];
            if (focusedOption) {
                focusedOption.toggle();
            }
        }
    }
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param {?} index The index to be checked.
     * @return {?} True if the index is valid for our list of options.
     */
    _isValidIndex(index) {
        return index >= 0 && index < this.options.length;
    }
}
MdSelectionList.decorators = [
    { type: Component, args: [{selector: 'md-selection-list, mat-selection-list',
                inputs: ['disabled', 'disableRipple'],
                host: {
                    'role': 'listbox',
                    '[attr.tabindex]': '_tabIndex',
                    'class': 'mat-selection-list',
                    '(focus)': 'focus()',
                    '(keydown)': '_keydown($event)',
                    '[attr.aria-disabled]': 'disabled.toString()'
                },
                template: '<ng-content></ng-content>',
                styles: [".mat-subheader{display:block;box-sizing:border-box;padding:16px}.mat-list .mat-subheader,.mat-nav-list .mat-subheader,.mat-selection-list .mat-subheader{margin:0}.mat-list,.mat-nav-list,.mat-selection-list{padding-top:8px;display:block}.mat-list .mat-subheader,.mat-nav-list .mat-subheader,.mat-selection-list .mat-subheader{height:48px;line-height:16px}.mat-list .mat-subheader:first-child,.mat-nav-list .mat-subheader:first-child,.mat-selection-list .mat-subheader:first-child{margin-top:-8px}.mat-list .mat-list-item,.mat-nav-list .mat-list-item,.mat-selection-list .mat-list-item{display:block}.mat-list .mat-list-item .mat-list-item-content,.mat-nav-list .mat-list-item .mat-list-item-content,.mat-selection-list .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-item .mat-list-item-content-reverse,.mat-nav-list .mat-list-item .mat-list-item-content-reverse,.mat-selection-list .mat-list-item .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list .mat-list-item .mat-list-item-ripple,.mat-nav-list .mat-list-item .mat-list-item-ripple,.mat-selection-list .mat-list-item .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-selection-list .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-selection-list .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-item .mat-list-text,.mat-nav-list .mat-list-item .mat-list-text,.mat-selection-list .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-item .mat-list-text>*,.mat-nav-list .mat-list-item .mat-list-text>*,.mat-selection-list .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-item .mat-list-text:empty,.mat-nav-list .mat-list-item .mat-list-text:empty,.mat-selection-list .mat-list-item .mat-list-text:empty{display:none}.mat-list .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list .mat-list-item .mat-list-text:nth-child(2),.mat-selection-list .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list .mat-list-item .mat-list-avatar,.mat-nav-list .mat-list-item .mat-list-avatar,.mat-selection-list .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-item .mat-list-icon,.mat-nav-list .mat-list-item .mat-list-icon,.mat-selection-list .mat-list-item .mat-list-icon{width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list .mat-list-option,.mat-nav-list .mat-list-option,.mat-selection-list .mat-list-option{display:block}.mat-list .mat-list-option .mat-list-item-content,.mat-nav-list .mat-list-option .mat-list-item-content,.mat-selection-list .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-option .mat-list-item-content-reverse,.mat-nav-list .mat-list-option .mat-list-item-content-reverse,.mat-selection-list .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list .mat-list-option .mat-list-item-ripple,.mat-nav-list .mat-list-option .mat-list-item-ripple,.mat-selection-list .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-selection-list .mat-list-option.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-option.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-2-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-option.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-3-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-option.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-option.mat-multi-line .mat-list-item-content,.mat-selection-list .mat-list-option.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-option .mat-list-text,.mat-nav-list .mat-list-option .mat-list-text,.mat-selection-list .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-option .mat-list-text>*,.mat-nav-list .mat-list-option .mat-list-text>*,.mat-selection-list .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-option .mat-list-text:empty,.mat-nav-list .mat-list-option .mat-list-text:empty,.mat-selection-list .mat-list-option .mat-list-text:empty{display:none}.mat-list .mat-list-option .mat-list-text:nth-child(2),.mat-nav-list .mat-list-option .mat-list-text:nth-child(2),.mat-selection-list .mat-list-option .mat-list-text:nth-child(2){padding:0}.mat-list .mat-list-option .mat-list-avatar,.mat-nav-list .mat-list-option .mat-list-avatar,.mat-selection-list .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-option .mat-list-icon,.mat-nav-list .mat-list-option .mat-list-icon,.mat-selection-list .mat-list-option .mat-list-icon{width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list[dense],.mat-nav-list[dense],.mat-selection-list[dense]{padding-top:4px;display:block}.mat-list[dense] .mat-subheader,.mat-nav-list[dense] .mat-subheader,.mat-selection-list[dense] .mat-subheader{height:40px;line-height:8px}.mat-list[dense] .mat-subheader:first-child,.mat-nav-list[dense] .mat-subheader:first-child,.mat-selection-list[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list[dense] .mat-list-item,.mat-nav-list[dense] .mat-list-item,.mat-selection-list[dense] .mat-list-item{display:block}.mat-list[dense] .mat-list-item .mat-list-item-content,.mat-nav-list[dense] .mat-list-item .mat-list-item-content,.mat-selection-list[dense] .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-item .mat-list-item-content-reverse,.mat-nav-list[dense] .mat-list-item .mat-list-item-content-reverse,.mat-selection-list[dense] .mat-list-item .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list[dense] .mat-list-item .mat-list-item-ripple,.mat-nav-list[dense] .mat-list-item .mat-list-item-ripple,.mat-selection-list[dense] .mat-list-item .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-item .mat-list-text,.mat-nav-list[dense] .mat-list-item .mat-list-text,.mat-selection-list[dense] .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-item .mat-list-text>*,.mat-nav-list[dense] .mat-list-item .mat-list-text>*,.mat-selection-list[dense] .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-item .mat-list-text:empty,.mat-nav-list[dense] .mat-list-item .mat-list-text:empty,.mat-selection-list[dense] .mat-list-item .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-item .mat-list-text:nth-child(2),.mat-nav-list[dense] .mat-list-item .mat-list-text:nth-child(2),.mat-selection-list[dense] .mat-list-item .mat-list-text:nth-child(2){padding:0}.mat-list[dense] .mat-list-item .mat-list-avatar,.mat-nav-list[dense] .mat-list-item .mat-list-avatar,.mat-selection-list[dense] .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-item .mat-list-icon,.mat-nav-list[dense] .mat-list-item .mat-list-icon,.mat-selection-list[dense] .mat-list-item .mat-list-icon{width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list[dense] .mat-list-option,.mat-nav-list[dense] .mat-list-option,.mat-selection-list[dense] .mat-list-option{display:block}.mat-list[dense] .mat-list-option .mat-list-item-content,.mat-nav-list[dense] .mat-list-option .mat-list-item-content,.mat-selection-list[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-option .mat-list-item-content-reverse,.mat-nav-list[dense] .mat-list-option .mat-list-item-content-reverse,.mat-selection-list[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list[dense] .mat-list-option .mat-list-item-ripple,.mat-nav-list[dense] .mat-list-option .mat-list-item-ripple,.mat-selection-list[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-option.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-2-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-option.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-3-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content,.mat-selection-list[dense] .mat-list-option.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-option .mat-list-text,.mat-nav-list[dense] .mat-list-option .mat-list-text,.mat-selection-list[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-option .mat-list-text>*,.mat-nav-list[dense] .mat-list-option .mat-list-text>*,.mat-selection-list[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-option .mat-list-text:empty,.mat-nav-list[dense] .mat-list-option .mat-list-text:empty,.mat-selection-list[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-option .mat-list-text:nth-child(2),.mat-nav-list[dense] .mat-list-option .mat-list-text:nth-child(2),.mat-selection-list[dense] .mat-list-option .mat-list-text:nth-child(2){padding:0}.mat-list[dense] .mat-list-option .mat-list-avatar,.mat-nav-list[dense] .mat-list-option .mat-list-avatar,.mat-selection-list[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-option .mat-list-icon,.mat-nav-list[dense] .mat-list-option .mat-list-icon,.mat-selection-list[dense] .mat-list-option .mat-list-icon{width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-divider{display:block;border-top-style:solid;border-top-width:1px;margin:0}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item-content{cursor:pointer}.mat-nav-list .mat-list-item-content.mat-list-item-focus,.mat-nav-list .mat-list-item-content:hover{outline:0}.mat-list-option:not([disabled]){cursor:pointer}"],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
MdSelectionList.ctorParameters = () => [
    { type: ElementRef, },
];
MdSelectionList.propDecorators = {
    'options': [{ type: ContentChildren, args: [MdListOption,] },],
};

class MdListModule {
}
MdListModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdLineModule, MdRippleModule, MdCommonModule, MdPseudoCheckboxModule, CommonModule],
                exports: [
                    MdList,
                    MdListItem,
                    MdListDivider,
                    MdListAvatarCssMatStyler,
                    MdLineModule,
                    MdCommonModule,
                    MdListIconCssMatStyler,
                    MdListCssMatStyler,
                    MdNavListCssMatStyler,
                    MdDividerCssMatStyler,
                    MdListSubheaderCssMatStyler,
                    MdPseudoCheckboxModule,
                    MdSelectionList,
                    MdListOption
                ],
                declarations: [
                    MdList,
                    MdListItem,
                    MdListDivider,
                    MdListAvatarCssMatStyler,
                    MdListIconCssMatStyler,
                    MdListCssMatStyler,
                    MdNavListCssMatStyler,
                    MdDividerCssMatStyler,
                    MdListSubheaderCssMatStyler,
                    MdSelectionList,
                    MdListOption
                ],
            },] },
];
/**
 * @nocollapse
 */
MdListModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MdListModule, MdListBase, _MdListMixinBase, MdListItemBase, _MdListItemMixinBase, MdListDivider, MdList, MdListCssMatStyler, MdNavListCssMatStyler, MdDividerCssMatStyler, MdListAvatarCssMatStyler, MdListIconCssMatStyler, MdListSubheaderCssMatStyler, MdListItem, MdSelectionListBase, _MdSelectionListMixinBase, MdListOptionBase, _MdListOptionMixinBase, MdListOption, MdSelectionList, MdDividerCssMatStyler as MatDividerCssMatStyler, MdList as MatList, MdListAvatarCssMatStyler as MatListAvatarCssMatStyler, MdListBase as MatListBase, MdListCssMatStyler as MatListCssMatStyler, MdListDivider as MatListDivider, MdListIconCssMatStyler as MatListIconCssMatStyler, MdListItem as MatListItem, MdListItemBase as MatListItemBase, MdListModule as MatListModule, MdListOption as MatListOption, MdListOptionBase as MatListOptionBase, MdListSubheaderCssMatStyler as MatListSubheaderCssMatStyler, MdNavListCssMatStyler as MatNavListCssMatStyler, MdSelectionList as MatSelectionList, MdSelectionListBase as MatSelectionListBase };
//# sourceMappingURL=list.js.map
