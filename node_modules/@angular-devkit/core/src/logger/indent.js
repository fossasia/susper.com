"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const operators_1 = require("rxjs/operators");
const logger_1 = require("./logger");
/**
 * Keep an map of indentation => array of indentations based on the level.
 * This is to optimize calculating the prefix based on the indentation itself. Since most logs
 * come from similar levels, and with similar indentation strings, this will be shared by all
 * loggers. Also, string concatenation is expensive so performing concats for every log entries
 * is expensive; this alleviates it.
 */
const indentationMap = {};
class IndentLogger extends logger_1.Logger {
    constructor(name, parent = null, indentation = '  ') {
        super(name, parent);
        indentationMap[indentation] = indentationMap[indentation] || [''];
        const indentMap = indentationMap[indentation];
        this._observable = this._observable.pipe(operators_1.map(entry => {
            const l = entry.path.length;
            if (l >= indentMap.length) {
                let current = indentMap[indentMap.length - 1];
                while (l >= indentMap.length) {
                    current += indentation;
                    indentMap.push(current);
                }
            }
            entry.message = indentMap[l] + entry.message.split(/\n/).join('\n' + indentMap[l]);
            return entry;
        }));
    }
}
exports.IndentLogger = IndentLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2xvZ2dlci9pbmRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw4Q0FBcUM7QUFDckMscUNBQWtDO0FBR2xDOzs7Ozs7R0FNRztBQUNILE1BQU0sY0FBYyxHQUEwQyxFQUFFLENBQUM7QUFHakUsa0JBQTBCLFNBQVEsZUFBTTtJQUN0QyxZQUFZLElBQVksRUFBRSxTQUF3QixJQUFJLEVBQUUsV0FBVyxHQUFHLElBQUk7UUFDeEUsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwQixjQUFjLENBQUMsV0FBVyxDQUFDLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEUsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ25ELE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLE9BQU8sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDN0IsT0FBTyxJQUFJLFdBQVcsQ0FBQztvQkFDdkIsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUIsQ0FBQztZQUNILENBQUM7WUFFRCxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRW5GLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUNGO0FBdEJELG9DQXNCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vbG9nZ2VyJztcblxuXG4vKipcbiAqIEtlZXAgYW4gbWFwIG9mIGluZGVudGF0aW9uID0+IGFycmF5IG9mIGluZGVudGF0aW9ucyBiYXNlZCBvbiB0aGUgbGV2ZWwuXG4gKiBUaGlzIGlzIHRvIG9wdGltaXplIGNhbGN1bGF0aW5nIHRoZSBwcmVmaXggYmFzZWQgb24gdGhlIGluZGVudGF0aW9uIGl0c2VsZi4gU2luY2UgbW9zdCBsb2dzXG4gKiBjb21lIGZyb20gc2ltaWxhciBsZXZlbHMsIGFuZCB3aXRoIHNpbWlsYXIgaW5kZW50YXRpb24gc3RyaW5ncywgdGhpcyB3aWxsIGJlIHNoYXJlZCBieSBhbGxcbiAqIGxvZ2dlcnMuIEFsc28sIHN0cmluZyBjb25jYXRlbmF0aW9uIGlzIGV4cGVuc2l2ZSBzbyBwZXJmb3JtaW5nIGNvbmNhdHMgZm9yIGV2ZXJ5IGxvZyBlbnRyaWVzXG4gKiBpcyBleHBlbnNpdmU7IHRoaXMgYWxsZXZpYXRlcyBpdC5cbiAqL1xuY29uc3QgaW5kZW50YXRpb25NYXA6IHtbaW5kZW50YXRpb25UeXBlOiBzdHJpbmddOiBzdHJpbmdbXX0gPSB7fTtcblxuXG5leHBvcnQgY2xhc3MgSW5kZW50TG9nZ2VyIGV4dGVuZHMgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBwYXJlbnQ6IExvZ2dlciB8IG51bGwgPSBudWxsLCBpbmRlbnRhdGlvbiA9ICcgICcpIHtcbiAgICBzdXBlcihuYW1lLCBwYXJlbnQpO1xuXG4gICAgaW5kZW50YXRpb25NYXBbaW5kZW50YXRpb25dID0gaW5kZW50YXRpb25NYXBbaW5kZW50YXRpb25dIHx8IFsnJ107XG4gICAgY29uc3QgaW5kZW50TWFwID0gaW5kZW50YXRpb25NYXBbaW5kZW50YXRpb25dO1xuXG4gICAgdGhpcy5fb2JzZXJ2YWJsZSA9IHRoaXMuX29ic2VydmFibGUucGlwZShtYXAoZW50cnkgPT4ge1xuICAgICAgY29uc3QgbCA9IGVudHJ5LnBhdGgubGVuZ3RoO1xuICAgICAgaWYgKGwgPj0gaW5kZW50TWFwLmxlbmd0aCkge1xuICAgICAgICBsZXQgY3VycmVudCA9IGluZGVudE1hcFtpbmRlbnRNYXAubGVuZ3RoIC0gMV07XG4gICAgICAgIHdoaWxlIChsID49IGluZGVudE1hcC5sZW5ndGgpIHtcbiAgICAgICAgICBjdXJyZW50ICs9IGluZGVudGF0aW9uO1xuICAgICAgICAgIGluZGVudE1hcC5wdXNoKGN1cnJlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVudHJ5Lm1lc3NhZ2UgPSBpbmRlbnRNYXBbbF0gKyBlbnRyeS5tZXNzYWdlLnNwbGl0KC9cXG4vKS5qb2luKCdcXG4nICsgaW5kZW50TWFwW2xdKTtcblxuICAgICAgcmV0dXJuIGVudHJ5O1xuICAgIH0pKTtcbiAgfVxufVxuIl19