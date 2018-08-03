import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
export declare class Actions extends Observable<Action> {
    constructor(actionsSubject: Observable<Action>);
    ofType(...keys: string[]): Actions;
}
