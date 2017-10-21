"use strict";
var AsyncSubject_1 = require('../AsyncSubject');
var multicast_1 = require('./multicast');
//TODO(benlesh): specify that the second type is actually a ConnectableObservable
function publishLast() {
    return function (source) { return multicast_1.multicast(new AsyncSubject_1.AsyncSubject())(source); };
}
exports.publishLast = publishLast;
//# sourceMappingURL=publishLast.js.map