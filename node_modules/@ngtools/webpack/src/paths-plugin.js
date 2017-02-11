"use strict";
const path = require('path');
const ts = require('typescript');
const ModulesInRootPlugin = require('enhanced-resolve/lib/ModulesInRootPlugin');
const createInnerCallback = require('enhanced-resolve/lib/createInnerCallback');
const getInnerRequest = require('enhanced-resolve/lib/getInnerRequest');
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
class PathsPlugin {
    constructor(options) {
        if (!options.hasOwnProperty('tsConfigPath')) {
            // This could happen in JavaScript.
            throw new Error('tsConfigPath option is mandatory.');
        }
        this._tsConfigPath = options.tsConfigPath;
        if (options.hasOwnProperty('compilerOptions')) {
            this._compilerOptions = Object.assign({}, options.compilerOptions);
        }
        else {
            this._compilerOptions = PathsPlugin._loadOptionsFromTsConfig(this._tsConfigPath, null);
        }
        if (options.hasOwnProperty('compilerHost')) {
            this._host = options.compilerHost;
        }
        else {
            this._host = ts.createCompilerHost(this._compilerOptions, false);
        }
        this.source = 'described-resolve';
        this.target = 'resolve';
        this._absoluteBaseUrl = path.resolve(path.dirname(this._tsConfigPath), this._compilerOptions.baseUrl || '.');
        this.mappings = [];
        let paths = this._compilerOptions.paths || {};
        Object.keys(paths).forEach(alias => {
            let onlyModule = alias.indexOf('*') === -1;
            let excapedAlias = escapeRegExp(alias);
            let targets = paths[alias];
            targets.forEach(target => {
                let aliasPattern;
                if (onlyModule) {
                    aliasPattern = new RegExp(`^${excapedAlias}$`);
                }
                else {
                    let withStarCapturing = excapedAlias.replace('\\*', '(.*)');
                    aliasPattern = new RegExp(`^${withStarCapturing}`);
                }
                this.mappings.push({
                    onlyModule,
                    alias,
                    aliasPattern,
                    target: target
                });
            });
        });
    }
    static _loadOptionsFromTsConfig(tsConfigPath, host) {
        const tsConfig = ts.readConfigFile(tsConfigPath, (path) => {
            if (host) {
                return host.readFile(path);
            }
            else {
                return ts.sys.readFile(path);
            }
        });
        if (tsConfig.error) {
            throw tsConfig.error;
        }
        return tsConfig.config.compilerOptions;
    }
    apply(resolver) {
        let baseUrl = this._compilerOptions.baseUrl || '.';
        if (baseUrl) {
            resolver.apply(new ModulesInRootPlugin('module', this._absoluteBaseUrl, 'resolve'));
        }
        this.mappings.forEach((mapping) => {
            resolver.plugin(this.source, this.createPlugin(resolver, mapping));
        });
    }
    resolve(resolver, mapping, request, callback) {
        let innerRequest = getInnerRequest(resolver, request);
        if (!innerRequest) {
            return callback();
        }
        let match = innerRequest.match(mapping.aliasPattern);
        if (!match) {
            return callback();
        }
        let newRequestStr = mapping.target;
        if (!mapping.onlyModule) {
            newRequestStr = newRequestStr.replace('*', match[1]);
        }
        if (newRequestStr[0] === '.') {
            newRequestStr = path.resolve(this._absoluteBaseUrl, newRequestStr);
        }
        let newRequest = Object.assign({}, request, {
            request: newRequestStr
        });
        return resolver.doResolve(this.target, newRequest, `aliased with mapping '${innerRequest}': '${mapping.alias}' to '${newRequestStr}'`, createInnerCallback(function (err, result) {
            if (arguments.length > 0) {
                return callback(err, result);
            }
            // don't allow other aliasing or raw request
            callback(null, null);
        }, callback));
    }
    createPlugin(resolver, mapping) {
        return (request, callback) => {
            try {
                this.resolve(resolver, mapping, request, callback);
            }
            catch (err) {
                callback(err);
            }
        };
    }
}
exports.PathsPlugin = PathsPlugin;
//# sourceMappingURL=/Users/hansl/Sources/angular-cli/packages/@ngtools/webpack/src/paths-plugin.js.map