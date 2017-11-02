"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignoreDep typescript
const ts = require("typescript");
const compiler_host_1 = require("../compiler_host");
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
function getFirstNode(sourceFile) {
    if (sourceFile.statements.length > 0) {
        return sourceFile.statements[0] || null;
    }
    return null;
}
exports.getFirstNode = getFirstNode;
function getLastNode(sourceFile) {
    if (sourceFile.statements.length > 0) {
        return sourceFile.statements[sourceFile.statements.length - 1] || null;
    }
    return null;
}
exports.getLastNode = getLastNode;
function transformTypescript(content, transformers) {
    // Set compiler options.
    const compilerOptions = {
        noEmitOnError: false,
        allowJs: true,
        newLine: ts.NewLineKind.LineFeed,
        target: ts.ScriptTarget.ESNext,
        skipLibCheck: true,
        sourceMap: false,
        importHelpers: true
    };
    // Create compiler host.
    const basePath = '/project/src/';
    const compilerHost = new compiler_host_1.WebpackCompilerHost(compilerOptions, basePath);
    // Add a dummy file to host content.
    const fileName = basePath + 'test-file.ts';
    compilerHost.writeFile(fileName, content, false);
    // Create the TypeScript program.
    const program = ts.createProgram([fileName], compilerOptions, compilerHost);
    // Emit.
    const { emitSkipped, diagnostics } = program.emit(undefined, undefined, undefined, undefined, { before: transformers });
    // Log diagnostics if emit wasn't successfull.
    if (emitSkipped) {
        console.log(diagnostics);
        return null;
    }
    // Return the transpiled js.
    return compilerHost.readFile(fileName.replace(/\.ts$/, '.js'));
}
exports.transformTypescript = transformTypescript;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/transformers/ast_helpers.js.map