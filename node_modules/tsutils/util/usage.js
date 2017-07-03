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
        case ts.SyntaxKind.EnumMember:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.Parameter:
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
            return 7;
        case ts.SyntaxKind.ImportEqualsDeclaration:
        case ts.SyntaxKind.ImportSpecifier:
            return node.parent.name === node ? 7 : undefined;
        case ts.SyntaxKind.ModuleDeclaration:
            return 1;
        case ts.SyntaxKind.Parameter:
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
    function RootScope() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._exports = undefined;
        return _this;
    }
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
        return _super.prototype.end.call(this, function (value, key, scope) {
            if (_this._exports !== undefined && _this._exports.indexOf(key.text) !== -1)
                value.exported = true;
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
        this._scope = new RootScope(!ts.isExternalModule(sourceFile));
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
                    if (node.name.kind !== ts.SyntaxKind.Identifier ||
                        node.name.originalKeywordKind !== ts.SyntaxKind.ThisKeyword)
                        _this._handleBindingName(node.name, false, false, true);
                    break;
                case ts.SyntaxKind.EnumMember:
                    _this._scope.addVariable(util_1.getPropertyName(node.name), node.name, false, true, 4);
                    break;
                case ts.SyntaxKind.ImportClause:
                case ts.SyntaxKind.ImportSpecifier:
                case ts.SyntaxKind.NamespaceImport:
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    _this._handleDeclaration(node, false, 7);
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
    for (var _i = 0, _a = ns.body.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (statement.kind === ts.SyntaxKind.ExportDeclaration || statement.kind === ts.SyntaxKind.ExportAssignment)
            return true;
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFNZ0I7QUFDaEIsK0JBQWlDO0FBMkJqQyxJQUFrQixpQkFLakI7QUFMRCxXQUFrQixpQkFBaUI7SUFDL0IsbUVBQWEsQ0FBQTtJQUNiLHlEQUFRLENBQUE7SUFDUiwyREFBUyxDQUFBO0lBQ1QsdURBQThCLENBQUE7QUFDbEMsQ0FBQyxFQUxpQixpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQUtsQztBQUVELElBQWtCLFdBT2pCO0FBUEQsV0FBa0IsV0FBVztJQUN6Qix1REFBYSxDQUFBO0lBQ2IsNkNBQVEsQ0FBQTtJQUNSLCtDQUFTLENBQUE7SUFDVCxxRUFBb0MsQ0FBQTtJQUNwQywyQ0FBOEIsQ0FBQTtJQUM5Qix1REFBYSxDQUFBO0FBQ2pCLENBQUMsRUFQaUIsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFPNUI7QUFFRCx3QkFBK0IsSUFBbUI7SUFDOUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU8sQ0FBQztJQUM1QixNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsQixLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQ2pDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZO1lBQzNCLE1BQU0sR0FBa0I7UUFDNUIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLDJCQUEyQjtZQUMxQyxNQUFNLENBQXFCLE1BQU0sQ0FBQyxNQUFPLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCO2dCQUMvRSxNQUFNLENBQUMsTUFBTyxDQUFDLE1BQU8sQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0I7O21CQUUvQyxDQUFDO1FBQzVCLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxT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