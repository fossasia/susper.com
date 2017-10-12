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
require("rxjs/add/observable/of");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
const filtered_1 = require("../tree/filtered");
const interface_1 = require("../tree/interface");
const static_1 = require("../tree/static");
const virtual_1 = require("../tree/virtual");
const call_1 = require("./call");
/**
 * A Source that returns an tree as its single value.
 */
function source(tree) {
    return () => tree;
}
exports.source = source;
/**
 * A source that returns an empty tree.
 */
function empty() {
    return () => static_1.empty();
}
exports.empty = empty;
/**
 * Chain multiple rules into a single rule.
 */
function chain(rules) {
    return (tree, context) => {
        return rules.reduce((acc, curr) => {
            return call_1.callRule(curr, acc, context);
        }, Observable_1.Observable.of(tree));
    };
}
exports.chain = chain;
/**
 * Apply multiple rules to a source, and returns the source transformed.
 */
function apply(source, rules) {
    return (context) => {
        return call_1.callRule(chain(rules), call_1.callSource(source, context), context);
    };
}
exports.apply = apply;
/**
 * Merge an input tree with the source passed in.
 */
function mergeWith(source, strategy = interface_1.MergeStrategy.Default) {
    return (tree, context) => {
        const result = call_1.callSource(source, context);
        return result.map(other => virtual_1.VirtualTree.merge(tree, other, strategy || context.strategy));
    };
}
exports.mergeWith = mergeWith;
function noop() {
    return (tree, _context) => tree;
}
exports.noop = noop;
function filter(predicate) {
    return (tree) => new filtered_1.FilteredTree(tree, predicate);
}
exports.filter = filter;
function asSource(rule) {
    return apply(empty(), [rule]);
}
exports.asSource = asSource;
function branchAndMerge(rule) {
    return (tree, context) => {
        const branchedTree = static_1.branch(tree);
        return call_1.callRule(rule, Observable_1.Observable.of(branchedTree), context)
            .map(t => static_1.merge(tree, t));
    };
}
exports.branchAndMerge = branchAndMerge;
function when(predicate, operator) {
    return (entry) => {
        if (predicate(entry.path, entry)) {
            return operator(entry);
        }
        else {
            return entry;
        }
    };
}
exports.when = when;
function partitionApplyMerge(predicate, ruleYes, ruleNo) {
    return (tree, context) => {
        const [yes, no] = static_1.partition(tree, predicate);
        if (!ruleNo) {
            // Shortcut.
            return call_1.callRule(ruleYes, Observable_1.Observable.of(static_1.partition(tree, predicate)[0]), context)
                .map(yesTree => static_1.merge(yesTree, no, context.strategy));
        }
        return call_1.callRule(ruleYes, Observable_1.Observable.of(yes), context)
            .concatMap(yesTree => {
            return call_1.callRule(ruleNo, Observable_1.Observable.of(no), context)
                .map(noTree => static_1.merge(yesTree, noTree, context.strategy));
        });
    };
}
exports.partitionApplyMerge = partitionApplyMerge;
function forEach(operator) {
    return (tree) => {
        tree.files.forEach(path => {
            const entry = tree.get(path);
            if (!entry) {
                return;
            }
            const newEntry = operator(entry);
            if (newEntry === entry) {
                return;
            }
            if (newEntry === null) {
                tree.delete(path);
                return;
            }
            if (newEntry.path != path) {
                tree.rename(path, newEntry.path);
            }
            if (!newEntry.content.equals(entry.content)) {
                tree.overwrite(newEntry.path, newEntry.content);
            }
        });
        return tree;
    };
}
exports.forEach = forEach;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9ydWxlcy9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsZ0RBQTZDO0FBQzdDLGtDQUFnQztBQUNoQyxpQ0FBK0I7QUFDL0Isc0NBQW9DO0FBRXBDLCtDQUFnRDtBQUNoRCxpREFBa0Y7QUFDbEYsMkNBS3dCO0FBQ3hCLDZDQUE4QztBQUM5QyxpQ0FBOEM7QUFHOUM7O0dBRUc7QUFDSCxnQkFBdUIsSUFBVTtJQUMvQixNQUFNLENBQUMsTUFBTSxJQUFJLENBQUM7QUFDcEIsQ0FBQztBQUZELHdCQUVDO0FBR0Q7O0dBRUc7QUFDSDtJQUNFLE1BQU0sQ0FBQyxNQUFNLGNBQVcsRUFBRSxDQUFDO0FBQzdCLENBQUM7QUFGRCxzQkFFQztBQUdEOztHQUVHO0FBQ0gsZUFBc0IsS0FBYTtJQUNqQyxNQUFNLENBQUMsQ0FBQyxJQUFVLEVBQUUsT0FBeUI7UUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFxQixFQUFFLElBQVU7WUFDcEQsTUFBTSxDQUFDLGVBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLENBQUMsRUFBRSx1QkFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFORCxzQkFNQztBQUdEOztHQUVHO0FBQ0gsZUFBc0IsTUFBYyxFQUFFLEtBQWE7SUFDakQsTUFBTSxDQUFDLENBQUMsT0FBeUI7UUFDL0IsTUFBTSxDQUFDLGVBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsaUJBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7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LENBQUMsQ0FBQztZQUNsRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQTFCRCwwQkEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9vZic7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21lcmdlTWFwJztcbmltcG9ydCB7IEZpbGVPcGVyYXRvciwgUnVsZSwgU2NoZW1hdGljQ29udGV4dCwgU291cmNlIH0gZnJvbSAnLi4vZW5naW5lL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBGaWx0ZXJlZFRyZWUgfSBmcm9tICcuLi90cmVlL2ZpbHRlcmVkJztcbmltcG9ydCB7IEZpbGVFbnRyeSwgRmlsZVByZWRpY2F0ZSwgTWVyZ2VTdHJhdGVneSwgVHJlZSB9IGZyb20gJy4uL3RyZWUvaW50ZXJmYWNlJztcbmltcG9ydCB7XG4gIGJyYW5jaCxcbiAgZW1wdHkgYXMgc3RhdGljRW1wdHksXG4gIG1lcmdlIGFzIHN0YXRpY01lcmdlLFxuICBwYXJ0aXRpb24gYXMgc3RhdGljUGFydGl0aW9uLFxufSBmcm9tICcuLi90cmVlL3N0YXRpYyc7XG5pbXBvcnQgeyBWaXJ0dWFsVHJlZSB9IGZyb20gJy4uL3RyZWUvdmlydHVhbCc7XG5pbXBvcnQgeyBjYWxsUnVsZSwgY2FsbFNvdXJjZSB9IGZyb20gJy4vY2FsbCc7XG5cblxuLyoqXG4gKiBBIFNvdXJjZSB0aGF0IHJldHVybnMgYW4gdHJlZSBhcyBpdHMgc2luZ2xlIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc291cmNlKHRyZWU6IFRyZWUpOiBTb3VyY2Uge1xuICByZXR1cm4gKCkgPT4gdHJlZTtcbn1cblxuXG4vKipcbiAqIEEgc291cmNlIHRoYXQgcmV0dXJucyBhbiBlbXB0eSB0cmVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHkoKTogU291cmNlIHtcbiAgcmV0dXJuICgpID0+IHN0YXRpY0VtcHR5KCk7XG59XG5cblxuLyoqXG4gKiBDaGFpbiBtdWx0aXBsZSBydWxlcyBpbnRvIGEgc2luZ2xlIHJ1bGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGFpbihydWxlczogUnVsZVtdKTogUnVsZSB7XG4gIHJldHVybiAodHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIHJldHVybiBydWxlcy5yZWR1Y2UoKGFjYzogT2JzZXJ2YWJsZTxUcmVlPiwgY3VycjogUnVsZSkgPT4ge1xuICAgICAgcmV0dXJuIGNhbGxSdWxlKGN1cnIsIGFjYywgY29udGV4dCk7XG4gICAgfSwgT2JzZXJ2YWJsZS5vZih0cmVlKSk7XG4gIH07XG59XG5cblxuLyoqXG4gKiBBcHBseSBtdWx0aXBsZSBydWxlcyB0byBhIHNvdXJjZSwgYW5kIHJldHVybnMgdGhlIHNvdXJjZSB0cmFuc2Zvcm1lZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5KHNvdXJjZTogU291cmNlLCBydWxlczogUnVsZVtdKTogU291cmNlIHtcbiAgcmV0dXJuIChjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgcmV0dXJuIGNhbGxSdWxlKGNoYWluKHJ1bGVzKSwgY2FsbFNvdXJjZShzb3VyY2UsIGNvbnRleHQpLCBjb250ZXh0KTtcbiAgfTtcbn1cblxuXG4vKipcbiAqIE1lcmdlIGFuIGlucHV0IHRyZWUgd2l0aCB0aGUgc291cmNlIHBhc3NlZCBpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlV2l0aChzb3VyY2U6IFNvdXJjZSwgc3RyYXRlZ3k6IE1lcmdlU3RyYXRlZ3kgPSBNZXJnZVN0cmF0ZWd5LkRlZmF1bHQpOiBSdWxlIHtcbiAgcmV0dXJuICh0cmVlOiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gY2FsbFNvdXJjZShzb3VyY2UsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIHJlc3VsdC5tYXAob3RoZXIgPT4gVmlydHVhbFRyZWUubWVyZ2UodHJlZSwgb3RoZXIsIHN0cmF0ZWd5IHx8IGNvbnRleHQuc3RyYXRlZ3kpKTtcbiAgfTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbm9vcCgpOiBSdWxlIHtcbiAgcmV0dXJuICh0cmVlOiBUcmVlLCBfY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4gdHJlZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyKHByZWRpY2F0ZTogRmlsZVByZWRpY2F0ZTxib29sZWFuPik6IFJ1bGUge1xuICByZXR1cm4gKHRyZWU6IFRyZWUpID0+IG5ldyBGaWx0ZXJlZFRyZWUodHJlZSwgcHJlZGljYXRlKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYXNTb3VyY2UocnVsZTogUnVsZSk6IFNvdXJjZSB7XG4gIHJldHVybiBhcHBseShlbXB0eSgpLCBbcnVsZV0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2hBbmRNZXJnZShydWxlOiBSdWxlKTogUnVsZSB7XG4gIHJldHVybiAodHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IGJyYW5jaGVkVHJlZSA9IGJyYW5jaCh0cmVlKTtcblxuICAgIHJldHVybiBjYWxsUnVsZShydWxlLCBPYnNlcnZhYmxlLm9mKGJyYW5jaGVkVHJlZSksIGNvbnRleHQpXG4gICAgICAubWFwKHQgPT4gc3RhdGljTWVyZ2UodHJlZSwgdCkpO1xuICB9O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiB3aGVuKHByZWRpY2F0ZTogRmlsZVByZWRpY2F0ZTxib29sZWFuPiwgb3BlcmF0b3I6IEZpbGVPcGVyYXRvcik6IEZpbGVPcGVyYXRvciB7XG4gIHJldHVybiAoZW50cnk6IEZpbGVFbnRyeSkgPT4ge1xuICAgIGlmIChwcmVkaWNhdGUoZW50cnkucGF0aCwgZW50cnkpKSB7XG4gICAgICByZXR1cm4gb3BlcmF0b3IoZW50cnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZW50cnk7XG4gICAgfVxuICB9O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aXRpb25BcHBseU1lcmdlKFxuICBwcmVkaWNhdGU6IEZpbGVQcmVkaWNhdGU8Ym9vbGVhbj4sXG4gIHJ1bGVZZXM6IFJ1bGUsXG4gIHJ1bGVObz86IFJ1bGUsXG4pOiBSdWxlIHtcbiAgcmV0dXJuICh0cmVlOiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgW3llcywgbm9dID0gc3RhdGljUGFydGl0aW9uKHRyZWUsIHByZWRpY2F0ZSk7XG5cbiAgICBpZiAoIXJ1bGVObykge1xuICAgICAgLy8gU2hvcnRjdXQuXG4gICAgICByZXR1cm4gY2FsbFJ1bGUocnVsZVllcywgT2JzZXJ2YWJsZS5vZihzdGF0aWNQYXJ0aXRpb24odHJlZSwgcHJlZGljYXRlKVswXSksIGNvbnRleHQpXG4gICAgICAgIC5tYXAoeWVzVHJlZSA9PiBzdGF0aWNNZXJnZSh5ZXNUcmVlLCBubywgY29udGV4dC5zdHJhdGVneSkpO1xuICAgIH1cblxuICAgIHJldHVybiBjYWxsUnVsZShydWxlWWVzLCBPYnNlcnZhYmxlLm9mKHllcyksIGNvbnRleHQpXG4gICAgICAuY29uY2F0TWFwKHllc1RyZWUgPT4ge1xuICAgICAgICByZXR1cm4gY2FsbFJ1bGUocnVsZU5vLCBPYnNlcnZhYmxlLm9mKG5vKSwgY29udGV4dClcbiAgICAgICAgICAubWFwKG5vVHJlZSA9PiBzdGF0aWNNZXJnZSh5ZXNUcmVlLCBub1RyZWUsIGNvbnRleHQuc3RyYXRlZ3kpKTtcbiAgICAgIH0pO1xuICB9O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoKG9wZXJhdG9yOiBGaWxlT3BlcmF0b3IpOiBSdWxlIHtcbiAgcmV0dXJuICh0cmVlOiBUcmVlKSA9PiB7XG4gICAgdHJlZS5maWxlcy5mb3JFYWNoKHBhdGggPT4ge1xuICAgICAgY29uc3QgZW50cnkgPSB0cmVlLmdldChwYXRoKTtcbiAgICAgIGlmICghZW50cnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgbmV3RW50cnkgPSBvcGVyYXRvcihlbnRyeSk7XG4gICAgICBpZiAobmV3RW50cnkgPT09IGVudHJ5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChuZXdFbnRyeSA9PT0gbnVsbCkge1xuICAgICAgICB0cmVlLmRlbGV0ZShwYXRoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAobmV3RW50cnkucGF0aCAhPSBwYXRoKSB7XG4gICAgICAgIHRyZWUucmVuYW1lKHBhdGgsIG5ld0VudHJ5LnBhdGgpO1xuICAgICAgfVxuICAgICAgaWYgKCFuZXdFbnRyeS5jb250ZW50LmVxdWFscyhlbnRyeS5jb250ZW50KSkge1xuICAgICAgICB0cmVlLm92ZXJ3cml0ZShuZXdFbnRyeS5wYXRoLCBuZXdFbnRyeS5jb250ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmVlO1xuICB9O1xufVxuIl19