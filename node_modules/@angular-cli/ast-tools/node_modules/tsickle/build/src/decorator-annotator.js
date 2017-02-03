/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require('typescript');
var rewriter_1 = require('./rewriter');
var type_translator_1 = require('./type-translator');
var util_1 = require('./util');
exports.ANNOTATION_SUPPORT_CODE = "\ninterface DecoratorInvocation {\n  type: Function;\n  args?: any[];\n}\n";
// ClassRewriter rewrites a single "class Foo {...}" declaration.
// It's its own object because we collect decorators on the class and the ctor
// separately for each class we encounter.
var ClassRewriter = (function (_super) {
    __extends(ClassRewriter, _super);
    function ClassRewriter(typeChecker, sourceFile) {
        _super.call(this, sourceFile);
        this.typeChecker = typeChecker;
    }
    /**
     * Determines whether the given decorator should be re-written as an annotation.
     */
    ClassRewriter.prototype.shouldLower = function (decorator) {
        // Walk down the expression to find the identifier of the decorator function
        var node = decorator;
        while (node.kind !== ts.SyntaxKind.Identifier) {
            switch (node.kind) {
                case ts.SyntaxKind.Decorator:
                    node = node.expression;
                    break;
                case ts.SyntaxKind.CallExpression:
                    node = node.expression;
                    break;
                default:
                    return false;
            }
        }
        var decSym = this.typeChecker.getSymbolAtLocation(node);
        if (decSym.flags & ts.SymbolFlags.Alias) {
            decSym = this.typeChecker.getAliasedSymbol(decSym);
        }
        return decSym.getDocumentationComment().some(function (c) { return c.text.indexOf('@Annotation') >= 0; });
    };
    ClassRewriter.prototype.decoratorsToLower = function (n) {
        var _this = this;
        if (n.decorators) {
            return n.decorators.filter(function (d) { return _this.shouldLower(d); });
        }
        return [];
    };
    /**
     * process is the main entry point, rewriting a single class node.
     */
    ClassRewriter.prototype.process = function (node) {
        var _this = this;
        if (node.decorators) {
            var toLower = this.decoratorsToLower(node);
            if (toLower.length > 0)
                this.decorators = toLower;
        }
        // Emit the class contents, but stop just before emitting the closing curly brace.
        // (This code is the same as Rewriter.writeNode except for the curly brace handling.)
        var pos = node.getFullStart();
        ts.forEachChild(node, function (child) {
            // This forEachChild handles emitting the text between each child, while child.visit
            // recursively emits the children themselves.
            _this.writeRange(pos, child.getFullStart());
            _this.visit(child);
            pos = child.getEnd();
        });
        // At this point, we've emitted up through the final child of the class, so all that
        // remains is the trailing whitespace and closing curly brace.
        // The final character owned by the class node should always be a '}',
        // or we somehow got the AST wrong and should report an error.
        // (Any whitespace or semicolon following the '}' will be part of the next Node.)
        if (this.file.text[node.getEnd() - 1] !== '}') {
            this.error(node, 'unexpected class terminator');
        }
        this.writeRange(pos, node.getEnd() - 1);
        this.emitMetadata();
        this.emit('}');
        return this.getOutput();
    };
    /**
     * gatherConstructor grabs the parameter list and decorators off the class
     * constructor, and emits nothing.
     */
    ClassRewriter.prototype.gatherConstructor = function (ctor) {
        var ctorParameters = [];
        var hasDecoratedParam = false;
        for (var _i = 0, _a = ctor.parameters; _i < _a.length; _i++) {
            var param = _a[_i];
            var paramCtor = void 0;
            var decorators = void 0;
            if (param.decorators) {
                decorators = this.decoratorsToLower(param);
                hasDecoratedParam = decorators.length > 0;
            }
            if (param.type) {
                // param has a type provided, e.g. "foo: Bar".
                // Verify that "Bar" is a value (e.g. a constructor) and not just a type.
                var sym = this.typeChecker.getTypeAtLocation(param.type).getSymbol();
                if (sym && (sym.flags & ts.SymbolFlags.Value)) {
                    paramCtor = new type_translator_1.TypeTranslator(this.typeChecker, param.type).symbolToString(sym);
                }
            }
            if (paramCtor || decorators) {
                ctorParameters.push([paramCtor, decorators]);
            }
            else {
                ctorParameters.push(null);
            }
        }
        // Use the ctor parameter metadata only if the class or the ctor was decorated.
        if (this.decorators || hasDecoratedParam) {
            this.ctorParameters = ctorParameters;
        }
    };
    /**
     * gatherMethod grabs the decorators off a class method and emits nothing.
     */
    ClassRewriter.prototype.gatherMethodOrProperty = function (method) {
        if (!method.decorators)
            return;
        if (!method.name || method.name.kind !== ts.SyntaxKind.Identifier) {
            // Method has a weird name, e.g.
            //   [Symbol.foo]() {...}
            this.error(method, 'cannot process decorators on strangely named method');
            return;
        }
        var name = method.name.text;
        var decorators = this.decoratorsToLower(method);
        if (decorators.length === 0)
            return;
        if (!this.propDecorators)
            this.propDecorators = new Map();
        this.propDecorators.set(name, decorators);
    };
    /**
     * maybeProcess is called by the traversal of the AST.
     * @return True if the node was handled, false to have the node emitted as normal.
     */
    ClassRewriter.prototype.maybeProcess = function (node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                // Encountered a new class while processing this class; use a new separate
                // rewriter to gather+emit its metadata.
                var _a = new ClassRewriter(this.typeChecker, this.file).process(node), output = _a.output, diagnostics = _a.diagnostics;
                (_b = this.diagnostics).push.apply(_b, diagnostics);
                this.emit(output);
                return true;
            case ts.SyntaxKind.Constructor:
                this.gatherConstructor(node);
                return false; // Proceed with ordinary emit of the ctor.
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.SetAccessor:
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.MethodDeclaration:
                this.gatherMethodOrProperty(node);
                return false; // Proceed with ordinary emit of the method.
            case ts.SyntaxKind.Decorator:
                if (this.shouldLower(node)) {
                    // Return true to signal that this node should not be emitted,
                    // but still emit the whitespace *before* the node.
                    this.writeRange(node.getFullStart(), node.getStart());
                    return true;
                }
                return false;
            default:
                return false;
        }
        var _b;
    };
    /**
     * emitMetadata emits the various gathered metadata, as static fields.
     */
    ClassRewriter.prototype.emitMetadata = function () {
        if (this.decorators) {
            this.emit("static decorators: DecoratorInvocation[] = [\n");
            for (var _i = 0, _a = this.decorators; _i < _a.length; _i++) {
                var annotation = _a[_i];
                this.emitDecorator(annotation);
                this.emit(',\n');
            }
            this.emit('];\n');
        }
        if (this.decorators || this.ctorParameters) {
            this.emit("/** @nocollapse */\n");
            // ctorParameters may contain forward references in the type: field, so wrap in a function
            // closure
            this.emit("static ctorParameters: () => ({type: any, decorators?: DecoratorInvocation[]}|null)[] = () => [\n");
            for (var _b = 0, _c = this.ctorParameters || []; _b < _c.length; _b++) {
                var param = _c[_b];
                if (!param) {
                    this.emit('null,\n');
                    continue;
                }
                var ctor = param[0], decorators = param[1];
                this.emit("{type: " + ctor + ", ");
                if (decorators) {
                    this.emit('decorators: [');
                    for (var _d = 0, decorators_1 = decorators; _d < decorators_1.length; _d++) {
                        var decorator = decorators_1[_d];
                        this.emitDecorator(decorator);
                        this.emit(', ');
                    }
                    this.emit(']');
                }
                this.emit('},\n');
            }
            this.emit("];\n");
        }
        if (this.propDecorators) {
            this.emit('static propDecorators: {[key: string]: DecoratorInvocation[]} = {\n');
            for (var _e = 0, _f = util_1.toArray(this.propDecorators.keys()); _e < _f.length; _e++) {
                var name_1 = _f[_e];
                this.emit("'" + name_1 + "': [");
                for (var _g = 0, _h = this.propDecorators.get(name_1); _g < _h.length; _g++) {
                    var decorator = _h[_g];
                    this.emitDecorator(decorator);
                    this.emit(',');
                }
                this.emit('],\n');
            }
            this.emit('};\n');
        }
    };
    ClassRewriter.prototype.emitDecorator = function (decorator) {
        this.emit('{ type: ');
        var expr = decorator.expression;
        switch (expr.kind) {
            case ts.SyntaxKind.Identifier:
                // The decorator was a plain @Foo.
                this.visit(expr);
                break;
            case ts.SyntaxKind.CallExpression:
                // The decorator was a call, like @Foo(bar).
                var call = expr;
                this.visit(call.expression);
                if (call.arguments.length) {
                    this.emit(', args: [');
                    for (var _i = 0, _a = call.arguments; _i < _a.length; _i++) {
                        var arg = _a[_i];
                        this.emit(arg.getText());
                        this.emit(', ');
                    }
                    this.emit(']');
                }
                break;
            default:
                this.errorUnimplementedKind(expr, 'gathering metadata');
                this.emit('undefined');
        }
        this.emit(' }');
    };
    return ClassRewriter;
}(rewriter_1.Rewriter));
var DecoratorRewriter = (function (_super) {
    __extends(DecoratorRewriter, _super);
    function DecoratorRewriter(typeChecker, sourceFile) {
        _super.call(this, sourceFile);
        this.typeChecker = typeChecker;
    }
    DecoratorRewriter.prototype.process = function () {
        this.visit(this.file);
        return this.getOutput();
    };
    DecoratorRewriter.prototype.maybeProcess = function (node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                var _a = new ClassRewriter(this.typeChecker, this.file).process(node), output = _a.output, diagnostics = _a.diagnostics;
                (_b = this.diagnostics).push.apply(_b, diagnostics);
                this.emit(output);
                return true;
            default:
                return false;
        }
        var _b;
    };
    return DecoratorRewriter;
}(rewriter_1.Rewriter));
function convertDecorators(typeChecker, sourceFile) {
    type_translator_1.assertTypeChecked(sourceFile);
    return new DecoratorRewriter(typeChecker, sourceFile).process();
}
exports.convertDecorators = convertDecorators;

//# sourceMappingURL=decorator-annotator.js.map
