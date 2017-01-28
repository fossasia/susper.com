"use strict";
var change_1 = require('./change');
/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param max The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
function findNodes(node, kind, max) {
    if (max === void 0) { max = Infinity; }
    if (!node || max == 0) {
        return [];
    }
    var arr = [];
    if (node.kind === kind) {
        arr.push(node);
        max--;
    }
    if (max > 0) {
        for (var _i = 0, _a = node.getChildren(); _i < _a.length; _i++) {
            var child = _a[_i];
            findNodes(child, kind, max).forEach(function (node) {
                if (max > 0) {
                    arr.push(node);
                }
                max--;
            });
            if (max <= 0) {
                break;
            }
        }
    }
    return arr;
}
exports.findNodes = findNodes;
function removeAstNode(node) {
    var source = node.getSourceFile();
    return new change_1.RemoveChange(source.path, node.getStart(source), node.getFullText(source));
}
exports.removeAstNode = removeAstNode;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@angular-cli/ast-tools/src/node.js.map