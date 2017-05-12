#!/usr/bin/env node
"use strict";
var child_process_1 = require('child_process');
var path_1 = require('path');
var args = [path_1.join(__dirname, '_bin.js')];
var opts = process.argv.slice(2);
for (var i = 0; i < opts.length; i++) {
    var arg = opts[i];
    var flag = arg.split('=')[0];
    switch (flag) {
        case '-d':
            args.unshift('--debug');
            opts.splice(i, 1);
            break;
        case 'debug':
        case '--debug':
        case '--debug-brk':
            args.unshift(arg);
            opts.splice(i, 1);
            break;
        case '-gc':
        case '--expose-gc':
            args.unshift('--expose-gc');
            opts.splice(i, 1);
            break;
        case '--gc-global':
        case '--es_staging':
        case '--no-deprecation':
        case '--prof':
        case '--log-timer-events':
        case '--throw-deprecation':
        case '--trace-deprecation':
        case '--use_strict':
        case '--allow-natives-syntax':
        case '--perf-basic-prof':
            args.unshift(arg);
            opts.splice(i, 1);
            break;
        default:
            if (/^--(?:harmony|trace|icu-data-dir|max-old-space-size)/.test(arg)) {
                args.unshift(arg);
                opts.splice(i, 1);
            }
            break;
    }
    if (/^[^-]/.test(arg)) {
        break;
    }
}
var proc = child_process_1.spawn(process.execPath, args.concat(opts), { stdio: 'inherit' });
proc.on('exit', function (code, signal) {
    process.on('exit', function () {
        if (signal) {
            process.kill(process.pid, signal);
        }
        else {
            process.exit(code);
        }
    });
});
//# sourceMappingURL=bin.js.map