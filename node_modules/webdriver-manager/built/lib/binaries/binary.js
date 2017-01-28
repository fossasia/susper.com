"use strict";
var fs = require('fs');
/**
 * operating system enum
 */
(function (OS) {
    OS[OS["Windows_NT"] = 0] = "Windows_NT";
    OS[OS["Linux"] = 1] = "Linux";
    OS[OS["Darwin"] = 2] = "Darwin";
})(exports.OS || (exports.OS = {}));
var OS = exports.OS;
/**
 * The binary object base class
 */
var Binary = (function () {
    function Binary(cdn) {
        this.cdn = cdn;
    }
    /**
     * @param ostype The operating system.
     * @returns The executable file type.
     */
    Binary.prototype.executableSuffix = function (ostype) {
        if (ostype == 'Windows_NT') {
            return '.exe';
        }
        else {
            return '';
        }
    };
    /**
     * @param ostype The operating system.
     * @returns The file name for the executable.
     */
    Binary.prototype.executableFilename = function (ostype) {
        return this.prefix() + this.version() + this.executableSuffix(ostype);
    };
    Binary.prototype.prefix = function () {
        return this.prefixDefault;
    };
    Binary.prototype.version = function () {
        return this.versionCustom;
    };
    Binary.prototype.suffix = function (ostype, arch) {
        return this.suffixDefault;
    };
    Binary.prototype.filename = function (ostype, arch) {
        return this.prefix() + this.version() + this.suffix(ostype, arch);
    };
    /**
     * @param ostype The operating system.
     * @returns The file name for the file inside the downloaded zip file
     */
    Binary.prototype.zipContentName = function (ostype) {
        return this.name + this.executableSuffix(ostype);
    };
    Binary.prototype.shortVersion = function (version) {
        return version.slice(0, version.lastIndexOf('.'));
    };
    /**
     * A base class method that should be overridden.
     */
    Binary.prototype.id = function () {
        return 'not implemented';
    };
    /**
     * A base class method that should be overridden.
     */
    Binary.prototype.versionDefault = function () {
        return 'not implemented';
    };
    /**
     * A base class method that should be overridden.
     */
    Binary.prototype.url = function (ostype, arch) {
        return 'not implemented';
    };
    /**
     * Delete an instance of this binary from the file system
     */
    Binary.prototype.remove = function (filename) {
        fs.unlinkSync(filename);
    };
    return Binary;
}());
exports.Binary = Binary;
//# sourceMappingURL=binary.js.map