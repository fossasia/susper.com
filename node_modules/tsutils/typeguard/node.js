"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function isAccessorDeclaration(node) {
    return node.kind === ts.SyntaxKind.GetAccessor ||
        node.kind === ts.SyntaxKind.SetAccessor;
}
exports.isAccessorDeclaration = isAccessorDeclaration;
function isArrayBindingPattern(node) {
    return node.kind === ts.SyntaxKind.ArrayBindingPattern;
}
exports.isArrayBindingPattern = isArrayBindingPattern;
function isArrayLiteralExpression(node) {
    return node.kind === ts.SyntaxKind.ArrayLiteralExpression;
}
exports.isArrayLiteralExpression = isArrayLiteralExpression;
function isArrayTypeNode(node) {
    return node.kind === ts.SyntaxKind.ArrayType;
}
exports.isArrayTypeNode = isArrayTypeNode;
function isArrowFunction(node) {
    return node.kind === ts.SyntaxKind.ArrowFunction;
}
exports.isArrowFunction = isArrowFunction;
function isAsExpression(node) {
    return node.kind === ts.SyntaxKind.AsExpression;
}
exports.isAsExpression = isAsExpression;
function isAssertionExpression(node) {
    return node.kind === ts.SyntaxKind.AsExpression ||
        node.kind === ts.SyntaxKind.TypeAssertionExpression;
}
exports.isAssertionExpression = isAssertionExpression;
function isAwaitExpression(node) {
    return node.kind === ts.SyntaxKind.AwaitExpression;
}
exports.isAwaitExpression = isAwaitExpression;
function isBinaryExpression(node) {
    return node.kind === ts.SyntaxKind.BinaryExpression;
}
exports.isBinaryExpression = isBinaryExpression;
function isBindingElement(node) {
    return node.kind === ts.SyntaxKind.BindingElement;
}
exports.isBindingElement = isBindingElement;
function isBindingPattern(node) {
    return node.kind === ts.SyntaxKind.ArrayBindingPattern ||
        node.kind === ts.SyntaxKind.ObjectBindingPattern;
}
exports.isBindingPattern = isBindingPattern;
function isBlock(node) {
    return node.kind === ts.SyntaxKind.Block;
}
exports.isBlock = isBlock;
function isBlockLike(node) {
    return node.statements !== undefined;
}
exports.isBlockLike = isBlockLike;
function isBreakOrContinueStatement(node) {
    return node.kind === ts.SyntaxKind.BreakStatement ||
        node.kind === ts.SyntaxKind.ContinueStatement;
}
exports.isBreakOrContinueStatement = isBreakOrContinueStatement;
function isBreakStatement(node) {
    return node.kind === ts.SyntaxKind.BreakStatement;
}
exports.isBreakStatement = isBreakStatement;
function isCallExpression(node) {
    return node.kind === ts.SyntaxKind.CallExpression;
}
exports.isCallExpression = isCallExpression;
function isCallSignatureDeclaration(node) {
    return node.kind === ts.SyntaxKind.CallSignature;
}
exports.isCallSignatureDeclaration = isCallSignatureDeclaration;
function isCaseBlock(node) {
    return node.kind === ts.SyntaxKind.CaseBlock;
}
exports.isCaseBlock = isCaseBlock;
function isCaseClause(node) {
    return node.kind === ts.SyntaxKind.CaseClause;
}
exports.isCaseClause = isCaseClause;
function isCaseOrDefaultClause(node) {
    return node.kind === ts.SyntaxKind.CaseClause ||
        node.kind === ts.SyntaxKind.DefaultClause;
}
exports.isCaseOrDefaultClause = isCaseOrDefaultClause;
function isCatchClause(node) {
    return node.kind === ts.SyntaxKind.CatchClause;
}
exports.isCatchClause = isCatchClause;
function isClassDeclaration(node) {
    return node.kind === ts.SyntaxKind.ClassDeclaration;
}
exports.isClassDeclaration = isClassDeclaration;
function isClassExpression(node) {
    return node.kind === ts.SyntaxKind.ClassExpression;
}
exports.isClassExpression = isClassExpression;
function isClassLikeDeclaration(node) {
    return node.kind === ts.SyntaxKind.ClassDeclaration ||
        node.kind === ts.SyntaxKind.ClassExpression;
}
exports.isClassLikeDeclaration = isClassLikeDeclaration;
function isCommaListExpression(node) {
    return node.kind === ts.SyntaxKind.CommaListExpression;
}
exports.isCommaListExpression = isCommaListExpression;
function isConditionalExpression(node) {
    return node.kind === ts.SyntaxKind.ConditionalExpression;
}
exports.isConditionalExpression = isConditionalExpression;
function isConstructorDeclaration(node) {
    return node.kind === ts.SyntaxKind.Constructor;
}
exports.isConstructorDeclaration = isConstructorDeclaration;
function isConstructorTypeNode(node) {
    return node.kind === ts.SyntaxKind.ConstructorType;
}
exports.isConstructorTypeNode = isConstructorTypeNode;
function isConstructSignatureDeclaration(node) {
    return node.kind === ts.SyntaxKind.ConstructSignature;
}
exports.isConstructSignatureDeclaration = isConstructSignatureDeclaration;
function isContinueStatement(node) {
    return node.kind === ts.SyntaxKind.ContinueStatement;
}
exports.isContinueStatement = isContinueStatement;
function isComputedPropertyName(node) {
    return node.kind === ts.SyntaxKind.ComputedPropertyName;
}
exports.isComputedPropertyName = isComputedPropertyName;
function isDebuggerStatement(node) {
    return node.kind === ts.SyntaxKind.DebuggerStatement;
}
exports.isDebuggerStatement = isDebuggerStatement;
function isDefaultClause(node) {
    return node.kind === ts.SyntaxKind.DefaultClause;
}
exports.isDefaultClause = isDefaultClause;
function isDoStatement(node) {
    return node.kind === ts.SyntaxKind.DoStatement;
}
exports.isDoStatement = isDoStatement;
function isElementAccessExpression(node) {
    return node.kind === ts.SyntaxKind.ElementAccessExpression;
}
exports.isElementAccessExpression = isElementAccessExpression;
function isEmptyStatement(node) {
    return node.kind === ts.SyntaxKind.EmptyStatement;
}
exports.isEmptyStatement = isEmptyStatement;
function isEntityName(node) {
    return node.kind === ts.SyntaxKind.Identifier || isQualifiedName(node);
}
exports.isEntityName = isEntityName;
function isEntityNameExpression(node) {
    return node.kind === ts.SyntaxKind.Identifier ||
        isPropertyAccessExpression(node) && isEntityNameExpression(node.expression);
}
exports.isEntityNameExpression = isEntityNameExpression;
function isEnumDeclaration(node) {
    return node.kind === ts.SyntaxKind.EnumDeclaration;
}
exports.isEnumDeclaration = isEnumDeclaration;
function isEnumMember(node) {
    return node.kind === ts.SyntaxKind.EnumMember;
}
exports.isEnumMember = isEnumMember;
function isExportAssignment(node) {
    return node.kind === ts.SyntaxKind.ExportAssignment;
}
exports.isExportAssignment = isExportAssignment;
function isExportDeclaration(node) {
    return node.kind === ts.SyntaxKind.ExportDeclaration;
}
exports.isExportDeclaration = isExportDeclaration;
function isExportSpecifier(node) {
    return node.kind === ts.SyntaxKind.ExportSpecifier;
}
exports.isExportSpecifier = isExportSpecifier;
function isExpression(node) {
    switch (node.kind) {
        case ts.SyntaxKind.ArrayLiteralExpression:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.AsExpression:
        case ts.SyntaxKind.AwaitExpression:
        case ts.SyntaxKind.BinaryExpression:
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.CommaListExpression:
        case ts.SyntaxKind.ConditionalExpression:
        case ts.SyntaxKind.DeleteExpression:
        case ts.SyntaxKind.ElementAccessExpression:
        case ts.SyntaxKind.FalseKeyword:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.Identifier:
        case ts.SyntaxKind.JsxElement:
        case ts.SyntaxKind.JsxExpression:
        case ts.SyntaxKind.JsxOpeningElement:
        case ts.SyntaxKind.JsxSelfClosingElement:
        case ts.SyntaxKind.MetaProperty:
        case ts.SyntaxKind.NewExpression:
        case ts.SyntaxKind.NonNullExpression:
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        case ts.SyntaxKind.NullKeyword:
        case ts.SyntaxKind.NumericLiteral:
        case ts.SyntaxKind.ObjectLiteralExpression:
        case ts.SyntaxKind.OmittedExpression:
        case ts.SyntaxKind.ParenthesizedExpression:
        case ts.SyntaxKind.PostfixUnaryExpression:
        case ts.SyntaxKind.PrefixUnaryExpression:
        case ts.SyntaxKind.PropertyAccessExpression:
        case ts.SyntaxKind.RegularExpressionLiteral:
        case ts.SyntaxKind.SpreadElement:
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.SuperKeyword:
        case ts.SyntaxKind.TaggedTemplateExpression:
        case ts.SyntaxKind.TemplateExpression:
        case ts.SyntaxKind.ThisKeyword:
        case ts.SyntaxKind.TrueKeyword:
        case ts.SyntaxKind.TypeAssertionExpression:
        case ts.SyntaxKind.TypeOfExpression:
        case ts.SyntaxKind.VoidExpression:
        case ts.SyntaxKind.YieldExpression:
            return true;
        default:
            return false;
    }
}
exports.isExpression = isExpression;
function isExpressionStatement(node) {
    return node.kind === ts.SyntaxKind.ExpressionStatement;
}
exports.isExpressionStatement = isExpressionStatement;
function isExpressionWithTypeArguments(node) {
    return node.kind === ts.SyntaxKind.ExpressionWithTypeArguments;
}
exports.isExpressionWithTypeArguments = isExpressionWithTypeArguments;
function isExternalModuleReference(node) {
    return node.kind === ts.SyntaxKind.ExternalModuleReference;
}
exports.isExternalModuleReference = isExternalModuleReference;
function isForInStatement(node) {
    return node.kind === ts.SyntaxKind.ForInStatement;
}
exports.isForInStatement = isForInStatement;
function isForOfStatement(node) {
    return node.kind === ts.SyntaxKind.ForOfStatement;
}
exports.isForOfStatement = isForOfStatement;
function isForStatement(node) {
    return node.kind === ts.SyntaxKind.ForStatement;
}
exports.isForStatement = isForStatement;
function isFunctionDeclaration(node) {
    return node.kind === ts.SyntaxKind.FunctionDeclaration;
}
exports.isFunctionDeclaration = isFunctionDeclaration;
function isFunctionExpression(node) {
    return node.kind === ts.SyntaxKind.FunctionExpression;
}
exports.isFunctionExpression = isFunctionExpression;
function isFunctionTypeNode(node) {
    return node.kind === ts.SyntaxKind.FunctionType;
}
exports.isFunctionTypeNode = isFunctionTypeNode;
function isGetAccessorDeclaration(node) {
    return node.kind === ts.SyntaxKind.GetAccessor;
}
exports.isGetAccessorDeclaration = isGetAccessorDeclaration;
function isIdentifier(node) {
    return node.kind === ts.SyntaxKind.Identifier;
}
exports.isIdentifier = isIdentifier;
function isIfStatement(node) {
    return node.kind === ts.SyntaxKind.IfStatement;
}
exports.isIfStatement = isIfStatement;
function isImportClause(node) {
    return node.kind === ts.SyntaxKind.ImportClause;
}
exports.isImportClause = isImportClause;
function isImportDeclaration(node) {
    return node.kind === ts.SyntaxKind.ImportDeclaration;
}
exports.isImportDeclaration = isImportDeclaration;
function isImportEqualsDeclaration(node) {
    return node.kind === ts.SyntaxKind.ImportEqualsDeclaration;
}
exports.isImportEqualsDeclaration = isImportEqualsDeclaration;
function isImportSpecifier(node) {
    return node.kind === ts.SyntaxKind.ImportSpecifier;
}
exports.isImportSpecifier = isImportSpecifier;
function isIndexedAccessTypeNode(node) {
    return node.kind === ts.SyntaxKind.IndexedAccessType;
}
exports.isIndexedAccessTypeNode = isIndexedAccessTypeNode;
function isIndexSignatureDeclaration(node) {
    return node.kind === ts.SyntaxKind.IndexSignature;
}
exports.isIndexSignatureDeclaration = isIndexSignatureDeclaration;
function isInterfaceDeclaration(node) {
    return node.kind === ts.SyntaxKind.InterfaceDeclaration;
}
exports.isInterfaceDeclaration = isInterfaceDeclaration;
function isIntersectionTypeNode(node) {
    return node.kind === ts.SyntaxKind.IntersectionType;
}
exports.isIntersectionTypeNode = isIntersectionTypeNode;
function isIterationStatement(node) {
    switch (node.kind) {
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.DoStatement:
            return true;
        default:
            return false;
    }
}
exports.isIterationStatement = isIterationStatement;
function isJsDoc(node) {
    return node.kind === ts.SyntaxKind.JSDocComment;
}
exports.isJsDoc = isJsDoc;
function isJsxAttribute(node) {
    return node.kind === ts.SyntaxKind.JsxAttribute;
}
exports.isJsxAttribute = isJsxAttribute;
function isJsxAttributeLike(node) {
    return node.kind === ts.SyntaxKind.JsxAttribute ||
        node.kind === ts.SyntaxKind.JsxSpreadAttribute;
}
exports.isJsxAttributeLike = isJsxAttributeLike;
function isJsxAttributes(node) {
    return node.kind === ts.SyntaxKind.JsxAttributes;
}
exports.isJsxAttributes = isJsxAttributes;
function isJsxClosingElement(node) {
    return node.kind === ts.SyntaxKind.JsxClosingElement;
}
exports.isJsxClosingElement = isJsxClosingElement;
function isJsxElement(node) {
    return node.kind === ts.SyntaxKind.JsxElement;
}
exports.isJsxElement = isJsxElement;
function isJsxExpression(node) {
    return node.kind === ts.SyntaxKind.JsxExpression;
}
exports.isJsxExpression = isJsxExpression;
function isJsxOpeningElement(node) {
    return node.kind === ts.SyntaxKind.JsxOpeningElement;
}
exports.isJsxOpeningElement = isJsxOpeningElement;
function isJsxOpeningLikeElement(node) {
    return node.kind === ts.SyntaxKind.JsxOpeningElement ||
        node.kind === ts.SyntaxKind.JsxSelfClosingElement;
}
exports.isJsxOpeningLikeElement = isJsxOpeningLikeElement;
function isJsxSelfClosingElement(node) {
    return node.kind === ts.SyntaxKind.JsxSelfClosingElement;
}
exports.isJsxSelfClosingElement = isJsxSelfClosingElement;
function isJsxSpreadAttribute(node) {
    return node.kind === ts.SyntaxKind.JsxSpreadAttribute;
}
exports.isJsxSpreadAttribute = isJsxSpreadAttribute;
function isJsxText(node) {
    return node.kind === ts.SyntaxKind.JsxText;
}
exports.isJsxText = isJsxText;
function isLabeledStatement(node) {
    return node.kind === ts.SyntaxKind.LabeledStatement;
}
exports.isLabeledStatement = isLabeledStatement;
function isLiteralExpression(node) {
    return node.kind >= ts.SyntaxKind.FirstLiteralToken &&
        node.kind <= ts.SyntaxKind.LastLiteralToken;
}
exports.isLiteralExpression = isLiteralExpression;
function isMappedTypeNode(node) {
    return node.kind === ts.SyntaxKind.MappedType;
}
exports.isMappedTypeNode = isMappedTypeNode;
function isMetaProperty(node) {
    return node.kind === ts.SyntaxKind.MetaProperty;
}
exports.isMetaProperty = isMetaProperty;
function isMethodDeclaration(node) {
    return node.kind === ts.SyntaxKind.MethodDeclaration;
}
exports.isMethodDeclaration = isMethodDeclaration;
function isMethodSignature(node) {
    return node.kind === ts.SyntaxKind.MethodSignature;
}
exports.isMethodSignature = isMethodSignature;
function isModuleBlock(node) {
    return node.kind === ts.SyntaxKind.ModuleBlock;
}
exports.isModuleBlock = isModuleBlock;
function isModuleDeclaration(node) {
    return node.kind === ts.SyntaxKind.ModuleDeclaration;
}
exports.isModuleDeclaration = isModuleDeclaration;
function isNamedExports(node) {
    return node.kind === ts.SyntaxKind.NamedExports;
}
exports.isNamedExports = isNamedExports;
function isNamedImports(node) {
    return node.kind === ts.SyntaxKind.NamedImports;
}
exports.isNamedImports = isNamedImports;
function isNamespaceDeclaration(node) {
    return isModuleDeclaration(node) &&
        node.name.kind === ts.SyntaxKind.Identifier &&
        node.body !== undefined &&
        (node.body.kind === ts.SyntaxKind.ModuleBlock ||
            isNamespaceDeclaration(node.body));
}
exports.isNamespaceDeclaration = isNamespaceDeclaration;
function isNamespaceImport(node) {
    return node.kind === ts.SyntaxKind.NamespaceImport;
}
exports.isNamespaceImport = isNamespaceImport;
function isNamespaceExportDeclaration(node) {
    return node.kind === ts.SyntaxKind.NamespaceExportDeclaration;
}
exports.isNamespaceExportDeclaration = isNamespaceExportDeclaration;
function isNewExpression(node) {
    return node.kind === ts.SyntaxKind.NewExpression;
}
exports.isNewExpression = isNewExpression;
function isNonNullExpression(node) {
    return node.kind === ts.SyntaxKind.NonNullExpression;
}
exports.isNonNullExpression = isNonNullExpression;
function isNoSubstitutionTemplateLiteral(node) {
    return node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral;
}
exports.isNoSubstitutionTemplateLiteral = isNoSubstitutionTemplateLiteral;
function isNumericLiteral(node) {
    return node.kind === ts.SyntaxKind.NumericLiteral;
}
exports.isNumericLiteral = isNumericLiteral;
function isObjectBindingPattern(node) {
    return node.kind === ts.SyntaxKind.ObjectBindingPattern;
}
exports.isObjectBindingPattern = isObjectBindingPattern;
function isObjectLiteralExpression(node) {
    return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
}
exports.isObjectLiteralExpression = isObjectLiteralExpression;
function isOmittedExpression(node) {
    return node.kind === ts.SyntaxKind.OmittedExpression;
}
exports.isOmittedExpression = isOmittedExpression;
function isParameterDeclaration(node) {
    return node.kind === ts.SyntaxKind.Parameter;
}
exports.isParameterDeclaration = isParameterDeclaration;
function isParenthesizedExpression(node) {
    return node.kind === ts.SyntaxKind.ParenthesizedExpression;
}
exports.isParenthesizedExpression = isParenthesizedExpression;
function isParenthesizedTypeNode(node) {
    return node.kind === ts.SyntaxKind.ParenthesizedType;
}
exports.isParenthesizedTypeNode = isParenthesizedTypeNode;
function isPostfixUnaryExpression(node) {
    return node.kind === ts.SyntaxKind.PostfixUnaryExpression;
}
exports.isPostfixUnaryExpression = isPostfixUnaryExpression;
function isPrefixUnaryExpression(node) {
    return node.kind === ts.SyntaxKind.PrefixUnaryExpression;
}
exports.isPrefixUnaryExpression = isPrefixUnaryExpression;
function isPropertyAccessExpression(node) {
    return node.kind === ts.SyntaxKind.PropertyAccessExpression;
}
exports.isPropertyAccessExpression = isPropertyAccessExpression;
function isPropertyAssignment(node) {
    return node.kind === ts.SyntaxKind.PropertyAssignment;
}
exports.isPropertyAssignment = isPropertyAssignment;
function isPropertyDeclaration(node) {
    return node.kind === ts.SyntaxKind.PropertyDeclaration;
}
exports.isPropertyDeclaration = isPropertyDeclaration;
function isPropertySignature(node) {
    return node.kind === ts.SyntaxKind.PropertySignature;
}
exports.isPropertySignature = isPropertySignature;
function isQualifiedName(node) {
    return node.kind === ts.SyntaxKind.QualifiedName;
}
exports.isQualifiedName = isQualifiedName;
function isRegularExpressionLiteral(node) {
    return node.kind === ts.SyntaxKind.RegularExpressionLiteral;
}
exports.isRegularExpressionLiteral = isRegularExpressionLiteral;
function isReturnStatement(node) {
    return node.kind === ts.SyntaxKind.ReturnStatement;
}
exports.isReturnStatement = isReturnStatement;
function isSetAccessorDeclaration(node) {
    return node.kind === ts.SyntaxKind.SetAccessor;
}
exports.isSetAccessorDeclaration = isSetAccessorDeclaration;
function isShorthandPropertyAssignment(node) {
    return node.kind === ts.SyntaxKind.ShorthandPropertyAssignment;
}
exports.isShorthandPropertyAssignment = isShorthandPropertyAssignment;
function isSignatureDeclaration(node) {
    return node.parameters !== undefined;
}
exports.isSignatureDeclaration = isSignatureDeclaration;
function isSourceFile(node) {
    return node.kind === ts.SyntaxKind.SourceFile;
}
exports.isSourceFile = isSourceFile;
function isSpreadAssignment(node) {
    return node.kind === ts.SyntaxKind.SpreadAssignment;
}
exports.isSpreadAssignment = isSpreadAssignment;
function isSpreadElement(node) {
    return node.kind === ts.SyntaxKind.SpreadElement;
}
exports.isSpreadElement = isSpreadElement;
function isStringLiteral(node) {
    return node.kind === ts.SyntaxKind.StringLiteral;
}
exports.isStringLiteral = isStringLiteral;
function isSwitchStatement(node) {
    return node.kind === ts.SyntaxKind.SwitchStatement;
}
exports.isSwitchStatement = isSwitchStatement;
function isSyntaxList(node) {
    return node.kind === ts.SyntaxKind.SyntaxList;
}
exports.isSyntaxList = isSyntaxList;
function isTaggedTemplateExpression(node) {
    return node.kind === ts.SyntaxKind.TaggedTemplateExpression;
}
exports.isTaggedTemplateExpression = isTaggedTemplateExpression;
function isTemplateExpression(node) {
    return node.kind === ts.SyntaxKind.TemplateExpression;
}
exports.isTemplateExpression = isTemplateExpression;
function isTemplateLiteral(node) {
    return node.kind === ts.SyntaxKind.TemplateExpression ||
        node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral;
}
exports.isTemplateLiteral = isTemplateLiteral;
function isTextualLiteral(node) {
    return node.kind === ts.SyntaxKind.StringLiteral ||
        node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral;
}
exports.isTextualLiteral = isTextualLiteral;
function isThrowStatement(node) {
    return node.kind === ts.SyntaxKind.ThrowStatement;
}
exports.isThrowStatement = isThrowStatement;
function isTryStatement(node) {
    return node.kind === ts.SyntaxKind.TryStatement;
}
exports.isTryStatement = isTryStatement;
function isTupleTypeNode(node) {
    return node.kind === ts.SyntaxKind.TupleType;
}
exports.isTupleTypeNode = isTupleTypeNode;
function isTypeAliasDeclaration(node) {
    return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
}
exports.isTypeAliasDeclaration = isTypeAliasDeclaration;
function isTypeAssertion(node) {
    return node.kind === ts.SyntaxKind.TypeAssertionExpression;
}
exports.isTypeAssertion = isTypeAssertion;
function isTypeLiteralNode(node) {
    return node.kind === ts.SyntaxKind.TypeLiteral;
}
exports.isTypeLiteralNode = isTypeLiteralNode;
function isTypeOfExpression(node) {
    return node.kind === ts.SyntaxKind.TypeOfExpression;
}
exports.isTypeOfExpression = isTypeOfExpression;
function isTypeOperatorNode(node) {
    return node.kind === ts.SyntaxKind.TypeOperator;
}
exports.isTypeOperatorNode = isTypeOperatorNode;
function isTypeParameterDeclaration(node) {
    return node.kind === ts.SyntaxKind.TypeParameter;
}
exports.isTypeParameterDeclaration = isTypeParameterDeclaration;
function isTypePredicateNode(node) {
    return node.kind === ts.SyntaxKind.TypePredicate;
}
exports.isTypePredicateNode = isTypePredicateNode;
function isTypeReferenceNode(node) {
    return node.kind === ts.SyntaxKind.TypeReference;
}
exports.isTypeReferenceNode = isTypeReferenceNode;
function isTypeQueryNode(node) {
    return node.kind === ts.SyntaxKind.TypeQuery;
}
exports.isTypeQueryNode = isTypeQueryNode;
function isUnionTypeNode(node) {
    return node.kind === ts.SyntaxKind.UnionType;
}
exports.isUnionTypeNode = isUnionTypeNode;
function isVariableDeclaration(node) {
    return node.kind === ts.SyntaxKind.VariableDeclaration;
}
exports.isVariableDeclaration = isVariableDeclaration;
function isVariableStatement(node) {
    return node.kind === ts.SyntaxKind.VariableStatement;
}
exports.isVariableStatement = isVariableStatement;
function isVariableDeclarationList(node) {
    return node.kind === ts.SyntaxKind.VariableDeclarationList;
}
exports.isVariableDeclarationList = isVariableDeclarationList;
function isVoidExpression(node) {
    return node.kind === ts.SyntaxKind.VoidExpression;
}
exports.isVoidExpression = isVoidExpression;
function isWhileStatement(node) {
    return node.kind === ts.SyntaxKind.WhileStatement;
}
exports.isWhileStatement = isWhileStatement;
function isWithStatement(node) {
    return node.kind === ts.SyntaxKind.WithStatement;
}
exports.isWithStatement = isWithStatement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakMsK0JBQXNDLElBQWE7SUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXO1FBQzFDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7QUFDaEQsQ0FBQztBQUhELHNEQUdDO0FBRUQsK0JBQXNDLElBQWE7SUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztBQUMzRCxDQUFDO0FBRkQsc0RBRUM7QUFFRCxrQ0FBeUMsSUFBYTtJQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLHNCQUFzQixDQUFDO0FBQzlELENBQUM7QUFGRCw0REFFQztBQUVELHlCQUFnQyxJQUFhO0lBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2pELENBQUM7QUFGRCwwQ0FFQztBQUVELHlCQUFnQyxJQUFhO0lBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO0FBQ3JELENBQUM7QUFGRCwwQ0FFQztBQUVELHdCQUErQixJQUFhO0lBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO0FBQ3BELENBQUM7QUFGRCx3Q0FFQztBQUVELCtCQUFzQyxJQUFhO0lBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWTtRQUMzQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUs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