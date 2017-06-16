"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task = require('../ember-cli/lib/models/task');
const opn = require('opn');
exports.DocTask = Task.extend({
    run: function (keyword, search) {
        const searchUrl = search ? `https://angular.io/search/#stq=${keyword}&stp=1` :
            `https://angular.io/docs/ts/latest/api/#!?query=${keyword}`;
        return opn(searchUrl, { wait: false });
    }
});
//# sourceMappingURL=/users/hans/sources/angular-cli/tasks/doc.js.map