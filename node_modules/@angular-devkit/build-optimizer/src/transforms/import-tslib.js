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
function testImportTslib(content) {
    const regex = /var (__extends|__decorate|__metadata|__param) = \(.*\r?\n(    .*\r?\n)*\};/;
    return regex.test(content);
}
exports.testImportTslib = testImportTslib;
function getImportTslibTransformer() {
    return (context) => {
        const transformer = (sf) => {
            // Check if module has CJS exports. If so, use 'require()' instead of 'import'.
            const useRequire = /exports.\S+\s*=/.test(sf.getText());
            const visitor = (node) => {
                // Check if node is a TS helper declaration and replace with import if yes
                if (ts.isVariableStatement(node)) {
                    const declarations = node.declarationList.declarations;
                    if (declarations.length === 1 && ts.isIdentifier(declarations[0].name)) {
                        const name = declarations[0].name.text;
                        if (isHelperName(name)) {
                            // TODO: maybe add a few more checks, like checking the first part of the assignment.
                            return createTslibImport(name, useRequire);
                        }
                    }
                }
                return ts.visitEachChild(node, visitor, context);
            };
            return ts.visitEachChild(sf, visitor, context);
        };
        return transformer;
    };
}
exports.getImportTslibTransformer = getImportTslibTransformer;
function createTslibImport(name, useRequire = false) {
    if (useRequire) {
        // Use `var __helper = /*@__PURE__*/ require("tslib").__helper`.
        const requireCall = ts.createCall(ts.createIdentifier('require'), undefined, [ts.createLiteral('tslib')]);
        const pureRequireCall = ts.addSyntheticLeadingComment(requireCall, ts.SyntaxKind.MultiLineCommentTrivia, '@__PURE__', false);
        const helperAccess = ts.createPropertyAccess(pureRequireCall, name);
        const variableDeclaration = ts.createVariableDeclaration(name, undefined, helperAccess);
        const variableStatement = ts.createVariableStatement(undefined, [variableDeclaration]);
        return variableStatement;
    }
    else {
        // Use `import { __helper } from "tslib"`.
        const namedImports = ts.createNamedImports([ts.createImportSpecifier(undefined, ts.createIdentifier(name))]);
        const importClause = ts.createImportClause(undefined, namedImports);
        const newNode = ts.createImportDeclaration(undefined, undefined, importClause, ts.createLiteral('tslib'));
        return newNode;
    }
}
function isHelperName(name) {
    // TODO: there are more helpers than these, should we replace them all?
    const tsHelpers = [
        '__extends',
        '__decorate',
        '__metadata',
        '__param',
    ];
    return tsHelpers.indexOf(name) !== -1;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LXRzbGliLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvaW1wb3J0LXRzbGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaUNBQWlDO0FBR2pDLHlCQUFnQyxPQUFlO0lBQzdDLE1BQU0sS0FBSyxHQUFHLDRFQUE0RSxDQUFDO0lBRTNGLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFKRCwwQ0FJQztBQUVEO0lBQ0UsTUFBTSxDQUFDLENBQUMsT0FBaUMsRUFBaUMsRUFBRTtRQUUxRSxNQUFNLFdBQVcsR0FBa0MsQ0FBQyxFQUFpQixFQUFFLEVBQUU7WUFFdkUsK0VBQStFO1lBQy9FLE1BQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUV4RCxNQUFNLE9BQU8sR0FBZSxDQUFDLElBQWEsRUFBVyxFQUFFO2dCQUVyRCwwRUFBMEU7Z0JBQzFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDO29CQUV2RCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZFLE1BQU0sSUFBSSxHQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFzQixDQUFDLElBQUksQ0FBQzt3QkFFMUQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdkIscUZBQXFGOzRCQUVyRixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO3dCQUM3QyxDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztnQkFFRCxNQUFNLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQztZQUVGLE1BQU0sQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDO1FBRUYsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUNyQixDQUFDLENBQUM7QUFDSixDQUFDO0FBakNELDhEQWlDQztBQUVELDJCQUEyQixJQUFZLEVBQUUsVUFBVSxHQUFHLEtBQUs7SUFDekQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNmLGdFQUFnRTtRQUNoRSxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQ3pFLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLDBCQUEwQixDQUNuRCxXQUFXLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekUsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxNQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3hGLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUV2RixNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sMENBQTBDO1FBQzFDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQzVFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFDM0UsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRTdCLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztBQUNILENBQUM7QUFFRCxzQkFBc0IsSUFBWTtJQUNoQyx1RUFBdUU7SUFDdkUsTUFBTSxTQUFTLEdBQUc7UUFDaEIsV0FBVztRQUNYLFlBQVk7UUFDWixZQUFZO1FBQ1osU0FBUztLQUNWLENBQUM7SUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RJbXBvcnRUc2xpYihjb250ZW50OiBzdHJpbmcpIHtcbiAgY29uc3QgcmVnZXggPSAvdmFyIChfX2V4dGVuZHN8X19kZWNvcmF0ZXxfX21ldGFkYXRhfF9fcGFyYW0pID0gXFwoLipcXHI/XFxuKCAgICAuKlxccj9cXG4pKlxcfTsvO1xuXG4gIHJldHVybiByZWdleC50ZXN0KGNvbnRlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1wb3J0VHNsaWJUcmFuc2Zvcm1lcigpOiB0cy5UcmFuc2Zvcm1lckZhY3Rvcnk8dHMuU291cmNlRmlsZT4ge1xuICByZXR1cm4gKGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCk6IHRzLlRyYW5zZm9ybWVyPHRzLlNvdXJjZUZpbGU+ID0+IHtcblxuICAgIGNvbnN0IHRyYW5zZm9ybWVyOiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiA9IChzZjogdHMuU291cmNlRmlsZSkgPT4ge1xuXG4gICAgICAvLyBDaGVjayBpZiBtb2R1bGUgaGFzIENKUyBleHBvcnRzLiBJZiBzbywgdXNlICdyZXF1aXJlKCknIGluc3RlYWQgb2YgJ2ltcG9ydCcuXG4gICAgICBjb25zdCB1c2VSZXF1aXJlID0gL2V4cG9ydHMuXFxTK1xccyo9Ly50ZXN0KHNmLmdldFRleHQoKSk7XG5cbiAgICAgIGNvbnN0IHZpc2l0b3I6IHRzLlZpc2l0b3IgPSAobm9kZTogdHMuTm9kZSk6IHRzLk5vZGUgPT4ge1xuXG4gICAgICAgIC8vIENoZWNrIGlmIG5vZGUgaXMgYSBUUyBoZWxwZXIgZGVjbGFyYXRpb24gYW5kIHJlcGxhY2Ugd2l0aCBpbXBvcnQgaWYgeWVzXG4gICAgICAgIGlmICh0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KG5vZGUpKSB7XG4gICAgICAgICAgY29uc3QgZGVjbGFyYXRpb25zID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zO1xuXG4gICAgICAgICAgaWYgKGRlY2xhcmF0aW9ucy5sZW5ndGggPT09IDEgJiYgdHMuaXNJZGVudGlmaWVyKGRlY2xhcmF0aW9uc1swXS5uYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IChkZWNsYXJhdGlvbnNbMF0ubmFtZSBhcyB0cy5JZGVudGlmaWVyKS50ZXh0O1xuXG4gICAgICAgICAgICBpZiAoaXNIZWxwZXJOYW1lKG5hbWUpKSB7XG4gICAgICAgICAgICAgIC8vIFRPRE86IG1heWJlIGFkZCBhIGZldyBtb3JlIGNoZWNrcywgbGlrZSBjaGVja2luZyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgYXNzaWdubWVudC5cblxuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlVHNsaWJJbXBvcnQobmFtZSwgdXNlUmVxdWlyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKHNmLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUc2xpYkltcG9ydChuYW1lOiBzdHJpbmcsIHVzZVJlcXVpcmUgPSBmYWxzZSk6IHRzLk5vZGUge1xuICBpZiAodXNlUmVxdWlyZSkge1xuICAgIC8vIFVzZSBgdmFyIF9faGVscGVyID0gLypAX19QVVJFX18qLyByZXF1aXJlKFwidHNsaWJcIikuX19oZWxwZXJgLlxuICAgIGNvbnN0IHJlcXVpcmVDYWxsID0gdHMuY3JlYXRlQ2FsbCh0cy5jcmVhdGVJZGVudGlmaWVyKCdyZXF1aXJlJyksIHVuZGVmaW5lZCxcbiAgICAgIFt0cy5jcmVhdGVMaXRlcmFsKCd0c2xpYicpXSk7XG4gICAgY29uc3QgcHVyZVJlcXVpcmVDYWxsID0gdHMuYWRkU3ludGhldGljTGVhZGluZ0NvbW1lbnQoXG4gICAgICByZXF1aXJlQ2FsbCwgdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhLCAnQF9fUFVSRV9fJywgZmFsc2UpO1xuICAgIGNvbnN0IGhlbHBlckFjY2VzcyA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHB1cmVSZXF1aXJlQ2FsbCwgbmFtZSk7XG4gICAgY29uc3QgdmFyaWFibGVEZWNsYXJhdGlvbiA9IHRzLmNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb24obmFtZSwgdW5kZWZpbmVkLCBoZWxwZXJBY2Nlc3MpO1xuICAgIGNvbnN0IHZhcmlhYmxlU3RhdGVtZW50ID0gdHMuY3JlYXRlVmFyaWFibGVTdGF0ZW1lbnQodW5kZWZpbmVkLCBbdmFyaWFibGVEZWNsYXJhdGlvbl0pO1xuXG4gICAgcmV0dXJuIHZhcmlhYmxlU3RhdGVtZW50O1xuICB9IGVsc2Uge1xuICAgIC8vIFVzZSBgaW1wb3J0IHsgX19oZWxwZXIgfSBmcm9tIFwidHNsaWJcImAuXG4gICAgY29uc3QgbmFtZWRJbXBvcnRzID0gdHMuY3JlYXRlTmFtZWRJbXBvcnRzKFt0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIodW5kZWZpbmVkLFxuICAgICAgdHMuY3JlYXRlSWRlbnRpZmllcihuYW1lKSldKTtcbiAgICBjb25zdCBpbXBvcnRDbGF1c2UgPSB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCBuYW1lZEltcG9ydHMpO1xuICAgIGNvbnN0IG5ld05vZGUgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgaW1wb3J0Q2xhdXNlLFxuICAgICAgdHMuY3JlYXRlTGl0ZXJhbCgndHNsaWInKSk7XG5cbiAgICByZXR1cm4gbmV3Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0hlbHBlck5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFRPRE86IHRoZXJlIGFyZSBtb3JlIGhlbHBlcnMgdGhhbiB0aGVzZSwgc2hvdWxkIHdlIHJlcGxhY2UgdGhlbSBhbGw/XG4gIGNvbnN0IHRzSGVscGVycyA9IFtcbiAgICAnX19leHRlbmRzJyxcbiAgICAnX19kZWNvcmF0ZScsXG4gICAgJ19fbWV0YWRhdGEnLFxuICAgICdfX3BhcmFtJyxcbiAgXTtcblxuICByZXR1cm4gdHNIZWxwZXJzLmluZGV4T2YobmFtZSkgIT09IC0xO1xufVxuIl19