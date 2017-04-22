"use strict";
var core_1 = require('@angular/core');
var modal_1 = require('./modal');
var ModalHeaderComponent = (function () {
    function ModalHeaderComponent(modal) {
        this.modal = modal;
        this.showClose = false;
    }
    ModalHeaderComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'modal-header',
                    template: "\n        <div class=\"modal-header\">\n            <button *ngIf=\"showClose\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" (click)=\"modal.dismiss()\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n            <ng-content></ng-content>\n        </div>\n    "
                },] },
    ];
    /** @nocollapse */
    ModalHeaderComponent.ctorParameters = [
        { type: modal_1.ModalComponent, },
    ];
    ModalHeaderComponent.propDecorators = {
        'showClose': [{ type: core_1.Input, args: ['show-close',] },],
    };
    return ModalHeaderComponent;
}());
exports.ModalHeaderComponent = ModalHeaderComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL25nMi1iczMtbW9kYWwvY29tcG9uZW50cy9tb2RhbC1oZWFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUF5QyxlQUFlLENBQUMsQ0FBQTtBQUN6RCxzQkFBK0IsU0FBUyxDQUFDLENBQUE7QUFHekM7SUFFSSw4QkFBb0IsS0FBcUI7UUFBckIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFEeEMsY0FBUyxHQUFZLEtBQUssQ0FBQztJQUNpQixDQUFDO0lBQzNDLCtCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLGdCQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxjQUFjO29CQUN4QixRQUFRLEVBQUUseVVBT1Q7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLG1DQUFjLEdBQTZEO1FBQ2xGLEVBQUMsSUFBSSxFQUFFLHNCQUFjLEdBQUc7S0FDdkIsQ0FBQztJQUNLLG1DQUFjLEdBQTJDO1FBQ2hFLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUcsRUFBRSxFQUFFO0tBQ3RELENBQUM7SUFDRiwyQkFBQztBQUFELENBQUMsQUF2QkQsSUF1QkM7QUF2QlksNEJBQW9CLHVCQXVCaEMsQ0FBQSJ9