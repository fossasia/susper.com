"use strict";
var core_1 = require('@angular/core');
var modal_1 = require('../components/modal');
var AutofocusDirective = (function () {
    function AutofocusDirective(el, modal) {
        var _this = this;
        this.el = el;
        this.modal = modal;
        if (modal) {
            this.modal.onOpen.subscribe(function () {
                _this.el.nativeElement.focus();
            });
        }
    }
    AutofocusDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[autofocus]'
                },] },
    ];
    /** @nocollapse */
    AutofocusDirective.ctorParameters = [
        { type: core_1.ElementRef, },
        { type: modal_1.ModalComponent, decorators: [{ type: core_1.Optional },] },
    ];
    return AutofocusDirective;
}());
exports.AutofocusDirective = AutofocusDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2ZvY3VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL25nMi1iczMtbW9kYWwvZGlyZWN0aXZlcy9hdXRvZm9jdXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUF3RCxlQUFlLENBQUMsQ0FBQTtBQUN4RSxzQkFBK0IscUJBQXFCLENBQUMsQ0FBQTtBQUdyRDtJQUNJLDRCQUFvQixFQUFjLEVBQVcsS0FBcUI7UUFEdEUsaUJBa0JDO1FBakJ1QixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVcsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDOUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztnQkFDeEIsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUNFLDZCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLGdCQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxhQUFhO2lCQUMxQixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsaUNBQWMsR0FBNkQ7UUFDbEYsRUFBQyxJQUFJLEVBQUUsaUJBQVUsR0FBRztRQUNwQixFQUFDLElBQUksRUFBRSxzQkFBYyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQVEsRUFBRSxFQUFHLEVBQUM7S0FDekQsQ0FBQztJQUNGLHlCQUFDO0FBQUQsQ0FBQyxBQWxCRCxJQWtCQztBQWxCWSwwQkFBa0IscUJBa0I5QixDQUFBIn0=