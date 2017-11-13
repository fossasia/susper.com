"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const semver_1 = require("semver");
const interfaces_1 = require("./interfaces");
// Typescript below 2.5.0 needs a workaround.
const visitEachChild = semver_1.satisfies(ts.version, '^2.5.0')
    ? ts.visitEachChild
    : visitEachChildWorkaround;
function makeTransform(standardTransform) {
    return (context) => {
        const transformer = (sf) => {
            const ops = standardTransform(sf);
            const removeOps = ops
                .filter((op) => op.kind === interfaces_1.OPERATION_KIND.Remove);
            const addOps = ops.filter((op) => op.kind === interfaces_1.OPERATION_KIND.Add);
            const replaceOps = ops
                .filter((op) => op.kind === interfaces_1.OPERATION_KIND.Replace);
            const visitor = (node) => {
                let modified = false;
                let modifiedNodes = [node];
                // Check if node should be dropped.
                if (removeOps.find((op) => op.target === node)) {
                    modifiedNodes = [];
                    modified = true;
                }
                // Check if node should be replaced (only replaces with first op found).
                const replace = replaceOps.find((op) => op.target === node);
                if (replace) {
                    modifiedNodes = [replace.replacement];
                    modified = true;
                }
                // Check if node should be added to.
                const add = addOps.filter((op) => op.target === node);
                if (add.length > 0) {
                    modifiedNodes = [
                        ...add.filter((op) => op.before).map(((op) => op.before)),
                        ...modifiedNodes,
                        ...add.filter((op) => op.after).map(((op) => op.after))
                    ];
                    modified = true;
                }
                // If we changed anything, return modified nodes without visiting further.
                if (modified) {
                    return modifiedNodes;
                }
                else {
                    // Otherwise return node as is and visit children.
                    return visitEachChild(node, visitor, context);
                }
            };
            // Only visit source files we have ops for.
            return ops.length > 0 ? ts.visitNode(sf, visitor) : sf;
        };
        return transformer;
    };
}
exports.makeTransform = makeTransform;
/**
 * This is a version of `ts.visitEachChild` that works that calls our version
 * of `updateSourceFileNode`, so that typescript doesn't lose type information
 * for property decorators.
 * See https://github.com/Microsoft/TypeScript/issues/17384 and
 * https://github.com/Microsoft/TypeScript/issues/17551, fixed by
 * https://github.com/Microsoft/TypeScript/pull/18051 and released on TS 2.5.0.
 *
 * @param sf
 * @param statements
 */
function visitEachChildWorkaround(node, visitor, context) {
    if (node.kind === ts.SyntaxKind.SourceFile) {
        const sf = node;
        const statements = ts.visitLexicalEnvironment(sf.statements, visitor, context);
        if (statements === sf.statements) {
            return sf;
        }
        // Note: Need to clone the original file (and not use `ts.updateSourceFileNode`)
        // as otherwise TS fails when resolving types for decorators.
        const sfClone = ts.getMutableClone(sf);
        sfClone.statements = statements;
        return sfClone;
    }
    return ts.visitEachChild(node, visitor, context);
}
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/transformers/make_transform.js.map