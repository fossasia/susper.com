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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbC1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2xvZ2dlci9udWxsLWxvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlEQUE4QztBQUM5QyxxQ0FBNkM7QUFHN0MsZ0JBQXdCLFNBQVEsZUFBTTtJQUNwQyxZQUFZLFNBQXdCLElBQUk7UUFDdEMsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLGFBQUssRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLO1FBQ0gsTUFBTSxDQUFDO1lBQ0wsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQztZQUN2QyxHQUFHLEtBQUksQ0FBQztZQUNSLEtBQUssS0FBSSxDQUFDO1lBQ1YsSUFBSSxLQUFJLENBQUM7WUFDVCxJQUFJLEtBQUksQ0FBQztZQUNULEtBQUssS0FBSSxDQUFDO1lBQ1YsS0FBSyxLQUFJLENBQUM7U0FDRSxDQUFDO0lBQ2pCLENBQUM7Q0FDRjtBQWpCRCxnQ0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBMb2dnZXIsIExvZ2dlckFwaSB9IGZyb20gJy4vbG9nZ2VyJztcblxuXG5leHBvcnQgY2xhc3MgTnVsbExvZ2dlciBleHRlbmRzIExvZ2dlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogTG9nZ2VyIHwgbnVsbCA9IG51bGwpIHtcbiAgICBzdXBlcignJywgcGFyZW50KTtcbiAgICB0aGlzLl9vYnNlcnZhYmxlID0gZW1wdHkoKTtcbiAgfVxuXG4gIGFzQXBpKCk6IExvZ2dlckFwaSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNyZWF0ZUNoaWxkOiAoKSA9PiBuZXcgTnVsbExvZ2dlcih0aGlzKSxcbiAgICAgIGxvZygpIHt9LFxuICAgICAgZGVidWcoKSB7fSxcbiAgICAgIGluZm8oKSB7fSxcbiAgICAgIHdhcm4oKSB7fSxcbiAgICAgIGVycm9yKCkge30sXG4gICAgICBmYXRhbCgpIHt9LFxuICAgIH0gYXMgTG9nZ2VyQXBpO1xuICB9XG59XG4iXX0=