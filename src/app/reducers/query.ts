import { compose } from '@ngrx/core';
import { combineReducers } from '@ngrx/store';
import { ActionReducer, Action } from '@ngrx/store';
import { createSelector } from 'reselect';
import * as query from '../actions/query';
export const CHANGE = 'CHANGE';
export interface State {
  query: string;
  wholequery: any;
}
/**
 * There is always a need of initial state to be passed onto the store.
 *
 * @prop: query: ''
 * @prop: loading: false
 */
const initialState: State = {
  query: '',
  wholequery: {
    query: '',
    rows: 10,
    start: 0,
    mode: 'text'
  },
};
export function reducer(state: State = initialState, action: query.Actions): State {
  switch (action.type) {
    case query.ActionTypes.QUERYCHANGE: {
      const query = action.payload;

      return Object.assign({}, state, {
        query: query,
        wholequery: state.wholequery
      });
    }
    case query.ActionTypes.QUERYSERVER: {
      const query = action.payload;

      return Object.assign({}, state, {
        wholequery: query,
        query: state.query

      });
    }
    default: {
      return state;
    }
  }
}
export const getpresentquery = (state: State) => state.query;
export const getpresentwholequery = (state: State) => state.wholequery;
