"use strict";
var Option = (function () {
    function Option(opt, description, type, defaultValue) {
        this.opt = opt;
        this.description = description;
        this.type = type;
        if (defaultValue) {
            this.defaultValue = defaultValue;
        }
    }
    Option.prototype.getValue_ = function () {
        if (this.value) {
            return this.value;
        }
        else {
            return this.defaultValue;
        }
    };
    Option.prototype.getNumber = function () {
        var value = this.getValue_();
        if (value && typeof value === 'number') {
            return +value;
        }
        return null;
    };
    Option.prototype.getString = function () {
        var value = this.getValue_();
        if (value && typeof value === 'string') {
            return '' + value;
        }
        return null;
    };
    Option.prototype.getBoolean = function () {
        var value = this.getValue_();
        return value ? true : false;
    };
    return Option;
}());
exports.Option = Option;
//# sourceMappingURL=options.js.map