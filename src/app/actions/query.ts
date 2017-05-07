import { Action } from '@ngrx/store';
import { type } from '../utils';
export const ActionTypes = {
  QUERYCHANGE: type('[Query] Change'),

};
export class QueryAction implements Action {
  type = ActionTypes.QUERYCHANGE;
  constructor(public payload: any) {}
}
export type Actions
  = QueryAction ;
