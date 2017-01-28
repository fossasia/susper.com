"use strict";
var ts = require('typescript');
var fs = require('fs');
var path = require('path');
var change_1 = require('./change');
var node_1 = require('./node');
var ast_utils_1 = require('./ast-utils');
var change_2 = require('./change');
/**
 * Adds imports to mainFile and adds toBootstrap to the array of providers
 * in bootstrap, if not present
 * @param mainFile main.ts
 * @param imports Object { importedClass: ['path/to/import/from', defaultStyleImport?] }
 * @param toBootstrap
 */
function bootstrapItem(mainFile, imports, toBootstrap) {
    var changes = Object.keys(imports).map(function (importedClass) {
        var defaultStyleImport = imports[importedClass].length === 2 && !!imports[importedClass][1];
        return insertImport(mainFile, importedClass, imports[importedClass][0].toString(), defaultStyleImport);
    });
    var rootNode = getRootNode(mainFile);
    // get ExpressionStatements from the top level syntaxList of the sourceFile
    var bootstrapNodes = rootNode.getChildAt(0).getChildren().filter(function (node) {
        // get bootstrap expressions
        return node.kind === ts.SyntaxKind.ExpressionStatement &&
            node.getChildAt(0).getChildAt(0).text.toLowerCase() === 'bootstrap';
    });
    if (bootstrapNodes.length !== 1) {
        throw new Error(("Did not bootstrap provideRouter in " + mainFile) +
            ' because of multiple or no bootstrap calls');
    }
    var bootstrapNode = bootstrapNodes[0].getChildAt(0);
    var isBootstraped = node_1.findNodes(bootstrapNode, ts.SyntaxKind.SyntaxList) // get bootstrapped items
        .reduce(function (a, b) { return a.concat(b.getChildren().map(function (n) { return n.getText(); })); }, [])
        .filter(function (n) { return n !== ','; })
        .indexOf(toBootstrap) !== -1;
    if (isBootstraped) {
        return changes;
    }
    // if bracket exitst already, add configuration template,
    // otherwise, insert into bootstrap parens
    var fallBackPos, configurePathsTemplate, separator;
    var syntaxListNodes;
    var bootstrapProviders = bootstrapNode.getChildAt(2).getChildAt(2); // array of providers
    if (bootstrapProviders) {
        syntaxListNodes = bootstrapProviders.getChildAt(1).getChildren();
        fallBackPos = bootstrapProviders.getChildAt(2).pos; // closeBracketLiteral
        separator = syntaxListNodes.length === 0 ? '' : ', ';
        configurePathsTemplate = "" + separator + toBootstrap;
    }
    else {
        fallBackPos = bootstrapNode.getChildAt(3).pos; // closeParenLiteral
        syntaxListNodes = bootstrapNode.getChildAt(2).getChildren();
        configurePathsTemplate = ", [ " + toBootstrap + " ]";
    }
    changes.push(ast_utils_1.insertAfterLastOccurrence(syntaxListNodes, configurePathsTemplate, mainFile, fallBackPos));
    return changes;
}
exports.bootstrapItem = bootstrapItem;
/**
* Add Import `import { symbolName } from fileName` if the import doesn't exit
* already. Assumes fileToEdit can be resolved and accessed.
* @param fileToEdit (file we want to add import to)
* @param symbolName (item to import)
* @param fileName (path to the file)
* @param isDefault (if true, import follows style for importing default exports)
* @return Change
*/
function insertImport(fileToEdit, symbolName, fileName, isDefault) {
    if (isDefault === void 0) { isDefault = false; }
    if (process.platform.startsWith('win')) {
        fileName = fileName.replace(/\\/g, '/'); // correction in windows
    }
    var rootNode = getRootNode(fileToEdit);
    var allImports = node_1.findNodes(rootNode, ts.SyntaxKind.ImportDeclaration);
    // get nodes that map to import statements from the file fileName
    var relevantImports = allImports.filter(function (node) {
        // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
        var importFiles = node.getChildren().filter(function (child) { return child.kind === ts.SyntaxKind.StringLiteral; })
            .map(function (n) { return n.text; });
        return importFiles.filter(function (file) { return file === fileName; }).length === 1;
    });
    if (relevantImports.length > 0) {
        var importsAsterisk_1 = false;
        // imports from import file
        var imports_1 = [];
        relevantImports.forEach(function (n) {
            Array.prototype.push.apply(imports_1, node_1.findNodes(n, ts.SyntaxKind.Identifier));
            if (node_1.findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
                importsAsterisk_1 = true;
            }
        });
        // if imports * from fileName, don't add symbolName
        if (importsAsterisk_1) {
            return;
        }
        var importTextNodes = imports_1.filter(function (n) { return n.text === symbolName; });
        // insert import if it's not there
        if (importTextNodes.length === 0) {
            var fallbackPos_1 = node_1.findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].pos ||
                node_1.findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].pos;
            return ast_utils_1.insertAfterLastOccurrence(imports_1, ", " + symbolName, fileToEdit, fallbackPos_1);
        }
        return new change_1.NoopChange();
    }
    // no such import declaration exists
    var useStrict = node_1.findNodes(rootNode, ts.SyntaxKind.StringLiteral)
        .filter(function (n) { return n.text === 'use strict'; });
    var fallbackPos = 0;
    if (useStrict.length > 0) {
        fallbackPos = useStrict[0].end;
    }
    var open = isDefault ? '' : '{ ';
    var close = isDefault ? '' : ' }';
    // if there are no imports or 'use strict' statement, insert import at beginning of file
    var insertAtBeginning = allImports.length === 0 && useStrict.length === 0;
    var separator = insertAtBeginning ? '' : ';\n';
    var toInsert = (separator + "import " + open + symbolName + close) +
        (" from '" + fileName + "'" + (insertAtBeginning ? ';\n' : ''));
    return ast_utils_1.insertAfterLastOccurrence(allImports, toInsert, fileToEdit, fallbackPos, ts.SyntaxKind.StringLiteral);
}
exports.insertImport = insertImport;
;
/**
 * Inserts a path to the new route into src/routes.ts if it doesn't exist
 * @param routesFile
 * @param pathOptions
 * @return Change[]
 * @throws Error if routesFile has multiple export default or none.
 */
function addPathToRoutes(routesFile, pathOptions) {
    var route = pathOptions.route.split('/')
        .filter(function (n) { return n !== ''; }).join('/'); // change say `/about/:id/` to `about/:id`
    var isDefault = pathOptions.isDefault ? ', useAsDefault: true' : '';
    var outlet = pathOptions.outlet ? ", outlet: '" + pathOptions.outlet + "'" : '';
    // create route path and resolve component import
    var positionalRoutes = /\/:[^/]*/g;
    var routePath = route.replace(positionalRoutes, '');
    routePath = "./app/" + routePath + "/" + pathOptions.dasherizedName + ".component";
    var originalComponent = pathOptions.component;
    pathOptions.component = resolveImportName(pathOptions.component, routePath, pathOptions.routesFile);
    var content = "{ path: '" + route + "', component: " + pathOptions.component + isDefault + outlet + " }";
    var rootNode = getRootNode(routesFile);
    var routesNode = rootNode.getChildAt(0).getChildren().filter(function (n) {
        // get export statement
        return n.kind === ts.SyntaxKind.ExportAssignment &&
            n.getFullText().indexOf('export default') !== -1;
    });
    if (routesNode.length !== 1) {
        throw new Error('Did not insert path in routes.ts because ' +
            "there were multiple or no 'export default' statements");
    }
    var pos = routesNode[0].getChildAt(2).getChildAt(0).end; // openBracketLiteral
    // all routes in export route array
    var routesArray = routesNode[0].getChildAt(2).getChildAt(1)
        .getChildren()
        .filter(function (n) { return n.kind === ts.SyntaxKind.ObjectLiteralExpression; });
    if (pathExists(routesArray, route, pathOptions.component)) {
        // don't duplicate routes
        throw new Error('Route was not added since it is a duplicate');
    }
    var isChild = false;
    // get parent to insert under
    var parent;
    if (pathOptions.parent) {
        // append '_' to route to find the actual parent (not parent of the parent)
        parent = getParent(routesArray, pathOptions.parent + "/_");
        if (!parent) {
            throw new Error("You specified parent '" + pathOptions.parent + "'' which was not found in routes.ts");
        }
        if (route.indexOf(pathOptions.parent) === 0) {
            route = route.substring(pathOptions.parent.length);
        }
    }
    else {
        parent = getParent(routesArray, route);
    }
    if (parent) {
        var childrenInfo = addChildPath(parent, pathOptions, route);
        if (!childrenInfo) {
            // path exists already
            throw new Error('Route was not added since it is a duplicate');
        }
        content = childrenInfo.newContent;
        pos = childrenInfo.pos;
        isChild = true;
    }
    var isFirstElement = routesArray.length === 0;
    if (!isChild) {
        var separator = isFirstElement ? '\n' : ',';
        content = "\n  " + content + separator;
    }
    var changes = [new change_1.InsertChange(routesFile, pos, content)];
    var component = originalComponent === pathOptions.component ? originalComponent :
        originalComponent + " as " + pathOptions.component;
    routePath = routePath.replace(/\\/, '/'); // correction in windows
    changes.push(insertImport(routesFile, component, routePath));
    return changes;
}
exports.addPathToRoutes = addPathToRoutes;
/**
 * Add more properties to the route object in routes.ts
 * @param routesFile routes.ts
 * @param routes Object {route: [key, value]}
 */
function addItemsToRouteProperties(routesFile, routes) {
    var rootNode = getRootNode(routesFile);
    var routesNode = rootNode.getChildAt(0).getChildren().filter(function (n) {
        // get export statement
        return n.kind === ts.SyntaxKind.ExportAssignment &&
            n.getFullText().indexOf('export default') !== -1;
    });
    if (routesNode.length !== 1) {
        throw new Error('Did not insert path in routes.ts because ' +
            "there were multiple or no 'export default' statements");
    }
    var routesArray = routesNode[0].getChildAt(2).getChildAt(1)
        .getChildren()
        .filter(function (n) { return n.kind === ts.SyntaxKind.ObjectLiteralExpression; });
    var changes = Object.keys(routes).reduce(function (result, route) {
        // let route = routes[guardName][0];
        var itemKey = routes[route][0];
        var itemValue = routes[route][1];
        var currRouteNode = getParent(routesArray, route + "/_");
        if (!currRouteNode) {
            throw new Error("Could not find '" + route + "' in routes.ts");
        }
        var fallBackPos = node_1.findNodes(currRouteNode, ts.SyntaxKind.CloseBraceToken).pop().pos;
        var pathPropertiesNodes = currRouteNode.getChildAt(1).getChildren()
            .filter(function (n) { return n.kind === ts.SyntaxKind.PropertyAssignment; });
        return result.concat([ast_utils_1.insertAfterLastOccurrence(pathPropertiesNodes, ", " + itemKey + ": " + itemValue, routesFile, fallBackPos)]);
    }, []);
    return changes;
}
exports.addItemsToRouteProperties = addItemsToRouteProperties;
/**
 * Verifies that a component file exports a class of the component
 * @param file
 * @param componentName
 * @return whether file exports componentName
 */
function confirmComponentExport(file, componentName) {
    var rootNode = getRootNode(file);
    var exportNodes = rootNode.getChildAt(0).getChildren().filter(function (n) {
        return n.kind === ts.SyntaxKind.ClassDeclaration &&
            (n.getChildren().filter(function (p) { return p.text === componentName; }).length !== 0);
    });
    return exportNodes.length > 0;
}
exports.confirmComponentExport = confirmComponentExport;
/**
 * Ensures there is no collision between import names. If a collision occurs, resolve by adding
 * underscore number to the name
 * @param importName
 * @param importPath path to import component from
 * @param fileName (file to add import to)
 * @return resolved importName
 */
function resolveImportName(importName, importPath, fileName) {
    var rootNode = getRootNode(fileName);
    // get all the import names
    var importNodes = rootNode.getChildAt(0).getChildren()
        .filter(function (n) { return n.kind === ts.SyntaxKind.ImportDeclaration; });
    // check if imported file is same as current one before updating component name
    var importNames = importNodes
        .reduce(function (a, b) {
        var importFrom = node_1.findNodes(b, ts.SyntaxKind.StringLiteral); // there's only one
        if (importFrom.pop().text !== importPath) {
            // importing from different file, add to imported components to inspect
            // if only one identifier { FooComponent }, if two { FooComponent as FooComponent_1 }
            // choose last element of identifier array in both cases
            return a.concat([node_1.findNodes(b, ts.SyntaxKind.Identifier).pop()]);
        }
        return a;
    }, [])
        .map(function (n) { return n.text; });
    var index = importNames.indexOf(importName);
    if (index === -1) {
        return importName;
    }
    var baseName = importNames[index].split('_')[0];
    var newName = baseName;
    var resolutionNumber = 1;
    while (importNames.indexOf(newName) !== -1) {
        newName = baseName + "_" + resolutionNumber;
        resolutionNumber++;
    }
    return newName;
}
/**
 * Resolve a path to a component file. If the path begins with path.sep, it is treated to be
 * absolute from the app/ directory. Otherwise, it is relative to currDir
 * @param projectRoot
 * @param currentDir
 * @param filePath componentName or path to componentName
 * @return component file name
 * @throw Error if component file referenced by path is not found
 */
function resolveComponentPath(projectRoot, currentDir, filePath) {
    var parsedPath = path.parse(filePath);
    var componentName = parsedPath.base.split('.')[0];
    var componentDir = path.parse(parsedPath.dir).base;
    // correction for a case where path is /**/componentName/componentName(.component.ts)
    if (componentName === componentDir) {
        filePath = parsedPath.dir;
    }
    if (parsedPath.dir === '') {
        // only component file name is given
        filePath = componentName;
    }
    var directory = filePath[0] === path.sep ?
        path.resolve(path.join(projectRoot, 'src', 'app', filePath)) :
        path.resolve(currentDir, filePath);
    if (!fs.existsSync(directory)) {
        throw new Error(("path '" + filePath + "' must be relative to current directory") +
            " or absolute from project root");
    }
    if (directory.indexOf('src' + path.sep + 'app') === -1) {
        throw new Error('Route must be within app');
    }
    var componentFile = path.join(directory, componentName + ".component.ts");
    if (!fs.existsSync(componentFile)) {
        throw new Error("could not find component file referenced by " + filePath);
    }
    return componentFile;
}
exports.resolveComponentPath = resolveComponentPath;
/**
 * Sort changes in decreasing order and apply them.
 * @param changes
 * @param host
 * @return Promise
 */
function applyChanges(changes, host) {
    if (host === void 0) { host = change_2.NodeHost; }
    return changes
        .filter(function (change) { return !!change; })
        .sort(function (curr, next) { return next.order - curr.order; })
        .reduce(function (newChange, change) { return newChange.then(function () { return change.apply(host); }); }, Promise.resolve());
}
exports.applyChanges = applyChanges;
/**
 * Helper for addPathToRoutes. Adds child array to the appropriate position in the routes.ts file
 * @return Object (pos, newContent)
 */
function addChildPath(parentObject, pathOptions, route) {
    if (!parentObject) {
        return;
    }
    var pos;
    var newContent;
    // get object with 'children' property
    var childrenNode = parentObject.getChildAt(1).getChildren()
        .filter(function (n) {
        return n.kind === ts.SyntaxKind.PropertyAssignment
            && n.name.text === 'children';
    });
    // find number of spaces to pad nested paths
    var nestingLevel = 1; // for indenting route object in the `children` array
    var n = parentObject;
    while (n.parent) {
        if (n.kind === ts.SyntaxKind.ObjectLiteralExpression
            || n.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            nestingLevel++;
        }
        n = n.parent;
    }
    // strip parent route
    var parentRoute = parentObject.getChildAt(1).getChildAt(0).getChildAt(2).text;
    var childRoute = route.substring(route.indexOf(parentRoute) + parentRoute.length + 1);
    var isDefault = pathOptions.isDefault ? ', useAsDefault: true' : '';
    var outlet = pathOptions.outlet ? ", outlet: '" + pathOptions.outlet + "'" : '';
    var content = ("{ path: '" + childRoute + "', component: " + pathOptions.component) +
        ("" + isDefault + outlet + " }");
    var spaces = Array(2 * nestingLevel + 1).join(' ');
    if (childrenNode.length !== 0) {
        // add to beginning of children array
        pos = childrenNode[0].getChildAt(2).getChildAt(1).pos; // open bracket
        newContent = "\n" + spaces + content + ",";
    }
    else {
        // no children array, add one
        pos = parentObject.getChildAt(2).pos; // close brace
        newContent = (",\n" + spaces.substring(2) + "children: [\n" + spaces + content) +
            ("\n" + spaces.substring(2) + "]\n" + spaces.substring(5));
    }
    return { newContent: newContent, pos: pos };
}
/**
 * Helper for addPathToRoutes.
 * @return parentNode which contains the children array to add a new path to or
 *         undefined if none or the entire route was matched.
 */
function getParent(routesArray, route, parent) {
    if (routesArray.length === 0 && !parent) {
        return; // no children array and no parent found
    }
    if (route.length === 0) {
        return; // route has been completely matched
    }
    var splitRoute = route.split('/');
    // don't treat positional parameters separately
    if (splitRoute.length > 1 && splitRoute[1].indexOf(':') !== -1) {
        var actualRoute = splitRoute.shift();
        splitRoute[0] = actualRoute + "/" + splitRoute[0];
    }
    var potentialParents = routesArray // route nodes with same path as current route
        .filter(function (n) { return getValueForKey(n, 'path') === splitRoute[0]; });
    if (potentialParents.length !== 0) {
        splitRoute.shift(); // matched current parent, move on
        route = splitRoute.join('/');
    }
    // get all children paths
    var newRouteArray = getChildrenArray(routesArray);
    if (route && parent && potentialParents.length === 0) {
        return parent; // final route is not matched. assign parent from here
    }
    parent = potentialParents.sort(function (a, b) { return a.pos - b.pos; }).shift();
    return getParent(newRouteArray, route, parent);
}
/**
 * Helper for addPathToRoutes.
 * @return whether path with same route and component exists
 */
function pathExists(routesArray, route, component, fullRoute) {
    if (routesArray.length === 0) {
        return false;
    }
    fullRoute = fullRoute ? fullRoute : route;
    var sameRoute = false;
    var splitRoute = route.split('/');
    // don't treat positional parameters separately
    if (splitRoute.length > 1 && splitRoute[1].indexOf(':') !== -1) {
        var actualRoute = splitRoute.shift();
        splitRoute[0] = actualRoute + "/" + splitRoute[0];
    }
    var repeatedRoutes = routesArray.filter(function (n) {
        var currentRoute = getValueForKey(n, 'path');
        var sameComponent = getValueForKey(n, 'component') === component;
        sameRoute = currentRoute === splitRoute[0];
        // Confirm that it's parents are the same
        if (sameRoute && sameComponent) {
            var path_1 = currentRoute;
            var objExp = n.parent;
            while (objExp) {
                if (objExp.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                    var currentParentPath = getValueForKey(objExp, 'path');
                    path_1 = currentParentPath ? currentParentPath + "/" + path_1 : path_1;
                }
                objExp = objExp.parent;
            }
            return path_1 === fullRoute;
        }
        return false;
    });
    if (sameRoute) {
        splitRoute.shift(); // matched current parent, move on
        route = splitRoute.join('/');
    }
    if (repeatedRoutes.length !== 0) {
        return true; // new path will be repeating if inserted. report that path already exists
    }
    // all children paths
    var newRouteArray = getChildrenArray(routesArray);
    return pathExists(newRouteArray, route, component, fullRoute);
}
/**
 * Helper for getParent and pathExists
 * @return array with all nodes holding children array under routes
 *         in routesArray
 */
function getChildrenArray(routesArray) {
    return routesArray.reduce(function (allRoutes, currRoute) { return allRoutes.concat(currRoute.getChildAt(1).getChildren()
        .filter(function (n) { return n.kind === ts.SyntaxKind.PropertyAssignment
        && n.name.text === 'children'; })
        .map(function (n) { return n.getChildAt(2).getChildAt(1); }) // syntaxList containing chilren paths
        .reduce(function (childrenArray, currChild) { return childrenArray.concat(currChild.getChildren()
        .filter(function (p) { return p.kind === ts.SyntaxKind.ObjectLiteralExpression; })); }, [])); }, []);
}
/**
 * Helper method to get the path text or component
 * @param objectLiteralNode
 * @param key 'path' or 'component'
 */
function getValueForKey(objectLiteralNode, key) {
    var currentNode = key === 'component' ? objectLiteralNode.getChildAt(1).getChildAt(2) :
        objectLiteralNode.getChildAt(1).getChildAt(0);
    return currentNode
        && currentNode.getChildAt(0)
        && currentNode.getChildAt(0).text === key
        && currentNode.getChildAt(2)
        && currentNode.getChildAt(2).text;
}
/**
 * Helper method to get AST from file
 * @param file
 */
function getRootNode(file) {
    return ts.createSourceFile(file, fs.readFileSync(file).toString(), ts.ScriptTarget.Latest, true);
}
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@angular-cli/ast-tools/src/route-utils.js.map