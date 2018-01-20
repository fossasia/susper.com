"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var node_1 = require("../typeguard/node");
function endsControlFlow(statement) {
    return getControlFlowEnd(statement).end;
}
exports.endsControlFlow = endsControlFlow;
var defaultControlFlowEnd = { statements: [], end: false };
function getControlFlowEnd(statement) {
    return node_1.isBlockLike(statement) ? handleBlock(statement) : getControlFlowEndWorker(statement);
}
exports.getControlFlowEnd = getControlFlowEnd;
function getControlFlowEndWorker(statement) {
    switch (statement.kind) {
        case ts.SyntaxKind.ReturnStatement:
        case ts.SyntaxKind.ThrowStatement:
        case ts.SyntaxKind.ContinueStatement:
        case ts.SyntaxKind.BreakStatement:
            return { statements: [statement], end: true };
        case ts.SyntaxKind.Block:
            return handleBlock(statement);
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.WhileStatement:
            return matchBreakOrContinue(getControlFlowEndWorker(statement.statement), node_1.isBreakOrContinueStatement);
        case ts.SyntaxKind.IfStatement:
            return handleIfStatement(statement);
        case ts.SyntaxKind.SwitchStatement:
            return matchBreakOrContinue(handleSwitchStatement(statement), node_1.isBreakStatement);
        case ts.SyntaxKind.TryStatement:
            return handleTryStatement(statement);
        case ts.SyntaxKind.LabeledStatement:
            return matchLabel(getControlFlowEndWorker(statement.statement), statement.label);
        case ts.SyntaxKind.WithStatement:
            return getControlFlowEndWorker(statement.statement);
        default:
            return defaultControlFlowEnd;
    }
}
function handleBlock(statement) {
    var result = { statements: [], end: false };
    for (var _i = 0, _a = statement.statements; _i < _a.length; _i++) {
        var s = _a[_i];
        var current = getControlFlowEndWorker(s);
        (_b = result.statements).push.apply(_b, current.statements);
        if (current.end) {
            result.end = true;
            break;
        }
    }
    return result;
    var _b;
}
function handleIfStatement(node) {
    var then = getControlFlowEndWorker(node.thenStatement);
    if (node.elseStatement === undefined) {
        then.end = false;
        return then;
    }
    var elze = getControlFlowEndWorker(node.elseStatement);
    return {
        statements: then.statements.concat(elze.statements),
        end: then.end && elze.end,
    };
}
function handleSwitchStatement(node) {
    var hasDefault = false;
    var result = {
        statements: [],
        end: false,
    };
    for (var _i = 0, _a = node.caseBlock.clauses; _i < _a.length; _i++) {
        var clause = _a[_i];
        if (clause.kind === ts.SyntaxKind.DefaultClause)
            hasDefault = true;
        var current = handleBlock(clause);
        result.end = current.end;
        (_b = result.statements).push.apply(_b, current.statements);
    }
    if (!hasDefault)
        result.end = false;
    return result;
    var _b;
}
function handleTryStatement(node) {
    var finallyResult;
    if (node.finallyBlock !== undefined) {
        finallyResult = handleBlock(node.finallyBlock);
        if (finallyResult.end)
            return finallyResult;
    }
    var tryResult = handleBlock(node.tryBlock);
    if (node.catchClause === undefined)
        return finallyResult === undefined
            ? tryResult
            : { statements: finallyResult.statements.concat(tryResult.statements), end: tryResult.end };
    var catchResult = handleBlock(node.catchClause.block);
    return {
        statements: tryResult.statements
            .filter(function (s) { return s.kind !== ts.SyntaxKind.ThrowStatement; })
            .concat(catchResult.statements, finallyResult === undefined ? [] : finallyResult.statements),
        end: tryResult.end && catchResult.end,
    };
}
function matchBreakOrContinue(current, pred) {
    var result = {
        statements: [],
        end: current.end,
    };
    for (var _i = 0, _a = current.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (pred(statement) && statement.label === undefined) {
            result.end = false;
            continue;
        }
        result.statements.push(statement);
    }
    return result;
}
function matchLabel(current, label) {
    var result = {
        statements: [],
        end: current.end,
    };
    var labelText = label.text;
    for (var _i = 0, _a = current.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        switch (statement.kind) {
            case ts.SyntaxKind.BreakStatement:
            case ts.SyntaxKind.ContinueStatement:
                if (statement.label !== undefined && statement.label.text === labelText) {
                    result.end = false;
                    continue;
                }
        }
        result.statements.push(statement);
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC1mbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJvbC1mbG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBQ2pDLDBDQUE4RjtBQUU5Rix5QkFBZ0MsU0FBc0M7SUFDbEUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUM1QyxDQUFDO0FBRkQsMENBRUM7QUFhRCxJQUFNLHFCQUFxQixHQUFtQixFQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBQyxDQUFDO0FBSzNFLDJCQUFrQyxTQUFzQztJQUNwRSxNQUFNLENBQUMsa0JBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRyxDQUFDO0FBRkQsOENBRUM7QUFFRCxpQ0FBaUMsU0FBdUI7SUFDcEQsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDckIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztRQUNuQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBQ2xDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQztRQUNyQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYztZQUM3QixNQUFNLENBQUMsRUFBQyxVQUFVLEVBQUUsQ0FBdUIsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3RFLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLO1lBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQVcsU0FBUyxDQUFDLENBQUM7UUFDNUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztRQUNoQyxLQUFLLEVBQUUsQ0FB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