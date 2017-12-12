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
const pureFunctionComment = '@__PURE__';
function getPrefixFunctionsTransformer() {
    return (context) => {
        const transformer = (sf) => {
            const topLevelFunctions = findTopLevelFunctions(sf);
            const pureImports = findPureImports(sf);
            const pureImportsComment = `* PURE_IMPORTS_START ${pureImports.join(',')} PURE_IMPORTS_END `;
            const visitor = (node) => {
                // Add the pure imports comment to the first node.
                if (node.parent && node.parent.parent === undefined && node.pos === 0) {
                    const newNode = ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, pureImportsComment, true);
                    // Replace node with modified one.
                    return ts.visitEachChild(newNode, visitor, context);
                }
                // Add pure function comment to top level functions.
                if (topLevelFunctions.indexOf(node) !== -1) {
                    const newNode = ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, pureFunctionComment, false);
                    // Replace node with modified one.
                    return ts.visitEachChild(newNode, visitor, context);
                }
                // Otherwise return node as is.
                return ts.visitEachChild(node, visitor, context);
            };
            return ts.visitNode(sf, visitor);
        };
        return transformer;
    };
}
exports.getPrefixFunctionsTransformer = getPrefixFunctionsTransformer;
function findTopLevelFunctions(parentNode) {
    const topLevelFunctions = [];
    let previousNode;
    function cb(node) {
        // Stop recursing into this branch if it's a function expression or declaration
        if (node.kind === ts.SyntaxKind.FunctionDeclaration
            || node.kind === ts.SyntaxKind.FunctionExpression) {
            return;
        }
        // We need to check specially for IIFEs formatted as call expressions inside parenthesized
        // expressions: `(function() {}())` Their start pos doesn't include the opening paren
        // and must be adjusted.
        if (isIIFE(node)
            && previousNode.kind === ts.SyntaxKind.ParenthesizedExpression
            && node.parent
            && !hasPureComment(node.parent)) {
            topLevelFunctions.push(node.parent);
        }
        else if ((node.kind === ts.SyntaxKind.CallExpression
            || node.kind === ts.SyntaxKind.NewExpression)
            && !hasPureComment(node)) {
            topLevelFunctions.push(node);
        }
        previousNode = node;
        ts.forEachChild(node, cb);
    }
    function isIIFE(node) {
        return node.kind === ts.SyntaxKind.CallExpression
            && node.expression.kind !== ts.SyntaxKind.PropertyAccessExpression;
    }
    ts.forEachChild(parentNode, cb);
    return topLevelFunctions;
}
exports.findTopLevelFunctions = findTopLevelFunctions;
function findPureImports(parentNode) {
    const pureImports = [];
    ts.forEachChild(parentNode, cb);
    function cb(node) {
        if (node.kind === ts.SyntaxKind.ImportDeclaration
            && node.importClause) {
            // Save the path of the import transformed into snake case and remove relative paths.
            const moduleSpecifier = node.moduleSpecifier;
            const pureImport = moduleSpecifier.text
                .replace(/[\/@\-]/g, '_')
                .replace(/^\.+/, '');
            pureImports.push(pureImport);
        }
        ts.forEachChild(node, cb);
    }
    return pureImports;
}
exports.findPureImports = findPureImports;
function hasPureComment(node) {
    const leadingComment = ts.getSyntheticLeadingComments(node);
    return leadingComment && leadingComment.some((comment) => comment.text === pureFunctionComment);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LWZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvcHJlZml4LWZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUdqQyxNQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQztBQUV4QztJQUNFLE1BQU0sQ0FBQyxDQUFDLE9BQWlDO1FBQ3ZDLE1BQU0sV0FBVyxHQUFrQyxDQUFDLEVBQWlCO1lBRW5FLE1BQU0saUJBQWlCLEdBQUcscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEQsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sa0JBQWtCLEdBQUcsd0JBQXdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDO1lBRTdGLE1BQU0sT0FBTyxHQUFlLENBQUMsSUFBYTtnQkFFeEMsa0RBQWtEO2dCQUNsRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RFLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQywwQkFBMEIsQ0FDM0MsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBRXhFLGtDQUFrQztvQkFDbEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdEQsQ0FBQztnQkFFRCxvREFBb0Q7Z0JBQ3BELEVB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QUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUI7ZUFDM0MsSUFBNkIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBRWpELHFGQUFxRjtZQUNyRixNQUFNLGVBQWUsR0FBSSxJQUE2QixDQUFDLGVBQW1DLENBQUM7WUFDM0YsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLElBQUk7aUJBQ3BDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDO2lCQUN4QixPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVELEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFwQkQsMENBb0JDO0FBRUQsd0JBQXdCLElBQWE7SUFDbkMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTVELE1BQU0sQ0FBQyxjQUFjLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUMsSUFBSSxLQUFLLG1CQUFtQixDQUFDLENBQUM7QUFDbEcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5cbmNvbnN0IHB1cmVGdW5jdGlvbkNvbW1lbnQgPSAnQF9fUFVSRV9fJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByZWZpeEZ1bmN0aW9uc1RyYW5zZm9ybWVyKCk6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybWVyOiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiA9IChzZjogdHMuU291cmNlRmlsZSkgPT4ge1xuXG4gICAgICBjb25zdCB0b3BMZXZlbEZ1bmN0aW9ucyA9IGZpbmRUb3BMZXZlbEZ1bmN0aW9ucyhzZik7XG4gICAgICBjb25zdCBwdXJlSW1wb3J0cyA9IGZpbmRQdXJlSW1wb3J0cyhzZik7XG4gICAgICBjb25zdCBwdXJlSW1wb3J0c0NvbW1lbnQgPSBgKiBQVVJFX0lNUE9SVFNfU1RBUlQgJHtwdXJlSW1wb3J0cy5qb2luKCcsJyl9IFBVUkVfSU1QT1JUU19FTkQgYDtcblxuICAgICAgY29uc3QgdmlzaXRvcjogdHMuVmlzaXRvciA9IChub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSA9PiB7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBwdXJlIGltcG9ydHMgY29tbWVudCB0byB0aGUgZmlyc3Qgbm9kZS5cbiAgICAgICAgaWYgKG5vZGUucGFyZW50ICYmIG5vZGUucGFyZW50LnBhcmVudCA9PT0gdW5kZWZpbmVkICYmIG5vZGUucG9zID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgbmV3Tm9kZSA9IHRzLmFkZFN5bnRoZXRpY0xlYWRpbmdDb21tZW50KFxuICAgICAgICAgICAgbm9kZSwgdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhLCBwdXJlSW1wb3J0c0NvbW1lbnQsIHRydWUpO1xuXG4gICAgICAgICAgLy8gUmVwbGFjZSBub2RlIHdpdGggbW9kaWZpZWQgb25lLlxuICAgICAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChuZXdOb2RlLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBwdXJlIGZ1bmN0aW9uIGNvbW1lbnQgdG8gdG9wIGxldmVsIGZ1bmN0aW9ucy5cbiAgICAgICAgaWYgKHRvcExldmVsRnVuY3Rpb25zLmluZGV4T2Yobm9kZSkgIT09IC0xKSB7XG4gICAgICAgICAgY29uc3QgbmV3Tm9kZSA9IHRzLmFkZFN5bnRoZXRpY0xlYWRpbmdDb21tZW50KFxuICAgICAgICAgICAgbm9kZSwgdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhLCBwdXJlRnVuY3Rpb25Db21tZW50LCBmYWxzZSk7XG5cbiAgICAgICAgICAvLyBSZXBsYWNlIG5vZGUgd2l0aCBtb2RpZmllZCBvbmUuXG4gICAgICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5ld05vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHJldHVybiBub2RlIGFzIGlzLlxuICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gdHMudmlzaXROb2RlKHNmLCB2aXNpdG9yKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRvcExldmVsRnVuY3Rpb25zKHBhcmVudE5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlW10ge1xuICBjb25zdCB0b3BMZXZlbEZ1bmN0aW9uczogdHMuTm9kZVtdID0gW107XG5cbiAgbGV0IHByZXZpb3VzTm9kZTogdHMuTm9kZTtcbiAgZnVuY3Rpb24gY2Iobm9kZTogdHMuTm9kZSkge1xuICAgIC8vIFN0b3AgcmVjdXJzaW5nIGludG8gdGhpcyBicmFuY2ggaWYgaXQncyBhIGZ1bmN0aW9uIGV4cHJlc3Npb24gb3IgZGVjbGFyYXRpb25cbiAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRGVjbGFyYXRpb25cbiAgICAgIHx8IG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5GdW5jdGlvbkV4cHJlc3Npb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHNwZWNpYWxseSBmb3IgSUlGRXMgZm9ybWF0dGVkIGFzIGNhbGwgZXhwcmVzc2lvbnMgaW5zaWRlIHBhcmVudGhlc2l6ZWRcbiAgICAvLyBleHByZXNzaW9uczogYChmdW5jdGlvbigpIHt9KCkpYCBUaGVpciBzdGFydCBwb3MgZG9lc24ndCBpbmNsdWRlIHRoZSBvcGVuaW5nIHBhcmVuXG4gICAgLy8gYW5kIG11c3QgYmUgYWRqdXN0ZWQuXG4gICAgaWYgKGlzSUlGRShub2RlKVxuICAgICAgICAmJiBwcmV2aW91c05vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5QYXJlbnRoZXNpemVkRXhwcmVzc2lvblxuICAgICAgICAmJiBub2RlLnBhcmVudFxuICAgICAgICAmJiAhaGFzUHVyZUNvbW1lbnQobm9kZS5wYXJlbnQpKSB7XG4gICAgICB0b3BMZXZlbEZ1bmN0aW9ucy5wdXNoKG5vZGUucGFyZW50KTtcbiAgICB9IGVsc2UgaWYgKChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgfHwgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLk5ld0V4cHJlc3Npb24pXG4gICAgICAgICYmICFoYXNQdXJlQ29tbWVudChub2RlKVxuICAgICkge1xuICAgICAgdG9wTGV2ZWxGdW5jdGlvbnMucHVzaChub2RlKTtcbiAgICB9XG5cbiAgICBwcmV2aW91c05vZGUgPSBub2RlO1xuXG4gICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIGNiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzSUlGRShub2RlOiB0cy5Ob2RlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvblxuICAgICAgLy8gVGhpcyBjaGVjayB3YXMgaW4gdGhlIG9sZCBuZ28gYnV0IGl0IGRvZXNuJ3Qgc2VlbSB0byBtYWtlIHNlbnNlIHdpdGggdGhlIHR5cGluZ3MuXG4gICAgICAvLyBUT0RPKGZpbGlwZXNpbHZhKTogYXNrIEFsZXggUmlja2FiYXVnaCBhYm91dCBpdC5cbiAgICAgIC8vICYmICEoPHRzLkNhbGxFeHByZXNzaW9uPm5vZGUpLmV4cHJlc3Npb24udGV4dFxuICAgICAgJiYgKG5vZGUgYXMgdHMuQ2FsbEV4cHJlc3Npb24pLmV4cHJlc3Npb24ua2luZCAhPT0gdHMuU3ludGF4S2luZC5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG4gIH1cblxuICB0cy5mb3JFYWNoQ2hpbGQocGFyZW50Tm9kZSwgY2IpO1xuXG4gIHJldHVybiB0b3BMZXZlbEZ1bmN0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQdXJlSW1wb3J0cyhwYXJlbnROb2RlOiB0cy5Ob2RlKTogc3RyaW5nW10ge1xuICBjb25zdCBwdXJlSW1wb3J0czogc3RyaW5nW10gPSBbXTtcbiAgdHMuZm9yRWFjaENoaWxkKHBhcmVudE5vZGUsIGNiKTtcblxuICBmdW5jdGlvbiBjYihub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvblxuICAgICAgJiYgKG5vZGUgYXMgdHMuSW1wb3J0RGVjbGFyYXRpb24pLmltcG9ydENsYXVzZSkge1xuXG4gICAgICAvLyBTYXZlIHRoZSBwYXRoIG9mIHRoZSBpbXBvcnQgdHJhbnNmb3JtZWQgaW50byBzbmFrZSBjYXNlIGFuZCByZW1vdmUgcmVsYXRpdmUgcGF0aHMuXG4gICAgICBjb25zdCBtb2R1bGVTcGVjaWZpZXIgPSAobm9kZSBhcyB0cy5JbXBvcnREZWNsYXJhdGlvbikubW9kdWxlU3BlY2lmaWVyIGFzIHRzLlN0cmluZ0xpdGVyYWw7XG4gICAgICBjb25zdCBwdXJlSW1wb3J0ID0gbW9kdWxlU3BlY2lmaWVyLnRleHRcbiAgICAgICAgLnJlcGxhY2UoL1tcXC9AXFwtXS9nLCAnXycpXG4gICAgICAgIC5yZXBsYWNlKC9eXFwuKy8sICcnKTtcbiAgICAgIHB1cmVJbXBvcnRzLnB1c2gocHVyZUltcG9ydCk7XG4gICAgfVxuXG4gICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIGNiKTtcbiAgfVxuXG4gIHJldHVybiBwdXJlSW1wb3J0cztcbn1cblxuZnVuY3Rpb24gaGFzUHVyZUNvbW1lbnQobm9kZTogdHMuTm9kZSkge1xuICBjb25zdCBsZWFkaW5nQ29tbWVudCA9IHRzLmdldFN5bnRoZXRpY0xlYWRpbmdDb21tZW50cyhub2RlKTtcblxuICByZXR1cm4gbGVhZGluZ0NvbW1lbnQgJiYgbGVhZGluZ0NvbW1lbnQuc29tZSgoY29tbWVudCkgPT4gY29tbWVudC50ZXh0ID09PSBwdXJlRnVuY3Rpb25Db21tZW50KTtcbn1cbiJdfQ==