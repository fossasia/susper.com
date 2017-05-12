"use strict";
var options_1 = require('./options');
/**
 * A program has a command, a description, options, and a run method
 */
var Program = (function () {
    function Program() {
        this.options = {};
    }
    /**
     * Register a command and the description.
     * @param cmd The command.
     * @param cmdDescription The description of the command.
     * @returns The program for method chaining.
     */
    Program.prototype.command = function (cmd, cmdDescription) {
        this.cmd = cmd;
        this.cmdDescription = cmdDescription;
        return this;
    };
    /**
     * Register a new option.
     * @param opt The option.
     * @param description The description of the option.
     * @param type The type of value expected: boolean, number, or string
     * @param defaultValue The option's default value.
     * @returns The program for method chaining.
     */
    Program.prototype.option = function (opt, description, type, opt_defaultValue) {
        this.options[opt] = new options_1.Option(opt, description, type, opt_defaultValue);
        return this;
    };
    /**
     * Adds an option to the program.
     * @param option The option.
     * @returns The program for method chaining.
     */
    Program.prototype.addOption = function (option) {
        this.options[option.opt] = option;
        return this;
    };
    /**
     * Registers a method that will be used to run the program.
     * @param runMethod The method that will be used to run the program.
     * @returns The program for method chaining.
     */
    Program.prototype.action = function (runMethod) {
        this.runMethod = runMethod;
        return this;
    };
    /**
     * Adds the value to the options and passes the updated options to the run
     * method.
     * @param args The arguments that will be parsed to run the method.
     */
    Program.prototype.run = function (json) {
        for (var opt in this.options) {
            this.options[opt].value = this.getValue_(opt, json);
        }
        this.runMethod(this.options);
    };
    Program.prototype.getValue_ = function (key, json) {
        var keyList = key.split('.');
        var tempJson = json;
        while (keyList.length > 0) {
            var keyItem = keyList[0];
            if (tempJson[keyItem]) {
                tempJson = tempJson[keyItem];
                keyList = keyList.slice(1);
            }
            else {
                return undefined;
            }
        }
        return tempJson.toString();
    };
    /**
     * Prints the command with the description. The description will have spaces
     * between the cmd so that the starting position is "posDescription". If the
     * gap between the cmd and the description is less than MIN_SPACING or
     * posDescription is undefined, the spacing will be MIN_SPACING.
     *
     * @param opt_postDescription Starting position of the description.
     */
    Program.prototype.printCmd = function (opt_posDescription) {
        var log = '  ' + this.cmd;
        var spacing = Program.MIN_SPACING;
        if (opt_posDescription) {
            var diff = opt_posDescription - log.length;
            if (diff < Program.MIN_SPACING) {
                spacing = Program.MIN_SPACING;
            }
            else {
                spacing = diff;
            }
        }
        log += Array(spacing).join(' ') + this.cmdDescription;
        console.log(log);
    };
    /**
     * Prints the options with the option descriptions and default values.
     * The posDescription and posDefault is the starting position for the option
     * description. If extOptions are provided, check to see if we have already
     * printed those options. Also, once we print the option, add them to the extOptions.
     *
     * @param posDescription Position to start logging the description.
     * @param posDefault Position to start logging the default value.
     * @param opt_extOptions A collection of options that will be updated.
     */
    Program.prototype.printOptions = function (posDescription, posDefault, opt_extOptions) {
        for (var opt in this.options) {
            // we have already logged it
            if (opt_extOptions && opt_extOptions[opt]) {
                continue;
            }
            var option = this.options[opt];
            var log = '  --' + option.opt;
            var spacing = Program.MIN_SPACING;
            // description
            var diff = posDescription - log.length;
            if (diff < Program.MIN_SPACING) {
                spacing = Program.MIN_SPACING;
            }
            else {
                spacing = diff;
            }
            log += Array(spacing).join(' ') + option.description;
            // default value
            if (option.defaultValue) {
                spacing = Program.MIN_SPACING;
                var diff_1 = posDefault - log.length - 1;
                if (diff_1 <= Program.MIN_SPACING) {
                    spacing = Program.MIN_SPACING;
                }
                else {
                    spacing = diff_1;
                }
                log += Array(spacing).join(' ');
                log += '[default: ' + option.defaultValue + ']';
            }
            console.log(log);
            if (opt_extOptions) {
                opt_extOptions[option.opt] = option;
            }
        }
    };
    /**
     * Assuming that the this program can run by itself, to print out the program's
     * help. Also assuming that the commands are called cmd-run and cmd-help.
     */
    Program.prototype.printHelp = function () {
        console.log('\n' +
            'Usage:        ' + this.cmd + ' [options]\n' +
            '              ' + this.cmd + ' help\n' +
            'Description:  ' + this.cmdDescription + '\n');
        console.log('Options:');
        this.printOptions(this.posDescription(), this.posDefault());
    };
    Program.prototype.posDescription = function () {
        return this.lengthOf_('opt') + 2 * Program.MIN_SPACING;
    };
    Program.prototype.posDefault = function () {
        return this.posDescription() + this.lengthOf_('description') + Program.MIN_SPACING;
    };
    Program.prototype.lengthOf_ = function (param) {
        var maxLength = -1;
        for (var opt in this.options) {
            var option = this.options[opt];
            if (param === 'description') {
                maxLength = Math.max(maxLength, option.description.length);
            }
            else if (param === 'opt') {
                maxLength = Math.max(maxLength, option.opt.length);
            }
        }
        return maxLength;
    };
    /**
     * Create a collection of options used by this program.
     * @returns The options used in the programs.
     */
    Program.prototype.getOptions_ = function (allOptions) {
        for (var opt in this.options) {
            allOptions[opt] = this.options[opt];
        }
        return allOptions;
    };
    /**
     * Get the options used by the program and create the minimist options
     * to ensure that minimist parses the values properly.
     * @returns The options for minimist.
     */
    Program.prototype.getMinimistOptions = function () {
        var allOptions = {};
        allOptions = this.getOptions_(allOptions);
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
    Program.MIN_SPACING = 4;
    return Program;
}());
exports.Program = Program;
//# sourceMappingURL=programs.js.map