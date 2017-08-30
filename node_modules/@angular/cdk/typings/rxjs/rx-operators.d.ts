/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable, ObservableInput } from 'rxjs/Observable';
import { PartialObserver } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { IScheduler } from 'rxjs/Scheduler';
import { _finally as _finallyOperator } from 'rxjs/operator/finally';
import { _catch as _catchOperator } from 'rxjs/operator/catch';
import { _do as _doOperator } from 'rxjs/operator/do';
import { map as mapOperator } from 'rxjs/operator/map';
import { filter as filterOperator } from 'rxjs/operator/filter';
import { share as shareOperator } from 'rxjs/operator/share';
import { first as firstOperator } from 'rxjs/operator/first';
import { switchMap as switchMapOperator } from 'rxjs/operator/switchMap';
import { startWith as startWithOperator } from 'rxjs/operator/startWith';
import { debounceTime as debounceTimeOperator } from 'rxjs/operator/debounceTime';
import { auditTime as auditTimeOperator } from 'rxjs/operator/auditTime';
import { takeUntil as takeUntilOperator } from 'rxjs/operator/takeUntil';
/**
 * Represents a strongly-typed chain of RxJS operators.
 *
 * We achieve strict type enforcement on the chained operators by creating types that
 * *unambiguously* match specific rxjs operators. These unambiguous types are created by
 * intersecting a "brand" to the `typeof` the existing operator. The brand (a class with a private
 * member) effectively forces nominal typing for the operators. This allows typescript to understand
 * that, for example, `filter` is *`filter`* and not, say, a map of T => boolean.
 *
 * The downside to this approach is that operators must be imported in their type-coerced form
 * rather than from the normal rxjs location.
 */
export interface StrictRxChain<T> {
    call<R>(operator: mapOperatorType<T, R>, project: (value: T, index: number) => R, thisArg?: any): StrictRxChain<R>;
    call<R>(operator: switchMapOperatorType<T, R>, project: (value: T, index: number) => ObservableInput<R>): StrictRxChain<R>;
    call<R>(operator: catchOperatorType<T, R>, selector: (err: any, caught: Observable<T>) => ObservableInput<R>): StrictRxChain<T | R>;
    call(operator: filterOperatorType<T>, predicate: (value: T, index: number) => boolean, thisArg?: any): StrictRxChain<T>;
    call(operator: shareOperatorType<T>): StrictRxChain<T>;
    call(operator: finallyOperatorType<T>, action: () => void): StrictRxChain<T>;
    call(operator: doOperatorType<T>, next: (x: T) => void, error?: (e: any) => void, complete?: () => void): StrictRxChain<T>;
    call(operator: doOperatorType<T>, observer: PartialObserver<T>): StrictRxChain<T>;
    call(operator: firstOperatorType<T>, thisArg?: any, defaultValue?: any): StrictRxChain<T>;
    call(operator: firstOperatorType<T>, predicate: (value: T) => boolean): StrictRxChain<T>;
    call(operator: startWithOperatorType<T>, ...args: any[]): StrictRxChain<T>;
    call(operator: debounceTimeOperatorType<T>, dueTime: number, scheduler?: IScheduler): StrictRxChain<T>;
    call(operator: auditTimeOperatorType<T>, duration: number, scheduler?: IScheduler): StrictRxChain<T>;
    call(operator: takeUntilOperatorType<T>, notifier: Observable<any>): StrictRxChain<T>;
    subscribe(fn: (t: T) => void): Subscription;
    result(): Observable<T>;
}
export declare class FinallyBrand {
    private _;
}
export declare class CatchBrand {
    private _;
}
export declare class DoBrand {
    private _;
}
export declare class MapBrand {
    private _;
}
export declare class FilterBrand {
    private _;
}
export declare class ShareBrand {
    private _;
}
export declare class FirstBrand {
    private _;
}
export declare class SwitchMapBrand {
    private _;
}
export declare class StartWithBrand {
    private _;
}
export declare class DebounceTimeBrand {
    private _;
}
export declare class AuditTimeBrand {
    private _;
}
export declare class TakeUntilBrand {
    private _;
}
export declare type finallyOperatorType<T> = typeof _finallyOperator & FinallyBrand;
export declare type catchOperatorType<T, R> = typeof _catchOperator & CatchBrand;
export declare type doOperatorType<T> = typeof _doOperator & DoBrand;
export declare type mapOperatorType<T, R> = typeof mapOperator & MapBrand;
export declare type filterOperatorType<T> = typeof filterOperator & FilterBrand;
export declare type shareOperatorType<T> = typeof shareOperator & ShareBrand;
export declare type firstOperatorType<T> = typeof firstOperator & FirstBrand;
export declare type switchMapOperatorType<T, R> = typeof switchMapOperator & SwitchMapBrand;
export declare type startWithOperatorType<T> = typeof startWithOperator & StartWithBrand;
export declare type debounceTimeOperatorType<T> = typeof debounceTimeOperator & DebounceTimeBrand;
export declare type auditTimeOperatorType<T> = typeof auditTimeOperator & AuditTimeBrand;
export declare type takeUntilOperatorType<T> = typeof takeUntilOperator & TakeUntilBrand;
export declare const finallyOperator: (<T>(this: Observable<T>, callback: () => void) => Observable<T>) & FinallyBrand & Function;
export declare const catchOperator: (<T, R>(this: Observable<T>, selector: (err: any, caught: Observable<T>) => ObservableInput<R>) => Observable<T | R>) & CatchBrand & Function;
export declare const doOperator: {
    <T>(this: Observable<T>, next: (x: T) => void, error?: ((e: any) => void) | undefined, complete?: (() => void) | undefined): Observable<T>;
    <T>(this: Observable<T>, observer: PartialObserver<T>): Observable<T>;
} & DoBrand & Function;
export declare const map: (<T, R>(this: Observable<T>, project: (value: T, index: number) => R, thisArg?: any) => Observable<R>) & MapBrand & Function;
export declare const filter: {
    <T, S extends T>(this: Observable<T>, predicate: (value: T, index: number) => value is S, thisArg?: any): Observable<S>;
    <T>(this: Observable<T>, predicate: (value: T, index: number) => boolean, thisArg?: any): Observable<T>;
} & FilterBrand & Function;
export declare const share: (<T>(this: Observable<T>) => Observable<T>) & ShareBrand & Function;
export declare const first: {
    <T, S extends T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => value is S): Observable<S>;
    <T, S extends T, R>(this: Observable<T>, predicate: (value: T | S, index: number, source: Observable<T>) => value is S, resultSelector: (value: S, index: number) => R, defaultValue?: R | undefined): Observable<R>;
    <T, S extends T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => value is S, resultSelector: void, defaultValue?: S | undefined): Observable<S>;
    <T>(this: Observable<T>, predicate?: ((value: T, index: number, source: Observable<T>) => boolean) | undefined): Observable<T>;
    <T, R>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, resultSelector?: ((value: T, index: number) => R) | undefined, defaultValue?: R | undefined): Observable<R>;
    <T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, resultSelector: void, defaultValue?: T | undefined): Observable<T>;
} & FirstBrand & Function;
export declare const switchMap: {
    <T, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<R>): Observable<R>;
    <T, I, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<I>, resultSelector: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R): Observable<R>;
} & SwitchMapBrand & Function;
export declare const startWith: {
    <T>(this: Observable<T>, v1: T, scheduler?: IScheduler | undefined): Observable<T>;
    <T>(this: Observable<T>, v1: T, v2: T, scheduler?: IScheduler | undefined): Observable<T>;
    <T>(this: Observable<T>, v1: T, v2: T, v3: T, scheduler?: IScheduler | undefined): Observable<T>;
    <T>(this: Observable<T>, v1: T, v2: T, v3: T, v4: T, scheduler?: IScheduler | undefined): Observable<T>;
    <T>(this: Observable<T>, v1: T, v2: T, v3: T, v4: T, v5: T, scheduler?: IScheduler | undefined): Observable<T>;
    <T>(this: Observable<T>, v1: T, v2: T, v3: T, v4: T, v5: T, v6: T, scheduler?: IScheduler | undefined): Observable<T>;
    <T>(this: Observable<T>, ...array: (IScheduler | T)[]): Observable<T>;
} & StartWithBrand & Function;
export declare const debounceTime: (<T>(this: Observable<T>, dueTime: number, scheduler?: IScheduler | undefined) => Observable<T>) & DebounceTimeBrand & Function;
export declare const auditTime: (<T>(this: Observable<T>, duration: number, scheduler?: IScheduler | undefined) => Observable<T>) & AuditTimeBrand & Function;
export declare const takeUntil: (<T>(this: Observable<T>, notifier: Observable<any>) => Observable<T>) & TakeUntilBrand & Function;
