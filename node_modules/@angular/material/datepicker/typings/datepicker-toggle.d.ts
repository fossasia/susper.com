/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MdDatepicker } from './datepicker';
import { MdDatepickerIntl } from './datepicker-intl';
export declare class MdDatepickerToggle<D> implements OnChanges, OnDestroy {
    _intl: MdDatepickerIntl;
    private _changeDetectorRef;
    private _stateChanges;
    /** Datepicker instance that the button will toggle. */
    datepicker: MdDatepicker<D>;
    /** Whether the toggle button is disabled. */
    disabled: any;
    private _disabled;
    constructor(_intl: MdDatepickerIntl, _changeDetectorRef: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    _open(event: Event): void;
}
