"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ts = require("typescript");
// Find all nodes from the AST in the subtree of node of SyntaxKind kind.
function collectDeepNodes(node, kind) {
    const nodes = [];
    const helper = (child) => {
        if (child.kind === kind) {
            nodes.push(child);
        }
        ts.forEachChild(child, helper);
    };
    ts.forEachChild(node, helper);
    return nodes;
}
exports.collectDeepNodes = collectDeepNodes;
function drilldownNodes(startingNode, path) {
    let currentNode = startingNode;
    for (const segment of path) {
        if (segment.prop) {
            // ts.Node has no index signature, so we need to cast it as any.
            // tslint:disable-next-line:no-any
            currentNode = currentNode[segment.prop];
        }
        if (!currentNode || currentNode.kind !== segment.kind) {
            return null;
        }
    }
    return currentNode;
}
exports.drilldownNodes = drilldownNodes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LXV0aWxzLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvaGVscGVycy9hc3QtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxpQ0FBaUM7QUFFakMseUVBQXlFO0FBQ3pFLDBCQUFvRCxJQUFhLEVBQUUsSUFBbUI7SUFDcEYsTUFBTSxLQUFLLEdBQVEsRUFBRSxDQUFDO0lBQ3RCLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBYyxFQUFFLEVBQUU7UUFDaEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBVSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQztJQUNGLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRTlCLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBWEQsNENBV0M7QUFFRCx3QkFDRSxZQUFxQixFQUNyQixJQUFvRDtJQUVwRCxJQUFJLFdBQVcsR0FBNEIsWUFBWSxDQUFDO0lBQ3hELEdBQUcsQ0FBQyxDQUFDLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakIsZ0VBQWdFO1lBQ2hFLGtDQUFrQztZQUNsQyxXQUFXLEdBQUksV0FBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQWdCLENBQUM7QUFDMUIsQ0FBQztBQWpCRCx3Q0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLy8gRmluZCBhbGwgbm9kZXMgZnJvbSB0aGUgQVNUIGluIHRoZSBzdWJ0cmVlIG9mIG5vZGUgb2YgU3ludGF4S2luZCBraW5kLlxuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3REZWVwTm9kZXM8VCBleHRlbmRzIHRzLk5vZGU+KG5vZGU6IHRzLk5vZGUsIGtpbmQ6IHRzLlN5bnRheEtpbmQpOiBUW10ge1xuICBjb25zdCBub2RlczogVFtdID0gW107XG4gIGNvbnN0IGhlbHBlciA9IChjaGlsZDogdHMuTm9kZSkgPT4ge1xuICAgIGlmIChjaGlsZC5raW5kID09PSBraW5kKSB7XG4gICAgICBub2Rlcy5wdXNoKGNoaWxkIGFzIFQpO1xuICAgIH1cbiAgICB0cy5mb3JFYWNoQ2hpbGQoY2hpbGQsIGhlbHBlcik7XG4gIH07XG4gIHRzLmZvckVhY2hDaGlsZChub2RlLCBoZWxwZXIpO1xuXG4gIHJldHVybiBub2Rlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyaWxsZG93bk5vZGVzPFQgZXh0ZW5kcyB0cy5Ob2RlPihcbiAgc3RhcnRpbmdOb2RlOiB0cy5Ob2RlLFxuICBwYXRoOiB7IHByb3A6IHN0cmluZyB8IG51bGwsIGtpbmQ6IHRzLlN5bnRheEtpbmQgfVtdLFxuKTogVCB8IG51bGwge1xuICBsZXQgY3VycmVudE5vZGU6IFQgfCB0cy5Ob2RlIHwgdW5kZWZpbmVkID0gc3RhcnRpbmdOb2RlO1xuICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGF0aCkge1xuICAgIGlmIChzZWdtZW50LnByb3ApIHtcbiAgICAgIC8vIHRzLk5vZGUgaGFzIG5vIGluZGV4IHNpZ25hdHVyZSwgc28gd2UgbmVlZCB0byBjYXN0IGl0IGFzIGFueS5cbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgIGN1cnJlbnROb2RlID0gKGN1cnJlbnROb2RlIGFzIGFueSlbc2VnbWVudC5wcm9wXTtcbiAgICB9XG4gICAgaWYgKCFjdXJyZW50Tm9kZSB8fCBjdXJyZW50Tm9kZS5raW5kICE9PSBzZWdtZW50LmtpbmQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50Tm9kZSBhcyBUO1xufVxuIl19