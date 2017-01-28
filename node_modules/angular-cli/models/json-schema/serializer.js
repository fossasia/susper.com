"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var error_1 = require('../error');
var InvalidStateError = (function (_super) {
    __extends(InvalidStateError, _super);
    function InvalidStateError() {
        _super.apply(this, arguments);
    }
    return InvalidStateError;
}(error_1.NgToolkitError));
exports.InvalidStateError = InvalidStateError;
var UnknownMimetype = (function (_super) {
    __extends(UnknownMimetype, _super);
    function UnknownMimetype() {
        _super.apply(this, arguments);
    }
    return UnknownMimetype;
}(error_1.NgToolkitError));
exports.UnknownMimetype = UnknownMimetype;
var Serializer = (function () {
    function Serializer() {
    }
    Serializer.fromMimetype = function (mimetype, writer) {
        var opts = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            opts[_i - 2] = arguments[_i];
        }
        var Klass = null;
        switch (mimetype) {
            case 'application/json':
                Klass = JsonSerializer;
                break;
            default: throw new UnknownMimetype();
        }
        return new (Klass.bind.apply(Klass, [void 0].concat([writer], opts)))();
    };
    return Serializer;
}());
exports.Serializer = Serializer;
var JsonSerializer = (function () {
    function JsonSerializer(_writer, _indentDelta) {
        if (_indentDelta === void 0) { _indentDelta = 2; }
        this._writer = _writer;
        this._indentDelta = _indentDelta;
        this._state = [];
    }
    JsonSerializer.prototype._willOutputValue = function () {
        if (this._state.length > 0) {
            var top = this._top();
            var wasEmpty = top.empty;
            top.empty = false;
            if (!wasEmpty && !top.property) {
                this._writer(',');
            }
            if (!top.property) {
                this._indent();
            }
        }
    };
    JsonSerializer.prototype._top = function () {
        return this._state[this._state.length - 1] || {};
    };
    JsonSerializer.prototype._indent = function () {
        if (this._indentDelta == 0) {
            return;
        }
        var str = '\n';
        var i = this._state.length * this._indentDelta;
        while (i--) {
            str += ' ';
        }
        this._writer(str);
    };
    JsonSerializer.prototype.start = function () { };
    JsonSerializer.prototype.end = function () {
        if (this._indentDelta) {
            this._writer('\n');
        }
    };
    JsonSerializer.prototype.object = function (callback) {
        this._willOutputValue();
        this._writer('{');
        this._state.push({ empty: true, type: 'object' });
        callback();
        this._state.pop();
        if (!this._top().empty) {
            this._indent();
        }
        this._writer('}');
    };
    JsonSerializer.prototype.property = function (name, callback) {
        this._willOutputValue();
        this._writer(JSON.stringify(name));
        this._writer(': ');
        this._top().property = true;
        callback();
        this._top().property = false;
    };
    JsonSerializer.prototype.array = function (callback) {
        this._willOutputValue();
        this._writer('[');
        this._state.push({ empty: true, type: 'array' });
        callback();
        this._state.pop();
        if (!this._top().empty) {
            this._indent();
        }
        this._writer(']');
    };
    JsonSerializer.prototype.outputValue = function (value) {
        this._willOutputValue();
        this._writer(JSON.stringify(value, null, this._indentDelta));
    };
    JsonSerializer.prototype.outputString = function (value) {
        this._willOutputValue();
        this._writer(JSON.stringify(value));
    };
    JsonSerializer.prototype.outputNumber = function (value) {
        this._willOutputValue();
        this._writer(JSON.stringify(value));
    };
    JsonSerializer.prototype.outputInteger = function (value) {
        this._willOutputValue();
        this._writer(JSON.stringify(value));
    };
    JsonSerializer.prototype.outputBoolean = function (value) {
        this._willOutputValue();
        this._writer(JSON.stringify(value));
    };
    return JsonSerializer;
}());
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/models/json-schema/serializer.js.map