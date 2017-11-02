"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Internal benchmark reporting flag.
// Use with CLI --no-progress flag for best results.
// This should be false for commited code.
const _benchmark = false;
function time(label) {
    if (_benchmark) {
        console.time(label);
    }
}
exports.time = time;
function timeEnd(label) {
    if (_benchmark) {
        console.timeEnd(label);
    }
}
exports.timeEnd = timeEnd;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/benchmark.js.map