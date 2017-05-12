"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var config_1 = require('../config');
var binary_1 = require('./binary');
/**
 * The gecko driver binary.
 */
var GeckoDriver = (function (_super) {
    __extends(GeckoDriver, _super);
    function GeckoDriver(alternateCDN) {
        _super.call(this, alternateCDN || config_1.Config.cdnUrls().gecko);
        this.name = 'geckodriver';
        this.versionCustom = GeckoDriver.versionDefault;
        this.prefixDefault = 'geckodriver-';
    }
    GeckoDriver.prototype.id = function () {
        return GeckoDriver.id;
    };
    GeckoDriver.prototype.versionDefault = function () {
        return GeckoDriver.versionDefault;
    };
    GeckoDriver.prototype.suffix = function (ostype, arch) {
        if (!GeckoDriver.supports(ostype, arch)) {
            throw new Error('GeckoDriver doesn\'t support ${ostype} ${arch}!');
        }
        return GeckoDriver.suffixes[ostype];
    };
    GeckoDriver.supports = function (ostype, arch) {
        return arch == 'x64' && (ostype in GeckoDriver.suffixes);
    };
    GeckoDriver.prototype.url = function (ostype, arch) {
        var urlBase = this.cdn + this.version() + '/';
        var filename = this.prefix() + this.version() + this.suffix(ostype, arch);
        return urlBase + filename;
    };
    GeckoDriver.os = [binary_1.OS.Windows_NT, binary_1.OS.Linux, binary_1.OS.Darwin];
    GeckoDriver.id = 'gecko';
    GeckoDriver.versionDefault = config_1.Config.binaryVersions().gecko;
    GeckoDriver.isDefault = true;
    GeckoDriver.shortName = ['gecko'];
    GeckoDriver.suffixes = {
        'Darwin': '-mac.tar.gz',
        'Linux': '-linux64.tar.gz',
        'Windows_NT': '-win64.zip'
    };
    return GeckoDriver;
}(binary_1.Binary));
exports.GeckoDriver = GeckoDriver;
//# sourceMappingURL=gecko_driver.js.map