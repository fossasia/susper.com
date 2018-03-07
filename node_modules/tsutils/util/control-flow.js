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
        case ts.SyntaxKind.WhileStatement:
            return handleForAndWhileStatement(statement);
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.ForInStatement:
            return handleForInOrOfStatement(statement);
        case ts.SyntaxKind.DoStatement:
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
function handleForInOrOfStatement(statement) {
    var end = matchBreakOrContinue(getControlFlowEndWorker(statement.statement), node_1.isBreakOrContinueStatement);
    end.end = false;
    return end;
}
function handleForAndWhileStatement(statement) {
    var constantCondition = statement.kind === ts.SyntaxKind.WhileStatement
        ? getConstantCondition(statement.expression)
        : statement.condition === undefined || getConstantCondition(statement.condition);
    if (constantCondition === false)
        return defaultControlFlowEnd;
    var end = matchBreakOrContinue(getControlFlowEndWorker(statement.statement), node_1.isBreakOrContinueStatement);
    if (constantCondition === undefined)
        end.end = false;
    return end;
}
function getConstantCondition(node) {
    switch (node.kind) {
        case ts.SyntaxKind.TrueKeyword:
            return true;
        case ts.SyntaxKind.FalseKeyword:
            return false;
        default:
            return;
    }
}
function handleIfStatement(node) {
    switch (getConstantCondition(node.expression)) {
        case true:
            return getControlFlowEndWorker(node.thenStatement);
        case false:
            return node.elseStatement === undefined
                ? defaultControlFlowEnd
                : getControlFlowEndWorker(node.elseStatement);
    }
    var then = getControlFlowEndWorker(node.thenStatement);
    if (node.elseStatement === undefined)
        return {
            statements: then.statements,
            end: false,
        };
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
        return { statements: finallyResult.statements.concat(tryResult.statements), end: tryResult.end };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC1mbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJvbC1mbG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBQ2pDLDBDQUE4RjtBQUU5Rix5QkFBZ0MsU0FBc0M7SUFDbEUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUM1QyxDQUFDO0FBRkQsMENBRUM7QUFpQkQsSUFBTSxxQkFBcUIsR0FBbUIsRUFBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQztBQUszRSwyQkFBa0MsU0FBc0M7SUFDcEUsTUFBTSxDQUFDLGtCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEcsQ0FBQztBQUZELDhDQUVDO0FBRUQsaUNBQWlDLFNBQXVCO0lBQ3BELE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7UUFDbkMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQUNsQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUM7UUFDckMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWM7WUFDN0IsTUFBTSxDQUFDLEVBQUMsVUFBVSxFQUFFLENBQXVCLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUN0RSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSztZQUNwQixNQUFNLENBQUMsV0FBVyxDQUFXLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUM7UUFDaEMsS0FBSyxFQUFFLENB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