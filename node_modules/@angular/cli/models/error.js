"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NgToolkitError extends Error {
    constructor(message) {
        super();
        if (message) {
            this.message = message;
        }
        else {
            this.message = this.constructor.name;
        }
    }
}
exports.NgToolkitError = NgToolkitError;
//# sourceMappingURL=/users/hans/sources/angular-cli/models/error.js.map