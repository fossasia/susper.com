/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MatDatepicker } from './datepicker';
import { MatDatepickerIntl } from './datepicker-intl';
export declare class MatDatepickerToggle<D> implements OnChanges, OnDestroy {
    _intl: MatDatepickerIntl;
    private _changeDetectorRef;
    private _stateChanges;
    /** Datepicker instance that the button will toggle. */
    datepicker: MatDatepicker<D>;
    /** Whether the toggle button is disabled. */
    disabled: boolean;
    private _disabled;
    constructor(_intl: MatDatepickerIntl, _changeDetectorRef: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    _open(event: Event): void;
}
