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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LXV0aWxzLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL2hlbHBlcnMvYXN0LXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaUNBQWlDO0FBRWpDLHlFQUF5RTtBQUN6RSwwQkFBb0QsSUFBYSxFQUFFLElBQW1CO0lBQ3BGLE1BQU0sS0FBSyxHQUFRLEVBQUUsQ0FBQztJQUN0QixNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQWMsRUFBRSxFQUFFO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQVUsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUM7SUFDRixFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUU5QixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVhELDRDQVdDO0FBRUQsd0JBQ0UsWUFBcUIsRUFDckIsSUFBb0Q7SUFFcEQsSUFBSSxXQUFXLEdBQTRCLFlBQVksQ0FBQztJQUN4RCxHQUFHLENBQUMsQ0FBQyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLGdFQUFnRTtZQUNoRSxrQ0FBa0M7WUFDbEMsV0FBVyxHQUFJLFdBQW1CLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUFnQixDQUFDO0FBQzFCLENBQUM7QUFqQkQsd0NBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8vIEZpbmQgYWxsIG5vZGVzIGZyb20gdGhlIEFTVCBpbiB0aGUgc3VidHJlZSBvZiBub2RlIG9mIFN5bnRheEtpbmQga2luZC5cbmV4cG9ydCBmdW5jdGlvbiBjb2xsZWN0RGVlcE5vZGVzPFQgZXh0ZW5kcyB0cy5Ob2RlPihub2RlOiB0cy5Ob2RlLCBraW5kOiB0cy5TeW50YXhLaW5kKTogVFtdIHtcbiAgY29uc3Qgbm9kZXM6IFRbXSA9IFtdO1xuICBjb25zdCBoZWxwZXIgPSAoY2hpbGQ6IHRzLk5vZGUpID0+IHtcbiAgICBpZiAoY2hpbGQua2luZCA9PT0ga2luZCkge1xuICAgICAgbm9kZXMucHVzaChjaGlsZCBhcyBUKTtcbiAgICB9XG4gICAgdHMuZm9yRWFjaENoaWxkKGNoaWxkLCBoZWxwZXIpO1xuICB9O1xuICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgaGVscGVyKTtcblxuICByZXR1cm4gbm9kZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmlsbGRvd25Ob2RlczxUIGV4dGVuZHMgdHMuTm9kZT4oXG4gIHN0YXJ0aW5nTm9kZTogdHMuTm9kZSxcbiAgcGF0aDogeyBwcm9wOiBzdHJpbmcgfCBudWxsLCBraW5kOiB0cy5TeW50YXhLaW5kIH1bXSxcbik6IFQgfCBudWxsIHtcbiAgbGV0IGN1cnJlbnROb2RlOiBUIHwgdHMuTm9kZSB8IHVuZGVmaW5lZCA9IHN0YXJ0aW5nTm9kZTtcbiAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBhdGgpIHtcbiAgICBpZiAoc2VnbWVudC5wcm9wKSB7XG4gICAgICAvLyB0cy5Ob2RlIGhhcyBubyBpbmRleCBzaWduYXR1cmUsIHNvIHdlIG5lZWQgdG8gY2FzdCBpdCBhcyBhbnkuXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICBjdXJyZW50Tm9kZSA9IChjdXJyZW50Tm9kZSBhcyBhbnkpW3NlZ21lbnQucHJvcF07XG4gICAgfVxuICAgIGlmICghY3VycmVudE5vZGUgfHwgY3VycmVudE5vZGUua2luZCAhPT0gc2VnbWVudC5raW5kKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3VycmVudE5vZGUgYXMgVDtcbn1cbiJdfQ==