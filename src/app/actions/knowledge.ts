import { Action } from '@ngrx/store';
import { type } from '../utils';
export const ActionTypes = {
  CONTENT_CHANGE: type('[Knowledge] Content Change'),
  IMAGE_CHANGE: type('[Knowledge] Image Change')
};
export class SearchContentAction implements Action {
  type = ActionTypes.CONTENT_CHANGE;
  constructor(public payload: object) {}
}
export class SearchImageAction implements Action {
  type = ActionTypes.IMAGE_CHANGE;
  constructor(public payload: object) {}
}

export type Actions
  = SearchContentAction | SearchImageAction ;
