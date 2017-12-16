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
            // This check was in the old ngo but it doesn't seem to make sense with the typings.
            // TODO(filipesilva): ask Alex Rickabaugh about it.
            // && !(<ts.CallExpression>node).expression.text
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LWZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvcHJlZml4LWZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUdqQyxNQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQztBQUV4QztJQUNFLE1BQU0sQ0FBQyxDQUFDLE9BQWlDLEVBQWlDLEVBQUU7UUFDMUUsTUFBTSxXQUFXLEdBQWtDLENBQUMsRUFBaUIsRUFBRSxFQUFFO1lBRXZFLE1BQU0saUJBQWlCLEdBQUcscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEQsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sa0JBQWtCLEdBQUcsd0JBQXdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDO1lBRTdGLE1BQU0sT0FBTyxHQUFlLENBQUMsSUFBYSxFQUFXLEVBQUU7Z0JBRXJELGtEQUFrRDtnQkFDbEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RSxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsMEJBQTBCLENBQzNDLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO29CQUV4RSxrQ0FBa0M7b0JBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JB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LEVBQUUsQ0FBQyxDQUFDO0lBRWhDLFlBQVksSUFBYTtRQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCO2VBQzNDLElBQTZCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUVqRCxxRkFBcUY7WUFDckYsTUFBTSxlQUFlLEdBQUksSUFBNkIsQ0FBQyxlQUFtQyxDQUFDO1lBQzNGLE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxJQUFJO2lCQUNwQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQztpQkFDeEIsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN2QixXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBcEJELDBDQW9CQztBQUVELHdCQUF3QixJQUFhO0lBQ25DLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1RCxNQUFNLENBQUMsY0FBYyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssbUJBQW1CLENBQUMsQ0FBQztBQUNsRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cblxuY29uc3QgcHVyZUZ1bmN0aW9uQ29tbWVudCA9ICdAX19QVVJFX18nO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIoKTogdHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLlNvdXJjZUZpbGU+IHtcbiAgcmV0dXJuIChjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpOiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtZXI6IHRzLlRyYW5zZm9ybWVyPHRzLlNvdXJjZUZpbGU+ID0gKHNmOiB0cy5Tb3VyY2VGaWxlKSA9PiB7XG5cbiAgICAgIGNvbnN0IHRvcExldmVsRnVuY3Rpb25zID0gZmluZFRvcExldmVsRnVuY3Rpb25zKHNmKTtcbiAgICAgIGNvbnN0IHB1cmVJbXBvcnRzID0gZmluZFB1cmVJbXBvcnRzKHNmKTtcbiAgICAgIGNvbnN0IHB1cmVJbXBvcnRzQ29tbWVudCA9IGAqIFBVUkVfSU1QT1JUU19TVEFSVCAke3B1cmVJbXBvcnRzLmpvaW4oJywnKX0gUFVSRV9JTVBPUlRTX0VORCBgO1xuXG4gICAgICBjb25zdCB2aXNpdG9yOiB0cy5WaXNpdG9yID0gKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlID0+IHtcblxuICAgICAgICAvLyBBZGQgdGhlIHB1cmUgaW1wb3J0cyBjb21tZW50IHRvIHRoZSBmaXJzdCBub2RlLlxuICAgICAgICBpZiAobm9kZS5wYXJlbnQgJiYgbm9kZS5wYXJlbnQucGFyZW50ID09PSB1bmRlZmluZWQgJiYgbm9kZS5wb3MgPT09IDApIHtcbiAgICAgICAgICBjb25zdCBuZXdOb2RlID0gdHMuYWRkU3ludGhldGljTGVhZGluZ0NvbW1lbnQoXG4gICAgICAgICAgICBub2RlLCB0cy5TeW50YXhLaW5kLk11bHRpTGluZUNvbW1lbnRUcml2aWEsIHB1cmVJbXBvcnRzQ29tbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgICAvLyBSZXBsYWNlIG5vZGUgd2l0aCBtb2RpZmllZCBvbmUuXG4gICAgICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5ld05vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHB1cmUgZnVuY3Rpb24gY29tbWVudCB0byB0b3AgbGV2ZWwgZnVuY3Rpb25zLlxuICAgICAgICBpZiAodG9wTGV2ZWxGdW5jdGlvbnMuaW5kZXhPZihub2RlKSAhPT0gLTEpIHtcbiAgICAgICAgICBjb25zdCBuZXdOb2RlID0gdHMuYWRkU3ludGhldGljTGVhZGluZ0NvbW1lbnQoXG4gICAgICAgICAgICBub2RlLCB0cy5TeW50YXhLaW5kLk11bHRpTGluZUNvbW1lbnRUcml2aWEsIHB1cmVGdW5jdGlvbkNvbW1lbnQsIGZhbHNlKTtcblxuICAgICAgICAgIC8vIFJlcGxhY2Ugbm9kZSB3aXRoIG1vZGlmaWVkIG9uZS5cbiAgICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobmV3Tm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UgcmV0dXJuIG5vZGUgYXMgaXMuXG4gICAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChub2RlLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0cy52aXNpdE5vZGUoc2YsIHZpc2l0b3IpO1xuICAgIH07XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtZXI7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVG9wTGV2ZWxGdW5jdGlvbnMocGFyZW50Tm9kZTogdHMuTm9kZSk6IHRzLk5vZGVbXSB7XG4gIGNvbnN0IHRvcExldmVsRnVuY3Rpb25zOiB0cy5Ob2RlW10gPSBbXTtcblxuICBsZXQgcHJldmlvdXNOb2RlOiB0cy5Ob2RlO1xuICBmdW5jdGlvbiBjYihub2RlOiB0cy5Ob2RlKSB7XG4gICAgLy8gU3RvcCByZWN1cnNpbmcgaW50byB0aGlzIGJyYW5jaCBpZiBpdCdzIGEgZnVuY3Rpb24gZXhwcmVzc2lvbiBvciBkZWNsYXJhdGlvblxuICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvblxuICAgICAgfHwgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRXhwcmVzc2lvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgc3BlY2lhbGx5IGZvciBJSUZFcyBmb3JtYXR0ZWQgYXMgY2FsbCBleHByZXNzaW9ucyBpbnNpZGUgcGFyZW50aGVzaXplZFxuICAgIC8vIGV4cHJlc3Npb25zOiBgKGZ1bmN0aW9uKCkge30oKSlgIFRoZWlyIHN0YXJ0IHBvcyBkb2Vzbid0IGluY2x1ZGUgdGhlIG9wZW5pbmcgcGFyZW5cbiAgICAvLyBhbmQgbXVzdCBiZSBhZGp1c3RlZC5cbiAgICBpZiAoaXNJSUZFKG5vZGUpXG4gICAgICAgICYmIHByZXZpb3VzTm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uXG4gICAgICAgICYmIG5vZGUucGFyZW50XG4gICAgICAgICYmICFoYXNQdXJlQ29tbWVudChub2RlLnBhcmVudCkpIHtcbiAgICAgIHRvcExldmVsRnVuY3Rpb25zLnB1c2gobm9kZS5wYXJlbnQpO1xuICAgIH0gZWxzZSBpZiAoKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvblxuICAgICAgICAgICAgICB8fCBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTmV3RXhwcmVzc2lvbilcbiAgICAgICAgJiYgIWhhc1B1cmVDb21tZW50KG5vZGUpXG4gICAgKSB7XG4gICAgICB0b3BMZXZlbEZ1bmN0aW9ucy5wdXNoKG5vZGUpO1xuICAgIH1cblxuICAgIHByZXZpb3VzTm9kZSA9IG5vZGU7XG5cbiAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgY2IpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNJSUZFKG5vZGU6IHRzLk5vZGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uXG4gICAgICAvLyBUaGlzIGNoZWNrIHdhcyBpbiB0aGUgb2xkIG5nbyBidXQgaXQgZG9lc24ndCBzZWVtIHRvIG1ha2Ugc2Vuc2Ugd2l0aCB0aGUgdHlwaW5ncy5cbiAgICAgIC8vIFRPRE8oZmlsaXBlc2lsdmEpOiBhc2sgQWxleCBSaWNrYWJhdWdoIGFib3V0IGl0LlxuICAgICAgLy8gJiYgISg8dHMuQ2FsbEV4cHJlc3Npb24+bm9kZSkuZXhwcmVzc2lvbi50ZXh0XG4gICAgICAmJiAobm9kZSBhcyB0cy5DYWxsRXhwcmVzc2lvbikuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjtcbiAgfVxuXG4gIHRzLmZvckVhY2hDaGlsZChwYXJlbnROb2RlLCBjYik7XG5cbiAgcmV0dXJuIHRvcExldmVsRnVuY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFB1cmVJbXBvcnRzKHBhcmVudE5vZGU6IHRzLk5vZGUpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHB1cmVJbXBvcnRzOiBzdHJpbmdbXSA9IFtdO1xuICB0cy5mb3JFYWNoQ2hpbGQocGFyZW50Tm9kZSwgY2IpO1xuXG4gIGZ1bmN0aW9uIGNiKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkltcG9ydERlY2xhcmF0aW9uXG4gICAgICAmJiAobm9kZSBhcyB0cy5JbXBvcnREZWNsYXJhdGlvbikuaW1wb3J0Q2xhdXNlKSB7XG5cbiAgICAgIC8vIFNhdmUgdGhlIHBhdGggb2YgdGhlIGltcG9ydCB0cmFuc2Zvcm1lZCBpbnRvIHNuYWtlIGNhc2UgYW5kIHJlbW92ZSByZWxhdGl2ZSBwYXRocy5cbiAgICAgIGNvbnN0IG1vZHVsZVNwZWNpZmllciA9IChub2RlIGFzIHRzLkltcG9ydERlY2xhcmF0aW9uKS5tb2R1bGVTcGVjaWZpZXIgYXMgdHMuU3RyaW5nTGl0ZXJhbDtcbiAgICAgIGNvbnN0IHB1cmVJbXBvcnQgPSBtb2R1bGVTcGVjaWZpZXIudGV4dFxuICAgICAgICAucmVwbGFjZSgvW1xcL0BcXC1dL2csICdfJylcbiAgICAgICAgLnJlcGxhY2UoL15cXC4rLywgJycpO1xuICAgICAgcHVyZUltcG9ydHMucHVzaChwdXJlSW1wb3J0KTtcbiAgICB9XG5cbiAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgY2IpO1xuICB9XG5cbiAgcmV0dXJuIHB1cmVJbXBvcnRzO1xufVxuXG5mdW5jdGlvbiBoYXNQdXJlQ29tbWVudChub2RlOiB0cy5Ob2RlKSB7XG4gIGNvbnN0IGxlYWRpbmdDb21tZW50ID0gdHMuZ2V0U3ludGhldGljTGVhZGluZ0NvbW1lbnRzKG5vZGUpO1xuXG4gIHJldHVybiBsZWFkaW5nQ29tbWVudCAmJiBsZWFkaW5nQ29tbWVudC5zb21lKChjb21tZW50KSA9PiBjb21tZW50LnRleHQgPT09IHB1cmVGdW5jdGlvbkNvbW1lbnQpO1xufVxuIl19