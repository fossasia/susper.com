"use strict";
if (typeof window == 'object' && window.window === window) {
    exports.root = window;
}
else if (typeof self == 'object' && self.self === self) {
    exports.root = self;
}
else if (typeof global == 'object' && global.global === global) {
    exports.root = global;
}
else {
    // Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
    // This is needed when used with angular/tsickle which inserts a goog.module statement.
    // Wrap in IIFE
    (function () {
        throw new Error('RxJS could not find any global context (window, self, global)');
    })();
}
//# sourceMappingURL=root.js.map