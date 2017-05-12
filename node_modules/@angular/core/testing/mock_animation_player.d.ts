/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationPlayer } from '@angular/core';
export declare class MockAnimationPlayer implements AnimationPlayer {
    startingStyles: {
        [key: string]: string | number;
    };
    keyframes: Array<[number, {
        [style: string]: string | number;
    }]>;
    private _onDoneFns;
    private _onStartFns;
    private _finished;
    private _destroyed;
    private _started;
    parentPlayer: AnimationPlayer;
    previousStyles: {
        [styleName: string]: string | number;
    };
    log: any[];
    constructor(startingStyles?: {
        [key: string]: string | number;
    }, keyframes?: Array<[number, {
        [style: string]: string | number;
    }]>, previousPlayers?: AnimationPlayer[]);
    private _onFinish();
    init(): void;
    onDone(fn: () => void): void;
    onStart(fn: () => void): void;
    hasStarted(): boolean;
    play(): void;
    pause(): void;
    restart(): void;
    finish(): void;
    reset(): void;
    destroy(): void;
    setPosition(p: number): void;
    getPosition(): number;
    private _captureStyles();
}
