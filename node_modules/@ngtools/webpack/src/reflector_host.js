"use strict";
/**
 * Patch the CodeGenerator instance to use a custom reflector host.
 */
function patchReflectorHost(codeGenerator) {
    var reflectorHost = codeGenerator.reflectorHost;
    var oldGIP = reflectorHost.getImportPath;
    reflectorHost.getImportPath = function (containingFile, importedFile) {
        // Hack together SCSS and LESS files URLs so that they match what the default ReflectorHost
        // is expected. We only do that for shimmed styles.
        var m = importedFile.match(/(.*)(\.css|\.scss|\.less|\.stylus)((?:\.shim)?)(\..+)/);
        if (!m) {
            return oldGIP.call(this, containingFile, importedFile);
        }
        // We call the original, with `css` in its name instead of the extension, and replace the
        // extension from the result.
        var baseDirAndName = m[1], styleExt = m[2], shim = m[3], ext = m[4];
        var result = oldGIP.call(this, containingFile, baseDirAndName + '.css' + shim + ext);
        return result.replace(/\.css($|\.)/, styleExt + '$1');
    };
}
exports.patchReflectorHost = patchReflectorHost;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@ngtools/webpack/src/reflector_host.js.map