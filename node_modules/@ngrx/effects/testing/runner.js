var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
export var EffectsRunner = (function (_super) {
    __extends(EffectsRunner, _super);
    function EffectsRunner() {
        _super.call(this);
    }
    EffectsRunner.prototype.queue = function (action) {
        this.next(action);
    };
    EffectsRunner.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EffectsRunner.ctorParameters = [];
    return EffectsRunner;
}(ReplaySubject));
//# sourceMappingURL=runner.js.map