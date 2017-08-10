"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// This matches a comment left by the build-optimizer that contains pure import paths
const importCommentRegex = /\/\*\* PURE_IMPORTS_START (\S+) PURE_IMPORTS_END \*\//mg;
// TODO: handle sourcemaps
function purify(content) {
    const pureImportMatches = getMatches(content, importCommentRegex, 1).join('|');
    const newContent = content
        .replace(
    // tslint:disable-next-line:max-line-length
    /^(var (\S+) = )(\(function \(\) \{\r?\n(?:    (?:\/\*\*| \*|\*\/|\/\/)[^\r?\n]*\r?\n)*    function \2\([^\)]*\) \{\r?\n)/mg, '$1/*@__PURE__*/$3')
        .replace(/^(var (\S+) = )(\(function \(_super\) \{\r?\n    \w*__extends\(\w+, _super\);\r?\n)/mg, '$1/*@__PURE__*/$3')
        .replace(
    // tslint:disable-next-line:max-line-length
    /var (\S+) = \{\};\r?\n(\1\.(\S+) = \d+;\r?\n)+\1\[\1\.(\S+)\] = "\4";\r?\n(\1\[\1\.(\S+)\] = "\S+";\r?\n*)+/mg, 'var $1 = /*@__PURE__*/(function() {\n$&; return $1;})();\n')
        .replace(
    // tslint:disable-next-line:max-line-length
    /var (\S+);(\/\*@__PURE__\*\/)*\r?\n\(function \(\1\) \{\s+(\1\[\1\["(\S+)"\] = 0\] = "\4";(\s+\1\[\1\["\S+"\] = \d\] = "\S+";)*\r?\n)\}\)\(\1 \|\| \(\1 = \{\}\)\);/mg, 'var $1 = /*@__PURE__*/(function() {\n    var $1 = {};\n    $3    return $1;\n})();')
        .replace(new RegExp(`(_(${pureImportMatches})__ = )(__webpack_require__\\(\\S+\\);)`, 'mg'), '$1/*@__PURE__*/$3')
        .replace(new RegExp(`(_(${pureImportMatches})___default = )(__webpack_require__\\.\\w\\(\\S+\\);)`, 'mg'), '$1/*@__PURE__*/$3')
        .replace(/\w*__WEBPACK_IMPORTED_MODULE_\d+__angular_core__\["\w+" \/\* (ɵccf|ɵcmf|ɵcrt) \*\/\]\(/mg, '/*@__PURE__*/$&')
        .replace(/new \w*__WEBPACK_IMPORTED_MODULE_\d+__angular_core__\["\w+" \/\* NgModuleFactory \*\/\]/mg, '/*@__PURE__*/$&');
    return newContent;
}
exports.purify = purify;
function getMatches(str, regex, index) {
    let matches = [];
    let match;
    // tslint:disable-next-line:no-conditional-assignment
    while (match = regex.exec(str)) {
        matches = matches.concat(match[index].split(','));
    }
    return matches;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyaWZ5LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvcHVyaWZ5L3B1cmlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILHFGQUFxRjtBQUNyRixNQUFNLGtCQUFrQixHQUFHLHlEQUF5RCxDQUFDO0FBRXJGLDBCQUEwQjtBQUMxQixnQkFBdUIsT0FBZTtJQUVwQyxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRS9FLE1BQU0sVUFBVSxHQUFHLE9BQU87U0FFdkIsT0FBTztJQUNSLDJDQUEyQztJQUN6Qyw0SEFBNEgsRUFDNUgsbUJBQW1CLENBQ3BCO1NBRUEsT0FBTyxDQUNOLHVGQUF1RixFQUN2RixtQkFBbUIsQ0FDcEI7U0FFQSxPQUFPO0lBQ1IsMkNBQTJDO0lBQ3pDLCtHQUErRyxFQUMvRyw0REFBNEQsQ0FDN0Q7U0FFQSxPQUFPO0lBQ1IsMkNBQTJDO0lBQ3pDLHVLQUF1SyxFQUN2SyxvRkFBb0YsQ0FDckY7U0FFQSxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxpQkFBaUIseUNBQXlDLEVBQUUsSUFBSSxDQUFDLEVBQ3pGLG1CQUFtQixDQUNwQjtTQUVBLE9BQU8sQ0FDTixJQUFJLE1BQU0sQ0FDUixNQUFNLGlCQUFpQix1REFBdUQsRUFBRSxJQUFJLENBQ3JGLEVBQ0QsbUJBQW1CLENBQ3BCO1NBRUEsT0FBTyxDQUNOLDBGQUEwRixFQUMxRixpQkFBaUIsQ0FDbEI7U0FFQSxPQUFPLENBQ04sMkZBQTJGLEVBQzNGLGlCQUFpQixDQUNsQixDQUFDO0lBRUosTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBbkRELHdCQW1EQztBQUVELG9CQUFvQixHQUFXLEVBQUUsS0FBYSxFQUFFLEtBQWE7SUFDM0QsSUFBSSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzNCLElBQUksS0FBSyxDQUFDO0lBQ1YscURBQXFEO0lBQ3JELE9BQU8sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUMvQixPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIFRoaXMgbWF0Y2hlcyBhIGNvbW1lbnQgbGVmdCBieSB0aGUgYnVpbGQtb3B0aW1pemVyIHRoYXQgY29udGFpbnMgcHVyZSBpbXBvcnQgcGF0aHNcbmNvbnN0IGltcG9ydENvbW1lbnRSZWdleCA9IC9cXC9cXCpcXCogUFVSRV9JTVBPUlRTX1NUQVJUIChcXFMrKSBQVVJFX0lNUE9SVFNfRU5EIFxcKlxcLy9tZztcblxuLy8gVE9ETzogaGFuZGxlIHNvdXJjZW1hcHNcbmV4cG9ydCBmdW5jdGlvbiBwdXJpZnkoY29udGVudDogc3RyaW5nKSB7XG5cbiAgY29uc3QgcHVyZUltcG9ydE1hdGNoZXMgPSBnZXRNYXRjaGVzKGNvbnRlbnQsIGltcG9ydENvbW1lbnRSZWdleCwgMSkuam9pbignfCcpO1xuXG4gIGNvbnN0IG5ld0NvbnRlbnQgPSBjb250ZW50XG4gICAgLyogcHJlZml4IGRvd25sZXZlbGVkIGNsYXNzZXMgdy8gdGhlIEBfX1BVUkVfXyBhbm5vdGF0aW9uICovXG4gICAgLnJlcGxhY2UoXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgL14odmFyIChcXFMrKSA9ICkoXFwoZnVuY3Rpb24gXFwoXFwpIFxce1xccj9cXG4oPzogICAgKD86XFwvXFwqXFwqfCBcXCp8XFwqXFwvfFxcL1xcLylbXlxccj9cXG5dKlxccj9cXG4pKiAgICBmdW5jdGlvbiBcXDJcXChbXlxcKV0qXFwpIFxce1xccj9cXG4pL21nLFxuICAgICAgJyQxLypAX19QVVJFX18qLyQzJyxcbiAgICApXG4gICAgLyogcHJlZml4IGRvd25sZXZlbGVkIGNsYXNzZXMgdGhhdCBleHRlbmQgYW5vdGhlciBjbGFzcyB3LyB0aGUgQF9fUFVSRV9fIGFubm90YXRpb24gKi9cbiAgICAucmVwbGFjZShcbiAgICAgIC9eKHZhciAoXFxTKykgPSApKFxcKGZ1bmN0aW9uIFxcKF9zdXBlclxcKSBcXHtcXHI/XFxuICAgIFxcdypfX2V4dGVuZHNcXChcXHcrLCBfc3VwZXJcXCk7XFxyP1xcbikvbWcsXG4gICAgICAnJDEvKkBfX1BVUkVfXyovJDMnLFxuICAgIClcbiAgICAvKiB3cmFwIFRTIDIuMiBlbnVtcyB3LyBhbiBJSUZFICovXG4gICAgLnJlcGxhY2UoXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgL3ZhciAoXFxTKykgPSBcXHtcXH07XFxyP1xcbihcXDFcXC4oXFxTKykgPSBcXGQrO1xccj9cXG4pK1xcMVxcW1xcMVxcLihcXFMrKVxcXSA9IFwiXFw0XCI7XFxyP1xcbihcXDFcXFtcXDFcXC4oXFxTKylcXF0gPSBcIlxcUytcIjtcXHI/XFxuKikrL21nLFxuICAgICAgJ3ZhciAkMSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24oKSB7XFxuJCY7IHJldHVybiAkMTt9KSgpO1xcbicsXG4gICAgKVxuICAgIC8qIHdyYXAgVFMgMi4zIGVudW1zIHcvIGFuIElJRkUgKi9cbiAgICAucmVwbGFjZShcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAvdmFyIChcXFMrKTsoXFwvXFwqQF9fUFVSRV9fXFwqXFwvKSpcXHI/XFxuXFwoZnVuY3Rpb24gXFwoXFwxXFwpIFxce1xccysoXFwxXFxbXFwxXFxbXCIoXFxTKylcIlxcXSA9IDBcXF0gPSBcIlxcNFwiOyhcXHMrXFwxXFxbXFwxXFxbXCJcXFMrXCJcXF0gPSBcXGRcXF0gPSBcIlxcUytcIjspKlxccj9cXG4pXFx9XFwpXFwoXFwxIFxcfFxcfCBcXChcXDEgPSBcXHtcXH1cXClcXCk7L21nLFxuICAgICAgJ3ZhciAkMSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24oKSB7XFxuICAgIHZhciAkMSA9IHt9O1xcbiAgICAkMyAgICByZXR1cm4gJDE7XFxufSkoKTsnLFxuICAgIClcbiAgICAvKiBQcmVmaXggc2FmZSBpbXBvcnRzIHdpdGggcHVyZSAqL1xuICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoYChfKCR7cHVyZUltcG9ydE1hdGNoZXN9KV9fID0gKShfX3dlYnBhY2tfcmVxdWlyZV9fXFxcXChcXFxcUytcXFxcKTspYCwgJ21nJyksXG4gICAgICAnJDEvKkBfX1BVUkVfXyovJDMnLFxuICAgIClcbiAgICAvKiBQcmVmaXggZGVmYXVsdCBzYWZlIGltcG9ydHMgd2l0aCBwdXJlICovXG4gICAgLnJlcGxhY2UoXG4gICAgICBuZXcgUmVnRXhwKFxuICAgICAgICBgKF8oJHtwdXJlSW1wb3J0TWF0Y2hlc30pX19fZGVmYXVsdCA9ICkoX193ZWJwYWNrX3JlcXVpcmVfX1xcXFwuXFxcXHdcXFxcKFxcXFxTK1xcXFwpOylgLCAnbWcnLFxuICAgICAgKSxcbiAgICAgICckMS8qQF9fUFVSRV9fKi8kMycsXG4gICAgKVxuICAgIC8qIFByZWZpeCBDQ0YgYW5kIENNRiBzdGF0ZW1lbnRzICovXG4gICAgLnJlcGxhY2UoXG4gICAgICAvXFx3Kl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfXFxkK19fYW5ndWxhcl9jb3JlX19cXFtcIlxcdytcIiBcXC9cXCogKMm1Y2NmfMm1Y21mfMm1Y3J0KSBcXCpcXC9cXF1cXCgvbWcsXG4gICAgICAnLypAX19QVVJFX18qLyQmJyxcbiAgICApXG4gICAgLyogUHJlZml4IG1vZHVsZSBzdGF0ZW1lbnRzICovXG4gICAgLnJlcGxhY2UoXG4gICAgICAvbmV3IFxcdypfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFX1xcZCtfX2FuZ3VsYXJfY29yZV9fXFxbXCJcXHcrXCIgXFwvXFwqIE5nTW9kdWxlRmFjdG9yeSBcXCpcXC9cXF0vbWcsXG4gICAgICAnLypAX19QVVJFX18qLyQmJyxcbiAgICApO1xuXG4gIHJldHVybiBuZXdDb250ZW50O1xufVxuXG5mdW5jdGlvbiBnZXRNYXRjaGVzKHN0cjogc3RyaW5nLCByZWdleDogUmVnRXhwLCBpbmRleDogbnVtYmVyKSB7XG4gIGxldCBtYXRjaGVzOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgbWF0Y2g7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25kaXRpb25hbC1hc3NpZ25tZW50XG4gIHdoaWxlIChtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyKSkge1xuICAgIG1hdGNoZXMgPSBtYXRjaGVzLmNvbmNhdChtYXRjaFtpbmRleF0uc3BsaXQoJywnKSk7XG4gIH1cblxuICByZXR1cm4gbWF0Y2hlcztcbn1cbiJdfQ==