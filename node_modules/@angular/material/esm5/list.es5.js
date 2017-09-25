import * as tslib_1 from "tslib";
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
var MdListBase = (function () {
    function MdListBase() {
    }
    return MdListBase;
}());
var _MdListMixinBase = mixinDisableRipple(MdListBase);
/**
 * \@docs-private
 */
var MdListItemBase = (function () {
    function MdListItemBase() {
    }
    return MdListItemBase;
}());
var _MdListItemMixinBase = mixinDisableRipple(MdListItemBase);
/**
 * Divider between items within a list.
 */
var MdListDivider = (function () {
    function MdListDivider() {
    }
    return MdListDivider;
}());
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
MdListDivider.ctorParameters = function () { return []; };
/**
 * A Material Design list component.
 */
var MdList = (function (_super) {
    tslib_1.__extends(MdList, _super);
    function MdList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdList;
}(_MdListMixinBase));
MdList.decorators = [
    { type: Component, args: [{ selector: 'md-list, mat-list, md-nav-list, mat-nav-list',
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
MdList.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListCssMatStyler = (function () {
    function MdListCssMatStyler() {
    }
    return MdListCssMatStyler;
}());
MdListCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-list, mat-list',
                host: { 'class': 'mat-list' }
            },] },
];
/**
 * @nocollapse
 */
MdListCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdNavListCssMatStyler = (function () {
    function MdNavListCssMatStyler() {
    }
    return MdNavListCssMatStyler;
}());
MdNavListCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-nav-list, mat-nav-list',
                host: { 'class': 'mat-nav-list' }
            },] },
];
/**
 * @nocollapse
 */
MdNavListCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdDividerCssMatStyler = (function () {
    function MdDividerCssMatStyler() {
    }
    return MdDividerCssMatStyler;
}());
MdDividerCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: 'md-divider, mat-divider',
                host: { 'class': 'mat-divider' }
            },] },
];
/**
 * @nocollapse
 */
MdDividerCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListAvatarCssMatStyler = (function () {
    function MdListAvatarCssMatStyler() {
    }
    return MdListAvatarCssMatStyler;
}());
MdListAvatarCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-list-avatar], [mat-list-avatar], [mdListAvatar], [matListAvatar]',
                host: { 'class': 'mat-list-avatar' }
            },] },
];
/**
 * @nocollapse
 */
MdListAvatarCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListIconCssMatStyler = (function () {
    function MdListIconCssMatStyler() {
    }
    return MdListIconCssMatStyler;
}());
MdListIconCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-list-icon], [mat-list-icon], [mdListIcon], [matListIcon]',
                host: { 'class': 'mat-list-icon' }
            },] },
];
/**
 * @nocollapse
 */
MdListIconCssMatStyler.ctorParameters = function () { return []; };
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
var MdListSubheaderCssMatStyler = (function () {
    function MdListSubheaderCssMatStyler() {
    }
    return MdListSubheaderCssMatStyler;
}());
MdListSubheaderCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[md-subheader], [mat-subheader], [mdSubheader], [matSubheader]',
                host: { 'class': 'mat-subheader' }
            },] },
];
/**
 * @nocollapse
 */
MdListSubheaderCssMatStyler.ctorParameters = function () { return []; };
/**
 * An item within a Material Design list.
 */
var MdListItem = (function (_super) {
    tslib_1.__extends(MdListItem, _super);
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _list
     * @param {?} navList
     */
    function MdListItem(_renderer, _element, _list, navList) {
        var _this = _super.call(this) || this;
        _this._renderer = _renderer;
        _this._element = _element;
        _this._list = _list;
        _this._isNavList = false;
        _this._isNavList = !!navList;
        return _this;
    }
    Object.defineProperty(MdListItem.prototype, "_hasAvatar", {
        /**
         * @param {?} avatar
         * @return {?}
         */
        set: function (avatar) {
            if (avatar != null) {
                this._renderer.addClass(this._element.nativeElement, 'mat-list-item-avatar');
            }
            else {
                this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-avatar');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdListItem.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    MdListItem.prototype._isRippleDisabled = function () {
        return !this._isNavList || this.disableRipple || this._list.disableRipple;
    };
    /**
     * @return {?}
     */
    MdListItem.prototype._handleFocus = function () {
        this._renderer.addClass(this._element.nativeElement, 'mat-list-item-focus');
    };
    /**
     * @return {?}
     */
    MdListItem.prototype._handleBlur = function () {
        this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-focus');
    };
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    MdListItem.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    return MdListItem;
}(_MdListItemMixinBase));
MdListItem.decorators = [
    { type: Component, args: [{ selector: 'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
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
MdListItem.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: MdList, decorators: [{ type: Optional },] },
    { type: MdNavListCssMatStyler, decorators: [{ type: Optional },] },
]; };
MdListItem.propDecorators = {
    '_lines': [{ type: ContentChildren, args: [MdLine,] },],
    '_hasAvatar': [{ type: ContentChild, args: [MdListAvatarCssMatStyler,] },],
};
/**
 * \@docs-private
 */
var MdSelectionListBase = (function () {
    function MdSelectionListBase() {
    }
    return MdSelectionListBase;
}());
var _MdSelectionListMixinBase = mixinDisableRipple(mixinDisabled(MdSelectionListBase));
/**
 * \@docs-private
 */
var MdListOptionBase = (function () {
    function MdListOptionBase() {
    }
    return MdListOptionBase;
}());
var _MdListOptionMixinBase = mixinDisableRipple(MdListOptionBase);
var FOCUSED_STYLE = 'mat-list-item-focus';
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is checked.
 */
var MdListOption = (function (_super) {
    tslib_1.__extends(MdListOption, _super);
    /**
     * @param {?} _renderer
     * @param {?} _element
     * @param {?} _changeDetector
     * @param {?} selectionList
     */
    function MdListOption(_renderer, _element, _changeDetector, selectionList) {
        var _this = _super.call(this) || this;
        _this._renderer = _renderer;
        _this._element = _element;
        _this._changeDetector = _changeDetector;
        _this.selectionList = selectionList;
        _this._selected = false;
        _this._disabled = false;
        /**
         * Whether the option has focus.
         */
        _this._hasFocus = false;
        /**
         * Whether the label should appear before or after the checkbox. Defaults to 'after'
         */
        _this.checkboxPosition = 'after';
        /**
         * Emitted when the option is focused.
         */
        _this.onFocus = new EventEmitter();
        /**
         * Emitted when the option is selected.
         */
        _this.selectChange = new EventEmitter();
        /**
         * Emitted when the option is deselected.
         */
        _this.deselected = new EventEmitter();
        /**
         * Emitted when the option is destroyed.
         */
        _this.destroyed = new EventEmitter();
        return _this;
    }
    Object.defineProperty(MdListOption.prototype, "disabled", {
        /**
         * Whether the option is disabled.
         * @return {?}
         */
        get: function () { return (this.selectionList && this.selectionList.disabled) || this._disabled; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdListOption.prototype, "selected", {
        /**
         * Whether the option is selected.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._selected = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdListOption.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
        if (this.selectionList.disabled) {
            this.disabled = true;
        }
    };
    /**
     * @return {?}
     */
    MdListOption.prototype.ngOnDestroy = function () {
        this.destroyed.emit({ option: this });
    };
    /**
     * Toggles the selection state of the option.
     * @return {?}
     */
    MdListOption.prototype.toggle = function () {
        this.selected = !this.selected;
        this.selectionList.selectedOptions.toggle(this);
        this._changeDetector.markForCheck();
    };
    /**
     * Allows for programmatic focusing of the option.
     * @return {?}
     */
    MdListOption.prototype.focus = function () {
        this._element.nativeElement.focus();
        this.onFocus.emit({ option: this });
    };
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    MdListOption.prototype._isRippleDisabled = function () {
        return this.disabled || this.disableRipple || this.selectionList.disableRipple;
    };
    /**
     * @return {?}
     */
    MdListOption.prototype._handleClick = function () {
        if (!this.disabled) {
            this.toggle();
        }
    };
    /**
     * @return {?}
     */
    MdListOption.prototype._handleFocus = function () {
        this._hasFocus = true;
        this._renderer.addClass(this._element.nativeElement, FOCUSED_STYLE);
    };
    /**
     * @return {?}
     */
    MdListOption.prototype._handleBlur = function () {
        this._renderer.removeClass(this._element.nativeElement, FOCUSED_STYLE);
    };
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    MdListOption.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    return MdListOption;
}(_MdListOptionMixinBase));
MdListOption.decorators = [
    { type: Component, args: [{ selector: 'md-list-option, mat-list-option',
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
MdListOption.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
    { type: MdSelectionList, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return MdSelectionList; }),] },] },
]; };
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
var MdSelectionList = (function (_super) {
    tslib_1.__extends(MdSelectionList, _super);
    /**
     * @param {?} _element
     */
    function MdSelectionList(_element) {
        var _this = _super.call(this) || this;
        _this._element = _element;
        /**
         * Tab index for the selection-list.
         */
        _this._tabIndex = 0;
        /**
         * Subscription to all list options' onFocus events
         */
        _this._optionFocusSubscription = Subscription.EMPTY;
        /**
         * Subscription to all list options' destroy events
         */
        _this._optionDestroyStream = Subscription.EMPTY;
        /**
         * The currently selected options.
         */
        _this.selectedOptions = new SelectionModel(true);
        return _this;
    }
    /**
     * @return {?}
     */
    MdSelectionList.prototype.ngAfterContentInit = function () {
        this._keyManager = new FocusKeyManager(this.options).withWrap();
        if (this.disabled) {
            this._tabIndex = -1;
        }
        this._optionFocusSubscription = this._onFocusSubscription();
        this._optionDestroyStream = this._onDestroySubscription();
    };
    /**
     * @return {?}
     */
    MdSelectionList.prototype.ngOnDestroy = function () {
        this._optionDestroyStream.unsubscribe();
        this._optionFocusSubscription.unsubscribe();
    };
    /**
     * Focus the selection-list.
     * @return {?}
     */
    MdSelectionList.prototype.focus = function () {
        this._element.nativeElement.focus();
    };
    /**
     * Selects all of the options.
     * @return {?}
     */
    MdSelectionList.prototype.selectAll = function () {
        this.options.forEach(function (option) {
            if (!option.selected) {
                option.toggle();
            }
        });
    };
    /**
     * Deselects all of the options.
     * @return {?}
     */
    MdSelectionList.prototype.deselectAll = function () {
        this.options.forEach(function (option) {
            if (option.selected) {
                option.toggle();
            }
        });
    };
    /**
     * Map all the options' destroy event subscriptions and merge them into one stream.
     * @return {?}
     */
    MdSelectionList.prototype._onDestroySubscription = function () {
        var _this = this;
        return RxChain.from(this.options.changes)
            .call(startWith, this.options)
            .call(switchMap, function (options) {
            return merge.apply(void 0, options.map(function (option) { return option.destroyed; }));
        }).subscribe(function (e) {
            var /** @type {?} */ optionIndex = _this.options.toArray().indexOf(e.option);
            if (e.option._hasFocus) {
                // Check whether the option is the last item
                if (optionIndex < _this.options.length - 1) {
                    _this._keyManager.setActiveItem(optionIndex);
                }
                else if (optionIndex - 1 >= 0) {
                    _this._keyManager.setActiveItem(optionIndex - 1);
                }
            }
            e.option.destroyed.unsubscribe();
        });
    };
    /**
     * Map all the options' onFocus event subscriptions and merge them into one stream.
     * @return {?}
     */
    MdSelectionList.prototype._onFocusSubscription = function () {
        var _this = this;
        return RxChain.from(this.options.changes)
            .call(startWith, this.options)
            .call(switchMap, function (options) {
            return merge.apply(void 0, options.map(function (option) { return option.onFocus; }));
        }).subscribe(function (e) {
            var /** @type {?} */ optionIndex = _this.options.toArray().indexOf(e.option);
            _this._keyManager.updateActiveItemIndex(optionIndex);
        });
    };
    /**
     * Passes relevant key presses to our key manager.
     * @param {?} event
     * @return {?}
     */
    MdSelectionList.prototype._keydown = function (event) {
        switch (event.keyCode) {
            case SPACE:
                this._toggleSelectOnFocusedOption();
                // Always prevent space from scrolling the page since the list has focus
                event.preventDefault();
                break;
            default:
                this._keyManager.onKeydown(event);
        }
    };
    /**
     * Toggles the selected state of the currently focused option.
     * @return {?}
     */
    MdSelectionList.prototype._toggleSelectOnFocusedOption = function () {
        var /** @type {?} */ focusedIndex = this._keyManager.activeItemIndex;
        if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
            var /** @type {?} */ focusedOption = this.options.toArray()[focusedIndex];
            if (focusedOption) {
                focusedOption.toggle();
            }
        }
    };
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param {?} index The index to be checked.
     * @return {?} True if the index is valid for our list of options.
     */
    MdSelectionList.prototype._isValidIndex = function (index) {
        return index >= 0 && index < this.options.length;
    };
    return MdSelectionList;
}(_MdSelectionListMixinBase));
MdSelectionList.decorators = [
    { type: Component, args: [{ selector: 'md-selection-list, mat-selection-list',
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
MdSelectionList.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
MdSelectionList.propDecorators = {
    'options': [{ type: ContentChildren, args: [MdListOption,] },],
};
var MdListModule = (function () {
    function MdListModule() {
    }
    return MdListModule;
}());
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
MdListModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdListModule, MdListBase, _MdListMixinBase, MdListItemBase, _MdListItemMixinBase, MdListDivider, MdList, MdListCssMatStyler, MdNavListCssMatStyler, MdDividerCssMatStyler, MdListAvatarCssMatStyler, MdListIconCssMatStyler, MdListSubheaderCssMatStyler, MdListItem, MdSelectionListBase, _MdSelectionListMixinBase, MdListOptionBase, _MdListOptionMixinBase, MdListOption, MdSelectionList, MdDividerCssMatStyler as MatDividerCssMatStyler, MdList as MatList, MdListAvatarCssMatStyler as MatListAvatarCssMatStyler, MdListBase as MatListBase, MdListCssMatStyler as MatListCssMatStyler, MdListDivider as MatListDivider, MdListIconCssMatStyler as MatListIconCssMatStyler, MdListItem as MatListItem, MdListItemBase as MatListItemBase, MdListModule as MatListModule, MdListOption as MatListOption, MdListOptionBase as MatListOptionBase, MdListSubheaderCssMatStyler as MatListSubheaderCssMatStyler, MdNavListCssMatStyler as MatNavListCssMatStyler, MdSelectionList as MatSelectionList, MdSelectionListBase as MatSelectionListBase };
//# sourceMappingURL=list.es5.js.map
