"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var type_1 = require("../typeguard/type");
var util_1 = require("./util");
function isEmptyObjectType(type) {
    if (type.flags & ts.TypeFlags.Object &&
        type.objectFlags & ts.ObjectFlags.Anonymous &&
        type.getProperties().length === 0 &&
        type.getCallSignatures().length === 0 &&
        type.getConstructSignatures().length === 0 &&
        type.getStringIndexType() === undefined &&
        type.getNumberIndexType() === undefined) {
        var baseTypes = type.getBaseTypes();
        return baseTypes === undefined || baseTypes.every(isEmptyObjectType);
    }
    return false;
}
exports.isEmptyObjectType = isEmptyObjectType;
function removeOptionalityFromType(checker, type) {
    if (!containsTypeWithFlag(type, ts.TypeFlags.Undefined))
        return type;
    var allowsNull = containsTypeWithFlag(type, ts.TypeFlags.Null);
    type = checker.getNonNullableType(type);
    return allowsNull ? checker.getNullableType(type, ts.TypeFlags.Null) : type;
}
exports.removeOptionalityFromType = removeOptionalityFromType;
function containsTypeWithFlag(type, flag) {
    if (!type_1.isUnionType(type))
        return util_1.isTypeFlagSet(type, flag);
    for (var _i = 0, _a = type.types; _i < _a.length; _i++) {
        var t = _a[_i];
        if (util_1.isTypeFlagSet(t, flag))
            return true;
    }
    return false;
}
function isTypeAssignableToNumber(checker, type) {
    return isTypeAssignableTo(checker, type, ts.TypeFlags.NumberLike);
}
exports.isTypeAssignableToNumber = isTypeAssignableToNumber;
function isTypeAssignableToString(checker, type) {
    return isTypeAssignableTo(checker, type, ts.TypeFlags.StringLike);
}
exports.isTypeAssignableToString = isTypeAssignableToString;
function isTypeAssignableTo(checker, type, flags) {
    flags |= ts.TypeFlags.Any;
    var typeParametersSeen;
    return (function check(t) {
        if (type_1.isTypeParameter(t) && t.symbol !== undefined && t.symbol.declarations !== undefined) {
            if (typeParametersSeen === undefined) {
                typeParametersSeen = new Set([t]);
            }
            else if (!typeParametersSeen.has(t)) {
                typeParametersSeen.add(t);
            }
            else {
                return false;
            }
            var declaration = t.symbol.declarations[0];
            if (declaration.constraint === undefined)
                return true;
            return check(checker.getTypeFromTypeNode(declaration.constraint));
        }
        if (type_1.isUnionType(t))
            return t.types.every(check);
        if (type_1.isIntersectionType(t))
            return t.types.some(check);
        return util_1.isTypeFlagSet(t, flags);
    })(type);
}
function getCallSignaturesOfType(type) {
    if (type_1.isUnionType(type)) {
        var signatures = [];
        for (var _i = 0, _a = type.types; _i < _a.length; _i++) {
            var t = _a[_i];
            signatures.push.apply(signatures, getCallSignaturesOfType(t));
        }
        return signatures;
    }
    if (type_1.isIntersectionType(type)) {
        var signatures = void 0;
        for (var _b = 0, _c = type.types; _b < _c.length; _b++) {
            var t = _c[_b];
            var sig = getCallSignaturesOfType(t);
            if (sig.length !== 0) {
                if (signatures !== undefined)
                    return [];
                signatures = sig;
            }
        }
        return signatures === undefined ? [] : signatures;
    }
    return type.getCallSignatures();
}
exports.getCallSignaturesOfType = getCallSignaturesOfType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFDakMsMENBQXFGO0FBQ3JGLCtCQUF1QztBQUV2QywyQkFBa0MsSUFBYTtJQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTTtRQUNoQixJQUFLLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUztRQUM1RCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDakMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDckMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDMUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEtBQUssU0FBUztRQUN2QyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QyxNQUFNLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDekUsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQVpELDhDQVlDO0FBRUQsbUNBQTBDLE9BQXVCLEVBQUUsSUFBYTtJQUM1RSxFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsSUFBTSxVQUFVLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakUsSUFB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