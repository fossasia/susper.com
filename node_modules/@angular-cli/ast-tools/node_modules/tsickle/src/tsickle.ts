/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {SourceMapGenerator} from 'source-map';
import * as ts from 'typescript';

import * as jsdoc from './jsdoc';
import {getIdentifierText, Rewriter, unescapeName} from './rewriter';
import {Options} from './tsickle_compiler_host';
import {assertTypeChecked, TypeTranslator} from './type-translator';
import {toArray} from './util';

export {convertDecorators} from './decorator-annotator';
export {processES5} from './es5processor';
export {FileMap, ModulesManifest} from './modules_manifest';
export {Options, Pass, TsickleCompilerHost, TsickleHost} from './tsickle_compiler_host';

export interface Output {
  /** The TypeScript source with Closure annotations inserted. */
  output: string;
  /** Generated externs declarations, if any. */
  externs: string|null;
  /** Error messages, if any. */
  diagnostics: ts.Diagnostic[];
  /** A source map mapping back into the original sources. */
  sourceMap: SourceMapGenerator;
}

/**
 * Symbols that are already declared as externs in Closure, that should
 * be avoided by tsickle's "declare ..." => externs.js conversion.
 */
export let closureExternsBlacklist: string[] = [
  'exports',
  'global',
  'module',
  // ErrorConstructor is the interface of the Error object itself.
  // tsickle detects that this is part of the TypeScript standard library
  // and assumes it's part of the Closure standard library, but this
  // assumption is wrong for ErrorConstructor.  To properly handle this
  // we'd somehow need to map methods defined on the ErrorConstructor
  // interface into properties on Closure's Error object, but for now it's
  // simpler to just blacklist it.
  'ErrorConstructor',
  'Symbol',
  'WorkerGlobalScope',
];

export function formatDiagnostics(diags: ts.Diagnostic[]): string {
  return diags
      .map((d) => {
        let res = ts.DiagnosticCategory[d.category];
        if (d.file) {
          res += ' at ' + d.file.fileName + ':';
          let {line, character} = d.file.getLineAndCharacterOfPosition(d.start);
          res += (line + 1) + ':' + (character + 1) + ':';
        }
        res += ' ' + ts.flattenDiagnosticMessageText(d.messageText, '\n');
        return res;
      })
      .join('\n');
}

/**
 * TypeScript allows you to write identifiers quoted, like:
 *   interface Foo {
 *     'bar': string;
 *     'complex name': string;
 *   }
 *   Foo.bar;  // ok
 *   Foo['bar']  // ok
 *   Foo['complex name']  // ok
 *
 * In Closure-land, we want identify that the legal name 'bar' can become an
 * ordinary field, but we need to skip strings like 'complex name'.
 */
function isValidClosurePropertyName(name: string): boolean {
  // In local experimentation, it appears that reserved words like 'var' and
  // 'if' are legal JS and still accepted by Closure.
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

function isDtsFileName(fileName: string): boolean {
  return /\.d\.ts$/.test(fileName);
}

/** Returns the Closure name of a function parameter, special-casing destructuring. */
function getParameterName(param: ts.ParameterDeclaration, index: number): string {
  switch (param.name.kind) {
    case ts.SyntaxKind.Identifier:
      let name = getIdentifierText(param.name as ts.Identifier);
      // TypeScript allows parameters named "arguments", but Closure
      // disallows this, even in externs.
      if (name === 'arguments') name = 'tsickle_arguments';
      return name;
    case ts.SyntaxKind.ArrayBindingPattern:
    case ts.SyntaxKind.ObjectBindingPattern:
      // Closure crashes if you put a binding pattern in the externs.
      // Avoid this by just generating an unused name; the name is
      // ignored anyway.
      return `__${index}`;
    default:
      // The above list of kinds should be exhaustive.
      throw new Error(`unhandled function parameter kind: ${ts.SyntaxKind[param.name.kind]}`);
  }
}

const VISIBILITY_FLAGS = ts.NodeFlags.Private | ts.NodeFlags.Protected | ts.NodeFlags.Public;

/**
 * A Rewriter subclass that adds Tsickle-specific (Closure translation) functionality.
 *
 * One Rewriter subclass manages .ts => .ts+Closure translation.
 * Another Rewriter subclass manages .ts => externs translation.
 */
class ClosureRewriter extends Rewriter {
  constructor(protected program: ts.Program, file: ts.SourceFile, protected options: Options) {
    super(file);
  }

  /**
   * Handles emittng the jsdoc for methods, including overloads.
   * If overloaded, merges the signatures in the list of SignatureDeclarations into a single jsdoc.
   * - Total number of parameters will be the maximum count found across all variants.
   * - Different names at the same parameter index will be joined with "_or_"
   * - Variable args (...type[] in TypeScript) will be output as "...type",
   *    except if found at the same index as another argument.
   * @param  fnDecls Pass > 1 declaration for overloads of same name
   * @return The list of parameter names that should be used to emit the actual
   *    function statement; for overloads, name will have been merged.
   */
  emitFunctionType(fnDecls: ts.SignatureDeclaration[], extraTags: jsdoc.Tag[] = []): string[] {
    const typeChecker = this.program.getTypeChecker();
    let newDoc = extraTags;
    const lens = fnDecls.map(fnDecl => fnDecl.parameters.length);
    const minArgsCount = Math.min(...lens);
    const maxArgsCount = Math.max(...lens);
    const isConstructor = fnDecls.find(d => d.kind === ts.SyntaxKind.Constructor) !== undefined;
    // For each parameter index i, paramTags[i] is an array of parameters
    // that can be found at index i.  E.g.
    //    function foo(x: string)
    //    function foo(y: number, z: string)
    // then paramTags[0] = [info about x, info about y].
    const paramTags: jsdoc.Tag[][] = [];
    const returnTags: jsdoc.Tag[] = [];

    for (let fnDecl of fnDecls) {
      // Construct the JSDoc comment by reading the existing JSDoc, if
      // any, and merging it with the known types of the function
      // parameters and return type.
      let jsDoc = this.getJSDoc(fnDecl) || [];

      // Copy all the tags other than @param/@return into the new
      // JSDoc without any change; @param/@return are handled specially.
      // TODO: there may be problems if an annotation doesn't apply to all overloads;
      // is it worth checking for this and erroring?
      for (let tag of jsDoc) {
        if (tag.tagName === 'param' || tag.tagName === 'return') continue;
        newDoc.push(tag);
      }

      // Add @abstract on "abstract" declarations.
      if (fnDecl.flags & ts.NodeFlags.Abstract) {
        newDoc.push({tagName: 'abstract'});
      }

      // Merge the parameters into a single list of merged names and list of types
      const sig = typeChecker.getSignatureFromDeclaration(fnDecl);
      for (let i = 0; i < sig.declaration.parameters.length; i++) {
        const paramNode = sig.declaration.parameters[i];

        const destructuring =
            (paramNode.name.kind === ts.SyntaxKind.ArrayBindingPattern ||
             paramNode.name.kind === ts.SyntaxKind.ObjectBindingPattern);
        const name = getParameterName(paramNode, i);
        const isThisParam = name === 'this';

        let newTag: jsdoc.Tag = {
          tagName: isThisParam ? 'this' : 'param',
          optional: paramNode.initializer !== undefined || paramNode.questionToken !== undefined,
          parameterName: isThisParam ? undefined : name,
        };

        let type = typeChecker.getTypeAtLocation(paramNode);
        if (paramNode.dotDotDotToken !== undefined) {
          newTag.restParam = true;
          // In TypeScript you write "...x: number[]", but in Closure
          // you don't write the array: "@param {...number} x".  Unwrap
          // the Array<> wrapper.
          type = (type as ts.TypeReference).typeArguments[0];
        }
        newTag.type = this.typeToClosure(fnDecl, type, destructuring);

        for (let {tagName, parameterName, text} of jsDoc) {
          if (tagName === 'param' && parameterName === newTag.parameterName) {
            newTag.text = text;
            break;
          }
        }
        if (!paramTags[i]) paramTags.push([]);
        paramTags[i].push(newTag);
      }

      // Return type.
      if (!isConstructor) {
        let retType = typeChecker.getReturnTypeOfSignature(sig);
        let retTypeString: string = this.typeToClosure(fnDecl, retType);
        let returnDoc: string|undefined;
        for (let {tagName, text} of jsDoc) {
          if (tagName === 'return') {
            returnDoc = text;
            break;
          }
        }
        returnTags.push({
          tagName: 'return',
          type: retTypeString,
          text: returnDoc,
        });
      }
    }

    // Merge the JSDoc tags for each overloaded parameter.
    for (let i = 0; i < maxArgsCount; i++) {
      let paramTag = jsdoc.merge(paramTags[i]);
      // If any overload marks this param optional, mark it optional in the
      // merged output.
      const optional = paramTags[i].find(t => t.optional === true) !== undefined;
      if (optional || i >= minArgsCount) {
        paramTag.type += '=';
      }
      // If any overload marks this param as a ..., mark it ... in the
      // merged output.
      if (paramTags[i].find(t => t.restParam === true) !== undefined) {
        paramTag.restParam = true;
      }
      newDoc.push(paramTag);
    }

    // Merge the JSDoc tags for each overloaded return.
    if (!isConstructor) {
      newDoc.push(jsdoc.merge(returnTags));
    }

    this.emit('\n' + jsdoc.toString(newDoc));
    return newDoc.filter(t => t.tagName === 'param').map(t => t.parameterName!);
  }

  /**
   * Returns null if there is no existing comment.
   */
  getJSDoc(node: ts.Node): jsdoc.Tag[]|null {
    let text = node.getFullText();
    let comments = ts.getLeadingCommentRanges(text, 0);

    if (!comments || comments.length === 0) return null;

    // JS compiler only considers the last comment significant.
    let {pos, end} = comments[comments.length - 1];
    let comment = text.substring(pos, end);
    let parsed = jsdoc.parse(comment);
    if (!parsed) return null;
    if (parsed.warnings) {
      const start = node.getFullStart() + pos;
      this.diagnostics.push({
        file: this.file,
        start,
        length: node.getStart() - start,
        messageText: parsed.warnings.join('\n'),
        category: ts.DiagnosticCategory.Warning,
        code: 0,
      });
    }
    return parsed.tags;
  }

  /** Emits a type annotation in JSDoc, or {?} if the type is unavailable. */
  emitJSDocType(node: ts.Node, additionalDocTag?: string, type?: ts.Type) {
    this.emit(' /**');
    if (additionalDocTag) {
      this.emit(' ' + additionalDocTag);
    }
    this.emit(` @type {${this.typeToClosure(node, type)}} */`);
  }

  /**
   * Convert a TypeScript ts.Type into the equivalent Closure type.
   *
   * @param context The ts.Node containing the type reference; used for resolving symbols
   *     in context.
   * @param type The type to translate; if not provided, the Node's type will be used.
   * @param destructuring If true, insert a Closure "!" (not-null annotation) on all
   *     object/array types.  This is a workaround specifically for destructuring
   *     bind patterns.
   */
  typeToClosure(context: ts.Node, type?: ts.Type, destructuring = false): string {
    if (this.options.untyped) {
      return '?';
    }

    let typeChecker = this.program.getTypeChecker();
    if (!type) {
      type = typeChecker.getTypeAtLocation(context);
    }
    let translator = new TypeTranslator(typeChecker, context, this.options.typeBlackListPaths);
    translator.warn = msg => this.debugWarn(context, msg);
    return translator.translate(type);
  }

  /**
   * debug logs a debug warning.  These should only be used for cases
   * where tsickle is making a questionable judgement about what to do.
   * By default, tsickle does not report any warnings to the caller,
   * and warnings are hidden behind a debug flag, as warnings are only
   * for tsickle to debug itself.
   */
  debugWarn(node: ts.Node, messageText: string) {
    if (!this.options.logWarning) return;
    // Use a ts.Diagnosic so that the warning includes context and file offets.
    let diagnostic: ts.Diagnostic = {
      file: this.file,
      start: node.getStart(),
      length: node.getEnd() - node.getStart(), messageText,
      category: ts.DiagnosticCategory.Warning,
      code: 0,
    };
    this.options.logWarning(diagnostic);
  }
}

/** Annotator translates a .ts to a .ts with Closure annotations. */
class Annotator extends ClosureRewriter {
  /**
   * Generated externs, if any. Any "declare" blocks encountered in the source
   * are forwarded to the ExternsWriter to be translated into externs.
   */
  private externsWriter: ExternsWriter;

  /** Exported symbol names that have been generated by expanding an "export * from ...". */
  private generatedExports = new Set<string>();

  constructor(
      program: ts.Program, file: ts.SourceFile, options: Options,
      private host?: ts.ModuleResolutionHost, private tsOpts?: ts.CompilerOptions) {
    super(program, file, options);
    this.externsWriter = new ExternsWriter(program, file, options);
  }

  annotate(): Output {
    this.visit(this.file);

    let externs = this.externsWriter.getOutput();
    let annotated = this.getOutput();

    let externsSource: string|null = null;
    if (externs.output) {
      externsSource = `/**
 * @externs
 * @suppress {duplicate}
 */
// NOTE: generated by tsickle, do not edit.
` + externs.output;
    }

    return {
      output: annotated.output,
      externs: externsSource,
      diagnostics: externs.diagnostics.concat(annotated.diagnostics),
      sourceMap: annotated.sourceMap,
    };
  }
  /**
   * Examines a ts.Node and decides whether to do special processing of it for output.
   *
   * @return True if the ts.Node has been handled, false if we should
   *     emit it as is and visit its children.
   */
  maybeProcess(node: ts.Node): boolean {
    if ((node.flags & ts.NodeFlags.Ambient) || isDtsFileName(this.file.fileName)) {
      this.externsWriter.visit(node);
      // An ambient declaration declares types for TypeScript's benefit, so we want to skip Tsickle
      // conversion of its contents.
      this.writeRange(node.getFullStart(), node.getEnd());
      return true;
    }

    switch (node.kind) {
      case ts.SyntaxKind.ImportDeclaration:
        return this.emitImportDeclaration(node as ts.ImportDeclaration);
      case ts.SyntaxKind.ExportDeclaration:
        let exportDecl = <ts.ExportDeclaration>node;
        this.writeRange(node.getFullStart(), node.getStart());
        this.emit('export');
        if (!exportDecl.exportClause && exportDecl.moduleSpecifier) {
          // It's an "export * from ..." statement.
          // Rewrite it to re-export each exported symbol directly.
          let exports = this.expandSymbolsFromExportStar(exportDecl);
          this.emit(` {${exports.join(',')}}`);
        } else {
          if (exportDecl.exportClause) this.visit(exportDecl.exportClause);
        }
        if (exportDecl.moduleSpecifier) {
          this.emit(' from');
          this.writeModuleSpecifier(exportDecl.moduleSpecifier);
        }
        this.emit(';');
        return true;
      case ts.SyntaxKind.InterfaceDeclaration:
        this.emitInterface(node as ts.InterfaceDeclaration);
        // Emit the TS interface verbatim, with no tsickle processing of properties.
        this.writeRange(node.getFullStart(), node.getEnd());
        return true;
      case ts.SyntaxKind.VariableDeclaration:
        let varDecl = node as ts.VariableDeclaration;
        // Only emit a type annotation when it's a plain variable and
        // not a binding pattern, as Closure doesn't(?) have a syntax
        // for annotating binding patterns.  See issue #128.
        if (varDecl.name.kind === ts.SyntaxKind.Identifier) {
          this.emitJSDocType(varDecl);
        }
        return false;
      case ts.SyntaxKind.ClassDeclaration:
        let classNode = <ts.ClassDeclaration>node;
        this.visitClassDeclaration(classNode);
        return true;
      case ts.SyntaxKind.PublicKeyword:
      case ts.SyntaxKind.PrivateKeyword:
        // The "public"/"private" keywords are encountered in two places:
        // 1) In class fields (which don't appear in the transformed output).
        // 2) In "parameter properties", e.g.
        //      constructor(/** @export */ public foo: string).
        // In case 2 it's important to not emit that JSDoc in the generated
        // constructor, as this is illegal for Closure.  It's safe to just
        // always skip comments preceding the 'public' keyword.
        // See test_files/parameter_properties.ts.
        this.writeNode(node, /* skipComments */ true);
        return true;
      case ts.SyntaxKind.Constructor:
        let ctor = <ts.ConstructorDeclaration>node;
        this.emitFunctionType([ctor]);
        // Write the "constructor(...) {" bit, but iterate through any
        // parameters if given so that we can examine them more closely.
        let offset = ctor.getStart();
        if (ctor.parameters.length) {
          for (let param of ctor.parameters) {
            this.writeRange(offset, param.getFullStart());
            this.visit(param);
            offset = param.getEnd();
          }
        }
        this.writeRange(offset, node.getEnd());
        return true;
      case ts.SyntaxKind.ArrowFunction:
        // It's difficult to annotate arrow functions due to a bug in
        // TypeScript (see tsickle issue 57).  For now, just pass them
        // through unannotated.
        return false;
      case ts.SyntaxKind.FunctionDeclaration:
      case ts.SyntaxKind.MethodDeclaration:
      case ts.SyntaxKind.GetAccessor:
      case ts.SyntaxKind.SetAccessor:
        let fnDecl = <ts.FunctionLikeDeclaration>node;

        if (!fnDecl.body) {
          if ((fnDecl.flags & ts.NodeFlags.Abstract) !== 0) {
            this.emitFunctionType([fnDecl]);
            // Abstract functions look like
            //   abstract foo();
            // Emit the function as normal, except:
            // - remove the "abstract"
            // - change the return type to "void"
            // - replace the trailing semicolon with an empty block {}
            // To do so, skip all modifiers before the function name, and
            // emit up to the end of the parameter list / return type.
            if (!fnDecl.name) {
              // Can you even have an unnamed abstract function?
              this.error(fnDecl, 'anonymous abstract function');
              return false;
            }
            this.writeRange(fnDecl.name.getStart(), fnDecl.parameters.end);
            this.emit(') {}');
            return true;
          }
          // Functions are allowed to not have bodies in the presence
          // of overloads.  It's not clear how to translate these overloads
          // into Closure types, so skip them for now.
          return false;
        }

        this.emitFunctionType([fnDecl]);
        this.writeRange(fnDecl.getStart(), fnDecl.body.getFullStart());
        this.visit(fnDecl.body);
        return true;
      case ts.SyntaxKind.TypeAliasDeclaration:
        this.writeNode(node);
        this.visitTypeAlias(<ts.TypeAliasDeclaration>node);
        return true;
      case ts.SyntaxKind.EnumDeclaration:
        return this.maybeProcessEnum(<ts.EnumDeclaration>node);
      case ts.SyntaxKind.TypeAssertionExpression:
      case ts.SyntaxKind.AsExpression:
        // Both of these cases are AssertionExpressions.
        let typeAssertion = node as ts.AssertionExpression;
        this.emitJSDocType(typeAssertion);
        // When TypeScript emits JS, it removes one layer of "redundant"
        // parens, but we need them for the Closure type assertion.  Work
        // around this by using two parens.  See test_files/coerce.*.
        // TODO: the comment is currently dropped from pure assignments due to
        //   https://github.com/Microsoft/TypeScript/issues/9873
        this.emit('((');
        this.writeNode(node);
        this.emit('))');
        return true;
      case ts.SyntaxKind.NonNullExpression:
        const nnexpr = node as ts.NonNullExpression;
        let type = this.program.getTypeChecker().getTypeAtLocation(nnexpr.expression);
        if (type.flags & ts.TypeFlags.Union) {
          const nonNullUnion =
              (type as ts.UnionType)
                  .types.filter(
                      t => (t.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)) === 0);
          const typeCopy = Object.assign({}, type as ts.UnionType);
          typeCopy.types = nonNullUnion;
          type = typeCopy;
        }
        this.emitJSDocType(nnexpr, undefined, type);
        // See comment above.
        this.emit('((');
        this.writeNode(nnexpr.expression);
        this.emit('))');
        return true;
      default:
        break;
    }
    return false;
  }

  /**
   * Given a "export * from ..." statement, gathers the symbol names it actually
   * exports to be used in a statement like "export {foo, bar, baz} from ...".
   *
   * This is necessary because TS transpiles "export *" by just doing a runtime loop
   * over the target module's exports, which means Closure won't see the declarations/types
   * that are exported.
   */
  private expandSymbolsFromExportStar(exportDecl: ts.ExportDeclaration): string[] {
    // You can't have an "export *" without a module specifier.
    const moduleSpecifier = exportDecl.moduleSpecifier!;
    let typeChecker = this.program.getTypeChecker();

    // Gather the names of local exports, to avoid reexporting any
    // names that are already locally exported.
    // To find symbols declared like
    //   export {foo} from ...
    // we must also query for "Alias", but that unfortunately also brings in
    //   import {foo} from ...
    // so the latter is filtered below.
    let locals =
        typeChecker.getSymbolsInScope(this.file, ts.SymbolFlags.Export | ts.SymbolFlags.Alias);
    let localSet = new Set<string>();
    for (let local of locals) {
      if (local.declarations &&
          local.declarations.some(d => d.kind === ts.SyntaxKind.ImportSpecifier)) {
        continue;
      }
      localSet.add(local.name);
    }


    // Expand the export list, then filter it to the symbols we want to reexport.
    let exports = typeChecker.getExportsOfModule(typeChecker.getSymbolAtLocation(moduleSpecifier));
    const reexports = new Set<string>();
    for (let sym of exports) {
      let name = unescapeName(sym.name);
      if (localSet.has(name)) {
        // This name is shadowed by a local definition, such as:
        // - export var foo ...
        // - export {foo} from ...
        continue;
      }
      if (this.generatedExports.has(name)) {
        // Already exported via an earlier expansion of an "export * from ...".
        continue;
      }
      this.generatedExports.add(name);
      reexports.add(name);
    }

    return toArray(reexports.keys());
  }

  /**
   * Convert from implicit `import {} from 'pkg'` to `import {} from 'pkg/index'.
   * TypeScript supports the shorthand, but not all ES6 module loaders do.
   * Workaround for https://github.com/Microsoft/TypeScript/issues/12597
   */
  private writeModuleSpecifier(moduleSpecifier: ts.Expression) {
    if (moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
      throw new Error(`unhandled moduleSpecifier kind: ${ts.SyntaxKind[moduleSpecifier.kind]}`);
    }
    let moduleId = (moduleSpecifier as ts.StringLiteral).text;
    if (this.options.convertIndexImportShorthand) {
      if (!this.tsOpts || !this.host) {
        throw new Error(
            'option convertIndexImportShorthand requires that annotate be called with a TypeScript host and options.');
      }
      const resolved = ts.resolveModuleName(moduleId, this.file.fileName, this.tsOpts, this.host);
      if (resolved && resolved.resolvedModule) {
        const resolvedModule = resolved.resolvedModule.resolvedFileName.replace(/(\.d)?\.ts$/, '');
        const requestedModule = moduleId.replace(/\.js$/, '');
        // If the imported module resolves to foo/index, but the specified module was foo, then we
        // append the /index.
        if (resolvedModule.substr(resolvedModule.length - 6) === '/index' &&
            requestedModule.substr(requestedModule.length - 6) !== '/index') {
          moduleId += '/index';
        }
      }
    }
    this.emit(` '${moduleId}'`);
  }

  /**
   * Handles emit of an "import ..." statement.
   * We need to do a bit of rewriting so that imported types show up under the
   * correct name in JSDoc.
   * @return true if the decl was handled, false to allow default processing.
   */
  private emitImportDeclaration(decl: ts.ImportDeclaration): boolean {
    this.writeRange(decl.getFullStart(), decl.getStart());
    this.emit('import');
    const importClause = decl.importClause;
    if (!importClause) {
      // import './foo';

      this.writeModuleSpecifier(decl.moduleSpecifier);
      this.emit(';');
      return true;
    } else if (
        importClause.name || (importClause.namedBindings &&
                              importClause.namedBindings.kind === ts.SyntaxKind.NamedImports)) {
      this.visit(importClause);
      this.emit(' from');
      this.writeModuleSpecifier(decl.moduleSpecifier);
      this.emit(';');

      // importClause.name implies
      //   import a from ...;
      // namedBindings being NamedImports implies
      //   import {a as b} from ...;
      //
      // Both of these forms create a local name "a", which after
      // TypeScript CommonJS compilation will become some renamed
      // variable like "module_1.a".  But a user might still use plain
      // "a" in some JSDoc comment, so gather up these local names for
      // imports and make an alias for each for JSDoc purposes.
      if (!this.options.untyped) {
        let localNames: string[];
        if (importClause.name) {
          // import a from ...;
          localNames = [getIdentifierText(importClause.name)];
        } else {
          // import {a as b} from ...;
          const namedImports = importClause.namedBindings as ts.NamedImports;
          localNames = namedImports.elements.map(imp => getIdentifierText(imp.name));
        }

        for (let name of localNames) {
          // This may look like a self-reference but TypeScript will rename the
          // right-hand side!
          this.emit(
              `\nconst ${name}: NeverTypeCheckMe = ${name};  /* local alias for Closure JSDoc */`);
        }
      }
      return true;
    } else if (
        importClause.namedBindings &&
        importClause.namedBindings.kind === ts.SyntaxKind.NamespaceImport) {
      // import * as foo from ...;
      this.visit(importClause);
      this.emit(' from');
      this.writeModuleSpecifier(decl.moduleSpecifier);
      this.emit(';');
      return true;
    } else {
      this.errorUnimplementedKind(decl, 'unexpected kind of import');
      return false;  // Use default processing.
    }
  }

  private visitClassDeclaration(classDecl: ts.ClassDeclaration) {
    let jsDoc = this.getJSDoc(classDecl) || [];
    if ((classDecl.flags & ts.NodeFlags.Abstract) !== 0) {
      jsDoc.push({tagName: 'abstract'});
    }
    this.emit('\n');
    if (jsDoc.length > 0) this.emit(jsdoc.toString(jsDoc));
    if (classDecl.members.length > 0) {
      // We must visit all members individually, to strip out any
      // /** @export */ annotations that show up in the constructor
      // and to annotate methods.
      this.writeRange(classDecl.getStart(), classDecl.members[0].getFullStart());
      for (let member of classDecl.members) {
        this.visit(member);
      }
    } else {
      this.writeRange(classDecl.getStart(), classDecl.getLastToken().getFullStart());
    }
    this.writeNode(classDecl.getLastToken());
    this.emitTypeAnnotationsHelper(classDecl);
    return true;
  }

  private emitInterface(iface: ts.InterfaceDeclaration) {
    if (this.options.untyped) return;

    // If this symbol is both a type and a value, we cannot emit both into Closure's
    // single namespace.
    let sym = this.program.getTypeChecker().getSymbolAtLocation(iface.name);
    if (sym.flags & ts.SymbolFlags.Value) return;

    this.emit(`\n/** @record */\n`);
    if (iface.flags & ts.NodeFlags.Export) this.emit('export ');
    let name = getIdentifierText(iface.name);
    this.emit(`function ${name}() {}\n`);
    if (iface.typeParameters) {
      this.emit(`// TODO: type parameters.\n`);
    }
    if (iface.heritageClauses) {
      this.emit(`// TODO: derived interfaces.\n`);
    }

    const memberNamespace = [name, 'prototype'];
    for (let elem of iface.members) {
      this.visitProperty(memberNamespace, elem);
    }
  }

  // emitTypeAnnotationsHelper produces a
  // _tsickle_typeAnnotationsHelper() where none existed in the
  // original source.  It's necessary in the case where TypeScript
  // syntax specifies there are additional properties on the class,
  // because to declare these in Closure you must declare these in a
  // method somewhere.
  private emitTypeAnnotationsHelper(classDecl: ts.ClassDeclaration) {
    // Gather parameter properties from the constructor, if it exists.
    let ctors: ts.ConstructorDeclaration[] = [];
    let paramProps: ts.ParameterDeclaration[] = [];
    let nonStaticProps: ts.PropertyDeclaration[] = [];
    let staticProps: ts.PropertyDeclaration[] = [];
    for (let member of classDecl.members) {
      if (member.kind === ts.SyntaxKind.Constructor) {
        ctors.push(member as ts.ConstructorDeclaration);
      } else if (member.kind === ts.SyntaxKind.PropertyDeclaration) {
        let prop = member as ts.PropertyDeclaration;
        let isStatic = (prop.flags & ts.NodeFlags.Static) !== 0;
        if (isStatic) {
          staticProps.push(prop);
        } else {
          nonStaticProps.push(prop);
        }
      }
    }

    if (ctors.length > 0) {
      let ctor = ctors[0];
      paramProps = ctor.parameters.filter((p) => !!(p.flags & VISIBILITY_FLAGS));
    }

    if (nonStaticProps.length === 0 && paramProps.length === 0 && staticProps.length === 0) {
      // There are no members so we don't need to emit any type
      // annotations helper.
      return;
    }

    if (!classDecl.name) return;
    let className = getIdentifierText(classDecl.name);

    this.emit(`\n\nfunction ${className}_tsickle_Closure_declarations() {\n`);
    staticProps.forEach(p => this.visitProperty([className], p));
    let memberNamespace = [className, 'prototype'];
    nonStaticProps.forEach((p) => this.visitProperty(memberNamespace, p));
    paramProps.forEach((p) => this.visitProperty(memberNamespace, p));
    this.emit(`}\n`);
  }

  private propertyName(prop: ts.Declaration): string|null {
    if (!prop.name) return null;

    switch (prop.name.kind) {
      case ts.SyntaxKind.Identifier:
        return getIdentifierText(prop.name as ts.Identifier);
      case ts.SyntaxKind.StringLiteral:
        // E.g. interface Foo { 'bar': number; }
        // If 'bar' is a name that is not valid in Closure then there's nothing we can do.
        return (prop.name as ts.StringLiteral).text;
      default:
        return null;
    }
  }

  private visitProperty(namespace: string[], p: ts.Declaration) {
    let name = this.propertyName(p);
    if (!name) {
      this.emit(`/* TODO: handle strange member:\n${this.escapeForComment(p.getText())}\n*/\n`);
      return;
    }

    let tags = this.getJSDoc(p) || [];
    let existingAnnotation = '';
    for (let {tagName, text} of tags) {
      if (tagName) {
        existingAnnotation += `@${tagName}\n`;
      } else {
        existingAnnotation += `${text}\n`;
      }
    }
    tags.push({tagName: 'type', type: this.typeToClosure(p)});
    this.emit(jsdoc.toString(tags));
    namespace = namespace.concat([name]);
    this.emit(`${namespace.join('.')};\n`);
  }

  private visitTypeAlias(node: ts.TypeAliasDeclaration) {
    if (this.options.untyped) return;
    // Write a Closure typedef, which involves an unused "var" declaration.
    // Note: in the case of an export, we cannot emit a literal "var" because
    // TypeScript drops exports that are never assigned to (and Closure
    // requires us to not assign to typedef exports).  Instead, emit the
    // "exports.foo;" line directly in that case.
    this.emit(`\n/** @typedef {${this.typeToClosure(node)}} */\n`);
    if (node.flags & ts.NodeFlags.Export) {
      this.emit('exports.');
    } else {
      this.emit('var ');
    }
    this.emit(`${node.name.getText()};\n`);
  }

  /** Processes an EnumDeclaration or returns false for ordinary processing. */
  private maybeProcessEnum(node: ts.EnumDeclaration): boolean {
    if (node.flags & ts.NodeFlags.Const) {
      // const enums disappear after TS compilation and consequently need no
      // help from tsickle.
      return false;
    }

    // Gather the members of enum, saving the constant value or
    // initializer expression in the case of a non-constant value.
    let members = new Map<string, number|ts.Node>();
    let i = 0;
    for (let member of node.members) {
      let memberName = member.name.getText();
      if (member.initializer) {
        let enumConstValue = this.program.getTypeChecker().getConstantValue(member);
        if (enumConstValue !== undefined) {
          members.set(memberName, enumConstValue);
          i = enumConstValue + 1;
        } else {
          // Non-constant enum value.  Save the initializer expression for
          // emitting as-is.
          // Note: if the member's initializer expression refers to another
          // value within the enum (e.g. something like
          //   enum Foo {
          //     Field1,
          //     Field2 = Field1 + something(),
          //   }
          // Then when we emit the initializer we produce invalid code because
          // on the Closure side it has to be written "Foo.Field1 + something()".
          // Hopefully this doesn't come up often -- if the enum instead has
          // something like
          //     Field2 = Field1 + 3,
          // then it's still a constant expression and we inline the constant
          // value in the above branch of this "if" statement.
          members.set(memberName, member.initializer);
        }
      } else {
        members.set(memberName, i);
        i++;
      }
    }

    // Emit the enum declaration, which looks like:
    //   type Foo = number;
    //   let Foo: any = {};
    // We use an "any" here rather than a more specific type because
    // we think TypeScript has already checked types for us, and it's
    // a bit difficult to provide a type that matches all the interfaces
    // expected of an enum (in particular, it is keyable both by
    // string and number).
    // We don't emit a specific Closure type for the enum because it's
    // also difficult to make work: for example, we can't make the name
    // both a typedef and an indexable object if we export it.
    this.emit('\n');
    let name = node.name.getText();
    if (node.flags & ts.NodeFlags.Export) {
      this.emit('export ');
    }
    this.emit(`type ${name} = number;\n`);
    if (node.flags & ts.NodeFlags.Export) {
      this.emit('export ');
    }
    this.emit(`let ${name}: any = {};\n`);

    // Emit foo.BAR = 0; lines.
    for (let member of toArray(members.keys())) {
      if (!this.options.untyped) this.emit(`/** @type {number} */\n`);
      this.emit(`${name}.${member} = `);
      let value = members.get(member)!;
      if (typeof value === 'number') {
        this.emit(value.toString());
      } else {
        this.visit(value);
      }
      this.emit(';\n');
    }

    // Emit foo[foo.BAR] = 'BAR'; lines.
    for (let member of toArray(members.keys())) {
      this.emit(`${name}[${name}.${member}] = "${member}";\n`);
    }

    return true;
  }
}

/** ExternsWriter generates Closure externs from TypeScript source. */
class ExternsWriter extends ClosureRewriter {
  /** visit is the main entry point.  It generates externs from a ts.Node. */
  public visit(node: ts.Node, namespace: string[] = []) {
    switch (node.kind) {
      case ts.SyntaxKind.SourceFile:
        let sourceFile = node as ts.SourceFile;
        for (let stmt of sourceFile.statements) {
          this.visit(stmt, namespace);
        }
        break;
      case ts.SyntaxKind.ModuleDeclaration:
        let decl = <ts.ModuleDeclaration>node;
        switch (decl.name.kind) {
          case ts.SyntaxKind.Identifier:
            // E.g. "declare namespace foo {"
            let name = getIdentifierText(decl.name as ts.Identifier);
            if (name === undefined) break;
            namespace = namespace.concat(name);
            if (this.isFirstDeclaration(decl)) {
              this.emit('/** @const */\n');
              if (namespace.length > 1) {
                this.emit(`${namespace.join('.')} = {};\n`);
              } else {
                this.emit(`var ${namespace} = {};\n`);
              }
            }
            if (decl.body) this.visit(decl.body, namespace);
            break;
          case ts.SyntaxKind.StringLiteral:
            // E.g. "declare module 'foo' {" (note the quotes).
            // Skip it.
            break;
          default:
            this.errorUnimplementedKind(decl.name, 'externs generation of namespace');
        }
        break;
      case ts.SyntaxKind.ModuleBlock:
        let block = <ts.ModuleBlock>node;
        for (let stmt of block.statements) {
          this.visit(stmt, namespace);
        }
        break;
      case ts.SyntaxKind.ClassDeclaration:
      case ts.SyntaxKind.InterfaceDeclaration:
        this.writeExternsType(<ts.InterfaceDeclaration|ts.ClassDeclaration>node, namespace);
        break;
      case ts.SyntaxKind.FunctionDeclaration:
        const fnDecl = node as ts.FunctionDeclaration;
        const name = fnDecl.name;
        if (!name) {
          this.error(fnDecl, 'anonymous function in externs');
          break;
        }
        // Gather up all overloads of this function.
        const sym = this.program.getTypeChecker().getSymbolAtLocation(name);
        const decls =
            sym.declarations!.filter(
                                 d => d.kind ===
                                     ts.SyntaxKind.FunctionDeclaration) as ts.FunctionDeclaration[];
        // Only emit the first declaration of each overloaded function.
        if (fnDecl !== decls[0]) break;
        const params = this.emitFunctionType(decls);
        this.writeExternsFunction(name.getText(), params, namespace);
        break;
      case ts.SyntaxKind.VariableStatement:
        for (let decl of (<ts.VariableStatement>node).declarationList.declarations) {
          this.writeExternsVariableDecl(decl, namespace);
        }
        break;
      case ts.SyntaxKind.EnumDeclaration:
        this.writeExternsEnum(node as ts.EnumDeclaration, namespace);
        break;
      case ts.SyntaxKind.TypeAliasDeclaration:
        this.writeExternsTypeAlias(node as ts.TypeAliasDeclaration, namespace);
        break;
      default:
        this.emit(`\n/* TODO: ${ts.SyntaxKind[node.kind]} in ${namespace.join('.')} */\n`);
        break;
    }
  }

  /**
   * isFirstDeclaration returns true if decl is the first declaration
   * of its symbol.  E.g. imagine
   *   interface Foo { x: number; }
   *   interface Foo { y: number; }
   * we only want to emit the "@record" for Foo on the first one.
   */
  private isFirstDeclaration(decl: ts.DeclarationStatement): boolean {
    if (!decl.name) return true;
    const typeChecker = this.program.getTypeChecker();
    const sym = typeChecker.getSymbolAtLocation(decl.name);
    if (!sym.declarations || sym.declarations.length < 2) return true;
    return decl === sym.declarations[0];
  }

  private writeExternsType(decl: ts.InterfaceDeclaration|ts.ClassDeclaration, namespace: string[]) {
    const name = decl.name;
    if (!name) {
      this.error(decl, 'anonymous type in externs');
      return;
    }
    let typeName = namespace.concat([name.getText()]).join('.');
    if (closureExternsBlacklist.indexOf(typeName) >= 0) return;

    if (this.isFirstDeclaration(decl)) {
      let paramNames: string[] = [];
      if (decl.kind === ts.SyntaxKind.ClassDeclaration) {
        let ctors =
            (<ts.ClassDeclaration>decl).members.filter((m) => m.kind === ts.SyntaxKind.Constructor);
        if (ctors.length) {
          let firstCtor: ts.ConstructorDeclaration = <ts.ConstructorDeclaration>ctors[0];
          const ctorTags = [{tagName: 'constructor'}, {tagName: 'struct'}];
          if (ctors.length > 1) {
            paramNames = this.emitFunctionType(ctors as ts.ConstructorDeclaration[], ctorTags);
          } else {
            paramNames = this.emitFunctionType([firstCtor], ctorTags);
          }
        } else {
          this.emit('\n/** @constructor @struct */\n');
        }
      } else {
        this.emit('\n/** @record @struct */\n');
      }
      this.writeExternsFunction(name.getText(), paramNames, namespace);
    }

    // Process everything except (MethodSignature|MethodDeclaration|Constructor)
    let methods: Map<string, ts.MethodDeclaration[]> = new Map();
    for (let member of decl.members) {
      switch (member.kind) {
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.PropertyDeclaration:
          let prop = <ts.PropertySignature>member;
          if (prop.name.kind === ts.SyntaxKind.Identifier) {
            this.emitJSDocType(prop);
            this.emit(`\n${typeName}.prototype.${prop.name.getText()};\n`);
            continue;
          }
          // TODO: For now property names other than Identifiers are not handled; e.g.
          //    interface Foo { "123bar": number }
          break;
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.MethodDeclaration:
          const method = member as ts.MethodDeclaration;
          const methodName = method.name.getText();
          if (methods.has(methodName)) {
            methods.get(methodName)!.push(method);
          } else {
            methods.set(methodName, [method]);
          }
          continue;
        case ts.SyntaxKind.Constructor:
          continue;  // Handled above.
        default:
          // Members can include things like index signatures, for e.g.
          //   interface Foo { [key: string]: number; }
          // For now, just skip it.
          break;
      }
      // If we get here, the member wasn't handled in the switch statement.
      let memberName = namespace;
      if (member.name) {
        memberName = memberName.concat([member.name.getText()]);
      }
      this.emit(`\n/* TODO: ${ts.SyntaxKind[member.kind]}: ${memberName.join('.')} */\n`);
    }

    // Handle method declarations/signatures separately, since we need to deal with overloads.
    namespace = namespace.concat([name.getText(), 'prototype']);
    for (const methodVariants of Array.from(methods.values())) {
      let firstMethodVariant = methodVariants[0];
      let parameterNames: string[];
      if (methodVariants.length > 1) {
        parameterNames = this.emitFunctionType(methodVariants);
      } else {
        parameterNames = this.emitFunctionType([firstMethodVariant]);
      }
      this.writeExternsFunction(firstMethodVariant.name.getText(), parameterNames, namespace);
    }
  }

  private writeExternsVariableDecl(decl: ts.VariableDeclaration, namespace: string[]) {
    if (decl.name.kind === ts.SyntaxKind.Identifier) {
      let name = getIdentifierText(decl.name as ts.Identifier);
      if (closureExternsBlacklist.indexOf(name) >= 0) return;
      this.emitJSDocType(decl);
      this.emit('\n');
      this.writeExternsVariable(name, namespace);
    } else {
      this.errorUnimplementedKind(decl.name, 'externs for variable');
    }
  }

  private writeExternsVariable(name: string, namespace: string[], value?: string) {
    let qualifiedName = namespace.concat([name]).join('.');
    if (namespace.length === 0) this.emit(`var `);
    this.emit(qualifiedName);
    if (value) this.emit(` = ${value}`);
    this.emit(';\n');
  }

  private writeExternsFunction(name: string, params: string[], namespace: string[]) {
    let paramsStr = params.join(', ');
    if (namespace.length > 0) {
      name = namespace.concat([name]).join('.');
      this.emit(`${name} = function(${paramsStr}) {};\n`);
    } else {
      this.emit(`function ${name}(${paramsStr}) {}\n`);
    }
  }

  private writeExternsEnum(decl: ts.EnumDeclaration, namespace: string[]) {
    const name = getIdentifierText(decl.name);
    this.emit('\n/** @const */\n');
    this.writeExternsVariable(name, namespace, '{}');
    namespace = namespace.concat([name]);
    for (let member of decl.members) {
      let memberName: string|undefined;
      switch (member.name.kind) {
        case ts.SyntaxKind.Identifier:
          memberName = getIdentifierText(member.name as ts.Identifier);
          break;
        case ts.SyntaxKind.StringLiteral:
          let text = (member.name as ts.StringLiteral).text;
          if (isValidClosurePropertyName(text)) memberName = text;
          break;
        default:
          break;
      }
      if (!memberName) {
        this.emit(`\n/* TODO: ${ts.SyntaxKind[member.name.kind]}: ${member.name.getText()} */\n`);
        continue;
      }
      this.emit('/** @const {number} */\n');
      this.writeExternsVariable(memberName, namespace);
    }
  }

  private writeExternsTypeAlias(decl: ts.TypeAliasDeclaration, namespace: string[]) {
    this.emit(`\n/** @typedef {${this.typeToClosure(decl)}} */\n`);
    this.writeExternsVariable(getIdentifierText(decl.name), namespace);
  }
}

export function annotate(
    program: ts.Program, file: ts.SourceFile, options: Options = {}, host?: ts.ModuleResolutionHost,
    tsOpts?: ts.CompilerOptions): Output {
  assertTypeChecked(file);
  return new Annotator(program, file, options, host, tsOpts).annotate();
}
