import { MonoTypeOperatorFunction, OperatorFunction } from '../interfaces';
export declare function publish<T>(): MonoTypeOperatorFunction<T>;
export declare function publish<T>(selector: MonoTypeOperatorFunction<T>): MonoTypeOperatorFunction<T>;
export declare function publish<T, R>(selector: OperatorFunction<T, R>): OperatorFunction<T, R>;
