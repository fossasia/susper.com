"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var node_1 = require("../typeguard/node");
function endsControlFlow(statement) {
    if (node_1.isBlockLike(statement))
        return handleBlock(statement).end;
    switch (statement.kind) {
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.SwitchStatement:
            if (statement.parent.kind === ts.SyntaxKind.LabeledStatement)
                statement = statement.parent;
    }
    return getControlFlowEnd(statement).end;
}
exports.endsControlFlow = endsControlFlow;
var defaultControlFlowEnd = { statements: [], end: false };
function getControlFlowEnd(statement, label) {
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
            return matchBreakOrContinue(getControlFlowEnd(statement.statement), node_1.isBreakOrContinueStatement, label);
        case ts.SyntaxKind.IfStatement:
            return handleIfStatement(statement);
        case ts.SyntaxKind.SwitchStatement:
            return matchBreakOrContinue(handleSwitchStatement(statement), node_1.isBreakStatement, label);
        case ts.SyntaxKind.TryStatement:
            return handleTryStatement(statement);
        case ts.SyntaxKind.LabeledStatement:
            return getControlFlowEnd(statement.statement, statement.label);
        case ts.SyntaxKind.WithStatement:
            return getControlFlowEnd(statement.statement);
        default:
            return defaultControlFlowEnd;
    }
}
function handleBlock(statement) {
    var result = { statements: [], end: false };
    for (var _i = 0, _a = statement.statements; _i < _a.length; _i++) {
        var s = _a[_i];
        var current = getControlFlowEnd(s);
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
    var then = getControlFlowEnd(node.thenStatement);
    if (node.elseStatement === undefined) {
        then.end = false;
        return then;
    }
    var elze = getControlFlowEnd(node.elseStatement);
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
    var result;
    if (node.finallyBlock !== undefined) {
        result = handleBlock(node.finallyBlock);
        if (result.end)
            return result;
    }
    var tryResult = handleBlock(node.tryBlock);
    result = result === undefined
        ? tryResult
        : { statements: result.statements.concat(tryResult.statements), end: tryResult.end };
    if (node.catchClause !== undefined) {
        var current = handleBlock(node.catchClause.block);
        result = {
            statements: result.statements.concat(current.statements),
            end: current.end,
        };
    }
    return result;
}
function matchBreakOrContinue(current, pred, label) {
    var result = {
        end: current.end,
        statements: [],
    };
    for (var _i = 0, _a = current.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (pred(statement) && (statement.label === undefined || label !== undefined && statement.label.text === label.text)) {
            result.end = false;
            continue;
        }
        result.statements.push(statement);
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC1mbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJvbC1mbG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBQ2pDLDBDQUE4RjtBQUU5Rix5QkFBZ0MsU0FBc0M7SUFDbEUsRUFBRSxDQUFDLENBQUMsa0JBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyQixLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1FBQ2hDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7UUFDbEMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQUNsQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBQ2xDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7UUFDL0IsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWU7WUFDOUIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU8sQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDMUQsU0FBUyxHQUF3QixTQUFTLENBQUMsTUFBTSxDQUFDO0lBQzlELENBQUM7SUFDRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQzVDLENBQUM7QUFkRCwwQ0FjQztBQVFELElBQU0scUJBQXFCLEdBQW1CLEVBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFDLENBQUM7QUFFM0UsMkJBQTJCLFNBQXVCLEVBQUUsS0FBcUI7SUFDckUsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENB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