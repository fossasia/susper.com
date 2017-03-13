# Change Log

## v1.3.0
**Bugfixes:**
* canHaveLeadingTrivia:
  * Fix property access on undefined parent reference
  * Fixes: https://github.com/palantir/tslint/issues/2330
* hasOwnThisReference: now includes accessors on object literals

**Features:**
* Typeguards:
  * isTypeParameterDeclaration
  * isEnitityName

## v1.2.2
**Bugfixes:**
* hasOwnThisReference:
  * exclude overload signatures of function declarations
  * add method declarations on object literals

## v1.2.1
**Bugfixes:**
* Fix name of isNumericLiteral

## v1.2.0
**Features:**
* Typeguards:
  * isEnumMember
  * isExpressionWithTypeArguments
  * isImportSpecifier
* Utilities:
  * isJsDocKind, isTypeNodeKind
* Allow typescript@next in peerDependencies

## v1.1.0
**Bugfixes:**
* Fix isBlockScopeBoundary: Remove WithStatement, IfStatment, DoStatement and WhileStatement because they are no scope boundary whitout a block.

**Features:**
* Added more typeguards:
  * isAssertionExpression
  * isEmptyStatement
  * isJsxAttributeLike
  * isJsxOpeningLikeElement
  * isNonNullExpression
  * isSyntaxList
* Utilities:
  * getNextToken, getPreviousToken
  * hasOwnThisReference
  * getLineRanges


## v1.0.0
**Features:**

* Initial implementation of typeguards
* Utilities:
  * getChildOfKind
  * isNodeKind, isAssignmentKind
  * hasModifier, isParameterProperty, hasAccessModifier
  * getPreviousStatement, getNextStatement
  * getPropertyName
  * forEachDestructuringIdentifier, forEachDeclaredVariable
  * getVariableDeclarationKind, isBlockScopedVariableDeclarationList, isBlockScopedVariableDeclaration
  * isScopeBoundary, isFunctionScopeBoundary, isBlockScopeBoundary
  * forEachToken, forEachTokenWithTrivia, forEachComment
  * endsControlFlow