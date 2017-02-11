import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
export declare class Actions extends Observable<Action> {
    constructor(actionsSubject: Observable<Action>);
    lift(operator: any): any;
    ofType(...keys: string[]): Actions;
}
