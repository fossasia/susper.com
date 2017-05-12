"use strict";
var minimist = require('minimist');
var cli_1 = require('./cli');
var clean = require('./cmds/clean');
var start = require('./cmds/start');
var status = require('./cmds/status');
var update = require('./cmds/update');
var commandline = new cli_1.Cli()
    .usage('webdriver-manager <command> [options]')
    .program(clean.program)
    .program(start.program)
    .program(status.program)
    .program(update.program);
var minimistOptions = commandline.getMinimistOptions();
var argv = minimist(process.argv.slice(2), minimistOptions);
var cmd = argv._;
if (commandline.programs[cmd[0]]) {
    if (cmd[0] === 'help') {
        commandline.printHelp();
    }
    else if (cmd[1] === 'help' || argv['help'] || argv['h']) {
        commandline.programs[cmd[0]].printHelp();
    }
    else {
        commandline.programs[cmd[0]].run(JSON.parse(JSON.stringify(argv)));
    }
}
else {
    commandline.printHelp();
}
exports.cli = commandline;
//# sourceMappingURL=webdriver.js.map