"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/empty");
const logger_1 = require("./logger");
class NullLogger extends logger_1.Logger {
    constructor(parent = null) {
        super('', parent);
        this._observable = Observable_1.Observable.empty();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbC1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvbG9nZ2VyL251bGwtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsZ0RBQTZDO0FBQzdDLHFDQUFtQztBQUNuQyxxQ0FBNkM7QUFHN0MsZ0JBQXdCLFNBQVEsZUFBTTtJQUNwQyxZQUFZLFNBQXdCLElBQUk7UUFDdEMsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLHVCQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVELEtBQUs7UUFDSCxNQUFNLENBQUM7WUFDTCxXQUFXLEVBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDdkMsR0FBRyxLQUFJLENBQUM7WUFDUixLQUFLLEtBQUksQ0FBQztZQUNWLElBQUksS0FBSSxDQUFDO1lBQ1QsSUFBSSxLQUFJLENBQUM7WUFDVCxLQUFLLEtBQUksQ0FBQztZQUNWLEtBQUssS0FBSSxDQUFDO1NBQ0UsQ0FBQztJQUNqQixDQUFDO0NBQ0Y7QUFqQkQsZ0NBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgJ3J4anMvYWRkL29ic2VydmFibGUvZW1wdHknO1xuaW1wb3J0IHsgTG9nZ2VyLCBMb2dnZXJBcGkgfSBmcm9tICcuL2xvZ2dlcic7XG5cblxuZXhwb3J0IGNsYXNzIE51bGxMb2dnZXIgZXh0ZW5kcyBMb2dnZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IExvZ2dlciB8IG51bGwgPSBudWxsKSB7XG4gICAgc3VwZXIoJycsIHBhcmVudCk7XG4gICAgdGhpcy5fb2JzZXJ2YWJsZSA9IE9ic2VydmFibGUuZW1wdHkoKTtcbiAgfVxuXG4gIGFzQXBpKCk6IExvZ2dlckFwaSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNyZWF0ZUNoaWxkOiAoKSA9PiBuZXcgTnVsbExvZ2dlcih0aGlzKSxcbiAgICAgIGxvZygpIHt9LFxuICAgICAgZGVidWcoKSB7fSxcbiAgICAgIGluZm8oKSB7fSxcbiAgICAgIHdhcm4oKSB7fSxcbiAgICAgIGVycm9yKCkge30sXG4gICAgICBmYXRhbCgpIHt9LFxuICAgIH0gYXMgTG9nZ2VyQXBpO1xuICB9XG59XG4iXX0=