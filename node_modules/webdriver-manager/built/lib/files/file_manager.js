"use strict";
var fs = require('fs');
var os = require('os');
var path = require('path');
var q = require('q');
var binaries_1 = require('../binaries');
var downloaded_binary_1 = require('./downloaded_binary');
var downloader_1 = require('./downloader');
var cli_1 = require('../cli');
var gecko_driver_1 = require('../binaries/gecko_driver');
var logger = new cli_1.Logger('file_manager');
/**
 * The File Manager class is where the webdriver manager will compile a list of
 * binaries that could be downloaded and get a list of previously downloaded
 * file versions.
 */
var FileManager = (function () {
    function FileManager() {
    }
    /**
     * Create a directory if it does not exist.
     * @param outputDir The directory to create.
     */
    FileManager.makeOutputDirectory = function (outputDir) {
        try {
            fs.statSync(outputDir);
        }
        catch (e) {
            logger.info('creating folder ' + outputDir);
            fs.mkdirSync(outputDir);
        }
    };
    /**
     * For the operating system, check against the list of operating systems that the
     * binary is available for.
     * @param osType The operating system.
     * @param binary The class type to have access to the static properties.
     * @returns If the binary is available for the operating system.
     */
    FileManager.checkOS_ = function (osType, binary) {
        for (var os_1 in binary.os) {
            if (binaries_1.OS[os_1] == osType) {
                return true;
            }
        }
        return false;
    };
    /**
     * For the operating system, create a list that includes the binaries
     * for selenium standalone, chrome, and internet explorer.
     * @param osType The operating system.
     * @param alternateCDN URL of the alternative CDN to be used instead of the default ones.
     * @returns A binary map that are available for the operating system.
     */
    FileManager.compileBinaries_ = function (osType, alternateCDN) {
        var binaries = {};
        if (FileManager.checkOS_(osType, binaries_1.StandAlone)) {
            binaries[binaries_1.StandAlone.id] = new binaries_1.StandAlone(alternateCDN);
        }
        if (FileManager.checkOS_(osType, binaries_1.ChromeDriver)) {
            binaries[binaries_1.ChromeDriver.id] = new binaries_1.ChromeDriver(alternateCDN);
        }
        if (FileManager.checkOS_(osType, gecko_driver_1.GeckoDriver)) {
            binaries[gecko_driver_1.GeckoDriver.id] = new gecko_driver_1.GeckoDriver(alternateCDN);
        }
        if (FileManager.checkOS_(osType, binaries_1.IEDriver)) {
            binaries[binaries_1.IEDriver.id] = new binaries_1.IEDriver(alternateCDN);
        }
        if (FileManager.checkOS_(osType, binaries_1.AndroidSDK)) {
            binaries[binaries_1.AndroidSDK.id] = new binaries_1.AndroidSDK(alternateCDN);
        }
        if (FileManager.checkOS_(osType, binaries_1.Appium)) {
            binaries[binaries_1.Appium.id] = new binaries_1.Appium(alternateCDN);
        }
        return binaries;
    };
    /**
     * Look up the operating system and compile a list of binaries that are available
     * for the system.
     * @param alternateCDN URL of the alternative CDN to be used instead of the default ones.
     * @returns A binary map that is available for the operating system.
     */
    FileManager.setupBinaries = function (alternateCDN) {
        return FileManager.compileBinaries_(os.type(), alternateCDN);
    };
    /**
     * Get the list of existing files from the output directory
     * @param outputDir The directory where binaries are saved
     * @returns A list of existing files.
     */
    FileManager.getExistingFiles = function (outputDir) {
        try {
            return fs.readdirSync(outputDir);
        }
        catch (e) {
            return [];
        }
    };
    /**
     * For the binary, operating system, and system architecture, look through
     * the existing files and the downloaded binary
     * @param binary The binary of interest
     * @param osType The operating system.
     * @param existingFiles A list of existing files.
     * @returns The downloaded binary with all the versions found.
     */
    FileManager.downloadedVersions_ = function (binary, osType, arch, existingFiles) {
        var versions = [];
        for (var existPos in existingFiles) {
            var existFile = existingFiles[existPos];
            // use only files that have a prefix and suffix that we care about
            if (existFile.indexOf(binary.prefix()) === 0) {
                var editExistFile = existFile.replace(binary.prefix(), '');
                // if the suffix matches the executable suffix, add it
                if (binary.suffix(osType, arch) === binary.executableSuffix(osType)) {
                    versions.push(editExistFile.replace(binary.suffix(osType, arch), ''));
                }
                else if (existFile.indexOf(binary.suffix(osType, arch)) === -1) {
                    editExistFile = editExistFile.replace(binary.executableSuffix(osType), '');
                    editExistFile = editExistFile.indexOf('_') === 0 ?
                        editExistFile.substring(1, editExistFile.length) :
                        editExistFile;
                    versions.push(editExistFile);
                }
            }
        }
        if (versions.length === 0) {
            return null;
        }
        var downloadedBinary = new downloaded_binary_1.DownloadedBinary(binary);
        downloadedBinary.versions = versions;
        return downloadedBinary;
    };
    /**
     * Finds all the downloaded binary versions stored in the output directory.
     * @param outputDir The directory where files are downloaded and stored.
     * @returns An dictionary map of all the downloaded binaries found in the output folder.
     */
    FileManager.downloadedBinaries = function (outputDir) {
        var ostype = os.type();
        var arch = os.arch();
        var binaries = FileManager.setupBinaries();
        var existingFiles = FileManager.getExistingFiles(outputDir);
        var downloaded = {};
        for (var bin in binaries) {
            var binary = FileManager.downloadedVersions_(binaries[bin], ostype, arch, existingFiles);
            if (binary != null) {
                downloaded[binary.id()] = binary;
            }
        }
        return downloaded;
    };
    /**
     * Check to see if the binary version should be downloaded.
     * @param binary The binary of interest.
     * @param outputDir The directory where files are downloaded and stored.
     * @returns If the file should be downloaded.
     */
    FileManager.toDownload = function (binary, outputDir, proxy, ignoreSSL) {
        var osType = os.type();
        var osArch = os.arch();
        var filePath;
        var readData;
        var deferred = q.defer();
        var downloaded = FileManager.downloadedBinaries(outputDir);
        if (downloaded[binary.id()]) {
            var downloadedBinary = downloaded[binary.id()];
            var versions = downloadedBinary.versions;
            var version = binary.version();
            for (var index in versions) {
                var v = versions[index];
                if (v === version) {
                    filePath = path.resolve(outputDir, binary.filename(osType, osArch));
                    readData = fs.readFileSync(filePath);
                    // we have the version, verify it is the correct file size
                    var contentLength = downloader_1.Downloader.httpHeadContentLength(binary.url(osType, osArch), proxy, ignoreSSL);
                    return contentLength.then(function (value) {
                        if (value == readData.length) {
                            return false;
                        }
                        else {
                            logger.warn(path.basename(filePath) + ' expected length ' + value + ', found ' +
                                readData.length);
                            logger.warn('removing file: ' + filePath);
                            return true;
                        }
                    });
                }
            }
        }
        deferred.resolve(true);
        return deferred.promise;
    };
    /**
     * Removes the existing files found in the output directory that match the
     * binary prefix names.
     * @param outputDir The directory where files are downloaded and stored.
     */
    FileManager.removeExistingFiles = function (outputDir) {
        try {
            fs.statSync(outputDir);
        }
        catch (e) {
            logger.warn('path does not exist ' + outputDir);
            return;
        }
        var existingFiles = FileManager.getExistingFiles(outputDir);
        if (existingFiles.length === 0) {
            logger.warn('no files found in path ' + outputDir);
            return;
        }
        var binaries = FileManager.setupBinaries();
        existingFiles.forEach(function (file) {
            for (var binPos in binaries) {
                var bin = binaries[binPos];
                if (file.indexOf(bin.prefix()) !== -1) {
                    bin.remove(path.join(outputDir, file));
                    logger.info('removed ' + file);
                }
            }
        });
    };
    return FileManager;
}());
exports.FileManager = FileManager;
//# sourceMappingURL=file_manager.js.map