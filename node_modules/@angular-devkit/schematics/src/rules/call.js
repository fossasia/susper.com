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
const Observable_1 = require("rxjs/Observable");
const virtual_1 = require("../tree/virtual");
/**
 * When a rule or source returns an invalid value.
 */
class InvalidRuleResultException extends core_1.BaseException {
    constructor(value) {
        let v = 'Unknown Type';
        if (value === undefined) {
            v = 'undefined';
        }
        else if (value === null) {
            v = 'null';
        }
        else if (typeof value == 'function') {
            v = `Function()`;
        }
        else if (typeof value != 'object') {
            v = `${typeof value}(${JSON.stringify(value)})`;
        }
        else {
            if (Object.getPrototypeOf(value) == Object) {
                v = `Object(${JSON.stringify(value)})`;
            }
            else if (value.constructor) {
                v = `Instance of class ${value.constructor.name}`;
            }
            else {
                v = 'Unknown Object';
            }
        }
        super(`Invalid rule or source result: ${v}.`);
    }
}
exports.InvalidRuleResultException = InvalidRuleResultException;
function callSource(source, context) {
    const result = source(context);
    if (result instanceof virtual_1.VirtualTree) {
        return Observable_1.Observable.of(result);
    }
    else if (result instanceof Observable_1.Observable) {
        return result;
    }
    else {
        throw new InvalidRuleResultException(result);
    }
}
exports.callSource = callSource;
function callRule(rule, input, context) {
    return input.mergeMap(inputTree => {
        const result = rule(inputTree, context);
        if (result instanceof virtual_1.VirtualTree) {
            return Observable_1.Observable.of(result);
        }
        else if (result instanceof Observable_1.Observable) {
            return result;
        }
        else if (result === undefined) {
            return Observable_1.Observable.of(inputTree);
        }
        else {
            throw new InvalidRuleResultException(result);
        }
    });
}
exports.callRule = callRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9ydWxlcy9jYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQXFEO0FBQ3JELGdEQUE2QztBQUc3Qyw2Q0FBOEM7QUFHOUM7O0dBRUc7QUFDSCxnQ0FBd0MsU0FBUSxvQkFBYTtJQUMzRCxZQUFZLEtBQVU7UUFDcEIsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsR0FBRyxXQUFXLENBQUM7UUFDbEIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ2IsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLENBQUMsR0FBRyxZQUFZLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsR0FBRyxHQUFHLE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNsRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLENBQUMsR0FBRyxVQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUN6QyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixDQUFDLEdBQUcscUJBQXFCLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztZQUN2QixDQUFDO1FBQ0gsQ0FBQztRQUNELEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0Y7QUF0QkQsZ0VBc0JDO0FBR0Qsb0JBQTJCLE1BQWMsRUFBRSxPQUF5QjtJQUNsRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFL0IsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLHFCQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSx1QkFBVSxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sSUFBSSwwQkFBMEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0FBQ0gsQ0FBQztBQVZELGdDQVVDO0FBR0Qsa0JBQXlCLElBQVUsRUFDVixLQUF1QixFQUN2QixPQUF5QjtJQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTO1FBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEMsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLHFCQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFjLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSx1QkFBVSxDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLHVCQUFVLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sSUFBSSwwQkFBMEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBaEJELDRCQWdCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IEJhc2VFeGNlcHRpb24gfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFJ1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFNvdXJjZSB9IGZyb20gJy4uL2VuZ2luZS9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgVHJlZSB9IGZyb20gJy4uL3RyZWUvaW50ZXJmYWNlJztcbmltcG9ydCB7IFZpcnR1YWxUcmVlIH0gZnJvbSAnLi4vdHJlZS92aXJ0dWFsJztcblxuXG4vKipcbiAqIFdoZW4gYSBydWxlIG9yIHNvdXJjZSByZXR1cm5zIGFuIGludmFsaWQgdmFsdWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnZhbGlkUnVsZVJlc3VsdEV4Y2VwdGlvbiBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZT86IHt9KSB7XG4gICAgbGV0IHYgPSAnVW5rbm93biBUeXBlJztcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdiA9ICd1bmRlZmluZWQnO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHYgPSAnbnVsbCc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdiA9IGBGdW5jdGlvbigpYDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnb2JqZWN0Jykge1xuICAgICAgdiA9IGAke3R5cGVvZiB2YWx1ZX0oJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9KWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpID09IE9iamVjdCkge1xuICAgICAgICB2ID0gYE9iamVjdCgke0pTT04uc3RyaW5naWZ5KHZhbHVlKX0pYDtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgdiA9IGBJbnN0YW5jZSBvZiBjbGFzcyAke3ZhbHVlLmNvbnN0cnVjdG9yLm5hbWV9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHYgPSAnVW5rbm93biBPYmplY3QnO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlcihgSW52YWxpZCBydWxlIG9yIHNvdXJjZSByZXN1bHQ6ICR7dn0uYCk7XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY2FsbFNvdXJjZShzb3VyY2U6IFNvdXJjZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCk6IE9ic2VydmFibGU8VHJlZT4ge1xuICBjb25zdCByZXN1bHQgPSBzb3VyY2UoY29udGV4dCk7XG5cbiAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFZpcnR1YWxUcmVlKSB7XG4gICAgcmV0dXJuIE9ic2VydmFibGUub2YocmVzdWx0KTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZFJ1bGVSZXN1bHRFeGNlcHRpb24ocmVzdWx0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxsUnVsZShydWxlOiBSdWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBPYnNlcnZhYmxlPFRyZWU+LFxuICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpOiBPYnNlcnZhYmxlPFRyZWU+IHtcbiAgcmV0dXJuIGlucHV0Lm1lcmdlTWFwKGlucHV0VHJlZSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gcnVsZShpbnB1dFRyZWUsIGNvbnRleHQpO1xuXG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFZpcnR1YWxUcmVlKSB7XG4gICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZihyZXN1bHQgYXMgVHJlZSk7XG4gICAgfSBlbHNlIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLm9mKGlucHV0VHJlZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkUnVsZVJlc3VsdEV4Y2VwdGlvbihyZXN1bHQpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=