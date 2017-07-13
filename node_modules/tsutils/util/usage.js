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
        case ts.SyntaxKind.TypeOperator:
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
        case ts.SyntaxKind.NamespaceExportDeclaration:
            return 1;
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
        case ts.SyntaxKind.QualifiedName:
        case ts.SyntaxKind.TypeReference:
        case ts.SyntaxKind.TypeOperator:
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
        var variable = variables.get(use.location.text);
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
    RootScope.prototype.markExported = function (_a) {
        var text = _a.text;
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
            value.exported = value.exported || _this._exportAll || _this._exports !== undefined && _this._exports.indexOf(key.text) !== -1;
            value.inGlobalScope = _this._global;
            return cb(value, key, _this);
        });
        return _super.prototype.end.call(this, function (value, key, scope) {
            value.exported = value.exported || scope === _this && _this._exports !== undefined && _this._exports.indexOf(key.text) !== -1;
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
        if (use.domain & this._domain && use.location.text === this._name.text) {
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
                !variable.exported && (!_this._ambient || _this._exports !== undefined && !_this._exports.has(key.text)))
                return cb(variable, key, scope);
            var namespaceVar = _this._variables.get(key.text);
            if (namespaceVar === undefined) {
                _this._variables.set(key.text, {
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
        this._exports.add(name.text);
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
            if (util_1.isBlockScopeBoundary(node)) {
                if (node.kind === ts.SyntaxKind.CatchClause)
                    _this._handleBindingName(node.variableDeclaration.name, true, false);
                return continueWithScope(node, new BlockScope(_this._scope.getFunctionScope(), _this._scope));
            }
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
                    return continueWithScope(node, _this._scope.createOrReuseEnumScope(node.name.text, util_1.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)));
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
                    _this._scope.addVariable(node.name.text, node.name, false, false, 2);
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
        var continueWithScope = function (node, scope) {
            var savedScope = _this._scope;
            _this._scope = scope;
            ts.forEachChild(node, cb);
            _this._scope.end(variableCallback);
            _this._scope = savedScope;
        };
        ts.forEachChild(sourceFile, cb);
        this._scope.end(variableCallback);
        return this._result;
    };
    UsageWalker.prototype._handleFunctionLikeDeclaration = function (node, cb, varCb) {
        var savedScope = this._scope;
        if (node.kind === ts.SyntaxKind.FunctionDeclaration)
            this._handleDeclaration(node, false, 4);
        var scope = this._scope = node.kind === ts.SyntaxKind.FunctionExpression && node.name !== undefined
            ? new FunctionExpressionScope(node.name, savedScope)
            : new FunctionScope(savedScope);
        if (node.decorators !== undefined)
            for (var _i = 0, _a = node.decorators; _i < _a.length; _i++) {
                var decorator = _a[_i];
                cb(decorator);
            }
        if (node.name !== undefined)
            cb(node.name);
        if (node.typeParameters !== undefined)
            for (var _b = 0, _c = node.typeParameters; _b < _c.length; _b++) {
                var param = _c[_b];
                cb(param);
            }
        scope.updateState(1);
        for (var _d = 0, _e = node.parameters; _d < _e.length; _d++) {
            var param = _e[_d];
            cb(param);
        }
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
        if (node.name.kind === ts.SyntaxKind.Identifier) {
            var exported = isNamespaceExported(node);
            this._scope.addVariable(node.name.text, node.name, false, exported, 1 | 4);
            var ambient = util_1.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword);
            return next(node, this._scope.createOrReuseNamespaceScope(node.name.text, exported, ambient, ambient && namespaceHasExportStatement(node)));
        }
        return next(node, this._scope.createOrReuseNamespaceScope("\"" + node.name.text + "\"", false, true, namespaceHasExportStatement(node)));
    };
    UsageWalker.prototype._handleDeclaration = function (node, blockScoped, domain) {
        if (node.name !== undefined)
            this._scope.addVariable(node.name.text, node.name, blockScoped, util_1.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword), domain);
    };
    UsageWalker.prototype._handleBindingName = function (name, blockScoped, exported, isParameter) {
        var _this = this;
        if (name.kind === ts.SyntaxKind.Identifier)
            return this._scope.addVariable(name.text, name, blockScoped, exported, 4);
        util_1.forEachDestructuringIdentifier(name, function (declaration) {
            _this._scope.addVariable(declaration.name.text, declaration.name, isParameter || blockScoped, exported, 4);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFNZ0I7QUFDaEIsK0JBQWlDO0FBMkJqQyxJQUFrQixpQkFNakI7QUFORCxXQUFrQixpQkFBaUI7SUFDL0IsbUVBQWEsQ0FBQTtJQUNiLHlEQUFRLENBQUE7SUFDUiwyREFBUyxDQUFBO0lBQ1QsNkRBQVUsQ0FBQTtJQUNWLHVEQUE4QixDQUFBO0FBQ2xDLENBQUMsRUFOaUIsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFNbEM7QUFFRCxJQUFrQixXQU9qQjtBQVBELFdBQWtCLFdBQVc7SUFDekIsdURBQWEsQ0FBQTtJQUNiLDZDQUFRLENBQUE7SUFDUiwrQ0FBUyxDQUFBO0lBQ1QscUVBQW9DLENBQUE7SUFDcEMsMkNBQThCLENBQUE7SUFDOUIsdURBQWEsQ0FBQTtBQUNqQixDQUFDLEVBUGlCLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBTzVCO0FBRUQsd0JBQStCLElBQW1CO0lBQzlDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFPLENBQUM7SUFDNUIsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUNqQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWTtZQUMzQixNQUFNLEdBQWtCO1FBQzVCLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQywyQkFBMkI7WUFDMUMsTUFBTSxDQUFxQixNQUFNLENBQUMsTUFBTyxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQjtnQkFDL0UsTUFBTSxDQUFDLE1BQU8sQ0FBQyxNQUFPLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsb0JBQW9COzttQkFFL0MsQ0FBQztRQUM1QixLQUFLLEVBQUUs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