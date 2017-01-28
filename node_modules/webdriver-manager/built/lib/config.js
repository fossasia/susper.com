"use strict";
var path = require('path');
var cli_1 = require('./cli');
var logger = new cli_1.Logger('config');
/**
 * The configuration for webdriver-manager
 *
 * The config.json, package.json, and selenium directory are found in the
 * same location at the root directory in webdriver-manager.
 *
 */
var Config = (function () {
    function Config() {
    }
    Config.getConfigFile_ = function () {
        return path.resolve(Config.dir, '..', Config.configFile);
    };
    Config.getPackageFile_ = function () {
        return path.resolve(Config.dir, '..', Config.packageFile);
    };
    Config.getSeleniumDir = function () {
        return path.resolve(Config.dir, '..', '..', 'selenium/');
    };
    Config.getBaseDir = function () {
        return path.resolve(Config.dir, '..', '..');
    };
    /**
     * Get the binary versions from the configuration file.
     * @returns A map of the versions defined in the configuration file.
     */
    Config.binaryVersions = function () {
        var configFile = require(Config.getConfigFile_());
        var configVersions = {};
        configVersions.selenium = configFile.webdriverVersions.selenium;
        configVersions.chrome = configFile.webdriverVersions.chromedriver;
        configVersions.gecko = configFile.webdriverVersions.geckodriver;
        configVersions.ie = configFile.webdriverVersions.iedriver;
        configVersions.android = configFile.webdriverVersions.androidsdk;
        configVersions.appium = configFile.webdriverVersions.appium;
        return configVersions;
    };
    /**
     * Get the CDN urls from the configuration file.
     * @returns A map of the CDN versions defined in the configuration file.
     */
    Config.cdnUrls = function () {
        var configFile = require(Config.getConfigFile_());
        var configCdnUrls = {};
        configCdnUrls.selenium = configFile.cdnUrls.selenium;
        configCdnUrls.chrome = configFile.cdnUrls.chromedriver;
        configCdnUrls.gecko = configFile.cdnUrls.geckodriver;
        configCdnUrls.ie = configFile.cdnUrls.iedriver;
        configCdnUrls.android = configFile.cdnUrls.androidsdk;
        return configCdnUrls;
    };
    /**
     * Get the package version.
     */
    Config.getVersion = function () {
        var packageFile = require(Config.getPackageFile_());
        return packageFile.version;
    };
    Config.configFile = 'config.json';
    Config.packageFile = 'package.json';
    Config.nodeModuleName = 'webdriver-manager';
    Config.cwd = process.cwd();
    Config.parentPath = path.resolve(Config.cwd, '..');
    Config.dir = __dirname;
    Config.folder = Config.cwd.replace(Config.parentPath, '').substring(1);
    Config.isProjectVersion = Config.folder === Config.nodeModuleName;
    Config.isLocalVersion = false;
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.js.map