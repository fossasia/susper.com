// Don't emit anything when there are compilation errors. This is useful for preventing Karma
// from re-running tests when there is a compilation error.
// Workaround for https://github.com/webpack-contrib/karma-webpack/issues/49
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KarmaWebpackEmitlessError {
    constructor() { }
    apply(compiler) {
        compiler.plugin('done', (stats) => {
            if (stats.compilation.errors.length > 0) {
                stats.stats = [{
                        toJson: function () {
                            return this;
                        },
                        assets: []
                    }];
            }
        });
    }
}
exports.KarmaWebpackEmitlessError = KarmaWebpackEmitlessError;
//# sourceMappingURL=/users/hans/sources/angular-cli/plugins/karma-webpack-emitless-error.js.map