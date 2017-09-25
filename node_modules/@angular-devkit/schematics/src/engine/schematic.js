"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/operator/concatMap");
class InvalidSchematicsNameException extends core_1.BaseException {
    constructor(name) {
        super(`Schematics has invalid name: "${name}".`);
    }
}
exports.InvalidSchematicsNameException = InvalidSchematicsNameException;
class SchematicImpl {
    constructor(_description, _factory, // tslint:disable-line:no-any
        _collection, _engine) {
        this._description = _description;
        this._factory = _factory;
        this._collection = _collection;
        this._engine = _engine;
        if (!_description.name.match(/^[-_.a-zA-Z0-9]+$/)) {
            throw new InvalidSchematicsNameException(_description.name);
        }
    }
    get description() { return this._description; }
    get collection() { return this._collection; }
    call(options, host) {
        const context = {
            engine: this._engine,
            schematic: this,
            strategy: this._engine.defaultMergeStrategy,
        };
        const transformedOptions = this._engine.transformOptions(this, options);
        return host.concatMap(tree => {
            const result = this._factory(transformedOptions)(tree, context);
            if (result instanceof Observable_1.Observable) {
                return result;
            }
            else {
                return Observable_1.Observable.of(result);
            }
        });
    }
}
exports.SchematicImpl = SchematicImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hdGljLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L3NjaGVtYXRpY3Mvc3JjL2VuZ2luZS9zY2hlbWF0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBcUQ7QUFDckQsZ0RBQTZDO0FBQzdDLGtDQUFnQztBQUNoQyx1Q0FBcUM7QUFZckMsb0NBQTRDLFNBQVEsb0JBQWE7SUFDL0QsWUFBWSxJQUFZO1FBQ3RCLEtBQUssQ0FBQyxpQ0FBaUMsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0Y7QUFKRCx3RUFJQztBQUdEO0lBR0UsWUFBb0IsWUFBMkQsRUFDM0QsUUFBMEIsRUFBRyw2QkFBNkI7UUFDMUQsV0FBZ0QsRUFDaEQsT0FBd0M7UUFIeEMsaUJBQVksR0FBWixZQUFZLENBQStDO1FBQzNELGFBQVEsR0FBUixRQUFRLENBQWtCO1FBQzFCLGdCQUFXLEdBQVgsV0FBVyxDQUFxQztRQUNoRCxZQUFPLEdBQVAsT0FBTyxDQUFpQztRQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sSUFBSSw4QkFBOEIsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUQsQ0FBQztJQUNILENBQUM7SUFFRCxJQUFJLFdBQVcsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDL0MsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBRTdDLElBQUksQ0FBeUIsT0FBZ0IsRUFBRSxJQUFzQjtRQUNuRSxNQUFNLE9BQU8sR0FBbUQ7WUFDOUQsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3BCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CO1NBQzVDLENBQUM7UUFDRixNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXhFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUk7WUFDeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNoRSxFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVksdUJBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDaEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFoQ0Qsc0NBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgQmFzZUV4Y2VwdGlvbiB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL29mJztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvY29uY2F0TWFwJztcbmltcG9ydCB7IFRyZWUgfSBmcm9tICcuLi90cmVlL2ludGVyZmFjZSc7XG5pbXBvcnQge1xuICBDb2xsZWN0aW9uLFxuICBFbmdpbmUsXG4gIFJ1bGVGYWN0b3J5LFxuICBTY2hlbWF0aWMsXG4gIFNjaGVtYXRpY0Rlc2NyaXB0aW9uLFxuICBUeXBlZFNjaGVtYXRpY0NvbnRleHQsXG59IGZyb20gJy4vaW50ZXJmYWNlJztcblxuXG5leHBvcnQgY2xhc3MgSW52YWxpZFNjaGVtYXRpY3NOYW1lRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKGBTY2hlbWF0aWNzIGhhcyBpbnZhbGlkIG5hbWU6IFwiJHtuYW1lfVwiLmApO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFNjaGVtYXRpY0ltcGw8Q29sbGVjdGlvblQgZXh0ZW5kcyBvYmplY3QsIFNjaGVtYXRpY1QgZXh0ZW5kcyBvYmplY3Q+XG4gICAgaW1wbGVtZW50cyBTY2hlbWF0aWM8Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZXNjcmlwdGlvbjogU2NoZW1hdGljRGVzY3JpcHRpb248Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9mYWN0b3J5OiBSdWxlRmFjdG9yeTxhbnk+LCAgLy8gdHNsaW50OmRpc2FibGUtbGluZTpuby1hbnlcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY29sbGVjdGlvbjogQ29sbGVjdGlvbjxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2VuZ2luZTogRW5naW5lPENvbGxlY3Rpb25ULCBTY2hlbWF0aWNUPikge1xuICAgIGlmICghX2Rlc2NyaXB0aW9uLm5hbWUubWF0Y2goL15bLV8uYS16QS1aMC05XSskLykpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkU2NoZW1hdGljc05hbWVFeGNlcHRpb24oX2Rlc2NyaXB0aW9uLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBkZXNjcmlwdGlvbigpIHsgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uOyB9XG4gIGdldCBjb2xsZWN0aW9uKCkgeyByZXR1cm4gdGhpcy5fY29sbGVjdGlvbjsgfVxuXG4gIGNhbGw8T3B0aW9uVCBleHRlbmRzIG9iamVjdD4ob3B0aW9uczogT3B0aW9uVCwgaG9zdDogT2JzZXJ2YWJsZTxUcmVlPik6IE9ic2VydmFibGU8VHJlZT4ge1xuICAgIGNvbnN0IGNvbnRleHQ6IFR5cGVkU2NoZW1hdGljQ29udGV4dDxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4gPSB7XG4gICAgICBlbmdpbmU6IHRoaXMuX2VuZ2luZSxcbiAgICAgIHNjaGVtYXRpYzogdGhpcyxcbiAgICAgIHN0cmF0ZWd5OiB0aGlzLl9lbmdpbmUuZGVmYXVsdE1lcmdlU3RyYXRlZ3ksXG4gICAgfTtcbiAgICBjb25zdCB0cmFuc2Zvcm1lZE9wdGlvbnMgPSB0aGlzLl9lbmdpbmUudHJhbnNmb3JtT3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiBob3N0LmNvbmNhdE1hcCh0cmVlID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2ZhY3RvcnkodHJhbnNmb3JtZWRPcHRpb25zKSh0cmVlLCBjb250ZXh0KTtcbiAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZihyZXN1bHQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=