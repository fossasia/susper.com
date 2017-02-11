var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable, Inject } from '@angular/core';
import { Dispatcher } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operator/filter';
export var Actions = (function (_super) {
    __extends(Actions, _super);
    function Actions(actionsSubject) {
        _super.call(this);
        this.source = actionsSubject;
    }
    Actions.prototype.lift = function (operator) {
        var observable = new Actions(this);
        observable.operator = operator;
        return observable;
    };
    Actions.prototype.ofType = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        return filter.call(this, function (_a) {
            var type = _a.type;
            var len = keys.length;
            if (len === 1) {
                return type === keys[0];
            }
            else {
                for (var i = 0; i < len; i++) {
                    if (keys[i] === type) {
                        return true;
                    }
                }
            }
            return false;
        });
    };
    Actions.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Actions.ctorParameters = [
        { type: Observable, decorators: [{ type: Inject, args: [Dispatcher,] },] },
    ];
    return Actions;
}(Observable));
//# sourceMappingURL=actions.js.map