"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignoreDep @angular/compiler-cli
// @ignoreDep typescript
/**
 * This is a copy of types in @compiler-cli/src/ngtools_api.d.ts file,
 * together with safe imports for private apis for cases where @angular/compiler-cli isn't
 * available or is below version 5.
 */
const path = require("path");
exports.DEFAULT_ERROR_CODE = 100;
exports.UNKNOWN_ERROR_CODE = 500;
exports.SOURCE = 'angular';
// Manually check for Compiler CLI availability and supported version.
// This is needed because @ngtools/webpack does not depend directly on @angular/compiler-cli, since
// it is installed as part of global Angular CLI installs and compiler-cli is not of its
// dependencies.
function CompilerCliIsSupported() {
    let version;
    // Check that Angular is available.
    try {
        version = require('@angular/compiler-cli').VERSION;
    }
    catch (e) {
        throw new Error('The "@angular/compiler-cli" package was not properly installed. Error: ' + e);
    }
    // Check that Angular is also not part of this module's node_modules (it should be the project's).
    const compilerCliPath = require.resolve('@angular/compiler-cli');
    if (compilerCliPath.startsWith(path.dirname(__dirname))) {
        throw new Error('The @ngtools/webpack plugin now relies on the project @angular/compiler-cli. '
            + 'Please clean your node_modules and reinstall.');
    }
    // Throw if we're neither 2.3.1 or more, nor 4.x.y, nor 5.x.y.
    if (!(version.major == '5'
        || version.major == '4'
        || (version.major == '2'
            && (version.minor == '4'
                || version.minor == '3' && version.patch == '1')))) {
        throw new Error('Version of @angular/compiler-cli needs to be 2.3.1 or greater. '
            + `Current version is "${version.full}".`);
    }
}
exports.CompilerCliIsSupported = CompilerCliIsSupported;
// These imports do not exist on a global install for Angular CLI, so we cannot use a static ES6
// import.
let compilerCli = {};
try {
    compilerCli = require('@angular/compiler-cli');
}
catch (e) {
    // Don't throw an error if the private API does not exist.
    // Instead, the `CompilerCliIsSupported` method should return throw and indicate the
    // plugin cannot be used.
}
exports.VERSION = compilerCli.VERSION;
exports.__NGTOOLS_PRIVATE_API_2 = compilerCli.__NGTOOLS_PRIVATE_API_2;
// These imports do not exist on Angular versions lower than 5, so we cannot use a static ES6
// import.
let ngtools2 = {};
try {
    ngtools2 = require('@angular/compiler-cli/ngtools2');
}
catch (e) {
    // Don't throw an error if the private API does not exist.
    // Instead, the `AngularCompilerPlugin.isSupported` method should return false and indicate the
    // plugin cannot be used.
}
exports.createProgram = ngtools2.createProgram;
exports.createCompilerHost = ngtools2.createCompilerHost;
exports.formatDiagnostics = ngtools2.formatDiagnostics;
exports.readConfiguration = compilerCli.readConfiguration;
exports.EmitFlags = ngtools2.EmitFlags;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/ngtools_api.js.map