"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NgToolkitError = (function (_super) {
    __extends(NgToolkitError, _super);
    function NgToolkitError(message) {
        _super.call(this);
        if (message) {
            this.message = message;
        }
        else {
            this.message = this.constructor.name;
        }
    }
    return NgToolkitError;
}(Error));
exports.NgToolkitError = NgToolkitError;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/models/error.js.map