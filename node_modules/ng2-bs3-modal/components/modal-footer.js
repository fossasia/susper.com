"use strict";
var core_1 = require('@angular/core');
var modal_1 = require('./modal');
var ModalFooterComponent = (function () {
    function ModalFooterComponent(modal) {
        this.modal = modal;
        this.showDefaultButtons = false;
        this.dismissButtonLabel = 'Dismiss';
        this.closeButtonLabel = 'Close';
    }
    ModalFooterComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'modal-footer',
                    template: "\n        <div class=\"modal-footer\">\n            <ng-content></ng-content>\n            <button *ngIf=\"showDefaultButtons\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" (click)=\"modal.dismiss()\">{{dismissButtonLabel}}</button>\n            <button *ngIf=\"showDefaultButtons\" type=\"button\" class=\"btn btn-primary\" (click)=\"modal.close()\">{{closeButtonLabel}}</button>\n        </div>\n    "
                },] },
    ];
    /** @nocollapse */
    ModalFooterComponent.ctorParameters = [
        { type: modal_1.ModalComponent, },
    ];
    ModalFooterComponent.propDecorators = {
        'showDefaultButtons': [{ type: core_1.Input, args: ['show-default-buttons',] },],
        'dismissButtonLabel': [{ type: core_1.Input, args: ['dismiss-button-label',] },],
        'closeButtonLabel': [{ type: core_1.Input, args: ['close-button-label',] },],
    };
    return ModalFooterComponent;
}());
exports.ModalFooterComponent = ModalFooterComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtZm9vdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL25nMi1iczMtbW9kYWwvY29tcG9uZW50cy9tb2RhbC1mb290ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUF5QyxlQUFlLENBQUMsQ0FBQTtBQUN6RCxzQkFBK0IsU0FBUyxDQUFDLENBQUE7QUFHekM7SUFJSSw4QkFBb0IsS0FBcUI7UUFBckIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFIeEMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBQ3BDLHVCQUFrQixHQUFXLFNBQVMsQ0FBQztRQUN2QyxxQkFBZ0IsR0FBVyxPQUFPLENBQUM7SUFDUyxDQUFDO0lBQzNDLCtCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLGdCQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxjQUFjO29CQUN4QixRQUFRLEVBQUUsd2FBTVQ7aUJBQ0osRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLG1DQUFjLEdBQTZEO1FBQ2xGLEVBQUMsSUFBSSxFQUFFLHNCQUFjLEdBQUc7S0FDdkIsQ0FBQztJQUNLLG1DQUFjLEdBQTJDO1FBQ2hFLG9CQUFvQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBSyxFQUFFLElBQUksRUFBRSxDQUFDLHNCQUFzQixFQUFHLEVBQUUsRUFBRTtRQUMxRSxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRyxFQUFFLEVBQUU7UUFDMUUsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsb0JBQW9CLEVBQUcsRUFBRSxFQUFFO0tBQ3JFLENBQUM7SUFDRiwyQkFBQztBQUFELENBQUMsQUExQkQsSUEwQkM7QUExQlksNEJBQW9CLHVCQTBCaEMsQ0FBQSJ9