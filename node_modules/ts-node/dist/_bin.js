"use strict";
var path_1 = require('path');
var repl_1 = require('repl');
var util_1 = require('util');
var arrify = require('arrify');
var extend = require('xtend');
var Module = require('module');
var minimist = require('minimist');
var chalk = require('chalk');
var diff_1 = require('diff');
var vm_1 = require('vm');
var index_1 = require('./index');
var strings = ['eval', 'print', 'compiler', 'project', 'ignoreWarnings', 'cacheDirectory'];
var booleans = ['help', 'fast', 'lazy', 'version', 'disableWarnings', 'cache'];
var aliases = {
    help: ['h'],
    fast: ['F'],
    lazy: ['L'],
    version: ['v'],
    eval: ['e'],
    print: ['p'],
    project: ['P'],
    compiler: ['C'],
    cacheDirectory: ['cache-directory'],
    ignoreWarnings: ['I', 'ignore-warnings'],
    disableWarnings: ['D', 'disable-warnings'],
    compilerOptions: ['O', 'compiler-options']
};
var stop = process.argv.length;
function isFlagOnly(arg) {
    var name = arg.replace(/^--?/, '');
    if (/=/.test(name)) {
        return true;
    }
    for (var _i = 0, booleans_1 = booleans; _i < booleans_1.length; _i++) {
        var bool = booleans_1[_i];
        if (name === bool) {
            return true;
        }
        var alias = aliases[bool];
        if (alias) {
            for (var _a = 0, alias_1 = alias; _a < alias_1.length; _a++) {
                var other = alias_1[_a];
                if (other === name) {
                    return true;
                }
            }
        }
    }
    return false;
}
for (var i = 2; i < process.argv.length; i++) {
    var arg = process.argv[i];
    var next = process.argv[i + 1];
    if (/^\[/.test(arg) || /\]$/.test(arg)) {
        continue;
    }
    if (/^-/.test(arg)) {
        if (!isFlagOnly(arg) && !/^-/.test(next)) {
            i++;
        }
        continue;
    }
    stop = i;
    break;
}
var argv = minimist(process.argv.slice(2, stop), {
    string: strings,
    boolean: booleans,
    alias: aliases,
    default: {
        cache: true
    }
});
if (argv.version) {
    console.log("ts-node v" + index_1.VERSION);
    console.log("node " + process.version);
    process.exit(0);
}
if (argv.help) {
    console.log("\nUsage: ts-node [options] [ -e script | script.ts ] [arguments]\n\nOptions:\n\n  -e, --eval [code]             Evaluate code\n  -p, --print [code]            Evaluate code and print result\n  -C, --compiler [name]         Specify a custom TypeScript compiler\n  -I, --ignoreWarnings [code]   Ignore TypeScript warnings by diagnostic code\n  -D, --disableWarnings         Ignore every TypeScript warning\n  -P, --project [path]          Path to TypeScript project (or `false`)\n  -O, --compilerOptions [opts]  JSON compiler options to merge with compilation\n  -L, --lazy                    Lazily load TypeScript compilation\n  -F, --fast                    Run TypeScript compilation in transpile mode\n  --no-cache                    Disable the TypeScript cache\n  --cache-directory             Configure the TypeScript cache directory\n");
    process.exit(0);
}
var _emit = process.emit;
process.emit = function (type, error) {
    if (type === 'uncaughtException' && error instanceof index_1.TSError && process.listeners(type).length === 0) {
        printAndExit(error);
    }
    return _emit.apply(this, arguments);
};
var cwd = process.cwd();
var code = argv.eval == null ? argv.print : argv.eval;
var isEvalScript = typeof argv.eval === 'string' || !!argv.print;
var isEval = isEvalScript || stop === process.argv.length;
var isPrinted = argv.print != null;
var service = index_1.register(extend(argv, {
    getFile: isEval ? getFileEval : index_1.getFile,
    getVersion: isEval ? getVersionEval : index_1.getVersion,
    fileExists: isEval ? fileExistsEval : index_1.fileExists,
    ignoreWarnings: arrify(argv.ignoreWarnings)
}));
var EVAL_FILENAME = '[eval].ts';
var EVAL_PATH = path_1.join(cwd, EVAL_FILENAME);
var evalFile = { input: '', output: '', version: 0 };
if (isEvalScript) {
    evalAndExit(code, isPrinted);
}
else {
    if (stop < process.argv.length) {
        var args = process.argv.slice(stop);
        args[0] = path_1.resolve(cwd, args[0]);
        process.argv = ['node'].concat(args);
        process.execArgv.unshift(__filename);
        Module.runMain();
    }
    else {
        if (process.stdin.isTTY) {
            startRepl();
        }
        else {
            var code_1 = '';
            process.stdin.on('data', function (chunk) { return code_1 += chunk; });
            process.stdin.on('end', function () { return evalAndExit(code_1, isPrinted); });
        }
    }
}
function evalAndExit(code, isPrinted) {
    global.__filename = EVAL_FILENAME;
    global.__dirname = cwd;
    var module = new Module(global.__filename);
    module.filename = global.__filename;
    module.paths = Module._nodeModulePaths(global.__dirname);
    global.exports = module.exports;
    global.module = module;
    global.require = module.require.bind(module);
    var result;
    try {
        result = _eval(code, global);
    }
    catch (error) {
        if (error instanceof index_1.TSError) {
            printAndExit(error);
        }
        throw error;
    }
    if (isPrinted) {
        console.log(typeof result === 'string' ? result : util_1.inspect(result));
    }
    process.exit(0);
}
function print(error) {
    return chalk.bold(chalk.red('⨯') + " Unable to compile TypeScript") + ("\n" + error.diagnostics.join('\n'));
}
function printAndExit(error) {
    console.error(print(error));
    process.exit(1);
}
function _eval(code, context) {
    var undo = evalFile.input;
    var isCompletion = !/\n$/.test(code);
    evalFile.input += code;
    evalFile.version++;
    var output;
    try {
        output = service().compile(EVAL_PATH);
    }
    catch (error) {
        evalFile.input = undo;
        throw error;
    }
    var changes = diff_1.diffLines(evalFile.output, output);
    if (isCompletion) {
        evalFile.input = undo;
    }
    else {
        evalFile.output = output;
    }
    var result;
    for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
        var change = changes_1[_i];
        if (change.added) {
            var script = vm_1.createScript(change.value, EVAL_FILENAME);
            result = script.runInNewContext(context);
        }
    }
    return result;
}
function startRepl() {
    var repl = repl_1.start({
        prompt: '> ',
        input: process.stdin,
        output: process.stdout,
        eval: replEval,
        useGlobal: false
    });
    repl.on('reset', function () {
        evalFile.input = '';
        evalFile.output = '';
        evalFile.version = 0;
    });
    repl.defineCommand('type', {
        help: 'Check the type of a TypeScript identifier',
        action: function (identifier) {
            if (!identifier) {
                ;
                repl.displayPrompt();
                return;
            }
            var undo = evalFile.input;
            evalFile.input += identifier;
            evalFile.version++;
            var _a = service().getTypeInfo(EVAL_PATH, evalFile.input.length), name = _a.name, comment = _a.comment;
            repl.outputStream.write(chalk.bold(name) + "\n" + (comment ? comment + "\n" : ''));
            repl.displayPrompt();
            evalFile.input = undo;
        }
    });
}
function replEval(code, context, filename, callback) {
    var err;
    var result;
    if (code === '.scope') {
        callback();
        return;
    }
    try {
        result = _eval(code, context);
    }
    catch (error) {
        if (error instanceof index_1.TSError) {
            err = print(error);
        }
        else {
            err = error;
        }
    }
    callback(err, result);
}
function getFileEval(fileName) {
    return fileName === EVAL_PATH ? evalFile.input : index_1.getFile(fileName);
}
function getVersionEval(fileName) {
    return fileName === EVAL_PATH ? String(evalFile.version) : index_1.getVersion(fileName);
}
function fileExistsEval(fileName) {
    return fileName === EVAL_PATH ? true : index_1.fileExists(fileName);
}
//# sourceMappingURL=_bin.js.map