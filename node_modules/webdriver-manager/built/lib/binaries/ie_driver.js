"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var os = require('os');
var config_1 = require('../config');
var binary_1 = require('./binary');
/**
 * The internet explorer binary.
 */
var IEDriver = (function (_super) {
    __extends(IEDriver, _super);
    function IEDriver(alternateCDN) {
        _super.call(this, alternateCDN || config_1.Config.cdnUrls().ie);
        this.name = 'IEDriverServer';
        this.versionCustom = IEDriver.versionDefault;
        this.prefixDefault = 'IEDriverServer';
        this.suffixDefault = '.zip';
        this.arch = os.arch();
    }
    IEDriver.prototype.id = function () {
        return IEDriver.id;
    };
    IEDriver.prototype.versionDefault = function () {
        return IEDriver.versionDefault;
    };
    IEDriver.prototype.version = function () {
        if (os.type() == 'Windows_NT') {
            if (this.arch == 'x64') {
                return '_x64_' + this.versionCustom;
            }
            else {
                return '_Win32_' + this.versionCustom;
            }
        }
        return '';
    };
    IEDriver.prototype.url = function () {
        var urlBase = this.cdn + this.shortVersion(this.versionCustom) + '/';
        var filename = this.prefix() + this.version() + this.suffix();
        return urlBase + filename;
    };
    IEDriver.os = [binary_1.OS.Windows_NT];
    IEDriver.id = 'ie';
    IEDriver.versionDefault = config_1.Config.binaryVersions().ie;
    IEDriver.isDefault = false;
    IEDriver.shortName = ['ie', 'ie32'];
    return IEDriver;
}(binary_1.Binary));
exports.IEDriver = IEDriver;
//# sourceMappingURL=ie_driver.js.map