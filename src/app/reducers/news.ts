import { compose } from '@ngrx/core';
import { combineReducers } from '@ngrx/store';
import { ActionReducer, Action } from '@ngrx/store';
import { createSelector } from 'reselect';
import * as news from '../actions/news';

export const NEWS_CHANGE = 'NEWS_CHANGE';

export interface State {
  news_response: any
}

const initialState: State = {
  news_response: {}
};
export function reducer(state: State = initialState, action: news.Actions): State {
  switch (action.type) {
    case news.ActionTypes.NEWS_CHANGE: {
      const news_response = action.payload;
      return Object.assign({}, state, {
        news_response: news_response
      });
    }

    default: {
      return state;
    }
  }
}
export const getNewsResponse = (state: State) => state.news_response;
