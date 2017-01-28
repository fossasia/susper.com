"use strict";
var AdmZip = require('adm-zip');
var child_process = require('child_process');
var fs = require('fs');
var minimist = require('minimist');
var os = require('os');
var path = require('path');
var q = require('q');
var rimraf = require('rimraf');
var binaries_1 = require('../binaries');
var cli_1 = require('../cli');
var config_1 = require('../config');
var files_1 = require('../files');
var Opt = require('./');
var initialize_1 = require('./initialize');
var opts_1 = require('./opts');
var logger = new cli_1.Logger('update');
var prog = new cli_1.Program()
    .command('update', 'install or update selected binaries')
    .action(update)
    .addOption(opts_1.Opts[Opt.OUT_DIR])
    .addOption(opts_1.Opts[Opt.IGNORE_SSL])
    .addOption(opts_1.Opts[Opt.PROXY])
    .addOption(opts_1.Opts[Opt.ALTERNATE_CDN])
    .addOption(opts_1.Opts[Opt.STANDALONE])
    .addOption(opts_1.Opts[Opt.CHROME])
    .addOption(opts_1.Opts[Opt.ANDROID])
    .addOption(opts_1.Opts[Opt.ANDROID_API_LEVELS])
    .addOption(opts_1.Opts[Opt.ANDROID_ABIS])
    .addOption(opts_1.Opts[Opt.ANDROID_ACCEPT_LICENSES]);
if (binaries_1.GeckoDriver.supports(os.type(), os.arch())) {
    prog.addOption(opts_1.Opts[Opt.VERSIONS_GECKO]).addOption(opts_1.Opts[Opt.GECKO]);
}
if (os.type() === 'Darwin') {
    prog.addOption(opts_1.Opts[Opt.IOS]);
}
if (os.type() === 'Windows_NT') {
    prog.addOption(opts_1.Opts[Opt.IE]).addOption(opts_1.Opts[Opt.IE32]);
}
prog.addOption(opts_1.Opts[Opt.VERSIONS_STANDALONE])
    .addOption(opts_1.Opts[Opt.VERSIONS_CHROME])
    .addOption(opts_1.Opts[Opt.VERSIONS_APPIUM])
    .addOption(opts_1.Opts[Opt.VERSIONS_ANDROID]);
if (os.type() === 'Windows_NT') {
    prog.addOption(opts_1.Opts[Opt.VERSIONS_IE]);
}
exports.program = prog;
// stand alone runner
var argv = minimist(process.argv.slice(2), prog.getMinimistOptions());
if (argv._[0] === 'update-run') {
    prog.run(JSON.parse(JSON.stringify(argv)));
}
else if (argv._[0] === 'update-help') {
    prog.printHelp();
}
/**
 * Parses the options and downloads binaries if they do not exist.
 * @param options
 */
function update(options) {
    var standalone = options[Opt.STANDALONE].getBoolean();
    var chrome = options[Opt.CHROME].getBoolean();
    var gecko = false;
    if (binaries_1.GeckoDriver.supports(os.type(), os.arch())) {
        gecko = options[Opt.GECKO].getBoolean();
    }
    var ie = false;
    var ie32 = false;
    if (options[Opt.IE]) {
        ie = options[Opt.IE].getBoolean();
    }
    if (options[Opt.IE32]) {
        ie32 = options[Opt.IE32].getBoolean();
    }
    var android = options[Opt.ANDROID].getBoolean();
    var ios = false;
    if (options[Opt.IOS]) {
        ios = options[Opt.IOS].getBoolean();
    }
    var outputDir = config_1.Config.getSeleniumDir();
    var android_api_levels = options[Opt.ANDROID_API_LEVELS].getString().split(',');
    var android_abis = options[Opt.ANDROID_ABIS].getString().split(',');
    var android_accept_licenses = options[Opt.ANDROID_ACCEPT_LICENSES].getBoolean();
    if (options[Opt.OUT_DIR].getString()) {
        if (path.isAbsolute(options[Opt.OUT_DIR].getString())) {
            outputDir = options[Opt.OUT_DIR].getString();
        }
        else {
            outputDir = path.resolve(config_1.Config.getBaseDir(), options[Opt.OUT_DIR].getString());
        }
        files_1.FileManager.makeOutputDirectory(outputDir);
    }
    var ignoreSSL = options[Opt.IGNORE_SSL].getBoolean();
    var proxy = options[Opt.PROXY].getString();
    // setup versions for binaries
    var binaries = files_1.FileManager.setupBinaries(options[Opt.ALTERNATE_CDN].getString());
    binaries[binaries_1.StandAlone.id].versionCustom = options[Opt.VERSIONS_STANDALONE].getString();
    binaries[binaries_1.ChromeDriver.id].versionCustom = options[Opt.VERSIONS_CHROME].getString();
    if (options[Opt.VERSIONS_IE]) {
        binaries[binaries_1.IEDriver.id].versionCustom = options[Opt.VERSIONS_IE].getString();
    }
    if (options[Opt.VERSIONS_GECKO]) {
        binaries[binaries_1.GeckoDriver.id].versionCustom = options[Opt.VERSIONS_GECKO].getString();
    }
    binaries[binaries_1.AndroidSDK.id].versionCustom = options[Opt.VERSIONS_ANDROID].getString();
    binaries[binaries_1.Appium.id].versionCustom = options[Opt.VERSIONS_APPIUM].getString();
    // if the file has not been completely downloaded, download it
    // else if the file has already been downloaded, unzip the file, rename it, and give it
    // permissions
    if (standalone) {
        var binary_1 = binaries[binaries_1.StandAlone.id];
        files_1.FileManager.toDownload(binary_1, outputDir, proxy, ignoreSSL).then(function (value) {
            if (value) {
                files_1.Downloader.downloadBinary(binary_1, outputDir, proxy, ignoreSSL);
            }
            else {
                logger.info(binary_1.name + ': file exists ' +
                    path.resolve(outputDir, binary_1.filename(os.type(), os.arch())));
                logger.info(binary_1.name + ': v' + binary_1.versionCustom + ' up to date');
            }
        });
    }
    if (chrome) {
        var binary = binaries[binaries_1.ChromeDriver.id];
        updateBinary(binary, outputDir, proxy, ignoreSSL);
    }
    if (gecko) {
        var binary = binaries[binaries_1.GeckoDriver.id];
        updateBinary(binary, outputDir, proxy, ignoreSSL);
    }
    if (ie) {
        var binary = binaries[binaries_1.IEDriver.id];
        binary.arch = os.arch(); // Win32 or x64
        updateBinary(binary, outputDir, proxy, ignoreSSL);
    }
    if (ie32) {
        var binary = binaries[binaries_1.IEDriver.id];
        binary.arch = 'Win32';
        updateBinary(binary, outputDir, proxy, ignoreSSL);
    }
    if (android) {
        var binary_2 = binaries[binaries_1.AndroidSDK.id];
        var sdk_path = path.join(outputDir, binary_2.executableFilename(os.type()));
        updateBinary(binary_2, outputDir, proxy, ignoreSSL).then(function () {
            initialize_1.android(path.join(outputDir, binary_2.executableFilename(os.type())), android_api_levels, android_abis, android_accept_licenses, binaries[binaries_1.AndroidSDK.id].versionCustom, logger);
        });
    }
    if (ios) {
        initialize_1.iOS(logger);
    }
    if (android || ios) {
        installAppium(binaries[binaries_1.Appium.id], outputDir);
    }
}
function updateBinary(binary, outputDir, proxy, ignoreSSL) {
    return files_1.FileManager.toDownload(binary, outputDir, proxy, ignoreSSL).then(function (value) {
        if (value) {
            var deferred_1 = q.defer();
            files_1.Downloader.downloadBinary(binary, outputDir, proxy, ignoreSSL, function (binary, outputDir, fileName) {
                unzip(binary, outputDir, fileName);
                deferred_1.resolve();
            });
            return deferred_1.promise;
        }
        else {
            logger.info(binary.name + ': file exists ' +
                path.resolve(outputDir, binary.filename(os.type(), os.arch())));
            var fileName = binary.filename(os.type(), os.arch());
            unzip(binary, outputDir, fileName);
            logger.info(binary.name + ': v' + binary.versionCustom + ' up to date');
        }
    });
}
function unzip(binary, outputDir, fileName) {
    // remove the previously saved file and unzip it
    var osType = os.type();
    var mv = path.join(outputDir, binary.executableFilename(osType));
    try {
        fs.unlinkSync(mv);
    }
    catch (err) {
        try {
            rimraf.sync(mv);
        }
        catch (err2) {
        }
    }
    // unzip the file
    logger.info(binary.name + ': unzipping ' + fileName);
    if (fileName.slice(-4) == '.zip') {
        var zip = new AdmZip(path.resolve(outputDir, fileName));
        zip.extractAllTo(outputDir, true);
    }
    else {
        // We will only ever get .tar files on linux
        child_process.spawnSync('tar', ['zxvf', path.resolve(outputDir, fileName), '-C', outputDir]);
    }
    // rename
    fs.renameSync(path.join(outputDir, binary.zipContentName(osType)), mv);
    // set permissions
    if (osType !== 'Windows_NT') {
        logger.info(binary.name + ': setting permissions to 0755 for ' + mv);
        if (binary.id() !== binaries_1.AndroidSDK.id) {
            fs.chmodSync(mv, '0755');
        }
        else {
            fs.chmodSync(path.join(mv, 'tools', 'android'), '0755');
            fs.chmodSync(path.join(mv, 'tools', 'emulator'), '0755');
        }
    }
}
function installAppium(binary, outputDir) {
    logger.info('appium: installing appium');
    var folder = path.join(outputDir, binary.filename());
    try {
        rimraf.sync(folder);
    }
    catch (err) {
    }
    fs.mkdirSync(folder);
    fs.writeFileSync(path.join(folder, 'package.json'), '{}');
    child_process.spawn('npm', ['install', 'appium@' + binary.version()], { cwd: folder });
}
//# sourceMappingURL=update.js.map