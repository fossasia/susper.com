// This file exports a version of the Jasmine `it` that understands promises.
// To use this, simply `import {it} from './spec-utils`.
// TODO(hansl): move this to its own Jasmine-TypeScript package.
"use strict";
function async(fn) {
    return function (done) {
        var result = null;
        try {
            result = fn();
            if (result && 'then' in result) {
                result.then(done, done.fail);
            }
            else {
                done();
            }
        }
        catch (err) {
            done.fail(err);
        }
    };
}
function it(description, fn) {
    return global['it'](description, async(fn));
}
exports.it = it;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@angular-cli/ast-tools/src/spec-utils.js.map