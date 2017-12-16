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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LXRzbGliLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvdHJhbnNmb3Jtcy9pbXBvcnQtdHNsaWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxpQ0FBaUM7QUFHakMseUJBQWdDLE9BQWU7SUFDN0MsTUFBTSxLQUFLLEdBQUcsNEVBQTRFLENBQUM7SUFFM0YsOEZBQThGO0lBQzlGLGdHQUFnRztJQUNoRyxtRUFBbUU7SUFDbkUsK0NBQStDO0lBQy9DLE1BQU0sbUJBQW1CLEdBQUcscUJBQXFCLENBQUM7SUFFbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQVZELDBDQVVDO0FBRUQ7SUFDRSxNQUFNLENBQUMsQ0FBQyxPQUFpQyxFQUFpQyxFQUFFO1FBRTFFLE1BQU0sV0FBVyxHQUFrQyxDQUFDLEVBQWlCLEVBQUUsRUFBRTtZQUV2RSwrRUFBK0U7WUFDL0UsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBRXhELE1BQU0sT0FBTyxHQUFlLENBQUMsSUFBYSxFQUFXLEVBQUU7Z0JBRXJELDBFQUEwRTtnQkFDMUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUM7b0JBRXZELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFB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bmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RJbXBvcnRUc2xpYihjb250ZW50OiBzdHJpbmcpIHtcbiAgY29uc3QgcmVnZXggPSAvdmFyIChfX2V4dGVuZHN8X19kZWNvcmF0ZXxfX21ldGFkYXRhfF9fcGFyYW0pID0gXFwoLipcXHI/XFxuKCAgICAuKlxccj9cXG4pKlxcfTsvO1xuXG4gIC8vIFRoaXMgdHJhbnNmb3JtIGludHJvZHVjZXMgaW1wb3J0L3JlcXVpcmUoKSBjYWxscywgYnV0IHRoaXMgd29uJ3Qgd29yayBwcm9wZXJseSBvbiBsaWJyYXJpZXNcbiAgLy8gYnVpbHQgd2l0aCBXZWJwYWNrLiBUaGVzZSBsaWJyYXJpZXMgdXNlIF9fd2VicGFja19yZXF1aXJlX18oKSBjYWxscyBpbnN0ZWFkLCB3aGljaCB3aWxsIGJyZWFrXG4gIC8vIHdpdGggYSBuZXcgaW1wb3J0IHRoYXQgd2Fzbid0IHBhcnQgb2YgaXQncyBvcmlnaW5hbCBtb2R1bGUgbGlzdC5cbiAgLy8gV2UgaWdub3JlIHRoaXMgdHJhbnNmb3JtIGZvciBzdWNoIGxpYnJhcmllcy5cbiAgY29uc3Qgd2VicGFja1JlcXVpcmVSZWdleCA9IC9fX3dlYnBhY2tfcmVxdWlyZV9fLztcblxuICByZXR1cm4gcmVnZXgudGVzdChjb250ZW50KSAmJiAhd2VicGFja1JlcXVpcmVSZWdleC50ZXN0KGNvbnRlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1wb3J0VHNsaWJUcmFuc2Zvcm1lcigpOiB0cy5UcmFuc2Zvcm1lckZhY3Rvcnk8dHMuU291cmNlRmlsZT4ge1xuICByZXR1cm4gKGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCk6IHRzLlRyYW5zZm9ybWVyPHRzLlNvdXJjZUZpbGU+ID0+IHtcblxuICAgIGNvbnN0IHRyYW5zZm9ybWVyOiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiA9IChzZjogdHMuU291cmNlRmlsZSkgPT4ge1xuXG4gICAgICAvLyBDaGVjayBpZiBtb2R1bGUgaGFzIENKUyBleHBvcnRzLiBJZiBzbywgdXNlICdyZXF1aXJlKCknIGluc3RlYWQgb2YgJ2ltcG9ydCcuXG4gICAgICBjb25zdCB1c2VSZXF1aXJlID0gL2V4cG9ydHMuXFxTK1xccyo9Ly50ZXN0KHNmLmdldFRleHQoKSk7XG5cbiAgICAgIGNvbnN0IHZpc2l0b3I6IHRzLlZpc2l0b3IgPSAobm9kZTogdHMuTm9kZSk6IHRzLk5vZGUgPT4ge1xuXG4gICAgICAgIC8vIENoZWNrIGlmIG5vZGUgaXMgYSBUUyBoZWxwZXIgZGVjbGFyYXRpb24gYW5kIHJlcGxhY2Ugd2l0aCBpbXBvcnQgaWYgeWVzXG4gICAgICAgIGlmICh0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KG5vZGUpKSB7XG4gICAgICAgICAgY29uc3QgZGVjbGFyYXRpb25zID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zO1xuXG4gICAgICAgICAgaWYgKGRlY2xhcmF0aW9ucy5sZW5ndGggPT09IDEgJiYgdHMuaXNJZGVudGlmaWVyKGRlY2xhcmF0aW9uc1swXS5uYW1lKSkge1xuICAgICAgICAgICAgLy8gTk9URTogdGhlIHJlcGxhY2UgaXMgdW5uZWNlc3Nhcnkgd2l0aCBUUzIuNSs7IHRlc3RzIGN1cnJlbnRseSBydW4gd2l0aCBUUzIuNFxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IChkZWNsYXJhdGlvbnNbMF0ubmFtZSBhcyB0cy5JZGVudGlmaWVyKS50ZXh0LnJlcGxhY2UoL15fX18vLCAnX18nKTtcblxuICAgICAgICAgICAgaWYgKGlzSGVscGVyTmFtZShuYW1lKSkge1xuICAgICAgICAgICAgICAvLyBUT0RPOiBtYXliZSBhZGQgYSBmZXcgbW9yZSBjaGVja3MsIGxpa2UgY2hlY2tpbmcgdGhlIGZpcnN0IHBhcnQgb2YgdGhlIGFzc2lnbm1lbnQuXG5cbiAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVRzbGliSW1wb3J0KG5hbWUsIHVzZVJlcXVpcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChub2RlLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChzZiwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgfTtcblxuICAgIHJldHVybiB0cmFuc2Zvcm1lcjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVHNsaWJJbXBvcnQobmFtZTogc3RyaW5nLCB1c2VSZXF1aXJlID0gZmFsc2UpOiB0cy5Ob2RlIHtcbiAgaWYgKHVzZVJlcXVpcmUpIHtcbiAgICAvLyBVc2UgYHZhciBfX2hlbHBlciA9IC8qQF9fUFVSRV9fKi8gcmVxdWlyZShcInRzbGliXCIpLl9faGVscGVyYC5cbiAgICBjb25zdCByZXF1aXJlQ2FsbCA9IHRzLmNyZWF0ZUNhbGwodHMuY3JlYXRlSWRlbnRpZmllcigncmVxdWlyZScpLCB1bmRlZmluZWQsXG4gICAgICBbdHMuY3JlYXRlTGl0ZXJhbCgndHNsaWInKV0pO1xuICAgIGNvbnN0IHB1cmVSZXF1aXJlQ2FsbCA9IHRzLmFkZFN5bnRoZXRpY0xlYWRpbmdDb21tZW50KFxuICAgICAgcmVxdWlyZUNhbGwsIHRzLlN5bnRheEtpbmQuTXVsdGlMaW5lQ29tbWVudFRyaXZpYSwgJ0BfX1BVUkVfXycsIGZhbHNlKTtcbiAgICBjb25zdCBoZWxwZXJBY2Nlc3MgPSB0cy5jcmVhdGVQcm9wZXJ0eUFjY2VzcyhwdXJlUmVxdWlyZUNhbGwsIG5hbWUpO1xuICAgIGNvbnN0IHZhcmlhYmxlRGVjbGFyYXRpb24gPSB0cy5jcmVhdGVWYXJpYWJsZURlY2xhcmF0aW9uKG5hbWUsIHVuZGVmaW5lZCwgaGVscGVyQWNjZXNzKTtcbiAgICBjb25zdCB2YXJpYWJsZVN0YXRlbWVudCA9IHRzLmNyZWF0ZVZhcmlhYmxlU3RhdGVtZW50KHVuZGVmaW5lZCwgW3ZhcmlhYmxlRGVjbGFyYXRpb25dKTtcblxuICAgIHJldHVybiB2YXJpYWJsZVN0YXRlbWVudDtcbiAgfSBlbHNlIHtcbiAgICAvLyBVc2UgYGltcG9ydCB7IF9faGVscGVyIH0gZnJvbSBcInRzbGliXCJgLlxuICAgIGNvbnN0IG5hbWVkSW1wb3J0cyA9IHRzLmNyZWF0ZU5hbWVkSW1wb3J0cyhbdHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyKHVuZGVmaW5lZCxcbiAgICAgIHRzLmNyZWF0ZUlkZW50aWZpZXIobmFtZSkpXSk7XG4gICAgY29uc3QgaW1wb3J0Q2xhdXNlID0gdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKHVuZGVmaW5lZCwgbmFtZWRJbXBvcnRzKTtcbiAgICBjb25zdCBuZXdOb2RlID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24odW5kZWZpbmVkLCB1bmRlZmluZWQsIGltcG9ydENsYXVzZSxcbiAgICAgIHRzLmNyZWF0ZUxpdGVyYWwoJ3RzbGliJykpO1xuXG4gICAgcmV0dXJuIG5ld05vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNIZWxwZXJOYW1lKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBUT0RPOiB0aGVyZSBhcmUgbW9yZSBoZWxwZXJzIHRoYW4gdGhlc2UsIHNob3VsZCB3ZSByZXBsYWNlIHRoZW0gYWxsP1xuICBjb25zdCB0c0hlbHBlcnMgPSBbXG4gICAgJ19fZXh0ZW5kcycsXG4gICAgJ19fZGVjb3JhdGUnLFxuICAgICdfX21ldGFkYXRhJyxcbiAgICAnX19wYXJhbScsXG4gIF07XG5cbiAgcmV0dXJuIHRzSGVscGVycy5pbmRleE9mKG5hbWUpICE9PSAtMTtcbn1cbiJdfQ==