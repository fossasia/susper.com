import { Action } from '@ngrx/store';
import { type } from '../utils';

export const ActionTypes = {
  CHANGE: type('[Search] Change'),
  ITEMS: type('[Search] Items'),
  TOTALRESULTS: type('[Search] Totalresults'),
  NAVIGATION: type('[Search] Navigation'),
};

export class SearchAction implements Action {
  type = ActionTypes.CHANGE;
  constructor(public payload: any) {}
}

export class ItemsAction implements Action {
  type = ActionTypes.ITEMS;
  constructor(public payload: any) {}
}

export class TotalResultsAction implements Action {
  type = ActionTypes.TOTALRESULTS;
  constructor(public payload: any) {}
}

export class NavigationAction implements Action {
  type = ActionTypes.NAVIGATION;
  constructor(public payload: any) {}
}

export type Actions
  = SearchAction | ItemsAction | TotalResultsAction | NavigationAction ;
