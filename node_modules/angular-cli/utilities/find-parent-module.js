"use strict";
var fs = require('fs');
var path = require('path');
var SilentError = require('silent-error');
function findParentModule(project, currentDir) {
    var sourceRoot = path.join(project.root, project.ngConfig.apps[0].root, 'app');
    // trim currentDir
    currentDir = currentDir.replace(path.join(project.ngConfig.apps[0].root, 'app'), '');
    var pathToCheck = path.join(sourceRoot, currentDir);
    while (pathToCheck.length >= sourceRoot.length) {
        // TODO: refactor to not be based upon file name
        var files = fs.readdirSync(pathToCheck)
            .filter(function (fileName) { return !fileName.endsWith('routing.module.ts'); })
            .filter(function (fileName) { return fileName.endsWith('.module.ts'); })
            .filter(function (fileName) { return fs.statSync(path.join(pathToCheck, fileName)).isFile(); });
        if (files.length === 1) {
            return path.join(pathToCheck, files[0]);
        }
        else if (files.length > 1) {
            throw new SilentError("Multiple module files found: " + pathToCheck.replace(sourceRoot, ''));
        }
        // move to parent directory
        pathToCheck = path.dirname(pathToCheck);
    }
    throw new SilentError('No module files found');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = findParentModule;
;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/utilities/find-parent-module.js.map