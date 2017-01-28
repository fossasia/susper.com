"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rimraf = require('rimraf');
var config_1 = require('../config');
var binary_1 = require('./binary');
/**
 * The appium binary.
 */
var Appium = (function (_super) {
    __extends(Appium, _super);
    function Appium(alternateCDN) {
        _super.call(this, alternateCDN || config_1.Config.cdnUrls().appium);
        this.name = 'appium';
        this.versionCustom = Appium.versionDefault;
        this.prefixDefault = 'appium-';
        this.suffixDefault = '';
    }
    Appium.prototype.id = function () {
        return Appium.id;
    };
    Appium.prototype.versionDefault = function () {
        return Appium.versionDefault;
    };
    Appium.prototype.executableSuffix = function () {
        return '';
    };
    Appium.prototype.remove = function (sdkPath) {
        rimraf.sync(sdkPath);
    };
    Appium.os = [binary_1.OS.Windows_NT, binary_1.OS.Linux, binary_1.OS.Darwin];
    Appium.id = 'appium';
    Appium.versionDefault = config_1.Config.binaryVersions().appium;
    Appium.isDefault = false;
    Appium.shortName = ['appium'];
    return Appium;
}(binary_1.Binary));
exports.Appium = Appium;
//# sourceMappingURL=appium.js.map