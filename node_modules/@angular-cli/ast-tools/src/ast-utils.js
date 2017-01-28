"use strict";
var ts = require('typescript');
var fs = require('fs');
var symbols_1 = require('@angular/tsc-wrapped/src/symbols');
var tsc_wrapped_1 = require('@angular/tsc-wrapped');
var change_1 = require('./change');
var node_1 = require('./node');
var route_utils_1 = require('./route-utils');
var ReplaySubject_1 = require('rxjs/ReplaySubject');
require('rxjs/add/observable/empty');
require('rxjs/add/observable/of');
require('rxjs/add/operator/do');
require('rxjs/add/operator/filter');
require('rxjs/add/operator/last');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/toArray');
require('rxjs/add/operator/toPromise');
/**
* Get TS source file based on path.
* @param filePath
* @return source file of ts.SourceFile kind
*/
function getSource(filePath) {
    return ts.createSourceFile(filePath, fs.readFileSync(filePath).toString(), ts.ScriptTarget.Latest, true);
}
exports.getSource = getSource;
/**
 * Get all the nodes from a source, as an observable.
 * @param sourceFile The source file object.
 * @returns {Observable<ts.Node>} An observable of all the nodes in the source.
 */
function getSourceNodes(sourceFile) {
    var subject = new ReplaySubject_1.ReplaySubject();
    var nodes = [sourceFile];
    while (nodes.length > 0) {
        var node = nodes.shift();
        if (node) {
            subject.next(node);
            if (node.getChildCount(sourceFile) >= 0) {
                nodes.unshift.apply(nodes, node.getChildren());
            }
        }
    }
    subject.complete();
    return subject.asObservable();
}
exports.getSourceNodes = getSourceNodes;
/**
 * Helper for sorting nodes.
 * @return function to sort nodes in increasing order of position in sourceFile
 */
function nodesByPosition(first, second) {
    return first.pos - second.pos;
}
/**
 * Insert `toInsert` after the last occurence of `ts.SyntaxKind[nodes[i].kind]`
 * or after the last of occurence of `syntaxKind` if the last occurence is a sub child
 * of ts.SyntaxKind[nodes[i].kind] and save the changes in file.
 *
 * @param nodes insert after the last occurence of nodes
 * @param toInsert string to insert
 * @param file file to insert changes into
 * @param fallbackPos position to insert if toInsert happens to be the first occurence
 * @param syntaxKind the ts.SyntaxKind of the subchildren to insert after
 * @return Change instance
 * @throw Error if toInsert is first occurence but fall back is not set
 */
function insertAfterLastOccurrence(nodes, toInsert, file, fallbackPos, syntaxKind) {
    var lastItem = nodes.sort(nodesByPosition).pop();
    if (syntaxKind) {
        lastItem = node_1.findNodes(lastItem, syntaxKind).sort(nodesByPosition).pop();
    }
    if (!lastItem && fallbackPos == undefined) {
        throw new Error("tried to insert " + toInsert + " as first occurence with no fallback position");
    }
    var lastItemPosition = lastItem ? lastItem.end : fallbackPos;
    return new change_1.InsertChange(file, lastItemPosition, toInsert);
}
exports.insertAfterLastOccurrence = insertAfterLastOccurrence;
function getContentOfKeyLiteral(source, node) {
    if (node.kind == ts.SyntaxKind.Identifier) {
        return node.text;
    }
    else if (node.kind == ts.SyntaxKind.StringLiteral) {
        return node.text;
    }
    else {
        return null;
    }
}
exports.getContentOfKeyLiteral = getContentOfKeyLiteral;
function getDecoratorMetadata(source, identifier, module) {
    var symbols = new symbols_1.Symbols(source);
    return getSourceNodes(source)
        .filter(function (node) {
        return node.kind == ts.SyntaxKind.Decorator
            && node.expression.kind == ts.SyntaxKind.CallExpression;
    })
        .map(function (node) { return node.expression; })
        .filter(function (expr) {
        if (expr.expression.kind == ts.SyntaxKind.Identifier) {
            var id = expr.expression;
            var metaData = symbols.resolve(id.getFullText(source));
            if (tsc_wrapped_1.isMetadataImportedSymbolReferenceExpression(metaData)) {
                return metaData.name == identifier && metaData.module == module;
            }
        }
        else if (expr.expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
            // This covers foo.NgModule when importing * as foo.
            var paExpr = expr.expression;
            // If the left expression is not an identifier, just give up at that point.
            if (paExpr.expression.kind !== ts.SyntaxKind.Identifier) {
                return false;
            }
            var id = paExpr.name;
            var moduleId = paExpr.expression;
            var moduleMetaData = symbols.resolve(moduleId.getFullText(source));
            if (tsc_wrapped_1.isMetadataModuleReferenceExpression(moduleMetaData)) {
                return moduleMetaData.module == module && id.getFullText(source) == identifier;
            }
        }
        return false;
    })
        .filter(function (expr) { return expr.arguments[0]
        && expr.arguments[0].kind == ts.SyntaxKind.ObjectLiteralExpression; })
        .map(function (expr) { return expr.arguments[0]; });
}
exports.getDecoratorMetadata = getDecoratorMetadata;
function _addSymbolToNgModuleMetadata(ngModulePath, metadataField, symbolName, importPath) {
    var source = getSource(ngModulePath);
    var metadata = getDecoratorMetadata(source, 'NgModule', '@angular/core');
    // Find the decorator declaration.
    return metadata
        .toPromise()
        .then(function (node) {
        if (!node) {
            return null;
        }
        // Get all the children property assignment of object literals.
        return node.properties
            .filter(function (prop) { return prop.kind == ts.SyntaxKind.PropertyAssignment; })
            .filter(function (prop) {
            var name = prop.name;
            switch (name.kind) {
                case ts.SyntaxKind.Identifier:
                    return name.getText(source) == metadataField;
                case ts.SyntaxKind.StringLiteral:
                    return name.text == metadataField;
            }
            return false;
        });
    })
        .then(function (matchingProperties) {
        if (!matchingProperties) {
            return null;
        }
        if (matchingProperties.length == 0) {
            return metadata.toPromise();
        }
        var assignment = matchingProperties[0];
        // If it's not an array, nothing we can do really.
        if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
            return null;
        }
        var arrLiteral = assignment.initializer;
        if (arrLiteral.elements.length == 0) {
            // Forward the property.
            return arrLiteral;
        }
        return arrLiteral.elements;
    })
        .then(function (node) {
        if (!node) {
            /* eslint-disable no-console */
            console.log('No app module found. Please add your new class to your component.');
            return new change_1.NoopChange();
        }
        if (Array.isArray(node)) {
            node = node[node.length - 1];
        }
        var toInsert;
        var position = node.getEnd();
        if (node.kind == ts.SyntaxKind.ObjectLiteralExpression) {
            // We haven't found the field in the metadata declaration. Insert a new
            // field.
            var expr = node;
            if (expr.properties.length == 0) {
                position = expr.getEnd() - 1;
                toInsert = "  " + metadataField + ": [" + symbolName + "]\n";
            }
            else {
                node = expr.properties[expr.properties.length - 1];
                position = node.getEnd();
                // Get the indentation of the last element, if any.
                var text = node.getFullText(source);
                if (text.match('^\r?\r?\n')) {
                    toInsert = "," + text.match(/^\r?\n\s+/)[0] + metadataField + ": [" + symbolName + "]";
                }
                else {
                    toInsert = ", " + metadataField + ": [" + symbolName + "]";
                }
            }
        }
        else if (node.kind == ts.SyntaxKind.ArrayLiteralExpression) {
            // We found the field but it's empty. Insert it just before the `]`.
            position--;
            toInsert = "" + symbolName;
        }
        else {
            // Get the indentation of the last element, if any.
            var text = node.getFullText(source);
            if (text.match(/^\r?\n/)) {
                toInsert = "," + text.match(/^\r?\n(\r?)\s+/)[0] + symbolName;
            }
            else {
                toInsert = ", " + symbolName;
            }
        }
        var insert = new change_1.InsertChange(ngModulePath, position, toInsert);
        var importInsert = route_utils_1.insertImport(ngModulePath, symbolName.replace(/\..*$/, ''), importPath);
        return new change_1.MultiChange([insert, importInsert]);
    });
}
/**
* Custom function to insert a declaration (component, pipe, directive)
* into NgModule declarations. It also imports the component.
*/
function addDeclarationToModule(modulePath, classifiedName, importPath) {
    return _addSymbolToNgModuleMetadata(modulePath, 'declarations', classifiedName, importPath);
}
exports.addDeclarationToModule = addDeclarationToModule;
/**
 * Custom function to insert a declaration (component, pipe, directive)
 * into NgModule declarations. It also imports the component.
 */
function addImportToModule(modulePath, classifiedName, importPath) {
    return _addSymbolToNgModuleMetadata(modulePath, 'imports', classifiedName, importPath);
}
exports.addImportToModule = addImportToModule;
/**
 * Custom function to insert a provider into NgModule. It also imports it.
 */
function addProviderToModule(modulePath, classifiedName, importPath) {
    return _addSymbolToNgModuleMetadata(modulePath, 'providers', classifiedName, importPath);
}
exports.addProviderToModule = addProviderToModule;
/**
 * Custom function to insert an export into NgModule. It also imports it.
 */
function addExportToModule(modulePath, classifiedName, importPath) {
    return _addSymbolToNgModuleMetadata(modulePath, 'exports', classifiedName, importPath);
}
exports.addExportToModule = addExportToModule;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@angular-cli/ast-tools/src/ast-utils.js.map