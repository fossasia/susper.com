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
            if (util_1.isBlockScopeBoundary(node)) {
                if (node.kind === ts.SyntaxKind.CatchClause && node.variableDeclaration !== undefined)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFPZ0I7QUFDaEIsK0JBQWlDO0FBMkJqQyxJQUFrQixpQkFNakI7QUFORCxXQUFrQixpQkFBaUI7SUFDL0IsbUVBQWEsQ0FBQTtJQUNiLHlEQUFRLENBQUE7SUFDUiwyREFBUyxDQUFBO0lBQ1QsNkRBQVUsQ0FBQTtJQUNWLHVEQUE4QixDQUFBO0FBQ2xDLENBQUMsRUFOaUIsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFNbEM7QUFFRCxJQUFrQixXQU9qQjtBQVBELFdBQWtCLFdBQVc7SUFDekIsdURBQWEsQ0FBQTtJQUNiLDZDQUFRLENBQUE7SUFDUiwrQ0FBUyxDQUFBO0lBQ1QscUVBQW9DLENBQUE7SUFDcEMsMkNBQThCLENBQUE7SUFDOUIsdURBQWEsQ0FBQTtBQUNqQixDQUFDLEVBUGlCLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBTzVCO0FBRUQsd0JBQStCLElBQW1CO0lBQzlDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFPLENBQUM7SUFDNUIsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUNqQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWTtZQUMzQixNQUFNLEdBQWtCO1FBQzVCLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQywyQkFBMkI7WUFDMUMsTUFBTSxDQUFxQixNQUFNLENBQUMsTUFBTyxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQjtnQkFDL0UsTUFBTSxDQUFDLE1BQU8sQ0FBQyxNQUFPLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsb0JBQW9COzttQkFFL0MsQ0FBQztRQUM1QixLQUFLLEVBQUUs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