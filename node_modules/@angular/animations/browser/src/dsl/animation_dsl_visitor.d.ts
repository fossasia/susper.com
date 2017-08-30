/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationAnimateChildMetadata, AnimationAnimateMetadata, AnimationAnimateRefMetadata, AnimationGroupMetadata, AnimationKeyframesSequenceMetadata, AnimationMetadata, AnimationQueryMetadata, AnimationReferenceMetadata, AnimationSequenceMetadata, AnimationStaggerMetadata, AnimationStateMetadata, AnimationStyleMetadata, AnimationTransitionMetadata, AnimationTriggerMetadata } from '@angular/animations';
export interface AnimationDslVisitor {
    visitTrigger(ast: AnimationTriggerMetadata, context: any): any;
    visitState(ast: AnimationStateMetadata, context: any): any;
    visitTransition(ast: AnimationTransitionMetadata, context: any): any;
    visitSequence(ast: AnimationSequenceMetadata, context: any): any;
    visitGroup(ast: AnimationGroupMetadata, context: any): any;
    visitAnimate(ast: AnimationAnimateMetadata, context: any): any;
    visitStyle(ast: AnimationStyleMetadata, context: any): any;
    visitKeyframes(ast: AnimationKeyframesSequenceMetadata, context: any): any;
    visitReference(ast: AnimationReferenceMetadata, context: any): any;
    visitAnimateChild(ast: AnimationAnimateChildMetadata, context: any): any;
    visitAnimateRef(ast: AnimationAnimateRefMetadata, context: any): any;
    visitQuery(ast: AnimationQueryMetadata, context: any): any;
    visitStagger(ast: AnimationStaggerMetadata, context: any): any;
}
export declare function visitAnimationNode(visitor: AnimationDslVisitor, node: AnimationMetadata, context: any): any;
