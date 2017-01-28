"use strict";
/**
 * The Cli contains the usage and the collection of programs.
 *
 * Printing help for all the programs in the following order:
 * usage, commands, and options. If the options are used in multiple programs,
 * it will list it once.
 */
var Cli = (function () {
    function Cli() {
        this.programs = {};
    }
    /**
     * Register a program to the command line interface.
     * @returns The cli for method chaining.
     */
    Cli.prototype.program = function (prog) {
        this.programs[prog.cmd] = prog;
        return this;
    };
    /**
     * Add a usage for the command line interface.
     * @returns The cli for method chaining.
     */
    Cli.prototype.usage = function (usageText) {
        this.usageText = usageText;
        return this;
    };
    /**
     * Prints help for the programs registered to the cli.
     */
    Cli.prototype.printHelp = function () {
        console.log('Usage: ' + this.usageText);
        console.log('\nCommands:');
        var cmdDescriptionPos = this.posCmdDescription();
        for (var cmd in this.programs) {
            var prog = this.programs[cmd];
            prog.printCmd(cmdDescriptionPos);
        }
        var descriptionPos = this.posDescription();
        var defaultPos = this.posDefault();
        var extOptions = {};
        console.log('\nOptions:');
        // print all options
        for (var cmd in this.programs) {
            var prog = this.programs[cmd];
            prog.printOptions(descriptionPos, defaultPos, extOptions);
        }
    };
    /**
     * For commands, gets the position where the description should start so they
     * are aligned.
     * @returns The position where the command description should start.
     */
    Cli.prototype.posCmdDescription = function () {
        var position = -1;
        for (var cmd in this.programs) {
            position = Math.max(position, cmd.length + 6);
        }
        return position;
    };
    /**
     * For options, gets the position where the description should start so they
     * are aligned.
     * @returns The position where the option description should start.
     */
    Cli.prototype.posDescription = function () {
        var position = -1;
        for (var cmd in this.programs) {
            var prog = this.programs[cmd];
            position = Math.max(position, prog.posDescription());
        }
        return position;
    };
    /**
     * For options, get the position where the default values should start so they
     * are aligned.
     * @returns The position where the option default values should start.
     */
    Cli.prototype.posDefault = function () {
        var position = -1;
        for (var cmd in this.programs) {
            var prog = this.programs[cmd];
            position = Math.max(position, prog.posDefault());
        }
        return position;
    };
    /**
     * Go through all programs and add options to the collection.
     * @returns The options used in the programs.
     */
    Cli.prototype.getOptions = function () {
        var allOptions = {};
        for (var cmd in this.programs) {
            var prog = this.programs[cmd];
            allOptions = prog.getOptions_(allOptions);
        }
        return allOptions;
    };
    /**
     * Get the options used by the programs and create the minimist options
     * to ensure that minimist parses the values properly.
     * @returns The options for minimist.
     */
    Cli.prototype.getMinimistOptions = function () {
        var allOptions = this.getOptions();
        var minimistOptions = {};
        var minimistBoolean = [];
        var minimistString = [];
        var minimistNumber = [];
        for (var opt in allOptions) {
            var option = allOptions[opt];
            if (option.type === 'boolean') {
                minimistBoolean.push(option.opt);
            }
            else if (option.type === 'string') {
                minimistString.push(option.opt);
            }
            else if (option.type === 'number') {
                minimistNumber.push(option.opt);
            }
        }
        minimistOptions['boolean'] = minimistBoolean;
        minimistOptions['string'] = minimistString;
        minimistOptions['number'] = minimistNumber;
        return minimistOptions;
    };
    return Cli;
}());
exports.Cli = Cli;
//# sourceMappingURL=cli.js.map