/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, QueryList, ElementRef, TemplateRef, ChangeDetectorRef, OnChanges } from '@angular/core';
import { CdkStepLabel } from './step-label';
import { AbstractControl } from '@angular/forms';
import { Directionality } from '@angular/cdk/bidi';
/**
 * Position state of the content of each step in stepper that is used for transitioning
 * the content into correct position upon step selection change.
 */
export declare type StepContentPositionState = 'previous' | 'current' | 'next';
/** Change event emitted on selection changes. */
export declare class StepperSelectionEvent {
    /** Index of the step now selected. */
    selectedIndex: number;
    /** Index of the step previously selected. */
    previouslySelectedIndex: number;
    /** The step instance now selected. */
    selectedStep: CdkStep;
    /** The step instance previously selected. */
    previouslySelectedStep: CdkStep;
}
export declare class CdkStep implements OnChanges {
    private _stepper;
    /** Template for step label if it exists. */
    stepLabel: CdkStepLabel;
    /** Template for step content. */
    content: TemplateRef<any>;
    /** The top level abstract control of the step. */
    stepControl: AbstractControl;
    /** Whether user has seen the expanded step content or not. */
    interacted: boolean;
    /** Label of the step. */
    label: string;
    editable: any;
    private _editable;
    /** Whether the completion of step is optional or not. */
    optional: any;
    private _optional;
    /** Return whether step is completed or not. */
    completed: any;
    private _customCompleted;
    private readonly _defaultCompleted;
    constructor(_stepper: CdkStepper);
    /** Selects this step component. */
    select(): void;
    ngOnChanges(): void;
}
export declare class CdkStepper {
    private _dir;
    private _changeDetectorRef;
    /** The list of step components that the stepper is holding. */
    _steps: QueryList<CdkStep>;
    /** The list of step headers of the steps in the stepper. */
    _stepHeader: QueryList<ElementRef>;
    /** Whether the validity of previous steps should be checked or not. */
    linear: any;
    private _linear;
    /** The index of the selected step. */
    selectedIndex: number;
    private _selectedIndex;
    /** The step that is selected. */
    selected: CdkStep;
    /** Event emitted when the selected step has changed. */
    selectionChange: EventEmitter<StepperSelectionEvent>;
    /** The index of the step that the focus can be set. */
    _focusIndex: number;
    /** Used to track unique ID for each stepper component. */
    _groupId: number;
    constructor(_dir: Directionality, _changeDetectorRef: ChangeDetectorRef);
    /** Selects and focuses the next step in list. */
    next(): void;
    /** Selects and focuses the previous step in list. */
    previous(): void;
    /** Returns a unique id for each step label element. */
    _getStepLabelId(i: number): string;
    /** Returns unique id for each step content element. */
    _getStepContentId(i: number): string;
    /** Marks the component to be change detected. */
    _stateChanged(): void;
    /** Returns position state of the step with the given index. */
    _getAnimationDirection(index: number): StepContentPositionState;
    /** Returns the type of icon to be displayed. */
    _getIndicatorType(index: number): 'number' | 'edit' | 'done';
    private _emitStepperSelectionEvent(newIndex);
    _onKeydown(event: KeyboardEvent): void;
    private _focusNextStep();
    private _focusPreviousStep();
    private _focusStep(index);
    private _anyControlsInvalid(index);
    private _layoutDirection();
}
