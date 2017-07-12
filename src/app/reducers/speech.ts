import { compose } from '@ngrx/core';
import { combineReducers } from '@ngrx/store';
import { ActionReducer, Action } from '@ngrx/store';
import { createSelector } from 'reselect';
import * as speech from '../actions/speech';
export const CHANGE = 'CHANGE';
export interface State {
  speechmode: boolean;
}
/**
 * There is always a need of initial state to be passed onto the store.
 *
 * @prop: query: ''
 * @prop: loading: false
 */
const initialState: State = {
  speechmode: false
};
export function reducer(state: State = initialState, action: speech.Actions): State {
  switch (action.type) {
    case speech.ActionTypes.CHANGE: {
      const response = action.payload;
      return Object.assign({}, state, {
        speechmode: response,
      });
    }
    default: {
      return state;
    }
  }
}
export const getspeechmode = (state: State) => state.speechmode;
