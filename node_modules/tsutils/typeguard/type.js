"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function isEnumType(type) {
    return (type.flags & ts.TypeFlags.Enum) !== 0;
}
exports.isEnumType = isEnumType;
function isGenericType(type) {
    return (type.flags & ts.TypeFlags.Object) !== 0 &&
        (type.objectFlags & ts.ObjectFlags.ClassOrInterface) !== 0 &&
        (type.objectFlags & ts.ObjectFlags.Reference) !== 0;
}
exports.isGenericType = isGenericType;
function isIndexedAccessType(type) {
    return (type.flags & ts.TypeFlags.IndexedAccess) !== 0;
}
exports.isIndexedAccessType = isIndexedAccessType;
function isIndexedAccessype(type) {
    return (type.flags & ts.TypeFlags.Index) !== 0;
}
exports.isIndexedAccessype = isIndexedAccessype;
function isInterfaceType(type) {
    return (type.flags & ts.TypeFlags.Object) !== 0 &&
        (type.objectFlags & ts.ObjectFlags.ClassOrInterface) !== 0;
}
exports.isInterfaceType = isInterfaceType;
function isIntersectionType(type) {
    return (type.flags & ts.TypeFlags.Intersection) !== 0;
}
exports.isIntersectionType = isIntersectionType;
function isLiteralType(type) {
    return (type.flags & ts.TypeFlags.StringOrNumberLiteral) !== 0;
}
exports.isLiteralType = isLiteralType;
function isObjectType(type) {
    return (type.flags & ts.TypeFlags.Object) !== 0;
}
exports.isObjectType = isObjectType;
function isTypeParameter(type) {
    return (type.flags & ts.TypeFlags.TypeParameter) !== 0;
}
exports.isTypeParameter = isTypeParameter;
function isTypeReference(type) {
    return (type.flags & ts.TypeFlags.Object) !== 0 &&
        (type.objectFlags & ts.ObjectFlags.Reference) !== 0;
}
exports.isTypeReference = isTypeReference;
function isTypeVariable(type) {
    return (type.flags & ts.TypeFlags.TypeVariable) !== 0;
}
exports.isTypeVariable = isTypeVariable;
function isUnionOrIntersectionType(type) {
    return (type.flags & ts.TypeFlags.UnionOrIntersection) !== 0;
}
exports.isUnionOrIntersectionType = isUnionOrIntersectionType;
function isUnionType(type) {
    return (type.flags & ts.TypeFlags.Union) !== 0;
}
exports.isUnionType = isUnionType;
function isUniqueESSymbolType(type) {
    return (type.flags & ts.TypeFlags.UniqueESSymbol) !== 0;
}
exports.isUniqueESSymbolType = isUniqueESSymbolType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakMsb0JBQTJCLElBQWE7SUFDcEMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRkQsZ0NBRUM7QUFFRCx1QkFBOEIsSUFBYTtJQUN2QyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUMzQyxDQUFpQixJQUFLLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO1FBQzNFLENBQWlCLElBQUssQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUpELHNDQUlDO0FBRUQsNkJBQW9DLElBQWE7SUFDN0MsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRkQsa0RBRUM7QUFFRCw0QkFBbUMsSUFBYTtJQUM1QyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFGRCxnREFFQztBQUVELHlCQUFnQyxJQUFhO0lBQ3pDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzNDLENBQWlCLElBQUssQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRixDQUFDO0FBSEQsMENBR0M7QUFFRCw0QkFBbUMsSUFBYTtJQUM1QyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCxnREFFQztBQUVELHVCQUE4QixJQUFhO0lBQ3ZDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBRkQsc0NBRUM7QUFFRCxzQkFBNkIsSUFBYTtJQUN0QyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFGRCxvQ0FFQztBQUVELHlCQUFnQyxJQUFhO0lBQ3pDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUZELDBDQUVDO0FBRUQseUJBQWdDLElBQWE7SUFDekMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDM0MsQ0FBaUIsSUFBSyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBSEQsMENBR0M7QUFFRCx3QkFBK0IsSUFBYTtJQUN4QyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCx3Q0FFQztBQUVELG1DQUEwQyxJQUFhO0lBQ25ELE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRkQsOERBRUM7QUFFRCxxQkFBNEIsSUFBYTtJQUNyQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFGRCxrQ0FFQztBQUVELDhCQUFxQyxJQUFhO0lBQzlDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUZELG9EQUVDIn0=