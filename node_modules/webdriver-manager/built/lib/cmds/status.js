"use strict";
var fs = require('fs');
var minimist = require('minimist');
var path = require('path');
var cli_1 = require('../cli');
var config_1 = require('../config');
var files_1 = require('../files');
var Opt = require('./');
var opts_1 = require('./opts');
var logger = new cli_1.Logger('status');
var prog = new cli_1.Program()
    .command('status', 'list the current available drivers')
    .addOption(opts_1.Opts[Opt.OUT_DIR])
    .action(status);
exports.program = prog;
// stand alone runner
var argv = minimist(process.argv.slice(2), prog.getMinimistOptions());
if (argv._[0] === 'status-run') {
    prog.run(JSON.parse(JSON.stringify(argv)));
}
else if (argv._[0] === 'status-help') {
    prog.printHelp();
}
/**
 * Parses the options and logs the status of the binaries downloaded.
 * @param options
 */
function status(options) {
    var binaries = files_1.FileManager.setupBinaries();
    var outputDir = config_1.Config.getSeleniumDir();
    if (options[Opt.OUT_DIR].value) {
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
        logger.warn('the out_dir path ' + outputDir + ' does not exist');
        return;
    }
    var downloadedBinaries = files_1.FileManager.downloadedBinaries(outputDir);
    // log which binaries have been downloaded
    for (var bin in downloadedBinaries) {
        var downloaded = downloadedBinaries[bin];
        var log = downloaded.name + ' ';
        log += downloaded.versions.length == 1 ? 'version available: ' : 'versions available: ';
        for (var ver in downloaded.versions) {
            var version = downloaded.versions[ver];
            log += version;
            if (downloaded.binary.versionDefault() === version) {
                log += ' [default]';
            }
            if (+ver != downloaded.versions.length - 1) {
                log += ', ';
            }
        }
        logger.info(log);
    }
    // for binaries that are available for the operating system, show them here
    for (var bin in binaries) {
        if (downloadedBinaries[bin] == null) {
            logger.info(binaries[bin].name + ' is not present');
        }
    }
}
//# sourceMappingURL=status.js.map