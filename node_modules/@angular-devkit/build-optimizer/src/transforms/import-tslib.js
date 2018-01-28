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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LXRzbGliLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvdHJhbnNmb3Jtcy9pbXBvcnQtdHNsaWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxpQ0FBaUM7QUFHakMseUJBQWdDLE9BQWU7SUFDN0MsTUFBTSxLQUFLLEdBQUcsNEVBQTRFLENBQUM7SUFFM0YsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUpELDBDQUlDO0FBRUQ7SUFDRSxNQUFNLENBQUMsQ0FBQyxPQUFpQyxFQUFpQyxFQUFFO1FBRTFFLE1BQU0sV0FBVyxHQUFrQyxDQUFDLEVBQWlCLEVBQUUsRUFBRTtZQUV2RSwrRUFBK0U7WUFDL0UsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBRXhELE1BQU0sT0FBTyxHQUFlLENBQUMsSUFBYSxFQUFXLEVBQUU7Z0JBRXJELDBFQUEwRTtnQkFDMUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUM7b0JBRXZELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkUsTUFBTSxJQUFJLEdBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQXNCLENBQUMsSUFBSSxDQUFDO3dCQUUxRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixxRkFBcUY7NEJBRXJGLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBQzdDLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDO1lBRUYsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUM7UUFFRixNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFqQ0QsOERBaUNDO0FBRUQsMkJBQTJCLElBQVksRUFBRSxVQUFVLEdBQUcsS0FBSztJQUN6RCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsZ0VBQWdFO1FBQ2hFLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFDekUsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsMEJBQTBCLENBQ25ELFdBQVcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RSxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDeEYsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBRXZGLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUMzQixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTiwwQ0FBMEM7UUFDMUMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFDNUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDcEUsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUMzRSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0FBQ0gsQ0FBQztBQUVELHNCQUFzQixJQUFZO0lBQ2hDLHVFQUF1RTtJQUN2RSxNQUFNLFNBQVMsR0FBRztRQUNoQixXQUFXO1FBQ1gsWUFBWTtRQUNaLFlBQVk7UUFDWixTQUFTO0tBQ1YsQ0FBQztJQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuXG5leHBvcnQgZnVuY3Rpb24gdGVzdEltcG9ydFRzbGliKGNvbnRlbnQ6IHN0cmluZykge1xuICBjb25zdCByZWdleCA9IC92YXIgKF9fZXh0ZW5kc3xfX2RlY29yYXRlfF9fbWV0YWRhdGF8X19wYXJhbSkgPSBcXCguKlxccj9cXG4oICAgIC4qXFxyP1xcbikqXFx9Oy87XG5cbiAgcmV0dXJuIHJlZ2V4LnRlc3QoY29udGVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbXBvcnRUc2xpYlRyYW5zZm9ybWVyKCk6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuXG4gICAgY29uc3QgdHJhbnNmb3JtZXI6IHRzLlRyYW5zZm9ybWVyPHRzLlNvdXJjZUZpbGU+ID0gKHNmOiB0cy5Tb3VyY2VGaWxlKSA9PiB7XG5cbiAgICAgIC8vIENoZWNrIGlmIG1vZHVsZSBoYXMgQ0pTIGV4cG9ydHMuIElmIHNvLCB1c2UgJ3JlcXVpcmUoKScgaW5zdGVhZCBvZiAnaW1wb3J0Jy5cbiAgICAgIGNvbnN0IHVzZVJlcXVpcmUgPSAvZXhwb3J0cy5cXFMrXFxzKj0vLnRlc3Qoc2YuZ2V0VGV4dCgpKTtcblxuICAgICAgY29uc3QgdmlzaXRvcjogdHMuVmlzaXRvciA9IChub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSA9PiB7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgbm9kZSBpcyBhIFRTIGhlbHBlciBkZWNsYXJhdGlvbiBhbmQgcmVwbGFjZSB3aXRoIGltcG9ydCBpZiB5ZXNcbiAgICAgICAgaWYgKHRzLmlzVmFyaWFibGVTdGF0ZW1lbnQobm9kZSkpIHtcbiAgICAgICAgICBjb25zdCBkZWNsYXJhdGlvbnMgPSBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnM7XG5cbiAgICAgICAgICBpZiAoZGVjbGFyYXRpb25zLmxlbmd0aCA9PT0gMSAmJiB0cy5pc0lkZW50aWZpZXIoZGVjbGFyYXRpb25zWzBdLm5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gKGRlY2xhcmF0aW9uc1swXS5uYW1lIGFzIHRzLklkZW50aWZpZXIpLnRleHQ7XG5cbiAgICAgICAgICAgIGlmIChpc0hlbHBlck5hbWUobmFtZSkpIHtcbiAgICAgICAgICAgICAgLy8gVE9ETzogbWF5YmUgYWRkIGEgZmV3IG1vcmUgY2hlY2tzLCBsaWtlIGNoZWNraW5nIHRoZSBmaXJzdCBwYXJ0IG9mIHRoZSBhc3NpZ25tZW50LlxuXG4gICAgICAgICAgICAgIHJldHVybiBjcmVhdGVUc2xpYkltcG9ydChuYW1lLCB1c2VSZXF1aXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQoc2YsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtZXI7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRzbGliSW1wb3J0KG5hbWU6IHN0cmluZywgdXNlUmVxdWlyZSA9IGZhbHNlKTogdHMuTm9kZSB7XG4gIGlmICh1c2VSZXF1aXJlKSB7XG4gICAgLy8gVXNlIGB2YXIgX19oZWxwZXIgPSAvKkBfX1BVUkVfXyovIHJlcXVpcmUoXCJ0c2xpYlwiKS5fX2hlbHBlcmAuXG4gICAgY29uc3QgcmVxdWlyZUNhbGwgPSB0cy5jcmVhdGVDYWxsKHRzLmNyZWF0ZUlkZW50aWZpZXIoJ3JlcXVpcmUnKSwgdW5kZWZpbmVkLFxuICAgICAgW3RzLmNyZWF0ZUxpdGVyYWwoJ3RzbGliJyldKTtcbiAgICBjb25zdCBwdXJlUmVxdWlyZUNhbGwgPSB0cy5hZGRTeW50aGV0aWNMZWFkaW5nQ29tbWVudChcbiAgICAgIHJlcXVpcmVDYWxsLCB0cy5TeW50YXhLaW5kLk11bHRpTGluZUNvbW1lbnRUcml2aWEsICdAX19QVVJFX18nLCBmYWxzZSk7XG4gICAgY29uc3QgaGVscGVyQWNjZXNzID0gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3MocHVyZVJlcXVpcmVDYWxsLCBuYW1lKTtcbiAgICBjb25zdCB2YXJpYWJsZURlY2xhcmF0aW9uID0gdHMuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbihuYW1lLCB1bmRlZmluZWQsIGhlbHBlckFjY2Vzcyk7XG4gICAgY29uc3QgdmFyaWFibGVTdGF0ZW1lbnQgPSB0cy5jcmVhdGVWYXJpYWJsZVN0YXRlbWVudCh1bmRlZmluZWQsIFt2YXJpYWJsZURlY2xhcmF0aW9uXSk7XG5cbiAgICByZXR1cm4gdmFyaWFibGVTdGF0ZW1lbnQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gVXNlIGBpbXBvcnQgeyBfX2hlbHBlciB9IGZyb20gXCJ0c2xpYlwiYC5cbiAgICBjb25zdCBuYW1lZEltcG9ydHMgPSB0cy5jcmVhdGVOYW1lZEltcG9ydHMoW3RzLmNyZWF0ZUltcG9ydFNwZWNpZmllcih1bmRlZmluZWQsXG4gICAgICB0cy5jcmVhdGVJZGVudGlmaWVyKG5hbWUpKV0pO1xuICAgIGNvbnN0IGltcG9ydENsYXVzZSA9IHRzLmNyZWF0ZUltcG9ydENsYXVzZSh1bmRlZmluZWQsIG5hbWVkSW1wb3J0cyk7XG4gICAgY29uc3QgbmV3Tm9kZSA9IHRzLmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBpbXBvcnRDbGF1c2UsXG4gICAgICB0cy5jcmVhdGVMaXRlcmFsKCd0c2xpYicpKTtcblxuICAgIHJldHVybiBuZXdOb2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzSGVscGVyTmFtZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gVE9ETzogdGhlcmUgYXJlIG1vcmUgaGVscGVycyB0aGFuIHRoZXNlLCBzaG91bGQgd2UgcmVwbGFjZSB0aGVtIGFsbD9cbiAgY29uc3QgdHNIZWxwZXJzID0gW1xuICAgICdfX2V4dGVuZHMnLFxuICAgICdfX2RlY29yYXRlJyxcbiAgICAnX19tZXRhZGF0YScsXG4gICAgJ19fcGFyYW0nLFxuICBdO1xuXG4gIHJldHVybiB0c0hlbHBlcnMuaW5kZXhPZihuYW1lKSAhPT0gLTE7XG59XG4iXX0=