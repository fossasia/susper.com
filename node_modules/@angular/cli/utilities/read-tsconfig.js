"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const require_project_module_1 = require("../utilities/require-project-module");
function readTsconfig(tsconfigPath) {
    const projectTs = require_project_module_1.requireProjectModule(path.dirname(tsconfigPath), 'typescript');
    const configResult = projectTs.readConfigFile(tsconfigPath, projectTs.sys.readFile);
    const tsConfig = projectTs.parseJsonConfigFileContent(configResult.config, projectTs.sys, path.dirname(tsconfigPath), undefined, tsconfigPath);
    return tsConfig;
}
exports.readTsconfig = readTsconfig;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/utilities/read-tsconfig.js.map