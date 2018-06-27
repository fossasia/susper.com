import { Action } from '@ngrx/store';
import { type } from '../utils';

export const ActionTypes = {
	NEWS_SEARCH: type('[NEWS] News Search')
};

export class NewsSearchAction implements Action {
	type = ActionTypes.NEWS_SEARCH;
	constructor (public payload: any) { }
}

export type Actions
	= NewsSearchAction;