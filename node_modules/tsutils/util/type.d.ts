import * as ts from 'typescript';
export declare function isEmptyObjectType(type: ts.Type): type is ts.ObjectType;
export declare function removeOptionalityFromType(checker: ts.TypeChecker, type: ts.Type): ts.Type;
export declare function isTypeAssignableToNumber(checker: ts.TypeChecker, type: ts.Type): boolean;
export declare function isTypeAssignableToString(checker: ts.TypeChecker, type: ts.Type): boolean;
export declare function getCallSignaturesOfType(type: ts.Type): ts.Signature[];
