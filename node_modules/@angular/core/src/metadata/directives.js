/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy } from '../change_detection/constants';
import { makeDecorator, makePropDecorator } from '../util/decorators';
/**
 * Directive decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Directive = (makeDecorator('Directive', {
    selector: undefined,
    inputs: undefined,
    outputs: undefined,
    host: undefined,
    providers: undefined,
    exportAs: undefined,
    queries: undefined
}));
/**
 * Component decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Component = (makeDecorator('Component', {
    selector: undefined,
    inputs: undefined,
    outputs: undefined,
    host: undefined,
    exportAs: undefined,
    moduleId: undefined,
    providers: undefined,
    viewProviders: undefined,
    changeDetection: ChangeDetectionStrategy.Default,
    queries: undefined,
    templateUrl: undefined,
    template: undefined,
    styleUrls: undefined,
    styles: undefined,
    animations: undefined,
    encapsulation: undefined,
    interpolation: undefined,
    entryComponents: undefined
}, Directive));
/**
 * Pipe decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Pipe = (makeDecorator('Pipe', {
    name: undefined,
    pure: true,
}));
/**
 * Input decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Input = makePropDecorator('Input', [['bindingPropertyName', undefined]]);
/**
 * Output decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Output = makePropDecorator('Output', [['bindingPropertyName', undefined]]);
/**
 * HostBinding decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ HostBinding = makePropDecorator('HostBinding', [['hostPropertyName', undefined]]);
/**
 * HostListener decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ HostListener = makePropDecorator('HostListener', [['eventName', undefined], ['args', []]]);
//# sourceMappingURL=directives.js.map