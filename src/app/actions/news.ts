import { Action } from '@ngrx/store';
import { type } from '../utils';
export const ActionTypes = {
  NEWS_CHANGE: type('[News] News Change')
};
export class NewsSearchAction implements Action {
  type = ActionTypes.NEWS_CHANGE;
  constructor(public payload: object) {}
}


export type Actions
  = NewsSearchAction
