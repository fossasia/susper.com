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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLW9wdGlvbi10cmFuc2Zvcm0uanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L3NjaGVtYXRpY3MvdG9vbHMvc2NoZW1hLW9wdGlvbi10cmFuc2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FHOEI7QUFFOUIsMkNBQXdEO0FBQ3hELGdEQUE2QztBQUM3Qyw0Q0FBeUM7QUFDekMsc0RBQW1EO0FBUW5ELHlCQUFpQyxTQUFRLG9CQUFhO0lBQ3BELGtDQUFrQztJQUNsQyxZQUFZLE9BQVksRUFBRSxNQUFnQjtRQUN4QyxLQUFLLENBQUMseURBQXlELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUk7Y0FDcEYsY0FBYyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0NBQ0Y7QUFORCxrREFNQztBQUdELGtDQUFrQztBQUNsQyxtQkFBbUQsTUFBUztJQUMxRCxNQUFNLElBQUksR0FBRyxFQUFPLENBQUM7SUFDckIsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25DLEtBQUssQ0FBQztRQUNSLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUdELG1DQUFtQztBQUNuQyxtQ0FBMEMsUUFBK0I7SUFDdkUsTUFBTSxDQUFDLENBQWUsU0FBd0IsRUFBRSxPQUFVLEVBQWlCLEVBQUU7UUFDM0UsK0VBQStFO1FBQy9FLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0IsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM3QywrQkFBK0I7WUFDL0IsTUFBTSxDQUFDLFFBQVE7aUJBQ1osT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7aUJBQzdCLElBQUksQ0FDSCxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQ3pDLGFBQUssRUFBRSxFQUNQLFNBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDWCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNwQixNQUFNLElBQUksbUJBQW1CLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLENBQUM7Z0JBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FDSCxDQUFDO1FBQ04sQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQXhCRCw4REF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBCYXNlRXhjZXB0aW9uLFxuICBzY2hlbWEsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgb2YgYXMgb2JzZXJ2YWJsZU9mIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL29mJztcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMvZmlyc3QnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMvbWFwJztcbmltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMvbWVyZ2VNYXAnO1xuaW1wb3J0IHsgU2NoZW1hdGljRGVzY3JpcHRpb24gfSBmcm9tICcuLi9zcmMnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbUNvbGxlY3Rpb25EZXNjcmlwdGlvbiwgRmlsZVN5c3RlbVNjaGVtYXRpY0Rlc2NyaXB0aW9uIH0gZnJvbSAnLi9kZXNjcmlwdGlvbic7XG5cbmV4cG9ydCB0eXBlIFNjaGVtYXRpY0Rlc2MgPVxuICBTY2hlbWF0aWNEZXNjcmlwdGlvbjxGaWxlU3lzdGVtQ29sbGVjdGlvbkRlc2NyaXB0aW9uLCBGaWxlU3lzdGVtU2NoZW1hdGljRGVzY3JpcHRpb24+O1xuXG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkSW5wdXRPcHRpb25zIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgY29uc3RydWN0b3Iob3B0aW9uczogYW55LCBlcnJvcnM6IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIoYFNjaGVtYXRpYyBpbnB1dCBkb2VzIG5vdCB2YWxpZGF0ZSBhZ2FpbnN0IHRoZSBTY2hlbWE6ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucyl9XFxuYFxuICAgICAgICArIGBFcnJvcnM6XFxuICAke2Vycm9ycy5qb2luKCdcXG4gICcpfWApO1xuICB9XG59XG5cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuZnVuY3Rpb24gX2RlZXBDb3B5PFQgZXh0ZW5kcyB7W2tleTogc3RyaW5nXTogYW55fT4ob2JqZWN0OiBUKTogVCB7XG4gIGNvbnN0IGNvcHkgPSB7fSBhcyBUO1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3QpKSB7XG4gICAgaWYgKHR5cGVvZiBvYmplY3Rba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgY29weVtrZXldID0gX2RlZXBDb3B5KG9iamVjdFtrZXldKTtcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvcHlba2V5XSA9IG9iamVjdFtrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3B5O1xufVxuXG5cbi8vIFRoaXMgY2FuIG9ubHkgYmUgdXNlZCBpbiBOb2RlSlMuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVPcHRpb25zV2l0aFNjaGVtYShyZWdpc3RyeTogc2NoZW1hLlNjaGVtYVJlZ2lzdHJ5KSB7XG4gIHJldHVybiA8VCBleHRlbmRzIHt9PihzY2hlbWF0aWM6IFNjaGVtYXRpY0Rlc2MsIG9wdGlvbnM6IFQpOiBPYnNlcnZhYmxlPFQ+ID0+IHtcbiAgICAvLyBQcmV2ZW50IGEgc2NoZW1hdGljIGZyb20gY2hhbmdpbmcgdGhlIG9wdGlvbnMgb2JqZWN0IGJ5IG1ha2luZyBhIGNvcHkgb2YgaXQuXG4gICAgb3B0aW9ucyA9IF9kZWVwQ29weShvcHRpb25zKTtcblxuICAgIGlmIChzY2hlbWF0aWMuc2NoZW1hICYmIHNjaGVtYXRpYy5zY2hlbWFKc29uKSB7XG4gICAgICAvLyBNYWtlIGEgZGVlcCBjb3B5IG9mIG9wdGlvbnMuXG4gICAgICByZXR1cm4gcmVnaXN0cnlcbiAgICAgICAgLmNvbXBpbGUoc2NoZW1hdGljLnNjaGVtYUpzb24pXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIG1lcmdlTWFwKHZhbGlkYXRvciA9PiB2YWxpZGF0b3Iob3B0aW9ucykpLFxuICAgICAgICAgIGZpcnN0KCksXG4gICAgICAgICAgbWFwKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSW5wdXRPcHRpb25zKG9wdGlvbnMsIHJlc3VsdC5lcnJvcnMgfHwgWydVbmtub3duIHJlYXNvbi4nXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBvYnNlcnZhYmxlT2Yob3B0aW9ucyk7XG4gIH07XG59XG4iXX0=