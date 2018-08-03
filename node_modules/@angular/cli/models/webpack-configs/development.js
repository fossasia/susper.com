"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
function getDevConfig(_wco) {
    return {
        plugins: [new webpack_1.NamedModulesPlugin()]
    };
}
exports.getDevConfig = getDevConfig;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/models/webpack-configs/development.js.map