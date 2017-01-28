/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * JS version of browser APIs. This library can only run in the browser.
 */
var /** @type {?} */ win = typeof window !== 'undefined' && window || ({});
export { win as window };
export var /** @type {?} */ document = win.document;
export var /** @type {?} */ location = win.location;
export var /** @type {?} */ gc = win['gc'] ? function () { return win['gc'](); } : function () { return null; };
export var /** @type {?} */ performance = win['performance'] ? win['performance'] : null;
export var /** @type {?} */ Event = win['Event'];
export var /** @type {?} */ MouseEvent = win['MouseEvent'];
export var /** @type {?} */ KeyboardEvent = win['KeyboardEvent'];
export var /** @type {?} */ EventTarget = win['EventTarget'];
export var /** @type {?} */ History = win['History'];
export var /** @type {?} */ Location = win['Location'];
export var /** @type {?} */ EventListener = win['EventListener'];
//# sourceMappingURL=browser.js.map