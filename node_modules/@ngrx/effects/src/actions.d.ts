import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
export declare class Actions extends Observable<Action> {
    constructor(actionsSubject: Observable<Action>);
    lift(operator: Operator<any, Action>): Observable<Action>;
    ofType(...keys: string[]): Actions;
}
