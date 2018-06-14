import { compose } from '@ngrx/core';
import { combineReducers } from '@ngrx/store';
import { ActionReducer, Action } from '@ngrx/store';
import { createSelector } from 'reselect';
import * as knowledge from '../actions/knowledge';

export const CONTENT_CHANGE = 'CONTENT_CHANGE';
export const IMAGE_CHANGE = 'IMAGE_CHANGE';

export interface State {
  content_response: any,
  image_response: any
}

const initialState: State = {
  content_response: {},
  image_response: {}
};
export function reducer(state: State = initialState, action: knowledge.Actions): State {
  switch (action.type) {
    case knowledge.ActionTypes.CONTENT_CHANGE: {
      const content_response = action.payload;
      return Object.assign({}, state, {
        content_response: content_response,
        image_response: state.image_response
      });
    }
    case knowledge.ActionTypes.IMAGE_CHANGE: {
      const image_response = action.payload;
      return Object.assign({}, state, {
        content_response: state.content_response,
        image_response: image_response
      });
    }
    default: {
      return state;
    }
  }
}
export const getContentResponse = (state: State) => state.content_response;
export const getImageResponse = (state: State) => state.image_response;
