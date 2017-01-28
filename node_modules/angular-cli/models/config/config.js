"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var path = require('path');
var schema_class_factory_1 = require('../json-schema/schema-class-factory');
var DEFAULT_CONFIG_SCHEMA_PATH = path.join(__dirname, '../../lib/config/schema.json');
var InvalidConfigError = (function (_super) {
    __extends(InvalidConfigError, _super);
    function InvalidConfigError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = 'InvalidConfigError';
    }
    return InvalidConfigError;
}(Error));
var CliConfig = (function () {
    function CliConfig(_configPath, schema, configJson, fallbacks) {
        if (fallbacks === void 0) { fallbacks = []; }
        this._configPath = _configPath;
        this._config = new ((_a = (schema_class_factory_1.SchemaClassFactory(schema))).bind.apply(_a, [void 0].concat([configJson], fallbacks)))();
        var _a;
    }
    Object.defineProperty(CliConfig.prototype, "config", {
        get: function () { return this._config; },
        enumerable: true,
        configurable: true
    });
    CliConfig.prototype.save = function (path) {
        if (path === void 0) { path = this._configPath; }
        return fs.writeFileSync(path, this.serialize(), 'utf-8');
    };
    CliConfig.prototype.serialize = function (mimetype) {
        if (mimetype === void 0) { mimetype = 'application/json'; }
        return this._config.$$serialize(mimetype);
    };
    CliConfig.prototype.alias = function (path, newPath) {
        return this._config.$$alias(path, newPath);
    };
    CliConfig.prototype.get = function (jsonPath) {
        return this._config.$$get(jsonPath);
    };
    CliConfig.prototype.typeOf = function (jsonPath) {
        return this._config.$$typeOf(jsonPath);
    };
    CliConfig.prototype.isDefined = function (jsonPath) {
        return this._config.$$defined(jsonPath);
    };
    CliConfig.prototype.deletePath = function (jsonPath) {
        return this._config.$$delete(jsonPath);
    };
    CliConfig.prototype.set = function (jsonPath, value) {
        this._config.$$set(jsonPath, value);
    };
    CliConfig.fromJson = function (content) {
        var global = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            global[_i - 1] = arguments[_i];
        }
        var schemaContent = fs.readFileSync(DEFAULT_CONFIG_SCHEMA_PATH, 'utf-8');
        var schema;
        try {
            schema = JSON.parse(schemaContent);
        }
        catch (err) {
            throw new InvalidConfigError(err.message);
        }
        return new CliConfig(null, schema, content, global);
    };
    CliConfig.fromConfigPath = function (configPath, otherPath) {
        if (otherPath === void 0) { otherPath = []; }
        var configContent = fs.readFileSync(configPath, 'utf-8');
        var schemaContent = fs.readFileSync(DEFAULT_CONFIG_SCHEMA_PATH, 'utf-8');
        var otherContents = otherPath
            .map(function (path) { return fs.existsSync(path) && fs.readFileSync(path, 'utf-8'); })
            .filter(function (content) { return !!content; });
        var content;
        var schema;
        var others;
        try {
            content = JSON.parse(configContent);
        }
        catch (err) {
            throw new InvalidConfigError('Parsing angular-cli.json failed. Please make sure your angular-cli.json'
                + ' is valid JSON. Error:\n' + err);
        }
        try {
            schema = JSON.parse(schemaContent);
            others = otherContents.map(function (otherContent) { return JSON.parse(otherContent); });
        }
        catch (err) {
            throw new InvalidConfigError("Parsing Angular CLI schema or other configuration files failed. Error:\n" + err);
        }
        return new CliConfig(configPath, schema, content, others);
    };
    return CliConfig;
}());
exports.CliConfig = CliConfig;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/models/config/config.js.map