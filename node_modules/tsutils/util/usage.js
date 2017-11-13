"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("./util");
var ts = require("typescript");
var DeclarationDomain;
(function (DeclarationDomain) {
    DeclarationDomain[DeclarationDomain["Namespace"] = 1] = "Namespace";
    DeclarationDomain[DeclarationDomain["Type"] = 2] = "Type";
    DeclarationDomain[DeclarationDomain["Value"] = 4] = "Value";
    DeclarationDomain[DeclarationDomain["Import"] = 8] = "Import";
    DeclarationDomain[DeclarationDomain["Any"] = 7] = "Any";
})(DeclarationDomain = exports.DeclarationDomain || (exports.DeclarationDomain = {}));
var UsageDomain;
(function (UsageDomain) {
    UsageDomain[UsageDomain["Namespace"] = 1] = "Namespace";
    UsageDomain[UsageDomain["Type"] = 2] = "Type";
    UsageDomain[UsageDomain["Value"] = 4] = "Value";
    UsageDomain[UsageDomain["ValueOrNamespace"] = 5] = "ValueOrNamespace";
    UsageDomain[UsageDomain["Any"] = 7] = "Any";
    UsageDomain[UsageDomain["TypeQuery"] = 8] = "TypeQuery";
})(UsageDomain = exports.UsageDomain || (exports.UsageDomain = {}));
function getUsageDomain(node) {
    var parent = node.parent;
    switch (parent.kind) {
        case ts.SyntaxKind.TypeReference:
            return 2;
        case ts.SyntaxKind.ExpressionWithTypeArguments:
            return parent.parent.token === ts.SyntaxKind.ImplementsKeyword ||
                parent.parent.parent.kind === ts.SyntaxKind.InterfaceDeclaration
                ? 2
                : 4;
        case ts.SyntaxKind.TypeQuery:
            return 5 | 8;
        case ts.SyntaxKind.QualifiedName:
            if (parent.left === node) {
                if (getEntityNameParent(parent).kind === ts.SyntaxKind.TypeQuery)
                    return 1 | 8;
                return 1;
            }
            break;
        case ts.SyntaxKind.ExportSpecifier:
            if (parent.propertyName === undefined ||
                parent.propertyName === node)
                return 7;
            break;
        case ts.SyntaxKind.ExportAssignment:
            return 7;
        case ts.SyntaxKind.BindingElement:
            if (parent.initializer === node)
                return 5;
            break;
        case ts.SyntaxKind.Parameter:
        case ts.SyntaxKind.EnumMember:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.VariableDeclaration:
        case ts.SyntaxKind.PropertyAssignment:
        case ts.SyntaxKind.PropertyAccessExpression:
        case ts.SyntaxKind.ImportEqualsDeclaration:
            if (parent.name !== node)
                return 5;
            break;
        case ts.SyntaxKind.JsxAttribute:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.NamespaceImport:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.ModuleDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.EnumDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.LabeledStatement:
        case ts.SyntaxKind.BreakStatement:
        case ts.SyntaxKind.ContinueStatement:
        case ts.SyntaxKind.ImportClause:
        case ts.SyntaxKind.ImportSpecifier:
        case ts.SyntaxKind.TypePredicate:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.NamespaceExportDeclaration:
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.TypeParameter:
            break;
        default:
            return 5;
    }
}
exports.getUsageDomain = getUsageDomain;
function getDeclarationDomain(node) {
    switch (node.parent.kind) {
        case ts.SyntaxKind.TypeParameter:
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
            return 2;
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
            return 2 | 4;
        case ts.SyntaxKind.EnumDeclaration:
            return 7;
        case ts.SyntaxKind.NamespaceImport:
        case ts.SyntaxKind.ImportClause:
            return 7 | 8;
        case ts.SyntaxKind.ImportEqualsDeclaration:
        case ts.SyntaxKind.ImportSpecifier:
            return node.parent.name === node
                ? 7 | 8
                : undefined;
        case ts.SyntaxKind.ModuleDeclaration:
            return 1;
        case ts.SyntaxKind.Parameter:
            if (node.parent.parent.kind === ts.SyntaxKind.IndexSignature)
                return;
        case ts.SyntaxKind.BindingElement:
        case ts.SyntaxKind.VariableDeclaration:
            return node.parent.name === node ? 4 : undefined;
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
            return 4;
    }
}
exports.getDeclarationDomain = getDeclarationDomain;
function collectVariableUsage(sourceFile) {
    return new UsageWalker().getUsage(sourceFile);
}
exports.collectVariableUsage = collectVariableUsage;
var AbstractScope = (function () {
    function AbstractScope(_global) {
        this._global = _global;
        this._variables = new Map();
        this._uses = [];
        this._namespaceScopes = undefined;
        this._enumScopes = undefined;
    }
    AbstractScope.prototype.addVariable = function (identifier, name, blockScoped, exported, domain) {
        var variables = this._getDestinationScope(blockScoped).getVariables();
        var declaration = {
            domain: domain,
            exported: exported,
            declaration: name,
        };
        var variable = variables.get(identifier);
        if (variable === undefined) {
            variables.set(identifier, {
                domain: domain,
                declarations: [declaration],
                uses: [],
            });
        }
        else {
            variable.domain |= domain;
            variable.declarations.push(declaration);
        }
    };
    AbstractScope.prototype.addUse = function (use) {
        this._uses.push(use);
    };
    AbstractScope.prototype.getVariables = function () {
        return this._variables;
    };
    AbstractScope.prototype.getFunctionScope = function () {
        return this;
    };
    AbstractScope.prototype.end = function (cb) {
        var _this = this;
        if (this._namespaceScopes !== undefined)
            this._namespaceScopes.forEach(function (value) { return value.finish(cb); });
        this._namespaceScopes = this._enumScopes = undefined;
        this._applyUses();
        this._variables.forEach(function (variable) {
            for (var _i = 0, _a = variable.declarations; _i < _a.length; _i++) {
                var declaration = _a[_i];
                var result = {
                    declarations: [],
                    domain: declaration.domain,
                    exported: declaration.exported,
                    inGlobalScope: _this._global,
                    uses: [],
                };
                for (var _b = 0, _c = variable.declarations; _b < _c.length; _b++) {
                    var other = _c[_b];
                    if (other.domain & declaration.domain)
                        result.declarations.push(other.declaration);
                }
                for (var _d = 0, _e = variable.uses; _d < _e.length; _d++) {
                    var use = _e[_d];
                    if (use.domain & declaration.domain)
                        result.uses.push(use);
                }
                cb(result, declaration.declaration, _this);
            }
        });
    };
    AbstractScope.prototype.markExported = function (_name) { };
    AbstractScope.prototype.createOrReuseNamespaceScope = function (name, _exported, ambient, hasExportStatement) {
        var scope;
        if (this._namespaceScopes === undefined) {
            this._namespaceScopes = new Map();
        }
        else {
            scope = this._namespaceScopes.get(name);
        }
        if (scope === undefined) {
            scope = new NamespaceScope(ambient, hasExportStatement, this);
            this._namespaceScopes.set(name, scope);
        }
        else {
            scope.refresh(ambient, hasExportStatement);
        }
        return scope;
    };
    AbstractScope.prototype.createOrReuseEnumScope = function (name, _exported) {
        var scope;
        if (this._enumScopes === undefined) {
            this._enumScopes = new Map();
        }
        else {
            scope = this._enumScopes.get(name);
        }
        if (scope === undefined) {
            scope = new EnumScope(this);
            this._enumScopes.set(name, scope);
        }
        return scope;
    };
    AbstractScope.prototype._applyUses = function () {
        for (var _i = 0, _a = this._uses; _i < _a.length; _i++) {
            var use = _a[_i];
            if (!this._applyUse(use))
                this._addUseToParent(use);
        }
    };
    AbstractScope.prototype._applyUse = function (use, variables) {
        if (variables === void 0) { variables = this._variables; }
        var variable = variables.get(util_1.getIdentifierText(use.location));
        if (variable === undefined || (variable.domain & use.domain) === 0)
            return false;
        variable.uses.push(use);
        return true;
    };
    AbstractScope.prototype._getDestinationScope = function (_blockScoped) {
        return this;
    };
    AbstractScope.prototype._addUseToParent = function (_use) { };
    return AbstractScope;
}());
var RootScope = (function (_super) {
    tslib_1.__extends(RootScope, _super);
    function RootScope(_exportAll, global) {
        var _this = _super.call(this, global) || this;
        _this._exportAll = _exportAll;
        _this._exports = undefined;
        _this._innerScope = new NonRootScope(_this);
        return _this;
    }
    RootScope.prototype.addVariable = function (identifier, name, blockScoped, exported, domain) {
        if (domain & 8)
            return _super.prototype.addVariable.call(this, identifier, name, blockScoped, exported, domain);
        return this._innerScope.addVariable(identifier, name, blockScoped, exported, domain);
    };
    RootScope.prototype.addUse = function (use, origin) {
        if (origin === this._innerScope)
            return _super.prototype.addUse.call(this, use);
        return this._innerScope.addUse(use);
    };
    RootScope.prototype.markExported = function (id) {
        var text = util_1.getIdentifierText(id);
        if (this._exports === undefined) {
            this._exports = [text];
        }
        else {
            this._exports.push(text);
        }
    };
    RootScope.prototype.end = function (cb) {
        var _this = this;
        this._innerScope.end(function (value, key) {
            value.exported = value.exported || _this._exportAll
                || _this._exports !== undefined && _this._exports.indexOf(util_1.getIdentifierText(key)) !== -1;
            value.inGlobalScope = _this._global;
            return cb(value, key, _this);
        });
        return _super.prototype.end.call(this, function (value, key, scope) {
            value.exported = value.exported || scope === _this
                && _this._exports !== undefined && _this._exports.indexOf(util_1.getIdentifierText(key)) !== -1;
            return cb(value, key, scope);
        });
    };
    return RootScope;
}(AbstractScope));
var NonRootScope = (function (_super) {
    tslib_1.__extends(NonRootScope, _super);
    function NonRootScope(_parent) {
        var _this = _super.call(this, false) || this;
        _this._parent = _parent;
        return _this;
    }
    NonRootScope.prototype._addUseToParent = function (use) {
        return this._parent.addUse(use, this);
    };
    return NonRootScope;
}(AbstractScope));
var EnumScope = (function (_super) {
    tslib_1.__extends(EnumScope, _super);
    function EnumScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnumScope.prototype.end = function () {
        this._applyUses();
        this._uses = [];
    };
    return EnumScope;
}(NonRootScope));
var FunctionScopeState;
(function (FunctionScopeState) {
    FunctionScopeState[FunctionScopeState["Initial"] = 0] = "Initial";
    FunctionScopeState[FunctionScopeState["Parameter"] = 1] = "Parameter";
    FunctionScopeState[FunctionScopeState["ReturnType"] = 2] = "ReturnType";
    FunctionScopeState[FunctionScopeState["Body"] = 3] = "Body";
})(FunctionScopeState || (FunctionScopeState = {}));
var FunctionScope = (function (_super) {
    tslib_1.__extends(FunctionScope, _super);
    function FunctionScope() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._innerScope = new NonRootScope(_this);
        _this._state = 0;
        return _this;
    }
    FunctionScope.prototype.end = function (cb) {
        this._innerScope.end(cb);
        _super.prototype.end.call(this, cb);
    };
    FunctionScope.prototype.updateState = function (newState) {
        this._state = newState;
    };
    FunctionScope.prototype.addUse = function (use, source) {
        if (source === this._innerScope)
            return void this._uses.push(use);
        switch (this._state) {
            case 1:
                if ((use.domain & 4) === 0 || use.domain & 8)
                    return void this._uses.push(use);
                if (this._applyUse(use) || this._applyUse(use, this._innerScope.getVariables()))
                    return;
                break;
            case 2:
                if (this._applyUse(use))
                    return;
                break;
            case 3:
                return this._innerScope.addUse(use);
            case 0:
                return void this._uses.push(use);
        }
        return this._parent.addUse(use, this);
    };
    FunctionScope.prototype._getDestinationScope = function (blockScoped) {
        return blockScoped ? this._innerScope : this;
    };
    return FunctionScope;
}(NonRootScope));
var AbstractNamedExpressionScope = (function (_super) {
    tslib_1.__extends(AbstractNamedExpressionScope, _super);
    function AbstractNamedExpressionScope(_name, _domain, parent) {
        var _this = _super.call(this, parent) || this;
        _this._name = _name;
        _this._domain = _domain;
        return _this;
    }
    AbstractNamedExpressionScope.prototype.end = function (cb) {
        this._innerScope.end(cb);
        return cb({
            declarations: [this._name],
            domain: this._domain,
            exported: false,
            uses: this._uses,
            inGlobalScope: false,
        }, this._name, this);
    };
    AbstractNamedExpressionScope.prototype.addUse = function (use, source) {
        if (source !== this._innerScope)
            return this._innerScope.addUse(use);
        if (use.domain & this._domain && util_1.getIdentifierText(use.location) === util_1.getIdentifierText(this._name)) {
            this._uses.push(use);
        }
        else {
            return this._parent.addUse(use, this);
        }
    };
    AbstractNamedExpressionScope.prototype.getFunctionScope = function () {
        return this._innerScope;
    };
    AbstractNamedExpressionScope.prototype._getDestinationScope = function () {
        return this._innerScope;
    };
    return AbstractNamedExpressionScope;
}(NonRootScope));
var FunctionExpressionScope = (function (_super) {
    tslib_1.__extends(FunctionExpressionScope, _super);
    function FunctionExpressionScope(name, parent) {
        var _this = _super.call(this, name, 4, parent) || this;
        _this._innerScope = new FunctionScope(_this);
        return _this;
    }
    FunctionExpressionScope.prototype.updateState = function (newState) {
        return this._innerScope.updateState(newState);
    };
    return FunctionExpressionScope;
}(AbstractNamedExpressionScope));
var ClassExpressionScope = (function (_super) {
    tslib_1.__extends(ClassExpressionScope, _super);
    function ClassExpressionScope(name, parent) {
        var _this = _super.call(this, name, 4 | 2, parent) || this;
        _this._innerScope = new NonRootScope(_this);
        return _this;
    }
    return ClassExpressionScope;
}(AbstractNamedExpressionScope));
var BlockScope = (function (_super) {
    tslib_1.__extends(BlockScope, _super);
    function BlockScope(_functionScope, parent) {
        var _this = _super.call(this, parent) || this;
        _this._functionScope = _functionScope;
        return _this;
    }
    BlockScope.prototype.getFunctionScope = function () {
        return this._functionScope;
    };
    BlockScope.prototype._getDestinationScope = function (blockScoped) {
        return blockScoped ? this : this._functionScope;
    };
    return BlockScope;
}(NonRootScope));
function mapDeclaration(declaration) {
    return {
        declaration: declaration,
        exported: true,
        domain: getDeclarationDomain(declaration),
    };
}
var NamespaceScope = (function (_super) {
    tslib_1.__extends(NamespaceScope, _super);
    function NamespaceScope(_ambient, _hasExport, parent) {
        var _this = _super.call(this, parent) || this;
        _this._ambient = _ambient;
        _this._hasExport = _hasExport;
        _this._innerScope = new NonRootScope(_this);
        _this._exports = undefined;
        return _this;
    }
    NamespaceScope.prototype.finish = function (cb) {
        return _super.prototype.end.call(this, cb);
    };
    NamespaceScope.prototype.end = function (cb) {
        var _this = this;
        this._innerScope.end(function (variable, key, scope) {
            if (scope !== _this._innerScope ||
                !variable.exported && (!_this._ambient || _this._exports !== undefined && !_this._exports.has(util_1.getIdentifierText(key))))
                return cb(variable, key, scope);
            var namespaceVar = _this._variables.get(util_1.getIdentifierText(key));
            if (namespaceVar === undefined) {
                _this._variables.set(util_1.getIdentifierText(key), {
                    declarations: variable.declarations.map(mapDeclaration),
                    domain: variable.domain,
                    uses: variable.uses.slice(),
                });
            }
            else {
                outer: for (var _i = 0, _a = variable.declarations; _i < _a.length; _i++) {
                    var declaration = _a[_i];
                    for (var _b = 0, _c = namespaceVar.declarations; _b < _c.length; _b++) {
                        var existing = _c[_b];
                        if (existing.declaration === declaration)
                            continue outer;
                    }
                    namespaceVar.declarations.push(mapDeclaration(declaration));
                }
                namespaceVar.domain |= variable.domain;
                for (var _d = 0, _e = variable.uses; _d < _e.length; _d++) {
                    var use = _e[_d];
                    if (namespaceVar.uses.indexOf(use) !== -1)
                        continue;
                    namespaceVar.uses.push(use);
                }
            }
        });
        this._applyUses();
        this._innerScope = new NonRootScope(this);
        this._uses = [];
    };
    NamespaceScope.prototype.createOrReuseNamespaceScope = function (name, exported, ambient, hasExportStatement) {
        if (!exported && (!this._ambient || this._hasExport))
            return this._innerScope.createOrReuseNamespaceScope(name, exported, ambient || this._ambient, hasExportStatement);
        return _super.prototype.createOrReuseNamespaceScope.call(this, name, exported, ambient || this._ambient, hasExportStatement);
    };
    NamespaceScope.prototype.createOrReuseEnumScope = function (name, exported) {
        if (!exported && (!this._ambient || this._hasExport))
            return this._innerScope.createOrReuseEnumScope(name, exported);
        return _super.prototype.createOrReuseEnumScope.call(this, name, exported);
    };
    NamespaceScope.prototype.addUse = function (use, source) {
        if (source !== this._innerScope)
            return this._innerScope.addUse(use);
        this._uses.push(use);
    };
    NamespaceScope.prototype.refresh = function (ambient, hasExport) {
        this._ambient = ambient;
        this._hasExport = hasExport;
    };
    NamespaceScope.prototype.markExported = function (name, _as) {
        if (this._exports === undefined)
            this._exports = new Set();
        this._exports.add(util_1.getIdentifierText(name));
    };
    NamespaceScope.prototype._getDestinationScope = function () {
        return this._innerScope;
    };
    return NamespaceScope;
}(NonRootScope));
function getEntityNameParent(name) {
    var parent = name.parent;
    while (parent.kind === ts.SyntaxKind.QualifiedName)
        parent = parent.parent;
    return parent;
}
var UsageWalker = (function () {
    function UsageWalker() {
        this._result = new Map();
    }
    UsageWalker.prototype.getUsage = function (sourceFile) {
        var _this = this;
        var variableCallback = function (variable, key) {
            _this._result.set(key, variable);
        };
        var isModule = ts.isExternalModule(sourceFile);
        this._scope = new RootScope(sourceFile.isDeclarationFile && isModule && !containsExportStatement(sourceFile), !isModule);
        var cb = function (node) {
            if (util_1.isBlockScopeBoundary(node))
                return continueWithScope(node, new BlockScope(_this._scope.getFunctionScope(), _this._scope), handleBlockScope);
            switch (node.kind) {
                case ts.SyntaxKind.ClassExpression:
                    return continueWithScope(node, node.name !== undefined
                        ? new ClassExpressionScope(node.name, _this._scope)
                        : new NonRootScope(_this._scope));
                case ts.SyntaxKind.ClassDeclaration:
                    _this._handleDeclaration(node, true, 4 | 2);
                    return continueWithScope(node, new NonRootScope(_this._scope));
                case ts.SyntaxKind.InterfaceDeclaration:
                case ts.SyntaxKind.TypeAliasDeclaration:
                    _this._handleDeclaration(node, true, 2);
                    return continueWithScope(node, new NonRootScope(_this._scope));
                case ts.SyntaxKind.EnumDeclaration:
                    _this._handleDeclaration(node, true, 7);
                    return continueWithScope(node, _this._scope.createOrReuseEnumScope(util_1.getIdentifierText(node.name), util_1.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)));
                case ts.SyntaxKind.ModuleDeclaration:
                    return _this._handleModule(node, continueWithScope);
                case ts.SyntaxKind.MappedType:
                    return continueWithScope(node, new NonRootScope(_this._scope));
                case ts.SyntaxKind.FunctionExpression:
                case ts.SyntaxKind.ArrowFunction:
                case ts.SyntaxKind.Constructor:
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.GetAccessor:
                case ts.SyntaxKind.SetAccessor:
                case ts.SyntaxKind.MethodSignature:
                case ts.SyntaxKind.CallSignature:
                case ts.SyntaxKind.ConstructSignature:
                case ts.SyntaxKind.ConstructorType:
                case ts.SyntaxKind.FunctionType:
                    return _this._handleFunctionLikeDeclaration(node, cb, variableCallback);
                case ts.SyntaxKind.VariableDeclarationList:
                    _this._handleVariableDeclaration(node);
                    break;
                case ts.SyntaxKind.Parameter:
                    if (node.parent.kind !== ts.SyntaxKind.IndexSignature &&
                        (node.name.kind !== ts.SyntaxKind.Identifier ||
                            node.name.originalKeywordKind !== ts.SyntaxKind.ThisKeyword))
                        _this._handleBindingName(node.name, false, false, true);
                    break;
                case ts.SyntaxKind.EnumMember:
                    _this._scope.addVariable(util_1.getPropertyName(node.name), node.name, false, true, 4);
                    break;
                case ts.SyntaxKind.ImportClause:
                case ts.SyntaxKind.ImportSpecifier:
                case ts.SyntaxKind.NamespaceImport:
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    _this._handleDeclaration(node, false, 7 | 8);
                    break;
                case ts.SyntaxKind.TypeParameter:
                    _this._scope.addVariable(util_1.getIdentifierText(node.name), node.name, false, false, 2);
                    break;
                case ts.SyntaxKind.ExportSpecifier:
                    if (node.propertyName !== undefined)
                        return _this._scope.markExported(node.propertyName, node.name);
                    return _this._scope.markExported(node.name);
                case ts.SyntaxKind.ExportAssignment:
                    if (node.expression.kind === ts.SyntaxKind.Identifier)
                        return _this._scope.markExported(node.expression);
                    break;
                case ts.SyntaxKind.Identifier:
                    var domain = getUsageDomain(node);
                    if (domain !== undefined)
                        _this._scope.addUse({ domain: domain, location: node });
                    return;
            }
            return ts.forEachChild(node, cb);
        };
        var continueWithScope = function (node, scope, next) {
            if (next === void 0) { next = forEachChild; }
            var savedScope = _this._scope;
            _this._scope = scope;
            next(node);
            _this._scope.end(variableCallback);
            _this._scope = savedScope;
        };
        var handleBlockScope = function (node) {
            if (node.kind === ts.SyntaxKind.CatchClause && node.variableDeclaration !== undefined)
                _this._handleBindingName(node.variableDeclaration.name, true, false);
            return ts.forEachChild(node, cb);
        };
        ts.forEachChild(sourceFile, cb);
        this._scope.end(variableCallback);
        return this._result;
        function forEachChild(node) {
            return ts.forEachChild(node, cb);
        }
    };
    UsageWalker.prototype._handleFunctionLikeDeclaration = function (node, cb, varCb) {
        if (node.decorators !== undefined)
            node.decorators.forEach(cb);
        var savedScope = this._scope;
        if (node.kind === ts.SyntaxKind.FunctionDeclaration)
            this._handleDeclaration(node, false, 4);
        var scope = this._scope = node.kind === ts.SyntaxKind.FunctionExpression && node.name !== undefined
            ? new FunctionExpressionScope(node.name, savedScope)
            : new FunctionScope(savedScope);
        if (node.name !== undefined)
            cb(node.name);
        if (node.typeParameters !== undefined)
            node.typeParameters.forEach(cb);
        scope.updateState(1);
        node.parameters.forEach(cb);
        if (node.type !== undefined) {
            scope.updateState(2);
            cb(node.type);
        }
        if (node.body !== undefined) {
            scope.updateState(3);
            cb(node.body);
        }
        scope.end(varCb);
        this._scope = savedScope;
    };
    UsageWalker.prototype._handleModule = function (node, next) {
        if (node.flags & ts.NodeFlags.GlobalAugmentation)
            return next(node, this._scope.createOrReuseNamespaceScope('-global', false, true, false));
        if (node.name.kind === ts.SyntaxKind.Identifier) {
            var exported = isNamespaceExported(node);
            this._scope.addVariable(util_1.getIdentifierText(node.name), node.name, false, exported, 1 | 4);
            var ambient = util_1.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword);
            return next(node, this._scope.createOrReuseNamespaceScope(util_1.getIdentifierText(node.name), exported, ambient, ambient && namespaceHasExportStatement(node)));
        }
        return next(node, this._scope.createOrReuseNamespaceScope("\"" + node.name.text + "\"", false, true, namespaceHasExportStatement(node)));
    };
    UsageWalker.prototype._handleDeclaration = function (node, blockScoped, domain) {
        if (node.name !== undefined)
            this._scope.addVariable(util_1.getIdentifierText(node.name), node.name, blockScoped, util_1.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword), domain);
    };
    UsageWalker.prototype._handleBindingName = function (name, blockScoped, exported, isParameter) {
        var _this = this;
        if (name.kind === ts.SyntaxKind.Identifier)
            return this._scope.addVariable(util_1.getIdentifierText(name), name, blockScoped, exported, 4);
        util_1.forEachDestructuringIdentifier(name, function (declaration) {
            _this._scope.addVariable(util_1.getIdentifierText(declaration.name), declaration.name, isParameter || blockScoped, exported, 4);
        });
    };
    UsageWalker.prototype._handleVariableDeclaration = function (declarationList) {
        var blockScoped = util_1.isBlockScopedVariableDeclarationList(declarationList);
        var exported = declarationList.parent.kind === ts.SyntaxKind.VariableStatement &&
            util_1.hasModifier(declarationList.parent.modifiers, ts.SyntaxKind.ExportKeyword);
        for (var _i = 0, _a = declarationList.declarations; _i < _a.length; _i++) {
            var declaration = _a[_i];
            this._handleBindingName(declaration.name, blockScoped, exported);
        }
    };
    return UsageWalker;
}());
function isNamespaceExported(node) {
    return node.parent.kind === ts.SyntaxKind.ModuleDeclaration || util_1.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword);
}
function namespaceHasExportStatement(ns) {
    if (ns.body === undefined || ns.body.kind !== ts.SyntaxKind.ModuleBlock)
        return false;
    return containsExportStatement(ns.body);
}
function containsExportStatement(block) {
    for (var _i = 0, _a = block.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (statement.kind === ts.SyntaxKind.ExportDeclaration || statement.kind === ts.SyntaxKind.ExportAssignment)
            return true;
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFPZ0I7QUFDaEIsK0JBQWlDO0FBMkJqQyxJQUFrQixpQkFNakI7QUFORCxXQUFrQixpQkFBaUI7SUFDL0IsbUVBQWEsQ0FBQTtJQUNiLHlEQUFRLENBQUE7SUFDUiwyREFBUyxDQUFBO0lBQ1QsNkRBQVUsQ0FBQTtJQUNWLHVEQUE4QixDQUFBO0FBQ2xDLENBQUMsRUFOaUIsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFNbEM7QUFFRCxJQUFrQixXQU9qQjtBQVBELFdBQWtCLFdBQVc7SUFDekIsdURBQWEsQ0FBQTtJQUNiLDZDQUFRLENBQUE7SUFDUiwrQ0FBUyxDQUFBO0lBQ1QscUVBQW9DLENBQUE7SUFDcEMsMkNBQThCLENBQUE7SUFDOUIsdURBQWEsQ0FBQTtBQUNqQixDQUFDLEVBUGlCLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBTzVCO0FBRUQsd0JBQStCLElBQW1CO0lBQzlDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFPLENBQUM7SUFDNUIsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWE7WUFDNUIsTUFBTSxHQUFrQjtRQUM1QixLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsMkJBQTJCO1lBQzFDLE1BQU0sQ0FBcUIsTUFBTSxDQUFDLE1BQU8sQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUI7Z0JBQy9FLE1BQU0sQ0FBQyxNQUFPLENBQUMsTUFBTyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLG9CQUFvQjtnQkFDbEUsQ0FBQztnQkFDRCxDQUFDLEVBQWtCLENBQUM7UUFDNUIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVM7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