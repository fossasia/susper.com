"use strict";
var childProcess = require('child_process');
var fs = require('fs');
var http = require('http');
var minimist = require('minimist');
var os = require('os');
var path = require('path');
var binaries_1 = require('../binaries');
var gecko_driver_1 = require('../binaries/gecko_driver');
var cli_1 = require('../cli');
var config_1 = require('../config');
var files_1 = require('../files');
var Opt = require('./');
var opts_1 = require('./opts');
var logger = new cli_1.Logger('start');
var prog = new cli_1.Program()
    .command('start', 'start up the selenium server')
    .action(start)
    .addOption(opts_1.Opts[Opt.OUT_DIR])
    .addOption(opts_1.Opts[Opt.SELENIUM_PORT])
    .addOption(opts_1.Opts[Opt.APPIUM_PORT])
    .addOption(opts_1.Opts[Opt.AVD_PORT])
    .addOption(opts_1.Opts[Opt.VERSIONS_STANDALONE])
    .addOption(opts_1.Opts[Opt.VERSIONS_CHROME])
    .addOption(opts_1.Opts[Opt.VERSIONS_ANDROID])
    .addOption(opts_1.Opts[Opt.VERSIONS_APPIUM])
    .addOption(opts_1.Opts[Opt.CHROME_LOGS])
    .addOption(opts_1.Opts[Opt.LOGGING])
    .addOption(opts_1.Opts[Opt.ANDROID])
    .addOption(opts_1.Opts[Opt.AVDS])
    .addOption(opts_1.Opts[Opt.AVD_USE_SNAPSHOTS]);
if (os.type() === 'Darwin') {
    prog.addOption(opts_1.Opts[Opt.IOS]);
}
if (os.type() === 'Windows_NT') {
    prog.addOption(opts_1.Opts[Opt.VERSIONS_IE])
        .addOption(opts_1.Opts[Opt.IE32])
        .addOption(opts_1.Opts[Opt.IE])
        .addOption(opts_1.Opts[Opt.EDGE]);
}
exports.program = prog;
// stand alone runner
var argv = minimist(process.argv.slice(2), prog.getMinimistOptions());
if (argv._[0] === 'start-run') {
    prog.run(JSON.parse(JSON.stringify(argv)));
}
else if (argv._[0] === 'start-help') {
    prog.printHelp();
}
/**
 * Parses the options and starts the selenium standalone server.
 * @param options
 */
function start(options) {
    var osType = os.type();
    var binaries = files_1.FileManager.setupBinaries();
    var seleniumPort = options[Opt.SELENIUM_PORT].getString();
    var outputDir = config_1.Config.getSeleniumDir();
    if (options[Opt.OUT_DIR].getString()) {
        if (path.isAbsolute(options[Opt.OUT_DIR].getString())) {
            outputDir = options[Opt.OUT_DIR].getString();
        }
        else {
            outputDir = path.resolve(config_1.Config.getBaseDir(), options[Opt.OUT_DIR].getString());
        }
    }
    try {
        // check if folder exists
        fs.statSync(outputDir).isDirectory();
    }
    catch (e) {
        // if the folder does not exist, quit early.
        logger.warn('the out_dir path ' + outputDir + ' does not exist, run webdriver-manager update');
        return;
    }
    var chromeLogs = null;
    var loggingFile = null;
    if (options[Opt.CHROME_LOGS].getString()) {
        if (path.isAbsolute(options[Opt.CHROME_LOGS].getString())) {
            chromeLogs = options[Opt.CHROME_LOGS].getString();
        }
        else {
            chromeLogs = path.resolve(config_1.Config.getBaseDir(), options[Opt.CHROME_LOGS].getString());
        }
    }
    binaries[binaries_1.StandAlone.id].versionCustom = options[Opt.VERSIONS_STANDALONE].getString();
    binaries[binaries_1.ChromeDriver.id].versionCustom = options[Opt.VERSIONS_CHROME].getString();
    if (options[Opt.VERSIONS_IE]) {
        binaries[binaries_1.IEDriver.id].versionCustom = options[Opt.VERSIONS_IE].getString();
    }
    binaries[binaries_1.AndroidSDK.id].versionCustom = options[Opt.VERSIONS_ANDROID].getString();
    binaries[binaries_1.Appium.id].versionCustom = options[Opt.VERSIONS_APPIUM].getString();
    var downloadedBinaries = files_1.FileManager.downloadedBinaries(outputDir);
    if (downloadedBinaries[binaries_1.StandAlone.id] == null) {
        logger.error('Selenium Standalone is not present. Install with ' +
            'webdriver-manager update --standalone');
        process.exit(1);
    }
    var args = [];
    if (osType === 'Linux') {
        // selenium server may take a long time to start because /dev/random is BLOCKING if there is not
        // enough entropy the solution is to use /dev/urandom, which is NON-BLOCKING (use /dev/./urandom
        // because of a java bug)
        // https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/1301
        // https://bugs.openjdk.java.net/browse/JDK-6202721
        args.push('-Djava.security.egd=file:///dev/./urandom');
    }
    if (options[Opt.LOGGING].getString()) {
        if (path.isAbsolute(options[Opt.LOGGING].getString())) {
            loggingFile = options[Opt.LOGGING].getString();
        }
        else {
            loggingFile = path.resolve(config_1.Config.getBaseDir(), options[Opt.LOGGING].getString());
        }
        args.push('-Djava.util.logging.config.file=' + loggingFile);
    }
    if (downloadedBinaries[binaries_1.ChromeDriver.id] != null) {
        args.push('-Dwebdriver.chrome.driver=' +
            path.join(outputDir, binaries[binaries_1.ChromeDriver.id].executableFilename(osType)));
        if (chromeLogs != null) {
            args.push('-Dwebdriver.chrome.logfile=' + chromeLogs);
        }
    }
    if (downloadedBinaries[gecko_driver_1.GeckoDriver.id] != null) {
        args.push('-Dwebdriver.gecko.driver=' +
            path.join(outputDir, binaries[gecko_driver_1.GeckoDriver.id].executableFilename(osType)));
    }
    if (downloadedBinaries[binaries_1.IEDriver.id] != null) {
        if (options[Opt.IE32]) {
            binaries[binaries_1.IEDriver.id].arch = 'Win32';
        }
        args.push('-Dwebdriver.ie.driver=' +
            path.join(outputDir, binaries[binaries_1.IEDriver.id].executableFilename(osType)));
    }
    if (options[Opt.EDGE]) {
        // validate that the file exists prior to adding it to args
        try {
            var edgeFile = options[Opt.EDGE].getString();
            if (fs.statSync(edgeFile).isFile()) {
                args.push('-Dwebdriver.edge.driver=' + options[Opt.EDGE].getString());
            }
        }
        catch (err) {
        }
    }
    if (options[Opt.ANDROID].getBoolean()) {
        if (downloadedBinaries[binaries_1.AndroidSDK.id] != null) {
            var avds = options[Opt.AVDS].getString();
            startAndroid(outputDir, binaries[binaries_1.AndroidSDK.id], avds.split(','), options[Opt.AVD_USE_SNAPSHOTS].getBoolean(), options[Opt.AVD_PORT].getString());
        }
        else {
            logger.warn('Not starting android because it is not installed');
        }
    }
    if (downloadedBinaries[binaries_1.Appium.id] != null) {
        startAppium(outputDir, binaries[binaries_1.Appium.id], options[Opt.APPIUM_PORT].getString());
    }
    // log the command to launch selenium server
    args.push('-jar');
    args.push(path.join(outputDir, binaries[binaries_1.StandAlone.id].filename()));
    // Add the port parameter, has to declared after the jar file
    if (seleniumPort) {
        args.push('-port', seleniumPort);
    }
    var argsToString = '';
    for (var arg in args) {
        argsToString += ' ' + args[arg];
    }
    logger.info('java' + argsToString);
    var seleniumProcess = spawnCommand('java', args);
    logger.info('seleniumProcess.pid: ' + seleniumProcess.pid);
    seleniumProcess.on('exit', function (code) {
        logger.info('Selenium Standalone has exited with code ' + code);
        killAndroid();
        killAppium();
        process.exit(code);
    });
    process.stdin.resume();
    process.stdin.on('data', function (chunk) {
        logger.info('Attempting to shut down selenium nicely');
        var port = seleniumPort || '4444';
        http.get('http://localhost:' + port + '/selenium-server/driver/?cmd=shutDownSeleniumServer');
        killAndroid();
        killAppium();
    });
    process.on('SIGINT', function () {
        logger.info('Staying alive until the Selenium Standalone process exits');
    });
}
function spawnCommand(command, args) {
    var osType = os.type();
    var windows = osType === 'Windows_NT';
    var winCommand = windows ? 'cmd' : command;
    var finalArgs = windows ? ['/c'].concat([command], args) : args;
    return childProcess.spawn(winCommand, finalArgs, { stdio: 'inherit' });
}
// Manage processes used in android emulation
var androidProcesses = [];
function startAndroid(outputDir, sdk, avds, useSnapshots, port) {
    var sdkPath = path.join(outputDir, sdk.executableFilename(os.type()));
    if (avds[0] == 'all') {
        avds = require(path.join(sdkPath, 'available_avds.json'));
    }
    else if (avds[0] == 'none') {
        avds.length = 0;
    }
    avds.forEach(function (avd, i) {
        logger.info('Booting up AVD ' + avd);
        // Credit to appium-ci, which this code was adapted from
        var emuBin = 'emulator'; // TODO(sjelin): get the 64bit linux version working
        var emuArgs = [
            '-avd',
            avd + '-v' + sdk.versionCustom + '-wd-manager',
            '-netfast',
        ];
        if (!useSnapshots) {
            emuArgs = emuArgs.concat(['-no-snapshot-load', '-no-snapshot-save']);
        }
        if (port) {
            emuArgs = emuArgs.concat(['-ports', (port + 2 * i) + ',' + (port + 2 * i + 1)]);
        }
        if (emuBin !== 'emulator') {
            emuArgs = emuArgs.concat(['-qemu', '-enable-kvm']);
        }
        androidProcesses.push(childProcess.spawn(path.join(sdkPath, 'tools', emuBin), emuArgs, { stdio: 'inherit' }));
    });
}
function killAndroid() {
    androidProcesses.forEach(function (androidProcess) {
        androidProcess.kill();
    });
    androidProcesses.length = 0;
}
// Manage appium process
var appiumProcess;
function startAppium(outputDir, binary, port) {
    logger.info('Starting appium server');
    appiumProcess = childProcess.spawn(path.join(outputDir, binary.filename(), 'node_modules', '.bin', 'appium'), port ? ['--port', port] : []);
}
function killAppium() {
    if (appiumProcess != null) {
        appiumProcess.kill();
        appiumProcess = null;
    }
}
//# sourceMappingURL=start.js.map