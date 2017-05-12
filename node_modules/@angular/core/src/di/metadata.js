/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { makeDecorator, makeParamDecorator } from '../util/decorators';
/**
 * Inject decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Inject = makeParamDecorator('Inject', [['token', undefined]]);
/**
 * Optional decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Optional = makeParamDecorator('Optional', []);
/**
 * Injectable decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Injectable = (makeDecorator('Injectable', []));
/**
 * Self decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Self = makeParamDecorator('Self', []);
/**
 * SkipSelf decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ SkipSelf = makeParamDecorator('SkipSelf', []);
/**
 * Host decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export var /** @type {?} */ Host = makeParamDecorator('Host', []);
//# sourceMappingURL=metadata.js.map