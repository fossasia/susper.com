/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimateTimings, AnimationOptions, ɵStyleData } from '@angular/animations';
export interface AstVisitor {
    visitTrigger(ast: TriggerAst, context: any): any;
    visitState(ast: StateAst, context: any): any;
    visitTransition(ast: TransitionAst, context: any): any;
    visitSequence(ast: SequenceAst, context: any): any;
    visitGroup(ast: GroupAst, context: any): any;
    visitAnimate(ast: AnimateAst, context: any): any;
    visitStyle(ast: StyleAst, context: any): any;
    visitKeyframes(ast: KeyframesAst, context: any): any;
    visitReference(ast: ReferenceAst, context: any): any;
    visitAnimateChild(ast: AnimateChildAst, context: any): any;
    visitAnimateRef(ast: AnimateRefAst, context: any): any;
    visitQuery(ast: QueryAst, context: any): any;
    visitStagger(ast: StaggerAst, context: any): any;
    visitTiming(ast: TimingAst, context: any): any;
}
export declare abstract class Ast {
    abstract visit(ast: AstVisitor, context: any): any;
    options: AnimationOptions;
    readonly params: {
        [name: string]: any;
    } | null;
}
export declare class TriggerAst extends Ast {
    name: string;
    states: StateAst[];
    transitions: TransitionAst[];
    queryCount: number;
    depCount: number;
    constructor(name: string, states: StateAst[], transitions: TransitionAst[]);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class StateAst extends Ast {
    name: string;
    style: StyleAst;
    constructor(name: string, style: StyleAst);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class TransitionAst extends Ast {
    matchers: ((fromState: string, toState: string) => boolean)[];
    animation: Ast;
    queryCount: number;
    depCount: number;
    constructor(matchers: ((fromState: string, toState: string) => boolean)[], animation: Ast);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class SequenceAst extends Ast {
    steps: Ast[];
    constructor(steps: Ast[]);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class GroupAst extends Ast {
    steps: Ast[];
    constructor(steps: Ast[]);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class AnimateAst extends Ast {
    timings: TimingAst;
    style: StyleAst | KeyframesAst;
    constructor(timings: TimingAst, style: StyleAst | KeyframesAst);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class StyleAst extends Ast {
    styles: (ɵStyleData | string)[];
    easing: string | null;
    offset: number | null;
    isEmptyStep: boolean;
    containsDynamicStyles: boolean;
    constructor(styles: (ɵStyleData | string)[], easing: string | null, offset: number | null);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class KeyframesAst extends Ast {
    styles: StyleAst[];
    constructor(styles: StyleAst[]);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class ReferenceAst extends Ast {
    animation: Ast;
    constructor(animation: Ast);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class AnimateChildAst extends Ast {
    constructor();
    visit(visitor: AstVisitor, context: any): any;
}
export declare class AnimateRefAst extends Ast {
    animation: ReferenceAst;
    constructor(animation: ReferenceAst);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class QueryAst extends Ast {
    selector: string;
    limit: number;
    optional: boolean;
    includeSelf: boolean;
    animation: Ast;
    originalSelector: string;
    constructor(selector: string, limit: number, optional: boolean, includeSelf: boolean, animation: Ast);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class StaggerAst extends Ast {
    timings: AnimateTimings;
    animation: Ast;
    constructor(timings: AnimateTimings, animation: Ast);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class TimingAst extends Ast {
    duration: number;
    delay: number;
    easing: string | null;
    constructor(duration: number, delay?: number, easing?: string | null);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class DynamicTimingAst extends TimingAst {
    value: string;
    constructor(value: string);
    visit(visitor: AstVisitor, context: any): any;
}
