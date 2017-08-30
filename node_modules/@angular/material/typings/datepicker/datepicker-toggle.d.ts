/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MdDatepicker } from './datepicker';
import { MdDatepickerIntl } from './datepicker-intl';
export declare class MdDatepickerToggle<D> implements OnDestroy {
    _intl: MdDatepickerIntl;
    private _intlChanges;
    /** Datepicker instance that the button will toggle. */
    datepicker: MdDatepicker<D>;
    /** Whether the toggle button is disabled. */
    disabled: any;
    private _disabled;
    constructor(_intl: MdDatepickerIntl, changeDetectorRef: ChangeDetectorRef);
    ngOnDestroy(): void;
    _open(event: Event): void;
}
