/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationPlayer } from '@angular/core';
import { AnimationKeyframe, AnimationStyles } from '../private_import_core';
import { AnimationDriver } from './animation_driver';
import { WebAnimationsPlayer } from './web_animations_player';
export declare class WebAnimationsDriver implements AnimationDriver {
    animate(element: any, startingStyles: AnimationStyles, keyframes: AnimationKeyframe[], duration: number, delay: number, easing: string, previousPlayers?: AnimationPlayer[]): WebAnimationsPlayer;
}
