import { Action } from '@ngrx/store';
import { type } from '../utils';

export const ActionTypes = {
  QUERYCHANGE: type('[Query] Change'),
  QUERYSERVER: type('[Query] Server'),
};

export class QueryAction implements Action {
  type = ActionTypes.QUERYCHANGE;
  constructor(public payload: any) {}
}

export class QueryServerAction implements Action {
  type = ActionTypes.QUERYSERVER;
  constructor(public payload: any) {}
}

export type Actions
  = QueryAction|QueryServerAction ;
