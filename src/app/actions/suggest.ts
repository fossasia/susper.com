import { Action } from '@ngrx/store';
import { type } from '../utils';

export const ActionTypes = {
    SUGGEST: type('[Suggest] Gives suggestions'),
    SUGGEST_SUCCESS: type('[Suggest] Successful to give suggestions'),
    SUGGEST_FAILURE: type('[Suggest] Fails to give suggestions'),
};

export class SuggestionResponse implements Action {
    type = ActionTypes.SUGGEST;

    constructor(public payload: any) { }
}

export class SuggestionSuccess implements Action {
    type = ActionTypes.SUGGEST_SUCCESS;

    constructor(public payload: any) { }
}

export class SuggestionFail implements Action {
    type = ActionTypes.SUGGEST_FAILURE;

    constructor(public payload: any) { }
}

export type Actions
    = SuggestionResponse | SuggestionSuccess | SuggestionFail;
