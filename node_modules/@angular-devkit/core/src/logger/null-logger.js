"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const empty_1 = require("rxjs/observable/empty");
const logger_1 = require("./logger");
class NullLogger extends logger_1.Logger {
    constructor(parent = null) {
        super('', parent);
        this._observable = empty_1.empty();
    }
    asApi() {
        return {
            createChild: () => new NullLogger(this),
            log() { },
            debug() { },
            info() { },
            warn() { },
            error() { },
            fatal() { },
        };
    }
}
exports.NullLogger = NullLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbC1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvbG9nZ2VyL251bGwtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaURBQThDO0FBQzlDLHFDQUE2QztBQUc3QyxnQkFBd0IsU0FBUSxlQUFNO0lBQ3BDLFlBQVksU0FBd0IsSUFBSTtRQUN0QyxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxXQUFXLEdBQUcsYUFBSyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUs7UUFDSCxNQUFNLENBQUM7WUFDTCxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQ3ZDLEdBQUcsS0FBSSxDQUFDO1lBQ1IsS0FBSyxLQUFJLENBQUM7WUFDVixJQUFJLEtBQUksQ0FBQztZQUNULElBQUksS0FBSSxDQUFDO1lBQ1QsS0FBSyxLQUFJLENBQUM7WUFDVixLQUFLLEtBQUksQ0FBQztTQUNFLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBakJELGdDQWlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IExvZ2dlciwgTG9nZ2VyQXBpIH0gZnJvbSAnLi9sb2dnZXInO1xuXG5cbmV4cG9ydCBjbGFzcyBOdWxsTG9nZ2VyIGV4dGVuZHMgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3IocGFyZW50OiBMb2dnZXIgfCBudWxsID0gbnVsbCkge1xuICAgIHN1cGVyKCcnLCBwYXJlbnQpO1xuICAgIHRoaXMuX29ic2VydmFibGUgPSBlbXB0eSgpO1xuICB9XG5cbiAgYXNBcGkoKTogTG9nZ2VyQXBpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY3JlYXRlQ2hpbGQ6ICgpID0+IG5ldyBOdWxsTG9nZ2VyKHRoaXMpLFxuICAgICAgbG9nKCkge30sXG4gICAgICBkZWJ1ZygpIHt9LFxuICAgICAgaW5mbygpIHt9LFxuICAgICAgd2FybigpIHt9LFxuICAgICAgZXJyb3IoKSB7fSxcbiAgICAgIGZhdGFsKCkge30sXG4gICAgfSBhcyBMb2dnZXJBcGk7XG4gIH1cbn1cbiJdfQ==