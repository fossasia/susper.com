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
var ConditionalTypeScopeState;
(function (ConditionalTypeScopeState) {
    ConditionalTypeScopeState[ConditionalTypeScopeState["Initial"] = 0] = "Initial";
    ConditionalTypeScopeState[ConditionalTypeScopeState["Extends"] = 1] = "Extends";
    ConditionalTypeScopeState[ConditionalTypeScopeState["TrueType"] = 2] = "TrueType";
    ConditionalTypeScopeState[ConditionalTypeScopeState["FalseType"] = 3] = "FalseType";
})(ConditionalTypeScopeState || (ConditionalTypeScopeState = {}));
var ConditionalTypeScope = (function (_super) {
    tslib_1.__extends(ConditionalTypeScope, _super);
    function ConditionalTypeScope() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._state = 0;
        return _this;
    }
    ConditionalTypeScope.prototype.updateState = function (newState) {
        this._state = newState;
    };
    ConditionalTypeScope.prototype.addUse = function (use) {
        if (this._state === 2)
            return void this._uses.push(use);
        return this._parent.addUse(use, this);
    };
    return ConditionalTypeScope;
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
                case ts.SyntaxKind.ConditionalType:
                    return _this._handleConditionalType(node, cb, variableCallback);
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
    UsageWalker.prototype._handleConditionalType = function (node, cb, varCb) {
        var savedScope = this._scope;
        var scope = this._scope = new ConditionalTypeScope(savedScope);
        cb(node.checkType);
        scope.updateState(1);
        cb(node.extendsType);
        scope.updateState(2);
        cb(node.trueType);
        scope.updateState(3);
        cb(node.falseType);
        scope.end(varCb);
        this._scope = savedScope;
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