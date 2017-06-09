# Change Log

## v2.4.0
**Bugfixes:**
* `getLineRanges`: `contentLength` now contains the correct line length when there are multiple consecutive line break characters
* `getTokenAtPosition`: don't match tokens that end at the specified position (because that's already outside of their range)
* deprecated the misnamed `isModfierFlagSet`, use the new `isModifierFlagSet` instead

**Features:**
* Added typeguard: `isJsDoc`
* Added experimental scope and usage analysis (`getUsageDomain` and `collectVariableUsage`)

## v2.3.0
**Bugfixes:**
* `forEachComment` no longer omits some comments when callback returns a truthy value
* `isPositionInComment` fixed false positive inside JSXText

**Features:**
* Added utility: `getCommentAtPosition`

## v2.2.0
**Bugfixes:**
* Fixed bit value of `SideEffectOptions.JsxElement` to be a power of 2

**Features:**
* Added utilities: `getTokenAtPosition` and `isPositionInComment`

## v2.1.0
**Features:**
* Added typeguard `isExpression`
* Added utilities: `hasSideEffects`, `getDeclarationOfBindingElement`

## v2.0.0
**Breaking Changes:**
* Dropped compatibility with `typescript@<2.1.0`
* Removed misnamed `isNumericliteral`, use `isNumericLiteral` instead (notice the uppercase L)
* Removed `isEnumLiteralType` which will cause compile errors with typescript@2.4.0
* Refactored directory structure: all imports that referenced subdirectories (e.g. `require('tsutils/src/typeguard')` will be broken

**Features:**
* New directory structure allows imports of typeguards or utils independently, e.g. (`require('tsutils/typeguard')`)

## v1.9.1
**Bugfixes:**
* `isObjectFlagSet` now uses the correct `objectFlags` property

## v1.9.0
**Bugfixes:**
* `getNextToken` no longer omits `EndOfFileToken` when there is no trivia before EOF. That means the only inputs where `getNextToken` returns `undefined` are `SourceFile` and `EndOfFileToken`

**Features**:
* Added typeguards for types
* Added utilities for flag checking: `isNodeFlagSet`, `isTypeFlagSet`, `isSymbolFlagSet`,`isObjectFlagSet`, `isModifierFlagSet` 

## v1.8.0
**Features:**
* Support peer dependency of typescript nightlies of 2.4.0
* Added typeguards: `isJsxAttributes`, `isIntersectionTypeNode`, `isTypeOperatorNode`, `isTypePredicateNode`, `isTypeQueryNode`, `isUnionTypeNode`

## v1.7.0
**Bugfixes:**
* `isFunctionScopeBoundary` now handles Interfaces, TypeAliases, FunctionSignatures, etc

**Features:**
* Added utilities: `isThisParameter`, `isSameLine` and `isFunctionWithBody`

## v1.6.0
**Features:**
* Add `isValidPropertyAccess`, `isValidNumericLiteral` and `isValidPropertyName`

## v1.5.0
**Features:**
* Add `isValidIdentifier`

## v1.4.0
**Features:**
* Add `contentLength` property to the result of `getLineRanges`

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