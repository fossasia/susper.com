import { compose } from '@ngrx/core';
import { combineReducers } from '@ngrx/store';
import { ActionReducer, Action } from '@ngrx/store';
import { createSelector } from 'reselect';
import * as query from '../actions/query';
export const CHANGE = 'CHANGE';
export interface State {
  query: string;
}
/**
 * There is always a need of initial state to be passed onto the store.
 *
 * @prop: query: ''
 * @prop: loading: false
 */
const initialState: State = {
  query: '',
};
export function reducer(state: State = initialState, action: query.Actions): State {
  switch (action.type) {
    case query.ActionTypes.QUERYCHANGE: {
      const query = action.payload;

      return Object.assign({}, state, {
        query: query,

      });
    }
    default: {
      return state;
    }
  }
}
export const getpresentquery = (state: State) => state.query;
