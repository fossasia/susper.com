"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ngWalker_1 = require("../angular/ngWalker");
function allNgComponent() {
    return new NgComponentWalkerBuilder();
}
exports.allNgComponent = allNgComponent;
var Failure = (function () {
    function Failure(node, message) {
        this.node = node;
        this.message = message;
    }
    return Failure;
}());
exports.Failure = Failure;
var NgComponentWalkerBuilder = (function () {
    function NgComponentWalkerBuilder() {
    }
    NgComponentWalkerBuilder.prototype.where = function (validate) {
        this._where = validate;
        return this;
    };
    NgComponentWalkerBuilder.prototype.build = function (sourceFile, options) {
        var self = this;
        var e = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super.apply(this, arguments) || this;
            }
            class_1.prototype.visitNgComponent = function (meta) {
                var _this = this;
                self._where(meta).fmap(function (failure) {
                    _this.addFailure(_this.createFailure(failure.node.getStart(), failure.node.getWidth(), failure.message));
                });
                _super.prototype.visitNgComponent.call(this, meta);
            };
            return class_1;
        }(ngWalker_1.NgWalker));
        return new e(sourceFile, options);
    };
    return NgComponentWalkerBuilder;
}());
