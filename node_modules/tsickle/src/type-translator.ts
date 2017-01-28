/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript';

export function assertTypeChecked(sourceFile: ts.SourceFile) {
  if (!('resolvedModules' in sourceFile)) {
    throw new Error('must provide typechecked program');
  }
}

/**
 * Determines if fileName refers to a builtin lib.d.ts file.
 * This is a terrible hack but it mirrors a similar thing done in Clutz.
 */
export function isBuiltinLibDTS(fileName: string): boolean {
  return fileName.match(/\blib\.(?:[^/]+\.)?d\.ts$/) != null;
}

/**
 * @return True if the named type is considered compatible with the Closure-defined
 *     type of the same name, e.g. "Array".  Note that we don't actually enforce
 *     that the types are actually compatible, but mostly just hope that they are due
 *     to being derived from the same HTML specs.
 */
function isClosureProvidedType(symbol: ts.Symbol): boolean {
  return symbol.declarations != null &&
      symbol.declarations.some(n => isBuiltinLibDTS(n.getSourceFile().fileName));
}

export function typeToDebugString(type: ts.Type): string {
  let debugString = `flags:0x${type.flags.toString(16)}`;

  const basicTypes: ts.TypeFlags[] = [
    ts.TypeFlags.Any,
    ts.TypeFlags.String,
    ts.TypeFlags.Number,
    ts.TypeFlags.Boolean,
    ts.TypeFlags.Enum,
    ts.TypeFlags.StringLiteral,
    ts.TypeFlags.NumberLiteral,
    ts.TypeFlags.BooleanLiteral,
    ts.TypeFlags.EnumLiteral,
    ts.TypeFlags.ESSymbol,
    ts.TypeFlags.Void,
    ts.TypeFlags.Undefined,
    ts.TypeFlags.Null,
    ts.TypeFlags.Never,
    ts.TypeFlags.TypeParameter,
    ts.TypeFlags.Class,
    ts.TypeFlags.Interface,
    ts.TypeFlags.Reference,
    ts.TypeFlags.Tuple,
    ts.TypeFlags.Union,
    ts.TypeFlags.Intersection,
    ts.TypeFlags.Anonymous,
    ts.TypeFlags.Instantiated,
    ts.TypeFlags.ThisType,
    ts.TypeFlags.ObjectLiteralPatternWithComputedProperties,
  ];
  for (let flag of basicTypes) {
    if ((type.flags & flag) !== 0) {
      debugString += ` ${ts.TypeFlags[flag]}`;
    }
  }

  if (type.symbol && type.symbol.name !== '__type') {
    debugString += ` symbol.name:${JSON.stringify(type.symbol.name)}`;
  }

  if (type.pattern) {
    debugString += ` destructuring:true`;
  }

  return `{type ${debugString}}`;
}

export function symbolToDebugString(sym: ts.Symbol): string {
  let debugString = `${JSON.stringify(sym.name)} flags:0x${sym.flags.toString(16)}`;

  const symbolFlags = [
    ts.SymbolFlags.FunctionScopedVariable,
    ts.SymbolFlags.BlockScopedVariable,
    ts.SymbolFlags.Property,
    ts.SymbolFlags.EnumMember,
    ts.SymbolFlags.Function,
    ts.SymbolFlags.Class,
    ts.SymbolFlags.Interface,
    ts.SymbolFlags.ConstEnum,
    ts.SymbolFlags.RegularEnum,
    ts.SymbolFlags.ValueModule,
    ts.SymbolFlags.NamespaceModule,
    ts.SymbolFlags.TypeLiteral,
    ts.SymbolFlags.ObjectLiteral,
    ts.SymbolFlags.Method,
    ts.SymbolFlags.Constructor,
    ts.SymbolFlags.GetAccessor,
    ts.SymbolFlags.SetAccessor,
    ts.SymbolFlags.Signature,
    ts.SymbolFlags.TypeParameter,
    ts.SymbolFlags.TypeAlias,
    ts.SymbolFlags.ExportValue,
    ts.SymbolFlags.ExportType,
    ts.SymbolFlags.ExportNamespace,
    ts.SymbolFlags.Alias,
    ts.SymbolFlags.Instantiated,
    ts.SymbolFlags.Merged,
    ts.SymbolFlags.Transient,
    ts.SymbolFlags.Prototype,
    ts.SymbolFlags.SyntheticProperty,
    ts.SymbolFlags.Optional,
    ts.SymbolFlags.ExportStar,
  ];
  for (const flag of symbolFlags) {
    if ((sym.flags & flag) !== 0) {
      debugString += ` ${ts.SymbolFlags[flag]}`;
    }
  }

  return debugString;
}

/** TypeTranslator translates TypeScript types to Closure types. */
export class TypeTranslator {
  /**
   * A list of types we've encountered while emitting; used to avoid getting stuck in recursive
   * types.
   */
  private seenTypes: ts.Type[] = [];

  /**
   * @param node is the source AST ts.Node the type comes from.  This is used
   *     in some cases (e.g. anonymous types) for looking up field names.
   * @param pathBlackList is a set of paths that should never get typed;
   *     any reference to symbols defined in these paths should by typed
   *     as {?}.
   */
  constructor(
      private typeChecker: ts.TypeChecker, private node: ts.Node,
      private pathBlackList?: Set<string>) {}

  /**
   * Converts a ts.Symbol to a string.
   * Other approaches that don't work:
   * - TypeChecker.typeToString translates Array as T[].
   * - TypeChecker.symbolToString emits types without their namespace,
   *   and doesn't let you pass the flag to control that.
   */
  public symbolToString(sym: ts.Symbol): string {
    // This follows getSingleLineStringWriter in the TypeScript compiler.
    let str = '';
    let writeText = (text: string) => str += text;
    let doNothing = () => {
      return;
    };

    let builder = this.typeChecker.getSymbolDisplayBuilder();
    let writer: ts.SymbolWriter = {
      writeKeyword: writeText,
      writeOperator: writeText,
      writePunctuation: writeText,
      writeSpace: writeText,
      writeStringLiteral: writeText,
      writeParameter: writeText,
      writeSymbol: writeText,
      writeLine: doNothing,
      increaseIndent: doNothing,
      decreaseIndent: doNothing,
      clear: doNothing,
      trackSymbol(symbol: ts.Symbol, enclosingDeclaration?: ts.Node, meaning?: ts.SymbolFlags) {
        return;
      },
      reportInaccessibleThisError: doNothing,
    };
    builder.buildSymbolDisplay(sym, writer, this.node);
    return str;
  }

  translate(type: ts.Type): string {
    // See the function `buildTypeDisplay` in the TypeScript compiler source
    // for guidance on a similar operation.

    // NOTE: type.flags is a single value for primitive types, but sometimes a
    // bitwise 'or' of some values for more complex types.  We use a switch
    // statement for the basics and a series of "if" tests for the complex ones,
    // roughly in the same order the flags occur in the TypeFlags enum.
    switch (type.flags) {
      case ts.TypeFlags.Any:
        return '?';
      case ts.TypeFlags.String:
        return 'string';
      case ts.TypeFlags.Number:
        return 'number';
      case ts.TypeFlags.Boolean:
        return 'boolean';
      case ts.TypeFlags.Void:
        return 'void';
      case ts.TypeFlags.Undefined:
        return 'undefined';
      case ts.TypeFlags.Null:
        return 'null';
      case ts.TypeFlags.EnumLiteral:
      case ts.TypeFlags.Enum:
        return 'number';
      case ts.TypeFlags.StringLiteral:
        return 'string';
      case ts.TypeFlags.BooleanLiteral:
        return 'boolean';
      case ts.TypeFlags.NumberLiteral:
        return 'number';
      default:
        // Continue on to more complex tests below.
        break;
    }

    if (type.symbol && this.isBlackListed(type.symbol)) return '?';

    if (type.flags & ts.TypeFlags.Class) {
      if (!type.symbol) {
        this.warn('class has no symbol');
        return '?';
      }
      return '!' + this.symbolToString(type.symbol);
    } else if (type.flags & ts.TypeFlags.Interface) {
      // Note: ts.InterfaceType has a typeParameters field, but that
      // specifies the parameters that the interface type *expects*
      // when it's used, and should not be transformed to the output.
      // E.g. a type like Array<number> is a TypeReference to the
      // InterfaceType "Array", but the "number" type parameter is
      // part of the outer TypeReference, not a typeParameter on
      // the InterfaceType.
      if (!type.symbol) {
        this.warn('interface has no symbol');
        return '?';
      }
      if (type.symbol.flags & ts.SymbolFlags.Value) {
        // The symbol is both a type and a value.
        // For user-defined types in this state, we don't have a Closure name
        // for the type.  See the type_and_value test.
        if (!isClosureProvidedType(type.symbol)) {
          this.warn(`type/symbol conflict for ${type.symbol.name}, using {?} for now`);
          return '?';
        }
      }
      return '!' + this.symbolToString(type.symbol);
    } else if (type.flags & ts.TypeFlags.Reference) {
      // A reference to another type, e.g. Array<number> refers to Array.
      // Emit the referenced type and any type arguments.
      let referenceType = type as ts.TypeReference;

      let typeStr = '';
      let isTuple = (referenceType.flags & ts.TypeFlags.Tuple) > 0;
      // For unknown reasons, tuple types can be reference types containing a
      // reference loop. see Destructuring3 in functions.ts.
      // TODO(rado): handle tuples in their own branch.
      if (!isTuple) {
        if (referenceType.target === referenceType) {
          // We get into an infinite loop here if the inner reference is
          // the same as the outer; this can occur when this function
          // fails to translate a more specific type before getting to
          // this point.
          throw new Error(
              `reference loop in ${typeToDebugString(referenceType)} ${referenceType.flags}`);
        }
        typeStr += this.translate(referenceType.target);
      }
      if (referenceType.typeArguments) {
        let params = referenceType.typeArguments.map(t => this.translate(t));
        typeStr += isTuple ? `!Array` : `<${params.join(', ')}>`;
      }
      return typeStr;
    } else if (type.flags & ts.TypeFlags.Anonymous) {
      if (!type.symbol) {
        // This comes up when generating code for an arrow function as passed
        // to a generic function.  The passed-in type is tagged as anonymous
        // and has no properties so it's hard to figure out what to generate.
        // Just avoid it for now so we don't crash.
        this.warn('anonymous type has no symbol');
        return '?';
      }

      if (type.symbol.flags === ts.SymbolFlags.TypeLiteral) {
        return this.translateTypeLiteral(type);
      } else if (
          type.symbol.flags === ts.SymbolFlags.Function ||
          type.symbol.flags === ts.SymbolFlags.Method) {
        let sigs = this.typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call);
        if (sigs.length === 1) {
          return this.signatureToClosure(sigs[0]);
        }
      }
      this.warn('unhandled anonymous type');
      return '?';
    } else if (type.flags & ts.TypeFlags.Union) {
      let unionType = type as ts.UnionType;
      let parts = unionType.types.map(t => this.translate(t));
      // In union types that include boolean literal and other literals can
      // end up repeating the same closure type. For example: true | boolean
      // will be translated to boolean | boolean. Remove duplicates to produce
      // types that read better.
      parts = parts.filter((el, idx) => parts.indexOf(el) === idx);
      return parts.length === 1 ? parts[0] : `(${parts.join('|')})`;
    }
    this.warn(`unhandled type ${typeToDebugString(type)}`);
    return '?';
  }

  /**
   * translateTypeLiteral translates a ts.SymbolFlags.TypeLiteral type, which
   * is the anonymous type encountered in e.g.
   *   let x: {a: number};
   */
  private translateTypeLiteral(type: ts.Type): string {
    // Avoid infinite loops on recursive types.
    // It would be nice to just emit the name of the recursive type here,
    // but type.symbol doesn't seem to have the name here (perhaps something
    // to do with aliases?).
    if (this.seenTypes.indexOf(type) !== -1) return '?';
    this.seenTypes.push(type);

    // Gather up all the named fields and whether the object is also callable.
    let callable = false;
    let indexable = false;
    let fields: string[] = [];
    if (!type.symbol || !type.symbol.members) {
      this.warn('type literal has no symbol');
      return '?';
    }

    // special-case construct signatures.
    const ctors = type.getConstructSignatures();
    if (ctors.length) {
      // TODO(martinprobst): this does not support additional properties defined on constructors
      // (not expressible in Closure), nor multiple constructors (same).
      const params = this.convertParams(ctors[0]);
      const paramsStr = params.length ? (', ' + params.join(', ')) : '';
      const constructedType = this.translate(ctors[0].getReturnType());
      // In the specific case of the "new" in a function, it appears that
      //   function(new: !Bar)
      // fails to parse, while
      //   function(new: (!Bar))
      // parses in the way you'd expect.
      // It appears from testing that Closure ignores the ! anyway and just
      // assumes the result will be non-null in either case.  (To be pedantic,
      // it's possible to return null from a ctor it seems like a bad idea.)
      return `function(new: (${constructedType})${paramsStr}): ?`;
    }

    for (let field of Object.keys(type.symbol.members)) {
      switch (field) {
        case '__call':
          callable = true;
          break;
        case '__index':
          indexable = true;
          break;
        default:
          let member = type.symbol.members[field];
          // optional members are handled by the type including |undefined in a union type.
          let memberType =
              this.translate(this.typeChecker.getTypeOfSymbolAtLocation(member, this.node));
          fields.push(`${field}: ${memberType}`);
      }
    }

    // Try to special-case plain key-value objects and functions.
    if (fields.length === 0) {
      if (callable && !indexable) {
        // A function type.
        let sigs = this.typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call);
        if (sigs.length === 1) {
          return this.signatureToClosure(sigs[0]);
        }
      } else if (indexable && !callable) {
        // A plain key-value map type.
        let keyType = 'string';
        let valType = this.typeChecker.getIndexTypeOfType(type, ts.IndexKind.String);
        if (!valType) {
          keyType = 'number';
          valType = this.typeChecker.getIndexTypeOfType(type, ts.IndexKind.Number);
        }
        if (!valType) {
          this.warn('unknown index key type');
          return `!Object<?,?>`;
        }
        return `!Object<${keyType},${this.translate(valType)}>`;
      } else if (!callable && !indexable) {
        // Special-case the empty object {} because Closure doesn't like it.
        // TODO(evanm): revisit this if it is a problem.
        return '!Object';
      }
    }

    if (!callable && !indexable) {
      // Not callable, not indexable; implies a plain object with fields in it.
      return `{${fields.join(', ')}}`;
    }

    this.warn('unhandled type literal');
    return '?';
  }

  /** Converts a ts.Signature (function signature) to a Closure function type. */
  private signatureToClosure(sig: ts.Signature): string {
    let params = this.convertParams(sig);
    let typeStr = `function(${params.join(', ')})`;

    let retType = this.translate(this.typeChecker.getReturnTypeOfSignature(sig));
    if (retType) {
      typeStr += `: ${retType}`;
    }

    return typeStr;
  }

  private convertParams(sig: ts.Signature): string[] {
    return sig.parameters.map(param => {
      let paramType = this.typeChecker.getTypeOfSymbolAtLocation(param, this.node);
      return this.translate(paramType);
    });
  }

  warn(msg: string) {
    // By default, warn() does nothing.  The caller will overwrite this
    // if it wants different behavior.
  }

  /** @return true if sym should always have type {?}. */
  isBlackListed(symbol: ts.Symbol): boolean {
    if (this.pathBlackList === undefined) return false;
    const pathBlackList = this.pathBlackList;
    if (symbol.declarations === undefined) {
      this.warn('symbol has no declarations');
      return true;
    }
    return symbol.declarations.every(n => {
      const path = n.getSourceFile().fileName;
      return pathBlackList.has(path);
    });
  }
}
