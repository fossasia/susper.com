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
    // This transform introduces import/require() calls, but this won't work properly on libraries
    // built with Webpack. These libraries use __webpack_require__() calls instead, which will break
    // with a new import that wasn't part of it's original module list.
    // We ignore this transform for such libraries.
    const webpackRequireRegex = /__webpack_require__/;
    return regex.test(content) && !webpackRequireRegex.test(content);
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
                        // NOTE: the replace is unnecessary with TS2.5+; tests currently run with TS2.4
                        const name = declarations[0].name.text.replace(/^___/, '__');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LXRzbGliLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvdHJhbnNmb3Jtcy9pbXBvcnQtdHNsaWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxpQ0FBaUM7QUFHakMseUJBQWdDLE9BQWU7SUFDN0MsTUFBTSxLQUFLLEdBQUcsNEVBQTRFLENBQUM7SUFFM0YsOEZBQThGO0lBQzlGLGdHQUFnRztJQUNoRyxtRUFBbUU7SUFDbkUsK0NBQStDO0lBQy9DLE1BQU0sbUJBQW1CLEdBQUcscUJBQXFCLENBQUM7SUFFbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQVZELDBDQVVDO0FBRUQ7SUFDRSxNQUFNLENBQUMsQ0FBQyxPQUFpQztRQUV2QyxNQUFNLFdBQVcsR0FBa0MsQ0FBQyxFQUFpQjtZQUVuRSwrRUFBK0U7WUFDL0UsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBRXhELE1BQU0sT0FBTyxHQUFlLENBQUMsSUFBYTtnQkFFeEMsMEVBQTBFO2dCQUMxRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQztvQkFFdkQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2RSwrRUFBK0U7d0JBQy9FLE1BQU0sSUFBSSxHQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUVoRixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixxRkFBcUY7NEJBRXJGLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBQzdDLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDO1lBRUYsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUM7UUFFRixNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFsQ0QsOERBa0NDO0FBRUQsMkJBQTJCLElBQVksRUFBRSxVQUFVLEdBQUcsS0FBSztJQUN6RCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsZ0VBQWdFO1FBQ2hFLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFDekUsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsMEJBQTBCLENBQ25ELFdBQVcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RSxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDeEYsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBRXZGLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUMzQixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTiwwQ0FBMEM7UUFDMUMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFDNUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDcEUsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUMzRSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0FBQ0gsQ0FBQztBQUVELHNCQUFzQixJQUFZO0lBQ2hDLHVFQUF1RTtJQUN2RSxNQUFNLFNBQVMsR0FBRztRQUNoQixXQUFXO1FBQ1gsWUFBWTtRQUNaLFlBQVk7UUFDWixTQUFTO0tBQ1YsQ0FBQztJQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuXG5leHBvcnQgZnVuY3Rpb24gdGVzdEltcG9ydFRzbGliKGNvbnRlbnQ6IHN0cmluZykge1xuICBjb25zdCByZWdleCA9IC92YXIgKF9fZXh0ZW5kc3xfX2RlY29yYXRlfF9fbWV0YWRhdGF8X19wYXJhbSkgPSBcXCguKlxccj9cXG4oICAgIC4qXFxyP1xcbikqXFx9Oy87XG5cbiAgLy8gVGhpcyB0cmFuc2Zvcm0gaW50cm9kdWNlcyBpbXBvcnQvcmVxdWlyZSgpIGNhbGxzLCBidXQgdGhpcyB3b24ndCB3b3JrIHByb3Blcmx5IG9uIGxpYnJhcmllc1xuICAvLyBidWlsdCB3aXRoIFdlYnBhY2suIFRoZXNlIGxpYnJhcmllcyB1c2UgX193ZWJwYWNrX3JlcXVpcmVfXygpIGNhbGxzIGluc3RlYWQsIHdoaWNoIHdpbGwgYnJlYWtcbiAgLy8gd2l0aCBhIG5ldyBpbXBvcnQgdGhhdCB3YXNuJ3QgcGFydCBvZiBpdCdzIG9yaWdpbmFsIG1vZHVsZSBsaXN0LlxuICAvLyBXZSBpZ25vcmUgdGhpcyB0cmFuc2Zvcm0gZm9yIHN1Y2ggbGlicmFyaWVzLlxuICBjb25zdCB3ZWJwYWNrUmVxdWlyZVJlZ2V4ID0gL19fd2VicGFja19yZXF1aXJlX18vO1xuXG4gIHJldHVybiByZWdleC50ZXN0KGNvbnRlbnQpICYmICF3ZWJwYWNrUmVxdWlyZVJlZ2V4LnRlc3QoY29udGVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbXBvcnRUc2xpYlRyYW5zZm9ybWVyKCk6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuXG4gICAgY29uc3QgdHJhbnNmb3JtZXI6IHRzLlRyYW5zZm9ybWVyPHRzLlNvdXJjZUZpbGU+ID0gKHNmOiB0cy5Tb3VyY2VGaWxlKSA9PiB7XG5cbiAgICAgIC8vIENoZWNrIGlmIG1vZHVsZSBoYXMgQ0pTIGV4cG9ydHMuIElmIHNvLCB1c2UgJ3JlcXVpcmUoKScgaW5zdGVhZCBvZiAnaW1wb3J0Jy5cbiAgICAgIGNvbnN0IHVzZVJlcXVpcmUgPSAvZXhwb3J0cy5cXFMrXFxzKj0vLnRlc3Qoc2YuZ2V0VGV4dCgpKTtcblxuICAgICAgY29uc3QgdmlzaXRvcjogdHMuVmlzaXRvciA9IChub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSA9PiB7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgbm9kZSBpcyBhIFRTIGhlbHBlciBkZWNsYXJhdGlvbiBhbmQgcmVwbGFjZSB3aXRoIGltcG9ydCBpZiB5ZXNcbiAgICAgICAgaWYgKHRzLmlzVmFyaWFibGVTdGF0ZW1lbnQobm9kZSkpIHtcbiAgICAgICAgICBjb25zdCBkZWNsYXJhdGlvbnMgPSBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnM7XG5cbiAgICAgICAgICBpZiAoZGVjbGFyYXRpb25zLmxlbmd0aCA9PT0gMSAmJiB0cy5pc0lkZW50aWZpZXIoZGVjbGFyYXRpb25zWzBdLm5hbWUpKSB7XG4gICAgICAgICAgICAvLyBOT1RFOiB0aGUgcmVwbGFjZSBpcyB1bm5lY2Vzc2FyeSB3aXRoIFRTMi41KzsgdGVzdHMgY3VycmVudGx5IHJ1biB3aXRoIFRTMi40XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gKGRlY2xhcmF0aW9uc1swXS5uYW1lIGFzIHRzLklkZW50aWZpZXIpLnRleHQucmVwbGFjZSgvXl9fXy8sICdfXycpO1xuXG4gICAgICAgICAgICBpZiAoaXNIZWxwZXJOYW1lKG5hbWUpKSB7XG4gICAgICAgICAgICAgIC8vIFRPRE86IG1heWJlIGFkZCBhIGZldyBtb3JlIGNoZWNrcywgbGlrZSBjaGVja2luZyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgYXNzaWdubWVudC5cblxuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlVHNsaWJJbXBvcnQobmFtZSwgdXNlUmVxdWlyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKHNmLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUc2xpYkltcG9ydChuYW1lOiBzdHJpbmcsIHVzZVJlcXVpcmUgPSBmYWxzZSk6IHRzLk5vZGUge1xuICBpZiAodXNlUmVxdWlyZSkge1xuICAgIC8vIFVzZSBgdmFyIF9faGVscGVyID0gLypAX19QVVJFX18qLyByZXF1aXJlKFwidHNsaWJcIikuX19oZWxwZXJgLlxuICAgIGNvbnN0IHJlcXVpcmVDYWxsID0gdHMuY3JlYXRlQ2FsbCh0cy5jcmVhdGVJZGVudGlmaWVyKCdyZXF1aXJlJyksIHVuZGVmaW5lZCxcbiAgICAgIFt0cy5jcmVhdGVMaXRlcmFsKCd0c2xpYicpXSk7XG4gICAgY29uc3QgcHVyZVJlcXVpcmVDYWxsID0gdHMuYWRkU3ludGhldGljTGVhZGluZ0NvbW1lbnQoXG4gICAgICByZXF1aXJlQ2FsbCwgdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhLCAnQF9fUFVSRV9fJywgZmFsc2UpO1xuICAgIGNvbnN0IGhlbHBlckFjY2VzcyA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHB1cmVSZXF1aXJlQ2FsbCwgbmFtZSk7XG4gICAgY29uc3QgdmFyaWFibGVEZWNsYXJhdGlvbiA9IHRzLmNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb24obmFtZSwgdW5kZWZpbmVkLCBoZWxwZXJBY2Nlc3MpO1xuICAgIGNvbnN0IHZhcmlhYmxlU3RhdGVtZW50ID0gdHMuY3JlYXRlVmFyaWFibGVTdGF0ZW1lbnQodW5kZWZpbmVkLCBbdmFyaWFibGVEZWNsYXJhdGlvbl0pO1xuXG4gICAgcmV0dXJuIHZhcmlhYmxlU3RhdGVtZW50O1xuICB9IGVsc2Uge1xuICAgIC8vIFVzZSBgaW1wb3J0IHsgX19oZWxwZXIgfSBmcm9tIFwidHNsaWJcImAuXG4gICAgY29uc3QgbmFtZWRJbXBvcnRzID0gdHMuY3JlYXRlTmFtZWRJbXBvcnRzKFt0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIodW5kZWZpbmVkLFxuICAgICAgdHMuY3JlYXRlSWRlbnRpZmllcihuYW1lKSldKTtcbiAgICBjb25zdCBpbXBvcnRDbGF1c2UgPSB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCBuYW1lZEltcG9ydHMpO1xuICAgIGNvbnN0IG5ld05vZGUgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgaW1wb3J0Q2xhdXNlLFxuICAgICAgdHMuY3JlYXRlTGl0ZXJhbCgndHNsaWInKSk7XG5cbiAgICByZXR1cm4gbmV3Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0hlbHBlck5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFRPRE86IHRoZXJlIGFyZSBtb3JlIGhlbHBlcnMgdGhhbiB0aGVzZSwgc2hvdWxkIHdlIHJlcGxhY2UgdGhlbSBhbGw/XG4gIGNvbnN0IHRzSGVscGVycyA9IFtcbiAgICAnX19leHRlbmRzJyxcbiAgICAnX19kZWNvcmF0ZScsXG4gICAgJ19fbWV0YWRhdGEnLFxuICAgICdfX3BhcmFtJyxcbiAgXTtcblxuICByZXR1cm4gdHNIZWxwZXJzLmluZGV4T2YobmFtZSkgIT09IC0xO1xufVxuIl19