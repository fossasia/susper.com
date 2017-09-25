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
    return input.mergeMap(i => {
        const result = rule(i, context);
        if (result instanceof virtual_1.VirtualTree) {
            return Observable_1.Observable.of(result);
        }
        else if (result instanceof Observable_1.Observable) {
            return result;
        }
        else {
            throw new InvalidRuleResultException(result);
        }
    });
}
exports.callRule = callRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9ydWxlcy9jYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQXFEO0FBQ3JELGdEQUE2QztBQUc3Qyw2Q0FBOEM7QUFHOUM7O0dBRUc7QUFDSCxnQ0FBd0MsU0FBUSxvQkFBYTtJQUMzRCxZQUFZLEtBQVM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsR0FBRyxXQUFXLENBQUM7UUFDbEIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ2IsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLENBQUMsR0FBRyxZQUFZLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsR0FBRyxHQUFHLE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNsRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLENBQUMsR0FBRyxVQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUN6QyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixDQUFDLEdBQUcscUJBQXFCLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztZQUN2QixDQUFDO1FBQ0gsQ0FBQztRQUNELEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0Y7QUF0QkQsZ0VBc0JDO0FBR0Qsb0JBQTJCLE1BQWMsRUFBRSxPQUF5QjtJQUNsRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFL0IsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLHFCQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSx1QkFBVSxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sSUFBSSwwQkFBMEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0FBQ0gsQ0FBQztBQVZELGdDQVVDO0FBR0Qsa0JBQXlCLElBQVUsRUFDVixLQUF1QixFQUN2QixPQUF5QjtJQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFaEMsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLHFCQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFjLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSx1QkFBVSxDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sSUFBSSwwQkFBMEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBZEQsNEJBY0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBCYXNlRXhjZXB0aW9uIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBSdWxlLCBTY2hlbWF0aWNDb250ZXh0LCBTb3VyY2UgfSBmcm9tICcuLi9lbmdpbmUvaW50ZXJmYWNlJztcbmltcG9ydCB7IFRyZWUgfSBmcm9tICcuLi90cmVlL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBWaXJ0dWFsVHJlZSB9IGZyb20gJy4uL3RyZWUvdmlydHVhbCc7XG5cblxuLyoqXG4gKiBXaGVuIGEgcnVsZSBvciBzb3VyY2UgcmV0dXJucyBhbiBpbnZhbGlkIHZhbHVlLlxuICovXG5leHBvcnQgY2xhc3MgSW52YWxpZFJ1bGVSZXN1bHRFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IodmFsdWU6IHt9KSB7XG4gICAgbGV0IHYgPSAnVW5rbm93biBUeXBlJztcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdiA9ICd1bmRlZmluZWQnO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHYgPSAnbnVsbCc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdiA9IGBGdW5jdGlvbigpYDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnb2JqZWN0Jykge1xuICAgICAgdiA9IGAke3R5cGVvZiB2YWx1ZX0oJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9KWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpID09IE9iamVjdCkge1xuICAgICAgICB2ID0gYE9iamVjdCgke0pTT04uc3RyaW5naWZ5KHZhbHVlKX0pYDtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgdiA9IGBJbnN0YW5jZSBvZiBjbGFzcyAke3ZhbHVlLmNvbnN0cnVjdG9yLm5hbWV9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHYgPSAnVW5rbm93biBPYmplY3QnO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlcihgSW52YWxpZCBydWxlIG9yIHNvdXJjZSByZXN1bHQ6ICR7dn0uYCk7XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY2FsbFNvdXJjZShzb3VyY2U6IFNvdXJjZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCk6IE9ic2VydmFibGU8VHJlZT4ge1xuICBjb25zdCByZXN1bHQgPSBzb3VyY2UoY29udGV4dCk7XG5cbiAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFZpcnR1YWxUcmVlKSB7XG4gICAgcmV0dXJuIE9ic2VydmFibGUub2YocmVzdWx0KTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZFJ1bGVSZXN1bHRFeGNlcHRpb24ocmVzdWx0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxsUnVsZShydWxlOiBSdWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBPYnNlcnZhYmxlPFRyZWU+LFxuICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpOiBPYnNlcnZhYmxlPFRyZWU+IHtcbiAgcmV0dXJuIGlucHV0Lm1lcmdlTWFwKGkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHJ1bGUoaSwgY29udGV4dCk7XG5cbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgVmlydHVhbFRyZWUpIHtcbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLm9mKHJlc3VsdCBhcyBUcmVlKTtcbiAgICB9IGVsc2UgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkUnVsZVJlc3VsdEV4Y2VwdGlvbihyZXN1bHQpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=