"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var modal_1 = require('./components/modal');
var modal_header_1 = require('./components/modal-header');
var modal_body_1 = require('./components/modal-body');
var modal_footer_1 = require('./components/modal-footer');
var autofocus_1 = require('./directives/autofocus');
__export(require('./components/modal'));
__export(require('./components/modal-header'));
__export(require('./components/modal-body'));
__export(require('./components/modal-footer'));
__export(require('./components/modal-instance'));
var Ng2Bs3ModalModule = (function () {
    function Ng2Bs3ModalModule() {
    }
    Ng2Bs3ModalModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        modal_1.ModalComponent,
                        modal_header_1.ModalHeaderComponent,
                        modal_body_1.ModalBodyComponent,
                        modal_footer_1.ModalFooterComponent,
                        autofocus_1.AutofocusDirective
                    ],
                    exports: [
                        modal_1.ModalComponent,
                        modal_header_1.ModalHeaderComponent,
                        modal_body_1.ModalBodyComponent,
                        modal_footer_1.ModalFooterComponent,
                        autofocus_1.AutofocusDirective
                    ]
                },] },
    ];
    /** @nocollapse */
    Ng2Bs3ModalModule.ctorParameters = [];
    return Ng2Bs3ModalModule;
}());
exports.Ng2Bs3ModalModule = Ng2Bs3ModalModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLWJzMy1tb2RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9uZzItYnMzLW1vZGFsL25nMi1iczMtbW9kYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHFCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUN6Qyx1QkFBNkIsaUJBQWlCLENBQUMsQ0FBQTtBQUUvQyxzQkFBK0Isb0JBQW9CLENBQUMsQ0FBQTtBQUNwRCw2QkFBcUMsMkJBQTJCLENBQUMsQ0FBQTtBQUNqRSwyQkFBbUMseUJBQXlCLENBQUMsQ0FBQTtBQUM3RCw2QkFBcUMsMkJBQTJCLENBQUMsQ0FBQTtBQUNqRSwwQkFBbUMsd0JBQXdCLENBQUMsQ0FBQTtBQUU1RCxpQkFBYyxvQkFBb0IsQ0FBQyxFQUFBO0FBQ25DLGlCQUFjLDJCQUEyQixDQUFDLEVBQUE7QUFDMUMsaUJBQWMseUJBQXlCLENBQUMsRUFBQTtBQUN4QyxpQkFBYywyQkFBMkIsQ0FBQyxFQUFBO0FBQzFDLGlCQUFjLDZCQUE2QixDQUFDLEVBQUE7QUFHNUM7SUFBQTtJQXlCQSxDQUFDO0lBeEJNLDRCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLGVBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDckIsT0FBTyxFQUFFO3dCQUNMLHFCQUFZO3FCQUNmO29CQUNELFlBQVksRUFBRTt3QkFDVixzQkFBYzt3QkFDZCxtQ0FBb0I7d0JBQ3BCLCtCQUFrQjt3QkFDbEIsbUNBQW9CO3dCQUNwQiw4QkFBa0I7cUJBQ3JCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxzQkFBYzt3QkFDZCxtQ0FBb0I7d0JBQ3BCLCtCQUFrQjt3QkFDbEIsbUNBQW9CO3dCQUNwQiw4QkFBa0I7cUJBQ3JCO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxnQ0FBYyxHQUE2RCxFQUNqRixDQUFDO0lBQ0Ysd0JBQUM7QUFBRCxDQUFDLEFBekJELElBeUJDO0FBekJZLHlCQUFpQixvQkF5QjdCLENBQUEifQ==