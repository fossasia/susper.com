"use strict";
var fs = require('fs');
var denodeify = require('denodeify');
var readFile = denodeify(fs.readFile);
var writeFile = denodeify(fs.writeFile);
exports.NodeHost = {
    write: function (path, content) { return writeFile(path, content, 'utf8'); },
    read: function (path) { return readFile(path, 'utf8'); }
};
/**
 * An operation that does nothing.
 */
var NoopChange = (function () {
    function NoopChange() {
        this.description = 'No operation.';
        this.order = Infinity;
        this.path = null;
    }
    NoopChange.prototype.apply = function () { return Promise.resolve(); };
    return NoopChange;
}());
exports.NoopChange = NoopChange;
/**
 * An operation that mixes two or more changes, and merge them (in order).
 * Can only apply to a single file. Use a ChangeManager to apply changes to multiple
 * files.
 */
var MultiChange = (function () {
    function MultiChange() {
        var _this = this;
        var changes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            changes[_i - 0] = arguments[_i];
        }
        this._changes = [];
        (_a = []).concat.apply(_a, changes).forEach(function (change) { return _this.appendChange(change); });
        var _a;
    }
    MultiChange.prototype.appendChange = function (change) {
        // Do not append Noop changes.
        if (change instanceof NoopChange) {
            return;
        }
        // Validate that the path is the same for everyone of those.
        if (this._path === undefined) {
            this._path = change.path;
        }
        else if (change.path !== this._path) {
            throw new Error('Cannot apply a change to a different path.');
        }
        this._changes.push(change);
    };
    Object.defineProperty(MultiChange.prototype, "description", {
        get: function () {
            return "Changes:\n   " + this._changes.map(function (x) { return x.description; }).join('\n   ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiChange.prototype, "order", {
        // Always apply as early as the highest change.
        get: function () { return Math.max.apply(Math, this._changes.map(function (c) { return c.order; })); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiChange.prototype, "path", {
        get: function () { return this._path; },
        enumerable: true,
        configurable: true
    });
    MultiChange.prototype.apply = function (host) {
        return this._changes
            .sort(function (a, b) { return b.order - a.order; })
            .reduce(function (promise, change) {
            return promise.then(function () { return change.apply(host); });
        }, Promise.resolve());
    };
    return MultiChange;
}());
exports.MultiChange = MultiChange;
/**
 * Will add text to the source code.
 */
var InsertChange = (function () {
    function InsertChange(path, pos, toAdd) {
        this.path = path;
        this.pos = pos;
        this.toAdd = toAdd;
        if (pos < 0) {
            throw new Error('Negative positions are invalid');
        }
        this.description = "Inserted " + toAdd + " into position " + pos + " of " + path;
        this.order = pos;
    }
    /**
     * This method does not insert spaces if there is none in the original string.
     */
    InsertChange.prototype.apply = function (host) {
        var _this = this;
        return host.read(this.path).then(function (content) {
            var prefix = content.substring(0, _this.pos);
            var suffix = content.substring(_this.pos);
            return host.write(_this.path, "" + prefix + _this.toAdd + suffix);
        });
    };
    return InsertChange;
}());
exports.InsertChange = InsertChange;
/**
 * Will remove text from the source code.
 */
var RemoveChange = (function () {
    function RemoveChange(path, pos, toRemove) {
        this.path = path;
        this.pos = pos;
        this.toRemove = toRemove;
        if (pos < 0) {
            throw new Error('Negative positions are invalid');
        }
        this.description = "Removed " + toRemove + " into position " + pos + " of " + path;
        this.order = pos;
    }
    RemoveChange.prototype.apply = function (host) {
        var _this = this;
        return host.read(this.path).then(function (content) {
            var prefix = content.substring(0, _this.pos);
            var suffix = content.substring(_this.pos + _this.toRemove.length);
            // TODO: throw error if toRemove doesn't match removed string.
            return host.write(_this.path, "" + prefix + suffix);
        });
    };
    return RemoveChange;
}());
exports.RemoveChange = RemoveChange;
/**
 * Will replace text from the source code.
 */
var ReplaceChange = (function () {
    function ReplaceChange(path, pos, oldText, newText) {
        this.path = path;
        this.pos = pos;
        this.oldText = oldText;
        this.newText = newText;
        if (pos < 0) {
            throw new Error('Negative positions are invalid');
        }
        this.description = "Replaced " + oldText + " into position " + pos + " of " + path + " with " + newText;
        this.order = pos;
    }
    ReplaceChange.prototype.apply = function (host) {
        var _this = this;
        return host.read(this.path).then(function (content) {
            var prefix = content.substring(0, _this.pos);
            var suffix = content.substring(_this.pos + _this.oldText.length);
            var text = content.substring(_this.pos, _this.pos + _this.oldText.length);
            if (text !== _this.oldText) {
                return Promise.reject(new Error("Invalid replace: \"" + text + "\" != \"" + _this.oldText + "\"."));
            }
            // TODO: throw error if oldText doesn't match removed string.
            return host.write(_this.path, "" + prefix + _this.newText + suffix);
        });
    };
    return ReplaceChange;
}());
exports.ReplaceChange = ReplaceChange;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@angular-cli/ast-tools/src/change.js.map