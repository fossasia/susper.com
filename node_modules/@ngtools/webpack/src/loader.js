"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ts = require("typescript");
const plugin_1 = require("./plugin");
const refactor_1 = require("./refactor");
const loaderUtils = require('loader-utils');
const NormalModule = require('webpack/lib/NormalModule');
// This is a map of changes which need to be made
const changeMap = {
    platformBrowserDynamic: {
        name: 'platformBrowser',
        importLocation: '@angular/platform-browser'
    },
    platformDynamicServer: {
        name: 'platformServer',
        importLocation: '@angular/platform-server'
    }
};
function _getContentOfKeyLiteral(_source, node) {
    if (!node) {
        return null;
    }
    else if (node.kind == ts.SyntaxKind.Identifier) {
        return node.text;
    }
    else if (node.kind == ts.SyntaxKind.StringLiteral) {
        return node.text;
    }
    else {
        return null;
    }
}
function _angularImportsFromNode(node, _sourceFile) {
    const ms = node.moduleSpecifier;
    let modulePath = null;
    switch (ms.kind) {
        case ts.SyntaxKind.StringLiteral:
            modulePath = ms.text;
            break;
        default:
            return [];
    }
    if (!modulePath.startsWith('@angular/')) {
        return [];
    }
    if (node.importClause) {
        if (node.importClause.name) {
            // This is of the form `import Name from 'path'`. Ignore.
            return [];
        }
        else if (node.importClause.namedBindings) {
            const nb = node.importClause.namedBindings;
            if (nb.kind == ts.SyntaxKind.NamespaceImport) {
                // This is of the form `import * as name from 'path'`. Return `name.`.
                return [nb.name.text + '.'];
            }
            else {
                // This is of the form `import {a,b,c} from 'path'`
                const namedImports = nb;
                return namedImports.elements
                    .map((is) => is.propertyName ? is.propertyName.text : is.name.text);
            }
        }
    }
    else {
        // This is of the form `import 'path';`. Nothing to do.
        return [];
    }
}
function _ctorParameterFromTypeReference(paramNode, angularImports, refactor) {
    let typeName = 'undefined';
    if (paramNode.type) {
        switch (paramNode.type.kind) {
            case ts.SyntaxKind.TypeReference:
                const type = paramNode.type;
                if (type.typeName) {
                    typeName = type.typeName.getText(refactor.sourceFile);
                }
                else {
                    typeName = type.getText(refactor.sourceFile);
                }
                break;
            case ts.SyntaxKind.AnyKeyword:
                typeName = 'undefined';
                break;
            default:
                typeName = 'null';
        }
    }
    const decorators = refactor.findAstNodes(paramNode, ts.SyntaxKind.Decorator);
    const decoratorStr = decorators
        .map(decorator => {
        const call = refactor.findFirstAstNode(decorator, ts.SyntaxKind.CallExpression);
        if (!call) {
            return null;
        }
        const fnName = call.expression.getText(refactor.sourceFile);
        const args = call.arguments.map(x => x.getText(refactor.sourceFile)).join(', ');
        if (angularImports.indexOf(fnName) === -1) {
            return null;
        }
        else {
            return [fnName, args];
        }
    })
        .filter(x => !!x)
        .map(([name, args]) => {
        if (args) {
            return `{ type: ${name}, args: [${args}] }`;
        }
        return `{ type: ${name} }`;
    })
        .join(', ');
    if (decorators.length > 0) {
        return `{ type: ${typeName}, decorators: [${decoratorStr}] }`;
    }
    return `{ type: ${typeName} }`;
}
function _addCtorParameters(classNode, angularImports, refactor) {
    // For every classes with constructors, output the ctorParameters function which contains a list
    // of injectable types.
    const ctor = refactor.findFirstAstNode(classNode, ts.SyntaxKind.Constructor);
    if (!ctor) {
        // A class can be missing a constructor, and that's _okay_.
        return;
    }
    const params = Array.from(ctor.parameters).map(paramNode => {
        return _ctorParameterFromTypeReference(paramNode, angularImports, refactor);
    });
    const ctorParametersDecl = `static ctorParameters() { return [ ${params.join(', ')} ]; }`;
    refactor.prependBefore(classNode.getLastToken(refactor.sourceFile), ctorParametersDecl);
}
function _removeDecorators(refactor) {
    const angularImports = refactor.findAstNodes(refactor.sourceFile, ts.SyntaxKind.ImportDeclaration)
        .map((node) => _angularImportsFromNode(node, refactor.sourceFile))
        .reduce((acc, current) => acc.concat(current), []);
    // Find all decorators.
    refactor.findAstNodes(refactor.sourceFile, ts.SyntaxKind.Decorator)
        .forEach(node => {
        // First, add decorators to classes to the classes array.
        if (node.parent) {
            const declarations = refactor.findAstNodes(node.parent, ts.SyntaxKind.ClassDeclaration, false, 1);
            if (declarations.length > 0) {
                _addCtorParameters(declarations[0], angularImports, refactor);
            }
        }
        refactor.findAstNodes(node, ts.SyntaxKind.CallExpression)
            .filter((node) => {
            const fnName = node.expression.getText(refactor.sourceFile);
            if (fnName.indexOf('.') != -1) {
                // Since this is `a.b`, see if it's the same namespace as a namespace import.
                return angularImports.indexOf(fnName.replace(/\..*$/, '') + '.') != -1;
            }
            else {
                return angularImports.indexOf(fnName) != -1;
            }
        })
            .forEach(() => refactor.removeNode(node));
    });
}
function _replaceBootstrap(plugin, refactor) {
    // If bootstrapModule can't be found, bail out early.
    if (!refactor.sourceMatch(/\bbootstrapModule\b/)) {
        return;
    }
    // Calculate the base path.
    const basePath = path.normalize(plugin.basePath);
    const genDir = path.normalize(plugin.genDir);
    const dirName = path.normalize(path.dirname(refactor.fileName));
    const entryModule = plugin.entryModule;
    const entryModuleFileName = path.normalize(entryModule.path + '.ngfactory');
    const relativeEntryModulePath = path.relative(basePath, entryModuleFileName);
    const fullEntryModulePath = path.resolve(genDir, relativeEntryModulePath);
    const relativeNgFactoryPath = path.relative(dirName, fullEntryModulePath);
    const ngFactoryPath = './' + relativeNgFactoryPath.replace(/\\/g, '/');
    const allCalls = refactor.findAstNodes(refactor.sourceFile, ts.SyntaxKind.CallExpression, true);
    const bootstraps = allCalls
        .filter(call => call.expression.kind == ts.SyntaxKind.PropertyAccessExpression)
        .map(call => call.expression)
        .filter(access => {
        return access.name.kind == ts.SyntaxKind.Identifier
            && access.name.text == 'bootstrapModule';
    });
    const calls = bootstraps
        .reduce((previous, access) => {
        const expressions = refactor.findAstNodes(access, ts.SyntaxKind.CallExpression, true);
        return previous.concat(expressions);
    }, [])
        .filter((call) => call.expression.kind == ts.SyntaxKind.Identifier)
        .filter((call) => {
        // Find if the expression matches one of the replacement targets
        return !!changeMap[call.expression.text];
    });
    if (calls.length == 0) {
        // Didn't find any dynamic bootstrapping going on.
        return;
    }
    // Create the changes we need.
    allCalls
        .filter(call => bootstraps.some(bs => bs == call.expression))
        .forEach((call) => {
        refactor.replaceNode(call.arguments[0], entryModule.className + 'NgFactory');
    });
    calls.forEach(call => {
        const platform = changeMap[call.expression.text];
        // Replace with mapped replacement
        refactor.replaceNode(call.expression, platform.name);
        // Add the appropriate import
        refactor.insertImport(platform.name, platform.importLocation);
    });
    bootstraps
        .forEach((bs) => {
        // This changes the call.
        refactor.replaceNode(bs.name, 'bootstrapModuleFactory');
    });
    refactor.insertImport(entryModule.className + 'NgFactory', ngFactoryPath);
}
function removeModuleIdOnlyForTesting(refactor) {
    _removeModuleId(refactor);
}
exports.removeModuleIdOnlyForTesting = removeModuleIdOnlyForTesting;
function _removeModuleId(refactor) {
    const sourceFile = refactor.sourceFile;
    refactor.findAstNodes(sourceFile, ts.SyntaxKind.Decorator, true)
        .reduce((acc, node) => {
        return acc.concat(refactor.findAstNodes(node, ts.SyntaxKind.ObjectLiteralExpression, true));
    }, [])
        .filter((node) => {
        return node.properties.some(prop => {
            return prop.kind == ts.SyntaxKind.PropertyAssignment
                && _getContentOfKeyLiteral(sourceFile, prop.name) == 'moduleId';
        });
    })
        .forEach((node) => {
        const moduleIdProp = node.properties.filter((prop, _idx) => {
            return prop.kind == ts.SyntaxKind.PropertyAssignment
                && _getContentOfKeyLiteral(sourceFile, prop.name) == 'moduleId';
        })[0];
        // Get the trailing comma.
        const moduleIdCommaProp = moduleIdProp.parent
            ? moduleIdProp.parent.getChildAt(1).getChildren()[1] : null;
        refactor.removeNodes(moduleIdProp, moduleIdCommaProp);
    });
}
function _getResourceRequest(element, sourceFile) {
    if (element.kind == ts.SyntaxKind.StringLiteral) {
        const url = element.text;
        // If the URL does not start with ./ or ../, prepends ./ to it.
        return `'${/^\.?\.\//.test(url) ? '' : './'}${url}'`;
    }
    else {
        // if not string, just use expression directly
        return element.getFullText(sourceFile);
    }
}
function _replaceResources(refactor) {
    const sourceFile = refactor.sourceFile;
    _getResourceNodes(refactor)
        .forEach((node) => {
        const key = _getContentOfKeyLiteral(sourceFile, node.name);
        if (key == 'templateUrl') {
            refactor.replaceNode(node, `template: require(${_getResourceRequest(node.initializer, sourceFile)})`);
        }
        else if (key == 'styleUrls') {
            const arr = (refactor.findAstNodes(node, ts.SyntaxKind.ArrayLiteralExpression, false));
            if (!arr || arr.length == 0 || arr[0].elements.length == 0) {
                return;
            }
            const initializer = arr[0].elements.map((element) => {
                return _getResourceRequest(element, sourceFile);
            });
            refactor.replaceNode(node, `styles: [require(${initializer.join('), require(')})]`);
        }
    });
}
function _getResourceNodes(refactor) {
    const { sourceFile } = refactor;
    // Find all object literals.
    return refactor.findAstNodes(sourceFile, ts.SyntaxKind.ObjectLiteralExpression, true)
        .map(node => refactor.findAstNodes(node, ts.SyntaxKind.PropertyAssignment))
        .reduce((prev, curr) => curr ? prev.concat(curr) : prev, [])
        .filter((node) => {
        const key = _getContentOfKeyLiteral(sourceFile, node.name);
        if (!key) {
            // key is an expression, can't do anything.
            return false;
        }
        return key == 'templateUrl' || key == 'styleUrls';
    });
}
function _getResourcesUrls(refactor) {
    return _getResourceNodes(refactor)
        .reduce((acc, node) => {
        const key = _getContentOfKeyLiteral(refactor.sourceFile, node.name);
        if (key == 'templateUrl') {
            const url = node.initializer.text;
            if (url) {
                acc.push(url);
            }
        }
        else if (key == 'styleUrls') {
            const arr = (refactor.findAstNodes(node, ts.SyntaxKind.ArrayLiteralExpression, false));
            if (!arr || arr.length == 0 || arr[0].elements.length == 0) {
                return;
            }
            arr[0].elements.forEach((element) => {
                if (element.kind == ts.SyntaxKind.StringLiteral) {
                    const url = element.text;
                    if (url) {
                        acc.push(url);
                    }
                }
            });
        }
        return acc;
    }, []);
}
/**
 * Recursively calls diagnose on the plugins for all the reverse dependencies.
 * @private
 */
function _diagnoseDeps(reasons, plugin, checked) {
    reasons
        .filter(reason => reason && reason.module && reason.module instanceof NormalModule)
        .filter(reason => !checked.has(reason.module.resource))
        .forEach(reason => {
        checked.add(reason.module.resource);
        plugin.diagnose(reason.module.resource);
        _diagnoseDeps(reason.module.reasons, plugin, checked);
    });
}
// Super simple TS transpiler loader for testing / isolated usage. does not type check!
function ngcLoader() {
    const cb = this.async();
    const sourceFileName = this.resourcePath;
    const plugin = this._compilation._ngToolsWebpackPluginInstance;
    // We must verify that AotPlugin is an instance of the right class.
    if (plugin && plugin instanceof plugin_1.AotPlugin) {
        const refactor = new refactor_1.TypeScriptFileRefactor(sourceFileName, plugin.compilerHost, plugin.program);
        Promise.resolve()
            .then(() => {
            if (!plugin.skipCodeGeneration) {
                return Promise.resolve()
                    .then(() => _removeDecorators(refactor))
                    .then(() => _replaceBootstrap(plugin, refactor));
            }
            else {
                return Promise.resolve()
                    .then(() => _replaceResources(refactor))
                    .then(() => _removeModuleId(refactor));
            }
        })
            .then(() => {
            if (plugin.typeCheck) {
                // Check all diagnostics from this and reverse dependencies also.
                if (!plugin.firstRun) {
                    _diagnoseDeps(this._module.reasons, plugin, new Set());
                }
                // We do this here because it will throw on error, resulting in rebuilding this file
                // the next time around if it changes.
                plugin.diagnose(sourceFileName);
            }
        })
            .then(() => {
            // Add resources as dependencies.
            _getResourcesUrls(refactor).forEach((url) => {
                this.addDependency(path.resolve(path.dirname(sourceFileName), url));
            });
        })
            .then(() => {
            // Force a few compiler options to make sure we get the result we want.
            const compilerOptions = Object.assign({}, plugin.compilerOptions, {
                inlineSources: true,
                inlineSourceMap: false,
                sourceRoot: plugin.basePath
            });
            const result = refactor.transpile(compilerOptions);
            cb(null, result.outputText, result.sourceMap);
        })
            .catch(err => cb(err));
    }
    else {
        const options = loaderUtils.getOptions(this) || {};
        const tsConfigPath = options.tsConfigPath;
        const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
        if (tsConfig.error) {
            throw tsConfig.error;
        }
        const compilerOptions = tsConfig.config.compilerOptions;
        for (const key of Object.keys(options)) {
            if (key == 'tsConfigPath') {
                continue;
            }
            compilerOptions[key] = options[key];
        }
        const compilerHost = ts.createCompilerHost(compilerOptions);
        const refactor = new refactor_1.TypeScriptFileRefactor(sourceFileName, compilerHost);
        _replaceResources(refactor);
        const result = refactor.transpile(compilerOptions);
        // Webpack is going to take care of this.
        result.outputText = result.outputText.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '');
        cb(null, result.outputText, result.sourceMap);
    }
}
exports.ngcLoader = ngcLoader;
//# sourceMappingURL=/users/hansl/sources/angular-cli/src/loader.js.map