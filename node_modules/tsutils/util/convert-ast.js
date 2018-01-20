"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function convertAst(sourceFile) {
    var wrapped = {
        node: sourceFile,
        parent: undefined,
        kind: ts.SyntaxKind.SourceFile,
        children: [],
        next: undefined,
        skip: undefined,
    };
    var flat = [];
    var current = wrapped;
    var previous = current;
    ts.forEachChild(sourceFile, function wrap(node) {
        flat.push(node);
        var parent = current;
        previous.next = current = {
            node: node,
            parent: parent,
            kind: node.kind,
            children: [],
            next: undefined,
            skip: undefined,
        };
        if (previous !== parent)
            setSkip(previous, current);
        previous = current;
        parent.children.push(current);
        ts.forEachChild(node, wrap);
        current = parent;
    });
    return {
        wrapped: wrapped,
        flat: flat,
    };
}
exports.convertAst = convertAst;
function setSkip(node, skip) {
    do {
        node.skip = skip;
        node = node.parent;
    } while (node !== skip.parent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydC1hc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb252ZXJ0LWFzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQW1DakMsb0JBQTJCLFVBQXlCO0lBQ2hELElBQU0sT0FBTyxHQUFlO1FBQ3hCLElBQUksRUFBRSxVQUFVO1FBQ2hCLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVU7UUFDOUIsUUFBUSxFQUFFLEVBQUU7UUFDWixJQUFJLEVBQU8sU0FBUztRQUNwQixJQUFJLEVBQUUsU0FBUztLQUNsQixDQUFDO0lBQ0YsSUFBTSxJQUFJLEdBQWMsRUFBRSxDQUFDO0lBQzNCLElBQUksT0FBTyxHQUFhLE9BQU8sQ0FBQztJQUNoQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDdkIsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBYyxJQUFJO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHO1lBQ3RCLElBQUksTUFBQTtZQUNKLE1BQU0sUUFBQTtZQUNOLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLFFBQVEsRUFBRSxFQUFFO1lBQ1osSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVBQUUsU0FBUztTQUNsQixDQUFDO1FBQ0YsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQztZQUNwQixPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRS9CLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDbkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFNUIsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUNyQixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQztRQUNILE9BQU8sU0FBQTtRQUNQLElBQUksTUFBQTtLQUNQLENBQUM7QUFDTixDQUFDO0FBdENELGdDQXNDQztBQUVELGlCQUFpQixJQUFjLEVBQUUsSUFBYztJQUMzQyxHQUFHLENBQUM7UUFDQSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU8sQ0FBQztJQUN4QixDQUFDLFFBQVEsSUFBSSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDbkMsQ0FBQyJ9