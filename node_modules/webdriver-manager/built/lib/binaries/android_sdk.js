"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var child_process = require('child_process');
var path = require('path');
var rimraf = require('rimraf');
var config_1 = require('../config');
var binary_1 = require('./binary');
/**
 * The android sdk binary.
 */
var AndroidSDK = (function (_super) {
    __extends(AndroidSDK, _super);
    function AndroidSDK(alternateCDN) {
        _super.call(this, alternateCDN || config_1.Config.cdnUrls().android);
        this.name = 'android-sdk';
        this.versionCustom = AndroidSDK.versionDefault;
        this.prefixDefault = 'android-sdk_r';
        this.suffixDefault = '.zip';
    }
    AndroidSDK.prototype.id = function () {
        return AndroidSDK.id;
    };
    AndroidSDK.prototype.versionDefault = function () {
        return AndroidSDK.versionDefault;
    };
    AndroidSDK.prototype.suffix = function (ostype) {
        if (ostype === 'Darwin') {
            return '-macosx' + this.suffixDefault;
        }
        else if (ostype === 'Linux') {
            return '-linux.tgz';
        }
        else if (ostype === 'Windows_NT') {
            return '-windows' + this.suffixDefault;
        }
    };
    AndroidSDK.prototype.url = function (ostype) {
        return this.cdn + this.filename(ostype);
    };
    AndroidSDK.prototype.zipContentName = function (ostype) {
        if (ostype === 'Darwin') {
            return this.name + '-macosx';
        }
        else if (ostype === 'Linux') {
            return this.name + '-linux';
        }
        else if (ostype === 'Windows_NT') {
            return this.name + '-windows';
        }
    };
    AndroidSDK.prototype.executableSuffix = function () {
        return '';
    };
    AndroidSDK.prototype.remove = function (sdkPath) {
        try {
            var avds = require(path.join(sdkPath, 'available_avds.json'));
            var version_1 = path.basename(sdkPath).slice(this.prefixDefault.length);
            avds.forEach(function (avd) {
                child_process.spawnSync(path.join(sdkPath, 'tools', 'android'), ['delete', 'avd', '-n', avd + '-v' + version_1 + '-wd-manager']);
            });
        }
        catch (e) {
        }
        rimraf.sync(sdkPath);
    };
    AndroidSDK.os = [binary_1.OS.Windows_NT, binary_1.OS.Linux, binary_1.OS.Darwin];
    AndroidSDK.id = 'android';
    AndroidSDK.versionDefault = config_1.Config.binaryVersions().android;
    AndroidSDK.isDefault = false;
    AndroidSDK.shortName = ['android'];
    AndroidSDK.DEFAULT_API_LEVELS = '24';
    AndroidSDK.DEFAULT_ABIS = 'x86_64';
    return AndroidSDK;
}(binary_1.Binary));
exports.AndroidSDK = AndroidSDK;
//# sourceMappingURL=android_sdk.js.map