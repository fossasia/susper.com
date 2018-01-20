"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const of_1 = require("rxjs/observable/of");
const first_1 = require("rxjs/operators/first");
const map_1 = require("rxjs/operators/map");
const mergeMap_1 = require("rxjs/operators/mergeMap");
class InvalidInputOptions extends core_1.BaseException {
    // tslint:disable-next-line:no-any
    constructor(options, errors) {
        super(`Schematic input does not validate against the Schema: ${JSON.stringify(options)}\n`
            + `Errors:\n  ${errors.join('\n  ')}`);
    }
}
exports.InvalidInputOptions = InvalidInputOptions;
// tslint:disable-next-line:no-any
function _deepCopy(object) {
    const copy = {};
    for (const key of Object.keys(object)) {
        if (typeof object[key] == 'object') {
            copy[key] = _deepCopy(object[key]);
            break;
        }
        else {
            copy[key] = object[key];
        }
    }
    return copy;
}
// This can only be used in NodeJS.
function validateOptionsWithSchema(registry) {
    return (schematic, options) => {
        // Prevent a schematic from changing the options object by making a copy of it.
        options = _deepCopy(options);
        if (schematic.schema && schematic.schemaJson) {
            // Make a deep copy of options.
            return registry
                .compile(schematic.schemaJson)
                .pipe(mergeMap_1.mergeMap(validator => validator(options)), first_1.first(), map_1.map(result => {
                if (!result.success) {
                    throw new InvalidInputOptions(options, result.errors || ['Unknown reason.']);
                }
                return options;
            }));
        }
        return of_1.of(options);
    };
}
exports.validateOptionsWithSchema = validateOptionsWithSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLW9wdGlvbi10cmFuc2Zvcm0uanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy90b29scy9zY2hlbWEtb3B0aW9uLXRyYW5zZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUc4QjtBQUc5QiwyQ0FBd0Q7QUFDeEQsZ0RBQTZDO0FBQzdDLDRDQUF5QztBQUN6QyxzREFBbUQ7QUFPbkQseUJBQWlDLFNBQVEsb0JBQWE7SUFDcEQsa0NBQWtDO0lBQ2xDLFlBQVksT0FBWSxFQUFFLE1BQWdCO1FBQ3hDLEtBQUssQ0FBQyx5REFBeUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSTtjQUNwRixjQUFjLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7Q0FDRjtBQU5ELGtEQU1DO0FBR0Qsa0NBQWtDO0FBQ2xDLG1CQUFtRCxNQUFTO0lBQzFELE1BQU0sSUFBSSxHQUFHLEVBQU8sQ0FBQztJQUNyQixHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsS0FBSyxDQUFDO1FBQ1IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBR0QsbUNBQW1DO0FBQ25DLG1DQUEwQyxRQUErQjtJQUN2RSxNQUFNLENBQUMsQ0FBZSxTQUF3QixFQUFFLE9BQVUsRUFBaUIsRUFBRTtRQUMzRSwrRUFBK0U7UUFDL0UsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzdDLCtCQUErQjtZQUMvQixNQUFNLENBQUMsUUFBUTtpQkFDWixPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztpQkFDN0IsSUFBSSxDQUNILG1CQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsRUFDekMsYUFBSyxFQUFFLEVBQ1AsU0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDL0UsQ0FBQztnQkFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUNILENBQUM7UUFDTixDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUM7QUFDSixDQUFDO0FBeEJELDhEQXdCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIEJhc2VFeGNlcHRpb24sXG4gIHNjaGVtYSxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgU2NoZW1hdGljRGVzY3JpcHRpb24gfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XG5pbXBvcnQgeyBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzL2ZpcnN0JztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzL21hcCc7XG5pbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzL21lcmdlTWFwJztcbmltcG9ydCB7IEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzY3JpcHRpb24sIEZpbGVTeXN0ZW1TY2hlbWF0aWNEZXNjcmlwdGlvbiB9IGZyb20gJy4vZGVzY3JpcHRpb24nO1xuXG5leHBvcnQgdHlwZSBTY2hlbWF0aWNEZXNjID1cbiAgU2NoZW1hdGljRGVzY3JpcHRpb248RmlsZVN5c3RlbUNvbGxlY3Rpb25EZXNjcmlwdGlvbiwgRmlsZVN5c3RlbVNjaGVtYXRpY0Rlc2NyaXB0aW9uPjtcblxuXG5leHBvcnQgY2xhc3MgSW52YWxpZElucHV0T3B0aW9ucyBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IGFueSwgZXJyb3JzOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKGBTY2hlbWF0aWMgaW5wdXQgZG9lcyBub3QgdmFsaWRhdGUgYWdhaW5zdCB0aGUgU2NoZW1hOiAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMpfVxcbmBcbiAgICAgICAgKyBgRXJyb3JzOlxcbiAgJHtlcnJvcnMuam9pbignXFxuICAnKX1gKTtcbiAgfVxufVxuXG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbmZ1bmN0aW9uIF9kZWVwQ29weTxUIGV4dGVuZHMge1trZXk6IHN0cmluZ106IGFueX0+KG9iamVjdDogVCk6IFQge1xuICBjb25zdCBjb3B5ID0ge30gYXMgVDtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqZWN0KSkge1xuICAgIGlmICh0eXBlb2Ygb2JqZWN0W2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgIGNvcHlba2V5XSA9IF9kZWVwQ29weShvYmplY3Rba2V5XSk7XG4gICAgICBicmVhaztcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb3B5W2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29weTtcbn1cblxuXG4vLyBUaGlzIGNhbiBvbmx5IGJlIHVzZWQgaW4gTm9kZUpTLlxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlT3B0aW9uc1dpdGhTY2hlbWEocmVnaXN0cnk6IHNjaGVtYS5TY2hlbWFSZWdpc3RyeSkge1xuICByZXR1cm4gPFQgZXh0ZW5kcyB7fT4oc2NoZW1hdGljOiBTY2hlbWF0aWNEZXNjLCBvcHRpb25zOiBUKTogT2JzZXJ2YWJsZTxUPiA9PiB7XG4gICAgLy8gUHJldmVudCBhIHNjaGVtYXRpYyBmcm9tIGNoYW5naW5nIHRoZSBvcHRpb25zIG9iamVjdCBieSBtYWtpbmcgYSBjb3B5IG9mIGl0LlxuICAgIG9wdGlvbnMgPSBfZGVlcENvcHkob3B0aW9ucyk7XG5cbiAgICBpZiAoc2NoZW1hdGljLnNjaGVtYSAmJiBzY2hlbWF0aWMuc2NoZW1hSnNvbikge1xuICAgICAgLy8gTWFrZSBhIGRlZXAgY29weSBvZiBvcHRpb25zLlxuICAgICAgcmV0dXJuIHJlZ2lzdHJ5XG4gICAgICAgIC5jb21waWxlKHNjaGVtYXRpYy5zY2hlbWFKc29uKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBtZXJnZU1hcCh2YWxpZGF0b3IgPT4gdmFsaWRhdG9yKG9wdGlvbnMpKSxcbiAgICAgICAgICBmaXJzdCgpLFxuICAgICAgICAgIG1hcChyZXN1bHQgPT4ge1xuICAgICAgICAgICAgaWYgKCFyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZElucHV0T3B0aW9ucyhvcHRpb25zLCByZXN1bHQuZXJyb3JzIHx8IFsnVW5rbm93biByZWFzb24uJ10pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG9wdGlvbnMpO1xuICB9O1xufVxuIl19