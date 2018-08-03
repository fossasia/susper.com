/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BaseException } from '@angular-devkit/core';
import { Observable } from 'rxjs/Observable';
import { SchematicContext } from './interface';
export declare class UnknownTaskDependencyException extends BaseException {
    constructor(id: TaskId);
}
export interface TaskConfiguration<T = {}> {
    name: string;
    dependencies?: Array<TaskId>;
    options?: T;
}
export interface TaskConfigurationGenerator<T = {}> {
    toConfiguration(): TaskConfiguration<T>;
}
export declare type TaskExecutor<T = {}> = (options: T | undefined, context: SchematicContext) => Promise<void> | Observable<void>;
export interface TaskExecutorFactory<T> {
    readonly name: string;
    create(options?: T): Promise<TaskExecutor> | Observable<TaskExecutor>;
}
export interface TaskId {
    readonly id: number;
}
export interface TaskInfo {
    readonly id: number;
    readonly priority: number;
    readonly configuration: TaskConfiguration;
    readonly context: SchematicContext;
}
export declare class TaskScheduler {
    private _context;
    private _queue;
    private _taskIds;
    private static _taskIdCounter;
    constructor(_context: SchematicContext);
    private _calculatePriority(dependencies);
    private _mapDependencies(dependencies?);
    schedule<T>(taskConfiguration: TaskConfiguration<T>): TaskId;
    finalize(): ReadonlyArray<TaskInfo>;
}
